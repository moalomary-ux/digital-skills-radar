import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../../store'
import { domainById } from '../../data/domains'
import { libraryRoleById } from '../../data/roleLibrary'
import { EDITORIAL_WORK_MAP_CLAIM, laneMeta, laneOrder, workFamilies } from '../../data/workShifts'
import type { Lane } from '../../data/workShifts'
import { claimById } from '../../data/claims'
import Claim from '../../components/Claim'
import type { L } from '../../data/types'

/**
 * «خريطة تحوّل العمل الحكومي» — 8 government job families × 4 lanes
 * (تُؤتمت · تُعزَّز · تنشأ · تبقى إنسانية), qualitative only.
 * The selected family lives in `?family=<id>` so a family can be linked and printed.
 */

const PRINT_CSS = `
.claim-host > span.inline-flex { display: inline; }
.claim-host > span.inline-flex > abbr { margin-inline-start: 0.35rem; vertical-align: baseline; }
@media print {
  @page { size: A4 landscape; margin: 10mm; }
  header, footer, nav, .no-print { display: none !important; }
  html, body { background: #fff !important; }
  .work-root { font-size: 9pt; line-height: 1.4; }
  .print-avoid { break-inside: avoid; page-break-inside: avoid; }
}
`

const laneTone: Record<Lane, string> = {
  automated: 'border-t-dga-muted',
  augmented: 'border-t-[#1849A9]',
  emerging: 'border-t-dga-green',
  human: 'border-t-dga-amber',
}

const label = {
  eyebrow: { ar: 'تحوّل العمل الحكومي', en: 'How government work is changing' },
  title: { ar: 'خريطة تحوّل العمل الحكومي', en: 'The government work-shift map' },
  lede: {
    ar: 'كيف تتغير مهام 8 أسر وظيفية حكومية بين 2026 و2030: ما يُؤتمت، وما يُعزَّز، وما ينشأ، وما يبقى إنسانياً. ولكل أسرة: المهارات الصاعدة، وماذا يفعل المدير الآن.',
    en: 'How the tasks of 8 government job families change between 2026 and 2030: what gets automated, what gets augmented, what is new and what stays human. For each family: the rising skills, and what a manager can do now.',
  },
  qualitative: {
    ar: 'نطاقات نوعية فقط، بلا نسب أتمتة.',
    en: 'Qualitative bands only, no automation percentages.',
  },
  editorial: { ar: 'تقدير تحريري', en: 'Editorial estimate' },
  families: { ar: 'الأسر الوظيفية', en: 'Job families' },
  signal: { ar: 'إشارة من مصدر منشور', en: 'A signal from a published source' },
  lanesTitle: { ar: 'كيف تتغير المهام 2026–2030', en: 'How the tasks change, 2026–2030' },
  rising: { ar: 'المهارات الصاعدة', en: 'Rising skills' },
  roles: { ar: 'أدوار رقمية قريبة', en: 'Related digital roles' },
  manager: { ar: 'ماذا يفعل المدير الآن', en: 'What a manager can do now' },
  print: { ar: 'اطبع هذه الأسرة', en: 'Print this family' },
  methodTitle: { ar: 'كيف قرأنا هذه الخريطة', en: 'How to read this map' },
  method1: {
    ar: 'توزيع المهام على الحارات الأربع قراءة تحريرية لاتجاهات منشورة، لا قياس لجهة أو وظيفة بعينها.',
    en: 'Placing tasks in the four lanes is an editorial reading of published trends, not a measurement of any entity or job.',
  },
  method2: {
    ar: 'مواءمة الأسر الوظيفية الحكومية مع التصنيف الدولي للمهن تقريبية، وتختلف المهام من جهة إلى أخرى.',
    en: 'Matching government job families to the international classification of occupations is approximate, and tasks differ from one entity to another.',
  },
  method3: {
    ar: '«تُؤتمت» لا تعني أن الوظيفة تختفي؛ تعني أن مهمة بعينها تنتقل إلى الأنظمة مع بقاء المراجعة البشرية.',
    en: '“Automated” does not mean the job disappears; it means a specific task moves to systems while human review remains.',
  },
  toBrief: { ar: 'الموجز القيادي', en: 'The leader brief' },
} satisfies Record<string, L>

export default function WorkShifts() {
  const { t, lang, dir } = useApp()
  const href = (path: string) => `/${lang}/${path}`
  const [params, setParams] = useSearchParams()
  const requested = params.get('family')
  const activeIndex = Math.max(0, workFamilies.findIndex((f) => f.id === requested))
  const active = workFamilies[activeIndex]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number, focus = false) => {
    const fam = workFamilies[index]
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('family', fam.id)
        return next
      },
      { replace: true },
    )
    if (focus) tabRefs.current[index]?.focus()
  }

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = workFamilies.length - 1
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    let target: number | null = null
    if (e.key === forward) target = activeIndex === last ? 0 : activeIndex + 1
    else if (e.key === backward) target = activeIndex === 0 ? last : activeIndex - 1
    else if (e.key === 'Home') target = 0
    else if (e.key === 'End') target = last
    if (target !== null) {
      e.preventDefault()
      select(target, true)
    }
  }

  const signal = claimById(active.claimId)
  const editorial = claimById(EDITORIAL_WORK_MAP_CLAIM)

  return (
    <div className="work-root mx-auto max-w-7xl px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      <section aria-labelledby="work-title" className="mb-8 max-w-3xl print:mb-2 print:max-w-none">
        <p className="eyebrow">{t(label.eyebrow)}</p>
        <h1 id="work-title" tabIndex={-1} className="mt-2 text-3xl font-bold text-dga-black sm:text-4xl print:text-[16pt]">
          {t(label.title)}
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted print:hidden">{t(label.lede)}</p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="chip">{t(label.qualitative)}</span>
          <span
            className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber-tx"
            title={editorial ? t(editorial.text) : undefined}
          >
            {t(label.editorial)}
          </span>
        </p>
      </section>

      {/* family selector */}
      <div
        role="tablist"
        aria-label={t(label.families)}
        className="no-print -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {workFamilies.map((f, i) => {
          const selected = i === activeIndex
          return (
            <button
              key={f.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`family-tab-${f.id}`}
              aria-selected={selected}
              aria-controls="family-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onTabKey}
              className={`shrink-0 rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? 'border-dga-green bg-dga-green text-white'
                  : 'border-dga-line bg-white text-dga-ink hover:border-dga-green hover:text-dga-green-dark'
              }`}
            >
              {t(f.name)}
            </button>
          )
        })}
      </div>

      <section
        role="tabpanel"
        id="family-panel"
        aria-labelledby={`family-tab-${active.id}`}
        tabIndex={0}
        className="mt-6 outline-none print:mt-0"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-dga-black">{t(active.name)}</h2>
            <p className="mt-1 text-sm text-dga-muted">
              {t({ ar: 'ومن في حكمه: ', en: 'And equivalents: ' })}
              {active.equivalents.map((e) => t(e)).join(lang === 'ar' ? '، ' : ', ')}
            </p>
            <p className="mt-2 leading-relaxed text-dga-ink">{t(active.summary)}</p>
          </div>
          <button type="button" className="btn-ghost no-print" onClick={() => window.print()}>
            {t(label.print)}
          </button>
        </div>

        {signal && (
          <p className="claim-host mt-4 max-w-4xl rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 px-4 py-3 text-sm leading-relaxed text-dga-ink print:py-1.5">
            <span className="font-semibold">{t(label.signal)}: </span>
            <Claim id={active.claimId}>{t(signal.text)}</Claim>
          </p>
        )}

        <h3 className="sr-only">{t(label.lanesTitle)}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:mt-3 print:grid-cols-4 print:gap-2">
          {laneOrder.map((lane) => (
            <section
              key={lane}
              aria-labelledby={`lane-${lane}`}
              className={`glass print-avoid border-t-4 p-5 print:p-2.5 ${laneTone[lane]}`}
            >
              <h4 id={`lane-${lane}`} className="text-lg font-bold text-dga-black">
                {t(laneMeta[lane].name)}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-dga-muted">{t(laneMeta[lane].hint)}</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dga-ink">
                {active.lanes[lane].map((task, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-line" />
                    <span>{t(task)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3 print:mt-3 print:grid-cols-3 print:gap-2">
          <section aria-labelledby="rising-title" className="glass print-avoid p-5 print:p-2.5">
            <h3 id="rising-title" className="font-bold text-dga-black">
              {t(label.rising)}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {active.rising.map((r, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2">
                  <span className="text-dga-ink">{t(r.skill)}</span>
                  <span className="chip-info">{t(domainById(r.domainId).shortName)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="roles-title" className="glass print-avoid p-5 print:p-2.5">
            <h3 id="roles-title" className="font-bold text-dga-black">
              {t(label.roles)}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {active.relatedRoleIds.map((id) => {
                const role = libraryRoleById(id)
                if (!role) return null
                return (
                  <li key={id}>
                    <Link to={href(`roles/${id}`)} className="font-medium">
                      {t(role.name)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="manager-title" className="glass print-avoid p-5 print:p-2.5">
            <h3 id="manager-title" className="font-bold text-dga-black">
              {t(label.manager)}
            </h3>
            <ol className="mt-3 space-y-2 text-sm leading-relaxed text-dga-ink">
              {active.managerActions.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="w-4 shrink-0 font-bold text-dga-amber-tx">
                    {i + 1}
                  </span>
                  <span>{t(a)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </section>

      <section aria-labelledby="method-title" className="mt-10 border-t border-dga-line pt-6 print:mt-3 print:pt-2">
        <h2 id="method-title" className="text-lg font-bold text-dga-black">
          {t(label.methodTitle)}
        </h2>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-dga-muted">
          {[label.method1, label.method2, label.method3].map((m, i) => (
            <li key={i}>{t(m)}</li>
          ))}
        </ul>
        <p className="no-print mt-4">
          <Link to={href('leaders/brief')} className="text-sm font-medium">
            {t(label.toBrief)}
          </Link>
        </p>
      </section>
    </div>
  )
}
