/**
 * One colour per domain, kept identical on every map surface (full map, previews, list mode).
 * Derived from the DGA green/amber pair and the chart colours already in use (radar layers:
 * blue #1849A9, grey #4D5761), completed with teal, orange, violet and magenta so the eight stay
 * distinct. Every `ink` value is text-safe on white (WCAG AA for 12 px text); `dot` is the mark
 * colour (≥ 3:1 on white). Colour is never the only cue: the wedge position and the labels name
 * the domain too.
 */
export interface DomainColour {
  dot: string
  ink: string
  tint: string
}

export const DOMAIN_COLOURS: Record<string, DomainColour> = {
  'ai-data': { dot: '#1B8354', ink: '#067647', tint: '#E7F4EE' },
  cyber: { dot: '#1849A9', ink: '#1849A9', tint: '#E8EEF9' },
  cloud: { dot: '#0E7490', ink: '#0E6278', tint: '#E3F2F6' },
  'service-design': { dot: '#B54708', ink: '#A53F06', tint: '#FBEDE4' },
  policy: { dot: '#6941C6', ink: '#5B37B0', tint: '#EFEAFA' },
  agile: { dot: '#A67C00', ink: '#8A6A00', tint: '#FBF4DC' },
  emerging: { dot: '#C11574', ink: '#A8125F', tint: '#FBE7F1' },
  leadership: { dot: '#4D5761', ink: '#3F4750', tint: '#EDEFF2' },
}

const FALLBACK: DomainColour = { dot: '#64748B', ink: '#4D5761', tint: '#F1F5F9' }

export const domainColour = (domainId: string): DomainColour => DOMAIN_COLOURS[domainId] ?? FALLBACK
