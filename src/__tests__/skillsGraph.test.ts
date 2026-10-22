import { describe, expect, it } from 'vitest'
import { domains } from '../data/domains'
import { libraryRoles } from '../data/roleLibrary'
import { workFamilies } from '../data/workShifts'
import { technologies } from '../data/technologies'
import { shifts } from '../data/leaders/shifts'
import { defaultSources, sectorSources } from '../components/map/sources'
import {
  buildSkillsGraph,
  buildStory,
  focusOf,
  layoutGraph,
  nodeId,
  normalizeText,
  overlaps,
  placeLabels,
  relatedByKind,
  resolveNodeId,
  rolePrimaryDomain,
  searchNodes,
  wrapLabel,
  zoomAt,
  frameCamera,
} from '../lib/skillsGraph'
import type { LabelRequest, SectorSource } from '../lib/skillsGraph'
import type { SectorsFile } from '../data/gov/types'

const graph = buildSkillsGraph(defaultSources())
const count = (kind: string) => graph.nodes.filter((n) => n.kind === kind).length

describe('skills graph model', () => {
  it('has every domain, skill, job family, role and technology exactly once', () => {
    expect(count('domain')).toBe(8)
    expect(count('skill')).toBe(40)
    expect(count('family')).toBe(workFamilies.length)
    expect(count('family')).toBe(8)
    expect(count('role')).toBe(libraryRoles.length)
    expect(count('role')).toBe(24)
    expect(count('tech')).toBe(technologies.length)
    expect(count('tech')).toBe(48)
    expect(count('sector')).toBe(0)
    expect(new Set(graph.nodes.map((n) => n.id)).size).toBe(graph.nodes.length)
  })

  it('every edge endpoint exists and no edge is duplicated', () => {
    for (const e of graph.edges) {
      expect(graph.byId.has(e.source), e.id).toBe(true)
      expect(graph.byId.has(e.target), e.id).toBe(true)
      expect(e.source).not.toBe(e.target)
    }
    const pairs = graph.edges.map((e) => [e.source, e.target].sort().join('|'))
    expect(new Set(pairs).size).toBe(pairs.length)
  })

  it('every skill belongs to exactly one domain, its own', () => {
    for (const skill of graph.nodes.filter((n) => n.kind === 'skill')) {
      const domainEdges = graph.edges.filter((e) => e.kind === 'domain-skill' && (e.source === skill.id || e.target === skill.id))
      expect(domainEdges, skill.id).toHaveLength(1)
      expect([domainEdges[0].source, domainEdges[0].target]).toContain(nodeId('domain', skill.domainId))
    }
    for (const d of domains) expect(relatedByKind(graph, nodeId('domain', d.id)).skill.map((s) => s.label.en)).toEqual(d.skills.map((s) => s.en))
  })

  it('every role appears, linked to each domain where its target is at least «إتقان»', () => {
    for (const role of libraryRoles) {
      const id = nodeId('role', role.id)
      expect(graph.byId.has(id), role.id).toBe(true)
      const linked = graph.edges.filter((e) => e.kind === 'role-domain' && e.source === id).map((e) => e.target)
      const expected = domains.filter((d) => role.targets[d.id] >= 3).map((d) => nodeId('domain', d.id))
      expect(linked.sort()).toEqual(expected.sort())
      expect(linked.length).toBeGreaterThan(0)
    }
  })

  it('every node has at least one connection', () => {
    for (const n of graph.nodes) expect(graph.adjacency.get(n.id)!.size, n.id).toBeGreaterThan(0)
  })

  it('links job families to their rising capabilities and related roles', () => {
    const hr = relatedByKind(graph, 'family.hr')
    expect(hr.domain.map((d) => d.ref).sort()).toEqual(['ai-data', 'leadership'])
    expect(hr.skill.map((s) => s.label.en)).toContain('Change management')
    expect(hr.role.map((r) => r.ref)).toEqual(expect.arrayContaining(workFamilies.find((f) => f.id === 'hr')!.relatedRoleIds))
  })

  it('links technologies to their required skills', () => {
    for (const t of technologies) {
      const rel = relatedByKind(graph, nodeId('tech', t.id))
      expect(rel.skill.map((s) => s.ref).sort(), t.id).toEqual([...t.skills].sort())
    }
  })

  it('assigns a role to its strongest domain, breaking ties by its library family', () => {
    const ids = domains.map((d) => d.id)
    expect(rolePrimaryDomain(libraryRoles.find((r) => r.id === 'chief_digital_officer')!, ids)).toBe('leadership')
    expect(rolePrimaryDomain(libraryRoles.find((r) => r.id === 'data_scientist')!, ids)).toBe('ai-data')
    expect(rolePrimaryDomain(libraryRoles.find((r) => r.id === 'service_designer')!, ids)).toBe('service-design')
  })

  it('a skill lights the roles that need it through its domain', () => {
    const focus = focusOf(graph, 'skill.sr-cyber-0')
    expect(focus.nodes.has('domain.cyber')).toBe(true)
    expect(focus.nodes.has('role.cybersecurity_analyst')).toBe(true)
    expect(focus.nodes.has('role.content_designer')).toBe(false)
    for (const e of focus.edges) {
      const edge = graph.edgeById.get(e)!
      expect(focus.nodes.has(edge.source) && focus.nodes.has(edge.target)).toBe(true)
    }
  })

  it('resolves deep-link values with or without the kind prefix', () => {
    expect(resolveNodeId(graph, 'domain.cyber')).toBe('domain.cyber')
    expect(resolveNodeId(graph, 'cyber')).toBe('domain.cyber')
    expect(resolveNodeId(graph, 'sr-ai-data-3')).toBe('skill.sr-ai-data-3')
    expect(resolveNodeId(graph, 'C1-T01')).toBe('tech.C1-T01')
    expect(resolveNodeId(graph, 'nope')).toBeNull()
    expect(resolveNodeId(graph, null)).toBeNull()
  })

  it('adds sectors from the aggregates file, linked to their strongest domains only', () => {
    const file = {
      sectors: [
        { id: 'health', nameAr: 'الصحة', nameEn: 'Health', showAggregates: true, domains: [{ domainId: 'ai-data', records: 9, raw: 9 }, { domainId: 'cloud', records: 4, raw: 4 }, { domainId: 'cyber', records: 2, raw: 2 }, { domainId: 'agile', records: 1, raw: 1 }] },
        { id: 'media', nameAr: 'الإعلام', nameEn: 'Media', showAggregates: false, domains: null },
        { id: 'other-pooled', nameAr: 'x', nameEn: 'x', showAggregates: true, pooled: true, domains: [{ domainId: 'cyber', records: 3, raw: 3 }] },
      ],
    } as unknown as SectorsFile
    const sectors: SectorSource[] = sectorSources(file)
    expect(sectors.map((s) => s.id)).toEqual(['health'])
    const g = buildSkillsGraph({ ...defaultSources(), sectors })
    const rel = relatedByKind(g, 'sector.health')
    expect(rel.domain.map((d) => d.ref)).toEqual(['ai-data', 'cyber', 'cloud'])
    expect(g.byId.get('sector.health')!.domainId).toBe('ai-data')
  })
})

describe('skills graph layout', () => {
  const ltr = layoutGraph(graph, { rtl: false })
  const rtl = layoutGraph(graph, { rtl: true })

  it('positions every node, with no two nodes at the same point', () => {
    expect(ltr.nodes).toHaveLength(graph.nodes.length)
    const keys = ltr.nodes.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    expect(new Set(keys).size).toBe(keys.length)
    let minGap = Infinity
    for (let i = 0; i < ltr.nodes.length; i++)
      for (let j = i + 1; j < ltr.nodes.length; j++) minGap = Math.min(minGap, Math.hypot(ltr.nodes[i].x - ltr.nodes[j].x, ltr.nodes[i].y - ltr.nodes[j].y))
    expect(minGap).toBeGreaterThan(12)
  })

  it('keeps every node inside the wedge of its primary domain', () => {
    for (const p of ltr.nodes) {
      const w = ltr.wedges.find((x) => x.domainId === p.domainId)!
      expect(p.angle, p.id).toBeGreaterThanOrEqual(w.start)
      expect(p.angle, p.id).toBeLessThanOrEqual(w.end)
    }
  })

  it('puts the rings in order from the centre and starts the first domain at the top', () => {
    const r = (kind: string) => ltr.nodes.filter((p) => p.kind === kind).map((p) => p.radius)
    expect(Math.max(...r('domain'))).toBeLessThan(Math.min(...r('skill')))
    expect(Math.max(...r('skill'))).toBeLessThan(Math.min(...r('role'), ...r('family')))
    expect(Math.max(...r('role'), ...r('family'))).toBeLessThan(Math.min(...r('tech')))
    const first = ltr.byId.get(nodeId('domain', domains[0].id))!
    expect(first.x).toBeCloseTo(0)
    expect(first.y).toBeLessThan(0)
  })

  it('mirrors in Arabic: the second domain sits on the left', () => {
    const second = nodeId('domain', domains[1].id)
    expect(ltr.byId.get(second)!.x).toBeGreaterThan(0)
    expect(rtl.byId.get(second)!.x).toBeCloseTo(-ltr.byId.get(second)!.x)
    expect(rtl.byId.get(second)!.y).toBeCloseTo(ltr.byId.get(second)!.y)
  })

  it('lists each ring in reading order, every node once', () => {
    expect(ltr.rings.flat().sort()).toEqual(graph.nodes.map((n) => n.id).sort())
    expect(ltr.rings[0]).toEqual(domains.map((d) => nodeId('domain', d.id)))
    expect(ltr.rings[1].slice(0, 5)).toEqual(domains[0].skills.map((_, i) => `skill.sr-${domains[0].id}-${i}`))
  })
})

describe('labels, camera, search and story', () => {
  it('places labels without overlaps and inside the canvas', () => {
    const layout = layoutGraph(graph, { rtl: true })
    const scale = 0.66
    const reqs: LabelRequest[] = layout.nodes
      .filter((p) => p.kind !== 'domain')
      .map((p, i) => ({ id: p.id, text: p.label.ar, lang: 'ar', x: 500 + p.x * scale * 1.6, y: 360 + p.y * scale * 1.6, r: 5, priority: i, cx: 500 }))
    const obstacles = [{ x: 450, y: 340, w: 100, h: 40 }]
    const placed = placeLabels(reqs, { width: 1000, height: 720 }, obstacles)
    expect(placed.length).toBeGreaterThan(10)
    for (let i = 0; i < placed.length; i++) {
      expect(overlaps(placed[i], obstacles[0], 0)).toBe(false)
      expect(placed[i].x).toBeGreaterThanOrEqual(0)
      expect(placed[i].x + placed[i].w).toBeLessThanOrEqual(1000)
      for (let j = i + 1; j < placed.length; j++) expect(overlaps(placed[i], placed[j], 0), `${placed[i].id} × ${placed[j].id}`).toBe(false)
    }
  })

  it('wraps long labels onto two lines at most', () => {
    const long = wrapLabel('الذكاء الاصطناعي التوليدي في الخدمات الحكومية', 'ar', 150)
    expect(long.lines.length).toBe(2)
    expect(wrapLabel('Cloud', 'en', 150).lines).toEqual(['Cloud'])
  })

  it('zooms around the pointer and frames a set of points', () => {
    const size = { width: 1000, height: 700 }
    const cam = zoomAt({ k: 1, tx: 0, ty: 0 }, 2, 700, 350, size)
    expect(cam.k).toBe(2)
    // the world point under the pointer stays under it
    expect(500 + cam.tx + 200 * 2).toBeCloseTo(700)
    const framed = frameCamera([{ x: 100, y: 0 }, { x: 200, y: 100 }], { ...size, scale: 1 })
    expect(framed.k).toBeGreaterThanOrEqual(1)
    expect(framed.tx).toBeCloseTo(-150 * framed.k)
  })

  it('searches Arabic without hamza or diacritic sensitivity, and English case-insensitively', () => {
    expect(normalizeText('الأمنُ السيبرانيّ')).toBe('الامن السيبراني')
    expect(searchNodes(graph.nodes, 'الامن').map((n) => n.id)).toContain('domain.cyber')
    expect(searchNodes(graph.nodes, 'SECURITY AWARENESS').map((n) => n.id)).toEqual(['skill.sr-cyber-0'])
    expect(searchNodes(graph.nodes, '  ')).toEqual([])
  })

  it('tells the story in one opening step plus one step per shift', () => {
    const story = buildStory(graph, shifts)
    expect(story).toHaveLength(shifts.length + 1)
    expect(story).toHaveLength(6)
    expect(story[0].focus).toHaveLength(8)
    for (const step of story.slice(1)) {
      expect(step.domains[0]).toBe(nodeId('domain', step.shift!.domainId))
      expect(step.roles.length).toBeGreaterThan(0)
      for (const id of step.focus) expect(graph.byId.has(id), id).toBe(true)
    }
  })
})
