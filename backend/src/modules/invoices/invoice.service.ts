import crypto from 'crypto';
import { pool, isUsingPostgres, inMemoryStore } from '../../database/db';
import { BonusService, ProductService, products } from '../products/product.service';
import { PharmacyService, pharmacies } from '../pharmacies/pharmacy.service';

export type InvoiceStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

export interface InvoiceItemInput {
  product_id: string;
  sold_quantity: number;
  custom_product_name?: string;
  custom_unit_price?: number;
  custom_bonus?: number;
  dosage_form?: string;
  ocr_confidence?: number;
}

export interface CreateInvoiceInput {
  pharmacy_id: string;
  pharmacy_area?: string;
  invoice_number?: string;
  invoice_date?: string;
  image_url?: string;
  is_synced_offline?: boolean;
  items: InvoiceItemInput[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  product_name_snapshot: string;
  product_type_snapshot: string;
  dosage_form?: string;
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
  pharmacy_city?: string;
  pharmacy_area?: string;
  rep_id: string;
  rep_name?: string;
  image_url?: string;
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

// ─── In-Memory Invoice Store (Clean - No test data) ──────────────────────────
const invoices: Invoice[] = [];
const invoiceItems: InvoiceItem[] = [];

// تحويل أرقام الفاتورة من string إلى number (NUMERIC/INT يأتي كـ string من pg)
const normalizeInvoice = (row: any): Invoice => ({
  ...row,
  total_sales_amount: parseFloat(row.total_sales_amount ?? '0'),
  total_pieces_count: parseInt(row.total_pieces_count ?? '0'),
  total_bonus_count: parseInt(row.total_bonus_count ?? '0'),
  invoice_date: row.invoice_date instanceof Date ? row.invoice_date.toISOString().split('T')[0] : String(row.invoice_date || '').split('T')[0],
  items: Array.isArray(row.items) ? row.items.map(normalizeInvoiceItem) : (row.items || [])
});

const normalizeInvoiceItem = (row: any): InvoiceItem => ({
  ...row,
  sold_quantity: parseInt(row.sold_quantity ?? '0'),
  historical_unit_price: parseFloat(row.historical_unit_price ?? '0'),
  bonus_quantity: parseInt(row.bonus_quantity ?? '0'),
  total_quantity: parseInt(row.total_quantity ?? '0'),
  line_total: parseFloat(row.line_total ?? '0'),
});

// ── Invoice Service ───────────────────────────────────────────────────────────
export class InvoiceService {
  // 1. قائمة الفواتير مع الفلترة والبنود (المندوب: فواتيره فقط بواسطة RLS)
  static async findAll(filters: {
    repId?: string; pharmacyId?: string;
    status?: InvoiceStatus; from?: string; to?: string;
  } = {}): Promise<Invoice[]> {
    if (isUsingPostgres()) {
      let q = `SELECT i.*, ph.name AS pharmacy_name, u.full_name AS rep_name,
                      COALESCE(
                        (SELECT json_agg(it.* ORDER BY it.created_at)
                         FROM invoice_items it
                         WHERE it.invoice_id = i.id),
                        '[]'::json
                      ) AS items
               FROM invoices i
               LEFT JOIN pharmacies ph ON ph.id = i.pharmacy_id
               LEFT JOIN users u ON u.id = i.rep_id WHERE 1=1`;
      const p: any[] = []; let idx = 1;
      if (filters.repId) { q += ` AND i.rep_id=$${idx++}`; p.push(filters.repId); }
      if (filters.pharmacyId) { q += ` AND i.pharmacy_id=$${idx++}`; p.push(filters.pharmacyId); }
      if (filters.status) { q += ` AND i.status=$${idx++}`; p.push(filters.status); }
      if (filters.from) { q += ` AND i.invoice_date>=$${idx++}`; p.push(filters.from); }
      if (filters.to) { q += ` AND i.invoice_date<=$${idx++}`; p.push(filters.to); }
      q += ' ORDER BY i.created_at DESC';
      const res = await pool.query(q, p);
      return res.rows.map(normalizeInvoice);
    }

    let result = invoices.map(inv => {
      const ph = pharmacies.find(p => p.id === inv.pharmacy_id);
      const rep = inMemoryStore.users.find(u => u.id === inv.rep_id);
      return {
        ...inv,
        pharmacy_name: inv.pharmacy_name || ph?.name || '',
        pharmacy_city: inv.pharmacy_city || ph?.city || '',
        pharmacy_area: inv.pharmacy_area || (ph as any)?.area || '',
        rep_name: inv.rep_name || rep?.full_name || '',
        items: invoiceItems.filter(it => it.invoice_id === inv.id)
      };
    });
    if (filters.repId) result = result.filter(i => i.rep_id === filters.repId);
    if (filters.pharmacyId) result = result.filter(i => i.pharmacy_id === filters.pharmacyId);
    if (filters.status) result = result.filter(i => i.status === filters.status);
    if (filters.from) result = result.filter(i => i.invoice_date >= filters.from!);
    if (filters.to) result = result.filter(i => i.invoice_date <= filters.to!);
    return result.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  // 2. تفاصيل فاتورة واحدة مع بنودها
  static async findById(id: string): Promise<Invoice> {
    if (isUsingPostgres()) {
      const inv = await pool.query(
        `SELECT i.*, ph.name AS pharmacy_name, u.full_name AS rep_name
         FROM invoices i
         LEFT JOIN pharmacies ph ON ph.id=i.pharmacy_id
         LEFT JOIN users u ON u.id=i.rep_id
         WHERE i.id=$1`, [id]);
      if (!inv.rows[0]) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
      const items = await pool.query('SELECT * FROM invoice_items WHERE invoice_id=$1 ORDER BY created_at', [id]);
      return { ...normalizeInvoice(inv.rows[0]), items: items.rows.map(normalizeInvoiceItem) };
    }
    const inv = invoices.find(i => i.id === id);
    if (!inv) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
    const items = invoiceItems.filter(it => it.invoice_id === id);
    const ph = pharmacies.find(p => p.id === inv.pharmacy_id);
    const rep = inMemoryStore.users.find(u => u.id === inv.rep_id);
    return {
      ...inv,
      pharmacy_name: inv.pharmacy_name || ph?.name || '',
      pharmacy_city: inv.pharmacy_city || ph?.city || '',
      pharmacy_area: inv.pharmacy_area || (ph as any)?.area || '',
      rep_name: inv.rep_name || rep?.full_name || '',
      items
    };
  }

  /**
   * 3. إنشاء فاتورة جديدة
   * — يجلب السعر الحالي من جدول المنتجات ويجمّده كـ historical_unit_price
   * — يحسب البونص تلقائياً من bonus_rules
   * — يحتسب إجماليات الفاتورة
   */
  static async create(repId: string, input: CreateInvoiceInput, repName?: string): Promise<Invoice> {
    // التحقق من وجود الصيدلية
    await PharmacyService.findById(input.pharmacy_id);

    // بناء بنود الفاتورة مع التجميد
    const builtItems: InvoiceItem[] = [];
    let totalSales = 0, totalPieces = 0, totalBonus = 0;

    for (const raw of input.items) {
      // جلب بيانات المنتج (السعر الحالي للتجميد)
      let product = isUsingPostgres()
        ? (raw.product_id ? await ProductService.findById(raw.product_id).catch(() => null) : null)
        : (raw.product_id ? products.find(p => p.id === raw.product_id) : null);
      if (!product && raw.custom_product_name) {
        product = products.find(p => p.name.toLowerCase().includes(raw.custom_product_name!.toLowerCase())) || products[0];
      }
      if (!product) product = products[0];

      // حساب البونص
      let bonusQty = Math.floor(raw.sold_quantity / 10);
      if (raw.custom_bonus !== undefined) {
        bonusQty = Math.max(0, Number(raw.custom_bonus));
      } else {
        const rule = await BonusService.getActiveRule(raw.product_id, repId, input.invoice_date);
        bonusQty = rule
          ? BonusService.calculateBonus(raw.sold_quantity, rule.threshold_quantity, rule.bonus_quantity)
          : Math.floor(raw.sold_quantity / 10);
      }

      const unitPrice = raw.custom_unit_price !== undefined ? Number(raw.custom_unit_price) : product.base_price;
      const prodName = raw.custom_product_name || product.name;
      const lineTotal = raw.sold_quantity * unitPrice;
      totalSales += lineTotal;
      totalPieces += raw.sold_quantity;
      totalBonus += bonusQty;

      let dosageForm: 'قطرة' | 'كريم' | 'مرهم' | 'حبوب' = 'حبوب';
      if (raw.dosage_form && ['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(raw.dosage_form)) {
        dosageForm = raw.dosage_form as any;
      } else if (product.product_type === 'cream') {
        dosageForm = 'كريم';
      } else if (product.product_type === 'drop') {
        dosageForm = 'قطرة';
      } else if (product.product_type === 'ointment') {
        dosageForm = 'مرهم';
      } else {
        const pLower = (prodName || '').toLowerCase();
        if (pLower.includes('drop') || pLower.includes('قطر') || pLower.includes('drup')) dosageForm = 'قطرة';
        else if (pLower.includes('cream') || pLower.includes('كريم') || pLower.includes('crm')) dosageForm = 'كريم';
        else if (pLower.includes('oint') || pLower.includes('مرهم') || pLower.includes('ung')) dosageForm = 'مرهم';
        else dosageForm = 'حبوب';
      }
      builtItems.push({
        id: crypto.randomUUID(),
        invoice_id: '',   // سيُملأ بعد إنشاء الفاتورة
        product_id: raw.product_id,
        product_name_snapshot: prodName,
        product_type_snapshot: product.product_type,
        dosage_form: dosageForm,
        sold_quantity: raw.sold_quantity,
        historical_unit_price: unitPrice,
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
            input.pharmacy_id, repId, input.image_url ?? null,
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

    const phObj = pharmacies.find(p => p.id === input.pharmacy_id);
    const repUser = inMemoryStore.users.find(u => u.id === repId);
    const resolvedRepName = repName || repUser?.full_name || 'مندوب علمي';
    const resolvedArea = input.pharmacy_area || (phObj as any)?.area || '';

    const newInvoice: Invoice = {
      id: invoiceId,
      invoice_number: input.invoice_number,
      invoice_date: invoiceDate,
      pharmacy_id: input.pharmacy_id,
      pharmacy_name: phObj?.name,
      pharmacy_city: phObj?.city,
      pharmacy_area: resolvedArea,
      rep_id: repId,
      rep_name: resolvedRepName,
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
      return normalizeInvoice(res.rows[0]);
    }

    const i = invoices.findIndex(inv => inv.id === id);
    if (i === -1) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
    invoices[i].status = action;
    invoices[i].rejection_reason = reason;
    invoices[i].updated_at = new Date();
    return invoices[i];
  }

  // 5. حذف الفاتورة نهائياً
  static async deleteById(id: string): Promise<void> {
    if (isUsingPostgres()) {
      // cascade delete also removes invoice_items due to ON DELETE CASCADE
      const res = await pool.query('DELETE FROM invoices WHERE id=$1 RETURNING id', [id]);
      if (!res.rows[0]) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
      return;
    }
    const idx = invoices.findIndex(inv => inv.id === id);
    if (idx === -1) throw { statusCode: 404, message: 'الفاتورة غير موجودة' };
    invoices.splice(idx, 1);
    // also remove items
    const kept = invoiceItems.filter(it => it.invoice_id !== id);
    invoiceItems.length = 0;
    invoiceItems.push(...kept);
  }

  // 6. تعديل الفاتورة وتحديث بنودها وإجمالياتها
  static async update(
    id: string,
    input: Partial<CreateInvoiceInput>
  ): Promise<Invoice> {
    const existing = await InvoiceService.findById(id);

    // If pharmacy changed, verify it
    if (input.pharmacy_id && input.pharmacy_id !== existing.pharmacy_id) {
      await PharmacyService.findById(input.pharmacy_id);
    }

    const newPharmacyId = input.pharmacy_id || existing.pharmacy_id;
    const newInvoiceNumber = input.invoice_number !== undefined ? input.invoice_number : existing.invoice_number;
    const newInvoiceDate = input.invoice_date || existing.invoice_date;
    const newPharmacyArea = input.pharmacy_area !== undefined ? input.pharmacy_area : ((existing as any).pharmacy_area || (existing as any).area || '');

    // Rebuild items if provided, or retain existing
    let updatedItems: InvoiceItem[] = [];
    let totalSales = 0;
    let totalPieces = 0;
    let totalBonus = 0;

    if (input.items && input.items.length > 0) {
      for (const raw of input.items) {
        let product = isUsingPostgres()
          ? (raw.product_id ? await ProductService.findById(raw.product_id).catch(() => null) : null)
          : (raw.product_id ? products.find(p => p.id === raw.product_id) : null);
        if (!product && raw.custom_product_name) {
          product = products.find(p => p.name.toLowerCase().includes(raw.custom_product_name!.toLowerCase())) || products[0];
        }
        if (!product) product = products[0];

        const unitPrice = raw.custom_unit_price !== undefined ? Number(raw.custom_unit_price) : product.base_price;
        const prodName = raw.custom_product_name || product.name;
        const bonusQty = raw.custom_bonus !== undefined ? Math.max(0, Number(raw.custom_bonus)) : Math.floor(raw.sold_quantity / 10);
        const lineTotal = raw.sold_quantity * unitPrice;

        totalSales += lineTotal;
        totalPieces += raw.sold_quantity;
        totalBonus += bonusQty;

        updatedItems.push({
          id: crypto.randomUUID(),
          invoice_id: id,
          product_id: raw.product_id,
          product_name_snapshot: prodName,
          product_type_snapshot: product.product_type,
          sold_quantity: raw.sold_quantity,
          historical_unit_price: unitPrice,
          bonus_quantity: bonusQty,
          total_quantity: raw.sold_quantity + bonusQty,
          line_total: parseFloat(lineTotal.toFixed(2)),
          ocr_confidence: raw.ocr_confidence
        });
      }
    } else {
      updatedItems = existing.items || [];
      totalSales = existing.total_sales_amount;
      totalPieces = existing.total_pieces_count;
      totalBonus = existing.total_bonus_count;
    }

    const now = new Date();

    if (isUsingPostgres()) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `UPDATE invoices
           SET pharmacy_id=$1, invoice_number=$2, invoice_date=$3,
               total_sales_amount=$4, total_pieces_count=$5, total_bonus_count=$6, updated_at=$7
           WHERE id=$8`,
          [newPharmacyId, newInvoiceNumber ?? null, newInvoiceDate, totalSales, totalPieces, totalBonus, now, id]
        );
        if (input.items && input.items.length > 0) {
          await client.query('DELETE FROM invoice_items WHERE invoice_id=$1', [id]);
          for (const it of updatedItems) {
            await client.query(
              `INSERT INTO invoice_items
               (id,invoice_id,product_id,product_name_snapshot,product_type_snapshot,
                sold_quantity,historical_unit_price,bonus_quantity,ocr_confidence,created_at)
               VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
              [it.id, id, it.product_id, it.product_name_snapshot,
              it.product_type_snapshot, it.sold_quantity, it.historical_unit_price,
              it.bonus_quantity, it.ocr_confidence ?? null, now]
            );
          }
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    // In-memory update
    const invIdx = invoices.findIndex(i => i.id === id);
    if (invIdx !== -1) {
      const phObj = pharmacies.find(p => p.id === newPharmacyId);
      invoices[invIdx] = {
        ...invoices[invIdx],
        pharmacy_id: newPharmacyId,
        pharmacy_name: phObj?.name || invoices[invIdx].pharmacy_name,
        pharmacy_city: phObj?.city || invoices[invIdx].pharmacy_city,
        pharmacy_area: newPharmacyArea || (phObj as any)?.area || invoices[invIdx].pharmacy_area || '',
        invoice_number: newInvoiceNumber,
        invoice_date: newInvoiceDate,
        total_sales_amount: parseFloat(totalSales.toFixed(2)),
        total_pieces_count: totalPieces,
        total_bonus_count: totalBonus,
        updated_at: now
      };
      if (input.items && input.items.length > 0) {
        const kept = invoiceItems.filter(it => it.invoice_id !== id);
        invoiceItems.length = 0;
        invoiceItems.push(...kept, ...updatedItems);
      }
    }

    return await InvoiceService.findById(id);
  }
}
