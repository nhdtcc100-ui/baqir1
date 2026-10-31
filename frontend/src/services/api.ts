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
    pharmacy_id: string;
    invoice_number: string;
    invoice_date: string;
    image_url?: string;
    notes?: string;
    items: { product_id: string; sold_quantity: number; ocr_confidence?: number }[];
  }): Promise<Invoice> {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
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

  // ── OCR Upload ──
  async uploadInvoiceFile(file: File): Promise<{
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
    const res = await fetch(`${API_BASE}/invoices/ocr`, {
      method: 'POST',
      headers: authHeadersMultipart(),
      body: formData
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.message || `فشل المسح الضوئي: ${res.status}`);
    }
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
  }
};
