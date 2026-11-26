import { User, Pharmacy, Product, Invoice, KPISummary } from '../types';
import { prepareInvoiceFile, PreparedInvoiceFile } from '../utils/imageCompressor';
import { detectDosageFormClient, detectAreaFromText } from '../utils/invoiceTableParser';
import { APPS_SCRIPT_V2_CODE } from '../utils/appsScriptTemplate';
import {
  normalizePharmacyName,
  normalizeDateYmd,
  buildItemsSignature,
  parseSheetNumber,
  groupSheetRowsLogical,
  checkInvoiceAgainstSheet,
  buildFullInvoiceCompositeKey
} from '../utils/duplicateDetector';
import {
  ADMIN_SHEET_ID,
  ADMIN_SHEET_URL,
  DEFAULT_INVOICE_SHEET_ID,
  DEFAULT_APPS_SCRIPT_URL,
  AdminSheetUser,
  normalizeDigits,
  normalizePersonName,
  isBaqerAdmin,
  extractGoogleSheetId,
  parseAdminSheetGvizPayload,
  parseAdminSheetCsvPayload,
  parseAdminSheetWebhookUsers,
  mergeAdminSheetUsers,
  extractSharedGeminiKey,
  hasAssignedDatabase
} from '../utils/adminUsersSheet';

export const NO_DATABASE_ERROR_MSG =
  'عذراً، لا تملك أي قاعدة بيانات (صفحة كوكل شيت) مرتبطة بحسابك في الشيت الرئيسي — تم منع الدخول إلى بيانات الإدارة لحماية الخصوصية. يرجى مراجعة المدير (باقر) لإضافة رابط صفحتك الخاصة.';

const LS_SHARED_GEMINI_KEY = 'pharma_sheet_shared_gemini_key';

export const hasUserDatabase = (u?: User | null): boolean => hasAssignedDatabase(u ?? getCurrentUser());

const DEFAULT_API_BASE = (import.meta.env?.VITE_API_BASE || 'http://localhost:5000/api/v1').replace(/\/$/, '');
const DEFAULT_SHEET_ID = DEFAULT_INVOICE_SHEET_ID;
const DEFAULT_SHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_ID}/edit?usp=sharing`;
const DEFAULT_WEBHOOK_URL = DEFAULT_APPS_SCRIPT_URL;

const LEGACY_STALE_ADMIN_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyxEXPVY7glHZlXL6c6af3ryZib9AtCVsM5oaljxyxIMKnyY7VlCH-UhCGBBrnVmz1o/exec';

export const getAdminWebhookUrl = (): string => {
  const saved = (localStorage.getItem('pharma_admin_webhook_url') || '').trim();
  if (!saved || saved === LEGACY_STALE_ADMIN_WEBHOOK) {
    return DEFAULT_WEBHOOK_URL;
  }
  return saved;
};

export const setAdminWebhookUrl = (url: string) => {
  if (url.trim()) localStorage.setItem('pharma_admin_webhook_url', url.trim());
  else localStorage.removeItem('pharma_admin_webhook_url');
};

export const getApiBase = (): string => {
  const custom = localStorage.getItem('pharma_api_base');
  return (custom && custom.trim() ? custom.trim() : DEFAULT_API_BASE).replace(/\/$/, '');
};

export const setApiBase = (url: string) => {
  if (url.trim()) localStorage.setItem('pharma_api_base', url.trim().replace(/\/$/, ''));
  else localStorage.removeItem('pharma_api_base');
};

export const getSavedGeminiKey = (): string => {
  return (
    localStorage.getItem(LS_SHARED_GEMINI_KEY) ||
    getCurrentUser()?.gemini_api_key ||
    localStorage.getItem('pharma_gemini_api_key') ||
    ''
  ).trim();
};

export const setSavedGeminiKey = (key: string) => {
  if (key.trim()) {
    localStorage.setItem('pharma_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('pharma_gemini_api_key');
    localStorage.removeItem(LS_SHARED_GEMINI_KEY);
  }
};

export const getSavedWebhookUrl = (): string => {
  const user = getCurrentUser();
  if (user) {
    if (!hasAssignedDatabase(user)) return '';
    const perUser = localStorage.getItem(`pharma_webhook_url::${user.id}`) || '';
    if (perUser.trim()) return perUser.trim();
    if (user.webhook_url && user.webhook_url.trim()) return user.webhook_url.trim();
    return getAdminWebhookUrl() || DEFAULT_WEBHOOK_URL;
  }
  return '';
};

export const getSavedSheetId = (): string => {
  const user = getCurrentUser();
  if (!user) return '';
  if (user.sheet_id && user.sheet_id.trim()) {
    const id = extractGoogleSheetId(user.sheet_id) || user.sheet_id.trim();
    if (id) return id;
  }
  if (user.sheet_url && user.sheet_url.trim()) {
    const m = extractGoogleSheetId(user.sheet_url);
    if (m) return m;
  }
  if (user.role === 'admin') return DEFAULT_SHEET_ID;
  return '';
};

export const getSavedSheetUrl = (): string => {
  const user = getCurrentUser();
  if (!user || !hasAssignedDatabase(user)) return '';
  if (user?.sheet_url && user.sheet_url.trim()) return user.sheet_url.trim();
  const id = getSavedSheetId();
  return id ? `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing` : '';
};

// ── Seed / Mock Fallback Data ────────────────────────────────────────────────
const MOCK_PHARMACIES: Pharmacy[] = [
  { id: 'ph-1', name: 'صيدلية دواء / شارع فلسطين', city: 'بغداد', area: 'شارع فلسطين', address: 'بغداد - شارع فلسطين مقابل ساحة بيروت', phone: '07701234567', assigned_rep_name: 'علي حسن (مندوب الرصافة)', total_invoices: 2, total_sales: 197510 },
  { id: 'ph-2', name: 'صيدلية المطرقة', city: 'بغداد', area: 'الزعفرانية', address: 'بغداد - الزعفرانية السوق العام', phone: '07801234568', assigned_rep_name: 'علي حسن (مندوب الرصافة)', total_invoices: 1, total_sales: 1065500 },
  { id: 'ph-3', name: 'صيدلية النور الحديثة', city: 'بغداد', area: 'الكرادة', address: 'بغداد - الكرادة خارج', phone: '07901234569', assigned_rep_name: 'أحمد خليل (مندوب الكرخ)', total_invoices: 0, total_sales: 0 },
  { id: 'ph-4', name: 'صيدلية الشفاء التخصصية', city: 'بغداد', area: 'المنصور', address: 'بغداد - المنصور شارع 14 رمضان', phone: '07709876543', assigned_rep_name: 'أحمد خليل (مندوب الكرخ)', total_invoices: 0, total_sales: 0 }
];

const MOCK_PRODUCTS: Product[] = [
  { id: 'pr-1', name: 'Elica Cream 30g Jamjoom', product_type: 'cream', base_price: 4828, is_active: true },
  { id: 'pr-2', name: 'Hyfresh Drop 10ml', product_type: 'drop', base_price: 5267, is_active: true },
  { id: 'pr-3', name: 'Fucidin Ointment 20g', product_type: 'ointment', base_price: 3750, is_active: true },
  { id: 'pr-4', name: 'Panadol Extra Tablets', product_type: 'other', base_price: 2500, is_active: true }
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoice_number: '691659',
    invoice_date: '2026-10-27',
    pharmacy_id: 'ph-1',
    pharmacy_name: 'صيدلية دواء / شارع فلسطين',
    pharmacy_city: 'بغداد',
    pharmacy_area: 'شارع فلسطين',
    rep_id: 'rep-rusafa',
    rep_name: 'علي حسن (مندوب الرصافة)',
    status: 'approved',
    total_sales_amount: 144840,
    total_pieces_count: 30,
    total_bonus_count: 3,
    created_at: new Date().toISOString(),
    items: [
      { product_id: 'pr-1', product_name_snapshot: 'Elica Cream 30g Jamjoom', dosage_form: 'كريم', sold_quantity: 30, historical_unit_price: 4828, bonus_quantity: 3, total_quantity: 33, line_total: 144840 }
    ]
  },
  {
    id: 'inv-2',
    invoice_number: '1035986',
    invoice_date: '2026-10-25',
    pharmacy_id: 'ph-1',
    pharmacy_name: 'صيدلية دواء / شارع فلسطين',
    pharmacy_city: 'بغداد',
    pharmacy_area: 'شارع فلسطين',
    rep_id: 'rep-rusafa',
    rep_name: 'علي حسن (مندوب الرصافة)',
    status: 'approved',
    total_sales_amount: 52670,
    total_pieces_count: 10,
    total_bonus_count: 1,
    created_at: new Date().toISOString(),
    items: [
      { product_id: 'pr-2', product_name_snapshot: 'Hyfresh Drop 10ml', dosage_form: 'قطرة', sold_quantity: 10, historical_unit_price: 5267, bonus_quantity: 1, total_quantity: 11, line_total: 52670 }
    ]
  },
  {
    id: 'inv-3',
    invoice_number: '21084',
    invoice_date: '2026-11-04',
    pharmacy_id: 'ph-2',
    pharmacy_name: 'صيدلية المطرقة',
    pharmacy_city: 'بغداد',
    pharmacy_area: 'الزعفرانية',
    rep_id: 'rep-rusafa',
    rep_name: 'علي حسن (مندوب الرصافة)',
    status: 'pending_review',
    total_sales_amount: 1065500,
    total_pieces_count: 8,
    total_bonus_count: 0,
    created_at: new Date().toISOString(),
    items: [
      { product_id: 'pr-2', product_name_snapshot: 'قطرة أذن مضادة للألم', dosage_form: 'قطرة', sold_quantity: 3, historical_unit_price: 4100, bonus_quantity: 0, total_quantity: 3, line_total: 12300 },
      { product_id: 'pr-2', product_name_snapshot: 'قطرة أذن مضادة للألم', dosage_form: 'قطرة', sold_quantity: 5, historical_unit_price: 210640, bonus_quantity: 0, total_quantity: 5, line_total: 1053200 }
    ]
  }
];

const SEED_USERS: User[] = [
  { id: 'admin-baqer', email: 'admin@pharma.com', full_name: 'د. باقر (مدير عام)', role: 'admin', is_active: true },
  { id: 'sup-1', email: 'supervisor@pharma.com', full_name: 'مشرف المبيعات', role: 'supervisor', is_active: true },
  { id: 'rep-rusafa', email: 'rusafa@pharma.com', full_name: 'علي حسن (مندوب الرصافة)', role: 'medical_rep', area: 'الرصافة', is_active: true },
  { id: 'rep-karkh', email: 'karkh@pharma.com', full_name: 'أحمد خليل (مندوب الكرخ)', role: 'medical_rep', area: 'الكرخ', is_active: true }
];

// ── Persistent Local Storage Store (Scoped Per User / Personal Google Sheet) ──────────
const LS_PHARMACIES_KEY = 'pharma_local_pharmacies_v1';
const LS_INVOICES_KEY = 'pharma_local_invoices_v1';

function getScopedStorageKey(baseKey: string): string {
  const user = getCurrentUser();
  if (!user) return `${baseKey}::anon`;
  const personalSheet = user.sheet_id || extractGoogleSheetId(user.sheet_url);
  const sheetScope = personalSheet || (user.role === 'admin' ? DEFAULT_SHEET_ID : `no_db_${user.id}`);
  return `${baseKey}::${sheetScope}`;
}

function getStoredPharmacies(): Pharmacy[] {
  const user = getCurrentUser();
  if (!hasAssignedDatabase(user)) return [];
  try {
    const raw = localStorage.getItem(getScopedStorageKey(LS_PHARMACIES_KEY));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return user?.role === 'admin' && getSavedSheetId() === DEFAULT_SHEET_ID ? [...MOCK_PHARMACIES] : [];
}

function saveStoredPharmacies(list: Pharmacy[]) {
  if (!hasAssignedDatabase(getCurrentUser())) return;
  try {
    localStorage.setItem(getScopedStorageKey(LS_PHARMACIES_KEY), JSON.stringify(list));
  } catch { /* ignore */ }
}

function getStoredInvoices(): Invoice[] {
  const user = getCurrentUser();
  if (!hasAssignedDatabase(user)) return [];
  try {
    const raw = localStorage.getItem(getScopedStorageKey(LS_INVOICES_KEY));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return user?.role === 'admin' && getSavedSheetId() === DEFAULT_SHEET_ID ? [...MOCK_INVOICES] : [];
}

function saveStoredInvoices(list: Invoice[]) {
  if (!hasAssignedDatabase(getCurrentUser())) return;
  const key = getScopedStorageKey(LS_INVOICES_KEY);
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Trim heavy base64 images if localStorage quota is exceeded
    try {
      const stripped = list.map((inv, idx) =>
        idx > 3 && inv.image_url?.startsWith('data:') ? { ...inv, image_url: undefined } : inv
      );
      localStorage.setItem(key, JSON.stringify(stripped));
    } catch { /* ignore */ }
  }
}

function isNetworkError(err: any): boolean {
  if (!err) return false;
  const msg = String(err.message || err).toLowerCase();
  return (
    err.name === 'TypeError' ||
    err.name === 'AbortError' ||
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('load failed') ||
    msg.includes('timeout') ||
    msg.includes('aborted')
  );
}

export interface OcrProgressUpdate {
  stage: 'inspect' | 'prepare' | 'upload' | 'analyze' | 'done';
  percent: number;
  message: string;
}

export interface PendingOcrQueueItem {
  id: string;
  fileName: string;
  mimeType: string;
  dataUrl: string;
  pharmacyId?: string;
  createdAt: string;
  reason: string;
}

const LS_PENDING_OCR_QUEUE_KEY = 'pharma_pending_ocr_queue_v1';

export function getPendingOcrQueue(): PendingOcrQueueItem[] {
  try {
    const raw = localStorage.getItem(LS_PENDING_OCR_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function enqueuePendingOcrScan(item: Omit<PendingOcrQueueItem, 'id' | 'createdAt'>): PendingOcrQueueItem {
  const queue = getPendingOcrQueue();
  const entry: PendingOcrQueueItem = {
    ...item,
    id: 'q-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString()
  };
  // نحتفظ بآخر 5 صور كحد أقصى لتفادي امتلاء localStorage
  const next = [entry, ...queue].slice(0, 5);
  try {
    localStorage.setItem(LS_PENDING_OCR_QUEUE_KEY, JSON.stringify(next));
  } catch {
    try {
      localStorage.setItem(LS_PENDING_OCR_QUEUE_KEY, JSON.stringify(next.slice(0, 2)));
    } catch { /* ignore quota */ }
  }
  return entry;
}

export function removePendingOcrQueueItem(id: string) {
  const next = getPendingOcrQueue().filter(q => q.id !== id);
  try {
    localStorage.setItem(LS_PENDING_OCR_QUEUE_KEY, JSON.stringify(next));
  } catch { /* ignore */ }
}

export function clearPendingOcrQueue() {
  try {
    localStorage.removeItem(LS_PENDING_OCR_QUEUE_KEY);
  } catch { /* ignore */ }
}

/** هل الخادم المهيأ غير قابل للوصول من HTTPS (مثل localhost على GitHub Pages)؟ */
export function isLocalhostFromRemoteHttps(): boolean {
  const apiBase = getApiBase();
  return (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    (apiBase.startsWith('http://localhost') || apiBase.startsWith('http://127.0.0.1'))
  );
}

/** Timeout helper so mobile doesn't wait 60s when localhost:5000 is unreachable */
async function fetchApi(path: string, init?: RequestInit, timeoutMs = 6000): Promise<Response> {
  const apiBase = getApiBase();
  const isRemoteHttpsToLocalhost = isLocalhostFromRemoteHttps();

  // If served on GitHub Pages HTTPS and still targeting default localhost, fail fast in 600ms
  const effectiveTimeout = isRemoteHttpsToLocalhost ? 600 : timeoutMs;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), effectiveTimeout);
  try {
    return await fetch(`${apiBase}${path}`, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * رفع Multipart/FormData عبر XMLHttpRequest مع تتبع نسبة التقدم + Retry (Exponential Backoff)
 * ملاحظة: لا يتم تعيين Content-Type يدوياً حتى يضيف المتصفح boundary تلقائياً.
 */
async function uploadMultipartWithRetry(
  path: string,
  formData: FormData,
  onUploadProgress?: (pct: number) => void,
  maxRetries = 3,
  timeoutMs = 28000
): Promise<any> {
  if (isLocalhostFromRemoteHttps()) {
    throw new TypeError('Localhost backend unreachable from HTTPS origin');
  }

  const apiBase = getApiBase();
  const token = getToken();
  let lastErr: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await new Promise<{ status: number; body: any }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiBase}${path}`, true);
        xhr.timeout = timeoutMs;
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable && onUploadProgress) {
            onUploadProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };
        xhr.onload = () => {
          let json: any = {};
          try { json = JSON.parse(xhr.responseText || '{}'); } catch { /* ignore */ }
          resolve({ status: xhr.status, body: json });
        };
        xhr.onerror = () => reject(new TypeError('Network error during file upload'));
        xhr.ontimeout = () => reject(new TypeError('Upload request timed out'));
        xhr.send(formData);
      });

      if (res.status === 401 || res.status === 403) {
        removeToken();
        removeCurrentUser();
        window.dispatchEvent(new Event('auth:logout'));
        throw new Error('انتهت صلاحية جلسة الدخول، يرجى تسجيل الدخول مجدداً');
      }

      if (res.status >= 200 && res.status < 300) {
        return res.body?.data ?? res.body;
      }

      // أخطاء 4xx (مثل ملف غير صالح 400) لا يُعاد محاولتها
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
        throw new Error(res.body?.error || res.body?.message || `خطأ في التحقق من الملف (${res.status})`);
      }

      throw new Error(res.body?.error || res.body?.message || `Server returned ${res.status}`);
    } catch (err: any) {
      lastErr = err;
      const shouldRetry = attempt < maxRetries && isNetworkError(err);
      if (!shouldRetry) throw err;
      const backoffMs = Math.min(4000, 800 * Math.pow(2, attempt - 1));
      await new Promise(r => setTimeout(r, backoffMs));
    }
  }

  throw lastErr;
}

/**
 * متابعة وظيفة تحليل في الخلفية (Job Polling) إذا أعاد الخادم 202 + jobId
 */
async function pollBackendOcrJob(jobId: string, onProgress?: (pct: number, msg: string) => void): Promise<any> {
  const maxPolls = 30;
  for (let i = 0; i < maxPolls; i++) {
    const res = await fetchApi(`/invoices/ocr-status/${encodeURIComponent(jobId)}`, {
      headers: authHeaders()
    }, 8000);
    const data = await handleResponse<any>(res);
    if (data?.status === 'completed' && data?.result) {
      return data.result;
    }
    if (data?.status === 'failed') {
      throw new Error(data.error || 'فشلت عملية تحليل الفاتورة في الخلفية');
    }
    if (typeof data?.progress === 'number') {
      onProgress?.(data.progress, data.message || 'جاري تحليل الفاتورة بالذكاء الاصطناعي...');
    }
    await new Promise(r => setTimeout(r, 1200));
  }
  throw new Error('انتهت مهلة انتظار نتيجة التحليل من الخادم');
}

// ── Client-Side File DataURL & Direct Gemini Vision OCR ──────────────────────
function fileToBase64DataUrl(file: File, knownMimeType?: string): Promise<{ dataUrl: string; base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIdx = dataUrl.indexOf(',');
      const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
      resolve({
        dataUrl,
        base64,
        mimeType: knownMimeType || file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg')
      });
    };
    reader.onerror = () => reject(new Error('تعذر قراءة الملف من الجهاز، يرجى التحقق من صلاحية الوصول للملفات'));
    reader.readAsDataURL(file);
  });
}

const GEMINI_CANDIDATE_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.0-flash'
];

const IRAQI_PHARMA_OCR_PROMPT = `أنت نظام ذكاء اصطناعي خبير متخصص في قراءة فواتير أدوية المذاخر والمستودعات في العراق.
تجاهل أي نوافذ فيديو أو تشتيت جانبي على لقطات شاشة الهاتف واقرأ الفاتورة بدقة كاملة مهما كانت لغتها (عربية / إنجليزية / مختلطة).

قواعد الاستخراج الصارمة:
1. invoice_number: رقم الفاتورة (مثل SAL-01-596911 أو 21084 أو 44941).
2. invoice_date: التاريخ بصيغة YYYY-MM-DD (مثال: 13/07/2026 -> 2026-07-13).
3. pharmacy_name: الاسم الكامل للصيدلية المشترية بعد "اسم الجهة" أو "المطلوب لـ" أو "Client Info :" أو "الزبون". أضف كلمة "صيدلية" في البداية إن لم توجد. ممنوع إرجاع كلمة "صيدلية" وحدها دون اسمها الكامل. تجاهل حقل Reference #.
4. pharmacy_area: المنطقة/الحي (مثال: الزعفرانية، الكرادة، المنصور، زيونة، مدينة الصدر...).
5. items: مصفوفة الأصناف في جدول الفاتورة:
   - product_name: اسم الدواء كاملاً كما هو مكتوب.
   - dosage_form: يجب أن تكون واحدة من هذه الكلمات الـ 4 فقط: "قطرة" | "كريم" | "مرهم" | "حبوب".
   - quantity: الكمية المباعة كرقم صحيح.
   - unit_price: سعر المفرد بالدينار (أزل الفواصل مثل 5,750 أو 5'750 -> 5750).
   - bonus_quantity: عمود المجاني / البونص / FOC (0 إن لم يوجد).

أعد كائن JSON صحيحاً فقط بدون أي نص أو Markdown إضافي بهذا الشكل:
{
  "invoice_number": "...",
  "invoice_date": "YYYY-MM-DD",
  "pharmacy_name": "صيدلية ...",
  "pharmacy_area": "...",
  "items": [
    { "product_name": "...", "dosage_form": "قطرة|كريم|مرهم|حبوب", "quantity": 10, "unit_price": 5000, "bonus_quantity": 0 }
  ],
  "confidence": 0.95
}`;

function formatGeminiErrorArabic(status: number, apiMessage: string): string {
  const low = (apiMessage || '').toLowerCase();
  if (low.includes('free tier is not available') || low.includes('set up billing')) {
    return 'الباقة المجانية لـ Gemini متوقفة حالياً على هذا المشروع (403) — فعّل الفوترة في Google AI Studio أو أنشئ مفتاحاً من مشروع/حساب جديد.';
  }
  if (status === 400 && (low.includes('api key') || low.includes('api_key_invalid'))) {
    return 'مفتاح Gemini API غير صالح (تأكد من نسخه كاملاً دون مسافات سواء بدأ بـ AQ. أو AIzaSy).';
  }
  if (status === 401 || status === 403) {
    return `تم رفض الطلب من Gemini (${status}): ${apiMessage || 'تحقق من تفعيل Generative Language API وصلاحيات المفتاح.'}`;
  }
  if (status === 429) {
    return 'تم تجاوز حد الطلبات المجاني لمفتاح Gemini مؤقتاً (429). انتظر ثوانٍ وحاول مجدداً.';
  }
  if (status === 404) {
    return 'نموذج Gemini غير متاح لهذا المفتاح (404).';
  }
  return `خطأ من خادم Gemini (${status}): ${apiMessage || 'استجابة غير متوقعة'}`;
}

export type AiVisionProvider = 'groq' | 'openrouter' | 'gemini';

const CLIENT_OCR_CACHE_TTL_MS = 30 * 60 * 1000;
const CLIENT_OCR_CACHE_MAX = 50;
const CLIENT_OCR_CIRCUIT_MS = 10 * 60 * 1000;
const CLIENT_OCR_MAX_RETRIES = 3;
const LS_OCR_BREAKER_KEY = 'pharma_client_ocr_breaker_v1';

const clientOcrShaCache = new Map<string, { expiresAt: number; result: any }>();
const memoryOcrBreakers = new Map<string, { openUntil: number; reason: string; statusCode?: number }>();

function shortKeyFingerprint(key: string): string {
  const k = (key || '').trim();
  if (!k) return 'none';
  let h = 2166136261;
  for (let i = 0; i < k.length; i++) {
    h ^= k.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export async function computeBlobSha256Hex(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  if (typeof crypto !== 'undefined' && crypto.subtle?.digest) {
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const view = new Uint8Array(buf);
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < view.length; i++) {
    h1 = Math.imul(h1 ^ view[i], 0x01000193);
    h2 = Math.imul(h2 ^ (view[i] + i), 0x85ebca6b);
  }
  return `${view.length}-${(h1 >>> 0).toString(16)}-${(h2 >>> 0).toString(16)}`;
}

export function getClientOcrCircuitBreakerStatus(apiKey?: string): { open: boolean; remainingMs: number; reason?: string; statusCode?: number } {
  const fp = shortKeyFingerprint(apiKey ?? getSavedGeminiKey());
  let st = memoryOcrBreakers.get(fp);
  if (!st && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LS_OCR_BREAKER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.[fp]) st = parsed[fp];
      }
    } catch { /* ignore */ }
  }
  if (!st) return { open: false, remainingMs: 0 };
  const remainingMs = st.openUntil - Date.now();
  if (remainingMs <= 0) {
    clearClientOcrCircuitBreaker(apiKey ?? getSavedGeminiKey());
    return { open: false, remainingMs: 0 };
  }
  memoryOcrBreakers.set(fp, st);
  return { open: true, remainingMs, reason: st.reason, statusCode: st.statusCode };
}

export function tripClientOcrCircuitBreaker(apiKey: string | undefined, reason: string, statusCode?: number) {
  const fp = shortKeyFingerprint(apiKey ?? getSavedGeminiKey());
  const entry = { openUntil: Date.now() + CLIENT_OCR_CIRCUIT_MS, reason, statusCode };
  memoryOcrBreakers.set(fp, entry);
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LS_OCR_BREAKER_KEY);
      const map = raw ? JSON.parse(raw) : {};
      map[fp] = entry;
      localStorage.setItem(LS_OCR_BREAKER_KEY, JSON.stringify(map));
    } catch { /* ignore */ }
  }
}

export function clearClientOcrCircuitBreaker(apiKey?: string) {
  if (apiKey === undefined) {
    memoryOcrBreakers.clear();
    if (typeof localStorage !== 'undefined') {
      try { localStorage.removeItem(LS_OCR_BREAKER_KEY); } catch { /* ignore */ }
    }
    return;
  }
  const fp = shortKeyFingerprint(apiKey);
  memoryOcrBreakers.delete(fp);
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LS_OCR_BREAKER_KEY);
      if (!raw) return;
      const map = JSON.parse(raw);
      delete map[fp];
      localStorage.setItem(LS_OCR_BREAKER_KEY, JSON.stringify(map));
    } catch { /* ignore */ }
  }
}

function normalizeVisionJsonResponse(rawText: string) {
  const cleaned = (rawText || '').replace(/```json\s*|```/gi, '').trim();
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < 0) {
    throw new Error('لم يُرجع Google Gemini بيانات جدول صالحة (JSON).');
  }
  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
  if (Array.isArray(parsed.items)) {
    parsed.items = parsed.items.map((it: any) => ({
      ...it,
      dosage_form: ['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(it.dosage_form)
        ? it.dosage_form
        : detectDosageFormClient(String(it.product_name || ''))
    }));
  }
  if (!parsed.pharmacy_area && parsed.pharmacy_name) {
    parsed.pharmacy_area = detectAreaFromText(String(parsed.pharmacy_name));
  }
  return parsed;
}

async function runBrowserGeminiOcr(
  fileData: { base64: string; mimeType: string; dataUrl: string },
  apiKey: string,
  onProgress?: (pct: number, msg: string) => void
) {
  let lastError: any = null;

  for (let mIdx = 0; mIdx < GEMINI_CANDIDATE_MODELS.length; mIdx++) {
    const modelName = GEMINI_CANDIDATE_MODELS[mIdx];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

    for (let attempt = 1; attempt <= CLIENT_OCR_MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      try {
        onProgress?.(55 + mIdx * 8, `جاري القراءة الذكية عبر Google Gemini (${modelName})...`);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: IRAQI_PHARMA_OCR_PROMPT },
                { inline_data: { mime_type: fileData.mimeType, data: fileData.base64 } }
              ]
            }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          })
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          const apiMsg = errJson?.error?.message || res.statusText || '';
          const msg = formatGeminiErrorArabic(res.status, apiMsg);
          const lowMsg = apiMsg.toLowerCase();

          if (res.status === 400 && lowMsg.includes('api_key_invalid')) {
            throw Object.assign(new Error(msg), { fatalAuth: true, statusCode: 400 });
          }
          // إيقاف الباقة المجانية على المشروع (403) -> تفعيل قاطع الدائرة فوراً
          if (res.status === 403 && (lowMsg.includes('free tier') || lowMsg.includes('set up billing'))) {
            throw Object.assign(new Error(msg), { statusCode: 403, shouldTripCircuit: true, fatalBilling: true });
          }
          if (res.status === 404 || res.status === 403) {
            lastError = Object.assign(new Error(msg), {
              statusCode: res.status,
              shouldTripCircuit: res.status === 403
            });
            break;
          }
          if ((res.status === 429 || res.status >= 500) && attempt < CLIENT_OCR_MAX_RETRIES) {
            lastError = Object.assign(new Error(msg), {
              statusCode: res.status,
              shouldTripCircuit: res.status === 429
            });
            await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
            continue;
          }
          throw Object.assign(new Error(msg), {
            statusCode: res.status,
            shouldTripCircuit: res.status === 429
          });
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = normalizeVisionJsonResponse(rawText);
        return { parsed, modelUsed: modelName };
      } catch (err: any) {
        clearTimeout(timer);
        if (err?.fatalAuth || err?.fatalBilling) throw err;
        lastError = err?.name === 'AbortError'
          ? Object.assign(new Error('انتهت مهلة الاتصال بـ Gemini API (تأكد من سرعة الإنترنت)'), { statusCode: 408 })
          : err;
        if (attempt < CLIENT_OCR_MAX_RETRIES && !err?.statusCode) {
          await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
          continue;
        }
      } finally {
        clearTimeout(timer);
      }
    }
  }

  throw lastError || new Error('تعذر تحليل الفاتورة عبر جميع نماذج Google Gemini.');
}

let lastSharedGemSyncAt = 0;

/**
 * جلب المستخدمين من الشيت الرئيسي كقاعدة بيانات (يدعم CSV + Webhook + GViz حتى عند خلط الأرقام والنصوص في الرمز السري مثل keko3)
 * كما يزامن مفتاح Gemini المشترك لجميع المستخدمين دفعة واحدة.
 */
async function fetchAdminSheetUsersInBrowser(): Promise<AdminSheetUser[]> {
  const adminHook = getAdminWebhookUrl();
  const tasks: Promise<AdminSheetUser[]>[] = [];

  // 1) تصدير CSV المباشر (لا يخفي الخلايا النصية داخل عمود أرقام)
  tasks.push((async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/export?format=csv&_t=${Date.now()}`, { signal: controller.signal })
        .finally(() => clearTimeout(timer));
      if (!res.ok) return [];
      return parseAdminSheetCsvPayload(await res.text());
    } catch { return []; }
  })());

  // 2) Apps Script Webhook (?action=users) — يقرأ مباشرة من SpreadsheetApp بدقة 100%
  if (adminHook && adminHook.startsWith('http')) {
    tasks.push((async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5500);
        const res = await fetch(`${adminHook}?action=users&_t=${Date.now()}`, { signal: controller.signal })
          .finally(() => clearTimeout(timer));
        if (!res.ok) return [];
        const data = await res.json().catch(() => null);
        if (data?.success && Array.isArray(data.users)) {
          return parseAdminSheetWebhookUsers(data.users);
        }
        return [];
      } catch { return []; }
    })());
  }

  // 3) GViz JSON
  tasks.push((async () => {
    const urls = [
      `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/gviz/tq?tqx=out:json&_t=${Date.now()}`,
      `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent('المستخدمون')}&_t=${Date.now()}`
    ];
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
        if (!res.ok) continue;
        const text = await res.text();
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
        if (!match?.[1]) continue;
        const users = parseAdminSheetGvizPayload(JSON.parse(match[1]));
        if (users.length > 0) return users;
      } catch { /* try next */ }
    }
    return [];
  })());

  const settled = await Promise.allSettled(tasks);
  const nonEmptyLists = settled
    .filter((r): r is PromiseFulfilledResult<AdminSheetUser[]> => r.status === 'fulfilled' && r.value.length > 0)
    .map(r => r.value);

  if (nonEmptyLists.length === 0) return [];
  const merged = mergeAdminSheetUsers(...nonEmptyLists);

  const sharedGem = extractSharedGeminiKey(merged);
  if (sharedGem) {
    localStorage.setItem(LS_SHARED_GEMINI_KEY, sharedGem);
    localStorage.setItem('pharma_gemini_api_key', sharedGem);
    lastSharedGemSyncAt = Date.now();
  }
  return merged;
}

/**
 * إرسال أمر تعديل / إضافة / حذف إلى Apps Script Webhook بدون CORS preflight
 */
async function sendWebhookCommand(webhookUrl: string, bodyObj: Record<string, any>, timeoutMs = 12000): Promise<{ sent: boolean; parsed?: any; opaque?: boolean }> {
  const body = JSON.stringify(bodyObj);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      signal: controller.signal
    }).finally(() => clearTimeout(timer));
    const txt = await res.text().catch(() => '');
    let parsed: any = null;
    try { parsed = JSON.parse(txt); } catch { /* ignore non-JSON */ }
    return { sent: true, parsed };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('انتهت مهلة الانتظار للاستجابة من Google Apps Script — تحقق من اكتمال العملية في الشيت.');
    }
    // في حال حظر CORS قراءة الاستجابة فقط، نرسل بـ no-cors ثم نتحقق لاحقاً عبر GViz
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });
    return { sent: true, opaque: true };
  }
}

export interface SheetRowPayload {
  invoice_number: string;
  invoice_date: string;
  warehouse_name: string;
  pharmacy_name: string;
  area: string;
  city: string;
  product_name: string;
  dosage_form: string;
  quantity: number;
  unit_price: number;
  bonus_quantity: number;
  line_total: number;
  total_invoice: number;
  rep_name: string;
  status: string;
  timestamp: string;
}

export interface SkippedSheetDuplicateNotice {
  id: string;
  invoice_number: string;
  pharmacy_name: string;
  invoice_date: string;
  reason: string;
  detectedAt: string;
}

export interface PendingSheetsSyncJob {
  id: string;
  action: 'add_invoice' | 'edit_invoice' | 'replace_invoice' | 'delete_invoice' | 'batchAppend' | 'repair';
  targetSheetId?: string;
  targetWebhookUrl?: string;
  invoice_number?: string;
  previous_invoice_number?: string;
  pharmacy_name?: string;
  invoice_date?: string;
  timestamp?: string;
  delete_mode?: 'all' | 'duplicate_copy';
  rows?: SheetRowPayload[];
  createdAt: string;
}

const LS_SHEETS_OUTBOX_KEY = 'pharma_sheets_sync_outbox_v1';
const LS_SHEETS_SKIPPED_DUPS_KEY = 'pharma_sheets_skipped_duplicates_v1';

export function getPendingSkippedSheetDuplicates(): SkippedSheetDuplicateNotice[] {
  try {
    const raw = localStorage.getItem(LS_SHEETS_SKIPPED_DUPS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function addSkippedSheetDuplicateNotices(items: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }>) {
  if (!items || items.length === 0) return;
  try {
    const current = getPendingSkippedSheetDuplicates();
    const mapped: SkippedSheetDuplicateNotice[] = items.map(it => ({
      ...it,
      id: `skip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      detectedAt: new Date().toISOString()
    }));
    const merged = [...mapped, ...current].filter((v, i, arr) =>
      arr.findIndex(x => x.invoice_number === v.invoice_number && x.pharmacy_name === v.pharmacy_name && x.reason === v.reason) === i
    ).slice(0, 20);
    localStorage.setItem(LS_SHEETS_SKIPPED_DUPS_KEY, JSON.stringify(merged));
  } catch { /* ignore */ }
}

export function clearSkippedSheetDuplicateNotices() {
  try { localStorage.removeItem(LS_SHEETS_SKIPPED_DUPS_KEY); } catch { /* ignore */ }
}

export function getPendingSheetsOutbox(): PendingSheetsSyncJob[] {
  try {
    const raw = localStorage.getItem(LS_SHEETS_OUTBOX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function savePendingSheetsOutbox(jobs: PendingSheetsSyncJob[]) {
  try {
    if (jobs.length === 0) localStorage.removeItem(LS_SHEETS_OUTBOX_KEY);
    else localStorage.setItem(LS_SHEETS_OUTBOX_KEY, JSON.stringify(jobs.slice(-40)));
  } catch { /* ignore */ }
}

export function formatInvoiceToSheetRows(inv: any): SheetRowPayload[] {
  const items = inv?.items || [];
  const nowStr = new Date().toLocaleString('ar-IQ', {
    timeZone: 'Asia/Baghdad', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const statusText = inv?.status === 'approved' ? 'معتمدة ✓' : inv?.status === 'rejected' ? 'مرفوضة' : 'قيد التدقيق';
  const phName = String(inv?.pharmacy_name || 'صيدلية معتمدة').trim();
  const phCity = String(inv?.pharmacy_city || 'بغداد').trim();
  const phArea = String(inv?.pharmacy_area || (inv as any)?.area || detectAreaFromText(phName) || 'مركز المدينة').trim();

  return items.map((it: any) => {
    const qty = Number(it.sold_quantity || it.quantity || 1);
    const price = Number(it.historical_unit_price || it.custom_unit_price || it.unit_price || 0);
    const bonus = Number(it.bonus_quantity ?? it.custom_bonus ?? 0);
    const lineTotal = Number(it.line_total || qty * price);
    const prodName = String(it.product_name_snapshot || it.custom_product_name || it.product_name || 'مستحضر دوائي').trim();
    const dosage = String(it.dosage_form || detectDosageFormClient(prodName)).trim();
    return {
      invoice_number: String(inv?.invoice_number || '').trim(),
      invoice_date: String(inv?.invoice_date || '').split('T')[0],
      warehouse_name: String(inv?.warehouse_name || 'مذخر الشغف الحديث').trim(),
      pharmacy_name: phName,
      area: phArea,
      city: phCity,
      product_name: prodName,
      dosage_form: ['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(dosage) ? dosage : detectDosageFormClient(prodName),
      quantity: qty,
      unit_price: price,
      bonus_quantity: bonus,
      line_total: lineTotal,
      total_invoice: Number(inv?.total_sales_amount || lineTotal),
      rep_name: String(inv?.rep_name || 'مندوب علمي').trim(),
      status: statusText,
      timestamp: nowStr
    };
  });
}

function mapGvizTableRows(parsed: any): { headers: string[]; rows: any[] } {
  const cols: any[] = parsed?.table?.cols || [];
  const rawRows: any[] = parsed?.table?.rows || [];
  let headers = cols.map((c: any) => String(c?.label || '').trim());
  let startIdx = 0;

  const hasColLabels = headers.some(Boolean);
  if (!hasColLabels && rawRows.length > 0) {
    const row0 = (rawRows[0]?.c || []).map((cell: any) => String(cell?.f ?? cell?.v ?? '').trim());
    if (row0.some((h: string) => h.includes('رقم الفاتورة') || h.includes('اسم الصيدلية') || h.includes('الكمية'))) {
      headers = row0;
      startIdx = 1;
    }
  }
  if (!headers.some(Boolean)) {
    headers = cols.map((c: any) => String(c?.label || c?.id || '').trim());
  }

  const normH = headers.map(h => h.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'));
  const findCol = (pats: string[], fb: number) => {
    const idx = normH.findIndex(h => h && pats.some(p => h.includes(p)));
    return idx >= 0 ? idx : fb;
  };
  const areaColFound = normH.findIndex(h => h && (h.includes('المنطق') || h.includes('المكان')));
  const cityColFound = normH.findIndex(h => h && (h.includes('المدين') || h.includes('المحافظ')));
  const dosageColFound = normH.findIndex(h => h && (h.includes('نوع الماد') || h.includes('الشكل الدوائي')));
  const has16Schema = areaColFound >= 0 && dosageColFound >= 0;
  const colIdx = {
    invoice_number: findCol(['رقم الفاتور'], 0),
    invoice_date:   findCol(['تاريخ الفاتور'], 1),
    warehouse_name: findCol(['المذخر'], 2),
    pharmacy_name:  findCol(['اسم الصيدلي'], 3),
    city:           cityColFound >= 0 ? cityColFound : 4,
    area:           areaColFound >= 0 ? areaColFound : -1,
    product_name:   findCol(['اسم الماد', 'الماده الدوائي'], has16Schema ? 6 : 5),
    dosage_form:    dosageColFound >= 0 ? dosageColFound : -1,
    quantity:       findCol(['الكمي'], has16Schema ? 8 : 6),
    unit_price:     findCol(['سعر المفرد'], has16Schema ? 9 : 7),
    bonus_quantity: findCol(['البونص'], has16Schema ? 10 : 8),
    line_total:     findCol(['المجموع'], has16Schema ? 11 : 9),
    total_invoice:  findCol(['صافي الفاتور'], has16Schema ? 12 : 10),
    rep_name:       findCol(['المندوب'], has16Schema ? 13 : 11),
    status:         findCol(['حاله الاعتماد', 'الحال'], has16Schema ? 14 : 12),
    timestamp:      findCol(['وقت وتاريخ', 'الادراج'], has16Schema ? 15 : 13)
  };

  const rows: any[] = [];
  for (let rIdx = startIdx; rIdx < rawRows.length; rIdx++) {
    const c = rawRows[rIdx]?.c || [];
    const val = (i: number) => (i >= 0 ? String(c[i]?.f ?? c[i]?.v ?? '').trim() : '');
    const num = (i: number) => (i >= 0 ? parseSheetNumber(c[i]?.v ?? c[i]?.f ?? 0) : 0);
    const invNum = val(colIdx.invoice_number);
    const phName = val(colIdx.pharmacy_name);
    const prodName = val(colIdx.product_name);
    if (invNum === '123' || invNum === 'رقم الفاتورة' || (!invNum && !phName && !prodName)) continue;

    const cells = headers.map((_, ci) => val(ci));
    rows.push({
      invoice_number: invNum,
      invoice_date:   val(colIdx.invoice_date),
      warehouse_name: val(colIdx.warehouse_name),
      pharmacy_name:  phName,
      area:           val(colIdx.area),
      city:           val(colIdx.city),
      product_name:   prodName,
      dosage_form:    val(colIdx.dosage_form),
      quantity:       num(colIdx.quantity),
      unit_price:     num(colIdx.unit_price),
      bonus_quantity: num(colIdx.bonus_quantity),
      line_total:     num(colIdx.line_total),
      total_invoice:  num(colIdx.total_invoice),
      rep_name:       val(colIdx.rep_name),
      status:         val(colIdx.status),
      timestamp:      val(colIdx.timestamp),
      cells
    });
  }
  return { headers, rows };
}

async function fetchLiveSheetRowsStatus(): Promise<{ reachable: boolean; rows: any[]; headers?: string[] }> {
  const sheetId = getSavedSheetId();
  if (!sheetId || !hasAssignedDatabase(getCurrentUser())) {
    return { reachable: false, rows: [] };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&_t=${Date.now()}`, { signal: controller.signal })
      .finally(() => clearTimeout(timer));
    if (res.ok) {
      const text = await res.text();
      const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
      if (m?.[1]) {
        const parsed = JSON.parse(m[1]);
        const { headers, rows } = mapGvizTableRows(parsed);
        return { reachable: true, rows, headers };
      }
    }
  } catch { /* fallback to Apps Script GET below */ }

  try {
    const webhookUrl = getSavedWebhookUrl();
    if (webhookUrl && webhookUrl.startsWith('http')) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(`${webhookUrl}?action=sheets&spreadsheetId=${encodeURIComponent(sheetId)}&_t=${Date.now()}`, { signal: controller.signal })
        .finally(() => clearTimeout(timer));
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && Array.isArray(data.rows)) {
          return { reachable: true, rows: data.rows, headers: Array.isArray(data.headers) ? data.headers : [] };
        }
      }
    }
  } catch { /* ignore */ }

  return { reachable: false, rows: [] };
}

async function fetchLiveSheetRowsCompact(): Promise<any[]> {
  const res = await fetchLiveSheetRowsStatus();
  return res.rows;
}

function hydrateLocalInvoicesFromSheetRows(sheetRows: any[]): Invoice[] {
  const curUser = getCurrentUser();
  const groups = new Map<string, any[]>();
  for (const r of sheetRows) {
    const key = `${String(r.invoice_number || r.pharmacy_name || 'row').trim()}::${normalizeDateYmd(r.invoice_date)}::${String(r.timestamp || '').trim()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }
  const built: Invoice[] = [];
  let gIdx = 0;
  for (const grp of groups.values()) {
    gIdx++;
    const first = grp[0];
    const items = grp.map((r: any, idx: number) => {
      const qty = Math.max(1, Number(r.quantity) || 1);
      const price = Number(r.unit_price) || 0;
      const bonus = Number(r.bonus_quantity) || 0;
      const lt = Number(r.line_total) || qty * price;
      return {
        id: `sh-item-${gIdx}-${idx}`,
        product_id: 'pr-1',
        product_name_snapshot: r.product_name || 'مستحضر دوائي',
        dosage_form: r.dosage_form || detectDosageFormClient(r.product_name || ''),
        sold_quantity: qty,
        historical_unit_price: price,
        bonus_quantity: bonus,
        total_quantity: qty + bonus,
        line_total: lt
      };
    });
    const statusRaw = String(first.status || '');
    const status = statusRaw.includes('معتمدة') ? 'approved' : statusRaw.includes('مرفوضة') ? 'rejected' : 'pending_review';
    const totalSales = Number(first.total_invoice) || items.reduce((s, it) => s + it.line_total, 0);
    built.push({
      id: `sh-inv-${first.invoice_number || gIdx}-${gIdx}`,
      invoice_number: first.invoice_number || `INV-${gIdx}`,
      invoice_date: normalizeDateYmd(first.invoice_date) || new Date().toISOString().split('T')[0],
      pharmacy_id: `ph-${gIdx}`,
      pharmacy_name: first.pharmacy_name || 'صيدلية',
      pharmacy_city: first.city || 'بغداد',
      pharmacy_area: first.area || detectAreaFromText(first.pharmacy_name || '') || '',
      rep_id: curUser?.id || 'rep-1',
      rep_name: first.rep_name || curUser?.full_name || 'مندوب علمي',
      status: status as any,
      total_sales_amount: totalSales,
      total_pieces_count: items.reduce((s, it) => s + it.sold_quantity, 0),
      total_bonus_count: items.reduce((s, it) => s + it.bonus_quantity, 0),
      created_at: new Date().toISOString(),
      items
    });
  }
  return built;
}

export function reconcileLocalInvoicesWithSheet(
  localInvoices: Invoice[],
  sheetRows: any[],
  pendingUploadNums: Set<string> = new Set()
): { invoices: Invoice[]; changed: boolean } {
  const hydratedSheetInvoices = sheetRows.length > 0 ? hydrateLocalInvoicesFromSheetRows(sheetRows) : [];
  const usedLocalIndices = new Set<number>();
  const reconciled: Invoice[] = [];
  let changed = false;

  const findLocalMatchIndex = (shInv: Invoice): number => {
    const shComp = buildFullInvoiceCompositeKey({
      pharmacy_name: shInv.pharmacy_name,
      invoice_date: shInv.invoice_date,
      items: shInv.items
    });
    const shNum = String(shInv.invoice_number || '').trim();

    if (shComp) {
      const exactIdx = localInvoices.findIndex((loc, idx) => {
        if (usedLocalIndices.has(idx)) return false;
        const locComp = buildFullInvoiceCompositeKey({
          pharmacy_name: loc.pharmacy_name,
          invoice_date: loc.invoice_date,
          items: loc.items
        });
        if (locComp !== shComp) return false;
        const locNum = String(loc.invoice_number || '').trim();
        return !shNum || !locNum || shNum === locNum;
      });
      if (exactIdx >= 0) return exactIdx;
    }

    if (shNum) {
      const sheetSameNumCount = hydratedSheetInvoices.filter(x => String(x.invoice_number || '').trim() === shNum).length;
      const localSameNumIndices = localInvoices
        .map((x, idx) => ({ x, idx }))
        .filter(({ x, idx }) => !usedLocalIndices.has(idx) && String(x.invoice_number || '').trim() === shNum);
      if (sheetSameNumCount === 1 && localSameNumIndices.length === 1) {
        return localSameNumIndices[0].idx;
      }
    }
    return -1;
  };

  for (const shInv of hydratedSheetInvoices) {
    const matchIdx = findLocalMatchIndex(shInv);
    if (matchIdx >= 0) {
      usedLocalIndices.add(matchIdx);
      const loc = localInvoices[matchIdx];
      const merged: Invoice = {
        ...shInv,
        id: loc.id,
        pharmacy_id: loc.pharmacy_id || shInv.pharmacy_id,
        image_url: loc.image_url,
        notes: loc.notes,
        created_at: loc.created_at || shInv.created_at,
        pending_sheet_upload: false
      };
      const itemsChanged =
        (loc.items?.length || 0) !== (merged.items?.length || 0) ||
        Number(loc.total_sales_amount || 0) !== Number(merged.total_sales_amount || 0) ||
        Number(loc.total_pieces_count || 0) !== Number(merged.total_pieces_count || 0);
      if (
        loc.status !== merged.status ||
        loc.pending_sheet_upload ||
        itemsChanged ||
        String(loc.pharmacy_name || '').trim() !== String(merged.pharmacy_name || '').trim() ||
        String(loc.invoice_date || '').split('T')[0] !== String(merged.invoice_date || '').split('T')[0]
      ) {
        changed = true;
      }
      reconciled.push(merged);
    } else {
      // فاتورة جديدة قادمة من جهاز آخر أو من كوكل شيت مباشرة
      changed = true;
      reconciled.push({ ...shInv, pending_sheet_upload: false });
    }
  }

  // الإبقاء على الفواتير المحلية التي لا تزال بانتظار الرفع فقط، وإسقاط الفواتير المحذوفة من الشيت
  for (let i = 0; i < localInvoices.length; i++) {
    if (usedLocalIndices.has(i)) continue;
    const loc = localInvoices[i];
    const num = String(loc.invoice_number || '').trim();
    if (loc.pending_sheet_upload || (num && pendingUploadNums.has(num))) {
      reconciled.push(loc);
    } else {
      changed = true;
    }
  }

  if (reconciled.length !== localInvoices.length) {
    changed = true;
  }

  reconciled.sort((a, b) => {
    const da = String(b.invoice_date || '').localeCompare(String(a.invoice_date || ''));
    if (da !== 0) return da;
    return String(b.created_at || '').localeCompare(String(a.created_at || ''));
  });

  return { invoices: reconciled, changed };
}

function mergeStoredPharmaciesFromInvoices(invoices: Invoice[]) {
  if (!hasAssignedDatabase(getCurrentUser()) || invoices.length === 0) return;
  const existing = getStoredPharmacies();
  const seen = new Set(existing.map(p => normalizePharmacyName(p.name)));
  let added = false;
  for (const inv of invoices) {
    const phName = String(inv.pharmacy_name || '').trim();
    const norm = normalizePharmacyName(phName);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    existing.push({
      id: inv.pharmacy_id || `ph-sync-${Date.now()}-${existing.length}`,
      name: phName,
      city: inv.pharmacy_city || 'بغداد',
      area: inv.pharmacy_area || detectAreaFromText(phName) || 'مركز المدينة',
      address: `${inv.pharmacy_city || 'بغداد'}${inv.pharmacy_area ? ' - ' + inv.pharmacy_area : ''}`,
      phone: '',
      assigned_rep_name: inv.rep_name || '',
      total_invoices: 0,
      total_sales: 0
    });
    added = true;
  }
  if (added) saveStoredPharmacies(existing);
}

function checkClientInvoiceDuplicateInSheet(inv: any, sheetRows: any[]): { isDuplicate: boolean; isExactMatch: boolean; statusChangedOnly?: boolean; reason: string } {
  const res = checkInvoiceAgainstSheet(inv, sheetRows);
  return {
    isDuplicate: res.isDuplicate,
    isExactMatch: res.isExactMatch,
    statusChangedOnly: res.statusChangedOnly,
    reason: res.reason
  };
}

function enqueueSheetsSyncJob(job: Omit<PendingSheetsSyncJob, 'id' | 'createdAt'>) {
  const existing = getPendingSheetsOutbox();
  const entry: PendingSheetsSyncJob = {
    ...job,
    targetSheetId: job.targetSheetId || getSavedSheetId(),
    targetWebhookUrl: job.targetWebhookUrl || getSavedWebhookUrl(),
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString()
  };
  const filtered = job.action === 'edit_invoice' && job.invoice_number
    ? existing.filter(j => !(j.action === 'edit_invoice' && j.invoice_number === job.invoice_number && (j.targetSheetId || getSavedSheetId()) === entry.targetSheetId))
    : existing;
  savePendingSheetsOutbox([...filtered, entry]);
}

async function flushSheetsSyncOutboxInternal(opts?: { keepalive?: boolean; useBeacon?: boolean }): Promise<{ flushed: number; remaining: number }> {
  const defaultWebhook = getSavedWebhookUrl();
  const jobs = getPendingSheetsOutbox();
  if (jobs.length === 0) {
    return { flushed: 0, remaining: 0 };
  }

  let flushed = 0;
  const remaining: PendingSheetsSyncJob[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const webhookUrl = (job.targetWebhookUrl || defaultWebhook || '').trim();
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      remaining.push(job);
      continue;
    }
    const body = JSON.stringify({
      action: job.action,
      spreadsheetId: job.targetSheetId || getSavedSheetId(),
      sheetName: 'الفواتير',
      invoice_number: job.invoice_number,
      previous_invoice_number: job.previous_invoice_number,
      pharmacy_name: job.pharmacy_name,
      invoice_date: job.invoice_date,
      timestamp: job.timestamp,
      delete_mode: job.delete_mode,
      rows: job.rows || []
    });

    if (opts?.useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function' && body.length < 60000) {
      const ok = navigator.sendBeacon(webhookUrl, new Blob([body], { type: 'text/plain;charset=utf-8' }));
      if (ok) {
        flushed++;
        continue;
      }
    }

    try {
      const canKeepalive = Boolean(opts?.keepalive) && body.length < 60000;
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: canKeepalive,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body
      });
      flushed++;
    } catch {
      remaining.push(...jobs.slice(i));
      break;
    }
  }

  savePendingSheetsOutbox(remaining);
  return { flushed, remaining: remaining.length };
}

// Helper to push an invoice locally and enqueue persistent exit-safe webhook sync
function persistLocalInvoice(payload: any, opts?: { skipSheetCheck?: boolean }): Invoice {
  if (!hasAssignedDatabase(getCurrentUser())) {
    throw new Error(NO_DATABASE_ERROR_MSG);
  }
  const pharmacies = getStoredPharmacies();
  const invoices = getStoredInvoices();
  const curUser = getCurrentUser();

  const cleanTypedName = String(payload.pharmacy_name || '').trim();
  const cleanAreaInput = String(payload.pharmacy_area || '').trim();

  // Prioritize the explicitly typed pharmacy_name; only match pharmacy_id when no custom name overrides it
  let targetPharmacy = cleanTypedName
    ? pharmacies.find(p => p.name.trim().toLowerCase() === cleanTypedName.toLowerCase())
    : pharmacies.find(p => p.id === payload.pharmacy_id);

  if (!targetPharmacy && cleanTypedName) {
    targetPharmacy = {
      id: 'ph-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
      name: cleanTypedName,
      city: 'بغداد',
      area: cleanAreaInput || detectAreaFromText(cleanTypedName) || '',
      address: cleanAreaInput ? `بغداد - ${cleanAreaInput}` : 'بغداد',
      phone: '',
      assigned_rep_id: curUser?.id,
      assigned_rep_name: curUser?.full_name || 'مندوب ميداني',
      total_invoices: 0,
      total_sales: 0
    };
    pharmacies.unshift(targetPharmacy);
    saveStoredPharmacies(pharmacies);
  }

  let totalAmount = 0;
  let totalPieces = 0;
  let totalBonus = 0;

  const builtItems = (payload.items || []).map((it: any, idx: number) => {
    const prod = MOCK_PRODUCTS.find(p => p.id === it.product_id);
    const qty = Number(it.sold_quantity || 1);
    const price = it.custom_unit_price !== undefined ? Number(it.custom_unit_price) : Number(prod?.base_price || 5000);
    const bonus = it.custom_bonus !== undefined ? Number(it.custom_bonus) : (it.bonus_quantity !== undefined ? Number(it.bonus_quantity) : Math.floor(qty / 10));
    const lineTotal = qty * price;
    totalAmount += lineTotal;
    totalPieces += qty;
    totalBonus += bonus;

    return {
      id: `item-${Date.now()}-${idx}`,
      product_id: it.product_id || prod?.id || 'pr-1',
      product_name_snapshot: it.custom_product_name || prod?.name || 'مستحضر دوائي',
      dosage_form: it.dosage_form || 'حبوب',
      sold_quantity: qty,
      historical_unit_price: price,
      bonus_quantity: bonus,
      total_quantity: qty + bonus,
      line_total: lineTotal,
      ocr_confidence: it.ocr_confidence
    };
  });

  const resolvedPharmacyName = targetPharmacy?.name || payload.pharmacy_name || 'صيدلية معتمدة';
  const resolvedArea = String(
    payload.pharmacy_area || (targetPharmacy as any)?.area || detectAreaFromText(resolvedPharmacyName) || ''
  ).trim();

  if (targetPharmacy && resolvedArea && !(targetPharmacy as any).area) {
    (targetPharmacy as any).area = resolvedArea;
    saveStoredPharmacies(pharmacies);
  }

  const newInv: Invoice = {
    id: 'inv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
    invoice_number: payload.invoice_number || `INV-${Date.now().toString().slice(-6)}`,
    invoice_date: payload.invoice_date || new Date().toISOString().split('T')[0],
    pharmacy_id: targetPharmacy?.id || payload.pharmacy_id || 'ph-custom',
    pharmacy_name: resolvedPharmacyName,
    pharmacy_city: targetPharmacy?.city || 'بغداد',
    pharmacy_area: resolvedArea,
    rep_id: curUser?.id || 'rep-rusafa',
    rep_name: curUser?.full_name || 'علي حسن (مندوب الرصافة)',
    status: 'pending_review',
    total_sales_amount: totalAmount,
    total_pieces_count: totalPieces,
    total_bonus_count: totalBonus,
    image_url: payload.image_url,
    notes: payload.notes,
    created_at: new Date().toISOString(),
    items: builtItems,
    pending_sheet_upload: true
  };

  invoices.unshift(newInv);
  saveStoredInvoices(invoices);

  if (!opts?.skipSheetCheck) {
    const rows = formatInvoiceToSheetRows(newInv);
    enqueueSheetsSyncJob({ action: 'add_invoice', invoice_number: newInv.invoice_number, pharmacy_name: newInv.pharmacy_name, invoice_date: newInv.invoice_date, rows });
    flushSheetsSyncOutboxInternal({ keepalive: true }).catch(() => {});
  }

  return newInv;
}

async function persistLocalInvoiceAndSync(payload: any): Promise<Invoice> {
  const newInv = persistLocalInvoice(payload, { skipSheetCheck: true });
  const sheetRows = await fetchLiveSheetRowsCompact();
  const dupCheck = checkClientInvoiceDuplicateInSheet(newInv, sheetRows);

  if (dupCheck.isDuplicate) {
    addSkippedSheetDuplicateNotices([{
      invoice_number: String(newInv.invoice_number || ''),
      pharmacy_name: newInv.pharmacy_name || '',
      invoice_date: (newInv.invoice_date || '').split('T')[0],
      reason: dupCheck.reason
    }]);
    return newInv;
  }

  const rows = formatInvoiceToSheetRows(newInv);
  enqueueSheetsSyncJob({ action: 'add_invoice', invoice_number: String(newInv.invoice_number || ''), pharmacy_name: newInv.pharmacy_name, invoice_date: newInv.invoice_date, rows });
  await Promise.race([
    flushSheetsSyncOutboxInternal({ keepalive: true }),
    new Promise(r => setTimeout(r, 3000))
  ]).catch(() => {});
  return newInv;
}

// ── Token & Session helpers ──────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('pharma_token');
export const setToken = (t: string) => localStorage.setItem('pharma_token', t);
export const removeToken = () => localStorage.removeItem('pharma_token');

export const getCurrentUser = (): User | null => {
  try {
    const d = localStorage.getItem('pharma_user');
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
};
export const setCurrentUser = (u: User) => localStorage.setItem('pharma_user', JSON.stringify(u));
export const removeCurrentUser = () => {
  localStorage.removeItem('pharma_user');
  localStorage.removeItem('pharma_google_sheet_url');
  localStorage.removeItem('pharma_webhook_url');
};

// ── HTTP helpers ─────────────────────────────────────────────────────────────
const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const authHeadersMultipart = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401 || res.status === 403) {
    removeToken();
    removeCurrentUser();
    window.dispatchEvent(new Event('auth:logout'));
    throw new Error('انتهت صلاحية جلسة الدخول، يرجى تسجيل الدخول مجدداً');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || json.message || `خطأ ${res.status}`);
  }
  return json.data as T;
}

// ── API Client ──────────────────────────────────────────────────────────────
export const api = {

  // ── Auth ──
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const cleanId = email.trim();
    const cleanPass = normalizeDigits(password.trim());

    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanId, password: cleanPass })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || json.message || 'الاسم أو الرمز السري غير متطابق مع قاعدة البيانات');
      }
      const token = json.data?.accessToken || json.data?.token;
      const user: User = json.data?.user;
      localStorage.removeItem('pharma_google_sheet_url');
      localStorage.removeItem('pharma_webhook_url');
      setToken(token);
      setCurrentUser(user);
      return { token, user };
    } catch (err: any) {
      if (isNetworkError(err)) {
        // المصادقة المباشرة مع الشيت الرئيسي (قاعدة بيانات Google Sheets)
        const sheetUsers = await fetchAdminSheetUsersInBrowser();
        if (sheetUsers.length === 0) {
          throw new Error('تعذر الاتصال بجدول البيانات الرئيسي (Google Sheet) — يرجى التحقق من اتصال الإنترنت.');
        }

        const normTarget = normalizePersonName(cleanId);
        const lowTarget = cleanId.toLowerCase();
        const matchedUser = sheetUsers.find(u => {
          const uNormName = normalizePersonName(u.full_name);
          const uEmail = (u.email || '').toLowerCase();
          return (
            u.full_name.trim() === cleanId ||
            (Boolean(normTarget) && uNormName === normTarget) ||
            uEmail === lowTarget ||
            uEmail.split('@')[0] === lowTarget
          );
        });

        if (!matchedUser) {
          throw new Error('الاسم أو الرمز السري غير متطابق مع قاعدة البيانات');
        }

        const storedPwd = normalizeDigits(String(matchedUser.password_hash || '').trim());
        let pwdMatch = false;
        if (storedPwd.startsWith('$2')) {
          try {
            const bcrypt = await import('bcryptjs');
            pwdMatch = await bcrypt.compare(cleanPass, storedPwd);
          } catch {
            pwdMatch = false;
          }
        } else {
          pwdMatch = storedPwd !== '' && storedPwd === cleanPass;
        }

        if (!pwdMatch) {
          throw new Error('الاسم أو الرمز السري غير متطابق مع قاعدة البيانات');
        }

      const { password_hash: _ph, username: _un, ...cleanUser } = matchedUser;
      const sharedGem = extractSharedGeminiKey(sheetUsers);
      if (sharedGem && !cleanUser.gemini_api_key) {
        cleanUser.gemini_api_key = sharedGem;
      }
      // مسح أي رابط شيت/ويب هوك قديم لمستخدم آخر حتى يعمل المستخدم بصفحته الخاصة فقط
      localStorage.removeItem('pharma_google_sheet_url');
      localStorage.removeItem('pharma_webhook_url');

        const token = 'sheet-jwt-' + Date.now();
        setToken(token);
        setCurrentUser(cleanUser);
        return { token, user: cleanUser };
      }
      throw err;
    }
  },

  async register(data: { fullName: string; username?: string; pin: string; area?: string; sheetUrl?: string; webhookUrl?: string; geminiApiKey?: string }): Promise<{ token: string; user: User }> {
    const cleanFullName = data.fullName.trim();
    const cleanPin = normalizeDigits(data.pin.trim());
    const rawUser = (data.username || cleanFullName).trim().toLowerCase();
    const email = rawUser.includes('@') ? rawUser : `${rawUser.replace(/\s+/g, '_')}@pharma.com`;

    if (isBaqerAdmin(cleanFullName, email)) {
      throw new Error('هذا الاسم محجوز للإدارة الرئيسية ولا يمكن تسجيله كحساب جديد');
    }

    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: cleanFullName,
          email,
          password: cleanPin,
          roleName: 'medical_rep',
          sheetUrl: data.sheetUrl?.trim() || undefined,
          webhookUrl: data.webhookUrl?.trim() || undefined,
          geminiApiKey: data.geminiApiKey?.trim() || undefined,
          area: data.area?.trim() || undefined
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.message || 'فشل تسجيل الحساب');
      const token = json.data?.accessToken || json.data?.token;
      const user: User = json.data?.user;
      localStorage.removeItem('pharma_google_sheet_url');
      localStorage.removeItem('pharma_webhook_url');
      setToken(token);
      setCurrentUser(user);
      return { token, user };
    } catch (err: any) {
      if (isNetworkError(err)) {
        const sheetUsers = await fetchAdminSheetUsersInBrowser();
        if (sheetUsers.some(u => normalizePersonName(u.full_name) === normalizePersonName(cleanFullName))) {
          throw new Error('هذا الاسم مسجل مسبقاً في الشيت الرئيسي');
        }
        const sheetId = extractGoogleSheetId(data.sheetUrl) || undefined;
        const webhookUrl = data.webhookUrl?.trim() || undefined;
        const adminHook = getAdminWebhookUrl();
        if (adminHook) {
          await sendWebhookCommand(adminHook, {
            action: 'add_user',
            adminSpreadsheetId: ADMIN_SHEET_ID,
            spreadsheetId: ADMIN_SHEET_ID,
            user: {
              full_name: cleanFullName,
              email,
              password_hash: cleanPin,
              role: 'medical_rep',
              sheet_url: data.sheetUrl?.trim() || '',
              sheet_id: sheetId || '',
              webhook_url: webhookUrl || ''
            }
          });
        }

        const newUser: User = {
          id: 'sheet-usr-' + Date.now(),
          full_name: cleanFullName,
          email,
          role: 'medical_rep',
          area: data.area || 'بغداد',
          sheet_id: sheetId,
          sheet_url: data.sheetUrl?.trim() || undefined,
          webhook_url: webhookUrl
        };
        localStorage.removeItem('pharma_google_sheet_url');
        localStorage.removeItem('pharma_webhook_url');
        const token = 'sheet-reg-jwt-' + Date.now();
        setToken(token);
        setCurrentUser(newUser);
        return { token, user: newUser };
      }
      throw err;
    }
  },

  async updateUserProfile(data: { currentPassword: string; newName?: string; newPassword?: string; confirmPassword?: string }): Promise<{ user: User; verifiedInSheet: boolean }> {
    const curUser = getCurrentUser();
    if (!curUser) throw new Error('يرجى تسجيل الدخول أولاً');

    const cleanCurPwd = normalizeDigits(data.currentPassword.trim());
    const cleanNewName = data.newName?.trim();
    const cleanNewPwd = data.newPassword ? normalizeDigits(data.newPassword.trim()) : undefined;

    if (cleanNewPwd && data.confirmPassword && cleanNewPwd !== normalizeDigits(data.confirmPassword.trim())) {
      throw new Error('الرمز السري الجديد وتأكيده غير متطابقين');
    }
    if (cleanNewName && isBaqerAdmin(cleanNewName) && curUser.role !== 'admin') {
      throw new Error('لا يمكن تغيير الاسم إلى اسم الإدارة الرئيسية');
    }

    try {
      const res = await fetchApi('/auth/update-profile', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          currentName: curUser.full_name,
          currentPassword: cleanCurPwd,
          newName: cleanNewName,
          newPassword: cleanNewPwd
        })
      }, 9000);
      const dataRes = await handleResponse<{ user: User; accessToken: string }>(res);
      if (dataRes.accessToken) setToken(dataRes.accessToken);
      setCurrentUser(dataRes.user);
      return { user: dataRes.user, verifiedInSheet: true };
    } catch (err: any) {
      if (!isNetworkError(err)) throw err;

      // وضع المتصفح المباشر: التحقق من الرمز الحالي ثم إرسال تعديل للشيت الرئيسي
      const sheetUsers = await fetchAdminSheetUsersInBrowser();
      const matched = sheetUsers.find(
        u => normalizePersonName(u.full_name) === normalizePersonName(curUser.full_name) || u.email.toLowerCase() === curUser.email.toLowerCase()
      );
      if (!matched) {
        throw new Error('تعذر العثور على سجل حسابك في الشيت الرئيسي');
      }

      const storedPwd = normalizeDigits(matched.password_hash || '');
      let curOk = false;
      if (storedPwd.startsWith('$2')) {
        try {
          const bcrypt = await import('bcryptjs');
          curOk = await bcrypt.compare(cleanCurPwd, storedPwd);
        } catch { curOk = false; }
      } else {
        curOk = storedPwd === cleanCurPwd;
      }
      if (!curOk) {
        throw new Error('الرمز السري الحالي غير صحيح');
      }

      if (cleanNewName && sheetUsers.some(u => u.id !== matched.id && normalizePersonName(u.full_name) === normalizePersonName(cleanNewName))) {
        throw new Error('هذا الاسم مستخدم مسبقاً لمندوب آخر في الشيت الرئيسي');
      }

      const webhookUrl = getAdminWebhookUrl();
      if (!webhookUrl) {
        throw new Error('لا يوجد رابط Apps Script للشيت الرئيسي لحفظ التعديلات');
      }

      const hookRes = await sendWebhookCommand(webhookUrl, {
        action: 'update_user',
        adminSpreadsheetId: ADMIN_SHEET_ID,
        spreadsheetId: ADMIN_SHEET_ID,
        rowNumber: matched.rowNumber,
        currentName: matched.full_name,
        email: matched.email,
        newName: cleanNewName || undefined,
        newPassword: cleanNewPwd || undefined
      });
      if (hookRes.parsed && hookRes.parsed.success === false) {
        throw new Error(hookRes.parsed.error || hookRes.parsed.message || 'فشل تعديل البيانات في الشيت الرئيسي');
      }

      // انتظار قصير ثم التحقق المباشر من قراءة الشيت via GViz
      await new Promise(r => setTimeout(r, 1200));
      const refreshedUsers = await fetchAdminSheetUsersInBrowser().catch(() => [] as AdminSheetUser[]);
      const verifyRow = refreshedUsers.find(u => u.rowNumber === matched.rowNumber)
        || refreshedUsers.find(u => cleanNewName && normalizePersonName(u.full_name) === normalizePersonName(cleanNewName));

      const verifiedInSheet = Boolean(
        verifyRow &&
        (!cleanNewName || normalizePersonName(verifyRow.full_name) === normalizePersonName(cleanNewName)) &&
        (!cleanNewPwd || normalizeDigits(verifyRow.password_hash) === cleanNewPwd)
      );

      const finalName = cleanNewName || curUser.full_name;
      const updatedUser: User = {
        ...curUser,
        full_name: finalName,
        role: isBaqerAdmin(finalName, curUser.email) ? 'admin' : curUser.role
      };
      setCurrentUser(updatedUser);
      return { user: updatedUser, verifiedInSheet };
    }
  },

  // ── Pharmacies ──
  async getPharmacies(): Promise<Pharmacy[]> {
    if (!hasAssignedDatabase(getCurrentUser())) return [];
    try {
      const res = await fetchApi('/pharmacies', { headers: authHeaders() });
      return await handleResponse<Pharmacy[]>(res);
    } catch (err: any) {
      if (isNetworkError(err)) return getStoredPharmacies();
      throw err;
    }
  },

  async createPharmacy(data: Partial<Pharmacy>): Promise<Pharmacy> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/pharmacies', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
      });
      return await handleResponse<Pharmacy>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const list = getStoredPharmacies();
        const newPh: Pharmacy = {
          id: 'ph-' + Date.now(),
          name: data.name || 'صيدلية جديدة',
          city: data.city || 'بغداد',
          area: data.area || 'مركز المدينة',
          address: data.address || 'بغداد',
          phone: data.phone || '07700000000',
          total_invoices: 0,
          total_sales: 0
        };
        list.unshift(newPh);
        saveStoredPharmacies(list);
        return newPh;
      }
      throw err;
    }
  },

  // ── Products ──
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetchApi('/catalog/products', { headers: authHeaders() });
      return await handleResponse<Product[]>(res);
    } catch (err: any) {
      if (isNetworkError(err)) return MOCK_PRODUCTS;
      throw err;
    }
  },

  // ── Invoices ──
  async getInvoices(): Promise<Invoice[]> {
    if (!hasAssignedDatabase(getCurrentUser())) return [];
    try {
      const res = await fetchApi('/invoices?sync_sheet=1', { headers: authHeaders() });
      return await handleResponse<Invoice[]>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        await api.syncSheetDeletion().catch(() => {});
        return getStoredInvoices();
      }
      throw err;
    }
  },

  // مزامنة ثنائية الاتجاه عبر الأجهزة: جلب الجديد والمعدّل وحذف المحذوف من كوكل شيت فوراً
  async syncSheetDeletion(): Promise<boolean> {
    if (!hasAssignedDatabase(getCurrentUser())) return false;
    try {
      const { reachable, rows: sheetRows } = await fetchLiveSheetRowsStatus();
      if (!reachable) return false;

      const scopedKey = getScopedStorageKey(LS_INVOICES_KEY);
      const hasInitializedLocal = localStorage.getItem(scopedKey) !== null;

      if (!hasInitializedLocal) {
        const hydrated = sheetRows.length > 0
          ? hydrateLocalInvoicesFromSheetRows(sheetRows)
          : (getSavedSheetId() === DEFAULT_SHEET_ID ? [...MOCK_INVOICES] : []);
        saveStoredInvoices(hydrated);
        mergeStoredPharmaciesFromInvoices(hydrated);
        return true;
      }

      const activeSheetId = getSavedSheetId();
      const pendingUploadNums = new Set(
        getPendingSheetsOutbox()
          .filter(j => (j.targetSheetId || activeSheetId) === activeSheetId && j.action !== 'delete_invoice')
          .map(j => String(j.invoice_number || '').trim())
          .filter(Boolean)
      );

      const local = getStoredInvoices();
      const { invoices: mergedInvoices, changed } = reconcileLocalInvoicesWithSheet(local, sheetRows, pendingUploadNums);

      if (changed) {
        saveStoredInvoices(mergedInvoices);
        mergeStoredPharmaciesFromInvoices(mergedInvoices);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  async createInvoice(payload: {
    pharmacy_id?: string;
    pharmacy_name?: string;
    pharmacy_area?: string;
    invoice_number: string;
    invoice_date: string;
    image_url?: string;
    notes?: string;
    force_save?: boolean;
    items: {
      product_id: string;
      sold_quantity: number;
      custom_product_name?: string;
      dosage_form?: string;
      custom_unit_price?: number;
      custom_bonus?: number;
      bonus_quantity?: number;
      ocr_confidence?: number;
    }[];
  }): Promise<Invoice> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/invoices', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      }, 12000);
      return await handleResponse<Invoice>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return await persistLocalInvoiceAndSync(payload);
      }
      throw err;
    }
  },

  async updateInvoice(id: string, payload: {
    pharmacy_id?: string;
    pharmacy_name?: string;
    pharmacy_area?: string;
    invoice_number?: string;
    invoice_date?: string;
    notes?: string;
    items?: {
      product_id: string;
      sold_quantity: number;
      custom_product_name?: string;
      dosage_form?: string;
      custom_unit_price?: number;
      custom_bonus?: number;
      ocr_confidence?: number;
    }[];
  }): Promise<Invoice> {
    try {
      const res = await fetchApi(`/invoices/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      return await handleResponse<Invoice>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const list = getStoredInvoices();
        const pharmacies = getStoredPharmacies();
        const curUser = getCurrentUser();
        const idx = list.findIndex(i => i.id === id);
        if (idx === -1) throw new Error('الفاتورة غير موجودة محلياً');
        const old = list[idx];
        const cleanTypedName = (payload.pharmacy_name || '').trim();
        let ph = cleanTypedName
          ? pharmacies.find(p => p.name.trim().toLowerCase() === cleanTypedName.toLowerCase())
          : pharmacies.find(p => p.id === (payload.pharmacy_id || old.pharmacy_id));

        if (!ph && cleanTypedName) {
          ph = {
            id: 'ph-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
            name: cleanTypedName,
            city: 'بغداد',
            area: (payload.pharmacy_area || '').trim() || detectAreaFromText(cleanTypedName) || '',
            address: payload.pharmacy_area ? `بغداد - ${payload.pharmacy_area}` : 'بغداد',
            phone: '',
            assigned_rep_id: curUser?.id,
            assigned_rep_name: curUser?.full_name || 'مندوب ميداني',
            total_invoices: 0,
            total_sales: 0
          };
          pharmacies.unshift(ph);
          saveStoredPharmacies(pharmacies);
        }

        let updatedItems = old.items || [];
        let totalSales = old.total_sales_amount;
        let totalPieces = old.total_pieces_count;
        let totalBonus = old.total_bonus_count;

        if (payload.items && payload.items.length > 0) {
          totalSales = 0;
          totalPieces = 0;
          totalBonus = 0;
          updatedItems = payload.items.map((it, i) => {
            const qty = Number(it.sold_quantity || 1);
            const price = Number(it.custom_unit_price ?? 5000);
            const bonus = Number(it.custom_bonus ?? Math.floor(qty / 10));
            const lineTotal = qty * price;
            totalSales += lineTotal;
            totalPieces += qty;
            totalBonus += bonus;
            return {
              id: `item-${Date.now()}-${i}`,
              product_id: it.product_id || 'pr-1',
              product_name_snapshot: it.custom_product_name || 'مستحضر دوائي',
              dosage_form: it.dosage_form || detectDosageFormClient(it.custom_product_name || ''),
              sold_quantity: qty,
              historical_unit_price: price,
              bonus_quantity: bonus,
              total_quantity: qty + bonus,
              line_total: lineTotal
            };
          });
        }

        const resolvedPhName = cleanTypedName || ph?.name || old.pharmacy_name || '';
        const resolvedPhArea = (payload.pharmacy_area || '').trim() || old.pharmacy_area || (ph as any)?.area || detectAreaFromText(resolvedPhName) || '';

        const updated: Invoice = {
          ...old,
          pharmacy_id: ph?.id || payload.pharmacy_id || old.pharmacy_id,
          pharmacy_name: resolvedPhName,
          pharmacy_area: resolvedPhArea,
          invoice_number: payload.invoice_number ?? old.invoice_number,
          invoice_date: payload.invoice_date ?? old.invoice_date,
          notes: payload.notes ?? old.notes,
          total_sales_amount: totalSales,
          total_pieces_count: totalPieces,
          total_bonus_count: totalBonus,
          items: updatedItems
        };
        list[idx] = updated;
        saveStoredInvoices(list);

        enqueueSheetsSyncJob({
          action: 'edit_invoice',
          invoice_number: updated.invoice_number,
          previous_invoice_number: old.invoice_number,
          pharmacy_name: updated.pharmacy_name,
          invoice_date: updated.invoice_date,
          rows: formatInvoiceToSheetRows(updated)
        });
        await Promise.race([
          flushSheetsSyncOutboxInternal({ keepalive: true }),
          new Promise(r => setTimeout(r, 3000))
        ]).catch(() => {});

        return updated;
      }
      throw err;
    }
  },

  async reviewInvoice(
    id: string,
    status: 'approved' | 'rejected',
    rejection_reason?: string
  ): Promise<Invoice> {
    try {
      const res = await fetchApi(`/invoices/${id}/review`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status, rejection_reason })
      });
      return await handleResponse<Invoice>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const list = getStoredInvoices();
        const idx = list.findIndex(i => i.id === id);
        if (idx === -1) throw new Error('الفاتورة غير موجودة');
        list[idx] = { ...list[idx], status, rejection_reason };
        saveStoredInvoices(list);

        enqueueSheetsSyncJob({
          action: 'edit_invoice',
          invoice_number: list[idx].invoice_number,
          previous_invoice_number: list[idx].invoice_number,
          pharmacy_name: list[idx].pharmacy_name,
          invoice_date: list[idx].invoice_date,
          rows: formatInvoiceToSheetRows(list[idx])
        });
        await Promise.race([
          flushSheetsSyncOutboxInternal({ keepalive: true }),
          new Promise(r => setTimeout(r, 3000))
        ]).catch(() => {});

        return list[idx];
      }
      throw err;
    }
  },

  async deleteInvoice(id: string, opts?: { preserveOriginalInSheet?: boolean }): Promise<void> {
    try {
      const res = await fetchApi(`/invoices/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      await handleResponse<{ id: string }>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const all = getStoredInvoices();
        const target = all.find(i => i.id === id);
        const list = all.filter(i => i.id !== id);
        saveStoredInvoices(list);
        if (target?.invoice_number || target?.pharmacy_name) {
          const cleanTargetNum = String(target.invoice_number || '').trim();
          const hasSurvivingSameNum = Boolean(
            cleanTargetNum && list.some(i => String(i.invoice_number || '').trim() === cleanTargetNum)
          );
          const preserveOriginal = Boolean(opts?.preserveOriginalInSheet || hasSurvivingSameNum);
          enqueueSheetsSyncJob({
            action: 'delete_invoice',
            invoice_number: cleanTargetNum,
            pharmacy_name: target.pharmacy_name,
            invoice_date: (target.invoice_date || '').split('T')[0],
            delete_mode: preserveOriginal ? 'duplicate_copy' : 'all'
          });
          await Promise.race([
            flushSheetsSyncOutboxInternal({ keepalive: true }),
            new Promise(r => setTimeout(r, 2500))
          ]).catch(() => {});
        }
        return;
      }
      throw err;
    }
  },

  // ── Test Google Gemini API Key from Browser (Gemini Only) ──
  async testGeminiKey(rawKey: string): Promise<{ valid: boolean; model?: string; provider?: AiVisionProvider; message: string }> {
    const key = rawKey.trim();
    if (!key) {
      return { valid: false, message: 'يرجى إدخال مفتاح Google Gemini API أولاً.' };
    }

    let lastMsg = 'تعذر التحقق من المفتاح';
    for (const model of GEMINI_CANDIDATE_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'أجب بكلمة OK فقط' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        });
        if (res.ok) {
          setSavedGeminiKey(key);
          clearClientOcrCircuitBreaker(key);
          return { valid: true, model, provider: 'gemini', message: `تم التحقق! Google Gemini يعمل بنجاح على (${model}) ✅` };
        }
        const errJson = await res.json().catch(() => ({}));
        const rawErrMsg = errJson?.error?.message || res.statusText || '';
        lastMsg = formatGeminiErrorArabic(res.status, rawErrMsg);
        if (
          (res.status === 400 && rawErrMsg.toLowerCase().includes('api_key_invalid')) ||
          (res.status === 403 && rawErrMsg.toLowerCase().includes('free tier'))
        ) {
          return { valid: false, provider: 'gemini', message: lastMsg };
        }
      } catch (e: any) {
        lastMsg = 'تعذر الاتصال بخوادم Google Gemini: ' + (e?.message || 'خطأ شبكة');
      }
    }
    return { valid: false, provider: 'gemini', message: lastMsg };
  },

  // ── Full Mobile-Safe OCR Pipeline (Inspect → Cache(SHA-256) → Prep → Retry(3x)+Breaker(10m) → Tesseract/Queue) ─
  async uploadInvoiceFile(
    rawFile: File,
    pharmacyId?: string,
    options?: {
      onProgress?: (update: OcrProgressUpdate) => void;
      onPreparedPreview?: (previewUrl: string, prep: PreparedInvoiceFile) => void;
    }
  ): Promise<{
    extracted_items: { product_id?: string; product_name: string; dosage_form?: string; quantity: number; unit_price?: number; bonus_quantity?: number }[];
    invoice_number?: string;
    invoice_date?: string;
    pharmacy_id?: string;
    pharmacy_name?: string;
    pharmacy_area?: string;
    image_url?: string;
    confidence: number;
    raw_text?: string;
    offline_mode?: boolean;
    ocr_engine?: 'backend' | 'gemini-browser' | 'offline-manual';
    ocr_warning?: string;
    ocr_error?: string;
    queued_offline?: boolean;
    needs_review?: boolean;
    needs_review_reason?: string;
    cached?: boolean;
    circuit_breaker_open?: boolean;
    prepared_info?: {
      originalSizeBytes: number;
      finalSizeBytes: number;
      wasCompressed: boolean;
      wasConvertedFromHeic: boolean;
      kind: string;
    };
  }> {
    const report = (stage: OcrProgressUpdate['stage'], percent: number, message: string) => {
      options?.onProgress?.({ stage, percent, message });
    };

    if (Date.now() - lastSharedGemSyncAt > 15000) {
      await api.syncSharedGeminiKeyFromSheet().catch(() => '');
    }
    const geminiKey = getSavedGeminiKey();
    const initialBreaker = getClientOcrCircuitBreakerStatus(geminiKey);
    const useAsyncBackend = !isLocalhostFromRemoteHttps();
    const rawSha256 = rawFile.size > 0 ? await computeBlobSha256Hex(rawFile) : '';
    const cacheKey = rawSha256
      ? `${rawSha256}:${shortKeyFingerprint(geminiKey)}:${initialBreaker.open ? 'open' : 'closed'}:${pharmacyId || ''}:${useAsyncBackend ? getApiBase() : 'browser'}`
      : '';

    if (cacheKey) {
      const hit = clientOcrShaCache.get(cacheKey);
      if (hit && Date.now() <= hit.expiresAt) {
        report('done', 100, 'تم استرجاع النتيجة فوراً من الذاكرة المؤقتة (SHA-256 Cache)');
        if (hit.result?.image_url && options?.onPreparedPreview && hit.result?._prepMeta) {
          options.onPreparedPreview(hit.result.image_url, hit.result._prepMeta);
        }
        const { _prepMeta, ...cleanResult } = hit.result;
        return { ...cleanResult, cached: true };
      }
      if (hit) clientOcrShaCache.delete(cacheKey);
    }

    const storeCache = (payload: any, prepMeta?: PreparedInvoiceFile) => {
      if (!cacheKey || payload?.queued_offline) return;
      if (clientOcrShaCache.size >= CLIENT_OCR_CACHE_MAX) {
        const oldest = clientOcrShaCache.keys().next().value;
        if (oldest) clientOcrShaCache.delete(oldest);
      }
      clientOcrShaCache.set(cacheKey, {
        expiresAt: Date.now() + CLIENT_OCR_CACHE_TTL_MS,
        result: { ...payload, _prepMeta: prepMeta }
      });
    };

    // المرحلة 2 و 3: فحص Magic Bytes + تحويل HEIC + تصحيح EXIF + تصغير ≤1600px + مسح GPS EXIF
    report('inspect', 10, 'فحص سلامة الملف وصيغته الحقيقية...');
    const prepared = await prepareInvoiceFile(rawFile, 1600, 0.82);

    report(
      'prepare',
      25,
      prepared.wasConvertedFromHeic
        ? 'تم تحويل HEIC وتصغير الصورة للموبايل...'
        : prepared.wasCompressed
          ? `تم ضغط الصورة (${Math.round(prepared.finalSizeBytes / 1024)} KB) وتصحيح الاتجاه...`
          : 'تم التحقق من الملف جاهز للمعالجة...'
    );

    if (options?.onPreparedPreview && !prepared.inspection.isPdf) {
      try {
        const objUrl = URL.createObjectURL(prepared.file);
        options.onPreparedPreview(objUrl, prepared);
      } catch { /* ignore */ }
    }

    const prepSummary = {
      originalSizeBytes: prepared.originalSizeBytes,
      finalSizeBytes: prepared.finalSizeBytes,
      wasCompressed: prepared.wasCompressed,
      wasConvertedFromHeic: prepared.wasConvertedFromHeic,
      kind: prepared.inspection.kind
    };

    // المرحلة 4 أ: محاولة الرفع والتحليل عبر الخادم الخلفي (إذا كان مضبوطاً وقابلاً للوصول)
    try {
      const formData = new FormData();
      formData.append('invoice_file', prepared.file);
      if (pharmacyId) formData.append('pharmacy_id', pharmacyId);

      report('upload', 35, 'رفع الفاتورة للخادم...');
      if (useAsyncBackend) {
        const uploadResult = await uploadMultipartWithRetry(
          '/invoices/ocr',
          formData,
          (pct) => report('upload', 35 + Math.round(pct * 0.25), `جاري الرفع (${pct}%)...`),
          2,
          28000
        );

        // دعم التحليل بالخلفية إذا أعاد الخادم jobId (202 Accepted)
        if (uploadResult?.jobId && !uploadResult?.extracted_items) {
          report('analyze', 65, 'بدأ التحليل في الخلفية...');
          const jobResult = await pollBackendOcrJob(uploadResult.jobId, (pct, msg) =>
            report('analyze', Math.max(65, pct), msg)
          );
          const needsRev = jobResult?.needs_review ?? (Number(jobResult?.confidence || 0) < 0.75);
          const out = {
            ...jobResult,
            needs_review: needsRev,
            ocr_engine: 'backend' as const,
            prepared_info: prepSummary
          };
          storeCache(out, prepared);
          report('done', 100, 'اكتملت القراءة بنجاح');
          return out;
        }

        const needsRev = uploadResult?.needs_review ?? (Number(uploadResult?.confidence || 0) < 0.75);
        const out = {
          ...uploadResult,
          needs_review: needsRev,
          ocr_engine: 'backend' as const,
          prepared_info: prepSummary
        };
        storeCache(out, prepared);
        report('done', 100, 'اكتملت القراءة بنجاح');
        return out;
      }
      throw new TypeError('Localhost backend skipped on HTTPS origin');
    } catch (err: any) {
      if (!isNetworkError(err)) {
        throw err;
      }

      // المرحلة 4 ب + 5: التحليل المباشر من المتصفح (عند استضافة GitHub Pages أو غياب الخادم)
      report('analyze', 45, 'تحضير البيانات للقراءة...');
      const fileData = await fileToBase64DataUrl(prepared.file, prepared.inspection.mimeType);
      let geminiErrorMsg: string | undefined;
      let circuitOpen = initialBreaker.open;

      // المسار الذكي 1: Groq Vision / OpenRouter / Gemini مع احترام قاطع الدائرة 10 دقائق
      if (geminiKey) {
        if (initialBreaker.open) {
          const minsLeft = Math.max(1, Math.ceil(initialBreaker.remainingMs / 60000));
          geminiErrorMsg = `قاطع الدائرة مفعّل (${minsLeft} د متبقية بعد خطأ ${initialBreaker.statusCode || '403/429'}) — التحويل الفوري للمحرك المحلي`;
          console.warn('OCR Circuit Breaker open — skipping AI call:', geminiErrorMsg);
        } else {
          try {
            const { parsed, modelUsed } = await runBrowserGeminiOcr(
              fileData,
              geminiKey,
              (pct, msg) => report('analyze', pct, msg)
            );
            const items = Array.isArray(parsed.items) ? parsed.items : [];
            const conf = Number(parsed.confidence || 0.92);
            const needsReview = items.length === 0 || conf < 0.75;
            const out = {
              extracted_items: items,
              invoice_number: parsed.invoice_number || undefined,
              invoice_date: parsed.invoice_date || new Date().toISOString().split('T')[0],
              pharmacy_name: parsed.pharmacy_name || undefined,
              pharmacy_area: parsed.pharmacy_area || undefined,
              image_url: fileData.dataUrl,
              confidence: conf,
              offline_mode: false,
              ocr_engine: 'gemini-browser' as const,
              ocr_warning: prepared.warning,
              needs_review: needsReview,
              needs_review_reason: needsReview
                ? 'ثقة القراءة الذكية منخفضة أو لم تُكتشف أصناف — يرجى مراجعة الفاتورة قبل الحفظ.'
                : undefined,
              cached: false,
              circuit_breaker_open: false,
              prepared_info: prepSummary
            };
            storeCache(out, prepared);
            report('done', 100, `اكتملت القراءة بالذكاء الاصطناعي (${modelUsed})`);
            return out;
          } catch (gemErr: any) {
            const errMsg = String(gemErr?.message || 'فشل تحليل الفاتورة عبر محرك الذكاء الاصطناعي');
            geminiErrorMsg = errMsg;
            if (gemErr?.shouldTripCircuit || gemErr?.statusCode === 403 || gemErr?.statusCode === 429) {
              tripClientOcrCircuitBreaker(geminiKey, errMsg, gemErr?.statusCode);
              circuitOpen = true;
            }
            console.warn('Browser AI Vision OCR failed:', geminiErrorMsg);
          }
        }
      }

      // فحص حالة الشبكة: إذا انقطع الإنترنت تماماً خزّن الصورة في الطابور المحلي
      const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
      if (isOffline) {
        enqueuePendingOcrScan({
          fileName: prepared.file.name,
          mimeType: fileData.mimeType,
          dataUrl: fileData.dataUrl,
          pharmacyId,
          reason: 'انقطاع اتصال الإنترنت أثناء الرفع'
        });
        report('done', 100, 'تم حفظ الفاتورة محلياً لحين عودة الاتصال');
        return {
          extracted_items: [],
          invoice_number: '',
          invoice_date: new Date().toISOString().split('T')[0],
          pharmacy_name: '',
          pharmacy_area: '',
          image_url: fileData.dataUrl,
          confidence: 0,
          raw_text: '',
          offline_mode: true,
          ocr_engine: 'offline-manual',
          queued_offline: true,
          needs_review: true,
          needs_review_reason: 'لا يوجد اتصال بالإنترنت — ستُستكمل المراجعة عند عودة الاتصال.',
          cached: false,
          circuit_breaker_open: circuitOpen,
          ocr_error: geminiErrorMsg || 'لا يوجد اتصال بالإنترنت — تم حفظ الصورة في الطابور المحلي لإكمال التحليل لاحقاً.',
          prepared_info: prepSummary
        };
      }

      // (تمت إزالة القراءة المحلية OCR — الاعتماد على Google Gemini Vision فقط)

      // المسار النهائي: إرفاق الصورة آمن مع إبلاغ صريح بالسبب ووسم تحتاج مراجعة
      report('done', 100, 'تم إرفاق الفاتورة');
      return {
        extracted_items: [],
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        pharmacy_name: '',
        pharmacy_area: '',
        image_url: fileData.dataUrl,
        confidence: 0,
        raw_text: '',
        offline_mode: true,
        ocr_engine: 'offline-manual',
        needs_review: true,
        needs_review_reason: 'تعذر الاستخراج الآلي — هذه الفاتورة تحتاج إدخالاً ومراجعة يدوية قبل الحفظ.',
        cached: false,
        circuit_breaker_open: circuitOpen,
        ocr_error: geminiErrorMsg,
        ocr_warning: geminiErrorMsg
          ? `فشلت القراءة الذكية: ${geminiErrorMsg}`
          : prepared.inspection.isPdf
            ? 'قراءة ملفات PDF تلقائياً على الموبايل تتطلب إدخال مفتاح Google Gemini API في إعدادات Gemini بالأعلى.'
            : (prepared.warning || 'لم يتم تفعيل مفتاح Google Gemini أو الخادم — يمكنك تعبئة البيانات يدوياً أو إضافة مفتاح Google Gemini بالأعلى.'),
        prepared_info: prepSummary
      };
    }
  },

  // ── Batch OCR Upload ──
  async uploadInvoiceFilesBatch(files: File[]): Promise<{
    results: Array<{
      file_name: string;
      image_url?: string;
      invoice_number: string;
      invoice_date: string;
      pharmacy_id: string;
      pharmacy_name: string;
      extracted_items: { product_id?: string; product_name: string; quantity: number; unit_price?: number; bonus_quantity?: number; line_total?: number }[];
      total_amount: number;
      confidence: number;
      ocr_engine: string;
      error?: string;
    }>;
    total: number;
    successful: number;
  }> {
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('invoice_files', f));
      const res = await fetchApi('/invoices/ocr-batch', {
        method: 'POST',
        headers: authHeadersMultipart(),
        body: formData
      }, 45000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const results = await Promise.all(files.map(async (f) => {
          const single = await api.uploadInvoiceFile(f);
          return {
            file_name: f.name,
            image_url: single.image_url,
            invoice_number: single.invoice_number || '',
            invoice_date: single.invoice_date || new Date().toISOString().split('T')[0],
            pharmacy_id: single.pharmacy_id || '',
            pharmacy_name: single.pharmacy_name || '',
            extracted_items: single.extracted_items || [],
            total_amount: 0,
            confidence: single.confidence || 1,
            ocr_engine: single.offline_mode ? 'local-offline' : 'gemini-browser'
          };
        }));
        return { results, total: results.length, successful: results.length };
      }
      throw err;
    }
  },

  // ── Batch Invoices Creation ──
  async createInvoicesBatch(invoices: any[]): Promise<{ count: number; invoices: Invoice[]; skipped_duplicates?: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }> }> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/invoices/batch', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ invoices })
      }, 15000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const sheetRows = await fetchLiveSheetRowsCompact();
        const created: Invoice[] = [];
        const skipped: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }> = [];

        for (const invPayload of invoices) {
          const newInv = persistLocalInvoice(invPayload, { skipSheetCheck: true });
          created.push(newInv);
          const dup = checkClientInvoiceDuplicateInSheet(newInv, sheetRows);
          if (dup.isDuplicate) {
            skipped.push({
              invoice_number: String(newInv.invoice_number || ''),
              pharmacy_name: newInv.pharmacy_name || '',
              invoice_date: (newInv.invoice_date || '').split('T')[0],
              reason: dup.reason
            });
          } else {
            enqueueSheetsSyncJob({
              action: 'add_invoice',
              invoice_number: String(newInv.invoice_number || ''),
              pharmacy_name: newInv.pharmacy_name,
              invoice_date: newInv.invoice_date,
              rows: formatInvoiceToSheetRows(newInv)
            });
          }
        }
        if (skipped.length > 0) addSkippedSheetDuplicateNotices(skipped);
        await Promise.race([
          flushSheetsSyncOutboxInternal({ keepalive: true }),
          new Promise(r => setTimeout(r, 3500))
        ]).catch(() => {});

        return { count: created.length, invoices: created, skipped_duplicates: skipped };
      }
      throw err;
    }
  },

  // ── Google Sheets Database Integration (GViz ALL-Column First + Persistent Sync) ──
  async getSheetsData(): Promise<{
    headers: string[];
    rows: Array<{
      invoice_number: string;
      invoice_date: string;
      warehouse_name: string;
      pharmacy_name: string;
      city: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      bonus_quantity: number;
      line_total: number;
      total_invoice: number;
      rep_name: string;
      status: string;
      timestamp: string;
      area?: string;
      dosage_form?: string;
      cells?: string[];
    }>;
    rawCount: number;
    sheet_id: string;
    sheet_url: string;
  }> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/sheets/data', { headers: authHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const sheetId = getSavedSheetId();
        const sheetUrl = getSavedSheetUrl();
        const localInvs = getStoredInvoices();
        const localRows = localInvs.flatMap(inv =>
          formatInvoiceToSheetRows(inv).map(sr => ({
            ...sr,
            cells: [
              sr.invoice_number, sr.invoice_date, sr.warehouse_name, sr.pharmacy_name,
              sr.area, sr.city, sr.product_name, sr.dosage_form,
              String(sr.quantity), String(sr.unit_price), String(sr.bonus_quantity), String(sr.line_total),
              String(sr.total_invoice), sr.rep_name, sr.status, sr.timestamp
            ]
          }))
        );

        // قراءة مباشرة من الشيت باستخدام محلل الأعمدة الديناميكي مع كسر الكاش
        const live = await fetchLiveSheetRowsStatus();
        if (live.reachable && live.rows.length > 0) {
          return {
            headers: live.headers && live.headers.length > 0 ? live.headers : [
              'رقم الفاتورة', 'تاريخ الفاتورة', 'اسم المذخر', 'اسم الصيدلية', 'المنطقة / المكان',
              'المدينة / المحافظة', 'اسم المادة الدوائية', 'نوع المادة / الشكل الدوائي',
              'الكمية', 'سعر المفرد (د.ع)', 'البونص المجاني', 'المجموع (د.ع)',
              'صافي الفاتورة الكلي (د.ع)', 'اسم المندوب العلمي', 'حالة الاعتماد', 'وقت وتاريخ الإدراج'
            ],
            rows: live.rows,
            rawCount: live.rows.length,
            sheet_id: sheetId,
            sheet_url: sheetUrl
          };
        }
        if (live.reachable && live.rows.length === 0) {
          return {
            headers: live.headers && live.headers.length > 0 ? live.headers : [
              'رقم الفاتورة', 'تاريخ الفاتورة', 'اسم المذخر', 'اسم الصيدلية', 'المنطقة / المكان',
              'المدينة / المحافظة', 'اسم المادة الدوائية', 'نوع المادة / الشكل الدوائي',
              'الكمية', 'سعر المفرد (د.ع)', 'البونص المجاني', 'المجموع (د.ع)',
              'صافي الفاتورة الكلي (د.ع)', 'اسم المندوب العلمي', 'حالة الاعتماد', 'وقت وتاريخ الإدراج'
            ],
            rows: [],
            rawCount: 0,
            sheet_id: sheetId,
            sheet_url: sheetUrl
          };
        }

        return {
          headers: [
            'رقم الفاتورة', 'تاريخ الفاتورة', 'اسم المذخر', 'اسم الصيدلية', 'المنطقة / المكان',
            'المدينة / المحافظة', 'اسم المادة الدوائية', 'نوع المادة / الشكل الدوائي',
            'الكمية', 'سعر المفرد (د.ع)', 'البونص المجاني', 'المجموع (د.ع)',
            'صافي الفاتورة الكلي (د.ع)', 'اسم المندوب العلمي', 'حالة الاعتماد', 'وقت وتاريخ الإدراج'
          ],
          rows: localRows,
          rawCount: localRows.length,
          sheet_id: sheetId,
          sheet_url: sheetUrl
        };
      }
      throw err;
    }
  },

  async syncAllToSheets(): Promise<{
    success: boolean;
    rows_count: number;
    message: string;
    mode: string;
    timestamp: string;
    skipped_duplicates?: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }>;
  }> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/sheets/sync-all', {
        method: 'POST',
        headers: authHeaders()
      }, 15000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const invs = getStoredInvoices();
        const sheetRows = await fetchLiveSheetRowsCompact();
        const logicalGroups = groupSheetRowsLogical(sheetRows);
        const skipped: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }> = [];
        const seenLocalSig = new Set<string>();
        const rowsToSend: SheetRowPayload[] = [];
        let syncedCount = 0;

        for (const inv of invs) {
          const dt = normalizeDateYmd(inv.invoice_date || '');
          const sig = buildFullInvoiceCompositeKey({ pharmacy_name: inv.pharmacy_name, invoice_date: inv.invoice_date, items: inv.items });
          if (sig && seenLocalSig.has(sig)) {
            skipped.push({ invoice_number: String(inv.invoice_number || ''), pharmacy_name: inv.pharmacy_name || '', invoice_date: dt, reason: 'نسخة مكررة داخل النظام' });
            continue;
          }
          if (sig) seenLocalSig.add(sig);

          const check = checkInvoiceAgainstSheet(inv, sheetRows, logicalGroups);
          if (check.isDuplicate) {
            skipped.push({ invoice_number: String(inv.invoice_number || ''), pharmacy_name: inv.pharmacy_name || '', invoice_date: dt, reason: check.reason });
            continue;
          }
          const formatted = formatInvoiceToSheetRows(inv);
          rowsToSend.push(...formatted);
          enqueueSheetsSyncJob({
            action: check.statusChangedOnly ? 'edit_invoice' : 'add_invoice',
            invoice_number: String(inv.invoice_number || ''),
            previous_invoice_number: check.statusChangedOnly ? String(inv.invoice_number || '') : undefined,
            pharmacy_name: inv.pharmacy_name,
            invoice_date: inv.invoice_date,
            rows: formatted
          });
          syncedCount++;
        }

        if (skipped.length > 0) addSkippedSheetDuplicateNotices(skipped);
        await Promise.race([
          flushSheetsSyncOutboxInternal({ keepalive: true }),
          new Promise(r => setTimeout(r, 4000))
        ]).catch(() => {});

        return {
          success: true,
          rows_count: rowsToSend.length,
          skipped_duplicates: skipped,
          message: skipped.length > 0
            ? `تمت مزامنة ${syncedCount} فواتير جديدة/معدلة (${rowsToSend.length} سطراً) وتخطي ${skipped.length} فواتير مكررة فقط.`
            : syncedCount > 0
              ? `تمت المزامنة السحابية لـ ${syncedCount} فواتير (${rowsToSend.length} سطراً) بنجاح 🚀`
              : 'كافة الفواتير متطابقة ومزامنة بالفعل مع كوكل شيت ✅',
          mode: 'cloud-direct',
          timestamp: new Date().toISOString()
        };
      }
      throw err;
    }
  },

  async getSheetsGapStatus(): Promise<{
    system_invoices_count: number;
    sheet_rows_count: number;
    sheet_unique_invoices_count: number;
    unuploaded_count: number;
    unuploaded_invoices: Array<{
      id: string;
      invoice_number: string;
      invoice_date: string;
      pharmacy_name: string;
      total_sales_amount: number;
      items_count: number;
    }>;
    missing_in_system_count: number;
    has_gap: boolean;
  }> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/sheets/gap-status', { headers: authHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const invs = getStoredInvoices();
        const live = await fetchLiveSheetRowsStatus();
        const sheetRows = live.rows;
        const logicalGroups = groupSheetRowsLogical(sheetRows);
        const unuploaded = invs.filter(inv => !checkInvoiceAgainstSheet(inv, sheetRows, logicalGroups).isDuplicate);
        return {
          system_invoices_count: invs.length,
          sheet_rows_count: live.reachable ? sheetRows.length : invs.length,
          sheet_unique_invoices_count: live.reachable ? logicalGroups.length : invs.length,
          unuploaded_count: unuploaded.length,
          unuploaded_invoices: unuploaded.map(inv => ({
            id: inv.id,
            invoice_number: String(inv.invoice_number || ''),
            invoice_date: inv.invoice_date,
            pharmacy_name: inv.pharmacy_name || '',
            total_sales_amount: Number(inv.total_sales_amount || 0),
            items_count: inv.items?.length || 0
          })),
          missing_in_system_count: 0,
          has_gap: unuploaded.length > 0
        };
      }
      throw err;
    }
  },

  async syncUnuploadedToSheets(): Promise<{
    success: boolean;
    synced_count: number;
    rows_count: number;
    message: string;
    skipped_duplicates?: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }>;
  }> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/sheets/sync-unuploaded', {
        method: 'POST',
        headers: authHeaders()
      }, 15000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const invs = getStoredInvoices();
        const sheetRows = await fetchLiveSheetRowsCompact();
        const logicalGroups = groupSheetRowsLogical(sheetRows);
        const skipped: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }> = [];
        const seenToUpload = new Set<string>();
        let synced = 0;
        let rowsCount = 0;

        for (const inv of invs) {
          const compKey = buildFullInvoiceCompositeKey({ pharmacy_name: inv.pharmacy_name, invoice_date: inv.invoice_date, items: inv.items });
          if (compKey && seenToUpload.has(compKey)) {
            skipped.push({ invoice_number: String(inv.invoice_number || ''), pharmacy_name: inv.pharmacy_name || '', invoice_date: (inv.invoice_date || '').split('T')[0], reason: 'نسخة مكررة داخل النظام' });
            continue;
          }
          if (compKey) seenToUpload.add(compKey);

          const check = checkInvoiceAgainstSheet(inv, sheetRows, logicalGroups);
          if (check.isDuplicate) {
            skipped.push({ invoice_number: String(inv.invoice_number || ''), pharmacy_name: inv.pharmacy_name || '', invoice_date: (inv.invoice_date || '').split('T')[0], reason: check.reason });
            continue;
          }
          const rows = formatInvoiceToSheetRows(inv);
          enqueueSheetsSyncJob({
            action: check.statusChangedOnly ? 'edit_invoice' : 'add_invoice',
            invoice_number: String(inv.invoice_number || ''),
            previous_invoice_number: check.statusChangedOnly ? String(inv.invoice_number || '') : undefined,
            pharmacy_name: inv.pharmacy_name,
            invoice_date: inv.invoice_date,
            rows
          });
          synced++;
          rowsCount += rows.length;
        }
        if (skipped.length > 0) addSkippedSheetDuplicateNotices(skipped);
        await Promise.race([
          flushSheetsSyncOutboxInternal({ keepalive: true }),
          new Promise(r => setTimeout(r, 3500))
        ]).catch(() => {});

        return {
          success: true,
          synced_count: synced,
          rows_count: rowsCount,
          skipped_duplicates: skipped,
          message: skipped.length > 0
            ? `تم رفع ${synced} فواتير جديدة (بما فيها المختلفة في الكميات) وتخطي ${skipped.length} فواتير مطابقة تماماً`
            : `تمت مزامنة ${synced} فواتير غير مرفوعة (${rowsCount} سطراً) بنجاح`
        };
      }
      throw err;
    }
  },

  async flushSheetsSyncOutbox(opts?: { keepalive?: boolean; useBeacon?: boolean }) {
    return flushSheetsSyncOutboxInternal(opts);
  },

  async deleteDuplicateSheetInvoice(target: { invoice_number: string; pharmacy_name?: string; invoice_date?: string; timestamp?: string }) {
    const cleanNum = String(target.invoice_number || '').trim();
    const list = getStoredInvoices();
    if (cleanNum) {
      const matching = list.filter(i => String(i.invoice_number || '').trim() === cleanNum);
      if (matching.length > 1) {
        const toDelete = matching[matching.length - 1];
        saveStoredInvoices(list.filter(i => i.id !== toDelete.id));
      }
    }
    enqueueSheetsSyncJob({
      action: 'delete_invoice',
      invoice_number: cleanNum,
      pharmacy_name: target.pharmacy_name,
      invoice_date: target.invoice_date,
      timestamp: target.timestamp,
      delete_mode: 'duplicate_copy'
    });
    await Promise.race([
      flushSheetsSyncOutboxInternal({ keepalive: true }),
      new Promise(r => setTimeout(r, 3000))
    ]).catch(() => {});
  },

  async repairGoogleSheet(): Promise<{ success: boolean; message: string }> {
    const webhookUrl = getSavedWebhookUrl();
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      return { success: false, message: 'رابط Webhook غير مفعّل.' };
    }
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'repair',
        spreadsheetId: getSavedSheetId(),
        sheetName: 'الفواتير'
      })
    });
    return {
      success: true,
      message: 'تم إرسال أمر إصلاح الأعمدة المزاحة وفحص التكرار وتلوين الصفوف في كوكل شيت.'
    };
  },

  async checkWebhookScriptStatus(): Promise<{ scriptVersion: number; isOutdated: boolean }> {
    const webhookUrl = getSavedWebhookUrl();
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      return { scriptVersion: 0, isOutdated: false };
    }
    try {
      const res = await fetch(webhookUrl, { method: 'GET' });
      if (!res.ok) return { scriptVersion: 0, isOutdated: false };
      const data = await res.json().catch(() => null);
      if (!data) return { scriptVersion: 0, isOutdated: false };
      const ver = Number(data.script_version || 1);
      return { scriptVersion: ver, isOutdated: ver < 10 };
    } catch {
      return { scriptVersion: 0, isOutdated: false };
    }
  },

  getPendingSkippedSheetDuplicates,
  addSkippedSheetDuplicateNotices,
  clearSkippedSheetDuplicateNotices,

  async importMissingFromSheets(): Promise<{
    imported_count: number;
    message: string;
  }> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/sheets/import-missing', {
        method: 'POST',
        headers: authHeaders()
      }, 15000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return { imported_count: 0, message: 'تم التحقق من الشيت في الوضع السحابي المباشر' };
      }
      throw err;
    }
  },

  async getSheetsConfig(): Promise<{
    sheet_id: string;
    sheet_url: string;
    webhook_url: string;
    is_connected: boolean;
    apps_script_code: string;
    headers: string[];
  }> {
    if (!hasAssignedDatabase(getCurrentUser())) throw new Error(NO_DATABASE_ERROR_MSG);
    try {
      const res = await fetchApi('/sheets/config', { headers: authHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return {
          sheet_id: getSavedSheetId(),
          sheet_url: getSavedSheetUrl(),
          webhook_url: getSavedWebhookUrl(),
          is_connected: Boolean(getSavedWebhookUrl()),
          apps_script_code: APPS_SCRIPT_V2_CODE,
          headers: ['رقم الفاتورة', 'تاريخ الفاتورة', 'اسم المذخر', 'اسم الصيدلية', 'المنطقة / المكان', 'المدينة / المحافظة', 'اسم المادة الدوائية', 'نوع المادة / الشكل الدوائي', 'الكمية', 'سعر المفرد (د.ع)', 'البونص المجاني', 'المجموع (د.ع)', 'صافي الفاتورة الكلي (د.ع)', 'اسم المندوب العلمي', 'حالة الاعتماد', 'وقت وتاريخ الإدراج']
        };
      }
      throw err;
    }
  },

  async updateSheetsWebhook(webhook_url: string): Promise<{
    webhook_url: string;
    is_connected: boolean;
  }> {
    const cleanUrl = webhook_url.trim();
    const user = getCurrentUser();
    if (user) {
      localStorage.setItem(`pharma_webhook_url::${user.id}`, cleanUrl);
      setCurrentUser({ ...user, webhook_url: cleanUrl || undefined });
    } else {
      localStorage.setItem('pharma_webhook_url', cleanUrl);
    }
    try {
      const res = await fetchApi('/sheets/config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ webhook_url: cleanUrl })
      });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return { webhook_url: cleanUrl, is_connected: Boolean(cleanUrl) };
      }
      throw err;
    }
  },

  // ── Analytics ──
  async getKPIs(): Promise<KPISummary> {
    if (!hasAssignedDatabase(getCurrentUser())) {
      return {
        total_invoices: 0,
        total_pharmacies_visited: 0,
        total_pieces_sold: 0,
        total_bonus_given: 0,
        total_bonus_pieces: 0,
        total_revenue: 0,
        total_sales_amount: 0,
        approved_invoices: 0,
        pending_invoices: 0
      };
    }
    try {
      const res = await fetchApi('/analytics/kpis', { headers: authHeaders() });
      return await handleResponse<KPISummary>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const invs = getStoredInvoices();
        const phs = getStoredPharmacies();
        const revenue = invs.reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
        const pieces = invs.reduce((s, i) => s + Number(i.total_pieces_count || 0), 0);
        const bonus = invs.reduce((s, i) => s + Number(i.total_bonus_count || 0), 0);
        return {
          total_invoices: invs.length,
          total_pharmacies_visited: phs.length,
          total_pieces_sold: pieces,
          total_bonus_given: bonus,
          total_bonus_pieces: bonus,
          total_revenue: revenue,
          total_sales_amount: revenue,
          approved_invoices: invs.filter(i => i.status === 'approved').length,
          pending_invoices: invs.filter(i => i.status === 'pending_review').length
        };
      }
      throw err;
    }
  },

  async getRepKPIs(repId: string): Promise<KPISummary> {
    try {
      const res = await fetchApi(`/analytics/kpis?rep_id=${repId}`, { headers: authHeaders() });
      return await handleResponse<KPISummary>(res);
    } catch (err: any) {
      if (isNetworkError(err)) return api.getKPIs();
      throw err;
    }
  },

  // ── Users Management & Admin Google Sheet (Master DB) ──
  async getAdminUsersFromSheet(): Promise<AdminSheetUser[]> {
    return fetchAdminSheetUsersInBrowser();
  },

  async syncSharedGeminiKeyFromSheet(): Promise<string> {
    const users = await fetchAdminSheetUsersInBrowser().catch(() => [] as AdminSheetUser[]);
    return extractSharedGeminiKey(users) || getSavedGeminiKey();
  },

  async syncUserSessionFromMasterSheet(): Promise<{ user: User | null; sharedGeminiKey: string }> {
    const cur = getCurrentUser();
    if (!cur) return { user: null, sharedGeminiKey: '' };
    const users = await fetchAdminSheetUsersInBrowser().catch(() => [] as AdminSheetUser[]);
    const sharedGem = extractSharedGeminiKey(users);
    if (users.length === 0) return { user: cur, sharedGeminiKey: sharedGem || getSavedGeminiKey() };

    const normCur = normalizePersonName(cur.full_name);
    const matched = users.find(u =>
      normalizePersonName(u.full_name) === normCur ||
      u.email.toLowerCase() === cur.email.toLowerCase()
    );
    if (!matched) return { user: cur, sharedGeminiKey: sharedGem || getSavedGeminiKey() };

    const nextUser: User = {
      ...cur,
      full_name: matched.full_name,
      role: matched.role,
      sheet_id: matched.sheet_id,
      sheet_url: matched.sheet_url,
      webhook_url: matched.webhook_url,
      gemini_api_key: matched.gemini_api_key || sharedGem || undefined
    };
    const changed =
      nextUser.sheet_id !== cur.sheet_id ||
      nextUser.webhook_url !== cur.webhook_url ||
      nextUser.role !== cur.role ||
      nextUser.full_name !== cur.full_name ||
      nextUser.gemini_api_key !== cur.gemini_api_key;
    if (changed) setCurrentUser(nextUser);
    return { user: nextUser, sharedGeminiKey: sharedGem || nextUser.gemini_api_key || '' };
  },

  async adminSetSharedGeminiKey(geminiKey: string): Promise<{ verifiedInSheet: boolean; message: string }> {
    const cleanKey = geminiKey.trim();
    if (cleanKey) {
      localStorage.setItem(LS_SHARED_GEMINI_KEY, cleanKey);
      localStorage.setItem('pharma_gemini_api_key', cleanKey);
    } else {
      localStorage.removeItem(LS_SHARED_GEMINI_KEY);
      localStorage.removeItem('pharma_gemini_api_key');
    }
    const cur = getCurrentUser();
    if (cur) setCurrentUser({ ...cur, gemini_api_key: cleanKey || undefined });

    try {
      const res = await fetchApi('/users/shared-gemini-key', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ gemini_api_key: cleanKey, admin_webhook_url: getAdminWebhookUrl() })
      }, 10000);
      await handleResponse(res);
      return { verifiedInSheet: true, message: 'تم حفظ مفتاح Gemini وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح ✅' };
    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      const hookUrl = getAdminWebhookUrl();
      if (!hookUrl) throw new Error('يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً');
      const hookRes = await sendWebhookCommand(hookUrl, {
        action: 'set_shared_gemini_key',
        adminSpreadsheetId: ADMIN_SHEET_ID,
        spreadsheetId: ADMIN_SHEET_ID,
        gemini_api_key: cleanKey
      });
      if (hookRes.parsed && hookRes.parsed.success === false) {
        throw new Error(hookRes.parsed.error || 'فشل تعميم مفتاح Gemini في الشيت الرئيسي');
      }
      await new Promise(r => setTimeout(r, 1200));
      const refreshed = await fetchAdminSheetUsersInBrowser().catch(() => [] as AdminSheetUser[]);
      const verified = extractSharedGeminiKey(refreshed) === cleanKey;
      return {
        verifiedInSheet: verified,
        message: verified
          ? 'تم حفظ مفتاح Gemini في العمود E وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح ✅'
          : 'تم إرسال المفتاح للشيت الرئيسي (تأكد من تحديث Apps Script للإصدار v10 على الشيت الرئيسي ليُحفظ في العمود E للجميع).'
      };
    }
  },

  async adminSyncTemplateToAllSheets(opts?: { targetIds?: string[]; targetSpreadsheetId?: string; mode?: 'full' | 'tabs_only' }): Promise<{ updatedSheets: number; totalTargets: number; message: string; script_version?: number; results?: Array<{ sheetId: string; sheetName?: string; ok: boolean; tabsCount?: number; pivotsCount?: number; tabNames?: string[]; errorDetails?: string; error?: string }> }> {
    const mode = opts?.mode === 'tabs_only' ? 'tabs_only' : 'full';
    const actionName = mode === 'tabs_only' ? 'sync_tabs_only' : 'sync_template_to_all';
    const validateTemplateResult = (parsed: any) => {
      if (!parsed) return;
      if (parsed.success === false) {
        throw new Error(parsed.error || parsed.message || 'تعذر مزامنة أوراق و Pivot Tables الأدمن');
      }
      const ver = Number(parsed.script_version || 0);
      if (ver < 10 || parsed.updatedSheets === undefined) {
        throw new Error(
          `السكربت المنشور على شيت الأدمن هو الإصدار (v${ver || 'قديم'}) ولا يدعم استنساخ الأوراق و Pivot Tables بالكامل. انسخ كود v10 والصقه في Apps Script ← Deploy ← Manage deployments ← Edit ← New version ← Deploy.`
        );
      }
    };
    try {
      const res = await fetchApi('/users/sync-template-all', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          admin_webhook_url: getAdminWebhookUrl(),
          targetIds: opts?.targetIds || [],
          targetSpreadsheetId: opts?.targetSpreadsheetId,
          mode
        })
      }, 45000);
      const data = await handleResponse<any>(res);
      validateTemplateResult(data);
      return data;
    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      const hookUrl = getAdminWebhookUrl();
      if (!hookUrl) throw new Error('لا يوجد رابط Apps Script المركزي للأدمن');
      const hookRes = await sendWebhookCommand(hookUrl, {
        action: actionName,
        mode,
        adminSpreadsheetId: ADMIN_SHEET_ID,
        spreadsheetId: DEFAULT_SHEET_ID,
        targetSpreadsheetId: opts?.targetSpreadsheetId,
        targetIds: opts?.targetIds || []
      }, 45000);
      if (hookRes.opaque) {
        throw new Error('تعذر قراءة استجابة Google Apps Script — تأكد من نشر كود v10 بصلاحية Anyone.');
      }
      validateTemplateResult(hookRes.parsed);
      return hookRes.parsed || {
        updatedSheets: 0,
        totalTargets: 0,
        message: 'تمت مزامنة أوراق و Pivot Tables الأدمن بنجاح ✅'
      };
    }
  },

  async adminUnifyWebhookUrl(centralUrl?: string, mode: 'set' | 'clear' = 'set'): Promise<{ updated: number; message: string; script_version?: number }> {
    const resolvedCentral = (centralUrl || getAdminWebhookUrl() || DEFAULT_WEBHOOK_URL).trim();
    const validateUnifyResult = (parsed: any) => {
      if (!parsed) return;
      if (parsed.success === false) {
        throw new Error(parsed.error || parsed.message || 'تعذر توحيد رابط السكربت المركزي');
      }
      const ver = Number(parsed.script_version || 0);
      if (ver < 10 || parsed.updated === undefined) {
        throw new Error(
          `السكربت المنشور على شيت الأدمن هو الإصدار (v${ver || 'قديم'}) ولا يدعم أمر توحيد عمود D. يرجى نشر كود v10 (New version) أولاً.`
        );
      }
    };
    try {
      const res = await fetchApi('/users/unify-webhook', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          centralWebhookUrl: resolvedCentral,
          mode,
          admin_webhook_url: getAdminWebhookUrl()
        })
      }, 20000);
      const data = await handleResponse<any>(res);
      validateUnifyResult(data);
      return data;
    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      const hookUrl = getAdminWebhookUrl();
      if (!hookUrl) throw new Error('يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً');
      const hookRes = await sendWebhookCommand(hookUrl, {
        action: 'unify_admin_webhook',
        adminSpreadsheetId: ADMIN_SHEET_ID,
        spreadsheetId: ADMIN_SHEET_ID,
        centralWebhookUrl: resolvedCentral,
        mode
      }, 20000);
      if (hookRes.opaque) {
        throw new Error('تعذر قراءة استجابة Google Apps Script — تأكد من نشر كود v10 بصلاحية Anyone.');
      }
      validateUnifyResult(hookRes.parsed);
      return hookRes.parsed || {
        updated: 0,
        message: 'تم إرسال أمر توحيد رابط سكربت الأدمن المركزي لجميع الحسابات بنجاح ⚡'
      };
    }
  },

  async checkAdminWebhookVersion(): Promise<{ scriptVersion: number; isOutdated: boolean }> {
    const url = getAdminWebhookUrl();
    if (!url || !url.startsWith('http')) return { scriptVersion: 0, isOutdated: true };
    try {
      const res = await fetch(`${url}?action=users&_t=${Date.now()}`, { method: 'GET' });
      if (!res.ok) return { scriptVersion: 0, isOutdated: false };
      const data = await res.json().catch(() => null);
      if (!data) return { scriptVersion: 0, isOutdated: false };
      const ver = Number(data.script_version || 1);
      return { scriptVersion: ver, isOutdated: ver < 10 };
    } catch {
      return { scriptVersion: 0, isOutdated: false };
    }
  },

  async adminAddSheetUser(data: { full_name: string; password: string; sheet_url?: string; webhook_url?: string; gemini_api_key?: string }): Promise<{ verifiedInSheet: boolean; message: string }> {
    const cleanName = data.full_name.trim();
    const cleanPwd = normalizeDigits(data.password.trim());
    const cleanGem = data.gemini_api_key?.trim() || getSavedGeminiKey();
    try {
      const res = await fetchApi('/users/add-to-sheet', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          full_name: cleanName,
          password: cleanPwd,
          sheet_url: data.sheet_url?.trim() || '',
          webhook_url: data.webhook_url?.trim() || '',
          gemini_api_key: cleanGem || '',
          admin_webhook_url: getAdminWebhookUrl()
        })
      }, 10000);
      await handleResponse(res);
      return { verifiedInSheet: true, message: 'تمت إضافة المستخدم إلى الشيت الرئيسي بنجاح' };
    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      const hookUrl = getAdminWebhookUrl();
      if (!hookUrl) throw new Error('يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً');
      const hookRes = await sendWebhookCommand(hookUrl, {
        action: 'add_user',
        adminSpreadsheetId: ADMIN_SHEET_ID,
        spreadsheetId: ADMIN_SHEET_ID,
        user: {
          full_name: cleanName,
          password_hash: cleanPwd,
          sheet_url: data.sheet_url?.trim() || '',
          sheet_id: extractGoogleSheetId(data.sheet_url),
          webhook_url: data.webhook_url?.trim() || '',
          gemini_api_key: cleanGem || ''
        }
      });
      if (hookRes.parsed && hookRes.parsed.success === false) {
        throw new Error(hookRes.parsed.error || 'فشل إضافة المستخدم للشيت الرئيسي');
      }
      await new Promise(r => setTimeout(r, 1200));
      const refreshed = await fetchAdminSheetUsersInBrowser().catch(() => [] as AdminSheetUser[]);
      const found = refreshed.some(u => normalizePersonName(u.full_name) === normalizePersonName(cleanName));
      return {
        verifiedInSheet: found,
        message: found ? 'تمت إضافة المستخدم وتوثيقه في الشيت الرئيسي بنجاح ✅' : 'تم إرسال الطلب إلى Google Apps Script (تأكد من تحديث السكربت للإصدار v10 إذا لم يظهر الصف فوراً).'
      };
    }
  },

  async adminUpdateSheetUser(data: { rowNumber: number; currentName: string; newName?: string; newPassword?: string; newSheetUrl?: string; newWebhookUrl?: string; newGeminiApiKey?: string }): Promise<{ verifiedInSheet: boolean; message: string }> {
    const cleanNewName = data.newName?.trim();
    const cleanNewPwd = data.newPassword !== undefined && data.newPassword.trim() !== '' ? normalizeDigits(data.newPassword.trim()) : undefined;
    try {
      const res = await fetchApi('/users/update-in-sheet', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          rowNumber: data.rowNumber,
          currentName: data.currentName,
          newName: cleanNewName,
          newPassword: cleanNewPwd,
          newSheetUrl: data.newSheetUrl?.trim(),
          newWebhookUrl: data.newWebhookUrl?.trim(),
          newGeminiApiKey: data.newGeminiApiKey?.trim(),
          admin_webhook_url: getAdminWebhookUrl()
        })
      }, 10000);
      await handleResponse(res);
      return { verifiedInSheet: true, message: 'تم تعديل المستخدم في الشيت الرئيسي بنجاح' };
    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      const hookUrl = getAdminWebhookUrl();
      if (!hookUrl) throw new Error('يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً');
      const hookRes = await sendWebhookCommand(hookUrl, {
        action: 'update_user',
        adminSpreadsheetId: ADMIN_SHEET_ID,
        spreadsheetId: ADMIN_SHEET_ID,
        rowNumber: data.rowNumber,
        currentName: data.currentName,
        newName: cleanNewName,
        newPassword: cleanNewPwd,
        newSheetUrl: data.newSheetUrl?.trim(),
        newWebhookUrl: data.newWebhookUrl?.trim(),
        newGeminiApiKey: data.newGeminiApiKey?.trim()
      });
      if (hookRes.parsed && hookRes.parsed.success === false) {
        throw new Error(hookRes.parsed.error || 'فشل تعديل المستخدم في الشيت الرئيسي');
      }
      await new Promise(r => setTimeout(r, 1200));
      const refreshed = await fetchAdminSheetUsersInBrowser().catch(() => [] as AdminSheetUser[]);
      const verifyRow = refreshed.find(u => u.rowNumber === data.rowNumber);
      const verified = Boolean(
        verifyRow &&
        (!cleanNewName || normalizePersonName(verifyRow.full_name) === normalizePersonName(cleanNewName)) &&
        (!cleanNewPwd || normalizeDigits(verifyRow.password_hash) === cleanNewPwd)
      );
      return {
        verifiedInSheet: verified,
        message: verified ? 'تم تعديل الصف وحفظه في الشيت الرئيسي بنجاح ✅' : 'تم إرسال التعديل للويب هوك (تأكد من نشر Apps Script v10 مع صلاحية الشيت الرئيسي إن لم يتغير الصف).'
      };
    }
  },

  async adminDeleteSheetUser(data: { rowNumber: number; currentName: string }): Promise<{ verifiedInSheet: boolean; message: string }> {
    try {
      const res = await fetchApi('/users/delete-from-sheet', {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({
          rowNumber: data.rowNumber,
          currentName: data.currentName,
          admin_webhook_url: getAdminWebhookUrl()
        })
      }, 10000);
      await handleResponse(res);
      return { verifiedInSheet: true, message: 'تم حذف المستخدم من الشيت الرئيسي بنجاح' };
    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      const hookUrl = getAdminWebhookUrl();
      if (!hookUrl) throw new Error('يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً');
      const hookRes = await sendWebhookCommand(hookUrl, {
        action: 'delete_user',
        adminSpreadsheetId: ADMIN_SHEET_ID,
        spreadsheetId: ADMIN_SHEET_ID,
        rowNumber: data.rowNumber,
        currentName: data.currentName
      });
      if (hookRes.parsed && hookRes.parsed.success === false) {
        throw new Error(hookRes.parsed.error || 'فشل حذف المستخدم من الشيت الرئيسي');
      }
      await new Promise(r => setTimeout(r, 1200));
      const refreshed = await fetchAdminSheetUsersInBrowser().catch(() => [] as AdminSheetUser[]);
      const stillThere = refreshed.some(u => u.rowNumber === data.rowNumber && normalizePersonName(u.full_name) === normalizePersonName(data.currentName));
      return {
        verifiedInSheet: !stillThere,
        message: !stillThere ? 'تم حذف المستخدم من الشيت الرئيسي بنجاح ✅' : 'تم إرسال أمر الحذف للويب هوك (تحقق من تحديث Apps Script للإصدار 9 على الشيت الرئيسي).'
      };
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetchApi('/users', { headers: authHeaders() });
      return await handleResponse<User[]>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const sheetUsers = await fetchAdminSheetUsersInBrowser();
        if (sheetUsers.length > 0) {
          return sheetUsers.map(({ password_hash: _ph, username: _un, ...u }) => u);
        }
        return [];
      }
      throw err;
    }
  },

  async generatePasswordHash(password: string): Promise<{ password: string; hash: string; length: number }> {
    const res = await fetchApi('/users/generate-hash', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ password })
    });
    return handleResponse(res);
  },

  async getAdminSheetConfig(): Promise<{
    sheet_id: string;
    sheet_url: string;
    sheet_name: string;
    columns: Array<{ col: string; field: string; title: string; example: string }>;
  }> {
    try {
      const res = await fetchApi('/users/admin-sheet-config', { headers: authHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return {
          sheet_id: ADMIN_SHEET_ID,
          sheet_url: ADMIN_SHEET_URL,
          sheet_name: 'الشيت الرئيسي',
          columns: [
            { col: 'A', field: 'full_name', title: 'الاسم', example: 'باقر علي' },
            { col: 'B', field: 'password_hash', title: 'الرمز السري', example: '123456' },
            { col: 'C', field: 'sheet_url', title: 'صفحة كوكل شيت', example: 'https://docs.google.com/spreadsheets/d/...' },
            { col: 'D', field: 'webhook_url', title: 'اي بي اي سكربت', example: 'https://script.google.com/macros/s/.../exec' },
            { col: 'E', field: 'gemini_api_key', title: 'اي بي اي جمناي', example: 'AIzaSy...' }
          ]
        };
      }
      throw err;
    }
  },

  async formatUserRow(payload: {
    full_name: string;
    email: string;
    password: string;
    role: string;
    gemini_api_key?: string;
    sheet_id?: string;
    webhook_url?: string;
  }): Promise<{
    id: string;
    full_name: string;
    email: string;
    role: string;
    rowValues: string[];
    tsvLine: string;
  }> {
    const res = await fetchApi('/users/format-row', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  }
};
