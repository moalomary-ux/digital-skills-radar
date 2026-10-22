import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { useApp, computeScores, RESULT_SCHEMA_VERSION } from '../store'
import type { KnowledgeTally, ResultRecord } from '../store'
import { domains, domainById } from '../data/domains'
import { statementsByDomain, statements } from '../data/statements'
import { familyNames, familyOrder, libraryRoles, LIB_PREFIX, libraryRoleById } from '../data/roleLibrary'
import { levelForScore, levelForTarget, scaleOptions } from '../data/levels'
import { questionsForDomain } from '../data/learning'
import { tracks, trackById } from '../data/tracks'
import { scenariosForTrack } from '../data/scenarios'
import { CATEGORY_ROLE_PREFIX, isCategoryId, MIN_KNOWLEDGE_ATTEMPTS, targetsFor } from '../lib/priorities'
import Icon from '../components/Icon'
import RadarChart from '../components/RadarChart'
import Disclaimer from '../components/Disclaimer'

/** Deterministic per-item shuffle so stored worst→best order never leaks position. */
function shuffledIndices(id: string, n: number): number[] {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const arr = [...Array(n).keys()]
  for (let i = n - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0
    const j = h % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Numbers inside Arabic text are always isolated left-to-right. */
function Num({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className}`}>
      {children}
    </bdi>
  )
}

const SCENARIO_BASE = 9 // steps 1..8 = domains, 9..16 = judgment scenarios (siblings, never nested)

export default function Wizard() {
  const {
    t, lang, go, dir,
    roleId, setRoleId,
    answers, setAnswer,
    calibrationAnswers, setCalibrationAnswer,
    scenarioAnswers, setScenarioAnswer,
    trackId, setTrackId,
    saveResult, resetDraft,
  } = useApp()
  const reduceMotion = useReducedMotion()
  const category = isCategoryId(trackId) ? trackId : null
  const trackScenarios = useMemo(() => (category ? scenariosForTrack(category) : []), [category])
  const domainDoneAt = (i: number) => statementsByDomain(domains[i].id).every((s) => answers[s.id] !== undefined)
  const firstOpenDomain = domains.findIndex((_, i) => !domainDoneAt(i)) // -1 when all done

  // Entrances that set only a role (home employee card, role cards, role sheet) never skip step 0:
  // without a role category we start at the category question with the role preselected.
  // `/assess?domain=<id>` (from the skills map) starts the questions at that domain once a category exists.
  const [search] = useSearchParams()
  const wantedDomainIndex = domains.findIndex((d) => d.id === search.get('domain'))
  const [step, setStep] = useState(() => {
    if (!category || Object.keys(answers).length === 0) return 0
    if (wantedDomainIndex >= 0) return wantedDomainIndex + 1
    if (firstOpenDomain >= 0) return firstOpenDomain + 1
    const firstOpenScenario = trackScenarios.findIndex((s) => scenarioAnswers[s.id] === undefined)
    return SCENARIO_BASE + Math.max(0, firstOpenScenario === -1 ? trackScenarios.length - 1 : firstOpenScenario)
  })
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [roleListOpen, setRoleListOpen] = useState(() => !!roleId && roleId.startsWith(LIB_PREFIX))
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  // Move focus to the new step's heading (not on first load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  // A step beyond what the category allows (e.g. the draft lost its category) falls back to step 0.
  useEffect(() => {
    if (step > 0 && !category) setStep(0)
  }, [step, category])

  const answeredStatements = statements.filter((s) => answers[s.id] !== undefined).length
  const answeredScenarios = trackScenarios.filter((s) => scenarioAnswers[s.id] !== undefined).length
  const totalItems = statements.length + (trackScenarios.length || domains.length)
  const progress = Math.round(((answeredStatements + answeredScenarios) / totalItems) * 100)

  const scenarioIndex = step - SCENARIO_BASE
  const scenario = scenarioIndex >= 0 && scenarioIndex < trackScenarios.length ? trackScenarios[scenarioIndex] : null
  const domainIndex = step - 1
  const domain = step >= 1 && domainIndex < domains.length ? domains[domainIndex] : null
  const domainStatements = domain ? statementsByDomain(domain.id) : []
  const domainQuestions = domain ? questionsForDomain(domain.id) : []
  const domainDone = domainStatements.every((s) => answers[s.id] !== undefined)

  const targets = targetsFor(roleId, category)
  const preciseRole = roleId && roleId.startsWith(LIB_PREFIX) ? libraryRoleById(roleId.slice(LIB_PREFIX.length)) : undefined

  // live radar: mean of the statements answered so far in each domain
  const liveValues = domains.map((d) => {
    const vals = statementsByDomain(d.id).map((s) => answers[s.id]).filter((v): v is number => v !== undefined)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
  })

  const finish = () => {
    if (!category) return
    const groups = domains.map((d) => ({ domainId: d.id, ids: statementsByDomain(d.id).map((s) => s.id) }))
    const { scores, overall } = computeScores(answers, groups)
    const knowledge: Record<string, KnowledgeTally> = {}
    for (const d of domains) {
      const qs = questionsForDomain(d.id)
      const attempted = qs.filter((q) => calibrationAnswers[q.id] !== undefined)
      if (attempted.length > 0) {
        knowledge[d.id] = { attempted: attempted.length, correct: attempted.filter((q) => calibrationAnswers[q.id] === q.answer).length }
      }
    }
    const scenarioScores: Record<string, number> = {}
    const scenarioChoices: Record<string, number> = {}
    for (const item of trackScenarios) {
      const chosen = scenarioAnswers[item.id]
      if (chosen === undefined) continue
      scenarioScores[item.domainId] = item.options[chosen]?.score ?? 0
      scenarioChoices[item.id] = chosen
    }
    const rec: ResultRecord = {
      v: RESULT_SCHEMA_VERSION,
      id: `r-${Date.now()}`,
      date: new Date().toISOString(),
      roleId: preciseRole ? LIB_PREFIX + preciseRole.id : CATEGORY_ROLE_PREFIX + category,
      trackId: category,
      answers: { ...answers },
      scores,
      overall,
      ...(Object.keys(knowledge).length > 0 ? { knowledge } : {}),
      ...(Object.keys(scenarioScores).length > 0 ? { scenario: scenarioScores, scenarioChoices } : {}),
    }
    saveResult(rec)
    // keep the category (and precise role) for the next re-assessment; clear the answers
    const keepRole = roleId
    resetDraft()
    setTrackId(category)
    if (keepRole && keepRole.startsWith(LIB_PREFIX)) setRoleId(keepRole)
    go('results')
  }

  const goToStep = (n: number) => {
    setStep(n)
    setKnowledgeOpen(false)
    window.scrollTo({ top: 0 })
  }

  const enter = reduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 * (dir === 'rtl' ? -1 : 1) }
  const forward = lang === 'ar' ? '←' : '→'
  const backward = lang === 'ar' ? '→' : '←'

  const stepLabel =
    step === 0
      ? t({ ar: 'الخطوة الأولى — فئة الدور', en: 'Step 1 — role category' })
      : scenario
        ? t({ ar: 'مواقف الحكم المهني', en: 'Professional judgment scenarios' })
        : t({ ar: 'التقييم الذاتي', en: 'Self-assessment' })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* progress — one number for text and bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-dga-muted">
          <span>{stepLabel}</span>
          <span className="font-semibold text-dga-green-dark">
            <Num>{progress}%</Num>
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-dga-line/50"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={t({ ar: 'نسبة الإنجاز', en: 'Completion' })}
        >
          <div className="h-full rounded-full bg-dga-green transition-[width] duration-500 ease-out motion-reduce:transition-none" style={{ width: `${Math.max(2, progress)}%` }} />
        </div>
      </div>

      {/* ── Step 0: one question — the role category ── */}
      {step === 0 && (
        <motion.div key="category" initial={enter} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-3xl">
          <p className="eyebrow">{t({ ar: 'تقييمي', en: 'My assessment' })}</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-bold outline-none sm:text-3xl">
            {t({ ar: 'ما طبيعة دورك؟', en: 'What is the nature of your role?' })}
          </h1>
          <p className="mt-3 leading-relaxed text-dga-muted">
            {t({
              ar: 'اختر الفئة الأقرب إلى عملك اليوم. تضبط الفئة المستهدف الاسترشادي لكل مجال (المضلع المستهدف على الرادار) ومواقف الحكم المهني التي ستجيب عنها.',
              en: 'Choose the category closest to your work today. It sets the indicative target for each domain (the target polygon on the radar) and the professional-judgment scenarios you will answer.',
            })}
          </p>

          <Disclaimer className="mt-5" />

          <fieldset className="mt-7">
            <legend className="text-sm font-bold text-dga-ink">{t({ ar: 'فئة الدور', en: 'Role category' })}</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {tracks.map((tr) => {
                const active = category === tr.id
                return (
                  <label key={tr.id} className="block cursor-pointer">
                    <input
                      type="radio"
                      name="role-category"
                      value={tr.id}
                      checked={active}
                      onChange={() => {
                        setTrackId(tr.id)
                        if (roleId && !roleId.startsWith(LIB_PREFIX)) setRoleId(null)
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex h-full items-start gap-3 rounded-btn border p-4 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-dga-green peer-focus-visible:ring-offset-2 ${
                        active ? 'border-dga-green bg-dga-green/10' : 'border-dga-line bg-white hover:border-dga-green'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? 'border-dga-green bg-dga-green' : 'border-dga-line'}`}
                      >
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-dga-black">{t(tr.name)}</span>
                        <span className="mt-0.5 block text-xs text-dga-muted">{t(tr.audience)}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-dga-ink">{t(tr.proves)}</span>
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* optional precise role */}
          <div className="mt-6 rounded-card border border-dga-line bg-white">
            <button
              type="button"
              onClick={() => setRoleListOpen((p) => !p)}
              aria-expanded={roleListOpen}
              aria-controls="precise-role-list"
              className="flex w-full items-center justify-between gap-3 p-4 text-start"
            >
              <span>
                <span className="block text-sm font-bold text-dga-ink">{t({ ar: 'اختيار دور دقيق (اختياري)', en: 'Choose a precise role (optional)' })}</span>
                <span className="mt-0.5 block text-xs text-dga-muted">
                  {preciseRole
                    ? t({ ar: `اخترت: ${preciseRole.name.ar} — يحل مستهدفه محل مستهدف الفئة.`, en: `Selected: ${preciseRole.name.en} — its target replaces the category target.` })
                    : t({ ar: 'من مكتبة الأدوار؛ يحل مستهدف الدور محل مستهدف الفئة.', en: 'From the role library; the role target replaces the category target.' })}
                </span>
              </span>
              <span aria-hidden className={`text-dga-muted transition-transform ${roleListOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {roleListOpen && (
              <fieldset id="precise-role-list" className="border-t border-dga-line p-4">
                <legend className="sr-only">{t({ ar: 'دور دقيق من مكتبة الأدوار', en: 'Precise role from the role library' })}</legend>
                <ChoiceChip name="precise-role" checked={!preciseRole} onChange={() => setRoleId(null)}>
                  {t({ ar: 'بلا دور دقيق — استخدم مستهدف الفئة', en: 'No precise role — use the category target' })}
                </ChoiceChip>
                <div className="mt-3 space-y-3">
                  {familyOrder.map((fam) => {
                    const famRoles = libraryRoles.filter((r) => r.family === fam)
                    if (famRoles.length === 0) return null
                    return (
                      <div key={fam}>
                        <p className="mb-2 text-[11px] font-bold text-dga-amber-tx">{t(familyNames[fam])}</p>
                        <div className="flex flex-wrap gap-2">
                          {famRoles.map((r) => (
                            <ChoiceChip key={r.id} name="precise-role" checked={preciseRole?.id === r.id} onChange={() => setRoleId(LIB_PREFIX + r.id)}>
                              {t(r.name)}
                            </ChoiceChip>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </fieldset>
            )}
          </div>

          {category && (
            <div className="mt-6 rounded-card border border-dga-line bg-white p-4">
              <p className="text-xs font-bold text-dga-ink">
                {t({ ar: 'المستهدف الاسترشادي الذي ستُقارن به', en: 'The indicative target you will be compared with' })}
                {' · '}
                <span className="font-normal text-dga-muted">{preciseRole ? t(preciseRole.name) : t(trackById(category)!.name)}</span>
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
                {domains.map((d) => (
                  <li key={d.id} className="flex justify-between gap-2">
                    <span className="text-dga-muted">{t(d.shortName)}</span>
                    <span className="font-semibold text-dga-amber-tx">{t(levelForTarget(targets[d.id] ?? 2).name)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            {!category && <p id="cat-hint" className="text-xs text-dga-muted">{t({ ar: 'اختر فئة دورك للمتابعة.', en: 'Choose your role category to continue.' })}</p>}
            <button
              type="button"
              onClick={() => category && goToStep(wantedDomainIndex >= 0 ? wantedDomainIndex + 1 : firstOpenDomain >= 0 ? firstOpenDomain + 1 : SCENARIO_BASE)}
              disabled={!category}
              aria-describedby={!category ? 'cat-hint' : undefined}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t({ ar: 'ابدأ الأسئلة', en: 'Start the questions' })}
              <span aria-hidden>{forward}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Steps 1-8: domain statements (with live radar) ── */}
      {domain && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <motion.div key={domain.id} initial={enter} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <div className="mb-6 flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-dga-green/10 text-dga-green">
                <Icon name={domain.icon} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold text-dga-muted">
                  {t({ ar: 'المجال', en: 'Domain' })} <Num>{step}</Num> {t({ ar: 'من', en: 'of' })} <Num>{domains.length}</Num>
                </p>
                <h1 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none sm:text-2xl">
                  {t(domain.name)}
                </h1>
                <p className="mt-1 text-sm text-dga-muted">{t(domain.description)}</p>
              </div>
            </div>

            <div className="space-y-5">
              {domainStatements.map((s) => {
                const value = answers[s.id]
                const answered = value !== undefined
                const legendId = `st-${s.id}`
                return (
                  <fieldset key={s.id} aria-labelledby={legendId} className={`glass p-5 transition-colors ${answered ? 'border-dga-green/40' : ''}`}>
                    <div id={legendId}>
                      <p className="mb-1 text-[11px] font-semibold text-dga-amber-tx">{t(domain.skills[s.skillIndex])}</p>
                      <p className="mb-4 font-medium leading-relaxed">{t(s.text)}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                      {scaleOptions.map((opt) => {
                        const active = value === opt.value
                        return (
                          <label key={opt.value} className="block cursor-pointer">
                            <input
                              type="radio"
                              name={s.id}
                              value={opt.value}
                              checked={active}
                              onChange={() => setAnswer(s.id, opt.value)}
                              className="peer sr-only"
                            />
                            <span
                              className={`flex h-full items-start gap-2 rounded-xl border px-3 py-2.5 text-xs leading-snug transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-dga-green peer-focus-visible:ring-offset-1 sm:flex-col sm:items-stretch ${
                                active ? 'border-dga-green bg-dga-green/10 font-semibold text-dga-green-dark' : 'border-dga-line text-dga-ink hover:bg-dga-bg'
                              }`}
                            >
                              <span className={`font-mono text-[11px] ${active ? 'text-dga-green-dark' : 'opacity-60'}`} aria-hidden>
                                {active ? `✓ ${opt.value}` : opt.value}
                              </span>
                              <span>{t(opt.label)}</span>
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                )
              })}
            </div>

            {/* optional knowledge check («تحقق معرفي») */}
            <KnowledgeBlock
              open={knowledgeOpen}
              onToggle={() => setKnowledgeOpen((p) => !p)}
              domainShort={t(domain.shortName)}
              questions={domainQuestions}
              chosen={calibrationAnswers}
              onChoose={setCalibrationAnswer}
            />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => goToStep(step - 1)} className="btn-ghost px-5 py-2.5 text-sm">
                <span aria-hidden>{backward}</span>
                {t({ ar: 'السابق', en: 'Back' })}
              </button>
              {!domainDone && (
                <p id="domain-hint" className="text-xs text-dga-muted">
                  {t({ ar: 'أجب عن العبارات الخمس للمتابعة.', en: 'Answer the five statements to continue.' })}
                </p>
              )}
              <button
                type="button"
                onClick={() => domainDone && goToStep(step + 1)}
                disabled={!domainDone}
                aria-describedby={!domainDone ? 'domain-hint' : undefined}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step < domains.length ? t({ ar: 'المجال التالي', en: 'Next domain' }) : t({ ar: 'مواقف الحكم المهني', en: 'Professional judgment scenarios' })}
                <span aria-hidden>{forward}</span>
              </button>
            </div>
          </motion.div>

          {/* live radar + text equivalent */}
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label={t({ ar: 'رادارك حتى الآن', en: 'Your radar so far' })}>
            <div className="glass p-4">
              <p className="text-xs font-bold text-dga-ink">{t({ ar: 'رادارك حتى الآن', en: 'Your radar so far' })}</p>
              <div className="mx-auto max-w-[240px] px-3 [&_svg]:overflow-visible" aria-hidden>
                <RadarChart labels={domains.map((d) => d.shortName)} values={liveValues} targets={domains.map((d) => targets[d.id] ?? 2)} lang={lang} />
              </div>
              <ol className="mt-2 space-y-1">
                {domains.map((d, i) => {
                  const n = statementsByDomain(d.id).filter((s) => answers[s.id] !== undefined).length
                  const reachable = i === 0 || i <= (firstOpenDomain === -1 ? domains.length - 1 : firstOpenDomain)
                  const current = i === domainIndex
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        disabled={!reachable || current}
                        onClick={() => goToStep(i + 1)}
                        aria-current={current ? 'step' : undefined}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1 text-start text-[11.5px] transition-colors disabled:cursor-default ${
                          current ? 'bg-dga-green/10 font-bold text-dga-green-dark' : reachable ? 'hover:bg-dga-bg' : 'text-dga-muted/70'
                        }`}
                      >
                        <span>{t(d.shortName)}</span>
                        <span className="text-dga-muted">
                          {n === 5 ? t(levelForScore(liveValues[i]).name) : <Num>{`${n} / 5`}</Num>}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </aside>
        </div>
      )}

      {/* ── Steps 9+: scenario judgment stage — a sibling of the domain block ── */}
      {scenario && (
        <motion.div key={scenario.id} initial={enter} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-3xl">
          <div className="mb-5 flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-dga-green/10 text-dga-green">
              <Icon name={domainById(scenario.domainId).icon} className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-dga-amber-tx">
                {t({ ar: 'موقف حكم', en: 'Judgment scenario' })} <Num>{scenarioIndex + 1}</Num> {t({ ar: 'من', en: 'of' })} <Num>{trackScenarios.length}</Num>
                {' · '}
                {t(domainById(scenario.domainId).shortName)}
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none sm:text-2xl">
                {t({ ar: 'كيف تتصرف في هذا الموقف؟', en: 'How would you act in this situation?' })}
              </h1>
            </div>
          </div>

          <div className="glass-strong p-6">
            <p className="leading-loose text-dga-ink">{t(scenario.situation)}</p>
            <p id={`q-${scenario.id}`} className="mt-4 font-bold text-dga-black">{t(scenario.question)}</p>
            <p className="mt-1 text-[11px] text-dga-muted">
              {t({
                ar: 'الخيارات متدرجة في نضج التصرف، لا صحيح وخاطئ. تُقفل إجابتك بعد الاختيار ويظهر سببها.',
                en: 'Options are graded by the maturity of the response, not right or wrong. Your answer locks once chosen and its reason appears.',
              })}
            </p>

            {(() => {
              const chosenIdx = scenarioAnswers[scenario.id]
              const answered = chosenIdx !== undefined
              const order = shuffledIndices(scenario.id, scenario.options.length)
              return (
                <>
                  <fieldset className="mt-5 space-y-2.5" aria-labelledby={`q-${scenario.id}`} disabled={answered}>
                    {order.map((optIdx) => {
                      const opt = scenario.options[optIdx]
                      const isChosen = chosenIdx === optIdx
                      const isTop = opt.score === 3
                      let cls = 'border-dga-line bg-white text-dga-ink hover:border-dga-green hover:bg-dga-bg'
                      if (answered && isChosen && opt.score === 3) cls = 'border-dga-green bg-dga-green/10 text-dga-green-dark'
                      else if (answered && isChosen && opt.score >= 1) cls = 'border-dga-amber bg-dga-amber/10 text-dga-ink'
                      else if (answered && isChosen) cls = 'border-rose-400 bg-rose-50 text-rose-700'
                      else if (answered && isTop) cls = 'border-dga-green/50 text-dga-green-dark'
                      else if (answered) cls = 'border-dga-line text-dga-muted'
                      return (
                        <label key={optIdx} className={`block ${answered ? 'cursor-default' : 'cursor-pointer'}`}>
                          <input
                            type="radio"
                            name={scenario.id}
                            value={optIdx}
                            checked={isChosen}
                            onChange={() => !answered && setScenarioAnswer(scenario.id, optIdx)}
                            className="peer sr-only"
                          />
                          <span className={`block w-full rounded-btn border px-4 py-3 text-start text-sm leading-relaxed transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-dga-green ${cls}`}>
                            {t(opt.text)}
                            {answered && isTop && <span className="ms-2 chip-ok text-[10px]">{t({ ar: 'الأكثر نضجًا', en: 'Most mature' })}</span>}
                          </span>
                        </label>
                      )
                    })}
                  </fieldset>
                  {answered && (
                    <div className="mt-4 rounded-btn border-s-4 border-dga-green bg-dga-green/5 p-4" role="status">
                      <p className="text-xs font-bold text-dga-green-dark">
                        {t({ ar: 'لماذا؟ درجة تصرفك ', en: 'Why? Your response scored ' })}
                        <Num>{scenario.options[chosenIdx].score}</Num> {t({ ar: 'من', en: 'of' })} <Num>3</Num>
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-dga-ink">{t(scenario.options[chosenIdx].rationale)}</p>
                      {scenario.options[chosenIdx].score < 3 && (
                        <p className="mt-2 border-t border-dga-line/60 pt-2 text-xs leading-relaxed text-dga-muted">
                          <span className="font-bold">{t({ ar: 'الأكثر نضجًا: ', en: 'Most mature: ' })}</span>
                          {t(scenario.options.find((o) => o.score === 3)!.rationale)}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )
            })()}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => goToStep(step - 1)} className="btn-ghost px-5 py-2.5 text-sm">
              <span aria-hidden>{backward}</span>
              {t({ ar: 'السابق', en: 'Back' })}
            </button>
            {scenarioIndex < trackScenarios.length - 1 ? (
              <button
                type="button"
                onClick={() => scenarioAnswers[scenario.id] !== undefined && goToStep(step + 1)}
                disabled={scenarioAnswers[scenario.id] === undefined}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t({ ar: 'الموقف التالي', en: 'Next scenario' })}
                <span aria-hidden>{forward}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={scenarioAnswers[scenario.id] === undefined || answeredStatements < statements.length}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t({ ar: 'اعرض نتيجتي', en: 'Show my results' })}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* a scenario step without scenarios (category missing) is unreachable: guarded above */}

      {/* meta footer */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-dga-muted">
        <span>
          {category ? `${t({ ar: 'فئة الدور:', en: 'Role category:' })} ${t(trackById(category)!.name)}` : ''}
          {preciseRole ? ` · ${t({ ar: 'الدور:', en: 'Role:' })} ${t(preciseRole.name)}` : ''}
        </span>
        <button
          type="button"
          onClick={() => {
            resetDraft()
            goToStep(0)
          }}
          className="underline-offset-4 hover:text-dga-ink hover:underline"
        >
          {t({ ar: 'إعادة البدء من الصفر', en: 'Restart from scratch' })}
        </button>
      </div>
    </div>
  )
}

function ChoiceChip({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className="inline-block cursor-pointer">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`chip transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-dga-green ${
          checked ? 'border-dga-green bg-dga-green/10 font-semibold text-dga-green-dark' : 'text-dga-ink hover:bg-dga-bg'
        }`}
      >
        {children}
      </span>
    </label>
  )
}

function KnowledgeBlock({
  open,
  onToggle,
  domainShort,
  questions,
  chosen,
  onChoose,
}: {
  open: boolean
  onToggle: () => void
  domainShort: string
  questions: ReturnType<typeof questionsForDomain>
  chosen: Record<string, string>
  onChoose: (questionId: string, key: string) => void
}) {
  const { t } = useApp()
  const attempted = questions.filter((q) => chosen[q.id] !== undefined)
  const correct = attempted.filter((q) => chosen[q.id] === q.answer).length
  return (
    <div className="mt-6 overflow-hidden rounded-card border border-dashed border-dga-amber/60 bg-white">
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls="knowledge-check" className="flex w-full items-center justify-between gap-3 p-4 text-start hover:bg-dga-bg">
        <span>
          <span className="block text-sm font-bold text-dga-amber-tx">{t({ ar: 'تحقق معرفي (اختياري)', en: 'Knowledge check (optional)' })}</span>
          <span className="block text-[11.5px] text-dga-muted">
            {t({ ar: `أسئلة قصيرة عن المعرفة الأساسية في «${domainShort}». أجبت عن `, en: `Short questions on foundational knowledge in “${domainShort}”. Answered ` })}
            <Num>{attempted.length}</Num> {t({ ar: 'من', en: 'of' })} <Num>{questions.length}</Num>
            {attempted.length > 0 && (
              <>
                {t({ ar: '، والصحيح ', en: ', correct ' })}
                <Num>{correct}</Num>
              </>
            )}
            {t({ ar: '. لا يُقارن بتقديرك الذاتي إلا بعد ', en: '. It is compared with your self-rating only after at least ' })}
            <Num>{MIN_KNOWLEDGE_ATTEMPTS}</Num>
            {t({ ar: ' إجابات على الأقل.', en: ' answers.' })}
          </span>
        </span>
        <span aria-hidden className={`text-dga-muted transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div id="knowledge-check" className="space-y-4 border-t border-dga-line p-4">
          {questions.map((q, qi) => {
            const pick = chosen[q.id]
            const answered = pick !== undefined
            const ok = answered && pick === q.answer
            return (
              <fieldset key={q.id} disabled={answered} aria-labelledby={`kq-${q.id}`} className="rounded-xl bg-dga-bg p-4">
                <p id={`kq-${q.id}`} className="text-sm font-medium leading-relaxed">
                  <span className="me-2 text-xs font-bold text-dga-amber-tx">
                    {t({ ar: 'سؤال', en: 'Q' })} <Num>{qi + 1}</Num>
                  </span>
                  {t(q.q)}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => {
                    const isChosen = pick === opt.key
                    const isAnswer = opt.key === q.answer
                    let cls = 'border-dga-line bg-white text-dga-ink hover:border-dga-green'
                    if (answered && isChosen && ok) cls = 'border-dga-green bg-dga-green/10 text-dga-green-dark'
                    else if (answered && isChosen) cls = 'border-rose-400 bg-rose-50 text-rose-700'
                    else if (answered && isAnswer) cls = 'border-dga-green/50 text-dga-green-dark'
                    return (
                      <label key={opt.key} className={answered ? 'cursor-default' : 'cursor-pointer'}>
                        <input type="radio" name={q.id} checked={isChosen} onChange={() => !answered && onChoose(q.id, opt.key)} className="peer sr-only" />
                        <span className={`block rounded-lg border px-3 py-2 text-start text-xs leading-snug transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-dga-green ${cls}`}>
                          {t(opt.text)}
                        </span>
                      </label>
                    )
                  })}
                </div>
                {answered && (
                  <p className={`mt-2.5 text-[11.5px] leading-relaxed ${ok ? 'text-dga-green-dark' : 'text-dga-muted'}`}>
                    {ok ? t({ ar: 'صحيح. ', en: 'Correct. ' }) : t({ ar: 'غير صحيح. ', en: 'Not correct. ' })}
                    {t(q.explanation)}
                  </p>
                )}
              </fieldset>
            )
          })}
        </div>
      )}
    </div>
  )
}
