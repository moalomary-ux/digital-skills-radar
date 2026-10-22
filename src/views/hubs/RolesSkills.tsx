import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import type { L } from '../../data/types'
import { domains } from '../../data/domains'
import { pathFor } from '../../lib/routes'
import Icon from '../../components/Icon'
import { ClaimText } from '../../components/Claim'
import { HubCard, HubHeader, HubSection } from '../../components/shell/Hub'
import { useArrow } from '../../components/shell/hooks'
import MapPreview from '../../components/map/MapPreview'
import { defaultSources } from '../../components/map/sources'
import { countOf } from '../../components/map/copy'
import { libraryRoles } from '../../data/roleLibrary'
import { workFamilies } from '../../data/workShifts'
import { technologies } from '../../data/technologies'
import type { NodeKind } from '../../lib/skillsGraph'
import { countPhrase } from '../../lib/format'
import { shifts } from '../../data/leaders/shifts'

/** The one four-level scale (glossary: وعي · تطبيق · إتقان · ريادة). */
const levels: { name: L; meaning: L }[] = [
  { name: { ar: 'وعي', en: 'Awareness' }, meaning: { ar: 'تفهم المفاهيم الأساسية وتستطيع شرحها، وتعرف متى تطلب المساعدة.', en: 'You understand the core concepts, can explain them, and know when to ask for help.' } },
  { name: { ar: 'تطبيق', en: 'Application' }, meaning: { ar: 'تطبّق المهارة في مهامك المعتادة بإرشاد محدود.', en: 'You apply the skill in routine tasks with limited guidance.' } },
  { name: { ar: 'إتقان', en: 'Proficiency' }, meaning: { ar: 'تطبّقها باستقلالية في المواقف المعقدة وتساعد زملاءك فيها.', en: 'You apply it independently in complex situations and help colleagues with it.' } },
  { name: { ar: 'ريادة', en: 'Leadership' }, meaning: { ar: 'تقود الممارسة في جهتك وتضع معاييرها وتطوّر غيرك.', en: 'You lead the practice in your entity, set its standards and develop others.' } },
]

/** The hub lands on the skills map: every ring of it, previewed; the full map is one click away. */
const HUB_MAP_SOURCES = defaultSources()
const HUB_MAP_KINDS: NodeKind[] = ['skill', 'family', 'role', 'tech']

const roleCategories: L[] = [
  { ar: 'عام', en: 'General' },
  { ar: 'تطبيقي', en: 'Applied' },
  { ar: 'تخصصي', en: 'Specialist' },
  { ar: 'قيادة فرق', en: 'Team leadership' },
  { ar: 'تنفيذي', en: 'Executive' },
]

/** «الأدوار والمهارات» — hub landing: the interactive skills map first, then the live domain × level matrix. */
export default function RolesSkillsHub() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const [cell, setCell] = useState<{ d: number; l: number }>({ d: 0, l: 1 })
  const domain = domains[cell.d]
  const level = levels[cell.l]
  const sep = lang === 'ar' ? '، ' : ', '
  const storySteps = countPhrase(shifts.length + 1, lang, { one: 'خطوة واحدة', two: 'خطوتين', few: 'خطوات', many: 'خطوة' }, ['step', 'steps'])

  return (
    <div>
      <HubHeader
        eyebrow={{ ar: 'لغة مشتركة للتطوير', en: 'A shared language for development' }}
        title={{ ar: 'الأدوار والمهارات', en: 'Roles & skills' }}
        intro={{
          ar: `لغة مشتركة للتطوير: ${domains.length} مجالات، في كل مجال 5 مهارات، ومقياس واحد من ${levels.length} مستويات. الدور يحدد المستوى المستهدف في كل مجال، وفئة الدور تحدد ما يُنتظر منك إثباته.`,
          en: `A shared language for development: ${domains.length} domains, five skills in each, and one scale of ${levels.length} levels. A role sets the target level in each domain; the role category sets what you are expected to show.`,
        }}
      />

      <HubSection
        id="skills-map"
        title={{ ar: 'خريطة المهارات التفاعلية', en: 'Interactive skills map' }}
        intro={{
          ar: 'ابدأ من الخريطة: كل مجال في إسفينه، ومهاراته حوله، ثم الأسر الوظيفية الحكومية والأدوار الرقمية التي تستند إليه، ثم التقنيات التي تتطلب مهاراته. مرّر فوق أي نقطة، وانقر لتفتحها في الخريطة الكاملة.',
          en: 'Start from the map: each domain in its wedge, its skills around it, then the government job families and digital roles that lean on it, then the technologies that need its skills. Hover over any point, and click to open it on the full map.',
        }}
      >
        <div className="grid gap-6 rounded-card border border-dga-line bg-white p-4 shadow-card sm:p-6 lg:grid-cols-[minmax(0,1fr),minmax(0,21rem)] lg:items-center">
          <MapPreview sources={HUB_MAP_SOURCES} kinds={HUB_MAP_KINDS} className="mx-auto w-full max-w-[32rem]" />
          <div>
            <ul className="flex flex-wrap gap-2">
              {[
                countOf('domain', domains.length, lang),
                countOf('skill', domains.reduce((n, d) => n + d.skills.length, 0), lang),
                countOf('family', workFamilies.length, lang),
                countOf('role', libraryRoles.length, lang),
                countOf('tech', technologies.length, lang),
              ].map((c) => (
                <li key={c} className="chip !px-3 !py-1 !text-[12.5px] !text-dga-ink">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-dga-muted">
              {t({
                ar: `في الخريطة الكاملة: بحث حيّ، وتصفية للحلقات، ولوحة تشرح كل عقدة، وقصة من ${storySteps} عن تحولات العمل الحكومي والأدوار التي تحملها.`,
                en: `On the full map: live search, ring filters, a panel that explains every node, and a story in ${storySteps} about the shifts in government work and the roles that carry them.`,
              })}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to={pathFor('map', lang)} className="btn-primary px-5 py-2.5 text-sm no-underline hover:no-underline">
                {t({ ar: 'افتح الخريطة', en: 'Open the map' })} <span aria-hidden="true">{arrow}</span>
              </Link>
              <Link to={`${pathFor('map', lang)}?story=1`} className="btn-ghost px-4 py-2 text-sm no-underline hover:no-underline">
                {t({ ar: 'ابدأ القصة', en: 'Start the story' })}
              </Link>
            </div>
            <ul className="mt-5 space-y-1.5 border-t border-dga-line pt-4 text-sm font-semibold">
              <li>
                <Link to={pathFor('roles', lang)} className="inline-flex items-center gap-1 text-dga-green-dark">
                  {t({ ar: 'الأدوار وأوراقها', en: 'Roles and their sheets' })} <span aria-hidden="true">{arrow}</span>
                </Link>
              </li>
              <li>
                <Link to={pathFor('skills', lang)} className="inline-flex items-center gap-1 text-dga-green-dark">
                  {t({ ar: 'قاموس المهارات', en: 'Skills dictionary' })} <span aria-hidden="true">{arrow}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </HubSection>

      <HubSection
        title={{ ar: 'جرّب: المجال × المستوى', en: 'Try it: domain × level' }}
        intro={{
          ar: 'اختر خانة لترى ما يعنيه كل مستوى في كل مجال. استخدم الأسهم للتنقل بين الخانات.',
          en: 'Pick a cell to see what each level means in each domain. Use the arrow keys to move between cells.',
        }}
      >
        <div className="grid gap-6 rounded-card border border-dga-line bg-white p-4 shadow-card sm:p-6 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
          <fieldset className="min-w-0">
            <legend className="sr-only">{t({ ar: 'مصفوفة المجالات والمستويات', en: 'Domain and level matrix' })}</legend>
            <table className="w-full table-fixed border-separate border-spacing-1 text-xs">
              <thead>
                <tr>
                  <th scope="col" className="w-[38%] text-start font-semibold text-dga-muted">
                    {t({ ar: 'المجال', en: 'Domain' })}
                  </th>
                  {levels.map((lv) => (
                    <th key={lv.name.en} scope="col" className="text-center font-semibold text-dga-ink">
                      {t(lv.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {domains.map((d, di) => (
                  <tr key={d.id}>
                    <th scope="row" className={`truncate text-start font-medium ${di === cell.d ? 'text-dga-green-dark' : 'text-dga-ink'}`}>
                      {t(d.shortName)}
                    </th>
                    {levels.map((lv, li) => {
                      const checked = di === cell.d && li === cell.l
                      const inRow = di === cell.d
                      return (
                        <td key={lv.name.en} className="p-0">
                          <label
                            className={`flex h-8 cursor-pointer items-center justify-center rounded-btn border transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dga-green ${
                              checked
                                ? 'border-dga-green bg-dga-green text-white'
                                : inRow
                                  ? 'border-dga-green/30 bg-dga-green/5 hover:bg-dga-green/15'
                                  : 'border-dga-line bg-white hover:border-dga-green'
                            }`}
                          >
                            <input
                              type="radio"
                              name="domain-level"
                              className="sr-only"
                              checked={checked}
                              onChange={() => setCell({ d: di, l: li })}
                              aria-label={`${t(d.name)} — ${t(lv.name)}`}
                            />
                            <span aria-hidden="true" className="flex gap-[2px]">
                              {Array.from({ length: li + 1 }, (_, k) => (
                                <span key={k} className={`h-1.5 w-1.5 rounded-full ${checked ? 'bg-white' : 'bg-dga-green/60'}`} />
                              ))}
                            </span>
                          </label>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>

          <div aria-live="polite" className="rounded-card border border-dga-line bg-dga-bg p-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-dga-muted">
              <Icon name={domain.icon} className="h-4 w-4 text-dga-green" />
              {t(domain.name)}
            </p>
            <h3 className="mt-2 text-xl font-bold text-dga-black">
              {t({ ar: 'مستوى ', en: 'Level: ' })}
              <span className="text-dga-green-dark">{t(level.name)}</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(level.meaning)}</p>
            <p className="mt-4 text-sm leading-relaxed text-dga-muted">{t(domain.description)}</p>
            <p className="mt-3 text-xs leading-relaxed text-dga-muted">
              <span className="font-semibold text-dga-ink">{t({ ar: 'مهاراته الخمس: ', en: 'Its five skills: ' })}</span>
              {domain.skills.map((s) => t(s)).join(sep)}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-dga-muted">
              {t({
                ar: 'المستوى المستهدف ليس واحداً للجميع: يختلف بحسب الدور، وهو استرشادي للتطوير لا شرط وظيفي.',
                en: 'The target level is not the same for everyone: it depends on the role, and it is a development guide, not a job requirement.',
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
              <Link to={pathFor('roles', lang)} className="inline-flex items-center gap-1 text-dga-green-dark">
                {t({ ar: 'المستوى المستهدف لدورك', en: 'Your role’s target level' })} <span aria-hidden="true">{arrow}</span>
              </Link>
              <Link to={pathFor('skills', lang)} className="inline-flex items-center gap-1 text-dga-green-dark">
                {t({ ar: 'تعريف كل مهارة', en: 'Each skill defined' })} <span aria-hidden="true">{arrow}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-card border border-dga-line bg-white p-5">
          <h3 className="text-sm font-bold text-dga-black">{t({ ar: 'فئات الدور', en: 'Role categories' })}</h3>
          <p className="mt-1 text-sm leading-relaxed text-dga-muted">
            {t({
              ar: 'يختار كل مستخدم في بداية التقييم الفئة الأقرب لطبيعة عمله، فتضبط المستهدف الافتراضي ومواقف الحكم المهني التي تظهر له.',
              en: 'At the start of the assessment each user picks the category closest to their work; it sets the default target and the judgment scenarios they see.',
            })}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {roleCategories.map((c) => (
              <li key={c.en} className="chip !px-3 !py-1 !text-[13px]">
                {t(c)}
              </li>
            ))}
          </ul>
        </div>
      </HubSection>

      <HubSection title={{ ar: 'صفحات هذا القسم', en: 'Pages in this section' }}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <HubCard
            view="map"
            icon="radar"
            highlight
            title={{ ar: 'خريطة المهارات التفاعلية', en: 'Interactive skills map' }}
            desc={t({
              ar: 'المجالات ومهاراتها والأسر الوظيفية والأدوار والتقنيات في صورة واحدة تستكشفها بالنقر والتحويم ولوحة المفاتيح.',
              en: 'Domains, skills, job families, roles and technologies in one picture you explore by click, hover and keyboard.',
            })}
          />
          <HubCard
            view="roles"
            icon="flag"
            title={{ ar: 'الأدوار', en: 'Roles' }}
            desc={
              <ClaimText
                text={t({
                  ar: 'مكتبة من {{method-roles-count|bare}} مرجعيتها SFIA 9، ولكل دور ورقة تبيّن المستوى المستهدف في كل مجال والمهام التي تتغير فيه.',
                  en: 'A library of {{method-roles-count|bare}} referenced to SFIA 9; each role has a sheet with the target level per domain and the tasks that are changing.',
                })}
              />
            }
            output={{ ar: 'ورقة دور قابلة للطباعة', en: 'A printable role sheet' }}
          />
          <HubCard
            view="skills"
            icon="chip"
            title={{ ar: 'قاموس المهارات', en: 'Skills dictionary' }}
            desc={
              <ClaimText
                text={t({
                  ar: 'تعريف كل مهارة من {{method-skills-count|bare}}، ومثال عملي عليها، وأساسها في الأطر الدولية.',
                  en: 'A definition of each of the {{method-skills-count|bare}}, a practical example, and its basis in international frameworks.',
                })}
              />
            }
          />
        </div>
      </HubSection>
    </div>
  )
}
