/**
 * Roving-focus keys for chart controls (radar axes, technology blips).
 *
 * The visual order of a radial chart follows the reading direction (clockwise in English,
 * counter-clockwise in Arabic), so the horizontal arrows are mirrored in RTL: the arrow that
 * points in the reading direction always means «next». Up/Down are not mirrored. The list wraps.
 * Returns the new index, or `null` when the key is not a navigation key.
 */
export function rovingIndex(key: string, current: number, count: number, rtl: boolean): number | null {
  if (count <= 0) return null
  const next = (current + 1) % count
  const prev = (current - 1 + count) % count
  switch (key) {
    case 'ArrowRight':
      return rtl ? prev : next
    case 'ArrowLeft':
      return rtl ? next : prev
    case 'ArrowDown':
      return next
    case 'ArrowUp':
      return prev
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}
