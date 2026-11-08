/**
 * Gemini Vision OCR Engine
 * يستخدم Google Gemini Vision لقراءة صور الفواتير العراقية بدقة عالية
 * يتفوق على Tesseract في: الصور المائلة، النص العربي، الجداول المختلطة عربي/إنجليزي
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { ENV } from '../../config/env';

export interface GeminiInvoiceResult {
  invoice_number: string;
  invoice_date: string;
  pharmacy_name: string;
  pharmacy_area?: string;
  warehouse_name: string;
  items: Array<{
    product_name: string;
    dosage_form?: string;
    quantity: number;
    unit_price: number;
    bonus_quantity: number;
    line_total: number;
    batch_no?: string;
    exp_date?: string;
  }>;
  total_amount: number;
  raw_extracted: string;
  confidence: number;
  method: 'gemini_vision';
}

/**
 * دالة مساعدة ذكية لاكتشاف الشكل الدوائي / نوع المادة حصراً من 4 كلمات أساسية:
 * قطرة ، كريم ، مرهم ، حبوب (بدون أي إضافات أو كلمات أخرى)
 */
export function detectDosageForm(productName: string): 'قطرة' | 'كريم' | 'مرهم' | 'حبوب' {
  const p = (productName || '').toLowerCase();
  if (p.includes('drop') || p.includes('drup') || p.includes('قطرة') || p.includes('قطره')) return 'قطرة';
  if (p.includes('ointment') || p.includes('مرهم') || p.includes('oint') || p.includes(' ung')) return 'مرهم';
  if (p.includes('cream') || p.includes('كريم') || p.includes(' crm') || p.includes(' cr ')) return 'كريم';
  return 'حبوب';
}

/**
 * دالة مساعدة ذكية لاكتشاف المنطقة / المكان (مثل الزعفرانية، مدينة الصدر، الكرادة، المنصور...)
 */
export function detectAreaFromName(text: string): string {
  if (!text) return '';
  const knownAreas = [
    'الزعفرانية', 'زعفرانية', 'مدينة الصدر', 'الصدر', 'الكرادة', 'المنصور',
    'الشعب', 'الدورة', 'الكاظمية', 'الحارثية', 'زيونة', 'السيدية',
    'الغزالية', 'البلديات', 'الحبيبية', 'بغداد الجديدة', 'العامرية',
    'اليرموك', 'حي الجامعة', 'البياع', 'حي أور', 'المشتل', 'الغدير',
    'حي الخضراء', 'القاهرة', 'الصليخ', 'الأعظمية', 'الكرخ', 'الرصافة',
    'بسماية', 'الشعلة', 'جكوك', 'الطارمية', 'المدائن', 'المحمودية', 'أبو غريب'
  ];
  for (const a of knownAreas) {
    if (text.includes(a)) {
      return a.startsWith('ال') ? a : `ال${a}`;
    }
  }
  const m = text.match(/[\/\-]\s*([^\/\-]+)$/);
  if (m && m[1].trim().length >= 3) {
    return m[1].trim();
  }
  return '';
}

const INVOICE_EXTRACTION_PROMPT = `
أنت نظام ذكاء اصطناعي خبير متخصص في قراءة فواتير أدوية المذاخر والمستودعات في العراق.
يجب أن تقرأ الصورة بشكل كامل بغض النظر عن شكل الفاتورة أو لغتها (عربية / إنجليزية / مختلطة).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
القواعد الذكية لاستخراج الحقول (بحسب نوع الفاتورة)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. رقم الفاتورة (invoice_number):
   - ابحث عن: Invoice # / رقم الفاتورة / رقم الفاتورة: / الرقم / SAL-01-XXXX / أو أي رقم بجانب كلمة "فاتورة".
   - إذا وُجد حقل "رقم الفاتورة" بجانب تاريخ ووقت، خذ الرقم فقط.

2. تاريخ الفاتورة (invoice_date):
   - بصيغة YYYY-MM-DD دائماً.
   - ابحث عن: Date / التاريخ / تاريخ الفاتورة.
   - تحويل: 13/07/2026 → 2026-07-13، أو 2026/04/13 → 2026-04-13.

3. اسم الصيدلية المشترية (pharmacy_name):
   ⚠️ هذا الحقل الأهم — اقرأه بعناية شديدة:

   أ) فواتير مزايا بغداد (Mazaya Baghdad) وما شابهها من إنجليزية:
      - الصيدلية مكتوبة بعد "Client Info :" فقط.
      - مثال: "Client Info : الصحة العالمية / الكرادة" → pharmacy_name = "صيدلية الصحة العالمية / الكرادة"
      - مثال: "Client Info : الأمكن / الحبيبية" → pharmacy_name = "صيدلية الأمكن / الحبيبية"
      - ⛔ "Reference #" يحتوي على اسم موظف (مثل "ايثار"، "علي")، ليس صيدلية!

   ب) فواتير المذاخر العربية (الشغاف، السعفة، الكندي، طريق السلام، الرعاية وغيرها):
      - ابحث عن خانة "اسم الجهة" أو "الاسم :" أو "المطلوب لـ" أو "الزبون" أو "السيد / السادة" في رأس الفاتورة.
      - ⛔ تحذير حاسم: لا تضع أبداً pharmacy_name = "صيدلية" وحدها! يجب استخراج الاسم الكامل المميز للصيدلية مع المنطقة أو اسم الصيدلي (مثل: "صيدلية نور الهدى حميد لفتة / البلديات" أو "صيدلية صفا الورد مجمع بسماية" أو "ص حسين هاشم محمود - زيونة").
      - اقرأ الكلمات التي تلي كلمة "صيدلية" أو التي تلي "اسم الجهة :" بدقة بالغة حتى نهاية السطر.
      - إذا لم تكن كلمة "صيدلية" موجودة في النص المكتوب، أضفها في بداية الاسم الناتج.

6. اسم المذخر البائع (warehouse_name):
   - اسم المذخر في رأس الفاتورة: "مذخر أدوية مزايا بغداد" / "مذخر الشغاف" / "مذخر السعفة" / إلخ.

7. المنطقة / المكان (pharmacy_area):
   - استخرج المنطقة أو الحي المذكور في الفاتورة أو عنوان الصيدلية (مثل: الزعفرانية، مدينة الصدر، الكرادة، المنصور، الحبيبية، البلديات، زيونة، الشعب، الدورة، الكاظمية، إلخ). إن لم يُذكر صراحة، اتركه فارغاً.

8. جدول المواد الدوائية (items) — لكل صف/سطر في الجدول:
   - اسم المادة الدوائية (product_name): كاملاً كما هو (مثال: "Elica m 30g cream"، "Fusibact 2% cream"، "loxtra 5ml drop").
   - الشكل الدوائي / نوع المادة (dosage_form):
     ⛔ تحذير حاسم ومؤكد: يجب أن تكون القيمة إحدى الكلمات الأربعة التالية فقط بدون أي إضافات أو رموز أو كلمات أخرى إطلاقاً:
       * "قطرة" (إذا كان قطرة للعين أو الأذن أو drop)
       * "كريم" (إذا كان دهان كريمي أو cream)
       * "مرهم" (إذا كان دهان مرهمي أو ointment)
       * "حبوب" (إذا كان أقراص أو كبسولات أو أي مستحضر آخر)
     (ممنوع كتابة أي كلمة خارج هذه الكلمات الأربعة، وممنوع كتابة المادة الفعالة إطلاقاً).
   - الكمية (quantity): رقم صحيح فقط.
   - سعر المفرد (unit_price): رقم بالدينار، أزل الفواصل (5,750 → 5750، 5'750 → 5750).
   - البونص/المجاني (bonus_quantity):
     * فواتير مزايا: عمود FOC. 0 يعني 0، 1+ يعني العدد.
     * فواتير أخرى: عمود "مجاني" أو "بونص". إن لم يوجد عمود صريح اكتب 0.
   - إجمالي السطر (line_total): الكمية × سعر المفرد.
   - رقم الوجبة (batch_no): إن وُجد.
   - تاريخ النفاذ (exp_date): إن وُجد بصيغة YYYY-MM.

9. المجموع الإجمالي الصافي (total_amount):
   - ابحث عن: Net Amount / الصافي / إجمالي / المجموع / الإجمالي الصافي.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
أمثلة على أنماط الفواتير الشائعة:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

مزايا بغداد:
  Invoice # → رقم الفاتورة | Reference # → موظف (تجاهله) | Client Info → صيدلية | FOC → بونص

الشغاف / دراكو:
  الأعمدة بالعربي: الكمية | السعر | Exp | Batch | المجموع | اسم الجهة

السعفة / الكندي / غيرها:
  أعمدة: الكمية | السعر | الصلاحية | الشركة | العمودة/المادة | ت

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الإخراج المطلوب — JSON فقط بلا كلام إضافي:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "invoice_number": "...",
  "invoice_date": "YYYY-MM-DD",
  "pharmacy_name": "صيدلية ...",
  "pharmacy_area": "الزعفرانية / مدينة الصدر / ...",
  "warehouse_name": "...",
  "items": [
    {
      "product_name": "...",
      "dosage_form": "قطرة / كريم / مرهم / حبوب",
      "quantity": 0,
      "unit_price": 0,
      "bonus_quantity": 0,
      "line_total": 0,
      "batch_no": "...",
      "exp_date": "YYYY-MM"
    }
  ],
  "total_amount": 0
}
`;

export async function extractInvoiceWithGemini(imagePath: string, customApiKey?: string): Promise<GeminiInvoiceResult | null> {
  const apiKey = (customApiKey || '').trim() || ENV.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not set (no user key or system key) — falling back to Tesseract OCR');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.8-flash'];

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const ext = imagePath.toLowerCase();
    let mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
    if (ext.endsWith('.png')) mimeType = 'image/png';
    else if (ext.endsWith('.webp')) mimeType = 'image/webp';

    let responseText = '';
    let usedModel = '';

    for (const modelName of candidateModels) {
      try {
        console.log(`🤖 Invoking Gemini Vision with model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          INVOICE_EXTRACTION_PROMPT,
          {
            inlineData: {
              mimeType,
              data: base64Image
            }
          }
        ]);
        responseText = result.response.text().trim();
        usedModel = modelName;
        console.log(`✅ Gemini Vision succeeded using: ${usedModel}`);
        break;
      } catch (modelErr: any) {
        console.warn(`⚠️ Model ${modelName} failed (${modelErr.message?.slice(0, 80)}). Trying next candidate...`);
      }
    }

    if (!responseText) {
      console.error('All Gemini model candidates failed.');
      return null;
    }

    // استخراج JSON من الرد (قد يحتوي على ``` أو نص إضافي)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini did not return valid JSON:', responseText.slice(0, 200));
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // تنظيف وتحقق من البيانات
    const items = (parsed.items || []).map((it: any) => {
      const prodName = String(it.product_name || '').trim();
      let detectedForm = String(it.dosage_form || '').trim();
      if (!['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(detectedForm)) {
        detectedForm = detectDosageForm(prodName || detectedForm);
      }
      return {
        product_name: prodName,
        dosage_form: detectedForm,
        quantity: Math.abs(parseInt(it.quantity) || 0),
        unit_price: Math.abs(parseFloat(it.unit_price) || 0),
        bonus_quantity: Math.abs(parseInt(it.bonus_quantity) || 0),
        line_total: Math.abs(parseFloat(it.line_total) || 0),
        batch_no: it.batch_no && it.batch_no !== 'null' ? String(it.batch_no) : undefined,
        exp_date: it.exp_date && it.exp_date !== 'null' ? String(it.exp_date) : undefined,
      };
    }).filter((it: any) => it.product_name && it.quantity > 0);

    // إذا line_total = 0 احسبها
    for (const it of items) {
      if (it.line_total === 0 && it.quantity > 0 && it.unit_price > 0) {
        it.line_total = it.quantity * it.unit_price;
      }
    }

    const totalAmount = items.reduce((s: number, it: any) => s + it.line_total, 0)
      || Math.abs(parseFloat(parsed.total_amount) || 0);

    const parsedPhName = String(parsed.pharmacy_name || '').trim();
    const cleanPh = parsedPhName.replace(/^(صيدلية|صيدليه|مذخر|ص)\b/gi, '').trim();
    const finalPhName = cleanPh.length >= 2 ? parsedPhName : '';

    const detectedArea = String(parsed.pharmacy_area || '').trim() || detectAreaFromName(parsedPhName) || detectAreaFromName(responseText);

    return {
      invoice_number: String(parsed.invoice_number || '').trim(),
      invoice_date: String(parsed.invoice_date || new Date().toISOString().split('T')[0]),
      pharmacy_name: finalPhName,
      pharmacy_area: detectedArea,
      warehouse_name: String(parsed.warehouse_name || '').trim(),
      items,
      total_amount: totalAmount,
      raw_extracted: responseText,
      confidence: 0.96,
      method: 'gemini_vision'
    };

  } catch (err: any) {
    console.error('Gemini Vision OCR error:', err.message);
    return null;
  }
}

