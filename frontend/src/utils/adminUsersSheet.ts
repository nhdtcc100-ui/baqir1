import { UserRole } from '../types';

export const ADMIN_SHEET_ID = '1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI';
export const ADMIN_SHEET_URL = `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/edit?usp=sharing`;
export const DEFAULT_INVOICE_SHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
export const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNVERdMAD6DfcaW6oGOSOZeuuNv-0j2qJ1HVndYMILL8eWkcD5PJ1fG3sJkLV80-qs/exec';

export interface AdminSheetUser {
  rowNumber: number;
  id: string;
  full_name: string;
  email: string;
  username: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  sheet_id?: string;
  sheet_url?: string;
  webhook_url?: string;
  gemini_api_key?: string;
}

export function normalizeDigits(str: string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str || '')
    .replace(/[٠-٩]/g, w => String(arabicDigits.indexOf(w)))
    .replace(/[۰-۹]/g, w => String(persianDigits.indexOf(w)));
}

export function normalizePersonName(raw: string): string {
  return normalizeDigits(String(raw || ''))
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/^(د\.|دكتور)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * فقط حساب "باقر" يفتح كأدمن، وجميع بقية الحسابات يدخلون كمندوبين.
 */
export function isBaqerAdmin(name: string, email?: string): boolean {
  const n = normalizePersonName(name);
  const e = String(email || '').trim().toLowerCase();
  if (
    n === 'باقر' ||
    n === 'باقر علي' ||
    n.startsWith('باقر ') ||
    n === 'baqer' ||
    n === 'baqir'
  ) {
    return true;
  }
  if (e === 'baqer@pharma.com' || e === 'admin@pharma.com') {
    return true;
  }
  return false;
}

export function extractGoogleSheetId(raw?: string): string {
  const s = String(raw || '').trim();
  if (!s) return '';
  const match = s.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(s)) return s;
  return '';
}

function readGvizCellText(cell: any): string {
  if (!cell) return '';
  if (cell.f !== undefined && cell.f !== null && String(cell.f).trim() !== '') {
    return String(cell.f).trim();
  }
  if (cell.v !== undefined && cell.v !== null) {
    if (typeof cell.v === 'number') {
      return Number.isInteger(cell.v) ? String(cell.v) : String(cell.v);
    }
    return String(cell.v).trim();
  }
  return '';
}

interface SheetColIndices {
  nameCol: number;
  passCol: number;
  sheetCol: number;
  webhookCol: number;
  emailCol: number;
  idCol: number;
  roleCol: number;
  activeCol: number;
  geminiCol: number;
}

function resolveHeaderIndices(headers: string[]): SheetColIndices {
  const norm = headers.map(h => normalizePersonName(h));
  const findIdx = (patterns: string[]): number =>
    norm.findIndex(h => h && patterns.some(p => h.includes(p)));

  const hasLegacyIdFirst = norm[0] === 'id' || norm[0]?.includes('معرف');
  const hasArabicMaster =
    norm.some(h => h.includes('الاسم')) ||
    norm.some(h => h.includes('الرمز')) ||
    norm.some(h => h.includes('صفحه')) ||
    norm.some(h => h.includes('اي بي اي'));

  if (hasArabicMaster || !hasLegacyIdFirst) {
    const nameCol = findIdx(['الاسم', 'full_name', 'name']);
    const passCol = findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']);
    const sheetCol = findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']);
    const webhookCol = findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']);
    const emailCol = findIdx(['email', 'بريد', 'username']);
    const idCol = findIdx(['^id$', 'المعرف']);
    const roleCol = findIdx(['role', 'دور', 'صلاحيه']);
    const activeCol = findIdx(['is_active', 'الحاله']);
    const geminiCol = findIdx(['gemini', 'مفتاح']);

    return {
      nameCol: nameCol >= 0 ? nameCol : 0,
      passCol: passCol >= 0 ? passCol : 1,
      sheetCol: sheetCol >= 0 ? sheetCol : 2,
      webhookCol: webhookCol >= 0 ? webhookCol : 3,
      emailCol,
      idCol,
      roleCol,
      activeCol,
      geminiCol
    };
  }

  // Legacy 9-11 column schema fallback
  return {
    idCol: 0,
    nameCol: 1,
    emailCol: 2,
    passCol: 3,
    roleCol: 4,
    activeCol: 5,
    geminiCol: 6,
    sheetCol: 7,
    webhookCol: 8
  };
}

/**
 * تحليل استجابة GViz من الشيت الرئيسي إلى قائمة مستخدمين موحدة مهما كان ترتيب الأعمدة.
 */
export function parseAdminSheetGvizPayload(parsed: any): AdminSheetUser[] {
  const cols: any[] = parsed?.table?.cols || [];
  const rawRows: any[] = parsed?.table?.rows || [];
  if (!Array.isArray(rawRows) || rawRows.length === 0) return [];

  const colLabels = cols.map(c => String(c?.label || '').trim());
  const parsedNumHeaders = Number(parsed?.table?.parsedNumHeaders || 0);
  const firstRowCells = (rawRows[0]?.c || []).map((cell: any) => readGvizCellText(cell));

  const labelsHaveHeader = colLabels.some(l => {
    const nl = normalizePersonName(l);
    return nl.includes('الاسم') || nl.includes('الرمز') || nl === 'id' || nl === 'full_name' || nl === 'email';
  });

  let headers = colLabels;
  let startIdx = 0;
  let sheetRowBase = parsedNumHeaders > 0 ? parsedNumHeaders + 1 : 2;

  if (!labelsHaveHeader && firstRowCells.some(Boolean)) {
    const firstLooksLikeHeader = firstRowCells.some((cell: string) => {
      const nl = normalizePersonName(cell);
      return nl.includes('الاسم') || nl.includes('الرمز') || nl === 'id' || nl === 'full_name';
    });
    if (firstLooksLikeHeader) {
      headers = firstRowCells;
      startIdx = 1;
      sheetRowBase = 1;
    }
  }

  const idx = resolveHeaderIndices(headers);
  const users: AdminSheetUser[] = [];

  for (let i = startIdx; i < rawRows.length; i++) {
    const c = rawRows[i]?.c || [];
    const get = (colIdx: number) => (colIdx >= 0 ? readGvizCellText(c[colIdx]) : '');

    const rawName = get(idx.nameCol);
    const rawPass = normalizeDigits(get(idx.passCol));
    const rawEmailCol = get(idx.emailCol);
    const rawSheet = get(idx.sheetCol);
    const rawWebhook = get(idx.webhookCol);
    const rawId = get(idx.idCol);
    const rawActive = get(idx.activeCol);
    const rawGemini = get(idx.geminiCol);

    if (!rawName && !rawEmailCol) continue;

    const normNameCheck = normalizePersonName(rawName);
    if (
      normNameCheck === 'الاسم' ||
      normNameCheck === 'full_name' ||
      normNameCheck === 'a' ||
      rawId.toLowerCase() === 'id'
    ) {
      continue;
    }

    if (rawActive) {
      const act = rawActive.trim().toUpperCase();
      if (act === 'FALSE' || act === '0' || act === 'معطل') continue;
    }

    const displayName = rawName || rawEmailCol.split('@')[0];
    const loginIdentifier = (rawName || rawEmailCol).trim();
    const safeSlug = loginIdentifier
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_\u0621-\u064a-]/gi, '') || `rep_${i}`;
    const email = rawEmailCol.includes('@')
      ? rawEmailCol.toLowerCase()
      : `${safeSlug}@pharma.com`;

    const isAdmin = isBaqerAdmin(displayName, email);
    const role: UserRole = isAdmin ? 'admin' : 'medical_rep';
    const sheetId = extractGoogleSheetId(rawSheet) || undefined;
    const sheetUrl = sheetId
      ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`
      : (rawSheet.startsWith('http') ? rawSheet : undefined);

    let webhookUrl = rawWebhook && rawWebhook.startsWith('http') ? rawWebhook : undefined;
    if (!webhookUrl && isAdmin) {
      webhookUrl = DEFAULT_APPS_SCRIPT_URL;
    }

    const rowNumber = parsedNumHeaders > 0 ? i + parsedNumHeaders + 1 : i + sheetRowBase;

    users.push({
      rowNumber,
      id: rawId || `sheet-usr-${rowNumber}`,
      full_name: displayName,
      email,
      username: loginIdentifier,
      password_hash: rawPass,
      role,
      is_active: true,
      sheet_id: sheetId,
      sheet_url: sheetUrl,
      webhook_url: webhookUrl,
      gemini_api_key: rawGemini || undefined
    });
  }

  return users;
}
