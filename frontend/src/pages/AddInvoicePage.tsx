import React, { useState, useRef, useCallback } from 'react';
import { Pharmacy, Product, Invoice } from '../types';
import { api } from '../services/api';
import {
  FilePlus, Upload, Edit3, FileImage, FileText as FilePdfIcon,
  Plus, Trash2, Calculator, CheckCircle2, AlertCircle, Sparkles,
  RefreshCw, X, ArrowRight, Camera, Loader, Database, Eye, Check
} from 'lucide-react';

interface AddInvoicePageProps {
  pharmacies: Pharmacy[];
  products: Product[];
  initialPharmacyId?: string;
  onInvoiceCreated: (invoice: Invoice) => void;
  onCancel: () => void;
}

type EntryMode = 'manual' | 'ocr';

interface LineItem {
  id: string;
  product_id: string;
  sold_quantity: number;
  ocr_confidence?: number;
}

const generateInvoiceNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const r = Math.floor(1000 + Math.random() * 9000);
  return `INV-${y}${m}${d}-${r}`;
};

export const AddInvoicePage: React.FC<AddInvoicePageProps> = ({
  pharmacies,
  products,
  initialPharmacyId,
  onInvoiceCreated,
  onCancel
}) => {
  const [mode, setMode] = useState<EntryMode>('ocr');

  // Form fields
  const [pharmacyId, setPharmacyId]       = useState(initialPharmacyId || pharmacies[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber);
  const [invoiceDate, setInvoiceDate]     = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes]                 = useState('');
  const [imageUrl, setImageUrl]           = useState('');

  // Line items
  const [items, setItems] = useState<LineItem[]>([
    { id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10 }
  ]);

  // Upload / OCR state
  const [uploadedFile, setUploadedFile]   = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [isDragging, setIsDragging]       = useState(false);
  const [ocrLoading, setOcrLoading]       = useState(false);
  const [ocrDone, setOcrDone]             = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [ocrSummary, setOcrSummary]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // ── Calculation helpers ───────────────────────────────────────────────────
  const getItemCalc = (item: LineItem) => {
    const prod = products.find(p => p.id === item.product_id) || products[0];
    const unitPrice = prod?.base_price ? Number(prod.base_price) : 0;
    const bonus     = Math.floor(item.sold_quantity / 10);
    const lineTotal = item.sold_quantity * unitPrice;
    return { prod, unitPrice, bonus, lineTotal };
  };

  const totalSales  = items.reduce((s, i) => s + getItemCalc(i).lineTotal, 0);
  const totalPieces = items.reduce((s, i) => s + i.sold_quantity, 0);
  const totalBonus  = items.reduce((s, i) => s + getItemCalc(i).bonus, 0);

  const addItem = () => setItems(prev => [
    ...prev,
    { id: 'item-' + Date.now(), product_id: products[0]?.id || '', sold_quantity: 10 }
  ]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));

  // ── Smart OCR execution ───────────────────────────────────────────────────
  const processOcr = async (file: File) => {
    setOcrLoading(true);
    setOcrDone(false);
    setError(null);

    try {
      const result = await api.uploadInvoiceFile(file);

      // Auto-fill pharmacy if matched
      if (result.pharmacy_id) {
        setPharmacyId(result.pharmacy_id);
      } else if (result.pharmacy_name) {
        const foundPh = pharmacies.find(p => p.name.includes(result.pharmacy_name!));
        if (foundPh) setPharmacyId(foundPh.id);
      }

      // Auto-fill invoice number & date
      if (result.invoice_number) setInvoiceNumber(result.invoice_number);
      if (result.invoice_date) setInvoiceDate(result.invoice_date);
      if (result.image_url) setImageUrl(result.image_url);

      // Auto-fill extracted product items
      if (result.extracted_items && result.extracted_items.length > 0) {
        const mappedItems: LineItem[] = result.extracted_items.map((ei, idx) => {
          let matched = products.find(p => p.id === ei.product_id);
          if (!matched) {
            matched = products.find(p =>
              p.name.toLowerCase().includes(ei.product_name.toLowerCase()) ||
              ei.product_name.toLowerCase().includes(p.name.toLowerCase())
            );
          }
          return {
            id: 'ocr-' + idx,
            product_id: matched?.id || products[0]?.id || '',
            sold_quantity: ei.quantity || 10,
            ocr_confidence: result.confidence
          };
        });
        setItems(mappedItems);
      }

      setOcrConfidence(Math.round(result.confidence * 100));
      setOcrDone(true);
      setOcrSummary(`تم استخراج ${result.extracted_items?.length || 0} أصناف بنجاح من الفاتورة.`);
    } catch (e: any) {
      setError('تعذر استخراج بيانات الملف تلقائياً: ' + e.message);
    } finally {
      setOcrLoading(false);
    }
  };

  // ── Handle file selection / drop with IMMEDIATE OCR reading ──────────────
  const handleFileDrop = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('نوع الملف غير مدعوم. يرجى رفع صورة فاتورة (JPG, PNG) أو ملف مستند PDF.');
      return;
    }

    setError(null);
    setUploadedFile(file);

    if (file.type !== 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Direct immediate reading of data upon uploading!
    processOcr(file);
  }, [pharmacies, products]);

  // ── Form Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pharmacyId) { setError('يرجى اختيار الصيدلية أولاً'); return; }
    if (!invoiceNumber.trim()) { setError('يرجى إدخال رقم الفاتورة'); return; }
    if (items.some(i => !i.product_id || i.sold_quantity < 1)) {
      setError('يرجى التحقق من بنود الفاتورة — كل صنف يحتاج منتجاً وكمية صحيحة');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        pharmacy_id: pharmacyId,
        invoice_number: invoiceNumber.trim(),
        invoice_date: invoiceDate,
        image_url: imageUrl || undefined,
        notes: notes.trim() || undefined,
        items: items.map(i => ({
          product_id: i.product_id,
          sold_quantity: i.sold_quantity,
          ocr_confidence: i.ocr_confidence
        }))
      };
      const created = await api.createInvoice(payload);
      onInvoiceCreated(created);
    } catch (e: any) {
      setError(e.message || 'فشل في حفظ الفاتورة في قاعدة بيانات سوبا بيس.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">
              <Database size={13} /> متصل بـ Supabase Docker
            </span>
            <span className="badge badge-success">
              <Sparkles size={13} /> معالجة الفواتير الذكية
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FilePlus size={28} style={{ color: 'var(--primary)' }} />
            إضافة فاتورة صيدلية جديدة
          </h1>
          <p className="page-subtitle">
            خاص بحساب المندوب: يمكنك إضافة الفاتورة يدوياً أو رفع صورتها / ملف PDF ليقوم النظام بقراءة بياناتها وإدخالها فوراً.
          </p>
        </div>
        <button className="btn-clay btn-secondary" onClick={onCancel}>
          <X size={16} /> إلغاء والعودة
        </button>
      </div>

      {/* ── Entry Mode Tabs ────────────────────────────────────────────────── */}
      <div className="card mb-4" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gray-900)' }}>اختر طريقة إدخال الفاتورة:</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>المسح الضوئي الذكي يملأ البيانات والصيدلية والأدوية والكميات تلقائياً</div>
          </div>
          <div className="tab-pills" style={{ margin: 0 }}>
            <button
              type="button"
              onClick={() => { setMode('ocr'); setError(null); }}
              className={`tab-pill ${mode === 'ocr' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
            >
              <Sparkles size={16} style={{ color: mode === 'ocr' ? '#ffffff' : 'var(--primary)' }} />
              <span>رفع صورة أو ملف PDF مع قراءة مباشرة (OCR)</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('manual'); setError(null); }}
              className={`tab-pill ${mode === 'manual' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
            >
              <Edit3 size={16} />
              <span>إدخال يدوي مباشر للفاتورة</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="alert-danger mb-4">
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{error}</span>
          <button
            style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            onClick={() => setError(null)}
          ><X size={16} /></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: mode === 'ocr' ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>

          {/* ── Left Column: OCR / File Upload & Laser Scanner ──────────────── */}
          {mode === 'ocr' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={20} style={{ color: 'var(--primary)' }} />
                  رفع صورة أو ملف PDF الفاتورة
                </h5>
                <span className="badge badge-purple">
                  <Sparkles size={12} /> قراءة فورية وتلقائية
                </span>
              </div>

              {/* Upload Drop Zone / Laser Box */}
              <div
                className={`upload-zone ${isDragging ? 'drag-over' : ''}`}
                style={{
                  position: 'relative',
                  minHeight: 280,
                  cursor: 'pointer',
                  border: uploadedFile ? '2px solid var(--primary)' : undefined,
                  background: ocrLoading ? '#0f172a' : undefined
                }}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileDrop(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={e => handleFileDrop(e.target.files)}
                  style={{ display: 'none' }}
                />

                {/* Laser scan animation when reading */}
                {ocrLoading && (
                  <div className="ocr-laser-line" />
                )}

                {previewUrl ? (
                  <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                    <img
                      src={previewUrl}
                      alt="معاينة الفاتورة"
                      style={{
                        maxHeight: 260,
                        maxWidth: '100%',
                        borderRadius: 12,
                        objectFit: 'contain',
                        opacity: ocrLoading ? 0.6 : 1
                      }}
                    />
                    {ocrLoading && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#38bdf8',
                        background: 'rgba(15, 23, 42, 0.75)',
                        borderRadius: 12
                      }}>
                        <Loader size={36} className="animate-spin" style={{ marginBottom: 12 }} />
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>جاري مسح بيانات الفاتورة ضوئياً...</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>استخراج الصيدلية، الأدوية، والكميات تلقائياً</div>
                      </div>
                    )}
                  </div>
                ) : uploadedFile ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: ocrLoading ? '#ffffff' : 'inherit' }}>
                    <FilePdfIcon size={64} style={{ color: 'var(--danger)', marginBottom: 10 }} />
                    <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{uploadedFile.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 4 }}>
                      مستند PDF ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </p>
                    {ocrLoading && (
                      <div style={{ marginTop: '1rem', color: '#38bdf8' }}>
                        <Loader size={24} className="animate-spin" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }} />
                        <span style={{ fontWeight: 700 }}>جاري استخراج بيانات جدول الفاتورة من ملف PDF...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <Upload size={32} />
                    </div>
                    <p style={{ fontWeight: 800, color: 'var(--gray-800)', fontSize: '1rem', marginBottom: 6 }}>
                      اسحب صورة الفاتورة أو ملف PDF هنا أو انقر للاختيار
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)', maxWidth: 360, margin: '0 auto' }}>
                      يدعم صور الكاميرا والمستندات (JPG، PNG، WebP، PDF) — يتم تحليلها وقراءة بياناتها فورياً
                    </p>
                  </div>
                )}
              </div>

              {/* Status & Re-scan bar */}
              {uploadedFile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ocrDone ? (
                    <div className="alert-success" style={{ margin: 0, padding: '0.75rem 1rem' }}>
                      <CheckCircle2 size={22} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 800, color: '#065f46' }}>
                          تمت قراءة البيانات بنجاح (دقة الـ OCR: {ocrConfidence}%)
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: 2 }}>
                          تم تعبئة رقم الفاتورة، تاريخها، الصيدلية، وكافة الأصناف تلقائياً في الجدول على اليمين.
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => uploadedFile && processOcr(uploadedFile)}
                      disabled={ocrLoading}
                      className="btn-clay btn-secondary flex-1"
                    >
                      <RefreshCw size={15} className={ocrLoading ? 'animate-spin' : ''} />
                      إعادة المسح الضوئي
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUploadedFile(null); setPreviewUrl(null); setOcrDone(false); }}
                      className="btn-clay btn-secondary"
                      title="إزالة الملف"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Right Column: Invoice Form & Items ───────────────────────────── */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={20} style={{ color: 'var(--success)' }} />
                تفاصيل الفاتورة والبنود
              </h5>
              {ocrDone && (
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                  <Check size={13} /> تمت القراءة آلياً
                </span>
              )}
            </div>

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                  الصيدلية المستهدفة *
                </label>
                <select
                  className="clay-input"
                  value={pharmacyId}
                  onChange={e => setPharmacyId(e.target.value)}
                  required
                >
                  <option value="">-- اختر الصيدلية --</option>
                  {pharmacies.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                  رقم الفاتورة *
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    className="clay-input"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setInvoiceNumber(generateInvoiceNumber())}
                    className="btn-clay btn-secondary btn-sm"
                    title="توليد رقم جديد"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                  تاريخ الفاتورة *
                </label>
                <input
                  type="date"
                  className="clay-input"
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Products Table */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--gray-800)' }}>
                  الأصناف والكميات المحسوبة:
                </span>
                <button type="button" onClick={addItem} className="btn-clay btn-secondary btn-sm">
                  <Plus size={14} /> إضافة صنف آخر
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {items.map((item, idx) => {
                  const { prod, unitPrice, bonus, lineTotal } = getItemCalc(item);
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 100px 90px 80px 100px 36px',
                        gap: '0.5rem',
                        alignItems: 'center',
                        background: 'var(--gray-50)',
                        borderRadius: 12,
                        padding: '0.65rem 0.85rem',
                        border: '1px solid var(--gray-200)'
                      }}
                    >
                      {/* Product Selector */}
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>المنتج</span>
                        <select
                          className="clay-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                          value={item.product_id}
                          onChange={e => updateItem(item.id, 'product_id', e.target.value)}
                          required
                        >
                          <option value="">-- اختر المنتج --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.base_price} د.ع)</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>الكمية</span>
                        <input
                          type="number"
                          min={1}
                          className="clay-input"
                          style={{ padding: '0.4rem', textAlign: 'center', fontSize: '0.85rem' }}
                          value={item.sold_quantity}
                          onChange={e => updateItem(item.id, 'sold_quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        />
                      </div>

                      {/* Unit Price */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>السعر</span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                          {unitPrice.toLocaleString()} د.ع
                        </span>
                      </div>

                      {/* Bonus (10+1) */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>البونص</span>
                        <span className={`badge ${bonus > 0 ? 'badge-warning' : 'badge-gray'}`} style={{ fontSize: '0.75rem' }}>
                          +{bonus} مجاناً
                        </span>
                      </div>

                      {/* Total */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>المجموع</span>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>
                          {lineTotal.toLocaleString()} د.ع
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: items.length <= 1 ? 'var(--gray-300)' : 'var(--danger)',
                          cursor: items.length <= 1 ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 4
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                ملاحظات الفاتورة (اختياري)
              </label>
              <input
                type="text"
                className="clay-input"
                placeholder="مثال: تم الاتفاق على السداد خلال 30 يوم"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {/* Total Financial Summary Card */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: 14,
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>إجمالي الفاتورة الصافي:</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {totalSales.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>دينار عراقي</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>إجمالي القطع</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-800)' }}>{totalPieces} قطعة</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--warning)' }}>إجمالي البونص</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--warning)' }}>+{totalBonus} مجانية</div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={submitting || ocrLoading}
                className="btn-clay btn-primary flex-1"
                style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', fontWeight: 800 }}
              >
                {submitting ? (
                  <><Loader size={18} className="animate-spin" /> جاري حفظ الفاتورة في سوبا بيس...</>
                ) : (
                  <><CheckCircle2 size={20} /> حفظ الفاتورة وإرسالها للاعتماد</>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="btn-clay btn-secondary"
                style={{ padding: '0.875rem 1.25rem' }}
              >
                إلغاء
              </button>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
};
