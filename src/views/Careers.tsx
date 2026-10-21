import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import {
  careerAdmissionNotes,
  careerById,
  careerIsco,
  careerWomenNotes,
  careerCategories,
  careerExposureDetail,
  careerProvenance,
  careers,
  categoryById,
  exposureMeta,
  horizonNoteMeta,
  signalMeta,
  skillVocab,
} from '../data/careers'
import type { Career, Exposure, Signal } from '../data/careers'
import { domainById } from '../data/domains'
import { CAREER_PREFIX, LIB_PREFIX } from '../data/roleLibrary'
import Icon from '../components/Icon'
import type { L } from '../data/types'

/** P1-17: trust tier badges derived from the provenance text. */
function sourceBadges(sourceText: string): { label: L; cls: string }[] {
  const badges: { label: L; cls: string }[] = []
  const official = /WEF|ILO|منظمة العمل|OECD|رسمي|official|GASTAT|الإحصاء|البنك الدولي|World Bank|SAMA|البنك المركزي|يونسكو|UNESCO|غينيس|وزارة|هيئة|McKinsey|Boeing|ISC2|استراتيجية|Strategy/i.test(sourceText)
  const survey = /استطلاع|survey|Coursera|LinkedIn|TestGorilla/i.test(sourceText)
  const selfReported = /ذاتي|self-report|يفيد|إفصاحات|disclosures/i.test(sourceText)
  if (official) badges.push({ label: { ar: 'تقرير دولي / مصدر رسمي', en: 'Intl. report / official' }, cls: 'bg-dga-tag-ok-bg text-dga-tag-ok-text' })
  if (survey) badges.push({ label: { ar: 'استطلاع رأي', en: 'Survey' }, cls: 'bg-dga-tag-info-bg text-dga-tag-info-text' })
  if (selfReported) badges.push({ label: { ar: 'بيان ذاتي الإبلاغ', en: 'Self-reported' }, cls: 'bg-dga-amber/10 text-dga-amber-tx' })
  if (badges.length === 0) badges.push({ label: { ar: 'حكم تحريري موثق', en: 'Documented editorial judgment' }, cls: 'bg-dga-bg text-dga-muted' })
  return badges
}

type SignalFilter = Signal | null
type ExposureFilter = Exposure | null

export default function Careers() {
  const { t, lang, go, setRoleId, pendingCareerId, clearPendingCareer } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [fSignal, setFSignal] = useState<SignalFilter>(null)
  const [fCategory, setFCategory] = useState<string | null>(null)
  const [fExposure, setFExposure] = useState<ExposureFilter>(null)

  useEffect(() => {
    if (pendingCareerId) {
      setSelectedId(pendingCareerId)
      clearPendingCareer()
      window.scrollTo({ top: 0 })
    }
  }, [pendingCareerId, clearPendingCareer])

  const filtered = useMemo(
    () =>
      careers.filter(
        (c) =>
          (!fSignal || c.signal === fSignal) &&
          (!fCategory || c.category === fCategory) &&
          (!fExposure || c.automationExposure === fExposure)
      ),
    [fSignal, fCategory, fExposure]
  )

  const selected = selectedId ? careerById(selectedId) : null

  const startAssessment = (c: Career) => {
    setRoleId(c.relatedRoleId ? LIB_PREFIX + c.relatedRoleId : CAREER_PREFIX + c.id)
    go('wizard')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* header */}
            <div className="mb-8 max-w-3xl">
              <p className="eyebrow">{t({ ar: 'مبني على WEF وILO وMcKinsey وOECD', en: 'Grounded in WEF, ILO, McKinsey & OECD' })}</p>
              <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">
                {t({ ar: 'كيف تتطور الأدوار والمهام؟', en: 'How do roles & tasks evolve?' })}
              </h1>
              <p className="mt-3 leading-relaxed text-dga-muted">
                {t({
                  ar: 'خمسون مهنة حكومية ومجاورة — من المعلوماتية الصحية إلى أمن التقنيات التشغيلية — بزاوية «أي مهامك ستتغير وأيها سيبقى بشريًا». الإشارات اتجاهية مبنية على أدلة، لا أحكام نهائية على مستقبل مهنة بعينها.',
                  en: 'Fifty government and adjacent careers — from health informatics to OT security — through the lens of “which of your tasks will change, and which stay human”. The signals are evidence-based directions, not final verdicts on any single career’s future.',
                })}
              </p>
            </div>

            {/* filters */}
            <div className="no-print mb-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'الإشارة:', en: 'Signal:' })}</span>
                <FilterChip active={fSignal === null} onClick={() => setFSignal(null)} label={t({ ar: 'الكل', en: 'All' })} />
                {(['GROWING', 'TRANSFORMING', 'DECLINING'] as Signal[]).map((s) => (
                  <FilterChip
                    key={s}
                    active={fSignal === s}
                    onClick={() => setFSignal(fSignal === s ? null : s)}
                    label={t(signalMeta[s].name)}
                    dot={signalMeta[s].color}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'الفئة:', en: 'Category:' })}</span>
                <FilterChip active={fCategory === null} onClick={() => setFCategory(null)} label={t({ ar: 'الكل', en: 'All' })} />
                {careerCategories.map((c) => (
                  <FilterChip key={c.id} active={fCategory === c.id} onClick={() => setFCategory(fCategory === c.id ? null : c.id)} label={t(c.name)} />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'التعرض للأتمتة:', en: 'Automation exposure:' })}</span>
                <FilterChip active={fExposure === null} onClick={() => setFExposure(null)} label={t({ ar: 'الكل', en: 'All' })} />
                {(['low', 'medium', 'high'] as Exposure[]).map((e) => (
                  <FilterChip
                    key={e}
                    active={fExposure === e}
                    onClick={() => setFExposure(fExposure === e ? null : e)}
                    label={t(exposureMeta[e].name)}
                    dot={exposureMeta[e].color}
                  />
                ))}
              </div>
              <p className="text-xs text-dga-muted">
                {t({ ar: `${filtered.length} من ${careers.length} مهنة`, en: `${filtered.length} of ${careers.length} careers` })}
              </p>
            </div>

            {/* cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c, i) => {
                const sig = signalMeta[c.signal]
                const exp = exposureMeta[c.automationExposure]
                return (
                  <motion.button
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id)
                      window.scrollTo({ top: 0 })
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                    className="glass group relative flex flex-col overflow-hidden p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:border-dga-green hover:shadow-card-lg"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="chip">{t(categoryById(c.category).name)}</span>
                      <span className="rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: sig.bg, color: sig.color }}>
                        {t(sig.name)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-dga-black group-hover:text-dga-green-dark">
                      {t(c.name)}
                    </h3>
                    <p className="mt-1 text-[11px] text-dga-muted" dir={lang === 'ar' ? 'ltr' : 'rtl'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      {lang === 'ar' ? c.name.en : c.name.ar}
                    </p>
                    {/* exposure meter */}
                    <div className="mt-4">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-dga-muted">
                        <span>{t({ ar: 'التعرض للأتمتة', en: 'Automation exposure' })}</span>
                        <span style={{ color: exp.color }}>{t(exp.name)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-pill bg-dga-line/60">
                        <div className="h-full rounded-pill transition-all" style={{ width: `${exp.pct}%`, background: exp.color }} />
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-2 flex-1 text-[13px] leading-relaxed text-dga-muted">{t(c.verdict)}</p>
                    <p className="mt-3 text-sm font-bold text-dga-green-dark">
                      {t({ ar: 'التفاصيل الكاملة', en: 'Full details' })} <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
                    </p>

                    {/* hover quick-view: key skills + route icons (v5) */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 border-t border-dga-line bg-white/95 p-4 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-dga-muted">
                        {t({ ar: 'نظرة سريعة — المهارات الخمس', en: 'Quick view — the five skills' })}
                      </p>
                      <div className="mt-2 space-y-1">
                        {c.keySkills.map((k) => (
                          <div key={k} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-dga-green" />
                            <span className="text-[11px] text-dga-ink">{t(skillVocab[k].name)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2 text-[10px] text-dga-muted">
                        <span className="chip">{t({ ar: c.pathways.degree.ar.startsWith('غير') || c.matching.licenseRequired ? 'جامعي إلزامي' : 'مسار جامعي', en: c.matching.licenseRequired ? 'Degree required' : 'Degree route' })}</span>
                        <span className="chip">{t({ ar: 'مسار مهاري', en: 'Skills-first route' })}</span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <CareerDetail key={selected.id} career={selected} lang={lang} t={t} onBack={() => setSelectedId(null)} onAssess={() => startAssessment(selected)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterChip({ active, onClick, label, dot }: { active: boolean; onClick: () => void; label: string; dot?: string }) {
  return (
    <button
      onClick={onClick}
      className={`chip transition-all duration-200 ${
        active ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green hover:text-dga-green-dark'
      }`}
    >
      {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
      {label}
    </button>
  )
}

function CareerDetail({
  career: c,
  lang,
  t,
  onBack,
  onAssess,
}: {
  career: Career
  lang: 'ar' | 'en'
  t: (l: { ar: string; en: string }) => string
  onBack: () => void
  onAssess: () => void
}) {
  const sig = signalMeta[c.signal]
  const exp = exposureMeta[c.automationExposure]
  const detail = careerExposureDetail[c.id] ?? { genai: c.automationExposure, robotic: c.automationExposure, horizon: 'medium' as const }
  const admission = careerAdmissionNotes[c.id]
  const isco = careerIsco[c.id]
  const womenNote = careerWomenNotes[c.id]
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <button onClick={onBack} className="no-print btn-ghost mb-6 px-4 py-2 text-sm">
        <span aria-hidden>{lang === 'ar' ? '→' : '←'}</span> {t({ ar: 'كل المهن', en: 'All careers' })}
      </button>

      {/* header */}
      <div className="glass-strong p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="chip">{t(categoryById(c.category).name)}</span>
          <span className="rounded-pill px-3 py-1 text-sm font-bold" style={{ background: sig.bg, color: sig.color }}>
            {t(sig.name)}
          </span>
          {c.matching.licenseRequired && (
            <span className="chip-info">{t({ ar: 'مهنة مرخّصة نظامًا', en: 'Licensed profession' })}</span>
          )}
          {isco && (
            <span className="chip" title={t({ ar: 'تصنيف ISCO-08 — تقريبي', en: 'ISCO-08 classification — approximate' })}>
              ISCO <span dir="ltr">{isco.code}</span> · {t(isco.label)}
              <span className="text-[9px] opacity-70">{t({ ar: '(تقريبي)', en: '(approx.)' })}</span>
            </span>
          )}
        </div>
        <h1 className="mt-4 text-h1 font-bold text-dga-green-deep">{t(c.name)}</h1>
        <p className="mt-1 text-sm text-dga-muted" dir={lang === 'ar' ? 'ltr' : 'rtl'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
          {lang === 'ar' ? c.name.en : c.name.ar}
        </p>

        {/* verdict — the honest answer, front and center */}
        <div className="mt-6 rounded-card border-s-4 border-dga-amber bg-dga-amber/5 p-5">
          <h2 className="text-sm font-bold text-dga-amber-tx">
            {t({ ar: 'هل أنصح ابني بهذا التخصص؟ الجواب الصريح', en: 'Should my child study this? The honest answer' })}
          </h2>
          <p className="mt-2.5 leading-loose text-dga-ink">{t(c.verdict)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* evidence + automation */}
        <div className="space-y-6">
          <section className="glass p-6">
            <h2 className="text-lg font-bold text-dga-green-dark">{t({ ar: 'ماذا تقول الأدلة؟', en: 'What does the evidence say?' })}</h2>
            <p className="mt-3 text-sm leading-loose text-dga-ink">{t(c.evidence)}</p>
            {careerProvenance[c.id] && (
              <div className="mt-4 space-y-2 border-t border-dga-line pt-3 text-[11.5px]">
                <p className="text-dga-muted">
                  <span className="font-semibold text-dga-ink">{t({ ar: 'المصدر: ', en: 'Source: ' })}</span>
                  {t(careerProvenance[c.id].source)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sourceBadges(t(careerProvenance[c.id].source)).map((b) => (
                    <span key={b.label.en} className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold ${b.cls}`}>
                      {t(b.label)}
                    </span>
                  ))}
                </div>
                <p className="leading-relaxed text-dga-ink">
                  <span className="font-semibold text-dga-green-dark">{t({ ar: 'سعوديًا: ', en: 'In Saudi Arabia: ' })}</span>
                  {t(careerProvenance[c.id].saudiNote)}
                </p>
                <p className="text-dga-muted">
                  {t({
                    ar: 'التوقعات استطلاعية الرقم وتحريرية الوسوم، أفقها 2030 — ليست ضمانًا ولا بديلًا عن شروط القبول والترخيص الرسمية.',
                    en: 'Figures are survey-based projections and labels are editorial, on a 2030 horizon — not guarantees, and no substitute for official admission and licensing requirements.',
                  })}
                </p>
                {womenNote && (
                  <p className="leading-relaxed text-dga-ink">
                    <span className="font-semibold text-dga-amber-tx">{t({ ar: 'للنساء: ', en: 'For women: ' })}</span>
                    {t(womenNote)}
                  </p>
                )}
                <p className="text-dga-muted">
                  {t({
                    ar: 'الأجور الاسترشادية وأعداد الشواغر السعودية لكل مهنة: قريبًا — نعمل على إتاحتها من مصادر رسمية (الإحصاء/التأمينات).',
                    en: 'Indicative Saudi wages and vacancy counts per career: coming soon — we are working to source them from official statistics (GASTAT/GOSI).',
                  })}
                </p>
              </div>
            )}
          </section>

          <section className="glass p-6">
            <h2 className="text-lg font-bold text-dga-green-dark">{t({ ar: 'كيف تتغير مهام هذا الدور؟', en: 'How do this role’s tasks change?' })}</h2>
            <div className="mt-4 space-y-3.5">
              {([
                { key: 'genai' as const, label: { ar: 'التعرض للذكاء الاصطناعي التوليدي (مهام نصية ومكتبية)', en: 'GenAI exposure (text & desk tasks)' } },
                { key: 'robotic' as const, label: { ar: 'التعرض للروبوتات والأتمتة المادية', en: 'Robotic / physical automation exposure' } },
              ]).map((row) => {
                const lvl = detail[row.key]
                const meta = exposureMeta[lvl]
                return (
                  <div key={row.key}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-dga-muted">{t(row.label)}</span>
                      <span className="font-semibold" style={{ color: meta.color }}>{t(meta.name)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-pill bg-dga-line/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${meta.pct}%` }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-pill"
                        style={{ background: meta.color }}
                      />
                    </div>
                  </div>
                )
              })}
              <p className="text-[10.5px] text-dga-muted">
                {t({ ar: 'مؤشر نوعي استرشادي (ثلاث درجات) — ليس قياسًا كميًا', en: 'A qualitative three-band guide — not a measured quantity' })}
              </p>
              <p className="chip-info w-fit">{t(horizonNoteMeta[detail.horizon])}</p>
            </div>
            <p className="mt-4 text-sm leading-loose text-dga-ink">{t(c.automationJustification)}</p>
            <div className="mt-4 rounded-btn bg-dga-bg p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dga-muted">
                {t({ ar: 'كيف يعززها الذكاء الاصطناعي؟', en: 'How does AI augment it?' })}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(c.aiAugmentation)}</p>
            </div>
          </section>

          {/* key skills */}
          <section className="glass p-6">
            <h2 className="text-lg font-bold text-dga-green-dark">{t({ ar: 'المهارات الخمس الأساسية', en: 'The five key skills' })}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.keySkills.map((k) => {
                const skill = skillVocab[k]
                const linkedDomain = skill.domainId ? domainById(skill.domainId) : null
                return (
                  <span key={k} className="chip-info !px-3 !py-1.5 text-[13px]">
                    {linkedDomain && <Icon name={linkedDomain.icon} className="h-3.5 w-3.5" />}
                    {t(skill.name)}
                    {linkedDomain && (
                      <span className="text-[10px] opacity-70">
                        {t({ ar: `· ${linkedDomain.shortName.ar}`, en: `· ${linkedDomain.shortName.en}` })}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          </section>
        </div>

        {/* pathways */}
        <div className="space-y-6">
          <section className="glass overflow-hidden">
            <div className="border-b border-dga-line bg-dga-green p-4">
              <h2 className="font-bold text-white">{t({ ar: 'المسار الجامعي', en: 'The degree route' })}</h2>
              <p className="text-xs text-white/80">
                {c.matching.licenseRequired
                  ? t({ ar: 'إلزامي لهذه المهنة', en: 'Mandatory for this profession' })
                  : t({ ar: 'المسار التقليدي المعتمد', en: 'The traditional accredited route' })}
              </p>
            </div>
            <p className="p-5 text-sm leading-loose text-dga-ink">{t(c.pathways.degree)}</p>
          </section>

          <section className="glass overflow-hidden">
            <div className="border-b border-dga-line bg-dga-amber p-4">
              <h2 className="font-bold text-dga-black">{t({ ar: 'المسار المهاري أولًا', en: 'The skills-first route' })}</h2>
              <p className="text-xs text-dga-black/70">
                {t({ ar: 'شهادات قصيرة + ملف أعمال + معسكرات سعودية', en: 'Short credentials + portfolio + Saudi bootcamps' })}
              </p>
            </div>
            <p className="p-5 text-sm leading-loose text-dga-ink">{t(c.pathways.skillsFirst)}</p>
          </section>

          {admission && (
            <section className="glass p-5">
              <h2 className="font-bold text-dga-green-dark">{t({ ar: 'واقع القبول والتكلفة', en: 'Admission & cost reality' })}</h2>
              <p className="mt-2 text-sm leading-loose text-dga-ink">{t(admission)}</p>
            </section>
          )}

          <section className="glass bg-dga-green-ink p-6 text-white">
            <h2 className="font-bold text-dga-amber">{t({ ar: 'جاهز للخطوة التالية؟', en: 'Ready for the next step?' })}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              {t({
                ar: 'قيّس مهاراتك الرقمية الحالية على رادار المهارات واحصل على خطة 90 يومًا تناسب هذا المسار.',
                en: 'Measure your current digital skills on the radar and get a 90-day plan fitted to this path.',
              })}
            </p>
            <button onClick={onAssess} className="mt-4 rounded-btn bg-dga-amber px-5 py-2.5 font-semibold text-dga-black transition-colors hover:bg-[#c89302]">
              {t({ ar: 'قيّس جاهزيتك لهذه المهنة', en: 'Measure your readiness for this career' })}
              <span aria-hidden> {lang === 'ar' ? '←' : '→'}</span>
            </button>
          </section>
        </div>
      </div>
    </motion.article>
  )
}
