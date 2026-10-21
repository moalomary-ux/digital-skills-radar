import type { Claim, ClaimSource } from './types'

/**
 * Claims behind «مهارات 2030» (future skills) and the WEF headline figures (packet P5b).
 * Ids are stable (kebab-case, prefixed 'future-'). Figures already registered by another
 * packet are reused, not duplicated: 39% core-skill change (`standards-wef-core-skills`),
 * 86% / 63% WEF employer expectations (`leaders-wef-2025-ai-transform`,
 * `leaders-wef-2025-skill-gaps`) and the ILO 2025 exposure findings (`leaders-ilo-2025-*`).
 *
 * Registration note (2026-10-22): written without network access. WEF figures were
 * spot-checked against the report by an earlier reviewer and are held at medium confidence;
 * platform figures published by Coursera or LinkedIn about their own users are tagged
 * `self-report` or `survey` and held at low confidence until matched to the source text.
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
  title: { ar: 'تقارير المهارات لدى كورسيرا 2026', en: 'Coursera skills reporting 2026' },
  publisher: { ar: 'كورسيرا', en: 'Coursera' },
  url: 'https://www.coursera.org/skills-reports/global',
  year: 2026,
}

const LINKEDIN_2025: ClaimSource = {
  title: { ar: 'المهارات الصاعدة 2025', en: 'Skills on the Rise 2025' },
  publisher: { ar: 'لينكدإن', en: 'LinkedIn' },
  url: 'https://www.linkedin.com/business/talent/blog/skills-on-the-rise',
  year: 2025,
}

const ISC2: ClaimSource = {
  title: { ar: 'دراسة القوى العاملة في الأمن السيبراني', en: 'Cybersecurity Workforce Study' },
  publisher: { ar: 'منظمة ISC2', en: 'ISC2' },
  url: 'https://www.isc2.org/research',
  year: 2024,
}

const VISION_ENERGY: ClaimSource = {
  title: { ar: 'مستهدفات مزيج الطاقة في رؤية المملكة 2030', en: 'Saudi Vision 2030 energy-mix targets' },
  publisher: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' },
  url: 'https://www.vision2030.gov.sa',
}

const EDITORIAL: ClaimSource = {
  title: { ar: 'رادار المهارات الرقمية: طبقة مهارات 2030', en: 'Digital Skills Radar: the 2030 skills layer' },
  publisher: { ar: 'مؤلف الأداة (مفهوم مستقل)', en: 'The tool’s author (independent concept)' },
  year: 2026,
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
      ar: 'يأتي موظفو المحاسبة ومسك الدفاتر والرواتب في المرتبة 7 بين أسرع الوظائف تراجعًا.',
      en: 'Accounting, bookkeeping and payroll clerks rank #7 among the fastest-declining jobs.',
    },
    { ar: 'المرتبة 7', en: '#7' }
  ),
  wef(
    'future-wef-2025-decline-graphic',
    {
      ar: 'يرد مصممو الجرافيك في المرتبة 11 من قائمة الوظائف المتراجعة.',
      en: 'Graphic designers appear at #11 on the declining-jobs list.',
    },
    { ar: 'المرتبة 11', en: '#11' }
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
    confidence: 'low',
    source: COURSERA_2025,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA,
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
    confidence: 'low',
    source: COURSERA_2025,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA,
  },
  {
    id: 'future-coursera-2026-genai-rate',
    text: {
      ar: 'تقول كورسيرا إن التسجيل في مقررات الذكاء الاصطناعي التوليدي بلغ نحو 45 تسجيلًا في الدقيقة على منصتها عالميًا.',
      en: 'Coursera reports about 45 generative-AI course enrollments per minute on its platform worldwide.',
    },
    value: { ar: '45 تسجيلًا في الدقيقة', en: '45 enrollments per minute' },
    scope: { ar: 'متعلمو كورسيرا حول العالم', en: 'Coursera learners worldwide' },
    period: '2026',
    kind: 'self-report',
    confidence: 'low',
    source: COURSERA_2026,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA,
  },
  {
    id: 'future-coursera-2026-critical-thinking',
    text: {
      ar: 'نما التسجيل في مقررات التفكير النقدي على منصة كورسيرا بنحو +107% خلال عام.',
      en: 'Enrollments in critical-thinking courses on Coursera grew by about +107% in a year.',
    },
    value: { ar: '+107%', en: '+107%' },
    scope: { ar: 'متعلمو كورسيرا حول العالم', en: 'Coursera learners worldwide' },
    period: '2025–2026',
    kind: 'self-report',
    confidence: 'low',
    source: COURSERA_2026,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA,
  },
  {
    id: 'future-coursera-2026-agentic',
    text: {
      ar: 'تضع كورسيرا مهارات وكلاء الذكاء الاصطناعي ضمن أسرع مهارات الذكاء الاصطناعي نموًا على منصتها.',
      en: 'Coursera places AI-agent skills among the fastest-growing AI skills on its platform.',
    },
    value: { ar: 'ضمن الأسرع نموًا', en: 'among the fastest-growing' },
    scope: { ar: 'متعلمو كورسيرا حول العالم', en: 'Coursera learners worldwide' },
    period: '2026',
    kind: 'self-report',
    confidence: 'low',
    source: COURSERA_2026,
    reviewedOn: REVIEWED,
    caveat: PLATFORM_DATA,
  },
  {
    id: 'future-linkedin-2025-product',
    text: {
      ar: 'ترصد لينكدإن صعود مهارات إدارة المنتجات المجاورة للعمل الرشيق بين أعضائها.',
      en: 'LinkedIn reports agile-adjacent product-management skills rising among its members.',
    },
    value: { ar: 'صاعدة', en: 'rising' },
    scope: { ar: 'أعضاء لينكدإن وإعلانات الوظائف فيها', en: 'LinkedIn members and job posts' },
    period: '2025',
    kind: 'survey',
    confidence: 'low',
    source: LINKEDIN_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'بيانات منصة توظيف خاصة بأعضائها؛ لا تمثل القطاع الحكومي السعودي، ولم تُطابق مع النص الأصلي.',
      en: 'Data from a private hiring platform about its own members; it does not represent the Saudi public sector and was not matched to the source text.',
    },
  },
  {
    id: 'future-isc2-cyber-gap',
    text: {
      ar: 'تقدّر دراسة ISC2 فجوة القوى العاملة في الأمن السيبراني عالميًا بالملايين.',
      en: 'The ISC2 study estimates the global cybersecurity workforce gap in the millions.',
    },
    value: { ar: 'بالملايين', en: 'millions' },
    scope: { ar: 'القوى العاملة السيبرانية حول العالم', en: 'Global cybersecurity workforce' },
    kind: 'survey',
    confidence: 'medium',
    source: ISC2,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'التقدير يتغير من إصدار إلى آخر؛ يُراجع الرقم الدقيق في أحدث إصدار قبل الاستشهاد به.',
      en: 'The estimate changes between editions; check the exact figure in the latest edition before quoting it.',
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
