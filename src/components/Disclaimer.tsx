import { useApp } from '../store'
import type { L } from '../data/types'

/** The binding development-only guard (DECISION §6; plan P2 item 6): step 0, results and print. */
export const devOnlyNotice: L = {
  ar: 'للتطوير الذاتي فقط — لا يُستخدم في التقييم الوظيفي أو الترقية أو المفاضلة.',
  en: 'For self-development only — not for performance appraisal, promotion or selection.',
}

export const selfAssessmentNote: L = {
  ar: 'هذا تقييم ذاتي يساعدك على استكشاف أولويات تطويرك، وليس قياسًا نفسيًا معتمدًا. المستهدفات استرشادية، والأولويات مقترحة لحوار تطويري مع مديرك.',
  en: 'This is a self-assessment that helps you explore your development priorities; it is not a validated psychometric measure. Targets are indicative, and the priorities are suggestions for a development conversation with your manager.',
}

/**
 * Development-only notice for government employees, shown before any assessment output.
 * `compact` shows the guard sentence only.
 */
export default function Disclaimer({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  const { t } = useApp()
  return (
    <div
      role="note"
      className={`rounded-btn border border-dga-amber/50 bg-dga-amber/5 text-dga-ink ${compact ? 'px-4 py-2.5 text-xs' : 'px-5 py-3.5 text-sm'} ${className}`}
    >
      <p className="font-bold text-[#8A6A00]">{t(devOnlyNotice)}</p>
      {!compact && <p className="mt-1 leading-relaxed">{t(selfAssessmentNote)}</p>}
    </div>
  )
}
