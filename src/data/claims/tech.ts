import type { Claim, ClaimSource } from './types'

/**
 * Claims behind «تقنيات تغيّر العمل الحكومي» (packet P5b). Ids are stable, kebab-case,
 * prefixed 'tech-'. Counts, horizons and the TRL scale reuse `method-tech-*` claims.
 * Registered 2026-10-22; web-verified the same day (reviews/claims-verification-20261022.md).
 */

const REVIEWED = '2026-10-22'

const DGA_ADOPTION_2026: ClaimSource = {
  title: { ar: 'مؤشر جاهزية تبني التقنيات الناشئة 2026 (الدورة الرابعة)', en: 'Emerging Technologies Adoption Readiness Index 2026 (fourth cycle)' },
  publisher: { ar: 'هيئة الحكومة الرقمية', en: 'Digital Government Authority (DGA)' },
  url: 'https://aawsat.com/node/5265391',
  locator: 'DGA announcement, 22 April 2026, as reported by Asharq Al-Awsat',
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
      ar: 'بلغت النتيجة العامة لمؤشر جاهزية تبني التقنيات الناشئة 76.04% في دورته الرابعة لعام 2026، بمشاركة 54 جهة حكومية، مقارنة بـ74.69% في 2025.',
      en: 'The Emerging Technologies Adoption Readiness Index reached an overall 76.04% in its fourth cycle (2026), across 54 participating government entities, up from 74.69% in 2025.',
    },
    value: { ar: '76%', en: '76%' },
    scope: { ar: '54 جهة حكومية مشاركة في القياس', en: '54 government entities that took part' },
    period: '2026',
    kind: 'official',
    confidence: 'medium',
    source: DGA_ADOPTION_2026,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'الرقم من إعلان الهيئة كما نقلته الصحف في 22 أبريل 2026، ولم يُعثر على صفحة التقرير في موقع الهيئة. المؤشر يقيس جاهزية الجهات المشاركة لا كل الجهات الحكومية.',
      en: 'The figure is from the authority’s announcement as reported on 22 April 2026; no report page was found on the DGA site. The index measures the readiness of participating entities, not all government entities.',
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
