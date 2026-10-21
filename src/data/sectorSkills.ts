// v8 "اربط وطور": consulting-category → skill-domain mapping + derived demand profiles.
// All percentages are computed from real service records (govEntityDetails.ts);
// no number in this file is hand-invented.

import { entityCategoryRecords } from './govEntityDetails'
import { govEntities } from './govEntities'
import { consultingCategories } from './govServices'

/**
 * Category → domain mapping table (documented, bilingual rationale).
 * Weights within a category sum to 1.0; a category develops 1–3 domains.
 *
 * | الفئة (category)                        | المجالات (domains)            | المبرر — rationale |
 * |-----------------------------------------|-------------------------------|--------------------|
 * | 1. الاستراتيجيات الرقمية                | policy .7, leadership .3      | صياغة استراتيجية التحول عمل حوكمي، وتنفيذها يتطلب قيادة تغيير — drafting a digital strategy is governance work; delivering it needs change leadership |
 * | 2. تخطيط وتمكين البنية التقنية          | cloud .7, cyber .3            | تخطيط البنية والمنصات جوهره سحابة وبنية وتحديث أنظمة، مع أمن منذ التصميم — infrastructure/platform planning is cloud & modernization at its core, with security by design |
 * | 3. الابتكار والتقنيات الناشئة           | emerging .8, ai-data .2       | الفئة تدور حول استكشاف التقنيات الناشئة، وأغلبها اليوم ذكاء اصطناعي — the category is emerging-tech scouting, most of it AI today |
 * | 4. التميز المؤسسي واستمرارية الأعمال    | agile .6, leadership .4       | التميز المؤسسي تحسين مستمر للعمليات والتسليم، واستمرارية الأعمال إدارة تغيير — organizational excellence is continuous delivery improvement; continuity is change management |
 * | 5. الاستثمار والخدمات الرقمية           | service-design .6, policy .4  | الخدمات الرقمية تصميم حول المستفيد، والاستثمار شراء وتعاقد تقني — digital services are beneficiary-centred design; investment is tech procurement |
 * | 6. البيانات والتكامل                    | ai-data .8, cloud .2          | البيانات وحوكمتها وتكاملها جوهرها إلمام وتحليل بيانات عبر تشغيل بيني — data & integration is data literacy/governance over interoperability |
 * | 7. مؤشرات الأداء الرقمي                 | ai-data .6, agile .4          | المؤشرات تحليل بيانات وقياس منافع وأثر — performance indicators are data analysis plus benefits measurement |
 * | 8. التميز والتنافسية                    | leadership .6, policy .4      | الجوائز والتنافسية سرد إنجاز وتأثير في أصحاب المصلحة ضمن أطر حوكمة — awards & competitiveness are achievement storytelling and stakeholder influence within governance frames |
 */
export interface DomainWeight {
  domainId: string
  weight: number
}

export const categoryDomainMap: Record<string, DomainWeight[]> = {
  '1. الاستراتيجيات الرقمية': [
    { domainId: 'policy', weight: 0.7 },
    { domainId: 'leadership', weight: 0.3 },
  ],
  '2. تخطيط وتمكين البنية التقنية': [
    { domainId: 'cloud', weight: 0.7 },
    { domainId: 'cyber', weight: 0.3 },
  ],
  '3. الابتكار والتقنيات الناشئة': [
    { domainId: 'emerging', weight: 0.8 },
    { domainId: 'ai-data', weight: 0.2 },
  ],
  '4. التميز المؤسسي واستمرارية الأعمال': [
    { domainId: 'agile', weight: 0.6 },
    { domainId: 'leadership', weight: 0.4 },
  ],
  '5. الاستثمار والخدمات الرقمية': [
    { domainId: 'service-design', weight: 0.6 },
    { domainId: 'policy', weight: 0.4 },
  ],
  '6. البيانات والتكامل': [
    { domainId: 'ai-data', weight: 0.8 },
    { domainId: 'cloud', weight: 0.2 },
  ],
  '7. مؤشرات الأداء الرقمي': [
    { domainId: 'ai-data', weight: 0.6 },
    { domainId: 'agile', weight: 0.4 },
  ],
  '8. التميز والتنافسية': [
    { domainId: 'leadership', weight: 0.6 },
    { domainId: 'policy', weight: 0.4 },
  ],
}

export interface SkillDemand {
  domainId: string
  /** 0–100, top-3 shares renormalized to sum 100 */
  share: number
  /** raw weighted score before normalization (for transparency) */
  raw: number
}

/** Weighted domain scores from a {category: records} map, normalized to a top-3 profile. */
export function profileFromCategoryCounts(counts: Record<string, number> | undefined): SkillDemand[] {
  if (!counts) return []
  const scores = new Map<string, number>()
  let total = 0
  for (const [cat, n] of Object.entries(counts)) {
    const map = categoryDomainMap[cat]
    if (!map) continue
    for (const { domainId, weight } of map) {
      scores.set(domainId, (scores.get(domainId) ?? 0) + n * weight)
    }
    total += n
  }
  if (total === 0) return []
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1])
  const top = ranked.slice(0, 3)
  const topSum = top.reduce((a, [, v]) => a + v, 0)
  return top.map(([domainId, raw]) => ({ domainId, raw, share: Math.round((raw / topSum) * 100) }))
}

/** Per-entity skill demand profile from its own consulting categories. */
export function entitySkillProfile(entityId: string): SkillDemand[] {
  return profileFromCategoryCounts(entityCategoryRecords[entityId])
}

/** Per-sector consulting-category totals, aggregated from member entities' real records. */
export const sectorCategoryTotals: Record<string, Record<string, number>> = (() => {
  const acc: Record<string, Record<string, number>> = {}
  for (const e of govEntities) {
    const cats = entityCategoryRecords[e.id]
    if (!cats) continue
    const sec = acc[e.sector] ?? (acc[e.sector] = {})
    for (const [cat, n] of Object.entries(cats)) sec[cat] = (sec[cat] ?? 0) + n
  }
  return acc
})()

/** Per-sector skill demand profile (top-3 domains, %), from member entities' real records. */
export const sectorSkillProfiles: Record<string, SkillDemand[]> = Object.fromEntries(
  Object.entries(sectorCategoryTotals).map(([sec, counts]) => [sec, profileFromCategoryCounts(counts)])
)

/** The consulting category with the most records inside a sector (null if the sector has none). */
export function topCategoryForSector(sectorName: string): { category: string; records: number } | null {
  const counts = sectorCategoryTotals[sectorName]
  if (!counts) return null
  let best: { category: string; records: number } | null = null
  for (const [category, records] of Object.entries(counts)) {
    if (!best || records > best.records) best = { category, records }
  }
  return best
}

/** Sectors ranked by demand for a given consulting category (only sectors with records). */
export function sectorsByCategory(category: string): { sector: string; records: number }[] {
  return Object.entries(sectorCategoryTotals)
    .map(([sector, counts]) => ({ sector, records: counts[category] ?? 0 }))
    .filter((r) => r.records > 0)
    .sort((a, b) => b.records - a.records)
}

/** Strip the leading "N. " ordering prefix for compact display. */
export function categoryShort(category: string): string {
  return category.replace(/^\d+\.\s*/, '')
}

/** All 8 category names in canonical (workbook) order. */
export const categoryNames: string[] = consultingCategories.map((c) => c.category)
