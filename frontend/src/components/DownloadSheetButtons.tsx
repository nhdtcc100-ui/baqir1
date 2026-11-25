import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Share2, RefreshCw } from 'lucide-react';
import {
  downloadUserSheetToDevice,
  canShareFilesOnDevice,
  SheetDownloadFormat
} from '../utils/sheetDownload';
import { getApiBase } from '../services/api';

interface DownloadSheetButtonsProps {
  sheetId?: string;
  sheetUrl?: string;
  accountName?: string;
  compact?: boolean;
  fallbackHeaders?: string[];
  fallbackRows?: any[];
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

export const DownloadSheetButtons: React.FC<DownloadSheetButtonsProps> = ({
  sheetId,
  sheetUrl,
  accountName,
  compact = false,
  fallbackHeaders,
  fallbackRows,
  onSuccess,
  onError
}) => {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const supportsShare = canShareFilesOnDevice();

  if (!sheetId && !sheetUrl) return null;

  const runDownload = async (format: SheetDownloadFormat, share = false) => {
    const key = `${format}-${share ? 'share' : 'dl'}`;
    setBusyKey(key);
    try {
      const res = await downloadUserSheetToDevice({
        sheetId,
        sheetUrl,
        accountName,
        format,
        share,
        apiBase: getApiBase(),
        fallbackHeaders,
        fallbackRows
      });
      if (res.method !== 'cancelled') {
        onSuccess?.(res.message);
      }
    } catch (e: any) {
      onError?.(e?.message || 'تعذر تنزيل الشيت على الجهاز');
    } finally {
      setBusyKey(null);
    }
  };

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runDownload('xlsx', false)}
          disabled={Boolean(busyKey)}
          className="btn-clay btn-secondary btn-sm"
          style={{ padding: '0.26rem 0.55rem', fontSize: '0.73rem', fontWeight: 800, background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}
          title="تنزيل الشيت الكامل بصيغة Excel للهاتف والحاسوب"
        >
          {busyKey === 'xlsx-dl' ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
          <span>Excel</span>
        </button>
        <button
          type="button"
          onClick={() => runDownload('pdf', false)}
          disabled={Boolean(busyKey)}
          className="btn-clay btn-secondary btn-sm"
          style={{ padding: '0.26rem 0.55rem', fontSize: '0.73rem', fontWeight: 700 }}
          title="تنزيل نسخة PDF للطباعة والمشاركة"
        >
          {busyKey === 'pdf-dl' ? <RefreshCw size={12} className="animate-spin" /> : <FileText size={12} />}
          <span>PDF</span>
        </button>
        {supportsShare && (
          <button
            type="button"
            onClick={() => runDownload('xlsx', true)}
            disabled={Boolean(busyKey)}
            className="btn-clay btn-secondary btn-sm"
            style={{ padding: '0.26rem 0.5rem', fontSize: '0.73rem', fontWeight: 700, color: '#1d4ed8', borderColor: '#bfdbfe', background: '#eff6ff' }}
            title="إرسال / حفظ في ملفات الهاتف أو واتساب"
          >
            {busyKey === 'xlsx-share' ? <RefreshCw size={12} className="animate-spin" /> : <Share2 size={12} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => runDownload('xlsx', false)}
        disabled={Boolean(busyKey)}
        className="btn-clay btn-primary btn-sm"
        style={{ background: '#059669', borderColor: '#047857', fontWeight: 800 }}
        title="تنزيل ملف Excel كامل بجميع التبويبات والـ Pivot Tables"
      >
        {busyKey === 'xlsx-dl' ? <RefreshCw size={15} className="animate-spin" /> : <FileSpreadsheet size={15} />}
        <span>{busyKey === 'xlsx-dl' ? 'جارِ التنزيل...' : '📥 تنزيل الشيت للهاتف (Excel)'}</span>
      </button>

      <button
        type="button"
        onClick={() => runDownload('pdf', false)}
        disabled={Boolean(busyKey)}
        className="btn-clay btn-secondary btn-sm"
        style={{ fontWeight: 800 }}
        title="تنزيل نسخة PDF جاهزة للقراءة والطباعة على الهاتف"
      >
        {busyKey === 'pdf-dl' ? <RefreshCw size={15} className="animate-spin" /> : <FileText size={15} />}
        <span>{busyKey === 'pdf-dl' ? 'جارِ التحضير...' : '📄 تنزيل PDF'}</span>
      </button>

      {supportsShare && (
        <button
          type="button"
          onClick={() => runDownload('xlsx', true)}
          disabled={Boolean(busyKey)}
          className="btn-clay btn-secondary btn-sm"
          style={{ fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
          title="إرسال الشيت عبر واتساب أو حفظه في تطبيق الملفات بالهاتف"
        >
          {busyKey === 'xlsx-share' ? <RefreshCw size={15} className="animate-spin" /> : <Share2 size={15} />}
          <span>📲 مشاركة / حفظ بالملفات</span>
        </button>
      )}
    </div>
  );
};
