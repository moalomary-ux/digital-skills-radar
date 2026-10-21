import { useState } from 'react'
import type { GovEntity } from '../data/govEntities'

const MONO_COLORS = ['#1B8354', '#167248', '#067647', '#8A6A00', '#074D31', '#255C2B']

/** Resolve a data-file logo path ('/logos/ent-XXXX.png') against the vite base. */
export function logoUrl(logo: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + logo
}

/** Entity logo with lazy loading; falls back to a colored monogram on missing logo or load error. */
export default function EntityLogo({ entity, className = 'h-12 w-12' }: { entity: GovEntity; className?: string }) {
  const [err, setErr] = useState(false)
  if (!entity.logo || err) {
    const ch = entity.nameAr.trim().charAt(0) || '؟'
    const color = MONO_COLORS[entity.num % MONO_COLORS.length]
    return (
      <span
        className={`grid shrink-0 select-none place-items-center rounded-full text-lg font-bold text-white ${className}`}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {ch}
      </span>
    )
  }
  return (
    <img
      src={logoUrl(entity.logo)}
      alt={entity.nameAr}
      loading="lazy"
      onError={() => setErr(true)}
      className={`shrink-0 rounded-full border border-dga-line bg-white object-contain p-1 ${className}`}
    />
  )
}
