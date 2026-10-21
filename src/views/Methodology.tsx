import type { MouseEvent, ReactNode } from 'react'
import { useApp } from '../store'
import type { L } from '../data/types'
import { levels } from '../data/levels'
import { tracks } from '../data/tracks'
import { domainById } from '../data/domains'
import { categoryWeightRows } from '../data/claims/method'
import Claim, { ClaimText, EvidenceLink } from '../components/Claim'

/**
 * Methodology (v9, packet P5a): what the self-assessment is and is not, the scale, the evidence
 * layers, how priorities are derived, the technology list, the government-entity data and its
 * reconciliation, the consulting-category mapping, privacy, independence, limits, cadence and the
 * release history. Every figure on this page is a registered claim (`src/data/claims/method.ts`).
 */

interface Section {
  id: string
  title: L
}

const SECTIONS: Section[] = [
  { id: 'm-what', title: { ar: 'ما هذا التقييم، وما ليس هو', en: 'What this assessment is, and is not' } },
  { id: 'm-scale', title: { ar: 'المقياس: أربعة مستويات', en: 'The scale: four levels' } },
  { id: 'm-layers', title: { ar: 'مواقف الحكم المهني والتحقق المعرفي', en: 'Professional-judgment scenarios and the knowledge check' } },
  { id: 'm-priorities', title: { ar: 'كيف تُشتق أولويات التطوير؟', en: 'How are development priorities derived?' } },
  { id: 'm-tech', title: { ar: 'تقنيات تغيّر العمل الحكومي', en: 'Technologies changing government work' } },
  { id: 'm-gov', title: { ar: 'بيانات الجهات الحكومية ومصدرها', en: 'Government-entity data and its source' } },
  { id: 'm-mapping', title: { ar: 'ربط فئات الاستشارات بالمجالات', en: 'Mapping consulting categories to domains' } },
  { id: 'm-privacy', title: { ar: 'الخصوصية', en: 'Privacy' } },
  { id: 'm-independence', title: { ar: 'بيان الاستقلال', en: 'Independence statement' } },
  { id: 'm-limits', title: { ar: 'الحدود المعروفة', en: 'Known limitations' } },
  { id: 'm-cadence', title: { ar: 'إيقاع التحديث', en: 'Update cadence' } },
  { id: 'm-changelog', title: { ar: 'سجل الإصدارات', en: 'Release history' } },
]

const sectionTitle = (id: string): L => SECTIONS.find((s) => s.id === id)!.title

/** Release history for readers: one line per release, in the binding glossary. */
const CHANGELOG: { v: string; date: string; items: L[] }[] = [
  {
    v: 'v9',
    date: '2026-10-22',
    items: [
      {
        ar: 'إعادة بناء حول دعم قرار تطوير القوى العاملة الحكومية: خمسة محاور بأهداف المستخدم، ورابط حقيقي لكل صفحة بالعربية والإنجليزية.',
        en: 'Rebuilt around decision support for government workforce development: five user-goal sections and a real link for every page in Arabic and English.',
      },
      {
        ar: 'محرك أولويات واحد تقرأ منه النتائج والخطة والتقرير المطبوع، وإصلاح مرحلة مواقف الحكم المهني في رحلة التقييم.',
        en: 'One priority engine read by the results, the plan and the printed report, and a fix to the professional-judgment step of the assessment.',
      },
      {
        ar: 'سجل ادعاءات موحد وصفحة «سجل الأدلة»: لكل رقم مصدره ونوعه والثقة فيه وتاريخ مراجعته، مع فحص آلي للمحتوى والمصطلحات.',
        en: 'A single claims registry and the “evidence register” page: every figure carries its source, type, confidence and review date, with automated content and terminology checks.',
      },
      {
        ar: 'بيانات الجهات في البناء العام مجاميع وطنية وقطاعية فقط، بلا سجلات لكل جهة ولا شعارات ولا ترتيب.',
        en: 'Government-entity data in the public build is national and sector aggregates only: no per-entity records, no logos, no rankings.',
      },
      {
        ar: 'قاموس مصطلحات ملزم، وتصحيح حقائق المعايير: عدد مهارات SFIA 9، والمقابلة مع DigComp مواءمة تحريرية لا تطابق مباشر.',
        en: 'A binding glossary, and corrected standards facts: the SFIA 9 skill count, and DigComp alignment stated as an editorial crosswalk rather than a direct mapping.',
      },
      {
        ar: 'إخراج أدوات التوجيه المهني للأفراد من هذا الإصدار، وحفظها في أرشيف الإصدار السابق.',
        en: 'Career-guidance tools for individuals removed from this release and kept in the archive of the previous release.',
      },
      {
        ar: 'خطوط مستضافة مع الموقع، فلا طلبات إلى جهات خارجية عند التحميل.',
        en: 'Fonts hosted with the site, so no requests go to third parties on load.',
      },
    ],
  },
  {
    v: 'v8',
    date: '2026-10',
    items: [
      {
        ar: 'ربط فئات الاستشارات بالمجالات الثمانية بجدول أوزان تحريري معلن، وصفحات تفصيلية للقطاعات والجهات (أُخرجت صفحات الجهات من البناء العام في الإصدار 9).',
        en: 'Consulting categories linked to the eight domains through a declared editorial weight table, with detail pages for sectors and entities (entity pages left the public build in v9).',
      },
    ],
  },
  {
    v: 'v7',
    date: '2026-10',
    items: [
      {
        ar: 'عروض مبنية على سجلات خدمات التمكين: المؤشرات الوطنية، والقطاعات، ودليل الجهات.',
        en: 'Views built on the enablement service records: national indicators, sectors and the entity directory.',
      },
    ],
  },
  {
    v: 'v6-B',
    date: '2026-10',
    items: [
      {
        ar: 'مواقف الحكم المهني طبقةً مستقلة عن التقييم الذاتي، وسجل مستقل لكل مهارة، وقسم المؤشرات الدولية المرتبطة.',
        en: 'Professional-judgment scenarios as a layer independent of self-assessment, a separate record for every skill, and the related international indices.',
      },
    ],
  },
  {
    v: 'v6',
    date: '2026-10',
    items: [
      {
        ar: 'صار السؤال المنظم للأداة تطوير القوى العاملة الحكومية، وأُضيفت فئات الدور، ووُحّدت عتبات المستويات.',
        en: 'The organizing question became government workforce development; role categories were added and level thresholds unified.',
      },
    ],
  },
  {
    v: 'v4',
    date: '2026-10',
    items: [
      {
        ar: 'طبقة مهارات المستقبل، ودليل التبني المؤسسي، وشارات نوع المصدر.',
        en: 'The future-skills layer, the institutional adoption guide and source-type badges.',
      },
    ],
  },
  {
    v: 'v3.2',
    date: '2026-10',
    items: [
      {
        ar: 'جولتا مراجعة خبيرة: مؤشر اتساق بين التقدير الذاتي والتحقق المعرفي، وحذف الأرقام غير المسندة، وتحسينات الإتاحة.',
        en: 'Two expert-review rounds: a consistency indicator between self-rating and the knowledge check, removal of unsourced figures, and accessibility improvements.',
      },
    ],
  },
  {
    v: 'v3',
    date: '2026-10',
    items: [
      {
        ar: 'مسار للأفراد والأسر، وهوية بصرية خضراء.',
        en: 'A track for individuals and families, and a green visual identity.',
      },
    ],
  },
  {
    v: 'v2',
    date: '2026-10',
    items: [
      {
        ar: 'قائمة التقنيات بمقياس الجاهزية، ومكتبة أدوار مرجعية إلى SFIA، وموارد تعلم وأسئلة تحقق معرفي.',
        en: 'The technology list with a readiness scale, a role library referenced to SFIA, learning resources and knowledge-check questions.',
      },
    ],
  },
  {
    v: 'v1',
    date: '2026-10',
    items: [
      {
        ar: 'الإطلاق: الرادار بمجالاته ومهاراته، وخطط التطوير، وصفحة المعايير.',
        en: 'Launch: the radar with its domains and skills, development plans and the standards page.',
      },
    ],
  },
]

/* ----------------------------------------------------------------- pieces */

function Block({ id, children }: { id: string; children: ReactNode }) {
  const { t } = useApp()
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="glass scroll-mt-24 p-6 sm:p-7">
      <h2 id={`${id}-h`} tabIndex={-1} className="flex items-center gap-3 text-lg font-bold text-dga-black focus:outline-none sm:text-xl">
        <span className="h-5 w-1.5 shrink-0 rounded-pill bg-dga-green" aria-hidden />
        {t(sectionTitle(id))}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-loose text-dga-ink">{children}</div>
    </section>
  )
}

function Note({ children, tone = 'amber' }: { children: ReactNode; tone?: 'amber' | 'green' }) {
  return (
    <p
      className={`rounded-btn border-s-2 p-3 text-[13px] leading-relaxed ${
        tone === 'amber' ? 'border-dga-amber bg-amber-50/60 text-dga-ink' : 'border-dga-green bg-dga-green/5 text-dga-ink'
      }`}
    >
      {children}
    </p>
  )
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Scale bar: segment widths follow the editorial thresholds on the 0–4 range. */
const SEGMENTS = [31.25, 25, 25, 18.75]
const SEGMENT_TONES = ['bg-dga-green/20', 'bg-dga-green/45', 'bg-dga-green/70', 'bg-dga-green-deep']

function ScaleBar() {
  const { t } = useApp()
  return (
    <figure className="pt-1">
      <div className="flex h-10 w-full overflow-hidden rounded-btn border border-dga-line" dir="ltr" aria-hidden>
        {levels.map((l, i) => (
          <div
            key={l.value}
            style={{ width: `${SEGMENTS[i]}%` }}
            className={`${SEGMENT_TONES[i]} flex items-center justify-center border-e border-white/70 text-xs font-bold last:border-e-0 ${
              i === 3 ? 'text-white' : 'text-dga-green-ink'
            }`}
          >
            {t(l.name)}
          </div>
        ))}
      </div>
      <figcaption className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map((l) => (
          <span key={l.value} className="block rounded-btn border border-dga-line bg-white p-3 text-xs leading-relaxed">
            <span className="block font-bold text-dga-green-dark">{t(l.name)}</span>
            <span className="text-dga-muted">{t(l.description)}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

function PriorityDiagram() {
  const { t, lang } = useApp()
  const inputs: L[] = [
    { ar: 'تقديرك الذاتي لكل مجال', en: 'Your self-rating per domain' },
    { ar: 'فهمك لمواقف الحكم المهني', en: 'Your professional-judgment responses' },
    { ar: 'التحقق المعرفي: ما أجبت عنه وما صحّ منه', en: 'Knowledge check: answered and correct' },
    { ar: 'المستهدف التطويري الاسترشادي لفئة دورك', en: 'The indicative development target for your role category' },
  ]
  const arrow = lang === 'ar' ? '←' : '→'
  return (
    <figure className="rounded-card border border-dga-line bg-dga-bg p-4">
      <figcaption className="sr-only">
        {t({
          ar: 'أربعة مدخلات تدخل محرك أولويات واحدًا، فيخرج منه عدد محدود من أولويات التطوير المقترحة لكل منها سبب.',
          en: 'Four inputs feed one priority engine, which outputs a small number of suggested development priorities, each with a reason.',
        })}
      </figcaption>
      <div className="grid items-center gap-3 lg:grid-cols-[1.4fr,auto,1fr,auto,1fr]">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {inputs.map((x, i) => (
            <li key={i} className="rounded-btn border border-dga-line bg-white px-3 py-2 text-xs font-semibold text-dga-ink">
              {t(x)}
            </li>
          ))}
        </ul>
        <span className="hidden text-center text-xl text-dga-muted lg:block" aria-hidden>
          {arrow}
        </span>
        <div className="rounded-btn bg-dga-green px-4 py-5 text-center text-sm font-bold text-white">
          {t({ ar: 'محرك أولويات واحد', en: 'One priority engine' })}
          <span className="mt-1 block text-xs font-normal text-white/85">
            {t({ ar: 'تقرأ منه النتائج والخطة والتقرير', en: 'Read by results, plan and report' })}
          </span>
        </div>
        <span className="hidden text-center text-xl text-dga-muted lg:block" aria-hidden>
          {arrow}
        </span>
        <div className="rounded-btn border-2 border-dga-green bg-white px-4 py-4 text-center text-sm font-semibold text-dga-green-dark">
          <ClaimText
            text={t({
              ar: '{{method-priorities-max}} على الأكثر، لكل منها سبب معلن',
              en: '{{method-priorities-max}} at most, each with a stated reason',
            })}
          />
        </div>
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------- page */

export default function Methodology() {
  const { t, lang } = useApp()

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    ;(document.getElementById(`${id}-h`) as HTMLElement | null)?.focus({ preventScroll: true })
  }

  const keyFigures: { id: string; label: L }[] = [
    { id: 'method-domains-count', label: { ar: 'للقدرات الرقمية في العمل الحكومي', en: 'of digital capability in government work' } },
    { id: 'method-skills-count', label: { ar: 'لكل منها عبارة تقييم ذاتي', en: 'each with a self-assessment statement' } },
    { id: 'method-levels-count', label: { ar: 'على مقياس واحد', en: 'on one scale' } },
    { id: 'method-scenarios-count', label: { ar: 'للحكم المهني', en: 'of professional judgment' } },
    { id: 'method-knowledge-count', label: { ar: 'للتحقق المعرفي', en: 'for the knowledge check' } },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header>
        <p className="eyebrow">{t({ ar: 'المنهجية والمصادر', en: 'Method & sources' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t({ ar: 'المنهجية', en: 'Methodology' })}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'كيف تُبنى أحكام الأداة، ومن أين تأتي أرقامها، وأين تقف حدودها؛ منشورة ليستطيع أي مراجع أن يدافع عنها أو يعترض عليها. كل رقم في هذه الصفحة يحمل شارة مصدره، افتحها لترى المصدر ونوعه والثقة فيه وتاريخ مراجعته.',
            en: 'How the tool forms its judgments, where its figures come from and where its limits lie, published so any reviewer can defend or challenge them. Every figure on this page carries a source badge; open it to see the source, its type, the confidence in it and when it was last reviewed.',
          })}
        </p>
      </header>

      {/* key figures */}
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {keyFigures.map((k) => (
          <li key={k.id} className="glass flex flex-col gap-1 p-4">
            <span className="text-lg text-dga-green-dark">
              <Claim id={k.id} />
            </span>
            <span className="text-xs leading-relaxed text-dga-muted">{t(k.label)}</span>
          </li>
        ))}
      </ul>

      {/* contents */}
      <nav aria-label={t({ ar: 'محتويات الصفحة', en: 'On this page' })} className="mt-8 rounded-card border border-dga-line bg-white p-5">
        <p className="text-xs font-semibold text-dga-muted">{t({ ar: 'محتويات الصفحة', en: 'On this page' })}</p>
        <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={(e) => jump(e, s.id)} className="text-dga-green-dark underline-offset-2 hover:underline">
                {t(s.title)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8 space-y-5">
        {/* 1 — what it is */}
        <Block id="m-what">
          <p>
            {t({
              ar: 'التقييم في هذه الأداة تقييم ذاتي يساعدك على استكشاف أولويات تطويرك في المجالات الثمانية. هو نقطة بداية لحوار تطويري، لا قياس لقدرتك.',
              en: 'The assessment in this tool is a self-assessment that helps you explore your development priorities across the eight domains. It is a starting point for a development conversation, not a measurement of your ability.',
            })}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-btn border border-dga-line bg-dga-bg p-4">
              <h3 className="mb-2 font-bold text-dga-green-dark">{t({ ar: 'ما هو', en: 'What it is' })}</h3>
              <Bullets
                items={[
                  t({
                    ar: 'تقدير ذاتي لمهاراتك، تكمله مواقف حكم مهني وأسئلة تحقق معرفي تساعدك على مراجعة تقديرك.',
                    en: 'A self-rating of your skills, complemented by professional-judgment scenarios and knowledge-check questions that help you review it.',
                  }),
                  <ClaimText
                    key="plan"
                    text={t({
                      ar: 'أداة للتطوير الذاتي وللحوار بينك وبين مديرك حول خطة تطوير مدتها {{method-plan-length}}.',
                      en: 'A tool for self-development and for a conversation with your manager about a development plan of {{method-plan-length}}.',
                    })}
                  />,
                  t({ ar: 'نتائجه تبقى في متصفحك ولا تُرسل إلى أي جهة.', en: 'Its results stay in your browser and are sent to no one.' }),
                ]}
              />
            </div>
            <div className="rounded-btn border border-dga-line bg-dga-bg p-4">
              <h3 className="mb-2 font-bold text-dga-amber-tx">{t({ ar: 'ما ليس هو', en: 'What it is not' })}</h3>
              <Bullets
                items={[
                  t({
                    ar: 'ليس قياسًا لقدرتك ولا امتحانًا، ولا يمنح شهادة أو مستوى معتمدًا.',
                    en: 'Not a measurement of your ability or an exam, and it confers no certificate or certified level.',
                  }),
                  t({
                    ar: 'لا يُستخدم في التوظيف أو الترقية أو المفاضلة أو التقييم الوظيفي أو أي قرار يمس الموظف.',
                    en: 'Not for hiring, promotion, selection, performance appraisal or any decision about an employee.',
                  }),
                  t({ ar: 'لا يرتّب الأشخاص، ولا يعطي درجة كلية.', en: 'It ranks no one and gives no overall score.' }),
                ]}
              />
            </div>
          </div>
        </Block>

        {/* 2 — scale */}
        <Block id="m-scale">
          <p>
            <ClaimText
              text={t({
                ar: 'تقدّر كل مهارة على مقياس {{method-scale}}، ودرجة المجال متوسط تقديرات مهاراته. تتحول الدرجة إلى أحد {{method-levels-count}} عند العتبات {{method-level-thresholds}}.',
                en: 'You rate each skill on a {{method-scale}} scale, and a domain score is the mean of its skill ratings. The score converts to one of {{method-levels-count}} at the thresholds {{method-level-thresholds}}.',
              })}
            />
          </p>
          <ScaleBar />
          <Note>
            {t({
              ar: 'العتبات تحريرية معلنة لم تُشتق من بيانات، ولم يُتحقق من صلاحية المقياس إحصائيًا. المستوى يساعدك على قراءة تقديرك، ولا يصف أداءك الفعلي.',
              en: 'The thresholds are declared editorial choices not derived from data, and the scale has not been statistically validated. A level helps you read your self-rating; it does not describe your actual performance.',
            })}
          </Note>
        </Block>

        {/* 3 — evidence layers */}
        <Block id="m-layers">
          <p>
            <ClaimText
              text={t({
                ar: 'تختار في بداية التقييم فئة دورك من {{method-role-categories}}:',
                en: 'At the start you choose your role category from {{method-role-categories}}:',
              })}
            />
          </p>
          <ul className="flex flex-wrap gap-2" aria-label={t({ ar: 'فئات الدور', en: 'Role categories' })}>
            {tracks.map((tr) => (
              <li key={tr.id} className="chip text-dga-ink">
                {t(tr.name)}
              </li>
            ))}
          </ul>
          <p>
            <ClaimText
              text={t({
                ar: 'يضم بنك المواقف {{method-scenarios-count}}، موقفًا لكل مجال في فئة دورك. لكل موقف أربعة خيارات تُمنح درجات جزئية {{method-scenario-scoring}} بحسب نضج التصرف، ويظهر مسوّغ الإجابة بعد اختيارها.',
                en: 'The scenario bank holds {{method-scenarios-count}}, one per domain in your role category. Each has four options scored {{method-scenario-scoring}} by the maturity of the response, and the rationale appears after you answer.',
              })}
            />
          </p>
          <p>
            <ClaimText
              text={t({
                ar: 'يضم التحقق المعرفي {{method-knowledge-count}} عن المعرفة الأساسية في كل مجال. يُحفظ عدد ما أجبت عنه وعدد الصحيح منه، ولا يُحكم على اتساقه مع تقديرك الذاتي قبل {{method-knowledge-min-attempts}} في المجال.',
                en: 'The knowledge check holds {{method-knowledge-count}} on foundational knowledge in each domain. It keeps how many you answered and how many were correct, and consistency with your self-rating is not judged before {{method-knowledge-min-attempts}} in the domain.',
              })}
            />
          </p>
          <Note>
            {t({
              ar: 'المواقف وأسئلة التحقق المعرفي تحريرية: كتبها مؤلف الأداة وراجعها تحريريًا، ولم تُختبر ميدانيًا مع جهات تجريبية، ولم يُتحقق من صلاحيتها إحصائيًا.',
              en: 'The scenarios and knowledge-check questions are editorial: written and edited by the tool’s author, not field-tested with pilot entities and not statistically validated.',
            })}
          </Note>
        </Block>

        {/* 4 — priorities */}
        <Block id="m-priorities">
          <p>
            {t({
              ar: 'محرك أولويات واحد يقرأ أربعة مدخلات ويقترح أولويات التطوير. تقرأ منه صفحة النتائج والخطة والتقرير المطبوع، فلا تختلف الأولوية من صفحة إلى أخرى.',
              en: 'One priority engine reads four inputs and suggests development priorities. The results page, the plan and the printed report all read from it, so the priority never differs from one page to another.',
            })}
          </p>
          <PriorityDiagram />
          <h3 className="pt-1 font-bold text-dga-black">{t({ ar: 'أسباب الأولوية', en: 'Reasons for a priority' })}</h3>
          <Bullets
            items={[
              t({ ar: 'تقديرك الذاتي دون المستهدف الاسترشادي لفئة دورك.', en: 'Your self-rating is below the indicative target for your role category.' }),
              t({ ar: 'فهمك للمواقف دون تقديرك الذاتي.', en: 'Your scenario responses are below your self-rating.' }),
              t({ ar: 'تقديرك الذاتي وفهمك للمواقف كلاهما دون المستهدف.', en: 'Both your self-rating and your scenario responses are below the target.' }),
              t({
                ar: 'تقدير ذاتي مرتفع لا تؤيده المواقف ولا التحقق المعرفي، فيُقترح التحقق منه عمليًا.',
                en: 'A high self-rating that neither the scenarios nor the knowledge check support, so checking it in practice is suggested.',
              }),
            ]}
          />
          <p>
            <ClaimText
              text={t({
                ar: 'إن اخترت دورًا محددًا من مكتبة الأدوار ({{method-roles-count}}) يُستخدم مستهدفه الاسترشادي بدل مستهدف الفئة.',
                en: 'If you choose a specific role from the role library ({{method-roles-count}}), its indicative target replaces the category target.',
              })}
            />
          </p>
          <Note>
            {t({
              ar: 'لا درجة كلية ولا «جاهزية» عامة، ولا ترتيب للأشخاص. المستهدف استرشادي تحريري لفئة الدور، وليس معيارًا وظيفيًا. الأولوية المقترحة دعوة للتطوير، وليست قياسًا لنقص في قدرتك.',
              en: 'No overall score, no general “readiness” and no ranking of people. The target is an indicative editorial one for the role category, not a job standard. A suggested priority is an invitation to develop, not a measurement of a shortfall in your ability.',
            })}
          </Note>
        </Block>

        {/* 5 — technologies */}
        <Block id="m-tech">
          <p>
            <ClaimText
              text={t({
                ar: 'قائمة من {{method-tech-count}} مرتبطة بالمهارات التي تتطلبها كل تقنية. الغرض أن تعرف أي المهارات تستعد لها، لا أن تُقيَّم التقنيات نفسها.',
                en: 'A list of {{method-tech-count}}, each linked to the skills it requires. The aim is to show which skills to prepare for, not to rate the technologies themselves.',
              })}
            />
          </p>
          <Bullets
            items={[
              <ClaimText
                key="h"
                text={t({
                  ar: 'الأفق: {{method-tech-horizons}}. هو حكم تحريري عن موعد اتساع استخدام التقنية في العمل الحكومي.',
                  en: 'Horizon: {{method-tech-horizons}}. It is an editorial judgment of when a technology’s use in government work broadens.',
                })}
              />,
              <ClaimText
                key="trl"
                text={t({
                  ar: 'مقياس الجاهزية التقنية {{method-tech-trl}} يصف النضج العالمي للتقنية لا نضج تبنيها في المملكة، ويظهر في التفاصيل فقط بشارة «تحريري».',
                  en: 'The technology readiness scale {{method-tech-trl}} describes a technology’s global maturity, not its adoption in Saudi Arabia, and appears only in the details with an “editorial” badge.',
                })}
              />,
              t({
                ar: 'الحكم مراجعة مكتبية لكل تقنية مقابل إشارات منشورة مسماة، مع مسوّغ مكتوب لكل حكم.',
                en: 'Each judgment is a desk review against named published signals, with a written rationale.',
              }),
              t({
                ar: 'القائمة قراءة مستقلة، وليست رادارًا رسميًا لأي جهة.',
                en: 'The list is an independent reading, not an official radar of any organization.',
              }),
            ]}
          />
        </Block>

        {/* 6 — government data */}
        <Block id="m-gov">
          <p>
            {t({
              ar: 'تأتي أرقام الجهات من ملفي مصدر: سجل خدمات التمكين (التدريب والاستشارات)، ودليل الجهات والقطاعات. وهما سجلات داخلية لبرنامج قدراتك ومنصة الاستشارات والدراسات حتى نهاية الربع الثالث من 2026. الوحدتان مختلفتان: سجلات مشاركة تدريبية (لا أشخاص فريدون) وخدمات استشارية، فلا تُجمعان في رقم واحد.',
              en: 'Entity figures come from two source workbooks: the enablement service records (training and consulting) and the entity and sector directory. Both are internal records of the government digital-skills program and the consulting and studies platform, up to the end of the third quarter of 2026. The two units differ, training participation records (not unique people) and consulting services, so they are never added into one figure.',
            })}
          </p>
          <div className="overflow-x-auto rounded-btn border border-dga-line">
            <table className="w-full min-w-[34rem] text-start text-[13px]">
              <caption className="sr-only">{t({ ar: 'توفيق الأرقام الوطنية بين ثلاثة مصادر', en: 'Reconciling the national figures across three sources' })}</caption>
              <thead className="bg-dga-bg text-xs text-dga-muted">
                <tr>
                  <th scope="col" className="p-3 text-start font-semibold">{t({ ar: 'المصدر', en: 'Source' })}</th>
                  <th scope="col" className="p-3 text-start font-semibold">{t({ ar: 'سجلات المشاركة التدريبية', en: 'Training participation records' })}</th>
                  <th scope="col" className="p-3 text-start font-semibold">{t({ ar: 'الخدمات الاستشارية', en: 'Consulting services' })}</th>
                  <th scope="col" className="p-3 text-start font-semibold">{t({ ar: 'الحالة', en: 'Status' })}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-dga-line bg-dga-green/5 align-top">
                  <th scope="row" className="p-3 text-start font-semibold">
                    {t({ ar: 'مجاميع أوراق ملفي المصدر', en: 'Sheet totals of the two workbooks' })}
                  </th>
                  <td className="p-3"><Claim id="method-gov-training-sheet" variant="icon" /></td>
                  <td className="p-3"><Claim id="method-gov-consulting-sheet" variant="icon" /></td>
                  <td className="p-3 font-semibold text-dga-green-dark">{t({ ar: 'الرقم المنشور في الأداة', en: 'The figure the tool publishes' })}</td>
                </tr>
                <tr className="border-t border-dga-line align-top">
                  <th scope="row" className="p-3 text-start font-semibold">
                    {t({ ar: 'النص المنهجي المرافق للملفين', en: 'Prose accompanying the workbooks' })}
                  </th>
                  <td className="p-3"><Claim id="method-gov-training-prose" variant="icon" /></td>
                  <td className="p-3"><Claim id="method-gov-consulting-prose" variant="icon" /></td>
                  <td className="p-3 text-dga-muted">{t({ ar: 'لا يطابق الأوراق؛ للشفافية فقط', en: 'Does not match the sheets; for transparency only' })}</td>
                </tr>
                <tr className="border-t border-dga-line align-top">
                  <th scope="row" className="p-3 text-start font-semibold">
                    {t({ ar: 'السجل الحي لبرنامج قدراتك (تحقق أكتوبر 2026)', en: 'The program’s live register (checked October 2026)' })}
                  </th>
                  <td className="p-3"><Claim id="method-gov-training-register" variant="icon" /></td>
                  <td className="p-3"><Claim id="method-gov-consulting-register" variant="icon" /></td>
                  <td className="p-3 text-dga-muted">{t({ ar: 'يختلف بسبب تاريخ القطع والتصفية', en: 'Differs by cut-off date and filtering' })}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            {t({
              ar: 'نعرض في الأداة مجاميع الأوراق لأنها متسقة مع المجاميع القطاعية، ونذكر الرقمين الآخرين بتاريخيهما. يحسم المالك الرقم المعتمد، وتُحدَّث الأداة عندئذ.',
              en: 'The tool shows the sheet totals because they are consistent with the sector aggregates, and states the other two figures with their dates. The owner decides the confirmed figure, and the tool is updated then.',
            })}
          </p>
          <Bullets
            items={[
              <ClaimText
                key="n"
                text={t({
                  ar: 'البناء العام يعرض مجاميع فقط: أرقامًا وطنية ومجاميع قطاعية، ولا يظهر مجموع قطاع إلا إذا بلغ عدد جهاته ذات السجلات {{method-gov-sector-min}}.',
                  en: 'The public build shows aggregates only, national figures and sector aggregates, and a sector total appears only when its entities with records reach {{method-gov-sector-min}}.',
                })}
              />,
              t({
                ar: 'لا سجلات لكل جهة، ولا شعارات رسمية، ولا ترتيب للجهات، ولا وصف لجهة بأنها لم تستفد، ولا احتياجات مستنتجة لجهة بعينها.',
                en: 'No per-entity records, no official logos, no ranking of entities, no labelling of an entity as not served, and no inferred needs for a named entity.',
              }),
              t({
                ar: 'الطبقة التفصيلية لكل جهة موجودة في نسخة عرض خاصة فقط، ولا تُنشر.',
                en: 'The per-entity layer exists only in a private demonstration build and is not published.',
              }),
              t({
                ar: '«جهة حكومية» تعني جهة حكومية فقط؛ وتُسمّى الأنواع الأخرى (شركات مملوكة، وجهات أهلية، وأندية) بنوعها.',
                en: '“Government entity” means government entities only; other types (owned companies, non-profits, clubs) are named by their type.',
              }),
            ]}
          />
        </Block>

        {/* 7 — category mapping */}
        <Block id="m-mapping">
          <p>
            {t({
              ar: 'تُستخدم فئات الاستشارات في سجل الخدمات لاقتراح «مجالات تطوير مرتبطة بسجل الاستشارات» على مستوى القطاع. هذا استنتاج تحريري: طلب الجهة لاستشارة لا يقيس احتياج موظفيها، والأوزان أدناه افتراضات معلنة لا قياس.',
              en: 'The consulting categories in the service records are used to suggest “development domains linked to the consulting record” at sector level. This is an editorial inference: an entity requesting a consultation does not measure its staff’s needs, and the weights below are declared assumptions, not measurements.',
            })}
          </p>
          <div className="overflow-x-auto rounded-btn border border-dga-line">
            <table className="w-full min-w-[34rem] text-[13px]">
              <caption className="sr-only">{t({ ar: 'جدول أوزان ربط فئات الاستشارات بالمجالات', en: 'Weight table mapping consulting categories to domains' })}</caption>
              <thead className="bg-dga-bg text-xs text-dga-muted">
                <tr>
                  <th scope="col" className="p-3 text-start font-semibold">{t({ ar: 'فئة الاستشارات', en: 'Consulting category' })}</th>
                  <th scope="col" className="p-3 text-start font-semibold">{t({ ar: 'المجالات المرتبطة بالترتيب', en: 'Linked domains, in order' })}</th>
                  <th scope="col" className="p-3 text-start font-semibold">{t({ ar: 'الأوزان', en: 'Weights' })}</th>
                </tr>
              </thead>
              <tbody>
                {categoryWeightRows.map((row) => (
                  <tr key={row.key} className="border-t border-dga-line align-top">
                    <th scope="row" className="p-3 text-start font-semibold">{t(row.name)}</th>
                    <td className="p-3">
                      {row.weights.map((w, i) => {
                        const d = domainById(w.domainId)
                        return (
                          <span key={w.domainId}>
                            {i > 0 ? <span className="text-dga-muted"> · </span> : null}
                            {d ? t(d.name) : w.domainId}
                          </span>
                        )
                      })}
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <Claim id={row.claimId} variant="icon" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Bullets
            items={[
              t({
                ar: 'يُعرض المؤشر على مستوى القطاع فقط، مع عدد السجلات والفترة، وبشارة «استنتاج تحريري».',
                en: 'The indicator is shown at sector level only, with the record count and period, and an “editorial inference” badge.',
              }),
              t({
                ar: 'لا تُعرض نسب مئوية لأعلى ثلاثة مجالات بعد إعادة توزيعها، لأن هذه المعالجة تضخّم الفروق.',
                en: 'No percentages are shown for the top three domains after rescaling them, because that treatment exaggerates differences.',
              }),
              t({
                ar: 'يظهر الأمن السيبراني في المؤشر أقل من حقيقته لأن خدمات الأمن السيبراني الوطنية ليست ضمن هذه الاستشارات.',
                en: 'Cybersecurity appears lower than it really is, because national cybersecurity services are not part of these consultations.',
              }),
            ]}
          />
        </Block>

        {/* 8 — privacy */}
        <Block id="m-privacy">
          <Bullets
            items={[
              t({
                ar: 'لا يغادر شيء متصفحك: إجاباتك ونتائجك تُحفظ في جهازك فقط، ويمكنك حذفها متى شئت.',
                en: 'Nothing leaves your browser: your answers and results are stored on your device only, and you can delete them at any time.',
              }),
              t({
                ar: 'لا حسابات، ولا أدوات تحليل أو تتبع، ولا ملفات تعريف إعلانية.',
                en: 'No accounts, no analytics or tracking tools, and no advertising cookies.',
              }),
              t({
                ar: 'الخطوط مستضافة مع الموقع نفسه، فلا تُرسل الصفحة أي طلب إلى جهة خارجية عند التحميل.',
                en: 'Fonts are hosted with the site itself, so the page sends no request to any third party on load.',
              }),
              t({
                ar: 'إن اخترت نسخ رمز نتيجتك فهو يحمل درجات مقرّبة وفئة دورك فقط، بلا اسم ولا بيانات شخصية، ولا يُرسل إلى أي خادم.',
                en: 'If you choose to copy your result code, it carries only rounded scores and your role category, with no name or personal data, and it is never sent to a server.',
              }),
              t({
                ar: 'لا ربط بملف الموظف ولا بأي نظام للموارد البشرية.',
                en: 'No link to an employee file or to any HR system.',
              }),
            ]}
          />
        </Block>

        {/* 9 — independence */}
        <Block id="m-independence">
          <Note tone="green">
            {t({
              ar: 'رادار المهارات الرقمية مفهوم مستقل، وليس منتجًا رسميًا لأي جهة. أعدّه مؤلفه بصفة شخصية، ولا يمثل موقفًا رسميًا لأي جهة حكومية، ولا يستخدم شعارات رسمية. ذكر الأطر والتقارير والمؤشرات لا يعني أن جهاتها اعتمدت هذه الأداة.',
              en: 'The Digital Skills Radar is an independent concept, not an official product of any organization. Its author prepared it in a personal capacity; it represents no official position of any government entity and uses no official logos. Citing frameworks, reports and indices does not mean their publishers endorse this tool.',
            })}
          </Note>
        </Block>

        {/* 10 — limits */}
        <Block id="m-limits">
          <Bullets
            items={[
              t({
                ar: 'لم يُتحقق إحصائيًا بعد من صلاحية المقياس أو المواقف أو أسئلة التحقق المعرفي.',
                en: 'The scale, scenarios and knowledge-check questions have not yet been statistically validated.',
              }),
              t({
                ar: 'العتبات والأوزان والمستهدفات الاسترشادية تحريرية.',
                en: 'Thresholds, weights and indicative targets are editorial.',
              }),
              t({
                ar: 'بيانات الجهات تتوقف عند نهاية الربع الثالث من 2026، وسجلات التدريب سجلات مشاركة لا أشخاص.',
                en: 'Entity data stops at the end of the third quarter of 2026, and training records are participation records, not people.',
              }),
              t({
                ar: 'النص العربي هو المرجع، والترجمة الإنجليزية تحريرية.',
                en: 'The Arabic text is the reference; the English translation is editorial.',
              }),
              t({
                ar: 'بعض مصادر صفحة المعايير لم تُطابق بعد مع نصها الأصلي، وهي موسومة بثقة متوسطة أو منخفضة.',
                en: 'Some sources on the standards page have not yet been matched to their original text, and are marked medium or low confidence.',
              }),
            ]}
          />
        </Block>

        {/* 11 — cadence */}
        <Block id="m-cadence">
          <Bullets
            items={[
              t({ ar: 'مراجعة نصف سنوية لقائمة التقنيات وآفاقها.', en: 'A half-yearly review of the technology list and its horizons.' }),
              t({ ar: 'مراجعة ربع سنوية للأرقام الوطنية المتحركة وبيانات الجهات.', en: 'A quarterly review of fast-moving national figures and entity data.' }),
              t({
                ar: 'مراجعة سنوية لمكتبة الأدوار ومستهدفاتها الاسترشادية وبنك المواقف.',
                en: 'A yearly review of the role library, its indicative targets and the scenario bank.',
              }),
              <ClaimText
                key="stale"
                text={t({
                  ar: 'يحمل كل ادعاء تاريخ آخر مراجعة له، ويُوسم في سجل الأدلة بأنه يحتاج مراجعة إذا مضى على مراجعته {{method-review-stale}}.',
                  en: 'Every claim carries its last review date, and the evidence register flags it as needing review once {{method-review-stale}} have passed.',
                })}
              />,
            ]}
          />
        </Block>

        {/* 12 — release history */}
        <Block id="m-changelog">
          <ol className="space-y-4">
            {CHANGELOG.map((c) => (
              <li key={c.v} className="rounded-btn border border-dga-line bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="chip-ok font-mono font-bold" dir="ltr">
                    {c.v}
                  </span>
                  <time dateTime={c.date} className="text-xs text-dga-muted" dir="ltr">
                    {c.date}
                  </time>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {c.items.map((item, i) => (
                    <li key={i} className="flex gap-2 leading-relaxed">
                      <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" aria-hidden />
                      <span>{t(item)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Block>
      </div>

      {/* next */}
      <div className="mt-10 glass-strong flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-dga-black">{t({ ar: 'كل رقم في جدول واحد', en: 'Every figure in one table' })}</h2>
          <p className="mt-1 text-sm text-dga-muted">
            {t({
              ar: 'سجل الأدلة يعرض كل ادعاءات الأداة بمصادرها وأنواعها والثقة فيها وتواريخ مراجعتها.',
              en: 'The evidence register lists every claim in the tool with its source, type, confidence and review date.',
            })}
          </p>
        </div>
        <EvidenceLink className="btn-primary shrink-0 px-5 py-2.5 text-sm no-underline">
          {t({ ar: 'افتح سجل الأدلة', en: 'Open the evidence register' })}
          <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
        </EvidenceLink>
      </div>
    </div>
  )
}
