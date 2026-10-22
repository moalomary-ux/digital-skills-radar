import type { Claim } from './types'
import { govClaims } from './gov'
import { standardsClaims } from './standards'
import { methodClaims } from './method'
import { futureClaims } from './future'
import { techClaims } from './tech'
import { leadersClaims } from './leaders'

export type { Claim, ClaimKind, ClaimSource, Confidence } from './types'
export { CLAIM_KINDS } from './types'

export const claims: Claim[] = [...govClaims, ...standardsClaims, ...methodClaims, ...futureClaims, ...techClaims, ...leadersClaims]

const byId = new Map(claims.map((c) => [c.id, c]))

export function claimById(id: string): Claim | undefined {
  return byId.get(id)
}

/** Build-time sanity: duplicate ids are a bug. */
export function duplicateClaimIds(): string[] {
  const seen = new Set<string>()
  const dups: string[] = []
  for (const c of claims) {
    if (seen.has(c.id)) dups.push(c.id)
    seen.add(c.id)
  }
  return dups
}
