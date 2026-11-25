import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Pharmacy, Product, Invoice } from '../types';
import {
  api,
  getSavedGeminiKey,
  setSavedGeminiKey,
  getApiBase,
  setApiBase,
  OcrProgressUpdate,
  isLocalhostFromRemoteHttps,
  getPendingOcrQueue,
  removePendingOcrQueueItem,
  PendingOcrQueueItem,
  getClientOcrCircuitBreakerStatus
} from '../services/api';
import { BatchReviewTable, BatchInvoiceCard, BAGHDAD_AREAS, autoDetectDosageForm } from './BatchReviewTable';
import {
  FilePlus, Upload, Edit3, FileText as FilePdfIcon,
  Plus, Trash2, Calculator, CheckCircle2, AlertCircle, Sparkles,
  RefreshCw, X, ArrowRight, Camera, Loader, Database, Eye, Check,
  Layers, Images, Settings, Key, ExternalLink, AlertTriangle,
  WifiOff, Terminal, ShieldCheck
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
  ocrEngine?: string;
  needsReview?: boolean;
  needsReviewReason?: string;
  cached?: boolean;
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
  const [ocrProgress, setOcrProgress]     = useState<OcrProgressUpdate | null>(null);
  const [ocrDone, setOcrDone]             = useState(false);
  const [ocrEngineUsed, setOcrEngineUsed] = useState<string | null>(null);
  const [ocrNeedsReview, setOcrNeedsReview] = useState(false);
  const [ocrNeedsReviewReason, setOcrNeedsReviewReason] = useState<string | null>(null);
  const [ocrCached, setOcrCached]         = useState(false);
  const [ocrWarning, setOcrWarning]       = useState<string | null>(null);
  const [ocrRawText, setOcrRawText]       = useState<string | null>(null);
  const [showRawText, setShowRawText]     = useState(false);
  const [offlineAttached, setOfflineAttached] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [ocrSummary, setOcrSummary]       = useState<string | null>(null);
  const [showOcrSettings, setShowOcrSettings] = useState(false);
  const [showAdvancedServer, setShowAdvancedServer] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => getSavedGeminiKey());
  const [showGeminiKeyText, setShowGeminiKeyText] = useState(false);
  const [keyTestLoading, setKeyTestLoading] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [apiBaseInput, setApiBaseInput]   = useState(() => getApiBase());
  const [erudaActive, setErudaActive]     = useState(false);
  const [pendingQueue, setPendingQueue]   = useState<PendingOcrQueueItem[]>(() => getPendingOcrQueue());
  const [isOnline, setIsOnline]           = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const enableErudaDebugger = async () => {
    try {
      const mod = await import('eruda');
      const eruda = (mod as any).default || mod;
      eruda.init();
      setErudaActive(true);
    } catch (e: any) {
      setError('تعذر تشغيل أداة التشخيص: ' + (e?.message || ''));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('debug=1') && !erudaActive) {
      enableErudaDebugger();
    }
    const handleOnline = () => {
      setIsOnline(true);
      setPendingQueue(getPendingOcrQueue());
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    setOcrEngineUsed(target.ocrEngine || null);
    setOcrNeedsReview(Boolean(target.needsReview));
    setOcrNeedsReviewReason(target.needsReviewReason || null);
    setOcrCached(Boolean(target.cached));
  };

  const removeBatchItem = (index: number) => {
    const updated = batchInvoices.filter((_, i) => i !== index);
    setBatchInvoices(updated);
    if (updated.length === 0) {
      setUploadedFile(null);
      setPreviewUrl(null);
      setOcrDone(false);
      setOcrNeedsReview(false);
      setOcrNeedsReviewReason(null);
      setOcrCached(false);
      setOcrEngineUsed(null);
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
      setOcrConfidence(target.confidence);
      setOcrEngineUsed(target.ocrEngine || null);
      setOcrNeedsReview(Boolean(target.needsReview));
      setOcrNeedsReviewReason(target.needsReviewReason || null);
      setOcrCached(Boolean(target.cached));
    }
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

  // ── Shared Helper: Map Gemini extracted items into Form LineItems ────────
  const mapExtractedItems = useCallback((
    extractedItems: Array<{ product_id?: string; product_name: string; dosage_form?: string; quantity: number; unit_price?: number; bonus_quantity?: number }> | undefined,
    confidence: number
  ): LineItem[] => {
    if (!extractedItems || extractedItems.length === 0) return [];
    return extractedItems.map((ei, idx) => {
      let matched = products.find(p => p.id === ei.product_id);
      if (!matched && ei.product_name) {
        matched = products.find(p =>
          p.name.toLowerCase().includes(ei.product_name.toLowerCase().slice(0, 6)) ||
          ei.product_name.toLowerCase().includes(p.name.toLowerCase().slice(0, 6))
        );
      }
      const qty = ei.quantity || 10;
      return {
        id: 'ocr-' + idx + '-' + Date.now().toString().slice(-4),
        product_id: matched?.id || products[0]?.id || '',
        sold_quantity: qty,
        custom_name: ei.product_name || matched?.name || '',
        dosage_form: ei.dosage_form || autoDetectDosageForm(ei.product_name || matched?.name || ''),
        custom_price: ei.unit_price ?? (matched ? Number(matched.base_price) : undefined),
        ocr_bonus: fixedBonusEnabled
          ? Math.floor(qty / 10)
          : (ei.bonus_quantity !== undefined ? ei.bonus_quantity : Math.floor(qty / 10)),
        ocr_confidence: confidence
      };
    });
  }, [products, fixedBonusEnabled]);

  const computeNeedsReview = (res: { needs_review?: boolean; offline_mode?: boolean; confidence?: number }) =>
    Boolean(res.needs_review ?? (res.offline_mode || Number(res.confidence || 0) < 0.75));

  // ── Smart Gemini Vision execution (Inspect → Prep → Cache/Retry/Breaker → Gemini Vision) ────────
  const processOcr = async (file: File) => {
    setOcrLoading(true);
    setOcrDone(false);
    setOfflineAttached(false);
    setOcrNeedsReview(false);
    setOcrNeedsReviewReason(null);
    setOcrCached(false);
    setOcrWarning(null);
    setOcrRawText(null);
    setOcrEngineUsed(null);
    setError(null);
    setOcrProgress({ stage: 'inspect', percent: 8, message: 'فحص سلامة الملف وصيغته الحقيقية...' });

    try {
      const result = await api.uploadInvoiceFile(file, pharmacyId, {
        onProgress: (u) => setOcrProgress(u),
        onPreparedPreview: (url) => setPreviewUrl(url)
      });

      const needsRev = computeNeedsReview(result);
      setOcrNeedsReview(needsRev);
      setOcrNeedsReviewReason(result.needs_review_reason || null);
      setOcrCached(Boolean(result.cached));

      if (result.image_url) setImageUrl(result.image_url);
      if (result.ocr_engine) setOcrEngineUsed(result.ocr_engine);
      if (result.raw_text) setOcrRawText(result.raw_text);
      if (result.ocr_warning) setOcrWarning(result.ocr_warning);
      if (result.queued_offline) setPendingQueue(getPendingOcrQueue());

      // الوضع اليدوي (عدم توفر خادم أو مفتاح Gemini)
      if (result.offline_mode) {
        setOfflineAttached(true);
        setOcrConfidence(0);
        if (result.ocr_error && !result.ocr_warning) {
          setOcrWarning(result.ocr_error);
        }
        setOcrSummary('تم إرفاق صورة الفاتورة بنجاح — أكمل البيانات يدوياً أو أضف مفتاح Google Gemini لقراءتها آلياً.');
        return;
      }

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

      if (result.invoice_number) setInvoiceNumber(result.invoice_number);
      if (result.invoice_date) setInvoiceDate(result.invoice_date);

      const mappedItems = mapExtractedItems(result.extracted_items, result.confidence);
      if (mappedItems.length > 0) {
        setItems(mappedItems);
      }

      setOcrConfidence(Math.round((result.confidence || 0.7) * 100));
      setOcrDone(true);
      const engineLabel = result.ocr_engine === 'gemini-browser'
        ? 'Google Gemini AI'
        : 'خادم Gemini AI';
      setOcrSummary(
        mappedItems.length > 0
          ? `تم استخراج ${mappedItems.length} أصناف عبر (${engineLabel})${result.pharmacy_name ? ' — ' + result.pharmacy_name : ''}`
          : `تمت معالجة الصورة عبر (${engineLabel}) — يرجى التحقق من الأصناف وتأكيدها.`
      );
    } catch (e: any) {
      setError('تعذر استخراج بيانات الملف: ' + (e.message || 'خطأ غير متوقع'));
    } finally {
      setOcrLoading(false);
    }
  };

  // ── Handle file selection / drop with Inspect + Prep + Immediate OCR ─────
  const handleFileDrop = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return; // معالجة إلغاء الاختيار بهدوء

    const selectedFiles = Array.from(files);
    setError(null);
    setOcrNeedsReview(false);
    setOcrNeedsReviewReason(null);
    setOcrCached(false);
    setOcrWarning(null);
    setOcrRawText(null);

    // إذا تم اختيار أكثر من ملف أو كانت هناك دفعة مسبقة
    if (selectedFiles.length > 1 || batchInvoices.length > 0) {
      const newItems: BatchInvoice[] = selectedFiles.map((f, i) => ({
        id: `batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        file: f,
        previewUrl: f.type.startsWith('image/') && !/\.hei[cf]$/i.test(f.name) ? URL.createObjectURL(f) : '',
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

      // معالجة كل ملف جديد عبر خط الإنتاج الموحد (Inspect -> Prep -> OCR)
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
          const result = await api.uploadInvoiceFile(curFile, undefined, {
            onProgress: (u) => { if (itemIdx === startIdx) setOcrProgress(u); },
            onPreparedPreview: (url) => {
              setBatchInvoices(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, previewUrl: url } : item));
              if (itemIdx === startIdx) setPreviewUrl(url);
            }
          });

          const needsRev = computeNeedsReview(result);
          const mapped = mapExtractedItems(result.extracted_items, result.confidence);
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
                confidence: Math.round((result.confidence || 0.7) * 100),
                ocrEngine: result.ocr_engine,
                needsReview: needsRev,
                needsReviewReason: result.needs_review_reason,
                cached: Boolean(result.cached)
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
            if (result.ocr_engine) setOcrEngineUsed(result.ocr_engine);
            if (result.ocr_warning) setOcrWarning(result.ocr_warning);
            if (result.raw_text) setOcrRawText(result.raw_text);
            setOcrNeedsReview(needsRev);
            setOcrNeedsReviewReason(result.needs_review_reason || null);
            setOcrCached(Boolean(result.cached));
            setItems(finalItems);
            if (result.offline_mode) {
              setOfflineAttached(true);
              setOcrConfidence(0);
              setOcrSummary('تم إرفاق الصور بنجاح — يمكنك مراجعتها وتعبئة البيانات مباشرة.');
            } else {
              setOcrConfidence(Math.round((result.confidence || 0.7) * 100));
              setOcrDone(true);
              setOcrSummary(`تم استخراج ${result.extracted_items?.length || 0} أصناف — ${result.pharmacy_name || ''}`);
            }
          }
        } catch (err: any) {
          setBatchInvoices(prev => prev.map((item, idx) =>
            idx === itemIdx ? { ...item, status: 'error', errorMsg: err.message } : item
          ));
          if (itemIdx === startIdx) setError(err.message);
        } finally {
          if (itemIdx === startIdx) setOcrLoading(false);
        }
      }

      if (selectedFiles.length > 1) {
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
              ocr_engine: b.ocrEngine,
              needs_review: b.needsReview,
              needs_review_reason: b.needsReviewReason,
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
      const file = selectedFiles[0];
      setUploadedFile(file);
      setInvoiceNumber(generateInvoiceNumber());
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setItems([{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10 }]);
      setOcrDone(false);
      setOcrSummary(null);

      // معاينة أولية سريعة (تُحدّث تلقائياً بعد فحص وتحويل HEIC عبر onPreparedPreview)
      if (file.type.startsWith('image/') && !/\.hei[cf]$/i.test(file.name)) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }

      processOcr(file);
    }
  }, [pharmacies, products, pharmacyId, batchInvoices, mapExtractedItems]);

  const handleRetryQueuedItem = async (qItem: PendingOcrQueueItem) => {
    try {
      const res = await fetch(qItem.dataUrl);
      const blob = await res.blob();
      const restoredFile = new File([blob], qItem.fileName || 'queued_invoice.jpg', {
        type: qItem.mimeType || 'image/jpeg'
      });
      removePendingOcrQueueItem(qItem.id);
      setPendingQueue(getPendingOcrQueue());
      setUploadedFile(restoredFile);
      setPreviewUrl(qItem.dataUrl);
      await processOcr(restoredFile);
    } catch (e: any) {
      setError('تعذر استعادة الفاتورة المؤجلة: ' + (e?.message || ''));
    }
  };

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
          imageUrl,
          needsReview: ocrNeedsReview,
          needsReviewReason: ocrNeedsReviewReason || undefined
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
      ocr_engine: b.ocrEngine,
      needs_review: b.needsReview,
      needs_review_reason: b.needsReviewReason,
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
    if (items.length === 0) {
      setError('لا توجد أصناف في الفاتورة — اضغط "+ إضافة صنف آخر" لإضافة صنف واحد على الأقل.');
      return;
    }
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
    <div className="animate-in add-invoice-mobile-page">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
              <Database size={12} /> سحابي + محلي متصل
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.74rem' }}>
              <Sparkles size={12} /> معالجة الفواتير الذكية
            </span>
          </div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FilePlus size={24} style={{ color: 'var(--primary)' }} />
            إضافة فاتورة جديدة
          </h1>
        </div>
        <button type="button" className="btn-clay btn-secondary btn-sm" onClick={onCancel}>
          <ArrowRight size={15} /> العودة للسجل
        </button>
      </div>

      {/* ── Entry Mode Tabs ────────────────────────────────────────────────── */}
      <div className="card mb-3" style={{ padding: '0.75rem 1rem' }}>
        <div className="tab-pills" style={{ margin: 0 }}>
          <button
            type="button"
            onClick={() => { setMode('ocr'); setError(null); }}
            className={`tab-pill ${mode === 'ocr' ? 'active' : ''}`}
            style={{ fontWeight: 800 }}
          >
            <Camera size={16} style={{ color: mode === 'ocr' ? 'var(--primary)' : 'var(--gray-500)', flexShrink: 0 }} />
            <span>📷 صورة / كاميرا أو PDF</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('manual'); setError(null); }}
            className={`tab-pill ${mode === 'manual' ? 'active' : ''}`}
            style={{ fontWeight: 800 }}
          >
            <Edit3 size={16} style={{ flexShrink: 0 }} />
            <span>✍️ إدخال يدوي مباشر</span>
          </button>
        </div>
      </div>

      {/* ── Network & Offline Queue Banner ───────────────────────────────── */}
      {!isOnline && (
        <div className="alert-danger mb-3" style={{ background: '#fff7ed', borderColor: '#fdba74', color: '#9a3412' }}>
          <WifiOff size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>
            أنت غير متصل بالإنترنت حالياً — يمكنك التقاط الصور وسنحفظها محلياً لإكمال التحليل عند عودة الشبكة.
          </span>
        </div>
      )}

      {pendingQueue.length > 0 && isOnline && (
        <div className="alert-info mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.84rem' }}>
              ⏳ يوجد {pendingQueue.length} فواتير محفوظة من انقطاع الشبكة السابق بانتظار التحليل:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {pendingQueue.map(q => (
              <div key={q.id} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', background: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{q.fileName}</span>
                <button
                  type="button"
                  onClick={() => handleRetryQueuedItem(q)}
                  className="btn-clay btn-primary btn-sm"
                  style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                >
                  تحليل الآن
                </button>
                <button
                  type="button"
                  onClick={() => { removePendingOcrQueueItem(q.id); setPendingQueue(getPendingOcrQueue()); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}
                  title="حذف من الطابور"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="alert-danger mb-4">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
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
                onClick={() => cameraInputRef.current?.click()}
                className="btn-clay btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Camera size={14} /> تصوير فاتورة أخرى
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-clay btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={14} /> إضافة من المعرض
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
                    {bItem.pharmacyName || (bItem.status === 'error' ? 'فشل القراءة' : 'صيدلية قيد القراءة...')}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h5 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={20} style={{ color: 'var(--primary)' }} />
                  صورة الفاتورة أو ملف PDF
                </h5>
                <button
                  type="button"
                  onClick={() => setShowOcrSettings(v => !v)}
                  className="btn-clay btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', padding: '0.32rem 0.7rem' }}
                  title="إعدادات مفتاح Google Gemini للقراءة الآلية"
                >
                  <Settings size={13} /> إعدادات Gemini
                </button>
              </div>

              {/* ── Live OCR Engine Readiness Banner ───────────────────────────── */}
              {(() => {
                const hasBackend = !isLocalhostFromRemoteHttps();
                const hasGemini = Boolean(geminiKeyInput.trim());
                if (hasBackend) {
                  return (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '0.55rem 0.75rem', fontSize: '0.78rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                      <ShieldCheck size={16} style={{ color: '#059669', flexShrink: 0 }} />
                      <span>متصل بالخادم الخلفي لقراءة الفواتير بالذكاء الاصطناعي.</span>
                    </div>
                  );
                }
                if (hasGemini) {
                  const breaker = getClientOcrCircuitBreakerStatus(geminiKeyInput);
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '0.55rem 0.75rem', fontSize: '0.78rem', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', fontWeight: 700 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Sparkles size={15} style={{ color: '#059669', flexShrink: 0 }} />
                          القراءة الذكية عبر Google Gemini Vision AI مفعّلة على هاتفك
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowOcrSettings(v => !v)}
                          style={{ background: 'none', border: 'none', color: '#047857', fontWeight: 800, cursor: 'pointer', fontSize: '0.74rem', textDecoration: 'underline', padding: 0 }}
                        >
                          تعديل المفتاح
                        </button>
                      </div>
                      {breaker.open && (
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 9, padding: '0.45rem 0.75rem', fontSize: '0.74rem', color: '#92400e', fontWeight: 700 }}>
                          ⏸️ قاطع الدائرة مفعّل ({Math.max(1, Math.ceil(breaker.remainingMs / 60000))} دقيقة متبقية بعد خطأ {breaker.statusCode || '403/429'}) — أدخل مفتاح Gemini جديداً أو أكمل البيانات يدوياً.
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: 12, padding: '0.75rem 0.85rem', fontSize: '0.8rem', color: '#92400e', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertTriangle size={16} style={{ color: '#d97706', flexShrink: 0 }} />
                        مفتاح Google Gemini غير مُعد بعد (إدخال يدوي حالياً)
                      </strong>
                      <button
                        type="button"
                        onClick={() => setShowOcrSettings(true)}
                        className="btn-clay btn-primary btn-sm"
                        style={{ background: '#d97706', borderColor: '#b45309', fontSize: '0.74rem', padding: '0.28rem 0.65rem' }}
                      >
                        <Key size={13} /> إضافة مفتاح Gemini
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', lineHeight: 1.45, color: '#78350f' }}>
                      تعمل القراءة الآلية للفواتير عبر Google Gemini Vision فقط — أضف مفتاح Gemini API في الإعدادات.
                    </div>
                  </div>
                );
              })()}

              {showOcrSettings && (
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                      🔑 مفتاح Google Gemini API:
                    </span>
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.55rem', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
                    >
                      🟡 الحصول على مفتاح من Google AI Studio <ExternalLink size={11} />
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <input
                      type={showGeminiKeyText ? 'text' : 'password'}
                      className="clay-input"
                      style={{ flex: '1 1 180px', padding: '0.48rem 0.65rem', fontSize: '0.85rem', direction: 'ltr', textAlign: 'left' }}
                      placeholder="AIzaSy... / AQ..."
                      value={geminiKeyInput}
                      onChange={e => {
                        setGeminiKeyInput(e.target.value);
                        setSavedGeminiKey(e.target.value);
                        setKeyTestResult(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKeyText(v => !v)}
                      className="btn-clay btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {showGeminiKeyText ? 'إخفاء' : 'إظهار'}
                    </button>
                    <button
                      type="button"
                      disabled={keyTestLoading || !geminiKeyInput.trim()}
                      onClick={async () => {
                        setKeyTestLoading(true);
                        const res = await api.testGeminiKey(geminiKeyInput);
                        setKeyTestResult(res);
                        setKeyTestLoading(false);
                      }}
                      className="btn-clay btn-primary btn-sm"
                      style={{ fontSize: '0.76rem', fontWeight: 800 }}
                    >
                      {keyTestLoading ? 'جاري الاختبار...' : 'اختبار وحفظ 🔍'}
                    </button>
                    {geminiKeyInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setGeminiKeyInput('');
                          setSavedGeminiKey('');
                          setKeyTestResult(null);
                        }}
                        className="btn-clay btn-secondary btn-sm"
                        style={{ fontSize: '0.74rem', color: '#dc2626' }}
                      >
                        مسح
                      </button>
                    )}
                  </div>

                  {keyTestResult && (
                    <div className={keyTestResult.valid ? 'alert-success' : 'alert-danger'} style={{ margin: 0, padding: '0.55rem 0.75rem', fontSize: '0.78rem' }}>
                      {keyTestResult.message}
                    </div>
                  )}

                  {/* Advanced server & debug options */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowAdvancedServer(v => !v)}
                      style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      {showAdvancedServer ? '▼ إخفاء خيارات الخادم المتقدمة' : '◀ خيارات الخادم الخلفي المتقدمة (اختياري)'}
                    </button>

                    <button
                      type="button"
                      onClick={enableErudaDebugger}
                      className="btn-clay btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                      title="عرض وحدة فحص الأخطاء والشبكة على شاشة الموبايل"
                    >
                      <Terminal size={12} /> {erudaActive ? 'Console مفعّل ✓' : 'تشغيل فاحص الموبايل (Console)'}
                    </button>
                  </div>

                  {showAdvancedServer && (
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 3 }}>
                        عنوان الخادم الخلفي (Backend API URL — للخوادم السحابية فقط):
                      </label>
                      <input
                        type="url"
                        className="clay-input"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem', direction: 'ltr', textAlign: 'left' }}
                        placeholder="https://your-server.example.com/api/v1"
                        value={apiBaseInput}
                        onChange={e => {
                          setApiBaseInput(e.target.value);
                          setApiBase(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Synchronous Separate Hidden Inputs (لا يستدعى click بعد أي await؛ بدون امتدادات تربك أندرويد) */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={e => { handleFileDrop(e.target.files); e.target.value = ''; }}
                style={{ display: 'none' }}
              />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={e => { handleFileDrop(e.target.files); e.target.value = ''; }}
                style={{ display: 'none' }}
              />

              {/* Upload Drop Zone / Laser Box */}
              <div
                className={`upload-zone ${isDragging ? 'drag-over' : ''}`}
                style={{
                  position: 'relative',
                  minHeight: 260,
                  cursor: 'default',
                  border: uploadedFile ? '2px solid var(--primary)' : undefined,
                  background: ocrLoading ? '#0f172a' : undefined
                }}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileDrop(e.dataTransfer.files); }}
              >
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
                        maxHeight: 270,
                        maxWidth: '100%',
                        borderRadius: 12,
                        objectFit: 'contain',
                        opacity: ocrLoading ? 0.5 : 1,
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
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderRadius: 12,
                        padding: '1rem'
                      }}>
                        <Loader size={34} className="animate-spin" style={{ marginBottom: 10 }} />
                        <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#ffffff' }}>
                          {ocrProgress?.message || 'جاري قراءة بيانات الفاتورة...'}
                        </div>
                        {ocrProgress && (
                          <div style={{ width: '80%', maxWidth: 260, marginTop: 10 }}>
                            <div className="progress-bar-bg" style={{ background: 'rgba(255,255,255,0.2)', height: 7 }}>
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${ocrProgress.percent}%`, background: 'linear-gradient(90deg, #38bdf8, #10b981)' }}
                              />
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: 4 }}>
                              {ocrProgress.percent}%
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : uploadedFile ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: ocrLoading ? '#ffffff' : 'inherit' }}>
                    <FilePdfIcon size={64} style={{ color: 'var(--danger)', marginBottom: 10 }} />
                    <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{uploadedFile.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 4 }}>
                      ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </p>
                    {ocrLoading && (
                      <div style={{ marginTop: '1rem', color: '#38bdf8' }}>
                        <Loader size={24} className="animate-spin" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }} />
                        <span style={{ fontWeight: 700 }}>{ocrProgress?.message || 'جاري تجهيز وقراءة الملف...'}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem 0.85rem', textAlign: 'center' }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem'
                    }}>
                      <Upload size={26} />
                    </div>
                    <p style={{ fontWeight: 800, color: 'var(--gray-800)', fontSize: '0.96rem', marginBottom: 4 }}>
                      اختر طريقة رفع الفاتورة
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', maxWidth: 340, margin: '0 auto 1rem' }}>
                      يتم ضغط الصور وتصحيح دورانها (EXIF/HEIC) تلقائياً على جهازك قبل القراءة
                    </p>

                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="btn-clay btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 800, padding: '0.65rem 1.05rem', background: '#059669', borderColor: '#047857' }}
                      >
                        <Camera size={17} /> التقاط صورة بالكاميرا
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-clay btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 800, padding: '0.65rem 1.05rem' }}
                      >
                        <Images size={17} style={{ color: 'var(--primary)' }} /> من المعرض أو PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Re-scan bar */}
              {uploadedFile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {ocrDone ? (
                    ocrNeedsReview ? (
                      <div style={{ margin: 0, padding: '0.8rem 1rem', background: '#fffbeb', border: '1.5px solid #f59e0b', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                        <AlertTriangle size={22} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span>
                              ⚠️ تحتاج مراجعة — {ocrEngineUsed === 'gemini-browser'
                                ? `تمت القراءة عبر Gemini (${ocrConfidence}%)`
                                : `نتيجة أولية (${ocrConfidence}%)`}
                            </span>
                            <span className="badge" style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.7rem', padding: '2px 7px' }}>
                              تحتاج مراجعة
                            </span>
                            {ocrCached && (
                              <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.7rem', padding: '2px 7px' }}>
                                ⚡ Cache
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#78350f', marginTop: 3, lineHeight: 1.45 }}>
                            {ocrNeedsReviewReason || ocrSummary || 'الدقة أقل مع الفواتير العربية بالمحرك الاحتياطي — راجع أسماء الأدوية والكميات والأسعار قبل الحفظ.'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="alert-success" style={{ margin: 0, padding: '0.75rem 1rem' }}>
                        <CheckCircle2 size={22} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 800, color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span>تمت قراءة البيانات بنجاح ({ocrConfidence}%)</span>
                            {ocrCached && (
                              <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.7rem', padding: '2px 7px' }}>
                                ⚡ Cache
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: 2 }}>
                            {ocrSummary || 'تم تعبئة بيانات الصيدلية والأصناف تلقائياً في النموذج أدناه.'}
                          </div>
                        </div>
                      </div>
                    )
                  ) : offlineAttached ? (
                    <div className="alert-info" style={{ margin: 0, padding: '0.75rem 1rem' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.82rem', lineHeight: 1.45 }}>
                        <strong style={{ display: 'block' }}>📸 تم إرفاق الفاتورة بنجاح!</strong>
                        {ocrSummary || 'أكمل اسم الصيدلية والأصناف في النموذج أدناه ثم اضغط حفظ.'}
                      </div>
                    </div>
                  ) : null}

                  {ocrWarning && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '0.65rem 0.85rem', fontSize: '0.78rem', color: '#92400e', lineHeight: 1.45, display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                      <AlertTriangle size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                      <div>{ocrWarning}</div>
                    </div>
                  )}

                  {ocrRawText && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowRawText(v => !v)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        {showRawText ? '▼ إخفاء النص الخام المستخرج' : '📄 عرض النص الخام المقروء من الفاتورة'}
                      </button>
                      {showRawText && (
                        <pre
                          dir="auto"
                          style={{
                            marginTop: '0.4rem',
                            background: '#0f172a',
                            color: '#e2e8f0',
                            padding: '0.65rem',
                            borderRadius: 10,
                            fontSize: '0.74rem',
                            maxHeight: 160,
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {ocrRawText}
                        </pre>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => uploadedFile && processOcr(uploadedFile)}
                      disabled={ocrLoading}
                      className="btn-clay btn-secondary flex-1"
                    >
                      <RefreshCw size={15} className={ocrLoading ? 'animate-spin' : ''} />
                      إعادة القراءة
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={ocrLoading}
                      className="btn-clay btn-secondary"
                      title="التقاط صورة أخرى بالكاميرا"
                    >
                      <Camera size={15} /> كاميرا
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={ocrLoading}
                      className="btn-clay btn-secondary"
                      title="اختيار ملف آخر من المعرض"
                    >
                      <Images size={15} /> معرض
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        setPreviewUrl(null);
                        setOcrDone(false);
                        setOfflineAttached(false);
                        setOcrNeedsReview(false);
                        setOcrNeedsReviewReason(null);
                        setOcrCached(false);
                        setOcrSummary(null);
                        setOcrWarning(null);
                        setOcrRawText(null);
                        setOcrEngineUsed(null);
                        setPharmacyName('');
                        setPharmacyId('');
                        setInvoiceNumber(generateInvoiceNumber());
                        setItems([{ id: 'item-1', product_id: products[0]?.id || '', sold_quantity: 10 }]);
                      }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h5 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={20} style={{ color: 'var(--success)' }} />
                تفاصيل الفاتورة والبنود
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {ocrCached && (
                  <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.73rem' }}>
                    ⚡ من الذاكرة المؤقتة
                  </span>
                )}
                {ocrDone && ocrNeedsReview ? (
                  <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b', fontSize: '0.75rem', fontWeight: 800 }}>
                    <AlertTriangle size={13} /> تحتاج مراجعة يدوية
                  </span>
                ) : ocrDone ? (
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    <Check size={13} /> تمت القراءة آلياً
                  </span>
                ) : null}
              </div>
            </div>

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1rem' }}>
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
                              padding: '0.35rem 0.4rem',
                              textAlign: 'center',
                              fontSize: '0.85rem',
                              width: '100%',
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
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          borderRadius: 8,
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                          padding: '0.35rem 0.55rem',
                          fontWeight: 800,
                          touchAction: 'manipulation'
                        }}
                        title="حذف الصنف"
                      >
                        <Trash2 size={16} />
                        <span className="mobile-only-inline" style={{ fontSize: '0.78rem' }}>حذف الصنف</span>
                      </button>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.1rem', background: '#fffbeb', border: '1px dashed #f59e0b', borderRadius: 12, color: '#92400e', fontSize: '0.84rem', fontWeight: 700 }}>
                    لا توجد أصناف حالياً — اضغط زر "+ إضافة صنف آخر" بالأعلى لإضافة صنف.
                  </div>
                )}
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

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={submitting || ocrLoading || batchSubmitting}
                  className="btn-clay btn-primary flex-1"
                  style={{ padding: '0.875rem 1.25rem', fontSize: '0.96rem', fontWeight: 800, minWidth: 'min(100%, 200px)' }}
                >
                  {submitting ? (
                    <><Loader size={18} className="animate-spin" /> جاري حفظ الفاتورة...</>
                  ) : (
                    <><CheckCircle2 size={20} /> {batchInvoices.length > 1 ? 'حفظ هذه الفاتورة الحالية فقط' : 'حفظ الفاتورة ومزامنتها'}</>
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
