import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { validateRequest } from '../../middleware/validate.middleware';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { InvoiceService } from './invoice.service';
import { PharmacyService } from '../pharmacies/pharmacy.service';
import { ProductService } from '../products/product.service';
import { detectDosageForm, detectAreaFromName } from './geminiVisionOcr';
import { runInvoiceOcrPipeline } from './ocrPipeline';
import { GoogleSheetsService } from '../google-sheets/googleSheets.service';
import { sendSuccess, sendCreated, sendError } from '../../utils/response';

const router = Router();
router.use(authenticateToken);

// ── Multer Storage Setup ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../../uploads/invoices');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `invoice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype.startsWith('image/') ||
                file.mimetype === 'application/pdf' ||
                file.mimetype === 'application/octet-stream' ||
                /\.(jpg|jpeg|png|webp|jfif|bmp|gif|pdf|heic|heif)$/i.test(file.originalname);
    ok ? cb(null, true) : cb(new Error('صيغة الملف غير مدعومة. يُرجى رفع صورة أو PDF'));
  }
});

/**
 * تحقق أمان على السيرفر من البايتات الأولى للملف (Magic Bytes) — لا نثق بما يرسله الموبايل فقط
 */
export function verifyMagicBytesOnServer(filePath: string): { valid: boolean; kind: string } {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buf = Buffer.alloc(16);
    const read = fs.readSync(fd, buf, 0, 16, 0);
    if (read < 4) return { valid: false, kind: 'empty' };

    if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return { valid: true, kind: 'pdf' };
    if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return { valid: true, kind: 'jpeg' };
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return { valid: true, kind: 'png' };
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return { valid: true, kind: 'gif' };
    if (buf[0] === 0x42 && buf[1] === 0x4D) return { valid: true, kind: 'bmp' };
    if (read >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return { valid: true, kind: 'webp' };
    if (read >= 12 && buf.toString('ascii', 4, 8) === 'ftyp') {
      const brand = buf.toString('ascii', 8, 12).toLowerCase();
      if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heis', 'avif'].includes(brand)) {
        return { valid: true, kind: 'heic' };
      }
    }
    return { valid: false, kind: 'unknown' };
  } finally {
    fs.closeSync(fd);
  }
}

interface OcrJobState {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  userId: string;
  result?: any;
  error?: string;
  createdAt: number;
}
const ocrJobs = new Map<string, OcrJobState>();

/** سياسة تنظيف الصور والمهام القديمة للخصوصية (> 24 ساعة) */
function cleanupExpiredUploadsAndJobs() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, job] of ocrJobs.entries()) {
    if (job.createdAt < cutoff) ocrJobs.delete(id);
  }
  const uploadDir = path.join(__dirname, '../../../uploads/invoices');
  if (fs.existsSync(uploadDir)) {
    try {
      for (const name of fs.readdirSync(uploadDir)) {
        if (!name.startsWith('invoice_')) continue;
        const p = path.join(uploadDir, name);
        const stat = fs.statSync(p);
        if (stat.isFile() && stat.mtimeMs < cutoff) {
          fs.unlinkSync(p);
        }
      }
    } catch { /* ignore cleanup warning */ }
  }
}

// ── Validation Schemas ────────────────────────────────────────────────────────
const createInvoiceSchema = z.object({
  pharmacy_id: z.string().optional(),
  pharmacy_name: z.string().optional(),
  pharmacy_area: z.string().optional(),
  invoice_number: z.string().max(100).optional(),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تنسيق التاريخ: YYYY-MM-DD').optional(),
  image_url: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_synced_offline: z.boolean().optional(),
  force_save: z.boolean().optional(),
  items: z.array(z.object({
    product_id: z.string().optional(),
    sold_quantity: z.number().int().positive('الكمية يجب أن تكون أكبر من صفر'),
    custom_product_name: z.string().optional(),
    custom_unit_price: z.number().optional(),
    custom_bonus: z.number().int().min(0).optional(),
    dosage_form: z.string().optional(),
    ocr_confidence: z.number().min(0).max(1).optional()
  })).min(1, 'يجب أن تحتوي الفاتورة على منتج واحد على الأقل')
});

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejection_reason: z.string().max(500).optional()
});

const updateInvoiceSchema = z.object({
  pharmacy_id: z.string().min(1).optional(),
  pharmacy_name: z.string().optional(),
  pharmacy_area: z.string().optional(),
  invoice_number: z.string().max(100).optional(),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  image_url: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(z.object({
    product_id: z.string().optional(),
    sold_quantity: z.number().int().positive(),
    custom_product_name: z.string().optional(),
    custom_unit_price: z.number().optional(),
    custom_bonus: z.number().int().min(0).optional(),
    dosage_form: z.string().optional(),
    ocr_confidence: z.number().min(0).max(1).optional()
  })).optional()
});

// ─────────────────────────────────────────────────────────────────────────────
//  Helper — match pharmacy from a name string
// ─────────────────────────────────────────────────────────────────────────────
function cleanPharmacyName(name: string): string {
  return (name || '').toLowerCase()
    .replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/i, '')
    .replace(/[/\-_,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchPharmacy(name: string, pharmacies: any[]): any | null {
  if (!name) return null;
  const cleanTarget = cleanPharmacyName(name);
  if (cleanTarget.length < 3) return null;

  // 1. Exact match on clean name
  const exact = pharmacies.find(p => cleanPharmacyName(p.name) === cleanTarget);
  if (exact) return exact;

  // 2. Distinctive words (never match common words like 'صيدلية' or generic terms)
  const stopWords = new Set(['صيدلية', 'مذخر', 'ص', 'بغداد', 'الجديدة', 'حي', 'شارع', 'سوق', 'مجمع', 'منطقة']);
  const targetWords = cleanTarget.split(' ').filter(w => w.length >= 3 && !stopWords.has(w));
  if (targetWords.length === 0) return null;

  return pharmacies.find(p => {
    const pClean = cleanPharmacyName(p.name);
    const pWords = pClean.split(' ').filter(w => w.length >= 3 && !stopWords.has(w));
    if (pWords.length === 0) return false;

    // Must match at least one strong distinctive keyword
    const matchCount = targetWords.filter(tw => pWords.some(pw => pw === tw || (pw.length >= 5 && pw.includes(tw)) || (tw.length >= 5 && tw.includes(pw)))).length;
    return matchCount >= Math.min(2, targetWords.length);
  }) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Helper — match product from a name string
// ─────────────────────────────────────────────────────────────────────────────
function matchProduct(name: string, products: any[]): any {
  if (!name) return products[0];
  const clean = name.toLowerCase().replace(/\s+/g, '');
  return products.find(p => {
    const pc = p.name.toLowerCase().replace(/\s+/g, '');
    return clean.includes(pc.slice(0, 5)) || pc.includes(clean.slice(0, 5));
  }) || products[0];
}

/**
 * Helper: دالة موحدة لمعالجة وقراءة أي صورة فاتورة عبر خط المعالجة المرن (ocrPipeline)
 */
async function processInvoiceFile(file: Express.Multer.File, userId: string, customGeminiKey?: string) {
  const fileUrl = `http://localhost:5000/uploads/invoices/${file.filename}`;
  const isPdf = file.mimetype === 'application/pdf';

  const pharmacies = await PharmacyService.findAll();
  const products = await ProductService.findAll(true);

  const pipelineResult = await runInvoiceOcrPipeline(file.path, {
    originalName: file.originalname,
    mimeType: file.mimetype,
    customGeminiKey,
    pharmacies,
    products
  });

  // مطابقة الصيدلية أو تسجيلها ديناميكياً عند قراءة اسم جديد موثوق
  let pharmacy: any = pipelineResult.matched_pharmacy_id
    ? pharmacies.find(p => p.id === pipelineResult.matched_pharmacy_id) || null
    : matchPharmacy(pipelineResult.pharmacy_name, pharmacies);

  const distinctPhName = cleanPharmacyName(pipelineResult.pharmacy_name || '');
  if (!pharmacy && pipelineResult.ocr_engine === 'gemini_vision' && distinctPhName.length >= 2) {
    try {
      const fullName = pipelineResult.pharmacy_name.startsWith('ص')
        ? pipelineResult.pharmacy_name
        : `صيدلية ${pipelineResult.pharmacy_name}`;
      pharmacy = await PharmacyService.create({
        name: fullName,
        city: 'بغداد',
        address: pipelineResult.pharmacy_area || 'بغداد',
        phone: '07700000000',
        assigned_rep_id: userId
      });
      pharmacies.push(pharmacy);
    } catch (err: any) {
      console.warn('Could not auto-register pharmacy:', err.message);
    }
  } else if (!pharmacy && pipelineResult.pharmacy_name) {
    pharmacy = pharmacies.find(p => p.name.includes(pipelineResult.pharmacy_name)) || { id: '', name: pipelineResult.pharmacy_name };
  }

  // ربط الأصناف المستخرجة بكتالوج المنتجات
  const extractedItems: any[] = [];
  for (const it of pipelineResult.raw_items) {
    let prod = it.product_id ? products.find(p => p.id === it.product_id) : matchProduct(it.product_name, products);
    if (!prod && it.product_name && pipelineResult.ocr_engine === 'gemini_vision') {
      try {
        prod = await ProductService.create({
          name: it.product_name,
          product_type: it.product_name.toLowerCase().includes('cream') ? 'cream' : (it.product_name.toLowerCase().includes('drop') ? 'drop' : 'other'),
          base_price: it.unit_price || 5000,
          is_active: true
        });
        products.push(prod);
      } catch {
        prod = products[0];
      }
    }
    const qty = it.quantity || 10;
    const price = it.unit_price || (prod ? Number(prod.base_price) : 0);
    const bonus = it.bonus_quantity !== undefined && it.bonus_quantity > 0 ? it.bonus_quantity : Math.floor(qty / 10);
    extractedItems.push({
      product_id: prod ? prod.id : '',
      product_name: it.product_name || (prod ? prod.name : ''),
      dosage_form: it.dosage_form || detectDosageForm(it.product_name),
      quantity: qty,
      unit_price: price,
      bonus_quantity: bonus,
      line_total: it.line_total || qty * price
    });
  }

  const pharmacyArea = pipelineResult.pharmacy_area ||
    (pharmacy?.name ? (detectAreaFromName(pharmacy.name) || detectAreaFromName((pharmacy as any).address || '')) : '');

  const totalAmount = extractedItems.reduce((s, i) => s + i.line_total, 0);

  return {
    invoice_number:       pipelineResult.invoice_number,
    invoice_date:         pipelineResult.invoice_date,
    pharmacy_id:          pharmacy?.id || '',
    pharmacy_name:        pharmacy?.name || '',
    pharmacy_area:        pharmacyArea,
    file_name:            file.originalname,
    file_type:            isPdf ? 'pdf' : 'image',
    image_url:            fileUrl,
    confidence:           pipelineResult.confidence,
    ocr_engine:           pipelineResult.ocr_engine,
    needs_review:         pipelineResult.needsReview,
    needs_review_reason:  pipelineResult.needsReviewReason,
    cached:               pipelineResult.cached,
    circuit_breaker_open: pipelineResult.circuitBreakerOpen,
    ocr_error:            pipelineResult.geminiError,
    raw_text:             pipelineResult.recognized_text,
    extracted_items:      extractedItems,
    total_amount:         totalAmount
  };
}

/** تحقق موحّد مع حذف الملف المرفوض فوراً */
function validateUploadedFileMagicOrThrow(file: Express.Multer.File) {
  const magic = verifyMagicBytesOnServer(file.path);
  if (!magic.valid) {
    try { fs.unlinkSync(file.path); } catch {}
    throw { statusCode: 400, message: 'محتوى الملف لا يطابق صورة صالحة أو PDF حقيقي.' };
  }
  return magic;
}

/**
 * @route   POST /api/v1/invoices/ocr
 * @access  medical_rep, admin
 * @desc    Upload single invoice image and extract structured data
 */
router.post('/ocr',
  requireRoles(['medical_rep', 'admin']),
  upload.single('invoice_file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) { sendError(res, 'لم يتم إرسال أي ملف للمسح الضوئي', 400); return; }
      validateUploadedFileMagicOrThrow(req.file);
      const result = await processInvoiceFile(req.file, req.user!.userId, req.user?.geminiApiKey);
      cleanupExpiredUploadsAndJobs();
      sendSuccess(res, result, 'تمت قراءة وتحليل بيانات الفاتورة بنجاح');
    } catch (e) { next(e); }
  }
);

/**
 * @route   POST /api/v1/invoices/ocr-async
 * @access  medical_rep, admin
 * @desc    رفع الصورة وتشغيل التحليل في الخلفية وإعادة jobId فوراً (يمنع timeout على الشبكات البطيئة)
 */
router.post('/ocr-async',
  requireRoles(['medical_rep', 'admin']),
  upload.single('invoice_file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) { sendError(res, 'لم يتم إرسال أي ملف للمسح الضوئي', 400); return; }
      validateUploadedFileMagicOrThrow(req.file);
      const jobId = crypto.randomUUID();
      const uploadedFile = req.file;
      const userId = req.user!.userId;
      const customKey = req.user?.geminiApiKey;

      ocrJobs.set(jobId, {
        status: 'queued',
        progress: 65,
        message: 'تم استلام الملف، جاري التحليل في الخلفية...',
        userId,
        createdAt: Date.now()
      });

      setImmediate(async () => {
        const job = ocrJobs.get(jobId);
        if (!job) return;
        job.status = 'processing';
        job.progress = 78;
        try {
          const result = await processInvoiceFile(uploadedFile, userId, customKey);
          job.status = 'completed';
          job.progress = 100;
          job.message = 'اكتملت قراءة الفاتورة';
          job.result = result;
        } catch (err: any) {
          job.status = 'failed';
          job.error = err?.message || 'فشل تحليل الفاتورة';
        }
      });

      cleanupExpiredUploadsAndJobs();
      res.status(202).json({
        success: true,
        data: { jobId, status: 'queued' },
        message: 'تم رفع الصورة بنجاح وبدأ التحليل في الخلفية'
      });
    } catch (e) { next(e); }
  }
);

/**
 * @route   GET /api/v1/invoices/ocr-status/:jobId
 * @access  medical_rep, admin
 */
router.get('/ocr-status/:jobId',
  requireRoles(['medical_rep', 'admin']),
  (req: Request, res: Response) => {
    const job = ocrJobs.get(req.params.jobId);
    if (!job || job.userId !== req.user!.userId) {
      sendError(res, 'لم يتم العثور على وظيفة التحليل المطلوبة', 404);
      return;
    }
    sendSuccess(res, job);
  }
);

/**
 * @route   POST /api/v1/invoices/ocr-batch
 * @access  medical_rep, admin
 * @desc    رفع وقراءة مجموعة صور فواتير دفعة واحدة (حتى 20 صورة)
 */
router.post('/ocr-batch',
  requireRoles(['medical_rep', 'admin']),
  upload.array('invoice_files', 20),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      if (files.length === 0) {
        sendError(res, 'لم يتم إرسال أي ملفات للمسح الضوئي', 400);
        return;
      }

      console.log(`📸 Starting batch OCR for ${files.length} invoice files (user key: ${req.user?.geminiApiKey ? 'Custom User Key' : 'System Default'})...`);
      const results: any[] = [];
      let successCount = 0;

      for (const file of files) {
        try {
          validateUploadedFileMagicOrThrow(file);
          const resSingle = await processInvoiceFile(file, req.user!.userId, req.user?.geminiApiKey);
          results.push(resSingle);
          if (resSingle.extracted_items.length > 0) successCount++;
        } catch (fileErr: any) {
          console.warn(`Error processing file ${file.originalname}:`, fileErr.message);
          results.push({
            file_name: file.originalname,
            error: fileErr.message,
            extracted_items: [],
            confidence: 0
          });
        }
      }

      sendSuccess(res, {
        results,
        total: files.length,
        successful: successCount
      }, `تمت قراءة وتحليل ${successCount} من أصل ${files.length} فواتير بنجاح`);
    } catch (e) { next(e); }
  }
);

/**
 * @route   POST /api/v1/invoices/batch
 * @access  medical_rep, admin
 * @desc    حفظ مصفوفة فواتير دفعة واحدة ومزامنتها تلقائياً مع كوكل شيت
 */
router.post('/batch',
  requireRoles(['medical_rep', 'admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repId = req.user!.userId;
      const invoicesList = req.body.invoices;
      if (!Array.isArray(invoicesList) || invoicesList.length === 0) {
        sendError(res, 'يجب إرسال قائمة من الفواتير', 400);
        return;
      }

      const created: any[] = [];
      for (const invData of invoicesList) {
        let { pharmacy_id, pharmacy_name, pharmacy_area, ...rest } = invData;
        const distinctPh = cleanPharmacyName(pharmacy_name || '');
        if (!pharmacy_id && pharmacy_name && distinctPh.length >= 2) {
          let ph = await PharmacyService.findByName(pharmacy_name);
          if (!ph) {
            try {
              ph = await PharmacyService.create({
                name: pharmacy_name.startsWith('ص') ? pharmacy_name : `صيدلية ${pharmacy_name}`,
                city: 'بغداد',
                address: pharmacy_area || 'بغداد',
                assigned_rep_id: repId
              });
            } catch (err: any) {}
          }
          if (ph) pharmacy_id = ph.id;
        }

        if (!pharmacy_id) {
          const all = await PharmacyService.findAll();
          if (all.length > 0) {
            pharmacy_id = all[0].id;
          } else {
            const ph = await PharmacyService.create({
              name: distinctPh.length >= 2 ? (pharmacy_name!.startsWith('ص') ? pharmacy_name! : `صيدلية ${pharmacy_name}`) : 'صيدلية النور النموذجية',
              city: 'بغداد',
              address: pharmacy_area || 'بغداد',
              assigned_rep_id: repId
            });
            pharmacy_id = ph.id;
          }
        }

        const invoice = await InvoiceService.create(repId, { pharmacy_id, pharmacy_area, ...rest }, req.user?.fullName);
        created.push(invoice);
      }

      // مزامنة الدفعة كاملة مع كوكل شيت (الشيت الخاص بالمستخدم إن وجد أو العام)
      GoogleSheetsService.syncBatchInvoices(created, req.user?.webhookUrl, req.user?.sheetId).catch(err => {
        console.warn('Batch Google Sheets sync warning:', err.message);
      });

      sendCreated(res, {
        count: created.length,
        invoices: created
      }, `تم حفظ ومزامنة ${created.length} فواتير بنجاح في قاعدة البيانات وكوكل شيت`);
    } catch (e) { next(e); }
  }
);

/**
 * @route   GET /api/v1/invoices
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, userId } = req.user!;
    const repId = role === 'medical_rep' ? userId : req.query.rep_id as string | undefined;
    const data = await InvoiceService.findAll({
      repId,
      pharmacyId: req.query.pharmacy_id as string | undefined,
      status:     req.query.status as any,
      from:       req.query.from as string | undefined,
      to:         req.query.to   as string | undefined
    });
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

/**
 * @route   GET /api/v1/invoices/:id
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await InvoiceService.findById(req.params.id);
    if (req.user!.role === 'medical_rep' && invoice.rep_id !== req.user!.userId) {
      sendError(res, 'غير مصرح لك بعرض هذه الفاتورة', 403); return;
    }
    sendSuccess(res, invoice);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/invoices
 */
router.post('/',
  requireRoles(['medical_rep', 'admin']),
  validateRequest(createInvoiceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repId = req.user!.userId;
      let { pharmacy_id, pharmacy_name, pharmacy_area, ...rest } = req.body;
      const distinctPh = cleanPharmacyName(pharmacy_name || '');

      // رفض الاسم العام وحده (مثل 'صيدلية' بدون اسم مميز)
      if (!pharmacy_id && pharmacy_name && distinctPh.length < 2) {
        sendError(res, 'يرجى كتابة الاسم الكامل والمميز للصيدلية (مثل: صيدلية النور النموذجية). لا يمكن قبول "صيدلية" وحدها دون اسم مميز.', 400);
        return;
      }
      // رفض حالة عدم وجود اسم صيدلية ولا ID
      if (!pharmacy_id && !pharmacy_name) {
        sendError(res, 'يرجى تحديد الصيدلية المستهدفة للفاتورة.', 400);
        return;
      }

      // Always honor an explicitly typed pharmacy_name rather than letting a stale pharmacy_id override it
      const typedPhName = (pharmacy_name || '').trim();
      if (typedPhName) {
        if (pharmacy_id) {
          try {
            const byId = await PharmacyService.findById(pharmacy_id);
            if (!byId || cleanPharmacyName(byId.name) !== distinctPh) {
              pharmacy_id = undefined;
            }
          } catch {
            pharmacy_id = undefined;
          }
        }
        if (!pharmacy_id) {
          let ph = await PharmacyService.findByName(typedPhName);
          if (!ph) {
            try {
              ph = await PharmacyService.create({
                name: typedPhName,
                city: 'بغداد',
                address: pharmacy_area || 'بغداد',
                assigned_rep_id: repId
              });
            } catch (err: any) {}
          }
          if (ph) pharmacy_id = ph.id;
        }
      }

      if (!pharmacy_id) {
        const all = await PharmacyService.findAll();
        if (typedPhName && distinctPh.length >= 2) {
          const ph = await PharmacyService.create({
            name: typedPhName,
            city: 'بغداد',
            address: pharmacy_area || 'بغداد',
            assigned_rep_id: repId
          });
          pharmacy_id = ph.id;
        } else if (all.length > 0) {
          pharmacy_id = all[0].id;
        }
      }

      // ── فحص الفاتورة المكررة: نفس الصيدلية + نفس التاريخ + نفس كامل الأصناف والكميات ──
      if (!req.body.force_save) {
        const allInvs = await InvoiceService.findAll({});
        const incomingItems: Array<{ product_id?: string; custom_product_name?: string; sold_quantity: number }> = rest.items || [];

        // دالة مساعدة: هل مجموعتا الأصناف متطابقتان تماماً؟
        const areItemsIdentical = (a: typeof incomingItems, b: any[]): boolean => {
          if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || a.length === 0) return false;
          const normalize = (it: any) => ({
            name: String(it.custom_product_name || it.product_name_snapshot || it.custom_name || it.name || it.product_id || '').trim().toLowerCase(),
            qty: Number(it.sold_quantity || it.quantity || 0)
          });
          const sortedA = [...a].map(normalize).sort((x, y) => x.name.localeCompare(y.name));
          const sortedB = [...b].map(normalize).sort((x, y) => x.name.localeCompare(y.name));
          return sortedA.every((ia, idx) => ia.name === sortedB[idx].name && ia.qty === sortedB[idx].qty);
        };

        const incomingDateStr = String(rest.invoice_date || '').split('T')[0];
        const cleanIncomingPhId = String(pharmacy_id || '').trim();

        const dup = allInvs.find(inv => {
          const existingDateStr = String(inv.invoice_date || '').split('T')[0];
          const sameDate = incomingDateStr && existingDateStr === incomingDateStr;
          const samePharmacy = cleanIncomingPhId && String(inv.pharmacy_id || '').trim() === cleanIncomingPhId;
          if (!sameDate || !samePharmacy) return false;
          const existingItems = inv.items || [];
          return areItemsIdentical(incomingItems, existingItems);
        });

        if (dup) {
          sendError(res,
            `⚠️ يوجد فاتورة مكررة لنفس الصيدلية (${dup.pharmacy_name || 'الصيدلية'}) بتاريخ (${incomingDateStr}) بنفس الأصناف والكميات! اضغط "حفظ" مرة أخرى لتأكيد الحفظ رغم ذلك.`,
            409
          );
          return;
        }
      }

      const invoice = await InvoiceService.create(repId, { pharmacy_id, pharmacy_area, ...rest }, req.user?.fullName);

      // مزامنة تلقائية مع كوكل شيت فور الحفظ (شيت المستخدم أو العام)
      GoogleSheetsService.appendInvoice(invoice, req.user?.webhookUrl, req.user?.sheetId).catch(err => {
        console.warn('Google Sheets auto-sync warning:', err.message);
      });

      sendCreated(res, invoice, 'تم حفظ الفاتورة بنجاح ومزامنتها مع كوكل شيت');
    } catch (e) { next(e); }
  }
);

/**
 * @route   PUT /api/v1/invoices/:id/review
 */
router.put('/:id/review',
  requireRoles(['admin', 'supervisor']),
  validateRequest(reviewSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, rejection_reason } = req.body;
      const invoice = await InvoiceService.review(req.params.id, status, rejection_reason);
      GoogleSheetsService.replaceInvoice(invoice, invoice.invoice_number, req.user?.webhookUrl, req.user?.sheetId).catch(e => {
        console.warn('[GoogleSheets] Review sync err:', e?.message || e);
      });
      sendSuccess(res, invoice, status === 'approved' ? 'تم اعتماد الفاتورة بنجاح ومزامنتها' : 'تم رفض الفاتورة');
    } catch (e) { next(e); }
  }
);

/**
 * @route   PUT /api/v1/invoices/:id
 */
router.put('/:id',
  validateRequest(updateInvoiceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoice = await InvoiceService.findById(req.params.id);
      const { role, userId } = req.user!;
      if (role === 'medical_rep') {
        if (invoice.rep_id !== userId)           { sendError(res, 'غير مصرح لك بتعديل هذه الفاتورة', 403); return; }
        if (invoice.status !== 'pending_review') { sendError(res, 'لا يمكن تعديل الفاتورة بعد اعتمادها أو رفضها', 400); return; }
      }
      const { pharmacy_name: editPhName, pharmacy_area: editPhArea, ...restBody } = req.body;
      let resolvedPhId = restBody.pharmacy_id;
      if (editPhName && String(editPhName).trim().length >= 2) {
        const cleanEditName = String(editPhName).trim();
        let matched = await PharmacyService.findByName(cleanEditName);
        if (!matched || matched.name.trim().toLowerCase() !== cleanEditName.toLowerCase()) {
          try {
            matched = await PharmacyService.create({
              name: cleanEditName,
              city: 'بغداد',
              address: editPhArea || 'بغداد',
              assigned_rep_id: userId
            });
          } catch { /* ignore */ }
        }
        if (matched) resolvedPhId = matched.id;
      }
      const updated = await InvoiceService.update(req.params.id, {
        ...restBody,
        ...(resolvedPhId ? { pharmacy_id: resolvedPhId } : {}),
        ...(editPhName ? { pharmacy_name: String(editPhName).trim() } : {}),
        ...(editPhArea !== undefined ? { pharmacy_area: editPhArea } : {})
      });
      // مزامنة الفاتورة المعدلة فوراً مع كوكل شيت (استبدال السطور القديمة بالجديدة)
      GoogleSheetsService.replaceInvoice(updated, invoice.invoice_number, req.user?.webhookUrl, req.user?.sheetId).catch(e => {
        console.error('[GoogleSheets] Update sync err:', e);
      });
      sendSuccess(res, updated, 'تم تعديل بيانات الفاتورة بنجاح ومزامنتها مع كوكل شيت');
    } catch (e) { next(e); }
  }
);

/**
 * @route   DELETE /api/v1/invoices/:id
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await InvoiceService.findById(req.params.id);
    const { role, userId } = req.user!;
    if (role === 'medical_rep') {
      if (invoice.rep_id !== userId)           { sendError(res, 'غير مصرح لك بحذف هذه الفاتورة', 403); return; }
      if (invoice.status !== 'pending_review') { sendError(res, 'لا يمكن حذف الفاتورة بعد اعتمادها أو رفضها', 400); return; }
    }
    await InvoiceService.deleteById(req.params.id);
    if (invoice.invoice_number) {
      GoogleSheetsService.deleteInvoiceRows(invoice.invoice_number, req.user?.webhookUrl, req.user?.sheetId).catch(e => {
        console.warn('[GoogleSheets] Delete sync err:', e?.message || e);
      });
    }
    sendSuccess(res, { id: req.params.id }, 'تم حذف الفاتورة بنجاح');
  } catch (e) { next(e); }
});

export default router;
