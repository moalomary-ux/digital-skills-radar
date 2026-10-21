import { useEffect, useRef } from 'react'
import type { KeyboardEvent, RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { pathFor } from '../../lib/routes'
import { hubForView, hubs, SOON } from './site'
import { useArrow, useAssessCta } from './hooks'
import LangLink from './LangLink'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface DrawerProps {
  id: string
  open: boolean
  onClose: () => void
  /** the menu button: focus returns there when the drawer closes */
  returnFocusRef: RefObject<HTMLButtonElement>
}

/**
 * Mobile and tablet navigation (< 1024 px): a modal panel listing every hub and its pages.
 * Keyboard: focus moves inside on open, Tab is trapped, Esc closes and returns focus to the menu button.
 * The header closes it on every route change.
 */
export default function Drawer({ id, open, onClose, returnFocusRef }: DrawerProps) {
  const { t, lang, view, history } = useApp()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const cta = useAssessCta()
  const arrow = useArrow()
  const activeHub = hubForView(view)
  const titleId = `${id}-title`

  // focus in on open, back to the menu button on close; lock page scroll while open
  useEffect(() => {
    if (!open) return
    const returnTo = returnFocusRef.current
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      // only reclaim focus if it is still inside the (now closing) drawer or on the body
      const active = document.activeElement
      if (!active || active === document.body || panelRef.current?.contains(active)) returnTo?.focus()
    }
  }, [open, returnFocusRef])

  if (!open) return null

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab' || !panelRef.current) return
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (items.length === 0) return
    const firstEl = items[0]
    const lastEl = items[items.length - 1]
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault()
      lastEl.focus()
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault()
      firstEl.focus()
    }
  }

  return (
    <div className="site-drawer fixed inset-0 z-50 lg:hidden" onKeyDown={onKeyDown}>
      <div className="drawer-backdrop absolute inset-0 bg-dga-green-ink/40" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="drawer-panel absolute inset-y-0 end-0 flex w-[min(24rem,92vw)] flex-col bg-white shadow-card-lg"
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-dga-line px-4">
          <p id={titleId} className="text-base font-bold text-dga-black">
            {t({ ar: 'أقسام الرادار', en: 'Radar sections' })}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-btn border border-dga-line text-dga-ink hover:border-dga-green"
            aria-label={t({ ar: 'إغلاق القائمة', en: 'Close the menu' })}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label={t({ ar: 'كل الأقسام', en: 'All sections' })} className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          <ul className="space-y-1">
            {hubs.map((hub) => {
              const items = hub.items.filter((it) => !it.needsHistory || history.length > 0)
              const hubActive = activeHub?.id === hub.id
              return (
                <li key={hub.id} className="border-b border-dga-line/70 pb-3 pt-2 last:border-0">
                  <Link
                    to={pathFor(hub.view, lang)}
                    onClick={onClose}
                    aria-current={view === hub.view ? 'page' : hubActive ? 'true' : undefined}
                    className={`block rounded-btn py-1.5 text-base font-bold no-underline ${hubActive ? 'text-dga-green-dark' : 'text-dga-black'}`}
                  >
                    {t(hub.title)}
                  </Link>
                  <ul className="mt-1 space-y-0.5 border-s-2 border-dga-line ps-3">
                    {items.map((it) => (
                        <li key={it.view}>
                          {it.soon ? (
                            <span className="flex items-center gap-2 py-1.5 text-sm text-dga-muted">
                              {t(it.label)}
                              <span className="chip text-[11px]">{t(SOON)}</span>
                            </span>
                          ) : (
                            <Link
                              to={pathFor(it.view, lang)}
                              onClick={onClose}
                              aria-current={view === it.view ? 'page' : undefined}
                              className={`block rounded-btn py-1.5 text-sm no-underline ${
                                view === it.view ? 'font-semibold text-dga-green-dark' : 'text-dga-ink hover:text-dga-green-dark'
                              }`}
                            >
                              {t(it.label)}
                            </Link>
                          )}
                        </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="shrink-0 space-y-2 border-t border-dga-line p-4">
          <Link to={cta.to} onClick={onClose} className="btn-primary w-full no-underline hover:no-underline">
            {t(cta.label)}
            <span aria-hidden="true">{arrow}</span>
          </Link>
          <LangLink onNavigate={onClose} className="btn-ghost w-full no-underline hover:no-underline" />
        </div>
      </div>
    </div>
  )
}
