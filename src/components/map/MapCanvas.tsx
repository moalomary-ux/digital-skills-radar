import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactElement, ReactNode } from 'react'
import type { L, Lang } from '../../data/types'
import {
  bandPath,
  clampZoom,
  DEFAULT_RADII,
  edgePath,
  fitScale,
  frameCamera,
  LABEL_METRICS,
  placeLabels,
  textWidth,
  truncateLabel,
  worldToScreen,
  wrapLabel,
  zoomAt,
} from '../../lib/skillsGraph'
import type { Camera, Focus, GraphLayout, LabelBox, LabelRequest, NodeKind, PositionedNode, SkillsGraph, Wedge } from '../../lib/skillsGraph'
import { usePrefersReducedMotion } from '../charts/media'
import { COMPARE_A, COMPARE_B, DIM_INK, domainColour } from './palette'
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
  /** cap the framing zoom (search results keep their surroundings in view) */
  maxK?: number
}

/** «إضاءة المجال» as the canvas sees it (layout blending happens in the explorer). */
export interface SpotlightView {
  domainId: string
  /** 0 = the whole map, 1 = the spotlight (animated in between) */
  t: number
  /** node ids inside the spotlight; the rest fade out */
  members: ReadonlySet<string>
  /** technologies beyond the chosen horizon: drawn as faint ghosts, without label or button */
  ghosts: ReadonlySet<string>
  /** the thin rim arcs of the other domains */
  rim: Wedge[]
}

/** «قارن دورين»: the two roles' targets per domain (1–4). */
export interface CompareView {
  a: Record<string, number>
  b: Record<string, number>
}

interface Props {
  graph: SkillsGraph
  /** the layout drawn now (blended during the spotlight animation) */
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
  onSelect: (id: string, opts?: { shift?: boolean }) => void
  onHover: (id: string | null) => void
  command: CameraCommand
  /** the eight domain wedges of the whole map */
  baseWedges: Wedge[]
  /** world radius that the visible rings of the whole map need */
  baseExtent: number
  spotlight?: SpotlightView | null
  compare?: CompareView | null
  /** «طريقي إلى هذا الدور»: skill node id → gap to the role's target */
  gaps?: ReadonlyMap<string, number> | null
  /** narrow screens: touch-first wheel; the stacked lists are the keyboard path */
  compact?: boolean
  /** coarse pointer (touch): wedges pick domains until the map is zoomed in */
  coarse?: boolean
  onSpotlight?: (domainId: string) => void
  onSkip?: () => void
  /** every ring is switched off */
  emptyRings?: boolean
  /** colour of the lit links: per domain, or the amber of «طريقي» */
  hlTone?: 'domain' | 'amber'
  /** reports the canvas height, so the side panel can end where the canvas ends */
  onHeight?: (height: number) => void
}

/** Node mark half-size in screen pixels. Outer rings are quieter than the skills (review P1-2). */
const MARK_PX: Record<NodeKind, number> = { domain: 30, skill: 6.4, role: 5, family: 5, tech: 4.2, sector: 4.8 }
/** Below this many pixels left in the first screen, the canvas sizes for the scrolled-to screen instead. */
const MIN_FIRST_SCREEN = 360

/** Label max width in screen pixels. */
const LABEL_W: Record<NodeKind, number> = { domain: 108, skill: 150, role: 150, family: 150, tech: 170, sector: 150 }
const PILL_METRICS = { fontPx: 12, lineHeight: 15, padX: 9, padY: 5 }
const PILL_BIG = { fontPx: 15, lineHeight: 19, padX: 14, padY: 8 }
const PILL_SMALL = { fontPx: 10.5, lineHeight: 13, padX: 7, padY: 4 }
/** World radius of the domain pills on narrow screens (between the skills and the technologies). */
const PILL_OUT_R = DEFAULT_RADII[2] - 10
const RADIAL_FONT = 11.5
const ZOOM_STEP = 1.35
const DRAG_THRESHOLD = 5
/** Pointer reach around a node, in screen pixels (review P2-10: at least a 40 px target). */
const HIT_FINE = 20
const HIT_COARSE = 22
/** On touch, single nodes become pickable once the map is zoomed in this far. */
const COARSE_NODE_ZOOM = 1.6
const LONG_PRESS_MS = 550
/** World radius of the white centre disc. */
const DISC = 127
/** «قارن دورين»: the rose grows outward from just beyond the domain pills to the roles ring. */
const ROSE_R0 = DEFAULT_RADII[0] + 40
const ROSE_R1 = DEFAULT_RADII[2] + 24

const LEVEL_NAMES: L[] = [
  { ar: 'وعي', en: 'Awareness' },
  { ar: 'تطبيق', en: 'Application' },
  { ar: 'إتقان', en: 'Proficiency' },
  { ar: 'ريادة', en: 'Leadership' },
]

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Text width in pixels: the canvas 2D measure once the web font is ready, the generous estimate otherwise (tests, SSR). */
function useTextMeasure(lang: Lang) {
  const [ver, setVer] = useState(0)
  useEffect(() => {
    const fonts = typeof document !== 'undefined' ? (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts : undefined
    let alive = true
    fonts?.ready?.then(() => alive && setVer((v) => v + 1)).catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])
  return useMemo(() => {
    void ver
    const jsdom = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)
    let ctx: CanvasRenderingContext2D | null = null
    if (!jsdom && typeof document !== 'undefined') {
      try {
        ctx = document.createElement('canvas').getContext('2d')
      } catch {
        ctx = null
      }
    }
    const cache = new Map<string, number>()
    return (text: string, fontPx: number, weight = 500): number => {
      if (!ctx) return textWidth(text, lang, fontPx)
      const key = `${weight}|${fontPx}|${text}`
      let w = cache.get(key)
      if (w === undefined) {
        ctx.font = `${weight} ${fontPx}px "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif`
        w = ctx.measureText(text).width
        cache.set(key, w)
      }
      return w
    }
  }, [lang, ver])
}

interface RadialLabel {
  id: string
  x: number
  y: number
  rotate: number
  anchor: 'start' | 'end'
  text: string
  colour: string
  dim: boolean
}

/**
 * The map canvas: one SVG holds every visual (wedges, links, marks, domain pills, labels), so it
 * scales as one picture in print (review P1-10). Over it, an HTML layer of real buttons — one tab
 * stop per ring — carries the keyboard path and the accessible names; pointer picking uses the
 * nearest node within reach, so the targets are larger than the marks (review P2-10).
 */
export default function MapCanvas(props: Props) {
  const { graph, layout, lang, t, visibleKinds, rings, states, focus, activeId, selected, hovered, litDomains, onSelect, onHover, command } = props
  const { baseWedges, baseExtent, spotlight = null, compare = null, gaps = null, compact = false, coarse = false, onSpotlight, onSkip, emptyRings = false, hlTone = 'domain', onHeight } = props
  const rtl = lang === 'ar'
  const reduced = usePrefersReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const measure = useTextMeasure(lang)
  const spotT = spotlight?.t ?? 0
  const spotOn = spotT >= 0.999

  /* ---------------------------------------------------------- size */
  const [width, setWidth] = useState(960)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measureBox = () => setWidth(el.clientWidth > 0 ? el.clientWidth : 960)
    measureBox()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measureBox)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const [viewport, setViewport] = useState(900)
  const [topInPage, setTopInPage] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(0)
  useEffect(() => {
    if (typeof window === 'undefined') return
    let alive = true
    const onResize = () => {
      if (!alive) return
      setViewport(window.innerHeight || 900)
      const el = wrapRef.current
      if (el) setTopInPage(el.getBoundingClientRect().top + (window.scrollY || 0))
      // the sticky site header covers the top of the screen once the page scrolls
      const header = document.querySelector<HTMLElement>('.site-header')
      setHeaderHeight(header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0)
    }
    onResize()
    // the web font can rewrap the headings above the canvas after the first measure
    document.fonts?.ready?.then(onResize, () => {})
    window.addEventListener('resize', onResize)
    return () => {
      alive = false
      window.removeEventListener('resize', onResize)
    }
  }, [])
  // P10b (review P1-11): min(72vh, 760 px) on wide screens, nor taller than the canvas is wide;
  // narrow screens get a square-ish wheel that leaves room for the lists below it. Measured on load
  // and resize only, so typing in the search never resizes the map.
  // P11: the canvas always fits the viewport, measured from where it sits: inside the first screen
  // when it starts there with room for a usable disc (/capabilities at 1024 × 768 used to overflow by
  // 114 px), otherwise in the screen below the sticky header once scrolled to.
  const firstScreen = viewport - topInPage - 16
  const fold = topInPage > 0 && firstScreen >= MIN_FIRST_SCREEN ? firstScreen : viewport - headerHeight - 24
  const height = compact
    ? Math.round(Math.max(300, Math.min(width, viewport * 0.62)))
    : Math.round(Math.max(Math.min(440, fold), Math.min(760, viewport * 0.72, fold, Math.max(width, 440))))

  useEffect(() => {
    onHeight?.(height)
  }, [height, onHeight])

  const visibleNodes = useMemo(
    () => layout.nodes.filter((p) => visibleKinds.has(p.kind) && (!spotOn || !spotlight || spotlight.members.has(p.id))),
    [layout, visibleKinds, spotOn, spotlight],
  )
  const extent = lerp(baseExtent, layout.extent + 20, spotT)
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

  // camera commands (story steps, reset, deep links, search results)
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
    const framed = frameCamera(pts, size)
    if (command.maxK && framed.k > command.maxK) {
      const f = command.maxK / framed.k
      return animateTo({ k: command.maxK, tx: framed.tx * f, ty: framed.ty * f })
    }
    animateTo(framed)
  }, [command, layout, size, animateTo, visibleKinds])

  const zoomBy = (factor: number) => animateTo(zoomAt(camRef.current, factor, width / 2, height / 2, size))
  const reset = () => animateTo({ k: 1, tx: 0, ty: 0 })

  /* --------------------------------------------------- projection */
  const screen = (p: { x: number; y: number }) => worldToScreen(p, cam, size)
  const markPx = (kind: NodeKind) => MARK_PX[kind] * Math.max(0.85, Math.min(1.6, Math.pow(cam.k, 0.35))) * (compact && kind !== 'domain' ? 0.85 : 1)
  const worldPerPx = 1 / (scale * cam.k)
  const centre = screen({ x: 0, y: 0 })
  const inView = (s: { x: number; y: number }, pad = 0) => s.x >= -pad && s.y >= -pad && s.x <= width + pad && s.y <= height + pad
  const hidden = (id: string) => !!spotlight && spotOn && !spotlight.members.has(id)
  const ghost = (id: string) => !!spotlight && spotlight.ghosts.has(id)

  /* ------------------------------------------------------- pills */
  const domainNodes = visibleNodes.filter((p) => p.kind === 'domain')
  const pills = domainNodes.map((p) => {
    // narrow screens: the pill sits further out on its wedge, where the wheel has room for eight
    // names; a small dot keeps the domain's true place for its links (review P1-9)
    const out = compact && spotT === 0
    const s = out ? screen({ x: PILL_OUT_R * Math.cos((p.angle * Math.PI) / 180), y: PILL_OUT_R * Math.sin((p.angle * Math.PI) / 180) }) : screen(p)
    const big = !!spotlight && p.domainId === spotlight.domainId && spotT > 0.5
    const m = big ? PILL_BIG : compact ? PILL_SMALL : PILL_METRICS
    const text = t(p.short ?? p.label)
    const lines = wrapLabel(text, lang, big ? 190 : compact ? 74 : LABEL_W.domain, 3, m).lines
    const w = Math.ceil(Math.max(...lines.map((l) => measure(l, m.fontPx, 600)))) + 2 * m.padX
    const h = lines.length * m.lineHeight + 2 * m.padY
    return { p, s, lines, m, big, box: { x: s.x - w / 2, y: s.y - h / 2, w, h } as LabelBox }
  })

  /* ------------------------------------------------- pointer picking */
  const local = (e: { clientX: number; clientY: number }) => {
    const r = wrapRef.current?.getBoundingClientRect()
    return { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) }
  }
  /** The node under a screen point: a domain pill, else the nearest node within reach, else the wedge's domain. */
  const pickAt = (x: number, y: number): string | null => {
    for (const pl of pills) {
      const b = pl.box
      if (x >= b.x - 4 && x <= b.x + b.w + 4 && y >= b.y - 4 && y <= b.y + b.h + 4) return pl.p.id
    }
    const allowNodes = !coarse || cam.k >= COARSE_NODE_ZOOM || spotOn
    if (allowNodes) {
      const reach = coarse ? HIT_COARSE : HIT_FINE
      let best: string | null = null
      let bestD = Infinity
      for (const ids of rings)
        for (const id of ids) {
          const p = layout.byId.get(id)
          if (!p || p.kind === 'domain') continue
          const s = screen(p)
          const d = Math.hypot(s.x - x, s.y - y)
          if (d <= reach + markPx(p.kind) && d < bestD) {
            bestD = d
            best = id
          }
        }
      if (best) return best
    }
    if (spotlight && spotT > 0) return null
    // a wedge picks its domain
    const wx = (x - width / 2 - cam.tx) / (scale * cam.k)
    const wy = (y - height / 2 - cam.ty) / (scale * cam.k)
    const r = Math.hypot(wx, wy)
    if (r < DISC || r > extent) return null
    const a = (Math.atan2(wy, wx) * 180) / Math.PI
    for (const w of baseWedges) {
      const rel = (((a - w.start) % 360) + 360) % 360
      if (rel <= w.end - w.start) {
        const id = `domain.${w.domainId}`
        return rings[0]?.includes(id) ? id : null
      }
    }
    return null
  }

  /* ------------------------------------------- pointer: drag, pinch */
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ x: number; y: number; cam: Camera; dist: number; mx: number; my: number } | null>(null)
  const dragged = useRef(false)
  const [engaged, setEngaged] = useState(false)
  const [hint, setHint] = useState(false)
  const [pointerOver, setPointerOver] = useState<string | null>(null)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (!pointers.current.has(e.pointerId) || !gesture.current) {
      // hover: the nearest node within reach (mouse only)
      if (e.pointerType === 'mouse' && !(e.target as HTMLElement).closest('[data-map-control]')) {
        const p = local(e)
        const id = pickAt(p.x, p.y)
        const node = id ? graph.byId.get(id) : undefined
        const hoverId = node && node.kind !== 'domain' ? id : null
        setPointerOver(id)
        if (hoverId !== hovered && (hoverId || (hovered && graph.byId.get(hovered)?.kind !== 'domain'))) onHover(hoverId)
      }
      return
    }
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
  const onCanvasClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-map-control]') || target.closest('[data-pill]')) return
    if (e.detail > 1) return // the second click of a double click
    const p = local(e)
    const id = pickAt(p.x, p.y)
    if (id) onSelect(id, { shift: e.shiftKey })
  }
  const onCanvasDoubleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-map-control]')) return
    const p = local(e)
    const id = pickAt(p.x, p.y)
    const node = id ? graph.byId.get(id) : undefined
    if (node?.kind === 'domain' && onSpotlight) onSpotlight(node.domainId)
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

  /* -------------------------------------------- keyboard (roving) */
  const roving = useRovingRings(rings, rtl, selected)
  const longPress = useRef<{ id: string; timer: ReturnType<typeof setTimeout> } | null>(null)
  const clearLongPress = () => {
    if (longPress.current) clearTimeout(longPress.current.timer)
    longPress.current = null
  }
  useEffect(() => clearLongPress, [])
  const onNodeKeyDown = (e: KeyboardEvent<HTMLElement>, ring: number, id: string) => {
    const node = graph.byId.get(id)
    if (e.key === 'Enter') {
      // holding Enter must not toggle the selection on every repeat
      if (e.repeat) return e.preventDefault()
      if (e.shiftKey && node?.kind === 'role') {
        e.preventDefault()
        onSelect(id, { shift: true })
        return
      }
      if (node?.kind === 'domain' && onSpotlight) {
        clearLongPress()
        longPress.current = { id, timer: setTimeout(() => onSpotlight(node.domainId), LONG_PRESS_MS) }
      }
    }
    roving.onKeyDown(e, ring, id)
  }
  const onNodeKeyUp = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') clearLongPress()
  }
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

  /* ------------------------------------------------------ tooltip */
  const tipNode = hovered && !compact ? layout.byId.get(hovered) : undefined
  const tip = tipNode && tipNode.kind !== 'domain' && visibleKinds.has(tipNode.kind) && !hidden(tipNode.id) ? tipNode : undefined
  const tipBox: LabelBox | null = tip ? (rtl ? { x: width - 252, y: 0, w: 252, h: 96 } : { x: 0, y: 0, w: 252, h: 96 }) : null

  /* ------------------------------------------------------- labels */
  const showAll = cam.k >= (compact ? 2.2 : 1.45)
  const matchesOn = [...states.values()].some((s) => s === 'match')
  const requests: LabelRequest[] = []
  const radialIds = new Set<string>()
  const radial: RadialLabel[] = []
  const outerPx = (spotT > 0.5 ? layout.extent - 6 : baseExtent - 30) * scale * cam.k

  const radialFor = (p: PositionedNode, st: NodeState) => {
    const s = screen(p)
    const dx = s.x - centre.x
    const dy = s.y - centre.y
    const dist = Math.hypot(dx, dy)
    if (dist < 1) return
    const ux = dx / dist
    const uy = dy / dist
    const gap = markPx(p.kind) + 5
    const ax = s.x + ux * gap
    const ay = s.y + uy * gap
    // run outward over the quiet outer rings (to the rim in the spotlight), never past the canvas edge
    let max = spotOn ? outerPx - dist - gap : 200
    const edge = (pos: number, u: number, lim: number) => (u > 1e-6 ? (lim - 6 - pos) / u : u < -1e-6 ? (6 - pos) / u : Infinity)
    max = Math.min(max, edge(ax, ux, width), edge(ay, uy, height))
    if (max < 30) return
    const right = ux >= -1e-6
    const angle = (Math.atan2(uy, ux) * 180) / Math.PI
    // a little headroom over the measure: the halo and font fallbacks must never push text past the edge
    const text = truncateLabel(t(p.label), lang, max, RADIAL_FONT, (x) => measure(x, RADIAL_FONT, 500) * 1.08 + 4)
    radialIds.add(p.id)
    radial.push({
      id: p.id,
      x: ax,
      y: ay,
      rotate: right ? angle : angle + 180,
      anchor: rtl ? (right ? 'end' : 'start') : right ? 'start' : 'end',
      text,
      colour: st === 'dim' ? DIM_INK : domainColour(p.domainId).ink,
      dim: st === 'dim',
    })
  }

  if (spotOn) {
    // every member carries a radial label (ghosts excepted)
    for (const p of visibleNodes) {
      if (p.kind === 'domain' || ghost(p.id)) continue
      radialFor(p, states.get(p.id) ?? 'idle')
    }
  } else if (spotT === 0 && !showAll && !focus && !matchesOn && !compare && !compact) {
    // the quiet first view: the forty skills are named (review P1-1); outer rings stay unlabelled
    const skills = visibleNodes.filter((p) => p.kind === 'skill')
    const spacing = skills.length > 1 ? ((2 * Math.PI) / skills.length) * DEFAULT_RADII[1] * scale * cam.k * 0.84 : 99
    if (spacing >= 14) for (const p of skills) radialFor(p, 'idle')
  }
  if (spotT === 0 || spotOn) {
    for (const p of visibleNodes) {
      if (p.kind === 'domain' || radialIds.has(p.id) || ghost(p.id)) continue
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
  }
  const controlsBox: LabelBox = rtl ? { x: 0, y: height - 160, w: 70, h: 160 } : { x: width - 70, y: height - 160, w: 70, h: 160 }
  const labels = placeLabels(requests, { width, height }, [...pills.map((x) => x.box), ...(compact ? [] : [controlsBox]), ...(tipBox ? [tipBox] : [])])

  /* --------------------------------------------------- rendering */
  const lit = (domainId: string) => (litDomains.size === 0 ? 'idle' : litDomains.has(domainId) ? 'on' : 'dim')
  const transform = `translate(${(width / 2 + cam.tx).toFixed(2)} ${(height / 2 + cam.ty).toFixed(2)}) scale(${(scale * cam.k).toFixed(5)})`
  const disc = lerp(DISC, 150, spotT)
  const hlColour = (a: string, b: string) => {
    if (hlTone === 'amber') return '#B98900'
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

  // the arcs of the spotlight groups, for their titles
  const groupTitles = spotOn
    ? [1, 2, 3, 4]
        .map((ring) => {
          const ids = layout.rings[ring] ?? []
          const pts = ids.map((id) => layout.byId.get(id)).filter((p): p is PositionedNode => !!p && visibleKinds.has(p.kind))
          if (pts.length === 0) return null
          const mid = pts[Math.floor((pts.length - 1) / 2)]
          const r = (layout.radii[1] ?? 300) * 0.66
          const a = (Math.atan2(mid.y, mid.x) * 180) / Math.PI
          const pos = screen({ x: r * Math.cos((a * Math.PI) / 180), y: r * Math.sin((a * Math.PI) / 180) })
          const kinds = [...new Set(pts.map((p) => p.kind))]
          return { ring, x: pos.x, y: pos.y, text: `${kinds.map((k) => t(KIND_NAME[k].many)).join(rtl ? ' و' : ' & ')} · ${pts.length}` }
        })
        .filter((x): x is { ring: number; x: number; y: number; text: string } => !!x)
    : []

  const aspect = `${width} / ${height}`

  const controls = (
    <div className={`map-controls z-30 flex items-stretch gap-1.5 ${compact ? 'mt-2 flex-row justify-end' : 'absolute bottom-3 end-3 flex-col'}`} data-map-control="">
      <ControlButton label={t(MAP_COPY.zoomIn)} onClick={() => zoomBy(ZOOM_STEP)} disabled={cam.k >= clampZoom(Infinity) - 0.01} compact={compact}>
        <path d="M12 5v14M5 12h14" />
      </ControlButton>
      <ControlButton label={t(MAP_COPY.zoomOut)} onClick={() => zoomBy(1 / ZOOM_STEP)} disabled={cam.k <= clampZoom(0) + 0.01} compact={compact}>
        <path d="M5 12h14" />
      </ControlButton>
      <button type="button" onClick={reset} className={`rounded-btn border border-dga-line bg-white px-2.5 text-[11.5px] font-semibold text-dga-ink shadow-subtle hover:border-dga-green hover:text-dga-green-dark ${compact ? 'min-h-11' : 'py-1.5'}`}>
        {t(MAP_COPY.reset)}
      </button>
    </div>
  )

  return (
    <>
    <div
      ref={wrapRef}
      className={`map-canvas relative select-none overflow-hidden rounded-card border border-dga-line bg-white shadow-card ${compact ? 'map-canvas-compact' : ''}`}
      style={{ height, touchAction: 'none', '--map-ar': aspect } as CSSProperties}
      data-engaged={engaged ? 'true' : 'false'}
      data-pointer={pointerOver ? 'node' : 'none'}
      data-spotlight={spotlight ? spotlight.domainId : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && pointers.current.size === 0) {
          setEngaged(false)
          setPointerOver(null)
          if (hovered && graph.byId.get(hovered)?.kind !== 'domain') onHover(null)
        }
      }}
      onClickCapture={onClickCapture}
      onClick={onCanvasClick}
      onDoubleClick={onCanvasDoubleClick}
    >
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="map-svg absolute inset-0 block h-full w-full" role="img" aria-label={t(MAP_COPY.svgLabel)} direction="ltr">
        <defs>
          <radialGradient id="map-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#1B8354" stopOpacity="0.07" />
            <stop offset="70%" stopColor="#1B8354" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#1B8354" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={transform}>
          <circle cx={0} cy={0} r={extent + 40} fill="url(#map-glow)" />
          {/* wedges (fade out in the spotlight) */}
          {!emptyRings && spotT < 1 && (
            <g opacity={1 - spotT}>
              {baseWedges.map((w) => (
                <path key={w.domainId} d={bandPath(DEFAULT_RADII[0] + 52, baseExtent + 8, w.start + 0.8, w.end - 0.8)} fill={domainColour(w.domainId).tint} className="map-wedge" data-state={lit(w.domainId)} />
              ))}
            </g>
          )}
          {/* the spotlight: the chosen domain fills the circle, the others wait on the rim */}
          {spotlight && spotT > 0 && (
            <g opacity={spotT} data-map-rim="">
              <circle cx={0} cy={0} r={layout.extent - 14} fill={domainColour(spotlight.domainId).tint} opacity={0.75} />
              {spotlight.rim.map((w) => (
                <path key={w.domainId} d={bandPath(layout.extent - 4, layout.extent + 6, w.start + 1.2, w.end - 1.2)} fill={domainColour(w.domainId).dot} opacity={0.7} />
              ))}
              <circle cx={0} cy={0} r={layout.radii[1] ?? 300} fill="none" stroke={domainColour(spotlight.domainId).dot} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
            </g>
          )}
          {/* ring guides of the whole map */}
          {spotT < 1 &&
            DEFAULT_RADII.slice(1).map((r, i) =>
              !spotlight && (rings[i + 1]?.length || visibleNodes.some((p) => p.ring === i + 1)) ? (
                <circle key={`${i}-${r}`} cx={0} cy={0} r={r} fill="none" stroke="#D0D5DD" strokeWidth={1} strokeDasharray="2 5" vectorEffect="non-scaling-stroke" opacity={1 - spotT} />
              ) : null,
            )}
          {compare && spotT === 0 && <CompareRose wedges={baseWedges} compare={compare} r0={ROSE_R0} r1={ROSE_R1} rtl={rtl} />}
          <BaseEdges graph={graph} layout={layout} visibleKinds={visibleKinds} dim={!!focus || matchesOn || !!compare} avoid={disc + 8} members={spotlight && spotT > 0 ? spotlight.members : null} spotT={spotT} />
          <circle cx={0} cy={0} r={disc} fill="#ffffff" stroke="#E4E7EC" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {/* lit links on top, routed around the centre disc (review P2-2) */}
          {focus && (
            <g className="map-edges-hl" key={[...focus.edges].slice(0, 3).join() + focus.edges.size}>
              {[...focus.edges].map((eid) => {
                const e = graph.edgeById.get(eid)!
                const a = layout.byId.get(e.source)
                const b = layout.byId.get(e.target)
                if (!a || !b || !visibleKinds.has(a.kind) || !visibleKinds.has(b.kind) || hidden(a.id) || hidden(b.id) || ghost(a.id) || ghost(b.id)) return null
                return <path key={eid} d={edgePath(a, b, 0.42, disc + 8)} fill="none" stroke={hlColour(e.source, e.target)} strokeWidth={1.8} strokeOpacity={0.88} vectorEffect="non-scaling-stroke" />
              })}
            </g>
          )}
          {/* «طريقي»: amber halos sized by the gap */}
          {gaps &&
            [...gaps.entries()].map(([id, gap], i) => {
              const p = layout.byId.get(id)
              if (!p || !visibleKinds.has(p.kind) || hidden(id)) return null
              const r = (markPx(p.kind) + 4 + gap * 4) * worldPerPx
              return <circle key={id} cx={p.x} cy={p.y} r={r} fill="#DBA102" fillOpacity={0.2} stroke="#B98900" strokeWidth={1.6} vectorEffect="non-scaling-stroke" className="map-gap" style={{ animationDelay: `${(i % 6) * 120}ms` }} data-gap={id} />
            })}
          {visibleNodes.map((p) => {
            if (p.kind === 'domain') {
              if (!compact || spotT > 0) return null
              const c = domainColour(p.domainId)
              return <circle key={p.id} cx={p.x} cy={p.y} r={5.5 * worldPerPx} fill={c.dot} className="map-node" data-state={states.get(p.id) ?? 'idle'} data-kind="domain" />
            }
            const c = domainColour(p.domainId)
            const st = states.get(p.id) ?? 'idle'
            const s = markPx(p.kind) * worldPerPx
            const fade = spotlight && spotT > 0 && !spotlight.members.has(p.id) ? 1 - spotT : undefined
            return (
              <g key={p.id} className="map-node" data-state={st} data-kind={p.kind} data-node={p.id} data-ghost={ghost(p.id) ? 'true' : undefined} opacity={fade}>
                <NodeMark kind={p.kind} x={p.x} y={p.y} s={s} colour={c.dot} />
              </g>
            )
          })}
          {selected && layout.byId.get(selected) && visibleKinds.has(layout.byId.get(selected)!.kind) && !hidden(selected) && (() => {
            const p = layout.byId.get(selected)!
            if (p.kind === 'domain') return null
            const r = (markPx(p.kind) + 7) * worldPerPx
            return <circle cx={p.x} cy={p.y} r={r} fill="none" stroke={domainColour(p.domainId).dot} strokeWidth={2} vectorEffect="non-scaling-stroke" className="map-halo" data-selected-halo="" />
          })()}
        </g>

        {/* screen-space layer: pills, labels, captions — same SVG, so print scales them together */}
        <g className="map-text">
          {spotOn &&
            groupTitles.map((g) => (
              <text key={g.ring} x={g.x} y={g.y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill="#344054" direction={rtl ? 'rtl' : 'ltr'} className="map-halo-text">
                {g.text}
              </text>
            ))}
          {compare && spotT === 0 && baseWedges.length > 1 &&
            [1, 2, 3, 4].map((k) => {
              // on the boundary between the first two wedges, so it never sits on a bar
              const a = ((baseWedges[0].end + (rtl ? -0 : 0)) * Math.PI) / 180
              const edgeA = rtl ? (baseWedges[0].start * Math.PI) / 180 : a
              const r = ROSE_R0 + (k / 4) * (ROSE_R1 - ROSE_R0)
              const pos = screen({ x: r * Math.cos(edgeA), y: r * Math.sin(edgeA) })
              return (
                <text key={k} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={10.5} fontWeight={600} fill="#344054" direction={rtl ? 'rtl' : 'ltr'} className="map-halo-text" data-rose-level={k}>
                  {t(LEVEL_NAMES[k - 1])}
                </text>
              )
            })}
          {radial.map((l) => (
            <text
              key={l.id}
              x={l.x}
              y={l.y}
              transform={`rotate(${l.rotate.toFixed(2)} ${l.x.toFixed(1)} ${l.y.toFixed(1)})`}
              textAnchor={l.anchor}
              dominantBaseline="central"
              fontSize={RADIAL_FONT}
              fontWeight={500}
              fill={l.colour}
              direction={rtl ? 'rtl' : 'ltr'}
              className="map-radial map-halo-text"
              data-label={l.id}
              data-dim={l.dim ? 'true' : undefined}
            >
              {l.text}
            </text>
          ))}
          {labels.map((l) => {
            const p = layout.byId.get(l.id)!
            const st = states.get(l.id) ?? 'idle'
            const c = domainColour(p.domainId)
            const m = LABEL_METRICS
            const tw = Math.ceil(Math.max(...l.lines.map((line) => measure(line, m.fontPx, st === 'active' ? 700 : 500))))
            const w = Math.min(l.w, tw + 2 * m.padX)
            const x = l.side === 'left' ? l.x + l.w - w : l.side === 'top' ? l.x + (l.w - w) / 2 : l.x
            const anchorX = x + w / 2
            return (
              <g key={l.id} className="map-label" data-state={st} data-label={l.id}>
                <rect x={x} y={l.y} width={w} height={l.h} rx={5} fill="#ffffff" fillOpacity={0.94} stroke={st === 'active' ? c.dot : '#E4E7EC'} strokeWidth={st === 'active' ? 1.4 : 1} />
                <text x={anchorX} y={l.y + m.padY} textAnchor="middle" fontSize={m.fontPx} fontWeight={st === 'active' ? 700 : 500} fill={st === 'idle' ? '#344054' : c.ink} direction={rtl ? 'rtl' : 'ltr'}>
                  {l.lines.map((line, i) => (
                    <tspan key={i} x={anchorX} dy={i === 0 ? m.lineHeight * 0.8 : m.lineHeight}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
          {pills.map((pl) => {
            const c = domainColour(pl.p.domainId)
            const st = states.get(pl.p.id) ?? 'idle'
            const on = st === 'active' || selected === pl.p.id
            const dim = st === 'dim' && !on
            const b = pl.box
            return (
              <g key={pl.p.id} className="map-pill-g" data-state={st} data-on={on ? 'true' : 'false'} opacity={spotlight && spotT > 0 && !spotlight.members.has(pl.p.id) ? 1 - spotT : undefined}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={b.h / 2} fill={on ? c.ink : '#ffffff'} stroke={dim ? '#D0D5DD' : c.dot} strokeWidth={pl.big ? 2.5 : 2} />
                <text x={b.x + b.w / 2} y={b.y + pl.m.padY} textAnchor="middle" fontSize={pl.m.fontPx} fontWeight={600} fill={on ? '#ffffff' : dim ? DIM_INK : c.ink} direction={rtl ? 'rtl' : 'ltr'}>
                  {pl.lines.map((line, i) => (
                    <tspan key={i} x={b.x + b.w / 2} dy={i === 0 ? pl.m.lineHeight * 0.8 : pl.m.lineHeight}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
          {spotT < 0.5 && inView(centre, -30) && !compare && !compact && (
            <g className="map-centre" aria-hidden="true">
              <text x={centre.x} y={centre.y - (emptyRings ? 0 : 8)} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#167248" direction={rtl ? 'rtl' : 'ltr'}>
                {countOf('domain', graph.domainIds.length, lang)}
              </text>
              {!emptyRings && visibleKinds.has('skill') && (
                <text x={centre.x} y={centre.y + 10} textAnchor="middle" dominantBaseline="central" fontSize={11.5} fill="#4D5761" direction={rtl ? 'rtl' : 'ltr'}>
                  {countOf('skill', graph.nodes.filter((n) => n.kind === 'skill').length, lang)}
                </text>
              )}
            </g>
          )}
        </g>
      </svg>

      {/* rings of real buttons: one tab stop per ring, arrows inside; pointer picking happens on the canvas */}
      <div className="map-buttons absolute inset-0" style={{ pointerEvents: 'none' }} aria-hidden={compact ? true : undefined}>
        {rings.map((ids, ring) =>
          ids.length === 0 ? null : (
            <div key={ring} role="group" aria-label={ringLabel(ring)} data-ring={ring}>
              {ids.map((id) => {
                const p = layout.byId.get(id)
                if (!p) return null
                const s = screen(p)
                const st = states.get(id) ?? 'idle'
                const common = {
                  ref: roving.register(id),
                  type: 'button' as const,
                  tabIndex: compact ? -1 : roving.tabIndexOf(ring, id),
                  'aria-pressed': selected === id,
                  'data-node': id,
                  'data-state': st,
                  onClick: (e: ReactMouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    if (e.detail > 1) return
                    onSelect(id, { shift: e.shiftKey })
                  },
                  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => onNodeKeyDown(e, ring, id),
                  onKeyUp: onNodeKeyUp,
                  onFocus: () => onNodeFocus(ring, id),
                  onBlur: () => {
                    clearLongPress()
                    onHover(null)
                  },
                  onMouseEnter: () => onHover(id),
                  onMouseLeave: () => onHover(null),
                }
                if (p.kind === 'domain') {
                  const pill = pills.find((x) => x.p.id === id)
                  if (!pill) return null
                  const on = st === 'active' || selected === id
                  const b = pill.box
                  const w = compact ? Math.max(44, b.w) : b.w
                  const h = compact ? Math.max(44, b.h) : b.h
                  return (
                    <button
                      key={id}
                      {...common}
                      aria-label={nodeName(p)}
                      className="map-pill absolute left-0 top-0"
                      data-pill=""
                      data-on={on ? 'true' : 'false'}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        onSpotlight?.(p.domainId)
                      }}
                      style={{
                        pointerEvents: compact ? 'none' : 'auto',
                        width: w,
                        height: h,
                        borderRadius: h / 2,
                        transform: `translate(${(b.x + b.w / 2 - w / 2).toFixed(1)}px, ${(b.y + b.h / 2 - h / 2).toFixed(1)}px)`,
                      }}
                    />
                  )
                }
                const hit = compact ? 44 : Math.max(22, Math.min(30, markPx(p.kind) * 2 + 12))
                return (
                  <button
                    key={id}
                    {...common}
                    aria-label={nodeName(p)}
                    className="map-hit absolute left-0 top-0 rounded-full"
                    style={{
                      pointerEvents: 'none',
                      visibility: inView(s, 10) ? undefined : 'hidden',
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

      {/* «انتقل إلى التفاصيل»: visible on keyboard focus only (review P2-13) */}
      {onSkip && !compact && (
        <button type="button" onClick={onSkip} className="map-skip sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-40 focus:rounded-btn focus:bg-dga-green focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white" data-map-control="">
          {t(MAP_COPY.skipToDetails)}
        </button>
      )}

      {emptyRings && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-6" data-map-empty="">
          <p className="max-w-sm rounded-btn border border-dga-line bg-white px-4 py-2 text-center text-sm text-dga-ink shadow-card">{t(MAP_COPY.ringsOff)}</p>
        </div>
      )}

      {/* hover / focus readout, in the corner outside the disc */}
      {tip && (() => {
        const dom = graph.byId.get(`domain.${tip.domainId}`)
        const linked = focus ? Math.max(0, focus.nodes.size - 1) : graph.adjacency.get(tip.id)?.size ?? 0
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
              {dom ? ` · ${t(dom.short ?? dom.label)}` : ''} · {countOf('linked', linked, lang)}
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

      {/* zoom controls (under the wheel on narrow screens, so they never cover a wedge) */}
      {!compact && controls}
    </div>
    {compact && controls}
    </>
  )
}

function ControlButton({ label, onClick, disabled, children, compact }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid place-items-center rounded-btn border border-dga-line bg-white text-dga-ink shadow-subtle hover:border-dga-green hover:text-dga-green-dark disabled:opacity-40 ${compact ? 'h-11 w-11' : 'h-9 w-full'}`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}

/**
 * «قارن دورين» drawn inside the map (P10b wow 2): every wedge splits in two halves — the first role
 * in green, the second in amber — each filled outward to that role's target level, over four
 * dashed level rings. A radar inside the map; the panel carries the same numbers as text.
 */
function CompareRose({ wedges, compare, r0, r1, rtl }: { wedges: Wedge[]; compare: CompareView; r0: number; r1: number; rtl: boolean }) {
  const r = (level: number) => r0 + (Math.max(0, Math.min(4, level)) / 4) * (r1 - r0)
  return (
    <g className="map-rose" data-map-compare="">
      {[1, 2, 3, 4].map((k) => (
        <circle key={k} cx={0} cy={0} r={r(k)} fill="none" stroke="#98A2B3" strokeWidth={1} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      ))}
      {wedges.map((w) => {
        const mid = (w.start + w.end) / 2
        // the first role takes the first half in reading order
        const [aStart, aEnd, bStart, bEnd] = rtl ? [mid, w.end - 1.5, w.start + 1.5, mid] : [w.start + 1.5, mid, mid, w.end - 1.5]
        const a = compare.a[w.domainId] ?? 0
        const b = compare.b[w.domainId] ?? 0
        return (
          <g key={w.domainId}>
            {a > 0 && <path d={bandPath(r0, r(a), aStart + 0.4, aEnd - 0.4)} fill={COMPARE_A} fillOpacity={0.34} stroke={COMPARE_A} strokeWidth={1.4} vectorEffect="non-scaling-stroke" data-rose="a" data-domain={w.domainId} data-level={a} />}
            {b > 0 && <path d={bandPath(r0, r(b), bStart + 0.4, bEnd - 0.4)} fill={COMPARE_B} fillOpacity={0.42} stroke="#8A6A00" strokeWidth={1.4} vectorEffect="non-scaling-stroke" data-rose="b" data-domain={w.domainId} data-level={b} />}
          </g>
        )
      })}
    </g>
  )
}

/**
 * Every visible edge, quiet: the texture of the map (review P1-2). Domain–skill links stay faintly
 * visible; every other link is very light until something lights it. In the spotlight, links that
 * leave it fade out with the nodes. Links are routed around the centre disc.
 */
const BaseEdges = memo(function BaseEdges({
  graph,
  layout,
  visibleKinds,
  dim,
  avoid,
  members,
  spotT,
}: {
  graph: SkillsGraph
  layout: GraphLayout
  visibleKinds: ReadonlySet<NodeKind>
  dim: boolean
  avoid: number
  members: ReadonlySet<string> | null
  spotT: number
}) {
  const groups = useMemo(() => {
    const core: ReactElement[] = []
    const rest: ReactElement[] = []
    const leaving: ReactElement[] = []
    for (const e of graph.edges) {
      const a = layout.byId.get(e.source)
      const b = layout.byId.get(e.target)
      if (!a || !b || !visibleKinds.has(a.kind) || !visibleKinds.has(b.kind)) continue
      const out = members && (!members.has(e.source) || !members.has(e.target))
      if (out && spotT >= 0.999) continue
      const el = <path key={e.id} d={edgePath(a, b, 0.42, avoid)} vectorEffect="non-scaling-stroke" />
      if (out) leaving.push(el)
      else if (e.kind === 'domain-skill') core.push(el)
      else rest.push(el)
    }
    return { core, rest, leaving }
  }, [graph, layout, visibleKinds, avoid, members, spotT])
  return (
    <g className="map-edges-base" data-dim={dim ? 'true' : 'false'} fill="none" stroke="#98A2B3" strokeWidth={0.8}>
      <g className="map-edges-core">{groups.core}</g>
      <g className="map-edges-rest">{groups.rest}</g>
      {groups.leaving.length > 0 && <g opacity={1 - spotT}>{groups.leaving}</g>}
    </g>
  )
})
