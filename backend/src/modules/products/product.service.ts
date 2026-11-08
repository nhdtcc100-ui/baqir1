import crypto from 'crypto';
import { pool, isUsingPostgres } from '../../database/db';

export type ProductCategory = 'drop' | 'cream' | 'ointment' | 'other';

export interface Product {
  id: string;
  name: string;
  product_type: ProductCategory;
  base_price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BonusRule {
  id: string;
  product_id: string;
  product_name?: string;
  rep_id?: string;
  rep_name?: string;
  threshold_quantity: number;
  bonus_quantity: number;
  effective_from: string;
  effective_to?: string;
  created_at: Date;
}

// ── In-Memory Stores ─────────────────────────────────────────────────────────
export const products: Product[] = [
  { id: 'c0000010-0000-0000-0000-000000000010', name: 'Hyfresh drop jamjoom',     product_type: 'drop',    base_price: 5267.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000020-0000-0000-0000-000000000020', name: 'ELICA M CREAM',            product_type: 'cream',   base_price: 5706.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000030-0000-0000-0000-000000000030', name: 'ELICA OINTMENT 30 G',       product_type: 'ointment',base_price: 4828.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000040-0000-0000-0000-000000000040', name: 'loxtra 5ml drop',          product_type: 'drop',    base_price: 4828.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000050-0000-0000-0000-000000000050', name: 'elica 30g oint',           product_type: 'ointment',base_price: 4828.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000060-0000-0000-0000-000000000060', name: 'Elica m 30g cream',        product_type: 'cream',   base_price: 5706.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000070-0000-0000-0000-000000000070', name: 'elicasal oint 30g jamjoom',product_type: 'ointment',base_price: 5750.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000080-0000-0000-0000-000000000080', name: 'Fusibact 2% cream',        product_type: 'cream',   base_price: 2842.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000090-0000-0000-0000-000000000090', name: 'Elica -M cream 0.1%',      product_type: 'cream',   base_price: 5855.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'c0000100-0000-0000-0000-000000000100', name: 'Hy Fresh drups',           product_type: 'drop',    base_price: 5247.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'prod0001-0000-0000-0000-000000000001', name: 'قطرة عين مرطبة 15ml',     product_type: 'drop',    base_price: 25.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'prod0002-0000-0000-0000-000000000002', name: 'كريم ترطيب مكثف 50g',     product_type: 'cream',   base_price: 40.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'prod0003-0000-0000-0000-000000000003', name: 'مرهم مضاد للالتهاب 30g',  product_type: 'ointment',base_price: 35.00, is_active: true, created_at: new Date('2026-01-01'), updated_at: new Date('2026-01-01') },
  { id: 'prod0004-0000-0000-0000-000000000004', name: 'قطرة أذن مضادة للألم',    product_type: 'drop',    base_price: 18.00, is_active: true, created_at: new Date('2026-02-01'), updated_at: new Date('2026-02-01') },
  { id: 'prod0005-0000-0000-0000-000000000005', name: 'كريم وقاية من الشمس SPF50',product_type: 'cream',   base_price: 55.00, is_active: false,created_at: new Date('2026-03-01'), updated_at: new Date('2026-03-01') },
];

export const bonusRules: BonusRule[] = [
  { id: 'bonus010-0000-0000-0000-000000000010', product_id: 'c0000010-0000-0000-0000-000000000010', product_name: 'Hyfresh drop jamjoom', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus020-0000-0000-0000-000000000020', product_id: 'c0000020-0000-0000-0000-000000000020', product_name: 'ELICA M CREAM', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus030-0000-0000-0000-000000000030', product_id: 'c0000030-0000-0000-0000-000000000030', product_name: 'ELICA OINTMENT 30 G', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus040-0000-0000-0000-000000000040', product_id: 'c0000040-0000-0000-0000-000000000040', product_name: 'loxtra 5ml drop', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus050-0000-0000-0000-000000000050', product_id: 'c0000050-0000-0000-0000-000000000050', product_name: 'elica 30g oint', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus060-0000-0000-0000-000000000060', product_id: 'c0000060-0000-0000-0000-000000000060', product_name: 'Elica m 30g cream', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus001-0000-0000-0000-000000000001', product_id: 'prod0001-0000-0000-0000-000000000001', product_name: 'قطرة عين مرطبة 15ml', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus002-0000-0000-0000-000000000002', product_id: 'prod0002-0000-0000-0000-000000000002', product_name: 'كريم ترطيب مكثف 50g', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus003-0000-0000-0000-000000000003', product_id: 'prod0003-0000-0000-0000-000000000003', product_name: 'مرهم مضاد للالتهاب 30g',threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
  { id: 'bonus004-0000-0000-0000-000000000004', product_id: 'prod0004-0000-0000-0000-000000000004', product_name: 'قطرة أذن مضادة للألم', threshold_quantity: 10, bonus_quantity: 1, effective_from: '2026-01-01', created_at: new Date() },
];

// ── Product Service ───────────────────────────────────────────────────────────
export class ProductService {
  // تحويل النوع من قاعدة البيانات (NUMERIC يأتي كـ string من pg)
  private static normalizeProduct(row: any): Product {
    return {
      ...row,
      base_price: parseFloat(row.base_price)
    };
  }

  static async findAll(activeOnly = false): Promise<Product[]> {
    if (isUsingPostgres()) {
      const q = activeOnly
        ? 'SELECT * FROM products WHERE is_active = TRUE ORDER BY product_type, name'
        : 'SELECT * FROM products ORDER BY product_type, name';
      const res = await pool.query(q);
      return res.rows.map(ProductService.normalizeProduct);
    }
    return activeOnly ? products.filter(p => p.is_active) : [...products];
  }

  static async findById(id: string): Promise<Product> {
    if (isUsingPostgres()) {
      const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (!res.rows[0]) throw { statusCode: 404, message: 'المنتج غير موجود' };
      return ProductService.normalizeProduct(res.rows[0]);
    }
    const p = products.find(p => p.id === id);
    if (!p) throw { statusCode: 404, message: 'المنتج غير موجود' };
    return p;
  }

  static async create(input: Partial<Product>): Promise<Product> {
    const now = new Date();
    const newProd: Product = {
      id: crypto.randomUUID(),
      name: input.name!,
      product_type: input.product_type!,
      base_price: input.base_price!,
      is_active: input.is_active ?? true,
      created_at: now,
      updated_at: now
    };
    if (isUsingPostgres()) {
      const res = await pool.query(
        `INSERT INTO products (id,name,product_type,base_price,is_active,created_at,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [newProd.id, newProd.name, newProd.product_type, newProd.base_price, newProd.is_active, now, now]
      );
      return ProductService.normalizeProduct(res.rows[0]);
    }
    products.push(newProd);
    return newProd;
  }

  static async update(id: string, input: Partial<Product>): Promise<Product> {
    if (isUsingPostgres()) {
      const fields: string[] = []; const params: any[] = []; let idx = 1;
      if (input.name !== undefined)         { fields.push(`name=$${idx++}`);         params.push(input.name); }
      if (input.product_type !== undefined) { fields.push(`product_type=$${idx++}`); params.push(input.product_type); }
      if (input.base_price !== undefined)   { fields.push(`base_price=$${idx++}`);   params.push(input.base_price); }
      if (input.is_active !== undefined)    { fields.push(`is_active=$${idx++}`);    params.push(input.is_active); }
      fields.push(`updated_at=$${idx++}`); params.push(new Date());
      if (!fields.length) throw { statusCode: 400, message: 'لا توجد حقول للتعديل' };
      params.push(id);
      const res = await pool.query(`UPDATE products SET ${fields.join(',')} WHERE id=$${idx} RETURNING *`, params);
      if (!res.rows[0]) throw { statusCode: 404, message: 'المنتج غير موجود' };
      return ProductService.normalizeProduct(res.rows[0]);
    }
    const i = products.findIndex(p => p.id === id);
    if (i === -1) throw { statusCode: 404, message: 'المنتج غير موجود' };
    products[i] = { ...products[i], ...input, updated_at: new Date() };
    return products[i];
  }
}

// ── Bonus Engine Service ──────────────────────────────────────────────────────
export class BonusService {
  /** حساب البونص: Floor(qty / threshold) × bonus_qty — الخوارزمية الأساسية */
  static calculateBonus(soldQty: number, threshold = 10, bonusPerThreshold = 1): number {
    const t = threshold > 0 ? threshold : 10;
    const b = bonusPerThreshold > 0 ? bonusPerThreshold : 1;
    return Math.floor(soldQty / t) * b;
  }

  /** جلب قاعدة البونص النشطة لمنتج معين (يراعي استثناء المندوب إن وُجد) */
  static async getActiveRule(productId: string, repId?: string, date?: string): Promise<BonusRule | null> {
    const today = date ?? new Date().toISOString().split('T')[0];
    if (isUsingPostgres()) {
      const res = await pool.query(
        `SELECT * FROM bonus_rules
         WHERE product_id = $1
           AND (rep_id = $2 OR rep_id IS NULL)
           AND effective_from <= $3
           AND (effective_to IS NULL OR effective_to >= $3)
         ORDER BY rep_id NULLS LAST
         LIMIT 1`,
        [productId, repId ?? null, today]
      );
      return res.rows[0] ?? null;
    }
    const rule = bonusRules.find(r =>
      r.product_id === productId &&
      (r.rep_id === repId || !r.rep_id) &&
      r.effective_from <= today &&
      (!r.effective_to || r.effective_to >= today)
    );
    return rule ?? null;
  }

  static async findAll(): Promise<BonusRule[]> {
    if (isUsingPostgres()) {
      const res = await pool.query(`
        SELECT br.*, p.name AS product_name, u.full_name AS rep_name
        FROM bonus_rules br
        JOIN products p ON p.id = br.product_id
        LEFT JOIN users u ON u.id = br.rep_id
        ORDER BY br.created_at DESC`);
      return res.rows;
    }
    return [...bonusRules];
  }

  static async upsertRule(input: Partial<BonusRule>): Promise<BonusRule> {
    if (isUsingPostgres()) {
      const id = input.id ?? crypto.randomUUID();
      const now = new Date();
      const res = await pool.query(
        `INSERT INTO bonus_rules (id, product_id, rep_id, threshold_quantity, bonus_quantity, effective_from, effective_to, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET
           threshold_quantity = EXCLUDED.threshold_quantity,
           bonus_quantity     = EXCLUDED.bonus_quantity,
           effective_to       = EXCLUDED.effective_to
         RETURNING *`,
        [id, input.product_id, input.rep_id ?? null,
         input.threshold_quantity ?? 10, input.bonus_quantity ?? 1,
         input.effective_from ?? new Date().toISOString().split('T')[0],
         input.effective_to ?? null, now]
      );
      return res.rows[0];
    }
    const i = bonusRules.findIndex(r => r.id === input.id);
    if (i >= 0) {
      bonusRules[i] = { ...bonusRules[i], ...input };
      return bonusRules[i];
    }
    const newRule: BonusRule = {
      id: crypto.randomUUID(),
      product_id: input.product_id!,
      rep_id: input.rep_id,
      threshold_quantity: input.threshold_quantity ?? 10,
      bonus_quantity: input.bonus_quantity ?? 1,
      effective_from: input.effective_from ?? new Date().toISOString().split('T')[0],
      effective_to: input.effective_to,
      created_at: new Date()
    };
    bonusRules.push(newRule);
    return newRule;
  }

  static async deleteRule(id: string): Promise<void> {
    if (isUsingPostgres()) {
      await pool.query('DELETE FROM bonus_rules WHERE id = $1', [id]);
      return;
    }
    const i = bonusRules.findIndex(r => r.id === id);
    if (i === -1) throw { statusCode: 404, message: 'قاعدة البونص غير موجودة' };
    bonusRules.splice(i, 1);
  }
}
