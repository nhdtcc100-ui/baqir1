-- 001_initial_schema.sql
-- Migration 001: Medical Reps Sales & Pharmacy Invoice OCR Management System

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
('admin', 'مدير النظام بصلاحيات كاملة'),
('supervisor', 'مشرف مبيعات يتابع مندوبي منطقته'),
('medical_rep', 'مندوب مبيعات ميداني')
ON CONFLICT (name) DO NOTHING;

-- 2. Users table (Stores credentials and profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    assigned_rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products table
DO $$ BEGIN
    CREATE TYPE product_category AS ENUM ('drop', 'cream', 'ointment', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    product_type product_category NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bonus Rules table
CREATE TABLE IF NOT EXISTS bonus_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rep_id UUID REFERENCES users(id) ON DELETE CASCADE,
    threshold_quantity INT NOT NULL DEFAULT 10 CHECK (threshold_quantity > 0),
    bonus_quantity INT NOT NULL DEFAULT 1 CHECK (bonus_quantity >= 0),
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Invoices table
DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100),
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE RESTRICT,
    rep_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    image_url TEXT NOT NULL,
    status invoice_status NOT NULL DEFAULT 'pending_review',
    total_sales_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_pieces_count INT NOT NULL DEFAULT 0,
    total_bonus_count INT NOT NULL DEFAULT 0,
    is_synced_offline BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Invoice Items table (with historical snapshot)
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name_snapshot VARCHAR(200) NOT NULL,
    product_type_snapshot product_category NOT NULL,
    sold_quantity INT NOT NULL CHECK (sold_quantity > 0),
    historical_unit_price NUMERIC(10, 2) NOT NULL CHECK (historical_unit_price >= 0),
    bonus_quantity INT NOT NULL DEFAULT 0 CHECK (bonus_quantity >= 0),
    total_quantity INT GENERATED ALWAYS AS (sold_quantity + bonus_quantity) STORED,
    line_total NUMERIC(12, 2) GENERATED ALWAYS AS (sold_quantity * historical_unit_price) STORED,
    ocr_confidence NUMERIC(3, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_rep_date ON invoices(rep_id, invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_pharmacy ON invoices(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product ON invoice_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
