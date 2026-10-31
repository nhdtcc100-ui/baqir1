import { User, Pharmacy, Product, BonusRule, Invoice, KPISummary } from '../types';

const API_BASE = 'http://localhost:5000/api/v1';

// Token storage helper
export const getToken = (): string | null => localStorage.getItem('pharma_token');
export const setToken = (token: string) => localStorage.setItem('pharma_token', token);
export const removeToken = () => localStorage.removeItem('pharma_token');

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem('pharma_user');
  return data ? JSON.parse(data) : null;
};
export const setCurrentUser = (user: User) => localStorage.setItem('pharma_user', JSON.stringify(user));
export const removeCurrentUser = () => localStorage.removeItem('pharma_user');

// Headers with JWT
const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// ── Fallback Initial Demo Mock Stores (Offline / Standalone mode) ─────────────
export const MOCK_USERS: Record<string, User> = {
  admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@pharma.com',
    full_name: 'د. باقر (مدير النظام)',
    role: 'admin',
    phone: '+9647700000001'
  },
  rep: {
    id: 'a0000000-0000-0000-0000-000000000002',
    email: 'rep@pharma.com',
    full_name: 'علي حسن (مندوب بغداد)',
    role: 'medical_rep',
    phone: '+9647700000002'
  }
};

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: 'ph000001-0000-0000-0000-000000000001',
    name: 'صيدلية النور الحديثة',
    city: 'بغداد',
    address: 'شارع الرشيد، المنصور',
    phone: '+9647800100001',
    assigned_rep_id: 'a0000000-0000-0000-0000-000000000002',
    assigned_rep_name: 'علي حسن',
    total_invoices: 14,
    total_sales: 8450,
    last_visit_date: '2026-10-28'
  },
  {
    id: 'ph000002-0000-0000-0000-000000000002',
    name: 'صيدلية الشفاء التخصصية',
    city: 'البصرة',
    address: 'شارع العشار الرئيسي',
    phone: '+9647800100002',
    assigned_rep_id: 'a0000000-0000-0000-0000-000000000002',
    assigned_rep_name: 'علي حسن',
    total_invoices: 9,
    total_sales: 5200,
    last_visit_date: '2026-10-25'
  },
  {
    id: 'ph000003-0000-0000-0000-000000000003',
    name: 'صيدلية الأمل المركزية',
    city: 'النجف',
    address: 'شارع الإمام علي، قرب المجمع الطبي',
    phone: '+9647800100003',
    assigned_rep_id: 'a0000000-0000-0000-0000-000000000001',
    assigned_rep_name: 'د. باقر',
    total_invoices: 6,
    total_sales: 3100,
    last_visit_date: '2026-10-20'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod0001-0000-0000-0000-000000000001', name: 'قطرة عين مرطبة 15ml', product_type: 'drop', base_price: 25.00, is_active: true },
  { id: 'prod0002-0000-0000-0000-000000000002', name: 'كريم ترطيب مكثف 50g', product_type: 'cream', base_price: 40.00, is_active: true },
  { id: 'prod0003-0000-0000-0000-000000000003', name: 'مرهم مضاد للالتهاب 30g', product_type: 'ointment', base_price: 35.00, is_active: true },
  { id: 'prod0004-0000-0000-0000-000000000004', name: 'قطرة أذن مضادة للألم 10ml', product_type: 'drop', base_price: 18.00, is_active: true },
  { id: 'prod0005-0000-0000-0000-000000000005', name: 'كريم حماية من الشمس SPF50', product_type: 'cream', base_price: 55.00, is_active: true }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv00001-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-001',
    invoice_date: '2026-10-22',
    pharmacy_id: 'ph000001-0000-0000-0000-000000000001',
    pharmacy_name: 'صيدلية النور الحديثة',
    rep_id: 'a0000000-0000-0000-0000-000000000002',
    rep_name: 'علي حسن',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    status: 'approved',
    total_sales_amount: 1300.00,
    total_pieces_count: 50,
    total_bonus_count: 5,
    items: [
      { product_id: 'prod0001-0000-0000-0000-000000000001', product_name_snapshot: 'قطرة عين مرطبة 15ml', product_type_snapshot: 'drop', sold_quantity: 20, historical_unit_price: 25, bonus_quantity: 2, total_quantity: 22, line_total: 500 },
      { product_id: 'prod0002-0000-0000-0000-000000000002', product_name_snapshot: 'كريم ترطيب مكثف 50g', product_type_snapshot: 'cream', sold_quantity: 20, historical_unit_price: 40, bonus_quantity: 2, total_quantity: 22, line_total: 800 }
    ],
    created_at: '2026-10-22T10:15:00Z'
  },
  {
    id: 'inv00002-0000-0000-0000-000000000002',
    invoice_number: 'INV-2026-002',
    invoice_date: '2026-10-26',
    pharmacy_id: 'ph000002-0000-0000-0000-000000000002',
    pharmacy_name: 'صيدلية الشفاء التخصصية',
    rep_id: 'a0000000-0000-0000-0000-000000000002',
    rep_name: 'علي حسن',
    image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop&q=80',
    status: 'pending_review',
    total_sales_amount: 705.00,
    total_pieces_count: 25,
    total_bonus_count: 3,
    items: [
      { product_id: 'prod0003-0000-0000-0000-000000000003', product_name_snapshot: 'مرهم مضاد للالتهاب 30g', product_type_snapshot: 'ointment', sold_quantity: 15, historical_unit_price: 35, bonus_quantity: 1, total_quantity: 16, line_total: 525 },
      { product_id: 'prod0004-0000-0000-0000-000000000004', product_name_snapshot: 'قطرة أذن مضادة للألم 10ml', product_type_snapshot: 'drop', sold_quantity: 10, historical_unit_price: 18, bonus_quantity: 2, total_quantity: 12, line_total: 180 }
    ],
    created_at: '2026-10-26T14:30:00Z'
  }
];

// ── API Client with Auto Real-Backend / Fallback ──────────────────────────────
export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      if (res.ok) {
        const json = await res.json();
        const token = json.data.accessToken || json.data.token;
        setToken(token);
        setCurrentUser(json.data.user);
        return { token, user: json.data.user };
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('غير صحيحة')) {
        throw err;
      }
      // If backend is completely offline / network error, fallback to mock demo
      console.warn('Backend unavailable, using local mock auth:', err.message);
      const role: 'admin' | 'rep' = email.includes('admin') ? 'admin' : 'rep';
      const expectedPass = role === 'admin' ? 'admin123456' : 'rep123456';
      if (password !== expectedPass && password !== 'admin' && password !== '123456') {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
      const user = MOCK_USERS[role];
      const token = 'mock_jwt_' + user.role;
      setToken(token);
      setCurrentUser(user);
      return { token, user };
    }
  },

  async getPharmacies(): Promise<Pharmacy[]> {
    try {
      const res = await fetch(`${API_BASE}/pharmacies`, { headers: authHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return MOCK_PHARMACIES;
  },

  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/catalog/products`, { headers: authHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return MOCK_PRODUCTS;
  },

  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await fetch(`${API_BASE}/invoices`, { headers: authHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return MOCK_INVOICES;
  },

  async createInvoice(payload: any): Promise<Invoice> {
    try {
      const res = await fetch(`${API_BASE}/invoices`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    // Mock local creation
    const newInv: Invoice = {
      id: 'inv_' + Date.now(),
      invoice_number: payload.invoice_number || `INV-${Date.now().toString().slice(-4)}`,
      invoice_date: payload.invoice_date || new Date().toISOString().split('T')[0],
      pharmacy_id: payload.pharmacy_id,
      pharmacy_name: MOCK_PHARMACIES.find(p => p.id === payload.pharmacy_id)?.name || 'صيدلية تجريبية',
      rep_id: getCurrentUser()?.id || 'rep-1',
      rep_name: getCurrentUser()?.full_name || 'المندوب الحالي',
      image_url: payload.image_url,
      status: 'pending_review',
      total_sales_amount: payload.items.reduce((s: number, i: any) => s + (i.sold_quantity * (MOCK_PRODUCTS.find(p => p.id === i.product_id)?.base_price || 25)), 0),
      total_pieces_count: payload.items.reduce((s: number, i: any) => s + i.sold_quantity, 0),
      total_bonus_count: payload.items.reduce((s: number, i: any) => s + Math.floor(i.sold_quantity / 10), 0),
      created_at: new Date().toISOString()
    };
    MOCK_INVOICES.unshift(newInv);
    return newInv;
  },

  async reviewInvoice(id: string, status: 'approved' | 'rejected', rejection_reason?: string): Promise<Invoice> {
    try {
      const res = await fetch(`${API_BASE}/invoices/${id}/review`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status, rejection_reason })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    const inv = MOCK_INVOICES.find(i => i.id === id);
    if (inv) {
      inv.status = status;
      if (rejection_reason) inv.rejection_reason = rejection_reason;
      return inv;
    }
    throw new Error('Invoice not found');
  },

  async getKPIs(): Promise<KPISummary> {
    try {
      const res = await fetch(`${API_BASE}/analytics/kpis`, { headers: authHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return {
      total_invoices: MOCK_INVOICES.length,
      total_pharmacies_visited: MOCK_PHARMACIES.length,
      total_pieces_sold: MOCK_INVOICES.reduce((s, i) => s + i.total_pieces_count, 0),
      total_bonus_given: MOCK_INVOICES.reduce((s, i) => s + i.total_bonus_count, 0),
      total_revenue: MOCK_INVOICES.reduce((s, i) => s + i.total_sales_amount, 0)
    };
  }
};
