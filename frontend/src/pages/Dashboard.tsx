import React from 'react';
import { User, Invoice, KPISummary, Pharmacy } from '../types';
import {
  TrendingUp, FileText, Building2, Gift, FilePlus, Calendar,
  Download, CheckCircle2, Clock, AlertCircle, ArrowUpRight, Sparkles
} from 'lucide-react';

interface DashboardProps {
  user: User;
  kpis: KPISummary;
  invoices: Invoice[];
  pharmacies: Pharmacy[];
  onNavigate: (tab: string) => void;
  onApproveInvoice: (id: string) => void;
  onRejectInvoice: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user, kpis, invoices, pharmacies, onNavigate, onApproveInvoice, onRejectInvoice
}) => {
  const pendingInvoices = invoices.filter(i => i.status === 'pending_review');
  const isRep = user.role === 'medical_rep';
  const isAdmin = user.role === 'admin';

  const dateStr = new Date().toLocaleDateString('ar-IQ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="animate-in">

      {/* ── Welcome Banner ──────────────────────────────────────────────────── */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">
                <Sparkles size={13} />
                {isAdmin ? 'صلاحيات الإدارة الكاملة' : isRep ? 'لوحة المندوب الميداني' : 'لوحة المشرف'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{dateStr}</span>
            </div>
            <h2 style={{ fontWeight: 900, color: 'var(--gray-900)', margin: 0, fontSize: '1.4rem' }}>
              أهلاً بك، {user.full_name} 👋
            </h2>
            <p style={{ color: 'var(--gray-500)', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
              {isAdmin
                ? 'متابعة شبكة المبيعات، اعتماد الفواتير، وتحليل البونص على مستوى الصيدليات.'
                : 'سجل زياراتك اليومية وأضف فواتير الصيدليات بالإدخال اليدوي أو بالذكاء الاصطناعي.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isRep && (
              <button onClick={() => onNavigate('add-invoice')} className="btn-clay btn-primary">
                <FilePlus size={18} /> إضافة فاتورة جديدة
              </button>
            )}
            <button onClick={() => onNavigate('visits')} className="btn-clay btn-secondary">
              <Calendar size={18} /> جدول الزيارات
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Stats Grid ─────────────────────────────────────────────────── */}
      {(() => {
        const revenue = Number(kpis?.total_sales_amount ?? kpis?.total_revenue ?? 0);
        const invoicesCount = Number(kpis?.total_invoices ?? 0);
        const pharmaciesCount = Number(kpis?.total_pharmacies_visited || pharmacies.length || 0);
        const bonusCount = Number(kpis?.total_bonus_pieces ?? kpis?.total_bonus_given ?? 0);

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

            <div className="stat-card card-hover">
              <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">إجمالي المبيعات</div>
                <div className="stat-value">{revenue.toLocaleString()}</div>
                <div className="stat-sub">دينار عراقي</div>
              </div>
            </div>

            <div className="stat-card card-hover">
              <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">الفواتير المعالجة</div>
                <div className="stat-value">{invoicesCount}</div>
                <div className="stat-sub">
                  {pendingInvoices.length > 0 ? (
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                      <Clock size={11} /> {pendingInvoices.length} بانتظار المراجعة
                    </span>
                  ) : (
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>كل الفواتير معتمدة ✓</span>
                  )}
                </div>
              </div>
            </div>

            <div className="stat-card card-hover">
              <div className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Building2 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">الصيدليات المعتمدة</div>
                <div className="stat-value">{pharmaciesCount}</div>
                <div className="stat-sub">صيدلية مسجلة</div>
              </div>
            </div>

            <div className="stat-card card-hover">
              <div className="stat-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                <Gift size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">قطع البونص الممنوحة</div>
                <div className="stat-value" style={{ color: 'var(--warning)' }}>+{bonusCount}</div>
                <div className="stat-sub">قطعة مجانية (10+1)</div>
              </div>
            </div>

          </div>
        );
      })()}

      {/* ── Mid Section ────────────────────────────────────────────────────── */}
      <div className="dashboard-mid-grid">

        {/* Sales Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h5 style={{ fontWeight: 800, margin: 0 }}>توزيع المبيعات</h5>
            <span className="badge badge-purple">
              <Sparkles size={12} /> تحديث حي
            </span>
          </div>

          {[
            { label: '💧 قطرات (Drops)', pct: 45, color: 'var(--primary)' },
            { label: '🧴 كريمات (Creams)', pct: 35, color: 'var(--success)' },
            { label: '🩹 مراهم (Ointments)', pct: 20, color: 'var(--warning)' }
          ].map(b => (
            <div key={b.label} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span>{b.label}</span>
                <span style={{ color: b.color }}>{b.pct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h5 style={{ fontWeight: 800, marginBottom: '1rem' }}>إجراءات سريعة</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {isRep && (
              <button
                onClick={() => onNavigate('add-invoice')}
                className="btn-clay btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.875rem 1rem', textAlign: 'right' }}
              >
                <FilePlus size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>رفع فاتورة جديدة</div>
                  <div style={{ fontSize: '0.77rem', color: 'var(--gray-400)', marginTop: 2 }}>يدوي، صورة أو PDF مع OCR</div>
                </div>
              </button>
            )}

            <button
              onClick={() => onNavigate('pharmacies')}
              className="btn-clay btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.875rem 1rem', textAlign: 'right' }}
            >
              <Building2 size={20} style={{ color: 'var(--purple)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>دليل الصيدليات</div>
                <div style={{ fontSize: '0.77rem', color: 'var(--gray-400)', marginTop: 2 }}>إدارة العملاء وسجل المعاملات</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('billing')}
              className="btn-clay btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.875rem 1rem', textAlign: 'right' }}
            >
              <Download size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>سجل الفواتير والتقارير</div>
                <div style={{ fontSize: '0.77rem', color: 'var(--gray-400)', marginTop: 2 }}>مراجعة الاعتماد وتصدير Excel</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Pending Invoices Table ─────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h5 style={{ fontWeight: 800, margin: 0 }}>الفواتير قيد المراجعة</h5>
            <span style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>الفواتير الجديدة بانتظار اعتماد المشرف</span>
          </div>
          <button onClick={() => onNavigate('billing')} className="btn-clay btn-secondary btn-sm">
            عرض الكل ({invoices.length})
          </button>
        </div>

        {pendingInvoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
            <CheckCircle2 size={40} style={{ color: 'var(--success)', display: 'block', margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 700, margin: 0 }}>لا توجد فواتير معلقة — كل شيء معتمد! ✅</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="clay-table">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>الصيدلية</th>
                  <th>المندوب</th>
                  <th>التاريخ</th>
                  <th>المبلغ</th>
                  <th>البونص</th>
                  <th>الحالة</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>إجراء</th>}
                </tr>
              </thead>
              <tbody>
                {pendingInvoices.map(inv => {
                  const cleanDate = (inv.invoice_date || '').split('T')[0];
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700, color: 'var(--gray-900)' }}>
                        <button
                          onClick={() => onNavigate('billing')}
                          className="btn-link"
                          style={{ fontWeight: 800, color: 'var(--primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          title="عرض تفاصيل الفاتورة في السجل"
                        >
                          {inv.invoice_number || '—'}
                        </button>
                      </td>
                      <td style={{ color: 'var(--gray-600)' }}>{inv.pharmacy_name}</td>
                      <td style={{ color: 'var(--gray-600)' }}>{inv.rep_name}</td>
                      <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{cleanDate}</td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{Number(inv.total_sales_amount || 0).toLocaleString()} د.ع</td>
                      <td><span className="badge badge-warning">+{inv.total_bonus_count} 🎁</span></td>
                      <td><span className="badge badge-warning"><Clock size={12} /> قيد المراجعة</span></td>
                      {isAdmin && (
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                            <button onClick={() => onApproveInvoice(inv.id)} className="btn-clay btn-success btn-sm">
                              <CheckCircle2 size={14} /> اعتماد
                            </button>
                            <button onClick={() => onRejectInvoice(inv.id)} className="btn-clay btn-danger btn-sm">
                              <AlertCircle size={14} /> رفض
                            </button>
                          </div>
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

      <style>{`
        @media (max-width: 768px) {
          .mid-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
