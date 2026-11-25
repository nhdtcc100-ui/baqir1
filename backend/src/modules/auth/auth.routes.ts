import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { loginSchema, registerUserSchema, publicRegisterSchema, updateProfileSchema } from './auth.validation';

const router = Router();

/**
 * @route   POST /api/v1/auth/login
 * @desc    تسجيل الدخول وإصدار رمز JWT
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), AuthController.login);

/**
 * @route   POST /api/v1/auth/register
 * @desc    تسجيل حساب جديد في جدول المستخدمين على كوكل شيت وقاعدة البيانات الخاصة به
 * @access  Public
 */
router.post('/register', validateRequest(publicRegisterSchema), AuthController.publicRegister);

/**
 * @route   GET /api/v1/auth/me
 * @desc    جلب بيانات المستخدم الحالي وصلاحياته
 * @access  Private (Authenticated)
 */
router.get('/me', authenticateToken, AuthController.getProfile);

/**
 * @route   POST /api/v1/auth/update-profile
 * @desc    تعديل الاسم والرمز السري للمستخدم الحالي وتحديث الشيت الرئيسي
 * @access  Private (Authenticated)
 */
router.post('/update-profile', authenticateToken, validateRequest(updateProfileSchema), AuthController.updateProfile);

/**
 * @route   POST /api/v1/auth/users
 * @desc    إضافة مندوب أو مستخدم جديد
 * @access  Private (Admin Only)
 */
router.post(
  '/users',
  authenticateToken,
  requireRoles(['admin']),
  validateRequest(registerUserSchema),
  AuthController.registerUser
);

/**
 * @route   GET /api/v1/auth/users
 * @desc    قائمة بكافة المندوبين والمستخدمين مع التصفية
 * @access  Private (Admin & Supervisor)
 */
router.get(
  '/users',
  authenticateToken,
  requireRoles(['admin', 'supervisor']),
  AuthController.listUsers
);

export default router;
