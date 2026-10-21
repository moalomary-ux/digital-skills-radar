import type { Domain, L, Lang } from '../data/types'
import type { KnowledgeTally, ResultRecord } from '../store'
import type { TrackId } from '../data/tracks'
import { categoryTargets } from '../data/levels'
import { LIB_PREFIX, resolveTargets } from '../data/roleLibrary'

/**
 * THE single priority engine («محرك أولويات واحد», DECISION §2 #2).
 * Results, the plan («خطتي») and the printed development conversation sheet all read from
 * `priorities()` — no view computes its own gap list, headline or agreement label.
 *
 * Inputs per domain (all from the saved record + the indicative target):
 *   S  self-rating 0–4 (mean of the 5 statements)
 *   J  scenario judgment 0–3 (one scenario per domain; optional) → J4 = J × 4/3 on the same 0–4 scale
 *   K  knowledge check {attempted, correct} (optional; v2 records only)
 *   T  indicative target level 1–4 (role category, or the precise library role when chosen)
 *
 * Knowledge agreement (claim `method-knowledge-min-attempts`): judged ONLY when attempted ≥ 3 in that
 * domain; then S/4 is compared with correct/attempted, with a tolerance of 0.2 in both directions.
 * Legacy records (no schema version) keep `calibration` = correct answers with unknown attempts →
 * never an agreement flag.
 *
 * Reason (first rule that applies):
 *   1. J present, S − J4 ≥ 1 and (S ≥ T or S ≥ 2.5):
 *        «inflated» when S ≥ 2.5 and the knowledge check also sits below the self-rating,
 *        otherwise «judgment_below_self»
 *   2. S < T and J present with J4 < T                → «both_below_target»
 *   3. S < T                                         → «self_below_target»
 *   4. otherwise                                     → «maintain»
 *
 * Ranking rule (documented, editorial):
 *   rankScore = class + gap + adjustment
 *   class:      judgment evidence outranks self-report — inflated / judgment_below_self /
 *               both_below_target = 20; self_below_target = 10; maintain = 0
 *   gap:        target reasons: T − min(S, J4) (the more conservative evidence);
 *               mismatch reasons: S − J4
 *   adjustment: the knowledge-check flag adjusts by ±0.5 — +0.5 when it supports the concern,
 *               −0.5 when it contradicts it; a scenario at/above target lowers a self-only reason by 0.5
 *   ties:       larger gap first, then the fixed domain order.
 * At most 3 priorities. When no domain has a development reason, the 3 domains closest to their
 * target are returned as «maintain» (keep the level, share knowledge).
 *
 * Reason text follows the evidence shown beside it: «self_below_target» says whether a scenario
 * answer exists and where it sits against the target, and the target is named «لدورك» / “for your
 * role” when the record holds a precise library role, «لفئة دورك» / “for your role category” otherwise.
 */

export type Reason = 'both_below_target' | 'self_below_target' | 'judgment_below_self' | 'inflated' | 'maintain'
/** self-rating vs knowledge check: consistent, self-rating above the check, or the check above the self-rating */
export type Agreement = 'consistent' | 'self_higher' | 'check_higher'

export const MIN_KNOWLEDGE_ATTEMPTS = 3
export const AGREEMENT_TOLERANCE = 0.2
export const JUDGMENT_MISMATCH = 1
export const HIGH_SELF = 2.5
export const MAX_PRIORITIES = 3

/** attempted = null → legacy record: correct answers known, attempts unknown */
export interface KnowledgeView {
  attempted: number | null
  correct: number
}

export interface DomainEvidence {
  domainId: string
  domainName: L
  /** self-rating 0–4 */
  selfScore: number
  /** scenario judgment 0–3 (absent when the domain has no scenario answer) */
  scenarioScore?: number
  /** the scenario on the 0–4 scale */
  judgment4?: number
  target: number
  knowledge?: KnowledgeView
  agreement: Agreement | null
  reason: Reason
  gap: number
  rankScore: number
  /** the evidence level a plan starts from: min(self, judgment) — judgment outranks self-report */
  planScore: number
}

/** where the indicative target comes from: a precise library role, or the role category */
export type TargetBasis = 'role' | 'category'

/** The record shape the engine reads; `roleId` (optional) only names the target's basis in the text. */
export type PriorityInput = Pick<ResultRecord, 'scores' | 'scenario' | 'knowledge' | 'calibration' | 'v'> & { roleId?: string }

export const targetBasisFor = (roleId: string | null | undefined): TargetBasis =>
  typeof roleId === 'string' && roleId.startsWith(LIB_PREFIX) ? 'role' : 'category'

export interface Priority {
  domainId: string
  domainName: L
  reason: Reason
  /** 1-based */
  rank: number
  selfScore: number
  scenarioScore?: number
  target: number
  gap: number
  /** plain-language reason, without numbers (numbers are rendered separately with dir="ltr") */
  text: L
  agreement: Agreement | null
  knowledge?: KnowledgeView
  planScore: number
  /** the target behind this priority: a precise role or the role category (wording only) */
  targetBasis: TargetBasis
}

export const reasonLabel: Record<Reason, L> = {
  both_below_target: { ar: 'التقدير والمواقف دون المستهدف', en: 'Self-rating and scenario below target' },
  self_below_target: { ar: 'التقدير الذاتي دون المستهدف', en: 'Self-rating below target' },
  judgment_below_self: { ar: 'المواقف دون تقديرك الذاتي', en: 'Scenario below your self-rating' },
  inflated: { ar: 'تحقق من تقديرك عمليًا', en: 'Check your self-rating in practice' },
  maintain: { ar: 'حافظ على مستواك', en: 'Maintain your level' },
}

export const agreementLabel: Record<Agreement, L> = {
  consistent: { ar: 'متسق مع تقديرك', en: 'Consistent with your self-rating' },
  self_higher: { ar: 'تقديرك أعلى من التحقق', en: 'Self-rating above the check' },
  check_higher: { ar: 'التحقق أعلى من تقديرك', en: 'Check above your self-rating' },
}

/** «لدورك» for a precise role, «لفئة دورك» for a role category. */
const targetOwner: Record<TargetBasis, L> = {
  role: { ar: 'لدورك', en: 'for your role' },
  category: { ar: 'لفئة دورك', en: 'for your role category' },
}

function reasonShort(reason: Exclude<Reason, 'maintain'>, basis: TargetBasis): L {
  switch (reason) {
    case 'both_below_target':
      return { ar: 'تقديرك الذاتي وإجابتك في موقف الحكم كلاهما دون المستهدف', en: 'both your self-rating and your scenario response are below the target' }
    case 'self_below_target':
      return {
        ar: `تقديرك الذاتي دون المستهدف الاسترشادي ${targetOwner[basis].ar}`,
        en: `your self-rating is below the indicative target ${targetOwner[basis].en}`,
      }
    case 'judgment_below_self':
      return { ar: 'إجابتك في موقف الحكم أدنى من تقديرك الذاتي', en: 'your scenario response is lower than your self-rating' }
    case 'inflated':
      return { ar: 'تقديرك الذاتي أعلى مما أظهره موقف الحكم والتحقق المعرفي', en: 'your self-rating is higher than both the scenario and the knowledge check showed' }
  }
}

const CATEGORY_IDS: readonly TrackId[] = ['awareness', 'applied', 'specialist', 'team_lead', 'executive']
export const isCategoryId = (x: unknown): x is TrackId => typeof x === 'string' && (CATEGORY_IDS as readonly string[]).includes(x)

export const CATEGORY_ROLE_PREFIX = 'cat:'

/**
 * Indicative targets for a saved record: the precise library role when one was chosen; otherwise
 * the role category's profile (v9 records store `cat:<category>`). Pre-v9 records that stored a
 * generic profile or a career keep the targets they were assessed against.
 */
export function targetsForRecord(rec: Pick<ResultRecord, 'roleId' | 'trackId'>): Record<string, number> {
  const roleId = rec.roleId ?? ''
  if (roleId.startsWith(LIB_PREFIX)) return resolveTargets(roleId)
  const legacyProfile = roleId !== '' && !roleId.startsWith(CATEGORY_ROLE_PREFIX)
  if (!legacyProfile && isCategoryId(rec.trackId)) return categoryTargets[rec.trackId]
  return resolveTargets(roleId)
}

/** Draft-time targets: the precise library role if chosen, otherwise the chosen category. */
export function targetsFor(roleId: string | null | undefined, trackId: string | null | undefined): Record<string, number> {
  if (roleId && roleId.startsWith(LIB_PREFIX)) return resolveTargets(roleId)
  if (isCategoryId(trackId)) return categoryTargets[trackId]
  return resolveTargets(roleId)
}

export function knowledgeView(rec: Pick<ResultRecord, 'v' | 'knowledge' | 'calibration'>, domainId: string): KnowledgeView | undefined {
  const k: KnowledgeTally | undefined = rec.knowledge?.[domainId]
  if (k && k.attempted > 0) return { attempted: k.attempted, correct: Math.min(k.correct, k.attempted) }
  if (rec.v === undefined && rec.calibration && rec.calibration[domainId] !== undefined) {
    return { attempted: null, correct: rec.calibration[domainId] }
  }
  return undefined
}

/** Agreement between the self-rating and the knowledge check; null until at least 3 attempts. */
export function knowledgeAgreement(selfScore: number, k: KnowledgeView | undefined): Agreement | null {
  if (!k || k.attempted === null || k.attempted < MIN_KNOWLEDGE_ATTEMPTS) return null
  const diff = selfScore / 4 - k.correct / k.attempted
  if (diff > AGREEMENT_TOLERANCE) return 'self_higher'
  if (diff < -AGREEMENT_TOLERANCE) return 'check_higher'
  return 'consistent'
}

const round2 = (x: number) => Math.round(x * 100) / 100

/** Evidence, reason and rank score for every domain, in domain order. */
export function assessDomains(
  record: PriorityInput,
  targets: Record<string, number>,
  domains: Pick<Domain, 'id' | 'name'>[]
): DomainEvidence[] {
  return domains.map((d) => {
    const S = clamp(record.scores[d.id] ?? 0, 0, 4)
    const rawJ = record.scenario?.[d.id]
    const J = rawJ === undefined ? undefined : clamp(rawJ, 0, 3)
    const J4 = J === undefined ? undefined : (J / 3) * 4
    const T = targets[d.id] ?? 2
    const knowledge = knowledgeView(record, d.id)
    const agreement = knowledgeAgreement(S, knowledge)

    let reason: Reason
    let gap: number
    let adj = 0
    if (J4 !== undefined && S - J4 >= JUDGMENT_MISMATCH && (S >= T || S >= HIGH_SELF)) {
      reason = S >= HIGH_SELF && agreement === 'self_higher' ? 'inflated' : 'judgment_below_self'
      gap = S - J4
      if (reason === 'inflated') adj = 0.5
      else if (agreement === 'consistent' || agreement === 'check_higher') adj = -0.5
    } else if (S < T && J4 !== undefined && J4 < T) {
      reason = 'both_below_target'
      gap = T - Math.min(S, J4)
      if (agreement === 'self_higher') adj = 0.5
      else if (agreement === 'check_higher') adj = -0.5
    } else if (S < T) {
      reason = 'self_below_target'
      gap = T - S
      if (agreement === 'self_higher') adj = 0.5
      else if (agreement === 'check_higher') adj = -0.5
      if (J4 !== undefined && J4 >= T) adj -= 0.5
    } else {
      reason = 'maintain'
      gap = 0
    }
    const cls = reason === 'self_below_target' ? 10 : reason === 'maintain' ? 0 : 20
    // maintain: the smallest margin above target ranks first (most at risk of slipping)
    const rankScore = reason === 'maintain' ? -(S - T) : cls + gap + adj
    return {
      domainId: d.id,
      domainName: d.name,
      selfScore: S,
      ...(J !== undefined ? { scenarioScore: J, judgment4: round2(J4!) } : {}),
      target: T,
      ...(knowledge ? { knowledge } : {}),
      agreement,
      reason,
      gap: round2(gap),
      rankScore,
      planScore: J4 === undefined ? S : Math.min(S, J4),
    }
  })
}

/** Where the scenario answer sits for this domain: none, at/above the target, or below it. */
type JudgmentState = 'absent' | 'at_or_above_target' | 'below_target'

const judgmentState = (e: Pick<DomainEvidence, 'judgment4' | 'target'>): JudgmentState =>
  e.judgment4 === undefined ? 'absent' : e.judgment4 >= e.target ? 'at_or_above_target' : 'below_target'

/** The second half of the «self_below_target» sentence — it must agree with the scenario shown beside it. */
const selfBelowTail: Record<JudgmentState, L> = {
  absent: { ar: 'ولا توجد إجابة موقف حكم في هذا المجال تؤكد ذلك أو تنفيه.', en: 'and there is no scenario answer in this domain to confirm or rule this out.' },
  at_or_above_target: {
    ar: 'لكن إجابتك في موقف الحكم بلغت المستهدف أو تجاوزته، فقد تكون أقرب إليه مما يوحي به تقديرك.',
    en: 'but your scenario response reached or passed the target, so you may be closer to it than your self-rating suggests.',
  },
  below_target: { ar: 'وجاءت إجابتك في موقف الحكم دون المستهدف كذلك.', en: 'and your scenario response is below the target too.' },
}

function reasonText(e: Pick<DomainEvidence, 'reason' | 'domainName' | 'judgment4' | 'target'>, basis: TargetBasis): L {
  const { reason, domainName: name } = e
  if (reason === 'maintain') {
    return {
      ar: `أنت عند المستهدف الاسترشادي أو فوقه في «${name.ar}»؛ حافظ على مستواك بمشاركة معرفتك مع غيرك.`,
      en: `You are at or above the indicative target in “${name.en}”; keep your level by sharing what you know.`,
    }
  }
  const r = reasonShort(reason, basis)
  const tail: L =
    reason === 'self_below_target'
      ? selfBelowTail[judgmentState(e)]
      : {
          both_below_target: { ar: 'فهي أولوية تطوير مقترحة يؤيدها دليلان.', en: 'so two layers of evidence point to this development priority.' },
          judgment_below_self: { ar: 'جرّب المهارة في مهمة حقيقية لتتأكد من مستواك.', en: 'try the skill on a real task to check your level.' },
          inflated: { ar: 'يُقترح التحقق منه عمليًا قبل البناء عليه.', en: 'checking it in practice is suggested before building on it.' },
        }[reason]
  return {
    ar: `في «${name.ar}»: ${r.ar}، ${tail.ar}`,
    en: `In “${name.en}”: ${r.en}; ${tail.en}`,
  }
}

function toPriority(e: DomainEvidence, rank: number, basis: TargetBasis): Priority {
  return {
    domainId: e.domainId,
    domainName: e.domainName,
    reason: e.reason,
    rank,
    selfScore: e.selfScore,
    ...(e.scenarioScore !== undefined ? { scenarioScore: e.scenarioScore } : {}),
    target: e.target,
    gap: e.gap,
    text: reasonText(e, basis),
    agreement: e.agreement,
    ...(e.knowledge ? { knowledge: e.knowledge } : {}),
    planScore: e.planScore,
    targetBasis: basis,
  }
}

const byRank = (order: Map<string, number>) => (a: DomainEvidence, b: DomainEvidence) =>
  b.rankScore - a.rankScore || b.gap - a.gap || (order.get(a.domainId)! - order.get(b.domainId)!)

/** Up to 3 ranked development priorities (or «maintain» when there is nothing to develop). */
export function priorities(
  record: PriorityInput,
  targets: Record<string, number>,
  domains: Pick<Domain, 'id' | 'name'>[]
): Priority[] {
  const evidence = assessDomains(record, targets, domains)
  const basis = targetBasisFor(record.roleId)
  const order = new Map(domains.map((d, i) => [d.id, i]))
  const develop = evidence.filter((e) => e.reason !== 'maintain').sort(byRank(order))
  const pool = develop.length ? develop : evidence.slice().sort(byRank(order))
  return pool.slice(0, MAX_PRIORITIES).map((e, i) => toPriority(e, i + 1, basis))
}

/** One headline sentence written from the reason codes (no overall score, no stage). */
export function summaryLine(list: Priority[], lang: Lang): string {
  const q = (n: L) => (lang === 'ar' ? `«${n.ar}»` : `“${n.en}”`)
  if (list.length === 0) {
    return lang === 'ar' ? 'أكمل التقييم لتظهر أولويات تطويرك المقترحة.' : 'Complete the assessment to see your suggested development priorities.'
  }
  const [first, ...rest] = list
  const owner = targetOwner[first.targetBasis ?? 'category']
  if (first.reason === 'maintain') {
    return lang === 'ar'
      ? `أنت عند المستهدف الاسترشادي ${owner.ar} أو فوقه في كل المجالات؛ خطتك للحفاظ على مستواك ومشاركة معرفتك.`
      : `You are at or above the indicative target ${owner.en} in every domain; your plan is to keep your level and share what you know.`
  }
  const why = reasonShort(first.reason, first.targetBasis ?? 'category')
  const others = rest.map((p) => q(p.domainName))
  if (lang === 'ar') {
    const tail = others.length ? ` تليها ${others.join(' و')}.` : ''
    return `أولوية تطويرك المقترحة الأولى ${q(first.domainName)}: ${why.ar}.${tail}`
  }
  const tail = others.length ? ` Then ${others.join(' and ')}.` : ''
  return `Your first suggested development priority is ${q(first.domainName)}: ${why.en}.${tail}`
}

function clamp(x: number, lo: number, hi: number) {
  return Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : lo
}
