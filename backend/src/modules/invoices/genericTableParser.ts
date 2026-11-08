/**
 * Generic Intelligent Table & Invoice Parser Engine
 * 
 * محرك استخراج الجداول والفواتير الذكي العام
 * يعتمد على التحليل الدلالي للأعمدة، الترتيب المكاني، والتحقق الرياضي
 * (Semantic Column Detection + Spatial Alignment + Mathematical Cross-Validation)
 */

export interface ParsedTableColumn {
  type: 'name' | 'qty' | 'price' | 'total' | 'bonus' | 'batch' | 'exp';
  rawHeader: string;
  index: number;
}

export interface ExtractedLineItem {
  raw_line: string;
  product_name: string;
  matched_product_id?: string;
  quantity: number;
  unit_price: number;
  bonus_quantity: number;
  line_total: number;
  batch_no?: string;
  exp_date?: string;
  confidence: number;
}

export interface GenericInvoiceParseResult {
  invoice_number: string;
  invoice_date: string;
  pharmacy_name: string;
  matched_pharmacy_id?: string;
  warehouse_name?: string;
  items: ExtractedLineItem[];
  detected_columns: string[];
  total_calculated: number;
  confidence_score: number;
  extraction_method: 'generic_dynamic_table_parser';
}

// ── 1. معجم المترادفات الدلالية لرؤوس الأعمدة (Semantic Synonyms Dictionary) ──
const COLUMN_SYNONYMS = {
  name: [
    'اسم المادة', 'المادة', 'اسم الصنف', 'الصنف', 'البيان', 'المستحضر', 'اسم الدواء',
    'item', 'item name', 'description', 'product', 'product name', 'particulars'
  ],
  qty: [
    'الكمية', 'كمية', 'العدد', 'عدد', 'الوحدات', 'قطع',
    'qty', 'quantity', 'qnty', 'units', 'count', 'pcs'
  ],
  price: [
    'السعر', 'سعر', 'سعر المفرد', 'سعر الوحدة', 'سعر البيع', 'القيمة المفردة', 'مفرد',
    'price', 'unit price', 'rate', 'u.price', 'u/price', 'unit_price'
  ],
  total: [
    'المجموع', 'القيمة', 'الإجمالي', 'المبلغ', 'صافي القيمة', 'القيمة الإجمالية', 'المجموع الصافي',
    'total', 'amount', 'net', 'line total', 'total amount', 'value'
  ],
  bonus: [
    'البونص', 'بونص', 'المجاني', 'مجاني', 'الهدية', 'هدية', 'فري', 'بيان',
    'foc', 'bonus', 'free', 'f.o.c'
  ],
  batch: [
    'الرقعة', 'الوجبة', 'رقم الوجبة', 'باتش', 'رقم الطبخة',
    'batch', 'batch no', 'lot', 'lot no', 'batch #'
  ],
  exp: [
    'النفاذ', 'تاريخ النفاذ', 'الصلاحية', 'تاريخ الصلاحية', 'الانتهاء', 'تاريخ الانتهاء',
    'exp', 'expiry', 'exp date', 'expiry date', 'val'
  ]
};

// ── 2. تنظيف وتوحيد الأرقام العراقية والعربية ──
export function normalizeNumbers(str: string): string {
  if (!str) return '';
  // تحويل الأرقام الهندية (العربية الشرقية) إلى أرقام لاتينية
  const easternDigits: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  let clean = str.replace(/[٠-٩]/g, d => easternDigits[d] || d);

  // إزالة فاصلة الآلاف الخاصة ببرنامج البيان والأجهزة المحاسبية العراقية (مثل 5'750 أو 3'753'844)
  clean = clean.replace(/(\d+)'(\d+)/g, '$1$2');
  clean = clean.replace(/(\d+)'(\d+)/g, '$1$2'); // مرتين للتعامل مع الملايين

  // إزالة الفواصل الإنجليزية المستخدمة كفواصل آلاف (مثل 48,280 -> 48280)
  clean = clean.replace(/(\d{1,3}),(\d{3})/g, '$1$2');

  return clean;
}

// ── 3. كاشف الترويسة الديناميكي للأعمدة (Dynamic Column Header Detector) ──
export function detectHeaderRow(lines: string[]): { headerLine: string; headerIndex: number; columns: ParsedTableColumn[] } | null {
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].toLowerCase();
    const detected: ParsedTableColumn[] = [];

    // تقسيم السطر إلى مقاطع/خلايا بناءً على الفواصل الشائعة (| أو تاب أو مسافات متعددة)
    const tokens = line.split(/[\|\t]|\s{2,}/).map(t => t.trim()).filter(Boolean);
    const searchTokens = tokens.length >= 2 ? tokens : line.split(/\s+/).filter(Boolean);

    for (let tIdx = 0; tIdx < searchTokens.length; tIdx++) {
      const token = searchTokens[tIdx];
      for (const [colType, syns] of Object.entries(COLUMN_SYNONYMS)) {
        if (syns.some(s => token === s || token.includes(s) || s.includes(token))) {
          if (!detected.some(d => d.type === colType)) {
            detected.push({
              type: colType as any,
              rawHeader: token,
              index: tIdx
            });
            break;
          }
        }
      }
    }

    // إذا وُجد نوعان أو أكثر من الأعمدة الأساسية (مثل المادة والكمية، أو الكمية والسعر)، فهذا صف الترويسة!
    const hasCore = detected.some(d => d.type === 'name' || d.type === 'qty') &&
                    detected.some(d => d.type === 'price' || d.type === 'total' || d.type === 'qty');

    if (detected.length >= 2 && hasCore) {
      return {
        headerLine: lines[i],
        headerIndex: i,
        columns: detected
      };
    }
  }
  return null;
}

// ── 4. التحقق الرياضي التلقائي (Mathematical Cross-Validation Heuristic) ──
// في أي صف يحتوي على أرقام، تبحث هذه الخوارزمية عن ثلاثية (Qty, Price, Total)
// تحقق المعادلة: الكمية × السعر = المجموع (أو قريبة جداً بفارق تقريب بسيط)
// مع إعطاء الأولوية القصوى للمجاميع المالية الحقيقية (المجموع الأكبر ومطابقة أسعار السوق)
export function resolveRowQuantitiesAndPrices(numbers: number[]): { qty: number; price: number; total: number } | null {
  if (numbers.length < 2) return null;

  interface CandidateMatch {
    qty: number;
    price: number;
    total: number;
    score: number;
  }
  const candidates: CandidateMatch[] = [];

  // فحص جميع التباديل الممكنة
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i === j) continue;
      const n1 = numbers[i];
      const n2 = numbers[j];
      const prod = n1 * n2;

      // تجنب ضرب الأرقام التافهة (مثل رقم التسلسل 1 أو 2 في كمية صغيرة)
      if (prod < 100) continue;

      // هل حاصل ضرب هذين الرقمين موجود كرقم ثالث في نفس السطر؟
      for (let k = 0; k < numbers.length; k++) {
        if (k === i || k === j) continue;
        const n3 = numbers[k];

        // شرط التطابق الرياضي
        if (Math.abs(prod - n3) <= 5 || (n3 > 0 && Math.abs(prod - n3) / n3 < 0.01)) {
          let qty = n1;
          let price = n2;
          if (n1 > n2 && n1 >= 250 && n2 <= 1000) {
            qty = n2;
            price = n1;
          } else if (n2 > n1 && n2 >= 250 && n1 <= 1000) {
            qty = n1;
            price = n2;
          }

          // تسجيل نقطة جودة للمرشح:
          // المجموع الأكبر والأسعار الأكثر واقعية تأخذ الأولوية القصوى
          let score = n3;
          if (price >= 500) score += 500000;
          if (qty >= 1 && qty <= 1000) score += 100000;

          candidates.push({ qty, price, total: n3, score });
        }
      }
    }
  }

  if (candidates.length > 0) {
    // فرز المرشحين واختيار المعادلة المالية الأصح
    candidates.sort((a, b) => b.score - a.score);
    return {
      qty: candidates[0].qty,
      price: candidates[0].price,
      total: candidates[0].total
    };
  }

  // إذا لم نجد رقماً ثالثاً للمجموع ولكن لدينا رقمين (كمية وسعر معقولين)
  const candidateQty = numbers.find(n => n >= 1 && n <= 2000 && Number.isInteger(n) && n !== 1 && n !== 2);
  const candidatePrice = numbers.find(n => n >= 500 && n <= 500000 && n !== candidateQty);
  if (candidateQty && candidatePrice) {
    return {
      qty: candidateQty,
      price: candidatePrice,
      total: candidateQty * candidatePrice
    };
  }

  return null;
}

// ── 5. المحرك العام الذكي لمعالجة الفاتورة واستخراج البيانات ──
export class GenericTableParser {

  /**
   * استخراج بيانات أي فاتورة بديناميكية تامة
   */
  static parse(ocrRawText: string, catalogProducts: any[] = [], pharmacies: any[] = []): GenericInvoiceParseResult {
    const rawLines = ocrRawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const normalizedLines = rawLines.map(normalizeNumbers);

    // ── أ. استخراج ترويسة الفاتورة (رقم الفاتورة، التاريخ، الصيدلية، المذخر) ──
    const metadata = this.extractMetadata(ocrRawText, normalizedLines, pharmacies);

    // ── ب. اكتشاف صف ترويسة الأعمدة ──
    const headerInfo = detectHeaderRow(normalizedLines);
    const detectedColumnNames = headerInfo ? headerInfo.columns.map(c => `${c.type}:${c.rawHeader}`) : ['auto-detected-by-math'];

    const items: ExtractedLineItem[] = [];
    const startIndex = headerInfo ? headerInfo.headerIndex + 1 : 0;

    // ── ج. مسح الصفوف واستخراج المواد ──
    for (let i = startIndex; i < normalizedLines.length; i++) {
      const line = normalizedLines[i];
      const originalLine = rawLines[i] || line;

      // تجاهل صفوف المجموع النهائي، التذييل، شروط البيع، أو الملاحظات
      if (this.isFooterOrSummaryLine(line)) continue;

      // إزالة التواريخ من السطر (مثل 2027/11 أو 2028/05) حتى لا تتداخل مع الكميات والأسعار
      const lineWithoutDates = line.replace(/\b\d{4}[\/\-]\d{1,2}\b/g, ' ').replace(/\b\d{1,2}[\/\-]\d{4}\b/g, ' ');

      // استخراج كافة الأرقام في السطر
      const numberMatches = lineWithoutDates.match(/\b\d+(?:\.\d+)?\b/g);
      if (!numberMatches || numberMatches.length < 2) continue;

      const numbers = numberMatches
        .map(n => parseFloat(n))
        .filter(n => !isNaN(n) && n > 0 && n < 100000000);

      // استبعاد أرقام السنوات المستقلة
      const mathNumbers = numbers.filter(n => !(n >= 2024 && n <= 2035 && !line.includes(`${n}000`)));

      // التحقق الرياضي الذاتي لاكتشاف (الكمية × السعر = المجموع)
      const mathResult = resolveRowQuantitiesAndPrices(mathNumbers);
      if (!mathResult) continue;

      // استخراج الاسم النصي للمادة بإزالة الأرقام والرموز
      let rawProdName = line
        .replace(/\b\d+(?:\.\d+)?\b/g, ' ')
        .replace(/[\|\:\#\*\-\_\/]/g, ' ')
        .replace(/\b(?:jamjoom|pharma|cream|oint|ointment|drop|drups|tablet|capsule|mg|ml|g)\b/gi, ' $& ')
        .replace(/\s+/g, ' ')
        .trim();

      // إذا كان الاسم فارغاً أو قصيراً جداً، حاول استخراجه من السطر الأصلي
      if (rawProdName.length < 3) {
        rawProdName = originalLine.replace(/[0-9\'\,\.\:\#\|\-\/]/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // مطابقة المادة مع كتالوج المنتجات في قاعدة البيانات
      const matchedProd = this.matchWithCatalog(rawProdName, catalogProducts);

      // احتساب البونص (من العمود أو من قاعدة العرض 10+1)
      let bonusQty = 0;
      // فحص إن كان هناك رقم إضافي صغير يمثل بونص
      const remainingSmallNums = mathNumbers.filter(n => n !== mathResult.qty && n !== mathResult.price && n !== mathResult.total && n <= 50);
      if (remainingSmallNums.length > 0) {
        bonusQty = remainingSmallNums[0];
      } else {
        // القاعدة الافتراضية للشركات: لكل 10 قطع 1 مجاني
        bonusQty = Math.floor(mathResult.qty / 10);
      }

      items.push({
        raw_line: line,
        product_name: matchedProd ? matchedProd.name : (rawProdName || `منتج مسجل (${items.length + 1})`),
        matched_product_id: matchedProd?.id,
        quantity: mathResult.qty,
        unit_price: mathResult.price,
        bonus_quantity: bonusQty,
        line_total: mathResult.total || (mathResult.qty * mathResult.price),
        confidence: mathResult.total ? 0.98 : 0.85
      });
    }

    const calculatedTotal = items.reduce((sum, it) => sum + it.line_total, 0);

    return {
      invoice_number: metadata.invoiceNumber,
      invoice_date: metadata.invoiceDate,
      pharmacy_name: metadata.pharmacyName,
      matched_pharmacy_id: metadata.pharmacyId,
      warehouse_name: metadata.warehouseName,
      items,
      detected_columns: detectedColumnNames,
      total_calculated: calculatedTotal,
      confidence_score: items.length > 0 ? 0.95 : 0.60,
      extraction_method: 'generic_dynamic_table_parser'
    };
  }

  /**
   * استخراج الترويسة بمرونة تامة دون التقيد بنموذج معين
   */
  private static extractMetadata(fullText: string, lines: string[], pharmacies: any[]) {
    let invoiceNumber = '';
    let invoiceDate = '';
    let pharmacyName = '';
    let pharmacyId = '';
    let warehouseName = '';

    // 1. رقم الفاتورة (Invoice Number)
    const invPatterns = [
      /(?:رقم\s*الفاتورة|فاتورة\s*رقم|الرقم|Invoice\s*(?:#|no|number))\s*[:#\s]*([0-9A-Za-z\-_]+)/i,
      /\b(SAL-\d{2}-\d+)\b/i,
      /\b(\d{5,8})\b/
    ];
    for (const pat of invPatterns) {
      const m = fullText.match(pat);
      if (m && m[1] && m[1].length >= 4) {
        invoiceNumber = m[1].trim();
        break;
      }
    }
    if (!invoiceNumber) {
      invoiceNumber = `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // 2. تاريخ الفاتورة (Invoice Date)
    const datePatterns = [
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,   // YYYY/MM/DD
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](202\d)/,   // DD/MM/YYYY
    ];
    for (const pat of datePatterns) {
      const m = fullText.match(pat);
      if (m) {
        if (m[1].length === 4) {
          invoiceDate = `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
        } else {
          invoiceDate = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
        }
        break;
      }
    }
    if (!invoiceDate) invoiceDate = new Date().toISOString().split('T')[0];

    // 3. اسم الصيدلية (Pharmacy / Client Name)
    const clientHeaderPatterns = [
      /(?:اسم\s*الجهة|الاسم|السيد|المطلوب|اسم\s*العميل|Client\s*Info|صيدلية)\s*[:\-]\s*([^\n\r]+)/i
    ];
    for (const pat of clientHeaderPatterns) {
      const m = fullText.match(pat);
      if (m && m[1]) {
        pharmacyName = m[1].replace(/[\"\'\:\*\#]/g, '').trim();
        break;
      }
    }

    // مطابقة الصيدلية مع قاعدة البيانات
    if (pharmacyName) {
      const matched = pharmacies.find(p =>
        pharmacyName.includes(p.name) || p.name.includes(pharmacyName) ||
        p.name.split(' ').some((w: string) => w.length > 3 && pharmacyName.includes(w))
      );
      if (matched) {
        pharmacyId = matched.id;
        pharmacyName = matched.name;
      }
    } else if (pharmacies.length > 0) {
      pharmacyId = pharmacies[0].id;
      pharmacyName = pharmacies[0].name;
    }

    // 4. اسم المذخر (Warehouse Name)
    const whMatch = fullText.match(/(?:مذخر\s*أدوية|مذخر)\s*([^\n\r]+)/i) || fullText.match(/(MAZAYA|AL-SHAGHAF|TAREEQ\s*AL-SALAM)/i);
    if (whMatch) {
      warehouseName = whMatch[0].trim();
    }

    return { invoiceNumber, invoiceDate, pharmacyName, pharmacyId, warehouseName };
  }

  /**
   * تمييز سطور التذييل والمجاميع لاستبعادها من قائمة بنود الأدوية
   */
  private static isFooterOrSummaryLine(line: string): boolean {
    const footerKeywords = [
      'المجموع :', 'الصافي', 'الخصم', 'قيمة المردود', 'الديون الحالية', 'الرصيد السابق', 'الرصيد الحالي',
      'مدير المبيعات', 'المجهز', 'الكاتب', 'منظم الفاتورة', 'تاريخ الطباعة', 'صفحة 1 من', 'صفحة',
      'برنامج البيان', 'شروط التسديد', 'استرجاع المواد', 'وقت الطباعة', 'net amount', 'total :'
    ];
    const lower = line.toLowerCase();
    return footerKeywords.some(k => lower.includes(k));
  }

  /**
   * مطابقة ذكية بالكلمات المفتاحية والتشابه النصي مع كتالوج الأدوية
   */
  private static matchWithCatalog(rawName: string, products: any[]) {
    if (!rawName || products.length === 0) return null;
    const cleanRaw = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');

    // 1. فحص التطابق بالاسم الكامل
    for (const p of products) {
      const cleanProd = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanProd === cleanRaw || cleanRaw.includes(cleanProd) || cleanProd.includes(cleanRaw)) {
        return p;
      }
    }

    // 2. فحص تشابه الكلمات الأساسية (Token Overlap)
    const rawTokens = rawName.toLowerCase().split(/\s+/).filter(t => t.length >= 3);
    let bestMatch = null;
    let maxOverlap = 0;

    for (const p of products) {
      const prodTokens = p.name.toLowerCase().split(/\s+/).filter((t: string) => t.length >= 3);
      const overlap = rawTokens.filter(t => prodTokens.includes(t)).length;
      if (overlap > maxOverlap && overlap >= 1) {
        maxOverlap = overlap;
        bestMatch = p;
      }
    }

    return bestMatch;
  }
}
