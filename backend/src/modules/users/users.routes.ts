import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticateToken, requireRoles } from '../../middleware/auth.middleware';
import { AuthService, fetchUsersFromAdminSheet, extractGoogleSheetId } from '../auth/auth.service';
import { GoogleSheetsService } from '../google-sheets/googleSheets.service';
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
      sheet_name: 'الشيت الرئيسي',
      columns: [
        { col: 'A', field: 'full_name', title: 'الاسم', example: 'باقر علي' },
        { col: 'B', field: 'password_hash', title: 'الرمز السري', example: '123456' },
        { col: 'C', field: 'sheet_url', title: 'صفحة كوكل شيت', example: 'https://docs.google.com/spreadsheets/d/.../edit' },
        { col: 'D', field: 'webhook_url', title: 'اي بي اي سكربت', example: 'https://script.google.com/macros/s/.../exec' },
        { col: 'E', field: 'gemini_api_key', title: 'اي بي اي جمناي', example: 'AIzaSy...' }
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

/**
 * @route   POST /api/v1/users/push-to-sheet
 * @access  admin
 * @desc    حفظ مستخدم جديد أو ترحيل قائمة مستخدمين مباشرة إلى ورقة "المستخدمون" في كوكل شيت
 */
router.post('/push-to-sheet', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { users, admin_webhook_url } = req.body;
    if (!Array.isArray(users) || users.length === 0) {
      sendError(res, 'يرجى إرسال بيانات مستخدم واحد على الأقل', 400);
      return;
    }
    const prepared = [];
    for (const u of users) {
      const hash = u.password_hash || await bcrypt.hash(String(u.password || '123456'), 10);
      prepared.push({
        id: u.id || `usr-${crypto.randomUUID().slice(0, 8)}`,
        full_name: String(u.full_name || '').trim(),
        email: String(u.email || '').trim().toLowerCase(),
        password_hash: hash,
        role: u.role || 'medical_rep',
        is_active: u.is_active !== false,
        gemini_api_key: String(u.gemini_api_key || '').trim(),
        sheet_id: extractGoogleSheetId(u.sheet_id || u.sheet_url),
        webhook_url: String(u.webhook_url || '').trim(),
        area: String(u.area || '').trim(),
        created_at: new Date().toISOString()
      });
    }
    const result = await GoogleSheetsService.pushUsersToAdminSheet(prepared, 'seed_users', admin_webhook_url);
    sendSuccess(res, result, result.message);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/users/add-to-sheet
 * @access  admin (باقر فقط)
 * @desc    إضافة مستخدم جديد مباشرة إلى الشيت الرئيسي
 */
router.post('/add-to-sheet', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, password, sheet_url, webhook_url, gemini_api_key, admin_webhook_url } = req.body;
    if (!full_name || !password) {
      sendError(res, 'الاسم والرمز السري مطلوبان', 400);
      return;
    }
    const result = await GoogleSheetsService.manageAdminSheetUser('add_user', {
      user: {
        full_name: String(full_name).trim(),
        password_hash: String(password).trim(),
        sheet_url: String(sheet_url || '').trim(),
        sheet_id: extractGoogleSheetId(sheet_url),
        webhook_url: String(webhook_url || '').trim(),
        gemini_api_key: String(gemini_api_key || '').trim()
      }
    }, admin_webhook_url);
    if (!result.success) {
      sendError(res, result.message, 502);
      return;
    }
    sendCreated(res, result, result.message);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/users/shared-gemini-key
 * @access  admin (باقر فقط)
 * @desc    تحديث مفتاح Gemini المشترك وتعميمه في الشيت الرئيسي للجميع دفعة واحدة
 */
router.post('/shared-gemini-key', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gemini_api_key, admin_webhook_url } = req.body;
    const result = await GoogleSheetsService.manageAdminSheetUser('set_shared_gemini_key', {
      gemini_api_key: String(gemini_api_key || '').trim()
    }, admin_webhook_url);
    if (!result.success) {
      sendError(res, result.message, 502);
      return;
    }
    sendSuccess(res, result, result.message);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/users/sync-template-all
 * @access  admin only
 * @desc    استنساخ أوراق و Pivot Tables شيت الأدمن لجميع شيتات المندوبين
 */
router.post('/sync-template-all', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { admin_webhook_url, targetIds, targetSpreadsheetId, mode } = req.body || {};
    const actionName = mode === 'tabs_only' ? 'sync_tabs_only' : 'sync_template_to_all';
    const result = await GoogleSheetsService.manageAdminSheetUser(actionName, {
      adminSpreadsheetId: ENV.ADMIN_SHEET_ID,
      spreadsheetId: ENV.GOOGLE_SHEET_ID,
      targetSpreadsheetId: targetSpreadsheetId || undefined,
      targetIds: Array.isArray(targetIds) ? targetIds : []
    }, admin_webhook_url);
    if (!result.success) {
      sendError(res, result.message, 502);
      return;
    }
    sendSuccess(res, result, result.message);
  } catch (e) { next(e); }
});

/**
 * @route   POST /api/v1/users/unify-webhook
 * @access  admin only
 * @desc    توحيد رابط سكربت الأدمن المركزي لجميع المستخدمين في الشيت الرئيسي
 */
router.post('/unify-webhook', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { centralWebhookUrl, mode, admin_webhook_url } = req.body || {};
    const result = await GoogleSheetsService.manageAdminSheetUser('unify_admin_webhook', {
      centralWebhookUrl: String(centralWebhookUrl || ENV.SHARED_CENTRAL_WEBHOOK || ENV.GOOGLE_SHEETS_WEBHOOK_URL || '').trim(),
      mode: mode === 'clear' ? 'clear' : 'set'
    }, admin_webhook_url);
    if (!result.success) {
      sendError(res, result.message, 502);
      return;
    }
    sendSuccess(res, result, result.message);
  } catch (e) { next(e); }
});

/**
 * @route   PUT /api/v1/users/update-in-sheet
 * @access  admin (باقر فقط)
 * @desc    تعديل أي صف مستخدم مباشرة في الشيت الرئيسي
 */
router.put('/update-in-sheet', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rowNumber, currentName, newName, newPassword, newSheetUrl, newWebhookUrl, newGeminiApiKey, admin_webhook_url } = req.body;
    if (!rowNumber && !currentName) {
      sendError(res, 'معرف الصف أو الاسم الحالي مطلوب للتعديل', 400);
      return;
    }
    const result = await GoogleSheetsService.manageAdminSheetUser('update_user', {
      rowNumber,
      currentName,
      newName,
      newPassword,
      newSheetUrl,
      newWebhookUrl,
      newGeminiApiKey
    }, admin_webhook_url);
    if (!result.success) {
      sendError(res, result.message, 502);
      return;
    }
    sendSuccess(res, result, result.message);
  } catch (e) { next(e); }
});

/**
 * @route   DELETE /api/v1/users/delete-from-sheet
 * @access  admin (باقر فقط)
 * @desc    حذف مستخدم من الشيت الرئيسي
 */
router.delete('/delete-from-sheet', requireRoles(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rowNumber, currentName, admin_webhook_url } = req.body;
    if (!rowNumber && !currentName) {
      sendError(res, 'معرف الصف أو الاسم مطلوب للحذف', 400);
      return;
    }
    const result = await GoogleSheetsService.manageAdminSheetUser('delete_user', {
      rowNumber,
      currentName
    }, admin_webhook_url);
    if (!result.success) {
      sendError(res, result.message, 502);
      return;
    }
    sendSuccess(res, result, result.message);
  } catch (e) { next(e); }
});

export default router;

