import type { L } from '../../data/types'

/** The evidence layers a skills radar can draw, bottom to top. */
export type RadarLayerKey = 'previous' | 'target' | 'scenario' | 'self' | 'knowledge'

export const RADAR_LAYER_ORDER: RadarLayerKey[] = ['previous', 'target', 'scenario', 'self', 'knowledge']
/** Column order for tables and spoken descriptions (most important first). */
export const RADAR_LAYER_READING_ORDER: RadarLayerKey[] = ['self', 'target', 'scenario', 'knowledge', 'previous']

export interface RadarLayerMeta {
  color: string
  /** SVG stroke-dasharray, `null` = solid line; `false` = markers only (no outline) */
  dash: string | null | false
  marker: 'dot' | 'ring' | 'square' | 'diamond' | 'none'
  label: L
}

/**
 * Colour is never the only cue: each layer also has its own line pattern and marker shape.
 * DGA green = self, DGA amber = target, blue = judgment scenarios, neutral grey = knowledge check.
 */
export const RADAR_LAYERS: Record<RadarLayerKey, RadarLayerMeta> = {
  self: { color: '#1B8354', dash: null, marker: 'dot', label: { ar: 'التقدير الذاتي', en: 'Self-rating' } },
  target: { color: '#DBA102', dash: null, marker: 'ring', label: { ar: 'المستهدف', en: 'Target' } },
  scenario: { color: '#1849A9', dash: '7 4', marker: 'square', label: { ar: 'مواقف الحكم', en: 'Judgment scenarios' } },
  knowledge: { color: '#4D5761', dash: false, marker: 'diamond', label: { ar: 'التحقق المعرفي', en: 'Knowledge check' } },
  previous: { color: '#64748B', dash: '3 4', marker: 'none', label: { ar: 'التقييم السابق', en: 'Previous assessment' } },
}

/** One marker of a layer, centred on (x, y). `s` scales the size. */
export function RadarMarker({ layer, x, y, s = 1 }: { layer: RadarLayerKey; x: number; y: number; s?: number }) {
  const m = RADAR_LAYERS[layer]
  switch (m.marker) {
    case 'dot':
      return <circle cx={x} cy={y} r={4.6 * s} fill={m.color} stroke="#ffffff" strokeWidth={1.6 * s} />
    case 'ring':
      return <circle cx={x} cy={y} r={3.9 * s} fill="#ffffff" stroke={m.color} strokeWidth={2.3 * s} />
    case 'square':
      return <rect x={x - 3.8 * s} y={y - 3.8 * s} width={7.6 * s} height={7.6 * s} fill={m.color} stroke="#ffffff" strokeWidth={1.2 * s} />
    case 'diamond':
      return <rect x={x - 4.6 * s} y={y - 4.6 * s} width={9.2 * s} height={9.2 * s} transform={`rotate(45 ${x} ${y})`} fill={m.color} stroke="#ffffff" strokeWidth={1.6 * s} />
    default:
      return null
  }
}

/** A small legend swatch: the layer's line pattern with its marker in the middle. */
export function RadarLayerSwatch({ layer, className = '' }: { layer: RadarLayerKey; className?: string }) {
  const m = RADAR_LAYERS[layer]
  return (
    <svg viewBox="0 0 24 12" width="24" height="12" className={`inline-block shrink-0 ${className}`} aria-hidden="true" focusable="false">
      {m.dash !== false && <line x1="1" y1="6" x2="23" y2="6" stroke={m.color} strokeWidth="2" strokeDasharray={m.dash ?? undefined} />}
      <RadarMarker layer={layer} x={12} y={6} s={0.95} />
    </svg>
  )
}
