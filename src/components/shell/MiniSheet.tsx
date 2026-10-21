import { useApp } from '../../store'

export type SheetKind = 'dev' | 'brief' | 'team' | 'adoption' | 'role'

const titles: Record<SheetKind, { ar: string; en: string }> = {
  dev: { ar: 'ورقة حوار التطوير', en: 'Development conversation sheet' },
  brief: { ar: 'الموجز القيادي', en: 'Leader brief' },
  team: { ar: 'ملخص احتياج الفريق', en: 'Team needs summary' },
  adoption: { ar: 'دليل التبني المؤسسي', en: 'Adoption guide' },
  role: { ar: 'ورقة الدور', en: 'Role sheet' },
}

function Line({ w, tone = 'bg-dga-line' }: { w: string; tone?: string }) {
  return <span className={`block h-1.5 rounded-full ${tone}`} style={{ width: w }} />
}

/** Schematic radar grid for the sheet thumbnails — no values, no fake result. */
function GridRadar() {
  const pts = (r: number) =>
    Array.from({ length: 8 }, (_, i) => {
      const a = ((-90 + i * 45) * Math.PI) / 180
      return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`
    }).join(' ')
  return (
    <svg viewBox="-30 -30 60 60" className="h-full w-full" aria-hidden="true">
      {[28, 21, 14, 7].map((r) => (
        <polygon key={r} points={pts(r)} fill="none" stroke="#D2D6DB" strokeWidth="0.8" />
      ))}
      <polygon points={pts(14)} fill="rgba(27,131,84,.18)" stroke="#1B8354" strokeWidth="1" />
      <polygon points={pts(21)} fill="none" stroke="#DBA102" strokeWidth="1" strokeDasharray="2 1.5" />
    </svg>
  )
}

/**
 * A miniature A4 sheet — a CSS/SVG schematic of a printable output, never a screenshot. Decorative:
 * the caption next to it carries the meaning.
 */
export default function MiniSheet({ kind, className = '' }: { kind: SheetKind; className?: string }) {
  const { t } = useApp()
  return (
    <div
      aria-hidden="true"
      className={`relative mx-auto aspect-[1/1.414] w-full max-w-[12rem] overflow-hidden rounded-[6px] border border-dga-line bg-white shadow-card ${className}`}
    >
      <div className="flex items-center justify-between gap-1 bg-dga-green-ink px-2 py-1.5">
        <span className="truncate text-[8px] font-semibold leading-none text-white">{t(titles[kind])}</span>
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-dga-amber" />
      </div>
      <div className="space-y-1.5 p-2">
        {kind === 'dev' && (
          <>
            <div className="flex gap-2">
              <div className="h-12 w-12 shrink-0">
                <GridRadar />
              </div>
              <div className="flex-1 space-y-1 pt-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-1">
                    <span className="grid h-3 w-3 place-items-center rounded-full bg-dga-amber text-[6px] font-bold text-dga-black">{n}</span>
                    <Line w={`${80 - n * 12}%`} tone="bg-dga-green/40" />
                  </div>
                ))}
              </div>
            </div>
            <Line w="60%" />
            <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-[2px] pt-0.5">
              {Array.from({ length: 13 }, (_, i) => (
                <span key={i} className={`h-2 rounded-[1px] ${i < 4 ? 'bg-dga-green/60' : 'bg-dga-line/70'}`} />
              ))}
            </div>
            <Line w="90%" />
            <Line w="75%" />
            <div className="grid grid-cols-2 gap-1 pt-1">
              <span className="h-5 rounded-[2px] border border-dashed border-dga-line" />
              <span className="h-5 rounded-[2px] border border-dashed border-dga-line" />
            </div>
          </>
        )}
        {kind === 'brief' && (
          <>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center gap-1">
                <span className="grid h-3 w-3 shrink-0 place-items-center rounded-[2px] bg-dga-green text-[6px] font-bold text-white">{n}</span>
                <Line w={`${92 - (n % 3) * 10}%`} />
              </div>
            ))}
            <div className="grid grid-cols-3 gap-1 pt-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-7 rounded-[2px] border-s-2 border-dga-amber bg-dga-amber/10" />
              ))}
            </div>
            <Line w="85%" />
            <Line w="70%" />
          </>
        )}
        {kind === 'role' && (
          <>
            <Line w="55%" tone="bg-dga-green/50" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="relative h-1.5 rounded-full bg-dga-line/60">
                <span className="absolute inset-y-0 start-0 rounded-full bg-dga-green/50" style={{ width: `${[60, 45, 30, 70, 50, 40, 25, 55][i]}%` }} />
                <span className="absolute -top-0.5 h-2.5 w-0.5 bg-dga-amber" style={{ insetInlineStart: `${[75, 50, 50, 75, 50, 75, 25, 75][i]}%` }} />
              </div>
            ))}
            <Line w="80%" />
          </>
        )}
        {kind === 'team' && (
          <>
            <div className="grid grid-cols-4 gap-[2px]">
              {Array.from({ length: 32 }, (_, i) => (
                <span key={i} className="h-2 rounded-[1px] bg-dga-line/70" />
              ))}
            </div>
            <Line w="70%" />
            <Line w="50%" />
          </>
        )}
        {kind === 'adoption' && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-[2px] border ${i < 3 ? 'border-dga-green bg-dga-green' : 'border-dga-line'}`} />
                <Line w={`${85 - i * 8}%`} />
              </div>
            ))}
            <div className="mt-1 h-6 rounded-[2px] bg-dga-green/10" />
          </>
        )}
      </div>
    </div>
  )
}
