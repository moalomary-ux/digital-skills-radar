import type { Claim, ClaimSource } from './types'

/**
 * Claims behind «تقنيات تغيّر العمل الحكومي» (packet P5b). Ids are stable, kebab-case,
 * prefixed 'tech-'. Counts, horizons and the TRL scale reuse `method-tech-*` claims.
 * Registered 2026-10-22 without network access.
 */

const REVIEWED = '2026-10-22'

const DGA_ADOPTION_2026: ClaimSource = {
  title: { ar: 'مؤشر تبني التقنيات الناشئة 2026', en: 'Emerging Technologies Adoption Index 2026' },
  publisher: { ar: 'هيئة الحكومة الرقمية', en: 'Digital Government Authority (DGA)' },
  year: 2026,
}

const EDITORIAL: ClaimSource = {
  title: { ar: 'رادار المهارات الرقمية: ربط التقنيات بالمهارات', en: 'Digital Skills Radar: technology-to-skill mapping' },
  publisher: { ar: 'مؤلف الأداة (مفهوم مستقل)', en: 'The tool’s author (independent concept)' },
  year: 2026,
}

export const techClaims: Claim[] = [
  {
    id: 'tech-dga-adoption-index-2026',
    text: {
      ar: 'تجاوز مؤشر تبني التقنيات الناشئة في الجهات الحكومية 76% في قياس عام 2026 الذي تنشره هيئة الحكومة الرقمية.',
      en: 'The emerging-technologies adoption index for government entities exceeded 76% in the 2026 measurement published by the Digital Government Authority.',
    },
    value: { ar: '76%', en: '76%' },
    scope: { ar: 'الجهات الحكومية في المملكة', en: 'Saudi government entities' },
    period: '2026',
    kind: 'official',
    confidence: 'medium',
    source: DGA_ADOPTION_2026,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'يُراجع الرابط: القيمة منقولة عن مراجعة سابقة للمؤشر ولم تُطابق مع الصفحة الرسمية في هذه المراجعة.',
      en: 'Check the link: the value is carried over from an earlier review of the index and was not matched to the official page in this review.',
    },
  },
  {
    id: 'tech-editorial-skill-map',
    text: {
      ar: 'ربط كل تقنية بالمهارات التي تتطلبها من قائمة مهارات الرادار حكم تحريري، لا معيار رسمي.',
      en: 'Linking each technology to the skills it requires from the radar’s skill list is an editorial judgment, not an official standard.',
    },
    value: { ar: 'ربط تحريري', en: 'Editorial mapping' },
    kind: 'editorial',
    confidence: 'medium',
    source: EDITORIAL,
    reviewedOn: REVIEWED,
    derivation: {
      ar: 'قراءة مكتبية لوصف كل تقنية ومهارات الموظفين المذكورة معها، ثم اختيار أقرب المهارات من قائمة المهارات الأربعين.',
      en: 'A desk reading of each technology’s description and the employee skills listed with it, then choosing the closest skills from the forty-skill list.',
    },
    caveat: {
      ar: 'هذه قراءة مستقلة وليست رادار التقنيات الرسمي لأي جهة.',
      en: 'This is an independent reading, not any organization’s official technology radar.',
    },
  },
]
