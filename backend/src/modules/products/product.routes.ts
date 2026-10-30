import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middleware/validate.middleware';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { ProductService, BonusService } from './product.service';
import { sendSuccess, sendCreated } from '../../utils/response';

const router = Router();
router.use(authenticateToken);

// ── Validation Schemas ────────────────────────────────────────────────────────
const productSchema = z.object({
  name: z.string().min(2, 'اسم المنتج مطلوب'),
  product_type: z.enum(['drop', 'cream', 'ointment', 'other']),
  base_price: z.number().positive('السعر يجب أن يكون رقماً موجباً'),
  is_active: z.boolean().optional()
});

const bonusRuleSchema = z.object({
  product_id: z.string().min(1, 'معرف المنتج مطلوب'),
  rep_id: z.string().min(1).optional(),
  threshold_quantity: z.number().int().positive().default(10),
  bonus_quantity: z.number().int().nonnegative().default(1),
  effective_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تنسيق التاريخ يجب أن يكون YYYY-MM-DD').optional(),
  effective_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

// ── Products CRUD ─────────────────────────────────────────────────────────────
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeOnly = req.query.active === 'true';
    sendSuccess(res, await ProductService.findAll(activeOnly));
  } catch (e) { next(e); }
});

router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await ProductService.findById(req.params.id)); }
  catch (e) { next(e); }
});

router.post('/products',
  requireRoles(['admin']),
  validateRequest(productSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try { sendCreated(res, await ProductService.create(req.body), 'تم إضافة المنتج بنجاح'); }
    catch (e) { next(e); }
  }
);

router.put('/products/:id',
  requireRoles(['admin']),
  validateRequest(productSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try { sendSuccess(res, await ProductService.update(req.params.id, req.body), 'تم تعديل المنتج بنجاح'); }
    catch (e) { next(e); }
  }
);

// ── Bonus Rules CRUD ──────────────────────────────────────────────────────────
router.get('/bonus-rules', async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await BonusService.findAll()); }
  catch (e) { next(e); }
});

router.post('/bonus-rules',
  requireRoles(['admin']),
  validateRequest(bonusRuleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try { sendCreated(res, await BonusService.upsertRule(req.body), 'تم حفظ قاعدة البونص بنجاح'); }
    catch (e) { next(e); }
  }
);

router.put('/bonus-rules/:id',
  requireRoles(['admin']),
  validateRequest(bonusRuleSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try { sendSuccess(res, await BonusService.upsertRule({ ...req.body, id: req.params.id }), 'تم تعديل قاعدة البونص بنجاح'); }
    catch (e) { next(e); }
  }
);

router.delete('/bonus-rules/:id',
  requireRoles(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try { await BonusService.deleteRule(req.params.id); sendSuccess(res, null, 'تم حذف قاعدة البونص'); }
    catch (e) { next(e); }
  }
);

/**
 * @route  GET /api/v1/catalog/calculate-bonus?product_id=&sold_qty=&rep_id=
 * @desc   حساب البونص مباشرة لأي كمية مباعة (مساعد للتطبيق)
 */
router.get('/calculate-bonus', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product_id, sold_qty, rep_id } = req.query as Record<string, string>;
    if (!product_id || !sold_qty)
      throw { statusCode: 400, message: 'product_id و sold_qty مطلوبان' };

    const rule = await BonusService.getActiveRule(product_id, rep_id);
    if (!rule) {
      sendSuccess(res, { bonus_quantity: 0, note: 'لا توجد قاعدة بونص مفعلة لهذا المنتج' });
      return;
    }
    const bonus = BonusService.calculateBonus(
      parseInt(sold_qty), rule.threshold_quantity, rule.bonus_quantity
    );
    sendSuccess(res, {
      sold_quantity: parseInt(sold_qty),
      threshold: rule.threshold_quantity,
      bonus_per_threshold: rule.bonus_quantity,
      bonus_quantity: bonus,
      total_quantity: parseInt(sold_qty) + bonus
    });
  } catch (e) { next(e); }
});

export default router;
