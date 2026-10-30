import { Pool } from 'pg';
import { ENV } from '../config/env';

// PostgreSQL Connection Pool
export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Resilient In-Memory Fallback Store (Allows full standalone execution & testing)
export interface RoleEntity {
  id: string;
  name: 'admin' | 'supervisor' | 'medical_rep';
  description: string;
}

export interface UserEntity {
  id: string;
  role_id: string;
  role_name?: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export const inMemoryStore = {
  roles: [
    { id: '11111111-1111-1111-1111-111111111111', name: 'admin', description: 'مدير النظام بصلاحيات كاملة' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'supervisor', description: 'مشرف مبيعات' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'medical_rep', description: 'مندوب مبيعات ميداني' }
  ] as RoleEntity[],
  
  users: [] as UserEntity[]
};

// Pre-computed bcrypt hashes (rounds=10) — avoids async race at module load:
// admin@pharma.com → 'admin123456' | rep@pharma.com → 'rep123456'
const ADMIN_HASH = '$2b$10$yZeibnt29qRbMeYb03IGG.7MOPlyrG9c6A/WmSRPsn/g.5mGaOdXi';
const REP_HASH   = '$2b$10$S1FyLmW4/RAmTNq4aUTvQuscsfm5x41xC4oUjg4uV4Kpf6VlcWVRK';

inMemoryStore.users.push(
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    role_id: '11111111-1111-1111-1111-111111111111',
    role_name: 'admin',
    email: 'admin@pharma.com',
    password_hash: ADMIN_HASH,
    full_name: 'د. باقر (مدير النظام)',
    phone: '+9647700000001',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    role_id: '33333333-3333-3333-3333-333333333333',
    role_name: 'medical_rep',
    email: 'rep@pharma.com',
    password_hash: REP_HASH,
    full_name: 'علي حسن (مندوب بغداد)',
    phone: '+9647700000002',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
);

let isPgConnected = false;

export const checkDbConnection = async (): Promise<boolean> => {
  if (!ENV.DATABASE_URL) {
    console.log('ℹ️  No DATABASE_URL configured. Running with In-Memory Database store.');
    return false;
  }
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    isPgConnected = true;
    console.log('✅ Connected to PostgreSQL / Supabase successfully.');
    return true;
  } catch (err: any) {
    console.warn(`⚠️  PostgreSQL connection failed (${err.message}). Using In-Memory mock store.`);
    isPgConnected = false;
    return false;
  }
};

export const isUsingPostgres = () => isPgConnected;
