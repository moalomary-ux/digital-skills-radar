import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const location = useLocation()
  // Capture the outlet so the departing page retains its content during exit.
  const outlet = useOutlet()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div role="status" className="flex min-h-48 items-center justify-center gap-2 text-dga-muted">
            <span lang="ar" dir="rtl">جارٍ التحميل…</span>
            <span aria-hidden="true">/</span>
            <span lang="en" dir="ltr">Loading…</span>
          </div>
        }>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
