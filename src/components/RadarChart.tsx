import { useMemo, useState } from 'react'
import type { Lang, L } from '../data/types'

interface Props {
  /** axis labels in order */
  labels: L[]
  /** current values 0-4 */
  values: number[]
  /** target values 0-4 */
  targets: number[]
  /** optional previous-period values for comparison */
  previous?: number[]
  lang: Lang
  /** enable hover tooltip + vertex dots */
  interactive?: boolean
  /** play draw-in animation */
  animate?: boolean
  /** overall stage text shown in center */
  centerLabel?: string
  onHoverLabel?: (idx: number | null) => void
}

const N_SIDES_MAX_R = 4

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function polygonPoints(cx: number, cy: number, radius: number, values: number[], dir: 1 | -1) {
  const n = values.length
  return values
    .map((v, i) => {
      const angle = -90 + dir * i * (360 / n)
      const p = polar(cx, cy, (Math.max(0, Math.min(N_SIDES_MAX_R, v)) / N_SIDES_MAX_R) * radius, angle)
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    })
    .join(' ')
}

function wrapLabel(text: string): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length > 14 && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = candidate
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

export default function RadarChart({
  labels,
  values,
  targets,
  previous,
  lang,
  interactive = false,
  animate = false,
  centerLabel,
  onHoverLabel,
}: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const size = 620
  const cx = size / 2
  const cy = size / 2 + 6
  const R = 196
  const labelR = R + 34
  const n = labels.length
  const dir: 1 | -1 = lang === 'ar' ? -1 : 1

  const rings = [1, 2, 3, 4]

  const axes = useMemo(
    () =>
      labels.map((label, i) => {
        const angle = -90 + dir * i * (360 / n)
        const end = polar(cx, cy, R, angle)
        const lp = polar(cx, cy, labelR, angle)
        const cos = Math.cos((angle * Math.PI) / 180)
        const anchor: 'start' | 'middle' | 'end' = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
        return { label, angle, end, lp, anchor }
      }),
    [labels, lang] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const currentPts = polygonPoints(cx, cy, R, values, dir)
  const targetPts = polygonPoints(cx, cy, R, targets, dir)
  const prevPts = previous ? polygonPoints(cx, cy, R, previous, dir) : null

  const setHoverBoth = (idx: number | null) => {
    setHover(idx)
    onHoverLabel?.(idx)
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full select-none" role="img" aria-label="skills radar chart">
      <defs>
        <linearGradient id="gradCurrent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B8354" />
          <stop offset="100%" stopColor="#0E9F6E" />
        </linearGradient>
        <linearGradient id="gradTarget" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DBA102" />
          <stop offset="100%" stopColor="#F0B429" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0E9F6E" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0E9F6E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow */}
      <circle cx={cx} cy={cy} r={R * 1.15} fill="url(#centerGlow)" />

      {/* grid rings */}
      {rings.map((r) => (
        <polygon
          key={r}
          points={polygonPoints(cx, cy, R, Array(n).fill(r), dir)}
          fill={r === 4 ? 'rgba(100,116,139,0.04)' : 'none'}
          stroke="rgba(100,116,139,0.22)"
          strokeWidth={r === 4 ? 1.4 : 0.8}
          strokeDasharray={r === 4 ? 'none' : '3 5'}
        />
      ))}

      {/* ring number labels along the top spoke */}
      {rings.map((r) => (
        <text
          key={`rl-${r}`}
          x={cx}
          y={cy - (r / 4) * R - 4}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(100,116,139,0.65)"
        >
          {r}
        </text>
      ))}

      {/* spokes */}
      {axes.map((a, i) => (
        <line
          key={`sp-${i}`}
          x1={cx}
          y1={cy}
          x2={a.end.x}
          y2={a.end.y}
          stroke={hover === i ? 'rgba(34,211,238,0.55)' : 'rgba(100,116,139,0.18)'}
          strokeWidth={hover === i ? 1.6 : 1}
        />
      ))}

      {/* previous period polygon */}
      {prevPts && (
        <polygon
          points={prevPts}
          fill="none"
          stroke="rgba(100,116,139,0.6)"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          className={animate ? 'radar-poly radar-animate' : undefined}
        />
      )}

      {/* target polygon */}
      <polygon
        points={targetPts}
        fill="url(#gradTarget)"
        fillOpacity="0.14"
        stroke="url(#gradTarget)"
        strokeWidth="2"
        strokeLinejoin="round"
        className={animate ? 'radar-poly radar-animate-late' : undefined}
      />

      {/* current polygon */}
      <polygon
        points={currentPts}
        fill="url(#gradCurrent)"
        fillOpacity="0.28"
        stroke="url(#gradCurrent)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        className={animate ? 'radar-poly radar-animate' : undefined}
      />

      {/* vertex dots + hover targets */}
      {axes.map((a, i) => {
        const vAngle = a.angle
        const cp = polar(cx, cy, (values[i] / 4) * R, vAngle)
        const tp = polar(cx, cy, (targets[i] / 4) * R, vAngle)
        return (
          <g key={`vx-${i}`}>
            <circle cx={tp.x} cy={tp.y} r="3.4" fill="#DBA102" stroke="#ffffff" strokeWidth="1.4" />
            <circle cx={cp.x} cy={cp.y} r="4.2" fill="#0E9F6E" stroke="#ffffff" strokeWidth="1.6" />
            {interactive && (
              <circle
                cx={cp.x}
                cy={cp.y}
                r="18"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverBoth(i)}
                onMouseLeave={() => setHoverBoth(null)}
              />
            )}
          </g>
        )
      })}

      {/* axis labels */}
      {axes.map((a, i) => {
        const lines = wrapLabel(lang === 'ar' ? a.label.ar : a.label.en)
        const isTop = Math.abs(Math.cos((a.angle * Math.PI) / 180)) < 0.25
        const sin = Math.sin((a.angle * Math.PI) / 180)
        const baseY = a.lp.y + (isTop ? (sin < 0 ? -8 : 18) : 4)
        return (
          <text
            key={`lb-${i}`}
            x={a.lp.x}
            y={baseY}
            textAnchor={a.anchor}
            fontSize="13.5"
            fontWeight={hover === i ? 700 : 500}
            fill={hover === i ? '#067647' : '#212539'}
            className={interactive ? 'cursor-pointer' : undefined}
            onMouseEnter={interactive ? () => setHoverBoth(i) : undefined}
            onMouseLeave={interactive ? () => setHoverBoth(null) : undefined}
          >
            {lines.map((ln, li) => (
              <tspan key={li} x={a.lp.x} dy={li === 0 ? 0 : 15}>
                {ln}
              </tspan>
            ))}
          </text>
        )
      })}

      {/* hover readout near vertex */}
      {interactive && hover !== null && (
        <g pointerEvents="none">
          {(() => {
            const p = polar(cx, cy, (values[hover] / 4) * R, axes[hover].angle)
            const label = `${lang === 'ar' ? 'الحالي' : 'Current'} ${values[hover].toFixed(1)} · ${lang === 'ar' ? 'المستهدف' : 'Target'} ${targets[hover]}`
            const boxW = 150
            const bx = Math.max(8, Math.min(size - boxW - 8, p.x - boxW / 2))
            const by = p.y < cy ? Math.max(8, p.y - 46) : Math.min(size - 34, p.y + 16)
            return (
              <g>
                <rect x={bx} y={by} width={boxW} height={28} rx="8" fill="#ffffff" stroke="rgba(34,211,238,0.5)" />
                <text x={bx + boxW / 2} y={by + 18.5} textAnchor="middle" fontSize="11.5" fill="#067647" fontWeight="600">
                  {label}
                </text>
              </g>
            )
          })()}
        </g>
      )}

      {/* center label */}
      {centerLabel && (
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#4D5761">
          {centerLabel}
        </text>
      )}
    </svg>
  )
}
