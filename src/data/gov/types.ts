/**
 * Government data layer (packet P4): shared types for the cleaned directory, the generated JSON
 * files under `public/data/` and the fetch-based loaders.
 *
 * Nothing in this file imports the big arrays; views import from `src/data/gov/*` only.
 */

/** Classification of every directory entry (rule-based, see README.md). */
export type EntityType = 'government' | 'quasi-government' | 'state-owned' | 'private' | 'nonprofit' | 'international' | 'sports'

export const ENTITY_TYPES: readonly EntityType[] = ['government', 'quasi-government', 'state-owned', 'private', 'nonprofit', 'international', 'sports'] as const

/** Entity classes that appear in the public (aggregate) index. Private entities never do. */
export const PUBLIC_ENTITY_TYPES: readonly EntityType[] = ['government', 'quasi-government', 'state-owned', 'nonprofit', 'international', 'sports'] as const

/** Entity classes selected by default in the directory («جهة حكومية» in the binding glossary = government only; quasi shown next to it). */
export const DEFAULT_DIRECTORY_TYPES: readonly EntityType[] = ['government', 'quasi-government'] as const

/** `historical` = abolished or renamed body kept for the record; `merged` = duplicate folded into `mergedInto`. */
export type EntityStatus = 'active' | 'historical' | 'merged'

/** One row of `public/data/entities-index.json` (aggregate and full builds). Exactly these six fields. */
export interface EntityIndexRow {
  id: string
  nameAr: string
  nameEn: string | null
  /** sector slug, see `taxonomy.ts` → `sectors` */
  sectorId: string
  /** entity class, see `ENTITY_TYPES` */
  type: EntityType
  /** region slug, see `taxonomy.ts` → `regions` */
  region: string
}

/** Ranked development domain derived from consulting-category record counts. No renormalized shares. */
export interface DomainSignal {
  domainId: string
  /** records that contributed to this domain (weighted sum, rounded) */
  records: number
  /** unrounded weighted sum, kept for transparency */
  raw: number
}

/** One sector in `public/data/sectors.json`. */
export interface SectorAggregate {
  /** sector slug used in `/sectors/:sectorId` */
  id: string
  nameAr: string
  nameEn: string
  /** active entities of a public class in this sector after cleaning */
  entityCount: number
  /** entities (of any class) in this sector that have service records */
  entitiesWithRecords: number
  /** true exactly when `entitiesWithRecords >= SECTOR_MIN_ENTITIES` */
  showAggregates: boolean
  /** training participation records; null when aggregates are withheld */
  training: number | null
  /** consulting services; null when aggregates are withheld */
  consulting: number | null
  /** consulting records per category key (verbatim workbook category); only when aggregates are shown */
  categories: Record<string, number> | null
  /** ranked domains from `categories`; only when aggregates are shown */
  domains: DomainSignal[] | null
  /** true for the pooled row that carries the totals of withheld sectors so sums stay exact */
  pooled?: boolean
  /** slugs of the sectors pooled into this row */
  pooledSectorIds?: string[]
}

export interface SectorsFile {
  /** ISO date of the generating run */
  generatedOn: string
  /** 'aggregate' | 'full' at generation time */
  mode: 'aggregate' | 'full'
  /** national totals the sector rows sum to */
  national: { training: number; consulting: number; entitiesServed: number }
  /** the n ≥ 10 privacy rule */
  minEntitiesForAggregates: number
  periods: { training: { ar: string; en: string }; consulting: { ar: string; en: string } }
  cutoff: { ar: string; en: string }
  sectors: SectorAggregate[]
}

/** Per-entity service record (full build only; never in the aggregate build). */
export interface EntityServiceRecord {
  trainingRecords: number
  trainingPrograms: number
  consultingServices: number
  /** verbatim top consulting services, Arabic plural grammar fixed */
  topConsulting: string | null
  consultingYears: string | null
  lastYear: number | null
}

/** One row of `public/data/entities/<sectorId>.json` (full build only). */
export interface EntityDetailRow extends EntityIndexRow {
  /** organizational type slug (ministry, authority, …), see `taxonomy.ts` → `kinds` */
  kind: string
  /** source scope slug, see `taxonomy.ts` → `scopes` */
  scope: string
  hq: string | null
  website: string | null
  /** logo file stem under `/logos/<stem>.webp`, or null */
  logo: string | null
  services: EntityServiceRecord | null
  /** consulting records per category key */
  categories: Record<string, number> | null
  /** training records per year, aligned with `TRAINING_YEARS` */
  yearlyTraining: number[] | null
}

/** Minimum entities with records before a sector aggregate is published (claim `method-gov-sector-min`). */
export const SECTOR_MIN_ENTITIES = 10
