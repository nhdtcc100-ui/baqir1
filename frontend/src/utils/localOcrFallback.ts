/**
 * Local Browser Tesseract.js OCR Fallback (Enhanced Contrast & Auto-Rotation)
 *
 * يُستخدم تلقائياً في الموبايل/المتصفح عندما لا يتوفر Backend ولا مفتاح Vision AI،
 * أو عند فشل المفتاح بسبب الحصة/الفوترة. يقوم برفع التباين + التدوير التلقائي 0°/90°/270° عند الحاجة.
 */
import { parseInvoiceOcrText, GenericInvoiceParseResult } from './invoiceTableParser';

/** تهيئة نسخة عالية التباين (Grayscale + Contrast) وتدوير اختياري على Canvas */
async function renderContrastVariant(file: File, angleDeg: 0 | 90 | 270): Promise<File> {
  if (typeof document === 'undefined' || typeof createImageBitmap === 'undefined') {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const swap = angleDeg === 90 || angleDeg === 270;
    const w = swap ? bitmap.height : bitmap.width;
    const h = swap ? bitmap.width : bitmap.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) { bitmap.close(); return file; }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    if (angleDeg === 90) {
      ctx.translate(w, 0);
      ctx.rotate(Math.PI / 2);
    } else if (angleDeg === 270) {
      ctx.translate(0, h);
      ctx.rotate(-Math.PI / 2);
    }
    ctx.filter = 'grayscale(100%) contrast(140%) brightness(106%)';
    ctx.drawImage(bitmap, 0, 0);
    ctx.restore();
    bitmap.close();

    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.9));
    if (!blob) return file;
    return new File([blob], `ocr_rot_${angleDeg}.jpg`, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

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
        const pct = Math.min(92, 35 + Math.round(m.progress * 55));
        onProgress?.(pct, `استخراج النصوص والأرقام محلياً (${Math.round(m.progress * 100)}%)...`);
      } else if (m?.status?.includes('loading')) {
        onProgress?.(22, 'تهيئة حزمة اللغة العربية والإنجليزية...');
      }
    }
  });

  try {
    onProgress?.(30, 'تحسين تباين الصورة وقراءتها...');
    const pass0 = await renderContrastVariant(file, 0);
    const ret0 = await worker.recognize(pass0);
    let bestText = String(ret0?.data?.text || '').trim();
    let bestConf = Number(ret0?.data?.confidence || 0);
    let bestParsed = parseInvoiceOcrText(bestText, catalogProducts, pharmacies);

    // إذا لم يُستخرج أي صنف وكانت الثقة منخفضة، جرب 90° ثم 270° لصورة مائلة بدون EXIF
    if (bestParsed.items.length === 0 && bestConf < 60) {
      for (const angle of [90, 270] as const) {
        onProgress?.(60, `إعادة المحاولة بتدوير تلقائي ${angle}°...`);
        const rotFile = await renderContrastVariant(file, angle);
        const rotRet = await worker.recognize(rotFile);
        const rotText = String(rotRet?.data?.text || '').trim();
        const rotParsed = parseInvoiceOcrText(rotText, catalogProducts, pharmacies);
        const rotConf = Number(rotRet?.data?.confidence || 0);
        if (rotParsed.items.length > bestParsed.items.length || rotConf > bestConf + 10) {
          bestText = rotText;
          bestConf = rotConf;
          bestParsed = rotParsed;
          if (bestParsed.items.length > 0) break;
        }
      }
    }

    onProgress?.(95, 'تحليل جدول الأدوية والكميات والأسعار...');
    return { ...bestParsed, raw_text: bestText };
  } finally {
    await worker.terminate().catch(() => {});
  }
}
