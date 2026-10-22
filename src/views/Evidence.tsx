import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInRouterContext, useLocation } from 'react-router-dom'
import { useApp } from '../store'
import type { L } from '../data/types'
import { claims } from '../data/claims'
import type { Claim, ClaimKind, Confidence } from '../data/claims'
import { REVIEW_STALE_MONTHS } from '../data/claims/method'
import { isOutdatedSource, outdatedLabel, referenceSourceKindLabel, referenceSources, SOURCE_CURRENT_FROM } from '../data/claims/sources'
import type { ReferenceSource } from '../data/claims/sources'
import { BidiValue, ClaimText, confHint, confLabel, confRank, formatClaimDate, kindHint, kindLabel } from '../components/Claim'

/**
 * «سجل الأدلة / Evidence register» (packet P5a): every registered claim in one filterable,
 * sortable table. Route: /:lang/evidence (wired by the leader). Rows are anchored as #ev-<claim id>.
 * Source policy (DECISION §5-ب): each row shows its source year, and sources older than
 * SOURCE_CURRENT_FROM carry «قديم — يُحدَّث». The page ends with the approved reference sources.
 */

const KINDS: ClaimKind[] = ['official', 'international', 'survey', 'self-report', 'editorial']
const CONFS: Confidence[] = ['high', 'medium', 'low']

const PACKETS: Record<string, L> = {
  gov: { ar: 'الجهات والقطاعات', en: 'Entities & sectors' },
  standards: { ar: 'المعايير', en: 'Standards' },
  method: { ar: 'المنهجية', en: 'Methodology' },
  future: { ar: 'مهارات المستقبل', en: 'Future skills' },
  tech: { ar: 'التقنيات', en: 'Technologies' },
  leaders: { ar: 'للقادة والفرق', en: 'Leaders & teams' },
}

type SortKey = 'text' | 'value' | 'scope' | 'source' | 'year' | 'kind' | 'confidence' | 'reviewed'
type Currency = '' | 'outdated' | 'undated' | 'current'
type SortDir = 'asc' | 'desc'

const packetOf = (id: string) => id.split('-')[0]

/** Lower-case, strip Arabic diacritics and tatweel, unify alef/ya/ta-marbuta forms. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
}

function haystack(c: Claim): string {
  return normalize(
    [
      c.id,
      c.text.ar,
      c.text.en,
      c.value.ar,
      c.value.en,
      c.unit?.ar,
      c.unit?.en,
      c.scope?.ar,
      c.scope?.en,
      c.period,
      c.source.title.ar,
      c.source.title.en,
      c.source.publisher.ar,
      c.source.publisher.en,
      c.source.year ? String(c.source.year) : undefined,
      c.caveat?.ar,
      c.caveat?.en,
    ]
      .filter(Boolean)
      .join(' • ')
  )
}

function leadingNumber(s: string): number {
  const m = /-?\d[\d,]*(?:\.\d+)?/.exec(s)
  return m ? Number(m[0].replace(/,/g, '')) : Number.NaN
}

/** reviewedOn older than REVIEW_STALE_MONTHS before `today`. */
export function isStale(reviewedOn: string, today: Date = new Date()): boolean {
  const d = new Date(`${reviewedOn}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return true
  const limit = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - REVIEW_STALE_MONTHS, today.getUTCDate()))
  return d.getTime() < limit.getTime()
}

const fmt = (n: number) => n.toLocaleString('en-US')

/** Arabic counted noun for «ادعاء» after a number (tamyiz): 3–10 plural, 11–99 accusative singular, else singular. */
function arClaimNoun(n: number): string {
  const r = new Intl.PluralRules('ar').select(n)
  if (r === 'few') return 'ادعاءات'
  if (r === 'many') return 'ادعاءً'
  return 'ادعاء'
}

/** Same rule for «مصدر». */
function arSourceNoun(n: number): string {
  const r = new Intl.PluralRules('ar').select(n)
  if (r === 'few') return 'مصادر'
  if (r === 'many') return 'مصدرًا'
  return 'مصدر'
}

/* -------------------------------------------------- hash → row anchoring */

function useHashTarget(onTarget: (id: string) => void) {
  const inRouter = useInRouterContext()
  return inRouter ? <RouterHash onTarget={onTarget} /> : <WindowHash onTarget={onTarget} />
}

function RouterHash({ onTarget }: { onTarget: (id: string) => void }) {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash.startsWith('#ev-')) onTarget(decodeURIComponent(hash.slice(4)))
  }, [hash, onTarget])
  return null
}

function WindowHash({ onTarget }: { onTarget: (id: string) => void }) {
  useEffect(() => {
    const read = () => {
      const h = window.location.hash
      if (h.startsWith('#ev-')) onTarget(decodeURIComponent(h.slice(4)))
    }
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [onTarget])
  return null
}

/* ------------------------------------------------------------------ cells */

function SourceCell({ c }: { c: Claim }) {
  const { t } = useApp()
  const s = c.source
  return (
    <>
      {s.url ? (
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-dga-green-dark underline-offset-2 hover:underline">
          {t(s.title)}
          <span aria-hidden> ↗</span>
          <span className="sr-only">{t({ ar: '(يفتح في نافذة جديدة)', en: '(opens in a new tab)' })}</span>
        </a>
      ) : (
        <span className="font-semibold text-dga-black">{t(s.title)}</span>
      )}
      <span className="block text-dga-muted">{t(s.publisher)}</span>
      {s.locator ? <span className="block text-dga-muted">{s.locator}</span> : null}
      {s.access === 'internal' ? (
        <span className="mt-1 inline-block text-[11px] font-semibold text-dga-amber-tx">{t({ ar: 'سجل داخلي غير منشور', en: 'Internal, unpublished record' })}</span>
      ) : null}
    </>
  )
}

/** «قديم — يُحدَّث»: a source published before the policy's currency year (DECISION §5-ب). */
function OutdatedChip() {
  const { t } = useApp()
  return <span className="chip whitespace-nowrap border-dga-amber/60 bg-amber-50 text-dga-amber-tx">{t(outdatedLabel)}</span>
}

function SourceYearCell({ year }: { year?: number }) {
  const { t } = useApp()
  if (typeof year !== 'number')
    return (
      <span className="text-dga-muted" title={t({ ar: 'سنة الإصدار غير محددة في المصدر', en: 'The source gives no publication year' })}>
        —<span className="sr-only">{t({ ar: 'سنة غير محددة', en: 'Year not stated' })}</span>
      </span>
    )
  return (
    <>
      <span className="block font-semibold tabular-nums text-dga-black" dir="ltr">
        {year}
      </span>
      {isOutdatedSource(year) ? (
        <span className="mt-1 block">
          <OutdatedChip />
        </span>
      ) : null}
    </>
  )
}

function KindChip({ kind }: { kind: ClaimKind }) {
  const { t } = useApp()
  return <span className="chip whitespace-nowrap text-dga-ink">{t(kindLabel[kind])}</span>
}

const confTone: Record<Confidence, string> = {
  high: 'chip-ok',
  medium: 'chip-info',
  low: 'chip border-dga-amber/60 bg-amber-50 text-dga-amber-tx',
}

function ConfChip({ level }: { level: Confidence }) {
  const { t } = useApp()
  const n = confRank[level]
  return (
    <span className={`${confTone[level]} whitespace-nowrap`}>
      {t(confLabel[level])}
      <span className="inline-flex gap-[2px]" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={`inline-block h-1.5 w-1.5 rounded-full ${i <= n ? 'bg-current' : 'border border-current opacity-50'}`} />
        ))}
      </span>
    </span>
  )
}

function ReviewedCell({ c, stale }: { c: Claim; stale: boolean }) {
  const { t, lang } = useApp()
  return (
    <>
      <time dateTime={c.reviewedOn} className="whitespace-nowrap">
        {formatClaimDate(c.reviewedOn, lang)}
      </time>
      {stale ? (
        <span className="mt-1 block text-[11px] font-semibold text-dga-amber-tx">{t({ ar: 'يحتاج مراجعة', en: 'Needs review' })}</span>
      ) : null}
    </>
  )
}

/* ------------------------------------------------------------------- page */

export default function Evidence() {
  const { t, lang } = useApp()
  const [kind, setKind] = useState<'' | ClaimKind>('')
  const [conf, setConf] = useState<'' | Confidence>('')
  const [packet, setPacket] = useState('')
  const [currency, setCurrency] = useState<Currency>('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null)
  const [target, setTarget] = useState<string | null>(null)

  const today = useMemo(() => new Date(), [])
  const index = useMemo(
    () => claims.map((c) => ({ c, hay: haystack(c), stale: isStale(c.reviewedOn, today), outdated: isOutdatedSource(c.source.year) })),
    [today]
  )
  const packets = useMemo(() => [...new Set(claims.map((c) => packetOf(c.id)))], [])

  const rows = useMemo(() => {
    const q = normalize(query.trim())
    const terms = q ? q.split(/\s+/) : []
    const year = (c: Claim) => c.source.year
    let out = index.filter(
      ({ c, hay, outdated }) =>
        (!kind || c.kind === kind) &&
        (!conf || c.confidence === conf) &&
        (!packet || packetOf(c.id) === packet) &&
        (!currency ||
          (currency === 'outdated' && outdated) ||
          (currency === 'undated' && year(c) === undefined) ||
          (currency === 'current' && year(c) !== undefined && !outdated)) &&
        terms.every((term) => hay.includes(term))
    )
    if (sort) {
      const dir = sort.dir === 'asc' ? 1 : -1
      const cmpText = (a: string, b: string) => a.localeCompare(b, lang)
      out = [...out].sort((A, B) => {
        const a = A.c
        const b = B.c
        switch (sort.key) {
          case 'text':
            return dir * cmpText(t(a.text), t(b.text))
          case 'value': {
            const na = leadingNumber(a.value.en)
            const nb = leadingNumber(b.value.en)
            if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return dir * (na - nb)
            if (Number.isNaN(na) !== Number.isNaN(nb)) return Number.isNaN(na) ? 1 : -1
            return dir * cmpText(t(a.value), t(b.value))
          }
          case 'scope':
            return dir * cmpText(a.scope ? t(a.scope) : a.period ?? '', b.scope ? t(b.scope) : b.period ?? '')
          case 'source':
            return dir * cmpText(t(a.source.title), t(b.source.title))
          case 'year': {
            const ya = a.source.year
            const yb = b.source.year
            if (ya === undefined || yb === undefined) return ya === yb ? 0 : ya === undefined ? 1 : -1
            return dir * (ya - yb)
          }
          case 'kind':
            return dir * (KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind))
          case 'confidence':
            return dir * (confRank[b.confidence] - confRank[a.confidence])
          case 'reviewed':
            return dir * a.reviewedOn.localeCompare(b.reviewedOn)
          default:
            return 0
        }
      })
    }
    return out
  }, [index, kind, conf, packet, currency, query, sort, lang, t])

  const filtered = kind !== '' || conf !== '' || packet !== '' || currency !== '' || query.trim() !== ''
  const reset = () => {
    setKind('')
    setConf('')
    setPacket('')
    setCurrency('')
    setQuery('')
  }

  // anchor: /:lang/evidence#ev-<id> scrolls to that claim and highlights it
  const onTarget = useCallback((id: string) => setTarget(id), [])
  const hashWatcher = useHashTarget(onTarget)
  useEffect(() => {
    if (!target) return
    const t1 = window.setTimeout(() => {
      const candidates = [document.getElementById(`ev-${target}`), document.getElementById(`evm-${target}`)]
      const el = candidates.find((x) => x && x.offsetParent !== null) ?? candidates.find(Boolean)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        ;(el as HTMLElement).focus({ preventScroll: true })
      }
    }, 60)
    return () => window.clearTimeout(t1)
  }, [target])

  const toggleSort = (key: SortKey) =>
    setSort((s) => (!s || s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null))

  const ariaSort = (key: SortKey): 'ascending' | 'descending' | 'none' =>
    sort?.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'

  const cols: { key: SortKey; label: L; className?: string }[] = [
    { key: 'text', label: { ar: 'الادعاء', en: 'Claim' }, className: 'min-w-[18rem]' },
    { key: 'value', label: { ar: 'القيمة', en: 'Value' } },
    { key: 'scope', label: { ar: 'النطاق والفترة', en: 'Scope & period' }, className: 'min-w-[11rem]' },
    { key: 'source', label: { ar: 'المصدر', en: 'Source' }, className: 'min-w-[13rem]' },
    { key: 'year', label: { ar: 'سنة المصدر', en: 'Source year' } },
    { key: 'kind', label: { ar: 'نوع المصدر', en: 'Source type' } },
    { key: 'confidence', label: { ar: 'الثقة', en: 'Confidence' } },
    { key: 'reviewed', label: { ar: 'آخر مراجعة', en: 'Last reviewed' } },
  ]

  const byKind = KINDS.map((k) => ({ k, n: claims.filter((c) => c.kind === k).length }))
  const staleCount = index.filter((x) => x.stale).length
  const outdatedCount = index.filter((x) => x.outdated).length

  const selectCls =
    'w-full rounded-btn border border-dga-line bg-white px-3 py-2 text-sm text-dga-ink focus:border-dga-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green/40'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {hashWatcher}
      <header className="max-w-3xl">
        <p className="eyebrow">{t({ ar: 'المنهجية والمصادر', en: 'Method & sources' })}</p>
        <h1 className="mt-2 text-3xl font-bold text-dga-green-deep sm:text-4xl">{t({ ar: 'سجل الأدلة', en: 'Evidence register' })}</h1>
        <p className="mt-4 leading-relaxed text-dga-ink">
          {t({
            ar: 'قاعدتنا: لا رقم بلا مصدر. كل رقم يظهر في الأداة مسجل هنا ادعاءً له نص وقيمة ونطاق وفترة، ومصدر بعنوانه وناشره، ونوع المصدر، ودرجة الثقة، وتاريخ آخر مراجعة. وحيثما ظهر الرقم في الأداة تفتح شارته التفاصيل نفسها.',
            en: 'Our rule: no number without a source. Every figure in the tool is registered here as a claim with its sentence, value, scope and period, a source with title and publisher, the source type, a confidence level and the last review date. Wherever the figure appears in the tool, its badge opens the same details.',
          })}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-dga-muted">
          <ClaimText
            text={t({
              ar: 'نوع المصدر غير الثقة: السجل الرسمي دليل قوي على ما سُجّل، وضعيف على احتياج لم يُسجّل. ويُوسم الادعاء بأنه يحتاج مراجعة إذا مضى على آخر مراجعة له {{method-review-stale}}.',
              en: 'Source type is not confidence: an official record is strong evidence of what was recorded and weak evidence of a need that was not. A claim is flagged as needing review once {{method-review-stale}} have passed since its last review.',
            })}
          />
        </p>
        <p className="mt-2 text-sm leading-relaxed text-dga-muted">
          {lang === 'ar' ? (
            <>
              نعتمد المصادر العلمية والرسمية المعترف بها والمحدَّثة، ونفضّل ما صدر بين <span dir="ltr">2024</span> و<span dir="ltr">2026</span>. ويُوسم كل مصدر صدر قبل{' '}
              <span dir="ltr">{SOURCE_CURRENT_FROM}</span> بشارة <OutdatedChip /> ويُراجع في الدورة التالية.
            </>
          ) : (
            <>
              We rely on recognised, current scientific and official sources, preferably published in 2024–2026. Any source published before {SOURCE_CURRENT_FROM} is marked{' '}
              <OutdatedChip /> and reviewed in the next cycle.
            </>
          )}
        </p>
      </header>

      {/* legend */}
      <section aria-labelledby="ev-legend" className="mt-8 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <h2 id="ev-legend" className="sr-only">
          {t({ ar: 'دليل الأنواع ودرجات الثقة', en: 'Source types and confidence levels' })}
        </h2>
        <div className="glass p-5">
          <p className="text-xs font-semibold text-dga-muted">{t({ ar: 'أنواع المصادر', en: 'Source types' })}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {byKind.map(({ k, n }) => (
              <li key={k} className="text-xs leading-relaxed text-dga-ink">
                <span className="flex items-center gap-2">
                  <KindChip kind={k} />
                  <span className="font-semibold tabular-nums text-dga-muted" dir="ltr">
                    {fmt(n)}
                  </span>
                </span>
                <span className="mt-1 block text-dga-muted">{t(kindHint[k])}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass p-5">
          <p className="text-xs font-semibold text-dga-muted">{t({ ar: 'درجات الثقة', en: 'Confidence levels' })}</p>
          <ul className="mt-3 space-y-3">
            {CONFS.map((c) => (
              <li key={c} className="text-xs leading-relaxed">
                <ConfChip level={c} />
                <span className="mt-1 block text-dga-muted">{t(confHint[c])}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* filters */}
      <section aria-labelledby="ev-filters" className="mt-8 rounded-card border border-dga-line bg-white p-5 print:hidden">
        <h2 id="ev-filters" className="sr-only">
          {t({ ar: 'تصفية السجل', en: 'Filter the register' })}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block text-xs font-semibold text-dga-muted">
            {t({ ar: 'بحث', en: 'Search' })}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t({ ar: 'كلمة أو رقم أو مصدر', en: 'A word, figure or source' })}
              className={`${selectCls} mt-1.5`}
            />
          </label>
          <label className="block text-xs font-semibold text-dga-muted">
            {t({ ar: 'نوع المصدر', en: 'Source type' })}
            <select value={kind} onChange={(e) => setKind(e.target.value as '' | ClaimKind)} className={`${selectCls} mt-1.5`}>
              <option value="">{t({ ar: 'كل الأنواع', en: 'All types' })}</option>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {t(kindLabel[k])}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-dga-muted">
            {t({ ar: 'الثقة', en: 'Confidence' })}
            <select value={conf} onChange={(e) => setConf(e.target.value as '' | Confidence)} className={`${selectCls} mt-1.5`}>
              <option value="">{t({ ar: 'كل الدرجات', en: 'All levels' })}</option>
              {CONFS.map((c) => (
                <option key={c} value={c}>
                  {t(confLabel[c])}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-dga-muted">
            {t({ ar: 'القسم', en: 'Section' })}
            <select value={packet} onChange={(e) => setPacket(e.target.value)} className={`${selectCls} mt-1.5`}>
              <option value="">{t({ ar: 'كل الأقسام', en: 'All sections' })}</option>
              {packets.map((p) => (
                <option key={p} value={p}>
                  {PACKETS[p] ? t(PACKETS[p]) : p}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-dga-muted">
            {t({ ar: 'حداثة المصدر', en: 'Source currency' })}
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={`${selectCls} mt-1.5`}>
              <option value="">{t({ ar: 'كل السنوات', en: 'All years' })}</option>
              <option value="current">{lang === 'ar' ? `من ${SOURCE_CURRENT_FROM} فأحدث` : `${SOURCE_CURRENT_FROM} or later`}</option>
              <option value="outdated">{t(outdatedLabel)}</option>
              <option value="undated">{t({ ar: 'سنة غير محددة', en: 'Year not stated' })}</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-dga-ink" aria-live="polite">
            {lang === 'ar' ? (
              <>
                يعرض <span className="font-bold tabular-nums">{fmt(rows.length)}</span> من <span className="font-bold tabular-nums">{fmt(claims.length)}</span> {arClaimNoun(claims.length)}
                {staleCount > 0 ? (
                  <>
                    {' · '}
                    <span className="font-semibold text-dga-amber-tx">
                      يحتاج المراجعة: <span className="tabular-nums">{fmt(staleCount)}</span>
                    </span>
                  </>
                ) : null}
                {outdatedCount > 0 ? (
                  <>
                    {' · '}
                    <span className="font-semibold text-dga-amber-tx">
                      مصدره قديم: <span className="tabular-nums">{fmt(outdatedCount)}</span>
                    </span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                Showing <span className="font-bold tabular-nums">{fmt(rows.length)}</span> of <span className="font-bold tabular-nums">{fmt(claims.length)}</span> claims
                {staleCount > 0 ? (
                  <>
                    {' · '}
                    <span className="font-semibold text-dga-amber-tx">
                      Needs review: <span className="tabular-nums">{fmt(staleCount)}</span>
                    </span>
                  </>
                ) : null}
                {outdatedCount > 0 ? (
                  <>
                    {' · '}
                    <span className="font-semibold text-dga-amber-tx">
                      Outdated source: <span className="tabular-nums">{fmt(outdatedCount)}</span>
                    </span>
                  </>
                ) : null}
              </>
            )}
          </p>
          {filtered && (
            <button type="button" onClick={reset} className="btn-ghost px-4 py-2 text-sm">
              {t({ ar: 'مسح التصفية', en: 'Clear filters' })}
            </button>
          )}
        </div>
      </section>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-card border border-dashed border-dga-line p-8 text-center text-sm text-dga-muted">
          {t({ ar: 'لا ادعاءات تطابق التصفية الحالية.', en: 'No claims match the current filters.' })}
        </p>
      ) : (
        <>
          {/* table (md and up) */}
          <div className="mt-6 hidden overflow-x-auto rounded-card border border-dga-line bg-white md:block">
            <table className="w-full min-w-[72rem] text-[13px] leading-relaxed">
              <caption className="sr-only">{t({ ar: 'سجل الأدلة: كل ادعاءات الأداة', en: 'Evidence register: every claim in the tool' })}</caption>
              <thead className="bg-dga-bg text-xs text-dga-muted">
                <tr>
                  {cols.map((col) => (
                    <th key={col.key} scope="col" aria-sort={ariaSort(col.key)} className={`p-0 text-start font-semibold ${col.className ?? ''}`}>
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="flex w-full items-center gap-1 px-3 py-3 text-start hover:text-dga-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dga-green"
                      >
                        {t(col.label)}
                        <span aria-hidden className="text-[10px]">
                          {sort?.key === col.key ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ c, stale }) => (
                  <tr
                    key={c.id}
                    id={`ev-${c.id}`}
                    tabIndex={-1}
                    className={`scroll-mt-24 border-t border-dga-line align-top focus:outline-none ${
                      target === c.id ? 'bg-amber-50 ring-2 ring-inset ring-dga-amber' : ''
                    }`}
                  >
                    <td className="p-3">
                      <span className="block font-semibold text-dga-black">{t(c.text)}</span>
                      {c.caveat ? <span className="mt-1 block text-xs text-dga-muted">{t(c.caveat)}</span> : null}
                      <span className="mt-1 block font-mono text-[10.5px] text-dga-muted" dir="ltr">
                        {c.id}
                      </span>
                    </td>
                    <td className="p-3">
                      <BidiValue text={t(c.value)} className="block whitespace-nowrap font-bold tabular-nums text-dga-green-dark" />
                      {c.unit ? <span className="block text-xs text-dga-muted">{t(c.unit)}</span> : null}
                    </td>
                    <td className="p-3">
                      {c.scope ? <span className="block">{t(c.scope)}</span> : null}
                      {c.period ? (
                        <span className="block text-xs text-dga-muted" dir="ltr">
                          {c.period}
                        </span>
                      ) : null}
                      {!c.scope && !c.period ? <span className="text-dga-muted">—</span> : null}
                    </td>
                    <td className="p-3">
                      <SourceCell c={c} />
                    </td>
                    <td className="p-3">
                      <SourceYearCell year={c.source.year} />
                    </td>
                    <td className="p-3">
                      <KindChip kind={c.kind} />
                    </td>
                    <td className="p-3">
                      <ConfChip level={c.confidence} />
                    </td>
                    <td className="p-3">
                      <ReviewedCell c={c} stale={stale} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* cards (below md) */}
          <ol className="mt-6 space-y-3 md:hidden">
            {rows.map(({ c, stale }) => (
              <li
                key={c.id}
                id={`evm-${c.id}`}
                tabIndex={-1}
                className={`scroll-mt-24 rounded-card border border-dga-line bg-white p-4 text-[13px] leading-relaxed focus:outline-none ${
                  target === c.id ? 'bg-amber-50 ring-2 ring-dga-amber' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <BidiValue text={t(c.value)} className="font-bold tabular-nums text-dga-green-dark" />
                  <ConfChip level={c.confidence} />
                </div>
                <p className="mt-2 font-semibold text-dga-black">{t(c.text)}</p>
                {c.caveat ? <p className="mt-1 text-xs text-dga-muted">{t(c.caveat)}</p> : null}
                <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-xs">
                  {(c.scope || c.period) && (
                    <>
                      <dt className="font-semibold text-dga-muted">{t({ ar: 'النطاق', en: 'Scope' })}</dt>
                      <dd>
                        {c.scope ? t(c.scope) : null}
                        {c.scope && c.period ? ' · ' : null}
                        {c.period ? <span dir="ltr">{c.period}</span> : null}
                      </dd>
                    </>
                  )}
                  <dt className="font-semibold text-dga-muted">{t({ ar: 'المصدر', en: 'Source' })}</dt>
                  <dd>
                    <SourceCell c={c} />
                  </dd>
                  <dt className="font-semibold text-dga-muted">{t({ ar: 'سنة المصدر', en: 'Source year' })}</dt>
                  <dd>
                    <SourceYearCell year={c.source.year} />
                  </dd>
                  <dt className="font-semibold text-dga-muted">{t({ ar: 'النوع', en: 'Type' })}</dt>
                  <dd>
                    <KindChip kind={c.kind} />
                  </dd>
                  <dt className="font-semibold text-dga-muted">{t({ ar: 'آخر مراجعة', en: 'Last reviewed' })}</dt>
                  <dd>
                    <ReviewedCell c={c} stale={stale} />
                  </dd>
                </dl>
              </li>
            ))}
          </ol>
        </>
      )}

      <ReferenceSources />
    </div>
  )
}

/* ------------------------------------------------- approved reference sources */

function ReferenceYear({ s }: { s: ReferenceSource }) {
  const { t } = useApp()
  if (s.yearLabel) return <span className="whitespace-nowrap">{t(s.yearLabel)}</span>
  if (typeof s.year === 'number')
    return (
      <span className="whitespace-nowrap tabular-nums" dir="ltr">
        {s.year}
      </span>
    )
  return <span className="text-dga-muted">—</span>
}

function ReferenceLink({ s }: { s: ReferenceSource }) {
  const { t } = useApp()
  let host = s.url
  try {
    host = new URL(s.url).hostname.replace(/^www\./, '')
  } catch {
    /* keep the raw url */
  }
  return (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all font-semibold text-dga-green-dark underline-offset-2 hover:underline">
      <span dir="ltr">{host}</span>
      <span aria-hidden>↗</span>
      <span className="sr-only">{`${t(s.title)} ${t({ ar: '(يفتح في نافذة جديدة)', en: '(opens in a new tab)' })}`}</span>
    </a>
  )
}

/** «المصادر المرجعية المعتمدة»: what the tool should rest on from now on (audit 2026-10-22, DECISION §5-ب). */
function ReferenceSources() {
  const { t, lang } = useApp()
  const n = referenceSources.length
  return (
    <section aria-labelledby="ev-refs" className="mt-14 border-t border-dga-line pt-8">
      <h2 id="ev-refs" className="text-2xl font-bold text-dga-green-deep">
        {t({ ar: 'المصادر المرجعية المعتمدة', en: 'Approved reference sources' })}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dga-ink">
        {lang === 'ar'
          ? `${n} ${arSourceNoun(n)} علميًا ورسميًا معترفًا به ومحدَّثًا ينبغي أن تستند إليه الأداة من الآن: منظمات دولية، وجهات معايير، وجهات وطنية، وبيوت خبرة، وبحوث محكّمة. لا تُقبل المدونات ولا صفحات تسويق المزودين ولا ادعاءات المنصات عن نفسها سندًا لحقيقة.`
          : `${n} recognised, current scientific and official sources the tool should rest on from now on: international organizations, standards bodies, national authorities, advisory firms and peer-reviewed research. Blogs, vendor marketing pages and platforms’ claims about themselves are not accepted as support for a fact.`}
      </p>

      <div className="mt-5 overflow-x-auto rounded-card border border-dga-line bg-white">
        <table className="w-full min-w-[46rem] text-[13px] leading-relaxed">
          <caption className="sr-only">{t({ ar: 'المصادر المرجعية المعتمدة', en: 'Approved reference sources' })}</caption>
          <thead className="bg-dga-bg text-xs text-dga-muted">
            <tr>
              <th scope="col" className="px-3 py-3 text-start font-semibold">{t({ ar: 'المصدر', en: 'Source' })}</th>
              <th scope="col" className="px-3 py-3 text-start font-semibold">{t({ ar: 'الناشر', en: 'Publisher' })}</th>
              <th scope="col" className="px-3 py-3 text-start font-semibold">{t({ ar: 'السنة', en: 'Year' })}</th>
              <th scope="col" className="px-3 py-3 text-start font-semibold">{t({ ar: 'نوع المصدر', en: 'Source type' })}</th>
              <th scope="col" className="px-3 py-3 text-start font-semibold">{t({ ar: 'الرابط', en: 'Link' })}</th>
            </tr>
          </thead>
          <tbody>
            {referenceSources.map((s) => (
              <tr key={s.id} id={s.id} className="border-t border-dga-line align-top">
                <th scope="row" className="p-3 text-start font-normal">
                  <span className="block font-semibold text-dga-black">{t(s.title)}</span>
                  <span className="mt-0.5 block text-xs text-dga-muted">{t(s.covers)}</span>
                </th>
                <td className="p-3 text-dga-ink">{t(s.publisher)}</td>
                <td className="p-3">
                  <ReferenceYear s={s} />
                  {isOutdatedSource(s.year) ? (
                    <span className="mt-1 block">
                      <OutdatedChip />
                    </span>
                  ) : null}
                </td>
                <td className="p-3">
                  <span className="chip whitespace-nowrap text-dga-ink">{t(referenceSourceKindLabel[s.kind])}</span>
                </td>
                <td className="p-3">
                  <ReferenceLink s={s} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
