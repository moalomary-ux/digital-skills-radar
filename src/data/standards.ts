import type { ReportCard, StandardCard } from './types'

export const frameworkCards: StandardCard[] = [
  {
    id: 'sfia9',
    name: { ar: 'إطار SFIA 9', en: 'SFIA 9' },
    facts: [
      { ar: 'أكثر من 121 مهارة', en: '121+ skills' },
      { ar: '7 مستويات مسؤولية', en: '7 levels of responsibility' },
      { ar: 'الإطار الوطني السعودي للمهارات الرقمية (وزارة الاتصالات) مبني عليه: 102 مهارة على 7 مستويات', en: 'Saudi MCIT’s national Digital Skills Framework is built on it: 102 skills across 7 levels' },
    ],
    description: {
      ar: 'المرجع العالمي الأوسع استخدامًا لوصف مهارات العمل الرقمي. مستوياتنا الأربعة تقابل مختصرًا سلوكيًا لمستوياته السبعة: وعي≈1-2، تطبيق≈3، ممارس≈4-5، خبير≈6-7.',
      en: 'The world’s most widely used reference for describing digital-work skills. Our four levels are a behavioral shorthand for its seven: Awareness≈1-2, Working≈3, Practitioner≈4-5, Expert≈6-7.',
    },
    url: 'https://sfia-online.org',
  },
  {
    id: 'digcomp',
    name: { ar: 'DigComp الأوروبي 2.2 / 3.0', en: 'EU DigComp 2.2 / 3.0' },
    facts: [
      { ar: '5 مجالات كفاءة', en: '5 competence areas' },
      { ar: '21 كفاءة', en: '21 competences' },
      { ar: '8 مستويات في 2.2، و4 نطاقات إتقان في 3.0', en: '8 proficiency levels in 2.2; 4 mastery bands in 3.0' },
    ],
    description: {
      ar: 'الإطار المرجعي الأوروبي للكفاءة الرقمية للمواطنين والموظفين. نطاقات الإتقان الأربعة في DigComp 3.0 تتوافق مباشرة مع مستويات الرادار الأربعة.',
      en: 'The EU reference framework for citizens’ and employees’ digital competence. DigComp 3.0’s four mastery bands map directly onto the radar’s four levels.',
    },
    url: 'https://joint-research-centre.ec.europa.eu/digcomp_en',
  },
  {
    id: 'unesco',
    name: { ar: 'إطار اليونسكو العالمي لمحو الأمية الرقمية', en: 'UNESCO Digital Literacy Global Framework' },
    facts: [
      { ar: '7 مجالات كفاءة', en: '7 competence areas' },
      { ar: '26 كفاءة', en: '26 competences' },
      { ar: 'أداة قياس مؤشر التنمية المستدامة 4.4.2', en: 'Measurement tool for SDG indicator 4.4.2' },
    ],
    description: {
      ar: 'إطار مرجعي عالمي بُني على DigComp لقياس المهارات الرقمية عبر الدول، وهو الأساس المنهجي لمؤشر الأمم المتحدة للمهارات الرقمية ضمن أهداف التنمية المستدامة.',
      en: 'A global reference framework built on DigComp for measuring digital skills across countries — the methodological basis of the UN digital-skills SDG indicator.',
    },
    url: 'https://uis.unesco.org/sites/default/files/documents/ip51-global-framework-reference-digital-literacy-skills-2018-en.pdf',
  },
  {
    id: 'esco',
    name: { ar: 'ESCO الأوروبي للمهارات والمهن', en: 'ESCO — European Skills & Occupations' },
    facts: [
      { ar: '13,939 مهارة مصنفة', en: '13,939 classified skills' },
      { ar: 'تسميات متاحة بالعربية', en: 'Arabic labels available' },
      { ar: 'يربط المهارات بالمهن', en: 'Links skills to occupations' },
    ],
    description: {
      ar: 'قاموس أوروبي مفتوح يربط المهارات بالمهن والمؤهلات، ويوفر تسميات معيارية متعددة اللغات — بما فيها العربية — تصلح لبناء مسارات مهنية وأدلة وظيفية.',
      en: 'An open European dictionary linking skills to occupations and qualifications, with standardized multilingual labels — including Arabic — suitable for career pathways and job profiles.',
    },
    url: 'https://esco.ec.europa.eu',
  },
  {
    id: 'itu',
    name: { ar: 'مستويات ITU للمهارات الرقمية', en: 'ITU Digital Skills Tiers' },
    facts: [
      { ar: 'أساسية / متوسطة / متقدمة', en: 'Basic / intermediate / advanced' },
      { ar: 'تستخدمها إحصاءات الاتصالات العالمية', en: 'Used by global ICT statistics' },
    ],
    description: {
      ar: 'تصنيف الاتحاد الدولي للاتصالات الذي تعتمده المؤشرات العالمية لقياس انتشار المهارات الرقمية بين السكان — من الاستخدام الأساسي إلى المهارات المتخصصة.',
      en: 'The ITU classification adopted by global indicators to measure population digital-skills prevalence — from basic use to specialist skills.',
    },
    url: 'https://www.itu.int/en/ITU-D/Digital-Inclusion/Pages/Digital-Skills.aspx',
  },
  {
    id: 'sdaia',
    name: { ar: 'المعايير المهنية الوطنية للبيانات والذكاء الاصطناعي', en: 'SDAIA National Occupational Standards for Data & AI' },
    facts: [
      { ar: 'معايير مهنية سعودية', en: 'Saudi occupational standards' },
      { ar: 'متخصصة في البيانات والذكاء الاصطناعي', en: 'Specialized in data & AI' },
    ],
    description: {
      ar: 'معايير سدايا الوطنية التي تحدد الكفاءات المطلوبة لوظائف البيانات والذكاء الاصطناعي في المملكة — مرجع أساسي لمجال «الذكاء الاصطناعي والبيانات» في الرادار.',
      en: 'SDAIA’s national standards defining the competencies required for data and AI jobs in the Kingdom — a key reference for the radar’s “AI & Data” domain.',
    },
    url: 'https://sdaia.gov.sa',
  },
  {
    id: 'qatar-dsf',
    name: { ar: 'إطار قطر للمهارات الرقمية 2025', en: 'Qatar MCIT Digital Skills Framework 2025' },
    facts: [
      { ar: '115 مهارة', en: '115 skills' },
      { ar: '4 مستويات إتقان', en: '4 proficiency levels' },
    ],
    description: {
      ar: 'أحدث الأطر الوطنية في المنطقة: 115 مهارة على أربعة مستويات. بنيته الرباعية تطابق مستويات الرادار الأربعة تقريبًا، ما يجعله أقرب مرجع إقليمي لمنهجيتنا.',
      en: 'The region’s newest national framework: 115 skills across four levels. Its four-level structure nearly matches the radar’s levels, making it the closest regional reference to our approach.',
    },
    url: 'https://www.mcit.gov.qa',
  },
]

export const reportCards: ReportCard[] = [
  {
    id: 'wef-foj',
    name: { ar: 'تقرير مستقبل الوظائف 2025', en: 'Future of Jobs Report 2025' },
    publisher: { ar: 'المنتدى الاقتصادي العالمي', en: 'World Economic Forum' },
    highlight: {
      ar: '39% من المهارات الأساسية ستتغير بحلول 2030، وأسرع المهارات نموًا: الذكاء الاصطناعي والبيانات الضخمة، الأمن السيبراني، والثقافة التقنية.',
      en: '39% of core skills will change by 2030; fastest-growing: AI & big data, cybersecurity, and technological literacy.',
    },
    url: 'https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf',
  },
  {
    id: 'oecd-dtf',
    name: { ar: 'إطار OECD للمواهب والمهارات الرقمية في القطاع العام', en: 'OECD Framework for Digital Talent and Skills in the Public Sector' },
    publisher: { ar: 'منظمة التعاون والتنمية (2021/2024)', en: 'OECD (2021/2024)' },
    highlight: {
      ar: 'يحدد أربع طبقات من المهارات الرقمية في القطاع العام: أساسية للجميع، ومهنية للمستخدمين، ومتخصصة، وقيادية.',
      en: 'Defines four layers of public-sector digital skills: foundational for all, professional for users, specialist, and leadership.',
    },
    url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/04/the-oecd-framework-for-digital-talent-and-skills-in-the-public-sector_f6fb7838/4e7c3f58-en.pdf',
  },
  {
    id: 'un-egov',
    name: { ar: 'مسح الأمم المتحدة للحكومة الإلكترونية 2024', en: 'UN E-Government Survey 2024' },
    publisher: { ar: 'الأمم المتحدة — إدارة الشؤون الاقتصادية والاجتماعية', en: 'UN DESA' },
    highlight: {
      ar: 'يربط تقدم الحكومة الرقمية برأس المال البشري، ويبرز الحاجة لاستثمار ممنهج في المهارات الرقمية للموظفين والمواطنين.',
      en: 'Links digital-government progress to human capital, highlighting the need for systematic investment in digital skills for employees and citizens.',
    },
    url: 'https://desapublications.un.org/publications/un-e-government-survey-2024',
  },
  {
    id: 'coursera-gsr',
    name: { ar: 'تقرير كورسيرا للمهارات العالمية 2025', en: 'Coursera Global Skills Report 2025' },
    publisher: { ar: 'كورسيرا', en: 'Coursera' },
    highlight: {
      ar: 'نمو التسجيل في مساقات الذكاء الاصطناعي التوليدي بنسبة +195% — أسرع مهارة نموًا على الإطلاق في المنصة.',
      en: 'Generative AI course enrollments grew +195% — the fastest-growing skill ever recorded on the platform.',
    },
    url: 'https://www.coursera.org/skills-reports/global',
  },
  {
    id: 'linkedin-rise',
    name: { ar: 'مهارات لينكدإن الصاعدة 2025', en: 'LinkedIn Skills on the Rise 2025' },
    publisher: { ar: 'لينكدإن', en: 'LinkedIn' },
    highlight: {
      ar: 'الإلمام بالذكاء الاصطناعي في المرتبة الأولى عالميًا بين المهارات الأسرع نموًا في الطلب الوظيفي.',
      en: 'AI literacy ranks #1 globally among the fastest-growing skills in job demand.',
    },
    url: 'https://www.linkedin.com/business/talent/blog/skills-on-the-rise',
  },
]
