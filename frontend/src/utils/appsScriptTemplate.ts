/**
 * كود Google Apps Script الموحّد المحدّث (الإصدار 3)
 * يضمن:
 * 1. الفصل التام بين التعديل (edit_invoice / replace_invoice) والإضافة (add_invoice / batchAppend):
 *    - التعديل لا ينشئ صفاً جديداً في أسفل الشيت أبداً؛ يحدّث نفس الصفوف الموجودة في مكانها بالضبط (In-Place)
 *    - الإضافة وحدها هي من تنشئ صفاً جديداً (بعد التحقق من عدم وجود نسخة مطابقة)
 * 2. توزيع جميع الخلايا حسب أسماء الأعمدة في الصف الأول بالضبط (المنطقة / المكان، المحافظة، اسم المادة، النوع... إلخ) حتى لا يرجع اسم المنتج بدل المنطقة أبداً
 * 3. ترميم الصفوف المزاحة السابقة تلقائياً عبر setupSheet
 * 4. فحص التكرار الشامل (اسم الصيدلية + التاريخ + عدد المنتجات + المنتجات وكمياتها) وتلوين المكرر بالأحمر #fee2e2 وإرجاع السليم للأبيض #ffffff
 */
export const APPS_SCRIPT_V2_CODE = `var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var SCRIPT_VERSION = 3;

function getTargetSheet() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (!ss) {
    try { ss = SpreadsheetApp.openById(SPREADSHEET_ID); } catch (e) {}
  }
  if (!ss) return null;
  return ss.getSheetByName('الفواتير') || ss.getActiveSheet();
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
    ['فلسطين', 'شارع فلسطين'],
    ['كراده', 'الكرادة'],
    ['منصور', 'المنصور'],
    ['زعفرانيه', 'الزعفرانية'],
    ['مدينة الصدر', 'مدينة الصدر'],
    ['مدينه الصدر', 'مدينة الصدر'],
    ['اعظميه', 'الأعظمية'],
    ['كاظميه', 'الكاظمية'],
    ['دوره', 'الدورة'],
    ['بياع', 'البياع'],
    ['عامريه', 'العامرية'],
    ['غزاليه', 'الغزالية'],
    ['شعب', 'الشعب'],
    ['زيونه', 'زيونة'],
    ['بغداد الجديده', 'بغداد الجديدة'],
    ['جادرية', 'الجادرية'],
    ['جادريه', 'الجادرية'],
    ['حارثيه', 'الحارثية']
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

/**
 * تحديد موضع كل عمود بناءً على عنوان العمود في الصف الأول للشيت لضمان دقة الإضافة والتعديل دائماً
 */
function resolveColMap(headers) {
  var map = {
    invoice_number: 0,
    invoice_date: 1,
    warehouse_name: 2,
    pharmacy_name: 3,
    area: 4,
    city: 5,
    product_name: 6,
    dosage_form: 7,
    quantity: 8,
    unit_price: 9,
    bonus_quantity: 10,
    line_total: 11,
    total_invoice: 12,
    rep_name: 13,
    status: 14,
    timestamp: 15,
    loyalty: 16
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
      if (invNum === '123' || (!invNum && !phNameCheck && !row[6])) {
        needsRewrite = true;
        continue;
      }

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
        for (var c = 0; c < totalCols; c++) {
          fixedRow.push(row[c] !== undefined ? row[c] : '');
        }
        cleanedData.push(fixedRow);
      }
    }

    if (needsRewrite) {
      sheet.clear();
      sheet.getRange(1, 1, 1, totalCols).setValues([headers]);
      if (cleanedData.length > 0) {
        sheet.getRange(2, 1, cleanedData.length, totalCols).setValues(cleanedData);
      }
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

/**
 * فحص التكرار الشامل وتلوين كامل الصف:
 * - لا تُعد الفاتورة مكررة إلا عند تطابق: الصيدلية + التاريخ + عدد المنتجات + كل المنتجات وكمياتها معاً
 * - المكرر يتلون كامل صفه بالأحمر (#fee2e2)، وعند إزالته يرجع الصف المتبقي للأبيض (#ffffff)
 */
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
    if (!groups[gKey]) {
      groups[gKey] = { ph: ph, dt: dt, items: [], rows: [] };
      groupOrder.push(gKey);
    }
    if (prod) groups[gKey].items.push(prod + ':' + qty);
    groups[gKey].rows.push(i + 2);
  }

  var bySignature = {};
  for (var g = 0; g < groupOrder.length; g++) {
    var gk = groupOrder[g];
    var grp = groups[gk];
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
        for (var rIdx = 0; rIdx < copies[c].rows.length; rIdx++) {
          dupRowMap[copies[c].rows[rIdx]] = true;
        }
      }
    }
  }

  for (var sheetRow = 2; sheetRow <= lastRow; sheetRow++) {
    var rng = sheet.getRange(sheetRow, 1, 1, totalCols);
    rng.setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    if (dupRowMap[sheetRow]) {
      rng.setBackground('#fee2e2').setFontColor('#991b1b');
    } else {
      rng.setBackground('#ffffff').setFontColor('#0f172a');
    }
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
    if (!cleanTarget && cleanPh && cleanDate) {
      return normPh(row[colMap.pharmacy_name]) === cleanPh && formatYmd(row[colMap.invoice_date]) === cleanDate;
    }
    return false;
  };

  var firstTs = targetTs || null;
  if (deleteMode === 'duplicate_copy' && !firstTs) {
    for (var f = 1; f < data.length; f++) {
      if (matches(data[f])) {
        firstTs = String(data[f][colMap.timestamp] || '');
        break;
      }
    }
  }

  for (var i = data.length - 1; i >= 1; i--) {
    if (!matches(data[i])) continue;
    if (deleteMode === 'duplicate_copy') {
      if (targetTs) {
        if (String(data[i][colMap.timestamp] || '').trim() !== String(targetTs).trim()) continue;
      } else if (String(data[i][colMap.timestamp] || '') === String(firstTs || '')) {
        continue;
      }
    }
    sheet.deleteRow(i + 1);
    deleted++;
  }
  return deleted;
}

function doPost(e) {
  try {
    var sheet = getTargetSheet();
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح ورقة الفواتير في كوكل شيت' })).setMimeType(ContentService.MimeType.JSON);
    }
    setupSheet(sheet);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

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

    // 1. وضع التعديل (edit_invoice / replace_invoice):
    // لا ينشئ صفوفاً جديدة في الأسفل إطلاقاً — يحدث نفس الصفوف الموجودة في مواضعها بالضبط!
    if (actionName === 'edit_invoice' || actionName === 'replace_invoice') {
      var matchNums = {};
      if (payload.previous_invoice_number) matchNums[String(payload.previous_invoice_number).trim()] = true;
      if (payload.invoice_number) matchNums[String(payload.invoice_number).trim()] = true;

      var existingIndices = [];
      for (var m = 1; m < data.length; m++) {
        var rNum = String(data[m][colMap.invoice_number] || '').trim();
        if (rNum && matchNums[rNum]) {
          existingIndices.push(m + 1);
        }
      }

      // بحث احتياطي بالصيدلية والتاريخ إذا تغير الرقم أو كان خالياً
      if (existingIndices.length === 0 && payload.pharmacy_name && payload.invoice_date) {
        var targetPhN = normPh(payload.pharmacy_name);
        var targetDtY = formatYmd(payload.invoice_date);
        for (var m2 = 1; m2 < data.length; m2++) {
          if (normPh(data[m2][colMap.pharmacy_name]) === targetPhN && formatYmd(data[m2][colMap.invoice_date]) === targetDtY) {
            existingIndices.push(m2 + 1);
          }
        }
      }

      var validEditRows = [];
      for (var vr = 0; vr < rows.length; vr++) {
        if (String(rows[vr].invoice_number || '').trim() !== '123') {
          validEditRows.push(rows[vr]);
        }
      }

      if (existingIndices.length === 0) {
        // وضع التعديل يحترم قاعدة عدم إنشاء صف جديد تلقائياً إذا لم يكن الصف موجوداً
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          script_version: SCRIPT_VERSION,
          added: 0,
          updated: 0,
          message: 'وضع التعديل: لم يتم إنشاء صف جديد لعدم العثور على الصف الأصلي في الشيت.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var common = Math.min(existingIndices.length, validEditRows.length);
      for (var u = 0; u < common; u++) {
        var sheetRowNum = existingIndices[u];
        var oldRowData = data[sheetRowNum - 1];
        var newVals = buildRowValuesByHeaders(validEditRows[u], headers, oldRowData);
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
        for (var d = existingIndices.length - 1; d >= validEditRows.length; d--) {
          sheet.deleteRow(existingIndices[d]);
        }
      }

      highlightDuplicatesInSheet(sheet);
      try { sheet.autoResizeColumns(1, totalCols); } catch (re1) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        added: addedCount,
        updated: updatedCount,
        message: 'تم تعديل الفاتورة في نفس الصف (' + updatedCount + ' تحديث، ' + addedCount + ' بند إضافي).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. وضع الإضافة (add_invoice / batchAppend):
    // يضيف صفوفاً جديدة فقط عند القدوم من ميزة إضافة الفواتير مع توزيع الأعمدة بالاسم
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
      success: true,
      script_version: SCRIPT_VERSION,
      added: addedCount,
      updated: updatedCount,
      message: 'تم إدراج ' + addedCount + ' سطراً جديداً بترتيب الأعمدة الكامل بنجاح.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    var sheet = getTargetSheet();
    if (sheet) highlightDuplicatesInSheet(sheet);
  } catch (err) {}
}

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: data[0] || [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }

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
        invoice_number: invNum,
        invoice_date:   invDate,
        warehouse_name: String(row[colMap.warehouse_name] || ''),
        pharmacy_name:  phName,
        area:           String(row[colMap.area] || ''),
        city:           String(row[colMap.city] || 'بغداد'),
        product_name:   String(row[colMap.product_name] || ''),
        dosage_form:    String(row[colMap.dosage_form] || ''),
        quantity:       Number(row[colMap.quantity] || 0),
        unit_price:     Number(row[colMap.unit_price] || 0),
        bonus_quantity: Number(row[colMap.bonus_quantity] || 0),
        line_total:     Number(row[colMap.line_total] || 0),
        total_invoice:  Number(row[colMap.total_invoice] || 0),
        rep_name:       String(row[colMap.rep_name] || ''),
        status:         String(row[colMap.status] || 'قيد التدقيق'),
        timestamp:      String(row[colMap.timestamp] || ''),
        loyalty:        colMap.loyalty < headers.length ? String(row[colMap.loyalty] || '') : '',
        cells:          cells
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      script_version: SCRIPT_VERSION,
      headers: headers,
      rows: rows
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testRun() {
  var sheet = getTargetSheet();
  setupSheet(sheet);
  Logger.log('تم ترقية وتنسيق وفحص التكرار للشيت بنجاح (v' + SCRIPT_VERSION + '): ' + (sheet ? sheet.getLastRow() : 0));
}`;
