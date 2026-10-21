import { useCallback, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../../store'
import type { View } from '../../store'
import type { L, Lang } from '../../data/types'
import { pathFor } from '../../lib/routes'

/** «ابدأ التقييم» or «أكمل تقييمك» (draft or saved result), and where it leads. */
export function useAssessCta(): { label: L; view: View; to: string; resuming: boolean } {
  const { answers, history, lang } = useApp()
  const hasDraft = Object.keys(answers ?? {}).length > 0
  const hasHistory = (history ?? []).length > 0
  const resuming = hasDraft || hasHistory
  const view: View = hasDraft || !hasHistory ? 'wizard' : 'results'
  // a draft in progress → resume; a saved result and no draft → my result; nothing → start
  const label: L = hasDraft
    ? { ar: 'أكمل تقييمك', en: 'Resume assessment' }
    : hasHistory
      ? { ar: 'نتيجتي', en: 'My result' }
      : { ar: 'ابدأ التقييم', en: 'Start the assessment' }
  return {
    label,
    view,
    to: pathFor(view, lang),
    resuming,
  }
}

/** The same page in the other language, keeping search and hash. */
export function useOtherLanguage(): { lang: Lang; to: { pathname: string; search: string; hash: string }; name: string; hint: L } {
  const { lang } = useApp()
  const location = useLocation()
  const next: Lang = lang === 'ar' ? 'en' : 'ar'
  const pathname = /^\/(ar|en)(?=\/|$)/.test(location.pathname)
    ? location.pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${next}`)
    : `/${next}`
  return {
    lang: next,
    to: { pathname, search: location.search, hash: location.hash },
    name: next === 'en' ? 'English' : 'العربية',
    hint: next === 'en' ? { ar: 'عرض الصفحة بالإنجليزية', en: 'View this page in English' } : { ar: 'عرض الصفحة بالعربية', en: 'View this page in Arabic' },
  }
}

/**
 * WAI-ARIA tabs with a roving tabindex and automatic activation.
 * Arrow keys follow the reading direction (in RTL, ArrowLeft moves forward); Up/Down, Home and End also work.
 */
export function useTabs(count: number, initial = 0) {
  const { dir } = useApp()
  const base = `tabs-${useId().replace(/:/g, '')}`
  const [index, setIndex] = useState(initial)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      const fwd = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      let next: number | null = null
      if (e.key === fwd || e.key === 'ArrowDown') next = (index + 1) % count
      else if (e.key === back || e.key === 'ArrowUp') next = (index - 1 + count) % count
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = count - 1
      if (next === null) return
      e.preventDefault()
      setIndex(next)
      refs.current[next]?.focus()
    },
    [count, dir, index]
  )

  const tabProps = (i: number) => ({
    role: 'tab' as const,
    id: `${base}-tab-${i}`,
    'aria-selected': i === index,
    'aria-controls': `${base}-panel-${i}`,
    tabIndex: i === index ? 0 : -1,
    ref: (el: HTMLButtonElement | null) => {
      refs.current[i] = el
    },
    onClick: () => setIndex(i),
    onKeyDown,
    type: 'button' as const,
  })

  const panelProps = (i: number) => ({
    role: 'tabpanel' as const,
    id: `${base}-panel-${i}`,
    'aria-labelledby': `${base}-tab-${i}`,
    hidden: i !== index,
    tabIndex: 0,
  })

  return { index, setIndex, tabProps, panelProps }
}

/** Direction-aware arrow glyph for «go» links. */
export function useArrow(): string {
  const { lang } = useApp()
  return lang === 'ar' ? '←' : '→'
}
