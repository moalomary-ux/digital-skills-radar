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

  // 3 weakest domains: largest gap, ties broken by lowest score
  const ranked = domains
    .map((d) => {
      const score = latest.scores[d.id] ?? 0
      const target = targetsMap[d.id] ?? 2
      return { domain: d, score, target, gap: target - score }
    })
    .sort((a, b) => b.gap - a.gap || a.score - b.score)
    .slice(0, 3)

  const monthFrames = [
    { ar: 'الأيام 1–30', en: 'Days 1–30' },
    { ar: 'الأيام 31–60', en: 'Days 31–60' },
    { ar: 'الأيام 61–90', en: 'Days 61–90' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="eyebrow">{t({ ar: 'كيف أصل؟', en: 'How do I get there?' })}</p>
      <h1 className="mt-2 text-3xl font-bold">
        {t({ ar: 'خطوة واضحة: ', en: 'A clear step: ' })}
        <span className="gradient-text">{t({ ar: 'تسعون يومك القادمة', en: 'your next 90 days' })}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-dga-muted">
        {t({
          ar: 'ركّزنا على أوسع ثلاث فجوات بين مستواك الحالي والمستهدف لدورك. كل مجال يحمل سلوكيات عملية للمستوى التالي، وموردين تعليميين حقيقيين، وخطة أسبوعية جاهزة من 13 أسبوعًا.',
          en: 'We focused on the three widest gaps between your current level and your role target. Each domain carries concrete next-level behaviors, two real learning resources, and a ready 13-week plan.',
        })}
      </p>

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
                      {t(monthFrames[idx])} · {t(transitionNames[transitionKey])}
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
                  <span className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber">
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
                  <h3 className="mb-4 text-sm font-bold text-dga-amber">
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
                            <span className="block text-sm font-semibold text-dga-black group-hover:text-dga-amber">
                              {t(res.title)}
                            </span>
                            <span className="block text-[11px] text-dga-muted">
                              {res.provider}
                              {res.language === 'both' && (
                                <span className="ms-1.5 text-dga-green-dark">{t({ ar: '· عربي/إنجليزي', en: '· AR/EN' })}</span>
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
                                    ? 'border-dga-amber bg-dga-amber/15 text-dga-amber'
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
