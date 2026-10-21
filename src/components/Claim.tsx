import { useApp } from '../store'
import { claimById } from '../data/claims'
import type { ClaimKind, Confidence } from '../data/claims'

const kindLabel: Record<ClaimKind, { ar: string; en: string }> = {
  official: { ar: 'مصدر رسمي', en: 'Official source' },
  international: { ar: 'تقرير دولي', en: 'International report' },
  survey: { ar: 'استطلاع', en: 'Survey' },
  'self-report': { ar: 'ذاتي الإبلاغ', en: 'Self-reported' },
  editorial: { ar: 'تقدير تحريري', en: 'Editorial estimate' },
}

const confLabel: Record<Confidence, { ar: string; en: string }> = {
  high: { ar: 'ثقة عالية', en: 'High confidence' },
  medium: { ar: 'ثقة متوسطة', en: 'Medium confidence' },
  low: { ar: 'ثقة منخفضة', en: 'Low confidence' },
}

/**
 * Renders a registered claim's value with its source badge.
 * Minimal stub (leader, 2026-10-21): packet P5a replaces the badge with a popover and the evidence page.
 * Usage: <Claim id="future-wef-2025-created-jobs" /> or <Claim id="…">custom children</Claim>
 */
export default function Claim({ id, children, bare = false }: { id: string; children?: React.ReactNode; bare?: boolean }) {
  const { t, lang } = useApp()
  const c = claimById(id)
  if (!c) {
    if (import.meta.env.DEV) console.warn(`[Claim] unknown claim id: ${id}`)
    return <>{children ?? id}</>
  }
  const value = children ?? <span dir="ltr">{t(c.value)}</span>
  if (bare) return <>{value}</>
  const title = `${t(kindLabel[c.kind])} · ${t(confLabel[c.confidence])} · ${t(c.source.title)}${c.source.year ? ` (${c.source.year})` : ''}`
  return (
    <span className="inline-flex items-baseline gap-1.5">
      {value}
      <abbr title={title} className="chip cursor-help no-underline" aria-label={title} lang={lang}>
        {t(kindLabel[c.kind])}
      </abbr>
    </span>
  )
}
