import type { ResultRecord } from '../store'
import type { TrackId } from '../data/tracks'
import { isCategoryId, knowledgeAgreement, knowledgeView } from './priorities'
import type { Agreement } from './priorities'

/**
 * «رمز النتيجة» — result code, format v1 (shared with the team radar, wave 3).
 *
 * What it holds, and nothing else: format version, the role CATEGORY (one of 5 — never the
 * precise role), the 8 self-ratings rounded to 0.5, the 8 scenario scores 0–3 (or absent),
 * the 8 knowledge-check agreement flags, the month of the assessment, and a checksum.
 * No name, no answers, no entity. Sharing it is the user's decision; it never goes in a URL
 * path (a deep link may only use the hash `#r=`, which is not sent to any server).
 *
 * Bit layout (90 payload bits = 18 base32 symbols, then a 10-bit checksum = 2 symbols → 20):
 *   version 4 | category 3 (0–4; 7 = not stated) | self 8×4 (score×2, 0–8)
 *   | scenario 8×3 (0 = absent, 1–4 = score 0–3) | agreement 8×2 (0 none, 1 consistent,
 *   2 self above check, 3 check above self) | month 10 (months since 2024-01) | pad 1
 * Checksum: Σ (i+1)·symbol_i mod 1021 over the 18 payload symbols — detects every
 * single-symbol error and every adjacent transposition.
 * Alphabet: Crockford base32 (no I, L, O, U). Decoding ignores case, spaces and hyphens and
 * reads O as 0 and I/L as 1.
 */

export const RESULT_CODE_VERSION = 1
/** Fixed domain order of format v1 (independent of the order in domains.ts). */
export const CODE_DOMAINS = ['ai-data', 'cyber', 'cloud', 'service-design', 'policy', 'agile', 'emerging', 'leadership'] as const
export const CODE_CATEGORIES: readonly TrackId[] = ['awareness', 'applied', 'specialist', 'team_lead', 'executive']
export const CODE_LENGTH = 20

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const BASE_YEAR = 2024
const AGREEMENTS: (Agreement | null)[] = [null, 'consistent', 'self_higher', 'check_higher']
const PAYLOAD_SYMBOLS = 18
const CHECK_MOD = 1021

export interface DecodedResult {
  version: 1
  category: TrackId | null
  /** self-ratings 0–4 in steps of 0.5, in CODE_DOMAINS order */
  self: number[]
  /** scenario scores 0–3 or null when absent, in CODE_DOMAINS order */
  scenario: (number | null)[]
  /** knowledge-check agreement flags (null = not judged), in CODE_DOMAINS order */
  agreement: (Agreement | null)[]
  /** YYYY-MM */
  month: string
  domains: readonly string[]
}

function pushBits(bits: number[], value: number, width: number) {
  for (let i = width - 1; i >= 0; i--) bits.push((value >> i) & 1)
}

function readBits(bits: number[], pos: { i: number }, width: number): number {
  let v = 0
  for (let k = 0; k < width; k++) v = (v << 1) | bits[pos.i++]
  return v
}

function checksum(symbols: number[]): number {
  let sum = 0
  for (let i = 0; i < symbols.length; i++) sum = (sum + (i + 1) * symbols[i]) % CHECK_MOD
  return sum
}

/** Encode a saved result. Values outside their range are clamped. */
export function encodeResult(record: Pick<ResultRecord, 'trackId' | 'scores' | 'scenario' | 'knowledge' | 'calibration' | 'v' | 'date'>): string {
  const bits: number[] = []
  pushBits(bits, RESULT_CODE_VERSION, 4)
  const cat = isCategoryId(record.trackId) ? CODE_CATEGORIES.indexOf(record.trackId) : 7
  pushBits(bits, cat, 3)
  for (const d of CODE_DOMAINS) {
    const s = record.scores[d]
    pushBits(bits, Math.max(0, Math.min(8, Math.round((Number.isFinite(s) ? s : 0) * 2))), 4)
  }
  for (const d of CODE_DOMAINS) {
    const j = record.scenario?.[d]
    pushBits(bits, j === undefined || !Number.isFinite(j) ? 0 : 1 + Math.max(0, Math.min(3, Math.round(j))), 3)
  }
  for (const d of CODE_DOMAINS) {
    const a = knowledgeAgreement(Math.max(0, Math.min(4, record.scores[d] ?? 0)), knowledgeView(record, d))
    pushBits(bits, AGREEMENTS.indexOf(a), 2)
  }
  const date = new Date(record.date)
  const months = Number.isNaN(date.getTime()) ? 0 : (date.getUTCFullYear() - BASE_YEAR) * 12 + date.getUTCMonth()
  pushBits(bits, Math.max(0, Math.min(1023, months)), 10)
  pushBits(bits, 0, 1) // pad to 90 bits
  const symbols: number[] = []
  const pos = { i: 0 }
  for (let k = 0; k < PAYLOAD_SYMBOLS; k++) symbols.push(readBits(bits, pos, 5))
  const c = checksum(symbols)
  symbols.push((c >> 5) & 31, c & 31)
  return symbols.map((v) => ALPHABET[v]).join('')
}

/** Human-friendly grouping for display and copying: XXXXX-XXXXX-XXXXX-XXXXX. */
export function formatCode(code: string): string {
  return (code.match(/.{1,5}/g) ?? []).join('-')
}

function normalize(input: string): string {
  return input
    .toUpperCase()
    .replace(/[\s-]+/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
}

/** Decode a code; returns null for a wrong length, alphabet, checksum, version or field range. */
export function decodeResult(input: string): DecodedResult | null {
  if (typeof input !== 'string') return null
  const code = normalize(input)
  if (code.length !== CODE_LENGTH) return null
  const symbols: number[] = []
  for (const ch of code) {
    const v = ALPHABET.indexOf(ch)
    if (v < 0) return null
    symbols.push(v)
  }
  const payload = symbols.slice(0, PAYLOAD_SYMBOLS)
  const check = (symbols[PAYLOAD_SYMBOLS] << 5) | symbols[PAYLOAD_SYMBOLS + 1]
  if (check !== checksum(payload)) return null
  const bits: number[] = []
  for (const s of payload) pushBits(bits, s, 5)
  const pos = { i: 0 }
  if (readBits(bits, pos, 4) !== RESULT_CODE_VERSION) return null
  const cat = readBits(bits, pos, 3)
  if (cat > 4 && cat !== 7) return null
  const self: number[] = []
  for (let k = 0; k < 8; k++) {
    const v = readBits(bits, pos, 4)
    if (v > 8) return null
    self.push(v / 2)
  }
  const scenario: (number | null)[] = []
  for (let k = 0; k < 8; k++) {
    const v = readBits(bits, pos, 3)
    if (v > 4) return null
    scenario.push(v === 0 ? null : v - 1)
  }
  const agreement: (Agreement | null)[] = []
  for (let k = 0; k < 8; k++) agreement.push(AGREEMENTS[readBits(bits, pos, 2)])
  const months = readBits(bits, pos, 10)
  if (readBits(bits, pos, 1) !== 0) return null
  const year = BASE_YEAR + Math.floor(months / 12)
  const month = (months % 12) + 1
  return {
    version: 1,
    category: cat === 7 ? null : CODE_CATEGORIES[cat],
    self,
    scenario,
    agreement,
    month: `${year}-${String(month).padStart(2, '0')}`,
    domains: CODE_DOMAINS,
  }
}
