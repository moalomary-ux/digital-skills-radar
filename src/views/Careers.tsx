import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import {
  careerById,
  careerCategories,
  careers,
  categoryById,
  exposureMeta,
  signalMeta,
  skillVocab,
} from '../data/careers'
import type { Career, Exposure, Signal } from '../data/careers'
import { domainById } from '../data/domains'
import { LIB_PREFIX } from '../data/roleLibrary'
import Icon from '../components/Icon'

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
    setRoleId(c.relatedRoleId ? LIB_PREFIX + c.relatedRoleId : 'specialist')
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
                {t({ ar: 'مستقبل التخصصات والمهن', en: 'The future of majors & careers' })}
              </h1>
              <p className="mt-3 leading-relaxed text-dga-muted">
                {t({
                  ar: 'ثلاثون مهنة يكثر السؤال عنها في البيوت السعودية — لكل منها إشارة مستقبلية صريحة، ومقياس تعرّض للأتمتة، ومساران للدخول (جامعي ومهاري)، وحكم صادق.',
                  en: 'Thirty careers Saudi families ask about most — each with a plain future signal, an automation-exposure meter, two entry routes (degree and skills-first), and an honest verdict.',
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
                {t({ ar: `${filtered.length} من 30 مهنة`, en: `${filtered.length} of 30 careers` })}
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
                    className="glass group flex flex-col p-5 text-start transition-all duration-300 hover:border-dga-green hover:shadow-card-lg"
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
        </div>
        <h1 className="mt-4 text-h1 font-bold text-dga-green-deep">{t(c.name)}</h1>
        <p className="mt-1 text-sm text-dga-muted" dir={lang === 'ar' ? 'ltr' : 'rtl'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
          {lang === 'ar' ? c.name.en : c.name.ar}
        </p>

        {/* verdict — the honest answer, front and center */}
        <div className="mt-6 rounded-card border-s-4 border-dga-amber bg-dga-amber/5 p-5">
          <h2 className="text-sm font-bold text-dga-amber">
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
          </section>

          <section className="glass p-6">
            <h2 className="text-lg font-bold text-dga-green-dark">{t({ ar: 'هل يستبدلها الروبوت؟', en: 'Will robots replace it?' })}</h2>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-semibold" style={{ color: exp.color }}>{t(exp.name)}</span>
                <span className="font-mono text-xs text-dga-muted" dir="ltr">{exp.pct}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-pill bg-dga-line/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${exp.pct}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-pill"
                  style={{ background: exp.color }}
                />
              </div>
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
