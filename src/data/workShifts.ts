import type { L } from './types'

/**
 * «خريطة تحوّل العمل الحكومي» — how the tasks of 8 government job families
 * change between 2026 and 2030, in four qualitative lanes:
 *   تُؤتمت · تُعزَّز · تنشأ · تبقى إنسانية
 *
 * Qualitative only: no automation percentages. Each family carries a sourced
 * signal (`claimId`) and the lane content is marked «تقدير تحريري»
 * (claim 'leaders-editorial-work-map'). Mapping to ISCO groups is approximate.
 */

export type Lane = 'automated' | 'augmented' | 'emerging' | 'human'

export const laneOrder: Lane[] = ['automated', 'augmented', 'emerging', 'human']

export const laneMeta: Record<Lane, { name: L; hint: L }> = {
  automated: {
    name: { ar: 'تُؤتمت', en: 'Automated' },
    hint: {
      ar: 'مهام روتينية يُرجَّح أن تتولاها الأنظمة، مع مراجعة بشرية.',
      en: 'Routine tasks systems are likely to take over, with human review.',
    },
  },
  augmented: {
    name: { ar: 'تُعزَّز', en: 'Augmented' },
    hint: {
      ar: 'مهام يبقى فيها الموظف مسؤولاً، وتسرّعها الأدوات.',
      en: 'Tasks where the employee stays responsible and tools speed the work.',
    },
  },
  emerging: {
    name: { ar: 'تنشأ', en: 'New' },
    hint: {
      ar: 'مهام جديدة يخلقها التحول نفسه.',
      en: 'New tasks the transformation itself creates.',
    },
  },
  human: {
    name: { ar: 'تبقى إنسانية', en: 'Stays human' },
    hint: {
      ar: 'مهام تقوم على الحكم والعلاقة والمساءلة.',
      en: 'Tasks built on judgment, relationships and accountability.',
    },
  },
}

export interface RisingSkill {
  skill: L
  domainId: string
}

export interface WorkFamily {
  id: string
  /** a general function name, never one entity's exact title */
  name: L
  /**
   * Titles entities use for the same function («ومن في حكمه»; owner directive 2026-10-22,
   * audit question 9): the family keeps its general name and lists its equivalents.
   */
  equivalents: L[]
  /** how the family's work moves, in one line */
  summary: L
  lanes: Record<Lane, L[]>
  rising: RisingSkill[]
  /** digital roles in the role library this family works with or can grow into */
  relatedRoleIds: string[]
  /** «ماذا يفعل المدير الآن» — 3 actions */
  managerActions: L[]
  /** sourced signal shown with its confidence badge */
  claimId: string
}

export const EDITORIAL_WORK_MAP_CLAIM = 'leaders-editorial-work-map'

export const workFamilies: WorkFamily[] = [
  {
    id: 'policy-analyst',
    name: { ar: 'محلل السياسات', en: 'Policy analyst' },
    equivalents: [
      { ar: 'أخصائي السياسات', en: 'Policy specialist' },
      { ar: 'باحث السياسات العامة', en: 'Public policy researcher' },
      { ar: 'أخصائي الدراسات والتخطيط', en: 'Studies and planning specialist' },
    ],
    summary: {
      ar: 'ينتقل من جمع المعلومات وتلخيصها إلى اختبار الخيارات بالبيانات وتقدير نتائجها على المستفيدين.',
      en: 'Moves from gathering and summarising information to testing options with data and weighing their consequences for beneficiaries.',
    },
    lanes: {
      automated: [
        { ar: 'تجميع المراجع والتجارب الدولية في ملخص أولي', en: 'Compiling references and international practice into a first summary' },
        { ar: 'إعداد ملخص أولي للدراسات الطويلة يطابقه المحلل مع الأصل', en: 'Producing a first-pass summary of long studies that the analyst checks against the original' },
        { ar: 'إعداد جداول المقارنة الأولية بين الدول والجهات', en: 'Drafting first-pass comparison tables across countries and entities' },
      ],
      augmented: [
        { ar: 'تحليل البيانات لدعم خيارات السياسة', en: 'Analysing data to support policy options' },
        { ar: 'صياغة مسودات أوراق السياسات ومراجعتها', en: 'Drafting and revising policy papers' },
        { ar: 'رصد تفاعل الجمهور مع المقترحات', en: 'Tracking public response to proposals' },
        { ar: 'مراجعة اتساق المقترح مع الأنظمة القائمة', en: 'Checking a proposal against existing regulations' },
      ],
      emerging: [
        { ar: 'التحقق من مخرجات الذكاء الاصطناعي التوليدي قبل دخولها ورقة سياسة', en: 'Checking generative AI output before it enters a policy paper' },
        { ar: 'تصميم تجارب صغيرة لاختبار السياسة قبل تعميمها', en: 'Designing small pilots to test a policy before scaling it' },
        { ar: 'تقييم الخوارزميات التي تدعم قرارات عامة', en: 'Assessing algorithms that support public decisions' },
      ],
      human: [
        { ar: 'الموازنة بين مصالح متعارضة واقتراح التسوية', en: 'Balancing competing interests and proposing a compromise' },
        { ar: 'التشاور مع أصحاب المصلحة وبناء التوافق', en: 'Consulting stakeholders and building consensus' },
        { ar: 'الحكم على ما هو عادل ومقبول اجتماعياً', en: 'Judging what is fair and socially acceptable' },
      ],
    },
    rising: [
      { skill: { ar: 'قراءة البيانات وحدودها', en: 'Reading data and its limits' }, domainId: 'ai-data' },
      { skill: { ar: 'الوعي بالتشريعات الرقمية', en: 'Digital legislation awareness' }, domainId: 'policy' },
      { skill: { ar: 'سرد القصص بالبيانات', en: 'Storytelling with data' }, domainId: 'leadership' },
    ],
    relatedRoleIds: ['digital_policy_advisor', 'ai_ethics_officer', 'performance_analyst'],
    managerActions: [
      { ar: 'اطلب أن تذكر كل ورقة سياسة مصدر كل رقم ومن تحقق منه.', en: 'Require every policy paper to cite the source of each figure and who checked it.' },
      { ar: 'خصص للمحللين وقتاً للتدرب على تحليل البيانات بأدوات الجهة.', en: 'Give analysts time to practise data analysis with the entity’s own tools.' },
      { ar: 'جرّب سياسة واحدة هذا العام على نطاق صغير قبل تعميمها.', en: 'Pilot one policy this year at small scale before rolling it out.' },
    ],
    claimId: 'leaders-oecd-data-driven',
  },
  {
    id: 'procurement',
    name: { ar: 'أخصائي المشتريات', en: 'Procurement specialist' },
    equivalents: [
      { ar: 'مسؤول المشتريات', en: 'Procurement officer' },
      { ar: 'أخصائي المنافسات والمشتريات', en: 'Tenders and procurement specialist' },
      { ar: 'أخصائي العقود', en: 'Contracts specialist' },
    ],
    summary: {
      ar: 'ينتقل من إدارة إجراءات الطرح إلى شراء النتائج: عقود تقنية بشروط أمن وخروج ومؤشرات خدمة.',
      en: 'Moves from running tender procedures to buying outcomes: technology contracts with security, exit and service-level terms.',
    },
    lanes: {
      automated: [
        { ar: 'إعداد مسودات كراسات الشروط من نماذج قياسية', en: 'Drafting tender documents from standard templates' },
        { ar: 'المطابقة الأولية للعروض مع المتطلبات الإلزامية', en: 'First-pass checking of bids against mandatory requirements' },
        { ar: 'متابعة مواعيد العقود والتجديد والتنبيه بها', en: 'Tracking contract and renewal dates and sending alerts' },
        { ar: 'تصنيف المشتريات وتجميع بيانات الإنفاق', en: 'Classifying purchases and compiling spend data' },
      ],
      augmented: [
        { ar: 'تحليل السوق والموردين قبل الطرح', en: 'Analysing the market and suppliers before tendering' },
        { ar: 'تقييم العروض الفنية والمالية', en: 'Evaluating technical and financial bids' },
        { ar: 'متابعة أداء الموردين بمؤشرات الخدمة', en: 'Monitoring supplier performance against service levels' },
      ],
      emerging: [
        { ar: 'كتابة شروط الأمن السيبراني وحماية البيانات في العقود التقنية', en: 'Writing cybersecurity and data-protection terms into technology contracts' },
        { ar: 'تقييم موردي الذكاء الاصطناعي: البيانات والنموذج والمسؤولية', en: 'Assessing AI suppliers: data, model and liability' },
        { ar: 'تصميم شروط الخروج ونقل البيانات لتجنب الارتهان لمورد واحد', en: 'Designing exit and data-portability terms to avoid lock-in to one supplier' },
      ],
      human: [
        { ar: 'التفاوض مع الموردين على القيمة لا السعر وحده', en: 'Negotiating with suppliers on value, not price alone' },
        { ar: 'الحكم في حالات تعارض المصالح والنزاهة', en: 'Judging conflict-of-interest and integrity cases' },
        { ar: 'إدارة العلاقة مع المورد عند التعثر', en: 'Managing the supplier relationship when delivery falters' },
      ],
    },
    rising: [
      { skill: { ar: 'المشتريات الرقمية', en: 'Digital procurement' }, domainId: 'policy' },
      { skill: { ar: 'استمرارية الأعمال وإدارة الموردين', en: 'Business continuity & supplier management' }, domainId: 'cloud' },
      { skill: { ar: 'متطلبات الأمن والخصوصية في العقود', en: 'Security and privacy requirements in contracts' }, domainId: 'cyber' },
    ],
    relatedRoleIds: ['cloud_architect', 'security_architect', 'delivery_manager'],
    managerActions: [
      { ar: 'أضف مختصاً تقنياً ومختص أمن إلى لجنة تقييم كل عقد تقني كبير.', en: 'Add a technology expert and a security expert to the evaluation panel of every large technology contract.' },
      { ar: 'اشترط بند خروج ونقل بيانات في كل عقد سحابي جديد.', en: 'Require an exit and data-portability clause in every new cloud contract.' },
      { ar: 'درّب فريق المشتريات على تقييم عروض الذكاء الاصطناعي.', en: 'Train the procurement team to evaluate AI bids.' },
    ],
    claimId: 'leaders-nca-ecc-third-party',
  },
  {
    id: 'hr',
    name: { ar: 'أخصائي الموارد البشرية', en: 'HR officer' },
    equivalents: [
      { ar: 'أخصائي شؤون الموظفين', en: 'Personnel affairs specialist' },
      { ar: 'أخصائي التطوير الوظيفي والتدريب', en: 'Career development and training specialist' },
      { ar: 'شريك أعمال الموارد البشرية', en: 'HR business partner' },
    ],
    summary: {
      ar: 'ينتقل من معالجة المعاملات إلى تخطيط المهارات: من يحتاج ماذا، ومتى، ولماذا.',
      en: 'Moves from processing transactions to planning skills: who needs what, when and why.',
    },
    lanes: {
      automated: [
        { ar: 'معالجة الإجازات والانتدابات والمعاملات الروتينية', en: 'Processing leave, assignments and routine transactions' },
        { ar: 'الفرز الأولي للسير الذاتية مقابل شروط الوظيفة', en: 'First-pass screening of CVs against job requirements' },
        { ar: 'الرد على الاستفسارات المتكررة للموظفين', en: 'Answering employees’ frequent questions' },
        { ar: 'إعداد التقارير الدورية لأعداد الموظفين', en: 'Preparing periodic headcount reports' },
      ],
      augmented: [
        { ar: 'تحليل احتياجات التدريب من بيانات الجهة', en: 'Analysing training needs from the entity’s data' },
        { ar: 'كتابة الأوصاف الوظيفية وتحديثها', en: 'Writing and updating job descriptions' },
        { ar: 'تصميم برامج التطوير وربطها بمهام العمل', en: 'Designing development programmes tied to work tasks' },
      ],
      emerging: [
        { ar: 'بناء خريطة مهارات الجهة وتحديثها سنوياً', en: 'Building the entity’s skills map and updating it yearly' },
        { ar: 'إعادة تصميم الوظائف التي تتغير مهامها بالذكاء الاصطناعي', en: 'Redesigning jobs whose tasks change with AI' },
        { ar: 'مراجعة عدالة أدوات التوظيف الآلية', en: 'Reviewing the fairness of automated hiring tools' },
      ],
      human: [
        { ar: 'حوارات التطوير مع الموظفين', en: 'Development conversations with staff' },
        { ar: 'معالجة التظلمات والحالات الحساسة', en: 'Handling grievances and sensitive cases' },
        { ar: 'بناء ثقافة تعلّم تتقبّل التغيير', en: 'Building a learning culture that welcomes change' },
      ],
    },
    rising: [
      { skill: { ar: 'إدارة التغيير', en: 'Change management' }, domainId: 'leadership' },
      { skill: { ar: 'الإلمام بالبيانات', en: 'Data literacy' }, domainId: 'ai-data' },
      { skill: { ar: 'أخلاقيات الذكاء الاصطناعي واستخدامه المسؤول', en: 'AI ethics & responsible use' }, domainId: 'ai-data' },
    ],
    relatedRoleIds: ['performance_analyst', 'ai_ethics_officer', 'digital_transformation_lead'],
    managerActions: [
      { ar: 'حدد الوظائف الثلاث الأكثر تغيراً في جهتك، وابدأ لها خطة إعادة تأهيل.', en: 'Identify the three jobs changing most in your entity, and start a reskilling plan for them.' },
      { ar: 'افصل كتابةً بين نتائج تقييم المهارات وتقييم الأداء والترقية.', en: 'Separate skills-assessment results from performance appraisal and promotion, in writing.' },
      { ar: 'اشترط مراجعة بشرية لأي قرار توظيف تدعمه أداة آلية.', en: 'Require human review of any hiring decision supported by an automated tool.' },
    ],
    claimId: 'leaders-wef-2025-skills-change',
  },
  {
    id: 'beneficiary-service',
    name: { ar: 'موظف خدمة المستفيدين', en: 'Beneficiary service agent' },
    equivalents: [
      { ar: 'أخصائي خدمة العملاء', en: 'Customer service specialist' },
      { ar: 'موظف مركز الاتصال', en: 'Contact centre agent' },
      { ar: 'موظف استقبال المراجعين', en: 'Front-desk service officer' },
    ],
    summary: {
      ar: 'ينتقل من الإجابة عن الأسئلة المتكررة إلى حل الحالات المعقدة والحساسة التي لا تحلها القنوات الآلية.',
      en: 'Moves from answering repeat questions to resolving the complex and sensitive cases automated channels cannot.',
    },
    lanes: {
      automated: [
        { ar: 'الإجابة عن الأسئلة المتكررة عبر المساعد الآلي', en: 'Answering repeat questions through a virtual assistant' },
        { ar: 'تسجيل الطلبات وتصنيفها وتوجيهها', en: 'Logging, classifying and routing requests' },
        { ar: 'إرسال تحديثات حالة الطلب للمستفيد', en: 'Sending request-status updates to beneficiaries' },
        { ar: 'تعبئة النماذج من بيانات موجودة لدى الجهة', en: 'Pre-filling forms from data the entity already holds' },
      ],
      augmented: [
        { ar: 'اقتراح الردود المناسبة أثناء المحادثة', en: 'Suggested replies during a conversation' },
        { ar: 'البحث في الأنظمة والإجراءات أثناء خدمة المستفيد', en: 'Searching rules and procedures while serving a beneficiary' },
        { ar: 'تلخيص سجل تعاملات المستفيد قبل الرد', en: 'Summarising a beneficiary’s history before responding' },
      ],
      emerging: [
        { ar: 'مراجعة ردود المساعد الآلي وتصحيح أخطائها', en: 'Reviewing and correcting the virtual assistant’s answers' },
        { ar: 'تحويل الشكاوى المتكررة إلى مقترحات لتحسين الخدمة', en: 'Turning recurring complaints into service-improvement proposals' },
        { ar: 'مساعدة المستفيدين الأقل إلماماً بالتقنية على استخدام القنوات الرقمية', en: 'Helping less digitally confident beneficiaries use digital channels' },
      ],
      human: [
        { ar: 'التعامل مع المستفيد الغاضب أو الذي يمر بظرف صعب', en: 'Handling an upset beneficiary or one in a difficult situation' },
        { ar: 'الحكم في الحالات الاستثنائية خارج القواعد', en: 'Judging exceptional cases outside the rules' },
        { ar: 'حماية خصوصية المستفيد عند الطلبات غير المعتادة', en: 'Protecting a beneficiary’s privacy on unusual requests' },
      ],
    },
    rising: [
      { skill: { ar: 'تصميم الخدمات ورسم رحلة المستفيد', en: 'Service design & beneficiary journey mapping' }, domainId: 'service-design' },
      { skill: { ar: 'الشمولية الرقمية', en: 'Digital inclusion' }, domainId: 'policy' },
      { skill: { ar: 'الخصوصية وحماية البيانات الشخصية', en: 'Privacy & personal data protection' }, domainId: 'cyber' },
    ],
    relatedRoleIds: ['service_designer', 'digital_inclusion_officer', 'content_designer'],
    managerActions: [
      { ar: 'اجعل أسباب التواصل المتكررة مؤشراً شهرياً يصل إلى مالك الخدمة.', en: 'Make the top reasons for contact a monthly indicator that reaches the service owner.' },
      { ar: 'أبقِ قناة بشرية مكافئة لمن لا يستطيع استخدام القناة الرقمية.', en: 'Keep an equivalent human channel for those who cannot use the digital one.' },
      { ar: 'درّب الفريق على مراجعة ردود المساعد الآلي قبل توسيعه.', en: 'Train the team to review the virtual assistant’s answers before expanding it.' },
    ],
    claimId: 'leaders-ilo-2025-clerical',
  },
  {
    id: 'legal',
    name: { ar: 'المستشار القانوني', en: 'Legal advisor' },
    equivalents: [
      { ar: 'أخصائي قانوني', en: 'Legal specialist' },
      { ar: 'الباحث القانوني', en: 'Legal researcher' },
      { ar: 'المحامي', en: 'Lawyer' },
    ],
    summary: {
      ar: 'ينتقل من البحث في النصوص إلى تقدير المخاطر النظامية لاستخدام البيانات والذكاء الاصطناعي.',
      en: 'Moves from searching legal texts to judging the regulatory risks of using data and AI.',
    },
    lanes: {
      automated: [
        { ar: 'تتبّع تحديثات الأنظمة واللوائح والتنبيه بها', en: 'Tracking updates to laws and regulations and sending alerts' },
        { ar: 'مقارنة نسخ العقود وإبراز الفروق', en: 'Comparing contract versions and highlighting changes' },
        { ar: 'إعداد المسودات الأولى للمذكرات والعقود القياسية', en: 'Preparing first drafts of memos and standard contracts' },
      ],
      augmented: [
        { ar: 'مراجعة العقود واستخراج البنود عالية المخاطر', en: 'Reviewing contracts and flagging high-risk clauses' },
        { ar: 'البحث في الأنظمة واللوائح والسوابق مع التحقق من كل إحالة في مصدرها', en: 'Searching laws, regulations and precedents, checking every citation against its source' },
        { ar: 'تحليل انعكاس الأنظمة الجديدة على إجراءات الجهة', en: 'Analysing how new regulations affect the entity’s procedures' },
        { ar: 'إعداد الردود النظامية على الاستفسارات', en: 'Preparing legal responses to enquiries' },
      ],
      emerging: [
        { ar: 'تقييم الامتثال لنظام حماية البيانات الشخصية في كل خدمة جديدة', en: 'Assessing compliance with the Personal Data Protection Law for every new service' },
        { ar: 'صياغة بنود المسؤولية والملكية الفكرية في عقود الذكاء الاصطناعي', en: 'Drafting liability and intellectual-property clauses in AI contracts' },
        { ar: 'مراجعة القرارات المؤتمتة من حيث الشفافية وقابلية التفسير وإتاحة مراجعة بشرية لها', en: 'Reviewing automated decisions for transparency, explainability and access to human review' },
      ],
      human: [
        { ar: 'الرأي القانوني في الحالات الملتبسة', en: 'Legal opinion on ambiguous cases' },
        { ar: 'تمثيل الجهة والتفاوض في النزاعات', en: 'Representing the entity and negotiating in disputes' },
        { ar: 'تقدير المسؤولية الأخلاقية والنظامية للقرار', en: 'Weighing the ethical and legal accountability of a decision' },
      ],
    },
    rising: [
      { skill: { ar: 'الوعي بالتشريعات الرقمية', en: 'Digital legislation awareness' }, domainId: 'policy' },
      { skill: { ar: 'الخصوصية وحماية البيانات الشخصية', en: 'Privacy & personal data protection' }, domainId: 'cyber' },
      { skill: { ar: 'أخلاقيات الذكاء الاصطناعي واستخدامه المسؤول', en: 'AI ethics & responsible use' }, domainId: 'ai-data' },
    ],
    relatedRoleIds: ['ai_ethics_officer', 'digital_policy_advisor', 'digital_identity_specialist'],
    managerActions: [
      { ar: 'أشرك المستشار القانوني في تصميم الخدمات الرقمية من البداية، لا عند الإطلاق.', en: 'Involve legal advisors in digital service design from the start, not at launch.' },
      { ar: 'اطلب سجلاً بالخدمات التي تعالج بيانات شخصية ومن راجع امتثالها.', en: 'Ask for a register of services that process personal data and who reviewed their compliance.' },
      { ar: 'ضع قواعد لاستخدام أدوات الذكاء الاصطناعي مع الوثائق القانونية السرية.', en: 'Set rules for using AI tools with confidential legal documents.' },
    ],
    claimId: 'leaders-pdpl-enforcement',
  },
  {
    id: 'finance',
    name: { ar: 'المسؤول المالي', en: 'Finance officer' },
    equivalents: [
      { ar: 'أخصائي مالي', en: 'Finance specialist' },
      { ar: 'المحاسب', en: 'Accountant' },
      { ar: 'أخصائي الميزانية', en: 'Budget specialist' },
      { ar: 'المراقب المالي', en: 'Financial controller' },
    ],
    summary: {
      ar: 'ينتقل من تسجيل القيود والمطابقة إلى تحليل الإنفاق وربطه بنتائج الخدمات.',
      en: 'Moves from recording entries and reconciling to analysing spend and linking it to service results.',
    },
    lanes: {
      automated: [
        { ar: 'إدخال القيود ومطابقة الحسابات', en: 'Recording entries and reconciling accounts' },
        { ar: 'معالجة الفواتير والمدفوعات الروتينية', en: 'Processing invoices and routine payments' },
        { ar: 'إعداد التقارير المالية الدورية', en: 'Preparing periodic financial reports' },
        { ar: 'رصد العمليات غير المعتادة لمراجعتها', en: 'Flagging unusual transactions for review' },
      ],
      augmented: [
        { ar: 'إعداد الميزانية والتوقعات بنماذج تحليلية', en: 'Budgeting and forecasting with analytical models' },
        { ar: 'تحليل الفروق بين المخطط والفعلي', en: 'Analysing variances between plan and actual' },
        { ar: 'تقدير الجدوى المالية للمبادرات الرقمية', en: 'Assessing the financial case for digital initiatives' },
      ],
      emerging: [
        { ar: 'ربط الإنفاق بمؤشرات نتائج الخدمات', en: 'Linking spend to service-result indicators' },
        { ar: 'حساب الكلفة الكاملة للتقنية على مدى سنوات تشغيلها', en: 'Calculating the full cost of technology over its operating years' },
        { ar: 'مراجعة الإنفاق على الخدمات السحابية والاشتراكات', en: 'Reviewing spend on cloud services and subscriptions' },
      ],
      human: [
        { ar: 'الحكم على أولويات الإنفاق عند شح الموارد', en: 'Judging spending priorities when resources are tight' },
        { ar: 'شرح الوضع المالي للقيادة وأصحاب القرار', en: 'Explaining the financial position to leaders and decision-makers' },
        { ar: 'النزاهة والمساءلة في القرارات المالية', en: 'Integrity and accountability in financial decisions' },
      ],
    },
    rising: [
      { skill: { ar: 'تحليل البيانات وتمثيلها مرئياً', en: 'Data analysis & visualization' }, domainId: 'ai-data' },
      { skill: { ar: 'تحقيق المنافع وقياس الأثر', en: 'Benefits realisation & impact measurement' }, domainId: 'agile' },
      { skill: { ar: 'استمرارية الأعمال وإدارة الموردين', en: 'Business continuity & supplier management' }, domainId: 'cloud' },
    ],
    relatedRoleIds: ['performance_analyst', 'data_scientist', 'business_analyst'],
    managerActions: [
      { ar: 'اطلب أن يرافق كل طلب ميزانية رقمية مؤشر منفعة يُقاس بعد التشغيل.', en: 'Require every digital budget request to carry a benefit indicator measured after go-live.' },
      { ar: 'راجع الإنفاق السحابي والاشتراكات كل ربع سنة.', en: 'Review cloud and subscription spend every quarter.' },
      { ar: 'درّب الفريق المالي على أدوات التحليل لا على الإدخال.', en: 'Train the finance team in analysis tools, not data entry.' },
    ],
    claimId: 'leaders-ilo-2025-transformation',
  },
  {
    id: 'communications',
    name: { ar: 'مسؤول الاتصال', en: 'Communications officer' },
    equivalents: [
      { ar: 'أخصائي الاتصال المؤسسي', en: 'Corporate communications specialist' },
      { ar: 'أخصائي العلاقات العامة', en: 'Public relations specialist' },
      { ar: 'أخصائي الإعلام والتواصل', en: 'Media and outreach specialist' },
    ],
    summary: {
      ar: 'ينتقل من إنتاج المحتوى إلى التحقق منه وحماية ثقة الجمهور في ما تنشره الجهة.',
      en: 'Moves from producing content to verifying it and protecting public trust in what the entity publishes.',
    },
    lanes: {
      automated: [
        { ar: 'إعداد المسودات الأولى للأخبار والمنشورات', en: 'Drafting first versions of news items and posts' },
        { ar: 'رصد ما يُنشر عن الجهة وتلخيصه يومياً', en: 'Monitoring and summarising daily coverage of the entity' },
        { ar: 'تكييف المحتوى لقنوات وأطوال مختلفة', en: 'Adapting content to different channels and lengths' },
        { ar: 'إعداد التصاميم والصور البسيطة', en: 'Producing simple designs and images' },
      ],
      augmented: [
        { ar: 'تحليل تفاعل الجمهور وتحسين الرسائل', en: 'Analysing audience engagement and refining messages' },
        { ar: 'كتابة المحتوى بلغة واضحة للمستفيد', en: 'Writing content in plain language for beneficiaries' },
        { ar: 'ترجمة المحتوى ومراجعته', en: 'Translating and revising content' },
      ],
      emerging: [
        { ar: 'التحقق من المحتوى المولّد وحقوقه قبل النشر', en: 'Verifying generated content and its rights before publishing' },
        { ar: 'كشف المعلومات المضللة عن الجهة والرد عليها', en: 'Detecting and responding to misinformation about the entity' },
        { ar: 'وضع قواعد الإفصاح عن استخدام الذكاء الاصطناعي في المحتوى', en: 'Setting rules for disclosing AI use in content' },
      ],
      human: [
        { ar: 'التواصل في الأزمات', en: 'Crisis communication' },
        { ar: 'تقدير الحساسية الثقافية والاجتماعية للرسالة', en: 'Judging the cultural and social sensitivity of a message' },
        { ar: 'بناء العلاقة مع الإعلام والجمهور', en: 'Building relationships with media and the public' },
      ],
    },
    rising: [
      { skill: { ar: 'تصميم المحتوى', en: 'Content design' }, domainId: 'service-design' },
      { skill: { ar: 'استخدام الذكاء الاصطناعي التوليدي', en: 'Generative AI use' }, domainId: 'ai-data' },
      { skill: { ar: 'التأثير في غير التقنيين', en: 'Influencing non-technical stakeholders' }, domainId: 'leadership' },
    ],
    relatedRoleIds: ['content_designer', 'ux_researcher', 'ai_ethics_officer'],
    managerActions: [
      { ar: 'ضع قاعدة مكتوبة: لا يُنشر محتوى مولّد دون مراجع بشري مسمّى.', en: 'Set a written rule: no generated content is published without a named human reviewer.' },
      { ar: 'جهّز خطة رد سريع على المعلومات المضللة قبل أن تحتاجها.', en: 'Prepare a rapid-response plan for misinformation before you need it.' },
      { ar: 'قِس وضوح المحتوى لدى المستفيدين لا عدد المنشورات.', en: 'Measure how clear content is to beneficiaries, not the number of posts.' },
    ],
    claimId: 'leaders-sdaia-genai-guidelines',
  },
  {
    id: 'programme-manager',
    name: { ar: 'مدير المشاريع والبرامج', en: 'Project & programme manager' },
    equivalents: [
      { ar: 'أخصائي إدارة المشاريع', en: 'Project management specialist' },
      { ar: 'مدير مكتب إدارة المشاريع', en: 'Project management office manager' },
      { ar: 'منسق البرامج', en: 'Programme coordinator' },
    ],
    summary: {
      ar: 'ينتقل من متابعة الخطط والتقارير إلى إدارة المنتج والمنفعة: تسليم متكرر، ومؤشرات حقيقية، وقرارات توقف معلنة.',
      en: 'Moves from tracking plans and reports to managing products and benefits: frequent delivery, real indicators and declared stop decisions.',
    },
    lanes: {
      automated: [
        { ar: 'تحديث الجداول الزمنية وتقارير الحالة', en: 'Updating schedules and status reports' },
        { ar: 'إعداد محاضر الاجتماعات ومتابعة المهام', en: 'Writing meeting minutes and tracking actions' },
        { ar: 'تجميع مؤشرات الأداء من الأنظمة', en: 'Collecting performance indicators from systems' },
      ],
      augmented: [
        { ar: 'تحليل المخاطر والتنبؤ بالتأخير', en: 'Analysing risks and forecasting delays' },
        { ar: 'تخطيط الموارد بين المشاريع', en: 'Planning resources across projects' },
        { ar: 'إعداد عروض القيادة من بيانات حقيقية', en: 'Preparing leadership briefings from real data' },
      ],
      emerging: [
        { ar: 'إدارة المنتج الرقمي بعد الإطلاق لا حتى الإطلاق فقط', en: 'Managing a digital product after launch, not only until launch' },
        { ar: 'قياس المنافع الفعلية مقابل المخطط لها', en: 'Measuring realised benefits against planned ones' },
        { ar: 'تنسيق فرق متعددة التخصصات تشمل البيانات والتصميم والأمن', en: 'Coordinating multidisciplinary teams spanning data, design and security' },
      ],
      human: [
        { ar: 'إدارة التوقعات مع أصحاب المصلحة', en: 'Managing stakeholder expectations' },
        { ar: 'اتخاذ قرار الاستمرار أو التوقف', en: 'Making the continue-or-stop decision' },
        { ar: 'حماية الفريق وبناء الثقة عند التعثر', en: 'Protecting the team and building trust when things go wrong' },
      ],
    },
    rising: [
      { skill: { ar: 'العمل بالنهج المرن', en: 'Agile ways of working' }, domainId: 'agile' },
      { skill: { ar: 'تحقيق المنافع وقياس الأثر', en: 'Benefits realisation & impact measurement' }, domainId: 'agile' },
      { skill: { ar: 'إدارة التغيير', en: 'Change management' }, domainId: 'leadership' },
    ],
    relatedRoleIds: ['delivery_manager', 'product_manager', 'digital_transformation_lead'],
    managerActions: [
      { ar: 'اطلب تقارير تقدّم بميزات تعمل فعلاً، لا بنسب إنجاز تقديرية.', en: 'Ask for progress reports based on working features, not estimated completion percentages.' },
      { ar: 'حدد لكل برنامج شروط توقف معلنة من البداية.', en: 'Set declared stop conditions for every programme from the start.' },
      { ar: 'كافئ من يبلّغ مبكراً عن التعثر.', en: 'Reward people who report problems early.' },
    ],
    claimId: 'leaders-wef-2025-skill-gaps',
  },
]

export const workFamilyById = (id: string): WorkFamily | undefined => workFamilies.find((f) => f.id === id)
