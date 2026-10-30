import React from 'react';
import { User, Invoice, KPISummary } from '../types';
import { 
  TrendingUp, FileText, Building2, Gift, PlusCircle, Calendar, 
  Download, CheckCircle2, Clock, AlertCircle, ArrowUpRight, Sparkles 
} from 'lucide-react';

interface DashboardProps {
  user: User;
  kpis: KPISummary;
  invoices: Invoice[];
  onNavigate: (tab: string) => void;
  onApproveInvoice: (id: string) => void;
  onRejectInvoice: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  kpis,
  invoices,
  onNavigate,
  onApproveInvoice,
  onRejectInvoice
}) => {
  const pendingInvoices = invoices.filter(i => i.status === 'pending_review');

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* ── Welcome Banner ───────────────────────────────────────────────── */}
      <div className="clay-card mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
           style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="clay-badge clay-badge-primary">
              <Sparkles size={14} /> {user.role === 'admin' ? 'صلاحيات الإدارة الكاملة' : 'لوحة المندوب الميداني'}
            </span>
            <span className="text-muted small">
              {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
            أهلاً بك، {user.full_name} 👋
          </h2>
          <p className="text-muted mb-0 small">
            {user.role === 'admin'
              ? 'متابعة مباشرة لشبكة المبيعات، اعتماد الفواتير، وتحليل البونص على مستوى الصيدليات.'
              : 'سجل زياراتك اليومية، ارفع فواتير الصيدليات واستخرج الأصناف بالذكاء الاصطناعي لحظياً.'}
          </p>
        </div>

        {/* Quick Actions in Header */}
        <div className="d-flex flex-wrap gap-2">
          <button 
            onClick={() => onNavigate('scan')} 
            className="clay-btn clay-btn-primary"
          >
            <PlusCircle size={18} />
            <span>مسح فاتورة OCR جديدة</span>
          </button>

          <button 
            onClick={() => onNavigate('visits')} 
            className="clay-btn clay-btn-secondary"
          >
            <Calendar size={18} />
            <span>جدول الزيارات</span>
          </button>
        </div>
      </div>

      {/* ── KPI Clay Cards Grid ─────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        
        {/* Total Sales */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card clay-card-interactive h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold">إجمالي المبيعات المحققة</span>
                <h3 className="fw-bold mt-1 mb-0" style={{ color: '#1e293b' }}>
                  {kpis.total_revenue.toLocaleString()} <small className="fs-6 text-muted">د.ع</small>
                </h3>
              </div>
              <div className="clay-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <TrendingUp size={26} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-1 small text-success">
              <ArrowUpRight size={16} />
              <span className="fw-bold">+18.4%</span>
              <span className="text-muted">مقارنة بالشهر السابق</span>
            </div>
          </div>
        </div>

        {/* Total Invoices */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card clay-card-interactive h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold">الفواتير المعالجة</span>
                <h3 className="fw-bold mt-1 mb-0" style={{ color: '#1e293b' }}>
                  {kpis.total_invoices} <small className="fs-6 text-muted">فاتورة</small>
                </h3>
              </div>
              <div className="clay-stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <FileText size={26} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 small">
              <span className="clay-badge clay-badge-warning py-1 px-2">
                <Clock size={12} /> {pendingInvoices.length} في انتظار المراجعة
              </span>
            </div>
          </div>
        </div>

        {/* Pharmacies Visited */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card clay-card-interactive h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold">الصيدليات المعتمدة</span>
                <h3 className="fw-bold mt-1 mb-0" style={{ color: '#1e293b' }}>
                  {kpis.total_pharmacies_visited} <small className="fs-6 text-muted">صيدلية</small>
                </h3>
              </div>
              <div className="clay-stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Building2 size={26} />
              </div>
            </div>
            <div className="small text-muted">
              تغطية جغرافية في بغداد والمحافظات
            </div>
          </div>
        </div>

        {/* Bonus Pieces */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card clay-card-interactive h-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold">قطع البونص الممنوحة</span>
                <h3 className="fw-bold mt-1 mb-0" style={{ color: '#b45309' }}>
                  {kpis.total_bonus_given} <small className="fs-6 text-muted">قطعة مجانية</small>
                </h3>
              </div>
              <div className="clay-stat-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                <Gift size={26} />
              </div>
            </div>
            <div className="small text-muted">
              حسب محرك شروط 10+1 و 5+1
            </div>
          </div>
        </div>

      </div>

      {/* ── Category Breakdown & Dynamic Visuals ─────────────────────────── */}
      <div className="row g-3 mb-4">
        
        {/* Category Breakdown Clay Card */}
        <div className="col-12 col-lg-7">
          <div className="clay-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">توزيع المبيعات حسب الصنف الدوائي</h5>
                <span className="text-muted small">نسبة الإقبال على القطرات، الكريمات، والمراهم</span>
              </div>
              <span className="clay-badge clay-badge-purple">تحديث حي</span>
            </div>

            {/* Visual Bars with Clay styling */}
            <div className="space-y-3 py-2">
              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span>💧 قطرات العيون والأذن (Drops)</span>
                  <span>45% — 520 قطعة</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '14px', background: '#e2e8f0', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)' }}>
                  <div className="progress-bar rounded-pill" style={{ width: '45%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span>🧴 كريمات العناية والترطيب (Creams)</span>
                  <span>35% — 410 قطعة</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '14px', background: '#e2e8f0', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)' }}>
                  <div className="progress-bar rounded-pill" style={{ width: '35%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span>🩹 مراهم ومضادات الالتهاب (Ointments)</span>
                  <span>20% — 230 قطعة</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '14px', background: '#e2e8f0', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)' }}>
                  <div className="progress-bar rounded-pill" style={{ width: '20%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 mt-3 rounded-4" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">💡 ملاحظة الذكاء الاصطناعي:</span>
                <span className="small fw-semibold text-primary">زيادة الطلب على القطرات بنسبة 24% في صيدليات بغداد</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Operations Widget */}
        <div className="col-12 col-lg-5">
          <div className="clay-card h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-2">إجراءات سريعة ومختصرات</h5>
              <p className="text-muted small mb-3">الوصول السريع للمهام اليومية للمندوب والإدارة</p>

              <div className="d-grid gap-2">
                <button 
                  onClick={() => onNavigate('scan')}
                  className="clay-btn clay-btn-secondary justify-content-start py-3 text-start"
                >
                  <PlusCircle size={20} className="text-primary" />
                  <div>
                    <div className="fw-bold">رفع فاتورة جديدة وتدقيق الـ OCR</div>
                    <div className="small text-muted" style={{ fontSize: '0.8rem' }}>مطابقة الأصناف وحساب البونص التلقائي</div>
                  </div>
                </button>

                <button 
                  onClick={() => onNavigate('pharmacies')}
                  className="clay-btn clay-btn-secondary justify-content-start py-3 text-start"
                >
                  <Building2 size={20} className="text-success" />
                  <div>
                    <div className="fw-bold">دليل الصيدليات والمناطق</div>
                    <div className="small text-muted" style={{ fontSize: '0.8rem' }}>إدارة العملاء، أرقام التواصل وسجل المعاملات</div>
                  </div>
                </button>

                <button 
                  onClick={() => onNavigate('billing')}
                  className="clay-btn clay-btn-secondary justify-content-start py-3 text-start"
                >
                  <Download size={20} className="text-purple" />
                  <div>
                    <div className="fw-bold">سجل الفواتير وتصدير Excel</div>
                    <div className="small text-muted" style={{ fontSize: '0.8rem' }}>مراجعة الاعتماد وتحميل التقارير الشاملة</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-3 pt-3 border-top text-center">
              <span className="small text-muted">حالة الخادم: متصل ومزامن بالكامل ✅</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Invoices Awaiting Review (Workflow) ───────────────────────────── */}
      <div className="clay-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0">الفواتير قيد التدقيق والمراجعة</h5>
            <span className="text-muted small">الفواتير المستخرجة حديثاً وبحاجة لاعتماد المشرف</span>
          </div>
          <button onClick={() => onNavigate('billing')} className="clay-btn clay-btn-secondary py-1 px-3 small">
            عرض كل الفواتير ({invoices.length})
          </button>
        </div>

        {pendingInvoices.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <CheckCircle2 size={36} className="text-success mx-auto mb-2" />
            <p className="mb-0 fw-semibold">جميع الفواتير معتمدة ولا توجد فواتير معلقة حالياً!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small">
                  <th>رقم الفاتورة</th>
                  <th>الصيدلية</th>
                  <th>المندوب</th>
                  <th>التاريخ</th>
                  <th>المبلغ</th>
                  <th>البونص</th>
                  <th>الحالة</th>
                  {user.role === 'admin' && <th className="text-center">إجراء الاعتماد</th>}
                </tr>
              </thead>
              <tbody>
                {pendingInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="fw-bold">{inv.invoice_number || 'بدون رقم'}</td>
                    <td>{inv.pharmacy_name}</td>
                    <td>{inv.rep_name}</td>
                    <td>{inv.invoice_date}</td>
                    <td className="fw-bold text-primary">{inv.total_sales_amount.toLocaleString()} د.ع</td>
                    <td>
                      <span className="clay-badge clay-badge-warning">
                        +{inv.total_bonus_count} مجاناً
                      </span>
                    </td>
                    <td>
                      <span className="clay-badge clay-badge-warning">
                        قيد المراجعة
                      </span>
                    </td>
                    {user.role === 'admin' && (
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => onApproveInvoice(inv.id)}
                            className="clay-btn clay-btn-success py-1 px-2"
                            style={{ fontSize: '0.8rem' }}
                            title="اعتماد الفاتورة"
                          >
                            <CheckCircle2 size={15} /> اعتماد
                          </button>
                          <button
                            onClick={() => onRejectInvoice(inv.id)}
                            className="clay-btn clay-btn-danger py-1 px-2"
                            style={{ fontSize: '0.8rem' }}
                            title="رفض الفاتورة"
                          >
                            <AlertCircle size={15} /> رفض
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
