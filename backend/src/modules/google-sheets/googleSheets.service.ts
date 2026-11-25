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
          const rawCols: string[] = (data.table?.cols || []).map((c: any) => String(c.label || '').trim());
          const rawGvizRows: any[] = Array.isArray(data.table?.rows) ? data.table.rows : [];
          let cols = rawCols;
          let startIdx = 0;

          if (!cols.some(Boolean) && rawGvizRows.length > 0) {
            const row0 = (rawGvizRows[0]?.c || []).map((cell: any) => String(cell?.f ?? cell?.v ?? '').trim());
            if (row0.some((h: string) => h.includes('رقم الفاتورة') || h.includes('اسم الصيدلية') || h.includes('الكمية'))) {
              cols = row0;
              startIdx = 1;
            }
          }
          if (!cols.some(Boolean)) {
            cols = (data.table?.cols || []).map((c: any) => String(c.label || c.id || '').trim());
          }

          const normH = cols.map(h => h.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'));
          const findCol = (pats: string[], fb: number) => {
            const idx = normH.findIndex(h => h && pats.some(p => h.includes(p)));
            return idx >= 0 ? idx : fb;
          };
          const areaColIdx = normH.findIndex(h => h && (h.includes('المنطق') || h.includes('المكان')));
          const cityColIdx = normH.findIndex(h => h && (h.includes('المدين') || h.includes('المحافظ')));
          const dosageColIdx = normH.findIndex(h => h && (h.includes('نوع الماد') || h.includes('الشكل الدوائي')));
          const has16Schema = areaColIdx >= 0 && dosageColIdx >= 0;

          const colIdx = {
            invoice_number: findCol(['رقم الفاتور'], 0),
            invoice_date: findCol(['تاريخ الفاتور'], 1),
            warehouse_name: findCol(['المذخر'], 2),
            pharmacy_name: findCol(['اسم الصيدلي'], 3),
            city: cityColIdx >= 0 ? cityColIdx : 4,
            area: areaColIdx >= 0 ? areaColIdx : -1,
            product_name: findCol(['اسم الماد', 'الماده الدوائي'], has16Schema ? 6 : 5),
            dosage_form: dosageColIdx >= 0 ? dosageColIdx : -1,
            quantity: findCol(['الكمي'], has16Schema ? 8 : 6),
            unit_price: findCol(['سعر المفرد'], has16Schema ? 9 : 7),
            bonus_quantity: findCol(['البونص'], has16Schema ? 10 : 8),
            line_total: findCol(['المجموع'], has16Schema ? 11 : 9),
            total_invoice: findCol(['صافي الفاتور'], has16Schema ? 12 : 10),
            rep_name: findCol(['المندوب'], has16Schema ? 13 : 11),
            status: findCol(['حاله الاعتماد', 'الحال'], has16Schema ? 14 : 12),
            timestamp: findCol(['وقت وتاريخ', 'الادراج'], has16Schema ? 15 : 13)
          };

          const rows: any[] = [];
          for (let ri = startIdx; ri < rawGvizRows.length; ri++) {
            const c = rawGvizRows[ri]?.c || [];
            if (c.length === 0) continue;
            const cells = cols.map((_, ci) => String(c[ci]?.f ?? c[ci]?.v ?? '').trim());
            if (!cells.some(Boolean)) continue;
            const val = (i: number) => (i >= 0 ? String(c[i]?.f ?? c[i]?.v ?? '').trim() : '');
            const invNum = val(colIdx.invoice_number);
            const phName = val(colIdx.pharmacy_name);
            const prName = val(colIdx.product_name);
            if (invNum === 'رقم الفاتورة' || phName === 'اسم الصيدلية' || invNum === '123') continue;
            if (!invNum && !phName && !prName) continue;

            const rawArea = colIdx.area >= 0 ? val(colIdx.area) : '';
            const rawDosage = colIdx.dosage_form >= 0 ? val(colIdx.dosage_form) : '';
            const rowObj: any = {
              invoice_number: invNum,
              invoice_date: val(colIdx.invoice_date),
              warehouse_name: val(colIdx.warehouse_name),
              pharmacy_name: phName,
              city: val(colIdx.city) || 'بغداد',
              area: rawArea || detectAreaFromName(phName) || 'مركز المدينة',
              product_name: prName,
              dosage_form: rawDosage || detectDosageForm(prName),
              quantity: Number(c[colIdx.quantity]?.v ?? 0),
              unit_price: Number(c[colIdx.unit_price]?.v ?? 0),
              bonus_quantity: Number(c[colIdx.bonus_quantity]?.v ?? 0),
              line_total: Number(c[colIdx.line_total]?.v ?? 0),
              total_invoice: Number(c[colIdx.total_invoice]?.v ?? 0),
              rep_name: val(colIdx.rep_name),
              status: val(colIdx.status),
              timestamp: val(colIdx.timestamp),
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
                invoice_date: String(r.invoice_date || '').trim(),
                warehouse_name: String(r.warehouse_name || '').trim(),
                pharmacy_name: phName,
                area: String(r.area || detectAreaFromName(phName) || 'مركز المدينة').trim(),
                city: String(r.city || 'بغداد').trim(),
                product_name: prName,
                dosage_form: String(r.dosage_form || detectDosageForm(prName)).trim(),
                quantity: Number(r.quantity || 0),
                unit_price: Number(r.unit_price || 0),
                bonus_quantity: Number(r.bonus_quantity || 0),
                line_total: Number(r.line_total || 0),
                total_invoice: Number(r.total_invoice || 0),
                rep_name: String(r.rep_name || '').trim(),
                status: String(r.status || '').trim(),
                timestamp: String(r.timestamp || '').trim()
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
   * 1 ب. إدارة المستخدمين في الشيت الرئيسي (إضافة، تعديل الاسم/الرمز، حذف) عبر Webhook
   */
  static async manageAdminSheetUser(
    action: 'add_user' | 'register_user' | 'update_user' | 'delete_user' | 'seed_users' | 'set_shared_gemini_key',
    payload: Record<string, any>,
    customWebhook?: string
  ): Promise<{ success: boolean; message: string }> {
    const webhook = (customWebhook || '').trim() || ENV.ADMIN_WEBHOOK_URL || this.getWebhookUrl();
    if (!webhook) {
      return { success: false, message: 'لا يوجد رابط Apps Script Webhook مفعّل لحفظ تعديلات الشيت الرئيسي.' };
    }
    try {
      await this.postToWebhook({
        action,
        adminSpreadsheetId: ENV.ADMIN_SHEET_ID,
        spreadsheetId: ENV.ADMIN_SHEET_ID,
        ...payload
      }, webhook);
      return { success: true, message: 'تم تنفيذ التعديل على الشيت الرئيسي بنجاح.' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'تعذر الاتصال بـ Apps Script للشيت الرئيسي' };
    }
  }

  /**
   * 1 ج. تسجيل/ترحيل مستخدم إلى جدول المستخدمون في كوكل شيت
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
      sheet_url?: string;
      webhook_url?: string;
      area?: string;
      created_at?: string;
    }>,
    mode: 'register_user' | 'add_user' | 'seed_users' = 'register_user',
    customWebhook?: string
  ): Promise<{ success: boolean; message: string }> {
    return this.manageAdminSheetUser(mode, { user: users[0], users }, customWebhook);
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
    try { resJson = JSON.parse(resText); } catch (e) { }
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

  public static findSheetDuplicateMatch(invoice: any, sheetRows: SheetRow[]): { isDuplicate: boolean; isExactMatch: boolean; reason: string } {
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

    // Group existing sheet rows by logical invoice submission (and split identical copies that share a timestamp)
    const buckets = new Map<string, SheetRow[]>();
    for (const r of sheetRows) {
      const gKey = `${String(r.invoice_number || r.pharmacy_name).trim()}::${this.normalizeDateYmd(r.invoice_date)}::${String(r.timestamp || '').trim()}`;
      if (!buckets.has(gKey)) buckets.set(gKey, []);
      buckets.get(gKey)!.push(r);
    }

    const logicalCopies: SheetRow[][] = [];
    for (const entries of buckets.values()) {
      let block: SheetRow[] = [];
      let seen = new Set<string>();
      for (const r of entries) {
        const pk = `${this.normalizeProductKey(r.product_name || '')}:${Math.round(Number(r.quantity || 0))}`;
        if (pk && pk !== ':0' && seen.has(pk) && block.length > 0) {
          logicalCopies.push(block);
          block = [];
          seen = new Set<string>();
        }
        block.push(r);
        if (pk && pk !== ':0') seen.add(pk);
      }
      if (block.length > 0) logicalCopies.push(block);
    }

    for (const exRows of logicalCopies) {
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
   * 2 ج. حذف جميع أسطر فاتورة أو نسخة مكررة فقط من كوكل شيت عند حذفها من النظام
   */
  static async deleteInvoiceRows(
    invoiceNumber: string,
    customWebhook?: string,
    customSheetId?: string,
    opts?: { deleteMode?: 'all' | 'duplicate_copy'; pharmacyName?: string; invoiceDate?: string }
  ): Promise<SheetSyncResult> {
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
        invoice_number: cleanNum,
        delete_mode: opts?.deleteMode || 'all',
        pharmacy_name: opts?.pharmacyName,
        invoice_date: opts?.invoiceDate ? String(opts.invoiceDate).split('T')[0] : undefined
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
        invoice_date: String(invoice.invoice_date || '').trim(),
        warehouse_name: String(invoice.warehouse_name || 'مذخر الشغف الحديث').trim(),
        pharmacy_name: phName,
        area: phArea,
        city: phCity,
        product_name: prodName,
        dosage_form: dosageForm,
        quantity: qty,
        unit_price: price,
        bonus_quantity: bonus,
        line_total: lineTotal,
        total_invoice: Number(invoice.total_sales_amount || invoice.total_sales || invoice.total_amount || lineTotal),
        rep_name: String(invoice.rep_name || invoice.rep?.full_name || 'مندوب علمي').trim(),
        status: invoice.status === 'approved' ? 'معتمدة ✓' : 'قيد التدقيق',
        timestamp: nowStr
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
      'المدينة / المحافظة',
      'المنطقة / المكان',
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
   * نص كود Google Apps Script المطور للربط والمزامنة (الإصدار 7: ترتيب المدينة ثم المنطقة + إصلاح الجداول 14/16 تلقائياً + حماية الأصلية + تعدد قواعد البيانات)
   */
  static getAppsScriptCode(): string {
    return `/**
 * كود الربط التلقائي وإصلاح الجداول لنظام مندوبي الأدوية مع كوكل شيت (الإصدار 7)
 */

var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var ADMIN_USERS_SHEET_ID = '1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI';
var SCRIPT_VERSION = 8;

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

function isUsersSheetObj(sheet) {
  if (!sheet) return false;
  try {
    var parentId = sheet.getParent().getId();
    if (parentId === ADMIN_USERS_SHEET_ID) return true;
  } catch (e) {}
  var name = String(sheet.getName() || '').trim();
  if (name === 'المستخدمون' || name.toLowerCase() === 'users') return true;
  try {
    if (sheet.getLastRow() > 0) {
      var row1 = sheet.getRange(1, 1, 1, Math.min(4, Math.max(1, sheet.getLastColumn()))).getValues()[0];
      var a = normAr(row1[0]);
      var b = normAr(row1[1]);
      if ((a.indexOf('الاسم') !== -1 && b.indexOf('الرمز') !== -1) || (a === 'id' && b.indexOf('full_name') !== -1)) {
        return true;
      }
    }
  } catch (e2) {}
  return false;
}

function getTargetSheet(customSpreadsheetId, preferredSheetName) {
  var ss = getTargetSpreadsheet(customSpreadsheetId);
  if (!ss) return null;
  var name = preferredSheetName || 'الفواتير';
  var chosen = ss.getSheetByName(name) || (name === 'الفواتير' ? ss.getActiveSheet() : null);
  if (chosen && isUsersSheetObj(chosen) && name === 'الفواتير') {
    var invSheet = ss.getSheetByName('الفواتير');
    if (invSheet && !isUsersSheetObj(invSheet)) return invSheet;
    return null;
  }
  return chosen;
}

function getOrCreateUsersSheet(adminSpreadsheetId) {
  var targetId = String(adminSpreadsheetId || ADMIN_USERS_SHEET_ID).trim();
  var ss = null;
  if (targetId) {
    try { ss = SpreadsheetApp.openById(targetId); } catch (e) {}
  }
  if (!ss) ss = getTargetSpreadsheet('');
  if (!ss) return null;
  var allSheets = ss.getSheets();
  for (var s = 0; s < allSheets.length; s++) {
    var cand = allSheets[s];
    if (cand.getLastRow() > 0) {
      var r1 = cand.getRange(1, 1, 1, Math.min(4, Math.max(1, cand.getLastColumn()))).getValues()[0];
      var c0 = normAr(r1[0]);
      var c1 = normAr(r1[1]);
      if (c0.indexOf('الاسم') !== -1 || c1.indexOf('الرمز') !== -1 || c0 === 'id') {
        return cand;
      }
    }
  }
  var sheet = ss.getSheetByName('المستخدمون') || ss.getSheets()[0];
  if (!sheet) sheet = ss.insertSheet('المستخدمون');
  if (sheet.getLastRow() === 0) {
    var masterHeaders = ['الاسم', 'الرمز السري', 'صفحة كوكل شيت', 'اي بي اي سكربت', 'اي بي اي جمناي'];
    sheet.appendRow(masterHeaders);
    sheet.getRange(1, 1, 1, masterHeaders.length).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  }
  return sheet;
}

function resolveUserColMap(headers) {
  var norm = [];
  for (var i = 0; i < headers.length; i++) norm.push(normAr(headers[i]));
  var findIdx = function(patterns) {
    for (var c = 0; c < norm.length; c++) {
      if (!norm[c]) continue;
      for (var p = 0; p < patterns.length; p++) {
        if (norm[c].indexOf(patterns[p]) !== -1) return c;
      }
    }
    return -1;
  };
  var isLegacy = norm[0] === 'id' || (norm[0] && norm[0].indexOf('معرف') !== -1);
  if (!isLegacy) {
    return {
      isLegacy: false,
      nameCol: findIdx(['الاسم', 'full_name', 'name']) >= 0 ? findIdx(['الاسم', 'full_name', 'name']) : 0,
      passCol: findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) >= 0 ? findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) : 1,
      sheetCol: findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) >= 0 ? findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) : 2,
      webhookCol: findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) >= 0 ? findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) : 3,
      emailCol: findIdx(['email', 'بريد', 'username']),
      idCol: findIdx(['معرف']),
      roleCol: findIdx(['role', 'دور', 'صلاحيه']),
      activeCol: findIdx(['is_active', 'الحاله']),
      geminiCol: findIdx(['اي بي اي جمناي', 'مفتاح جمناي', 'جمناي', 'gemini', 'مفتاح'])
    };
  }
  return {
    isLegacy: true, idCol: 0, nameCol: 1, emailCol: 2, passCol: 3,
    roleCol: 4, activeCol: 5, geminiCol: 6, sheetCol: 7, webhookCol: 8
  };
}

function isBaqerName(name, email) {
  var n = normAr(name).replace(/^(د\\.|دكتور)\\s+/i, '').trim();
  var e = String(email || '').trim().toLowerCase();
  return n === 'باقر' || n === 'باقر علي' || n.indexOf('باقر ') === 0 || n === 'baqer' || n === 'baqir' || e === 'baqer@pharma.com' || e === 'admin@pharma.com';
}

function readAllSheetUsers(sheet) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var uMap = resolveUserColMap(data[0] || []);
  var users = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var fullName = String(row[uMap.nameCol] || '').trim();
    var emailVal = uMap.emailCol >= 0 ? String(row[uMap.emailCol] || '').trim().toLowerCase() : '';
    var idVal = uMap.idCol >= 0 ? String(row[uMap.idCol] || '').trim() : '';
    if (!fullName && !emailVal) continue;
    var nCheck = normAr(fullName);
    if (nCheck === 'الاسم' || nCheck === 'full_name' || idVal.toLowerCase() === 'id') continue;
    var activeRaw = uMap.activeCol >= 0 ? String(row[uMap.activeCol] === undefined ? 'TRUE' : row[uMap.activeCol]).trim().toUpperCase() : 'TRUE';
    if (activeRaw === 'FALSE' || activeRaw === '0' || activeRaw === 'معطل') continue;
    users.push({
      rowNumber: i + 1,
      id: idVal || ('sheet-usr-' + (i + 1)),
      full_name: fullName || emailVal.split('@')[0],
      email: emailVal || (fullName.toLowerCase().replace(/\\s+/g, '_') + '@pharma.com'),
      password_hash: String(row[uMap.passCol] || '').trim(),
      role: isBaqerName(fullName, emailVal) ? 'admin' : 'medical_rep',
      is_active: true,
      gemini_api_key: uMap.geminiCol >= 0 ? String(row[uMap.geminiCol] || '').trim() : '',
      sheet_id: String(row[uMap.sheetCol] || '').trim(),
      webhook_url: String(row[uMap.webhookCol] || '').trim()
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
    'المدينة / المحافظة',
    'المنطقة / المكان',
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
    ['زعفرانيه', 'الزعفرانية'], ['مدينة الصدر', 'مدينة الصدر'], ['مدينه الصدر', 'مدينة الصدر'], ['صدر', 'مدينة الصدر'],
    ['اعظميه', 'الأعظمية'], ['كاظميه', 'الكاظمية'], ['دوره', 'الدورة'],
    ['بياع', 'البياع'], ['عامريه', 'العامرية'], ['غزاليه', 'الغزالية'],
    ['شعب', 'الشعب'], ['زيونه', 'زيونة'], ['بغداد الجديده', 'بغداد الجديدة'],
    ['جادرية', 'الجادرية'], ['جادريه', 'الجادرية'], ['حارثيه', 'الحارثية'],
    ['سيديه', 'السيدية'], ['بلديات', 'البلديات'], ['حبيبيه', 'الحبيبية'],
    ['يرموك', 'اليرموك'], ['جامعه', 'حي الجامعة'], ['حي اور', 'حي أور'],
    ['مشتل', 'المشتل'], ['غدير', 'الغدير'], ['خضراء', 'حي الخضراء'],
    ['قاهره', 'القاهرة'], ['صليخ', 'الصليخ'], ['شعله', 'الشعلة'],
    ['بسمايه', 'بسماية'], ['محموديه', 'المحمودية'], ['مدائن', 'المدائن'],
    ['ابو غريب', 'أبو غريب'], ['طارميه', 'الطارمية'], ['كرخ', 'الكرخ'], ['رصافه', 'الرصافة']
  ];
  for (var i = 0; i < areas.length; i++) {
    if (s.indexOf(areas[i][0]) !== -1) return areas[i][1];
  }
  var slashMatch = String(phName || '').match(/[\\/-]\\s*([^\\n\\r\\/-]{3,25})$/);
  if (slashMatch && slashMatch[1] && slashMatch[1].trim().length >= 3) return slashMatch[1].trim();
  return 'مركز المدينة';
}

function isKnownCityName(val) {
  var v = normAr(val);
  var cities = ['بغداد', 'البصره', 'اربيل', 'النجف', 'كربلاء', 'الموصل', 'نينوى', 'بابل', 'الحله', 'كركوك', 'ديالى', 'الانبار', 'واسط', 'ذي قار', 'ميسان', 'المثنى', 'القادسيه', 'الديوانيه', 'صلاح الدين', 'دهوك', 'السليمانيه'];
  for (var i = 0; i < cities.length; i++) {
    if (v === cities[i]) return true;
  }
  return false;
}

function isShiftedOldRow(row) {
  var c4 = String(row[4] || '').trim();
  var c5 = String(row[5] || '').trim();
  var c6Num = Number(row[6]);
  var c13 = String(row[13] || '').trim();
  var c14 = String(row[14] || '').trim();
  if (row.length < 16) return true;
  if (c5 !== '' && !isNaN(c6Num) && c6Num > 0 && c13 && c13.indexOf(':') !== -1 && !c14 && !String(row[15] || '').trim()) return true;
  if (isKnownCityName(c4) && !isNaN(c6Num) && c6Num > 0 && c5 !== '' && isNaN(Number(c5)) && !c14 && !String(row[15] || '').trim()) return true;
  return false;
}

function resolveColMap(headers) {
  var hasArea = false;
  var hasDosage = false;
  for (var k = 0; k < headers.length; k++) {
    var hk = normAr(headers[k]);
    if (hk.indexOf('المنطق') !== -1 || hk.indexOf('المكان') !== -1) hasArea = true;
    if (hk.indexOf('نوع الماد') !== -1 || hk.indexOf('الشكل الدوائي') !== -1) hasDosage = true;
  }
  var map = {
    invoice_number: 0, invoice_date: 1, warehouse_name: 2, pharmacy_name: 3,
    city: 4,
    area: hasArea ? 5 : -1,
    product_name: hasArea ? 6 : 5,
    dosage_form: hasDosage ? 7 : -1,
    quantity: (hasArea && hasDosage) ? 8 : 6,
    unit_price: (hasArea && hasDosage) ? 9 : 7,
    bonus_quantity: (hasArea && hasDosage) ? 10 : 8,
    line_total: (hasArea && hasDosage) ? 11 : 9,
    total_invoice: (hasArea && hasDosage) ? 12 : 10,
    rep_name: (hasArea && hasDosage) ? 13 : 11,
    status: (hasArea && hasDosage) ? 14 : 12,
    timestamp: (hasArea && hasDosage) ? 15 : 13,
    loyalty: (hasArea && hasDosage) ? 16 : 14
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
  var resolvedCity = String(r.city || r.pharmacy_city || (existingRow && colMap.city >= 0 ? existingRow[colMap.city] : '') || 'بغداد').trim();
  var resolvedArea = String(r.area || r.pharmacy_area || '').trim();
  if (!resolvedArea && existingRow && colMap.area >= 0) {
    var oldArea = String(existingRow[colMap.area] || '').trim();
    if (oldArea && !isKnownCityName(oldArea)) resolvedArea = oldArea;
  }
  if (!resolvedArea || resolvedArea === 'مركز المدينة') {
    var guessed = detectAreaFromPh(phName);
    if (!resolvedArea || (guessed && guessed !== 'مركز المدينة')) resolvedArea = guessed;
  }
  var prodName = String(r.product_name || (existingRow ? existingRow[colMap.product_name] : '') || '').trim();
  var repName = String(r.rep_name || (existingRow ? existingRow[colMap.rep_name] : '') || 'مندوب علمي').trim();

  vals[colMap.invoice_number] = invNum;
  vals[colMap.invoice_date]   = formatYmd(r.invoice_date);
  vals[colMap.warehouse_name] = r.warehouse_name || (existingRow ? existingRow[colMap.warehouse_name] : '') || 'مذخر الشغف الحديث';
  vals[colMap.pharmacy_name]  = phName;
  if (colMap.city >= 0) vals[colMap.city] = resolvedCity || 'بغداد';
  if (colMap.area >= 0) vals[colMap.area] = resolvedArea;
  vals[colMap.product_name]   = prodName;
  if (colMap.dosage_form >= 0) vals[colMap.dosage_form] = r.dosage_form || detectDosage(prodName);
  vals[colMap.quantity]       = Number(r.quantity || 0);
  vals[colMap.unit_price]     = Number(r.unit_price || 0);
  vals[colMap.bonus_quantity] = Number(r.bonus_quantity || 0);
  vals[colMap.line_total]     = Number(r.line_total || 0);
  vals[colMap.total_invoice]  = Number(r.total_invoice || 0);
  vals[colMap.rep_name]       = repName;
  vals[colMap.status]         = r.status || (existingRow ? existingRow[colMap.status] : '') || 'قيد التدقيق';
  vals[colMap.timestamp]      = r.timestamp || (existingRow ? existingRow[colMap.timestamp] : '') || '';
  if (colMap.loyalty >= 0 && colMap.loyalty < totalCols && r.loyalty !== undefined && r.loyalty !== '') {
    vals[colMap.loyalty] = r.loyalty;
  }
  return vals;
}

function setupSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet)) return;
  var headers = getExpectedCols(sheet);
  var totalCols = headers.length;
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headers);
  } else {
    var rawData = sheet.getDataRange().getValues();
    var cleanedData = [];
    var needsRewrite = false;
    var currentHeaders = rawData[0] || [];
    var oldMap = resolveColMap(currentHeaders);
    if (
      currentHeaders.length < 16 ||
      String(currentHeaders[4] || '').trim() !== 'المدينة / المحافظة' ||
      String(currentHeaders[5] || '').trim() !== 'المنطقة / المكان' ||
      String(currentHeaders[7] || '').trim() !== 'نوع المادة / الشكل الدوائي'
    ) {
      needsRewrite = true;
    }
    for (var i = 1; i < rawData.length; i++) {
      var row = rawData[i];
      var invNum = String(row[oldMap.invoice_number] !== undefined ? row[oldMap.invoice_number] : (row[0] || '')).trim();
      var phNameCheck = String(row[oldMap.pharmacy_name] !== undefined ? row[oldMap.pharmacy_name] : (row[3] || '')).trim();
      if (invNum === '123' || (!invNum && !phNameCheck && !row[oldMap.product_name])) { needsRewrite = true; continue; }
      if (oldMap.area >= 0 && isShiftedOldRow(row)) {
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
        if (!maybeRep && maybeTs) maybeRep = 'مندوب علمي';
        if (!maybeStatus) maybeStatus = 'قيد التدقيق';
        var rebuilt14 = [invNum, formatYmd(row[1]), String(row[2] || '').trim(), phName, cityName || 'بغداد', detectAreaFromPh(phName), prName, detectDosage(prName), qtyVal, priceVal, bonusVal, lineTotalVal, totalInvVal, maybeRep, maybeStatus, maybeTs];
        while (rebuilt14.length < totalCols) rebuilt14.push(row[rebuilt14.length] !== undefined ? row[rebuilt14.length] : '');
        cleanedData.push(rebuilt14);
      } else {
        var phM = String(row[oldMap.pharmacy_name] || '').trim();
        var cityM = oldMap.city >= 0 ? String(row[oldMap.city] || '').trim() : '';
        var areaM = oldMap.area >= 0 ? String(row[oldMap.area] || '').trim() : '';
        if (isKnownCityName(areaM) && (!cityM || !isKnownCityName(cityM))) {
          var tmp = cityM;
          cityM = areaM;
          areaM = tmp;
        }
        if (!cityM) cityM = 'بغداد';
        if (!areaM || areaM === 'مركز المدينة') {
          var gArea = detectAreaFromPh(phM);
          if (!areaM || (gArea && gArea !== 'مركز المدينة')) areaM = gArea;
        }
        var prodM = String(row[oldMap.product_name] || '').trim();
        var dosM = oldMap.dosage_form >= 0 ? String(row[oldMap.dosage_form] || '').trim() : '';
        if (!dosM) dosM = detectDosage(prodM);
        var mappedRow = [
          invNum,
          formatYmd(row[oldMap.invoice_date]),
          String(row[oldMap.warehouse_name] || '').trim(),
          phM,
          cityM,
          areaM,
          prodM,
          dosM,
          row[oldMap.quantity] !== undefined ? row[oldMap.quantity] : 0,
          row[oldMap.unit_price] !== undefined ? row[oldMap.unit_price] : 0,
          row[oldMap.bonus_quantity] !== undefined ? row[oldMap.bonus_quantity] : 0,
          row[oldMap.line_total] !== undefined ? row[oldMap.line_total] : 0,
          row[oldMap.total_invoice] !== undefined ? row[oldMap.total_invoice] : 0,
          String(row[oldMap.rep_name] || '').trim(),
          String(row[oldMap.status] || 'قيد التدقيق').trim(),
          row[oldMap.timestamp] !== undefined ? row[oldMap.timestamp] : ''
        ];
        for (var ec = 16; ec < totalCols; ec++) {
          mappedRow.push(row[ec] !== undefined ? row[ec] : '');
        }
        cleanedData.push(mappedRow);
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

function groupSheetRowsSafe(data, colMap) {
  var bucketMap = {};
  var bucketOrder = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var invNum = String(row[colMap.invoice_number] || '').trim();
    var dt = formatYmd(row[colMap.invoice_date]);
    var ph = normPh(row[colMap.pharmacy_name]);
    var prod = normProd(row[colMap.product_name]);
    var qty = Math.round(Number(row[colMap.quantity] || 0));
    var ts = String(row[colMap.timestamp] || '').trim();
    if (!ph && !prod && !invNum) continue;
    var bKey = (invNum || ph) + '::' + dt + '::' + ts;
    if (!bucketMap[bKey]) { bucketMap[bKey] = []; bucketOrder.push(bKey); }
    bucketMap[bKey].push({ sheetRow: i + 1, row: row, ph: ph, dt: dt, invNum: invNum, ts: ts, pKey: prod + ':' + qty });
  }

  var groups = [];
  for (var b = 0; b < bucketOrder.length; b++) {
    var entries = bucketMap[bucketOrder[b]];
    var block = [];
    var seen = {};
    for (var e = 0; e < entries.length; e++) {
      var ent = entries[e];
      if (ent.pKey && ent.pKey !== ':0' && seen[ent.pKey] && block.length > 0) {
        groups.push(block);
        block = [];
        seen = {};
      }
      block.push(ent);
      if (ent.pKey && ent.pKey !== ':0') seen[ent.pKey] = true;
    }
    if (block.length > 0) groups.push(block);
  }
  return groups;
}

function buildGroupSignatureSafe(block) {
  if (!block || block.length === 0) return '';
  var first = block[0];
  if (!first.ph || !first.dt) return '';
  var items = [];
  for (var i = 0; i < block.length; i++) {
    if (block[i].pKey && block[i].pKey !== ':0') items.push(block[i].pKey);
  }
  if (items.length === 0) return '';
  items.sort();
  return first.ph + '||' + first.dt + '||' + items.length + '||' + items.join('|');
}

function highlightDuplicatesInSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet)) return;
  var lastRow = sheet.getLastRow();
  var totalCols = Math.max(16, sheet.getLastColumn());
  if (lastRow <= 1) return;
  var headers = sheet.getRange(1, 1, 1, totalCols).getValues()[0];
  var colMap = resolveColMap(headers);
  var data = sheet.getRange(1, 1, lastRow, totalCols).getValues();
  var groups = groupSheetRowsSafe(data, colMap);

  var bySignature = {};
  for (var g = 0; g < groups.length; g++) {
    var grp = groups[g];
    var sig = buildGroupSignatureSafe(grp);
    if (!sig) continue;
    if (!bySignature[sig]) bySignature[sig] = [];
    bySignature[sig].push(grp);
  }
  var dupRowMap = {};
  for (var sigKey in bySignature) {
    if (bySignature[sigKey].length > 1) {
      var copies = bySignature[sigKey];
      for (var c = 0; c < copies.length; c++) {
        for (var rIdx = 0; rIdx < copies[c].length; rIdx++) {
          dupRowMap[copies[c][rIdx].sheetRow] = true;
        }
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

  if (deleteMode === 'duplicate_copy') {
    var allGroups = groupSheetRowsSafe(data, colMap);
    var matchingGroups = [];
    for (var g = 0; g < allGroups.length; g++) {
      var grp = allGroups[g];
      var gFirst = grp[0];
      var isMatch = false;
      if (cleanTarget && gFirst.invNum === cleanTarget) isMatch = true;
      else if (cleanPh && cleanDate && gFirst.ph === cleanPh && gFirst.dt === cleanDate) isMatch = true;
      if (isMatch) matchingGroups.push(grp);
    }

    if (matchingGroups.length <= 1) {
      return 0;
    }

    var chosenGroup = matchingGroups[matchingGroups.length - 1];
    if (targetTs) {
      for (var k = 1; k < matchingGroups.length; k++) {
        if (matchingGroups[k][0].ts === String(targetTs).trim()) {
          chosenGroup = matchingGroups[k];
          break;
        }
      }
    }

    var rowsToDelete = [];
    for (var ri = 0; ri < chosenGroup.length; ri++) {
      rowsToDelete.push(chosenGroup[ri].sheetRow);
    }
    rowsToDelete.sort(function(a, b) { return b - a; });
    for (var d = 0; d < rowsToDelete.length; d++) {
      sheet.deleteRow(rowsToDelete[d]);
      deleted++;
    }
    return deleted;
  }

  for (var i = data.length - 1; i >= 1; i--) {
    var rNum = String(data[i][colMap.invoice_number] || '').trim();
    var matchRow = false;
    if (cleanTarget && rNum === cleanTarget) matchRow = true;
    else if (!cleanTarget && cleanPh && cleanDate && normPh(data[i][colMap.pharmacy_name]) === cleanPh && formatYmd(data[i][colMap.invoice_date]) === cleanDate) matchRow = true;
    if (!matchRow) continue;
    sheet.deleteRow(i + 1);
    deleted++;
  }
  return deleted;
}

function findUserRowIndex(data, uMap, targetRowNum, targetName, targetEmail) {
  var cleanTargetName = normAr(targetName || '');
  var cleanTargetEmail = String(targetEmail || '').trim().toLowerCase();
  var rn = Number(targetRowNum || 0);
  if (rn >= 2 && rn <= data.length) {
    var rowAtIdx = data[rn - 1];
    var rName = normAr(rowAtIdx[uMap.nameCol]);
    var rEmail = uMap.emailCol >= 0 ? String(rowAtIdx[uMap.emailCol] || '').trim().toLowerCase() : '';
    if ((!cleanTargetName && !cleanTargetEmail) || (cleanTargetName && rName === cleanTargetName) || (cleanTargetEmail && rEmail === cleanTargetEmail)) {
      return rn;
    }
  }
  for (var i = 1; i < data.length; i++) {
    var nm = normAr(data[i][uMap.nameCol]);
    var em = uMap.emailCol >= 0 ? String(data[i][uMap.emailCol] || '').trim().toLowerCase() : '';
    if (cleanTargetName && nm === cleanTargetName) return i + 1;
    if (cleanTargetEmail && em === cleanTargetEmail) return i + 1;
  }
  return -1;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

    if (actionName === 'register_user' || actionName === 'add_user' || actionName === 'upsert_user' || actionName === 'seed_users') {
      var usersSheet = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheet) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي للمستخدمين' })).setMimeType(ContentService.MimeType.JSON);
      var headersU = usersSheet.getRange(1, 1, 1, Math.max(4, usersSheet.getLastColumn())).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      var incomingUsers = payload.users || (payload.user ? [payload.user] : []);
      var currentUsers = readAllSheetUsers(usersSheet);
      var existingSharedGem = '';
      for (var sg = 0; sg < currentUsers.length; sg++) {
        if (currentUsers[sg].gemini_api_key) { existingSharedGem = currentUsers[sg].gemini_api_key; break; }
      }
      var inserted = 0;
      for (var ui = 0; ui < incomingUsers.length; ui++) {
        var u = incomingUsers[ui];
        var uName = String(u.full_name || u.name || '').trim();
        var uEmail = String(u.email || '').trim().toLowerCase();
        var uPass = String(u.password_hash || u.password || '').trim();
        if (!uName && !uEmail) continue;
        var dupUser = false;
        for (var exi = 0; exi < currentUsers.length; exi++) {
          if ((uName && normAr(currentUsers[exi].full_name) === normAr(uName)) || (uEmail && currentUsers[exi].email === uEmail)) {
            dupUser = true;
            break;
          }
        }
        if (dupUser) {
          if (actionName === 'register_user' || actionName === 'add_user') return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'هذا الاسم مسجل مسبقاً في الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
          continue;
        }
        var totalUCols = Math.max(4, headersU.length);
        var uRow = [];
        for (var k = 0; k < totalUCols; k++) uRow.push('');
        uRow[uMap.nameCol] = uName || uEmail.split('@')[0];
        uRow[uMap.passCol] = /^[1-9]\\d*$/.test(uPass) ? Number(uPass) : uPass;
        uRow[uMap.sheetCol] = String(u.sheet_url || u.sheet_id || '').trim();
        uRow[uMap.webhookCol] = String(u.webhook_url || '').trim();
        if (uMap.idCol >= 0) uRow[uMap.idCol] = u.id || ('usr-' + new Date().getTime() + '-' + ui);
        if (uMap.emailCol >= 0) uRow[uMap.emailCol] = uEmail;
        if (uMap.roleCol >= 0) uRow[uMap.roleCol] = isBaqerName(uName, uEmail) ? 'admin' : 'medical_rep';
        if (uMap.activeCol >= 0) uRow[uMap.activeCol] = 'TRUE';
        if (uMap.geminiCol >= 0) uRow[uMap.geminiCol] = String(u.gemini_api_key || existingSharedGem || '').trim();
        var newRowIndex = usersSheet.getLastRow() + 1;
        usersSheet.getRange(newRowIndex, 1, 1, totalUCols).setValues([uRow]);
        if (!/^[1-9]\\d*$/.test(uPass)) {
          try { usersSheet.getRange(newRowIndex, uMap.passCol + 1).setNumberFormat('@').setValue(uPass); } catch (nfErr) {}
        }
        currentUsers.push({ full_name: uName, email: uEmail });
        inserted++;
      }
      try { usersSheet.autoResizeColumns(1, Math.max(4, headersU.length)); } catch (ue) {}
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, inserted: inserted, message: 'تم حفظ المستخدم بنجاح في الشيت الرئيسي.' })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'set_shared_gemini_key') {
      var usersSheetGem = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetGem) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      var gemKeyVal = String(payload.gemini_api_key || payload.geminiApiKey || '').trim();
      var lastColG = Math.max(4, usersSheetGem.getLastColumn());
      var headersGem = usersSheetGem.getRange(1, 1, 1, lastColG).getValues()[0];
      var uMapGem = resolveUserColMap(headersGem);
      var targetGemCol = uMapGem.geminiCol;
      if (targetGemCol < 0) {
        targetGemCol = 4;
        for (var gc = 0; gc < headersGem.length; gc++) {
          if (gc >= 4 && !String(headersGem[gc] || '').trim()) { targetGemCol = gc; break; }
          if (gc === headersGem.length - 1 && String(headersGem[gc] || '').trim()) { targetGemCol = headersGem.length; }
        }
        if (targetGemCol < 4) targetGemCol = 4;
        usersSheetGem.getRange(1, targetGemCol + 1).setValue('اي بي اي جمناي').setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
      }
      var lastRowGem = usersSheetGem.getLastRow();
      for (var gr = 2; gr <= lastRowGem; gr++) {
        var rowNameG = String(usersSheetGem.getRange(gr, uMapGem.nameCol + 1).getValue() || '').trim();
        if (rowNameG) {
          usersSheetGem.getRange(gr, targetGemCol + 1).setValue(gemKeyVal);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, gemini_api_key: gemKeyVal, message: 'تم تحديث مفتاح Gemini وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح!' })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'update_user') {
      var usersSheetUpd = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUpd) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      var dataUpd = usersSheetUpd.getDataRange().getValues();
      var headersUpd = dataUpd[0] || [];
      var uMapUpd = resolveUserColMap(headersUpd);
      var targetRow = findUserRowIndex(dataUpd, uMapUpd, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (targetRow === -1) return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود في الشيت الرئيسي.' })).setMimeType(ContentService.MimeType.JSON);
      var newName = String(payload.newName || '').trim();
      if (newName) {
        for (var ci = 1; ci < dataUpd.length; ci++) {
          if (ci + 1 !== targetRow && normAr(dataUpd[ci][uMapUpd.nameCol]) === normAr(newName)) {
            return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'الاسم الجديد مسجل مسبقاً لمستخدم آخر.' })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        usersSheetUpd.getRange(targetRow, uMapUpd.nameCol + 1).setValue(newName);
      }
      if (payload.newPassword !== undefined && String(payload.newPassword).trim() !== '') {
        var np = String(payload.newPassword).trim();
        var passCell = usersSheetUpd.getRange(targetRow, uMapUpd.passCol + 1);
        if (/^[1-9]\\d*$/.test(np)) {
          passCell.setNumberFormat('0').setValue(Number(np));
        } else {
          passCell.setNumberFormat('@').setValue(np);
        }
      }
      if (payload.newSheetUrl !== undefined) {
        usersSheetUpd.getRange(targetRow, uMapUpd.sheetCol + 1).setValue(String(payload.newSheetUrl).trim());
      }
      if (payload.newWebhookUrl !== undefined) {
        usersSheetUpd.getRange(targetRow, uMapUpd.webhookCol + 1).setValue(String(payload.newWebhookUrl).trim());
      }
      if (payload.newGeminiApiKey !== undefined && uMapUpd.geminiCol >= 0) {
        usersSheetUpd.getRange(targetRow, uMapUpd.geminiCol + 1).setValue(String(payload.newGeminiApiKey).trim());
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, rowNumber: targetRow, message: 'تم تعديل البيانات وحفظها في الشيت الرئيسي بنجاح.' })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_user') {
      var usersSheetDel = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetDel) return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      var dataDel = usersSheetDel.getDataRange().getValues();
      var uMapDel = resolveUserColMap(dataDel[0] || []);
      var delRow = findUserRowIndex(dataDel, uMapDel, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (delRow === -1) return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود.' })).setMimeType(ContentService.MimeType.JSON);
      usersSheetDel.deleteRow(delRow);
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, message: 'تم حذف المستخدم من الشيت الرئيسي بنجاح.' })).setMimeType(ContentService.MimeType.JSON);
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
    if (sheet && !isUsersSheetObj(sheet)) highlightDuplicatesInSheet(sheet);
  } catch (err) {}
}

function doGet(e) {
  try {
    var action = e && e.parameter ? (e.parameter.action || e.parameter.sheet || '') : '';
    var customId = e && e.parameter ? (e.parameter.spreadsheetId || '') : '';
    if (action === 'users' || action === 'المستخدمون') {
      var uSheet = getOrCreateUsersSheet(e && e.parameter ? (e.parameter.adminSpreadsheetId || customId) : '');
      var uHeaders = uSheet && uSheet.getLastRow() > 0 ? uSheet.getRange(1, 1, 1, Math.max(4, uSheet.getLastColumn())).getValues()[0] : [];
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, headers: uHeaders, users: readAllSheetUsers(uSheet) })).setMimeType(ContentService.MimeType.JSON);
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
      var prNameGetB = String(row[colMap.product_name] || '');
      rows.push({
        invoice_number: invNum, invoice_date: invDate,
        warehouse_name: String(row[colMap.warehouse_name] || ''), pharmacy_name: phName,
        city: colMap.city >= 0 ? String(row[colMap.city] || 'بغداد') : 'بغداد',
        area: colMap.area >= 0 ? String(row[colMap.area] || '') : detectAreaFromPh(phName),
        product_name: prNameGetB,
        dosage_form: colMap.dosage_form >= 0 ? String(row[colMap.dosage_form] || '') : detectDosage(prNameGetB),
        quantity: Number(row[colMap.quantity] || 0), unit_price: Number(row[colMap.unit_price] || 0),
        bonus_quantity: Number(row[colMap.bonus_quantity] || 0), line_total: Number(row[colMap.line_total] || 0),
        total_invoice: Number(row[colMap.total_invoice] || 0), rep_name: String(row[colMap.rep_name] || ''),
        status: String(row[colMap.status] || 'قيد التدقيق'), timestamp: String(row[colMap.timestamp] || ''),
        loyalty: colMap.loyalty >= 0 && colMap.loyalty < headers.length ? String(row[colMap.loyalty] || '') : '',
        cells: cells
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, headers: headers, rows: rows })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testRun() {
  var uSheet = getOrCreateUsersSheet(ADMIN_USERS_SHEET_ID);
  var sheet = getTargetSheet();
  if (sheet && !isUsersSheetObj(sheet)) {
    setupSheet(sheet);
  }
  Logger.log('تم التحقق من الجداول والترقية بنجاح (v' + SCRIPT_VERSION + ').');
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

