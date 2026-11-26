import React, { useState, useEffect } from 'react';
import { User, Pharmacy, Product, Invoice, KPISummary } from './types';
import { api, getCurrentUser, removeToken, removeCurrentUser, hasUserDatabase, NO_DATABASE_ERROR_MSG } from './services/api';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { VisitsCalendar } from './pages/VisitsCalendar';
import { AddInvoicePage } from './pages/AddInvoicePage';
import { PharmacyProfile } from './pages/PharmacyProfile';
import { BillingLedger } from './pages/BillingLedger';
import { GoogleSheetsSync } from './pages/GoogleSheetsSync';
import { UsersManagement } from './pages/UsersManagement';
import { ProfileSettings } from './pages/ProfileSettings';
import {
  LayoutDashboard, Calendar, FilePlus, Building2,
  FileText, LogOut, Pill, Menu, X, CheckCircle, AlertCircle, FileSpreadsheet, Users, KeyRound
} from 'lucide-react';

type Tab = 'dashboard' | 'visits' | 'add-invoice' | 'pharmacies' | 'billing' | 'sheets' | 'users' | 'profile';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [kpis, setKpis] = useState<KPISummary>({
    total_invoices: 0,
    total_pharmacies_visited: 0,
    total_pieces_sold: 0,
    total_bonus_given: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preselectedPharmacyId, setPreselectedPharmacyId] = useState<string | undefined>();
  const [invoicePageKey, setInvoicePageKey] = useState(0); // increment to force full remount of AddInvoicePage
  const [checkingDatabase, setCheckingDatabase] = useState(false);

  const hasSessionUserChanged = (a: User | null, b: User | null): boolean => {
    if (!a || !b) return Boolean(a) !== Boolean(b);
    return (
      (a.sheet_id || '').trim() !== (b.sheet_id || '').trim() ||
      (a.sheet_url || '').trim() !== (b.sheet_url || '').trim() ||
      (a.webhook_url || '').trim() !== (b.webhook_url || '').trim() ||
      a.role !== b.role ||
      a.full_name !== b.full_name ||
      (a.gemini_api_key || '').trim() !== (b.gemini_api_key || '').trim()
    );
  };

  const handleRecheckDatabase = async () => {
    if (!currentUser) return;
    setCheckingDatabase(true);
    try {
      const synced = await api.syncUserSessionFromMasterSheet();
      if (synced.user && hasSessionUserChanged(currentUser, synced.user)) {
        setCurrentUser(synced.user);
      }
      const nextUser = synced.user || currentUser;
      if (hasUserDatabase(nextUser)) {
        addToast('تم العثور على قاعدة بياناتك في الشيت الرئيسي بنجاح ✅');
        await loadData();
      } else {
        addToast(NO_DATABASE_ERROR_MSG, 'error');
      }
    } catch (e: any) {
      addToast('تعذر التحقق من الشيت الرئيسي: ' + (e?.message || ''), 'error');
    } finally {
      setCheckingDatabase(false);
    }
  };

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // ── Data loading ───────────────────────────────────────────────────────────
  const loadData = async () => {
    if (!hasUserDatabase(currentUser)) {
      setPharmacies([]);
      setInvoices([]);
      setKpis({
        total_invoices: 0,
        total_pharmacies_visited: 0,
        total_pieces_sold: 0,
        total_bonus_given: 0,
        total_revenue: 0
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [invList, prList] = await Promise.all([
        api.getInvoices(),
        api.getProducts()
      ]);
      const [phList, kpiData] = await Promise.all([
        api.getPharmacies(),
        api.getKPIs()
      ]);
      setPharmacies(phList);
      setProducts(prList);
      setInvoices(invList);
      const normalizedKpis: KPISummary = {
        total_invoices: Number(kpiData?.total_invoices || 0),
        total_pharmacies_visited: Number(kpiData?.total_pharmacies_visited || 0),
        total_pieces_sold: Number(kpiData?.total_pieces_sold || 0),
        total_bonus_given: Number(kpiData?.total_bonus_pieces ?? kpiData?.total_bonus_given ?? 0),
        total_bonus_pieces: Number(kpiData?.total_bonus_pieces ?? kpiData?.total_bonus_given ?? 0),
        total_revenue: Number(kpiData?.total_sales_amount ?? kpiData?.total_revenue ?? 0),
        total_sales_amount: Number(kpiData?.total_sales_amount ?? kpiData?.total_revenue ?? 0),
        approved_invoices: Number(kpiData?.approved_invoices || 0),
        pending_invoices: Number(kpiData?.pending_invoices || 0)
      };
      setKpis(normalizedKpis);
    } catch (e: any) {
      addToast('فشل تحميل البيانات: ' + (e.message || 'خطأ في الاتصال بالخادم'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onAuthLogout = () => {
      setCurrentUser(null);
    };
    window.addEventListener('auth:logout', onAuthLogout);
    return () => window.removeEventListener('auth:logout', onAuthLogout);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        const synced = await api.syncUserSessionFromMasterSheet();
        if (!cancelled && synced.user && hasSessionUserChanged(currentUser, synced.user)) {
          setCurrentUser(synced.user);
          return;
        }
      } catch { /* ignore */ }
      if (cancelled) return;
      if (hasUserDatabase(currentUser)) {
        api.flushSheetsSyncOutbox({ keepalive: true }).catch(() => {});
        loadData();
      } else {
        setPharmacies([]);
        setInvoices([]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  // مزامنة تلقائية فورية عند العودة للتطبيق، التنقل، وكل 8 ثوانٍ أثناء عرض الفواتير/الشيت
  useEffect(() => {
    if (!currentUser) return;
    let lastSyncAt = 0;
    const syncDeletionAndRefresh = async (force = false) => {
      const now = Date.now();
      if (!force && now - lastSyncAt < 3000) return;
      lastSyncAt = now;
      try {
        const synced = await api.syncUserSessionFromMasterSheet();
        if (synced.user && hasSessionUserChanged(currentUser, synced.user)) {
          setCurrentUser(synced.user);
          return;
        }
        if (!hasUserDatabase(currentUser)) return;
        const changed = await api.syncSheetDeletion();
        if (changed) {
          await loadData();
        }
      } catch { /* ignore */ }
    };

    const onFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        syncDeletionAndRefresh(false);
      }
    };

    window.addEventListener('focus', onFocusOrVisible);
    document.addEventListener('visibilitychange', onFocusOrVisible);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && (activeTab === 'billing' || activeTab === 'dashboard' || activeTab === 'sheets')) {
        syncDeletionAndRefresh(true);
      }
    }, 8000);

    return () => {
      window.removeEventListener('focus', onFocusOrVisible);
      document.removeEventListener('visibilitychange', onFocusOrVisible);
      clearInterval(interval);
    };
  }, [currentUser, activeTab]);

  // Ensure pending Google Sheets syncs flush on reconnect, page return, or exit
  useEffect(() => {
    const flushNow = () => {
      api.flushSheetsSyncOutbox({ keepalive: true, useBeacon: true }).catch(() => {});
    };
    const onVisChange = () => {
      if (document.visibilityState === 'hidden') flushNow();
      else api.flushSheetsSyncOutbox({ keepalive: true }).catch(() => {});
    };
    window.addEventListener('online', flushNow);
    window.addEventListener('pagehide', flushNow);
    window.addEventListener('beforeunload', flushNow);
    document.addEventListener('visibilitychange', onVisChange);
    return () => {
      window.removeEventListener('online', flushNow);
      window.removeEventListener('pagehide', flushNow);
      window.removeEventListener('beforeunload', flushNow);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, []);

  // Lock background page scrolling while mobile sidebar drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    setCurrentUser(null);
  };

  const handleApproveInvoice = async (id: string) => {
    try {
      await api.reviewInvoice(id, 'approved');
      addToast('تم اعتماد الفاتورة بنجاح ✅');
      loadData();
    } catch (e: any) {
      addToast('خطأ في الاعتماد: ' + e.message, 'error');
    }
  };

  const handleRejectInvoice = async (id: string, reason: string) => {
    try {
      await api.reviewInvoice(id, 'rejected', reason);
      addToast('تم رفض الفاتورة مع إشعار المندوب ⚠️', 'info');
      loadData();
    } catch (e: any) {
      addToast('خطأ: ' + e.message, 'error');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    // Optimistically remove from local state; BillingLedger already called api.deleteInvoice
    setInvoices(prev => prev.filter(i => i.id !== id));
    addToast('تم حذف الفاتورة بنجاح 🗑️', 'info');
  };

  const handleUpdateInvoice = (updated: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
    addToast(`تم تعديل الفاتورة ${updated.invoice_number} بنجاح ✏️`, 'success');
    loadData();
  };

  const handleInvoiceCreated = (invoice: Invoice) => {
    setPreselectedPharmacyId(undefined); // Wipe out any preselected pharmacy so next invoice starts blank!
    setInvoicePageKey(k => k + 1); // Force AddInvoicePage to fully remount with 100% fresh state
    addToast(`تم حفظ الفاتورة ${invoice.invoice_number} وإرسالها للاعتماد 🎉`);
    setActiveTab('billing');
    loadData();
  };

  const handleStartInvoiceForPharmacy = (pharmacyId: string) => {
    setPreselectedPharmacyId(pharmacyId);
    setInvoicePageKey(k => k + 1); // Fresh page every time
    setActiveTab('add-invoice');
  };

  const navigate = (tab: Tab) => {
    if (tab === 'add-invoice') {
      setPreselectedPharmacyId(undefined); // Clear old pharmacy so user starts with a clean slate
      setInvoicePageKey(k => k + 1);
    } else if (tab === 'billing' || tab === 'dashboard') {
      loadData();
    }
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // ── Nav Items ──────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={19} /> },
    { id: 'visits', label: 'الزيارات', icon: <Calendar size={19} /> },
    { id: 'add-invoice', label: 'إضافة فاتورة', icon: <FilePlus size={20} /> },
    { id: 'pharmacies', label: 'الصيدليات', icon: <Building2 size={19} /> },
    { id: 'billing', label: 'الفواتير', icon: <FileText size={19} /> },
    { id: 'sheets', label: 'كوكل شيت', icon: <FileSpreadsheet size={19} /> },
    { id: 'profile', label: 'حسابي', icon: <KeyRound size={19} /> },
    ...(currentUser?.role === 'admin' ? [
      { id: 'users' as Tab, label: 'الشيت الرئيسي', icon: <Users size={19} /> }
    ] : [])
  ] as { id: Tab; label: string; icon: React.ReactNode }[];

  const roleLabel = currentUser?.role === 'admin' ? 'مدير عام'
    : currentUser?.role === 'supervisor' ? 'مشرف مبيعات'
      : 'مندوب علمي';

  const avatarColor = currentUser?.role === 'admin' ? '#2563eb'
    : currentUser?.role === 'supervisor' ? '#7c3aed'
      : '#059669';

  // ── Login Screen ───────────────────────────────────────────────────────────
  if (!currentUser) {
    return <Login onLoginSuccess={u => setCurrentUser(u)} />;
  }

  return (
    <div className="app-wrapper">

      {/* ── Toasts ─────────────────────────────────────────────────────────── */}
      <div className="toast-bar">
        {toasts.map(t => (
          <div key={t.id} className={`alert-${t.type === 'success' ? 'success' : t.type === 'error' ? 'danger' : 'info'} mb-2`}>
            {t.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <header className="topbar">

        {/* Brand */}
        <a href="#" className="topbar-brand" onClick={e => { e.preventDefault(); navigate('dashboard'); }}>
          <div className="topbar-brand-icon">
            <Pill size={20} />
          </div>
          <div className="topbar-brand-text">
            <span className="topbar-brand-name">PharmaSales</span>
            <span className="topbar-brand-sub">نظام إدارة المبيعات الدوائية</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="topbar-nav">
          {navItems.map(item => {
            const isHighlight = item.id === 'add-invoice';
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`topbar-nav-item ${activeTab === item.id ? 'active' : ''} ${isHighlight ? 'topbar-highlight-btn' : ''}`}
                style={isHighlight ? { color: '#ffffff' } : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: User + Logout */}
        <div className="topbar-actions">
          {loading && (
            <div style={{ width: 20, height: 20, border: '2px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%' }}
              className="animate-spin" />
          )}

          {/* Direct Mobile + Add Invoice Button (hidden when already on add-invoice page) */}
          {activeTab !== 'add-invoice' && hasUserDatabase(currentUser) && (
            <button
              className="topbar-mobile-add-btn"
              onClick={() => navigate('add-invoice')}
              title="إضافة فاتورة جديدة"
            >
              <FilePlus size={15} />
              <span>+ فاتورة</span>
            </button>
          )}

          <button className="topbar-user-pill" onClick={() => navigate('profile')} title="إعدادات الحساب وتغيير الاسم أو الرمز">
            <div className="topbar-user-avatar" style={{ background: avatarColor }}>
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="topbar-user-info">
              <span className="topbar-user-name">{currentUser.full_name.split(' ')[0]}</span>
              <span className="topbar-user-role">{roleLabel}</span>
            </div>
          </button>

          <button className="topbar-logout-btn" onClick={handleLogout} title="تسجيل الخروج">
            <LogOut size={18} />
          </button>

          <button className="topbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer Backdrop ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <aside className="mobile-nav-drawer" aria-label="القائمة الجانبية">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.5rem 0.25rem 0.9rem',
            borderBottom: '1.5px solid var(--gray-200)',
            marginBottom: '0.5rem',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
              <div className="topbar-user-avatar" style={{ background: avatarColor, width: 42, height: 42, fontSize: '1rem' }}>
                {currentUser.full_name.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.full_name}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700 }}>{roleLabel}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="إغلاق القائمة"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: '1px solid var(--gray-200)',
                background: '#f1f5f9',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', padding: '0 0.35rem 0.25rem' }}>
            أقسام المنظومة
          </div>

          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const isAdd = item.id === 'add-invoice';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                style={isAdd && !isActive ? {
                  background: '#ecfdf5',
                  color: '#047857',
                  borderColor: '#a7f3d0',
                  fontWeight: 800
                } : undefined}
              >
                <span style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: isActive
                    ? 'rgba(255,255,255,0.22)'
                    : isAdd
                      ? '#d1fae5'
                      : '#e0e7ff',
                  color: isActive
                    ? '#ffffff'
                    : isAdd
                      ? '#059669'
                      : '#2563eb'
                }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}

          <div className="divider" style={{ margin: '0.75rem 0' }} />

          <button
            type="button"
            className="mobile-nav-item"
            onClick={handleLogout}
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              borderColor: '#fecaca',
              fontWeight: 800,
              marginTop: 'auto'
            }}
          >
            <span style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fee2e2',
              color: '#dc2626',
              flexShrink: 0
            }}>
              <LogOut size={18} />
            </span>
            <span>تسجيل الخروج</span>
          </button>
        </aside>
      )}

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className={`app-main ${activeTab === 'add-invoice' ? 'app-main-fullpage' : ''}`}>
        <div className="app-content animate-in">

          {!hasUserDatabase(currentUser) && ['dashboard', 'visits', 'add-invoice', 'pharmacies', 'billing', 'sheets'].includes(activeTab) && (
            <div
              className="card"
              style={{
                maxWidth: 620,
                margin: '2rem auto',
                padding: '2rem 1.5rem',
                border: '2px solid #ef4444',
                background: 'linear-gradient(135deg, #fff5f5, #fef2f2)',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={34} />
                </div>
              </div>
              <h2 style={{ fontWeight: 900, color: '#991b1b', fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                ⛔ لا تملك أي قاعدة بيانات (Google Sheet)
              </h2>
              <p style={{ color: '#7f1d1d', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 600 }}>
                {NO_DATABASE_ERROR_MSG}
              </p>
              <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: 10, padding: '0.85rem', fontSize: '0.84rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                <div><strong>الحساب الحالي:</strong> {currentUser.full_name}</div>
                <div>
                  يجب على الأدمن (<strong>باقر</strong>) إضافة رابط صفحة Google Sheet الخاصة بك في العمود <strong>C</strong> داخل الشيت الرئيسي حتى تتمكن من رؤية فواتيرك وإدخال بيانات جديدة. لا يمكنك الدخول إلى شيت الإدارة أو شيت باقر.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleRecheckDatabase}
                  disabled={checkingDatabase}
                  className="btn-clay btn-primary"
                  style={{ fontWeight: 800 }}
                >
                  {checkingDatabase ? '⏳ جارِ التحقق من الشيت الرئيسي...' : '🔄 إعادة التحقق من الشيت الرئيسي'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('profile')}
                  className="btn-clay btn-secondary"
                  style={{ fontWeight: 700 }}
                >
                  <KeyRound size={15} /> حسابي
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-clay btn-secondary"
                  style={{ color: '#b91c1c', borderColor: '#fecaca', background: '#fee2e2', fontWeight: 700 }}
                >
                  <LogOut size={15} /> تسجيل الخروج
                </button>
              </div>
            </div>
          )}

          {hasUserDatabase(currentUser) && activeTab === 'dashboard' && (
            <Dashboard
              user={currentUser}
              kpis={kpis}
              invoices={invoices}
              pharmacies={pharmacies}
              onNavigate={tab => navigate(tab as Tab)}
              onApproveInvoice={handleApproveInvoice}
              onRejectInvoice={id => handleRejectInvoice(id, 'مرفوض من قِبَل المدير')}
            />
          )}

          {hasUserDatabase(currentUser) && activeTab === 'visits' && (
            <VisitsCalendar
              pharmacies={pharmacies}
              onStartInvoiceForPharmacy={handleStartInvoiceForPharmacy}
            />
          )}

          {hasUserDatabase(currentUser) && activeTab === 'add-invoice' && (
            <AddInvoicePage
              key={invoicePageKey}
              pharmacies={pharmacies}
              products={products}
              invoices={invoices}
              initialPharmacyId={preselectedPharmacyId}
              onInvoiceCreated={handleInvoiceCreated}
              onCancel={() => navigate('billing')}
            />
          )}

          {hasUserDatabase(currentUser) && activeTab === 'pharmacies' && (
            <PharmacyProfile
              pharmacies={pharmacies}
              invoices={invoices}
              onStartInvoiceForPharmacy={handleStartInvoiceForPharmacy}
              onScheduleVisit={() => navigate('visits')}
            />
          )}

          {hasUserDatabase(currentUser) && activeTab === 'billing' && (
            <BillingLedger
              user={currentUser}
              invoices={invoices}
              pharmacies={pharmacies}
              onApproveInvoice={handleApproveInvoice}
              onRejectInvoice={handleRejectInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onUpdateInvoice={handleUpdateInvoice}
              onAddInvoice={() => navigate('add-invoice')}
              onRefresh={loadData}
            />
          )}

          {hasUserDatabase(currentUser) && activeTab === 'sheets' && (
            <GoogleSheetsSync onDataChanged={loadData} />
          )}

          {activeTab === 'users' && currentUser?.role === 'admin' && (
            <UsersManagement />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings
              user={currentUser}
              onUserUpdated={updated => setCurrentUser(updated)}
            />
          )}

        </div>
      </main>

      {/* ── Mobile Floating Action Button (FAB) for Immediate Add Invoice ──── */}
      {activeTab !== 'add-invoice' && hasUserDatabase(currentUser) && (
        <button
          type="button"
          onClick={() => navigate('add-invoice')}
          className="mobile-fab-btn"
          title="إضافة فاتورة جديدة"
        >
          <FilePlus size={19} />
          <span>+ إضافة فاتورة</span>
        </button>
      )}

      {/* ── Mobile Bottom Navigation Bar (hidden on Add Invoice full mobile page) ── */}
      {activeTab !== 'add-invoice' && (
        <nav className="mobile-bottom-nav">
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className={`mobile-bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon"><LayoutDashboard size={20} /></div>
            <span className="bottom-nav-label">الرئيسية</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('billing')}
            className={`mobile-bottom-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon"><FileText size={20} /></div>
            <span className="bottom-nav-label">الفواتير</span>
          </button>

          {/* Central Elevated Add Invoice Button */}
          <button
            type="button"
            onClick={() => navigate('add-invoice')}
            className="mobile-bottom-nav-item highlight"
          >
            <div className="bottom-nav-icon"><FilePlus size={24} /></div>
            <span className="bottom-nav-label">+ فاتورة</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('sheets')}
            className={`mobile-bottom-nav-item ${activeTab === 'sheets' ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon"><FileSpreadsheet size={20} /></div>
            <span className="bottom-nav-label">كوكل شيت</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`mobile-bottom-nav-item ${mobileOpen ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon"><Menu size={20} /></div>
            <span className="bottom-nav-label">المزيد</span>
          </button>
        </nav>
      )}

    </div>
  );
}

export default App;
