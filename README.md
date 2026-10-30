# 🏥 نظام إدارة مبيعات المندوبين وفواتير الصيدليات بالذكاء الاصطناعي
### Medical Reps Sales & Pharmacy Invoice OCR Management System

نظام رقمي تجاري متكامل لإدارة شبكة مبيعات المندوبين الطبيين في الصيدليات، استخراج بيانات الفواتير الورقية آلياً بالـ OCR، حساب البونص التجاري التلقائي، ومتابعة التحليلات والتقارير المالية.

---

## 🌟 الميزات الرئيسية (Key Features)

- **🤖 استخراج فواتير الصيدليات بالـ OCR:** قراءة الأصناف، الكميات، ومطابقتها آلياً مع الكتالوج الدوائي مع إعطاء نسب الدقة (Confidence Score).
- **🔒 تجميد السعر التاريخي (Historical Price Snapshot):** حفظ وتجميد سعر الصنف وقت صدور الفاتورة لحماية التقارير المالية من التغيرات المستقبلية للأسعار.
- **🎁 محرك حساب البونص التلقائي (Bonus Engine):** احتساب نسب البونص (10+1 و 5+1) فورياً وإضافتها للفاتورة.
- **🛡️ أمان وصلاحيات متعددة المستويات (RBAC):**
  - **مدير النظام (Admin):** إدارة الشبكة، الصيدليات، الأسعار، اعتماد ورفض الفواتير مع تسجيل السبب، وتصدير التقارير.
  - **المندوب الميداني (Medical Rep):** رفع الفواتير، جدولة الزيارات، وعرض الصيدليات الخاصة بمنطقته فقط.
- **🎨 واجهة مستخدم ناعمة Claymorphism:** تصميم ثلاثي الأبعاد بألوان فاتحة ناعمة ومخططات بيانية ديناميكية مع دعم كامل للغة العربية (RTL).
- **📊 تحليلات ومحرك المحاور (Pivot Engine):** تجميع وتحليل المبيعات حسب الصنف والمندوب والمحافظة، وتصدير التقارير لـ Excel/CSV بترميز عربي سليم (`UTF-8 BOM`).

---

## 🏗️ هيكلية المشروع (Project Architecture)

```
.
├── backend/                  # خادم Node.js + Express + TypeScript
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # المصادقة وتوليد JWT
│   │   │   ├── pharmacies/   # إدارة الصيدليات والمناطق
│   │   │   ├── products/     # المنتجات ومحرك البونص
│   │   │   ├── invoices/     # الفواتير ودورة المراجعة
│   │   │   └── analytics/    # التحليلات وتصدير التقارير
│   │   ├── database/         # إعدادات PostgreSQL والـ In-Memory fallback
│   │   └── tests/            # اختبارات التكامل (45 Passed)
│   ├── migrations/           # سكربتات SQL لترحيل قواعد البيانات
│   └── API_DOCS.md           # التوثيق الشامل للـ Endpoints
│
└── frontend/                 # واجهة React + Vite + TypeScript + Bootstrap
    ├── src/
    │   ├── pages/            # الشاشات الـ 6 (Login, Dashboard, Calendar, Scanner, Profile, Ledger)
    │   ├── services/         # عميل الـ API والربط بالخادم
    │   ├── types/            # التعريفات والأنواع (TypeScript)
    │   └── index.css         # نظام الـ Claymorphism Design System
    └── index.html
```

---

## 🚀 التشغيل السريع (Quick Start)

### 1. تشغيل الخادم الخلفي (Backend)
```bash
cd backend
npm install
npm run build
npm run dev
```
*يعمل الخادم على: `http://localhost:5000`*

### 2. تشغيل الواجهة الأمامية (Frontend)
```bash
cd frontend
npm install
npm run dev
```
*تعمل الواجهة على: `http://127.0.0.1:5173`*

---

## 🔑 الحسابات الافتراضية للتجربة (Demo Accounts)

- **مدير عام (Admin):**
  - البريد: `admin@pharma.com`
  - كلمة المرور: `admin123456`
- **مندوب مبيعات (Medical Rep):**
  - البريد: `rep@pharma.com`
  - كلمة المرور: `rep123456`

---

## 🧪 الاختبارات الآلية (Testing)
```bash
cd backend
npx tsx src/tests/auth.test.ts
npx tsx src/tests/modules2to5.test.ts
```
*النتيجة: 45 اختباراً آلياً ناجحاً بنسبة 100%.*
