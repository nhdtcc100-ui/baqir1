import React, { useMemo, useState } from 'react';
import { User, Invoice, KPISummary, Pharmacy } from '../types';
import { detectDosageFormClient } from '../utils/invoiceTableParser';
import { DownloadSheetButtons } from '../components/DownloadSheetButtons';
import { resolveAccountSheetId } from '../utils/sheetDownload';
import {
  TrendingUp, FileText, Building2, Gift, FilePlus, Calendar,
  Download, CheckCircle2, Clock, AlertCircle, Sparkles
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
  const accountSheetId = resolveAccountSheetId(user);
  const [sheetDownloadNotice, setSheetDownloadNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
            <button onClick={() => onNavigate('add-invoice')} className="btn-clay btn-primary" style={{ background: '#059669', borderColor: '#047857' }}>
              <FilePlus size={18} /> إضافة فاتورة جديدة
            </button>
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

        {/* Sales Breakdown — Real Live Percentages Calculated From Actual Invoices */}
        {(() => {
          const buckets = {
            drop: { label: '💧 قطرات (Drops)', amount: 0, qty: 0, color: 'var(--primary)' },
            cream: { label: '🧴 كريمات (Creams)', amount: 0, qty: 0, color: 'var(--success)' },
            ointment: { label: '🩹 مراهم (Ointments)', amount: 0, qty: 0, color: 'var(--warning)' },
            tablet: { label: '💊 حبوب وأخرى (Tablets)', amount: 0, qty: 0, color: '#7c3aed' }
          };

          for (const inv of invoices) {
            for (const it of (inv.items || [])) {
              const rawForm = String((it as any).dosage_form || '').trim();
              const form = ['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(rawForm)
                ? rawForm
                : detectDosageFormClient(it.product_name_snapshot || '');
              const lineAmount = Number(it.line_total || (Number(it.sold_quantity || 0) * Number(it.historical_unit_price || 0)) || 0);
              const lineQty = Number(it.sold_quantity || 0);
              const target =
                form === 'قطرة' ? buckets.drop
                  : form === 'كريم' ? buckets.cream
                  : form === 'مرهم' ? buckets.ointment
                  : buckets.tablet;
              target.amount += lineAmount;
              target.qty += lineQty;
            }
          }

          const allCats = [buckets.drop, buckets.cream, buckets.ointment, buckets.tablet];
          const totalAmountSum = allCats.reduce((s, c) => s + c.amount, 0);
          const totalQtySum = allCats.reduce((s, c) => s + c.qty, 0);
          const denom = totalAmountSum > 0 ? totalAmountSum : totalQtySum;

          const visibleCats = (buckets.tablet.amount > 0 || buckets.tablet.qty > 0)
            ? allCats
            : [buckets.drop, buckets.cream, buckets.ointment];

          const breakdownRows = visibleCats.map(c => {
            const val = totalAmountSum > 0 ? c.amount : c.qty;
            const rawPct = denom > 0 ? (val / denom) * 100 : 0;
            const pct = Math.round(rawPct * 10) / 10;
            return { ...c, pct };
          });

          return (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h5 style={{ fontWeight: 800, margin: 0 }}>توزيع المبيعات</h5>
                <span className="badge badge-purple">
                  <Sparkles size={12} /> {invoices.length > 0 ? `نسبة حقيقية (${invoices.length} فاتورة)` : 'لا توجد مبيعات بعد'}
                </span>
              </div>

              {breakdownRows.map(b => (
                <div key={b.label} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.83rem', fontWeight: 600, marginBottom: '0.35rem', gap: '0.5rem' }}>
                    <span>{b.label}</span>
                    <span style={{ color: b.color, fontWeight: 800 }}>
                      {b.pct}%
                      {b.amount > 0 && (
                        <span style={{ fontSize: '0.73rem', color: 'var(--gray-500)', fontWeight: 600, marginRight: 6 }}>
                          ({b.amount.toLocaleString()} د.ع)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(100, b.pct)}%`, background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Quick Actions */}
        <div className="card">
          <h5 style={{ fontWeight: 800, marginBottom: '1rem' }}>إجراءات سريعة</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            <button
              onClick={() => onNavigate('add-invoice')}
              className="btn-clay btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.875rem 1rem', textAlign: 'right', borderColor: '#a7f3d0', background: '#ecfdf5' }}
            >
              <FilePlus size={20} style={{ color: '#059669', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#065f46' }}>رفع / إضافة فاتورة جديدة</div>
                <div style={{ fontSize: '0.77rem', color: '#047857', marginTop: 2 }}>كاميرا الموبايل، صورة أو PDF أو إدخال يدوي</div>
              </div>
            </button>

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

            {accountSheetId && (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '0.8rem 0.9rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#065f46', marginBottom: '0.45rem' }}>
                  📲 تنزيل كوكل شيت الخاص بحسابك على الهاتف
                </div>
                <DownloadSheetButtons
                  sheetId={accountSheetId}
                  sheetUrl={user.sheet_url}
                  accountName={user.full_name}
                  onSuccess={text => setSheetDownloadNotice({ type: 'success', text })}
                  onError={text => setSheetDownloadNotice({ type: 'error', text })}
                />
                {sheetDownloadNotice && (
                  <div
                    style={{
                      marginTop: '0.45rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: sheetDownloadNotice.type === 'success' ? '#047857' : '#b91c1c'
                    }}
                  >
                    {sheetDownloadNotice.text}
                  </div>
                )}
              </div>
            )}
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
          <>
            <div className="desktop-table-view" style={{ overflowX: 'auto' }}>
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

            <div className="mobile-cards-view">
              {pendingInvoices.map(inv => {
                const cleanDate = (inv.invoice_date || '').split('T')[0];
                return (
                  <div key={inv.id} className="mobile-invoice-card" style={{ borderRight: '4px solid var(--warning)' }}>
                    <div className="mobile-card-header">
                      <button
                        type="button"
                        onClick={() => onNavigate('billing')}
                        className="mobile-invoice-number-btn"
                      >
                        فاتورة #{inv.invoice_number || '—'}
                      </button>
                      <span className="badge badge-warning"><Clock size={12} /> قيد المراجعة</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--gray-900)' }}>
                      🏥 {inv.pharmacy_name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                      <span>👤 {inv.rep_name}</span>
                      <span>📅 {cleanDate}</span>
                    </div>
                    <div className="mobile-card-metrics" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                      <div className="mobile-metric">
                        <span className="mobile-metric-label">المبلغ</span>
                        <span className="mobile-metric-val" style={{ color: 'var(--primary)' }}>
                          {Number(inv.total_sales_amount || 0).toLocaleString()} د.ع
                        </span>
                      </div>
                      <div className="mobile-metric">
                        <span className="mobile-metric-label">البونص</span>
                        <span className="badge badge-warning" style={{ width: 'fit-content' }}>+{inv.total_bonus_count} 🎁</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="mobile-card-actions">
                        <button onClick={() => onApproveInvoice(inv.id)} className="btn-clay btn-success btn-sm flex-1" style={{ justifyContent: 'center' }}>
                          <CheckCircle2 size={14} /> اعتماد
                        </button>
                        <button onClick={() => onRejectInvoice(inv.id)} className="btn-clay btn-danger btn-sm flex-1" style={{ justifyContent: 'center' }}>
                          <AlertCircle size={14} /> رفض
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
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
