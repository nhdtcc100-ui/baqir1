import { User, Pharmacy, Product, Invoice, KPISummary } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1').replace(/\/$/, '');

// ── Mock Fallback Data (لتجربة المنصة أونلاين على GitHub Pages في حال عدم تشغيل السيرفر المحلي) ──
const MOCK_PHARMACIES: Pharmacy[] = [
  { id: 'ph-1', name: 'صيدلية دواء / شارع فلسطين', city: 'بغداد', area: 'شارع فلسطين', address: 'بغداد - شارع فلسطين مقابل ساحة بيروت', phone: '07701234567', total_invoices: 18, total_sales: 3450000 },
  { id: 'ph-2', name: 'صيدلية المطرقة', city: 'بغداد', area: 'الزعفرانية', address: 'بغداد - الزعفرانية السوق العام', phone: '07801234568', total_invoices: 12, total_sales: 2180000 },
  { id: 'ph-3', name: 'صيدلية النور الحديثة', city: 'بغداد', area: 'الكرادة', address: 'بغداد - الكرادة خارج', phone: '07901234569', total_invoices: 9, total_sales: 1950000 },
  { id: 'ph-4', name: 'صيدلية الشفاء التخصصية', city: 'بغداد', area: 'المنصور', address: 'بغداد - المنصور شارع 14 رمضان', phone: '07709876543', total_invoices: 15, total_sales: 4200000 }
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
    rep_id: 'rep-1',
    rep_name: 'علي حسن (مندوب بغداد)',
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
    rep_id: 'rep-1',
    rep_name: 'علي حسن (مندوب بغداد)',
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
    rep_id: 'rep-1',
    rep_name: 'علي حسن (مندوب بغداد)',
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

// ── Token & Session helpers ──────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('pharma_token');
export const setToken = (t: string) => localStorage.setItem('pharma_token', t);
export const removeToken = () => localStorage.removeItem('pharma_token');

export const getCurrentUser = (): User | null => {
  const d = localStorage.getItem('pharma_user');
  return d ? JSON.parse(d) : null;
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
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || json.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
      const token = json.data?.accessToken || json.data?.token;
      const user: User = json.data?.user;
      setToken(token);
      setCurrentUser(user);
      return { token, user };
    } catch (err: any) {
      if (err.message?.includes('fetch') || err.message?.includes('NetworkError') || err.name === 'TypeError') {
        console.warn('⚠️ Server offline or unreachable, entering Preview Demo mode');
        const isRep = email.includes('rep');
        const demoUser: User = {
          id: isRep ? 'rep-1' : 'admin-1',
          full_name: isRep ? 'علي حسن (مندوب بغداد)' : 'د. باقر (مدير النظام)',
          email: email || (isRep ? 'rep@pharma.com' : 'admin@pharma.com'),
          role: isRep ? 'medical_rep' : 'admin'
        };
        const token = 'demo-preview-jwt-' + Date.now();
        setToken(token);
        setCurrentUser(demoUser);
        return { token, user: demoUser };
      }
      throw err;
    }
  },

  // ── Pharmacies ──
  async getPharmacies(): Promise<Pharmacy[]> {
    try {
      const res = await fetch(`${API_BASE}/pharmacies`, { headers: authHeaders() });
      return await handleResponse<Pharmacy[]>(res);
    } catch (err: any) {
      if (err.message?.includes('fetch') || err.name === 'TypeError') return MOCK_PHARMACIES;
      throw err;
    }
  },

  async createPharmacy(data: Partial<Pharmacy>): Promise<Pharmacy> {
    try {
      const res = await fetch(`${API_BASE}/pharmacies`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
      });
      return await handleResponse<Pharmacy>(res);
    } catch (err: any) {
      if (err.message?.includes('fetch') || err.name === 'TypeError') {
        const newPh: Pharmacy = {
          id: 'ph-' + Date.now(),
          name: data.name || 'صيدلية تجريبية',
          city: data.city || 'بغداد',
          area: data.area || 'مركز المدينة',
          address: data.address || 'بغداد',
          phone: data.phone || '07700000000',
          total_invoices: 0,
          total_sales: 0
        };
        MOCK_PHARMACIES.unshift(newPh);
        return newPh;
      }
      throw err;
    }
  },

  // ── Products ──
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/catalog/products`, { headers: authHeaders() });
      return await handleResponse<Product[]>(res);
    } catch (err: any) {
      if (err.message?.includes('fetch') || err.name === 'TypeError') return MOCK_PRODUCTS;
      throw err;
    }
  },

  // ── Invoices ──
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await fetch(`${API_BASE}/invoices`, { headers: authHeaders() });
      return await handleResponse<Invoice[]>(res);
    } catch (err: any) {
      if (err.message?.includes('fetch') || err.name === 'TypeError') return MOCK_INVOICES;
      throw err;
    }
  },

  async createInvoice(payload: {
    pharmacy_id?: string;
    pharmacy_name?: string;
    invoice_number: string;
    invoice_date: string;
    image_url?: string;
    notes?: string;
    items: {
      product_id: string;
      sold_quantity: number;
      custom_product_name?: string;
      custom_unit_price?: number;
      ocr_confidence?: number;
    }[];
  }): Promise<Invoice> {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<Invoice>(res);
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
      ocr_confidence?: number;
    }[];
  }): Promise<Invoice> {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<Invoice>(res);
  },

  async reviewInvoice(
    id: string,
    status: 'approved' | 'rejected',
    rejection_reason?: string
  ): Promise<Invoice> {
    const res = await fetch(`${API_BASE}/invoices/${id}/review`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status, rejection_reason })
    });
    return handleResponse<Invoice>(res);
  },

  async deleteInvoice(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    await handleResponse<{ id: string }>(res);
  },

  // ── OCR Upload ──
  async uploadInvoiceFile(file: File, pharmacyId?: string): Promise<{
    extracted_items: { product_id?: string; product_name: string; quantity: number; unit_price?: number; bonus_quantity?: number }[];
    invoice_number?: string;
    invoice_date?: string;
    pharmacy_id?: string;
    pharmacy_name?: string;
    pharmacy_area?: string;
    image_url?: string;
    confidence: number;
    raw_text?: string;
  }> {
    const formData = new FormData();
    formData.append('invoice_file', file);
    if (pharmacyId) formData.append('pharmacy_id', pharmacyId);
    const res = await fetch(`${API_BASE}/invoices/ocr`, {
      method: 'POST',
      headers: authHeadersMultipart(),
      body: formData
    });
    return handleResponse(res);
  },

  // ── Batch OCR Upload (رفع أكثر من صورة) ──
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
    const formData = new FormData();
    files.forEach(f => formData.append('invoice_files', f));
    const res = await fetch(`${API_BASE}/invoices/ocr-batch`, {
      method: 'POST',
      headers: authHeadersMultipart(),
      body: formData
    });
    return handleResponse(res);
  },

  // ── Batch Invoices Creation (حفظ عدة فواتير دفعة واحدة) ──
  async createInvoicesBatch(invoices: any[]): Promise<{ count: number; invoices: Invoice[] }> {
    const res = await fetch(`${API_BASE}/invoices/batch`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ invoices })
    });
    return handleResponse(res);
  },

  // ── Google Sheets Database Integration ──
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
    }>;
    rawCount: number;
    sheet_id: string;
    sheet_url: string;
  }> {
    const res = await fetch(`${API_BASE}/sheets/data`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async syncAllToSheets(): Promise<{
    success: boolean;
    rows_count: number;
    message: string;
    mode: string;
    timestamp: string;
  }> {
    const res = await fetch(`${API_BASE}/sheets/sync-all`, {
      method: 'POST',
      headers: authHeaders()
    });
    return handleResponse(res);
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
    const res = await fetch(`${API_BASE}/sheets/gap-status`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async syncUnuploadedToSheets(): Promise<{
    success: boolean;
    synced_count: number;
    rows_count: number;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/sheets/sync-unuploaded`, {
      method: 'POST',
      headers: authHeaders()
    });
    return handleResponse(res);
  },

  async importMissingFromSheets(): Promise<{
    imported_count: number;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/sheets/import-missing`, {
      method: 'POST',
      headers: authHeaders()
    });
    return handleResponse(res);
  },

  async getSheetsConfig(): Promise<{
    sheet_id: string;
    sheet_url: string;
    webhook_url: string;
    is_connected: boolean;
    apps_script_code: string;
    headers: string[];
  }> {
    const res = await fetch(`${API_BASE}/sheets/config`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async updateSheetsWebhook(webhook_url: string): Promise<{
    webhook_url: string;
    is_connected: boolean;
  }> {
    const res = await fetch(`${API_BASE}/sheets/config`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ webhook_url })
    });
    return handleResponse(res);
  },

  // ── Analytics ──
  async getKPIs(): Promise<KPISummary> {
    try {
      const res = await fetch(`${API_BASE}/analytics/kpis`, { headers: authHeaders() });
      return await handleResponse<KPISummary>(res);
    } catch (err: any) {
      if (err.message?.includes('fetch') || err.name === 'TypeError') {
        return {
          total_invoices: MOCK_INVOICES.length,
          total_pharmacies_visited: MOCK_PHARMACIES.length,
          total_pieces_sold: 48,
          total_bonus_given: 4,
          total_bonus_pieces: 4,
          total_revenue: 1263010,
          total_sales_amount: 1263010,
          approved_invoices: 2,
          pending_invoices: 1
        };
      }
      throw err;
    }
  },

  async getRepKPIs(repId: string): Promise<KPISummary> {
    const res = await fetch(`${API_BASE}/analytics/kpis?rep_id=${repId}`, { headers: authHeaders() });
    return handleResponse<KPISummary>(res);
  },

  // ── Users Management & Admin Google Sheet ──
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, { headers: authHeaders() });
    return handleResponse<User[]>(res);
  },

  async generatePasswordHash(password: string): Promise<{ password: string; hash: string; length: number }> {
    const res = await fetch(`${API_BASE}/users/generate-hash`, {
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
    const res = await fetch(`${API_BASE}/users/admin-sheet-config`, { headers: authHeaders() });
    return handleResponse(res);
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
    const res = await fetch(`${API_BASE}/users/format-row`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  }
};
