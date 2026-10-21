import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { ASSESS_VIEWS } from './site'
import { useArrow, useAssessCta } from './hooks'

/** Below 1024 px: a fixed bottom «ابدأ التقييم» / «أكمل تقييمك» button (hidden inside the assessment and in print). */
export function useStickyCtaVisible(): boolean {
  const { view } = useApp()
  return !ASSESS_VIEWS.includes(view)
}

export default function StickyCta() {
  const { t } = useApp()
  const visible = useStickyCtaVisible()
  const cta = useAssessCta()
  const arrow = useArrow()
  if (!visible) return null
  return (
    <div className="sticky-cta fixed inset-x-0 bottom-0 z-30 border-t border-dga-line bg-white/95 px-4 pt-2.5 backdrop-blur lg:hidden">
      <Link to={cta.to} className="btn-primary w-full py-3 text-base no-underline hover:no-underline">
        {t(cta.label)}
        <span aria-hidden="true">{arrow}</span>
      </Link>
    </div>
  )
}
