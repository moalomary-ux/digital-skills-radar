import type { L } from './types'

/**
 * Learning Engine dataset — converted from research/learning-engine.md.
 * 48 learning resources (2 per domain × level transition), three 13-week
 * 90-day plan templates, and 24 calibration questions.
 * Domain keys normalized to app ids.
 */

export type TransitionKey = '1_to_2' | '2_to_3' | '3_to_4'

export interface LearningResource {
  title: L
  provider: string
  type: 'course' | 'certification' | 'program' | 'reference'
  url: string
  language: 'en' | 'both'
}

export const transitionNames: Record<TransitionKey, L> = {
  '1_to_2': { ar: 'وعي ← تطبيق', en: 'Awareness → Working' },
  '2_to_3': { ar: 'تطبيق ← ممارس', en: 'Working → Practitioner' },
  '3_to_4': { ar: 'ممارس ← خبير', en: 'Practitioner → Expert' },
}

export const learningResources: Record<string, Record<TransitionKey, [LearningResource, LearningResource]>> = {
  'ai-data': {
    '1_to_2': [
      {
        title: { ar: 'مقدمة في الذكاء الاصطناعي التوليدي', en: 'Introduction to Generative AI' },
        provider: 'Google Cloud (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/learn/introduction-to-generative-ai',
        language: 'en',
      },
      {
        title: { ar: 'أكاديمية سدايا — برامج ومعسكرات البيانات والذكاء الاصطناعي', en: 'SDAIA Academy — Data & AI Programs and Bootcamps' },
        provider: 'SDAIA Academy (Saudi Data and AI Authority)',
        type: 'program',
        url: 'https://sdaia.gov.sa/en/Sectors/academy/bootcamps/Pages/default.aspx',
        language: 'both',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'تخصص تعلم الآلة', en: 'Machine Learning Specialization' },
        provider: 'DeepLearning.AI & Stanford Online (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
        language: 'en',
      },
      {
        title: { ar: 'شهادة AWS لممارس الذكاء الاصطناعي', en: 'AWS Certified AI Practitioner' },
        provider: 'Amazon Web Services',
        type: 'certification',
        url: 'https://aws.amazon.com/certification/certified-ai-practitioner/',
        language: 'en',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'تخصص التعلم العميق', en: 'Deep Learning Specialization' },
        provider: 'DeepLearning.AI (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/deep-learning',
        language: 'en',
      },
      {
        title: { ar: 'شهادة مهندس البيانات المحترف', en: 'Professional Data Engineer Certification' },
        provider: 'Google Cloud',
        type: 'certification',
        url: 'https://cloud.google.com/learn/certification/data-engineer',
        language: 'en',
      },
    ],
  },
  cyber: {
    '1_to_2': [
      {
        title: { ar: 'الشهادة الاحترافية للأمن السيبراني من Google', en: 'Google Cybersecurity Professional Certificate' },
        provider: 'Google (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
        language: 'en',
      },
      {
        title: { ar: 'شهادة الأمن السيبراني (CC)', en: 'Certified in Cybersecurity (CC)' },
        provider: 'ISC2',
        type: 'certification',
        url: 'https://www.isc2.org/certifications/cc',
        language: 'en',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'شهادة CompTIA Security+', en: 'CompTIA Security+' },
        provider: 'CompTIA',
        type: 'certification',
        url: 'https://www.comptia.org/certifications/security',
        language: 'en',
      },
      {
        title: { ar: 'SEC401: أساسيات الأمن — الشبكات والنقاط الطرفية والسحابة', en: 'SEC401: Security Essentials — Network, Endpoint, and Cloud' },
        provider: 'SANS Institute',
        type: 'course',
        url: 'https://www.sans.org/cyber-security-courses/security-essentials-network-endpoint-cloud/',
        language: 'en',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'شهادة محترف أمن نظم المعلومات المعتمد (CISSP)', en: 'Certified Information Systems Security Professional (CISSP)' },
        provider: 'ISC2',
        type: 'certification',
        url: 'https://www.isc2.org/certifications/cissp',
        language: 'en',
      },
      {
        title: { ar: 'SEC504: تقنيات الاختراق والاستغلال والتعامل مع الحوادث', en: 'SEC504: Hacker Techniques, Exploits, and Incident Handling' },
        provider: 'SANS Institute',
        type: 'course',
        url: 'https://www.sans.org/cyber-security-courses/hacker-techniques-exploits-incident-handling/',
        language: 'en',
      },
    ],
  },
  cloud: {
    '1_to_2': [
      {
        title: { ar: 'شهادة AWS لممارس السحابة', en: 'AWS Certified Cloud Practitioner' },
        provider: 'Amazon Web Services',
        type: 'certification',
        url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        language: 'en',
      },
      {
        title: { ar: 'أساسيات Microsoft Azure (AZ-900)', en: 'Microsoft Azure Fundamentals (AZ-900)' },
        provider: 'Microsoft Learn',
        type: 'certification',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
        language: 'en',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'شهادة AWS لمهندس الحلول — المستوى المساعد', en: 'AWS Certified Solutions Architect — Associate' },
        provider: 'Amazon Web Services',
        type: 'certification',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        language: 'en',
      },
      {
        title: { ar: 'تخصص الحوسبة السحابية', en: 'Cloud Computing Specialization' },
        provider: 'University of Illinois Urbana-Champaign (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/cloud-computing',
        language: 'en',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'شهادة AWS لمهندس الحلول — المستوى المحترف', en: 'AWS Certified Solutions Architect — Professional' },
        provider: 'Amazon Web Services',
        type: 'certification',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
        language: 'en',
      },
      {
        title: { ar: 'شهادة Microsoft: خبير هندسة حلول Azure', en: 'Microsoft Certified: Azure Solutions Architect Expert' },
        provider: 'Microsoft Learn',
        type: 'certification',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/',
        language: 'en',
      },
    ],
  },
  'service-design': {
    '1_to_2': [
      {
        title: { ar: 'التفكير التصميمي: دليل المبتدئ', en: "Design Thinking: The Beginner's Guide" },
        provider: 'Interaction Design Foundation',
        type: 'course',
        url: 'https://www.interaction-design.org/courses/design-thinking-the-beginner-s-guide',
        language: 'en',
      },
      {
        title: { ar: 'الدليل الحكومي البريطاني لتصميم الخدمات (GOV.UK)', en: 'GOV.UK Service Manual' },
        provider: 'Government Digital Service (UK)',
        type: 'reference',
        url: 'https://www.gov.uk/service-manual',
        language: 'en',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'بحث المستخدم — الأساليب وأفضل الممارسات', en: 'User Research — Methods and Best Practices' },
        provider: 'Interaction Design Foundation',
        type: 'course',
        url: 'https://www.interaction-design.org/courses/user-research-methods-and-best-practices',
        language: 'en',
      },
      {
        title: { ar: 'تخصص تصميم التفاعل', en: 'Interaction Design Specialization' },
        provider: 'University of California San Diego (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/interaction-design',
        language: 'en',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'تصميم الخدمات: كيف تصمم تجارب خدمة متكاملة', en: 'Service Design: How to Design Integrated Service Experiences' },
        provider: 'Interaction Design Foundation',
        type: 'course',
        url: 'https://www.interaction-design.org/courses/service-design-how-to-design-integrated-service-experiences',
        language: 'en',
      },
      {
        title: { ar: 'IDEO U — دورات قيادة التصميم وتصميم الخدمات', en: 'IDEO U — Design Leadership & Service Design Courses' },
        provider: 'IDEO U',
        type: 'course',
        url: 'https://www.ideou.com',
        language: 'en',
      },
    ],
  },
  policy: {
    '1_to_2': [
      {
        title: { ar: 'مرصد سياسات الذكاء الاصطناعي — OECD', en: 'OECD.AI Policy Observatory' },
        provider: 'OECD',
        type: 'reference',
        url: 'https://oecd.ai',
        language: 'en',
      },
      {
        title: { ar: 'برنامج قدراتك (قدرات-تقنية) لتنمية القدرات في الحكومة الرقمية', en: 'QTech (Qudrat-Tech) Digital Skills Program — Digital Government Capacity Development' },
        provider: 'Digital Government Authority (DGA), Saudi Arabia',
        type: 'program',
        url: 'https://my.gov.sa/en/content/179',
        language: 'both',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'شهادة محترف حوكمة الذكاء الاصطناعي (AIGP)', en: 'Artificial Intelligence Governance Professional (AIGP)' },
        provider: 'IAPP',
        type: 'certification',
        url: 'https://iapp.org/certify/aigp/',
        language: 'en',
      },
      {
        title: { ar: 'الذكاء الاصطناعي للجميع', en: 'AI for Everyone' },
        provider: 'DeepLearning.AI (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/learn/ai-for-everyone',
        language: 'en',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'شهادة مدير خصوصية المعلومات المعتمد (CIPM)', en: 'Certified Information Privacy Manager (CIPM)' },
        provider: 'IAPP',
        type: 'certification',
        url: 'https://iapp.org/certify/cipm/',
        language: 'en',
      },
      {
        title: { ar: 'منصة البنك الدولي للتعلم المفتوح — دورات الحكومة الرقمية والحوكمة', en: 'World Bank Open Learning Campus — Digital Government & Governance Courses' },
        provider: 'World Bank',
        type: 'course',
        url: 'https://olc.worldbank.org',
        language: 'en',
      },
    ],
  },
  agile: {
    '1_to_2': [
      {
        title: { ar: 'الشهادة الاحترافية لإدارة المشاريع من Google', en: 'Google Project Management Professional Certificate' },
        provider: 'Google (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/professional-certificates/google-project-management',
        language: 'en',
      },
      {
        title: { ar: 'شهادة محترف سكرم ماستر I (PSM I)', en: 'Professional Scrum Master I (PSM I)' },
        provider: 'Scrum.org',
        type: 'certification',
        url: 'https://www.scrum.org/professional-scrum-master-i-certification',
        language: 'en',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'تخصص التطوير الرشيق', en: 'Agile Development Specialization' },
        provider: 'University of Virginia (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/agile-development',
        language: 'en',
      },
      {
        title: { ar: 'شهادة مالك المنتج المحترف في سكرم I (PSPO I)', en: 'Professional Scrum Product Owner I (PSPO I)' },
        provider: 'Scrum.org',
        type: 'certification',
        url: 'https://www.scrum.org/professional-scrum-product-owner-i-certification',
        language: 'en',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'شهادة ممارس الرشاقة المعتمد من PMI (PMI-ACP)', en: 'PMI Agile Certified Practitioner (PMI-ACP)' },
        provider: 'Project Management Institute',
        type: 'certification',
        url: 'https://www.pmi.org/certifications/agile-acp',
        language: 'en',
      },
      {
        title: { ar: 'تخصص إدارة المنتجات البرمجية', en: 'Software Product Management Specialization' },
        provider: 'University of Alberta (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/product-management',
        language: 'en',
      },
    ],
  },
  emerging: {
    '1_to_2': [
      {
        title: { ar: 'مقدمة في إنترنت الأشياء والأنظمة المدمجة', en: 'Introduction to the Internet of Things and Embedded Systems' },
        provider: 'University of California Irvine (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/learn/iot',
        language: 'en',
      },
      {
        title: { ar: 'تخصص سلسلة الكتل (البلوك تشين)', en: 'Blockchain Specialization' },
        provider: 'University at Buffalo (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/blockchain',
        language: 'en',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'منصة IBM لتعلم الحوسبة الكمومية', en: 'IBM Quantum Learning' },
        provider: 'IBM Quantum',
        type: 'course',
        url: 'https://learning.quantum.ibm.com',
        language: 'en',
      },
      {
        title: { ar: 'مقدمة في الواقع المعزز وARCore', en: 'Introduction to Augmented Reality and ARCore' },
        provider: 'Google AR & VR (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/learn/ar',
        language: 'en',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'برامج MIT xPRO — الحوسبة الكمومية والتقنيات الناشئة', en: 'MIT xPRO — Quantum Computing & Emerging Technology Programs' },
        provider: 'MIT xPRO',
        type: 'program',
        url: 'https://xpro.mit.edu',
        language: 'en',
      },
      {
        title: { ar: 'أكاديمية طويق — معسكرات التقنيات الناشئة (الذكاء الاصطناعي، السحابة، الأمن السيبراني، العوالم الافتراضية)', en: 'Tuwaiq Academy — Emerging Tech Bootcamps (AI, Cloud, Cybersecurity, Metaverse)' },
        provider: 'Tuwaiq Academy (SAFCSP), Saudi Arabia',
        type: 'program',
        url: 'https://tuwaiq.edu.sa',
        language: 'both',
      },
    ],
  },
  leadership: {
    '1_to_2': [
      {
        title: { ar: 'تخصص قيادة الأفراد والفرق', en: 'Leading People and Teams Specialization' },
        provider: 'University of Michigan (via Coursera)',
        type: 'course',
        url: 'https://www.coursera.org/specializations/leading-teams',
        language: 'en',
      },
      {
        title: { ar: 'دورات القيادة على edX (بما فيها "ممارسة القيادة" من HarvardX)', en: 'edX Leadership Courses (incl. HarvardX "Exercising Leadership")' },
        provider: 'edX (Harvard University and partners)',
        type: 'course',
        url: 'https://www.edx.org/learn/leadership',
        language: 'en',
      },
    ],
    '2_to_3': [
      {
        title: { ar: 'مبادئ القيادة', en: 'Leadership Principles' },
        provider: 'Harvard Business School Online',
        type: 'course',
        url: 'https://online.hbs.edu/courses/leadership-principles/',
        language: 'en',
      },
      {
        title: { ar: 'الأكاديمية السعودية الرقمية — برامج ومعسكرات القيادة الرقمية', en: 'Saudi Digital Academy — Digital Leadership Programs and Camps' },
        provider: 'Saudi Digital Academy (MCIT), Saudi Arabia',
        type: 'program',
        url: 'https://sda.edu.sa',
        language: 'both',
      },
    ],
    '3_to_4': [
      {
        title: { ar: 'التحول الرقمي في الحكومة (التعليم التنفيذي)', en: 'Digital Transformation in Government (Executive Education)' },
        provider: 'Harvard Kennedy School',
        type: 'program',
        url: 'https://www.hks.harvard.edu/educational-programs/executive-education/digital-transformation-government',
        language: 'en',
      },
      {
        title: { ar: 'التعليم التنفيذي في إمبريال كوليدج — برامج التحول الرقمي والقيادة', en: 'Imperial Executive Education — Digital Transformation & Leadership Portfolio' },
        provider: 'Imperial College Business School',
        type: 'program',
        url: 'https://www.imperial.ac.uk/business-school/executive-education/',
        language: 'en',
      },
    ],
  },
}

/** Pick the transition key for a domain score (0-4). */
export function transitionForScore(score: number): TransitionKey {
  const rounded = Math.max(1, Math.min(4, Math.round(score)))
  if (rounded >= 4) return '3_to_4'
  return (`${rounded}_to_${rounded + 1}`) as TransitionKey
}

// ── PART 2 — 90-day plan templates (13 weekly milestones per transition) ────
// Tokens substituted at render time: {{domain_en}} {{domain_ar}} {{resource_1}} {{resource_2}}

export interface PlanWeek {
  w: number
  text: L
}

export interface PlanTemplate {
  transition: TransitionKey
  goal: L
  weeks: PlanWeek[]
}

export const planTemplates: Record<TransitionKey, PlanTemplate> = {
  '1_to_2': {
    transition: '1_to_2',
    goal: {
      ar: 'الانتقال من وصف أساسيات {{domain_ar}} إلى تطبيقها في مهام واقعية بمساندة.',
      en: 'Move from describing the fundamentals of {{domain_en}} to applying them on real tasks with support.',
    },
    weeks: [
      { w: 1, text: { ar: 'التوجيه — اقرأ نظرة عامة عن المجال، وحدد المصطلحات الأساسية وأصحاب المصلحة، وضع هدف التسعين يوماً مع مديرك المباشر.', en: 'Orientation — read the domain overview, map key terms and stakeholders, and set a 90-day goal with your line manager.' } },
      { w: 2, text: { ar: 'سجّل في {{resource_1}} وأكمل الوحدة الأولى؛ وابدأ مسرداً شخصياً بعشرين مصطلحاً من المجال.', en: 'Enrol in {{resource_1}} and complete its first module; start a personal glossary of 20 domain terms.' } },
      { w: 3, text: { ar: 'رافق ممارساً لنصف يوم واكتب ملاحظة من صفحة واحدة حول كيفية تطبيق المهارة.', en: 'Shadow a practitioner for half a day and write a one-page observation note on how the skill is applied.' } },
      { w: 4, text: { ar: 'واصل {{resource_1}}؛ وأعد تنفيذ مثال عملي واحد كاملاً (درس تطبيقي أو مختبر أو تمرين موجّه).', en: 'Continue {{resource_1}}; reproduce one worked example end-to-end (tutorial, lab or guided exercise).' } },
      { w: 5, text: { ar: 'جهّز الأدوات أو البيئة التجريبية الأساسية لمجال {{domain_ar}} وأكمل مهمة عملية موجّهة واحدة.', en: 'Set up the basic toolset/sandbox for {{domain_en}} and complete one guided hands-on task.' } },
      { w: 6, text: { ar: 'نقطة تحقق — اجتز اختبار المعرفة للمجال (المجموعة الأولى) وراجع الفجوات مع زميل.', en: 'Checkpoint — pass the domain knowledge-check quiz (set 1) and review gaps with a colleague.' } },
      { w: 7, text: { ar: 'طبّق المهارة في مهمة واقعية صغيرة في العمل بمساندة؛ ووثّق ما أنجزته وما احتجت فيه إلى مساعدة.', en: 'Apply the skill to a small real task at work with support; document what you did and what you needed help with.' } },
      { w: 8, text: { ar: 'انضم إلى مجتمع الممارسة أو القناة الداخلية ذات الصلة؛ واطرح سؤالاً واحداً وأجب عن سؤال.', en: 'Join the relevant community of practice or internal channel; ask one question and answer one.' } },
      { w: 9, text: { ar: 'سجّل في {{resource_2}}؛ وأكمل وحداته الأساسية أو احجز موعد اختبار الشهادة.', en: 'Enrol in {{resource_2}}; complete its core module(s) or book the certification exam date.' } },
      { w: 10, text: { ar: 'مهمة تطبيقية ثانية بمساندة أقل — سلّمها واجمع ملاحظات من مالك المهمة.', en: 'Second applied task, less support — deliver it and collect feedback from the task owner.' } },
      { w: 11, text: { ar: 'الترسيخ — أنهِ مقرري {{resource_1}} و{{resource_2}}؛ وحدّث مسردك إلى أربعين مصطلحاً.', en: 'Consolidate — finish {{resource_1}} and {{resource_2}} coursework; update your glossary to 40 terms.' } },
      { w: 12, text: { ar: 'اكتب سجل تأمل — ما أصبحت قادراً على فعله بمساندة، مع روابط أدلة لكل ادعاء.', en: 'Write a reflection log — what you can now do with support, with evidence links for each claim.' } },
      { w: 13, text: { ar: 'التقييم — اعرض المهمتين التطبيقيتين على مديرك، وأكمل اختبار المعرفة (المجموعة الثانية)، وسجّل أدلة مستوى التطبيق في الرادار.', en: 'Assessment — demo the two applied tasks to your manager, complete the knowledge-check quiz (set 2), and log Working-level evidence in the Radar.' } },
    ],
  },
  '2_to_3': {
    transition: '2_to_3',
    goal: {
      ar: 'الانتقال من تطبيق {{domain_ar}} بمساندة إلى تطبيقه باستقلالية ومشاركة المعرفة مع الآخرين.',
      en: 'Move from applying {{domain_en}} with support to applying it independently and sharing knowledge with others.',
    },
    weeks: [
      { w: 1, text: { ar: 'تحليل الفجوات — قيّم نفسك مقابل أوصاف مستوى الممارس، واختر ثلاث فجوات ذات أولوية، واتفق عليها مع مديرك.', en: 'Gap analysis — score yourself against Practitioner descriptors, pick 3 priority gaps, agree them with your manager.' } },
      { w: 2, text: { ar: 'سجّل في {{resource_1}}؛ وابنِ جدول دراسة مرتبطاً بفجواتك الثلاث.', en: 'Enrol in {{resource_1}}; build a study schedule mapped to your three gaps.' } },
      { w: 3, text: { ar: 'كتلة دراسة معمقة 1 — أكمل الوحدة المتقدمة الأولى؛ وأنتج مخرَجاً واحداً (تحليلاً أو تصميماً أو إعداداً).', en: 'Deep study block 1 — complete the first advanced module; produce one artefact (analysis, design, or configuration).' } },
      { w: 4, text: { ar: 'كتلة دراسة معمقة 2 — طبّق أسلوب الوحدة على مشكلة عمل حقيقية لا على تمرين تعليمي.', en: 'Deep study block 2 — apply the module technique to a live work problem, not a tutorial.' } },
      { w: 5, text: { ar: 'امتلك مخرَجاً حقيقياً كاملاً في {{domain_ar}} — حدد نطاقه ونفذه واعرضه دون مساندة مباشرة.', en: 'Own a real deliverable end-to-end in {{domain_en}} — scope it, do it, present it, with no hand-holding.' } },
      { w: 6, text: { ar: 'مراجعة الأقران — اطلب من ممارس نقد مخرَجك؛ وسجّل الملاحظات ونفّذها.', en: 'Peer review — have a Practitioner critique your deliverable; log and act on feedback.' } },
      { w: 7, text: { ar: 'نقطة تحقق — اختبار المعرفة (المجموعة الثانية)؛ وأعد دراسة أي وحدة سجّلت فيها ضعفاً.', en: 'Checkpoint — knowledge-check quiz (set 2); revisit any module you scored weakly on.' } },
      { w: 8, text: { ar: 'إعادة التعليم — قدّم جلسة مشاركة معرفة لثلاثين دقيقة لفريقك حول أسلوب أصبحت تستخدمه باستقلالية.', en: 'Teach-back — run a 30-minute knowledge-sharing session for your team on one technique you now use independently.' } },
      { w: 9, text: { ar: 'سجّل في {{resource_2}} (أو اجتز اختبارها)؛ وقد مسار عمل صغيراً ضمن مبادرة أكبر.', en: 'Enrol in {{resource_2}} (or sit its exam); lead a small workstream or sub-task within a larger initiative.' } },
      { w: 10, text: { ar: 'تعاون بين الفرق — اعمل مع زميل من تخصص آخر لحل مشكلة مشتركة واحدة.', en: 'Cross-team collaboration — pair with a colleague from another discipline and resolve one shared problem.' } },
      { w: 11, text: { ar: 'القياس — اجمع أدلة قبل/بعد (مقاييس، ملاحظات مستخدمين، جودة) لمخرجات الأسبوعين 5 و9.', en: 'Measure — collect before/after evidence (metrics, user feedback, quality) for your W5 and W9 deliverables.' } },
      { w: 12, text: { ar: 'تجميع الملف — جمّع المخرجات والملاحظات والمقاييس في ملف أدلة بمستوى الممارس.', en: 'Portfolio assembly — compile artefacts, feedback and metrics into a Practitioner evidence portfolio.' } },
      { w: 13, text: { ar: 'التقييم — مراجعة ملف أدائك أمام ممارس أقدم؛ وتأكيد التطبيق المستقل وتسجيل مستوى الممارس في الرادار.', en: 'Assessment — panel-style review of your portfolio with a senior practitioner; confirm independent application and log Practitioner level in the Radar.' } },
    ],
  },
  '3_to_4': {
    transition: '3_to_4',
    goal: {
      ar: 'الانتقال من الممارسة المستقلة إلى قيادة أفضل الممارسات في {{domain_ar}} — بوضع المعايير والتعليم والتأثير في الجهة.',
      en: 'Move from independent practice to leading best practice in {{domain_en}} — setting standards, teaching and influencing the organisation.',
    },
    weeks: [
      { w: 1, text: { ar: 'حدد هدف الخبير — ارسم معنى "قيادة أفضل الممارسات" في جهتك؛ واحصل على راعٍ أقدم.', en: 'Define the Expert target — map what "leading best practice" means for your organisation; secure a senior sponsor.' } },
      { w: 2, text: { ar: 'حدد مبادرة على مستوى الجهة في {{domain_ar}} ستقودها خلال هذا الربع.', en: 'Identify an organisation-level initiative in {{domain_en}} you will lead over the quarter.' } },
      { w: 3, text: { ar: 'كتلة بحث — قارن ثلاثة نماذج خارجية (أطر، دراسات حالة، معايير) ولخّص الممارسات القابلة للنقل.', en: 'Research block — benchmark 3 external exemplars (frameworks, case studies, standards) and summarise transferable practice.' } },
      { w: 4, text: { ar: 'اصغ مساهمة في معايير الجهة أو دليلها الإرشادي لمجال {{domain_ar}}.', en: "Draft a contribution to the organisation's standards or playbook for {{domain_en}}." } },
      { w: 5, text: { ar: 'قد جلسة للفريق — يسّر ورشة عمل أو اجتماع مراجعة معماري/تصميمي يطبق معيارك المقترح.', en: 'Lead a team session — facilitate a workshop or design/review authority meeting applying your draft standard.' } },
      { w: 6, text: { ar: 'سجّل في {{resource_1}} / حدد موعد تقييمها — استهدف الشهادة أو البرنامج بمستوى الخبير.', en: 'Enrol in {{resource_1}} / schedule its assessment — target the expert-level credential or programme.' } },
      { w: 7, text: { ar: 'انشر الإرشاد الداخلي — أصدر النسخة الأولى من مذكرتك الإرشادية أو معيارك؛ وادعُ إلى تعليقات منظمة.', en: 'Publish internal guidance — release v1 of your guidance note or standard; invite structured comment.' } },
      { w: 8, text: { ar: 'درّب ممارسَين — جلسات تدريب كل أسبوعين؛ ووثّق تقدمهما كدليل على قدرتك التعليمية.', en: 'Coach two practitioners — run fortnightly coaching; document their progress as evidence of teaching.' } },
      { w: 9, text: { ar: 'مثّل المجال — اعرض موقف {{domain_ar}} أو تحليل مخاطره في منتدى حوكمة أو معمارية.', en: 'Represent the domain — present {{domain_en}} position or risk analysis at a governance or architecture forum.' } },
      { w: 10, text: { ar: 'مساهمة خارجية — قدّم عرضاً أو انشر مقالاً أو ساهم في مجتمع ممارسة خارج جهتك.', en: 'External contribution — give a talk, publish an article, or contribute to a community of practice beyond your entity.' } },
      { w: 11, text: { ar: 'قِس الأثر — حدد أثر مبادرتك كمياً (التبني، الجودة، المخاطر، التكلفة) وارفع تقريراً إلى راعيك.', en: 'Measure impact — quantify the effect of your initiative (adoption, quality, risk, cost) and report to your sponsor.' } },
      { w: 12, text: { ar: 'المراجعة مع الراعي — حسّن المعيار إلى نسخته الثانية؛ وسجّل الدروس؛ وحدد الدفعة التالية التي ستطورها.', en: 'Review with sponsor — refine the standard to v2; capture lessons; define the next cohort you will develop.' } },
      { w: 13, text: { ar: 'تقييم الخبير — دافع عن ملفك (المبادرة، المعيار، التدريب، المساهمة الخارجية) أمام لجنة قيادية؛ وسجّل مستوى الخبير في الرادار.', en: 'Expert assessment — defend your portfolio (initiative, standard, coaching, external contribution) before a senior panel; log Expert level in the Radar.' } },
    ],
  },
}

/** Fill a template string with domain + resource substitutions, per language. */
export function fillPlanText(
  text: L,
  lang: 'ar' | 'en',
  domainName: L,
  resource1Title: string,
  resource2Title: string
): string {
  return (lang === 'ar' ? text.ar : text.en)
    .replaceAll('{{domain_ar}}', domainName.ar)
    .replaceAll('{{domain_en}}', domainName.en)
    .replaceAll('{{resource_1}}', resource1Title)
    .replaceAll('{{resource_2}}', resource2Title)
}

// ── PART 3 — Knowledge-check questions (3 per domain = 24) ──────────────────
// Purpose: calibrate self-assessment scores. A self-rated level that
// contradicts quiz performance should be adjusted downward; consistent
// performance supports it.

export interface CalibrationOption {
  key: string
  text: L
}

export interface CalibrationQuestion {
  id: string
  domainId: string
  format: 'mcq' | 'true_false'
  q: L
  options: CalibrationOption[]
  answer: string
  explanation: L
}

export const calibrationQuestions: CalibrationQuestion[] = [
  // ── ai_data ──
  {
    id: 'ai_data_q1', domainId: 'ai-data', format: 'mcq',
    q: { ar: 'أي مما يلي ليس مهمة من مهام تعلم الآلة الموجّه (بإشراف)؟', en: 'Which of the following is NOT a supervised machine-learning task?' },
    options: [
      { key: 'a', text: { ar: 'تصنيف رسائل البريد الإلكتروني إلى مزعجة أو غير مزعجة', en: 'Classification of emails as spam or not spam' } },
      { key: 'b', text: { ar: 'الانحدار للتنبؤ بالطلب على الخدمة في الشهر القادم', en: "Regression to predict next month's service demand" } },
      { key: 'c', text: { ar: 'تجميع العملاء في مجموعات دون فئات محددة مسبقاً', en: 'Clustering customers into groups with no predefined labels' } },
      { key: 'd', text: { ar: 'تصنيف المشاعر في ملاحظات المواطنين', en: 'Sentiment classification of citizen feedback' } },
    ],
    answer: 'c',
    explanation: {
      ar: 'التجميع (Clustering) هو تعلم غير موجّه — فهو يكتشف البنية في بيانات بلا تصنيفات، بينما يتعلم التصنيف والانحدار من أمثلة مصنّفة.',
      en: 'Clustering is unsupervised learning — it finds structure in unlabeled data, while classification and regression learn from labeled examples.',
    },
  },
  {
    id: 'ai_data_q2', domainId: 'ai-data', format: 'true_false',
    q: { ar: 'النموذج الذي يحقق دقة عالية جداً على بيانات التدريب مضمون أن يؤدي جيداً على بيانات جديدة لم يرها من قبل.', en: 'A model that achieves very high accuracy on its training data is guaranteed to perform well on new, unseen data.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'الدقة العالية على بيانات التدريب قد تعني فرط التخصيص (Overfitting) — أي أن النموذج حفظ بيانات التدريب. يجب التحقق من الأداء على بيانات اختبار مستقلة.',
      en: 'High training accuracy can mean overfitting — the model memorised the training data. Performance must be validated on held-out test data.',
    },
  },
  {
    id: 'ai_data_q3', domainId: 'ai-data', format: 'mcq',
    q: { ar: 'ماذا يعني "تسرب البيانات" في مشروع تعلم الآلة؟', en: 'What does "data leakage" mean in a machine-learning project?' },
    options: [
      { key: 'a', text: { ar: 'نشر مجموعة بيانات عن طريق الخطأ على منصة البيانات المفتوحة', en: 'Accidentally publishing a dataset on an open-data portal' } },
      { key: 'b', text: { ar: 'تأثير معلومات من خارج مجموعة التدريب (مثل بيانات الاختبار أو المتغير الهدف نفسه) في تدريب النموذج، ما يضخّم الأداء المقاس', en: 'Information from outside the training set (e.g., test data or the target itself) influencing model training, inflating measured performance' } },
      { key: 'c', text: { ar: 'فقدان بيانات التدريب بسبب فشل النسخ الاحتياطي', en: 'Losing training data because of a failed backup' } },
      { key: 'd', text: { ar: 'مشاركة بيانات مجهولة الهوية بين فريقين حكوميين', en: 'Sharing anonymised data between two government teams' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'يتيح تسرب البيانات للنموذج رؤية معلومات لن تتوفر له وقت التنبؤ، فينتج درجات تقييم مضللة تبدو أفضل من الواقع.',
      en: 'Data leakage lets the model see information it would not have at prediction time, producing misleadingly good evaluation scores.',
    },
  },
  // ── cyber_trust ──
  {
    id: 'cyber_trust_q1', domainId: 'cyber', format: 'mcq',
    q: { ar: 'ماذا يرمز "الثلاثي CIA" في أمن المعلومات؟', en: 'What does the "CIA triad" of information security stand for?' },
    options: [
      { key: 'a', text: { ar: 'التحكم، النزاهة، المصادقة', en: 'Control, Integrity, Authentication' } },
      { key: 'b', text: { ar: 'السرية، النزاهة، التوافر', en: 'Confidentiality, Integrity, Availability' } },
      { key: 'c', text: { ar: 'الامتثال، الهوية، الوصول', en: 'Compliance, Identity, Access' } },
      { key: 'd', text: { ar: 'التشفير، العزل، التدقيق', en: 'Cryptography, Isolation, Auditing' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'الثلاثي CIA — السرية والنزاهة والتوافر — هو النموذج الأساسي لأهداف الأمن.',
      en: 'The CIA triad — Confidentiality, Integrity, Availability — is the foundational model for security objectives.',
    },
  },
  {
    id: 'cyber_trust_q2', domainId: 'cyber', format: 'mcq',
    q: { ar: 'أي مما يلي أوضح مثال على هجوم الهندسة الاجتماعية؟', en: 'Which of the following is the clearest example of a social-engineering attack?' },
    options: [
      { key: 'a', text: { ar: 'استغلال ثغرة غير معالجة في خادم ويب', en: 'Exploiting an unpatched web-server vulnerability' } },
      { key: 'b', text: { ar: 'رسالة تصيّد إلكترونية تخدع موظفاً ليكشف كلمة مروره', en: 'A phishing email that tricks an employee into revealing their password' } },
      { key: 'c', text: { ar: 'هجوم حرمان من الخدمة موزّع يغرق بوابة إلكترونية', en: 'A distributed denial-of-service attack flooding a portal' } },
      { key: 'd', text: { ar: 'اعتراض حركة بيانات شبكة لاسلكية غير مشفرة', en: 'Intercepting unencrypted Wi-Fi traffic' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'الهندسة الاجتماعية تتلاعب بالأشخاص بدلاً من استغلال العيوب التقنية — والتصيّد هو أكثر أشكالها شيوعاً.',
      en: 'Social engineering manipulates people rather than exploiting technical flaws — phishing is its most common form.',
    },
  },
  {
    id: 'cyber_trust_q3', domainId: 'cyber', format: 'true_false',
    q: { ar: 'تفعيل المصادقة متعددة العوامل (MFA) يلغي جميع مخاطر اختراق الحسابات.', en: 'Enabling multi-factor authentication (MFA) eliminates all risk of account compromise.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'تقلل المصادقة متعددة العوامل المخاطر بشدة لكنها لا تلغيها — فتظل مخاطر مثل اختطاف الجلسات وإغراق المستخدم بطلبات الموافقة.',
      en: 'MFA sharply reduces risk but does not eliminate it — session hijacking, MFA fatigue prompts and phishing-resistant gaps remain.',
    },
  },
  // ── cloud_infra ──
  {
    id: 'cloud_infra_q1', domainId: 'cloud', format: 'mcq',
    q: { ar: 'أي مما يلي ليس من نماذج الخدمة السحابية القياسية الثلاثة؟', en: 'Which of the following is NOT one of the three standard cloud service models?' },
    options: [
      { key: 'a', text: { ar: 'البنية التحتية كخدمة (IaaS)', en: 'Infrastructure as a Service (IaaS)' } },
      { key: 'b', text: { ar: 'المنصة كخدمة (PaaS)', en: 'Platform as a Service (PaaS)' } },
      { key: 'c', text: { ar: 'البرمجيات كخدمة (SaaS)', en: 'Software as a Service (SaaS)' } },
      { key: 'd', text: { ar: 'الأجهزة كأجهزة مُدارة (داخل المقر)', en: 'Hardware as a Managed Appliance (on-premises)' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'النماذج القياسية الثلاثة هي IaaS وPaaS وSaaS؛ أما الأجهزة المدارة داخل المقر فليست نموذج خدمة سحابية.',
      en: 'The three standard models are IaaS, PaaS and SaaS; on-premises managed appliances are not a cloud service model.',
    },
  },
  {
    id: 'cloud_infra_q2', domainId: 'cloud', format: 'mcq',
    q: { ar: 'وفق نموذج المسؤولية المشتركة، من المسؤول عن تحديث نظام التشغيل الضيف في جهاز افتراضي بنموذج IaaS؟', en: 'Under the shared responsibility model, who is responsible for patching the guest operating system in an IaaS virtual machine?' },
    options: [
      { key: 'a', text: { ar: 'مزود السحابة، دائماً', en: 'The cloud provider, always' } },
      { key: 'b', text: { ar: 'العميل', en: 'The customer' } },
      { key: 'c', text: { ar: 'مصنّع الأجهزة', en: 'The hardware manufacturer' } },
      { key: 'd', text: { ar: 'لا أحد — فأنظمة IaaS تحدّث نفسها', en: 'No one — IaaS systems patch themselves' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'في نموذج IaaS يؤمّن المزود الطبقة المادية والطبقة الافتراضية؛ بينما يدير العميل نظام التشغيل الضيف والوسائط والبيانات والوصول.',
      en: 'In IaaS, the provider secures the physical layer and hypervisor; the customer manages the guest OS, middleware, data and access.',
    },
  },
  {
    id: 'cloud_infra_q3', domainId: 'cloud', format: 'true_false',
    q: { ar: 'يتيح التوسع التلقائي للخدمة السحابية إضافة السعة أو إزالتها تلقائياً استجابةً للطلب، ما يحسّن المرونة وكفاءة التكلفة.', en: 'Auto-scaling lets a cloud service add or remove capacity automatically in response to demand, improving resilience and cost efficiency.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'يوائم التوسع التلقائي السعة مع منحنى الطلب، فيتجنب الحمل الزائد وقت الذروة ودفع تكلفة موارد خاملة خارجها.',
      en: 'Auto-scaling matches capacity to demand curves, avoiding both overload during peaks and paying for idle resources off-peak.',
    },
  },
  // ── service_design ──
  {
    id: 'service_design_q1', domainId: 'service-design', format: 'mcq',
    q: { ar: 'أي مما يلي مخرَج أساسي في تصميم الخدمات؟', en: 'Which of the following is a core artefact of service design?' },
    options: [
      { key: 'a', text: { ar: 'مخطط هيكلي تنظيمي', en: 'An organisational chart' } },
      { key: 'b', text: { ar: 'مخطط خدمة يربط إجراءات المستخدم بعمليات الواجهة الأمامية والكواليس', en: 'A service blueprint mapping user actions to frontstage and backstage processes' } },
      { key: 'c', text: { ar: 'مخطط جانت لخطة المشروع', en: 'A Gantt chart of the project plan' } },
      { key: 'd', text: { ar: 'مخطط كيانات وعلاقات لقاعدة البيانات', en: 'An entity-relationship diagram of the database' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'يربط مخطط الخدمة بين ما يختبره المستخدم والعمليات والأنظمة الداخلية التي تقدم الخدمة — وهو الأداة المميزة لتصميم الخدمات.',
      en: 'The service blueprint connects what the user experiences with the internal processes and systems that deliver it — the signature tool of service design.',
    },
  },
  {
    id: 'service_design_q2', domainId: 'service-design', format: 'true_false',
    q: { ar: 'بحث المستخدم مطلوب فقط في بداية المشروع، قبل بدء أعمال التصميم.', en: 'User research is only needed at the start of a project, before design work begins.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'البحث مستمر عبر دورة الحياة كاملة — بحث الاكتشاف، واختبار النماذج الأولية في مرحلتي ألفا وبيتا، وملاحظات الخدمة الحية.',
      en: 'Research runs through the whole lifecycle — discovery research, prototype testing in alpha/beta, and live-service feedback.',
    },
  },
  {
    id: 'service_design_q3', domainId: 'service-design', format: 'mcq',
    q: { ar: 'ما الترتيب الصحيح لمراحل تسليم الخدمات وفق منهجية الخدمة الرقمية الحكومية البريطانية (GDS)؟', en: 'What is the correct order of the UK Government Digital Service (GDS) delivery phases?' },
    options: [
      { key: 'a', text: { ar: 'ألفا ← الاكتشاف ← الإطلاق ← بيتا', en: 'Alpha → Discovery → Live → Beta' } },
      { key: 'b', text: { ar: 'الاكتشاف ← ألفا ← بيتا ← الإطلاق', en: 'Discovery → Alpha → Beta → Live' } },
      { key: 'c', text: { ar: 'بيتا ← ألفا ← الاكتشاف ← الإطلاق', en: 'Beta → Alpha → Discovery → Live' } },
      { key: 'd', text: { ar: 'الاكتشاف ← بيتا ← ألفا ← الإطلاق', en: 'Discovery → Beta → Alpha → Live' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'يستكشف الاكتشاف المشكلة، وتبني ألفا النماذج الأولية للحلول، وتطوّر بيتا الخدمة وتختبرها مع مستخدمين حقيقيين، ثم تشغّلها مرحلة الإطلاق وتحسّنها.',
      en: 'Discovery explores the problem, Alpha prototypes solutions, Beta builds and tests with real users, and Live runs and iterates the service.',
    },
  },
  // ── policy_gov ──
  {
    id: 'policy_gov_q1', domainId: 'policy', format: 'mcq',
    q: { ar: 'أي مما يلي ليس دوراً معترفاً به في حوكمة البيانات؟', en: 'Which of the following is NOT a recognised data governance role?' },
    options: [
      { key: 'a', text: { ar: 'مالك البيانات', en: 'Data owner' } },
      { key: 'b', text: { ar: 'أمين البيانات', en: 'Data steward' } },
      { key: 'c', text: { ar: 'وصي البيانات', en: 'Data custodian' } },
      { key: 'd', text: { ar: 'منقّب البيانات', en: 'Data miner' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'يضع المالك السياسات، ويدير الأمين الجودة والتعريفات، ويتولى الوصي الحفظ التقني؛ أما "منقّب البيانات" فهو أسلوب تحليلي وليس دوراً في الحوكمة.',
      en: 'Owners set policy, stewards manage quality and definitions, custodians handle technical custody; "data miner" describes an analysis technique, not a governance role.',
    },
  },
  {
    id: 'policy_gov_q2', domainId: 'policy', format: 'true_false',
    q: { ar: 'تتضمن مبادئ OECD للذكاء الاصطناعي النمو الشامل، والقيم المرتكزة على الإنسان والإنصاف، والشفافية، والمتانة والسلامة، والمساءلة.', en: 'The OECD AI Principles include inclusive growth, human-centred values and fairness, transparency, robustness and safety, and accountability.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'هذه هي المبادئ القيمية الخمسة لمبادئ OECD للذكاء الاصطناعي (2019، محدثة 2024) — أول معيار حكومي دولي للذكاء الاصطناعي.',
      en: 'These are the five value-based principles of the OECD AI Principles (2019, updated 2024) — the first intergovernmental AI standard.',
    },
  },
  {
    id: 'policy_gov_q3', domainId: 'policy', format: 'mcq',
    q: { ar: 'أي جهة هي الجهة التنظيمية المختصة بنظام حماية البيانات الشخصية (PDPL) في السعودية؟', en: 'Which authority is the competent regulator for the Saudi Personal Data Protection Law (PDPL)?' },
    options: [
      { key: 'a', text: { ar: 'هيئة الاتصالات والفضاء والتقنية', en: 'The Communications, Space and Technology Commission (CST)' } },
      { key: 'b', text: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)', en: 'The Saudi Data and Artificial Intelligence Authority (SDAIA)' } },
      { key: 'c', text: { ar: 'وزارة التجارة', en: 'The Ministry of Commerce' } },
      { key: 'd', text: { ar: 'الهيئة الوطنية للأمن السيبراني', en: 'The National Cybersecurity Authority (NCA)' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'سدايا هي الجهة المختصة بنظام حماية البيانات الشخصية ولائحته التنفيذية، بما فيها قواعد نقل البيانات والإبلاغ عن الحوادث.',
      en: 'SDAIA is the competent authority for the PDPL and its implementing regulations, including data-transfer and breach-notification rules.',
    },
  },
  // ── agile_delivery ──
  {
    id: 'agile_delivery_q1', domainId: 'agile', format: 'mcq',
    q: { ar: 'أي مما يلي ليس من الفعاليات الرسمية في إطار سكرم (Scrum)؟', en: 'Which of the following is NOT an official Scrum event?' },
    options: [
      { key: 'a', text: { ar: 'تخطيط العدو (Sprint Planning)', en: 'Sprint Planning' } },
      { key: 'b', text: { ar: 'الاجتماع اليومي (Daily Scrum)', en: 'Daily Scrum' } },
      { key: 'c', text: { ar: 'مراجعة العدو (Sprint Review)', en: 'Sprint Review' } },
      { key: 'd', text: { ar: 'مجلس التوجيه الفصلي', en: 'Quarterly Steering Board' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'يعرّف سكرم خمس فعاليات: العدو، وتخطيط العدو، والاجتماع اليومي، ومراجعة العدو، والاسترجاع (Retrospective) — أما مجلس التوجيه فهو آلية حوكمة خارج إطار سكرم.',
      en: 'Scrum defines five events: the Sprint, Sprint Planning, Daily Scrum, Sprint Review and Sprint Retrospective — a steering board is a governance mechanism outside Scrum.',
    },
  },
  {
    id: 'agile_delivery_q2', domainId: 'agile', format: 'true_false',
    q: { ar: 'في التسليم الرشيق، يُثبَّت نطاق مفصّل ويُتفق عليه مسبقاً ولا يجوز تغييره أثناء المشروع.', en: 'In agile delivery, a detailed scope is fixed and agreed upfront and must not change during the project.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'ترحّب الرشاقة بتغيّر المتطلبات — إذ يعاد ترتيب أولويات النطاق تكرارياً بناءً على الأدلة وملاحظات المستخدمين، مع ضبط الوقت والجودة بدلاً من ذلك.',
      en: 'Agile welcomes changing requirements — scope is reprioritised iteratively based on evidence and user feedback; time and quality are guarded instead.',
    },
  },
  {
    id: 'agile_delivery_q3', domainId: 'agile', format: 'mcq',
    q: { ar: 'ما الغرض الأساسي من المنتج الأولي الأدنى (MVP)؟', en: 'What is the primary purpose of a Minimum Viable Product (MVP)?' },
    options: [
      { key: 'a', text: { ar: 'إطلاق منتج مكتمل المزايا بأسرع وقت ممكن', en: 'To launch a feature-complete product as quickly as possible' } },
      { key: 'b', text: { ar: 'اختبار الفرضيات الأساسية والتعلم من المستخدمين الحقيقيين بأقل جهد', en: 'To test key assumptions and learn from real users with the least effort' } },
      { key: 'c', text: { ar: 'استبدال بحث المستخدم بالتحليلات', en: 'To replace user research with analytics' } },
      { key: 'd', text: { ar: 'عرض المعمارية التقنية على المدققين', en: 'To demonstrate technical architecture to auditors' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'المنتج الأولي الأدنى أداة للتعلم — أصغر شيء يختبر فرضية حرجة مع مستخدمين حقيقيين، وليس نسخة رخيصة من المنتج النهائي.',
      en: 'An MVP is a learning instrument — the smallest thing that tests a critical assumption with real users, not a cheap version of the final product.',
    },
  },
  // ── emerging_tech ──
  {
    id: 'emerging_tech_q1', domainId: 'emerging', format: 'mcq',
    q: { ar: 'أي مما يلي ليس من مجالات التقنيات الناشئة للحكومة؟', en: 'Which of the following is NOT an emerging technology domain for government?' },
    options: [
      { key: 'a', text: { ar: 'الحوسبة الكمومية', en: 'Quantum computing' } },
      { key: 'b', text: { ar: 'الحوسبة الطرفية', en: 'Edge computing' } },
      { key: 'c', text: { ar: 'شبكات الاتصال الهاتفي (Dial-up)', en: 'Dial-up networking' } },
      { key: 'd', text: { ar: 'الحوسبة المكانية والواقع الممتد', en: 'Spatial computing and extended reality' } },
    ],
    answer: 'c',
    explanation: {
      ar: 'الاتصال الهاتفي تقنية وصول قديمة؛ أما الحوسبة الكمومية والطرفية والمكانية فهي مجالات ناشئة نشطة يتتبعها رادار التقنيات الحكومي.',
      en: 'Dial-up is a legacy access technology; quantum, edge and spatial computing are active emerging-technology domains tracked on government tech radars.',
    },
  },
  {
    id: 'emerging_tech_q2', domainId: 'emerging', format: 'mcq',
    q: { ar: 'ما الخاصية التي تجعل السجل في سلسلة الكتل (Blockchain) كاشفاً للتلاعب عملياً؟', en: 'What property makes a blockchain record effectively tamper-evident?' },
    options: [
      { key: 'a', text: { ar: 'كل سجل مخزّن على خادم مركزي واحد', en: 'Each record is stored on a single central server' } },
      { key: 'b', text: { ar: 'كل كتلة مرتبطة تشفيرياً بالكتلة السابقة، فأي تعديل في السجل يكسر السلسلة', en: 'Each block is cryptographically linked to the previous block, so altering history breaks the chain' } },
      { key: 'c', text: { ar: 'تُحذف السجلات بعد 24 ساعة', en: 'Records are deleted after 24 hours' } },
      { key: 'd', text: { ar: 'يمكن للمسؤولين فقط قراءة السجل', en: 'Only administrators can read the ledger' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'يربط التجزئة التشفيرية كل كتلة بسابقتها؛ وأي تغيير في كتلة سابقة يبطل جميع التجزئات اللاحقة ويكتشف فوراً.',
      en: 'Cryptographic hashing links each block to its predecessor; changing any past block invalidates all subsequent hashes and is immediately detectable.',
    },
  },
  {
    id: 'emerging_tech_q3', domainId: 'emerging', format: 'true_false',
    q: { ar: 'ستحل الحواسيب الكمومية محل الحواسيب التقليدية في جميع مهام الحوسبة.', en: 'Quantum computers will replace classical computers for all computing tasks.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'تتفوق الحواسيب الكمومية في فئات محددة من المسائل فقط (كبعض مسائل التحسين والتحليل إلى عوامل)؛ وستبقى الأحمال اليومية على الحوسبة التقليدية.',
      en: 'Quantum computers excel only at specific problem classes (e.g., certain optimisation and factoring problems); everyday workloads will remain classical.',
    },
  },
  // ── leadership_collab ──
  {
    id: 'leadership_collab_q1', domainId: 'leadership', format: 'mcq',
    q: { ar: 'ماذا تعني "السلامة النفسية" في فريق رقمي عالي الأداء؟', en: 'What does "psychological safety" mean in a high-performing digital team?' },
    options: [
      { key: 'a', text: { ar: 'ضمان بألا يتعرض أحد للنقد إطلاقاً', en: 'A guarantee that no one will ever be criticised' } },
      { key: 'b', text: { ar: 'قناعة مشتركة بأن المخاطرة بين الأشخاص آمنة — كالاعتراف بالأخطاء وطرح الأسئلة وتحدي الأفكار', en: 'A shared belief that it is safe to take interpersonal risks — admitting mistakes, asking questions, challenging ideas' } },
      { key: 'c', text: { ar: 'سياسة تقنية معلومات تحمي أجهزة الموظفين', en: 'An IT policy that protects employee devices' } },
      { key: 'd', text: { ar: 'برنامج صحة وعافية تديره الموارد البشرية', en: 'A wellness programme run by HR' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'السلامة النفسية — التي حددها مشروع أرسطو في Google كأهم عامل في فاعلية الفرق — تتيح الصراحة والتعلم، لا غياب المعايير.',
      en: "Psychological safety — identified by Google's Project Aristotle as the top factor in team effectiveness — enables candour and learning, not absence of standards.",
    },
  },
  {
    id: 'leadership_collab_q2', domainId: 'leadership', format: 'true_false',
    q: { ar: 'يدور التحول الرقمي أساساً حول شراء تقنية جديدة.', en: 'Digital transformation is primarily about buying new technology.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'التحول يدور أساساً حول تغيير طريقة عمل الجهة — الخدمات والعمليات والثقافة والقدرات؛ والتقنية ممكّن وليست الهدف.',
      en: 'Transformation is primarily about changing how the organisation works — services, processes, culture and capability; technology is an enabler, not the goal.',
    },
  },
  {
    id: 'leadership_collab_q3', domainId: 'leadership', format: 'mcq',
    q: { ar: 'أي نهج قيادي هو الأكثر فاعلية عموماً للتغيير الرقمي المعقد في الحكومة؟', en: 'Which leadership approach is generally most effective for complex digital change in government?' },
    options: [
      { key: 'a', text: { ar: 'الأمر والسيطرة من شخصية قيادية واحدة', en: 'Command-and-control direction from a single senior figure' } },
      { key: 'b', text: { ar: 'القيادة التكيفية الموزعة التي تمكّن الفرق متعددة التخصصات وتتحسّن بناءً على الأدلة', en: 'Adaptive, distributed leadership that empowers multidisciplinary teams and iterates on evidence' } },
      { key: 'c', text: { ar: 'تفويض جميع القرارات الرقمية للموردين', en: 'Delegating all digital decisions to vendors' } },
      { key: 'd', text: { ar: 'انتظار خطة مثالية متعددة السنوات قبل البدء', en: 'Waiting for a perfect multi-year plan before starting' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'التغيير المعقد لا يمكن التخطيط له بالكامل مسبقاً؛ فالقادة التكيفيون يحددون الاتجاه والضوابط بينما تتعلم الفرق الممكّنة وتعدّل التسليم باستمرار.',
      en: 'Complex change cannot be fully planned upfront; adaptive leaders set direction and guardrails while empowered teams learn and adjust delivery continuously.',
    },
  },
]

export const questionsForDomain = (domainId: string): CalibrationQuestion[] =>
  calibrationQuestions.filter((q) => q.domainId === domainId)
