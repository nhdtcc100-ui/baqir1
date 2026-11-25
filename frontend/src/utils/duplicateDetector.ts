import { Invoice } from '../types';

export interface DuplicateMatchInfo {
  isDuplicate: boolean;
  isOriginal: boolean;
  duplicateCount: number;
  matchedWithId?: string;
  reason: string;
}

export interface SheetRowLike {
  invoice_number?: string;
  invoice_date?: string;
  pharmacy_name?: string;
  product_name?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
  status?: string;
  timestamp?: string;
  cells?: string[];
}

export interface SheetDuplicateGroup {
  key: string;
  invoice_number: string;
  invoice_date: string;
  pharmacy_name: string;
  timestamp: string;
  rowsCount: number;
  totalAmount: number;
  productsSummary: string;
  rowIndices: number[];
}

export function normalizeArabicText(raw: string): string {
  return String(raw || '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizePharmacyName(raw: string): string {
  return normalizeArabicText(raw)
    .replace(/^(صيدلية|صيدليه|مذخر|ص\.?)\s+/gi, '')
    .trim();
}

export function normalizeProductKey(raw: string): string {
  return normalizeArabicText(raw)
    .replace(/[^a-z0-9\u0621-\u064a]/gi, '');
}

export function normalizeDateYmd(raw: string): string {
  const s = String(raw || '').trim();
  if (!s) return '';

  // ISO yyyy-mm-dd or yyyy-mm-ddT...
  const iso = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
  }

  // Google Sheets Date(yyyy, mZeroBased, d)
  const gvizDate = s.match(/^Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/);
  if (gvizDate) {
    const mm = String(Number(gvizDate[2]) + 1).padStart(2, '0');
    return `${gvizDate[1]}-${mm}-${gvizDate[3].padStart(2, '0')}`;
  }

  // US mm/dd/yyyy or dd/mm/yyyy
  const slash = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slash) {
    const p1 = Number(slash[1]);
    const p2 = Number(slash[2]);
    // Assume mm/dd/yyyy when p2 > 12 or default EN-US format from Sheets
    const month = p1 > 12 ? p2 : p1;
    const day = p1 > 12 ? p1 : p2;
    return `${slash[3]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return s.split('T')[0];
}

export function parseSheetNumber(val: any): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const clean = String(val ?? '')
    .replace(/[٠-٩]/g, d => String(arabic.indexOf(d)))
    .replace(/[۰-۹]/g, d => String(persian.indexOf(d)))
    .replace(/,/g, '')
    .replace(/[^\d.-]/g, '');
  const n = Number(clean);
  return isNaN(n) ? 0 : n;
}

export function buildItemsSignature(items?: Array<{ product_name?: string; product_name_snapshot?: string; custom_product_name?: string; name?: string; quantity?: number; sold_quantity?: number }>): {
  count: number;
  signature: string;
} {
  if (!Array.isArray(items) || items.length === 0) {
    return { count: 0, signature: '' };
  }

  const normalized = items
    .map(it => {
      const name = normalizeProductKey(
        it.product_name_snapshot || it.custom_product_name || it.product_name || it.name || ''
      );
      const qty = Math.round(parseSheetNumber(it.sold_quantity ?? it.quantity ?? 0));
      return { name, qty };
    })
    .filter(x => x.name.length > 0)
    .sort((a, b) => (a.name !== b.name ? a.name.localeCompare(b.name) : a.qty - b.qty));

  if (normalized.length === 0) {
    return { count: 0, signature: '' };
  }

  const signature = `${normalized.length}::${normalized.map(x => `${x.name}:${x.qty}`).join('|')}`;
  return { count: normalized.length, signature };
}

export interface SheetLogicalGroup {
  gKey: string;
  invoice_number: string;
  invoice_date: string;
  pharmacy_name: string;
  timestamp: string;
  status: string;
  compositeKey: string;
  items: Array<{ row: SheetRowLike; rowIndex: number }>;
}

/**
 * تجميع أسطر الشيت إلى نسخ فواتير منطقية مع فصل الكتل المتتابعة إذا تساوى الطابع الزمني
 */
export function groupSheetRowsLogical(rows: SheetRowLike[]): SheetLogicalGroup[] {
  const bucketMap = new Map<string, Array<{ row: SheetRowLike; rowIndex: number }>>();

  rows.forEach((row, rowIndex) => {
    const num = String(row.invoice_number || '').trim();
    const ph = normalizePharmacyName(row.pharmacy_name || '');
    const dt = normalizeDateYmd(row.invoice_date || '');
    const ts = String(row.timestamp || '').trim();
    const gKey = `${num || ph}::${dt}::${ts}`;
    if (!bucketMap.has(gKey)) bucketMap.set(gKey, []);
    bucketMap.get(gKey)!.push({ row, rowIndex });
  });

  const groups: SheetLogicalGroup[] = [];
  for (const [baseKey, entries] of bucketMap.entries()) {
    // في حال رُفعت نسختان متطابقتان في نفس الدقيقة وبنفس الطابع الزمني: نفصلهما عند تكرار نفس (المنتج + الكمية) داخل الكتلة
    const subBlocks: Array<Array<{ row: SheetRowLike; rowIndex: number }>> = [];
    let currentBlock: Array<{ row: SheetRowLike; rowIndex: number }> = [];
    let seenInBlock = new Set<string>();

    for (const entry of entries) {
      const pKey = `${normalizeProductKey(entry.row.product_name || '')}:${Math.round(parseSheetNumber(entry.row.quantity || 0))}`;
      if (pKey && seenInBlock.has(pKey) && currentBlock.length > 0) {
        subBlocks.push(currentBlock);
        currentBlock = [];
        seenInBlock = new Set<string>();
      }
      currentBlock.push(entry);
      if (pKey) seenInBlock.add(pKey);
    }
    if (currentBlock.length > 0) subBlocks.push(currentBlock);

    subBlocks.forEach((blockEntries, bIdx) => {
      const first = blockEntries[0].row;
      const compositeKey = buildFullInvoiceCompositeKey({
        pharmacy_name: first.pharmacy_name,
        invoice_date: first.invoice_date,
        items: blockEntries.map(e => ({
          product_name: e.row.product_name,
          quantity: e.row.quantity
        }))
      });
      groups.push({
        gKey: subBlocks.length > 1 ? `${baseKey}::copy-${bIdx}` : baseKey,
        invoice_number: String(first.invoice_number || '').trim(),
        invoice_date: normalizeDateYmd(first.invoice_date || ''),
        pharmacy_name: String(first.pharmacy_name || '').trim(),
        timestamp: String(first.timestamp || '').trim(),
        status: String(first.status || '').replace(' ✓', '').trim(),
        compositeKey,
        items: blockEntries
      });
    });
  }

  return groups;
}

/**
 * مقارنة فاتورة بالنظام مع أسطر كوكل شيت:
 * تُعتبر مطابقة/مكررة فقط عند تطابق (الصيدلية + التاريخ + عدد الأصناف + كل صنف + كميته).
 * إذا اختلفت الكمية فهي فاتورة مختلفة وليست مكررة.
 */
export function checkInvoiceAgainstSheet(
  inv: any,
  sheetRows: SheetRowLike[],
  logicalGroups?: SheetLogicalGroup[]
): { isDuplicate: boolean; isExactMatch: boolean; statusChangedOnly: boolean; sheetCopiesCount: number; reason: string } {
  if (!sheetRows || sheetRows.length === 0) {
    return { isDuplicate: false, isExactMatch: false, statusChangedOnly: false, sheetCopiesCount: 0, reason: '' };
  }
  const invNum = String(inv?.invoice_number || '').trim();
  const invComposite = buildFullInvoiceCompositeKey({
    pharmacy_name: inv?.pharmacy_name || '',
    invoice_date: inv?.invoice_date || '',
    items: inv?.items || []
  });
  if (!invComposite) {
    return { isDuplicate: false, isExactMatch: false, statusChangedOnly: false, sheetCopiesCount: 0, reason: '' };
  }

  const statusText = inv?.status === 'approved' ? 'معتمدة' : inv?.status === 'rejected' ? 'مرفوضة' : 'قيد التدقيق';
  const groups = logicalGroups || groupSheetRowsLogical(sheetRows);
  const matchingGroups = groups.filter(g => g.compositeKey && g.compositeKey === invComposite);

  if (matchingGroups.length === 0) {
    return { isDuplicate: false, isExactMatch: false, statusChangedOnly: false, sheetCopiesCount: 0, reason: '' };
  }

  const sameStatusGroup = matchingGroups.find(g => {
    const statusChanged = Boolean(invNum && g.invoice_number === invNum && g.status !== statusText);
    return !statusChanged;
  });

  if (!sameStatusGroup) {
    return { isDuplicate: false, isExactMatch: true, statusChangedOnly: true, sheetCopiesCount: matchingGroups.length, reason: '' };
  }

  const invDate = normalizeDateYmd(inv?.invoice_date || '');
  const itemsCount = (inv?.items || []).length;
  return {
    isDuplicate: true,
    isExactMatch: Boolean(invNum && sameStatusGroup.invoice_number === invNum),
    statusChangedOnly: false,
    sheetCopiesCount: matchingGroups.length,
    reason: `نفس الفاتورة (${sameStatusGroup.pharmacy_name || inv?.pharmacy_name} / ${invDate} — ${itemsCount} أصناف وبنفس الكميات) موجودة مسبقاً${sameStatusGroup.invoice_number ? ` برقم (${sameStatusGroup.invoice_number})` : ''}`
  };
}

/**
 * Rule: an invoice is a duplicate ONLY when ALL of:
 * 1) normalized pharmacy name
 * 2) invoice date
 * 3) number of items
 * 4) exact sorted set of (product name + quantity)
 * match another invoice.
 * Matching invoice_number alone never triggers a duplicate flag.
 */
export function buildFullInvoiceCompositeKey(params: {
  pharmacy_name?: string;
  invoice_date?: string;
  items?: any[];
}): string {
  const ph = normalizePharmacyName(params.pharmacy_name || '');
  const dt = normalizeDateYmd(params.invoice_date || '');
  const itemsSig = buildItemsSignature(params.items);
  if (!ph || !dt || itemsSig.count === 0) return '';
  return `${ph}||${dt}||${itemsSig.signature}`;
}

export function detectLocalInvoiceDuplicates(invoices: Invoice[]): Map<string, DuplicateMatchInfo> {
  const map = new Map<string, DuplicateMatchInfo>();
  const sorted = [...invoices].sort(
    (a, b) => new Date(a.created_at || a.invoice_date).getTime() - new Date(b.created_at || b.invoice_date).getTime()
  );

  const byComposite = new Map<string, Invoice[]>();
  for (const inv of sorted) {
    const key = buildFullInvoiceCompositeKey({
      pharmacy_name: inv.pharmacy_name,
      invoice_date: inv.invoice_date,
      items: inv.items
    });
    if (!key) {
      map.set(inv.id, { isDuplicate: false, isOriginal: false, duplicateCount: 0, reason: '' });
      continue;
    }
    if (!byComposite.has(key)) byComposite.set(key, []);
    byComposite.get(key)!.push(inv);
  }

  for (const group of byComposite.values()) {
    if (group.length > 1) {
      group.forEach((item, index) => {
        if (index === 0) {
          map.set(item.id, {
            isDuplicate: true,
            isOriginal: true,
            duplicateCount: group.length - 1,
            reason: `يوجد ${group.length - 1} نسخ متطابقة (نفس الصيدلية والتاريخ والمنتجات وعددها)`
          });
        } else {
          map.set(item.id, {
            isDuplicate: true,
            isOriginal: false,
            duplicateCount: group.length - 1,
            matchedWithId: group[0].id,
            reason: `نسخة مكررة مطابقة تماماً للأصل (نفس الصيدلية والتاريخ والأصناف والكميات)`
          });
        }
      });
    } else {
      map.set(group[0].id, { isDuplicate: false, isOriginal: false, duplicateCount: 0, reason: '' });
    }
  }

  return map;
}

/**
 * Analyzes rows loaded from Google Sheets to identify true full-invoice duplicates.
 * Multi-item rows belonging to one invoice never flag each other as duplicates unless
 * a full duplicate copy of (pharmacy + date + item count + items & quantities) exists,
 * or the exact same (product + quantity) row is repeated under the same invoice header.
 */
export function analyzeSheetDuplicates(rows: SheetRowLike[]): {
  duplicateGroups: SheetDuplicateGroup[];
  duplicateRowIndices: Set<number>;
} {
  const logicalGroups = groupSheetRowsLogical(rows);
  const byFullSignature = new Map<string, SheetLogicalGroup[]>();
  const duplicateRowIndices = new Set<number>();
  const duplicateGroups: SheetDuplicateGroup[] = [];

  for (const grp of logicalGroups) {
    if (grp.compositeKey) {
      if (!byFullSignature.has(grp.compositeKey)) byFullSignature.set(grp.compositeKey, []);
      byFullSignature.get(grp.compositeKey)!.push(grp);
    }
  }

  for (const copies of byFullSignature.values()) {
    if (copies.length <= 1) continue;

    // تعليم جميع نسخ المجموعة المكررة حتى يعود الصف المتبقي أبيض بمجرد حذف النسخة الزائدة
    for (const copy of copies) {
      for (const entry of copy.items) {
        duplicateRowIndices.add(entry.rowIndex);
      }
    }

    const extraCopies = copies.slice(1);
    for (const copy of extraCopies) {
      const first = copy.items[0].row;
      const invNum = String(first.invoice_number || '').trim();
      duplicateGroups.push({
        key: copy.gKey,
        invoice_number: invNum || 'بدون رقم',
        invoice_date: normalizeDateYmd(first.invoice_date || ''),
        pharmacy_name: String(first.pharmacy_name || '').trim(),
        timestamp: String(first.timestamp || '').trim(),
        rowsCount: copy.items.length,
        totalAmount: copy.items.reduce((s, x) => s + parseSheetNumber(x.row.line_total || 0), 0),
        productsSummary: copy.items.map(x => `${x.row.product_name || ''} (${parseSheetNumber(x.row.quantity || 0)})`).join('، '),
        rowIndices: copy.items.map(x => x.rowIndex)
      });
    }
  }

  return { duplicateGroups, duplicateRowIndices };
}
