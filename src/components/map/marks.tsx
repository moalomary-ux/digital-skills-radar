import type { NodeKind } from '../../lib/skillsGraph'

/**
 * Node marks: the kind is shown by shape as well as by ring, never by colour alone.
 *   skill = filled circle · role = ring · family = filled rounded square · technology = diamond
 *   sector = hollow square · domain = large disc (under its label pill)
 */
export function NodeMark({ kind, x, y, s, colour, strokeScale = 1, fill }: { kind: NodeKind; x: number; y: number; s: number; colour: string; strokeScale?: number; fill?: string }) {
  const sw = 1.6 * strokeScale
  switch (kind) {
    case 'domain':
      return <circle cx={x} cy={y} r={s} fill={colour} />
    case 'skill':
      return <circle cx={x} cy={y} r={s} fill={colour} stroke="#ffffff" strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    case 'role':
      return <circle cx={x} cy={y} r={s * 0.92} fill={fill ?? '#ffffff'} stroke={colour} strokeWidth={2.2 * strokeScale} vectorEffect="non-scaling-stroke" />
    case 'family':
      return <rect x={x - s} y={y - s} width={2 * s} height={2 * s} rx={s * 0.35} fill={colour} stroke="#ffffff" strokeWidth={sw} vectorEffect="non-scaling-stroke" />
    case 'tech':
      return <rect x={x - s} y={y - s} width={2 * s} height={2 * s} transform={`rotate(45 ${x} ${y})`} fill={colour} stroke="#ffffff" strokeWidth={sw * 0.8} vectorEffect="non-scaling-stroke" />
    case 'sector':
      return <rect x={x - s} y={y - s} width={2 * s} height={2 * s} fill={fill ?? '#ffffff'} stroke={colour} strokeWidth={2 * strokeScale} vectorEffect="non-scaling-stroke" />
    default:
      return null
  }
}

/**
 * A legend swatch for a node kind. The default is the ink black outline (review P2-9): the neutral
 * grey used before matched a domain colour and read as «disabled».
 */
export function KindSwatch({ kind, colour = '#161616' }: { kind: NodeKind; colour?: string }) {
  return (
    <svg viewBox="-8 -8 16 16" width="14" height="14" className="inline-block shrink-0" aria-hidden="true" focusable="false">
      <NodeMark kind={kind} x={0} y={0} s={kind === 'domain' ? 6.5 : kind === 'tech' ? 4.4 : 5} colour={colour} />
    </svg>
  )
}
