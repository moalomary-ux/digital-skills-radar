import type { L } from './types'

/**
 * Emerging Technology Radar dataset — 48 technologies, 6 clusters × 8.
 * Converted from research/tech-radar.md (v1.0, 2026).
 * Skill-domain foreign keys are normalized to the app's domain ids
 * (ai-data, cyber, cloud, service-design, policy, agile, emerging, leadership).
 */

export type Horizon = 'now' | 'near' | 'far'

export interface TechCluster {
  id: string
  name: L
  essay: L
}

export interface Technology {
  id: string // e.g. C1-T01
  clusterId: string
  name: L
  description: L
  trl: number // 1-9 NASA scale
  trlRationale: string // source-language (EN) rationale
  sectors: string[] // affinity sector keys
  domainIds: string[] // app domain ids
  employeeSkills: string[] // source-language (EN) skill labels
  horizon: Horizon
  learningFocus: { awareness: string; practitioner: string } // source-language (EN)
}

export interface Sector {
  id: string
  name: L
}

export const sectors: Sector[] = [
  { id: 'healthcare', name: { ar: 'الصحة', en: 'Healthcare' } },
  { id: 'education-training', name: { ar: 'التعليم والتدريب', en: 'Education & Training' } },
  { id: 'urban-mobility-smart-cities', name: { ar: 'التنقل الحضري والمدن الذكية', en: 'Urban Mobility & Smart Cities' } },
  { id: 'travel-tourism-culture', name: { ar: 'السفر والسياحة والثقافة', en: 'Travel, Tourism & Culture' } },
  { id: 'social-development-justice', name: { ar: 'التنمية الاجتماعية والعدالة', en: 'Social Development & Justice' } },
  { id: 'energy-natural-resources', name: { ar: 'الطاقة والموارد الطبيعية', en: 'Energy & Natural Resources' } },
  { id: 'trade-finance-economy', name: { ar: 'التجارة والمالية والاقتصاد', en: 'Trade, Finance & Economy' } },
]

export const sectorById = (id: string): Sector => sectors.find((s) => s.id === id)!

export const horizonMeta: Record<Horizon, { name: L; years: L; color: string }> = {
  now: {
    name: { ar: 'الآن', en: 'Now' },
    years: { ar: '0–2 سنة', en: '0–2 years' },
    color: '#1B8354',
  },
  near: {
    name: { ar: 'قريبًا', en: 'Near' },
    years: { ar: '2–5 سنوات', en: '2–5 years' },
    color: '#DBA102',
  },
  far: {
    name: { ar: 'بعيد المدى', en: 'Far' },
    years: { ar: '5–10 سنوات', en: '5–10 years' },
    color: '#94a3b8',
  },
}

export const trlZones = [
  { from: 1, to: 3, name: { ar: 'بحث ومفاهيم أولية', en: 'Research & early concepts' } },
  { from: 4, to: 6, name: { ar: 'تطوير وتحقق تجريبي', en: 'Development & validation' } },
  { from: 7, to: 9, name: { ar: 'نشر وتشغيل فعلي', en: 'Deployment & operations' } },
]

export const techClusters: TechCluster[] = [
  {
    id: 'intelligent-government-ai',
    name: { ar: 'الحكومة الذكية والذكاء الاصطناعي', en: 'Intelligent Government & AI' },
    essay: {
      en: 'Artificial intelligence has moved from pilot projects to the operational core of government: generative AI drafts correspondence and summarizes legislation, predictive models target inspections and anticipate demand, and agentic systems are beginning to execute multi-step administrative workflows end to end. For Saudi Arabia — with a national AI strategy, a sovereign Arabic model (ALLaM), and an emerging-tech adoption index already above 76% — the differentiator is no longer access to AI but the workforce’s ability to govern, evaluate, and supervise it. The skills shift is profound: civil servants must move from using tools to directing intelligent systems, with fluency in prompt design, model evaluation, bias detection, and AI accountability becoming as foundational as spreadsheet literacy once was.',
      ar: 'انتقل الذكاء الاصطناعي من المشاريع التجريبية إلى صميم العمل الحكومي: فالذكاء الاصطناعي التوليدي يصيغ المراسلات ويلخص التشريعات، والنماذج التنبؤية توجّه عمليات التفتيش وتستبق الطلب، والأنظمة الوكيلة بدأت تنفذ إجراءات إدارية متعددة الخطوات من البداية إلى النهاية. وفي المملكة العربية السعودية — التي تملك استراتيجية وطنية للذكاء الاصطناعي ونموذجاً لغوياً عربياً سيادياً (علّام) ومؤشر تبنٍّ للتقنيات الناشئة تجاوز 76٪ — لم تعد الميزة التنافسية في الوصول إلى الذكاء الاصطناعي، بل في قدرة القوى العاملة على حوكمته وتقييمه والإشراف عليه. والتحول المهاري عميق: إذ يجب أن ينتقل الموظف الحكومي من استخدام الأدوات إلى توجيه الأنظمة الذكية، بحيث تصبح الطلاقة في تصميم الأوامر وتقييم النماذج وكشف التحيز والمساءلة عن الذكاء الاصطناعي أساسية كما كانت مهارة الجداول الإلكترونية في جيل سابق.',
    },
  },
  {
    id: 'data-infrastructure-sovereignty',
    name: { ar: 'البنية التحتية للبيانات والسيادة الرقمية', en: 'Data Infrastructure & Sovereignty' },
    essay: {
      en: 'Data has become the strategic substrate of digital government, and where it lives — and who controls it — is now a matter of national policy. Saudi Arabia is investing heavily in sovereign cloud, national data platforms, and AI-grade data centers (including SDAIA’s Hexagon and HUMAIN’s planned capacity), mirroring a global shift the OECD and Gartner call geopatriation: the deliberate migration of critical workloads to locally governed infrastructure. For public servants, the implication is that data literacy is no longer optional and infrastructure decisions are policy decisions; skills in data governance, interoperability, sovereign architecture assessment, and privacy-preserving analytics determine whether the Kingdom’s data wealth translates into public value.',
      ar: 'أصبحت البيانات الأساس الاستراتيجي للحكومة الرقمية، وأصبح مكان وجودها ومن يسيطر عليها شأناً من شؤون السياسة الوطنية. وتستثمر المملكة بكثافة في السحابة السيادية والمنصات الوطنية للبيانات ومراكز البيانات المخصصة للذكاء الاصطناعي (بما فيها مركز «سدايا هكساغون» والقدرات المخططة لدى «هيومين»)، في توجه عالمي تصفه OECD وغارتنر بـ«التوطين الجغرافي»: النقل المتعمد للأحمال الحرجة إلى بنية تحتية خاضعة للحوكمة المحلية. وبالنسبة للموظف الحكومي، فإن الثقافة البياناتية لم تعد خياراً، وقرارات البنية التحتية أصبحت قرارات سياساتية؛ فمهارات حوكمة البيانات وقابلية التشغيل البيني وتقييم البنى السيادية والتحليلات المعززة للخصوصية هي ما يحدد إن كانت ثروة المملكة البياناتية ستتحول إلى قيمة عامة فعلية.',
    },
  },
  {
    id: 'trust-security-digital-identity',
    name: { ar: 'الثقة والأمن والهوية الرقمية', en: 'Trust, Security & Digital Identity' },
    essay: {
      en: 'Trust is the currency of digital government, and 2026 is the year it becomes engineered rather than assumed. Digital identity wallets are moving to national scale, post-quantum cryptography has shifted from research to mandated migration planning as ’harvest now, decrypt later’ attacks make delay costly, and AI-generated disinformation has made content provenance a public-safety issue. For government employees, cybersecurity is no longer a specialist silo: every service owner must understand identity assurance, zero-trust principles, and the integrity of digital content. The workforce that masters these foundations will determine whether citizens experience digital government as convenient — and safe — or as a new vector of risk.',
      ar: 'الثقة هي عملة الحكومة الرقمية، وعام 2026 هو العام الذي تصبح فيه الثقة مسألة هندسية لا أمراً مفترضاً. فمحافظ الهوية الرقمية تنتقل إلى النطاق الوطني، والتشفير المقاوم للحوسبة الكمومية تحول من البحث إلى خطط ترحيل إلزامية مع جعل هجمات «احصد الآن وافكك لاحقاً» للتأخير كلفة باهظة، والمعلومات المضللة المولّدة بالذكاء الاصطناعي جعلت إثبات أصالة المحتوى قضية سلامة عامة. وبالنسبة للموظف الحكومي، لم يعد الأمن السيبراني تخصصاً منعزلاً: فعلى كل مالك خدمة أن يفهم ضمان الهوية ومبادئ انعدام الثقة وسلامة المحتوى الرقمي. والقوى العاملة التي تتقن هذه الأسس هي من ستحدد ما إذا كان المواطن سيعيش الحكومة الرقمية تجربة مريحة وآمنة، أم مصدراً جديداً للمخاطر.',
    },
  },
  {
    id: 'citizen-experience-delivery',
    name: { ar: 'تجربة المستفيد وتقديم الخدمات', en: 'Citizen Experience & Service Delivery' },
    essay: {
      en: 'The frontier of digital government has shifted from putting forms online to anticipating needs before citizens ask. The OECD’s 2026 outlook describes the move from reactive to proactive and life-event-based services as the defining test of digital maturity, and conversational AI is collapsing the distance between citizens and bureaucracy — in Arabic and English alike. For Saudi Arabia, where platforms like Tawakkalna and Absher have already normalized high-quality digital public services, the next skills frontier is empathy at scale: journey mapping, inclusive design, service analytics, and the ability to orchestrate AI-driven personalization without eroding trust or excluding the vulnerable.',
      ar: 'انتقلت حدود الحكومة الرقمية من مجرد إتاحة النماذج عبر الإنترنت إلى استباق احتياجات المواطنين قبل أن يطلبوها. ويصف تقرير OECD لعام 2026 التحول من الخدمات التفاعلية إلى الخدمات الاستباقية المبنية على أحداث الحياة بأنه الاختبار الحقيقي للنضج الرقمي، فيما تختصر المساعدات الحوارية المسافة بين المواطن والبيروقراطية — بالعربية والإنجليزية معاً. وفي المملكة، حيث رسّخت منصات كتوكلنا وأبشر تجربة خدمات حكومية رقمية عالية الجودة، فإن الحدود المهارية التالية هي التعاطف على نطاق واسع: رسم رحلات المستفيد، والتصميم الشامل، وتحليلات الخدمة، والقدرة على توظيف التخصيص الذكي دون إضعاف الثقة أو إقصاء الفئات الأكثر احتياجاً.',
    },
  },
  {
    id: 'smart-cities-sustainability',
    name: { ar: 'المدن الذكية والاستدامة', en: 'Smart Cities & Sustainability' },
    essay: {
      en: 'Saudi Arabia’s giga-projects — NEOM, the Line, and smart districts in Riyadh — have made the Kingdom a living laboratory for urban technology, while the Saudi Green Initiative sets binding sustainability expectations for every public entity. The technologies in this cluster turn cities into sensing, responsive organisms: collaborative sensor networks coordinate traffic and emergency services in real time, digital twins let planners test decisions before pouring concrete, and carbon-accounting platforms make emissions a managed KPI rather than an estimate. The skills challenge is hybrid by nature — civil servants must blend infrastructure engineering literacy with data analytics and environmental policy to govern cities that are simultaneously physical and digital.',
      ar: 'جعلت المشاريع العملاقة في المملكة — نيوم، وذا لاين، والأحياء الذكية في الرياض — من المملكة مختبراً حياً لتقنيات المدن، فيما تفرض مبادرة السعودية الخضراء توقعات استدامة ملزمة على كل جهة عامة. وتقنيات هذه المجموعة تحول المدن إلى كائنات حساسة متجاوبة: فشبكات الاستشعار التعاونية تنسق المرور وخدمات الطوارئ في الوقت الحقيقي، والتوائم الرقمية تتيح للمخططين اختبار القرارات قبل صب الخرسانة، ومنصات المحاسبة الكربونية تحول الانبعاثات إلى مؤشر أداء مُدار لا مجرد تقدير. أما التحدي المهاري فهجين بطبيعته — إذ على الموظف الحكومي أن يجمع بين الثقافة الهندسية للبنية التحتية وتحليلات البيانات وسياسات البيئة ليحكم مدناً هي في آن واحد مادية ورقمية.',
    },
  },
  {
    id: 'frontier-deep-tech',
    name: { ar: 'التقنيات الحدودية والعميقة', en: 'Frontier & Deep Tech' },
    essay: {
      en: 'Frontier technologies are the longest-horizon bets on this radar — quantum computing, 6G, neuromorphic chips, and brain-computer interfaces are years from routine government use, yet they are precisely where strategic unpreparedness becomes irreversible. Saudi Arabia is already hedging intelligently: central-bank digital currency experiments, CST’s regulatory sandbox for novel networks, and national investment in quantum-safe planning signal a state that watches the far horizon while building for today. For most government employees, the required skill is not engineering depth but foresight literacy — the ability to track maturity signals, run horizon-scanning exercises, and distinguish genuine inflection points from hype cycles.',
      ar: 'التقنيات الحدودية هي الرهانات الأبعد أفقاً في هذا الرادار — فالحوسبة الكمومية والجيل السادس والرقائق العصبية وواجهات الدماغ الحاسوبية ما تزال بعيدة سنوات عن الاستخدام الحكومي المعتاد، ومع ذلك فهي تحديداً حيث يصبح غياب الاستعداد الاستراتيجي أمراً لا يمكن تداركه. والمملكة تحوّطت بالفعل بذكاء: فتجارب العملة الرقمية للبنك المركزي، والبيئة التنظيمية التجريبية لهيئة الاتصالات والفضاء والتقنية، والاستثمار الوطني في التخطيط الآمن كمّياً، كلها إشارات إلى دولة تراقب الأفق البعيد وهي تبني للحاضر. وبالنسبة لمعظم الموظفين الحكوميين، المهارة المطلوبة ليست العمق الهندسي بل ثقافة الاستشراف — القدرة على تتبع مؤشرات النضج وإجراء تمارين مسح الآفاق والتمييز بين نقاط التحول الحقيقية ودورات الضجيج.',
    },
  },
]

export const techClusterById = (id: string): TechCluster => techClusters.find((c) => c.id === id)!

// ── The 48 technologies ─────────────────────────────────────────────────────

export const technologies: Technology[] = [
  // Cluster 1 — Intelligent Government & AI
  {
    id: 'C1-T01', clusterId: 'intelligent-government-ai',
    name: { ar: 'الذكاء الاصطناعي التوليدي في الخدمات الحكومية', en: 'Generative AI for Government Services' },
    description: {
      ar: 'نماذج لغوية وتوليدية تُستخدم في صياغة الوثائق وتلخيص التشريعات والرد على استفسارات المستفيدين ضمن ضوابط حوكمة رسمية.',
      en: 'Large generative models used to draft documents, summarize legislation, and answer citizen queries under formal governance guardrails.',
    },
    trl: 8,
    trlRationale: 'Deployed in production across governments (e.g., chat assistants, document drafting); Gartner places GenAI among transformational government technologies within five years.',
    sectors: ['social-development-justice', 'education-training', 'trade-finance-economy'],
    domainIds: ['ai-data', 'policy'],
    employeeSkills: ['Prompt engineering and evaluation', 'GenAI risk, bias and hallucination assessment', 'AI procurement and acceptable-use policy literacy'],
    horizon: 'now',
    learningFocus: {
      awareness: "What GenAI can/can't do; acceptable use & confidentiality rules",
      practitioner: 'Prompt engineering, output evaluation, hallucination & bias testing',
    },
  },
  {
    id: 'C1-T02', clusterId: 'intelligent-government-ai',
    name: { ar: 'الوكلاء الأذكياء (الذكاء الاصطناعي الوكيل)', en: 'Agentic AI & Autonomous Agents' },
    description: {
      ar: 'أنظمة ذكاء اصطناعي تخطط وتنفذ مهاماً متعددة الخطوات بشكل شبه مستقل، مثل إتمام معاملة حكومية عبر عدة أنظمة دون تدخل بشري مباشر.',
      en: 'AI systems that plan and execute multi-step tasks semi-autonomously, such as completing a government transaction across several systems without direct human input.',
    },
    trl: 5,
    trlRationale: "Topped Gartner's 2025 Hype Cycle for Emerging Technologies at peak expectations; early government pilots exist but validated operational deployments are rare.",
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['ai-data', 'agile', 'policy'],
    employeeSkills: ['Agent workflow design and human-in-the-loop supervision', 'Tool/API orchestration concepts (e.g., MCP)', 'Autonomy risk assessment and escalation design'],
    horizon: 'near',
    learningFocus: {
      awareness: 'What agents are; why human oversight is non-negotiable',
      practitioner: 'Agent workflow design, guardrails, escalation paths, tool orchestration',
    },
  },
  {
    id: 'C1-T03', clusterId: 'intelligent-government-ai',
    name: { ar: 'النماذج اللغوية العربية الكبيرة والسيادية', en: 'Sovereign & Arabic Large Language Models' },
    description: {
      ar: 'نماذج لغوية مدرَّبة على المحتوى العربي وتُشغَّل داخل البنية التحتية الوطنية، كنموذج «علّام» من سدايا/هيومين، لضمان السيادة على البيانات والسياق الثقافي.',
      en: "Language models trained on Arabic content and operated on national infrastructure — such as SDAIA/HUMAIN's ALLaM — ensuring data sovereignty and cultural context.",
    },
    trl: 7,
    trlRationale: 'ALLaM 34B powers HUMAIN Chat in production (Aug 2025); enterprise variants deployed, but broad government integration is still maturing.',
    sectors: ['education-training', 'social-development-justice', 'travel-tourism-culture'],
    domainIds: ['ai-data', 'cloud'],
    employeeSkills: ['Evaluating Arabic LLM quality and dialect coverage', 'Fine-tuning vs. retrieval-augmented generation trade-offs', 'PDPL-compliant deployment of language models'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Why sovereign/Arabic models matter; ALLaM ecosystem awareness',
      practitioner: 'RAG vs. fine-tuning, Arabic evaluation benchmarks, PDPL-compliant deployment',
    },
  },
  {
    id: 'C1-T04', clusterId: 'intelligent-government-ai',
    name: { ar: 'التحليلات التنبؤية في الحكومة', en: 'Predictive Analytics in Government' },
    description: {
      ar: 'استخدام تعلم الآلة والنمذجة على البيانات الداخلية والخارجية للتنبؤ بالطلب على الخدمات والمخاطر الصحية والاحتيال، ودعم السياسات العامة بالأدلة.',
      en: 'Machine learning and modeling over internal and external data to forecast service demand, health risks, and fraud, informing evidence-based public policy.',
    },
    trl: 8,
    trlRationale: 'Re-rated 7→8 (2026 review): two decades of operational government use (fraud detection, demand forecasting) plus documented Saudi deployments — fully operational technology, not just demonstrated.',
    sectors: ['healthcare', 'social-development-justice', 'trade-finance-economy'],
    domainIds: ['ai-data', 'policy'],
    employeeSkills: ['Statistical literacy and model interpretation', 'Bias and fairness auditing of predictive models', 'Translating model outputs into policy decisions'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Reading a prediction; correlation ≠ causation; bias risks',
      practitioner: 'Model lifecycle, fairness auditing, translating outputs into policy',
    },
  },
  {
    id: 'C1-T05', clusterId: 'intelligent-government-ai',
    name: { ar: 'ذكاء القرار', en: 'Decision Intelligence' },
    description: {
      ar: 'منهجية ومنصات تدمج التحليلات والمحاكاة والاستدلال بالذكاء الاصطناعي لهندسة كيفية اتخاذ القرارات الحكومية وتقييم نتائجها وتحسينها باستمرار.',
      en: 'A discipline and platform category combining analytics, simulation, and AI reasoning to engineer how government decisions are made, evaluated, and continuously improved.',
    },
    trl: 6,
    trlRationale: "Progressing through Gartner's Slope of Enlightenment (2025); commercial platforms proven, government adoption in early operational stage.",
    sectors: ['trade-finance-economy', 'urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['ai-data', 'leadership'],
    employeeSkills: ['Decision modeling and causal reasoning', 'Scenario simulation interpretation', 'Cross-agency decision governance'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Evidence-based decision culture; limits of automation',
      practitioner: 'Decision modeling, simulation, feedback-loop design',
    },
  },
  {
    id: 'C1-T06', clusterId: 'intelligent-government-ai',
    name: { ar: 'مساعدو البرمجة بالذكاء الاصطناعي', en: 'AI Code Assistants' },
    description: {
      ar: 'أدوات مدمجة في بيئات التطوير تولّد الشيفرة وتصححها وتوثقها عبر اللغة الطبيعية، وتسرّع بناء الخدمات الرقمية الحكومية وتقلل ديونها التقنية.',
      en: 'Tools embedded in development environments that generate, debug, and document code via natural language, accelerating delivery of digital government services.',
    },
    trl: 8,
    trlRationale: 'Mainstream in industry; Gartner predicts 75% of enterprise engineers will use them by 2028 — government adoption follows closely.',
    sectors: ['trade-finance-economy', 'education-training'],
    domainIds: ['ai-data', 'agile'],
    employeeSkills: ['AI-assisted development workflows and code review', 'Secure prompting for code generation', 'Quality assurance of AI-generated code'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Why agencies adopt them; IP & security caveats',
      practitioner: 'AI-assisted SDLC, secure prompting, AI-generated code review',
    },
  },
  {
    id: 'C1-T07', clusterId: 'intelligent-government-ai',
    name: { ar: 'العملاء الآليون والمعاملات الآلية', en: 'Machine Customers & Automated Transactions' },
    description: {
      ar: 'أنظمة غير بشرية (مساعدات ذكية وأجهزة متصلة) تتفاوض وتشتري وتنجز معاملات نيابة عن المواطنين أو الجهات، كتجديد التراخيص تلقائياً.',
      en: 'Non-human systems (AI assistants, connected devices) that negotiate, purchase, and complete transactions on behalf of citizens or entities, e.g., auto-renewing licenses.',
    },
    trl: 3,
    trlRationale: 'Gartner places machine customers in the Innovation Trigger phase (2025); proofs of concept exist, no operational government deployments.',
    sectors: ['trade-finance-economy', 'social-development-justice'],
    domainIds: ['emerging', 'policy'],
    employeeSkills: ['Machine-to-machine transaction design concepts', 'Legal and liability frameworks for autonomous transactions', 'API economy fundamentals'],
    horizon: 'far',
    learningFocus: {
      awareness: 'The concept; implications for service channels',
      practitioner: 'M2M transaction design, liability frameworks, API economy',
    },
  },
  {
    id: 'C1-T08', clusterId: 'intelligent-government-ai',
    name: { ar: 'منصات حوكمة الذكاء الاصطناعي والشفافية الخوارزمية', en: 'AI Governance & Algorithmic Transparency Platforms' },
    description: {
      ar: 'أدوات وسجلات لتوثيق النماذج وتدقيق التحيز ومراقبة الأداء والامتثال لأطر أخلاقيات الذكاء الاصطناعي، بما يتوافق مع أطر سدايا وتوجهات OECD.',
      en: 'Tools and registries for documenting models, auditing bias, monitoring performance, and complying with AI ethics frameworks, aligned with SDAIA guidelines and OECD trends.',
    },
    trl: 6,
    trlRationale: 'EU AI Act-driven tooling is operational in leading countries; OECD 2026 reports algorithmic transparency mechanisms consolidating — but broad operational use is recent.',
    sectors: ['social-development-justice', 'education-training', 'trade-finance-economy'],
    domainIds: ['policy', 'ai-data'],
    employeeSkills: ['Algorithmic impact assessment', 'Model documentation and audit trails', 'AI ethics frameworks (SDAIA, OECD) application'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Why AI must be registered & auditable; ethics principles',
      practitioner: 'Algorithmic impact assessment, model documentation, audit tooling',
    },
  },
  // Cluster 2 — Data Infrastructure & Sovereignty
  {
    id: 'C2-T01', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'السحابة السيادية', en: 'Sovereign Cloud' },
    description: {
      ar: 'بيئات سحابية خاضعة للاختصاص القضائي والحوكمة الوطنية، تضمن بقاء البيانات الحكومية الحساسة داخل المملكة وبعيدة عن الأطر القانونية الأجنبية.',
      en: 'Cloud environments under national jurisdiction and governance, keeping sensitive government data inside the Kingdom and beyond foreign legal reach.',
    },
    trl: 7,
    trlRationale: 'Operational systems live (KSA cloud region launches, EU Bleu/Delos models); Gartner named geopatriation a top strategic trend for 2026 — adoption scaling but not universal.',
    sectors: ['trade-finance-economy', 'healthcare', 'social-development-justice'],
    domainIds: ['cloud', 'policy'],
    employeeSkills: ['Cloud service assessment and data residency requirements', 'Sovereign vs. hyperscaler architecture trade-offs', 'Cloud procurement and exit-strategy planning'],
    horizon: 'now',
    learningFocus: {
      awareness: 'What data residency means; why sovereignty is policy',
      practitioner: 'Cloud architecture assessment, procurement, exit strategies',
    },
  },
  {
    id: 'C2-T02', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'المنصات الوطنية للبيانات وبحيرات البيانات', en: 'National Data Platforms & Data Lakes' },
    description: {
      ar: 'بنية موحدة لتجميع البيانات الحكومية وإدارتها ومشاركتها، مثل بنك البيانات الوطني ومنصة حوكمة البيانات الوطنية في المملكة، لدعم الخدمات الاستباقية والتحليلات.',
      en: "Unified infrastructure to aggregate, manage, and share government data — e.g., Saudi's National Data Bank and National Data Governance Platform — enabling proactive services and analytics.",
    },
    trl: 8,
    trlRationale: 'Operational in Saudi Arabia and most OECD countries; OECD 2026 reports 8 in 10 countries have government-wide data interoperability systems.',
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['ai-data', 'cloud'],
    employeeSkills: ['Data cataloging and metadata management', 'Data quality and stewardship practices', 'Inter-agency data-sharing agreements'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Data as a national asset; sharing obligations',
      practitioner: 'Cataloging, metadata, data quality, sharing agreements',
    },
  },
  {
    id: 'C2-T03', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'فضاءات البيانات والمشاركة الآمنة للبيانات', en: 'Data Spaces & Secure Data Sharing' },
    description: {
      ar: 'أطر تقنية وقانونية تتيح تبادل البيانات بين الجهات الحكومية والخاصة مع بقاء السيطرة لدى مالك البيانات، على غرار نموذج Gaia-X الأوروبي.',
      en: "Technical and legal frameworks enabling data exchange between public and private entities while data owners retain control, following models like Europe's Gaia-X.",
    },
    trl: 5,
    trlRationale: 'Gaia-X operational with trust labels (2025) but sectoral data spaces remain pilots in most governments; validation in relevant environments ongoing.',
    sectors: ['trade-finance-economy', 'energy-natural-resources', 'healthcare'],
    domainIds: ['ai-data', 'policy'],
    employeeSkills: ['Data-sharing governance and consent models', 'Interoperability standards (APIs, ontologies)', 'Cross-border data flow regulation literacy'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Controlled data sharing vs. open data',
      practitioner: 'Interoperability standards, consent & governance models',
    },
  },
  {
    id: 'C2-T04', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'الحوسبة الطرفية للخدمات الحكومية', en: 'Edge Computing for Government' },
    description: {
      ar: 'معالجة البيانات قرب مصدرها (في الكاميرات وأعمدة الإنارة والمركبات) بدلاً من إرسالها للسحابة، لدعم الخدمات الفورية كالمرور الذكي والاستجابة للطوارئ.',
      en: 'Processing data near its source (cameras, lamp posts, vehicles) rather than sending it to the cloud, enabling real-time services like smart traffic and emergency response.',
    },
    trl: 7,
    trlRationale: 'Re-rated 6→7 (2026 review): commercially deployed at scale; the original rationale itself acknowledges operational smart-city systems.',
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['cloud', 'emerging'],
    employeeSkills: ['Edge-cloud architecture fundamentals', 'IoT data pipeline design', 'Latency and resilience requirements analysis'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Why compute moves near citizens/devices',
      practitioner: 'Edge-cloud architecture, IoT pipelines, resilience design',
    },
  },
  {
    id: 'C2-T05', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'توليد البيانات الاصطناعية', en: 'Synthetic Data Generation' },
    description: {
      ar: 'إنشاء بيانات إحصائياً مكافئة للبيانات الحقيقية دون كشف معلومات شخصية، لتدريب النماذج واختبار الأنظمة الحكومية مع حماية خصوصية المواطنين.',
      en: 'Creating statistically equivalent substitutes for real data without exposing personal information, for model training and government system testing while protecting citizen privacy.',
    },
    trl: 6,
    trlRationale: 'Validated in regulated sectors (health, finance) and adopted by national statistics offices in pilots; scaling toward operational use.',
    sectors: ['healthcare', 'social-development-justice', 'education-training'],
    domainIds: ['ai-data', 'cyber'],
    employeeSkills: ['Privacy risk assessment of synthetic datasets', 'Statistical validation of synthetic vs. real data', 'PET (privacy-enhancing technology) landscape literacy'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Privacy-preserving innovation concept',
      practitioner: 'Statistical validation, re-identification risk, PET landscape',
    },
  },
  {
    id: 'C2-T06', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'الرسوم البيانية المعرفية والويب الدلالي', en: 'Knowledge Graphs & Semantic Interoperability' },
    description: {
      ar: 'نمذجة العلاقات بين الكيانات الحكومية (الأشخاص، التراخيص، المنشآت) كشبكة معرفية موحدة تتيح الاستعلام الذكي وخدمات «مرة واحدة فقط» عبر الجهات.',
      en: "Modeling relationships between government entities (persons, licenses, businesses) as a unified knowledge network enabling intelligent queries and 'once-only' services across agencies.",
    },
    trl: 6,
    trlRationale: 'Proven in national registries (Estonia X-Road ecosystem, enterprise graph platforms); government-wide semantic layers remain partially deployed.',
    sectors: ['social-development-justice', 'trade-finance-economy'],
    domainIds: ['ai-data', 'cloud'],
    employeeSkills: ['Data modeling and ontology basics', 'Linked-data and SPARQL literacy', 'Registry interoperability design'],
    horizon: 'near',
    learningFocus: {
      awareness: "Connected data enables 'once-only' government",
      practitioner: 'Ontologies, linked data, registry interoperability',
    },
  },
  {
    id: 'C2-T07', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'مراكز البيانات الخضراء والمستدامة', en: 'Green & Sustainable Data Centers' },
    description: {
      ar: 'مراكز بيانات عالية الكفاءة تعمل بالطاقة المتجددة وتقنيات التبريد المتقدمة، لموازنة التوسع الهائل في حوسبة الذكاء الاصطناعي مع مستهدفات الاستدامة الوطنية.',
      en: 'High-efficiency data centers powered by renewables and advanced cooling, balancing the massive AI compute expansion with national sustainability targets.',
    },
    trl: 7,
    trlRationale: "Re-rated 6→7 (2026 review): liquid cooling and PUE optimization are commercially mature; only the giga-scale AI-campus integration is novel.",
    sectors: ['energy-natural-resources', 'urban-mobility-smart-cities'],
    domainIds: ['cloud', 'emerging'],
    employeeSkills: ['Data-center energy metrics (PUE, CUE)', 'Sustainable procurement of IT infrastructure', 'GreenOps and carbon-aware workload scheduling basics'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Digital growth has an energy footprint',
      practitioner: 'PUE/CUE metrics, sustainable procurement, carbon-aware scheduling',
    },
  },
  {
    id: 'C2-T08', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'التعلم الموحّد (الفيدرالي)', en: 'Federated Learning' },
    description: {
      ar: 'تدريب نماذج الذكاء الاصطناعي على بيانات موزعة بين الجهات دون نقل البيانات الخام من مكانها، ما يمكّن التعاون التحليلي بين الجهات الصحية والتعليمية مع حفظ الخصوصية.',
      en: 'Training AI models on data distributed across entities without moving raw data, enabling analytic collaboration between health and education bodies while preserving privacy.',
    },
    trl: 4,
    trlRationale: "Validated in research and healthcare consortia labs; dropped from Gartner's 2025 Hype Cycle as a standalone item, indicating still-early operational maturity.",
    sectors: ['healthcare', 'education-training'],
    domainIds: ['ai-data', 'cyber'],
    employeeSkills: ['Privacy-preserving ML concepts', 'Distributed data governance', 'Evaluating federated vs. centralized model trade-offs'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Collaboration without moving data',
      practitioner: 'Privacy-preserving ML design, distributed governance',
    },
  },
  // Cluster 3 — Trust, Security & Digital Identity
  {
    id: 'C3-T01', clusterId: 'trust-security-digital-identity',
    name: { ar: 'محافظ الهوية الرقمية الوطنية', en: 'National Digital Identity Wallets' },
    description: {
      ar: 'تطبيقات موثوقة تحمل الهوية والمؤهلات والتراخيص الرقمية للمواطن، وتتيح إثبات الهوية والتوقيع عن بُعد، على غرار المحفظة الأوروبية eIDAS 2.0 وتطبيقات الهوية الوطنية.',
      en: "Trusted apps carrying a citizen's identity, credentials, and licenses, enabling remote identity proofing and signing — following EU eIDAS 2.0 wallet and national ID app models.",
    },
    trl: 7,
    trlRationale: 'EU Digital Identity Wallet rolling out to member states by 2026; Gulf national ID apps operational — system demonstration in operational environment achieved, full-scale integration ongoing.',
    sectors: ['social-development-justice', 'travel-tourism-culture', 'trade-finance-economy'],
    domainIds: ['cyber', 'service-design'],
    employeeSkills: ['Identity assurance levels and eKYC processes', 'Verifiable credentials standards (W3C VC)', 'Inclusive onboarding design for digital ID'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Using the wallet; citizen support basics',
      practitioner: 'Assurance levels, verifiable credentials, inclusive onboarding',
    },
  },
  {
    id: 'C3-T02', clusterId: 'trust-security-digital-identity',
    name: { ar: 'التشفير المقاوم للحوسبة الكمومية', en: 'Post-Quantum Cryptography (PQC)' },
    description: {
      ar: 'خوارزميات تشفير جديدة مقاومة لهجمات الحواسيب الكمومية المستقبلية، اعتمدها NIST وبدأت الحكومات التخطيط الإلزامي لترحيل أنظمتها إليها.',
      en: 'New encryption algorithms resistant to future quantum computer attacks, standardized by NIST, with governments beginning mandated migration planning.',
    },
    trl: 6,
    trlRationale: 'Re-rated 5→6 (2026 review): NIST standards final since 2024 with wide hybrid deployment in global infrastructure (browsers/CDNs) — validated in relevant environments; government migration at pilot/inventory stage.',
    sectors: ['trade-finance-economy', 'social-development-justice', 'energy-natural-resources'],
    domainIds: ['cyber', 'cloud'],
    employeeSkills: ['Cryptographic inventory and crypto-agility', 'PQC migration roadmap literacy', "'Harvest now, decrypt later' risk communication"],
    horizon: 'near',
    learningFocus: {
      awareness: "'Harvest now, decrypt later' — why act early",
      practitioner: 'Crypto inventory, crypto-agility, PQC migration roadmaps',
    },
  },
  {
    id: 'C3-T03', clusterId: 'trust-security-digital-identity',
    name: { ar: 'بنية انعدام الثقة', en: 'Zero-Trust Architecture' },
    description: {
      ar: 'نموذج أمني لا يفترض الثقة بأي مستخدم أو جهاز داخل الشبكة أو خارجها، ويتحقق باستمرار من كل وصول، وهو المعيار المعتمد لحماية الأنظمة الحكومية الحديثة.',
      en: 'A security model that trusts no user or device by default, inside or outside the network, continuously verifying every access — the adopted standard for modern government systems.',
    },
    trl: 8,
    trlRationale: 'Mandated for US federal agencies and widely deployed in Gulf government SOCs; operational at scale.',
    sectors: ['social-development-justice', 'trade-finance-economy'],
    domainIds: ['cyber', 'cloud'],
    employeeSkills: ['Zero-trust principles and policy design', 'Identity-centric access management', 'Security awareness for non-specialists'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Never trust, always verify — daily habits',
      practitioner: 'Policy design, identity-centric access, segmentation',
    },
  },
  {
    id: 'C3-T04', clusterId: 'trust-security-digital-identity',
    name: { ar: 'الحوسبة السرية والتشفير المتماثل', en: 'Confidential Computing & Homomorphic Encryption' },
    description: {
      ar: 'تقنيات تتيح معالجة البيانات وهي مشفرة دون فكها، ما يسمح بتحليلات مشتركة بين الجهات على بيانات حساسة دون كشفها.',
      en: 'Technologies that process data while it remains encrypted, enabling joint analytics across entities on sensitive data without exposing it.',
    },
    trl: 4,
    trlRationale: 'Confidential computing hardware (TEEs) is shipping, but fully homomorphic encryption remains at lab/pilot stage; Gartner lists encrypted computing as an emerging necessity for the quantum era.',
    sectors: ['healthcare', 'trade-finance-economy', 'social-development-justice'],
    domainIds: ['cyber', 'ai-data'],
    employeeSkills: ['Privacy-enhancing technologies overview', 'Secure multi-party computation concepts', 'Data-use vs. data-at-rest risk assessment'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Data can be protected even while in use',
      practitioner: 'TEEs, homomorphic encryption limits, secure analytics design',
    },
  },
  {
    id: 'C3-T05', clusterId: 'trust-security-digital-identity',
    name: { ar: 'إثبات أصالة المحتوى والعلامات المائية التوليدية', en: 'Content Provenance & Generative Watermarking' },
    description: {
      ar: 'وسوم غير مرئية وشهادات منشأ تُضمَّن في المحتوى الرقمي (بما فيه المولّد بالذكاء الاصطناعي) للتحقق من أصالته ومكافحة التضليل الإعلامي.',
      en: 'Invisible markers and provenance certificates embedded in digital content (including AI-generated media) to verify authenticity and combat disinformation.',
    },
    trl: 4,
    trlRationale: 'Named a WEF Top 10 Emerging Technology of 2025 with impact expected in 3–5 years; C2PA standards exist but universal adoption is nascent.',
    sectors: ['social-development-justice', 'travel-tourism-culture', 'education-training'],
    domainIds: ['cyber', 'policy'],
    employeeSkills: ['Deepfake and synthetic-media literacy', 'Content provenance standards (C2PA)', 'Crisis communication for information integrity'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Spotting deepfakes; verifying official content',
      practitioner: 'C2PA implementation, verification workflows, crisis comms',
    },
  },
  {
    id: 'C3-T06', clusterId: 'trust-security-digital-identity',
    name: { ar: 'الهوية اللامركزية ذاتية السيادة', en: 'Decentralized / Self-Sovereign Identity' },
    description: {
      ar: 'نموذج هوية يمنح الأفراد والمنشآت السيطرة على بياناتهم التعريفية عبر سجلات موزعة وشهادات قابلة للتحقق، دون الاعتماد على جهة مركزية واحدة.',
      en: 'An identity model giving individuals and organizations control over their credentials via distributed ledgers and verifiable credentials, without dependence on a single central authority.',
    },
    trl: 5,
    trlRationale: 'Validated in pilots (EU EBSI, national education credentialing); market reports project growth but government production use remains limited.',
    sectors: ['education-training', 'trade-finance-economy', 'social-development-justice'],
    domainIds: ['cyber', 'emerging'],
    employeeSkills: ['DIDs and verifiable credentials fundamentals', 'Consent and selective disclosure design', 'Interoperability with national ID systems'],
    horizon: 'near',
    learningFocus: {
      awareness: 'User-controlled credentials concept',
      practitioner: 'DIDs/VCs, selective disclosure, national ID integration',
    },
  },
  {
    id: 'C3-T07', clusterId: 'trust-security-digital-identity',
    name: { ar: 'الأمن السيبراني الاستباقي المدعوم بالذكاء الاصطناعي', en: 'AI-Powered Preemptive Cybersecurity' },
    description: {
      ar: 'منظومات دفاع سيبراني تستخدم الذكاء الاصطناعي للتنبؤ بالهجمات واكتشافها والاستجابة لها آلياً قبل وقوع الضرر، بدلاً من رد الفعل بعد الاختراق.',
      en: 'Cyber defense systems using AI to predict, detect, and automatically respond to attacks before damage occurs, rather than reacting after a breach.',
    },
    trl: 7,
    trlRationale: 'AI-driven SOC tooling is operational in leading government security centers; identified as a defining 2026 public-administration trend.',
    sectors: ['social-development-justice', 'trade-finance-economy', 'energy-natural-resources'],
    domainIds: ['cyber', 'ai-data'],
    employeeSkills: ['Threat landscape and SOC workflow literacy', 'Evaluating AI security tool claims', 'Incident response coordination and reporting'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Everyone is a sensor: reporting phishing & anomalies',
      practitioner: 'SOC workflows, AI tool evaluation, incident coordination',
    },
  },
  {
    id: 'C3-T08', clusterId: 'trust-security-digital-identity',
    name: { ar: 'المصادقة البيومترية المتقدمة ومفاتيح المرور', en: 'Advanced Biometrics & Passkeys' },
    description: {
      ar: 'مصادقة بدون كلمات مرور تعتمد على الوجه والبصمة ومفاتيح المرور المشفرة (FIDO2)، وتُستخدم في منصات الخدمات الحكومية السعودية كنفاذ وأبشر.',
      en: 'Passwordless authentication using face, fingerprint, and cryptographic passkeys (FIDO2), used in Saudi government platforms such as Nafath and Absher.',
    },
    trl: 9,
    trlRationale: 'Re-rated 8→9 (2026 review): Nafath has run at national scale for years — the textbook definition of TRL 9 (proven in operational use).',
    sectors: ['social-development-justice', 'travel-tourism-culture'],
    domainIds: ['cyber', 'service-design'],
    employeeSkills: ['Biometric assurance and spoofing risks', 'FIDO2/passkey user-journey design', 'Privacy implications of biometric data (PDPL)'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Passwordless login; protecting your biometrics',
      practitioner: 'Spoofing resistance, FIDO2 journeys, biometric privacy (PDPL)',
    },
  },
  // Cluster 4 — Citizen Experience & Service Delivery
  {
    id: 'C4-T01', clusterId: 'citizen-experience-delivery',
    name: { ar: 'الخدمات الحكومية الاستباقية', en: 'Proactive & Anticipatory Government Services' },
    description: {
      ar: 'خدمات تُقدَّم تلقائياً عند استحقاقها (كإصدار سجل تجاري أو صرف مستحقات عند حدث حياتي) دون حاجة المواطن لتقديم طلب.',
      en: 'Services delivered automatically when due (e.g., issuing a commercial registration or paying entitlements upon a life event) without the citizen filing a request.',
    },
    trl: 6,
    trlRationale: 'OECD 2026 calls proactive delivery the direction of travel; leading governments demonstrate it operationally (birth bundles, auto-renewals), but most services remain reactive.',
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['service-design', 'policy', 'agile'],
    employeeSkills: ['Life-event journey mapping', 'Legal basis and consent for proactive delivery', 'Service trigger design from registry data'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Services that come to you; consent expectations',
      practitioner: 'Trigger design, legal bases, registry-driven automation',
    },
  },
  {
    id: 'C4-T02', clusterId: 'citizen-experience-delivery',
    name: { ar: 'المساعدات الحوارية متعددة اللغات', en: 'Conversational AI & Multilingual Chatbots' },
    description: {
      ar: 'مساعدات ذكية باللغتين العربية والإنجليزية تجيب على استفسارات المستفيدين وتنجز معاملاتهم عبر القنوات الحكومية على مدار الساعة.',
      en: 'Arabic/English intelligent assistants answering beneficiary queries and completing transactions across government channels around the clock.',
    },
    trl: 8,
    trlRationale: 'Operational at scale in Saudi platforms and most digital governments; LLM upgrades improving quality continuously.',
    sectors: ['social-development-justice', 'travel-tourism-culture', 'trade-finance-economy'],
    domainIds: ['service-design', 'ai-data'],
    employeeSkills: ['Conversation design and tone of voice', 'Chatbot evaluation (accuracy, containment, escalation)', 'Arabic NLP dialect considerations'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Getting help from chatbots; escalation to humans',
      practitioner: 'Conversation design, containment metrics, dialect handling',
    },
  },
  {
    id: 'C4-T03', clusterId: 'citizen-experience-delivery',
    name: { ar: 'الخدمات الغامرة والحوسبة المكانية', en: 'Immersive Services & Spatial Computing' },
    description: {
      ar: 'استخدام الواقع المعزز والافتراضي في التدريب الحكومي والخدمات الثقافية والسياحية والتخطيط العمراني التشاركي، كجولات افتراضية للمواقع التراثية.',
      en: 'AR/VR applied to government training, cultural and tourism services, and participatory urban planning — e.g., virtual tours of heritage sites.',
    },
    trl: 5,
    trlRationale: 'Hardware matured (Vision Pro, Quest) but Gartner places spatial computing 5–10 years from plateau; government use is pilot-scale beyond tourism showcases.',
    sectors: ['travel-tourism-culture', 'education-training', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'service-design'],
    employeeSkills: ['Immersive experience design principles', 'AR/VR use-case viability assessment', 'Accessibility in immersive environments'],
    horizon: 'far',
    learningFocus: {
      awareness: 'What AR/VR can offer citizens & training',
      practitioner: 'Immersive UX design, viability assessment, accessibility',
    },
  },
  {
    id: 'C4-T04', clusterId: 'citizen-experience-delivery',
    name: { ar: 'التوائم الرقمية للخدمات والعمليات الحكومية', en: 'Digital Twins of Government Services & Processes' },
    description: {
      ar: 'نماذج افتراضية حية للعمليات الحكومية تتيح محاكاة أثر التغييرات التنظيمية أو إعادة تصميم الخدمة قبل تطبيقها على المواطنين.',
      en: 'Living virtual models of government processes that let agencies simulate the impact of regulatory changes or service redesigns before applying them to citizens.',
    },
    trl: 5,
    trlRationale: 'Process mining and simulation tooling proven in industry; government service twins are in validation/pilot stage.',
    sectors: ['urban-mobility-smart-cities', 'trade-finance-economy', 'social-development-justice'],
    domainIds: ['agile', 'ai-data', 'service-design'],
    employeeSkills: ['Process mining and modeling', 'Simulation interpretation for policy testing', 'Service blueprinting'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Testing changes virtually before real rollout',
      practitioner: 'Process mining, simulation design, blueprinting',
    },
  },
  {
    id: 'C4-T05', clusterId: 'citizen-experience-delivery',
    name: { ar: 'رحلات الخدمة المبنية على أحداث الحياة', en: 'Life-Event-Based Service Journeys' },
    description: {
      ar: 'تنظيم الخدمات حول محطات حياة المواطن (الولادة، الزواج، التقاعد، تأسيس عمل) بحزم متكاملة عابرة للجهات بدلاً من إجراءات منفصلة لكل جهة.',
      en: 'Organizing services around citizen life events (birth, marriage, retirement, starting a business) as integrated cross-agency bundles instead of fragmented per-agency procedures.',
    },
    trl: 7,
    trlRationale: 'Demonstrated operationally in leading digital governments and in Saudi life-event initiatives; cross-agency orchestration still scaling.',
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['service-design', 'agile', 'leadership'],
    employeeSkills: ['Journey mapping and service blueprinting', 'Cross-agency service orchestration', 'Measuring end-to-end journey performance'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Bundled services around life events',
      practitioner: 'Journey mapping, cross-agency orchestration, measurement',
    },
  },
  {
    id: 'C4-T06', clusterId: 'citizen-experience-delivery',
    name: { ar: 'التخصيص الذكي ومحركات التوصية', en: 'AI-Powered Personalization & Recommendation' },
    description: {
      ar: 'تكييف المحتوى والخدمات والإشعارات الحكومية حسب ملف المستفيد وسياقه، مع ضوابط شفافية تمنع التمييز أو الإقصاء.',
      en: "Tailoring government content, services, and notifications to each beneficiary's profile and context, with transparency safeguards against discrimination or exclusion.",
    },
    trl: 6,
    trlRationale: 'Recommender technology mature in the private sector; government deployment with equity guardrails is emerging operational practice.',
    sectors: ['social-development-justice', 'education-training', 'trade-finance-economy'],
    domainIds: ['ai-data', 'service-design', 'policy'],
    employeeSkills: ['Personalization ethics and equity review', 'Recommender system fundamentals', 'A/B testing for public services'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Personalized gov services; equity questions',
      practitioner: 'Recommender fundamentals, ethics review, A/B testing',
    },
  },
  {
    id: 'C4-T07', clusterId: 'citizen-experience-delivery',
    name: { ar: 'واجهات الصوت والكلام باللغة العربية', en: 'Arabic Voice & Speech Interfaces' },
    description: {
      ar: 'تقنيات التعرف على الكلام العربي بلهجاته المتنوعة وتحويله لنص والرد صوتياً، لإتاحة الخدمات لكبار السن وذوي الإعاقة ومحدوي الألفية الرقمية.',
      en: 'Speech recognition across diverse Arabic dialects with voice responses, opening services to the elderly, people with disabilities, and those with limited digital literacy.',
    },
    trl: 6,
    trlRationale: 'Dialectal Arabic ASR reached usable quality in 2025 models (e.g., ALLaM speech input); government channel deployment is early operational.',
    sectors: ['social-development-justice', 'healthcare', 'education-training'],
    domainIds: ['service-design', 'ai-data'],
    employeeSkills: ['Voice UX design', 'Dialect coverage and speech-data evaluation', 'Digital inclusion needs assessment'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Voice access for all citizens; dialects matter',
      practitioner: 'Voice UX, ASR evaluation, inclusion assessment',
    },
  },
  {
    id: 'C4-T08', clusterId: 'citizen-experience-delivery',
    name: { ar: 'تقنيات الوصول الشامل والتصميم الجامع', en: 'Accessibility & Inclusive Design Technology' },
    description: {
      ar: 'أدوات ومعايير (WCAG، قارئات الشاشة، الترجمة الآلية المبسطة) تضمن وصول جميع المواطنين — بمن فيهم ذوي الإعاقة — إلى الخدمات الرقمية على قدم المساواة.',
      en: 'Tools and standards (WCAG, screen readers, plain-language machine translation) ensuring all citizens — including people with disabilities — access digital services equally.',
    },
    trl: 8,
    trlRationale: 'Standards and assistive technologies fully operational and legally mandated in many jurisdictions; AI-assisted accessibility tooling now mainstream.',
    sectors: ['social-development-justice', 'education-training', 'healthcare'],
    domainIds: ['service-design', 'policy'],
    employeeSkills: ['WCAG auditing and remediation', 'Inclusive research with diverse users', 'Plain-language (and easy-read Arabic) writing'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Digital services must serve everyone',
      practitioner: 'WCAG auditing, inclusive research, easy-read Arabic',
    },
  },
  // Cluster 5 — Smart Cities & Sustainability
  {
    id: 'C5-T01', clusterId: 'smart-cities-sustainability',
    name: { ar: 'التوائم الرقمية الحضرية', en: 'Urban Digital Twins' },
    description: {
      ar: 'نسخ رقمية حية من المدن تتغذى ببيانات الاستشعار الفورية، وتتيح للمخططين محاكاة المرور والفيضانات والطلب على الطاقة قبل تنفيذ أي تغيير مادي.',
      en: 'Live digital replicas of cities fed by real-time sensor data, letting planners simulate traffic, floods, and energy demand before any physical change.',
    },
    trl: 5,
    trlRationale: 'Highlighted among WEF-adjacent 2025 city technologies; operational in a handful of cities (Singapore, NEOM builds), most deployments still district-scale pilots.',
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'ai-data', 'cloud'],
    employeeSkills: ['Geospatial data and GIS literacy', 'Simulation scenario design and validation', 'IoT data integration for urban models'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Simulating the city before building it',
      practitioner: 'GIS, scenario design, IoT integration',
    },
  },
  {
    id: 'C5-T02', clusterId: 'smart-cities-sustainability',
    name: { ar: 'شبكات الاستشعار التعاونية', en: 'Collaborative Sensing Networks' },
    description: {
      ar: 'شبكات أجهزة استشعار موزعة في المركبات والبنية التحتية تتشارك البيانات مع الذكاء الاصطناعي وشبكات 5G لتنسيق المرور والخدمات اللوجستية والاستجابة للطوارئ لحظياً.',
      en: 'Distributed sensors across vehicles and infrastructure sharing data with AI and 5G to coordinate traffic, logistics, and emergency response in real time.',
    },
    trl: 4,
    trlRationale: 'WEF Top 10 Emerging Technology of 2025, expected to reach real-world impact in 3–5 years; validated in pilots, not yet operational at city scale.',
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'cloud'],
    employeeSkills: ['Sensor network architecture basics', 'Real-time data stream concepts', 'Privacy governance of urban sensing'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Sensors that talk to each other; privacy basics',
      practitioner: 'Sensor network architecture, real-time streams, governance',
    },
  },
  {
    id: 'C5-T03', clusterId: 'smart-cities-sustainability',
    name: { ar: 'إنترنت الأشياء للبنية التحتية العامة', en: 'IoT for Public Infrastructure' },
    description: {
      ar: 'أجهزة استشعار متصلة لإدارة الإنارة العامة والمياه والنفايات والمرافق، مطبقة فعلياً في بلديات سعودية كنظام التحكم بالإنارة عن بُعد في الرياض.',
      en: "Connected sensors managing street lighting, water, waste, and public facilities — already operational in Saudi municipalities such as Riyadh's remote lighting control system.",
    },
    trl: 8,
    trlRationale: 'Documented operational success cases in Saudi municipalities (Riyadh lighting) and global smart-city programs; mature, scaling deployments.',
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'cloud', 'cyber'],
    employeeSkills: ['IoT device lifecycle and fleet management', 'OT/IoT security fundamentals', 'Sensor data analytics for operations'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Connected streetlights & utilities around you',
      practitioner: 'Fleet management, OT security, sensor analytics',
    },
  },
  {
    id: 'C5-T04', clusterId: 'smart-cities-sustainability',
    name: { ar: 'التنقل الذكي والمركبات ذاتية القيادة', en: 'Smart Mobility & Autonomous Vehicles' },
    description: {
      ar: 'منظومات نقل متكاملة تشمل المركبات ذاتية القيادة والنقل كخدمة (MaaS) وإدارة المرور الذكية، ضمن مستهدفات تقليل الازدحام والانبعاثات في المدن السعودية.',
      en: 'Integrated transport systems including autonomous vehicles, mobility-as-a-service (MaaS), and intelligent traffic management, targeting congestion and emissions cuts in Saudi cities.',
    },
    trl: 5,
    trlRationale: 'Robotaxis operational in select global cities and Saudi pilots announced; full regulatory and operational maturity for public roads is years away.',
    sectors: ['urban-mobility-smart-cities', 'travel-tourism-culture'],
    domainIds: ['emerging', 'policy'],
    employeeSkills: ['Mobility data analytics', 'AV regulatory and safety frameworks', 'MaaS platform and transit integration concepts'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Autonomous transport pilots; safety & rules',
      practitioner: 'Mobility analytics, AV regulation, MaaS integration',
    },
  },
  {
    id: 'C5-T05', clusterId: 'smart-cities-sustainability',
    name: { ar: 'الشبكات الكهربائية الذكية وتحسين الطاقة', en: 'Smart Grids & Energy Optimization' },
    description: {
      ar: 'شبكات كهرباء رقمية ثنائية الاتجاه توازن الإنتاج المتجدد المتقطع مع الطلب لحظياً، وتدعم أهداف مزيج الطاقة السعودي (50٪ متجددة بحلول 2030).',
      en: "Digital two-way electricity grids balancing intermittent renewable generation with real-time demand, supporting Saudi's 50%-renewables-by-2030 energy mix target.",
    },
    trl: 7,
    trlRationale: 'Smart meters and grid automation deployed at scale in KSA (SEC smart-meter program); AI-driven optimization layers still maturing.',
    sectors: ['energy-natural-resources', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'ai-data', 'cloud'],
    employeeSkills: ['Energy data literacy (load curves, DERs)', 'Grid digitization program management', 'Demand-response and flexibility market basics'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Two-way electricity grids & renewables',
      practitioner: 'Energy data literacy, demand response, program management',
    },
  },
  {
    id: 'C5-T06', clusterId: 'smart-cities-sustainability',
    name: { ar: 'منصات المحاسبة الكربونية والعمليات الخضراء', en: 'Carbon Accounting & GreenOps Platforms' },
    description: {
      ar: 'برمجيات لقياس انبعاثات الجهات الحكومية عبر النطاقات الثلاثة وإدارتها وإعداد تقاريرها، دعماً لالتزامات مبادرة السعودية الخضراء والإفصاح المناخي.',
      en: 'Software to measure, manage, and report government emissions across all three scopes, supporting Saudi Green Initiative commitments and climate disclosure.',
    },
    trl: 6,
    trlRationale: "Recognized category in Gartner's 2025 Hype Cycle for Environmental Sustainability; enterprise adoption operational, government-wide deployment emerging.",
    sectors: ['energy-natural-resources', 'trade-finance-economy', 'urban-mobility-smart-cities'],
    domainIds: ['policy', 'ai-data'],
    employeeSkills: ['GHG Protocol scopes and carbon accounting basics', 'Sustainability reporting (and ESG data) literacy', 'Green procurement criteria'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Emissions are measured & managed',
      practitioner: 'GHG scopes, ESG reporting, green procurement',
    },
  },
  {
    id: 'C5-T07', clusterId: 'smart-cities-sustainability',
    name: { ar: 'المراقبة البيئية وتحليلات المناخ', en: 'Environmental Monitoring & Climate Analytics' },
    description: {
      ar: 'شبكات استشعار وصور أقمار صناعية ونماذج ذكاء اصطناعي لمراقبة جودة الهواء والمياه والتصحر والتنبؤ بالمخاطر المناخية ودعم سياسات التكيف.',
      en: 'Sensor networks, satellite imagery, and AI models monitoring air and water quality and desertification, forecasting climate risks, and supporting adaptation policy.',
    },
    trl: 6,
    trlRationale: 'Autonomous environmental sensing is a WEF 2025 spotlight; national meteorological and environment centers operate components, integration is ongoing.',
    sectors: ['energy-natural-resources', 'urban-mobility-smart-cities', 'healthcare'],
    domainIds: ['ai-data', 'emerging'],
    employeeSkills: ['Remote-sensing and satellite data basics', 'Environmental data interpretation for policy', 'Climate risk communication'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Satellite & sensor watch over air, water, land',
      practitioner: 'Remote sensing basics, policy interpretation, risk comms',
    },
  },
  {
    id: 'C5-T08', clusterId: 'smart-cities-sustainability',
    name: { ar: 'الطائرات المسيّرة للخدمات العامة', en: 'Drones for Public Services' },
    description: {
      ar: 'استخدام الطائرات المسيّرة في تفتيش البنية التحتية والمساحة ورصد الحرائق والاستجابة للطوارئ والتوصيل الطبي، ضمن أطر تنظيمية وطنية للطيران.',
      en: 'Unmanned aircraft for infrastructure inspection, surveying, wildfire monitoring, emergency response, and medical delivery under national aviation regulation.',
    },
    trl: 8,
    trlRationale: 'Re-rated 7→8 (2026 review): operational in Saudi civil defense and municipal inspection with GACA regulation in force — scaling, not experimental.',
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources', 'healthcare'],
    domainIds: ['emerging', 'policy'],
    employeeSkills: ['Drone operations regulation (GACA) literacy', 'Aerial data capture and analysis', 'Public-safety mission planning'],
    horizon: 'now',
    learningFocus: {
      awareness: 'Drones in inspection & emergencies',
      practitioner: 'GACA regulation, aerial data analysis, mission planning',
    },
  },
  // Cluster 6 — Frontier & Deep Tech
  {
    id: 'C6-T01', clusterId: 'frontier-deep-tech',
    name: { ar: 'الحوسبة الكمومية للتطبيقات الحكومية', en: 'Quantum Computing for Government Applications' },
    description: {
      ar: 'حواسيب كمومية وخدمات «الكم كخدمة» لحل مسائل التحسين المعقدة في اللوجستيات والطاقة والمواد، عبر شراكات بحثية وطنية دون امتلاك أجهزة محلية.',
      en: 'Quantum computers and quantum-as-a-service offerings for hard optimization problems in logistics, energy, and materials, accessed via national research partnerships.',
    },
    trl: 3,
    trlRationale: 'Hardware remains experimental (error-corrected qubits emerging); practical government advantage unproven — proof-of-concept stage, 10+ years to utility per Gartner.',
    sectors: ['energy-natural-resources', 'trade-finance-economy', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'policy'],
    employeeSkills: ['Quantum literacy for policy makers', 'Use-case screening for quantum advantage', 'National quantum strategy awareness'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Why quantum matters for policy, not just labs',
      practitioner: 'Use-case screening, national strategy engagement',
    },
  },
  {
    id: 'C6-T02', clusterId: 'frontier-deep-tech',
    name: { ar: 'توزيع المفاتيح الكمومية', en: 'Quantum Key Distribution (QKD)' },
    description: {
      ar: 'تبادل مفاتيح التشفير عبر قنوات كمومية تكشف أي محاولة تنصت فيزيائياً، لتأمين الاتصالات الحكومية فائقة الحساسية بين المراكز السيادية.',
      en: 'Encryption-key exchange over quantum channels that physically reveal any eavesdropping, securing ultra-sensitive government communications between sovereign sites.',
    },
    trl: 4,
    trlRationale: 'Validated in metro-scale testbeds (China, EU, Korea) but distance, cost, and integration limits keep it at technology-validation stage for government networks.',
    sectors: ['trade-finance-economy', 'social-development-justice', 'energy-natural-resources'],
    domainIds: ['cyber', 'emerging'],
    employeeSkills: ['Quantum-safe security landscape (QKD vs. PQC)', 'Critical-infrastructure communication requirements', 'Technology horizon scanning'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Physics-secured communication concept',
      practitioner: 'QKD vs. PQC evaluation, infrastructure requirements',
    },
  },
  {
    id: 'C6-T03', clusterId: 'frontier-deep-tech',
    name: { ar: 'سجلات البلوك تشين الموزعة للخدمات الحكومية', en: 'Blockchain & Distributed Ledgers for Government' },
    description: {
      ar: 'سجلات موزعة غير قابلة للتلاعب لتتبع الحاويات الجمركية وتوثيق السندات والتحقق من الشهادات، كتجربة هيئة الزكاة والضريبة والجمارك في تتبع الحاويات.',
      en: "Tamper-proof distributed ledgers for customs container tracking, title registration, and credential verification — e.g., ZATCA's blockchain container-tracking experiment.",
    },
    trl: 6,
    trlRationale: 'Past peak hype; selective operational use in customs, trade finance, and credentialing. Proven in relevant environments but not general government infrastructure.',
    sectors: ['trade-finance-economy', 'social-development-justice', 'education-training'],
    domainIds: ['emerging', 'cyber', 'policy'],
    employeeSkills: ['DLT suitability assessment (when NOT to use blockchain)', 'Smart contract risk basics', 'Cross-border trade digitization standards'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Tamper-proof records; where it actually helps',
      practitioner: 'DLT suitability assessment, smart-contract risk',
    },
  },
  {
    id: 'C6-T04', clusterId: 'frontier-deep-tech',
    name: { ar: 'الحوسبة العصبية الشكلية', en: 'Neuromorphic Computing' },
    description: {
      ar: 'رقائق تحاكي بنية الدماغ البشري لتنفيذ ذكاء اصطناعي فائق الكفاءة في استهلاك الطاقة على الأجهزة الطرفية، كأجهزة الاستشعار المستمرة في المدن الذكية.',
      en: "Chips mimicking the human brain's architecture to run ultra-energy-efficient AI on edge devices, such as always-on sensors in smart cities.",
    },
    trl: 3,
    trlRationale: "Research chips exist (Intel Loihi, IBM TrueNorth lineage); cited on Gartner's 2025 radar as ultra-efficient AI processing — no operational government systems.",
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'ai-data'],
    employeeSkills: ['AI hardware landscape awareness', 'Edge AI use-case scouting', 'R&D partnership evaluation'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Brain-inspired chips; energy-efficient AI',
      practitioner: 'Hardware landscape scouting, R&D partnerships',
    },
  },
  {
    id: 'C6-T05', clusterId: 'frontier-deep-tech',
    name: { ar: 'شبكات الجيل السادس والاتصالات المستقبلية', en: '6G & Next-Generation Networks' },
    description: {
      ar: 'الجيل القادم من الشبكات اللاسلكية بسرعات وكمون واستشعار مدمج تتجاوز 5G، وتشكل أساس المدن الذكية والخدمات الغامرة المستقبلية.',
      en: 'The next wireless generation with speed, latency, and integrated sensing beyond 5G, forming the substrate for future smart cities and immersive services.',
    },
    trl: 2,
    trlRationale: 'Standardization (3GPP/ITU IMT-2030) underway with commercial launch expected ~2030; technology concept and early lab validation stage.',
    sectors: ['urban-mobility-smart-cities', 'trade-finance-economy'],
    domainIds: ['emerging', 'cloud', 'policy'],
    employeeSkills: ['Spectrum policy and telecom regulation literacy (CST)', 'Infrastructure foresight and investment planning', 'Public-private network partnership models'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Beyond 5G; why standards years matter',
      practitioner: 'Spectrum policy, infrastructure foresight, PPP models',
    },
  },
  {
    id: 'C6-T06', clusterId: 'frontier-deep-tech',
    name: { ar: 'الذكاء المتجسد والروبوتات للخدمات العامة', en: 'Embodied AI & Robotics for Public Services' },
    description: {
      ar: 'روبوتات مدعومة بالذكاء الاصطناعي للمهام الميدانية: رعاية المسنين، وفحص المرافق، والعمليات الخطرة، ضمن استخدامات موثقة في برنامج التقنيات الناشئة السعودي.',
      en: "AI-driven robots for field tasks: elderly care, facility inspection, and hazardous operations — documented use cases in Saudi Arabia's emerging-technologies program.",
    },
    trl: 5,
    trlRationale: 'Care robots and inspection robots deployed in pilots (documented on my.gov.sa); embodied/physical AI newly listed on Gartner 2025 — validated in relevant environments, not yet at scale.',
    sectors: ['healthcare', 'social-development-justice', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'policy', 'service-design'],
    employeeSkills: ['Robotics service-design and safety case literacy', 'Human-robot interaction ethics', 'Procurement of robotic systems'],
    horizon: 'near',
    learningFocus: {
      awareness: 'Robots in care & inspection; human oversight',
      practitioner: 'Safety cases, HRI ethics, robotics procurement',
    },
  },
  {
    id: 'C6-T07', clusterId: 'frontier-deep-tech',
    name: { ar: 'واجهات الدماغ الحاسوبية', en: 'Brain-Computer Interfaces (BCI)' },
    description: {
      ar: 'واجهات تتيح التحكم المباشر بالأجهزة عبر الإشارات العصبية، واعدة بإعادة التأهيل وتمكين ذوي الإعاقة الشديدة من التفاعل مع الخدمات الرقمية.',
      en: 'Interfaces enabling direct device control via neural signals, promising for rehabilitation and enabling people with severe disabilities to interact with digital services.',
    },
    trl: 3,
    trlRationale: 'Human implants limited to small clinical trials (e.g., Neuralink cohorts); non-invasive BCIs are lab-stage — basic technology demonstration only.',
    sectors: ['healthcare', 'social-development-justice'],
    domainIds: ['emerging', 'policy'],
    employeeSkills: ['Neurotechnology ethics and governance awareness', 'Assistive-technology policy literacy', 'Horizon scanning for health-tech convergence'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Neurotech promise for disability inclusion',
      practitioner: 'Ethics & governance frameworks, health-tech foresight',
    },
  },
  {
    id: 'C6-T08', clusterId: 'frontier-deep-tech',
    name: { ar: 'العملات الرقمية للبنوك المركزية والأموال القابلة للبرمجة', en: 'Central Bank Digital Currency & Programmable Money' },
    description: {
      ar: 'عملات رقمية سيادية ومدفوعات مشروطة قابلة للبرمجة، ضمن تجارب البنك المركزي السعودي ومشروع «عابر» للتسويات عابرة للحدود.',
      en: 'Sovereign digital currencies and programmable conditional payments, explored through Saudi Central Bank experiments and the cross-border Project Aber.',
    },
    trl: 5,
    trlRationale: 'Project Aber validated wholesale CBDC technically; retail CBDC remains pilot-stage globally with few launches — validated in relevant environment, adoption decision pending.',
    sectors: ['trade-finance-economy', 'social-development-justice'],
    domainIds: ['emerging', 'policy', 'cyber'],
    employeeSkills: ['Digital payment ecosystem literacy', 'CBDC policy design trade-offs (privacy, intermediation)', 'Cross-border settlement concepts'],
    horizon: 'far',
    learningFocus: {
      awareness: 'Digital riyal concepts; SAMA experiments',
      practitioner: 'Payment ecosystems, policy trade-offs, settlement design',
    },
  },
]

export const techById = (id: string): Technology | undefined => technologies.find((x) => x.id === id)

/** Technologies linked to a given app domain id. */
export const techsForDomain = (domainId: string): Technology[] =>
  technologies.filter((x) => x.domainIds.includes(domainId))
