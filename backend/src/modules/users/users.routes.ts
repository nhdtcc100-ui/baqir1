import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { AuthService, fetchUsersFromAdminSheet } from '../auth/auth.service';
import { sendSuccess, sendCreated, sendError } from '../../utils/response';
import { ENV } from '../../config/env';

const router = Router();
router.use(authenticateToken);

/**
 * @route   GET /api/v1/users
 * @access  admin, supervisor
 * @desc    جلب كافة المستخدمين من جدول جوجل شيت الإدارة ومن النظام
 */
router.get('/', requireRoles(['admin', 'supervisor']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AuthService.listUsers();
    sendSuccess(res, users, `تم جلب ${users.length} مستخدم بنجاح`);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/users/generate-hash
 * @access  admin
 * @desc    توليد تشفير bcrypt لكلمة مرور لإلصاقها مباشرة في عمود password_hash في شيت الإدارة
 */
router.post('/generate-hash', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    if (!password || String(password).length < 4) {
      sendError(res, 'يرجى إدخال كلمة مرور مكونة من 4 أحرف على الأقل', 400);
      return;
    }
    const hash = await bcrypt.hash(String(password), 10);
    sendSuccess(res, {
      password: String(password),
      hash,
      length: String(password).length
    }, 'تم توليد الـ Hash المشفر بنجاح — يمكنك نسخه ولصقه في عمود password_hash في الشيت');
  } catch (e) { next(e); }
});

/**
 * @route   GET /api/v1/users/admin-sheet-config
 * @access  admin
 * @desc    معلومات شيت الإدارة وأعمدة ورقة المستخدمين
 */
router.get('/admin-sheet-config', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = {
      sheet_id: ENV.ADMIN_SHEET_ID,
      sheet_url: ENV.ADMIN_SHEET_URL,
      sheet_name: 'المستخدمون',
      columns: [
        { col: 'A', field: 'id', title: 'المعرّف', example: 'usr-001' },
        { col: 'B', field: 'full_name', title: 'الاسم الكامل', example: 'د. باقر (مدير النظام)' },
        { col: 'C', field: 'email', title: 'البريد الإلكتروني', example: 'admin@pharma.com' },
        { col: 'D', field: 'password_hash', title: 'تشفير كلمة المرور', example: '$2b$10$yZeibnt29qRbMeYb03IGG.7MOPlyrG9c6A/WmSRPsn/g.5mGaOdXi' },
        { col: 'E', field: 'role', title: 'الدور (admin / supervisor / medical_rep)', example: 'admin' },
        { col: 'F', field: 'is_active', title: 'الحالة (TRUE / FALSE)', example: 'TRUE' },
        { col: 'G', field: 'gemini_api_key', title: 'مفتاح Gemini API الخاص به', example: 'AIzaSy...' },
        { col: 'H', field: 'sheet_id', title: 'معرف Google Sheet الخاص به', example: '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE' },
        { col: 'I', field: 'webhook_url', title: 'رابط Webhook الخاص به', example: 'https://script.google.com/macros/s/.../exec' }
      ]
    };
    sendSuccess(res, config);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/users/format-row
 * @access  admin
 * @desc    تجهيز سطر مستخدم جاهز للنسخ المباشر إلى شيت الإدارة
 */
router.post('/format-row', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password, role, gemini_api_key, sheet_id, webhook_url } = req.body;
    if (!full_name || !email || !password) {
      sendError(res, 'الاسم الكامل والبريد الإلكتروني وكلمة المرور مطلوبة', 400);
      return;
    }
    const hash = await bcrypt.hash(String(password), 10);
    const id = `usr-${crypto.randomUUID().slice(0, 8)}`;
    const rowValues = [
      id,
      String(full_name).trim(),
      String(email).trim().toLowerCase(),
      hash,
      role || 'medical_rep',
      'TRUE',
      String(gemini_api_key || '').trim(),
      String(sheet_id || '').trim(),
      String(webhook_url || '').trim()
    ];
    sendSuccess(res, {
      id,
      full_name,
      email: String(email).trim().toLowerCase(),
      role: role || 'medical_rep',
      rowValues,
      tsvLine: rowValues.join('\t')
    }, 'تم تجهيز بيانات المستخدم بنجاح');
  } catch (e) { next(e); }
});

export default router;

