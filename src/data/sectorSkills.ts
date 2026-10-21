// Consulting-category → skill-domain mapping and pure helpers over the sector aggregates (packet P4).
// Record counts are recorded data; the weights are editorial judgments registered as claims
// (src/data/claims/method.ts, `categoryWeightRows`). No module-level computation over the entity arrays:
// views get aggregates from public/data/sectors.json through src/data/gov/loaders.ts.

import { consultingCategories } from './govServices.ts'
import type { DomainSignal, SectorAggregate } from './gov/types.ts'

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

/** Ranked development domains from a {category: records} map. All mapped domains, no renormalized shares. */
export function domainsFromCategoryCounts(counts: Record<string, number> | undefined | null): DomainSignal[] {
  if (!counts) return []
  const scores = new Map<string, number>()
  for (const [cat, n] of Object.entries(counts)) {
    const map = categoryDomainMap[cat]
    if (!map) continue
    for (const { domainId, weight } of map) scores.set(domainId, (scores.get(domainId) ?? 0) + n * weight)
  }
  return [...scores.entries()]
    .filter(([, raw]) => raw > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([domainId, raw]) => ({ domainId, records: Math.round(raw), raw: Math.round(raw * 1000) / 1000 }))
}

/** Total consulting records in a {category: records} map. */
export function totalRecords(counts: Record<string, number> | undefined | null): number {
  return counts ? Object.values(counts).reduce((a, n) => a + n, 0) : 0
}

/** The consulting category with the most records (null when there are none). */
export function topCategory(counts: Record<string, number> | undefined | null): { category: string; records: number } | null {
  if (!counts) return null
  let best: { category: string; records: number } | null = null
  for (const [category, records] of Object.entries(counts)) if (!best || records > best.records) best = { category, records }
  return best
}

/** Sectors (that publish aggregates) ranked by records in one consulting category. */
export function rankSectorsByCategory(sectors: readonly SectorAggregate[], category: string): { sector: SectorAggregate; records: number }[] {
  return sectors
    .filter((s) => !s.pooled && s.categories)
    .map((sector) => ({ sector, records: sector.categories?.[category] ?? 0 }))
    .filter((r) => r.records > 0)
    .sort((a, b) => b.records - a.records)
}

/** Strip the leading "N. " ordering prefix for compact display. */
export function categoryShort(category: string): string {
  return category.replace(/^\d+\.\s*/, '')
}

/** All 8 category names in canonical (workbook) order. */
export const categoryNames: string[] = consultingCategories.map((c) => c.category)

/* ------------------------------------------------------------------------------------------------
 * P4-SHIM(p2): compile-time compatibility for the old GovSectors/EntityDetail views, which packet P4
 * part 2 replaces. They return nothing (the public build shows no inferred needs). Delete with those views.
 * ---------------------------------------------------------------------------------------------- */

/** @deprecated P4-SHIM(p2) */
export interface SkillDemand {
  domainId: string
  share: number
  raw: number
}
/** @deprecated P4-SHIM(p2) */
export const sectorSkillProfiles: Record<string, SkillDemand[]> = {}
/** @deprecated P4-SHIM(p2) */
export function entitySkillProfile(_entityId: string): SkillDemand[] {
  return []
}
/** @deprecated P4-SHIM(p2) */
export function topCategoryForSector(_sectorName: string): { category: string; records: number } | null {
  return null
}
/** @deprecated P4-SHIM(p2) */
export function sectorsByCategory(_category: string): { sector: string; records: number }[] {
  return []
}
