import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { domainById } from '../../data/domains'
import { scenariosForTrack } from '../../data/scenarios'
import type { ScenarioItem } from '../../data/scenarios'
import {
  bestOptionIndex,
  checkFocus,
  checkMeta,
  focusDecisions,
  mostMatureText,
  optionMaturity,
  shuffledOrder,
} from '../../data/leaders/brief'
import { claimById } from '../../data/claims'
import type { L } from '../../data/types'

/**
 * «فحص القرار القيادي» — the 8 executive-track scenarios, one per screen.
 * No self-rating scale and no score: the output is «3 قرارات تستحق وقتك».
 * State lives in this component and in sessionStorage only (never in `history`).
 */

const STORAGE_KEY = 'dsr-leader-check-v1'

interface Saved {
  /** -1 = intro, 0..n-1 = scenario, n = output */
  step: number
  /** scenario id → stored option index */
  answers: Record<string, number>
}

function loadSaved(items: ScenarioItem[]): Saved {
  const fresh: Saved = { step: -1, answers: {} }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh
    const parsed = JSON.parse(raw) as Partial<Saved>
    const answers: Record<string, number> = {}
    for (const item of items) {
      const v = parsed.answers?.[item.id]
      if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < item.options.length) answers[item.id] = v
    }
    let step = typeof parsed.step === 'number' && Number.isInteger(parsed.step) ? parsed.step : -1
    step = Math.min(Math.max(step, -1), items.length)
    // never show the output before every scenario is answered
    if (step === items.length && items.some((i) => answers[i.id] === undefined)) {
      step = items.findIndex((i) => answers[i.id] === undefined)
    }
    return { step, answers }
  } catch {
    return fresh
  }
}

function saveState(s: Saved) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* private mode or blocked storage: the check still works in memory */
  }
}

const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 12mm; }
  header, footer, nav, .no-print { display: none !important; }
  html, body { background: #fff !important; }
  .check-root { font-size: 9.5pt; line-height: 1.45; }
  .print-avoid { break-inside: avoid; page-break-inside: avoid; }
}
`

const label = {
  intro1: { ar: '8 مواقف قيادية من العمل الحكومي، في نحو 6 دقائق.', en: '8 leadership situations from government work, in about 6 minutes.' },
  intro2: {
    ar: 'اختر ما ستفعله فعلاً، لا ما يبدو أفضل. بعد كل اختيار ترى لماذا يُعد كل خيار أنضج أو أضعف.',
    en: 'Choose what you would actually do, not what sounds best. After each choice you see why each option is more or less mature.',
  },
  intro3: {
    ar: 'لا درجة ولا مقارنة بأحد. المخرج 3 قرارات تستحق وقتك، مع خطوة تالية لكل منها.',
    en: 'No score and no comparison with anyone. The output is 3 decisions worth your time, each with a next step.',
  },
  intro4: {
    ar: 'لا تُحفظ إجاباتك خارج هذه النافذة، ولا تُرسل إلى أي جهة.',
    en: 'Your answers are not kept outside this browser tab and are not sent anywhere.',
  },
  start: { ar: 'ابدأ الفحص', en: 'Start the check' },
  resume: { ar: 'أكمل من حيث توقفت', en: 'Continue where you left off' },
  progress: { ar: 'الموقف', en: 'Situation' },
  of: { ar: 'من', en: 'of' },
  optionsLabel: { ar: 'الخيارات', en: 'Options' },
  youChose: { ar: 'اخترت', en: 'You chose' },
  mostMature: { ar: 'الحركة الأنضج', en: 'The most mature move' },
  others: { ar: 'لماذا الخيارات الأخرى؟', en: 'Why the other options?' },
  prev: { ar: 'السابق', en: 'Previous' },
  next: { ar: 'التالي', en: 'Next' },
  finish: { ar: 'اعرض القرارات', en: 'Show the decisions' },
  chooseFirst: { ar: 'اختر خياراً للمتابعة.', en: 'Choose an option to continue.' },
  outputIntro: {
    ar: 'اخترنا هذه المواقف لأن خيارك فيها كان الأبعد عن الحركة الأنضج. لا نحسب درجة ولا نقارنك بأحد؛ هذه نقطة بداية لحوار مع فريقك.',
    en: 'We picked these situations because your choice there was furthest from the most mature move. We compute no score and compare you with no one; this is a starting point for a conversation with your team.',
  },
  alreadyBest: {
    ar: 'اخترت الحركة الأنضج هنا؛ الخطوة التالية تحوّلها إلى قاعدة ثابتة في جهتك.',
    en: 'You chose the most mature move here; the next step turns it into a standing rule in your entity.',
  },
  nextStep: { ar: 'خطوتك التالية', en: 'Your next step' },
  print: { ar: 'اطبع القرارات', en: 'Print the decisions' },
  restart: { ar: 'ابدأ من جديد', en: 'Start again' },
  toBrief: { ar: 'عُد إلى الموجز القيادي', en: 'Back to the leader brief' },
  toMap: { ar: 'خريطة تحوّل العمل الحكومي', en: 'The government work-shift map' },
} satisfies Record<string, L>

export default function LeaderCheck() {
  const { t, lang } = useApp()
  const href = (path: string) => `/${lang}/${path}`
  const items = useMemo(() => scenariosForTrack('executive'), [])
  const n = items.length
  const [state, setState] = useState<Saved>(() => loadSaved(items))
  const headingRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  useEffect(() => saveState(state), [state])

  // move focus to the new screen's heading on every step change (not on first paint)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [state.step])

  const answeredCount = items.filter((i) => state.answers[i.id] !== undefined).length
  const setStep = (step: number) => setState((s) => ({ ...s, step }))
  const choose = (item: ScenarioItem, storedIndex: number) => {
    if (state.answers[item.id] !== undefined) return
    setState((s) => ({ ...s, answers: { ...s.answers, [item.id]: storedIndex } }))
    window.setTimeout(() => feedbackRef.current?.focus(), 0)
  }
  const restart = () => {
    setState({ step: -1, answers: {} })
  }

  const editorial = claimById(checkMeta.claimId)
  const editorialChip = (
    <span className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber-tx" title={editorial ? t(editorial.text) : undefined}>
      {t(checkMeta.label)}
    </span>
  )

  // ── Intro ────────────────────────────────────────────────────────
  if (state.step < 0) {
    return (
      <div className="check-root mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="eyebrow">{t({ ar: 'للقادة والفرق', en: 'Leaders & teams' })}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-bold text-dga-black sm:text-4xl">
          {t(checkMeta.title)}
        </h1>
        <p className="mt-3">{editorialChip}</p>
        <ul className="glass mt-6 space-y-3 p-6 leading-relaxed text-dga-ink">
          {[label.intro1, label.intro2, label.intro3, label.intro4].map((line, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" />
              <span>{t(line)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={() => setStep(answeredCount > 0 && answeredCount < n ? answeredCount : 0)}>
            {answeredCount > 0 && answeredCount < n ? t(label.resume) : t(label.start)}
          </button>
          <Link to={href('leaders/brief')} className="btn-ghost hover:no-underline">
            {t(label.toBrief)}
          </Link>
        </div>
      </div>
    )
  }

  // ── Output: «3 قرارات تستحق وقتك» ─────────────────────────────────
  if (state.step >= n) {
    const focus = focusDecisions(items, state.answers, 3)
    return (
      <div className="check-root mx-auto max-w-4xl px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
        <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
        <p className="eyebrow">{t(checkMeta.title)}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-bold text-dga-black sm:text-4xl">
          {t(checkMeta.outputTitle)}
        </h1>
        <p className="mt-3">{editorialChip}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-dga-muted">{t(label.outputIntro)}</p>
        <ol className="mt-6 space-y-5">
          {focus.map((item, i) => {
            const chosenIdx = state.answers[item.id]
            const chosen = item.options[chosenIdx]
            const bestIdx = bestOptionIndex(item)
            const meta = checkFocus[item.id]
            return (
              <li key={item.id} className="glass print-avoid p-6 print:p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-dga-green text-sm font-bold text-white" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h2 className="text-lg font-bold text-dga-black">{meta ? t(meta.title) : t(item.question)}</h2>
                  <span className="chip-info">{t(domainById(item.domainId).shortName)}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-dga-muted">{t(item.situation)}</p>
                <dl className="mt-3 grid gap-3 text-sm leading-relaxed sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-dga-ink">
                      {t(label.youChose)} <span className="chip ms-1">{t(optionMaturity[chosen.score])}</span>
                    </dt>
                    <dd className="mt-1 text-dga-ink">{t(chosen.text)}</dd>
                  </div>
                  {chosenIdx !== bestIdx ? (
                    <div>
                      <dt className="font-semibold text-dga-green-dark">{t(label.mostMature)}</dt>
                      <dd className="mt-1 text-dga-ink">{t(mostMatureText(item))}</dd>
                    </div>
                  ) : (
                    <div>
                      <dt className="font-semibold text-dga-green-dark">{t(label.mostMature)}</dt>
                      <dd className="mt-1 text-dga-ink">{t(label.alreadyBest)}</dd>
                    </div>
                  )}
                </dl>
                {meta && (
                  <p className="mt-4 rounded-btn bg-dga-green/5 px-3 py-2 text-sm leading-relaxed text-dga-black">
                    <span className="font-semibold text-dga-green-dark">{t(label.nextStep)}: </span>
                    {t(meta.nextStep)}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
        <div className="no-print mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={() => window.print()}>
            {t(label.print)}
          </button>
          <button type="button" className="btn-ghost" onClick={restart}>
            {t(label.restart)}
          </button>
          <Link to={href('leaders/brief')} className="btn-ghost hover:no-underline">
            {t(label.toBrief)}
          </Link>
          <Link to={href('work/shifts')} className="btn-ghost hover:no-underline">
            {t(label.toMap)}
          </Link>
        </div>
      </div>
    )
  }

  // ── One scenario per screen ──────────────────────────────────────
  const item = items[state.step]
  const order = shuffledOrder(item.id, item.options.length)
  const chosenIdx = state.answers[item.id]
  const answered = chosenIdx !== undefined
  const bestIdx = bestOptionIndex(item)
  const isLast = state.step === n - 1
  const progressId = 'leader-check-progress'

  return (
    <div className="check-root mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">{t(checkMeta.title)}</p>
        {editorialChip}
      </div>

      <div className="mt-4">
        <p id={progressId} className="text-sm font-medium text-dga-muted">
          {t(label.progress)} {state.step + 1} {t(label.of)} {n}
        </p>
        <div
          role="progressbar"
          aria-labelledby={progressId}
          aria-valuemin={1}
          aria-valuemax={n}
          aria-valuenow={state.step + 1}
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-dga-line/60"
        >
          <div className="h-full rounded-full bg-dga-green transition-all duration-300" style={{ width: `${((state.step + 1) / n) * 100}%` }} />
        </div>
      </div>

      <div className="glass mt-6 p-6">
        <span className="chip-info">{t(domainById(item.domainId).shortName)}</span>
        <p className="mt-3 leading-relaxed text-dga-ink">{t(item.situation)}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-xl font-bold text-dga-black">
          {t(item.question)}
        </h1>

        <ul aria-label={t(label.optionsLabel)} className="mt-4 space-y-3">
          {order.map((storedIdx) => {
            const opt = item.options[storedIdx]
            const isChosen = chosenIdx === storedIdx
            const isBest = storedIdx === bestIdx
            const tone = !answered
              ? 'border-dga-line hover:border-dga-green hover:bg-dga-green/5'
              : isChosen
                ? 'border-dga-green bg-dga-green/5'
                : isBest
                  ? 'border-dga-green/50'
                  : 'border-dga-line opacity-70'
            return (
              <li key={storedIdx}>
                <button
                  type="button"
                  aria-pressed={isChosen}
                  disabled={answered && !isChosen}
                  aria-disabled={answered}
                  onClick={() => choose(item, storedIdx)}
                  className={`w-full rounded-btn border bg-white px-4 py-3 text-start leading-relaxed text-dga-ink transition-colors ${tone} ${answered ? 'cursor-default' : ''}`}
                >
                  {t(opt.text)}
                  {answered && (isChosen || isBest) && (
                    <span className="mt-1 block text-xs font-semibold text-dga-green-dark">
                      {isChosen ? `${t(label.youChose)} · ` : ''}
                      {t(optionMaturity[opt.score])}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div ref={feedbackRef} tabIndex={-1} aria-live="polite" className="mt-5 outline-none">
          {answered && (
            <div className="space-y-3 rounded-btn border-s-4 border-dga-green bg-dga-green/5 p-4 text-sm leading-relaxed">
              <p>
                <span className="font-semibold text-dga-green-dark">
                  {t(label.youChose)} — {t(optionMaturity[item.options[chosenIdx].score])}:{' '}
                </span>
                {t(item.options[chosenIdx].rationale)}
              </p>
              {chosenIdx !== bestIdx && (
                <p>
                  <span className="font-semibold text-dga-green-dark">{t(label.mostMature)}: </span>
                  {t(mostMatureText(item))} — {t(item.options[bestIdx].rationale)}
                </p>
              )}
              <details>
                <summary className="cursor-pointer font-semibold text-dga-ink">{t(label.others)}</summary>
                <ul className="mt-2 space-y-2">
                  {order
                    .filter((idx) => idx !== chosenIdx && idx !== bestIdx)
                    .map((idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{t(optionMaturity[item.options[idx].score])}: </span>
                        {t(item.options[idx].text)} — <span className="text-dga-muted">{t(item.options[idx].rationale)}</span>
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={() => setStep(state.step - 1)}>
          {t(label.prev)}
        </button>
        <div className="flex items-center gap-3">
          {!answered && <span className="text-sm text-dga-muted">{t(label.chooseFirst)}</span>}
          <button
            type="button"
            className={`btn-primary ${answered ? '' : 'pointer-events-none opacity-50'}`}
            disabled={!answered}
            onClick={() => setStep(state.step + 1)}
          >
            {isLast ? t(label.finish) : t(label.next)}
          </button>
        </div>
      </div>
    </div>
  )
}
