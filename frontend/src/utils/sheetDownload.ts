import { DEFAULT_INVOICE_SHEET_ID, extractGoogleSheetId } from './adminUsersSheet';

export type SheetDownloadFormat = 'xlsx' | 'pdf' | 'csv';

export interface SheetDownloadOptions {
  sheetId?: string;
  sheetUrl?: string;
  accountName?: string;
  format?: SheetDownloadFormat;
  share?: boolean;
  apiBase?: string;
  fallbackHeaders?: string[];
  fallbackRows?: any[];
}

export interface SheetDownloadResult {
  method: 'google_blob' | 'backend_blob' | 'shared_file' | 'csv_fallback' | 'direct_link' | 'cancelled';
  fileName: string;
  message: string;
}

const MIME_BY_FORMAT: Record<SheetDownloadFormat, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  csv: 'text/csv;charset=utf-8'
};

export function resolveAccountSheetId(user?: { role?: string; sheet_id?: string; sheet_url?: string } | null): string {
  if (!user) return '';
  const own = extractGoogleSheetId(user.sheet_url || user.sheet_id);
  if (own) return own;
  if (user.role === 'admin') return DEFAULT_INVOICE_SHEET_ID;
  return '';
}

export function buildGoogleSheetExportUrl(sheetIdOrUrl?: string, format: SheetDownloadFormat = 'xlsx'): string {
  const id = extractGoogleSheetId(sheetIdOrUrl);
  if (!id) return '';
  if (format === 'pdf') {
    return `https://docs.google.com/spreadsheets/d/${id}/export?format=pdf&portrait=false&size=A4&fitw=true`;
  }
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=${format}`;
}

export function buildSafeExportFileName(accountName?: string, format: SheetDownloadFormat = 'xlsx'): string {
  const cleaned = String(accountName || 'كوكل_شيت')
    .trim()
    .replace(/[^\w\u0621-\u064a-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'كوكل_شيت';
  const dateStr = new Date().toISOString().split('T')[0];
  return `شيت_${cleaned}_${dateStr}.${format}`;
}

export function canShareFilesOnDevice(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    typeof File !== 'undefined'
  );
}

export function triggerBlobDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // مهلة كافية لـ iOS Safari لقراءة الملف قبل تحرير الذاكرة
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

export function buildCsvBlobFromRows(headers: string[], rows: any[]): Blob {
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines: string[] = [];
  if (headers.length > 0) {
    lines.push(headers.map(esc).join(','));
  }
  for (const r of rows) {
    if (Array.isArray(r?.cells) && r.cells.length > 0) {
      lines.push(r.cells.map(esc).join(','));
    } else if (Array.isArray(r)) {
      lines.push(r.map(esc).join(','));
    } else if (r && typeof r === 'object') {
      const vals = [
        r.invoice_number, r.invoice_date, r.warehouse_name, r.pharmacy_name,
        r.area, r.city, r.product_name, r.dosage_form,
        r.quantity, r.unit_price, r.bonus_quantity, r.line_total,
        r.total_invoice, r.rep_name, r.status, r.timestamp
      ];
      lines.push(vals.map(esc).join(','));
    }
  }
  return new Blob(['\uFEFF' + lines.join('\r\n')], { type: MIME_BY_FORMAT.csv });
}

async function fetchValidSheetBlob(url: string, mime: string, headers?: Record<string, string>, timeoutMs = 20000): Promise<Blob | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      method: 'GET',
      headers,
      mode: 'cors',
      cache: 'no-store',
      signal: controller.signal
    }).finally(() => clearTimeout(timer));
    if (!res.ok) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('text/html')) return null;
    const buf = await res.arrayBuffer();
    if (!buf || buf.byteLength < 64) return null;
    return new Blob([buf], { type: mime });
  } catch {
    return null;
  }
}

async function deliverBlobToPhoneOrDesktop(blob: Blob, fileName: string, mime: string, preferShare?: boolean): Promise<SheetDownloadResult> {
  if (preferShare && canShareFilesOnDevice()) {
    try {
      const file = new File([blob], fileName, { type: mime });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName
        });
        return {
          method: 'shared_file',
          fileName,
          message: `تم تجهيز ومشاركة ملف (${fileName}) بنجاح ✅`
        };
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return {
          method: 'cancelled',
          fileName,
          message: 'تم إلغاء المشاركة.'
        };
      }
      // في حال حظر iOS Safari مشاركة async بعد انتظار الشبكة نتابع بالتنزيل المباشر تلقائياً
    }
  }

  triggerBlobDownload(blob, fileName);
  return {
    method: 'google_blob',
    fileName,
    message: `تم تنزيل الشيت (${fileName}) على جهازك بنجاح 📥`
  };
}

export async function downloadUserSheetToDevice(options: SheetDownloadOptions): Promise<SheetDownloadResult> {
  const format: SheetDownloadFormat = options.format || 'xlsx';
  const resolvedId = extractGoogleSheetId(options.sheetUrl || options.sheetId);
  if (!resolvedId) {
    throw new Error('لا تملك أي قاعدة بيانات (صفحة كوكل شيت) مرتبطة بهذا الحساب.');
  }

  const fileName = buildSafeExportFileName(options.accountName, format);
  const mime = MIME_BY_FORMAT[format];
  const googleUrl = buildGoogleSheetExportUrl(resolvedId, format);

  // 1) المحاولة الأساسية: تنزيل ملف Google Sheets الحقيقي (يشمل جميع الأوراق والـ Pivot Tables)
  const googleBlob = await fetchValidSheetBlob(googleUrl, mime);
  if (googleBlob) {
    return deliverBlobToPhoneOrDesktop(googleBlob, fileName, mime, options.share);
  }

  // 2) الخيار الاحتياطي via الخادم: مفيد إذا كان الشيت خاصاً ومشاركاً مع الخادم
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('pharma_token') : null;
  const customBase = typeof localStorage !== 'undefined' ? localStorage.getItem('pharma_api_base') : null;
  const apiBase = (options.apiBase || customBase || '').replace(/\/$/, '');
  if (token && apiBase) {
    const proxyUrl = `${apiBase}/sheets/export?format=${format}&sheetId=${encodeURIComponent(resolvedId)}&name=${encodeURIComponent(options.accountName || 'sheet')}`;
    const proxyBlob = await fetchValidSheetBlob(proxyUrl, mime, { Authorization: `Bearer ${token}` }, 15000);
    if (proxyBlob) {
      const res = await deliverBlobToPhoneOrDesktop(proxyBlob, fileName, mime, options.share);
      return res.method === 'google_blob' ? { ...res, method: 'backend_blob' } : res;
    }
  }

  // 3) تنزيل CSV محلي إن توفر أو فتح رابط Google Export الأصلي مباشرةً بمتصفح الهاتف
  if (format === 'csv' && Array.isArray(options.fallbackRows) && options.fallbackRows.length > 0) {
    const csvBlob = buildCsvBlobFromRows(options.fallbackHeaders || [], options.fallbackRows);
    return deliverBlobToPhoneOrDesktop(csvBlob, fileName, MIME_BY_FORMAT.csv, options.share);
  }

  const link = document.createElement('a');
  link.href = googleUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    method: 'direct_link',
    fileName,
    message: `تم فتح رابط تنزيل الشيت (${fileName}) عبر متصفح الهاتف 📲`
  };
}
