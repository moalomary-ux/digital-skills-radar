import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import { RadarMark } from '../components/Brand'
import { hubs } from '../components/shell/site'

/** Bilingual 404 (the URL may carry no language), with a way back to every section. */
export default function NotFound() {
  const { lang, t } = useApp()
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <RadarMark className="mx-auto h-14 w-14 opacity-80" />
      <h1 className="mt-4 text-3xl font-bold text-dga-ink">404</h1>
      <p lang="ar" dir="rtl" className="mt-4 text-dga-muted">الصفحة غير موجودة</p>
      <p lang="en" dir="ltr" className="mt-2 text-dga-muted">Page not found</p>
      <Link to={pathFor('home', lang)} className="btn-primary mt-6 inline-flex gap-2 no-underline hover:no-underline">
        <span lang="ar" dir="rtl">العودة للرئيسية</span>
        <span aria-hidden="true">/</span>
        <span lang="en" dir="ltr">Back home</span>
      </Link>
      <nav aria-label={t({ ar: 'إلى أين بعد ذلك', en: 'Where to go next' })} className="mt-10">
        <ul className="flex flex-wrap justify-center gap-2">
          {hubs.map((h) => (
            <li key={h.id}>
              <Link to={pathFor(h.view, lang)} className="chip !px-3 !py-1.5 !text-sm no-underline hover:border-dga-green hover:no-underline">
                {t(h.title)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
