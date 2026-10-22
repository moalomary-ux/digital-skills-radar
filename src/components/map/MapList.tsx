import { useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import type { L, Lang } from '../../data/types'
import { bandPath, RING_OF } from '../../lib/skillsGraph'
import type { GraphLayout, GraphNode, NodeKind, SkillsGraph } from '../../lib/skillsGraph'
import { formatNumber } from '../../lib/format'
import { domainColour } from './palette'
import { KindSwatch } from './marks'
import { useRovingRings } from './roving'
import { KIND_NAME, countOf } from './copy'
import type { NodeState } from './MapCanvas'

interface Props {
  graph: SkillsGraph
  layout: GraphLayout
  lang: Lang
  t: (l: L) => string
  visibleKinds: ReadonlySet<NodeKind>
  /** reachable node ids per ring (search narrows them), reading order */
  rings: string[][]
  states: ReadonlyMap<string, NodeState>
  /** true when a node, a hover or a story step lights a subset of the map */
  focused: boolean
  selected: string | null
  litDomains: ReadonlySet<string>
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  panel: ReactNode
}

const LIST_KINDS: NodeKind[] = ['skill', 'family', 'role', 'tech', 'sector']
const FOLD = 12

const ui = {
  wheel: { ar: 'المجالات الثمانية', en: 'The eight domains' },
  linked: { ar: 'المرتبطة', en: 'linked' },
  all: { ar: 'اعرض الكل', en: 'Show all' },
  fewer: { ar: 'اعرض أقل', en: 'Show fewer' },
} satisfies Record<string, L>

/**
 * Narrow screens: the same map as a mini-wheel of the eight domains and the rings as stacked lists,
 * with the same interactions (select, connected items lit, search, ring filters, story, keyboard).
 */
export default function MapList({ graph, layout, lang, t, visibleKinds, rings, states, focused, selected, litDomains, onSelect, onHover, panel }: Props) {
  const rtl = lang === 'ar'
  const [open, setOpen] = useState<Partial<Record<NodeKind, boolean>>>({})

  const domainIds = rings[0] ?? []
  const sections = LIST_KINDS.filter((k) => visibleKinds.has(k)).map((kind) => {
    const ids = (rings[RING_OF[kind]] ?? [])
      .filter((id) => graph.byId.get(id)!.kind === kind)
      .filter((id) => !focused || states.get(id) !== 'dim')
    return { kind, ids }
  })
  const lists = [domainIds, ...sections.map((s) => {
    const all = open[s.kind] || s.ids.length <= FOLD + 2
    return all ? s.ids : s.ids.slice(0, FOLD)
  })]
  const roving = useRovingRings(lists, rtl, selected)

  const chip = (n: GraphNode, list: number) => {
    const c = domainColour(n.domainId)
    const st = states.get(n.id) ?? 'idle'
    const pressed = selected === n.id
    return (
      <li key={n.id}>
        <button
          ref={roving.register(n.id)}
          type="button"
          tabIndex={roving.tabIndexOf(list, n.id)}
          aria-pressed={pressed}
          data-node={n.id}
          data-state={st}
          onClick={() => onSelect(n.id)}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => roving.onKeyDown(e, list, n.id)}
          onFocus={() => roving.onFocus(list, n.id)}
          className="map-chip inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-pill border px-3 py-1.5 text-start text-[13px] leading-snug transition-colors"
          style={{ borderColor: pressed ? c.ink : c.dot + '55', background: pressed ? c.ink : st === 'active' || st === 'near' || st === 'match' ? c.tint : '#ffffff', color: pressed ? '#ffffff' : '#212539' }}
        >
          {n.kind === 'domain' ? (
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold" style={{ background: pressed ? '#ffffff' : c.dot, color: pressed ? c.ink : '#ffffff' }} aria-hidden="true">
              {graph.domainIds.indexOf(n.domainId) + 1}
            </span>
          ) : (
            <KindSwatch kind={n.kind} colour={pressed ? '#ffffff' : c.dot} />
          )}
          <span>{t(n.short ?? n.label)}</span>
        </button>
      </li>
    )
  }

  return (
    <div className="map-list space-y-5">
      <div className="rounded-card border border-dga-line bg-white p-4 shadow-card">
        <MiniWheel graph={graph} layout={layout} selected={selected} litDomains={litDomains} onSelect={onSelect} onHover={onHover} />
        <div role="group" aria-label={t(ui.wheel)} className="mt-3">
          <ul className="flex flex-wrap justify-center gap-1.5">{domainIds.map((id) => chip(graph.byId.get(id)!, 0))}</ul>
        </div>
      </div>

      {panel}

      {sections.map((s, i) => {
        if (s.ids.length === 0) return null
        const shown = lists[i + 1]
        return (
          <section key={s.kind} className="rounded-card border border-dga-line bg-white p-4" aria-labelledby={`map-list-${s.kind}`}>
            <h3 id={`map-list-${s.kind}`} className="flex items-center gap-2 text-sm font-bold text-dga-black">
              <KindSwatch kind={s.kind} />
              {t(KIND_NAME[s.kind].many)}
              <span className="text-xs font-semibold text-dga-muted">
                {focused ? `${formatNumber(s.ids.length, lang)} ${t(ui.linked)}` : countOf(s.kind, s.ids.length, lang)}
              </span>
            </h3>
            <div role="group" aria-label={t(KIND_NAME[s.kind].many)}>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {shown.map((id) => chip(graph.byId.get(id)!, i + 1))}
                {/* folded items are printed too */}
                {s.ids.slice(shown.length).map((id) => (
                  <li key={id} className="hidden print:block">
                    <span className="inline-flex rounded-pill border border-dga-line px-3 py-1.5 text-[13px]">{t(graph.byId.get(id)!.label)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {shown.length < s.ids.length || open[s.kind] ? (
              <button type="button" className="mt-2 text-xs font-semibold text-dga-green-dark print:hidden" aria-expanded={!!open[s.kind]} onClick={() => setOpen((o) => ({ ...o, [s.kind]: !o[s.kind] }))}>
                {open[s.kind] ? t(ui.fewer) : `${t(ui.all)} (${formatNumber(s.ids.length, lang)})`}
              </button>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}

/** The eight domain wedges with their skills; tapping a wedge selects the domain (the chips below are the keyboard path). */
function MiniWheel({ graph, layout, selected, litDomains, onSelect, onHover }: { graph: SkillsGraph; layout: GraphLayout; selected: string | null; litDomains: ReadonlySet<string>; onSelect: (id: string) => void; onHover: (id: string | null) => void }) {
  const R = layout.radii[1] + 40
  const selectedDomain = selected ? graph.byId.get(selected)?.domainId : undefined
  return (
    <svg viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} className="mx-auto block w-full max-w-[17rem]" aria-hidden="true" focusable="false">
      {layout.wedges.map((w, i) => {
        const c = domainColour(w.domainId)
        const on = selectedDomain === w.domainId || litDomains.has(w.domainId)
        const mid = (w.mid * Math.PI) / 180
        return (
          <g key={w.domainId} className="cursor-pointer" onClick={() => onSelect(`domain.${w.domainId}`)} onMouseEnter={() => onHover(`domain.${w.domainId}`)} onMouseLeave={() => onHover(null)}>
            <path d={bandPath(70, R - 6, w.start + 1, w.end - 1)} fill={on ? c.dot : c.tint} className="map-mini-wedge" />
            <text x={Math.cos(mid) * 112} y={Math.sin(mid) * 112} dy="0.35em" textAnchor="middle" fontSize="34" fontWeight="700" fill={on ? '#ffffff' : c.ink}>
              {i + 1}
            </text>
          </g>
        )
      })}
      {layout.nodes
        .filter((p) => p.kind === 'skill')
        .map((p) => {
          const on = selectedDomain === p.domainId || litDomains.has(p.domainId)
          const a = (p.angle * Math.PI) / 180
          const r = layout.radii[1] - 30
          return <circle key={p.id} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={9} fill={on ? '#ffffff' : domainColour(p.domainId).dot} />
        })}
      <circle cx={0} cy={0} r={58} fill="#ffffff" stroke="#E4E7EC" />
    </svg>
  )
}
