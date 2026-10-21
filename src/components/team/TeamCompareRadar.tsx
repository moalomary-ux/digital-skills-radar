import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './teamUi'

/**
 * Before/after team radar: the median polygon of each group, and a third polygon that moves
 * between them. The slider (keyboard: arrows, Page Up/Down, Home/End) sets the mix directly; the
 * two buttons glide to an end over 0.6 s, or jump there when reduced motion is requested.
 * The reference outlines fade with a CSS transition. The page renders the delta table as the
 * text equivalent.
 */

interface Props {
  labels: string[]
  before: number[]
  after: number[]
  rtl: boolean
  beforeLabel: string
  afterLabel: string
  sliderLabel: string
  /** accessible summary of the chart */
  caption: string
  /** spoken value of the slider */
  valueText: (afterShare: number) => string
}

const SIZE = 340
const C = SIZE / 2
const R = 100

function point(i: number, n: number, v: number, rtl: boolean) {
  const angle = ((-90 + (rtl ? -1 : 1) * i * (360 / n)) * Math.PI) / 180
  const r = (Math.max(0, Math.min(4, v)) / 4) * R
  return { x: C + r * Math.cos(angle), y: C + r * Math.sin(angle) }
}

const pts = (values: number[], rtl: boolean) =>
  values
    .map((v, i) => {
      const p = point(i, values.length, v, rtl)
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
    })
    .join(' ')

function wrap(text: string): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length > 12 && cur) {
      lines.push(cur)
      cur = w
    } else cur = next
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

export default function TeamCompareRadar({ labels, before, after, rtl, beforeLabel, afterLabel, sliderLabel, caption, valueText }: Props) {
  const [mix, setMix] = useState(100)
  const frame = useRef<number | null>(null)

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  const glideTo = (target: number) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
      setMix(target)
      return
    }
    const from = mix
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 600)
      const eased = 1 - Math.pow(1 - t, 3)
      setMix(Math.round(from + (target - from) * eased))
      frame.current = t < 1 ? requestAnimationFrame(step) : null
    }
    frame.current = requestAnimationFrame(step)
  }

  const current = before.map((b, i) => b + ((after[i] - b) * mix) / 100)
  const n = labels.length

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto block w-full max-w-[24rem]" role="img" aria-label={caption}>
        {[1, 2, 3, 4].map((ring) => (
          <polygon key={ring} points={pts(Array(n).fill(ring), rtl)} fill="none" stroke="#D2D6DB" strokeWidth={ring === 4 ? 1.2 : 0.8} />
        ))}
        {labels.map((_, i) => {
          const p = point(i, n, 4, rtl)
          return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke="#EAECF0" strokeWidth={0.8} />
        })}
        <polygon
          points={pts(before, rtl)}
          fill="none"
          stroke="#4D5761"
          strokeWidth={1.4}
          strokeDasharray="5 4"
          style={{ opacity: mix < 100 ? 0.95 : 0.55, transition: 'opacity 300ms ease' }}
        />
        <polygon points={pts(after, rtl)} fill="none" stroke="#067647" strokeWidth={1.4} style={{ opacity: mix > 0 ? 0.95 : 0.45, transition: 'opacity 300ms ease' }} />
        <polygon points={pts(current, rtl)} fill="#1B8354" fillOpacity={0.22} stroke="#1B8354" strokeWidth={2.2} strokeLinejoin="round" />
        {current.map((v, i) => {
          const p = point(i, n, v, rtl)
          return <circle key={i} cx={p.x} cy={p.y} r={3.2} fill="#1B8354" stroke="#fff" strokeWidth={1} />
        })}
        {labels.map((label, i) => {
          const p = point(i, n, 5.05, rtl)
          const lines = wrap(label)
          // with direction=rtl, «start» is the right edge: swap so labels always grow away from the centre
          const anchor = Math.abs(p.x - C) < 8 ? 'middle' : (p.x > C) === !rtl ? 'start' : 'end'
          return (
            <text key={label} x={p.x} y={p.y - (lines.length - 1) * 7} textAnchor={anchor} fontSize={12.5} fill="#212539" direction={rtl ? 'rtl' : 'ltr'}>
              {lines.map((l, k) => (
                <tspan key={k} x={p.x} dy={k === 0 ? 4 : 14}>
                  {l}
                </tspan>
              ))}
            </text>
          )
        })}
      </svg>
      <figcaption className="mt-3">
        <div className="flex items-center gap-3">
          <button type="button" className="btn-ghost px-3 py-1.5 text-sm" aria-pressed={mix === 0} onClick={() => glideTo(0)}>
            {beforeLabel}
          </button>
          <label className="flex-1">
            <span className="sr-only">{sliderLabel}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={mix}
              onChange={(e) => {
                if (frame.current !== null) cancelAnimationFrame(frame.current)
                frame.current = null
                setMix(Number(e.target.value))
              }}
              aria-valuetext={valueText(mix)}
              className="w-full accent-[#1B8354]"
              dir={rtl ? 'rtl' : 'ltr'}
            />
          </label>
          <button type="button" className="btn-ghost px-3 py-1.5 text-sm" aria-pressed={mix === 100} onClick={() => glideTo(100)}>
            {afterLabel}
          </button>
        </div>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-dga-muted" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5">
            <svg width="22" height="8">
              <line x1="0" y1="4" x2="22" y2="4" stroke="#4D5761" strokeWidth="1.6" strokeDasharray="5 4" />
            </svg>
            {beforeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="22" height="8">
              <line x1="0" y1="4" x2="22" y2="4" stroke="#067647" strokeWidth="1.6" />
            </svg>
            {afterLabel}
          </span>
        </p>
      </figcaption>
    </figure>
  )
}
