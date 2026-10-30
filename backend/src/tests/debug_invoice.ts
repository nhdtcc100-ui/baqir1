import { createApp } from '../app';
import http from 'http';

const main = async () => {
  const app = createApp();
  const s = http.createServer(app);
  await new Promise<void>(res => s.listen(0, res));
  const port = (s.address() as any).port;

  const loginRes = await fetch(`http://localhost:${port}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rep@pharma.com', password: 'rep123456' })
  });
  const l = await loginRes.json() as any;
  const t = l.data?.accessToken;
  console.log('Login result:', l.success, 'token:', !!t);

  const invRes = await fetch(`http://localhost:${port}/api/v1/invoices`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pharmacy_id: 'ph000001-0000-0000-0000-000000000001',
      image_url: 'https://example.com/img.jpg',
      items: [{ product_id: 'prod0001-0000-0000-0000-000000000001', sold_quantity: 10 }]
    })
  });
  const inv = await invRes.json() as any;
  console.log('Invoice result (status', invRes.status, '):', JSON.stringify(inv, null, 2));
  s.close();
};

main().catch(console.error);
