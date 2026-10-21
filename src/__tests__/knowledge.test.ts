import { describe, expect, it } from 'vitest'
import { calibrationQuestions, planTemplates, questionsForDomain } from '../data/learning'
import type { CalibrationQuestion } from '../data/learning'
import { domains } from '../data/domains'

/**
 * Knowledge-check bank («تحقق معرفي», DECISION §2 #11; review D3): the key must not be guessable from
 * the form of the item. It feeds `knowledgeAgreement`, which can mark a self-rating «inflated».
 */

const LANGS = ['ar', 'en'] as const
const trueFalse = calibrationQuestions.filter((q) => q.format === 'true_false')
const mcq = calibrationQuestions.filter((q) => q.format === 'mcq')
const keyed = (q: CalibrationQuestion) => q.options.find((o) => o.key === q.answer)!
const filled = (s: string) => typeof s === 'string' && s.trim().length > 0

describe('knowledge-check bank: shape other modules rely on', () => {
  it('5 questions per domain, unique ids, and every answer is one of the option keys', () => {
    expect(new Set(calibrationQuestions.map((q) => q.id)).size).toBe(calibrationQuestions.length)
    for (const d of domains) expect(questionsForDomain(d.id), d.id).toHaveLength(5)
    for (const q of calibrationQuestions) {
      expect(new Set(q.options.map((o) => o.key)).size, q.id).toBe(q.options.length)
      expect(q.options.some((o) => o.key === q.answer), q.id).toBe(true)
      expect(q.options, q.id).toHaveLength(q.format === 'mcq' ? 4 : 2)
    }
  })

  it('every true/false item offers exactly «صحيح / True» and «خطأ / False»', () => {
    for (const q of trueFalse) {
      expect(q.options.map((o) => o.text.en).sort(), q.id).toEqual(['False', 'True'])
      for (const o of q.options) expect(o.text.ar, q.id).toBe(o.text.en === 'True' ? 'صحيح' : 'خطأ')
    }
  })

  it('every text is non-empty in Arabic and English', () => {
    for (const q of calibrationQuestions) {
      for (const lang of LANGS) {
        expect(filled(q.q[lang]), `${q.id}.q.${lang}`).toBe(true)
        expect(filled(q.explanation[lang]), `${q.id}.explanation.${lang}`).toBe(true)
        for (const o of q.options) expect(filled(o.text[lang]), `${q.id}.${o.key}.${lang}`).toBe(true)
      }
    }
  })
})

describe('knowledge-check bank: the key is not guessable from the form (D3)', () => {
  it('true/false keys are 40–60% «true»', () => {
    const trueShare = trueFalse.filter((q) => keyed(q).text.en === 'True').length / trueFalse.length
    expect(trueShare).toBeGreaterThanOrEqual(0.4)
    expect(trueShare).toBeLessThanOrEqual(0.6)
  })

  it.each(LANGS)('the correct option is the longest (ties included) in at most 40%% of multiple-choice items (%s)', (lang) => {
    const longest = mcq.filter((q) => keyed(q).text[lang].length === Math.max(...q.options.map((o) => o.text[lang].length)))
    expect(longest.length / mcq.length, longest.map((q) => q.id).join(', ')).toBeLessThanOrEqual(0.4)
  })

  it.each(LANGS)('no single length rank holds the correct option in more than 40%% of items (%s)', (lang) => {
    // rank 0 = longest … rank 3 = shortest; a fixed «pick the 2nd longest» rule must not pay off either
    const counts = [0, 0, 0, 0]
    for (const q of mcq) {
      const own = keyed(q).text[lang].length
      counts[q.options.filter((o) => o.text[lang].length > own).length]++
    }
    for (const c of counts) expect(c / mcq.length, counts.join(' / ')).toBeLessThanOrEqual(0.4)
  })

  it('no option letter holds the key in more than 40% of multiple-choice items', () => {
    const byKey: Record<string, number> = {}
    for (const q of mcq) byKey[q.answer] = (byKey[q.answer] ?? 0) + 1
    for (const n of Object.values(byKey)) expect(n / mcq.length).toBeLessThanOrEqual(0.4)
  })
})

describe('plan steps: Arabic slips fixed (D8)', () => {
  const allSteps = Object.values(planTemplates).flatMap((p) => p.weeks.map((w) => w.text.ar))

  it('uses «صُغ» and «أدِر», not «اصغ» (listen) or «قد» as a verb', () => {
    const text = allSteps.join('\n')
    for (const bad of ['اصغ مساهمة', 'قد جلسة', 'وقد جزءاً']) expect(text.includes(bad), bad).toBe(false)
    expect(text).toContain('صُغ مساهمة')
    expect(text).toContain('أدِر جلسة للفريق')
  })
})
