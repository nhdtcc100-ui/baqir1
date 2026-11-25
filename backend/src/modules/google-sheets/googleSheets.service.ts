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
  skipped_duplicates?: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }>;
  synced_count?: number;
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
   * 1. قراءة البيانات من كوكل شيت لعرضها في الموقع (يفضل GViz لقراءة جميع الأعمدة الحقيقية بدون إزاحة)
   */
  static async readFromSheet(customSheetId?: string, customWebhook?: string): Promise<{ headers: string[]; rows: SheetRow[]; rawCount: number; reachable?: boolean }> {
    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    const targetSheetId = (customSheetId || '').trim() || this.getSheetId();

    // الطريقة الأولى: القراءة المباشرة عبر GViz JSON API لأنها تقرأ كافة الأعمدة 1..17+ بدون إزاحة
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${targetSheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent('الفواتير')}`;
      console.log('📊 Fetching data directly from public Google Sheet via GViz...');
      const res = await fetch(gvizUrl);
      if (res.ok) {
        const text = await res.text();
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
        if (jsonMatch && jsonMatch[1]) {
          const data = JSON.parse(jsonMatch[1]);
          const cols: string[] = (data.table?.cols || []).map((c: any) => String(c.label || c.id || '').trim());
          const rows: any[] = [];

          if (Array.isArray(data.table?.rows)) {
            for (const r of data.table.rows) {
              const c = r.c || [];
              if (c.length === 0) continue;
              const cells = cols.map((_, ci) => String(c[ci]?.f ?? c[ci]?.v ?? '').trim());
              const isNonEmpty = cells.some(Boolean);
              if (!isNonEmpty) continue;

              const is16Col = c.length >= 15 || cols.length >= 15;
              if (is16Col) {
                const phName = String(c[3]?.f ?? c[3]?.v ?? '').trim();
                const prName = String(c[6]?.f ?? c[6]?.v ?? '').trim();
                const rowObj: any = {
                  invoice_number: String(c[0]?.f ?? c[0]?.v ?? '').trim(),
                  invoice_date:   String(c[1]?.f ?? c[1]?.v ?? '').trim(),
                  warehouse_name: String(c[2]?.f ?? c[2]?.v ?? '').trim(),
                  pharmacy_name:  phName,
                  area:           String((c[4]?.f ?? c[4]?.v ?? '') || detectAreaFromName(phName) || 'مركز المدينة').trim(),
                  city:           String(c[5]?.f ?? c[5]?.v ?? 'بغداد').trim(),
                  product_name:   prName,
                  dosage_form:    String((c[7]?.f ?? c[7]?.v ?? '') || detectDosageForm(prName)).trim(),
                  quantity:       Number(c[8]?.v ?? 0),
                  unit_price:     Number(c[9]?.v ?? 0),
                  bonus_quantity: Number(c[10]?.v ?? 0),
                  line_total:     Number(c[11]?.v ?? 0),
                  total_invoice:  Number(c[12]?.v ?? 0),
                  rep_name:       String(c[13]?.f ?? c[13]?.v ?? '').trim(),
                  status:         String(c[14]?.f ?? c[14]?.v ?? '').trim(),
                  timestamp:      String(c[15]?.f ?? c[15]?.v ?? '').trim(),
                  cells
                };
                if (cols.length > 16) {
                  const extra: Record<string, string> = {};
                  for (let xi = 16; xi < cols.length; xi++) {
                    extra[cols[xi] || `col_${xi + 1}`] = cells[xi] || '';
                  }
                  rowObj.extra_columns = extra;
                }
                rows.push(rowObj);
              } else {
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
                  timestamp:      String(c[13]?.f ?? c[13]?.v ?? ''),
                  cells
                });
              }
            }
          }

          return {
            headers: cols.length >= 16 ? cols : this.getDefaultHeaders(),
            rows,
            rawCount: rows.length,
            reachable: true
          };
        }
      }
    } catch (gvizErr: any) {
      console.warn('GViz public read warning:', gvizErr.message);
    }

    // الطريقة الثانية الاحتياطية: Webhook GET إذا لم يُقرأ الشيت عبر GViz
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
              rawCount: mappedRows.length,
              reachable: true
            };
          }
        }
      } catch (err: any) {
        console.warn('Google Apps Script GET failed:', err.message);
      }
    }

    // الطريقة الاحتياطية: قراءة السجل المحلي إذا كان متاحاً
    const cached = this.getSyncLog();
    return {
      headers: this.getDefaultHeaders(),
      rows: cached,
      rawCount: cached.length,
      reachable: false
    };
  }

  /**
   * 1 ب. تسجيل/ترحيل مستخدم إلى جدول المستخدمون في كوكل شيت
   */
  static async pushUsersToAdminSheet(
    users: Array<{
      id: string;
      full_name: string;
      email: string;
      password_hash: string;
      role: string;
      is_active?: boolean;
      gemini_api_key?: string;
      sheet_id?: string;
      webhook_url?: string;
      area?: string;
      created_at?: string;
    }>,
    mode: 'register_user' | 'seed_users' = 'register_user',
    customWebhook?: string
  ): Promise<{ success: boolean; message: string }> {
    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    if (!webhook) {
      return { success: false, message: 'لا يوجد رابط Apps Script Webhook مفعّل لحفظ المستخدم في الشيت.' };
    }
    try {
      await this.postToWebhook({
        action: mode,
        adminSpreadsheetId: ENV.ADMIN_SHEET_ID,
        spreadsheetId: ENV.ADMIN_SHEET_ID,
        user: users[0],
        users
      }, webhook);
      return { success: true, message: 'تم تسجيل المستخدم في جدول كوكل شيت بنجاح.' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'تعذر الاتصال بـ Apps Script لشيت المستخدمين' };
    }
  }

  private static async postToWebhook(payload: Record<string, any>, customWebhook?: string): Promise<void> {
    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    if (!webhook) return;
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Google Webhook returned HTTP ${res.status}`);
    }
    const resText = await res.text();
    let resJson: any = null;
    try { resJson = JSON.parse(resText); } catch (e) {}
    if (resText.includes('ليس لديك إذن') || (resText.startsWith('<') && !resJson)) {
      throw new Error('رابط Webhook يتطلب صلاحية وصول (Anyone).');
    }
  }

  private static normalizeAr(raw: string): string {
    return String(raw || '')
      .toLowerCase()
      .replace(/[\u064B-\u0652\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static normalizePharmacy(raw: string): string {
    return this.normalizeAr(raw).replace(/^(صيدلية|صيدليه|مذخر|ص\.?)\s+/gi, '').trim();
  }

  private static normalizeProductKey(raw: string): string {
    return this.normalizeAr(raw).replace(/[^a-z0-9\u0621-\u064a]/gi, '');
  }

  private static normalizeDateYmd(raw: string): string {
    const s = String(raw || '').trim();
    if (!s) return '';
    const iso = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
    const gviz = s.match(/^Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/);
    if (gviz) return `${gviz[1]}-${String(Number(gviz[2]) + 1).padStart(2, '0')}-${gviz[3].padStart(2, '0')}`;
    const us = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (us) {
      const p1 = Number(us[1]);
      const p2 = Number(us[2]);
      const m = p1 > 12 ? p2 : p1;
      const d = p1 > 12 ? p1 : p2;
      return `${us[3]}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return s.split('T')[0];
  }

  private static findSheetDuplicateMatch(invoice: any, sheetRows: SheetRow[]): { isDuplicate: boolean; isExactMatch: boolean; reason: string } {
    const phName = this.normalizePharmacy(invoice.pharmacy_name || '');
    const invDate = this.normalizeDateYmd(invoice.invoice_date || '');
    const items = invoice.items || [];
    const statusText = invoice.status === 'approved' ? 'معتمدة ✓' : invoice.status === 'rejected' ? 'مرفوضة' : 'قيد التدقيق';
    const normItems = items
      .map((it: any) => ({
        prod: this.normalizeProductKey(it.product_name_snapshot || it.custom_product_name || it.product_name || it.name || ''),
        qty: Math.round(Number(it.sold_quantity ?? it.quantity ?? 0))
      }))
      .filter((x: any) => x.prod.length > 0)
      .sort((a: any, b: any) => (a.prod !== b.prod ? a.prod.localeCompare(b.prod) : a.qty - b.qty));

    if (!phName || !invDate || normItems.length === 0) {
      return { isDuplicate: false, isExactMatch: false, reason: '' };
    }

    const itemsSig = `${normItems.length}::${normItems.map((x: any) => `${x.prod}:${x.qty}`).join('|')}`;
    const invNum = String(invoice.invoice_number || '').trim();

    // Group existing sheet rows by logical invoice submission so multi-item invoices compare as complete units
    const groups = new Map<string, SheetRow[]>();
    for (const r of sheetRows) {
      const gKey = `${String(r.invoice_number || r.pharmacy_name).trim()}::${this.normalizeDateYmd(r.invoice_date)}::${String(r.timestamp || '').trim()}`;
      if (!groups.has(gKey)) groups.set(gKey, []);
      groups.get(gKey)!.push(r);
    }

    for (const exRows of groups.values()) {
      const exPh = this.normalizePharmacy(exRows[0]?.pharmacy_name || '');
      const exDate = this.normalizeDateYmd(exRows[0]?.invoice_date || '');
      if (exPh !== phName || exDate !== invDate) continue;

      const exNormItems = exRows
        .map(x => ({ prod: this.normalizeProductKey(x.product_name || ''), qty: Math.round(Number(x.quantity || 0)) }))
        .filter(x => x.prod.length > 0)
        .sort((a, b) => (a.prod !== b.prod ? a.prod.localeCompare(b.prod) : a.qty - b.qty));

      const exSig = `${exNormItems.length}::${exNormItems.map(x => `${x.prod}:${x.qty}`).join('|')}`;
      if (exSig === itemsSig) {
        const exNum = String(exRows[0]?.invoice_number || '').trim();
        const exStatus = String(exRows[0]?.status || '').trim();
        const statusChanged = Boolean(invNum && exNum === invNum && exStatus.replace(' ✓', '') !== statusText.replace(' ✓', ''));
        if (!statusChanged) {
          return {
            isDuplicate: true,
            isExactMatch: invNum === exNum,
            reason: `نفس الفاتورة (${exRows[0]?.pharmacy_name} / ${invDate} — ${normItems.length} أصناف) موجودة مسبقاً${exNum ? ` برقم (${exNum})` : ''}`
          };
        }
      }
    }

    return { isDuplicate: false, isExactMatch: false, reason: '' };
  }

  /**
   * 2. إرسال فاتورة جديدة إلى كوكل شيت (يتخطى تلقائياً إذا كانت مكررة في الشيت)
   */
  static async appendInvoice(invoice: any, customWebhook?: string, customSheetId?: string): Promise<SheetSyncResult> {
    try {
      const current = await this.readFromSheet(customSheetId, customWebhook);
      const dupCheck = this.findSheetDuplicateMatch(invoice, current.rows || []);
      if (dupCheck.isDuplicate) {
        return {
          success: true,
          rows_count: 0,
          synced_count: 0,
          message: dupCheck.reason,
          mode: 'gviz',
          timestamp: new Date().toISOString(),
          skipped_duplicates: [{
            invoice_number: String(invoice.invoice_number || 'بدون رقم'),
            pharmacy_name: String(invoice.pharmacy_name || ''),
            invoice_date: String(invoice.invoice_date || '').split('T')[0],
            reason: dupCheck.reason
          }]
        };
      }
    } catch { /* fallback to send if read failed */ }
    return this.dispatchInvoiceSync('add_invoice', invoice, undefined, customWebhook, customSheetId);
  }

  /**
   * 2 ب. استبدال أو تحديث فاتورة في كوكل شيت في نفس صفها (عند التعديل أو الاعتماد أو حذف صنف)
   */
  static async replaceInvoice(
    invoice: any,
    previousInvoiceNumber?: string,
    customWebhook?: string,
    customSheetId?: string
  ): Promise<SheetSyncResult> {
    return this.dispatchInvoiceSync('edit_invoice', invoice, previousInvoiceNumber, customWebhook, customSheetId);
  }

  private static async dispatchInvoiceSync(
    action: 'add_invoice' | 'edit_invoice',
    invoice: any,
    previousInvoiceNumber?: string,
    customWebhook?: string,
    customSheetId?: string
  ): Promise<SheetSyncResult> {
    if (!invoice.pharmacy_name && invoice.pharmacy_id) {
      try {
        const ph = await PharmacyService.findById(invoice.pharmacy_id);
        if (ph) {
          invoice.pharmacy_name = ph.name;
          invoice.pharmacy_city = ph.city;
          if (!invoice.pharmacy_area && (ph as any).area) invoice.pharmacy_area = (ph as any).area;
        }
      } catch { /* ignore */ }
    }

    const rows = this.formatInvoiceToRows(invoice);
    if (rows.length === 0) {
      return { success: false, rows_count: 0, message: 'لا توجد بنود في الفاتورة لإرسالها', mode: 'local_cached', timestamp: new Date().toISOString() };
    }

    this.appendSyncLog(rows);

    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    const sheetId = (customSheetId || '').trim() || this.getSheetId();
    if (!webhook) {
      return {
        success: true,
        rows_count: rows.length,
        message: 'تم تسجيل بيانات الفاتورة محلياً. أضف رابط Webhook للمزامنة الفورية.',
        mode: 'local_cached',
        timestamp: new Date().toISOString()
      };
    }

    try {
      await this.postToWebhook({
        action,
        spreadsheetId: sheetId,
        sheetName: 'الفواتير',
        headers: this.getDefaultHeaders(),
        invoice_number: String(invoice.invoice_number || '').trim(),
        previous_invoice_number: previousInvoiceNumber ? String(previousInvoiceNumber).trim() : undefined,
        pharmacy_name: String(invoice.pharmacy_name || '').trim(),
        invoice_date: String(invoice.invoice_date || '').split('T')[0],
        rows
      }, webhook);
      return {
        success: true,
        rows_count: rows.length,
        message: action === 'edit_invoice' ? 'تمت مزامنة وتحديث الفاتورة في نفس الصف بنجاح.' : 'تمت إضافة الفاتورة إلى كوكل شيت بنجاح.',
        mode: 'webhook',
        timestamp: new Date().toISOString()
      };
    } catch (e: any) {
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
   * 2 ج. حذف جميع أسطر فاتورة من كوكل شيت عند حذفها من النظام
   */
  static async deleteInvoiceRows(invoiceNumber: string, customWebhook?: string, customSheetId?: string): Promise<SheetSyncResult> {
    const cleanNum = String(invoiceNumber || '').trim();
    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    const sheetId = (customSheetId || '').trim() || this.getSheetId();
    if (!webhook || !cleanNum) {
      return { success: false, rows_count: 0, message: 'غير متصل بـ Webhook', mode: 'local_cached', timestamp: new Date().toISOString() };
    }
    try {
      await this.postToWebhook({
        action: 'delete_invoice',
        spreadsheetId: sheetId,
        sheetName: 'الفواتير',
        invoice_number: cleanNum
      }, webhook);
      return {
        success: true,
        rows_count: 1,
        message: `تم حذف الفاتورة ${cleanNum} من كوكل شيت`,
        mode: 'webhook',
        timestamp: new Date().toISOString()
      };
    } catch (e: any) {
      return { success: false, rows_count: 0, message: e.message, mode: 'local_cached', timestamp: new Date().toISOString() };
    }
  }

  /**
   * 3. مزامنة مجموعة فواتير دفعة واحدة إلى كوكل شيت مع تخطي المكررات فقط
   */
  static async syncBatchInvoices(
    invoices: any[],
    customWebhook?: string,
    customSheetId?: string,
    opts?: { skipExistingDuplicates?: boolean }
  ): Promise<SheetSyncResult> {
    let sheetRows: SheetRow[] = [];
    if (opts?.skipExistingDuplicates !== false) {
      try {
        const current = await this.readFromSheet(customSheetId, customWebhook);
        sheetRows = current.rows || [];
      } catch { /* ignore */ }
    }

    const skipped: Array<{ invoice_number: string; pharmacy_name: string; invoice_date: string; reason: string }> = [];
    const seenBatchSig = new Set<string>();
    const toUpload: any[] = [];

    for (const inv of invoices) {
      const ph = String(inv.pharmacy_name || '').trim().toLowerCase().replace(/^(صيدلية|صيدليه|مذخر|ص)\s*/gi, '');
      const dt = String(inv.invoice_date || '').split('T')[0];
      const batchSig = `${ph}::${dt}::${(inv.items || []).map((x: any) => `${x.product_name_snapshot || ''}:${x.sold_quantity}`).sort().join('|')}`;
      if (ph && seenBatchSig.has(batchSig)) {
        skipped.push({ invoice_number: String(inv.invoice_number || ''), pharmacy_name: String(inv.pharmacy_name || ''), invoice_date: dt, reason: 'نسخة مكررة داخل الدفعة الحالية' });
        continue;
      }
      if (ph) seenBatchSig.add(batchSig);

      const dup = this.findSheetDuplicateMatch(inv, sheetRows);
      if (dup.isDuplicate) {
        skipped.push({ invoice_number: String(inv.invoice_number || ''), pharmacy_name: String(inv.pharmacy_name || ''), invoice_date: dt, reason: dup.reason });
        continue;
      }
      toUpload.push(inv);
    }

    const allRows: SheetRow[] = [];
    for (const inv of toUpload) {
      allRows.push(...this.formatInvoiceToRows(inv));
    }

    if (allRows.length === 0) {
      return {
        success: true,
        rows_count: 0,
        synced_count: 0,
        skipped_duplicates: skipped,
        message: skipped.length > 0
          ? `تم تخطي ${skipped.length} فاتورة متطابقة/مكررة موجودة مسبقاً في كوكل شيت دون إعادة رفع.`
          : 'لا توجد فواتير جديدة للمزامنة.',
        mode: 'gviz',
        timestamp: new Date().toISOString()
      };
    }

    this.appendSyncLog(allRows);

    const webhook = (customWebhook || '').trim() || this.getWebhookUrl();
    const sheetId = (customSheetId || '').trim() || this.getSheetId();

    if (!webhook) {
      return {
        success: true,
        rows_count: allRows.length,
        synced_count: toUpload.length,
        skipped_duplicates: skipped,
        message: `تم تجهيز ${allRows.length} سطراً (وتخطي ${skipped.length} مكررة). يرجى تفعيل رابط Webhook للإرسال المباشر.`,
        mode: 'local_cached',
        timestamp: new Date().toISOString()
      };
    }

    try {
      await this.postToWebhook({
        action: 'batchAppend',
        spreadsheetId: sheetId,
        sheetName: 'الفواتير',
        headers: this.getDefaultHeaders(),
        rows: allRows
      }, webhook);
      return {
        success: true,
        rows_count: allRows.length,
        synced_count: toUpload.length,
        skipped_duplicates: skipped,
        message: skipped.length > 0
          ? `تمت مزامنة ${toUpload.length} فاتورة (${allRows.length} سطراً) وتخطي ${skipped.length} مكررة فقط.`
          : `تم تصدير ومزامنة ${allRows.length} سطراً إلى كوكل شيت بنجاح!`
        ,
        mode: 'webhook',
        timestamp: new Date().toISOString()
      };
    } catch (err: any) {
      return {
        success: false,
        rows_count: allRows.length,
        skipped_duplicates: skipped,
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
   * نص كود Google Apps Script المطور للربط والمزامنة (الإصدار 4: قاعدة بيانات المستخدمين على كوكل شيت + تعدد قواعد البيانات + الفصل بين الإضافة والتعديل + تلوين الأحمر والأبيض)
   */
  static getAppsScriptCode(): string {
    return `/**
 * كود الربط التلقائي وإصلاح الجداول لنظام مندوبي الأدوية مع كوكل شيت (الإصدار 4)
 */

var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var ADMIN_USERS_SHEET_ID = '1RI7QKGakHvDzPkL_ACaF152i44-wc3IGrTIYT_HeLAU';
var SCRIPT_VERSION = 4;

function getTargetSpreadsheet(customSpreadsheetId) {
  var targetId = String(customSpreadsheetId || '').trim();
  if (targetId && targetId !== SPREADSHEET_ID) {
    try {
      var opened = SpreadsheetApp.openById(targetId);
      if (opened) return opened;
    } catch (e) {}
  }
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e2) {}
  try {
    return SpreadsheetApp.openById(targetId || SPREADSHEET_ID);
  } catch (e3) {}
  return null;
}

function getTargetSheet(customSpreadsheetId, preferredSheetName) {
  var ss = getTargetSpreadsheet(customSpreadsheetId);
  if (!ss) return null;
  var name = preferredSheetName || 'الفواتير';
  return ss.getSheetByName(name) || (name === 'الفواتير' ? ss.getActiveSheet() : null);
}

function getOrCreateUsersSheet(adminSpreadsheetId) {
  var targetId = String(adminSpreadsheetId || ADMIN_USERS_SHEET_ID).trim();
  var ss = null;
  if (targetId) {
    try { ss = SpreadsheetApp.openById(targetId); } catch (e) {}
  }
  if (!ss) ss = getTargetSpreadsheet('');
  if (!ss) return null;
  var sheet = ss.getSheetByName('المستخدمون');
  if (!sheet) sheet = ss.insertSheet('المستخدمون');
  var userHeaders = ['id', 'full_name', 'email', 'password_hash', 'role', 'is_active', 'gemini_api_key', 'sheet_id', 'webhook_url', 'area', 'created_at'];
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(userHeaders);
    sheet.getRange(1, 1, 1, userHeaders.length).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  } else {
    var row1 = sheet.getRange(1, 1, 1, Math.max(9, sheet.getLastColumn())).getValues()[0];
    if (String(row1[0] || '').trim() !== 'A' && String(row1[0] || '').trim().toLowerCase() !== 'id') {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, userHeaders.length).setValues([userHeaders]).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
    }
  }
  return sheet;
}

function getUsersHeaderRowIndex(data) {
  for (var r = 0; r < Math.min(3, data.length); r++) {
    var c0 = String(data[r][0] || '').trim().toLowerCase();
    var c2 = String(data[r][2] || '').trim().toLowerCase();
    if (c0 === 'id' || c2 === 'email') return r;
  }
  return 0;
}

function readAllSheetUsers(sheet) {
  if (!sheet || sheet.getLastRow() === 0) return [];
  var data = sheet.getDataRange().getValues();
  var headerIdx = getUsersHeaderRowIndex(data);
  var users = [];
  for (var i = headerIdx + 1; i < data.length; i++) {
    var row = data[i];
    var idVal = String(row[0] || '').trim();
    var fullName = String(row[1] || '').trim();
    var email = String(row[2] || '').trim().toLowerCase();
    if (!email && !idVal) continue;
    if (idVal.toLowerCase() === 'a' || idVal.toLowerCase() === 'id' || email === 'email') continue;
    users.push({
      id: idVal || ('usr-' + i), full_name: fullName || email.split('@')[0], email: email,
      password_hash: String(row[3] || '').trim(), role: String(row[4] || 'medical_rep').trim().toLowerCase(),
      is_active: String(row[5] === undefined ? 'TRUE' : row[5]).trim().toUpperCase() !== 'FALSE',
      gemini_api_key: String(row[6] || '').trim(), sheet_id: String(row[7] || '').trim(),
      webhook_url: String(row[8] || '').trim(), area: String(row[9] || '').trim(), created_at: String(row[10] || '').trim()
    });
  }
  return users;
}

function getExpectedCols(sheet) {
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
  if (sheet && sheet.getLastRow() > 0 && sheet.getLastColumn() > 16) {
    var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    for (var c = 16; c < existing.length; c++) {
      var label = String(existing[c] || '').trim();
      headers.push(label || ('عمود ' + (c + 1)));
    }
  }
  return headers;
}

function normAr(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\\u064B-\\u0652\\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\\s+/g, ' ')
    .trim();
}

function normPh(s) {
  return normAr(s).replace(/^(صيدلية|صيدليه|مذخر|ص\\.?)\\s+/gi, '').trim();
}

function normProd(s) {
  return normAr(s).replace(/[^a-z0-9\\u0621-\\u064a]/gi, '');
}

function formatYmd(val) {
  if (!val) return '';
  if (val instanceof Date) {
    try { return Utilities.formatDate(val, 'Asia/Baghdad', 'yyyy-MM-dd'); } catch (e) {}
  }
  var s = String(val).trim();
  var m = s.match(/^(\\d{4})[-/](\\d{1,2})[-/](\\d{1,2})/);
  if (m) return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  var us = s.match(/^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{4})$/);
  if (us) {
    var p1 = Number(us[1]), p2 = Number(us[2]);
    var mo = p1 > 12 ? p2 : p1;
    var dy = p1 > 12 ? p1 : p2;
    return us[3] + '-' + ('0' + mo).slice(-2) + '-' + ('0' + dy).slice(-2);
  }
  return s.split('T')[0];
}

function detectDosage(name) {
  var p = String(name || '').toLowerCase();
  if (p.indexOf('drop') !== -1 || p.indexOf('قطرة') !== -1 || p.indexOf('drups') !== -1 || p.indexOf('hyfresh') !== -1 || p.indexOf('loxtra') !== -1) return 'قطرة';
  if (p.indexOf('cream') !== -1 || p.indexOf('كريم') !== -1 || p.indexOf('elica') !== -1 || p.indexOf('fucidin') !== -1) return 'كريم';
  if (p.indexOf('oint') !== -1 || p.indexOf('مرهم') !== -1) return 'مرهم';
  return 'حبوب';
}

function detectAreaFromPh(phName) {
  var s = normAr(phName);
  var areas = [
    ['فلسطين', 'شارع فلسطين'], ['كراده', 'الكرادة'], ['منصور', 'المنصور'],
    ['زعفرانيه', 'الزعفرانية'], ['مدينة الصدر', 'مدينة الصدر'], ['مدينه الصدر', 'مدينة الصدر'],
    ['اعظميه', 'الأعظمية'], ['كاظميه', 'الكاظمية'], ['دوره', 'الدورة'],
    ['بياع', 'البياع'], ['عامريه', 'العامرية'], ['غزاليه', 'الغزالية'],
    ['شعب', 'الشعب'], ['زيونه', 'زيونة'], ['بغداد الجديده', 'بغداد الجديدة'],
    ['جادرية', 'الجادرية'], ['جادريه', 'الجادرية'], ['حارثيه', 'الحارثية']
  ];
  for (var i = 0; i < areas.length; i++) {
    if (s.indexOf(areas[i][0]) !== -1) return areas[i][1];
  }
  return 'مركز المدينة';
}

function isShiftedOldRow(row) {
  var c4 = String(row[4] || '').trim();
  var c5 = String(row[5] || '').trim();
  var c6Num = Number(row[6]);
  var c13 = String(row[13] || '').trim();
  var c14 = String(row[14] || '').trim();
  if (row.length < 16) return true;
  if ((c4 === 'بغداد' || c4 === 'البصرة' || c4 === 'أربيل' || c4 === 'النجف' || c4 === 'كربلاء') && !isNaN(c6Num) && c6Num > 0 && c5 !== '') return true;
  if (c13 && c13.indexOf(':') !== -1 && !c14 && !String(row[15] || '').trim()) return true;
  return false;
}

function resolveColMap(headers) {
  var map = {
    invoice_number: 0, invoice_date: 1, warehouse_name: 2, pharmacy_name: 3,
    area: 4, city: 5, product_name: 6, dosage_form: 7,
    quantity: 8, unit_price: 9, bonus_quantity: 10, line_total: 11,
    total_invoice: 12, rep_name: 13, status: 14, timestamp: 15, loyalty: 16
  };
  for (var c = 0; c < headers.length; c++) {
    var h = normAr(headers[c]);
    if (!h) continue;
    if (h.indexOf('رقم الفاتور') !== -1) map.invoice_number = c;
    else if (h.indexOf('تاريخ الفاتور') !== -1) map.invoice_date = c;
    else if (h.indexOf('المذخر') !== -1) map.warehouse_name = c;
    else if (h.indexOf('اسم الصيدلي') !== -1) map.pharmacy_name = c;
    else if (h.indexOf('المنطق') !== -1 || h.indexOf('المكان') !== -1) map.area = c;
    else if (h.indexOf('المدين') !== -1 || h.indexOf('المحافظ') !== -1) map.city = c;
    else if (h.indexOf('اسم الماد') !== -1 || h.indexOf('الماده الدوائي') !== -1) map.product_name = c;
    else if (h.indexOf('نوع الماد') !== -1 || h.indexOf('الشكل الدوائي') !== -1) map.dosage_form = c;
    else if (h === 'الكميه' || h.indexOf('الكمي') !== -1) map.quantity = c;
    else if (h.indexOf('سعر المفرد') !== -1) map.unit_price = c;
    else if (h.indexOf('البونص') !== -1) map.bonus_quantity = c;
    else if (h.indexOf('صافي الفاتور') !== -1) map.total_invoice = c;
    else if (h.indexOf('المجموع') !== -1) map.line_total = c;
    else if (h.indexOf('المندوب') !== -1) map.rep_name = c;
    else if (h.indexOf('حاله الاعتماد') !== -1 || h.indexOf('الحال') !== -1) map.status = c;
    else if (h.indexOf('وقت وتاريخ') !== -1 || h.indexOf('الادراج') !== -1) map.timestamp = c;
    else if (h.indexOf('الولاء') !== -1) map.loyalty = c;
  }
  return map;
}

function buildRowValuesByHeaders(r, headers, existingRow) {
  var totalCols = headers.length;
  var vals = [];
  for (var c = 0; c < totalCols; c++) {
    vals.push(existingRow && existingRow[c] !== undefined ? existingRow[c] : '');
  }
  var colMap = resolveColMap(headers);
  var invNum = String(r.invoice_number || '').trim();
  var phName = String(r.pharmacy_name || (existingRow ? existingRow[colMap.pharmacy_name] : '') || '').trim();
  var resolvedArea = String(r.area || r.pharmacy_area || '').trim();
  if (!resolvedArea && existingRow) {
    var oldArea = String(existingRow[colMap.area] || '').trim();
    if (oldArea && oldArea !== 'بغداد') resolvedArea = oldArea;
  }
  if (!resolvedArea) resolvedArea = detectAreaFromPh(phName);
  var prodName = String(r.product_name || (existingRow ? existingRow[colMap.product_name] : '') || '').trim();
  var repName = String(r.rep_name || (existingRow ? existingRow[colMap.rep_name] : '') || 'علي حسن (مندوب بغداد)').trim();

  vals[colMap.invoice_number] = invNum;
  vals[colMap.invoice_date]   = formatYmd(r.invoice_date);
  vals[colMap.warehouse_name] = r.warehouse_name || (existingRow ? existingRow[colMap.warehouse_name] : '') || 'مذخر الشغف الحديث';
  vals[colMap.pharmacy_name]  = phName;
  vals[colMap.area]           = resolvedArea;
  vals[colMap.city]           = r.city || r.pharmacy_city || (existingRow ? existingRow[colMap.city] : '') || 'بغداد';
  vals[colMap.product_name]   = prodName;
  vals[colMap.dosage_form]    = r.dosage_form || detectDosage(prodName);
  vals[colMap.quantity]       = Number(r.quantity || 0);
  vals[colMap.unit_price]     = Number(r.unit_price || 0);
  vals[colMap.bonus_quantity] = Number(r.bonus_quantity || 0);
  vals[colMap.line_total]     = Number(r.line_total || 0);
  vals[colMap.total_invoice]  = Number(r.total_invoice || 0);
  vals[colMap.rep_name]       = repName;
  vals[colMap.status]         = r.status || (existingRow ? existingRow[colMap.status] : '') || 'قيد التدقيق';
  vals[colMap.timestamp]      = r.timestamp || (existingRow ? existingRow[colMap.timestamp] : '') || '';
  if (colMap.loyalty < totalCols && r.loyalty !== undefined && r.loyalty !== '') {
    vals[colMap.loyalty] = r.loyalty;
  }
  return vals;
}

function setupSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet) return;
  var headers = getExpectedCols(sheet);
  var totalCols = headers.length;
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headers);
  } else {
    var rawData = sheet.getDataRange().getValues();
    var cleanedData = [];
    var needsRewrite = false;
    var currentHeaders = rawData[0];
    if (currentHeaders.length < 16 || String(currentHeaders[4] || '').trim() !== 'المنطقة / المكان' || String(currentHeaders[7] || '').trim() !== 'نوع المادة / الشكل الدوائي') {
      needsRewrite = true;
    }
    for (var i = 1; i < rawData.length; i++) {
      var row = rawData[i];
      var invNum = String(row[0] || '').trim();
      var phNameCheck = String(row[3] || '').trim();
      if (invNum === '123' || (!invNum && !phNameCheck && !row[6])) { needsRewrite = true; continue; }
      if (isShiftedOldRow(row)) {
        needsRewrite = true;
        var phName = String(row[3] || '').trim();
        var cityName = String(row[4] || 'بغداد').trim();
        var prName = String(row[5] || '').trim();
        var qtyVal = Number(row[6] || 0);
        var priceVal = Number(row[7] || 0);
        var bonusVal = Number(row[8] || 0);
        var lineTotalVal = Number(row[9] || (qtyVal * priceVal));
        var totalInvVal = Number(row[10] || lineTotalVal);
        var maybeRep = String(row[11] || '').trim();
        var maybeStatus = String(row[12] || '').trim();
        var maybeTs = String(row[13] || '').trim();
        if (!maybeRep && maybeTs) maybeRep = 'علي حسن (مندوب الرصافة)';
        if (!maybeStatus) maybeStatus = 'قيد التدقيق';
        var rebuilt = [invNum, formatYmd(row[1]), String(row[2] || '').trim(), phName, detectAreaFromPh(phName), cityName || 'بغداد', prName, detectDosage(prName), qtyVal, priceVal, bonusVal, lineTotalVal, totalInvVal, maybeRep, maybeStatus, maybeTs];
        while (rebuilt.length < totalCols) rebuilt.push(row[rebuilt.length] !== undefined ? row[rebuilt.length] : '');
        cleanedData.push(rebuilt);
      } else {
        var fixedRow = [];
        for (var c = 0; c < totalCols; c++) fixedRow.push(row[c] !== undefined ? row[c] : '');
        cleanedData.push(fixedRow);
      }
    }
    if (needsRewrite) {
      sheet.clear();
      sheet.getRange(1, 1, 1, totalCols).setValues([headers]);
      if (cleanedData.length > 0) sheet.getRange(2, 1, cleanedData.length, totalCols).setValues(cleanedData);
    }
  }
  var headerRange = sheet.getRange(1, 1, 1, totalCols);
  headerRange.setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  sheet.setRightToLeft(true);
  try {
    sheet.clearConditionalFormatRules();
    highlightDuplicatesInSheet(sheet);
    sheet.autoResizeColumns(1, totalCols);
  } catch (fmtErr) {}
}

function highlightDuplicatesInSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet) return;
  var lastRow = sheet.getLastRow();
  var totalCols = Math.max(16, sheet.getLastColumn());
  if (lastRow <= 1) return;
  var headers = sheet.getRange(1, 1, 1, totalCols).getValues()[0];
  var colMap = resolveColMap(headers);
  var data = sheet.getRange(2, 1, lastRow - 1, totalCols).getValues();
  var groups = {};
  var groupOrder = [];
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var invNum = String(row[colMap.invoice_number] || '').trim();
    var dt = formatYmd(row[colMap.invoice_date]);
    var ph = normPh(row[colMap.pharmacy_name]);
    var prod = normProd(row[colMap.product_name]);
    var qty = Math.round(Number(row[colMap.quantity] || 0));
    var ts = String(row[colMap.timestamp] || '').trim();
    if (!ph && !prod) continue;
    var gKey = (invNum || ph) + '::' + dt + '::' + ts;
    if (!groups[gKey]) { groups[gKey] = { ph: ph, dt: dt, items: [], rows: [] }; groupOrder.push(gKey); }
    if (prod) groups[gKey].items.push(prod + ':' + qty);
    groups[gKey].rows.push(i + 2);
  }
  var bySignature = {};
  for (var g = 0; g < groupOrder.length; g++) {
    var grp = groups[groupOrder[g]];
    if (!grp.ph || !grp.dt || grp.items.length === 0) continue;
    grp.items.sort();
    var sig = grp.ph + '||' + grp.dt + '||' + grp.items.length + '||' + grp.items.join('|');
    if (!bySignature[sig]) bySignature[sig] = [];
    bySignature[sig].push(grp);
  }
  var dupRowMap = {};
  for (var sigKey in bySignature) {
    if (bySignature[sigKey].length > 1) {
      var copies = bySignature[sigKey];
      for (var c = 0; c < copies.length; c++) {
        for (var rIdx = 0; rIdx < copies[c].rows.length; rIdx++) dupRowMap[copies[c].rows[rIdx]] = true;
      }
    }
  }
  for (var sheetRow = 2; sheetRow <= lastRow; sheetRow++) {
    var rng = sheet.getRange(sheetRow, 1, 1, totalCols);
    rng.setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    if (dupRowMap[sheetRow]) rng.setBackground('#fee2e2').setFontColor('#991b1b');
    else rng.setBackground('#ffffff').setFontColor('#0f172a');
  }
}

function deleteMatchingInvoiceRows(sheet, targetInvNum, deleteMode, targetPh, targetDate, targetTs) {
  var headers = sheet.getRange(1, 1, 1, Math.max(16, sheet.getLastColumn())).getValues()[0];
  var colMap = resolveColMap(headers);
  var cleanTarget = String(targetInvNum || '').trim();
  var cleanPh = normPh(targetPh || '');
  var cleanDate = formatYmd(targetDate || '');
  var data = sheet.getDataRange().getValues();
  var deleted = 0;
  var matches = function(row) {
    var rNum = String(row[colMap.invoice_number] || '').trim();
    if (cleanTarget && rNum === cleanTarget) return true;
    if (!cleanTarget && cleanPh && cleanDate) return normPh(row[colMap.pharmacy_name]) === cleanPh && formatYmd(row[colMap.invoice_date]) === cleanDate;
    return false;
  };
  var firstTs = targetTs || null;
  if (deleteMode === 'duplicate_copy' && !firstTs) {
    for (var f = 1; f < data.length; f++) { if (matches(data[f])) { firstTs = String(data[f][colMap.timestamp] || ''); break; } }
  }
  for (var i = data.length - 1; i >= 1; i--) {
    if (!matches(data[i])) continue;
    if (deleteMode === 'duplicate_copy') {
      if (targetTs) { if (String(data[i][colMap.timestamp] || '').trim() !== String(targetTs).trim()) continue; }
      else if (String(data[i][colMap.timestamp] || '') === String(firstTs || '')) continue;
    }
    sheet.deleteRow(i + 1);
    deleted++;
  }
  return deleted;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

    if (actionName === 'register_user' || actionName === 'upsert_user' || actionName === 'seed_users') {
      var usersSheet = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheet) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح ورقة المستخدمون' })).setMimeType(ContentService.MimeType.JSON);
      var incomingUsers = payload.users || (payload.user ? [payload.user] : []);
      var currentUsers = readAllSheetUsers(usersSheet);
      var inserted = 0;
      for (var ui = 0; ui < incomingUsers.length; ui++) {
        var u = incomingUsers[ui];
        var uEmail = String(u.email || '').trim().toLowerCase();
        var uName = String(u.full_name || '').trim();
        if (!uEmail) continue;
        var dupUser = false;
        for (var exi = 0; exi < currentUsers.length; exi++) {
          if (currentUsers[exi].email === uEmail) { dupUser = true; break; }
        }
        if (dupUser) {
          if (actionName === 'register_user') return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'البريد أو اسم المستخدم مسجل بالفعل في جدول المستخدمين' })).setMimeType(ContentService.MimeType.JSON);
          continue;
        }
        usersSheet.appendRow([
          u.id || ('usr-' + new Date().getTime() + '-' + ui),
          uName || uEmail.split('@')[0],
          uEmail,
          String(u.password_hash || '').trim(),
          u.role || 'medical_rep',
          u.is_active === false ? 'FALSE' : 'TRUE',
          String(u.gemini_api_key || '').trim(),
          String(u.sheet_id || '').trim(),
          String(u.webhook_url || '').trim(),
          String(u.area || '').trim(),
          u.created_at || new Date().toISOString()
        ]);
        currentUsers.push({ email: uEmail });
        inserted++;
      }
      try { usersSheet.autoResizeColumns(1, 11); } catch (ue) {}
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, inserted: inserted, message: 'تم حفظ بيانات المستخدم في جدول المستخدمون بنجاح.' })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(payload.spreadsheetId, payload.sheetName || 'الفواتير');
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح ورقة الفواتير في كوكل شيت' })).setMimeType(ContentService.MimeType.JSON);
    setupSheet(sheet);
    if (actionName === 'repair' || actionName === 'setup') {
      highlightDuplicatesInSheet(sheet);
      try { sheet.autoResizeColumns(1, Math.max(16, sheet.getLastColumn())); } catch (errR) {}
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, message: 'تم إصلاح الأعمدة المزاحة وفحص وتلوين التكرار في كوكل شيت بنجاح!' })).setMimeType(ContentService.MimeType.JSON);
    }
    if (actionName === 'delete_invoice') {
      var delInv = payload.invoice_number || (payload.row && payload.row.invoice_number);
      var delCount = deleteMatchingInvoiceRows(sheet, delInv, payload.delete_mode, payload.pharmacy_name, payload.invoice_date, payload.timestamp);
      highlightDuplicatesInSheet(sheet);
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, deleted: delCount, message: 'تم حذف ' + delCount + ' سطر من كوكل شيت وإعادة ضبط الألوان' })).setMimeType(ContentService.MimeType.JSON);
    }
    var headers = getExpectedCols(sheet);
    var totalCols = headers.length;
    var colMap = resolveColMap(headers);
    var rows = payload.rows || [];
    var data = sheet.getDataRange().getValues();
    var addedCount = 0;
    var updatedCount = 0;

    if (actionName === 'edit_invoice' || actionName === 'replace_invoice') {
      var matchNums = {};
      if (payload.previous_invoice_number) matchNums[String(payload.previous_invoice_number).trim()] = true;
      if (payload.invoice_number) matchNums[String(payload.invoice_number).trim()] = true;
      var existingIndices = [];
      for (var m = 1; m < data.length; m++) {
        var rNum = String(data[m][colMap.invoice_number] || '').trim();
        if (rNum && matchNums[rNum]) existingIndices.push(m + 1);
      }
      if (existingIndices.length === 0 && payload.pharmacy_name && payload.invoice_date) {
        var targetPhN = normPh(payload.pharmacy_name);
        var targetDtY = formatYmd(payload.invoice_date);
        for (var m2 = 1; m2 < data.length; m2++) {
          if (normPh(data[m2][colMap.pharmacy_name]) === targetPhN && formatYmd(data[m2][colMap.invoice_date]) === targetDtY) existingIndices.push(m2 + 1);
        }
      }
      var validEditRows = [];
      for (var vr = 0; vr < rows.length; vr++) {
        if (String(rows[vr].invoice_number || '').trim() !== '123') validEditRows.push(rows[vr]);
      }
      if (existingIndices.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true, script_version: SCRIPT_VERSION, added: 0, updated: 0,
          message: 'وضع التعديل: لم يتم إنشاء صف جديد لعدم العثور على الصف الأصلي في الشيت.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var common = Math.min(existingIndices.length, validEditRows.length);
      for (var u = 0; u < common; u++) {
        var sheetRowNum = existingIndices[u];
        var newVals = buildRowValuesByHeaders(validEditRows[u], headers, data[sheetRowNum - 1]);
        sheet.getRange(sheetRowNum, 1, 1, totalCols).setValues([newVals]);
        updatedCount++;
      }
      if (validEditRows.length > existingIndices.length) {
        var insertAfter = existingIndices[existingIndices.length - 1];
        for (var a = common; a < validEditRows.length; a++) {
          var insVals = buildRowValuesByHeaders(validEditRows[a], headers, null);
          sheet.insertRowAfter(insertAfter);
          insertAfter++;
          sheet.getRange(insertAfter, 1, 1, totalCols).setValues([insVals]);
          addedCount++;
        }
      } else if (existingIndices.length > validEditRows.length) {
        for (var d = existingIndices.length - 1; d >= validEditRows.length; d--) sheet.deleteRow(existingIndices[d]);
      }
      highlightDuplicatesInSheet(sheet);
      try { sheet.autoResizeColumns(1, totalCols); } catch (re1) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
        message: 'تم تعديل الفاتورة في نفس الصف (' + updatedCount + ' تحديث، ' + addedCount + ' بند إضافي).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var invNum = String(r.invoice_number || '').trim();
      var phN = normPh(r.pharmacy_name || '');
      if (invNum === '123' || (!invNum && !phN)) continue;
      var addVals = buildRowValuesByHeaders(r, headers, null);
      sheet.appendRow(addVals);
      addedCount++;
      data.push(addVals);
    }
    highlightDuplicatesInSheet(sheet);
    try { sheet.autoResizeColumns(1, totalCols); } catch (resizeErr) {}
    return ContentService.createTextOutput(JSON.stringify({
      success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
      message: 'تم إدراج ' + addedCount + ' سطراً جديداً بترتيب الأعمدة الكامل بنجاح.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    var sheet = getTargetSheet();
    if (sheet && sheet.getName() !== 'المستخدمون') highlightDuplicatesInSheet(sheet);
  } catch (err) {}
}

function doGet(e) {
  try {
    var action = e && e.parameter ? (e.parameter.action || e.parameter.sheet || '') : '';
    var customId = e && e.parameter ? (e.parameter.spreadsheetId || '') : '';
    if (action === 'users' || action === 'المستخدمون') {
      var uSheet = getOrCreateUsersSheet(e && e.parameter ? (e.parameter.adminSpreadsheetId || customId) : '');
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, users: readAllSheetUsers(uSheet) })).setMimeType(ContentService.MimeType.JSON);
    }
    var sheet = getTargetSheet(customId, 'الفواتير');
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: data[0] || [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    var headers = data[0];
    var colMap = resolveColMap(headers);
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var invNum = String(row[colMap.invoice_number] || '').trim();
      var phName = String(row[colMap.pharmacy_name] || '').trim();
      if (invNum === '123' || (!invNum && !phName && !row[colMap.product_name])) continue;
      var invDate = formatYmd(row[colMap.invoice_date]);
      var cells = [];
      for (var c = 0; c < headers.length; c++) {
        if (c === colMap.invoice_date) cells.push(invDate);
        else cells.push(row[c] !== undefined && row[c] !== null ? String(row[c]) : '');
      }
      rows.push({
        invoice_number: invNum, invoice_date: invDate,
        warehouse_name: String(row[colMap.warehouse_name] || ''), pharmacy_name: phName,
        area: String(row[colMap.area] || ''), city: String(row[colMap.city] || 'بغداد'),
        product_name: String(row[colMap.product_name] || ''), dosage_form: String(row[colMap.dosage_form] || ''),
        quantity: Number(row[colMap.quantity] || 0), unit_price: Number(row[colMap.unit_price] || 0),
        bonus_quantity: Number(row[colMap.bonus_quantity] || 0), line_total: Number(row[colMap.line_total] || 0),
        total_invoice: Number(row[colMap.total_invoice] || 0), rep_name: String(row[colMap.rep_name] || ''),
        status: String(row[colMap.status] || 'قيد التدقيق'), timestamp: String(row[colMap.timestamp] || ''),
        loyalty: colMap.loyalty < headers.length ? String(row[colMap.loyalty] || '') : '',
        cells: cells
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, headers: headers, rows: rows })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testRun() {
  var sheet = getTargetSheet();
  setupSheet(sheet);
  Logger.log('تم ترقية وتنسيق وفحص التكرار للشيت بنجاح (v' + SCRIPT_VERSION + '): ' + (sheet ? sheet.getLastRow() : 0));
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

