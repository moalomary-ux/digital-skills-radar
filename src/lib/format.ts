/**
 * Number formatting for both interface languages (P9).
 *
 * Owner rule: Western digits (0-9) everywhere, in Arabic as in English. Output is deliberately
 * identical in both languages («1,234.5», «+0.5», «−0.2»); `lang` is accepted for call-site
 * symmetry and for the Arabic count helper. `Intl` is pinned to `en-US-u-nu-latn` because the
 * Arabic locales inject invisible LRM marks (U+200E) around the minus and percent signs.
 *
 * Direction: a number inside Arabic text must be isolated, or the bidi algorithm moves a leading
 * sign to the far side («0.5+»). In JSX use `bdi()` (or `<Num>`); in plain strings that end up in
 * SVG `<text>`, `title` or similar, use `isolateLtr()`.
 */
import { createElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { Lang } from '../data/types'

/** U+2212 MINUS SIGN: the typographic minus, never confused with a hyphen. */
export const MINUS = '−'
/** Unicode LEFT-TO-RIGHT ISOLATE … POP DIRECTIONAL ISOLATE. */
export const LRI = '⁦'
export const PDI = '⁩'

export interface NumberOptions {
  /** maximum fraction digits (default: 0 for integers, 2 otherwise) */
  decimals?: number
  /** minimum fraction digits (default: 0) */
  minDecimals?: number
  /** thousands separator (default: true) */
  group?: boolean
}

const formatters = new Map<string, Intl.NumberFormat>()
function formatter(max: number, min: number, group: boolean): Intl.NumberFormat {
  const key = `${max}|${min}|${group}`
  let f = formatters.get(key)
  if (!f) {
    f = new Intl.NumberFormat('en-US-u-nu-latn', { maximumFractionDigits: max, minimumFractionDigits: min, useGrouping: group })
    formatters.set(key, f)
  }
  return f
}

/** «1,234.5» in both languages; negative numbers use U+2212; never Eastern Arabic digits. */
export function formatNumber(n: number, lang: Lang = 'ar', opts: NumberOptions = {}): string {
  void lang
  if (!Number.isFinite(n)) return '—'
  const max = Math.max(0, opts.decimals ?? (Number.isInteger(n) ? 0 : 2))
  const min = Math.min(max, Math.max(0, opts.minDecimals ?? 0))
  const body = formatter(max, min, opts.group ?? true).format(Math.abs(n))
  // a value that rounds to zero carries no sign («−0.0» would be noise)
  const isZero = !/[1-9]/.test(body)
  return n < 0 && !isZero ? `${MINUS}${body}` : body
}

/**
 * A signed delta: «+0.5», «−0.5», «0.0». The sign always comes first in the string; render it
 * through `bdi()` / `isolateLtr()` so Arabic text does not move it to the end.
 */
export function signed(n: number, decimals = 1, lang: Lang = 'ar'): string {
  const body = formatNumber(Math.abs(n), lang, { decimals, minDecimals: decimals })
  if (!/[1-9]/.test(body)) return body
  return n > 0 ? `+${body}` : n < 0 ? `${MINUS}${body}` : body
}

/** Wrap a plain string in a left-to-right isolate (for SVG text, `title`, canvas…). */
export function isolateLtr(text: string): string {
  return `${LRI}${text}${PDI}`
}

/** `<bdi dir="ltr" class="tabular-nums">` around a number or any left-to-right token. */
export function bdi(content: ReactNode, className = ''): ReactElement {
  return createElement('bdi', { dir: 'ltr', className: `tabular-nums${className ? ` ${className}` : ''}` }, content)
}

export interface ArabicCountForms {
  /** 1 — «مجال واحد» */
  one: string
  /** 2 — «مجالان» */
  two: string
  /** 3–10 — «مجالات» */
  few: string
  /** 11+ — «مجالًا» */
  many: string
}

/**
 * Count phrase with Arabic number agreement (1 / 2 / 3–10 / 11+). English uses `en` forms
 * `[singular, plural]`. Digits stay Western: «8 مجالات», «24 دورًا», «2 domains».
 */
export function countPhrase(n: number, lang: Lang, ar: ArabicCountForms, en: [string, string]): string {
  if (lang === 'en') return `${formatNumber(n, lang)} ${n === 1 ? en[0] : en[1]}`
  if (n === 1) return ar.one
  if (n === 2) return ar.two
  const mod100 = n % 100
  if (mod100 >= 3 && mod100 <= 10) return `${formatNumber(n, lang)} ${ar.few}`
  return `${formatNumber(n, lang)} ${ar.many}`
}
