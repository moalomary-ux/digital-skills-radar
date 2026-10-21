import { TEAM_INFLATION_GAP, formatSigned } from '../../lib/team'
import { Num } from './teamUi'

/**
 * Self-rating minus scenario judgment, per domain, as diverging bars around zero (−2 … +2 on
 * the 0–4 scale; longer gaps are drawn at the edge and written in full). Positive values grow
 * toward the reading end, like the distribution. The dashed line is the editorial threshold.
 */

export interface GapRow {
  id: string
  label: string
  /** null: fewer paired answers than the gate */
  gap: number | null
  risk: boolean
}

const W = 300
const H = 22
const LIM = 2

function gx(v: number, rtl: boolean) {
  const t = (Math.max(-LIM, Math.min(LIM, v)) + LIM) / (2 * LIM)
  return rtl ? W - t * W : t * W
}

export default function GapBars({ rows, rtl, insufficient, riskLabel }: { rows: GapRow[]; rtl: boolean; insufficient: string; riskLabel: string }) {
  const zero = gx(0, rtl)
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.id} className="grid grid-cols-[1fr_4.5rem] items-center gap-x-3 gap-y-0.5 sm:grid-cols-[minmax(7.5rem,11rem)_1fr_4.5rem]">
          <span className="col-span-2 text-sm leading-snug text-dga-ink sm:col-span-1">{r.label}</span>
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden="true" focusable="false">
            <rect x={0} y={H / 2 - 1} width={W} height={2} fill="#EAECF0" />
            {r.gap !== null && (
              <rect
                x={Math.min(zero, gx(r.gap, rtl))}
                y={4}
                width={Math.max(1.5, Math.abs(gx(r.gap, rtl) - zero))}
                height={H - 8}
                rx={2}
                fill={r.risk ? '#DBA102' : '#9DA4AE'}
              />
            )}
            <line x1={zero} x2={zero} y1={0} y2={H} stroke="#4D5761" strokeWidth={1.2} />
            <line x1={gx(TEAM_INFLATION_GAP, rtl)} x2={gx(TEAM_INFLATION_GAP, rtl)} y1={0} y2={H} stroke="#8A6A00" strokeWidth={1} strokeDasharray="3 3" />
          </svg>
          <span className="text-end text-sm">
            {r.gap === null ? (
              <span className="text-xs text-dga-muted">{insufficient}</span>
            ) : (
              <>
                <Num className={r.risk ? 'font-semibold text-dga-amber-tx' : 'text-dga-ink'}>{formatSigned(r.gap)}</Num>
                {r.risk && <span className="sr-only"> — {riskLabel}</span>}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
