import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import { decisionQuestions, recommendCareers } from '../data/guidance'
import type { DecisionAnswers } from '../data/guidance'
import { exposureMeta, signalMeta } from '../data/careers'
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

export default function Decide() {
  const { t, lang, dir, openCareer } = useApp()
  const [step, setStep] = useState(0) // 0..4 questions, 5 = results
  const [answers, setAnswers] = useState<DecisionAnswers>({})

  const total = decisionQuestions.length
  const q = step < total ? decisionQuestions[step] : null
  const done = step >= total
  const result = done ? recommendCareers(answers as Required<DecisionAnswers>) : null

  const pick = (key: string) => {
    if (!q) return
    setAnswers((p) => ({ ...p, [q.id]: key }))
    setTimeout(() => setStep((s) => s + 1), 280)
  }

  const slideDir = dir === 'rtl' ? -1 : 1

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
            ar: 'نجيب عن ميولك وقدراتك وأسلوب تعلمك، ونرشّح لك ثلاث مهن بأدلة — مع تحذير صريح إذا كانت ميولك تشير نحو مهنة تندثر.',
            en: 'Tell us your interests, aptitudes and learning style — we match you to three careers with evidence, plus an honest warning if your leanings point at a declining one.',
          })}
        </p>
      </div>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-dga-muted">
          <span>{done ? t({ ar: 'النتيجة', en: 'Result' }) : t({ ar: `السؤال ${step + 1} من ${total}`, en: `Question ${step + 1} of ${total}` })}</span>
          <span className="font-mono font-semibold text-dga-green" dir="ltr">
            {Math.min(100, Math.round((step / total) * 100))}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-pill bg-dga-line/60">
          <motion.div
            className="h-full rounded-pill bg-dga-green"
            animate={{ width: `${Math.min(100, (step / total) * 100)}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* questions */}
        {q && (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40 * slideDir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * slideDir }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-strong p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dga-black sm:text-2xl">{t(q.title)}</h2>
              <div className="mt-6 space-y-3">
                {q.options.map((opt) => {
                  const active = answers[q.id] === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => pick(opt.key)}
                      className={`flex w-full items-center justify-between gap-4 rounded-btn border p-4 text-start transition-all duration-200 ${
                        active ? 'border-dga-green bg-dga-green/10' : 'border-dga-line bg-white hover:border-dga-green hover:bg-dga-bg'
                      }`}
                    >
                      <span className="font-medium text-dga-ink">{t(opt.label)}</span>
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                          active ? 'border-dga-green bg-dga-green text-white' : 'border-dga-line'
                        }`}
                      >
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
            </div>
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn-ghost mt-5 px-4 py-2 text-sm">
                <span aria-hidden>{lang === 'ar' ? '→' : '←'}</span> {t({ ar: 'السؤال السابق', en: 'Previous question' })}
              </button>
            )}
          </motion.div>
        )}

        {/* results */}
        {done && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="text-center">
              <h2 className="text-section font-bold text-dga-green">{t({ ar: 'ترشيحاتنا الثلاثة لك', en: 'Our three matches for you' })}</h2>
              <p className="mt-2 text-sm text-dga-muted">
                {t({ ar: 'محسوبة ميكانيكيًا من إجاباتك وفق قواعد موثقة — لا توقعات ولا إنشاء.', en: 'Computed mechanically from your answers using documented rules — no vibes, no filler.' })}
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
                      {t({ ar: 'التفاصيل', en: 'Details' })}
                    </button>
                  </p>
                ))}
              </div>
            )}

            <div className="mt-8 space-y-5">
              {result.top.map((m, i) => {
                const sig = signalMeta[m.career.signal]
                const exp = exposureMeta[m.career.automationExposure]
                return (
                  <motion.div
                    key={m.career.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.12 }}
                    className="glass-strong overflow-hidden"
                  >
                    <div className="flex items-start gap-4 p-6">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-dga-green text-lg font-black text-white">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-dga-black">{t(m.career.name)}</h3>
                          <span className="rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: sig.bg, color: sig.color }}>
                            {t(sig.name)}
                          </span>
                        </div>
                        {/* reasons */}
                        <ul className="mt-3 space-y-1">
                          {m.reasons.slice(0, 3).map((r) => (
                            <li key={r} className="flex gap-2 text-sm text-dga-muted">
                              <span className="text-dga-green">✓</span>
                              {reasonText[r] ? t(reasonText[r]) : r}
                            </li>
                          ))}
                        </ul>
                        {/* pathway */}
                        <p className="mt-3">
                          <span className="chip-info">{t(pathwayText[m.pathway])}</span>
                        </p>
                        {/* exposure */}
                        <div className="mt-4 max-w-sm">
                          <div className="mb-1 flex justify-between text-[11px] text-dga-muted">
                            <span>{t({ ar: 'التعرض للأتمتة', en: 'Automation exposure' })}</span>
                            <span style={{ color: exp.color }}>{t(exp.name)}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-pill bg-dga-line/60">
                            <div className="h-full rounded-pill" style={{ width: `${exp.pct}%`, background: exp.color }} />
                          </div>
                        </div>
                        <p className="mt-4 border-s-2 border-dga-amber ps-3 text-sm leading-relaxed text-dga-ink">
                          {t(m.career.verdict)}
                        </p>
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

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setAnswers({})
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
