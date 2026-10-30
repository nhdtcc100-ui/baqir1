/**
 * Integration Tests — Modules 2-5
 * Pharmacies | Products & Bonus | Invoices | Analytics
 */
import { createApp } from '../app';
import http from 'http';

const j = async (res: any): Promise<any> => res.json();

const runTests = async () => {
  console.log('🧪 Modules 2-5 Integration Tests\n');
  const app = createApp();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const base = `http://localhost:${(server.address() as any).port}`;

  let passed = 0; let failed = 0;

  const ok = (cond: boolean, label: string, detail?: any) => {
    if (cond) { console.log(`✅ PASS: ${label}`); passed++; }
    else       { console.error(`❌ FAIL: ${label}`, detail ?? ''); failed++; }
  };

  // ── Obtain Tokens ──────────────────────────────────────────────────────────
  const adminLogin = await j(await fetch(`${base}/api/v1/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pharma.com', password: 'admin123456' })
  }));
  const adminToken = adminLogin.data?.accessToken;

  const repLogin = await j(await fetch(`${base}/api/v1/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rep@pharma.com', password: 'rep123456' })
  }));
  const repToken = repLogin.data?.accessToken;
  const repId    = repLogin.data?.user?.id;

  ok(!!adminToken && !!repToken, 'Both Admin and Rep tokens obtained');

  const A = (t: string) => ({ Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' });

  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 2: PHARMACIES
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Module 2: Pharmacies ──');

  // List all (admin)
  const listPh = await j(await fetch(`${base}/api/v1/pharmacies`, { headers: A(adminToken) }));
  ok(listPh.success && Array.isArray(listPh.data) && listPh.data.length >= 3, 'Admin lists 3 seeded pharmacies');

  // Rep sees only assigned pharmacies
  const repPh = await j(await fetch(`${base}/api/v1/pharmacies`, { headers: A(repToken) }));
  ok(repPh.success && repPh.data.every((p: any) => p.assigned_rep_id === repId), 'Rep sees only their assigned pharmacies');

  // Create new pharmacy
  const createPh = await j(await fetch(`${base}/api/v1/pharmacies`, {
    method: 'POST', headers: A(adminToken),
    body: JSON.stringify({ name: 'صيدلية الاختبار', city: 'كربلاء', phone: '+9647700000099' })
  }));
  ok(createPh.success && createPh.data?.id, 'Admin creates a new pharmacy');
  const newPhId = createPh.data?.id;

  // Duplicate check
  const dupPh = await j(await fetch(`${base}/api/v1/pharmacies`, {
    method: 'POST', headers: A(adminToken),
    body: JSON.stringify({ name: 'صيدلية الاختبار', city: 'كربلاء' })
  }));
  ok(!dupPh.success, 'Duplicate pharmacy name+city is blocked (409)');

  // Update pharmacy
  const updPh = await j(await fetch(`${base}/api/v1/pharmacies/${newPhId}`, {
    method: 'PUT', headers: A(adminToken),
    body: JSON.stringify({ assigned_rep_id: repId })
  }));
  ok(updPh.success && updPh.data?.assigned_rep_id === repId, 'Admin assigns rep to pharmacy');

  // Rep cannot create pharmacy
  const repCreatePh = await fetch(`${base}/api/v1/pharmacies`, {
    method: 'POST', headers: A(repToken),
    body: JSON.stringify({ name: 'Unauthorized PH', city: 'TEST' })
  });
  ok(repCreatePh.status === 403, 'Rep cannot create a pharmacy (403)');

  // Delete pharmacy
  const delPh = await j(await fetch(`${base}/api/v1/pharmacies/${newPhId}`, {
    method: 'DELETE', headers: A(adminToken)
  }));
  ok(delPh.success, 'Admin deletes pharmacy');

  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 3: PRODUCTS & BONUS ENGINE
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Module 3: Products & Bonus ──');

  const listProd = await j(await fetch(`${base}/api/v1/catalog/products`, { headers: A(adminToken) }));
  ok(listProd.success && listProd.data.length >= 5, 'Lists 5 seeded products');

  const activeOnly = await j(await fetch(`${base}/api/v1/catalog/products?active=true`, { headers: A(adminToken) }));
  ok(activeOnly.data.every((p: any) => p.is_active === true), 'Active-only filter works');

  // Create product
  const newProd = await j(await fetch(`${base}/api/v1/catalog/products`, {
    method: 'POST', headers: A(adminToken),
    body: JSON.stringify({ name: 'قطرة تجريبية', product_type: 'drop', base_price: 15.5 })
  }));
  ok(newProd.success && newProd.data?.id, 'Admin creates new product');
  const newProdId = newProd.data?.id;

  // Invalid product type
  const badProd = await fetch(`${base}/api/v1/catalog/products`, {
    method: 'POST', headers: A(adminToken),
    body: JSON.stringify({ name: 'X', product_type: 'invalid_type', base_price: 10 })
  });
  ok(badProd.status === 422, 'Invalid product_type rejected with 422');

  // Bonus calculation: 25 قطع بقاعدة 10+1 = 2 قطع بونص
  const calcBonus = await j(await fetch(
    `${base}/api/v1/catalog/calculate-bonus?product_id=prod0001-0000-0000-0000-000000000001&sold_qty=25`,
    { headers: A(repToken) }
  ));
  ok(calcBonus.success && calcBonus.data.bonus_quantity === 2, 'Bonus calc: 25 qty → bonus=2 (floor(25/10)×1)');
  ok(calcBonus.data.total_quantity === 27, 'Bonus calc: total_quantity = sold + bonus = 27');

  // List bonus rules
  const bonusRules = await j(await fetch(`${base}/api/v1/catalog/bonus-rules`, { headers: A(adminToken) }));
  ok(bonusRules.success && bonusRules.data.length >= 4, 'Lists 4 seeded bonus rules');

  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 4: INVOICES
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Module 4: Invoices ──');

  // Create invoice with auto-bonus and price snapshot
  const newInv = await j(await fetch(`${base}/api/v1/invoices`, {
    method: 'POST', headers: A(repToken),
    body: JSON.stringify({
      pharmacy_id: 'ph000001-0000-0000-0000-000000000001',
      invoice_number: 'TEST-INV-001',
      invoice_date: '2026-10-30',
      image_url: 'https://placehold.co/800x600?text=Test+Invoice',
      items: [
        { product_id: 'prod0001-0000-0000-0000-000000000001', sold_quantity: 20 },
        { product_id: 'prod0002-0000-0000-0000-000000000002', sold_quantity: 15 }
      ]
    })
  }));
  ok(newInv.success && newInv.data?.status === 'pending_review', 'Invoice created with pending_review status');
  ok(newInv.data?.items?.length === 2, 'Invoice has 2 line items');
  // 20 قطع × 25 + 15 قطع × 40 = 500 + 600 = 1100
  ok(newInv.data?.total_sales_amount === 1100, `Total sales amount correct: ${newInv.data?.total_sales_amount}`);
  // Bonus: floor(20/10)=2 + floor(15/10)=1 = 3
  ok(newInv.data?.total_bonus_count === 3, `Total bonus correct: ${newInv.data?.total_bonus_count}`);
  ok(newInv.data?.items[0]?.historical_unit_price === 25, 'Price snapshot frozen at creation time');
  const newInvId = newInv.data?.id;

  // List invoices — rep sees own only
  const repInvs = await j(await fetch(`${base}/api/v1/invoices`, { headers: A(repToken) }));
  ok(repInvs.success && repInvs.data.every((i: any) => i.rep_id === repId), 'Rep only sees their invoices');

  // Admin sees all invoices
  const allInvs = await j(await fetch(`${base}/api/v1/invoices`, { headers: A(adminToken) }));
  ok(allInvs.success && allInvs.data.length >= 3, 'Admin sees all invoices (seeded + created)');

  // Filter by status
  const pendingInvs = await j(await fetch(`${base}/api/v1/invoices?status=pending_review`, { headers: A(adminToken) }));
  ok(pendingInvs.data.every((i: any) => i.status === 'pending_review'), 'Status filter works correctly');

  // Admin approves invoice
  const approveInv = await j(await fetch(`${base}/api/v1/invoices/${newInvId}/review`, {
    method: 'PUT', headers: A(adminToken),
    body: JSON.stringify({ status: 'approved' })
  }));
  ok(approveInv.success && approveInv.data?.status === 'approved', 'Admin approves invoice');

  // Reject without reason → error
  const rejectNoReason = await j(await fetch(`${base}/api/v1/invoices/${newInvId}/review`, {
    method: 'PUT', headers: A(adminToken),
    body: JSON.stringify({ status: 'rejected' })
  }));
  ok(!rejectNoReason.success, 'Reject without reason is blocked');

  // Rep cannot review invoices
  const repReview = await fetch(`${base}/api/v1/invoices/${newInvId}/review`, {
    method: 'PUT', headers: A(repToken),
    body: JSON.stringify({ status: 'approved' })
  });
  ok(repReview.status === 403, 'Rep cannot review invoices (403)');

  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 5: ANALYTICS
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Module 5: Analytics ──');

  // KPIs for admin
  const kpis = await j(await fetch(`${base}/api/v1/analytics/kpis`, { headers: A(adminToken) }));
  ok(kpis.success && typeof kpis.data.total_invoices === 'number', 'KPI endpoint returns numeric totals');
  ok(kpis.data.total_pieces_sold > 0, `KPI total_pieces_sold > 0: ${kpis.data.total_pieces_sold}`);

  // KPIs for rep (auto-scoped)
  const repKpis = await j(await fetch(`${base}/api/v1/analytics/kpis`, { headers: A(repToken) }));
  ok(repKpis.success, 'Rep can access own KPIs (auto-scoped)');

  // Pivot data — groupBy rep + product_type
  const pivot = await j(await fetch(
    `${base}/api/v1/analytics/pivot?group_by=rep,product_type`,
    { headers: A(adminToken) }
  ));
  ok(pivot.success && Array.isArray(pivot.data), 'Pivot data returns array grouped by rep+product_type');

  // Invalid pivot dimension
  const badPivot = await j(await fetch(
    `${base}/api/v1/analytics/pivot?group_by=unknown_dim`,
    { headers: A(adminToken) }
  ));
  ok(!badPivot.success, 'Invalid pivot dimension is rejected');

  // Rep performance comparison
  const perf = await j(await fetch(`${base}/api/v1/analytics/reps-performance`, { headers: A(adminToken) }));
  ok(perf.success && perf.data.length > 0, 'Rep performance endpoint returns rows');

  // Excel/CSV export
  const exportRes = await fetch(`${base}/api/v1/analytics/export-excel`, { headers: A(adminToken) });
  ok(exportRes.status === 200, 'Export endpoint returns 200');
  ok(exportRes.headers.get('content-type')?.includes('text/csv') ?? false, 'Export returns CSV content-type');

  // Rep cannot access analytics admin routes
  const repPivot = await fetch(`${base}/api/v1/analytics/pivot`, { headers: A(repToken) });
  ok(repPivot.status === 403, 'Rep blocked from pivot analytics (403)');

  // ── Final Report ──────────────────────────────────────────────────────────
  console.log(`\n==============================================`);
  console.log(`📊 Full Test Suite: ${passed} Passed | ${failed} Failed`);
  console.log(`==============================================\n`);
  server.close();
  if (failed > 0) process.exit(1);
};

runTests().catch(err => { console.error(err); process.exit(1); });
