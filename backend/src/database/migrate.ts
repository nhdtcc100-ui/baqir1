import fs from 'fs';
import path from 'path';
import { pool } from './db';

export const runMigrations = async () => {
  console.log('🔄 Running Database Migrations...');
  const migrationPath = path.join(__dirname, '../../migrations/001_initial_schema.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found at:', migrationPath);
    return;
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  try {
    
    const client = await pool.connect();
    console.log('📦 Executing 001_initial_schema.sql...');
    await client.query(sql);
    client.release();
    console.log('✅ Migrations executed successfully.');
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  runMigrations();
}
