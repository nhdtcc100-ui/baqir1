/**
 * Mobile-Safe File Inspector, HEIC Converter & Image Normalizer
 *
 * المرحلة 2 (الفحص) والمرحلة 3 (التجهيز على الجهاز) لمسار رفع الفواتير:
 * 1. فحص Magic Bytes الفعلية للملف (JPEG / PNG / WEBP / GIF / BMP / HEIC / PDF) بدلاً من الوثوق بالامتداد.
 * 2. اكتشاف الصور السحابية غير المنزّلة من iCloud أو Google Photos (0 bytes أو NotReadableError).
 * 3. تحويل صور آيفون HEIC/HEIF إلى JPEG باستخدام heic2any عند الحاجة.
 * 4. تصحيح الاتجاه (EXIF Orientation) وتصغير الصور الضخمة (5-12MB) لحد أقصى 1600px بجودة 0.82.
 * 5. إزالة جميع بيانات EXIF (بما فيها GPS الموقع الجغرافي) تلقائياً للخصوصية عبر إعادة الرسم على Canvas.
 * 6. Fallback ذكي: إذا فشل الضغط/التحويل لصورة مدعومة، يمرر الملف الأصلي دون تعطيل المستخدم.
 */

export type DetectedFileKind = 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'heic' | 'pdf' | 'unknown';

export interface FileInspectionResult {
  kind: DetectedFileKind;
  mimeType: string;
  isPdf: boolean;
  isImage: boolean;
  sizeBytes: number;
}

export interface PreparedInvoiceFile {
  file: File;
  inspection: FileInspectionResult;
  wasCompressed: boolean;
  wasConvertedFromHeic: boolean;
  originalSizeBytes: number;
  finalSizeBytes: number;
  warning?: string;
}

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB سقف أمان صلب

/**
 * قراءة أول 16 بايت من الملف والتحقق من وجود الملف فعلياً على الجهاز
 */
export async function inspectFileMagicBytes(file: File): Promise<FileInspectionResult> {
  if (!file) {
    throw new Error('لم يتم اختيار أي ملف.');
  }

  if (file.size === 0) {
    throw new Error(
      'حجم الملف صفر (0 بايت). يبدو أن الصورة مخزنة سحابياً في Google Photos أو iCloud ولم تُنزَّل بعد — نزّل الصورة على الجهاز أولاً ثم أعد المحاولة.'
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`حجم الملف (${mb} MB) كبير جداً (الحد الأقصى 25 MB).`);
  }

  let bytes: Uint8Array;
  try {
    const headerSlice = file.slice(0, 16);
    const buffer = await headerSlice.arrayBuffer();
    bytes = new Uint8Array(buffer);
    if (bytes.length < 4) {
      throw new Error('الملف غير مكتمل أو تعذّرت قراءته من الذاكرة.');
    }
  } catch (err: any) {
    throw new Error(
      'تعذّرت قراءة الملف من الهاتف (قد تكون الصورة سحابية في iCloud أو Google Photos ولم يتم تنزيلها محلياً، أو تم إلغاء صلاحية الوصول). نزّل الصورة على جهازك أولاً ثم حاول مجدداً.'
    );
  }

  // %PDF- (25 50 44 46)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { kind: 'pdf', mimeType: 'application/pdf', isPdf: true, isImage: false, sizeBytes: file.size };
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return { kind: 'jpeg', mimeType: 'image/jpeg', isPdf: false, isImage: true, sizeBytes: file.size };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return { kind: 'png', mimeType: 'image/png', isPdf: false, isImage: true, sizeBytes: file.size };
  }

  // GIF: 47 49 46 38
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { kind: 'gif', mimeType: 'image/gif', isPdf: false, isImage: true, sizeBytes: file.size };
  }

  // BMP: 42 4D
  if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
    return { kind: 'bmp', mimeType: 'image/bmp', isPdf: false, isImage: true, sizeBytes: file.size };
  }

  // WEBP: RIFF....WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { kind: 'webp', mimeType: 'image/webp', isPdf: false, isImage: true, sizeBytes: file.size };
  }

  // ISO BMFF / HEIC / HEIF / AVIF: bytes 4..8 == 'ftyp'
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70
  ) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]).toLowerCase();
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heis'].includes(brand)) {
      return { kind: 'heic', mimeType: 'image/heic', isPdf: false, isImage: true, sizeBytes: file.size };
    }
    if (brand === 'avif' || brand === 'avis') {
      return { kind: 'webp', mimeType: 'image/avif', isPdf: false, isImage: true, sizeBytes: file.size };
    }
  }

  // احتياط: إذا أبلغ النظام عن mime image/ أو امتداد معروف لكن البايتات غير قياسية
  if (file.type.startsWith('image/')) {
    return { kind: 'unknown', mimeType: file.type, isPdf: false, isImage: true, sizeBytes: file.size };
  }

  throw new Error(
    `صيغة الملف (${file.name || file.type || 'غير معروف'}) غير صالحة أو تالفة. يرجى اختيار صورة فاتورة (JPG / PNG / HEIC / WEBP) أو ملف PDF حقيقي.`
  );
}

/** استخراج EXIF Orientation من JPEG عند استخدام مسار Fallback */
function getExifOrientation(file: Blob): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buf = e.target?.result as ArrayBuffer;
        if (!buf || buf.byteLength < 4) { resolve(1); return; }
        const view = new DataView(buf);
        if (view.getUint16(0) !== 0xFFD8) { resolve(1); return; }
        let offset = 2;
        while (offset < view.byteLength - 2) {
          const marker = view.getUint16(offset);
          offset += 2;
          if (marker === 0xFFE1) {
            if (offset + 8 >= view.byteLength) { resolve(1); return; }
            if (view.getUint32(offset + 2) !== 0x45786966) { resolve(1); return; }
            const tiffOffset = offset + 2 + 6;
            const littleEndian = view.getUint16(tiffOffset) === 0x4949;
            const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
            const ifdStart = tiffOffset + ifdOffset;
            if (ifdStart + 2 >= view.byteLength) { resolve(1); return; }
            const tagCount = view.getUint16(ifdStart, littleEndian);
            for (let i = 0; i < tagCount; i++) {
              const tagOffset = ifdStart + 2 + i * 12;
              if (tagOffset + 10 >= view.byteLength) break;
              if (view.getUint16(tagOffset, littleEndian) === 0x0112) {
                resolve(view.getUint16(tagOffset + 8, littleEndian));
                return;
              }
            }
            resolve(1); return;
          } else if ((marker & 0xFF00) !== 0xFF00) {
            break;
          } else {
            if (offset + 2 >= view.byteLength) break;
            offset += view.getUint16(offset);
          }
        }
        resolve(1);
      } catch { resolve(1); }
    };
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}

function applyExifRotation(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number
) {
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
    case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
    case 7: ctx.transform(0, -1, -1, 0, height, width); break;
    case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
    default: break;
  }
}

/** حساب الأبعاد النهائية دون أي تكبير للصور الأصغر */
export function computeScaledDimensions(srcW: number, srcH: number, maxDimension = 1600): { width: number; height: number } {
  if (srcW <= 0 || srcH <= 0) return { width: 1, height: 1 };
  const maxSide = Math.max(srcW, srcH);
  if (maxSide <= maxDimension) return { width: srcW, height: srcH };
  const ratio = maxDimension / maxSide;
  return {
    width: Math.max(1, Math.round(srcW * ratio)),
    height: Math.max(1, Math.round(srcH * ratio))
  };
}

/**
 * تحويل صور HEIC/HEIF إلى JPEG محلياً
 */
async function convertHeicToJpegBlob(file: File, quality = 0.86): Promise<Blob> {
  const mod = await import('heic2any');
  const heic2anyFn: any = (mod as any).default || mod;
  const converted = await heic2anyFn({
    blob: file,
    toType: 'image/jpeg',
    quality
  });
  return Array.isArray(converted) ? converted[0] : converted;
}

/**
 * فحص وتجهيز أي صورة أو PDF للفاتورة قبل الإرسال
 */
export async function prepareInvoiceFile(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<PreparedInvoiceFile> {
  const inspection = await inspectFileMagicBytes(file);
  const originalSizeBytes = file.size;

  // PDF — يُمرّر مباشرة بعد فحص التوقيع والحجم
  if (inspection.isPdf) {
    return {
      file,
      inspection,
      wasCompressed: false,
      wasConvertedFromHeic: false,
      originalSizeBytes,
      finalSizeBytes: file.size
    };
  }

  let workingBlob: Blob = file;
  let wasConvertedFromHeic = false;

  // تحويل HEIC من الآيفون إذا كانت المتصفحات لا تدعمه مباشرة
  if (inspection.kind === 'heic') {
    try {
      workingBlob = await convertHeicToJpegBlob(file, 0.86);
      wasConvertedFromHeic = true;
    } catch (heicErr: any) {
      console.warn('heic2any conversion warning (will try native createImageBitmap fallback):', heicErr?.message || heicErr);
    }
  }

  const baseName = file.name.replace(/\.[^/.]+$/, '').trim() || 'invoice_mobile';

  // ── المسار الرئيسي الموصى به لـ iOS/Android: createImageBitmap (بدون canvas عملاق) ──
  if (typeof createImageBitmap !== 'undefined') {
    try {
      const bitmap = await createImageBitmap(workingBlob, {
        imageOrientation: 'from-image'
      } as ImageBitmapOptions);

      const { width: outW, height: outH } = computeScaledDimensions(bitmap.width, bitmap.height, maxDimension);

      // لوحة الرسم لا تتجاوز maxDimension أبداً (آمنة تماماً على ذاكرة iOS Safari)
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        bitmap.close();
        throw new Error('Canvas 2D context unavailable');
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, 0, 0, outW, outH);
      bitmap.close();

      const outBlob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/jpeg', quality)
      );
      if (!outBlob) throw new Error('canvas.toBlob returned null');

      const outFile = new File([outBlob], `${baseName}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      console.log(
        `📸 [MobilePrep] ${(originalSizeBytes / 1024 / 1024).toFixed(2)}MB → ${(outFile.size / 1024).toFixed(0)}KB (${outW}×${outH}) HEIC=${wasConvertedFromHeic}`
      );

      return {
        file: outFile,
        inspection: { ...inspection, mimeType: 'image/jpeg', kind: 'jpeg' },
        wasCompressed: true,
        wasConvertedFromHeic,
        originalSizeBytes,
        finalSizeBytes: outFile.size
      };
    } catch (bitmapErr: any) {
      console.warn('createImageBitmap path fell back:', bitmapErr?.message || bitmapErr);
    }
  }

  // ── Fallback 1: FileReader + Image + EXIF Parser (للمتصفحات الأقدم) ─────────
  try {
    const orientation = inspection.kind === 'jpeg' ? await getExifOrientation(workingBlob) : 1;
    const objectUrl = URL.createObjectURL(workingBlob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Image element decode failed'));
        el.src = objectUrl;
      });

      const needsSwap = orientation >= 5 && orientation <= 8;
      const realW = needsSwap ? img.naturalHeight : img.naturalWidth;
      const realH = needsSwap ? img.naturalWidth : img.naturalHeight;
      const { width: outW, height: outH } = computeScaledDimensions(realW, realH, maxDimension);

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.save();
      applyExifRotation(ctx, orientation, outW, outH);
      const drawW = needsSwap ? outH : outW;
      const drawH = needsSwap ? outW : outH;
      ctx.drawImage(img, 0, 0, drawW, drawH);
      ctx.restore();

      const outBlob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/jpeg', quality)
      );
      if (!outBlob) throw new Error('canvas.toBlob returned null');

      const outFile = new File([outBlob], `${baseName}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      return {
        file: outFile,
        inspection: { ...inspection, mimeType: 'image/jpeg', kind: 'jpeg' },
        wasCompressed: true,
        wasConvertedFromHeic,
        originalSizeBytes,
        finalSizeBytes: outFile.size
      };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch (fallbackErr: any) {
    // Fallback 2: لو تحوّلت HEIC بنجاح ولكن فشل التعديل اللاحق، مرر نسخة HEIC المحولة
    if (wasConvertedFromHeic && workingBlob) {
      const convertedFile = new File([workingBlob], `${baseName}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      return {
        file: convertedFile,
        inspection: { ...inspection, mimeType: 'image/jpeg', kind: 'jpeg' },
        wasCompressed: false,
        wasConvertedFromHeic: true,
        originalSizeBytes,
        finalSizeBytes: convertedFile.size,
        warning: 'تم تحويل الصورة من HEIC لكن تعذّر ضغطها — تم استخدام النسخة المحولة.'
      };
    }

    // Fallback النهائي: إرسال الأصلية بدل التوقف (قاعدة #3 من المخطط)
    const cleanFile = file.type
      ? file
      : new File([file], file.name || `${baseName}.jpg`, { type: inspection.mimeType, lastModified: Date.now() });

    return {
      file: cleanFile,
      inspection,
      wasCompressed: false,
      wasConvertedFromHeic: false,
      originalSizeBytes,
      finalSizeBytes: cleanFile.size,
      warning: inspection.kind === 'heic'
        ? 'لم يتمكن المتصفح من تحويل صورة HEIC محلياً — سيتم محاولة إرسالها مباشرة.'
        : 'تعذّر ضغط الصورة محلياً — سيتم إرسال الملف الأصلي تلقائياً.'
    };
  }
}

/** دالة متوافقة مع الاستدعاء السابق إن وُجدت */
export async function compressAndNormalizeImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<File> {
  const prep = await prepareInvoiceFile(file, maxDimension, quality);
  return prep.file;
}
