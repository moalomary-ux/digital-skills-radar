import type { L, Lang } from './types'
import type { Technology } from './technologies'

/**
 * v9 (P5b): the Arabic for the technology fields that were English-only in the source
 * research (TRL rationale, employee skills, learning focus) now lives in `technologies.ts`
 * as bilingual `{ ar, en }` values, so the lint checks both languages. This module keeps the
 * per-language resolver the views use.
 */

export interface LocalizedTech {
  rationale: string
  skills: string[]
  focus: { awareness: string; practitioner: string }
}

const pick = (l: L, lang: Lang) => (lang === 'ar' ? l.ar : l.en)

/** Resolve a technology's text fields for the active language. */
export function localizeTech(tech: Pick<Technology, 'trlRationale' | 'employeeSkills' | 'learningFocus'>, lang: Lang): LocalizedTech {
  return {
    rationale: pick(tech.trlRationale, lang),
    skills: tech.employeeSkills.map((s) => pick(s, lang)),
    focus: { awareness: pick(tech.learningFocus.awareness, lang), practitioner: pick(tech.learningFocus.practitioner, lang) },
  }
}
