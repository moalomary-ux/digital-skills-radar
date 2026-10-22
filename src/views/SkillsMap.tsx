import { useApp } from '../store'
import MapExplorer from '../components/map/MapExplorer'
import { MAP_COPY } from '../components/map/copy'
import { useMediaQuery } from '../components/charts/media'

/**
 * `/:lang/map` — «خريطة المهارات التفاعلية» (packets P10, P10b): the eight domains, their skills,
 * the government job families and digital roles that lean on them, and the technologies that
 * demand them, explored by hover, click, keyboard and a guided story instead of reading.
 * `?node=<id>` opens with a node selected; `?story=1` opens the guided tour; `?spot=<domain>` opens
 * the domain spotlight; `?compare=<role>` compares the selected role with another.
 *
 * P10b (review P1-11): a compact header — eyebrow, title, one sentence — so the toolbar and the
 * whole disc fit the first viewport at 1440 × 900. The counts live on the ring filters.
 */
export default function SkillsMap() {
  const { t } = useApp()
  const touch = useMediaQuery('(pointer: coarse)')
  return (
    <div className="map-page">
      <header className="relative overflow-hidden border-b border-dga-line bg-white print:border-0">
        <div className="dot-grid-green absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-[88rem] px-4 pb-3 pt-3.5 sm:px-6">
          <p className="eyebrow">{t(MAP_COPY.eyebrow)}</p>
          <h1 className="mt-0.5 text-[clamp(1.45rem,2.3vw,1.95rem)] font-bold leading-tight text-dga-green-deep">{t(MAP_COPY.title)}</h1>
          <p className="mt-1 max-w-4xl text-[14.5px] leading-relaxed text-dga-muted">{t(touch ? MAP_COPY.introTouch : MAP_COPY.intro)}</p>
        </div>
      </header>
      <div className="mx-auto max-w-[88rem] px-4 py-3 sm:px-6">
        <MapExplorer syncUrl />
      </div>
    </div>
  )
}
