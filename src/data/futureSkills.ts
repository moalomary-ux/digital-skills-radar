import type { L } from './types'

/**
 * «مهارات 2030» — domain trajectories, emerging micro-skills, declining tasks,
 * and the adoption playbook for government entities.
 *
 * v9 (P5b): every figure is a `{{claim-id}}` token resolved by `<ClaimText>` against
 * `src/data/claims` (no bare numbers); the trajectory rating is editorial
 * (`future-editorial-trajectory`); the playbook no longer links results to HR files,
 * job-grade entitlement or selection platforms, and its KPI targets are editorial
 * suggestions without invented numbers.
 */

export type Trajectory = 'surging' | 'rising' | 'stable' | 'declining'

/** Glossary §5: future signals are «ينمو / يتحوّل / يتراجع» (no extinction or automation-immunity wording). */
export const trajectoryMeta: Record<Trajectory, { name: L; color: string; bg: string }> = {
  surging: { name: { ar: 'ينمو بقوة', en: 'Growing strongly' }, color: '#255C2B', bg: '#E2F5E5' },
  rising: { name: { ar: 'ينمو', en: 'Growing' }, color: '#1849A9', bg: '#EFF8FF' },
  stable: { name: { ar: 'يتحوّل', en: 'Shifting' }, color: '#4D5761', bg: '#F2F4F7' },
  declining: { name: { ar: 'يتراجع', en: 'Declining' }, color: '#B42318', bg: '#FEE4E2' },
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
      ar: 'صار لكل جهة حكومية التزام نظامي تجاه بياناتها: نظام حماية البيانات الشخصية واستراتيجية سدايا الوطنية نقلا الإلمام بالبيانات والذكاء الاصطناعي المسؤول من مهارة لفئة محدودة إلى متطلب امتثال. والفارق يتسع بين الجهات التي تبني القدرة داخليًا والتي تعتمد على شرائها.',
      en: 'Every government entity now carries legal obligations for its data: the Personal Data Protection Law and SDAIA’s national strategy moved data literacy and responsible AI from a niche skill to a compliance requirement. The gap is widening between entities that build the capability in-house and those that rely on buying it.',
    },
    evidence: [
      { ar: 'تأتي مهارات الذكاء الاصطناعي والبيانات الضخمة في {{future-wef-2025-ai-bigdata-top}} بين أسرع المهارات نموًا حتى 2030.', en: 'AI and big data rank {{future-wef-2025-ai-bigdata-top}} among the fastest-growing skills to 2030.' },
      { ar: 'نما تسجيل المتعلمين في المملكة في مقررات الذكاء الاصطناعي التوليدي على منصة تعلم عالمية بنحو {{future-coursera-2025-ksa-genai}} خلال عام.', en: 'Enrollments from Saudi Arabia in generative-AI courses on a global learning platform grew by about {{future-coursera-2025-ksa-genai}} in a year.' },
      { ar: 'عالميًا، تتحدث المنصة نفسها عن نحو {{future-coursera-2026-genai-rate}} في مقررات الذكاء الاصطناعي التوليدي.', en: 'Globally, the same platform reports about {{future-coursera-2026-genai-rate}} in generative-AI courses.' },
      { ar: 'سريان نظام حماية البيانات الشخصية (2024) واستراتيجية سدايا يجعلان حوكمة البيانات متطلب امتثال.', en: 'The Personal Data Protection Law in force (2024) and SDAIA’s strategy make data governance a compliance requirement.' },
    ],
  },
  {
    domainId: 'cyber',
    rating: 'surging',
    rationale: {
      ar: 'الضوابط الملزمة من الهيئة الوطنية للأمن السيبراني تجعل الوعي الأمني وإدارة الهويات والخصوصية متطلبات نظامية على كل جهة لا خيارات تقنية. والحوادث الموجهة إلى القطاع الحكومي تبقي الطلب في نمو قوي حتى 2030 على الأقل.',
      en: 'Binding controls from the National Cybersecurity Authority make security awareness, identity management and privacy regulatory requirements for every entity, not technical options. Incidents aimed at the public sector keep demand growing strongly to at least 2030.',
    },
    evidence: [
      { ar: 'تأتي مهارات الشبكات والأمن السيبراني في {{future-wef-2025-cyber-second}} بين أسرع المهارات نموًا حتى 2030.', en: 'Networks and cybersecurity rank {{future-wef-2025-cyber-second}} among the fastest-growing skills to 2030.' },
      { ar: 'نما تسجيل المتعلمين في المملكة في مقررات الأمن السيبراني على منصة تعلم عالمية بنحو {{future-coursera-2025-ksa-cyber}} خلال عام.', en: 'Enrollments from Saudi Arabia in cybersecurity courses on a global learning platform grew by about {{future-coursera-2025-ksa-cyber}} in a year.' },
      { ar: 'ضوابط الهيئة الوطنية للأمن السيبراني (ECC وOTCC) ملزمة للجهات الحكومية والبنى التحتية الحساسة.', en: 'The National Cybersecurity Authority’s controls (ECC, OTCC) are binding on government entities and critical infrastructure.' },
      { ar: 'تقدّر دراسة دولية فجوة القوى العاملة السيبرانية في العالم {{future-isc2-cyber-gap}}.', en: 'An international study estimates the global cyber workforce gap in the {{future-isc2-cyber-gap}}.' },
    ],
  },
  {
    domainId: 'cloud',
    rating: 'rising',
    rationale: {
      ar: 'موجة النقل السحابي الحكومية مستمرة لكنها انتقلت من القرار إلى التشغيل: الطلب ينمو على فهم النماذج السحابية والتشغيل البيني والهوية الرقمية أكثر من البناء من الصفر. التصنيف «ينمو» لا «ينمو بقوة» لأن الجهات تشتري السحابة غالبًا خدمةً، فالمهارة المطلوبة هي الحوكمة وإدارة الموردين لا تشغيل الخوادم.',
      en: 'The government cloud wave continues but has moved from decision to operations: demand grows for cloud models, interoperability and digital identity more than for building from scratch. Rated “growing” rather than “growing strongly” because entities mostly buy cloud as a service, so the needed skill is governance and vendor management, not running servers.',
    },
    evidence: [
      { ar: 'يرى {{future-wef-2025-digital-access}} من أصحاب العمل أن توسيع الوصول الرقمي أكثر الاتجاهات تحويلًا لأعمالهم.', en: '{{future-wef-2025-digital-access}} of employers see broadening digital access as the most transformative trend for their business.' },
      { ar: 'سياسة الحوسبة السحابية أولًا ووصول مناطق مزودي السحابة العالميين إلى المملكة يدفعان الأعمال الحكومية نحو السحابة.', en: 'The cloud-first policy and global cloud regions arriving in the Kingdom pull government workloads to the cloud.' },
      { ar: 'منصة النفاذ الوطني الموحد (نفاذ) للهوية الرقمية، وتطبيق توكلنا للخدمات الحكومية، صارا جزءًا من البنية التشغيلية اليومية.', en: 'The national single sign-on platform (Nafath) for digital identity and the Tawakkalna app for government services are now part of everyday operational infrastructure.' },
    ],
  },
  {
    domainId: 'service-design',
    rating: 'rising',
    rationale: {
      ar: 'جودة الخدمات الحكومية صارت تُقاس وتُنشر، فتحولت مهارات بحث المستفيدين وتصميم الرحلات وإمكانية الوصول إلى معايير تطلبها هيئة الحكومة الرقمية. النمو ثابت ومدفوع بالتنظيم أكثر منه بموجة تقنية.',
      en: 'Government service quality is now measured and published, turning beneficiary research, journey design and accessibility into criteria required by the Digital Government Authority. Growth is steady and driven by regulation rather than by a technology wave.',
    },
    evidence: [
      { ar: 'معايير الحكومة الرقمية تتطلب تصميمًا مرتكزًا على المستفيد وأدلة على قابلية الاستخدام.', en: 'Digital-government standards require beneficiary-centred design and usability evidence.' },
      { ar: 'التفكير الإبداعي {{future-wef-2025-creative-thinking}} مهارات صعودًا في توقعات أصحاب العمل.', en: 'Creative thinking is in the {{future-wef-2025-creative-thinking}} rising skills in employers’ expectations.' },
      { ar: 'برامج قياس تجربة المستفيد ترسّخ رسم الرحلات واختبار قابلية الاستخدام في عمل الجهات.', en: 'Beneficiary-experience measurement programmes embed journey mapping and usability testing in entities’ work.' },
    ],
  },
  {
    domainId: 'policy',
    rating: 'rising',
    rationale: {
      ar: 'كل نظام رقمي جديد (حماية البيانات، الذكاء الاصطناعي، البيانات المفتوحة) يولّد طلبًا على من يترجم النص التنظيمي إلى ممارسة تشغيلية داخل الجهة. ومهارة «الوعي بالتشريعات الرقمية» تقوم على الحكم في الغموض التنظيمي، ولذلك يصعب أتمتتها.',
      en: 'Every new digital regulation (data protection, AI, open data) creates demand for people who translate legal text into operational practice inside the entity. Digital-legislation awareness rests on judgment under regulatory ambiguity, which makes it hard to automate.',
    },
    evidence: [
      { ar: 'سريان نظام حماية البيانات الشخصية (سبتمبر 2024) ومتطلبات البيانات المفتوحة وأطر حوكمة الذكاء الاصطناعي توسّع النطاق التنظيمي.', en: 'The Personal Data Protection Law in force (September 2024), open-data requirements and AI-governance frameworks widen the regulatory scope.' },
      { ar: 'يرى {{leaders-wef-2025-skill-gaps}} من أصحاب العمل أن فجوات المهارات العائق الأول أمام التحول.', en: '{{leaders-wef-2025-skill-gaps}} of employers see skill gaps as the main barrier to transformation.' },
      { ar: 'إصلاح الشراء التقني أولوية حكومية معلنة.', en: 'Technology-procurement reform is a stated government priority.' },
    ],
  },
  {
    domainId: 'agile',
    rating: 'stable',
    rationale: {
      ar: 'الدقة تقتضي التمييز: المسمى الوظيفي المرتبط بالعمل الرشيق تراجع عالميًا، لكن الممارسة نفسها (دورة حياة المنتج وقصص المستخدم وقياس المنافع) صارت الطريقة المعتادة لبناء الخدمات الحكومية الرقمية. لذلك يتحوّل الطلب: ثابت على الممارسة العميقة، ومنخفض على الشهادات الشكلية.',
      en: 'Precision requires a distinction: the agile job title has declined globally, but the practice itself (product lifecycle, user stories, benefits measurement) is now the usual way government digital services are built. Demand is therefore shifting: steady for deep practice, low for formal certificates alone.',
    },
    evidence: [
      { ar: 'ترصد منصة توظيف عالمية مهارات إدارة المنتجات المجاورة للعمل الرشيق بوصفها {{future-linkedin-2025-product}}.', en: 'A global hiring platform reports agile-adjacent product-management skills as {{future-linkedin-2025-product}}.' },
      { ar: 'مسمى الوظيفة الرشيقة خفت عالميًا منذ 2023 بينما تستمر الممارسة داخل الفرق.', en: 'The agile job title has softened globally since 2023 while the practice continues inside teams.' },
    ],
  },
  {
    domainId: 'emerging',
    rating: 'surging',
    rationale: {
      ar: 'وكلاء الذكاء الاصطناعي والتوأم الرقمي وإنترنت الأشياء انتقلت في 2025–2026 من العروض التجريبية إلى التشغيل الحكومي الفعلي (مدن ذكية، مراقبة مشاريع، خدمات استباقية). وهذا المجال هو الأسرع تغيرًا في الرادار، ولذلك يحتاج مراجعة محتوى كل ستة أشهر.',
      en: 'AI agents, digital twins and the Internet of Things moved in 2025–2026 from demos to actual government operations (smart cities, project monitoring, proactive services). This is the radar’s fastest-changing domain, so it needs a content review every six months.',
    },
    evidence: [
      { ar: 'تضع منصة تعلم عالمية مهارات وكلاء الذكاء الاصطناعي {{future-coursera-2026-agentic}} بين مهارات الذكاء الاصطناعي على منصتها.', en: 'A global learning platform places AI-agent skills {{future-coursera-2026-agentic}} AI skills on its platform.' },
      { ar: 'يتوقع {{future-wef-2025-robotics}} من أصحاب العمل أن تحوّل الروبوتات والأنظمة الذاتية أعمالهم.', en: '{{future-wef-2025-robotics}} of employers expect robots and autonomous systems to transform their business.' },
      { ar: 'برامج وطنية في المدن الذكية وخدمات الأقمار الصناعية والاعتمادات الرقمية توسّع الحاجة إلى هذه المهارات.', en: 'National programmes in smart cities, satellite services and digital credentials widen the need for these skills.' },
    ],
  },
  {
    domainId: 'leadership',
    rating: 'rising',
    rationale: {
      ar: 'كلما تسارعت الأتمتة ارتفعت قيمة من يقود الناس خلالها: إدارة التغيير والتأثير في غير التقنيين وسرد القصص بالبيانات هي ما يحوّل الاستثمار التقني إلى أثر فعلي. الطلب ينمو بثبات، وهذه المهارات أقل عرضة للأتمتة من غيرها.',
      en: 'The faster automation moves, the more valuable those who lead people through it become: change management, influencing non-technical stakeholders and data storytelling are what turn technology investment into real results. Demand grows steadily, and these skills are less exposed to automation than most.',
    },
    evidence: [
      { ar: 'يرى نحو {{future-wef-2025-analytical}} أصحاب عمل أن التفكير التحليلي مهارة أساسية، وتأتي المرونة والقيادة والتأثير الاجتماعي ضمن المهارات الأساسية الأعلى.', en: 'About {{future-wef-2025-analytical}} employers see analytical thinking as a core skill, and resilience, leadership and social influence rank among the top core skills.' },
      { ar: 'نما التسجيل في مقررات التفكير النقدي على منصة تعلم عالمية بنحو {{future-coursera-2026-critical-thinking}} خلال عام.', en: 'Enrollments in critical-thinking courses on a global learning platform grew by about {{future-coursera-2026-critical-thinking}} in a year.' },
      { ar: 'برامج تحقيق رؤية 2030 ترسّخ إدارة التغيير وسرد القصص بالبيانات في الجهات.', en: 'Vision 2030 realization programmes embed change management and data storytelling in entities.' },
    ],
  },
]

// ── Emerging micro-skills ───────────────────────────────────────────────────

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
    demandSignal: { ar: 'ترافق موجة الذكاء الاصطناعي التوليدي: نحو {{future-coursera-2026-genai-rate}} عالميًا على منصة تعلم واحدة، ونمو تسجيل المتعلمين في المملكة {{future-coursera-2025-ksa-genai}}.', en: 'It rides the generative-AI wave: about {{future-coursera-2026-genai-rate}} worldwide on one learning platform, and enrollments from Saudi Arabia up {{future-coursera-2025-ksa-genai}}.' },
    governmentRelevance: { ar: 'موظفو الجهات يستخدمون أدوات لغوية معتمدة للصياغة والتلخيص، والأمر الجيد هو الفرق بين ناتج يُعتمد عليه وهلوسة مكلفة.', en: 'Entity staff use approved language tools for drafting and summarizing; a well-built prompt is the difference between dependable output and a costly hallucination.' },
    firstStep: { ar: 'دورة تطبيقية قصيرة، ثم بناء مكتبة أوامر لمهام إدارتك المتكررة.', en: 'A short applied course, then build a prompt library for your unit’s recurring tasks.' },
  },
  {
    id: 'ai_agent_orchestration',
    name: { ar: 'تنسيق وكلاء الذكاء الاصطناعي', en: 'AI agent orchestration' },
    description: { ar: 'تصميم سلاسل من وكلاء الذكاء الاصطناعي تنفذ مهامًا متعددة الخطوات ومراقبتها ضمن حدود صلاحيات واضحة.', en: 'Designing and supervising chains of AI agents executing multi-step tasks within clear permission boundaries.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'مهارات وكلاء الذكاء الاصطناعي {{future-coursera-2026-agentic}} على منصة تعلم عالمية، ويتوقع {{leaders-wef-2025-ai-transform}} من أصحاب العمل أن يحوّل الذكاء الاصطناعي أعمالهم.', en: 'AI-agent skills are {{future-coursera-2026-agentic}} on a global learning platform, and {{leaders-wef-2025-ai-transform}} of employers expect AI to transform their business.' },
    governmentRelevance: { ar: 'الخدمات الاستباقية والمعاملات بين الإدارات ستعتمد على الوكلاء، والجهات تحتاج من يصمم حدود الصلاحيات ونقاط التدخل البشري.', en: 'Proactive services and cross-department case handling will rely on agents; entities need people who design permission boundaries and human checkpoints.' },
    firstStep: { ar: 'شغّل وكيلًا واحدًا على مهمة داخلية غير حساسة (كتلخيص الاجتماعات) مع سجل مراجعة بشرية كامل.', en: 'Run one agent on a low-sensitivity internal task (such as meeting summaries) with a full human-review log.' },
  },
  {
    id: 'ai_output_verification',
    name: { ar: 'التحقق من مخرجات الذكاء الاصطناعي', en: 'AI output verification' },
    description: { ar: 'فحص مخرجات النماذج التوليدية: رصد الهلوسة، والتحقق من المصادر، وتقدير متى تكون الثقة غير مبررة.', en: 'Auditing generative-model output: spotting hallucination, checking sources, judging when confidence is unwarranted.' },
    parentDomain: 'ai-data',
    demandSignal: { ar: 'نما التسجيل في مقررات التفكير النقدي {{future-coursera-2026-critical-thinking}} على منصة تعلم عالمية، وهي إشارة إلى الحاجة لمهارة التحقق.', en: 'Critical-thinking enrollments grew {{future-coursera-2026-critical-thinking}} on a global learning platform, a sign of the need for verification skills.' },
    governmentRelevance: { ar: 'الخطأ غير المكتشف في خطاب رسمي أو تحليل تنظيمي أعلى كلفة من نظيره التجاري؛ والتحقق هو خط الدفاع الأخير قبل اعتماد أي مخرج آلي.', en: 'An undetected error in an official letter or regulatory analysis costs more than in commercial work; verification is the last line of defence before any AI output is adopted.' },
    firstStep: { ar: 'اعتمد قاعدة «لكل مخرج آلي مراجع بشري مسؤول»، ودرّب الفريق على قوائم فحص الهلوسة.', en: 'Adopt the rule “every AI output has a named human reviewer”, and train the team on hallucination checklists.' },
  },
  {
    id: 'data_stewardship',
    name: { ar: 'أمانة البيانات (الإشراف على البيانات)', en: 'Data stewardship' },
    description: { ar: 'إدارة جودة البيانات وتعريفاتها ومصادرها وصلاحيات الوصول إليها بوصفها أصلًا مؤسسيًا موثقًا.', en: 'Managing data quality, definitions, lineage and access rights for data as a documented institutional asset.' },
    parentDomain: 'ai-data',
    demandSignal: { ar: 'تأتي مهارات الذكاء الاصطناعي والبيانات الضخمة في {{future-wef-2025-ai-bigdata-top}} بين أسرع المهارات نموًا، ونظام حماية البيانات الشخصية يتطلب ملّاكًا معيّنين للبيانات داخل الجهات.', en: 'AI and big data rank {{future-wef-2025-ai-bigdata-top}} among the fastest-growing skills, and the Personal Data Protection Law requires named data owners inside entities.' },
    governmentRelevance: { ar: 'تبادل البيانات بين الجهات يتعثر دون تعريفات وجودة موثقة، وأمين البيانات يجعل بيانات جهته قابلة للمشاركة بأمان.', en: 'Data exchange between entities stalls without documented definitions and quality; the data steward makes the entity’s data safely shareable.' },
    firstStep: { ar: 'ابدأ بفهرس مبسط لأهم مجموعات البيانات في جهتك: التعريف، والمالك، والجودة، ودرجة الحساسية.', en: 'Start with a lean catalogue of your entity’s most important datasets: definition, owner, quality and sensitivity.' },
  },
  {
    id: 'digital_identity_management',
    name: { ar: 'إدارة الهوية الرقمية', en: 'Digital identity management' },
    description: { ar: 'تصميم دورة حياة الهويات والصلاحيات وتشغيلها (موظفون، مستفيدون، أنظمة) عبر منظومة الدخول الموحد الوطنية.', en: 'Designing and operating identity and access lifecycles (staff, beneficiaries, systems) across the national single sign-on.' },
    parentDomain: 'cloud',
    demandSignal: { ar: 'منصة النفاذ الوطني الموحد (نفاذ) جعلت الهوية الرقمية بنية تشغيلية مشتركة، وتوسع الخدمات الرقمية يرفع الحاجة إلى إدارتها.', en: 'The national single sign-on platform (Nafath) made digital identity shared operational infrastructure, and expanding digital services raise the need to manage it.' },
    governmentRelevance: { ar: 'كل خدمة حكومية رقمية تبدأ بسؤال «من هذا الطرف؟»؛ والإدارة السليمة للهوية تمنع الاحتيال وتختصر الرحلات.', en: 'Every digital government service starts with “who is this party?”; sound identity management prevents fraud and shortens journeys.' },
    firstStep: { ar: 'راجع صلاحيات أنظمة جهتك الحالية (من يملك أي صلاحية) قبل أي شهادة تقنية.', en: 'Review your entity’s current access grants (who holds which right) before any technical certificate.' },
  },
  {
    id: 'threat_modeling',
    name: { ar: 'نمذجة التهديدات', en: 'Threat modeling' },
    description: { ar: 'تحليل منهجي لما قد يهاجم النظام قبل بنائه: الأصول، والمهاجمون، والمسارات المحتملة، ووسائل التخفيف.', en: 'Systematic pre-build analysis of what could attack a system: assets, attackers, likely paths and mitigations.' },
    parentDomain: 'cyber',
    demandSignal: { ar: 'تأتي مهارات الشبكات والأمن السيبراني في {{future-wef-2025-cyber-second}} بين أسرع المهارات نموًا، وضوابط الهيئة الوطنية للأمن السيبراني تتطلب الأمن منذ التصميم.', en: 'Networks and cybersecurity rank {{future-wef-2025-cyber-second}} among the fastest-growing skills, and the National Cybersecurity Authority’s controls require security by design.' },
    governmentRelevance: { ar: 'الخدمات الحكومية أهداف دائمة، ونمذجة التهديدات المبكرة أرخص بكثير من معالجة اختراق خدمة حية يعتمد عليها المستفيدون.', en: 'Government services are standing targets; early threat modeling is far cheaper than remediating a breach of a live service beneficiaries depend on.' },
    firstStep: { ar: 'تعلّم منهجية واحدة (STRIDE) وطبّقها على خدمة رقمية واحدة في جهتك في ورشة نصف يوم.', en: 'Learn one method (STRIDE) and apply it to one of your entity’s digital services in a half-day workshop.' },
  },
  {
    id: 'accessible_content_design',
    name: { ar: 'تصميم محتوى يسهل الوصول إليه', en: 'Accessible content design' },
    description: { ar: 'كتابة محتوى رقمي وتصميمه ليصل إلى ذوي الإعاقة وكبار السن: لغة مبسطة، وتباين واضح، ودعم قارئات الشاشة، وترجمة إشارية عند الحاجة.', en: 'Writing and designing digital content that reaches people with disabilities and older people: plain language, clear contrast, screen-reader support and sign interpretation where needed.' },
    parentDomain: 'service-design',
    demandSignal: { ar: 'معايير الخدمات الحكومية الرقمية تتضمن متطلبات لإمكانية الوصول، والإلزام بها اتجاه موثق في الدول المرجعية.', en: 'Digital government service standards include accessibility requirements, and mandating them is a documented direction in reference countries.' },
    governmentRelevance: { ar: 'الخدمة الحكومية ملزمة بخدمة الجميع، والمحتوى غير الميسّر يعني فئات كاملة خارج خدمات هي من حقها.', en: 'A government service must serve everyone; inaccessible content locks whole groups out of services they are entitled to.' },
    firstStep: { ar: 'اختبر صفحة خدمة واحدة بقارئ شاشة وأصلح أوضح مشكلاتها، ثم عمّم القاعدة.', en: 'Test one service page with a screen reader, fix its most visible issues, then generalize the rule.' },
  },
  {
    id: 'digital_twin_operation',
    name: { ar: 'تشغيل التوأم الرقمي', en: 'Digital twin operation' },
    description: { ar: 'تشغيل نماذج رقمية حية لأصول مادية (مبانٍ، شبكات، مدن) وقراءتها لمحاكاة القرارات قبل تنفيذها.', en: 'Operating and reading live digital replicas of physical assets (buildings, networks, cities) to simulate decisions before execution.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'بدأت التوائم الرقمية تظهر في مشاريع تطوير المدن والبنى التحتية (قراءة تحريرية)، ويتوقع {{future-wef-2025-robotics}} من أصحاب العمل أن تحوّل الأنظمة الذاتية أعمالهم.', en: 'Digital twins are starting to appear in city and infrastructure projects (editorial reading), and {{future-wef-2025-robotics}} of employers expect autonomous systems to transform their business.' },
    governmentRelevance: { ar: 'البلديات والمشغلون يحتاجون من يقرأ التوأم لاتخاذ قرارات الصيانة والتخطيط، لا من يبنيه فقط.', en: 'Municipalities and operators need people who can read a twin for maintenance and planning decisions, not only people who build one.' },
    firstStep: { ar: 'ابدأ بأساسيات نظم المعلومات الجغرافية، ثم أداة توأم واحدة على أصل صغير واحد.', en: 'Start with GIS fundamentals, then one twin tool on a single small asset.' },
  },
  {
    id: 'synthetic_media_literacy',
    name: { ar: 'الإلمام بالوسائط الاصطناعية', en: 'Synthetic media literacy' },
    description: { ar: 'التعرف على المحتوى المولّد آليًا (التزييف العميق، الصوت المولّد) والتحقق منه، وفهم حدود الأدلة المرئية والمسموعة.', en: 'Recognizing and verifying machine-generated content (deepfakes, generated voice), and understanding the limits of audio-visual evidence.' },
    parentDomain: 'policy',
    demandSignal: { ar: 'انتشار أدوات توليد الوسائط اتجاه موثق عالميًا، ويجعل التحقق من المحتوى مهارة أساسية لكل موظف.', en: 'The spread of media-generation tools is a documented global trend, and it makes content verification a basic skill for every employee.' },
    governmentRelevance: { ar: 'الشائعات المصنوعة عن الخدمات أو المسؤولين تنتشر أسرع من التصحيح، والجهات تحتاج قدرة رصد ورد سريعة ومنضبطة.', en: 'Fabricated rumours about services or officials spread faster than corrections; entities need fast, disciplined detection and response.' },
    firstStep: { ar: 'درّب فريق الاتصال على أدوات كشف التزييف المتاحة وعلى إجراء تصعيد للحالات المؤكدة.', en: 'Train the communications team on available deepfake-detection tools and on an escalation procedure for confirmed cases.' },
  },
  {
    id: 'climate_tech_literacy',
    name: { ar: 'الإلمام بالتقنيات المناخية', en: 'Climate-tech literacy' },
    description: { ar: 'فهم أساسيات الطاقة المتجددة والتخزين واحتجاز الكربون وكفاءة المياه بما يكفي لتقييم المقترحات ومتابعة المؤشرات.', en: 'Enough understanding of renewables, storage, carbon capture and water efficiency to evaluate proposals and track indicators.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'دخلت الإدارة البيئية لأول مرة {{future-wef-2025-environmental}} مهارات نموًا، ومستهدف المملكة لإنتاج نحو {{future-ksa-renewables-target}} من الكهرباء من مصادر متجددة بحلول 2030 يصنع حاجة حكومية.', en: 'Environmental stewardship entered the {{future-wef-2025-environmental}} fastest-growing skills for the first time, and the Kingdom’s target of about {{future-ksa-renewables-target}} of electricity from renewables by 2030 creates a government need.' },
    governmentRelevance: { ar: 'الجهات مطالبة بتقارير استدامة ومشتريات خضراء، والإلمام المناخي يحوّل الامتثال من عبء ورقي إلى قرارات أذكى.', en: 'Entities face sustainability reporting and green procurement; climate literacy turns compliance from paperwork into better decisions.' },
    firstStep: { ar: 'تعلّم قراءة تقرير مبسط للبصمة الكربونية لمنشأة واحدة في جهتك.', en: 'Learn to read a simplified carbon-footprint report for one of your entity’s facilities.' },
  },
  {
    id: 'human_ai_collaboration_design',
    name: { ar: 'تصميم التعاون بين الإنسان والذكاء الاصطناعي', en: 'Human-AI collaboration design' },
    description: { ar: 'تقسيم العمل بين الإنسان والنموذج داخل الإجراءات: ما يُؤتمت، وما يُعزَّز، وما يبقى بشريًا، مع تصميم نقاط المراجعة.', en: 'Dividing work between people and models inside procedures: what is automated, what is augmented, what stays human, with review checkpoints designed in.' },
    parentDomain: 'service-design',
    demandSignal: { ar: 'يخطط {{future-wef-2025-reskill}} من أصحاب العمل لإعادة تأهيل موظفيهم للعمل مع الذكاء الاصطناعي.', en: '{{future-wef-2025-reskill}} of employers plan to reskill their workforce to work alongside AI.' },
    governmentRelevance: { ar: 'إعادة هندسة إجراءات الخدمة حول الذكاء الاصطناعي دون نقاط مراجعة مصممة تنتج أتمتة خطرة أو استخدامًا شكليًا لا قيمة له.', en: 'Re-engineering service procedures around AI without designed checkpoints produces either risky automation or token use with no value.' },
    firstStep: { ar: 'ارسم إجراءً واحدًا في إدارتك وصنّف كل خطوة فيه: أتمتة، أو تعزيز، أو عمل بشري.', en: 'Map one procedure in your unit and classify each step: automate, augment or human work.' },
  },
  {
    id: 'privacy_engineering',
    name: { ar: 'هندسة الخصوصية', en: 'Privacy engineering' },
    description: { ar: 'ترجمة متطلبات حماية البيانات إلى تصميم تقني: تقليل البيانات، وإخفاء الحقول الحساسة، وصلاحيات الوصول، وسجلات المعالجة.', en: 'Translating data-protection requirements into technical design: minimization, masking, access rights and processing records.' },
    parentDomain: 'cyber',
    demandSignal: { ar: 'سريان نظام حماية البيانات الشخصية منذ سبتمبر 2024 يجعل الخصوصية متطلبًا هندسيًا لا نظاميًا فقط.', en: 'The Personal Data Protection Law, in force since September 2024, makes privacy an engineering requirement, not only a legal one.' },
    governmentRelevance: { ar: 'الجهات تعالج بيانات المستفيدين على نطاق واسع، والخطأ الهندسي في الخصوصية مخالفة نظامية وإضرار بالثقة معًا.', en: 'Entities process beneficiary data at scale; a privacy engineering error is both a legal breach and a loss of trust.' },
    firstStep: { ar: 'نفّذ تقييم أثر لحماية البيانات (DPIA) على نظام قائم لتتعلم المنهجية بالممارسة.', en: 'Run a data-protection impact assessment (DPIA) on an existing system to learn the method by doing.' },
  },
  {
    id: 'no_code_automation',
    name: { ar: 'الأتمتة دون برمجة', en: 'No-code automation' },
    description: { ar: 'بناء تدفقات عمل آلية (موافقات، إشعارات، ربط نماذج) بأدوات مرئية دون كتابة شيفرة، مع حوكمة تمنع فوضى الأتمتة.', en: 'Building automated workflows (approvals, notifications, form wiring) with visual tools and no code, with governance that prevents automation sprawl.' },
    parentDomain: 'agile',
    demandSignal: { ar: 'مهارات وكلاء الذكاء الاصطناعي والأتمتة {{future-coursera-2026-agentic}} على منصة تعلم عالمية، والأدوات دون برمجة توسّع دائرة من يستطيع الأتمتة داخل الإدارة.', en: 'AI-agent and automation skills are {{future-coursera-2026-agentic}} on a global learning platform, and no-code tools widen who inside a unit can automate.' },
    governmentRelevance: { ar: 'طوابير الموافقات اليدوية من أسرع مكاسب التحول الرقمي، لكن الأتمتة غير المحوكمة تصنع أنظمة ظل خارج الرقابة.', en: 'Manual approval queues are among the quickest digital-transformation wins, but ungoverned automation creates shadow systems outside oversight.' },
    firstStep: { ar: 'أتمت إجراءً ورقيًا متكررًا واحدًا (كطلب إجازة داخلي) بالأداة المعتمدة في جهتك.', en: 'Automate one recurring paper procedure (such as an internal leave request) with your entity’s approved tool.' },
  },
  {
    id: 'geospatial_analysis',
    name: { ar: 'التحليل الجيومكاني', en: 'Geospatial analysis' },
    description: { ar: 'تحليل البيانات المكانية (الخرائط، وصور الأقمار الصناعية، والحدود الإدارية) لدعم قرارات التخطيط والخدمات الميدانية.', en: 'Analyzing spatial data (maps, satellite imagery, administrative boundaries) to support planning and field-service decisions.' },
    parentDomain: 'emerging',
    demandSignal: { ar: 'الرصد الأرضي والتوائم الرقمية والبرنامج الفضائي الوطني توسّع الحاجة إلى قراءة البيانات المكانية.', en: 'Earth observation, digital twins and the national space programme widen the need to read spatial data.' },
    governmentRelevance: { ar: 'قرارات البلديات والنقل والبيئة مكانية بطبيعتها، وتحليل «أين» يحسّن توزيع الخدمات وكشف الفجوات.', en: 'Municipal, transport and environmental decisions are spatial by nature; analysing “where” improves service distribution and gap detection.' },
    firstStep: { ar: 'ابدأ بأداة خرائط مفتوحة (QGIS) وارسم توزيع مستفيدي خدمة واحدة على الخريطة.', en: 'Start with an open mapping tool (QGIS) and plot one service’s beneficiary distribution.' },
  },
  {
    id: 'behavioral_data_ethics',
    name: { ar: 'أخلاقيات البيانات السلوكية', en: 'Behavioural data ethics' },
    description: { ar: 'الحكم الأخلاقي على استخدام البيانات السلوكية (التفاعلات، والأنماط، والتنبؤ بالسلوك): الموافقة، والعدالة، وتجنب التلاعب.', en: 'Ethical judgment over behavioural-data use (interactions, patterns, behaviour prediction): consent, fairness and avoiding manipulation.' },
    parentDomain: 'policy',
    demandSignal: { ar: 'الذكاء الاصطناعي المسؤول أولوية معلنة في الاستراتيجية الوطنية للبيانات والذكاء الاصطناعي، وتوسع أنظمة التوصية الحكومية يتطلب حكمًا أخلاقيًا موثقًا.', en: 'Responsible AI is a stated priority of the national data and AI strategy, and expanding government recommendation systems require documented ethical judgment.' },
    governmentRelevance: { ar: 'الخدمة التي «تتنبأ» بسلوك المستفيدين قد تتحسن بالبيانات السلوكية أو تنزلق إلى تمييز وتلاعب، والحد الفاصل مهارة لا نص نظامي وحده.', en: 'A service that “predicts” beneficiary behaviour can improve with behavioural data or slide into discrimination and manipulation; the dividing line is a skill, not a statute alone.' },
    firstStep: { ar: 'اقرأ مبادئ أخلاقيات الذكاء الاصطناعي المنشورة وطنيًا، وطبّق قائمة فحصها على مشروع واحد.', en: 'Read the nationally published AI ethics principles and apply their checklist to one project.' },
  },
]

// ── Tasks that decline by 2030 (task-vs-job nuance kept, government scope) ──

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
    evidence: { ar: 'يأتي موظفو إدخال البيانات في {{future-wef-2025-decline-data-entry}} بين أسرع الوظائف تراجعًا في العالم، والأعمال المكتبية {{leaders-ilo-2025-clerical}} للذكاء الاصطناعي التوليدي.', en: 'Data-entry clerks rank {{future-wef-2025-decline-data-entry}} among the fastest-declining jobs worldwide, and clerical work tops the ILO exposure ranking for generative AI ({{leaders-ilo-2025-clerical}}).' },
    nuance: { ar: 'تتراجع المهمة لا كل وظيفة تتضمنها: من ينتقل إلى ضمان جودة البيانات يبقى مطلوبًا، والفرق بين من يُدخل البيانات ومن يضمن صحتها.', en: 'The task declines, not every job containing it: those who move to data-quality assurance stay in demand; the difference is between entering data and guaranteeing it.' },
    pivot: { ar: 'تعلّم قصير في تحليل البيانات وجودتها، ثم انتقال إلى مهام ضمان جودة البيانات داخل الجهة.', en: 'Short learning in data analysis and quality, then a move into data-quality assurance tasks inside the entity.' },
  },
  {
    id: 'basic_translation',
    name: { ar: 'الترجمة العامة غير المتخصصة', en: 'Generic (non-specialized) translation' },
    evidence: { ar: 'الترجمة الآلية والنماذج اللغوية تغطي الترجمة الروتينية بجودة عملية، ومهام اللغة المكتوبة من أكثر المهام تعرضًا للذكاء الاصطناعي التوليدي بحسب منظمة العمل الدولية (2025).', en: 'Machine translation and language models now cover routine translation at usable quality, and written-language tasks are among those most exposed to generative AI according to the ILO (2025).' },
    nuance: { ar: 'الترجمة القانونية والطبية والترجمة الفورية في المؤتمرات تبقى بشرية بسبب المساءلة؛ ما يتراجع هو النص العام غير المتخصص، لا مهنة الترجمة كلها.', en: 'Legal, medical and conference interpreting stay human because of accountability; what declines is generic text, not the translation profession.' },
    pivot: { ar: 'التخصص (قانوني أو تقني) أو التحرير بعد الترجمة الآلية: مراجعة الناتج واعتماده بدل إنتاجه.', en: 'Specialize (legal or technical) or move to post-editing machine translation: reviewing and signing off output instead of producing it.' },
  },
  {
    id: 'tier1_support_scripts',
    name: { ar: 'الدعم المباشر بالردود المُعدّة مسبقًا (المستوى الأول)', en: 'Scripted first-line support' },
    evidence: { ar: 'خدمة العملاء بالمساعدات اللغوية من أوضح تطبيقات الذكاء الاصطناعي التوليدي في التشغيل الفعلي، ويتوقع {{leaders-wef-2025-ai-transform}} من أصحاب العمل أن يحوّل الذكاء الاصطناعي أعمالهم.', en: 'Language-model service assistants are among the clearest generative-AI deployments in live operation, and {{leaders-wef-2025-ai-transform}} of employers expect AI to transform their business.' },
    nuance: { ar: 'الطلب ينتقل إلى المستوى الثاني (الحالات المعقدة) وإدارة تجربة المستفيد: الردود المعدة مسبقًا تُؤتمت، والتعاطف في الحالات الصعبة لا يُؤتمت.', en: 'Demand moves to second-line support (complex cases) and beneficiary-experience management: prepared replies are automated; empathy in difficult cases is not.' },
    pivot: { ar: 'إدارة تجربة المستفيد وتحليل الشكاوى: من الرد على الشكوى إلى منع تكرارها.', en: 'Beneficiary-experience management and complaint analysis: from answering complaints to preventing them.' },
  },
  {
    id: 'routine_bookkeeping',
    name: { ar: 'مسك الدفاتر الروتيني', en: 'Routine bookkeeping' },
    evidence: { ar: 'يأتي موظفو المحاسبة ومسك الدفاتر في {{future-wef-2025-decline-bookkeeping}} بين أسرع الوظائف تراجعًا، والفوترة الإلكترونية في المملكة تؤتمت القيود من المصدر.', en: 'Accounting and bookkeeping clerks rank {{future-wef-2025-decline-bookkeeping}} among the fastest-declining jobs, and e-invoicing in the Kingdom automates entries at the source.' },
    nuance: { ar: 'المحاسبة مهنةٌ تتحوّل ولا تختفي: التحليل والامتثال ينموان بينما يتراجع القيد اليدوي.', en: 'Accounting as a profession is shifting, not disappearing: analysis and compliance grow while manual entry shrinks.' },
    pivot: { ar: 'امتثال الفوترة الإلكترونية والتحليل المالي للجهة، عبر شهادات قصيرة متاحة وطنيًا.', en: 'E-invoicing compliance and financial analysis for the entity, through short credentials available nationally.' },
  },
  {
    id: 'executive_secretary_routine',
    name: { ar: 'الأعمال الإدارية والسكرتارية الروتينية', en: 'Routine administrative and secretarial tasks' },
    evidence: { ar: 'المساعدون الإداريون والسكرتارية التنفيذية {{future-wef-2025-decline-admin}} بالأعداد المطلقة، والجدولة والمحاضر والمراسلات النمطية من أول ما تؤتمته النماذج اللغوية.', en: 'Administrative assistants and executive secretaries are {{future-wef-2025-decline-admin}} in absolute numbers, and scheduling, minutes and template correspondence are among the first tasks language models automate.' },
    nuance: { ar: 'من يدير مكتب القيادة (تنسيق أصحاب المصلحة، والسرية، والحكم على الأولويات) يبقى؛ ما يتراجع هو حجز المواعيد وصياغة الخطابات النمطية.', en: 'Those who run a leadership office (stakeholder coordination, confidentiality, judging priorities) stay; what declines is booking meetings and drafting template letters.' },
    pivot: { ar: 'إدارة مكتب التحول الرقمي أو تنسيق المشاريع: القرب من القيادة مع مهارة رقمية.', en: 'Digital-transformation office management or project coordination: proximity to leadership plus a digital skill.' },
  },
  {
    id: 'template_graphic_production',
    name: { ar: 'الإنتاج الجرافيكي بالقوالب', en: 'Template-based graphic production' },
    evidence: { ar: 'يرد مصممو الجرافيك في {{future-wef-2025-decline-graphic}} من قائمة الوظائف المتراجعة، وأدوات التوليد البصري تنتج القوالب الاجتماعية والإعلانية في ثوانٍ.', en: 'Graphic designers appear at {{future-wef-2025-decline-graphic}} on the declining-jobs list, and image-generation tools produce social and campaign templates in seconds.' },
    nuance: { ar: 'الهوية البصرية الاستراتيجية وتجربة المستخدم تنموان؛ ما يتراجع هو تنفيذ القوالب، لا التصميم بوصفه تفكيرًا.', en: 'Strategic visual identity and user experience are growing; what declines is template execution, not design as thinking.' },
    pivot: { ar: 'تصميم تجربة المستخدم للخدمات الحكومية الرقمية باللغة العربية.', en: 'User-experience design for Arabic-first government digital services.' },
  },
  {
    id: 'first_draft_writing',
    name: { ar: 'صياغة المسودات الأولى والتقارير النمطية', en: 'First drafts and template reports' },
    evidence: { ar: 'النماذج اللغوية تنتج مسودات أولى جيدة للتقارير والخطابات، ومهام الكتابة الروتينية من الأعلى تعرضًا بحسب منظمة العمل الدولية (2025)، ويتوقع {{future-wef-2025-reduce-staff}} من أصحاب العمل تقليص الوظائف حيث يمكن أتمتة المهام.', en: 'Language models produce good first drafts of reports and letters, routine writing tasks are among the most exposed according to the ILO (2025), and {{future-wef-2025-reduce-staff}} of employers expect to reduce staff where tasks can be automated.' },
    nuance: { ar: 'انتقلت القيمة من «كتابة المسودة» إلى «ضبط الحقيقة والنبرة والمساءلة»: المحرر الذي يتحقق ويوقّع باسمه أثمن من كاتب المسودة.', en: 'Value moved from “writing the draft” to “owning accuracy, tone and accountability”: the editor who verifies and signs is worth more than the drafter.' },
    pivot: { ar: 'التحرير والتحقق من مخرجات الذكاء الاصطناعي (مهارة في القسم أعلاه): من الإنتاج إلى الاعتماد.', en: 'Editing and AI-output verification (a skill in the section above): from production to sign-off.' },
  },
]

// ── Adoption playbook for government entities (rendered by Entities.tsx) ───

export interface PlaybookSection {
  id: string
  title: L
  items: { ar: string; en: string }[]
}

export const playbookSections: PlaybookSection[] = [
  {
    id: 'governance',
    title: { ar: 'الحوكمة والرعاية', en: 'Governance and sponsorship' },
    items: [
      { ar: 'عيّن مالكًا تنفيذيًا واضحًا بقرار إداري مكتوب، عادةً مدير عام الموارد البشرية أو وكيل الجهة المسؤول عن التحول الرقمي.', en: 'Assign a named executive owner by written administrative decision, typically the director general of human resources or the deputy responsible for digital transformation.' },
      { ar: 'شكّل لجنة توجيه ثلاثية: الموارد البشرية، وتقنية المعلومات، وممثل لتخطيط القدرات؛ تجتمع شهريًا في الأشهر الستة الأولى.', en: 'Form a three-party steering committee: human resources, IT and a workforce-planning representative; it meets monthly for the first six months.' },
      { ar: 'اربط المبادرة بمرجعيات وطنية: أطر القدرات الرقمية الحكومية، ومستهدفات برنامج تنمية القدرات البشرية، وضوابط حماية البيانات الشخصية.', en: 'Anchor the initiative to national references: government digital-capability frameworks, Human Capability Development Program targets and personal-data-protection rules.' },
    ],
  },
  {
    id: 'customization',
    title: { ar: 'نقاط التخصيص', en: 'Customization points' },
    items: [
      { ar: 'مطابقة الأدوار: طابق العائلات الوظيفية في جهتك مع مكتبة الأدوار، وابدأ بالأدوار الأكثر عددًا لا بكل الأدوار.', en: 'Role mapping: match your entity’s job families to the role library, starting with the most populous roles rather than all of them.' },
      { ar: 'أوزان المجالات: رتّب أولوية المجالات الثمانية بحسب مهام جهتك (جهة صحية تقدّم البيانات والمعلوماتية؛ وبلدية تقدّم البيانات المكانية وتصميم الخدمات).', en: 'Domain priorities: order the eight domains by your entity’s mandate (a health entity puts data and informatics first; a municipality puts spatial data and service design first).' },
      { ar: 'العربية أولًا: اعتمد المحتوى العربي أساسًا، مع ذكر المصطلح الإنجليزي للمفاهيم التقنية عند أول ورود.', en: 'Arabic first: use Arabic content as the default, giving the English term for technical concepts on first use.' },
    ],
  },
  {
    id: 'integration',
    title: { ar: 'التكامل مع المنظومة الوطنية', en: 'National ecosystem integration' },
    items: [
      { ar: 'برامج التدريب الحكومية: وجّه أولويات التطوير المجمّعة إلى مقدمي التدريب الحكوميين، مثل «برنامج قدراتك» ومعهد الإدارة العامة وأكاديمية سدايا والأكاديمية السعودية الرقمية، عبر اتفاقيات مقاعد مؤسسية بدل التسجيل الفردي.', en: 'Government training programmes: route aggregated development priorities to government training providers, such as «برنامج قدراتك», the Institute of Public Administration, SDAIA Academy and the Saudi Digital Academy, through institutional seat agreements rather than individual enrolment.' },
      { ar: 'الاحتياجات على مستوى الجهة: ما يتجاوز تطوير الأفراد (حوكمة، تصميم خدمات، تبنٍّ تقني) يُطلب عبر «منصة الاستشارات والدراسات».', en: 'Entity-level needs: what goes beyond individual development (governance, service design, technology adoption) is requested through «منصة الاستشارات والدراسات».' },
      { ar: 'الأنظمة الإدارية: لا تُربط نتائج التقييم بملف الموظف ولا بنظام الموارد البشرية ولا بالترشيح أو المفاضلة؛ تُستخدم التقارير المجمّعة وحدها لتخطيط التدريب.', en: 'Administrative systems: assessment results are not linked to the employee file, the HR system, nomination or selection; only aggregated reports are used for training planning.' },
    ],
  },
  {
    id: 'privacy',
    title: { ar: 'الخصوصية وحماية بيانات التقييم', en: 'Privacy and assessment-data protection' },
    items: [
      { ar: 'نتائج التقييم بيانات شخصية بموجب نظام حماية البيانات الشخصية (ساري الإلزام منذ سبتمبر 2024): عيّن مسؤول حماية بيانات، وحدّد الأساس النظامي للمعالجة (موافقة الموظف أو مصلحة مشروعة موثقة).', en: 'Assessment results are personal data under the Personal Data Protection Law (in force since September 2024): appoint a data-protection officer and document the legal basis for processing (employee consent or a documented legitimate interest).' },
      { ar: 'التقليل والتجميع: اجمع أقل بيانات ممكنة، واعرض على الإدارة العليا تقارير مجمّعة فقط؛ لا تُعرض نتيجة فرد إلا للفرد نفسه.', en: 'Minimization and aggregation: collect the minimum, and show senior management aggregated reports only; an individual’s result is visible to that person only.' },
      { ar: 'الإقامة والاحتفاظ: استضف بيانات التقييم داخل المملكة أو على بنية معتمدة، وحدّد مدة احتفاظ قصيرة وسياسة حذف عند الانتقال أو التقاعد.', en: 'Residency and retention: host assessment data in the Kingdom or on approved infrastructure, and set a short retention period and a deletion policy on transfer or retirement.' },
      { ar: 'حق الاطلاع والتصحيح: يستطيع الموظف رؤية نتيجته كاملة والاعتراض عليها؛ فالشفافية شرط الثقة، والثقة شرط صدق الإجابات.', en: 'Access and correction rights: every employee can see their full result and contest it; transparency is a condition of trust, and trust is a condition of honest answers.' },
      { ar: 'حد الاستخدام الصارم: النتائج للتخطيط التطويري فقط، ولا تُستخدم في التوظيف أو الترقية أو المفاضلة أو تقييم الأداء الرسمي، داخل الجهة أو خارجها.', en: 'A strict usage boundary: results are for development planning only, never for hiring, promotion, selection or formal performance evaluation, inside or outside the entity.' },
    ],
  },
]

/**
 * Indicators that respect anonymity and opt-in. Targets are editorial suggestions:
 * no numeric target is invented; each entity sets its own after measuring a baseline.
 */
export const playbookKpis: { kpi: L; description: L; target: L }[] = [
  {
    kpi: { ar: 'المشاركة الطوعية', en: 'Voluntary participation' },
    description: { ar: 'من أكملوا التقييم الذاتي طوعًا، ويُقرأ مجمّعًا فقط', en: 'People who completed the self-assessment voluntarily, read in aggregate only' },
    target: { ar: 'تقدير تحريري: خط أساس في الربع الأول، ثم هدف تحدده الجهة', en: 'Editorial suggestion: a baseline in the first quarter, then a target the entity sets' },
  },
  {
    kpi: { ar: 'تغطية الأدوار', en: 'Role coverage' },
    description: { ar: 'العائلات الوظيفية في الجهة التي لها ملف مهاري مرجعي', en: 'Job families in the entity that have a reference skill profile' },
    target: { ar: 'تقدير تحريري: يبدأ بالأدوار الأكثر عددًا ويتوسع تدريجيًا', en: 'Editorial suggestion: start with the most populous roles and widen gradually' },
  },
  {
    kpi: { ar: 'تقدم التطوير', en: 'Development progress' },
    description: { ar: 'من يُبلغون طوعًا عن تقدم في مجال واحد على الأقل خلال نصف عام', en: 'People who voluntarily report progress in at least one domain within half a year' },
    target: { ar: 'تقدير تحريري: يُقرأ اتجاهًا مجمّعًا لا هدفًا فرديًا', en: 'Editorial suggestion: read as an aggregate trend, not an individual target' },
  },
  {
    kpi: { ar: 'إتمام التعلم', en: 'Learning completion' },
    description: { ar: 'إتمام مسار تعلم مرتبط بأولوية تطوير مقترحة', en: 'Completing a learning path tied to a suggested development priority' },
    target: { ar: 'تقدير تحريري: هدف تحدده الجهة بعد قياس خط الأساس', en: 'Editorial suggestion: a target the entity sets after measuring a baseline' },
  },
  {
    kpi: { ar: 'تغطية خطط التطوير', en: 'Development-plan coverage' },
    description: { ar: 'موظفون لديهم خطة تطوير نشطة مرتبطة بأولوية تطوير مقترحة، دون أي قرار توظيف أو ترقية مبني على النتائج', en: 'Employees with an active development plan tied to a suggested development priority, with no hiring or promotion decision based on results' },
    target: { ar: 'تقدير تحريري: خط أساس ثم نمو', en: 'Editorial suggestion: a baseline, then growth' },
  },
  {
    kpi: { ar: 'صورة المجالات', en: 'Domain picture' },
    description: { ar: 'توزيع مجمّع للمستويات في كل مجال من المجالات الثمانية، دون عرض أي فرد', en: 'An aggregated distribution of levels in each of the eight domains, with no individual shown' },
    target: { ar: 'تقرير فصلي للجنة التوجيه', en: 'Quarterly report to the steering committee' },
  },
]
