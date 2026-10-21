import type { L } from '../types'

/** Source class of a claim — rendered as the confidence badge. */
export type ClaimKind = 'official' | 'international' | 'survey' | 'self-report' | 'editorial'

export type Confidence = 'high' | 'medium' | 'low'

export interface ClaimSource {
  title: L
  publisher: L
  url?: string
  /** page, table, sheet or section locator inside the source */
  locator?: string
  year?: number
  /**
   * Publication status, kept apart from the source class (`kind`): an internal
   * administrative workbook can be an authoritative record without being a public publication.
   * Omitted = published / publicly available.
   */
  access?: 'public' | 'internal'
}

/**
 * One quantitative or categorical claim shown anywhere in the product.
 * Rule: no number without a registered claim. The `<Claim id>` component renders it.
 */
export interface Claim {
  id: string
  /** the human sentence, with the number inside it */
  text: L
  /** the bare value as displayed (Western digits), e.g. "170 مليون" / "170 million" */
  value: L
  unit?: L
  /** population / geography / period the value applies to */
  scope?: L
  period?: string
  kind: ClaimKind
  confidence: Confidence
  source: ClaimSource
  /** how the value was derived when it is not read directly from the source */
  derivation?: L
  /** ISO date of the last editorial review */
  reviewedOn: string
  /** optional note on limits of the claim */
  caveat?: L
}
