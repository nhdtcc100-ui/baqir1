-- 002_seed_data.sql
-- Seed initial users, products, bonus rules, and pharmacies for Supabase Docker environment

DO $$
DECLARE
    admin_role_id UUID;
    rep_role_id UUID;
    admin_user_id UUID := 'a0000000-0000-0000-0000-000000000001';
    rep_user_id UUID   := 'a0000000-0000-0000-0000-000000000002';
    prod1_id UUID      := '11111111-0000-0000-0000-000000000001';
    prod2_id UUID      := '11111111-0000-0000-0000-000000000002';
    prod3_id UUID      := '11111111-0000-0000-0000-000000000003';
    prod4_id UUID      := '11111111-0000-0000-0000-000000000004';
    prod5_id UUID      := '11111111-0000-0000-0000-000000000005';
BEGIN
    -- Get Role IDs
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    SELECT id INTO rep_role_id FROM roles WHERE name = 'medical_rep';

    -- 1. Insert Default Users
    -- admin@pharma.com / admin123456
    INSERT INTO users (id, role_id, email, password_hash, full_name, phone, is_active)
    VALUES (
        admin_user_id,
        admin_role_id,
        'admin@pharma.com',
        '$2b$10$yZeibnt29qRbMeYb03IGG.7MOPlyrG9c6A/WmSRPsn/g.5mGaOdXi',
        'د. باقر (مدير النظام)',
        '+9647700000001',
        TRUE
    ) ON CONFLICT (email) DO NOTHING;

    -- rep@pharma.com / rep123456
    INSERT INTO users (id, role_id, email, password_hash, full_name, phone, is_active)
    VALUES (
        rep_user_id,
        rep_role_id,
        'rep@pharma.com',
        '$2b$10$S1FyLmW4/RAmTNq4aUTvQuscsfm5x41xC4oUjg4uV4Kpf6VlcWVRK',
        'علي حسن (مندوب بغداد)',
        '+9647700000002',
        TRUE
    ) ON CONFLICT (email) DO NOTHING;

    -- 2. Insert Default Pharmacies
    INSERT INTO pharmacies (id, name, city, address, phone, assigned_rep_id) VALUES
    ('22222222-0000-0000-0000-000000000001', 'صيدلية النور الحديثة', 'بغداد', 'شارع الرشيد، المنصور', '+9647800100001', rep_user_id),
    ('22222222-0000-0000-0000-000000000002', 'صيدلية الشفاء التخصصية', 'البصرة', 'شارع العشار الرئيسي', '+9647800100002', rep_user_id),
    ('22222222-0000-0000-0000-000000000003', 'صيدلية الأمل المركزية', 'النجف', 'شارع الإمام علي، قرب المجمع الطبي', '+9647800100003', admin_user_id)
    ON CONFLICT DO NOTHING;

    -- 3. Insert Catalog Products
    INSERT INTO products (id, name, product_type, base_price, is_active) VALUES
    (prod1_id, 'قطرة عين مرطبة 15ml', 'drop', 25.00, TRUE),
    (prod2_id, 'كريم ترطيب مكثف 50g', 'cream', 40.00, TRUE),
    (prod3_id, 'مرهم مضاد للالتهاب 30g', 'ointment', 35.00, TRUE),
    (prod4_id, 'قطرة أذن مضادة للألم 10ml', 'drop', 18.00, TRUE),
    (prod5_id, 'كريم وقاية من الشمس SPF50', 'cream', 55.00, FALSE)
    ON CONFLICT DO NOTHING;

    -- 4. Insert Default Bonus Rules (10+1 and 5+1)
    INSERT INTO bonus_rules (product_id, threshold_quantity, bonus_quantity, effective_from) VALUES
    (prod1_id, 10, 1, '2026-01-01'),
    (prod2_id, 10, 1, '2026-01-01'),
    (prod3_id, 10, 1, '2026-01-01'),
    (prod4_id, 5, 1, '2026-01-01')
    ON CONFLICT DO NOTHING;
END $$;
