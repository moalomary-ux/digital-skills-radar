import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import { decisionQuestions, personaMeta, recommendCareers } from '../data/guidance'
import type { CompletedAnswers, Persona } from '../data/guidance'
import { careers, exposureMeta, signalMeta } from '../data/careers'
import Disclaimer from '../components/Disclaimer'
import Icon from '../components/Icon'

/** Human-readable reason lines for match explanations ("because you chose…"). */
const reasonText: Record<string, { ar: string; en: string }> = {
  'interest:people_care': { ar: 'لأنك تستمتع بمساعدة الناس ورعايتهم', en: 'because you enjoy helping and caring for people' },
  'interest:build_tech': { ar: 'لأنك تحب البناء بالتقنية والبرمجة', en: 'because you like building with technology and code' },
  'interest:build_physical': { ar: 'لأنك تحب البناء والإصلاح بيديك', en: 'because you like building and fixing things with your hands' },
  'interest:numbers_logic': { ar: 'لأنك تستمتع بالأرقام والأنماط والمنطق', en: 'because you enjoy numbers, patterns and logic' },
  'interest:persuade_create': { ar: 'لأنك تحب الإقناع وصناعة المحتوى', en: 'because you like persuading people and creating content' },
  'interest:organize_rule': { ar: 'لأنك تحب تنظيم الأنظمة وتطبيق القواعد', en: 'because you like organizing systems and applying rules' },
  'aptitude:math_strong': { ar: 'ولأن الرياضيات والفيزياء سهلة عليك', en: 'and because math & physics come easy to you' },
  'aptitude:bio_strong': { ar: 'ولأن الأحياء والكيمياء سهلة عليك', en: 'and because biology & chemistry come easy to you' },
  'aptitude:lang_strong': { ar: 'ولأن اللغات والكتابة سهلة عليك', en: 'and because languages & writing come easy to you' },
  'aptitude:practical': { ar: 'ولأن الأعمال العملية تناسبك', en: 'and because practical work suits you' },
  'aptitude:mixed': { ar: 'ولأن قدراتك متوازنة', en: 'and because your abilities are balanced' },
  'style:structured_classroom': { ar: 'ويناسب أسلوب تعلمك المنظم', en: 'and it fits your structured learning style' },
  'style:project_based': { ar: 'ويناسب أسلوب تعلمك بالمشاريع', en: 'and it fits your project-based learning style' },
  'style:apprenticeship': { ar: 'ويناسب تعلمك بجانب موجّه', en: 'and it fits learning alongside a mentor' },
  'market:growing': { ar: 'وهي مهنة نامية في سوق العمل العالمي', en: 'and it is a growing career in the global market' },
}

const pathwayText = {
  degree_route: { ar: 'المسار الموصى به: شهادة جامعية (مهنة مرخّصة)', en: 'Recommended route: university degree (licensed profession)' },
  skills_first_route: { ar: 'المسار الموصى به: مهارات أولًا (شهادات قصيرة + ملف أعمال)', en: 'Recommended route: skills-first (short credentials + portfolio)' },
  hybrid: { ar: 'المسار الموصى به: هجين (درجة + شهادات متراكمة)', en: 'Recommended route: hybrid (degree + stacked credentials)' },
} as const

const counselorLinks = [
  { name: { ar: 'موجه مدرستك أو جامعتك', en: 'Your school / university counselor' }, hint: { ar: 'اطلب جلسة إرشاد أكاديمي — مجانية وغير مستغلَقة', en: 'Ask for an academic-guidance session — free and underused' }, url: 'https://www.moe.gov.sa' },
  { name: { ar: 'المؤسسة العامة للتدريب التقني (TVTC)', en: 'TVTC vocational guidance' }, hint: { ar: 'إرشاد وقبول الدبلومات التقنية', en: 'Guidance & admission for technical diplomas' }, url: 'https://www.tvtc.gov.sa' },
  { name: { ar: 'منصة جدارات', en: 'Jadarat platform' }, hint: { ar: 'الوظائف الحكومية والمفاضلات', en: 'Government jobs and selection' }, url: 'https://jadarat.sa' },
  { name: { ar: 'منصة طاقات', en: 'Taqat platform' }, hint: { ar: 'وظائف وبرامج تدريب ودعم توظيف', en: 'Jobs, training programs and employment support' }, url: 'https://www.taqat.sa' },
]

const EXPOSURE_ORDER: Record<string, number> = { low: 0, medium: 1, high: 2 }
const STEPS_TOTAL = decisionQuestions.length + 1 // persona + 5 questions

export default function Decide() {
  const { t, lang, dir, openCareer } = useApp()
  const [step, setStep] = useState(0) // 0 = persona, 1..5 questions, 6 = results
  const [persona, setPersona] = useState<Persona | null>(null)
  const [answers, setAnswers] = useState<{ q1: string[]; q2?: string; q3?: string; q4?: string; q5?: string }>({ q1: [] })

  const qIndex = step - 1
  const q = qIndex >= 0 && qIndex < decisionQuestions.length ? decisionQuestions[qIndex] : null
  const done = step > decisionQuestions.length
  const completed: CompletedAnswers | null =
    done && persona && answers.q1.length > 0 && answers.q2 && answers.q3 && answers.q4 && answers.q5
      ? { persona, q1: answers.q1, q2: answers.q2, q3: answers.q3, q4: answers.q4, q5: answers.q5 }
      : null
  const result = completed ? recommendCareers(completed) : null
  const slideDir = dir === 'rtl' ? -1 : 1

  const pickSingle = (key: string) => {
    if (!q || q.multi) return
    setAnswers((p) => ({ ...p, [q.id]: key }))
    setTimeout(() => setStep((s) => s + 1), 280)
  }

  const toggleInterest = (key: string) => {
    setAnswers((p) => {
      let next: string[]
      if (key === 'unsure') next = ['unsure'] // exclusive
      else {
        const cur = p.q1.filter((k) => k !== 'unsure')
        next = cur.includes(key) ? cur.filter((k) => k !== key) : cur.length >= 2 ? [cur[1], key] : [...cur, key]
      }
      return { ...p, q1: next }
    })
  }

  /** Persona-aware question wording (parent observes the child). */
  const questionTitle = (qid: string, base: { ar: string; en: string }) => {
    if (persona === 'parent') {
      if (qid === 'q1') return { ar: 'أي نوع من المشكلات يستمتع ابنك بحلّها؟', en: 'What kind of problems does your child enjoy solving?' }
      if (qid === 'q2') return { ar: 'أي المواد الدراسية تبدو أسهل على ابنك؟', en: 'Which school subjects seem easiest for your child?' }
      if (qid === 'q5') return { ar: 'كم من الوقت يمكن لابنك الاستثمار قبل بدء الكسب؟', en: 'How long can your child invest before earning?' }
    }
    return base
  }

  const progressPct = Math.min(100, Math.round((step / STEPS_TOTAL) * 100))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* header + progress */}
      <div className="mb-8 text-center">
        <p className="eyebrow">{t({ ar: 'اختبار التوجيه المهني', en: 'Career guidance quiz' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">
          {t({ ar: 'خمسة أسئلة تكفي للبداية', en: 'Five questions are enough to start' })}
        </h1>
        <p className="mt-3 text-dga-muted">
          {t({
            ar: 'نجمع ميولك وقدراتك وأسلوب تعلمك، ونقترح ثلاثة اتجاهات بأدلة — مع تحذير صريح إذا كانت ميولك تشير نحو مهنة تندثر.',
            en: 'We gather your interests, aptitudes and learning style and suggest three directions with evidence — plus an honest warning if your leanings point at a declining career.',
          })}
        </p>
      </div>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-dga-muted">
          <span>
            {step === 0
              ? t({ ar: 'من تسأل؟', en: 'Who is asking?' })
              : done
                ? t({ ar: 'النتيجة', en: 'Result' })
                : t({ ar: `السؤال ${step} من 5`, en: `Question ${step} of 5` })}
          </span>
          <span className="font-mono font-semibold text-dga-green" dir="ltr">
            {progressPct}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-pill bg-dga-line/60">
          <motion.div className="h-full rounded-pill bg-dga-green" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: persona ── */}
        {step === 0 && (
          <motion.div key="persona" initial={{ opacity: 0, x: 40 * slideDir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 * slideDir }} transition={{ duration: 0.3 }}>
            <div className="glass-strong p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dga-black sm:text-2xl">{t({ ar: 'أولًا — من يقف وراء السؤال؟', en: 'First — who is asking?' })}</h2>
              <p className="mt-2 text-sm text-dga-muted">
                {t({ ar: 'تتكيف صياغة الأسئلة والنتائج مع دورك.', en: 'Question wording and results framing adapt to your role.' })}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(Object.keys(personaMeta) as Persona[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPersona(p)
                      setTimeout(() => setStep(1), 250)
                    }}
                    className={`rounded-btn border p-4 text-start transition-all ${
                      persona === p ? 'border-dga-green bg-dga-green/10' : 'border-dga-line bg-white hover:border-dga-green hover:bg-dga-bg'
                    }`}
                  >
                    <span className="font-semibold text-dga-ink">{t(personaMeta[p].name)}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Steps 1-5: questions ── */}
        {q && !done && (
          <motion.div key={q.id} initial={{ opacity: 0, x: 40 * slideDir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 * slideDir }} transition={{ duration: 0.3 }}>
            <div className="glass-strong p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dga-black sm:text-2xl">{t(questionTitle(q.id, q.title))}</h2>
              {q.multi && (
                <p className="mt-2 text-sm text-dga-muted">
                  {t({ ar: 'اختر ما يصل إلى خيارين', en: 'Pick up to two' })}
                  <span className="ms-2 font-mono text-dga-green-dark" dir="ltr">{answers.q1.length}/2</span>
                </p>
              )}
              <div className="mt-6 space-y-3">
                {q.options.map((opt) => {
                  const active = q.multi ? answers.q1.includes(opt.key) : answers[q.id as 'q2'] === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => (q.multi ? toggleInterest(opt.key) : pickSingle(opt.key))}
                      className={`flex w-full items-center justify-between gap-4 rounded-btn border p-4 text-start transition-all duration-200 ${
                        active ? 'border-dga-green bg-dga-green/10' : 'border-dga-line bg-white hover:border-dga-green hover:bg-dga-bg'
                      }`}
                    >
                      <span>
                        <span className="block font-medium text-dga-ink">{t(opt.label)}</span>
                        {opt.riasec && <span className="mt-0.5 block text-[11px] text-dga-muted">RIASEC: {t(opt.riasec)}</span>}
                      </span>
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? 'border-dga-green bg-dga-green text-white' : 'border-dga-line'}`}>
                        {active && (
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M2 6.2l2.6 2.6L10 3.4" />
                          </svg>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
              {q.multi && (
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setStep((s) => s + 1)} disabled={answers.q1.length === 0} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
                    {t({ ar: 'التالي', en: 'Next' })}
                    <span aria-hidden> {lang === 'ar' ? '←' : '→'}</span>
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="btn-ghost mt-5 px-4 py-2 text-sm">
              <span aria-hidden>{lang === 'ar' ? '→' : '←'}</span> {t({ ar: 'السابق', en: 'Back' })}
            </button>
          </motion.div>
        )}

        {/* ── results ── */}
        {done && result && completed && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Disclaimer />

            <div className="mt-6 text-center">
              <h2 className="text-section font-bold text-dga-green">
                {result.top.length > 0
                  ? t(personaMeta[completed.persona].resultsHeading)
                  : t({ ar: 'لا تطابق مباشر — وهذا طبيعي', en: 'No direct match — and that’s normal' })}
              </h2>
              <p className="mt-2 text-sm text-dga-muted">
                {t(personaMeta[completed.persona].resultsIntro)}
              </p>
              <p className="mt-1 text-xs text-dga-muted">
                {t({ ar: 'تطابق استرشادي ميكانيكي وفق قواعد موثقة — ليس بديلًا عن جلسة مع موجه مهني ولا عن شروط القبول الفعلية.', en: 'A mechanical indicative match under documented rules — not a substitute for a counselor session or actual admission requirements.' })}
              </p>
            </div>

            {/* declining warnings first — honesty before salesmanship */}
            {result.warnings.length > 0 && (
              <div className="mt-6 rounded-card border border-rose-300 bg-[#FEF3F2] p-5">
                <h3 className="flex items-center gap-2 font-bold text-[#B42318]">
                  <span aria-hidden>⚠</span> {t({ ar: 'تنبيه صريح', en: 'An honest warning' })}
                </h3>
                {result.warnings.map((w) => (
                  <p key={w.id} className="mt-2 text-sm leading-relaxed text-dga-ink">
                    {t({
                      ar: `ميلك نحو «${w.name.ar}» مفهوم، لكنها مهنة مندثرة وفق تقرير مستقبل الوظائف 2025 — انظر بدائلها النامية أدناه.`,
                      en: `Your leaning toward “${w.name.en}” is understandable, but it is a declining career per WEF FoJ 2025 — see the growing alternatives below.`,
                    })}
                    <button onClick={() => openCareer(w.id)} className="ms-2 font-semibold text-[#B42318] underline">
                      {t({ ar: 'التفاصيل والبدائل', en: 'Details & alternatives' })}
                    </button>
                  </p>
                ))}
              </div>
            )}

            {/* graceful near-matches when nothing survives the filters */}
            {result.top.length === 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-bold text-dga-black">{t({ ar: 'الأقرب إلى ميولك — مع المحاذير', en: 'Closest to your interests — with caveats' })}</h3>
                {careers
                  .filter((c) => c.signal !== 'DECLINING' && c.matching.interestKeys.some((k) => completed.q1.includes(k)))
                  .sort((a, b) => EXPOSURE_ORDER[a.automationExposure] - EXPOSURE_ORDER[b.automationExposure])
                  .slice(0, 3)
                  .map((c) => (
                    <div key={c.id} className="glass flex flex-wrap items-center gap-3 p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-dga-black">{t(c.name)}</p>
                        <p className="mt-1 text-xs text-dga-muted">{t(c.verdict)}</p>
                      </div>
                      <span className="chip-info">{t({ ar: 'يتطلب التزامًا أطول مما اخترت', en: 'Needs a longer commitment than you picked' })}</span>
                      <button onClick={() => openCareer(c.id)} className="btn-ghost px-4 py-2 text-xs">
                        {t({ ar: 'التفاصيل', en: 'Details' })}
                      </button>
                    </div>
                  ))}
                <div className="glass border-s-4 !border-s-dga-green p-4 text-sm leading-relaxed text-dga-ink">
                  {t({
                    ar: 'مداخل سريعة تستحق النظر: برامج الدبلومات في التدريب التقني (TVTC)، ومنصة دروب للتدريب المجاني، وبرنامج تمهير للتدريب أثناء العمل — كلها مسارات قصيرة تفتح أبوابًا بينما تكتشف ميولك أكثر.',
                    en: 'Quick entry points worth considering: TVTC diploma programs, the free Doroob training platform, and the Tamheer work-training program — short routes that open doors while you keep discovering your interests.',
                  })}
                </div>
              </div>
            )}

            {/* licensed/long-path careers excluded by commitment — flagged, never hidden */}
            {result.commitmentMisses.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-bold text-dga-black">{t({ ar: 'تناسب ميولك لكنها مسارات طويلة', en: 'Fit your interests but are long paths' })}</h3>
                <div className="space-y-3">
                  {result.commitmentMisses.slice(0, 2).map((c) => (
                    <div key={c.id} className="glass flex flex-wrap items-center gap-3 p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-dga-black">{t(c.name)}</p>
                        <p className="mt-0.5 text-xs text-dga-muted">{t(c.verdict)}</p>
                      </div>
                      <span className="chip-info">{t({ ar: 'يتطلب ترخيصًا ومسارًا طويلًا', en: 'Requires licensure & a long track' })}</span>
                      <button onClick={() => openCareer(c.id)} className="btn-ghost px-4 py-2 text-xs">
                        {t({ ar: 'التفاصيل', en: 'Details' })}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 space-y-5">
              {result.top.map((m, i) => {
                const sig = signalMeta[m.career.signal]
                const exp = exposureMeta[m.career.automationExposure]
                return (
                  <motion.div key={m.career.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: i * 0.12 }} className="glass-strong overflow-hidden">
                    <div className="flex items-start gap-4 p-6">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-dga-green text-lg font-black text-white">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-dga-black">{t(m.career.name)}</h3>
                          <span className="rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: sig.bg, color: sig.color }}>
                            {t(sig.name)}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-1">
                          {m.reasons.slice(0, 3).map((r) => (
                            <li key={r} className="flex gap-2 text-sm text-dga-muted">
                              <span className="text-dga-green">✓</span>
                              {reasonText[r] ? t(reasonText[r]) : r}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3">
                          <span className="chip-info">{t(pathwayText[m.pathway])}</span>
                        </p>
                        <div className="mt-4 max-w-sm">
                          <div className="mb-1 flex justify-between text-[11px] text-dga-muted">
                            <span>{t({ ar: 'التعرض للأتمتة', en: 'Automation exposure' })}</span>
                            <span style={{ color: exp.color }}>{t(exp.name)}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-pill bg-dga-line/60">
                            <div className="h-full rounded-pill" style={{ width: `${exp.pct}%`, background: exp.color }} />
                          </div>
                        </div>
                        <p className="mt-4 border-s-2 border-dga-amber ps-3 text-sm leading-relaxed text-dga-ink">{t(m.career.verdict)}</p>
                        <button onClick={() => openCareer(m.career.id)} className="btn-primary mt-4 px-5 py-2 text-sm">
                          {t({ ar: 'البطاقة الكاملة للمهنة', en: 'Full career card' })}
                          <span aria-hidden> {lang === 'ar' ? '←' : '→'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* human bridge (P1-15) */}
            <div className="glass mt-10 p-6">
              <h3 className="flex items-center gap-2 font-bold text-dga-black">
                <Icon name="compass" className="h-5 w-5 text-dga-green" />
                {t({ ar: 'أين تجد موجهًا بشريًا؟', en: 'Where to find a human counselor?' })}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dga-muted">
                {t({
                  ar: 'هذه النتيجة مدخل للحوار لا قرارًا نهائيًا. اطبعها أو شاركها وناقشها مع موجه — القرار الجيد يُبنى في المحادثة.',
                  en: 'This result is a conversation starter, not a final decision. Print or share it and discuss it with a counselor — good decisions are built in conversation.',
                })}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {counselorLinks.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="rounded-btn border border-dga-line p-3.5 no-underline transition-all hover:border-dga-green hover:bg-dga-bg">
                    <span className="block text-sm font-semibold text-dga-black">{t(l.name)}</span>
                    <span className="mt-0.5 block text-xs text-dga-muted">{t(l.hint)}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setAnswers({ q1: [] })
                  setPersona(null)
                  setStep(0)
                }}
                className="btn-ghost px-5 py-2.5 text-sm"
              >
                <Icon name="cycle" className="h-4 w-4" />
                {t({ ar: 'أعد الاختبار', en: 'Retake the quiz' })}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
