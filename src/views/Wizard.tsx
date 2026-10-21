import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp, computeScores } from '../store'
import type { ResultRecord } from '../store'
import { domains } from '../data/domains'
import { statementsByDomain, statements } from '../data/statements'
import { roles } from '../data/roles'
import { familyNames, familyOrder, libraryRoles, LIB_PREFIX, resolveRoleName } from '../data/roleLibrary'
import { scaleOptions } from '../data/levels'
import { questionsForDomain } from '../data/learning'
import { tracks, trackById } from '../data/tracks'
import { scenariosForTrack } from '../data/scenarios'
import type { TrackId } from '../data/tracks'
import Icon from '../components/Icon'
import { domainById } from '../data/domains'

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
  const [step, setStep] = useState(roleId ? 1 : 0) // 0 = role pick, 1..8 = domains
  const [calibrationOpen, setCalibrationOpen] = useState(false)

  const totalAnswered = statements.filter((s) => answers[s.id] !== undefined).length
  const progress = step === 0 ? 0 : Math.round((totalAnswered / statements.length) * 100)

  const SCENARIO_BASE = 9 // steps 9..16 are the scenario-judgment stage
  const trackScenarios = trackId ? scenariosForTrack(trackId as TrackId) : []
  const scenarioIndex = step - SCENARIO_BASE
  const scenario = scenarioIndex >= 0 && scenarioIndex < trackScenarios.length ? trackScenarios[scenarioIndex] : null

  const domainIndex = step - 1
  const domain = domainIndex >= 0 && domainIndex < 8 ? domains[domainIndex] : null
  const domainStatements = domain ? statementsByDomain(domain.id) : []
  const domainQuestions = domain ? questionsForDomain(domain.id) : []
  const domainDone = domainStatements.every((s) => answers[s.id] !== undefined)

  const finish = () => {
    if (!roleId) return
    const groups = domains.map((d) => ({ domainId: d.id, ids: statementsByDomain(d.id).map((s) => s.id) }))
    const { scores, overall } = computeScores(answers, groups)
    // calibration: correct answers 0-3 per domain
    const calibration: Record<string, number> = {}
    for (const d of domains) {
      const qs = questionsForDomain(d.id)
      const answered = qs.filter((q) => calibrationAnswers[q.id] !== undefined)
      if (answered.length > 0) {
        calibration[d.id] = qs.filter((q) => calibrationAnswers[q.id] === q.answer).length
      }
    }
    // scenario judgment scores (0-3) per domain, from the track's scenario items
    const scenarioScores: Record<string, number> = {}
    for (const item of trackScenarios) {
      const chosen = scenarioAnswers[item.id]
      if (chosen !== undefined) scenarioScores[item.domainId] = item.options[chosen]?.score ?? 0
    }
    const rec: ResultRecord = {
      id: `r-${Date.now()}`,
      date: new Date().toISOString(),
      roleId,
      trackId: trackId ?? undefined,
      answers: { ...answers },
      scores,
      overall,
      ...(Object.keys(calibration).length > 0 ? { calibration } : {}),
      ...(Object.keys(scenarioScores).length > 0 ? { scenario: scenarioScores } : {}),
    }
    saveResult(rec)
    go('results')
  }

  const slideDir = dir === 'rtl' ? -1 : 1
  const goToStep = (n: number) => {
    setStep(n)
    setCalibrationOpen(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-dga-muted">
          <span>
            {step === 0
              ? t({ ar: 'الخطوة 0 — المسار والدور', en: 'Step 0 — track & role' })
              : step >= SCENARIO_BASE
                ? t({ ar: `موقف حكم ${scenarioIndex + 1} من ${trackScenarios.length}`, en: `Judgment scenario ${scenarioIndex + 1} of ${trackScenarios.length}` })
                : t({ ar: `المجال ${step} من 8`, en: `Domain ${step} of 8` })}
          </span>
          <span className="font-mono text-dga-green">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-dga-bg">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-dga-green via-dga-green-deep to-dga-green-ink"
            animate={{ width: `${step === 0 ? 2 : Math.max(6, (step / (8 + trackScenarios.length)) * 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: role selection ── */}
        {step === 0 && (
          <motion.div
            key="role"
            initial={{ opacity: 0, x: 40 * slideDir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * slideDir }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="text-2xl font-bold sm:text-3xl">{t({ ar: 'ما هو دورك؟', en: 'What is your role?' })}</h1>
            <p className="mt-3 text-dga-muted">
              {t({
                ar: 'يحدد دورك المستوى المستهدف في كل مجال — أي شكل المضلع البنفسجي على الرادار. اختر ملفًا عامًا أو دورًا دقيقًا من مكتبة الأدوار.',
                en: 'Your role sets the target level in each domain — the shape of the violet polygon on the radar. Pick a general profile or a precise role from the role library.',
              })}
            </p>

            <h2 className="mt-7 text-sm font-bold text-dga-ink">{t({ ar: 'أولًا — مسارك: ما الذي يجب أن تثبته؟', en: 'First — your track: what should you be able to prove?' })}</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {tracks.map((tr) => {
                const active = trackId === tr.id
                return (
                  <button
                    key={tr.id}
                    onClick={() => setTrackId(tr.id)}
                    className={`rounded-btn border p-4 text-start transition-all ${
                      active ? 'border-dga-green bg-dga-green/10' : 'border-dga-line bg-white hover:border-dga-green hover:bg-dga-bg'
                    }`}
                  >
                    <span className="block text-sm font-bold text-dga-black">{t(tr.name)}</span>
                    <span className="mt-0.5 block text-[11px] text-dga-muted">{t(tr.proves)}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-[11px] text-dga-muted">
              {t({
                ar: 'المسار يصف ما ستثبته؛ مستوى الإتقان محور مستقل (قد يحتاج التنفيذي وعيًا بتقنية وكفاءة متقدمة في قرار الاستثمار فيها).',
                en: 'The track describes what you will prove; proficiency level is an independent axis (an executive may need awareness of a technology and advanced judgment in investing in it).',
              })}
            </p>

            <h2 className="mt-7 text-sm font-bold text-dga-ink">{t({ ar: 'ثم دورك الوظيفي — يحدد المستهدف', en: 'Then your job role — it sets the target' })}</h2>
            <h3 className="mt-3 text-xs font-semibold text-dga-muted">{t({ ar: 'ملفات عامة', en: 'General profiles' })}</h3>
            <div className="mt-3 space-y-3">
              {roles.map((r) => (
                <RoleCard key={r.id} selected={roleId === r.id} onClick={() => setRoleId(r.id)} title={t(r.name)} desc={t(r.description)} />
              ))}
            </div>

            <h2 className="mt-8 text-sm font-bold text-dga-ink">
              {t({ ar: 'أو دور وظيفي دقيق — مكتبة الأدوار (20 دورًا)', en: 'Or a precise job role — the Role Library (20 roles)' })}
            </h2>
            <div className="mt-3 space-y-3">
              {familyOrder.map((fam) => {
                const famRoles = libraryRoles.filter((r) => r.family === fam)
                if (famRoles.length === 0) return null
                return (
                  <div key={fam} className="glass p-4">
                    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-dga-amber-tx">{t(familyNames[fam])}</p>
                    <div className="flex flex-wrap gap-2">
                      {famRoles.map((r) => {
                        const id = LIB_PREFIX + r.id
                        const active = roleId === id
                        return (
                          <button
                            key={r.id}
                            onClick={() => setRoleId(id)}
                            className={`chip transition-all ${
                              active
                                ? 'border-dga-green bg-dga-green/10 font-semibold text-dga-green'
                                : 'text-dga-ink hover:border-dga-line hover:bg-dga-bg'
                            }`}
                          >
                            {t(r.name)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={() => goToStep(1)} disabled={!roleId || !trackId} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
                {t({ ar: 'ابدأ الأسئلة', en: 'Start the questions' })}
                <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Steps 1-8: domain statements ── */}
        {step >= 1 && domain && (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, x: 40 * slideDir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * slideDir }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-dga-green/20 to-dga-green-ink/20 text-dga-green">
                <Icon name={domain.icon} className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">{t(domain.name)}</h1>
                <p className="mt-1 text-sm text-dga-muted">{t(domain.description)}</p>
              </div>
            </div>

            <div className="space-y-5">
              {domainStatements.map((s) => {
                const answered = answers[s.id] !== undefined
                return (
                  <div key={s.id} className={`glass p-5 transition-colors ${answered ? 'border-dga-green/30' : ''}`}>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-dga-amber-tx">
                      {t(domain.skills[s.skillIndex])}
                    </p>
                    <p className="mb-4 font-medium leading-relaxed">{t(s.text)}</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                      {scaleOptions.map((opt) => {
                        const active = answers[s.id] === opt.value
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setAnswer(s.id, opt.value)}
                            className={`rounded-xl border px-3 py-2.5 text-xs leading-snug transition-all duration-200 ${
                              active
                                ? 'border-dga-green bg-dga-green/10 font-semibold text-dga-green'
                                : 'border-dga-line text-dga-ink hover:border-dga-line hover:bg-dga-bg'
                            }`}
                          >
                            <span className="mb-0.5 block font-mono text-[10px] opacity-60">{opt.value}</span>
                            {t(opt.label)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── optional calibration block ── */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-dashed border-dga-amber/40">
              <button
                onClick={() => setCalibrationOpen((p) => !p)}
                className="flex w-full items-center justify-between gap-3 p-4 text-start transition-colors hover:bg-dga-bg"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-dga-amber/15 text-dga-amber-tx">?</span>
                  <span>
                    <span className="block text-sm font-bold text-dga-amber-tx">
                      {t({ ar: 'تحقق من معرفتك (اختياري)', en: 'Verify your knowledge (optional)' })}
                    </span>
                    <span className="block text-[11px] text-dga-muted">
                      {t({
                        ar: `${domainQuestions.length} أسئلة سريعة تقارن تقديرك الذاتي بمعرفتك في «${domain.shortName.ar}» — أجبت على ${domainQuestions.filter((q) => calibrationAnswers[q.id] !== undefined).length} من ${domainQuestions.length}`,
                        en: `${domainQuestions.length} quick questions comparing your self-rating with your knowledge in “${domain.shortName.en}” — ${domainQuestions.filter((q) => calibrationAnswers[q.id] !== undefined).length} of ${domainQuestions.length} answered`,
                      })}
                    </span>
                  </span>
                </span>
                <span className={`text-dga-muted transition-transform duration-300 ${calibrationOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              <AnimatePresence initial={false}>
                {calibrationOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4 border-t border-dga-line p-4">
                      {domainQuestions.map((q, qi) => {
                        const chosen = calibrationAnswers[q.id]
                        const answeredQ = chosen !== undefined
                        const correct = answeredQ && chosen === q.answer
                        return (
                          <div key={q.id} className="rounded-xl bg-dga-bg p-4">
                            <p className="text-sm font-medium leading-relaxed">
                              <span className="me-2 font-mono text-xs text-dga-amber-tx/70">Q{qi + 1}</span>
                              {t(q.q)}
                            </p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              {q.options.map((opt) => {
                                const isChosen = chosen === opt.key
                                const isAnswer = opt.key === q.answer
                                let cls = 'border-dga-line text-dga-ink hover:border-dga-line'
                                if (answeredQ && isChosen && correct) cls = 'border-dga-green bg-dga-green/10 text-dga-green-dark'
                                else if (answeredQ && isChosen) cls = 'border-rose-400 bg-rose-400/10 text-rose-600'
                                else if (answeredQ && isAnswer) cls = 'border-dga-green/50 text-dga-green-dark'
                                return (
                                  <button
                                    key={opt.key}
                                    onClick={() => !answeredQ && setCalibrationAnswer(q.id, opt.key)}
                                    disabled={answeredQ}
                                    title={answeredQ ? t({ ar: 'الإجابة مقفلة بعد الإظهار', en: 'Answer locked after reveal' }) : undefined}
                                    className={`rounded-lg border px-3 py-2 text-start text-xs leading-snug transition-all disabled:cursor-not-allowed ${cls}`}
                                  >
                                    {t(opt.text)}
                                  </button>
                                )
                              })}
                            </div>
                            {answeredQ && (
                              <p className={`mt-2.5 text-[11.5px] leading-relaxed ${correct ? 'text-dga-green-dark' : 'text-dga-muted'}`}>
                                {correct ? '✓ ' : '✗ '}
                                {t(q.explanation)}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
        
        {/* ── Steps 9+: scenario judgment stage (one per domain, locked, rationales) ── */}
        {step >= SCENARIO_BASE && scenario && (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, x: 40 * slideDir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * slideDir }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-5 flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-dga-green/10 text-dga-green">
                <Icon name={domainById(scenario.domainId).icon} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-dga-amber-tx">
                  {t({ ar: 'موقف حكم مهني', en: 'Professional judgment scenario' })}
                  {' · '}
                  {t(domainById(scenario.domainId).shortName)}
                </p>
                <h1 className="text-xl font-bold sm:text-2xl">
                  {t({ ar: 'كيف تتصرف في هذا الموقف؟', en: 'How would you act in this situation?' })}
                </h1>
              </div>
            </div>

            <div className="glass-strong p-6">
              <p className="leading-loose text-dga-ink">{t(scenario.situation)}</p>
              <p className="mt-4 font-bold text-dga-black">{t(scenario.question)}</p>
              <p className="mt-1 text-[11px] text-dga-muted">
                {t({
                  ar: 'الخيارات مدرّجة بنضج الحكم — ليس بينها «صحيح وخاطئ» بل درجات. تُقفل إجابتك بعد الاختيار ويظهر مبررها.',
                  en: 'Options are graded by judgment maturity — not right/wrong but degrees. Your answer locks on selection and its rationale appears.',
                })}
              </p>

              <div className="mt-5 space-y-2.5">
                {(() => {
                  const chosenIdx = scenarioAnswers[scenario.id]
                  const answered = chosenIdx !== undefined
                  const order = shuffledIndices(scenario.id, scenario.options.length)
                  return order.map((optIdx) => {
                    const opt = scenario.options[optIdx]
                    const isChosen = chosenIdx === optIdx
                    const isTop = opt.score === 3
                    let cls = 'border-dga-line bg-white text-dga-ink hover:border-dga-green hover:bg-dga-bg'
                    if (answered && isChosen && opt.score === 3) cls = 'border-dga-green bg-dga-green/10 text-dga-green-dark'
                    else if (answered && isChosen && opt.score >= 1) cls = 'border-dga-amber bg-dga-amber/10 text-dga-ink'
                    else if (answered && isChosen) cls = 'border-rose-400 bg-rose-400/10 text-rose-600'
                    else if (answered && isTop) cls = 'border-dga-green/50 text-dga-green-dark'
                    else if (answered) cls = 'border-dga-line text-dga-muted'
                    return (
                      <button
                        key={optIdx}
                        onClick={() => !answered && setScenarioAnswer(scenario.id, optIdx)}
                        disabled={answered}
                        className={`w-full rounded-btn border px-4 py-3 text-start text-sm leading-relaxed transition-all disabled:cursor-not-allowed ${cls}`}
                      >
                        {t(opt.text)}
                        {answered && isTop && (
                          <span className="ms-2 chip-ok text-[10px]">{t({ ar: 'الأكثر نضجًا', en: 'Most mature' })}</span>
                        )}
                      </button>
                    )
                  })
                })()}
              </div>

              {scenarioAnswers[scenario.id] !== undefined && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-btn border-s-4 border-dga-green bg-dga-green/5 p-4">
                  <p className="text-xs font-bold text-dga-green-dark">
                    {t({ ar: 'لماذا؟ ', en: 'Why? ' })}
                    {t({ ar: `حكمك سجّل بدرجة ${scenario.options[scenarioAnswers[scenario.id]].score} من 3`, en: `Your judgment scored ${scenario.options[scenarioAnswers[scenario.id]].score} of 3` })}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-dga-ink">
                    {t(scenario.options[scenarioAnswers[scenario.id]].rationale)}
                  </p>
                  {scenario.options[scenarioAnswers[scenario.id]].score < 3 && (
                    <p className="mt-2 border-t border-dga-line/60 pt-2 text-xs leading-relaxed text-dga-muted">
                      <span className="font-bold">{t({ ar: 'الأكثر نضجًا: ', en: 'Most mature: ' })}</span>
                      {t(scenario.options.find((o) => o.score === 3)!.rationale)}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => goToStep(step - 1)} className="btn-ghost px-5 py-2.5 text-sm">
                <span aria-hidden>{lang === 'ar' ? '→' : '←'}</span>
                {t({ ar: 'السابق', en: 'Back' })}
              </button>
              {scenarioIndex < trackScenarios.length - 1 ? (
                <button
                  onClick={() => scenarioAnswers[scenario.id] !== undefined && goToStep(step + 1)}
                  disabled={scenarioAnswers[scenario.id] === undefined}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t({ ar: 'الموقف التالي', en: 'Next scenario' })}
                  <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
                </button>
              ) : (
                <button
                  onClick={finish}
                  disabled={scenarioAnswers[scenario.id] === undefined}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t({ ar: 'اعرض نتيجتي', en: 'Show my results' })}
                  <span aria-hidden>✦</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => goToStep(step === 1 ? 0 : step - 1)} className="btn-ghost px-5 py-2.5 text-sm">
                <span aria-hidden>{lang === 'ar' ? '→' : '←'}</span>
                {t({ ar: 'السابق', en: 'Back' })}
              </button>
              {step < 8 ? (
                <button
                  onClick={() => domainDone && goToStep(step + 1)}
                  disabled={!domainDone}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t({ ar: 'المجال التالي', en: 'Next domain' })}
                  <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
                </button>
              ) : (
                <button
                  onClick={() => domainDone && goToStep(SCENARIO_BASE)}
                  disabled={!domainDone || trackScenarios.length === 0}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t({ ar: 'مرحلة مواقف الحكم المهني', en: 'Professional judgment scenarios' })}
                  <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* meta footer */}
      <div className="mt-10 flex items-center justify-between text-xs text-dga-muted">
        <span>
          {roleId ? t({ ar: `الدور: ${resolveRoleName(roleId).ar}`, en: `Role: ${resolveRoleName(roleId).en}` }) : ''}
          {trackId ? ` · ${t({ ar: 'المسار:', en: 'Track:' })} ${t(trackById(trackId as TrackId)!.name)}` : ''}
        </span>
        <button
          onClick={() => {
            resetDraft()
            goToStep(0)
          }}
          className="hover:text-dga-ink"
        >
          {t({ ar: 'إعادة البدء من الصفر', en: 'Restart from scratch' })}
        </button>
      </div>
    </div>
  )
}

function RoleCard({ selected, onClick, title, desc }: { selected: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`glass w-full p-5 text-start transition-all duration-300 hover:border-dga-green/50 ${
        selected ? 'border-dga-green bg-dga-green/5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-dga-muted">{desc}</p>
        </div>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
            selected ? 'border-dga-green bg-dga-green text-white' : 'border-dga-line'
          }`}
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M2 6.2l2.6 2.6L10 3.4" />
            </svg>
          )}
        </span>
      </div>
    </button>
  )
}
