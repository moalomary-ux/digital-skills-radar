import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import { RadarMark } from './Brand'
import LangLink from './shell/LangLink'
import { DATA_UPDATED_ON, formatDay, hubs, INDEPENDENCE, SITE_NAME } from './shell/site'

/** Four columns: the hubs · about, privacy, evidence · language · last data update — then the independence line. */
export default function Footer() {
  const { t, lang } = useApp()
  const linkCls = 'text-sm text-white/85 no-underline hover:text-white hover:underline'
  const headCls = 'border-b border-white/20 pb-2 text-sm font-semibold text-white'

  return (
    <footer className="site-footer no-print mt-20 bg-dga-green-ink text-white">
      <div className="saudi-band opacity-70" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <RadarMark className="h-10 w-10 brightness-0 invert" />
          <p className="text-lg font-bold">{t(SITE_NAME)}</p>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
          {t({
            ar: 'أداة مفتوحة لدعم قرارات تطوير القوى العاملة الحكومية: كيف يتغير العمل، وما القدرات المطلوبة، وكيف نطورها.',
            en: 'An open tool for government workforce development decisions: how work is changing, which capabilities it needs, and how to build them.',
          })}
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label={t({ ar: 'أقسام الرادار', en: 'Radar sections' })}>
            <h2 className={headCls}>{t({ ar: 'الأقسام', en: 'Sections' })}</h2>
            <ul className="mt-3 space-y-2">
              {hubs.map((hub) => (
                <li key={hub.id}>
                  <Link to={pathFor(hub.view, lang)} className={linkCls}>
                    {t(hub.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headCls}>{t({ ar: 'عن المفهوم', en: 'About' })}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to={pathFor('about', lang)} className={linkCls}>
                  {t({ ar: 'عن المفهوم ومن أعدّه', en: 'About the concept and its author' })}
                </Link>
              </li>
              <li>
                <Link to={`${pathFor('about', lang)}#privacy`} className={linkCls}>
                  {t({ ar: 'الخصوصية', en: 'Privacy' })}
                </Link>
              </li>
              <li>
                <Link to={pathFor('evidence', lang)} className={linkCls}>
                  {t({ ar: 'سجل الأدلة', en: 'Evidence register' })}
                </Link>
              </li>
              <li>
                <Link to={pathFor('methodology', lang)} className={linkCls}>
                  {t({ ar: 'المنهجية', en: 'Methodology' })}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headCls}>{t({ ar: 'اللغة', en: 'Language' })}</h2>
            <p className="mt-3 text-sm text-white/85">
              {t({ ar: 'تعرض الآن: العربية', en: 'Now showing: English' })}
            </p>
            <LangLink className="mt-2 inline-flex rounded-btn border border-white/40 px-3 py-1.5 text-sm text-white no-underline hover:border-white hover:no-underline" />
          </div>

          <div>
            <h2 className={headCls}>{t({ ar: 'آخر تحديث للبيانات', en: 'Last data update' })}</h2>
            <p className="mt-3 text-sm text-white/85">
              <time dateTime={DATA_UPDATED_ON}>{formatDay(DATA_UPDATED_ON, lang)}</time>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              {t({
                ar: 'كل رقم معروض مسجل بمصدره وتاريخ مراجعته في سجل الأدلة.',
                en: 'Every figure shown is registered with its source and review date in the evidence register.',
              })}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/20 pt-6 text-xs leading-relaxed text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-white">{t(INDEPENDENCE)}</p>
          <p>
            {t({ ar: 'لا يغادر أي شيء متصفحك: لا حسابات ولا تحليلات ولا ملفات تتبع.', en: 'Nothing leaves your browser: no accounts, no analytics, no tracking.' })}
          </p>
        </div>
      </div>
    </footer>
  )
}
