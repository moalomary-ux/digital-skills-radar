/**
 * One colour per domain, kept identical on every map surface (full map, previews, list mode).
 *
 * P10b (review P2-9): chosen for colour-vision deficiency, not only for normal vision. Every pair
 * stays apart under simulated deuteranopia, protanopia and tritanopia (Machado 2009 matrices,
 * CIELAB ΔE ≥ 14 for every pair; the previous set fell to 8.7). The DGA green keeps the data
 * domain; leadership is a dark brown, no longer the neutral grey that read as «disabled».
 *   dot  — the mark colour, ≥ 3:1 on white
 *   ink  — text-safe on white (≥ 4.5:1 for 12 px text)
 *   tint — the wedge wash
 * Colour is never the only cue: the wedge position, the labels and the kind shapes name each node.
 */
export interface DomainColour {
  dot: string
  ink: string
  tint: string
}

export const DOMAIN_COLOURS: Record<string, DomainColour> = {
  'ai-data': { dot: '#1B8354', ink: '#067647', tint: '#E5F3EC' },
  cyber: { dot: '#0B3270', ink: '#0B3270', tint: '#E4EAF4' },
  cloud: { dot: '#2A8CC9', ink: '#1A6A9C', tint: '#E2F0F9' },
  'service-design': { dot: '#A33A0A', ink: '#A33A0A', tint: '#F7E9E2' },
  policy: { dot: '#A0459E', ink: '#8B3889', tint: '#F4E8F3' },
  agile: { dot: '#A38300', ink: '#7A6200', tint: '#F7F0D8' },
  emerging: { dot: '#CF3F87', ink: '#AE2F6E', tint: '#FBE7F0' },
  leadership: { dot: '#3C2A1E', ink: '#3C2A1E', tint: '#EFE9E4' },
}

const FALLBACK: DomainColour = { dot: '#64748B', ink: '#4D5761', tint: '#F1F5F9' }

export const domainColour = (domainId: string): DomainColour => DOMAIN_COLOURS[domainId] ?? FALLBACK

/** Text colour for dimmed labels and controls: ≥ 4.5:1 on white (review P2-1), instead of fading by opacity. */
export const DIM_INK = '#667085'
/** Role comparison colours (P10b wow 2): DGA green for the first role, DGA amber for the second. */
export const COMPARE_A = '#1B8354'
export const COMPARE_B = '#DBA102'
export const COMPARE_B_INK = '#8A6A00'
