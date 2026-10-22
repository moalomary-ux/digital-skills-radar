import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import type { View } from '../../store'
import type { L } from '../../data/types'
import { pathFor } from '../../lib/routes'
import { isFullMode } from '../../lib/flags'
import { SECTOR_MIN_ENTITIES } from '../../data/gov/types'
import Claim from '../../components/Claim'
import { HubCard, HubHeader, HubSection } from '../../components/shell/Hub'
import { useArrow, useTabs } from '../../components/shell/hooks'

interface Page {
  view: View
  icon: string
  title: L
  answers: L
  shows: L[]
  never: L[]
}

/** The publication rule for sector aggregates (claim `method-gov-sector-min`). */
const N = SECTOR_MIN_ENTITIES

/**
 * What each page of the section shows and deliberately never shows, worded to match the public
 * build exactly. Since the owner’s decision of 2026-10-22 the published build is the full layer: national
 * figures, sector aggregates for n ≥ 10, and the directory with per-entity records and logos; no rankings.
 */
const pages: Page[] = [
  {
    view: 'sectors',
    icon: 'compass',
    title: { ar: 'القطاعات الحكومية', en: 'Government sectors' },
    answers: { ar: 'كم جهة في قطاعي، وما الذي طلبه من تدريب واستشارات؟', en: 'How many entities are in my sector, and what training and consulting has it requested?' },
    shows: [
      { ar: 'عدد الجهات الحكومية وشبه الحكومية في كل قطاع', en: 'The number of government and quasi-government entities in each sector' },
      {
        ar: `مجاميع التدريب والاستشارات للقطاع فقط حين يبلغ عدد جهاته ذات السجلات ${N} أو أكثر`,
        en: `Training and consulting totals for a sector only when it has ${N} or more entities with records`,
      },
      {
        ar: 'موجز قابل للطباعة لكل قطاع: عدد السجلات وفترتها، ومجالات تطوير مرتبطة بسجل الاستشارات بشارة «استنتاج تحريري»',
        en: 'A printable brief per sector: record counts and their period, and development domains linked to the consulting record, marked «editorial inference»',
      },
    ],
    never: [
      { ar: 'ترتيب للجهات أو قائمة «أعلى الجهات»', en: 'Entity rankings or a «top entities» list' },
      {
        ar: `مجاميع التدريب والاستشارات لقطاع يقل عدد جهاته ذات السجلات عن ${N}؛ تبقى ضمن المجاميع الوطنية فقط`,
        en: `Training and consulting totals for a sector with fewer than ${N} entities with records; they stay within the national totals only`,
      },
      { ar: 'نسب مئوية، أو «احتياجات» منسوبة إلى جهة بعينها', en: 'Percentages, or «needs» attributed to a single entity' },
    ],
  },
  {
    view: 'services',
    icon: 'cycle',
    title: { ar: 'سجل خدمات التمكين', en: 'Enablement service record' },
    answers: { ar: 'ما التدريب والاستشارات التي قُدّمت للجهات، ومتى؟', en: 'What training and consulting was delivered to entities, and when?' },
    shows: [
      {
        ar: 'الأرقام الوطنية: سجلات المشاركة التدريبية والخدمات الاستشارية والجهات المستفيدة، كلٌّ بوحدته',
        en: 'National figures: training participation records, consulting services and entities served, each in its own unit',
      },
      { ar: 'السلسلة السنوية للتدريب، والاستشارات حسب الفئة والركيزة، والانتشار حسب المنطقة', en: 'The yearly training series, consulting by category and pillar, and coverage by region' },
      { ar: 'تاريخ القطع، والتوفيق مع السجلين الحيين للتدريب والاستشارات', en: 'The cut-off date and the reconciliation with the live training and consulting registers' },
    ],
    never: [
      { ar: 'مجموع مركّب يخلط وحدات مختلفة', en: 'A combined total that mixes different units' },
      { ar: 'ترتيب للجهات أو مقارنة تنافسية بينها', en: 'Rankings or competitive comparisons between entities' },
      { ar: 'ادعاء «أثر» لم يُقس', en: 'An «impact» claim that was never measured' },
    ],
  },
  {
    view: 'directory',
    icon: 'flag',
    title: { ar: 'دليل الجهات', en: 'Entity directory' },
    answers: { ar: 'أين أجد جهة حكومية، وما نوعها وقطاعها ومنطقتها؟', en: 'Where do I find a government entity, and what is its type, sector and region?' },
    shows: [
      {
        ar: 'الجهات القائمة بالاسم والنوع والقطاع والمنطقة؛ الجهات الحكومية وشبه الحكومية مختارة افتراضيًا',
        en: 'Active entities by name, type, sector and region; government and quasi-government entities are selected by default',
      },
      { ar: 'بحث بالاسم العربي أو الإنجليزي، وتصفية بالنوع والقطاع والمنطقة', en: 'Search by Arabic or English name, and filters by type, sector and region' },
      { ar: 'صفحة لكل جهة: سجل خدماتها التدريبية والاستشارية كما ورد في ملفي المصدر، وشعارها من الدليل الرسمي، ورابط موجز قطاعها', en: 'A page per entity: its training and consulting record as it appears in the two source workbooks, its logo from the official directory, and a link to its sector brief' },
    ],
    never: [
      { ar: 'ترتيب الجهات، أو وصف جهة بأنها لم تستفد، أو شعار الهيئة نفسها', en: 'Ranking entities, labelling an entity as not served, or the Authority’s own logo' },
      { ar: 'جهات القطاع الخاص', en: 'Private-sector entities' },
    ],
  },
]

/** «الجهات والقطاعات» — hub landing: a tabbed preview of what each page shows and never shows. */
export default function EntitiesSectorsHub() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const { tabProps, panelProps, index } = useTabs(pages.length)

  return (
    <div>
      <HubHeader
        eyebrow={{ ar: 'مجاميع ودليل، بلا ترتيب', en: 'Aggregates and a directory, no rankings' }}
        title={{ ar: 'الجهات والقطاعات', en: 'Entities & sectors' }}
        intro={{
          ar: `سجل خدمات التمكين بأرقامه الوطنية، والقطاعات الحكومية بمجاميعها، ودليل الجهات وسجل خدمات كل جهة وشعارها (بقرار المالك، 2026-10-22). لا ترتيب للجهات ولا وصف لجهة بأنها لم تستفد، ولا تُنشر مجاميع قطاع إلا إذا بلغ عدد جهاته ذات السجلات ${N} أو أكثر.`,
          en: `The enablement service record with its national figures, the government sectors with their aggregates, and the entity directory with each entity’s service record and logo (owner’s decision, 2026-10-22). No entity rankings, no labelling of an entity as not served, and a sector’s totals are published only when it has ${N} or more entities with records.`,
        }}
      >
        {isFullMode() ? (
          <p className="chip mt-4 border-dga-amber/60 bg-amber-50 text-dga-amber-tx">
            {t({ ar: 'هذا البناء يعرض الطبقة التفصيلية — سجلات الجهات وشعاراتها — بقرار المالك (2026-10-22)', en: 'This build shows the detailed layer — entity records and logos — by the owner’s decision (2026-10-22)' })}
          </p>
        ) : null}
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-dga-muted">
          {t({ ar: 'قاعدة الخصوصية للمجاميع القطاعية:', en: 'Privacy rule for sector aggregates:' })}
          <Claim id="method-gov-sector-min" />
        </p>
      </HubHeader>

      <HubSection
        title={{ ar: 'أي سؤال تريد إجابته؟', en: 'Which question do you want answered?' }}
        intro={{ ar: 'اختر سؤالاً لترى ما تعرضه الصفحة، وما لا تعرضه عمداً.', en: 'Pick a question to see what the page shows, and what it deliberately does not.' }}
      >
        <div role="tablist" aria-label={t({ ar: 'صفحات القسم', en: 'Section pages' })} className="grid gap-2 md:grid-cols-3 print:hidden">
          {pages.map((p, i) => {
            const active = i === index
            return (
              <button
                key={p.view}
                {...tabProps(i)}
                className={`rounded-card border p-4 text-start transition-all ${
                  active ? 'border-dga-green bg-white shadow-card' : 'border-dga-line bg-white/60 hover:border-dga-green/60 hover:bg-white'
                }`}
              >
                <span className={`block text-xs font-semibold ${active ? 'text-dga-green-dark' : 'text-dga-muted'}`}>{t(p.title)}</span>
                <span className={`mt-1 block text-sm leading-snug ${active ? 'font-bold text-dga-black' : 'text-dga-ink'}`}>{t(p.answers)}</span>
              </button>
            )
          })}
        </div>
        {pages.map((p, i) => (
          <div key={p.view} {...panelProps(i)} className="print-reveal mt-4 rounded-card border border-dga-line bg-white p-5 shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green sm:p-6">
            <h3 className="text-lg font-bold text-dga-black">{t(p.title)}</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <p className="eyebrow">{t({ ar: 'تعرض', en: 'Shows' })}</p>
                <ul className="mt-2 space-y-2">
                  {p.shows.map((s) => (
                    <li key={s.en} className="flex gap-2 text-sm leading-relaxed text-dga-ink">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" aria-hidden="true" />
                      {t(s)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-btn bg-dga-bg p-4">
                <p className="eyebrow !text-dga-amber-tx">{t({ ar: 'لا تعرض عمداً', en: 'Deliberately never shows' })}</p>
                <ul className="mt-2 space-y-2">
                  {p.never.map((s) => (
                    <li key={s.en} className="flex gap-2 text-sm leading-relaxed text-dga-ink">
                      <span className="mt-0.5 shrink-0 font-bold text-dga-amber-tx" aria-hidden="true">×</span>
                      {t(s)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link to={pathFor(p.view, lang)} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark print:hidden">
              {t({ ar: 'افتح ', en: 'Open ' })}
              {t(p.title)} <span aria-hidden="true">{arrow}</span>
            </Link>
          </div>
        ))}
      </HubSection>

      <HubSection title={{ ar: 'صفحات هذا القسم', en: 'Pages in this section' }}>
        <div className="grid gap-5 md:grid-cols-3">
          {pages.map((p) => (
            <HubCard key={p.view} view={p.view} icon={p.icon} title={p.title} desc={t(p.answers)} />
          ))}
        </div>
      </HubSection>
    </div>
  )
}
