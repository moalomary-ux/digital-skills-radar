import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { resolveRoleName, resolveTargets } from '../data/roleLibrary'
import { levelForScore, stageForScore } from '../data/levels'
import { horizonMeta, techClusterById, techsForDomain } from '../data/technologies'
import { careers, categoryById, signalMeta, skillVocab } from '../data/careers'
import RadarChart from '../components/RadarChart'
import Icon from '../components/Icon'

type Confidence = 'high' | 'medium' | 'low'

function confidenceMeta(c: Confidence) {
  return {
    high: { ar: 'ثقة عالية', en: 'High confidence', color: '#1B8354' },
    medium: { ar: 'ثقة متوسطة', en: 'Medium confidence', color: '#DBA102' },
    low: { ar: 'ثقة منخفضة', en: 'Low confidence', color: '#B42318' },
  }[c]
}

export default function Results() {
  const { t, lang, go, history, resetDraft, clearHistory, openTech, openCareer } = useApp()

  const latest = history[history.length - 1]
  const previous = history.length > 1 ? history[history.length - 2] : null

  const data = useMemo(() => {
    if (!latest) return null
    const targetsMap = resolveTargets(latest.roleId)
    const values = domains.map((d) => latest.scores[d.id] ?? 0)
    const targets = domains.map((d) => targetsMap[d.id] ?? 2)
    const prev = previous ? domains.map((d) => previous.scores[d.id] ?? 0) : undefined
    const gaps = domains
      .map((d, i) => ({
        domain: d,
        score: values[i],
        target: targets[i],
        gap: targets[i] - values[i],
        delta: prev ? values[i] - prev[i] : undefined,
      }))
      .sort((a, b) => b.gap - a.gap)
    return { values, targets, prev, gaps, stage: stageForScore(latest.overall) }
  }, [latest, previous])

  // innovation link: technologies tied to the 2 weakest domains
  const innovationTechs = useMemo(() => {
    if (!data) return []
    const weakest = data.gaps.slice(0, 2).map((g) => g.domain.id)
    const seen = new Set<string>()
    return weakest
      .flatMap((d) => techsForDomain(d))
      .filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)))
      .sort((a, b) => b.trl - a.trl)
      .slice(0, 5)
  }, [data])

  // careers matching the user's 2 strongest domains (growing/transforming first)
  const matchingCareers = useMemo(() => {
    if (!data) return []
    const strongest = domains
      .map((d, i) => ({ id: d.id, score: data.values[i] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((x) => x.id)
    const signalRank = { GROWING: 0, TRANSFORMING: 1, DECLINING: 2 } as const
    return careers
      .map((c) => ({
        career: c,
        overlap: c.keySkills.filter((k) => {
          const dom = skillVocab[k]?.domainId
          return dom !== null && strongest.includes(dom)
        }).length,
      }))
      .filter((x) => x.overlap > 0)
      .sort((a, b) => signalRank[a.career.signal] - signalRank[b.career.signal] || b.overlap - a.overlap)
      .slice(0, 3)
      .map((x) => x.career)
  }, [data])

  if (!latest || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="glass p-10">
          <Icon name="radar" className="mx-auto h-10 w-10 text-dga-green" />
          <h1 className="mt-4 text-2xl font-bold">{t({ ar: 'لا توجد نتائج بعد', en: 'No results yet' })}</h1>
          <p className="mt-3 text-dga-muted">
            {t({ ar: 'أكمل التقييم أولًا ليظهر رادارك هنا.', en: 'Complete the assessment first and your radar will appear here.' })}
          </p>
          <button onClick={() => go('wizard')} className="btn-primary mt-6">
            {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
          </button>
        </div>
      </div>
    )
  }

  const dateStr = new Date(latest.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const hasCalibration = latest.calibration && Object.keys(latest.calibration).length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t({ ar: 'نتيجتك', en: 'Your result' })}</p>
          <h1 className="mt-2 text-3xl font-bold">{t({ ar: 'رادار مهاراتك الرقمية', en: 'Your digital skills radar' })}</h1>
          <p className="mt-2 text-sm text-dga-muted">
            {t(resolveRoleName(latest.roleId))} · {dateStr}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-3">
          <button onClick={() => window.print()} className="btn-ghost px-5 py-2.5 text-sm">
            {t({ ar: 'طباعة / حفظ PDF', en: 'Print / Save PDF' })}
          </button>
          <button
            onClick={() => {
              resetDraft()
              go('wizard')
            }}
            className="btn-ghost px-5 py-2.5 text-sm"
          >
            {t({ ar: 'إعادة التقييم', en: 'Retake assessment' })}
          </button>
          <button
            onClick={() => {
              if (window.confirm(t({ ar: 'حذف كل النتائج المحفوظة؟', en: 'Delete all saved results?' }))) clearHistory()
            }}
            className="btn-ghost px-5 py-2.5 text-sm text-rose-600 hover:border-rose-400"
          >
            {t({ ar: 'مسح السجل', en: 'Clear history' })}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* radar card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-strong p-4 sm:p-6">
          <RadarChart
            labels={domains.map((d) => d.shortName)}
            values={data.values}
            targets={data.targets}
            previous={data.prev}
            lang={lang}
            interactive
            animate
          />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-dga-muted">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-dga-green" />
              {t({ ar: 'مستواك الحالي', en: 'Current level' })}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-dga-amber" />
              {t({ ar: 'المستهدف لدورك', en: 'Role target' })}
            </span>
            {data.prev && (
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-4 border-t-2 border-dashed border-slate-400" />
                {t({ ar: 'التقييم السابق', en: 'Previous assessment' })}
              </span>
            )}
          </div>
        </motion.div>

        {/* stage + domain chips */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass p-7 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-dga-muted">
              {t({ ar: 'مرحلتك العامة', en: 'Your overall stage' })}
            </p>
            <p className="gradient-text mt-3 text-5xl font-black">{t(data.stage.name)}</p>
            <p className="mt-2 font-mono text-sm text-dga-green">{latest.overall.toFixed(2)} / 4.00</p>
            <p className="mt-4 text-sm leading-relaxed text-dga-ink">{t(data.stage.description)}</p>
            {previous && (
              <p className={`mt-3 text-xs font-semibold ${latest.overall >= previous.overall ? 'text-dga-green-dark' : 'text-rose-600'}`}>
                {latest.overall >= previous.overall ? '▲' : '▼'}{' '}
                {t({
                  ar: `${Math.abs(latest.overall - previous.overall).toFixed(2)} نقطة عن التقييم السابق`,
                  en: `${Math.abs(latest.overall - previous.overall).toFixed(2)} pts vs previous assessment`,
                })}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-6"
          >
            <h2 className="mb-4 text-sm font-bold text-dga-ink">{t({ ar: 'مستوياتك حسب المجال', en: 'Your levels by domain' })}</h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {domains.map((d, i) => {
                const lvl = levelForScore(data.values[i])
                const cal = latest.calibration?.[d.id]
                const conf: Confidence | null = cal === undefined ? null : cal >= 2 ? 'high' : cal === 1 ? 'medium' : 'low'
                return (
                  <div key={d.id} className="flex items-center justify-between gap-2 rounded-xl border border-dga-line bg-dga-bg px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-medium text-dga-black">
                      <Icon name={d.icon} className="h-4 w-4 text-dga-green" />
                      {t(d.shortName)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {conf && (
                        <span
                          className="flex items-center gap-1 text-[10px]"
                          style={{ color: confidenceMeta(conf).color }}
                          title={t(confidenceMeta(conf))}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: confidenceMeta(conf).color }} />
                          {t(confidenceMeta(conf))}
                        </span>
                      )}
                      <span className="chip border-dga-amber/40 bg-dga-amber/10 text-[11px] text-dga-amber">
                        {t(lvl.name)} · {data.values[i].toFixed(1)}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
            {hasCalibration && (
              <p className="mt-4 rounded-lg bg-dga-bg p-3 text-[11.5px] leading-relaxed text-dga-muted">
                {t({
                  ar: 'مؤشر الثقة يعكس تطابق إجابات أسئلة التحقق مع تقييمك الذاتي (عالية ≥ 2/3 صحيحة). الدراسات تشير إلى أن التقييم الذاتي يميل للتفاؤل — خصوصًا عند الخبرة المحدودة — فتعامل مع الثقة المنخفضة كدعوة للمراجعة لا كحكم نهائي.',
                  en: 'The confidence indicator reflects how your knowledge-check answers align with your self-rating (high = ≥2/3 correct). Research shows self-assessment tends to be optimistic — especially at lower expertise — so treat low confidence as an invitation to review, not a verdict.',
                })}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* gap analysis */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8"
      >
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t({ ar: 'بماذا تحتاج أن تركز؟', en: 'What should you focus on?' })}</h2>
            <p className="mt-1 text-sm text-dga-muted">
              {t({ ar: 'الفجوات مرتبة من الأكبر إلى الأصغر — الفجوة = المستهدف − الحالي.', en: 'Gaps sorted largest first — gap = target − current.' })}
            </p>
          </div>
          <button onClick={() => go('pathways')} className="no-print btn-primary px-5 py-2.5 text-sm">
            {t({ ar: 'مسارات التطوير', en: 'Development pathways' })}
            <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.gaps.map((g, i) => {
            const closed = g.gap <= 0
            const pct = Math.max(0, Math.min(100, (g.gap / 4) * 100))
            return (
              <div key={g.domain.id} className="glass flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${closed ? 'bg-dga-green/10 text-dga-green-dark' : 'bg-dga-amber/15 text-dga-amber'}`}>
                  {closed ? '✓' : i + 1}
                </span>
                <div className="min-w-[180px] flex-1">
                  <p className="text-sm font-semibold">{t(g.domain.name)}</p>
                  <p className="text-xs text-dga-muted">
                    {t({ ar: 'الحالي', en: 'Current' })} {g.score.toFixed(1)} · {t({ ar: 'المستهدف', en: 'Target' })} {g.target}
                    {g.delta !== undefined && (
                      <span className={g.delta >= 0 ? 'text-dga-green-dark' : 'text-rose-600'}>
                        {' '}
                        · {g.delta >= 0 ? '+' : ''}
                        {g.delta.toFixed(1)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <div className="h-2 overflow-hidden rounded-full bg-dga-bg">
                    <div
                      className={`h-full rounded-full ${closed ? 'bg-dga-green' : 'bg-gradient-to-r from-dga-green to-dga-green-ink'}`}
                      style={{ width: closed ? '100%' : `${pct}%` }}
                    />
                  </div>
                </div>
                <span className={`w-20 text-end text-sm font-bold ${closed ? 'text-dga-green-dark' : 'text-dga-black'}`}>
                  {closed ? t({ ar: 'مكتمل', en: 'Met' }) : `+${g.gap.toFixed(1)}`}
                </span>
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* innovation link */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {t({ ar: 'تقنيات ', en: 'Technologies ' })}
              <span className="gradient-text">{t({ ar: 'تنتظر مهاراتك', en: 'waiting for your skills' })}</span>
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-dga-muted">
              {t({
                ar: 'هذه التقنيات من رادار التقنيات مرتبطة بأضعف مجالين لديك — كل خطوة في مسارك التعلّمي تقرّب جهتك من تبنيها.',
                en: 'These tech-radar technologies are linked to your two weakest domains — every step in your learning pathway brings your organization closer to adopting them.',
              })}
            </p>
          </div>
          <button onClick={() => go('tech-radar')} className="no-print btn-ghost shrink-0 px-5 py-2.5 text-sm">
            {t({ ar: 'رادار التقنيات الكامل', en: 'Full tech radar' })}
            <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {innovationTechs.map((tech, i) => (
            <motion.button
              key={tech.id}
              onClick={() => openTech(tech.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="glass group p-5 text-start transition-all duration-300 hover:border-dga-amber"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="chip text-[10px] text-dga-muted">{t(techClusterById(tech.clusterId).name)}</span>
                <span className="font-mono text-xs font-bold text-dga-green">TRL {tech.trl}</span>
              </div>
              <h3 className="mt-3 font-bold leading-snug group-hover:text-dga-green">{t(tech.name)}</h3>
              <div className="mt-3 flex items-center gap-2 text-[11px]">
                <span
                  className="chip"
                  style={{ borderColor: `${horizonMeta[tech.horizon].color}55`, color: horizonMeta[tech.horizon].color }}
                >
                  {t(horizonMeta[tech.horizon].name)}
                </span>
                <span className="text-dga-muted">
                  {tech.domainIds.map((d) => t(domains.find((x) => x.id === d)!.shortName)).join(' · ')}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* careers matching the user's strongest domains */}
      {matchingCareers.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {t({ ar: 'مهن ', en: 'Careers ' })}
                <span className="gradient-text">{t({ ar: 'تليق بنقاط قوتك', en: 'that fit your strengths' })}</span>
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-dga-muted">
                {t({
                  ar: 'بناءً على أقوى مجالين في رادارك — مهن تستخدم هذه المهارات وتزدهر في سوق الغد.',
                  en: 'Based on the two strongest domains in your radar — careers that use these skills and thrive in tomorrow’s market.',
                })}
              </p>
            </div>
            <button onClick={() => go('careers')} className="no-print btn-ghost shrink-0 px-5 py-2.5 text-sm">
              {t({ ar: 'كل المهن الثلاثين', en: 'All 30 careers' })}
              <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchingCareers.map((c, i) => {
              const sig = signalMeta[c.signal]
              return (
                <motion.button
                  key={c.id}
                  onClick={() => openCareer(c.id)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="glass group p-5 text-start transition-all duration-300 hover:border-dga-green"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="chip text-[10px]">{t(categoryById(c.category).name)}</span>
                    <span className="rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: sig.bg, color: sig.color }}>
                      {t(sig.name)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-bold leading-snug group-hover:text-dga-green-dark">{t(c.name)}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-dga-muted">{t(c.verdict)}</p>
                </motion.button>
              )
            })}
          </div>
        </motion.section>
      )}
    </div>
  )
}
