/**
 * Local Browser Tesseract.js OCR Fallback
 *
 * يُستخدم تلقائياً في الموبايل/المتصفح عندما لا يتوفر Backend ولا مفتاح Gemini AI،
 * أو عند فشل Gemini بسبب الحصة/الشبكة. يحمّل Tesseract ديناميكياً عند الحاجة فقط.
 */
import { parseInvoiceOcrText, GenericInvoiceParseResult } from './invoiceTableParser';

export async function runLocalBrowserTesseractOcr(
  file: File,
  catalogProducts: any[] = [],
  pharmacies: any[] = [],
  onProgress?: (percent: number, statusText: string) => void
): Promise<GenericInvoiceParseResult> {
  onProgress?.(10, 'تحميل محرك القراءة المحلي (OCR)...');

  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('ara+eng', undefined, {
    logger: (m: any) => {
      if (m?.status === 'recognizing text' && typeof m.progress === 'number') {
        const pct = Math.min(92, 30 + Math.round(m.progress * 60));
        onProgress?.(pct, `جاري استخراج النصوص والأرقام محلياً (${Math.round(m.progress * 100)}%)...`);
      } else if (m?.status?.includes('loading')) {
        onProgress?.(22, 'جاري تهيئة حزمة اللغة العربية والإنجليزية...');
      }
    }
  });

  try {
    onProgress?.(30, 'بدء قراءة الفاتورة...');
    const ret = await worker.recognize(file);
    const recognizedText = String(ret?.data?.text || '').trim();
    onProgress?.(94, 'تحليل جدول الأدوية والكميات والأسعار...');
    return parseInvoiceOcrText(recognizedText, catalogProducts, pharmacies);
  } finally {
    await worker.terminate().catch(() => {});
  }
}
