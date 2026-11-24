/**
 * Client-Side Generic Intelligent Invoice Table Parser
 *
 * نسخة متصفح متكاملة من محرك استخراج جداول الفواتير العراقية:
 * 1. توحيد الأرقام العربية والهندية وفواصل البيان (5'750 -> 5750)
 * 2. الكشف الدلالي للأعمدة + التحقق الرياضي (الكمية × السعر = المجموع)
 * 3. استخراج رقم الفاتورة، التاريخ، اسم الصيدلية، والمنطقة
 */

export interface ExtractedLineItem {
  raw_line: string;
  product_name: string;
  matched_product_id?: string;
  dosage_form: 'قطرة' | 'كريم' | 'مرهم' | 'حبوب';
  quantity: number;
  unit_price: number;
  bonus_quantity: number;
  line_total: number;
  confidence: number;
}

export interface GenericInvoiceParseResult {
  invoice_number: string;
  invoice_date: string;
  pharmacy_name: string;
  pharmacy_area: string;
  matched_pharmacy_id?: string;
  items: ExtractedLineItem[];
  confidence_score: number;
  raw_text: string;
}

export function detectDosageFormClient(productName: string): 'قطرة' | 'كريم' | 'مرهم' | 'حبوب' {
  const p = (productName || '').toLowerCase();
  if (p.includes('drop') || p.includes('drup') || p.includes('قطرة') || p.includes('قطره')) return 'قطرة';
  if (p.includes('ointment') || p.includes('مرهم') || p.includes('oint') || p.includes('ung')) return 'مرهم';
  if (p.includes('cream') || p.includes('كريم') || p.includes('crm') || p.includes('cr ')) return 'كريم';
  return 'حبوب';
}

export function detectAreaFromText(text: string): string {
  if (!text) return '';
  const areaAliases: Array<[string, string]> = [
    ['الزعفرانية', 'الزعفرانية'], ['زعفرانية', 'الزعفرانية'],
    ['مدينة الصدر', 'مدينة الصدر'], ['الصدر', 'مدينة الصدر'],
    ['الكرادة', 'الكرادة'], ['المنصور', 'المنصور'], ['الشعب', 'الشعب'],
    ['الدورة', 'الدورة'], ['الكاظمية', 'الكاظمية'], ['الحارثية', 'الحارثية'],
    ['زيونة', 'زيونة'], ['السيدية', 'السيدية'], ['الغزالية', 'الغزالية'],
    ['البلديات', 'البلديات'], ['الحبيبية', 'الحبيبية'], ['بغداد الجديدة', 'بغداد الجديدة'],
    ['العامرية', 'العامرية'], ['اليرموك', 'اليرموك'], ['حي الجامعة', 'حي الجامعة'],
    ['البياع', 'البياع'], ['حي أور', 'حي أور'], ['المشتل', 'المشتل'],
    ['الغدير', 'الغدير'], ['حي الخضراء', 'حي الخضراء'], ['القاهرة', 'القاهرة'],
    ['الصليخ', 'الصليخ'], ['الأعظمية', 'الأعظمية'], ['الكرخ', 'الكرخ'],
    ['الرصافة', 'الرصافة'], ['بسماية', 'بسماية'], ['الشعلة', 'الشعلة'],
    ['جكوك', 'جكوك'], ['الطارمية', 'الطارمية'], ['المدائن', 'المدائن'],
    ['المحمودية', 'المحمودية'], ['أبو غريب', 'أبو غريب']
  ];
  for (const [needle, canonical] of areaAliases) {
    if (text.includes(needle)) return canonical;
  }
  const m = text.match(/[\/\-]\s*([^\/\-\n\r]{3,25})$/);
  if (m && m[1].trim().length >= 3) {
    return m[1].trim();
  }
  return '';
}

export function normalizeNumbers(str: string): string {
  if (!str) return '';
  const easternDigits: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  let clean = str.replace(/[٠-٩]/g, d => easternDigits[d] || d);
  clean = clean.replace(/(\d+)'(\d+)/g, '$1$2');
  clean = clean.replace(/(\d+)'(\d+)/g, '$1$2');
  clean = clean.replace(/(\d{1,3}),(\d{3})/g, '$1$2');
  return clean;
}

export function resolveRowQuantitiesAndPrices(
  numbers: number[]
): { qty: number; price: number; total: number } | null {
  if (numbers.length < 2) return null;

  const candidates: Array<{ qty: number; price: number; total: number; score: number }> = [];

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i === j) continue;
      const n1 = numbers[i];
      const n2 = numbers[j];
      const prod = n1 * n2;
      if (prod < 100) continue;

      for (let k = 0; k < numbers.length; k++) {
        if (k === i || k === j) continue;
        const n3 = numbers[k];
        if (Math.abs(prod - n3) <= 5 || (n3 > 0 && Math.abs(prod - n3) / n3 < 0.015)) {
          let qty = n1;
          let price = n2;
          if (n1 > n2 && n1 >= 250 && n2 <= 1000) {
            qty = n2;
            price = n1;
          } else if (n2 > n1 && n2 >= 250 && n1 <= 1000) {
            qty = n1;
            price = n2;
          }
          let score = n3;
          if (price >= 500) score += 500000;
          if (qty >= 1 && qty <= 1000) score += 100000;
          candidates.push({ qty, price, total: n3, score });
        }
      }
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    return { qty: candidates[0].qty, price: candidates[0].price, total: candidates[0].total };
  }

  const candidateQty = numbers.find(n => n >= 1 && n <= 2000 && Number.isInteger(n) && n !== 1 && n !== 2);
  const candidatePrice = numbers.find(n => n >= 500 && n <= 500000 && n !== candidateQty);
  if (candidateQty && candidatePrice) {
    return { qty: candidateQty, price: candidatePrice, total: candidateQty * candidatePrice };
  }

  return null;
}

const COLUMN_SYNONYMS: Record<string, string[]> = {
  name: ['اسم المادة', 'المادة', 'اسم الصنف', 'الصنف', 'البيان', 'المستحضر', 'item', 'description', 'product'],
  qty: ['الكمية', 'كمية', 'العدد', 'عدد', 'qty', 'quantity', 'units'],
  price: ['السعر', 'سعر', 'سعر المفرد', 'سعر الوحدة', 'price', 'unit price', 'rate'],
  total: ['المجموع', 'القيمة', 'الإجمالي', 'المبلغ', 'total', 'amount', 'net']
};

function detectHeaderIndex(lines: string[]): number {
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const low = lines[i].toLowerCase();
    let matchedCols = 0;
    for (const syns of Object.values(COLUMN_SYNONYMS)) {
      if (syns.some(s => low.includes(s))) matchedCols++;
    }
    if (matchedCols >= 2) return i + 1;
  }
  return 0;
}

function isFooterLine(line: string): boolean {
  const keywords = [
    'المجموع :', 'الصافي', 'الخصم', 'الديون', 'الرصيد السابق', 'الرصيد الحالي',
    'مدير المبيعات', 'المجهز', 'منظم الفاتورة', 'تاريخ الطباعة', 'برنامج البيان',
    'شروط التسديد', 'net amount', 'total :', 'grand total'
  ];
  const low = line.toLowerCase();
  return keywords.some(k => low.includes(k));
}

function matchProductCatalog(rawName: string, catalogProducts: any[]) {
  if (!rawName || catalogProducts.length === 0) return null;
  const cleanRaw = rawName.toLowerCase().replace(/[^a-z0-9\u0621-\u064A]/g, '');
  if (cleanRaw.length < 3) return null;

  for (const p of catalogProducts) {
    const cleanProd = String(p.name || '').toLowerCase().replace(/[^a-z0-9\u0621-\u064A]/g, '');
    if (cleanProd && (cleanProd === cleanRaw || cleanRaw.includes(cleanProd) || cleanProd.includes(cleanRaw))) {
      return p;
    }
  }

  const rawTokens = rawName.toLowerCase().split(/\s+/).filter(t => t.length >= 3);
  let bestMatch: any = null;
  let maxOverlap = 0;
  for (const p of catalogProducts) {
    const prodTokens = String(p.name || '').toLowerCase().split(/\s+/).filter((t: string) => t.length >= 3);
    const overlap = rawTokens.filter(t => prodTokens.includes(t)).length;
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestMatch = p;
    }
  }
  return maxOverlap >= 1 ? bestMatch : null;
}

export function parseInvoiceOcrText(
  ocrRawText: string,
  catalogProducts: any[] = [],
  pharmacies: any[] = []
): GenericInvoiceParseResult {
  const normalizedFull = normalizeNumbers(ocrRawText || '');
  const rawLines = normalizedFull.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. رقم الفاتورة
  let invoiceNumber = '';
  const invPatterns = [
    /(?:رقم\s*الفاتورة|فاتورة\s*رقم|الرقم|Invoice\s*(?:#|no|number))\s*[:#\s\-]*([0-9A-Za-z\-_]{3,})/i,
    /\b(SAL-\d{2}-\d+)\b/i,
    /\b(\d{5,9})\b/
  ];
  for (const pat of invPatterns) {
    const m = normalizedFull.match(pat);
    if (m?.[1] && m[1].length >= 3) {
      invoiceNumber = m[1].trim();
      break;
    }
  }

  // 2. التاريخ
  let invoiceDate = '';
  const datePatterns = [
    /\b(202\d)[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})\b/,
    /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](202\d)\b/
  ];
  for (const pat of datePatterns) {
    const m = normalizedFull.match(pat);
    if (m) {
      invoiceDate = m[1].length === 4
        ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
        : `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
      break;
    }
  }
  if (!invoiceDate) invoiceDate = new Date().toISOString().split('T')[0];

  // 3. اسم الصيدلية
  let pharmacyName = '';
  let matchedPharmacyId = '';
  const clientPatterns = [
    /(?:اسم\s*الجهة|اسم\s*الصيدلية|اسم\s*العميل|المطلوب\s*من|المطلوب\s*لـ?|Client\s*Info)\s*[:\-]\s*([^\n\r]{3,60})/i,
    /(?:صيدلية|صيدليه)\s+([^\n\r]{3,45})/i
  ];
  for (const pat of clientPatterns) {
    const m = normalizedFull.match(pat);
    if (m?.[1]) {
      const candidate = m[1].replace(/[\"\'\:\*\#\|]/g, '').trim();
      if (candidate.length >= 2) {
        pharmacyName = candidate.startsWith('ص') ? candidate : `صيدلية ${candidate}`;
        break;
      }
    }
  }

  if (pharmacyName && pharmacies.length > 0) {
    const phMatch = pharmacies.find(p =>
      pharmacyName.includes(p.name) ||
      p.name.includes(pharmacyName.replace(/^صيدلية\s*/i, ''))
    );
    if (phMatch) {
      matchedPharmacyId = phMatch.id;
      pharmacyName = phMatch.name;
    }
  }

  const pharmacyArea = detectAreaFromText(pharmacyName) || detectAreaFromText(normalizedFull);

  // 4. البنود
  const startIdx = detectHeaderIndex(rawLines);
  const items: ExtractedLineItem[] = [];

  for (let i = startIdx; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (isFooterLine(line)) continue;

    const lineWithoutDates = line
      .replace(/\b\d{4}[\/\-]\d{1,2}(?:[\/\-]\d{1,2})?\b/g, ' ')
      .replace(/\b\d{1,2}[\/\-]\d{4}\b/g, ' ');

    const nums = (lineWithoutDates.match(/\b\d+(?:\.\d+)?\b/g) || [])
      .map(n => parseFloat(n))
      .filter(n => !isNaN(n) && n > 0 && n < 100000000)
      .filter(n => !(n >= 2024 && n <= 2035 && !line.includes(`${n}000`)));

    const math = resolveRowQuantitiesAndPrices(nums);
    if (!math) continue;

    let rawProdName = line
      .replace(/\b\d+(?:\.\d+)?\b/g, ' ')
      .replace(/[\|\:\#\*\-\_\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const matchedProd = matchProductCatalog(rawProdName, catalogProducts);
    const prodName = matchedProd ? matchedProd.name : (rawProdName.length >= 2 ? rawProdName : `صنف ${items.length + 1}`);
    const bonusQty = Math.floor(math.qty / 10);

    items.push({
      raw_line: line,
      product_name: prodName,
      matched_product_id: matchedProd?.id,
      dosage_form: detectDosageFormClient(prodName),
      quantity: math.qty,
      unit_price: math.price,
      bonus_quantity: bonusQty,
      line_total: math.total || math.qty * math.price,
      confidence: math.total ? 0.78 : 0.62
    });
  }

  const confidence = items.length > 0 ? 0.72 : (invoiceNumber || pharmacyName ? 0.45 : 0.25);

  return {
    invoice_number: invoiceNumber,
    invoice_date: invoiceDate,
    pharmacy_name: pharmacyName,
    pharmacy_area: pharmacyArea,
    matched_pharmacy_id: matchedPharmacyId,
    items,
    confidence_score: confidence,
    raw_text: ocrRawText
  };
}
