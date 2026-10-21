import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useApp } from '../store'
import type { ResultRecord } from '../store'
import { domains } from '../data/domains'
import type { Domain, L } from '../data/types'
import { libraryRoleById, LIB_PREFIX, resolveRoleName } from '../data/roleLibrary'
import { levelForScore, levelForTarget, scaleOptions } from '../data/levels'
import { statementsByDomain } from '../data/statements'
import { scenarioFor } from '../data/scenarios'
import { trackById } from '../data/tracks'
import {
  agreementLabel,
  assessDomains,
  isCategoryId,
  MIN_KNOWLEDGE_ATTEMPTS,
  priorities as computePriorities,
  reasonLabel,
  summaryLine,
  targetsForRecord,
} from '../lib/priorities'
import type { Agreement, DomainEvidence, Priority, Reason } from '../lib/priorities'
import { encodeResult, formatCode } from '../lib/resultCode'
import { downloadText, formatLongDate } from '../lib/ics'
import RadarChart, { RadarLayerSwatch } from '../components/RadarChart'
import Disclaimer from '../components/Disclaimer'
import Icon from '../components/Icon'

/* ------------------------------------------------------------------ helpers */

function Num({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className}`}>
      {children}
    </bdi>
  )
}

/** Signed delta with a real minus sign, always rendered left-to-right («+0.4», «−0.2»). */
function Signed({ value }: { value: number }) {
  const v = Math.round(value * 10) / 10
  const text = v > 0 ? `+${v.toFixed(1)}` : v < 0 ? `−${Math.abs(v).toFixed(1)}` : '0.0'
  return <Num className={v > 0 ? 'text-dga-green-dark' : v < 0 ? 'text-rose-700' : 'text-dga-muted'}>{text}</Num>
}

const reasonStyle: Record<Reason, string> = {
  both_below_target: 'bg-[#FEE4E2] text-[#B42318]',
  self_below_target: 'bg-dga-tag-info-bg text-dga-tag-info-text',
  judgment_below_self: 'bg-[#FEF3D8] text-[#8A6A00]',
  inflated: 'bg-[#FEF3D8] text-[#8A6A00]',
  maintain: 'bg-dga-tag-ok-bg text-dga-tag-ok-text',
}

const agreementStyle: Record<Agreement, string> = {
  consistent: 'text-dga-green-dark',
  self_higher: 'text-[#8A6A00]',
  check_higher: 'text-dga-tag-info-text',
}

/** Knowledge check in plain words: "x correct of y attempted", or why it is not judged. */
export function KnowledgeText({ e }: { e: Pick<DomainEvidence, 'knowledge' | 'agreement'> }) {
  const { t } = useApp()
  const k = e.knowledge
  if (!k) return <span className="text-dga-muted">{t({ ar: 'لم تُجب عن أسئلته', en: 'Not attempted' })}</span>
  if (k.attempted === null) {
    return (
      <span>
        <Num>{k.correct}</Num> {t({ ar: 'صحيحة (عدد المحاولات غير محفوظ)', en: 'correct (attempts not recorded)' })}
      </span>
    )
  }
  return (
    <span>
      <Num>{k.correct}</Num> {t({ ar: 'صحيحة من', en: 'correct of' })} <Num>{k.attempted}</Num>
      {k.attempted < MIN_KNOWLEDGE_ATTEMPTS && <span className="ms-1 text-dga-muted">· {t({ ar: 'لم يُستكمل التحقق', en: 'check incomplete' })}</span>}
    </span>
  )
}

/** Category name, precise role (if any) — never a person's name. */
export function roleLine(rec: ResultRecord): { category: L | null; role: L | null } {
  const category = isCategoryId(rec.trackId) ? trackById(rec.trackId)!.name : null
  const lib = rec.roleId.startsWith(LIB_PREFIX) ? libraryRoleById(rec.roleId.slice(LIB_PREFIX.length)) : undefined
  return { category, role: lib ? lib.name : category ? null : resolveRoleName(rec.roleId) }
}

/**
 * The plan page keeps its ticked weeks under this key (`LS_PLAN` in Pathways.tsx). It is repeated here,
 * not imported, so this page does not pull the plan page's code into its own chunk.
 */
export const PLAN_PROGRESS_KEY = 'dsr-plan-progress'

/** Remove the plan's ticked weeks from this browser (they belong to the results being deleted). */
export function clearPlanProgress(): void {
  try {
    localStorage.removeItem(PLAN_PROGRESS_KEY)
  } catch {
    /* storage unavailable: nothing was stored */
  }
}

/* ------------------------------------------------------------------ page */

type LayerKey = 'self' | 'judgment' | 'knowledge' | 'target'

export default function Results() {
  const { t, lang, go, history, resetDraft, clearHistory, setTrackId, setRoleId } = useApp()
  const latest = history[history.length - 1]
  const previous = history.length > 1 ? history[history.length - 2] : null
  const [selected, setSelected] = useState<string | null>(null)
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({ self: true, judgment: true, knowledge: true, target: true })
  const [compare, setCompare] = useState(1) // 0 = previous result, 1 = this result
  const [copyState, setCopyState] = useState<'idle' | 'ok' | 'manual'>('idle')
  const [exportNote, setExportNote] = useState('')
  const codeInputRef = useRef<HTMLInputElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | null>(null)

  const data = useMemo(() => {
    if (!latest) return null
    const targets = targetsForRecord(latest)
    const evidence = assessDomains(latest, targets, domains)
    const prio = computePriorities(latest, targets, domains)
    const prevScores = previous ? domains.map((d) => previous.scores[d.id] ?? 0) : undefined
    return { targets, evidence, prio, prevScores, code: encodeResult(latest) }
  }, [latest, previous])

  useEffect(() => () => {
    if (animRef.current !== null) cancelAnimationFrame(animRef.current)
  }, [])

  if (!latest || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="glass p-10">
          <Icon name="radar" className="mx-auto h-10 w-10 text-dga-green" />
          <h1 className="mt-4 text-2xl font-bold">{t({ ar: 'لا توجد نتائج بعد', en: 'No results yet' })}</h1>
          <p className="mt-3 text-dga-muted">{t({ ar: 'أكمل التقييم أولًا لتظهر أولوياتك هنا.', en: 'Complete the assessment first and your priorities will appear here.' })}</p>
          <button type="button" onClick={() => go('wizard')} className="btn-primary mt-6">
            {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
          </button>
        </div>
      </div>
    )
  }

  const { evidence, prio, prevScores, code } = data
  const { category, role } = roleLine(latest)
  const dateStr = formatLongDate(new Date(latest.date), lang)
  const selfValues = evidence.map((e) => e.selfScore)
  const shownValues = prevScores ? selfValues.map((v, i) => prevScores[i] + (v - prevScores[i]) * compare) : selfValues
  const judgmentValues = evidence.some((e) => e.judgment4 !== undefined) ? evidence.map((e) => e.judgment4 ?? 0) : undefined
  const hasJudgmentGaps = evidence.some((e) => e.judgment4 === undefined)
  // knowledge check on the radar's 0–4 scale; only judged once enough questions were attempted
  const knowledgeValues = evidence.map((e) =>
    e.knowledge && e.knowledge.attempted !== null && e.knowledge.attempted >= MIN_KNOWLEDGE_ATTEMPTS ? (e.knowledge.correct / e.knowledge.attempted) * 4 : null,
  )
  const selectedEv = evidence.find((e) => e.domainId === selected) ?? null
  const forward = lang === 'ar' ? '←' : '→'

  const selectDomain = (id: string, focus = false) => {
    setSelected(id)
    if (focus) requestAnimationFrame(() => detailRef.current?.focus({ preventScroll: false }))
  }

  const playCompare = () => {
    if (!prevScores) return
    if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setCompare(compare < 1 ? 1 : 0)
      return
    }
    const from = compare >= 1 ? 0 : compare
    const startAt = performance.now()
    const dur = 1200
    const tick = (now: number) => {
      const p = Math.min(1, (now - startAt) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setCompare(from + (1 - from) * eased)
      if (p < 1) animRef.current = requestAnimationFrame(tick)
      else animRef.current = null
    }
    setCompare(from)
    animRef.current = requestAnimationFrame(tick)
  }

  const copyCode = async () => {
    const text = formatCode(code)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('no clipboard')
      await navigator.clipboard.writeText(text)
      setCopyState('ok')
    } catch {
      setCopyState('manual')
      codeInputRef.current?.focus()
      codeInputRef.current?.select()
    }
  }

  const exportJson = () => {
    const payload = { format: 'digital-skills-radar/result', schema: latest.v ?? 1, exportedAt: new Date().toISOString(), result: latest }
    const ok = downloadText(`skills-radar-${latest.date.slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json')
    setExportNote(ok ? t({ ar: 'نُزّل ملف JSON بنتيجتك.', en: 'Your result was downloaded as JSON.' }) : t({ ar: 'تعذّر التنزيل في هذا المتصفح.', en: 'Download is not available in this browser.' }))
  }

  const retake = () => {
    resetDraft()
    if (isCategoryId(latest.trackId)) setTrackId(latest.trackId)
    if (latest.roleId.startsWith(LIB_PREFIX)) setRoleId(latest.roleId)
    go('wizard')
  }

  const layerButtons: { key: LayerKey; label: L; swatch: ReactNode; available: boolean }[] = [
    { key: 'self', label: { ar: 'تقديري الذاتي', en: 'My self-rating' }, swatch: <RadarLayerSwatch layer="self" />, available: true },
    { key: 'judgment', label: { ar: 'مواقف الحكم', en: 'Judgment scenarios' }, swatch: <RadarLayerSwatch layer="scenario" />, available: !!judgmentValues },
    { key: 'knowledge', label: { ar: 'التحقق المعرفي', en: 'Knowledge check' }, swatch: <RadarLayerSwatch layer="knowledge" />, available: knowledgeValues.some((v) => v !== null) },
    { key: 'target', label: { ar: 'المستهدف', en: 'Target' }, swatch: <RadarLayerSwatch layer="target" />, available: true },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t({ ar: 'نتيجتك', en: 'Your result' })}</p>
          <h1 className="mt-2 text-3xl font-bold">{t({ ar: 'أولويات تطويرك المقترحة', en: 'Your suggested development priorities' })}</h1>
          <p className="mt-2 text-sm text-dga-muted">
            {category && <>{t({ ar: 'فئة الدور: ', en: 'Role category: ' })}{t(category)}</>}
            {role && <>{category ? ' · ' : ''}{t({ ar: 'الدور: ', en: 'Role: ' })}{t(role)}</>}
            {' · '}
            {dateStr}
          </p>
        </div>
      </div>

      <Disclaimer />

      {/* headline from the engine */}
      <p className="mt-5 rounded-card border-s-4 border-dga-green bg-white p-5 text-base font-semibold leading-loose text-dga-ink shadow-card" data-testid="summary-line">
        {summaryLine(prio, lang)}
      </p>

      {/* the 3 priorities */}
      <section className="mt-6" aria-labelledby="prio-h">
        <h2 id="prio-h" className="text-xl font-bold">{t({ ar: 'أولوياتك الثلاث وسبب كل منها', en: 'Your three priorities and why' })}</h2>
        <ol className="mt-4 grid gap-4 lg:grid-cols-3" data-testid="priority-list">
          {prio.map((p) => (
            <PriorityCard key={p.domainId} p={p} ev={evidence.find((e) => e.domainId === p.domainId)!} onDetails={() => selectDomain(p.domainId, true)} />
          ))}
        </ol>
      </section>

      {/* actions */}
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => go('report')} className="btn-primary px-5 py-2.5 text-sm">
          {t({ ar: 'ورقة حوار التطوير', en: 'Development conversation sheet' })}
        </button>
        <button type="button" onClick={() => go('pathways')} className="btn-primary px-5 py-2.5 text-sm">
          {t({ ar: 'خطتي', en: 'My plan' })}
          <span aria-hidden>{forward}</span>
        </button>
        <button type="button" onClick={copyCode} className="btn-ghost px-5 py-2.5 text-sm">
          {t({ ar: 'نسخ رمز النتيجة', en: 'Copy result code' })}
        </button>
        <button type="button" onClick={exportJson} className="btn-ghost px-5 py-2.5 text-sm">
          {t({ ar: 'تصدير JSON', en: 'Export JSON' })}
        </button>
        <button type="button" onClick={retake} className="btn-ghost px-5 py-2.5 text-sm">
          {t({ ar: 'إعادة التقييم', en: 'Retake the assessment' })}
        </button>
      </div>
      <p className="mt-2 min-h-[1.25rem] text-xs text-dga-muted" role="status" aria-live="polite">
        {exportNote}
      </p>

      {/* interactive radar + domain levels + detail */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" aria-labelledby="radar-h">
        <div className="glass-strong p-4 sm:p-6">
          <h2 id="radar-h" className="text-lg font-bold">{t({ ar: 'رادارك: طبقات الأدلة', en: 'Your radar: evidence layers' })}</h2>
          <div className="no-print mt-3 flex flex-wrap gap-2" role="group" aria-label={t({ ar: 'إظهار الطبقات وإخفاؤها', en: 'Show or hide layers' })}>
            {layerButtons.map((b) => (
              <button
                key={b.key}
                type="button"
                aria-pressed={layers[b.key] && b.available}
                disabled={!b.available}
                onClick={() => setLayers((l) => ({ ...l, [b.key]: !l[b.key] }))}
                className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  layers[b.key] && b.available ? 'border-dga-green bg-dga-green/10 font-semibold text-dga-green-dark' : 'border-dga-line bg-white text-dga-muted'
                }`}
              >
                <span className="inline-flex w-6 justify-center" aria-hidden>{b.swatch}</span>
                {t(b.label)}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-2 max-w-[560px] px-2 sm:px-4">
            <RadarChart
              labels={domains.map((d) => d.shortName)}
              ids={domains.map((d) => d.id)}
              values={shownValues}
              targets={evidence.map((e) => e.target)}
              previous={prevScores}
              judgment={judgmentValues}
              knowledge={knowledgeValues}
              layers={{ self: layers.self, target: layers.target, scenario: layers.judgment, knowledge: layers.knowledge }}
              lang={lang}
              interactive
              selectedAxis={selected}
              onAxisSelect={(id) => selectDomain(id, true)}
              onHoverLabel={(i) => {
                if (i !== null) setSelected(domains[i].id)
              }}
            />
          </div>
          {hasJudgmentGaps && judgmentValues && layers.judgment && (
            <p className="text-[11px] text-dga-muted">{t({ ar: 'المجالات بلا موقف حكم تظهر عند المركز في طبقة المواقف.', en: 'Domains without a scenario sit at the centre of the scenario layer.' })}</p>
          )}

          {prevScores && (
            <div className="no-print mt-4 rounded-btn border border-dga-line bg-dga-bg p-3">
              <label htmlFor="compare-range" className="text-xs font-bold text-dga-ink">
                {t({ ar: 'قارن بتقييمك السابق', en: 'Compare with your previous assessment' })}
                <span className="ms-2 font-normal text-dga-muted">({formatLongDate(new Date(previous!.date), lang)})</span>
              </label>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[11px] text-dga-muted">{t({ ar: 'السابق', en: 'Previous' })}</span>
                <input
                  id="compare-range"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={Math.round(compare * 100)}
                  onChange={(e) => setCompare(Number(e.target.value) / 100)}
                  aria-valuetext={compare >= 1 ? t({ ar: 'التقييم الحالي', en: 'Current assessment' }) : compare <= 0 ? t({ ar: 'التقييم السابق', en: 'Previous assessment' }) : `${Math.round(compare * 100)}%`}
                  className="flex-1 accent-dga-green"
                />
                <span className="text-[11px] text-dga-muted">{t({ ar: 'الحالي', en: 'Current' })}</span>
                <button type="button" onClick={playCompare} className="btn-ghost px-3 py-1 text-xs">
                  {t({ ar: 'شغّل المقارنة', en: 'Play the comparison' })}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass p-5">
            <h2 className="text-sm font-bold text-dga-ink">{t({ ar: 'مستوياتك في المجالات الثمانية', en: 'Your levels in the eight domains' })}</h2>
            <p className="mt-1 text-[11px] text-dga-muted">{t({ ar: 'اختر مجالًا لترى تفاصيله.', en: 'Choose a domain to see its details.' })}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2" data-testid="domain-levels">
              {evidence.map((e, i) => {
                const d = domains[i]
                const on = selected === e.domainId
                return (
                  <li key={e.domainId}>
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-controls="domain-detail"
                      onClick={() => selectDomain(e.domainId, true)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-start transition-colors ${
                        on ? 'border-dga-green bg-dga-green/10' : 'border-dga-line bg-dga-bg hover:border-dga-green'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-medium text-dga-black">
                        <Icon name={d.icon} className="h-4 w-4 text-dga-green" />
                        {t(d.shortName)}
                      </span>
                      <span className="chip shrink-0 border-dga-amber/40 bg-dga-amber/10 text-[11px] text-dga-amber-tx">
                        {t(levelForScore(e.selfScore).name)} · <Num>{e.selfScore.toFixed(1)}</Num>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div id="domain-detail" ref={detailRef} tabIndex={-1} aria-live="polite" className="glass p-5 outline-none focus-visible:ring-2 focus-visible:ring-dga-green">
            {selectedEv ? (
              <DomainDetail ev={selectedEv} domain={domains.find((d) => d.id === selectedEv.domainId)!} rec={latest} prev={previous} prio={prio.find((p) => p.domainId === selectedEv.domainId)} />
            ) : (
              <p className="text-sm text-dga-muted">
                {t({
                  ar: 'اختر مجالًا من القائمة أو من اسمه على الرادار لترى: مستواك، وإجاباتك عن العبارات، ونتيجة موقف الحكم، والتحقق المعرفي.',
                  en: 'Choose a domain from the list or its name on the radar to see your level, your statement answers, the scenario outcome and the knowledge check.',
                })}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* evidence layers side by side (text equivalent of the radar) */}
      <section className="mt-8" aria-labelledby="layers-h">
        <h2 id="layers-h" className="text-xl font-bold">{t({ ar: 'طبقات الأدلة جنبًا إلى جنب', en: 'Evidence layers side by side' })}</h2>
        <p className="mt-1 max-w-3xl text-sm text-dga-muted">
          {t({ ar: 'التقدير الذاتي على مقياس ', en: 'Self-rating on a scale of ' })}
          <Num>0–4</Num>
          {t({ ar: '، وموقف الحكم على مقياس ', en: ', the judgment scenario on ' })}
          <Num>0–3</Num>
          {t({
            ar: '، والتحقق المعرفي عدد الإجابات الصحيحة مما أجبت عنه. لا يُحكم على الاتساق قبل ',
            en: ', and the knowledge check as correct answers out of those attempted. Consistency is not judged before ',
          })}
          <Num>{MIN_KNOWLEDGE_ATTEMPTS}</Num>
          {t({ ar: ' إجابات في المجال.', en: ' answers in a domain.' })}
        </p>
        <div className="mt-4 overflow-x-auto rounded-card border border-dga-line bg-white">
          <table className="w-full min-w-[720px] text-start text-sm" data-testid="evidence-table">
            <thead className="bg-dga-bg text-xs text-dga-muted">
              <tr>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{t({ ar: 'المجال', en: 'Domain' })}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{t({ ar: 'التقدير الذاتي', en: 'Self-rating' })}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{t({ ar: 'موقف الحكم', en: 'Scenario' })}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{t({ ar: 'التحقق المعرفي', en: 'Knowledge check' })}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{t({ ar: 'الاتساق', en: 'Consistency' })}</th>
                <th scope="col" className="px-3 py-2 text-start font-semibold">{t({ ar: 'المستهدف', en: 'Target' })}</th>
                {prevScores && <th scope="col" className="px-3 py-2 text-start font-semibold">{t({ ar: 'التغيّر عن السابق', en: 'Change vs previous' })}</th>}
              </tr>
            </thead>
            <tbody>
              {evidence.map((e, i) => (
                <tr key={e.domainId} className="border-t border-dga-line">
                  <th scope="row" className="px-3 py-2 text-start font-medium text-dga-black">{t(domains[i].shortName)}</th>
                  <td className="px-3 py-2">
                    <Num>{e.selfScore.toFixed(1)}</Num> <span className="text-dga-muted">· {t(levelForScore(e.selfScore).name)}</span>
                  </td>
                  <td className="px-3 py-2">
                    {e.scenarioScore !== undefined ? (
                      <>
                        <Num>{e.scenarioScore}</Num> {t({ ar: 'من', en: 'of' })} <Num>3</Num>
                      </>
                    ) : (
                      <span className="text-dga-muted">{t({ ar: 'لا موقف', en: 'No scenario' })}</span>
                    )}
                  </td>
                  <td className="px-3 py-2"><KnowledgeText e={e} /></td>
                  <td className="px-3 py-2">
                    {e.agreement ? <span className={agreementStyle[e.agreement]}>{t(agreementLabel[e.agreement])}</span> : <span className="text-dga-muted">—</span>}
                  </td>
                  <td className="px-3 py-2">{t(levelForTarget(e.target).name)}</td>
                  {prevScores && (
                    <td className="px-3 py-2">
                      <Signed value={e.selfScore - prevScores[i]} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* result code */}
      <section className="mt-8 glass p-6" aria-labelledby="code-h">
        <h2 id="code-h" className="text-lg font-bold">{t({ ar: 'رمز النتيجة', en: 'Result code' })}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dga-ink">
          {t({
            ar: 'يحتوي الرمز على: فئة دورك (لا دورك الدقيق)، ودرجات تقديرك الذاتي في المجالات الثمانية مقرّبة إلى نصف درجة، ونتيجة كل موقف حكم، وعلامة اتساق التحقق المعرفي، وشهر التقييم. لا يحتوي اسمك ولا جهتك ولا إجاباتك التفصيلية. مشاركته قرارك وحدك، ولا يُرسل إلى أي خادم.',
            en: 'The code holds: your role category (not your precise role), your self-ratings in the eight domains rounded to half a point, each scenario outcome, the knowledge-check consistency flag, and the month of the assessment. It holds no name, no entity and no detailed answers. Sharing it is your choice alone, and it is never sent to any server.',
          })}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor="result-code" className="sr-only">{t({ ar: 'رمز النتيجة', en: 'Result code' })}</label>
          {/* the whole code stays visible, on screen and in print: width from its own length, never clipped */}
          <input
            id="result-code"
            ref={codeInputRef}
            readOnly
            dir="ltr"
            value={formatCode(code)}
            size={formatCode(code).length + 1}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full max-w-xs rounded-btn border border-dga-line bg-dga-bg px-3 py-2 font-mono text-sm tracking-wide text-dga-black sm:w-auto sm:min-w-[30ch] sm:max-w-none print:w-auto print:min-w-[30ch] print:max-w-none"
            data-testid="result-code"
          />
          <button type="button" onClick={copyCode} className="btn-ghost no-print px-4 py-2 text-sm">
            {t({ ar: 'نسخ رمز النتيجة', en: 'Copy result code' })}
          </button>
          <span role="status" aria-live="polite" className="text-xs text-dga-green-dark">
            {copyState === 'ok' && t({ ar: 'نُسخ الرمز.', en: 'Code copied.' })}
            {copyState === 'manual' && t({ ar: 'حدّدنا الرمز؛ انسخه يدويًا.', en: 'The code is selected; copy it manually.' })}
          </span>
        </div>
      </section>

      <div className="no-print mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t({ ar: 'حذف كل النتائج المحفوظة وتقدّم خطتك من هذا المتصفح؟', en: 'Delete all saved results and your plan progress from this browser?' }))) {
              clearHistory()
              clearPlanProgress()
            }
          }}
          className="text-xs text-rose-700 underline-offset-4 hover:underline"
        >
          {t({ ar: 'مسح نتائجي من هذا المتصفح', en: 'Delete my results from this browser' })}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ parts */

function EvidenceChips({ ev }: { ev: DomainEvidence }) {
  const { t } = useApp()
  return (
    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
      <div>
        <dt className="text-dga-muted">{t({ ar: 'التقدير الذاتي', en: 'Self-rating' })}</dt>
        <dd className="font-semibold text-dga-black">
          <Num>{`${ev.selfScore.toFixed(1)} / 4`}</Num>
        </dd>
      </div>
      <div>
        <dt className="text-dga-muted">{t({ ar: 'موقف الحكم', en: 'Scenario' })}</dt>
        <dd className="font-semibold text-dga-black">
          {ev.scenarioScore !== undefined ? (
            <Num>{`${ev.scenarioScore} / 3`}</Num>
          ) : (
            t({ ar: 'لا موقف', en: 'None' })
          )}
        </dd>
      </div>
      <div>
        <dt className="text-dga-muted">{t({ ar: 'التحقق المعرفي', en: 'Knowledge check' })}</dt>
        <dd className="font-semibold text-dga-black">
          <KnowledgeText e={ev} />
        </dd>
      </div>
      <div>
        <dt className="text-dga-muted">{t({ ar: 'المستهدف', en: 'Target' })}</dt>
        <dd className="font-semibold text-dga-amber-tx">{t(levelForTarget(ev.target).name)}</dd>
      </div>
    </dl>
  )
}

function PriorityCard({ p, ev, onDetails }: { p: Priority; ev: DomainEvidence; onDetails: () => void }) {
  const { t } = useApp()
  return (
    <li className="glass flex flex-col p-5" data-domain={p.domainId}>
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-dga-green text-sm font-bold text-white" aria-hidden>
          {p.rank}
        </span>
        <div className="min-w-0">
          <h3 className="font-bold leading-snug text-dga-black">
            <span className="sr-only">{t({ ar: `الأولوية ${p.rank}: `, en: `Priority ${p.rank}: ` })}</span>
            {t(p.domainName)}
          </h3>
          <span className={`mt-1.5 inline-block rounded-pill px-2.5 py-0.5 text-tag font-bold ${reasonStyle[p.reason]}`}>{t(reasonLabel[p.reason])}</span>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-dga-ink">{t(p.text)}</p>
      <EvidenceChips ev={ev} />
      <button type="button" onClick={onDetails} className="no-print mt-4 self-start text-xs font-semibold text-dga-green-dark underline-offset-4 hover:underline" aria-controls="domain-detail">
        {t({ ar: 'تفاصيل المجال', en: 'Domain details' })}
      </button>
    </li>
  )
}

function DomainDetail({ ev, domain, rec, prev, prio }: { ev: DomainEvidence; domain: Domain; rec: ResultRecord; prev: ResultRecord | null; prio?: Priority }) {
  const { t } = useApp()
  const sts = statementsByDomain(domain.id)
  const sc = isCategoryId(rec.trackId) ? scenarioFor(rec.trackId, domain.id) : undefined
  const choice = sc && rec.scenarioChoices ? rec.scenarioChoices[sc.id] : undefined
  const chosen = sc && choice !== undefined ? sc.options[choice] : undefined
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-bold text-dga-black">
          <Icon name={domain.icon} className="h-5 w-5 text-dga-green" />
          {t(domain.name)}
        </h3>
        <span className="chip-ok">
          {t({ ar: 'مستواك: ', en: 'Your level: ' })}
          {t(levelForScore(ev.selfScore).name)}
        </span>
      </div>
      <p className="mt-2 text-xs text-dga-muted">
        {prio ? (
          <>
            {t({ ar: 'الأولوية ', en: 'Priority ' })}
            <Num>{prio.rank}</Num> · {t(reasonLabel[prio.reason])}
          </>
        ) : (
          t(reasonLabel[ev.reason])
        )}
        {prev && prev.scores[domain.id] !== undefined && (
          <>
            {' · '}
            {t({ ar: 'التغيّر عن السابق ', en: 'Change vs previous ' })}
            <Signed value={ev.selfScore - prev.scores[domain.id]} />
          </>
        )}
      </p>
      <EvidenceChips ev={ev} />

      <h4 className="mt-4 text-xs font-bold text-dga-ink">{t({ ar: 'إجاباتك عن العبارات', en: 'Your statement answers' })}</h4>
      <ul className="mt-2 space-y-1.5">
        {sts.map((s) => {
          const v = rec.answers[s.id]
          const opt = scaleOptions.find((o) => o.value === v)
          return (
            <li key={s.id} className="text-xs leading-relaxed">
              <span className="text-dga-ink">{t(s.text)}</span>{' '}
              <span className="font-semibold text-dga-green-dark">
                — {opt ? t(opt.label) : t({ ar: 'لم تُحفظ الإجابة', en: 'answer not saved' })}
              </span>
            </li>
          )
        })}
      </ul>

      <h4 className="mt-4 text-xs font-bold text-dga-ink">{t({ ar: 'موقف الحكم', en: 'Judgment scenario' })}</h4>
      {ev.scenarioScore === undefined ? (
        <p className="mt-1 text-xs text-dga-muted">{t({ ar: 'لا توجد إجابة موقف في هذا المجال.', en: 'No scenario answer in this domain.' })}</p>
      ) : (
        <div className="mt-1 text-xs leading-relaxed">
          <p>
            {t({ ar: 'درجة تصرفك ', en: 'Your response scored ' })}
            <Num>{ev.scenarioScore}</Num> {t({ ar: 'من', en: 'of' })} <Num>3</Num>
            {chosen && <> — «{t(chosen.text)}»</>}
          </p>
          {chosen && <p className="mt-1 text-dga-muted">{t(chosen.rationale)}</p>}
        </div>
      )}

      <h4 className="mt-4 text-xs font-bold text-dga-ink">{t({ ar: 'التحقق المعرفي', en: 'Knowledge check' })}</h4>
      <p className="mt-1 text-xs">
        <KnowledgeText e={ev} />
        {ev.agreement && <span className={`ms-2 ${agreementStyle[ev.agreement]}`}>· {t(agreementLabel[ev.agreement])}</span>}
      </p>
    </div>
  )
}
