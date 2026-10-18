import { useMemo, useState } from 'react'
import type { Lang } from '../data/types'
import type { Horizon, Technology } from '../data/technologies'
import { horizonMeta, techClusters, trlZones } from '../data/technologies'

interface Props {
  technologies: Technology[]
  lang: Lang
  selectedId: string | null
  onSelect: (id: string) => void
  /** active filters — non-matching dots are dimmed */
  filterCluster: string | null
  filterHorizon: Horizon | null
  filterDomain: string | null
  animate?: boolean
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function wrapLabel(text: string, max = 16): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length > max && cur) {
      lines.push(cur)
      cur = w
    } else cur = candidate
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

export default function TechRadarChart({
  technologies,
  lang,
  selectedId,
  onSelect,
  filterCluster,
  filterHorizon,
  filterDomain,
  animate = true,
}: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const size = 720
  const cx = size / 2
  const cy = size / 2 + 4
  const R = 236
  const nClusters = techClusters.length
  const sectorDeg = 360 / nClusters
  const dir: 1 | -1 = lang === 'ar' ? -1 : 1

  const isDim = (tech: Technology) =>
    (filterCluster && tech.clusterId !== filterCluster) ||
    (filterHorizon && tech.horizon !== filterHorizon) ||
    (filterDomain && !tech.domainIds.includes(filterDomain))

  // position each dot: radial by TRL, angular slot inside its cluster sector
  const dots = useMemo(() => {
    const byCluster = new Map<string, Technology[]>()
    for (const t of technologies) {
      const arr = byCluster.get(t.clusterId) ?? []
      arr.push(t)
      byCluster.set(t.clusterId, arr)
    }
    const out: { tech: Technology; x: number; y: number }[] = []
    techClusters.forEach((cluster, ci) => {
      const list = (byCluster.get(cluster.id) ?? []).slice().sort((a, b) => a.trl - b.trl || a.id.localeCompare(b.id))
      const n = list.length
      list.forEach((tech, j) => {
        const frac = (j + 0.5) / n
        const angle = -90 + dir * (ci * sectorDeg + frac * sectorDeg)
        // alternate slight radial offsets to avoid dot collisions on equal TRLs
        const jitter = ((j % 3) - 1) * 7
        const r = (tech.trl / 9) * R + jitter
        out.push({ tech, ...polar(cx, cy, r, angle) })
      })
    })
    return out
  }, [technologies, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const hoverDot = hoverId ? dots.find((d) => d.tech.id === hoverId) : null
  const activeId = selectedId ?? hoverId

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full select-none" role="img" aria-label="technology radar">
      <defs>
        <radialGradient id="techGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#DBA102" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#DBA102" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={R * 1.18} fill="url(#techGlow)" />

      {/* TRL zone bands */}
      {trlZones.map((z, zi) => {
        const rOut = (z.to / 9) * R
        const rIn = ((z.from - 1) / 9) * R
        return (
          <g key={zi}>
            <circle cx={cx} cy={cy} r={rOut} fill={zi % 2 === 0 ? 'rgba(100,116,139,0.045)' : 'rgba(100,116,139,0.09)'} />
            {rIn > 0 && <circle cx={cx} cy={cy} r={rIn} fill="#ffffff" />}
          </g>
        )
      })}

      {/* TRL rings */}
      {Array.from({ length: 9 }, (_, i) => i + 1).map((trl) => (
        <circle
          key={trl}
          cx={cx}
          cy={cy}
          r={(trl / 9) * R}
          fill="none"
          stroke={trl === 9 ? 'rgba(100,116,139,0.4)' : 'rgba(100,116,139,0.16)'}
          strokeWidth={trl === 9 ? 1.4 : 0.8}
          strokeDasharray={trl === 9 ? 'none' : '2 5'}
        />
      ))}

      {/* TRL numbers on top spoke */}
      {Array.from({ length: 9 }, (_, i) => i + 1).map((trl) => (
        <text
          key={`tn-${trl}`}
          x={cx}
          y={cy - (trl / 9) * R + 3}
          textAnchor="middle"
          fontSize="9.5"
          fill="rgba(100,116,139,0.6)"
        >
          {trl}
        </text>
      ))}

      {/* sector dividers + labels */}
      {techClusters.map((cluster, ci) => {
        const boundaryAngle = -90 + dir * ci * sectorDeg
        const bp = polar(cx, cy, R + 6, boundaryAngle)
        const midAngle = -90 + dir * (ci + 0.5) * sectorDeg
        const lp = polar(cx, cy, R + 40, midAngle)
        const cos = Math.cos((midAngle * Math.PI) / 180)
        const sin = Math.sin((midAngle * Math.PI) / 180)
        const anchor: 'start' | 'middle' | 'end' = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
        const lines = wrapLabel(lang === 'ar' ? cluster.name.ar : cluster.name.en, lang === 'ar' ? 15 : 18)
        const isActive = filterCluster === cluster.id
        const clusterSelected = selectedId ? dots.find((d) => d.tech.id === selectedId)?.tech.clusterId === cluster.id : false
        return (
          <g key={cluster.id}>
            <line x1={cx} y1={cy} x2={bp.x} y2={bp.y} stroke="rgba(100,116,139,0.22)" strokeWidth="1" />
            <text
              x={lp.x}
              y={lp.y + (Math.abs(cos) < 0.25 ? (sin < 0 ? -6 : 12) : 4)}
              textAnchor={anchor}
              fontSize="12.5"
              fontWeight={isActive || clusterSelected ? 700 : 500}
              fill={isActive || clusterSelected ? '#067647' : '#212539'}
              className="cursor-pointer"
              onClick={() => onSelect(`cluster:${cluster.id}`)}
            >
              {lines.map((ln, li) => (
                <tspan key={li} x={lp.x} dy={li === 0 ? 0 : 14}>
                  {ln}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}

      {/* technology dots */}
      {dots.map(({ tech, x, y }, i) => {
        const dim = isDim(tech)
        const active = activeId === tech.id
        const chosen = selectedId === tech.id
        const color = horizonMeta[tech.horizon].color
        return (
          <g
            key={tech.id}
            className={animate ? 'radar-poly radar-animate' : undefined}
            style={animate ? { animationDelay: `${Math.min(i * 18, 700)}ms`, cursor: 'pointer' } : { cursor: 'pointer' }}
            onClick={() => onSelect(tech.id)}
            onMouseEnter={() => setHoverId(tech.id)}
            onMouseLeave={() => setHoverId(null)}
            opacity={dim ? 0.14 : 1}
          >
            {chosen && <circle cx={x} cy={y} r="13" fill="none" stroke={color} strokeWidth="1.6" strokeDasharray="3 3" />}
            <circle
              cx={x}
              cy={y}
              r={active ? 8.5 : 6.5}
              fill={color}
              fillOpacity={active ? 1 : 0.85}
              stroke="#ffffff"
              strokeWidth="2"
              style={{ transition: 'r 0.18s ease' }}
            />
            {/* generous hit area */}
            <circle cx={x} cy={y} r="16" fill="transparent" />
          </g>
        )
      })}

      {/* hover tooltip */}
      {hoverDot && !selectedId && (
        <g pointerEvents="none">
          {(() => {
            const name = lang === 'ar' ? hoverDot.tech.name.ar : hoverDot.tech.name.en
            const meta = `TRL ${hoverDot.tech.trl} · ${lang === 'ar' ? horizonMeta[hoverDot.tech.horizon].name.ar : horizonMeta[hoverDot.tech.horizon].name.en}`
            const w = Math.min(300, Math.max(150, name.length * 6.4))
            const bx = Math.max(8, Math.min(size - w - 8, hoverDot.x - w / 2))
            const by = hoverDot.y > cy ? Math.min(size - 58, hoverDot.y + 16) : Math.max(8, hoverDot.y - 58)
            return (
              <g>
                <rect x={bx} y={by} width={w} height={46} rx="10" fill="#ffffff" stroke="rgba(34,211,238,0.45)" />
                <text x={bx + w / 2} y={by + 19} textAnchor="middle" fontSize="12" fontWeight="600" fill="#161616">
                  {name.length > 42 ? name.slice(0, 40) + '…' : name}
                </text>
                <text x={bx + w / 2} y={by + 36} textAnchor="middle" fontSize="10.5" fill="#067647">
                  {meta}
                </text>
              </g>
            )
          })()}
        </g>
      )}
    </svg>
  )
}
