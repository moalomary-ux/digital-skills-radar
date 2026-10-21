import type { ReactNode } from 'react'

/** A number (or numeric range) inside Arabic text: Western digits, isolated left-to-right. */
export function Num({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span dir="ltr" className={`tabular-nums ${className}`}>
      {children}
    </span>
  )
}

/** Level bands on the 0–4 scale, from the published thresholds 1.25 · 2.25 · 3.25. */
export const LEVEL_BANDS: readonly (readonly [number, number])[] = [
  [0, 1.25],
  [1.25, 2.25],
  [2.25, 3.25],
  [3.25, 4],
]

/** True when the visitor asked for reduced motion (safe outside the browser). */
export function prefersReducedMotion(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/** Move focus between sibling controls with the arrow keys, Home and End. */
export function moveFocus(container: HTMLElement | null, current: HTMLElement, key: string, selector: string): boolean {
  if (!container) return false
  const items = Array.from(container.querySelectorAll<HTMLElement>(selector))
  const i = items.indexOf(current)
  if (i < 0) return false
  let next = -1
  if (key === 'ArrowDown') next = Math.min(items.length - 1, i + 1)
  else if (key === 'ArrowUp') next = Math.max(0, i - 1)
  else if (key === 'Home') next = 0
  else if (key === 'End') next = items.length - 1
  if (next < 0) return false
  items[next].focus()
  return true
}
