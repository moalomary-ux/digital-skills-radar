import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { nationalPrograms, transitionNames } from '../data/learning'
import { managerAsks, PLAN_PHASES, planForPriority } from '../data/pathways'
import type { PriorityPlan } from '../data/pathways'
import { priorities as computePriorities, reasonLabel, summaryLine, targetsForRecord } from '../lib/priorities'
import type { Priority } from '../lib/priorities'
import { buildPlanIcs, CHECKPOINT_DAYS, downloadText, formatLongDate, PLAN_WEEKS, planDay } from '../lib/ics'
import Disclaimer from '../components/Disclaimer'
import Icon from '../components/Icon'

function Num({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className}`}>
      {children}
    </bdi>
  )
}

const typeLabel = {
  course: { ar: 'دورة', en: 'Course' },
  certification: { ar: 'شهادة', en: 'Certification' },
  program: { ar: 'برنامج', en: 'Programme' },
  reference: { ar: 'مرجع', en: 'Reference' },
} as const

/* ------------------------------------------------------------- progress storage */

export const LS_PLAN = 'dsr-plan-progress'
/** { [resultId]: { [domainId]: week numbers done } } */
type PlanProgress = Record<string, Record<string, number[]>>

function loadProgress(): PlanProgress {
  try {
    const raw = localStorage.getItem(LS_PLAN)
    const parsed = raw ? (JSON.parse(raw) as unknown) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as PlanProgress) : {}
  } catch {
    return {}
  }
}

function useWeekTracker(resultId: string | undefined) {
  const [all, setAll] = useState<PlanProgress>(loadProgress)
  const mine = (resultId && all[resultId]) || {}
  useEffect(() => {
    try {
      localStorage.setItem(LS_PLAN, JSON.stringify(all))
    } catch {
      /* storage unavailable: progress lives for this visit only */
    }
  }, [all])
  const toggle = useCallback(
    (domainId: string, week: number) => {
      if (!resultId) return
      setAll((prev) => {
        const current = prev[resultId]?.[domainId] ?? []
        const next = current.includes(week) ? current.filter((w) => w !== week) : [...current, week].sort((a, b) => a - b)
        return { ...prev, [resultId]: { ...(prev[resultId] ?? {}), [domainId]: next } }
      })
    },
    [resultId]
  )
  const done = (domainId: string) => (Array.isArray(mine[domainId]) ? mine[domainId].filter((w) => w >= 1 && w <= PLAN_WEEKS) : [])
  return { done, toggle }
}

/* ------------------------------------------------------------------ page */

export default function Pathways() {
  const { t, lang, go, history } = useApp()
  const latest = history[history.length - 1]
  const tracker = useWeekTracker(latest?.id)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [icsNote, setIcsNote] = useState('')

  const model = useMemo(() => {
    if (!latest) return null
    const prio = computePriorities(latest, targetsForRecord(latest), domains)
    const plans = prio.map((p) => planForPriority(p))
    const start = new Date(latest.date)
    const day1 = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    return { prio, plans, day1 }
  }, [latest])

  if (!latest || !model) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="glass p-10">
          <Icon name="compass" className="mx-auto h-10 w-10 text-dga-green" />
          <h1 className="mt-4 text-2xl font-bold">{t({ ar: 'خطتك تبدأ من التقييم', en: 'Your plan starts with the assessment' })}</h1>
          <p className="mt-3 text-dga-muted">
            {t({
              ar: 'بعد إكمال التقييم تظهر أولويات تطويرك المقترحة، وتُبنى عليها خطتك للأيام الـ90 المقبلة.',
              en: 'Once you complete the assessment, your suggested development priorities appear and your plan for the next 90 days is built on them.',
            })}
          </p>
          <button type="button" onClick={() => go('wizard')} className="btn-primary mt-6">
            {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
          </button>
        </div>
      </div>
    )
  }

  const { prio, plans, day1 } = model
  const asks = managerAsks(prio.map((p) => p.domainName))
  const checkpoints = CHECKPOINT_DAYS.map((d) => ({ day: d, date: planDay(day1, d) }))
  const totalWeeks = plans.length * PLAN_WEEKS
  const doneWeeks = plans.reduce((n, p) => n + tracker.done(p.domainId).length, 0)
  const pct = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0)
  const isOpen = (id: string, i: number) => open[id] ?? i === 0

  const downloadIcs = () => {
    const weeks = Array.from({ length: PLAN_WEEKS }, (_, i) => {
      const w = i + 1
      const lines = plans.map((p) => (lang === 'ar' ? `«${p.domainName.ar}»: ${p.weeks[i].text.ar}` : `“${p.domainName.en}”: ${p.weeks[i].text.en}`))
      const mid = w === 7 ? t({ ar: ' — مراجعة منتصف الخطة', en: ' — mid-plan review' }) : ''
      return {
        title: t({ ar: `خطتي — الأسبوع ${w} من ${PLAN_WEEKS}${mid}`, en: `My plan — week ${w} of ${PLAN_WEEKS}${mid}` }),
        description: lines.join('\n'),
      }
    })
    const ics = buildPlanIcs({
      start: day1,
      calendarName: t({ ar: 'خطتي للأيام الـ90 المقبلة', en: 'My plan for the next 90 days' }),
      weeks,
      recheck: {
        title: t({ ar: 'اليوم 90: أعد التقييم الذاتي', en: 'Day 90: retake the self-assessment' }),
        description: t({
          ar: 'افتح رادار المهارات الرقمية وأعد التقييم الذاتي لترى المضلع الجديد فوق السابق، ثم راجع النتيجة مع مديرك.',
          en: 'Open the Digital Skills Radar and retake the self-assessment to see the new polygon over the previous one, then review it with your manager.',
        }),
      },
      uidSeed: latest.id,
    })
    const ok = downloadText(`my-90-day-plan-${latest.date.slice(0, 10)}.ics`, ics, 'text/calendar;charset=utf-8')
    setIcsNote(
      ok
        ? t({ ar: 'نُزّل ملف التقويم: 13 تذكيرًا أسبوعيًا وتذكير إعادة التقييم في اليوم 90.', en: 'Calendar file downloaded: 13 weekly reminders and a re-check on day 90.' })
        : t({ ar: 'تعذّر التنزيل في هذا المتصفح.', en: 'Download is not available in this browser.' })
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="eyebrow">{t({ ar: 'خطتي', en: 'My plan' })}</p>
      <h1 className="mt-2 text-3xl font-bold">{t({ ar: 'خطتك للأيام الـ90 المقبلة', en: 'Your plan for the next 90 days' })}</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-dga-muted">{summaryLine(prio, lang)}</p>
      <p className="mt-2 text-sm text-dga-ink">
        {t({ ar: 'تبدأ الخطة في ', en: 'The plan starts on ' })}
        <span className="font-semibold">{formatLongDate(day1, lang)}</span>
        {t({ ar: '، ومدتها ', en: ' and runs for ' })}
        <Num>{PLAN_WEEKS}</Num> {t({ ar: 'أسبوعًا.', en: 'weeks.' })}
      </p>

      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-dga-muted">
        <span className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber-tx">{t({ ar: 'خطة تحريرية مقترحة', en: 'Suggested editorial plan' })}</span>
        <span>
          {t({
            ar: 'الخطوات الأسبوعية وما فيها من أعداد اقتراح تحريري للتعلم بالممارسة، لا معيار منشور؛ عدّلها مع مديرك بما يناسب عملك.',
            en: 'The weekly steps and the counts in them are an editorial suggestion for learning by doing, not a published standard; adjust them with your manager to fit your work.',
          })}
        </span>
      </p>

      <Disclaimer compact className="mt-4" />

      {/* live progress */}
      <section className="mt-6 glass p-5" aria-labelledby="progress-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="progress-h" className="text-sm font-bold text-dga-ink">{t({ ar: 'تقدّمك', en: 'Your progress' })}</h2>
          <p className="text-xs text-dga-muted" aria-live="polite" data-testid="plan-progress">
            <Num>{doneWeeks}</Num> {t({ ar: 'من', en: 'of' })} <Num>{totalWeeks}</Num> {t({ ar: 'خطوة أسبوعية', en: 'weekly steps' })} · <Num>{pct(doneWeeks, totalWeeks)}%</Num>
          </p>
        </div>
        <Bar value={pct(doneWeeks, totalWeeks)} label={t({ ar: 'التقدم الكلي', en: 'Overall progress' })} />
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {plans.map((p) => {
            const n = tracker.done(p.domainId).length
            return (
              <li key={p.domainId}>
                <p className="flex justify-between gap-2 text-xs">
                  <span className="font-semibold text-dga-black">{t(p.domainName)}</span>
                  <span className="text-dga-muted">
                    <Num>{`${n} / ${PLAN_WEEKS}`}</Num>
                  </span>
                </p>
                <Bar value={pct(n, PLAN_WEEKS)} label={t(p.domainName)} small />
              </li>
            )
          })}
        </ul>
      </section>

      {/* plans per priority */}
      <div className="mt-8 space-y-6">
        {plans.map((plan, i) => (
          <PlanCard
            key={plan.domainId}
            plan={plan}
            p={prio[i]}
            done={tracker.done(plan.domainId)}
            onToggle={(w) => tracker.toggle(plan.domainId, w)}
            open={isOpen(plan.domainId, i)}
            onOpen={() => setOpen((o) => ({ ...o, [plan.domainId]: !isOpen(plan.domainId, i) }))}
            day1={day1}
          />
        ))}
      </div>

      {/* manager asks + checkpoints */}
      <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <section className="glass p-6" aria-labelledby="manager-h">
          <h2 id="manager-h" className="text-lg font-bold text-dga-black">{t({ ar: 'ما أحتاجه من مديري', en: 'What I need from my manager' })}</h2>
          <ul className="mt-4 space-y-3">
            {asks.map((a) => (
              <li key={a.id} className="rounded-btn border border-dga-line bg-dga-bg p-3">
                <p className="text-sm font-bold text-dga-green-dark">{t(a.title)}</p>
                <p className="mt-1 text-sm leading-relaxed text-dga-ink">{t(a.text)}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="glass p-6" aria-labelledby="checkpoints-h">
          <h2 id="checkpoints-h" className="text-lg font-bold text-dga-black">{t({ ar: 'نقطتا المراجعة', en: 'Two checkpoints' })}</h2>
          <ul className="mt-4 space-y-3">
            {checkpoints.map((c) => (
              <li key={c.day} className="flex items-start gap-3">
                <span className="grid h-9 w-14 shrink-0 place-items-center rounded-btn bg-dga-amber/15 text-xs font-bold text-dga-amber-tx">
                  {t({ ar: 'اليوم', en: 'Day' })} <Num>{c.day}</Num>
                </span>
                <span className="text-sm">
                  <span className="block font-semibold text-dga-black">{formatLongDate(c.date, lang)}</span>
                  <span className="block text-xs text-dga-muted">
                    {c.day === 90
                      ? t({ ar: 'أعد التقييم وراجع النتيجة مع مديرك.', en: 'Retake the assessment and review it with your manager.' })
                      : t({ ar: 'مراجعة منتصف الخطة مع مديرك.', en: 'Mid-plan review with your manager.' })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* actions */}
      <div className="no-print mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={downloadIcs} className="btn-primary px-5 py-2.5 text-sm">
          {t({ ar: 'تنزيل ملف التقويم (.ics)', en: 'Download the calendar file (.ics)' })}
        </button>
        <button type="button" onClick={() => go('report')} className="btn-ghost px-5 py-2.5 text-sm">
          {t({ ar: 'ورقة حوار التطوير', en: 'Development conversation sheet' })}
        </button>
        <button type="button" onClick={() => go('results')} className="btn-ghost px-5 py-2.5 text-sm">
          {t({ ar: 'العودة إلى النتائج', en: 'Back to results' })}
        </button>
      </div>
      <p className="mt-2 min-h-[1.25rem] text-xs text-dga-muted" role="status" aria-live="polite">
        {icsNote}
      </p>

      {/* learning routes for government employees */}
      <section className="mt-8" aria-labelledby="routes-h">
        <h2 id="routes-h" className="mb-4 text-xl font-bold text-dga-green-dark">{t({ ar: 'جهات تعلّم للموظف الحكومي', en: 'Learning routes for government employees' })}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {nationalPrograms.map((p) => {
            const body = (
              <>
                <h3 className="font-bold text-dga-black">{t(p.name)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-dga-muted">{t(p.description)}</p>
              </>
            )
            return p.url ? (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="glass block p-5 no-underline transition-colors hover:border-dga-green">
                {body}
              </a>
            ) : (
              <div key={p.id} className="glass p-5">
                {body}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ parts */

function Bar({ value, label, small = false }: { value: number; label: string; small?: boolean }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={`mt-2 overflow-hidden rounded-full bg-dga-line/50 ${small ? 'h-1.5' : 'h-2.5'}`}
    >
      <div className="h-full rounded-full bg-dga-green transition-[width] duration-300 ease-out motion-reduce:transition-none" style={{ width: `${value}%` }} />
    </div>
  )
}

function PlanCard({
  plan,
  p,
  done,
  onToggle,
  open,
  onOpen,
  day1,
}: {
  plan: PriorityPlan
  p: Priority
  done: number[]
  onToggle: (week: number) => void
  open: boolean
  onOpen: () => void
  day1: Date
}) {
  const { t, lang } = useApp()
  const listId = `weeks-${plan.domainId}`
  const [r1, r2] = plan.resources
  const weekStart = (w: number) => planDay(day1, 1 + (w - 1) * 7)
  const shortDate = (d: Date) => d.toLocaleDateString(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'short' })
  return (
    <article className="glass overflow-hidden" data-testid="plan-card" data-domain={plan.domainId}>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-dga-line bg-dga-bg p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-dga-green text-sm font-bold text-white" aria-hidden>
            {p.rank}
          </span>
          <div>
            <h2 className="text-lg font-bold">
              <span className="sr-only">{t({ ar: `الأولوية ${p.rank}: `, en: `Priority ${p.rank}: ` })}</span>
              {t(plan.domainName)}
            </h2>
            <p className="text-xs text-dga-muted">
              {t(reasonLabel[p.reason])} · {t(transitionNames[plan.transition])}
            </p>
          </div>
        </div>
        <p className="flex items-center gap-2 text-xs">
          <span className="chip border-dga-green/30 bg-dga-green/10 text-dga-green-dark">
            {t({ ar: 'من: ', en: 'From: ' })}
            {t(plan.from.name)}
          </span>
          <span aria-hidden className="text-dga-muted">{lang === 'ar' ? '←' : '→'}</span>
          <span className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber-tx">
            {t({ ar: 'إلى: ', en: 'To: ' })}
            {t(plan.to.name)}
          </span>
        </p>
      </header>

      <div className="p-5">
        <p className="text-sm leading-relaxed text-dga-ink">{t(p.text)}</p>
        <h3 className="mt-4 text-sm font-bold text-dga-green-dark">{t({ ar: 'ثلاثة سلوكيات عبر الأسابيع الـ13', en: 'Three behaviours across the 13 weeks' })}</h3>
        <ol className="mt-3 grid gap-3 md:grid-cols-3">
          {plan.behaviours.map((b, bi) => (
            <li key={bi} className="rounded-btn border border-dga-line bg-white p-3 text-sm leading-relaxed">
              <span className="mb-1 block text-[11px] font-bold text-dga-amber-tx">
                {t({ ar: 'الأسابيع ', en: 'Weeks ' })}
                <Num>{`${PLAN_PHASES[bi][0]}–${PLAN_PHASES[bi][1]}`}</Num>
              </span>
              {t(b)}
            </li>
          ))}
        </ol>

        <h3 className="mt-5 text-sm font-bold text-dga-amber-tx">{t({ ar: 'مورِدا التعلم', en: 'Two learning resources' })}</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {[r1, r2].map((res) => (
            <li key={res.url + res.title.en}>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-btn border border-dga-line bg-dga-bg px-3 py-2.5 no-underline transition-colors hover:border-dga-amber"
              >
                <span>
                  <span className="block text-sm font-semibold text-dga-black">{t(res.title)}</span>
                  <span className="block text-[11px] text-dga-muted" dir="ltr">
                    {res.provider}
                  </span>
                </span>
                <span className="chip shrink-0 text-[10px]">{t(typeLabel[res.type])}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-dga-line">
        <button type="button" onClick={onOpen} aria-expanded={open} aria-controls={listId} className="no-print flex w-full items-center justify-between gap-3 p-4 text-start hover:bg-dga-bg">
          <span>
            <span className="block text-sm font-bold">{t({ ar: 'الخطوات الأسبوعية — علّم ما أنجزته', en: 'Weekly steps — tick what you have done' })}</span>
            <span className="block text-[11.5px] text-dga-muted">{t(plan.goal)}</span>
          </span>
          <span className="shrink-0 text-xs text-dga-muted">
            <Num>{`${done.length} / ${PLAN_WEEKS}`}</Num> <span aria-hidden className={`inline-block transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
          </span>
        </button>
        <ol id={listId} className={`${open ? '' : 'hidden'} space-y-2 px-4 pb-5 print:block`}>
          {plan.weeks.map((w) => {
            const checked = done.includes(w.w)
            const id = `wk-${plan.domainId}-${w.w}`
            return (
              <li key={w.w} className={`flex gap-3 rounded-btn border p-3 ${w.checkpoint ? 'border-dga-amber/60 bg-dga-amber/5' : 'border-dga-line bg-white'}`}>
                <input id={id} type="checkbox" checked={checked} onChange={() => onToggle(w.w)} className="mt-1 h-4 w-4 shrink-0 accent-dga-green" />
                <label htmlFor={id} className={`text-[13px] leading-relaxed ${checked ? 'text-dga-muted line-through decoration-dga-green/60' : 'text-dga-ink'}`}>
                  <span className="me-2 font-bold text-dga-green-dark">
                    {t({ ar: 'الأسبوع ', en: 'Week ' })}
                    <Num>{w.w}</Num>
                  </span>
                  <span className="me-2 text-[11px] text-dga-muted">({shortDate(weekStart(w.w))})</span>
                  {w.checkpoint && <span className="me-2 chip border-dga-amber/50 text-[10px] text-dga-amber-tx">{t({ ar: 'نقطة مراجعة', en: 'Checkpoint' })}</span>}
                  {t(w.text)}
                </label>
              </li>
            )
          })}
        </ol>
      </div>
    </article>
  )
}

