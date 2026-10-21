import type { ReactNode } from 'react'
import { formatShare } from '../../lib/team'
import { Num } from './teamUi'

/**
 * Coverage per domain: the share of codes at or above the target, as horizontal bars that grow
 * from the reading start (right in Arabic). The width animates when the comparison category or
 * basis changes (the global reduced-motion rule turns the transition off). Text carries the
 * same numbers, so the bars are decorative for assistive technology.
 */

export interface CoverageRow {
  id: string
  label: string
  share: number
  /** e.g. «المستهدف: تطبيق · 7 من 12» */
  detail: ReactNode
  /** marks a single point of failure */
  flag?: string
}

export default function CoverageBars({ rows }: { rows: CoverageRow[] }) {
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.id} className="grid grid-cols-[1fr_3.25rem] items-center gap-x-3 gap-y-0.5 sm:grid-cols-[minmax(7.5rem,11rem)_1fr_3.25rem]">
          <span className="col-span-2 text-sm leading-snug text-dga-ink sm:col-span-1">{r.label}</span>
          <span className="relative block h-3 overflow-hidden rounded-pill bg-dga-line/50" aria-hidden="true">
            <span
              className="absolute inset-y-0 start-0 block rounded-pill bg-dga-green transition-[width] duration-500 ease-out"
              style={{ width: `${Math.round(r.share * 100)}%` }}
            />
            <span className="absolute inset-y-0 start-1/2 block w-px bg-white/90" />
          </span>
          <Num className="text-end text-sm font-semibold text-dga-black">{formatShare(r.share)}</Num>
          <span className="col-span-2 flex flex-wrap items-center gap-2 text-xs text-dga-muted sm:col-start-2 sm:col-end-4">
            {r.detail}
            {r.flag && <span className="rounded-pill bg-dga-amber/15 px-2 py-0.5 font-semibold text-dga-amber-tx">{r.flag}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}
