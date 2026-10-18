import { useApp } from '../store'
import type { View } from '../store'

const navItems: { view: View; ar: string; en: string }[] = [
  { view: 'home', ar: 'الرئيسية', en: 'Home' },
  { view: 'careers', ar: 'اكتشف التخصصات', en: 'Explore Careers' },
  { view: 'decide', ar: 'اختبار التوجيه', en: 'Guidance Quiz' },
  { view: 'wizard', ar: 'تقييم المهارات', en: 'Skills Assessment' },
  { view: 'tech-radar', ar: 'رادار التقنيات', en: 'Tech Radar' },
  { view: 'roles', ar: 'الأدوار الوظيفية', en: 'Role Library' },
  { view: 'standards', ar: 'المعايير', en: 'Standards' },
]

export default function Header() {
  const { lang, toggleLang, view, go } = useApp()
  return (
    <header className="no-print sticky top-0 z-40 border-b border-dga-line bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button onClick={() => go('home')} className="flex items-center gap-3 text-start">
          <img src="/authority-color.png" alt="هيئة الحكومة الرقمية" className="h-9 w-9 object-contain" />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-dga-black">
              {lang === 'ar' ? 'المهارات الرقمية' : 'Digital Skills'}
            </span>
            <span className="block text-[11px] text-dga-muted">
              {lang === 'ar' ? 'Digital Skills' : 'المهارات الرقمية'}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((n) => (
            <button
              key={n.view}
              onClick={() => go(n.view)}
              className={`py-2 text-base transition-colors ${
                view === n.view
                  ? 'font-semibold text-dga-green-dark underline decoration-dga-green decoration-2 underline-offset-8'
                  : 'text-dga-ink hover:text-dga-green-dark'
              }`}
            >
              {lang === 'ar' ? n.ar : n.en}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="https://www.my.gov.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-btn bg-dga-green-ink px-3.5 py-1.5 text-sm font-semibold text-white no-underline hover:bg-dga-green-dark sm:block"
          >
            GOV.SA
          </a>
          <button
            onClick={toggleLang}
            className="rounded-btn border border-dga-line px-3 py-1.5 text-sm text-dga-ink transition-colors hover:border-dga-green hover:text-dga-green-dark"
            aria-label="toggle language"
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          <button onClick={() => go('wizard')} className="btn-primary hidden px-4 py-1.5 text-sm md:inline-flex">
            {lang === 'ar' ? 'ابدأ الآن' : 'Start now'}
          </button>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-dga-line bg-white px-3 py-2 xl:hidden">
        {navItems.map((n) => (
          <button
            key={n.view}
            onClick={() => go(n.view)}
            className={`whitespace-nowrap rounded-btn px-3 py-1.5 text-xs transition-colors ${
              view === n.view ? 'bg-dga-green font-semibold text-white' : 'text-dga-muted'
            }`}
          >
            {lang === 'ar' ? n.ar : n.en}
          </button>
        ))}
      </nav>
    </header>
  )
}
