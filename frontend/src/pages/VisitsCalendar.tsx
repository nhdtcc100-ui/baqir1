import React, { useState } from 'react';
import { VisitEvent, Pharmacy } from '../types';
import { 
  Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, 
  XCircle, Plus, Sparkles, Building2, UserCheck, ArrowRight
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

  // Initial Seeded Visits
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
  const [newDate, setNewDate] = useState('2026-11-01');
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
      case 'routine_check': return { label: 'زيارة متابعة دورية', badge: 'clay-badge-primary' };
      case 'order_delivery': return { label: 'تسليم شحنة طلبيات', badge: 'clay-badge-success' };
      case 'sample_show': return { label: 'عرض عينات وبونص', badge: 'clay-badge-purple' };
      case 'collection': return { label: 'تحصيل ومطابقة مالية', badge: 'clay-badge-warning' };
      default: return { label: 'زيارة ميدانية', badge: 'clay-badge-primary' };
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="clay-card mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="clay-badge clay-badge-primary">
              <CalendarIcon size={14} /> جدول المواعيد والزيارات
            </span>
            <span className="text-muted small">المسار اليومي للمندوب الطبي</span>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
            جدول زيارات الصيدليات الميدانية
          </h2>
          <p className="text-muted mb-0 small">
            تنظيم مواعيد المندوب، متابعة الصيدليات المجدولة، وتحويل الزيارة مباشرة إلى فاتورة.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)} 
          className="clay-btn clay-btn-primary"
        >
          <Plus size={18} />
          <span>حجز موعد زيارة جديد</span>
        </button>
      </div>

      {/* ── Stats & Filter Bar ────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="clay-card text-center p-3">
            <span className="text-muted small">إجمالي المواعيد المجدولة</span>
            <h4 className="fw-bold text-primary mt-1 mb-0">{visits.length} مواعيد</h4>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="clay-card text-center p-3">
            <span className="text-muted small">الزيارات المكتملة</span>
            <h4 className="fw-bold text-success mt-1 mb-0">
              {visits.filter(v => v.status === 'completed').length} زيارة منجزة
            </h4>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="clay-card text-center p-3">
            <span className="text-muted small">مواعيد اليوم القادمة</span>
            <h4 className="fw-bold text-warning mt-1 mb-0">
              {visits.filter(v => v.status === 'scheduled').length} بانتظار الانطلاق
            </h4>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-3">
        <button
          onClick={() => setFilter('all')}
          className={`clay-btn py-1 px-3 ${filter === 'all' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
        >
          الكل ({visits.length})
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          className={`clay-btn py-1 px-3 ${filter === 'scheduled' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
        >
          المجدولة القادمة ({visits.filter(v => v.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`clay-btn py-1 px-3 ${filter === 'completed' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
        >
          المكتملة ({visits.filter(v => v.status === 'completed').length})
        </button>
      </div>

      {/* ── Visits List Cards ─────────────────────────────────────────────── */}
      <div className="row g-3">
        {filteredVisits.map((v) => {
          const purposeInfo = getPurposeLabel(v.purpose);
          return (
            <div key={v.id} className="col-12 col-lg-6">
              <div className="clay-card clay-card-interactive h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className={`clay-badge ${purposeInfo.badge} mb-2`}>
                        {purposeInfo.label}
                      </span>
                      <h5 className="fw-bold mb-1" style={{ color: '#1e293b' }}>
                        {v.pharmacy_name}
                      </h5>
                    </div>

                    <span className={`clay-badge ${v.status === 'completed' ? 'clay-badge-success' : v.status === 'cancelled' ? 'clay-badge-danger' : 'clay-badge-warning'}`}>
                      {v.status === 'completed' ? 'مكتملة ✅' : v.status === 'cancelled' ? 'ملغاة' : 'قيد الانتظار ⏳'}
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-3 small text-muted my-2">
                    <span className="d-flex align-items-center gap-1">
                      <CalendarIcon size={15} className="text-primary" /> {v.visit_date}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={15} className="text-secondary" /> {v.visit_time}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <UserCheck size={15} className="text-success" /> المندوب: {v.rep_name}
                    </span>
                  </div>

                  {v.notes && (
                    <div className="p-2 rounded-3 bg-light text-secondary small mt-2">
                      📝 {v.notes}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 mt-3 border-top gap-2">
                  <div className="d-flex gap-2">
                    {v.status === 'scheduled' ? (
                      <button
                        onClick={() => handleToggleStatus(v.id, 'completed')}
                        className="clay-btn clay-btn-success py-1 px-2 small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <CheckCircle2 size={15} /> تم إنجاز الزيارة
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(v.id, 'scheduled')}
                        className="clay-btn clay-btn-secondary py-1 px-2 small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        إعادة للجدولة
                      </button>
                    )}
                  </div>

                  {/* Direct Invoice Scan Trigger for this pharmacy */}
                  <button
                    onClick={() => onStartInvoiceForPharmacy(v.pharmacy_id)}
                    className="clay-btn clay-btn-primary py-1 px-3 small"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <span>رفع فاتورة للصيدلية</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ── New Appointment Modal ────────────────────────────────────────── */}
      {showAddModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
             style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="clay-card p-4 w-100" style={{ maxWidth: '520px', background: '#ffffff' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">جدولة زيارة / موعد صيدلية جديد</h5>
              <button onClick={() => setShowAddModal(false)} className="btn btn-sm btn-light rounded-circle">✕</button>
            </div>

            <form onSubmit={handleAddVisit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">اختر الصيدلية</label>
                <select 
                  className="clay-input" 
                  value={newPharmacyId} 
                  onChange={(e) => setNewPharmacyId(e.target.value)}
                  required
                >
                  {pharmacies.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.city}</option>
                  ))}
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">التاريخ</label>
                  <input 
                    type="date" 
                    className="clay-input" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">الوقت المتوقع</label>
                  <input 
                    type="text" 
                    className="clay-input" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)} 
                    placeholder="مثال: 11:30 ص"
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">غرض الزيارة</label>
                <select 
                  className="clay-input"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value as any)}
                >
                  <option value="routine_check">زيارة متابعة دورية</option>
                  <option value="order_delivery">تسليم طلبيات وبضاعة</option>
                  <option value="sample_show">عرض عينات وشرح بونص</option>
                  <option value="collection">تحصيل ومطابقة فواتير</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">ملاحظات إضافية للمندوب</label>
                <textarea 
                  className="clay-input" 
                  rows={3} 
                  placeholder="أي تفاصيل حول الزيارة أو احتياجات الصيدلية..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="clay-btn clay-btn-secondary">
                  إلغاء
                </button>
                <button type="submit" className="clay-btn clay-btn-primary">
                  حفظ الموعد في الجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
