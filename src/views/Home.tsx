import { Link } from 'react-router-dom'
import { useApp } from '../store'
import type { View } from '../store'
import type { L } from '../data/types'
import { domains } from '../data/domains'
import { shifts } from '../data/leaders/shifts'
import { ownedDecisions } from '../data/leaders/brief'
import { pathFor } from '../lib/routes'
import Icon from '../components/Icon'
import Claim, { ClaimText } from '../components/Claim'
import MiniSheet from '../components/shell/MiniSheet'
import type { SheetKind } from '../components/shell/MiniSheet'
import { useArrow, useAssessCta, useTabs } from '../components/shell/hooks'
import { SOON } from '../components/shell/site'

/* ------------------------------------------------------------------ copy */

/** «ماذا يعني هذا المجال لعملك؟» — one line per domain, plain words. */
const domainMeaning: Record<string, L> = {
  'ai-data': {
    ar: 'تقرأ الأرقام التي تُبنى عليها قراراتك، وتستخدم الذكاء الاصطناعي التوليدي في مسوداتك ثم تراجع مخرجه بنفسك.',
    en: 'You read the figures your decisions rest on, and use generative AI for drafts, then check its output yourself.',
  },
  cyber: {
    ar: 'تحمي بيانات المستفيدين في كل معاملة، وتتعرف على رسائل التصيّد قبل أن تصل إلى أنظمة جهتك.',
    en: 'You protect beneficiaries’ data in every transaction and spot phishing before it reaches your entity’s systems.',
  },
  cloud: {
    ar: 'تفهم أين تعمل أنظمة جهتك ومن يشغّلها، فتسأل الأسئلة الصحيحة عن التكلفة والاستمرارية والتشغيل البيني.',
    en: 'You understand where your entity’s systems run and who operates them, so you ask the right questions about cost, continuity and interoperability.',
  },
  'service-design': {
    ar: 'ترى الخدمة بعين المستفيد: أين يتعثر، وكم خطوة يحتاج، وكيف تُعرف سهولتها.',
    en: 'You see a service through the beneficiary’s eyes: where they get stuck, how many steps it takes, and how its ease is judged.',
  },
  policy: {
    ar: 'تعرف الأنظمة الرقمية التي تحكم عملك، مثل حماية البيانات الشخصية، وتحوّلها إلى قواعد عمل واضحة.',
    en: 'You know the digital regulations that govern your work, such as personal data protection, and turn them into clear working rules.',
  },
  agile: {
    ar: 'تعمل بدورات قصيرة تسلّم في كل منها شيئاً يعمل، وتتعلم من المستفيد قبل أن تكبر التكلفة.',
    en: 'You work in short cycles that each deliver something working, and learn from beneficiaries before costs grow.',
  },
  emerging: {
    ar: 'تحكم على التقنية الجديدة بجدواها قبل جِدّتها: ما المشكلة التي تحلها، وما مخاطرها؟',
    en: 'You judge a new technology by its value before its novelty: what problem does it solve, and what are its risks?',
  },
  leadership: {
    ar: 'تقود التغيير مع فريقك: توضّح سببه، وتطوّر مهارات زملائك، وتبني قراراتك على الدليل.',
    en: 'You lead change with your team: explain why, develop colleagues’ skills, and base decisions on evidence.',
  },
}

const levels: { name: L; meaning: L }[] = [
  { name: { ar: 'وعي', en: 'Awareness' }, meaning: { ar: 'تفهم المفاهيم الأساسية وتعرف متى تطلب المساعدة.', en: 'You understand the core concepts and know when to ask for help.' } },
  { name: { ar: 'تطبيق', en: 'Application' }, meaning: { ar: 'تطبّق المهارة في مهامك المعتادة بإرشاد محدود.', en: 'You apply the skill in routine tasks with limited guidance.' } },
  { name: { ar: 'إتقان', en: 'Proficiency' }, meaning: { ar: 'تطبّقها باستقلالية في المواقف المعقدة وتساعد زملاءك.', en: 'You apply it independently in complex situations and help colleagues.' } },
  { name: { ar: 'ريادة', en: 'Leadership' }, meaning: { ar: 'تقود الممارسة في جهتك وتضع معاييرها وتطوّر غيرك.', en: 'You lead the practice in your entity, set its standards and develop others.' } },
]

/* ------------------------------------------------------------- the hero */

const R = 112

function polar(angleDeg: number, r: number, mirror: boolean) {
  const a = (angleDeg * Math.PI) / 180
  const x = Math.cos(a) * r
  return { x: mirror ? -x : x, y: Math.sin(a) * r }
}

/** Interactive mini radar: 8 domains around 4 level rings. Tabs are the keyboard path; the SVG mirrors them. */
function DomainExplorer() {
  const { t, lang, dir } = useApp()
  const arrow = useArrow()
  const cta = useAssessCta()
  const { index, setIndex, tabProps, panelProps } = useTabs(domains.length)
  const mirror = dir === 'rtl'
  const ringPts = (r: number) =>
    domains
      .map((_, i) => {
        const p = polar(-90 + i * 45, r, mirror)
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
      })
      .join(' ')

  return (
    <div className="glass-strong p-4 sm:p-6">
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,15rem),1fr]">
        <svg viewBox="-140 -140 280 280" className="mx-auto w-full max-w-[15rem]" aria-hidden="true">
          {[1, 2, 3, 4].map((k) => (
            <polygon key={k} points={ringPts((R * k) / 4)} fill={k === 4 ? '#FCFCFD' : 'none'} stroke="#D2D6DB" strokeWidth={k === 4 ? 1.4 : 1} strokeDasharray={k === 4 ? undefined : '3 3'} />
          ))}
          {domains.map((d, i) => {
            const a0 = polar(-90 + i * 45 - 22.5, R, mirror)
            const a1 = polar(-90 + i * 45 + 22.5, R, mirror)
            const active = i === index
            return (
              <path
                key={d.id}
                d={`M0 0 L${a0.x.toFixed(1)} ${a0.y.toFixed(1)} L${a1.x.toFixed(1)} ${a1.y.toFixed(1)} Z`}
                fill={active ? 'rgba(27,131,84,.16)' : 'transparent'}
                stroke={active ? '#1B8354' : 'transparent'}
                strokeWidth="1.2"
                className={`cursor-pointer transition-[fill] duration-200 ${active ? '' : 'hover:fill-[rgba(27,131,84,.08)]'}`}
                onMouseEnter={() => setIndex(i)}
                onClick={() => setIndex(i)}
              />
            )
          })}
          {domains.map((d, i) => {
            const p = polar(-90 + i * 45, R, mirror)
            const active = i === index
            return (
              <g key={d.id} className="cursor-pointer" onMouseEnter={() => setIndex(i)} onClick={() => setIndex(i)}>
                {active && <line x1="0" y1="0" x2={p.x} y2={p.y} stroke="#DBA102" strokeWidth="2.4" strokeLinecap="round" />}
                <circle cx={p.x} cy={p.y} r={active ? 15 : 12.5} fill={active ? '#1B8354' : '#fff'} stroke="#1B8354" strokeWidth="1.5" className="transition-all duration-200" />
                <text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize="12" fontWeight="700" fill={active ? '#fff' : '#167248'}>
                  {i + 1}
                </text>
              </g>
            )
          })}
          <circle cx="0" cy="0" r="4" fill="#DBA102" />
        </svg>

        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={t({ ar: 'المجالات الثمانية', en: 'The eight domains' })}
          className="grid grid-cols-2 gap-1.5 sm:grid-cols-1"
        >
          {domains.map((d, i) => {
            const active = i === index
            return (
              <button
                key={d.id}
                {...tabProps(i)}
                onMouseEnter={() => setIndex(i)}
                className={`flex min-h-10 items-center gap-2 rounded-btn border px-2.5 py-1.5 text-start text-[13px] leading-snug transition-colors ${
                  active ? 'border-dga-green bg-dga-green/10 font-semibold text-dga-green-dark' : 'border-transparent text-dga-ink hover:bg-dga-bg'
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${active ? 'bg-dga-green text-white' : 'bg-dga-green/10 text-dga-green-dark'}`}>
                  {i + 1}
                </span>
                {t(d.shortName)}
              </button>
            )
          })}
        </div>
      </div>

      {domains.map((d, i) => (
        <div key={d.id} {...panelProps(i)} className="mt-5 rounded-card border border-dga-line bg-dga-bg p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green print:hidden">
          <p className="flex items-center gap-2 text-sm font-bold text-dga-black">
            <Icon name={d.icon} className="h-4 w-4 text-dga-green" />
            {t(d.name)}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-dga-ink">
            <span className="font-semibold text-dga-green-dark">{t({ ar: 'في عملك: ', en: 'In your work: ' })}</span>
            {t(domainMeaning[d.id] ?? d.description)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-dga-muted">
            {t({ ar: 'مهاراته: ', en: 'Its skills: ' })}
            {d.skills.map((s) => t(s)).join(lang === 'ar' ? '، ' : ', ')}
          </p>
          <Link to={cta.to} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark">
            {t({ ar: 'اعرف مستواك فيه — ابدأ التقييم', en: 'Find your level in it — start the assessment' })}
            <span aria-hidden="true">{arrow}</span>
          </Link>
        </div>
      ))}

      <p className="mt-3 text-[11px] text-dga-muted print:hidden">
        {t({ ar: 'الحلقات الأربع هي المستويات: وعي · تطبيق · إتقان · ريادة.', en: 'The four rings are the levels: awareness · application · proficiency · leadership.' })}
      </p>

      {/* print: every domain, not only the selected one */}
      <dl className="mt-4 hidden space-y-2 text-sm print:block">
        {domains.map((d) => (
          <div key={d.id}>
            <dt className="font-bold">{t(d.name)}</dt>
            <dd>{t(domainMeaning[d.id] ?? d.description)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* -------------------------------------------------------- persona router */

interface Persona {
  id: string
  icon: string
  who: L
  promise: L
  output: L
  view: View
  sheet: SheetKind
  soon?: L
}

function PersonaCard({ p }: { p: Persona }) {
  const { t, lang } = useApp()
  const arrow = useArrow()
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-dga-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-dga-green hover:shadow-card-lg focus-within:-translate-y-1 focus-within:border-dga-green focus-within:shadow-card-lg">
      <div className="p-5 sm:p-6">
        <span className="grid h-11 w-11 place-items-center rounded-btn bg-dga-green/10 text-dga-green transition-colors group-hover:bg-dga-green group-hover:text-white group-focus-within:bg-dga-green group-focus-within:text-white">
          <Icon name={p.icon} className="h-5 w-5" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-dga-black">
          <Link
            to={pathFor(p.view, lang)}
            className="text-dga-black no-underline after:absolute after:inset-0 after:content-[''] hover:no-underline group-hover:text-dga-green-dark"
          >
            {t(p.who)}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-dga-muted">{t(p.promise)}</p>
        <p className="mt-3 text-xs text-dga-muted">
          <span className="font-semibold text-dga-ink">{t({ ar: 'تخرج بـ: ', en: 'You leave with: ' })}</span>
          {t(p.output)}
          {p.soon && <span className="chip ms-1.5 align-middle text-[10.5px]">{t(SOON)}</span>}
        </p>
        {p.soon && <p className="mt-2 text-xs leading-relaxed text-dga-amber-tx">{t(p.soon)}</p>}
      </div>
      {/* the deliverable slides up on hover or keyboard focus; it is also always partly visible (no hover-only content) */}
      <div className="relative mt-auto h-36 overflow-hidden border-t border-dga-line bg-dga-bg px-6 pt-4">
        <div className="translate-y-12 transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:translate-y-0 print:translate-y-0">
          <MiniSheet kind={p.sheet} className="max-w-[9.5rem] rotate-[-3deg] transition-transform duration-300 group-hover:rotate-0 group-focus-within:rotate-0" />
        </div>
      </div>
      <p className="border-t border-dga-line px-6 py-3 text-sm font-bold text-dga-green-dark" aria-hidden="true">
        {t({ ar: 'ابدأ من هنا', en: 'Start here' })} <span className="inline-block">{arrow}</span>
      </p>
    </article>
  )
}

/* -------------------------------------------------------- shifts explorer */

function ShiftsExplorer() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const { tabProps, panelProps, index } = useTabs(shifts.length)

  return (
    <div>
      <div role="tablist" aria-label={t({ ar: 'التحولات', en: 'The shifts' })} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5 print:hidden">
        {shifts.map((s, i) => {
          const active = i === index
          return (
            <button
              key={s.id}
              {...tabProps(i)}
              className={`flex items-start gap-3 rounded-card border p-3.5 text-start transition-all ${
                active ? 'border-dga-green bg-white shadow-card' : 'border-dga-line bg-white/60 hover:border-dga-green/60 hover:bg-white'
              }`}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${active ? 'bg-dga-amber text-dga-black' : 'bg-dga-green/10 text-dga-green-dark'}`}>
                {i + 1}
              </span>
              <span className={`text-sm leading-snug ${active ? 'font-bold text-dga-black' : 'font-medium text-dga-ink'}`}>{t(s.title)}</span>
            </button>
          )
        })}
      </div>

      {shifts.map((s, i) => (
        <div
          key={s.id}
          {...panelProps(i)}
          className="print-reveal mt-4 rounded-card border border-dga-line bg-white p-5 shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green sm:p-6 print:mt-3 print:shadow-none"
        >
          <h3 className="flex items-center gap-3 text-lg font-bold text-dga-black">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-dga-amber text-sm text-dga-black" aria-hidden="true">
              {i + 1}
            </span>
            {t(s.title)}
          </h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <p className="eyebrow">{t({ ar: 'ما الذي يتغير', en: 'What changes' })}</p>
              <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(s.change)}</p>
              <p className="mt-3 text-xs leading-relaxed text-dga-muted">
                <span className="font-semibold text-dga-ink">{t({ ar: 'المهارة المطلوبة: ', en: 'The skill it asks for: ' })}</span>
                {t(s.requires)}
              </p>
            </div>
            <div className="rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 p-4">
              <p className="eyebrow !text-dga-amber-tx">{t({ ar: 'القرار المطلوب منك هذا العام', en: 'The decision you own this year' })}</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-dga-black">{t(s.decision)}</p>
              <p className="mt-3 text-xs leading-relaxed text-dga-muted">
                <span className="font-semibold text-dga-ink">{t({ ar: 'ما لا يتغير: ', en: 'What does not change: ' })}</span>
                {t(s.unchanged)}
              </p>
            </div>
          </div>
          <Link to={pathFor('leader-brief', lang)} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark print:hidden">
            {t({ ar: 'التحولات الخمسة في الموجز القيادي', en: 'All five shifts in the leader brief' })}
            <span aria-hidden="true">{arrow}</span>
          </Link>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ page */

export default function Home() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const cta = useAssessCta()

  const personas: Persona[] = [
    {
      id: 'employee',
      icon: 'flag',
      who: { ar: 'أنا موظف', en: 'I am an employee' },
      promise: {
        ar: 'استكشف مستواك في المجالات الثمانية، واخرج بأولويات تطوير مقترحة لها أسباب واضحة.',
        en: 'Explore your level across the eight domains and leave with suggested development priorities, each with a clear reason.',
      },
      output: { ar: 'ورقة حوار التطوير وخطتك للأيام الـ90 المقبلة', en: 'A development conversation sheet and your plan for the next 90 days' },
      view: 'wizard',
      sheet: 'dev',
    },
    {
      id: 'leader',
      icon: 'compass',
      who: { ar: 'أنا قيادي', en: 'I am a leader' },
      promise: {
        ar: `${shifts.length} تحولات في العمل الحكومي و${ownedDecisions.length} قرارات تملكها هذا العام، دون تقييم ذاتي.`,
        en: `${shifts.length} shifts in government work and ${ownedDecisions.length} decisions you own this year, with no self-rating.`,
      },
      output: { ar: 'الموجز القيادي للطباعة', en: 'The printable leader brief' },
      view: 'leader-brief',
      sheet: 'brief',
    },
    {
      id: 'team',
      icon: 'cycle',
      who: { ar: 'أقود فريقاً', en: 'I lead a team' },
      promise: {
        ar: 'اعرف ما يحتاجه فريقك من رموز نتائج مجهولة يشاركها أعضاؤه بإرادتهم، دون صف لكل شخص.',
        en: 'See what your team needs from anonymous result codes members share by choice, with no row per person.',
      },
      output: { ar: 'ملخص احتياج الفريق', en: 'A team needs summary' },
      view: 'leader-team',
      sheet: 'team',
    },
    {
      id: 'hr',
      icon: 'scale',
      who: { ar: 'الموارد البشرية والتعلم', en: 'HR and learning' },
      promise: {
        ar: 'أطلق دفعة تطوعية في أسبوعين بقواعد خصوصية واضحة، واعرف ما لا تُستخدم له الأداة.',
        en: 'Run a voluntary cohort in two weeks with clear privacy rules, and know what the tool is not for.',
      },
      output: { ar: 'دليل التبني المؤسسي وقائمة تحقق الإطلاق', en: 'The adoption guide and a launch checklist' },
      view: 'adoption',
      sheet: 'adoption',
    },
  ]

  const outputs: { sheet: SheetKind; title: L; desc: string; view: View; cta: L }[] = [
    {
      sheet: 'dev',
      title: { ar: 'ورقة حوار التطوير', en: 'Development conversation sheet' },
      desc: t({
        ar: 'ورقة مطبوعة تأخذها إلى حوار التطوير مع مديرك: {{method-priorities-max|bare}} بأسبابها، وخطتك للأيام الـ90 المقبلة.',
        en: 'A printed sheet for your development conversation with your manager: {{method-priorities-max|bare}} with their reasons, and your plan for the next 90 days.',
      }),
      view: 'wizard',
      cta: cta.label,
    },
    {
      sheet: 'brief',
      title: { ar: 'الموجز القيادي', en: 'Leader brief' },
      desc: t({
        ar: `${shifts.length} تحولات و${ownedDecisions.length} قرارات وأسئلة تطرحها على فريقك، في موجز تقرؤه قبل اجتماعك.`,
        en: `${shifts.length} shifts, ${ownedDecisions.length} decisions and questions for your team, in a brief you read before your meeting.`,
      }),
      view: 'leader-brief',
      cta: { ar: 'اقرأ الموجز', en: 'Read the brief' },
    },
    {
      sheet: 'role',
      title: { ar: 'ورقة الدور', en: 'Role sheet' },
      desc: t({
        ar: 'لكل دور في مكتبة من {{method-roles-count|bare}}: المستوى المستهدف في المجالات الثمانية والمهام التي تتغير فيه.',
        en: 'For each role in a library of {{method-roles-count|bare}}: the target level in the eight domains and the tasks that are changing.',
      }),
      view: 'roles',
      cta: { ar: 'تصفح الأدوار', en: 'Browse the roles' },
    },
  ]

  const wef = ['leaders-wef-2025-skills-change', 'leaders-wef-2025-ai-transform', 'leaders-wef-2025-skill-gaps']
  const wefLabels: Record<string, L> = {
    'leaders-wef-2025-skills-change': { ar: 'من المهارات الحالية للعاملين يتوقع أصحاب العمل أن تتحول أو تتقادم بحلول 2030', en: 'of workers’ existing skill sets are expected by employers to be transformed or become outdated by 2030' },
    'leaders-wef-2025-ai-transform': { ar: 'من أصحاب العمل يتوقعون أن يحوّل الذكاء الاصطناعي أعمالهم بحلول 2030', en: 'of employers expect AI to transform their business by 2030' },
    'leaders-wef-2025-skill-gaps': { ar: 'من أصحاب العمل يعدّون فجوات المهارات عائقاً رئيساً أمام التحول', en: 'of employers name skill gaps a major barrier to transformation' },
  }

  return (
    <div>
      {/* ── 1. Promise ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-dga-line bg-white">
        <div className="dot-grid-green absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr,1fr] lg:py-16">
          <div>
            <p className="eyebrow">{t({ ar: 'للقوى العاملة الحكومية', en: 'For the government workforce' })}</p>
            <h1 className="mt-4 text-[clamp(1.75rem,3.6vw,2.6rem)] font-bold leading-[1.3] text-dga-green-deep">
              {t({
                ar: 'كيف يتغير العمل الحكومي، وما القدرات التي يحتاجها الموظف والقيادي، وكيف نطورها؟',
                en: 'How is government work changing, what capabilities do employees and leaders need, and how do we build them?',
              })}
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-dga-muted">
              {t({
                ar: 'رادار المهارات الرقمية يحوّل هذا السؤال إلى خطوة تطوير محددة لكل موظف وقيادي وفريق، بأدلة معلنة المصدر، ودون أن تغادر بياناتك متصفحك.',
                en: 'The Digital Skills Radar turns that question into a specific development step for every employee, leader and team, on sourced evidence, without your data ever leaving your browser.',
              })}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to={cta.to} className="btn-primary px-6 py-3 text-base no-underline hover:no-underline">
                {t(cta.label)}
                <span aria-hidden="true">{arrow}</span>
              </Link>
              <Link to={pathFor('leader-brief', lang)} className="btn-ghost no-underline hover:no-underline">
                {t({ ar: 'اقرأ الموجز القيادي', en: 'Read the leader brief' })}
              </Link>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-dga-muted">
              {[
                { ar: 'بلا حسابات ولا تتبع', en: 'No accounts, no tracking' },
                { ar: 'كل رقم بمصدره', en: 'Every figure sourced' },
                { ar: 'للتطوير فقط، لا للتقييم الوظيفي', en: 'For development only, never appraisal' },
              ].map((x) => (
                <li key={x.en} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-dga-amber" aria-hidden="true" />
                  {t(x)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-dga-ink">
              {t({ ar: 'المجالات الثمانية: اختر مجالاً لترى ما يعنيه لعملك', en: 'The eight domains: pick one to see what it means for your work' })}
            </h2>
            <DomainExplorer />
          </div>
        </div>
        <div className="saudi-band opacity-80" aria-hidden="true" />
      </section>

      {/* ── 2. Persona router ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="personas-title">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">{t({ ar: 'من أين تبدأ؟', en: 'Where do you start?' })}</p>
          <h2 id="personas-title" className="mt-2 text-[clamp(1.5rem,2.6vw,2rem)] font-bold text-dga-green">
            {t({ ar: 'كل مدخل ينتهي بمخرج تستطيع استخدامه', en: 'Every entry ends in something you can use' })}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p) => (
            <PersonaCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* ── 3. Five shifts ─────────────────────────────────────────── */}
      <section className="border-y border-dga-line bg-dga-bg py-14" aria-labelledby="shifts-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">{t({ ar: 'تحوّل العمل الحكومي', en: 'How government work is changing' })}</p>
              <h2 id="shifts-title" className="mt-2 text-[clamp(1.5rem,2.6vw,2rem)] font-bold text-dga-green">
                {t({ ar: `${shifts.length} تحولات في العمل الحكومي`, en: `${shifts.length} shifts in government work` })}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-dga-muted">
                {t({
                  ar: 'اختر تحولاً لترى ما يتغير في العمل اليومي، والقرار الذي يملكه القيادي هذا العام.',
                  en: 'Pick a shift to see what changes in daily work, and the decision a leader owns this year.',
                })}
              </p>
            </div>
            <Link to={pathFor('work', lang)} className="text-sm font-bold text-dga-green-dark">
              {t({ ar: 'كل ما يتغير في العمل الحكومي', en: 'Everything that is changing' })} <span aria-hidden="true">{arrow}</span>
            </Link>
          </div>
          <ShiftsExplorer />
        </div>
      </section>

      {/* ── 4. What you get ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="outputs-title">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">{t({ ar: 'ماذا تحصل عليه', en: 'What you get' })}</p>
          <h2 id="outputs-title" className="mt-2 text-[clamp(1.5rem,2.6vw,2rem)] font-bold text-dga-green">
            {t({ ar: 'أوراق قابلة للطباعة، لا لوحات للعرض فقط', en: 'Printable sheets, not just dashboards' })}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {outputs.map((o) => (
            <article key={o.title.en} className="group relative flex flex-col rounded-card border border-dga-line bg-white p-5 shadow-card transition-all hover:border-dga-green hover:shadow-card-lg focus-within:border-dga-green">
              <div className="rounded-btn bg-dga-bg p-5">
                <MiniSheet kind={o.sheet} className="max-w-[11rem] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-1 group-focus-within:-translate-y-1" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-dga-black">{t(o.title)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-dga-muted">
                <ClaimText text={o.desc} />
              </p>
              <Link to={pathFor(o.view, lang)} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark">
                {t(o.cta)} <span aria-hidden="true">{arrow}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── 5. Domains and levels ──────────────────────────────────── */}
      <section className="border-t border-dga-line bg-white py-14" aria-labelledby="language-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">{t({ ar: 'لغة مشتركة للتطوير', en: 'A shared language for development' })}</p>
              <h2 id="language-title" className="mt-2 text-[clamp(1.5rem,2.6vw,2rem)] font-bold text-dga-green">
                {t({ ar: `${domains.length} مجالات، لكل منها 5 مهارات`, en: `${domains.length} domains, five skills each` })}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {domains.map((d) => (
                  <li key={d.id} className="chip !px-3 !py-1.5 !text-[13px]">
                    <Icon name={d.icon} className="h-4 w-4 text-dga-green" />
                    {t(d.shortName)}
                  </li>
                ))}
              </ul>
              <Link to={pathFor('skills', lang)} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark">
                {t({ ar: 'افتح قاموس المهارات', en: 'Open the skills dictionary' })} <span aria-hidden="true">{arrow}</span>
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-bold text-dga-black">{t({ ar: 'مقياس واحد من 4 مستويات', en: 'One scale of four levels' })}</h3>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {levels.map((lv, i) => (
                  <li key={lv.name.en} className="rounded-card border border-dga-line bg-dga-bg p-4">
                    <p className="flex items-center gap-2 font-bold text-dga-black">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-dga-green text-xs text-white">{i + 1}</span>
                      {t(lv.name)}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-dga-muted">{t(lv.meaning)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Global context (WEF, registered claims only) ─────────── */}
      <section className="border-t border-dga-line bg-dga-bg py-12" aria-labelledby="wef-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="wef-title" className="text-lg font-bold text-dga-black">
            {t({ ar: 'السياق العالمي: ما يتوقعه أصحاب العمل حتى 2030', en: 'Global context: what employers expect through 2030' })}
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-3">
            {wef.map((id) => (
              <li key={id} className="rounded-card border border-dga-line bg-white p-5">
                <p className="text-kpi font-bold text-dga-green-deep">
                  <Claim id={id} bare />
                </p>
                <p className="mt-2 text-sm leading-snug text-dga-muted">{t(wefLabels[id])}</p>
                <p className="mt-3">
                  <Claim id={id}>
                    <span className="sr-only">{t({ ar: 'المصدر', en: 'Source' })}</span>
                  </Claim>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-dga-muted">
            {t({
              ar: 'المصدر: تقرير المنتدى الاقتصادي العالمي لمستقبل الوظائف 2025. توقعات أصحاب عمل على مستوى العالم، وليست قياساً للقطاع الحكومي السعودي.',
              en: 'Source: World Economic Forum, Future of Jobs Report 2025. Global employer expectations, not a measurement of the Saudi public sector.',
            })}{' '}
            <Link to={pathFor('evidence', lang)} className="font-semibold">
              {t({ ar: 'سجل الأدلة', en: 'Evidence register' })}
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
