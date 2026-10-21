import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { resolveRoleName, resolveTargets } from '../data/roleLibrary'
import { levelForScore, stageForScore } from '../data/levels'
import { horizonMeta, techClusterById, techsForDomain } from '../data/technologies'
import { careers, categoryById, signalMeta, skillVocab } from '../data/careers'
import { questionsForDomain } from '../data/learning'
import { trackById } from '../data/tracks'
import { pathwayForDomain } from '../data/pathways'
import type { TrackId } from '../data/tracks'
import RadarChart from '../components/RadarChart'
import Disclaimer from '../components/Disclaimer'
import type { L } from '../data/types'
import Icon from '../components/Icon'

type Agreement = 'consistent' | 'self_higher' | 'quiz_higher'

/**
 * Agreement between self-reported level and knowledge-check correctness
 * (expert-review P0-1: the indicator must compare the two, not count
 * correct answers alone). Normalized self-report (score/4) is compared
 * with quiz performance (correct/3); a gap > 0.2 is flagged in both
 * directions — over- AND under-estimation.
 */
function agreementMeta(a: Agreement) {
  return {
    consistent: { ar: 'متسق', en: 'Consistent', color: '#1B8354' },
    self_higher: { ar: 'تقديرك أعلى من التحقق', en: 'Self-rating above quiz', color: '#8A6A00' },
    quiz_higher: { ar: 'التحقق أعلى من تقديرك', en: 'Quiz above self-rating', color: '#1849A9' },
  }[a]
}

function computeAgreement(selfScore: number, correct: number, total: number): Agreement {
  const diff = selfScore / 4 - correct / total
  if (diff > 0.2) return 'self_higher'
  if (diff < -0.2) return 'quiz_higher'
  return 'consistent'
}

export default function Results() {
  const { t, lang, go, history, resetDraft, clearHistory, openTech, openCareer, openDomainAt } = useApp()

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

  const dateStr = new Date(latest.date).toLocaleDateString(lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const hasCalibration = latest.calibration && Object.keys(latest.calibration).length > 0

  // ── v6-B: four separations — self-report / judgment / knowledge / priority ──
  const scenarioScores = latest.scenario ?? null
  const judgmentValues = scenarioScores
    ? domains.map((d) => (scenarioScores[d.id] !== undefined ? (scenarioScores[d.id] / 3) * 4 : 0))
    : undefined

  /**
   * Development-priority rules (documented, rule-based, honest):
   *  - self ≥ 2.5 while judgment < 2 → "تحقق من التضخيم" (self-report exceeds evidence)
   *  - target − max(self, judgment) ≥ 1.5 with both weak (<2) → "أولوية قصوى"
   *  - remaining gap ≥ 0.75 → "أولوية تطوير"; otherwise → "على المسار"
   *  - no scenario evidence → "لم يُقَس بعد"
   */
  type Priority = { id: string; name: L; color: string; bg: string }
  const priorityMeta: Record<string, Priority> = {
    inflation: { id: 'inflation', name: { ar: 'تحقق من التضخيم', en: 'Check possible inflation' }, color: '#8A6A00', bg: '#FEF3D8' },
    urgent: { id: 'urgent', name: { ar: 'أولوية قصوى', en: 'Top priority' }, color: '#B42318', bg: '#FEE4E2' },
    develop: { id: 'develop', name: { ar: 'أولوية تطوير', en: 'Development priority' }, color: '#1849A9', bg: '#EFF8FF' },
    ontrack: { id: 'ontrack', name: { ar: 'على المسار', en: 'On track' }, color: '#255C2B', bg: '#E2F5E5' },
    unmeasured: { id: 'unmeasured', name: { ar: 'لم يُقَس بعد', en: 'Not measured yet' }, color: '#4D5761', bg: '#F2F4F7' },
  }
  const priorities = domains.map((d, i) => {
    const self = data.values[i]
    const scen = judgmentValues ? judgmentValues[i] : undefined
    const target = data.targets[i]
    let p: Priority
    if (scen === undefined || !scenarioScores || scenarioScores[d.id] === undefined) p = priorityMeta.unmeasured
    else if (self >= 2.5 && scen < 2) p = priorityMeta.inflation
    else if (target - Math.max(self, scen) >= 1.5 && self < 2 && scen < 2) p = priorityMeta.urgent
    else if (target - Math.max(self, scen) >= 0.75) p = priorityMeta.develop
    else p = priorityMeta.ontrack
    return { domain: d, self, scen, target, priority: p, gap: target - Math.max(self, scen ?? self) }
  })

  // headline sentence (the review's acceptance model): task + skill + starting evidence + first step
  const rankedPriorities = priorities
    .filter((p) => p.priority.id !== 'ontrack' && p.priority.id !== 'unmeasured')
    .sort((a, b) => b.gap - a.gap)
  const headlineDomain = rankedPriorities[0]?.domain ?? null
  const headlineBehavior = headlineDomain
    ? (() => {
        const pw = pathwayForDomain(headlineDomain.id)
        const self = data.values[domains.findIndex((d) => d.id === headlineDomain.id)]
        const from = Math.max(1, Math.min(3, Math.round(self)))
        const tr = pw.transitions.find((x) => x.from === from) ?? pw.transitions[pw.transitions.length - 1]
        return tr.behaviors[0]
      })()
    : null

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
          {latest.trackId && trackById(latest.trackId as TrackId) && (
            <p className="mt-1.5 flex items-center gap-2 text-xs">
              <span className="chip-info">
                {t({ ar: 'المسار: ', en: 'Track: ' })}
                {t(trackById(latest.trackId as TrackId)!.name)}
              </span>
              <span className="text-dga-muted">{t(trackById(latest.trackId as TrackId)!.proves)}</span>
            </p>
          )}
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

      {/* honest-scope disclaimer before any result output */}
      <Disclaimer compact={false} />

      {/* v6-B headline: the review's acceptance sentence model */}
      {headlineDomain && headlineBehavior && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-strong mt-4 border-s-4 !border-s-dga-green p-6">
          <p className="text-sm leading-loose text-dga-ink">
            <span className="font-bold text-dga-green-dark">{t({ ar: 'خلاصتك العملية: ', en: 'Your actionable summary: ' })}</span>
            {t({
              ar: `مهمتك القابلة للتحسين الآن هي مهام «${headlineDomain.name.ar}»، والمهارة الأهم لها هي «${headlineDomain.shortName.ar}»، ودليل نقطة بدايتك أن تقديرك الذاتي ${(data.values[domains.findIndex((d) => d.id === headlineDomain.id)]).toFixed(1)} من 4 بينما فهمك الموقفي ${(judgmentValues ? judgmentValues[domains.findIndex((d) => d.id === headlineDomain.id)] : 0).toFixed(1)} من 4، وخطوتك الأولى: `,
              en: `Your most improvable task area now is “${headlineDomain.name.en}”, its most important skill is “${headlineDomain.shortName.en}”, your starting evidence: self-estimate ${(data.values[domains.findIndex((d) => d.id === headlineDomain.id)]).toFixed(1)} of 4 vs situational judgment ${(judgmentValues ? judgmentValues[domains.findIndex((d) => d.id === headlineDomain.id)] : 0).toFixed(1)} of 4, and your first step: `,
            })}
            <span className="font-semibold">{t(headlineBehavior)}</span>
          </p>
        </motion.div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* radar card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-strong p-4 sm:p-6">
          <RadarChart
            labels={domains.map((d) => d.shortName)}
            values={data.values}
            targets={data.targets}
            previous={data.prev}
            judgment={judgmentValues}
            lang={lang}
            interactive
            animate
            onAxisClick={(i) => openDomainAt(domains[i].id)}
          />
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-dga-muted">
            {t({ ar: 'أ · تقديري لنفسي  +  ب · فهمي للمواقف', en: 'A · My self-estimate  +  B · My situational judgment' })}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-dga-muted">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-dga-green" />
              {t({ ar: 'مستواك الحالي (تقرير ذاتي)', en: 'Current level (self-report)' })}
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
            {judgmentValues && (
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-4 border-t-2 border-dashed border-[#1849A9]" />
                {t({ ar: 'فهمك الموقفي (سيناريوهات)', en: 'Situational judgment (scenarios)' })}
              </span>
            )}
            <span className="text-dga-muted">{t({ ar: '· انقر اسم مجال للخريطة التفاعلية', en: '· click a domain name for the interactive map' })}</span>
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
            <p className="mt-2 text-sm text-dga-green">
              {t({ ar: 'المتوسط العام: ', en: 'Overall average: ' })}
              <bdi className="font-mono font-bold" dir="ltr">
                {latest.overall.toFixed(1)}
              </bdi>{' '}
              {t({ ar: 'من', en: 'of' })}{' '}
              <bdi className="font-mono font-bold" dir="ltr">
                4.0
              </bdi>
            </p>
            <p className="mt-1.5 text-[11px] text-dga-muted">
              {t({ ar: 'تقدير ذاتي إرشادي — غير متحقق منه سيكومتريًا', en: 'Indicative self-estimate — not psychometrically validated' })}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-dga-ink">{t(data.stage.description)}</p>
            {previous && (
              <p className={`mt-3 text-xs font-semibold ${latest.overall >= previous.overall ? 'text-dga-green-dark' : 'text-rose-600'}`}>
                {latest.overall >= previous.overall ? '▲' : '▼'}{' '}
                {t({
                  ar: `${Math.abs(latest.overall - previous.overall).toFixed(1)} نقطة عن التقييم السابق`,
                  en: `${Math.abs(latest.overall - previous.overall).toFixed(1)} pts vs previous assessment`,
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
            <h2 className="mb-1 text-sm font-bold text-dga-ink">{t({ ar: 'ج · تحققي المعرفي — مستوياتك حسب المجال', en: 'C · My knowledge check — levels by domain' })}</h2>
            <p className="mb-4 text-[11px] text-dga-muted">{t({ ar: 'الاتساق يقارن تقديرك الذاتي بإجابات التحقق في الاتجاهين.', en: 'Agreement compares your self-estimate with knowledge-check answers in both directions.' })}</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {domains.map((d, i) => {
                const lvl = levelForScore(data.values[i])
                const cal = latest.calibration?.[d.id]
                const qTotal = questionsForDomain(d.id).length
                const agree: Agreement | null = cal === undefined ? null : computeAgreement(data.values[i], cal, qTotal)
                return (
                  <div key={d.id} onClick={() => openDomainAt(d.id)} className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-dga-line bg-dga-bg px-3.5 py-2.5 transition-colors hover:border-dga-green">
                    <span className="flex items-center gap-2 text-xs font-medium text-dga-black">
                      <Icon name={d.icon} className="h-4 w-4 text-dga-green" />
                      {t(d.shortName)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {agree && (
                        <span
                          className="flex items-center gap-1 text-[10px]"
                          style={{ color: agreementMeta(agree).color }}
                          title={t(agreementMeta(agree))}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: agreementMeta(agree).color }} />
                          {t(agreementMeta(agree))}
                        </span>
                      )}
                      <span className="chip border-dga-amber/40 bg-dga-amber/10 text-[11px] text-dga-amber-tx">
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
                  ar: 'مؤشر الاتساق يقارن تقديرك الذاتي مع إجاباتك على أسئلة التحقق في الاتجاهين: «تقديرك أعلى» قد يعني تفاؤلًا ذاتيًا شائعًا، و«التحقق أعلى» قد يعني أنك تبخس قدرتك. أسئلة التحقق تقيس المعرفة التأسيسية فقط — لا تثبت المهارة ولا تنفيها.',
                  en: 'The agreement indicator compares your self-rating with your knowledge-check answers in both directions: "self-rating above quiz" may reflect common self-assessment optimism, and "quiz above self-rating" may mean you undersell yourself. Knowledge checks cover foundational knowledge only — they neither prove nor disprove skill.',
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
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${closed ? 'bg-dga-green/10 text-dga-green-dark' : 'bg-dga-amber/15 text-dga-amber-tx'}`}>
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

      {/* v6-B panel د: development priority */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="mt-10">
        <h2 className="text-2xl font-bold">{t({ ar: 'د · أولويتي التطويرية', en: 'D · My development priority' })}</h2>
        <p className="mt-1 max-w-2xl text-sm text-dga-muted">
          {t({
            ar: 'قاعدة معلنة: «تقدير مرتفع + فهم مواقف ضعيف» تُوسم كتضخيم محتمل؛ «فجوة كبيرة مع ضعف الدليلين» أولوية قصوى. القاعدة تحريرية موثقة في صفحة المنهجية.',
            en: 'A declared rule: “high self-report + weak judgment” flags possible inflation; “large gap with both evidence layers weak” marks top priority. The rule is editorial and documented on the Methodology page.',
          })}
        </p>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {priorities.map((p) => (
            <div key={p.domain.id} className="glass p-4">
              <div className="flex items-center gap-2">
                <Icon name={p.domain.icon} className="h-4 w-4 text-dga-green" />
                <p className="flex-1 text-xs font-semibold text-dga-black">{t(p.domain.shortName)}</p>
              </div>
              <span className="mt-2.5 inline-block rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: p.priority.bg, color: p.priority.color }}>
                {t(p.priority.name)}
              </span>
              <p className="mt-2 font-mono text-[10.5px] text-dga-muted" dir="ltr">
                {p.self.toFixed(1)} / {p.scen !== undefined ? p.scen.toFixed(1) : '—'} / {p.target}
              </p>
              <p className="text-[9.5px] text-dga-muted">{t({ ar: 'ذاتي / موقف / مستهدف', en: 'self / judgment / target' })}</p>
            </div>
          ))}
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

      {/* P1-12: the journey's single prominent next step */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-12"
      >
        <div className="glass-strong overflow-hidden">
          <div className="bg-dga-green p-6 text-center text-white sm:p-8">
            <h2 className="text-2xl font-bold">{t({ ar: 'خطوتك التالية الوحيدة الآن', en: 'Your single next step now' })}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
              {t({
                ar: 'النتيجة بلا خطة رقم جميل فقط — افتح مسارات التطوير وابدأ أسبوعك الأول اليوم.',
                en: 'A result without a plan is just a nice number — open the development pathways and start week one today.',
              })}
            </p>
            <button
              onClick={() => go('pathways')}
              className="mt-5 inline-flex items-center gap-2 rounded-btn bg-dga-amber px-8 py-3.5 text-base font-bold text-dga-black transition-colors hover:bg-[#c89302]"
            >
              {t({ ar: 'ابدأ خطتك لـ90 يومًا', en: 'Start your 90-day plan' })}
              <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
            </button>
          </div>
          <div className="saudi-band" aria-hidden />
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
              {t({ ar: 'كل المهن الخمسين', en: 'All 50 careers' })}
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
