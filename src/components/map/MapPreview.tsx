import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../store'
import { pathFor } from '../../lib/routes'
import { bandPath, buildSkillsGraph, edgePath, focusOf, focusOfSet, layoutGraph, nodeId, wrapLabel } from '../../lib/skillsGraph'
import type { GraphSources, NodeKind } from '../../lib/skillsGraph'
import { usePrefersReducedMotion } from '../charts/media'
import { domainColour } from './palette'
import { NodeMark } from './marks'
import { useRovingRings } from './roving'
import { KIND_NAME, MAP_COPY, countOf, sep } from './copy'
import { useArrow } from '../shell/hooks'

interface Props {
  /** what to draw; the home page passes only the domains (domains + skills ring) */
  sources: GraphSources
  /** kinds shown besides the domains (default: skills only) */
  kinds?: NodeKind[]
  className?: string
}

/** Mark half-size in world units (the preview scales with its box). */
const MARK: Record<NodeKind, number> = { domain: 30, skill: 15, role: 13, family: 13, tech: 11, sector: 12 }
/** Hit target in pixels. */
const HIT: Record<NodeKind, number> = { domain: 36, skill: 24, role: 18, family: 18, tech: 14, sector: 16 }
/** Room outside the outermost ring for the domain names. */
const NAME_ROOM = 175
const NAME_FONT = 25
/** One domain per second: the whole tour lasts eight seconds, then starts again. */
const CYCLE_MS = 1000

const ui = {
  pause: { ar: 'أوقف العرض المتحرك', en: 'Pause the animation' },
  play: { ar: 'شغّل العرض المتحرك', en: 'Play the animation' },
  hint: {
    ar: 'مرّر فوق أي إسفين أو نقطة، أو انتقل إليها بلوحة المفاتيح، لترى مجالها ومهاراته. انقر لتفتحها في الخريطة الكاملة مع أدوارها وتقنياتها.',
    en: 'Hover over any wedge or point, or reach it with the keyboard, to see its domain and skills. Click to open it on the full map with its roles and technologies.',
  },
  open: { ar: 'انقر لتفتحها في الخريطة الكاملة', en: 'Click to open it on the full map' },
}

/**
 * A compact, interactive teaser of the skills map (P10b, review P2-14): the eight wedges carry their
 * domain names, a gentle eight-second tour lights one domain at a time with its skills (stopped by
 * hover, focus, the pause button or reduced motion), and hovering a wedge or a point lights the
 * whole wedge. Every node is a real link that opens the full map on it (`/map?node=<id>`); arrow
 * keys move within a ring and Tab moves between rings.
 */
export default function MapPreview({ sources, kinds = ['skill'], className = '' }: Props) {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const navigate = useNavigate()
  const rtl = lang === 'ar'
  const reduced = usePrefersReducedMotion()
  const graph = useMemo(() => buildSkillsGraph(sources), [sources])
  const layout = useMemo(() => layoutGraph(graph, { rtl }), [graph, rtl])
  const shown = useMemo(() => new Set<NodeKind>(['domain', ...kinds]), [kinds])
  const nodes = layout.nodes.filter((p) => shown.has(p.kind))
  const outer = nodes.reduce((m, p) => Math.max(m, p.radius), 0)
  const E = Math.round(outer + NAME_ROOM)
  const rings = layout.rings.map((ids) => ids.filter((id) => shown.has(graph.byId.get(id)!.kind))).filter((ids) => ids.length > 0)
  const roving = useRovingRings(rings, rtl, null)
  const [hovered, setHovered] = useState<string | null>(null)

  /* ------------------------------------------------- the eight-second tour */
  const boxRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(true)
  const [tour, setTour] = useState(0)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = boxRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const touring = playing && !reduced && visible && !hovered
  useEffect(() => {
    if (!touring) return
    const timer = setInterval(() => setTour((i) => (i + 1) % graph.domainIds.length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [touring, graph.domainIds.length])
  const stopTour = () => setPlaying(false)
  const tourId = touring ? nodeId('domain', graph.domainIds[tour]) : null

  /* -------------------------------------------------- highlight model */
  const activeId = hovered ?? tourId
  const active = activeId ? graph.byId.get(activeId) : undefined
  // a hovered skill lights its whole wedge, with the skill itself as the active node
  const focus = active ? (active.kind === 'skill' ? focusOfSet(graph, [...focusOf(graph, nodeId('domain', active.domainId)).nodes]) : focusOf(graph, active.id)) : null
  const pct = (v: number) => `${(((v + E) / (2 * E)) * 100).toFixed(3)}%`
  const stateOf = (id: string) => (!focus ? 'idle' : id === activeId ? 'active' : focus.nodes.has(id) ? 'near' : 'dim')
  const litDomain = active?.domainId ?? null

  const mapHref = (id: string) => `${pathFor('map', lang)}?node=${encodeURIComponent(id)}`
  const ringName = (ids: string[]) => [...new Set(ids.map((id) => graph.byId.get(id)!.kind))].map((k) => t(KIND_NAME[k].many)).join(rtl ? ' و' : ' and ')
  const activeDomain = active ? graph.byId.get(nodeId('domain', active.domainId)) : undefined
  const activeSkills = activeDomain ? graph.nodes.filter((n) => n.kind === 'skill' && n.domainId === activeDomain.domainId) : []

  return (
    <div className={`map-preview ${className}`}>
      <div ref={boxRef} className="relative mx-auto aspect-square w-full" data-map-preview="" data-touring={touring ? 'true' : 'false'}>
        <svg viewBox={`${-E} ${-E} ${2 * E} ${2 * E}`} className="absolute inset-0 h-full w-full" role="img" aria-label={t(MAP_COPY.svgLabel)} direction="ltr">
          {layout.wedges.map((w) => (
            <path
              key={w.domainId}
              d={bandPath(layout.radii[0] + 60, outer + 150, w.start + 1, w.end - 1)}
              fill={domainColour(w.domainId).tint}
              className="map-wedge cursor-pointer"
              data-state={!litDomain ? 'idle' : litDomain === w.domainId ? 'on' : 'dim'}
              onMouseEnter={() => {
                stopTour()
                setHovered(nodeId('domain', w.domainId))
              }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(mapHref(nodeId('domain', w.domainId)))}
            />
          ))}
          <g className="map-edges-base" data-dim={focus ? 'true' : 'false'} fill="none" stroke="#98A2B3" strokeWidth={2}>
            <g className="map-edges-core">
              {graph.edges.map((e) => {
                const a = layout.byId.get(e.source)
                const b = layout.byId.get(e.target)
                if (!a || !b || !shown.has(a.kind) || !shown.has(b.kind)) return null
                return <path key={e.id} d={edgePath(a, b)} />
              })}
            </g>
          </g>
          {focus && (
            <g className="map-edges-hl" key={activeId ?? ''} fill="none" strokeWidth={4}>
              {[...focus.edges].map((eid) => {
                const e = graph.edgeById.get(eid)!
                const a = layout.byId.get(e.source)
                const b = layout.byId.get(e.target)
                if (!a || !b || !shown.has(a.kind) || !shown.has(b.kind)) return null
                return <path key={eid} d={edgePath(a, b)} stroke={domainColour(a.domainId).dot} strokeOpacity={0.85} />
              })}
            </g>
          )}
          <circle cx={0} cy={0} r={layout.radii[0] - 80} fill="#ffffff" stroke="#E4E7EC" strokeWidth={2} />
          {nodes.map((p) => {
            const c = domainColour(p.domainId)
            const st = stateOf(p.id)
            return (
              <g key={p.id} className="map-node" data-state={st} data-kind={p.kind}>
                {p.kind === 'domain' ? (
                  <circle cx={p.x} cy={p.y} r={MARK.domain * (st === 'active' ? 1.2 : 1)} fill={c.dot} stroke="#ffffff" strokeWidth={5} />
                ) : (
                  <NodeMark kind={p.kind} x={p.x} y={p.y} s={MARK[p.kind] * (st === 'active' ? 1.35 : 1)} colour={c.dot} strokeScale={1.4} />
                )}
              </g>
            )
          })}
          {/* the domain names on their wedges */}
          {layout.wedges.map((w) => {
            const n = graph.byId.get(nodeId('domain', w.domainId))!
            const c = domainColour(w.domainId)
            const r = outer + 92
            const a = (w.mid * Math.PI) / 180
            const x = r * Math.cos(a)
            const y = r * Math.sin(a)
            const lines = wrapLabel(t(n.short ?? n.label), lang, 190, 2, { fontPx: NAME_FONT, lineHeight: 29, padX: 0, padY: 0 }).lines
            const on = litDomain === w.domainId
            const dim = !!litDomain && !on
            return (
              <text
                key={w.domainId}
                x={x}
                y={y - ((lines.length - 1) * 29) / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={NAME_FONT}
                fontWeight={on ? 800 : 700}
                fill={dim ? '#667085' : c.ink}
                direction={rtl ? 'rtl' : 'ltr'}
                className="map-halo-text pointer-events-none"
                data-preview-name={w.domainId}
              >
                {lines.map((line, i) => (
                  <tspan key={i} x={x} dy={i === 0 ? 0 : 29}>
                    {line}
                  </tspan>
                ))}
              </text>
            )
          })}
        </svg>

        <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
          {rings.map((ids, ring) => (
            <div key={ring} role="group" aria-label={ringName(ids)}>
              {ids.map((id) => {
                const p = layout.byId.get(id)!
                const size = HIT[p.kind]
                const dom = graph.byId.get(`domain.${p.domainId}`)!
                const style: CSSProperties = { left: pct(p.x), top: pct(p.y), width: size, height: size, transform: 'translate(-50%, -50%)', pointerEvents: 'auto' }
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
                      stopTour()
                      setHovered(id)
                    }}
                    onBlur={() => setHovered(null)}
                    onMouseEnter={() => {
                      stopTour()
                      setHovered(id)
                    }}
                    onMouseLeave={() => setHovered(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <div className="min-h-[4.75rem] flex-1 rounded-btn border border-dga-line bg-white px-3.5 py-2.5 text-sm" aria-hidden="true" data-preview-caption="">
          {active && activeDomain ? (
            <>
              <p className="text-[11.5px] font-semibold" style={{ color: domainColour(activeDomain.domainId).ink }}>
                {t(KIND_NAME[active.kind].one)}
                {active.kind !== 'domain' ? ` · ${t(activeDomain.short ?? activeDomain.label)}` : ` · ${countOf('skill', activeSkills.length, lang)}`}
              </p>
              <p className="mt-0.5 font-bold leading-snug text-dga-black">{t(active.label)}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-dga-muted">
                {active.kind === 'domain' ? activeSkills.map((s) => t(s.label)).join(sep(lang)) : `${t(ui.open)} ${arrow}`}
              </p>
            </>
          ) : (
            <p className="leading-relaxed text-dga-muted">{t(ui.hint)}</p>
          )}
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-pressed={!playing}
            aria-label={t(playing ? ui.pause : ui.play)}
            title={t(playing ? ui.pause : ui.play)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-btn border border-dga-line bg-white text-dga-ink hover:border-dga-green hover:text-dga-green-dark"
            data-preview-toggle=""
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5l11 7-11 7z" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
