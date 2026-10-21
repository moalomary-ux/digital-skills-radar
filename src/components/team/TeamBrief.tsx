import { useApp } from '../../store'
import type { L } from '../../data/types'
import { domainById } from '../../data/domains'
import { levelForTarget, levels } from '../../data/levels'
import { PLAN_PHASES } from '../../data/pathways'
import { DATA_UPDATED_ON, formatDay, INDEPENDENCE, SITE_NAME } from '../shell/site'
import type { Basis, CohortTheme, ParsedTeamSet, SharedPriority, TeamComparison, TeamSummary } from '../../lib/team'
import { formatScore, formatShare, formatSigned } from '../../lib/team'
import { formatMonth, quote, staffingText, teamReason, tt } from './teamText'
import { Num } from './teamUi'

/**
 * «ملخص احتياج الفريق» — the printed A4 brief (≤ 2 pages). Hidden on screen (`hidden`) and
 * revealed by the page's print rules; static, no motion, tables only. Like the page, it shows
 * per-domain aggregates and never a row per code.
 */

interface Props {
  summary: TeamSummary
  counts: Pick<ParsedTeamSet, 'invalid' | 'duplicates' | 'stale' | 'excluded'>
  shared: SharedPriority[]
  cohort: CohortTheme[]
  comparison: TeamComparison | null
  categoryName: L
  basis: Basis
  /** which set the summary describes when two are loaded */
  setName: L | null
  demo: boolean
  /** ISO date the brief is prepared on */
  today: string
}

export default function TeamBrief({ summary, counts, shared, cohort, comparison, categoryName, basis, setName, demo, today }: Props) {
  const { t, lang } = useApp()
  const name = (id: string) => t(domainById(id).shortName)
  const spof = summary.domains.filter((d) => d.singlePoint)
  const infl = summary.domains.filter((d) => d.inflationRisk)
  const basisName = basis === 'self' ? tt.basisSelf : tt.basisCautious
  const period =
    summary.earliestMonth === summary.latestMonth
      ? formatMonth(summary.latestMonth, lang)
      : `${formatMonth(summary.earliestMonth, lang)} – ${formatMonth(summary.latestMonth, lang)}`

  return (
    <section hidden className="team-brief print-reveal" aria-labelledby="team-brief-title">
      <div className="flex items-end justify-between gap-4 border-b-2 border-dga-green pb-2">
        <div>
          <p className="text-xs font-semibold text-dga-green-dark">
            {t(SITE_NAME)} · {t(tt.title)}
          </p>
          <h2 id="team-brief-title" className="mt-1 font-bold text-dga-black">
            {t(tt.briefTitle)}
          </h2>
        </div>
        <p className="text-end text-xs text-dga-muted">
          {t(tt.briefDate)}: {formatDay(today, lang)}
        </p>
      </div>

      <p className="mt-2 border-s-4 border-dga-amber ps-2 font-semibold text-dga-black">
        {t(tt.banner)}. <span className="font-normal text-dga-ink">{t(tt.bannerNote)}</span>
      </p>
      {demo && <p className="mt-1 font-semibold text-dga-amber-tx">{t(tt.demoNote)}</p>}

      <h3 className="font-bold text-dga-green-ink">{t(tt.briefNumbers)}</h3>
      <dl className="mt-1 grid grid-cols-3 gap-x-4 gap-y-0.5">
        <div className="flex gap-1">
          <dt>{t(tt.overviewCodes)}:</dt>
          <dd className="font-semibold">
            <Num>{summary.n}</Num>
            {setName && <span className="font-normal"> ({t(setName)})</span>}
          </dd>
        </div>
        <div className="flex gap-1">
          <dt>{t(tt.overviewPeriod)}:</dt>
          <dd className="font-semibold">{period}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t(tt.overviewCategory)}:</dt>
          <dd className="font-semibold">{quote(t(categoryName), lang)}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t(tt.countInvalid)}:</dt>
          <dd>
            <Num>{counts.invalid}</Num>
          </dd>
        </div>
        <div className="flex gap-1">
          <dt>{t(tt.countDuplicate)}:</dt>
          <dd>
            <Num>{counts.duplicates}</Num>
          </dd>
        </div>
        <div className="flex gap-1">
          <dt>{t(tt.countStale)}:</dt>
          <dd>
            <Num>{counts.stale}</Num>
          </dd>
        </div>
        <div className="col-span-3 flex gap-1">
          <dt>{t(tt.basisUsed)}:</dt>
          <dd>{t(basisName)}</dd>
        </div>
      </dl>

      <h3 className="font-bold text-dga-green-ink">{t(tt.briefDomains)}</h3>
      <table className="print-avoid">
        <thead>
          <tr>
            <th scope="col">{t(tt.domain)}</th>
            <th scope="col">{t(tt.median)}</th>
            <th scope="col">{t(tt.briefIqr)}</th>
            <th scope="col">{t(tt.target)}</th>
            <th scope="col">{t(tt.coverage)}</th>
            <th scope="col">{t(tt.proficient)}</th>
            <th scope="col">{t(tt.colGap)}</th>
          </tr>
        </thead>
        <tbody>
          {summary.domains.map((d) => (
            <tr key={d.domainId}>
              <th scope="row" className="font-semibold">
                {name(d.domainId)}
              </th>
              <td>
                <Num>{formatScore(d.basis.median)}</Num>
              </td>
              <td>
                <Num>
                  {formatScore(d.basis.q1)} – {formatScore(d.basis.q3)}
                </Num>
              </td>
              <td>{t(levelForTarget(d.target).name)}</td>
              <td>
                <Num>{formatShare(d.coverage)}</Num>{' '}
                <span className="text-dga-muted">
                  (<Num>{d.atOrAboveTarget}</Num> {t(tt.of)} <Num>{d.n}</Num>)
                </span>
              </td>
              <td>
                <Num>{d.proficientOrAbove}</Num>
              </td>
              <td>{d.meanGap === null ? '—' : <Num>{formatSigned(d.meanGap)}</Num>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-bold text-dga-green-ink">{t(tt.briefRisks)}</h3>
      <div className="print-avoid grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">{t(tt.spofTitle)}</p>
          {spof.length === 0 ? (
            <p>{t(tt.none)}</p>
          ) : (
            <ul className="list-disc ps-4">
              {spof.map((d) => (
                <li key={d.domainId}>
                  {name(d.domainId)}: {t(d.proficientOrAbove === 0 ? tt.spofZero : tt.spofOne)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="font-semibold">{t(tt.inflTitle)}</p>
          {infl.length === 0 ? (
            <p>{t(tt.none)}</p>
          ) : (
            <ul className="list-disc ps-4">
              {infl.map((d) => (
                <li key={d.domainId}>
                  {name(d.domainId)}: <Num>{formatSigned(d.meanGap ?? 0)}</Num> — {t(tt.inflFlag)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h3 className="font-bold text-dga-green-ink">{t(tt.briefPriorities)}</h3>
      {shared.length === 0 ? (
        <p>{t(tt.prioNone)}</p>
      ) : (
        <>
          <ol className="list-decimal ps-4">
            {shared.map((p) => (
              <li key={p.domainId} className="print-avoid">
                <span className="font-semibold">{name(p.domainId)}</span> — {t(tt.prioCount)} <Num>{p.count}</Num> {t(tt.of)} <Num>{summary.n}</Num> ·{' '}
                {t(teamReason[p.mainReason])}. {t(staffingText[p.staffing])}
              </li>
            ))}
          </ol>
          <table className="print-avoid mt-1">
            <thead>
              <tr>
                <th scope="col">{t(tt.domain)}</th>
                {PLAN_PHASES.map(([a, b]) => (
                  <th key={a} scope="col">
                    {t(tt.weeks)}{' '}
                    <Num>
                      {a}–{b}
                    </Num>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohort.map((c) => (
                <tr key={c.domainId}>
                  <th scope="row">
                    {t(c.domainName)}
                    <span className="block font-normal text-dga-muted">
                      {t(tt.startFrom)}: {t(levels[c.startLevel - 1].name)}
                    </span>
                  </th>
                  {c.behaviours.map((b, i) => (
                    <td key={i}>{t(b)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {comparison && (
        <div className="print-avoid">
          <h3 className="font-bold text-dga-green-ink">{t(tt.cmpTitle)}</h3>
          <p>
            {t(tt.setBefore)}: <Num>{comparison.before.n}</Num> · {t(tt.setAfter)}: <Num>{comparison.after.n}</Num>
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">{t(tt.domain)}</th>
                <th scope="col">{t(tt.cmpMedianBefore)}</th>
                <th scope="col">{t(tt.cmpMedianAfter)}</th>
                <th scope="col">{t(tt.cmpChange)}</th>
                <th scope="col">{t(tt.cmpCovBefore)}</th>
                <th scope="col">{t(tt.cmpCovAfter)}</th>
                <th scope="col">{t(tt.cmpCovChange)}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.domains.map((d) => (
                <tr key={d.domainId}>
                  <th scope="row">{name(d.domainId)}</th>
                  <td>
                    <Num>{formatScore(d.beforeMedian)}</Num>
                  </td>
                  <td>
                    <Num>{formatScore(d.afterMedian)}</Num>
                  </td>
                  <td>
                    <Num>{formatSigned(d.deltaMedian)}</Num>
                  </td>
                  <td>
                    <Num>{formatShare(d.beforeCoverage)}</Num>
                  </td>
                  <td>
                    <Num>{formatShare(d.afterCoverage)}</Num>
                  </td>
                  <td>
                    <Num>{formatSigned(d.deltaCoverage)}</Num>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 border-t border-dga-line pt-1.5 text-dga-muted">
        <p className="font-semibold text-dga-black">{t(tt.banner)}</p>
        <p>
          {t(INDEPENDENCE)} · {t({ ar: 'آخر مراجعة للبيانات', en: 'Data last reviewed' })}: {formatDay(DATA_UPDATED_ON, lang)}
        </p>
      </div>
    </section>
  )
}
