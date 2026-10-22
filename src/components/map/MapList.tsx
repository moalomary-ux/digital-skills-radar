import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { L, Lang } from '../../data/types'
import { RING_OF } from '../../lib/skillsGraph'
import type { GraphNode, NodeKind, SkillsGraph } from '../../lib/skillsGraph'
import { formatNumber } from '../../lib/format'
import { domainColour } from './palette'
import { KindSwatch } from './marks'
import { useRovingRings } from './roving'
import { KIND_NAME, countOf } from './copy'
import type { NodeState } from './MapCanvas'

interface Props {
  graph: SkillsGraph
  lang: Lang
  t: (l: L) => string
  visibleKinds: ReadonlySet<NodeKind>
  /** reachable node ids per ring (search narrows them), reading order */
  rings: string[][]
  states: ReadonlyMap<string, NodeState>
  /** true when a node, a hover or a story step lights a subset of the map */
  focused: boolean
  selected: string | null
  onSelect: (id: string) => void
}

const LIST_KINDS: NodeKind[] = ['skill', 'family', 'role', 'tech', 'sector']
const FOLD = 12

const ui = {
  wheel: { ar: 'المجالات الثمانية', en: 'The eight domains' },
  linked: { ar: 'مرتبطة', en: 'linked' },
  all: { ar: 'اعرض الكل', en: 'Show all' },
  fewer: { ar: 'اعرض أقل', en: 'Show fewer' },
} satisfies Record<string, L>

/**
 * Narrow screens: under the touch wheel, the same map as stacked lists — the domains, then each
 * ring — with the same interactions (select, connected items lit, search, ring filters, story,
 * keyboard). Every chip is at least 44 px tall (review P1-9).
 */
export default function MapList({ graph, lang, t, visibleKinds, rings, states, focused, selected, onSelect }: Props) {
  const rtl = lang === 'ar'
  const [open, setOpen] = useState<Partial<Record<NodeKind, boolean>>>({})

  const domainIds = rings[0] ?? []
  const sections = LIST_KINDS.filter((k) => visibleKinds.has(k)).map((kind) => {
    const ids = (rings[RING_OF[kind]] ?? [])
      .filter((id) => graph.byId.get(id)!.kind === kind)
      .filter((id) => !focused || states.get(id) !== 'dim')
    return { kind, ids }
  })
  const lists = [
    domainIds,
    ...sections.map((s) => {
      const all = open[s.kind] || s.ids.length <= FOLD + 2
      return all ? s.ids : s.ids.slice(0, FOLD)
    }),
  ]
  const roving = useRovingRings(lists, rtl, selected)

  const chip = (n: GraphNode, list: number) => {
    const c = domainColour(n.domainId)
    const st = states.get(n.id) ?? 'idle'
    const pressed = selected === n.id
    const lit = st === 'active' || st === 'near' || st === 'match'
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
          className="map-chip inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-pill border px-3 py-1.5 text-start text-[13px] leading-snug transition-colors"
          style={{
            borderColor: pressed ? c.ink : st === 'dim' ? '#D0D5DD' : c.dot + '66',
            background: pressed ? c.ink : lit ? c.tint : '#ffffff',
            color: pressed ? '#ffffff' : st === 'dim' ? '#667085' : '#212539',
          }}
        >
          {n.kind === 'domain' ? (
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: pressed ? '#ffffff' : c.dot }} aria-hidden="true" />
          ) : (
            <KindSwatch kind={n.kind} colour={pressed ? '#ffffff' : c.dot} />
          )}
          <span>{t(n.short ?? n.label)}</span>
        </button>
      </li>
    )
  }

  return (
    <div className="map-list space-y-4">
      <section className="rounded-card border border-dga-line bg-white p-4" aria-labelledby="map-list-domains">
        <h3 id="map-list-domains" className="text-sm font-bold text-dga-black">
          {t(ui.wheel)}
        </h3>
        <div role="group" aria-label={t(ui.wheel)} className="mt-3">
          <ul className="flex flex-wrap gap-1.5">{domainIds.map((id) => chip(graph.byId.get(id)!, 0))}</ul>
        </div>
      </section>

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
              <button type="button" className="mt-2 min-h-11 text-xs font-semibold text-dga-green-dark print:hidden" aria-expanded={!!open[s.kind]} onClick={() => setOpen((o) => ({ ...o, [s.kind]: !o[s.kind] }))}>
                {open[s.kind] ? t(ui.fewer) : `${t(ui.all)} (${formatNumber(s.ids.length, lang)})`}
              </button>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
