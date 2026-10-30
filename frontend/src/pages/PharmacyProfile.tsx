import React, { useState } from 'react';
import { Pharmacy, Invoice } from '../types';
import { 
  Building2, Phone, MapPin, UserCheck, Calendar, FileText, 
  TrendingUp, Gift, Plus, ArrowUpRight, CheckCircle2, Search
} from 'lucide-react';

interface PharmacyProfileProps {
  pharmacies: Pharmacy[];
  invoices: Invoice[];
  onStartInvoiceForPharmacy: (pharmacyId: string) => void;
  onScheduleVisit: (pharmacyId: string) => void;
}

export const PharmacyProfile: React.FC<PharmacyProfileProps> = ({
  pharmacies,
  invoices,
  onStartInvoiceForPharmacy,
  onScheduleVisit
}) => {
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(pharmacies[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const currentPharmacy = pharmacies.find(p => p.id === selectedPharmacyId) || pharmacies[0];
  const pharmacyInvoices = invoices.filter(i => i.pharmacy_id === currentPharmacy?.id);

  const totalSales = pharmacyInvoices.reduce((s, i) => s + i.total_sales_amount, 0);
  const totalPieces = pharmacyInvoices.reduce((s, i) => s + i.total_pieces_count, 0);
  const totalBonus = pharmacyInvoices.reduce((s, i) => s + i.total_bonus_count, 0);

  const filteredPharmacies = pharmacies.filter(p => 
    p.name.includes(searchQuery) || p.city.includes(searchQuery)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* ── Pharmacy Selector & Search Header ─────────────────────────────── */}
      <div className="clay-card mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="clay-badge clay-badge-primary">
              <Building2 size={14} /> ملف الصيدلية والعميل 360°
            </span>
            <span className="text-muted small">سجل المشتريات، البونص، والموقع</span>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
            {currentPharmacy?.name}
          </h2>
          <div className="d-flex flex-wrap gap-3 small text-muted">
            <span className="d-flex align-items-center gap-1">
              <MapPin size={15} className="text-primary" /> {currentPharmacy?.city} — {currentPharmacy?.address}
            </span>
            <span className="d-flex align-items-center gap-1">
              <Phone size={15} className="text-success" /> {currentPharmacy?.phone}
            </span>
            <span className="d-flex align-items-center gap-1">
              <UserCheck size={15} className="text-purple" /> المندوب المسؤول: {currentPharmacy?.assigned_rep_name || 'غير محدد'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-2">
          <button 
            onClick={() => onStartInvoiceForPharmacy(currentPharmacy.id)} 
            className="clay-btn clay-btn-primary"
          >
            <Plus size={18} />
            <span>فاتورة جديدة للصيدلية</span>
          </button>
          <button 
            onClick={() => onScheduleVisit(currentPharmacy.id)} 
            className="clay-btn clay-btn-secondary"
          >
            <Calendar size={18} />
            <span>حجز زيارة</span>
          </button>
        </div>
      </div>

      <div className="row g-4">
        
        {/* ── Left Sidebar: Pharmacy Directory ────────────────────────────── */}
        <div className="col-12 col-lg-4">
          <div className="clay-card h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Building2 size={18} className="text-primary" /> قائمة الصيدليات
            </h5>

            {/* Search Input */}
            <div className="mb-3">
              <div className="position-relative">
                <input
                  type="text"
                  className="clay-input"
                  placeholder="ابحث بالاسم أو المدينة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredPharmacies.map(ph => (
                <div
                  key={ph.id}
                  onClick={() => setSelectedPharmacyId(ph.id)}
                  className={`p-3 rounded-4 cursor-pointer transition-all ${ph.id === selectedPharmacyId ? 'bg-primary text-white shadow' : 'bg-light text-dark'}`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="fw-bold">{ph.name}</span>
                    <span className={`badge ${ph.id === selectedPharmacyId ? 'bg-white text-primary' : 'bg-secondary-subtle text-secondary'}`}>
                      {ph.city}
                    </span>
                  </div>
                  <div className={`small ${ph.id === selectedPharmacyId ? 'text-white-50' : 'text-muted'}`}>
                    📞 {ph.phone}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Right Content: Pharmacy Analytics & Ledger ─────────────────── */}
        <div className="col-12 col-lg-8">
          
          {/* Pharmacy Mini-KPIs */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-4">
              <div className="clay-card text-center p-3">
                <span className="text-muted small">إجمالي المشتريات</span>
                <h4 className="fw-bold text-primary mt-1 mb-0">
                  {totalSales.toLocaleString()} <small className="fs-6">د.ع</small>
                </h4>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="clay-card text-center p-3">
                <span className="text-muted small">عدد الفواتير الصادرة</span>
                <h4 className="fw-bold text-success mt-1 mb-0">
                  {pharmacyInvoices.length} فواتير
                </h4>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="clay-card text-center p-3">
                <span className="text-muted small">مجموع البونص الممنوح</span>
                <h4 className="fw-bold text-warning mt-1 mb-0">
                  +{totalBonus} قطعة مجاناً
                </h4>
              </div>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="clay-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">سجل فواتير ومعاملات {currentPharmacy?.name}</h5>
              <span className="text-muted small">{pharmacyInvoices.length} معاملة</span>
            </div>

            {pharmacyInvoices.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FileText size={36} className="text-secondary mx-auto mb-2 opacity-50" />
                <p className="mb-0">لم تسجل أي فواتير لهذه الصيدلية بعد.</p>
                <button 
                  onClick={() => onStartInvoiceForPharmacy(currentPharmacy.id)}
                  className="clay-btn clay-btn-primary mt-3 py-1 px-3 small"
                >
                  رفع أول فاتورة للصيدلية
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr className="small text-secondary">
                      <th>رقم الفاتورة</th>
                      <th>تاريخ الفاتورة</th>
                      <th>المندوب</th>
                      <th>المبلغ</th>
                      <th>القطع</th>
                      <th>البونص</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacyInvoices.map(inv => (
                      <tr key={inv.id}>
                        <td className="fw-bold">{inv.invoice_number || 'بدون رقم'}</td>
                        <td>{inv.invoice_date}</td>
                        <td>{inv.rep_name}</td>
                        <td className="fw-bold text-primary">{inv.total_sales_amount.toLocaleString()} د.ع</td>
                        <td>{inv.total_pieces_count} قطعة</td>
                        <td>
                          <span className="clay-badge clay-badge-warning py-1 px-2">
                            +{inv.total_bonus_count} مجاناً
                          </span>
                        </td>
                        <td>
                          <span className={`clay-badge ${inv.status === 'approved' ? 'clay-badge-success' : inv.status === 'rejected' ? 'clay-badge-danger' : 'clay-badge-warning'}`}>
                            {inv.status === 'approved' ? 'معتمدة ✅' : inv.status === 'rejected' ? 'مرفوضة ❌' : 'قيد المراجعة ⏳'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
