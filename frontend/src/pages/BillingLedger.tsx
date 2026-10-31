import React, { useState } from 'react';
import { User, Invoice, Pharmacy } from '../types';
import { 
  FileText, Download, CheckCircle2, AlertCircle, 
  Eye, Filter, Calendar, Building2, Gift, Search, X, Check, Clock
} from 'lucide-react';

interface BillingLedgerProps {
  user: User;
  invoices: Invoice[];
  pharmacies: Pharmacy[];
  onApproveInvoice: (id: string) => void;
  onRejectInvoice: (id: string, reason: string) => void;
}

export const BillingLedger: React.FC<BillingLedgerProps> = ({
  user,
  invoices,
  pharmacies,
  onApproveInvoice,
  onRejectInvoice
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('all');
  const [pharmacyFilter, setPharmacyFilter] = useState<string>('all');
  const [searchNumber, setSearchNumber] = useState('');

  // Image Preview Modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Reject Reason Modal
  const [rejectingInvoiceId, setRejectingInvoiceId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (pharmacyFilter !== 'all' && inv.pharmacy_id !== pharmacyFilter) return false;
    if (searchNumber && !inv.invoice_number?.toLowerCase().includes(searchNumber.toLowerCase())) return false;
    return true;
  });

  const totalSales = filteredInvoices.reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const approvedSales = filteredInvoices.filter(i => i.status === 'approved').reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const pendingSales = filteredInvoices.filter(i => i.status === 'pending_review').reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const totalBonusPieces = filteredInvoices.reduce((s, i) => s + Number(i.total_bonus_count || 0), 0);

  const handleExportCSV = () => {
    const headers = ['رقم الفاتورة', 'الصيدلية', 'المندوب', 'التاريخ', 'المبلغ (د.ع)', 'القطع', 'البونص', 'الحالة', 'سبب الرفض'];
    const rows = filteredInvoices.map(i => [
      i.invoice_number || '',
      `"${i.pharmacy_name || ''}"`,
      `"${i.rep_name || ''}"`,
      i.invoice_date,
      i.total_sales_amount,
      i.total_pieces_count,
      i.total_bonus_count,
      i.status === 'approved' ? 'معتمدة' : i.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة',
      `"${i.rejection_reason || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تقرير_الفواتير_والمبيعات_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmReject = () => {
    if (!rejectingInvoiceId) return;
    if (!rejectionReason.trim()) {
      alert('يرجى كتابة سبب رفض الفاتورة');
      return;
    }
    onRejectInvoice(rejectingInvoiceId, rejectionReason);
    setRejectingInvoiceId(null);
    setRejectionReason('');
  };

  const isAdmin = user.role === 'admin' || user.role === 'supervisor';

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">
              <FileText size={13} /> السجل المالي للفواتير
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>قاعدة بيانات Supabase Docker</span>
          </div>
          <h1 className="page-title">سجل فواتير المبيعات والاعتماد</h1>
          <p className="page-subtitle">
            استعراض وتدقيق الفواتير المرفوعة بواسطة المندوبين، مراجعة بونص الأصناف (10+1)، واعتماد الصرف أو الرفض.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-clay btn-secondary">
          <Download size={18} />
          <span>تصدير تقرير Excel (CSV)</span>
        </button>
      </div>

      {/* ── Stat Summary Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">إجمالي الفواتير المعروضة</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{totalSales.toLocaleString()}</div>
            <div className="stat-sub">دينار عراقي</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">المبالغ المعتمدة رسمياً</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>{approvedSales.toLocaleString()}</div>
            <div className="stat-sub">دينار عراقي</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">مبالغ قيد المراجعة</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{pendingSales.toLocaleString()}</div>
            <div className="stat-sub">دينار عراقي</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">إجمالي بونص الأصناف</div>
            <div className="stat-value" style={{ color: 'var(--purple)' }}>+{totalBonusPieces}</div>
            <div className="stat-sub">قطعة مجانية ممنوحة</div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <input 
              type="text" 
              className="clay-input" 
              placeholder="🔍 بحث برقم الفاتورة..."
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
          </div>

          <div>
            <select 
              className="clay-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">جميع الحالات ({invoices.length})</option>
              <option value="pending_review">قيد المراجعة والتدقيق</option>
              <option value="approved">معتمدة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>

          <div>
            <select 
              className="clay-input"
              value={pharmacyFilter}
              onChange={(e) => setPharmacyFilter(e.target.value)}
            >
              <option value="all">كل الصيدليات</option>
              {pharmacies.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h5 style={{ fontWeight: 800, margin: 0 }}>
            قائمة الفواتير الموثقة ({filteredInvoices.length})
          </h5>
          <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
            مخزنة في PostgreSQL عبر سوبا بيس
          </span>
        </div>

        {filteredInvoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--gray-400)' }}>
            <FileText size={48} style={{ color: 'var(--gray-300)', display: 'block', margin: '0 auto 1rem' }} />
            <h4 style={{ fontWeight: 800, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>لا توجد فواتير مسجلة حالياً</h4>
            <p style={{ fontSize: '0.88rem', maxWidth: 400, margin: '0 auto' }}>
              تم تنظيف بيانات الاختبار بالكامل. يمكن للمندوب إضافة الفواتير الجديدة يدوياً أو عبر رفع صورة أو ملف PDF.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="clay-table">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>الصيدلية</th>
                  <th>المندوب</th>
                  <th>تاريخ الفاتورة</th>
                  <th>المبلغ الإجمالي</th>
                  <th>القطع</th>
                  <th>البونص</th>
                  <th>الحالة</th>
                  <th>مستند الفاتورة</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>إجراء الاعتماد</th>}
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 800, color: 'var(--gray-900)' }}>{inv.invoice_number || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{inv.pharmacy_name || 'صيدلية معتمدة'}</td>
                    <td style={{ color: 'var(--gray-600)' }}>{inv.rep_name || 'مندوب ميداني'}</td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{inv.invoice_date}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      {Number(inv.total_sales_amount).toLocaleString()} د.ع
                    </td>
                    <td>{inv.total_pieces_count} قطعة</td>
                    <td>
                      <span className={`badge ${inv.total_bonus_count > 0 ? 'badge-warning' : 'badge-gray'}`}>
                        +{inv.total_bonus_count} 🎁
                      </span>
                    </td>
                    <td>
                      {inv.status === 'approved' ? (
                        <span className="badge badge-success"><CheckCircle2 size={12} /> معتمدة</span>
                      ) : inv.status === 'rejected' ? (
                        <span className="badge badge-danger" title={inv.rejection_reason}><AlertCircle size={12} /> مرفوضة</span>
                      ) : (
                        <span className="badge badge-warning"><Clock size={12} /> قيد التدقيق</span>
                      )}
                    </td>
                    <td>
                      {inv.image_url ? (
                        <button
                          onClick={() => setPreviewImageUrl(inv.image_url)}
                          className="btn-clay btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Eye size={14} /> معاينة
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>إدخال يدوي</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td>
                        {inv.status === 'pending_review' ? (
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => onApproveInvoice(inv.id)}
                              className="btn-clay btn-success btn-sm"
                            >
                              <CheckCircle2 size={14} /> اعتماد
                            </button>
                            <button
                              onClick={() => setRejectingInvoiceId(inv.id)}
                              className="btn-clay btn-danger btn-sm"
                            >
                              <AlertCircle size={14} /> رفض
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'center', display: 'block' }}>
                            مكتملة
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Image Preview Modal ────────────────────────────────────────────── */}
      {previewImageUrl && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: 700, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h5 style={{ fontWeight: 800, margin: 0 }}>مستند الفاتورة الأصلي</h5>
              <button
                onClick={() => setPreviewImageUrl(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ overflow: 'auto', textAlign: 'center' }}>
              <img src={previewImageUrl} alt="أصل الفاتورة" style={{ maxWidth: '100%', borderRadius: 12 }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Reason Modal ────────────────────────────────────────────── */}
      {rejectingInvoiceId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: 450, width: '100%' }}>
            <h5 style={{ fontWeight: 800, marginBottom: '0.75rem', color: 'var(--danger)' }}>
              تأكيد رفض الفاتورة
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
              يرجى كتابة سبب الرفض ليظهر للمندوب ويتمكن من تصحيح الفاتورة أو إعادة رفعها:
            </p>
            <textarea
              className="clay-input"
              rows={3}
              placeholder="مثال: الصورة غير واضحة، أو الكمية غير متطابقة مع الختم"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setRejectingInvoiceId(null); setRejectionReason(''); }}
                className="btn-clay btn-secondary btn-sm"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmReject}
                className="btn-clay btn-danger btn-sm"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
