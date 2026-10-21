import { useMemo, useRef, useState } from 'react'
import type { Lang, L } from '../data/types'
import { domains } from '../data/domains'
import {
  careerCategories,
  careerDomainWeights,
  careers,
  signalMeta,
  skillVocab,
} from '../data/careers'
import type { Career } from '../data/careers'

/**
 * Interactive radial network: domains (inner) ← sectors (middle) ← careers (outer).
 * Hand-built SVG, RTL-mirrored, transform/opacity-only hover transitions.
 */

export type Spotlight =
  | { kind: 'domain'; id: string }
  | { kind: 'sector'; id: string }
  | { kind: 'signal'; value: 'GROWING' | 'TRANSFORMING' | 'DECLINING' }
  | { kind: 'query'; ids: Set<string> }
  | null

interface Props {
  lang: Lang
  spotlight: Spotlight
  onSpotlightChange: (s: Spotlight) => void
  onCareerClick: (careerId: string) => void
  onDomainClick: (domainId: string) => void
  onSectorClick: (sectorId: string) => void
}

const SIZE = 1000
const CX = SIZE / 2
const CY = SIZE / 2
const R_DOMAIN = 165
const R_SECTOR = 315
const R_CAREER = 445

const signalColor: Record<string, string> = {
  GROWING: '#1B8354',
  TRANSFORMING: '#DBA102',
  DECLINING: '#B42318',
}

function polar(r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

interface MapNode {
  id: string
  kind: 'domain' | 'sector' | 'career'
  x: number
  y: number
  angle: number
  label: L
  career?: Career
  sectorCount?: number
}

interface MapEdge {
  id: string
  from: string // node id
  to: string
  kind: 'member' | 'skill'
  weight: number // 1-5 for skill edges
  careerId: string
  signal: string
  d: string
}

export default function NetworkMap({ lang, spotlight, onSpotlightChange, onCareerClick, onDomainClick, onSectorClick }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const dir: 1 | -1 = lang === 'ar' ? -1 : 1

  const { nodes, edges, nodeById, domainCareers } = useMemo(() => {
    const nodes: MapNode[] = []
    const edges: MapEdge[] = []

    // domains — inner ring
    domains.forEach((d, i) => {
      const angle = -90 + dir * i * (360 / domains.length)
      const p = polar(R_DOMAIN, angle)
      nodes.push({ id: `dom:${d.id}`, kind: 'domain', x: p.x, y: p.y, angle, label: d.shortName })
    })

    // sectors — middle ring; careers per sector
    const careersByCat = new Map<string, Career[]>()
    for (const c of careers) {
      const arr = careersByCat.get(c.category) ?? []
      arr.push(c)
      careersByCat.set(c.category, arr)
    }
    const nonEmptyCats = careerCategories.filter((cat) => (careersByCat.get(cat.id) ?? []).length > 0)
    const sectorAngle = new Map<string, number>()

    nonEmptyCats.forEach((cat, j) => {
      const angle = -90 + dir * (j + 0.5) * (360 / nonEmptyCats.length)
      sectorAngle.set(cat.id, angle)
      const p = polar(R_SECTOR, angle)
      nodes.push({ id: `sec:${cat.id}`, kind: 'sector', x: p.x, y: p.y, angle, label: cat.name, sectorCount: (careersByCat.get(cat.id) ?? []).length })
    })

    // careers — outer ring, clustered inside their sector's wedge
    nonEmptyCats.forEach((cat) => {
      const list = careersByCat.get(cat.id)!
      const baseAngle = sectorAngle.get(cat.id)!
      const wedge = (360 / nonEmptyCats.length) * 0.78
      list.forEach((c, k) => {
        const frac = list.length === 1 ? 0.5 : k / (list.length - 1)
        const angle = baseAngle + dir * (frac - 0.5) * wedge
        const p = polar(R_CAREER, angle)
        const cid = `car:${c.id}`
        nodes.push({ id: cid, kind: 'career', x: p.x, y: p.y, angle, label: c.name, career: c })

        // membership edge
        const s = sectorAngle.get(cat.id)!
        const sp = polar(R_SECTOR, s)
        edges.push({
          id: `${cid}->sec:${cat.id}`,
          from: cid,
          to: `sec:${cat.id}`,
          kind: 'member',
          weight: 1,
          careerId: c.id,
          signal: c.signal,
          d: `M ${p.x} ${p.y} L ${sp.x} ${sp.y}`,
        })

        // skill edges (curved toward center)
        const weights = careerDomainWeights(c)
        weights.forEach((w, domId) => {
          const di = domains.findIndex((d) => d.id === domId)
          if (di < 0) return
          const dp = polar(R_DOMAIN, -90 + dir * di * (360 / domains.length))
          const mid = { x: (p.x + dp.x) / 2, y: (p.y + dp.y) / 2 }
          // pull the control point toward the center for the layered look
          const ctrl = { x: CX + (mid.x - CX) * 0.55, y: CY + (mid.y - CY) * 0.55 }
          edges.push({
            id: `${cid}->dom:${domId}`,
            from: cid,
            to: `dom:${domId}`,
            kind: 'skill',
            weight: w,
            careerId: c.id,
            signal: c.signal,
            d: `M ${p.x} ${p.y} Q ${ctrl.x} ${ctrl.y} ${dp.x} ${dp.y}`,
          })
        })
      })
    })

    const nodeById = new Map(nodes.map((n) => [n.id, n]))
    const domainCareers = new Map<string, string[]>() // domId → career node ids
    for (const e of edges) {
      if (e.kind !== 'skill') continue
      const domId = e.to.slice(4)
      const arr = domainCareers.get(domId) ?? []
      if (!arr.includes(e.from)) arr.push(e.from)
      domainCareers.set(domId, arr)
    }
    return { nodes, edges, nodeById, domainCareers }
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── highlight computation ──
  const lit = useMemo(() => {
    const litNodes = new Set<string>()
    const litEdges = new Set<string>()

    if (hoverId) {
      const n = nodeById.get(hoverId)
      if (n) {
        litNodes.add(hoverId)
        if (n.kind === 'career') {
          for (const e of edges) {
            if (e.from === hoverId) {
              litEdges.add(e.id)
              litNodes.add(e.to)
            }
          }
        } else if (n.kind === 'sector') {
          for (const e of edges) {
            if (e.kind === 'member' && e.to === hoverId) {
              litEdges.add(e.id)
              litNodes.add(e.from)
            }
          }
        } else {
          for (const e of edges) {
            if (e.kind === 'skill' && e.to === hoverId) {
              litEdges.add(e.id)
              litNodes.add(e.from)
            }
          }
        }
      }
      return { litNodes, litEdges, active: true }
    }

    if (spotlight) {
      if (spotlight.kind === 'domain') {
        const to = `dom:${spotlight.id}`
        litNodes.add(to)
        for (const e of edges) {
          if (e.kind === 'skill' && e.to === to) {
            litEdges.add(e.id)
            litNodes.add(e.from)
          }
        }
      } else if (spotlight.kind === 'sector') {
        const to = `sec:${spotlight.id}`
        litNodes.add(to)
        for (const e of edges) {
          if (e.kind === 'member' && e.to === to) {
            litEdges.add(e.id)
            litNodes.add(e.from)
          }
        }
      } else if (spotlight.kind === 'signal') {
        for (const e of edges) {
          if (e.signal === spotlight.value) {
            litEdges.add(e.id)
            litNodes.add(e.from)
            litNodes.add(e.to)
          }
        }
      } else if (spotlight.kind === 'query') {
        spotlight.ids.forEach((id) => litNodes.add(`car:${id}`))
        for (const e of edges) {
          if (spotlight.ids.has(e.careerId)) {
            litEdges.add(e.id)
            litNodes.add(e.to)
          }
        }
      }
      return { litNodes, litEdges, active: true }
    }

    return { litNodes, litEdges, active: false }
  }, [hoverId, spotlight, edges, nodeById])

  const nodeOpacity = (id: string) => (!lit.active || lit.litNodes.has(id) ? 1 : 0.15)
  const edgeOpacity = (id: string) => (!lit.active ? 0.34 : lit.litEdges.has(id) ? 1 : 0.05)

  const handleMove = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const hoverNode = hoverId ? nodeById.get(hoverId) : null

  const tooltipContent = (n: MapNode): { title: string; lines: string[] } | null => {
    if (n.kind === 'career' && n.career) {
      const c = n.career
      const skills = c.keySkills.slice(0, 3).map((k) => (lang === 'ar' ? skillVocab[k].name.ar : skillVocab[k].name.en))
      return {
        title: lang === 'ar' ? c.name.ar : c.name.en,
        lines: [
          lang === 'ar' ? signalMeta[c.signal].name.ar : signalMeta[c.signal].name.en,
          skills.join(' · '),
          (lang === 'ar' ? c.verdict.ar : c.verdict.en).slice(0, 90) + '…',
        ],
      }
    }
    if (n.kind === 'sector') {
      return {
        title: lang === 'ar' ? n.label.ar : n.label.en,
        lines: [lang === 'ar' ? `${n.sectorCount} مهنة في هذا القطاع` : `${n.sectorCount} careers in this sector`],
      }
    }
    const domId = n.id.slice(4)
    const count = domainCareers.get(domId)?.length ?? 0
    return {
      title: lang === 'ar' ? n.label.ar : n.label.en,
      lines: [lang === 'ar' ? `مرتبط بـ ${count} مهنة` : `Linked to ${count} careers`],
    }
  }

  const tipData = hoverNode ? tooltipContent(hoverNode) : null

  return (
    <div ref={wrapRef} className="relative" onPointerMove={handleMove}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full select-none" role="img" aria-label="interactive skills-careers map">
        <defs>
          <radialGradient id="mapGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#1B8354" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1B8354" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={R_CAREER + 30} fill="url(#mapGlow)" />
        {/* guide rings */}
        {[R_DOMAIN, R_SECTOR, R_CAREER].map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="rgba(100,116,139,0.18)" strokeDasharray="2 6" />
        ))}

        {/* edges */}
        <g>
          {edges.map((e, i) => (
            <path
              key={e.id}
              d={e.d}
              fill="none"
              stroke={signalColor[e.signal]}
              strokeWidth={e.kind === 'member' ? 1.1 : 0.6 + e.weight * 0.55}
              strokeLinecap="round"
              className="map-intro-edge"
              style={{
                opacity: edgeOpacity(e.id),
                transition: 'opacity 0.25s ease, stroke-width 0.25s ease',
                animationDelay: `${Math.min(i * 4, 900)}ms`,
              }}
            />
          ))}
        </g>

        {/* nodes */}
        {nodes.map((n, i) => {
          const isLit = !lit.active || lit.litNodes.has(n.id)
          const isHover = hoverId === n.id
          const r = n.kind === 'domain' ? 26 : n.kind === 'sector' ? 13 : 6.5
          const fill =
            n.kind === 'domain' ? '#1B8354' : n.kind === 'sector' ? '#ffffff' : n.career ? signalColor[n.career.signal] : '#94a3b8'
          const stroke = n.kind === 'sector' ? '#1B8354' : n.kind === 'domain' ? '#074D31' : '#ffffff'
          return (
            <g
              key={n.id}
              className="map-intro-node cursor-pointer"
              style={{
                opacity: nodeOpacity(n.id),
                transition: 'opacity 0.25s ease',
                animationDelay: `${Math.min(i * 12, 1100)}ms`,
              }}
              transform={`translate(${n.x} ${n.y})`}
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => {
                if (n.kind === 'career' && n.career) onCareerClick(n.career.id)
                else if (n.kind === 'domain') onDomainClick(n.id.slice(4))
                else onSectorClick(n.id.slice(4))
              }}
            >
              <circle
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={n.kind === 'sector' ? 2 : 1.4}
                style={{
                  transform: isHover ? 'scale(1.35)' : 'scale(1)',
                  transformOrigin: 'center',
                  transformBox: 'fill-box',
                  transition: 'transform 0.18s ease',
                }}
              />
              {/* generous hit area */}
              <circle r={n.kind === 'career' ? 16 : Math.max(r + 8, 24)} fill="transparent" />
              {/* labels: domains & sectors always; careers only when lit under spotlight/hover */}
              {(n.kind !== 'career' || (lit.active && isLit)) && (
                <text
                  y={n.kind === 'domain' ? r + 16 : n.kind === 'sector' ? r + 15 : 16}
                  textAnchor="middle"
                  fontSize={n.kind === 'domain' ? 15 : n.kind === 'sector' ? 12 : 10.5}
                  fontWeight={isHover ? 700 : n.kind === 'career' ? 400 : 600}
                  fill={n.kind === 'domain' ? '#074D31' : n.kind === 'sector' ? '#212539' : '#4D5761'}
                  style={{ pointerEvents: 'none' }}
                >
                  {lang === 'ar' ? n.label.ar : n.label.en}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* floating tooltip — follows the mouse, transform-only */}
      {tipData && tip && (
        <div
          className="pointer-events-none absolute z-20 w-64 rounded-card border border-dga-line bg-white p-3.5 shadow-card-lg"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${Math.min(tip.x + 16, (wrapRef.current?.clientWidth ?? 600) - 270)}px, ${Math.max(tip.y - 20, 8)}px)`,
          }}
        >
          <p className="text-sm font-bold text-dga-black">{tipData.title}</p>
          {tipData.lines.map((ln, i) => (
            <p key={i} className={`mt-1 text-[11.5px] leading-snug ${i === 0 ? 'font-semibold text-dga-green-dark' : 'text-dga-muted'}`}>
              {ln}
            </p>
          ))}
          {hoverNode?.kind === 'career' && (
            <p className="mt-1.5 text-[10.5px] font-semibold text-dga-green-dark">
              {lang === 'ar' ? 'انقر للبطاقة الكاملة ←' : 'Click for the full card →'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
