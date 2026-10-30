import React, { useState } from 'react';
import { User, Invoice, Pharmacy } from '../types';
import { 
  FileText, Download, CheckCircle2, XCircle, AlertCircle, 
  Eye, Filter, Calendar, Building2, Gift, DollarSign, Search
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

  const totalSales = filteredInvoices.reduce((s, i) => s + i.total_sales_amount, 0);
  const approvedSales = filteredInvoices.filter(i => i.status === 'approved').reduce((s, i) => s + i.total_sales_amount, 0);
  const pendingSales = filteredInvoices.filter(i => i.status === 'pending_review').reduce((s, i) => s + i.total_sales_amount, 0);
  const totalBonusPieces = filteredInvoices.reduce((s, i) => s + i.total_bonus_count, 0);

  const handleExportCSV = () => {
    // Generate CSV client-side with UTF-8 BOM for Arabic compatibility in Excel
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

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="clay-card mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="clay-badge clay-badge-primary">
              <FileText size={14} /> السجل المالي والفواتير (Billing Ledger)
            </span>
            <span className="text-muted small">المطابقة، التدقيق وتصدير التقارير</span>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
            سجل فواتير المبيعات والاعتماد
          </h2>
          <p className="text-muted mb-0 small">
            استعراض كافة الفواتير، تدقيق نسب البونص المستخرجة بالـ OCR، واعتماد الصرف أو الرفض.
          </p>
        </div>

        <button 
          onClick={handleExportCSV} 
          className="clay-btn clay-btn-success"
        >
          <Download size={18} />
          <span>تصدير إلى Excel / CSV</span>
        </button>
      </div>

      {/* ── Financial Summary Cards ───────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card text-center p-3">
            <span className="text-muted small">إجمالي مبالغ الفواتير المعروضة</span>
            <h4 className="fw-bold text-primary mt-1 mb-0">
              {totalSales.toLocaleString()} <small className="fs-6">د.ع</small>
            </h4>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card text-center p-3">
            <span className="text-muted small">المبالغ المعتمدة رسمياً</span>
            <h4 className="fw-bold text-success mt-1 mb-0">
              {approvedSales.toLocaleString()} <small className="fs-6">د.ع</small>
            </h4>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card text-center p-3">
            <span className="text-muted small">فواتير قيد التدقيق</span>
            <h4 className="fw-bold text-warning mt-1 mb-0">
              {pendingSales.toLocaleString()} <small className="fs-6">د.ع</small>
            </h4>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="clay-card text-center p-3">
            <span className="text-muted small">إجمالي بونص الأصناف</span>
            <h4 className="fw-bold text-purple mt-1 mb-0">
              +{totalBonusPieces} <small className="fs-6">قطعة مجانية</small>
            </h4>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="clay-card mb-4 p-3">
        <div className="row g-2 align-items-center">
          
          <div className="col-12 col-md-4">
            <input 
              type="text" 
              className="clay-input" 
              placeholder="🔍 بحث برقم الفاتورة..."
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
          </div>

          <div className="col-6 col-md-4">
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

          <div className="col-6 col-md-4">
            <select 
              className="clay-input"
              value={pharmacyFilter}
              onChange={(e) => setPharmacyFilter(e.target.value)}
            >
              <option value="all">كل الصيدليات</option>
              {pharmacies.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ── Invoices Ledger Table ─────────────────────────────────────────── */}
      <div className="clay-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">قائمة الفواتير الموثقة ({filteredInvoices.length})</h5>
          <span className="text-muted small">مرتبة تنازلياً حسب تاريخ الإصدار</span>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FileText size={40} className="text-secondary mx-auto mb-2 opacity-50" />
            <p className="mb-0">لا توجد فواتير مطابقة لمعايير البحث الحالية.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="small text-secondary">
                  <th>رقم الفاتورة</th>
                  <th>الصيدلية</th>
                  <th>المندوب</th>
                  <th>تاريخ الفاتورة</th>
                  <th>المبلغ</th>
                  <th>القطع</th>
                  <th>البونص</th>
                  <th>الحالة</th>
                  <th>معاينة الأصل</th>
                  {user.role === 'admin' && <th className="text-center">إجراء الاعتماد</th>}
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="fw-bold">{inv.invoice_number || 'بدون رقم'}</td>
                    <td>{inv.pharmacy_name}</td>
                    <td>{inv.rep_name}</td>
                    <td>{inv.invoice_date}</td>
                    <td className="fw-bold text-primary">{inv.total_sales_amount.toLocaleString()} د.ع</td>
                    <td>{inv.total_pieces_count} قطعة</td>
                    <td>
                      <span className="clay-badge clay-badge-warning py-1 px-2">
                        +{inv.total_bonus_count} مجاناً
                      </span>
                    </td>
                    <td>
                      <span className={`clay-badge ${inv.status === 'approved' ? 'clay-badge-success' : inv.status === 'rejected' ? 'clay-badge-danger' : 'clay-badge-warning'}`}>
                        {inv.status === 'approved' ? 'معتمدة ✅' : inv.status === 'rejected' ? 'مرفوضة ❌' : 'قيد التدقيق ⏳'}
                      </span>
                      {inv.rejection_reason && (
                        <div className="small text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                          السبب: {inv.rejection_reason}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setPreviewImageUrl(inv.image_url)}
                        className="btn btn-sm btn-light border py-1 px-2 text-primary"
                        title="معاينة صورة الفاتورة"
                      >
                        <Eye size={15} />
                      </button>
                    </td>

                    {user.role === 'admin' && (
                      <td className="text-center">
                        {inv.status === 'pending_review' ? (
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              onClick={() => onApproveInvoice(inv.id)}
                              className="clay-btn clay-btn-success py-1 px-2"
                              style={{ fontSize: '0.8rem' }}
                            >
                              <CheckCircle2 size={14} /> اعتماد
                            </button>
                            <button
                              onClick={() => setRejectingInvoiceId(inv.id)}
                              className="clay-btn clay-btn-danger py-1 px-2"
                              style={{ fontSize: '0.8rem' }}
                            >
                              <XCircle size={14} /> رفض
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted small">تم اتخاذ القرار</span>
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

      {/* ── Image Preview Modal ───────────────────────────────────────────── */}
      {previewImageUrl && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)', zIndex: 1060 }}
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="clay-card p-3 text-center" style={{ maxWidth: '600px', background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold">معاينة صورة الفاتورة الأصلية (OCR Input)</span>
              <button onClick={() => setPreviewImageUrl(null)} className="btn btn-sm btn-light rounded-circle">✕</button>
            </div>
            <img 
              src={previewImageUrl} 
              alt="صورة الفاتورة" 
              className="img-fluid rounded-3" 
              style={{ maxHeight: '75vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      {/* ── Rejection Reason Modal ────────────────────────────────────────── */}
      {rejectingInvoiceId && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)', zIndex: 1060 }}
        >
          <div className="clay-card p-4" style={{ maxWidth: '480px', background: '#ffffff' }}>
            <h5 className="fw-bold mb-2 text-danger d-flex align-items-center gap-2">
              <AlertCircle size={20} /> سبب رفض الفاتورة
            </h5>
            <p className="text-muted small mb-3">
              يرجى توضيح سبب الرفض ليتم إشعار المندوب لتصحيح الفاتورة أو إعادة المسح الضوئي.
            </p>

            <textarea
              className="clay-input mb-3"
              rows={3}
              placeholder="مثال: ختم الصيدلية غير واضح، أو وجود اختلاف في كميات القطرات..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            ></textarea>

            <div className="d-flex justify-content-end gap-2">
              <button 
                onClick={() => { setRejectingInvoiceId(null); setRejectionReason(''); }} 
                className="clay-btn clay-btn-secondary"
              >
                إلغاء
              </button>
              <button 
                onClick={handleConfirmReject} 
                className="clay-btn clay-btn-danger"
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
