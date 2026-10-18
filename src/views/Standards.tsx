import { motion } from 'framer-motion'
import { useApp } from '../store'
import { levels } from '../data/levels'
import { frameworkCards, reportCards } from '../data/standards'
import Icon from '../components/Icon'

export default function Standards() {
  const { t, go } = useApp()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* intro + level mapping */}
      <div className="mb-12 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'الأساس المنهجي', en: 'Methodological basis' })}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          {t({ ar: 'المعايير والتقارير التي يقف عليها الرادار', en: 'The standards & reports behind the radar' })}
        </h1>
        <p className="mt-4 leading-relaxed text-dga-ink">
          {t({
            ar: 'رادار المهارات الرقمية ليس اختراعًا من فراغ: مستوياته الأربعة ومجالاته الثمانية وعباراته الأربعون كلها ترجمة عملية لأطر وتقارير عالمية ووطنية موثقة.',
            en: 'The Digital Skills Radar is not invented from thin air: its four levels, eight domains and forty statements are a practical translation of documented global and national frameworks and reports.',
          })}
        </p>
      </div>

      {/* level mapping table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="glass mb-14 overflow-hidden"
      >
        <div className="border-b border-dga-line bg-dga-bg p-6">
          <h2 className="text-xl font-bold">{t({ ar: 'كيف تقابل مستوياتنا الأطر العالمية؟', en: 'How do our levels map to global frameworks?' })}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-dga-line text-start text-xs text-dga-muted">
                <th className="p-4 text-start font-semibold">{t({ ar: 'مستوى الرادار', en: 'Radar level' })}</th>
                <th className="p-4 text-start font-semibold">SFIA (7)</th>
                <th className="p-4 text-start font-semibold">DigComp 2.2 (8)</th>
                <th className="p-4 text-start font-semibold">DigComp 3.0 (4)</th>
                <th className="p-4 text-start font-semibold">{t({ ar: 'إطار قطر (4)', en: 'Qatar DSF (4)' })}</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((l, i) => (
                <tr key={l.value} className="border-b border-dga-line last:border-0">
                  <td className="p-4">
                    <span className="font-bold text-dga-green">{t(l.name)}</span>
                    <span className="block text-xs text-dga-muted">{t(l.description)}</span>
                  </td>
                  <td className="p-4 font-mono text-dga-ink">{['1–2', '3', '4–5', '6–7'][i]}</td>
                  <td className="p-4 font-mono text-dga-ink">{['1–2', '3–4', '5–6', '7–8'][i]}</td>
                  <td className="p-4 font-mono text-dga-ink">{['1', '2', '3', '4'][i]}</td>
                  <td className="p-4 font-mono text-dga-ink">{['1', '2', '3', '4'][i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* frameworks */}
      <h2 className="mb-6 text-2xl font-bold">
        {t({ ar: 'الأطر المرجعية', en: 'Reference frameworks' })}
        <span className="ms-3 text-sm font-normal text-dga-muted">{frameworkCards.length}</span>
      </h2>
      <div className="mb-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {frameworkCards.map((c, i) => (
          <motion.a
            key={c.id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="glass group flex flex-col p-6 no-underline transition-all duration-300 hover:border-dga-green/50"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold leading-snug text-dga-black group-hover:text-dga-green">{t(c.name)}</h3>
              <span className="text-dga-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-dga-green" aria-hidden>
                ↗
              </span>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {c.facts.map((f, fi) => (
                <span key={fi} className="chip text-[10.5px] text-dga-ink">
                  {t(f)}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-dga-muted">{t(c.description)}</p>
          </motion.a>
        ))}
      </div>

      {/* reports */}
      <h2 className="mb-6 text-2xl font-bold">
        {t({ ar: 'التقارير والأدلة', en: 'Reports & evidence' })}
        <span className="ms-3 text-sm font-normal text-dga-muted">{reportCards.length}</span>
      </h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reportCards.map((c, i) => (
          <motion.a
            key={c.id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="glass group flex flex-col p-6 no-underline transition-all duration-300 hover:border-dga-amber/50"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold leading-snug text-dga-black group-hover:text-dga-amber">{t(c.name)}</h3>
              <span className="text-dga-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-dga-amber" aria-hidden>
                ↗
              </span>
            </div>
            <p className="mb-3 text-xs font-semibold text-dga-muted">{t(c.publisher)}</p>
            <p className="border-s-2 border-dga-amber ps-3 text-sm leading-relaxed text-dga-ink">{t(c.highlight)}</p>
          </motion.a>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 glass-strong p-8 text-center">
        <Icon name="radar" className="mx-auto h-8 w-8 text-dga-green" />
        <h2 className="mt-3 text-xl font-bold">{t({ ar: 'جاهز لترى موقعك على الخريطة؟', en: 'Ready to see where you stand?' })}</h2>
        <button onClick={() => go('wizard')} className="btn-primary mt-5">
          {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
        </button>
      </div>
    </div>
  )
}
