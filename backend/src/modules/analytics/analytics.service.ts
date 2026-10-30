import { pool, isUsingPostgres } from '../../database/db';
import { InvoiceService } from '../invoices/invoice.service';

export interface KPISummary {
  total_invoices: number;
  total_pharmacies_visited: number;
  total_pieces_sold: number;
  total_bonus_pieces: number;
  total_sales_amount: number;
  approved_invoices: number;
  pending_invoices: number;
}

export interface PivotRow {
  rep_name?: string;
  pharmacy_name?: string;
  product_name?: string;
  product_type?: string;
  month?: string;
  total_quantity: number;
  total_bonus: number;
  total_revenue: number;
}

export class AnalyticsService {
  // ── 1. ملخص مؤشرات الأداء الرئيسية (KPI Summary) ────────────────────────
  static async getKPIs(filters: {
    repId?: string; from?: string; to?: string;
  }): Promise<KPISummary> {
    if (isUsingPostgres()) {
      let q = `
        SELECT
          COUNT(DISTINCT i.id)::int                                AS total_invoices,
          COUNT(DISTINCT i.pharmacy_id)::int                       AS total_pharmacies_visited,
          COALESCE(SUM(i.total_pieces_count), 0)::numeric          AS total_pieces_sold,
          COALESCE(SUM(i.total_bonus_count), 0)::numeric           AS total_bonus_pieces,
          COALESCE(SUM(i.total_sales_amount), 0)::numeric          AS total_sales_amount,
          COUNT(CASE WHEN i.status='approved' THEN 1 END)::int     AS approved_invoices,
          COUNT(CASE WHEN i.status='pending_review' THEN 1 END)::int AS pending_invoices
        FROM invoices i WHERE 1=1`;
      const p: any[] = []; let idx = 1;
      if (filters.repId) { q += ` AND i.rep_id=$${idx++}`;        p.push(filters.repId); }
      if (filters.from)  { q += ` AND i.invoice_date>=$${idx++}`; p.push(filters.from); }
      if (filters.to)    { q += ` AND i.invoice_date<=$${idx++}`; p.push(filters.to); }
      const res = await pool.query(q, p);
      return res.rows[0];
    }

    // In-Memory calculation
    let invs = await InvoiceService.findAll({ repId: filters.repId, from: filters.from, to: filters.to });
    return {
      total_invoices: invs.length,
      total_pharmacies_visited: new Set(invs.map(i => i.pharmacy_id)).size,
      total_pieces_sold: invs.reduce((s, i) => s + i.total_pieces_count, 0),
      total_bonus_pieces: invs.reduce((s, i) => s + i.total_bonus_count, 0),
      total_sales_amount: parseFloat(invs.reduce((s, i) => s + i.total_sales_amount, 0).toFixed(2)),
      approved_invoices: invs.filter(i => i.status === 'approved').length,
      pending_invoices: invs.filter(i => i.status === 'pending_review').length
    };
  }

  // ── 2. بيانات الجدول المحوري (Pivot Table Data Engine) ───────────────────
  static async getPivotData(filters: {
    repId?: string; from?: string; to?: string;
    groupBy: string[]; // e.g. ['rep', 'product_type', 'month']
  }): Promise<PivotRow[]> {
    if (isUsingPostgres()) {
      const selectParts: string[] = [];
      const groupParts: string[] = [];

      if (filters.groupBy.includes('rep')) {
        selectParts.push("u.full_name AS rep_name");
        groupParts.push("u.full_name");
      }
      if (filters.groupBy.includes('pharmacy')) {
        selectParts.push("ph.name AS pharmacy_name");
        groupParts.push("ph.name");
      }
      if (filters.groupBy.includes('product')) {
        selectParts.push("ii.product_name_snapshot AS product_name");
        groupParts.push("ii.product_name_snapshot");
      }
      if (filters.groupBy.includes('product_type')) {
        selectParts.push("ii.product_type_snapshot AS product_type");
        groupParts.push("ii.product_type_snapshot");
      }
      if (filters.groupBy.includes('month')) {
        selectParts.push("TO_CHAR(i.invoice_date, 'YYYY-MM') AS month");
        groupParts.push("TO_CHAR(i.invoice_date, 'YYYY-MM')");
      }

      selectParts.push(
        'SUM(ii.sold_quantity)::int AS total_quantity',
        'SUM(ii.bonus_quantity)::int AS total_bonus',
        'ROUND(SUM(ii.line_total)::numeric, 2) AS total_revenue'
      );

      let q = `
        SELECT ${selectParts.join(', ')}
        FROM invoice_items ii
        JOIN invoices i ON i.id = ii.invoice_id
        JOIN users u ON u.id = i.rep_id
        JOIN pharmacies ph ON ph.id = i.pharmacy_id
        WHERE i.status = 'approved'`;
      const p: any[] = []; let idx = 1;
      if (filters.repId) { q += ` AND i.rep_id=$${idx++}`;        p.push(filters.repId); }
      if (filters.from)  { q += ` AND i.invoice_date>=$${idx++}`; p.push(filters.from); }
      if (filters.to)    { q += ` AND i.invoice_date<=$${idx++}`; p.push(filters.to); }
      if (groupParts.length) q += ` GROUP BY ${groupParts.join(', ')} ORDER BY ${groupParts[0]}`;

      const res = await pool.query(q, p);
      return res.rows;
    }

    // In-Memory pivot aggregation
    const invs = await InvoiceService.findAll({ repId: filters.repId, from: filters.from, to: filters.to, status: 'approved' });
    const map = new Map<string, PivotRow>();

    for (const inv of invs) {
      const detailedInv = await InvoiceService.findById(inv.id);
      for (const item of (detailedInv.items ?? [])) {
        const keyParts: string[] = [];
        const row: Partial<PivotRow> = {};

        if (filters.groupBy.includes('rep'))          { row.rep_name      = inv.rep_name;              keyParts.push(inv.rep_name ?? ''); }
        if (filters.groupBy.includes('pharmacy'))     { row.pharmacy_name = inv.pharmacy_name;          keyParts.push(inv.pharmacy_name ?? ''); }
        if (filters.groupBy.includes('product'))      { row.product_name  = item.product_name_snapshot; keyParts.push(item.product_name_snapshot); }
        if (filters.groupBy.includes('product_type')) { row.product_type  = item.product_type_snapshot; keyParts.push(item.product_type_snapshot); }
        if (filters.groupBy.includes('month'))        { row.month         = inv.invoice_date.slice(0,7); keyParts.push(row.month); }

        const key = keyParts.join('|');
        const existing = map.get(key);
        if (existing) {
          existing.total_quantity += item.sold_quantity;
          existing.total_bonus    += item.bonus_quantity;
          existing.total_revenue  += item.line_total;
        } else {
          map.set(key, { ...row, total_quantity: item.sold_quantity, total_bonus: item.bonus_quantity, total_revenue: item.line_total } as PivotRow);
        }
      }
    }

    return Array.from(map.values()).map(r => ({ ...r, total_revenue: parseFloat(r.total_revenue.toFixed(2)) }));
  }

  // ── 3. مبيعات كل مندوب (للمقارنة في لوحة التحكم) ───────────────────────
  static async getRepPerformance(filters: { from?: string; to?: string }) {
    const invs = await InvoiceService.findAll({ from: filters.from, to: filters.to, status: 'approved' });
    const map = new Map<string, { rep_id: string; rep_name: string; total_invoices: number; total_pieces: number; total_bonus: number; total_revenue: number }>();

    for (const inv of invs) {
      const existing = map.get(inv.rep_id);
      if (existing) {
        existing.total_invoices++;
        existing.total_pieces  += inv.total_pieces_count;
        existing.total_bonus   += inv.total_bonus_count;
        existing.total_revenue += inv.total_sales_amount;
      } else {
        map.set(inv.rep_id, {
          rep_id: inv.rep_id,
          rep_name: inv.rep_name ?? inv.rep_id,
          total_invoices: 1,
          total_pieces: inv.total_pieces_count,
          total_bonus: inv.total_bonus_count,
          total_revenue: inv.total_sales_amount
        });
      }
    }
    return Array.from(map.values());
  }
}
