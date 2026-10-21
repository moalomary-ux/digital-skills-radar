import type { L } from './types'
import { careers, type Career, type CommitKey, type Signal } from './careers'

/**
 * Guidance dataset — decision flow, WEF lists, skills-vs-degree explainer,
 * and community features. Converted from research/future-careers.md §2–5.
 */

// ── Headline stats (WEF FoJ 2025) ───────────────────────────────────────────
export const headlineStats: { value: string; label: L }[] = [
  { value: '170M', label: { ar: 'وظيفة جديدة متوقعة عالميًا بحلول 2030', en: 'new jobs expected globally by 2030' } },
  { value: '92M', label: { ar: 'وظيفة متوقع استبدالها في الفترة نفسها', en: 'jobs expected to be displaced in the same period' } },
  { value: '39%', label: { ar: 'من المهارات الأساسية متوقع أن تتغير بحلول 2030', en: 'of core skills are expected to change by 2030' } },
  { value: '+78M', label: { ar: 'صافٍ متوقع للوظائف — التوقعات تخلق أكثر مما تلغي', en: 'expected net new jobs — projections create more than they remove' } },
]

// ── WEF FoJ 2025 verbatim lists ─────────────────────────────────────────────
export interface RankedRole {
  rank: number
  name: L
  growth?: string // percentage for the growing list
}

export const growingList: RankedRole[] = [
  { rank: 1, name: { ar: 'أخصائيو البيانات الضخمة', en: 'Big Data Specialists' }, growth: '+110%' },
  { rank: 2, name: { ar: 'مهندسو التقنية المالية', en: 'FinTech Engineers' }, growth: '+95%' },
  { rank: 3, name: { ar: 'أخصائيو الذكاء الاصطناعي وتعلم الآلة', en: 'AI and Machine Learning Specialists' }, growth: '+85%' },
  { rank: 4, name: { ar: 'مطوّرو البرمجيات والتطبيقات', en: 'Software and Applications Developers' }, growth: '+60%' },
  { rank: 5, name: { ar: 'أخصائيو إدارة الأمن', en: 'Security Management Specialists' }, growth: '+55%' },
  { rank: 6, name: { ar: 'أخصائيو مستودعات البيانات', en: 'Data Warehousing Specialists' }, growth: '+50%' },
  { rank: 7, name: { ar: 'أخصائيو المركبات ذاتية القيادة والكهربائية', en: 'Autonomous and Electric Vehicle Specialists' }, growth: '+45%' },
  { rank: 8, name: { ar: 'مصممو الواجهات وتجربة المستخدم', en: 'UI and UX Designers' }, growth: '+45%' },
  { rank: 9, name: { ar: 'سائقو الشاحنات الخفيفة وخدمات التوصيل', en: 'Light Truck or Delivery Services Drivers' }, growth: '+45%' },
  { rank: 10, name: { ar: 'أخصائيو إنترنت الأشياء', en: 'Internet of Things Specialists' }, growth: '+40%' },
  { rank: 11, name: { ar: 'محللو وعلماء البيانات', en: 'Data Analysts and Scientists' }, growth: '+40%' },
  { rank: 12, name: { ar: 'مهندسو البيئة', en: 'Environmental Engineers' }, growth: '+40%' },
  { rank: 13, name: { ar: 'محللو أمن المعلومات', en: 'Information Security Analysts' }, growth: '+40%' },
  { rank: 14, name: { ar: 'مهندسو DevOps', en: 'DevOps Engineers' }, growth: '+40%' },
  { rank: 15, name: { ar: 'مهندسو الطاقة المتجددة', en: 'Renewable Energy Engineers' }, growth: '+40%' },
]

export const decliningList: RankedRole[] = [
  { rank: 1, name: { ar: 'موظفو الخدمات البريدية', en: 'Postal Service Clerks' } },
  { rank: 2, name: { ar: 'موظفو صرافة البنوك والكُتّاب المرتبطون', en: 'Bank Tellers and Related Clerks' } },
  { rank: 3, name: { ar: 'موظفو إدخال البيانات', en: 'Data Entry Clerks' } },
  { rank: 4, name: { ar: 'أمناء الصناديق وموظفو بيع التذاكر', en: 'Cashiers and Ticket Clerks' } },
  { rank: 5, name: { ar: 'المساعدون الإداريون والسكرتارية التنفيذية', en: 'Administrative Assistants and Executive Secretaries' } },
  { rank: 6, name: { ar: 'عمال الطباعة والحرف المرتبطة', en: 'Printing and Related Trades Workers' } },
  { rank: 7, name: { ar: 'كُتّاب المحاسبة ومسك الدفاتر والرواتب', en: 'Accounting, Bookkeeping and Payroll Clerks' } },
  { rank: 8, name: { ar: 'كُتّاب تسجيل المواد والمخزون', en: 'Material-Recording and Stock-Keeping Clerks' } },
  { rank: 9, name: { ar: 'مضيفو ومراقبو النقل', en: 'Transportation Attendants and Conductors' } },
  { rank: 10, name: { ar: 'مندوبو المبيعات الميدانية والباعة الجائلون', en: 'Door-To-Door Sales Workers, News and Street Vendors' } },
]

export const decliningExtra: L = {
  ar: 'كما تضم القائمة (المراتب 11–15): مصممي الجرافيك، ومحققي المطالبات التأمينية، والموظفين القانونيين، والسكرتارية القانونية، وموظفي التسويق الهاتفي.',
  en: 'Also on the declining list (ranks 11–15): Graphic Designers; Claims Adjusters, Examiners and Investigators; Legal Officials; Legal Secretaries; Telemarketers.',
}

export const absoluteNumbersNote: L = {
  ar: 'بالأرقام المطلقة (لا النسب) تتصدر الوظائف اليدوية والرعائية والتعليمية النمو: عمال المزارع (+35 مليونًا تقريبًا)، وسائقو التوصيل، وعمال البناء، والباعة، وعمال تصنيع الأغذية، إلى جانب مهن الرعاية (التمريض والعمل الاجتماعي والرعاية الشخصية) والتعليم (أساتذة الجامعات والثانوية). هذا مهم لأنه يوازن الانطباع بأن المستقبل «تقني فقط».',
  en: 'In absolute numbers (not %), the largest-growing roles are Farmworkers (~+35M), Delivery Drivers, Construction Workers, Salespersons, Food Processing Workers, plus care-economy roles (Nursing Professionals, Social Work & Counselling, Personal Care Aides) and education roles (University and Secondary Teachers). This matters because it balances the impression that the future is "tech only".',
}

export const decliningCommonThread: L = {
  ar: 'القاسم المشترك: كل مهنة متراجعة مبنية على مهام روتينية قابلة للرقمنة — وهي بالضبط ما يلتهمه الذكاء الاصطناعي أولًا (منظمة العمل الدولية 2025: الأعمال الكتابية هي أعلى الفئات تعرضًا).',
  en: 'Common thread (WEF FoJ 2025): every declining role is built on routine, rule-based, digitisable tasks — the exact task profile GenAI and automation absorb first (ILO 2025: clerical work is the highest-exposure occupational group).',
}

// ── Skills-first vs degree-first explainer (7 paragraphs) ───────────────────
export interface ExplainerParagraph {
  id: string
  title: L
  body: L
}

export const explainerParagraphs: ExplainerParagraph[] = [
  {
    id: 'p1',
    title: { ar: 'تغيّر السؤال', en: 'The question has changed' },
    body: {
      ar: 'لأربعين عامًا كان سؤال المستقبل المهني في السعودية «أي جامعة وأي تخصص؟». أما اليوم فالسؤال الحقيقي هو «أي مهارات، وكيف تثبتها؟». يقدّر تقرير المنتدى الاقتصادي العالمي لمستقبل الوظائف 2025 أن 39% من مهارات العاملين ستتغير بحلول 2030 — أي أن شهادة تُنال في 2027 ستكون قديمة جزئيًا قبل أن يبلغ حاملها الثلاثين. هذا لا يجعل الشهادة بلا قيمة، لكنه يجعلها غير كافية وحدها.',
      en: 'For forty years the Saudi career question was "which university and which major?" Today the real question is "which skills, proven how?" The World Economic Forum’s Future of Jobs Report 2025 estimates that 39% of the skills workers use today will change by 2030 — meaning a degree earned in 2027 will be partially outdated before its holder turns 30. This does not make degrees useless; it makes them insufficient on their own.',
    },
  },
  {
    id: 'p2',
    title: { ar: 'ماذا يقول أصحاب العمل وماذا يفعلون', en: 'What employers say and do' },
    body: {
      ar: 'تُظهر الاستطلاعات تحولًا كبيرًا: 85% من أصحاب العمل يستخدمون التوظيف القائم على المهارات و53% أزالوا شرط الشهادة من بعض الإعلانات (TestGorilla 2025)، و97% يستخدمون أو يستكشفون مناهج مهارية (تقرير Coursera 2025). لكن البيانات الصادقة تُخفف الحماس: وجدت دراسة هارفارد وBurning Glass (2024) أن أقل من 1 من كل 700 توظيفًا تأثرت فعليًا بإسقاط شرط الشهادة، وأن 45% من الشركات غيّرت إعلاناتها «بالاسم فقط». الترجمة للأسر: التوظيف المهاري حقيقي ومتنامٍ، لكن الشهادة لم تتوقف عن فتح الأبواب، خاصة في المهن المرخّصة والقطاع الحكومي السعودي.',
      en: 'Employer surveys show a dramatic shift: 85% of employers report using skills-based hiring and 53% have removed degree requirements from some postings (TestGorilla, State of Skills-Based Hiring 2025); 97% of employers are using or exploring skills-based approaches (Coursera Micro-Credentials Impact Report 2025). But honest data tempers the hype: Harvard Business School and the Burning Glass Institute (2024) found that fewer than 1 in 700 actual hires were affected by dropped degree requirements — 45% of companies changed their job ads "in name only." Translation for families: skills-first is real and growing, but the degree has not stopped opening doors, especially in Saudi Arabia’s licensed professions and government sector.',
    },
  },
  {
    id: 'p3',
    title: { ar: 'ماذا تثبت الشهادات المصغّرة اليوم', en: 'What micro-credentials now prove' },
    body: {
      ar: 'الشهادات القصيرة الموثقة تجاوزت عتبة المصداقية: تُظهر بيانات Coursera لعام 2025 أن 94% من المتعلمين يعتقدون أن الشهادات المصغّرة تحسّن النجاح الوظيفي مباشرة، وأن أكثر من اثنين من كل خمسة متعلمين في الشرق الأوسط يحملون واحدة — من أعلى النسب عالميًا. وفي السعودية تحديدًا، نمت تسجيلات الشهادات المهنية 73% وتسجيلات الأمن السيبراني 61% سنويًا (تقرير Coursera 2025)، وتفيد أكاديمية طويق بأن نحو 80% من خريجيها يُوظَّفون عبر مسار معرض التوظيف. الشهادة المصحوبة بملف أعمال حقيقي أصبحت تذكرة دخول مشروعة في التقنية والبيانات والتصميم والتسويق الرقمي.',
      en: "Short, verified credentials have crossed a credibility threshold: Coursera's 2025 data shows 94% of learners believe micro-credentials directly improve job success, and over two in five MENA learners already hold one — among the highest rates globally. In Saudi Arabia specifically, Professional Certificate enrollments grew 73% and cybersecurity enrollments 61% year-over-year (Coursera Global Skills Report 2025), and national bootcamps like Tuwaiq Academy report roughly 80% of graduates placed through their job-fair pipeline. A certificate with a portfolio of real projects is now a legitimate entry ticket in tech, data, design and digital marketing.",
    },
  },
  {
    id: 'p4',
    title: { ar: 'ما الذي تقدمه الشهادة الجامعية وحدها', en: 'What degrees still uniquely provide' },
    body: {
      ar: 'ثلاثة أشياء لا يعيد أي معسكر تدريبي إنتاجها: (1) الترخيص القانوني — الطب والتوقيع الهندسي والمحاماة والتعليم تتطلب شهادات معتمدة، وانتهى؛ (2) الأسس النظرية العميقة — الرياضيات خلف الذكاء الاصطناعي، والفسيولوجيا خلف الحكم السريري، والإنشاءات خلف الجسور الآمنة؛ (3) البيئة التكوينية — أربع سنوات من التحدي المنظم والعلاقات والنضج. وخلاصة McKinsey أن التوظيف المهاري أدق خمس مرات في التنبؤ بالأداء تنطبق على الفرز، لا على استبدال التعلم العميق الذي تفرضه درجة جامعية صارمة.',
      en: "Three things no bootcamp replicates: (1) legal licensure — medicine, engineering sign-off, law practice and teaching require accredited degrees, full stop; (2) deep theoretical foundations — the math behind AI, the physiology behind clinical judgment, the structures behind safe bridges; (3) the developmental container — four years of structured challenge, networks and maturity formation. McKinsey's finding that skills-based hiring is five times more predictive of performance applies to screening, not to replacing the deep learning a rigorous degree forces.",
    },
  },
  {
    id: 'p5',
    title: { ar: 'الواقع الهجين', en: 'The hybrid reality' },
    body: {
      ar: 'أقوى ملف مهني في 2030 ليس «شهادة فقط» ولا «شهادات مصغّرة فقط» بل تراكمي: درجة جامعية (أو دبلوم) كقاعدة، ثم مهارة موثقة جديدة كل عام. فالنتيجة الجوهرية لتقرير 2025 — تغيّر 39% من المهارات — تعني أن المهن تُصان ولا تُنجَز. وفي السعودية هذا النموذج الهجين مصمم عمدًا: برنامج تنمية القدرات البشرية في رؤية 2030، وأكاديمية طويق (أكثر من 32 ألف متدرب)، والأكاديمية السعودية الرقمية، وأكاديمية سدايا — كلها موجودة ليتمكن الخريج من تراكم شهادات معترف بها وطنيًا مجانًا أو شبه مجانًا.',
      en: "The strongest 2030 profile is neither degree-only nor certificate-only but stacked: a degree (or diploma) as the base, plus one new verified skill every year. WEF 2025's core finding — 39% skill churn — means careers are now maintained, not completed. In Saudi Arabia this hybrid is deliberately engineered: Vision 2030's Human Capability Development Program, Tuwaiq Academy (32,000+ trainees), Saudi Digital Academy, and SDAIA Academy all exist so that a graduate can keep stacking Saudi-recognized credentials for free or nearly so.",
    },
  },
  {
    id: 'p6',
    title: { ar: 'قراءة سوق العمل السعودي بشكل صحيح', en: 'Reading the Saudi labour market correctly' },
    body: {
      ar: 'على الأسر أن تعرف أن الأرض تحركت: بلغت بطالة السعوديين مستوى قياسيًا منخفضًا عند 6.3% في الربع الأول 2025 (الهيئة العامة للإحصاء)، وتحقق مستهدف رؤية 2030 للبطالة (7%) قبل ست سنوات من موعده، والأهم — القطاع الخاص لا الحكومة هو من يخلق غالبية الوظائف الجديدة للسعوديين اليوم (البنك الدولي/الموارد البشرية 2025: حصة 52.8% وترتفع). والشركات الخاصة توظّف بناءً على القدرة المثبتة أسرع بكثير مما كان يفعل القطاع العام. استراتيجية «الوظيفة الحكومية الآمنة» لجيل الآباء لم تعد إحصائيًا الطريق الرئيس.',
      en: 'Families should know the ground shifted: Saudi unemployment hit a record 6.3% in Q1 2025 (GASTAT), the Vision 2030 target of 7% was met six years early, and — decisively — the private sector, not government, now creates most new Saudi jobs (World Bank/HRSD 2025: 52.8% Saudi private-sector employment share, rising). Private employers hire for demonstrated capability faster than the public sector ever did. The "safe government job" strategy of the previous generation is statistically no longer the main road.',
    },
  },
  {
    id: 'p7',
    title: { ar: 'قاعدة عملية للأسر', en: 'Practical rule for families' },
    body: {
      ar: 'استخدموا اختبار السؤالين لأي خطة مهنية: (أ) هل المهنة مرخّصة نظامًا؟ إن نعم، فالشهادة الجامعية إلزامية — اختاروا أفضل برنامج ثم اركبوا المهارات فوقه. (ب) إن لم تكن مرخّصة، هل يمكن إثبات المهارة بملف أعمال خلال 12 شهرًا؟ إن نعم، فكروا في المسار المهاري أو الهجين (طويق، الأكاديمية السعودية الرقمية، Coursera) مع الشهادة كمسار موازٍ اختياري. وفي الحالتين، خصصوا ميزانية للتعلم مدى الحياة: 59 من كل 100 عامل سيحتاجون تدريبًا جوهريًا بحلول 2030 (تقرير 2025)، ومن يخطط لذلك مبكرًا هو من ستتنافس عليه السوق.',
      en: 'Use this two-question test for any career plan: (a) Is the profession licensed? If yes, the degree is mandatory — choose the best program, then stack skills on top. (b) If not licensed, can a portfolio prove the skill in under 12 months? If yes, consider skills-first or hybrid entry (Tuwaiq, SDA, Coursera) with the degree as an optional parallel track. Either way, budget for lifelong learning: 59 of every 100 workers will need significant training by 2030 (WEF 2025), and the ones who plan for it will be the ones the market fights over.',
    },
  },
]

// ── Decision wizard: persona + 5 questions ──────────────────────────────────

/** Who is answering — adapts wording and results framing (review P1-1). */
export type Persona = 'student' | 'parent' | 'employee' | 'changer'

export const personaMeta: Record<Persona, { name: L; resultsHeading: L; resultsIntro: L }> = {
  student: {
    name: { ar: 'طالب', en: 'Student' },
    resultsHeading: { ar: 'ترشيحاتنا الثلاثة لك', en: 'Our three matches for you' },
    resultsIntro: { ar: 'نقطة انطلاق للاستكشاف — ناقشها مع موجه مدرستك أو جامعتك.', en: 'A starting point for exploration — discuss it with your school or university counselor.' },
  },
  parent: {
    name: { ar: 'والد أو وليّ', en: 'Parent / guardian' },
    resultsHeading: { ar: 'ثلاثة اتجاهات لمناقشتها مع ابنك', en: 'Three directions to discuss with your child' },
    resultsIntro: { ar: 'القرار قرار ابنك في النهاية — استخدم هذه النتائج لفتح حوار، لا لفرضه.', en: 'The decision is ultimately your child’s — use these results to open a conversation, not to settle it.' },
  },
  employee: {
    name: { ar: 'موظف يبحث عن تطوير', en: 'Employee seeking growth' },
    resultsHeading: { ar: 'ثلاثة اتجاهات لتطوير مسارك', en: 'Three directions to grow your path' },
    resultsIntro: { ar: 'قارنها بدورك الحالي — أقربها قد يكون تطورًا داخل مسارك لا خروجًا منه.', en: 'Compare them with your current role — the closest may be growth within your track, not an exit.' },
  },
  changer: {
    name: { ar: 'متغيّر مهني', en: 'Career changer' },
    resultsHeading: { ar: 'ثلاثة اتجاهات لتحوّلك المهني', en: 'Three directions for your career change' },
    resultsIntro: { ar: 'خبرتك السابقة رصيد — ابحث عن أوجه النقل بينها وبين الاتجاهات المقترحة.', en: 'Your prior experience is an asset — look for transferable overlap with the suggested directions.' },
  },
}

export interface DecisionOption {
  key: string
  label: L
  /** RIASEC-lite tag shown under interest options */
  riasec?: L
}
export interface DecisionQuestion {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5'
  title: L
  options: DecisionOption[]
  multi?: boolean
  maxPicks?: number
}

export const decisionQuestions: DecisionQuestion[] = [
  {
    id: 'q1',
    title: { ar: 'أي نوع من المشكلات تستمتع بحلّها؟', en: 'What kind of problems do you enjoy solving?' },
    multi: true,
    maxPicks: 2,
    options: [
      { key: 'people_care', label: { ar: 'مساعدة الناس ورعايتهم', en: 'Helping and caring for people' }, riasec: { ar: 'اجتماعي', en: 'Social' } },
      { key: 'build_tech', label: { ar: 'بناء الأشياء بالتقنية والبرمجة', en: 'Building things with technology/code' }, riasec: { ar: 'بحثي + واقعي', en: 'Investigative + Realistic' } },
      { key: 'build_physical', label: { ar: 'بناء وإصلاح الأشياء بيديّ', en: 'Building/fixing things with my hands' }, riasec: { ar: 'واقعي', en: 'Realistic' } },
      { key: 'numbers_logic', label: { ar: 'الأرقام والأنماط والمنطق', en: 'Numbers, patterns and logic' }, riasec: { ar: 'بحثي', en: 'Investigative' } },
      { key: 'persuade_create', label: { ar: 'إقناع الناس / صناعة المحتوى', en: 'Persuading people / creating content' }, riasec: { ar: 'فني + مغامر', en: 'Artistic + Enterprising' } },
      { key: 'organize_rule', label: { ar: 'تنظيم الأنظمة وتطبيق القواعد', en: 'Organizing systems and applying rules' }, riasec: { ar: 'تقليدي', en: 'Conventional' } },
      { key: 'unsure', label: { ar: 'لست متأكدًا بعد', en: 'Not sure yet' } },
    ],
  },
  {
    id: 'q2',
    title: { ar: 'أي المواد الدراسية تجدها سهلة عليك؟', en: 'Which school subjects feel easy to you?' },
    options: [
      { key: 'math_strong', label: { ar: 'الرياضيات والفيزياء', en: 'Math & physics' } },
      { key: 'bio_strong', label: { ar: 'الأحياء والكيمياء', en: 'Biology & chemistry' } },
      { key: 'lang_strong', label: { ar: 'اللغات والكتابة', en: 'Languages & writing' } },
      { key: 'practical', label: { ar: 'الأعمال العملية والتقنية', en: 'Practical/technical work' } },
      { key: 'mixed', label: { ar: 'قليل من كل شيء', en: 'A bit of everything' } },
    ],
  },
  {
    id: 'q3',
    title: { ar: 'كم وزنًا تعطي لنمو سوق العمل مقابل الشغف الشخصي؟', en: 'How much weight do you give to job-market growth vs personal passion?' },
    options: [
      { key: 'market_first', label: { ar: 'طلب السوق أولًا', en: 'Market demand first' } },
      { key: 'balanced', label: { ar: 'توازن بينهما', en: 'Balance both' } },
      { key: 'passion_first', label: { ar: 'الشغف أولًا', en: 'Passion first' } },
    ],
  },
  {
    id: 'q4',
    title: { ar: 'كيف تتعلم بشكل أفضل؟', en: 'How do you learn best?' },
    options: [
      { key: 'structured_classroom', label: { ar: 'الفصول المنظمة والبرامج الطويلة', en: 'Structured classrooms & long programs' } },
      { key: 'project_based', label: { ar: 'المشاريع والمعسكرات والتعلم بالممارسة', en: 'Projects, bootcamps, learning by doing' } },
      { key: 'apprenticeship', label: { ar: 'بجانب خبير أو موجّه أثناء العمل', en: 'Alongside a master/mentor on the job' } },
    ],
  },
  {
    id: 'q5',
    title: { ar: 'كم من الوقت يمكنك الاستثمار قبل بدء الكسب؟', en: 'How long can you invest before earning?' },
    options: [
      { key: 'under_1y', label: { ar: 'أقل من سنة', en: 'Under 1 year' } },
      { key: 'y1_3', label: { ar: 'سنة إلى ثلاث سنوات', en: '1–3 years' } },
      { key: 'y4_6', label: { ar: 'أربع إلى ست سنوات', en: '4–6 years' } },
      { key: 'over_6y', label: { ar: 'أكثر من ست سنوات', en: 'More than 6 years' } },
    ],
  },
]

export type DecisionAnswers = Partial<Record<'q2' | 'q3' | 'q4' | 'q5', string>> & { q1?: string[] }

/** A fully answered flow. */
export interface CompletedAnswers {
  persona: Persona
  q1: string[]
  q2: string
  q3: string
  q4: string
  q5: string
}

const COMMIT_ORDER: CommitKey[] = ['under_1y', 'y1_3', 'y4_6', 'over_6y']
const MARKET_SCORE: Record<Signal, number> = { GROWING: 3, TRANSFORMING: 2, DECLINING: 1 }

export interface CareerMatch {
  career: Career
  score: number
  reasons: string[] // explanation keys, resolved to bilingual text in the view
  pathway: 'degree_route' | 'skills_first_route' | 'hybrid'
}

export interface DecisionResult {
  top: CareerMatch[]
  warnings: Career[] // declining careers the user's interest points at
  /** interest-matching careers excluded only by the commitment filter — shown flagged, never hidden */
  commitmentMisses: Career[]
}

const EXPOSURE_RANK: Record<string, number> = { low: 0, medium: 1, high: 2 }

/**
 * Mechanical mapping per research/future-careers.md §4 pseudocode,
 * with expert-review fixes (P0-4):
 *  - no fabricated aptitude reason when a career has no aptitude requirement;
 *  - passion_first genuinely reshapes scoring (interest weighs more, market
 *    weighs less — not zero information);
 *  - deterministic, meaningful tie-break: lower automation exposure first;
 *  - long/licensed careers excluded by the commitment filter are returned as
 *    flagged near-matches instead of silently hidden.
 */
export function recommendCareers(answers: CompletedAnswers): DecisionResult {
  const results: { career: Career; score: number; reasons: string[] }[] = []
  const commitmentMisses: Career[] = []

  for (const c of careers) {
    const fitsCommitment =
      COMMIT_ORDER.indexOf(answers.q5 as CommitKey) >= COMMIT_ORDER.indexOf(c.matching.minCommitment)
    const matchedInterests = c.matching.interestKeys.filter((k) => answers.q1.includes(k))
    const interestHit = matchedInterests.length > 0

    // declining careers are never recommended (shown as warnings below)
    if (MARKET_SCORE[c.signal] === 1) continue

    // commitment filter: collect flagged near-matches instead of hiding
    if (!fitsCommitment) {
      if (interestHit) commitmentMisses.push(c)
      continue
    }

    let score = 0
    const reasons: string[] = []

    // interests: dominant factor (per matched interest, up to 2);
    // weighs even more when the user is passion-first
    const interestWeight = answers.q3 === 'passion_first' ? 3 : 2
    for (const k of matchedInterests.slice(0, 2)) {
      score += interestWeight
      reasons.push(`interest:${k}`)
    }

    // aptitude: only score (and explain) when the career actually declares an aptitude fit
    if (c.matching.aptitudeKeys.length > 0 && c.matching.aptitudeKeys.includes(answers.q2)) {
      score += 2
      reasons.push(`aptitude:${answers.q2}`)
    } else if (c.matching.aptitudeKeys.length === 0) {
      score += 1 // open to all aptitudes — neutral small bonus, no fabricated reason
    }

    if (c.matching.learningStyles.includes(answers.q4)) {
      score += 1
      reasons.push(`style:${answers.q4}`)
    }

    // market weighting: strong under market_first, mild under balanced,
    // and still counted (halved) under passion_first — passion mutes, never blinds
    const marketDelta = MARKET_SCORE[c.signal] - 2 // +1 GROWING, 0 TRANSFORMING
    if (answers.q3 === 'market_first') score += 2 * marketDelta
    else if (answers.q3 === 'balanced') score += 1 * marketDelta
    else score += 0.5 * marketDelta
    if (c.signal === 'GROWING' && answers.q3 !== 'passion_first') reasons.push('market:growing')

    results.push({ career: c, score, reasons })
  }

  const top = results
    .sort(
      (a, b) =>
        b.score - a.score ||
        EXPOSURE_RANK[a.career.automationExposure] - EXPOSURE_RANK[b.career.automationExposure] ||
        a.career.id.localeCompare(b.career.id)
    )
    .slice(0, 3)
    .map((r): CareerMatch => {
      const c = r.career
      let pathway: CareerMatch['pathway']
      if (c.matching.licenseRequired) pathway = 'degree_route'
      else if (answers.q4 === 'project_based' && COMMIT_ORDER.indexOf(answers.q5 as CommitKey) <= COMMIT_ORDER.indexOf('y1_3'))
        pathway = 'skills_first_route'
      else pathway = 'hybrid'
      return { ...r, pathway }
    })

  // honest warnings: declining careers matching the user's interest
  const warnings = careers.filter(
    (c) => MARKET_SCORE[c.signal] === 1 && c.matching.interestKeys.some((k) => answers.q1.includes(k))
  )

  return { top, warnings, commitmentMisses }
}

// ── Community learning features ─────────────────────────────────────────────
export interface CommunityFeature {
  id: string
  name: L
  description: L
  rationale: string // evidence text (source language EN translated inline where needed)
  rationaleAr: string
  sources: string[]
}

export const communityFeatures: CommunityFeature[] = [
  {
    id: 'learning_circles',
    name: { ar: 'حلقات التعلم', en: 'Learning Circles' },
    description: {
      ar: 'مجموعات صغيرة (8–15 عضوًا) تدرس المقرر نفسه معًا وفق جدول أسبوعي مشترك — عن بُعد أو في مكتبة أو مجلس — بميسّر متناوب. نسخة سعودية: حلقات لكل مدينة ومسار.',
      en: "Small peer groups (8–15 members) that take the same course together on a shared weekly schedule — online or in a library/majlis — with a rotating facilitator. Saudi-localized: circles per city and per track (e.g., 'Riyadh data circle', 'Jeddah nursing circle').",
    },
    rationale: 'Cohort formats reach ~70–90% completion vs 3–15% for solo self-paced (Harvard/MIT MOOC research; cohort-industry benchmarks); 11–25 member groups show the highest completion (Ruzuku platform data). Peer accountability, not content quality, is the main dropout killer.',
    rationaleAr: 'تصل الدفعات المشتركة إلى 70–90% إتمام مقابل 3–15% للتعلم الذاتي المنفرد (بحث Harvard/MIT للمساقات المفتوحة)؛ والمجموعات من 11–25 متعلمًا تسجل أعلى إتمام (بيانات Ruzuku). المساءلة بين الأقران — لا جودة المحتوى — هي القاتل الأول للانسحاب.',
    sources: ['Harvard/MIT MOOC completion research', 'Ruzuku cohort dataset 2026', 'Coursera GSR 2025'],
  },
  {
    id: 'cohort_course_bridge',
    name: { ar: 'وضع الدفعات للمساقات المجانية', en: 'Cohort Mode for Free Courses' },
    description: {
      ar: 'تغلّف المنصة المحتوى المجاني القائم (Coursera/edX/مساقات طويق المفتوحة) بهيكل دفعة منظم: تاريخ بدء ثابت، ومحطات أسبوعية، وتذكيرات بالمواعيد، وحفل إتمام. التنشيط في الأسبوع الأول طقس مصمم — على كل عضو نشر تسليمة الأسبوع الأول.',
      en: 'The platform wraps existing free content (Coursera/edX/Tuwaiq open courses) in a structured cohort shell: fixed start date, weekly milestones, deadline reminders, and a completion ceremony. First-week activation is a designed ritual — every member must post a week-1 deliverable.',
    },
    rationale: 'First-week activity is the strongest single completion predictor (78.3% vs 17.2%, Ruzuku data, 921k records); scheduled courses complete at ~53% vs ~42% open-access — structure converts free content from 3–6% completion to cohort-level rates.',
    rationaleAr: 'النشاط في الأسبوع الأول هو أقوى مؤشر منفرد على الإتمام (78.3% مقابل 17.2%، بيانات Ruzuku على 921 ألف سجل)؛ والمساقات المجدولة تُتم بنسبة ~53% مقابل ~42% للوصول المفتوح — فالهيكلة تحوّل المحتوى المجاني من 3–6% إتمام إلى معدلات الدفعات.',
    sources: ['Ruzuku cohort dataset 2026', 'Harvard/MIT MOOC research'],
  },
  {
    id: 'public_learning_portfolios',
    name: { ar: 'ملفات التعلم العامة', en: 'Public Learning Portfolios' },
    description: {
      ar: 'يحتفظ كل متعلم بصفحة ملف عامة ثنائية اللغة: شهادات مصغّرة موثقة، ومشاريع، وسلاسل تعلم — قابلة للمشاركة مع أصحاب العمل والأسرة. التقدم مرئي بالتصميم؛ ويمكن للأهل متابعة ملف أبنائهم.',
      en: 'Every learner maintains a public, bilingual portfolio page: verified micro-credentials, projects, and learning streaks — shareable to employers and family. Progress is visible by design; families can follow a child’s portfolio.',
    },
    rationale: '94% of learners believe micro-credentials improve job success (Coursera GSR 2025) and skills-first employers need demonstrable proof — 70% of job posts now require specific skills (LinkedIn data). Public commitment also functions as a completion mechanism (social accountability).',
    rationaleAr: '94% من المتعلمين يعتقدون أن الشهادات المصغّرة تحسّن النجاح الوظيفي (Coursera 2025) وأصحاب العمل المهاريون يحتاجون إثباتًا ملموسًا — 70% من إعلانات الوظائف تتطلب مهارات محددة (بيانات LinkedIn). والالتزام العلني نفسه يعمل كآلية إتمام (مساءلة اجتماعية).',
    sources: ['Coursera GSR 2025', 'LinkedIn Skills on the Rise 2025', 'TestGorilla 2025'],
  },
  {
    id: 'mentor_matching',
    name: { ar: 'الإرشاد المهني', en: 'Mentor Matching' },
    description: {
      ar: 'ممارسون من مهن قاعدة البيانات الثلاثين يتطوعون كموجّهين؛ والمطابقة حسب المسار المهني والمدينة وتفضيل الجنس. يقدم الموجهون جلسات شهرية «يوم في الحياة» ويراجعون ملفات الأعمال. يرتبط بشبكات خريجي الأكاديميات السعودية (طويق، SDA، سدايا).',
      en: "Practitioners from the 30 dataset careers volunteer as mentors; matching is by career track, city, and gender preference. Mentors run monthly 'day in the life' sessions and review portfolios. Ties into Saudi academies' alumni networks (Tuwaiq, SDA, SDAIA).",
    },
    rationale: "WEF FoJ 2025 lists teaching & mentoring among rising skills and 77% of employers plan reskilling — mentoring is how tacit, non-course knowledge transfers; Tuwaiq's self-reported ~80% placement rate illustrates the power of structured practitioner pipelines in Saudi Arabia.",
    rationaleAr: 'يصنف تقرير مستقبل الوظائف 2025 التعليم والإرشاد ضمن المهارات الصاعدة و77% من أصحاب العمل يخططون لإعادة التأهيل — فالإرشاد هو كيفية انتقال المعرفة الضمنية التي لا تقدمها المساقات؛ ومعدل التوظيف الذي تفيد به أكاديمية طويق (~80% من خريجيها، بحسب إعلانها) يظهر قوة مسارات الممارسين المنظمة في السعودية.',
    sources: ['WEF FoJ 2025', 'Tuwaiq Academy placement data (SPA 2024)'],
  },
  {
    id: 'teach_to_learn',
    name: { ar: 'شارات تعلَّم بالتعليم', en: 'Teach-to-Learn Badges' },
    description: {
      ar: 'ينال المتعلمون شارات متقدمة عبر الشرح: كتابة مقال مبسّط ثنائي اللغة، أو تيسير جلسة حلقة تعلم، أو تسجيل فيديو شرح مدته 10 دقائق يراجعه الأقران. وتغذي الشروح قاعدة المعرفة العامة للمنصة مع نسبة الفضل.',
      en: "Learners earn advanced badges by explaining: writing a bilingual explainer post, running a learning-circle session, or recording a 10-minute teach-back video reviewed by peers. Explanations feed the platform's public knowledge base with attribution.",
    },
    rationale: "Peer teaching is among the most robust learning mechanisms in education research (learning-by-teaching/protégé effect); WEF 2025 ranks teaching & mentoring skills as increasingly demanded; generating Arabic-first explainers also closes the Arabic content gap that Coursera GSR 2025 implies (Saudi learners' surge in English-medium GenAI courses).",
    rationaleAr: 'التعليم بين الأقران من أرسخ آليات التعلم في بحوث التربية (تأثير التعلم بالتعليم)؛ ويصنف تقرير 2025 مهارات التعليم والإرشاد ضمن الأكثر طلبًا؛ وإنتاج شروح عربية الأصل يسد فجوة المحتوى العربي التي يلمّح إليها تقرير Coursera 2025 (تدفق المتعلمين السعوديين على مساقات الذكاء الاصطناعي الإنجليزية).',
    sources: ['WEF FoJ 2025', 'Coursera GSR 2025', 'learning-by-teaching research'],
  },
]
