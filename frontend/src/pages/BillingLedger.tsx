import React, { useState } from 'react';
import { User, Invoice, Pharmacy } from '../types';
import {
  FileText, Download, CheckCircle2, AlertCircle,
  Eye, Filter, Calendar, Building2, Gift, Search, X, Check, Clock, Trash2, Edit3, Plus, Copy
} from 'lucide-react';
import { api } from '../services/api';
import { autoDetectDosageForm, getDosageFormBadgeColor } from './BatchReviewTable';

interface BillingLedgerProps {
  user: User;
  invoices: Invoice[];
  pharmacies: Pharmacy[];
  onApproveInvoice: (id: string) => void;
  onRejectInvoice: (id: string, reason: string) => void;
  onDeleteInvoice?: (id: string) => void;
  onUpdateInvoice?: (invoice: Invoice) => void;
}

export const BillingLedger: React.FC<BillingLedgerProps> = ({
  user,
  invoices,
  pharmacies,
  onApproveInvoice,
  onRejectInvoice,
  onDeleteInvoice,
  onUpdateInvoice
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('all');
  const [pharmacyFilter, setPharmacyFilter] = useState<string>('all');
  const [searchNumber, setSearchNumber] = useState('');

  // Selected Invoice for Full Details & Line Items Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Image Preview Modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Reject Reason Modal
  const [rejectingInvoiceId, setRejectingInvoiceId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Edit Invoice Modal State
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editPharmacyId, setEditPharmacyId] = useState('');
  const [editPharmacyArea, setEditPharmacyArea] = useState('');
  const [editInvoiceNumber, setEditInvoiceNumber] = useState('');
  const [editInvoiceDate, setEditInvoiceDate] = useState('');
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleOpenEdit = (inv: Invoice) => {
    setEditingInvoice(inv);
    setEditPharmacyId(inv.pharmacy_id);
    setEditPharmacyArea(inv.pharmacy_area || (inv as any).area || '');
    setEditInvoiceNumber(inv.invoice_number || '');
    setEditInvoiceDate((inv.invoice_date || '').split('T')[0]);
    setEditItems(
      (inv.items && inv.items.length > 0)
        ? inv.items.map(it => ({
            id: it.id || Math.random().toString(),
            product_id: it.product_id,
            product_name_snapshot: it.product_name_snapshot,
            sold_quantity: it.sold_quantity,
            historical_unit_price: it.historical_unit_price,
            bonus_quantity: it.bonus_quantity
          }))
        : [{ id: '1', product_id: 'c0000010-0000-0000-0000-000000000010', product_name_snapshot: 'دواء جديد', sold_quantity: 10, historical_unit_price: 5000, bonus_quantity: 1 }]
    );
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;
    setEditSubmitting(true);
    setEditError(null);
    try {
      const payload = {
        pharmacy_id: editPharmacyId,
        pharmacy_area: editPharmacyArea.trim(),
        invoice_number: editInvoiceNumber.trim(),
        invoice_date: editInvoiceDate,
        items: editItems.map(it => ({
          product_id: it.product_id,
          sold_quantity: Math.max(1, parseInt(it.sold_quantity) || 1),
          custom_product_name: it.product_name_snapshot?.trim(),
          custom_unit_price: parseFloat(it.historical_unit_price) || 0,
          custom_bonus: it.bonus_quantity !== undefined ? Math.max(0, parseInt(it.bonus_quantity) || 0) : undefined
        }))
      };
      const updated = await api.updateInvoice(editingInvoice.id, payload);
      onUpdateInvoice?.(updated);
      setEditingInvoice(null);
      if (selectedInvoice?.id === editingInvoice.id) {
        setSelectedInvoice(updated);
      }
    } catch (err: any) {
      setEditError(err.message || 'فشل حفظ التعديلات');
    } finally {
      setEditSubmitting(false);
    }
  };

  // فلتر الفواتير المكررة وحالة الحذف الجماعي
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // ── خوارزمية كشف الفواتير المكررة ديناميكياً ──
  const duplicateInfoMap = React.useMemo(() => {
    const map = new Map<string, { isDuplicate: boolean; isOriginal: boolean; duplicateCount: number; matchedWithId?: string; reason: string }>();

    const areItemsMatch = (itemsA?: any[], itemsB?: any[]) => {
      if (!itemsA || !itemsB || itemsA.length !== itemsB.length || itemsA.length === 0) return false;
      const normalize = (it: any) => ({
        name: String(it.product_name_snapshot || it.custom_product_name || it.product_name || it.name || it.product_id || '').trim().toLowerCase().replace(/[^a-z0-9\u0621-\u064A]/gi, ''),
        qty: Number(it.sold_quantity || it.quantity || 0)
      });
      const sA = [...itemsA].map(normalize).sort((x, y) => x.name.localeCompare(y.name));
      const sB = [...itemsB].map(normalize).sort((x, y) => x.name.localeCompare(y.name));
      return sA.every((ia, idx) => {
        const ib = sB[idx];
        if (!ib) return false;
        const nameMatch = ia.name === ib.name || ia.name.includes(ib.name) || ib.name.includes(ia.name);
        return nameMatch && ia.qty === ib.qty;
      });
    };

    // ترتيب الفواتير زمنياً: الأقدم هي الأصلية
    const sorted = [...invoices].sort((a, b) => new Date(a.created_at || a.invoice_date).getTime() - new Date(b.created_at || b.invoice_date).getTime());

    for (let i = 0; i < sorted.length; i++) {
      const invA = sorted[i];
      if (map.has(invA.id)) continue;

      const group: Invoice[] = [invA];
      const numA = String(invA.invoice_number || '').trim();
      const dateA = String(invA.invoice_date || '').split('T')[0];
      const phA = String(invA.pharmacy_name || '').trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');

      for (let j = i + 1; j < sorted.length; j++) {
        const invB = sorted[j];
        if (map.has(invB.id)) continue;

        const numB = String(invB.invoice_number || '').trim();
        const dateB = String(invB.invoice_date || '').split('T')[0];
        const phB = String(invB.pharmacy_name || '').trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');

        // 1. تطابق رقم الفاتورة غير الافتراضي
        const sameNumber = numA && numB && numA === numB && !numA.toUpperCase().startsWith('INV-');

        // 2. تطابق الصيدلية والتاريخ والبنود
        const samePh = phA && phB && (phA.includes(phB) || phB.includes(phA));
        const sameDate = dateA && dateB && dateA === dateB;
        const sameItems = samePh && sameDate && areItemsMatch(invA.items, invB.items);

        if (sameNumber || sameItems) {
          group.push(invB);
        }
      }

      if (group.length > 1) {
        group.forEach((item, index) => {
          if (index === 0) {
            map.set(item.id, {
              isDuplicate: true,
              isOriginal: true,
              duplicateCount: group.length - 1,
              reason: `يوجد ${group.length - 1} نسخ مكررة من هذه الفاتورة`
            });
          } else {
            map.set(item.id, {
              isDuplicate: true,
              isOriginal: false,
              duplicateCount: group.length - 1,
              matchedWithId: group[0].id,
              reason: `نسخة مكررة مطابقة للفاتورة الأصلية (${group[0].invoice_number || 'الأولى'})`
            });
          }
        });
      } else {
        map.set(invA.id, {
          isDuplicate: false,
          isOriginal: false,
          duplicateCount: 0,
          reason: ''
        });
      }
    }

    return map;
  }, [invoices]);

  // إجمالي النسخ المكررة غير الأصلية
  const duplicateCopiesCount = React.useMemo(() => {
    return invoices.filter(inv => {
      const info = duplicateInfoMap.get(inv.id);
      return info?.isDuplicate && !info?.isOriginal;
    }).length;
  }, [invoices, duplicateInfoMap]);

  // حذف جميع النسخ المكررة والإبقاء على الفواتير الأصلية فقط
  const handleDeleteAllDuplicates = async () => {
    const duplicateCopies = invoices.filter(inv => {
      const info = duplicateInfoMap.get(inv.id);
      return info?.isDuplicate && !info?.isOriginal;
    });

    if (duplicateCopies.length === 0) return;

    const proceed = window.confirm(
      `⚠️ هل أنت متأكد من رغبتك في إزالة جميع النسخ المكررة (${duplicateCopies.length} فاتورة)؟\n\nسيتم الإبقاء على الفواتير الأصلية فقط وإزالة كافة النسخ المكررة، وستعود الفواتير الأصلية للوضع الطبيعي غير الملون فوراً.`
    );
    if (!proceed) return;

    setBulkDeleting(true);
    try {
      for (const dup of duplicateCopies) {
        await api.deleteInvoice(dup.id);
        onDeleteInvoice?.(dup.id);
      }
    } catch (e: any) {
      alert('حدث خطأ أثناء إزالة بعض الفواتير: ' + (e.message || e));
    } finally {
      setBulkDeleting(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (duplicatesOnly && !duplicateInfoMap.get(inv.id)?.isDuplicate) return false;
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (pharmacyFilter !== 'all' && inv.pharmacy_id !== pharmacyFilter) return false;
    if (searchNumber) {
      const q = searchNumber.toLowerCase();
      const matchNum = inv.invoice_number?.toLowerCase().includes(q);
      const matchPh = inv.pharmacy_name?.toLowerCase().includes(q);
      const matchArea = (inv.pharmacy_area || (inv as any).area || '').toLowerCase().includes(q);
      const matchRep = inv.rep_name?.toLowerCase().includes(q);
      if (!matchNum && !matchPh && !matchArea && !matchRep) return false;
    }
    return true;
  });

  const totalSales = filteredInvoices.reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const approvedSales = filteredInvoices.filter(i => i.status === 'approved').reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const pendingSales = filteredInvoices.filter(i => i.status === 'pending_review').reduce((s, i) => s + Number(i.total_sales_amount || 0), 0);
  const totalBonusPieces = filteredInvoices.reduce((s, i) => s + Number(i.total_bonus_count || 0), 0);

  const handleExportCSV = () => {
    const headers = ['رقم الفاتورة', 'الصيدلية', 'المنطقة / المكان', 'المندوب', 'التاريخ', 'المبلغ (د.ع)', 'القطع', 'البونص', 'الحالة', 'سبب الرفض'];
    const rows = filteredInvoices.map(i => [
      i.invoice_number || '',
      `"${i.pharmacy_name || ''}"`,
      `"${i.pharmacy_area || (i as any).area || ''}"`,
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

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.deleteInvoice(deletingId);
      onDeleteInvoice?.(deletingId);
      setDeletingId(null);
      if (selectedInvoice?.id === deletingId) setSelectedInvoice(null);
    } catch (e: any) {
      setDeleteError(e.message || 'فشل حذف الفاتورة');
    } finally {
      setDeleteLoading(false);
    }
  };

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

        {duplicateCopiesCount > 0 && (
          <div
            onClick={() => setDuplicatesOnly(prev => !prev)}
            className="stat-card"
            style={{
              cursor: 'pointer',
              background: duplicatesOnly ? '#fee2e2' : '#fef2f2',
              border: '2px solid #ef4444',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)'
            }}
            title="انقر لتصفية الفواتير المكررة فقط"
          >
            <div className="stat-content">
              <div className="stat-label" style={{ color: '#991b1b', fontWeight: 800 }}>⚠️ فواتير مكررة مرصودة</div>
              <div className="stat-value" style={{ color: '#dc2626' }}>{duplicateCopiesCount}</div>
              <div className="stat-sub" style={{ color: '#b91c1c' }}>
                {duplicatesOnly ? 'انقر لعرض الكل ✓' : 'انقر لتصفية المكررات 🔍'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── شريط تنبيه وإزالة الفواتير المكررة ── */}
      {duplicateCopiesCount > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '1.5px solid #f87171',
          borderRadius: 14,
          padding: '0.9rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: '#991b1b',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={24} style={{ color: '#dc2626', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#991b1b' }}>
                ⚠️ تم رصد ({duplicateCopiesCount}) فواتير مكررة في السجل المالي!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '0.15rem' }}>
                الفواتير المكررة موضحة باللون الوردي وشارة ⚠️ مكررة. يمكنك إزالتها فردياً أو إزالة جميع النسخ المكررة بضغطة واحدة، وستعود الفاتورة الأصلية للوضع الطبيعي غير الملون فوراً.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDuplicatesOnly(prev => !prev)}
              className="btn-clay btn-secondary btn-sm"
              style={{ background: 'white', color: '#991b1b', borderColor: '#fca5a5', fontWeight: 800 }}
            >
              {duplicatesOnly ? 'عرض جميع الفواتير' : `تصفية المكررات فقط (${duplicateCopiesCount})`}
            </button>

            <button
              onClick={handleDeleteAllDuplicates}
              disabled={bulkDeleting}
              className="btn-clay btn-danger btn-sm"
              style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6, background: '#dc2626', color: 'white' }}
              title="حذف جميع النسخ المكررة والإبقاء على الفاتورة الأصلية فقط"
            >
              <Trash2 size={15} />
              {bulkDeleting ? 'جارِ الإزالة...' : 'إزالة كافة النسخ المكررة بنقرة واحدة'}
            </button>
          </div>
        </div>
      )}

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
          <div className="table-responsive">
            <table className="clay-table">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>الصيدلية</th>
                  <th>المنطقة / المكان</th>
                  <th>المندوب</th>
                  <th>تاريخ الفاتورة</th>
                  <th>المبلغ الإجمالي</th>
                  <th>القطع</th>
                  <th>البونص</th>
                  <th>الحالة</th>
                  <th>تفاصيل الأصناف</th>
                  <th>مستند الفاتورة</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>إجراء الاعتماد</th>}
                  <th style={{ textAlign: 'center' }}>تعديل</th>
                  <th style={{ textAlign: 'center' }}>حذف</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => {
                  const cleanDate = (inv.invoice_date || '').split('T')[0];
                  const dupInfo = duplicateInfoMap.get(inv.id);
                  const isDup = dupInfo?.isDuplicate;
                  const isOriginal = dupInfo?.isOriginal;

                  return (
                    <tr
                      key={inv.id}
                      style={{
                        background: isDup
                          ? (isOriginal ? '#fffbeb' : '#fef2f2')
                          : undefined,
                        transition: 'background-color 0.4s ease'
                      }}
                    >
                      <td style={{ fontWeight: 800, color: isDup && !isOriginal ? '#b91c1c' : 'var(--gray-900)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="btn-link"
                            style={{
                              fontWeight: 800,
                              color: isDup && !isOriginal ? '#b91c1c' : 'var(--primary)',
                              textDecoration: 'underline',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            title="انقر لقراءة تفاصيل الفاتورة"
                          >
                            {inv.invoice_number || '—'}
                          </button>
                          {isDup && (
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.68rem',
                                padding: '2px 6px',
                                background: isOriginal ? '#f59e0b' : '#ef4444',
                                color: 'white',
                                fontWeight: 800
                              }}
                              title={dupInfo?.reason}
                            >
                              {isOriginal ? '⚠️ أصلية' : '⚠️ مكررة'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{inv.pharmacy_name || 'صيدلية معتمدة'}</td>
                      <td>
                        <span className="badge" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.78rem', fontWeight: 700 }}>
                          {inv.pharmacy_area || (inv as any).area || '—'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--gray-600)' }}>{inv.rep_name || 'مندوب ميداني'}</td>
                      <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{cleanDate}</td>
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
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="btn-clay btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          title="قراءة وتدقيق بنود الفاتورة"
                        >
                          <FileText size={14} /> تفاصيل ({inv.items?.length || 0})
                        </button>
                      </td>
                      <td>
                        {inv.image_url ? (
                          <button
                            onClick={() => setPreviewImageUrl(inv.image_url || null)}
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
                      {/* Edit button — visible to admin always, to rep only if still pending */}
                      {(isAdmin || (inv.rep_id === user.id && inv.status === 'pending_review')) && (
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleOpenEdit(inv)}
                            className="btn-clay btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="تعديل بيانات الفاتورة"
                          >
                            <Edit3 size={14} style={{ color: 'var(--primary)' }} />
                          </button>
                        </td>
                      )}
                      {/* Delete button — visible to admin always, to rep only if still pending */}
                      {(isAdmin || (inv.rep_id === user.id && inv.status === 'pending_review')) && (
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setDeletingId(inv.id)}
                            className="btn-clay btn-danger btn-sm"
                            style={{
                              padding: isDup && !isOriginal ? '0.3rem 0.65rem' : '0.3rem 0.5rem',
                              background: isDup && !isOriginal ? '#dc2626' : undefined,
                              color: isDup && !isOriginal ? 'white' : undefined,
                              fontWeight: isDup && !isOriginal ? 800 : 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title={isDup && !isOriginal ? 'إزالة هذه النسخة المكررة من السجل' : 'حذف الفاتورة'}
                          >
                            <Trash2 size={14} />
                            {isDup && !isOriginal && <span>إزالة المكررة</span>}
                          </button>
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

      {/* ── Invoice Reader & Line Items Modal (قراءة كامل تفاصيل الفاتورة) ──── */}
      {selectedInvoice && (
        <div className="modal-backdrop-floating" onClick={e => { if (e.target === e.currentTarget) setSelectedInvoice(null); }}>
          <div className="modal-card-floating" style={{ maxWidth: 880 }}>

            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-primary">
                    <FileText size={13} /> قراءة وتدقيق الفاتورة
                  </span>
                  {selectedInvoice.status === 'approved' ? (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> معتمدة</span>
                  ) : selectedInvoice.status === 'rejected' ? (
                    <span className="badge badge-danger"><AlertCircle size={12} /> مرفوضة</span>
                  ) : (
                    <span className="badge badge-warning"><Clock size={12} /> قيد التدقيق والمراجعة</span>
                  )}
                </div>
                <h3 className="modal-title">
                  فاتورة رقم: {selectedInvoice.invoice_number || '—'}
                </h3>
                <div className="modal-subtitle" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>🏥 الصيدلية: <strong>{selectedInvoice.pharmacy_name || '—'}</strong></span>
                  <span>📍 المنطقة: <strong>{selectedInvoice.pharmacy_area || (selectedInvoice as any).area || '—'}</strong></span>
                  <span>👤 المندوب: <strong>{selectedInvoice.rep_name || '—'}</strong></span>
                  <span>📅 التاريخ: <strong>{(selectedInvoice.invoice_date || '').split('T')[0]}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 4 }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="modal-body">

              {/* If invoice has rejection reason */}
              {selectedInvoice.rejection_reason && (
                <div className="alert-danger mb-3" style={{ padding: '0.75rem 1rem' }}>
                  <AlertCircle size={18} />
                  <div>
                    <strong>سبب الرفض:</strong> {selectedInvoice.rejection_reason}
                  </div>
                </div>
              )}

              {/* Document Image Banner (if available) */}
              {selectedInvoice.image_url && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 12,
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={selectedInvoice.image_url}
                      alt="معاينة"
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--gray-300)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>مستند الفاتورة الأصلي مرفق</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>تم التقاطه أو رفعه عبر النظام</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewImageUrl(selectedInvoice.image_url || null)}
                    className="btn-clay btn-secondary btn-sm"
                  >
                    <Eye size={14} /> معاينة بالحجم الكامل
                  </button>
                </div>
              )}

              {/* Items Table */}
              <h5 style={{ fontWeight: 800, marginBottom: '0.75rem', color: 'var(--gray-800)' }}>
                قائمة الأصناف الدوائية المحسوبة ({selectedInvoice.items?.length || 0} أصناف):
              </h5>

              {(!selectedInvoice.items || selectedInvoice.items.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--gray-400)', background: 'var(--gray-50)', borderRadius: 12 }}>
                  لا توجد بنود مفصلة لهذه الفاتورة
                </div>
              ) : (
                <div style={{ overflowX: 'auto', border: '1px solid var(--gray-200)', borderRadius: 12 }}>
                  <table className="clay-table" style={{ margin: 0, fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--gray-100)' }}>
                        <th>#</th>
                        <th>اسم المستحضر الدوائي</th>
                        <th>النوع</th>
                        <th style={{ textAlign: 'center' }}>الكمية المباعة</th>
                        <th style={{ textAlign: 'center' }}>سعر الوحدة</th>
                        <th style={{ textAlign: 'center' }}>البونص (10+1)</th>
                        <th style={{ textAlign: 'center' }}>إجمالي القطع</th>
                        <th style={{ textAlign: 'left' }}>المجموع الصافي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: 'var(--gray-900)' }}>
                            {item.product_name_snapshot || 'مستحضر دوائي'}
                          </td>
                          <td>
                            {(() => {
                              const form = (item as any).dosage_form || (
                                item.product_type_snapshot === 'drop' ? 'قطرة' :
                                item.product_type_snapshot === 'cream' ? 'كريم' :
                                item.product_type_snapshot === 'ointment' ? 'مرهم' :
                                autoDetectDosageForm(item.product_name_snapshot || '')
                              );
                              const badgeStyle = getDosageFormBadgeColor(form);
                              return (
                                <span
                                  className="badge"
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    background: badgeStyle.bg,
                                    color: badgeStyle.color,
                                    border: `1px solid ${badgeStyle.border}`
                                  }}
                                >
                                  {form}
                                </span>
                              );
                            })()}
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>
                            {item.sold_quantity} قطعة
                          </td>
                          <td style={{ textAlign: 'center', color: 'var(--gray-600)' }}>
                            {Number(item.historical_unit_price).toLocaleString()} د.ع
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`badge ${item.bonus_quantity > 0 ? 'badge-warning' : 'badge-gray'}`}>
                              +{item.bonus_quantity} مجانية
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--gray-800)' }}>
                            {(item.sold_quantity || 0) + (item.bonus_quantity || 0)}
                          </td>
                          <td style={{ textAlign: 'left', fontWeight: 900, color: 'var(--primary)' }}>
                            {Number(item.line_total).toLocaleString()} د.ع
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total Financial Box */}
              <div style={{
                marginTop: '1.25rem',
                padding: '1rem 1.25rem',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1px solid #86efac',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>إجمالي قيمة الفاتورة الصافي:</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803d' }}>
                    {Number(selectedInvoice.total_sales_amount).toLocaleString()} <span style={{ fontSize: '0.85rem' }}>دينار عراقي</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#166534' }}>إجمالي القطع المباعة</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#14532d' }}>
                      {selectedInvoice.total_pieces_count} قطعة
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309' }}>إجمالي بونص مجاني</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#d97706' }}>
                      +{selectedInvoice.total_bonus_count} قطعة 🎁
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="btn-clay btn-secondary"
                >
                  إغلاق
                </button>

                {(isAdmin || (selectedInvoice.rep_id === user.id && selectedInvoice.status === 'pending_review')) && (
                  <button
                    type="button"
                    onClick={() => {
                      const inv = selectedInvoice;
                      setSelectedInvoice(null);
                      handleOpenEdit(inv);
                    }}
                    className="btn-clay btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Edit3 size={15} /> تعديل الفاتورة
                  </button>
                )}
              </div>

              {isAdmin && selectedInvoice.status === 'pending_review' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      onApproveInvoice(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="btn-clay btn-success"
                  >
                    <CheckCircle2 size={16} /> اعتماد الفاتورة الآن
                  </button>
                  <button
                    onClick={() => {
                      setRejectingInvoiceId(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="btn-clay btn-danger"
                  >
                    <AlertCircle size={16} /> رفض الفاتورة
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Image Preview Modal ────────────────────────────────────────────── */}
      {previewImageUrl && (
        <div className="modal-backdrop-floating" onClick={e => { if (e.target === e.currentTarget) setPreviewImageUrl(null); }}>
          <div className="modal-card-floating" style={{ maxWidth: 720 }}>
            <div className="modal-header">
              <h5 className="modal-title">مستند الفاتورة الأصلي</h5>
              <button
                onClick={() => setPreviewImageUrl(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img src={previewImageUrl} alt="أصل الفاتورة" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 12 }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Reason Modal ────────────────────────────────────────────── */}
      {rejectingInvoiceId && (
        <div className="modal-backdrop-floating" onClick={e => { if (e.target === e.currentTarget) { setRejectingInvoiceId(null); setRejectionReason(''); } }}>
          <div className="modal-card-floating" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <h5 className="modal-title" style={{ color: 'var(--danger)' }}>
                تأكيد رفض الفاتورة
              </h5>
              <button
                onClick={() => { setRejectingInvoiceId(null); setRejectionReason(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray-600)', marginBottom: '0.85rem' }}>
                يرجى كتابة سبب الرفض ليظهر للمندوب ويتمكن من تصحيح الفاتورة أو إعادة رفعها:
              </p>
              <textarea
                className="clay-input"
                rows={3}
                placeholder="مثال: الصورة غير واضحة، أو الكمية غير متطابقة مع الختم"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                style={{ width: '100%', marginBottom: '0.85rem' }}
              />
            </div>
            <div className="modal-footer">
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

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      {deletingId && (
        <div className="modal-backdrop-floating" onClick={e => { if (e.target === e.currentTarget && !deleteLoading) { setDeletingId(null); setDeleteError(null); } }}>
          <div className="modal-card-floating" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Trash2 size={22} style={{ color: 'var(--danger)' }} />
                <h5 className="modal-title" style={{ color: 'var(--danger)' }}>
                  تأكيد حذف الفاتورة
                </h5>
              </div>
              <button
                onClick={() => { setDeletingId(null); setDeleteError(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray-600)', margin: '0 0 1rem 0', lineHeight: 1.6 }}>
                {deletingId && duplicateInfoMap.get(deletingId)?.isDuplicate && !duplicateInfoMap.get(deletingId)?.isOriginal ? (
                  <span style={{ color: '#b91c1c', fontWeight: 700 }}>
                    ⚠️ أنت بصدد إزالة هذه النسخة المكررة. عند إزالتها، ستعود الفاتورة الأصلية تلقائياً للوضع الطبيعي غير الملون فوراً.
                  </span>
                ) : (
                  'هل أنت متأكد من حذف هذه الفاتورة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.'
                )}
              </p>
              {deleteError && (
                <div className="alert-danger mb-3" style={{ padding: '0.6rem 1rem', fontSize: '0.83rem' }}>
                  <AlertCircle size={15} /> {deleteError}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => { setDeletingId(null); setDeleteError(null); }}
                disabled={deleteLoading}
                className="btn-clay btn-secondary btn-sm"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="btn-clay btn-danger btn-sm"
              >
                {deleteLoading
                  ? 'جارِ الحذف...'
                  : (deletingId && duplicateInfoMap.get(deletingId)?.isDuplicate && !duplicateInfoMap.get(deletingId)?.isOriginal ? 'تأكيد إزالة المكررة' : 'تأكيد الحذف')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Invoice Modal (تعديل كامل لبيانات وبنود الفاتورة) ──────────── */}
      {editingInvoice && (
        <div className="modal-backdrop-floating" onClick={e => { if (e.target === e.currentTarget && !editSubmitting) setEditingInvoice(null); }}>
          <div className="modal-card-floating" style={{ maxWidth: 920 }}>
            {/* Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={22} style={{ color: 'var(--primary)' }} />
                <h4 className="modal-title">
                  تعديل بيانات الفاتورة: {editingInvoice.invoice_number || 'بدون رقم'}
                </h4>
              </div>
              <button onClick={() => setEditingInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                <X size={20} />
              </button>
            </div>

            {editError && (
              <div className="alert-danger mb-3" style={{ padding: '0.65rem 1rem' }}>
                <AlertCircle size={16} /> {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="modal-body" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Form Basic Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    الصيدلية المستهدفة *
                  </label>
                  <select
                    className="clay-input"
                    value={editPharmacyId}
                    onChange={e => setEditPharmacyId(e.target.value)}
                    required
                  >
                    {pharmacies.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    المنطقة / المكان
                  </label>
                  <input
                    type="text"
                    className="clay-input"
                    placeholder="مثال: المنصور، الكرادة، الزعفرانية..."
                    value={editPharmacyArea}
                    onChange={e => setEditPharmacyArea(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    رقم الفاتورة *
                  </label>
                  <input
                    type="text"
                    className="clay-input"
                    value={editInvoiceNumber}
                    onChange={e => setEditInvoiceNumber(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                    تاريخ الفاتورة *
                  </label>
                  <input
                    type="date"
                    className="clay-input"
                    value={editInvoiceDate}
                    onChange={e => setEditInvoiceDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Items Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--gray-800)' }}>
                  الأصناف والأسعار والكميات المحسوبة ({editItems.length} أصناف):
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setEditItems(prev => prev.map(it => ({
                      ...it,
                      bonus_quantity: Math.floor((Math.max(1, parseInt(it.sold_quantity) || 1)) / 10)
                    })))}
                    className="btn-clay btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 800 }}
                    title="إعادة احتساب وتطبيق قاعدة البونص الثابت (10+1) على كافة البنود"
                  >
                    🎁 تطبيق بونص (10+1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditItems(prev => [
                      ...prev,
                      {
                        id: Math.random().toString(),
                        product_id: 'c0000010-0000-0000-0000-000000000010',
                        product_name_snapshot: 'صنف دوائي جديد',
                        sold_quantity: 10,
                        historical_unit_price: 5000,
                        bonus_quantity: 1
                      }
                    ])}
                    className="btn-clay btn-secondary btn-sm"
                  >
                    <Plus size={14} /> إضافة صنف آخر
                  </button>
                </div>
              </div>

              <div className="table-responsive" style={{ marginBottom: '1.25rem' }}>
                <div style={{ minWidth: 540, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {editItems.map((item, idx) => {
                    const qty = Math.max(1, parseInt(item.sold_quantity) || 1);
                    const price = parseFloat(item.historical_unit_price) || 0;
                    const bonus = Math.floor(qty / 10);
                    const total = qty * price;
                    return (
                      <div
                        key={item.id || idx}
                        style={{
                          display: 'grid',
                        gridTemplateColumns: '2fr 100px 110px 80px 110px 36px',
                        gap: '0.5rem',
                        alignItems: 'center',
                        background: 'var(--gray-50)',
                        borderRadius: 10,
                        padding: '0.5rem 0.75rem',
                        border: '1px solid var(--gray-200)'
                      }}
                    >
                      {/* Name */}
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>اسم الدواء / المادة</span>
                        <input
                          type="text"
                          className="clay-input"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', fontWeight: 700 }}
                          value={item.product_name_snapshot || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setEditItems(prev => prev.map((it, i) => i === idx ? { ...it, product_name_snapshot: val } : it));
                          }}
                          required
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>الكمية</span>
                        <input
                          type="number"
                          min={1}
                          className="clay-input"
                          style={{ padding: '0.35rem', textAlign: 'center', fontSize: '0.82rem' }}
                          value={item.sold_quantity}
                          onChange={e => {
                            const val = e.target.value;
                            const numQty = Math.max(0, parseInt(val) || 0);
                            setEditItems(prev => prev.map((it, i) => i === idx ? {
                              ...it,
                              sold_quantity: val,
                              bonus_quantity: Math.floor(numQty / 10)
                            } : it));
                          }}
                          required
                        />
                      </div>

                      {/* Unit Price */}
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>السعر (د.ع)</span>
                        <input
                          type="number"
                          min={0}
                          className="clay-input"
                          style={{ padding: '0.35rem', textAlign: 'center', fontSize: '0.82rem' }}
                          value={item.historical_unit_price}
                          onChange={e => {
                            const val = e.target.value;
                            setEditItems(prev => prev.map((it, i) => i === idx ? { ...it, historical_unit_price: val } : it));
                          }}
                          required
                        />
                      </div>

                      {/* Bonus - editable input */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>البونص</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                          <span style={{ color: 'var(--warning)', fontWeight: 800, fontSize: '0.82rem' }}>+</span>
                          <input
                            type="number"
                            min={0}
                            className="clay-input"
                            style={{ padding: '0.25rem 0.35rem', textAlign: 'center', fontSize: '0.82rem', width: 48, fontWeight: 800, color: 'var(--warning)' }}
                            value={item.bonus_quantity !== undefined ? item.bonus_quantity : Math.floor(qty / 10)}
                            onChange={e => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setEditItems(prev => prev.map((it, i) => i === idx ? { ...it, bonus_quantity: val } : it));
                            }}
                          />
                        </div>
                      </div>

                      {/* Line Total */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>المجموع</span>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>
                          {total.toLocaleString()} د.ع
                        </span>
                      </div>

                      {/* Delete item */}
                      <button
                        type="button"
                        onClick={() => {
                          if (editItems.length <= 1) return;
                          setEditItems(prev => prev.filter((_, i) => i !== idx));
                        }}
                        disabled={editItems.length <= 1}
                        style={{ background: 'none', border: 'none', color: editItems.length <= 1 ? 'var(--gray-300)' : 'var(--danger)', cursor: 'pointer', padding: 4 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Total Card */}
              {(() => {
                const totalAmount = editItems.reduce((s, it) => s + (Math.max(1, parseInt(it.sold_quantity) || 1) * (parseFloat(it.historical_unit_price) || 0)), 0);
                const totalPieces = editItems.reduce((s, it) => s + Math.max(1, parseInt(it.sold_quantity) || 1), 0);
                const totalBonus = editItems.reduce((s, it) => s + (it.bonus_quantity !== undefined ? Number(it.bonus_quantity) : Math.floor(Math.max(1, parseInt(it.sold_quantity) || 1) / 10)), 0);
                return (
                  <div style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '1px solid #bfdbfe',
                    borderRadius: 12,
                    padding: '0.85rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>المجموع الإجمالي الجديد:</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1d4ed8' }}>
                        {totalAmount.toLocaleString()} <span style={{ fontSize: '0.82rem' }}>دينار عراقي</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#1e40af' }}>القطع الكلية</div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e3a8a' }}>{totalPieces} قطعة</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#b45309' }}>البونص المجاني</div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#b45309' }}>+{totalBonus} مجاناً</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="btn-clay btn-secondary"
                  disabled={editSubmitting}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="btn-clay btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontWeight: 800 }}
                >
                  {editSubmitting ? 'جاري حفظ التعديل...' : 'حفظ التعديلات في الفاتورة ✅'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
