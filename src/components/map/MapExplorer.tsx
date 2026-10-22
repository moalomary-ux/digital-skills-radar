import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../../store'
import type { L } from '../../data/types'
import { shifts } from '../../data/leaders/shifts'
import { loadSectors } from '../../data/gov/loaders'
import type { SectorsFile } from '../../data/gov/types'
import { countPhrase, formatNumber } from '../../lib/format'
import {
  buildSkillsGraph,
  buildStory,
  focusOf,
  focusOfSet,
  layoutGraph,
  resolveNodeId,
  searchNodes,
} from '../../lib/skillsGraph'
import type { Focus, GraphSources, NodeKind } from '../../lib/skillsGraph'
import VisuallyHiddenTable from '../charts/VisuallyHiddenTable'
import { useMediaQuery } from '../charts/media'
import { defaultSources, sectorSources } from './sources'
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

let baseSources: GraphSources | null = null
const sourcesOnce = () => (baseSources ??= defaultSources())

const ui = {
  ringsHint: { ar: 'اختر الحلقات التي تظهر على الخريطة', en: 'Choose the rings shown on the map' },
  storyOn: { ar: 'القصة تعمل: استخدم «التالي» و«السابق» في اللوحة.', en: 'The story is on: use «Next» and «Back» in the panel.' },
  moreLit: { ar: 'والبقية مضاءة على الخريطة.', en: 'The rest are lit on the map.' },
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

/**
 * The interactive skills map: toolbar (search, ring filters, story, text table), the canvas on
 * wide screens or the stacked rings on narrow ones, the side panel, and the text equivalent.
 * With `syncUrl`, `?node=<id>` preselects a node and `?story=1` opens the guided tour.
 */
export default function MapExplorer({ syncUrl = false, headingLevel = 2 }: { syncUrl?: boolean; headingLevel?: 2 | 3 }) {
  const { t, lang } = useApp()
  const rtl = lang === 'ar'
  const uid = useId().replace(/:/g, '')
  const [params, setParams] = useSearchParams()
  const initialNode = syncUrl ? params.get('node') : null
  const compact = useMediaQuery('(max-width: 767px)')

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
  const layout = useMemo(() => layoutGraph(graph, { rtl }), [graph, rtl])
  const steps = useMemo(() => buildStory(graph, shifts), [graph])
  const visibleKinds = useMemo(() => new Set<NodeKind>(['domain', ...FILTERS.filter((k) => kinds[k])]), [kinds])

  /* ------------------------------------------------------ selection */
  const [selected, setSelected] = useState<string | null>(() => resolveNodeId(graph, initialNode))
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
  const [story, setStory] = useState<number | null>(() => (syncUrl && params.get('story') === '1' ? 0 : null))
  const [query, setQuery] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [command, setCommand] = useState<CameraCommand>({ key: 0, ids: null })
  const searchRef = useRef<HTMLInputElement>(null)

  const writeUrl = (node: string | null, storyOn: boolean) => {
    if (!syncUrl) return
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (node) next.set('node', node)
        else next.delete('node')
        if (storyOn) next.set('story', '1')
        else next.delete('story')
        return next
      },
      { replace: true },
    )
  }

  const select = (id: string | null, reveal = true) => {
    setSelected(id)
    if (id) {
      setStory(null)
      setAnnouncement(announce(graph, id, lang))
      if (reveal) setCommand((c) => ({ key: c.key + 1, ids: [id], reveal: true }))
    }
    writeUrl(id, false)
  }
  const toggleFromMap = (id: string) => select(selected === id ? null : id, false)
  const goStory = (index: number | null) => {
    setStory(index)
    setHovered(null)
    if (index === null) {
      writeUrl(selected, false)
      setCommand((c) => ({ key: c.key + 1, ids: null }))
      return
    }
    setSelected(null)
    writeUrl(null, true)
    const step = steps[index]
    setAnnouncement(`${t(MAP_COPY.step)} ${formatNumber(index + 1, lang)} ${t(MAP_COPY.of)} ${formatNumber(steps.length, lang)}: ${step.shift ? t(step.shift.title) : t(MAP_COPY.title)}`)
    setCommand((c) => ({ key: c.key + 1, ids: index === 0 ? null : step.focus }))
  }

  /* ---------------------------------------------- highlight model */
  const visibleNodes = useMemo(() => graph.nodes.filter((n) => visibleKinds.has(n.kind)), [graph, visibleKinds])
  const results = useMemo(() => searchNodes(visibleNodes, query), [visibleNodes, query])
  const matches = useMemo(() => (query.trim() ? new Set(results.map((n) => n.id)) : null), [results, query])

  const focus: Focus | null = useMemo(() => {
    if (hovered && graph.byId.has(hovered)) return focusOf(graph, hovered)
    if (story !== null && steps[story]) return focusOfSet(graph, steps[story].focus)
    if (selected && graph.byId.has(selected)) return focusOf(graph, selected)
    return null
  }, [graph, hovered, story, steps, selected])
  const activeId = hovered ?? (story !== null ? null : selected)

  const states = useMemo(() => {
    const m = new Map<string, NodeState>()
    for (const n of graph.nodes) {
      let st: NodeState = 'idle'
      if (focus) st = n.id === activeId ? 'active' : focus.nodes.has(n.id) ? 'near' : 'dim'
      else if (matches) st = matches.has(n.id) ? 'match' : 'dim'
      m.set(n.id, st)
    }
    return m
  }, [graph, focus, activeId, matches])

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

  const rings = useMemo(
    () =>
      layout.rings.map((ids, ring) =>
        ids.filter((id) => {
          const n = graph.byId.get(id)!
          if (!visibleKinds.has(n.kind)) return false
          return ring === 0 || !matches || matches.has(id)
        }),
      ),
    [layout, graph, visibleKinds, matches],
  )

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
    if (selected) {
      e.preventDefault()
      select(null)
      setHovered(null)
      return
    }
    if (story !== null) return goStory(null)
    if (query) setQuery('')
  }

  /* ----------------------------------------------------- rendering */
  const counts = (k: NodeKind) => graph.nodes.filter((n) => n.kind === k).length
  const panel = (
    <MapPanel
      graph={graph}
      selected={selected}
      story={story !== null ? { steps, index: story } : null}
      onSelect={(id) => select(id)}
      onStory={goStory}
      onClear={() => select(null)}
      headingLevel={headingLevel}
      sectorPeriod={sectors.file?.periods.consulting ?? null}
      className={compact ? '' : 'xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto'}
    />
  )

  return (
    <div className="map-explorer" onKeyDown={onRootKeyDown} data-map-explorer="">
      {/* toolbar */}
      <div className="map-toolbar mb-4 flex flex-col gap-2.5 rounded-card border border-dga-line bg-white p-3 shadow-subtle print:hidden">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <label className="relative min-w-[12rem] flex-1 basis-full sm:basis-60 xl:max-w-sm">
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
              placeholder={t(MAP_COPY.searchHint)}
              aria-describedby={query ? `${uid}-count` : undefined}
              className="w-full rounded-btn border border-dga-line bg-white py-2 pe-3 ps-9 text-sm text-dga-ink placeholder:text-dga-muted focus:border-dga-green"
            />
          </label>

          <div role="group" aria-label={t(MAP_COPY.rings)} className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((k) => {
              const on = kinds[k]
              const n = counts(k)
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setKinds((s) => ({ ...s, [k]: !s[k] }))}
                  className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-[12.5px] font-medium transition-colors ${
                    on ? 'border-dga-green bg-dga-green/10 text-dga-green-dark' : 'border-dga-line bg-white text-dga-muted hover:border-dga-green'
                  }`}
                >
                  <KindSwatch kind={k} colour={on ? '#1B8354' : '#9DA4AE'} />
                  {t(KIND_NAME[k].many)}
                  {n > 0 && <span className="text-[11px] text-dga-muted">{formatNumber(n, lang)}</span>}
                </button>
              )
            })}
            {kinds.sector && sectors.loading && <span className="text-xs text-dga-muted">{t(MAP_COPY.loadingSectors)}</span>}
            {kinds.sector && sectors.error && <span className="text-xs text-dga-amber-tx">{t(MAP_COPY.sectorsFailed)}</span>}
          </div>

          <div className="flex items-center gap-2 xl:ms-auto">
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

        {query.trim() && (
          <div>
            <p id={`${uid}-count`} className="text-xs font-semibold text-dga-muted" aria-live="polite">
              {results.length === 0 ? t(MAP_COPY.noResults) : countPhrase(results.length, lang, RESULT_FORMS, ['result', 'results'])}
            </p>
            {results.length > 0 && (
              <ul aria-label={t(MAP_COPY.results)} className="mt-2 flex flex-wrap gap-1.5" data-map-results="">
                {results.slice(0, MAX_RESULTS).map((n) => {
                  const c = domainColour(n.domainId)
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => select(n.id)}
                        className="inline-flex items-center gap-1.5 rounded-pill border bg-white px-2.5 py-1 text-[12.5px] text-dga-ink hover:bg-dga-bg"
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
            {results.length > MAX_RESULTS && <p className="mt-1.5 text-[11.5px] text-dga-muted">{t(ui.moreLit)}</p>}
          </div>
        )}
        {story !== null && <p className="text-xs text-dga-muted">{t(ui.storyOn)}</p>}
      </div>

      {compact ? (
        <MapList
          graph={graph}
          layout={layout}
          lang={lang}
          t={t}
          visibleKinds={visibleKinds}
          rings={rings}
          states={states}
          focused={!!focus}
          selected={selected}
          litDomains={litDomains}
          onSelect={(id) => select(selected === id ? null : id, false)}
          onHover={setHovered}
          panel={panel}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr),23rem] xl:items-start">
          <div className="min-w-0">
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
              hovered={hovered}
              litDomains={litDomains}
              onSelect={toggleFromMap}
              onHover={setHovered}
              command={command}
            />
            <Legend graph={graph} visibleKinds={visibleKinds} />
            <p className="mt-2 text-xs leading-relaxed text-dga-muted print:hidden">{t(MAP_COPY.keyboard)}</p>
          </div>
          {panel}
        </div>
      )}

      <div className="sr-only" aria-live="polite" data-map-live="">
        {announcement}
      </div>

      <div className="mt-6">
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

function Legend({ graph, visibleKinds }: { graph: { domainIds: string[]; byId: Map<string, { short?: L; label: L }> }; visibleKinds: ReadonlySet<NodeKind> }) {
  const { t } = useApp()
  return (
    <div className="mt-3 flex flex-col gap-2 rounded-card border border-dga-line bg-white px-4 py-3 text-xs text-dga-ink" aria-label={t(MAP_COPY.legend)} role="group">
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
    </div>
  )
}
