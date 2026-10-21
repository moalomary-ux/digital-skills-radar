import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { levelForScore, levelForTarget } from '../data/levels'
import { transitionNames } from '../data/learning'
import { managerAsks, PLAN_PHASES, planForPriority } from '../data/pathways'
import { agreementLabel, assessDomains, priorities as computePriorities, reasonLabel, summaryLine, targetsForRecord } from '../lib/priorities'
import { encodeResult, formatCode } from '../lib/resultCode'
import { CHECKPOINT_DAYS, formatLongDate, PLAN_WEEKS, planDay } from '../lib/ics'
import RadarChart from '../components/RadarChart'
import { devOnlyNotice, selfAssessmentNote } from '../components/Disclaimer'
import Icon from '../components/Icon'
import { KnowledgeText, roleLine } from './Results'

function Num({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className}`}>
      {children}
    </bdi>
  )
}

function SectionTitle({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[1.05em] font-bold text-dga-green-ink">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-dga-green text-[0.75em] font-bold text-white" aria-hidden>
        {n}
      </span>
      {children}
    </h2>
  )
}

/**
 * «ورقة حوار التطوير» — a designed A4 sheet (≤ 2 pages) for the conversation with a manager.
 * Everything is static: no motion, nothing appears on scroll, so print shows all content.
 * The app header/footer are hidden while printing; the sheet carries its own header and footer.
 */
const printCss = `
@page { size: A4; margin: 12mm; }
@media print {
  html, body { background: #fff !important; }
  #root > div > header, #root > div > footer, #root > div > nav { display: none !important; }
  main { padding: 0 !important; margin: 0 !important; }
  .report-wrap { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  .report-sheet { box-shadow: none !important; border: 0 !important; border-radius: 0 !important; padding: 0 !important; font-size: 9.6pt !important; }
  .report-sheet * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .report-block { break-inside: avoid; page-break-inside: avoid; }
  .report-radar { width: 52mm !important; }
}
`

export default function Report() {
  const { t, lang, go, history } = useApp()
  const latest = history[history.length - 1]

  const model = useMemo(() => {
    if (!latest) return null
    const targets = targetsForRecord(latest)
    const evidence = assessDomains(latest, targets, domains)
    const prio = computePriorities(latest, targets, domains)
    const plans = prio.map((p) => planForPriority(p))
    const start = new Date(latest.date)
    const day1 = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    return { evidence, prio, plans, day1, code: formatCode(encodeResult(latest)) }
  }, [latest])

  if (!latest || !model) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="glass p-10">
          <Icon name="radar" className="mx-auto h-10 w-10 text-dga-green" />
          <h1 className="mt-4 text-2xl font-bold">{t({ ar: 'ورقة حوار التطوير تُبنى من نتيجتك', en: 'The development conversation sheet is built from your result' })}</h1>
          <p className="mt-3 text-dga-muted">{t({ ar: 'أكمل التقييم أولًا.', en: 'Complete the assessment first.' })}</p>
          <button type="button" onClick={() => go('wizard')} className="btn-primary mt-6">
            {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
          </button>
        </div>
      </div>
    )
  }

  const { evidence, prio, plans, day1, code } = model
  const { category, role } = roleLine(latest)
  const asks = managerAsks(prio.map((p) => p.domainName))

  return (
    <div className="report-wrap mx-auto max-w-[218mm] px-4 py-8">
      <style>{printCss}</style>

      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-dga-muted">{t({ ar: 'معاينة الورقة كما ستُطبع (A4، صفحتان على الأكثر).', en: 'Preview of the sheet as printed (A4, two pages at most).' })}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => window.print()} className="btn-primary px-5 py-2.5 text-sm">
            {t({ ar: 'طباعة / حفظ PDF', en: 'Print / Save PDF' })}
          </button>
          <button type="button" onClick={() => go('pathways')} className="btn-ghost px-4 py-2.5 text-sm">
            {t({ ar: 'خطتي', en: 'My plan' })}
          </button>
          <button type="button" onClick={() => go('results')} className="btn-ghost px-4 py-2.5 text-sm">
            {t({ ar: 'النتائج', en: 'Results' })}
          </button>
        </div>
      </div>

      <article className="report-sheet rounded-card border border-dga-line bg-white p-6 text-[13px] leading-relaxed text-dga-ink shadow-card-lg sm:p-[12mm]" aria-labelledby="report-title">
        {/* sheet header — no name, only the role category and dates */}
        <div className="report-block border-b-2 border-dga-green pb-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.8em] font-semibold text-dga-green-dark">{t({ ar: 'رادار المهارات الرقمية', en: 'Digital Skills Radar' })}</p>
              <h1 id="report-title" className="text-[1.6em] font-bold leading-tight text-dga-black">
                {t({ ar: 'ورقة حوار التطوير', en: 'Development conversation sheet' })}
              </h1>
            </div>
            <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-[0.85em]">
              {category && (
                <>
                  <dt className="text-dga-muted">{t({ ar: 'فئة الدور', en: 'Role category' })}</dt>
                  <dd className="font-semibold">{t(category)}</dd>
                </>
              )}
              {role && (
                <>
                  <dt className="text-dga-muted">{t({ ar: 'الدور', en: 'Role' })}</dt>
                  <dd className="font-semibold">{t(role)}</dd>
                </>
              )}
              <dt className="text-dga-muted">{t({ ar: 'تاريخ التقييم', en: 'Assessed on' })}</dt>
              <dd className="font-semibold">{formatLongDate(new Date(latest.date), lang)}</dd>
            </dl>
          </div>
          <p className="mt-2 font-semibold text-dga-ink">{summaryLine(prio, lang)}</p>
        </div>

        {/* 1. priorities */}
        <section className="report-block mt-4" aria-labelledby="r1">
          <SectionTitle n={1}>
            <span id="r1">{t({ ar: 'أولويات التطوير المقترحة وسببها', en: 'Suggested development priorities and why' })}</span>
          </SectionTitle>
          <ol className="mt-2 space-y-1.5" data-testid="report-priorities">
            {prio.map((p) => (
              <li key={p.domainId} className="flex gap-2 rounded-btn border border-dga-line px-3 py-2" data-domain={p.domainId}>
                <span className="font-bold text-dga-green-dark">
                  <Num>{p.rank}</Num>.
                </span>
                <span>
                  <span className="font-bold text-dga-black">{t(p.domainName)}</span>
                  <span className="ms-2 rounded-pill bg-dga-bg px-2 py-0.5 text-[0.8em] font-semibold text-dga-amber-tx">{t(reasonLabel[p.reason])}</span>
                  <span className="block text-[0.92em]">{t(p.text)}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* 2. evidence layers */}
        <section className="report-block mt-4" aria-labelledby="r2">
          <SectionTitle n={2}>
            <span id="r2">{t({ ar: 'طبقات الأدلة', en: 'Evidence layers' })}</span>
          </SectionTitle>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            <table className="w-full text-[0.85em]">
              <thead className="text-dga-muted">
                <tr className="border-b border-dga-line">
                  <th scope="col" className="py-1 text-start font-semibold">{t({ ar: 'المجال', en: 'Domain' })}</th>
                  <th scope="col" className="py-1 text-start font-semibold">{t({ ar: 'تقدير ذاتي', en: 'Self' })}</th>
                  <th scope="col" className="py-1 text-start font-semibold">{t({ ar: 'موقف الحكم', en: 'Scenario' })}</th>
                  <th scope="col" className="py-1 text-start font-semibold">{t({ ar: 'تحقق معرفي', en: 'Knowledge' })}</th>
                  <th scope="col" className="py-1 text-start font-semibold">{t({ ar: 'المستهدف', en: 'Target' })}</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((e, i) => (
                  <tr key={e.domainId} className="border-b border-dga-line/60">
                    <th scope="row" className="py-1 text-start font-medium">{t(domains[i].shortName)}</th>
                    <td className="py-1">
                      <Num>{e.selfScore.toFixed(1)}</Num> · {t(levelForScore(e.selfScore).name)}
                    </td>
                    <td className="py-1">
                      {e.scenarioScore !== undefined ? (
                        <Num>{`${e.scenarioScore} / 3`}</Num>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-1">
                      <KnowledgeText e={e} />
                      {e.agreement && <span className="block text-[0.85em] text-dga-muted">{t(agreementLabel[e.agreement])}</span>}
                    </td>
                    <td className="py-1">{t(levelForTarget(e.target).name)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="report-radar mx-auto w-[200px] shrink-0 px-2 [&_svg]:overflow-visible" aria-hidden>
              <RadarChart
                labels={domains.map((d) => d.shortName)}
                values={evidence.map((e) => e.selfScore)}
                targets={evidence.map((e) => e.target)}
                judgment={evidence.some((e) => e.judgment4 !== undefined) ? evidence.map((e) => e.judgment4 ?? 0) : undefined}
                lang={lang}
              />
              <p className="text-center text-[0.75em] text-dga-muted">
                {t({ ar: 'أخضر: تقديرك · كهرماني: المستهدف · أزرق متقطع: المواقف', en: 'Green: self · amber: target · dashed blue: scenarios' })}
              </p>
            </div>
          </div>
        </section>

        {/* 3. behaviours across the 13 weeks */}
        <section className="report-block mt-4" aria-labelledby="r3">
          <SectionTitle n={3}>
            <span id="r3">{t({ ar: 'ثلاثة سلوكيات لكل أولوية عبر الأسابيع الـ13', en: 'Three behaviours per priority across the 13 weeks' })}</span>
          </SectionTitle>
          <table className="mt-2 w-full table-fixed text-[0.85em]">
            <thead className="text-dga-muted">
              <tr className="border-b border-dga-line">
                <th scope="col" className="w-[22%] py-1 text-start font-semibold">{t({ ar: 'الأولوية', en: 'Priority' })}</th>
                {PLAN_PHASES.map(([a, b]) => (
                  <th key={a} scope="col" className="py-1 text-start font-semibold">
                    {t({ ar: 'الأسابيع ', en: 'Weeks ' })}
                    <Num>{`${a}–${b}`}</Num>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.domainId} className="border-b border-dga-line/60 align-top">
                  <th scope="row" className="py-1.5 pe-2 text-start font-semibold">
                    {t(plan.domainName)}
                    <span className="block text-[0.85em] font-normal text-dga-muted">{t(transitionNames[plan.transition])}</span>
                  </th>
                  {plan.behaviours.map((b, bi) => (
                    <td key={bi} className="py-1.5 pe-2">
                      {t(b)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-[0.8em] text-dga-muted">
            {t({ ar: 'الخطوات الأسبوعية كاملة وروابط الموارد في صفحة «خطتي» وفي ملف التقويم.', en: 'The full weekly steps and resource links are on the “My plan” page and in the calendar file.' })}
          </p>
        </section>

        {/* 4. manager + checkpoints */}
        <div className="report-block mt-4 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <section aria-labelledby="r4">
            <SectionTitle n={4}>
              <span id="r4">{t({ ar: 'ما أحتاجه من مديري', en: 'What I need from my manager' })}</span>
            </SectionTitle>
            <ul className="mt-2 space-y-1.5">
              {asks.map((a) => (
                <li key={a.id} className="flex gap-2">
                  <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-[2px] border border-dga-ink" aria-hidden />
                  <span>
                    <span className="font-bold">{t(a.title)}: </span>
                    {t(a.text)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="r5">
            <SectionTitle n={5}>
              <span id="r5">{t({ ar: 'نقطتا المراجعة', en: 'Two checkpoints' })}</span>
            </SectionTitle>
            <ul className="mt-2 space-y-2">
              {CHECKPOINT_DAYS.map((d) => (
                <li key={d}>
                  <p>
                    <span className="font-bold">
                      {t({ ar: 'اليوم ', en: 'Day ' })}
                      <Num>{d}</Num>
                    </span>
                    {' — '}
                    {formatLongDate(planDay(day1, d), lang)}
                  </p>
                  <p className="text-[0.85em] text-dga-muted">
                    {d === 90 ? t({ ar: 'إعادة التقييم ومراجعة النتيجة معًا.', en: 'Retake the assessment and review it together.' }) : t({ ar: 'مراجعة منتصف الخطة.', en: 'Mid-plan review.' })}
                  </p>
                  <p className="mt-1 h-5 border-b border-dotted border-dga-muted" aria-hidden />
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.8em] text-dga-muted">
              {t({ ar: 'مدة الخطة ', en: 'Plan length: ' })}
              <Num>{PLAN_WEEKS}</Num> {t({ ar: 'أسبوعًا تبدأ في ', en: 'weeks from ' })}
              {formatLongDate(day1, lang)}
            </p>
          </section>
        </div>

        {/* sheet footer */}
        <div className="report-block mt-5 border-t-2 border-dga-green pt-3 text-[0.82em]">
          <p className="font-bold text-[#8A6A00]">{t(devOnlyNotice)}</p>
          <p className="mt-0.5 text-dga-muted">{t(selfAssessmentNote)}</p>
          <p className="mt-1.5">
            <span className="font-semibold">{t({ ar: 'رمز النتيجة: ', en: 'Result code: ' })}</span>
            <bdi dir="ltr" className="font-mono tracking-wider" data-testid="report-code">
              {code}
            </bdi>
            <span className="text-dga-muted">
              {' — '}
              {t({ ar: 'يحمل فئة الدور والدرجات المقرّبة وشهر التقييم فقط؛ مشاركته اختيارك.', en: 'holds only the role category, rounded scores and the month; sharing it is your choice.' })}
            </span>
          </p>
          <p className="mt-1 text-dga-muted">{t({ ar: 'مفهوم مستقل — ليس منتجًا رسميًا لأي جهة.', en: 'An independent concept — not an official product of any entity.' })}</p>
        </div>
      </article>
    </div>
  )
}
