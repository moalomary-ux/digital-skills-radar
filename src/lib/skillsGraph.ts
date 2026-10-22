/**
 * «خريطة المهارات التفاعلية» — the pure model behind the interactive skills map (packet P10).
 *
 * No React, no data imports (type-only imports are erased): every function takes its sources as
 * arguments, so the home-page preview can build a domains + skills graph without pulling the
 * technology, role or sector data into its chunk, and the tests can feed any fixture.
 *
 * Graph
 *   nodes  8 domains (centre ring) · 40 skills · job families + digital roles (shared third ring)
 *          · technologies (fourth ring) · optional sectors (outer ring, loaded on demand)
 *   edges  domain–skill · role–domain (role target ≥ «إتقان») · family–domain / family–skill
 *          (rising capabilities) · family–role (roles the family works with) · tech–skill /
 *          tech–domain (required skills) · sector–domain (strongest consulting-record domains)
 *
 * Layout: deterministic concentric radial layout, no force simulation. Each domain owns one equal
 * angular wedge; every outer node sits in the wedge of its primary domain, so related nodes share
 * a wedge. Angles follow the reading direction like the radar chart: clockwise from the top in
 * English, counter-clockwise in Arabic.
 *
 * Primary domain rules (documented, editorial):
 *   skill  → its domain
 *   role   → the domain of its highest target; ties go to the domain of the role's library family
 *            (Leadership→leadership, Data & AI→ai-data, Engineering→cloud, Design→service-design,
 *            Policy→policy, Delivery→agile), then to the first domain in canonical order
 *   family → the domain of its first listed rising capability
 *   tech   → its first linked domain (`domainIds[0]`), else the domain of its first required skill
 *   sector → its distinctive domain: the one whose share of the sector's consulting records is
 *            highest relative to the average share across all sectors (location quotient), among
 *            domains with at least 5 records; ties and single-sector inputs fall back to the domain
 *            with the most records. Every sector shares the same leading domain (cloud), so ranking
 *            by records alone stacked all of them in one wedge. Editorial, labelled as such.
 */
import type { L, Lang } from '../data/types'

/* ------------------------------------------------------------------ model */

export type NodeKind = 'domain' | 'skill' | 'family' | 'role' | 'tech' | 'sector'

/** Every kind, centre outwards (also the reading order of the rings for the keyboard). */
export const NODE_KINDS: readonly NodeKind[] = ['domain', 'skill', 'family', 'role', 'tech', 'sector']

/** Ring index per kind (0 = centre). Families and roles share the third ring. */
export const RING_OF: Record<NodeKind, number> = { domain: 0, skill: 1, family: 2, role: 2, tech: 3, sector: 4 }

export interface GraphNode {
  /** `<kind>.<ref>`, e.g. `domain.cyber`, `skill.sr-cyber-0`, `role.data_scientist`, `tech.C1-T01` */
  id: string
  kind: NodeKind
  /** id in the source data */
  ref: string
  label: L
  /** short label (domains only) */
  short?: L
  /** equivalent titles used across entities (roles, families): searchable, shown in the panel */
  aliases?: L[]
  /** primary domain: the wedge the node sits in and its colour */
  domainId: string
}

export type EdgeKind =
  | 'domain-skill'
  | 'role-domain'
  | 'family-domain'
  | 'family-skill'
  | 'family-role'
  | 'tech-skill'
  | 'tech-domain'
  | 'sector-domain'

export interface GraphEdge {
  id: string
  source: string
  target: string
  kind: EdgeKind
  /** role–domain: the target level (1–4); sector–domain: records; otherwise 1 */
  weight: number
}

export interface SkillsGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  byId: Map<string, GraphNode>
  edgeById: Map<string, GraphEdge>
  /** neighbour node ids per node */
  adjacency: Map<string, Set<string>>
  /** edge ids per node */
  incident: Map<string, string[]>
  /** canonical domain order */
  domainIds: string[]
}

/* ---------------------------------------------------------------- sources */

export interface DomainSource {
  id: string
  name: L
  shortName: L
  skills: L[]
}
export interface SkillSource {
  id: string
  domainId: string
  skillIndex: number
  name: L
}
export interface RoleSource {
  id: string
  name: L
  /** equivalent titles used across entities */
  equivalents?: L[]
  family?: string
  targets: Record<string, number>
}
export interface FamilySource {
  id: string
  name: L
  /** rising capabilities; `skillId` maps one to a skill explicitly when its wording differs from the skill name */
  rising: { skill: L; domainId: string; skillId?: string }[]
  relatedRoleIds: string[]
}
export interface TechSource {
  id: string
  name: L
  domainIds: string[]
  skills: string[]
}
export interface SectorSource {
  id: string
  name: L
  /** ranked development domains (records), strongest first */
  domains: { domainId: string; records: number }[]
}

export interface GraphSources {
  domains: DomainSource[]
  /** default: derived from `domains[].skills` with ids `sr-<domain>-<index>` */
  skills?: SkillSource[]
  roles?: RoleSource[]
  families?: FamilySource[]
  technologies?: TechSource[]
  sectors?: SectorSource[]
}

export interface GraphOptions {
  /** a role links to a domain when its target is at least this level (default 3, «إتقان») */
  roleTargetMin?: number
  /** a sector links to at most this many domains (default 3) */
  sectorTopDomains?: number
  /** role-library family → preferred domain, used to break ties in a role's highest target */
  roleFamilyDomain?: Record<string, string>
}

export const DEFAULT_ROLE_FAMILY_DOMAIN: Record<string, string> = {
  Leadership: 'leadership',
  'Data & AI': 'ai-data',
  Engineering: 'cloud',
  Design: 'service-design',
  Policy: 'policy',
  Delivery: 'agile',
}

export const nodeId = (kind: NodeKind, ref: string): string => `${kind}.${ref}`
export const skillRef = (domainId: string, index: number): string => `sr-${domainId}-${index}`

/** The skill sources implied by the domains (8 × 5 = 40), with the skill-record ids. */
export function skillsFromDomains(domains: DomainSource[]): SkillSource[] {
  return domains.flatMap((d) => d.skills.map((name, skillIndex) => ({ id: skillRef(d.id, skillIndex), domainId: d.id, skillIndex, name })))
}

/** The domain a role leans on most (see the file header for the tie rule). */
export function rolePrimaryDomain(role: RoleSource, domainIds: string[], familyDomain: Record<string, string> = DEFAULT_ROLE_FAMILY_DOMAIN): string {
  let max = -Infinity
  for (const d of domainIds) max = Math.max(max, role.targets[d] ?? 0)
  const ties = domainIds.filter((d) => (role.targets[d] ?? 0) === max)
  const preferred = role.family ? familyDomain[role.family] : undefined
  return preferred && ties.includes(preferred) ? preferred : ties[0] ?? domainIds[0]
}

export function buildSkillsGraph(src: GraphSources, opts: GraphOptions = {}): SkillsGraph {
  const minTarget = opts.roleTargetMin ?? 3
  const topN = opts.sectorTopDomains ?? 3
  const familyDomain = { ...DEFAULT_ROLE_FAMILY_DOMAIN, ...opts.roleFamilyDomain }
  const domainIds = src.domains.map((d) => d.id)
  const known = new Set(domainIds)

  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const byId = new Map<string, GraphNode>()
  const edgeById = new Map<string, GraphEdge>()

  const add = (n: GraphNode) => {
    if (byId.has(n.id)) return
    byId.set(n.id, n)
    nodes.push(n)
  }
  const link = (a: string, b: string, kind: EdgeKind, weight = 1) => {
    if (a === b || !byId.has(a) || !byId.has(b)) return
    const id = `${a}|${b}`
    if (edgeById.has(id) || edgeById.has(`${b}|${a}`)) return
    const e: GraphEdge = { id, source: a, target: b, kind, weight }
    edgeById.set(id, e)
    edges.push(e)
  }

  for (const d of src.domains) add({ id: nodeId('domain', d.id), kind: 'domain', ref: d.id, label: d.name, short: d.shortName, domainId: d.id })

  const skills = src.skills ?? skillsFromDomains(src.domains)
  const skillByName = new Map<string, string>()
  for (const s of skills) {
    if (!known.has(s.domainId)) continue
    const id = nodeId('skill', s.id)
    add({ id, kind: 'skill', ref: s.id, label: s.name, domainId: s.domainId })
    link(id, nodeId('domain', s.domainId), 'domain-skill')
    skillByName.set(normalizeText(s.name.ar), id)
    skillByName.set(normalizeText(s.name.en), id)
  }

  for (const r of src.roles ?? []) {
    const id = nodeId('role', r.id)
    add({ id, kind: 'role', ref: r.id, label: r.name, aliases: r.equivalents, domainId: rolePrimaryDomain(r, domainIds, familyDomain) })
    for (const d of domainIds) {
      const target = r.targets[d] ?? 0
      if (target >= minTarget) link(id, nodeId('domain', d), 'role-domain', target)
    }
  }

  for (const f of src.families ?? []) {
    const id = nodeId('family', f.id)
    const primary = f.rising.find((r) => known.has(r.domainId))?.domainId ?? domainIds[0]
    add({ id, kind: 'family', ref: f.id, label: f.name, domainId: primary })
    for (const r of f.rising) {
      if (known.has(r.domainId)) link(id, nodeId('domain', r.domainId), 'family-domain')
      const explicit = r.skillId && byId.has(nodeId('skill', r.skillId)) ? nodeId('skill', r.skillId) : undefined
      const skill = explicit ?? skillByName.get(normalizeText(r.skill.ar)) ?? skillByName.get(normalizeText(r.skill.en))
      if (skill) link(id, skill, 'family-skill')
    }
    for (const roleId of f.relatedRoleIds) link(id, nodeId('role', roleId), 'family-role')
  }

  for (const t of src.technologies ?? []) {
    const id = nodeId('tech', t.id)
    const skillDomains = t.skills.map((s) => byId.get(nodeId('skill', s))?.domainId).filter((d): d is string => !!d)
    const primary = t.domainIds.find((d) => known.has(d)) ?? skillDomains[0] ?? domainIds[0]
    add({ id, kind: 'tech', ref: t.id, label: t.name, domainId: primary })
    for (const s of t.skills) link(id, nodeId('skill', s), 'tech-skill')
    for (const d of t.domainIds) if (known.has(d)) link(id, nodeId('domain', d), 'tech-domain')
  }

  const sectorList = src.sectors ?? []
  const totals = sectorTotals(sectorList, known)
  for (const s of sectorList) {
    const ranked = s.domains.filter((d) => known.has(d.domainId) && d.records > 0)
    if (ranked.length === 0) continue
    const id = nodeId('sector', s.id)
    const primary = sectorPrimaryDomain(s, totals, known)
    add({ id, kind: 'sector', ref: s.id, label: s.name, domainId: primary })
    for (const d of ranked.slice(0, topN)) link(id, nodeId('domain', d.domainId), 'sector-domain', d.records)
    // the wedge it sits in is always one of its links
    const own = ranked.find((d) => d.domainId === primary)
    if (own) link(id, nodeId('domain', primary), 'sector-domain', own.records)
  }

  const adjacency = new Map<string, Set<string>>()
  const incident = new Map<string, string[]>()
  for (const n of nodes) {
    adjacency.set(n.id, new Set())
    incident.set(n.id, [])
  }
  for (const e of edges) {
    adjacency.get(e.source)!.add(e.target)
    adjacency.get(e.target)!.add(e.source)
    incident.get(e.source)!.push(e.id)
    incident.get(e.target)!.push(e.id)
  }
  return { nodes, edges, byId, edgeById, adjacency, incident, domainIds }
}

/** Records per domain across every sector, and their sum (the base of the location quotient). */
export function sectorTotals(sectors: SectorSource[], known?: ReadonlySet<string>): { byDomain: Map<string, number>; all: number } {
  const byDomain = new Map<string, number>()
  let all = 0
  for (const s of sectors)
    for (const d of s.domains) {
      if (known && !known.has(d.domainId)) continue
      if (!(d.records > 0)) continue
      byDomain.set(d.domainId, (byDomain.get(d.domainId) ?? 0) + d.records)
      all += d.records
    }
  return { byDomain, all }
}

/** Minimum records for a domain to count as a sector's distinctive domain (small counts are noise). */
export const SECTOR_MIN_RECORDS = 5

/** The wedge of a sector: its distinctive domain (see the file header), else its strongest by records. */
export function sectorPrimaryDomain(sector: SectorSource, totals: { byDomain: Map<string, number>; all: number }, known?: ReadonlySet<string>): string {
  const ranked = sector.domains.filter((d) => (!known || known.has(d.domainId)) && d.records > 0)
  if (ranked.length === 0) return sector.domains[0]?.domainId ?? ''
  const own = ranked.reduce((n, d) => n + d.records, 0)
  let best = ranked[0]
  let bestLq = -Infinity
  for (const d of ranked) {
    if (d.records < SECTOR_MIN_RECORDS) continue
    const share = d.records / own
    const base = (totals.byDomain.get(d.domainId) ?? 0) / Math.max(1, totals.all)
    const lq = base > 0 ? share / base : 0
    // strictly greater (with a small tolerance): ties keep the domain with more records
    if (lq > bestLq + 1e-9) {
      bestLq = lq
      best = d
    }
  }
  return best.domainId
}

/** Resolve a `?node=` value: an exact node id, or a bare source id of any kind (domains first). */
export function resolveNodeId(graph: SkillsGraph, value: string | null | undefined): string | null {
  if (!value) return null
  if (graph.byId.has(value)) return value
  for (const kind of NODE_KINDS) {
    const id = nodeId(kind, value)
    if (graph.byId.has(id)) return id
  }
  return null
}

/* ------------------------------------------------------------- focus sets */

export interface Focus {
  nodes: Set<string>
  edges: Set<string>
}

const otherEnd = (e: GraphEdge, id: string) => (e.source === id ? e.target : e.source)

/**
 * What a role reaches on the map (packet P10b): the domains where its target is at least «إتقان»,
 * the skills of those domains, and its technologies — a technology counts when every skill it
 * requires sits in those domains, or when its own domain is one the role leads («ريادة») and at least
 * two of its skills sit in them. Documented, editorial; the panel lists the same sets.
 */
export interface RoleReach {
  domains: string[]
  skills: string[]
  techs: string[]
  edges: string[]
}

export function roleReach(graph: SkillsGraph, roleId: string): RoleReach {
  const reach: RoleReach = { domains: [], skills: [], techs: [], edges: [] }
  if (graph.byId.get(roleId)?.kind !== 'role') return reach
  const strong = new Map<string, number>()
  for (const eid of graph.incident.get(roleId) ?? []) {
    const e = graph.edgeById.get(eid)!
    if (e.kind !== 'role-domain') continue
    const dom = otherEnd(e, roleId)
    strong.set(graph.byId.get(dom)!.domainId, e.weight)
    reach.domains.push(dom)
    reach.edges.push(eid)
  }
  const skillSet = new Set<string>()
  for (const dom of reach.domains)
    for (const eid of graph.incident.get(dom) ?? []) {
      const e = graph.edgeById.get(eid)!
      if (e.kind !== 'domain-skill') continue
      const sk = otherEnd(e, dom)
      skillSet.add(sk)
      reach.skills.push(sk)
      reach.edges.push(eid)
    }
  for (const n of graph.nodes) {
    if (n.kind !== 'tech') continue
    const skillEdges = (graph.incident.get(n.id) ?? []).map((eid) => graph.edgeById.get(eid)!).filter((e) => e.kind === 'tech-skill')
    if (skillEdges.length === 0) continue
    const inside = skillEdges.filter((e) => skillSet.has(otherEnd(e, n.id)))
    const leads = (strong.get(n.domainId) ?? 0) >= 4
    if (inside.length === skillEdges.length || (leads && inside.length >= 2)) {
      reach.techs.push(n.id)
      for (const e of inside) reach.edges.push(e.id)
    }
  }
  return reach
}

/**
 * What lights up when a node is hovered, focused or selected: the node, its direct neighbours and
 * the edges between them. A skill also lights the roles that need it — roles whose target in the
 * skill's domain is at least «إتقان» — through the domain (the path skill → domain → role). A role
 * also lights what it reaches (see `roleReach`): its skills and technologies.
 */
export function focusOf(graph: SkillsGraph, id: string): Focus {
  const node = graph.byId.get(id)
  const focus: Focus = { nodes: new Set(), edges: new Set() }
  if (!node) return focus
  focus.nodes.add(id)
  for (const eid of graph.incident.get(id) ?? []) {
    focus.edges.add(eid)
    focus.nodes.add(otherEnd(graph.edgeById.get(eid)!, id))
  }
  if (node.kind === 'skill') {
    const dom = nodeId('domain', node.domainId)
    for (const eid of graph.incident.get(dom) ?? []) {
      const e = graph.edgeById.get(eid)!
      if (e.kind !== 'role-domain') continue
      focus.edges.add(eid)
      focus.nodes.add(otherEnd(e, dom))
    }
  }
  if (node.kind === 'role') {
    const reach = roleReach(graph, id)
    for (const n of [...reach.skills, ...reach.techs]) focus.nodes.add(n)
    for (const e of reach.edges) focus.edges.add(e)
  }
  return focus
}

/** A set of nodes and every edge whose two ends are both in it (story steps, search results). */
export function focusOfSet(graph: SkillsGraph, ids: Iterable<string>): Focus {
  const nodes = new Set([...ids].filter((id) => graph.byId.has(id)))
  const edges = new Set<string>()
  for (const e of graph.edges) if (nodes.has(e.source) && nodes.has(e.target)) edges.add(e.id)
  return { nodes, edges }
}

/** Related nodes by kind, in graph order (the panel's lists). */
export function relatedByKind(graph: SkillsGraph, id: string): Record<NodeKind, GraphNode[]> {
  const focus = focusOf(graph, id)
  const out: Record<NodeKind, GraphNode[]> = { domain: [], skill: [], family: [], role: [], tech: [], sector: [] }
  for (const n of graph.nodes) if (n.id !== id && focus.nodes.has(n.id)) out[n.kind].push(n)
  return out
}

/** The edge between two nodes, either direction. */
export function edgeBetween(graph: SkillsGraph, a: string, b: string): GraphEdge | undefined {
  return graph.edgeById.get(`${a}|${b}`) ?? graph.edgeById.get(`${b}|${a}`)
}

/* ------------------------------------------------------------------ search */

/**
 * Search-friendly form of Arabic and English text: lower case, no diacritics or tatweel, one alef,
 * yeh for alef maqsura, heh for teh marbuta, punctuation as spaces.
 */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[آأإٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

const AR_LETTER = /[\u0600-\u06FF]/
/** Arabic prefixes (article and attached particles), longest first; only stripped when 3+ letters remain. */
const AR_PREFIXES = ['وبال', 'وال', 'بال', 'كال', 'فال', 'لل', 'ال']
/** Arabic suffixes after normalisation (ة→ه, ى→ي), longest first. */
const AR_SUFFIXES = ['يات', 'يه', 'ات', 'ون', 'ين', 'ه', 'ي']
const STOP_WORDS = new Set(['و', 'في', 'من', 'على', 'الى', 'عن', 'مع', 'او', 'the', 'and', 'of', 'in', 'for', 'to', 'a', 'an', 'or'])
/** A few within-language equivalents the light stemmer cannot see (stems, both directions). */
const SYNONYMS: Record<string, string[]> = {
  امن: ['سيبران'],
  سيبران: ['امن'],
  حوسب: ['سحاب'],
  security: ['cyber'],
  cyber: ['security'],
  computing: ['cloud'],
}

/**
 * Light stem of one normalised word: Arabic loses its article/attached particles and its common
 * endings (سحابة ↔ السحابية ↔ سحابي → سحاب), English loses a plural «s». Never below 3 letters.
 */
export function stemWord(word: string): string {
  let w = word
  if (AR_LETTER.test(w)) {
    for (const p of AR_PREFIXES)
      if (w.startsWith(p) && w.length - p.length >= 3) {
        w = w.slice(p.length)
        break
      }
    for (const x of AR_SUFFIXES)
      if (w.endsWith(x) && w.length - x.length >= 3) {
        w = w.slice(0, -x.length)
        break
      }
    return w
  }
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1)
  return w
}

/** The search terms of a query: normalised, stemmed, stop words dropped. */
export function queryTerms(query: string): string[] {
  return normalizeText(query)
    .split(' ')
    .filter((w) => w && !STOP_WORDS.has(w))
    .map(stemWord)
    .filter((w) => w.length >= 2 || /\d/.test(w))
}

const haystacks = new WeakMap<GraphNode, { text: string; stems: string[] }>()
function haystackOf(n: GraphNode) {
  let h = haystacks.get(n)
  if (!h) {
    const alias = (n.aliases ?? []).flatMap((a) => [a.ar, a.en]).join(' ')
    const text = normalizeText([n.label.ar, n.label.en, n.short?.ar ?? '', n.short?.en ?? '', alias].join(' '))
    h = { text, stems: text.split(' ').map(stemWord) }
    haystacks.set(n, h)
  }
  return h
}

/** Whether a node's label matches one search term (word-prefix on stems, synonyms, or a plain substring). */
function termMatches(n: GraphNode, term: string): boolean {
  const h = haystackOf(n)
  const alts = [term, ...(SYNONYMS[term] ?? [])]
  return alts.some((t) => h.stems.some((s) => s.startsWith(t)) || (t.length >= 4 && h.text.includes(t)))
}

export interface SearchResult {
  nodes: GraphNode[]
  /** 'all': every term matched; 'any': no node matched every term, so nodes matching some terms are shown */
  mode: 'all' | 'any'
}

/**
 * Search the map (packet P10b): Arabic is matched without hamza, alef, teh marbuta or yeh
 * sensitivity and by light stems, English case-insensitively. Nodes matching every term come
 * first; when none does, nodes matching the most terms are returned (mode «any»). Ordered by the
 * number of matched terms, then by kind (domains, skills first), then graph order.
 */
export function searchGraph(nodes: readonly GraphNode[], query: string): SearchResult {
  const terms = queryTerms(query)
  if (terms.length === 0) return { nodes: [], mode: 'all' }
  const scored = nodes
    .map((n, order) => ({ n, order, hits: terms.filter((t) => termMatches(n, t)).length }))
    .filter((x) => x.hits > 0)
  const all = scored.filter((x) => x.hits === terms.length)
  const pool = all.length ? all : scored
  pool.sort((a, b) => b.hits - a.hits || KIND_RANK[a.n.kind] - KIND_RANK[b.n.kind] || a.order - b.order)
  return { nodes: pool.map((x) => x.n), mode: all.length ? 'all' : 'any' }
}

const KIND_RANK: Record<NodeKind, number> = { domain: 0, skill: 1, role: 2, family: 3, tech: 4, sector: 5 }

/** Nodes matching the query (see `searchGraph`). */
export function searchNodes(nodes: readonly GraphNode[], query: string): GraphNode[] {
  return searchGraph(nodes, query).nodes
}

/* ------------------------------------------------------------------ layout */

export interface PositionedNode extends GraphNode {
  ring: number
  /** degrees, −90 = top */
  angle: number
  radius: number
  x: number
  y: number
}

export interface Wedge {
  domainId: string
  index: number
  /** start/end/mid angle in degrees, in drawing order (start < end) */
  start: number
  end: number
  mid: number
}

export interface GraphLayout {
  nodes: PositionedNode[]
  byId: Map<string, PositionedNode>
  wedges: Wedge[]
  /** ring radius per ring index */
  radii: number[]
  /** node ids per ring index, in reading order (wedge by wedge, then along the wedge) */
  rings: string[][]
  /** largest node radius from the centre (stagger included) */
  extent: number
}

export interface LayoutOptions {
  rtl?: boolean
  /** ring radii in world units, centre outwards (domains, skills, families+roles, technologies, sectors) */
  radii?: number[]
}

export const DEFAULT_RADII = [205, 315, 405, 472, 578]
/** extra radius for every other node of a crowded wedge, per ring */
const STAGGER = [0, 0, 24, 30, 26]
/** widest angular step between neighbours in one wedge, per ring (degrees) */
const MAX_STEP = [0, 8.5, 7.2, 5.2, 6.5]
/** share of a wedge the nodes may use (the rest is the gap between wedges) */
const WEDGE_FILL = 0.84
const KIND_ORDER: Record<NodeKind, number> = { domain: 0, skill: 1, family: 2, role: 3, tech: 4, sector: 5 }

export function layoutGraph(graph: SkillsGraph, opts: LayoutOptions = {}): GraphLayout {
  const radii = opts.radii ?? DEFAULT_RADII
  const dir = opts.rtl ? -1 : 1
  const n = Math.max(1, graph.domainIds.length)
  const span = 360 / n
  const centre = (i: number) => -90 + dir * i * span
  const domainIndex = new Map(graph.domainIds.map((d, i) => [d, i]))

  const wedges: Wedge[] = graph.domainIds.map((domainId, i) => {
    const mid = centre(i)
    return { domainId, index: i, start: mid - span / 2, end: mid + span / 2, mid }
  })

  const positioned: PositionedNode[] = []
  const rings: string[][] = radii.map(() => [])
  const place = (node: GraphNode, ring: number, angle: number, radius: number) => {
    const a = (angle * Math.PI) / 180
    const p: PositionedNode = { ...node, ring, angle, radius, x: round(radius * Math.cos(a)), y: round(radius * Math.sin(a)) }
    positioned.push(p)
    rings[ring]?.push(p.id)
  }

  // ring 0: one domain per wedge, at the wedge's centre
  for (const node of graph.nodes) if (node.kind === 'domain') place(node, 0, centre(domainIndex.get(node.domainId) ?? 0), radii[0])
  rings[0].sort((a, b) => (domainIndex.get(a.slice(7)) ?? 0) - (domainIndex.get(b.slice(7)) ?? 0))

  // outer rings: the nodes of each wedge spread symmetrically around the wedge centre
  for (let ring = 1; ring < radii.length; ring++) {
    for (let i = 0; i < n; i++) {
      const members = graph.nodes
        .map((node, order) => ({ node, order }))
        .filter(({ node }) => node.kind !== 'domain' && RING_OF[node.kind] === ring && domainIndex.get(node.domainId) === i)
        .sort((a, b) => KIND_ORDER[a.node.kind] - KIND_ORDER[b.node.kind] || a.order - b.order)
        .map(({ node }) => node)
      const m = members.length
      if (m === 0) continue
      const step = Math.min((span * WEDGE_FILL) / m, MAX_STEP[ring] ?? 6)
      const crowded = m > 1 && (span * WEDGE_FILL) / m < (MAX_STEP[ring] ?? 6) * 0.75
      members.forEach((node, j) => {
        const angle = centre(i) + dir * (j - (m - 1) / 2) * step
        const radius = radii[ring] + (crowded && j % 2 === 1 ? STAGGER[ring] ?? 0 : 0)
        place(node, ring, angle, radius)
      })
    }
  }

  const byId = new Map(positioned.map((p) => [p.id, p]))
  const extent = positioned.reduce((m, p) => Math.max(m, p.radius), 0)
  return { nodes: positioned, byId, wedges, radii, rings, extent }
}

const round = (v: number) => Math.round(v * 100) / 100

/**
 * Quadratic edge path pulled toward the centre (a light bundling effect). World units.
 * With `avoid` > 0 the curve is routed around the centre disc of that radius: when its midpoint
 * would fall inside the disc, the control point moves out along the bisector of the two ends, so
 * links between opposite wedges bow around the centre instead of crossing it (P10b, review P2-2).
 */
export function edgePath(a: { x: number; y: number }, b: { x: number; y: number }, pull = 0.42, avoid = 0): string {
  let cx = ((a.x + b.x) / 2) * (1 - pull)
  let cy = ((a.y + b.y) / 2) * (1 - pull)
  if (avoid > 0) {
    const mx = 0.25 * (a.x + b.x) + 0.5 * cx
    const my = 0.25 * (a.y + b.y) + 0.5 * cy
    if (Math.hypot(mx, my) < avoid) {
      const la = Math.hypot(a.x, a.y) || 1
      const lb = Math.hypot(b.x, b.y) || 1
      let ux = a.x / la + b.x / lb
      let uy = a.y / la + b.y / lb
      if (Math.hypot(ux, uy) < 1e-3) {
        // opposite ends: go round on a fixed side (deterministic)
        ux = -a.y / la
        uy = a.x / la
      }
      const lu = Math.hypot(ux, uy)
      ux /= lu
      uy /= lu
      cx = 2 * (avoid * ux - 0.25 * (a.x + b.x))
      cy = 2 * (avoid * uy - 0.25 * (a.y + b.y))
    }
  }
  return `M${a.x} ${a.y}Q${round(cx)} ${round(cy)} ${b.x} ${b.y}`
}

/**
 * «إضاءة المجال» (P10b wow 3): the chosen domain fills the whole circle. Its node moves to the
 * centre; its skills, the job families and roles linked to it, and the technologies linked to it or
 * to its skills share one ring, grouped by kind in arcs (skills, then families and roles, then
 * technologies, then sectors), with one empty slot between groups — so every member can carry a
 * radial label from the ring out to the rim. The seven other domains collapse to a thin rim
 * (`wedges` holds their rim arcs). Same `GraphLayout` shape as `layoutGraph`, so the canvas draws
 * and animates it the same way; nodes outside the spotlight are absent from the result.
 */
export const SPOTLIGHT_RING = 300
/** labels run from the ring out to this radius; the rim sits just outside it */
export const SPOTLIGHT_EXTENT = 590

export function spotlightMembers(graph: SkillsGraph, domainId: string): Set<string> {
  const dom = nodeId('domain', domainId)
  const members = new Set<string>([dom])
  for (const n of graph.adjacency.get(dom) ?? []) if (graph.byId.get(n)?.kind !== 'domain') members.add(n)
  // technologies that require one of its skills
  for (const n of [...members]) {
    if (graph.byId.get(n)?.kind !== 'skill') continue
    for (const m of graph.adjacency.get(n) ?? []) if (graph.byId.get(m)?.kind === 'tech') members.add(m)
  }
  return members
}

const SPOTLIGHT_GROUPS: NodeKind[][] = [['skill'], ['family', 'role'], ['tech'], ['sector']]

export function layoutSpotlight(graph: SkillsGraph, domainId: string, opts: { rtl?: boolean; order?: (a: GraphNode, b: GraphNode) => number } = {}): GraphLayout {
  const dir = opts.rtl ? -1 : 1
  const members = spotlightMembers(graph, domainId)
  const positioned: PositionedNode[] = []
  const rings: string[][] = [[], [], [], [], []]
  const place = (node: GraphNode, ring: number, angle: number, radius: number) => {
    const a = (angle * Math.PI) / 180
    const p: PositionedNode = { ...node, ring, angle, radius, x: round(radius * Math.cos(a)), y: round(radius * Math.sin(a)) }
    positioned.push(p)
    rings[ring]?.push(p.id)
  }
  const centreNode = graph.byId.get(nodeId('domain', domainId))
  if (centreNode) place(centreNode, 0, -90, 0)

  const groups = SPOTLIGHT_GROUPS.map((kinds) =>
    graph.nodes
      .map((node, order) => ({ node, order }))
      .filter(({ node }) => members.has(node.id) && kinds.includes(node.kind))
      .sort((x, y) => KIND_ORDER[x.node.kind] - KIND_ORDER[y.node.kind] || (opts.order ? opts.order(x.node, y.node) : 0) || x.order - y.order)
      .map(({ node }) => node),
  ).filter((g) => g.length > 0)
  const slots = groups.reduce((n, g) => n + g.length, 0) + groups.length
  const step = 360 / Math.max(1, slots)
  let slot = 0
  for (const g of groups) {
    for (const node of g) {
      place(node, RING_OF[node.kind], -90 + dir * (slot + 0.5) * step, SPOTLIGHT_RING)
      slot++
    }
    slot++ // the gap after each group
  }

  // the other domains: a thin rim, in reading order from the top
  const others = graph.domainIds.filter((d) => d !== domainId)
  const rimSpan = 360 / Math.max(1, others.length)
  const wedges: Wedge[] = others.map((d, i) => {
    const mid = -90 + dir * (i + 0.5) * rimSpan
    return { domainId: d, index: graph.domainIds.indexOf(d), start: mid - rimSpan / 2, end: mid + rimSpan / 2, mid }
  })
  const byId = new Map(positioned.map((p) => [p.id, p]))
  return { nodes: positioned, byId, wedges, radii: [0, SPOTLIGHT_RING, SPOTLIGHT_RING, SPOTLIGHT_RING, SPOTLIGHT_RING], rings, extent: SPOTLIGHT_EXTENT }
}

/** Linear blend of two layouts for the spotlight animation; nodes missing from `to` keep their `from` place. */
export function blendLayouts(from: GraphLayout, to: GraphLayout, t: number): GraphLayout {
  if (t <= 0) return from
  if (t >= 1) return to
  const nodes = from.nodes.map((p) => {
    const q = to.byId.get(p.id)
    if (!q) return p
    return { ...q, x: round(p.x + (q.x - p.x) * t), y: round(p.y + (q.y - p.y) * t), radius: p.radius + (q.radius - p.radius) * t, angle: p.angle + (q.angle - p.angle) * t }
  })
  const byId = new Map(nodes.map((p) => [p.id, p]))
  return { ...to, nodes, byId, extent: from.extent + (to.extent - from.extent) * t }
}

/** An annular sector (wedge band) between two radii and two angles (degrees). */
export function bandPath(r0: number, r1: number, a0: number, a1: number): string {
  const p = (r: number, a: number) => {
    const rad = (a * Math.PI) / 180
    return `${round(r * Math.cos(rad))} ${round(r * Math.sin(rad))}`
  }
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  return `M${p(r0, a0)}L${p(r1, a0)}A${r1} ${r1} 0 ${large} 1 ${p(r1, a1)}L${p(r0, a1)}A${r0} ${r0} 0 ${large} 0 ${p(r0, a0)}Z`
}

/* ------------------------------------------------------------------ camera */

export interface Camera {
  /** zoom factor (1 = fit) */
  k: number
  /** pan in screen pixels */
  tx: number
  ty: number
}

export const MIN_ZOOM = 0.7
export const MAX_ZOOM = 4

export const clampZoom = (k: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, k))

/** Pixels per world unit at zoom 1 so that a disc of radius `extent` fits the box. */
export function fitScale(width: number, height: number, extent: number): number {
  return Math.max(0.05, Math.min(width, height) / (2 * Math.max(1, extent)))
}

export function worldToScreen(p: { x: number; y: number }, cam: Camera, size: { width: number; height: number; scale: number }) {
  return { x: size.width / 2 + cam.tx + p.x * size.scale * cam.k, y: size.height / 2 + cam.ty + p.y * size.scale * cam.k }
}

/** Zoom by `factor` keeping the screen point (px, py) still. */
export function zoomAt(cam: Camera, factor: number, px: number, py: number, size: { width: number; height: number }): Camera {
  const k = clampZoom(cam.k * factor)
  const f = k / cam.k
  const ox = px - size.width / 2
  const oy = py - size.height / 2
  return { k, tx: ox - (ox - cam.tx) * f, ty: oy - (oy - cam.ty) * f }
}

/** The camera that frames the given world points (bounding box + margin), never beyond MAX_ZOOM. */
export function frameCamera(points: { x: number; y: number }[], size: { width: number; height: number; scale: number }, margin = 70): Camera {
  if (points.length === 0) return { k: 1, tx: 0, ty: 0 }
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const p of points) {
    x0 = Math.min(x0, p.x)
    y0 = Math.min(y0, p.y)
    x1 = Math.max(x1, p.x)
    y1 = Math.max(y1, p.y)
  }
  const w = Math.max(1, (x1 - x0) * size.scale)
  const h = Math.max(1, (y1 - y0) * size.scale)
  const k = Math.max(1, Math.min(MAX_ZOOM, 2.2, (size.width - 2 * margin) / w, (size.height - 2 * margin) / h))
  const cx = ((x0 + x1) / 2) * size.scale * k
  const cy = ((y0 + y1) / 2) * size.scale * k
  return { k, tx: -cx, ty: -cy }
}

/* ------------------------------------------------------------------ labels */

export interface LabelBox {
  x: number
  y: number
  w: number
  h: number
}

export interface LabelMetrics {
  fontPx: number
  lineHeight: number
  padX: number
  padY: number
}

export const LABEL_METRICS: LabelMetrics = { fontPx: 12, lineHeight: 15, padX: 5, padY: 2 }

/** Average advance per character as a share of the font size (deliberately generous). */
const CHAR_EM: Record<Lang, number> = { ar: 0.54, en: 0.58 }
const SPACE_EM = 0.3

export function textWidth(text: string, lang: Lang, fontPx: number): number {
  let w = 0
  for (const ch of text) w += ch === ' ' ? SPACE_EM : /[A-Z0-9&]/.test(ch) ? CHAR_EM.en + 0.1 : CHAR_EM[lang]
  return w * fontPx
}

/** Greedy word wrap into at most `maxLines` lines no wider than `maxWidth` (the last line takes the rest). */
export function wrapLabel(text: string, lang: Lang, maxWidth: number, maxLines = 2, m: LabelMetrics = LABEL_METRICS): { lines: string[]; w: number; h: number } {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (line && textWidth(next, lang, m.fontPx) > maxWidth && lines.length < maxLines - 1) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  const w = Math.ceil(Math.max(...lines.map((l) => textWidth(l, lang, m.fontPx)), 0) + 2 * m.padX)
  const h = Math.ceil(lines.length * m.lineHeight + 2 * m.padY)
  return { lines, w, h }
}

/**
 * Shorten a label to fit `maxWidth` on one line: whole words first, then «…». Returns the text
 * unchanged when it fits. The full name stays in the button's accessible name and the hover card.
 */
export function truncateLabel(text: string, lang: Lang, maxWidth: number, fontPx: number, measure: (s: string) => number = (x) => textWidth(x, lang, fontPx)): string {
  if (measure(text) <= maxWidth) return text
  const words = text.split(/\s+/).filter(Boolean)
  let out = ''
  for (const w of words) {
    const next = out ? `${out} ${w}` : w
    if (measure(`${next}…`) > maxWidth) break
    out = next
  }
  if (!out) {
    // a single long word: cut by characters
    const chars = [...text]
    out = ''
    for (const ch of chars) {
      if (measure(`${out}${ch}…`) > maxWidth) break
      out += ch
    }
  }
  return `${out.replace(/[\s،,]+$/, '')}…`
}

export interface LabelRequest {
  id: string
  text: string
  lang: Lang
  /** anchor (node centre) in screen pixels */
  x: number
  y: number
  /** node radius in pixels: the label starts this far from the anchor */
  r: number
  /** lower = placed first */
  priority: number
  /** the anchor's side of the centre decides the preferred side: outward first */
  cx: number
  maxWidth?: number
}

export type LabelSide = 'right' | 'left' | 'top'

export interface PlacedLabel extends LabelBox {
  id: string
  lines: string[]
  side: LabelSide
}

export const overlaps = (a: LabelBox, b: LabelBox, gap = 2) =>
  a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap

/**
 * Collision-free label placement: labels are tried in priority order on the outward side of their
 * node, then above it, then on the inward side; a label that fits nowhere (other labels, obstacles
 * such as the domain pills, the canvas edge) is not drawn. Deterministic for the same input.
 */
export function placeLabels(requests: LabelRequest[], bounds: { width: number; height: number }, obstacles: LabelBox[] = [], m: LabelMetrics = LABEL_METRICS): PlacedLabel[] {
  const placed: PlacedLabel[] = []
  const taken: LabelBox[] = [...obstacles]
  const sorted = [...requests].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
  for (const req of sorted) {
    const { lines, w, h } = wrapLabel(req.text, req.lang, req.maxWidth ?? 150, 2, m)
    const gap = req.r + 3
    const outward: LabelSide = req.x >= req.cx ? 'right' : 'left'
    const inward: LabelSide = outward === 'right' ? 'left' : 'right'
    const box = (side: LabelSide): LabelBox =>
      side === 'right'
        ? { x: req.x + gap, y: req.y - h / 2, w, h }
        : side === 'left'
          ? { x: req.x - gap - w, y: req.y - h / 2, w, h }
          : { x: req.x - w / 2, y: req.y - gap - h, w, h }
    for (const side of [outward, 'top', inward] as LabelSide[]) {
      const b = box(side)
      if (b.x < 2 || b.y < 2 || b.x + b.w > bounds.width - 2 || b.y + b.h > bounds.height - 2) continue
      if (taken.some((t) => overlaps(b, t))) continue
      taken.push(b)
      placed.push({ ...b, id: req.id, lines, side })
      break
    }
  }
  return placed
}

/* ------------------------------------------------------------------- story */

export interface StoryShift {
  id: string
  title: L
  domainId: string
  relatedDomainIds: string[]
}

export interface StoryStep {
  id: string
  /** null for the opening step */
  shift: StoryShift | null
  /** every node lit in this step */
  focus: string[]
  domains: string[]
  /** the skills the shift asks for (editorial mapping from the shift's «ما يتطلبه» line) */
  skills: string[]
  roles: string[]
  families: string[]
  /** the order the highlight builds up in: domains, then skills, then the roles and families */
  phases: string[][]
}

/**
 * The guided tour: one opening step (the eight domains), then one step per shift in government
 * work. A shift lights its domains (primary + related), the skills it asks for (`skillsByShift`,
 * skill-record ids), the roles that carry it — roles at «ريادة» in the primary domain, plus roles at
 * «إتقان» or more there that lead a related domain — and the job families whose rising capabilities
 * sit in the primary domain.
 */
export function buildStory(graph: SkillsGraph, shifts: StoryShift[], skillsByShift: Record<string, string[]> = {}): StoryStep[] {
  const domainNodes = graph.nodes.filter((n) => n.kind === 'domain').map((n) => n.id)
  const steps: StoryStep[] = [{ id: 'intro', shift: null, focus: domainNodes, domains: domainNodes, skills: [], roles: [], families: [], phases: [domainNodes] }]
  const targetOf = (roleId: string, domainId: string) => edgeBetween(graph, roleId, nodeId('domain', domainId))?.weight ?? 0
  for (const shift of shifts) {
    const domains = [shift.domainId, ...shift.relatedDomainIds].map((d) => nodeId('domain', d)).filter((id) => graph.byId.has(id))
    const skills = (skillsByShift[shift.id] ?? []).map((ref) => nodeId('skill', ref)).filter((id) => graph.byId.has(id))
    const roles = graph.nodes
      .filter((n) => n.kind === 'role')
      .filter((r) => {
        const primary = targetOf(r.id, shift.domainId)
        return primary >= 4 || (primary >= 3 && shift.relatedDomainIds.some((d) => targetOf(r.id, d) >= 4))
      })
      .map((r) => r.id)
    const families = graph.nodes
      .filter((n) => n.kind === 'family' && graph.edgeById.has(`${n.id}|${nodeId('domain', shift.domainId)}`))
      .map((f) => f.id)
    steps.push({
      id: shift.id,
      shift,
      focus: [...domains, ...skills, ...roles, ...families],
      domains,
      skills,
      roles,
      families,
      phases: [domains, skills, [...roles, ...families]].filter((p) => p.length > 0),
    })
  }
  return steps
}

/* ------------------------------------------------------- compare, path */

export interface TargetDelta {
  domainId: string
  from: number
  to: number
  delta: number
}

/**
 * «قارن دورين» (P10b wow 2): per domain, the target of role A and of role B and the step between
 * them, in canonical domain order. `rise` lists where B asks for more than A, largest step first.
 */
export function compareTargets(a: Record<string, number>, b: Record<string, number>, domainIds: string[]): { all: TargetDelta[]; rise: TargetDelta[]; fall: TargetDelta[]; same: TargetDelta[] } {
  const all = domainIds.map((d) => ({ domainId: d, from: a[d] ?? 0, to: b[d] ?? 0, delta: (b[d] ?? 0) - (a[d] ?? 0) }))
  const order = (x: TargetDelta, y: TargetDelta) => Math.abs(y.delta) - Math.abs(x.delta) || domainIds.indexOf(x.domainId) - domainIds.indexOf(y.domainId)
  return {
    all,
    rise: all.filter((x) => x.delta > 0).sort(order),
    fall: all.filter((x) => x.delta < 0).sort(order),
    same: all.filter((x) => x.delta === 0),
  }
}

export interface SkillGap {
  /** skill node id */
  id: string
  domainId: string
  self: number
  target: number
  gap: number
}

/**
 * «طريقي إلى هذا الدور» (P10b wow 1): the skills whose self-rating (0–4, from the last saved
 * assessment) sits below the role's target in the skill's domain. `selfOf` returns undefined for a
 * skill without an answer; such skills are skipped. Largest gap first.
 */
export function skillGaps(graph: SkillsGraph, targets: Record<string, number>, selfOf: (skillRef: string) => number | undefined): SkillGap[] {
  const out: SkillGap[] = []
  for (const n of graph.nodes) {
    if (n.kind !== 'skill') continue
    const self = selfOf(n.ref)
    const target = targets[n.domainId] ?? 0
    if (self === undefined || target <= 0) continue
    const gap = Math.round((target - self) * 100) / 100
    if (gap > 0) out.push({ id: n.id, domainId: n.domainId, self, target, gap })
  }
  return out.sort((a, b) => b.gap - a.gap || graph.domainIds.indexOf(a.domainId) - graph.domainIds.indexOf(b.domainId))
}
