import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../../store'
import type { L } from '../../data/types'
import { shifts } from '../../data/leaders/shifts'
import { libraryRoleById } from '../../data/roleLibrary'
import { horizonMeta, techById } from '../../data/technologies'
import type { Horizon } from '../../data/technologies'
import { laneMeta, workFamilyById } from '../../data/workShifts'
import type { Lane } from '../../data/workShifts'
import { skillRecordById } from '../../data/skillRecords'
import { loadSectors } from '../../data/gov/loaders'
import type { SectorsFile } from '../../data/gov/types'
import { countPhrase, formatNumber } from '../../lib/format'
import {
  blendLayouts,
  buildSkillsGraph,
  buildStory,
  edgeBetween,
  focusOf,
  focusOfSet,
  layoutGraph,
  layoutSpotlight,
  nodeId,
  resolveNodeId,
  searchGraph,
  skillGaps,
  spotlightMembers,
} from '../../lib/skillsGraph'
import type { Focus, GraphNode, GraphSources, NodeKind, SkillsGraph } from '../../lib/skillsGraph'
import VisuallyHiddenTable from '../charts/VisuallyHiddenTable'
import { useMediaQuery, usePrefersReducedMotion } from '../charts/media'
import { defaultSources, sectorSources, STORY_SKILLS } from './sources'
import { domainColour } from './palette'
import { KindSwatch } from './marks'
import MapCanvas from './MapCanvas'
import type { CameraCommand, NodeState } from './MapCanvas'
import MapList from './MapList'
import MapPanel, { announce } from './MapPanel'
import { KIND_NAME, MAP_COPY, countOf, sep } from './copy'

type FilterKind = Exclude<NodeKind, 'domain'>
const FILTERS: FilterKind[] = ['skill', 'family', 'role', 'tech', 'sector']
const RESULT_FORMS = { one: 'نتيجة واحدة', two: 'نتيجتان', few: 'نتائج', many: 'نتيجة' }
const MAX_RESULTS = 8
/** Search results are framed by the camera when there are at most this many. */
const FRAME_RESULTS = 14
const HORIZONS: Horizon[] = ['now', 'near', 'far']
/** Calendar span of each adoption horizon, counted from 2026 (horizonMeta gives years from now). */
const HORIZON_SPAN: Record<Horizon, L> = {
  now: { ar: '2026–2028', en: '2026–2028' },
  near: { ar: '2028–2031', en: '2028–2031' },
  far: { ar: 'بعد 2031', en: 'after 2031' },
}
/** The task-shift lane shown with each horizon in the spotlight (editorial pairing, labelled). */
const HORIZON_LANE: Record<Horizon, Lane> = { now: 'augmented', near: 'automated', far: 'emerging' }
const SPOT_MS = 650
const PHASE_MS = 380

let baseSources: GraphSources | null = null
const sourcesOnce = () => (baseSources ??= defaultSources())

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)

const ui = {
  storyOn: { ar: 'القصة تعمل: استخدم «التالي» و«السابق» في اللوحة.', en: 'The story is on: use «Next» and «Back» in the panel.' },
  moreLit: { ar: 'والبقية مضاءة على الخريطة.', en: 'The rest are lit on the map.' },
  techsShown: { ar: 'التقنيات الظاهرة', en: 'Technologies shown' },
  familiesTasks: { ar: 'كيف تتغير المهام في الأسر الصاعدة فيه', en: 'How the tasks change in the families rising in it' },
  spotRegion: { ar: 'إضاءة المجال وشريط الزمن', en: 'Domain spotlight and timeline' },
} satisfies Record<string, L>

/** Lazily loads the sector aggregates the first time the sectors ring is switched on. */
function useSectorsFile(enabled: boolean) {
  const [state, setState] = useState<{ file: SectorsFile | null; loading: boolean; error: boolean }>({ file: null, loading: false, error: false })
  useEffect(() => {
    if (!enabled || state.file) return
    let alive = true
    setState((s) => ({ ...s, loading: true, error: false }))
    loadSectors().then(
      (file) => alive && setState({ file, loading: false, error: false }),
      () => alive && setState({ file: null, loading: false, error: true }),
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
  return state
}

/** Ordering inside the spotlight: roles by their target in the domain, technologies by horizon. */
function spotOrder(graph: SkillsGraph, domainId: string) {
  const dom = nodeId('domain', domainId)
  const h = (n: GraphNode) => HORIZONS.indexOf(techById(n.ref)?.horizon ?? 'far')
  return (a: GraphNode, b: GraphNode) => {
    if (a.kind === 'role' && b.kind === 'role') return (edgeBetween(graph, b.id, dom)?.weight ?? 0) - (edgeBetween(graph, a.id, dom)?.weight ?? 0)
    if (a.kind === 'tech' && b.kind === 'tech') return h(a) - h(b)
    return 0
  }
}

/**
 * The interactive skills map: toolbar (search, ring filters, story, text table), the canvas with
 * the side panel (two columns from 1024 px), or on narrow screens the touch wheel, the stacked
 * rings and the panel as a bottom sheet; the text equivalent stays available to assistive
 * technology without taking room. With `syncUrl`, `?node=` preselects a node, `?story=1` opens the
 * guided tour, `?spot=<domain>` opens the domain spotlight and `?compare=<role>` compares the
 * selected role with another. URL updates never move the page (review P0-1).
 */
export default function MapExplorer({ syncUrl = false, headingLevel = 2 }: { syncUrl?: boolean; headingLevel?: 2 | 3 }) {
  const { t, lang, history } = useApp()
  const rtl = lang === 'ar'
  const uid = useId().replace(/:/g, '')
  const [params, setParams] = useSearchParams()
  const initial = useRef(syncUrl ? new URLSearchParams(params) : new URLSearchParams()).current
  const initialNode = initial.get('node')
  const compact = useMediaQuery('(max-width: 767px)')
  const coarse = useMediaQuery('(pointer: coarse)')
  const reduced = usePrefersReducedMotion()
  const touch = compact || coarse

  /* ------------------------------------------------ rings and data */
  const [kinds, setKinds] = useState<Record<FilterKind, boolean>>(() => ({
    skill: true,
    family: true,
    role: true,
    tech: true,
    sector: !!initialNode && initialNode.startsWith('sector.'),
  }))
  const sectors = useSectorsFile(kinds.sector)
  const graph = useMemo(() => buildSkillsGraph({ ...sourcesOnce(), sectors: sectorSources(sectors.file) }), [sectors.file])
  const baseLayout = useMemo(() => layoutGraph(graph, { rtl }), [graph, rtl])
  const steps = useMemo(() => buildStory(graph, shifts, STORY_SKILLS), [graph])
  const visibleKinds = useMemo(() => new Set<NodeKind>(['domain', ...FILTERS.filter((k) => kinds[k])]), [kinds])
  const emptyRings = FILTERS.every((k) => !kinds[k])

  /* ------------------------------------------------------ selection */
  const [selected, setSelected] = useState<string | null>(() => {
    const spotParam = initial.get('spot')
    return resolveNodeId(graph, initialNode) ?? (spotParam && graph.domainIds.includes(spotParam) ? nodeId('domain', spotParam) : null)
  })
  const pending = useRef(initialNode && !resolveNodeId(graph, initialNode) ? initialNode : null)
  useEffect(() => {
    if (!pending.current) return
    const id = resolveNodeId(graph, pending.current)
    if (id) {
      pending.current = null
      setSelected(id)
    }
  }, [graph])
  const [hovered, setHovered] = useState<string | null>(null)
  const [story, setStory] = useState<number | null>(() => (initial.get('story') === '1' ? 0 : null))
  const [storyPhase, setStoryPhase] = useState(99)
  const [query, setQuery] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [command, setCommand] = useState<CameraCommand>({ key: 0, ids: null })
  const [spot, setSpot] = useState<string | null>(() => {
    const v = initial.get('spot')
    return v && graph.domainIds.includes(v) ? v : null
  })
  const [horizon, setHorizon] = useState(HORIZONS.length - 1)
  const [compareWith, setCompareWith] = useState<string | null>(() => {
    const id = resolveNodeId(graph, initial.get('compare'))
    return id && graph.byId.get(id)?.kind === 'role' ? id : null
  })
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(undefined)
  const searchRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLUListElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const focusPanelNext = useRef(false)

  type UrlPatch = { node?: string | null; story?: boolean; spot?: string | null; compare?: string | null }
  const writeUrl = (patch: UrlPatch) => {
    if (!syncUrl) return
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        const put = (k: string, v: string | null | undefined) => (v ? next.set(k, v) : next.delete(k))
        if ('node' in patch) put('node', patch.node)
        if ('story' in patch) put('story', patch.story ? '1' : null)
        if ('spot' in patch) put('spot', patch.spot)
        if ('compare' in patch) put('compare', patch.compare)
        return next
      },
      // a query change is not a navigation: the page stays where it is (review P0-1)
      { replace: true, preventScrollReset: true },
    )
  }

  /* ------------------------------------------------- the spotlight */
  const [spotDomain, setSpotDomain] = useState<string | null>(spot)
  useEffect(() => {
    if (spot) setSpotDomain(spot)
  }, [spot])
  const [spotT, setSpotT] = useState(spot ? 1 : 0)
  const spotTRef = useRef(spotT)
  spotTRef.current = spotT
  useEffect(() => {
    const target = spot ? 1 : 0
    const from = spotTRef.current
    if (from === target) return
    if (reduced || typeof requestAnimationFrame !== 'function') {
      setSpotT(target)
      return
    }
    let raf = 0
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / SPOT_MS)
      setSpotT(from + (target - from) * ease(p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [spot, reduced])
  const spotLayout = useMemo(() => (spotDomain ? layoutSpotlight(graph, spotDomain, { rtl, order: spotOrder(graph, spotDomain) }) : null), [graph, spotDomain, rtl])
  const layout = useMemo(() => (spotLayout && spotT > 0 ? blendLayouts(baseLayout, spotLayout, spotT) : baseLayout), [baseLayout, spotLayout, spotT])
  const members = useMemo(() => (spotDomain ? spotlightMembers(graph, spotDomain) : null), [graph, spotDomain])
  const ghosts = useMemo(() => {
    const out = new Set<string>()
    if (!spot || !members) return out
    const allowed = HORIZONS.slice(0, horizon + 1)
    for (const id of members) {
      const n = graph.byId.get(id)
      if (n?.kind !== 'tech') continue
      const tech = techById(n.ref)
      if (tech && !allowed.includes(tech.horizon)) out.add(id)
    }
    return out
  }, [spot, members, horizon, graph])
  const inSpot = (id: string) => !spot || !members || members.has(id)

  /* ---------------------------------------------- highlight model */
  const visibleNodes = useMemo(() => graph.nodes.filter((n) => visibleKinds.has(n.kind) && (!spot || !members || members.has(n.id)) && !ghosts.has(n.id)), [graph, visibleKinds, spot, members, ghosts])
  const search = useMemo(() => searchGraph(visibleNodes, query), [visibleNodes, query])
  const results = search.nodes
  const matches = useMemo(() => (query.trim() ? new Set(results.map((n) => n.id)) : null), [results, query])

  const selectedNode = selected ? graph.byId.get(selected) : undefined
  const compareActive = !!(compareWith && selectedNode?.kind === 'role' && compareWith !== selected && graph.byId.has(compareWith))
  const latest = history.length ? history[history.length - 1] : null
  const pathRole = selectedNode?.kind === 'role' && !compareActive && latest && story === null ? selectedNode : null
  const gapList = useMemo(() => {
    if (!pathRole || !latest) return []
    const targets = libraryRoleById(pathRole.ref)?.targets ?? {}
    return skillGaps(graph, targets, (ref) => {
      const rec = skillRecordById(ref)
      const v = rec ? latest.answers[rec.assessmentRef] : undefined
      return typeof v === 'number' ? v : undefined
    })
  }, [graph, pathRole, latest])
  const gaps = useMemo(() => (gapList.length ? new Map(gapList.map((g) => [g.id, g.gap])) : null), [gapList])

  // the story builds up: domains, then skills, then the roles that carry them
  useEffect(() => {
    if (story === null) return
    const n = steps[story]?.phases.length ?? 1
    if (reduced || typeof setInterval !== 'function') {
      setStoryPhase(n - 1)
      return
    }
    setStoryPhase(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setStoryPhase(i)
      if (i >= n - 1) clearInterval(timer)
    }, PHASE_MS)
    return () => clearInterval(timer)
  }, [story, steps, reduced])

  const hoverOk = hovered && graph.byId.has(hovered) && inSpot(hovered) ? hovered : null
  const focus: Focus | null = useMemo(() => {
    if (hoverOk) return focusOf(graph, hoverOk)
    if (story !== null && steps[story]) return focusOfSet(graph, steps[story].phases.slice(0, storyPhase + 1).flat())
    if (compareActive && selected && compareWith) {
      const a = libraryRoleById(graph.byId.get(selected)!.ref)?.targets ?? {}
      const b = libraryRoleById(graph.byId.get(compareWith)!.ref)?.targets ?? {}
      const doms = graph.domainIds.filter((d) => Math.max(a[d] ?? 0, b[d] ?? 0) >= 3).map((d) => nodeId('domain', d))
      return focusOfSet(graph, [selected, compareWith, ...doms])
    }
    if (pathRole && gapList.length) {
      const doms = new Set<string>()
      for (const n of graph.adjacency.get(pathRole.id) ?? []) if (graph.byId.get(n)?.kind === 'domain') doms.add(n)
      for (const g of gapList) doms.add(nodeId('domain', g.domainId))
      return focusOfSet(graph, [pathRole.id, ...doms, ...gapList.map((g) => g.id)])
    }
    if (selected && graph.byId.has(selected)) return focusOf(graph, selected)
    if (matches && matches.size) {
      const doms = new Set([...matches].map((id) => nodeId('domain', graph.byId.get(id)!.domainId)))
      return focusOfSet(graph, [...matches, ...doms])
    }
    return null
  }, [graph, hoverOk, story, steps, storyPhase, compareActive, selected, compareWith, pathRole, gapList, matches])
  const searchFocus = !!focus && !hoverOk && story === null && !selected && !!matches
  const activeId = hoverOk ?? (story !== null ? null : selected)

  const states = useMemo(() => {
    const m = new Map<string, NodeState>()
    for (const n of graph.nodes) {
      let st: NodeState = 'idle'
      if (focus) {
        if (n.id === activeId || (compareActive && n.id === compareWith && !hoverOk)) st = 'active'
        else if (focus.nodes.has(n.id)) st = searchFocus && matches?.has(n.id) ? 'match' : 'near'
        else st = 'dim'
      } else if (matches) st = matches.has(n.id) ? 'match' : 'dim'
      m.set(n.id, st)
    }
    return m
  }, [graph, focus, activeId, matches, compareActive, compareWith, hoverOk, searchFocus])

  const litDomains = useMemo(() => {
    const s = new Set<string>()
    if (!focus) return s
    for (const id of focus.nodes) {
      const n = graph.byId.get(id)
      if (n?.kind === 'domain') s.add(n.domainId)
    }
    const active = activeId ? graph.byId.get(activeId) : undefined
    if (active) s.add(active.domainId)
    return s
  }, [focus, activeId, graph])

  const ringLayout = spot && spotLayout && spotT >= 0.5 ? spotLayout : baseLayout
  const rings = useMemo(
    () =>
      ringLayout.rings.map((ids, ring) =>
        ids.filter((id) => {
          const n = graph.byId.get(id)
          if (!n || !visibleKinds.has(n.kind) || ghosts.has(id)) return false
          return ring === 0 || !matches || matches.has(id)
        }),
      ),
    [ringLayout, graph, visibleKinds, matches, ghosts],
  )
  // the stacked lists of narrow screens follow the whole-map rings, narrowed by search and spotlight
  const listRings = useMemo(
    () =>
      baseLayout.rings.map((ids, ring) =>
        ids.filter((id) => {
          const n = graph.byId.get(id)
          if (!n || !visibleKinds.has(n.kind) || ghosts.has(id)) return false
          if (ring > 0 && spot && members && !members.has(id)) return false
          return ring === 0 || !matches || matches.has(id)
        }),
      ),
    [baseLayout, graph, visibleKinds, ghosts, spot, members, matches],
  )
  const baseExtent = useMemo(() => baseLayout.nodes.filter((p) => visibleKinds.has(p.kind)).reduce((m, p) => Math.max(m, p.radius), baseLayout.radii[0]) + 34, [baseLayout, visibleKinds])

  /* --------------------------------------------------- transitions */
  const say = (text: string) => setAnnouncement(text)
  const select = (id: string | null, opts: { reveal?: boolean; from?: 'map' | 'panel' | 'search' | 'list' } = {}) => {
    setSelected(id)
    setCompareWith(null)
    if (id) {
      setStory(null)
      say(announce(graph, id, lang))
      if (opts.reveal) setCommand((c) => ({ key: c.key + 1, ids: [id], reveal: true }))
      if (opts.from === 'panel' || opts.from === 'search' || ((opts.from === 'map' || opts.from === 'list') && compact)) focusPanelNext.current = true
      // a node outside the spotlight ends it
      if (spot && !inSpot(id)) {
        setSpot(null)
        setCommand((c) => ({ key: c.key + 1, ids: null }))
        writeUrl({ node: id, story: false, compare: null, spot: null })
        return
      }
    }
    writeUrl({ node: id, story: false, compare: null })
  }
  const startCompare = (roleId: string) => {
    if (!selected || graph.byId.get(selected)?.kind !== 'role' || roleId === selected) return
    setCompareWith(roleId)
    setStory(null)
    focusPanelNext.current = true
    const a = graph.byId.get(selected)!
    const b = graph.byId.get(roleId)!
    say(`${t(MAP_COPY.compareTitle)}: ${t(a.label)}${sep(lang)}${t(b.label)}`)
    writeUrl({ compare: roleId })
  }
  const endCompare = () => {
    setCompareWith(null)
    writeUrl({ compare: null })
  }
  const swapCompare = () => {
    if (!selected || !compareWith) return
    const a = selected
    setSelected(compareWith)
    setCompareWith(a)
    writeUrl({ node: compareWith, compare: a })
  }
  const enterSpotlight = (domainId: string) => {
    if (!graph.domainIds.includes(domainId)) return
    const dom = nodeId('domain', domainId)
    setSpot(domainId)
    setSelected(dom)
    setStory(null)
    setCompareWith(null)
    setHovered(null)
    setHorizon(HORIZONS.length - 1)
    setCommand((c) => ({ key: c.key + 1, ids: null }))
    say(`${t(MAP_COPY.spotlight)}: ${t(graph.byId.get(dom)!.label)}`)
    writeUrl({ spot: domainId, node: dom, story: false, compare: null })
  }
  const exitSpotlight = () => {
    setSpot(null)
    setCommand((c) => ({ key: c.key + 1, ids: null }))
    say(t(MAP_COPY.spotlightExit))
    writeUrl({ spot: null })
  }
  const goStory = (index: number | null) => {
    setStory(index)
    setHovered(null)
    if (index === null) {
      writeUrl({ node: selected, story: false })
      setCommand((c) => ({ key: c.key + 1, ids: null }))
      return
    }
    setSelected(null)
    setCompareWith(null)
    if (spot) setSpot(null)
    writeUrl({ node: null, story: true, compare: null, spot: null })
    const step = steps[index]
    say(`${t(MAP_COPY.step)} ${formatNumber(index + 1, lang)} ${t(MAP_COPY.of)} ${formatNumber(steps.length, lang)}: ${step.shift ? t(step.shift.title) : t(MAP_COPY.title)}`)
    setCommand((c) => ({ key: c.key + 1, ids: index === 0 ? null : step.focus }))
  }

  // canvas: a click toggles; Shift-click on a role compares; a domain inside the spotlight switches it
  const onCanvasSelect = (id: string, opts?: { shift?: boolean }) => {
    const n = graph.byId.get(id)
    if (opts?.shift && n?.kind === 'role' && selectedNode?.kind === 'role' && id !== selected) return startCompare(id)
    select(selected === id && !compareActive ? null : id, { from: 'map' })
  }

  // move focus into the panel after a selection from the panel, the search or a tap (never scrolls)
  useEffect(() => {
    if (!focusPanelNext.current) return
    focusPanelNext.current = false
    const h = panelRef.current?.querySelector<HTMLElement>('[data-panel-heading]') ?? document.querySelector<HTMLElement>('[data-map-sheet] [data-panel-heading]')
    h?.focus({ preventScroll: true })
  }, [selected, compareWith, story])

  // search results: frame them on the map once typing settles (review P1-4)
  const resultsKey = results.map((n) => n.id).join('|')
  const framed = useRef(false)
  useEffect(() => {
    if (!query.trim()) {
      if (framed.current) {
        framed.current = false
        setCommand((c) => ({ key: c.key + 1, ids: null }))
      }
      return
    }
    if (results.length === 0 || results.length > FRAME_RESULTS || selected) return
    const timer = setTimeout(() => {
      framed.current = true
      setCommand((c) => ({ key: c.key + 1, ids: results.map((n) => n.id), maxK: 1.6 }))
    }, 450)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsKey, query])

  /* ------------------------------------------------------ keyboard */
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      e.preventDefault()
      searchRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape') return
    if (query && e.target === searchRef.current) {
      setQuery('')
      return
    }
    if (compareActive) {
      e.preventDefault()
      return endCompare()
    }
    if (spot) {
      e.preventDefault()
      return exitSpotlight()
    }
    if (selected) {
      e.preventDefault()
      select(null)
      setHovered(null)
      return
    }
    if (story !== null) return goStory(null)
    if (query) setQuery('')
  }
  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results[0]) {
      e.preventDefault()
      select(results[0].id, { reveal: true, from: 'search' })
    } else if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault()
      resultsRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }
  }

  /* ----------------------------------------------------- rendering */
  const counts = (k: NodeKind) => graph.nodes.filter((n) => n.kind === k).length
  const sheetOpen = compact && (!!selected || story !== null)
  const closeSheet = () => {
    if (story !== null) return goStory(null)
    if (compareActive) endCompare()
    select(null)
  }
  const panel = (
    <MapPanel
      graph={graph}
      selected={selected}
      story={story !== null ? { steps, index: story, phase: storyPhase } : null}
      onSelect={(id) => select(id, { reveal: true, from: 'panel' })}
      onStory={goStory}
      onClear={() => select(null)}
      headingLevel={headingLevel}
      sectorPeriod={sectors.file?.periods.consulting ?? null}
      touch={touch}
      spotlight={spot}
      onSpotlight={enterSpotlight}
      compareWith={compareActive ? compareWith : null}
      onCompare={startCompare}
      onEndCompare={endCompare}
      onSwap={swapCompare}
      path={pathRole && latest ? { gaps: gapList, record: latest } : null}
      className={compact ? 'border-0 shadow-none' : 'overflow-y-auto'}
      maxHeight={compact ? undefined : canvasHeight}
    />
  )

  const canvas = (
    <MapCanvas
      graph={graph}
      layout={layout}
      lang={lang}
      t={t}
      visibleKinds={visibleKinds}
      rings={rings}
      states={states}
      focus={focus}
      activeId={activeId}
      selected={selected}
      hovered={hoverOk}
      litDomains={litDomains}
      onSelect={onCanvasSelect}
      onHover={setHovered}
      command={command}
      baseWedges={baseLayout.wedges}
      baseExtent={baseExtent}
      spotlight={spotDomain && spotLayout && (spot || spotT > 0) && members ? { domainId: spotDomain, t: spotT, members, ghosts, rim: spotLayout.wedges } : null}
      compare={
        compareActive && selected && compareWith
          ? { a: libraryRoleById(graph.byId.get(selected)!.ref)?.targets ?? {}, b: libraryRoleById(graph.byId.get(compareWith)!.ref)?.targets ?? {} }
          : null
      }
      gaps={gaps}
      hlTone={pathRole && gaps && !hoverOk ? 'amber' : 'domain'}
      compact={compact}
      coarse={coarse}
      onSpotlight={enterSpotlight}
      onSkip={() => panelRef.current?.querySelector<HTMLElement>('[data-panel-heading]')?.focus({ preventScroll: true })}
      emptyRings={emptyRings}
      onHeight={setCanvasHeight}
    />
  )

  const spotStrip = spot && members ? <SpotStrip graph={graph} domainId={spot} members={members} horizon={horizon} setHorizon={setHorizon} onExit={exitSpotlight} onSwitch={enterSpotlight} /> : null

  return (
    <div className={`map-explorer ${sheetOpen ? 'pb-[50vh]' : ''}`} onKeyDown={onRootKeyDown} data-map-explorer="" data-compact={compact ? 'true' : 'false'}>
      {/* toolbar: search (its results come next in the tab order, review P2-13), ring filters, story, text table */}
      <div className="map-toolbar mb-3 rounded-card border border-dga-line bg-white p-2.5 shadow-subtle print:hidden">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <label className="relative min-w-[12rem] flex-1 basis-full sm:basis-56 lg:max-w-xs">
            <span className="sr-only">{t(MAP_COPY.search)}</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dga-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={t(touch ? MAP_COPY.searchHintTouch : MAP_COPY.searchHint)}
              aria-describedby={query ? `${uid}-count` : undefined}
              className="map-search w-full rounded-btn border border-dga-line bg-white py-2 pe-3 ps-9 text-sm text-dga-ink placeholder:text-dga-muted focus:border-dga-green"
            />
          </label>

          {query.trim() && (
            <div className="order-last basis-full" data-map-search="">
              <p id={`${uid}-count`} className="text-xs font-semibold text-dga-muted" aria-live="polite">
                {results.length === 0 ? t(MAP_COPY.noResults) : countPhrase(results.length, lang, RESULT_FORMS, ['result', 'results'])}
                {results.length > 0 && search.mode === 'any' ? ` — ${t(MAP_COPY.nearResults)}` : ''}
              </p>
              {results.length > 0 && (
                <ul ref={resultsRef} aria-label={t(MAP_COPY.results)} className="mt-1.5 flex flex-wrap gap-1.5" data-map-results="">
                  {results.slice(0, MAX_RESULTS).map((n) => {
                    const c = domainColour(n.domainId)
                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => select(n.id, { reveal: true, from: 'search' })}
                          className="map-chip inline-flex items-center gap-1.5 rounded-pill border bg-white px-2.5 py-1 text-[12.5px] text-dga-ink hover:bg-dga-bg"
                          style={{ borderColor: c.dot + '66' }}
                        >
                          <KindSwatch kind={n.kind} colour={c.dot} />
                          {t(n.short ?? n.label)}
                          <span className="text-[11px] text-dga-muted">{t(KIND_NAME[n.kind].one)}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
              {results.length > MAX_RESULTS && <p className="mt-1 text-[11.5px] text-dga-muted">{t(ui.moreLit)}</p>}
            </div>
          )}

          <div role="group" aria-label={t(MAP_COPY.rings)} className={`flex items-center gap-1.5 ${compact ? 'map-filters-scroll -mx-1 max-w-full flex-nowrap overflow-x-auto px-1 pb-0.5' : 'flex-wrap'}`}>
            {FILTERS.map((k) => {
              const on = kinds[k]
              const n = counts(k)
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setKinds((s) => ({ ...s, [k]: !s[k] }))}
                  className={`map-filter inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-1 text-[12.5px] font-medium transition-colors ${
                    on ? 'border-dga-green bg-dga-green/10 text-dga-green-dark' : 'border-dga-line bg-white text-dga-muted hover:border-dga-green'
                  }`}
                >
                  <KindSwatch kind={k} colour={on ? '#067647' : '#667085'} />
                  {t(KIND_NAME[k].many)}
                  {n > 0 && <span className="text-[11px] text-dga-muted">{formatNumber(n, lang)}</span>}
                </button>
              )
            })}
            {kinds.sector && sectors.loading && <span className="text-xs text-dga-muted">{t(MAP_COPY.loadingSectors)}</span>}
            {kinds.sector && sectors.error && <span className="text-xs text-dga-amber-tx">{t(MAP_COPY.sectorsFailed)}</span>}
          </div>

          <div className="flex items-center gap-2 lg:ms-auto">
            <button
              type="button"
              onClick={() => goStory(story === null ? 0 : null)}
              aria-pressed={story !== null}
              className={story === null ? 'btn-primary px-4 py-2 text-sm' : 'btn-ghost px-4 py-2 text-sm'}
            >
              {t(story === null ? MAP_COPY.story : MAP_COPY.storyEnd)}
            </button>
            <button type="button" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable} aria-controls={`${uid}-table`} className="btn-ghost px-4 py-2 text-sm">
              {t(showTable ? MAP_COPY.tableHide : MAP_COPY.table)}
            </button>
          </div>
        </div>
        {story !== null && <p className="mt-1.5 text-xs text-dga-muted">{t(ui.storyOn)}</p>}
      </div>

      {compact ? (
        <div className="space-y-4">
          {canvas}
          <p className="text-xs leading-relaxed text-dga-muted">{t(MAP_COPY.touchHint)}</p>
          {spotStrip}
          {!sheetOpen && <div ref={panelRef}>{panel}</div>}
          <MapList
            graph={graph}
            lang={lang}
            t={t}
            visibleKinds={visibleKinds}
            rings={listRings}
            states={states}
            focused={!!focus}
            selected={selected}
            onSelect={(id) => select(selected === id ? null : id, { from: 'list' })}
          />
          {/* a portal: the page wrapper animates with a transform, which would trap a fixed sheet */}
          {sheetOpen &&
            typeof document !== 'undefined' &&
            createPortal(
            <div className="map-sheet fixed inset-x-0 bottom-0 z-50 max-h-[55vh] overflow-y-auto rounded-t-card border-t border-dga-line bg-white shadow-card-lg print:static print:max-h-none" data-map-sheet="">
              <div className="sticky top-0 z-10 flex items-center justify-center border-b border-dga-line/60 bg-white px-3 py-1">
                <span className="h-1.5 w-10 rounded-pill bg-dga-line" aria-hidden="true" />
                <button type="button" onClick={closeSheet} className="absolute end-1 top-0 grid min-h-11 min-w-11 place-items-center text-dga-muted hover:text-dga-ink print:hidden" aria-label={t(MAP_COPY.close)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div ref={panelRef}>{panel}</div>
            </div>,
              document.body,
            )}
        </div>
      ) : (
        // from 768 px the panel sits beside the canvas and ends where it ends (review P0-4)
        <div className="map-grid grid items-start gap-4 md:grid-cols-[minmax(0,1fr),18rem] lg:grid-cols-[minmax(0,1fr),20rem] xl:grid-cols-[minmax(0,1fr),23rem]">
          <div className="min-w-0">
            {canvas}
            {spotStrip}
            <Legend graph={graph} visibleKinds={visibleKinds} sectorsOn={kinds.sector && !!sectors.file} />
            <p className="mt-2 text-xs leading-relaxed text-dga-muted print:hidden">
              {t(MAP_COPY.keyboard)} {t(MAP_COPY.mouse)}
            </p>
          </div>
          <div ref={panelRef} className="map-panel-wrap min-w-0 md:sticky md:top-20">
            {panel}
          </div>
        </div>
      )}

      <div className="sr-only" aria-live="polite" data-map-live="">
        {announcement}
      </div>

      {/* the text equivalent: a real table, out of the layout until shown (review P0-2) */}
      <div className={showTable ? 'mt-6 overflow-x-auto' : 'sr-only'} data-map-table={showTable ? 'shown' : 'hidden'}>
        <VisuallyHiddenTable
          id={`${uid}-table`}
          lang={lang}
          visible={showTable}
          caption={t(MAP_COPY.tableCaption)}
          rowHeader={t(MAP_COPY.name)}
          columns={[t(MAP_COPY.kind), t(MAP_COPY.domain), t(MAP_COPY.links)]}
          rows={graph.nodes.map((n) => {
            const dom = graph.byId.get(`domain.${n.domainId}`)
            const linked = [...(graph.adjacency.get(n.id) ?? [])].map((id) => graph.byId.get(id)!)
            return {
              key: n.id,
              header: t(n.label),
              cells: [t(KIND_NAME[n.kind].one), dom ? t(dom.label) : '—', `${countOf('link', linked.length, lang)}: ${linked.map((x) => t(x.label)).join(sep(lang))}`],
            }
          })}
        />
      </div>
    </div>
  )
}

/** Under the canvas in the spotlight: the adoption timeline, the task-shift lane per horizon, and the other domains. */
function SpotStrip({ graph, domainId, members, horizon, setHorizon, onExit, onSwitch }: { graph: SkillsGraph; domainId: string; members: ReadonlySet<string>; horizon: number; setHorizon: (h: number) => void; onExit: () => void; onSwitch: (d: string) => void }) {
  const { t, lang } = useApp()
  const dom = graph.byId.get(nodeId('domain', domainId))!
  const c = domainColour(domainId)
  const name = `map-horizon-${useId().replace(/:/g, '')}`
  const techs = [...members].map((id) => graph.byId.get(id)!).filter((n) => n.kind === 'tech')
  const shown = techs.filter((n) => HORIZONS.indexOf(techById(n.ref)?.horizon ?? 'far') <= horizon).length
  const families = [...members].map((id) => graph.byId.get(id)!).filter((n) => n.kind === 'family')
  const lane = HORIZON_LANE[HORIZONS[horizon]]
  return (
    <section className="map-spot mt-3 rounded-card border border-s-4 bg-white p-4 shadow-subtle" style={{ borderColor: c.dot }} aria-label={t(ui.spotRegion)} data-map-spot="">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold" style={{ color: c.ink }}>
          {t(MAP_COPY.spotlight)}: {t(dom.label)}
        </p>
        <button type="button" onClick={onExit} className="btn-ghost px-3 py-1.5 text-sm print:hidden">
          {t(MAP_COPY.spotlightExit)} <kbd className="ms-1 rounded border border-dga-line px-1 text-[10.5px] text-dga-muted">Esc</kbd>
        </button>
      </div>
      <fieldset className="mt-3">
        <legend className="text-xs font-semibold text-dga-muted">{t(MAP_COPY.timeline)}</legend>
        <div className="relative mt-2 grid grid-cols-3 gap-1.5">
          <span className="pointer-events-none absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-dga-line" aria-hidden="true" />
          {HORIZONS.map((h, i) => {
            const on = i <= horizon
            const meta = horizonMeta[h]
            return (
              <label
                key={h}
                className={`relative flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-btn border px-2 py-1.5 text-center text-[12px] leading-tight transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dga-green ${
                  i === horizon ? 'border-dga-green bg-dga-green text-white' : on ? 'border-dga-green/40 bg-dga-green/10 text-dga-green-dark' : 'border-dga-line bg-white text-dga-muted'
                }`}
              >
                <input type="radio" name={name} className="sr-only" checked={i === horizon} onChange={() => setHorizon(i)} />
                <span className="font-bold">{t(meta.name)}</span>
                <span className="opacity-90">{t(HORIZON_SPAN[h])}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <p className="mt-2 text-xs text-dga-muted" aria-live="polite">
        {t(ui.techsShown)}: {formatNumber(shown, lang)} / {formatNumber(techs.length, lang)}
      </p>
      {families.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-dga-ink">
            {t(ui.familiesTasks)} — <span style={{ color: c.ink }}>{t(laneMeta[lane].name)}</span>
          </p>
          <ul className="mt-1.5 space-y-1">
            {families.map((f) => {
              const fam = workFamilyById(f.ref)
              const item = fam?.lanes[lane]?.[0]
              return (
                <li key={f.id} className="text-[12.5px] leading-snug text-dga-ink">
                  <span className="font-semibold">{t(f.label)}:</span> {item ? t(item) : '—'}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <p className="mt-2 text-[11.5px] leading-relaxed text-dga-muted">{t(MAP_COPY.timelineNote)}</p>
      <div className="mt-3 print:hidden">
        <p className="text-xs font-semibold text-dga-muted">{t(MAP_COPY.otherDomains)}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {graph.domainIds
            .filter((d) => d !== domainId)
            .map((d) => {
              const n = graph.byId.get(nodeId('domain', d))!
              const dc = domainColour(d)
              return (
                <li key={d}>
                  <button type="button" onClick={() => onSwitch(d)} className="map-chip inline-flex items-center gap-1.5 rounded-pill border bg-white px-2.5 py-1 text-[12px] text-dga-ink hover:bg-dga-bg" style={{ borderColor: dc.dot + '88' }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: dc.dot }} aria-hidden="true" />
                    {t(n.short ?? n.label)}
                  </button>
                </li>
              )
            })}
        </ul>
      </div>
    </section>
  )
}

function Legend({ graph, visibleKinds, sectorsOn }: { graph: { domainIds: string[]; byId: Map<string, { short?: L; label: L }> }; visibleKinds: ReadonlySet<NodeKind>; sectorsOn: boolean }) {
  const { t } = useApp()
  return (
    <div className="map-legend mt-3 flex flex-col gap-2 rounded-card border border-dga-line bg-white px-4 py-3 text-xs text-dga-ink" aria-label={t(MAP_COPY.legend)} role="group">
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {(['domain', 'skill', 'family', 'role', 'tech', 'sector'] as NodeKind[])
          .filter((k) => visibleKinds.has(k))
          .map((k) => (
            <li key={k} className="inline-flex items-center gap-1.5">
              <KindSwatch kind={k} />
              {t(KIND_NAME[k].one)}
            </li>
          ))}
      </ul>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
        {graph.domainIds.map((d) => {
          const n = graph.byId.get(`domain.${d}`)!
          return (
            <li key={d} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: domainColour(d).dot }} aria-hidden="true" />
              {t(n.short ?? n.label)}
            </li>
          )
        })}
      </ul>
      {sectorsOn && (
        <p className="leading-relaxed text-dga-muted">
          <span className="chip-info me-1.5 align-middle">{t(MAP_COPY.editorial)}</span>
          {t(MAP_COPY.sectorsEditorial)}
        </p>
      )}
    </div>
  )
}
