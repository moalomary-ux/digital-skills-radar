import type { Claim, ClaimSource } from './types'

/**
 * Claims behind the Standards page (packet P5a). Ids are stable, kebab-case, prefixed 'standards-'.
 * Desk review 2026-10-22 without network access: figures the reviewer is sure of are 'high';
 * figures carried over or not yet matched to the source text are 'medium'/'low' with a caveat.
 */

const REVIEWED = '2026-10-22'

const ourMethod: ClaimSource = {
  title: { ar: 'رادار المهارات الرقمية: المنهجية وبنك المحتوى، الإصدار 9', en: 'Digital Skills Radar: method and content bank, v9' },
  publisher: { ar: 'مؤلف الأداة (مفهوم مستقل)', en: 'The tool’s author (independent concept)' },
  year: 2026,
}

const sfia9: ClaimSource = {
  title: { ar: 'SFIA 9: ملاحظات الإصدار', en: 'SFIA 9 release notes' },
  publisher: { ar: 'مؤسسة SFIA', en: 'SFIA Foundation' },
  url: 'https://sfia-online.org/en/sfia-9/sfia-9-release-notes',
  year: 2024,
}

const digcomp22: ClaimSource = {
  title: { ar: 'DigComp 2.2: الإطار الأوروبي للكفاءة الرقمية للمواطنين', en: 'DigComp 2.2: The Digital Competence Framework for Citizens' },
  publisher: { ar: 'المفوضية الأوروبية، مركز البحوث المشترك (JRC)', en: 'European Commission, Joint Research Centre (JRC)' },
  url: 'https://publications.jrc.ec.europa.eu/repository/handle/JRC128415',
  year: 2022,
}

const digcomp30: ClaimSource = {
  title: { ar: 'DigComp 3.0: الإطار الأوروبي للكفاءة الرقمية (تحديث 2025)', en: 'DigComp 3.0: European Digital Competence Framework (2025 update)' },
  publisher: { ar: 'المفوضية الأوروبية، مركز البحوث المشترك (JRC)', en: 'European Commission, Joint Research Centre (JRC)' },
  year: 2025,
}

const dlgf: ClaimSource = {
  title: {
    ar: 'الإطار المرجعي العالمي لمهارات الإلمام الرقمي للمؤشر 4.4.2',
    en: 'A Global Framework of Reference on Digital Literacy Skills for Indicator 4.4.2',
  },
  publisher: { ar: 'معهد اليونسكو للإحصاء', en: 'UNESCO Institute for Statistics (UIS)' },
  url: 'https://uis.unesco.org/sites/default/files/documents/ip51-global-framework-reference-digital-literacy-skills-2018-en.pdf',
  locator: 'Information Paper No. 51',
  year: 2018,
}

const esco: ClaimSource = {
  title: {
    ar: 'تصنيف ESCO للمهارات والكفاءات والمؤهلات والمهن، الإصدار 1.2',
    en: 'ESCO classification of Skills, Competences, Qualifications and Occupations, v1.2',
  },
  publisher: { ar: 'المفوضية الأوروبية', en: 'European Commission' },
  url: 'https://esco.ec.europa.eu',
  year: 2024,
}

const ituSkills: ClaimSource = {
  title: { ar: 'حقيبة أدوات المهارات الرقمية', en: 'Digital Skills Toolkit' },
  publisher: { ar: 'الاتحاد الدولي للاتصالات', en: 'International Telecommunication Union (ITU)' },
  url: 'https://www.itu.int/en/ITU-D/Digital-Inclusion/Pages/Digital-Skills.aspx',
  year: 2018,
}

const ituGci: ClaimSource = {
  title: { ar: 'المؤشر العالمي للأمن السيبراني 2024', en: 'Global Cybersecurity Index 2024' },
  publisher: { ar: 'الاتحاد الدولي للاتصالات', en: 'International Telecommunication Union (ITU)' },
  url: 'https://www.itu.int/en/mediacentre/Pages/PR-2024-09-10-Global-Cybersecurity-Index.aspx',
  year: 2024,
}

const wefFoj: ClaimSource = {
  title: { ar: 'تقرير مستقبل الوظائف 2025', en: 'The Future of Jobs Report 2025' },
  publisher: { ar: 'المنتدى الاقتصادي العالمي', en: 'World Economic Forum' },
  url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
  year: 2025,
}

const ilo2025: ClaimSource = {
  title: {
    ar: 'الذكاء الاصطناعي التوليدي والوظائف: مؤشر عالمي محسّن للتعرض المهني',
    en: 'Generative AI and Jobs: A Refined Global Index of Occupational Exposure',
  },
  publisher: { ar: 'منظمة العمل الدولية', en: 'International Labour Organization (ILO)' },
  year: 2025,
}

const oecdDgi: ClaimSource = {
  title: { ar: 'مؤشر الحكومة الرقمية 2023: النتائج والاستنتاجات الرئيسة', en: '2023 OECD Digital Government Index: Results and key findings' },
  publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
  year: 2024,
}

const oecdOurdata: ClaimSource = {
  title: { ar: 'مؤشر OURdata للبيانات الحكومية المفتوحة 2023', en: '2023 OECD Open, Useful and Re-usable data (OURdata) Index' },
  publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
  year: 2023,
}

const unEgov: ClaimSource = {
  title: { ar: 'مسح الأمم المتحدة للحكومة الإلكترونية 2024', en: 'United Nations E-Government Survey 2024' },
  publisher: { ar: 'الأمم المتحدة، إدارة الشؤون الاقتصادية والاجتماعية', en: 'United Nations, Department of Economic and Social Affairs (UN DESA)' },
  url: 'https://desapublications.un.org/publications/un-e-government-survey-2024',
  year: 2024,
}

const gtmi: ClaimSource = {
  title: { ar: 'تحديث مؤشر نضج التقنية الحكومية (GTMI) لعام 2022', en: 'GovTech Maturity Index (GTMI) 2022 Update' },
  publisher: { ar: 'البنك الدولي', en: 'World Bank' },
  year: 2022,
}

const imd: ClaimSource = {
  title: { ar: 'ترتيب IMD للتنافسية الرقمية العالمية: المنهجية', en: 'IMD World Digital Competitiveness Ranking: methodology' },
  publisher: { ar: 'مركز التنافسية العالمي في IMD', en: 'IMD World Competitiveness Center' },
  url: 'https://www.imd.org/centers/wcc/world-competitiveness-center/rankings/world-digital-competitiveness-ranking/methodology',
}

const coursera: ClaimSource = {
  title: { ar: 'تقرير المهارات العالمي 2025', en: 'Global Skills Report 2025' },
  publisher: { ar: 'كورسيرا', en: 'Coursera' },
  url: 'https://www.coursera.org/skills-reports/global',
  year: 2025,
}

const linkedin: ClaimSource = {
  title: { ar: 'المهارات الصاعدة 2025', en: 'Skills on the Rise 2025' },
  publisher: { ar: 'لينكدإن', en: 'LinkedIn' },
  url: 'https://www.linkedin.com/business/talent/blog/skills-on-the-rise',
  year: 2025,
}

const qatarDsf: ClaimSource = {
  title: { ar: 'إطار المهارات الرقمية 2025', en: 'Digital Skills Framework 2025' },
  publisher: { ar: 'وزارة الاتصالات وتقنية المعلومات، قطر', en: 'Ministry of Communications and Information Technology, Qatar' },
  url: 'https://www.mcit.gov.qa',
  year: 2025,
}

const crosswalkCaveat = {
  ar: 'مواءمة تحريرية استرشادية لا تطابق مباشر: الأطر تصف أشياء مختلفة (المسؤولية والاستقلالية في SFIA، وكفاءة المواطن في DigComp)، ومستوياتنا تصف تطبيق مهارة عمل في دور حكومي.',
  en: 'An indicative editorial crosswalk, not a direct mapping: the frameworks describe different things (responsibility and autonomy in SFIA, citizen competence in DigComp), and our levels describe applying a work skill in a government role.',
}

const notMatched = {
  ar: 'لم يُطابق الرقم مع نص المصدر مباشرة في هذه المراجعة؛ يُتحقق منه قبل الاستشهاد به.',
  en: 'Not matched directly to the source text in this review; verify before quoting.',
}

/** Our four levels in the binding glossary order (value 1..4). */
const lv = [
  { ar: 'وعي', en: 'Awareness' },
  { ar: 'تطبيق', en: 'Application' },
  { ar: 'إتقان', en: 'Proficiency' },
  { ar: 'ريادة', en: 'Leadership' },
]
const sfiaBands = ['1–2', '3', '4–5', '6–7']
const digcompBands = ['1–2', '3–4', '5–6', '7–8']
const digcompBandNames = [
  { ar: 'النطاق الأساسي', en: 'foundation band' },
  { ar: 'النطاق المتوسط', en: 'intermediate band' },
  { ar: 'النطاق المتقدم', en: 'advanced band' },
  { ar: 'نطاق التخصص العالي', en: 'highly specialised band' },
]

const crosswalkClaims: Claim[] = lv.flatMap((name, i): Claim[] => [
  {
    id: `standards-xwalk-sfia-${i + 1}`,
    text: {
      ar: `نقابل مستوى «${name.ar}» تحريريًا بمستويات المسؤولية ${sfiaBands[i]} في SFIA 9.`,
      en: `We editorially align the “${name.en}” level with SFIA 9 responsibility levels ${sfiaBands[i]}.`,
    },
    value: { ar: `SFIA ${sfiaBands[i]}`, en: `SFIA ${sfiaBands[i]}` },
    scope: { ar: 'مستويات الرادار الأربعة مقابل SFIA 9', en: 'The radar’s four levels against SFIA 9' },
    kind: 'editorial',
    confidence: 'medium',
    source: ourMethod,
    derivation: {
      ar: 'مقارنة أوصاف المستوى (الاستقلالية والتأثير وتعقيد العمل) بأوصاف مستويات المسؤولية في SFIA 9.',
      en: 'Comparison of each level description (autonomy, influence and work complexity) with the SFIA 9 responsibility descriptions.',
    },
    reviewedOn: REVIEWED,
    caveat: crosswalkCaveat,
  },
  {
    id: `standards-xwalk-digcomp-${i + 1}`,
    text: {
      ar: `نقابل مستوى «${name.ar}» تحريريًا بـ${digcompBandNames[i].ar} في DigComp (المستويات ${digcompBands[i]}).`,
      en: `We editorially align the “${name.en}” level with the DigComp ${digcompBandNames[i].en} (levels ${digcompBands[i]}).`,
    },
    value: { ar: `DigComp ${digcompBands[i]}`, en: `DigComp ${digcompBands[i]}` },
    scope: { ar: 'مستويات الرادار الأربعة مقابل نطاقات DigComp', en: 'The radar’s four levels against DigComp bands' },
    kind: 'editorial',
    confidence: 'medium',
    source: ourMethod,
    derivation: {
      ar: 'تشابه في الشكل: أربعة مستويات عندنا وأربعة نطاقات في DigComp، لكل نطاق مستويان.',
      en: 'A similarity of shape: four levels here and four DigComp bands, each band holding two levels.',
    },
    reviewedOn: REVIEWED,
    caveat: crosswalkCaveat,
  },
])

export const standardsClaims: Claim[] = [
  // ---- SFIA 9
  {
    id: 'standards-sfia9-skills',
    text: { ar: 'يضم إطار SFIA 9 الصادر في أكتوبر 2024 ما مجموعه 147 مهارة.', en: 'SFIA 9, released in October 2024, contains 147 skills.' },
    value: { ar: '147 مهارة', en: '147 skills' },
    scope: { ar: 'الإطار العالمي لمهارات العمل الرقمي، الإصدار 9', en: 'Global framework of digital-work skills, version 9' },
    period: '2024-10',
    kind: 'international',
    confidence: 'high',
    source: sfia9,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'العدد يخص الإصدار 9؛ كان الإصدار 8 يضم 121 مهارة، والإطار يُراجع دوريًا.',
      en: 'The count is for version 9; version 8 had 121 skills, and the framework is revised periodically.',
    },
  },
  {
    id: 'standards-sfia9-levels',
    text: {
      ar: 'يصف SFIA 9 المسؤولية في العمل على 7 مستويات، من العمل بإرشاد إلى وضع الاستراتيجية.',
      en: 'SFIA 9 describes responsibility at work on 7 levels, from working under guidance to setting strategy.',
    },
    value: { ar: '7 مستويات', en: '7 levels' },
    scope: { ar: 'مستويات المسؤولية في SFIA 9', en: 'SFIA 9 levels of responsibility' },
    kind: 'international',
    confidence: 'high',
    source: sfia9,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'مستويات SFIA تصف المسؤولية والاستقلالية، لا إتقان مهارة واحدة.',
      en: 'SFIA levels describe responsibility and autonomy, not mastery of a single skill.',
    },
  },
  // ---- DigComp
  {
    id: 'standards-digcomp-areas',
    text: { ar: 'ينظم إطار DigComp كفاءاته في 5 مجالات.', en: 'DigComp organizes its competences into 5 areas.' },
    value: { ar: '5 مجالات', en: '5 areas' },
    kind: 'international',
    confidence: 'high',
    source: digcomp22,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-digcomp-competences',
    text: { ar: 'تتوزع على مجالات DigComp الخمسة 21 كفاءة.', en: 'DigComp’s five areas hold 21 competences.' },
    value: { ar: '21 كفاءة', en: '21 competences' },
    kind: 'international',
    confidence: 'high',
    source: digcomp22,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-digcomp22-levels',
    text: { ar: 'يحدد إطار DigComp 2.2 لكل كفاءة 8 مستويات إتقان.', en: 'DigComp 2.2 defines 8 proficiency levels for each competence.' },
    value: { ar: '8 مستويات', en: '8 levels' },
    kind: 'international',
    confidence: 'high',
    source: digcomp22,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-digcomp-bands',
    text: {
      ar: 'تتجمع مستويات DigComp الثمانية في 4 نطاقات: أساسي، ومتوسط، ومتقدم، وعالي التخصص.',
      en: 'DigComp’s eight levels group into 4 bands: foundation, intermediate, advanced and highly specialised.',
    },
    value: { ar: '4 نطاقات', en: '4 bands' },
    kind: 'international',
    confidence: 'high',
    source: digcomp22,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-digcomp30-levels',
    text: {
      ar: 'يحافظ DigComp 3.0 على 8 مستويات إتقان مجمّعة في 4 نطاقات.',
      en: 'DigComp 3.0 keeps 8 proficiency levels grouped into 4 bands.',
    },
    value: { ar: '8 مستويات · 4 نطاقات', en: '8 levels · 4 bands' },
    period: '2025',
    kind: 'international',
    confidence: 'medium',
    source: digcomp30,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'لم تُطابق التفاصيل مع نص الإصدار 3.0 مباشرة؛ العنوان وصفي، ويُضاف الرابط بعد التحقق.',
      en: 'Details not yet matched directly to the 3.0 text; the title is descriptive and the link will be added after verification.',
    },
  },
  ...crosswalkClaims,
  // ---- UNESCO DLGF
  {
    id: 'standards-unesco-dlgf-areas',
    text: { ar: 'يضم إطار اليونسكو المرجعي للإلمام الرقمي 7 مجالات كفاءة.', en: 'UNESCO’s Digital Literacy Global Framework has 7 competence areas.' },
    value: { ar: '7 مجالات', en: '7 areas' },
    kind: 'international',
    confidence: 'high',
    source: dlgf,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-unesco-dlgf-competences',
    text: {
      ar: 'يضم إطار اليونسكو 26 كفاءة، بإضافة كفاءات لتشغيل الأجهزة والبرمجيات وكفاءات مرتبطة بالمهنة إلى كفاءات DigComp.',
      en: 'The UNESCO framework has 26 competences, adding device and software operation and career-related competences to DigComp’s.',
    },
    value: { ar: '26 كفاءة', en: '26 competences' },
    kind: 'international',
    confidence: 'medium',
    source: dlgf,
    reviewedOn: REVIEWED,
    caveat: notMatched,
  },
  {
    id: 'standards-unesco-dlgf-sdg',
    text: {
      ar: 'طُوّر الإطار مرجعًا لمؤشر أهداف التنمية المستدامة 4.4.2 عن نسبة الشباب والبالغين الذين بلغوا حدًّا أدنى من مهارات الإلمام الرقمي.',
      en: 'The framework was developed as the reference for SDG indicator 4.4.2 on the share of youth and adults with at least a minimum level of digital literacy skills.',
    },
    value: { ar: 'المؤشر 4.4.2', en: 'Indicator 4.4.2' },
    kind: 'international',
    confidence: 'high',
    source: dlgf,
    reviewedOn: REVIEWED,
  },
  // ---- ESCO
  {
    id: 'standards-esco-skills',
    text: {
      ar: 'يضم تصنيف ESCO الأوروبي في إصداره 1.2 نحو 13,939 مفهومًا للمهارات والمعارف.',
      en: 'The European ESCO classification, version 1.2, lists about 13,939 skill and knowledge concepts.',
    },
    value: { ar: '13,939', en: '13,939' },
    unit: { ar: 'مفهوم مهارة ومعرفة', en: 'skill and knowledge concepts' },
    kind: 'international',
    confidence: 'medium',
    source: esco,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'العدد يتغير بين الإصدارات، ولم يُطابق مع صفحة الإصدار مباشرة في هذه المراجعة.',
      en: 'The count changes between versions and was not matched directly to the release page in this review.',
    },
  },
  // ---- ITU
  {
    id: 'standards-itu-tiers',
    text: {
      ar: 'يصنف الاتحاد الدولي للاتصالات المهارات الرقمية في 3 مستويات: أساسية، ومتوسطة، ومتقدمة.',
      en: 'ITU groups digital skills into 3 tiers: basic, intermediate and advanced.',
    },
    value: { ar: '3 مستويات', en: '3 tiers' },
    kind: 'international',
    confidence: 'high',
    source: ituSkills,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-itu-gci-pillars',
    text: {
      ar: 'يقيس المؤشر العالمي للأمن السيبراني التزام الدول عبر 5 ركائز، منها تنمية القدرات.',
      en: 'The Global Cybersecurity Index measures countries’ commitment across 5 pillars, including capacity development.',
    },
    value: { ar: '5 ركائز', en: '5 pillars' },
    kind: 'international',
    confidence: 'high',
    source: ituGci,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-itu-gci-2024-countries',
    text: { ar: 'شمل إصدار 2024 من المؤشر العالمي للأمن السيبراني 194 دولة.', en: 'The 2024 Global Cybersecurity Index covered 194 countries.' },
    value: { ar: '194 دولة', en: '194 countries' },
    period: '2024',
    kind: 'international',
    confidence: 'medium',
    source: ituGci,
    reviewedOn: REVIEWED,
    caveat: notMatched,
  },
  // ---- WEF Future of Jobs 2025
  {
    id: 'standards-wef-core-skills',
    text: {
      ar: 'يتوقع أصحاب العمل أن تتغير 39% من المهارات الأساسية للعاملين بين 2025 و2030.',
      en: 'Employers expect 39% of workers’ core skills to change between 2025 and 2030.',
    },
    value: { ar: '39%', en: '39%' },
    scope: { ar: 'العاملون لدى أصحاب العمل المشاركين في الاستطلاع، عالميًا', en: 'Workers at the surveyed employers, worldwide' },
    period: '2025–2030',
    kind: 'survey',
    confidence: 'high',
    source: wefFoj,
    derivation: { ar: 'توقع أصحاب العمل في استطلاع التقرير، لا قياس فعلي للمهارات.', en: 'Employers’ expectation in the report’s survey, not a measurement of skills.' },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'تقدير عالمي من استطلاع أصحاب العمل؛ لا يخص القطاع الحكومي السعودي تحديدًا.',
      en: 'A global estimate from an employer survey; not specific to the Saudi government sector.',
    },
  },
  {
    id: 'standards-wef-survey-scope',
    text: {
      ar: 'استند التقرير إلى استطلاع أكثر من 1,000 صاحب عمل يمثلون أكثر من 14 مليون عامل في 22 قطاعًا صناعيًا و55 اقتصادًا.',
      en: 'The report draws on a survey of more than 1,000 employers representing over 14 million workers across 22 industry clusters and 55 economies.',
    },
    value: { ar: 'أكثر من 1,000', en: '1,000+' },
    unit: { ar: 'صاحب عمل', en: 'employers' },
    kind: 'survey',
    confidence: 'high',
    source: wefFoj,
    reviewedOn: REVIEWED,
  },
  // ---- ILO 2025
  {
    id: 'standards-ilo-2025-exposure',
    text: {
      ar: 'تقدّر منظمة العمل الدولية أن وظيفة من كل 4 وظائف في العالم تقع في مهن معرّضة بدرجة ما للذكاء الاصطناعي التوليدي.',
      en: 'The ILO estimates that 1 in 4 jobs worldwide is in an occupation with some exposure to generative AI.',
    },
    value: { ar: '1 من كل 4', en: '1 in 4' },
    scope: { ar: 'العمالة العالمية', en: 'Global employment' },
    period: '2025',
    kind: 'international',
    confidence: 'medium',
    source: ilo2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'التعرض لا يعني فقدان الوظيفة؛ يرجّح التقرير تحوّل المهام في أغلب المهن المعرضة. لم يُطابق الرقم مع نص التقرير مباشرة في هذه المراجعة.',
      en: 'Exposure is not job loss; the report expects most exposed occupations to be transformed rather than replaced. Not matched directly to the report text in this review.',
    },
  },
  // ---- OECD
  {
    id: 'standards-oecd-dgi-dimensions',
    text: {
      ar: 'يقيس مؤشر الحكومة الرقمية لمنظمة التعاون الاقتصادي والتنمية 6 أبعاد: الرقمية بالتصميم، والقطاع العام القائم على البيانات، والحكومة منصةً، والانفتاح افتراضيًا، والتمحور حول المستفيد، والاستباقية.',
      en: 'The OECD Digital Government Index measures 6 dimensions: digital by design, data-driven public sector, government as a platform, open by default, user-driven and proactiveness.',
    },
    value: { ar: '6 أبعاد', en: '6 dimensions' },
    kind: 'international',
    confidence: 'high',
    source: oecdDgi,
    reviewedOn: REVIEWED,
  },
  {
    id: 'standards-oecd-ourdata-pillars',
    text: {
      ar: 'يقيس مؤشر OURdata للبيانات الحكومية المفتوحة 3 ركائز: إتاحة البيانات، وسهولة الوصول إليها، ودعم الحكومة لإعادة استخدامها.',
      en: 'The OECD OURdata Index measures 3 pillars: data availability, data accessibility and government support for data re-use.',
    },
    value: { ar: '3 ركائز', en: '3 pillars' },
    kind: 'international',
    confidence: 'high',
    source: oecdOurdata,
    reviewedOn: REVIEWED,
  },
  // ---- UN E-Government Survey 2024
  {
    id: 'standards-un-egov-2024-members',
    text: { ar: 'يقيّم مسح الأمم المتحدة للحكومة الإلكترونية 2024 الدول الأعضاء الـ193 جميعها.', en: 'The UN E-Government Survey 2024 assesses all 193 UN member states.' },
    value: { ar: '193 دولة', en: '193 countries' },
    period: '2024',
    kind: 'international',
    confidence: 'high',
    source: unEgov,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'المسح يصدر كل سنتين؛ يُتحقق من صدور إصدار 2026 قبل الاستشهاد ويُحدَّث هذا الادعاء.',
      en: 'The survey is biennial; check whether the 2026 edition is out before quoting, and update this claim.',
    },
  },
  {
    id: 'standards-un-egov-2024-ksa',
    text: {
      ar: 'جاءت المملكة العربية السعودية في المرتبة 6 عالميًا في مؤشر تنمية الحكومة الإلكترونية لعام 2024.',
      en: 'Saudi Arabia ranked 6th worldwide in the 2024 E-Government Development Index (EGDI).',
    },
    value: { ar: 'المرتبة 6', en: '6th' },
    scope: { ar: 'مؤشر تنمية الحكومة الإلكترونية، الدول الأعضاء في الأمم المتحدة', en: 'E-Government Development Index, UN member states' },
    period: '2024',
    kind: 'international',
    confidence: 'medium',
    source: unEgov,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'منقول من التغطية المنشورة للمسح؛ يُطابق مع بيانات الأمم المتحدة قبل الاستشهاد، ويُحدَّث عند صدور إصدار 2026.',
      en: 'Taken from published coverage of the survey; match it to the UN data before quoting, and update it when the 2026 edition is out.',
    },
  },
  // ---- World Bank GTMI
  {
    id: 'standards-gtmi-components',
    text: {
      ar: 'يتكون مؤشر نضج التقنية الحكومية من 4 مكونات: الأنظمة الحكومية الأساسية، وتقديم الخدمات العامة، والمشاركة الرقمية للمواطن، وممكّنات التقنية الحكومية.',
      en: 'The GovTech Maturity Index has 4 components: core government systems, public service delivery, digital citizen engagement and GovTech enablers.',
    },
    value: { ar: '4 مكونات', en: '4 components' },
    kind: 'international',
    confidence: 'high',
    source: gtmi,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'يتضمن مكوّن الممكّنات مؤشرات عن برامج المهارات الرقمية في القطاع العام؛ المؤشر يقيس النضج ولا يقيس أثر التدريب على الإنتاجية.',
      en: 'The enablers component includes indicators on public-sector digital-skills programs; the index measures maturity, not the effect of training on productivity.',
    },
  },
  {
    id: 'standards-gtmi-2022-economies',
    text: { ar: 'غطى تحديث 2022 من مؤشر نضج التقنية الحكومية 198 اقتصادًا.', en: 'The 2022 GovTech Maturity Index update covered 198 economies.' },
    value: { ar: '198 اقتصادًا', en: '198 economies' },
    period: '2022',
    kind: 'international',
    confidence: 'medium',
    source: gtmi,
    reviewedOn: REVIEWED,
    caveat: notMatched,
  },
  // ---- IMD
  {
    id: 'standards-imd-factors',
    text: {
      ar: 'يقيس ترتيب IMD للتنافسية الرقمية العالمية 3 عوامل: المعرفة، والتقنية، والجاهزية للمستقبل.',
      en: 'The IMD World Digital Competitiveness Ranking measures 3 factors: knowledge, technology and future readiness.',
    },
    value: { ar: '3 عوامل', en: '3 factors' },
    kind: 'international',
    confidence: 'high',
    source: imd,
    reviewedOn: REVIEWED,
  },
  // ---- platform data (self-reported)
  {
    id: 'standards-coursera-genai-growth',
    text: {
      ar: 'أفادت كورسيرا بنمو التسجيل في مقررات الذكاء الاصطناعي التوليدي على منصتها بنسبة 195%.',
      en: 'Coursera reported 195% growth in generative-AI course enrollments on its platform.',
    },
    value: { ar: '+195%', en: '+195%' },
    scope: { ar: 'المسجلون في منصة كورسيرا', en: 'Learners on the Coursera platform' },
    kind: 'self-report',
    confidence: 'low',
    source: coursera,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'رقم منقول من نسخة سابقة من الأداة ولم يُطابق مع نص التقرير؛ وهو بيانات تسجيل في منصة تجارية لا طلب سوق العمل.',
      en: 'Carried over from an earlier version of the tool and not matched to the report text; it is enrollment data from a commercial platform, not labour-market demand.',
    },
  },
  {
    id: 'standards-linkedin-ai-literacy',
    text: {
      ar: 'وضعت لينكدإن «الإلمام بالذكاء الاصطناعي» في المرتبة 1 بين المهارات الصاعدة لعام 2025.',
      en: 'LinkedIn ranked “AI literacy” 1st among its Skills on the Rise for 2025.',
    },
    value: { ar: 'المرتبة 1', en: '#1' },
    scope: { ar: 'أعضاء لينكدإن والوظائف المعلنة فيها', en: 'LinkedIn members and job postings' },
    period: '2025',
    kind: 'self-report',
    confidence: 'medium',
    source: linkedin,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'مبني على بيانات منصة لينكدإن؛ لا يمثل سوق العمل السعودي ولا القطاع الحكومي.',
      en: 'Based on LinkedIn platform data; it does not represent the Saudi labour market or the government sector.',
    },
  },
  // ---- regional
  {
    id: 'standards-qatar-dsf',
    text: {
      ar: 'يضم إطار المهارات الرقمية في قطر 115 مهارة على 4 مستويات إتقان.',
      en: 'Qatar’s Digital Skills Framework lists 115 skills across 4 proficiency levels.',
    },
    value: { ar: '115 مهارة · 4 مستويات', en: '115 skills · 4 levels' },
    period: '2025',
    kind: 'official',
    confidence: 'low',
    source: qatarDsf,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'لم يُطابق مع الوثيقة المنشورة؛ الرابط للموقع الرئيس للوزارة لا للوثيقة نفسها.',
      en: 'Not matched to the published document; the link is the ministry’s home page, not the document itself.',
    },
  },
]
