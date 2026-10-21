import type { L } from './types'

/**
 * Standards page content (packet P5a). Every figure lives in the claims registry
 * (`src/data/claims/standards.ts`) and is referenced here by id; the cards carry no bare numbers.
 */

export interface SourceCard {
  id: string
  name: L
  publisher: L
  /** registered claims shown on the card, in order */
  claimIds: string[]
  description: L
  /** what the source does NOT establish for this tool */
  limits?: L
  url?: string
  /** true when the link is a home page rather than the document itself */
  homeLink?: boolean
}

export interface CrosswalkRow {
  /** the radar level value 1..4 (names come from `levels.ts`) */
  level: 1 | 2 | 3 | 4
  sfiaClaim: string
  digcompClaim: string
  digcompBand: L
}

export const crosswalk: CrosswalkRow[] = [
  { level: 1, sfiaClaim: 'standards-xwalk-sfia-1', digcompClaim: 'standards-xwalk-digcomp-1', digcompBand: { ar: 'أساسي', en: 'Foundation' } },
  { level: 2, sfiaClaim: 'standards-xwalk-sfia-2', digcompClaim: 'standards-xwalk-digcomp-2', digcompBand: { ar: 'متوسط', en: 'Intermediate' } },
  { level: 3, sfiaClaim: 'standards-xwalk-sfia-3', digcompClaim: 'standards-xwalk-digcomp-3', digcompBand: { ar: 'متقدم', en: 'Advanced' } },
  { level: 4, sfiaClaim: 'standards-xwalk-sfia-4', digcompClaim: 'standards-xwalk-digcomp-4', digcompBand: { ar: 'عالي التخصص', en: 'Highly specialised' } },
]

export const frameworkCards: SourceCard[] = [
  {
    id: 'sfia9',
    name: { ar: 'إطار SFIA 9', en: 'SFIA 9' },
    publisher: { ar: 'مؤسسة SFIA', en: 'SFIA Foundation' },
    claimIds: ['standards-sfia9-skills', 'standards-sfia9-levels'],
    description: {
      ar: 'المرجع العالمي الأوسع استخدامًا لوصف مهارات العمل الرقمي ومستويات المسؤولية فيه. نستخدمه مرجعًا لرموز الأدوار في مكتبة الأدوار، ونقابل مستوياتنا بمستوياته مواءمةً تحريرية استرشادية.',
      en: 'The most widely used global reference for digital-work skills and levels of responsibility. We use it as the reference for role codes in the role library, and align our levels with its levels as an indicative editorial crosswalk.',
    },
    url: 'https://sfia-online.org',
  },
  {
    id: 'digcomp',
    name: { ar: 'إطار DigComp الأوروبي', en: 'EU DigComp framework' },
    publisher: { ar: 'المفوضية الأوروبية، مركز البحوث المشترك', en: 'European Commission, Joint Research Centre' },
    claimIds: [
      'standards-digcomp-areas',
      'standards-digcomp-competences',
      'standards-digcomp22-levels',
      'standards-digcomp-bands',
      'standards-digcomp30-levels',
    ],
    description: {
      ar: 'الإطار الأوروبي المرجعي للكفاءة الرقمية للمواطنين. نطاقاته الأربعة تشبه مستوياتنا الأربعة في الشكل، لكن المقابلة بينهما مواءمة تحريرية استرشادية لا تطابق مباشر.',
      en: 'The European reference framework for citizens’ digital competence. Its four bands resemble our four levels in shape, but the correspondence is an indicative editorial crosswalk, not a direct mapping.',
    },
    limits: {
      ar: 'يصف كفاءة المواطن عمومًا، لا مهارات العمل في دور حكومي.',
      en: 'It describes citizens’ competence in general, not work skills in a government role.',
    },
    url: 'https://publications.jrc.ec.europa.eu/repository/handle/JRC128415',
  },
  {
    id: 'unesco-dlgf',
    name: { ar: 'إطار اليونسكو المرجعي العالمي للإلمام الرقمي', en: 'UNESCO Digital Literacy Global Framework' },
    publisher: { ar: 'معهد اليونسكو للإحصاء', en: 'UNESCO Institute for Statistics' },
    claimIds: ['standards-unesco-dlgf-areas', 'standards-unesco-dlgf-competences', 'standards-unesco-dlgf-sdg'],
    description: {
      ar: 'إطار مرجعي عالمي بُني على DigComp لقياس مهارات الإلمام الرقمي في الدول، ضمن مؤشرات أهداف التنمية المستدامة.',
      en: 'A global reference framework built on DigComp for measuring digital literacy across countries, within the Sustainable Development Goal indicators.',
    },
    url: 'https://uis.unesco.org/sites/default/files/documents/ip51-global-framework-reference-digital-literacy-skills-2018-en.pdf',
  },
  {
    id: 'esco',
    name: { ar: 'تصنيف ESCO الأوروبي للمهارات والمهن', en: 'ESCO: European Skills, Competences, Qualifications and Occupations' },
    publisher: { ar: 'المفوضية الأوروبية', en: 'European Commission' },
    claimIds: ['standards-esco-skills'],
    description: {
      ar: 'قاموس أوروبي مفتوح يربط المهارات بالمهن والمؤهلات بتسميات معيارية متعددة اللغات.',
      en: 'An open European dictionary that links skills to occupations and qualifications with standard multilingual labels.',
    },
    url: 'https://esco.ec.europa.eu',
    homeLink: true,
  },
  {
    id: 'itu-skills',
    name: { ar: 'مستويات الاتحاد الدولي للاتصالات للمهارات الرقمية', en: 'ITU digital skills tiers' },
    publisher: { ar: 'الاتحاد الدولي للاتصالات', en: 'International Telecommunication Union' },
    claimIds: ['standards-itu-tiers'],
    description: {
      ar: 'تصنيف تعتمده المؤشرات الدولية لوصف انتشار المهارات الرقمية بين السكان، من الاستخدام الأساسي إلى المهارات المتخصصة.',
      en: 'A classification used by international indicators to describe how widespread digital skills are in a population, from basic use to specialist skills.',
    },
    url: 'https://www.itu.int/en/ITU-D/Digital-Inclusion/Pages/Digital-Skills.aspx',
  },
  {
    id: 'sdaia',
    name: { ar: 'المعايير المهنية الوطنية للبيانات والذكاء الاصطناعي', en: 'National occupational standards for data and AI' },
    publisher: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data and AI Authority (SDAIA)' },
    claimIds: [],
    description: {
      ar: 'مرجع وطني للكفاءات المطلوبة في وظائف البيانات والذكاء الاصطناعي، نسترشد به في مجال «الذكاء الاصطناعي والبيانات».',
      en: 'A national reference for the competences required in data and AI jobs, which guides our “AI & Data” domain.',
    },
    url: 'https://sdaia.gov.sa',
    homeLink: true,
  },
  {
    id: 'qatar-dsf',
    name: { ar: 'إطار المهارات الرقمية في قطر', en: 'Qatar Digital Skills Framework' },
    publisher: { ar: 'وزارة الاتصالات وتقنية المعلومات، قطر', en: 'Ministry of Communications and IT, Qatar' },
    claimIds: ['standards-qatar-dsf'],
    description: {
      ar: 'إطار وطني حديث في المنطقة، نذكره للمقارنة الإقليمية فقط.',
      en: 'A recent national framework in the region, cited for regional comparison only.',
    },
    url: 'https://www.mcit.gov.qa',
    homeLink: true,
  },
]

export const reportCards: SourceCard[] = [
  {
    id: 'wef-foj',
    name: { ar: 'تقرير مستقبل الوظائف 2025', en: 'The Future of Jobs Report 2025' },
    publisher: { ar: 'المنتدى الاقتصادي العالمي', en: 'World Economic Forum' },
    claimIds: ['standards-wef-core-skills', 'standards-wef-survey-scope'],
    description: {
      ar: 'من أسرع المهارات نموًا في توقعات أصحاب العمل: الذكاء الاصطناعي والبيانات الضخمة، والشبكات والأمن السيبراني، والإلمام التقني.',
      en: 'Among the fastest-growing skills in employers’ expectations: AI and big data, networks and cybersecurity, and technological literacy.',
    },
    limits: {
      ar: 'استطلاع لأصحاب العمل عالميًا؛ لا يصف القطاع الحكومي السعودي تحديدًا.',
      en: 'A global employer survey; it does not describe the Saudi government sector specifically.',
    },
    url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
  },
  {
    id: 'ilo-2025',
    name: { ar: 'الذكاء الاصطناعي التوليدي والوظائف 2025', en: 'Generative AI and Jobs 2025' },
    publisher: { ar: 'منظمة العمل الدولية', en: 'International Labour Organization' },
    claimIds: ['standards-ilo-2025-exposure'],
    description: {
      ar: 'يرى التقرير أن التعرض للذكاء الاصطناعي التوليدي يعني في الغالب تحوّل المهام لا اختفاء الوظائف، وأن المهام المكتبية الأكثر تعرضًا.',
      en: 'The report finds that exposure to generative AI mostly means tasks are transformed rather than jobs disappearing, with clerical tasks the most exposed.',
    },
  },
  {
    id: 'oecd-dtf',
    name: { ar: 'إطار المواهب والمهارات الرقمية في القطاع العام', en: 'Framework for Digital Talent and Skills in the Public Sector' },
    publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية (2021)', en: 'OECD (2021)' },
    claimIds: [],
    description: {
      ar: 'يحدد المهارات الرقمية التي يحتاجها كل موظف عام، والمهارات المهنية للمختصين، ومهارات القيادة للتحول الرقمي، وهو أقرب المراجع الدولية لفئات الدور في الرادار.',
      en: 'It sets out the digital skills every public servant needs, the professional skills of specialists and the leadership skills for digital transformation; it is the international reference closest to the radar’s role categories.',
    },
    url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/04/the-oecd-framework-for-digital-talent-and-skills-in-the-public-sector_f6fb7838/4e7c3f58-en.pdf',
  },
  {
    id: 'un-egov',
    name: { ar: 'مسح الأمم المتحدة للحكومة الإلكترونية 2024', en: 'UN E-Government Survey 2024' },
    publisher: { ar: 'الأمم المتحدة، إدارة الشؤون الاقتصادية والاجتماعية', en: 'UN DESA' },
    claimIds: ['standards-un-egov-2024-members', 'standards-un-egov-2024-ksa'],
    description: {
      ar: 'يربط تقدم الحكومة الرقمية برأس المال البشري، ويبرز الاستثمار في المهارات الرقمية للموظفين والمواطنين.',
      en: 'It links digital-government progress to human capital and highlights investment in the digital skills of employees and citizens.',
    },
    limits: {
      ar: 'يقيس جاهزية الحكومة الإلكترونية للدولة، ولا يقيس مهارة الموظف مباشرة.',
      en: 'It measures a country’s e-government readiness, not employee skill directly.',
    },
    url: 'https://desapublications.un.org/publications/un-e-government-survey-2024',
  },
  {
    id: 'coursera-gsr',
    name: { ar: 'تقرير المهارات العالمي 2025', en: 'Global Skills Report 2025' },
    publisher: { ar: 'كورسيرا', en: 'Coursera' },
    claimIds: ['standards-coursera-genai-growth'],
    description: {
      ar: 'إشارة إلى اهتمام المتعلمين بالذكاء الاصطناعي التوليدي على منصة تعلم تجارية.',
      en: 'A signal of learners’ interest in generative AI on a commercial learning platform.',
    },
    limits: {
      ar: 'بيانات تسجيل في منصة، لا طلب سوق العمل.',
      en: 'Platform enrollment data, not labour-market demand.',
    },
    url: 'https://www.coursera.org/skills-reports/global',
  },
  {
    id: 'linkedin-rise',
    name: { ar: 'المهارات الصاعدة 2025', en: 'Skills on the Rise 2025' },
    publisher: { ar: 'لينكدإن', en: 'LinkedIn' },
    claimIds: ['standards-linkedin-ai-literacy'],
    description: {
      ar: 'إشارة إلى صعود الإلمام بالذكاء الاصطناعي بين المهارات المطلوبة في الوظائف المعلنة على المنصة.',
      en: 'A signal that AI literacy is rising among the skills sought in jobs posted on the platform.',
    },
    limits: {
      ar: 'بيانات منصة واحدة؛ لا تمثل القطاع الحكومي.',
      en: 'Data from one platform; it does not represent the government sector.',
    },
    url: 'https://www.linkedin.com/business/talent/blog/skills-on-the-rise',
  },
]

export const indexCards: SourceCard[] = [
  {
    id: 'gtmi',
    name: { ar: 'مؤشر نضج التقنية الحكومية (GTMI)', en: 'GovTech Maturity Index (GTMI)' },
    publisher: { ar: 'البنك الدولي', en: 'World Bank' },
    claimIds: ['standards-gtmi-components', 'standards-gtmi-2022-economies'],
    description: {
      ar: 'يتضمن مكوّن الممكّنات فيه مؤشرات عن برامج المهارات الرقمية في القطاع العام.',
      en: 'Its enablers component includes indicators on public-sector digital-skills programs.',
    },
    limits: {
      ar: 'يقيس نضج التقنية الحكومية، ولا يقيس أثر التدريب على الإنتاجية.',
      en: 'It measures GovTech maturity, not the effect of training on productivity.',
    },
    url: 'https://thedocs.worldbank.org/en/doc/18230a0f33e201615caa954f2d354891-0350052025/original/2025GTMI-Online-Survey-Guidance-Note-eng.pdf',
  },
  {
    id: 'oecd-dgi',
    name: { ar: 'مؤشر الحكومة الرقمية (DGI)', en: 'OECD Digital Government Index (DGI)' },
    publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
    claimIds: ['standards-oecd-dgi-dimensions'],
    description: {
      ar: 'أبعاده قريبة من مجالات الرادار: حكومة قائمة على البيانات، متمحورة حول المستفيد، ومنصة متكاملة واستباقية.',
      en: 'Its dimensions are close to the radar’s domains: a data-driven, user-driven, platform-based and proactive government.',
    },
    url: 'https://www.oecd.org/en/publications/digital-government-outlook_0496b2bc-en.html',
  },
  {
    id: 'oecd-ourdata',
    name: { ar: 'مؤشر البيانات الحكومية المفتوحة (OURdata)', en: 'OECD OURdata Index' },
    publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
    claimIds: ['standards-oecd-ourdata-pillars'],
    description: {
      ar: 'يتناول دعم الحكومة لإعادة استخدام البيانات، وهو سند لمجال «الذكاء الاصطناعي والبيانات».',
      en: 'It covers government support for data re-use, an anchor for the “AI & Data” domain.',
    },
    url: 'https://www.oecd.org/en/publications/digital-government-outlook_0496b2bc-en.html',
  },
  {
    id: 'un-egdi',
    name: { ar: 'مؤشر تنمية الحكومة الإلكترونية (EGDI)', en: 'UN E-Government Development Index (EGDI)' },
    publisher: { ar: 'الأمم المتحدة', en: 'United Nations' },
    claimIds: ['standards-un-egov-2024-ksa'],
    description: {
      ar: 'يدعم الصلة بجودة الخدمات الرقمية وإتاحتها ومشاركة المستفيدين.',
      en: 'It supports the link to the quality and accessibility of digital services and beneficiary participation.',
    },
    limits: {
      ar: 'لا يقيس مهارة الموظف مباشرة.',
      en: 'It does not measure employee skill directly.',
    },
    url: 'https://desapublications.un.org/publications/un-e-government-survey-2024',
  },
  {
    id: 'itu-gci',
    name: { ar: 'المؤشر العالمي للأمن السيبراني (GCI)', en: 'ITU Global Cybersecurity Index (GCI)' },
    publisher: { ar: 'الاتحاد الدولي للاتصالات', en: 'International Telecommunication Union' },
    claimIds: ['standards-itu-gci-pillars', 'standards-itu-gci-2024-countries'],
    description: {
      ar: 'ركيزة تنمية القدرات فيه سند لمجال «الأمن السيبراني والثقة الرقمية».',
      en: 'Its capacity-development pillar anchors the “Cybersecurity & Digital Trust” domain.',
    },
    url: 'https://www.itu.int/en/mediacentre/Pages/PR-2024-09-10-Global-Cybersecurity-Index.aspx',
  },
  {
    id: 'imd',
    name: { ar: 'ترتيب IMD للتنافسية الرقمية العالمية', en: 'IMD World Digital Competitiveness Ranking' },
    publisher: { ar: 'مركز التنافسية العالمي في IMD', en: 'IMD World Competitiveness Center' },
    claimIds: ['standards-imd-factors'],
    description: {
      ar: 'يضع المعرفة والتدريب والجاهزية للمستقبل في سياق التنافسية الوطنية.',
      en: 'It places knowledge, training and future readiness in the context of national competitiveness.',
    },
    url: 'https://www.imd.org/centers/wcc/world-competitiveness-center/rankings/world-digital-competitiveness-ranking/methodology',
  },
]
