import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import type { L, Lang } from '../../data/types'
import {
  bandPath,
  clampZoom,
  edgePath,
  fitScale,
  frameCamera,
  LABEL_METRICS,
  placeLabels,
  worldToScreen,
  wrapLabel,
  zoomAt,
} from '../../lib/skillsGraph'
import type { Camera, Focus, GraphLayout, LabelBox, LabelRequest, NodeKind, PositionedNode, SkillsGraph } from '../../lib/skillsGraph'
import { usePrefersReducedMotion } from '../charts/media'
import { domainColour } from './palette'
import { NodeMark } from './marks'
import { useRovingRings } from './roving'
import { KIND_NAME, MAP_COPY, countOf, sep } from './copy'

export type NodeState = 'active' | 'near' | 'match' | 'dim' | 'idle'

export interface CameraCommand {
  key: number
  /** node ids to frame; null = reset to fit */
  ids: string[] | null
  /** only pan to the first id when it is off screen (selection from outside the canvas) */
  reveal?: boolean
}

interface Props {
  graph: SkillsGraph
  layout: GraphLayout
  lang: Lang
  t: (l: L) => string
  visibleKinds: ReadonlySet<NodeKind>
  /** node ids per ring that are on the map and reachable (search narrows them), reading order */
  rings: string[][]
  states: ReadonlyMap<string, NodeState>
  focus: Focus | null
  activeId: string | null
  selected: string | null
  hovered: string | null
  /** domains whose wedge is lit */
  litDomains: ReadonlySet<string>
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  command: CameraCommand
}

/** Node mark half-size in screen pixels. */
const MARK_PX: Record<NodeKind, number> = { domain: 30, skill: 6, role: 5.6, family: 5.6, tech: 4.6, sector: 5.4 }
/** Label max width in screen pixels. */
const LABEL_W: Record<NodeKind, number> = { domain: 108, skill: 150, role: 150, family: 150, tech: 170, sector: 150 }
const PILL_METRICS = { fontPx: 12, lineHeight: 15, padX: 9, padY: 5 }
const ZOOM_STEP = 1.35
const DRAG_THRESHOLD = 5

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)

/** The desktop map: SVG canvas (zoom/pan) with an HTML layer of real buttons and labels. */
export default function MapCanvas(props: Props) {
  const { graph, layout, lang, t, visibleKinds, rings, states, focus, activeId, selected, hovered, litDomains, onSelect, onHover, command } = props
  const rtl = lang === 'ar'
  const reduced = usePrefersReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)

  /* ---------------------------------------------------------- size */
  const [width, setWidth] = useState(960)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth > 0 ? el.clientWidth : 960)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const [viewport, setViewport] = useState(900)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setViewport(window.innerHeight || 900)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  // wide canvases keep a landscape ratio; narrower ones grow towards a square so the domain labels never collide
  const height = Math.round(Math.max(440, Math.min(760, viewport - 130, Math.max(width * 0.74, Math.min(width, 680)))))

  const visibleNodes = useMemo(() => layout.nodes.filter((p) => visibleKinds.has(p.kind)), [layout, visibleKinds])
  const extent = useMemo(() => visibleNodes.reduce((m, p) => Math.max(m, p.radius), layout.radii[0]) + 34, [visibleNodes, layout])
  const scale = fitScale(width, height, extent)
  const size = useMemo(() => ({ width, height, scale }), [width, height, scale])

  /* -------------------------------------------------------- camera */
  const [cam, setCam] = useState<Camera>({ k: 1, tx: 0, ty: 0 })
  const camRef = useRef(cam)
  camRef.current = cam
  const raf = useRef<number | null>(null)
  const stopAnim = () => {
    if (raf.current !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf.current)
    raf.current = null
  }
  const animateTo = useCallback(
    (target: Camera) => {
      stopAnim()
      if (reduced || typeof requestAnimationFrame !== 'function') {
        setCam(target)
        return
      }
      const from = camRef.current
      const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 560)
        const e = ease(p)
        setCam({
          k: Math.exp(Math.log(from.k) + (Math.log(target.k) - Math.log(from.k)) * e),
          tx: from.tx + (target.tx - from.tx) * e,
          ty: from.ty + (target.ty - from.ty) * e,
        })
        raf.current = p < 1 ? requestAnimationFrame(tick) : null
      }
      raf.current = requestAnimationFrame(tick)
    },
    [reduced],
  )
  useEffect(() => stopAnim, [])

  // camera commands (story steps, reset, deep links)
  const lastKey = useRef(command.key)
  useEffect(() => {
    if (command.key === lastKey.current) return
    lastKey.current = command.key
    if (!command.ids) return animateTo({ k: 1, tx: 0, ty: 0 })
    const pts = command.ids.map((id) => layout.byId.get(id)).filter((p): p is PositionedNode => !!p && visibleKinds.has(p.kind))
    if (command.reveal) {
      const p = pts[0]
      if (!p) return
      const c = camRef.current
      const s = worldToScreen(p, c, size)
      if (s.x >= 60 && s.y >= 60 && s.x <= size.width - 60 && s.y <= size.height - 60) return
      return animateTo({ ...c, tx: c.tx + (size.width / 2 - s.x), ty: c.ty + (size.height / 2 - s.y) })
    }
    animateTo(frameCamera(pts, size))
  }, [command, layout, size, animateTo, visibleKinds])

  const zoomBy = (factor: number) => animateTo(zoomAt(camRef.current, factor, width / 2, height / 2, size))
  const reset = () => animateTo({ k: 1, tx: 0, ty: 0 })

  /* ------------------------------------------- pointer: drag, pinch */
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ x: number; y: number; cam: Camera; dist: number; mx: number; my: number } | null>(null)
  const dragged = useRef(false)
  const [engaged, setEngaged] = useState(false)
  const [hint, setHint] = useState(false)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const local = (e: { clientX: number; clientY: number }) => {
    const r = wrapRef.current?.getBoundingClientRect()
    return { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) }
  }
  const startGesture = () => {
    const pts = [...pointers.current.values()]
    if (pts.length === 0) return (gesture.current = null)
    const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length
    const my = pts.reduce((s, p) => s + p.y, 0) / pts.length
    const dist = pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0
    gesture.current = { x: mx, y: my, cam: camRef.current, dist, mx, my }
  }
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-map-control]')) return
    setEngaged(true)
    stopAnim()
    pointers.current.set(e.pointerId, local(e))
    dragged.current = false
    startGesture()
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return
    pointers.current.set(e.pointerId, local(e))
    const pts = [...pointers.current.values()]
    const g = gesture.current
    const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length
    const my = pts.reduce((s, p) => s + p.y, 0) / pts.length
    if (!dragged.current && Math.hypot(mx - g.x, my - g.y) < DRAG_THRESHOLD && pts.length < 2) return
    if (!dragged.current) {
      dragged.current = true
      try {
        wrapRef.current?.setPointerCapture(e.pointerId)
      } catch {
        /* capture is optional */
      }
    }
    if (pts.length > 1 && g.dist > 0) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const pinched = zoomAt(g.cam, dist / g.dist, g.mx, g.my, size)
      setCam({ ...pinched, tx: pinched.tx + (mx - g.mx), ty: pinched.ty + (my - g.my) })
    } else setCam({ ...g.cam, tx: g.cam.tx + (mx - g.x), ty: g.cam.ty + (my - g.y) })
  }
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId)
    startGesture()
  }
  const onClickCapture = (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    if (!dragged.current) return
    dragged.current = false
    e.stopPropagation()
    e.preventDefault()
  }

  // wheel: zoom with Ctrl/⌘ (and trackpad pinch) at any time, with the plain wheel once the map is engaged
  const engagedRef = useRef(engaged)
  engagedRef.current = engaged
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey || engagedRef.current)) {
        setHint(true)
        if (hintTimer.current) clearTimeout(hintTimer.current)
        hintTimer.current = setTimeout(() => setHint(false), 1800)
        return
      }
      e.preventDefault()
      stopAnim()
      const p = local(e)
      const factor = Math.exp(-Math.max(-60, Math.min(60, e.deltaY)) * 0.006)
      setCam((c) => zoomAt(c, factor, p.x, p.y, { width: el.clientWidth || width, height: el.clientHeight || height }))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (hintTimer.current) clearTimeout(hintTimer.current)
    }
  }, [width, height])

  /* --------------------------------------------------- projection */
  const screen = (p: { x: number; y: number }) => worldToScreen(p, cam, size)
  const markPx = (kind: NodeKind) => MARK_PX[kind] * Math.max(0.85, Math.min(1.6, Math.pow(cam.k, 0.35)))
  const worldPerPx = 1 / (scale * cam.k)
  const centre = screen({ x: 0, y: 0 })
  const inView = (s: { x: number; y: number }, pad = 0) => s.x >= -pad && s.y >= -pad && s.x <= width + pad && s.y <= height + pad

  /* -------------------------------------------- keyboard (roving) */
  const roving = useRovingRings(rings, rtl, selected)
  const onNodeKeyDown = (e: KeyboardEvent<HTMLElement>, ring: number, id: string) => roving.onKeyDown(e, ring, id)
  const onNodeFocus = (ring: number, id: string) => {
    roving.onFocus(ring, id)
    onHover(id)
    const p = layout.byId.get(id)
    if (!p) return
    const s = screen(p)
    if (s.x < 40 || s.y < 40 || s.x > width - 40 || s.y > height - 40) {
      animateTo({ ...camRef.current, tx: camRef.current.tx + (width / 2 - s.x), ty: camRef.current.ty + (height / 2 - s.y) })
    }
  }

  /* ------------------------------------------------------- labels */
  const domainNodes = visibleNodes.filter((p) => p.kind === 'domain')
  const pills = domainNodes.map((p) => {
    const s = screen(p)
    const text = t(p.short ?? p.label)
    const box = wrapLabel(text, lang, LABEL_W.domain, 3, PILL_METRICS)
    return { p, s, lines: box.lines, box: { x: s.x - box.w / 2 - 2, y: s.y - box.h / 2 - 2, w: box.w + 4, h: box.h + 4 } as LabelBox }
  })
  const showAll = cam.k >= 1.45
  const requests: LabelRequest[] = []
  for (const p of visibleNodes) {
    if (p.kind === 'domain') continue
    const st = states.get(p.id) ?? 'idle'
    const s = screen(p)
    if (!inView(s)) continue
    let priority: number | null = null
    if (st === 'active') priority = 0
    else if (st === 'near' || st === 'match') priority = 10 + p.ring
    else if (showAll && st === 'idle') priority = 30 + p.ring * 10
    if (priority === null) continue
    requests.push({ id: p.id, text: t(p.label), lang, x: s.x, y: s.y, r: markPx(p.kind), priority, cx: centre.x, maxWidth: LABEL_W[p.kind] })
  }
  const controlsBox: LabelBox = rtl ? { x: 0, y: height - 150, w: 64, h: 150 } : { x: width - 64, y: height - 150, w: 64, h: 150 }
  const labels = placeLabels(requests, { width, height }, [...pills.map((x) => x.box), controlsBox])

  /* ------------------------------------------------------ tooltip */
  const tipNode = hovered ? layout.byId.get(hovered) : undefined
  const tip = tipNode && tipNode.kind !== 'domain' && visibleKinds.has(tipNode.kind) ? tipNode : undefined

  /* --------------------------------------------------- rendering */
  const lit = (domainId: string) => (litDomains.size === 0 ? 'idle' : litDomains.has(domainId) ? 'on' : 'dim')
  const transform = `translate(${(width / 2 + cam.tx).toFixed(2)} ${(height / 2 + cam.ty).toFixed(2)}) scale(${(scale * cam.k).toFixed(5)})`
  const hlColour = (a: string, b: string) => {
    const other = a === activeId ? b : b === activeId ? a : b
    return domainColour(graph.byId.get(other)?.domainId ?? '').dot
  }

  const ringLabel = (ring: number): string => {
    const kinds = [...new Set(rings[ring].map((id) => graph.byId.get(id)!.kind))]
    return kinds.map((k) => t(KIND_NAME[k].many)).join(rtl ? ' و' : ' and ')
  }

  const nodeName = (p: PositionedNode) => {
    const kind = t(KIND_NAME[p.kind].one)
    const dom = graph.byId.get(`domain.${p.domainId}`)
    const degree = graph.adjacency.get(p.id)?.size ?? 0
    return `${t(p.label)} — ${kind}${p.kind !== 'domain' && dom ? `${sep(lang)}${t(dom.short ?? dom.label)}` : ''} (${countOf('link', degree, lang)})`
  }

  return (
    <div
      ref={wrapRef}
      className="map-canvas relative select-none overflow-hidden rounded-card border border-dga-line bg-white shadow-card"
      style={{ height, touchAction: 'none' } as CSSProperties}
      data-engaged={engaged ? 'true' : 'false'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && pointers.current.size === 0) setEngaged(false)
      }}
      onClickCapture={onClickCapture}
    >
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="absolute inset-0 block h-full w-full" role="img" aria-label={t(MAP_COPY.svgLabel)} direction="ltr">
        <defs>
          <radialGradient id="map-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#1B8354" stopOpacity="0.07" />
            <stop offset="70%" stopColor="#1B8354" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#1B8354" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={transform}>
          <circle cx={0} cy={0} r={extent + 40} fill="url(#map-glow)" />
          {layout.wedges.map((w) => (
            <path
              key={w.domainId}
              d={bandPath(layout.radii[0] + 52, extent + 8, w.start + 0.8, w.end - 0.8)}
              fill={domainColour(w.domainId).tint}
              className="map-wedge"
              data-state={lit(w.domainId)}
            />
          ))}
          {layout.radii.slice(1).map((r, i) =>
            rings[i + 1]?.length || visibleNodes.some((p) => p.ring === i + 1) ? (
              <circle key={r} cx={0} cy={0} r={r} fill="none" stroke="#D0D5DD" strokeWidth={1} strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
            ) : null,
          )}
          <BaseEdges graph={graph} layout={layout} visibleKinds={visibleKinds} dim={!!focus} />
          {focus && (
            <g className="map-edges-hl" key={[...focus.edges].slice(0, 3).join() + focus.edges.size}>
              {[...focus.edges].map((eid) => {
                const e = graph.edgeById.get(eid)!
                const a = layout.byId.get(e.source)
                const b = layout.byId.get(e.target)
                if (!a || !b || !visibleKinds.has(a.kind) || !visibleKinds.has(b.kind)) return null
                return <path key={eid} d={edgePath(a, b)} fill="none" stroke={hlColour(e.source, e.target)} strokeWidth={1.7} strokeOpacity={0.85} vectorEffect="non-scaling-stroke" />
              })}
            </g>
          )}
          <circle cx={0} cy={0} r={Math.max(60, layout.radii[0] - 78)} fill="#ffffff" stroke="#E4E7EC" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {visibleNodes.map((p) => {
            const c = domainColour(p.domainId)
            const st = states.get(p.id) ?? 'idle'
            const s = markPx(p.kind) * worldPerPx
            return (
              <g key={p.id} className="map-node" data-state={st} data-node={p.id}>
                {p.kind === 'domain' ? (
                  <circle cx={p.x} cy={p.y} r={s * 1.2} fill={c.tint} />
                ) : (
                  <NodeMark kind={p.kind} x={p.x} y={p.y} s={s} colour={c.dot} />
                )}
              </g>
            )
          })}
          {selected && layout.byId.get(selected) && visibleKinds.has(layout.byId.get(selected)!.kind) && (() => {
            const p = layout.byId.get(selected)!
            const r = (p.kind === 'domain' ? 44 : markPx(p.kind) + 7) * worldPerPx
            return <circle cx={p.x} cy={p.y} r={r} fill="none" stroke={domainColour(p.domainId).dot} strokeWidth={2} vectorEffect="non-scaling-stroke" className="map-halo" data-selected-halo="" />
          })()}
        </g>
      </svg>

      {/* centre caption */}
      {inView(centre, -30) && (
        <div className="map-centre pointer-events-none absolute text-center" style={{ left: 0, top: 0, transform: `translate(${centre.x}px, ${centre.y}px) translate(-50%, -50%)` }} aria-hidden="true">
          <p className="text-[13px] font-bold leading-tight text-dga-green-deep">{countOf('domain', graph.domainIds.length, lang)}</p>
          <p className="mt-0.5 text-[11.5px] leading-tight text-dga-muted">{countOf('skill', graph.nodes.filter((n) => n.kind === 'skill').length, lang)}</p>
        </div>
      )}

      {/* labels (decorative copies of the button names) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {labels.map((l) => {
          const p = layout.byId.get(l.id)!
          const st = states.get(l.id) ?? 'idle'
          return (
            <span
              key={l.id}
              className="absolute left-0 top-0 font-medium"
              dir={rtl ? 'rtl' : 'ltr'}
              style={{
                transform: `translate(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px)`,
                width: l.w,
                height: l.h,
                fontSize: LABEL_METRICS.fontPx,
                lineHeight: `${LABEL_METRICS.lineHeight}px`,
                textAlign: l.side === 'right' ? 'left' : l.side === 'left' ? 'right' : 'center',
                color: st === 'idle' ? '#344054' : domainColour(p.domainId).ink,
              }}
            >
              <span className="map-label inline-block rounded-[5px] text-start" data-state={st} style={{ padding: `${LABEL_METRICS.padY}px ${LABEL_METRICS.padX}px` }}>
                {l.lines.map((line, i) => (
                  <span key={i} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </span>
            </span>
          )
        })}
      </div>

      {/* rings of real buttons: one tab stop per ring, arrows inside */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {rings.map((ids, ring) =>
          ids.length === 0 ? null : (
            <div key={ring} role="group" aria-label={ringLabel(ring)} data-ring={ring}>
              {ids.map((id) => {
                const p = layout.byId.get(id)!
                const s = screen(p)
                const st = states.get(id) ?? 'idle'
                const common = {
                  ref: roving.register(id),
                  type: 'button' as const,
                  tabIndex: roving.tabIndexOf(ring, id),
                  'aria-pressed': selected === id,
                  'data-node': id,
                  'data-state': st,
                  onClick: () => onSelect(id),
                  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => onNodeKeyDown(e, ring, id),
                  onFocus: () => onNodeFocus(ring, id),
                  onBlur: () => onHover(null),
                  onMouseEnter: () => onHover(id),
                  onMouseLeave: () => onHover(null),
                }
                if (p.kind === 'domain') {
                  const pill = pills.find((x) => x.p.id === id)!
                  const c = domainColour(p.domainId)
                  const on = st === 'active' || selected === id
                  return (
                    <button
                      key={id}
                      {...common}
                      aria-label={nodeName(p)}
                      dir={rtl ? 'rtl' : 'ltr'}
                      className="map-pill absolute left-0 top-0 rounded-pill border-2 font-semibold shadow-card"
                      data-on={on ? 'true' : 'false'}
                      style={{
                        pointerEvents: 'auto',
                        transform: `translate(${pill.s.x.toFixed(1)}px, ${pill.s.y.toFixed(1)}px) translate(-50%, -50%)`,
                        padding: `${PILL_METRICS.padY}px ${PILL_METRICS.padX}px`,
                        fontSize: PILL_METRICS.fontPx,
                        lineHeight: `${PILL_METRICS.lineHeight}px`,
                        borderColor: c.dot,
                        background: on ? c.ink : '#ffffff',
                        color: on ? '#ffffff' : c.ink,
                        width: 'max-content',
                      }}
                    >
                      {pill.lines.map((line, i) => (
                        <span key={i} className="block whitespace-nowrap text-center">
                          {line}
                        </span>
                      ))}
                    </button>
                  )
                }
                const hit = Math.max(18, Math.min(26, markPx(p.kind) * 2 + 10))
                return (
                  <button
                    key={id}
                    {...common}
                    aria-label={nodeName(p)}
                    className="map-hit absolute left-0 top-0 rounded-full"
                    style={{
                      pointerEvents: inView(s, 10) ? 'auto' : 'none',
                      width: hit,
                      height: hit,
                      transform: `translate(${(s.x - hit / 2).toFixed(1)}px, ${(s.y - hit / 2).toFixed(1)}px)`,
                    }}
                  />
                )
              })}
            </div>
          ),
        )}
      </div>

      {/* hover / focus readout, in the empty corner outside the disc */}
      {tip && (() => {
        const dom = graph.byId.get(`domain.${tip.domainId}`)
        return (
          <div
            className="map-tip pointer-events-none absolute start-3 top-3 z-20 w-60 rounded-btn border border-s-4 bg-white/95 px-3 py-2 text-xs shadow-card-lg"
            style={{ borderColor: domainColour(tip.domainId).dot }}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-hidden="true"
            data-map-readout=""
          >
            <p className="font-bold leading-snug text-dga-black">{t(tip.label)}</p>
            <p className="mt-0.5 text-dga-muted">
              {t(KIND_NAME[tip.kind].one)}
              {dom ? ` · ${t(dom.short ?? dom.label)}` : ''} · {countOf('link', graph.adjacency.get(tip.id)?.size ?? 0, lang)}
            </p>
            <p className="mt-0.5 font-semibold" style={{ color: domainColour(tip.domainId).ink }}>
              {t(MAP_COPY.clickToOpen)}
            </p>
          </div>
        )
      })()}

      {/* wheel hint */}
      <div className={`map-hint pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center ${hint ? '' : 'hidden'}`} aria-hidden="true">
        <p className="rounded-pill bg-dga-ink/90 px-4 py-1.5 text-xs text-white shadow-card">{t(MAP_COPY.wheelHint)}</p>
      </div>

      {/* zoom controls */}
      <div className="map-controls absolute bottom-3 end-3 z-30 flex flex-col items-stretch gap-1.5" data-map-control="">
        <ControlButton label={t(MAP_COPY.zoomIn)} onClick={() => zoomBy(ZOOM_STEP)} disabled={cam.k >= clampZoom(Infinity) - 0.01}>
          <path d="M12 5v14M5 12h14" />
        </ControlButton>
        <ControlButton label={t(MAP_COPY.zoomOut)} onClick={() => zoomBy(1 / ZOOM_STEP)} disabled={cam.k <= clampZoom(0) + 0.01}>
          <path d="M5 12h14" />
        </ControlButton>
        <button type="button" onClick={reset} className="rounded-btn border border-dga-line bg-white px-2 py-1.5 text-[11.5px] font-semibold text-dga-ink shadow-subtle hover:border-dga-green hover:text-dga-green-dark">
          {t(MAP_COPY.reset)}
        </button>
      </div>
    </div>
  )
}

function ControlButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-9 w-full place-items-center rounded-btn border border-dga-line bg-white text-dga-ink shadow-subtle hover:border-dga-green hover:text-dga-green-dark disabled:opacity-40"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}

/** Every visible edge, faint: the texture of the map. Re-renders only when the graph or the rings change. */
const BaseEdges = memo(function BaseEdges({ graph, layout, visibleKinds, dim }: { graph: SkillsGraph; layout: GraphLayout; visibleKinds: ReadonlySet<NodeKind>; dim: boolean }) {
  const paths = useMemo(
    () =>
      graph.edges
        .map((e) => {
          const a = layout.byId.get(e.source)
          const b = layout.byId.get(e.target)
          if (!a || !b || !visibleKinds.has(a.kind) || !visibleKinds.has(b.kind)) return null
          return <path key={e.id} d={edgePath(a, b)} vectorEffect="non-scaling-stroke" />
        })
        .filter(Boolean),
    [graph, layout, visibleKinds],
  )
  return (
    <g className="map-edges-base" data-dim={dim ? 'true' : 'false'} fill="none" stroke="#98A2B3" strokeWidth={0.8}>
      {paths}
    </g>
  )
})
