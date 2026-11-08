import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  FileSpreadsheet, ExternalLink, RefreshCw, UploadCloud,
  CheckCircle2, AlertCircle, Copy, Check, Settings,
  Database, Table, Clock, ShieldCheck, Sparkles, Search,
  AlertTriangle, DownloadCloud
} from 'lucide-react';
import { getDosageFormBadgeColor } from './BatchReviewTable';

export const GoogleSheetsSync: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data states
  const [sheetData, setSheetData] = useState<{
    headers: string[];
    rows: any[];
    rawCount: number;
    sheet_id: string;
    sheet_url: string;
  } | null>(null);

  const [config, setConfig] = useState<{
    sheet_id: string;
    sheet_url: string;
    webhook_url: string;
    is_connected: boolean;
    apps_script_code: string;
    headers: string[];
  } | null>(null);

  const [webhookInput, setWebhookInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  // حالة الفجوة والمزامنة لسد أي كاب
  const [gapStatus, setGapStatus] = useState<{
    system_invoices_count: number;
    sheet_rows_count: number;
    sheet_unique_invoices_count: number;
    unuploaded_count: number;
    unuploaded_invoices: Array<{
      id: string;
      invoice_number: string;
      invoice_date: string;
      pharmacy_name: string;
      total_sales_amount: number;
      items_count: number;
    }>;
    missing_in_system_count: number;
    has_gap: boolean;
  } | null>(null);
  const [syncingUnuploaded, setSyncingUnuploaded] = useState(false);
  const [importingMissing, setImportingMissing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataRes, configRes, gapRes] = await Promise.all([
        api.getSheetsData(),
        api.getSheetsConfig(),
        api.getSheetsGapStatus().catch(() => null)
      ]);
      setSheetData(dataRes);
      setConfig(configRes);
      setGapStatus(gapRes);
      setWebhookInput(configRes.webhook_url || '');
    } catch (e: any) {
      setError(e.message || 'تعذر جلب بيانات كوكل شيت');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncAll = async () => {
    setSyncing(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.syncAllToSheets();
      setSuccessMsg(res.message);
      // Re-fetch sheet data
      await loadData();
    } catch (e: any) {
      setError(e.message || 'فشلت المزامنة مع كوكل شيت');
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncUnuploaded = async () => {
    setSyncingUnuploaded(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.syncUnuploadedToSheets();
      setSuccessMsg(res.message);
      await loadData();
    } catch (e: any) {
      setError(e.message || 'فشل رفع الفواتير غير المرفوعة');
    } finally {
      setSyncingUnuploaded(false);
    }
  };

  const handleImportMissing = async () => {
    setImportingMissing(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.importMissingFromSheets();
      setSuccessMsg(res.message);
      await loadData();
    } catch (e: any) {
      setError(e.message || 'فشل استيراد الفواتير من كوكل شيت');
    } finally {
      setImportingMissing(false);
    }
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.updateSheetsWebhook(webhookInput);
      setConfig(prev => prev ? { ...prev, webhook_url: res.webhook_url, is_connected: res.is_connected } : null);
      setSuccessMsg('تم حفظ رابط الويب هوك بنجاح! النظام متصل الآن للمزامنة الفورية.');
    } catch (e: any) {
      setError(e.message || 'فشل حفظ إعدادات الرابط');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleCopyCode = () => {
    if (!config?.apps_script_code) return;
    navigator.clipboard.writeText(config.apps_script_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const rows = (sheetData?.rows || []).filter(r => {
    const num = String(r.invoice_number || '').trim();
    return num && num !== '123' && r.pharmacy_name;
  });
  const filteredRows = rows.filter(r => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      (r.invoice_number && String(r.invoice_number).toLowerCase().includes(s)) ||
      (r.pharmacy_name && String(r.pharmacy_name).toLowerCase().includes(s)) ||
      (r.product_name && String(r.product_name).toLowerCase().includes(s)) ||
      (r.warehouse_name && String(r.warehouse_name).toLowerCase().includes(s)) ||
      (r.rep_name && String(r.rep_name).toLowerCase().includes(s)) ||
      (r.area && String(r.area).toLowerCase().includes(s)) ||
      (r.dosage_form && String(r.dosage_form).toLowerCase().includes(s))
    );
  });

  const totalValue = filteredRows.reduce((sum, r) => sum + (Number(r.line_total) || 0), 0);
  const totalPieces = filteredRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  const totalBonus = filteredRows.reduce((sum, r) => sum + (Number(r.bonus_quantity) || 0), 0);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Database size={13} /> كوكل شيت كقاعدة بيانات حية
            </span>
            <span className={`badge ${config?.is_connected ? 'badge-primary' : 'badge-warning'}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} /> {config?.is_connected ? 'مزامنة تلقائية فورية مفعلة' : 'قراءة عامة نشطة'}
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileSpreadsheet size={28} style={{ color: '#10b981' }} />
            إدارة ومزامنة كوكل شيت (Google Sheets)
          </h1>
          <p className="page-subtitle">
            ربط مباشر مع ملف كوكل شيت: عرض البيانات الحية، وتصدير جميع الفواتير والتقارير بتنسيق احترافي منسق بالعربية.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a
            href={config?.sheet_url || 'https://docs.google.com/spreadsheets/d/1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE/edit?usp=sharing'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-clay btn-secondary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <ExternalLink size={16} /> فتح الملف في كوكل شيت
          </a>

          <button
            onClick={loadData}
            disabled={loading || syncing}
            className="btn-clay btn-secondary"
            title="تحديث البيانات من كوكل شيت"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> تحديث
          </button>

          {gapStatus?.unuploaded_count && gapStatus.unuploaded_count > 0 ? (
            <button
              onClick={handleSyncUnuploaded}
              disabled={syncingUnuploaded || syncing}
              className="btn-clay btn-primary"
              style={{ fontWeight: 800, background: '#d97706', borderColor: '#b45309' }}
              title="رفع الفواتير غير المرفوعة فقط دون تكرار البقية"
            >
              <UploadCloud size={16} className={syncingUnuploaded ? 'animate-spin' : ''} />
              {syncingUnuploaded ? 'جارِ الرفع...' : `رفع غير المرفوعة (${gapStatus.unuploaded_count}) ⚡`}
            </button>
          ) : null}

          <button
            onClick={handleSyncAll}
            disabled={syncing || loading}
            className="btn-clay btn-primary"
            style={{ fontWeight: 800 }}
          >
            <UploadCloud size={18} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'جارِ المزامنة...' : 'مزامنة وتصدير جميع الفواتير الآن 🚀'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={20} style={{ color: '#059669' }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── لوحة مراقبة الفجوات والمزامنة (Zero Gap Dashboard) ── */}
      {gapStatus && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Database size={24} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 700 }}>فواتير النظام المسجلة</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gray-800)' }}>
                  {gapStatus.system_invoices_count} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>فاتورة</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileSpreadsheet size={24} style={{ color: '#10b981' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 700 }}>فواتير كوكل شيت</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
                  {gapStatus.sheet_unique_invoices_count} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>فاتورة ({gapStatus.sheet_rows_count} سطراً)</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: gapStatus.unuploaded_count > 0 ? '#fffbeb' : '#f0fdf4', borderColor: gapStatus.unuploaded_count > 0 ? '#fde68a' : '#bbf7d0' }}>
              <UploadCloud size={24} style={{ color: gapStatus.unuploaded_count > 0 ? '#d97706' : '#16a34a' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: gapStatus.unuploaded_count > 0 ? '#92400e' : '#15803d', fontWeight: 700 }}>فواتير غير مرفوعة (فجوة)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: gapStatus.unuploaded_count > 0 ? '#b45309' : '#16a34a' }}>
                  {gapStatus.unuploaded_count} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{gapStatus.unuploaded_count === 0 ? '✅ لا توجد فجوة' : 'معلقة'}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <DownloadCloud size={24} style={{ color: '#0284c7' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 700 }}>فواتير بالشيت غير مسجلة</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0369a1' }}>
                  {gapStatus.missing_in_system_count} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>فاتورة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert for unuploaded invoices */}
          {gapStatus.unuploaded_count > 0 && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 12,
              padding: '0.85rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <AlertTriangle size={22} style={{ color: '#d97706', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#92400e' }}>
                    تنبيه سد الفجوة: يوجد {gapStatus.unuploaded_count} فواتير مسجلة في النظام لم تُرفع إلى كوكل شيت بعد!
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#b45309' }}>
                    اضغط زر "رفع الفواتير غير المرفوعة فقط" لنقلها مباشرة إلى كوكل شيت دون تكرار الفواتير السابقة.
                  </div>
                </div>
              </div>
              <button
                onClick={handleSyncUnuploaded}
                disabled={syncingUnuploaded || syncing}
                className="btn-clay btn-primary"
                style={{ fontWeight: 800, background: '#d97706', borderColor: '#b45309', padding: '0.5rem 1.25rem' }}
              >
                <UploadCloud size={16} className={syncingUnuploaded ? 'animate-spin' : ''} />
                {syncingUnuploaded ? 'جارِ رفع الفجوة...' : `🚀 رفع الفواتير غير المرفوعة فقط (${gapStatus.unuploaded_count})`}
              </button>
            </div>
          )}

          {/* Alert for missing in system invoices */}
          {gapStatus.missing_in_system_count > 0 && (
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 12,
              padding: '0.85rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <DownloadCloud size={22} style={{ color: '#0284c7', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0369a1' }}>
                    فواتير في كوكل شيت غير مسجلة في المنصة: يوجد {gapStatus.missing_in_system_count} فواتير في الشيت.
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#0284c7' }}>
                    يمكنك استيرادها تلقائياً إلى قاعدة بيانات النظام بنقرة واحدة لسد الفجوة بالكامل.
                  </div>
                </div>
              </div>
              <button
                onClick={handleImportMissing}
                disabled={importingMissing || syncing}
                className="btn-clay btn-secondary"
                style={{ fontWeight: 800, padding: '0.5rem 1.25rem' }}
              >
                <DownloadCloud size={16} className={importingMissing ? 'animate-spin' : ''} />
                {importingMissing ? 'جارِ الاستيراد...' : `📥 استيراد إلى النظام (${gapStatus.missing_in_system_count})`}
              </button>
            </div>
          )}

          {/* Perfect Zero Gap confirmation */}
          {!gapStatus.has_gap && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '0.65rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#15803d',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
              <span>تطابق بنسبة 100% — كافة فواتير النظام مرفوعة في كوكل شيت، لا توجد أي فجوة بيانات (Zero Gap)!</span>
            </div>
          )}
        </div>
      )}

      {/* Top Cards: Settings & Instructions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>

        {/* Webhook Connection Card */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h5 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} style={{ color: 'var(--primary)' }} />
              رابط المزامنة التلقائية (Apps Script Webhook)
            </h5>
            <span className={`badge ${config?.is_connected ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: '0.75rem' }}>
              {config?.is_connected ? '🟢 متصل' : '⚪ غير مفعل'}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.85rem' }}>
            لإرسال الفواتير فوراً لكوكل شيت بشكل آلي بدون أي تدخل يدوي، ضع رابط الويب هوك الناتج من نشر Google Apps Script هنا:
          </p>

          <form onSubmit={handleSaveWebhook} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="url"
              className="clay-input"
              style={{ flex: '1 1 200px', fontSize: '0.82rem', direction: 'ltr' }}
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookInput}
              onChange={e => setWebhookInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={savingConfig}
              className="btn-clay btn-primary btn-sm"
              style={{ padding: '0.5rem 1rem', fontWeight: 700 }}
            >
              {savingConfig ? 'حفظ...' : 'حفظ الرابط'}
            </button>
          </form>

          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowCodeGuide(!showCodeGuide)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, padding: 0 }}
            >
              {showCodeGuide ? '▼ إخفاء خطوات الإعداد والكود' : '► كيف أحصل على هذا الرابط في دقيقة واحدة؟ (عرض الكود)'}
            </button>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h5 style={{ fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Table size={18} style={{ color: '#10b981' }} />
              إحصائيات بيانات كوكل شيت الحالية
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--gray-50)', padding: '0.6rem', borderRadius: 10 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', display: 'block' }}>عدد الأسطر</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gray-800)' }}>{rows.length}</span>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '0.6rem', borderRadius: 10 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', display: 'block' }}>إجمالي القطع</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>{totalPieces}</span>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '0.6rem', borderRadius: 10 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', display: 'block' }}>إجمالي البونص</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--warning)' }}>+{totalBonus}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--gray-600)', fontWeight: 700 }}>إجمالي مبيعات الشيت:</span>
            <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#059669' }}>
              {totalValue.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>د.ع</span>
            </span>
          </div>
        </div>

      </div>

      {/* Collapsible Apps Script Setup Guide */}
      {showCodeGuide && (
        <div className="card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h5 style={{ fontWeight: 800, margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              كود الربط التلقائي الجاهز (Google Apps Script)
            </h5>
            <button
              onClick={handleCopyCode}
              className="btn-clay btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              {copiedCode ? <Check size={14} style={{ color: '#059669' }} /> : <Copy size={14} />}
              {copiedCode ? 'تم النسخ بنجاح!' : 'نسخ الكود بالكامل'}
            </button>
          </div>

          <ol style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.9, paddingRight: '1.25rem', margin: '0 0 1rem 0' }}>
            <li>افتح جدول كوكل شيت من الزر بالأعلى، واضغط من القائمة: <strong>الإضافات (Extensions) ← تطبيقات البرمجة (Apps Script)</strong>.</li>
            <li>امسح أي كود موجود في المحرر بالكامل، والصق الكود المنسوخ بالكامل من المربع أدناه ثم اضغط <strong>حفظ (Save 💾)</strong>.</li>
            <li style={{ color: '#0369a1', fontWeight: 700 }}>
              💡 <strong>لإصلاح الجدول المتداخل فوراً:</strong> اختر من شريط الأدوات بالأعلى الدالة <code>testRun</code> ثم اضغط زر <strong>تشغيل (Run ▶)</strong>؛ سيقوم السكربت فوراً بحذف السطور التالفة وإعادة ضبط الأعمدة الـ 16 وإزالة أي تلوين.
            </li>
            <li>للتثبيت الدائم: اضغط في الأعلى <strong>نشر (Deploy) ← إدارة عمليات النشر (Manage deployments)</strong> ← اضغط على أيقونة القلم (تعديل Edit) ← اختر من الإصدار (Version): <strong>إصدار جديد (New version)</strong> ← اضغط <strong>نشر (Deploy)</strong>.</li>
            <li>سيبقى رابط الويب هوك نفسه يعمل بدون الحاجة لتغييره، وسيكون الجدول مضبوطاً ومحدثاً تلقائياً!</li>
          </ol>

          <pre style={{
            background: '#0f172a',
            color: '#38bdf8',
            padding: '1rem',
            borderRadius: 10,
            fontSize: '0.75rem',
            maxHeight: 220,
            overflowY: 'auto',
            direction: 'ltr',
            textAlign: 'left',
            fontFamily: 'Consolas, Monaco, monospace'
          }}>
            {config?.apps_script_code || '// جارِ تحميل الكود...'}
          </pre>
        </div>
      )}

      {/* Main Data Table */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontWeight: 800, margin: '0 0 0.25rem 0' }}>سجل البيانات الحية المسحوبة من كوكل شيت</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
              يتم عرض جميع الفواتير والمواد المسجلة في ملف Google Sheets
            </span>
          </div>

          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              type="text"
              className="clay-input"
              placeholder="بحث في فواتير كوكل شيت..."
              style={{ width: '100%', paddingRight: '2rem', fontSize: '0.82rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: 10 }} />
            <div style={{ fontWeight: 700, color: 'var(--gray-600)' }}>جارِ قراءة البيانات الحية من كوكل شيت...</div>
          </div>
        ) : filteredRows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--gray-50)', borderRadius: 12 }}>
            <FileSpreadsheet size={48} style={{ color: 'var(--gray-300)', marginBottom: 12 }} />
            <h5 style={{ fontWeight: 800, color: 'var(--gray-700)', marginBottom: 6 }}>لا توجد بيانات مسجلة في كوكل شيت حتى الآن</h5>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', maxWidth: 450, margin: '0 auto 1.25rem' }}>
              جدول كوكل شيت فارغ حالياً. اضغط على زر "مزامنة وتصدير جميع الفواتير" لإرسال فواتير النظام الحالية وتنسيق الجدول تلقائياً بالعناوين والألوان.
            </p>
            <button
              onClick={handleSyncAll}
              disabled={syncing}
              className="btn-clay btn-primary"
              style={{ fontWeight: 800 }}
            >
              <UploadCloud size={18} /> تصدير الفواتير الحالية إلى كوكل شيت الآن
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="clay-table" style={{ width: '100%', minWidth: 1200, fontSize: '0.82rem', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>#</th>
                  <th>رقم الفاتورة</th>
                  <th>التاريخ</th>
                  <th>المذخر</th>
                  <th>الصيدلية</th>
                  <th>المنطقة / المكان</th>
                  <th>المدينة</th>
                  <th>المادة الدوائية</th>
                  <th>نوع المادة</th>
                  <th style={{ textAlign: 'center' }}>الكمية</th>
                  <th style={{ textAlign: 'center' }}>سعر المفرد</th>
                  <th style={{ textAlign: 'center' }}>البونص</th>
                  <th style={{ textAlign: 'center' }}>المجموع</th>
                  <th>المندوب</th>
                  <th style={{ textAlign: 'center' }}>الحالة</th>
                  <th>وقت الإدراج</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => {
                  return (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {row.invoice_number}
                      </td>
                      <td style={{ color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{row.invoice_date}</td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.warehouse_name || 'مذخر أدوية'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--gray-800)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.pharmacy_name}</td>
                      <td style={{ whiteSpace: 'nowrap' }}><span className="badge badge-gray">{row.area || '—'}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}><span className="badge badge-gray">{row.city || 'بغداد'}</span></td>
                      <td style={{ fontWeight: 700, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.product_name}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {(() => {
                          const raw = String(row.dosage_form || '').trim();
                          const form = ['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(raw)
                            ? raw
                            : (raw.includes('drop') || raw.includes('قطر') ? 'قطرة' :
                               raw.includes('cream') || raw.includes('كريم') ? 'كريم' :
                               raw.includes('oint') || raw.includes('مرهم') ? 'مرهم' : 'حبوب');
                          const badge = getDosageFormBadgeColor(form);
                          return (
                            <span className="badge" style={{ fontSize: '0.72rem', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontWeight: 800 }}>
                              {form}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, whiteSpace: 'nowrap' }}>{row.quantity}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{(Number(row.unit_price) || 0).toLocaleString()} د.ع</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span className={`badge ${Number(row.bonus_quantity) > 0 ? 'badge-warning' : 'badge-gray'}`}>
                          +{row.bonus_quantity || 0}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {(Number(row.line_total) || 0).toLocaleString()} د.ع
                      </td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.rep_name || 'مندوب علمي'}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span className={`badge ${row.status === 'معتمدة ✓' || row.status === 'معتمدة' ? 'badge-success' : 'badge-warning'}`}>
                          {row.status || 'قيد التدقيق'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                        <Clock size={11} style={{ display: 'inline', marginLeft: 3 }} />
                        {row.timestamp || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

