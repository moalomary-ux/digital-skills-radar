import { useApp } from '../store'

/**
 * Honest scope disclaimer — shown before any assessment/decision output.
 * (Expert review P0-8: the tool is a structured reflection & development-
 * planning aid, not a validated psychometric instrument or a substitute
 * for a human career counselor.)
 */
export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  const { t } = useApp()
  return (
    <div
      role="note"
      className={`rounded-btn border border-dga-amber/50 bg-dga-amber/5 text-dga-ink ${
        compact ? 'px-4 py-2.5 text-xs' : 'px-5 py-3.5 text-sm'
      }`}
    >
      <span className="font-bold text-[#8A6A00]">{t({ ar: 'تنبيه: ', en: 'Note: ' })}</span>
      {t({
        ar: 'هذه أداة تأمل وتخطيط تطويري — ليست قياسًا نفسيًا معتمدًا، ولا بديلًا عن الموجه المهني أو عن شروط القبول الرسمية. الترشيحات ميكانيكية استرشادية والتوقعات ليست ضمانًا.',
        en: 'This is a reflection and development-planning tool — not a validated psychometric assessment, and no substitute for a human career counselor or official admission requirements. Matches are mechanical guidance and projections are not guarantees.',
      })}
    </div>
  )
}
