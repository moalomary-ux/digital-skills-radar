import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent, ReactNode } from 'react'
import { Link, useInRouterContext } from 'react-router-dom'
import { useApp } from '../store'
import { claimById } from '../data/claims'
import type { Claim as ClaimRecord, ClaimKind, Confidence } from '../data/claims'
import type { L, Lang } from '../data/types'
import { isOutdatedSource, outdatedLabel } from '../data/claims/sources'

/* ------------------------------------------------------------------ labels */

export const kindLabel: Record<ClaimKind, L> = {
  official: { ar: 'مصدر رسمي', en: 'Official source' },
  international: { ar: 'تقرير أو إطار دولي', en: 'International report or framework' },
  academic: { ar: 'بحث محكّم', en: 'Peer-reviewed' },
  expert: { ar: 'بيت خبرة', en: 'Expert house' },
  survey: { ar: 'استطلاع', en: 'Survey' },
  'self-report': { ar: 'بيانات ذاتية الإبلاغ', en: 'Self-reported data' },
  editorial: { ar: 'تحريري', en: 'Editorial' },
}

/** One-line meaning of each kind (evidence register legend). */
export const kindHint: Record<ClaimKind, L> = {
  official: {
    ar: 'سجل أو إحصاء صادر عن جهة رسمية؛ قد يكون منشورًا أو سجلًا إداريًا داخليًا (يُذكر ذلك صراحة).',
    en: 'A record or statistic from an official body; it may be published or an internal administrative record (stated explicitly).',
  },
  international: {
    ar: 'تقرير أو إطار مرجعي صادر عن منظمة دولية أو جهة معيارية.',
    en: 'A report or reference framework from an international organization or standards body.',
  },
  academic: {
    ar: 'بحث منشور في مجلة محكّمة أو صادر عن جامعة أو مركز بحثي جامعي؛ يصف عينته ومنهجه لا كل الحالات.',
    en: 'Research published in a peer-reviewed journal or by a university or university research centre; it describes its own sample and method, not every case.',
  },
  expert: {
    ar: 'تقرير أو توقع من بيت خبرة معترف به (مثل غارتنر وماكنزي وديلويت)؛ تحليل مهني لا قياس رسمي.',
    en: 'A report or forecast from a recognized expert house (such as Gartner, McKinsey or Deloitte); professional analysis, not an official measurement.',
  },
  survey: {
    ar: 'نتيجة استطلاع لعينة محددة؛ تصف من أجابوا لا الجميع.',
    en: 'A result from a defined survey sample; it describes respondents, not everyone.',
  },
  'self-report': {
    ar: 'رقم تنشره جهة عن نفسها أو عن منصتها؛ لم يتحقق منه طرف مستقل.',
    en: 'A figure an organization publishes about itself or its platform; not independently verified.',
  },
  editorial: {
    ar: 'حكم أو قاعدة وضعها مؤلف الأداة؛ معلنة وقابلة للمراجعة، وليست قياسًا.',
    en: 'A judgment or rule set by the tool’s author; declared and reviewable, not a measurement.',
  },
}

export const confLabel: Record<Confidence, L> = {
  high: { ar: 'ثقة عالية', en: 'High confidence' },
  medium: { ar: 'ثقة متوسطة', en: 'Medium confidence' },
  low: { ar: 'ثقة منخفضة', en: 'Low confidence' },
}

export const confHint: Record<Confidence, L> = {
  high: {
    ar: 'يمكن الاستناد إليه كما هو، مع مراعاة نطاقه وفترته.',
    en: 'Can be relied on as stated, within its scope and period.',
  },
  medium: {
    ar: 'صحيح في حدود ما نعرف، لكن فيه قيد معلن أو لم يُطابَق مع النص الأصلي بعد.',
    en: 'Correct as far as we know, but it carries a declared limit or has not yet been matched to the original text.',
  },
  low: {
    ar: 'افتراض أو رقم ضعيف السند؛ يُستأنس به ولا يُبنى عليه قرار.',
    en: 'An assumption or weakly supported figure; indicative only, not a basis for decisions.',
  },
}

export const confRank: Record<Confidence, number> = { high: 3, medium: 2, low: 1 }

const ui = {
  details: { ar: 'اعرض المصدر والتفاصيل', en: 'Show source and details' },
  scope: { ar: 'النطاق', en: 'Scope' },
  period: { ar: 'الفترة', en: 'Period' },
  source: { ar: 'المصدر', en: 'Source' },
  locator: { ar: 'الموضع', en: 'Locator' },
  year: { ar: 'سنة المصدر', en: 'Source year' },
  noYear: { ar: 'غير محددة', en: 'Not stated' },
  open: { ar: 'افتح المصدر', en: 'Open the source' },
  internal: { ar: 'سجل داخلي غير منشور', en: 'Internal, unpublished record' },
  kind: { ar: 'نوع المصدر', en: 'Source type' },
  confidence: { ar: 'الثقة', en: 'Confidence' },
  derivation: { ar: 'طريقة الاشتقاق', en: 'Derivation' },
  caveat: { ar: 'تنبيه', en: 'Caveat' },
  reviewed: { ar: 'آخر مراجعة', en: 'Last reviewed' },
  register: { ar: 'افتح سجل الأدلة', en: 'Open the evidence register' },
  close: { ar: 'إغلاق', en: 'Close' },
  newTab: { ar: '(يفتح في نافذة جديدة)', en: '(opens in a new tab)' },
} satisfies Record<string, L>

/* ------------------------------------------------------------- utilities */

const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** ISO date (YYYY-MM-DD or YYYY-MM) → «22 أكتوبر 2026» / "22 October 2026", always Western digits, Gregorian. */
export function formatClaimDate(iso: string, lang: Lang): string {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(iso)
  if (!m) return iso
  const month = (lang === 'ar' ? monthsAr : monthsEn)[Number(m[2]) - 1]
  if (!month) return iso
  return m[3] ? `${Number(m[3])} ${month} ${m[1]}` : `${month} ${m[1]}`
}

/** The evidence-register path for a language (and optionally the anchor of one claim). */
export function evidencePath(lang: Lang, id?: string): string {
  return `/${lang}/evidence${id ? `#ev-${id}` : ''}`
}

/**
 * A link to the evidence register. Uses the router when one is mounted, otherwise a plain anchor
 * against the deploy base (the leader wires the `/:lang/evidence` route).
 */
export function EvidenceLink({ id, children, className, onNavigate }: { id?: string; children: ReactNode; className?: string; onNavigate?: () => void }) {
  const inRouter = useInRouterContext()
  const { lang } = useApp()
  const to = evidencePath(lang, id)
  if (inRouter) {
    return (
      <Link to={to} className={className} onClick={onNavigate}>
        {children}
      </Link>
    )
  }
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  return (
    <a href={`${base}${to}`} className={className} onClick={onNavigate}>
      {children}
    </a>
  )
}

/**
 * Latin-or-digit runs: numbers, ranges, percentages and short Latin labels ("7,915", "1–2", "+195%",
 * "SFIA 1–2", "n ≥ 10"). Each run is isolated left-to-right; the value itself follows the page
 * direction, so sequences such as "0.7 · 0.3" read in the same order as the Arabic text around them.
 */
const LTR_RUN = /[A-Za-z0-9#+%][A-Za-z0-9#+%.,:\u2013\-≥≤ ]*[A-Za-z0-9%+]|[A-Za-z0-9%]/g

/** A claim value with bidi-safe numbers (Western digits stay intact and in reading order). */
export function BidiValue({ text, className }: { text: string; className?: string }) {
  const { lang } = useApp()
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(LTR_RUN)) {
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    out.push(
      <span key={at} dir="ltr">
        {m[0]}
      </span>
    )
    last = at + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return (
    <span dir={lang === 'ar' ? 'rtl' : 'ltr'} className={className}>
      {out}
    </span>
  )
}

const badgeTone: Record<Confidence, string> = {
  high: 'chip-ok',
  medium: 'chip-info',
  low: 'chip border-dga-amber/60 bg-amber-50 text-dga-amber-tx',
}

function ConfidenceDots({ level }: { level: Confidence }) {
  const n = confRank[level]
  return (
    <span className="inline-flex items-center gap-[2px]" aria-hidden>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`inline-block h-1.5 w-1.5 rounded-full ${i <= n ? 'bg-current' : 'border border-current opacity-50'}`} />
      ))}
    </span>
  )
}

/** Static badge (no popover) — used by the evidence register and legends. */
export function ClaimBadge({ kind, confidence }: { kind: ClaimKind; confidence: Confidence }) {
  const { t } = useApp()
  return (
    <span className={`${badgeTone[confidence]} whitespace-nowrap`}>
      {t(kindLabel[kind])}
      <ConfidenceDots level={confidence} />
      <span className="sr-only">{t(confLabel[confidence])}</span>
    </span>
  )
}

/* ------------------------------------------------------------- component */

interface ClaimProps {
  id: string
  /** custom rendering of the value (defaults to the registered value) */
  children?: ReactNode
  /** value only, no badge */
  bare?: boolean
  /** 'chip' shows the source type; 'icon' is a compact info button for dense tables */
  variant?: 'chip' | 'icon'
}

/**
 * Renders a registered claim's value with a source badge. The badge is a disclosure button
 * (click, Enter/Space, or keyboard focus opens it; Esc or clicking outside closes it) that shows
 * the sentence, scope, source, type, confidence, derivation, caveat, review date and a link to the
 * evidence register. Rule: no number without a registered claim.
 *
 * Usage: <Claim id="method-domains-count" /> · <Claim id="…" bare /> · <ClaimText text={t({ ar: '… {{id}} …', en: '…' })} />
 */
export default function Claim({ id, children, bare = false, variant = 'chip' }: ClaimProps) {
  const { t } = useApp()
  const c = claimById(id)
  if (!c) {
    if (import.meta.env.DEV) console.warn(`[Claim] unknown claim id: ${id}`)
    return <>{children ?? id}</>
  }
  const value = children ?? <BidiValue text={t(c.value)} className="font-semibold tabular-nums" />
  if (bare) return <>{value}</>
  return <ClaimWithPopover claim={c} value={value} variant={variant} />
}

function ClaimWithPopover({ claim: c, value, variant }: { claim: ClaimRecord; value: ReactNode; variant: 'chip' | 'icon' }) {
  const { t, lang } = useApp()
  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLSpanElement>(null)
  const openedByFocusAt = useRef(0)
  const suppressFocusOpen = useRef(false)
  const popId = `claim-pop-${useId().replace(/:/g, '')}`

  const close = useCallback((refocus: boolean) => {
    setOpen(false)
    if (refocus && btnRef.current) {
      suppressFocusOpen.current = true
      btnRef.current.focus()
    }
  }, [])

  // outside click + Esc anywhere while open
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close(wrapRef.current?.contains(document.activeElement) ?? false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  // keep the popover inside the viewport (16px gutter), in both directions
  useLayoutEffect(() => {
    if (!open) {
      setShift(0)
      return
    }
    const el = popRef.current
    if (!el || typeof window === 'undefined') return
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth || document.documentElement.clientWidth
    if (!vw || !r.width) return
    let dx = 0
    if (r.left < 16) dx = 16 - r.left
    else if (r.right > vw - 16) dx = vw - 16 - r.right
    setShift(dx)
  }, [open])

  const onFocus = (e: FocusEvent<HTMLButtonElement>) => {
    if (suppressFocusOpen.current) {
      suppressFocusOpen.current = false
      return
    }
    let keyboard = true
    try {
      keyboard = e.currentTarget.matches(':focus-visible')
    } catch {
      keyboard = true
    }
    if (keyboard && !open) {
      openedByFocusAt.current = Date.now()
      setOpen(true)
    }
  }

  const onClick = () => {
    // a click that immediately follows a focus-open keeps the popover open
    if (open && Date.now() - openedByFocusAt.current < 500) return
    setOpen((o) => !o)
  }

  const onBlur = (e: FocusEvent<HTMLSpanElement>) => {
    const next = e.relatedTarget as Node | null
    if (next && wrapRef.current?.contains(next)) return
    if (next) setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      close(true)
    }
  }

  const sep = lang === 'ar' ? '، ' : ', '
  const label = `${t(kindLabel[c.kind])}${sep}${t(confLabel[c.confidence])}: ${t(ui.details)}`
  const s = c.source

  return (
    <span ref={wrapRef} className="relative inline-flex flex-wrap items-baseline gap-x-1.5" onBlur={onBlur} onKeyDown={onKeyDown}>
      {value}
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-label={label}
        onFocus={onFocus}
        onClick={onClick}
        className={`${badgeTone[c.confidence]} cursor-pointer align-middle focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green focus-visible:ring-offset-1 print:border-0 print:px-0 ${
          variant === 'icon' ? '!px-1.5' : ''
        }`}
      >
        {variant === 'icon' ? (
          <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="7.25" y="7" width="1.5" height="5" rx=".75" fill="currentColor" />
            <circle cx="8" cy="4.6" r=".95" fill="currentColor" />
          </svg>
        ) : (
          <span className="text-[11px] leading-tight">{t(kindLabel[c.kind])}</span>
        )}
        <ConfidenceDots level={c.confidence} />
      </button>

      {open && (
        <span
          ref={popRef}
          id={popId}
          role="group"
          aria-label={t(ui.details)}
          tabIndex={-1}
          style={shift ? { transform: `translateX(${shift}px)` } : undefined}
          className="absolute start-0 top-full z-50 mt-2 block w-[min(22rem,calc(100vw-2rem))] rounded-card border border-dga-line bg-white p-4 text-start text-xs font-normal leading-relaxed text-dga-ink shadow-card-lg focus:outline-none print:hidden"
        >
          <span className="flex items-start justify-between gap-3">
            <span className="block text-sm font-semibold leading-relaxed text-dga-black">{t(c.text)}</span>
            <button
              type="button"
              onClick={() => close(true)}
              className="-mt-1 shrink-0 rounded-btn px-1.5 py-0.5 text-base leading-none text-dga-muted hover:text-dga-black focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green"
              aria-label={t(ui.close)}
            >
              <span aria-hidden>×</span>
            </button>
          </span>

          <span className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5">
            {(c.scope || c.period) && (
              <>
                <span className="font-semibold text-dga-muted">{t(ui.scope)}</span>
                <span>
                  {c.scope ? t(c.scope) : null}
                  {c.scope && c.period ? ' · ' : null}
                  {c.period ? <span dir="ltr">{c.period}</span> : null}
                </span>
              </>
            )}
            <span className="font-semibold text-dga-muted">{t(ui.source)}</span>
            <span>
              <span className="font-semibold text-dga-black">{t(s.title)}</span>
              {' — '}
              {t(s.publisher)}
              {s.locator ? <span className="block text-dga-muted">{`${t(ui.locator)}: ${s.locator}`}</span> : null}
              {s.access === 'internal' ? <span className="mt-0.5 block font-semibold text-dga-amber-tx">{t(ui.internal)}</span> : null}
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 font-semibold text-dga-green-dark underline underline-offset-2">
                  {t(ui.open)}
                  <span aria-hidden>↗</span>
                  <span className="sr-only">{t(ui.newTab)}</span>
                </a>
              ) : null}
            </span>
            <span className="font-semibold text-dga-muted">{t(ui.year)}</span>
            <span>
              {typeof s.year === 'number' ? <span dir="ltr">{s.year}</span> : <span className="text-dga-muted">{t(ui.noYear)}</span>}
              {isOutdatedSource(s.year) ? (
                <span className="ms-1.5 inline-block rounded-pill border border-dga-amber/60 bg-amber-50 px-1.5 text-[10.5px] font-semibold text-dga-amber-tx">{t(outdatedLabel)}</span>
              ) : null}
            </span>
            <span className="font-semibold text-dga-muted">{t(ui.kind)}</span>
            <span>{t(kindLabel[c.kind])}</span>
            <span className="font-semibold text-dga-muted">{t(ui.confidence)}</span>
            <span>{t(confLabel[c.confidence])}</span>
            {c.derivation ? (
              <>
                <span className="font-semibold text-dga-muted">{t(ui.derivation)}</span>
                <span>{t(c.derivation)}</span>
              </>
            ) : null}
            {c.caveat ? (
              <>
                <span className="font-semibold text-dga-muted">{t(ui.caveat)}</span>
                <span>{t(c.caveat)}</span>
              </>
            ) : null}
            <span className="font-semibold text-dga-muted">{t(ui.reviewed)}</span>
            <span>
              <time dateTime={c.reviewedOn}>{formatClaimDate(c.reviewedOn, lang)}</time>
            </span>
          </span>

          <EvidenceLink id={c.id} onNavigate={() => setOpen(false)} className="mt-3 inline-flex items-center gap-1 font-semibold text-dga-green-dark underline underline-offset-2">
            {t(ui.register)}
            <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
          </EvidenceLink>
        </span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------ rich text */

/** `{{claim-id}}`, `{{claim-id|bare}}` or `{{claim-id|icon}}` inside a translated string. */
export const CLAIM_TOKEN = /\{\{([a-z0-9][a-z0-9-]*)(?:\|(bare|icon))?\}\}/g

/** Renders a translated string, replacing `{{claim-id}}` tokens with `<Claim>` components. */
export function ClaimText({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(CLAIM_TOKEN)) {
    const at = m.index ?? 0
    if (at > last) out.push(<Fragment key={`t${last}`}>{text.slice(last, at)}</Fragment>)
    out.push(<Claim key={`c${at}`} id={m[1]} bare={m[2] === 'bare'} variant={m[2] === 'icon' ? 'icon' : 'chip'} />)
    last = at + m[0].length
  }
  if (last < text.length) out.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>)
  return <>{out}</>
}
