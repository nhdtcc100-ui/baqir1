import React, { useState } from 'react';
import { Product, Pharmacy, Invoice } from '../types';
import {
  FileText, CheckCircle2, AlertCircle, Edit3, Trash2,
  Save, Eye, Plus, ChevronDown, ChevronUp, RefreshCw,
  Sparkles, Check, Calculator, ZoomIn, X
} from 'lucide-react';

export interface BatchItemRow {
  id: string;
  product_id?: string;
  product_name: string;
  dosage_form?: string;
  quantity: number;
  unit_price: number;
  bonus_quantity: number;
  line_total: number;
  ocr_confidence?: number;
}

export interface BatchInvoiceCard {
  id: string;
  file_name?: string;
  image_url?: string;
  invoice_number: string;
  invoice_date: string;
  pharmacy_id?: string;
  pharmacy_name: string;
  pharmacy_area?: string;
  items: BatchItemRow[];
  confidence: number;
  ocr_engine?: string;
}

export const BAGHDAD_AREAS = [
  'الزعفرانية', 'مدينة الصدر', 'الكرادة', 'المنصور', 'الشعب', 'الدورة',
  'الكاظمية', 'الحارثية', 'زيونة', 'السيدية', 'الغزالية', 'البلديات',
  'الحبيبية', 'بغداد الجديدة', 'العامرية', 'اليرموك', 'حي الجامعة',
  'البياع', 'حي أور', 'المشتل', 'الغدير', 'الأعظمية', 'بسماية', 'الشعلة'
];

export const DOSAGE_FORMS = [
  'قطرة', 'كريم', 'مرهم', 'حبوب'
] as const;

export function autoDetectDosageForm(name: string): 'قطرة' | 'كريم' | 'مرهم' | 'حبوب' {
  const p = (name || '').toLowerCase();
  if (p.includes('drop') || p.includes('drup') || p.includes('قطرة') || p.includes('قطره')) return 'قطرة';
  if (p.includes('ointment') || p.includes('مرهم') || p.includes('oint') || p.includes(' ung')) return 'مرهم';
  if (p.includes('cream') || p.includes('كريم') || p.includes(' crm') || p.includes(' cr ')) return 'كريم';
  return 'حبوب';
}

export function getDosageFormBadgeColor(form: string): { bg: string; color: string; border: string } {
  switch (form) {
    case 'قطرة':
      return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' }; // Blue
    case 'كريم':
      return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' }; // Green
    case 'مرهم':
      return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' }; // Orange
    case 'حبوب':
    default:
      return { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' }; // Purple
  }
}

interface BatchReviewTableProps {
  invoices: BatchInvoiceCard[];
  products: Product[];
  pharmacies: Pharmacy[];
  fixedBonusEnabled: boolean;
  existingInvoices?: Invoice[];
  onSaveAll: (updatedInvoices: BatchInvoiceCard[]) => Promise<void>;
  onCancel: () => void;
}

export const BatchReviewTable: React.FC<BatchReviewTableProps> = ({
  invoices: initialInvoices,
  products,
  pharmacies,
  fixedBonusEnabled = true,
  existingInvoices,
  onSaveAll,
  onCancel
}) => {
  const [invoices, setInvoices] = useState<BatchInvoiceCard[]>(initialInvoices);
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [collapsedInvoices, setCollapsedInvoices] = useState<Record<string, boolean>>({});

  // دالة فحص ما إذا كانت الفاتورة مكررة (سواء مع بطاقة أخرى في نفس الدفعة أو مع قاعدة البيانات)
  const checkDuplicate = (card: BatchInvoiceCard, cardIdx: number): { isDuplicate: boolean; reason: string } => {
    const cardNum = String(card.invoice_number || '').trim();
    const cardDate = String(card.invoice_date || '').split('T')[0];
    const cardPh = String(card.pharmacy_name || '').trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');
    const cardItems = card.items || [];

    // 1. فحص مع بطاقات أخرى في نفس الدفعة الحالية
    for (let i = 0; i < invoices.length; i++) {
      if (i === cardIdx) continue;
      const other = invoices[i];
      const otherNum = String(other.invoice_number || '').trim();
      const otherDate = String(other.invoice_date || '').split('T')[0];
      const otherPh = String(other.pharmacy_name || '').trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');

      // تطابق رقم الفاتورة غير الافتراضي
      if (cardNum && otherNum && cardNum === otherNum && !cardNum.toUpperCase().startsWith('INV-')) {
        return { isDuplicate: true, reason: `مطابقة لرقم الفاتورة #${i + 1} في نفس الدفعة (${otherNum})` };
      }

      // تطابق الصيدلية والتاريخ والبنود
      if (cardPh && otherPh && (cardPh.includes(otherPh) || otherPh.includes(cardPh)) && cardDate && otherDate && cardDate === otherDate) {
        if (cardItems.length > 0 && cardItems.length === other.items.length) {
          const matchAll = cardItems.every((it, idx) => {
            const ot = other.items[idx];
            return it && ot && it.quantity === ot.quantity;
          });
          if (matchAll) {
            return { isDuplicate: true, reason: `مطابقة لنفس بيانات الفاتورة #${i + 1} في هذه الدفعة` };
          }
        }
      }
    }

    // 2. فحص مع الفواتير المحفوظة مسبقاً في قاعدة البيانات
    if (existingInvoices && existingInvoices.length > 0) {
      for (const ex of existingInvoices) {
        const exNum = String(ex.invoice_number || '').trim();
        if (cardNum && exNum && cardNum === exNum && !cardNum.toUpperCase().startsWith('INV-')) {
          return { isDuplicate: true, reason: `مسجلة مسبقاً في النظام برقم الفاتورة (${exNum})` };
        }

        const exDate = String(ex.invoice_date || '').split('T')[0];
        const exPh = String(ex.pharmacy_name || '').trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');

        if (cardPh && exPh && (cardPh.includes(exPh) || exPh.includes(cardPh)) && cardDate && exDate && cardDate === exDate) {
          if (cardItems.length > 0 && cardItems.length === (ex.items?.length || 0)) {
            const matchAll = cardItems.every((it, idx) => {
              const ot = (ex.items || [])[idx];
              return it && ot && it.quantity === (ot.sold_quantity || (ot as any).quantity);
            });
            if (matchAll) {
              return { isDuplicate: true, reason: `مسجلة مسبقاً لنفس الصيدلية (${ex.pharmacy_name || 'الصيدلية'}) بنفس التاريخ والكميات` };
            }
          }
        }
      }
    }

    return { isDuplicate: false, reason: '' };
  };

  // التحديث المباشر لحقول رأس الفاتورة
  const updateInvoiceHeader = (invId: string, field: 'invoice_number' | 'invoice_date' | 'pharmacy_name' | 'pharmacy_id' | 'pharmacy_area', value: any) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invId) return inv;
      if (field === 'pharmacy_id') {
        const ph = pharmacies.find(p => p.id === value);
        return {
          ...inv,
          pharmacy_id: value,
          pharmacy_name: ph ? ph.name : inv.pharmacy_name,
          pharmacy_area: (ph as any)?.area || inv.pharmacy_area
        };
      }
      return { ...inv, [field]: value };
    }));
  };

  // التحديث المباشر لحقول سطر المادة
  const updateItem = (invId: string, itemId: string, field: keyof BatchItemRow, rawVal: any) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invId) return inv;
      const updatedItems = inv.items.map(it => {
        if (it.id !== itemId) return it;
        const copy = { ...it };

        if (field === 'quantity') {
          const qty = Math.max(1, parseInt(rawVal) || 0);
          copy.quantity = qty;
          if (fixedBonusEnabled) {
            copy.bonus_quantity = Math.floor(qty / 10);
          }
          copy.line_total = qty * (copy.unit_price || 0);
        } else if (field === 'unit_price') {
          const price = Math.max(0, parseFloat(rawVal) || 0);
          copy.unit_price = price;
          copy.line_total = (copy.quantity || 1) * price;
        } else if (field === 'bonus_quantity') {
          copy.bonus_quantity = Math.max(0, parseInt(rawVal) || 0);
        } else if (field === 'dosage_form') {
          copy.dosage_form = String(rawVal);
        } else if (field === 'product_name') {
          copy.product_name = String(rawVal);
          copy.dosage_form = copy.dosage_form || autoDetectDosageForm(String(rawVal));
          // محاولة مطابقة منتج من الكتالوج تلقائياً
          const matched = products.find(p => p.name.toLowerCase().includes(String(rawVal).toLowerCase()));
          if (matched) {
            copy.product_id = matched.id;
            if (!copy.unit_price) {
              copy.unit_price = Number(matched.base_price);
              copy.line_total = (copy.quantity || 1) * Number(matched.base_price);
            }
          }
        } else if (field === 'product_id') {
          copy.product_id = String(rawVal);
          const p = products.find(pr => pr.id === rawVal);
          if (p) {
            copy.product_name = p.name;
            copy.dosage_form = copy.dosage_form || autoDetectDosageForm(p.name);
            copy.unit_price = Number(p.base_price);
            copy.line_total = (copy.quantity || 1) * Number(p.base_price);
          }
        }
        return copy;
      });
      return { ...inv, items: updatedItems };
    }));
  };

  // إضافة صنف جديد للفاتورة
  const handleAddItem = (invId: string) => {
    const defaultProd = products[0];
    const newItem: BatchItemRow = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product_id: defaultProd?.id || '',
      product_name: defaultProd?.name || 'مستحضر دوائي جديد',
      dosage_form: autoDetectDosageForm(defaultProd?.name || 'كريم'),
      quantity: 10,
      unit_price: Number(defaultProd?.base_price || 5000),
      bonus_quantity: fixedBonusEnabled ? 1 : 0,
      line_total: 10 * Number(defaultProd?.base_price || 5000),
      ocr_confidence: 1.0
    };
    setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, items: [...inv.items, newItem] } : inv));
  };

  // حذف صنف من الفاتورة
  const handleRemoveItem = (invId: string, itemId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invId) return inv;
      return { ...inv, items: inv.items.filter(it => it.id !== itemId) };
    }));
  };

  // حذف فاتورة بالكامل من الدفعة
  const handleRemoveInvoice = (invId: string) => {
    if (invoices.length === 1) {
      if (!window.confirm('هذه الفاتورة الوحيدة المتبقية. هل تريد إلغاء مراجعة الدفعة والعودة؟')) return;
      onCancel();
      return;
    }
    setInvoices(prev => prev.filter(inv => inv.id !== invId));
  };

  // تطبيق بونص 10+1 على جميع الفواتير والبنود بنقرة واحدة
  const applyFixedBonusToAll = () => {
    setInvoices(prev => prev.map(inv => ({
      ...inv,
      items: inv.items.map(it => ({
        ...it,
        bonus_quantity: Math.floor((Number(it.quantity) || 0) / 10)
      }))
    })));
  };

  // حفظ الكل دفعة واحدة
  const handleSaveAll = async () => {
    // التحقق من صحة الفواتير
    for (let i = 0; i < invoices.length; i++) {
      const inv = invoices[i];
      if (!inv.invoice_number?.trim()) {
        alert(`يرجى كتابة رقم الفاتورة للفاتورة رقم ${i + 1}`);
        return;
      }
      if (!inv.pharmacy_name?.trim()) {
        alert(`يرجى تحديد اسم الصيدلية للفاتورة رقم ${i + 1} (${inv.invoice_number})`);
        return;
      }
      if (inv.items.length === 0) {
        alert(`الفاتورة رقم ${i + 1} (${inv.invoice_number}) لا تحتوي على أي بنود! أضف صنفاً واحداً على الأقل.`);
        return;
      }
    }

    // فحص الفواتير المكررة
    const duplicateList = invoices.map((inv, idx) => ({ ...checkDuplicate(inv, idx), idx: idx + 1 })).filter(d => d.isDuplicate);
    if (duplicateList.length > 0) {
      const proceed = window.confirm(
        `⚠️ تنبيه: تم اكتشاف ${duplicateList.length} فواتير مكررة!\n\n` +
        duplicateList.map(d => `• فاتورة #${d.idx}: ${d.reason}`).join('\n') +
        `\n\nهل تريد بالتأكيد الاستمرار وحفظ جميع الفواتير؟`
      );
      if (!proceed) return;
    }

    setSaving(true);
    try {
      await onSaveAll(invoices);
    } finally {
      setSaving(false);
    }
  };

  // الإحصائيات العامة للدفعة
  const totalInvoices = invoices.length;
  const duplicateCount = invoices.filter((inv, idx) => checkDuplicate(inv, idx).isDuplicate).length;
  const totalItemsCount = invoices.reduce((sum, inv) => sum + inv.items.length, 0);
  const totalPieces = invoices.reduce((sum, inv) => sum + inv.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0), 0);
  const totalBonus = invoices.reduce((sum, inv) => sum + inv.items.reduce((s, it) => s + (Number(it.bonus_quantity) || 0), 0), 0);
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.items.reduce((s, it) => s + (Number(it.line_total) || (Number(it.quantity) * Number(it.unit_price)) || 0), 0), 0);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>

      {/* شريط الإحصائيات ورأس الصفحة */}
      <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.18)', color: '#a5f3fc', border: '1px solid rgba(255,255,255,0.25)' }}>
                ✨ فحص وتدقيق الذكاء الاصطناعي (OCR)
              </span>
              <span className="badge" style={{ background: '#10b981', color: 'white' }}>
                {totalInvoices} فواتير مكتشفة
              </span>
              {duplicateCount > 0 && (
                <span className="badge" style={{ background: '#ef4444', color: 'white', fontWeight: 800 }}>
                  ⚠️ {duplicateCount} فواتير مكررة
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'white' }}>
              مراجعة وتدقيق الفواتير المرفوعة ({totalInvoices} صور)
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
              تم استخراج بيانات الفواتير تلقائياً. يمكنك مراجعة وتعديل أي خلية أو قيمة بالضغط عليها مباشرة لضمان دقة 100% قبل الحفظ.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={applyFixedBonusToAll}
              className="btn-clay btn-secondary btn-sm"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 700 }}
              title="تطبيق قاعدة 10+1 (كل 10 قطع = 1 مجانية) على جميع فواتير الدفعة"
            >
              <Calculator size={14} /> تطبيق 10+1 على الكل
            </button>

            <button
              onClick={onCancel}
              disabled={saving}
              className="btn-clay btn-secondary btn-sm"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              إلغاء والعودة
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving || invoices.length === 0}
              className="btn-clay btn-primary"
              style={{ background: '#10b981', borderColor: '#059669', color: 'white', fontWeight: 900, fontSize: '0.95rem', padding: '0.6rem 1.4rem' }}
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'جارِ الحفظ والمزامنة...' : `💾 حفظ جميع الفواتير (${totalInvoices}) الآن 🚀`}
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.6rem 0.8rem', borderRadius: 10 }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>إجمالي الفواتير</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>{totalInvoices}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.6rem 0.8rem', borderRadius: 10 }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>عدد المواد والأصناف</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>{totalItemsCount}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.6rem 0.8rem', borderRadius: 10 }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>إجمالي القطع المباعة</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#facc15' }}>{totalPieces}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.6rem 0.8rem', borderRadius: 10 }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>إجمالي البونص المجاني</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#a7f3d0' }}>+{totalBonus}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.6rem 0.8rem', borderRadius: 10 }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>صافي القيمة الكلية</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#4ade80' }}>
              {totalAmount.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>د.ع</span>
            </span>
          </div>
        </div>
      </div>

      {/* قائمة بطاقات الفواتير مع الجداول القابلة للتعديل المباشر */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {invoices.map((inv, invIdx) => {
          const isCollapsed = Boolean(collapsedInvoices[inv.id]);
          const invTotal = inv.items.reduce((s, it) => s + (Number(it.line_total) || (Number(it.quantity) * Number(it.unit_price)) || 0), 0);
          const invPieces = inv.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
          const invBonus = inv.items.reduce((s, it) => s + (Number(it.bonus_quantity) || 0), 0);

          const confColor = inv.confidence >= 0.8 ? '#10b981' : inv.confidence >= 0.5 ? '#f59e0b' : '#ef4444';
          const confLabel = inv.confidence >= 0.8 ? 'دقة عالية ✓' : inv.confidence >= 0.5 ? 'دقة متوسطة ⚠️' : 'تحتاج مراجعة ⚠️';
          const dupInfo = checkDuplicate(inv, invIdx);

          return (
            <div
              key={inv.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: 14,
                border: dupInfo.isDuplicate
                  ? '2px solid #ef4444'
                  : `2px solid ${inv.confidence >= 0.8 ? '#bbf7d0' : inv.confidence >= 0.5 ? '#fde68a' : '#fecaca'}`,
                boxShadow: dupInfo.isDuplicate ? '0 4px 16px rgba(239, 68, 68, 0.15)' : '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              {/* ترويسة بطاقة الفاتورة */}
              <div style={{
                padding: '0.85rem 1.15rem',
                background: dupInfo.isDuplicate
                  ? '#fef2f2'
                  : inv.confidence >= 0.8 ? '#f0fdf4' : inv.confidence >= 0.5 ? '#fffbeb' : '#fef2f2',
                borderBottom: '1px solid var(--gray-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* مصغّر صورة الفاتورة مع زر التكبير */}
                  {inv.image_url ? (
                    <div
                      onClick={() => setPreviewImg(inv.image_url!)}
                      style={{
                        position: 'relative',
                        width: 46,
                        height: 46,
                        borderRadius: 8,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '2px solid white',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        flexShrink: 0
                      }}
                      title="اضغط لتكبير الصورة الأصلية للمقارنة"
                    >
                      <img src={inv.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                      }}>
                        <ZoomIn size={16} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: 46, height: 46, borderRadius: 8, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <FileText size={22} />
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--gray-900)' }}>
                        فاتورة #{invIdx + 1}:
                      </span>
                      <span className="badge" style={{ background: confColor, color: 'white', fontSize: '0.72rem', padding: '2px 8px' }}>
                        {confLabel} ({Math.round(inv.confidence * 100)}%)
                      </span>
                      {dupInfo.isDuplicate && (
                        <span className="badge" style={{ background: '#dc2626', color: 'white', fontSize: '0.72rem', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <AlertCircle size={13} /> ⚠️ مكررة: {dupInfo.reason}
                        </span>
                      )}
                      {inv.file_name && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', direction: 'ltr' }}>
                          📄 {inv.file_name}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                      {/* تعديل رقم الفاتورة */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--gray-500)', fontWeight: 700 }}>رقم الفاتورة:</span>
                        <input
                          type="text"
                          className="clay-input"
                          style={{ padding: '2px 8px', fontSize: '0.82rem', width: 140, fontWeight: 800, color: 'var(--primary)' }}
                          value={inv.invoice_number}
                          onChange={e => updateInvoiceHeader(inv.id, 'invoice_number', e.target.value)}
                        />
                      </div>

                      {/* تعديل التاريخ */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--gray-500)', fontWeight: 700 }}>التاريخ:</span>
                        <input
                          type="date"
                          className="clay-input"
                          style={{ padding: '2px 8px', fontSize: '0.82rem', width: 135 }}
                          value={inv.invoice_date}
                          onChange={e => updateInvoiceHeader(inv.id, 'invoice_date', e.target.value)}
                        />
                      </div>

                      {/* تعديل الصيدلية */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--gray-500)', fontWeight: 700 }}>الصيدلية:</span>
                        <input
                          type="text"
                          className="clay-input"
                          placeholder="اسم الصيدلية..."
                          style={{ padding: '2px 8px', fontSize: '0.82rem', width: 220, fontWeight: 700 }}
                          value={inv.pharmacy_name}
                          onChange={e => updateInvoiceHeader(inv.id, 'pharmacy_name', e.target.value)}
                        />
                        <select
                          className="clay-input"
                          style={{ padding: '2px 4px', fontSize: '0.78rem', width: 120 }}
                          value={inv.pharmacy_id || ''}
                          onChange={e => updateInvoiceHeader(inv.id, 'pharmacy_id', e.target.value)}
                          title="اختر صيدلية مسجلة لتطابق فوري"
                        >
                          <option value="">(مطابقة تلقائية)</option>
                          {pharmacies.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* تعديل المنطقة / المكان (مثل الزعفرانية أو مدينة الصدر) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--gray-500)', fontWeight: 700 }}>المنطقة / المكان:</span>
                        <input
                          type="text"
                          list={`areas-list-${inv.id}`}
                          className="clay-input"
                          placeholder="الزعفرانية أو مدينة الصدر..."
                          style={{ padding: '2px 8px', fontSize: '0.82rem', width: 175, fontWeight: 700, color: '#0369a1' }}
                          value={inv.pharmacy_area || ''}
                          onChange={e => updateInvoiceHeader(inv.id, 'pharmacy_area', e.target.value)}
                        />
                        <datalist id={`areas-list-${inv.id}`}>
                          {BAGHDAD_AREAS.map(a => <option key={a} value={a} />)}
                        </datalist>
                      </div>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات للبطاقة */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ textAlign: 'left', marginLeft: '0.5rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>صافي الفاتورة</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#059669' }}>
                      {invTotal.toLocaleString()} د.ع
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCollapsedInvoices(prev => ({ ...prev, [inv.id]: !isCollapsed }))}
                    className="btn-clay btn-secondary btn-sm"
                    title={isCollapsed ? 'عرض جدول المواد' : 'طي جدول المواد'}
                  >
                    {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                    {isCollapsed ? `عرض (${inv.items.length})` : 'طي'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveInvoice(inv.id)}
                    className="btn-clay btn-sm"
                    style={{
                      background: dupInfo.isDuplicate ? '#dc2626' : '#fee2e2',
                      color: dupInfo.isDuplicate ? 'white' : '#b91c1c',
                      borderColor: dupInfo.isDuplicate ? '#b91c1c' : '#fca5a5',
                      fontWeight: dupInfo.isDuplicate ? 800 : 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    title={dupInfo.isDuplicate ? 'إزالة هذه الفاتورة المكررة من الدفعة' : 'حذف هذه الفاتورة من الدفعة'}
                  >
                    <Trash2 size={15} />
                    {dupInfo.isDuplicate ? 'إزالة المكررة' : 'حذف'}
                  </button>
                </div>
              </div>

              {/* جدول بنود ومواد الفاتورة القابل للتعديل */}
              {!isCollapsed && (
                <div style={{ padding: '0.75rem 1rem' }}>
                  <div className="table-responsive">
                    <table className="clay-table" style={{ width: '100%', fontSize: '0.82rem', marginBottom: 0 }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ width: 40, textAlign: 'center' }}>#</th>
                          <th>اسم المادة الدوائية (قابل للتعديل)</th>
                          <th style={{ width: 110, textAlign: 'center' }}>نوع المادة</th>
                          <th style={{ width: 100, textAlign: 'center' }}>الكمية</th>
                          <th style={{ width: 120, textAlign: 'center' }}>سعر المفرد (د.ع)</th>
                          <th style={{ width: 90, textAlign: 'center' }}>البونص المجاني</th>
                          <th style={{ width: 120, textAlign: 'center' }}>المجموع (د.ع)</th>
                          <th style={{ width: 45, textAlign: 'center' }}>حذف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.items.map((it, itIdx) => (
                          <tr key={it.id}>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--gray-400)' }}>
                              {itIdx + 1}
                            </td>

                            {/* اسم المادة (قابل للتعديل أو الاختيار من الكتالوج) */}
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  className="clay-input"
                                  style={{ flex: 1, padding: '3px 8px', fontSize: '0.82rem', fontWeight: 700 }}
                                  value={it.product_name}
                                  onChange={e => updateItem(inv.id, it.id, 'product_name', e.target.value)}
                                  placeholder="اسم المستحضر..."
                                />
                                <select
                                  className="clay-input"
                                  style={{ width: 120, padding: '3px 4px', fontSize: '0.75rem', color: 'var(--gray-600)' }}
                                  value={it.product_id || ''}
                                  onChange={e => updateItem(inv.id, it.id, 'product_id', e.target.value)}
                                  title="اختر من المنتجات المسجلة في الكتالوج"
                                >
                                  <option value="">(منتج حر)</option>
                                  {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                                </select>
                              </div>
                            </td>

                            {/* نوع المادة (كريم / قطرة / مرهم / حبوب / شراب / إلخ) */}
                            <td style={{ textAlign: 'center' }}>
                              <select
                                className="clay-input"
                                style={{
                                  padding: '2px 4px',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  borderRadius: 6,
                                  width: 95,
                                  textAlign: 'center',
                                  background:
                                    it.dosage_form === 'كريم' ? '#ecfdf5' :
                                      it.dosage_form === 'مرهم' ? '#fff7ed' :
                                        it.dosage_form === 'قطرة' ? '#eff6ff' : '#f5f3ff',
                                  color:
                                    it.dosage_form === 'كريم' ? '#047857' :
                                      it.dosage_form === 'مرهم' ? '#c2410c' :
                                        it.dosage_form === 'قطرة' ? '#1d4ed8' : '#6d28d9'
                                }}
                                value={it.dosage_form || 'حبوب'}
                                onChange={e => updateItem(inv.id, it.id, 'dosage_form', e.target.value)}
                              >
                                <option value="قطرة">قطرة</option>
                                <option value="كريم">كريم</option>
                                <option value="مرهم">مرهم</option>
                                <option value="حبوب">حبوب</option>
                              </select>
                            </td>

                            {/* الكمية */}
                            <td style={{ textAlign: 'center' }}>
                              <input
                                type="number"
                                min={1}
                                className="clay-input"
                                style={{ width: 75, padding: '3px 6px', textAlign: 'center', fontWeight: 800, fontSize: '0.85rem' }}
                                value={it.quantity}
                                onChange={e => updateItem(inv.id, it.id, 'quantity', e.target.value)}
                              />
                            </td>

                            {/* سعر المفرد */}
                            <td style={{ textAlign: 'center' }}>
                              <input
                                type="number"
                                min={0}
                                step={250}
                                className="clay-input"
                                style={{ width: 95, padding: '3px 6px', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem' }}
                                value={it.unit_price}
                                onChange={e => updateItem(inv.id, it.id, 'unit_price', e.target.value)}
                              />
                            </td>

                            {/* البونص */}
                            <td style={{ textAlign: 'center' }}>
                              <input
                                type="number"
                                min={0}
                                className="clay-input"
                                style={{
                                  width: 65,
                                  padding: '3px 6px',
                                  textAlign: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  color: it.bonus_quantity > 0 ? '#b45309' : 'var(--gray-500)',
                                  background: it.bonus_quantity > 0 ? '#fef3c7' : undefined
                                }}
                                value={it.bonus_quantity}
                                onChange={e => updateItem(inv.id, it.id, 'bonus_quantity', e.target.value)}
                              />
                            </td>

                            {/* المجموع */}
                            <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>
                              {(it.line_total || it.quantity * it.unit_price).toLocaleString()} د.ع
                            </td>

                            {/* حذف الصنف */}
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(inv.id, it.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}
                                title="حذف هذا الصنف"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* إضافة صنف جديد وملخص البطاقة */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--gray-100)' }}>
                    <button
                      type="button"
                      onClick={() => handleAddItem(inv.id)}
                      className="btn-clay btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}
                    >
                      <Plus size={14} /> إضافة صنف إضافي للفاتورة
                    </button>

                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                      <span>مجموع الأصناف: <strong>{inv.items.length}</strong></span> |{' '}
                      <span>القطع: <strong>{invPieces}</strong></span> |{' '}
                      <span>البونص: <strong style={{ color: '#b45309' }}>+{invBonus}</strong></span> |{' '}
                      <span>الصافي: <strong style={{ color: '#059669', fontSize: '0.9rem' }}>{invTotal.toLocaleString()} د.ع</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* شريط الإجراءات السفلي العائم */}
      <div style={{
        position: 'sticky',
        bottom: 'clamp(5px, 1.5vh, 15px)',
        zIndex: 50,
        background: 'white',
        padding: '0.9rem 1.25rem',
        borderRadius: 14,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        border: '1.5px solid var(--gray-200)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={22} style={{ color: '#059669' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--gray-800)' }}>
              تم تدقيق {totalInvoices} فواتير بإجمالي {totalPieces} قطعة
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
              المجموع الإجمالي لكافة الفواتير:{' '}
              <strong style={{ color: '#059669', fontSize: '0.9rem' }}>{totalAmount.toLocaleString()} د.ع</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="btn-clay btn-secondary"
            style={{ fontWeight: 700 }}
          >
            إلغاء والعودة
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || invoices.length === 0}
            className="btn-clay btn-primary"
            style={{ fontWeight: 900, fontSize: '0.95rem', padding: '0.65rem 1.75rem' }}
          >
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'جارِ الحفظ والمزامنة...' : `حفظ وتصدير ${totalInvoices} فواتير الآن 🚀`}
          </button>
        </div>
      </div>

      {/* نافذة معاينة الصورة المكبرة (Lightbox) */}
      {previewImg && (
        <div
          className="modal-backdrop-floating"
          onClick={() => setPreviewImg(null)}
          style={{ zIndex: 99999, cursor: 'zoom-out' }}
        >
          <div
            className="modal-card-floating"
            style={{
              maxWidth: '92vw',
              maxHeight: '92vh',
              padding: '0.75rem',
              background: '#0f172a',
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'white' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>🔍 معاينة الفاتورة الأصلية لمطابقة القراءة</span>
              <button
                onClick={() => setPreviewImg(null)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>
            <img
              src={previewImg}
              alt="Invoice Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

