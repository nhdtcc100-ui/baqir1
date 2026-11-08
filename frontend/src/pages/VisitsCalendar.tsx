import React, { useState } from 'react';
import { VisitEvent, Pharmacy } from '../types';
import { 
  Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, 
  XCircle, Plus, Sparkles, Building2, UserCheck, ArrowRight, FilePlus, X
} from 'lucide-react';

interface VisitsCalendarProps {
  pharmacies: Pharmacy[];
  onStartInvoiceForPharmacy: (pharmacyId: string) => void;
}

export const VisitsCalendar: React.FC<VisitsCalendarProps> = ({
  pharmacies,
  onStartInvoiceForPharmacy
}) => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initial visits
  const [visits, setVisits] = useState<VisitEvent[]>([
    {
      id: 'v-1',
      pharmacy_id: pharmacies[0]?.id || 'ph1',
      pharmacy_name: pharmacies[0]?.name || 'صيدلية النور الحديثة',
      rep_name: 'علي حسن',
      visit_date: '2026-10-31',
      visit_time: '10:00 ص',
      purpose: 'order_delivery',
      status: 'scheduled',
      notes: 'تسليم طلبية قطرات العيون وعرض عينة الكريم الجديد'
    },
    {
      id: 'v-2',
      pharmacy_id: pharmacies[1]?.id || 'ph2',
      pharmacy_name: pharmacies[1]?.name || 'صيدلية الشفاء التخصصية',
      rep_name: 'علي حسن',
      visit_date: '2026-10-31',
      visit_time: '01:30 م',
      purpose: 'sample_show',
      status: 'scheduled',
      notes: 'شرح بونص 10+1 لصاحب الصيدلية'
    },
    {
      id: 'v-3',
      pharmacy_id: pharmacies[2]?.id || 'ph3',
      pharmacy_name: pharmacies[2]?.name || 'صيدلية الأمل المركزية',
      rep_name: 'علي حسن',
      visit_date: '2026-10-30',
      visit_time: '04:00 م',
      purpose: 'collection',
      status: 'completed',
      notes: 'تمت الزيارة ومراجعة الفاتورة بنجاح'
    }
  ]);

  // Form State for new appointment
  const [newPharmacyId, setNewPharmacyId] = useState(pharmacies[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('11:00 ص');
  const [newPurpose, setNewPurpose] = useState<'routine_check' | 'order_delivery' | 'sample_show' | 'collection'>('routine_check');
  const [newNotes, setNewNotes] = useState('');

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const ph = pharmacies.find(p => p.id === newPharmacyId);
    const newVisit: VisitEvent = {
      id: 'v-' + Date.now(),
      pharmacy_id: newPharmacyId,
      pharmacy_name: ph ? ph.name : 'صيدلية جديدة',
      rep_name: 'علي حسن',
      visit_date: newDate,
      visit_time: newTime,
      purpose: newPurpose,
      status: 'scheduled',
      notes: newNotes
    };
    setVisits([newVisit, ...visits]);
    setShowAddModal(false);
    setNewNotes('');
  };

  const handleToggleStatus = (id: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setVisits(visits.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  const filteredVisits = visits.filter(v => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const getPurposeLabel = (p: string) => {
    switch (p) {
      case 'routine_check': return { label: 'زيارة متابعة دورية', badge: 'badge-primary' };
      case 'order_delivery': return { label: 'تسليم شحنة طلبيات', badge: 'badge-success' };
      case 'sample_show': return { label: 'عرض عينات وبونص', badge: 'badge-purple' };
      case 'collection': return { label: 'تحصيل ومطابقة مالية', badge: 'badge-warning' };
      default: return { label: 'زيارة ميدانية', badge: 'badge-primary' };
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">
              <CalendarIcon size={13} /> جدول المواعيد والزيارات
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>المسار اليومي للمندوب الطبي</span>
          </div>
          <h1 className="page-title">جدول زيارات الصيدليات الميدانية</h1>
          <p className="page-subtitle">
            تنظيم مواعيد المندوب، متابعة الصيدليات المجدولة، وتحويل الزيارة مباشرة إلى فاتورة.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-clay btn-primary">
          <Plus size={18} />
          <span>حجز موعد زيارة جديد</span>
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">إجمالي المواعيد المجدولة</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{visits.length}</div>
            <div className="stat-sub">مواعيد مسجلة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">الزيارات المكتملة</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {visits.filter(v => v.status === 'completed').length}
            </div>
            <div className="stat-sub">زيارة منجزة</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">المواعيد القادمة</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              {visits.filter(v => v.status === 'scheduled').length}
            </div>
            <div className="stat-sub">بانتظار الانطلاق</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tab-pills" style={{ margin: 0 }}>
        <button
          onClick={() => setFilter('all')}
          className={`tab-pill ${filter === 'all' ? 'active' : ''}`}
        >
          الكل ({visits.length})
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          className={`tab-pill ${filter === 'scheduled' ? 'active' : ''}`}
        >
          المجدولة القادمة ({visits.filter(v => v.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`tab-pill ${filter === 'completed' ? 'active' : ''}`}
        >
          المكتملة ({visits.filter(v => v.status === 'completed').length})
        </button>
      </div>

      {/* ── Visits Cards Grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem' }}>
        {filteredVisits.map((v) => {
          const purposeInfo = getPurposeLabel(v.purpose);
          return (
            <div key={v.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className={`badge ${purposeInfo.badge}`} style={{ marginBottom: '0.4rem', display: 'inline-flex' }}>
                      {purposeInfo.label}
                    </span>
                    <h4 style={{ fontWeight: 800, margin: '0.3rem 0 0', color: 'var(--gray-900)' }}>
                      {v.pharmacy_name}
                    </h4>
                  </div>

                  <span className={`badge ${v.status === 'completed' ? 'badge-success' : v.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                    {v.status === 'completed' ? 'مكتملة ✓' : v.status === 'cancelled' ? 'ملغاة' : 'قيد الانتظار'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CalendarIcon size={14} style={{ color: 'var(--primary)' }} /> {v.visit_date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} style={{ color: 'var(--warning)' }} /> {v.visit_time}
                  </span>
                </div>

                {v.notes && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', background: 'var(--gray-50)', padding: '0.65rem 0.85rem', borderRadius: 10, margin: '0 0 1rem' }}>
                    {v.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-100)' }}>
                <button
                  onClick={() => onStartInvoiceForPharmacy(v.pharmacy_id)}
                  className="btn-clay btn-primary btn-sm"
                  style={{ fontWeight: 700 }}
                >
                  <FilePlus size={15} /> إنشاء فاتورة
                </button>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {v.status !== 'completed' && (
                    <button
                      onClick={() => handleToggleStatus(v.id, 'completed')}
                      className="btn-clay btn-success btn-sm"
                      title="تمت الزيارة"
                    >
                      <CheckCircle2 size={15} /> تم
                    </button>
                  )}
                  {v.status !== 'cancelled' && (
                    <button
                      onClick={() => handleToggleStatus(v.id, 'cancelled')}
                      className="btn-clay btn-secondary btn-sm"
                      title="إلغاء الموعد"
                    >
                      <XCircle size={15} /> إلغاء
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Appointment Modal ─────────────────────────────────────────── */}
      {showAddModal && (
        <div className="modal-backdrop-floating" onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="modal-card-floating" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h4 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarIcon size={20} style={{ color: 'var(--primary)' }} />
                حجز موعد زيارة جديد
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVisit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                  الصيدلية المستهدفة *
                </label>
                <select
                  className="clay-input"
                  value={newPharmacyId}
                  onChange={(e) => setNewPharmacyId(e.target.value)}
                  required
                >
                  {pharmacies.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    تاريخ الزيارة *
                  </label>
                  <input
                    type="date"
                    className="clay-input"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    وقت الزيارة *
                  </label>
                  <input
                    type="text"
                    className="clay-input"
                    placeholder="10:30 ص"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                  الغرض من الزيارة *
                </label>
                <select
                  className="clay-input"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value as any)}
                >
                  <option value="routine_check">زيارة متابعة دورية</option>
                  <option value="order_delivery">تسليم شحنة طلبيات</option>
                  <option value="sample_show">عرض عينات جديدة وبونص 10+1</option>
                  <option value="collection">تحصيل ومطابقة مالية</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                  ملاحظات الموعد
                </label>
                <textarea
                  className="clay-input"
                  rows={2}
                  placeholder="ملاحظات وتفاصيل الزيارة..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-clay btn-secondary btn-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-clay btn-primary btn-sm"
                >
                  تأكيد حجز الموعد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
