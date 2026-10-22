import { domains } from '../../data/domains'
import { skillRecords } from '../../data/skillRecords'
import { libraryRoles } from '../../data/roleLibrary'
import { workFamilies } from '../../data/workShifts'
import { technologies } from '../../data/technologies'
import type { SectorsFile } from '../../data/gov/types'
import type { GraphSources, SectorSource } from '../../lib/skillsGraph'

/** Every source the full map draws on (sectors are added when their file is loaded). */
export function defaultSources(): GraphSources {
  return {
    domains,
    skills: skillRecords.map((r) => ({ id: r.id, domainId: r.domainId, skillIndex: r.skillIndex, name: r.name })),
    roles: libraryRoles.map((r) => ({ id: r.id, name: r.name, family: r.family, targets: r.targets })),
    families: workFamilies.map((f) => ({ id: f.id, name: f.name, rising: f.rising, relatedRoleIds: f.relatedRoleIds })),
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
