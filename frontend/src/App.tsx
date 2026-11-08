import React, { useState, useEffect } from 'react';
import { User, Pharmacy, Product, Invoice, KPISummary } from './types';
import { api, getCurrentUser, removeToken, removeCurrentUser } from './services/api';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { VisitsCalendar } from './pages/VisitsCalendar';
import { AddInvoicePage } from './pages/AddInvoicePage';
import { PharmacyProfile } from './pages/PharmacyProfile';
import { BillingLedger } from './pages/BillingLedger';
import { GoogleSheetsSync } from './pages/GoogleSheetsSync';
import { UsersManagement } from './pages/UsersManagement';
import {
  LayoutDashboard, Calendar, FilePlus, Building2,
  FileText, LogOut, Pill, Menu, X, CheckCircle, AlertCircle, FileSpreadsheet, Users
} from 'lucide-react';

type Tab = 'dashboard' | 'visits' | 'add-invoice' | 'pharmacies' | 'billing' | 'sheets' | 'users';

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

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // ── Data loading ───────────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [phList, prList, invList, kpiData] = await Promise.all([
        api.getPharmacies(),
        api.getProducts(),
        api.getInvoices(),
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
    if (currentUser) loadData();
  }, [currentUser]);

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
    }
    setActiveTab(tab);
    setMobileOpen(false);
  };

  // ── Nav Items ──────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={19} /> },
    { id: 'visits', label: 'الزيارات', icon: <Calendar size={19} /> },
    { id: 'add-invoice', label: 'إضافة فاتورة', icon: <FilePlus size={20} /> },
    { id: 'pharmacies', label: 'الصيدليات', icon: <Building2 size={19} /> },
    { id: 'billing', label: 'الفواتير', icon: <FileText size={19} /> },
    { id: 'sheets', label: 'كوكل شيت', icon: <FileSpreadsheet size={19} /> },
    ...(currentUser?.role === 'admin' || currentUser?.role === 'supervisor' ? [
      { id: 'users' as Tab, label: 'المستخدمون', icon: <Users size={19} /> }
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

          <button className="topbar-user-pill" title={currentUser.email}>
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
        <div className="mobile-nav-drawer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.5rem 0.85rem', borderBottom: '1px solid var(--gray-200)', marginBottom: '0.5rem' }}>
            <div className="topbar-user-avatar" style={{ background: avatarColor, width: 38, height: 38, fontSize: '0.95rem' }}>
              {currentUser.full_name.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gray-900)' }}>{currentUser.full_name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>{roleLabel} • {currentUser.email}</span>
            </div>
          </div>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <div className="divider" />
          <button className="mobile-nav-item" onClick={handleLogout} style={{ color: '#dc2626' }}>
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="app-main">
        <div className="app-content animate-in">

          {activeTab === 'dashboard' && (
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

          {activeTab === 'visits' && (
            <VisitsCalendar
              pharmacies={pharmacies}
              onStartInvoiceForPharmacy={handleStartInvoiceForPharmacy}
            />
          )}

          {activeTab === 'add-invoice' && (
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

          {activeTab === 'pharmacies' && (
            <PharmacyProfile
              pharmacies={pharmacies}
              invoices={invoices}
              onStartInvoiceForPharmacy={handleStartInvoiceForPharmacy}
              onScheduleVisit={() => navigate('visits')}
            />
          )}

          {activeTab === 'billing' && (
            <BillingLedger
              user={currentUser}
              invoices={invoices}
              pharmacies={pharmacies}
              onApproveInvoice={handleApproveInvoice}
              onRejectInvoice={handleRejectInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onUpdateInvoice={handleUpdateInvoice}
            />
          )}

          {activeTab === 'sheets' && (
            <GoogleSheetsSync />
          )}

          {activeTab === 'users' && (
            <UsersManagement />
          )}

        </div>
      </main>

      {/* ── Mobile Bottom Navigation Bar (شريط التنقل السفلي للهواتف والتابلت) ── */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => {
          const isHighlight = item.id === 'add-invoice';
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`mobile-bottom-nav-item ${isActive ? 'active' : ''} ${isHighlight ? 'highlight' : ''}`}
            >
              <div className="bottom-nav-icon">
                {item.icon}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

export default App;
