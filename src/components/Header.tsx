import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import Brand from './Brand'
import Drawer from './shell/Drawer'
import LangLink from './shell/LangLink'
import { hubForView, hubs } from './shell/site'
import { useAssessCta } from './shell/hooks'
import type { L } from '../data/types'

export { RadarMark } from './Brand'

/**
 * The header button's words follow the state behind `useAssessCta`:
 *   a draft in progress (answers exist; saving a result clears them) → «أكمل تقييمك» → the assessment
 *   a saved result and no newer draft                                  → «نتيجتي»     → the results
 *   nothing yet                                                        → «ابدأ التقييم» → the assessment
 */
const MY_RESULTS: L = { ar: 'نتيجتي', en: 'My results' }

/**
 * Site header: brand, the six hubs as real links (≥ 1024 px), language link, and the persistent assessment
 * button. Below 1024 px the hubs move into a keyboard-operable drawer and the button into a sticky bar.
 * No hover-only menus.
 */
export default function Header() {
  const { t, lang, view } = useApp()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const cta = useAssessCta()
  const ctaLabel = cta.view === 'results' ? MY_RESULTS : cta.label
  const activeHub = hubForView(view)
  const drawerId = 'site-drawer'

  // close the drawer on every navigation (including back/forward)
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
    <header className="site-header no-print sticky top-0 z-40 border-b border-dga-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-4">
        <Brand compactUntilXl />

        <nav aria-label={t({ ar: 'الأقسام الرئيسية', en: 'Main sections' })} className="hidden min-w-0 flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-0 xl:gap-1.5">
            {hubs.map((hub) => {
              const active = activeHub?.id === hub.id
              return (
                <li key={hub.id}>
                  <Link
                    to={pathFor(hub.view, lang)}
                    aria-current={view === hub.view ? 'page' : active ? 'true' : undefined}
                    className={`nav-link block whitespace-nowrap rounded-btn px-1.5 py-2 text-[13px] leading-snug no-underline hover:no-underline xl:px-2.5 xl:text-nav ${
                      active ? 'is-active font-semibold text-dga-green-dark' : 'text-dga-ink hover:text-dga-green-dark'
                    }`}
                  >
                    {t(hub.nav)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2 lg:ms-0">
          <LangLink className="whitespace-nowrap rounded-btn border border-dga-line px-2.5 py-1.5 text-[13px] xl:text-nav text-dga-ink no-underline transition-colors hover:border-dga-green hover:text-dga-green-dark hover:no-underline" />
          <Link
            to={cta.to}
            className="btn-primary hidden whitespace-nowrap px-3 py-2 text-[13px] no-underline hover:no-underline lg:inline-flex xl:px-3.5 xl:text-nav"
          >
            {t(ctaLabel)}
          </Link>
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            className="flex h-10 min-w-10 items-center justify-center gap-2 rounded-btn border border-dga-line px-2.5 text-sm font-semibold text-dga-ink transition-colors hover:border-dga-green lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <span className="sr-only sm:not-sr-only">{t({ ar: 'القائمة', en: 'Menu' })}</span>
          </button>
        </div>
      </div>
    </header>
    {/* outside <header>: its backdrop-filter would otherwise trap the fixed drawer inside the bar */}
    <Drawer id={drawerId} open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={menuBtn} />
    </>
  )
}
