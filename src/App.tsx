import { Suspense } from 'react'
import { ScrollRestoration, useLocation, useOutlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import SkipLink from './components/shell/SkipLink'
import RouteFocus from './components/shell/RouteFocus'
import StickyCta, { useStickyCtaVisible } from './components/shell/StickyCta'

/**
 * App shell: skip link → header → main#main (focus target) → footer, plus the mobile sticky assessment button.
 * No page-level AnimatePresence: views mount once, keep their state, and are never hidden by an exit
 * animation (print and background tabs included). A light CSS entrance plays per page instead.
 */
export default function App() {
  const location = useLocation()
  const outlet = useOutlet()
  const stickyCta = useStickyCtaVisible()
  // same page in the other language keeps its state: the key ignores the /ar or /en prefix
  const pageKey = location.pathname.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'

  return (
    <div className={`flex min-h-screen flex-col ${stickyCta ? 'pb-20 lg:pb-0' : ''}`}>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense
          fallback={
            <div role="status" data-route-loading="" className="flex min-h-48 items-center justify-center gap-2 text-dga-muted">
              <span lang="ar" dir="rtl">جارٍ التحميل…</span>
              <span aria-hidden="true">/</span>
              <span lang="en" dir="ltr">Loading…</span>
            </div>
          }
        >
          <div key={pageKey} className="page-fade">
            {outlet}
          </div>
        </Suspense>
      </main>
      <Footer />
      <StickyCta />
      <RouteFocus />
      <ScrollRestoration />
    </div>
  )
}
