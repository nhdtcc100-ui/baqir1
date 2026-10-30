import { Router } from 'express';
import { PharmacyController } from './pharmacy.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { createPharmacySchema, updatePharmacySchema } from './pharmacy.validation';

const router = Router();

// All pharmacy routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/pharmacies
 * @desc    قائمة الصيدليات (المندوب: صيدلياته فقط | الإدارة: الكل)
 * @query   rep_id?, city?, search?
 */
router.get('/', PharmacyController.list);

/**
 * @route   GET /api/v1/pharmacies/:id
 * @desc    تفاصيل صيدلية واحدة
 */
router.get('/:id', PharmacyController.getOne);

/**
 * @route   POST /api/v1/pharmacies
 * @desc    إضافة صيدلية جديدة (مدير أو مشرف فقط)
 * @body    { name, city, address?, phone?, assigned_rep_id? }
 */
router.post(
  '/',
  requireRoles(['admin', 'supervisor']),
  validateRequest(createPharmacySchema),
  PharmacyController.create
);

/**
 * @route   PUT /api/v1/pharmacies/:id
 * @desc    تعديل بيانات صيدلية (مدير أو مشرف فقط)
 */
router.put(
  '/:id',
  requireRoles(['admin', 'supervisor']),
  validateRequest(updatePharmacySchema),
  PharmacyController.update
);

/**
 * @route   DELETE /api/v1/pharmacies/:id
 * @desc    حذف صيدلية (مدير فقط)
 */
router.delete(
  '/:id',
  requireRoles(['admin']),
  PharmacyController.remove
);

export default router;
