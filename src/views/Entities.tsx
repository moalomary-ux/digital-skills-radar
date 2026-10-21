import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import type { L } from '../data/types'
import { pathFor } from '../lib/routes'
import { useArrow } from '../components/shell/hooks'

/**
 * «دليل التبني المؤسسي» (/leaders/adoption) — for an HR or learning director: how to run a voluntary cohort in
 * two weeks, the privacy rules, and what the tool is not for. No link to employee files; no numeric KPI targets.
 */

const forYes: L[] = [
  { ar: 'حوار تطوير بين الموظف ومديره، تبدأ به ورقة حوار التطوير', en: 'A development conversation between an employee and their manager, starting from the conversation sheet' },
  { ar: 'تخطيط برامج التعلم على مستوى الإدارة أو الجهة، من احتياج مجمّع', en: 'Planning learning programmes for a department or entity from aggregated needs' },
  { ar: 'نقطة بداية لخطة الأيام الـ90 المقبلة يملكها الموظف', en: 'A starting point for a 90-day plan the employee owns' },
  { ar: 'إعادة التقييم بعد 90 يوماً لمراجعة التقدم ذاتياً', en: 'Re-assessing after 90 days to review one’s own progress' },
]

const forNo: L[] = [
  { ar: 'التقييم الوظيفي أو الترقية أو المفاضلة أو الاختيار', en: 'Performance appraisal, promotion, comparison or selection' },
  { ar: 'الإرفاق بملف الموظف أو بأي نظام للموارد البشرية', en: 'Attaching to the employee file or any HR system' },
  { ar: 'ترتيب الموظفين أو الإدارات أو مقارنتهم', en: 'Ranking or comparing employees or departments' },
  { ar: 'إثبات إتقان المهارة أو منح شهادة: هو تقييم ذاتي لا اختبار', en: 'Proving competence or granting a certificate: it is a self-assessment, not an exam' },
]

const privacyRules: { rule: L; why: L }[] = [
  { rule: { ar: 'المشاركة طوعية', en: 'Participation is voluntary' }, why: { ar: 'لا تُلزم أحداً، ولا تسأل من لم يشارك عن السبب.', en: 'Oblige no one, and never ask non-participants why.' } },
  { rule: { ar: 'النتائج تبقى في متصفح الموظف', en: 'Results stay in the employee’s browser' }, why: { ar: 'لا خادم يستقبلها، ولا تطلب لقطات شاشة أو ملفات نتائج.', en: 'No server receives them; do not ask for screenshots or result files.' } },
  { rule: { ar: 'الرمز يشاركه الموظف بقراره', en: 'Employees share their code by choice' }, why: { ar: 'رمز النتيجة مجهول: يحمل درجات مقرّبة وفئة الدور، لا الاسم ولا الدور الدقيق.', en: 'The result code is anonymous: rounded scores and the role category, never the name or exact role.' } },
  { rule: { ar: 'لا عرض لأي تجميع تحت 5 رموز', en: 'No aggregate is shown below 5 codes' }, why: { ar: 'المجموع الصغير يكشف الأفراد؛ دمج الفرق الصغيرة أولى من عرضها.', en: 'A small group reveals individuals; merge small teams rather than show them.' } },
  { rule: { ar: 'لا صف لكل شخص', en: 'No row per person' }, why: { ar: 'التقرير يعرض توزيعاً لكل مجال وأولويات مشتركة فقط.', en: 'Reports show a distribution per domain and shared priorities only.' } },
]

const plan: { days: string; title: L; steps: L[] }[] = [
  {
    days: '1–2',
    title: { ar: 'الإعداد', en: 'Set-up' },
    steps: [
      { ar: 'اختر إدارة أو اثنتين، وسمِّ مالكاً للدفعة من الموارد البشرية أو التعلم.', en: 'Pick one or two departments and name a cohort owner from HR or learning.' },
      { ar: 'اكتب بيان الغرض في سطرين: «للتطوير فقط، وطوعي، ولا يُستخدم في التقييم الوظيفي».', en: 'Write the purpose in two lines: «for development only, voluntary, never used in appraisal».' },
    ],
  },
  {
    days: '3–4',
    title: { ar: 'إحاطة المديرين', en: 'Brief the managers' },
    steps: [
      { ar: 'جلسة قصيرة تشرح الغرض وقواعد الخصوصية وكيف يُدار حوار التطوير.', en: 'A short session on the purpose, the privacy rules and how to run a development conversation.' },
      { ar: 'يجرّب كل مدير «تقييمي» بنفسه أولاً.', en: 'Each manager tries «My assessment» first.' },
    ],
  },
  {
    days: '5–9',
    title: { ar: 'التقييم في وقت محمي', en: 'Assessment in protected time' },
    steps: [
      { ar: 'أرسل رسالة الدعوة، وخصص وقتاً في الدوام لمن يريد المشاركة.', en: 'Send the invitation and set aside work time for those who want to take part.' },
      { ar: 'يطبع كل مشارك ورقة حوار التطوير أو يحفظها لنفسه.', en: 'Each participant prints or keeps their own conversation sheet.' },
    ],
  },
  {
    days: '10–12',
    title: { ar: 'حوارات التطوير', en: 'Development conversations' },
    steps: [
      { ar: 'حوار قصير بين الموظف ومديره حول الأولويات المقترحة، ينتهي بأولوية واحدة متفق عليها.', en: 'A short conversation between employee and manager on the suggested priorities, ending with one agreed priority.' },
    ],
  },
  {
    days: '13–14',
    title: { ar: 'قرار التعلم', en: 'The learning decision' },
    steps: [
      { ar: 'يجمع كل مدير الأولويات المتفق عليها دون أسماء، ويقرر مع التعلم برنامجاً واحداً للإدارة.', en: 'Each manager compiles the agreed priorities without names and decides one programme for the department with learning.' },
      { ar: 'حدد موعد إعادة التقييم بعد 90 يوماً.', en: 'Set the re-assessment date 90 days later.' },
    ],
  },
]

const indicators: L[] = [
  { ar: 'نسبة المشاركة الطوعية', en: 'Voluntary participation rate' },
  { ar: 'نسبة المشاركين الذين أجروا حوار تطوير', en: 'Share of participants who held a development conversation' },
  { ar: 'عدد الأولويات التي تحولت إلى نشاط تعلم خلال 90 يوماً', en: 'Priorities that became a learning activity within 90 days' },
  { ar: 'تغيّر الاحتياج المجمّع بعد إعادة التقييم', en: 'Change in the aggregated need after re-assessment' },
]

const checklist: L[] = [
  { ar: 'بيان الغرض مكتوب ومعلن: للتطوير فقط', en: 'The purpose is written and announced: development only' },
  { ar: 'المشاركة طوعية ولا تُتابَع أسماء من لم يشارك', en: 'Participation is voluntary and non-participants are not tracked' },
  { ar: 'لا أحد يطلب نتائج فردية أو لقطات شاشة', en: 'No one asks for individual results or screenshots' },
  { ar: 'لا تكامل مع أي نظام للموارد البشرية', en: 'No integration with any HR system' },
  { ar: 'المديرون جرّبوا التقييم بأنفسهم', en: 'Managers have tried the assessment themselves' },
  { ar: 'وقت المشاركة محمي ضمن الدوام', en: 'Participation time is protected during work hours' },
  { ar: 'موعد إعادة التقييم بعد 90 يوماً محدد', en: 'The 90-day re-assessment date is set' },
]

const invitation: L = {
  ar: 'زملائي الكرام،\nندعوكم للمشاركة الطوعية في تقييم ذاتي للمهارات الرقمية عبر «رادار المهارات الرقمية». يساعدك التقييم على استكشاف مستواك في 8 مجالات، ويقترح أولويات تطوير وخطة للأيام الـ90 المقبلة.\n• المشاركة طوعية بالكامل.\n• لا تغادر إجاباتك متصفحك، ولا يطّلع عليها أحد.\n• النتائج للتطوير فقط، ولا تُستخدم في التقييم الوظيفي أو الترقية.\nخصصنا وقتاً خلال الدوام لمن يرغب، ويمكنك مناقشة ورقة حوار التطوير مع مديرك إن أردت.',
  en: 'Dear colleagues,\nYou are invited to take part, voluntarily, in a digital skills self-assessment using the «Digital Skills Radar». It helps you explore your level across 8 domains and suggests development priorities and a plan for the next 90 days.\n• Taking part is entirely voluntary.\n• Your answers never leave your browser, and no one sees them.\n• Results are for development only and are never used in appraisal or promotion.\nWe have set aside work time for anyone who wishes to take part, and you may discuss your development conversation sheet with your manager if you choose.',
}

export default function Entities() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const [done, setDone] = useState<boolean[]>(() => checklist.map(() => false))
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const doneCount = done.filter(Boolean).length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(t(invitation))
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label={t({ ar: 'تسلسل الصفحات', en: 'Breadcrumb' })} className="text-sm text-dga-muted">
        <Link to={pathFor('leaders', lang)}>{t({ ar: 'للقادة والفرق', en: 'Leaders & teams' })}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{t({ ar: 'دليل التبني المؤسسي', en: 'Institutional adoption guide' })}</span>
      </nav>
      <h1 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-tight text-dga-green-deep">
        {t({ ar: 'دليل التبني المؤسسي', en: 'Institutional adoption guide' })}
      </h1>
      <p className="mt-4 max-w-3xl text-body-lg text-dga-muted">
        {t({
          ar: 'لمدير الموارد البشرية أو التعلم: كيف تطلق دفعة تطوعية في أسبوعين، وقواعد الخصوصية التي لا تُكسر، وما لا تُستخدم له الأداة. يُقرأ في جلسة واحدة.',
          en: 'For an HR or learning director: how to run a voluntary cohort in two weeks, the privacy rules that are never broken, and what the tool is not for. One sitting to read.',
        })}
      </p>
      <p className="mt-4 rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 p-4 text-sm font-semibold text-dga-black">
        {t({
          ar: 'للتطوير فقط — لا يُستخدم في التقييم الوظيفي أو الترقية أو المفاضلة، ولا يُرفق بملف الموظف.',
          en: 'For development only — never for appraisal, promotion or comparison, and never attached to an employee file.',
        })}
      </p>

      {/* 1. what it is for */}
      <section className="mt-12" aria-labelledby="ad-use">
        <h2 id="ad-use" className="text-xl font-bold text-dga-green-dark">
          {t({ ar: 'ما تُستخدم له الأداة وما لا تُستخدم له', en: 'What the tool is for, and what it is not for' })}
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-card border border-dga-line bg-white p-5">
            <h3 className="font-bold text-dga-black">{t({ ar: 'تُستخدم في', en: 'Use it for' })}</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-dga-ink">
              {forYes.map((x) => (
                <li key={x.en} className="flex gap-2">
                  <span className="font-bold text-dga-green" aria-hidden="true">✓</span>
                  {t(x)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-dga-amber/50 bg-dga-amber/5 p-5">
            <h3 className="font-bold text-dga-black">{t({ ar: 'لا تُستخدم في', en: 'Never use it for' })}</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-dga-ink">
              {forNo.map((x) => (
                <li key={x.en} className="flex gap-2">
                  <span className="font-bold text-dga-amber-tx" aria-hidden="true">×</span>
                  {t(x)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. privacy */}
      <section className="mt-12" aria-labelledby="ad-privacy">
        <h2 id="ad-privacy" className="text-xl font-bold text-dga-green-dark">
          {t({ ar: 'قواعد الخصوصية', en: 'Privacy rules' })}
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {privacyRules.map((r, i) => (
            <li key={r.rule.en} className="rounded-card border border-dga-line bg-white p-4">
              <p className="flex items-center gap-2 font-bold text-dga-black">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-dga-green text-xs text-white">{i + 1}</span>
                {t(r.rule)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-dga-muted">{t(r.why)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3. two-week plan */}
      <section className="mt-12" aria-labelledby="ad-plan">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="ad-plan" className="text-xl font-bold text-dga-green-dark">
            {t({ ar: 'دفعة تطوعية في أسبوعين', en: 'A voluntary cohort in two weeks' })}
          </h2>
          <span className="chip border-dga-amber/60 text-dga-amber-tx">{t({ ar: 'تقدير تحريري', en: 'Editorial estimate' })}</span>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-dga-muted">
          {t({ ar: 'جدول مقترح قابل للتعديل بحسب جهتك؛ ليس معياراً ولا تجربة مقاسة.', en: 'A suggested schedule to adapt to your entity; not a standard and not a measured trial.' })}
        </p>
        <ol className="relative mt-6 space-y-4 border-s-2 border-dga-green/30 ps-6">
          {plan.map((p) => (
            <li key={p.days} className="relative">
              <span className="absolute -start-[1.95rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-dga-green ring-2 ring-dga-green/30" aria-hidden="true" />
              <p className="text-xs font-semibold text-dga-muted">
                {t({ ar: 'الأيام ', en: 'Days ' })}
                <span dir="ltr">{p.days}</span>
              </p>
              <h3 className="mt-0.5 font-bold text-dga-black">{t(p.title)}</h3>
              <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-dga-ink">
                {p.steps.map((s) => (
                  <li key={s.en}>{t(s)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. checklist + invitation (interactive) */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2" aria-label={t({ ar: 'أدوات الإطلاق', en: 'Launch tools' })}>
        <div className="rounded-card border border-dga-line bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-dga-black">{t({ ar: 'قائمة تحقق قبل الإطلاق', en: 'Pre-launch checklist' })}</h2>
          <p className="mt-1 text-sm text-dga-muted" aria-live="polite">
            {t({ ar: `أنجزت ${doneCount} من ${checklist.length}`, en: `${doneCount} of ${checklist.length} done` })}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-dga-line/60" aria-hidden="true">
            <div className="h-full rounded-full bg-dga-green transition-[width] duration-300" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-2">
            {checklist.map((c, i) => (
              <li key={c.en}>
                <label className="flex cursor-pointer items-start gap-3 rounded-btn p-1.5 text-sm leading-relaxed text-dga-ink hover:bg-dga-bg">
                  <input
                    type="checkbox"
                    checked={done[i]}
                    onChange={() => setDone((d) => d.map((v, k) => (k === i ? !v : v)))}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#1B8354]"
                  />
                  <span className={done[i] ? 'text-dga-muted line-through' : ''}>{t(c)}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card border border-dga-line bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-dga-black">{t({ ar: 'رسالة دعوة جاهزة', en: 'A ready invitation message' })}</h2>
          <p className="mt-1 text-sm text-dga-muted">{t({ ar: 'انسخها وعدّلها بما يناسب جهتك.', en: 'Copy it and adapt it to your entity.' })}</p>
          <pre className="mt-4 whitespace-pre-wrap rounded-btn border border-dga-line bg-dga-bg p-4 font-sans text-sm leading-relaxed text-dga-ink">{t(invitation)}</pre>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={copy} className="btn-primary px-4 py-2 text-sm print:hidden">
              {t({ ar: 'انسخ الرسالة', en: 'Copy the message' })}
            </button>
            <span role="status" className="text-sm text-dga-muted">
              {copied === 'ok'
                ? t({ ar: 'نُسخت الرسالة.', en: 'Message copied.' })
                : copied === 'fail'
                  ? t({ ar: 'تعذّر النسخ؛ حدّد النص وانسخه يدوياً.', en: 'Copy failed; select the text and copy it manually.' })
                  : ''}
            </span>
          </div>
        </div>
      </section>

      {/* 5. indicators — no numeric targets */}
      <section className="mt-12" aria-labelledby="ad-ind">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="ad-ind" className="text-xl font-bold text-dga-green-dark">
            {t({ ar: 'مؤشرات متابعة مقترحة', en: 'Suggested follow-up indicators' })}
          </h2>
          <span className="chip border-dga-amber/60 text-dga-amber-tx">{t({ ar: 'تقدير تحريري', en: 'Editorial estimate' })}</span>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-dga-muted">
          {t({
            ar: 'بلا مستهدفات رقمية: كل جهة تحدد مستهدفها من واقعها. تُقرأ المؤشرات مجمّعة على مستوى الإدارة، لا لكل شخص.',
            en: 'No numeric targets: each entity sets its own from its context. Read the indicators aggregated per department, never per person.',
          })}
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {indicators.map((x) => (
            <li key={x.en} className="rounded-card border border-dga-line bg-white p-4 text-sm font-semibold text-dga-ink">
              {t(x)}
            </li>
          ))}
        </ul>
      </section>

      {/* 6. next */}
      <section className="mt-12 rounded-card bg-dga-green-ink p-6 text-white sm:p-8" aria-labelledby="ad-next">
        <h2 id="ad-next" className="text-xl font-bold">
          {t({ ar: 'جرّب الأداة كموظف أولاً', en: 'Try the tool as an employee first' })}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">
          {t({
            ar: 'أفضل حكم على ملاءمة الأداة لجهتك يبدأ بتجربتك أنت: أكمل التقييم، واقرأ ورقة حوار التطوير، ثم قرر.',
            en: 'The best judgment of fit for your entity starts with your own try: complete the assessment, read the conversation sheet, then decide.',
          })}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={pathFor('wizard', lang)} className="btn-primary bg-dga-amber px-5 py-2.5 text-sm text-dga-black no-underline hover:bg-dga-amber/90 hover:no-underline">
            {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })} <span aria-hidden="true">{arrow}</span>
          </Link>
          <Link to={pathFor('methodology', lang)} className="rounded-btn border border-white/40 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:border-white hover:no-underline">
            {t({ ar: 'اقرأ المنهجية', en: 'Read the methodology' })}
          </Link>
        </div>
      </section>
    </div>
  )
}
