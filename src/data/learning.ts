import type { L } from './types'
import { levelValueForScore } from './levels'

/**
 * Learning Engine dataset — converted from research/learning-engine.md.
 * 48 learning resources (2 per domain × level transition), three 13-week
 * plan templates («خطتك للأيام الـ90 المقبلة»), and the knowledge-check bank
 * («تحقق معرفي», 5 questions per domain). Domain keys normalized to app ids.
 * Level words follow the single vocabulary in levels.ts: وعي · تطبيق · إتقان · ريادة.
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
  '1_to_2': { ar: 'من الوعي إلى التطبيق', en: 'Awareness → Application' },
  '2_to_3': { ar: 'من التطبيق إلى الإتقان', en: 'Application → Proficiency' },
  '3_to_4': { ar: 'من الإتقان إلى الريادة', en: 'Proficiency → Leadership' },
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
        title: { ar: 'برنامج قدراتك لتنمية القدرات في الحكومة الرقمية', en: 'Digital-government capacity programme (برنامج قدراتك)' },
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

/**
 * Pick the transition key for a domain score (0-4), using the SAME thresholds as
 * `levelForScore` (1.25 / 2.25 / 3.25): the current level decides the next step.
 * At «ريادة» (level 4) the plan stays on the last transition (sustain and lead).
 */
export function transitionForScore(score: number): TransitionKey {
  const level = levelValueForScore(score)
  if (level >= 4) return '3_to_4'
  return (`${level}_to_${level + 1}`) as TransitionKey
}

// ── PART 2 — 90-day plan templates (13 weekly milestones per transition) ────
// Tokens substituted at render time: {{domain_en}} {{domain_ar}} {{resource_1}} {{resource_2}}

export interface PlanWeek {
  w: number
  text: L
  /** a checkpoint week (data flag; never detected from the display text) */
  checkpoint?: boolean
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
      { w: 6, text: { ar: 'أجب عن أسئلة التحقق المعرفي للمجال وراجع ما فاتك مع زميل.', en: 'Answer the domain knowledge-check questions and review what you missed with a colleague.' } },
      { w: 7, checkpoint: true, text: { ar: 'مراجعة منتصف الخطة مع مديرك — ثم طبّق المهارة في مهمة واقعية صغيرة بمساندة، ووثّق ما أنجزته وما احتجت فيه إلى مساعدة.', en: 'Mid-plan review with your manager — then apply the skill to a small real task with support, and document what you did and what you needed help with.' } },
      { w: 8, text: { ar: 'انضم إلى مجتمع الممارسة أو القناة الداخلية ذات الصلة؛ واطرح سؤالاً واحداً وأجب عن سؤال.', en: 'Join the relevant community of practice or internal channel; ask one question and answer one.' } },
      { w: 9, text: { ar: 'سجّل في {{resource_2}}؛ وأكمل وحداته الأساسية أو احجز موعد اختبار الشهادة.', en: 'Enrol in {{resource_2}}; complete its core module(s) or book the certification exam date.' } },
      { w: 10, text: { ar: 'مهمة تطبيقية ثانية بمساندة أقل — سلّمها واجمع ملاحظات من مالك المهمة.', en: 'Second applied task, less support — deliver it and collect feedback from the task owner.' } },
      { w: 11, text: { ar: 'الترسيخ — أنهِ مقرري {{resource_1}} و{{resource_2}}؛ وحدّث مسردك إلى أربعين مصطلحاً.', en: 'Consolidate — finish {{resource_1}} and {{resource_2}} coursework; update your glossary to 40 terms.' } },
      { w: 12, text: { ar: 'اكتب سجل تأمل — ما أصبحت قادراً على فعله بمساندة، مع روابط أدلة لكل ادعاء.', en: 'Write a reflection log — what you can now do with support, with evidence links for each claim.' } },
      { w: 13, checkpoint: true, text: { ar: 'المراجعة الختامية — اعرض المهمتين التطبيقيتين على مديرك، وأعد التقييم الذاتي في الرادار لترى أثر الخطة على مستوى «تطبيق».', en: 'Final review — show the two applied tasks to your manager, and retake the self-assessment in the Radar to see the plan’s effect at the Application level.' } },
    ],
  },
  '2_to_3': {
    transition: '2_to_3',
    goal: {
      ar: 'الانتقال من تطبيق {{domain_ar}} بمساندة إلى تطبيقه باستقلالية ومشاركة المعرفة مع الآخرين.',
      en: 'Move from applying {{domain_en}} with support to applying it independently and sharing knowledge with others.',
    },
    weeks: [
      { w: 1, text: { ar: 'نقطة البداية — قارن عملك بوصف مستوى «إتقان»، واختر ثلاثة جوانب للتطوير، واتفق عليها مع مديرك.', en: 'Starting point — compare your work with the Proficiency level description, pick 3 areas to develop, and agree them with your manager.' } },
      { w: 2, text: { ar: 'سجّل في {{resource_1}}؛ وابنِ جدول دراسة مرتبطاً بالجوانب الثلاثة.', en: 'Enrol in {{resource_1}}; build a study schedule mapped to your three areas.' } },
      { w: 3, text: { ar: 'كتلة دراسة معمقة 1 — أكمل الوحدة المتقدمة الأولى؛ وأنتج مخرَجاً واحداً (تحليلاً أو تصميماً أو إعداداً).', en: 'Deep study block 1 — complete the first advanced module; produce one artefact (analysis, design, or configuration).' } },
      { w: 4, text: { ar: 'كتلة دراسة معمقة 2 — طبّق أسلوب الوحدة على مشكلة عمل حقيقية لا على تمرين تعليمي.', en: 'Deep study block 2 — apply the module technique to a live work problem, not a tutorial.' } },
      { w: 5, text: { ar: 'امتلك مخرَجاً حقيقياً كاملاً في {{domain_ar}} — حدد نطاقه ونفذه واعرضه دون مساندة مباشرة.', en: 'Own a real deliverable end-to-end in {{domain_en}} — scope it, do it, present it, with no hand-holding.' } },
      { w: 6, text: { ar: 'مراجعة الأقران — اطلب من زميل متمكّن نقد مخرَجك؛ وسجّل الملاحظات ونفّذها.', en: 'Peer review — ask an experienced colleague to critique your deliverable; log and act on the feedback.' } },
      { w: 7, checkpoint: true, text: { ar: 'مراجعة منتصف الخطة مع مديرك — ثم أجب عن أسئلة التحقق المعرفي للمجال، وأعد دراسة أي وحدة أخطأت في أسئلتها.', en: 'Mid-plan review with your manager — then answer the domain knowledge-check questions and revisit any module whose questions you missed.' } },
      { w: 8, text: { ar: 'إعادة التعليم — قدّم جلسة مشاركة معرفة لثلاثين دقيقة لفريقك حول أسلوب أصبحت تستخدمه باستقلالية.', en: 'Teach-back — run a 30-minute knowledge-sharing session for your team on one technique you now use independently.' } },
      { w: 9, text: { ar: 'سجّل في {{resource_2}} (أو احجز موعد شهادتها)؛ وتولَّ قيادة جزء صغير من العمل ضمن مبادرة أكبر.', en: 'Enrol in {{resource_2}} (or book its certification); lead a small workstream or sub-task within a larger initiative.' } },
      { w: 10, text: { ar: 'تعاون بين الفرق — اعمل مع زميل من تخصص آخر لحل مشكلة مشتركة واحدة.', en: 'Cross-team collaboration — pair with a colleague from another discipline and resolve one shared problem.' } },
      { w: 11, text: { ar: 'القياس — اجمع أدلة قبل/بعد (مقاييس، ملاحظات مستخدمين، جودة) لمخرجات الأسبوعين 5 و9.', en: 'Measure — collect before/after evidence (metrics, user feedback, quality) for your W5 and W9 deliverables.' } },
      { w: 12, text: { ar: 'تجميع الملف — جمّع المخرجات والملاحظات والمقاييس في ملف أدلة لمستوى «إتقان».', en: 'Portfolio assembly — compile artefacts, feedback and metrics into a Proficiency-level evidence portfolio.' } },
      { w: 13, checkpoint: true, text: { ar: 'المراجعة الختامية — راجع ملف أدلتك مع زميل أقدم ومديرك، ثم أعد التقييم الذاتي في الرادار.', en: 'Final review — go through your evidence portfolio with a senior colleague and your manager, then retake the self-assessment in the Radar.' } },
    ],
  },
  '3_to_4': {
    transition: '3_to_4',
    goal: {
      ar: 'الانتقال من الممارسة المستقلة إلى قيادة أفضل الممارسات في {{domain_ar}} — بوضع المعايير والتعليم والتأثير في الجهة.',
      en: 'Move from independent practice to leading best practice in {{domain_en}} — setting standards, teaching and influencing the organisation.',
    },
    weeks: [
      { w: 1, text: { ar: 'حدد هدف «الريادة» — صف معنى قيادة أفضل الممارسات في جهتك؛ واحصل على راعٍ أقدم.', en: 'Define the Leadership target — describe what leading best practice means for your organisation; secure a senior sponsor.' } },
      { w: 2, text: { ar: 'حدد مبادرة على مستوى الجهة في {{domain_ar}} ستقودها خلال هذا الربع.', en: 'Identify an organisation-level initiative in {{domain_en}} you will lead over the quarter.' } },
      { w: 3, text: { ar: 'كتلة بحث — قارن ثلاثة نماذج خارجية (أطر، دراسات حالة، معايير) ولخّص الممارسات القابلة للنقل.', en: 'Research block — benchmark 3 external exemplars (frameworks, case studies, standards) and summarise transferable practice.' } },
      { w: 4, text: { ar: 'صُغ مساهمة في معايير الجهة أو دليلها الإرشادي لمجال {{domain_ar}}.', en: "Draft a contribution to the organisation's standards or playbook for {{domain_en}}." } },
      { w: 5, text: { ar: 'أدِر جلسة للفريق — يسّر ورشة عمل أو اجتماع مراجعة معماري/تصميمي يطبق معيارك المقترح.', en: 'Lead a team session — facilitate a workshop or design/review authority meeting applying your draft standard.' } },
      { w: 6, text: { ar: 'سجّل في {{resource_1}} أو حدد موعد تقييمها — استهدف برنامجاً أو شهادة بمستوى متقدم.', en: 'Enrol in {{resource_1}} or schedule its assessment — target an advanced-level programme or credential.' } },
      { w: 7, checkpoint: true, text: { ar: 'مراجعة منتصف الخطة مع راعيك ومديرك — ثم أصدر النسخة الأولى من مذكرتك الإرشادية أو معيارك، وادعُ إلى تعليقات منظمة.', en: 'Mid-plan review with your sponsor and manager — then release v1 of your guidance note or standard and invite structured comment.' } },
      { w: 8, text: { ar: 'درّب ممارسَين — جلسات تدريب كل أسبوعين؛ ووثّق تقدمهما كدليل على قدرتك التعليمية.', en: 'Coach two practitioners — run fortnightly coaching; document their progress as evidence of teaching.' } },
      { w: 9, text: { ar: 'مثّل المجال — اعرض موقف {{domain_ar}} أو تحليل مخاطره في منتدى حوكمة أو معمارية.', en: 'Represent the domain — present {{domain_en}} position or risk analysis at a governance or architecture forum.' } },
      { w: 10, text: { ar: 'مساهمة خارجية — قدّم عرضاً أو انشر مقالاً أو ساهم في مجتمع ممارسة خارج جهتك.', en: 'External contribution — give a talk, publish an article, or contribute to a community of practice beyond your entity.' } },
      { w: 11, text: { ar: 'قِس الأثر — حدد أثر مبادرتك كمياً (التبني، الجودة، المخاطر، التكلفة) وارفع تقريراً إلى راعيك.', en: 'Measure impact — quantify the effect of your initiative (adoption, quality, risk, cost) and report to your sponsor.' } },
      { w: 12, text: { ar: 'المراجعة مع الراعي — حسّن المعيار إلى نسخته الثانية؛ وسجّل الدروس؛ وحدد الدفعة التالية التي ستطورها.', en: 'Review with sponsor — refine the standard to v2; capture lessons; define the next cohort you will develop.' } },
      { w: 13, checkpoint: true, text: { ar: 'المراجعة الختامية — اعرض ملفك (المبادرة، المعيار، التوجيه، المساهمة الخارجية) على راعيك ومديرك، ثم أعد التقييم الذاتي في الرادار.', en: 'Final review — present your portfolio (initiative, standard, coaching, external contribution) to your sponsor and manager, then retake the self-assessment in the Radar.' } },
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

// ── PART 3 — Knowledge-check questions («تحقق معرفي», 5 per domain = 40) ─────
// Purpose: a reflection prompt beside the self-rating. Results store how many
// questions were attempted and how many were correct per domain; agreement with
// the self-rating is judged only after at least 3 attempts in that domain
// (claim `method-knowledge-min-attempts`). It never proves or disproves a skill.

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
      { key: 'a', text: { ar: 'تجميع العملاء في مجموعات دون فئات محددة مسبقاً', en: 'Clustering customers into groups with no predefined labels' } },
      { key: 'b', text: { ar: 'تصنيف رسائل البريد الإلكتروني إلى مزعجة أو غير مزعجة', en: 'Classification of emails as spam or not spam' } },
      { key: 'c', text: { ar: 'الانحدار للتنبؤ بالطلب على خدمة حكومية في الشهر القادم', en: "Regression to predict next month's demand for a government service" } },
      { key: 'd', text: { ar: 'تصنيف المشاعر في ملاحظات المواطنين', en: 'Sentiment classification of citizen feedback' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'التجميع (Clustering) هو تعلم غير موجّه — فهو يكتشف البنية في بيانات بلا تصنيفات، بينما يتعلم التصنيف والانحدار من أمثلة مصنّفة.',
      en: 'Clustering is unsupervised learning — it finds structure in unlabeled data, while classification and regression learn from labeled examples.',
    },
  },
  {
    id: 'ai_data_q2', domainId: 'ai-data', format: 'true_false',
    q: { ar: 'إذا حقق النموذج دقة عالية جداً على بيانات التدريب، فهذا دليل كافٍ على أنه سيؤدي جيداً على بيانات جديدة لم يرها.', en: 'If a model reaches very high accuracy on its training data, that is enough evidence it will perform well on new, unseen data.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'الدقة العالية على بيانات التدريب قد تعني فرط التخصيص (Overfitting) — أي أن النموذج حفظ بيانات التدريب. يجب التحقق من الأداء على بيانات اختبار مستقلة.',
      en: 'High training accuracy can mean overfitting — the model memorised the training data. Performance must be validated on held-out test data.',
    },
  },
  {
    id: 'ai_data_q3', domainId: 'ai-data', format: 'mcq',
    q: { ar: 'ماذا يعني "تسرب البيانات" في مشروع تعلم الآلة؟', en: 'What does "data leakage" mean in a machine-learning project?' },
    options: [
      { key: 'a', text: { ar: 'نشر مجموعة بيانات التدريب عن طريق الخطأ على منصة البيانات المفتوحة', en: 'Accidentally publishing the training dataset on the open-data portal' } },
      { key: 'b', text: { ar: 'فقدان جزء من بيانات التدريب بسبب فشل النسخ الاحتياطي الليلي', en: 'Losing part of the training data because a nightly backup failed' } },
      { key: 'c', text: { ar: 'وصول معلومات لن تتوفر وقت التنبؤ (كبيانات الاختبار) إلى تدريب النموذج، فتتضخم نتائجه', en: "Information the model won't have at prediction time (e.g., test data) reaching its training, inflating its scores" } },
      { key: 'd', text: { ar: 'مشاركة بيانات مجهولة الهوية بين فريقين حكوميين دون اتفاقية مشاركة', en: 'Sharing anonymised data between two government teams without a sharing agreement' } },
    ],
    answer: 'c',
    explanation: {
      ar: 'يتيح تسرب البيانات للنموذج رؤية معلومات لن تتوفر له وقت التنبؤ، فينتج درجات تقييم مضللة تبدو أفضل من الواقع.',
      en: 'Data leakage lets the model see information it would not have at prediction time, producing misleadingly good evaluation scores.',
    },
  },
  // ── cyber_trust ──
  {
    id: 'cyber_trust_q1', domainId: 'cyber', format: 'mcq',
    q: { ar: 'إلامَ يرمز "الثلاثي CIA" في أمن المعلومات؟', en: 'What does the "CIA triad" of information security stand for?' },
    options: [
      { key: 'a', text: { ar: 'السرية، قابلية التشغيل البيني، المصادقة', en: 'Confidentiality, Interoperability, Authentication' } },
      { key: 'b', text: { ar: 'الامتثال، الهوية، الوصول', en: 'Compliance, Identity, Access' } },
      { key: 'c', text: { ar: 'التشفير، العزل، التدقيق', en: 'Cryptography, Isolation, Auditing' } },
      { key: 'd', text: { ar: 'السرية، النزاهة، التوافر', en: 'Confidentiality, Integrity, Availability' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'الثلاثي CIA — السرية والنزاهة والتوافر — هو النموذج الأساسي لأهداف الأمن.',
      en: 'The CIA triad — Confidentiality, Integrity, Availability — is the foundational model for security objectives.',
    },
  },
  {
    id: 'cyber_trust_q2', domainId: 'cyber', format: 'mcq',
    q: { ar: 'أي مما يلي أوضح مثال على هجوم الهندسة الاجتماعية؟', en: 'Which of the following is the clearest example of a social-engineering attack?' },
    options: [
      { key: 'a', text: { ar: 'استغلال ثغرة معروفة غير معالجة في خادم الويب العام للجهة', en: "Exploiting a known but unpatched vulnerability in the entity's public web server" } },
      { key: 'b', text: { ar: 'رسالة تصيّد إلكترونية تخدع موظفاً ليكشف كلمة مروره', en: 'A phishing email that tricks an employee into revealing their password' } },
      { key: 'c', text: { ar: 'هجوم حرمان من الخدمة موزّع يغرق بوابة حكومية بسيل من الطلبات', en: 'A distributed denial-of-service attack that floods a government portal with requests' } },
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
      { key: 'a', text: { ar: 'العتاد كجهاز مُدار (داخل المقر)', en: 'Hardware as a Managed Appliance (on-premises)' } },
      { key: 'b', text: { ar: 'البنية التحتية كخدمة (IaaS)', en: 'Infrastructure as a Service (IaaS)' } },
      { key: 'c', text: { ar: 'المنصة كخدمة (PaaS)', en: 'Platform as a Service (PaaS)' } },
      { key: 'd', text: { ar: 'البرمجيات كخدمة (SaaS)', en: 'Software as a Service (SaaS)' } },
    ],
    answer: 'a',
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
      { key: 'b', text: { ar: 'مصنّع الأجهزة', en: 'The hardware manufacturer' } },
      { key: 'c', text: { ar: 'العميل', en: 'The customer' } },
      { key: 'd', text: { ar: 'لا أحد — فأنظمة IaaS تحدّث نفسها', en: 'No one — IaaS systems patch themselves' } },
    ],
    answer: 'c',
    explanation: {
      ar: 'في نموذج IaaS يؤمّن المزود الطبقة المادية والطبقة الافتراضية؛ بينما يدير العميل نظام التشغيل الضيف والبرمجيات الوسيطة والبيانات والوصول.',
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
      { key: 'b', text: { ar: 'مخطط جانت لخطة المشروع', en: 'A Gantt chart of the project plan' } },
      { key: 'c', text: { ar: 'مخطط الكيانات والعلاقات لقاعدة بيانات النظام الخلفي للخدمة', en: 'An entity-relationship diagram of the database behind the service' } },
      { key: 'd', text: { ar: 'مخطط خدمة يربط خطوات المستخدم بالعمل الداخلي', en: 'A service blueprint linking user steps to backstage work' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'يربط مخطط الخدمة بين ما يختبره المستخدم والعمليات والأنظمة الداخلية التي تقدم الخدمة — وهو الأداة المميزة لتصميم الخدمات.',
      en: 'The service blueprint connects what the user experiences with the internal processes and systems that deliver it — the signature tool of service design.',
    },
  },
  {
    id: 'service_design_q2', domainId: 'service-design', format: 'true_false',
    q: { ar: 'يستمر بحث المستخدم عبر مراحل الخدمة كلها، من الاكتشاف إلى ما بعد إطلاقها.', en: 'User research continues through every phase of a service, from discovery to after it goes live.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
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
      { key: 'a', text: { ar: 'منقّب البيانات', en: 'Data miner' } },
      { key: 'b', text: { ar: 'مالك البيانات', en: 'Data owner' } },
      { key: 'c', text: { ar: 'أمين البيانات', en: 'Data steward' } },
      { key: 'd', text: { ar: 'الوصي على البيانات', en: 'Data custodian' } },
    ],
    answer: 'a',
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
      { key: 'b', text: { ar: 'وزارة التجارة', en: 'The Ministry of Commerce' } },
      { key: 'c', text: { ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)', en: 'The Saudi Data & AI Authority (SDAIA)' } },
      { key: 'd', text: { ar: 'الهيئة الوطنية للأمن السيبراني', en: 'The National Cybersecurity Authority (NCA)' } },
    ],
    answer: 'c',
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
      { key: 'a', text: { ar: 'تخطيط السبرنت (Sprint Planning)', en: 'Sprint Planning' } },
      { key: 'b', text: { ar: 'الاجتماع اليومي (Daily Scrum)', en: 'Daily Scrum' } },
      { key: 'c', text: { ar: 'مراجعة السبرنت (Sprint Review)', en: 'Sprint Review' } },
      { key: 'd', text: { ar: 'مجلس التوجيه', en: 'Steering Board' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'يعرّف سكرم خمس فعاليات: السبرنت، وتخطيط السبرنت، والاجتماع اليومي، ومراجعة السبرنت، والاسترجاع (Retrospective) — أما مجلس التوجيه فهو آلية حوكمة خارج إطار سكرم.',
      en: 'Scrum defines five events: the Sprint, Sprint Planning, Daily Scrum, Sprint Review and Sprint Retrospective — a steering board is a governance mechanism outside Scrum.',
    },
  },
  {
    id: 'agile_delivery_q2', domainId: 'agile', format: 'true_false',
    q: { ar: 'في التسليم الرشيق، يمكن إعادة ترتيب أولويات النطاق أثناء المشروع بناءً على الأدلة وملاحظات المستخدمين.', en: 'In agile delivery, scope can be reprioritised during the project based on evidence and user feedback.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
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
      { key: 'b', text: { ar: 'اختبار الفرضيات الأساسية مع مستخدمين حقيقيين بأقل جهد', en: 'To test key assumptions with real users at the least effort' } },
      { key: 'c', text: { ar: 'استبدال بحث المستخدم بالتحليلات', en: 'To replace user research with analytics' } },
      { key: 'd', text: { ar: 'عرض المعمارية التقنية على المدققين قبل اعتماد الميزانية', en: 'To demonstrate the technical architecture to auditors before budget approval' } },
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
      { key: 'a', text: { ar: 'الاتصال الهاتفي (Dial-up)', en: 'Dial-up access' } },
      { key: 'b', text: { ar: 'الحوسبة الكمومية', en: 'Quantum computing' } },
      { key: 'c', text: { ar: 'الحوسبة الطرفية', en: 'Edge computing' } },
      { key: 'd', text: { ar: 'الحوسبة المكانية والواقع الممتد', en: 'Spatial computing and extended reality' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'الاتصال الهاتفي تقنية وصول قديمة؛ أما الحوسبة الكمومية والطرفية والمكانية فهي مجالات ناشئة نشطة تتابعها الحكومات.',
      en: 'Dial-up is a legacy access technology; quantum, edge and spatial computing are active emerging-technology domains that governments track.',
    },
  },
  {
    id: 'emerging_tech_q2', domainId: 'emerging', format: 'mcq',
    q: { ar: 'ما الخاصية التي تجعل السجل في سلسلة الكتل (Blockchain) كاشفاً للتلاعب عملياً؟', en: 'What property makes a blockchain record effectively tamper-evident?' },
    options: [
      { key: 'a', text: { ar: 'كل سجل محفوظ على خادم مركزي واحد تديره جهة موثوقة', en: 'Every record is kept on a single central server run by a trusted authority' } },
      { key: 'b', text: { ar: 'تُحذف السجلات بعد 24 ساعة', en: 'Records are deleted after 24 hours' } },
      { key: 'c', text: { ar: 'كل كتلة مرتبطة تشفيرياً بالكتلة التي تسبقها', en: 'Each block is cryptographically linked to the one before it' } },
      { key: 'd', text: { ar: 'لا يستطيع قراءة السجل إلا عدد محدود من مسؤولي النظام', en: 'Only a small group of system administrators can read the ledger' } },
    ],
    answer: 'c',
    explanation: {
      ar: 'تربط التجزئة التشفيرية كل كتلة بسابقتها؛ وأي تغيير في كتلة سابقة يبطل جميع التجزئات اللاحقة ويُكتشف فوراً.',
      en: 'Cryptographic hashing links each block to its predecessor; changing any past block invalidates all subsequent hashes and is immediately detectable.',
    },
  },
  {
    id: 'emerging_tech_q3', domainId: 'emerging', format: 'true_false',
    q: { ar: 'يُتوقع أن تحل الحواسيب الكمومية محل الحواسيب التقليدية في الأعمال اليومية كقواعد البيانات والمواقع الإلكترونية.', en: 'Quantum computers are expected to replace classical computers for everyday work such as databases and websites.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
    ],
    answer: 'a',
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
      { key: 'a', text: { ar: 'ضمان بألا يتعرض أي عضو في الفريق للنقد على عمله إطلاقاً', en: 'A guarantee that no one in the team will ever be criticised for their work' } },
      { key: 'b', text: { ar: 'سياسة تقنية معلومات تحمي أجهزة الموظفين', en: 'An IT policy that protects employee devices' } },
      { key: 'c', text: { ar: 'برنامج صحة وعافية تديره الموارد البشرية', en: 'A wellness programme run by HR' } },
      { key: 'd', text: { ar: 'قناعة مشتركة بأن الاعتراف بالخطأ وطرح الأسئلة وتحدي الأفكار أمر آمن', en: 'A shared belief that it is safe to admit mistakes, ask questions and challenge ideas' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'السلامة النفسية — التي حددها مشروع أرسطو في Google كأهم عامل في فاعلية الفرق — تتيح الصراحة والتعلم، لا غياب المعايير.',
      en: "Psychological safety — identified by Google's Project Aristotle as the top factor in team effectiveness — enables candour and learning, not absence of standards.",
    },
  },
  {
    id: 'leadership_collab_q2', domainId: 'leadership', format: 'true_false',
    q: { ar: 'في التحول الرقمي، تغيير العمليات والثقافة أهم من شراء التقنية الجديدة.', en: 'In digital transformation, changing processes and culture matters more than buying new technology.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
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
      { key: 'a', text: { ar: 'الأمر والسيطرة من شخصية قيادية واحدة تعتمد كل قرار بنفسها', en: 'Command-and-control direction from one senior figure who approves every decision' } },
      { key: 'b', text: { ar: 'قيادة تكيفية موزعة تمكّن الفرق وتتعلم من الأدلة', en: 'Adaptive, shared leadership that empowers teams to learn from evidence' } },
      { key: 'c', text: { ar: 'تفويض جميع القرارات الرقمية للموردين', en: 'Delegating all digital decisions to vendors' } },
      { key: 'd', text: { ar: 'انتظار خطة مثالية متعددة السنوات قبل البدء بأي تنفيذ', en: 'Waiting for a complete, perfect multi-year plan before starting any delivery' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'التغيير المعقد لا يمكن التخطيط له بالكامل مسبقاً؛ فالقادة التكيفيون يحددون الاتجاه والضوابط بينما تتعلم الفرق الممكّنة وتعدّل التسليم باستمرار.',
      en: 'Complex change cannot be fully planned upfront; adaptive leaders set direction and guardrails while empowered teams learn and adjust delivery continuously.',
    },
  },  // ── Round-3 expansion (P1-8): +2 per domain → 5 per domain ──
  {
    id: 'ai_data_q4', domainId: 'ai-data', format: 'mcq',
    q: { ar: 'ما الغرض الرئيسي من تقسيم البيانات إلى مجموعة تدريب ومجموعة اختبار؟', en: 'What is the main purpose of splitting data into training and test sets?' },
    options: [
      { key: 'a', text: { ar: 'فحص أداء النموذج على بيانات لم يرها', en: 'Checking how the model performs on data it has not seen' } },
      { key: 'b', text: { ar: 'تسريع تدريب النموذج باستخدام أمثلة أقل في كل دورة', en: 'Speeding up model training by using fewer examples per run' } },
      { key: 'c', text: { ar: 'تقليل حجم ملفات البيانات لتسريع حفظها ونقلها', en: 'Reducing the size of data files so they are faster to store' } },
      { key: 'd', text: { ar: 'حماية السجلات الحساسة من التسرب الأمني أثناء التدريب', en: 'Protecting sensitive records from security leaks during training' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'مجموعة الاختبار تقيس التعميم: أداء النموذج على بيانات جديدة هو ما يهم عمليًا، لا حفظه لبيانات التدريب.',
      en: 'The test set measures generalization: performance on unseen data is what matters in practice, not memorizing the training data.',
    },
  },
  {
    id: 'ai_data_q5', domainId: 'ai-data', format: 'true_false',
    q: { ar: 'قد ينتج الذكاء الاصطناعي التوليدي معلومات خاطئة بصياغة تبدو واثقة ومقنعة.', en: 'Generative AI can produce wrong information phrased in a confident, convincing way.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'النماذج التوليدية قد «تهلوس» — تنتج نصوصًا واثقة وخاطئة؛ لذا تُراجَع المخرجات مقابل مصادر موثوقة قبل الاستخدام.',
      en: 'Generative models can hallucinate — producing confident but wrong text — so outputs must be checked against trusted sources before use.',
    },
  },
  {
    id: 'cyber_trust_q4', domainId: 'cyber', format: 'mcq',
    q: { ar: 'ما الذي تصفه المصادقة متعددة العوامل (MFA) بدقة؟', en: 'What does multi-factor authentication (MFA) precisely describe?' },
    options: [
      { key: 'a', text: { ar: 'استخدام كلمتي مرور قويتين معًا', en: 'Using two strong passwords together' } },
      { key: 'b', text: { ar: 'تسجيل الدخول من جهازين مسجّلين مختلفين في الوقت نفسه', en: 'Logging in from two different registered devices at the same time' } },
      { key: 'c', text: { ar: 'إثبات الهوية بدليلين من فئتين مختلفتين (معرفة/ملكية/سمة حيوية)', en: 'Proving identity with two factors from different categories (knowledge / possession / biometric)' } },
      { key: 'd', text: { ar: 'تغيير كلمة المرور مرتين في السنة', en: 'Changing your password twice a year' } },
    ],
    answer: 'c',
    explanation: {
      ar: 'قوة MFA في الجمع بين فئات أدلة مختلفة — سرقة كلمة مرور وحدها لا تكفي المهاجم.',
      en: 'MFA’s strength comes from combining different factor categories — a stolen password alone is no longer enough for an attacker.',
    },
  },
  {
    id: 'cyber_trust_q5', domainId: 'cyber', format: 'true_false',
    q: { ar: 'يمكن لموقع تصيّد احتيالي أن يُظهر رمز القفل (HTTPS) في المتصفح.', en: 'A phishing site can show the padlock (HTTPS) in the browser.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'HTTPS يشفر الاتصال فقط؛ فموقع تصيّد قد يستخدم HTTPS أيضًا. القفل يحمي القناة لا نوايا الموقع.',
      en: 'HTTPS only encrypts the connection; phishing sites use it too. The padlock protects the channel, not the site’s intentions.',
    },
  },
  {
    id: 'cloud_infra_q4', domainId: 'cloud', format: 'mcq',
    q: { ar: 'في نموذج SaaS، ما الذي يديره مزود الخدمة مقارنة بـIaaS؟', en: 'In the SaaS model, what does the provider manage compared with IaaS?' },
    options: [
      { key: 'a', text: { ar: 'العتاد فقط', en: 'Hardware only' } },
      { key: 'b', text: { ar: 'العتاد والشبكة فقط، ويدير العميل كل ما فوقهما', en: 'Hardware and network only, with the customer running the rest' } },
      { key: 'c', text: { ar: 'لا شيء — العميل يدير كل الطبقات بنفسه كما في مركز بياناته', en: 'Nothing — the customer manages every layer, as in its own data centre' } },
      { key: 'd', text: { ar: 'كل الطبقات تقريبًا، بما فيها التطبيق نفسه', en: 'Almost every layer, including the application' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'في SaaS يدير المزود التطبيق كاملًا وما تحته؛ وفي IaaS يدير العميل نظام التشغيل وما فوقه.',
      en: 'In SaaS the provider manages the whole application stack; in IaaS the customer manages the guest OS and everything above it.',
    },
  },
  {
    id: 'cloud_infra_q5', domainId: 'cloud', format: 'true_false',
    q: { ar: 'نقل خدمة إلى السحابة يعني أن بياناتها ستُخزَّن خارج المملكة.', en: 'Moving a service to the cloud means its data will be stored outside the Kingdom.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'المناطق السحابية المحلية والسحابة السيادية تبقي البيانات داخل المملكة — الموقع قرار تصميمي وتعاقدي.',
      en: 'Local cloud regions and sovereign cloud keep data inside the Kingdom — residency is a design and contracting decision.',
    },
  },
  {
    id: 'service_design_q4', domainId: 'service-design', format: 'mcq',
    q: { ar: 'ما الغرض الأساسي من النموذج الأولي منخفض الدقة في تصميم الخدمات؟', en: 'What is the main purpose of a low-fidelity prototype in service design?' },
    options: [
      { key: 'a', text: { ar: 'إبهار أصحاب المصلحة بتصميم نهائي مصقول قبل اعتماد المشروع', en: 'Impressing stakeholders with a polished final design' } },
      { key: 'b', text: { ar: 'اختبار الفكرة مع المستخدمين بكلفة قليلة قبل البناء', en: 'Testing the idea cheaply with users before building' } },
      { key: 'c', text: { ar: 'توثيق المتطلبات التقنية المفصّلة لفريق التطوير قبل البدء', en: 'Documenting detailed technical requirements for the development team' } },
      { key: 'd', text: { ar: 'الاستغناء كليًا عن بحث المستخدمين والاكتفاء بافتراضات الفريق', en: "Replacing user research with the team's own assumptions" } },
    ],
    answer: 'b',
    explanation: {
      ar: 'النموذج منخفض الدقة أداة تعلم رخيصة وسريعة — يكشف سوء الفهم مبكرًا قبل كلفة البناء.',
      en: 'A low-fidelity prototype is a cheap, fast learning tool — it surfaces misunderstandings early, before build costs.',
    },
  },
  {
    id: 'service_design_q5', domainId: 'service-design', format: 'true_false',
    q: { ar: 'اختبار قابلية الاستخدام المفيد يتطلب مختبرًا متخصصًا وعشرات المستخدمين.', en: 'Useful usability testing requires a dedicated lab and dozens of users.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'خمسة مستخدمين يكشفون غالبية مشكلات قابلية الاستخدام الشائعة؛ وجلسة بسيطة بمكالمة فيديو تكفي للبدء.',
      en: 'Five users surface most common usability problems; a simple video-call session is enough to start.',
    },
  },
  {
    id: 'policy_gov_q4', domainId: 'policy', format: 'mcq',
    q: { ar: 'ما مبدأ «مرة واحدة فقط» (Once-Only) في الحكومة الرقمية؟', en: 'What is the “once-only” principle in digital government?' },
    options: [
      { key: 'a', text: { ar: 'لا تطلب الجهة من المواطن بيانات لدى جهة حكومية أخرى', en: 'Agencies do not ask citizens for data another agency already holds' } },
      { key: 'b', text: { ar: 'يقدّم المواطن كل وثيقة رسمية مرة واحدة فقط طوال حياته', en: 'Citizens submit each official document only once in their whole lifetime' } },
      { key: 'c', text: { ar: 'كل خدمة تُستخدم مرة واحدة فقط', en: 'Each service is used only once' } },
      { key: 'd', text: { ar: 'نشر البيانات مرة واحدة في السنة', en: 'Publishing data once a year' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'المبدأ يعني إعادة استخدام البيانات بين الجهات بموافقة — فلا يُطلب من المواطن ما تملكه الحكومة سلفًا.',
      en: 'The principle means reusing data across agencies with consent — citizens are never asked for what government already holds.',
    },
  },
  {
    id: 'policy_gov_q5', domainId: 'policy', format: 'true_false',
    q: { ar: 'البيانات المفتوحة تشمل البيانات الشخصية ما دامت منشورة بصيغة مقروءة آليًا.', en: 'Open data includes personal data as long as it is published in a machine-readable format.' },
    options: [
      { key: 'a', text: { ar: 'خطأ', en: 'False' } },
      { key: 'b', text: { ar: 'صحيح', en: 'True' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'البيانات المفتوحة تستثني البيانات الشخصية والسرية بموجب أنظمة حماية البيانات — الصيغة لا علاقة لها بجواز النشر.',
      en: 'Open data excludes personal and confidential data under data-protection law — format has nothing to do with publishability.',
    },
  },
  {
    id: 'agile_delivery_q4', domainId: 'agile', format: 'mcq',
    q: { ar: 'ما الغرض الأساسي من اجتماع الاسترجاع (Retrospective)؟', en: 'What is the main purpose of a retrospective?' },
    options: [
      { key: 'a', text: { ar: 'عرض الجزء المنجز من المنتج على أصحاب المصلحة', en: 'Demoing the finished increment to stakeholders for feedback' } },
      { key: 'b', text: { ar: 'تخطيط عمل السبرنت القادم بالتفصيل', en: 'Planning the next sprint in detail' } },
      { key: 'c', text: { ar: 'تأمل طريقة عمل الفريق وتحسينها', en: 'Reflecting on how the team works and improving it' } },
      { key: 'd', text: { ar: 'تقييم أداء كل فرد في الفريق لصالح المدير', en: "Evaluating each member's individual performance for the manager" } },
    ],
    answer: 'c',
    explanation: {
      ar: 'الاسترجاع يحسّن طريقة العمل نفسها؛ أما عرض المنتج فمكانه مراجعة السبرنت (Review)، والتخطيط مكانه تخطيط السبرنت (Planning) — فعاليات مختلفة.',
      en: 'The retrospective improves the way of working itself; demos belong to the review and planning to planning — different events.',
    },
  },
  {
    id: 'agile_delivery_q5', domainId: 'agile', format: 'true_false',
    q: { ar: 'في التسليم الرشيق، يُقاس نجاح المنتج باكتمال قائمة المهام المتفق عليها مسبقًا.', en: 'In agile delivery, product success is measured by completing the pre-agreed task list.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'النجاح يُقاس بالنتائج والأثر على المستخدمين (Outcomes) لا بكمية المخرجات المنجزة (Outputs).',
      en: 'Success is measured by user outcomes and impact, not by the volume of completed outputs.',
    },
  },
  {
    id: 'emerging_tech_q4', domainId: 'emerging', format: 'mcq',
    q: { ar: 'ما «التوأم الرقمي»؟', en: 'What is a digital twin?' },
    options: [
      { key: 'a', text: { ar: 'نسخة احتياطية من قاعدة البيانات', en: 'A backup copy of a database' } },
      { key: 'b', text: { ar: 'حساب مزيف على الشبكات الاجتماعية', en: 'A fake social-media account' } },
      { key: 'c', text: { ar: 'جهازان ماديان متطابقان يعملان بالتناوب كنسخة احتياطية', en: 'Two identical physical devices that run in turn as backups' } },
      { key: 'd', text: { ar: 'نموذج رقمي حي لأصل أو نظام مادي يتغذى ببياناته الفعلية', en: 'A live digital model of a physical asset or system fed by its real data' } },
    ],
    answer: 'd',
    explanation: {
      ar: 'التوأم الرقمي يعكس حالة الأصل المادي لحظيًا، ما يتيح المحاكاة والتنبؤ قبل أي تغيير مادي.',
      en: 'A digital twin mirrors the physical asset’s state in near real time, enabling simulation and prediction before any physical change.',
    },
  },
  {
    id: 'emerging_tech_q5', domainId: 'emerging', format: 'true_false',
    q: { ar: 'الحوسبة الطرفية (Edge) تعني معالجة البيانات قرب مصدرها بدل إرسالها كاملة إلى السحابة.', en: 'Edge computing means processing data near its source instead of sending it all to the cloud.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'a',
    explanation: {
      ar: 'المعالجة الطرفية تقلل الكمون وحركة البيانات — أساسية للخدمات اللحظية كالمرور الذكي.',
      en: 'Edge processing cuts latency and data movement — essential for real-time services like smart traffic.',
    },
  },
  {
    id: 'leadership_collab_q4', domainId: 'leadership', format: 'mcq',
    q: { ar: 'ما الخطوة الأولى الأصح في إدارة تغيير لمبادرة رقمية؟', en: 'What is the right first step in managing change for a digital initiative?' },
    options: [
      { key: 'a', text: { ar: 'شراء الأداة الجديدة فورًا ليبدأ التغيير', en: 'Buying the new tool immediately so the change can start' } },
      { key: 'b', text: { ar: 'فهم من يتأثر وما الذي يتغير لهم', en: 'Mapping who is affected and what changes for them' } },
      { key: 'c', text: { ar: 'إرسال تعميم إلزامي يعلن التغيير لجميع الموظفين', en: 'Sending a mandatory circular announcing the change to all staff' } },
      { key: 'd', text: { ar: 'انتظار اكتمال التطوير التقني قبل إبلاغ أي أحد', en: 'Waiting for technical development to finish before telling anyone' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'خريطة المتأثرين واحتياجاتهم أساس أي خطة تغيير ناجحة — الأدوات والتعاميم لاحقة لا بادئة.',
      en: 'A map of who is affected and their needs is the foundation of any successful change plan — tools and circulars come later.',
    },
  },
  {
    id: 'leadership_collab_q5', domainId: 'leadership', format: 'true_false',
    q: { ar: 'العمل بانفتاح (Working in the open) يعني نشر كل شيء بما فيه البيانات الحساسة للمشروع.', en: 'Working in the open means publishing everything, including a project’s sensitive data.' },
    options: [
      { key: 'a', text: { ar: 'صحيح', en: 'True' } },
      { key: 'b', text: { ar: 'خطأ', en: 'False' } },
    ],
    answer: 'b',
    explanation: {
      ar: 'الانفتاح يعني مشاركة التقدم والدروس والقرارات — مع حماية البيانات الحساسة والشخصية صراحة.',
      en: 'Openness means sharing progress, lessons and decisions — while explicitly protecting sensitive and personal data.',
    },
  },
]

export const questionsForDomain = (domainId: string): CalibrationQuestion[] =>
  calibrationQuestions.filter((q) => q.domainId === domainId)

// ── Learning routes for government employees ────────────────────────────────
// Only providers relevant to civil servants. Student / job-seeker / private-sector
// schemes (graduate on-the-job training, HRDF certificate reimbursement, the
// government job-application platform) were removed in v9: this is a development
// tool for employees, never linked to recruitment, appraisal or promotion.

export interface NationalProgram {
  id: string
  name: L
  description: L
  /** omitted for internal routes (e.g. your entity's own L&D unit) */
  url?: string
}

export const nationalPrograms: NationalProgram[] = [
  {
    id: 'sda',
    name: { ar: 'الأكاديمية السعودية الرقمية', en: 'Saudi Digital Academy' },
    description: {
      ar: 'برامج ومعسكرات في المهارات الرقمية والقيادة الرقمية؛ تحقق من شروط القبول لكل برنامج قبل التسجيل.',
      en: 'Programmes and camps in digital skills and digital leadership; check each programme’s entry conditions before enrolling.',
    },
    url: 'https://sda.edu.sa',
  },
  {
    id: 'dga-qudratak',
    name: { ar: 'برنامج قدراتك — هيئة الحكومة الرقمية', en: 'Digital Government Authority — «برنامج قدراتك»' },
    description: {
      ar: 'برنامج لتنمية قدرات الحكومة الرقمية موجّه إلى الجهات الحكومية وموظفيها؛ يُطلب عبر جهتك.',
      en: 'A digital-government capacity programme for government entities and their staff; requested through your entity.',
    },
    url: 'https://my.gov.sa/en/content/179',
  },
  {
    id: 'entity-ld',
    name: { ar: 'وحدة التدريب والتطوير في جهتك', en: 'Your entity’s training and development unit' },
    description: {
      ar: 'اعرض عليها ورقة حوار التطوير: هي الطريق المعتاد لطلب وقت التعلم وتمويل الدورات والشهادات ضمن خطة جهتك.',
      en: 'Show them your development conversation sheet: it is the usual route to request learning time and funding for courses and certificates within your entity’s plan.',
    },
  },
]
