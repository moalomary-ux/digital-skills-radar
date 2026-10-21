import type { L } from '../types'

/**
 * «5 تحولات في العمل الحكومي 2026–2030» — the spine of the leader brief and of
 * the home-page strip. Qualitative only: every figure lives in a registered
 * claim (`claimId`, see src/data/claims/leaders.ts) and is rendered through <Claim>.
 *
 * Independent reading — not an official position of any entity. Reviewed 2026-10-22.
 */

export interface LeaderShift {
  id: string
  /** short title (home strip, print header) */
  title: L
  /** what changes in the work — two short lines */
  change: L
  /** the skills the shift asks for, in plain words */
  requires: L
  /** primary skill domain (src/data/domains.ts) */
  domainId: string
  /** secondary domains touched by the shift */
  relatedDomainIds: string[]
  /** «القرار المطلوب منك هذا العام» — one line */
  decision: L
  /** the sourced signal; its sentence and figure come from the claim */
  claimId: string
  /** «ما الذي لا يتغير» */
  unchanged: L
}

export const SHIFTS_REVIEWED_ON = '2026-10-22'

export const shifts: LeaderShift[] = [
  {
    id: 'genai-casework',
    title: { ar: 'الذكاء الاصطناعي التوليدي في العمل اليومي', en: 'Generative AI in everyday casework' },
    change: {
      ar: 'تبدأ مسودات المراسلات والتقارير والردود على المستفيدين من أداة ذكاء اصطناعي توليدي، وينتقل وقت الموظف من الكتابة إلى المراجعة والتحقق. يصبح السؤال: من راجع المخرج، وعلى أي بيانات اعتمد؟',
      en: 'Drafts of letters, reports and replies to beneficiaries start in a generative AI tool, and staff time moves from writing to reviewing and checking. The question becomes: who reviewed the output, and what data did it rely on?',
    },
    requires: {
      ar: 'استخدام الذكاء الاصطناعي التوليدي بمسؤولية: صياغة الطلب، والتحقق من المخرج، وحماية البيانات المدخلة.',
      en: 'Responsible use of generative AI: framing the request, checking the output and protecting the data put in.',
    },
    domainId: 'ai-data',
    relatedDomainIds: ['cyber'],
    decision: {
      ar: 'حدّد أين يُسمح باستخدام الذكاء الاصطناعي التوليدي في جهتك وأين يُمنع، ومن يراجع كل مخرج قبل أن يغادر الجهة.',
      en: 'Decide where generative AI may and may not be used in your entity, and who reviews every output before it leaves.',
    },
    claimId: 'leaders-ilo-2025-exposure',
    unchanged: {
      ar: 'المسؤولية عن القرار والتوقيع عليه تبقى على الموظف وجهته، لا على الأداة.',
      en: 'Accountability for a decision, and the signature on it, stays with the employee and the entity, not the tool.',
    },
  },
  {
    id: 'data-decisions',
    title: { ar: 'قرارات مبنية على البيانات', en: 'Decisions based on data' },
    change: {
      ar: 'يُنتظر من كل إدارة أن تسند قراراتها إلى بيانات موثوقة: لوحات متابعة، ومؤشرات منشورة، وبيانات مشتركة بين الجهات. القرار بلا دليل يصبح أصعب في الدفاع عنه.',
      en: 'Every department is expected to back its decisions with trusted data: dashboards, published indicators and data shared across entities. A decision without evidence becomes harder to defend.',
    },
    requires: {
      ar: 'قراءة البيانات وحوكمتها: معرفة مصدر الرقم وجودته وحدوده، ووجود مالك لكل مجموعة بيانات.',
      en: 'Reading and governing data: knowing where a figure comes from, its quality and limits, and having an owner for every dataset.',
    },
    domainId: 'ai-data',
    relatedDomainIds: ['leadership'],
    decision: {
      ar: 'سمِّ مالكاً لكل مجموعة بيانات تُبنى عليها قرارات جهتك، واطلب أن يُذكر مصدر كل رقم في عروض القيادة.',
      en: 'Name an owner for every dataset your entity’s decisions rely on, and ask that every figure in leadership briefings cites its source.',
    },
    claimId: 'leaders-oecd-data-driven',
    unchanged: {
      ar: 'البيانات تُضيء القرار ولا تتخذه؛ الموازنة بين المصالح والقيم تبقى مسؤولية القائد.',
      en: 'Data informs a decision but does not make it; weighing interests and values stays the leader’s job.',
    },
  },
  {
    id: 'measured-services',
    title: { ar: 'خدمات تُقاس وتُنشر نتائجها', en: 'Services that are measured and published' },
    change: {
      ar: 'تُقارَن الخدمات الحكومية علناً بمؤشرات رضا وسهولة ووقت إنجاز، داخلياً ودولياً. تجربة المستفيد صارت معياراً يُحاسَب عليه مالك الخدمة.',
      en: 'Government services are compared in public on satisfaction, ease and time to complete, at home and internationally. The beneficiary’s experience has become a standard the service owner answers for.',
    },
    requires: {
      ar: 'تصميم الخدمات حول المستفيد: بحث المستخدمين، ورسم الرحلة، وإمكانية الوصول، وقياس نجاح الخدمة بعد إطلاقها.',
      en: 'Designing services around the beneficiary: user research, journey mapping, accessibility, and measuring a service’s success after launch.',
    },
    domainId: 'service-design',
    relatedDomainIds: ['agile'],
    decision: {
      ar: 'اختر 3 خدمات أساسية، وسمِّ لكل منها مالكاً ومؤشراً منشوراً تراجعه معه كل ربع سنة.',
      en: 'Pick 3 core services, and give each a named owner and a published indicator you review with them every quarter.',
    },
    claimId: 'leaders-un-egov-2024',
    unchanged: {
      ar: 'الخدمة الحكومية حق للجميع؛ من لا يستطيع استخدام القناة الرقمية يبقى له بديل مكافئ.',
      en: 'A government service is owed to everyone; people who cannot use the digital channel keep an equivalent alternative.',
    },
  },
  {
    id: 'cyber-privacy-duty',
    title: { ar: 'الأمن السيبراني والخصوصية واجب نظامي', en: 'Cybersecurity and privacy as a legal duty' },
    change: {
      ar: 'لم تعد حماية البيانات والأنظمة شأناً تقنياً يُترك لإدارة واحدة؛ صارت التزاماً نظامياً تُسأل عنه القيادة. كل خدمة جديدة تحتاج تقييم خصوصية وضوابط أمن قبل إطلاقها.',
      en: 'Protecting data and systems is no longer a technical matter left to one department; it is a legal duty leaders answer for. Every new service needs a privacy assessment and security controls before launch.',
    },
    requires: {
      ar: 'الوعي الأمني، والخصوصية وحماية البيانات الشخصية، والأمن منذ التصميم، والوعي بالتشريعات الرقمية.',
      en: 'Security awareness, privacy and personal data protection, security by design, and awareness of digital legislation.',
    },
    domainId: 'cyber',
    relatedDomainIds: ['policy'],
    decision: {
      ar: 'اطلب سجلاً بالخدمات التي تعالج بيانات شخصية، ومن راجع امتثال كل منها، وما بقي مفتوحاً وموعد إغلاقه.',
      en: 'Ask for a register of services that process personal data, who reviewed each for compliance, and what remains open with a closing date.',
    },
    claimId: 'leaders-pdpl-enforcement',
    unchanged: {
      ar: 'الثقة تُبنى بالصراحة: تسمية المخاطر التي لم تُغلق بعد أفضل من طمأنة عامة.',
      en: 'Trust is built on candour: naming the risks not yet closed beats general reassurance.',
    },
  },
  {
    id: 'product-delivery',
    title: { ar: 'العمل بالمنتج لا بالمشروع', en: 'Product-based delivery' },
    change: {
      ar: 'تنتقل الجهات من مشاريع تنتهي بالإطلاق إلى منتجات رقمية لها فريق ثابت يحسّنها باستمرار. يُقاس التقدم بما يعمل فعلاً لدى المستفيد، لا بنسب إنجاز تقديرية.',
      en: 'Entities move from projects that end at launch to digital products with a stable team that keeps improving them. Progress is judged by what actually works for the beneficiary, not by estimated completion percentages.',
    },
    requires: {
      ar: 'طرق العمل الرشيقة، ودورة حياة المنتج، وقياس المنافع، وشراء تقني يدفع مقابل النتائج.',
      en: 'Agile ways of working, the product lifecycle, benefits measurement, and technology procurement that pays for outcomes.',
    },
    domainId: 'agile',
    relatedDomainIds: ['policy'],
    decision: {
      ar: 'حوّل مشروعاً رقمياً واحداً هذا العام إلى منتج بفريق ثابت، وشروط توقف معلنة، ومؤشر منفعة يُقاس بعد الإطلاق.',
      en: 'Turn one digital project this year into a product with a stable team, declared stop conditions and a benefit indicator measured after launch.',
    },
    claimId: 'leaders-oecd-user-driven',
    unchanged: {
      ar: 'الانضباط المالي والمساءلة عن المال العام يبقيان كما هما؛ يتغير توقيت القرار لا معاييره.',
      en: 'Financial discipline and accountability for public money stay the same; what changes is when decisions are made, not their standards.',
    },
  },
]

export const shiftById = (id: string): LeaderShift | undefined => shifts.find((s) => s.id === id)
