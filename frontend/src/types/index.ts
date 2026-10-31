// Shared TypeScript types for the frontend

export type UserRole = 'admin' | 'supervisor' | 'medical_rep';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  assigned_rep_id?: string;
  assigned_rep_name?: string;
  total_invoices?: number;
  total_sales?: number;
  last_visit_date?: string;
}

export type ProductCategory = 'drop' | 'cream' | 'ointment' | 'other';

export interface Product {
  id: string;
  name: string;
  product_type: ProductCategory;
  base_price: number;
  is_active: boolean;
}

export interface BonusRule {
  id: string;
  product_id: string;
  product_name?: string;
  threshold_quantity: number;
  bonus_quantity: number;
}

export interface InvoiceItem {
  id?: string;
  product_id: string;
  product_name_snapshot?: string;
  product_type_snapshot?: string;
  sold_quantity: number;
  historical_unit_price: number;
  bonus_quantity: number;
  total_quantity: number;
  line_total: number;
  ocr_confidence?: number;
}

export type InvoiceStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

export interface Invoice {
  id: string;
  invoice_number?: string;
  invoice_date: string;
  pharmacy_id: string;
  pharmacy_name?: string;
  rep_id: string;
  rep_name?: string;
  image_url: string;
  status: InvoiceStatus;
  total_sales_amount: number;
  total_pieces_count: number;
  total_bonus_count: number;
  rejection_reason?: string;
  items?: InvoiceItem[];
  created_at: string;
}

export interface KPISummary {
  total_invoices: number;
  total_pharmacies_visited: number;
  total_pieces_sold: number;
  total_bonus_given?: number;
  total_bonus_pieces?: number;
  total_revenue?: number;
  total_sales_amount?: number;
  approved_invoices?: number;
  pending_invoices?: number;
}

export interface VisitEvent {
  id: string;
  pharmacy_id: string;
  pharmacy_name: string;
  rep_name: string;
  visit_date: string;
  visit_time: string;
  purpose: 'routine_check' | 'order_delivery' | 'sample_show' | 'collection';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}
