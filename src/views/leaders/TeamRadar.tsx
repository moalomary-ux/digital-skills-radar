import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { domainById, domains } from '../../data/domains'
import { tracks } from '../../data/tracks'
import type { TrackId } from '../../data/tracks'
import { levelForTarget, levels } from '../../data/levels'
import { PLAN_PHASES } from '../../data/pathways'
import type { L, Lang } from '../../data/types'
import { pathFor } from '../../lib/routes'
import { formatCode } from '../../lib/resultCode'
import {
  TEAM_K,
  codesFromFile,
  cohortPlan,
  compareTeams,
  demoCodes,
  formatScore,
  formatShare,
  formatSigned,
  majorityCategory,
  parseTeamInput,
  sharedCodes,
  sharedPriorities,
  summarizeTeam,
  teamGate,
} from '../../lib/team'
import type { Basis, FiveNum, Layer, ParsedTeamSet } from '../../lib/team'
import Claim from '../../components/Claim'
import DomainDotStrip from '../../components/team/DomainDotStrip'
import type { StripRow } from '../../components/team/DomainDotStrip'
import CoverageBars from '../../components/team/CoverageBars'
import GapBars from '../../components/team/GapBars'
import TeamCompareRadar from '../../components/team/TeamCompareRadar'
import TeamBrief from '../../components/team/TeamBrief'
import { formatMonth, quote, spofAdvice, staffingText, teamReason, tt } from '../../components/team/teamText'
import { Num } from '../../components/team/teamUi'

/**
 * «رادار الفريق» — /:lang/leaders/team (DECISION §3; review C1).
 * Codes are parsed and aggregated in the browser only (src/lib/team.ts); the pasted text is kept
 * in sessionStorage for this tab and nowhere else. Nothing renders below TEAM_K valid, distinct
 * codes, and no element shows a row or a value set per code.
 */

const SS_A = 'dsr-team-a'
const SS_B = 'dsr-team-b'
const MAX_FILE_BYTES = 2_000_000

/** Print rules live with the page: A4, the brief only, no site chrome, no motion. */
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 10mm 11mm 11mm; }
  header, footer, nav, .no-print { display: none !important; }
  html, body { background: #fff !important; }
  .team-root { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  .team-root.has-brief .team-screen { display: none !important; }
  .team-brief[hidden] { display: block !important; }
  .team-brief { font-size: 8.3pt; line-height: 1.36; color: #161616; }
  .team-brief h2 { font-size: 15pt; line-height: 1.2; }
  .team-brief h3 { font-size: 10pt; margin-top: 3.2mm; margin-bottom: 1mm; break-after: avoid; page-break-after: avoid; }
  .team-brief table { width: 100%; border-collapse: collapse; }
  .team-brief th, .team-brief td { padding: 0.7mm 1.2mm; border-bottom: 0.4pt solid #D2D6DB; text-align: start; vertical-align: top; font-weight: inherit; }
  .team-brief thead th { font-weight: 700; color: #074D31; border-bottom: 0.8pt solid #1B8354; }
  .team-brief tbody th { font-weight: 600; }
  .team-brief .print-avoid { break-inside: avoid; page-break-inside: avoid; }
  .team-brief * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`

function readSession(key: string): string {
  try {
    return window.sessionStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

function writeSession(key: string, value: string) {
  try {
    if (value) window.sessionStorage.setItem(key, value)
    else window.sessionStorage.removeItem(key)
  } catch {
    /* storage unavailable: the codes stay in memory only */
  }
}

function readText(file: File): Promise<string> {
  if (typeof file.text === 'function') return file.text()
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result ?? ''))
    r.onerror = () => reject(r.error)
    r.readAsText(file)
  })
}

type FileNote = { kind: 'added'; n: number } | { kind: 'none' } | { kind: 'error' } | null

/* ---------------------------------------------------------------- pieces */

function Segmented<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string
  legend: string
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-dga-black">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="inline-flex items-center gap-1 rounded-pill border border-dga-line bg-white px-3 py-1.5 text-sm text-dga-ink transition-colors hover:border-dga-green peer-checked:border-dga-green peer-checked:bg-dga-green peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-dga-green peer-focus-visible:ring-offset-2">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Counters({ parsed }: { parsed: ParsedTeamSet }) {
  const { t } = useApp()
  const items: { label: L; value: number; warn: boolean }[] = [
    { label: tt.countValid, value: parsed.valid, warn: false },
    { label: tt.countInvalid, value: parsed.invalid, warn: parsed.invalid > 0 },
    { label: tt.countDuplicate, value: parsed.duplicates, warn: parsed.duplicates > 0 },
    { label: tt.countStale, value: parsed.stale, warn: parsed.stale > 0 },
  ]
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
      {items.map((it) => (
        <div key={it.label.en} className={`rounded-btn border px-3 py-2 ${it.warn ? 'border-dga-amber/60 bg-dga-amber/5' : 'border-dga-line bg-white'}`}>
          <dt className="text-xs text-dga-muted">{t(it.label)}</dt>
          <dd className={`text-xl font-bold ${it.warn ? 'text-dga-amber-tx' : 'text-dga-black'}`}>
            <Num>{it.value}</Num>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function CodeSet({ id, title, value, onChange, parsed }: { id: string; title: string; value: string; onChange: (next: string | ((prev: string) => string)) => void; parsed: ParsedTeamSet }) {
  const { t } = useApp()
  const [note, setNote] = useState<FileNote>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return
    const found: string[] = []
    let failed = false
    for (const f of Array.from(files)) {
      if (f.size > MAX_FILE_BYTES) {
        failed = true
        continue
      }
      try {
        found.push(...codesFromFile(f.name, await readText(f)).codes)
      } catch {
        failed = true
      }
    }
    if (found.length) {
      onChange((prev) => `${prev.trim() ? `${prev.replace(/\s+$/, '')}\n` : ''}${found.map((c) => (c.length === 20 ? formatCode(c) : c)).join('\n')}`)
      setNote({ kind: 'added', n: found.length })
    } else setNote(failed ? { kind: 'error' } : { kind: 'none' })
    if (fileRef.current) fileRef.current.value = ''
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    void addFiles(e.dataTransfer?.files ?? null)
  }

  return (
    <div
      className={`glass p-5 transition-colors ${dragging ? 'border-dga-green bg-dga-green/5' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <label htmlFor={`${id}-input`} className="text-lg font-bold text-dga-black">
        {title}
      </label>
      <p id={`${id}-help`} className="mt-1 text-sm text-dga-muted">
        {t(tt.inputHelp)}
      </p>
      <textarea
        id={`${id}-input`}
        aria-describedby={`${id}-help`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        dir="ltr"
        spellCheck={false}
        autoComplete="off"
        className="mt-3 w-full rounded-btn border border-dga-line bg-white px-3 py-2 font-mono text-sm leading-relaxed text-dga-black focus:border-dga-green"
        placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="btn-ghost cursor-pointer px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-dga-green">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.csv,.json,text/plain,text/csv,application/json"
            multiple
            className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) => void addFiles(e.target.files)}
          />
          {t(tt.fileButton)}
        </label>
        <span className="text-xs text-dga-muted">{t(tt.dropHint)}</span>
        {value && (
          <button
            type="button"
            className="ms-auto text-sm font-semibold text-dga-green-dark underline-offset-4 hover:underline"
            onClick={() => {
              onChange('')
              setNote(null)
            }}
          >
            {t(tt.clear)}
          </button>
        )}
      </div>
      <p className="mt-2 min-h-[1.25rem] text-sm text-dga-ink" role="status">
        {note?.kind === 'added' && (
          <>
            {t(tt.fileAdded)} <Num>{note.n}</Num>
          </>
        )}
        {note?.kind === 'none' && t(tt.fileNone)}
        {note?.kind === 'error' && t(tt.fileError)}
      </p>
      <Counters parsed={parsed} />
    </div>
  )
}

/** The k-anonymity message, in both languages (current language first). */
function GateMessage({ have, compact = false }: { have: number; compact?: boolean }) {
  const { lang } = useApp()
  const needed = TEAM_K - have
  const line = (l: Lang) =>
    l === 'ar' ? (
      <p key="ar" lang="ar" dir="rtl" className={l === lang ? 'font-semibold text-dga-black' : 'mt-1 text-sm text-dga-muted'}>
        {tt.gateLead.ar} <Num>{TEAM_K}</Num>. {tt.gateHave.ar}: <Num>{have}</Num>، {tt.gateNeed.ar}: <Num>{needed}</Num>.
      </p>
    ) : (
      <p key="en" lang="en" dir="ltr" className={l === lang ? 'font-semibold text-dga-black' : 'mt-1 text-sm text-dga-muted'}>
        {tt.gateLead.en} {TEAM_K}. {tt.gateHave.en} {have}; {tt.gateNeed.en}: {needed}.
      </p>
    )
  const order: Lang[] = lang === 'ar' ? ['ar', 'en'] : ['en', 'ar']
  return (
    <div role="status" data-testid="team-gate" className={`rounded-card border border-dga-amber/50 bg-dga-amber/5 ${compact ? 'p-4' : 'p-6'}`}>
      {order.map(line)}
      {!compact && <p className="mt-3 text-sm text-dga-ink">{lang === 'ar' ? tt.gateWhy.ar : tt.gateWhy.en}</p>}
    </div>
  )
}

function Equivalent({ children }: { children: ReactNode }) {
  const { t } = useApp()
  return (
    <details className="mt-4 rounded-btn border border-dga-line bg-white px-4 py-2">
      <summary className="cursor-pointer text-sm font-semibold text-dga-green-dark">{t(tt.tableToggle)}</summary>
      <div className="mt-2 overflow-x-auto">{children}</div>
    </details>
  )
}

const thCls = 'border-b border-dga-line px-2 py-1.5 text-start text-xs font-semibold text-dga-muted'
const tdCls = 'border-b border-dga-line/60 px-2 py-1.5 text-sm'

function Section({ id, title, help, children }: { id: string; title: string; help?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`} className="mt-12">
      <h2 id={`${id}-title`} className="text-2xl font-bold text-dga-black">
        {title}
      </h2>
      {help && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dga-muted">{help}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ page */

export default function TeamRadar() {
  const { t, lang, dir } = useApp()
  const rtl = dir === 'rtl'
  const now = useMemo(() => new Date(), [])
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const [textA, setTextA] = useState(() => readSession(SS_A))
  const [textB, setTextB] = useState(() => readSession(SS_B))
  const [showB, setShowB] = useState(() => readSession(SS_B) !== '')
  const [excludeStale, setExcludeStale] = useState(false)
  const [chosenCategory, setChosenCategory] = useState<TrackId | null>(null)
  const [basis, setBasis] = useState<Basis>('self')
  const [layer, setLayer] = useState<Layer>('self')
  const [active, setActive] = useState<string>(domains[0].id)
  const [viewSet, setViewSet] = useState<'a' | 'b'>('a')

  useEffect(() => writeSession(SS_A, textA), [textA])
  useEffect(() => writeSession(SS_B, showB ? textB : ''), [textB, showB])

  const demoA = useMemo(() => demoCodes(12, { now, seed: 7 }).map(formatCode).join('\n'), [now])
  const demoB = useMemo(() => demoCodes(12, { now, seed: 11, lift: 0.6 }).map(formatCode).join('\n'), [now])
  const isDemo = textA === demoA || (showB && textB === demoB)

  const parsedA = useMemo(() => parseTeamInput(textA, { now, excludeStale }), [textA, now, excludeStale])
  const parsedB = useMemo(() => (showB ? parseTeamInput(textB, { now, excludeStale }) : null), [showB, textB, now, excludeStale])
  const gateA = teamGate(parsedA.entries.length)
  const gateB = parsedB ? teamGate(parsedB.entries.length) : null
  const bothOpen = gateA.open && !!gateB?.open
  const focus = bothOpen && viewSet === 'b' && parsedB ? parsedB : parsedA

  const majority = useMemo(() => majorityCategory(focus.entries), [focus])
  const category = chosenCategory ?? majority
  const summary = useMemo(() => summarizeTeam(focus.entries, { category, basis }), [focus, category, basis])
  const shared = useMemo(() => sharedPriorities(focus.entries, { category, basis }), [focus, category, basis])
  const cohort = useMemo(() => (shared ? cohortPlan(focus.entries, shared) : []), [focus, shared])
  const comparison = useMemo(
    () => (parsedB ? compareTeams(parsedA.entries, parsedB.entries, { category, basis }) : null),
    [parsedA, parsedB, category, basis]
  )
  const sameCodes = parsedB ? sharedCodes(parsedA.entries, parsedB.entries) : 0

  const categoryName = tracks.find((tr) => tr.id === category)!.name
  const name = (id: string) => t(domainById(id).shortName)
  const sep = lang === 'ar' ? '، ' : ', '
  const describe = (s: FiveNum | null, n: number, target: number): string =>
    s
      ? [
          `${t(tt.median)} ${formatScore(s.median)}`,
          `${t(tt.q1)} ${formatScore(s.q1)}`,
          `${t(tt.q3)} ${formatScore(s.q3)}`,
          `${t(tt.min)} ${formatScore(s.min)}`,
          `${t(tt.max)} ${formatScore(s.max)}`,
          `${t(tt.answers)} ${n}`,
          `${t(tt.target)} ${t(levelForTarget(target).name)}`,
        ].join(sep)
      : t(tt.insufficient)

  const loadDemo = () => {
    setTextA(demoA)
    setTextB(demoB)
    setShowB(true)
    setChosenCategory(null)
  }

  const setALabel = showB ? t(tt.setBefore) : t(tt.setTeam)
  const viewSetName: L | null = bothOpen ? (viewSet === 'b' ? tt.setAfter : tt.setBefore) : null

  /* ------------------------------------------------ derived view rows */
  const stripRows: StripRow[] = summary
    ? summary.domains.map((d) => {
        const self = layer === 'self'
        const s = self ? d.self : d.judgment
        return {
          id: d.domainId,
          label: name(d.domainId),
          bins: self ? d.selfBins : d.judgmentBins,
          summary: s,
          target: d.target,
          description: describe(s, self ? d.n : d.judgmentN, d.target),
        }
      })
    : []
  const activeStats = summary?.domains.find((d) => d.domainId === active) ?? summary?.domains[0]
  const activeSummary = activeStats ? (layer === 'self' ? activeStats.self : activeStats.judgment) : null
  const spof = summary?.domains.filter((d) => d.singlePoint) ?? []
  const inflated = summary?.domains.filter((d) => d.inflationRisk) ?? []

  return (
    <div className={`team-root mx-auto max-w-6xl px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0 ${summary ? 'has-brief' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      <div className="team-screen">
        {/* ── Title, banner, privacy ─────────────────────────────── */}
        <section aria-labelledby="team-title">
          <p className="eyebrow">{t(tt.eyebrow)}</p>
          <h1 id="team-title" tabIndex={-1} className="mt-2 text-3xl font-bold text-dga-black sm:text-4xl">
            {t(tt.title)}
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-dga-muted">{t(tt.lede)}</p>
          <div role="note" className="mt-5 max-w-3xl rounded-btn border-s-4 border-dga-amber bg-dga-amber/10 px-4 py-3">
            <p className="font-bold text-dga-black">{t(tt.banner)}</p>
            <p className="mt-1 text-sm leading-relaxed text-dga-ink">{t(tt.bannerNote)}</p>
          </div>
          <ul className="mt-4 max-w-3xl space-y-1.5 text-sm leading-relaxed text-dga-ink">
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" />
              <span>{t(tt.privacyLocal)}</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" />
              <span>
                {t(tt.privacyCode)} <Link to={pathFor('adoption', lang)}>{t(tt.adoptionLink)}</Link>
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" />
              <span>
                {t(tt.howTo)} <Link to={pathFor('results', lang)}>{t(tt.resultsLink)}</Link>
              </span>
            </li>
          </ul>
        </section>

        {/* ── Input ─────────────────────────────────────────────── */}
        <section aria-label={t(tt.inputSection)} className="no-print mt-8">
          <div className={`grid gap-5 ${showB ? 'lg:grid-cols-2' : ''}`}>
            <CodeSet id="team-a" title={setALabel} value={textA} onChange={setTextA} parsed={parsedA} />
            {showB && parsedB && <CodeSet id="team-b" title={t(tt.setAfter)} value={textB} onChange={setTextB} parsed={parsedB} />}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              className="btn-ghost px-4 py-2 text-sm"
              aria-expanded={showB}
              onClick={() => {
                if (showB) setTextB('')
                setShowB(!showB)
                setViewSet('a')
              }}
            >
              {t(showB ? tt.removeAfter : tt.addAfter)}
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-dga-ink">
              <input type="checkbox" checked={excludeStale} onChange={(e) => setExcludeStale(e.target.checked)} className="h-4 w-4 accent-[#1B8354]" />
              {t(tt.excludeStale)}
            </label>
            <button type="button" className="text-sm font-semibold text-dga-green-dark underline-offset-4 hover:underline" onClick={loadDemo}>
              {t(tt.demo)}
            </button>
          </div>
          <p className="mt-2 text-xs text-dga-muted">{t(tt.countersNote)}</p>
          {isDemo && (
            <p className="mt-3 inline-flex rounded-pill bg-dga-amber/15 px-3 py-1 text-sm font-semibold text-dga-amber-tx">{t(tt.demoNote)}</p>
          )}
        </section>

        {/* ── Gate ──────────────────────────────────────────────── */}
        {!summary && (
          <div className="mt-8">
            <GateMessage have={parsedA.entries.length} />
          </div>
        )}

        {summary && activeStats && (
          <div data-testid="team-results">
            {/* ── Overview + controls ─────────────────────────── */}
            <section aria-labelledby="team-overview-title" className="mt-10 rounded-card border border-dga-line bg-white p-5 shadow-subtle">
              <h2 id="team-overview-title" className="sr-only">
                {t(tt.briefNumbers)}
              </h2>
              <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                  <dt className="text-dga-muted">{t(tt.overviewCodes)}</dt>
                  <dd className="text-2xl font-bold text-dga-black">
                    <Num>{summary.n}</Num>
                  </dd>
                </div>
                <div>
                  <dt className="text-dga-muted">{t(tt.overviewPeriod)}</dt>
                  <dd className="mt-1 font-semibold text-dga-black">
                    {summary.earliestMonth === summary.latestMonth
                      ? formatMonth(summary.latestMonth, lang)
                      : `${formatMonth(summary.earliestMonth, lang)} – ${formatMonth(summary.latestMonth, lang)}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-dga-muted">{t(tt.overviewCategory)}</dt>
                  <dd className="mt-1 font-semibold text-dga-black">{quote(t(categoryName), lang)}</dd>
                </div>
              </dl>
              <div className="no-print mt-5 grid gap-5 border-t border-dga-line pt-5 lg:grid-cols-2">
                <Segmented<TrackId>
                  name="team-category"
                  legend={t(tt.categoryLegend)}
                  value={category}
                  onChange={setChosenCategory}
                  options={tracks.map((tr) => ({
                    value: tr.id,
                    label: (
                      <>
                        {t(tr.name)}
                        {tr.id === majority && <span className="text-xs opacity-80">({t(tt.majority)})</span>}
                      </>
                    ),
                  }))}
                />
                <Segmented<Basis>
                  name="team-basis"
                  legend={t(tt.basisLegend)}
                  value={basis}
                  onChange={setBasis}
                  options={[
                    { value: 'self', label: t(tt.basisSelf) },
                    { value: 'cautious', label: t(tt.basisCautious) },
                  ]}
                />
                {bothOpen && (
                  <Segmented<'a' | 'b'>
                    name="team-set"
                    legend={t(tt.viewSetLegend)}
                    value={viewSet}
                    onChange={setViewSet}
                    options={[
                      { value: 'a', label: t(tt.setBefore) },
                      { value: 'b', label: t(tt.setAfter) },
                    ]}
                  />
                )}
              </div>
            </section>

            {/* ── (a) Distribution ────────────────────────────── */}
            <Section id="team-dist" title={t(tt.distTitle)} help={t(tt.distHelp)}>
              <div className="no-print mb-4">
                <Segmented<Layer>
                  name="team-layer"
                  legend={t(tt.layerLegend)}
                  value={layer}
                  onChange={setLayer}
                  options={[
                    { value: 'self', label: t(tt.layerSelf) },
                    { value: 'judgment', label: t(tt.layerJudgment) },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
                <div className="glass p-4">
                  <DomainDotStrip
                    rows={stripRows}
                    rtl={rtl}
                    active={activeStats.domainId}
                    onActive={setActive}
                    levelNames={levels.map((l) => t(l.name))}
                    insufficient={t(tt.insufficient)}
                    idPrefix="team-strip"
                  />
                  <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-dga-muted" aria-hidden="true">
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="10" height="10">
                        <circle cx="5" cy="5" r="3.5" fill="#1B8354" />
                      </svg>
                      {t(tt.answers)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="18" height="10">
                        <rect x="1" y="1" width="16" height="8" rx="2" fill="#1B8354" fillOpacity="0.1" stroke="#067647" />
                      </svg>
                      {t(tt.q1)} – {t(tt.q3)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="6" height="12">
                        <line x1="3" y1="0" x2="3" y2="12" stroke="#074D31" strokeWidth="2.6" />
                      </svg>
                      {t(tt.median)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="6" height="12">
                        <line x1="3" y1="0" x2="3" y2="12" stroke="#DBA102" strokeWidth="2" strokeDasharray="3 2" />
                      </svg>
                      {t(tt.target)}
                    </span>
                  </p>
                  <p className="claim-host mt-2 text-xs text-dga-muted">
                    {t(tt.scaleLead)} <Num>0–4</Num>
                    {t(tt.scaleProficient)}{' '}
                    <Claim id="method-level-thresholds">
                      <Num>2.25</Num>
                    </Claim>
                  </p>
                </div>
                <aside aria-live="polite" aria-labelledby="team-active-title" className="glass self-start p-5 lg:sticky lg:top-24">
                  <h3 id="team-active-title" className="font-bold leading-snug text-dga-black">
                    {t(domainById(activeStats.domainId).name)}
                  </h3>
                  <p className="mt-1 text-xs text-dga-muted">{t(layer === 'self' ? tt.layerSelf : tt.layerJudgment)}</p>
                  {activeSummary ? (
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      {(
                        [
                          [tt.median, activeSummary.median],
                          [tt.q1, activeSummary.q1],
                          [tt.q3, activeSummary.q3],
                          [tt.min, activeSummary.min],
                          [tt.max, activeSummary.max],
                        ] as [L, number][]
                      ).map(([l, v]) => (
                        <div key={l.en}>
                          <dt className="text-xs text-dga-muted">{t(l)}</dt>
                          <dd className="font-semibold text-dga-black">
                            <Num>{formatScore(v)}</Num>
                          </dd>
                        </div>
                      ))}
                      <div>
                        <dt className="text-xs text-dga-muted">{t(tt.answers)}</dt>
                        <dd className="font-semibold text-dga-black">
                          <Num>{layer === 'self' ? activeStats.n : activeStats.judgmentN}</Num>
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-3 text-sm text-dga-muted">{t(tt.insufficient)}</p>
                  )}
                  <dl className="mt-4 space-y-1.5 border-t border-dga-line pt-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-dga-muted">{t(tt.target)}</dt>
                      <dd className="font-semibold">{t(levelForTarget(activeStats.target).name)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-dga-muted">{t(tt.coverage)}</dt>
                      <dd className="font-semibold">
                        <Num>{formatShare(activeStats.coverage)}</Num>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-dga-muted">{t(tt.proficient)}</dt>
                      <dd className="font-semibold">
                        <Num>{activeStats.proficientOrAbove}</Num>
                      </dd>
                    </div>
                  </dl>
                </aside>
              </div>
              <Equivalent>
                <table className="w-full min-w-[34rem]">
                  <caption className="sr-only">{t(tt.distTitle)}</caption>
                  <thead>
                    <tr>
                      <th scope="col" className={thCls}>
                        {t(tt.domain)}
                      </th>
                      {[tt.min, tt.q1, tt.median, tt.q3, tt.max, tt.answers].map((l) => (
                        <th key={l.en} scope="col" className={thCls}>
                          {t(l)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.domains.map((d) => {
                      const s = layer === 'self' ? d.self : d.judgment
                      return (
                        <tr key={d.domainId}>
                          <th scope="row" className={`${tdCls} text-start font-medium`}>
                            {name(d.domainId)}
                          </th>
                          {s ? (
                            [s.min, s.q1, s.median, s.q3, s.max].map((v, i) => (
                              <td key={i} className={tdCls}>
                                <Num>{formatScore(v)}</Num>
                              </td>
                            ))
                          ) : (
                            <td colSpan={5} className={`${tdCls} text-dga-muted`}>
                              {t(tt.insufficient)}
                            </td>
                          )}
                          <td className={tdCls}>
                            <Num>{layer === 'self' ? d.n : d.judgmentN}</Num>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Equivalent>
            </Section>

            {/* ── (b) Coverage ─────────────────────────────────── */}
            <Section id="team-coverage" title={t(tt.covTitle)} help={t(tt.covHelp)}>
              <div className="glass p-5">
                <CoverageBars
                  rows={summary.domains.map((d) => ({
                    id: d.domainId,
                    label: name(d.domainId),
                    share: d.coverage,
                    detail: (
                      <>
                        <span>
                          {t(tt.target)}: {t(levelForTarget(d.target).name)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          <Num>{d.atOrAboveTarget}</Num> {t(tt.of)} <Num>{d.n}</Num>
                        </span>
                      </>
                    ),
                    flag: d.singlePoint ? t(tt.spofChip) : undefined,
                  }))}
                />
              </div>
              <Equivalent>
                <table className="w-full min-w-[28rem]">
                  <caption className="sr-only">{t(tt.covTitle)}</caption>
                  <thead>
                    <tr>
                      {[tt.domain, tt.target, tt.atTarget, tt.coverage].map((l) => (
                        <th key={l.en} scope="col" className={thCls}>
                          {t(l)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.domains.map((d) => (
                      <tr key={d.domainId}>
                        <th scope="row" className={`${tdCls} text-start font-medium`}>
                          {name(d.domainId)}
                        </th>
                        <td className={tdCls}>{t(levelForTarget(d.target).name)}</td>
                        <td className={tdCls}>
                          <Num>{d.atOrAboveTarget}</Num> {t(tt.of)} <Num>{d.n}</Num>
                        </td>
                        <td className={tdCls}>
                          <Num>{formatShare(d.coverage)}</Num>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Equivalent>
            </Section>

            {/* ── (c) Single points of failure ────────────────── */}
            <Section id="team-spof" title={t(tt.spofTitle)} help={t(tt.spofHelp)}>
              {spof.length === 0 ? (
                <p className="glass p-5 text-dga-ink">{t(tt.spofNone)}</p>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {spof.map((d) => (
                    <li key={d.domainId} className="glass border-s-4 border-s-dga-amber p-5">
                      <p className="font-bold text-dga-black">{t(domainById(d.domainId).name)}</p>
                      <p className="mt-1 text-sm font-semibold text-dga-amber-tx">{t(d.proficientOrAbove === 0 ? tt.spofZero : tt.spofOne)}</p>
                      <p className="mt-2 text-sm leading-relaxed text-dga-muted">{t(spofAdvice[d.proficientOrAbove === 0 ? 'borrow' : 'mentor'])}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* ── (d) Inflation risk ───────────────────────────── */}
            <Section id="team-inflation" title={t(tt.inflTitle)} help={t(tt.inflHelp)}>
              <div className="glass p-5">
                <GapBars
                  rtl={rtl}
                  insufficient={t(tt.insufficient)}
                  riskLabel={t(tt.inflFlag)}
                  rows={summary.domains.map((d) => ({ id: d.domainId, label: name(d.domainId), gap: d.meanGap, risk: d.inflationRisk }))}
                />
                <p className="mt-4 text-sm text-dga-ink">
                  {inflated.length === 0 ? (
                    t(tt.inflNone)
                  ) : (
                    <>
                      <span className="font-semibold text-dga-amber-tx">{t(tt.inflFlag)}:</span> {inflated.map((d) => name(d.domainId)).join(sep)}
                    </>
                  )}
                </p>
              </div>
              <Equivalent>
                <table className="w-full min-w-[34rem]">
                  <caption className="sr-only">{t(tt.inflTitle)}</caption>
                  <thead>
                    <tr>
                      {[tt.domain, tt.colPairs, tt.colGap, tt.colMismatch, tt.colKnowledge].map((l) => (
                        <th key={l.en} scope="col" className={thCls}>
                          {t(l)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.domains.map((d) => (
                      <tr key={d.domainId}>
                        <th scope="row" className={`${tdCls} text-start font-medium`}>
                          {name(d.domainId)}
                        </th>
                        <td className={tdCls}>
                          <Num>{d.pairedN}</Num>
                        </td>
                        <td className={tdCls}>{d.meanGap === null ? '—' : <Num>{formatSigned(d.meanGap)}</Num>}</td>
                        <td className={tdCls}>{d.mismatchShare === null ? '—' : <Num>{formatShare(d.mismatchShare)}</Num>}</td>
                        <td className={tdCls}>
                          {d.knowledgeJudged < TEAM_K ? (
                            '—'
                          ) : (
                            <>
                              <Num>{d.knowledgeSelfHigher}</Num> {t(tt.of)} <Num>{d.knowledgeJudged}</Num>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Equivalent>
            </Section>

            {/* ── (e) Shared priorities + cohort themes ───────── */}
            <Section id="team-priorities" title={t(tt.prioTitle)} help={t(tt.prioHelp)}>
              {!shared || shared.length === 0 ? (
                <p className="glass p-5 text-dga-ink">{t(tt.prioNone)}</p>
              ) : (
                <>
                  <ol className="grid gap-4 md:grid-cols-3">
                    {shared.map((p, i) => (
                      <li key={p.domainId} className="glass flex flex-col p-5">
                        <span className="text-sm font-bold text-dga-amber-tx">
                          <Num>{i + 1}</Num>
                        </span>
                        <p className="mt-1 text-lg font-bold leading-snug text-dga-black">{t(domainById(p.domainId).name)}</p>
                        <p className="mt-2 text-sm text-dga-ink">
                          {t(tt.prioCount)} <Num>{p.count}</Num> {t(tt.of)} <Num>{summary.n}</Num>
                        </p>
                        <p className="mt-1 text-sm text-dga-muted">
                          {t(tt.prioReason)}: <span className="font-semibold text-dga-ink">{t(teamReason[p.mainReason])}</span>
                        </p>
                        <p className="mt-auto pt-3 text-sm leading-relaxed text-dga-ink">{t(staffingText[p.staffing])}</p>
                      </li>
                    ))}
                  </ol>
                  <h3 className="mt-10 text-xl font-bold text-dga-black">{t(tt.cohortTitle)}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dga-muted">{t(tt.cohortHelp)}</p>
                  <ol className="mt-4 grid gap-4 lg:grid-cols-3">
                    {PLAN_PHASES.map(([a, b], phase) => (
                      <li key={a} className="glass p-5">
                        <p className="text-sm font-bold text-dga-green-dark">
                          {t(tt.weeks)}{' '}
                          <Num>
                            {a}–{b}
                          </Num>
                        </p>
                        <ul className="mt-3 space-y-3">
                          {cohort.map((c) => (
                            <li key={c.domainId} className="text-sm leading-relaxed">
                              <span className="block font-semibold text-dga-black">{t(domainById(c.domainId).shortName)}</span>
                              <span className="text-dga-ink">{t(c.behaviours[phase])}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-xs text-dga-muted">
                    {t(tt.startFrom)}:{' '}
                    {cohort.map((c) => `${t(domainById(c.domainId).shortName)} — ${t(levels[c.startLevel - 1].name)}`).join(sep)}
                  </p>
                </>
              )}
            </Section>

            {/* ── (f) Before / after ───────────────────────────── */}
            {showB && parsedB && (
              <Section id="team-compare" title={t(tt.cmpTitle)} help={t(tt.cmpHelp)}>
                {comparison ? (
                  <>
                    {sameCodes > 0 && (
                      <p className="mb-4 rounded-btn bg-dga-amber/10 px-4 py-2 text-sm text-dga-ink">
                        {t(tt.cmpSame)} <Num>{sameCodes}</Num>
                      </p>
                    )}
                    <div className="grid items-start gap-6 lg:grid-cols-[25rem_1fr]">
                      <div className="glass p-4">
                        <TeamCompareRadar
                          labels={comparison.before.domains.map((d) => name(d.domainId))}
                          before={comparison.before.domains.map((d) => d.basis.median)}
                          after={comparison.after.domains.map((d) => d.basis.median)}
                          rtl={rtl}
                          beforeLabel={t(tt.cmpBefore)}
                          afterLabel={t(tt.cmpAfter)}
                          sliderLabel={t(tt.cmpSlider)}
                          caption={t(tt.cmpCaption)}
                          valueText={(m) => `${t(tt.cmpBefore)} ${100 - m}%${sep}${t(tt.cmpAfter)} ${m}%`}
                        />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[36rem]">
                          <caption className="mb-2 text-start text-sm text-dga-muted">
                            {t(tt.setBefore)}: <Num>{comparison.before.n}</Num> · {t(tt.setAfter)}: <Num>{comparison.after.n}</Num> ·{' '}
                            {t(tt.basisUsed)}: {t(basis === 'self' ? tt.basisSelf : tt.basisCautious)}
                          </caption>
                          <thead>
                            <tr>
                              {[tt.domain, tt.cmpMedianBefore, tt.cmpMedianAfter, tt.cmpChange, tt.cmpCovBefore, tt.cmpCovAfter, tt.cmpCovChange].map((l) => (
                                <th key={l.en} scope="col" className={thCls}>
                                  {t(l)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {comparison.domains.map((d) => (
                              <tr key={d.domainId}>
                                <th scope="row" className={`${tdCls} text-start font-medium`}>
                                  {name(d.domainId)}
                                </th>
                                <td className={tdCls}>
                                  <Num>{formatScore(d.beforeMedian)}</Num>
                                </td>
                                <td className={tdCls}>
                                  <Num>{formatScore(d.afterMedian)}</Num>
                                </td>
                                <td className={`${tdCls} font-semibold ${d.deltaMedian > 0 ? 'text-dga-green-dark' : d.deltaMedian < 0 ? 'text-dga-amber-tx' : ''}`}>
                                  <Num>{formatSigned(d.deltaMedian)}</Num>
                                </td>
                                <td className={tdCls}>
                                  <Num>{formatShare(d.beforeCoverage)}</Num>
                                </td>
                                <td className={tdCls}>
                                  <Num>{formatShare(d.afterCoverage)}</Num>
                                </td>
                                <td className={`${tdCls} font-semibold`}>
                                  <Num>{formatSigned(d.deltaCoverage)}</Num>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-dga-ink">{t(tt.cmpGate)}</p>
                    {!gateB?.open && <GateMessage have={parsedB.entries.length} compact />}
                  </div>
                )}
              </Section>
            )}

            {/* ── Print ────────────────────────────────────────── */}
            <div className="no-print mt-12 flex flex-wrap items-center gap-4 border-t border-dga-line pt-6">
              <button type="button" className="btn-primary" onClick={() => window.print()}>
                {t(tt.print)}
              </button>
              <p className="text-sm text-dga-muted">{t(tt.banner)}</p>
            </div>
          </div>
        )}
      </div>

      {summary && (
        <TeamBrief
          summary={summary}
          counts={focus}
          shared={shared ?? []}
          cohort={cohort}
          comparison={comparison}
          categoryName={categoryName}
          basis={basis}
          setName={viewSetName}
          demo={isDemo}
          today={today}
        />
      )}
    </div>
  )
}
