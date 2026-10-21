import { useState } from 'react'
import { isFullMode } from '../lib/flags'
import { englishNameFallback } from '../data/gov/taxonomy'

/**
 * Entity mark. In the public (aggregate) build this is always a neutral monogram: no official logos ship
 * (DECISION-20261021 §2 row 5, §6). In the full build (`VITE_DATA_MODE=full`) it lazily loads
 * `/logos/<stem>.webp`, published by `scripts/build-gov-data.mjs --full`, and falls back to the monogram.
 */
export interface LogoEntity {
  id: string
  nameAr: string
  /** logo file stem (full-mode detail rows and the cleaned directory carry it); absent or null → monogram */
  logo?: string | null
}

const MONO_COLORS = ['#1B8354', '#167248', '#067647', '#8A6A00', '#074D31', '#255C2B']

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Public URL of a WebP logo stem against the Vite base, e.g. `logoUrl('ent-0061')` → `/logos/ent-0061.webp`. */
export function logoUrl(stem: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return `${base}/logos/${stem}.webp`
}

/** Neutral monogram: first letter of the Arabic name on a brand-green disc. Decorative (the name is shown next to it). */
export function Monogram({ entity, className = 'h-12 w-12' }: { entity: LogoEntity; className?: string }) {
  const ch = entity.nameAr.trim().charAt(0) || '؟'
  const color = MONO_COLORS[hash(entity.id) % MONO_COLORS.length]
  return (
    <span className={`grid shrink-0 select-none place-items-center rounded-full text-lg font-bold text-white ${className}`} style={{ backgroundColor: color }} aria-hidden="true" lang="ar">
      {ch}
    </span>
  )
}

export default function EntityLogo({ entity, className = 'h-12 w-12' }: { entity: LogoEntity; className?: string }) {
  const [err, setErr] = useState(false)
  const stem = entity.logo ?? null
  if (!isFullMode() || !stem || err) return <Monogram entity={entity} className={className} />
  return (
    <img
      src={logoUrl(stem)}
      alt=""
      loading="lazy"
      decoding="async"
      width={96}
      height={96}
      onError={() => setErr(true)}
      className={`shrink-0 rounded-full border border-dga-line bg-white object-contain p-1 ${className}`}
    />
  )
}

/**
 * English UI only: the note shown with an entity whose source record has no English name, so the Arabic
 * script reads as the proper name itself (the name element carries `lang="ar"`). Renders nothing otherwise.
 */
export function EnglishNameFallback({ lang, nameEn, long = false, className = 'block text-[10.5px] italic text-dga-muted' }: { lang: 'ar' | 'en'; nameEn: string | null; long?: boolean; className?: string }) {
  if (lang !== 'en' || nameEn) return null
  return <span className={className}>{long ? englishNameFallback.long : englishNameFallback.short}</span>
}
