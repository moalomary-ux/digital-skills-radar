import { useMemo, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { pathFor } from '../../lib/routes'
import { bandPath, buildSkillsGraph, edgePath, focusOf, layoutGraph } from '../../lib/skillsGraph'
import type { GraphSources, NodeKind } from '../../lib/skillsGraph'
import { domainColour } from './palette'
import { NodeMark } from './marks'
import { useRovingRings } from './roving'
import { KIND_NAME, MAP_COPY, sep } from './copy'
import { useArrow } from '../shell/hooks'

interface Props {
  /** what to draw; the home page passes only the domains (domains + skills ring) */
  sources: GraphSources
  /** kinds shown besides the domains (default: skills only) */
  kinds?: NodeKind[]
  className?: string
}

/** Mark half-size in world units (the preview scales with its box). */
const MARK: Record<NodeKind, number> = { domain: 46, skill: 15, role: 13, family: 13, tech: 11, sector: 12 }
/** Hit target in pixels. */
const HIT: Record<NodeKind, number> = { domain: 40, skill: 22, role: 18, family: 18, tech: 14, sector: 16 }

/**
 * A compact, interactive preview of the skills map: hover or focus lights a node's connections and
 * names it in the caption; every node is a real link that opens the full map on that node
 * (`/map?node=<id>`). Arrow keys move within a ring; Tab moves between rings.
 */
export default function MapPreview({ sources, kinds = ['skill'], className = '' }: Props) {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const rtl = lang === 'ar'
  const graph = useMemo(() => buildSkillsGraph(sources), [sources])
  const layout = useMemo(() => layoutGraph(graph, { rtl }), [graph, rtl])
  const shown = useMemo(() => new Set<NodeKind>(['domain', ...kinds]), [kinds])
  const nodes = layout.nodes.filter((p) => shown.has(p.kind))
  const E = Math.round(nodes.reduce((m, p) => Math.max(m, p.radius), 0) + 60)
  const rings = layout.rings.map((ids) => ids.filter((id) => shown.has(graph.byId.get(id)!.kind))).filter((ids) => ids.length > 0)
  const roving = useRovingRings(rings, rtl, null)
  const [hovered, setHovered] = useState<string | null>(null)
  const focus = hovered ? focusOf(graph, hovered) : null
  const active = hovered ? graph.byId.get(hovered) : undefined
  const pct = (v: number) => `${(((v + E) / (2 * E)) * 100).toFixed(3)}%`
  const stateOf = (id: string) => (!focus ? 'idle' : id === hovered ? 'active' : focus.nodes.has(id) ? 'near' : 'dim')
  const litDomains = new Set<string>()
  if (focus) for (const id of focus.nodes) litDomains.add(graph.byId.get(id)!.domainId)

  const mapHref = (id: string) => `${pathFor('map', lang)}?node=${encodeURIComponent(id)}`
  const ringName = (ids: string[]) => [...new Set(ids.map((id) => graph.byId.get(id)!.kind))].map((k) => t(KIND_NAME[k].many)).join(rtl ? ' و' : ' and ')

  return (
    <div className={`map-preview ${className}`}>
      <div className="relative mx-auto aspect-square w-full" data-map-preview="">
        <svg viewBox={`${-E} ${-E} ${2 * E} ${2 * E}`} className="absolute inset-0 h-full w-full" role="img" aria-label={t(MAP_COPY.svgLabel)} direction="ltr">
          {layout.wedges.map((w) => (
            <path
              key={w.domainId}
              d={bandPath(layout.radii[0] + 60, E - 24, w.start + 1, w.end - 1)}
              fill={domainColour(w.domainId).tint}
              className="map-wedge"
              data-state={!focus ? 'idle' : litDomains.has(w.domainId) ? 'on' : 'dim'}
            />
          ))}
          <g className="map-edges-base" data-dim={focus ? 'true' : 'false'} fill="none" stroke="#98A2B3" strokeWidth={2}>
            {graph.edges.map((e) => {
              const a = layout.byId.get(e.source)
              const b = layout.byId.get(e.target)
              if (!a || !b || !shown.has(a.kind) || !shown.has(b.kind)) return null
              return <path key={e.id} d={edgePath(a, b)} />
            })}
          </g>
          {focus && (
            <g className="map-edges-hl" key={hovered ?? ''} fill="none" strokeWidth={4}>
              {[...focus.edges].map((eid) => {
                const e = graph.edgeById.get(eid)!
                const a = layout.byId.get(e.source)
                const b = layout.byId.get(e.target)
                if (!a || !b || !shown.has(a.kind) || !shown.has(b.kind)) return null
                const other = e.source === hovered ? e.target : e.source
                return <path key={eid} d={edgePath(a, b)} stroke={domainColour(graph.byId.get(other)!.domainId).dot} strokeOpacity={0.85} />
              })}
            </g>
          )}
          <circle cx={0} cy={0} r={layout.radii[0] - 80} fill="#ffffff" stroke="#E4E7EC" strokeWidth={2} />
          {nodes.map((p, i) => {
            const c = domainColour(p.domainId)
            const st = stateOf(p.id)
            return (
              <g key={p.id} className="map-node" data-state={st}>
                {p.kind === 'domain' ? (
                  <>
                    <circle cx={p.x} cy={p.y} r={MARK.domain * (st === 'active' ? 1.12 : 1)} fill={c.dot} stroke="#ffffff" strokeWidth={5} />
                    <text x={p.x} y={p.y} dy="0.36em" textAnchor="middle" fontSize="34" fontWeight="700" fill="#ffffff">
                      {i + 1}
                    </text>
                  </>
                ) : (
                  <NodeMark kind={p.kind} x={p.x} y={p.y} s={MARK[p.kind] * (st === 'active' ? 1.35 : 1)} colour={c.dot} strokeScale={1.4} />
                )}
              </g>
            )
          })}
        </svg>

        <div className="absolute inset-0">
          {rings.map((ids, ring) => (
            <div key={ring} role="group" aria-label={ringName(ids)}>
              {ids.map((id) => {
                const p = layout.byId.get(id)!
                const size = HIT[p.kind]
                const dom = graph.byId.get(`domain.${p.domainId}`)!
                const style: CSSProperties = { left: pct(p.x), top: pct(p.y), width: size, height: size, transform: 'translate(-50%, -50%)' }
                return (
                  <Link
                    key={id}
                    ref={roving.register(id)}
                    to={mapHref(id)}
                    tabIndex={roving.tabIndexOf(ring, id)}
                    aria-label={`${t(p.label)} — ${t(KIND_NAME[p.kind].one)}${p.kind === 'domain' ? '' : `${sep(lang)}${t(dom.short ?? dom.label)}`}: ${t(MAP_COPY.open)}`}
                    className="map-hit absolute block rounded-full"
                    style={style}
                    data-node={id}
                    onKeyDown={(e: KeyboardEvent<HTMLAnchorElement>) => roving.onKeyDown(e, ring, id)}
                    onFocus={() => {
                      roving.onFocus(ring, id)
                      setHovered(id)
                    }}
                    onBlur={() => setHovered(null)}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <ol className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] leading-snug text-dga-ink" aria-label={t(KIND_NAME.domain.many)}>
        {graph.nodes
          .filter((n) => n.kind === 'domain')
          .map((d, i) => (
            <li key={d.id} className="flex items-center gap-1.5" data-state={stateOf(d.id)}>
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: domainColour(d.domainId).dot }} aria-hidden="true">
                {i + 1}
              </span>
              <span className={hovered && stateOf(d.id) === 'dim' ? 'text-dga-muted' : ''}>{t(d.short ?? d.label)}</span>
            </li>
          ))}
      </ol>

      <div className="mt-3 min-h-[4.25rem] rounded-btn border border-dga-line bg-white px-3.5 py-2.5 text-sm" aria-hidden="true">
        {active ? (
          <>
            <p className="text-[11.5px] font-semibold" style={{ color: domainColour(active.domainId).ink }}>
              {t(KIND_NAME[active.kind].one)}
              {active.kind !== 'domain' ? ` · ${t(graph.byId.get(`domain.${active.domainId}`)!.short ?? graph.byId.get(`domain.${active.domainId}`)!.label)}` : ''}
            </p>
            <p className="mt-0.5 font-bold leading-snug text-dga-black">{t(active.label)}</p>
            <p className="mt-0.5 text-xs font-semibold text-dga-green-dark">
              {t({ ar: 'انقر لتفتحها في الخريطة', en: 'Click to open it on the map' })} {arrow}
            </p>
          </>
        ) : (
          <p className="leading-relaxed text-dga-muted">
            {t({
              ar: 'مرّر فوق أي نقطة، أو انتقل إليها بلوحة المفاتيح، لترى ما تكون وبمَ ترتبط. انقر لتفتحها في الخريطة الكاملة.',
              en: 'Hover over any point, or reach it with the keyboard, to see what it is and what it connects to. Click to open it on the full map.',
            })}
          </p>
        )}
      </div>
    </div>
  )
}
