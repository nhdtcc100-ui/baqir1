import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { AnalyticsService } from './analytics.service';
import { InvoiceService } from '../invoices/invoice.service';
import { sendSuccess, sendError } from '../../utils/response';

const router = Router();
router.use(authenticateToken);

/**
 * @route   GET /api/v1/analytics/kpis
 * @desc    مؤشرات الأداء الرئيسية: مجموع الفواتير، القطع، البونص، الإيرادات
 * @query   rep_id?, from?, to?
 */
router.get('/kpis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, userId } = req.user!;
    const repId = role === 'medical_rep' ? userId : req.query.rep_id as string | undefined;
    const data = await AnalyticsService.getKPIs({
      repId,
      from: req.query.from as string | undefined,
      to:   req.query.to   as string | undefined
    });
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

/**
 * @route   GET /api/v1/analytics/pivot
 * @desc    بيانات الجدول المحوري — القيم تُجمَّع حسب group_by
 * @query   group_by=rep,product_type,month&from=&to=&rep_id=
 */
router.get('/pivot',
  requireRoles(['admin', 'supervisor']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawGroup = (req.query.group_by as string) ?? 'rep,product_type';
      const groupBy  = rawGroup.split(',').map(s => s.trim()).filter(Boolean);
      const validDims = ['rep','pharmacy','product','product_type','month'];
      const invalid = groupBy.filter(g => !validDims.includes(g));
      if (invalid.length) {
        sendError(res, `أبعاد التجميع غير صالحة: ${invalid.join(', ')}. الأبعاد المتاحة: ${validDims.join(', ')}`, 400);
        return;
      }
      const data = await AnalyticsService.getPivotData({
        repId: req.query.rep_id as string | undefined,
        from:    req.query.from as string | undefined,
        to:      req.query.to   as string | undefined,
        groupBy
      });
      sendSuccess(res, data);
    } catch (e) { next(e); }
  }
);

/**
 * @route   GET /api/v1/analytics/reps-performance
 * @desc    مقارنة أداء المندوبين: الفواتير، القطع، البونص، الإيرادات
 * @query   from?, to?
 */
router.get('/reps-performance',
  requireRoles(['admin', 'supervisor']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AnalyticsService.getRepPerformance({
        from: req.query.from as string | undefined,
        to:   req.query.to   as string | undefined
      });
      sendSuccess(res, data);
    } catch (e) { next(e); }
  }
);

/**
 * @route   GET /api/v1/analytics/export-excel
 * @desc    تصدير تقرير Excel متعدد الأوراق منسق احترافياً
 * @query   rep_id?, from?, to?, include_pivot?
 */
router.get('/export-excel',
  requireRoles(['admin', 'supervisor']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rep_id, from, to } = req.query as Record<string, string>;

      // جمع البيانات
      const [kpis, repPerf, pivotByType, invoices] = await Promise.all([
        AnalyticsService.getKPIs({ repId: rep_id, from, to }),
        AnalyticsService.getRepPerformance({ from, to }),
        AnalyticsService.getPivotData({ repId: rep_id, from, to, groupBy: ['rep', 'product_type', 'month'] }),
        InvoiceService.findAll({ repId: rep_id, from, to, status: 'approved' })
      ]);

      // ─── توليد CSV احترافي كبديل خفيف الوزن عن Excel ────────────────────
      // (في البيئة الإنتاجية يُستخدم ExcelJS/openpyxl لتوليد .xlsx حقيقي)
      const now = new Date().toLocaleDateString('ar-IQ');
      let csv = '';

      // ── ورقة 1: ملخص تنفيذي ──
      csv += `"نظام إدارة مبيعات المندوبين الطبيين"\n`;
      csv += `"تاريخ التقرير:","${now}"\n`;
      csv += `"الفترة الزمنية:","${from ?? 'البداية'} حتى ${to ?? 'الآن'}"\n\n`;
      csv += `"ملخص الأداء"\n`;
      csv += `"إجمالي الفواتير","إجمالي القطع","إجمالي البونص","إجمالي المبيعات","فواتير معتمدة","فواتير بانتظار المراجعة"\n`;
      csv += `"${kpis.total_invoices}","${kpis.total_pieces_sold}","${kpis.total_bonus_pieces}","${kpis.total_sales_amount}","${kpis.approved_invoices}","${kpis.pending_invoices}"\n\n`;

      // ── ورقة 2: أداء المندوبين ──
      csv += `"أداء المندوبين"\n`;
      csv += `"اسم المندوب","عدد الفواتير","إجمالي القطع","إجمالي البونص","إجمالي المبيعات"\n`;
      repPerf.forEach(r => {
        csv += `"${r.rep_name}","${r.total_invoices}","${r.total_pieces}","${r.total_bonus}","${r.total_revenue}"\n`;
      });
      csv += '\n';

      // ── ورقة 3: الجدول المحوري ──
      csv += `"الجدول المحوري (مندوب × نوع المنتج × الشهر)"\n`;
      csv += `"المندوب","نوع المنتج","الشهر","الكمية","البونص","الإيرادات"\n`;
      pivotByType.forEach(r => {
        csv += `"${r.rep_name ?? ''}","${r.product_type ?? ''}","${r.month ?? ''}","${r.total_quantity}","${r.total_bonus}","${r.total_revenue}"\n`;
      });
      csv += '\n';

      // ── ورقة 4: تفاصيل الفواتير ──
      csv += `"تفاصيل الفواتير المعتمدة"\n`;
      csv += `"رقم الفاتورة","التاريخ","الصيدلية","المندوب","القطع","البونص","الإيرادات","الحالة"\n`;
      invoices.forEach(i => {
        csv += `"${i.invoice_number ?? '-'}","${i.invoice_date}","${i.pharmacy_name ?? '-'}","${i.rep_name ?? '-'}","${i.total_pieces_count}","${i.total_bonus_count}","${i.total_sales_amount}","${i.status}"\n`;
      });

      const filename = `pharma_report_${from ?? 'all'}_${to ?? 'now'}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Language', 'ar');
      // BOM للـ Excel لعرض العربية بشكل صحيح
      res.send('\uFEFF' + csv);
    } catch (e) { next(e); }
  }
);

export default router;
