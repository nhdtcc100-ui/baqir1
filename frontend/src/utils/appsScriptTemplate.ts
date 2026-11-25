/**
 * كود Google Apps Script الموحّد المحدّث (الإصدار 2)
 * يدعم:
 * 1. التعديل في نفس الصف بالضبط (In-Place Update) دون إنشاء صف جديد عند التعديل أو الاعتماد
 * 2. مطابقة جميع الأعمدة (16/17 عموداً شاملاً المنطقة ونوع المادة والولاء) ومنع إزاحة اسم المنتج للمكان/المدينة
 * 3. ترميم الصفوف المزاحة السابقة تلقائياً عبر setupSheet
 * 4. فحص التكرار الشامل (اسم الصيدلية + التاريخ + عدد المنتجات + المنتجات وكمياتها) وتلوين المكرر بالأحمر #fee2e2 وإرجاع السليم للأبيض #ffffff
 */
export const APPS_SCRIPT_V2_CODE = `var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var SCRIPT_VERSION = 2;

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
        var rebuilt = [invNum, formatYmd(row[1]), String(row[2] || '').trim(), phName, 'مركز المدينة', cityName || 'بغداد', prName, detectDosage(prName), qtyVal, priceVal, bonusVal, lineTotalVal, totalInvVal, maybeRep, maybeStatus, maybeTs];
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

  var data = sheet.getRange(2, 1, lastRow - 1, totalCols).getValues();
  var groups = {};
  var groupOrder = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var invNum = String(row[0] || '').trim();
    var dt = formatYmd(row[1]);
    var ph = normPh(row[3]);
    var prod = normProd(row[6]);
    var qty = Math.round(Number(row[8] || 0));
    var ts = String(row[15] || '').trim();
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

function buildRowValues(r, totalCols, existingRow) {
  var invNum = String(r.invoice_number || '').trim();
  var vals = [
    invNum,
    formatYmd(r.invoice_date),
    r.warehouse_name || (existingRow ? existingRow[2] : '') || 'مذخر الشغف الحديث',
    r.pharmacy_name || '',
    r.area || r.pharmacy_area || (existingRow ? existingRow[4] : '') || 'مركز المدينة',
    r.city || r.pharmacy_city || (existingRow ? existingRow[5] : '') || 'بغداد',
    r.product_name || '',
    r.dosage_form || detectDosage(r.product_name),
    Number(r.quantity || 0),
    Number(r.unit_price || 0),
    Number(r.bonus_quantity || 0),
    Number(r.line_total || 0),
    Number(r.total_invoice || 0),
    r.rep_name || (existingRow ? existingRow[13] : '') || '',
    r.status || 'قيد التدقيق',
    r.timestamp || (existingRow ? existingRow[15] : '') || ''
  ];
  for (var c = 16; c < totalCols; c++) {
    var val = (c === 16 && r.loyalty !== undefined && r.loyalty !== '') ? r.loyalty : (existingRow && existingRow[c] !== undefined ? existingRow[c] : '');
    vals.push(val);
  }
  return vals;
}

function deleteMatchingInvoiceRows(sheet, targetInvNum, deleteMode, targetPh, targetDate, targetTs) {
  var cleanTarget = String(targetInvNum || '').trim();
  var cleanPh = normPh(targetPh || '');
  var cleanDate = formatYmd(targetDate || '');
  var data = sheet.getDataRange().getValues();
  var deleted = 0;

  var matches = function(row) {
    var rNum = String(row[0] || '').trim();
    if (cleanTarget) return rNum === cleanTarget;
    if (cleanPh && cleanDate) {
      return normPh(row[3]) === cleanPh && formatYmd(row[1]) === cleanDate;
    }
    return false;
  };

  var firstTs = targetTs || null;
  if (deleteMode === 'duplicate_copy' && !firstTs) {
    for (var f = 1; f < data.length; f++) {
      if (matches(data[f])) {
        firstTs = String(data[f][15] || '');
        break;
      }
    }
  }

  for (var i = data.length - 1; i >= 1; i--) {
    if (!matches(data[i])) continue;
    if (deleteMode === 'duplicate_copy') {
      if (targetTs) {
        if (String(data[i][15] || '').trim() !== String(targetTs).trim()) continue;
      } else if (String(data[i][15] || '') === String(firstTs || '')) {
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

    if (payload.action === 'repair' || payload.action === 'setup') {
      highlightDuplicatesInSheet(sheet);
      try { sheet.autoResizeColumns(1, Math.max(16, sheet.getLastColumn())); } catch (errR) {}
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, message: 'تم إصلاح الأعمدة المزاحة وفحص وتلوين التكرار في كوكل شيت بنجاح!' })).setMimeType(ContentService.MimeType.JSON);
    }

    if (payload.action === 'delete_invoice') {
      var delInv = payload.invoice_number || (payload.row && payload.row.invoice_number);
      var delCount = deleteMatchingInvoiceRows(sheet, delInv, payload.delete_mode, payload.pharmacy_name, payload.invoice_date, payload.timestamp);
      highlightDuplicatesInSheet(sheet);
      return ContentService.createTextOutput(JSON.stringify({ success: true, deleted: delCount, message: 'تم حذف ' + delCount + ' سطر من كوكل شيت وإعادة ضبط الألوان' })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = getExpectedCols(sheet);
    var totalCols = headers.length;
    var rows = payload.rows || [];
    var data = sheet.getDataRange().getValues();
    var addedCount = 0;
    var updatedCount = 0;

    // التعديل في نفس الصف (In-Place Update) دون إضافة صف جديد
    if (payload.action === 'replace_invoice') {
      var matchNums = {};
      if (payload.previous_invoice_number) matchNums[String(payload.previous_invoice_number).trim()] = true;
      if (payload.invoice_number) matchNums[String(payload.invoice_number).trim()] = true;

      var existingIndices = [];
      for (var m = 1; m < data.length; m++) {
        var rNum = String(data[m][0] || '').trim();
        if (rNum && matchNums[rNum]) {
          existingIndices.push(m + 1);
        }
      }

      var validRows = [];
      for (var vr = 0; vr < rows.length; vr++) {
        if (String(rows[vr].invoice_number || '').trim() && String(rows[vr].invoice_number).trim() !== '123') {
          validRows.push(rows[vr]);
        }
      }

      var common = Math.min(existingIndices.length, validRows.length);
      for (var u = 0; u < common; u++) {
        var sheetRowNum = existingIndices[u];
        var oldRowData = data[sheetRowNum - 1];
        var newVals = buildRowValues(validRows[u], totalCols, oldRowData);
        sheet.getRange(sheetRowNum, 1, 1, totalCols).setValues([newVals]);
        updatedCount++;
      }

      // إذا زاد عدد أصناف الفاتورة أضف البقية بعد آخر صف أصلي لها مباشرة
      if (validRows.length > existingIndices.length) {
        var insertAfter = existingIndices.length > 0 ? existingIndices[existingIndices.length - 1] : sheet.getLastRow();
        for (var a = common; a < validRows.length; a++) {
          var insVals = buildRowValues(validRows[a], totalCols, null);
          if (insertAfter > 0 && insertAfter < sheet.getLastRow()) {
            sheet.insertRowAfter(insertAfter);
            insertAfter++;
            sheet.getRange(insertAfter, 1, 1, totalCols).setValues([insVals]);
          } else {
            sheet.appendRow(insVals);
            insertAfter = sheet.getLastRow();
          }
          addedCount++;
        }
      } else if (existingIndices.length > validRows.length) {
        for (var d = existingIndices.length - 1; d >= validRows.length; d--) {
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
        message: 'تم تحديث الفاتورة في مكانها (' + updatedCount + ' تحديث، ' + addedCount + ' إضافة).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var invNum = String(r.invoice_number || '').trim();
      if (!invNum || invNum === '123') continue;

      var existingRowIndex = -1;
      var thisProd = normProd(r.product_name || '');
      for (var k = 1; k < data.length; k++) {
        if (String(data[k][0] || '').trim() === invNum && normProd(data[k][6] || '') === thisProd) {
          existingRowIndex = k + 1;
          break;
        }
      }

      if (existingRowIndex > 1) {
        var updVals = buildRowValues(r, totalCols, data[existingRowIndex - 1]);
        sheet.getRange(existingRowIndex, 1, 1, totalCols).setValues([updVals]);
        updatedCount++;
      } else {
        var addVals = buildRowValues(r, totalCols, null);
        sheet.appendRow(addVals);
        addedCount++;
        data.push(addVals);
      }
    }

    highlightDuplicatesInSheet(sheet);
    try { sheet.autoResizeColumns(1, totalCols); } catch (resizeErr) {}

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      script_version: SCRIPT_VERSION,
      added: addedCount,
      updated: updatedCount,
      message: 'تم إدراج ' + addedCount + ' سطراً وتحديث ' + updatedCount + ' سطور في مكانها بنجاح.'
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
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var invNum = String(row[0] || '').trim();
      var phName = String(row[3] || '').trim();
      if (invNum === '123' || (!invNum && !phName && !row[6])) continue;

      var invDate = formatYmd(row[1]);
      var cells = [];
      for (var c = 0; c < headers.length; c++) {
        if (c === 1) cells.push(invDate);
        else cells.push(row[c] !== undefined && row[c] !== null ? String(row[c]) : '');
      }

      rows.push({
        invoice_number: invNum,
        invoice_date:   invDate,
        warehouse_name: String(row[2] || ''),
        pharmacy_name:  phName,
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
        timestamp:      String(row[15] || ''),
        loyalty:        String(row[16] || ''),
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
