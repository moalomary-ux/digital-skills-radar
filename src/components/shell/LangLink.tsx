import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { useOtherLanguage } from './hooks'

/**
 * The same page in the other language — a real link (new tab, copy link, crawlable). The visible name is the
 * target language in its own script; the hint in the current UI language is part of the accessible name.
 */
export default function LangLink({ className = '', onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { t } = useApp()
  const other = useOtherLanguage()
  return (
    <Link to={other.to} hrefLang={other.lang} onClick={onNavigate} className={className}>
      <span lang={other.lang}>{other.name}</span>
      <span className="sr-only"> — {t(other.hint)}</span>
    </Link>
  )
}
