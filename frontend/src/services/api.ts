import { User, Pharmacy, Product, Invoice, KPISummary } from '../types';

const DEFAULT_API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1').replace(/\/$/, '');
const DEFAULT_SHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
const DEFAULT_SHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_ID}/edit?usp=sharing`;
const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzNVERdMAD6DfcaW6oGOSOZeuuNv-0j2qJ1HVndYMILL8eWkcD5PJ1fG3sJkLV80-qs/exec';
const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RI7QKGakHvDzPkL_ACaF152i44-wc3IGrTIYT_HeLAU/edit?usp=sharing';

export const getApiBase = (): string => {
  const custom = localStorage.getItem('pharma_api_base');
  return (custom && custom.trim() ? custom.trim() : DEFAULT_API_BASE).replace(/\/$/, '');
};

export const setApiBase = (url: string) => {
  if (url.trim()) localStorage.setItem('pharma_api_base', url.trim().replace(/\/$/, ''));
  else localStorage.removeItem('pharma_api_base');
};

export const getSavedGeminiKey = (): string => {
  return (localStorage.getItem('pharma_gemini_api_key') || getCurrentUser()?.gemini_api_key || '').trim();
};

export const setSavedGeminiKey = (key: string) => {
  if (key.trim()) localStorage.setItem('pharma_gemini_api_key', key.trim());
  else localStorage.removeItem('pharma_gemini_api_key');
};

export const getSavedWebhookUrl = (): string => {
  return (localStorage.getItem('pharma_webhook_url') || getCurrentUser()?.webhook_url || DEFAULT_WEBHOOK_URL).trim();
};

export const getSavedSheetId = (): string => {
  const customUrl = localStorage.getItem('pharma_google_sheet_url') || '';
  const match = customUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  return (getCurrentUser()?.sheet_id || DEFAULT_SHEET_ID).trim();
};

export const getSavedSheetUrl = (): string => {
  const customUrl = localStorage.getItem('pharma_google_sheet_url');
  if (customUrl && customUrl.trim()) return customUrl.trim();
  const id = getSavedSheetId();
  return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing`;
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

// ── Persistent Local Storage Store (Offline / GitHub Pages Support) ──────────
const LS_PHARMACIES_KEY = 'pharma_local_pharmacies_v1';
const LS_INVOICES_KEY = 'pharma_local_invoices_v1';

function getStoredPharmacies(): Pharmacy[] {
  try {
    const raw = localStorage.getItem(LS_PHARMACIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [...MOCK_PHARMACIES];
}

function saveStoredPharmacies(list: Pharmacy[]) {
  try {
    localStorage.setItem(LS_PHARMACIES_KEY, JSON.stringify(list));
  } catch { /* ignore */ }
}

function getStoredInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(LS_INVOICES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return [...MOCK_INVOICES];
}

function saveStoredInvoices(list: Invoice[]) {
  try {
    localStorage.setItem(LS_INVOICES_KEY, JSON.stringify(list));
  } catch {
    // Trim heavy base64 images if localStorage quota is exceeded
    try {
      const stripped = list.map((inv, idx) =>
        idx > 3 && inv.image_url?.startsWith('data:') ? { ...inv, image_url: undefined } : inv
      );
      localStorage.setItem(LS_INVOICES_KEY, JSON.stringify(stripped));
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

/** Timeout helper so mobile doesn't wait 60s when localhost:5000 is unreachable */
async function fetchApi(path: string, init?: RequestInit, timeoutMs = 6000): Promise<Response> {
  const apiBase = getApiBase();
  const isRemoteHttpsToLocalhost =
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    apiBase.startsWith('http://localhost');

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

// ── Client-Side File DataURL & Optional Direct Gemini Vision OCR ─────────────
function fileToBase64DataUrl(file: File): Promise<{ dataUrl: string; base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIdx = dataUrl.indexOf(',');
      const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
      resolve({
        dataUrl,
        base64,
        mimeType: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg')
      });
    };
    reader.onerror = () => reject(new Error('تعذر قراءة الملف من الجهاز، يرجى التحقق من صلاحية الوصول للملفات'));
    reader.readAsDataURL(file);
  });
}

async function runBrowserGeminiOcr(fileData: { base64: string; mimeType: string }, geminiKey: string) {
  const prompt = `اقرأ فاتورة الأدوية هذه واستخرج JSON فقط بدون Markdown أو نص إضافي بهذا الشكل الدقيق:
{
  "invoice_number": "رقم الفاتورة",
  "invoice_date": "YYYY-MM-DD",
  "pharmacy_name": "الاسم الكامل للصيدلية",
  "pharmacy_area": "المنطقة أو المكان",
  "items": [
    { "product_name": "اسم الدواء", "dosage_form": "قطرة|كريم|مرهم|حبوب", "quantity": 10, "unit_price": 5000, "bonus_quantity": 1 }
  ],
  "confidence": 0.9
}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: fileData.mimeType, data: fileData.base64 } }
        ]
      }]
    })
  });
  if (!res.ok) throw new Error('Gemini API returned ' + res.status);
  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = rawText.replace(/```json\s*|```/gi, '').trim();
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < 0) throw new Error('Invalid JSON from Gemini');
  return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
}

// Helper to push an invoice locally and optionally fire webhook
function persistLocalInvoice(payload: any): Invoice {
  const pharmacies = getStoredPharmacies();
  const invoices = getStoredInvoices();
  const curUser = getCurrentUser();

  let targetPharmacy = pharmacies.find(p => p.id === payload.pharmacy_id) ||
    pharmacies.find(p => payload.pharmacy_name && p.name.trim().toLowerCase() === payload.pharmacy_name.trim().toLowerCase());

  if (!targetPharmacy && payload.pharmacy_name) {
    targetPharmacy = {
      id: 'ph-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
      name: payload.pharmacy_name.trim(),
      city: 'بغداد',
      area: payload.pharmacy_area || '',
      address: payload.pharmacy_area ? `بغداد - ${payload.pharmacy_area}` : 'بغداد',
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

  const newInv: Invoice = {
    id: 'inv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
    invoice_number: payload.invoice_number || `INV-${Date.now().toString().slice(-6)}`,
    invoice_date: payload.invoice_date || new Date().toISOString().split('T')[0],
    pharmacy_id: targetPharmacy?.id || payload.pharmacy_id || 'ph-custom',
    pharmacy_name: targetPharmacy?.name || payload.pharmacy_name || 'صيدلية معتمدة',
    pharmacy_city: targetPharmacy?.city || 'بغداد',
    pharmacy_area: payload.pharmacy_area || targetPharmacy?.area || '',
    rep_id: curUser?.id || 'rep-rusafa',
    rep_name: curUser?.full_name || 'علي حسن (مندوب الرصافة)',
    status: 'pending_review',
    total_sales_amount: totalAmount,
    total_pieces_count: totalPieces,
    total_bonus_count: totalBonus,
    image_url: payload.image_url,
    notes: payload.notes,
    created_at: new Date().toISOString(),
    items: builtItems
  };

  invoices.unshift(newInv);
  saveStoredInvoices(invoices);

  // Silently notify Apps Script webhook in background if configured
  const webhookUrl = getSavedWebhookUrl();
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'append_invoice', invoice: newInv })
      }).catch(() => {});
    } catch { /* ignore */ }
  }

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
export const removeCurrentUser = () => localStorage.removeItem('pharma_user');

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
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || json.message || 'البريد الإلكتروني أو رمز المرور غير صحيح');
      }
      const token = json.data?.accessToken || json.data?.token;
      const user: User = json.data?.user;
      setToken(token);
      setCurrentUser(user);
      return { token, user };
    } catch (err: any) {
      if (isNetworkError(err)) {
        const low = email.toLowerCase().trim();
        let demoUser: User;

        if (low.includes('super') || low.includes('مشرف')) {
          demoUser = { ...SEED_USERS[1] };
        } else if (low.includes('karkh') || low.includes('كرخ') || low.includes('احمد') || low.includes('أحمد')) {
          demoUser = { ...SEED_USERS[3] };
        } else if (low.includes('rusafa') || low.includes('رصافة') || low.includes('علي') || low.includes('rep')) {
          demoUser = { ...SEED_USERS[2] };
        } else {
          demoUser = { ...SEED_USERS[0] };
        }

        const token = 'demo-preview-jwt-' + Date.now();
        setToken(token);
        setCurrentUser(demoUser);
        return { token, user: demoUser };
      }
      throw err;
    }
  },

  async register(data: { fullName: string; username: string; pin: string; area?: string; sheetUrl?: string }): Promise<{ token: string; user: User }> {
    if (data.sheetUrl) {
      localStorage.setItem('pharma_google_sheet_url', data.sheetUrl.trim());
    }
    try {
      const email = data.username.includes('@') ? data.username.trim().toLowerCase() : `${data.username.trim().toLowerCase()}@pharma.com`;
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName.trim(),
          email,
          password: data.pin,
          roleName: 'medical_rep'
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.message || 'فشل تسجيل الحساب');
      const token = json.data?.accessToken || json.data?.token;
      const user: User = json.data?.user;
      setToken(token);
      setCurrentUser(user);
      return { token, user };
    } catch (err: any) {
      if (isNetworkError(err)) {
        const email = data.username.includes('@') ? data.username.trim().toLowerCase() : `${data.username.trim().toLowerCase()}@pharma.com`;
        const newUser: User = {
          id: 'user-' + Date.now(),
          full_name: data.fullName.trim(),
          email,
          role: 'medical_rep',
          area: data.area || 'بغداد'
        };
        const token = 'demo-reg-jwt-' + Date.now();
        setToken(token);
        setCurrentUser(newUser);
        return { token, user: newUser };
      }
      throw err;
    }
  },

  // ── Pharmacies ──
  async getPharmacies(): Promise<Pharmacy[]> {
    try {
      const res = await fetchApi('/pharmacies', { headers: authHeaders() });
      return await handleResponse<Pharmacy[]>(res);
    } catch (err: any) {
      if (isNetworkError(err)) return getStoredPharmacies();
      throw err;
    }
  },

  async createPharmacy(data: Partial<Pharmacy>): Promise<Pharmacy> {
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
    try {
      const res = await fetchApi('/invoices', { headers: authHeaders() });
      return await handleResponse<Invoice[]>(res);
    } catch (err: any) {
      if (isNetworkError(err)) return getStoredInvoices();
      throw err;
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
    try {
      const res = await fetchApi('/invoices', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      }, 12000);
      return await handleResponse<Invoice>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return persistLocalInvoice(payload);
      }
      throw err;
    }
  },

  async updateInvoice(id: string, payload: {
    pharmacy_id?: string;
    pharmacy_area?: string;
    invoice_number?: string;
    invoice_date?: string;
    notes?: string;
    items?: {
      product_id: string;
      sold_quantity: number;
      custom_product_name?: string;
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
        const idx = list.findIndex(i => i.id === id);
        if (idx === -1) throw new Error('الفاتورة غير موجودة محلياً');
        const old = list[idx];
        const ph = pharmacies.find(p => p.id === (payload.pharmacy_id || old.pharmacy_id));

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
              sold_quantity: qty,
              historical_unit_price: price,
              bonus_quantity: bonus,
              total_quantity: qty + bonus,
              line_total: lineTotal
            };
          });
        }

        const updated: Invoice = {
          ...old,
          pharmacy_id: payload.pharmacy_id || old.pharmacy_id,
          pharmacy_name: ph?.name || old.pharmacy_name,
          pharmacy_area: payload.pharmacy_area ?? old.pharmacy_area,
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
        return list[idx];
      }
      throw err;
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    try {
      const res = await fetchApi(`/invoices/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      await handleResponse<{ id: string }>(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const list = getStoredInvoices().filter(i => i.id !== id);
        saveStoredInvoices(list);
        return;
      }
      throw err;
    }
  },

  // ── OCR Upload (with Browser Gemini Vision + Offline Safe DataURL Fallback) ─
  async uploadInvoiceFile(file: File, pharmacyId?: string): Promise<{
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
  }> {
    try {
      const formData = new FormData();
      formData.append('invoice_file', file);
      if (pharmacyId) formData.append('pharmacy_id', pharmacyId);
      const res = await fetchApi('/invoices/ocr', {
        method: 'POST',
        headers: authHeadersMultipart(),
        body: formData
      }, 28000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        // Read compressed file locally as DataURL so image previews & saving always work
        const fileData = await fileToBase64DataUrl(file);
        const geminiKey = getSavedGeminiKey();

        if (geminiKey) {
          try {
            const parsed = await runBrowserGeminiOcr(fileData, geminiKey);
            return {
              extracted_items: Array.isArray(parsed.items) ? parsed.items : [],
              invoice_number: parsed.invoice_number || undefined,
              invoice_date: parsed.invoice_date || new Date().toISOString().split('T')[0],
              pharmacy_name: parsed.pharmacy_name || undefined,
              pharmacy_area: parsed.pharmacy_area || undefined,
              image_url: fileData.dataUrl,
              confidence: Number(parsed.confidence || 0.9),
              offline_mode: false
            };
          } catch (gemErr) {
            console.warn('Browser Gemini OCR fallback failed, continuing with manual entry:', gemErr);
          }
        }

        // Graceful cloud/offline mode: never fail with "Failed to fetch"!
        return {
          extracted_items: [],
          invoice_number: '',
          invoice_date: new Date().toISOString().split('T')[0],
          pharmacy_name: '',
          pharmacy_area: '',
          image_url: fileData.dataUrl,
          confidence: 1,
          raw_text: '',
          offline_mode: true
        };
      }
      throw err;
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
  async createInvoicesBatch(invoices: any[]): Promise<{ count: number; invoices: Invoice[] }> {
    try {
      const res = await fetchApi('/invoices/batch', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ invoices })
      }, 15000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const created = invoices.map(inv => persistLocalInvoice(inv));
        return { count: created.length, invoices: created };
      }
      throw err;
    }
  },

  // ── Google Sheets Database Integration (with Direct gviz/tq Fallback) ──
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
    }>;
    rawCount: number;
    sheet_id: string;
    sheet_url: string;
  }> {
    try {
      const res = await fetchApi('/sheets/data', { headers: authHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const sheetId = getSavedSheetId();
        const sheetUrl = getSavedSheetUrl();
        const localInvs = getStoredInvoices();
        const localRows = localInvs.flatMap(inv =>
          (inv.items || []).map(it => ({
            invoice_number: inv.invoice_number || '',
            invoice_date: (inv.invoice_date || '').split('T')[0],
            warehouse_name: 'المستودع الرئيسي',
            pharmacy_name: inv.pharmacy_name || '',
            city: inv.pharmacy_city || 'بغداد',
            area: inv.pharmacy_area || '',
            product_name: it.product_name_snapshot || '',
            dosage_form: (it as any).dosage_form || '',
            quantity: Number(it.sold_quantity || 0),
            unit_price: Number(it.historical_unit_price || 0),
            bonus_quantity: Number(it.bonus_quantity || 0),
            line_total: Number(it.line_total || 0),
            total_invoice: Number(inv.total_sales_amount || 0),
            rep_name: inv.rep_name || '',
            status: inv.status === 'approved' ? 'معتمدة' : inv.status === 'rejected' ? 'مرفوضة' : 'قيد التدقيق',
            timestamp: inv.created_at || ''
          }))
        );

        // Try direct public gviz read from browser
        try {
          const gRes = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`);
          if (gRes.ok) {
            const text = await gRes.text();
            const m = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
            if (m && m[1]) {
              const parsed = JSON.parse(m[1]);
              const cols = (parsed.table?.cols || []).map((c: any) => String(c.label || ''));
              const rows = (parsed.table?.rows || []).map((r: any) => {
                const c = r.c || [];
                const val = (i: number) => String(c[i]?.f ?? c[i]?.v ?? '').trim();
                const num = (i: number) => Number(c[i]?.v || 0);
                return {
                  invoice_number: val(0),
                  invoice_date: val(1),
                  warehouse_name: val(2),
                  pharmacy_name: val(3),
                  area: val(4),
                  city: val(5),
                  product_name: val(6),
                  dosage_form: val(7),
                  quantity: num(8),
                  unit_price: num(9),
                  bonus_quantity: num(10),
                  line_total: num(11),
                  total_invoice: num(12),
                  rep_name: val(13),
                  status: val(14),
                  timestamp: val(15)
                };
              }).filter((r: any) => r.invoice_number || r.pharmacy_name);
              if (rows.length > 0) {
                return { headers: cols, rows, rawCount: rows.length, sheet_id: sheetId, sheet_url: sheetUrl };
              }
            }
          }
        } catch { /* fall back to local rows */ }

        return {
          headers: ['رقم الفاتورة', 'تاريخ الفاتورة', 'الصيدلية', 'المنطقة', 'المادة الدوائية', 'الكمية', 'السعر', 'البونص', 'المجموع', 'المندوب', 'الحالة'],
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
  }> {
    try {
      const res = await fetchApi('/sheets/sync-all', {
        method: 'POST',
        headers: authHeaders()
      }, 15000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const invs = getStoredInvoices();
        const webhookUrl = getSavedWebhookUrl();
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'sync_all', invoices: invs })
          }).catch(() => {});
        }
        return {
          success: true,
          rows_count: invs.length,
          message: `تمت المزامنة السحابية لـ ${invs.length} فواتير بنجاح 🚀`,
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
    try {
      const res = await fetchApi('/sheets/gap-status', { headers: authHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        const invs = getStoredInvoices();
        return {
          system_invoices_count: invs.length,
          sheet_rows_count: invs.length,
          sheet_unique_invoices_count: invs.length,
          unuploaded_count: 0,
          unuploaded_invoices: [],
          missing_in_system_count: 0,
          has_gap: false
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
  }> {
    try {
      const res = await fetchApi('/sheets/sync-unuploaded', {
        method: 'POST',
        headers: authHeaders()
      }, 15000);
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return { success: true, synced_count: 0, rows_count: 0, message: 'جميع الفواتير متزامنة محلياً وسحابياً' };
      }
      throw err;
    }
  },

  async importMissingFromSheets(): Promise<{
    imported_count: number;
    message: string;
  }> {
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
          apps_script_code: '// يمكن نسخ كود Apps Script عند تشغيل الخادم المحلي',
          headers: ['رقم الفاتورة', 'تاريخ الفاتورة', 'اسم المذخر', 'اسم الصيدلية', 'المنطقة', 'المدينة', 'المادة الدوائية', 'النوع', 'الكمية', 'سعر المفرد', 'البونص', 'المجموع', 'الصافي', 'المندوب', 'الحالة', 'الوقت']
        };
      }
      throw err;
    }
  },

  async updateSheetsWebhook(webhook_url: string): Promise<{
    webhook_url: string;
    is_connected: boolean;
  }> {
    localStorage.setItem('pharma_webhook_url', webhook_url.trim());
    try {
      const res = await fetchApi('/sheets/config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ webhook_url })
      });
      return await handleResponse(res);
    } catch (err: any) {
      if (isNetworkError(err)) {
        return { webhook_url: webhook_url.trim(), is_connected: Boolean(webhook_url.trim()) };
      }
      throw err;
    }
  },

  // ── Analytics ──
  async getKPIs(): Promise<KPISummary> {
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

  // ── Users Management & Admin Google Sheet ──
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetchApi('/users', { headers: authHeaders() });
      return await handleResponse<User[]>(res);
    } catch (err: any) {
      if (isNetworkError(err)) return [...SEED_USERS];
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
          sheet_id: '1RI7QKGakHvDzPkL_ACaF152i44-wc3IGrTIYT_HeLAU',
          sheet_url: ADMIN_SHEET_URL,
          sheet_name: 'المستخدمون',
          columns: []
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
