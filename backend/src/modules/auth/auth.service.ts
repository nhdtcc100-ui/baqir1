import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool, isUsingPostgres, inMemoryStore, UserEntity } from '../../database/db';
import { ENV } from '../../config/env';
import { LoginInput, RegisterUserInput, PublicRegisterInput, UpdateProfileInput } from './auth.validation';
import { AuthTokens, UserResponse, UserRole } from './auth.types';
import { GoogleSheetsService } from '../google-sheets/googleSheets.service';

export function extractGoogleSheetId(raw?: string): string {
  const s = String(raw || '').trim();
  if (!s) return '';
  const m = s.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (m && m[1]) return m[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(s)) return s;
  return '';
}

function normalizeDigitsBackend(str: string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str || '')
    .replace(/[٠-٩]/g, w => String(arabicDigits.indexOf(w)))
    .replace(/[۰-۹]/g, w => String(persianDigits.indexOf(w)));
}

export function normalizePersonNameBackend(raw: string): string {
  return normalizeDigitsBackend(String(raw || ''))
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/^(د\.|دكتور)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isBaqerAdminBackend(name: string, email?: string): boolean {
  const n = normalizePersonNameBackend(name);
  const e = String(email || '').trim().toLowerCase();
  if (n === 'باقر' || n === 'باقر علي' || n.startsWith('باقر ') || n === 'baqer' || n === 'baqir') {
    return true;
  }
  return e === 'baqer@pharma.com' || e === 'admin@pharma.com';
}

function readGvizCellBackend(cell: any): string {
  if (!cell) return '';
  if (cell.f !== undefined && cell.f !== null && String(cell.f).trim() !== '') {
    return String(cell.f).trim();
  }
  if (cell.v !== undefined && cell.v !== null) {
    return String(cell.v).trim();
  }
  return '';
}

export interface SheetUser {
  rowNumber?: number;
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  gemini_api_key?: string;
  sheet_id?: string;
  sheet_url?: string;
  webhook_url?: string;
}

function parseCsvMatrixBackend(csvText: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  const text = String(csvText || '').replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else { inQuotes = false; }
      } else { cell += ch; }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell.trim()); cell = '';
    } else if (ch === '\r') {
      continue;
    } else if (ch === '\n') {
      row.push(cell.trim()); rows.push(row); row = []; cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) { row.push(cell.trim()); rows.push(row); }
  return rows;
}

function resolveSheetColsBackend(headers: string[]) {
  const normHeaders = headers.map(h => normalizePersonNameBackend(h));
  const findIdx = (patterns: string[]) => normHeaders.findIndex(h => h && patterns.some(p => h.includes(p)));
  const isLegacy = normHeaders[0] === 'id' || normHeaders[0]?.includes('معرف');
  return {
    nameCol: isLegacy ? 1 : (findIdx(['الاسم', 'full_name', 'name']) >= 0 ? findIdx(['الاسم', 'full_name', 'name']) : 0),
    passCol: isLegacy ? 3 : (findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) >= 0 ? findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) : 1),
    sheetCol: isLegacy ? 7 : (findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) >= 0 ? findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) : 2),
    webhookCol: isLegacy ? 8 : (findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) >= 0 ? findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) : 3),
    emailCol: isLegacy ? 2 : findIdx(['email', 'بريد', 'username']),
    idCol: isLegacy ? 0 : findIdx(['معرف']),
    activeCol: isLegacy ? 5 : findIdx(['is_active', 'الحاله']),
    geminiCol: isLegacy ? 6 : findIdx(['اي بي اي جمناي', 'مفتاح جمناي', 'جمناي', 'gemini', 'مفتاح'])
  };
}

function buildSheetUserRecordBackend(fields: {
  rowNum: number;
  rawName: string;
  rawPass: string;
  rawEmailCol: string;
  rawSheet: string;
  rawWebhook: string;
  rawId: string;
  rawActive: string;
  rawGemini: string;
}): SheetUser | null {
  if (!fields.rawName && !fields.rawEmailCol) return null;
  const nName = normalizePersonNameBackend(fields.rawName);
  if (nName === 'الاسم' || nName === 'full_name' || nName === 'a' || fields.rawId.toLowerCase() === 'id') return null;
  if (fields.rawActive) {
    const act = fields.rawActive.trim().toUpperCase();
    if (act === 'FALSE' || act === '0' || act === 'معطل') return null;
  }
  const displayName = fields.rawName || fields.rawEmailCol.split('@')[0];
  const safeSlug = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_\u0621-\u064a-]/gi, '') || `rep_${fields.rowNum}`;
  const email = fields.rawEmailCol.includes('@') ? fields.rawEmailCol.toLowerCase() : `${safeSlug}@pharma.com`;
  const isAdmin = isBaqerAdminBackend(displayName, email);
  const role: UserRole = isAdmin ? 'admin' : 'medical_rep';
  const sheetId = extractGoogleSheetId(fields.rawSheet) || undefined;
  let webhookUrl = fields.rawWebhook && fields.rawWebhook.startsWith('http') ? fields.rawWebhook : undefined;
  if (!webhookUrl && isAdmin) webhookUrl = ENV.GOOGLE_SHEETS_WEBHOOK_URL;
  return {
    rowNumber: fields.rowNum,
    id: fields.rawId || `sheet-usr-${fields.rowNum}`,
    full_name: displayName,
    email,
    password_hash: fields.rawPass,
    role,
    is_active: true,
    gemini_api_key: fields.rawGemini || undefined,
    sheet_id: sheetId,
    sheet_url: sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing` : (fields.rawSheet.startsWith('http') ? fields.rawSheet : undefined),
    webhook_url: webhookUrl
  };
}

function propagateSharedGeminiBackend(users: SheetUser[]): SheetUser[] {
  const adminKey = users.find(u => u.role === 'admin' && u.gemini_api_key?.trim())?.gemini_api_key?.trim() || '';
  const anyKey = users.find(u => u.gemini_api_key?.trim())?.gemini_api_key?.trim() || '';
  const shared = adminKey || anyKey;
  if (!shared) return users;
  return users.map(u => ({ ...u, gemini_api_key: adminKey || u.gemini_api_key || shared }));
}

function mergeSheetUsersBackend(...lists: SheetUser[][]): SheetUser[] {
  const byKey = new Map<string, SheetUser>();
  for (const list of lists) {
    for (const u of list) {
      const k = normalizePersonNameBackend(u.full_name) || u.email.toLowerCase();
      if (!k) continue;
      const prev = byKey.get(k);
      if (!prev) {
        byKey.set(k, { ...u });
      } else {
        byKey.set(k, {
          ...prev,
          ...u,
          password_hash: u.password_hash || prev.password_hash,
          sheet_id: u.sheet_id || prev.sheet_id,
          sheet_url: u.sheet_url || prev.sheet_url,
          webhook_url: u.webhook_url || prev.webhook_url,
          gemini_api_key: u.gemini_api_key || prev.gemini_api_key,
          rowNumber: u.rowNumber || prev.rowNumber
        });
      }
    }
  }
  return propagateSharedGeminiBackend(Array.from(byKey.values()));
}

/**
 * جلب مفتاح Gemini المشترك من الشيت الرئيسي (الأولوية لصف الأدمن/باقر ثم أول مفتاح صالح)
 */
export async function fetchSharedGeminiKeyFromAdminSheet(): Promise<string> {
  const users = await fetchUsersFromAdminSheet().catch(() => [] as SheetUser[]);
  const adminKey = users.find(u => u.role === 'admin' && u.gemini_api_key?.trim())?.gemini_api_key?.trim();
  if (adminKey) return adminKey;
  const anyKey = users.find(u => u.gemini_api_key?.trim())?.gemini_api_key?.trim();
  return anyKey || '';
}

/**
 * جلب قائمة المستخدمين من الشيت الرئيسي كقاعدة بيانات (يدعم CSV + Webhook + GViz حتى عند خلط الأرقام والنصوص في الرمز السري)
 */
export async function fetchUsersFromAdminSheet(): Promise<SheetUser[]> {
  const sid = ENV.ADMIN_SHEET_ID;
  if (!sid) return [];

  const collected: SheetUser[][] = [];

  // 1) CSV Direct Export (لا يخفي الخلايا النصية مثل keko3 داخل عمود الأرقام)
  try {
    const csvRes = await fetch(`https://docs.google.com/spreadsheets/d/${sid}/export?format=csv&_t=${Date.now()}`, { signal: AbortSignal.timeout(6000) });
    if (csvRes.ok) {
      const matrix = parseCsvMatrixBackend(await csvRes.text());
      if (matrix.length > 1) {
        const idx = resolveSheetColsBackend(matrix[0] || []);
        const list: SheetUser[] = [];
        for (let i = 1; i < matrix.length; i++) {
          const row = matrix[i] || [];
          const get = (ci: number) => (ci >= 0 ? String(row[ci] ?? '').trim() : '');
          const rawGem = get(idx.geminiCol) || row.slice(4).find(v => /^(AIza|AQ\.)/.test(String(v || '').trim())) || '';
          const rec = buildSheetUserRecordBackend({
            rowNum: i + 1,
            rawName: get(idx.nameCol),
            rawPass: normalizeDigitsBackend(get(idx.passCol)),
            rawEmailCol: get(idx.emailCol),
            rawSheet: get(idx.sheetCol),
            rawWebhook: get(idx.webhookCol),
            rawId: get(idx.idCol),
            rawActive: get(idx.activeCol),
            rawGemini: rawGem.trim()
          });
          if (rec) list.push(rec);
        }
        if (list.length > 0) collected.push(list);
      }
    }
  } catch { /* fallback next */ }

  // 2) Admin Apps Script ?action=users (إن وُجد رابط مفعل)
  const adminHook = (ENV.ADMIN_WEBHOOK_URL || ENV.GOOGLE_SHEETS_WEBHOOK_URL || '').trim();
  if (adminHook.startsWith('http')) {
    try {
      const hookRes = await fetch(`${adminHook}?action=users&_t=${Date.now()}`, { signal: AbortSignal.timeout(5000) });
      if (hookRes.ok) {
        const data: any = await hookRes.json().catch(() => null);
        if (data?.success && Array.isArray(data.users)) {
          const list: SheetUser[] = [];
          for (let i = 0; i < data.users.length; i++) {
            const u = data.users[i];
            const rec = buildSheetUserRecordBackend({
              rowNum: Number(u.rowNumber || i + 2),
              rawName: String(u.full_name || u.name || '').trim(),
              rawPass: normalizeDigitsBackend(String(u.password_hash || u.password || '').trim()),
              rawEmailCol: String(u.email || '').trim(),
              rawSheet: String(u.sheet_url || u.sheet_id || '').trim(),
              rawWebhook: String(u.webhook_url || '').trim(),
              rawId: String(u.id || ''),
              rawActive: 'TRUE',
              rawGemini: String(u.gemini_api_key || '').trim()
            });
            if (rec) list.push(rec);
          }
          if (list.length > 0) collected.push(list);
        }
      }
    } catch { /* fallback next */ }
  }

  // 3) GViz JSON
  const urls = [
    `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq?tqx=out:json&_t=${Date.now()}`,
    `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent('المستخدمون')}&_t=${Date.now()}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;

      const text = await res.text();
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
      if (!jsonMatch || !jsonMatch[1]) continue;

      const data = JSON.parse(jsonMatch[1]);
      const cols: any[] = data.table?.cols || [];
      const rows: any[] = data.table?.rows || [];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const colLabels = cols.map((col: any) => String(col?.label || '').trim());
      const parsedNumHeaders = Number(data.table?.parsedNumHeaders || 0);
      const firstRowCells = (rows[0]?.c || []).map((cell: any) => readGvizCellBackend(cell));
      const labelsHaveHeader = colLabels.some(l => {
        const nl = normalizePersonNameBackend(l);
        return nl.includes('الاسم') || nl.includes('الرمز') || nl === 'id' || nl === 'full_name' || nl === 'email';
      });

      let headers = colLabels;
      let startIdx = 0;
      if (!labelsHaveHeader && firstRowCells.some((cell: string) => {
        const nl = normalizePersonNameBackend(cell);
        return nl.includes('الاسم') || nl.includes('الرمز') || nl === 'id' || nl === 'full_name';
      })) {
        headers = firstRowCells;
        startIdx = 1;
      }

      const idx = resolveSheetColsBackend(headers);
      const parsedUsers: SheetUser[] = [];
      for (let i = startIdx; i < rows.length; i++) {
        const c = rows[i]?.c || [];
        const get = (ci: number) => (ci >= 0 ? readGvizCellBackend(c[ci]) : '');
        const rawGem = get(idx.geminiCol) || c.slice(4).map((cell: any) => readGvizCellBackend(cell)).find((v: string) => /^(AIza|AQ\.)/.test(v.trim())) || '';
        const rec = buildSheetUserRecordBackend({
          rowNum: parsedNumHeaders > 0 ? i + parsedNumHeaders + 1 : i + 1,
          rawName: get(idx.nameCol),
          rawPass: normalizeDigitsBackend(get(idx.passCol)),
          rawEmailCol: get(idx.emailCol),
          rawSheet: get(idx.sheetCol),
          rawWebhook: get(idx.webhookCol),
          rawId: get(idx.idCol),
          rawActive: get(idx.activeCol),
          rawGemini: rawGem.trim()
        });
        if (rec) parsedUsers.push(rec);
      }

      if (parsedUsers.length > 0) {
        collected.push(parsedUsers);
        break;
      }
    } catch {
      // تجربة الرابط التالي
    }
  }

  if (collected.length === 0) return [];
  const merged = mergeSheetUsersBackend(...collected);
  console.log(`✅ Loaded ${merged.length} users successfully from Admin Google Sheet (${sid})`);
  return merged;
}

export class AuthService {
  // 1. تسجيل الدخول والتحقق التام (Database-Exact) من الشيت الرئيسي
  static async login(input: LoginInput): Promise<AuthTokens> {
    const rawTarget = input.email.trim();
    const emailLower = rawTarget.toLowerCase();
    const cleanPass = normalizeDigitsBackend(input.password.trim());

    const matchesSheetAccount = (u: SheetUser): boolean => {
      const targetNorm = normalizePersonNameBackend(rawTarget);
      const uNorm = normalizePersonNameBackend(u.full_name);
      const uEmail = u.email.toLowerCase();
      return (
        u.full_name.trim() === rawTarget ||
        (Boolean(targetNorm) && uNorm === targetNorm) ||
        uEmail === emailLower ||
        uEmail.split('@')[0] === emailLower
      );
    };

    // ── المحاولة الأولى: قاعدة بيانات Google Sheet الرئيسية ──
    const sheetUsers = await fetchUsersFromAdminSheet().catch(() => [] as SheetUser[]);
    if (sheetUsers.length > 0) {
      const sheetUser = sheetUsers.find(matchesSheetAccount);
      if (sheetUser) {
        if (!sheetUser.is_active) {
          throw { statusCode: 403, message: 'هذا الحساب معطل حالياً في الشيت الرئيسي، يرجى مراجعة إدارة النظام' };
        }

        let isMatch = false;
        if (sheetUser.password_hash.startsWith('$2')) {
          isMatch = await bcrypt.compare(cleanPass, sheetUser.password_hash).catch(() => false);
        } else {
          isMatch = cleanPass === normalizeDigitsBackend(sheetUser.password_hash.trim());
        }

        if (!isMatch) {
          throw { statusCode: 401, message: 'الاسم أو الرمز السري غير متطابق مع قاعدة البيانات' };
        }

        const payload = {
          userId: sheetUser.id,
          email: sheetUser.email,
          role: sheetUser.role,
          fullName: sheetUser.full_name,
          geminiApiKey: sheetUser.gemini_api_key || '',
          sheetId: sheetUser.sheet_id || '',
          webhookUrl: sheetUser.webhook_url || ''
        };

        const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
          expiresIn: ENV.JWT_EXPIRES_IN as any
        });

        const userResponse: UserResponse = {
          id: sheetUser.id,
          email: sheetUser.email,
          full_name: sheetUser.full_name,
          role: sheetUser.role,
          is_active: sheetUser.is_active,
          created_at: new Date(),
          gemini_api_key: sheetUser.gemini_api_key,
          sheet_id: sheetUser.sheet_id,
          webhook_url: sheetUser.webhook_url
        };

        return {
          accessToken,
          tokenType: 'Bearer',
          expiresIn: ENV.JWT_EXPIRES_IN,
          user: userResponse
        };
      }
    }

    // ── المحاولة الثانية: قاعدة البيانات المحلية (لحسابات النظام والاختبارات التكاملية) ──
    let user: UserEntity | null = null;

    if (isUsingPostgres()) {
      const res = await pool.query(
        `SELECT u.*, r.name as role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE LOWER(u.email) = $1 OR LOWER(u.full_name) = $1`,
        [emailLower]
      );
      if (res.rows.length > 0) user = res.rows[0];
    } else {
      user = inMemoryStore.users.find(u =>
        u.email.toLowerCase() === emailLower ||
        normalizePersonNameBackend(u.full_name) === normalizePersonNameBackend(rawTarget)
      ) || null;
    }

    if (!user) {
      throw { statusCode: 401, message: 'الاسم أو الرمز السري غير متطابق مع قاعدة البيانات' };
    }

    if (!user.is_active) {
      throw { statusCode: 403, message: 'هذا الحساب معطل حالياً، يرجى مراجعة إدارة النظام' };
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(cleanPass, user.password_hash);
    } catch {
      isMatch = cleanPass === user.password_hash;
    }

    if (!isMatch) {
      throw { statusCode: 401, message: 'الاسم أو الرمز السري غير متطابق مع قاعدة البيانات' };
    }

    const roleName = (user.role_name || 'medical_rep') as UserRole;

    const payload = {
      userId: user.id,
      email: user.email,
      role: roleName,
      fullName: user.full_name,
      geminiApiKey: '',
      sheetId: '',
      webhookUrl: ''
    };

    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as any
    });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: roleName,
      is_active: user.is_active,
      created_at: user.created_at
    };

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: ENV.JWT_EXPIRES_IN,
      user: userResponse
    };
  }

  // 1 ب. تعديل الاسم والرمز السري للمستخدم الحالي وتحديث الشيت الرئيسي
  static async updateOwnProfile(
    authUser: { userId: string; email: string; fullName: string; role: UserRole; sheetId?: string; webhookUrl?: string },
    input: UpdateProfileInput
  ): Promise<{ user: UserResponse; accessToken: string }> {
    const newName = String(input.newName || input.fullName || '').trim();
    const newPassword = String(input.newPassword || input.password || '').trim();
    const currentPassword = String(input.currentPassword || '').trim();
    const currentName = String(input.currentName || authUser.fullName || '').trim();

    if (!newName && !newPassword) {
      throw { statusCode: 400, message: 'يرجى إدخال الاسم الجديد أو الرمز السري الجديد' };
    }

    if (newName && isBaqerAdminBackend(newName) && authUser.role !== 'admin') {
      throw { statusCode: 403, message: 'لا يمكن تغيير الاسم إلى اسم المدير الرئيسي' };
    }

    const sheetUsers = await fetchUsersFromAdminSheet().catch(() => [] as SheetUser[]);
    const matched = sheetUsers.find(
      u => normalizePersonNameBackend(u.full_name) === normalizePersonNameBackend(currentName) || u.email.toLowerCase() === authUser.email.toLowerCase()
    );

    if (matched) {
      if (currentPassword) {
        const cleanCur = normalizeDigitsBackend(currentPassword);
        const curOk = matched.password_hash.startsWith('$2')
          ? await bcrypt.compare(cleanCur, matched.password_hash).catch(() => false)
          : cleanCur === normalizeDigitsBackend(matched.password_hash);
        if (!curOk) {
          throw { statusCode: 401, message: 'الرمز السري الحالي غير صحيح' };
        }
      }

      if (newName) {
        const nameTaken = sheetUsers.some(
          u => u.id !== matched.id && normalizePersonNameBackend(u.full_name) === normalizePersonNameBackend(newName)
        );
        if (nameTaken) {
          throw { statusCode: 409, message: 'هذا الاسم مستخدم بالفعل في الشيت الرئيسي' };
        }
      }

      const hookRes = await GoogleSheetsService.manageAdminSheetUser('update_user', {
        rowNumber: matched.rowNumber,
        currentName: matched.full_name,
        email: matched.email,
        newName: newName || undefined,
        newPassword: newPassword ? normalizeDigitsBackend(newPassword) : undefined
      });
      if (!hookRes.success) {
        throw { statusCode: 502, message: hookRes.message };
      }
    }

    const updatedFullName = newName || authUser.fullName;
    const role: UserRole = isBaqerAdminBackend(updatedFullName, authUser.email) ? 'admin' : authUser.role;
    const payload = {
      userId: authUser.userId,
      email: authUser.email,
      role,
      fullName: updatedFullName,
      sheetId: matched?.sheet_id || authUser.sheetId || '',
      webhookUrl: matched?.webhook_url || authUser.webhookUrl || ''
    };
    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN as any });

    return {
      accessToken,
      user: {
        id: authUser.userId,
        email: authUser.email,
        full_name: updatedFullName,
        role,
        is_active: true,
        created_at: new Date(),
        sheet_id: matched?.sheet_id || authUser.sheetId,
        webhook_url: matched?.webhook_url || authUser.webhookUrl
      }
    };
  }

    // 2 ب. تسجيل حساب عام مع حفظه في الشيت الرئيسي (كمندوب فقط، ويُمنع حجز اسم المدير)
  static async publicRegister(input: PublicRegisterInput): Promise<AuthTokens> {
    const cleanFullName = input.fullName.trim();
    const rawUser = input.email.trim().toLowerCase();
    const emailLower = rawUser.includes('@') ? rawUser : `${rawUser}@pharma.com`;
    if (isBaqerAdminBackend(cleanFullName, emailLower)) {
      throw { statusCode: 403, message: 'هذا الاسم محجوز للإدارة الرئيسية ولا يمكن تسجيله كحساب جديد' };
    }

    const sheetId = extractGoogleSheetId(input.sheetUrl || input.sheetId) || undefined;
    const webhookUrl = (input.webhookUrl || '').trim() || undefined;
    const geminiApiKey = (input.geminiApiKey || '').trim() || undefined;
    const roleName: UserRole = 'medical_rep';

    // تحقق من عدم تكرار المستخدم في الشيت الرئيسي
    const existingSheetUsers = await fetchUsersFromAdminSheet().catch(() => []);
    if (existingSheetUsers.some(u =>
      normalizePersonNameBackend(u.full_name) === normalizePersonNameBackend(cleanFullName) ||
      u.email.toLowerCase() === emailLower
    )) {
      throw { statusCode: 409, message: 'الاسم أو المعرف مسجل مسبقاً في الشيت الرئيسي' };
    }

    const cleanPin = normalizeDigitsBackend(input.password.trim());
    const userId = `usr-${crypto.randomUUID().slice(0, 8)}`;
    const createdUser = await this.registerUser({
      fullName: cleanFullName,
      email: emailLower,
      password: cleanPin,
      phone: input.phone,
      roleName,
      sheetId,
      sheetUrl: input.sheetUrl,
      webhookUrl,
      geminiApiKey,
      area: input.area
    }, { precomputedHash: cleanPin, customId: userId });

    const payload = {
      userId: createdUser.id,
      email: createdUser.email,
      role: roleName,
      fullName: createdUser.full_name,
      geminiApiKey: geminiApiKey || '',
      sheetId: sheetId || '',
      webhookUrl: webhookUrl || ''
    };
    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN as any });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: ENV.JWT_EXPIRES_IN,
      user: createdUser
    };
  }

  // 2. إنشاء مستخدم أو مندوب جديد (مع ترحيله لشيت المستخدمين)
  static async registerUser(
    input: RegisterUserInput,
    internalOpts?: { precomputedHash?: string; customId?: string }
  ): Promise<UserResponse> {
    const emailLower = input.email.toLowerCase().trim();
    const sheetId = extractGoogleSheetId(input.sheetUrl || input.sheetId) || undefined;
    const webhookUrl = (input.webhookUrl || '').trim() || undefined;
    const geminiApiKey = (input.geminiApiKey || '').trim() || undefined;

    if (isUsingPostgres()) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [emailLower]);
      if (existing.rows.length > 0) {
        throw { statusCode: 409, message: 'البريد الإلكتروني مسجل بالفعل لمستخدم آخر' };
      }
    } else {
      if (inMemoryStore.users.some(u => u.email.toLowerCase() === emailLower)) {
        throw { statusCode: 409, message: 'البريد الإلكتروني مسجل بالفعل لمستخدم آخر' };
      }
    }

    const passwordHash = internalOpts?.precomputedHash || await bcrypt.hash(input.password, 10);
    const userId = internalOpts?.customId || crypto.randomUUID();
    const now = new Date();

    let savedUser: UserResponse;
    if (isUsingPostgres()) {
      const roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', [input.roleName]);
      if (roleRes.rows.length === 0) {
        throw { statusCode: 400, message: 'الدور المحدد غير معرف في النظام' };
      }
      const roleId = roleRes.rows[0].id;

      const insertRes = await pool.query(
        `INSERT INTO users (id, role_id, email, password_hash, full_name, phone, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, email, full_name, phone, is_active, created_at`,
        [userId, roleId, emailLower, passwordHash, input.fullName, input.phone || null, true, now, now]
      );

      savedUser = {
        ...insertRes.rows[0],
        role: input.roleName,
        sheet_id: sheetId,
        webhook_url: webhookUrl,
        gemini_api_key: geminiApiKey
      };
    } else {
      const roleObj = inMemoryStore.roles.find(r => r.name === input.roleName);
      if (!roleObj) throw { statusCode: 400, message: 'الدور المحدد غير معرف' };

      const newUser: UserEntity = {
        id: userId,
        role_id: roleObj.id,
        role_name: input.roleName,
        email: emailLower,
        password_hash: passwordHash,
        full_name: input.fullName,
        phone: input.phone,
        is_active: true,
        created_at: now,
        updated_at: now
      };

      inMemoryStore.users.push(newUser);

      savedUser = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        role: input.roleName,
        is_active: newUser.is_active,
        created_at: newUser.created_at,
        sheet_id: sheetId,
        webhook_url: webhookUrl,
        gemini_api_key: geminiApiKey
      };
    }

    // مزامنة المستخدم تلقائياً مع جدول "المستخدمون" في كوكل شيت دون تعطيل الاستجابة
    GoogleSheetsService.pushUsersToAdminSheet([
      {
        id: savedUser.id,
        full_name: savedUser.full_name,
        email: savedUser.email,
        password_hash: passwordHash,
        role: savedUser.role,
        is_active: true,
        gemini_api_key: geminiApiKey || '',
        sheet_id: sheetId || '',
        sheet_url: input.sheetUrl || (sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing` : ''),
        webhook_url: webhookUrl || '',
        area: input.area || '',
        created_at: now.toISOString()
      }
    ], 'register_user').catch(() => {});

    return savedUser;
  }

  // 3. جلب الملف الشخصي للمستخدم الحالي
  static async getCurrentUser(userId: string): Promise<UserResponse> {
    // التحقق من شيت الإدارة
    try {
      const sheetUsers = await fetchUsersFromAdminSheet();
      const sUser = sheetUsers.find(u => u.id === userId);
      if (sUser) {
        return {
          id: sUser.id,
          email: sUser.email,
          full_name: sUser.full_name,
          role: sUser.role,
          is_active: sUser.is_active,
          created_at: new Date(),
          gemini_api_key: sUser.gemini_api_key,
          sheet_id: sUser.sheet_id,
          webhook_url: sUser.webhook_url
        };
      }
    } catch {}

    if (isUsingPostgres()) {
      const res = await pool.query(
        `SELECT u.id, u.email, u.full_name, u.phone, u.is_active, u.created_at, r.name as role 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.id = $1`,
        [userId]
      );
      if (res.rows.length === 0) {
        throw { statusCode: 404, message: 'المستخدم غير موجود' };
      }
      return res.rows[0];
    } else {
      const user = inMemoryStore.users.find(u => u.id === userId);
      if (!user) throw { statusCode: 404, message: 'المستخدم غير موجود' };
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: (user.role_name || 'medical_rep') as UserRole,
        is_active: user.is_active,
        created_at: user.created_at
      };
    }
  }

  // 4. استعراض كافة المندوبين والمستخدمين (دمج شيت الإدارة مع النظام)
  static async listUsers(roleFilter?: UserRole): Promise<UserResponse[]> {
    const result: UserResponse[] = [];
    const seenEmails = new Set<string>();

    // جلب من شيت الإدارة
    try {
      const sheetUsers = await fetchUsersFromAdminSheet();
      for (const su of sheetUsers) {
        if (!seenEmails.has(su.email)) {
          seenEmails.add(su.email);
          if (!roleFilter || su.role === roleFilter) {
            result.push({
              id: su.id,
              email: su.email,
              full_name: su.full_name,
              role: su.role,
              is_active: su.is_active,
              created_at: new Date(),
              gemini_api_key: su.gemini_api_key,
              sheet_id: su.sheet_id,
              webhook_url: su.webhook_url
            });
          }
        }
      }
    } catch {}

    // جلب من التخزين المحلي
    const localUsers = inMemoryStore.users;
    for (const lu of localUsers) {
      if (!seenEmails.has(lu.email.toLowerCase())) {
        seenEmails.add(lu.email.toLowerCase());
        const role = (lu.role_name || 'medical_rep') as UserRole;
        if (!roleFilter || role === roleFilter) {
          result.push({
            id: lu.id,
            email: lu.email,
            full_name: lu.full_name,
            phone: lu.phone,
            role,
            is_active: lu.is_active,
            created_at: lu.created_at
          });
        }
      }
    }

    return result;
  }
}
