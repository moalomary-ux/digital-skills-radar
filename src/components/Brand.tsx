import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'

/** Product brand mark — a radar: concentric rings, sweep, blips. Decorative (the wordmark carries the name). */
export function RadarMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18" stroke="#1B8354" strokeWidth="2" />
      <circle cx="20" cy="20" r="11.5" stroke="#1B8354" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.65" />
      <circle cx="20" cy="20" r="5" stroke="#1B8354" strokeWidth="1.4" opacity="0.4" />
      <line x1="20" y1="20" x2="32.5" y2="9.5" stroke="#DBA102" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.4" fill="#1B8354" />
      <circle cx="27.5" cy="25" r="2.2" fill="#DBA102" />
      <circle cx="13" cy="13.5" r="2.2" fill="#167248" />
      <circle cx="25" cy="12" r="1.7" fill="#1B8354" opacity="0.7" />
    </svg>
  )
}

/**
 * Brand mark + wordmark, linking home. `compactUntilXl` keeps the wordmark for screen readers but hides it
 * visually between 1024 and 1279 px, where the six hub links need the room.
 */
export default function Brand({ compactUntilXl = false, onNavigate }: { compactUntilXl?: boolean; onNavigate?: () => void }) {
  const { lang } = useApp()
  const primary = lang === 'ar' ? 'رادار المهارات الرقمية' : 'Digital Skills Radar'
  const secondary = lang === 'ar' ? 'Digital Skills Radar' : 'رادار المهارات الرقمية'
  return (
    <Link
      to={pathFor('home', lang)}
      onClick={onNavigate}
      className="flex shrink-0 items-center gap-2.5 rounded-btn text-start no-underline hover:no-underline"
    >
      <RadarMark className="h-9 w-9 shrink-0" />
      <span className={`leading-tight ${compactUntilXl ? 'lg:sr-only xl:not-sr-only' : ''}`}>
        <span className="block whitespace-nowrap text-sm font-bold text-dga-black">{primary}</span>
        <span className="block whitespace-nowrap text-[11px] text-dga-muted" lang={lang === 'ar' ? 'en' : 'ar'} aria-hidden="true">
          {secondary}
        </span>
      </span>
    </Link>
  )
}
