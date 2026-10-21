import { motion } from 'framer-motion'
import { useApp } from '../store'
import type { L } from '../data/types'
import { levels } from '../data/levels'
import { frameworkCards, reportCards } from '../data/standards'
import Icon from '../components/Icon'


// v6-B: global indices that justify and anchor the tool (from the external review's table)
const globalIndices: { id: string; name: L; publisher: L; connects: L; url: string }[] = [
  {
    id: 'gtmi',
    name: { ar: 'مؤشر نضج GovTech (GTMI)', en: 'GovTech Maturity Index (GTMI)' },
    publisher: { ar: 'البنك الدولي', en: 'World Bank' },
    connects: { ar: 'السند المباشر الأقوى: يتناول برامج المهارات الحكومية ويربط انتشار التدريب بمكاسب إنتاجية قابلة للقياس.', en: 'The strongest direct anchor: covers government skills programs and links training penetration to measurable productivity gains.' },
    url: 'https://thedocs.worldbank.org/en/doc/18230a0f33e201615caa954f2d354891-0350052025/original/2025GTMI-Online-Survey-Guidance-Note-eng.pdf',
  },
  {
    id: 'dgi',
    name: { ar: 'مؤشر الحكومة الرقمية (DGI)', en: 'OECD Digital Government Index (DGI)' },
    publisher: { ar: 'منظمة التعاون والتنمية', en: 'OECD' },
    connects: { ar: 'يربط القدرات بحكومة قائمة على البيانات ومتمحورة حول المستخدم ومتكاملة واستباقية — وهي مجالات رادارنا الثمانية بعينها.', en: 'Ties capabilities to a data-driven, user-centred, integrated and proactive government — precisely our radar’s eight domains.' },
    url: 'https://www.oecd.org/en/publications/digital-government-outlook_0496b2bc-en/full-report/digital-governments-at-a-turning-point_0491aad4.html',
  },
  {
    id: 'ourdata',
    name: { ar: 'مؤشر البيانات الحكومية المفتوحة (OURdata)', en: 'OECD OURdata Index' },
    publisher: { ar: 'منظمة التعاون والتنمية', en: 'OECD' },
    connects: { ar: 'يتضمن برامج الثقافة البيانية داخل الحكومة ودعم إعادة استخدام البيانات — أساس مجال «الذكاء والبيانات».', en: 'Covers in-government data-literacy programs and data-reuse support — the basis of our AI & Data domain.' },
    url: 'https://www.oecd.org/en/publications/digital-government-outlook_0496b2bc-en.html',
  },
  {
    id: 'egdi',
    name: { ar: 'مؤشر الحكومة الإلكترونية ومؤشر الخدمات والمشاركة (EGDI/OSI)', en: 'UN EGDI / OSI / e-Participation' },
    publisher: { ar: 'الأمم المتحدة', en: 'United Nations' },
    connects: { ar: 'تدعم الصلة بجودة الخدمة والإتاحة والمشاركة؛ لا تقيس مهارة الموظف مباشرة — وهي حدود نعلنها.', en: 'Supports the link to service quality, accessibility and participation; it does not measure employee skill directly — a limit we declare.' },
    url: 'https://desapublications.un.org/sites/default/files/publications/2024-10/Technical%20Appendix%20%28Web%20version%29%2030102024.pdf',
  },
  {
    id: 'gci',
    name: { ar: 'المؤشر العالمي للأمن السيبراني (GCI)', en: 'ITU Global Cybersecurity Index (GCI)' },
    publisher: { ar: 'الاتحاد الدولي للاتصالات', en: 'ITU' },
    connects: { ar: 'يتضمن تنمية القدرات والتوعية والتدريب الأمني — سند مجال «الأمن السيبراني والثقة الرقمية».', en: 'Includes capacity development, awareness and security training — the anchor for our Cybersecurity & Digital Trust domain.' },
    url: 'https://www.itu.int/en/mediacentre/Pages/PR-2024-09-10-Global-Cybersecurity-Index.aspx',
  },
  {
    id: 'imd',
    name: { ar: 'ترتيب التنافسية الرقمية العالمي', en: 'IMD World Digital Competitiveness Ranking' },
    publisher: { ar: 'IMD', en: 'IMD' },
    connects: { ar: 'يوفر السياق الأوسع لأهمية المعرفة والتدريب والاستعداد المستقبلي في التنافسية الوطنية.', en: 'Provides the broader context for why knowledge, training and future-readiness drive national competitiveness.' },
    url: 'https://www.imd.org/centers/wcc/world-competitiveness-center/rankings/world-digital-competitiveness-ranking/methodology',
  },
]

export default function Standards() {
  const { t, go, lang } = useApp()

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
        {/* scoring scheme note (expert-review P0-9) */}
        <div className="border-t border-dga-line bg-dga-bg p-6 text-xs leading-relaxed text-dga-muted">
          <p className="font-bold text-dga-ink">{t({ ar: 'منهجية الاحتساب الموثقة', en: 'Documented scoring scheme' })}</p>
          <p className="mt-1.5">
            {t({
              ar: 'عتبات موحدة للمستوى والمرحلة معًا: أقل من 1.25 = وعي/تأسيسي، 1.25–2.24 = تطبيق/نامٍ، 2.25–3.24 = ممارس/متمكّن، 3.25 فأكثر = خبير/رائد. درجة المجال = متوسط عباراته الخمس. هذه عتبات تحريرية مُعلنة (لا معايرة تجريبية بعد)، والنتيجة أداة تأمل ذاتي لا قياسًا معتمدًا، ولا يجوز استخدامها في قرارات توظيف أو مفاضلة.',
              en: 'One shared threshold set for both level and stage: below 1.25 = Awareness/Foundation, 1.25–2.24 = Working/Developing, 2.25–3.24 = Practitioner/Proficient, 3.25+ = Expert/Leading. A domain score is the mean of its five statements. These are documented editorial thresholds (not yet empirically calibrated), and the result is a self-reflection aid, not a validated measurement — it must not be used for hiring or selection decisions.',
            })}
          </p>
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
              <h3 className="text-lg font-bold leading-snug text-dga-black group-hover:text-dga-amber-tx">{t(c.name)}</h3>
              <span className="text-dga-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-dga-amber-tx" aria-hidden>
                ↗
              </span>
            </div>
            <p className="mb-3 text-xs font-semibold text-dga-muted">{t(c.publisher)}</p>
            <p className="border-s-2 border-dga-amber ps-3 text-sm leading-relaxed text-dga-ink">{t(c.highlight)}</p>
          </motion.a>
        ))}
      </div>

      {/* global indices (v6-B) */}
      <h2 className="mb-2 mt-14 text-2xl font-bold">
        {t({ ar: 'المؤشرات العالمية المرتبطة', en: 'Linked global indices' })}
        <span className="ms-3 text-sm font-normal text-dga-muted">{globalIndices.length}</span>
      </h2>
      <p className="mb-6 max-w-3xl text-sm text-dga-muted">
        {t({
          ar: 'هذه المؤشرات تدعم مبرر بناء الأداة وترتبط بمجالاتها — وتثبت نجاحها يتطلب قياس أثرها محليًا.',
          en: 'These indices justify building the tool and connect to its domains — while proving its success requires measuring its local impact.',
        })}
      </p>
      <div className="mb-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {globalIndices.map((g, i) => (
          <motion.a
            key={g.id}
            href={g.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="glass group flex flex-col p-6 no-underline transition-all duration-300 hover:border-dga-green"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold leading-snug text-dga-black group-hover:text-dga-green-dark">{t(g.name)}</h3>
              <span className="text-dga-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-dga-green" aria-hidden>↗</span>
            </div>
            <p className="mb-3 text-xs font-semibold text-dga-muted">{t(g.publisher)}</p>
            <p className="border-s-2 border-dga-green/50 ps-3 text-sm leading-relaxed text-dga-ink">{t(g.connects)}</p>
          </motion.a>
        ))}
      </div>

      {/* skill registry link */}
      <div className="mb-14 glass flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="text-lg font-bold text-dga-black">{t({ ar: 'كل مهارة سجل مستقل', en: 'Every skill is its own record' })}</h2>
          <p className="mt-1 text-sm text-dga-muted">
            {t({ ar: 'أربعون سجلًا موثقًا بنسخة وتاريخ مراجعة — مربوطة بعبارات التقييم وخطط التطوير.', en: 'Forty documented, versioned, review-dated records — linked to assessment items and development plans.' })}
          </p>
        </div>
        <button onClick={() => go('skills')} className="btn-primary px-5 py-2.5 text-sm">
          {t({ ar: 'افتح سجل المهارات', en: 'Open the skill registry' })}
          <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
        </button>
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
