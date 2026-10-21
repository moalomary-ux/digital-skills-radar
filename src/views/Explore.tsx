import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import { domains, domainById } from '../data/domains'
import { careers, careersForDomain, careerCategories, signalMeta } from '../data/careers'
import type { Signal } from '../data/careers'
import { domainTrajectories, trajectoryMeta } from '../data/futureSkills'
import NetworkMap from '../components/NetworkMap'
import type { Spotlight } from '../components/NetworkMap'
import Icon from '../components/Icon'

export default function Explore() {
  const { t, lang, go, openCareer, pendingDomainId, clearPendingDomain } = useApp()
  const [spotlight, setSpotlight] = useState<Spotlight>(null)
  const [query, setQuery] = useState('')
  const [panelDomain, setPanelDomain] = useState<string | null>(null)
  const [storyStep, setStoryStep] = useState<number | null>(null)

  // deep-link from Results / FutureSkills
  useEffect(() => {
    if (pendingDomainId) {
      setSpotlight({ kind: 'domain', id: pendingDomainId })
      setPanelDomain(pendingDomainId)
      clearPendingDomain()
    } else {
      setSpotlight(null)
      setPanelDomain(null)
    }
  }, [pendingDomainId, clearPendingDomain])

  // search spotlight
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      if (spotlight?.kind === 'query') setSpotlight(null)
      return
    }
    const ids = new Set(
      careers
        .filter((c) => c.name.ar.toLowerCase().includes(q) || c.name.en.toLowerCase().includes(q))
        .map((c) => c.id)
    )
    setSpotlight(ids.size > 0 ? { kind: 'query', ids } : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // story mode — all figures computed from live data
  const story = useMemo(() => {
    const total = careers.length
    const domCounts = domains
      .map((d) => ({ d, n: careersForDomain(d.id).length }))
      .sort((a, b) => b.n - a.n)
    const topDom = domCounts[0]
    const catCounts = careerCategories
      .map((c) => ({ c, n: careers.filter((x) => x.category === c.id).length }))
      .sort((a, b) => b.n - a.n)
    const topCat = catCounts[0]
    const growing = careers.filter((c) => c.signal === 'GROWING').length
    return [
      {
        caption: {
          ar: `مجال «${topDom.d.shortName.ar}» يلامس ${topDom.n} من أصل ${total} مهنة — أكثر المهارات تشابكًا مع سوق العمل.`,
          en: `The “${topDom.d.shortName.en}” domain touches ${topDom.n} of ${total} careers — the most interconnected skill in the labour market.`,
        },
        spot: { kind: 'domain', id: topDom.d.id } as Spotlight,
      },
      {
        caption: {
          ar: `أكبر القطاعات حجمًا على الخريطة: «${topCat.c.name.ar}» بـ ${topCat.n} مهنة.`,
          en: `The largest sector on the map: “${topCat.c.name.en}” with ${topCat.n} careers.`,
        },
        spot: { kind: 'sector', id: topCat.c.id } as Spotlight,
      },
      {
        caption: {
          ar: `${growing} من ${total} مهنة موسومة «يزدهر» — النمو في كل مكان لمن يقرأ الخريطة.`,
          en: `${growing} of ${total} careers are tagged “Growing” — growth is everywhere for those who read the map.`,
        },
        spot: { kind: 'signal', value: 'GROWING' } as Spotlight,
      },
    ]
  }, [lang])

  // story auto-advance
  useEffect(() => {
    if (storyStep === null) return
    setSpotlight(story[storyStep].spot)
    const timer = setTimeout(() => {
      setStoryStep((s) => (s === null ? null : s >= story.length - 1 ? null : s + 1))
    }, 5000)
    return () => clearTimeout(timer)
  }, [storyStep, story])

  useEffect(() => {
    if (storyStep === null) return
    setSpotlight(story[storyStep].spot)
  }, [storyStep]) // eslint-disable-line react-hooks/exhaustive-deps

  const stopStory = () => {
    setStoryStep(null)
    setSpotlight(null)
  }

  const panelTraj = panelDomain ? domainTrajectories.find((x) => x.domainId === panelDomain) : null
  const panelCount = panelDomain ? careersForDomain(panelDomain).length : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-6 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'خريطة حيّة — حرّك مؤشرك واستكشف', en: 'A living map — move your cursor and explore' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">
          {t({ ar: 'الاستكشاف ', en: 'Interactive ' })}
          <span className="gradient-text">{t({ ar: 'التفاعلي', en: 'Map' })}</span>
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'ثلاث حلقات: المهارات في القلب، والقطاعات في الوسط، والمهن في الخارج — والخطوط تروي التشابك. مرّر للإضاءة، وانقر للتعمق.',
            en: 'Three rings: skills at the core, sectors in the middle, careers outside — the lines tell the overlap. Hover to light up, click to go deeper.',
          })}
        </p>
      </div>

      {/* toolbar */}
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setStoryStep(null)
          }}
          placeholder={t({ ar: 'ابحث عن مهنة… (مثل: طيار، بيانات)', en: 'Search a career… (e.g., pilot, data)' })}
          className="w-56 rounded-btn border border-dga-line bg-white px-3 py-2 text-sm text-dga-ink outline-none focus:border-dga-green"
        />
        {(['GROWING', 'TRANSFORMING', 'DECLINING'] as Signal[]).map((sig) => (
          <button
            key={sig}
            onClick={() => {
              setStoryStep(null)
              setSpotlight(spotlight?.kind === 'signal' && spotlight.value === sig ? null : { kind: 'signal', value: sig })
            }}
            className={`chip transition-all ${
              spotlight?.kind === 'signal' && spotlight.value === sig ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: signalColorDot(sig) }} />
            {t(signalMeta[sig].name)}
          </button>
        ))}
        <button
          onClick={() => {
            setQuery('')
            setPanelDomain(null)
            setStoryStep(storyStep === null ? 0 : null)
            if (storyStep !== null) setSpotlight(null)
          }}
          className={`chip transition-all ${storyStep !== null ? 'border-dga-amber bg-dga-amber font-semibold !text-dga-black' : ''}`}
        >
          ▶ {t({ ar: 'وضع القصة', en: 'Story mode' })}
        </button>
        {(spotlight || panelDomain) && storyStep === null && (
          <button
            onClick={() => {
              setSpotlight(null)
              setPanelDomain(null)
              setQuery('')
            }}
            className="chip text-dga-muted"
          >
            ✕ {t({ ar: 'مسح', en: 'Clear' })}
          </button>
        )}
      </div>

      {/* story caption */}
      <AnimatePresence>
        {storyStep !== null && (
          <motion.div
            key={storyStep}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center justify-between gap-4 rounded-card border border-dga-amber/50 bg-dga-amber/5 p-4"
          >
            <p className="text-sm font-semibold text-dga-ink">
              <span className="me-2 font-mono text-dga-amber-tx" dir="ltr">{storyStep + 1}/3</span>
              {t(story[storyStep].caption)}
            </p>
            <button onClick={stopStory} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
              {t({ ar: 'إنهاء الجولة', en: 'End tour' })}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* map + side panel */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass-strong overflow-x-auto p-3 sm:p-5">
          <div className="min-w-[560px]">
            <NetworkMap
              lang={lang}
              spotlight={spotlight}
              onSpotlightChange={setSpotlight}
              onCareerClick={(id) => openCareer(id)}
              onDomainClick={(id) => setPanelDomain(id)}
              onSectorClick={(id) => {
                setStoryStep(null)
                setSpotlight(spotlight?.kind === 'sector' && spotlight.id === id ? null : { kind: 'sector', id })
              }}
            />
          </div>
          {/* legend */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-dga-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-dga-green" /> {t({ ar: 'مجال مهاري', en: 'Skill domain' })}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full border-2 border-dga-green bg-white" /> {t({ ar: 'قطاع', en: 'Sector' })}
            </span>
            {(['GROWING', 'TRANSFORMING', 'DECLINING'] as Signal[]).map((sig) => (
              <span key={sig} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: signalColorDot(sig) }} /> {t(signalMeta[sig].name)}
              </span>
            ))}
            <span className="text-dga-muted">{t({ ar: 'سماكة الخط = كثافة المهارة', en: 'Edge width = skill intensity' })}</span>
          </div>
          <p className="mt-2 text-center text-[10.5px] text-dga-muted">
            {t({
              ar: 'الروابط تعرض المهارات التخصصية — المهارات الإنسانية العرضية (تفكير تحليلي، مرونة…) مطلوبة في جميع المهن تقريبًا.',
              en: 'Edges show specialist skills — transversal human skills (analytical thinking, resilience…) are required in nearly every career.',
            })}
          </p>
        </div>

        {/* domain side panel */}
        <div className="min-h-[260px]">
          <AnimatePresence mode="wait">
            {panelDomain && panelTraj ? (
              <motion.div
                key={panelDomain}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-strong sticky top-24 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-btn bg-dga-green/10 text-dga-green">
                    <Icon name={domainById(panelDomain).icon} className="h-5 w-5" />
                  </span>
                  <button onClick={() => setPanelDomain(null)} className="text-dga-muted hover:text-dga-black" aria-label="close">✕</button>
                </div>
                <h2 className="mt-3 text-xl font-bold text-dga-black">{t(domainById(panelDomain).name)}</h2>
                <p className="mt-1">
                  <span className="rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: trajectoryMeta[panelTraj.rating].bg, color: trajectoryMeta[panelTraj.rating].color }}>
                    {t({ ar: 'الطلب 2026←2030: ', en: 'Demand 2026→2030: ' })}
                    {t(trajectoryMeta[panelTraj.rating].name)}
                  </span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-dga-ink">{t(panelTraj.rationale)}</p>
                <p className="mt-3 text-xs text-dga-muted">
                  {t({ ar: `مرتبط بـ ${panelCount} مهنة على الخريطة`, en: `Linked to ${panelCount} careers on the map` })}
                </p>
                <button onClick={() => go('wizard')} className="btn-primary mt-4 w-full">
                  {t({ ar: 'قيّس نفسك في هذا المجال', en: 'Measure yourself in this domain' })}
                </button>
                <button onClick={() => go('future-skills')} className="btn-ghost mt-2 w-full text-xs">
                  {t({ ar: 'مهارات المستقبل المرتبطة', en: 'Related future skills' })}
                </button>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass grid h-full min-h-[260px] place-items-center p-8 text-center">
                <div>
                  <Icon name="radar" className="mx-auto h-9 w-9 animate-pulseSoft text-dga-green" />
                  <p className="mt-3 text-sm font-semibold text-dga-black">{t({ ar: 'انقر مجالًا مهاريًا أخضر في القلب', en: 'Click a green skill domain at the core' })}</p>
                  <p className="mt-1.5 text-xs text-dga-muted">{t({ ar: 'أو مرّر فوق أي نقطة مهنة لقراءة سريعة — وانقرها لبطاقتها الكاملة.', en: 'Or hover any career dot for a quick read — click it for the full card.' })}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function signalColorDot(sig: Signal): string {
  return { GROWING: '#1B8354', TRANSFORMING: '#DBA102', DECLINING: '#B42318' }[sig]
}
