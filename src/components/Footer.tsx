import { useApp } from '../store'

export default function Footer() {
  const { t, go } = useApp()
  const year = new Date().getFullYear()

  const columns = [
    {
      title: { ar: 'المنصة', en: 'Platform' },
      links: [
        { label: { ar: 'اكتشف التخصصات', en: 'Explore careers' }, view: 'careers' as const },
        { label: { ar: 'اختبار التوجيه', en: 'Guidance quiz' }, view: 'decide' as const },
        { label: { ar: 'تقييم المهارات', en: 'Skills assessment' }, view: 'wizard' as const },
        { label: { ar: 'المهارات أولًا أم الشهادة؟', en: 'Skills vs degree' }, view: 'lists' as const },
      ],
    },
    {
      title: { ar: 'أدوات المهنيين', en: 'Professional tools' },
      links: [
        { label: { ar: 'رادار التقنيات', en: 'Tech radar' }, view: 'tech-radar' as const },
        { label: { ar: 'الأدوار الوظيفية', en: 'Role library' }, view: 'roles' as const },
        { label: { ar: 'مسارات التطوير', en: 'Development pathways' }, view: 'pathways' as const },
        { label: { ar: 'المعايير والتقارير', en: 'Standards & reports' }, view: 'standards' as const },
      ],
    },
    {
      title: { ar: 'روابط مهمة', en: 'Important links' },
      links: [
        { label: { ar: 'هيئة الحكومة الرقمية', en: 'Digital Government Authority' }, href: 'https://dga.gov.sa' },
        { label: { ar: 'منصة قدراتك', en: 'Qudratak platform' }, href: 'https://digitalskills.dga.gov.sa' },
        { label: { ar: 'المنصة الوطنية الموحدة', en: 'GOV.SA national platform' }, href: 'https://www.my.gov.sa' },
        { label: { ar: 'أكاديمية طويق', en: 'Tuwaiq Academy' }, href: 'https://tuwaiq.edu.sa' },
      ],
    },
  ]

  return (
    <footer className="no-print mt-20 bg-dga-green-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <img src="/authority-white.png" alt="Digital Government Authority" className="h-16 w-16 object-contain" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">
              {t({
                ar: 'منصة إرشاد مهني ومهاراتي مبنية على الأدلة، تخدم رؤية السعودية 2030 في تنمية القدرات البشرية.',
                en: 'An evidence-based career and skills guidance platform, serving Saudi Vision 2030 human-capability goals.',
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
                      {'href' in link && link.href ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 no-underline hover:text-white hover:underline">
                          {t(link.label)}
                        </a>
                      ) : (
                        <button onClick={() => go((link as { view: Parameters<typeof go>[0] }).view)} className="text-sm text-white/80 hover:text-white hover:underline">
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 text-xs text-white/70 sm:flex-row">
          <p>
            {t({
              ar: `جميع الحقوق محفوظة — منصة المهارات الرقمية © ${year} · بمحتوى مستند إلى تقارير WEF وILO وOECD وMcKinsey`,
              en: `All rights reserved — Digital Skills Platform © ${year} · Content grounded in WEF, ILO, OECD & McKinsey research`,
            })}
          </p>
          <p className="font-semibold text-white/90">{t({ ar: 'رؤية السعودية 2030', en: 'Saudi Vision 2030' })}</p>
        </div>
      </div>
    </footer>
  )
}
