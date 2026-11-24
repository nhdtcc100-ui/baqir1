import React, { useState } from 'react';
import { Pharmacy, Invoice } from '../types';
import { 
  Building2, Phone, MapPin, UserCheck, Calendar, FileText, 
  TrendingUp, Gift, Plus, ArrowUpRight, CheckCircle2, Search, FilePlus,
  ArrowRight, Clock, AlertCircle, ChevronLeft
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
  const [mobileSelectedPharmacyId, setMobileSelectedPharmacyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');

  const currentPharmacy = pharmacies.find(p => p.id === (mobileSelectedPharmacyId || selectedPharmacyId)) || pharmacies[0];
  const pharmacyInvoices = invoices.filter(i => i.pharmacy_id === currentPharmacy?.id);

  const totalSales = pharmacyInvoices.reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const totalPieces = pharmacyInvoices.reduce((s, i) => s + Number(i.total_pieces_count || 0), 0);
  const totalBonus = pharmacyInvoices.reduce((s, i) => s + Number(i.total_bonus_count || 0), 0);

  // Extract unique areas
  const areas = Array.from(new Set(pharmacies.map(p => p.area || p.city).filter(Boolean)));

  const filteredPharmacies = pharmacies.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.area && p.area.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesArea = selectedArea === 'all' || p.area === selectedArea || p.city === selectedArea;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE VIEW: Dedicated Page Navigation (أشبه بصفحة مستقلة على الموبايل) ─ */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <div className="pharmacy-mobile-page">

        {mobileSelectedPharmacyId ? (
          /* ── Level 2: صفحة ملف الصيدلية التفصيلية للموبايل ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Top Navigation & Back Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setMobileSelectedPharmacyId(null)}
                className="pharmacy-back-btn"
              >
                <ArrowRight size={17} />
                <span>العودة لدليل الصيدليات</span>
              </button>

              <button
                type="button"
                onClick={() => currentPharmacy && onStartInvoiceForPharmacy(currentPharmacy.id)}
                className="btn-clay btn-primary btn-sm"
                style={{ background: '#059669', borderColor: '#047857', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <FilePlus size={16} />
                <span>+ إضافة فاتورة</span>
              </button>
            </div>

            {/* Pharmacy Info Card */}
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  <Building2 size={12} /> ملف الصيدلية
                </span>
                {currentPharmacy?.area && (
                  <span className="badge" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.72rem', fontWeight: 700 }}>
                    📍 {currentPharmacy.area}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gray-900)', margin: '0 0 0.5rem' }}>
                {currentPharmacy?.name}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)' }} />
                  <span>{currentPharmacy?.city} {currentPharmacy?.address ? `— ${currentPharmacy.address}` : ''}</span>
                </div>
                {currentPharmacy?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={15} style={{ color: 'var(--success)' }} />
                    <a href={`tel:${currentPharmacy.phone}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {currentPharmacy.phone}
                    </a>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={15} style={{ color: 'var(--purple)' }} />
                  <span>المندوب: {currentPharmacy?.assigned_rep_name || 'مندوب بغداد'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-100)' }}>
                <button
                  type="button"
                  onClick={() => currentPharmacy && onStartInvoiceForPharmacy(currentPharmacy.id)}
                  className="btn-clay btn-primary flex-1"
                  style={{ background: '#059669', borderColor: '#047857', fontWeight: 800, justifyContent: 'center' }}
                >
                  <FilePlus size={16} /> إضافة فاتورة
                </button>
                <button
                  type="button"
                  onClick={() => currentPharmacy && onScheduleVisit(currentPharmacy.id)}
                  className="btn-clay btn-secondary flex-1"
                  style={{ fontWeight: 800, justifyContent: 'center' }}
                >
                  <Calendar size={16} /> جدولة زيارة
                </button>
              </div>
            </div>

            {/* Financial Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.65rem' }}>
              <div className="stat-card" style={{ padding: '0.75rem' }}>
                <div className="stat-content">
                  <div className="stat-label" style={{ fontSize: '0.7rem' }}>إجمالي المسحوبات</div>
                  <div className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
                    {totalSales.toLocaleString()}
                  </div>
                  <div className="stat-sub" style={{ fontSize: '0.65rem' }}>د.ع</div>
                </div>
              </div>

              <div className="stat-card" style={{ padding: '0.75rem' }}>
                <div className="stat-content">
                  <div className="stat-label" style={{ fontSize: '0.7rem' }}>إجمالي القطع</div>
                  <div className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--success)' }}>
                    {totalPieces}
                  </div>
                  <div className="stat-sub" style={{ fontSize: '0.65rem' }}>قطعة</div>
                </div>
              </div>

              <div className="stat-card" style={{ padding: '0.75rem' }}>
                <div className="stat-content">
                  <div className="stat-label" style={{ fontSize: '0.7rem' }}>البونص المجاني</div>
                  <div className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--purple)' }}>
                    +{totalBonus}
                  </div>
                  <div className="stat-sub" style={{ fontSize: '0.65rem' }}>هدية 🎁</div>
                </div>
              </div>
            </div>

            {/* Invoices List for this Pharmacy */}
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h5 style={{ fontWeight: 800, margin: 0, fontSize: '0.92rem' }}>
                  سجل فواتير الصيدلية ({pharmacyInvoices.length})
                </h5>
                <button
                  type="button"
                  onClick={() => currentPharmacy && onStartInvoiceForPharmacy(currentPharmacy.id)}
                  className="btn-link"
                  style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 800, textDecoration: 'none' }}
                >
                  + فاتورة جديدة
                </button>
              </div>

              {pharmacyInvoices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--gray-400)' }}>
                  <FileText size={36} style={{ color: 'var(--gray-300)', display: 'block', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontWeight: 700, fontSize: '0.86rem', margin: 0 }}>لا توجد فواتير مسجلة لهذه الصيدلية بعد</p>
                  <button
                    type="button"
                    onClick={() => currentPharmacy && onStartInvoiceForPharmacy(currentPharmacy.id)}
                    className="btn-clay btn-primary btn-sm"
                    style={{ marginTop: '0.75rem', background: '#059669', borderColor: '#047857' }}
                  >
                    <FilePlus size={15} /> إضافة الفاتورة الأولى
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {pharmacyInvoices.map(inv => (
                    <div
                      key={inv.id}
                      style={{
                        background: 'var(--gray-50)',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 12,
                        padding: '0.75rem 0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--gray-900)' }}>
                          فاتورة #{inv.invoice_number || '—'}
                        </span>
                        <span className={`badge ${inv.status === 'approved' ? 'badge-success' : inv.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                          {inv.status === 'approved' ? 'معتمدة' : inv.status === 'rejected' ? 'مرفوضة' : 'قيد التدقيق'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        <span>التاريخ: {(inv.invoice_date || '').split('T')[0]}</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                          {Number(inv.total_sales_amount).toLocaleString()} د.ع
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--gray-600)' }}>
                        <span>الكمية: {inv.total_pieces_count} قطعة</span>
                        <span className="badge badge-warning" style={{ fontSize: '0.66rem' }}>+{inv.total_bonus_count} بونص 🎁</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ── Level 1: صفحة دليل وقائمة الصيدليات للموبايل ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Header Banner */}
            <div className="card" style={{ padding: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
                  <Building2 size={13} /> شبكة التوزيع الدوائية
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.74rem' }}>
                  {pharmacies.length} صيدلية
                </span>
              </div>
              <h1 className="page-title" style={{ fontSize: '1.25rem', margin: '0 0 0.35rem' }}>
                دليل الصيدليات المعتمدة
              </h1>
              <p className="page-subtitle" style={{ fontSize: '0.8rem', margin: 0 }}>
                اختر صيدلية للاطلاع على مسحوباتها وسجل فواتيرها أو إضافة فاتورة فورية لها.
              </p>

              {/* Search input */}
              <div style={{ marginTop: '0.85rem' }}>
                <input
                  type="text"
                  className="clay-input"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 0.85rem' }}
                  placeholder="🔍 ابحث باسم الصيدلية أو المنطقة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Area Quick Filter Pills */}
              {areas.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', marginTop: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedArea('all')}
                    className={`btn-clay btn-sm ${selectedArea === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderRadius: 20 }}
                  >
                    الكل ({pharmacies.length})
                  </button>
                  {areas.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setSelectedArea(a)}
                      className={`btn-clay btn-sm ${selectedArea === a ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderRadius: 20, whiteSpace: 'nowrap' }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pharmacies Mobile Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredPharmacies.map(ph => {
                const phInvs = invoices.filter(i => i.pharmacy_id === ph.id);
                const phSales = phInvs.reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
                const phPieces = phInvs.reduce((s, i) => s + Number(i.total_pieces_count || 0), 0);

                return (
                  <div
                    key={ph.id}
                    className="pharmacy-mobile-card"
                    onClick={() => setMobileSelectedPharmacyId(ph.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '0.2rem' }}>
                          🏥 {ph.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.76rem', color: 'var(--gray-600)' }}>
                          <span className="badge" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.7rem', fontWeight: 700 }}>
                            📍 {ph.area || ph.city}
                          </span>
                          {ph.phone && <span>📞 {ph.phone}</span>}
                        </div>
                      </div>
                      <ChevronLeft size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />
                    </div>

                    {/* Sales Summary Strip */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr 1fr',
                      gap: '0.4rem',
                      background: 'var(--gray-50)',
                      borderRadius: 10,
                      padding: '0.5rem 0.75rem',
                      border: '1px solid var(--gray-200)'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--gray-500)', fontWeight: 600 }}>إجمالي المسحوبات</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 900, color: 'var(--primary)' }}>
                          {phSales > 0 ? `${phSales.toLocaleString()} د.ع` : 'لا توجد مبيعات'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--gray-500)', fontWeight: 600 }}>الفواتير</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--gray-800)' }}>{phInvs.length}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--gray-500)', fontWeight: 600 }}>القطع</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--gray-800)' }}>{phPieces}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setMobileSelectedPharmacyId(ph.id); }}
                        className="btn-clay btn-secondary btn-sm flex-1"
                        style={{ justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}
                      >
                        <FileText size={14} /> عرض الملف والفواتير
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onStartInvoiceForPharmacy(ph.id); }}
                        className="btn-clay btn-primary btn-sm"
                        style={{ background: '#059669', borderColor: '#047857', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <FilePlus size={14} /> + فاتورة
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── DESKTOP VIEW: Classic Side-by-Side View (شاشات الحاسوب الكبيرة) ──── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <div className="pharmacy-desktop-view" style={{ display: undefined }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ── Pharmacy Header Card ── */}
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
                    style={{ background: '#059669', borderColor: '#047857' }}
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

          {/* ── Grid Layout: Directory + Details ── */}
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
                      style={{ marginTop: '0.85rem', background: '#059669', borderColor: '#047857' }}
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
      </div>

    </div>
  );
};
