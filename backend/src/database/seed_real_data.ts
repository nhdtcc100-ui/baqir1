import { pool } from './db';

export const seedRealData = async () => {
  console.log('🌱 Seeding Real Invoices Data into PostgreSQL...');
  try {
    const client = await pool.connect();

    // 1. Get a rep user id
    const userRes = await client.query("SELECT id FROM users WHERE role_id = (SELECT id FROM roles WHERE name='medical_rep' LIMIT 1) LIMIT 1");
    const repId = userRes.rows[0]?.id || null;

    // 2. Insert Real Pharmacies
    const pharmaciesToInsert = [
      {
        id: 'b0000004-0000-0000-0000-000000000004',
        name: 'صيدلية نور الهدى حميد لفتة (البلديات)',
        city: 'بغداد',
        address: 'البلديات - شارع المذاخر، قرب الحارثية',
        phone: '07706164665',
        assigned_rep_id: repId
      },
      {
        id: 'b0000005-0000-0000-0000-000000000005',
        name: 'ص حسين هاشم محمود - زيونة',
        city: 'بغداد',
        address: 'حي زيونة - م هشام باسم',
        phone: '07713496540',
        assigned_rep_id: repId
      },
      {
        id: 'b0000006-0000-0000-0000-000000000006',
        name: 'صيدلية الصحة العالمية / الكرادة',
        city: 'بغداد',
        address: 'الكرادة داخل، قرب مستشفى الراهبات',
        phone: '07732017633',
        assigned_rep_id: repId
      },
      {
        id: 'b0000007-0000-0000-0000-000000000007',
        name: 'صيدلية الأماكن / الحبيبية',
        city: 'بغداد',
        address: 'مدينة الصدر - الحبيبية، شارع العيادات',
        phone: '07801911112',
        assigned_rep_id: repId
      }
    ];

    for (const ph of pharmaciesToInsert) {
      await client.query(
        `INSERT INTO pharmacies (id, name, city, address, phone, assigned_rep_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address`,
        [ph.id, ph.name, ph.city, ph.address, ph.phone, ph.assigned_rep_id]
      );
    }
    console.log('✅ Pharmacies seeded successfully.');

    // 3. Insert Real Products
    const productsToInsert = [
      {
        id: 'c0000010-0000-0000-0000-000000000010',
        name: 'Hyfresh drop jamjoom',
        product_type: 'drop',
        base_price: 5267.00
      },
      {
        id: 'c0000020-0000-0000-0000-000000000020',
        name: 'ELICA M CREAM',
        product_type: 'cream',
        base_price: 5706.00
      },
      {
        id: 'c0000030-0000-0000-0000-000000000030',
        name: 'ELICA OINTMENT 30 G',
        product_type: 'ointment',
        base_price: 4828.00
      },
      {
        id: 'c0000040-0000-0000-0000-000000000040',
        name: 'loxtra 5ml drop',
        product_type: 'drop',
        base_price: 4828.00
      },
      {
        id: 'c0000050-0000-0000-0000-000000000050',
        name: 'elica 30g oint',
        product_type: 'ointment',
        base_price: 4828.00
      },
      {
        id: 'c0000060-0000-0000-0000-000000000060',
        name: 'Elica m 30g cream',
        product_type: 'cream',
        base_price: 5706.00
      }
    ];

    for (const p of productsToInsert) {
      await client.query(
        `INSERT INTO products (id, name, product_type, base_price, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, base_price = EXCLUDED.base_price, product_type = EXCLUDED.product_type`,
        [p.id, p.name, p.product_type, p.base_price]
      );

      // Add default 10+1 bonus rule
      await client.query(
        `INSERT INTO bonus_rules (id, product_id, threshold_quantity, bonus_quantity, effective_from)
         VALUES (gen_random_uuid(), $1, 10, 1, '2026-01-01')
         ON CONFLICT DO NOTHING`,
        [p.id]
      );
    }
    console.log('✅ Real Products seeded successfully.');

    client.release();
    return true;
  } catch (err: any) {
    console.error('❌ Seeding error:', err.message);
    return false;
  }
};

if (require.main === module) {
  seedRealData().then(() => process.exit(0));
}
