import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import { domains, domainById } from '../data/domains'
import {
  horizonMeta,
  sectorById,
  techById,
  techClusterById,
  techClusters,
  technologies,
  trlZones,
} from '../data/technologies'
import type { Horizon } from '../data/technologies'
import { localizeTech } from '../data/techAr'
import TechRadarChart from '../components/TechRadarChart'
import Icon from '../components/Icon'

export default function TechRadar() {
  const { t, lang, pendingTechId, clearPendingTech } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterCluster, setFilterCluster] = useState<string | null>(null)
  const [filterHorizon, setFilterHorizon] = useState<Horizon | null>(null)
  const [filterDomain, setFilterDomain] = useState<string | null>(null)
  const [openEssay, setOpenEssay] = useState<string | null>(null)
  // P1-13: below 640px the radar defaults to an accessible card list
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false
  )
  // 'auto' = chart on desktop, list on mobile; explicit choice overrides (v6 defect A7)
  const [mode, setMode] = useState<'auto' | 'chart' | 'list'>('auto')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const showChart = mode === 'chart' ? true : mode === 'list' ? false : !isMobile

  // open a technology deep-linked from another view
  useEffect(() => {
    if (pendingTechId) {
      setSelectedId(pendingTechId)
      const tech = techById(pendingTechId)
      if (tech) setOpenEssay(tech.clusterId)
      clearPendingTech()
    }
  }, [pendingTechId, clearPendingTech])

  const handleSelect = (key: string) => {
    if (key.startsWith('cluster:')) {
      const cid = key.slice(8)
      setFilterCluster((p) => (p === cid ? null : cid))
      setOpenEssay(cid)
      return
    }
    setSelectedId((p) => (p === key ? null : key))
  }

  const visibleCount = useMemo(
    () =>
      technologies.filter(
        (x) =>
          (!filterCluster || x.clusterId === filterCluster) &&
          (!filterHorizon || x.horizon === filterHorizon) &&
          (!filterDomain || x.domainIds.includes(filterDomain))
      ).length,
    [filterCluster, filterHorizon, filterDomain]
  )

  const selected = selectedId ? techById(selectedId) : null
  const loc = selected ? localizeTech(selected, lang) : null

  const zoneForTrl = (trl: number) => trlZones.find((z) => trl >= z.from && trl <= z.to)!

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-6 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'مستلهم من منهجية رادارات التقنيات الحكومية العالمية', en: 'Inspired by government tech-radar methodology' })}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          {t({ ar: 'رادار ', en: 'The ' })}
          <span className="gradient-text">{t({ ar: 'التقنيات الحكومية', en: 'Government Tech Radar' })}</span>
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: '48 تقنية في 6 مجموعات عبر مستويات النضج كافة — من البحث المبكر إلى التشغيل الفعلي — موزعة حسب مقياس نضج التقنية (TRL 1–9) وملوّنة حسب أفق التبني. ملاحظة منهجية: TRL هنا يقيس النضج العالمي للتقنية لا نضج تبنيها في السعودية، والناضج منها موسوم بنضجه لا بوصف «ناشئ». انقر أي نقطة لاستكشاف التقنية والمهارات التي تتطلبها.',
            en: "48 technologies in 6 clusters across all maturity levels — from early research to live operation — plotted by Technology Readiness Level (TRL 1–9) and colored by adoption horizon. Methodology note: TRL here measures the technology's global maturity, not its adoption maturity in Saudi Arabia, and mature technologies are tagged as such, never as “emerging”. Click any dot to explore the technology and the skills it demands.",
          })}
        </p>
      </div>

      {/* filters */}
      <div className="no-print mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'المجموعة:', en: 'Cluster:' })}</span>
          <FilterChip active={filterCluster === null} onClick={() => setFilterCluster(null)} label={t({ ar: 'الكل', en: 'All' })} />
          {techClusters.map((c) => (
            <FilterChip key={c.id} active={filterCluster === c.id} onClick={() => setFilterCluster(filterCluster === c.id ? null : c.id)} label={t(c.name)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'الأفق:', en: 'Horizon:' })}</span>
          <FilterChip active={filterHorizon === null} onClick={() => setFilterHorizon(null)} label={t({ ar: 'الكل', en: 'All' })} />
          {(Object.keys(horizonMeta) as Horizon[]).map((h) => (
            <FilterChip
              key={h}
              active={filterHorizon === h}
              onClick={() => setFilterHorizon(filterHorizon === h ? null : h)}
              label={`${t(horizonMeta[h].name)} (${t(horizonMeta[h].years)})`}
              dot={horizonMeta[h].color}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'مجال المهارة:', en: 'Skill domain:' })}</span>
          <FilterChip active={filterDomain === null} onClick={() => setFilterDomain(null)} label={t({ ar: 'الكل', en: 'All' })} />
          {domains.map((d) => (
            <FilterChip key={d.id} active={filterDomain === d.id} onClick={() => setFilterDomain(filterDomain === d.id ? null : d.id)} label={t(d.shortName)} />
          ))}
        </div>
        <p className="text-xs text-dga-muted">
          {t({ ar: `${visibleCount} من 48 تقنية ظاهرة`, en: `${visibleCount} of 48 technologies shown` })}
        </p>
      </div>

      {/* view toggle — chart vs accessible list */}
      <div className="no-print mb-4 flex items-center gap-2">
        <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'العرض:', en: 'View:' })}</span>
        <button
          onClick={() => setMode('chart')}
          className={`chip ${showChart ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`}
        >
          {t({ ar: 'الرادار', en: 'Radar' })}
        </button>
        <button
          onClick={() => setMode('list')}
          className={`chip ${!showChart ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`}
        >
          {t({ ar: 'قائمة البطاقات', en: 'Card list' })}
        </button>
        {isMobile && mode === 'auto' && (
          <span className="text-[11px] text-dga-muted">{t({ ar: 'الافتراضي على الجوال', en: 'Default on mobile' })}</span>
        )}
      </div>

      {/* chart + detail */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {showChart ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="glass-strong overflow-x-auto p-3 sm:p-5">
          <div className="min-w-[540px]">
            <TechRadarChart
              technologies={technologies}
              lang={lang}
              selectedId={selectedId}
              onSelect={handleSelect}
              filterCluster={filterCluster}
              filterHorizon={filterHorizon}
              filterDomain={filterDomain}
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-dga-muted">
            {(Object.keys(horizonMeta) as Horizon[]).map((h) => (
              <span key={h} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: horizonMeta[h].color }} />
                {t(horizonMeta[h].name)} · {t(horizonMeta[h].years)}
              </span>
            ))}
            <span className="text-dga-muted">{t({ ar: 'الحلقات = TRL 1–9', en: 'Rings = TRL 1–9' })}</span>
          </div>
        </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {technologies
              .filter(
                (x) =>
                  (!filterCluster || x.clusterId === filterCluster) &&
                  (!filterHorizon || x.horizon === filterHorizon) &&
                  (!filterDomain || x.domainIds.includes(filterDomain))
              )
              .sort((a, b) => b.trl - a.trl)
              .map((x) => (
                <button
                  key={x.id}
                  onClick={() => handleSelect(x.id)}
                  className={`glass flex w-full items-center gap-3 p-4 text-start transition-all hover:border-dga-green ${
                    selectedId === x.id ? 'border-dga-green bg-dga-green/5' : ''
                  }`}
                >
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: horizonMeta[x.horizon].color }} />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-dga-black">{t(x.name)}</span>
                    <span className="mt-0.5 block text-[11px] text-dga-muted">{t(techClusterById(x.clusterId).name)}</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-dga-green-dark" dir="ltr">TRL {x.trl}</span>
                </button>
              ))}
          </motion.div>
        )}

        {/* detail panel */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-strong sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-6"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="chip border-dga-line text-[11px] text-dga-ink">{t(techClusterById(selected.clusterId).name)}</span>
                  <button onClick={() => setSelectedId(null)} className="no-print text-dga-muted hover:text-dga-green-dark" aria-label="close">
                    ✕
                  </button>
                </div>
                <h2 className="text-xl font-bold leading-snug">{t(selected.name)}</h2>
                <p className="mt-1 text-xs text-dga-muted" dir={lang === 'ar' ? 'ltr' : 'rtl'}>
                  {lang === 'ar' ? selected.name.en : selected.name.ar}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-dga-ink">{t(selected.description)}</p>

                {/* TRL + horizon */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-dga-line bg-dga-bg p-3.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-dga-muted">TRL</p>
                    <p className="gradient-text text-3xl font-black">{selected.trl}<span className="text-base text-dga-muted">/9</span></p>
                    <p className="mt-1 text-[11px] text-dga-muted">{t(zoneForTrl(selected.trl).name)}</p>
                  </div>
                  <div className="rounded-xl border border-dga-line bg-dga-bg p-3.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-dga-muted">{t({ ar: 'أفق التبني', en: 'Adoption horizon' })}</p>
                    <p className="mt-1.5 text-xl font-bold" style={{ color: horizonMeta[selected.horizon].color }}>
                      {t(horizonMeta[selected.horizon].name)}
                    </p>
                    <p className="mt-1 text-[11px] text-dga-muted">{t(horizonMeta[selected.horizon].years)}</p>
                  </div>
                </div>
                <p className="mt-3 rounded-lg bg-dga-bg p-3 text-[11.5px] leading-relaxed text-dga-muted">
                  {loc!.rationale}
                </p>

                {/* sectors */}
                <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-dga-muted">{t({ ar: 'قطاعات الارتباط', en: 'Affinity sectors' })}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.sectors.map((s) => (
                    <span key={s} className="chip text-[11px] text-dga-ink">{t(sectorById(s).name)}</span>
                  ))}
                </div>

                {/* skill domains */}
                <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-dga-muted">{t({ ar: 'مجالات المهارات المرتبطة', en: 'Linked skill domains' })}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.domainIds.map((d) => (
                    <span key={d} className="chip border-dga-green/30 bg-dga-green/10 text-[11px] text-dga-green-dark">
                      <Icon name={domainById(d).icon} className="h-3.5 w-3.5" />
                      {t(domainById(d).name)}
                    </span>
                  ))}
                </div>

                {/* employee skills */}
                <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-dga-muted">{t({ ar: 'مهارات مطلوبة للموظفين', en: 'Skills employees need' })}</h3>
                <ul className="mt-2 space-y-1.5">
                  {loc!.skills.map((s, i) => (
                    <li key={i} className="flex gap-2 text-start text-[12.5px] text-dga-ink">
                      <span className="text-dga-green-dark">▸</span>
                      {s}
                    </li>
                  ))}
                </ul>

                {/* learning focus */}
                <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-dga-muted">{t({ ar: 'التركيز التعليمي', en: 'Learning focus' })}</h3>
                <div className="mt-2 grid gap-2.5">
                  <div className="rounded-xl border border-dga-green/30 bg-dga-green/5 p-3">
                    <p className="text-[11px] font-bold text-dga-green-dark">{t({ ar: 'للجميع — مستوى الوعي', en: 'For everyone — Awareness' })}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-dga-ink">{loc!.focus.awareness}</p>
                  </div>
                  <div className="rounded-xl border border-dga-amber/40 bg-dga-amber/5 p-3">
                    <p className="text-[11px] font-bold text-dga-amber-tx">{t({ ar: 'للمختصين — مستوى الممارس', en: 'For specialists — Practitioner' })}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-dga-ink">{loc!.focus.practitioner}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass grid h-full min-h-[300px] place-items-center p-8 text-center"
              >
                <div>
                  <Icon name="radar" className="mx-auto h-10 w-10 animate-pulseSoft text-dga-amber-tx" />
                  <p className="mt-4 font-semibold text-dga-ink">{t({ ar: 'انقر أي تقنية على الرادار', en: 'Click any technology on the radar' })}</p>
                  <p className="mt-2 text-sm text-dga-muted">
                    {t({ ar: 'ستظهر هنا التفاصيل الكاملة: النضج، القطاعات، والمهارات المطلوبة.', en: 'Full details will appear here: maturity, sectors, and required skills.' })}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* cluster essays */}
      <section className="mt-14">
        <h2 className="mb-2 text-2xl font-bold">{t({ ar: 'مقالات الأثر — لماذا تهم كل مجموعة؟', en: 'Impact essays — why each cluster matters' })}</h2>
        <p className="mb-6 text-sm text-dga-muted">
          {t({ ar: 'تحليل معمق لكل مجموعة تقنية وسياقها السعودي والمهاري.', en: 'A deep dive into each technology cluster and its Saudi and skills context.' })}
        </p>
        <div className="space-y-3">
          {techClusters.map((c, i) => {
            const open = openEssay === c.id
            const count = technologies.filter((x) => x.clusterId === c.id).length
            return (
              <div key={c.id} className="glass overflow-hidden">
                <button
                  onClick={() => setOpenEssay(open ? null : c.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-start"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-dga-green/20 to-dga-green-ink/20 font-mono text-sm font-bold text-dga-green">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold">{t(c.name)}</h3>
                      <p className="text-xs text-dga-muted">{t({ ar: `${count} تقنيات`, en: `${count} technologies` })}</p>
                    </div>
                  </div>
                  <span className={`text-dga-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="border-t border-dga-line p-6 pt-5 leading-loose text-dga-ink">{t(c.essay)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function FilterChip({ active, onClick, label, dot }: { active: boolean; onClick: () => void; label: string; dot?: string }) {
  return (
    <button
      onClick={onClick}
      className={`chip transition-all duration-200 ${
        active ? 'border-dga-green bg-dga-green/10 font-semibold text-dga-green' : 'text-dga-ink hover:border-dga-line hover:bg-dga-bg'
      }`}
    >
      {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
      {label}
    </button>
  )
}
