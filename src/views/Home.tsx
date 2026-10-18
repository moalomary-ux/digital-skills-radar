import { motion } from 'framer-motion'
import { useApp } from '../store'
import { headlineStats, communityFeatures } from '../data/guidance'
import { careers, signalMeta } from '../data/careers'
import Icon from '../components/Icon'

export default function Home() {
  const { t, lang, go, history } = useApp()

  const entries = [
    {
      icon: 'compass',
      title: { ar: 'اكتشف مستقبل التخصصات', en: 'Explore the future of majors' },
      desc: {
        ar: '30 مهنة وتخصصًا بتقييم صريح: أيها يزدهر، وأيها يتحوّل، وأيها يندثر — ولماذا، بالأدلة.',
        en: '30 careers and majors with honest ratings: which are growing, transforming, or declining — and why, with evidence.',
      },
      view: 'careers' as const,
      cta: { ar: 'تصفح المهن الثلاثين', en: 'Browse the 30 careers' },
    },
    {
      icon: 'spark',
      title: { ar: 'جاوب 5 أسئلة ونرشّح لك', en: 'Answer 5 questions, get matched' },
      desc: {
        ar: 'اختبار توجيه سريع يقترح أنسب ثلاث مهن لك — مع تحذير صريح إذا كانت ميولك تشير إلى مهنة تندثر.',
        en: 'A quick guidance quiz suggesting your best three career matches — with an honest warning if your leanings point to a declining one.',
      },
      view: 'decide' as const,
      cta: { ar: 'ابدأ الاختبار', en: 'Start the quiz' },
    },
    {
      icon: 'radar',
      title: { ar: 'قيّس مهاراتك الرقمية', en: 'Measure your digital skills' },
      desc: {
        ar: 'تقييم ذاتي عبر 8 مجالات مع رادار شخصي وخطة تطوير من 90 يومًا — للموظفين والمحترفين.',
        en: 'A self-assessment across 8 domains with a personal radar and a 90-day development plan — for professionals.',
      },
      view: 'wizard' as const,
      cta: { ar: 'ابدأ التقييم', en: 'Start the assessment' },
    },
  ]

  return (
    <div>
      {/* ── Hero: DGA green wash + amber headline ─────────────── */}
      <section className="relative overflow-hidden bg-dga-green-ink">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-hero-wash" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base text-white/90"
            >
              {t({ ar: 'دليل الأسرة السعودية لمستقبل المهن', en: 'The Saudi family guide to the future of work' })}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-hero text-dga-amber"
            >
              {t({ ar: 'أين يذهب ابنك في عالم يتغير؟', en: 'Where will your child go in a changing world?' })}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-body-lg text-white/90"
            >
              {t({
                ar: 'إجابات مبنية على الأدلة — من تقارير المنتدى الاقتصادي العالمي ومنظمة العمل الدولية وOECD وMcKinsey — لا على الآراء: ماذا أتعلم؟ أي تخصص يزدهر؟ أي مهنة تندثر؟ وهل المستقبل للمهارات أم للشهادة؟',
                en: 'Evidence-based answers — from the World Economic Forum, ILO, OECD and McKinsey — not opinions: What should I learn? Which majors are rising? Which careers are fading? Skills or degrees?',
              })}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button onClick={() => go('careers')} className="rounded-btn bg-dga-amber px-6 py-3 font-semibold text-dga-black transition-colors hover:bg-[#c89302]">
                {t({ ar: 'اكتشف مستقبل التخصصات', en: 'Explore careers' })}
                <span aria-hidden> {lang === 'ar' ? '←' : '→'}</span>
              </button>
              <button onClick={() => go('decide')} className="rounded-btn border border-white/60 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                {t({ ar: 'جاوب 5 أسئلة', en: 'Take the 5-question quiz' })}
              </button>
              {history.length > 0 && (
                <button onClick={() => go('results')} className="rounded-btn border border-white/40 px-6 py-3 text-white/90 hover:bg-white/10">
                  {t({ ar: 'نتائجي السابقة', en: 'My previous results' })}
                </button>
              )}
            </motion.div>
          </div>
        </div>
        <div className="saudi-band relative" aria-hidden />
      </section>

      {/* ── Stats strip (WEF 2025) ────────────────────────────── */}
      <section className="border-b border-dga-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {headlineStats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-kpi font-bold text-dga-green-deep" dir="ltr">{s.value}</p>
              <p className="mt-2 text-sm leading-snug text-dga-muted">{t(s.label)}</p>
            </motion.div>
          ))}
        </div>
        <p className="pb-6 text-center text-xs text-dga-muted">
          {t({ ar: 'المصدر: تقرير المنتدى الاقتصادي العالمي لمستقبل الوظائف 2025', en: 'Source: WEF Future of Jobs Report 2025' })}
        </p>
      </section>

      {/* ── Entry trio ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="eyebrow">{t({ ar: 'من أين تبدأ؟', en: 'Where to start?' })}</p>
          <h2 className="mt-3 text-section text-dga-green">{t({ ar: 'ثلاث طرق للإجابة عن سؤالك', en: 'Three ways to answer your question' })}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {entries.map((e, i) => (
            <motion.button
              key={e.title.en}
              onClick={() => go(e.view)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass group p-7 text-start transition-all duration-300 hover:border-dga-green hover:shadow-card-lg"
            >
              <span className="grid h-12 w-12 place-items-center rounded-btn bg-dga-green/10 text-dga-green">
                <Icon name={e.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-dga-black group-hover:text-dga-green-dark">{t(e.title)}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-dga-muted">{t(e.desc)}</p>
              <p className="mt-5 text-sm font-bold text-dga-green-dark">
                {t(e.cta)} <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Signal explainer strip ────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-section text-dga-green">{t({ ar: 'ثلاث إشارات، بلا مجاملة', en: 'Three signals, no sugarcoating' })}</h2>
              <p className="mt-4 leading-relaxed text-dga-muted">
                {t({
                  ar: 'كل مهنة في المنصة تحمل إشارة واضحة مبنية على تقاطع التقارير العالمية مع السياق السعودي — ولكل إشارة حكمها الصريح.',
                  en: 'Every career on the platform carries a clear signal built from global reports crossed with Saudi context — and each signal has its honest verdict.',
                })}
              </p>
              <button onClick={() => go('lists')} className="mt-5 font-semibold text-dga-green-dark">
                {t({ ar: 'قوائم النمو والاندثار الكاملة ←', en: 'Full growing & declining lists →' })}
              </button>
            </div>
            <div className="space-y-3">
              {(['GROWING', 'TRANSFORMING', 'DECLINING'] as const).map((sig) => {
                const meta = signalMeta[sig]
                const count = careers.filter((c) => c.signal === sig).length
                const desc = {
                  GROWING: { ar: 'طلب متصاعد ومستقبل واعد — ادخل بثقة مع خطة تعلم.', en: 'Rising demand and a promising future — enter confidently with a learning plan.' },
                  TRANSFORMING: { ar: 'المهنة تبقى لكن محتواها يتغير — النسخة الحديثة منها هي الاستثمار الصحيح.', en: 'The career stays but its content changes — the modern version of it is the right investment.' },
                  DECLINING: { ar: 'الأتمتة تلتهم مهامها — لا تدخلها كوجهة؛ استخدمها جسرًا فقط أو تجنّبها.', en: 'Automation is eating its tasks — do not enter as a destination; use it as a bridge only, or avoid it.' },
                }[sig]
                return (
                  <div key={sig} className="glass flex items-center gap-4 p-4">
                    <span className="chip-ok" style={{ background: meta.bg, color: meta.color }}>
                      {t(meta.name)}
                    </span>
                    <p className="flex-1 text-sm text-dga-muted">{t(desc)}</p>
                    <span className="text-sm font-bold text-dga-black">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Community learning ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">{t({ ar: 'لا تتعلم وحيدًا', en: 'Don’t learn alone' })}</p>
          <h2 className="mt-3 text-section text-dga-green">{t({ ar: 'كيف يتشاركون التعلم؟', en: 'How do people learn together?' })}</h2>
          <p className="mt-3 leading-relaxed text-dga-muted">
            {t({
              ar: 'المساقات المفتوحة وحدها يُتمّها 3–6% فقط. الميزات الخمس التالية مبنية على أبحاث الإتمام — لأن من يتعلم مع آخرين يكمل الطريق فعلًا.',
              en: 'Only 3–6% finish open online courses alone. These five features are built on completion research — because people who learn together actually finish.',
            })}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {communityFeatures.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="glass flex flex-col p-6"
            >
              <h3 className="text-lg font-bold text-dga-black">{t(f.name)}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-dga-muted">{t(f.description)}</p>
              <p className="mt-4 rounded-btn border-s-2 border-dga-amber bg-dga-amber/5 p-3 text-xs leading-relaxed text-dga-ink">
                {lang === 'ar' ? f.rationaleAr : f.rationale}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {f.sources.map((s) => (
                  <span key={s} className="chip text-[10.5px]">{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Professional tools strip ──────────────────────────── */}
      <section className="bg-dga-green-ink py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-section font-bold text-dga-amber">
            {t({ ar: 'للمختصين في الحكومة الرقمية', en: 'For digital-government professionals' })}
          </h2>
          <p className="mt-3 max-w-2xl text-white/85">
            {t({
              ar: 'الأدوات الكاملة للمهنيين: تقييم المهارات بمعايرة معرفية، ورادار 48 تقنية ناشئة، ومكتبة 20 دورًا وظيفيًا بمعايير SFIA، وخطط تطوير من 90 يومًا.',
              en: 'The full professional toolkit: calibrated skills assessment, a 48-technology radar, a 20-role library with SFIA standards, and 90-day development plans.',
            })}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => go('wizard')} className="rounded-btn bg-white px-5 py-2.5 font-semibold text-dga-green-ink hover:bg-dga-bg">
              {t({ ar: 'تقييم المهارات', en: 'Skills assessment' })}
            </button>
            <button onClick={() => go('tech-radar')} className="rounded-btn border border-white/50 px-5 py-2.5 text-white hover:bg-white/10">
              {t({ ar: 'رادار التقنيات', en: 'Tech radar' })}
            </button>
            <button onClick={() => go('roles')} className="rounded-btn border border-white/50 px-5 py-2.5 text-white hover:bg-white/10">
              {t({ ar: 'الأدوار الوظيفية', en: 'Role library' })}
            </button>
            <button onClick={() => go('standards')} className="rounded-btn border border-white/50 px-5 py-2.5 text-white hover:bg-white/10">
              {t({ ar: 'المعايير والتقارير', en: 'Standards & reports' })}
            </button>
          </div>
        </div>
        <div className="saudi-band mt-14" aria-hidden />
      </section>
    </div>
  )
}
