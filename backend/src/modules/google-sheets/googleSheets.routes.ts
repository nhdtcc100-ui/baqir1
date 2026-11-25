import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { GoogleSheetsService } from './googleSheets.service';
import { InvoiceService } from '../invoices/invoice.service';
import { PharmacyService } from '../pharmacies/pharmacy.service';
import { sendSuccess, sendError } from '../../utils/response';

const router = Router();
router.use(authenticateToken);

const NO_DATABASE_MSG = 'لا تملك أي قاعدة بيانات (صفحة كوكل شيت) مرتبطة بحسابك في الشيت الرئيسي، ولا يمكنك الدخول إلى شيت الإدارة أو شيت باقر.';

function resolveUserSheetOrReject(req: Request, res: Response): { sheetId: string; webhookUrl?: string } | null {
  const user = req.user;
  if (!user) {
    sendError(res, 'يرجى تسجيل الدخول أولاً', 401);
    return null;
  }
  if (user.role === 'admin') {
    return {
      sheetId: user.sheetId || GoogleSheetsService.getSheetId(),
      webhookUrl: user.webhookUrl || GoogleSheetsService.getWebhookUrl()
    };
  }
  if (!user.sheetId || !String(user.sheetId).trim()) {
    sendError(res, NO_DATABASE_MSG, 403);
    return null;
  }
  return {
    sheetId: String(user.sheetId).trim(),
    webhookUrl: (user.webhookUrl && String(user.webhookUrl).trim()) || GoogleSheetsService.getWebhookUrl()
  };
}

/**
 * @route   GET /api/v1/sheets/data
 * @desc    قراءة البيانات الحية من كوكل شيت لعرضها في الموقع
 */
router.get('/data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scope = resolveUserSheetOrReject(req, res);
    if (!scope) return;
    const data = await GoogleSheetsService.readFromSheet(scope.sheetId, scope.webhookUrl);
    sendSuccess(res, {
      ...data,
      sheet_id: scope.sheetId,
      sheet_url: `https://docs.google.com/spreadsheets/d/${scope.sheetId}/edit?usp=sharing`
    }, 'تم سحب البيانات الحية من كوكل شيت بنجاح');
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/sheets/sync-all
 * @desc    مزامنة جميع الفواتير المسجلة وإرسالها لكوكل شيت بشكل منسق مع سد أي فجوات
 */
router.post('/sync-all',
  requireRoles(['admin', 'medical_rep', 'supervisor']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = resolveUserSheetOrReject(req, res);
      if (!scope) return;
      const { role, userId } = req.user!;
      const repId = role === 'medical_rep' ? userId : undefined;
      const invoices = await InvoiceService.findAll({ repId });

      const result = await GoogleSheetsService.syncBatchInvoices(invoices, scope.webhookUrl || '', scope.sheetId, { skipExistingDuplicates: true });
      sendSuccess(res, result, result.message);
    } catch (e) { next(e); }
  }
);

/**
 * @route   GET /api/v1/sheets/gap-status
 * @desc    فحص الفجوات بين فواتير النظام المسجلة وأسطر كوكل شيت الحالية
 */
router.get('/gap-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scope = resolveUserSheetOrReject(req, res);
    if (!scope) return;
    const { role, userId } = req.user!;
    const repId = role === 'medical_rep' ? userId : undefined;
    const systemInvoices = await InvoiceService.findAll({ repId });
    const sheetData = await GoogleSheetsService.readFromSheet(scope.sheetId, scope.webhookUrl);
    const sheetRows = (sheetData.rows || []).filter(r => {
      const num = String(r.invoice_number || '').trim();
      return num && num !== '123' && r.pharmacy_name;
    });

    const sheetInvoiceNumbers = new Set(
      sheetRows.map(r => String(r.invoice_number || '').trim()).filter(Boolean)
    );
    const systemInvoiceNumbers = new Set(
      systemInvoices.map(i => String(i.invoice_number || '').trim()).filter(Boolean)
    );

    // فواتير النظام غير المرفوعة إلى كوكل شيت (فجوة الصادر — الفواتير ذات الكميات المختلفة تُعدّ جديدة)
    const unuploadedInvoices = systemInvoices.filter(
      inv => !GoogleSheetsService.findSheetDuplicateMatch(inv, sheetRows).isDuplicate
    );

    // فواتير كوكل شيت غير الموجودة في النظام (فجوة الوارد)
    const missingInSystemRows = sheetRows.filter(
      r => !systemInvoiceNumbers.has(String(r.invoice_number || '').trim())
    );
    const missingInSystemCount = new Set(
      missingInSystemRows.map(r => String(r.invoice_number || '').trim())
    ).size;

    sendSuccess(res, {
      system_invoices_count: systemInvoices.length,
      sheet_rows_count: sheetRows.length,
      sheet_unique_invoices_count: sheetInvoiceNumbers.size,
      unuploaded_count: unuploadedInvoices.length,
      unuploaded_invoices: unuploadedInvoices.map(inv => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        invoice_date: inv.invoice_date,
        pharmacy_name: inv.pharmacy_name,
        total_sales_amount: inv.total_sales_amount,
        items_count: inv.items?.length || 0
      })),
      missing_in_system_count: missingInSystemCount,
      has_gap: unuploadedInvoices.length > 0 || missingInSystemCount > 0
    }, 'تم فحص حالة الفجوة والمزامنة بنجاح');
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/sheets/sync-unuploaded
 * @desc    رفع الفواتير غير المرفوعة فقط وسد الفجوة في كوكل شيت فوراً
 */
router.post('/sync-unuploaded',
  requireRoles(['admin', 'medical_rep', 'supervisor']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = resolveUserSheetOrReject(req, res);
      if (!scope) return;
      const { role, userId } = req.user!;
      const repId = role === 'medical_rep' ? userId : undefined;
      const systemInvoices = await InvoiceService.findAll({ repId });
      const sheetData = await GoogleSheetsService.readFromSheet(scope.sheetId, scope.webhookUrl);
      const sheetRows = sheetData.rows || [];

      const unuploaded = systemInvoices.filter(
        inv => !GoogleSheetsService.findSheetDuplicateMatch(inv, sheetRows).isDuplicate
      );

      if (unuploaded.length === 0) {
        sendSuccess(res, {
          success: true,
          synced_count: 0,
          rows_count: 0,
          message: 'كافة فواتير النظام مرفوعة بالفعل في كوكل شيت، لا توجد أي فجوة!'
        }, 'كافة فواتير النظام مرفوعة بالفعل في كوكل شيت، لا توجد أي فجوة!');
        return;
      }

      const result = await GoogleSheetsService.syncBatchInvoices(unuploaded, scope.webhookUrl || '', scope.sheetId, { skipExistingDuplicates: true });
      sendSuccess(res, {
        success: result.success,
        synced_count: result.synced_count ?? unuploaded.length,
        rows_count: result.rows_count,
        skipped_duplicates: result.skipped_duplicates || [],
        message: result.message
      }, result.message);
    } catch (e) { next(e); }
  }
);

/**
 * @route   POST /api/v1/sheets/import-missing
 * @desc    استيراد الفواتير الموجودة في كوكل شيت وغير المسجلة في النظام لسد الفجوة العكسية
 */
router.post('/import-missing',
  requireRoles(['admin', 'supervisor', 'medical_rep']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = resolveUserSheetOrReject(req, res);
      if (!scope) return;
      const sheetData = await GoogleSheetsService.readFromSheet(scope.sheetId, scope.webhookUrl);
      const sheetRows = sheetData.rows || [];
      const allInvs = await InvoiceService.findAll();
      const sysNumbers = new Set(
        allInvs.map(i => String(i.invoice_number || '').trim()).filter(Boolean)
      );

      const groups = new Map<string, typeof sheetRows>();
      for (const r of sheetRows) {
        const num = String(r.invoice_number || '').trim();
        if (!num || num === '123' || !r.pharmacy_name || sysNumbers.has(num)) continue;
        if (!groups.has(num)) groups.set(num, []);
        groups.get(num)!.push(r);
      }

      let importedCount = 0;
      for (const [invNum, rows] of groups) {
        const first = rows[0];
        let ph = await PharmacyService.findByName(first.pharmacy_name);
        if (!ph) {
          ph = await PharmacyService.create({
            name: first.pharmacy_name || 'صيدلية غير محددة',
            city: first.city || 'بغداد',
            address: first.area || 'مركز المدينة'
          });
        }

        const items = rows.map(r => ({
          product_id: 'c0000010-0000-0000-0000-000000000010',
          custom_product_name: r.product_name,
          sold_quantity: Math.max(1, Number(r.quantity) || 1),
          custom_unit_price: Number(r.unit_price) || 0,
          custom_bonus: Number(r.bonus_quantity) || 0
        }));

        await InvoiceService.create(req.user!.userId, {
          pharmacy_id: ph.id,
          pharmacy_area: first.area || ph.address || '',
          invoice_number: invNum,
          invoice_date: (first.invoice_date || new Date().toISOString()).split('T')[0],
          items
        }, first.rep_name || req.user?.fullName);

        importedCount++;
      }

      sendSuccess(res, {
        imported_count: importedCount,
        message: importedCount > 0
          ? `تم استيراد ${importedCount} فواتير جديدة من كوكل شيت إلى النظام بنجاح!`
          : 'لا توجد فواتير مفقودة في النظام، كافة فواتير كوكل شيت مسجلة بالفعل.'
      }, importedCount > 0
        ? `تم استيراد ${importedCount} فواتير جديدة من كوكل شيت إلى النظام بنجاح!`
        : 'لا توجد فواتير مفقودة في النظام، كافة فواتير كوكل شيت مسجلة بالفعل.');
    } catch (e) { next(e); }
  }
);

/**
 * @route   GET /api/v1/sheets/config
 * @desc    جلب إعدادات الرابط وكود التطبيقات الجاهز للنسخ
 */
router.get('/config', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scope = resolveUserSheetOrReject(req, res);
    if (!scope) return;
    sendSuccess(res, {
      sheet_id: scope.sheetId,
      sheet_url: `https://docs.google.com/spreadsheets/d/${scope.sheetId}/edit?usp=sharing`,
      webhook_url: scope.webhookUrl || '',
      is_connected: Boolean(scope.webhookUrl),
      apps_script_code: GoogleSheetsService.getAppsScriptCode(),
      headers: GoogleSheetsService.getDefaultHeaders()
    });
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/sheets/config
 * @desc    حفظ رابط Google Apps Script Webhook
 */
router.post('/config',
  requireRoles(['admin', 'medical_rep']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = resolveUserSheetOrReject(req, res);
      if (!scope) return;
      const { webhook_url } = req.body;
      if (req.user?.role === 'admin') {
        GoogleSheetsService.setWebhookUrl(webhook_url || '');
      }
      sendSuccess(res, {
        webhook_url: req.user?.role === 'admin' ? GoogleSheetsService.getWebhookUrl() : (webhook_url || scope.webhookUrl || ''),
        is_connected: Boolean(req.user?.role === 'admin' ? GoogleSheetsService.getWebhookUrl() : (webhook_url || scope.webhookUrl))
      }, 'تم حفظ إعدادات رابط كوكل شيت بنجاح');
    } catch (e) { next(e); }
  }
);

export default router;

