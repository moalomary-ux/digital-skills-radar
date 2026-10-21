import type { L } from './types'

/**
 * v4 future-skills layer — domain trajectories, emerging micro-skills,
 * declining tasks, and the national adoption playbook.
 * Converted from research/v4-future-skills.md (2026-10).
 */

export type Trajectory = 'surging' | 'rising' | 'stable' | 'declining'

export const trajectoryMeta: Record<Trajectory, { name: L; color: string; bg: string }> = {
  surging: { name: { ar: 'صاعد بقوة', en: 'Surging' }, color: '#255C2B', bg: '#E2F5E5' },
  rising: { name: { ar: 'صاعد', en: 'Rising' }, color: '#1849A9', bg: '#EFF8FF' },
  stable: { name: { ar: 'مستقر', en: 'Stable' }, color: '#4D5761', bg: '#F2F4F7' },
  declining: { name: { ar: 'متراجع', en: 'Declining' }, color: '#B42318', bg: '#FEE4E2' },
}

export interface DomainTrajectory {
  domainId: string
  rating: Trajectory
  rationale: L
  evidence: L[]
}

export const domainTrajectories: DomainTrajectory[] = [
  {
    domainId: 'ai-data',
    rating: 'surging',
    rationale: {
      ar: 'كل جهة حكومية صارت جهة بيانات بقوة النظام: إلزام حماية البيانات الشخصية واستراتيجية سدايا الوطنية حوّلا محو أمية البيانات والذكاء الاصطناعي المسؤول من مهارة نخبة إلى متطلب امتثال. ومع تسارع التعلم العالمي (45 تسجيلًا في الدقيقة في 2026) يتوسع الفارق بين الجهات التي تبني القدرة والتي تشتريها بأسعار باهظة.',
      en: 'Every government entity is now legally a data entity: PDPL enforcement and SDAIA’s national strategy turned data literacy and responsible AI from elite skills into compliance requirements. With global learning accelerating (45 GenAI enrollments/minute in 2026), the gap widens between entities that build capability and those that buy it at premium prices.',
    },
    evidence: [
      { ar: 'الذكاء الاصطناعي والبيانات الضخمة أسرع مهارة نموًا عالميًا حتى 2030 (WEF 2025).', en: 'AI & big data is the #1 fastest-growing skill globally to 2030 (WEF 2025).' },
      { ar: 'تسجيلات سعودية في الذكاء التوليدي +165% سنويًا (استطلاع Coursera 2025)؛ و75% من الشركات السعودية المشاركة تراها أولوية.', en: 'Saudi GenAI enrollments +165% YoY (Coursera 2025 self-reported survey); 75% of participating Saudi companies rank it a top priority.' },
      { ar: 'عالميًا 45+ تسجيلًا في الدقيقة في 2026 مقابل 25 في 2025 (Coursera 2026).', en: 'Globally 45+ GenAI enrollments/minute in 2026, up from 25/min in 2025 (Coursera 2026).' },
      { ar: 'إلزام نظام حماية البيانات (2024) واستراتيجية سدايا يجعلان حوكمة البيانات متطلب امتثال.', en: 'PDPL enforcement (2024) and SDAIA’s strategy make data governance a compliance requirement.' },
    ],
  },
  {
    domainId: 'cyber',
    rating: 'surging',
    rationale: {
      ar: 'الضوابط الملزمة من الهيئة الوطنية للأمن السيبراني تجعل الوعي الأمني وإدارة الهويات والخصوصية متطلبات قانونية على كل جهة لا خيارات تقنية. والحوادث الموجهة للقطاع الحكومي تبقي الطلب صاعدًا بقوة حتى 2030 على الأقل.',
      en: 'Binding NCA controls make security awareness, identity management and privacy legal requirements for every entity, not technical options. State-targeted incidents keep demand surging through at least 2030.',
    },
    evidence: [
      { ar: 'الشبكات والأمن السيبراني ثاني أسرع مهارة نموًا (WEF 2025)؛ والتفتت الجيوسياسي محرك رئيس للطلب.', en: 'Networks & cybersecurity is the #2 fastest-growing skill (WEF 2025); geopolitical fragmentation is a top demand driver.' },
      { ar: 'تسجيلات الأمن السيبراني السعودية +61% سنويًا (استطلاع Coursera 2025).', en: 'Saudi cybersecurity enrollments +61% YoY (Coursera 2025 survey).' },
      { ar: 'ضوابط الهيئة الوطنية (ECC وOTCC) ملزمة للجهات والبنية الحرجة.', en: 'NCA binding controls (ECC, OTCC) mandate cyber staffing across government.' },
      { ar: 'تقدر ISC2 فجوة القوى السيبرانية العالمية بالملايين.', en: 'ISC2 estimates the global cyber workforce gap in the millions.' },
    ],
  },
  {
    domainId: 'cloud',
    rating: 'rising',
    rationale: {
      ar: 'موجة النقل السحابي الحكومية مستمرة لكنها انتقلت من القرار إلى التشغيل: الطلب ينمو على فهم النماذج السحابية والتشغيل البيني والهوية الرقمية أكثر من البناء من الصفر. التصنيف «صاعد» لا «صاعد بقوة» لأن الجهات تشتري السحابة غالبًا كخدمة — المهارة المطلوبة هي إدارة الموردين والحوكمة لا تشغيل الخوادم.',
      en: 'The government cloud wave continues but has moved from decision to operations: demand grows for cloud models, interoperability and digital identity more than build-from-scratch work. Rated “rising” not “surging” because entities mostly buy cloud as a service — the needed skill is vendor governance, not server operation.',
    },
    evidence: [
      { ar: 'توسيع النفاذ الرقمي أكثر الاتجاهات تحويلًا (60% من أصحاب العمل، WEF 2025).', en: 'Broadening digital access is the single most transformative trend (60% of employers, WEF 2025).' },
      { ar: 'سياسة السحابة أولًا ووصول المناطق السحابية العالمية للسعودية يسحبان الأحمال الحكومية نحو السحابة.', en: 'MCIT cloud-first policy and arriving hyperscaler regions pull government workloads to the cloud.' },
      { ar: 'الهوية الرقمية الوطنية (نفاذ، توكلنا) صارت بنية تحتية تشغيلية.', en: 'National digital-identity rails (Nafath, Tawakkalna) are now operational infrastructure.' },
    ],
  },
  {
    domainId: 'service-design',
    rating: 'rising',
    rationale: {
      ar: 'جودة الخدمات الحكومية أصبحت تقاس وتنشر، فتحولت مهارات بحث المستفيدين وتصميم الرحلات وإمكانية الوصول إلى معايير امتثال لدى هيئة الحكومة الرقمية. النمو ثابت ومدفوع بالتنظيم أكثر منه بموضة تقنية.',
      en: 'Government service quality is now measured and published, turning user research, journey design and accessibility into DGA compliance criteria. Growth is steady and regulation-driven rather than hype-driven.',
    },
    evidence: [
      { ar: 'معايير الحكومة الرقمية تتطلب تصميمًا مرتكزًا على المستخدم وأدلة قابلية استخدام.', en: 'Digital-government standards require user-centred design and usability evidence.' },
      { ar: 'التفكير الإبداعي ضمن أسرع خمس مهارات صعودًا (WEF 2025).', en: 'Creative thinking is a top-5 rising skill (WEF 2025).' },
      { ar: 'برامج قياس تجربة المستفيد تُمأسس رسم الرحلات واختبار قابلية الاستخدام.', en: 'Citizen-experience measurement programs institutionalize journey mapping and usability testing.' },
    ],
  },
  {
    domainId: 'policy',
    rating: 'rising',
    rationale: {
      ar: 'كل نظام رقمي جديد (حماية البيانات، الذكاء الاصطناعي، البيانات المفتوحة) يولّد طلبًا على من يترجم النص التنظيمي إلى ممارسة تشغيلية داخل الجهات. مهارة «الوعي بالتشريعات الرقمية» هي الأقل قابلية للأتمتة في المنصة لأنها حكم على الغموض التنظيمي.',
      en: 'Every new digital regulation (data protection, AI, open data) creates demand for people who translate legal text into operational practice. Digital-legislation awareness is the platform’s least automatable skill because it is judgment over regulatory ambiguity.',
    },
    evidence: [
      { ar: 'إلزام حماية البيانات (سبتمبر 2024) ومتطلبات البيانات المفتوحة وأطر حوكمة الذكاء توسّع السطح التنظيمي.', en: 'PDPL (September 2024), open-data requirements and AI-governance frameworks expand the regulatory surface.' },
      { ar: 'فجوات المهارات هي العائق الأول للتحول (63% من أصحاب العمل، WEF 2025).', en: 'Skill gaps are the #1 barrier to transformation (63% of employers, WEF 2025).' },
      { ar: 'إصلاح الشراء التقني أولوية حكومية معلنة.', en: 'Tech-procurement reform is a stated government priority.' },
    ],
  },
  {
    domainId: 'agile',
    rating: 'stable',
    rationale: {
      ar: 'الصدق يقتضي التمييز: المسمى الوظيفي «آجايل» تراجع عالميًا، لكن الممارسة — دورة حياة المنتج وقصص المستخدم وقياس المنافع — صارت الطريقة الافتراضية لبناء الخدمات الحكومية الرقمية. الطلب مستقر على الممارسة العميقة ومنخفض على شهادات الطقوس السطحية.',
      en: 'Honesty requires a distinction: the “agile” job title has declined globally, but the practice — product lifecycle, user stories, benefits measurement — is now the default way government digital services are built. Demand is stable for deep practice and low for ceremony-level certificates.',
    },
    evidence: [
      { ar: 'مهارات إدارة المنتجات المجاورة للرشاقة تواصل الصعود (LinkedIn 2025).', en: 'Agile-adjacent product-management skills keep rising (LinkedIn 2025).' },
      { ar: 'مسمى «آجايل» الوظيفي خفت عالميًا منذ 2023 بينما تستمر الممارسة المدمجة.', en: 'The “agile” job title softened globally since 2023 while the embedded practice persists.' },
    ],
  },
  {
    domainId: 'emerging',
    rating: 'surging',
    rationale: {
      ar: 'الوكلاء الأذكياء والتوأم الرقمي وإنترنت الأشياء انتقلت في 2025–2026 من العروض التجريبية إلى التشغيل الحكومي الفعلي (مدن ذكية، مراقبة مشاريع، خدمات استباقية). هذا المجال هو الأسرع تغيرًا في المنصة — ويحتاج مراجعة محتوى نصف سنوية.',
      en: 'Agentic AI, digital twins and IoT moved in 2025–2026 from demos to actual government operations (smart cities, project monitoring, proactive services). This is the platform’s fastest-changing domain — it needs semi-annual content review.',
    },
    evidence: [
      { ar: 'الذكاء الاصطناعي الوكيل من أسرع مهارات الذكاء نموًا (Coursera 2026).', en: 'Agentic AI is among the fastest-growing AI skills (Coursera 2026).' },
      { ar: '58% من أصحاب العمل يرون الروبوتات والأتمتة محوّلة (WEF 2025)؛ والتوائم الرقمية مدمجة في المشاريع الكبرى.', en: '58% of employers see robotics & automation as transformative (WEF 2025); digital twins are embedded in giga-projects.' },
      { ar: 'برامج وطنية: مدن ذكية وخدمات أقمار صناعية واعتمادات رقمية.', en: 'National programs: smart cities, satellite services, digital credentials.' },
    ],
  },
  {
    domainId: 'leadership',
    rating: 'rising',
    rationale: {
      ar: 'كلما تسارعت الأتمتة ارتفعت قيمة من يقود البشر عبرها: إدارة التغيير والتأثير في غير التقنيين وسرد البيانات هي المهارات التي تحول الاستثمار التقني إلى أثر فعلي. الطلب صاعد بثبات ومقاوم للأتمتة بطبيعته.',
      en: 'The faster automation accelerates, the higher the value of those who lead humans through it: change management, influencing non-technical stakeholders and data storytelling are what convert technology investment into real impact. Demand rises steadily and is automation-proof by nature.',
    },
    evidence: [
      { ar: 'المرونة والقيادة والتأثير الاجتماعي من المهارات الأساسية الأعلى، والتفكير التحليلي يبقى أولًا (7 من 10 جهات، WEF 2025).', en: 'Resilience, leadership & social influence are top core skills; analytical thinking stays #1 (7/10 employers, WEF 2025).' },
      { ar: 'تسجيلات التفكير النقدي +107% سنويًا (Coursera 2026) — الرفيق الإنساني لموجة الذكاء الاصطناعي.', en: 'Critical-thinking enrollments +107% YoY (Coursera 2026) — the human-skill companion of the AI wave.' },
      { ar: 'برامج تحول رؤية 2030 تُمأسس إدارة التغيير وسرد البيانات.', en: 'Vision 2030 realization programs institutionalize change management and data storytelling.' },
    ],
  },
]

// ── 15 emerging micro-skills ────────────────────────────────────────────────

export interface MicroSkill {
  id: string
  name: L
  description: L
  parentDomain: string
  demandSignal: L
  governmentRelevance: L
  firstStep: L
}

export const microSkills: MicroSkill[] = [
  {
    id: 'prompt_engineering',
    name: { ar: 'هندسة الأوامر', en: 'Prompt engineering' },
    description: { ar: 'صياغة تعليمات منظمة للنماذج اللغوية للحصول على مخرجات دقيقة وقابلة للتكرار في سياقات العمل.', en: 'Structuring instructions to language models for accurate, repeatable outputs in work contexts.' },
    parentDomain: 'ai-data',
    demandSignal: { ar: 'مهارة مرافقة لموجة الذكاء التوليدي؛ 45+ تسجيلًا/دقيقة عالميًا (Coursera 2026) و+165% سعوديًا (2025).', en: 'Rides the GenAI wave: 45+ enrollments/minute globally (Coursera 2026), +165% YoY in Saudi Arabia (2025).' },
    governmentRelevance: { ar: 'موظفو الجهات يستخدمون أدوات لغوية معتمدة للصياغة والتلخيص — هندسة الأوامر الجيدة هي الفارق بين ناتج يُعتمد وهلوسة مكلفة.', en: 'Entity staff use approved LLM tools for drafting and summarizing — prompt discipline is the difference between dependable output and costly hallucination.' },
    firstStep: { ar: 'دورة تطبيقية قصيرة ثم بناء مكتبة أوامر خاصة بمهام إدارتك المتكررة.', en: 'A short applied course, then build a prompt library for your unit’s recurring tasks.' },
  },
  {
    id: 'ai_agent_orchestration',
    name: { ar: 'تنسيق الوكلاء الأذكياء', en: 'AI agent orchestration' },
    description: { ar: 'تصميم ومراقبة سلاسل وكلاء ذكاء اصطناعي ينفذون مهام متعددة الخطوات ضمن حدود صلاحيات واضحة.', en: 'Designing and supervising chains of AI agents executing multi-step tasks within clear permission boundaries.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'الذكاء الوكيل من أسرع مهارات الذكاء الاصطناعي نموًا (Coursera 2026)؛ و86% من أصحاب العمل يتوقعون تحول أعمالهم بالذكاء الاصطناعي (WEF 2025).', en: 'Agentic AI among fastest-growing AI skills (Coursera 2026); 86% of employers expect AI to transform their business (WEF 2025).' },
    governmentRelevance: { ar: 'الخدمات الاستباقية والمعاملات متعددة الإدارات ستُبنى على وكلاء — والجهات تحتاج من يصمم حدود الصلاحيات ونقاط التدخل البشري.', en: 'Proactive services and cross-department case handling will run on agents — entities need people who design permission boundaries and human-in-the-loop checkpoints.' },
    firstStep: { ar: 'شغّل وكيلًا واحدًا على مهمة داخلية غير حساسة (كتلخيص اجتماعات) مع سجل مراجعة بشري كامل.', en: 'Run one agent on a low-sensitivity internal task (e.g., meeting summaries) with full human review logs.' },
  },
  {
    id: 'ai_output_verification',
    name: { ar: 'التحقق من مخرجات الذكاء الاصطناعي', en: 'AI output verification' },
    description: { ar: 'فحص مخرجات النماذج التوليدية: رصد الهلوسة، والتحقق من المصادر، وتقدير متى تكون الثقة غير مبررة.', en: 'Auditing generative-model output: spotting hallucination, checking sources, judging when confidence is unwarranted.' },
    parentDomain: 'ai-data',
    demandSignal: { ar: 'نمو التفكير النقدي +107% في تسجيلات المتعلمين (Coursera 2026) — السوق يستشعر الحاجة لمهارة التحقق.', en: 'Critical-thinking enrollments +107% YoY (Coursera 2026) — the market registering the verification need.' },
    governmentRelevance: { ar: 'خطأ غير مكتشف في خطاب رسمي أو تحليل تنظيمي كلفته أعلى من نظيره التجاري؛ التحقق هو خط الدفاع الأخير قبل نشر أي مخرج آلي.', en: 'An undetected error in an official letter or regulatory analysis costs more than in commercial work; verification is the last line of defense before any AI output ships.' },
    firstStep: { ar: 'اعتمد قاعدة «كل مخرج آلي له مراجع بشري مسؤول» ودرّب الفريق على قوائم فحص الهلوسة.', en: 'Adopt the rule “every AI output has a named human reviewer” and train teams on hallucination checklists.' },
  },
  {
    id: 'data_stewardship',
    name: { ar: 'وكالة البيانات', en: 'Data stewardship' },
    description: { ar: 'إدارة جودة البيانات وتعريفاتها وسلالاتها وصلاحيات الوصول إليها كأصل مؤسسي موثّق.', en: 'Managing data quality, definitions, lineage and access rights for data as a documented institutional asset.' },
    parentDomain: 'ai-data',
    demandSignal: { ar: 'الذكاء والبيانات الضخمة أسرع مهارة نموًا (WEF 2025)؛ وإلزام حماية البيانات يتطلب ملاكًا معينين للبيانات داخل الجهات.', en: 'AI & big data is the #1 fastest-growing skill (WEF 2025); PDPL enforcement effectively requires named data owners inside entities.' },
    governmentRelevance: { ar: 'تبادل البيانات بين الجهات يفشل دون تعريفات وجودة موثقة — الوكيل يجعل بيانات جهته قابلة للمشاركة بأمان.', en: 'Cross-entity data exchange fails without documented definitions and quality — the steward makes their entity’s data safely shareable.' },
    firstStep: { ar: 'ابدأ بكتالوج مبسط لأهم عشر مجموعات بيانات في جهتك: تعريف، مالك، جودة، حساسية.', en: 'Start with a lean data catalog for your entity’s top ten datasets: definition, owner, quality, sensitivity.' },
  },
  {
    id: 'digital_identity_management',
    name: { ar: 'إدارة الهوية الرقمية', en: 'Digital identity management' },
    description: { ar: 'تصميم وتشغيل دورة حياة الهويات والصلاحيات (موظفون، مستفيدون، أنظمة) عبر منظومات الدخول الموحد الوطنية.', en: 'Designing and operating identity & access lifecycles (staff, beneficiaries, systems) across national single-sign-on rails.' },
    parentDomain: 'cloud',
    demandSignal: { ar: 'البنية الوطنية للهوية (نفاذ، توكلنا) جعلت الهوية بنية تحتية تشغيلية؛ وتوسع الخدمات يرفع الطلب.', en: 'National identity rails (Nafath, Tawakkalna) made identity operational infrastructure; expanding digital services lift demand.' },
    governmentRelevance: { ar: 'كل خدمة حكومية رقمية تبدأ بسؤال «من هذا الطرف؟» — إدارة الهوية السليمة تمنع الاحتيال وتختصر الرحلات.', en: 'Every digital government service starts with “who is this party?” — sound identity management prevents fraud and shortens journeys.' },
    firstStep: { ar: 'راجع صلاحيات أنظمة جهتك الحالية (جرد من له ماذا) قبل أي شهادة تقنية.', en: 'Audit your entity’s current access grants (who has what) before taking any technical certificate.' },
  },
  {
    id: 'threat_modeling',
    name: { ar: 'نمذجة التهديدات', en: 'Threat modeling' },
    description: { ar: 'تحليل منهجي لما يمكن أن يهاجم النظام قبل بنائه: الأصول، المهاجمون، المسارات، والتخفيفات.', en: 'Systematic pre-build analysis of what could attack a system: assets, attackers, paths, and mitigations.' },
    parentDomain: 'cyber',
    demandSignal: { ar: 'الشبكات والأمن السيبراني ثاني أسرع مهارة نموًا (WEF 2025)؛ وضوابط الهيئة الوطنية تتطلب أمنًا منذ التصميم.', en: 'Networks & cybersecurity is the #2 fastest-growing skill (WEF 2025); NCA controls require security by design.' },
    governmentRelevance: { ar: 'الخدمات الحكومية أهداف دائمة؛ نمذجة التهديدات المبكرة أرخص بكثير من معالجة اختراق خدمة عاملة يعتمد عليها مواطنون.', en: 'Government services are standing targets; early threat modeling is far cheaper than remediating a breached live service citizens depend on.' },
    firstStep: { ar: 'تعلم منهجية واحدة (STRIDE) وطبقها على خدمة رقمية واحدة في جهتك في ورشة نصف يوم.', en: 'Learn one method (STRIDE) and apply it to one of your entity’s digital services in a half-day workshop.' },
  },
  {
    id: 'accessible_content_design',
    name: { ar: 'تصميم محتوى ميسّر الوصول', en: 'Accessible content design' },
    description: { ar: 'كتابة وتصميم محتوى رقمي يصل لذوي الإعاقة وكبار السن: لغة مبسطة، تباين، قارئات شاشة، ترجمة إشارية عند الحاجة.', en: 'Writing and designing digital content that reaches people with disabilities and seniors: plain language, contrast, screen readers, sign interpretation where needed.' },
    parentDomain: 'service-design',
    demandSignal: { ar: 'معايير الخدمات الحكومية تتضمن متطلبات وصول؛ وإلزام الإتاحة اتجاه موثق في الأسواق المرجعية.', en: 'DGA service standards include accessibility requirements; digital-accessibility mandates are a documented direction in reference markets.' },
    governmentRelevance: { ar: 'الخدمة الحكومية ملزمة بخدمة الجميع — محتوى غير ميسّر يعني فئات كاملة مستبعدة من خدمات إلزامية لها.', en: 'A government service must serve everyone — inaccessible content locks out entire groups from services they are entitled to.' },
    firstStep: { ar: 'اختبر صفحة خدمة واحدة بقارئ شاشة وأصلح أوضح عشر مشكلات؛ ثم عمّم القاعدة.', en: 'Test one service page with a screen reader, fix the ten most visible issues, then generalize the rule.' },
  },
  {
    id: 'digital_twin_operation',
    name: { ar: 'تشغيل التوأم الرقمي', en: 'Digital twin operation' },
    description: { ar: 'تشغيل وقراءة نماذج رقمية حية لأصول مادية (مباني، شبكات، مدن) لمحاكاة القرارات قبل تنفيذها.', en: 'Operating and reading live digital replicas of physical assets (buildings, networks, cities) to simulate decisions before execution.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'التوائم الرقمية مدمجة في المشاريع الكبرى السعودية؛ و58% من أصحاب العمل يرون الروبوتات والأتمتة محوّلة (WEF 2025).', en: 'Digital twins are embedded in Saudi giga-projects; 58% of employers see robotics/automation as transformative (WEF 2025).' },
    governmentRelevance: { ar: 'البلديات والمشغلون يحتاجون من يقرأ التوأم لاتخاذ قرارات صيانة وتخطيط — لا من يبنيه فقط.', en: 'Municipalities and operators need people who can read a twin for maintenance and planning decisions — not only people who build one.' },
    firstStep: { ar: 'ابدأ بأساسيات GIS ثم أداة توأم واحدة (بيئة BIM مفتوحة) على أصل واحد صغير.', en: 'Start with GIS fundamentals, then one twin tool (open BIM environments) on a single small asset.' },
  },
  {
    id: 'synthetic_media_literacy',
    name: { ar: 'الثقافة الإعلامية للوسائط الاصطناعية', en: 'Synthetic media literacy' },
    description: { ar: 'التعرف على المحتوى الاصطناعي (تزييف عميق، صوت مولّد) والتحقق منه، وفهم حدود الأدلة المرئية والمسموعة.', en: 'Recognizing and verifying synthetic content (deepfakes, generated voice), and understanding the limits of audio-visual evidence.' },
    parentDomain: 'policy',
    demandSignal: { ar: 'توسع أدوات توليد الوسائط (اتجاه موثق عالميًا) يجعل التحقق من المحتوى مهارة مواطنة رقمية أساسية.', en: 'Proliferation of media-generation tools (documented global trend) makes content verification a basic digital-citizenship skill.' },
    governmentRelevance: { ar: 'الشائعات المصنوعة عن خدمات أو مسؤولين تنتشر أسرع من التصحيح — الجهات تحتاج قدرة رصد ورد سريعة ومضبوطة.', en: 'Fabricated rumors about services or officials spread faster than corrections — entities need fast, disciplined detection and response.' },
    firstStep: { ar: 'درّب فريق الاتصال على أدوات كشف التزييف المتاحة وبروتوكول تصعيد للحالات المؤكدة.', en: 'Train the communications team on available deepfake-detection tools plus an escalation protocol for confirmed cases.' },
  },
  {
    id: 'climate_tech_literacy',
    name: { ar: 'الثقافة التقنية المناخية', en: 'Climate-tech literacy' },
    description: { ar: 'فهم أساسيات تقنيات الطاقة المتجددة والتخزين واحتجاز الكربون وكفاءة المياه بما يكفي لتقييم مقترحات ومتابعة مؤشرات.', en: 'Enough understanding of renewables, storage, carbon capture and water-efficiency technologies to evaluate proposals and track indicators.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'الإدارة البيئية دخلت أسرع عشر مهارات نموًا لأول مرة (WEF 2025)؛ ومستهدف 50% طاقة متجددة بحلول 2030 يصنع طلبًا حكوميًا.', en: 'Environmental stewardship entered the top-10 fastest-growing skills for the first time (WEF 2025); the 50%-renewables-by-2030 target creates government demand.' },
    governmentRelevance: { ar: 'الجهات مطالبة بتقارير استدامة ومشتريات خضراء — الثقافة المناخية تحول الامتثال من عبء ورقي إلى قرارات ذكية.', en: 'Entities face sustainability reporting and green procurement — climate literacy turns compliance from paperwork into smart decisions.' },
    firstStep: { ar: 'تعلم قراءة تقرير بصمة كربونية مبسط لمنشأة واحدة في جهتك.', en: 'Learn to read a simplified carbon-footprint report for one of your entity’s facilities.' },
  },
  {
    id: 'human_ai_collaboration_design',
    name: { ar: 'تصميم التعاون بين الإنسان والذكاء الاصطناعي', en: 'Human-AI collaboration design' },
    description: { ar: 'تقسيم العمل بين البشر والنماذج داخل الإجراءات: ما يُؤتمت، ما يُعزز، وما يبقى بشريًا حصرًا — مع تصميم نقاط المراجعة.', en: 'Dividing work between humans and models inside procedures: what is automated, what is augmented, what stays human-only — with review checkpoints designed in.' },
    parentDomain: 'service-design',
    demandSignal: { ar: '77% من أصحاب العمل يخططون لإعادة تأهيل موظفيهم للعمل مع الذكاء الاصطناعي (WEF 2025).', en: '77% of employers plan to reskill workers to work alongside AI (WEF 2025).' },
    governmentRelevance: { ar: 'إعادة هندسة إجراءات الخدمة حول الذكاء الاصطناعي دون نقاط مراجعة مصممة تنتج إما أتمتة خطرة أو ذكاءً شكليًا.', en: 'Re-engineering government procedures around AI without designed checkpoints produces either risky automation or decorative AI.' },
    firstStep: { ar: 'ارسم إجراءً واحدًا في إدارتك وصنّف كل خطوة: أتمتة / تعزيز / بشري حصري.', en: 'Map one procedure in your unit and classify each step: automate / augment / human-only.' },
  },
  {
    id: 'privacy_engineering',
    name: { ar: 'هندسة الخصوصية', en: 'Privacy engineering' },
    description: { ar: 'ترجمة متطلبات حماية البيانات إلى تصميم تقني: تقليل البيانات، التقنيع، صلاحيات الوصول، سجلات المعالجة.', en: 'Translating data-protection requirements into technical design: minimization, masking, access rights, processing records.' },
    parentDomain: 'cyber',
    demandSignal: { ar: 'إلزام نظام حماية البيانات منذ سبتمبر 2024 يجعل الخصوصية متطلبًا هندسيًا لا قانونيًا فقط.', en: 'PDPL enforcement since September 2024 makes privacy an engineering requirement, not just a legal one.' },
    governmentRelevance: { ar: 'الجهات تعالج بيانات مواطنين بكميات ضخمة؛ الخطأ الهندسي في الخصوصية مخالفة نظامية وخرق ثقة معًا.', en: 'Entities process citizen data at scale; a privacy engineering error is both a legal violation and a trust breach.' },
    firstStep: { ar: 'نفّذ تقييم أثر حماية بيانات (DPIA) واحدًا على نظام قائم لتتعلم المنهجية بالممارسة.', en: 'Run one DPIA on an existing system to learn the method by doing.' },
  },
  {
    id: 'no_code_automation',
    name: { ar: 'الأتمتة دون برمجة', en: 'No-code automation' },
    description: { ar: 'بناء تدفقات عمل آلية (موافقات، إشعارات، ربط نماذج) بأدوات مرئية دون كتابة شيفرة — مع حوكمة تمنع فوضى الأتمتة.', en: 'Building automated workflows (approvals, notifications, form wiring) with visual tools and no code — with governance to prevent automation sprawl.' },
    parentDomain: 'agile',
    demandSignal: { ar: 'الأتمتة والذكاء الوكيل من أسرع المهارات نموًا (Coursera 2026 / WEF 2025)؛ وأدوات دون شيفرة توسع من يستطيع الأتمتة.', en: 'Automation and agentic AI are among the fastest-growing skills (Coursera 2026 / WEF 2025); no-code tools expand who inside a unit can automate.' },
    governmentRelevance: { ar: 'طوابير الموافقات اليدوية أول مكسب سريع للتحول الرقمي — لكن الأتمتة غير المحوكمة تصنع ظلالًا تقنية.', en: 'Manual approval queues are the fastest digital-transformation win — but ungoverned automation creates shadow IT, so governance is part of the skill.' },
    firstStep: { ar: 'أتمت إجراءً ورقيًا واحدًا متكررًا (كطلب إجازة داخلي) بالأداة المعتمدة في جهتك.', en: 'Automate one recurring paper procedure (e.g., an internal leave request) with your entity’s approved tool.' },
  },
  {
    id: 'geospatial_analysis',
    name: { ar: 'التحليل الجيومكاني', en: 'Geospatial analysis' },
    description: { ar: 'تحليل البيانات المكانية (خرائط، صور أقمار، حدود إدارية) لدعم قرارات التخطيط والخدمات الميدانية.', en: 'Analyzing spatial data (maps, satellite imagery, administrative boundaries) to support planning and field-service decisions.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'الرصد الأرضي والتوائم الرقمية والبرنامج الفضائي الوطني يصنعان طلبًا متناميًا على القراءة المكانية.', en: 'Earth observation, giga-project digital twins and the national space program create growing demand for spatial literacy.' },
    governmentRelevance: { ar: 'قرارات البلديات والنقل والبيئة قرارات مكانية بطبيعتها — تحليل «أين» يحسّن توزيع الخدمات وكشف الفجوات.', en: 'Municipal, transport and environmental decisions are spatial by nature — analyzing “where” improves service distribution and gap detection.' },
    firstStep: { ar: 'ابدأ بأداة خرائط مفتوحة (QGIS) وارسم توزيع مستفيدي خدمة واحدة على الخريطة.', en: 'Start with an open mapping tool (QGIS) and plot one service’s beneficiary distribution.' },
  },
  {
    id: 'behavioral_data_ethics',
    name: { ar: 'أخلاقيات البيانات السلوكية', en: 'Behavioral data ethics' },
    description: { ar: 'الحكم الأخلاقي على استخدام البيانات السلوكية (التفاعلات، الأنماط، التنبؤ بالسلوك): الموافقة، العدالة، تجنب التلاعب.', en: 'Ethical judgment over behavioral-data use (interactions, patterns, behavior prediction): consent, fairness, avoiding manipulation.' },
    parentDomain: 'policy',
    demandSignal: { ar: 'الذكاء المسؤول أولوية معلنة في استراتيجية سدايا؛ وتوسع أنظمة التوصية الحكومية يستلزم حكمًا أخلاقيًا موثقًا.', en: 'Responsible AI is a stated priority in SDAIA’s national strategy; expanding government recommendation systems require documented ethical judgment.' },
    governmentRelevance: { ar: 'خدمة «تتنبأ» بسلوك المستفيدين قد تتحسن بالبيانات السلوكية أو تنزلق إلى تمييز وتلاعب — الحد الفاصل مهارة لا نص نظامي وحده.', en: 'A service “predicting” beneficiary behavior can improve with behavioral data or slide into discrimination and manipulation — the dividing line is a skill, not a statute alone.' },
    firstStep: { ar: 'اقرأ مبادئ الذكاء الاصطناعي المسؤول المنشورة وطنيًا وطبق قائمة فحصها على مشروع واحد.', en: 'Read the nationally published responsible-AI principles and apply their checklist to one project.' },
  },
]

// ── 10 declining skills/tasks by 2030 (task-vs-job nuance kept) ────────────

export interface DecliningSkill {
  id: string
  name: L
  evidence: L
  nuance: L
  pivot: L
}

export const decliningSkills: DecliningSkill[] = [
  {
    id: 'manual_data_entry',
    name: { ar: 'الإدخال اليدوي للبيانات', en: 'Manual data entry' },
    evidence: { ar: 'كتبة إدخال البيانات في المرتبة الثالثة تراجعًا عالميًا (WEF 2025)؛ والعمل الكتابي أكثر فئات المهام تعرضًا (منظمة العمل الدولية 2025).', en: 'Data-entry clerks rank #3 fastest-declining globally (WEF 2025); clerical work is the most GenAI-exposed task category (ILO 2025).' },
    nuance: { ar: 'المهمة تختفي لا كل وظيفة تشملها: من يتحول إلى فحص جودة البيانات يبقى مطلوبًا — الفرق بين من يدخل البيانات ومن يضمن صحتها.', en: 'The task vanishes, not every job containing it: those who pivot to data-quality assurance stay employed — the difference is entering data vs. guaranteeing it.' },
    pivot: { ar: 'شهادة تحليل بيانات قصيرة (6 أشهر) — نقلة مباشرة إلى مهنة نامية.', en: 'A 6-month data-analysis certificate — a direct move into a growing career.' },
  },
  {
    id: 'basic_translation',
    name: { ar: 'الترجمة الأساسية غير المتخصصة', en: 'Basic (non-specialized) translation' },
    evidence: { ar: 'الترجمة الآلية العصبية والنماذج اللغوية تغطي الترجمة الروتينية بجودة عملية؛ ومهام اللغة النصية ضمن الأكثر تعرضًا (ILO 2025).', en: 'Neural machine translation and LLMs now cover routine translation at usable quality; text-language tasks are among the most exposed (ILO 2025).' },
    nuance: { ar: 'الترجمة القانونية والطبية والمرافعة الفورية تبقى بشرية بسبب المساءلة — المتراجع هو النص العام غير المتخصص، لا مهنة الترجمة كاملة.', en: 'Legal, medical and conference interpreting stay human because of accountability — what declines is generic text translation, not the translation profession.' },
    pivot: { ar: 'التخصص (قانوني/طبي) أو التحرير اللغوي بعد الآلي — مراجعة المخرجات بدل إنتاجها.', en: 'Specialize (legal/medical) or move to machine post-editing — reviewing output instead of producing it.' },
  },
  {
    id: 'tier1_support_scripts',
    name: { ar: 'الدعم المباشر المسكربت (المستوى الأول)', en: 'Scripted tier-1 support' },
    evidence: { ar: 'أتمتة خدمة العملاء بالوكلاء اللغويين من أوضح تطبيقات الذكاء التوليدي إنتاجًا؛ و86% من أصحاب العمل يتوقعون تحول أعمالهم (WEF 2025).', en: 'LLM customer-service agents are among the clearest production GenAI deployments; 86% of employers expect AI to transform their business (WEF 2025).' },
    nuance: { ar: 'الطلب ينتقل إلى المستوى الثاني (الحالات المعقدة) وإدارة تجربة العميل — الردود المسكربتة تُؤتمت، والتعاطف في الأزمات لا.', en: 'Demand shifts to tier-2 (complex cases) and customer-experience management — scripted replies automate; empathy in crises does not.' },
    pivot: { ar: 'إدارة تجربة المستفيد وتحليل الشكاوى — من الرد على الشكوى إلى منع تكرارها.', en: 'Beneficiary-experience management and complaint analytics — from answering complaints to preventing them.' },
  },
  {
    id: 'routine_bookkeeping',
    name: { ar: 'مسك الدفاتر الروتيني', en: 'Routine bookkeeping' },
    evidence: { ar: 'كتبة المحاسبة ومسك الدفاتر في المرتبة السابعة تراجعًا عالميًا (WEF 2025)؛ والفوترة الإلكترونية السعودية تؤتمت القيود من المصدر.', en: 'Accounting & bookkeeping clerks rank #7 fastest-declining globally (WEF 2025); Saudi e-invoicing (ZATCA) automates entries at the source.' },
    nuance: { ar: 'المحاسبة كمهنة تتحول لا تندثر: التحليل والامتثال ينموان بينما يتراجع القيد اليدوي — الدرجة ما زالت تصنع قيمة، والشهادة القصيرة وحدها لا.', en: 'Accounting as a profession transforms, not dies: analysis and compliance grow while manual entry shrinks — the degree still builds value; a short certificate alone does not.' },
    pivot: { ar: 'امتثال الفوترة الإلكترونية والتحليل المحاسبي — شهادات قصيرة متاحة وطنيًا.', en: 'E-invoicing compliance and accounting analysis — short credentials available nationally.' },
  },
  {
    id: 'cashier_ticket_clerical',
    name: { ar: 'أعمال الصرافين وكتبة التذاكر', en: 'Cashier & ticket-clerk tasks' },
    evidence: { ar: 'الصرافون وكتبة التذاكر ضمن أكبر فئات التراجع بالأرقام المطلقة (WEF 2025)؛ والمدفوعات الإلكترونية بلغت نحو 79% من معاملات التجزئة السعودية في 2024 (البنك المركزي).', en: 'Cashiers & ticket clerks are among the largest absolute declines (WEF 2025); electronic payments reached ~79% of Saudi retail transactions in 2024 (SAMA).' },
    nuance: { ar: 'الدفع الذاتي يختصر الطابور لا الضيافة: أدوار تجربة العميل في المواقع تتحول من تحصيل النقد إلى حل المشكلات.', en: 'Self-checkout shortens the queue, not hospitality: on-site customer roles shift from taking cash to solving problems.' },
    pivot: { ar: 'أدوار تجربة الضيوف والعمليات في قطاعي التجزئة والفعاليات النامية سعوديًا.', en: 'Guest-experience and operations roles in Saudi Arabia’s growing retail and events sectors.' },
  },
  {
    id: 'bank_teller_ops',
    name: { ar: 'عمليات صرافي البنوك', en: 'Bank-teller operations' },
    evidence: { ar: 'صرافو البنوك ضمن أسرع المهن تراجعًا عالميًا (WEF 2025)؛ والمصرفية الرقمية والمفتوحة السعودية تنقل المعاملات إلى القنوات الذاتية.', en: 'Bank tellers are among the fastest-declining roles globally (WEF 2025); Saudi digital and open banking (SAMA framework) move transactions to self-service channels.' },
    nuance: { ar: 'الفروع تتحول إلى مراكز استشارة: من يجيد بيع المنتج المعقد والامتثال ينتقل داخل البنك نفسه بدل الخروج منه.', en: 'Branches are becoming advisory centers: staff skilled in complex products and compliance move within the bank rather than out of it.' },
    pivot: { ar: 'أخصائي مدفوعات وتقنية مالية (بطاقة المهنة في المستكشف) — القطاع نفسه ينمو في مستوى أعلى.', en: 'Fintech product & payments specialist (see the career card) — the same sector growing one level up.' },
  },
  {
    id: 'postal_counter',
    name: { ar: 'أعمال شبابيك البريد التقليدية', en: 'Traditional postal-counter work' },
    evidence: { ar: 'كتبة الخدمات البريدية ضمن أسرع المهن تراجعًا عالميًا (WEF 2025)؛ والبريد السعودي تحول إلى مشغل لوجستي رقمي.', en: 'Postal-service clerks are among the fastest-declining roles globally (WEF 2025); Saudi Post (SPL) has transformed into a digital logistics operator.' },
    nuance: { ar: 'القطاع لا يختفي بل يتحول: طرد التجارة الإلكترونية يستبدل الرسالة الورقية — العمليات اللوجستية تنمو بينما الشباك التقليدي يتراجع.', en: 'The sector transforms rather than vanishes: e-commerce parcels replace paper letters — logistics operations grow while the traditional counter shrinks.' },
    pivot: { ar: 'عمليات لوجستية ومستودعات ذكية — مهارات التعامل مع الطرود قابلة للنقل مباشرة.', en: 'Logistics operations & smart warehouses — parcel-handling skills transfer directly.' },
  },
  {
    id: 'executive_secretary_routine',
    name: { ar: 'الأعمال الإدارية والسكرتارية الروتينية', en: 'Routine administrative & secretarial tasks' },
    evidence: { ar: 'المساعدون الإداريون والسكرتارية التنفيذية ضمن أكبر فئات التراجع بالأرقام المطلقة (WEF 2025)؛ والجدولة والمحاضر والمراسلات من أول مهام أتمتة النماذج اللغوية.', en: 'Administrative assistants & executive secretaries are among the largest absolute declines (WEF 2025); scheduling, minutes and correspondence are first-wave LLM automation targets.' },
    nuance: { ar: 'من يدير مكتب القيادة (تنسيق أصحاب المصلحة، السرية، الحكم على الأولويات) يبقى — المتراجع هو تسجيل المواعيد وصياغة الخطابات النمطية.', en: 'Those who run an executive office (stakeholder coordination, confidentiality, priority judgment) stay — what declines is booking meetings and drafting template letters.' },
    pivot: { ar: 'إدارة مكتب التحول الرقمي أو تنسيق المشاريع — القرب من القيادة مع مهارة رقمية.', en: 'Digital-transformation office management or project coordination — proximity to leadership plus a digital skill.' },
  },
  {
    id: 'template_graphic_production',
    name: { ar: 'الإنتاج الجرافيكي القالبي', en: 'Template-based graphic production' },
    evidence: { ar: 'مصممو الجرافيك ضمن قائمة التراجع (المرتبة 11) في تقرير WEF 2025؛ وأدوات التوليد البصري تنتج القوالب الاجتماعية والإعلانية في ثوانٍ.', en: 'Graphic designers appear on the WEF 2025 declining list (#11); image-generation tools produce social and ad templates in seconds.' },
    nuance: { ar: 'الهوية البصرية الاستراتيجية وتجربة المستخدم تنموان — المتراجع هو تنفيذ القوالب، لا التصميم كتفكير.', en: 'Strategic brand identity and UX are growing — what declines is template execution, not design as thinking.' },
    pivot: { ar: 'تصميم تجربة المستخدم للمنتجات الرقمية العربية — أقوى بديل محلي موثق في بطاقات المهن.', en: 'UX design for Arabic-first digital products — the strongest documented local pivot in the career cards.' },
  },
  {
    id: 'first_draft_writing',
    name: { ar: 'صياغة المسودات الأولى والتقارير النمطية', en: 'First-draft & template report writing' },
    evidence: { ar: 'النماذج اللغوية تنتج مسودات التقارير والخطابات بجودة عالية؛ ومهام الكتابة الروتينية ضمن الأعلى تعرضًا (ILO 2025)؛ و40% من أصحاب العمل يتوقعون تقليص الوظائف حيث يمكن أتمتة المهام (WEF 2025).', en: 'LLMs produce high-quality first drafts of reports and letters; routine writing tasks are among the most exposed (ILO 2025); 40% of employers expect to reduce staff where AI can automate tasks (WEF 2025).' },
    nuance: { ar: 'القيمة انتقلت من «كتابة المسودة» إلى «ضبط الحقيقة والنبرة والمساءلة»: المحرر الذي يتحقق ويوقّع باسمه أثمن من كاتب المسودة.', en: 'Value moved from “writing the draft” to “owning accuracy, tone and accountability”: the editor who verifies and signs is worth more than the drafter.' },
    pivot: { ar: 'التحرير والتحقق من مخرجات الذكاء الاصطناعي (مهارة دقيقة في القسم أعلاه) — الانتقال من الإنتاج إلى الاعتماد.', en: 'Editing and AI-output verification (micro-skill above) — moving from production to sign-off.' },
  },
]

// ── National adoption playbook (for government entities) ────────────────────

export interface PlaybookSection {
  id: string
  title: L
  items: { ar: string; en: string }[]
}

export const playbookSections: PlaybookSection[] = [
  {
    id: 'governance',
    title: { ar: 'الحوكمة والرعاية', en: 'Governance & sponsorship' },
    items: [
      { ar: 'عيّن مالكًا تنفيذيًا واضحًا — عادةً نائب الرئيس للموارد البشرية أو مسؤول التحول الرقمي، بقرار إداري مكتوب.', en: 'Assign a named executive owner — typically the HR VP or the digital-transformation officer, by written administrative decision.' },
      { ar: 'شكّل لجنة توجيه ثلاثية: الموارد البشرية + تقنية المعلومات + ممثل تخطيط القدرات؛ تجتمع شهريًا في أول ستة أشهر.', en: 'Form a three-party steering committee: HR + IT + a workforce-planning representative; monthly for the first six months.' },
      { ar: 'اربط المبادرة بمرجعية وطنية: أطر القدرات الرقمية الحكومية، ومستهدفات برنامج تنمية القدرات البشرية، وضوابط حماية البيانات (سدايا).', en: 'Anchor the initiative to national references: digital-capability frameworks, Human Capability Development Program targets, and SDAIA data-protection rules.' },
    ],
  },
  {
    id: 'customization',
    title: { ar: 'نقاط التخصيص', en: 'Customization points' },
    items: [
      { ar: 'خريطة الوظائف: طابق عائلات الوظائف في جهتك مع مكتبة الأدوار في المنصة (ابدأ بالعشرين الأعلى عددًا لا كل الأدوار).', en: 'Role mapping: match your entity’s job families to the platform’s role library — start with the twenty most populous roles, not all of them.' },
      { ar: 'أوزان المجالات: عدّل وزن المجالات الثمانية حسب ميثاق جهتك (جهة صحية ترفع البيانات والمعلوماتية؛ بلدية ترفع الجيومكاني وتصميم الخدمات).', en: 'Domain weighting: adjust the eight domains to your mandate (a health entity weights data/informatics higher; a municipality weights geospatial and service design).' },
      { ar: 'عربي أولًا: اعتمد المحتوى العربي أساسًا مع الإنجليزية للمصطلحات التقنية، وثبّت مستويات الاستحقاق لكل مرتبة وظيفية.', en: 'Arabic-first: Arabic content as the default with English for technical terms; fix proficiency thresholds per job grade.' },
    ],
  },
  {
    id: 'integration',
    title: { ar: 'التكامل مع المنظومة الوطنية', en: 'National ecosystem integration' },
    items: [
      { ar: 'جدارات: استخدم ربط الأدوار والمهارات لتخطيط التدريب عند الإعلانات الموحدة؛ نتائج المنصة ليست مدخلًا للمفاضلة ولا الترشيح — أداة تطوير فقط، والاختيار النظامي مساره منفصل تمامًا.', en: 'Jadarat: use role/skill mapping for training planning around job postings; platform results are NOT an input to selection or nomination — a development tool only, and formal selection is an entirely separate process.' },
      { ar: 'الأكاديميات الوطنية: وجّه فجوات المهارات إلى مقدمي التدريب المعتمدين — أكاديمية طويق، أكاديمية سدايا، الأكاديمية السعودية الرقمية، وأكاديمية الحكومة الرقمية — باتفاقيات مقاعد مؤسسية بدل التسجيل الفردي.', en: 'National academies: route skill gaps to accredited providers — Tuwaiq Academy, SDAIA Academy, Saudi Digital Academy, DGA Academy — via institutional seat agreements rather than individual enrollment.' },
      { ar: 'الأنظمة الإدارية: اربط نتائج التقييم بملف الموظف في نظام الموارد البشرية لدى جهتك (قراءة فقط في السنة الأولى).', en: 'HR systems: link assessment results to the employee file in your HR system (read-only in year one).' },
    ],
  },
  {
    id: 'privacy',
    title: { ar: 'الخصوصية وحماية بيانات التقييم', en: 'Privacy & assessment-data protection' },
    items: [
      { ar: 'نتائج التقييم بيانات شخصية بموجب نظام حماية البيانات الشخصية (سريان الإلزام منذ سبتمبر 2024): عيّن مسؤول حماية بيانات وحدد الأساس النظامي للمعالجة (موافقة الموظف أو المصلحة المشروعة الموثقة).', en: 'Assessment results are personal data under PDPL (enforced since September 2024): appoint a data-protection officer and document the legal basis (employee consent or documented legitimate interest).' },
      { ar: 'التقليل والتجميع: اجمع أقل بيانات ممكنة، واعرض للإدارة العليا تقارير مجمعة فقط — لا تُعرض نتيجة فرد إلا للفرد نفسه ولمسؤول التطوير المباشر.', en: 'Minimization & aggregation: collect the minimum; senior management sees aggregated reports only — an individual’s result is visible to the person and their direct development officer only.' },
      { ar: 'الإقامة والاحتفاظ: استضف بيانات التقييم داخل المملكة أو على بنية معتمدة، وحدد مدة احتفاظ (سنتان مقترحتان) وسياسة حذف عند الانتقال أو التقاعد.', en: 'Residency & retention: host assessment data in-Kingdom or on approved infrastructure; set a retention period (two years suggested) and a deletion policy on transfer or retirement.' },
      { ar: 'حق الاطلاع والتصحيح: يستطيع الموظف رؤية نتيجته كاملة والاعتراض عليها — الشفافية شرط الثقة، والثقة شرط صدق الإجابات.', en: 'Access & correction rights: every employee can view their full result and contest it — transparency is a condition of trust, and trust is a condition of honest answers.' },
      { ar: 'حد الاستخدام الصارم: النتائج للتخطيط التطويري فقط — ممنوع استخدامها في التوظيف أو الترقية أو المفاضلة أو تقييم الأداء الرسمي، داخل الجهة أو خارجها.', en: 'A strict usage boundary: results are for development planning only — never for hiring, promotion, selection or formal performance evaluation, inside or outside the entity.' },
    ],
  },
]

export const playbookKpis: { kpi: L; description: L; target: L }[] = [
  { kpi: { ar: 'نسبة إتمام التقييم', en: 'Assessment completion' }, description: { ar: 'الموظفون المكملون لتقييم المهارات', en: 'Employees completing the skills assessment' }, target: { ar: '≥ 80%', en: '≥ 80%' } },
  { kpi: { ar: 'تغطية الأدوار', en: 'Role coverage' }, description: { ar: 'أدوار الجهة ذات ملف مهاري معتمد', en: 'Entity roles with an approved skill profile' }, target: { ar: '≥ 20 دورًا', en: '≥ 20 roles' } },
  { kpi: { ar: 'إغلاق الفجوات', en: 'Gap closure' }, description: { ar: 'موظفون رفعوا مستواهم في مجال واحد على الأقل خلال 6 أشهر', en: 'Employees raising their level in at least one domain within 6 months' }, target: { ar: '≥ 30%', en: '≥ 30%' } },
  { kpi: { ar: 'تحويل التدريب', en: 'Training conversion' }, description: { ar: 'إتمام مسار تعلم مرتبط بفجوة مقاسة', en: 'Completing a learning path tied to a measured gap' }, target: { ar: '≥ 50% من المسجلين', en: '≥ 50% of enrollees' } },
  { kpi: { ar: 'تغطية خطط التطوير', en: 'Development-plan coverage' }, description: { ar: 'موظفون لديهم خطة تطوير نشطة مرتبطة بفجوة مقاسة — لا قرارات توظيف أو ترقية مبنية على النتائج', en: 'Employees with an active development plan tied to a measured gap — no hiring or promotion decisions are based on results' }, target: { ar: 'سجّل خط الأساس ثم انمُه', en: 'Baseline, then grow' } },
  { kpi: { ar: 'نضج المجالات', en: 'Domain maturity' }, description: { ar: 'متوسط مستوى الجهة في كل مجال من الثمانية', en: 'Entity average level in each of the eight domains' }, target: { ar: 'تقرير ربعي للجنة التوجيه', en: 'Quarterly steering-committee report' } },
]
