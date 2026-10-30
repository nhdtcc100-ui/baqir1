import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middleware/validate.middleware';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { InvoiceService } from './invoice.service';
import { sendSuccess, sendCreated, sendError } from '../../utils/response';

const router = Router();
router.use(authenticateToken);

// ── Validation Schemas ────────────────────────────────────────────────────────
const createInvoiceSchema = z.object({
  pharmacy_id: z.string().min(1, 'معرف الصيدلية مطلوب'),
  invoice_number: z.string().max(100).optional(),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تنسيق التاريخ: YYYY-MM-DD').optional(),
  image_url: z.string().url('رابط الصورة غير صالح'),
  is_synced_offline: z.boolean().optional(),
  items: z.array(z.object({
    product_id: z.string().min(1, 'معرف المنتج مطلوب'),
    sold_quantity: z.number().int().positive('الكمية يجب أن تكون أكبر من صفر'),
    ocr_confidence: z.number().min(0).max(1).optional()
  })).min(1, 'يجب أن تحتوي الفاتورة على منتج واحد على الأقل')
});

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejection_reason: z.string().max(500).optional()
});

/**
 * @route   GET /api/v1/invoices
 * @access  All authenticated (reps see only their own)
 * @query   pharmacy_id?, status?, from?, to?, rep_id? (admin/supervisor only)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, userId } = req.user!;
    const repId = role === 'medical_rep' ? userId : req.query.rep_id as string | undefined;

    const data = await InvoiceService.findAll({
      repId,
      pharmacyId: req.query.pharmacy_id as string | undefined,
      status: req.query.status as any,
      from: req.query.from as string | undefined,
      to:   req.query.to   as string | undefined
    });
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

/**
 * @route   GET /api/v1/invoices/:id
 * @access  All authenticated (business rule: rep can only view their own)
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await InvoiceService.findById(req.params.id);
    // Security: مندوب يرى فقط فواتيره الخاصة
    if (req.user!.role === 'medical_rep' && invoice.rep_id !== req.user!.userId) {
      sendError(res, 'غير مصرح لك بعرض هذه الفاتورة', 403);
      return;
    }
    sendSuccess(res, invoice);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/invoices
 * @access  medical_rep, admin
 * @body    { pharmacy_id, invoice_number?, invoice_date?, image_url, items[] }
 */
router.post('/',
  requireRoles(['medical_rep', 'admin']),
  validateRequest(createInvoiceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repId = req.user!.userId;
      const invoice = await InvoiceService.create(repId, req.body);
      sendCreated(res, invoice, 'تم رفع الفاتورة بنجاح وهي في انتظار المراجعة');
    } catch (e) { next(e); }
  }
);

/**
 * @route   PUT /api/v1/invoices/:id/review
 * @access  admin, supervisor
 * @body    { status: 'approved' | 'rejected', rejection_reason? }
 */
router.put('/:id/review',
  requireRoles(['admin', 'supervisor']),
  validateRequest(reviewSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, rejection_reason } = req.body;
      const invoice = await InvoiceService.review(req.params.id, status, rejection_reason);
      sendSuccess(res, invoice, status === 'approved' ? 'تم اعتماد الفاتورة بنجاح' : 'تم رفض الفاتورة');
    } catch (e) { next(e); }
  }
);

export default router;
