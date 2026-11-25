/**
 * Gemini-Only Invoice Extraction Pipeline — Resilient Server-Side Engine
 *
 * المزايا الأساسية:
 * 1. Google Gemini Vision فقط (تمت إزالة Tesseract OCR المحلي).
 * 2. Cache (SHA-256): يمنع إرسال نفس صورة الفاتورة مرتين إلى Gemini.
 * 3. Retry (3 محاولات مع Exponential Backoff): يعيد المحاولة تلقائياً عند الأخطاء المؤقتة.
 * 4. Circuit Breaker (قاطع دائرة لمدة 10 دقائق): عند تلقي 429 أو 403 من Gemini، يفتح القاطع
 *    لمدة 10 دقائق لهذا المفتاح ويرجع للمدخل اليدوي مباشرة بانتظار المراجعة.
 * 5. needsReview: أي نتيجة ذات ثقة < 75% أو عند تعذر القراءة الآلية تُوسَم بـ needsReview: true.
 */

import crypto from 'crypto';
import fs from 'fs';
import { ENV } from '../../config/env';
import { extractInvoiceWithGeminiDetailed, GeminiDetailedOutcome, detectDosageForm } from './geminiVisionOcr';

export interface PipelineRawItem {
  product_id?: string;
  product_name: string;
  dosage_form?: string;
  quantity: number;
  unit_price?: number;
  bonus_quantity?: number;
  line_total?: number;
}

export interface OcrPipelineResult {
  ocr_engine: 'gemini_vision' | 'manual_fallback' | 'none';
  invoice_number: string;
  invoice_date: string;
  pharmacy_name: string;
  pharmacy_area: string;
  matched_pharmacy_id?: string;
  warehouse_name?: string;
  raw_items: PipelineRawItem[];
  recognized_text?: string;
  confidence: number;
  needsReview: boolean;
  needsReviewReason?: string;
  cached: boolean;
  circuitBreakerOpen: boolean;
  geminiError?: string;
}

export interface RunPipelineOptions {
  originalName: string;
  mimeType: string;
  customGeminiKey?: string;
  pharmacies: any[];
  products: any[];
  /** حقن اختياري للاختبارات الآلية */
  geminiRunner?: (filePath: string, apiKey?: string) => Promise<GeminiDetailedOutcome>;
}

const CACHE_TTL_MS = 30 * 60 * 1000;      // 30 دقيقة
const MAX_CACHE_ENTRIES = 200;
const CIRCUIT_OPEN_MS = 10 * 60 * 1000;   // 10 دقائق عند 403 / 429
const MAX_RETRY_ATTEMPTS = 3;

interface CachedEntry {
  expiresAt: number;
  value: OcrPipelineResult;
}

interface BreakerState {
  openUntil: number;
  reason: string;
  statusCode?: number;
}

const shaCache = new Map<string, CachedEntry>();
const circuitBreakers = new Map<string, BreakerState>();

function keyFingerprint(apiKey?: string): string {
  const effective = (apiKey || '').trim() || ENV.GEMINI_API_KEY || 'no-key';
  return crypto.createHash('sha256').update(effective).digest('hex').slice(0, 12);
}

export function computeFileSha256(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function getOcrCircuitBreakerStatus(apiKey?: string): { open: boolean; remainingMs: number; reason?: string } {
  const fp = keyFingerprint(apiKey);
  const st = circuitBreakers.get(fp);
  if (!st) return { open: false, remainingMs: 0 };
  const remainingMs = st.openUntil - Date.now();
  if (remainingMs <= 0) {
    circuitBreakers.delete(fp);
    return { open: false, remainingMs: 0 };
  }
  return { open: true, remainingMs, reason: st.reason };
}

export function tripOcrCircuitBreaker(apiKey: string | undefined, reason: string, statusCode?: number) {
  const fp = keyFingerprint(apiKey);
  circuitBreakers.set(fp, {
    openUntil: Date.now() + CIRCUIT_OPEN_MS,
    reason,
    statusCode
  });
}

export function resetOcrPipelineState() {
  shaCache.clear();
  circuitBreakers.clear();
}

function setCachedResult(cacheKey: string, value: OcrPipelineResult) {
  if (shaCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = shaCache.keys().next().value;
    if (oldestKey) shaCache.delete(oldestKey);
  }
  shaCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value
  });
}

function getCachedResult(cacheKey: string): OcrPipelineResult | null {
  const entry = shaCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    shaCache.delete(cacheKey);
    return null;
  }
  return entry.value;
}

/**
 * استدعاء Gemini مع Retry 3 مرات + Exponential Backoff، واحترام قاطع الدائرة 10 دقائق عند 403/429
 */
async function invokeGeminiWithRetryAndBreaker(
  filePath: string,
  customApiKey: string | undefined,
  geminiRunner: (filePath: string, apiKey?: string) => Promise<GeminiDetailedOutcome>
): Promise<{ outcome: GeminiDetailedOutcome | null; circuitOpen: boolean; skippedReason?: string }> {
  const breaker = getOcrCircuitBreakerStatus(customApiKey);
  if (breaker.open) {
    const minsLeft = Math.ceil(breaker.remainingMs / 60000);
    return {
      outcome: null,
      circuitOpen: true,
      skippedReason: `قاطع الدائرة مفعّل مؤقتاً (${minsLeft} دقيقة متبقية): ${breaker.reason}`
    };
  }

  let lastOutcome: GeminiDetailedOutcome | null = null;

  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    const outcome = await geminiRunner(filePath, customApiKey);
    lastOutcome = outcome;

    if (outcome.result && outcome.result.items.length > 0) {
      return { outcome, circuitOpen: false };
    }

    if (outcome.shouldTripCircuit || outcome.statusCode === 403) {
      if (attempt < MAX_RETRY_ATTEMPTS && outcome.statusCode === 429) {
        const waitMs = 600 * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      tripOcrCircuitBreaker(
        customApiKey,
        outcome.errorMessage || `Gemini HTTP ${outcome.statusCode}`,
        outcome.statusCode
      );
      return { outcome, circuitOpen: true };
    }

    if (attempt < MAX_RETRY_ATTEMPTS) {
      const waitMs = 500 * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }

  return { outcome: lastOutcome, circuitOpen: false };
}

/**
 * الدالة الرئيسية لقراءة الفواتير عبر Google Gemini فقط (Cache -> Gemini + Retry + Circuit Breaker -> Manual Fallback)
 */
export async function runInvoiceOcrPipeline(
  filePath: string,
  opts: RunPipelineOptions
): Promise<OcrPipelineResult> {
  const isPdf = opts.mimeType === 'application/pdf' || opts.originalName.toLowerCase().endsWith('.pdf');
  const defaultInvNum = `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const defaultDate = new Date().toISOString().split('T')[0];

  if (!fs.existsSync(filePath)) {
    return {
      ocr_engine: 'none',
      invoice_number: defaultInvNum,
      invoice_date: defaultDate,
      pharmacy_name: '',
      pharmacy_area: '',
      raw_items: [],
      confidence: 0,
      needsReview: true,
      needsReviewReason: 'تعذر العثور على الملف المرفوع لقراءته.',
      cached: false,
      circuitBreakerOpen: false
    };
  }

  // ── 1. Cache Check (SHA-256) ──────────────────────────────────────────────
  const sha256 = computeFileSha256(filePath);
  const cacheKey = `${sha256}:${keyFingerprint(opts.customGeminiKey)}:${isPdf ? 'pdf' : 'img'}`;
  const cachedHit = getCachedResult(cacheKey);
  if (cachedHit) {
    console.log(`⚡ [Gemini Cache Hit] SHA-256 ${sha256.slice(0, 12)} -> engine=${cachedHit.ocr_engine}`);
    return { ...cachedHit, cached: true };
  }

  const geminiRunner = opts.geminiRunner || extractInvoiceWithGeminiDetailed;

  let geminiError: string | undefined;
  let circuitOpen = false;

  // ── 2. Google Gemini Vision (with Retry x3 + Circuit Breaker 10m) ────────
  const effectiveKey = (opts.customGeminiKey || '').trim() || ENV.GEMINI_API_KEY;
  if (effectiveKey) {
    const gemTry = await invokeGeminiWithRetryAndBreaker(filePath, opts.customGeminiKey, geminiRunner);
    circuitOpen = gemTry.circuitOpen;
    geminiError = gemTry.skippedReason || gemTry.outcome?.errorMessage;

    const gemini = gemTry.outcome?.result;
    if (gemini && gemini.items.length > 0) {
      const lowConf = gemini.confidence < 0.75;
      const out: OcrPipelineResult = {
        ocr_engine: 'gemini_vision',
        invoice_number: gemini.invoice_number || defaultInvNum,
        invoice_date: gemini.invoice_date || defaultDate,
        pharmacy_name: gemini.pharmacy_name || '',
        pharmacy_area: gemini.pharmacy_area || '',
        warehouse_name: gemini.warehouse_name || '',
        raw_items: gemini.items.map(it => ({
          product_name: it.product_name,
          dosage_form: it.dosage_form || detectDosageForm(it.product_name),
          quantity: it.quantity || 10,
          unit_price: it.unit_price,
          bonus_quantity: it.bonus_quantity,
          line_total: it.line_total
        })),
        confidence: gemini.confidence,
        needsReview: lowConf,
        needsReviewReason: lowConf ? 'ثقة القراءة منخفضة، يرجى مراجعة الأصناف.' : undefined,
        cached: false,
        circuitBreakerOpen: false
      };
      setCachedResult(cacheKey, out);
      return out;
    }
  } else {
    geminiError = 'لم يتم توفير مفتاح Google Gemini API';
  }

  // ── 3. Manual Fallback (Gemini Only mode — no local Tesseract OCR) ────────
  const fallbackOut: OcrPipelineResult = {
    ocr_engine: 'manual_fallback',
    invoice_number: defaultInvNum,
    invoice_date: defaultDate,
    pharmacy_name: '',
    pharmacy_area: '',
    raw_items: [],
    confidence: 0,
    needsReview: true,
    needsReviewReason: geminiError
      ? `تعذرت القراءة عبر Gemini (${geminiError}) — يرجى إدخال ومراجعة البيانات يدوياً.`
      : 'مطلوب مفتاح Google Gemini للقراءة الآلية — يرجى تعبئة ومراجعة الفاتورة يدوياً.',
    cached: false,
    circuitBreakerOpen: circuitOpen,
    geminiError
  };

  setCachedResult(cacheKey, fallbackOut);
  return fallbackOut;
}
