import type { Level, ScaleOption, Stage } from './types'
import type { TrackId } from './tracks'

/**
 * ONE level vocabulary for the whole product (DECISION §5, binding glossary):
 * «وعي · تطبيق · إتقان · ريادة» / "Awareness · Application · Proficiency · Leading".
 * Same words as the registered claim `method-levels-count` (src/data/claims/method.ts).
 */
export const levels: Level[] = [
  {
    value: 1,
    name: { ar: 'وعي', en: 'Awareness' },
    description: {
      ar: 'تفهم الأساسيات وتستطيع وصف المفاهيم بثقة.',
      en: 'You understand the fundamentals and can describe the concepts with confidence.',
    },
  },
  {
    value: 2,
    name: { ar: 'تطبيق', en: 'Application' },
    description: {
      ar: 'تطبّق المهارة ببعض الإرشاد في المواقف المعتادة.',
      en: 'You apply the skill with some guidance in routine situations.',
    },
  },
  {
    value: 3,
    name: { ar: 'إتقان', en: 'Proficiency' },
    description: {
      ar: 'تطبّق المهارة باستقلالية في المواقف المعقدة وتشارك معرفتك مع غيرك.',
      en: 'You apply the skill independently in complex situations and share your knowledge.',
    },
  },
  {
    value: 4,
    name: { ar: 'ريادة', en: 'Leading' },
    description: {
      ar: 'تقود الممارسة وتضع المعايير وتوجّه الآخرين.',
      en: 'You lead the practice, set standards and guide others.',
    },
  },
]

/**
 * Kept for compatibility only — NOT shown in the UI (no overall stage or score headline, DECISION §6).
 * Stage names reuse the single level vocabulary so no second scale exists anywhere.
 */
export const stages: Stage[] = [
  { id: 'foundation', name: { ar: 'وعي', en: 'Awareness' }, min: 0, max: 1.24, description: levels[0].description },
  { id: 'developing', name: { ar: 'تطبيق', en: 'Application' }, min: 1.25, max: 2.24, description: levels[1].description },
  { id: 'proficient', name: { ar: 'إتقان', en: 'Proficiency' }, min: 2.25, max: 3.24, description: levels[2].description },
  { id: 'leading', name: { ar: 'ريادة', en: 'Leading' }, min: 3.25, max: 4, description: levels[3].description },
]

/**
 * Single documented scoring scheme: contiguous upper-bound thresholds 1.25 / 2.25 / 3.25
 * (claim `method-level-thresholds`). The plan transitions in learning.ts use the same function.
 */
export const LEVEL_THRESHOLDS = [1.25, 2.25, 3.25] as const

export const levelValueForScore = (score: number): 1 | 2 | 3 | 4 =>
  score < LEVEL_THRESHOLDS[0] ? 1 : score < LEVEL_THRESHOLDS[1] ? 2 : score < LEVEL_THRESHOLDS[2] ? 3 : 4

/** @deprecated compatibility only; the UI shows the 8 domain levels, never an overall stage. */
export const stageForScore = (avg: number): Stage => stages[levelValueForScore(avg) - 1]

export const levelForScore = (score: number): Level => levels[levelValueForScore(score) - 1]

/** Level for a whole target value (1–4). */
export const levelForTarget = (target: number): Level => levels[Math.max(1, Math.min(4, Math.round(target))) - 1]

export const scaleOptions: ScaleOption[] = [
  { value: 0, label: { ar: 'لا أعرف ما هذا', en: "I don't know what this is" } },
  { value: 1, label: { ar: 'أستطيع ذلك بمساعدة', en: 'I can do it with guidance' } },
  { value: 2, label: { ar: 'أستطيع ذلك بمفردي', en: 'I can do it on my own' } },
  { value: 3, label: { ar: 'أستطيع ذلك بسهولة في مواقف معقدة', en: 'I can do it confidently in complex situations' } },
  { value: 4, label: { ar: 'أستطيع ذلك وأوجّه غيري', en: 'I can do it and guide others' } },
]

/**
 * Indicative, editorial target level per domain for each of the five role categories
 * (claim `method-role-categories`; caveat: targets are indicative, not job standards).
 * Choosing a precise role from the role library replaces the category target.
 * Domain order: ai-data, cyber, cloud, service-design, policy, agile, emerging, leadership.
 */
export const categoryTargets: Record<TrackId, Record<string, number>> = {
  // عام — every employee: awareness everywhere, applied security basics
  awareness: { 'ai-data': 1, cyber: 2, cloud: 1, 'service-design': 1, policy: 1, agile: 1, emerging: 1, leadership: 1 },
  // تطبيقي — daily operational work done correctly and safely
  applied: { 'ai-data': 2, cyber: 2, cloud: 2, 'service-design': 2, policy: 2, agile: 2, emerging: 1, leadership: 2 },
  // تخصصي — designs, builds or runs digital solutions
  specialist: { 'ai-data': 3, cyber: 3, cloud: 3, 'service-design': 2, policy: 2, agile: 3, emerging: 2, leadership: 2 },
  // قيادة فرق — leads adoption, quality and change
  team_lead: { 'ai-data': 2, cyber: 2, cloud: 2, 'service-design': 3, policy: 3, agile: 3, emerging: 2, leadership: 3 },
  // تنفيذي — decides investment, priorities and risk
  executive: { 'ai-data': 3, cyber: 2, cloud: 2, 'service-design': 3, policy: 4, agile: 3, emerging: 3, leadership: 4 },
}
