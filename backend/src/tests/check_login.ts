import bcrypt from 'bcryptjs';
import { AuthService } from '../modules/auth/auth.service';
import { inMemoryStore } from '../database/db';

async function test() {
  console.log('Seeded users:', inMemoryStore.users.map(u => ({ email: u.email, hash: u.password_hash })));
  
  const adminUser = inMemoryStore.users.find(u => u.email === 'admin@pharma.com');
  if (adminUser) {
    const isMatch = await bcrypt.compare('admin123456', adminUser.password_hash);
    console.log('Direct bcrypt.compare with admin123456:', isMatch);
  }

  try {
    const res = await AuthService.login('admin@pharma.com', 'admin123456');
    console.log('AuthService.login SUCCESS:', res.user.email, res.user.role);
  } catch (err: any) {
    console.error('AuthService.login FAILED:', err.message);
  }

  // Also test with HTTP request to localhost:5000
  try {
    const httpRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@pharma.com', password: 'admin123456' })
    });
    const json = await httpRes.json();
    console.log('HTTP fetch response:', json);
  } catch (httpErr: any) {
    console.error('HTTP fetch error:', httpErr.message);
  }
}

test();
