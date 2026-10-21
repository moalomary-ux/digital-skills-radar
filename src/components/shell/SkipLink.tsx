import type { MouseEvent } from 'react'
import { useApp } from '../../store'

/** First focusable element on every page: jumps to `#main` without changing the URL. */
export default function SkipLink() {
  const { t } = useApp()
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById('main')
    if (!main) return
    e.preventDefault()
    main.focus()
    main.scrollIntoView?.({ block: 'start' })
  }
  return (
    <a href="#main" onClick={onClick} className="skip-link">
      {t({ ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' })}
    </a>
  )
}
