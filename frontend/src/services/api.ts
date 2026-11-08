import { User, Pharmacy, Product, Invoice, KPISummary } from '../types';

const API_BASE = 'http://localhost:5000/api/v1';

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
  },

  // ── Pharmacies ──
  async getPharmacies(): Promise<Pharmacy[]> {
    const res = await fetch(`${API_BASE}/pharmacies`, { headers: authHeaders() });
    return handleResponse<Pharmacy[]>(res);
  },

  async createPharmacy(data: Partial<Pharmacy>): Promise<Pharmacy> {
    const res = await fetch(`${API_BASE}/pharmacies`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Pharmacy>(res);
  },

  // ── Products ──
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/catalog/products`, { headers: authHeaders() });
    return handleResponse<Product[]>(res);
  },

  // ── Invoices ──
  async getInvoices(): Promise<Invoice[]> {
    const res = await fetch(`${API_BASE}/invoices`, { headers: authHeaders() });
    return handleResponse<Invoice[]>(res);
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
    const res = await fetch(`${API_BASE}/analytics/kpis`, { headers: authHeaders() });
    return handleResponse<KPISummary>(res);
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
