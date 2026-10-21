import type { Claim } from './types'

/**
 * Claims registered by the leaders packet (P6): the leader brief, the leader
 * judgment check, the government work-shift map and the role sheets.
 * Ids are stable (kebab-case, prefixed 'leaders-').
 *
 * Registration note (2026-10-22): written without network access. Titles,
 * figures and links are from the editor's knowledge of the published sources;
 * every claim whose figure or link still needs a check against the document
 * says so in `caveat`, and is held at medium confidence or lower.
 */

const REVIEWED = '2026-10-22'

const WEF_2025 = {
  title: { ar: 'تقرير مستقبل الوظائف 2025', en: 'The Future of Jobs Report 2025' },
  publisher: { ar: 'المنتدى الاقتصادي العالمي', en: 'World Economic Forum' },
  url: 'https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf',
  year: 2025,
}

const ILO_2025 = {
  title: {
    ar: 'الذكاء الاصطناعي التوليدي والوظائف: مؤشر عالمي محدَّث للتعرض المهني',
    en: 'Generative AI and Jobs: A Refined Global Index of Occupational Exposure',
  },
  publisher: { ar: 'منظمة العمل الدولية', en: 'International Labour Organization' },
  url: 'https://www.ilo.org',
  locator: 'ILO Working Paper, May 2025',
  year: 2025,
}

const OECD_DGPF = {
  title: {
    ar: 'إطار سياسات الحكومة الرقمية: 6 أبعاد للحكومة الرقمية',
    en: 'The OECD Digital Government Policy Framework: Six Dimensions of a Digital Government',
  },
  publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
  url: 'https://doi.org/10.1787/f64fed2a-en',
  locator: 'OECD Public Governance Policy Papers No. 02',
  year: 2020,
}

const UN_EGOV_2024 = {
  title: { ar: 'مسح الأمم المتحدة للحكومة الإلكترونية 2024', en: 'UN E-Government Survey 2024' },
  publisher: { ar: 'إدارة الشؤون الاقتصادية والاجتماعية في الأمم المتحدة', en: 'United Nations DESA' },
  url: 'https://desapublications.un.org/publications/un-e-government-survey-2024',
  year: 2024,
}

const PDPL = {
  title: { ar: 'نظام حماية البيانات الشخصية', en: 'Personal Data Protection Law (PDPL)' },
  publisher: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data & AI Authority (SDAIA)' },
  url: 'https://sdaia.gov.sa',
  year: 2023,
}

const NCA_ECC = {
  title: { ar: 'الضوابط الأساسية للأمن السيبراني', en: 'Essential Cybersecurity Controls (ECC)' },
  publisher: { ar: 'الهيئة الوطنية للأمن السيبراني', en: 'National Cybersecurity Authority (NCA)' },
  url: 'https://nca.gov.sa',
}

const SDAIA_GENAI = {
  title: { ar: 'إرشادات الذكاء الاصطناعي التوليدي للجهات الحكومية', en: 'Generative AI Guidelines for Government' },
  publisher: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data & AI Authority (SDAIA)' },
  url: 'https://sdaia.gov.sa',
  year: 2024,
}

const SDAIA_ETHICS = {
  title: { ar: 'مبادئ أخلاقيات الذكاء الاصطناعي', en: 'AI Ethics Principles' },
  publisher: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data & AI Authority (SDAIA)' },
  url: 'https://sdaia.gov.sa',
  year: 2023,
}

const NDMO = {
  title: {
    ar: 'معايير إدارة البيانات وحوكمتها وحماية البيانات الشخصية',
    en: 'Data Management and Personal Data Protection Standards',
  },
  publisher: { ar: 'مكتب إدارة البيانات الوطنية', en: 'National Data Management Office (NDMO)' },
  url: 'https://sdaia.gov.sa',
}

const EDITORIAL = {
  title: { ar: 'رادار المهارات الرقمية — قراءة تحريرية', en: 'Digital Skills Radar — editorial reading' },
  publisher: { ar: 'فريق التحرير', en: 'Editorial team' },
  year: 2026,
}

const VERIFY_LINK: { ar: string; en: string } = {
  ar: 'سُجّل دون اتصال بالشبكة؛ يُراجَع الرقم والرابط المباشر مقابل الوثيقة قبل النشر.',
  en: 'Registered without network access; check the figure and the direct link against the document before release.',
}

export const leadersClaims: Claim[] = [
  // ── International evidence ──────────────────────────────────────────
  {
    id: 'leaders-ilo-2025-exposure',
    text: {
      ar: 'تقدّر منظمة العمل الدولية أن نحو 1 من كل 4 وظائف في العالم تقع في مهن فيها درجة من التعرض للذكاء الاصطناعي التوليدي.',
      en: 'The ILO estimates that about 1 in 4 jobs worldwide are in occupations with some degree of exposure to generative AI.',
    },
    value: { ar: '1 من كل 4', en: '1 in 4' },
    scope: { ar: 'التوظيف العالمي', en: 'Global employment' },
    period: '2025',
    kind: 'international',
    confidence: 'medium',
    source: ILO_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'التعرض يعني أن بعض المهام قابلة للتنفيذ بالأداة، لا أن الوظيفة ستختفي. ' + VERIFY_LINK.ar,
      en: 'Exposure means some tasks can be done by the tool, not that the job will disappear. ' + VERIFY_LINK.en,
    },
  },
  {
    id: 'leaders-ilo-2025-clerical',
    text: {
      ar: 'في دراسة منظمة العمل الدولية نفسها، تبقى الأعمال المكتبية والإدارية أكثر المجموعات المهنية تعرضاً للذكاء الاصطناعي التوليدي.',
      en: 'In the same ILO study, clerical and administrative support work remains the occupational group most exposed to generative AI.',
    },
    value: { ar: 'الأعلى تعرضاً', en: 'Most exposed group' },
    scope: { ar: 'المجموعات المهنية الرئيسة في التصنيف الدولي للمهن', en: 'ISCO major occupational groups' },
    period: '2025',
    kind: 'international',
    confidence: 'high',
    source: ILO_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'مواءمة الأسر الوظيفية الحكومية مع التصنيف الدولي للمهن تقريبية.',
      en: 'Mapping government job families to ISCO groups is approximate.',
    },
  },
  {
    id: 'leaders-ilo-2025-transformation',
    text: {
      ar: 'وترى الدراسة أن الأرجح في معظم الوظائف المعرّضة هو تحوّل المهام لا الاستبدال الكامل، لأن أجزاء من العمل تبقى بحاجة إلى تدخل بشري.',
      en: 'The study finds that for most exposed jobs, transformation of tasks is more likely than full replacement, because parts of the work still need human input.',
    },
    value: { ar: 'تحوّل لا استبدال', en: 'Transformation, not replacement' },
    period: '2025',
    kind: 'international',
    confidence: 'medium',
    source: ILO_2025,
    reviewedOn: REVIEWED,
  },
  {
    id: 'leaders-wef-2025-skills-change',
    text: {
      ar: 'يتوقع أصحاب العمل أن تتغير 39% من المهارات الأساسية للعاملين بحلول 2030.',
      en: 'Employers expect 39% of workers’ core skills to change by 2030.',
    },
    value: { ar: '39%', en: '39%' },
    scope: { ar: 'أصحاب عمل شملهم مسح التقرير حول العالم', en: 'Employers surveyed worldwide for the report' },
    period: '2025–2030',
    kind: 'international',
    confidence: 'medium',
    source: WEF_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'توقعات أصحاب عمل على مستوى العالم، وليست قياساً للقطاع الحكومي السعودي.',
      en: 'Global employer expectations, not a measurement of the Saudi public sector.',
    },
  },
  {
    id: 'leaders-wef-2025-ai-transform',
    text: {
      ar: 'يتوقع 86% من أصحاب العمل أن يحوّل الذكاء الاصطناعي وتقنيات معالجة المعلومات أعمالهم بحلول 2030.',
      en: '86% of employers expect AI and information-processing technologies to transform their business by 2030.',
    },
    value: { ar: '86%', en: '86%' },
    scope: { ar: 'أصحاب عمل شملهم مسح التقرير حول العالم', en: 'Employers surveyed worldwide for the report' },
    period: '2025–2030',
    kind: 'international',
    confidence: 'medium',
    source: WEF_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'توقعات أصحاب عمل على مستوى العالم، وليست قياساً للقطاع الحكومي السعودي.',
      en: 'Global employer expectations, not a measurement of the Saudi public sector.',
    },
  },
  {
    id: 'leaders-wef-2025-skill-gaps',
    text: {
      ar: 'يرى 63% من أصحاب العمل أن فجوات المهارات هي العائق الأول أمام تحوّل أعمالهم حتى 2030.',
      en: '63% of employers see skill gaps as the main barrier to transforming their business through 2030.',
    },
    value: { ar: '63%', en: '63%' },
    scope: { ar: 'أصحاب عمل شملهم مسح التقرير حول العالم', en: 'Employers surveyed worldwide for the report' },
    period: '2025–2030',
    kind: 'international',
    confidence: 'medium',
    source: WEF_2025,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'توقعات أصحاب عمل على مستوى العالم، وليست قياساً للقطاع الحكومي السعودي.',
      en: 'Global employer expectations, not a measurement of the Saudi public sector.',
    },
  },
  {
    id: 'leaders-oecd-data-driven',
    text: {
      ar: 'يعدّ إطار سياسات الحكومة الرقمية لمنظمة التعاون الاقتصادي والتنمية «القطاع العام المبني على البيانات» أحد 6 أبعاد للحكومة الرقمية.',
      en: 'The OECD Digital Government Policy Framework names a “data-driven public sector” as one of 6 dimensions of a digital government.',
    },
    value: { ar: '1 من 6 أبعاد', en: '1 of 6 dimensions' },
    kind: 'international',
    confidence: 'high',
    source: OECD_DGPF,
    reviewedOn: REVIEWED,
    caveat: VERIFY_LINK,
  },
  {
    id: 'leaders-oecd-user-driven',
    text: {
      ar: 'ويضع الإطار نفسه «التصميم حول المستخدم» و«الحكومة كمنصة» ضمن أبعاده الستة: خدمات تُبنى حول احتياج المستفيد وتُطوَّر باستمرار.',
      en: 'The same framework lists “user-driven” and “government as a platform” among its six dimensions: services built around user needs and improved continuously.',
    },
    value: { ar: '2 من 6 أبعاد', en: '2 of 6 dimensions' },
    kind: 'international',
    confidence: 'high',
    source: OECD_DGPF,
    reviewedOn: REVIEWED,
    caveat: VERIFY_LINK,
  },
  {
    id: 'leaders-un-egov-2024',
    text: {
      ar: 'يرصد مسح الأمم المتحدة للحكومة الإلكترونية 2024 الخدمات الرقمية في 193 دولة وينشر ترتيبها، وجاءت المملكة في المرتبة 6 عالمياً في مؤشر تطوير الحكومة الإلكترونية.',
      en: 'The UN E-Government Survey 2024 assesses digital government in 193 countries and publishes the rankings; Saudi Arabia ranked 6th globally on the E-Government Development Index.',
    },
    value: { ar: 'المرتبة 6 من 193', en: '6th of 193' },
    scope: { ar: 'الدول الأعضاء في الأمم المتحدة', en: 'UN member states' },
    period: '2024',
    kind: 'international',
    confidence: 'medium',
    source: { ...UN_EGOV_2024, locator: 'E-Government Development Index (EGDI), annex table' },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'يُراجَع الترتيب مقابل جدول الملحق في المسح قبل النشر.',
      en: 'Check the rank against the survey’s annex table before release.',
    },
  },
  // ── Saudi official references ───────────────────────────────────────
  {
    id: 'leaders-pdpl-enforcement',
    text: {
      ar: 'دخل نظام حماية البيانات الشخصية حيز التنفيذ في سبتمبر 2023، وانتهت مهلة الامتثال الممنوحة للجهات في سبتمبر 2024.',
      en: 'The Personal Data Protection Law came into force in September 2023, and the compliance grace period for organisations ended in September 2024.',
    },
    value: { ar: 'سبتمبر 2024', en: 'September 2024' },
    scope: { ar: 'الجهات التي تعالج بيانات شخصية في المملكة', en: 'Organisations processing personal data in Saudi Arabia' },
    kind: 'official',
    confidence: 'high',
    source: PDPL,
    reviewedOn: REVIEWED,
    caveat: VERIFY_LINK,
  },
  {
    id: 'leaders-nca-ecc-mandatory',
    text: {
      ar: 'الضوابط الأساسية للأمن السيبراني الصادرة عن الهيئة الوطنية للأمن السيبراني ملزمة للجهات الحكومية، وتشمل التوعية والتدريب في الأمن السيبراني.',
      en: 'The NCA Essential Cybersecurity Controls are mandatory for government entities and include cybersecurity awareness and training.',
    },
    value: { ar: 'ملزمة', en: 'Mandatory' },
    scope: { ar: 'الجهات الحكومية', en: 'Government entities' },
    kind: 'official',
    confidence: 'high',
    source: NCA_ECC,
    reviewedOn: REVIEWED,
    caveat: VERIFY_LINK,
  },
  {
    id: 'leaders-nca-ecc-third-party',
    text: {
      ar: 'وتخصص الضوابط نفسها مجالاً للأمن السيبراني المتعلق بالأطراف الخارجية والحوسبة السحابية، فتصبح شروط الأمن جزءاً من كل عقد تقني.',
      en: 'The same controls dedicate a domain to third-party and cloud-computing cybersecurity, so security terms become part of every technology contract.',
    },
    value: { ar: 'مجال مستقل', en: 'A dedicated domain' },
    scope: { ar: 'الجهات الحكومية', en: 'Government entities' },
    kind: 'official',
    confidence: 'medium',
    source: NCA_ECC,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'يُراجَع ترقيم المجال وعنوانه في الإصدار الأحدث من الضوابط. ' + VERIFY_LINK.ar,
      en: 'Check the domain number and title in the latest edition of the controls. ' + VERIFY_LINK.en,
    },
  },
  {
    id: 'leaders-sdaia-genai-guidelines',
    text: {
      ar: 'أصدرت الهيئة السعودية للبيانات والذكاء الاصطناعي في 2024 إرشادات للذكاء الاصطناعي التوليدي موجهة للجهات الحكومية، وأخرى لعموم المستخدمين.',
      en: 'In 2024 SDAIA issued generative AI guidelines for government entities, and a separate set for the public.',
    },
    value: { ar: '2024', en: '2024' },
    kind: 'official',
    confidence: 'medium',
    source: SDAIA_GENAI,
    reviewedOn: REVIEWED,
    caveat: VERIFY_LINK,
  },
  {
    id: 'leaders-sdaia-ai-ethics',
    text: {
      ar: 'تحدد مبادئ أخلاقيات الذكاء الاصطناعي الصادرة عن الهيئة السعودية للبيانات والذكاء الاصطناعي 7 مبادئ، منها المساءلة والمسؤولية، والشفافية وقابلية التفسير.',
      en: 'SDAIA’s AI Ethics Principles set out 7 principles, including accountability and responsibility, and transparency and explainability.',
    },
    value: { ar: '7 مبادئ', en: '7 principles' },
    kind: 'official',
    confidence: 'medium',
    source: SDAIA_ETHICS,
    reviewedOn: REVIEWED,
    caveat: VERIFY_LINK,
  },
  {
    id: 'leaders-ndmo-standards',
    text: {
      ar: 'تلزم معايير مكتب إدارة البيانات الوطنية الجهاتِ الحكومية بحوكمة بياناتها، مع أدوار واضحة لملكية البيانات وجودتها.',
      en: 'The National Data Management Office standards require government entities to govern their data, with clear roles for data ownership and quality.',
    },
    value: { ar: 'ملزمة للجهات الحكومية', en: 'Binding on government entities' },
    scope: { ar: 'الجهات الحكومية', en: 'Government entities' },
    kind: 'official',
    confidence: 'medium',
    source: NDMO,
    reviewedOn: REVIEWED,
    caveat: VERIFY_LINK,
  },
  // ── Editorial markers (shown as «تقدير تحريري») ─────────────────────
  {
    id: 'leaders-editorial-work-map',
    text: {
      ar: 'توزيع المهام على الحارات الأربع قراءة تحريرية لاتجاهات 2026–2030 تستند إلى الإشارات المنشورة، وليس قياساً لجهة أو وظيفة بعينها.',
      en: 'Placing tasks in the four lanes is an editorial reading of 2026–2030 trends based on published signals, not a measurement of any entity or job.',
    },
    value: { ar: 'تقدير تحريري', en: 'Editorial estimate' },
    period: '2026–2030',
    kind: 'editorial',
    confidence: 'low',
    source: EDITORIAL,
    reviewedOn: REVIEWED,
    derivation: {
      ar: 'قراءة نوعية لإشارات منظمة العمل الدولية 2025 والمنتدى الاقتصادي العالمي 2025 والمراجع الوطنية، بلا نسب أتمتة.',
      en: 'Qualitative reading of ILO 2025, WEF 2025 and national references, with no automation percentages.',
    },
  },
  {
    id: 'leaders-editorial-role-targets',
    text: {
      ar: 'المستويات المستهدفة لكل مجال في ورقة الدور استرشادية تحريرية مأخوذة من مكتبة الأدوار، وليست متطلبات وظيفية.',
      en: 'The target level per domain on a role sheet is an editorial guide taken from the role library, not a job requirement.',
    },
    value: { ar: 'تقدير تحريري', en: 'Editorial estimate' },
    kind: 'editorial',
    confidence: 'low',
    source: EDITORIAL,
    reviewedOn: REVIEWED,
  },
  {
    id: 'leaders-editorial-check',
    text: {
      ar: 'مواقف فحص القرار القيادي وترتيب خياراتها مكتوبة تحريرياً ولم تُجرَّب ميدانياً بعد؛ هي تمرين للتفكير لا أداة تقييم.',
      en: 'The leader judgment check scenarios and the ordering of their options are editorial and not yet field-tested; they are a thinking exercise, not an assessment instrument.',
    },
    value: { ar: 'تقدير تحريري', en: 'Editorial estimate' },
    kind: 'editorial',
    confidence: 'low',
    source: EDITORIAL,
    reviewedOn: REVIEWED,
  },
]
