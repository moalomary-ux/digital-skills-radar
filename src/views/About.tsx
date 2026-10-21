import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import type { View } from '../store'
import type { L } from '../data/types'
import { pathFor } from '../lib/routes'
import { RadarMark } from '../components/Brand'
import { AUTHOR, DATA_UPDATED_ON, formatDay, INDEPENDENCE, SOON } from '../components/shell/site'

const built: { label: L; view: View }[] = [
  { label: { ar: '«تقييمي»: تقييم ذاتي في 8 مجالات، ومواقف حكم مهني، وأولويات تطوير مقترحة، وخطة للأيام الـ90 المقبلة', en: '«My assessment»: a self-assessment across 8 domains, judgment scenarios, suggested development priorities and a 90-day plan' }, view: 'wizard' },
  { label: { ar: 'الموجز القيادي وفحص القرار القيادي', en: 'The leader brief and the leader judgment check' }, view: 'leader-brief' },
  { label: { ar: 'رادار الفريق: تجميع رموز نتائج مجهولة، لا يعرض شيئاً تحت 5 رموز ولا صفاً لكل شخص', en: 'The team radar: combines anonymous result codes, shows nothing below 5 codes and never a row per person' }, view: 'leader-team' },
  { label: { ar: 'خريطة تحوّل المهام في الوظائف الحكومية', en: 'The task-shift map for government jobs' }, view: 'work-shifts' },
  { label: { ar: 'مكتبة الأدوار وأوراقها القابلة للطباعة', en: 'The role library and its printable sheets' }, view: 'roles' },
  { label: { ar: 'سجل الأدلة: كل رقم بمصدره ودرجة الثقة به', en: 'The evidence register: every figure with its source and confidence' }, view: 'evidence' },
]

const notBuilt: { label: L; note: L }[] = [
  { label: { ar: 'وضع الورشة', en: 'Workshop mode' }, note: { ar: 'لتيسير مواقف الحكم المهني في جلسة جماعية.', en: 'For facilitating judgment scenarios in a group session.' } },
  { label: { ar: 'مخطِّط قدرات الوحدة', en: 'Unit capability planner' }, note: { ar: 'من مزيج الأدوار في الوحدة إلى ملف القدرات المطلوب.', en: 'From a unit’s mix of roles to the capability profile it needs.' } },
  { label: { ar: 'التعلم المشترك', en: 'Learning together' }, note: { ar: 'حلقات تعلم ودفعات مشتركة للمساقات: أفكار من النسخة السابقة لم تُنفَّذ.', en: 'Learning circles and shared course cohorts: ideas from the previous version, not implemented.' } },
  { label: { ar: 'العمل دون اتصال', en: 'Offline use' }, note: { ar: 'مؤجل إلى ما بعد استقرار النسخة.', en: 'Deferred until the version is stable.' } },
  { label: { ar: 'تحقق ميداني من البنود', en: 'Field validation of the items' }, note: { ar: 'العبارات والمواقف تحريرية لم تُجرَّب على عينة بعد؛ لا ندّعي صدقاً أو ثباتاً قياسياً.', en: 'Statements and scenarios are editorial and not yet tried on a sample; we claim no psychometric validity or reliability.' } },
]

const neverDo: L[] = [
  { ar: 'لا خادم ولا حسابات ولا تتبع', en: 'No server, no accounts, no tracking' },
  { ar: 'لا درجة «جاهزية» كلية ولا ترتيب للجهات أو الموظفين', en: 'No overall «readiness» score, and no ranking of entities or employees' },
  { ar: 'لا ربط بملف الموظف ولا بالتقييم الوظيفي أو الترقية', en: 'No link to employee files, performance appraisal or promotion' },
  { ar: 'لا شعارات رسمية لأي جهة', en: 'No official logos of any entity' },
]

/**
 * Browser keys this page clears. The plan's ticked weeks use `LS_PLAN` from Pathways.tsx and the two
 * leader tools keep their state in sessionStorage; the keys are repeated here, not imported, so this
 * page does not pull those pages' code into its chunk.
 */
export const PLAN_PROGRESS_KEY = 'dsr-plan-progress'
export const SESSION_KEYS = ['dsr-leader-check-v1', 'dsr-team-a', 'dsr-team-b'] as const

function hasPlanProgress(): boolean {
  try {
    return localStorage.getItem(PLAN_PROGRESS_KEY) !== null
  } catch {
    return false
  }
}

function clearBrowserExtras(): void {
  try {
    localStorage.removeItem(PLAN_PROGRESS_KEY)
  } catch {
    /* storage unavailable: nothing was stored */
  }
  try {
    for (const k of SESSION_KEYS) sessionStorage.removeItem(k)
  } catch {
    /* storage unavailable: nothing was stored */
  }
}

const credits: L[] = [
  { ar: 'إطار SFIA 9 للمهارات الرقمية', en: 'SFIA 9 skills framework' },
  { ar: 'إطار الكفاءات الرقمية الأوروبي DigComp', en: 'The European DigComp framework' },
  { ar: 'أطر منظمة التعاون الاقتصادي والتنمية للحكومة الرقمية والمواهب الرقمية', en: 'OECD frameworks for digital government and digital talent' },
  { ar: 'تقرير المنتدى الاقتصادي العالمي لمستقبل الوظائف 2025', en: 'World Economic Forum, Future of Jobs Report 2025' },
  { ar: 'دراسة منظمة العمل الدولية 2025 عن التعرض للذكاء الاصطناعي التوليدي', en: 'ILO 2025 study on exposure to generative AI' },
  { ar: 'دليل الخدمات الحكومية الرقمية البريطاني', en: 'The UK government service manual' },
]

/** «عن المفهوم» — independence statement, purpose, privacy, honest roadmap, credits, data date. */
export default function About() {
  const { t, lang, history, answers, clearHistory, resetDraft } = useApp()
  const [confirming, setConfirming] = useState(false)
  const [cleared, setCleared] = useState(false)
  const stored = (history?.length ?? 0) > 0 || Object.keys(answers ?? {}).length > 0 || hasPlanProgress()

  const clearAll = () => {
    clearHistory()
    resetDraft()
    clearBrowserExtras()
    setConfirming(false)
    setCleared(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">{t({ ar: 'المنهجية والمصادر', en: 'Method & sources' })}</p>
      <h1 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-tight text-dga-green-deep">
        {t({ ar: 'عن المفهوم', en: 'About the concept' })}
      </h1>

      <section className="mt-6 flex gap-4 rounded-card border-2 border-dga-green/30 bg-white p-5 shadow-card sm:p-6" aria-labelledby="independence">
        <RadarMark className="h-12 w-12 shrink-0" />
        <div>
          <h2 id="independence" className="text-lg font-bold text-dga-black">
            {t(INDEPENDENCE)}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-dga-muted">
            {t({
              ar: 'لا يمثل موقفاً رسمياً لأي جهة حكومية، ولا يستخدم شعاراتها. الألوان والخط مستوحاة من الطابع البصري العام للخدمات الحكومية الرقمية. الآراء والأحكام التحريرية فيه مسؤولية مؤلفه، ومعلنة في سجل الأدلة.',
              en: 'It does not represent the official position of any government entity and uses none of their logos. Its colours and typeface are inspired by the general look of digital government services. Its editorial views and judgments are its author’s responsibility and are declared in the evidence register.',
            })}
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="purpose">
        <h2 id="purpose" className="text-xl font-bold text-dga-green-dark">
          {t({ ar: 'لماذا هذا المفهوم؟', en: 'Why this concept?' })}
        </h2>
        <p className="mt-3 leading-relaxed text-dga-ink">
          {t({
            ar: 'كيف يتغير العمل الحكومي، وما القدرات التي يحتاجها الموظف والقيادي، وكيف نطورها؟ رادار المهارات الرقمية محاولة للإجابة عن هذا السؤال بأداة دعم قرار: من قراءة ما يتغير، إلى القدرات المطلوبة، إلى إجراء تطوير محدد يمكن الدفاع عنه، بمخرج واحد قابل للطباعة لكل شخصية.',
            en: 'How is government work changing, what capabilities do employees and leaders need, and how do we build them? The Digital Skills Radar tries to answer that with a decision-support tool: from reading what is changing, to the capabilities needed, to a specific, defensible development step, with one printable output for each persona.',
          })}
        </p>
        <p className="mt-3 leading-relaxed text-dga-ink">
          {t({
            ar: 'هو للتطوير فقط: لا يُستخدم في التقييم الوظيفي أو الترقية أو المفاضلة أو الاختيار.',
            en: 'It is for development only: never for performance appraisal, promotion, comparison or selection.',
          })}
        </p>
      </section>

      <section id="privacy" className="mt-10 scroll-mt-24 rounded-card border border-dga-line bg-white p-5 sm:p-6" aria-labelledby="privacy-title">
        <h2 id="privacy-title" className="text-xl font-bold text-dga-green-dark">
          {t({ ar: 'الخصوصية', en: 'Privacy' })}
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-dga-ink">
          {[
            { ar: 'لا يغادر أي شيء متصفحك: لا خادم يستقبل إجاباتك، ولا حسابات.', en: 'Nothing leaves your browser: no server receives your answers, and there are no accounts.' },
            { ar: 'لا تحليلات ولا ملفات تتبع ولا طلبات إلى أطراف خارجية عند التحميل؛ الخطوط مستضافة محلياً.', en: 'No analytics, no tracking and no third-party requests at load; fonts are hosted locally.' },
            { ar: 'ما يُحفظ في متصفحك فقط: مسودة تقييمك، وسجل نتائجك، وتقدّم خطتك (الأسابيع التي أنجزتها)، ولغتك المختارة.', en: 'What is stored, in your browser only: your assessment draft, your result history, your plan progress (the weeks you ticked) and your chosen language.' },
            { ar: 'فحص القرار القيادي ورادار الفريق يحفظان ما تُدخله في هذه النافذة فقط، ويُمحى عند إغلاقها.', en: 'The leader judgment check and the team radar keep what you enter in this tab only; it is erased when you close the tab.' },
            { ar: 'رمز النتيجة لا يُرسل إلى أحد؛ تشاركه أنت إن أردت، ولا يحمل اسمك.', en: 'Your result code is sent to no one; you share it if you choose, and it carries no name.' },
          ].map((x) => (
            <li key={x.en} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" aria-hidden="true" />
              {t(x)}
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-dga-line pt-4">
          <p className="text-sm font-semibold text-dga-black">{t({ ar: 'امسح بياناتك من هذا المتصفح', en: 'Clear your data from this browser' })}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3" aria-live="polite">
            {cleared ? (
              <p className="text-sm text-dga-tag-ok-text">{t({ ar: 'مُسحت المسودة وسجل النتائج وتقدّم الخطة من هذا المتصفح.', en: 'The draft, result history and plan progress were cleared from this browser.' })}</p>
            ) : !stored ? (
              <p className="text-sm text-dga-muted">{t({ ar: 'لا توجد مسودة ولا نتائج ولا تقدّم خطة محفوظ في هذا المتصفح.', en: 'There is no draft, saved result or plan progress in this browser.' })}</p>
            ) : confirming ? (
              <>
                <p className="text-sm text-dga-ink">{t({ ar: 'سيُحذف سجل نتائجك ومسودتك وتقدّم خطتك نهائياً من هذا المتصفح. متأكد؟', en: 'Your result history, draft and plan progress will be removed from this browser for good. Are you sure?' })}</p>
                <button type="button" onClick={clearAll} className="btn-primary px-4 py-2 text-sm">
                  {t({ ar: 'نعم، امسح', en: 'Yes, clear' })}
                </button>
                <button type="button" onClick={() => setConfirming(false)} className="btn-ghost px-4 py-2 text-sm">
                  {t({ ar: 'إلغاء', en: 'Cancel' })}
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="btn-ghost px-4 py-2 text-sm">
                {t({ ar: 'امسح المسودة وسجل النتائج وتقدّم الخطة', en: 'Clear the draft, result history and plan progress' })}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="roadmap">
        <h2 id="roadmap" className="text-xl font-bold text-dga-green-dark">
          {t({ ar: 'ما بُني وما لم يُبنَ بعد', en: 'What is built, and what is not yet' })}
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="rounded-card border border-dga-line bg-white p-5">
            <h3 className="font-bold text-dga-black">{t({ ar: 'متاح الآن', en: 'Available now' })}</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed">
              {built.map((b) => (
                <li key={b.label.en} className="flex gap-2">
                  <span className="mt-0.5 font-bold text-dga-green" aria-hidden="true">✓</span>
                  <Link to={pathFor(b.view, lang)} className="text-dga-ink">
                    {t(b.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-dashed border-dga-line bg-dga-bg p-5">
            <h3 className="flex items-center gap-2 font-bold text-dga-black">
              {t({ ar: 'لم يُبنَ بعد', en: 'Not built yet' })}
              <span className="chip text-[11px]">{t(SOON)}</span>
            </h3>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed">
              {notBuilt.map((n) => (
                <li key={n.label.en}>
                  <span className="font-semibold text-dga-ink">{t(n.label)}</span>
                  <span className="block text-dga-muted">{t(n.note)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 rounded-card border border-dga-line bg-white p-5">
          <h3 className="font-bold text-dga-black">{t({ ar: 'ما لن نفعله عمداً', en: 'What we deliberately will not do' })}</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-dga-ink sm:grid-cols-2">
            {neverDo.map((n) => (
              <li key={n.en} className="flex gap-2">
                <span className="font-bold text-dga-amber-tx" aria-hidden="true">×</span>
                {t(n)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="credits">
        <h2 id="credits" className="text-xl font-bold text-dga-green-dark">
          {t({ ar: 'مستلهم من', en: 'Inspired by' })}
        </h2>
        <p className="mt-2 text-sm text-dga-muted">
          {t({
            ar: 'أطر وتقارير نستلهم منها ونذكر حدود مطابقتنا لها في المنهجية؛ ذكرها لا يعني اعتمادها لهذه الأداة.',
            en: 'Frameworks and reports we draw on, with the limits of our mapping stated in the methodology; naming them does not imply their endorsement.',
          })}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {credits.map((c) => (
            <li key={c.en} className="chip !px-3 !py-1 !text-[13px]">
              {t(c)}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-4 rounded-card border border-dga-line bg-dga-bg p-5 sm:grid-cols-2" aria-label={t({ ar: 'المؤلف وتاريخ البيانات', en: 'Author and data date' })}>
        <div>
          <p className="text-xs font-semibold text-dga-muted">{t({ ar: 'من إعداد', en: 'By' })}</p>
          <p className="mt-1 font-bold text-dga-black">{t(AUTHOR)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-dga-muted">{t({ ar: 'آخر تحديث للبيانات', en: 'Last data update' })}</p>
          <p className="mt-1 font-bold text-dga-black">
            <time dateTime={DATA_UPDATED_ON}>{formatDay(DATA_UPDATED_ON, lang)}</time>
          </p>
        </div>
      </section>
    </div>
  )
}
