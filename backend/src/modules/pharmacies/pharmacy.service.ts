import crypto from 'crypto';
import { pool, isUsingPostgres, inMemoryStore } from '../../database/db';
import { PharmacyEntity, CreatePharmacyInput, UpdatePharmacyInput } from './pharmacy.types';

// ─── In-Memory Pharmacy Store (Empty — Clean start, pharmacies are added dynamically) ───
export const pharmacies: PharmacyEntity[] = [];

export class PharmacyService {
  // ── 1. جلب كل الصيدليات مع دعم التصفية ────────────────────────────────
  static async findAll(
    repId?: string,
    city?: string,
    search?: string
  ): Promise<PharmacyEntity[]> {
    if (isUsingPostgres()) {
      let query = `
        SELECT p.*, u.full_name AS assigned_rep_name
        FROM pharmacies p
        LEFT JOIN users u ON u.id = p.assigned_rep_id
        WHERE 1=1
      `;
      const params: any[] = [];
      let idx = 1;
      if (repId) { query += ` AND p.assigned_rep_id = $${idx++}`; params.push(repId); }
      if (city)  { query += ` AND p.city ILIKE $${idx++}`;         params.push(`%${city}%`); }
      if (search){ query += ` AND p.name ILIKE $${idx++}`;         params.push(`%${search}%`); }
      query += ' ORDER BY p.created_at DESC';
      const res = await pool.query(query, params);
      return res.rows;
    }

    let result = [...pharmacies];
    if (repId)  result = result.filter(p => p.assigned_rep_id === repId);
    if (city)   result = result.filter(p => p.city.includes(city));
    if (search) result = result.filter(p => p.name.includes(search));
    return result;
  }

  // ── 2. جلب صيدلية واحدة بالـ ID ────────────────────────────────────────
  static async findById(id: string): Promise<PharmacyEntity> {
    if (isUsingPostgres()) {
      const res = await pool.query(
        `SELECT p.*, u.full_name AS assigned_rep_name
         FROM pharmacies p
         LEFT JOIN users u ON u.id = p.assigned_rep_id
         WHERE p.id = $1`,
        [id]
      );
      if (res.rows.length === 0) throw { statusCode: 404, message: 'الصيدلية غير موجودة' };
      return res.rows[0];
    }

    const ph = pharmacies.find(p => p.id === id);
    if (!ph) throw { statusCode: 404, message: 'الصيدلية غير موجودة' };
    return ph;
  }

  // ── 2b. البحث عن صيدلية بالاسم ────────────────────────────────────────
  static async findByName(name: string): Promise<PharmacyEntity | null> {
    if (!name) return null;
    const clean = name.toLowerCase().replace(/^(صيدلية|صيدليه|ص)\s*/i, '').trim();
    if (clean.length < 2) return null;
    if (isUsingPostgres()) {
      const res = await pool.query('SELECT * FROM pharmacies WHERE name ILIKE $1 LIMIT 1', [`%${clean}%`]);
      return res.rows[0] || null;
    }
    return pharmacies.find(p => {
      const pClean = p.name.toLowerCase().replace(/^(صيدلية|صيدليه|ص)\s*/i, '').trim();
      return pClean.length >= 2 && (pClean.includes(clean) || clean.includes(pClean));
    }) || null;
  }

  // ── 3. إنشاء صيدلية جديدة ───────────────────────────────────────────────
  static async create(input: CreatePharmacyInput): Promise<PharmacyEntity> {
    const clean = (input.name || '').toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/i, '').trim();
    if (clean.length < 2) {
      throw { statusCode: 400, message: 'اسم الصيدلية غير مكتمل أو عام جداً. يرجى إدخال اسم مميز للصيدلية.' };
    }
    if (isUsingPostgres()) {
      const dup = await pool.query(
        'SELECT id FROM pharmacies WHERE LOWER(name) = LOWER($1)',
        [input.name]
      );
      if (dup.rows.length > 0) return dup.rows[0];

      const id = crypto.randomUUID();
      const now = new Date();
      const res = await pool.query(
        `INSERT INTO pharmacies (id, name, city, address, phone, assigned_rep_id, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
        [id, input.name, input.city, input.address ?? null,
         input.phone ?? null, input.assigned_rep_id ?? null, now]
      );
      return res.rows[0];
    }

    const dup = pharmacies.find(
      p => p.name.toLowerCase().trim() === input.name.toLowerCase().trim()
    );
    if (dup) return dup;

    // جلب اسم المندوب إذا وُجد
    let repName: string | undefined;
    if (input.assigned_rep_id) {
      const rep = inMemoryStore.users.find(u => u.id === input.assigned_rep_id);
      repName = rep?.full_name;
    }

    const newPh: PharmacyEntity = {
      id: crypto.randomUUID(),
      name: input.name,
      city: input.city,
      address: input.address,
      phone: input.phone,
      assigned_rep_id: input.assigned_rep_id,
      assigned_rep_name: repName,
      created_at: new Date()
    };
    pharmacies.push(newPh);
    return newPh;
  }

  // ── 4. تعديل صيدلية موجودة ──────────────────────────────────────────────
  static async update(id: string, input: UpdatePharmacyInput): Promise<PharmacyEntity> {
    if (isUsingPostgres()) {
      const fields: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (input.name !== undefined)           { fields.push(`name = $${idx++}`);             params.push(input.name); }
      if (input.city !== undefined)           { fields.push(`city = $${idx++}`);             params.push(input.city); }
      if (input.address !== undefined)        { fields.push(`address = $${idx++}`);          params.push(input.address); }
      if (input.phone !== undefined)          { fields.push(`phone = $${idx++}`);            params.push(input.phone); }
      if (input.assigned_rep_id !== undefined){ fields.push(`assigned_rep_id = $${idx++}`); params.push(input.assigned_rep_id || null); }

      if (fields.length === 0) throw { statusCode: 400, message: 'لا توجد حقول للتعديل' };

      params.push(id);
      const res = await pool.query(
        `UPDATE pharmacies SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        params
      );
      if (res.rows.length === 0) throw { statusCode: 404, message: 'الصيدلية غير موجودة' };
      return res.rows[0];
    }

    const idx2 = pharmacies.findIndex(p => p.id === id);
    if (idx2 === -1) throw { statusCode: 404, message: 'الصيدلية غير موجودة' };

    pharmacies[idx2] = { ...pharmacies[idx2], ...input };

    if (input.assigned_rep_id !== undefined) {
      const rep = inMemoryStore.users.find(u => u.id === input.assigned_rep_id);
      pharmacies[idx2].assigned_rep_name = rep?.full_name;
    }
    return pharmacies[idx2];
  }

  // ── 5. حذف صيدلية ───────────────────────────────────────────────────────
  static async delete(id: string): Promise<void> {
    if (isUsingPostgres()) {
      const res = await pool.query('DELETE FROM pharmacies WHERE id = $1 RETURNING id', [id]);
      if (res.rows.length === 0) throw { statusCode: 404, message: 'الصيدلية غير موجودة' };
      return;
    }
    const idx2 = pharmacies.findIndex(p => p.id === id);
    if (idx2 === -1) throw { statusCode: 404, message: 'الصيدلية غير موجودة' };
    pharmacies.splice(idx2, 1);
  }
}
