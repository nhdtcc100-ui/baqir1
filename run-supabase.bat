@echo off
chcp 65001 > nul
echo ==========================================================
echo 🚀 تشغيل مشروع Supabase و PostgreSQL محلياً عبر Docker
echo ==========================================================
echo.

echo 🔍 التحقق من حالة Docker...
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  تنبيه: محرك Docker Desktop غير مشغل حالياً!
    echo يرجى فتح برنامج Docker Desktop من قائمة ابدأ أو سطح المكتب أولاً، ثم إعادة تشغيل هذا الملف.
    echo.
    pause
    exit /b 1
)

echo 📦 بدء تشغيل حاويات Supabase (Database + Studio + PostgREST)...
docker compose up -d

echo.
echo ==========================================================
echo ✅ تم تشغيل مشروع Supabase بنجاح!
echo.
echo 🌐 لوحة تحكم Supabase Studio (لوحة الإدارة وقواعد البيانات):
echo    http://localhost:8000
echo.
echo 🗄️  قاعدة بيانات PostgreSQL المباشرة:
echo    Host: localhost
echo    Port: 5432
echo    Database: pharma_reps_db
echo    User: postgres
echo    Password: postgres
echo.
echo 🔗 رابط الاتصال المباشر (DATABASE_URL):
echo    postgresql://postgres:postgres@localhost:5432/pharma_reps_db
echo ==========================================================
echo.
pause
