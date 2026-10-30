# 🏥 توثيق الـ API الشامل — نظام إدارة مبيعات المندوبين وفواتير الصيدليات
## Medical Reps Sales & Pharmacy Invoice OCR Management API

خادم خلفي عالي الأداء مبني باستخدام **Node.js + Express + TypeScript** ويدعم قاعدة بيانات **PostgreSQL** أو التخزين الذاتي السريع في الذاكرة لأغراض التطوير والاختبار.

---

### 🌐 الخادم الأساسي وبيئة التشغيل
- **المنفذ الافتراضي:** `http://localhost:5000`
- **بادئة المسارات:** `/api/v1`
- **التوثيق والحماية:** `Bearer JWT Token` في ترويسة `Authorization`

---

## 📌 الحسابات التجريبية الافتراضية (Demo Accounts)

| الدور (Role) | البريد الإلكتروني | كلمة المرور | الصلاحيات |
|---|---|---|---|
| **مدير النظام (Admin)** | `admin@pharma.com` | `admin123456` | صلاحيات كاملة: الصيدليات، المنتجات، القواعد، الاعتماد، التقارير الشاملة |
| **مندوب بغداد (Medical Rep)** | `rep@pharma.com` | `rep123456` | رفع الفواتير، عرض صيدلياته فقط، استعراض عمولاته وإحصائياته |

---

## 🔑 1. وحدة المصادقة والمستخدمين (Authentication & Users)

### `POST /api/v1/auth/login`
تسجيل الدخول واستلام رمز الوصول (JWT).
- **Body:**
```json
{
  "email": "admin@pharma.com",
  "password": "admin123456"
}
```
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "a0000000-0000-0000-0000-000000000001",
      "email": "admin@pharma.com",
      "full_name": "د. باقر (مدير النظام)",
      "role": "admin"
    }
  }
}
```

### `GET /api/v1/auth/me`
استرجاع بيانات المستخدم الحالي الموثق.
- **Headers:** `Authorization: Bearer <token>`

### `POST /api/v1/auth/users` *(Admin Only)*
إنشاء حساب مندوب جديد أو مشرف.
- **Body:**
```json
{
  "email": "rep2@pharma.com",
  "password": "password123",
  "full_name": "سامر أحمد",
  "phone": "+9647701234567",
  "role_name": "medical_rep"
}
```

---

## 🏥 2. وحدة الصيدليات والمناطق (Pharmacies & Territory)

### `GET /api/v1/pharmacies`
عرض الصيدليات (المندوب يرى صيدلياته المعينة فقط، المشرف والمدير يريان الكل مع إمكانية الفلترة).
- **Query Params:** `?city=بغداد&search=النور`

### `POST /api/v1/pharmacies` *(Admin Only)*
إضافة صيدلية جديدة في شبكة التوزيع.
- **Body:**
```json
{
  "name": "صيدلية المستقبل",
  "city": "بغداد",
  "address": "شارع فلسطين، مقابل المستشفى",
  "phone": "+9647709998888",
  "assigned_rep_id": "a0000000-0000-0000-0000-000000000002"
}
```

### `PUT /api/v1/pharmacies/:id/assign-rep` *(Admin / Supervisor)*
تعيين مندوب للصيدلية.
- **Body:** `{ "rep_id": "a0000000-0000-0000-0000-000000000002" }`

---

## 💊 3. وحدة المنتجات وقواعد البونص (Products & Bonus Rules)

### `GET /api/v1/catalog/products`
استعراض قائمة المنتجات والأسعار الرسمية.
- **Query:** `?active=true`

### `POST /api/v1/catalog/products` *(Admin Only)*
إضافة منتج دوائي جديد.
- **Body:**
```json
{
  "name": "مرهم حروق مهدئ 40g",
  "product_type": "ointment",
  "base_price": 32.50,
  "is_active": true
}
```

### `GET /api/v1/catalog/bonus-rules`
استعراض شروط وسياسات البونص الحالية لكل صنف.

### `POST /api/v1/catalog/calculate-bonus`
محاكاة وحساب البونص التلقائي لكمية معينة قبل إصدار الفاتورة:
- **Body:** `{ "product_id": "prod0001-...", "sold_quantity": 25 }`
- **Output:**
```json
{
  "success": true,
  "data": {
    "sold_quantity": 25,
    "bonus_quantity": 2,
    "total_quantity": 27,
    "unit_price": 25.00,
    "total_amount": 625.00
  }
}
```

---

## 🧾 4. وحدة الفواتير ودورة المراجعة (Invoices & OCR Workflow)

### `GET /api/v1/invoices`
قائمة الفواتير المرفوعة.
- **Query:** `?status=pending_review&from=2026-10-01&to=2026-10-31`
- *المندوب يرى فواتيره تلقائياً، والمدير يرى كل الفواتير.*

### `POST /api/v1/invoices` *(Medical Rep, Admin)*
رفع فاتورة جديدة ناتجة عن المسح الضوئي / OCR وتجميد الأسعار وحساب البونص فوراً:
- **Body:**
```json
{
  "pharmacy_id": "ph000001-0000-0000-0000-000000000001",
  "invoice_number": "INV-2026-901",
  "invoice_date": "2026-10-30",
  "image_url": "https://storage.pharma.com/invoices/inv_901.jpg",
  "items": [
    { "product_id": "prod0001-0000-0000-0000-000000000001", "sold_quantity": 20, "ocr_confidence": 0.98 },
    { "product_id": "prod0002-0000-0000-0000-000000000002", "sold_quantity": 10, "ocr_confidence": 0.94 }
  ]
}
```

### `PUT /api/v1/invoices/:id/review` *(Admin, Supervisor)*
اعتماد الفاتورة أو رفضها مع كتابة سبب الرفض:
- **Body للإلغاء/الرفض:** `{ "status": "rejected", "rejection_reason": "الختم غير واضح" }`
- **Body للاعتماد:** `{ "status": "approved" }`

---

## 📊 5. وحدة التحليلات وتصدير التقارير (Analytics & Export)

### `GET /api/v1/analytics/kpis`
المؤشرات الكلية: إجمالي الفواتير، المبالغ المحققة، عدد الصيدليات المزارة، والقطع المباعة والممنوحة كبونص.

### `GET /api/v1/analytics/pivot` *(Admin Only)*
محرك المحاور المرن للتجميع والتحليل:
- **Query:** `?group_by=rep,product_type` أو `?group_by=pharmacy` أو `?group_by=product`

### `GET /api/v1/analytics/reps-performance` *(Admin Only)*
مقارنة أداء المندوبين، عدد الفواتير، إجمالي المبيعات، ومعدل الاعتماد.

### `GET /api/v1/analytics/export/csv`
تصدير تقرير شامل إلى ملف Excel/CSV جاهز للتحميل مع ترميز عربي سليم (`UTF-8 BOM`).
