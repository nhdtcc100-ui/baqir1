import React, { useState, useEffect, useMemo } from 'react';
import { api, getPendingSheetsOutbox, getCurrentUser } from '../services/api';
import {
  FileSpreadsheet, ExternalLink, RefreshCw, UploadCloud,
  CheckCircle2, AlertCircle, Copy, Check, Settings,
  Database, Table, Clock, ShieldCheck, Sparkles, Search,
  AlertTriangle, DownloadCloud, Trash2
} from 'lucide-react';
import { getDosageFormBadgeColor } from './BatchReviewTable';
import { analyzeSheetDuplicates, SheetDuplicateGroup } from '../utils/duplicateDetector';
import { APPS_SCRIPT_V2_CODE, APPS_SCRIPT_THIN_WRAPPER } from '../utils/appsScriptTemplate';

interface GoogleSheetsSyncProps {
  onDataChanged?: () => void;
}

export const GoogleSheetsSync: React.FC<GoogleSheetsSyncProps> = ({ onDataChanged }) => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [deletingDupKey, setDeletingDupKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
  const [outboxCount, setOutboxCount] = useState(() => getPendingSheetsOutbox().length);
  const [skippedNotices, setSkippedNotices] = useState<Array<{ id?: string; invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }>>([]);
  const [scriptOutdated, setScriptOutdated] = useState(false);
  const [repairingSheet, setRepairingSheet] = useState(false);
  const [syncingTemplate, setSyncingTemplate] = useState(false);
  const isAdmin = getCurrentUser()?.role === 'admin';

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
      await api.flushSheetsSyncOutbox({ keepalive: true }).catch(() => {});
      setOutboxCount(getPendingSheetsOutbox().length);
      setSkippedNotices(api.getPendingSkippedSheetDuplicates());
      const [dataRes, configRes, gapRes, scriptStatus] = await Promise.all([
        api.getSheetsData(),
        api.getSheetsConfig(),
        api.getSheetsGapStatus().catch(() => null),
        api.checkWebhookScriptStatus().catch(() => ({ scriptVersion: 0, isOutdated: false }))
      ]);
      setSheetData(dataRes);
      setConfig(configRes);
      setGapStatus(gapRes);
      setScriptOutdated(Boolean(scriptStatus?.isOutdated));
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
      if (Array.isArray(res.skipped_duplicates) && res.skipped_duplicates.length > 0) {
        api.addSkippedSheetDuplicateNotices(res.skipped_duplicates);
      }
      await loadData();
      onDataChanged?.();
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
      if (Array.isArray(res.skipped_duplicates) && res.skipped_duplicates.length > 0) {
        api.addSkippedSheetDuplicateNotices(res.skipped_duplicates);
      }
      await loadData();
      onDataChanged?.();
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
    const code = config?.apps_script_code && config.apps_script_code.includes('SCRIPT_VERSION')
      ? config.apps_script_code
      : APPS_SCRIPT_V2_CODE;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRepairSheet = async () => {
    setRepairingSheet(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.repairGoogleSheet();
      setSuccessMsg(res.message);
      await loadData();
    } catch (e: any) {
      setError(e?.message || 'تعذر تنفيذ الإصلاح التلقائي للشيت');
    } finally {
      setRepairingSheet(false);
    }
  };

  const handleSyncTemplateAll = async () => {
    setSyncingTemplate(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.adminSyncTemplateToAllSheets();
      setSuccessMsg(res.message || 'تمت مزامنة أوراق و Pivot Tables الأدمن مع جميع الشيتات بنجاح ✅');
      await loadData();
    } catch (e: any) {
      setError(e?.message || 'تعذر مزامنة أوراق و Pivot Tables الأدمن لجميع الشيتات');
    } finally {
      setSyncingTemplate(false);
    }
  };

  const rows = useMemo(() => {
    return (sheetData?.rows || []).filter(r => {
      const num = String(r.invoice_number || '').trim();
      const ph = String(r.pharmacy_name || '').trim();
      const prod = String(r.product_name || '').trim();
      return num !== '123' && (Boolean(num) || Boolean(ph) || Boolean(prod));
    });
  }, [sheetData]);

  const dynamicHeaders = useMemo(() => {
    const baseHeaders = sheetData?.headers && sheetData.headers.length > 0
      ? sheetData.headers
      : [
          'رقم الفاتورة', 'تاريخ الفاتورة', 'اسم المذخر', 'اسم الصيدلية',
          'المنطقة / المكان', 'المدينة / المحافظة', 'اسم المادة الدوائية',
          'نوع المادة / الشكل الدوائي', 'الكمية', 'سعر المفرد (د.ع)',
          'البونص المجاني', 'المجموع (د.ع)', 'صافي الفاتورة الكلي (د.ع)',
          'اسم المندوب العلمي', 'حالة الاعتماد', 'وقت وتاريخ الإدراج'
        ];
    return baseHeaders;
  }, [sheetData]);

  // رصد الصفوف المزاحة أو نقص/اختلاف ترتيب عمود "المنطقة / المكان" (E) قبل "المدينة / المحافظة" (F)
  const hasShiftedRows = useMemo(() => {
    const normHeaders = dynamicHeaders.map(h => String(h || '').trim());
    const areaIdx = normHeaders.findIndex(h => h.includes('المنطق') || h.includes('المكان'));
    const cityIdx = normHeaders.findIndex(h => h.includes('المدين') || h.includes('المحافظ'));
    const missingOrWrongOrderArea = areaIdx === -1 || (cityIdx >= 0 && cityIdx !== areaIdx + 1);
    const knownCities = new Set(['بغداد', 'البصرة', 'البصره', 'أربيل', 'اربيل', 'النجف', 'كربلاء', 'الموصل', 'نينوى', 'بابل', 'الحلة', 'الحله', 'كركوك', 'ديالى', 'الأنبار', 'الانبار', 'واسط', 'ذي قار', 'ميسان', 'المثنى', 'القادسية', 'القادسيه', 'الديوانية', 'الديوانيه', 'صلاح الدين', 'دهوك', 'السليمانية', 'السليمانيه']);
    const badRow = rows.some(r => {
      const prod = String(r.product_name || '').trim();
      const rep = String(r.rep_name || '').trim();
      const ts = String(r.timestamp || '').trim();
      const area = String(r.area || '').trim();
      const city = String(r.city || '').trim();
      const numericProd = /^\d+$/.test(prod);
      const areaLooksCity = area === 'بغداد' && city.length > 2 && numericProd;
      const swappedCityArea = knownCities.has(area) && (!city || !knownCities.has(city));
      const repLooksTs = !ts && rep.includes(':') && /\d/.test(rep);
      const cityContainsProduct = ['drop', 'cream', 'oint', 'قطرة', 'كريم', 'مرهم', 'elica', 'hyfresh'].some(k => city.toLowerCase().includes(k));
      return areaLooksCity || swappedCityArea || repLooksTs || cityContainsProduct;
    });
    return missingOrWrongOrderArea || badRow;
  }, [rows, dynamicHeaders]);

  // كشف الفواتير المكررة في الشيت بالشرط المركب الكامل (الصيدلية + التاريخ + عدد المنتجات + المنتجات وكمياتها معاً)
  const { duplicateGroups, duplicateRowIndices } = useMemo(() => analyzeSheetDuplicates(rows), [rows]);

  const handleDeleteDuplicateInvoice = async (grp: SheetDuplicateGroup) => {
    const proceed = window.confirm(
      `⚠️ حذف الفاتورة المكررة بالكامل (${grp.invoice_number})?\n\nسيتم حذف جميع أصناف ومكونات هذه النسخة المكررة (${grp.rowsCount} بنود) من الشيت والنظام دفعة واحدة وإرجاع الصف السليم للون الأبيض.`
    );
    if (!proceed) return;

    setDeletingDupKey(grp.key);
    setError(null);
    setSuccessMsg(null);
    try {
      await api.deleteDuplicateSheetInvoice({
        invoice_number: grp.invoice_number === 'بدون رقم' ? '' : grp.invoice_number,
        pharmacy_name: grp.pharmacy_name,
        invoice_date: grp.invoice_date,
        timestamp: grp.timestamp
      });
      setSuccessMsg(`تم إرسال أمر حذف الفاتورة المكررة بالكامل (${grp.invoice_number} — ${grp.rowsCount} بنود) وإعادة الصف السليم للون الأبيض ✅`);
      await loadData();
      onDataChanged?.();
    } catch (e: any) {
      setError(e?.message || 'تعذر حذف الفاتورة المكررة');
    } finally {
      setDeletingDupKey(null);
    }
  };

  const rowsWithIndex = useMemo(() => rows.map((row, rowIndex) => ({ row, rowIndex })), [rows]);

  const filteredRowsWithIndex = rowsWithIndex.filter(({ row: r }) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    const cellMatch = Array.isArray(r.cells) && r.cells.some((c: any) => String(c || '').toLowerCase().includes(s));
    return (
      cellMatch ||
      (r.invoice_number && String(r.invoice_number).toLowerCase().includes(s)) ||
      (r.pharmacy_name && String(r.pharmacy_name).toLowerCase().includes(s)) ||
      (r.product_name && String(r.product_name).toLowerCase().includes(s)) ||
      (r.warehouse_name && String(r.warehouse_name).toLowerCase().includes(s)) ||
      (r.rep_name && String(r.rep_name).toLowerCase().includes(s)) ||
      (r.area && String(r.area).toLowerCase().includes(s)) ||
      (r.dosage_form && String(r.dosage_form).toLowerCase().includes(s))
    );
  });
  const filteredRows = filteredRowsWithIndex.map(x => x.row);

  const totalValue = filteredRows.reduce((sum, r) => sum + (Number(r.line_total) || 0), 0);
  const totalPieces = filteredRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  const totalBonus = filteredRows.reduce((sum, r) => sum + (Number(r.bonus_quantity) || 0), 0);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Database size={13} /> كوكل شيت كقاعدة بيانات حية
            </span>
            <span className={`badge ${config?.is_connected ? 'badge-primary' : 'badge-warning'}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} /> {config?.is_connected ? 'مزامنة تلقائية فورية مفعلة' : 'قراءة عامة نشطة'}
            </span>
            {outboxCount > 0 && (
              <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 800 }}>
                ⏳ {outboxCount} تحديثات بانتظار المزامنة
              </span>
            )}
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileSpreadsheet size={28} style={{ color: '#10b981' }} />
            إدارة ومزامنة كوكل شيت (Google Sheets)
          </h1>
          <p className="page-subtitle">
            عرض جميع الأعمدة والبيانات الحية بمقاس تلقائي (Fit to Row / Fit to Column) مع مزامنة مستمرة لكل تعديل أو اعتماد أو حذف.
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
            >
              <UploadCloud size={16} className={syncingUnuploaded ? 'animate-spin' : ''} />
              {syncingUnuploaded ? 'جارِ الرفع...' : `رفع غير المرفوعة (${gapStatus.unuploaded_count}) ⚡`}
            </button>
          ) : null}

          {isAdmin && (
            <button
              onClick={handleSyncTemplateAll}
              disabled={syncingTemplate || syncing}
              className="btn-clay btn-secondary"
              style={{ fontWeight: 800, background: '#ecfeff', color: '#0e7490', borderColor: '#a5f3fc' }}
              title="استنساخ تبويبات و Pivot Tables شيت الأدمن لجميع شيتات المندوبين"
            >
              <RefreshCw size={16} className={syncingTemplate ? 'animate-spin' : ''} />
              {syncingTemplate ? 'جارِ تعميم Pivot Tables...' : '🔄 مزامنة أوراق و Pivot Tables الأدمن للجميع'}
            </button>
          )}

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

      {(scriptOutdated || hasShiftedRows) && (
        <div className="card" style={{ background: '#fef2f2', border: '2px solid #ef4444', padding: '1rem 1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b', fontWeight: 900, fontSize: '0.96rem', marginBottom: 4 }}>
                <AlertTriangle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
                <span>تنبيه هام: يلزم تحديث كود Google Apps Script إلى الإصدار 9 (v9) لتوحيد الأعمدة و Pivot Tables</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: 1.65 }}>
                لضمان توحيد العمود <strong>E = المنطقة / المكان</strong> قبل العمود <strong>F = المدينة / المحافظة</strong> وتعميم أوراق و Pivot Tables الأدمن تلقائياً: انسخ الكود الجديد (v9) ← الصقه في <strong>Extensions ← Apps Script</strong> (شيت الأدمن المركزي) ← <strong>Deploy ← Manage deployments ← Edit ← New version ← Deploy</strong> ثم اضغط «إصلاح الأعمدة وتلوين الشيت الآن».
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { handleCopyCode(); setShowCodeGuide(true); }}
                className="btn-clay btn-primary btn-sm"
                style={{ fontWeight: 800, background: '#dc2626', borderColor: '#b91c1c' }}
              >
                {copiedCode ? <Check size={15} /> : <Copy size={15} />}
                {copiedCode ? 'تم نسخ كود v9!' : 'نسخ كود Apps Script v9 📋'}
              </button>
              <button
                type="button"
                onClick={handleRepairSheet}
                disabled={repairingSheet}
                className="btn-clay btn-secondary btn-sm"
                style={{ fontWeight: 800 }}
              >
                <RefreshCw size={15} className={repairingSheet ? 'animate-spin' : ''} />
                {repairingSheet ? 'جارِ الإصلاح...' : 'إصلاح الأعمدة وتلوين الشيت الآن 🛠️'}
              </button>
            </div>
          </div>
        </div>
      )}

      {skippedNotices.length > 0 && (
        <div className="card" style={{ background: '#fffbeb', border: '1.5px solid #f59e0b', padding: '0.95rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e', fontWeight: 900, fontSize: '0.92rem' }}>
              <AlertTriangle size={19} style={{ color: '#d97706', flexShrink: 0 }} />
              <span>تنبيه: تم تخطي رفع ({skippedNotices.length}) فواتير مكررة موجودة مسبقاً في كوكل شيت (لم يُعد رفعها)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                api.clearSkippedSheetDuplicateNotices();
                setSkippedNotices([]);
              }}
              className="btn-clay btn-secondary btn-sm"
              style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
            >
              إخفاء التنبيه
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {skippedNotices.map((n, idx) => (
              <div key={n.id || idx} style={{ fontSize: '0.8rem', color: '#78350f', background: 'rgba(255,255,255,0.75)', padding: '0.45rem 0.7rem', borderRadius: 8, border: '1px solid #fde68a' }}>
                • فاتورة رقم <strong>{n.invoice_number || 'بدون رقم'}</strong> — <strong>{n.pharmacy_name || 'صيدلية'}</strong> ({n.invoice_date || '—'}): {n.reason}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duplicate invoices in Google Sheets — 1-click full invoice delete */}
      {duplicateGroups.length > 0 && (
        <div className="card" style={{ background: '#fef2f2', border: '1.5px solid #f87171', padding: '1rem 1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.75rem', color: '#991b1b', fontWeight: 900 }}>
            <AlertTriangle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
            <span>تم رصد ({duplicateGroups.length}) نسخ مكررة في سجل كوكل شيت — احذف الفاتورة المكررة بالكامل بضغطة واحدة:</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {duplicateGroups.map(grp => (
              <div
                key={grp.key}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fecaca',
                  borderRadius: 12,
                  padding: '0.75rem 0.95rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.65rem'
                }}
              >
                <div style={{ minWidth: 0, flex: '1 1 220px' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#991b1b' }}>
                    ⚠️ فاتورة مكررة #{grp.invoice_number} — {grp.pharmacy_name || 'صيدلية'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 2, lineHeight: 1.45 }}>
                    التاريخ: <strong>{grp.invoice_date || '—'}</strong> • عدد المواد: <strong>{grp.rowsCount}</strong> • الإجمالي: <strong>{grp.totalAmount.toLocaleString()} د.ع</strong>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                    المكونات: {grp.productsSummary}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteDuplicateInvoice(grp)}
                  disabled={deletingDupKey === grp.key}
                  className="btn-clay btn-danger btn-sm"
                  style={{ background: '#dc2626', color: 'white', fontWeight: 800, padding: '0.55rem 0.95rem', width: 'auto' }}
                >
                  <Trash2 size={15} />
                  {deletingDupKey === grp.key ? 'جارِ الحذف...' : `حذف الفاتورة المكررة بالكامل (${grp.rowsCount} أصناف)`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zero Gap Dashboard */}
      {gapStatus && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                    فواتير في كوكل شيت غير مسجلة في المنصة: يوجد {gapStatus.missing_in_system_count} فواتير.
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
        </div>
      )}

      {/* Top Cards: Settings & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
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

          <div style={{ marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setShowCodeGuide(!showCodeGuide)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, padding: 0 }}
            >
              {showCodeGuide ? '▼ إخفاء كود Apps Script المحدّث' : '► عرض كود Apps Script المحدّث (لتفعيل الحذف والتعديل الكامل في الشيت)'}
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h5 style={{ fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Table size={18} style={{ color: '#10b981' }} />
              إحصائيات بيانات كوكل شيت ({dynamicHeaders.length} أعمدة)
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

      {showCodeGuide && (
        <div className="card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h5 style={{ fontWeight: 800, margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              كود الربط التلقائي المحدّث (يدعم الاستبدال والحذف والاعتماد وملاءمة الأعمدة)
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
          <ol style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.85, paddingRight: '1.25rem', margin: '0 0 1rem 0' }}>
            <li>من كوكل شيت افتح <strong>Extensions ← Apps Script</strong> والصق الكود ثم اضغط حفظ.</li>
            <li>لتحديث النشر دون تغيير الرابط: <strong>Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy</strong>.</li>
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
            {config?.apps_script_code && config.apps_script_code.includes('SCRIPT_VERSION') ? config.apps_script_code : APPS_SCRIPT_V2_CODE}
          </pre>
          <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: 6 }}>
              كود الغلاف المختصر لشيتات المندوبين (4 أسطر فقط عند ربط مشروع الأدمن كـ Library باسم AdminLib في وضع HEAD):
            </div>
            <pre style={{
              background: '#1e293b',
              color: '#a7f3d0',
              padding: '0.75rem',
              borderRadius: 8,
              fontSize: '0.73rem',
              direction: 'ltr',
              textAlign: 'left',
              margin: 0
            }}>
              {APPS_SCRIPT_THIN_WRAPPER}
            </pre>
          </div>
        </div>
      )}

      {/* Main Live Data Table — ALL Columns, Fit to Column & Fit to Row */}
      <div className="card" style={{ padding: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontWeight: 800, margin: '0 0 0.25rem 0' }}>
              سجل البيانات الحية المسحوبة من كوكل شيت ({filteredRows.length} سطر • {dynamicHeaders.length} عمود)
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
              عرض كامل لجميع الأعمدة والصفوف بدون قص النصوص (Fit to Row & Fit to Column) — اسحب أفقياً لرؤية جميع الأعمدة.
            </span>
          </div>

          <div style={{ position: 'relative', width: 'min(100%, 280px)' }}>
            <Search size={16} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              type="text"
              className="clay-input"
              placeholder="بحث في كافة أعمدة كوكل شيت..."
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
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
            <table
              className="clay-table"
              style={{
                width: 'max-content',
                minWidth: '100%',
                tableLayout: 'auto',
                fontSize: '0.82rem',
                margin: 0
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', whiteSpace: 'nowrap', padding: '0.65rem 0.75rem' }}>#</th>
                  {dynamicHeaders.map((h, hIdx) => (
                    <th key={hIdx} style={{ whiteSpace: 'nowrap', padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                      {h || `عمود ${hIdx + 1}`}
                    </th>
                  ))}
                  {duplicateGroups.length > 0 && (
                    <th style={{ whiteSpace: 'nowrap', padding: '0.65rem 0.85rem', textAlign: 'center' }}>إجراء التكرار</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRowsWithIndex.map(({ row, rowIndex }, idx) => {
                  const isDupRow = duplicateRowIndices.has(rowIndex);
                  const matchingDupGroup = duplicateGroups.find(g => g.rowIndices.includes(rowIndex));

                  return (
                    <tr
                      key={rowIndex}
                      style={{
                        height: 'auto',
                        background: isDupRow ? '#fee2e2' : '#ffffff',
                        color: isDupRow ? '#991b1b' : '#0f172a'
                      }}
                    >
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--gray-500)', whiteSpace: 'nowrap', verticalAlign: 'middle', padding: '0.6rem 0.75rem' }}>
                        {idx + 1}
                      </td>
                      {dynamicHeaders.map((headerLabel, cIdx) => {
                        const normLabel = String(headerLabel || '').toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
                        const cellVal = Array.isArray(row.cells) && row.cells[cIdx] !== undefined
                          ? String(row.cells[cIdx])
                          : (() => {
                              if (normLabel.includes('رقم الفاتور')) return String(row.invoice_number ?? '');
                              if (normLabel.includes('تاريخ الفاتور')) return String(row.invoice_date ?? '');
                              if (normLabel.includes('المذخر')) return String(row.warehouse_name ?? '');
                              if (normLabel.includes('اسم الصيدلي')) return String(row.pharmacy_name ?? '');
                              if (normLabel.includes('المدين') || normLabel.includes('المحافظ')) return String(row.city ?? '');
                              if (normLabel.includes('المنطق') || normLabel.includes('المكان')) return String(row.area ?? '');
                              if (normLabel.includes('اسم الماد') || normLabel.includes('الماده الدوائي')) return String(row.product_name ?? '');
                              if (normLabel.includes('نوع الماد') || normLabel.includes('الشكل الدوائي')) return String(row.dosage_form ?? '');
                              if (normLabel.includes('الكمي')) return String(row.quantity ?? '');
                              if (normLabel.includes('سعر المفرد')) return String(row.unit_price ?? '');
                              if (normLabel.includes('البونص')) return String(row.bonus_quantity ?? '');
                              if (normLabel.includes('صافي الفاتور')) return String(row.total_invoice ?? '');
                              if (normLabel.includes('المجموع')) return String(row.line_total ?? '');
                              if (normLabel.includes('المندوب')) return String(row.rep_name ?? '');
                              if (normLabel.includes('حاله الاعتماد') || normLabel.includes('الحال')) return String(row.status ?? '');
                              if (normLabel.includes('وقت وتاريخ') || normLabel.includes('الادراج')) return String(row.timestamp ?? '');
                              return '';
                            })();

                        if (normLabel.includes('رقم الفاتور') || (!normLabel && cIdx === 0)) {
                          return (
                            <td key={cIdx} style={{ fontWeight: 800, color: isDupRow ? '#b91c1c' : 'var(--primary)', whiteSpace: 'nowrap', verticalAlign: 'middle', padding: '0.6rem 0.85rem' }}>
                              {cellVal || '—'}
                            </td>
                          );
                        }
                        if (normLabel.includes('نوع الماد') || normLabel.includes('الشكل الدوائي')) {
                          const raw = cellVal.trim();
                          const form = ['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(raw)
                            ? raw
                            : (raw.includes('drop') || raw.includes('قطر') ? 'قطرة' :
                               raw.includes('cream') || raw.includes('كريم') ? 'كريم' :
                               raw.includes('oint') || raw.includes('مرهم') ? 'مرهم' : 'حبوب');
                          const badge = getDosageFormBadgeColor(form);
                          return (
                            <td key={cIdx} style={{ whiteSpace: 'nowrap', textAlign: 'center', verticalAlign: 'middle', padding: '0.6rem 0.85rem' }}>
                              <span className="badge" style={{ fontSize: '0.74rem', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontWeight: 800 }}>
                                {form}
                              </span>
                            </td>
                          );
                        }
                        if (normLabel.includes('سعر المفرد') || normLabel.includes('المجموع') || normLabel.includes('صافي الفاتور')) {
                          const isTotal = normLabel.includes('المجموع') || normLabel.includes('صافي الفاتور');
                          const n = Number(String(cellVal).replace(/[^\d.-]/g, ''));
                          return (
                            <td key={cIdx} style={{ whiteSpace: 'nowrap', textAlign: 'center', fontWeight: isTotal ? 800 : 600, color: normLabel.includes('المجموع') ? 'var(--primary)' : undefined, verticalAlign: 'middle', padding: '0.6rem 0.85rem' }}>
                              {cellVal ? (isNaN(n) ? cellVal : `${n.toLocaleString()} د.ع`) : '—'}
                            </td>
                          );
                        }
                        if (normLabel.includes('حاله الاعتماد') || normLabel.includes('الحال')) {
                          return (
                            <td key={cIdx} style={{ whiteSpace: 'nowrap', textAlign: 'center', verticalAlign: 'middle', padding: '0.6rem 0.85rem' }}>
                              <span className={`badge ${cellVal.includes('معتمدة') ? 'badge-success' : cellVal.includes('مرفوضة') ? 'badge-danger' : 'badge-warning'}`}>
                                {cellVal || 'قيد التدقيق'}
                              </span>
                            </td>
                          );
                        }
                        const isTs = normLabel.includes('وقت وتاريخ') || normLabel.includes('الادراج');
                        const isQtyOrBonus = normLabel.includes('الكمي') || normLabel.includes('البونص');
                        const isBold = normLabel.includes('اسم الصيدلي') || normLabel.includes('اسم الماد') || normLabel.includes('المنطق');
                        const isWrapCol = normLabel.includes('المذخر') || normLabel.includes('اسم الصيدلي') || normLabel.includes('اسم الماد') || normLabel.includes('المندوب') || cIdx >= 16;
                        return (
                          <td
                            key={cIdx}
                            style={{
                              whiteSpace: isWrapCol ? 'normal' : 'nowrap',
                              wordBreak: isWrapCol ? 'break-word' : undefined,
                              minWidth: isWrapCol ? 150 : undefined,
                              maxWidth: isWrapCol ? 280 : undefined,
                              lineHeight: 1.45,
                              verticalAlign: 'middle',
                              textAlign: isQtyOrBonus ? 'center' : undefined,
                              fontWeight: isBold ? 700 : undefined,
                              padding: '0.6rem 0.85rem'
                            }}
                          >
                            {isTs ? (
                              <span style={{ fontSize: '0.76rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                                <Clock size={11} style={{ display: 'inline', marginLeft: 3 }} />
                                {cellVal || '—'}
                              </span>
                            ) : (cellVal || '—')}
                          </td>
                        );
                      })}
                      {duplicateGroups.length > 0 && (
                        <td style={{ whiteSpace: 'nowrap', textAlign: 'center', verticalAlign: 'middle', padding: '0.6rem 0.85rem' }}>
                          {matchingDupGroup ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteDuplicateInvoice(matchingDupGroup)}
                              disabled={deletingDupKey === matchingDupGroup.key}
                              className="btn-clay btn-danger btn-sm"
                              style={{ background: '#dc2626', color: 'white', fontWeight: 800, padding: '0.3rem 0.65rem', fontSize: '0.74rem' }}
                            >
                              <Trash2 size={13} /> حذف الفاتورة المكررة ({matchingDupGroup.rowsCount})
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>—</span>
                          )}
                        </td>
                      )}
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
