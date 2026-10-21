import { useApp } from '../store'
import { RadarMark } from './Header'

export default function Footer() {
  const { t, go } = useApp()

  const columns: {
    title: { ar: string; en: string }
    links: ({ label: { ar: string; en: string }; view: Parameters<typeof go>[0] } | { label: { ar: string; en: string }; href: string })[]
  }[] = [
    {
      title: { ar: 'المنصة', en: 'Platform' },
      links: [
        { label: { ar: 'تقييم المهارات', en: 'Skills assessment' }, view: 'wizard' },
        { label: { ar: 'النتائج والرادار', en: 'Results & radar' }, view: 'results' },
        { label: { ar: 'مسارات التطوير', en: 'Development pathways' }, view: 'pathways' },
        { label: { ar: 'المعايير والتقارير', en: 'Standards & reports' }, view: 'standards' },
        { label: { ar: 'سجل المهارات', en: 'Skill registry' }, view: 'skills' },
        { label: { ar: 'المنهجية وسجل التغييرات', en: 'Methodology & changelog' }, view: 'methodology' },
      ],
    },
    {
      title: { ar: 'التوجيه المهني', en: 'Career guidance' },
      links: [
        { label: { ar: 'اكتشف التخصصات', en: 'Explore careers' }, view: 'careers' },
        { label: { ar: 'اختبار التوجيه', en: 'Guidance quiz' }, view: 'decide' },
        { label: { ar: 'مهارات المستقبل', en: 'Future skills' }, view: 'future-skills' },
        { label: { ar: 'ما يزدهر وما يندثر', en: 'Growing vs declining' }, view: 'lists' },
        { label: { ar: 'للجهات الحكومية', en: 'For government entities' }, view: 'entities' },
        { label: { ar: 'أثر تمكين الجهات', en: 'Enablement impact' }, view: 'impact' },
        { label: { ar: 'القطاعات الحكومية', en: 'Government sectors' }, view: 'sectors' },
        { label: { ar: 'دليل الجهات', en: 'Entity directory' }, view: 'directory' },
        { label: { ar: 'رادار التقنيات', en: 'Tech radar' }, view: 'tech-radar' },
      ],
    },
    {
      title: { ar: 'مصادر التعلم', en: 'Learning resources' },
      links: [
        { label: { ar: 'أكاديمية طويق', en: 'Tuwaiq Academy' }, href: 'https://tuwaiq.edu.sa' },
        { label: { ar: 'الأكاديمية السعودية الرقمية', en: 'Saudi Digital Academy' }, href: 'https://sda.edu.sa' },
        { label: { ar: 'كورسيرا', en: 'Coursera' }, href: 'https://www.coursera.org' },
        { label: { ar: 'إطار SFIA', en: 'SFIA Framework' }, href: 'https://sfia-online.org' },
      ],
    },
  ]

  return (
    <footer className="no-print mt-20 bg-dga-green-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <RadarMark className="h-11 w-11 brightness-0 invert" />
              <span className="text-lg font-bold">{t({ ar: 'رادار المهارات الرقمية', en: 'Digital Skills Radar' })}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">
              {t({
                ar: 'منصة إرشاد مهني ومهاري مبنية على أدلة عالمية.',
                en: 'A career and skills guidance platform built on global evidence.',
              })}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title.en}>
                <h3 className="border-b border-white/20 pb-2 text-base font-semibold">{t(col.title)}</h3>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label.en}>
                      {'href' in link ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/80 no-underline hover:text-white hover:underline"
                        >
                          {t(link.label)}
                        </a>
                      ) : (
                        <button onClick={() => go(link.view)} className="text-sm text-white/80 hover:text-white hover:underline">
                          {t(link.label)}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-6 text-center text-xs text-white/70 sm:flex-row sm:text-start">
          <p>
            {t({
              ar: 'نموذج مفاهيمي مستلهم من الأطر العالمية (WEF, ILO, OECD, SFIA, DigComp) — غير تابع لأي جهة رسمية.',
              en: 'A concept prototype inspired by global frameworks (WEF, ILO, OECD, SFIA, DigComp) — not affiliated with any official entity.',
            })}
          </p>
          <p>{t({ ar: 'كل بياناتك تُحفظ محليًا في متصفحك فقط', en: 'All your data is stored locally in your browser only' })}</p>
        </div>
      </div>
    </footer>
  )
}
