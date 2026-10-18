import { motion } from 'framer-motion'
import { useApp } from '../store'
import {
  absoluteNumbersNote,
  decliningCommonThread,
  decliningExtra,
  decliningList,
  explainerParagraphs,
  growingList,
} from '../data/guidance'

export default function Lists() {
  const { t, go } = useApp()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'تقرير المنتدى الاقتصادي العالمي — مستقبل الوظائف 2025', en: 'WEF Future of Jobs Report 2025' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">
          {t({ ar: 'ما يزدهر وما يندثر — بالأرقام', en: 'What grows and what fades — in numbers' })}
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'القوائم الرسمية لأسرع المهن نموًا وتراجعًا بين 2025 و2030، حرفيًا من التقرير، مع ترجمتها العربية — ثم أهم مقال ستقرؤه هذه السنة: المهارات أولًا أم الشهادة؟',
            en: 'The official fastest-growing and fastest-declining role lists for 2025–2030, verbatim from the report with Arabic translation — then the most important article you’ll read this year: skills-first or degree-first?',
          })}
        </p>
      </div>

      {/* the two tables */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* growing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass overflow-hidden"
        >
          <div className="bg-dga-green p-5 text-white">
            <h2 className="text-xl font-bold">{t({ ar: 'أسرع 15 مهنة نموًا', en: 'Top 15 fastest-growing roles' })}</h2>
            <p className="mt-1 text-xs text-white/85">{t({ ar: 'صافي النمو المئوي 2025–2030', en: 'Net percentage growth 2025–2030' })}</p>
          </div>
          <ol className="divide-y divide-dga-line/70">
            {growingList.map((r) => (
              <li key={r.rank} className="flex items-center gap-3 px-5 py-2.5">
                <span className="w-6 shrink-0 font-mono text-sm font-bold text-dga-green-deep" dir="ltr">
                  {r.rank}
                </span>
                <span className="flex-1 text-sm text-dga-ink">
                  {t(r.name)}
                  <span className="block text-[11px] text-dga-muted" dir="ltr" style={{ textAlign: 'start' }}>
                    {r.name.en}
                  </span>
                </span>
                <span className="chip-ok font-mono font-bold" dir="ltr">
                  {r.growth}
                </span>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* declining */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass overflow-hidden"
        >
          <div className="bg-[#B42318] p-5 text-white">
            <h2 className="text-xl font-bold">{t({ ar: 'أسرع 10 مهن تراجعًا', en: 'Top 10 fastest-declining roles' })}</h2>
            <p className="mt-1 text-xs text-white/85">{t({ ar: 'الأكثر انكماشًا 2025–2030', en: 'Fastest-shrinking 2025–2030' })}</p>
          </div>
          <ol className="divide-y divide-dga-line/70">
            {decliningList.map((r) => (
              <li key={r.rank} className="flex items-center gap-3 px-5 py-2.5">
                <span className="w-6 shrink-0 font-mono text-sm font-bold text-[#B42318]" dir="ltr">
                  {r.rank}
                </span>
                <span className="flex-1 text-sm text-dga-ink">
                  {t(r.name)}
                  <span className="block text-[11px] text-dga-muted" dir="ltr" style={{ textAlign: 'start' }}>
                    {r.name.en}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-dga-line bg-dga-bg p-5">
            <p className="text-xs leading-relaxed text-dga-muted">{t(decliningExtra)}</p>
            <p className="mt-3 border-s-2 border-[#B42318] ps-3 text-xs font-semibold leading-relaxed text-dga-ink">
              {t(decliningCommonThread)}
            </p>
          </div>
        </motion.section>
      </div>

      {/* absolute-numbers nuance */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass mt-8 border-s-4 !border-s-dga-green p-6"
      >
        <h3 className="font-bold text-dga-green-dark">{t({ ar: 'دقّة مهمة: النسب ليست الأحجام', en: 'An important nuance: percentages are not volumes' })}</h3>
        <p className="mt-2 text-sm leading-loose text-dga-ink">{t(absoluteNumbersNote)}</p>
      </motion.div>

      {/* ── Skills-first vs degree-first explainer ── */}
      <section className="mt-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="eyebrow">{t({ ar: 'المقال الجوهري', en: 'The essential read' })}</p>
          <h2 className="mt-3 text-section font-bold text-dga-green">
            {t({ ar: 'المهارات أولًا أم الشهادة الجامعية؟', en: 'Skills-first or degree-first?' })}
          </h2>
          <p className="mt-3 text-dga-muted">
            {t({
              ar: 'سبع فقرات مكتوبة للأهل والطلاب — بلا حماس مفرط ولا تخويف.',
              en: 'Seven paragraphs written for parents and students — no hype, no fearmongering.',
            })}
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-5">
          {explainerParagraphs.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
              className="glass p-6 sm:p-7"
            >
              <h3 className="flex items-center gap-3 text-lg font-bold text-dga-black">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-dga-green/10 font-mono text-sm font-bold text-dga-green-deep">
                  {i + 1}
                </span>
                {t(p.title)}
              </h3>
              <p className="mt-3 leading-loose text-dga-ink">{t(p.body)}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => go('decide')} className="btn-primary">
            {t({ ar: 'اقتنعت؟ ابدأ اختبار التوجيه', en: 'Convinced? Take the guidance quiz' })}
          </button>
        </div>
      </section>
    </div>
  )
}
