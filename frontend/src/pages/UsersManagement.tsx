import React, { useState, useEffect } from 'react';
import { api, getAdminWebhookUrl, setAdminWebhookUrl } from '../services/api';
import { FloatingModal } from '../components/FloatingModal';
import { AdminSheetUser, ADMIN_SHEET_URL, DEFAULT_APPS_SCRIPT_URL, DEFAULT_INVOICE_SHEET_ID, extractGoogleSheetId, isBaqerAdmin, extractSharedGeminiKey } from '../utils/adminUsersSheet';
import { APPS_SCRIPT_V2_CODE, APPS_SCRIPT_THIN_WRAPPER } from '../utils/appsScriptTemplate';
import { DownloadSheetButtons } from '../components/DownloadSheetButtons';
import {
  Users, Plus, RefreshCw, ExternalLink, ShieldCheck,
  AlertCircle, CheckCircle2, Copy, Check, FileSpreadsheet,
  Edit3, Trash2, Eye, EyeOff, Settings, Sparkles, AlertTriangle, KeyRound
} from 'lucide-react';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminSheetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [revealedRows, setRevealedRows] = useState<Record<number, boolean>>({});
  const [adminWebhookInput, setAdminWebhookInput] = useState(() => getAdminWebhookUrl());
  const [webhookSavedMsg, setWebhookSavedMsg] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [adminScriptOutdated, setAdminScriptOutdated] = useState(false);
  const [liveScriptVersion, setLiveScriptVersion] = useState<number | null>(null);

  // Shared Gemini API Key (Col E: اي بي اي جمناي)
  const [sharedGeminiKeyInput, setSharedGeminiKeyInput] = useState('');
  const [showSharedGeminiKey, setShowSharedGeminiKey] = useState(false);
  const [savingGeminiKey, setSavingGeminiKey] = useState(false);
  const [syncingTemplates, setSyncingTemplates] = useState(false);
  const [templateSyncResults, setTemplateSyncResults] = useState<Array<{ repName: string; sheetId: string; sheetName?: string; ok: boolean; tabsCount: number; pivotsCount: number; tabNames?: string[]; errorDetails?: string }>>([]);
  const [unifyingWebhook, setUnifyingWebhook] = useState(false);
  const [copiedThinWrapper, setCopiedThinWrapper] = useState(false);

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addSheetUrl, setAddSheetUrl] = useState('');
  const [addWebhookUrl, setAddWebhookUrl] = useState('');
  const [addGeminiKey, setAddGeminiKey] = useState('');

  // Edit Modal
  const [editingUser, setEditingUser] = useState<AdminSheetUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editSheetUrl, setEditSheetUrl] = useState('');
  const [editWebhookUrl, setEditWebhookUrl] = useState('');
  const [editGeminiKey, setEditGeminiKey] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getAdminUsersFromSheet();
      setUsers(list);
      const baqerRow = list.find(u => u.role === 'admin' && u.webhook_url && u.webhook_url.startsWith('http'));
      const curHook = getAdminWebhookUrl();
      if (baqerRow?.webhook_url && (!curHook || curHook.includes('AKfycbyxEXPVY7gl'))) {
        setAdminWebhookUrl(baqerRow.webhook_url);
        setAdminWebhookInput(baqerRow.webhook_url);
      }
      const verStatus = await api.checkAdminWebhookVersion().catch(() => ({ scriptVersion: 0, isOutdated: false }));
      const foundSharedKey = extractSharedGeminiKey(list);
      if (foundSharedKey) {
        setSharedGeminiKeyInput(foundSharedKey);
      }
      setLiveScriptVersion(verStatus?.scriptVersion ? verStatus.scriptVersion : null);
      setAdminScriptOutdated(Boolean(verStatus?.isOutdated));
    } catch (e: any) {
      setError(e?.message || 'تعذر قراءة الشيت الرئيسي للمستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSharedGeminiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeminiKey(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.adminSetSharedGeminiKey(sharedGeminiKeyInput.trim());
      setSuccessMsg(res.message);
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'تعذر حفظ مفتاح Gemini الموحد في الشيت الرئيسي');
    } finally {
      setSavingGeminiKey(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRevealPwd = (rowNum: number) => {
    setRevealedRows(prev => ({ ...prev, [rowNum]: !prev[rowNum] }));
  };

  const handleSaveAdminWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminWebhookUrl(adminWebhookInput);
    setWebhookSavedMsg(true);
    setTimeout(() => setWebhookSavedMsg(false), 2500);
    loadUsers();
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_V2_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyThinWrapper = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_THIN_WRAPPER);
    setCopiedThinWrapper(true);
    setTimeout(() => setCopiedThinWrapper(false), 2500);
  };

  const handleSyncTemplatesToAll = async (mode: 'full' | 'tabs_only' = 'full') => {
    setSyncingTemplates(true);
    setError(null);
    setSuccessMsg(null);
    setTemplateSyncResults([]);
    try {
      const verStatus = await api.checkAdminWebhookVersion().catch(() => ({ scriptVersion: 0, isOutdated: false }));
      if (verStatus.scriptVersion > 0 && verStatus.scriptVersion < 10) {
        setLiveScriptVersion(verStatus.scriptVersion);
        setAdminScriptOutdated(true);
        setShowScriptCode(true);
        throw new Error(
          `السكربت المنشور حالياً على شيت الأدمن هو الإصدار (v${verStatus.scriptVersion}) ولا يدعم استنساخ الأوراق و Pivot Tables. انسخ كود v10 أدناه ثم Apps Script ← Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy ثم أعد المحاولة.`
        );
      }

      const repTargets = users.filter(u => {
        const sid = extractGoogleSheetId(u.sheet_url || u.sheet_id);
        return sid && sid !== DEFAULT_INVOICE_SHEET_ID;
      });

      if (repTargets.length === 0) {
        const res = await api.adminSyncTemplateToAllSheets({ mode });
        setSuccessMsg(res.message || 'تمت مزامنة أوراق و Pivot Tables شيت الأدمن لجميع الشيتات بنجاح ✅');
        await loadUsers();
        return;
      }

      const collected: Array<{ repName: string; sheetId: string; sheetName?: string; ok: boolean; tabsCount: number; pivotsCount: number; tabNames?: string[]; errorDetails?: string }> = [];
      let okCount = 0;

      for (const rep of repTargets) {
        const repSid = extractGoogleSheetId(rep.sheet_url || rep.sheet_id);
        try {
          const singleRes = await api.adminSyncTemplateToAllSheets({ targetSpreadsheetId: repSid, mode });
          const rItem = Array.isArray(singleRes.results) && singleRes.results[0] ? singleRes.results[0] : null;
          const ok = rItem ? Boolean(rItem.ok) : Number(singleRes.updatedSheets || 0) > 0;
          if (ok) okCount++;
          collected.push({
            repName: rep.full_name,
            sheetId: repSid,
            sheetName: rItem?.sheetName || '',
            ok,
            tabsCount: Number(rItem?.tabsCount || 0),
            pivotsCount: Number(rItem?.pivotsCount || 0),
            tabNames: rItem?.tabNames || [],
            errorDetails: rItem?.errorDetails || rItem?.error || ''
          });
        } catch (repErr: any) {
          collected.push({
            repName: rep.full_name,
            sheetId: repSid,
            ok: false,
            tabsCount: 0,
            pivotsCount: 0,
            errorDetails: repErr?.message || 'تعذرت مزامنة شيت المندوب'
          });
        }
        setTemplateSyncResults([...collected]);
      }

      if (okCount === repTargets.length) {
        setSuccessMsg(`تمت مزامنة أوراق و Pivot Tables الأدمن مع (${okCount} / ${repTargets.length}) شيتات للمندوبين — كل شيت يقرأ بياناته الخاصة بنجاح ✅`);
      } else if (okCount > 0) {
        setSuccessMsg(`تمت مزامنة (${okCount} / ${repTargets.length}) شيتات، وبعض الشيتات تحتاج التحقق من صلاحية التعديل (Editor). راجع التفاصيل أدناه.`);
      } else {
        setError('لم تتم مزامنة أي شيت — تحقق من تفاصيل الأخطاء أدناه وتأكد من مشاركة شيتات المندوبين بصلاحية محرر (Editor) مع حساب باقر.');
      }
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'تعذر مزامنة أوراق و Pivot Tables الأدمن لجميع الشيتات');
    } finally {
      setSyncingTemplates(false);
    }
  };

  const handleUnifyWebhookAll = async () => {
    const centralUrl = adminWebhookInput.trim() || DEFAULT_APPS_SCRIPT_URL;
    const confirmed = window.confirm(
      `⚡ توحيد السكربت المركزي للجميع:\n\nسيتم كتابة رابط سكربت الأدمن المركزي التالي في عمود (D: اي بي اي سكربت) لجميع الحسابات في الشيت الرئيسي لكي ينعكس أي تعديل تقومي به عند الأدمن على الجميع فوراً:\n\n${centralUrl}\n\nهل تريد المتابعة؟`
    );
    if (!confirmed) return;
    setUnifyingWebhook(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.adminUnifyWebhookUrl(centralUrl, 'set');
      setSuccessMsg(res.message || 'تم توحيد رابط سكربت الأدمن المركزي لجميع الحسابات بنجاح ⚡');
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'تعذر توحيد رابط السكربت المركزي لجميع المستخدمين');
    } finally {
      setUnifyingWebhook(false);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addPassword.trim()) {
      setError('الاسم والرمز السري مطلوبان');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.adminAddSheetUser({
        full_name: addName.trim(),
        password: addPassword.trim(),
        sheet_url: addSheetUrl.trim(),
        webhook_url: addWebhookUrl.trim(),
        gemini_api_key: addGeminiKey.trim() || sharedGeminiKeyInput.trim()
      });
      setSuccessMsg(res.message);
      setShowAddModal(false);
      setAddName('');
      setAddPassword('');
      setAddSheetUrl('');
      setAddWebhookUrl('');
      setAddGeminiKey('');
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'تعذر إضافة المستخدم للشيت الرئيسي');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (u: AdminSheetUser) => {
    setEditingUser(u);
    setEditName(u.full_name || '');
    setEditPassword(u.password_hash || '');
    setEditSheetUrl(u.sheet_url || u.sheet_id || '');
    setEditWebhookUrl(u.webhook_url || '');
    setEditGeminiKey(u.gemini_api_key || '');
    setError(null);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editName.trim() || !editPassword.trim()) {
      setError('لا يمكن ترك الاسم أو الرمز السري فارغاً');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.adminUpdateSheetUser({
        rowNumber: editingUser.rowNumber,
        currentName: editingUser.full_name,
        newName: editName.trim(),
        newPassword: editPassword.trim(),
        newSheetUrl: editSheetUrl.trim(),
        newWebhookUrl: editWebhookUrl.trim(),
        newGeminiApiKey: editGeminiKey.trim()
      });
      setSuccessMsg(res.message);
      setEditingUser(null);
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'تعذر تعديل السجل في الشيت الرئيسي');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (u: AdminSheetUser) => {
    if (isBaqerAdmin(u.full_name, u.email)) {
      setError('لا يمكن حذف حساب الأدمن الرئيسي (باقر)');
      return;
    }
    const ok = window.confirm(`⚠️ هل تريد حذف المستخدم "${u.full_name}" (الصف ${u.rowNumber}) من الشيت الرئيسي؟`);
    if (!ok) return;

    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.adminDeleteSheetUser({
        rowNumber: u.rowNumber,
        currentName: u.full_name
      });
      setSuccessMsg(res.message);
      await loadUsers();
    } catch (e: any) {
      setError(e?.message || 'تعذر حذف المستخدم');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FileSpreadsheet size={13} /> الشيت الرئيسي — صلاحيات الأدمن فقط
            </span>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} /> تحكم كامل بالإضافة والتعديل والحذف
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={28} style={{ color: 'var(--primary)' }} />
            إدارة الشيت الرئيسي وقاعدة بيانات المستخدمين
          </h1>
          <p className="page-subtitle">
            فقط حساب باقر يملك صلاحية التلاعب أو تعديل الشيت الرئيسي؛ يدخل كل مستخدم آخر كمندوب إلى صفحة كوكل شيت الخاصة به.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a
            href={ADMIN_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-clay btn-secondary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <ExternalLink size={16} /> فتح الشيت الرئيسي في كوكل
          </a>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="btn-clay btn-secondary"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> تحديث
          </button>

          <button
            onClick={() => { setShowAddModal(true); setError(null); }}
            className="btn-clay btn-primary"
            style={{ fontWeight: 800 }}
          >
            <Plus size={18} /> إضافة مستخدم للشيت الرئيسي
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

      {adminScriptOutdated && (
        <div className="card" style={{ background: '#fffbeb', border: '1.5px solid #f59e0b', padding: '1rem 1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ fontWeight: 900, color: '#92400e', fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={18} style={{ color: '#d97706' }} />
                ترقية سكربت الأدمن المركزي إلى الإصدار 10 (v10){liveScriptVersion ? ` — النسخة الحية الآن: v${liveScriptVersion}` : ''}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: 4, lineHeight: 1.55 }}>
                الإصدار <strong>v10</strong> مطلوب لتفعيل استنساخ أوراق و Pivot Tables الأدمن لجميع المندوبين (ببيانات كل مندوب الخاصة) وتوحيد عمود D. عند النشر في Google Apps Script تأكد من اختيار: <strong>Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy</strong>.
              </div>
            </div>
            <button
              type="button"
              onClick={() => { handleCopyScript(); setShowScriptCode(true); }}
              className="btn-clay btn-primary btn-sm"
              style={{ fontWeight: 800, background: '#d97706', borderColor: '#b45309' }}
            >
              {copiedScript ? <Check size={15} /> : <Copy size={15} />}
              {copiedScript ? 'تم نسخ كود v10!' : 'نسخ كود Apps Script v10'}
            </button>
          </div>
        </div>
      )}

      {/* بطاقة مركزية السكربت وتعميم أوراق و Pivot Tables الأدمن */}
      <div className="card" style={{ padding: '1.1rem 1.2rem', border: '1.5px solid #bae6fd', background: 'linear-gradient(135deg, #f8fafc, #ecfeff)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ flex: '1 1 280px' }}>
            <h4 style={{ fontWeight: 800, margin: '0 0 0.25rem 0', color: '#0c4a6e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: '#0284c7' }} />
              توحيد القوالب (Pivot Tables) والسكربت المركزي لجميع الشيتات (v10)
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#0369a1', margin: 0, lineHeight: 1.55 }}>
              أي ورقة أو Pivot Table تعدّه في شيت الأدمن يمكنك استنساخه لجميع المندوبين بضغطة واحدة بحيث يقرأ كل Pivot Table من <strong>فواتير ذلك المندوب فقط</strong> دون خلط البيانات.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleSyncTemplatesToAll('full')}
              disabled={syncingTemplates || saving}
              className="btn-clay btn-primary btn-sm"
              style={{ fontWeight: 800, background: '#0284c7', borderColor: '#0369a1' }}
            >
              <RefreshCw size={15} className={syncingTemplates ? 'animate-spin' : ''} />
              {syncingTemplates ? 'جارِ مزامنة القوالب...' : '🔄 استنساخ أوراق و Pivot Tables الأدمن للجميع'}
            </button>
            <button
              type="button"
              onClick={() => handleSyncTemplatesToAll('tabs_only')}
              disabled={syncingTemplates || saving}
              className="btn-clay btn-secondary btn-sm"
              style={{ fontWeight: 700 }}
              title="نسخ أسماء وهيكل الأوراق فقط بدون إعادة بناء Pivot Tables"
            >
              📑 مزامنة هيكل الأوراق فقط
            </button>
            <button
              type="button"
              onClick={handleUnifyWebhookAll}
              disabled={unifyingWebhook || saving}
              className="btn-clay btn-secondary btn-sm"
              style={{ fontWeight: 800 }}
            >
              <Sparkles size={15} className={unifyingWebhook ? 'animate-spin' : ''} />
              {unifyingWebhook ? 'جارِ التوحيد...' : '⚡ توحيد عمود D على سكربت الأدمن المركزي للجميع'}
            </button>
          </div>
        </div>

        {templateSyncResults.length > 0 && (
          <div style={{ marginTop: '0.9rem', paddingTop: '0.85rem', borderTop: '1px dashed #7dd3fc', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.55rem' }}>
            {templateSyncResults.map(r => (
              <div
                key={r.sheetId}
                style={{
                  background: r.ok ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${r.ok ? '#86efac' : '#fca5a5'}`,
                  borderRadius: 10,
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.76rem'
                }}
              >
                <div style={{ fontWeight: 900, color: r.ok ? '#166534' : '#991b1b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{r.ok ? '✅' : '❌'} {r.repName}</span>
                  <span>{r.tabsCount} أوراق • {r.pivotsCount} Pivot</span>
                </div>
                {r.tabNames && r.tabNames.length > 0 && (
                  <div style={{ color: '#15803d', marginTop: 3 }}>الأوراق: {r.tabNames.join('، ')}</div>
                )}
                {r.errorDetails && (
                  <div style={{ color: '#b91c1c', marginTop: 3, wordBreak: 'break-word' }}>{r.errorDetails}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* بطاقة مفتاح Google Gemini API الموحد في الشيت الرئيسي */}
      <div className="card" style={{ padding: '1.15rem 1.2rem', border: '1.5px solid #c7d2fe', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <h4 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e1b4b' }}>
            <KeyRound size={18} style={{ color: '#4f46e5' }} />
            مفتاح Google Gemini API الموحد لجميع المستخدمين (العمود E: اي بي اي جمناي)
          </h4>
          {sharedGeminiKeyInput.trim() && (
            <span className="badge badge-success">مفعّل لجميع المندوبين ✓</span>
          )}
        </div>
        <p style={{ fontSize: '0.78rem', color: '#4338ca', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
          أي تغيير هنا يُكتب مباشرة في عمود <strong>اي بي اي جمناي</strong> بالشيت الرئيسي ويتعمم تلقائياً عند كل المستخدمين (الهاتف والحاسوب والخادم) في نفس الوقت دون الحاجة لإدخال المفتاح لدى كل مندوب.
        </p>
        <form onSubmit={handleSaveSharedGeminiKey} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type={showSharedGeminiKey ? 'text' : 'password'}
            className="clay-input"
            style={{ flex: '1 1 260px', fontSize: '0.82rem', direction: 'ltr', background: '#ffffff' }}
            placeholder="AIzaSy... أو AQ..."
            value={sharedGeminiKeyInput}
            onChange={e => setSharedGeminiKeyInput(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowSharedGeminiKey(v => !v)}
            className="btn-clay btn-secondary btn-sm"
            style={{ fontWeight: 700 }}
          >
            {showSharedGeminiKey ? <EyeOff size={14} /> : <Eye size={14} />}
            {showSharedGeminiKey ? 'إخفاء' : 'إظهار'}
          </button>
          <button type="submit" disabled={savingGeminiKey} className="btn-clay btn-primary btn-sm" style={{ fontWeight: 800 }}>
            {savingGeminiKey ? 'جارِ التعميم في الشيت...' : 'حفظ وتعميم المفتاح على الجميع'}
          </button>
        </form>
      </div>

      {/* جدول المستخدمين الحي من الشيت الرئيسي */}
      <div className="card" style={{ padding: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h4 style={{ fontWeight: 800, margin: '0 0 0.2rem 0' }}>
              جدول الحسابات في الشيت الرئيسي ({users.length} مستخدم)
            </h4>
            <span style={{ fontSize: '0.76rem', color: 'var(--gray-500)' }}>
              الأعمدة الحقيقية: A: الاسم | B: الرمز السري | C: صفحة كوكل شيت | D: اي بي اي سكربت | E: اي بي اي جمناي
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: 10 }} />
            <div style={{ fontWeight: 700, color: 'var(--gray-600)' }}>جارِ قراءة الشيت الرئيسي مباشرة...</div>
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--gray-50)', borderRadius: 12 }}>
            <Users size={48} style={{ color: 'var(--gray-300)', marginBottom: 10 }} />
            <h5 style={{ fontWeight: 800, color: 'var(--gray-700)' }}>لم يتم العثور على مستخدمين</h5>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
              تأكد من مشاركة الشيت الرئيسي كـ (Anyone with the link can view) أو أضف أول مستخدم من الزر أعلاه.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clay-table" style={{ width: '100%', fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th style={{ width: 52, textAlign: 'center' }}>الصف</th>
                  <th>الاسم</th>
                  <th style={{ textAlign: 'center' }}>الرمز السري</th>
                  <th style={{ textAlign: 'center' }}>الدور</th>
                  <th>صفحة كوكل شيت الخاصة</th>
                  <th>رابط اي بي اي سكربت</th>
                  <th>مفتاح جمناي (E)</th>
                  <th style={{ textAlign: 'center' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isRevealed = Boolean(revealedRows[u.rowNumber]);
                  const isAdminRow = u.role === 'admin';
                  return (
                    <tr key={`${u.rowNumber}-${u.full_name}`}>
                      <td style={{ textAlign: 'center', color: 'var(--gray-500)', fontWeight: 800 }}>
                        {u.rowNumber}
                      </td>
                      <td style={{ fontWeight: 900, color: 'var(--gray-900)' }}>{u.full_name}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, direction: 'ltr' }}>
                          <code style={{ fontWeight: 700, background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>
                            {isRevealed ? (u.password_hash || '—') : '••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleRevealPwd(u.rowNumber)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', padding: 2 }}
                            title={isRevealed ? 'إخفاء الرمز' : 'إظهار الرمز'}
                          >
                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isAdminRow ? 'badge-primary' : 'badge-success'}`}>
                          {isAdminRow ? 'أدمن (باقر)' : 'مندوب'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.76rem' }}>
                        {u.sheet_url ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                            <a
                              href={u.sheet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <ExternalLink size={12} /> {u.sheet_id ? `${u.sheet_id.slice(0, 14)}...` : 'فتح الشيت'}
                            </a>
                            <DownloadSheetButtons
                              compact
                              sheetId={u.sheet_id}
                              sheetUrl={u.sheet_url}
                              accountName={u.full_name}
                              onSuccess={msg => { setError(null); setSuccessMsg(msg); }}
                              onError={msg => { setSuccessMsg(null); setError(msg); }}
                            />
                          </div>
                        ) : (
                          <span style={{ color: '#b91c1c', fontWeight: 800 }}>⛔ بدون قاعدة بيانات (محظور)</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.75rem', direction: 'ltr', textAlign: 'left', color: 'var(--gray-600)' }}>
                        {u.webhook_url ? (
                          <span className="badge badge-success" title={u.webhook_url}>مربوط ✓</span>
                        ) : (
                          <span className="badge badge-gray">افتراضي</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                        {u.gemini_api_key ? (
                          <span className="badge badge-primary" title={u.gemini_api_key}>مربوط ✓</span>
                        ) : sharedGeminiKeyInput ? (
                          <span className="badge badge-success" title="يستخدم المفتاح الموحد من الشيت الرئيسي">موحد ✓</span>
                        ) : (
                          <span className="badge badge-gray">غير محدد</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            disabled={saving}
                            className="btn-clay btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.65rem', fontWeight: 700 }}
                          >
                            <Edit3 size={13} /> تعديل
                          </button>
                          {!isAdminRow && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              disabled={saving}
                              className="btn-clay btn-danger btn-sm"
                              style={{ padding: '0.3rem 0.65rem', background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca', fontWeight: 700 }}
                            >
                              <Trash2 size={13} /> حذف
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* إعداد رابط سكربت الشيت الرئيسي وعرض الكود */}
      <div className="card" style={{ padding: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <h4 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} style={{ color: 'var(--primary)' }} />
            رابط سكربت التحكم بالشيت الرئيسي (Admin Apps Script Webhook)
          </h4>
          {webhookSavedMsg && (
            <span className="badge badge-success">تم حفظ رابط الأدمن ✓</span>
          )}
        </div>

        <form onSubmit={handleSaveAdminWebhook} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <input
            type="url"
            className="clay-input"
            style={{ flex: '1 1 260px', fontSize: '0.8rem', direction: 'ltr' }}
            placeholder="https://script.google.com/macros/s/.../exec"
            value={adminWebhookInput}
            onChange={e => setAdminWebhookInput(e.target.value)}
          />
          <button type="submit" className="btn-clay btn-primary btn-sm" style={{ fontWeight: 700 }}>
            حفظ رابط السكربت الرئيسي
          </button>
          <button
            type="button"
            onClick={() => setShowScriptCode(!showScriptCode)}
            className="btn-clay btn-secondary btn-sm"
            style={{ fontWeight: 700 }}
          >
            <Sparkles size={14} /> {showScriptCode ? 'إخفاء كود v10' : 'عرض كود Apps Script v10'}
          </button>
        </form>

        {showScriptCode && (
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>
                الصق هذا الكود في شيت الأدمن (Extensions ← Apps Script) ثم Deploy ← Manage deployments ← Edit ← New version
              </span>
              <button type="button" onClick={handleCopyScript} className="btn-clay btn-primary btn-sm" style={{ fontWeight: 700 }}>
                {copiedScript ? <Check size={14} /> : <Copy size={14} />}
                {copiedScript ? 'تم النسخ!' : 'نسخ الكود المركزي v10 بالكامل'}
              </button>
            </div>
            <pre style={{
              background: '#0f172a',
              color: '#38bdf8',
              padding: '0.9rem',
              borderRadius: 10,
              fontSize: '0.72rem',
              maxHeight: 220,
              overflowY: 'auto',
              direction: 'ltr',
              textAlign: 'left',
              margin: 0
            }}>
              {APPS_SCRIPT_V2_CODE}
            </pre>

            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.77rem', fontWeight: 800, color: '#334155' }}>
                  غلاف المكتبة الثابت لشيتات المندوبين (AdminLib — وضع HEAD) لتحديث دوال onEdit داخل كل شيت تلقائياً:
                </span>
                <button type="button" onClick={handleCopyThinWrapper} className="btn-clay btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                  {copiedThinWrapper ? <Check size={14} /> : <Copy size={14} />}
                  {copiedThinWrapper ? 'تم نسخ الغلاف!' : 'نسخ الغلاف المختصر (4 أسطر)'}
                </button>
              </div>
              <pre style={{
                background: '#1e293b',
                color: '#a7f3d0',
                padding: '0.75rem',
                borderRadius: 8,
                fontSize: '0.72rem',
                direction: 'ltr',
                textAlign: 'left',
                margin: 0
              }}>
                {APPS_SCRIPT_THIN_WRAPPER}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <FloatingModal maxWidth={560} onClose={() => setShowAddModal(false)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.75rem' }}>
            <h4 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} style={{ color: 'var(--primary)' }} />
              إضافة مستخدم جديد للشيت الرئيسي
            </h4>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-clay btn-secondary btn-sm">✕</button>
          </div>

          <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الاسم (العمود A) *</label>
              <input
                type="text"
                className="clay-input"
                placeholder="مثال: keko3"
                value={addName}
                onChange={e => setAddName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الرمز السري (العمود B) *</label>
              <input
                type="text"
                className="clay-input"
                placeholder="123456"
                value={addPassword}
                onChange={e => setAddPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>رابط صفحة كوكل شيت الخاصة به (العمود C)</label>
              <input
                type="url"
                className="clay-input"
                style={{ direction: 'ltr', fontSize: '0.8rem' }}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={addSheetUrl}
                onChange={e => setAddSheetUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>رابط اي بي اي سكربت الخاص به (العمود D)</label>
              <input
                type="url"
                className="clay-input"
                style={{ direction: 'ltr', fontSize: '0.8rem' }}
                placeholder="https://script.google.com/macros/s/.../exec"
                value={addWebhookUrl}
                onChange={e => setAddWebhookUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>مفتاح Gemini API (العمود E — اختياري)</label>
              <input
                type="text"
                className="clay-input"
                style={{ direction: 'ltr', fontSize: '0.8rem' }}
                placeholder={sharedGeminiKeyInput ? 'يُملأ تلقائياً من المفتاح الموحد' : 'AIzaSy... / AQ...'}
                value={addGeminiKey}
                onChange={e => setAddGeminiKey(e.target.value)}
              />
            </div>

            <button type="submit" disabled={saving} className="btn-clay btn-primary" style={{ fontWeight: 800, marginTop: '0.35rem' }}>
              {saving ? 'جارِ الحفظ في الشيت الرئيسي...' : 'حفظ وإضافة للشيت الرئيسي'}
            </button>
          </form>
        </FloatingModal>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <FloatingModal maxWidth={560} onClose={() => setEditingUser(null)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.75rem' }}>
            <h4 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={19} style={{ color: 'var(--primary)' }} />
              تعديل بيانات الصف #{editingUser.rowNumber} ({editingUser.full_name})
            </h4>
            <button type="button" onClick={() => setEditingUser(null)} className="btn-clay btn-secondary btn-sm">✕</button>
          </div>

          <form onSubmit={handleEditUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الاسم (العمود A) *</label>
              <input
                type="text"
                className="clay-input"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الرمز السري (العمود B) *</label>
              <input
                type="text"
                className="clay-input"
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>صفحة كوكل شيت الخاصة به (العمود C)</label>
              <input
                type="text"
                className="clay-input"
                style={{ direction: 'ltr', fontSize: '0.8rem' }}
                value={editSheetUrl}
                onChange={e => setEditSheetUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>اي بي اي سكربت (العمود D)</label>
              <input
                type="text"
                className="clay-input"
                style={{ direction: 'ltr', fontSize: '0.8rem' }}
                value={editWebhookUrl}
                onChange={e => setEditWebhookUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>اي بي اي جمناي (العمود E)</label>
              <input
                type="text"
                className="clay-input"
                style={{ direction: 'ltr', fontSize: '0.8rem' }}
                placeholder="AIzaSy... / AQ..."
                value={editGeminiKey}
                onChange={e => setEditGeminiKey(e.target.value)}
              />
            </div>

            <button type="submit" disabled={saving} className="btn-clay btn-primary" style={{ fontWeight: 800, marginTop: '0.35rem' }}>
              {saving ? 'جارِ حفظ التعديلات...' : 'حفظ التعديلات في الشيت الرئيسي'}
            </button>
          </form>
        </FloatingModal>
      )}
    </div>
  );
};
