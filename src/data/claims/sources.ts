import type { L } from '../types'

/**
 * «المصادر المرجعية المعتمدة» — the recognised, current sources the tool should rest on from now on
 * (owner's binding source policy, DECISION-20261021 §5-ب; list from
 * reviews/content-evidence-audit-20261022.md, "مصادر مرجعية معتمدة").
 * Rendered as the last section of the evidence register (/:lang/evidence).
 *
 * The source class here follows the policy's own categories, which are finer than a claim's `kind`
 * (a claim's kind says what the evidence is; this says who published it).
 */

/** Sources published before this year are flagged «قديم — يُحدَّث» and reviewed in the next cycle (§5-ب). */
export const SOURCE_CURRENT_FROM = 2023

/** True when a source year is known and older than {@link SOURCE_CURRENT_FROM}. */
export function isOutdatedSource(year?: number): boolean {
  return typeof year === 'number' && year < SOURCE_CURRENT_FROM
}

export const outdatedLabel: L = { ar: 'قديم — يُحدَّث', en: 'Outdated — to be updated' }

export type ReferenceSourceKind = 'international' | 'standards' | 'national' | 'foreign-government' | 'advisory' | 'research' | 'university'

export const referenceSourceKindLabel: Record<ReferenceSourceKind, L> = {
  international: { ar: 'منظمة دولية', en: 'International organization' },
  standards: { ar: 'جهة معايير', en: 'Standards body' },
  national: { ar: 'جهة وطنية', en: 'Saudi national authority' },
  'foreign-government': { ar: 'جهة حكومية أجنبية', en: 'Foreign government body' },
  advisory: { ar: 'بيت خبرة', en: 'Advisory firm' },
  research: { ar: 'بحث محكّم', en: 'Peer-reviewed research' },
  university: { ar: 'جامعة', en: 'University' },
}

export interface ReferenceSource {
  /** stable kebab-case id, prefixed 'ref-' */
  id: string
  title: L
  publisher: L
  /** publication year (the latest edition when several are listed) */
  year?: number
  /** shown instead of `year` when one number would mislead (two editions, a living standard, an edition to confirm) */
  yearLabel?: L
  url: string
  kind: ReferenceSourceKind
  /** what the tool uses it for */
  covers: L
}

export const referenceSources: ReferenceSource[] = [
  {
    id: 'ref-wef-future-of-jobs-2025',
    title: { ar: 'تقرير مستقبل الوظائف 2025', en: 'The Future of Jobs Report 2025' },
    publisher: { ar: 'المنتدى الاقتصادي العالمي', en: 'World Economic Forum' },
    year: 2025,
    url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
    kind: 'international',
    covers: { ar: 'اتجاهات المهارات والوظائف', en: 'Skills and jobs trends' },
  },
  {
    id: 'ref-ilo-genai-exposure-2025',
    title: {
      ar: 'الذكاء الاصطناعي التوليدي والوظائف: مؤشر عالمي محدَّث للتعرض المهني (ورقة العمل 140)',
      en: 'Generative AI and Jobs: A Refined Global Index of Occupational Exposure (WP140)',
    },
    publisher: { ar: 'منظمة العمل الدولية', en: 'International Labour Organization (ILO)' },
    year: 2025,
    url: 'https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure',
    kind: 'international',
    covers: { ar: 'تعرض المهام والأسر الوظيفية', en: 'Task and job-family exposure' },
  },
  {
    id: 'ref-oecd-governing-with-ai-2025',
    title: {
      ar: 'الحوكمة بالذكاء الاصطناعي: الواقع الراهن والطريق إلى الأمام في وظائف الحكومة الأساسية',
      en: 'Governing with Artificial Intelligence: The State of Play and Way Forward in Core Government Functions',
    },
    publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
    year: 2025,
    url: 'https://www.oecd.org/en/publications/governing-with-artificial-intelligence_795de142-en.html',
    kind: 'international',
    covers: { ar: 'الذكاء الاصطناعي في وظائف الحكومة، والتحولات، والموجز القيادي', en: 'AI in government functions, the shifts and the leader brief' },
  },
  {
    id: 'ref-oecd-digital-government-index-2025',
    title: { ar: 'مؤشر الحكومة الرقمية ومؤشر البيانات المفتوحة المفيدة القابلة لإعادة الاستخدام 2025', en: 'Digital Government Index and OURdata Index 2025' },
    publisher: { ar: 'منظمة التعاون الاقتصادي والتنمية', en: 'OECD' },
    year: 2026,
    url: 'https://www.oecd.org/en/publications/digital-government-index-and-open-useful-and-re-usable-data-index_6347ec74-en.html',
    kind: 'international',
    covers: { ar: 'يحل محل إطار سياسات الحكومة الرقمية (2020) في سند التحولات', en: 'Replaces the 2020 Digital Government Policy Framework behind the shifts' },
  },
  {
    id: 'ref-un-egov-survey-2024',
    title: { ar: 'مسح الأمم المتحدة للحكومة الإلكترونية 2024', en: 'UN E-Government Survey 2024' },
    publisher: { ar: 'إدارة الشؤون الاقتصادية والاجتماعية في الأمم المتحدة', en: 'United Nations DESA' },
    year: 2024,
    url: 'https://desapublications.un.org/publications/un-e-government-survey-2024',
    kind: 'international',
    covers: { ar: 'الخدمات الرقمية والشمول', en: 'Digital services and inclusion' },
  },
  {
    id: 'ref-world-bank-gtmi-2025',
    title: { ar: 'مؤشر نضج التقنية الحكومية: تحديث 2025', en: 'GovTech Maturity Index 2025 update' },
    publisher: { ar: 'البنك الدولي', en: 'World Bank' },
    year: 2025,
    url: 'https://www.worldbank.org/en/programs/govtech/gtmi-2025-update',
    kind: 'international',
    covers: { ar: 'نضج التقنية الحكومية', en: 'Government technology maturity' },
  },
  {
    id: 'ref-sfia-9',
    title: { ar: 'إطار المهارات للعصر الرقمي SFIA 9', en: 'SFIA 9' },
    publisher: { ar: 'مؤسسة SFIA', en: 'SFIA Foundation' },
    year: 2024,
    url: 'https://sfia-online.org/en/sfia-9',
    kind: 'standards',
    covers: { ar: 'المهارات ورموز الأدوار', en: 'Skills and role codes' },
  },
  {
    id: 'ref-jrc-digcomp-3',
    title: { ar: 'إطار الكفاءة الرقمية للمواطنين DigComp 3.0', en: 'DigComp 3.0 (JRC144121)' },
    publisher: { ar: 'مركز البحوث المشترك في المفوضية الأوروبية', en: 'European Commission Joint Research Centre (JRC)' },
    year: 2025,
    url: 'https://publications.jrc.ec.europa.eu/repository/handle/JRC144121',
    kind: 'international',
    covers: { ar: 'أوصاف المستويات الأربعة', en: 'The four level descriptions' },
  },
  {
    id: 'ref-nist-ai-rmf',
    title: {
      ar: 'إطار إدارة مخاطر الذكاء الاصطناعي 1.0 وملف الذكاء الاصطناعي التوليدي (NIST AI 600-1)',
      en: 'AI Risk Management Framework 1.0 and Generative AI Profile (NIST AI 600-1)',
    },
    publisher: { ar: 'المعهد الوطني الأمريكي للمعايير والتقنية', en: 'NIST' },
    year: 2024,
    yearLabel: { ar: '2023؛ 2024', en: '2023; 2024' },
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    kind: 'standards',
    covers: { ar: 'مواقف الذكاء الاصطناعي والعدالة', en: 'AI and fairness scenarios' },
  },
  {
    id: 'ref-nist-csf-2',
    title: { ar: 'إطار الأمن السيبراني 2.0', en: 'Cybersecurity Framework 2.0' },
    publisher: { ar: 'المعهد الوطني الأمريكي للمعايير والتقنية', en: 'NIST' },
    year: 2024,
    url: 'https://www.nist.gov/cyberframework',
    kind: 'standards',
    covers: { ar: 'مجال الأمن السيبراني', en: 'The cybersecurity domain' },
  },
  {
    id: 'ref-iso-iec-42001',
    title: { ar: 'المواصفة ISO/IEC 42001:2023 لأنظمة إدارة الذكاء الاصطناعي', en: 'ISO/IEC 42001:2023 AI management systems' },
    publisher: { ar: 'المنظمة الدولية للمعايير واللجنة الكهرتقنية الدولية', en: 'ISO/IEC' },
    year: 2023,
    url: 'https://www.iso.org/standard/81230.html',
    kind: 'standards',
    covers: { ar: 'حوكمة الذكاء الاصطناعي في الجهة', en: 'AI governance inside an entity' },
  },
  {
    id: 'ref-w3c-wcag-22',
    title: { ar: 'إرشادات إتاحة محتوى الويب WCAG 2.2', en: 'WCAG 2.2' },
    publisher: { ar: 'اتحاد شبكة الويب العالمية', en: 'W3C' },
    year: 2023,
    url: 'https://www.w3.org/TR/WCAG22/',
    kind: 'standards',
    covers: { ar: 'إمكانية الوصول', en: 'Accessibility' },
  },
  {
    id: 'ref-nca-ecc-2024',
    title: {
      ar: 'الضوابط الأساسية للأمن السيبراني ECC-2:2024 (وضوابط الحوسبة السحابية بإصدارها الجاري)',
      en: 'Essential Cybersecurity Controls ECC-2:2024 (and the current cloud cybersecurity controls)',
    },
    publisher: { ar: 'الهيئة الوطنية للأمن السيبراني', en: 'National Cybersecurity Authority (NCA)' },
    year: 2024,
    url: 'https://cdn.nca.gov.sa/api/files/public/upload/86e09090-44e4-481f-bc28-355673607654_ECC--2024-EN.pdf',
    kind: 'national',
    covers: { ar: 'الأمن والسحابة والموردون', en: 'Security, cloud and suppliers' },
  },
  {
    id: 'ref-sdaia-pdpl',
    title: { ar: 'نظام حماية البيانات الشخصية ولائحته التنفيذية', en: 'Personal Data Protection Law and its Implementing Regulations' },
    publisher: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data & AI Authority (SDAIA)' },
    year: 2023,
    yearLabel: { ar: '2023 (نافذ منذ 14 سبتمبر 2023)', en: '2023 (in force since 14 September 2023)' },
    url: 'https://dgp.sdaia.gov.sa/wps/portal/pdp/home',
    kind: 'national',
    covers: { ar: 'الخصوصية وحماية البيانات الشخصية', en: 'Privacy and personal data protection' },
  },
  {
    id: 'ref-sdaia-ai-ethics-2',
    title: { ar: 'مبادئ أخلاقيات الذكاء الاصطناعي، الإصدار 2.0', en: 'AI Ethics Principles 2.0' },
    publisher: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data & AI Authority (SDAIA)' },
    year: 2023,
    url: 'https://sdaia.gov.sa/en/SDAIA/about/Documents/ai-principles.pdf',
    kind: 'national',
    covers: { ar: 'المساءلة ومستويات المخاطر', en: 'Accountability and risk levels' },
  },
  {
    id: 'ref-sdaia-genai-guidelines',
    title: { ar: 'إرشادات الذكاء الاصطناعي التوليدي للجهات الحكومية', en: 'Generative AI Guidelines for Government' },
    publisher: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي', en: 'Saudi Data & AI Authority (SDAIA)' },
    year: 2024,
    url: 'https://sdaia.gov.sa',
    kind: 'national',
    covers: { ar: 'حدود الاستخدام والمراجعة البشرية', en: 'Limits of use and human review' },
  },
  {
    id: 'ref-ndmo-standards',
    title: { ar: 'معايير إدارة البيانات وحوكمتها وحماية البيانات الشخصية', en: 'Data Management and Personal Data Protection Standards' },
    publisher: { ar: 'مكتب إدارة البيانات الوطنية', en: 'National Data Management Office (NDMO)' },
    yearLabel: { ar: 'يُؤكَّد الإصدار', en: 'Edition to be confirmed' },
    url: 'https://sdaia.gov.sa',
    kind: 'national',
    covers: { ar: 'ملكية البيانات والبيانات المفتوحة', en: 'Data ownership and open data' },
  },
  {
    id: 'ref-dga-dx-maturity-index',
    title: { ar: 'مؤشر نضج التجربة الرقمية', en: 'Digital Experience Maturity Index' },
    publisher: { ar: 'هيئة الحكومة الرقمية', en: 'Digital Government Authority (DGA)' },
    year: 2026,
    yearLabel: { ar: '2025؛ 2026', en: '2025; 2026' },
    url: 'https://dga.gov.sa',
    kind: 'national',
    covers: { ar: 'الخدمات المقاسة والمنشورة والشمول الرقمي', en: 'Measured and published services, and digital inclusion' },
  },
  {
    id: 'ref-dga-emerging-tech-readiness',
    title: { ar: 'مؤشر جاهزية تبني التقنيات الناشئة', en: 'Emerging Technologies Adoption Readiness Index' },
    publisher: { ar: 'هيئة الحكومة الرقمية', en: 'Digital Government Authority (DGA)' },
    year: 2026,
    url: 'https://dga.gov.sa',
    kind: 'national',
    covers: { ar: 'رادار التقنيات', en: 'The technology radar' },
  },
  {
    id: 'ref-gds-service-standard',
    title: { ar: 'معيار الخدمة الحكومية البريطاني ودليل الخدمة', en: 'GOV.UK Service Standard and Service Manual' },
    publisher: { ar: 'الخدمة الرقمية الحكومية في المملكة المتحدة', en: 'UK Government Digital Service' },
    yearLabel: { ar: 'معيار حي يُحدَّث', en: 'Living standard' },
    url: 'https://www.gov.uk/service-manual/service-standard',
    kind: 'foreign-government',
    covers: { ar: 'تصميم الخدمات والعمل بالمنتج', en: 'Service design and product-based delivery' },
  },
  {
    id: 'ref-stanford-ai-index-2025',
    title: { ar: 'تقرير مؤشر الذكاء الاصطناعي 2025', en: 'AI Index Report 2025' },
    publisher: { ar: 'معهد ستانفورد للذكاء الاصطناعي المتمحور حول الإنسان', en: 'Stanford HAI' },
    year: 2025,
    url: 'https://hai.stanford.edu/ai-index/2025-ai-index-report',
    kind: 'university',
    covers: { ar: 'قدرات الذكاء الاصطناعي وتبنيه', en: 'AI capabilities and adoption' },
  },
  {
    id: 'ref-qje-genai-at-work-2025',
    title: { ar: 'الذكاء الاصطناعي التوليدي في العمل (Brynjolfsson وLi وRaymond)', en: 'Generative AI at Work (Brynjolfsson, Li, Raymond), QJE 140(2)' },
    publisher: { ar: 'مجلة الاقتصاد الفصلية، مطبعة جامعة أكسفورد', en: 'The Quarterly Journal of Economics, Oxford University Press' },
    year: 2025,
    url: 'https://doi.org/10.1093/qje/qjae044',
    kind: 'research',
    covers: { ar: 'أثر الأداة على خدمة المستفيدين', en: 'The tool’s effect on beneficiary service' },
  },
  {
    id: 'ref-jels-legal-ai-2025',
    title: {
      ar: 'خالٍ من الهلوسة؟ تقييم موثوقية أدوات البحث القانوني الرائدة بالذكاء الاصطناعي (Magesh وآخرون)',
      en: 'Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools (Magesh et al.)',
    },
    publisher: { ar: 'مجلة الدراسات القانونية التجريبية (Wiley)، ومختبر RegLab في ستانفورد', en: 'Journal of Empirical Legal Studies (Wiley), Stanford RegLab' },
    year: 2025,
    url: 'https://nlp.stanford.edu/~manning/papers/Magesh-Hallucination%E2%80%90Free-2025.pdf',
    kind: 'research',
    covers: { ar: 'حدود الأتمتة في العمل القانوني', en: 'Limits of automation in legal work' },
  },
  {
    id: 'ref-gartner-emerging-tech-2025',
    title: {
      ar: 'دورة الضجيج للتقنيات الناشئة 2025، وتوقعات الذكاء الاصطناعي الوكيل (يونيو 2025)',
      en: 'Hype Cycle for Emerging Technologies 2025, and the agentic AI forecast (June 2025)',
    },
    publisher: { ar: 'غارتنر', en: 'Gartner' },
    year: 2025,
    url: 'https://www.gartner.com/en/newsroom',
    kind: 'advisory',
    covers: { ar: 'نضج التقنيات الناشئة', en: 'Maturity of emerging technologies' },
  },
  {
    id: 'ref-enisa-threat-landscape',
    title: { ar: 'مشهد التهديدات السيبرانية (أحدث إصدار سنوي)', en: 'ENISA Threat Landscape (latest annual edition)' },
    publisher: { ar: 'وكالة الاتحاد الأوروبي للأمن السيبراني', en: 'European Union Agency for Cybersecurity (ENISA)' },
    year: 2025,
    yearLabel: { ar: '2024–2025', en: '2024–2025' },
    url: 'https://www.enisa.europa.eu/topics/cyber-threats/threat-landscape',
    kind: 'standards',
    covers: { ar: 'التصيد المولَّد والتزييف العميق', en: 'Generated phishing and deepfakes' },
  },
]
