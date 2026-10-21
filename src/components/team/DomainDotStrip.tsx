import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { Bin, FiveNum } from '../../lib/team'
import { LEVEL_BANDS, moveFocus } from './teamUi'

/**
 * Per-domain distribution: a dot strip (identical values stacked, never labelled) over a box
 * summary (whiskers min–max, box Q1–Q3, median line) and the target as a dashed line, on the
 * 0–4 scale with the four level bands. Values grow toward the reading end (leftward in Arabic).
 * Each row is a button: hover, focus or click makes it the active domain; ↑ ↓ Home End move.
 * The SVG is decorative for assistive technology: each row carries a text description, and the
 * page renders an equivalent table.
 */

export interface StripRow {
  id: string
  label: string
  /** null: fewer answers than the gate in this layer */
  bins: Bin[] | null
  summary: FiveNum | null
  target: number
  /** spoken summary of the row (five numbers, count, target) */
  description: string
}

interface Props {
  rows: StripRow[]
  rtl: boolean
  active: string | null
  onActive: (id: string) => void
  /** the four level names, in order */
  levelNames: string[]
  insufficient: string
  /** id prefix for descriptions (unique per page) */
  idPrefix: string
}

const W = 420
const H = 46
const PAD = 12

export function stripX(v: number, rtl: boolean): number {
  const t = Math.max(0, Math.min(4, v)) / 4
  const span = W - 2 * PAD
  return rtl ? W - PAD - t * span : PAD + t * span
}

const BAND_FILL = ['#F9FAFB', '#F2F4F7', '#EAF6EF', '#DDF0E5']

function Bands({ rtl, height }: { rtl: boolean; height: number }) {
  return (
    <>
      {LEVEL_BANDS.map(([a, b], i) => {
        const x1 = stripX(a, rtl)
        const x2 = stripX(b, rtl)
        return <rect key={i} x={Math.min(x1, x2)} y={0} width={Math.abs(x2 - x1)} height={height} fill={BAND_FILL[i]} />
      })}
    </>
  )
}

function Dots({ bins, rtl }: { bins: Bin[]; rtl: boolean }) {
  const cy = H / 2
  const out: JSX.Element[] = []
  for (const b of bins) {
    if (b.count === 0) continue
    const half = Math.ceil((b.count - 1) / 2)
    const step = half === 0 ? 0 : Math.min(4.6, (H / 2 - 5) / half)
    for (let j = 0; j < b.count; j++) {
      const k = Math.ceil(j / 2) * (j % 2 === 1 ? -1 : 1)
      out.push(<circle key={`${b.value}-${j}`} cx={stripX(b.value, rtl)} cy={cy + k * step} r={2.9} fill="#1B8354" fillOpacity={0.82} stroke="#fff" strokeWidth={0.8} />)
    }
  }
  return <>{out}</>
}

function Box({ s, rtl }: { s: FiveNum; rtl: boolean }) {
  const cy = H / 2
  const xa = stripX(s.q1, rtl)
  const xb = stripX(s.q3, rtl)
  const xmin = stripX(s.min, rtl)
  const xmax = stripX(s.max, rtl)
  return (
    <g>
      <line x1={xmin} x2={xmax} y1={cy} y2={cy} stroke="#4D5761" strokeWidth={1.2} />
      <line x1={xmin} x2={xmin} y1={cy - 6} y2={cy + 6} stroke="#4D5761" strokeWidth={1.2} />
      <line x1={xmax} x2={xmax} y1={cy - 6} y2={cy + 6} stroke="#4D5761" strokeWidth={1.2} />
      <rect x={Math.min(xa, xb)} y={cy - 11} width={Math.max(1.5, Math.abs(xb - xa))} height={22} rx={3} fill="#1B8354" fillOpacity={0.1} stroke="#067647" strokeWidth={1.2} />
    </g>
  )
}

export default function DomainDotStrip({ rows, rtl, active, onActive, levelNames, insufficient, idPrefix }: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (moveFocus(listRef.current, e.currentTarget, e.key, '[data-strip-btn]')) e.preventDefault()
  }
  return (
    <div>
      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(7.5rem,11rem)_1fr]" aria-hidden="true">
        <span className="hidden sm:block" />
        {/* band names in HTML (legible at any width); the flex row follows the reading direction like stripX */}
        <div className="flex text-xs text-dga-muted" style={{ paddingInline: `${(PAD / W) * 100}%` }}>
          {LEVEL_BANDS.map(([a, b], i) => (
            <span key={i} className="truncate text-center" style={{ width: `${((b - a) / 4) * 100}%` }}>
              {levelNames[i]}
            </span>
          ))}
        </div>
      </div>
      <ul ref={listRef} className="mt-1 space-y-1">
        {rows.map((row) => {
          const isActive = active === row.id
          return (
            <li
              key={row.id}
              onMouseEnter={() => onActive(row.id)}
              className={`grid grid-cols-1 items-center gap-x-3 rounded-btn px-1 pb-1 transition-colors sm:grid-cols-[minmax(7.5rem,11rem)_1fr] sm:pb-0 ${isActive ? 'bg-dga-green/5 ring-1 ring-dga-green/40' : ''}`}
            >
              <button
                type="button"
                data-strip-btn
                aria-pressed={isActive}
                aria-describedby={`${idPrefix}-${row.id}`}
                onFocus={() => onActive(row.id)}
                onClick={() => onActive(row.id)}
                onKeyDown={onKey}
                className={`rounded-btn pt-1.5 text-start text-sm leading-snug sm:py-1.5 ${isActive ? 'font-semibold text-dga-green-ink' : 'text-dga-ink'} hover:text-dga-green-dark`}
              >
                {row.label}
              </button>
              <span id={`${idPrefix}-${row.id}`} className="sr-only">
                {row.description}
              </span>
              <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden="true" focusable="false">
                <Bands rtl={rtl} height={H} />
                {row.bins && row.summary ? (
                  <>
                    <Box s={row.summary} rtl={rtl} />
                    <Dots bins={row.bins} rtl={rtl} />
                    <line x1={stripX(row.summary.median, rtl)} x2={stripX(row.summary.median, rtl)} y1={H / 2 - 13} y2={H / 2 + 13} stroke="#074D31" strokeWidth={2.6} strokeLinecap="round" />
                  </>
                ) : (
                  <text x={W / 2} y={H / 2 + 4} textAnchor="middle" fontSize={11} fill="#4D5761">
                    {insufficient}
                  </text>
                )}
                <line x1={stripX(row.target, rtl)} x2={stripX(row.target, rtl)} y1={2} y2={H - 2} stroke="#DBA102" strokeWidth={2} strokeDasharray="4 3" />
              </svg>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
