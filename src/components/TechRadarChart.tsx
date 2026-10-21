import { useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import type { L, Lang } from '../data/types'
import type { Horizon, Technology } from '../data/technologies'
import { horizonMeta, techClusters, trlZones } from '../data/technologies'
import { bdi, formatNumber } from '../lib/format'
import { cqFont, radialLabel } from './charts/useChartLabels'
import { rovingIndex } from './charts/keyboard'
import { useMediaQuery } from './charts/media'

interface Props {
  technologies: Technology[]
  lang: Lang
  selectedId: string | null
  /** a technology id, or `cluster:<id>` when a cluster label is chosen */
  onSelect: (id: string) => void
  /** Escape on a blip: clear the selection (optional; the tooltip is always dismissed) */
  onClear?: () => void
  /** active filters — non-matching dots are dimmed */
  filterCluster: string | null
  filterHorizon: Horizon | null
  filterDomain: string | null
  animate?: boolean
}

/* geometry (viewBox units): wider than tall so the cluster names have room at the sides */
const W = 820
const H = 556
const CX = 410
const CY = 254
const R = 222
const LABEL_R = R + 26
const FS = 14.5
const BOX = { w: W, h: H, fontSize: FS, pad: 8, centreFrac: 0.4 }
/** blip hit target in viewBox units; never below 24 CSS px */
const HIT = 40

const ui = {
  title: { ar: 'رسم النضج التحريري للتقنيات', en: 'Editorial maturity chart of the technologies' },
  blips: { ar: 'التقنيات على الرسم: استخدم الأسهم للتنقل وEnter للاختيار وEsc للإغلاق', en: 'Technologies on the chart: arrow keys to move, Enter to choose, Esc to close' },
  clusters: { ar: 'مجموعات التقنيات (تصفية)', en: 'Technology clusters (filter)' },
  maturity: { ar: 'النضج التحريري', en: 'editorial maturity' },
  of9: { ar: 'من 9', en: 'of 9' },
  count: { ar: 'عدد التقنيات', en: 'Technologies' },
  clusterCount: { ar: 'عدد المجموعات', en: 'clusters' },
  shownCount: { ar: 'المطابقة لعوامل التصفية', en: 'matching the filters' },
  how: {
    ar: 'تبعد كل تقنية عن المركز بقدر تقديرها التحريري للنضج على مقياس من 1 إلى 9، والقطاعات هي المجموعات.',
    en: 'Each technology sits further from the centre the higher its editorial maturity rating on a 1–9 scale; the sectors are the clusters.',
  },
  narrowNote: { ar: 'الشاشة ضيقة، فتظهر التقنيات قائمةً.', en: 'The screen is narrow, so the technologies are listed.' },
  showChart: { ar: 'اعرض الرسم', en: 'Show the chart' },
  showList: { ar: 'اعرض القائمة', en: 'Show as a list' },
  none: { ar: 'لا تقنيات تطابق عوامل التصفية.', en: 'No technologies match the filters.' },
} satisfies Record<string, L>

function polar(r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

export default function TechRadarChart({
  technologies,
  lang,
  selectedId,
  onSelect,
  onClear,
  filterCluster,
  filterHorizon,
  filterDomain,
  animate = true,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const rtl = lang === 'ar'
  const dir: 1 | -1 = rtl ? -1 : 1
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [focusedNow, setFocusedNow] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const narrow = useMediaQuery('(max-width: 479.98px)')
  const [forceChart, setForceChart] = useState(false)
  const blipRefs = useRef(new Map<string, HTMLButtonElement>())
  const nClusters = techClusters.length
  const sectorDeg = 360 / nClusters

  const isDim = (tech: Technology) =>
    !!((filterCluster && tech.clusterId !== filterCluster) ||
    (filterHorizon && tech.horizon !== filterHorizon) ||
    (filterDomain && !tech.domainIds.includes(filterDomain)))

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
        out.push({ tech, ...polar(r, angle) })
      })
    })
    return out
  }, [technologies, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const nav = dots.filter((d) => !isDim(d.tech))
  const navIds = nav.map((d) => d.tech.id)
  const tabbableId =
    focusId && navIds.includes(focusId) ? focusId : selectedId && navIds.includes(selectedId) ? selectedId : navIds[0] ?? null

  const horizonName = (h: Horizon) => horizonMeta[h].name[lang]
  const blipName = (tech: Technology) =>
    `${tech.name[lang]}${rtl ? '، ' : ', '}${horizonName(tech.horizon)}${rtl ? '، ' : ', '}${ui.maturity[lang]} ${formatNumber(tech.trl, lang)} ${ui.of9[lang]}`

  const tipId = hoverId ?? focusedNow
  const tipDot = !dismissed && tipId ? dots.find((d) => d.tech.id === tipId) ?? null : null
  const activeId = selectedId ?? tipDot?.tech.id ?? null

  const byHorizon = (Object.keys(horizonMeta) as Horizon[]).map((h) => `${horizonName(h)}: ${formatNumber(technologies.filter((t) => t.horizon === h).length, lang)}`)
  const anyFilter = !!(filterCluster || filterHorizon || filterDomain)
  const description = [
    `${ui.count[lang]}: ${formatNumber(technologies.length, lang)}${rtl ? '، ' : ', '}${ui.clusterCount[lang]}: ${formatNumber(nClusters, lang)}.`,
    `${byHorizon.join(rtl ? '، ' : ', ')}.`,
    ui.how[lang],
    anyFilter ? `${ui.shownCount[lang]}: ${formatNumber(nav.length, lang)}.` : '',
  ]
    .filter(Boolean)
    .join(' ')

  const onBlipKey = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setDismissed(true)
      setHoverId(null)
      onClear?.()
      return
    }
    const i = navIds.indexOf(id)
    if (i < 0) return
    const next = rovingIndex(e.key, i, navIds.length, rtl)
    if (next === null) return
    e.preventDefault()
    const nextId = navIds[next]
    setFocusId(nextId)
    blipRefs.current.get(nextId)?.focus()
  }

  /* ---------------------------------------------------------- narrow screens: list fallback */
  if (narrow && !forceChart) {
    return (
      <div data-tech-fallback="" lang={lang} dir={rtl ? 'rtl' : 'ltr'}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-dga-muted">{ui.narrowNote[lang]}</p>
          <button type="button" onClick={() => setForceChart(true)} className="chip min-h-[32px] cursor-pointer hover:border-dga-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green">
            {ui.showChart[lang]}
          </button>
        </div>
        {nav.length === 0 && <p className="text-sm text-dga-muted">{ui.none[lang]}</p>}
        {techClusters.map((cluster) => {
          const items = nav.filter((d) => d.tech.clusterId === cluster.id)
          if (items.length === 0) return null
          return (
            <section key={cluster.id} aria-labelledby={`${uid}-c-${cluster.id}`} className="mb-3">
              <h3 id={`${uid}-c-${cluster.id}`} className="mb-1 text-xs font-bold text-dga-ink">
                {cluster.name[lang]}
              </h3>
              <ul className="space-y-1">
                {items.map(({ tech }) => (
                  <li key={tech.id}>
                    <button
                      type="button"
                      aria-pressed={selectedId === tech.id}
                      onClick={() => onSelect(tech.id)}
                      className={`flex min-h-[44px] w-full items-center gap-2 rounded-btn border px-2 py-1.5 text-start text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${
                        selectedId === tech.id ? 'border-dga-green bg-dga-green/5 font-semibold' : 'border-dga-line bg-white hover:border-dga-green'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: horizonMeta[tech.horizon].color }} aria-hidden />
                      <span className="flex-1 leading-snug">{tech.name[lang]}</span>
                      <span className="shrink-0 text-[11px] text-dga-muted">
                        {horizonName(tech.horizon)} · {bdi(`TRL ${formatNumber(tech.trl, lang)}`)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    )
  }

  /* ---------------------------------------------------------- chart */
  return (
    <div className="tech-radar-chart relative w-full" style={{ containerType: 'inline-size' } as CSSProperties} data-tech-chart="">
      {narrow && (
        <div className="mb-2 flex justify-end">
          <button type="button" onClick={() => setForceChart(false)} className="chip min-h-[32px] cursor-pointer hover:border-dga-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green">
            {ui.showList[lang]}
          </button>
        </div>
      )}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none" role="img" aria-label={ui.title[lang]} aria-describedby={`${uid}-desc`} direction="ltr">
          <defs>
            <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#DBA102" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#DBA102" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={R * 1.14} fill={`url(#${uid}-glow)`} />

          {/* TRL zone bands */}
          {trlZones.map((z, zi) => {
            const rOut = (z.to / 9) * R
            const rIn = ((z.from - 1) / 9) * R
            return (
              <g key={zi}>
                <circle cx={CX} cy={CY} r={rOut} fill={zi % 2 === 0 ? 'rgba(100,116,139,0.045)' : 'rgba(100,116,139,0.09)'} />
                {rIn > 0 && <circle cx={CX} cy={CY} r={rIn} fill="#ffffff" />}
              </g>
            )
          })}

          {/* TRL rings */}
          {Array.from({ length: 9 }, (_, i) => i + 1).map((trl) => (
            <circle
              key={trl}
              cx={CX}
              cy={CY}
              r={(trl / 9) * R}
              fill="none"
              stroke={trl === 9 ? 'rgba(100,116,139,0.4)' : 'rgba(100,116,139,0.16)'}
              strokeWidth={trl === 9 ? 1.4 : 0.8}
              strokeDasharray={trl === 9 ? 'none' : '2 5'}
            />
          ))}

          {/* TRL numbers on top spoke */}
          {Array.from({ length: 9 }, (_, i) => i + 1).map((trl) => (
            <text key={`tn-${trl}`} x={CX} y={CY - (trl / 9) * R + 3} textAnchor="middle" fontSize="10" fill="rgba(77,87,97,0.75)">
              {formatNumber(trl, lang)}
            </text>
          ))}

          {/* sector dividers */}
          {techClusters.map((cluster, ci) => {
            const bp = polar(R + 6, -90 + dir * ci * sectorDeg)
            return <line key={cluster.id} x1={CX} y1={CY} x2={bp.x} y2={bp.y} stroke="rgba(100,116,139,0.22)" strokeWidth="1" />
          })}

          {/* technology dots */}
          {dots.map(({ tech, x, y }, i) => {
            const dim = isDim(tech)
            const active = activeId === tech.id || tipDot?.tech.id === tech.id
            const chosen = selectedId === tech.id
            const color = horizonMeta[tech.horizon].color
            return (
              <g
                key={tech.id}
                data-blip={tech.id}
                className={animate ? 'radar-poly radar-animate' : undefined}
                style={animate ? { animationDelay: `${Math.min(i * 18, 700)}ms` } : undefined}
                opacity={dim ? 0.14 : 1}
              >
                {chosen && <circle cx={x} cy={y} r="13" fill="none" stroke={color} strokeWidth="1.6" strokeDasharray="3 3" />}
                <circle cx={x} cy={y} r={active ? 8.5 : 6.5} fill={color} fillOpacity={active ? 1 : 0.85} stroke="#ffffff" strokeWidth="2" style={{ transition: 'r 0.18s ease' }} />
              </g>
            )
          })}
        </svg>

        {/* cluster labels: HTML buttons over the SVG (wrapping, bidi, keyboard) */}
        <div className="pointer-events-none absolute inset-0" role="group" aria-label={ui.clusters[lang]}>
          {techClusters.map((cluster, ci) => {
            const mid = -90 + dir * (ci + 0.5) * sectorDeg
            const p = polar(LABEL_R, mid)
            const lab = radialLabel(p.x, p.y, mid, BOX)
            const isActive = filterCluster === cluster.id
            const clusterSelected = selectedId ? dots.find((d) => d.tech.id === selectedId)?.tech.clusterId === cluster.id : false
            return (
              <button
                key={cluster.id}
                type="button"
                dir={rtl ? 'rtl' : 'ltr'}
                lang={lang}
                data-cluster={cluster.id}
                aria-pressed={isActive}
                style={lab.style}
                onClick={() => onSelect(`cluster:${cluster.id}`)}
                className={`pointer-events-auto cursor-pointer rounded-btn px-1 leading-tight hover:text-dga-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${
                  isActive || clusterSelected ? 'font-bold text-dga-green-dark' : 'font-medium text-dga-ink'
                } ${isActive ? 'underline decoration-2 underline-offset-4' : ''}`}
              >
                {cluster.name[lang]}
              </button>
            )
          })}
        </div>

        {/* blips: one tab stop, arrows move, Enter/Space choose, Esc closes */}
        <div className="pointer-events-none absolute inset-0" role="toolbar" aria-label={ui.blips[lang]}>
          {dots.map(({ tech, x, y }) => {
            const dim = isDim(tech)
            const showsTip = tipDot?.tech.id === tech.id
            const style: CSSProperties = {
              left: `${(x / W) * 100}%`,
              top: `${(y / H) * 100}%`,
              width: `max(24px, ${cqFont(HIT, W)})`,
              height: `max(24px, ${cqFont(HIT, W)})`,
              transform: 'translate(-50%, -50%)',
            }
            return (
              <button
                key={tech.id}
                ref={(el) => {
                  if (el) blipRefs.current.set(tech.id, el)
                  else blipRefs.current.delete(tech.id)
                }}
                type="button"
                data-tech={tech.id}
                tabIndex={!dim && tech.id === tabbableId ? 0 : -1}
                aria-hidden={dim ? true : undefined}
                aria-pressed={selectedId === tech.id}
                aria-label={blipName(tech)}
                aria-describedby={showsTip ? `${uid}-tip` : undefined}
                style={style}
                className="pointer-events-auto absolute cursor-pointer rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green focus-visible:ring-offset-1"
                onClick={() => onSelect(tech.id)}
                onKeyDown={(e) => onBlipKey(e, tech.id)}
                onFocus={() => {
                  setFocusId(tech.id)
                  setFocusedNow(tech.id)
                  setDismissed(false)
                }}
                onBlur={() => setFocusedNow((f) => (f === tech.id ? null : f))}
                onMouseEnter={() => {
                  setHoverId(tech.id)
                  setDismissed(false)
                }}
                onMouseLeave={() => setHoverId((h) => (h === tech.id ? null : h))}
              />
            )
          })}
        </div>

        {/* tooltip: shown on hover and on keyboard focus, dismissed with Esc */}
        {tipDot && (() => {
          const left = Math.max(150, Math.min(W - 150, tipDot.x))
          const below = tipDot.y > CY
          const style: CSSProperties = {
            position: 'absolute',
            left: `${(left / W) * 100}%`,
            transform: 'translateX(-50%)',
            maxWidth: '62%',
            ...(below ? { top: `${((tipDot.y + 18) / H) * 100}%` } : { bottom: `${((H - tipDot.y + 18) / H) * 100}%` }),
          }
          const meta = horizonMeta[tipDot.tech.horizon]
          return (
            <div id={`${uid}-tip`} role="tooltip" data-tech-tooltip="" dir={rtl ? 'rtl' : 'ltr'} lang={lang} style={style} className="pointer-events-none z-10 w-max rounded-card border border-dga-green/40 bg-white/95 px-3 py-2 text-center shadow-card">
              <p className="text-xs font-semibold leading-snug text-dga-black">{tipDot.tech.name[lang]}</p>
              <p className="mt-0.5 flex items-center justify-center gap-1.5 text-[11px] text-dga-green-dark">
                <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} aria-hidden />
                {meta.name[lang]} · {bdi(`TRL ${formatNumber(tipDot.tech.trl, lang)}`)}
              </p>
            </div>
          )
        })()}
      </div>
      <p id={`${uid}-desc`} hidden>
        {description}
      </p>
    </div>
  )
}
