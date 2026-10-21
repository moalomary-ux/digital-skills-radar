import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { resolveTargets } from '../data/roleLibrary'
import { levelForScore } from '../data/levels'
import { pathwayForDomain } from '../data/pathways'
import {
  fillPlanText,
  learningResources,
  nationalPrograms,
  planTemplates,
  transitionForScore,
  transitionNames,
} from '../data/learning'
import type { TransitionKey } from '../data/learning'
import Icon from '../components/Icon'

const typeLabel = {
  course: { ar: 'دورة', en: 'Course' },
  certification: { ar: 'شهادة', en: 'Certification' },
  program: { ar: 'برنامج', en: 'Program' },
  reference: { ar: 'مرجع', en: 'Reference' },
} as const

export default function Pathways() {
  const { t, lang, go, history } = useApp()
  const [openPlan, setOpenPlan] = useState<string | null>(null)

  const latest = history[history.length - 1]

  if (!latest) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="glass p-10">
          <Icon name="compass" className="mx-auto h-10 w-10 text-dga-green" />
          <h1 className="mt-4 text-2xl font-bold">{t({ ar: 'مسارك يبدأ من التقييم', en: 'Your pathway starts with the assessment' })}</h1>
          <p className="mt-3 text-dga-muted">
            {t({
              ar: 'بعد إكمال التقييم سنحدد أضعف ثلاثة مجالات لديك ونبني خطة التسعين يومًا القادمة.',
              en: 'After you complete the assessment we will identify your three weakest domains and build your next 90 days.',
            })}
          </p>
          <button onClick={() => go('wizard')} className="btn-primary mt-6">
            {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
          </button>
        </div>
      </div>
    )
  }

  const targetsMap = resolveTargets(latest.roleId)

  // only domains with a REAL gap (target > current) get a plan — v6 defect A5
  const ranked = domains
    .map((d) => {
      const score = latest.scores[d.id] ?? 0
      const target = targetsMap[d.id] ?? 2
      return { domain: d, score, target, gap: target - score }
    })
    .filter((r) => r.gap > 0)
    .sort((a, b) => b.gap - a.gap || a.score - b.score)
    .slice(0, 3)

  // single honest duration framing: a 90-day plan IS 13 weeks
  const planFrame = { ar: 'خطة 90 يومًا — 13 أسبوعًا', en: '90-day plan — 13 weeks' }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="eyebrow">{t({ ar: 'كيف أصل؟', en: 'How do I get there?' })}</p>
      <h1 className="mt-2 text-3xl font-bold">
        {t({ ar: 'خطوة واضحة: ', en: 'A clear step: ' })}
        <span className="gradient-text">{t({ ar: 'تسعون يومك القادمة', en: 'your next 90 days' })}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-dga-muted">
        {t({
          ar: 'نبني الخطط فقط للمجالات التي فيها فجوة فعلية (المستهدف أعلى من الحالي) — بحد أقصى ثلاث أولويات. كل مجال يحمل سلوكيات عملية للمستوى التالي، وموردين تعليميين حقيقيين، وخطة 90 يومًا (13 أسبوعًا).',
          en: 'We build plans only for domains with a real gap (target above current) — at most three priorities. Each domain carries concrete next-level behaviors, two real learning resources, and a 90-day (13-week) plan.',
        })}
      </p>

      {ranked.length === 0 && (
        <div className="glass mt-10 p-8 text-center">
          <Icon name="flag" className="mx-auto h-9 w-9 text-dga-green" />
          <h2 className="mt-3 text-xl font-bold text-dga-black">
            {t({ ar: 'لا فجوات حالياً — أنت عند مستهدف دورك أو فوقه', en: 'No gaps right now — you are at or above your role target' })}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-dga-muted">
            {t({
              ar: 'التوصية الصادقة: حافظ على المستوى بمشاركة المعرفة (التوجيه والكتابة) وأعد التقييم عندما يتغير دورك. يمكنك أيضًا رفع سقفك باختيار دور أعلى من مكتبة الأدوار.',
              en: 'The honest recommendation: maintain your level by sharing knowledge (coaching, writing) and reassess when your role changes. You can also raise the bar by picking a senior role from the library.',
            })}
          </p>
          <button onClick={() => go('roles')} className="btn-ghost mt-4 px-5 py-2.5 text-sm">
            {t({ ar: 'استكشف أدوارًا أعلى', en: 'Explore senior roles' })}
          </button>
        </div>
      )}

      <div className="mt-10 space-y-8">
        {ranked.map((r, idx) => {
          const currentLevel = levelForScore(Math.max(1, r.score))
          const pathway = pathwayForDomain(r.domain.id)
          const from = Math.max(1, Math.min(3, Math.round(r.score)))
          const behaviorTransition =
            pathway.transitions.find((tr) => tr.from === from) ?? pathway.transitions[pathway.transitions.length - 1]
          const transitionKey: TransitionKey = transitionForScore(r.score)
          const [res1, res2] = learningResources[r.domain.id][transitionKey]
          const template = planTemplates[transitionKey]
          const planOpen = openPlan === r.domain.id
          const fill = (text: { ar: string; en: string }) =>
            fillPlanText(text, lang, r.domain.name, t(res1.title), t(res2.title))

          return (
            <motion.article
              key={r.domain.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className="glass overflow-hidden"
            >
              {/* domain head */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dga-line bg-dga-bg p-6">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-dga-green/20 to-dga-green-ink/20 text-dga-green">
                    <Icon name={r.domain.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">{t(r.domain.name)}</h2>
                    <p className="text-xs text-dga-muted">
                      {t(planFrame)} · {t(transitionNames[transitionKey])}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="chip border-dga-green/30 bg-dga-green/10 text-dga-green-dark">
                    {t({ ar: 'أنت الآن:', en: 'Now:' })} {t(currentLevel.name)} ({r.score.toFixed(1)})
                  </span>
                  <span className="text-dga-muted" aria-hidden>
                    {lang === 'ar' ? '←' : '→'}
                  </span>
                  <span className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber-tx">
                    {t({ ar: 'الهدف:', en: 'Target:' })} {t(levelForScore(r.target).name)}
                  </span>
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-2">
                {/* behaviors */}
                <div className="border-dga-line p-6 md:border-e">
                  <h3 className="mb-4 text-sm font-bold text-dga-green-dark">{t({ ar: 'سلوكياتك القادمة', en: 'Your next behaviors' })}</h3>
                  <ul className="space-y-3.5">
                    {behaviorTransition.behaviors.map((b, bi) => (
                      <li key={bi} className="flex gap-3 text-sm leading-relaxed text-dga-black">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-dga-green/10 text-[11px] font-bold text-dga-green-dark">
                          {bi + 1}
                        </span>
                        {t(b)}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* learning resources */}
                <div className="p-6">
                  <h3 className="mb-4 text-sm font-bold text-dga-amber-tx">
                    {t({ ar: 'موردا التعلم لهذا الانتقال', en: 'Learning resources for this transition' })}
                  </h3>
                  <ul className="space-y-3">
                    {[res1, res2].map((res) => (
                      <li key={res.url}>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-3 rounded-xl border border-dga-line bg-dga-bg px-4 py-3 no-underline transition-all hover:border-dga-amber/50 hover:bg-dga-amber/5"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-dga-black group-hover:text-dga-amber-tx">
                              {t(res.title)}
                            </span>
                            <span className="block text-[11px] text-dga-muted">
                              {res.provider}
                              {res.language === 'both' && (
                                <span className="ms-1.5 text-dga-green-dark">{t({ ar: '· عربي/إنجليزي', en: '· AR/EN' })}</span>
                              )}
                              {res.type === 'certification' && (
                                <span className="ms-1.5 text-dga-amber-tx">
                                  {t({ ar: '· قد تعوَّض رسومها عبر دعم هدف', en: '· fees may be reimbursed via Hadaf support' })}
                                </span>
                              )}
                            </span>
                          </span>
                          <span className="chip shrink-0 text-[10px] text-dga-muted">{t(typeLabel[res.type])}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 13-week plan */}
              <div className="border-t border-dga-line">
                <button
                  onClick={() => setOpenPlan(planOpen ? null : r.domain.id)}
                  className="flex w-full items-center justify-between gap-3 p-5 text-start transition-colors hover:bg-dga-bg"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-dga-green/20 to-dga-green-ink/20 text-sm">
                      🗓
                    </span>
                    <span>
                      <span className="block text-sm font-bold">
                        {t({ ar: 'خطة التسعين يومًا — 13 أسبوعًا', en: 'The 90-day plan — 13 weeks' })}
                      </span>
                      <span className="block text-[11.5px] text-dga-muted">{fill(template.goal)}</span>
                    </span>
                  </span>
                  <span className={`shrink-0 text-dga-muted transition-transform duration-300 ${planOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <AnimatePresence initial={false}>
                  {planOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ol className="relative mx-6 mb-6 border-s border-dga-line ps-0">
                        {template.weeks.map((week, wi) => {
                          const isCheckpoint = /تحقق|التقييم|نقطة|Assessment|Checkpoint/i.test(
                            lang === 'ar' ? week.text.ar : week.text.en
                          )
                          return (
                            <li key={week.w} className="relative flex gap-4 pb-5 ps-6 last:pb-1">
                              <span
                                className={`absolute -start-[13px] top-0 grid h-[26px] w-[26px] place-items-center rounded-full border font-mono text-[10px] font-bold ${
                                  isCheckpoint
                                    ? 'border-dga-amber bg-dga-amber/15 text-dga-amber-tx'
                                    : 'border-dga-green/50 bg-white text-dga-green'
                                }`}
                              >
                                {week.w}
                              </span>
                              <motion.p
                                initial={{ opacity: 0, x: lang === 'ar' ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: wi * 0.03 }}
                                className="text-[13px] leading-relaxed text-dga-ink"
                              >
                                {fill(week.text)}
                              </motion.p>
                            </li>
                          )
                        })}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* Saudi national support rails */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-dga-green-dark">
          {t({ ar: 'مسارات الدعم الوطنية — مجانية أو معوَّضة', en: 'National support rails — free or reimbursed' })}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {nationalPrograms.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-5 no-underline transition-all hover:border-dga-green hover:shadow-card-lg"
            >
              <h3 className="font-bold text-dga-black">{t(p.name)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-dga-muted">{t(p.description)}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-10 glass p-6 text-center">
        <p className="text-sm text-dga-ink">
          {t({
            ar: 'نصيحة: أعد التقييم بعد 90 يومًا لترى المضلع الجديد يتمدد فوق القديم — المقارنة الزمنية مفعّلة تلقائيًا.',
            en: 'Tip: retake the assessment after 90 days and watch the new polygon stretch over the old one — time comparison is automatic.',
          })}
        </p>
        <button onClick={() => go('results')} className="btn-ghost mt-4 px-5 py-2.5 text-sm">
          {t({ ar: 'العودة إلى النتائج', en: 'Back to results' })}
        </button>
      </div>
    </div>
  )
}
