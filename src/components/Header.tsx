import { useApp } from '../store'
import type { View } from '../store'

/** Product brand mark — a radar: concentric rings, sweep, blips. */
export function RadarMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="#1B8354" strokeWidth="2" />
      <circle cx="20" cy="20" r="11.5" stroke="#1B8354" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.65" />
      <circle cx="20" cy="20" r="5" stroke="#1B8354" strokeWidth="1.4" opacity="0.4" />
      <line x1="20" y1="20" x2="32.5" y2="9.5" stroke="#DBA102" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.4" fill="#1B8354" />
      <circle cx="27.5" cy="25" r="2.2" fill="#DBA102" />
      <circle cx="13" cy="13.5" r="2.2" fill="#167248" />
      <circle cx="25" cy="12" r="1.7" fill="#1B8354" opacity="0.7" />
    </svg>
  )
}

const moreItems: { view: View; ar: string; en: string }[] = [
  { view: 'entities', ar: 'للجهات الحكومية', en: 'For Entities' },
  { view: 'impact', ar: 'أثر تمكين الجهات', en: 'Enablement Impact' },
  { view: 'sectors', ar: 'القطاعات الحكومية', en: 'Government Sectors' },
  { view: 'directory', ar: 'دليل الجهات', en: 'Entity Directory' },
  { view: 'lists', ar: 'ما يزدهر وما يندثر', en: 'Growing vs declining' },
  { view: 'tech-radar', ar: 'رادار التقنيات', en: 'Tech Radar' },
  { view: 'roles', ar: 'الأدوار الوظيفية', en: 'Role Library' },
  { view: 'standards', ar: 'المعايير والتقارير', en: 'Standards & Reports' },
  { view: 'skills', ar: 'سجل المهارات', en: 'Skill Registry' },
  { view: 'methodology', ar: 'المنهجية', en: 'Methodology' },
]

export default function Header() {
  const { lang, toggleLang, view, go, history } = useApp()
  const assessed = history.length > 0

  // Core journey first; results/pathways appear only after an assessment exists
  const mainItems: { view: View; ar: string; en: string }[] = [
    { view: 'home', ar: 'الرئيسية', en: 'Home' },
    { view: 'wizard', ar: 'تقييم المهارات', en: 'Skills Assessment' },
    { view: 'future-skills', ar: 'مهارات المستقبل', en: 'Future Skills' },
    ...(assessed
      ? [
          { view: 'results' as View, ar: 'النتائج', en: 'Results' },
          { view: 'pathways' as View, ar: 'مسارات التطوير', en: 'Pathways' },
        ]
      : []),
    { view: 'careers', ar: 'اكتشف التخصصات', en: 'Explore Careers' },
    { view: 'explore', ar: 'الخريطة التفاعلية', en: 'Interactive Map' },
    { view: 'decide', ar: 'اختبار التوجيه', en: 'Guidance Quiz' },
  ]

  const linkCls = (v: View) =>
    `py-2 text-[15px] transition-colors ${
      view === v
        ? 'font-semibold text-dga-green-dark underline decoration-dga-green decoration-2 underline-offset-8'
        : 'text-dga-ink hover:text-dga-green-dark'
    }`

  const moreActive = moreItems.some((m) => m.view === view)

  return (
    <header className="no-print sticky top-0 z-40 border-b border-dga-line bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button onClick={() => go('home')} className="flex items-center gap-3 text-start">
          <RadarMark />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-dga-black">
              {lang === 'ar' ? 'رادار المهارات الرقمية' : 'Digital Skills Radar'}
            </span>
            <span className="block text-[11px] text-dga-muted">
              {lang === 'ar' ? 'Digital Skills Radar' : 'رادار المهارات الرقمية'}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-5 xl:flex">
          {mainItems.map((n) => (
            <button key={n.view} onClick={() => go(n.view)} className={linkCls(n.view)}>
              {lang === 'ar' ? n.ar : n.en}
            </button>
          ))}

          {/* grouped secondary tools */}
          <div className="group relative">
            <button
              className={`flex items-center gap-1 py-2 text-[15px] transition-colors ${
                moreActive ? 'font-semibold text-dga-green-dark' : 'text-dga-ink hover:text-dga-green-dark'
              }`}
              aria-haspopup="true"
            >
              {lang === 'ar' ? 'أدوات متخصصة' : 'Pro tools'}
              <span className="text-xs transition-transform group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden>▾</span>
            </button>
            <div className="invisible absolute end-0 top-full z-50 w-56 rounded-card border border-dga-line bg-white p-2 opacity-0 shadow-card-lg transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {moreItems.map((m) => (
                <button
                  key={m.view}
                  onClick={() => go(m.view)}
                  className={`block w-full rounded-btn px-3 py-2 text-start text-sm transition-colors ${
                    view === m.view ? 'bg-dga-green/10 font-semibold text-dga-green-dark' : 'text-dga-ink hover:bg-dga-bg'
                  }`}
                >
                  {lang === 'ar' ? m.ar : m.en}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleLang}
            className="rounded-btn border border-dga-line px-3 py-1.5 text-sm text-dga-ink transition-colors hover:border-dga-green hover:text-dga-green-dark"
            aria-label="toggle language"
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          <button onClick={() => go('wizard')} className="btn-primary hidden px-4 py-1.5 text-sm md:inline-flex">
            {lang === 'ar' ? 'ابدأ التقييم' : 'Start assessment'}
          </button>
        </div>
      </div>

      {/* mobile nav — flat scrollable row */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-dga-line bg-white px-3 py-2 xl:hidden">
        {[...mainItems, ...moreItems].map((n) => (
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
