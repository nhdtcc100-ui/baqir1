import crypto from 'crypto';
import { pool, isUsingPostgres, inMemoryStore } from '../../database/db';
import { BonusService, ProductService, products } from '../products/product.service';
import { PharmacyService } from '../pharmacies/pharmacy.service';

export type InvoiceStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

export interface InvoiceItemInput {
  product_id: string;
  sold_quantity: number;
  ocr_confidence?: number;
}

export interface CreateInvoiceInput {
  pharmacy_id: string;
  invoice_number?: string;
  invoice_date?: string;
  image_url: string;
  is_synced_offline?: boolean;
  items: InvoiceItemInput[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  product_name_snapshot: string;
  product_type_snapshot: string;
  sold_quantity: number;
  historical_unit_price: number;
  bonus_quantity: number;
  total_quantity: number;
  line_total: number;
  ocr_confidence?: number;
}

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
  is_synced_offline: boolean;
  rejection_reason?: string;
  items?: InvoiceItem[];
  created_at: Date;
  updated_at: Date;
}

// ─── In-Memory Invoice Store ─────────────────────────────────────────────────
const invoices: Invoice[] = [];
const invoiceItems: InvoiceItem[] = [];

// Seed: two demo approved invoices
const seedInvoices = async () => {
  const now = new Date();
  const inv1: Invoice = {
    id: 'inv00001-0000-0000-0000-000000000001',
    invoice_number: 'INV-2026-001',
    invoice_date: '2026-10-01',
    pharmacy_id: 'ph000001-0000-0000-0000-000000000001',
    pharmacy_name: 'صيدلية النور الحديثة',
    rep_id: 'a0000000-0000-0000-0000-000000000002',
    rep_name: 'علي حسن',
    image_url: 'https://placehold.co/800x600?text=Invoice+1',
    status: 'approved',
    total_sales_amount: 1300.00,
    total_pieces_count: 50,
    total_bonus_count: 5,
    is_synced_offline: false,
    created_at: now,
    updated_at: now
  };
  const inv2: Invoice = {
    id: 'inv00002-0000-0000-0000-000000000002',
    invoice_number: 'INV-2026-002',
    invoice_date: '2026-10-15',
    pharmacy_id: 'ph000002-0000-0000-0000-000000000002',
    pharmacy_name: 'صيدلية الشفاء',
    rep_id: 'a0000000-0000-0000-0000-000000000002',
    rep_name: 'علي حسن',
    image_url: 'https://placehold.co/800x600?text=Invoice+2',
    status: 'pending_review',
    total_sales_amount: 750.00,
    total_pieces_count: 30,
    total_bonus_count: 3,
    is_synced_offline: false,
    created_at: now,
    updated_at: now
  };
  invoices.push(inv1, inv2);

  const items1: InvoiceItem[] = [
    { id: crypto.randomUUID(), invoice_id: inv1.id, product_id: 'prod0001-0000-0000-0000-000000000001', product_name_snapshot: 'قطرة عين مرطبة 15ml', product_type_snapshot: 'drop',    sold_quantity: 20, historical_unit_price: 25, bonus_quantity: 2, total_quantity: 22, line_total: 500, ocr_confidence: 0.95 },
    { id: crypto.randomUUID(), invoice_id: inv1.id, product_id: 'prod0002-0000-0000-0000-000000000002', product_name_snapshot: 'كريم ترطيب مكثف 50g',  product_type_snapshot: 'cream',   sold_quantity: 20, historical_unit_price: 40, bonus_quantity: 2, total_quantity: 22, line_total: 800, ocr_confidence: 0.92 },
  ];
  const items2: InvoiceItem[] = [
    { id: crypto.randomUUID(), invoice_id: inv2.id, product_id: 'prod0003-0000-0000-0000-000000000003', product_name_snapshot: 'مرهم مضاد للالتهاب 30g', product_type_snapshot: 'ointment', sold_quantity: 15, historical_unit_price: 35, bonus_quantity: 1, total_quantity: 16, line_total: 525, ocr_confidence: 0.88 },
    { id: crypto.randomUUID(), invoice_id: inv2.id, product_id: 'prod0004-0000-0000-0000-000000000004', product_name_snapshot: 'قطرة أذن مضادة للألم',   product_type_snapshot: 'drop',    sold_quantity: 10, historical_unit_price: 18, bonus_quantity: 2, total_quantity: 12, line_total: 180, ocr_confidence: 0.85 },
  ];
  invoiceItems.push(...items1, ...items2);
};
seedInvoices();

// ── Invoice Service ───────────────────────────────────────────────────────────
export class InvoiceService {
  // 1. قائمة الفواتير مع الفلترة (المندوب: فواتيره فقط بواسطة RLS)
  static async findAll(filters: {
    repId?: string; pharmacyId?: string;
    status?: InvoiceStatus; from?: string; to?: string;
  }): Promise<Invoice[]> {
    if (isUsingPostgres()) {
      let q = `SELECT i.*, ph.name AS pharmacy_name, u.full_name AS rep_name
               FROM invoices i
               JOIN pharmacies ph ON ph.id = i.pharmacy_id
               JOIN users u ON u.id = i.rep_id WHERE 1=1`;
      const p: any[] = []; let idx = 1;
      if (filters.repId)      { q += ` AND i.rep_id=$${idx++}`;      p.push(filters.repId); }
      if (filters.pharmacyId) { q += ` AND i.pharmacy_id=$${idx++}`; p.push(filters.pharmacyId); }
      if (filters.status)     { q += ` AND i.status=$${idx++}`;      p.push(filters.status); }
      if (filters.from)       { q += ` AND i.invoice_date>=$${idx++}`;p.push(filters.from); }
      if (filters.to)         { q += ` AND i.invoice_date<=$${idx++}`;p.push(filters.to); }
      q += ' ORDER BY i.created_at DESC';
      const res = await pool.query(q, p);
      return res.rows;
    }

    let result = [...invoices];
    if (filters.repId)      result = result.filter(i => i.rep_id === filters.repId);
    if (filters.pharmacyId) result = result.filter(i => i.pharmacy_id === filters.pharmacyId);
    if (filters.status)     result = result.filter(i => i.status === filters.status);
    if (filters.from)       result = result.filter(i => i.invoice_date >= filters.from!);
    if (filters.to)         result = result.filter(i => i.invoice_date <= filters.to!);
    return result.sort((a,b) => b.created_at.getTime() - a.created_at.getTime());
  }

  // 2. تفاصيل فاتورة واحدة مع بنودها
  static async findById(id: string): Promise<Invoice> {
    if (isUsingPostgres()) {
      const inv = await pool.query(
        `SELECT i.*, ph.name AS pharmacy_name, u.full_name AS rep_name
         FROM invoices i JOIN pharmacies ph ON ph.id=i.pharmacy_id JOIN users u ON u.id=i.rep_id
         WHERE i.id=$1`, [id]);
      if (!inv.rows[0]) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
      const items = await pool.query('SELECT * FROM invoice_items WHERE invoice_id=$1', [id]);
      return { ...inv.rows[0], items: items.rows };
    }
    const inv = invoices.find(i => i.id === id);
    if (!inv) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
    const items = invoiceItems.filter(it => it.invoice_id === id);
    return { ...inv, items };
  }

  /**
   * 3. إنشاء فاتورة جديدة
   * — يجلب السعر الحالي من جدول المنتجات ويجمّده كـ historical_unit_price
   * — يحسب البونص تلقائياً من bonus_rules
   * — يحتسب إجماليات الفاتورة
   */
  static async create(repId: string, input: CreateInvoiceInput): Promise<Invoice> {
    // التحقق من وجود الصيدلية
    await PharmacyService.findById(input.pharmacy_id);

    // بناء بنود الفاتورة مع التجميد
    const builtItems: InvoiceItem[] = [];
    let totalSales = 0, totalPieces = 0, totalBonus = 0;

    for (const raw of input.items) {
      // جلب بيانات المنتج (السعر الحالي للتجميد)
      const product = isUsingPostgres()
        ? await ProductService.findById(raw.product_id)
        : products.find(p => p.id === raw.product_id);
      if (!product) throw { statusCode: 400, message: `المنتج ${raw.product_id} غير موجود` };

      // حساب البونص
      const rule = await BonusService.getActiveRule(raw.product_id, repId, input.invoice_date);
      const bonusQty = rule
        ? BonusService.calculateBonus(raw.sold_quantity, rule.threshold_quantity, rule.bonus_quantity)
        : 0;

      const lineTotal = raw.sold_quantity * product.base_price;
      totalSales  += lineTotal;
      totalPieces += raw.sold_quantity;
      totalBonus  += bonusQty;

      builtItems.push({
        id: crypto.randomUUID(),
        invoice_id: '',   // سيُملأ بعد إنشاء الفاتورة
        product_id: raw.product_id,
        product_name_snapshot: product.name,
        product_type_snapshot: product.product_type,
        sold_quantity: raw.sold_quantity,
        historical_unit_price: product.base_price,
        bonus_quantity: bonusQty,
        total_quantity: raw.sold_quantity + bonusQty,
        line_total: parseFloat(lineTotal.toFixed(2)),
        ocr_confidence: raw.ocr_confidence
      });
    }

    const invoiceId = crypto.randomUUID();
    const now = new Date();
    const invoiceDate = input.invoice_date ?? now.toISOString().split('T')[0];

    // تحديث invoice_id لكل بند
    builtItems.forEach(it => { it.invoice_id = invoiceId; });

    if (isUsingPostgres()) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `INSERT INTO invoices
           (id,invoice_number,invoice_date,pharmacy_id,rep_id,image_url,status,
            total_sales_amount,total_pieces_count,total_bonus_count,is_synced_offline,created_at,updated_at)
           VALUES($1,$2,$3,$4,$5,$6,'pending_review',$7,$8,$9,$10,$11,$12)`,
          [invoiceId, input.invoice_number ?? null, invoiceDate,
           input.pharmacy_id, repId, input.image_url,
           totalSales, totalPieces, totalBonus,
           input.is_synced_offline ?? false, now, now]
        );
        for (const it of builtItems) {
          await client.query(
            `INSERT INTO invoice_items
             (id,invoice_id,product_id,product_name_snapshot,product_type_snapshot,
              sold_quantity,historical_unit_price,bonus_quantity,ocr_confidence,created_at)
             VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [it.id, invoiceId, it.product_id, it.product_name_snapshot,
             it.product_type_snapshot, it.sold_quantity, it.historical_unit_price,
             it.bonus_quantity, it.ocr_confidence ?? null, now]
          );
        }
        await client.query('COMMIT');
      } catch (e) { await client.query('ROLLBACK'); throw e; }
      finally { client.release(); }
    }

    const repUser = inMemoryStore.users.find(u => u.id === repId);

    const newInvoice: Invoice = {
      id: invoiceId,
      invoice_number: input.invoice_number,
      invoice_date: invoiceDate,
      pharmacy_id: input.pharmacy_id,
      rep_id: repId,
      rep_name: repUser?.full_name,
      image_url: input.image_url,
      status: 'pending_review',
      total_sales_amount: parseFloat(totalSales.toFixed(2)),
      total_pieces_count: totalPieces,
      total_bonus_count: totalBonus,
      is_synced_offline: input.is_synced_offline ?? false,
      created_at: now,
      updated_at: now
    };

    if (!isUsingPostgres()) {
      invoices.push(newInvoice);
      invoiceItems.push(...builtItems);
    }

    return { ...newInvoice, items: builtItems };
  }

  // 4. اعتماد أو رفض الفاتورة (للإدارة فقط)
  static async review(
    id: string,
    action: 'approved' | 'rejected',
    reason?: string
  ): Promise<Invoice> {
    if (action === 'rejected' && !reason)
      throw { statusCode: 400, message: 'سبب الرفض مطلوب عند رفض الفاتورة' };

    if (isUsingPostgres()) {
      const res = await pool.query(
        `UPDATE invoices SET status=$1, rejection_reason=$2, updated_at=$3 WHERE id=$4 RETURNING *`,
        [action, reason ?? null, new Date(), id]
      );
      if (!res.rows[0]) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
      return res.rows[0];
    }

    const i = invoices.findIndex(inv => inv.id === id);
    if (i === -1) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
    invoices[i].status = action;
    invoices[i].rejection_reason = reason;
    invoices[i].updated_at = new Date();
    return invoices[i];
  }
}
