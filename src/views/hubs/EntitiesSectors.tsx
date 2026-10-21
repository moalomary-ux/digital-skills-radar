import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import type { View } from '../../store'
import type { L } from '../../data/types'
import { pathFor } from '../../lib/routes'
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

const pages: Page[] = [
  {
    view: 'sectors',
    icon: 'compass',
    title: { ar: 'احتياج القطاعات', en: 'Sector needs' },
    answers: { ar: 'ما مجالات التطوير المرتبطة بقطاعي؟', en: 'Which development domains relate to my sector?' },
    shows: [
      { ar: 'مجالات تطوير مرتبطة بسجل الاستشارات لكل قطاع، بشارة «استنتاج تحريري»', en: 'Development domains linked to each sector’s consulting record, marked «editorial inference»' },
      { ar: 'عدد السجلات وفترتها بجانب كل استنتاج', en: 'The number of records and their period next to each inference' },
      { ar: 'مجاميع قطاعية فقط حين يكفي عدد الجهات لحماية الخصوصية', en: 'Sector aggregates only when there are enough entities to protect privacy' },
    ],
    never: [
      { ar: 'ترتيب للجهات أو «أعلى الجهات»', en: 'Rankings of entities or «top entities»' },
      { ar: '«احتياجات» منسوبة إلى جهة بعينها', en: '«Needs» attributed to a single entity' },
    ],
  },
  {
    view: 'services',
    icon: 'cycle',
    title: { ar: 'سجل خدمات التمكين', en: 'Enablement service record' },
    answers: { ar: 'ما خدمات التدريب والاستشارات التي قُدّمت، ومتى؟', en: 'Which training and consulting services were delivered, and when?' },
    shows: [
      { ar: 'سجلات المشاركة التدريبية والخدمات الاستشارية، كلٌّ بوحدته', en: 'Training participation records and consulting services, each in its own unit' },
      { ar: 'السلاسل السنوية وتاريخ آخر تحديث للبيانات', en: 'Yearly series and the date of the last data update' },
    ],
    never: [
      { ar: 'مجموع مركّب يخلط وحدات مختلفة', en: 'A combined total that mixes different units' },
      { ar: 'ادعاء «أثر» لم يُقس', en: 'An «impact» claim that was never measured' },
    ],
  },
  {
    view: 'directory',
    icon: 'flag',
    title: { ar: 'دليل الجهات', en: 'Entity directory' },
    answers: { ar: 'أين أجد جهة حكومية، وما قطاعها ونوعها؟', en: 'Where do I find a government entity, and what is its sector and type?' },
    shows: [
      { ar: 'أسماء الجهات الحكومية وقطاعاتها وأنواعها', en: 'Government entity names, sectors and types' },
      { ar: 'بحث وتصفية بالقطاع والنوع', en: 'Search and filter by sector and type' },
    ],
    never: [
      { ar: 'شعارات رسمية', en: 'Official logos' },
      { ar: 'سجلات خدمة تفصيلية لجهة مسماة', en: 'Detailed service records for a named entity' },
      { ar: 'قوائم «لم تستفد»', en: '«Not served» lists' },
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
        eyebrow={{ ar: 'مجاميع فقط، بلا ترتيب', en: 'Aggregates only, no rankings' }}
        title={{ ar: 'الجهات والقطاعات', en: 'Entities & sectors' }}
        intro={{
          ar: 'صورة مجمّعة لاحتياج القطاعات الحكومية وسجل خدمات التمكين. البناء العام يعرض المجاميع فقط: لا ترتيب للجهات، ولا سجلات تفصيلية لجهة بعينها، ولا شعارات رسمية.',
          en: 'An aggregate picture of government sector needs and the enablement service record. The public build shows aggregates only: no entity rankings, no detailed records for a single entity, and no official logos.',
        }}
      >
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
