import type { Claim, ClaimSource } from './types'

/**
 * Claims behind «مهارات 2030» (future skills) and the WEF headline figures (packet P5b).
 * Ids are stable (kebab-case, prefixed 'future-'). Figures already registered by another
 * packet are reused, not duplicated: 39% change in existing skill sets (`standards-wef-core-skills`),
 * 86% / 63% WEF employer expectations (`leaders-wef-2025-ai-transform`,
 * `leaders-wef-2025-skill-gaps`) and the ILO 2025 exposure findings (`leaders-ilo-2025-*`).
 *
 * Registration note (2026-10-22): web-verified on 2026-10-22 (reviews/claims-verification-20261022.md).
 * WEF figures are held at medium confidence; platform figures Coursera publishes about its own
 * learners are tagged `self-report`, at medium once matched to the source text and low otherwise.
 */

const REVIEWED = '2026-10-22'

const WEF_2025: ClaimSource = {
  title: { ar: 'تقرير مستقبل الوظائف 2025', en: 'The Future of Jobs Report 2025' },
  publisher: { ar: 'المنتدى الاقتصادي العالمي', en: 'World Economic Forum' },
  url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
  year: 2025,
}

const COURSERA_2025: ClaimSource = {
  title: { ar: 'تقرير المهارات العالمي 2025', en: 'Global Skills Report 2025' },
  publisher: { ar: 'كورسيرا', en: 'Coursera' },
  url: 'https://www.coursera.org/skills-reports/global',
  year: 2025,
}

const COURSERA_2026: ClaimSource = {
  title: { ar: 'تقرير المهارات العالمي 2026', en: 'Global Skills Report 2026' },
  publisher: { ar: 'كورسيرا', en: 'Coursera' },
  url: 'https://blog.coursera.org/global-skills-report-2026/',
  locator: 'Coursera blog, 28 September 2026',
  year: 2026,
}

const ISC2: ClaimSource = {
  title: { ar: 'دراسة القوى العاملة في الأمن السيبراني 2024', en: '2024 ISC2 Cybersecurity Workforce Study' },
  publisher: { ar: 'منظمة ISC2', en: 'ISC2' },
  url: 'https://www.isc2.org/Insights/2024/09/Employers-Must-Act-Cybersecurity-Workforce-Growth-Stalls-as-Skills-Gaps-Widen',
  locator: 'First-look release, 11 September 2024',
  year: 2024,
}

const VISION_ENERGY: ClaimSource = {
  title: { ar: 'البرنامج الوطني للطاقة المتجددة: قاعدة سياسات الطاقة', en: 'Saudi National Renewable Energy Program (NREP): policy database entry' },
  publisher: { ar: 'الوكالة الدولية للطاقة', en: 'International Energy Agency (IEA)' },
  url: 'https://www.iea.org/policies/14658',
}

const EDITORIAL: ClaimSource = {
  title: { ar: 'رادار المهارات الرقمية: طبقة مهارات 2030', en: 'Digital Skills Radar: the 2030 skills layer' },
  publisher: { ar: 'مؤلف الأداة (مفهوم مستقل)', en: 'The tool’s author (independent concept)' },
  year: 2026,
}

/* Sources added by the content-evidence audit (reviews/content-evidence-audit-20261022.md). */

const PDPL: ClaimSource = {
  title: { ar: 'نظام حماية البيانات الشخصية ولائحته التنفيذية', en: 'Personal Data Protection Law and its Implementing Regulations' },
  publisher: {
    ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (مكتب إدارة البيانات الوطنية)',
    en: 'Saudi Data & AI Authority (SDAIA) / National Data Management Office (NDMO)',
  },
  url: 'https://dgp.sdaia.gov.sa/wps/portal/pdp/home',
  locator: 'Read through Latham & Watkins, “Saudi Arabia’s data protection law enters into force” (December 2023)',
  year: 2023,
}

const OECD_GOV_AI_2025: ClaimSource = {
  title: {
    ar: 'الحوكمة بالذكاء الاصطناعي: الواقع الراهن والطريق إلى الأمام في وظائف الحكومة الأساسية',
    en: 'Governing with Artificial Intelligence: The State of Play and Way Forward in Core Government Functions',
  },
  publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
  url: 'https://www.oecd.org/en/publications/governing-with-artificial-intelligence_795de142-en.html',
  year: 2025,
}

const GARTNER_AGENTIC_2025: ClaimSource = {
  title: {
    ar: 'غارتنر تتوقع إلغاء أكثر من 40% من مشاريع الذكاء الاصطناعي الوكيل بنهاية 2027',
    en: 'Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027',
  },
  publisher: { ar: 'غارتنر (بيت خبرة)', en: 'Gartner' },
  url: 'https://www.gartner.com/en/newsroom',
  locator: 'Press release, June 2025',
  year: 2025,
}

const GLOBAL_EMPLOYERS = {
  ar: 'أصحاب عمل شملهم مسح التقرير حول العالم',
  en: 'Employers surveyed worldwide for the report',
}

const NOT_SAUDI_GOV = {
  ar: 'توقعات أصحاب عمل على مستوى العالم، وليست قياسًا للقطاع الحكومي السعودي.',
  en: 'Global employer expectations, not a measurement of the Saudi public sector.',
}

const PLATFORM_DATA = {
  ar: 'رقم تنشره المنصة عن متعلميها؛ يصف من سجّلوا فيها لا سوق العمل، ولم يُطابق مع النص الأصلي في هذه المراجعة.',
  en: 'A figure the platform publishes about its own learners; it describes its enrollees, not the labour market, and was not matched to the source text in this review.',
}

const PLATFORM_DATA_MATCHED = {
  ar: 'رقم تنشره المنصة عن متعلميها؛ يصف من سجّلوا فيها لا سوق العمل. طوبق مع نص التقرير.',
  en: 'A figure the platform publishes about its own learners; it describes its enrollees, not the labour market. Matched to the report text.',
}

const wef = (id: string, text: Claim['text'], value: Claim['value'], extra: Partial<Claim> = {}): Claim => ({
  id,
  text,
  value,
  scope: GLOBAL_EMPLOYERS,
  period: '2025–2030',
  kind: 'international',
  confidence: 'medium',
  source: WEF_2025,
  reviewedOn: REVIEWED,
  caveat: NOT_SAUDI_GOV,
  ...extra,
})

export const futureClaims: Claim[] = [
  // ---- WEF headline figures (home page and «مهارات 2030»)
  wef(
    'future-wef-2025-jobs-created',
    {
      ar: 'يتوقع تقرير مستقبل الوظائف 2025 استحداث 170 مليون وظيفة جديدة في العالم بين 2025 و2030.',
      en: 'The Future of Jobs Report 2025 expects 170 million new jobs to be created worldwide between 2025 and 2030.',
    },
    { ar: '170 مليون', en: '170 million' },
    { unit: { ar: 'وظيفة', en: 'jobs' }, scope: { ar: 'التوظيف العالمي (توقعات)', en: 'Global employment (projection)' } }
  ),
  wef(
    'future-wef-2025-jobs-displaced',
    {
      ar: 'ويتوقع التقرير نفسه أن تُستبدل 92 مليون وظيفة في الفترة نفسها.',
      en: 'The same report expects 92 million jobs to be displaced over the same period.',
    },
    { ar: '92 مليون', en: '92 million' },
    { unit: { ar: 'وظيفة', en: 'jobs' }, scope: { ar: 'التوظيف العالمي (توقعات)', en: 'Global employment (projection)' } }
  ),
  wef(
    'future-wef-2025-net-jobs',
    {
      ar: 'صافي التغير المتوقع زيادة بنحو 78 مليون وظيفة في العالم حتى 2030.',
      en: 'The expected net change is a gain of about 78 million jobs worldwide by 2030.',
    },
    { ar: '78 مليون', en: '78 million' },
    {
      unit: { ar: 'وظيفة صافية', en: 'net jobs' },
      scope: { ar: 'التوظيف العالمي (توقعات)', en: 'Global employment (projection)' },
      derivation: { ar: 'الفرق بين الوظائف المستحدثة (170 مليون) والمستبدلة (92 مليون) كما يعرضه التقرير.', en: 'The difference between jobs created (170 million) and displaced (92 million), as presented in the report.' },
    }
  ),

  // ---- WEF skills and trends
  wef(
    'future-wef-2025-ai-bigdata-top',
    {
      ar: 'تأتي مهارات الذكاء الاصطناعي والبيانات الضخمة في المرتبة 1 بين أسرع المهارات نموًا حتى 2030.',
      en: 'AI and big data rank #1 among the fastest-growing skills to 2030.',
    },
    { ar: 'المرتبة 1', en: '#1' }
  ),
  wef(
    'future-wef-2025-cyber-second',
    {
      ar: 'تأتي مهارات الشبكات والأمن السيبراني في المرتبة 2 بين أسرع المهارات نموًا حتى 2030.',
      en: 'Networks and cybersecurity rank #2 among the fastest-growing skills to 2030.',
    },
    { ar: 'المرتبة 2', en: '#2' }
  ),
  wef(
    'future-wef-2025-creative-thinking',
    {
      ar: 'التفكير الإبداعي ضمن أعلى 5 مهارات صعودًا في توقعات أصحاب العمل حتى 2030.',
      en: 'Creative thinking is among the top 5 rising skills in employers’ expectations to 2030.',
    },
    { ar: 'ضمن أعلى 5', en: 'top 5' }
  ),
  wef(
    'future-wef-2025-environmental',
    {
      ar: 'دخلت الإدارة البيئية لأول مرة قائمة أعلى 10 مهارات نموًا في التقرير.',
      en: 'Environmental stewardship entered the report’s top 10 fastest-growing skills for the first time.',
    },
    { ar: 'ضمن أعلى 10', en: 'top 10' }
  ),
  wef(
    'future-wef-2025-analytical',
    {
      ar: 'يرى نحو 7 من كل 10 أصحاب عمل أن التفكير التحليلي مهارة أساسية، وهو أول المهارات الأساسية في التقرير.',
      en: 'About 7 in 10 employers see analytical thinking as a core skill, the first of the report’s core skills.',
    },
    { ar: '7 من كل 10', en: '7 in 10' }
  ),
  wef(
    'future-wef-2025-digital-access',
    {
      ar: 'يرى 60% من أصحاب العمل أن توسيع الوصول الرقمي أكثر الاتجاهات تحويلًا لأعمالهم حتى 2030.',
      en: '60% of employers see broadening digital access as the most transformative trend for their business to 2030.',
    },
    { ar: '60%', en: '60%' }
  ),
  wef(
    'future-wef-2025-robotics',
    {
      ar: 'يتوقع 58% من أصحاب العمل أن تحوّل الروبوتات والأنظمة الذاتية أعمالهم حتى 2030.',
      en: '58% of employers expect robots and autonomous systems to transform their business to 2030.',
    },
    { ar: '58%', en: '58%' }
  ),
  wef(
    'future-wef-2025-reskill',
    {
      ar: 'يخطط 77% من أصحاب العمل لإعادة تأهيل موظفيهم ورفع مهاراتهم للعمل مع الذكاء الاصطناعي.',
      en: '77% of employers plan to reskill and upskill their workforce to work alongside AI.',
    },
    { ar: '77%', en: '77%' }
  ),
  wef(
    'future-wef-2025-reduce-staff',
    {
      ar: 'يتوقع 40% من أصحاب العمل تقليص الوظائف حيث يمكن للذكاء الاصطناعي أتمتة المهام.',
      en: '40% of employers expect to reduce staff where AI can automate tasks.',
    },
    { ar: '40%', en: '40%' }
  ),

  // ---- WEF declining roles (global ranking)
  wef(
    'future-wef-2025-decline-data-entry',
    {
      ar: 'يأتي موظفو إدخال البيانات في المرتبة 3 بين أسرع الوظائف تراجعًا في العالم حتى 2030.',
      en: 'Data-entry clerks rank #3 among the fastest-declining jobs worldwide to 2030.',
    },
    { ar: 'المرتبة 3', en: '#3' }
  ),
  wef(
    'future-wef-2025-decline-bookkeeping',
    {
      ar: 'يأتي موظفو المحاسبة ومسك الدفاتر والرواتب ضمن أسرع 10 وظائف تراجعًا في العالم حتى 2030.',
      en: 'Accounting, bookkeeping and payroll clerks are among the 10 fastest-declining jobs worldwide to 2030.',
    },
    { ar: 'ضمن أعلى 10', en: 'top 10' }
  ),
  wef(
    'future-wef-2025-decline-graphic',
    {
      ar: 'يقع مصممو الجرافيك خارج قائمة أسرع 10 وظائف تراجعًا مباشرة، وهي أول مرة يتوقع فيها التقرير تراجعهم.',
      en: 'Graphic designers sit just outside the 10 fastest-declining jobs, the first time the report has predicted their decline.',
    },
    { ar: 'خارج أعلى 10 مباشرة', en: 'just outside the top 10' }
  ),
  wef(
    'future-wef-2025-decline-admin',
    {
      ar: 'المساعدون الإداريون والسكرتارية التنفيذية ضمن أكبر الفئات تراجعًا بالأعداد المطلقة.',
      en: 'Administrative assistants and executive secretaries are among the largest declines in absolute numbers.',
    },
    { ar: 'ضمن الأكبر تراجعًا', en: 'among the largest declines' }
  ),

  // ---- platform and survey signals (low confidence by design)
  {
    id: 'future-coursera-2025-ksa-genai',
    text: {
      ar: 'نما تسجيل المتعلمين في المملكة في مقررات الذكاء الاصطناعي التوليدي على منصة كورسيرا بنحو +165% خلال عام.',
      en: 'Learner enrollments from Saudi Arabia in generative-AI courses on Coursera grew by about +165% in a year.',
    },
    value: { ar: '+165%', en: '+165%' },
    scope: { ar: 'متعلمو كورسيرا في المملكة', en: 'Coursera learners in Saudi Arabia' },
    period: '2024–2025',
    kind: 'self-report',
    confidence: 'medium',
    source: { ...COURSERA_2025, locator: 'p. 54, Saudi Arabia profile' },
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA_MATCHED,
  },
  {
    id: 'future-coursera-2025-ksa-cyber',
    text: {
      ar: 'نما تسجيل المتعلمين في المملكة في مقررات الأمن السيبراني على منصة كورسيرا بنحو +61% خلال عام.',
      en: 'Learner enrollments from Saudi Arabia in cybersecurity courses on Coursera grew by about +61% in a year.',
    },
    value: { ar: '+61%', en: '+61%' },
    scope: { ar: 'متعلمو كورسيرا في المملكة', en: 'Coursera learners in Saudi Arabia' },
    period: '2024–2025',
    kind: 'self-report',
    confidence: 'medium',
    source: { ...COURSERA_2025, locator: 'p. 54, Saudi Arabia profile' },
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA_MATCHED,
  },
  {
    id: 'future-coursera-2026-genai-rate',
    text: {
      ar: 'تقول كورسيرا إن التسجيل في محتوى الذكاء الاصطناعي التوليدي بلغ أكثر من 45 تسجيلًا في الدقيقة على منصتي كورسيرا ويوديمي مجتمعتين، ارتفاعًا من 25 في 2025.',
      en: 'Coursera reports more than 45 generative-AI enrollments per minute across Coursera and Udemy combined, up from 25 per minute in 2025.',
    },
    value: { ar: 'أكثر من 45 تسجيلًا في الدقيقة', en: 'more than 45 enrollments per minute' },
    scope: { ar: 'متعلمو كورسيرا ويوديمي حول العالم (مجتمعتين)', en: 'Coursera and Udemy learners worldwide (combined)' },
    period: '2026',
    kind: 'self-report',
    confidence: 'medium',
    source: COURSERA_2026,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA_MATCHED,
  },
  {
    id: 'future-coursera-2026-critical-thinking',
    text: {
      ar: 'نما التسجيل في مقررات التفكير النقدي على منصة كورسيرا بنحو +107% خلال عام.',
      en: 'Enrollments in critical-thinking courses on Coursera grew by about +107% in a year.',
    },
    value: { ar: '+107%', en: '+107%' },
    scope: { ar: 'متعلمو المنصة حول العالم (التقرير يجمع بيانات كورسيرا ويوديمي)', en: 'Platform learners worldwide (the report pools Coursera and Udemy data)' },
    period: '2025–2026',
    kind: 'self-report',
    confidence: 'medium',
    source: COURSERA_2026,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA_MATCHED,
  },
  {
    id: 'future-coursera-2026-agentic',
    text: {
      ar: 'تقول كورسيرا إن اهتمام المتعلمين بوكلاء الذكاء الاصطناعي وتنسيقها وأمنها يكشف طلبًا متناميًا.',
      en: 'Coursera says learner interest in AI agents, their orchestration and security reveals growing demand.',
    },
    value: { ar: 'طلبًا متناميًا', en: 'growing demand' },
    scope: { ar: 'متعلمو كورسيرا حول العالم', en: 'Coursera learners worldwide' },
    period: '2026',
    kind: 'self-report',
    confidence: 'low',
    source: COURSERA_2026,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA,
  },
  {
    id: 'future-isc2-cyber-gap',
    text: {
      ar: 'قدّرت دراسة ISC2 لعام 2024 فجوة القوى العاملة في الأمن السيبراني عالميًا بنحو 4.8 مليون شخص.',
      en: 'The 2024 ISC2 study put the global cybersecurity workforce gap at about 4.8 million people.',
    },
    value: { ar: '4.8 مليون', en: '4.8 million' },
    scope: { ar: 'القوى العاملة السيبرانية حول العالم', en: 'Global cybersecurity workforce' },
    period: '2024',
    kind: 'survey',
    confidence: 'medium',
    source: ISC2,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'فجوة مقدّرة من مسح ISC2، لا عدد وظائف شاغرة. ركّز إصدار 2025 على فجوات المهارات بدل عدد الأفراد، ولم ينشر رقمًا مماثلًا وفق التغطية المنشورة.',
      en: 'An estimated gap from the ISC2 survey, not a count of vacancies. The 2025 edition focused on skills gaps rather than headcount and, per published coverage, gave no comparable figure.',
    },
  },
  {
    id: 'future-ksa-renewables-target',
    text: {
      ar: 'تستهدف المملكة أن تأتي نحو 50% من الكهرباء من مصادر متجددة بحلول 2030.',
      en: 'Saudi Arabia targets about 50% of electricity from renewable sources by 2030.',
    },
    value: { ar: '50%', en: '50%' },
    scope: { ar: 'مزيج إنتاج الكهرباء في المملكة', en: 'Saudi electricity generation mix' },
    period: '2030',
    kind: 'official',
    confidence: 'medium',
    source: VISION_ENERGY,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'مستهدف معلن لا قياس متحقق؛ يُراجع الرابط المباشر للوثيقة الرسمية.',
      en: 'A declared target, not an achieved measurement; check the direct link to the official document.',
    },
  },

  // ---- editorial ratings on the page
  // ── Corrected facts from the content-evidence audit (2026-10-22) ─────
  {
    id: 'future-pdpl-in-force',
    text: {
      ar: 'نظام حماية البيانات الشخصية نافذ منذ 14 سبتمبر 2023، وانتهت مهلة الامتثال الممنوحة للجهات في 14 سبتمبر 2024.',
      en: 'The Personal Data Protection Law has been in force since 14 September 2023, and the compliance grace period for organisations ended on 14 September 2024.',
    },
    value: { ar: '14 سبتمبر 2023', en: '14 September 2023' },
    scope: { ar: 'الجهات التي تعالج بيانات شخصية في المملكة', en: 'Organisations processing personal data in Saudi Arabia' },
    period: '2023-09-14',
    kind: 'official',
    confidence: 'high',
    source: PDPL,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'قُرئ النص عبر تحليل قانوني منشور لأن موقع الهيئة يحجب القراءة الآلية. ومطابق للادعاء المسجل لانتهاء مهلة الامتثال في الموجز القيادي.',
      en: 'Read through a published legal analysis because the authority’s site blocks automated reading. Consistent with the registered claim on the end of the grace period in the leader brief.',
    },
  },
  {
    id: 'future-oecd-2025-ai-pilots',
    text: {
      ar: 'يصف تقرير منظمة التعاون الاقتصادي والتنمية لعام 2025 استخدام الذكاء الاصطناعي في وظائف الحكومة الأساسية بأنه ما زال محدودًا، وكثير من مبادراته ما زال تجريبيًا.',
      en: 'The OECD’s 2025 report describes the use of AI in core government functions as still limited, with many initiatives still at the pilot stage.',
    },
    value: { ar: 'أغلبه تجريبي', en: 'Mostly pilots' },
    scope: { ar: 'حكومات الدول الأعضاء والشريكة في المنظمة', en: 'OECD member and partner governments' },
    period: '2025',
    kind: 'international',
    confidence: 'medium',
    source: OECD_GOV_AI_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'وصف نوعي من التقرير بلا نسبة؛ يسند تلطيف عبارات «التشغيل الفعلي» في التحولات ومهارات 2030.',
      en: 'A qualitative finding with no percentage; it supports softening “actual operations” wording in the shifts and the 2030 skills.',
    },
  },
  {
    id: 'future-gartner-agentic-cancel',
    text: {
      ar: 'تتوقع غارتنر أن يُلغى أكثر من 40% من مشاريع الذكاء الاصطناعي الوكيل بنهاية 2027.',
      en: 'Gartner predicts that over 40% of agentic AI projects will be canceled by the end of 2027.',
    },
    value: { ar: 'أكثر من 40%', en: 'Over 40%' },
    scope: { ar: 'مشاريع الذكاء الاصطناعي الوكيل في المؤسسات حول العالم', en: 'Agentic AI projects in organisations worldwide' },
    period: '2025–2027',
    kind: 'expert',
    confidence: 'medium',
    source: GARTNER_AGENTIC_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'توقع تحليلي من بيت خبرة لا قياس، ولا يخص القطاع الحكومي وحده.',
      en: 'An analyst forecast from an advisory firm, not a measurement, and not specific to government.',
    },
  },
  {
    id: 'future-wef-2025-leadership',
    text: {
      ar: 'يضع تقرير مستقبل الوظائف 2025 «القيادة والتأثير الاجتماعي» ضمن أسرع المهارات نموًا حتى 2030.',
      en: 'The Future of Jobs Report 2025 lists “leadership and social influence” among the fastest-growing skills to 2030.',
    },
    value: { ar: 'ضمن الأسرع نموًا', en: 'Among the fastest-growing' },
    scope: GLOBAL_EMPLOYERS,
    period: '2025–2030',
    kind: 'international',
    confidence: 'medium',
    source: { ...WEF_2025, locator: 'Figure 3.4, fastest-growing skills' },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'لم يُطابق ترتيب المهارة في الشكل مع النص الأصلي آليًا في هذه المراجعة؛ يُتحقق منه قبل ذكر رتبة رقمية.',
      en: 'The skill’s position in the figure was not machine-matched to the original in this review; check it before citing a rank.',
    },
  },
  {
    id: 'future-editorial-trajectory',
    text: {
      ar: 'تصنيف كل مجال (ينمو بقوة، ينمو، مستقر، يتراجع) حكم تحريري يجمع الإشارات المذكورة معه.',
      en: 'Each domain’s rating (growing strongly, growing, stable, declining) is an editorial judgment that combines the signals listed with it.',
    },
    value: { ar: 'تقدير تحريري', en: 'Editorial rating' },
    period: '2026–2030',
    kind: 'editorial',
    confidence: 'low',
    source: EDITORIAL,
    reviewedOn: REVIEWED,
    derivation: {
      ar: 'قراءة مكتبية لإشارات دولية ووطنية مسماة لكل مجال، تُراجع كل ستة أشهر.',
      en: 'A desk reading of named international and national signals for each domain, reviewed every six months.',
    },
    caveat: {
      ar: 'إشارة استرشادية لا توقع رسمي ولا ضمان؛ نقل الاتجاهات العالمية إلى العمل الحكومي في المملكة استنتاج تحريري.',
      en: 'An indicative signal, not an official forecast or a guarantee; transferring global trends to Saudi government work is an editorial inference.',
    },
  },
]
