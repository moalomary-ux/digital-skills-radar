import type { Level, ScaleOption, Stage } from './types'

export const levels: Level[] = [
  {
    value: 1,
    name: { ar: 'وعي', en: 'Awareness' },
    description: {
      ar: 'تفهم الأساسيات وتستطيع وصف المفاهيم بثقة.',
      en: 'You understand the fundamentals and can describe the concepts.',
    },
  },
  {
    value: 2,
    name: { ar: 'تطبيق', en: 'Working' },
    description: {
      ar: 'تطبق المهارة ببعض الإرشاد في المواقف الاعتيادية.',
      en: 'You apply the skill with some guidance in routine situations.',
    },
  },
  {
    value: 3,
    name: { ar: 'ممارس', en: 'Practitioner' },
    description: {
      ar: 'تطبق باستقلالية في المواقف المعقدة وتشارك معرفتك مع غيرك.',
      en: 'You apply independently in complex situations and share your knowledge.',
    },
  },
  {
    value: 4,
    name: { ar: 'خبير', en: 'Expert' },
    description: {
      ar: 'تقود الممارسة وتضع المعايير وتعلّم الآخرين.',
      en: 'You lead the practice, set standards and teach others.',
    },
  },
]

export const stages: Stage[] = [
  {
    id: 'foundation',
    name: { ar: 'تأسيسي', en: 'Foundation' },
    min: 0,
    max: 1.24,
    description: {
      ar: 'أنت في بداية الرحلة — الأولوية لبناء الوعي بالمفاهيم الأساسية عبر المجالات.',
      en: 'You are at the start of the journey — priority goes to building awareness of core concepts across domains.',
    },
  },
  {
    id: 'developing',
    name: { ar: 'نامٍ', en: 'Developing' },
    min: 1.25,
    max: 2.24,
    description: {
      ar: 'لديك أساس جيد — حان وقت التطبيق المنتظم في العمل اليومي مع إرشاد متناقص.',
      en: 'You have a good base — time for regular application in daily work with decreasing guidance.',
    },
  },
  {
    id: 'proficient',
    name: { ar: 'متمكّن', en: 'Proficient' },
    min: 2.25,
    max: 3.24,
    description: {
      ar: 'تعمل باستقلالية في مواقف معقدة — الخطوة التالية قيادة الممارسة ومشاركة المعرفة.',
      en: 'You work independently in complex situations — the next step is leading the practice and sharing knowledge.',
    },
  },
  {
    id: 'leading',
    name: { ar: 'رائد', en: 'Leading' },
    min: 3.25,
    max: 4,
    description: {
      ar: 'أنت مرجع لغيرك — ركّز على وضع المعايير وتوجيه الفرق ونقل الخبرة.',
      en: 'You are a reference for others — focus on setting standards, coaching teams and transferring expertise.',
    },
  },
]

/**
 * Single documented scoring scheme (expert-review P0-9, defect-fix v6-A1):
 * BOTH the per-domain level and the overall stage use the SAME contiguous
 * upper-bound thresholds — 1.25 / 2.25 / 3.25. The previous min/max band
 * lookup had open gaps (1.24–1.25 etc.) whose fallback wrongly returned
 * the top stage ("رائد") for any score inside a gap. Covered by
 * scripts/levels.selftest.mjs (boundary values 0, 1.24, 1.25, …, 4.0).
 */
export const stageForScore = (avg: number): Stage => {
  const id = avg < 1.25 ? 'foundation' : avg < 2.25 ? 'developing' : avg < 3.25 ? 'proficient' : 'leading'
  return stages.find((s) => s.id === id)!
}

export const levelForScore = (score: number): Level => {
  const v = score < 1.25 ? 1 : score < 2.25 ? 2 : score < 3.25 ? 3 : 4
  return levels.find((l) => l.value === v)!
}

export const scaleOptions: ScaleOption[] = [
  {
    value: 0,
    label: { ar: 'لا أعرف ما هذا', en: "I don't know what this is" },
  },
  {
    value: 1,
    label: { ar: 'أستطيع ذلك بمساعدة', en: 'I can do it with guidance' },
  },
  {
    value: 2,
    label: { ar: 'أستطيع ذلك بمفردي', en: 'I can do it on my own' },
  },
  {
    value: 3,
    label: { ar: 'أستطيع ذلك بسهولة في مواقف معقدة', en: 'I can do it confidently in complex situations' },
  },
  {
    value: 4,
    label: { ar: 'أستطيع ذلك وأوجّه غيري', en: 'I can do it and guide others' },
  },
]
