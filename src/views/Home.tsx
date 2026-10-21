import { motion } from 'framer-motion'
import { useApp } from '../store'
import { headlineStats, communityFeatures } from '../data/guidance'
import { govServiceKpis } from '../data/govServices'
import { domains } from '../data/domains'
import RadarChart from '../components/RadarChart'
import Icon from '../components/Icon'

const demoValues = [2.4, 1.6, 1.2, 2.8, 2.0, 1.8, 1.0, 3.2]
const demoTargets = [3, 2, 2, 3, 2, 2, 2, 3]

export default function Home() {
  const { t, lang, go, history, setRoleId } = useApp()

  /** Four entrances — each lands where that audience actually starts. */
  const entrances = [
    {
      icon: 'flag',
      title: { ar: 'موظف حكومي', en: 'Government employee' },
      desc: { ar: 'قِس مهاراتك وابنِ خطتك للـ 90 يومًا القادمة.', en: 'Measure your skills and build your next 90 days.' },
      act: () => {
        setRoleId('generalist')
        go('wizard')
      },
      cta: { ar: 'ابدأ التقييم', en: 'Start the assessment' },
    },
    {
      icon: 'chip',
      title: { ar: 'مختص رقمي', en: 'Digital specialist' },
      desc: { ar: 'قارن نفسك بدورك الدقيق من مكتبة الأدوار الأربع والعشرين.', en: 'Compare yourself against your exact role in the 24-role library.' },
      act: () => go('roles'),
      cta: { ar: 'افتح مكتبة الأدوار', en: 'Open the role library' },
    },
    {
      icon: 'cycle',
      title: { ar: 'مدير', en: 'Manager' },
      desc: { ar: 'ما المهارات الصاعدة التي يحتاجها فريقك حتى 2030؟', en: 'Which rising skills will your team need through 2030?' },
      act: () => go('future-skills'),
      cta: { ar: 'مهارات المستقبل', en: 'Future skills' },
    },
    {
      icon: 'scale',
      title: { ar: 'قيادي تنفيذي', en: 'Executive' },
      desc: { ar: 'دليل تبنّي المنصة مؤسسيًا: حوكمة ومؤشرات وخصوصية.', en: 'Adopting the platform institutionally: governance, KPIs, privacy.' },
      act: () => go('entities'),
      cta: { ar: 'دليل الجهات', en: 'The entities guide' },
    },
  ]

  const citizenLinks = [
    { icon: 'compass', title: { ar: 'كيف تتطور الأدوار والمهام؟', en: 'How roles & tasks evolve' }, desc: { ar: '50 مهنة بإشارات مستقبلية ومسارات دخول مزدوجة.', en: '50 careers with future signals and dual entry routes.' }, view: 'careers' as const },
    { icon: 'spark', title: { ar: 'اختبار التوجيه (5 أسئلة)', en: 'Guidance quiz (5 questions)' }, desc: { ar: 'ترشيح استرشادي لثلاثة اتجاهات مع تحذيرات صريحة.', en: 'An indicative match of three directions with honest warnings.' }, view: 'decide' as const },
    { icon: 'radar', title: { ar: 'الخريطة التفاعلية', en: 'Interactive map' }, desc: { ar: 'شبكة حيّة تربط المهن بالقطاعات بالمهارات.', en: 'A living network linking careers, sectors and skills.' }, view: 'explore' as const },
    { icon: 'scale', title: { ar: 'المهارات أم الشهادة؟', en: 'Skills or degrees?' }, desc: { ar: 'قوائم النمو والتراجع وأهم مقال للأسر.', en: 'Growing/declining lists and the essential family read.' }, view: 'lists' as const },
  ]

  return (
    <div>
      {/* ── Hero: the government-workforce organizing question ── */}
      <section className="relative overflow-hidden border-b border-dga-line bg-white">
        <div className="dot-grid-green absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow">{t({ ar: 'للقوى العاملة الحكومية أولًا', en: 'For the government workforce first' })}</p>
            <h1 className="mt-4 text-h1 font-bold text-dga-green-deep sm:text-hero">
              {t({ ar: 'كيف يتغير العمل الحكومي،', en: 'How is government work changing,' })}
              <br />
              <span className="text-dga-amber-tx">{t({ ar: 'وما القدرات التي تحتاجها؟', en: 'and what capabilities do you need?' })}</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-dga-muted">
              {t({
                ar: 'رادار المهارات الرقمية يقيس موقعك عبر ثمانية مجالات، يقارنه بمستهدف دورك، ثم يبني لك خطة تطوير من 90 يومًا — بأدلة موثقة لا بانطباعات.',
                en: 'The Digital Skills Radar measures where you stand across eight domains, compares it with your role target, then builds you a 90-day development plan — on documented evidence, not impressions.',
              })}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={() => go('wizard')} className="btn-primary px-7 py-3.5 text-base">
                {t({ ar: 'ابدأ التقييم الآن', en: 'Start the assessment' })}
                <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
              </button>
              {history.length > 0 && (
                <button onClick={() => go('results')} className="btn-ghost">
                  {t({ ar: 'نتائجي السابقة', en: 'My previous results' })}
                </button>
              )}
            </div>
            <div className="mt-10 flex flex-wrap gap-2.5">
              {domains.map((d) => (
                <span key={d.id} className="chip">
                  <Icon name={d.icon} className="h-3.5 w-3.5 text-dga-green" />
                  {t(d.shortName)}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
            <div className="glass-strong animate-floaty p-4 sm:p-6">
              <RadarChart
                labels={domains.map((d) => d.shortName)}
                values={demoValues}
                targets={demoTargets}
                lang={lang}
                animate
                centerLabel={t({ ar: 'مثال توضيحي', en: 'Sample' })}
              />
              <div className="mt-2 flex items-center justify-center gap-6 text-xs text-dga-muted">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-dga-green" />
                  {t({ ar: 'مستواك الحالي', en: 'Your current level' })}
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-dga-amber" />
                  {t({ ar: 'المستهدف لدورك', en: 'Target for your role' })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Four entrances ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="eyebrow">{t({ ar: 'من أنت؟', en: 'Who are you?' })}</p>
          <h2 className="mt-3 text-section font-bold text-dga-green">{t({ ar: 'أربعة مداخل — كلٌّ يبدأ من حيث يقف', en: 'Four entrances — each starts where you stand' })}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {entrances.map((e, i) => (
            <motion.button
              key={e.title.en}
              onClick={e.act}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass group p-6 text-start transition-all duration-300 hover:border-dga-green hover:shadow-card-lg"
            >
              <span className="grid h-11 w-11 place-items-center rounded-btn bg-dga-green/10 text-dga-green">
                <Icon name={e.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-dga-black group-hover:text-dga-green-dark">{t(e.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dga-muted">{t(e.desc)}</p>
              <p className="mt-4 text-sm font-bold text-dga-green-dark">
                {t(e.cta)} <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Journey: measure → gap → plan ── */}
      <section className="border-y border-dga-line bg-dga-bg py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="eyebrow">{t({ ar: 'كيف تعمل المنصة', en: 'How the platform works' })}</p>
            <h2 className="mt-3 text-section font-bold text-dga-green">
              {t({ ar: 'رحلة واحدة متصلة — من القياس إلى الخطة', en: 'One connected journey — from measurement to plan' })}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '1', title: { ar: 'اختر مسارك ودورك', en: 'Pick your track & role' }, desc: { ar: 'المسار يحدد ما ستثبته؛ الدور يحدد المستهدف على الرادار.', en: 'The track sets what you prove; the role sets the radar target.' }, view: 'wizard' as const },
              { n: '2', title: { ar: 'قيّس مهاراتك', en: 'Measure your skills' }, desc: { ar: '40 عبارة عبر 8 مجالات، مع أسئلة تحقق تكشف التضخيم والتقليل.', en: '40 statements across 8 domains, with knowledge checks catching over- and under-estimation.' }, view: 'wizard' as const },
              { n: '3', title: { ar: 'اقرأ الفجوة', en: 'Read the gap' }, desc: { ar: 'رادار مزدوج وتحليل فجوات مرتب بالأولوية — ما الذي يهم أولًا ولماذا.', en: 'A dual radar and a priority-ranked gap analysis — what matters first and why.' }, view: 'results' as const },
              { n: '4', title: { ar: 'نفّذ خطة 90 يومًا', en: 'Run your 90-day plan' }, desc: { ar: 'سلوكيات وموارد حقيقية وجدول أسبوعي — خطوة بخطوة حتى المستوى التالي.', en: 'Real behaviors and resources on a weekly schedule — step by step to the next level.' }, view: 'pathways' as const },
            ].map((s, i) => (
              <motion.button
                key={s.n}
                onClick={() => go(s.view)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass group relative bg-white p-6 text-start transition-all duration-300 hover:border-dga-green hover:shadow-card-lg"
              >
                <span className="grid h-10 w-10 place-items-center rounded-pill bg-dga-green font-mono text-base font-bold text-white">{s.n}</span>
                <h3 className="mt-4 text-lg font-bold text-dga-black group-hover:text-dga-green-dark">{t(s.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dga-muted">{t(s.desc)}</p>
                {i < 3 && (
                  <span className="absolute -end-3 top-1/2 hidden -translate-y-1/2 text-dga-line lg:block" aria-hidden>
                    {lang === 'ar' ? '◂' : '▸'}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip (WEF 2025) ── */}
      <section className="border-b border-dga-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {headlineStats.map((s, i) => (
            <motion.div key={s.value} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="text-center">
              <p className="text-kpi font-bold text-dga-green-deep" dir="ltr">{s.value}</p>
              <p className="mt-2 text-sm leading-snug text-dga-muted">{t(s.label)}</p>
            </motion.div>
          ))}
        </div>
        <p className="pb-6 text-center text-xs text-dga-muted">
          {t({ ar: 'المصدر: تقرير المنتدى الاقتصادي العالمي لمستقبل الوظائف 2025 — توقعات استطلاعية', en: 'Source: WEF Future of Jobs Report 2025 — survey-based projections' })}
          {' · '}
          <button onClick={() => go('methodology')} className="font-semibold text-dga-green-dark underline underline-offset-4">
            {t({ ar: 'كيف نبني أحكامنا؟', en: 'How do we build our judgments?' })}
          </button>
        </p>
      </section>

      {/* ── Impact strip (official DGA service records) ── */}
      <section className="border-b border-dga-line bg-dga-bg">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-dga-muted">
            {t({ ar: 'من سجلات الخدمة الرسمية — التمكين الحكومي بالأرقام', en: 'From official service records — government enablement in numbers' })}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { v: govServiceKpis.servedEntities, l: { ar: 'جهة حكومية استفادت', en: 'Government entities served' } },
              { v: govServiceKpis.trainingRecords, l: { ar: 'سجل تدريبي (2021–2026)', en: 'Training records (2021–2026)' } },
              { v: govServiceKpis.consultingServices, l: { ar: 'خدمة استشارية', en: 'Consulting services' } },
              { v: govServiceKpis.trainingPrograms, l: { ar: 'برنامجًا تدريبيًا', en: 'Training programs' } },
            ].map((s, i) => (
              <motion.div key={s.l.en} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="text-center">
                <p className="text-kpi font-bold text-dga-green-deep" dir="ltr">{s.v.toLocaleString('en-US')}</p>
                <p className="mt-2 text-sm leading-snug text-dga-muted">{t(s.l)}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-center">
            <button onClick={() => go('impact')} className="btn-ghost px-5 py-2 text-sm">
              {t({ ar: 'استكشف الأثر كاملًا — القطاعات والدليل', en: 'Explore the full impact — sectors & directory' })}
              <span aria-hidden> {lang === 'ar' ? '←' : '→'}</span>
            </button>
          </p>
        </div>
      </section>

      {/* ── Future skills preview ── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <button onClick={() => go('future-skills')} className="glass-strong group flex w-full flex-wrap items-center justify-between gap-5 p-6 text-start transition-all hover:border-dga-green hover:shadow-card-lg">
          <span className="flex min-w-60 flex-1 items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-btn bg-dga-green/10 text-dga-green">
              <Icon name="spark" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-bold text-dga-black group-hover:text-dga-green-dark">{t({ ar: 'مهارات المستقبل 2026←2030', en: 'Future skills 2026→2030' })}</span>
              <span className="mt-0.5 block text-sm text-dga-muted">
                {t({ ar: 'مسارات الطلب على المجالات، و15 مهارة دقيقة ناشئة، و10 مهام تتراجع بصدق — قلب الاستشراف في المنصة.', en: 'Domain demand trajectories, 15 emerging micro-skills, 10 honestly-declining tasks — the platform’s foresight core.' })}
              </span>
            </span>
          </span>
          <span className="btn-primary px-5 py-2.5 text-sm">
            {t({ ar: 'افتح طبقة الاستشراف', en: 'Open the foresight layer' })} <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
          </span>
        </button>
      </section>

      {/* ── Secondary track: citizens & students (public service) ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-card border-2 border-dashed border-dga-line bg-dga-bg/60 p-6 sm:p-8">
          <div className="mb-8 max-w-3xl">
            <p className="eyebrow">{t({ ar: 'خدمة عامة — مسار ثانٍ', en: 'Public service — a secondary track' })}</p>
            <h2 className="mt-3 text-section font-bold text-dga-green">{t({ ar: 'للأفراد والطلاب', en: 'For individuals & students' })}</h2>
            <p className="mt-3 leading-relaxed text-dga-muted">
              {t({
                ar: 'أدوات التوجيه المهني المبنية على نفس الأدلة — لمن يسأل: ماذا أتعلم؟ أي تخصص يزدهر؟ هل الروبوت سيستبدل هذه الوظيفة؟ هذه الأدوات تخدم الجمهور العام، بينما قلب المنصة هو تطوير القوى العاملة الحكومية.',
                en: 'Career-guidance tools built on the same evidence — for anyone asking: what should I learn? which major is rising? will robots replace this job? These tools serve the general public, while the platform’s core is developing the government workforce.',
              })}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {citizenLinks.map((c, i) => (
              <motion.button
                key={c.title.en}
                onClick={() => go(c.view)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="glass group bg-white p-5 text-start transition-all duration-300 hover:border-dga-green hover:shadow-card-lg"
              >
                <span className="grid h-10 w-10 place-items-center rounded-btn bg-dga-green/10 text-dga-green">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-bold text-dga-black group-hover:text-dga-green-dark">{t(c.title)}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-dga-muted">{t(c.desc)}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community learning ── */}
      <section className="border-t border-dga-line bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow">{t({ ar: 'لا تتعلم وحيدًا', en: 'Don’t learn alone' })}</p>
            <h2 className="mt-3 text-section font-bold text-dga-green">{t({ ar: 'كيف يتشاركون التعلم؟', en: 'How do people learn together?' })}</h2>
            <p className="mt-3 leading-relaxed text-dga-muted">
              {t({
                ar: 'المساقات المفتوحة وحدها يُتمّها 3–6% فقط. الميزات الخمس التالية مبنية على أبحاث الإتمام — لأن من يتعلم مع آخرين يكمل الطريق فعلًا.',
                en: 'Only 3–6% finish open online courses alone. These five features are built on completion research — because people who learn together actually finish.',
              })}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {communityFeatures.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45, delay: (i % 3) * 0.08 }} className="glass flex flex-col p-6">
                <h3 className="text-lg font-bold text-dga-black">{t(f.name)}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-dga-muted">{t(f.description)}</p>
                <p className="mt-4 rounded-btn border-s-2 border-dga-amber bg-dga-amber/5 p-3 text-xs leading-relaxed text-dga-ink">
                  {lang === 'ar' ? f.rationaleAr : f.rationale}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="chip-info text-[10.5px]">{t({ ar: 'خارطة طريق — غير منفذة بعد', en: 'Roadmap — not built yet' })}</span>
                  {f.sources.map((s) => (
                    <span key={s} className="chip text-[10.5px]">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
