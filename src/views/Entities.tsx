import { motion } from 'framer-motion'
import { useApp } from '../store'
import { playbookKpis, playbookSections } from '../data/futureSkills'
import Icon from '../components/Icon'

export default function Entities() {
  const { t, go, lang } = useApp()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'دليل التبني المؤسسي', en: 'The institutional adoption guide' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">
          {t({ ar: 'للجهات الحكومية', en: 'For Government Entities' })}
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'ما الذي تحتاجه جهة حكومية لتبني رادار المهارات الرقمية لقواها العاملة — حوكمة وتخصيص ومؤشرات وتكامل وخصوصية. صُمم ليُقرأ في جلسة واحدة.',
            en: 'What a government entity needs to adopt the Digital Skills Radar for its workforce — governance, customization, KPIs, integration and privacy. Designed to be read in one sitting.',
          })}
        </p>
        <button onClick={() => go('methodology')} className="btn-ghost mt-4 px-4 py-2 text-sm">
          {t({ ar: 'اقرأ المنهجية وسجل التغييرات', en: 'Read the methodology & changelog' })}
          <span aria-hidden> {lang === 'ar' ? '←' : '→'}</span>
        </button>
      </div>

      {/* v7: live government data views */}
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-dga-green-dark">
          {t({ ar: 'بيانات الجهات الحكومية — أرقام حقيقية', en: 'Government entity data — real figures' })}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              {
                icon: 'radar',
                view: 'impact' as const,
                title: { ar: 'أثر تمكين الجهات', en: 'Enablement Impact' },
                desc: {
                  ar: '421 جهة مستفيدة، 7,915 سجلًا تدريبيًا، 2,873 خدمة استشارية — بمخططات تفاعلية.',
                  en: '421 served entities, 7,915 training records, 2,873 consulting services — with interactive charts.',
                },
              },
              {
                icon: 'flag',
                view: 'sectors' as const,
                title: { ar: 'القطاعات الحكومية', en: 'Government Sectors' },
                desc: {
                  ar: '31 قطاعًا بعدد الجهات ونسبة الشعارات وحجم الاستفادة في كل قطاع.',
                  en: '31 sectors with entity counts, logo coverage, and benefit volume per sector.',
                },
              },
              {
                icon: 'compass',
                view: 'directory' as const,
                title: { ar: 'دليل الجهات', en: 'Entity Directory' },
                desc: {
                  ar: '682 جهة قابلة للبحث والتصفية مع شعاراتها وسجل استفادتها.',
                  en: '682 searchable, filterable entities with logos and benefit records.',
                },
              },
            ] as const
          ).map((c, i) => (
            <motion.button
              key={c.view}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              onClick={() => go(c.view)}
              className="glass-strong group p-6 text-start transition-shadow hover:shadow-card-lg"
            >
              <Icon name={c.icon} className="h-7 w-7 text-dga-green" />
              <h3 className="mt-3 text-lg font-bold text-dga-black">{t(c.title)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-dga-muted">{t(c.desc)}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-dga-green-dark group-hover:underline">
                {t({ ar: 'افتح العرض', en: 'Open the view' })} {lang === 'ar' ? '←' : '→'}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* playbook sections */}
      <div className="space-y-6">
        {playbookSections.map((sec, i) => (
          <motion.section
            key={sec.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45 }}
            className="glass overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-dga-line bg-dga-bg p-5">
              <span className="grid h-9 w-9 place-items-center rounded-pill bg-dga-green font-mono text-sm font-bold text-white">
                {i + 1}
              </span>
              <h2 className="text-lg font-bold text-dga-black">{t(sec.title)}</h2>
            </div>
            <ul className="space-y-3.5 p-5">
              {sec.items.map((item, ii) => (
                <li key={ii} className="flex gap-3 text-sm leading-loose text-dga-ink">
                  <span className="mt-1 text-dga-green">▸</span>
                  {t(item)}
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>

      {/* KPI table */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mt-10"
      >
        <h2 className="mb-4 text-xl font-bold text-dga-green-dark">{t({ ar: 'مؤشرات الأداء المقترحة', en: 'KPIs to track' })}</h2>
        <div className="glass overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-dga-line bg-dga-bg text-xs text-dga-muted">
                <th className="p-4 text-start font-semibold">{t({ ar: 'المؤشر', en: 'KPI' })}</th>
                <th className="p-4 text-start font-semibold">{t({ ar: 'الوصف', en: 'Description' })}</th>
                <th className="p-4 text-start font-semibold">{t({ ar: 'هدف السنة الأولى', en: 'Year-1 target' })}</th>
              </tr>
            </thead>
            <tbody>
              {playbookKpis.map((k) => (
                <tr key={k.kpi.en} className="border-b border-dga-line/70 last:border-0">
                  <td className="p-4 font-semibold text-dga-black">{t(k.kpi)}</td>
                  <td className="p-4 text-xs leading-relaxed text-dga-muted">{t(k.description)}</td>
                  <td className="p-4 text-xs font-bold text-dga-green-dark">{t(k.target)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* CTA */}
      <div className="glass-strong mt-10 p-8 text-center">
        <Icon name="radar" className="mx-auto h-8 w-8 text-dga-green" />
        <h2 className="mt-3 text-xl font-bold">{t({ ar: 'جرّب المنصة كموظف أولًا', en: 'Try the platform as an employee first' })}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-dga-muted">
          {t({
            ar: 'أفضل تقييم مؤسسي يبدأ بتجربة فردية: أكمل التقييم وراجع خطة التسعين يومًا ثم قيّم الملاءمة لجهتك.',
            en: 'The best institutional evaluation starts individually: complete the assessment, review the 90-day plan, then judge the fit for your entity.',
          })}
        </p>
        <button onClick={() => go('wizard')} className="btn-primary mt-5">
          {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
        </button>
      </div>
    </div>
  )
}
