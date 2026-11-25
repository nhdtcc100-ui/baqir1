/**
 * كود Google Apps Script الموحّد المحدّث (الإصدار 7)
 * يدعم:
 * 1. الفصل التام بين التعديل (edit_invoice) والإضافة (add_invoice) + التحديث في نفس الصف (In-Place Update)
 * 2. إضافة وترتيب عمود "المنطقة / المكان" مباشرة بعد "المدينة / المحافظة" وإصلاح الجداول القديمة 14/16 عمود تلقائياً دون فقدان البيانات
 * 3. دعم قواعد البيانات المتعددة لكل مستخدم عبر payload.spreadsheetId
 * 4. إدارة قاعدة بيانات المستخدمين على الشيت الرئيسي (الاسم | الرمز السري | صفحة كوكل شيت | اي بي اي سكربت)
 * 5. حماية الشيت الرئيسي من دوال تنسيق الفواتير + تلوين المكررات بالأحمر #fee2e2 وإرجاع السليم للأبيض #ffffff + حماية الأصلية عند الحذف
 */
export const APPS_SCRIPT_V2_CODE = `var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
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
  if (!ss) {
    ss = getTargetSpreadsheet('');
  }
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
    isLegacy: true,
    idCol: 0,
    nameCol: 1,
    emailCol: 2,
    passCol: 3,
    roleCol: 4,
    activeCol: 5,
    geminiCol: 6,
    sheetCol: 7,
    webhookCol: 8
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
  var headers = data[0];
  var uMap = resolveUserColMap(headers);
  var users = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var fullName = String(row[uMap.nameCol] || '').trim();
    var emailVal = uMap.emailCol >= 0 ? String(row[uMap.emailCol] || '').trim().toLowerCase() : '';
    var idVal = uMap.idCol >= 0 ? String(row[uMap.idCol] || '').trim() : '';
    if (!fullName && !emailVal) continue;
    var nCheck = normAr(fullName);
    if (nCheck === 'الاسم' || nCheck === 'full_name' || idVal.toLowerCase() === 'id') continue;
    var role = isBaqerName(fullName, emailVal) ? 'admin' : 'medical_rep';
    var activeRaw = uMap.activeCol >= 0 ? String(row[uMap.activeCol] === undefined ? 'TRUE' : row[uMap.activeCol]).trim().toUpperCase() : 'TRUE';
    if (activeRaw === 'FALSE' || activeRaw === '0' || activeRaw === 'معطل') continue;
    users.push({
      rowNumber: i + 1,
      id: idVal || ('sheet-usr-' + (i + 1)),
      full_name: fullName || emailVal.split('@')[0],
      email: emailVal || (fullName.toLowerCase().replace(/\\s+/g, '_') + '@pharma.com'),
      password_hash: String(row[uMap.passCol] || '').trim(),
      role: role,
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
    ['فلسطين', 'شارع فلسطين'],
    ['كراده', 'الكرادة'],
    ['منصور', 'المنصور'],
    ['زعفرانيه', 'الزعفرانية'],
    ['مدينة الصدر', 'مدينة الصدر'],
    ['مدينه الصدر', 'مدينة الصدر'],
    ['صدر', 'مدينة الصدر'],
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
    ['حارثيه', 'الحارثية'],
    ['سيديه', 'السيدية'],
    ['بلديات', 'البلديات'],
    ['حبيبيه', 'الحبيبية'],
    ['يرموك', 'اليرموك'],
    ['جامعه', 'حي الجامعة'],
    ['حي اور', 'حي أور'],
    ['مشتل', 'المشتل'],
    ['غدير', 'الغدير'],
    ['خضراء', 'حي الخضراء'],
    ['قاهره', 'القاهرة'],
    ['صليخ', 'الصليخ'],
    ['شعله', 'الشعلة'],
    ['بسمايه', 'بسماية'],
    ['محموديه', 'المحمودية'],
    ['مدائن', 'المدائن'],
    ['ابو غريب', 'أبو غريب'],
    ['طارميه', 'الطارمية'],
    ['كرخ', 'الكرخ'],
    ['رصافه', 'الرصافة']
  ];
  for (var i = 0; i < areas.length; i++) {
    if (s.indexOf(areas[i][0]) !== -1) return areas[i][1];
  }
  var slashMatch = String(phName || '').match(/[\\/-]\\s*([^\\n\\r\\/-]{3,25})$/);
  if (slashMatch && slashMatch[1] && slashMatch[1].trim().length >= 3) {
    return slashMatch[1].trim();
  }
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

    // قاعدة حماية مطلقة: عند حذف المكررة، لا نحذف أبداً إذا بقيت نسخة واحدة فقط!
    if (matchingGroups.length <= 1) {
      return 0;
    }

    // نختار نسخة زائدة واحدة فقط (ونُبقي النسخة رقم 0 الأصلية دائماً)
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
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

    // ── إدارة قاعدة بيانات المستخدمين على الشيت الرئيسي ──
    if (actionName === 'register_user' || actionName === 'add_user' || actionName === 'upsert_user' || actionName === 'seed_users') {
      var usersSheet = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي للمستخدمين' })).setMimeType(ContentService.MimeType.JSON);
      }
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
          if (actionName === 'register_user' || actionName === 'add_user') {
            return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'هذا الاسم مسجل مسبقاً في الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
          }
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
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        inserted: inserted,
        message: 'تم حفظ المستخدم بنجاح في الشيت الرئيسي.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'set_shared_gemini_key') {
      var usersSheetGem = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetGem) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
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
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        gemini_api_key: gemKeyVal,
        message: 'تم تحديث مفتاح Gemini وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'update_user') {
      var usersSheetUpd = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUpd) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var dataUpd = usersSheetUpd.getDataRange().getValues();
      var headersUpd = dataUpd[0] || [];
      var uMapUpd = resolveUserColMap(headersUpd);
      var targetRow = findUserRowIndex(dataUpd, uMapUpd, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (targetRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود في الشيت الرئيسي.' })).setMimeType(ContentService.MimeType.JSON);
      }
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
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        rowNumber: targetRow,
        message: 'تم تعديل البيانات وحفظها في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_user') {
      var usersSheetDel = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetDel) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var dataDel = usersSheetDel.getDataRange().getValues();
      var uMapDel = resolveUserColMap(dataDel[0] || []);
      var delRow = findUserRowIndex(dataDel, uMapDel, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (delRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود.' })).setMimeType(ContentService.MimeType.JSON);
      }
      usersSheetDel.deleteRow(delRow);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        message: 'تم حذف المستخدم من الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(payload.spreadsheetId, payload.sheetName || 'الفواتير');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح ورقة الفواتير في كوكل شيت' })).setMimeType(ContentService.MimeType.JSON);
    }
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
      var uList = readAllSheetUsers(uSheet);
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, headers: uHeaders, users: uList
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(customId, 'الفواتير');
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

      var prNameGet = String(row[colMap.product_name] || '');
      rows.push({
        invoice_number: invNum,
        invoice_date:   invDate,
        warehouse_name: String(row[colMap.warehouse_name] || ''),
        pharmacy_name:  phName,
        city:           colMap.city >= 0 ? String(row[colMap.city] || 'بغداد') : 'بغداد',
        area:           colMap.area >= 0 ? String(row[colMap.area] || '') : detectAreaFromPh(phName),
        product_name:   prNameGet,
        dosage_form:    colMap.dosage_form >= 0 ? String(row[colMap.dosage_form] || '') : detectDosage(prNameGet),
        quantity:       Number(row[colMap.quantity] || 0),
        unit_price:     Number(row[colMap.unit_price] || 0),
        bonus_quantity: Number(row[colMap.bonus_quantity] || 0),
        line_total:     Number(row[colMap.line_total] || 0),
        total_invoice:  Number(row[colMap.total_invoice] || 0),
        rep_name:       String(row[colMap.rep_name] || ''),
        status:         String(row[colMap.status] || 'قيد التدقيق'),
        timestamp:      String(row[colMap.timestamp] || ''),
        loyalty:        colMap.loyalty >= 0 && colMap.loyalty < headers.length ? String(row[colMap.loyalty] || '') : '',
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
  var uSheet = getOrCreateUsersSheet(ADMIN_USERS_SHEET_ID);
  var sheet = getTargetSheet();
  if (sheet && !isUsersSheetObj(sheet)) {
    setupSheet(sheet);
  }
  Logger.log('تم التحقق من الجداول والترقية بنجاح (v' + SCRIPT_VERSION + ').');
}`;
