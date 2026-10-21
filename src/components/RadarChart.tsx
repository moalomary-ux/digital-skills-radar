import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import type { Lang, L } from '../data/types'
import { bdi, countPhrase, formatNumber } from '../lib/format'
import { RADAR_LAYERS, RADAR_LAYER_ORDER, RADAR_LAYER_READING_ORDER, RadarLayerSwatch, RadarMarker } from './charts/radarLayers'
import type { RadarLayerKey } from './charts/radarLayers'
import VisuallyHiddenTable from './charts/VisuallyHiddenTable'
import { useChartLabels } from './charts/useChartLabels'
import { rovingIndex } from './charts/keyboard'
import { usePrefersReducedMotion } from './charts/media'

export type { RadarLayerKey }
export { RADAR_LAYERS, RadarLayerSwatch }

interface Props {
  /** axis labels in order */
  labels: L[]
  /** self-rating values 0-4 (the «self» layer) */
  values: number[]
  /** target values 0-4 (the «target» layer) */
  targets: number[]
  /** previous-assessment values 0-4 (the «previous» layer) */
  previous?: number[]
  /** judgment-scenario values 0-4 (the «scenario» layer) */
  judgment?: number[]
  /** knowledge-check values 0-4 per axis; `null` = not judged (the «knowledge» layer, markers only) */
  knowledge?: (number | null)[]
  /** stable axis ids (domain ids) used by `onAxisSelect` / `selectedAxis`; default: the index */
  ids?: string[]
  /** per-layer visibility (default: every layer that has data is shown) */
  layers?: Partial<Record<RadarLayerKey, boolean>>
  lang: Lang
  /** hover/focus readout and focusable axes (implied by `onAxisSelect` / `onAxisClick`) */
  interactive?: boolean
  /** called when an axis is chosen by click, Enter or Space (index into labels) */
  onAxisClick?: (idx: number) => void
  /** called with the axis id when an axis is chosen by click, Enter or Space */
  onAxisSelect?: (id: string) => void
  /** id of the highlighted axis (`aria-pressed`) */
  selectedAxis?: string | null
  /** play draw-in animation */
  animate?: boolean
  /** overall stage text shown in center */
  centerLabel?: string
  /** hover or keyboard focus moved onto an axis (`null` when it leaves) */
  onHoverLabel?: (idx: number | null) => void
  /** accessible name of the chart (default: a bilingual title) */
  ariaLabel?: string
  /** show the data table on screen (it is always present for assistive technology) */
  showTable?: boolean
  /** render a bilingual legend under the chart for the visible layers */
  legend?: boolean
}

/* geometry (viewBox units). Labels sit outside ring 4; the box leaves them room on every side. */
const W = 680
const H = 544
const CX = 340
const CY = 272
const R = 190
const LABEL_R = R + 20
const FS = 15
const MAX = 4
const BOX = { w: W, h: H, fontSize: FS, pad: 6, centreFrac: 0.42 }

const ui = {
  title: { ar: 'رادار المهارات الرقمية', en: 'Digital skills radar' },
  scale: { ar: 'على مقياس من 0 إلى 4', en: 'on a 0–4 scale' },
  axes: { ar: 'مجالات الرادار: استخدم الأسهم للتنقل وEnter للاختيار', en: 'Radar domains: use the arrow keys to move and Enter to choose' },
  domain: { ar: 'المجال', en: 'Domain' },
  caption: { ar: 'قيم الرادار لكل مجال على مقياس من 0 إلى 4', en: 'Radar values per domain on a 0–4 scale' },
  none: { ar: 'لا قيمة', en: 'no value' },
} satisfies Record<string, L>

const clamp = (v: number) => Math.max(0, Math.min(MAX, Number.isFinite(v) ? v : 0))

function polar(r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function points(values: number[], angles: number[]) {
  return values
    .map((v, i) => {
      const p = polar((clamp(v) / MAX) * R, angles[i])
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    })
    .join(' ')
}

const fmt = (v: number | null | undefined, lang: Lang) => (v === null || v === undefined || !Number.isFinite(v) ? null : formatNumber(v, lang, { decimals: 1 }))

export default function RadarChart({
  labels,
  values,
  targets,
  previous,
  judgment,
  knowledge,
  ids,
  layers,
  lang,
  interactive = false,
  animate = false,
  centerLabel,
  onHoverLabel,
  onAxisClick,
  onAxisSelect,
  selectedAxis = null,
  ariaLabel,
  showTable = false,
  legend = false,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState<number | null>(null)
  const n = labels.length
  const rtl = lang === 'ar'
  const dir: 1 | -1 = rtl ? -1 : 1
  const axisIds = useMemo(() => labels.map((_, i) => ids?.[i] ?? String(i)), [labels, ids])
  const selectedIdx = selectedAxis === null ? -1 : axisIds.indexOf(selectedAxis)
  const isInteractive = interactive || !!onAxisSelect || !!onAxisClick
  const [focusIdx, setFocusIdx] = useState(Math.max(0, selectedIdx))
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    // follow an external selection unless the keyboard is currently inside the axes
    if (selectedIdx >= 0 && !buttons.current.some((b) => b && b === document.activeElement)) setFocusIdx(selectedIdx)
  }, [selectedIdx])

  const axisLabels = useChartLabels(labels, lang, { cx: CX, cy: CY, r: LABEL_R, box: BOX })
  const angles = axisLabels.map((a) => a.angle)

  /* layers that have data, and whether each is shown */
  const data: Partial<Record<RadarLayerKey, (number | null)[]>> = {
    self: values,
    target: targets,
    ...(judgment ? { scenario: judgment } : {}),
    ...(knowledge && knowledge.some((v) => v !== null && v !== undefined) ? { knowledge } : {}),
    ...(previous ? { previous } : {}),
  }
  const present = RADAR_LAYER_READING_ORDER.filter((k) => data[k])
  const shown = (k: RadarLayerKey) => !!data[k] && layers?.[k] !== false
  const visibleLayers = present.filter(shown)

  const layerStyle = (visible: boolean): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.92)',
    transformOrigin: `${CX}px ${CY}px`,
    transformBox: 'view-box',
    transition: reduced ? 'none' : 'opacity 280ms ease, transform 280ms ease',
  })

  /* text: accessible name, description, per-axis names */
  const axisText = (i: number, keys: RadarLayerKey[]) =>
    keys
      .map((k) => {
        const v = fmt(data[k]?.[i], lang)
        return `${RADAR_LAYERS[k].label[lang]} ${v ?? ui.none[lang]}`
      })
      .join(rtl ? '، ' : ', ')
  const title =
    ariaLabel ??
    `${ui.title[lang]}: ${countPhrase(n, lang, { one: 'مجال واحد', two: 'مجالان', few: 'مجالات', many: 'مجالًا' }, ['domain', 'domains'])} ${ui.scale[lang]}`
  const description = labels.map((l, i) => `${l[lang]}: ${axisText(i, visibleLayers)}`).join(rtl ? '؛ ' : '; ')

  /* interaction */
  const setHoverBoth = (idx: number | null) => {
    setHover(idx)
    onHoverLabel?.(idx)
  }
  const choose = (i: number) => {
    setFocusIdx(i)
    onAxisClick?.(i)
    onAxisSelect?.(axisIds[i])
  }
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'Escape') {
      setHoverBoth(null)
      return
    }
    const next = rovingIndex(e.key, i, n, rtl)
    if (next === null) return
    e.preventDefault()
    setFocusIdx(next)
    buttons.current[next]?.focus()
  }

  const active = hover ?? (selectedIdx >= 0 ? selectedIdx : null)
  const readoutIdx = isInteractive ? hover : null

  const ringNumbers = [1, 2, 3, 4]
  const vertex = (k: RadarLayerKey, i: number) => {
    const v = data[k]?.[i]
    if (v === null || v === undefined || !Number.isFinite(v)) return null
    return polar((clamp(v) / MAX) * R, angles[i])
  }

  return (
    <div className="radar-chart w-full" style={{ containerType: 'inline-size' } as CSSProperties} data-radar="">
      {/* the chart box: SVG + label overlay share exactly the same rectangle */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full select-none"
          role="img"
          aria-label={title}
          aria-describedby={`${uid}-desc`}
          direction="ltr"
        >
          <defs>
            <linearGradient id={`${uid}-self`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1B8354" />
              <stop offset="100%" stopColor="#0E9F6E" />
            </linearGradient>
            <linearGradient id={`${uid}-target`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DBA102" />
              <stop offset="100%" stopColor="#F0B429" />
            </linearGradient>
            <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#0E9F6E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0E9F6E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ambient glow */}
          <circle cx={CX} cy={CY} r={R * 1.12} fill={`url(#${uid}-glow)`} />

          {/* grid rings */}
          {ringNumbers.map((r) => (
            <polygon
              key={r}
              points={points(Array(n).fill(r), angles)}
              fill={r === 4 ? 'rgba(100,116,139,0.04)' : 'none'}
              stroke="rgba(100,116,139,0.22)"
              strokeWidth={r === 4 ? 1.4 : 0.8}
              strokeDasharray={r === 4 ? 'none' : '3 5'}
            />
          ))}

          {/* ring numbers in the wedge after the first axis (never under a layer marker) */}
          {ringNumbers.map((r) => {
            const half = 180 / Math.max(n, 3)
            const p = polar((r / MAX) * R * Math.cos((half * Math.PI) / 180) - 7, -90 + dir * half)
            return (
              <text key={`rl-${r}`} x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="10.5" fill="rgba(77,87,97,0.8)">
                {formatNumber(r, lang)}
              </text>
            )
          })}

          {/* spokes */}
          {angles.map((angle, i) => {
            const end = polar(R, angle)
            const isSel = i === selectedIdx
            const isHover = i === hover
            return (
              <line
                key={`sp-${i}`}
                x1={CX}
                y1={CY}
                x2={end.x}
                y2={end.y}
                stroke={isSel ? '#1B8354' : isHover ? 'rgba(27,131,84,0.55)' : 'rgba(100,116,139,0.18)'}
                strokeWidth={isSel ? 2.2 : isHover ? 1.6 : 1}
                data-axis-spoke={axisIds[i]}
              />
            )
          })}

          {/* layers, bottom to top; hidden layers fade and shrink (CSS transform/opacity only) */}
          {RADAR_LAYER_ORDER.filter((k) => data[k]).map((k) => {
            const meta = RADAR_LAYERS[k]
            const visible = shown(k)
            const vals = data[k]!
            const late = k === 'target' || k === 'scenario'
            const animCls = animate ? `radar-poly ${late ? 'radar-animate-late' : 'radar-animate'}` : undefined
            return (
              <g key={k} data-layer={k} data-visible={visible ? 'true' : 'false'} style={layerStyle(visible)} pointerEvents="none">
                {k === 'self' && (
                  <polygon
                    points={points(vals.map((v) => v ?? 0), angles)}
                    fill={`url(#${uid}-self)`}
                    fillOpacity="0.28"
                    stroke={meta.color}
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    className={animCls}
                  />
                )}
                {k === 'target' && (
                  <polygon
                    points={points(vals.map((v) => v ?? 0), angles)}
                    fill={`url(#${uid}-target)`}
                    fillOpacity="0.12"
                    stroke={meta.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className={animCls}
                  />
                )}
                {k === 'scenario' && (
                  <polygon
                    points={points(vals.map((v) => v ?? 0), angles)}
                    fill={meta.color}
                    fillOpacity="0.08"
                    stroke={meta.color}
                    strokeWidth="2"
                    strokeDasharray={meta.dash || undefined}
                    strokeLinejoin="round"
                    className={animCls}
                  />
                )}
                {k === 'previous' && (
                  <polygon
                    points={points(vals.map((v) => v ?? 0), angles)}
                    fill="none"
                    stroke={meta.color}
                    strokeOpacity="0.8"
                    strokeWidth="1.5"
                    strokeDasharray={meta.dash || undefined}
                    className={animCls}
                  />
                )}
                {angles.map((_, i) => {
                  const p = vertex(k, i)
                  return p ? <RadarMarker key={i} layer={k} x={p.x} y={p.y} /> : null
                })}
              </g>
            )
          })}

          {/* selected axis halo on the self vertex */}
          {selectedIdx >= 0 && shown('self') && (() => {
            const p = vertex('self', selectedIdx)
            return p ? <circle cx={p.x} cy={p.y} r="9.5" fill="none" stroke="#1B8354" strokeWidth="2" data-selected-halo="" /> : null
          })()}

          {/* pointer targets on the self vertices (keyboard equivalent: the axis buttons) */}
          {isInteractive &&
            angles.map((_, i) => {
              const p = vertex('self', i) ?? polar(0, angles[i])
              return (
                <circle
                  key={`hit-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="18"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverBoth(i)}
                  onMouseLeave={() => setHoverBoth(null)}
                  onClick={() => choose(i)}
                />
              )
            })}

          {/* center label */}
          {centerLabel && (
            <text x={CX} y={CY + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#4D5761">
              {centerLabel}
            </text>
          )}
        </svg>

        {/* axis labels: HTML over the SVG (real wrapping, bidi and focus) */}
        <div
          className="pointer-events-none absolute inset-0"
          {...(isInteractive ? { role: 'toolbar', 'aria-label': ui.axes[lang] } : { 'aria-hidden': true })}
        >
          {axisLabels.map((a, i) => {
            const isSel = i === selectedIdx
            const isActive = i === active
            const cls = `pointer-events-auto rounded-btn px-1 font-medium leading-tight ${isSel ? 'font-bold text-dga-green-dark' : isActive ? 'text-dga-green-dark' : 'text-dga-ink'}`
            return isInteractive ? (
              <button
                key={`lb-${i}`}
                ref={(el) => {
                  buttons.current[i] = el
                }}
                type="button"
                dir={rtl ? 'rtl' : 'ltr'}
                lang={lang}
                data-axis={axisIds[i]}
                tabIndex={i === focusIdx ? 0 : -1}
                aria-pressed={isSel}
                aria-label={`${a.text}: ${axisText(i, visibleLayers)}`}
                style={a.style}
                className={`${cls} cursor-pointer hover:text-dga-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green focus-visible:ring-offset-1 ${isSel ? 'underline decoration-2 underline-offset-4' : ''}`}
                onClick={() => choose(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                onFocus={() => {
                  setFocusIdx(i)
                  setHoverBoth(i)
                }}
                onBlur={() => setHoverBoth(null)}
                onMouseEnter={() => setHoverBoth(i)}
                onMouseLeave={() => setHoverBoth(null)}
              >
                {a.text}
              </button>
            ) : (
              <span key={`lb-${i}`} dir={rtl ? 'rtl' : 'ltr'} lang={lang} data-axis={axisIds[i]} style={a.style} className={cls}>
                {a.text}
              </span>
            )
          })}
        </div>

        {/* hover / focus readout */}
        {readoutIdx !== null && (() => {
          const p = vertex('self', readoutIdx) ?? { x: CX, y: CY }
          const left = Math.max(130, Math.min(W - 130, p.x))
          const below = p.y < CY
          const style: CSSProperties = {
            position: 'absolute',
            left: `${(left / W) * 100}%`,
            transform: 'translateX(-50%)',
            maxWidth: '46%',
            ...(below ? { top: `${((p.y + 16) / H) * 100}%` } : { bottom: `${((H - p.y + 16) / H) * 100}%` }),
          }
          return (
            <div aria-hidden="true" data-radar-readout="" dir={rtl ? 'rtl' : 'ltr'} style={style} className="pointer-events-none z-10 w-max rounded-btn border border-dga-green/40 bg-white/95 px-2.5 py-1.5 text-xs text-dga-ink shadow-card">
              <p className="font-bold leading-snug text-dga-green-dark">{labels[readoutIdx][lang]}</p>
              <ul className="mt-0.5 space-y-0.5">
                {visibleLayers.map((k) => (
                  <li key={k} className="flex items-center gap-1.5 whitespace-nowrap">
                    <RadarLayerSwatch layer={k} />
                    <span>{RADAR_LAYERS[k].label[lang]}</span>
                    <span className="ms-auto ps-2 font-semibold">{bdi(fmt(data[k]?.[readoutIdx], lang) ?? '—')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })()}

      </div>

      <p id={`${uid}-desc`} hidden>
        {description}
      </p>

      {legend && visibleLayers.length > 0 && (
        <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-dga-muted" data-radar-legend="">
          {visibleLayers.map((k) => (
            <li key={k} className="inline-flex items-center gap-1.5">
              <RadarLayerSwatch layer={k} />
              {RADAR_LAYERS[k].label[lang]}
            </li>
          ))}
        </ul>
      )}

      <VisuallyHiddenTable
        id={`${uid}-table`}
        lang={lang}
        visible={showTable}
        caption={ui.caption[lang]}
        rowHeader={ui.domain[lang]}
        columns={present.map((k) => RADAR_LAYERS[k].label[lang])}
        rows={labels.map((l, i) => ({
          key: axisIds[i],
          header: l[lang],
          cells: present.map((k) => {
            const v = fmt(data[k]?.[i], lang)
            return v === null ? ui.none[lang] : bdi(v)
          }),
        }))}
      />
    </div>
  )
}
