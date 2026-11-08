/**
 * Google Sheets Service
 * يربط النظام بجدول بيانات كوكل شيت كقاعدة بيانات حية ومزامنة تلقائية
 * Sheet: https://docs.google.com/spreadsheets/d/1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE/edit
 */

import fs from 'fs';
import path from 'path';
import { ENV } from '../../config/env';
import { PharmacyService, pharmacies } from '../pharmacies/pharmacy.service';
import { detectDosageForm, detectAreaFromName } from '../invoices/geminiVisionOcr';

export interface SheetRow {
  invoice_number: string;
  invoice_date: string;
  warehouse_name: string;
  pharmacy_name: string;
  area: string;
  city: string;
  product_name: string;
  dosage_form: string;
  quantity: number;
  unit_price: number;
  bonus_quantity: number;
  line_total: number;
  total_invoice: number;
  rep_name: string;
  status: string;
  timestamp: string;
}

export interface SheetSyncResult {
  success: boolean;
  rows_count: number;
  message: string;
  mode: 'webhook' | 'local_cached' | 'gviz';
  timestamp: string;
}

// تخزين محلي لروابط الويب هوك والسجلات في حال عدم وجود DB
const SYNC_LOG_PATH = path.join(__dirname, '../../../uploads/sheets_sync_log.json');
const CONFIG_PATH = path.join(__dirname, '../../../uploads/sheets_config.json');

export class GoogleSheetsService {
  private static webhookUrl: string = ENV.GOOGLE_SHEETS_WEBHOOK_URL || '';

  static init() {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const conf = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        if (conf.webhookUrl) this.webhookUrl = conf.webhookUrl;
        else if (conf.webhook_url) this.webhookUrl = conf.webhook_url;
      }
    } catch (e) {
      // ignore
    }
  }

  static getWebhookUrl(): string {
    return this.webhookUrl || ENV.GOOGLE_SHEETS_WEBHOOK_URL || '';
  }

  static setWebhookUrl(url: string) {
    this.webhookUrl = (url || '').trim();
    try {
      const dir = path.dirname(CONFIG_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CONFIG_PATH, JSON.stringify({ webhookUrl: this.webhookUrl, updatedAt: new Date().toISOString() }, null, 2));
    } catch (e) {
      console.warn('Could not save sheets config:', e);
    }
  }

  static getSheetId(): string {
    return ENV.GOOGLE_SHEET_ID;
  }

  static getSheetUrl(): string {
    return ENV.GOOGLE_SHEET_URL;
  }

  /**
   * 1. قراءة البيانات من كوكل شيت لعرضها في الموقع
   */
  static async readFromSheet(): Promise<{ headers: string[]; rows: SheetRow[]; rawCount: number }> {
    const webhook = this.getWebhookUrl();

    // الطريقة الأولى: إذا كان الويب هوك موجوداً
    if (webhook) {
      try {
        console.log('📡 Fetching data via Google Apps Script Webhook...');
        const res = await fetch(webhook, { method: 'GET' });
        if (res.ok) {
          const data: any = await res.json();
          if (Array.isArray(data.rows)) {
            const mappedRows: SheetRow[] = data.rows.map((r: any) => {
              const phName = String(r.pharmacy_name || '').trim();
              const prName = String(r.product_name || '').trim();
              return {
                invoice_number: String(r.invoice_number || '').trim(),
                invoice_date:   String(r.invoice_date || '').trim(),
                warehouse_name: String(r.warehouse_name || '').trim(),
                pharmacy_name:  phName,
                area:           String(r.area || detectAreaFromName(phName) || 'مركز المدينة').trim(),
                city:           String(r.city || 'بغداد').trim(),
                product_name:   prName,
                dosage_form:    String(r.dosage_form || detectDosageForm(prName)).trim(),
                quantity:       Number(r.quantity || 0),
                unit_price:     Number(r.unit_price || 0),
                bonus_quantity: Number(r.bonus_quantity || 0),
                line_total:     Number(r.line_total || 0),
                total_invoice:  Number(r.total_invoice || 0),
                rep_name:       String(r.rep_name || '').trim(),
                status:         String(r.status || '').trim(),
                timestamp:      String(r.timestamp || '').trim()
              };
            });
            return {
              headers: data.headers || this.getDefaultHeaders(),
              rows: mappedRows,
              rawCount: mappedRows.length
            };
          }
        }
      } catch (err: any) {
        console.warn('Google Apps Script GET failed:', err.message);
      }
    }

    // الطريقة الثانية: القراءة المباشرة من كوكل شيت العام عبر GViz JSON API
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${this.getSheetId()}/gviz/tq?tqx=out:json`;
      console.log('📊 Fetching data directly from public Google Sheet via GViz...');
      const res = await fetch(gvizUrl);
      if (res.ok) {
        const text = await res.text();
        // إزالة بادئة وخاتمة دالة gviz
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
        if (jsonMatch && jsonMatch[1]) {
          const data = JSON.parse(jsonMatch[1]);
          const cols: string[] = (data.table?.cols || []).map((c: any) => c.label || c.id || '');
          const rows: SheetRow[] = [];

          if (Array.isArray(data.table?.rows)) {
            for (const r of data.table.rows) {
              const c = r.c || [];
              if (c.length === 0 || !c[0]) continue;

              const is16Col = c.length >= 15 || cols.length >= 15;
              if (is16Col) {
                const phName = String(c[3]?.v ?? '');
                const prName = String(c[6]?.v ?? '');
                rows.push({
                  invoice_number: String(c[0]?.v ?? ''),
                  invoice_date:   String(c[1]?.f ?? c[1]?.v ?? ''),
                  warehouse_name: String(c[2]?.v ?? ''),
                  pharmacy_name:  phName,
                  area:           String((c[4]?.v ?? '') || detectAreaFromName(phName) || 'مركز المدينة'),
                  city:           String(c[5]?.v ?? 'بغداد'),
                  product_name:   prName,
                  dosage_form:    String((c[7]?.v ?? '') || detectDosageForm(prName)),
                  quantity:       Number(c[8]?.v ?? 0),
                  unit_price:     Number(c[9]?.v ?? 0),
                  bonus_quantity: Number(c[10]?.v ?? 0),
                  line_total:     Number(c[11]?.v ?? 0),
                  total_invoice:  Number(c[12]?.v ?? 0),
                  rep_name:       String(c[13]?.v ?? ''),
                  status:         String(c[14]?.v ?? ''),
                  timestamp:      String(c[15]?.f ?? c[15]?.v ?? '')
                });
              } else {
                // التنسيق القديم (14 عمود)
                const phName = String(c[3]?.v ?? '');
                const prName = String(c[5]?.v ?? '');
                rows.push({
                  invoice_number: String(c[0]?.v ?? ''),
                  invoice_date:   String(c[1]?.f ?? c[1]?.v ?? ''),
                  warehouse_name: String(c[2]?.v ?? ''),
                  pharmacy_name:  phName,
                  area:           detectAreaFromName(phName) || 'مركز المدينة',
                  city:           String(c[4]?.v ?? 'بغداد'),
                  product_name:   prName,
                  dosage_form:    detectDosageForm(prName),
                  quantity:       Number(c[6]?.v ?? 0),
                  unit_price:     Number(c[7]?.v ?? 0),
                  bonus_quantity: Number(c[8]?.v ?? 0),
                  line_total:     Number(c[9]?.v ?? 0),
                  total_invoice:  Number(c[10]?.v ?? 0),
                  rep_name:       String(c[11]?.v ?? ''),
                  status:         String(c[12]?.v ?? ''),
                  timestamp:      String(c[13]?.f ?? c[13]?.v ?? '')
                });
              }
            }
          }

          return {
            headers: cols.length >= 16 ? cols : this.getDefaultHeaders(),
            rows,
            rawCount: rows.length
          };
        }
      }
    } catch (gvizErr: any) {
      console.warn('GViz public read warning:', gvizErr.message);
    }

    // الطريقة الاحتياطية: قراءة السجل المحلي إذا كان متاحاً
    const cached = this.getSyncLog();
    return {
      headers: this.getDefaultHeaders(),
      rows: cached,
      rawCount: cached.length
    };
  }

  /**
   * 2. إرسال فاتورة جديدة إلى كوكل شيت بشكل منسق واحترافي
   */
  static async appendInvoice(invoice: any, customWebhook?: string, customSheetId?: string): Promise<SheetSyncResult> {
    if (!invoice.pharmacy_name && invoice.pharmacy_id) {
      try {
        const ph = await PharmacyService.findById(invoice.pharmacy_id);
        if (ph) {
          invoice.pharmacy_name = ph.name;
          invoice.pharmacy_city = ph.city;
        }
      } catch (e) {
        // ignore
      }
    }

    const rows = this.formatInvoiceToRows(invoice);
    if (rows.length === 0) {
      return { success: false, rows_count: 0, message: 'لا توجد بنود في الفاتورة لإرسالها', mode: 'local_cached', timestamp: new Date().toISOString() };
    }

    // احفظ دائماً في السجل المحلي
    this.appendSyncLog(rows);

    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    const sheetId = (customSheetId || '').trim() || this.getSheetId();

    if (!webhook) {
      console.log('ℹ️ Google Sheets Webhook URL not set yet. Data logged locally and ready for sync.');
      return {
        success: true,
        rows_count: rows.length,
        message: 'تم تسجيل بيانات الفاتورة بنجاح. أضف رابط Webhook في الإعدادات للمزامنة المباشرة الفورية مع كوكل شيت.',
        mode: 'local_cached',
        timestamp: new Date().toISOString()
      };
    }

    try {
      console.log(`🚀 Sending ${rows.length} rows to Google Sheets Webhook (${webhook.substring(0, 45)}...)...`);
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'appendRows',
          spreadsheetId: sheetId,
          sheetName: 'الفواتير',
          headers: this.getDefaultHeaders(),
          rows
        })
      });

      if (!res.ok) {
        throw new Error(`Google Webhook returned HTTP ${res.status}`);
      }

      const resText = await res.text();
      let resJson: any = null;
      try { resJson = JSON.parse(resText); } catch (e) {}

      if (resText.includes('ليس لديك إذن') || (resText.startsWith('<') && !resJson)) {
        throw new Error('رابط Webhook يتطلب صلاحية وصول. يرجى في إعدادات النشر بـ كوكل شيت جعل (من يملك حق الوصول: أي شخص Anyone) ليتمكن النظام من تحديث الشيت.');
      }

      console.log('✅ Successfully appended invoice to Google Sheet!');
      return {
        success: true,
        rows_count: rows.length,
        message: 'تم إدراج بيانات الفاتورة بنجاح في كوكل شيت بتنسيق احترافي.',
        mode: 'webhook',
        timestamp: new Date().toISOString()
      };
    } catch (e: any) {
      console.error('Google Sheets sync error:', e.message);
      return {
        success: false,
        rows_count: rows.length,
        message: `تعذر الاتصال بـ Webhook كوكل شيت: ${e.message}`,
        mode: 'local_cached',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 3. مزامنة مجموعة فواتير دفعة واحدة إلى كوكل شيت
   */
  static async syncBatchInvoices(invoices: any[], customWebhook?: string, customSheetId?: string): Promise<SheetSyncResult> {
    const allRows: SheetRow[] = [];
    for (const inv of invoices) {
      allRows.push(...this.formatInvoiceToRows(inv));
    }

    if (allRows.length === 0) {
      return { success: false, rows_count: 0, message: 'لا توجد فواتير للمزامنة', mode: 'local_cached', timestamp: new Date().toISOString() };
    }

    this.appendSyncLog(allRows);

    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    const sheetId = (customSheetId || '').trim() || this.getSheetId();

    if (!webhook) {
      return {
        success: true,
        rows_count: allRows.length,
        message: `تم تجهيز ${allRows.length} سطراً. يرجى تفعيل رابط Webhook للإرسال المباشر.`,
        mode: 'local_cached',
        timestamp: new Date().toISOString()
      };
    }

    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batchAppend',
          spreadsheetId: sheetId,
          sheetName: 'الفواتير',
          headers: this.getDefaultHeaders(),
          rows: allRows
        })
      });

      const resText = await res.text();
      let resJson: any = null;
      try { resJson = JSON.parse(resText); } catch (e) {}

      if (resText.includes('ليس لديك إذن') || (resText.startsWith('<') && !resJson)) {
        throw new Error('رابط Webhook يحتاج إذن. يرجى في إعدادات النشر بـ كوكل شيت جعل (من يملك حق الوصول: أي شخص Anyone) حتى يتمكن النظام من تحديث الأعمدة والبيانات.');
      }

      return {
        success: res.ok,
        rows_count: allRows.length,
        message: res.ok ? `تم تصدير ومزامنة ${allRows.length} سطراً إلى كوكل شيت بنجاح!` : 'فشلت المزامنة',
        mode: 'webhook',
        timestamp: new Date().toISOString()
      };
    } catch (err: any) {
      return {
        success: false,
        rows_count: allRows.length,
        message: err.message,
        mode: 'local_cached',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * تحويل الفاتورة إلى أسطر جدولية منسقة
   */
  private static formatInvoiceToRows(invoice: any): SheetRow[] {
    const items = invoice.items || [];
    const nowStr = new Date().toLocaleString('ar-IQ', {
      timeZone: 'Asia/Baghdad',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    let phName = String(invoice.pharmacy_name || invoice.pharmacy?.name || '').trim();
    let phCity = String(invoice.pharmacy_city || invoice.pharmacy?.city || '').trim();
    let phArea = String(invoice.pharmacy_area || invoice.pharmacy?.area || '').trim();

    if ((!phName || phName === 'صيدلية') && invoice.pharmacy_id) {
      const phObj = pharmacies.find(p => p.id === invoice.pharmacy_id);
      if (phObj) {
        phName = phObj.name;
        if (!phCity) phCity = phObj.city;
        if (!phArea && (phObj as any).area) phArea = (phObj as any).area;
      }
    }
    if (!phName || phName === 'صيدلية') {
      phName = 'صيدلية عامة';
    }
    if (!phCity) phCity = 'بغداد';
    if (!phArea) {
      phArea = detectAreaFromName(phName) || 'مركز المدينة';
    }

    return items.map((it: any) => {
      const qty = Number(it.sold_quantity || it.quantity || 1);
      const price = Number(it.historical_unit_price || it.custom_unit_price || it.unit_price || 0);
      const bonus = Number(it.bonus_quantity || 0);
      const lineTotal = Number(it.line_total || it.total_price || (qty * price));
      const prodName = String(it.product_name_snapshot || it.custom_product_name || it.product_name || it.name || 'مستحضر دوائي').trim();
      let dosageForm = String(it.dosage_form || '').trim();
      if (!['قطرة', 'كريم', 'مرهم', 'حبوب'].includes(dosageForm)) {
        dosageForm = detectDosageForm(prodName || dosageForm);
      }

      return {
        invoice_number: String(invoice.invoice_number || '').trim(),
        invoice_date:   String(invoice.invoice_date || '').trim(),
        warehouse_name: String(invoice.warehouse_name || 'مذخر الشغف الحديث').trim(),
        pharmacy_name:  phName,
        area:           phArea,
        city:           phCity,
        product_name:   prodName,
        dosage_form:    dosageForm,
        quantity:       qty,
        unit_price:     price,
        bonus_quantity: bonus,
        line_total:     lineTotal,
        total_invoice:  Number(invoice.total_sales_amount || invoice.total_sales || invoice.total_amount || lineTotal),
        rep_name:       String(invoice.rep_name || invoice.rep?.full_name || 'مندوب علمي').trim(),
        status:         invoice.status === 'approved' ? 'معتمدة ✓' : 'قيد التدقيق',
        timestamp:      nowStr
      };
    });
  }

  /**
   * العناوين المنسقة لجدول كوكل شيت (16 عموداً شاملاً للمنطقة ونوع المادة)
   */
  static getDefaultHeaders(): string[] {
    return [
      'رقم الفاتورة',
      'تاريخ الفاتورة',
      'اسم المذخر',
      'اسم الصيدلية',
      'المنطقة / المكان',
      'المدينة / المحافظة',
      'اسم المادة الدوائية',
      'نوع المادة / الشكل الدوائي',
      'الكمية',
      'سعر المفرد (د.ع)',
      'البونص المجاني',
      'المجموع (د.ع)',
      'صافي الفاتورة الكلي (د.ع)',
      'اسم المندوب العلمي',
      'حالة الاعتماد',
      'وقت وتاريخ الإدراج'
    ];
  }

  /**
   * نص كود Google Apps Script المطور للربط والمزامنة بتنسيق قياسي موحد بدون تلوين المكررات وبدون أي تداخل
   */
  static getAppsScriptCode(): string {
    return `/**
 * كود الربط التلقائي وإصلاح الجداول لنظام مندوبي الأدوية مع كوكل شيت (16 عموداً متطابقاً)
 * يضمن:
 * 1. معالجة تداخل الأعمدة وإعادة محاذاة كافة الصفوف القديمة بشكل سليم (المنطقة ونوع المادة)
 * 2. حذف الصفوف الوهمية مثل (123)
 * 3. إزالة تلوين الفواتير المتشابهة بالكامل وجعل الخلفيات نظيفة وموحدة (#ffffff / #f8fafc)
 * 4. حفظ وتحديث الفواتير تلقائياً دون أي تكرار
 */

var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';

function getTargetSheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}
  if (!ss) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {}
  }
  if (!ss) return null;
  return ss.getSheetByName('الفواتير') || ss.getActiveSheet();
}

function setupSheet(sheet) {
  if (!sheet) {
    sheet = getTargetSheet();
  }
  if (!sheet) return;

  var headers = [
    'رقم الفاتورة',
    'تاريخ الفاتورة',
    'اسم المذخر',
    'اسم الصيدلية',
    'المنطقة / المكان',
    'المدينة / المحافظة',
    'اسم المادة الدوائية',
    'نوع المادة / الشكل الدوائي',
    'الكمية',
    'سعر المفرد (د.ع)',
    'البونص المجاني',
    'المجموع (د.ع)',
    'صافي الفاتورة الكلي (د.ع)',
    'اسم المندوب العلمي',
    'حالة الاعتماد',
    'وقت وتاريخ الإدراج'
  ];

  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headers);
  } else {
    var rawData = sheet.getDataRange().getValues();
    var cleanedData = [];
    var needsRewrite = false;

    // فحص رؤوس الأعمدة
    var currentHeaders = rawData[0];
    if (currentHeaders.length < 16 || currentHeaders[4] !== 'المنطقة / المكان' || currentHeaders[7] !== 'نوع المادة / الشكل الدوائي') {
      needsRewrite = true;
    }

    // فحص كل صف في البيانات من الصف الثاني
    for (var i = 1; i < rawData.length; i++) {
      var row = rawData[i];
      var invNum = String(row[0] || '').trim();

      // تجاهل وحذف الصفوف الفارغة أو الوهمية مثل 123
      if (!invNum || invNum === '123' || (!row[1] && !row[2] && !row[3])) {
        needsRewrite = true;
        continue;
      }

      // هل هذا السطر مزاح (Shifted من التنسيق القديم 14 عموداً)؟
      // علامة السطر المزاح: العمود 5 فيه "بغداد" والعمود 7 فيه رقم (الكمية)، أو العمود 15 و 16 فارغين والعمود 7 أو 8 رقم
      var isShifted = (String(row[4] || '').trim() === 'بغداد' && !isNaN(Number(row[6])) && Number(row[6]) > 0) ||
                      (row.length < 16) ||
                      (!row[14] && !row[15] && !isNaN(Number(row[7])));

      if (isShifted) {
        needsRewrite = true;
        var phName = String(row[3] || '').trim();
        var cityName = String(row[4] || 'بغداد').trim();
        var prName = String(row[5] || '').trim();
        var qty = Number(row[6] || 0);
        var unitPrice = Number(row[7] || 0);
        var bonus = Number(row[8] || 0);
        var lineTotal = Number(row[9] || 0);
        var totalInv = Number(row[10] || 0);
        var repName = String(row[11] || '').trim();
        var status = String(row[12] || 'قيد التدقيق').trim();
        var timestamp = String(row[13] || '').trim();

        // استنتاج المنطقة بدقة من اسم الصيدلية
        var area = 'مركز المدينة';
        var ph = phName.toLowerCase();
        if (ph.indexOf('زعفرانية') !== -1 || ph.indexOf('مطرقة') !== -1) area = 'الزعفرانية';
        else if (ph.indexOf('فلسطين') !== -1) area = 'شارع فلسطين';
        else if (ph.indexOf('كرادة') !== -1) area = 'الكرادة';
        else if (ph.indexOf('صدر') !== -1) area = 'مدينة الصدر';
        else if (ph.indexOf('منصور') !== -1) area = 'المنصور';
        else if (ph.indexOf('حارثية') !== -1) area = 'الحارثية';
        else if (ph.indexOf('دورة') !== -1) area = 'الدورة';
        else if (ph.indexOf('حبيبية') !== -1) area = 'الحبيبية';
        else if (ph.indexOf('بلديات') !== -1) area = 'البلديات';
        else if (ph.indexOf('زيونة') !== -1) area = 'زيونة';
        else if (ph.indexOf('شعب') !== -1) area = 'الشعب';
        else if (ph.indexOf('محمودية') !== -1) area = 'المحمودية';
        else if (ph.indexOf('بسماية') !== -1) area = 'بسماية';

        // استنتاج نوع المادة حصراً (قطرة، كريم، مرهم، حبوب)
        var dosage = 'حبوب';
        var pr = prName.toLowerCase();
        if (pr.indexOf('drop') !== -1 || pr.indexOf('قطرة') !== -1 || pr.indexOf('drups') !== -1 || pr.indexOf('hyfresh') !== -1 || pr.indexOf('opti') !== -1 || pr.indexOf('eye') !== -1) dosage = 'قطرة';
        else if (pr.indexOf('cream') !== -1 || pr.indexOf('كريم') !== -1 || pr.indexOf('elica') !== -1 || pr.indexOf('fucidin') !== -1) dosage = 'كريم';
        else if (pr.indexOf('oint') !== -1 || pr.indexOf('مرهم') !== -1) dosage = 'مرهم';

        var formattedDate = '';
        if (row[1]) {
          try {
            formattedDate = row[1] instanceof Date ? Utilities.formatDate(row[1], 'Asia/Baghdad', 'yyyy-MM-dd') : String(row[1]).split('T')[0];
          } catch(e) {
            formattedDate = String(row[1]).split('T')[0];
          }
        }

        cleanedData.push([
          invNum,
          formattedDate,
          String(row[2] || 'مذخر الشغف الحديث').trim(),
          phName,
          area,
          cityName || 'بغداد',
          prName,
          dosage,
          qty,
          unitPrice,
          bonus,
          lineTotal,
          totalInv,
          repName,
          status,
          timestamp
        ]);
      } else {
        // سطر مضبوط مسبقاً بـ 16 عموداً
        var fixedRow = [];
        for (var c = 0; c < 16; c++) {
          fixedRow.push(row[c] !== undefined ? row[c] : '');
        }
        cleanedData.push(fixedRow);
      }
    }

    if (needsRewrite) {
      sheet.clear();
      sheet.getRange(1, 1, 1, 16).setValues([headers]);
      if (cleanedData.length > 0) {
        sheet.getRange(2, 1, cleanedData.length, 16).setValues(cleanedData);
      }
    }
  }

  // تنسيق شريط العناوين
  var headerRange = sheet.getRange(1, 1, 1, 16);
  headerRange.setBackground('#1e3a8a');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  sheet.setRightToLeft(true);

  // تنسيق كافة الأسطر بتناوب نظيف وبدون أي تلوين للمكررات
  var finalRows = sheet.getLastRow();
  if (finalRows > 1) {
    for (var r = 2; r <= finalRows; r++) {
      var rowRange = sheet.getRange(r, 1, 1, 16);
      rowRange.setHorizontalAlignment('center');
      rowRange.setVerticalAlignment('middle');
      sheet.setRowHeight(r, 30);
      if (r % 2 === 0) {
        rowRange.setBackground('#f8fafc');
      } else {
        rowRange.setBackground('#ffffff');
      }
      rowRange.setFontColor('#0f172a');
    }
  }

  // إزالة أي قواعد تنسيق شرطي لتلوين التكرار
  try {
    sheet.clearConditionalFormatRules();
  } catch (fmtErr) {}
}

function doPost(e) {
  try {
    var sheet = getTargetSheet();
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'تعذر فتح ورقة الفواتير في كوكل شيت'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    setupSheet(sheet);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'لا توجد بيانات مرفقة بالطلب'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);

    // إذا كان الطلب لإصلاح وتحديث الشيت فقط
    if (payload.action === 'repair' || payload.action === 'setup') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'تم إصلاح وترقية وتنسيق جدول كوكل شيت بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var rows = payload.rows || [];
    var data = sheet.getDataRange().getValues();
    var addedCount = 0;
    var updatedCount = 0;

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var invNum = String(r.invoice_number || '').trim();
      if (!invNum || invNum === '123') continue;

      var rowValues = [
        invNum,
        String(r.invoice_date || '').split('T')[0],
        r.warehouse_name || 'مذخر الشغف الحديث',
        r.pharmacy_name || '',
        r.area || 'مركز المدينة',
        r.city || 'بغداد',
        r.product_name || '',
        r.dosage_form || 'حبوب',
        Number(r.quantity || 0),
        Number(r.unit_price || 0),
        Number(r.bonus_quantity || 0),
        Number(r.line_total || 0),
        Number(r.total_invoice || 0),
        r.rep_name || '',
        r.status || 'قيد التدقيق',
        r.timestamp || ''
      ];

      // البحث عن سطر موجود لنفس الفاتورة والمنتج
      var existingRowIndex = -1;
      var thisDate     = String(r.invoice_date || '').split('T')[0];
      var thisPharmacy = String(r.pharmacy_name || '').trim();
      var thisProd     = String(r.product_name || '').trim();

      for (var k = 1; k < data.length; k++) {
        var kInvNum   = String(data[k][0] || '').trim();
        var kDate     = String(data[k][1] || '').split('T')[0];
        var kPharmacy = String(data[k][3] || '').trim();
        var kProd     = String(data[k][6] || '').trim();

        if (kInvNum === invNum && kProd === thisProd) {
          existingRowIndex = k + 1;
          break;
        }
      }

      if (existingRowIndex > 1) {
        var updateRange = sheet.getRange(existingRowIndex, 1, 1, 16);
        updateRange.setValues([rowValues]);
        if (existingRowIndex % 2 === 0) {
          updateRange.setBackground('#f8fafc');
        } else {
          updateRange.setBackground('#ffffff');
        }
        updatedCount++;
      } else {
        sheet.appendRow(rowValues);
        var lastRow = sheet.getLastRow();
        var newRowRange = sheet.getRange(lastRow, 1, 1, 16);
        newRowRange.setHorizontalAlignment('center');
        newRowRange.setVerticalAlignment('middle');
        sheet.setRowHeight(lastRow, 30);

        // تنسيق موحد ونظيف بدون أي تلوين للفواتير المتشابهة أو المكررة
        if (lastRow % 2 === 0) {
          newRowRange.setBackground('#f8fafc');
        } else {
          newRowRange.setBackground('#ffffff');
        }
        newRowRange.setFontColor('#0f172a');
        addedCount++;
        data.push(rowValues);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      added: addedCount,
      updated: updatedCount,
      message: 'تم إدراج ' + addedCount + ' سطراً وتحديث ' + updatedCount + ' سطور بتنسيق موحد ونظيف.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ headers: [], rows: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    setupSheet(sheet);

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ headers: [], rows: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var invNum = String(row[0] || '').trim();
      if (!invNum || invNum === '123' || !row[3]) continue;

      var invDate = '';
      if (row[1]) {
        try {
          invDate = row[1] instanceof Date ? Utilities.formatDate(row[1], 'Asia/Baghdad', 'yyyy-MM-dd') : String(row[1]).split('T')[0];
        } catch(e) {
          invDate = String(row[1]).split('T')[0];
        }
      }

      rows.push({
        invoice_number: invNum,
        invoice_date:   invDate,
        warehouse_name: String(row[2] || ''),
        pharmacy_name:  String(row[3] || ''),
        area:           String(row[4] || ''),
        city:           String(row[5] || 'بغداد'),
        product_name:   String(row[6] || ''),
        dosage_form:    String(row[7] || ''),
        quantity:       Number(row[8] || 0),
        unit_price:     Number(row[9] || 0),
        bonus_quantity: Number(row[10] || 0),
        line_total:     Number(row[11] || 0),
        total_invoice:  Number(row[12] || 0),
        rep_name:       String(row[13] || ''),
        status:         String(row[14] || 'قيد التدقيق'),
        timestamp:      String(row[15] || '')
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      headers: headers,
      rows: rows
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// دالة لاختبار وإصلاح الجدول يدوياً وترقية الأعمدة لـ 16 عموداً ومسح التلوين وحذف 123
function testRun() {
  var sheet = getTargetSheet();
  setupSheet(sheet);
  Logger.log('تم بنجاح إصلاح الجدول وترقية كافة السطور لـ 16 عموداً متناسقاً وحذف الصفوف التالفة! عدد السطور الحالية: ' + (sheet ? sheet.getLastRow() : 0));
}`;
  }

  private static appendSyncLog(rows: SheetRow[]) {
    try {
      const dir = path.dirname(SYNC_LOG_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const current = this.getSyncLog();
      current.push(...rows);
      fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(current.slice(-500), null, 2));
    } catch (e) {
      // ignore
    }
  }

  private static getSyncLog(): SheetRow[] {
    try {
      if (fs.existsSync(SYNC_LOG_PATH)) {
        return JSON.parse(fs.readFileSync(SYNC_LOG_PATH, 'utf8'));
      }
    } catch (e) {
      // ignore
    }
    return [];
  }
}

// تهيئة الخدمة عند الإقلاع
GoogleSheetsService.init();

