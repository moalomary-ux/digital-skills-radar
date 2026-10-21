import { describe, expect, it } from 'vitest'
import { domains } from '../data/domains'
import { tracks } from '../data/tracks'
import type { ResultRecord } from '../store'
import { knowledgeAgreement } from '../lib/priorities'
import { CODE_CATEGORIES, CODE_DOMAINS, CODE_LENGTH, decodeResult, encodeResult, formatCode } from '../lib/resultCode'

/** Deterministic PRNG (mulberry32) so the property test is reproducible. */
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

function randomRecord(r: () => number, i: number): ResultRecord {
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)]
  const scores: Record<string, number> = {}
  const scenario: Record<string, number> = {}
  const knowledge: Record<string, { attempted: number; correct: number }> = {}
  for (const d of CODE_DOMAINS) {
    // mix exact multiples of 0.2 (5-statement means) and arbitrary values
    scores[d] = r() < 0.5 ? Math.round(r() * 20) / 5 : r() * 4
    if (r() < 0.8) scenario[d] = Math.floor(r() * 4)
    if (r() < 0.6) {
      const attempted = 1 + Math.floor(r() * 5)
      knowledge[d] = { attempted, correct: Math.floor(r() * (attempted + 1)) }
    }
  }
  const year = 2024 + Math.floor(r() * 80)
  const month = Math.floor(r() * 12)
  return {
    v: 2,
    id: `r-${i}`,
    date: new Date(Date.UTC(year, month, 1 + Math.floor(r() * 28), 12)).toISOString(),
    roleId: r() < 0.3 ? 'lib:data_scientist' : 'cat:x',
    trackId: r() < 0.9 ? pick(CODE_CATEGORIES) : undefined,
    answers: {},
    scores,
    overall: 0,
    ...(Object.keys(scenario).length ? { scenario } : {}),
    ...(Object.keys(knowledge).length ? { knowledge } : {}),
  }
}

describe('result code v1', () => {
  it('covers exactly the 8 domains and the 5 role categories', () => {
    expect([...CODE_DOMAINS].sort()).toEqual(domains.map((d) => d.id).sort())
    expect([...CODE_CATEGORIES].sort()).toEqual(tracks.map((t) => t.id).sort())
  })

  it('round-trips 1,000 random records (property test)', () => {
    const r = rng(20261022)
    for (let i = 0; i < 1000; i++) {
      const rec = randomRecord(r, i)
      const code = encodeResult(rec)
      expect(code).toMatch(/^[0-9A-HJKMNP-TV-Z]{20}$/)
      const dec = decodeResult(code)
      expect(dec, code).not.toBeNull()
      expect(dec!.version).toBe(1)
      expect(dec!.category).toBe(rec.trackId ?? null)
      expect(dec!.month).toBe(rec.date.slice(0, 7))
      CODE_DOMAINS.forEach((d, k) => {
        expect(dec!.self[k]).toBe(Math.round(rec.scores[d] * 2) / 2)
        expect(Math.abs(dec!.self[k] - rec.scores[d])).toBeLessThanOrEqual(0.25)
        expect(dec!.scenario[k]).toBe(rec.scenario?.[d] ?? null)
        const k2 = rec.knowledge?.[d]
        expect(dec!.agreement[k]).toBe(knowledgeAgreement(rec.scores[d], k2 ? { attempted: k2.attempted, correct: k2.correct } : undefined))
      })
      // tolerant to grouping, whitespace and case
      expect(decodeResult(` ${formatCode(code).toLowerCase()} \n`)).toEqual(dec)
    }
  })

  it('rejects every single-symbol substitution and adjacent transposition of a valid code', () => {
    const r = rng(7)
    const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
    for (let n = 0; n < 25; n++) {
      const code = encodeResult(randomRecord(r, n))
      for (let i = 0; i < CODE_LENGTH; i++) {
        for (const ch of ALPHA) {
          if (ch === code[i]) continue
          expect(decodeResult(code.slice(0, i) + ch + code.slice(i + 1))).toBeNull()
        }
        if (i < CODE_LENGTH - 1 && code[i] !== code[i + 1]) {
          expect(decodeResult(code.slice(0, i) + code[i + 1] + code[i] + code.slice(i + 2))).toBeNull()
        }
      }
    }
  })

  it('rejects wrong lengths, foreign characters and empty input', () => {
    const code = encodeResult(randomRecord(rng(1), 0))
    expect(decodeResult('')).toBeNull()
    expect(decodeResult(code.slice(1))).toBeNull()
    expect(decodeResult(code + '0')).toBeNull()
    expect(decodeResult(code.slice(0, 19) + 'U')).toBeNull()
    expect(decodeResult('00000000000000000000')).toBeNull() // version 0
  })

  it('reads O as 0 and I/L as 1', () => {
    const r = rng(99)
    for (let n = 0; n < 50; n++) {
      const code = encodeResult(randomRecord(r, n))
      const confusable = code.replace(/0/g, 'O').replace(/1/g, 'l')
      expect(decodeResult(confusable)).toEqual(decodeResult(code))
    }
  })

  it('legacy records encode with no agreement flags and no category', () => {
    const code = encodeResult({ date: '2025-03-10T09:00:00Z', scores: { cyber: 3.6, cloud: 1.4 }, calibration: { cyber: 0 } })
    const dec = decodeResult(code)!
    expect(dec.category).toBeNull()
    expect(dec.agreement.every((a) => a === null)).toBe(true)
    expect(dec.self[CODE_DOMAINS.indexOf('cyber')]).toBe(3.5)
    expect(dec.self[CODE_DOMAINS.indexOf('cloud')]).toBe(1.5)
    expect(dec.month).toBe('2025-03')
  })

  it('never contains the precise role', () => {
    const base = randomRecord(rng(3), 1)
    const one: ResultRecord = { ...base, roleId: 'lib:data_scientist' }
    const two: ResultRecord = { ...base, roleId: 'lib:chief_digital_officer' }
    expect(encodeResult(one)).toBe(encodeResult(two))
  })
})
