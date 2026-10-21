import { describe, expect, it } from 'vitest'
import { CODE_DOMAINS, decodeResult, encodeResult, formatCode } from '../lib/resultCode'
import { knowledgeAgreement } from '../lib/priorities'
import {
  TEAM_K,
  codesFromFile,
  cohortPlan,
  compareTeams,
  demoCodes,
  extractCandidates,
  fiveNumber,
  formatSigned,
  majorityCategory,
  monthsAgo,
  parseTeamInput,
  recordFromDecoded,
  sharedCodes,
  sharedPriorities,
  summarizeTeam,
  teamGate,
} from '../lib/team'
import type { TeamEntry } from '../lib/team'

const NOW = new Date('2026-10-15T12:00:00Z')

type Vec = number[]
interface Spec {
  cat?: string
  self: Vec
  scen?: (number | null)[]
  date?: string
  /** knowledge tallies per domain id */
  knowledge?: Record<string, { attempted: number; correct: number }>
}

function code(s: Spec): string {
  const scores: Record<string, number> = {}
  const scenario: Record<string, number> = {}
  CODE_DOMAINS.forEach((id, i) => {
    scores[id] = s.self[i]
    const j = s.scen?.[i]
    if (j !== undefined && j !== null) scenario[id] = j
  })
  return encodeResult({ v: 2, trackId: s.cat, scores, scenario, knowledge: s.knowledge, date: s.date ?? '2026-09-10T08:00:00Z' })
}

/*
 * 12 synthetic codes (domain order: ai-data, cyber, cloud, service-design, policy, agile, emerging, leadership)
 *   ai-data         0, 0.5, 1, 1, 1.5, 1.5, 2, 2, 2.5, 3, 3.5, 4
 *   cyber           1 everywhere except code 12 (3)  → exactly one at «إتقان»
 *   cloud           1 everywhere                      → nobody at «إتقان»
 *   service-design  self 2.5, scenario 0 everywhere   → self far above judgment
 *   policy          self 2.5, scenario 3 everywhere   → judgment above self
 *   agile           self 2.5, scenario only in 3 codes (below the k gate)
 *   emerging        2.5 / 2 alternating (keeps the 12 codes distinct; at or above every target)
 *   leadership      self 2.5; a knowledge check (0/4) in codes 1–6
 * Categories: 9 applied, 2 specialist (codes 7–8), 1 not stated (code 12). Codes 1–2 are dated 2026-03 (old).
 */
const AI = [0, 0.5, 1, 1, 1.5, 1.5, 2, 2, 2.5, 3, 3.5, 4]
const FIXTURE: Spec[] = AI.map((ai, k) => ({
  cat: k === 6 || k === 7 ? 'specialist' : k === 11 ? undefined : 'applied',
  self: [ai, k === 11 ? 3 : 1, 1, 2.5, 2.5, 2.5, k % 2 === 0 ? 2.5 : 2, 2.5],
  scen: [null, null, null, 0, 3, k < 3 ? 2 : null, null, null],
  date: k < 2 ? '2026-03-01T08:00:00Z' : '2026-09-10T08:00:00Z',
  knowledge: k < 6 ? { leadership: { attempted: 4, correct: 0 } } : undefined,
}))
const CODES = FIXTURE.map(code)

const entriesOf = (codes: string[]): TeamEntry[] => parseTeamInput(codes.join('\n'), { now: NOW }).entries
const byId = <T extends { domainId: string }>(list: T[], id: string) => list.find((x) => x.domainId === id)!

describe('team radar: parsing and counters', () => {
  it('the 12 fixture codes are valid and distinct', () => {
    const p = parseTeamInput(CODES.join('\n'), { now: NOW })
    expect(p).toMatchObject({ valid: 12, invalid: 0, duplicates: 0, stale: 2, excluded: 0, ignored: 0 })
    expect(p.entries).toHaveLength(12)
  })

  it('accepts commas, spaces, hyphen groups, lower case and one grouped code per line', () => {
    const grouped = formatCode(CODES[0]).replace(/-/g, ' ')
    const text = `${grouped}\n${CODES[1].toLowerCase()}, ${formatCode(CODES[2])};${CODES[3]} ${CODES[4]}`
    const p = parseTeamInput(text, { now: NOW })
    expect(p.valid).toBe(5)
    expect(p.invalid).toBe(0)
  })

  it('detects duplicates, whatever their formatting', () => {
    const text = [CODES[0], formatCode(CODES[0]).toLowerCase(), CODES[0], CODES[1]].join('\n')
    const p = parseTeamInput(text, { now: NOW })
    expect(p.valid).toBe(2)
    expect(p.duplicates).toBe(2)
  })

  it('counts invalid codes (checksum, length, future month) and ignores non-code text', () => {
    const c = CODES[2]
    const flipped = c.slice(0, 5) + (c[5] === 'A' ? 'B' : 'A') + c.slice(6)
    const future = code({ cat: 'applied', self: [1, 1, 1, 1, 1, 1, 1, 1], date: '2026-12-01T00:00:00Z' })
    const p = parseTeamInput(`code,month\n${flipped},2026-09\n${c.slice(0, 19)}\n${future}\n${c}`, { now: NOW })
    expect(p.invalid).toBe(3)
    expect(p.valid).toBe(1)
    expect(p.ignored).toBeGreaterThanOrEqual(3) // "code", "month", "2026-09"
  })

  it('flags codes older than 6 months and can leave them out', () => {
    expect(monthsAgo('2026-03', NOW)).toBe(7)
    expect(monthsAgo('2026-04', NOW)).toBe(6)
    const p = parseTeamInput(CODES.join('\n'), { now: NOW, excludeStale: true })
    expect(p.stale).toBe(2)
    expect(p.excluded).toBe(2)
    expect(p.entries).toHaveLength(10)
    expect(p.entries.every((e) => !e.stale)).toBe(true)
  })

  it('reads JSON exports from the Results page, code lists and CSV files', () => {
    const record = { v: 2 as const, id: 'r1', date: '2026-09-20T10:00:00Z', roleId: 'cat:applied', trackId: 'applied', answers: { s1: 3 }, scores: { 'ai-data': 2.4, cyber: 1.9 }, overall: 2, scenario: { cyber: 2 } }
    const exportJson = JSON.stringify({ format: 'digital-skills-radar/result', schema: 2, exportedAt: '2026-09-20T10:05:00Z', result: record }, null, 2)
    expect(codesFromFile('skills-radar-2026-09-20.json', exportJson).codes).toEqual([encodeResult(record)])
    expect(codesFromFile('codes.json', JSON.stringify([CODES[0], { code: formatCode(CODES[1]) }])).codes).toEqual([CODES[0], CODES[1]])
    const csv = codesFromFile('team.csv', `code\n"${CODES[0]}"\n${CODES[1]}\n`)
    expect(csv.codes).toEqual([CODES[0], CODES[1]])
    expect(csv.ignored).toBe(1)
    // a pasted JSON export works too, and only the code survives (no answers are kept)
    const p = parseTeamInput(exportJson, { now: NOW })
    expect(p.valid).toBe(1)
    expect(JSON.stringify(p.entries)).not.toContain('answers')
  })

  it('extractCandidates keeps code-like tokens only', () => {
    const r = extractCandidates(`note: team A\n${CODES[0]}`)
    expect(r.candidates).toEqual([CODES[0]])
    expect(r.ignored).toBe(3)
  })
})

describe('team radar: the k = 5 gate', () => {
  it('nothing is computed below 5 valid, distinct codes', () => {
    expect(TEAM_K).toBe(5)
    const four = entriesOf(CODES.slice(0, 4))
    expect(teamGate(four.length)).toEqual({ open: false, needed: 1 })
    expect(summarizeTeam(four, { category: 'applied', basis: 'self' })).toBeNull()
    expect(sharedPriorities(four, { category: 'applied', basis: 'self' })).toBeNull()
    expect(compareTeams(entriesOf(CODES), four, { category: 'applied', basis: 'self' })).toBeNull()
    // duplicates do not open the gate
    const dup = parseTeamInput([...CODES.slice(0, 4), CODES[0], CODES[1]].join('\n'), { now: NOW })
    expect(dup.entries).toHaveLength(4)
    expect(teamGate(dup.entries.length).open).toBe(false)
    expect(teamGate(5)).toEqual({ open: true, needed: 0 })
  })
})

describe('team radar: aggregation on 12 fixture codes', () => {
  const entries = entriesOf(CODES)
  const team = summarizeTeam(entries, { category: 'applied', basis: 'self' })!

  it('five-number summary (type 7 quantiles) and bins', () => {
    expect(fiveNumber(AI)).toEqual({ min: 0, q1: 1, median: 1.75, q3: 2.625, max: 4 })
    const ai = byId(team.domains, 'ai-data')
    expect(ai.self).toEqual({ min: 0, q1: 1, median: 1.75, q3: 2.625, max: 4 })
    expect(ai.selfBins.map((b) => b.count)).toEqual([1, 1, 2, 2, 2, 1, 1, 1, 1])
    expect(ai.selfBins.reduce((a, b) => a + b.count, 0)).toBe(12)
    expect(team.n).toBe(12)
    expect(team.earliestMonth).toBe('2026-03')
    expect(team.latestMonth).toBe('2026-09')
  })

  it('the default comparison category is the most common one', () => {
    expect(majorityCategory(entries)).toBe('applied')
  })

  it('coverage = share at or above the category target on the chosen basis', () => {
    const ai = byId(team.domains, 'ai-data')
    expect(ai.target).toBe(2)
    expect(ai.atOrAboveTarget).toBe(6)
    expect(ai.coverage).toBe(0.5)
    const spec = summarizeTeam(entries, { category: 'specialist', basis: 'self' })!
    expect(byId(spec.domains, 'ai-data').target).toBe(3)
    expect(byId(spec.domains, 'ai-data').coverage).toBe(0.25)
    // the cautious basis uses min(self, judgment): a scenario of 0 removes all coverage
    expect(byId(team.domains, 'service-design').coverage).toBe(1)
    const cautious = summarizeTeam(entries, { category: 'applied', basis: 'cautious' })!
    expect(byId(cautious.domains, 'service-design').coverage).toBe(0)
    expect(byId(cautious.domains, 'policy').coverage).toBe(1)
  })

  it('single point of failure = at most 1 code at «إتقان» or above', () => {
    expect(byId(team.domains, 'cyber')).toMatchObject({ proficientOrAbove: 1, singlePoint: true })
    expect(byId(team.domains, 'cloud')).toMatchObject({ proficientOrAbove: 0, singlePoint: true })
    expect(byId(team.domains, 'ai-data')).toMatchObject({ proficientOrAbove: 4, singlePoint: false })
    expect(byId(team.domains, 'service-design').singlePoint).toBe(false)
    const cautious = summarizeTeam(entries, { category: 'applied', basis: 'cautious' })!
    expect(byId(cautious.domains, 'service-design').singlePoint).toBe(true)
  })

  it('inflation risk needs at least 5 paired codes and a mean gap of half a level', () => {
    const sd = byId(team.domains, 'service-design')
    expect(sd.pairedN).toBe(12)
    expect(sd.meanGap).toBe(2.5)
    expect(sd.mismatchShare).toBe(1)
    expect(sd.inflationRisk).toBe(true)
    expect(byId(team.domains, 'policy')).toMatchObject({ meanGap: -1.5, inflationRisk: false })
    expect(byId(team.domains, 'agile')).toMatchObject({ pairedN: 3, meanGap: null, judgment: null, judgmentBins: null, inflationRisk: false })
    expect(byId(team.domains, 'leadership')).toMatchObject({ knowledgeJudged: 6, knowledgeSelfHigher: 6 })
  })

  it('decoded agreement flags reach the priority engine unchanged', () => {
    for (const e of entries) {
      const rec = recordFromDecoded(e.decoded)
      e.decoded.domains.forEach((id, i) => {
        const flag = e.decoded.agreement[i]
        if (flag) expect(knowledgeAgreement(e.decoded.self[i], rec.knowledge[id])).toBe(flag)
      })
    }
  })

  it('shared priorities count each code’s own top 3 from the single engine', () => {
    const shared = sharedPriorities(entries, { category: 'applied', basis: 'self' })!
    expect(shared.map((p) => [p.domainId, p.count])).toEqual([
      ['service-design', 12],
      ['cyber', 11],
      ['cloud', 8],
    ])
    expect(shared[0]).toMatchObject({ mainReason: 'judgment_below_self', staffing: 'build', share: 1 })
    expect(shared[1]).toMatchObject({ mainReason: 'self_below_target', staffing: 'mentor' })
    expect(shared[2]).toMatchObject({ staffing: 'borrow' })
    const plan = cohortPlan(entries, shared)
    expect(plan).toHaveLength(3)
    for (const theme of plan) {
      expect(theme.behaviours).toHaveLength(3)
      for (const b of theme.behaviours) expect(b.ar && b.en).toBeTruthy()
    }
    // service design starts from the cautious median (scenario 0) → the first transition
    expect(plan[0]).toMatchObject({ domainId: 'service-design', startLevel: 1, transition: '1_to_2' })
  })

  it('no output keeps a code or a per-code row', () => {
    const shared = sharedPriorities(entries, { category: 'applied', basis: 'self' })!
    const json = JSON.stringify({ team, shared })
    for (const c of CODES) expect(json).not.toContain(c)
    for (const d of team.domains) {
      // per-domain arrays are fixed-size bins, never one item per code
      expect(d.selfBins).toHaveLength(9)
      if (d.judgmentBins) expect(d.judgmentBins).toHaveLength(4)
    }
  })
})

describe('team radar: before/after', () => {
  const before = entriesOf(CODES)
  const afterCodes = FIXTURE.map((s) => code({ ...s, self: [Math.min(4, s.self[0] + 1), 3, ...s.self.slice(2)], date: '2026-10-02T08:00:00Z' }))
  const after = entriesOf(afterCodes)

  it('compares two groups domain by domain', () => {
    const cmp = compareTeams(before, after, { category: 'applied', basis: 'self' })!
    expect(cmp.before.n).toBe(12)
    expect(cmp.after.n).toBe(12)
    expect(byId(cmp.domains, 'ai-data')).toMatchObject({ beforeMedian: 1.75, afterMedian: 2.75, deltaMedian: 1, deltaCoverage: 33 })
    expect(byId(cmp.domains, 'cyber')).toMatchObject({ beforeMedian: 1, afterMedian: 3, deltaMedian: 2, deltaCoverage: 92, beforeProficient: 1, afterProficient: 12 })
    expect(byId(cmp.domains, 'cloud')).toMatchObject({ deltaMedian: 0, deltaCoverage: 0 })
    expect(sharedCodes(before, after)).toBe(0)
    expect(sharedCodes(before, before)).toBe(12)
  })

  it('formats signed changes with a true minus sign', () => {
    expect(formatSigned(1)).toBe('+1')
    expect(formatSigned(-0.5)).toBe('−0.5')
    expect(formatSigned(0, ' pp')).toBe('0 pp')
  })
})

describe('team radar: illustration data', () => {
  it('generates valid, distinct, recent codes', () => {
    const codes = demoCodes(12, { now: NOW })
    const p = parseTeamInput(codes.join('\n'), { now: NOW })
    expect(p.valid).toBe(12)
    expect(p.stale).toBe(0)
    for (const c of codes) expect(decodeResult(c)?.month).toBe('2026-09')
    expect(demoCodes(12, { now: NOW })).toEqual(codes)
  })
})
