import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { domains, domainById } from '../data/domains'
import { horizonMeta, sectorById, techById, techClusterById, techClusters, techDomains, techSkills, technologies, trlZones } from '../data/technologies'
import type { Horizon, Technology } from '../data/technologies'
import { localizeTech } from '../data/techAr'
import { pathFor } from '../lib/routes'
import TechRadarChart from '../components/TechRadarChart'
import Claim, { ClaimText } from '../components/Claim'
import Icon from '../components/Icon'
import type { L, Lang } from '../data/types'

const horizons = Object.keys(horizonMeta) as Horizon[]

const ui = {
  eyebrow: { ar: 'تحوّل العمل الحكومي', en: 'How government work is changing' },
  title: { ar: 'تقنيات تغيّر العمل الحكومي', en: 'Technologies changing government work' },
  intro: {
    ar: 'تضم القائمة {{method-tech-count}} مع المهارات التي تتطلبها كل تقنية من موظفي الجهات، وأفق تبنيها المتوقع. ابدأ من المهارة التي تهمك أو من الأفق الزمني، ثم اختر تقنية لترى ما تطلبه منك.',
    en: 'The list holds {{method-tech-count}}, with the skills each one demands from government staff and its expected adoption horizon. Start from the skill you care about or from the time horizon, then pick a technology to see what it asks of you.',
  },
  notOfficial: {
    ar: 'تقديرات تحريرية مستقلة لأغراض التطوير، وليست رادار التقنيات الرسمي لأي جهة.',
    en: 'Independent editorial ratings for development purposes, not any organization’s official technology radar.',
  },
  mapping: { ar: 'ربط التقنيات بالمهارات', en: 'Technology-to-skill mapping' },
  horizon: { ar: 'الأفق:', en: 'Horizon:' },
  domain: { ar: 'المهارة المطلوبة من مجال:', en: 'Required skills from:' },
  cluster: { ar: 'المجموعة', en: 'Cluster' },
  all: { ar: 'الكل', en: 'All' },
  allClusters: { ar: 'كل المجموعات', en: 'All clusters' },
  shown: { ar: 'تقنية معروضة', en: 'technologies shown' },
  of: { ar: 'من', en: 'of' },
  reset: { ar: 'امسح عوامل التصفية', en: 'Clear filters' },
  view: { ar: 'طريقة العرض:', en: 'View:' },
  list: { ar: 'قائمة حسب الأفق', en: 'List by horizon' },
  chart: { ar: 'رسم النضج التحريري', en: 'Editorial maturity chart' },
  chartNote: {
    ar: 'الرسم يضع كل تقنية حسب تقدير تحريري لنضجها العالمي (TRL)، لا نضج تبنيها في المملكة. القائمة هي البديل النصي الكامل للرسم.',
    en: 'The chart places each technology by an editorial rating of its global maturity (TRL), not its adoption maturity in Saudi Arabia. The list is the full text alternative to the chart.',
  },
  none: { ar: 'لا تقنيات تطابق عوامل التصفية.', en: 'No technologies match the filters.' },
  requires: { ar: 'تتطلب:', en: 'Requires:' },
  pick: { ar: 'اختر تقنية', en: 'Pick a technology' },
  pickNote: {
    ar: 'ستظهر هنا المهارات التي تتطلبها، وما يتعلمه الجميع وما يتعلمه المختصون، ثم التقدير التحريري لنضجها.',
    en: 'Its required skills, what everyone learns and what specialists learn will appear here, followed by the editorial maturity rating.',
  },
  close: { ar: 'أغلق التفاصيل', en: 'Close details' },
  requiredSkills: { ar: 'المهارات التي تتطلبها من الرادار', en: 'Radar skills it requires' },
  openSkills: { ar: 'افتح سجل المهارات لهذا المجال', en: 'Open the skill registry for this domain' },
  employeeSkills: { ar: 'ما يحتاجه الموظف عمليًا', en: 'What staff need in practice' },
  focus: { ar: 'التركيز التعليمي', en: 'Learning focus' },
  everyone: { ar: 'للجميع: مستوى الوعي', en: 'For everyone: awareness level' },
  specialists: { ar: 'للمختصين: مستوى التطبيق والإتقان', en: 'For specialists: application and proficiency' },
  adoption: { ar: 'أفق التبني', en: 'Adoption horizon' },
  maturity: { ar: 'التقدير التحريري للنضج العالمي', en: 'Editorial rating of global maturity' },
  sectors: { ar: 'قطاعات ذات صلة', en: 'Related sectors' },
  essays: { ar: 'لماذا تهم كل مجموعة؟', en: 'Why each cluster matters' },
  essaysNote: { ar: 'قراءة مختصرة لكل مجموعة تقنية وسياقها في المملكة وأثرها على المهارات.', en: 'A short reading of each technology cluster, its Saudi context and its effect on skills.' },
  techCount: { ar: 'تقنيات', en: 'technologies' },
} satisfies Record<string, L>

const arrow = (lang: Lang) => (lang === 'ar' ? '←' : '→')

export default function TechRadar() {
  const { t, lang, pendingTechId } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterCluster, setFilterCluster] = useState<string | null>(null)
  const [filterHorizon, setFilterHorizon] = useState<Horizon | null>(null)
  const [filterDomain, setFilterDomain] = useState<string | null>(null)
  const [mode, setMode] = useState<'list' | 'chart'>('list')
  const [openEssay, setOpenEssay] = useState<string | null>(null)
  const detailHeading = useRef<HTMLHeadingElement>(null)
  const focusDetail = useRef(false)

  // open a technology deep-linked by URL (/tech-radar/:techId)
  useEffect(() => {
    if (pendingTechId && techById(pendingTechId)) setSelectedId(pendingTechId)
  }, [pendingTechId])

  useEffect(() => {
    if (selectedId && focusDetail.current) {
      focusDetail.current = false
      detailHeading.current?.focus()
    }
  }, [selectedId])

  const matches = (x: Technology) =>
    (!filterCluster || x.clusterId === filterCluster) &&
    (!filterHorizon || x.horizon === filterHorizon) &&
    (!filterDomain || techDomains(x).includes(filterDomain))

  const visible = useMemo(() => technologies.filter(matches), [filterCluster, filterHorizon, filterDomain]) // eslint-disable-line react-hooks/exhaustive-deps
  // the chart dims by `domainIds`; hand it the same domain semantics as the list
  const chartTechs = useMemo(() => technologies.map((x) => ({ ...x, domainIds: techDomains(x) })), [])

  const select = (id: string) => {
    focusDetail.current = true
    setSelectedId((p) => (p === id ? p : id))
  }
  const selected = selectedId ? techById(selectedId) ?? null : null
  const filtersOn = filterCluster || filterHorizon || filterDomain

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-6 max-w-3xl">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t(ui.title)}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          <ClaimText text={t(ui.intro)} />
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2 rounded-btn border-s-2 border-dga-amber bg-dga-amber/5 p-3 text-sm text-dga-ink">
          {t(ui.notOfficial)}
          <Claim id="tech-editorial-skill-map" variant="icon">
            <span className="sr-only">{t(ui.mapping)}</span>
          </Claim>
        </p>
      </div>

      {/* filters — every change updates the list immediately */}
      <div className="no-print mb-6 space-y-3">
        <ChipGroup
          label={t(ui.horizon)}
          value={filterHorizon}
          onChange={(v) => setFilterHorizon(v as Horizon | null)}
          options={horizons.map((h) => ({ value: h, label: `${t(horizonMeta[h].name)} · ${t(horizonMeta[h].years)}`, dot: horizonMeta[h].color }))}
          allLabel={t(ui.all)}
          lang={lang}
        />
        <ChipGroup
          label={t(ui.domain)}
          value={filterDomain}
          onChange={setFilterDomain}
          options={domains.map((d) => ({ value: d.id, label: t(d.shortName) }))}
          allLabel={t(ui.all)}
          lang={lang}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-dga-muted">
            {t(ui.cluster)}
            <select
              value={filterCluster ?? ''}
              onChange={(e) => setFilterCluster(e.target.value || null)}
              className="rounded-btn border border-dga-line bg-white px-2 py-1.5 text-sm font-normal text-dga-ink focus:border-dga-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green"
            >
              <option value="">{t(ui.allClusters)}</option>
              {techClusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c.name)}
                </option>
              ))}
            </select>
          </label>
          <span className="text-xs text-dga-muted" aria-live="polite">
            {`${visible.length} ${t(ui.of)} ${technologies.length} ${t(ui.shown)}`}
          </span>
          {filtersOn ? (
            <button
              type="button"
              onClick={() => {
                setFilterCluster(null)
                setFilterHorizon(null)
                setFilterDomain(null)
              }}
              className="text-xs font-semibold text-dga-green-dark underline underline-offset-2"
            >
              {t(ui.reset)}
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-dga-muted">{t(ui.view)}</span>
          {(['list', 'chart'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${mode === m ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green'}`}
            >
              {t(m === 'list' ? ui.list : ui.chart)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {mode === 'chart' ? (
            <div className="no-print glass-strong mb-6 overflow-x-auto p-3 sm:p-5">
              <div>
                <TechRadarChart
                  onClear={() => setSelectedId(null)}
                  technologies={chartTechs}
                  lang={lang}
                  selectedId={selectedId}
                  onSelect={(key) => {
                    if (key.startsWith('cluster:')) {
                      const cid = key.slice(8)
                      setFilterCluster((p) => (p === cid ? null : cid))
                      return
                    }
                    select(key)
                  }}
                  filterCluster={filterCluster}
                  filterHorizon={filterHorizon}
                  filterDomain={filterDomain}
                />
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-[11px] leading-relaxed text-dga-muted">
                {t(ui.chartNote)}
                <Claim id="method-tech-trl" variant="icon" />
              </p>
            </div>
          ) : null}

          {/* list grouped by horizon (also the text equivalent of the chart) */}
          {visible.length === 0 ? <div className="glass p-8 text-center text-dga-muted">{t(ui.none)}</div> : null}
          {horizons.map((h) => {
            const inH = technologies.filter((x) => x.horizon === h)
            const shown = inH.filter(matches)
            return (
              <section key={h} aria-labelledby={`tr-h-${h}`} className={`mb-7 ${shown.length === 0 ? 'hidden print:block' : ''}`}>
                <h2 id={`tr-h-${h}`} className="mb-3 flex flex-wrap items-center gap-2 text-lg font-bold text-dga-black">
                  <span className="h-3 w-3 rounded-full" style={{ background: horizonMeta[h].color }} aria-hidden />
                  {t(horizonMeta[h].name)}
                  <span className="text-sm font-normal text-dga-muted">{t(horizonMeta[h].years)}</span>
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {inH.map((x) => {
                    const on = selectedId === x.id
                    const hidden = !matches(x)
                    return (
                      <li key={x.id} className={hidden ? 'hidden print:block' : ''}>
                        <button
                          type="button"
                          onClick={() => select(x.id)}
                          aria-pressed={on}
                          aria-controls="tr-detail"
                          className={`glass flex h-full w-full flex-col items-start gap-2 p-4 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${
                            on ? 'border-dga-green bg-dga-green/5' : 'hover:border-dga-green'
                          }`}
                        >
                          <span className="block text-sm font-bold leading-snug text-dga-black">{t(x.name)}</span>
                          <span className="block text-[11px] text-dga-muted">{t(techClusterById(x.clusterId).name)}</span>
                          <span className="flex flex-wrap items-center gap-1">
                            <span className="text-[11px] font-semibold text-dga-muted">{t(ui.requires)}</span>
                            {techSkills(x).map((s) => (
                              <span key={s.id} className="chip-info text-[10.5px]">
                                {t(s.name)}
                              </span>
                            ))}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>

        {/* detail panel */}
        <div id="tr-detail" className="lg:sticky lg:top-24 lg:self-start">
          {selected ? (
            <TechDetail tech={selected} headingRef={detailHeading} onClose={() => setSelectedId(null)} />
          ) : (
            <div className="no-print glass grid min-h-[260px] place-items-center p-8 text-center">
              <div>
                <Icon name="radar" className="mx-auto h-10 w-10 text-dga-amber-tx" />
                <p className="mt-4 font-semibold text-dga-ink">{t(ui.pick)}</p>
                <p className="mt-2 text-sm text-dga-muted">{t(ui.pickNote)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* cluster essays */}
      <section aria-labelledby="tr-essays" className="mt-14">
        <h2 id="tr-essays" className="mb-2 text-2xl font-bold">
          {t(ui.essays)}
        </h2>
        <p className="mb-6 text-sm text-dga-muted">{t(ui.essaysNote)}</p>
        <div className="space-y-3">
          {techClusters.map((c, i) => {
            const open = openEssay === c.id
            const count = technologies.filter((x) => x.clusterId === c.id).length
            return (
              <div key={c.id} className="glass overflow-hidden">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`tr-essay-${c.id}`}
                    onClick={() => setOpenEssay(open ? null : c.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green"
                  >
                    <span className="flex items-center gap-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-btn bg-dga-green/10 font-mono text-sm font-bold text-dga-green" aria-hidden>
                        {i + 1}
                      </span>
                      <span>
                        <span className="block font-bold">{t(c.name)}</span>
                        <span className="block text-xs font-normal text-dga-muted">{`${count} ${t(ui.techCount)}`}</span>
                      </span>
                    </span>
                    <span className={`text-dga-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden>
                      ▾
                    </span>
                  </button>
                </h3>
                <div id={`tr-essay-${c.id}`} className={open ? 'block' : 'hidden print:block'}>
                  <p className="border-t border-dga-line p-6 pt-5 leading-loose text-dga-ink">
                    <ClaimText text={t(c.essay)} />
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/** Detail of one technology: required skills first, the editorial maturity rating last. */
function TechDetail({ tech, headingRef, onClose }: { tech: Technology; headingRef: RefObject<HTMLHeadingElement>; onClose: () => void }) {
  const { t, lang } = useApp()
  const loc = localizeTech(tech, lang)
  const zone = trlZones.find((z) => tech.trl >= z.from && tech.trl <= z.to)
  const skills = techSkills(tech)
  const skillDomains = [...new Set(skills.map((s) => s.domainId))]
  return (
    <article className="glass-strong p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="chip text-[11px] text-dga-ink">{t(techClusterById(tech.clusterId).name)}</span>
        <button type="button" onClick={onClose} className="no-print rounded-btn px-1.5 text-dga-muted hover:text-dga-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green" aria-label={t(ui.close)}>
          <span aria-hidden>✕</span>
        </button>
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold leading-snug focus:outline-none">
        {t(tech.name)}
      </h2>
      <p className="mt-1 text-xs text-dga-muted" lang={lang === 'ar' ? 'en' : 'ar'} dir={lang === 'ar' ? 'ltr' : 'rtl'}>
        {lang === 'ar' ? tech.name.en : tech.name.ar}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-dga-ink">{t(tech.description)}</p>

      <p className="mt-4 flex items-center gap-2 text-sm">
        <span className="font-semibold text-dga-muted">{t(ui.adoption)}:</span>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: horizonMeta[tech.horizon].color }} aria-hidden />
        <span className="font-bold text-dga-black">{t(horizonMeta[tech.horizon].name)}</span>
        <span className="text-dga-muted">({t(horizonMeta[tech.horizon].years)})</span>
      </p>

      <h3 className="mt-5 text-xs font-bold text-dga-muted">{t(ui.requiredSkills)}</h3>
      <ul className="mt-2 space-y-1.5">
        {skills.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-[13px] text-dga-ink">
            <Icon name={domainById(s.domainId).icon} className="h-4 w-4 shrink-0 text-dga-green" />
            <span className="font-semibold">{t(s.name)}</span>
            <span className="text-[11px] text-dga-muted">· {t(domainById(s.domainId).shortName)}</span>
          </li>
        ))}
      </ul>
      <div className="no-print mt-2 flex flex-wrap gap-2">
        {skillDomains.map((d) => (
          <Link key={d} to={`${pathFor('skills', lang)}#domain-${d}`} className="text-[12px] font-semibold text-dga-green-dark underline underline-offset-2">
            {`${t(ui.openSkills)}: ${t(domainById(d).shortName)}`} <span aria-hidden>{arrow(lang)}</span>
          </Link>
        ))}
      </div>

      <h3 className="mt-5 text-xs font-bold text-dga-muted">{t(ui.employeeSkills)}</h3>
      <ul className="mt-2 space-y-1.5">
        {loc.skills.map((s, i) => (
          <li key={i} className="flex gap-2 text-[12.5px] text-dga-ink">
            <span className="text-dga-green-dark" aria-hidden>
              ▸
            </span>
            {s}
          </li>
        ))}
      </ul>

      <h3 className="mt-5 text-xs font-bold text-dga-muted">{t(ui.focus)}</h3>
      <div className="mt-2 grid gap-2.5">
        <div className="rounded-btn border border-dga-green/30 bg-dga-green/5 p-3">
          <p className="text-[11px] font-bold text-dga-green-dark">{t(ui.everyone)}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-dga-ink">{loc.focus.awareness}</p>
        </div>
        <div className="rounded-btn border border-dga-amber/40 bg-dga-amber/5 p-3">
          <p className="text-[11px] font-bold text-dga-amber-tx">{t(ui.specialists)}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-dga-ink">{loc.focus.practitioner}</p>
        </div>
      </div>

      <h3 className="mt-5 text-xs font-bold text-dga-muted">{t(ui.sectors)}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tech.sectors.map((s) => (
          <span key={s} className="chip text-[11px] text-dga-ink">
            {t(sectorById(s).name)}
          </span>
        ))}
      </div>

      {/* editorial maturity — TRL appears only here, badged */}
      <section className="mt-5 rounded-btn border border-dga-line bg-dga-bg p-3.5">
        <h3 className="flex flex-wrap items-center gap-2 text-xs font-bold text-dga-muted">
          {t(ui.maturity)}
          <Claim id="method-tech-trl" variant="icon">
            <span className="chip border-dga-amber/50 bg-amber-50 text-[10.5px] text-dga-amber-tx">{t({ ar: 'تقدير تحريري', en: 'Editorial rating' })}</span>
          </Claim>
        </h3>
        <p className="mt-2 text-sm text-dga-ink">
          <span className="font-bold" dir="ltr">{`TRL ${tech.trl}/9`}</span>
          {zone ? <span className="text-dga-muted">{` · ${t(zone.name)}`}</span> : null}
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-dga-muted">{loc.rationale}</p>
      </section>
    </article>
  )
}

/** A single-select chip group with an "all" option; keyboard: Tab to the group, arrows to move. */
function ChipGroup({
  label,
  value,
  onChange,
  options,
  allLabel,
  lang,
}: {
  label: string
  value: string | null
  onChange: (v: string | null) => void
  options: { value: string; label: string; dot?: string }[]
  allLabel: string
  lang: Lang
}) {
  const all = [{ value: '', label: allLabel } as { value: string; label: string; dot?: string }, ...options]
  const current = value ?? ''
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight'
    const prev = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft'
    const i = all.findIndex((o) => o.value === current)
    let n = -1
    if (e.key === next || e.key === 'ArrowDown') n = (i + 1) % all.length
    if (e.key === prev || e.key === 'ArrowUp') n = (i - 1 + all.length) % all.length
    if (n < 0) return
    e.preventDefault()
    onChange(all[n].value || null)
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[n]?.focus()
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-dga-muted">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2" onKeyDown={onKey}>
        {all.map((o) => {
          const on = o.value === current
          return (
            <button
              key={o.value || 'all'}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.value || null)}
              className={`chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${on ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green'}`}
            >
              {o.dot ? <span className="h-2 w-2 rounded-full" style={{ background: o.dot }} aria-hidden /> : null}
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
