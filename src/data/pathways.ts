import type { DomainPathway, Resource } from './types'

export const resources: Resource[] = [
  {
    id: 'sda',
    title: { ar: 'الأكاديمية السعودية الرقمية', en: 'Saudi Digital Academy' },
    org: { ar: 'وزارة الاتصالات وتقنية المعلومات', en: 'Saudi MCIT' },
    url: 'https://sda.edu.sa',
    kind: 'program',
  },
  {
    id: 'tuwaiq',
    title: { ar: 'أكاديمية طويق', en: 'Tuwaiq Academy' },
    org: { ar: 'الاتحاد السعودي للأمن السيبراني والبرمجة', en: 'Saudi Federation for Cybersecurity & Programming' },
    url: 'https://tuwaiq.edu.sa',
    kind: 'program',
  },
  {
    id: 'qudratok',
    title: { ar: 'برنامج قدراتك', en: 'Qudratok Program' },
    org: { ar: 'هيئة الحكومة الرقمية', en: 'Digital Government Authority (DGA)' },
    url: 'https://dga.gov.sa',
    kind: 'program',
  },
  {
    id: 'mcit',
    title: { ar: 'وزارة الاتصالات وتقنية المعلومات', en: 'Ministry of Communications & IT' },
    org: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
    url: 'https://mcit.gov.sa',
    kind: 'program',
  },
  {
    id: 'sfia',
    title: { ar: 'إطار SFIA للمهارات', en: 'SFIA Skills Framework' },
    org: { ar: 'مؤسسة SFIA', en: 'SFIA Foundation' },
    url: 'https://sfia-online.org',
    kind: 'framework',
  },
  {
    id: 'digcomp',
    title: { ar: 'الإطار الأوروبي للكفاءة الرقمية DigComp', en: 'EU DigComp Framework' },
    org: { ar: 'المفوضية الأوروبية', en: 'European Commission JRC' },
    url: 'https://joint-research-centre.ec.europa.eu/digcomp_en',
    kind: 'framework',
  },
  {
    id: 'europass',
    title: { ar: 'اختبر مهاراتك الرقمية', en: 'Test your digital skills' },
    org: { ar: 'Europass — الاتحاد الأوروبي', en: 'Europass — European Union' },
    url: 'https://europass.europa.eu/en/europass-tools/test-your-digital-skills',
    kind: 'tool',
  },
  {
    id: 'wef-foj',
    title: { ar: 'تقرير مستقبل الوظائف 2025', en: 'Future of Jobs Report 2025' },
    org: { ar: 'المنتدى الاقتصادي العالمي', en: 'World Economic Forum' },
    url: 'https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf',
    kind: 'report',
  },
  {
    id: 'oecd-dtf',
    title: { ar: 'إطار OECD للمواهب والمهارات الرقمية في القطاع العام', en: 'OECD Framework for Digital Talent and Skills in the Public Sector' },
    org: { ar: 'منظمة التعاون والتنمية', en: 'OECD' },
    url: 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/04/the-oecd-framework-for-digital-talent-and-skills-in-the-public-sector_f6fb7838/4e7c3f58-en.pdf',
    kind: 'report',
  },
  {
    id: 'un-egov',
    title: { ar: 'مسح الأمم المتحدة للحكومة الإلكترونية 2024', en: 'UN E-Government Survey 2024' },
    org: { ar: 'الأمم المتحدة — إدارة الشؤون الاقتصادية والاجتماعية', en: 'UN DESA' },
    url: 'https://desapublications.un.org/publications/un-e-government-survey-2024',
    kind: 'report',
  },
  {
    id: 'coursera-gsr',
    title: { ar: 'تقرير كورسيرا للمهارات العالمية 2025', en: 'Coursera Global Skills Report 2025' },
    org: { ar: 'كورسيرا', en: 'Coursera' },
    url: 'https://www.coursera.org/skills-reports/global',
    kind: 'report',
  },
]

export const resourceById = (id: string): Resource => resources.find((r) => r.id === id)!

/**
 * Development pathways: per domain, per level transition,
 * concrete next behaviors + curated resources.
 */
export const pathways: DomainPathway[] = [
  // ── AI & Data ────────────────────────────────────────────────
  {
    domainId: 'ai-data',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'اقرأ تقريرًا بيانيًا واحدًا من تقارير جهتك أسبوعيًا ولخّص ما تعنيه الأرقام بجملة واحدة.', en: 'Read one chart-based report from your organization weekly and summarize what the numbers mean in one sentence.' },
          { ar: 'استخدم أداة ذكاء اصطناعي توليدي في مهمة حقيقية واحدة أسبوعيًا، وقارن مخرجاتها بمصادر موثوقة.', en: 'Use a generative AI tool for one real task per week, and verify its output against trusted sources.' },
          { ar: 'تعرّف على سياسة تصنيف البيانات في جهتك وطبّقها على ملف واحد تتعامل معه.', en: 'Learn your organization’s data classification policy and apply it to one file you handle.' },
        ],
        resourceIds: ['europass', 'qudratok', 'coursera-gsr'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'حلّل مجموعة بيانات كاملة من عملك وقدّم النتائج بصريًا في اجتماع فريقك.', en: 'Analyze a full dataset from your work and present the findings visually at a team meeting.' },
          { ar: 'اكتب دليل استخدام داخلي للذكاء الاصطناعي التوليدي في فريقك يتضمن ضوابط المراجعة.', en: 'Write an internal guide for generative AI use in your team, including review safeguards.' },
        ],
        resourceIds: ['sda', 'sfia', 'wef-foj'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'قد تقييم مخاطر أخلاقية لحالة استخدام ذكاء اصطناعي في جهتك ووثّق الضوابط المعتمدة.', en: 'Lead an ethical-risk assessment of an AI use case in your organization and document the adopted safeguards.' },
          { ar: 'درّب زملاءك على حوكمة البيانات وصياغة الأوامر، واصنع قناة لمشاركة الممارسات الجيدة.', en: 'Coach colleagues on data governance and prompting, and create a channel for sharing good practices.' },
        ],
        resourceIds: ['sda', 'oecd-dtf', 'sfia'],
      },
    ],
  },
  // ── Cybersecurity & Digital Trust ────────────────────────────
  {
    domainId: 'cyber',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'فعّل المصادقة الثنائية على جميع حسابات العمل وراجع صلاحيات التطبيقات على جهازك.', en: 'Enable two-factor authentication on all work accounts and review app permissions on your device.' },
          { ar: 'أتمم تدريب الوعي الأمني الإلزامي في جهتك وشارك ثلاث نصائح مع فريقك.', en: 'Complete your organization’s mandatory security-awareness training and share three tips with your team.' },
        ],
        resourceIds: ['tuwaiq', 'europass', 'mcit'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'راجع من لديه صلاحية الوصول إلى الأنظمة التي تشرف عليها وطبّق مبدأ الحد الأدنى.', en: 'Review who has access to the systems you oversee and apply least-privilege.' },
          { ar: 'نفّذ تمرين محاكاة مبسطًا للاستجابة لحادثة أمنية مع فريقك ووثّق الدروس.', en: 'Run a simple incident-response tabletop exercise with your team and document the lessons.' },
        ],
        resourceIds: ['tuwaiq', 'sfia', 'wef-foj'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'اجعل مراجعة الأمن بندًا إلزاميًا في بوابات مشاريعك الرقمية منذ مرحلة الفكرة.', en: 'Make a security review a mandatory gate in your digital projects from the idea stage.' },
          { ar: 'ساهم في صياغة أو تحديث سياسة حماية البيانات الشخصية في جهتك.', en: 'Contribute to drafting or updating your organization’s personal-data-protection policy.' },
        ],
        resourceIds: ['sfia', 'oecd-dtf', 'mcit'],
      },
    ],
  },
  // ── Cloud & Digital Infrastructure ───────────────────────────
  {
    domainId: 'cloud',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'صنّف ثلاث خدمات تستخدمها جهتك حسب نموذج الخدمة السحابية (IaaS/PaaS/SaaS) واشرح السبب.', en: 'Classify three services your organization uses by cloud model (IaaS/PaaS/SaaS) and explain why.' },
          { ar: 'اطّلع على وثيقة واجهة برمجة (API) واحدة تربط نظامين في جهتك وافهم ماذا تتبادل.', en: 'Read the API documentation of one integration between two systems in your organization and understand what it exchanges.' },
        ],
        resourceIds: ['sda', 'europass', 'coursera-gsr'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'ضع قائمة بالأنظمة القديمة في نطاق عملك وقيّم خيار تحديث مناسبًا لأحدها.', en: 'Inventory the legacy systems in your scope and evaluate a suitable modernization option for one of them.' },
          { ar: 'راجع اتفاقية مستوى خدمة واحدة مع مورد وحدد مخاطر الاعتماد عليه وخطط التخفيف.', en: 'Review one vendor SLA and identify dependency risks and mitigation plans.' },
        ],
        resourceIds: ['sda', 'sfia', 'oecd-dtf'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'قد استراتيجية تشغيل بيني لجهتك تعتمد المعايير المفتوحة وواجهات البرمجة الموثقة.', en: 'Lead an interoperability strategy for your organization based on open standards and documented APIs.' },
          { ar: 'صمّم اختبار تعافٍ من كارثة لخدمة حرجة وقيّد النتائج في خطة استمرارية الأعمال.', en: 'Design a disaster-recovery test for a critical service and record results in the business continuity plan.' },
        ],
        resourceIds: ['sfia', 'mcit', 'un-egov'],
      },
    ],
  },
  // ── User-Centred Service Design ──────────────────────────────
  {
    domainId: 'service-design',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'قابل مستفيدًا واحدًا من خدمتك هذا الشهر وسجّل ثلاث ملاحظات عن تجربته الفعلية.', en: 'Interview one service beneficiary this month and record three observations about their real experience.' },
          { ar: 'ارسم رحلة مستفيد مبسطة لخدمة واحدة تعرفها وحدد فيها نقطة ألم واحدة على الأقل.', en: 'Sketch a simple beneficiary journey for one service you know and mark at least one pain point.' },
        ],
        resourceIds: ['qudratok', 'digcomp', 'europass'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'نفّذ اختبار قابلية استخدام مع خمسة مستخدمين حقيقيين وحوّل النتائج إلى قائمة تحسينات مرتبة.', en: 'Run a usability test with five real users and turn the results into a prioritized improvement list.' },
          { ar: 'دقّق صفحة خدمة واحدة ضد معايير إمكانية الوصول واقترح الإصلاحات.', en: 'Audit one service page against accessibility standards and propose fixes.' },
        ],
        resourceIds: ['qudratok', 'sfia', 'digcomp'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'ضع معيارًا مؤسسيًا لتصميم المحتوى والرحلات تعتمده جميع الخدمات الجديدة في جهتك.', en: 'Set an organizational standard for content design and journeys that all new services in your organization adopt.' },
          { ar: 'درّب فرقًا أخرى على بحث المستخدمين واختبار قابلية الاستخدام وانشر الأدلة والقوالب.', en: 'Coach other teams on user research and usability testing, and publish the guides and templates.' },
        ],
        resourceIds: ['sfia', 'qudratok', 'oecd-dtf'],
      },
    ],
  },
  // ── Digital Policy, Strategy & Governance ────────────────────
  {
    domainId: 'policy',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'اقرأ استراتيجية التحول الرقمي لجهتك وحدد كيف تخدم مبادرة واحدة تعمل عليها أهدافها.', en: 'Read your organization’s digital transformation strategy and identify how one initiative you work on serves its goals.' },
          { ar: 'تعرّف على ثلاثة تشريعات رقمية وطنية تلامس عملك — كحماية البيانات الشخصية — ولخّص أثرها.', en: 'Learn three national digital regulations touching your work — such as personal data protection — and summarize their impact.' },
        ],
        resourceIds: ['mcit', 'un-egov', 'digcomp'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'قيّم مجموعة بيانات واحدة في جهتك لنشرها كبيانات مفتوحة مع خطة نشر وحوكمة.', en: 'Assess one dataset in your organization for open-data publication, with a release and governance plan.' },
          { ar: 'حلّل فئة مستفيدين قد تُستبعد رقميًا من خدمة واقترح قناة بديلة موثقة.', en: 'Analyze one beneficiary group at risk of digital exclusion from a service and propose a documented alternative channel.' },
        ],
        resourceIds: ['oecd-dtf', 'un-egov', 'qudratok'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'قد صياغة سياسة داخلية لاستخدام الذكاء الاصطناعي أو البيانات المفتوحة واعتمادها.', en: 'Lead the drafting and adoption of an internal policy for AI use or open data.' },
          { ar: 'أعد تصميم وثيقة شراء تقنية لتكون مبنية على النتائج لا على المواصفات المقيدة.', en: 'Redesign a technology procurement document to be outcome-based rather than restrictive-specification-based.' },
        ],
        resourceIds: ['oecd-dtf', 'sfia', 'un-egov'],
      },
    ],
  },
  // ── Agile Product & Delivery ─────────────────────────────────
  {
    domainId: 'agile',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'احضر اجتماعات دورة تطوير كاملة (تخطيط، مراجعة، استرجاع) وسجّل دورك في كل منها.', en: 'Attend a full sprint cycle (planning, review, retrospective) and record your role in each.' },
          { ar: 'حوّل طلب عمل واحدًا إلى قصة مستخدم بصيغة واضحة ومعيار قبول واحد على الأقل.', en: 'Turn one work request into a clear user story with at least one acceptance criterion.' },
        ],
        resourceIds: ['qudratok', 'europass', 'coursera-gsr'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'أدر قائمة مهام منتج (Backlog) مرتبة بالقيمة لمدة دورتين متتاليتين.', en: 'Manage a value-prioritized product backlog for two consecutive cycles.' },
          { ar: 'عرّف ثلاثة مؤشرات نجاح لمنتجك واعرض قياسها الأول على أصحاب المصلحة.', en: 'Define three success metrics for your product and present their first measurement to stakeholders.' },
        ],
        resourceIds: ['sfia', 'sda', 'qudratok'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'قد منتجًا رقميًا عبر مراحل الاكتشاف والتجربة والإطلاق كاملة مع توثيق قرارات كل بوابة.', en: 'Lead a digital product through the full discovery–beta–launch stages, documenting each gate decision.' },
          { ar: 'ابنِ نموذج قياس منافع يُعتمد في جهتك ويربط التسليم بالأثر الفعلي.', en: 'Build a benefits-measurement model adopted by your organization that ties delivery to real impact.' },
        ],
        resourceIds: ['sfia', 'oecd-dtf', 'wef-foj'],
      },
    ],
  },
  // ── Emerging Technologies ────────────────────────────────────
  {
    domainId: 'emerging',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'اقرأ تقريرًا سنويًا واحدًا عن التقنيات الناشئة ولخّص ثلاث تقنيات ذات صلة بقطاعك.', en: 'Read one annual emerging-tech report and summarize three technologies relevant to your sector.' },
          { ar: 'تتبّع حالة استخدام واحدة موثقة لإنترنت الأشياء أو التوأم الرقمي في مدينة سعودية.', en: 'Follow one documented IoT or digital-twin use case in a Saudi city.' },
        ],
        resourceIds: ['wef-foj', 'un-egov', 'coursera-gsr'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'قيّم تقنية ناشئة واحدة بمصفوفة واضحة: القيمة، الجاهزية، المخاطر، كلفة التبني.', en: 'Evaluate one emerging technology with a clear matrix: value, readiness, risk, adoption cost.' },
          { ar: 'نفّذ تجربة مصغرة (Pilot) محدودة النطاق لأتمتة إجراء واحد وقِس النتيجة.', en: 'Run a small-scope pilot automating one procedure and measure the outcome.' },
        ],
        resourceIds: ['sda', 'wef-foj', 'oecd-dtf'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'ابنِ آلية دائمة لاستكشاف التقنيات في جهتك بمعايير تقييم معلنة وقرارات موثقة.', en: 'Build a standing technology-scouting mechanism in your organization with published criteria and documented decisions.' },
          { ar: 'قد توصية اعتماد أو رفض مبنية على الأدلة لتقنية ناشئة أمام لجنة قيادية.', en: 'Present an evidence-based adopt/reject recommendation for an emerging technology to a leadership committee.' },
        ],
        resourceIds: ['oecd-dtf', 'sfia', 'mcit'],
      },
    ],
  },
  // ── Digital Leadership & Collaboration ───────────────────────
  {
    domainId: 'leadership',
    transitions: [
      {
        from: 1, to: 2,
        behaviors: [
          { ar: 'اشرح مبادرة رقمية واحدة لزميل غير تقني في خمس دقائق دون مصطلحات معقدة.', en: 'Explain one digital initiative to a non-technical colleague in five minutes without jargon.' },
          { ar: 'انشر ملخصًا علنيًا واحدًا عن درس مستفاد من مشروعك هذا الربع.', en: 'Publish one open summary of a lesson learned from your project this quarter.' },
        ],
        resourceIds: ['qudratok', 'digcomp', 'europass'],
      },
      {
        from: 2, to: 3,
        behaviors: [
          { ar: 'ضع خطة تغيير لمبادرة واحدة تشمل خريطة المتأثرين ورسائل التواصل والتدريب.', en: 'Build a change plan for one initiative covering a stakeholder map, communication messages and training.' },
          { ar: 'حوّل تقريرًا رقميًا واحدًا إلى عرض قصصي يقود إلى قرار محدد وقُس الاستجابة.', en: 'Turn one data report into a narrative presentation that drives a specific decision, and measure the response.' },
        ],
        resourceIds: ['oecd-dtf', 'sfia', 'coursera-gsr'],
      },
      {
        from: 3, to: 4,
        behaviors: [
          { ar: 'وجّه ثلاثة زملاء على الأقل في مسارات تطوير مهاري موثقة وراجع تقدمهم فصليًا.', en: 'Coach at least three colleagues through documented skill-development pathways and review their progress quarterly.' },
          { ar: 'أسّس مجتمع ممارسة رقميًا في جهتك أو بين الجهات واجعله مصدرًا للمعايير والقوالب.', en: 'Found a digital community of practice in or across organizations and make it a source of standards and templates.' },
        ],
        resourceIds: ['oecd-dtf', 'qudratok', 'sfia'],
      },
    ],
  },
]

export const pathwayForDomain = (domainId: string): DomainPathway =>
  pathways.find((p) => p.domainId === domainId)!
