# 🐬 دليل تشغيل مشروع وقاعدة بيانات Supabase على Docker
### Self-Hosted Supabase Project with Docker Compose

تم تجهيز بيئة متكاملة لمشروع **Supabase** تعمل محلياً بنسبة 100% دون الحاجة إلى اشتراك سحابي، وتتضمن قاعدة بيانات **PostgreSQL 15** الرسمية من Supabase، بالإضافة إلى **Supabase Studio (لوحة التحكم الرسومية)** ومحرك الـ REST التلقائي.

---

## 🌟 محتويات حزمة Supabase على Docker

| الخدمة (Service) | الحاوية (Container) | المنفذ (Port) | الوصف |
|---|---|---|---|
| **Supabase Studio** | `pharma_supabase_studio` | `http://localhost:8000` | لوحة إدارة Supabase الرسمية (محرر الجداول، SQL Editor، سياسات RLS، وغيرها) |
| **PostgreSQL Database** | `pharma_supabase_db` | `5432` | قاعدة البيانات الأصلية مهيأة مع إضافات `uuid-ossp` و `pgcrypto` |
| **Postgres Meta** | `pharma_supabase_meta` | `8080` (داخلي) | محرك فحص وهيكلة الجداول للوحة التحكم |
| **PostgREST API** | `pharma_supabase_rest` | `http://localhost:3001` | واجهة REST API تلقائية لكافة الجداول |

---

## 🚀 طريقة التشغيل السريعة (3 خطوات)

### الخطوة 1: تشغيل Docker Desktop
تأكد من فتح برنامج **Docker Desktop** على جهازك وتركه حتى تكتمل إشارة التشغيل الخضراء.

### الخطوة 2: تشغيل الحاويات
يمكنك تشغيل الحاويات بإحدى طريقتين:
1. **النقر المزدوج** على الملف:
   ```text
   run-supabase.bat
   ```
2. أو من خلال الطرفية (Terminal):
   ```bash
   docker compose up -d
   ```

### الخطوة 3: فتح لوحة تحكم Supabase Studio
افتح متصفحك وتوجه إلى:
👉 **[http://localhost:8000](http://localhost:8000)**

ستجد مشروعك باسم **`Pharma Sales CRM & OCR`** وجداول النظام مهيأة ومرحلة مسبقاً تلقائياً:
- `roles` (الأدوار والصلاحيات)
- `users` (المستخدمين مع الحسابات المبدئية)
- `pharmacies` (الصيدليات وشبكة التوزيع)
- `products` (كتالوج الأدوية والأسعار)
- `bonus_rules` (قواعد البونص التلقائية 10+1 و 5+1)
- `invoices` (الفواتير وحالات المراجعة)
- `invoice_items` (بنود الفواتير مع السعر المجمد التاريخي)

---

## 🔗 بيانات الاتصال المباشرة لقاعدة البيانات (Connection String)

إذا أردت ربط أي أداة إدارة مثل **DBeaver** أو **TablePlus** أو **pgAdmin**:

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `pharma_reps_db`
- **Username:** `postgres`
- **Password:** `postgres`

**رابط الاتصال الشامل (DATABASE_URL):**
```text
postgresql://postgres:postgres@localhost:5432/pharma_reps_db
```
*(تم ضبط هذا الرابط مسبقاً داخل ملف `backend/.env` ليتصل السيرفر تلقائياً بمجرد تشغيل الحاوية).*

---

## 🛑 إيقاف الحاويات عند الانتهاء
```bash
docker compose down
```
*(البيانات محفوظة دائماً في مجلد التخزين `pharma_supabase_data` ولن تفقد).*
