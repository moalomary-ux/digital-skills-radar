import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'

export default function NotFound() {
  const { lang } = useApp()
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-dga-ink">404</h1>
      <p lang="ar" dir="rtl" className="mt-4 text-dga-muted">الصفحة غير موجودة</p>
      <p lang="en" dir="ltr" className="mt-2 text-dga-muted">Page not found</p>
      <Link to={pathFor('home', lang)} className="btn-primary mt-6 inline-flex gap-2">
        <span lang="ar" dir="rtl">العودة للرئيسية</span>
        <span aria-hidden="true">/</span>
        <span lang="en" dir="ltr">Back home</span>
      </Link>
    </section>
  )
}
