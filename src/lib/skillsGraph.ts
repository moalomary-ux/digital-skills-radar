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
 *   sector → the domain with the most consulting records
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
  family?: string
  targets: Record<string, number>
}
export interface FamilySource {
  id: string
  name: L
  rising: { skill: L; domainId: string }[]
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
    add({ id, kind: 'role', ref: r.id, label: r.name, domainId: rolePrimaryDomain(r, domainIds, familyDomain) })
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
      const skill = skillByName.get(normalizeText(r.skill.ar)) ?? skillByName.get(normalizeText(r.skill.en))
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

  for (const s of src.sectors ?? []) {
    const ranked = s.domains.filter((d) => known.has(d.domainId) && d.records > 0)
    if (ranked.length === 0) continue
    const id = nodeId('sector', s.id)
    add({ id, kind: 'sector', ref: s.id, label: s.name, domainId: ranked[0].domainId })
    for (const d of ranked.slice(0, topN)) link(id, nodeId('domain', d.domainId), 'sector-domain', d.records)
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
 * What lights up when a node is hovered, focused or selected: the node, its direct neighbours and
 * the edges between them. A skill also lights the roles that need it — roles whose target in the
 * skill's domain is at least «إتقان» — through the domain (the path skill → domain → role).
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

/** Nodes whose Arabic or English label contains every word of the query (in graph order). */
export function searchNodes(nodes: readonly GraphNode[], query: string): GraphNode[] {
  const q = normalizeText(query)
  if (!q) return []
  const words = q.split(' ')
  return nodes.filter((n) => {
    const hay = normalizeText([n.label.ar, n.label.en, n.short?.ar ?? '', n.short?.en ?? ''].join(' '))
    return words.every((w) => hay.includes(w))
  })
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

/** Quadratic edge path pulled toward the centre (a light bundling effect). World units. */
export function edgePath(a: { x: number; y: number }, b: { x: number; y: number }, pull = 0.42): string {
  const cx = ((a.x + b.x) / 2) * (1 - pull)
  const cy = ((a.y + b.y) / 2) * (1 - pull)
  return `M${a.x} ${a.y}Q${round(cx)} ${round(cy)} ${b.x} ${b.y}`
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
  roles: string[]
  families: string[]
}

/**
 * The guided tour: one opening step (the eight domains), then one step per shift in government
 * work. A shift lights its domains (primary + related), the roles that carry it — roles at «ريادة»
 * in the primary domain, plus roles at «إتقان» or more there that lead a related domain — and the
 * job families whose rising capabilities sit in the primary domain.
 */
export function buildStory(graph: SkillsGraph, shifts: StoryShift[]): StoryStep[] {
  const domainNodes = graph.nodes.filter((n) => n.kind === 'domain').map((n) => n.id)
  const steps: StoryStep[] = [{ id: 'intro', shift: null, focus: domainNodes, domains: domainNodes, roles: [], families: [] }]
  const targetOf = (roleId: string, domainId: string) => edgeBetween(graph, roleId, nodeId('domain', domainId))?.weight ?? 0
  for (const shift of shifts) {
    const domains = [shift.domainId, ...shift.relatedDomainIds].map((d) => nodeId('domain', d)).filter((id) => graph.byId.has(id))
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
    steps.push({ id: shift.id, shift, focus: [...domains, ...roles, ...families], domains, roles, families })
  }
  return steps
}
