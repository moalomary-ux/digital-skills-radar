import { useApp } from '../store'
import { domains } from '../data/domains'
import { libraryRoles } from '../data/roleLibrary'
import { workFamilies } from '../data/workShifts'
import { technologies } from '../data/technologies'
import MapExplorer from '../components/map/MapExplorer'
import { MAP_COPY, countOf } from '../components/map/copy'

/**
 * `/:lang/map` — «خريطة المهارات التفاعلية» (packet P10): the eight domains, their skills, the
 * government job families and digital roles that lean on them, and the technologies that demand
 * them, explored by hover, click, keyboard and a guided story instead of reading.
 * `?node=<id>` opens with a node selected; `?story=1` opens the guided tour.
 */
export default function SkillsMap() {
  const { t, lang } = useApp()
  const skills = domains.reduce((n, d) => n + d.skills.length, 0)
  const counts = [
    countOf('domain', domains.length, lang),
    countOf('skill', skills, lang),
    countOf('family', workFamilies.length, lang),
    countOf('role', libraryRoles.length, lang),
    countOf('tech', technologies.length, lang),
  ]
  return (
    <div className="map-page">
      <header className="relative overflow-hidden border-b border-dga-line bg-white">
        <div className="dot-grid-green absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[88rem] flex-wrap items-end justify-between gap-x-8 gap-y-3 px-4 py-5 sm:px-6">
          <div className="max-w-3xl">
            <p className="eyebrow">{t(MAP_COPY.eyebrow)}</p>
            <h1 className="mt-1.5 text-[clamp(1.6rem,2.8vw,2.25rem)] font-bold leading-tight text-dga-green-deep">{t(MAP_COPY.title)}</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-dga-muted">
              {t({
                ar: 'المجالات في المركز، ومهاراتها حولها، ثم الأسر الوظيفية الحكومية والأدوار الرقمية التي تستند إليها، ثم التقنيات التي تتطلبها. مرّر وانقر لترى الروابط، أو ابدأ القصة.',
                en: 'The domains at the centre, their skills around them, then the government job families and digital roles that lean on them, then the technologies that demand them. Hover and click to see the connections, or start the story.',
              })}
            </p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label={t({ ar: 'محتوى الخريطة', en: 'What the map holds' })}>
            {counts.map((c) => (
              <li key={c} className="chip !px-3 !py-1 !text-[12.5px] !text-dga-ink">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </header>
      <div className="mx-auto max-w-[88rem] px-4 py-4 sm:px-6 sm:py-5">
        <MapExplorer syncUrl />
      </div>
    </div>
  )
}
