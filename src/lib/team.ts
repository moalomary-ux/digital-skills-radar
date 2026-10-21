import type { TrackId } from '../data/tracks'
import type { L } from '../data/types'
import { categoryTargets, LEVEL_THRESHOLDS, levelValueForScore } from '../data/levels'
import { domains } from '../data/domains'
import { pathwayForDomain } from '../data/pathways'
import { transitionForScore } from '../data/learning'
import type { TransitionKey } from '../data/learning'
import { migrateRecord } from '../store'
import type { KnowledgeTally } from '../store'
import { CODE_CATEGORIES, CODE_DOMAINS, CODE_LENGTH, decodeResult, encodeResult } from './resultCode'
import type { DecodedResult } from './resultCode'
import { JUDGMENT_MISMATCH, priorities } from './priorities'
import type { Agreement, Reason } from './priorities'

/**
 * «رادار الفريق» — local aggregation of result codes (DECISION §3, wave 3, packet P8).
 *
 * Everything here is a pure function over decoded result codes. Guardrails enforced in code:
 *   - k-anonymity gate: `summarizeTeam`, `sharedPriorities` and `compareTeams` return nothing
 *     below TEAM_K valid, distinct codes, so no view can render a smaller group;
 *   - outputs are per domain only (counts, shares, five-number summaries, bins of identical
 *     values); no function returns a row per code or keeps a code next to its values;
 *   - identical codes count once (`duplicates`); codes older than STALE_AFTER_MONTHS are flagged
 *     and can be excluded; a month after the current month is invalid.
 *
 * Score scales (same as the individual results): self-rating 0–4 in steps of 0.5; scenario
 * judgment 0–3 shown on the 0–4 scale as J × 4/3; the cautious basis is min(self, judgment)
 * — the engine's `planScore`. Levels use the published thresholds (claim `method-level-thresholds`).
 */

/** No aggregate below this many valid, distinct codes (DECISION §3). */
export const TEAM_K = 5
/** Codes from more than this many months ago are flagged as old. */
export const STALE_AFTER_MONTHS = 6
/** «إتقان» starts at the second level threshold (2.25). */
export const PROFICIENCY_MIN = LEVEL_THRESHOLDS[1]
/**
 * Editorial rule: a domain carries an inflation risk when the team's mean self-rating sits at
 * least half a level above its mean scenario judgment (paired codes only, at least TEAM_K pairs).
 */
export const TEAM_INFLATION_GAP = 0.5
/** At most this many shared priorities (same as the individual engine). */
export const TEAM_PRIORITIES = 3

export type Basis = 'self' | 'cautious'
export type Layer = 'self' | 'judgment'
export type Staffing = 'build' | 'mentor' | 'borrow'

export interface TeamEntry {
  /** normalized code: used only to detect duplicates, never rendered */
  key: string
  decoded: DecodedResult
  stale: boolean
}

export interface ParsedTeamSet {
  /** valid, distinct codes used for the views (old codes removed when `excludeStale`) */
  entries: TeamEntry[]
  /** valid, distinct codes before the optional exclusion of old codes */
  valid: number
  invalid: number
  /** extra copies of a code already counted */
  duplicates: number
  /** valid, distinct codes older than STALE_AFTER_MONTHS */
  stale: number
  /** stale codes left out because `excludeStale` was on */
  excluded: number
  /** pieces of text that do not look like a code at all (headers, dates, notes) */
  ignored: number
}

export interface FiveNum {
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

export interface Bin {
  value: number
  count: number
}

export interface DomainTeamStats {
  domainId: string
  n: number
  self: FiveNum
  selfBins: Bin[]
  /** codes that carry a scenario answer in this domain */
  judgmentN: number
  /** null below TEAM_K scenario answers in this domain */
  judgment: FiveNum | null
  judgmentBins: Bin[] | null
  /** summary of the chosen basis (self, or the cautious min(self, judgment)) */
  basis: FiveNum
  basisMean: number
  /** indicative target 1–4 of the comparison category */
  target: number
  atOrAboveTarget: number
  /** share 0–1 at or above the target on the chosen basis */
  coverage: number
  /** codes at «إتقان» or above on the chosen basis */
  proficientOrAbove: number
  /** at most one code at «إتقان» or above */
  singlePoint: boolean
  pairedN: number
  /** mean(self − judgment on the 0–4 scale) over paired codes; null below TEAM_K pairs */
  meanGap: number | null
  /** share of paired codes whose self-rating is ≥ 1 level above the scenario; null below TEAM_K pairs */
  mismatchShare: number | null
  inflationRisk: boolean
  /** knowledge-check flags present in this domain */
  knowledgeJudged: number
  knowledgeSelfHigher: number
}

export interface TeamSummary {
  n: number
  category: TrackId
  basis: Basis
  domains: DomainTeamStats[]
  earliestMonth: string
  latestMonth: string
}

/* ------------------------------------------------------------------ parsing */

const CANDIDATE = /^[0-9A-Z]{16,24}$/
const ALNUM = /^[0-9A-Z]+$/

/** Same normalization as the decoder: case, spaces and hyphens ignored; O → 0, I/L → 1. */
export function normalizeCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[\s-]+/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
}

/**
 * Pull code-like tokens out of free text (one code per line, or separated by commas, semicolons,
 * spaces or tabs; a line holding one code written in groups also counts). Tokens that do not look
 * like a code attempt (headers, dates, words) are counted as `ignored`.
 */
export function extractCandidates(text: string): { candidates: string[]; ignored: number } {
  const candidates: string[] = []
  let ignored = 0
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    const whole = normalizeCode(line.replace(/["']/g, ''))
    if (whole.length === CODE_LENGTH && ALNUM.test(whole)) {
      candidates.push(whole)
      continue
    }
    for (const token of line.split(/[\s,;|"']+/)) {
      if (!token) continue
      const n = normalizeCode(token)
      if (CANDIDATE.test(n)) candidates.push(n)
      else ignored++
    }
  }
  return { candidates, ignored }
}

/**
 * Codes inside parsed JSON: a code string, `{ code }`, a Results-page export
 * (`{ format: 'digital-skills-radar/result', result: <record> }`) or a bare record, or any array /
 * container of those. A full record is reduced to its result code at once, so the detailed answers
 * it carries are never kept.
 */
export function codesFromJson(value: unknown, depth = 0): string[] {
  if (depth > 6 || value === null || value === undefined) return []
  if (typeof value === 'string') return extractCandidates(value).candidates
  if (Array.isArray(value)) return value.flatMap((v) => codesFromJson(v, depth + 1))
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>
    if (typeof o.code === 'string') return extractCandidates(o.code).candidates
    const rec = migrateRecord(o.result) ?? migrateRecord(o)
    if (rec) return [encodeResult(rec)]
    return Object.values(o).flatMap((v) => codesFromJson(v, depth + 1))
  }
  return []
}

/** Codes from an uploaded file's text (.txt, .csv or .json); JSON that fails to parse is read as text. */
export function codesFromFile(name: string, text: string): { codes: string[]; ignored: number } {
  const trimmed = text.trim()
  if (/\.json$/i.test(name) || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return { codes: codesFromJson(JSON.parse(trimmed)), ignored: 0 }
    } catch {
      /* fall through to plain text */
    }
  }
  const { candidates, ignored } = extractCandidates(text)
  return { codes: candidates, ignored }
}

const monthIndex = (ym: string): number => {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

/** Whole months between a code's month (YYYY-MM) and `now` (negative = a later month). */
export function monthsAgo(month: string, now: Date = new Date()): number {
  return now.getUTCFullYear() * 12 + now.getUTCMonth() - monthIndex(month)
}

/** Parse one set of pasted text into valid, distinct codes plus the live counters. */
export function parseTeamInput(text: string, opts: { now?: Date; excludeStale?: boolean } = {}): ParsedTeamSet {
  const now = opts.now ?? new Date()
  const trimmed = text.trim()
  let candidates: string[]
  let ignored = 0
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      candidates = codesFromJson(JSON.parse(trimmed))
    } catch {
      ;({ candidates, ignored } = extractCandidates(text))
    }
  } else {
    ;({ candidates, ignored } = extractCandidates(text))
  }
  const seen = new Set<string>()
  const all: TeamEntry[] = []
  let invalid = 0
  let duplicates = 0
  for (const c of candidates) {
    const key = normalizeCode(c)
    const decoded = decodeResult(key)
    if (!decoded) {
      invalid++
      continue
    }
    const age = monthsAgo(decoded.month, now)
    if (age < 0) {
      invalid++
      continue
    }
    if (seen.has(key)) {
      duplicates++
      continue
    }
    seen.add(key)
    all.push({ key, decoded, stale: age > STALE_AFTER_MONTHS })
  }
  const stale = all.filter((e) => e.stale).length
  const entries = opts.excludeStale ? all.filter((e) => !e.stale) : all
  return { entries, valid: all.length, invalid, duplicates, stale, excluded: all.length - entries.length, ignored }
}

/** The k-anonymity gate: how many more valid, distinct codes are needed. */
export function teamGate(n: number): { open: boolean; needed: number } {
  return { open: n >= TEAM_K, needed: Math.max(0, TEAM_K - n) }
}

/* -------------------------------------------------------------- statistics */

/** Quantile by linear interpolation between order statistics (Hyndman–Fan type 7). */
export function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN
  const h = (sorted.length - 1) * p
  const lo = Math.floor(h)
  const hi = Math.ceil(h)
  return sorted[lo] + (h - lo) * (sorted[hi] - sorted[lo])
}

export function fiveNumber(values: number[]): FiveNum | null {
  if (values.length === 0) return null
  const s = values.slice().sort((a, b) => a - b)
  return { min: s[0], q1: quantile(s, 0.25), median: quantile(s, 0.5), q3: quantile(s, 0.75), max: s[s.length - 1] }
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN)

/** Scenario judgment (0–3) on the 0–4 scale. */
export const judgment4 = (j: number) => (j * 4) / 3

const SELF_STEPS = Array.from({ length: 9 }, (_, i) => i / 2)
const JUDGMENT_STEPS = [0, 1, 2, 3]

function bins(values: number[], steps: number[], scale: (x: number) => number = (x) => x): Bin[] {
  return steps.map((s) => ({ value: scale(s), count: values.filter((v) => Math.abs(v - s) < 1e-9).length }))
}

/** Value of one domain for one code on a basis: self-rating, or min(self, judgment) when a scenario exists. */
export function basisValue(d: DecodedResult, index: number, basis: Basis): number {
  const s = d.self[index]
  const j = d.scenario[index]
  return basis === 'cautious' && j !== null ? Math.min(s, judgment4(j)) : s
}

/** The most common role category in the codes (ties: the fixed category order); «عام» when none is stated. */
export function majorityCategory(entries: TeamEntry[]): TrackId {
  const counts = new Map<TrackId, number>()
  for (const e of entries) if (e.decoded.category) counts.set(e.decoded.category, (counts.get(e.decoded.category) ?? 0) + 1)
  let best: TrackId = 'awareness'
  let bestN = 0
  for (const c of CODE_CATEGORIES) {
    const n = counts.get(c) ?? 0
    if (n > bestN) {
      best = c
      bestN = n
    }
  }
  return best
}

const codeIndex = (domainId: string) => (CODE_DOMAINS as readonly string[]).indexOf(domainId)

/**
 * Per-domain team picture, in the display order of `domains`. Returns null below TEAM_K codes:
 * the gate lives here, not in the view.
 */
export function summarizeTeam(entries: TeamEntry[], opts: { category: TrackId; basis: Basis }): TeamSummary | null {
  if (!teamGate(entries.length).open) return null
  const targets = categoryTargets[opts.category]
  const months = entries.map((e) => e.decoded.month).sort()
  const stats: DomainTeamStats[] = domains.map((dom) => {
    const i = codeIndex(dom.id)
    const self = entries.map((e) => e.decoded.self[i])
    const scen = entries.map((e) => e.decoded.scenario[i]).filter((j): j is number => j !== null)
    const basisVals = entries.map((e) => basisValue(e.decoded, i, opts.basis))
    const target = targets[dom.id] ?? 2
    const atOrAbove = basisVals.filter((v) => v >= target).length
    const proficient = basisVals.filter((v) => levelValueForScore(v) >= 3).length
    const paired = entries.filter((e) => e.decoded.scenario[i] !== null)
    const gaps = paired.map((e) => e.decoded.self[i] - judgment4(e.decoded.scenario[i]!))
    const enoughPairs = paired.length >= TEAM_K
    const meanGap = enoughPairs ? mean(gaps) : null
    const flags = entries.map((e) => e.decoded.agreement[i]).filter((a): a is Agreement => a !== null)
    return {
      domainId: dom.id,
      n: entries.length,
      self: fiveNumber(self)!,
      selfBins: bins(self, SELF_STEPS),
      judgmentN: scen.length,
      judgment: scen.length >= TEAM_K ? fiveNumber(scen.map(judgment4)) : null,
      judgmentBins: scen.length >= TEAM_K ? bins(scen, JUDGMENT_STEPS, judgment4) : null,
      basis: fiveNumber(basisVals)!,
      basisMean: mean(basisVals),
      target,
      atOrAboveTarget: atOrAbove,
      coverage: atOrAbove / entries.length,
      proficientOrAbove: proficient,
      singlePoint: proficient <= 1,
      pairedN: paired.length,
      meanGap,
      mismatchShare: enoughPairs ? gaps.filter((g) => g >= JUDGMENT_MISMATCH).length / paired.length : null,
      inflationRisk: meanGap !== null && meanGap >= TEAM_INFLATION_GAP,
      knowledgeJudged: flags.length,
      knowledgeSelfHigher: flags.filter((a) => a === 'self_higher').length,
    }
  })
  return { n: entries.length, category: opts.category, basis: opts.basis, domains: stats, earliestMonth: months[0], latestMonth: months[months.length - 1] }
}

/* ------------------------------------------------------- shared priorities */

/**
 * A knowledge tally that reproduces the decoded agreement flag through `knowledgeAgreement()`
 * (8 attempts): consistent → the same ratio as the self-rating; self above the check → 0 correct;
 * check above the self-rating → all correct. A flag the rounded score cannot produce degrades to
 * the nearest one the engine accepts.
 */
function tallyFor(self: number, a: Agreement): KnowledgeTally {
  const attempted = 8
  if (a === 'consistent') return { attempted, correct: Math.round(self * 2) }
  if (a === 'self_higher') return { attempted, correct: 0 }
  return { attempted, correct: attempted }
}

/** A decoded code as the minimal record the single priority engine reads. */
export function recordFromDecoded(d: DecodedResult) {
  const scores: Record<string, number> = {}
  const scenario: Record<string, number> = {}
  const knowledge: Record<string, KnowledgeTally> = {}
  d.domains.forEach((id, i) => {
    scores[id] = d.self[i]
    const j = d.scenario[i]
    if (j !== null) scenario[id] = j
    const a = d.agreement[i]
    if (a) knowledge[id] = tallyFor(d.self[i], a)
  })
  return { v: 2 as const, scores, scenario, knowledge }
}

export interface SharedPriority {
  domainId: string
  /** codes whose own top-3 development priorities include this domain */
  count: number
  share: number
  /** rank-weighted count (1st = 3, 2nd = 2, 3rd = 1) — the tie-break */
  weight: number
  reasons: Partial<Record<Reason, number>>
  mainReason: Reason
  /** codes at «إتقان» or above in this domain (chosen basis) */
  proficientOrAbove: number
  staffing: Staffing
}

/**
 * The 3 most shared development priorities. Each code runs through the same `priorities()`
 * engine as the individual results, against its own role category's targets (the comparison
 * category when the code states none); «maintain» entries are not development priorities.
 * Ranking: count, then rank weight, then the fixed domain order. Null below TEAM_K codes.
 */
export function sharedPriorities(entries: TeamEntry[], opts: { category: TrackId; basis: Basis }): SharedPriority[] | null {
  if (!teamGate(entries.length).open) return null
  const tally = new Map<string, { count: number; weight: number; reasons: Partial<Record<Reason, number>> }>()
  for (const e of entries) {
    const targets = categoryTargets[e.decoded.category ?? opts.category]
    for (const p of priorities(recordFromDecoded(e.decoded), targets, domains)) {
      if (p.reason === 'maintain') continue
      const t = tally.get(p.domainId) ?? { count: 0, weight: 0, reasons: {} }
      t.count++
      t.weight += 4 - p.rank
      t.reasons[p.reason] = (t.reasons[p.reason] ?? 0) + 1
      tally.set(p.domainId, t)
    }
  }
  const order = new Map(domains.map((d, i) => [d.id, i]))
  return [...tally.entries()]
    .sort(([a, x], [b, y]) => y.count - x.count || y.weight - x.weight || order.get(a)! - order.get(b)!)
    .slice(0, TEAM_PRIORITIES)
    .map(([domainId, t]) => {
      const i = codeIndex(domainId)
      const proficient = entries.filter((e) => levelValueForScore(basisValue(e.decoded, i, opts.basis)) >= 3).length
      const mainReason = (Object.entries(t.reasons) as [Reason, number][]).sort((a, b) => b[1] - a[1])[0][0]
      return {
        domainId,
        count: t.count,
        share: t.count / entries.length,
        weight: t.weight,
        reasons: t.reasons,
        mainReason,
        proficientOrAbove: proficient,
        staffing: proficient === 0 ? 'borrow' : proficient === 1 ? 'mentor' : 'build',
      }
    })
}

export interface CohortTheme {
  domainId: string
  domainName: L
  /** the team's typical starting level: median of the cautious basis */
  startLevel: 1 | 2 | 3 | 4
  transition: TransitionKey
  /** 3 behaviours from the domain pathway, one per plan phase (weeks 1–4, 5–9, 10–13) */
  behaviours: L[]
}

/** A 13-week cohort theme list for the shared priorities, from the existing domain pathways. */
export function cohortPlan(entries: TeamEntry[], shared: SharedPriority[]): CohortTheme[] {
  return shared.map((p) => {
    const i = codeIndex(p.domainId)
    const typical = fiveNumber(entries.map((e) => basisValue(e.decoded, i, 'cautious')))?.median ?? 0
    const transition = transitionForScore(typical)
    const from = Number(transition[0])
    const pathway = pathwayForDomain(p.domainId)
    const tr = pathway.transitions.find((x) => x.from === from) ?? pathway.transitions[pathway.transitions.length - 1]
    return {
      domainId: p.domainId,
      domainName: domains.find((d) => d.id === p.domainId)!.name,
      startLevel: levelValueForScore(typical),
      transition,
      behaviours: tr.behaviors.slice(0, 3),
    }
  })
}

/* ------------------------------------------------------------ before/after */

export interface DomainDelta {
  domainId: string
  beforeMedian: number
  afterMedian: number
  deltaMedian: number
  beforeCoverage: number
  afterCoverage: number
  /** percentage points */
  deltaCoverage: number
  beforeProficient: number
  afterProficient: number
}

export interface TeamComparison {
  before: TeamSummary
  after: TeamSummary
  domains: DomainDelta[]
}

/**
 * Two independent groups (before / after a programme), compared domain by domain. No code is
 * matched to another: it compares groups, never people. Null unless both sets pass the gate.
 */
export function compareTeams(before: TeamEntry[], after: TeamEntry[], opts: { category: TrackId; basis: Basis }): TeamComparison | null {
  const b = summarizeTeam(before, opts)
  const a = summarizeTeam(after, opts)
  if (!b || !a) return null
  return {
    before: b,
    after: a,
    domains: b.domains.map((x, k) => {
      const y = a.domains[k]
      return {
        domainId: x.domainId,
        beforeMedian: x.basis.median,
        afterMedian: y.basis.median,
        deltaMedian: round2(y.basis.median - x.basis.median),
        beforeCoverage: x.coverage,
        afterCoverage: y.coverage,
        deltaCoverage: Math.round((y.coverage - x.coverage) * 100),
        beforeProficient: x.proficientOrAbove,
        afterProficient: y.proficientOrAbove,
      }
    }),
  }
}

/** Codes present in both sets (the same result pasted twice is not a change). */
export function sharedCodes(a: TeamEntry[], b: TeamEntry[]): number {
  const keys = new Set(a.map((e) => e.key))
  return b.filter((e) => keys.has(e.key)).length
}

/* ---------------------------------------------------------------- display */

const round2 = (x: number) => Math.round(x * 100) / 100

/** A score for display: at most 2 decimals, no trailing zeros, Western digits. */
export function formatScore(x: number): string {
  if (!Number.isFinite(x)) return '—'
  return String(round2(x))
}

export const formatShare = (share: number): string => `${Math.round(share * 100)}%`

/** Signed change for display: +0.5 / −0.5 / 0 (true minus sign). */
export function formatSigned(x: number, suffix = ''): string {
  const r = round2(x)
  if (r === 0) return `0${suffix}`
  return `${r > 0 ? '+' : '−'}${Math.abs(r)}${suffix}`
}

/* -------------------------------------------------------------- demo data */

/** Small deterministic generator (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Generated illustration codes (never a real team): `count` codes dated the month before `now`,
 * mostly «تطبيقي». `lift` raises self-ratings and scenarios, to illustrate a later cohort.
 */
export function demoCodes(count: number, opts: { now?: Date; seed?: number; lift?: number } = {}): string[] {
  const now = opts.now ?? new Date()
  const r = rng(opts.seed ?? 7)
  const lift = opts.lift ?? 0
  const base: Record<string, number> = { 'ai-data': 1.5, cyber: 2.4, cloud: 1.4, 'service-design': 2.1, policy: 2, agile: 1.7, emerging: 1, leadership: 2.2 }
  // how far scenario answers sit below the self-rating, per domain (illustrates 2–3 inflated domains)
  const judgeGap: Record<string, number> = { 'ai-data': 1.3, cyber: 0.1, cloud: 0.2, 'service-design': 0, policy: 0.3, agile: 0.2, emerging: 1.1, leadership: 0.9 }
  const cats: TrackId[] = ['applied', 'applied', 'applied', 'specialist', 'team_lead', 'applied', 'awareness']
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 15)).toISOString()
  const out: string[] = []
  for (let k = 0; k < count; k++) {
    const scores: Record<string, number> = {}
    const scenario: Record<string, number> = {}
    for (const id of CODE_DOMAINS) {
      const s = Math.max(0, Math.min(4, base[id] + lift + (r() - 0.5) * 2.2))
      scores[id] = Math.round(s * 2) / 2
      if (r() < 0.9) scenario[id] = Math.max(0, Math.min(3, Math.round(((s - judgeGap[id] + lift * 0.3 + (r() - 0.5) * 1.4) * 3) / 4)))
    }
    out.push(encodeResult({ v: 2, trackId: cats[k % cats.length], scores, scenario, date }))
  }
  return out
}
