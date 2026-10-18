export type Lang = 'ar' | 'en'

/** A bilingual string — every user-facing text in the app. */
export interface L {
  ar: string
  en: string
}

export interface Domain {
  id: string
  name: L
  shortName: L
  description: L
  icon: string // key into the icon set
  skills: L[]
}

export interface Statement {
  id: string
  domainId: string
  skillIndex: number
  text: L
}

export interface Level {
  value: 1 | 2 | 3 | 4
  name: L
  description: L
}

export interface Stage {
  id: 'foundation' | 'developing' | 'proficient' | 'leading'
  name: L
  min: number
  max: number
  description: L
}

export interface ScaleOption {
  value: 0 | 1 | 2 | 3 | 4
  label: L
}

export interface Role {
  id: string
  name: L
  description: L
  /** target level 0-4 per domain id */
  targets: Record<string, number>
}

export interface Resource {
  id: string
  title: L
  org: L
  url: string
  kind: 'course' | 'framework' | 'report' | 'tool' | 'program'
}

export interface PathwayTransition {
  from: number // 1..3
  to: number // 2..4
  behaviors: L[]
  resourceIds: string[]
}

export interface DomainPathway {
  domainId: string
  transitions: PathwayTransition[]
}

export interface StandardCard {
  id: string
  name: L
  facts: L[]
  description: L
  url: string
}

export interface ReportCard {
  id: string
  name: L
  publisher: L
  highlight: L
  url: string
}
