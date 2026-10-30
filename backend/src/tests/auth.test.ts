import { createApp } from '../app';
import http from 'http';

// Helper: typed JSON parse for strict TypeScript
const jsonOf = async (res: Response): Promise<any> => res.json();

const runTests = async () => {
  console.log('🧪 Starting Module 1 (Auth & Users) Integration Tests...\n');
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}`;

  let passedCount = 0;
  let failedCount = 0;

  const assert = (condition: boolean, testName: string, errorDetail?: any) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${testName}`, errorDetail || '');
      failedCount++;
    }
  };

  try {
    // 1. Health check test
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'healthy', 'Health Check Endpoint');

    // 2. Admin Login test
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@pharma.com', password: 'admin123456' })
    });
    const loginData = await loginRes.json();
    assert(
      loginRes.status === 200 && loginData.success && !!loginData.data.accessToken,
      'Admin Login with Valid Credentials'
    );
    const adminToken = loginData.data?.accessToken;

    // 3. Login with Invalid Credentials test
    const badLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@pharma.com', password: 'wrong_password' })
    });
    assert(badLoginRes.status === 401, 'Login with Invalid Password returns 401');

    // 4. Input Validation (Zod) test - Invalid Email format
    const invalidEmailRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: 'short' })
    });
    assert(invalidEmailRes.status === 422, 'Zod Schema Validation rejects malformed email with 422');

    // 5. Protected Endpoint /me with Valid Token
    const profileRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const profileData = await profileRes.json();
    assert(
      profileRes.status === 200 && profileData.data.role === 'admin',
      'GET /api/v1/auth/me with Bearer Token returns profile'
    );

    // 6. Protected Endpoint /me without Token returns 401
    const noTokenRes = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert(noTokenRes.status === 401, 'Protected endpoint without Token returns 401');

    // 7. Admin creates a new Medical Rep
    const newRepEmail = `rep_test_${Date.now()}@pharma.com`;
    const createRepRes = await fetch(`${baseUrl}/api/v1/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        email: newRepEmail,
        password: 'password1234',
        fullName: 'أحمد محمود الميداني',
        phone: '+9647800000000',
        roleName: 'medical_rep'
      })
    });
    const createRepData = await createRepRes.json();
    assert(
      createRepRes.status === 201 && createRepData.data.role === 'medical_rep',
      'Admin creates new Medical Rep (Role-based access)'
    );

    // 8. New Medical Rep Login test
    const newRepLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newRepEmail, password: 'password1234' })
    });
    const newRepLoginData = await newRepLoginRes.json();
    assert(
      newRepLoginRes.status === 200 && newRepLoginData.data.user.role === 'medical_rep',
      'New Medical Rep can authenticate and receives rep JWT'
    );
    const repToken = newRepLoginData.data?.accessToken;

    // 9. Rep attempts to create another user (Unauthorized Role, expect 403)
    const repCreateAttemptRes = await fetch(`${baseUrl}/api/v1/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${repToken}`
      },
      body: JSON.stringify({
        email: 'unauthorized@pharma.com',
        password: 'password1234',
        fullName: 'غير مصرح',
        roleName: 'medical_rep'
      })
    });
    assert(repCreateAttemptRes.status === 403, 'Rep attempting Admin action is blocked with 403 Forbidden');

    // 10. List users endpoint
    const listUsersRes = await fetch(`${baseUrl}/api/v1/auth/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const listUsersData = await listUsersRes.json();
    assert(
      listUsersRes.status === 200 && Array.isArray(listUsersData.data) && listUsersData.data.length >= 3,
      'Admin can list all registered users'
    );

    console.log(`\n=========================================`);
    console.log(`📊 Test Summary: ${passedCount} Passed, ${failedCount} Failed`);
    console.log(`=========================================\n`);

    if (failedCount > 0) process.exit(1);
  } catch (err: any) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    server.close();
  }
};

runTests();
