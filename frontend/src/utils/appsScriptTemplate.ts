/**
 * كود Google Apps Script الموحّد المحدّث (الإصدار 10)
 * يدعم:
 * 1. ترتيب الأعمدة الموحّد: (المنطقة / المكان = E) قبل (المدينة / المحافظة = F) في جميع الشيتات مع ترحيل آمن دون فقدان البيانات
 * 2. استنساخ أوراق وجداول Pivot Tables تلقائياً من شيت الأدمن القالب إلى جميع شيتات المندوبين عبر PivotTable API
 *    - مصدر بيانات كل Pivot يشير لشيت فواتير المندوب نفسه (ليس شيت الأدمن)
 *    - يُضاف SpreadsheetApp.flush() بعد كل Pivot لتجنب timeout
 *    - تقرير مفصّل لكل شيت: tabsCount, pivotsCount, errorDetails
 * 3. التوجيه المركزي الموحد: أي تعديل في سكربت الأدمن ينعكس على الجميع مع دعم المكتبة (HEAD) وتوحيد عمود D
 * 4. إدارة الشيت الرئيسي (5 أعمدة بما فيها عمود E: اي بي اي جمناي) + تعميم تلقائي عند التعديل اليدوي onEdit
 * 5. حماية الشيت الرئيسي + تلوين المكررات #fee2e2 / #ffffff + حماية النسخة الأصلية عند حذف المكرر
 */
export const APPS_SCRIPT_THIN_WRAPPER = `// ضع هذا الكود المختصر (مرة واحدة فقط) في شيت المندوب بعد إضافة مشروع سكربت الأدمن كـ Library باسم AdminLib (الوضع: HEAD)
function onEdit(e) { return AdminLib.onEdit(e); }
function doGet(e) { return AdminLib.doGet(e); }
function doPost(e) { return AdminLib.doPost(e); }
function testRun() { return AdminLib.testRun(); }`;

export const APPS_SCRIPT_V2_CODE = `var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var ADMIN_USERS_SHEET_ID = '1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI';
var SCRIPT_VERSION = 10;
var TEMPLATE_SYNC_GUARD = false;

var DATA_COL_KEYS = [
  'invoice_number', 'invoice_date', 'warehouse_name', 'pharmacy_name',
  'area', 'city', 'product_name', 'dosage_form',
  'quantity', 'unit_price', 'bonus_quantity', 'line_total',
  'total_invoice', 'rep_name', 'status', 'timestamp', 'loyalty'
];

function extractSheetIdFromUrl(val) {
  var s = String(val || '').trim();
  if (!s) return '';
  var m = s.match(/\\/spreadsheets\\/d\\/([a-zA-Z0-9-_]+)/);
  if (m && m[1]) return m[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(s)) return s;
  return '';
}

function getTargetSpreadsheet(customSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(customSpreadsheetId) || String(customSpreadsheetId || '').trim();
  if (targetId && targetId !== SPREADSHEET_ID) {
    try {
      var opened = SpreadsheetApp.openById(targetId);
      if (opened) return opened;
    } catch (e) {}
  }
  try {
    var ssDefault = SpreadsheetApp.openById(targetId || SPREADSHEET_ID);
    if (ssDefault) return ssDefault;
  } catch (e2) {}
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e3) {}
  return null;
}

function sheetHasPivotTables(sheet) {
  try {
    return Boolean(sheet && typeof sheet.getPivotTables === 'function' && sheet.getPivotTables().length > 0);
  } catch (e) {
    return false;
  }
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

function findInvoiceDataSheet(ss, preferredName) {
  if (!ss) return null;
  var pref = String(preferredName || '').trim();
  if (pref && pref !== 'الفواتير') {
    var named = ss.getSheetByName(pref);
    if (named && !isUsersSheetObj(named) && !sheetHasPivotTables(named)) return named;
  }
  var candidates = ['الفواتير', 'Sheet1', 'الورقة1', 'المبيعات'];
  for (var c = 0; c < candidates.length; c++) {
    var cs = ss.getSheetByName(candidates[c]);
    if (cs && !isUsersSheetObj(cs) && !sheetHasPivotTables(cs)) return cs;
  }
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    var s = all[i];
    if (isUsersSheetObj(s) || sheetHasPivotTables(s)) continue;
    try {
      if (s.getLastRow() > 0) {
        var r1 = s.getRange(1, 1, 1, Math.min(6, Math.max(1, s.getLastColumn()))).getValues()[0];
        for (var k = 0; k < r1.length; k++) {
          var hk = normAr(r1[k]);
          if (hk.indexOf('رقم الفاتور') !== -1 || hk.indexOf('اسم الصيدلي') !== -1) return s;
        }
      }
    } catch (e) {}
  }
  for (var j = 0; j < all.length; j++) {
    if (!isUsersSheetObj(all[j]) && !sheetHasPivotTables(all[j])) return all[j];
  }
  return null;
}

function getTargetSheet(customSpreadsheetId, preferredSheetName) {
  var ss = getTargetSpreadsheet(customSpreadsheetId);
  if (!ss) return null;
  return findInvoiceDataSheet(ss, preferredSheetName);
}

function getOrCreateUsersSheet(adminSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(adminSpreadsheetId) || String(adminSpreadsheetId || ADMIN_USERS_SHEET_ID).trim();
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

function ensureMasterGeminiColumn(usersSheet, forcedColZeroIdx) {
  if (!usersSheet) return 4;
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = usersSheet.getLastRow() > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  if (uMap.geminiCol >= 0) return uMap.geminiCol;
  var targetCol = (forcedColZeroIdx !== undefined && forcedColZeroIdx >= 4) ? forcedColZeroIdx : 4;
  for (var gc = 4; gc < headers.length; gc++) {
    if (!String(headers[gc] || '').trim()) { targetCol = gc; break; }
    if (gc === headers.length - 1 && String(headers[gc] || '').trim()) { targetCol = headers.length; }
  }
  if (targetCol < 4) targetCol = 4;
  try {
    usersSheet.getRange(1, targetCol + 1).setValue('اي بي اي جمناي').setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  } catch (e) {}
  return targetCol;
}

function propagateGeminiKeyToAllUserRows(usersSheet, targetGemCol, gemKeyVal) {
  if (!usersSheet) return;
  var lastRow = usersSheet.getLastRow();
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = lastRow > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  for (var gr = 2; gr <= lastRow; gr++) {
    var rowNameG = String(usersSheet.getRange(gr, uMap.nameCol + 1).getValue() || '').trim();
    if (rowNameG) {
      usersSheet.getRange(gr, targetGemCol + 1).setValue(gemKeyVal);
    }
  }
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
    var rawGem = uMap.geminiCol >= 0 ? String(row[uMap.geminiCol] || '').trim() : '';
    if (!rawGem) {
      for (var c = 4; c < row.length; c++) {
        var cv = String(row[c] || '').trim();
        if (/^(AIza|AQ\\.)/.test(cv)) { rawGem = cv; break; }
      }
    }
    users.push({
      rowNumber: i + 1,
      id: idVal || ('sheet-usr-' + (i + 1)),
      full_name: fullName || emailVal.split('@')[0],
      email: emailVal || (fullName.toLowerCase().replace(/\\s+/g, '_') + '@pharma.com'),
      password_hash: String(row[uMap.passCol] || '').trim(),
      role: role,
      is_active: true,
      gemini_api_key: rawGem,
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
      if (label) headers.push(label);
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
    ['صدر', 'مدينة الصدر'], ['اعظميه', 'الأعظمية'], ['كاظميه', 'الكاظمية'],
    ['دوره', 'الدورة'], ['بياع', 'البياع'], ['عامريه', 'العامرية'],
    ['غزاليه', 'الغزالية'], ['شعب', 'الشعب'], ['زيونه', 'زيونة'],
    ['بغداد الجديده', 'بغداد الجديدة'], ['جادرية', 'الجادرية'], ['جادريه', 'الجادرية'],
    ['حارثيه', 'الحارثية'], ['سيديه', 'السيدية'], ['بلديات', 'البلديات'],
    ['حبيبيه', 'الحبيبية'], ['يرموك', 'اليرموك'], ['جامعه', 'حي الجامعة'],
    ['حي اور', 'حي أور'], ['مشتل', 'المشتل'], ['غدير', 'الغدير'],
    ['خضراء', 'حي الخضراء'], ['قاهره', 'القاهرة'], ['صليخ', 'الصليخ'],
    ['شعله', 'الشعلة'], ['بسمايه', 'بسماية'], ['محموديه', 'المحمودية'],
    ['مدائن', 'المدائن'], ['ابو غريب', 'أبو غريب'], ['طارميه', 'الطارمية'],
    ['كرخ', 'الكرخ'], ['رصافه', 'الرصافة']
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
    area: hasArea ? 4 : -1,
    city: hasArea ? 5 : 4,
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
  if (colMap.area >= 0) vals[colMap.area] = resolvedArea;
  if (colMap.city >= 0) vals[colMap.city] = resolvedCity || 'بغداد';
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
  if (!sheet || isUsersSheetObj(sheet) || sheetHasPivotTables(sheet)) return;
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
      String(currentHeaders[4] || '').trim() !== 'المنطقة / المكان' ||
      String(currentHeaders[5] || '').trim() !== 'المدينة / المحافظة' ||
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
        var rebuilt14 = [invNum, formatYmd(row[1]), String(row[2] || '').trim(), phName, detectAreaFromPh(phName), cityName || 'بغداد', prName, detectDosage(prName), qtyVal, priceVal, bonusVal, lineTotalVal, totalInvVal, maybeRep, maybeStatus, maybeTs];
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
          needsRewrite = true;
        } else if (isKnownCityName(areaM) && isKnownCityName(cityM)) {
          areaM = '';
          needsRewrite = true;
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
          areaM,
          cityM,
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

  if (!TEMPLATE_SYNC_GUARD && typeof sheet.getParent === 'function') {
    try {
      var pSs = sheet.getParent();
      if (pSs && pSs.getId && pSs.getId() !== SPREADSHEET_ID && pSs.getId() !== ADMIN_USERS_SHEET_ID && pSs.getSheets().length <= 1) {
        cloneAdminTabsAndPivotsToTarget(pSs.getId());
      }
    } catch (syncAutoErr) {}
  }
}

function getColKeyByIndex(colMap, zeroBasedIdx) {
  for (var i = 0; i < DATA_COL_KEYS.length; i++) {
    var k = DATA_COL_KEYS[i];
    if (colMap[k] === zeroBasedIdx) return k;
  }
  return '';
}

function mapAdminColToRepCol(adminCol1Based, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var zeroIdx = Number(adminCol1Based) - 1;
  var key = getColKeyByIndex(adminColMap, zeroIdx);
  if (key) {
    if (normAr(tabName).indexOf('منطق') !== -1 && key === 'city' && repColMap.area >= 0) {
      return repColMap.area + 1;
    }
    return repColMap[key] >= 0 ? (repColMap[key] + 1) : Number(adminCol1Based);
  }
  if (Array.isArray(adminHeaders) && Array.isArray(repHeaders) && zeroIdx >= 0 && zeroIdx < adminHeaders.length) {
    var srcLabel = normAr(adminHeaders[zeroIdx]);
    if (srcLabel) {
      for (var ri = 0; ri < repHeaders.length; ri++) {
        if (normAr(repHeaders[ri]) === srcLabel) return ri + 1;
      }
    }
  }
  return Number(adminCol1Based);
}

function copySinglePivotTable(pt, targetTab, repSourceRange, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var anchorA1 = 'A1';
  try { anchorA1 = pt.getAnchorCell().getA1Notation(); } catch (e) {}
  var newPt = targetTab.getRange(anchorA1).createPivotTable(repSourceRange);
  var rGroups = typeof pt.getRowGroups === 'function' ? pt.getRowGroups() : [];
  for (var rgIdx = 0; rgIdx < rGroups.length; rgIdx++) {
    var rg = rGroups[rgIdx];
    var targetRCol = mapAdminColToRepCol(rg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newRg = newPt.addRowGroup(targetRCol);
    try { if (typeof rg.totalsAreShown === 'function') newRg.showTotals(rg.totalsAreShown()); } catch (e1) {}
    try { if (typeof rg.areLabelsRepeated === 'function' && rg.areLabelsRepeated()) newRg.showRepeatedLabels(); } catch (e2) {}
    try { if (typeof rg.isSortAscending === 'function') { if (rg.isSortAscending()) newRg.sortAscending(); else newRg.sortDescending(); } } catch (e3) {}
  }
  var cGroups = typeof pt.getColumnGroups === 'function' ? pt.getColumnGroups() : [];
  for (var cgIdx = 0; cgIdx < cGroups.length; cgIdx++) {
    var cg = cGroups[cgIdx];
    var targetCCol = mapAdminColToRepCol(cg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newCg = newPt.addColumnGroup(targetCCol);
    try { if (typeof cg.totalsAreShown === 'function') newCg.showTotals(cg.totalsAreShown()); } catch (e4) {}
    try { if (typeof cg.areLabelsRepeated === 'function' && cg.areLabelsRepeated()) newCg.showRepeatedLabels(); } catch (e5) {}
    try { if (typeof cg.isSortAscending === 'function') { if (cg.isSortAscending()) newCg.sortAscending(); else newCg.sortDescending(); } } catch (e6) {}
  }
  var pVals = typeof pt.getPivotValues === 'function' ? pt.getPivotValues() : [];
  for (var pvIdx = 0; pvIdx < pVals.length; pvIdx++) {
    var pv = pVals[pvIdx];
    var targetVCol = mapAdminColToRepCol(pv.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var fn = typeof pv.getSummarizedBy === 'function' ? pv.getSummarizedBy() : (SpreadsheetApp.PivotTableSummarizeFunction ? SpreadsheetApp.PivotTableSummarizeFunction.SUM : 'SUM');
    var newPv = newPt.addPivotValue(targetVCol, fn);
    try { var dn = typeof pv.getDisplayName === 'function' ? pv.getDisplayName() : ''; if (dn) newPv.setDisplayName(dn); } catch (e7) {}
    try {
      if (typeof pv.getDisplayType === 'function' && typeof newPv.showAs === 'function') {
        var dispType = pv.getDisplayType();
        if (dispType && String(dispType) !== 'DEFAULT') newPv.showAs(dispType);
      }
    } catch (e7b) {}
  }
  var pFilters = typeof pt.getFilters === 'function' ? pt.getFilters() : [];
  for (var pfIdx = 0; pfIdx < pFilters.length; pfIdx++) {
    var pf = pFilters[pfIdx];
    try {
      var targetFCol = mapAdminColToRepCol(pf.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
      var crit = typeof pf.getFilterCriteria === 'function' ? pf.getFilterCriteria() : null;
      if (crit) newPt.addFilter(targetFCol, crit);
    } catch (e8) {}
  }
  return newPt;
}

function ensureSheetMinRows(sheet, minRows) {
  var targetMin = minRows || 1000;
  var curMax = typeof sheet.getMaxRows === 'function' ? sheet.getMaxRows() : Math.max(sheet.getLastRow() + 50, targetMin);
  if (typeof sheet.getMaxRows === 'function' && curMax < targetMin && typeof sheet.insertRowsAfter === 'function' && curMax > 0) {
    try {
      sheet.insertRowsAfter(curMax, targetMin - curMax);
      curMax = sheet.getMaxRows();
    } catch (e) {}
  }
  return Math.max(1, curMax);
}

function fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet) {
  if (!adminSs || !adminDataSheet) return;
  var sheets = adminSs.getSheets();
  var adminHeaders = adminDataSheet.getLastRow() > 0 ? adminDataSheet.getRange(1, 1, 1, Math.max(16, adminDataSheet.getLastColumn())).getValues()[0] : getExpectedCols(adminDataSheet);
  var colMap = resolveColMap(adminHeaders);
  var maxRows = ensureSheetMinRows(adminDataSheet, 1000);
  var srcRange = adminDataSheet.getRange(1, 1, maxRows, adminHeaders.length);
  for (var i = 0; i < sheets.length; i++) {
    var tab = sheets[i];
    if (normAr(tab.getName()).indexOf('منطق') === -1) continue;
    var pts = typeof tab.getPivotTables === 'function' ? tab.getPivotTables() : [];
    if (pts.length === 0) continue;
    var pt0 = pts[0];
    var rGroups = typeof pt0.getRowGroups === 'function' ? pt0.getRowGroups() : [];
    if (rGroups.length > 0 && colMap.area >= 0 && rGroups[0].getSourceDataColumn() !== colMap.area + 1) {
      var anchorA1 = 'A1';
      try { anchorA1 = pt0.getAnchorCell().getA1Notation(); } catch (e) {}
      var colGroups = typeof pt0.getColumnGroups === 'function' ? pt0.getColumnGroups() : [];
      var vals = typeof pt0.getPivotValues === 'function' ? pt0.getPivotValues() : [];
      var filts = typeof pt0.getFilters === 'function' ? pt0.getFilters() : [];
      var snapRg = [];
      for (var ri = 0; ri < rGroups.length; ri++) {
        snapRg.push({
          col: mapAdminColToRepCol(rGroups[ri].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof rGroups[ri].totalsAreShown === 'function' ? rGroups[ri].totalsAreShown() : true,
          repeat: typeof rGroups[ri].areLabelsRepeated === 'function' ? rGroups[ri].areLabelsRepeated() : false,
          sortAsc: typeof rGroups[ri].isSortAscending === 'function' ? rGroups[ri].isSortAscending() : null
        });
      }
      var snapCg = [];
      for (var ci = 0; ci < colGroups.length; ci++) {
        snapCg.push({
          col: mapAdminColToRepCol(colGroups[ci].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof colGroups[ci].totalsAreShown === 'function' ? colGroups[ci].totalsAreShown() : true
        });
      }
      var snapVal = [];
      for (var vi = 0; vi < vals.length; vi++) {
        snapVal.push({ col: mapAdminColToRepCol(vals[vi].getSourceDataColumn(), colMap, colMap, tab.getName()), fn: typeof vals[vi].getSummarizedBy === 'function' ? vals[vi].getSummarizedBy() : 'SUM', dn: typeof vals[vi].getDisplayName === 'function' ? vals[vi].getDisplayName() : '' });
      }
      var snapFilt = [];
      for (var fi = 0; fi < filts.length; fi++) {
        try {
          var critF = typeof filts[fi].getFilterCriteria === 'function' ? filts[fi].getFilterCriteria() : null;
          if (critF) snapFilt.push({ col: mapAdminColToRepCol(filts[fi].getSourceDataColumn(), colMap, colMap, tab.getName()), crit: critF });
        } catch (fe) {}
      }
      tab.clear();
      var rebuilt = tab.getRange(anchorA1).createPivotTable(srcRange);
      for (var si = 0; si < snapRg.length; si++) {
        var ng = rebuilt.addRowGroup(snapRg[si].col);
        try { ng.showTotals(snapRg[si].totals); } catch (e1) {}
        try { if (snapRg[si].repeat) ng.showRepeatedLabels(); } catch (e1b) {}
        try { if (snapRg[si].sortAsc === true) ng.sortAscending(); else if (snapRg[si].sortAsc === false) ng.sortDescending(); } catch (e1c) {}
      }
      for (var sc = 0; sc < snapCg.length; sc++) {
        var nc = rebuilt.addColumnGroup(snapCg[sc].col);
        try { nc.showTotals(snapCg[sc].totals); } catch (e1d) {}
      }
      for (var sv = 0; sv < snapVal.length; sv++) {
        var nv = rebuilt.addPivotValue(snapVal[sv].col, snapVal[sv].fn);
        try { if (snapVal[sv].dn) nv.setDisplayName(snapVal[sv].dn); } catch (e2) {}
      }
      for (var sf = 0; sf < snapFilt.length; sf++) {
        try { rebuilt.addFilter(snapFilt[sf].col, snapFilt[sf].crit); } catch (e3) {}
      }
      try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (e4) {}
    }
  }
}

function cloneAdminTabsAndPivotsToTarget(targetSpreadsheetId, options) {
  if (TEMPLATE_SYNC_GUARD) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'sync_guard_active' };
  TEMPLATE_SYNC_GUARD = true;
  var tabsOnly = Boolean(options && options.tabsOnly);
  try {
    var adminSs = getTargetSpreadsheet(SPREADSHEET_ID);
    var targetId = extractSheetIdFromUrl(targetSpreadsheetId) || String(targetSpreadsheetId || '').trim();
    if (!adminSs || !targetId || targetId === ADMIN_USERS_SHEET_ID) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'invalid_target_or_admin' };
    }
    var adminDataSheet = findInvoiceDataSheet(adminSs);
    if (!adminDataSheet) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'no_admin_data_sheet' };

    setupSheet(adminDataSheet);
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fAdm) {}
    fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet);

    if (targetId === SPREADSHEET_ID) {
      return { synced: true, sheetName: adminSs.getName ? adminSs.getName() : '', tabsCount: adminSs.getSheets().length, pivotsCount: 0, tabNames: [], errorDetails: '' };
    }

    var targetSs = null;
    try { targetSs = SpreadsheetApp.openById(targetId); } catch (openErr) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'تعذر فتح الشيت (تأكد من صلاحيات المشاركة): ' + String(openErr) };
    }
    if (!targetSs) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'null_target_spreadsheet' };
    }
    var targetSheetTitle = '';
    try { targetSheetTitle = typeof targetSs.getName === 'function' ? targetSs.getName() : ''; } catch (nErr) {}

    var repFirst = targetSs.getSheets()[0];
    if (repFirst && isUsersSheetObj(repFirst)) {
      return { synced: false, sheetName: targetSheetTitle, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'target_is_master_users_sheet' };
    }

    var targetDataSheet = findInvoiceDataSheet(targetSs);
    try {
      if (!targetDataSheet) targetDataSheet = targetSs.insertSheet('الفواتير');
      setupSheet(targetDataSheet);
    } catch (permErr) {
      return {
        synced: false,
        sheetName: targetSheetTitle,
        tabsCount: 0,
        pivotsCount: 0,
        tabNames: [],
        errorDetails: 'لا توجد صلاحية تعديل (Editor) على شيت المندوب — شاركه مع حساب باقر كـ Editor: ' + String(permErr)
      };
    }

    var adminHeaders = getExpectedCols(adminDataSheet);
    var repHeaders = getExpectedCols(targetDataSheet);
    if (adminHeaders.length > repHeaders.length) {
      for (var eh = repHeaders.length; eh < adminHeaders.length; eh++) {
        repHeaders.push(adminHeaders[eh]);
        targetDataSheet.getRange(1, eh + 1).setValue(adminHeaders[eh]).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fRep1) {}

    var adminColMap = resolveColMap(adminHeaders);
    var repColMap = resolveColMap(repHeaders);
    var repMaxRows = ensureSheetMinRows(targetDataSheet, Math.max(targetDataSheet.getLastRow() + 200, 1000));
    var repSourceRange = targetDataSheet.getRange(1, 1, repMaxRows, repHeaders.length);

    var adminDataName = adminDataSheet.getName();
    var repDataName = targetDataSheet.getName();
    var adminSheets = adminSs.getSheets();
    var tabsCount = 0;
    var pivotsCount = 0;
    var tabNames = [];
    var tabErrors = [];

    for (var sIdx = 0; sIdx < adminSheets.length; sIdx++) {
      var s = adminSheets[sIdx];
      var sName = String(s.getName() || '').trim();
      if (sName === adminDataName || isUsersSheetObj(s)) continue;

      try {
        var targetTab = targetSs.getSheetByName(sName) || targetSs.insertSheet(sName);
        try { targetTab.setRightToLeft(true); } catch (rtlErr) {}
        try { var tc = typeof s.getTabColor === 'function' ? s.getTabColor() : null; if (tc) targetTab.setTabColor(tc); } catch (tcErr) {}

        var existingOldPts = typeof targetTab.getPivotTables === 'function' ? targetTab.getPivotTables() : [];
        for (var op = existingOldPts.length - 1; op >= 0; op--) {
          try { if (typeof existingOldPts[op].remove === 'function') existingOldPts[op].remove(); } catch (rmErr) {}
        }
        targetTab.clear();

        var adminPts = typeof s.getPivotTables === 'function' ? s.getPivotTables() : [];
        if (adminPts.length > 0 && !tabsOnly) {
          for (var ptIdx = 0; ptIdx < adminPts.length; ptIdx++) {
            copySinglePivotTable(adminPts[ptIdx], targetTab, repSourceRange, adminColMap, repColMap, sName, adminHeaders, repHeaders);
            pivotsCount++;
            try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fPt) {}
          }
        } else {
          var lr = s.getLastRow();
          var lc = s.getLastColumn();
          if (lr > 0 && lc > 0) {
            var srcRng = s.getRange(1, 1, lr, lc);
            var vals = srcRng.getValues();
            var forms = typeof srcRng.getFormulas === 'function' ? srcRng.getFormulas() : [];
            var destRng = targetTab.getRange(1, 1, lr, lc);
            var mergedOut = [];
            var escAdmin = adminDataName.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
            var refRegex = new RegExp("('?" + escAdmin + "'?)!", 'g');
            for (var rr = 0; rr < lr; rr++) {
              var lineOut = [];
              for (var cc = 0; cc < lc; cc++) {
                var f = (forms[rr] && forms[rr][cc]) ? String(forms[rr][cc]) : '';
                if (f && f.charAt(0) === '=') {
                  lineOut.push(f.replace(refRegex, "'" + repDataName + "'!"));
                } else {
                  lineOut.push(vals[rr][cc]);
                }
              }
              mergedOut.push(lineOut);
            }
            destRng.setValues(mergedOut);
            try { targetTab.autoResizeColumns(1, lc); } catch (rcErr) {}
          }
        }
        tabNames.push(sName);
        tabsCount++;
      } catch (tabErr) {
        tabErrors.push(sName + ': ' + String(tabErr));
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fEnd) {}
    return {
      synced: tabsCount > 0 || tabErrors.length === 0,
      sheetName: targetSheetTitle,
      tabsCount: tabsCount,
      pivotsCount: pivotsCount,
      tabNames: tabNames,
      errorDetails: tabErrors.join(' | ')
    };
  } catch (outerErr) {
    return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(outerErr) };
  } finally {
    TEMPLATE_SYNC_GUARD = false;
  }
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
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

    if (actionName === 'register_user' || actionName === 'add_user' || actionName === 'upsert_user' || actionName === 'seed_users') {
      var usersSheet = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي للمستخدمين' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensureGemColIdx = ensureMasterGeminiColumn(usersSheet);
      var headersU = usersSheet.getRange(1, 1, 1, Math.max(5, usersSheet.getLastColumn())).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      if (uMap.geminiCol < 0) uMap.geminiCol = ensureGemColIdx;
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
        var totalUCols = Math.max(5, headersU.length);
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
        var newUserSheetId = extractSheetIdFromUrl(u.sheet_url || u.sheet_id);
        if (newUserSheetId) {
          try { cloneAdminTabsAndPivotsToTarget(newUserSheetId); } catch (tErr) {}
        }
        currentUsers.push({ full_name: uName, email: uEmail });
        inserted++;
      }
      try { usersSheet.autoResizeColumns(1, Math.max(5, headersU.length)); } catch (ue) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        inserted: inserted,
        message: 'تم حفظ المستخدم وتجهيز شيته بنفس أوراق الأدمن في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'set_shared_gemini_key') {
      var usersSheetGem = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetGem) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var gemKeyVal = String(payload.gemini_api_key || payload.geminiApiKey || '').trim();
      var targetGemCol = ensureMasterGeminiColumn(usersSheetGem);
      propagateGeminiKeyToAllUserRows(usersSheetGem, targetGemCol, gemKeyVal);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        gemini_api_key: gemKeyVal,
        message: 'تم تحديث مفتاح Gemini في العمود E وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'unify_admin_webhook') {
      var usersSheetUni = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUni) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      ensureMasterGeminiColumn(usersSheetUni);
      var headersUni = usersSheetUni.getRange(1, 1, 1, Math.max(5, usersSheetUni.getLastColumn())).getValues()[0];
      var uMapUni = resolveUserColMap(headersUni);
      var centralUrl = String(payload.centralWebhookUrl || payload.webhookUrl || '').trim();
      var clearNonAdmin = String(payload.mode || '') === 'clear';
      var lastRowUni = usersSheetUni.getLastRow();
      var updatedUni = 0;
      for (var ur = 2; ur <= lastRowUni; ur++) {
        var rNameU = String(usersSheetUni.getRange(ur, uMapUni.nameCol + 1).getValue() || '').trim();
        if (!rNameU) continue;
        var valToWrite = clearNonAdmin && !isBaqerName(rNameU, '') ? '' : centralUrl;
        usersSheetUni.getRange(ur, uMapUni.webhookCol + 1).setValue(valToWrite);
        updatedUni++;
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        updated: updatedUni,
        message: 'تم توحيد رابط السكربت المركزي لـ ' + updatedUni + ' حساب في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'sync_template_to_all' || actionName === 'sync_tabs_only') {
      var tabsOnlyMode = actionName === 'sync_tabs_only' || payload.mode === 'tabs_only';
      var adminSsMain = getTargetSpreadsheet(SPREADSHEET_ID);
      var adminDataOnly = findInvoiceDataSheet(adminSsMain);
      if (adminDataOnly) {
        setupSheet(adminDataOnly);
        try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (flA) {}
        fixAdminAreaPivotIfNeeded(adminSsMain, adminDataOnly);
      }
      var targetIds = [];
      if (payload.targetSpreadsheetId) {
        var singleTId = extractSheetIdFromUrl(payload.targetSpreadsheetId);
        if (singleTId) targetIds.push(singleTId);
      } else {
        var usersSheetTpl = getOrCreateUsersSheet(payload.adminSpreadsheetId || ADMIN_USERS_SHEET_ID);
        var uListTpl = readAllSheetUsers(usersSheetTpl);
        for (var ui2 = 0; ui2 < uListTpl.length; ui2++) {
          var sidRep = extractSheetIdFromUrl(uListTpl[ui2].sheet_id);
          if (sidRep && sidRep !== SPREADSHEET_ID && targetIds.indexOf(sidRep) === -1) {
            targetIds.push(sidRep);
          }
        }
        if (Array.isArray(payload.targetIds)) {
          for (var ti = 0; ti < payload.targetIds.length; ti++) {
            var extraSid = extractSheetIdFromUrl(payload.targetIds[ti]);
            if (extraSid && extraSid !== SPREADSHEET_ID && targetIds.indexOf(extraSid) === -1) {
              targetIds.push(extraSid);
            }
          }
        }
      }
      var syncResults = [];
      var syncedCount = 0;
      for (var sLoop = 0; sLoop < targetIds.length; sLoop++) {
        var curSid = targetIds[sLoop];
        try {
          var resClone = cloneAdminTabsAndPivotsToTarget(curSid, { tabsOnly: tabsOnlyMode });
          if (resClone.synced) syncedCount++;
          syncResults.push({
            sheetId: curSid,
            sheetName: resClone.sheetName || '',
            ok: resClone.synced,
            tabsCount: resClone.tabsCount,
            pivotsCount: resClone.pivotsCount,
            tabNames: resClone.tabNames || [],
            errorDetails: resClone.errorDetails || ''
          });
        } catch (repErr) {
          syncResults.push({ sheetId: curSid, sheetName: '', ok: false, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(repErr) });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        tabsOnly: tabsOnlyMode,
        updatedSheets: syncedCount,
        totalTargets: targetIds.length,
        results: syncResults,
        message: 'تمت مزامنة أوراق و Pivot Tables الأدمن مع (' + syncedCount + ' / ' + targetIds.length + ') شيتات بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'update_user') {
      var usersSheetUpd = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUpd) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensuredUpdGemCol = ensureMasterGeminiColumn(usersSheetUpd);
      var dataUpd = usersSheetUpd.getDataRange().getValues();
      var headersUpd = dataUpd[0] || [];
      var uMapUpd = resolveUserColMap(headersUpd);
      if (uMapUpd.geminiCol < 0) uMapUpd.geminiCol = ensuredUpdGemCol;
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
        var cleanUrlStr = String(payload.newSheetUrl).trim();
        usersSheetUpd.getRange(targetRow, uMapUpd.sheetCol + 1).setValue(cleanUrlStr);
        var updatedSid = extractSheetIdFromUrl(cleanUrlStr);
        if (updatedSid && updatedSid !== SPREADSHEET_ID) {
          try { cloneAdminTabsAndPivotsToTarget(updatedSid); } catch (uSyncErr) {}
        }
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
      var targetForSync = extractSheetIdFromUrl(payload.spreadsheetId) || SPREADSHEET_ID;
      var syncTplRes = { synced: false, tabsCount: 0, pivotsCount: 0 };
      try { syncTplRes = cloneAdminTabsAndPivotsToTarget(targetForSync); } catch (reSyncErr) {}
      try { sheet.autoResizeColumns(1, Math.max(16, sheet.getLastColumn())); } catch (errR) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        templateSynced: syncTplRes.synced,
        tabsCount: syncTplRes.tabsCount,
        pivotsCount: syncTplRes.pivotsCount,
        message: 'تم توحيد الأعمدة (المنطقة قبل المدينة) واستنساخ أوراق الأدمن و Pivot Tables بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
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

    if (actionName && !Array.isArray(payload.rows)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        script_version: SCRIPT_VERSION,
        error: 'أمر غير مدعوم أو تنسيق طلب غير مكتمل: ' + actionName
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
      message: 'تم إدراج ' + addedCount + ' سطراً جديداً بترتيب الأعمدة الموحّد بنجاح.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    var activeSheet = (e && e.range && typeof e.range.getSheet === 'function') ? e.range.getSheet() : null;
    if (activeSheet && isUsersSheetObj(activeSheet)) {
      var lastC = Math.max(5, activeSheet.getLastColumn());
      var headersU = activeSheet.getRange(1, 1, 1, lastC).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      var editedCol = (e && e.range && typeof e.range.getColumn === 'function') ? (e.range.getColumn() - 1) : -1;
      if (editedCol >= 4 && (uMap.geminiCol === editedCol || uMap.geminiCol < 0)) {
        var gCol = ensureMasterGeminiColumn(activeSheet, editedCol);
        var editedVal = String(e.range.getValue() || '').trim();
        if (editedVal && /^(AIza|AQ\\.)/.test(editedVal)) {
          propagateGeminiKeyToAllUserRows(activeSheet, gCol, editedVal);
        }
      }
      return;
    }
    var sheet = activeSheet || getTargetSheet();
    if (sheet && !isUsersSheetObj(sheet) && !sheetHasPivotTables(sheet)) {
      highlightDuplicatesInSheet(sheet);
    }
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
        area:           colMap.area >= 0 ? String(row[colMap.area] || '') : detectAreaFromPh(phName),
        city:           colMap.city >= 0 ? String(row[colMap.city] || 'بغداد') : 'بغداد',
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
  if (uSheet) ensureMasterGeminiColumn(uSheet);
  var adminSheet = getTargetSheet(SPREADSHEET_ID);
  if (adminSheet && !isUsersSheetObj(adminSheet)) {
    setupSheet(adminSheet);
    try { fixAdminAreaPivotIfNeeded(getTargetSpreadsheet(SPREADSHEET_ID), adminSheet); } catch (e) {}
  }
  Logger.log('تم التحقق من الجداول والترقية بنجاح (v' + SCRIPT_VERSION + ').');
}`;
