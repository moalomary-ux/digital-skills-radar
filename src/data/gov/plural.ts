/**
 * Arabic plural grammar for the «و… خدمة أخرى» tail of `topConsulting` strings.
 *
 *   1      → وخدمة أخرى
 *   2      → وخدمتان أخريان
 *   3–10   → و4 خدمات أخرى
 *   11+    → و11 خدمةً أخرى   (singular with tanween after 11, as Arabic requires)
 *
 * Used by `scripts/build-gov-data.mjs --clean` to rewrite the directory, and available to the
 * full-mode views for any string assembled at runtime.
 */

const TANWEEN_FATH = 'ً'

export function otherServicesAr(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return ''
  if (n === 1) return 'وخدمة أخرى'
  if (n === 2) return 'وخدمتان أخريان'
  if (n <= 10) return `و${n} خدمات أخرى`
  return `و${n} خدمة${TANWEEN_FATH} أخرى`
}

/** The ungrammatical source pattern («و4 خدمة أخرى», optional spaces). */
export const BAD_TAIL = /و\s?(\d+)\s?خدمة أخرى/g

/** Rewrite every ungrammatical tail in a `topConsulting` string. Idempotent. */
export function fixTopConsulting(text: string): string
export function fixTopConsulting(text: null): null
export function fixTopConsulting(text: string | null): string | null
export function fixTopConsulting(text: string | null): string | null {
  if (text == null) return text
  return text.replace(BAD_TAIL, (_m, d: string) => otherServicesAr(Number(d)))
}
