import { domains } from '../../data/domains'
import { skillRecords } from '../../data/skillRecords'
import { libraryRoles } from '../../data/roleLibrary'
import { workFamilies } from '../../data/workShifts'
import { technologies } from '../../data/technologies'
import type { SectorsFile } from '../../data/gov/types'
import type { GraphSources, SectorSource } from '../../lib/skillsGraph'

/**
 * Rising capabilities whose wording is not a skill name, mapped to the nearest of the 40 skills
 * (editorial, P10b — review P2-8). Keyed by the capability's English wording.
 */
export const RISING_SKILL_OVERRIDES: Record<string, string> = {
  'Reading data and its limits': 'sr-ai-data-0', // → Data literacy
  'Security and privacy requirements in contracts': 'sr-cyber-1', // → Privacy & personal data protection
}

/**
 * The skills each shift in government work asks for, read from the shift's own «ما يتطلبه» line
 * (src/data/leaders/shifts.ts) and mapped to skill-record ids. Editorial; the story lights them
 * between the shift's domains and the roles that carry it.
 */
export const STORY_SKILLS: Record<string, string[]> = {
  'genai-casework': ['sr-ai-data-3', 'sr-ai-data-4', 'sr-cyber-1'],
  'data-decisions': ['sr-ai-data-0', 'sr-ai-data-1', 'sr-leadership-3'],
  'measured-services': ['sr-service-design-0', 'sr-service-design-1', 'sr-service-design-2', 'sr-agile-4'],
  'cyber-privacy-duty': ['sr-cyber-0', 'sr-cyber-1', 'sr-cyber-4', 'sr-policy-1'],
  'product-delivery': ['sr-agile-0', 'sr-agile-1', 'sr-agile-4', 'sr-policy-4'],
}

/** Every source the full map draws on (sectors are added when their file is loaded). */
export function defaultSources(): GraphSources {
  return {
    domains,
    skills: skillRecords.map((r) => ({ id: r.id, domainId: r.domainId, skillIndex: r.skillIndex, name: r.name })),
    roles: libraryRoles.map((r) => ({ id: r.id, name: r.name, family: r.family, targets: r.targets })),
    families: workFamilies.map((f) => ({
      id: f.id,
      name: f.name,
      rising: f.rising.map((r) => (RISING_SKILL_OVERRIDES[r.skill.en] ? { ...r, skillId: RISING_SKILL_OVERRIDES[r.skill.en] } : r)),
      relatedRoleIds: f.relatedRoleIds,
    })),
    technologies: technologies.map((t) => ({ id: t.id, name: t.name, domainIds: t.domainIds, skills: t.skills })),
  }
}

/**
 * Sectors that publish aggregates (n ≥ 10 entities with records), with their ranked development
 * domains from the consulting record — an editorial inference, labelled as such wherever shown.
 */
export function sectorSources(file: SectorsFile | null | undefined): SectorSource[] {
  if (!file) return []
  return file.sectors
    .filter((s) => !s.pooled && s.showAggregates && (s.domains?.length ?? 0) > 0)
    .map((s) => ({ id: s.id, name: { ar: s.nameAr, en: s.nameEn }, domains: (s.domains ?? []).map((d) => ({ domainId: d.domainId, records: d.records })) }))
}
