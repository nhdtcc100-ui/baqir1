import React, { useState, useEffect } from 'react';
import { User, Pharmacy, Product, Invoice, KPISummary } from './types';
import { api, getCurrentUser, removeToken, removeCurrentUser } from './services/api';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { VisitsCalendar } from './pages/VisitsCalendar';
import { InvoiceScanner } from './pages/InvoiceScanner';
import { PharmacyProfile } from './pages/PharmacyProfile';
import { BillingLedger } from './pages/BillingLedger';
import { 
  LayoutDashboard, Calendar, ScanLine, Building2, 
  FileText, LogOut, Stethoscope, Sparkles, CheckCircle2, Menu, X
} from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'visits' | 'scan' | 'pharmacies' | 'billing'>('dashboard');
  
  // Data stores
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

  // Selected pharmacy when navigating from calendar or profile to scanner
  const [preselectedPharmacyId, setPreselectedPharmacyId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
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
      setKpis(kpiData);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    setCurrentUser(null);
  };

  const handleApproveInvoice = async (id: string) => {
    try {
      await api.reviewInvoice(id, 'approved');
      showToast('تم اعتماد الفاتورة بنجاح وتحديث الحسابات 🌟');
      loadData();
    } catch (err: any) {
      showToast('حدث خطأ في الاعتماد: ' + err.message);
    }
  };

  const handleRejectInvoice = async (id: string, reason: string) => {
    try {
      await api.reviewInvoice(id, 'rejected', reason);
      showToast('تم رفض الفاتورة وإشعار المندوب بالسبب ⚠️');
      loadData();
    } catch (err: any) {
      showToast('حدث خطأ: ' + err.message);
    }
  };

  const handleInvoiceCreated = (invoice: Invoice) => {
    showToast(`تم حفظ الفاتورة (${invoice.invoice_number}) وحساب البونص التلقائي بنجاح! 🎉`);
    setActiveTab('billing');
    loadData();
  };

  const handleStartInvoiceForPharmacy = (pharmacyId: string) => {
    setPreselectedPharmacyId(pharmacyId);
    setActiveTab('scan');
  };

  // If not logged in, render Screen 1: Login
  if (!currentUser) {
    return <Login onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="container-fluid py-3 px-md-4 min-vh-100" style={{ maxWidth: '1440px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-3 z-3 animate-fade-in"
          style={{ zIndex: 1100 }}
        >
          <div className="clay-card py-2 px-4 shadow-lg text-primary fw-bold d-flex align-items-center gap-2"
               style={{ background: '#ffffff', borderRadius: '999px', border: '2px solid #93c5fd' }}>
            <Sparkles size={18} className="text-warning" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="d-md-none d-flex justify-content-between align-items-center mb-3 p-3 clay-card">
        <div className="d-flex align-items-center gap-2">
          <div className="clay-stat-icon" style={{ width: '40px', height: '40px', background: '#3b82f6', color: '#fff' }}>
            <Stethoscope size={20} />
          </div>
          <span className="fw-bold">PharmaSales CRM</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-light rounded-3 p-2"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="row g-4">
        
        {/* ── Claymorphism Navigation Sidebar ─────────────────────────────── */}
        <div className={`col-12 col-md-3 col-xl-2-5 ${mobileMenuOpen ? 'd-block' : 'd-none d-md-block'}`}>
          <div className="clay-sidebar h-100 d-flex flex-column justify-content-between position-sticky" style={{ top: '1rem' }}>
            
            <div>
              {/* Brand Logo Header */}
              <div className="d-flex align-items-center gap-3 mb-4 px-2">
                <div 
                  className="clay-stat-icon" 
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                    color: '#ffffff', 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '16px' 
                  }}
                >
                  <Stethoscope size={26} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">PharmaSales</h6>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>منظومة إدارة المبيعات والـ OCR</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`clay-nav-item w-100 border-0 ${activeTab === 'dashboard' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={20} />
                  <span>لوحة القيادة</span>
                </button>

                <button
                  onClick={() => { setActiveTab('visits'); setMobileMenuOpen(false); }}
                  className={`clay-nav-item w-100 border-0 ${activeTab === 'visits' ? 'active' : ''}`}
                >
                  <Calendar size={20} />
                  <span>جدول الزيارات</span>
                </button>

                <button
                  onClick={() => { setActiveTab('scan'); setMobileMenuOpen(false); }}
                  className={`clay-nav-item w-100 border-0 ${activeTab === 'scan' ? 'active' : ''}`}
                >
                  <ScanLine size={20} />
                  <span>مسح وتدقيق OCR</span>
                </button>

                <button
                  onClick={() => { setActiveTab('pharmacies'); setMobileMenuOpen(false); }}
                  className={`clay-nav-item w-100 border-0 ${activeTab === 'pharmacies' ? 'active' : ''}`}
                >
                  <Building2 size={20} />
                  <span>دليل الصيدليات</span>
                </button>

                <button
                  onClick={() => { setActiveTab('billing'); setMobileMenuOpen(false); }}
                  className={`clay-nav-item w-100 border-0 ${activeTab === 'billing' ? 'active' : ''}`}
                >
                  <FileText size={20} />
                  <span>السجل والتقارير</span>
                </button>
              </nav>
            </div>

            {/* User Profile & Logout Section */}
            <div className="pt-4 border-top mt-4 px-2">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{ width: '40px', height: '40px', background: currentUser.role === 'admin' ? '#2563eb' : '#059669' }}
                >
                  {currentUser.full_name.slice(0, 1)}
                </div>
                <div className="overflow-hidden">
                  <div className="fw-bold small text-truncate">{currentUser.full_name}</div>
                  <span className={`clay-badge ${currentUser.role === 'admin' ? 'clay-badge-primary' : 'clay-badge-success'} py-0 px-2`} style={{ fontSize: '0.72rem' }}>
                    {currentUser.role === 'admin' ? 'مدير عام' : 'مندوب علمي'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="clay-btn clay-btn-secondary w-100 py-2 small"
                style={{ fontSize: '0.85rem' }}
              >
                <LogOut size={16} />
                <span>تسجيل الخروج</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── Main Dynamic Content Area ───────────────────────────────────── */}
        <div className="col-12 col-md-9 col-xl-9-5">
          {activeTab === 'dashboard' && (
            <Dashboard
              user={currentUser}
              kpis={kpis}
              invoices={invoices}
              onNavigate={(tab) => setActiveTab(tab as any)}
              onApproveInvoice={handleApproveInvoice}
              onRejectInvoice={(id) => handleRejectInvoice(id, 'عدم وضوح الختم أو البنود')}
            />
          )}

          {activeTab === 'visits' && (
            <VisitsCalendar
              pharmacies={pharmacies}
              onStartInvoiceForPharmacy={handleStartInvoiceForPharmacy}
            />
          )}

          {activeTab === 'scan' && (
            <InvoiceScanner
              pharmacies={pharmacies}
              products={products}
              initialPharmacyId={preselectedPharmacyId}
              onInvoiceCreated={handleInvoiceCreated}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'pharmacies' && (
            <PharmacyProfile
              pharmacies={pharmacies}
              invoices={invoices}
              onStartInvoiceForPharmacy={handleStartInvoiceForPharmacy}
              onScheduleVisit={() => setActiveTab('visits')}
            />
          )}

          {activeTab === 'billing' && (
            <BillingLedger
              user={currentUser}
              invoices={invoices}
              pharmacies={pharmacies}
              onApproveInvoice={handleApproveInvoice}
              onRejectInvoice={handleRejectInvoice}
            />
          )}
        </div>

      </div>

    </div>
  );
}

export default App;
