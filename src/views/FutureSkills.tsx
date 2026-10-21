import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { domainById } from '../data/domains'
import { decliningSkills, domainTrajectories, microSkills, trajectoryMeta } from '../data/futureSkills'
import type { DomainTrajectory, Trajectory } from '../data/futureSkills'
import { headlineStats } from '../data/guidance'
import { pathFor } from '../lib/routes'
import Claim, { ClaimText } from '../components/Claim'
import Icon from '../components/Icon'
import type { L, Lang } from '../data/types'

/** Filter groups follow the glossary: «ينمو / يتحوّل / يتراجع». */
type Group = 'all' | 'growing' | 'shifting' | 'declining'

const groupOf: Record<Trajectory, Exclude<Group, 'all'>> = {
  surging: 'growing',
  rising: 'growing',
  stable: 'shifting',
  declining: 'declining',
}

const groupLabel: Record<Group, L> = {
  all: { ar: 'الكل', en: 'All' },
  growing: { ar: 'ينمو', en: 'Growing' },
  shifting: { ar: 'يتحوّل', en: 'Shifting' },
  declining: { ar: 'يتراجع', en: 'Declining' },
}

/** Qualitative vertical position of each rating in the direction chart (no numeric scale). */
const levelY: Record<Trajectory, number> = { surging: 34, rising: 78, stable: 122, declining: 166 }
const ratingOrder: Trajectory[] = ['surging', 'rising', 'stable', 'declining']

const ui = {
  eyebrow: { ar: 'تحوّل العمل الحكومي — من 2026 إلى 2030', en: 'How government work is changing — 2026 to 2030' },
  title: { ar: 'مهارات 2030', en: 'Skills for 2030' },
  global: { ar: 'الصورة العالمية', en: 'The global picture' },
  globalNote: {
    ar: 'توقعات استطلاعية لأصحاب العمل حول العالم، وليست قياسًا للقطاع الحكومي في المملكة. اضغط شارة المصدر لترى النطاق والفترة.',
    en: 'Survey-based expectations of employers worldwide, not a measurement of the Saudi public sector. Press a source badge to see its scope and period.',
  },
  trajectories: { ar: 'اتجاه الطلب على المجالات حتى 2030', en: 'Where demand for each domain is heading to 2030' },
  trajectoriesNote: {
    ar: 'لكل مجال تصنيف تحريري يجمع إشارات مسماة المصدر. مرّر المؤشر على مجال أو انتقل إليه بلوحة المفاتيح لترى إشاراته ومصادرها.',
    en: 'Each domain carries an editorial rating that combines named-source signals. Hover over a domain or reach it with the keyboard to see its signals and sources.',
  },
  filter: { ar: 'اعرض المجالات التي:', en: 'Show domains that are:' },
  chartCaption: {
    ar: 'اتجاه نوعي تحريري بلا قيم رقمية؛ الخطوط تبيّن الاتجاه فقط، والقائمة المجاورة هي البديل النصي للرسم.',
    en: 'A qualitative editorial direction with no numeric values; the lines show direction only, and the list beside it is the text alternative to the chart.',
  },
  domains: { ar: 'المجالات', en: 'Domains' },
  signals: { ar: 'الإشارات ومصادرها', en: 'Signals and their sources' },
  rating: { ar: 'التصنيف', en: 'Rating' },
  assess: { ar: 'قِس نفسك في هذا المجال', en: 'Assess yourself in this domain' },
  skills: { ar: 'مهارات المجال في السجل', en: 'This domain’s skills in the registry' },
  noDeclining: {
    ar: 'لا يُصنَّف أي مجال كاملًا على أنه يتراجع؛ التراجع يصيب مهامًا بعينها داخل الوظائف.',
    en: 'No whole domain is rated as declining; decline hits specific tasks inside jobs.',
  },
  seeTasks: { ar: 'انظر المهام التي تتراجع', en: 'See the tasks that are declining' },
  micro: { ar: 'مهارات دقيقة ناشئة تبدأ بها هذا الشهر', en: 'Emerging micro-skills to start this month' },
  microNote: {
    ar: 'ليست تخصصات دراسية، بل مهارات محددة تنشأ الآن داخل الوظائف القائمة، لكل منها إشارة طلب بمصدرها وخطوة أولى عملية.',
    en: 'Not degree programmes: specific skills emerging inside existing jobs, each with a sourced demand signal and a practical first step.',
  },
  allDomains: { ar: 'كل المجالات', en: 'All domains' },
  signal: { ar: 'إشارة الطلب: ', en: 'Demand signal: ' },
  inGov: { ar: 'في العمل الحكومي: ', en: 'In government work: ' },
  firstStep: { ar: 'الخطوة الأولى: ', en: 'First step: ' },
  declining: { ar: 'مهام تتراجع حتى 2030', en: 'Tasks declining by 2030' },
  decliningNote: {
    ar: 'القاعدة التحريرية: التراجع يصيب المهام أكثر من الوظائف (منظمة العمل الدولية، 2025)؛ ولكل مهمة ما يبقى منها والتحوّل المقترح.',
    en: 'The editorial rule: decline hits tasks more than jobs (ILO, 2025); each task shows what remains of it and a suggested shift.',
  },
  task: { ar: 'المهمة', en: 'Task' },
  evidence: { ar: 'الإشارة', en: 'Signal' },
  nuance: { ar: 'ما يتراجع وما يبقى', en: 'What declines and what remains' },
  pivot: { ar: 'التحوّل المقترح', en: 'Suggested shift' },
  shown: { ar: 'معروض', en: 'shown' },
  of: { ar: 'من', en: 'of' },
} satisfies Record<string, L>

const arrow = (lang: Lang) => (lang === 'ar' ? '←' : '→')

export default function FutureSkills() {
  const { t, lang, go } = useApp()
  const [group, setGroup] = useState<Group>('all')
  const [activeId, setActiveId] = useState<string>(domainTrajectories[0].domainId)
  const [microDomain, setMicroDomain] = useState<string | null>(null)

  const visible = useMemo(
    () => domainTrajectories.filter((tr) => group === 'all' || groupOf[tr.rating] === group),
    [group]
  )
  const active = domainTrajectories.find((tr) => tr.domainId === activeId) ?? domainTrajectories[0]
  const activeVisible = visible.some((tr) => tr.domainId === active.domainId)
  const shownMicro = microSkills.filter((m) => !microDomain || m.parentDomain === microDomain)
  const microDomains = [...new Set(microSkills.map((m) => m.parentDomain))]

  const pickGroup = (g: Group) => {
    setGroup(g)
    const first = domainTrajectories.find((tr) => g === 'all' || groupOf[tr.rating] === g)
    if (first) setActiveId(first.domainId)
  }

  // radiogroup keyboard: arrows move and select
  const groups: Group[] = ['all', 'growing', 'shifting', 'declining']
  const onGroupKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = lang === 'ar' ? { next: 'ArrowLeft', prev: 'ArrowRight' } : { next: 'ArrowRight', prev: 'ArrowLeft' }
    const i = groups.indexOf(group)
    let n = -1
    if (e.key === keys.next || e.key === 'ArrowDown') n = (i + 1) % groups.length
    if (e.key === keys.prev || e.key === 'ArrowUp') n = (i - 1 + groups.length) % groups.length
    if (n >= 0) {
      e.preventDefault()
      pickGroup(groups[n])
      const el = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[n]
      el?.focus()
    }
  }

  const skillsHref = (domainId: string) => `${pathFor('skills', lang)}#domain-${domainId}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t(ui.title)}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: `اتجاه الطلب على مجالات الرادار (${domainTrajectories.length})، ومهارات دقيقة ناشئة (${microSkills.length})، ومهام تتراجع (${decliningSkills.length}). كل رقم في الصفحة مرتبط بمصدره، وكل تصنيف معلَن أنه تحريري.`,
            en: `Where demand for the radar’s domains is heading (${domainTrajectories.length}), emerging micro-skills (${microSkills.length}) and declining tasks (${decliningSkills.length}). Every figure on this page links to its source, and every rating is declared editorial.`,
          })}
        </p>
      </div>

      {/* global picture */}
      <section aria-labelledby="fs-global" className="glass mb-12 p-5 sm:p-6">
        <h2 id="fs-global" className="text-base font-bold text-dga-black">
          {t(ui.global)}
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {headlineStats.map((s) => (
            <li key={s.claimId} className="rounded-btn bg-dga-bg p-4">
              <p className="text-xl font-bold text-dga-green-deep">
                <Claim id={s.claimId} />
              </p>
              <p className="mt-1.5 text-sm leading-snug text-dga-muted">{t(s.label)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-dga-muted">{t(ui.globalNote)}</p>
      </section>

      {/* ── (a) domain trajectories: interactive direction chart + list + detail ── */}
      <section aria-labelledby="fs-traj">
        <h2 id="fs-traj" className="text-section font-bold text-dga-green">
          {t(ui.trajectories)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-dga-muted">{t(ui.trajectoriesNote)}</p>

        <div className="no-print mt-5 flex flex-wrap items-center gap-2">
          <span id="fs-filter" className="text-xs font-semibold text-dga-muted">
            {t(ui.filter)}
          </span>
          <div role="radiogroup" aria-labelledby="fs-filter" className="flex flex-wrap gap-2" onKeyDown={onGroupKey}>
            {groups.map((g) => {
              const on = group === g
              return (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => pickGroup(g)}
                  className={`chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${on ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green'}`}
                >
                  {t(groupLabel[g])}
                </button>
              )
            })}
          </div>
          <span className="text-xs text-dga-muted" aria-live="polite">
            {`${visible.length} ${t(ui.of)} ${domainTrajectories.length} ${t(ui.shown)}`}
          </span>
        </div>

        <div className="no-print mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass p-4 sm:p-5">
            <DirectionChart items={domainTrajectories} visibleIds={visible.map((v) => v.domainId)} activeId={activeVisible ? active.domainId : null} lang={lang} onPick={setActiveId} />
            <p className="mt-2 text-[11px] leading-relaxed text-dga-muted">{t(ui.chartCaption)}</p>

            <h3 className="sr-only">{t(ui.domains)}</h3>
            {visible.length === 0 ? (
              <div className="mt-4 rounded-btn bg-dga-bg p-4 text-sm text-dga-ink">
                <p>{t(ui.noDeclining)}</p>
                <a href="#fs-declining" className="mt-2 inline-flex font-semibold text-dga-green-dark underline underline-offset-2">
                  {t(ui.seeTasks)} <span aria-hidden>{arrow(lang)}</span>
                </a>
              </div>
            ) : (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {visible.map((tr) => {
                  const d = domainById(tr.domainId)
                  const meta = trajectoryMeta[tr.rating]
                  const on = tr.domainId === active.domainId
                  return (
                    <li key={tr.domainId}>
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-controls="fs-detail"
                        onClick={() => setActiveId(tr.domainId)}
                        onFocus={() => setActiveId(tr.domainId)}
                        onMouseEnter={() => setActiveId(tr.domainId)}
                        className={`flex w-full items-center justify-between gap-2 rounded-btn border px-3 py-2 text-start text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${
                          on ? 'border-dga-green bg-dga-green/5 font-semibold text-dga-black' : 'border-dga-line text-dga-ink hover:border-dga-green'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon name={d.icon} className="h-4 w-4 shrink-0 text-dga-green" />
                          {t(d.shortName)}
                        </span>
                        <span className="shrink-0 rounded-pill px-2 py-0.5 text-[11px] font-bold" style={{ background: meta.bg, color: meta.color }}>
                          {t(meta.name)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div id="fs-detail" aria-live="polite">
            {activeVisible ? <TrajectoryCard tr={active} onAssess={() => go('wizard')} skillsHref={skillsHref(active.domainId)} /> : null}
          </div>
        </div>

        {/* print: every domain in full */}
        <div className="hidden print:block">
          {domainTrajectories.map((tr) => (
            <div key={tr.domainId} className="mt-4 break-inside-avoid">
              <TrajectoryCard tr={tr} skillsHref={skillsHref(tr.domainId)} />
            </div>
          ))}
        </div>
      </section>

      {/* ── (b) emerging micro-skills ── */}
      <section aria-labelledby="fs-micro" className="mt-16">
        <h2 id="fs-micro" className="text-section font-bold text-dga-green">
          {t(ui.micro)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-dga-muted">{t(ui.microNote)}</p>
        <div className="no-print mt-4 flex flex-wrap gap-2" role="group" aria-label={t(ui.micro)}>
          <button
            type="button"
            aria-pressed={microDomain === null}
            onClick={() => setMicroDomain(null)}
            className={`chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${microDomain === null ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green'}`}
          >
            {t(ui.allDomains)}
          </button>
          {microDomains.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={microDomain === id}
              onClick={() => setMicroDomain(microDomain === id ? null : id)}
              className={`chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${microDomain === id ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green'}`}
            >
              {t(domainById(id).shortName)}
            </button>
          ))}
          <span className="self-center text-xs text-dga-muted" aria-live="polite">
            {`${shownMicro.length} ${t(ui.of)} ${microSkills.length} ${t(ui.shown)}`}
          </span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {microSkills.map((m) => {
            const parent = domainById(m.parentDomain)
            const hidden = microDomain !== null && m.parentDomain !== microDomain
            return (
              <article key={m.id} className={`glass flex-col p-5 ${hidden ? 'hidden print:flex' : 'flex'}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold leading-snug text-dga-black">{t(m.name)}</h3>
                  <span className="chip shrink-0 text-[10px]">
                    <Icon name={parent.icon} className="h-3 w-3 text-dga-green" />
                    {t(parent.shortName)}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-dga-muted">{t(m.description)}</p>
                <p className="mt-3 rounded-btn bg-dga-tag-info-bg p-2.5 text-[12px] leading-relaxed text-dga-tag-info-text">
                  <span className="font-bold">{t(ui.signal)}</span>
                  <ClaimText text={t(m.demandSignal)} />
                </p>
                <p className="mt-2 rounded-btn bg-dga-bg p-2.5 text-[12px] leading-relaxed text-dga-ink">
                  <span className="font-bold text-dga-green-dark">{t(ui.inGov)}</span>
                  {t(m.governmentRelevance)}
                </p>
                <p className="mt-2 border-s-2 border-dga-amber ps-2.5 text-[12px] leading-relaxed text-dga-ink">
                  <span className="font-bold text-dga-amber-tx">{t(ui.firstStep)}</span>
                  {t(m.firstStep)}
                </p>
                <Link
                  to={skillsHref(m.parentDomain)}
                  className="no-print mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-dga-green-dark underline underline-offset-2"
                >
                  {t(ui.skills)} <span aria-hidden>{arrow(lang)}</span>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── (c) declining tasks ── */}
      <section id="fs-declining" aria-labelledby="fs-declining-h" className="mt-16 scroll-mt-24">
        <h2 id="fs-declining-h" className="text-section font-bold text-dga-green">
          {t(ui.declining)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-dga-muted">{t(ui.decliningNote)}</p>
        <div className="glass mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-dga-line bg-dga-bg text-xs text-dga-muted">
                <th scope="col" className="p-4 text-start font-semibold">{t(ui.task)}</th>
                <th scope="col" className="p-4 text-start font-semibold">{t(ui.evidence)}</th>
                <th scope="col" className="p-4 text-start font-semibold">{t(ui.nuance)}</th>
                <th scope="col" className="p-4 text-start font-semibold">{t(ui.pivot)}</th>
              </tr>
            </thead>
            <tbody>
              {decliningSkills.map((d) => (
                <tr key={d.id} className="border-b border-dga-line/70 align-top last:border-0">
                  <th scope="row" className="p-4 text-start font-semibold text-dga-black">{t(d.name)}</th>
                  <td className="p-4 text-xs leading-relaxed text-dga-muted">
                    <ClaimText text={t(d.evidence)} />
                  </td>
                  <td className="p-4 text-xs leading-relaxed text-dga-ink">{t(d.nuance)}</td>
                  <td className="p-4 text-xs leading-relaxed text-dga-green-dark">{t(d.pivot)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

/** One domain's rating, rationale and sourced signals. */
function TrajectoryCard({ tr, onAssess, skillsHref }: { tr: DomainTrajectory; onAssess?: () => void; skillsHref: string }) {
  const { t, lang } = useApp()
  const d = domainById(tr.domainId)
  const meta = trajectoryMeta[tr.rating]
  return (
    <article className="glass-strong p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-dga-black">
          <span className="grid h-9 w-9 place-items-center rounded-btn bg-dga-green/10 text-dga-green">
            <Icon name={d.icon} className="h-5 w-5" />
          </span>
          {t(d.name)}
        </h3>
        <span className="flex items-center gap-2">
          <span className="rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: meta.bg, color: meta.color }}>
            <span className="sr-only">{`${t(ui.rating)}: `}</span>
            {t(meta.name)}
          </span>
          <Claim id="future-editorial-trajectory" variant="icon">
            <span className="sr-only">{t({ ar: 'تقدير تحريري', en: 'Editorial rating' })}</span>
          </Claim>
        </span>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-dga-ink">{t(tr.rationale)}</p>
      <h4 className="mt-4 text-xs font-bold text-dga-muted">{t(ui.signals)}</h4>
      <ul className="mt-2 space-y-2">
        {tr.evidence.map((ev, i) => (
          <li key={i} className="flex gap-1.5 text-[12.5px] leading-relaxed text-dga-ink">
            <span className="text-dga-green" aria-hidden>
              ▸
            </span>
            <span>
              <ClaimText text={t(ev)} />
            </span>
          </li>
        ))}
      </ul>
      <div className="no-print mt-4 flex flex-wrap gap-2">
        {onAssess ? (
          <button type="button" onClick={onAssess} className="btn-ghost px-4 py-2 text-xs">
            {t(ui.assess)} <span aria-hidden>{arrow(lang)}</span>
          </button>
        ) : null}
        <Link to={skillsHref} className="btn-ghost px-4 py-2 text-xs">
          {t(ui.skills)} <span aria-hidden>{arrow(lang)}</span>
        </Link>
      </div>
    </article>
  )
}

/**
 * Qualitative direction chart: every domain starts at the same point in 2026 and ends at its
 * rating band in 2030. No numeric axis; decorative for assistive tech (the list is the text
 * equivalent). Hovering a line previews it; the list buttons are the keyboard path.
 */
function DirectionChart({
  items,
  visibleIds,
  activeId,
  lang,
  onPick,
}: {
  items: DomainTrajectory[]
  visibleIds: string[]
  activeId: string | null
  lang: Lang
  onPick: (id: string) => void
}) {
  const W = 560
  const H = 200
  const x0 = 105
  const x1 = 400
  const fx = (x: number) => (lang === 'ar' ? W - x : x)
  const startY = levelY.stable
  // spread end labels within a band so they do not overlap
  const byRating = new Map<Trajectory, DomainTrajectory[]>()
  for (const it of items) byRating.set(it.rating, [...(byRating.get(it.rating) ?? []), it])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} aria-hidden focusable="false">
      {ratingOrder.map((r) => (
        <g key={r}>
          <line x1={fx(x0)} x2={fx(x1)} y1={levelY[r]} y2={levelY[r]} stroke="#E5E7EB" strokeDasharray="3 4" />
          <text x={fx(x0 - 8)} y={levelY[r] + 4} fontSize="11" fill={trajectoryMeta[r].color} textAnchor="end" fontWeight={600}>
            {lang === 'ar' ? trajectoryMeta[r].name.ar : trajectoryMeta[r].name.en}
          </text>
        </g>
      ))}
      <text x={fx(x0)} y={H - 6} fontSize="11" fill="#6C737F" textAnchor="middle">
        2026
      </text>
      <text x={fx(x1)} y={H - 6} fontSize="11" fill="#6C737F" textAnchor="middle">
        2030
      </text>
      {items.map((it) => {
        const peers = byRating.get(it.rating) ?? [it]
        const k = peers.indexOf(it)
        const endY = levelY[it.rating] + (k - (peers.length - 1) / 2) * 13
        const visible = visibleIds.includes(it.domainId)
        const on = activeId === it.domainId
        const color = trajectoryMeta[it.rating].color
        const name = lang === 'ar' ? domainById(it.domainId).shortName.ar : domainById(it.domainId).shortName.en
        return (
          <g
            key={it.domainId}
            onMouseEnter={() => visible && onPick(it.domainId)}
            onClick={() => visible && onPick(it.domainId)}
            style={{ cursor: visible ? 'pointer' : 'default', opacity: !visible ? 0.12 : activeId && !on ? 0.35 : 1, transition: 'opacity 150ms' }}
          >
            <path d={`M ${fx(x0)} ${startY} C ${fx(x0 + 140)} ${startY}, ${fx(x1 - 140)} ${endY}, ${fx(x1)} ${endY}`} fill="none" stroke={color} strokeWidth={on ? 3.5 : 2} />
            <circle cx={fx(x1)} cy={endY} r={on ? 5 : 3.5} fill={color} />
            <text x={fx(x1 + 9)} y={endY + 4} fontSize="11" fill={on ? '#111927' : '#4D5761'} fontWeight={on ? 700 : 500} textAnchor="start">
              {name}
            </text>
          </g>
        )
      })}
      <circle cx={fx(x0)} cy={startY} r={4} fill="#4D5761" />
    </svg>
  )
}
