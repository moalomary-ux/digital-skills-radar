import { describe, expect, it } from 'vitest'
import { domains } from '../data/domains'
import { categoryTargets, levelForScore, levelValueForScore } from '../data/levels'
import { transitionForScore } from '../data/learning'
import { pathwayForDomain } from '../data/pathways'
import { migrateHistory, migrateRecord } from '../store'
import type { ResultRecord } from '../store'
import {
  assessDomains,
  knowledgeAgreement,
  MAX_PRIORITIES,
  priorities,
  summaryLine,
  targetsFor,
  targetsForRecord,
} from '../lib/priorities'
import { roles } from '../data/roles'
import { buildPlanIcs, CHECKPOINT_DAYS, foldLine, planDay } from '../lib/ics'

const ids = domains.map((d) => d.id)
const all = (v: number) => Object.fromEntries(ids.map((id) => [id, v]))
const target2 = all(2)

function rec(partial: Partial<ResultRecord>): ResultRecord {
  return { v: 2, id: 'r-test', date: '2026-10-22T08:00:00.000Z', roleId: 'cat:applied', trackId: 'applied', answers: {}, scores: all(2), overall: 2, ...partial }
}

/* ------------------------------------------------------------- 6 fixture profiles */

describe('priority engine — fixture profiles', () => {
  it('1. «self 4 / scenario 0» ranks judgment_below_self first, ahead of self-only gaps', () => {
    const r = rec({
      scores: { ...all(2), cyber: 4, cloud: 0.4, policy: 1 },
      scenario: { ...all(2), cyber: 0 },
    })
    // cloud & policy have a scenario at target (2 → 2.67 on 0–4) → self_below_target (self-only)
    const p = priorities(r, target2, domains)
    expect(p[0]).toMatchObject({ domainId: 'cyber', reason: 'judgment_below_self', rank: 1, selfScore: 4, scenarioScore: 0, target: 2 })
    expect(p.map((x) => x.reason)).toEqual(['judgment_below_self', 'self_below_target', 'self_below_target'])
    expect(p[1].domainId).toBe('cloud') // larger self-only gap first
  })

  it('2. all at target → maintain (closest margins first), never a development reason', () => {
    const r = rec({ scores: { ...all(3), cyber: 2, agile: 2.2 }, scenario: all(3) })
    const p = priorities(r, target2, domains)
    expect(p).toHaveLength(MAX_PRIORITIES)
    expect(p.every((x) => x.reason === 'maintain')).toBe(true)
    expect(p.map((x) => x.domainId).slice(0, 2)).toEqual(['cyber', 'agile'])
    expect(summaryLine(p, 'ar')).toContain('أنت عند المستهدف')
    expect(summaryLine(p, 'en')).toContain('at or above the indicative target')
  })

  it('3. partial knowledge (fewer than 3 attempts) → no agreement flag, so no «inflated»', () => {
    const r = rec({
      scores: { ...all(2), 'ai-data': 3.4 },
      scenario: { ...all(2), 'ai-data': 0 },
      knowledge: { 'ai-data': { attempted: 2, correct: 0 } },
    })
    const ev = assessDomains(r, target2, domains).find((e) => e.domainId === 'ai-data')!
    expect(ev.agreement).toBeNull()
    expect(ev.knowledge).toEqual({ attempted: 2, correct: 0 })
    expect(priorities(r, target2, domains)[0]).toMatchObject({ domainId: 'ai-data', reason: 'judgment_below_self', agreement: null })
  })

  it('4. high self-rating contradicted by scenario AND a complete knowledge check → «inflated», ranked above a plain mismatch', () => {
    const r = rec({
      scores: { ...all(2), emerging: 3, leadership: 3 },
      scenario: { ...all(2), emerging: 0, leadership: 0 },
      knowledge: { emerging: { attempted: 5, correct: 1 }, leadership: { attempted: 5, correct: 4 } },
    })
    const p = priorities(r, target2, domains)
    expect(p[0]).toMatchObject({ domainId: 'emerging', reason: 'inflated', agreement: 'self_higher' })
    expect(p[1]).toMatchObject({ domainId: 'leadership', reason: 'judgment_below_self', agreement: 'consistent' })
  })

  it('5. judgment evidence outranks self-report: both_below_target beats a larger self-only gap', () => {
    const t = { ...all(2), 'service-design': 3, policy: 4 }
    const r = rec({
      scores: { ...all(2), 'service-design': 1, policy: 0 },
      scenario: { ...all(3), 'service-design': 1 }, // policy scenario 3 → 4 on 0–4 ≥ target
    })
    const p = priorities(r, t, domains)
    expect(p[0]).toMatchObject({ domainId: 'service-design', reason: 'both_below_target' })
    expect(p[1]).toMatchObject({ domainId: 'policy', reason: 'self_below_target' })
    expect(p).toHaveLength(2) // only real development reasons; no padding with «maintain»
  })

  it('6. legacy record (no schema version): calibration is readable, never flags, ranking by gap', () => {
    const legacy = migrateRecord({
      id: 'r-old', date: '2025-05-01T10:00:00.000Z', roleId: 'generalist', answers: {},
      scores: { ...all(2), cloud: 0.5, cyber: 1, agile: 1.5, emerging: 1.8 }, overall: 1.7,
      calibration: { cloud: 0, cyber: 3 },
    })!
    expect(legacy.v).toBeUndefined()
    const targets = targetsForRecord(legacy) // falls back to the stored generic profile
    const ev = assessDomains(legacy, targets, domains)
    expect(ev.find((e) => e.domainId === 'cloud')!.knowledge).toEqual({ attempted: null, correct: 0 })
    expect(ev.every((e) => e.agreement === null)).toBe(true)
    const p = priorities(legacy, targets, domains)
    expect(p.map((x) => x.domainId)).toEqual(['cloud', 'cyber', 'service-design']) // ties (gap 1) keep domain order
    expect(p.every((x) => x.reason === 'self_below_target')).toBe(true)
  })
})

/* ------------------------------------------------------------- engine details */

describe('priority engine — rules', () => {
  it('agreement needs ≥ 3 attempts and compares in both directions', () => {
    expect(knowledgeAgreement(4, { attempted: 2, correct: 0 })).toBeNull()
    expect(knowledgeAgreement(4, { attempted: null, correct: 0 })).toBeNull()
    expect(knowledgeAgreement(4, { attempted: 3, correct: 0 })).toBe('self_higher')
    expect(knowledgeAgreement(0.5, { attempted: 4, correct: 4 })).toBe('check_higher')
    expect(knowledgeAgreement(2, { attempted: 4, correct: 2 })).toBe('consistent')
  })

  it('targets: a precise library role replaces the category profile', () => {
    expect(targetsForRecord({ roleId: 'cat:executive', trackId: 'executive' })).toEqual(categoryTargets.executive)
    const lib = targetsForRecord({ roleId: 'lib:data_scientist', trackId: 'awareness' })
    expect(lib).not.toEqual(categoryTargets.awareness)
    expect(Object.keys(lib).sort()).toEqual([...ids].sort())
    // a pre-v9 record keeps the generic profile it was assessed against, even with a track
    expect(targetsForRecord({ roleId: 'leader', trackId: 'awareness' })).toEqual(roles.find((r) => r.id === 'leader')!.targets)
    expect(targetsFor('generalist', 'specialist')).toEqual(categoryTargets.specialist) // draft: category wins over a generic hint
  })

  it('every category profile covers the 8 domains with levels 1–4', () => {
    for (const t of Object.values(categoryTargets)) {
      expect(Object.keys(t).sort()).toEqual([...ids].sort())
      for (const v of Object.values(t)) expect(v >= 1 && v <= 4).toBe(true)
    }
  })

  it('returns at most 3, ranks are 1..n, and the reason text names the domain without numbers', () => {
    const r = rec({ scores: all(0), scenario: all(0) })
    const p = priorities(r, all(4), domains)
    expect(p).toHaveLength(3)
    expect(p.map((x) => x.rank)).toEqual([1, 2, 3])
    for (const x of p) {
      expect(x.text.ar).toContain(x.domainName.ar)
      expect(x.text.en).toContain(x.domainName.en)
      expect(x.text.ar).not.toMatch(/\d/)
    }
    expect(summaryLine(p, 'ar')).toContain(`«${p[0].domainName.ar}»`)
    expect(summaryLine(p, 'en')).toContain(`“${p[1].domainName.en}”`)
  })

  it('D6: «self_below_target» text follows the scenario shown beside it (self 1, scenarios 3/3)', () => {
    const r = rec({ scores: all(1), scenario: all(3) }) // judgment 3/3 → 4 on 0–4, above every target 2
    const p = priorities(r, target2, domains)
    expect(p[0]).toMatchObject({ reason: 'self_below_target', scenarioScore: 3, targetBasis: 'category' })
    for (const x of p) {
      // the old sentence claimed the judgment was silent although the card shows «3 / 3»
      expect(x.text.ar).not.toContain('لم يؤكد موقف الحكم')
      expect(x.text.en).not.toContain('no scenario')
      expect(x.text.ar).toContain('بلغت المستهدف أو تجاوزته')
      expect(x.text.en).toContain('reached or passed the target')
      expect(x.text.ar).toContain('لفئة دورك')
    }
    // no scenario answer in the domain → the text says so
    const silent = priorities(rec({ scores: all(1), scenario: undefined }), target2, domains)[0]
    expect(silent.reason).toBe('self_below_target')
    expect(silent.text.ar).toContain('لا توجد إجابة موقف حكم في هذا المجال')
    expect(silent.text.en).toContain('no scenario answer in this domain')
  })

  it('D6: a precise role names «المستهدف الاسترشادي لدورك», never «لفئة دورك»', () => {
    const roleRec = rec({ roleId: 'lib:data_scientist', scores: all(0), scenario: undefined })
    const p = priorities(roleRec, targetsForRecord(roleRec), domains)
    expect(p[0]).toMatchObject({ reason: 'self_below_target', targetBasis: 'role' })
    expect(p[0].text.ar).toContain('المستهدف الاسترشادي لدورك')
    expect(p[0].text.en).toContain('the indicative target for your role;')
    for (const lang of ['ar', 'en'] as const) expect(summaryLine(p, lang)).not.toMatch(/فئة دورك|role category/)
    expect(summaryLine(p, 'ar')).toContain('لدورك')
    // maintain headline follows the same rule
    const atTarget = rec({ roleId: 'lib:data_scientist', scores: all(4), scenario: all(3) })
    const kept = priorities(atTarget, targetsForRecord(atTarget), domains)
    expect(kept[0].reason).toBe('maintain')
    expect(summaryLine(kept, 'ar')).toContain('المستهدف الاسترشادي لدورك أو فوقه')
    expect(summaryLine(kept, 'en')).toContain('the indicative target for your role in every domain')
    // a category record keeps the category wording
    expect(summaryLine(priorities(rec({ scores: all(4), scenario: all(3) }), target2, domains), 'ar')).toContain('لفئة دورك')
  })

  it('the plan starts from the conservative evidence level (judgment outranks self-report)', () => {
    const r = rec({ scores: { ...all(2), cyber: 3.5 }, scenario: { ...all(2), cyber: 0 } })
    const first = priorities(r, target2, domains)[0]
    expect(first.planScore).toBe(0)
    expect(transitionForScore(first.planScore)).toBe('1_to_2')
  })

  it('plan transitions use the same thresholds as levelForScore (1.25 / 2.25 / 3.25)', () => {
    const cases: [number, string][] = [[0, '1_to_2'], [1.24, '1_to_2'], [1.25, '2_to_3'], [2.24, '2_to_3'], [2.25, '3_to_4'], [3.24, '3_to_4'], [3.25, '3_to_4'], [4, '3_to_4']]
    for (const [s, k] of cases) expect(transitionForScore(s), String(s)).toBe(k)
    expect(levelForScore(2.25).name.ar).toBe('إتقان')
    expect(levelValueForScore(3.25)).toBe(4)
  })

  it('every domain transition carries three behaviours (one per plan phase)', () => {
    for (const d of domains) for (const tr of pathwayForDomain(d.id).transitions) expect(tr.behaviors, `${d.id} ${tr.from}`).toHaveLength(3)
  })
})

describe('stored history is validated and migrated', () => {
  it('drops malformed records instead of crashing', () => {
    const good = rec({})
    const out = migrateHistory([good, null, { id: 1 }, { id: 'x', date: 'nope', scores: {} }, { ...good, id: 'r2', scores: 'bad' }])
    expect(out.map((r) => r.id)).toEqual(['r-test'])
    expect(migrateHistory('not an array')).toEqual([])
  })

  it('clamps v2 knowledge tallies and drops zero-attempt domains', () => {
    const m = migrateRecord({ ...rec({}), knowledge: { cyber: { attempted: 3, correct: 9 }, cloud: { attempted: 0, correct: 0 } } })!
    expect(m.knowledge).toEqual({ cyber: { attempted: 3, correct: 3 } })
  })
})

/* ------------------------------------------------------------- calendar file */

describe('plan calendar (.ics)', () => {
  const weeks = Array.from({ length: 13 }, (_, i) => ({ title: `خطتي — الأسبوع ${i + 1} من 13`, description: `خطوة الأسبوع ${i + 1}, مع فاصلة; وفاصلة منقوطة` }))
  const ics = buildPlanIcs({
    start: new Date(2026, 9, 22),
    now: new Date(Date.UTC(2026, 9, 22, 6, 0, 0)),
    calendarName: 'خطتي',
    weeks,
    recheck: { title: 'اليوم 90: أعد التقييم', description: 'أعد التقييم الذاتي.' },
    uidSeed: 'r-1761120000000',
  })

  it('holds 13 weekly reminders and the day-90 re-check, each with a 09:00 alarm', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(14)
    expect(ics.match(/TRIGGER:PT9H/g)).toHaveLength(14)
    const starts = [...ics.matchAll(/DTSTART;VALUE=DATE:(\d{8})/g)].map((m) => m[1])
    expect(starts[0]).toBe('20261022')
    expect(starts[1]).toBe('20261029')
    expect(starts[12]).toBe('20270114') // day 85
    expect(starts[13]).toBe('20270119') // day 90
    expect(new Set(ics.match(/UID:[^\r]+/g)).size).toBe(14)
  })

  it('escapes text and folds lines at 75 octets without breaking characters', () => {
    expect(ics.replace(/\r\n /g, '')).toContain('\\, مع فاصلة\\; وفاصلة')
    for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
    const long = foldLine('DESCRIPTION:' + 'تحقق '.repeat(40))
    expect(long.split('\r\n').slice(1).every((l) => l.startsWith(' '))).toBe(true)
    expect(long.replace(/\r\n /g, '')).toBe('DESCRIPTION:' + 'تحقق '.repeat(40))
  })

  it('checkpoint days 45 and 90 map to calendar dates from day 1', () => {
    expect(CHECKPOINT_DAYS).toEqual([45, 90])
    expect(planDay(new Date(2026, 9, 22), 45).toDateString()).toBe(new Date(2026, 11, 5).toDateString())
  })
})
