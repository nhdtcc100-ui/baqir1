import React, { useState, useRef, useCallback } from 'react';
import { Pharmacy, Product, Invoice } from '../types';
import { api } from '../services/api';
import { BatchReviewTable, BatchInvoiceCard, BAGHDAD_AREAS, autoDetectDosageForm } from './BatchReviewTable';
import {
  FilePlus, Upload, Edit3, FileImage, FileText as FilePdfIcon,
  Plus, Trash2, Calculator, CheckCircle2, AlertCircle, Sparkles,
  RefreshCw, X, ArrowRight, Camera, Loader, Database, Eye, Check,
  Layers, Images
} from 'lucide-react';

interface AddInvoicePageProps {
  pharmacies: Pharmacy[];
  products: Product[];
  invoices?: Invoice[];
  initialPharmacyId?: string;
  onInvoiceCreated: (invoice: Invoice) => void;
  onCancel: () => void;
}

type EntryMode = 'manual' | 'ocr';

interface LineItem {
  id: string;
  product_id: string;
  sold_quantity: number;
  /** اسم المنتج المقروء من الفاتورة أو المحدد يدوياً */
  custom_name?: string;
  /** الشكل الدوائي / نوع المادة (كريم، قطرة، مرهم، حبوب، إلخ) */
  dosage_form?: string;
  /** السعر المقروء من الفاتورة */
  custom_price?: number;
  /** البونص المقروء من الفاتورة */
  ocr_bonus?: number;
  /** البونص المعدّل يدوياً */
  manual_bonus?: number;
  ocr_confidence?: number;
}

export interface BatchInvoice {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'scanning' | 'done' | 'error';
  errorMsg?: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyArea?: string;
  invoiceNumber: string;
  invoiceDate: string;
  imageUrl?: string;
  items: LineItem[];
  notes?: string;
  confidence: number;
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
  invoices = [],
  initialPharmacyId,
  onInvoiceCreated,
  onCancel
}) => {
  const [mode, setMode] = useState<EntryMode>('ocr');

  // Form fields
  const [availablePharmacies, setAvailablePharmacies] = useState(pharmacies);
  // Start empty unless a specific pharmacy was requested
  const [pharmacyId, setPharmacyId]       = useState(initialPharmacyId || '');
  const [pharmacyName, setPharmacyName]   = useState(() => {
    const initPh = pharmacies.find(p => p.id === initialPharmacyId);
    return initPh ? initPh.name : '';
  });
  const [pharmacyArea, setPharmacyArea]   = useState(() => {
    const initPh = pharmacies.find(p => p.id === initialPharmacyId);
    return (initPh as any)?.area || '';
  });
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber);
  const [invoiceDate, setInvoiceDate]     = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes]                 = useState('');
  const [imageUrl, setImageUrl]           = useState('');
  /** اسم الصيدلية المكتشفة من OCR */
  const [ocrPharmacyName, setOcrPharmacyName] = useState('');

  // نظام البونص الثابت (10+1): كل 10 قطع = 1 قطعة مجانية
  const [fixedBonusEnabled, setFixedBonusEnabled] = useState(true);

  // Line items — custom_name/custom_price/ocr_bonus hold OCR-extracted values
  const [items, setItems] = useState<LineItem[]>([
    { id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10, ocr_bonus: 1 }
  ]);

  // فحص الفواتير المكررة: رقم الفاتورة أو (نفس الصيدلية + نفس التاريخ + نفس كامل الأصناف والكميات)
  const duplicateInvoice = (() => {
    const curNum = invoiceNumber.trim();
    const curPhName = pharmacyName.trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');
    const curPhId = String(pharmacyId || '').trim();

    return invoices.find(inv => {
      // 1. فحص رقم الفاتورة إذا كان غير افتراضي ومطابق
      const invNum = String(inv.invoice_number || '').trim();
      if (curNum && invNum && curNum === invNum && !curNum.toUpperCase().startsWith('INV-')) {
        return true;
      }

      // 2. فحص الصيدلية والتاريخ
      if (!invoiceDate) return false;
      const invDate = String(inv.invoice_date || '').split('T')[0];
      if (invDate !== invoiceDate) return false;

      const invPhId = String(inv.pharmacy_id || '').trim();
      const invPhName = String(inv.pharmacy_name || '').trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');

      const samePharmacy = (curPhId && invPhId && curPhId === invPhId) ||
        (curPhName.length >= 2 && invPhName.length >= 2 && (curPhName.includes(invPhName) || invPhName.includes(curPhName)));

      if (!samePharmacy) return false;

      // 3. تحقق من تطابق كامل الأصناف والكميات
      const existingItems = inv.items || [];
      if (existingItems.length !== items.length || items.length === 0) return false;
      const normalizeItem = (it: any) => {
        const raw = String(it.custom_product_name || it.product_name_snapshot || it.custom_name || '').trim().toLowerCase();
        const fallback = products.find(p => p.id === it.product_id)?.name?.toLowerCase() || String(it.product_id || '');
        const cleanName = (raw || fallback).replace(/[^a-z0-9\u0621-\u064A]/gi, '');
        return {
          name: cleanName,
          qty: Number(it.sold_quantity || it.quantity || 0)
        };
      };
      const sortedExisting = [...existingItems].map(normalizeItem).sort((a, b) => a.name.localeCompare(b.name));
      const sortedCurrent  = [...items].map(normalizeItem).sort((a, b) => a.name.localeCompare(b.name));
      return sortedExisting.every((ex, i) => {
        const cur = sortedCurrent[i];
        if (!cur) return false;
        const nameMatch = ex.name === cur.name || ex.name.includes(cur.name) || cur.name.includes(ex.name);
        return nameMatch && ex.qty === cur.qty;
      });
    }) || null;
  })();

  // Keep availablePharmacies in sync with prop
  React.useEffect(() => {
    setAvailablePharmacies(pharmacies);
  }, [pharmacies]);

  // Upload / OCR state
  // ── Multi-Image Batch Upload State ──
  const [batchInvoices, setBatchInvoices] = useState<BatchInvoice[]>([]);
  const [activeBatchIndex, setActiveBatchIndex] = useState<number>(0);
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [showBatchReview, setShowBatchReview] = useState(false);
  const [reviewCards, setReviewCards] = useState<BatchInvoiceCard[]>([]);

  const [uploadedFile, setUploadedFile]   = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [isDragging, setIsDragging]       = useState(false);
  const [ocrLoading, setOcrLoading]       = useState(false);
  const [ocrDone, setOcrDone]             = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [ocrSummary, setOcrSummary]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const switchToBatchItem = (index: number) => {
    if (index < 0 || index >= batchInvoices.length) return;

    // Save current active invoice state into batchInvoices array first
    setBatchInvoices(prev => prev.map((item, i) => {
      if (i === activeBatchIndex) {
        return {
          ...item,
          pharmacyId,
          pharmacyName,
          pharmacyArea,
          invoiceNumber,
          invoiceDate,
          items,
          notes,
          imageUrl
        };
      }
      return item;
    }));

    const target = batchInvoices[index];
    setActiveBatchIndex(index);
    setPharmacyId(target.pharmacyId);
    setPharmacyName(target.pharmacyName);
    setPharmacyArea(target.pharmacyArea || '');
    setOcrPharmacyName(target.pharmacyName);
    setInvoiceNumber(target.invoiceNumber);
    setInvoiceDate(target.invoiceDate);
    setItems(target.items && target.items.length > 0 ? target.items : [{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10, dosage_form: 'حبوب' }]);
    setNotes(target.notes || '');
    setPreviewUrl(target.previewUrl);
    setImageUrl(target.imageUrl || '');
    setUploadedFile(target.file);
    setOcrDone(target.status === 'done');
    setOcrConfidence(target.confidence);
  };

  const removeBatchItem = (index: number) => {
    const updated = batchInvoices.filter((_, i) => i !== index);
    setBatchInvoices(updated);
    if (updated.length === 0) {
      setUploadedFile(null);
      setPreviewUrl(null);
      setOcrDone(false);
      setPharmacyName('');
      setPharmacyArea('');
      setPharmacyId('');
      setInvoiceNumber(generateInvoiceNumber());
      setItems([{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10, dosage_form: 'حبوب' }]);
      setActiveBatchIndex(0);
    } else {
      const nextIdx = Math.min(index, updated.length - 1);
      setActiveBatchIndex(nextIdx);
      const target = updated[nextIdx];
      setPharmacyId(target.pharmacyId);
      setPharmacyName(target.pharmacyName);
      setPharmacyArea(target.pharmacyArea || '');
      setInvoiceNumber(target.invoiceNumber);
      setInvoiceDate(target.invoiceDate);
      setItems(target.items);
      setPreviewUrl(target.previewUrl);
      setUploadedFile(target.file);
      setOcrDone(target.status === 'done');
    }
  };

  // Sample Presets for 1-Click Instant OCR Testing
  const samplePresets = [
    {
      name: 'فاتورة مذخر مزايا بغداد - لوكسترا (SAL-01-607115)',
      invoiceNumber: 'SAL-01-607115',
      invoiceDate: '2026-07-13',
      pharmacySearch: 'الصحة العالمية',
      pharmacyFullName: 'صيدلية الصحة العالمية / الكرادة',
      img: '/samples/invoice_mazaya_loxtra.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_mazaya_loxtra.jpg',
      items: [
        { productSearch: 'loxtra', customName: 'loxtra 5ml drop', qty: 10, price: 4828, bonus: 1 }
      ]
    },
    {
      name: 'فاتورة مذخر مزايا بغداد - إليكا (SAL-01-596911)',
      invoiceNumber: 'SAL-01-596911',
      invoiceDate: '2026-07-05',
      pharmacySearch: 'الأماكن',
      pharmacyFullName: 'صيدلية الأماكن / الحبيبية',
      img: '/samples/invoice_mazaya_elica.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_mazaya_elica.jpg',
      items: [
        { productSearch: '30g oint', customName: 'elica 30g oint', qty: 20, price: 4828, bonus: 2 },
        { productSearch: '30g cream', customName: 'Elica m 30g cream', qty: 20, price: 5706, bonus: 2 }
      ]
    },
    {
      name: 'فاتورة مذخر طريق السلام (رقم 569514)',
      invoiceNumber: '569514',
      invoiceDate: '2026-07-11',
      pharmacySearch: 'نور الهدى',
      pharmacyFullName: 'صيدلية نور الهدى حميد لفتة (البلديات)',
      img: '/samples/invoice_tareeq_alsalam.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_tareeq_alsalam.jpg',
      items: [
        { productSearch: 'hyfresh', customName: 'Hyfresh drop jamjoom', qty: 100, price: 5267, bonus: 10 }
      ]
    },
    {
      name: 'فاتورة مذخر أدوية العناية (رقم 16188)',
      invoiceNumber: '16188',
      invoiceDate: '2026-07-18',
      pharmacySearch: 'حسين هاشم',
      pharmacyFullName: 'ص حسين هاشم محمود - زيونة',
      img: '/samples/invoice_elica_care.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_elica_care.jpg',
      items: [
        { productSearch: 'elica m cream', customName: 'ELICA M CREAM', qty: 50, price: 5706, bonus: 5 },
        { productSearch: 'elica ointment', customName: 'ELICA OINTMENT 30 G', qty: 50, price: 4828, bonus: 5 }
      ]
    },
    {
      name: 'فاتورة مذخر الشغف - الحارثية (رقم 130683)',
      invoiceNumber: '130683',
      invoiceDate: '2026-04-13',
      pharmacySearch: 'الثقة',
      pharmacyFullName: 'صيدلية الثقة /محمودية',
      img: '/samples/invoice_shaghaf_elicasal.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_shaghaf_elicasal.jpg',
      items: [
        { productSearch: 'elicasal', customName: 'elicasal oint 30g jamjoom', qty: 100, price: 5750, bonus: 10 }
      ]
    },
    {
      name: 'فاتورة مذخر أدوية السعفة - الزعفرانية (رقم 44941)',
      invoiceNumber: '44941',
      invoiceDate: '2026-07-25',
      pharmacySearch: 'صفا الورد',
      pharmacyFullName: 'صيدلية صفا الورد مجمع بسماية',
      img: '/samples/invoice_saafa_fusibact.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_saafa_fusibact.jpg',
      items: [
        { productSearch: 'Fusibact', customName: 'Fusibact 2% cream', qty: 112, price: 2842, bonus: 11 },
        { productSearch: 'Elica -M', customName: 'Elica -M cream 0.1%', qty: 300, price: 5855, bonus: 30 },
        { productSearch: 'Hy Fresh', customName: 'Hy Fresh drups', qty: 320, price: 5247, bonus: 32 }
      ]
    },
    // ====== NEW INVOICES FROM USER (Nov 2026) ======
    {
      name: 'فاتورة مزايا بغداد - لوكسترا (SAL-01-607115)',
      invoiceNumber: 'SAL-01-607115',
      invoiceDate: '2026-07-13',
      pharmacySearch: 'الصحة العالمية',
      pharmacyFullName: 'صيدلية الصحة العالمية / الكرادة',
      img: '/samples/invoice_mazaya_loxtra607115.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_mazaya_loxtra607115.jpg',
      items: [
        { productSearch: 'loxtra', customName: 'loxtra 5ml drop', qty: 10, price: 4628, bonus: 0 }
      ]
    },
    {
      name: 'فاتورة مزايا بغداد - إليكا مزدوج (SAL-01-596911)',
      invoiceNumber: 'SAL-01-596911',
      invoiceDate: '2026-07-05',
      pharmacySearch: 'الأمكن',
      pharmacyFullName: 'صيدلية الأمكن / الحبيبية',
      img: '/samples/invoice_mazaya_elica596911.jpg',
      serverImg: 'http://localhost:5000/uploads/invoices/invoice_mazaya_elica596911.jpg',
      items: [
        { productSearch: '30g oint', customName: 'elica 30g oint', qty: 20, price: 4828, bonus: 0 },
        { productSearch: '30g cream', customName: 'Elica m 30g cream', qty: 20, price: 5706, bonus: 0 }
      ]
    }
  ];

  const handleLoadSample = (sample: typeof samplePresets[0]) => {
    setOcrLoading(true);
    setOcrDone(false);
    setError(null);
    // Clear previous pharmacy immediately so screen indicates fresh loading
    setPharmacyName('');
    setPharmacyId('');
    setOcrPharmacyName('');
    setPreviewUrl(sample.img);
    setImageUrl(sample.serverImg);
    setUploadedFile(new File([''], sample.name + '.jpg', { type: 'image/jpeg' }));

    setTimeout(() => {
      // Match pharmacy by real name
      const foundPh = pharmacies.find(p =>
        p.name.includes(sample.pharmacySearch) ||
        sample.pharmacyFullName.includes(p.name.split(' ')[1] || '')
      ) || null;
      // Always update the visible pharmacy name field with what OCR detected
      if (foundPh) {
        setPharmacyId(foundPh.id);
        setPharmacyName(foundPh.name);
      } else {
        setPharmacyId('');
        setPharmacyName(sample.pharmacyFullName);
      }
      setOcrPharmacyName(sample.pharmacyFullName);

      setInvoiceNumber(sample.invoiceNumber);
      setInvoiceDate(sample.invoiceDate);

      // Map products with real OCR names and prices
      const mapped: LineItem[] = sample.items.map((it, idx) => {
        // Try to find the exact product
        const prod = products.find(p =>
          p.name.toLowerCase().includes(it.productSearch.toLowerCase()) ||
          it.productSearch.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
        ) || products[idx] || products[0];
        return {
          id: 'sample-' + idx,
          product_id: prod.id,
          sold_quantity: it.qty,
          custom_name: it.customName,
          dosage_form: autoDetectDosageForm(it.customName || ''),
          custom_price: it.price,
          ocr_bonus: it.bonus,
          ocr_confidence: 0.98
        };
      });
      setItems(mapped.length > 0 ? mapped : items);

      setOcrConfidence(98);
      setOcrDone(true);
      setOcrSummary(`تم استخراج بيانات الفاتورة بنجاح: رقم ${sample.invoiceNumber} — ${sample.pharmacyFullName} — ${mapped.length} أصناف`);
      setOcrLoading(false);
    }, 700);
  };

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // ── Calculation helpers ───────────────────────────────────────────────────
  const getItemCalc = (item: LineItem) => {
    const prod = products.find(p => p.id === item.product_id) || products[0];
    // Use OCR-extracted price if available, otherwise fall back to catalog price
    const unitPrice = item.custom_price ?? (prod?.base_price ? Number(prod.base_price) : 0);
    
    // حساب البونص:
    // إذا كان نظام البونص الثابت (10+1) مفعلاً ولم يتم إدخال يدوي: Math.floor(الكمية / 10)
    let bonus = Math.floor(item.sold_quantity / 10);
    if (item.manual_bonus !== undefined) {
      bonus = item.manual_bonus;
    } else if (fixedBonusEnabled) {
      bonus = Math.floor(item.sold_quantity / 10);
    } else if (item.ocr_bonus !== undefined) {
      bonus = item.ocr_bonus;
    }

    const lineTotal = item.sold_quantity * unitPrice;
    // Display name: OCR name > catalog name
    const displayName = item.custom_name || prod?.name || '';
    return { prod, unitPrice, bonus, lineTotal, displayName };
  };

  const totalSales  = items.reduce((s, i) => s + getItemCalc(i).lineTotal, 0);
  const totalPieces = items.reduce((s, i) => s + i.sold_quantity, 0);
  const totalBonus  = items.reduce((s, i) => s + getItemCalc(i).bonus, 0);
  const addItem = () => setItems(prev => [
    ...prev,
    {
      id: 'item-' + Date.now(),
      product_id: products[0]?.id || '',
      sold_quantity: 10,
      custom_name: '',
      dosage_form: 'حبوب',
      custom_price: undefined,
      ocr_bonus: fixedBonusEnabled ? 1 : undefined
    }
  ]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) =>
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = { ...i, [field]: val };
      if (field === 'sold_quantity' && fixedBonusEnabled && i.manual_bonus === undefined) {
        updated.ocr_bonus = Math.floor((Number(val) || 0) / 10);
      }
      if (field === 'custom_name' && !i.dosage_form) {
        const detected = autoDetectDosageForm(val);
        if (detected) updated.dosage_form = detected;
      }
      return updated;
    }));

  // ── Smart OCR execution ───────────────────────────────────────────────────
  const processOcr = async (file: File) => {
    setOcrLoading(true);
    setOcrDone(false);
    setError(null);
    // Clear previous pharmacy data immediately so UI shows "scanning..." not old data
    setPharmacyName('');
    setPharmacyId('');
    setOcrPharmacyName('');

    try {
      const result = await api.uploadInvoiceFile(file, pharmacyId);

      // Auto-fill pharmacy if matched or newly registered
      if (result.pharmacy_name) {
        setPharmacyName(result.pharmacy_name);
        setOcrPharmacyName(result.pharmacy_name);
      }
      if (result.pharmacy_area) {
        setPharmacyArea(result.pharmacy_area);
      }
      if (result.pharmacy_id) {
        setPharmacyId(result.pharmacy_id);
        setAvailablePharmacies(prev => {
          if (!prev.some(p => p.id === result.pharmacy_id)) {
            return [{ id: result.pharmacy_id!, name: result.pharmacy_name || 'صيدلية جديدة', city: 'بغداد', area: result.pharmacy_area } as any, ...prev];
          }
          return prev;
        });
      } else if (result.pharmacy_name) {
        const foundPh = availablePharmacies.find(p => p.name.includes(result.pharmacy_name!));
        if (foundPh) {
          setPharmacyId(foundPh.id);
          if ((foundPh as any).area && !result.pharmacy_area) setPharmacyArea((foundPh as any).area);
        }
      }

      // Auto-fill invoice number & date
      if (result.invoice_number) setInvoiceNumber(result.invoice_number);
      if (result.invoice_date) setInvoiceDate(result.invoice_date);
      if (result.image_url) setImageUrl(result.image_url);

      // Auto-fill extracted product items — preserve exact OCR names & prices
      if (result.extracted_items && result.extracted_items.length > 0) {
        const mappedItems: LineItem[] = result.extracted_items.map((ei, idx) => {
          // Try to find a matching product in catalog (for product_id FK)
          let matched = products.find(p => p.id === ei.product_id);
          if (!matched && ei.product_name) {
            matched = products.find(p =>
              p.name.toLowerCase().includes(ei.product_name.toLowerCase().slice(0, 6)) ||
              ei.product_name.toLowerCase().includes(p.name.toLowerCase().slice(0, 6))
            );
          }
          return {
            id: 'ocr-' + idx,
            product_id: matched?.id || products[0]?.id || '',
            sold_quantity: ei.quantity || 10,
            custom_name: ei.product_name || matched?.name || '',
            dosage_form: (ei as any).dosage_form || autoDetectDosageForm(ei.product_name || matched?.name || ''),
            custom_price: ei.unit_price ?? (matched ? Number(matched.base_price) : undefined),
            ocr_bonus: fixedBonusEnabled ? Math.floor((ei.quantity || 10) / 10) : (ei.bonus_quantity !== undefined ? ei.bonus_quantity : Math.floor((ei.quantity || 10) / 10)),
            ocr_confidence: result.confidence
          };
        });
        setItems(mappedItems);
      }

      setOcrConfidence(Math.round(result.confidence * 100));
      setOcrDone(true);
      setOcrSummary(`تم استخراج ${result.extracted_items?.length || 0} أصناف بنجاح — ${result.pharmacy_name || ''}${result.invoice_number ? ' — رقم: ' + result.invoice_number : ''}`);
    } catch (e: any) {
      setError('تعذر استخراج بيانات الملف تلقائياً: ' + e.message);
    } finally {
      setOcrLoading(false);
    }
  };

  // ── Handle file selection / drop with IMMEDIATE OCR reading ──────────────
  const handleFileDrop = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allFiles = Array.from(files).filter(f =>
      f.type.startsWith('image/') ||
      f.type === 'application/pdf' ||
      /\.(jpg|jpeg|png|webp|jfif|bmp|gif|pdf)$/i.test(f.name)
    );

    if (allFiles.length === 0) {
      setError('نوع الملف غير مدعوم. يرجى رفع صورة فاتورة (JPG, PNG, WebP) أو ملف مستند PDF.');
      return;
    }

    setError(null);

    // إذا تم اختيار أكثر من ملف أو كانت هناك دفعة مسبقة
    if (allFiles.length > 1 || batchInvoices.length > 0) {
      const newItems: BatchInvoice[] = allFiles.map((f, i) => ({
        id: `batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        file: f,
        previewUrl: f.type !== 'application/pdf' ? URL.createObjectURL(f) : '',
        status: 'pending',
        pharmacyId: '',
        pharmacyName: '',
        pharmacyArea: '',
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split('T')[0],
        items: [{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10, dosage_form: 'حبوب' }],
        confidence: 0
      }));

      const combined = [...batchInvoices, ...newItems];
      setBatchInvoices(combined);
      const startIdx = batchInvoices.length;
      setActiveBatchIndex(startIdx);

      // معالجة كل ملف جديد بشكل متتالٍ بـ Gemini OCR
      for (let i = 0; i < newItems.length; i++) {
        const itemIdx = startIdx + i;
        const curFile = newItems[i].file;

        setBatchInvoices(prev => prev.map((item, idx) =>
          idx === itemIdx ? { ...item, status: 'scanning' } : item
        ));

        if (itemIdx === startIdx) {
          setOcrLoading(true);
          setPreviewUrl(newItems[i].previewUrl);
          setUploadedFile(curFile);
          setPharmacyName('');
          setPharmacyArea('');
          setPharmacyId('');
        }

        try {
          const result = await api.uploadInvoiceFile(curFile);

          const mapped: LineItem[] = (result.extracted_items || []).map((ei, idx) => {
            let matched = products.find(p => p.id === ei.product_id);
            if (!matched && ei.product_name) {
              matched = products.find(p =>
                p.name.toLowerCase().includes(ei.product_name.toLowerCase().slice(0, 6)) ||
                ei.product_name.toLowerCase().includes(p.name.toLowerCase().slice(0, 6))
              );
            }
            return {
              id: 'ocr-' + idx,
              product_id: matched?.id || products[0]?.id || '',
              sold_quantity: ei.quantity || 10,
              custom_name: ei.product_name || matched?.name || '',
              dosage_form: (ei as any).dosage_form || autoDetectDosageForm(ei.product_name || matched?.name || ''),
              custom_price: ei.unit_price ?? (matched ? Number(matched.base_price) : undefined),
              ocr_bonus: fixedBonusEnabled ? Math.floor((ei.quantity || 10) / 10) : (ei.bonus_quantity !== undefined ? ei.bonus_quantity : Math.floor((ei.quantity || 10) / 10)),
              ocr_confidence: result.confidence
            };
          });

          const finalItems = mapped.length > 0 ? mapped : [{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10, dosage_form: 'حبوب' }];

          setBatchInvoices(prev => prev.map((item, idx) => {
            if (idx === itemIdx) {
              return {
                ...item,
                status: 'done',
                pharmacyId: result.pharmacy_id || '',
                pharmacyName: result.pharmacy_name || '',
                pharmacyArea: result.pharmacy_area || '',
                invoiceNumber: result.invoice_number || item.invoiceNumber,
                invoiceDate: result.invoice_date || item.invoiceDate,
                imageUrl: result.image_url,
                items: finalItems,
                confidence: Math.round(result.confidence * 100)
              };
            }
            return item;
          }));

          if (itemIdx === startIdx) {
            if (result.pharmacy_name) {
              setPharmacyName(result.pharmacy_name);
              setOcrPharmacyName(result.pharmacy_name);
            }
            if (result.pharmacy_area) setPharmacyArea(result.pharmacy_area);
            if (result.pharmacy_id) setPharmacyId(result.pharmacy_id);
            if (result.invoice_number) setInvoiceNumber(result.invoice_number);
            if (result.invoice_date) setInvoiceDate(result.invoice_date);
            if (result.image_url) setImageUrl(result.image_url);
            setItems(finalItems);
            setOcrConfidence(Math.round(result.confidence * 100));
            setOcrDone(true);
            setOcrSummary(`تم استخراج ${result.extracted_items?.length || 0} أصناف — ${result.pharmacy_name || ''}`);
          }
        } catch (err: any) {
          setBatchInvoices(prev => prev.map((item, idx) =>
            idx === itemIdx ? { ...item, status: 'error', errorMsg: err.message } : item
          ));
        } finally {
          if (itemIdx === startIdx) setOcrLoading(false);
        }
      }

      // عند رفع أكثر من صورة، بعد اكتمال المسح لجميع الصور نفتح جدول المراجعة والتدقيق تلقائياً
      if (allFiles.length > 1) {
        setTimeout(() => {
          setBatchInvoices(latest => {
            const cards: BatchInvoiceCard[] = latest.map((b, i) => ({
              id: b.id || `inv-${i}`,
              file_name: b.file?.name,
              image_url: b.imageUrl || b.previewUrl,
              invoice_number: b.invoiceNumber,
              invoice_date: b.invoiceDate,
              pharmacy_id: b.pharmacyId,
              pharmacy_name: b.pharmacyName,
              pharmacy_area: b.pharmacyArea || '',
              confidence: b.confidence ? b.confidence / 100 : 0.8,
              items: (b.items || []).map((it, idx) => {
                const prod = products.find(p => p.id === it.product_id);
                const price = it.custom_price !== undefined ? it.custom_price : Number(prod?.base_price || 5000);
                const bonus = it.manual_bonus !== undefined ? it.manual_bonus : (it.ocr_bonus !== undefined ? it.ocr_bonus : Math.floor((it.sold_quantity || 10) / 10));
                return {
                  id: it.id || `it-${idx}`,
                  product_id: it.product_id,
                  product_name: it.custom_name || prod?.name || 'مستحضر دوائي',
                  dosage_form: it.dosage_form || autoDetectDosageForm(it.custom_name || prod?.name || ''),
                  quantity: it.sold_quantity || 10,
                  unit_price: price,
                  bonus_quantity: bonus,
                  line_total: (it.sold_quantity || 10) * price,
                  ocr_confidence: it.ocr_confidence
                };
              })
            }));
            setReviewCards(cards);
            setShowBatchReview(true);
            return latest;
          });
        }, 400);
      }

    } else {
      // ملف مفرد
      const file = allFiles[0];
      setUploadedFile(file);
      setInvoiceNumber(generateInvoiceNumber());
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setItems([{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10 }]);
      setOcrDone(false);
      setOcrSummary(null);

      if (file.type !== 'application/pdf') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      processOcr(file);
    }
  }, [pharmacies, products, pharmacyId, batchInvoices]);

  // ── فتح جدول المراجعة والتدقيق الشامل لجميع فواتير الدفعة ─────────────────
  const openBatchReviewTable = () => {
    // مزامنة الفاتورة النشطة حالياً أولاً
    const currentBatch = batchInvoices.map((item, i) => {
      if (i === activeBatchIndex) {
        return {
          ...item,
          pharmacyId,
          pharmacyName,
          pharmacyArea,
          invoiceNumber,
          invoiceDate,
          items,
          notes,
          imageUrl
        };
      }
      return item;
    });

    const cards: BatchInvoiceCard[] = currentBatch.map((b, i) => ({
      id: b.id || `inv-${i}`,
      file_name: b.file?.name,
      image_url: b.imageUrl || b.previewUrl,
      invoice_number: b.invoiceNumber,
      invoice_date: b.invoiceDate,
      pharmacy_id: b.pharmacyId,
      pharmacy_name: b.pharmacyName,
      pharmacy_area: b.pharmacyArea || '',
      confidence: b.confidence ? b.confidence / 100 : 0.8,
      items: (b.items || []).map((it, idx) => {
        const calc = getItemCalc(it);
        const prod = products.find(p => p.id === it.product_id);
        const price = it.custom_price !== undefined ? it.custom_price : Number(prod?.base_price || 5000);
        const bonus = it.manual_bonus !== undefined ? it.manual_bonus : (it.ocr_bonus !== undefined ? it.ocr_bonus : calc.bonus);
        return {
          id: it.id || `it-${idx}`,
          product_id: it.product_id,
          product_name: it.custom_name || prod?.name || 'مستحضر دوائي',
          dosage_form: it.dosage_form || autoDetectDosageForm(it.custom_name || prod?.name || ''),
          quantity: it.sold_quantity || 10,
          unit_price: price,
          bonus_quantity: bonus,
          line_total: (it.sold_quantity || 10) * price,
          ocr_confidence: it.ocr_confidence
        };
      })
    }));

    setReviewCards(cards);
    setShowBatchReview(true);
  };

  // ── حفظ ومزامنة جميع فواتير الدفعة إلى سوبا بيس وكوكل شيت ───────────────
  const handleSaveAllBatch = async () => {
    if (batchInvoices.length === 0) return;
    setBatchSubmitting(true);
    setError(null);

    try {
      // مزامنة التعديلات الحالية على الفاتورة النشطة
      const updatedBatch = batchInvoices.map((item, idx) => {
        if (idx === activeBatchIndex) {
          return {
            ...item,
            pharmacyId,
            pharmacyName,
            pharmacyArea,
            invoiceNumber,
            invoiceDate,
            items,
            notes,
            imageUrl
          };
        }
        return item;
      });

      for (const item of updatedBatch) {
        const distinct = item.pharmacyName.replace(/^(صيدلية|صيدليه|مذخر|ص)\b/gi, '').trim();
        if (!item.pharmacyId && distinct.length < 2) {
          setError(`يرجى تحديد أو كتابة اسم صيدلية صحيح ومميز للفاتورة (${item.invoiceNumber || item.file?.name || 'بدون رقم'})`);
          setBatchSubmitting(false);
          return;
        }
      }

      const payloads = updatedBatch.map(item => ({
        pharmacy_id: item.pharmacyId || undefined,
        pharmacy_name: item.pharmacyName.trim() || undefined,
        pharmacy_area: item.pharmacyArea?.trim() || undefined,
        invoice_number: item.invoiceNumber.trim(),
        invoice_date: item.invoiceDate,
        image_url: item.imageUrl || undefined,
        notes: item.notes?.trim() || undefined,
        items: item.items.map(i => {
          const calc = getItemCalc(i);
          return {
            product_id: i.product_id,
            sold_quantity: i.sold_quantity,
            custom_product_name: i.custom_name?.trim() || undefined,
            dosage_form: i.dosage_form || autoDetectDosageForm(i.custom_name || ''),
            custom_unit_price: i.custom_price !== undefined ? i.custom_price : undefined,
            custom_bonus: i.manual_bonus !== undefined ? i.manual_bonus : i.ocr_bonus !== undefined ? i.ocr_bonus : calc.bonus,
            bonus_quantity: calc.bonus,
            ocr_confidence: i.ocr_confidence
          };
        })
      }));

      const res = await api.createInvoicesBatch(payloads);
      if (res.invoices && res.invoices.length > 0) {
        onInvoiceCreated(res.invoices[0]);
      }
    } catch (e: any) {
      setError(e.message || 'فشل حفظ دفعة الفواتير ومزامنتها');
    } finally {
      setBatchSubmitting(false);
    }
  };

  // ── Form Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pharmacyId && !pharmacyName.trim()) { setError('يرجى اختيار أو كتابة اسم الصيدلية أولاً'); return; }
    const distinctPhName = pharmacyName.replace(/^(صيدلية|صيدليه|مذخر|ص)\b/gi, '').trim();
    if (!pharmacyId && distinctPhName.length < 2) {
      setError('يرجى كتابة الاسم الكامل والمميز للصيدلية (مثلاً: صيدلية النور النموذجية أو صيدلية السلام / المنصور)');
      return;
    }
    if (!invoiceNumber.trim()) { setError('يرجى إدخال رقم الفاتورة'); return; }
    if (items.some(i => !i.product_id || i.sold_quantity < 1)) {
      setError('يرجى التحقق من بنود الفاتورة — كل صنف يحتاج منتجاً وكمية صحيحة');
      return;
    }

    if (duplicateInvoice) {
      const proceed = window.confirm(
        `⚠️ تنبيه: فاتورة مكررة!\n\nيوجد فاتورة مسجلة مسبقاً لنفس الصيدلية (${duplicateInvoice.pharmacy_name || 'الصيدلية'}) بتاريخ (${(duplicateInvoice.invoice_date || '').split('T')[0]}) وبنفس كامل الأصناف والكميات.\n\nهل تريد الحفظ رغم ذلك؟`
      );
      if (!proceed) return;
    }

    setSubmitting(true);
    try {
      const payload = {
        pharmacy_id: pharmacyId || undefined,
        pharmacy_name: pharmacyName.trim() || undefined,
        pharmacy_area: pharmacyArea.trim() || undefined,
        invoice_number: invoiceNumber.trim(),
        invoice_date: invoiceDate,
        image_url: imageUrl || undefined,
        notes: notes.trim() || undefined,
        force_save: Boolean(duplicateInvoice),
        items: items.map(i => {
          const calc = getItemCalc(i);
          return {
            product_id: i.product_id,
            sold_quantity: i.sold_quantity,
            custom_product_name: i.custom_name?.trim() || undefined,
            dosage_form: i.dosage_form || autoDetectDosageForm(i.custom_name || ''),
            custom_unit_price: i.custom_price !== undefined ? i.custom_price : undefined,
            custom_bonus: i.manual_bonus !== undefined ? i.manual_bonus : i.ocr_bonus !== undefined ? i.ocr_bonus : calc.bonus,
            bonus_quantity: calc.bonus,
            ocr_confidence: i.ocr_confidence
          };
        })
      };
      const created = await api.createInvoice(payload);
      onInvoiceCreated(created);
    } catch (e: any) {
      setError(e.message || 'فشل في حفظ الفاتورة في قاعدة بيانات سوبا بيس.');
    } finally {
      setSubmitting(false);
    }
  };

  if (showBatchReview && reviewCards.length > 0) {
    return (
      <BatchReviewTable
        invoices={reviewCards}
        products={products}
        pharmacies={availablePharmacies}
        fixedBonusEnabled={fixedBonusEnabled}
        existingInvoices={invoices}
        onCancel={() => setShowBatchReview(false)}
        onSaveAll={async (updatedCards) => {
          const payloads = updatedCards.map(c => ({
            pharmacy_id: c.pharmacy_id || undefined,
            pharmacy_name: c.pharmacy_name?.trim() || undefined,
            pharmacy_area: c.pharmacy_area?.trim() || undefined,
            invoice_number: c.invoice_number?.trim(),
            invoice_date: c.invoice_date,
            image_url: c.image_url || undefined,
            items: c.items.map(it => ({
              product_id: it.product_id || products[0]?.id || '',
              sold_quantity: it.quantity,
              custom_product_name: it.product_name,
              dosage_form: it.dosage_form || autoDetectDosageForm(it.product_name || ''),
              custom_unit_price: it.unit_price,
              bonus_quantity: it.bonus_quantity,
              custom_bonus: it.bonus_quantity,
              ocr_confidence: it.ocr_confidence
            }))
          }));
          const res = await api.createInvoicesBatch(payloads);
          if (res.invoices && res.invoices.length > 0) {
            onInvoiceCreated(res.invoices[0]);
          }
        }}
      />
    );
  }

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

      {/* ── Multi-Invoice Batch Queue Strip (خاصية رفع عدة صور فواتير دفعة واحدة) ── */}
      {batchInvoices.length > 0 && (
        <div className="card mb-4" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} style={{ color: 'var(--primary)' }} />
              <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--gray-900)' }}>
                دفعة الفواتير المرفوعة ({batchInvoices.length} صور فواتير)
              </h5>
              <span className="badge badge-primary">
                الفاتورة المعروضة: #{activeBatchIndex + 1}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={openBatchReviewTable}
                className="btn-clay btn-primary btn-sm"
                style={{ background: '#059669', borderColor: '#047857', color: 'white', fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
                title="عرض جميع الفواتير في جدول موحد وتعديل أي خلية مباشرة"
              >
                <Eye size={14} /> جدول تدقيق وتعديل جميع الفواتير ({batchInvoices.length}) 🔍
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-clay btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={14} /> إضافة صور فواتير أخرى
              </button>
              {batchInvoices.length > 1 && (
                <button
                  type="button"
                  onClick={handleSaveAllBatch}
                  disabled={batchSubmitting || ocrLoading}
                  className="btn-clay btn-primary btn-sm"
                  style={{ fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Sparkles size={14} />
                  {batchSubmitting ? 'جارِ حفظ الدفعة...' : `حفظ ومزامنة كل الفواتير (${batchInvoices.length}) 🚀`}
                </button>
              )}
            </div>
          </div>

          {/* Carousel / Tabs for each invoice in the batch */}
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {batchInvoices.map((bItem, idx) => {
              const isActive = idx === activeBatchIndex;
              return (
                <div
                  key={bItem.id}
                  onClick={() => switchToBatchItem(idx)}
                  style={{
                    minWidth: 175,
                    maxWidth: 210,
                    padding: '0.65rem 0.85rem',
                    borderRadius: 12,
                    cursor: 'pointer',
                    background: isActive ? '#eff6ff' : '#ffffff',
                    border: isActive ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                    boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isActive ? 'var(--primary)' : 'var(--gray-600)' }}>
                      فاتورة #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeBatchItem(idx); }}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}
                      title="حذف هذه الفاتورة من الدفعة"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bItem.pharmacyName || 'صيدلية قيد القراءة...'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: 'var(--gray-500)' }}>
                    <span>{bItem.invoiceNumber || '—'}</span>
                    <span>
                      {bItem.status === 'scanning' ? (
                        <Loader size={12} className="animate-spin" style={{ color: 'var(--primary)' }} />
                      ) : bItem.status === 'done' ? (
                        <Check size={13} style={{ color: '#059669', fontWeight: 900 }} />
                      ) : (
                        <AlertCircle size={12} style={{ color: 'var(--danger)' }} />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={`add-invoice-grid ${mode === 'ocr' ? 'two-col' : 'single-col'}`}>

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

              {/* Presets for instant OCR testing */}
              <div style={{ background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.45rem' }}>
                  ⚡ نماذج فواتير جاهزة للاختبار الفوري للمسح (OCR):
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {samplePresets.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLoadSample(s)}
                      disabled={ocrLoading}
                      className="btn-clay btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Sparkles size={12} style={{ color: 'var(--primary)' }} />
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>
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
                  multiple accept="image/*,application/pdf"
                  onChange={e => { handleFileDrop(e.target.files); e.target.value = ''; }}
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
                      alt="معاينة الفاتورة - انقر لاستبدال"
                      title="انقر لاستبدال بفاتورة أخرى"
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      style={{
                        maxHeight: 260,
                        maxWidth: '100%',
                        borderRadius: 12,
                        objectFit: 'contain',
                        opacity: ocrLoading ? 0.6 : 1,
                        cursor: 'pointer',
                        border: '2px dashed var(--primary)'
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
                      اسحب صورة أو عدة صور فواتير دفعة واحدة (يدعم حتى 20 صورة)
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
                      onClick={() => { setUploadedFile(null); setPreviewUrl(null); setOcrDone(false); setOcrSummary(null); setPharmacyName(''); setPharmacyId(''); setInvoiceNumber(generateInvoiceNumber()); setItems([{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10 }]); }}
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
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    list="pharmacies-datalist"
                    className="clay-input"
                    placeholder="اسم الصيدلية (يتم التعرف عليه آلياً أو اكتبه هنا)..."
                    value={pharmacyName}
                    onChange={e => {
                      const val = e.target.value;
                      setPharmacyName(val);
                      const matched = availablePharmacies.find(p => p.name.trim() === val.trim());
                      if (matched) {
                        setPharmacyId(matched.id);
                        if ((matched as any).area && !pharmacyArea) setPharmacyArea((matched as any).area);
                      }
                    }}
                    required
                    style={{ width: '100%', fontWeight: 700 }}
                  />
                  <datalist id="pharmacies-datalist">
                    {availablePharmacies.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.city ? `(${p.city})` : ''}
                      </option>
                    ))}
                  </datalist>
                </div>
                {pharmacyName && (
                  <div style={{ fontSize: '0.73rem', color: '#059669', marginTop: '0.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={12} /> الصيدلية المحددة: {pharmacyName}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>
                  المنطقة / المكان
                </label>
                <input
                  type="text"
                  list="baghdad-areas-datalist"
                  className="clay-input"
                  placeholder="مثال: الزعفرانية، مدينة الصدر، الكرادة..."
                  value={pharmacyArea}
                  onChange={e => setPharmacyArea(e.target.value)}
                  style={{ width: '100%' }}
                />
                <datalist id="baghdad-areas-datalist">
                  {BAGHDAD_AREAS.map(a => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
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
                {duplicateInvoice && (
                  <div style={{
                    marginTop: '0.45rem',
                    background: '#fef2f2',
                    border: '1.5px solid #f87171',
                    borderRadius: 10,
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.78rem', color: '#991b1b', lineHeight: 1.35 }}>
                      <strong>⚠️ فاتورة مكررة:</strong> يوجد فاتورة لنفس الصيدلية <strong>{duplicateInvoice.pharmacy_name || 'الصيدلية'}</strong> بتاريخ {(duplicateInvoice.invoice_date || '').split('T')[0]} بنفس الأصناف والكميات!
                    </div>
                  </div>
                )}
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
              {/* شريط التحكم في قاعدة البونص الثابت (10+1) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                background: fixedBonusEnabled ? '#ecfdf5' : '#f8fafc',
                border: fixedBonusEnabled ? '1.5px solid #6ee7b7' : '1px solid var(--gray-200)',
                borderRadius: 12,
                padding: '0.6rem 0.85rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', margin: 0, fontWeight: 800, fontSize: '0.84rem', color: fixedBonusEnabled ? '#047857' : 'var(--gray-700)' }}>
                    <input
                      type="checkbox"
                      checked={fixedBonusEnabled}
                      onChange={e => {
                        const enabled = e.target.checked;
                        setFixedBonusEnabled(enabled);
                        if (enabled) {
                          setItems(prev => prev.map(it => ({
                            ...it,
                            manual_bonus: undefined,
                            ocr_bonus: Math.floor((Number(it.sold_quantity) || 0) / 10)
                          })));
                        }
                      }}
                      style={{ width: 17, height: 17, accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    <span>🎁 البونص الثابت (كل 10 قطع = قطعة واحدة مجانية 10+1)</span>
                  </label>
                  <span className={`badge ${fixedBonusEnabled ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                    {fixedBonusEnabled ? '✓ مطبّق تلقائياً (10 + 1)' : 'معطل (حسب قراءة الفاتورة)'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setFixedBonusEnabled(true);
                      setItems(prev => prev.map(it => ({
                        ...it,
                        manual_bonus: undefined,
                        ocr_bonus: Math.floor((Number(it.sold_quantity) || 0) / 10)
                      })));
                    }}
                    className="btn-clay btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem', color: '#047857', fontWeight: 800 }}
                    title="إعادة احتساب وتطبيق قاعدة 10+1 على كافة البنود"
                  >
                    ⚡ تطبيق 10+1 على جميع البنود
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--gray-800)' }}>
                  الأصناف والكميات المحسوبة:
                </span>
                <button type="button" onClick={addItem} className="btn-clay btn-secondary btn-sm">
                  <Plus size={14} /> إضافة صنف آخر
                </button>
              </div>

              <div className="invoice-items-scroll">
                <div className="invoice-items-container">
                  {items.map((item, idx) => {
                    const { prod, unitPrice, bonus, lineTotal, displayName } = getItemCalc(item);
                    return (
                      <div
                        key={item.id}
                        className="invoice-item-row"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 110px 85px 90px 90px 95px 36px',
                          gap: '0.5rem',
                          alignItems: 'center',
                          background: 'var(--gray-50)',
                          borderRadius: 12,
                          padding: '0.65rem 0.85rem',
                          border: '1px solid var(--gray-200)'
                        }}
                      >
                      {/* Product: editable name if from OCR, dropdown if manual */}
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>المنتج</span>
                        {item.custom_name ? (
                          // OCR-detected: show editable text input with real name
                          <input
                            type="text"
                            className="clay-input"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', fontWeight: 700 }}
                            value={item.custom_name}
                            onChange={e => updateItem(item.id, 'custom_name', e.target.value)}
                            title="اسم المنتج المقروء من الفاتورة — يمكن تعديله"
                          />
                        ) : (
                          // Manual: show dropdown
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
                        )}
                      </div>

                      {/* Dosage Form / نوع المادة */}
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>نوع المادة</span>
                        <select
                          className="clay-input"
                          style={{ padding: '0.35rem 0.4rem', fontSize: '0.78rem', fontWeight: 700 }}
                          value={item.dosage_form || autoDetectDosageForm(item.custom_name || '')}
                          onChange={e => updateItem(item.id, 'dosage_form', e.target.value)}
                        >
                          <option value="قطرة">قطرة</option>
                          <option value="كريم">كريم</option>
                          <option value="مرهم">مرهم</option>
                          <option value="حبوب">حبوب</option>
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
                        {item.custom_price !== undefined ? (
                          <input
                            type="number"
                            min={0}
                            className="clay-input"
                            style={{ padding: '0.4rem', textAlign: 'center', fontSize: '0.82rem', width: '100%' }}
                            value={item.custom_price}
                            onChange={e => updateItem(item.id, 'custom_price', parseFloat(e.target.value) || 0)}
                            title="السعر المقروء من الفاتورة"
                          />
                        ) : (
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                            {unitPrice.toLocaleString()} د.ع
                          </span>
                        )}
                      </div>

                      {/* Bonus - editable number input */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', display: 'block' }}>
                          البونص
                          {item.manual_bonus === undefined && (
                            <span style={{ fontSize: '0.6rem', color: fixedBonusEnabled ? '#15803d' : 'var(--primary)', display: 'block', fontWeight: 700 }}>
                              {fixedBonusEnabled ? '(10+1 ثابت)' : 'تلقائي'}
                            </span>
                          )}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span style={{ color: bonus > 0 ? 'var(--warning)' : 'var(--gray-400)', fontWeight: 800, fontSize: '0.85rem' }}>+</span>
                          <input
                            type="number"
                            min={0}
                            className="clay-input"
                            style={{
                              padding: '0.3rem 0.4rem',
                              textAlign: 'center',
                              fontSize: '0.85rem',
                              width: 52,
                              fontWeight: 800,
                              color: bonus > 0 ? 'var(--warning)' : 'var(--gray-600)',
                              border: item.manual_bonus !== undefined ? '2px solid var(--warning)' : undefined
                            }}
                            value={bonus}
                            title={item.manual_bonus !== undefined ? 'بونص مُعدّل يدوياً' : fixedBonusEnabled ? 'بونص ثابت: كل 10 قطع = 1 مجاناً' : 'بونص مستخرج من الفاتورة'}
                            onChange={e => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              updateItem(item.id, 'manual_bonus', val);
                            }}
                          />
                        </div>
                        {item.manual_bonus !== undefined && (
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', color: '#15803d', padding: 0, marginTop: 2, fontWeight: 700 }}
                            title="إعادة لقاعدة البونص الثابت (10+1)"
                            onClick={() => updateItem(item.id, 'manual_bonus', undefined)}
                          >
                            ↺ 10+1 ثابت
                          </button>
                        )}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {batchInvoices.length > 1 && (
                <button
                  type="button"
                  onClick={handleSaveAllBatch}
                  disabled={batchSubmitting || ocrLoading}
                  className="btn-clay btn-primary"
                  style={{
                    padding: '0.95rem 1.5rem',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {batchSubmitting ? (
                    <><Loader size={20} className="animate-spin" /> جارِ حفظ ومزامنة جميع الفواتير في كوكل شيت...</>
                  ) : (
                    <><Sparkles size={20} /> حفظ ومزامنة جميع الفواتير دفعة واحدة ({batchInvoices.length} فواتير) في كوكل شيت 🚀</>
                  )}
                </button>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={submitting || ocrLoading || batchSubmitting}
                  className="btn-clay btn-primary flex-1"
                  style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', fontWeight: 800 }}
                >
                  {submitting ? (
                    <><Loader size={18} className="animate-spin" /> جاري حفظ الفاتورة في سوبا بيس وكوكل شيت...</>
                  ) : (
                    <><CheckCircle2 size={20} /> {batchInvoices.length > 1 ? 'حفظ هذه الفاتورة الحالية فقط ومزامنتها' : 'حفظ الفاتورة ومزامنتها مع كوكل شيت'}</>
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

        </div>
      </form>

    </div>
  );
};
