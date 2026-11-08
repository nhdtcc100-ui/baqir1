import React, { useState } from 'react';
import { Pharmacy, Invoice } from '../types';
import { 
  Building2, Phone, MapPin, UserCheck, Calendar, FileText, 
  TrendingUp, Gift, Plus, ArrowUpRight, CheckCircle2, Search, FilePlus
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

  const totalSales = pharmacyInvoices.reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const totalPieces = pharmacyInvoices.reduce((s, i) => s + Number(i.total_pieces_count || 0), 0);
  const totalBonus = pharmacyInvoices.reduce((s, i) => s + Number(i.total_bonus_count || 0), 0);

  const filteredPharmacies = pharmacies.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Pharmacy Header Card ─────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary">
                <Building2 size={13} /> ملف الصيدلية 360°
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>قاعدة بيانات Supabase Docker</span>
            </div>
            <h1 className="page-title" style={{ margin: '0 0 0.5rem' }}>
              {currentPharmacy?.name || 'اختر صيدلية'}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} style={{ color: 'var(--primary)' }} /> {currentPharmacy?.city} — {currentPharmacy?.address}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={15} style={{ color: 'var(--success)' }} /> {currentPharmacy?.phone || '—'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={15} style={{ color: 'var(--purple)' }} /> المندوب المسؤول: {currentPharmacy?.assigned_rep_name || 'مندوب بغداد'}
              </span>
            </div>
          </div>

          {currentPharmacy && (
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onStartInvoiceForPharmacy(currentPharmacy.id)} 
                className="btn-clay btn-primary"
              >
                <FilePlus size={18} />
                <span>إضافة فاتورة لهذه الصيدلية</span>
              </button>
              <button 
                onClick={() => onScheduleVisit(currentPharmacy.id)} 
                className="btn-clay btn-secondary"
              >
                <Calendar size={18} />
                <span>جدولة زيارة</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Grid Layout: Directory + Details ──────────────────────────────── */}
      <div className="pharmacy-profile-grid">
        
        {/* Left: Pharmacy Directory */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h5 style={{ fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: 'var(--primary)' }} />
            دليل الصيدليات ({pharmacies.length})
          </h5>

          <div style={{ marginBottom: '0.75rem' }}>
            <input
              type="text"
              className="clay-input"
              placeholder="🔍 ابحث بالاسم أو المدينة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredPharmacies.map(ph => {
              const isSelected = ph.id === (currentPharmacy?.id);
              return (
                <div
                  key={ph.id}
                  onClick={() => setSelectedPharmacyId(ph.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected ? 'var(--primary)' : 'var(--gray-50)',
                    color: isSelected ? '#ffffff' : 'var(--gray-800)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--gray-200)'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{ph.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.6, marginTop: 2 }}>
                    📍 {ph.city} {ph.address ? `— ${ph.address.substring(0, 24)}...` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pharmacy Stats & Invoice History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">إجمالي المسحوبات</div>
                <div className="stat-value" style={{ color: 'var(--primary)' }}>{totalSales.toLocaleString()}</div>
                <div className="stat-sub">دينار عراقي</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">إجمالي القطع المشتراة</div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>{totalPieces}</div>
                <div className="stat-sub">عبوة دوائية</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">البونص المكتسب</div>
                <div className="stat-value" style={{ color: 'var(--purple)' }}>+{totalBonus}</div>
                <div className="stat-sub">قطعة مجانية (10+1)</div>
              </div>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="card">
            <h5 style={{ fontWeight: 800, marginBottom: '1rem' }}>
              سجل فواتير الصيدلية ({pharmacyInvoices.length})
            </h5>

            {pharmacyInvoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--gray-400)' }}>
                <FileText size={40} style={{ color: 'var(--gray-300)', display: 'block', margin: '0 auto 0.75rem' }} />
                <p style={{ fontWeight: 700, margin: 0 }}>لا توجد فواتير سابقة لهذه الصيدلية حتى الآن</p>
                <button
                  onClick={() => currentPharmacy && onStartInvoiceForPharmacy(currentPharmacy.id)}
                  className="btn-clay btn-primary btn-sm"
                  style={{ marginTop: '0.85rem' }}
                >
                  <FilePlus size={15} /> إضافة الفاتورة الأولى
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="clay-table">
                  <thead>
                    <tr>
                      <th>رقم الفاتورة</th>
                      <th>تاريخ الفاتورة</th>
                      <th>المبلغ</th>
                      <th>القطع</th>
                      <th>البونص</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacyInvoices.map(inv => (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 800 }}>{inv.invoice_number || '—'}</td>
                        <td>{inv.invoice_date}</td>
                        <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{Number(inv.total_sales_amount).toLocaleString()} د.ع</td>
                        <td>{inv.total_pieces_count}</td>
                        <td><span className="badge badge-warning">+{inv.total_bonus_count} 🎁</span></td>
                        <td>
                          <span className={`badge ${inv.status === 'approved' ? 'badge-success' : inv.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                            {inv.status === 'approved' ? 'معتمدة' : inv.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة'}
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
