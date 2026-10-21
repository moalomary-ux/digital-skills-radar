import type { L } from './types'

/**
 * Headline figures for the home page (v9, packet P5b).
 *
 * The citizen lane (the guidance quiz, the growing/declining job lists and the skills-vs-degree
 * article) left the v9 build together with its data file; it is kept on the `v8-handover` tag.
 * Every figure resolves to a registered claim (`claimId`, see src/data/claims) and should be
 * rendered with `<Claim id={claimId} />`. `value` is a language-neutral fallback: the unit
 * («مليون» / "million") sits in the label, so no «170M» form is needed.
 */

// ── Headline stats (WEF Future of Jobs 2025) ────────────────────────────────
export const headlineStats: { value: string; label: L; claimId: string }[] = [
  { value: '170', label: { ar: 'مليون وظيفة جديدة متوقعة عالميًا بحلول 2030', en: 'million new jobs expected globally by 2030' }, claimId: 'future-wef-2025-jobs-created' },
  { value: '92', label: { ar: 'مليون وظيفة متوقع استبدالها في الفترة نفسها', en: 'million jobs expected to be displaced in the same period' }, claimId: 'future-wef-2025-jobs-displaced' },
  { value: '39%', label: { ar: 'من المهارات الحالية للعاملين متوقع أن تتحول أو تتقادم بحلول 2030', en: 'of workers’ existing skill sets are expected to be transformed or become outdated by 2030' }, claimId: 'standards-wef-core-skills' },
  { value: '+78', label: { ar: 'مليون وظيفة صافية متوقعة، فالتوقعات تستحدث أكثر مما تستبدل', en: 'million net new jobs expected, as projections create more than they displace' }, claimId: 'future-wef-2025-net-jobs' },
]

