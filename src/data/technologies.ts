import type { L } from './types'
import { domains } from './domains'

/**
 * «تقنيات تغيّر العمل الحكومي» — technologies changing government work (v9, packet P5b).
 * Converted from research/tech-radar.md (v1.0, 2026). Counts are never written in copy:
 * derive them from `technologies.length` / `techClusters.length` (claim `method-tech-count`).
 *
 * Re-scoped from a "tech radar" to technology → required skills: each technology lists the
 * skills it demands from the radar's skill catalogue (`skills`, skill-record ids
 * `sr-<domain>-<index>`), plus the adoption horizon. TRL and horizon are editorial desk
 * ratings (claims `method-tech-trl`, `method-tech-horizons`), not the official national radar.
 * Skill-domain foreign keys use the app's domain ids
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
  trl: number // 1-9 TRL scale — editorial desk rating, shown only in the detail panel
  trlRationale: L
  sectors: string[] // affinity sector keys
  domainIds: string[] // app domain ids
  /** required skills from the radar's catalogue: skill-record ids `sr-<domain id>-<skill index>` */
  skills: string[]
  employeeSkills: L[]
  horizon: Horizon
  learningFocus: { awareness: L; practitioner: L }
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
    name: { ar: 'قريب المدى', en: 'Near term' },
    years: { ar: '2–5 سنوات', en: '2–5 years' },
    color: '#DBA102',
  },
  far: {
    name: { ar: 'بعيد المدى', en: 'Long term' },
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
      en: 'Artificial intelligence has moved from pilot projects to the operational core of government: generative AI drafts correspondence and summarizes legislation, predictive models target inspections and anticipate demand, and agentic systems are beginning to execute multi-step administrative workflows end to end. For Saudi Arabia — with a national AI strategy, a sovereign Arabic model (ALLaM), and an emerging-tech adoption index already above {{tech-dga-adoption-index-2026}} — the differentiator is no longer access to AI but the workforce’s ability to govern, evaluate, and supervise it. The skills shift is profound: civil servants must move from using tools to directing intelligent systems, with fluency in prompt design, model evaluation, bias detection, and AI accountability becoming as foundational as spreadsheet literacy once was.',
      ar: 'انتقل الذكاء الاصطناعي من المشاريع التجريبية إلى صميم العمل الحكومي: فالذكاء الاصطناعي التوليدي يصيغ المراسلات ويلخص التشريعات، والنماذج التنبؤية توجّه عمليات التفتيش وتستبق الطلب، والأنظمة الوكيلة بدأت تنفذ إجراءات إدارية متعددة الخطوات من البداية إلى النهاية. وفي المملكة العربية السعودية — التي تملك استراتيجية وطنية للذكاء الاصطناعي ونموذجاً لغوياً عربياً سيادياً (علّام) ومؤشر لتبني التقنيات الناشئة تجاوز {{tech-dga-adoption-index-2026}} — لم تعد الميزة التنافسية في الوصول إلى الذكاء الاصطناعي، بل في قدرة القوى العاملة على حوكمته وتقييمه والإشراف عليه. والتحول المهاري عميق: إذ يجب أن ينتقل الموظف الحكومي من استخدام الأدوات إلى توجيه الأنظمة الذكية، بحيث تصبح الطلاقة في تصميم الأوامر وتقييم النماذج وكشف التحيز والمساءلة عن الذكاء الاصطناعي أساسية كما كانت مهارة الجداول الإلكترونية في جيل سابق.',
    },
  },
  {
    id: 'data-infrastructure-sovereignty',
    name: { ar: 'البنية التحتية للبيانات والسيادة الرقمية', en: 'Data Infrastructure & Sovereignty' },
    essay: {
      en: 'Data has become the strategic substrate of digital government, and where it lives — and who controls it — is now a matter of national policy. Saudi Arabia is investing heavily in sovereign cloud, national data platforms, and AI-grade data centers (including SDAIA’s Hexagon and HUMAIN’s planned capacity), mirroring a global shift the OECD and Gartner call geopatriation: the deliberate migration of critical workloads to locally governed infrastructure. For public servants, the implication is that data literacy is no longer optional and infrastructure decisions are policy decisions; skills in data governance, interoperability, sovereign architecture assessment, and privacy-preserving analytics determine whether the Kingdom’s data wealth translates into public value.',
      ar: 'أصبحت البيانات الأساس الاستراتيجي للحكومة الرقمية، وأصبح مكان وجودها ومن يسيطر عليها شأناً من شؤون السياسة الوطنية. وتستثمر المملكة بكثافة في السحابة السيادية والمنصات الوطنية للبيانات ومراكز البيانات المخصصة للذكاء الاصطناعي (بما فيها مركز «سدايا هكساغون» والقدرات المخططة لدى «هيومين»)، في توجه عالمي تصفه OECD وغارتنر بـ«التوطين الجغرافي»: النقل المتعمد للأحمال الحرجة إلى بنية تحتية خاضعة للحوكمة المحلية. وبالنسبة للموظف الحكومي، فإن الإلمام بالبيانات لم يعد خياراً، وقرارات البنية التحتية أصبحت قرارات سياساتية؛ فمهارات حوكمة البيانات وقابلية التشغيل البيني وتقييم البنى السيادية والتحليلات المعززة للخصوصية هي ما يحدد إن كانت ثروة المملكة البياناتية ستتحول إلى قيمة عامة فعلية.',
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
    name: { ar: 'تجربة المستفيد وتقديم الخدمات', en: 'Beneficiary Experience & Service Delivery' },
    essay: {
      en: 'The frontier of digital government has shifted from putting forms online to anticipating needs before citizens ask. Recent OECD work describes the move from reactive to proactive and life-event-based services as the defining test of digital maturity, and conversational AI is collapsing the distance between beneficiaries and government procedures — in Arabic and English alike. For Saudi Arabia, where platforms like Tawakkalna and Absher have already normalized high-quality digital public services, the next skills frontier is empathy at scale: journey mapping, inclusive design, service analytics, and the ability to orchestrate AI-driven personalization without eroding trust or excluding the vulnerable.',
      ar: 'انتقلت حدود الحكومة الرقمية من مجرد إتاحة النماذج عبر الإنترنت إلى استباق احتياجات المواطنين قبل أن يطلبوها. وتصف أعمال OECD الحديثة التحول من الخدمات التفاعلية إلى الخدمات الاستباقية المبنية على أحداث الحياة بأنه الاختبار الحقيقي للنضج الرقمي، فيما تختصر المساعدات الحوارية المسافة بين المستفيد والإجراءات الحكومية — بالعربية والإنجليزية معاً. وفي المملكة، حيث رسّخت منصات كتوكلنا وأبشر تجربة خدمات حكومية رقمية عالية الجودة، فإن الحدود المهارية التالية هي التعاطف على نطاق واسع: رسم رحلات المستفيد، والتصميم الشامل، وتحليلات الخدمة، والقدرة على توظيف التخصيص الذكي دون إضعاف الثقة أو إقصاء الفئات الأكثر احتياجاً.',
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
    trlRationale: {
      ar: 'منشورة تشغيليًا في حكومات عدة (مساعدات حوارية، صياغة وثائق) ضمن ضوابط حوكمة؛ واتساع أثرها في العمل الحكومي خلال خمس سنوات تقدير تحريري.',
      en: 'Deployed in production across governments (e.g., chat assistants, document drafting) under governance guardrails; its wider impact on government work within five years is an editorial estimate.',
    },
    sectors: ['social-development-justice', 'education-training', 'trade-finance-economy'],
    domainIds: ['ai-data', 'policy'],
    skills: ['sr-ai-data-3', 'sr-ai-data-4', 'sr-policy-4'],
    employeeSkills: [
      { ar: 'صياغة الأوامر وتقييمها', en: 'Prompt engineering and evaluation' },
      { ar: 'تقييم مخاطر الذكاء الاصطناعي التوليدي والتحيز والهلوسة', en: 'GenAI risk, bias and hallucination assessment' },
      { ar: 'الإلمام بشراء الذكاء الاصطناعي وسياسات الاستخدام المقبول', en: 'AI procurement and acceptable-use policy literacy' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'ما يستطيعه الذكاء الاصطناعي التوليدي وما لا يستطيعه؛ قواعد الاستخدام المقبول والسرية', en: 'What GenAI can/can\'t do; acceptable use & confidentiality rules' },
      practitioner: { ar: 'هندسة الأوامر، وتقييم المخرجات، واختبار الهلوسة والتحيز', en: 'Prompt engineering, output evaluation, hallucination & bias testing' },
    },
  },
  {
    id: 'C1-T02', clusterId: 'intelligent-government-ai',
    name: { ar: 'وكلاء الذكاء الاصطناعي والأنظمة الذاتية', en: 'Agentic AI & Autonomous Agents' },
    description: {
      ar: 'أنظمة ذكاء اصطناعي تخطط وتنفذ مهاماً متعددة الخطوات بشكل شبه مستقل، مثل إتمام معاملة حكومية عبر عدة أنظمة دون تدخل بشري مباشر.',
      en: 'AI systems that plan and execute multi-step tasks semi-autonomously, such as completing a government transaction across several systems without direct human input.',
    },
    trl: 5,
    trlRationale: {
      ar: 'تصدّرت دورة غارتنر 2025 للتقنيات الناشئة عند ذروة التوقعات؛ توجد تجارب حكومية مبكرة لكن التشغيل الموثق نادر.',
      en: 'Topped Gartner\'s 2025 Hype Cycle for Emerging Technologies at peak expectations; early government pilots exist but validated operational deployments are rare.',
    },
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['ai-data', 'agile', 'policy'],
    skills: ['sr-emerging-0', 'sr-ai-data-4', 'sr-cyber-3'],
    employeeSkills: [
      { ar: 'تصميم سير عمل الوكلاء والإشراف البشري', en: 'Agent workflow design and human-in-the-loop supervision' },
      { ar: 'مفاهيم تنسيق الأدوات وواجهات برمجة التطبيقات (مثل MCP)', en: 'Tool/API orchestration concepts (e.g., MCP)' },
      { ar: 'تقييم مخاطر الاستقلالية وتصميم مسارات التصعيد', en: 'Autonomy risk assessment and escalation design' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'ما الوكلاء؛ ولماذا الإشراف البشري غير قابل للتفاوض', en: 'What agents are; why human oversight is non-negotiable' },
      practitioner: { ar: 'تصميم سير العمل، والضوابط، ومسارات التصعيد، وتنسيق الأدوات', en: 'Agent workflow design, guardrails, escalation paths, tool orchestration' },
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
    trlRationale: {
      ar: 'نموذج «علّام 34B» يشغّل HUMAIN Chat إنتاجيًا (أغسطس 2025)؛ النسخ المؤسسية منشورة لكن التكامل الحكومي الواسع ما زال ينضج.',
      en: 'ALLaM 34B powers HUMAIN Chat in production (Aug 2025); enterprise variants deployed, but broad government integration is still maturing.',
    },
    sectors: ['education-training', 'social-development-justice', 'travel-tourism-culture'],
    domainIds: ['ai-data', 'cloud'],
    skills: ['sr-ai-data-3', 'sr-cyber-1', 'sr-cloud-0'],
    employeeSkills: [
      { ar: 'تقييم جودة النماذج العربية وتغطية اللهجات', en: 'Evaluating Arabic LLM quality and dialect coverage' },
      { ar: 'المفاضلة بين الضبط الدقيق والتوليد المعزز بالاسترجاع', en: 'Fine-tuning vs. retrieval-augmented generation trade-offs' },
      { ar: 'النشر المتوافق مع نظام حماية البيانات الشخصية', en: 'PDPL-compliant deployment of language models' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'لماذا تهم النماذج السيادية والعربية؛ الإلمام بمنظومة «علّام»', en: 'Why sovereign/Arabic models matter; ALLaM ecosystem awareness' },
      practitioner: { ar: 'الاسترجاع مقابل الضبط الدقيق، ومقاييس التقييم العربية، والنشر المتوافق مع النظام', en: 'RAG vs. fine-tuning, Arabic evaluation benchmarks, PDPL-compliant deployment' },
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
    trlRationale: {
      ar: 'أعيد تقييمها إلى 8 (مراجعة 2026): عقدان من التشغيل الحكومي العالمي (كشف الاحتيال، التنبؤ بالطلب) مع نشر سعودي موثق.',
      en: 'Re-rated 7→8 (2026 review): two decades of operational government use (fraud detection, demand forecasting) plus documented Saudi deployments — fully operational technology, not just demonstrated.',
    },
    sectors: ['healthcare', 'social-development-justice', 'trade-finance-economy'],
    domainIds: ['ai-data', 'policy'],
    skills: ['sr-ai-data-2', 'sr-ai-data-4', 'sr-leadership-3'],
    employeeSkills: [
      { ar: 'الثقافة الإحصائية وتفسير النماذج', en: 'Statistical literacy and model interpretation' },
      { ar: 'تدقيق التحيز والعدالة في النماذج التنبؤية', en: 'Bias and fairness auditing of predictive models' },
      { ar: 'ترجمة مخرجات النماذج إلى قرارات سياساتية', en: 'Translating model outputs into policy decisions' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'قراءة التنبؤ؛ الارتباط لا يعني السببية؛ مخاطر التحيز', en: 'Reading a prediction; correlation ≠ causation; bias risks' },
      practitioner: { ar: 'دورة حياة النموذج، وتدقيق العدالة، وترجمة المخرجات إلى سياسات', en: 'Model lifecycle, fairness auditing, translating outputs into policy' },
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
    trlRationale: {
      ar: 'تتقدم في منحدر الإنارة لدى غارتنر (2025)؛ المنصات التجارية مثبتة والتبني الحكومي في طوره التشغيلي المبكر.',
      en: 'Progressing through Gartner\'s Slope of Enlightenment (2025); commercial platforms proven, government adoption in early operational stage.',
    },
    sectors: ['trade-finance-economy', 'urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['ai-data', 'leadership'],
    skills: ['sr-ai-data-2', 'sr-leadership-3', 'sr-policy-0'],
    employeeSkills: [
      { ar: 'نمذجة القرارات والاستدلال السببي', en: 'Decision modeling and causal reasoning' },
      { ar: 'تفسير محاكاة السيناريوهات', en: 'Scenario simulation interpretation' },
      { ar: 'حوكمة القرارات بين الجهات', en: 'Cross-agency decision governance' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'ثقافة القرار المبني على الدليل؛ حدود الأتمتة', en: 'Evidence-based decision culture; limits of automation' },
      practitioner: { ar: 'نمذجة القرار، والمحاكاة، وتصميم حلقات التغذية الراجعة', en: 'Decision modeling, simulation, feedback-loop design' },
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
    trlRationale: {
      ar: 'سائدة في القطاع؛ ويتوقع غارتنر استخدام 75% من مهندسي الشركات لها بحلول 2028 — والتبني الحكومي يلحق بذلك.',
      en: 'Mainstream in industry; Gartner predicts 75% of enterprise engineers will use them by 2028 — government adoption follows closely.',
    },
    sectors: ['trade-finance-economy', 'education-training'],
    domainIds: ['ai-data', 'agile'],
    skills: ['sr-ai-data-3', 'sr-cyber-4', 'sr-agile-0'],
    employeeSkills: [
      { ar: 'سير عمل التطوير المساند بالذكاء الاصطناعي ومراجعة الشيفرة', en: 'AI-assisted development workflows and code review' },
      { ar: 'الصياغة الآمنة للأوامر عند توليد الشيفرة', en: 'Secure prompting for code generation' },
      { ar: 'ضمان جودة الشيفرة المولّدة', en: 'Quality assurance of AI-generated code' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'لماذا تتبناها الجهات؛ تنبيهات الملكية الفكرية والأمن', en: 'Why agencies adopt them; IP & security caveats' },
      practitioner: { ar: 'دورة التطوير المساندة، والصياغة الآمنة، ومراجعة الشيفرة المولّدة', en: 'AI-assisted SDLC, secure prompting, AI-generated code review' },
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
    trlRationale: {
      ar: 'يضعها غارتنر في طور الشرارة الابتكارية (2025)؛ توجد إثباتات مفهوم دون تشغيل حكومي فعلي.',
      en: 'Gartner places machine customers in the Innovation Trigger phase (2025); proofs of concept exist, no operational government deployments.',
    },
    sectors: ['trade-finance-economy', 'social-development-justice'],
    domainIds: ['emerging', 'policy'],
    skills: ['sr-cloud-1', 'sr-policy-1', 'sr-emerging-4'],
    employeeSkills: [
      { ar: 'مفاهيم تصميم المعاملات بين الأنظمة', en: 'Machine-to-machine transaction design concepts' },
      { ar: 'الأطر القانونية والمسؤولية عن المعاملات الذاتية', en: 'Legal and liability frameworks for autonomous transactions' },
      { ar: 'أساسيات اقتصاد واجهات برمجة التطبيقات', en: 'API economy fundamentals' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'المفهوم؛ وانعكاساته على قنوات الخدمة', en: 'The concept; implications for service channels' },
      practitioner: { ar: 'تصميم معاملات آلة-لآلة، وأطر المسؤولية، واقتصاد الواجهات', en: 'M2M transaction design, liability frameworks, API economy' },
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
    trlRationale: {
      ar: 'الأدوات المدفوعة بقانون الذكاء الاصطناعي الأوروبي تعمل في الدول الرائدة؛ وتقرير OECD 2026 يرصد ترسخ آليات الشفافية الخوارزمية.',
      en: 'EU AI Act-driven tooling is operational in leading countries; OECD 2026 reports algorithmic transparency mechanisms consolidating — but broad operational use is recent.',
    },
    sectors: ['social-development-justice', 'education-training', 'trade-finance-economy'],
    domainIds: ['policy', 'ai-data'],
    skills: ['sr-ai-data-4', 'sr-policy-1', 'sr-ai-data-1'],
    employeeSkills: [
      { ar: 'تقييم الأثر الخوارزمي', en: 'Algorithmic impact assessment' },
      { ar: 'توثيق النماذج ومسارات التدقيق', en: 'Model documentation and audit trails' },
      { ar: 'تطبيق أطر أخلاقيات الذكاء (سدايا، OECD)', en: 'AI ethics frameworks (SDAIA, OECD) application' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'لماذا يجب تسجيل الذكاء الاصطناعي وقابليته للتدقيق؛ المبادئ الأخلاقية', en: 'Why AI must be registered & auditable; ethics principles' },
      practitioner: { ar: 'تقييم الأثر الخوارزمي، وتوثيق النماذج، وأدوات التدقيق', en: 'Algorithmic impact assessment, model documentation, audit tooling' },
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
    trlRationale: {
      ar: 'أنظمة تشغيلية قائمة (إطلاقات المناطق السحابية السعودية، نماذج Bleu/Delos الأوروبية)؛ وسمّى غارتنر «التوطين الجغرافي» توجهًا استراتيجيًا لعام 2026.',
      en: 'Operational systems live (KSA cloud region launches, EU Bleu/Delos models); Gartner named geopatriation a top strategic trend for 2026 — adoption scaling but not universal.',
    },
    sectors: ['trade-finance-economy', 'healthcare', 'social-development-justice'],
    domainIds: ['cloud', 'policy'],
    skills: ['sr-cloud-0', 'sr-cloud-4', 'sr-policy-4'],
    employeeSkills: [
      { ar: 'تقييم الخدمات السحابية ومتطلبات إقامة البيانات', en: 'Cloud service assessment and data residency requirements' },
      { ar: 'المفاضلة بين البنى السيادية ومزودي الحوسبة الكبار', en: 'Sovereign vs. hyperscaler architecture trade-offs' },
      { ar: 'الشراء السحابي وتخطيط استراتيجية الخروج', en: 'Cloud procurement and exit-strategy planning' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'ماذا تعني إقامة البيانات؛ ولماذا السيادة قرار سياساتي', en: 'What data residency means; why sovereignty is policy' },
      practitioner: { ar: 'تقييم المعمارية السحابية، والشراء، واستراتيجيات الخروج', en: 'Cloud architecture assessment, procurement, exit strategies' },
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
    trlRationale: {
      ar: 'تشغيلية في السعودية ومعظم دول OECD؛ ويذكر تقرير 2026 أن 8 من كل 10 دول تملك أنظمة تشغيل بيني للبيانات على مستوى الحكومة.',
      en: 'Operational in Saudi Arabia and most OECD countries; OECD 2026 reports 8 in 10 countries have government-wide data interoperability systems.',
    },
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['ai-data', 'cloud'],
    skills: ['sr-ai-data-1', 'sr-cloud-1', 'sr-policy-2'],
    employeeSkills: [
      { ar: 'فهرسة البيانات وإدارة البيانات الوصفية', en: 'Data cataloging and metadata management' },
      { ar: 'ممارسات جودة البيانات وأمانتها', en: 'Data quality and stewardship practices' },
      { ar: 'اتفاقيات مشاركة البيانات بين الجهات', en: 'Inter-agency data-sharing agreements' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'البيانات أصل وطني؛ وواجبات المشاركة', en: 'Data as a national asset; sharing obligations' },
      practitioner: { ar: 'الفهرسة، والبيانات الوصفية، وجودة البيانات، واتفاقيات المشاركة', en: 'Cataloging, metadata, data quality, sharing agreements' },
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
    trlRationale: {
      ar: 'Gaia-X تعمل بملصقات ثقة (2025) لكن فضاءات البيانات القطاعية ما زالت تجريبية في معظم الحكومات.',
      en: 'Gaia-X operational with trust labels (2025) but sectoral data spaces remain pilots in most governments; validation in relevant environments ongoing.',
    },
    sectors: ['trade-finance-economy', 'energy-natural-resources', 'healthcare'],
    domainIds: ['ai-data', 'policy'],
    skills: ['sr-ai-data-1', 'sr-cloud-1', 'sr-cyber-1'],
    employeeSkills: [
      { ar: 'حوكمة مشاركة البيانات ونماذج الموافقة', en: 'Data-sharing governance and consent models' },
      { ar: 'معايير التشغيل البيني (واجهات برمجة التطبيقات والأنطولوجيات)', en: 'Interoperability standards (APIs, ontologies)' },
      { ar: 'الإلمام بتنظيم تدفق البيانات عبر الحدود', en: 'Cross-border data flow regulation literacy' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'المشاركة المتحكم بها مقابل البيانات المفتوحة', en: 'Controlled data sharing vs. open data' },
      practitioner: { ar: 'معايير التشغيل البيني ونماذج الموافقة والحوكمة', en: 'Interoperability standards, consent & governance models' },
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
    trlRationale: {
      ar: 'أعيد تقييمها إلى 7 (مراجعة 2026): منشورة تجاريًا على نطاق واسع، والمسوّغ الأصلي نفسه يقر بأنظمة مدن ذكية تشغيلية.',
      en: 'Re-rated 6→7 (2026 review): commercially deployed at scale; the original rationale itself acknowledges operational smart-city systems.',
    },
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['cloud', 'emerging'],
    skills: ['sr-cloud-0', 'sr-emerging-1', 'sr-cloud-4'],
    employeeSkills: [
      { ar: 'أساسيات معمارية الطرف-السحابة', en: 'Edge-cloud architecture fundamentals' },
      { ar: 'تصميم خطوط بيانات إنترنت الأشياء', en: 'IoT data pipeline design' },
      { ar: 'تحليل متطلبات الكمون والمرونة', en: 'Latency and resilience requirements analysis' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'لماذا تنتقل المعالجة قرب المواطنين والأجهزة', en: 'Why compute moves near citizens/devices' },
      practitioner: { ar: 'معمارية الطرف-السحابة، وخطوط بيانات الأشياء، وتصميم المرونة', en: 'Edge-cloud architecture, IoT pipelines, resilience design' },
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
    trlRationale: {
      ar: 'محقَّقة في القطاعات المنظمة (الصحة والمال) ومعتمدة لدى مكاتب إحصاء وطنية في تجارب؛ وتتوسع نحو التشغيل.',
      en: 'Validated in regulated sectors (health, finance) and adopted by national statistics offices in pilots; scaling toward operational use.',
    },
    sectors: ['healthcare', 'social-development-justice', 'education-training'],
    domainIds: ['ai-data', 'cyber'],
    skills: ['sr-cyber-1', 'sr-ai-data-1', 'sr-ai-data-2'],
    employeeSkills: [
      { ar: 'تقييم مخاطر الخصوصية في مجموعات البيانات الاصطناعية', en: 'Privacy risk assessment of synthetic datasets' },
      { ar: 'التحقق الإحصائي من البيانات الاصطناعية مقابل الحقيقية', en: 'Statistical validation of synthetic vs. real data' },
      { ar: 'الإلمام بمنظومة تقنيات تعزيز الخصوصية', en: 'PET (privacy-enhancing technology) landscape literacy' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'مفهوم الابتكار المحافظ على الخصوصية', en: 'Privacy-preserving innovation concept' },
      practitioner: { ar: 'التحقق الإحصائي، ومخاطر إعادة التعرف، ومنظومة تقنيات الخصوصية', en: 'Statistical validation, re-identification risk, PET landscape' },
    },
  },
  {
    id: 'C2-T06', clusterId: 'data-infrastructure-sovereignty',
    name: { ar: 'المخططات المعرفية والتشغيل البيني الدلالي', en: 'Knowledge Graphs & Semantic Interoperability' },
    description: {
      ar: 'نمذجة العلاقات بين الكيانات الحكومية (الأشخاص، التراخيص، المنشآت) كشبكة معرفية موحدة تتيح الاستعلام الذكي وخدمات «مرة واحدة فقط» عبر الجهات.',
      en: "Modeling relationships between government entities (persons, licenses, businesses) as a unified knowledge network enabling intelligent queries and 'once-only' services across agencies.",
    },
    trl: 6,
    trlRationale: {
      ar: 'مثبتة في منصات المؤسسات وفي مفردات البيانات الحكومية المشتركة (مثل المفردات الأساسية الأوروبية SEMIC وبيانات الفهرسة بمعيار DCAT-AP)؛ والطبقات الدلالية الحكومية الشاملة منشورة جزئيًا.',
      en: 'Proven in enterprise graph platforms and shared government data vocabularies (e.g., the EU SEMIC Core Vocabularies and DCAT-AP metadata); government-wide semantic layers remain partially deployed.',
    },
    sectors: ['social-development-justice', 'trade-finance-economy'],
    domainIds: ['ai-data', 'cloud'],
    skills: ['sr-cloud-1', 'sr-ai-data-1', 'sr-ai-data-0'],
    employeeSkills: [
      { ar: 'أساسيات نمذجة البيانات والأنطولوجيا', en: 'Data modeling and ontology basics' },
      { ar: 'الإلمام بالبيانات المترابطة وSPARQL', en: 'Linked-data and SPARQL literacy' },
      { ar: 'تصميم التشغيل البيني للسجلات', en: 'Registry interoperability design' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'البيانات المترابطة تتيح حكومة «مرة واحدة فقط»', en: 'Connected data enables \'once-only\' government' },
      practitioner: { ar: 'الأنطولوجيات، والبيانات المترابطة، والتشغيل البيني للسجلات', en: 'Ontologies, linked data, registry interoperability' },
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
    trlRationale: {
      ar: 'أعيد تقييمها إلى 7 (مراجعة 2026): التبريد السائل وتحسين PUE ناضجان تجاريًا؛ والجديد فقط هو التكامل في حرم الذكاء الاصطناعي العملاقة.',
      en: 'Re-rated 6→7 (2026 review): liquid cooling and PUE optimization are commercially mature; only the giga-scale AI-campus integration is novel.',
    },
    sectors: ['energy-natural-resources', 'urban-mobility-smart-cities'],
    domainIds: ['cloud', 'emerging'],
    skills: ['sr-cloud-4', 'sr-policy-4', 'sr-agile-4'],
    employeeSkills: [
      { ar: 'مقاييس طاقة مراكز البيانات (PUE وCUE)', en: 'Data-center energy metrics (PUE, CUE)' },
      { ar: 'الشراء المستدام للبنية التحتية', en: 'Sustainable procurement of IT infrastructure' },
      { ar: 'أساسيات العمليات الخضراء وجدولة الأحمال الواعية بالكربون', en: 'GreenOps and carbon-aware workload scheduling basics' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'للنمو الرقمي بصمة طاقية', en: 'Digital growth has an energy footprint' },
      practitioner: { ar: 'مقاييس PUE/CUE، والشراء المستدام، والجدولة الواعية بالكربون', en: 'PUE/CUE metrics, sustainable procurement, carbon-aware scheduling' },
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
    trlRationale: {
      ar: 'محقَّقة في مختبرات واتحادات بحثية وصحية؛ وخروجها من دورة غارتنر 2025 كبند مستقل يشير إلى نضج تشغيلي ما يزال مبكرًا.',
      en: 'Validated in research and healthcare consortia labs; dropped from Gartner\'s 2025 Hype Cycle as a standalone item, indicating still-early operational maturity.',
    },
    sectors: ['healthcare', 'education-training'],
    domainIds: ['ai-data', 'cyber'],
    skills: ['sr-cyber-1', 'sr-ai-data-1', 'sr-ai-data-4'],
    employeeSkills: [
      { ar: 'مفاهيم تعلم الآلة المحافظ على الخصوصية', en: 'Privacy-preserving ML concepts' },
      { ar: 'حوكمة البيانات الموزعة', en: 'Distributed data governance' },
      { ar: 'تقييم المفاضلة بين التعلم الموحد والمركزي', en: 'Evaluating federated vs. centralized model trade-offs' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'التعاون دون نقل البيانات', en: 'Collaboration without moving data' },
      practitioner: { ar: 'تصميم التعلم المحافظ على الخصوصية والحوكمة الموزعة', en: 'Privacy-preserving ML design, distributed governance' },
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
    trlRationale: {
      ar: 'المحفظة الأوروبية تتعمم على الدول الأعضاء بحلول 2026؛ وتطبيقات الهوية الخليجية تعمل — تحقق في بيئة تشغيلية والتكامل الكامل جارٍ.',
      en: 'EU Digital Identity Wallet rolling out to member states by 2026; Gulf national ID apps operational — system demonstration in operational environment achieved, full-scale integration ongoing.',
    },
    sectors: ['social-development-justice', 'travel-tourism-culture', 'trade-finance-economy'],
    domainIds: ['cyber', 'service-design'],
    skills: ['sr-cloud-3', 'sr-cyber-3', 'sr-service-design-2'],
    employeeSkills: [
      { ar: 'مستويات ضمان الهوية وعمليات التحقق الإلكتروني', en: 'Identity assurance levels and eKYC processes' },
      { ar: 'معايير الاعتمادات القابلة للتحقق (W3C VC)', en: 'Verifiable credentials standards (W3C VC)' },
      { ar: 'تصميم الانضمام الشامل للهوية الرقمية', en: 'Inclusive onboarding design for digital ID' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'استخدام المحفظة؛ أساسيات دعم المواطنين', en: 'Using the wallet; citizen support basics' },
      practitioner: { ar: 'مستويات الضمان، والاعتمادات القابلة للتحقق، والانضمام الشامل', en: 'Assurance levels, verifiable credentials, inclusive onboarding' },
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
    trlRationale: {
      ar: 'أعيد تقييمها إلى 6 (مراجعة 2026): معايير NIST نهائية منذ 2024 مع نشر هجين واسع في البنية العالمية — محقَّقة في بيئات ذات صلة.',
      en: 'Re-rated 5→6 (2026 review): NIST standards final since 2024 with wide hybrid deployment in global infrastructure (browsers/CDNs) — validated in relevant environments; government migration at pilot/inventory stage.',
    },
    sectors: ['trade-finance-economy', 'social-development-justice', 'energy-natural-resources'],
    domainIds: ['cyber', 'cloud'],
    skills: ['sr-cyber-4', 'sr-cyber-2', 'sr-cloud-2'],
    employeeSkills: [
      { ar: 'جرد التشفير والمرونة التشفيرية', en: 'Cryptographic inventory and crypto-agility' },
      { ar: 'الإلمام بخرائط ترحيل التشفير المقاوم للكم', en: 'PQC migration roadmap literacy' },
      { ar: 'إيصال مخاطر «احصد الآن وافكك لاحقًا»', en: '\'Harvest now, decrypt later\' risk communication' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: '«احصد الآن وافكك لاحقًا» — لماذا نبدأ مبكرًا', en: '\'Harvest now, decrypt later\' — why act early' },
      practitioner: { ar: 'الجرد التشفيري، والمرونة التشفيرية، وخرائط الترحيل', en: 'Crypto inventory, crypto-agility, PQC migration roadmaps' },
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
    trlRationale: {
      ar: 'إلزامية للوكالات الفيدرالية الأمريكية بموجب المذكرة M-22-09 (2022)، ومعرّفة في معيار NIST SP 800-207؛ والتطبيق الحكومي في المنطقة غير موثق علنًا بما يكفي.',
      en: 'Mandated for US federal agencies by OMB M-22-09 (2022) and defined in NIST SP 800-207; public documentation of government deployment in the region is limited.',
    },
    sectors: ['social-development-justice', 'trade-finance-economy'],
    domainIds: ['cyber', 'cloud'],
    skills: ['sr-cyber-3', 'sr-cyber-4', 'sr-cyber-0'],
    employeeSkills: [
      { ar: 'مبادئ انعدام الثقة وتصميم السياسات', en: 'Zero-trust principles and policy design' },
      { ar: 'إدارة الوصول المتمحورة حول الهوية', en: 'Identity-centric access management' },
      { ar: 'الوعي بالأمن السيبراني لغير المختصين', en: 'Cybersecurity awareness for non-specialists' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'لا ثقة مسبقة أبدًا، تحقق دائم — عادات يومية', en: 'Never trust, always verify — daily habits' },
      practitioner: { ar: 'تصميم السياسات، والوصول المتمحور حول الهوية، والتقسيم', en: 'Policy design, identity-centric access, segmentation' },
    },
  },
  {
    id: 'C3-T04', clusterId: 'trust-security-digital-identity',
    name: { ar: 'الحوسبة السرية والتشفير المتجانس', en: 'Confidential Computing & Homomorphic Encryption' },
    description: {
      ar: 'تقنيات تتيح معالجة البيانات وهي مشفرة دون فكها، ما يسمح بتحليلات مشتركة بين الجهات على بيانات حساسة دون كشفها.',
      en: 'Technologies that process data while it remains encrypted, enabling joint analytics across entities on sensitive data without exposing it.',
    },
    trl: 4,
    trlRationale: {
      ar: 'عتاد الحوسبة السرية (TEEs) يُشحن تجاريًا، لكن التشفير المتجانس الكامل ما يزال مخبريًا؛ ويصنفها غارتنر ضرورة ناشئة لعصر الكم.',
      en: 'Confidential computing hardware (TEEs) is shipping, but fully homomorphic encryption remains at lab/pilot stage; Gartner lists encrypted computing as an emerging necessity for the quantum era.',
    },
    sectors: ['healthcare', 'trade-finance-economy', 'social-development-justice'],
    domainIds: ['cyber', 'ai-data'],
    skills: ['sr-cyber-1', 'sr-cyber-4', 'sr-ai-data-1'],
    employeeSkills: [
      { ar: 'نظرة عامة على تقنيات تعزيز الخصوصية', en: 'Privacy-enhancing technologies overview' },
      { ar: 'مفاهيم الحوسبة متعددة الأطراف الآمنة', en: 'Secure multi-party computation concepts' },
      { ar: 'تقييم مخاطر البيانات قيد الاستخدام مقابل قيد التخزين', en: 'Data-use vs. data-at-rest risk assessment' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'يمكن حماية البيانات حتى أثناء استخدامها', en: 'Data can be protected even while in use' },
      practitioner: { ar: 'بيئات التنفيذ الموثوقة، وحدود التشفير المتجانس، وتصميم التحليلات الآمنة', en: 'TEEs, homomorphic encryption limits, secure analytics design' },
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
    trlRationale: {
      ar: 'ضمن أهم 10 تقنيات ناشئة للمنتدى الاقتصادي العالمي 2025 بأثر متوقع خلال 3–5 سنوات؛ معايير C2PA موجودة لكن التبني الشامل في بداياته.',
      en: 'Named a WEF Top 10 Emerging Technology of 2025 with impact expected in 3–5 years; C2PA standards exist but universal adoption is nascent.',
    },
    sectors: ['social-development-justice', 'travel-tourism-culture', 'education-training'],
    domainIds: ['cyber', 'policy'],
    skills: ['sr-cyber-0', 'sr-ai-data-4', 'sr-service-design-3'],
    employeeSkills: [
      { ar: 'الإلمام بالتزييف العميق والوسائط الاصطناعية', en: 'Deepfake and synthetic-media literacy' },
      { ar: 'معايير أصالة المحتوى (C2PA)', en: 'Content provenance standards (C2PA)' },
      { ar: 'تواصل الأزمات لسلامة المعلومات', en: 'Crisis communication for information integrity' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'رصد التزييف العميق؛ والتحقق من المحتوى الرسمي', en: 'Spotting deepfakes; verifying official content' },
      practitioner: { ar: 'تنفيذ C2PA، وسير عمل التحقق، وتواصل الأزمات', en: 'C2PA implementation, verification workflows, crisis comms' },
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
    trlRationale: {
      ar: 'محقَّقة في تجارب (EBSI الأوروبية واعتماد التعليم الوطني)؛ وتوقعات السوق إيجابية لكن التشغيل الحكومي محدود.',
      en: 'Validated in pilots (EU EBSI, national education credentialing); market reports project growth but government production use remains limited.',
    },
    sectors: ['education-training', 'trade-finance-economy', 'social-development-justice'],
    domainIds: ['cyber', 'emerging'],
    skills: ['sr-cloud-3', 'sr-emerging-2', 'sr-cyber-1'],
    employeeSkills: [
      { ar: 'أساسيات المعرّفات اللامركزية والاعتمادات القابلة للتحقق', en: 'DIDs and verifiable credentials fundamentals' },
      { ar: 'تصميم الموافقة والإفصاح الانتقائي', en: 'Consent and selective disclosure design' },
      { ar: 'التشغيل البيني مع أنظمة الهوية الوطنية', en: 'Interoperability with national ID systems' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'مفهوم الاعتمادات التي يملكها المستخدم', en: 'User-controlled credentials concept' },
      practitioner: { ar: 'المعرفات والاعتمادات، والإفصاح الانتقائي، والتكامل مع الهوية الوطنية', en: 'DIDs/VCs, selective disclosure, national ID integration' },
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
    trlRationale: {
      ar: 'أدوات مراكز العمليات المدعومة بالذكاء الاصطناعي تعمل في مراكز أمن حكومية رائدة؛ وتُعد توجهًا حاكمًا لعام 2026 في الإدارة العامة.',
      en: 'AI-driven SOC tooling is operational in leading government security centers; identified as a defining 2026 public-administration trend.',
    },
    sectors: ['social-development-justice', 'trade-finance-economy', 'energy-natural-resources'],
    domainIds: ['cyber', 'ai-data'],
    skills: ['sr-cyber-2', 'sr-cyber-0', 'sr-ai-data-4'],
    employeeSkills: [
      { ar: 'الإلمام بمشهد التهديدات وسير عمل مركز العمليات', en: 'Threat landscape and SOC workflow literacy' },
      { ar: 'تقييم ادعاءات أدوات الأمن الذكية', en: 'Evaluating AI security tool claims' },
      { ar: 'تنسيق الاستجابة للحوادث والإبلاغ عنها', en: 'Incident response coordination and reporting' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'كل موظف حسّاس: الإبلاغ عن التصيد والشذوذ', en: 'Everyone is a sensor: reporting phishing & anomalies' },
      practitioner: { ar: 'سير عمل مركز العمليات، وتقييم أدوات الذكاء الاصطناعي، وتنسيق الحوادث', en: 'SOC workflows, AI tool evaluation, incident coordination' },
    },
  },
  {
    id: 'C3-T08', clusterId: 'trust-security-digital-identity',
    name: { ar: 'المصادقة البيومترية المتقدمة ومفاتيح المرور', en: 'Advanced Biometrics & Passkeys' },
    description: {
      ar: 'مصادقة بلا كلمات مرور تعتمد على الوجه والبصمة ومفاتيح المرور المشفرة (FIDO2). في المملكة يعتمد «نفاذ» على الموافقة عبر تطبيقه مع مطابقة الرقم والتحقق الحيوي بالوجه، ومفاتيح المرور معيار عالمي ما زال يتوسع.',
      en: 'Passwordless authentication using face, fingerprint and cryptographic passkeys (FIDO2). In Saudi Arabia, Nafath relies on in-app approval with number matching and face biometrics; passkeys are a global standard that is still spreading.',
    },
    trl: 9,
    trlRationale: {
      ar: 'أعيد تقييمها إلى 9 (مراجعة 2026): «نفاذ» يعمل على نطاق وطني منذ سنوات — وهذا نص تعريف المستوى التاسع (مثبت في التشغيل الفعلي).',
      en: 'Re-rated 8→9 (2026 review): Nafath has run at national scale for years — the textbook definition of TRL 9 (proven in operational use).',
    },
    sectors: ['social-development-justice', 'travel-tourism-culture'],
    domainIds: ['cyber', 'service-design'],
    skills: ['sr-cyber-3', 'sr-cyber-1', 'sr-service-design-1'],
    employeeSkills: [
      { ar: 'ضمان البيومترية ومخاطر الانتحال', en: 'Biometric assurance and spoofing risks' },
      { ar: 'تصميم رحلات مفاتيح المرور (FIDO2)', en: 'FIDO2/passkey user-journey design' },
      { ar: 'أبعاد خصوصية البيانات البيومترية (نظام حماية البيانات)', en: 'Privacy implications of biometric data (PDPL)' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'الدخول بلا كلمات مرور؛ وحماية بياناتك البيومترية', en: 'Passwordless login; protecting your biometrics' },
      practitioner: { ar: 'مقاومة الانتحال، ورحلات FIDO2، وخصوصية البيومترية', en: 'Spoofing resistance, FIDO2 journeys, biometric privacy (PDPL)' },
    },
  },
  // Cluster 4 — Beneficiary Experience & Service Delivery
  {
    id: 'C4-T01', clusterId: 'citizen-experience-delivery',
    name: { ar: 'الخدمات الحكومية الاستباقية', en: 'Proactive & Anticipatory Government Services' },
    description: {
      ar: 'خدمات تُقدَّم تلقائياً عند استحقاقها (كإصدار سجل تجاري أو صرف مستحقات عند حدث حياتي) دون حاجة المواطن لتقديم طلب.',
      en: 'Services delivered automatically when due (e.g., issuing a commercial registration or paying entitlements upon a life event) without the citizen filing a request.',
    },
    trl: 6,
    trlRationale: {
      ar: 'يسمي تقرير OECD 2026 التقديم الاستباقي وجهة المسار؛ وحكومات رائدة تظهره تشغيليًا (حزم المواليد، التجديد التلقائي) لكن أغلب الخدمات ما زال تفاعليًا.',
      en: 'OECD 2026 calls proactive delivery the direction of travel; leading governments demonstrate it operationally (birth bundles, auto-renewals), but most services remain reactive.',
    },
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['service-design', 'policy', 'agile'],
    skills: ['sr-service-design-1', 'sr-policy-1', 'sr-ai-data-1'],
    employeeSkills: [
      { ar: 'رسم رحلات أحداث الحياة', en: 'Life-event journey mapping' },
      { ar: 'الأساس القانوني والموافقة للتقديم الاستباقي', en: 'Legal basis and consent for proactive delivery' },
      { ar: 'تصميم محفزات الخدمة من بيانات السجلات', en: 'Service trigger design from registry data' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'خدمات تأتيك؛ وتوقعات الموافقة', en: 'Services that come to you; consent expectations' },
      practitioner: { ar: 'تصميم المحفزات، والأسس القانونية، والأتمتة المدفوعة بالسجلات', en: 'Trigger design, legal bases, registry-driven automation' },
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
    trlRationale: {
      ar: 'تعمل على نطاق واسع في المنصات السعودية ومعظم الحكومات الرقمية؛ وترقيات النماذج اللغوية تحسّن الجودة باستمرار.',
      en: 'Operational at scale in Saudi platforms and most digital governments; LLM upgrades improving quality continuously.',
    },
    sectors: ['social-development-justice', 'travel-tourism-culture', 'trade-finance-economy'],
    domainIds: ['service-design', 'ai-data'],
    skills: ['sr-service-design-3', 'sr-ai-data-3', 'sr-service-design-4'],
    employeeSkills: [
      { ar: 'تصميم المحادثة ونبرة الصوت', en: 'Conversation design and tone of voice' },
      { ar: 'تقييم المساعدات الحوارية (الدقة والاحتواء والتصعيد)', en: 'Chatbot evaluation (accuracy, containment, escalation)' },
      { ar: 'اعتبارات اللهجات العربية في معالجة اللغة', en: 'Arabic NLP dialect considerations' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'الحصول على المساعدة من المساعدات الحوارية؛ والتصعيد للبشر', en: 'Getting help from chatbots; escalation to humans' },
      practitioner: { ar: 'تصميم المحادثة، ومقاييس الاحتواء، ومعالجة اللهجات', en: 'Conversation design, containment metrics, dialect handling' },
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
    trlRationale: {
      ar: 'العتاد نضج (Vision Pro وQuest) لكن غارتنر يضع الحوسبة المكانية على بعد 5–10 سنوات من الهضبة؛ والاستخدام الحكومي تجريبي خارج عروض السياحة.',
      en: 'Hardware matured (Vision Pro, Quest) but Gartner places spatial computing 5–10 years from plateau; government use is pilot-scale beyond tourism showcases.',
    },
    sectors: ['travel-tourism-culture', 'education-training', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'service-design'],
    skills: ['sr-service-design-2', 'sr-emerging-4', 'sr-service-design-4'],
    employeeSkills: [
      { ar: 'مبادئ تصميم التجارب الغامرة', en: 'Immersive experience design principles' },
      { ar: 'تقييم جدوى حالات استخدام الواقع المعزز والافتراضي', en: 'AR/VR use-case viability assessment' },
      { ar: 'إمكانية الوصول في البيئات الغامرة', en: 'Accessibility in immersive environments' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'ما الذي يقدمه الواقع المعزز والافتراضي للمواطنين والتدريب', en: 'What AR/VR can offer citizens & training' },
      practitioner: { ar: 'تصميم التجربة الغامرة، وتقييم الجدوى، وإمكانية الوصول', en: 'Immersive UX design, viability assessment, accessibility' },
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
    trlRationale: {
      ar: 'أدوات تنقيب العمليات والمحاكاة مثبتة في القطاع؛ وتوائم الخدمات الحكومية في طور التحقق والتجريب.',
      en: 'Process mining and simulation tooling proven in industry; government service twins are in validation/pilot stage.',
    },
    sectors: ['urban-mobility-smart-cities', 'trade-finance-economy', 'social-development-justice'],
    domainIds: ['agile', 'ai-data', 'service-design'],
    skills: ['sr-service-design-1', 'sr-ai-data-2', 'sr-emerging-3'],
    employeeSkills: [
      { ar: 'تنقيب العمليات ونمذجتها', en: 'Process mining and modeling' },
      { ar: 'تفسير المحاكاة لاختبار السياسات', en: 'Simulation interpretation for policy testing' },
      { ar: 'رسم مخططات الخدمة', en: 'Service blueprinting' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'اختبار التغييرات افتراضيًا قبل التطبيق الفعلي', en: 'Testing changes virtually before real rollout' },
      practitioner: { ar: 'تنقيب العمليات، وتصميم المحاكاة، ومخططات الخدمة', en: 'Process mining, simulation design, blueprinting' },
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
    trlRationale: {
      ar: 'مُظهَرة تشغيليًا في الحكومات الرقمية الرائدة وفي مبادرات أحداث الحياة السعودية؛ والتنسيق بين الجهات ما زال يتوسع.',
      en: 'Demonstrated operationally in leading digital governments and in Saudi life-event initiatives; cross-agency orchestration still scaling.',
    },
    sectors: ['social-development-justice', 'trade-finance-economy', 'healthcare'],
    domainIds: ['service-design', 'agile', 'leadership'],
    skills: ['sr-service-design-1', 'sr-agile-3', 'sr-agile-4'],
    employeeSkills: [
      { ar: 'رسم الرحلات ومخططات الخدمة', en: 'Journey mapping and service blueprinting' },
      { ar: 'تنسيق الخدمات بين الجهات', en: 'Cross-agency service orchestration' },
      { ar: 'قياس أداء الرحلة من الطرف إلى الطرف', en: 'Measuring end-to-end journey performance' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'خدمات مجمعة حول أحداث الحياة', en: 'Bundled services around life events' },
      practitioner: { ar: 'رسم الرحلات، والتنسيق بين الجهات، والقياس', en: 'Journey mapping, cross-agency orchestration, measurement' },
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
    trlRationale: {
      ar: 'تقنية التوصية ناضجة في القطاع الخاص؛ والنشر الحكومي بضوابط العدالة ممارسة تشغيلية ناشئة.',
      en: 'Recommender technology mature in the private sector; government deployment with equity guardrails is emerging operational practice.',
    },
    sectors: ['social-development-justice', 'education-training', 'trade-finance-economy'],
    domainIds: ['ai-data', 'service-design', 'policy'],
    skills: ['sr-ai-data-4', 'sr-service-design-0', 'sr-policy-3'],
    employeeSkills: [
      { ar: 'أخلاقيات التخصيص ومراجعة العدالة', en: 'Personalization ethics and equity review' },
      { ar: 'أساسيات أنظمة التوصية', en: 'Recommender system fundamentals' },
      { ar: 'اختبار A/B للخدمات العامة', en: 'A/B testing for public services' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'خدمات حكومية مخصصة؛ وأسئلة العدالة', en: 'Personalized gov services; equity questions' },
      practitioner: { ar: 'أساسيات التوصية، ومراجعة الأخلاقيات، واختبار A/B', en: 'Recommender fundamentals, ethics review, A/B testing' },
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
    trlRationale: {
      ar: 'بلغ التعرف على اللهجات العربية جودة قابلة للاستخدام في نماذج 2025 (كالإدخال الصوتي في علّام)؛ والنشر في القنوات الحكومية تشغيلي مبكر.',
      en: 'Dialectal Arabic ASR reached usable quality in 2025 models (e.g., ALLaM speech input); government channel deployment is early operational.',
    },
    sectors: ['social-development-justice', 'healthcare', 'education-training'],
    domainIds: ['service-design', 'ai-data'],
    skills: ['sr-service-design-0', 'sr-policy-3', 'sr-ai-data-3'],
    employeeSkills: [
      { ar: 'تصميم تجربة الصوت', en: 'Voice UX design' },
      { ar: 'تغطية اللهجات وتقييم بيانات الكلام', en: 'Dialect coverage and speech-data evaluation' },
      { ar: 'تقييم احتياجات الشمولية الرقمية', en: 'Digital inclusion needs assessment' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'الوصول الصوتي لجميع المواطنين؛ وأهمية اللهجات', en: 'Voice access for all citizens; dialects matter' },
      practitioner: { ar: 'تجربة الصوت، وتقييم التعرف على الكلام، وتقييم الشمول', en: 'Voice UX, ASR evaluation, inclusion assessment' },
    },
  },
  {
    id: 'C4-T08', clusterId: 'citizen-experience-delivery',
    name: { ar: 'تقنيات إمكانية الوصول والتصميم الشامل', en: 'Accessibility & Inclusive Design Technology' },
    description: {
      ar: 'أدوات ومعايير (WCAG، قارئات الشاشة، الترجمة الآلية المبسطة) تضمن وصول جميع المواطنين — بمن فيهم ذوي الإعاقة — إلى الخدمات الرقمية على قدم المساواة.',
      en: 'Tools and standards (WCAG, screen readers, plain-language machine translation) ensuring all citizens — including people with disabilities — access digital services equally.',
    },
    trl: 8,
    trlRationale: {
      ar: 'المعايير والتقنيات المساعِدة تشغيلية بالكامل وملزمة قانونًا في كثير من الدول؛ وأدوات الإتاحة المدعومة بالذكاء الاصطناعي صارت سائدة.',
      en: 'Standards and assistive technologies fully operational and legally mandated in many jurisdictions; AI-assisted accessibility tooling now mainstream.',
    },
    sectors: ['social-development-justice', 'education-training', 'healthcare'],
    domainIds: ['service-design', 'policy'],
    skills: ['sr-service-design-2', 'sr-service-design-3', 'sr-policy-3'],
    employeeSkills: [
      { ar: 'تدقيق WCAG والمعالجة', en: 'WCAG auditing and remediation' },
      { ar: 'البحث الشامل مع مستخدمين متنوعين', en: 'Inclusive research with diverse users' },
      { ar: 'الكتابة باللغة البسيطة (والعربية السهلة)', en: 'Plain-language (and easy-read Arabic) writing' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'الخدمات الرقمية يجب أن تخدم الجميع', en: 'Digital services must serve everyone' },
      practitioner: { ar: 'تدقيق WCAG، والبحث الشامل، والعربية السهلة', en: 'WCAG auditing, inclusive research, easy-read Arabic' },
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
    trlRationale: {
      ar: 'من بين تقنيات المدن البارزة لعام 2025؛ تعمل في مدن قليلة (سنغافورة ومشاريع نيوم) ومعظم النشر تجريبي على مستوى الأحياء.',
      en: 'Highlighted among WEF-adjacent 2025 city technologies; operational in a handful of cities (Singapore, NEOM builds), most deployments still district-scale pilots.',
    },
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'ai-data', 'cloud'],
    skills: ['sr-emerging-3', 'sr-emerging-1', 'sr-ai-data-2'],
    employeeSkills: [
      { ar: 'الإلمام بالبيانات الجيومكانية وأنظمة GIS', en: 'Geospatial data and GIS literacy' },
      { ar: 'تصميم سيناريوهات المحاكاة والتحقق منها', en: 'Simulation scenario design and validation' },
      { ar: 'تكامل بيانات إنترنت الأشياء في النماذج الحضرية', en: 'IoT data integration for urban models' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'محاكاة المدينة قبل بنائها', en: 'Simulating the city before building it' },
      practitioner: { ar: 'أنظمة GIS، وتصميم السيناريوهات، وتكامل بيانات الأشياء', en: 'GIS, scenario design, IoT integration' },
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
    trlRationale: {
      ar: 'من أهم 10 تقنيات ناشئة للمنتدى الاقتصادي العالمي 2025 بأثر متوقع خلال 3–5 سنوات؛ محقَّقة في تجارب دون نشر على نطاق المدينة.',
      en: 'WEF Top 10 Emerging Technology of 2025, expected to reach real-world impact in 3–5 years; validated in pilots, not yet operational at city scale.',
    },
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'cloud'],
    skills: ['sr-emerging-1', 'sr-cyber-1', 'sr-cloud-1'],
    employeeSkills: [
      { ar: 'أساسيات معمارية شبكات الاستشعار', en: 'Sensor network architecture basics' },
      { ar: 'مفاهيم تدفقات البيانات اللحظية', en: 'Real-time data stream concepts' },
      { ar: 'حوكمة خصوصية الاستشعار الحضري', en: 'Privacy governance of urban sensing' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'مستشعرات تتحدث مع بعضها؛ وأساسيات الخصوصية', en: 'Sensors that talk to each other; privacy basics' },
      practitioner: { ar: 'معمارية الشبكات، والتدفقات اللحظية، والحوكمة', en: 'Sensor network architecture, real-time streams, governance' },
    },
  },
  {
    id: 'C5-T03', clusterId: 'smart-cities-sustainability',
    name: { ar: 'إنترنت الأشياء للبنية التحتية العامة', en: 'IoT for Public Infrastructure' },
    description: {
      ar: 'أجهزة استشعار متصلة لإدارة الإنارة العامة والمياه والنفايات والمرافق في المدن.',
      en: 'Connected sensors managing street lighting, water, waste and public facilities in cities.',
    },
    trl: 8,
    trlRationale: {
      ar: 'منشورة تشغيليًا في برامج مدن ذكية عالمية؛ ناضجة وتتوسع. أما أمثلة التطبيق في البلديات السعودية فتقدير تحريري لم يُطابق بعد مع مصدر منشور.',
      en: 'Operational in global smart-city programmes; mature, scaling deployments. Examples from Saudi municipalities are an editorial estimate not yet matched to a published source.',
    },
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'cloud', 'cyber'],
    skills: ['sr-emerging-1', 'sr-cyber-4', 'sr-ai-data-2'],
    employeeSkills: [
      { ar: 'دورة حياة أجهزة الأشياء وإدارة الأساطيل', en: 'IoT device lifecycle and fleet management' },
      { ar: 'أساسيات أمن التقنية التشغيلية والأشياء', en: 'OT/IoT security fundamentals' },
      { ar: 'تحليلات بيانات المستشعرات للعمليات', en: 'Sensor data analytics for operations' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'إنارة ومرافق متصلة حولك', en: 'Connected streetlights & utilities around you' },
      practitioner: { ar: 'إدارة الأساطيل، وأمن التقنية التشغيلية، وتحليلات المستشعرات', en: 'Fleet management, OT security, sensor analytics' },
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
    trlRationale: {
      ar: 'سيارات الأجرة الآلية تعمل في مدن عالمية مختارة وتجارب سعودية معلنة؛ والنضج التنظيمي والتشغيلي الكامل للطرق العامة يحتاج سنوات.',
      en: 'Robotaxis operational in select global cities and Saudi pilots announced; full regulatory and operational maturity for public roads is years away.',
    },
    sectors: ['urban-mobility-smart-cities', 'travel-tourism-culture'],
    domainIds: ['emerging', 'policy'],
    skills: ['sr-emerging-1', 'sr-policy-1', 'sr-ai-data-2'],
    employeeSkills: [
      { ar: 'تحليلات بيانات التنقل', en: 'Mobility data analytics' },
      { ar: 'أطر تنظيم وسلامة المركبات ذاتية القيادة', en: 'AV regulatory and safety frameworks' },
      { ar: 'مفاهيم منصات النقل كخدمة وتكامل النقل العام', en: 'MaaS platform and transit integration concepts' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'تجارب النقل الذاتي؛ والسلامة والقواعد', en: 'Autonomous transport pilots; safety & rules' },
      practitioner: { ar: 'تحليلات التنقل، وتنظيم المركبات الذاتية، وتكامل النقل كخدمة', en: 'Mobility analytics, AV regulation, MaaS integration' },
    },
  },
  {
    id: 'C5-T05', clusterId: 'smart-cities-sustainability',
    name: { ar: 'الشبكات الكهربائية الذكية وتحسين الطاقة', en: 'Smart Grids & Energy Optimization' },
    description: {
      ar: 'شبكات كهرباء رقمية ثنائية الاتجاه توازن الإنتاج المتجدد المتقطع مع الطلب لحظياً، وتدعم أهداف مزيج الطاقة السعودي (50% متجددة بحلول 2030).',
      en: "Digital two-way electricity grids balancing intermittent renewable generation with real-time demand, supporting Saudi's 50%-renewables-by-2030 energy mix target.",
    },
    trl: 7,
    trlRationale: {
      ar: 'العدادات الذكية وأتمتة الشبكة منشورة على نطاق واسع في السعودية (برنامج العدادات الذكية)؛ وطبقات التحسين بالذكاء الاصطناعي ما زالت تنضج.',
      en: 'Smart meters and grid automation deployed at scale in KSA (SEC smart-meter program); AI-driven optimization layers still maturing.',
    },
    sectors: ['energy-natural-resources', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'ai-data', 'cloud'],
    skills: ['sr-emerging-1', 'sr-ai-data-0', 'sr-agile-1'],
    employeeSkills: [
      { ar: 'الإلمام ببيانات الطاقة (منحنيات الحمل والموارد الموزعة)', en: 'Energy data literacy (load curves, DERs)' },
      { ar: 'إدارة برامج رقمنة الشبكة', en: 'Grid digitization program management' },
      { ar: 'أساسيات استجابة الطلب وأسواق المرونة', en: 'Demand-response and flexibility market basics' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'شبكات كهرباء ثنائية الاتجاه والطاقة المتجددة', en: 'Two-way electricity grids & renewables' },
      practitioner: { ar: 'بيانات الطاقة، واستجابة الطلب، وإدارة البرامج', en: 'Energy data literacy, demand response, program management' },
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
    trlRationale: {
      ar: 'فئة معترف بها في دورة غارتنر 2025 للاستدامة البيئية؛ تبني الشركات تشغيلي والنشر الحكومي الشامل ناشئ.',
      en: 'Recognized category in Gartner\'s 2025 Hype Cycle for Environmental Sustainability; enterprise adoption operational, government-wide deployment emerging.',
    },
    sectors: ['energy-natural-resources', 'trade-finance-economy', 'urban-mobility-smart-cities'],
    domainIds: ['policy', 'ai-data'],
    skills: ['sr-ai-data-0', 'sr-policy-4', 'sr-agile-4'],
    employeeSkills: [
      { ar: 'نطاقات بروتوكول الغازات الدفيئة وأساسيات المحاسبة الكربونية', en: 'GHG Protocol scopes and carbon accounting basics' },
      { ar: 'الإلمام بتقارير الاستدامة وبيانات ESG', en: 'Sustainability reporting (and ESG data) literacy' },
      { ar: 'معايير الشراء الأخضر', en: 'Green procurement criteria' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'الانبعاثات تُقاس وتُدار', en: 'Emissions are measured & managed' },
      practitioner: { ar: 'نطاقات الغازات الدفيئة، وتقارير ESG، والشراء الأخضر', en: 'GHG scopes, ESG reporting, green procurement' },
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
    trlRationale: {
      ar: 'الاستشعار البيئي الذاتي من أضواء المنتدى الاقتصادي العالمي 2025؛ وتشغّل المراكز الوطنية للأرصاد والبيئة مكونات والتكامل جارٍ.',
      en: 'Autonomous environmental sensing is a WEF 2025 spotlight; national meteorological and environment centers operate components, integration is ongoing.',
    },
    sectors: ['energy-natural-resources', 'urban-mobility-smart-cities', 'healthcare'],
    domainIds: ['ai-data', 'emerging'],
    skills: ['sr-emerging-3', 'sr-ai-data-2', 'sr-leadership-3'],
    employeeSkills: [
      { ar: 'أساسيات الاستشعار عن بُعد وبيانات الأقمار', en: 'Remote-sensing and satellite data basics' },
      { ar: 'تفسير البيانات البيئية للسياسات', en: 'Environmental data interpretation for policy' },
      { ar: 'إيصال مخاطر المناخ', en: 'Climate risk communication' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'أقمار ومستشعرات تراقب الهواء والماء والأرض', en: 'Satellite & sensor watch over air, water, land' },
      practitioner: { ar: 'أساسيات الاستشعار عن بُعد، وتفسير السياسات، وإيصال المخاطر', en: 'Remote sensing basics, policy interpretation, risk comms' },
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
    trlRationale: {
      ar: 'أعيد تقييمها إلى 8 (مراجعة 2026): تشغيلية في الدفاع المدني والبلديات السعودية مع إطار GACA نافذ — تتوسع ولا تُجرّب.',
      en: 'Re-rated 7→8 (2026 review): operational in Saudi civil defense and municipal inspection with GACA regulation in force — scaling, not experimental.',
    },
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources', 'healthcare'],
    domainIds: ['emerging', 'policy'],
    skills: ['sr-policy-1', 'sr-emerging-3', 'sr-cyber-1'],
    employeeSkills: [
      { ar: 'الإلمام بتنظيم عمليات المسيّرات (GACA)', en: 'Drone operations regulation (GACA) literacy' },
      { ar: 'التقاط البيانات الجوية وتحليلها', en: 'Aerial data capture and analysis' },
      { ar: 'تخطيط مهام السلامة العامة', en: 'Public-safety mission planning' },
    ],
    horizon: 'now',
    learningFocus: {
      awareness: { ar: 'المسيّرات في التفتيش والطوارئ', en: 'Drones in inspection & emergencies' },
      practitioner: { ar: 'تنظيم GACA، وتحليل البيانات الجوية، وتخطيط المهام', en: 'GACA regulation, aerial data analysis, mission planning' },
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
    trlRationale: {
      ar: 'العتاد ما زال تجريبيًا (الكيوبتات المصححة الخطأ في طور الظهور)؛ والميزة الحكومية العملية غير مثبتة — طور إثبات المفهوم وأكثر من 10 سنوات للجدوى وفق غارتنر.',
      en: 'Hardware remains experimental (error-corrected qubits emerging); practical government advantage unproven — proof-of-concept stage, 10+ years to utility per Gartner.',
    },
    sectors: ['energy-natural-resources', 'trade-finance-economy', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'policy'],
    skills: ['sr-emerging-4', 'sr-policy-0', 'sr-leadership-1'],
    employeeSkills: [
      { ar: 'الثقافة الكمومية لصنّاع السياسات', en: 'Quantum literacy for policy makers' },
      { ar: 'غربلة حالات الاستخدام للميزة الكمومية', en: 'Use-case screening for quantum advantage' },
      { ar: 'الإلمام بالاستراتيجية الوطنية الكمومية', en: 'National quantum strategy awareness' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'لماذا تهم الكم السياسات لا المختبرات فقط', en: 'Why quantum matters for policy, not just labs' },
      practitioner: { ar: 'غربلة حالات الاستخدام والانخراط في الاستراتيجية الوطنية', en: 'Use-case screening, national strategy engagement' },
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
    trlRationale: {
      ar: 'محقَّقة في ممرات اختبار حضرية (الصين وأوروبا وكوريا) لكن حدود المسافة والكلفة والتكامل تبقيها في طور التحقق للشبكات الحكومية.',
      en: 'Validated in metro-scale testbeds (China, EU, Korea) but distance, cost, and integration limits keep it at technology-validation stage for government networks.',
    },
    sectors: ['trade-finance-economy', 'social-development-justice', 'energy-natural-resources'],
    domainIds: ['cyber', 'emerging'],
    skills: ['sr-emerging-4', 'sr-cyber-4', 'sr-cloud-4'],
    employeeSkills: [
      { ar: 'مشهد الأمن الآمن كميًا (QKD مقابل PQC)', en: 'Quantum-safe security landscape (QKD vs. PQC)' },
      { ar: 'متطلبات اتصالات البنية الحرجة', en: 'Critical-infrastructure communication requirements' },
      { ar: 'مسح آفاق التقنية', en: 'Technology horizon scanning' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'مفهوم الاتصال المؤمّن فيزيائيًا', en: 'Physics-secured communication concept' },
      practitioner: { ar: 'تقييم QKD مقابل PQC ومتطلبات البنية التحتية', en: 'QKD vs. PQC evaluation, infrastructure requirements' },
    },
  },
  {
    id: 'C6-T03', clusterId: 'frontier-deep-tech',
    name: { ar: 'سلسلة الكتل والسجلات الموزعة للخدمات الحكومية', en: 'Blockchain & Distributed Ledgers for Government' },
    description: {
      ar: 'سجلات موزعة غير قابلة للتلاعب لتتبع الحاويات الجمركية وتوثيق السندات والتحقق من الشهادات، كتجربة هيئة الزكاة والضريبة والجمارك في تتبع الحاويات.',
      en: "Tamper-proof distributed ledgers for customs container tracking, title registration, and credential verification — e.g., ZATCA's blockchain container-tracking experiment.",
    },
    trl: 6,
    trlRationale: {
      ar: 'تجاوزت ذروة الضجيج؛ استخدام تشغيلي انتقائي في الجمارك وتمويل التجارة والاعتمادات — مثبتة في بيئات ذات صلة لكنها ليست بنية حكومية عامة.',
      en: 'Past peak hype; selective operational use in customs, trade finance, and credentialing. Proven in relevant environments but not general government infrastructure.',
    },
    sectors: ['trade-finance-economy', 'social-development-justice', 'education-training'],
    domainIds: ['emerging', 'cyber', 'policy'],
    skills: ['sr-emerging-2', 'sr-emerging-4', 'sr-policy-1'],
    employeeSkills: [
      { ar: 'تقييم ملاءمة السجلات الموزعة (ومتى لا تستخدم سلسلة الكتل)', en: 'DLT suitability assessment (when NOT to use blockchain)' },
      { ar: 'أساسيات مخاطر العقود الذكية', en: 'Smart contract risk basics' },
      { ar: 'معايير رقمنة التجارة عبر الحدود', en: 'Cross-border trade digitization standards' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'سجلات مقاومة للتلاعب؛ وأين تفيد فعلًا', en: 'Tamper-proof records; where it actually helps' },
      practitioner: { ar: 'تقييم ملاءمة السجلات الموزعة ومخاطر العقود الذكية', en: 'DLT suitability assessment, smart-contract risk' },
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
    trlRationale: {
      ar: 'رقائق بحثية موجودة (سلالة Intel Loihi وIBM TrueNorth)؛ مذكورة في رادار غارتنر 2025 كمعالجة فائقة الكفاءة — بلا أنظمة حكومية تشغيلية.',
      en: 'Research chips exist (Intel Loihi, IBM TrueNorth lineage); cited on Gartner\'s 2025 radar as ultra-efficient AI processing — no operational government systems.',
    },
    sectors: ['urban-mobility-smart-cities', 'energy-natural-resources'],
    domainIds: ['emerging', 'ai-data'],
    skills: ['sr-emerging-4', 'sr-ai-data-0', 'sr-policy-4'],
    employeeSkills: [
      { ar: 'الإلمام بمشهد عتاد الذكاء الاصطناعي', en: 'AI hardware landscape awareness' },
      { ar: 'استكشاف حالات استخدام الذكاء الطرفي', en: 'Edge AI use-case scouting' },
      { ar: 'تقييم الشراكات البحثية', en: 'R&D partnership evaluation' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'رقائق مستوحاة من الدماغ؛ ذكاء موفر للطاقة', en: 'Brain-inspired chips; energy-efficient AI' },
      practitioner: { ar: 'استكشاف مشهد العتاد والشراكات البحثية', en: 'Hardware landscape scouting, R&D partnerships' },
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
    trlRationale: {
      ar: 'التوحيد القياسي (3GPP/ITU IMT-2030) جارٍ والإطلاق التجاري متوقع نحو 2030؛ طور المفهوم والتحقق المخبري المبكر.',
      en: 'Standardization (3GPP/ITU IMT-2030) underway with commercial launch expected ~2030; technology concept and early lab validation stage.',
    },
    sectors: ['urban-mobility-smart-cities', 'trade-finance-economy'],
    domainIds: ['emerging', 'cloud', 'policy'],
    skills: ['sr-emerging-4', 'sr-policy-0', 'sr-policy-4'],
    employeeSkills: [
      { ar: 'الإلمام بسياسات الطيف وتنظيم الاتصالات (CST)', en: 'Spectrum policy and telecom regulation literacy (CST)' },
      { ar: 'استشراف البنية التحتية وتخطيط الاستثمار', en: 'Infrastructure foresight and investment planning' },
      { ar: 'نماذج الشراكة بين القطاعين للشبكات', en: 'Public-private network partnership models' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'ما بعد الجيل الخامس؛ ولماذا تهم سنوات التقييس', en: 'Beyond 5G; why standards years matter' },
      practitioner: { ar: 'سياسات الطيف، واستشراف البنية، ونماذج الشراكة', en: 'Spectrum policy, infrastructure foresight, PPP models' },
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
    trlRationale: {
      ar: 'روبوتات الرعاية والتفتيش منشورة في تجارب؛ والذكاء المتجسد أُدرج حديثًا في غارتنر 2025 — محقَّق في بيئات ذات صلة دون نطاق واسع.',
      en: 'Care robots and inspection robots deployed in pilots; embodied/physical AI newly listed on Gartner 2025 — validated in relevant environments, not yet at scale.',
    },
    sectors: ['healthcare', 'social-development-justice', 'urban-mobility-smart-cities'],
    domainIds: ['emerging', 'policy', 'service-design'],
    skills: ['sr-emerging-0', 'sr-service-design-1', 'sr-policy-4'],
    employeeSkills: [
      { ar: 'الإلمام بتصميم خدمات الروبوتات وملفات السلامة', en: 'Robotics service-design and safety case literacy' },
      { ar: 'أخلاقيات تفاعل الإنسان والروبوت', en: 'Human-robot interaction ethics' },
      { ar: 'شراء الأنظمة الروبوتية', en: 'Procurement of robotic systems' },
    ],
    horizon: 'near',
    learningFocus: {
      awareness: { ar: 'روبوتات في الرعاية والتفتيش؛ والإشراف البشري', en: 'Robots in care & inspection; human oversight' },
      practitioner: { ar: 'ملفات السلامة، وأخلاقيات التفاعل، وشراء الروبوتات', en: 'Safety cases, HRI ethics, robotics procurement' },
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
    trlRationale: {
      ar: 'الغرسات البشرية محصورة في تجارب سريرية صغيرة (كمجموعات Neuralink)؛ والواجهات غير الغازية مخبرية — إثبات تقني أساسي فقط.',
      en: 'Human implants limited to small clinical trials (e.g., Neuralink cohorts); non-invasive BCIs are lab-stage — basic technology demonstration only.',
    },
    sectors: ['healthcare', 'social-development-justice'],
    domainIds: ['emerging', 'policy'],
    skills: ['sr-policy-3', 'sr-policy-1', 'sr-emerging-4'],
    employeeSkills: [
      { ar: 'الإلمام بأخلاقيات وحوكمة تقنيات الأعصاب', en: 'Neurotechnology ethics and governance awareness' },
      { ar: 'الإلمام بسياسات التقنيات المساعِدة', en: 'Assistive-technology policy literacy' },
      { ar: 'استشراف تقارب تقنيات الصحة', en: 'Horizon scanning for health-tech convergence' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'وعد تقنيات الأعصاب لشمول ذوي الإعاقة', en: 'Neurotech promise for disability inclusion' },
      practitioner: { ar: 'أطر الأخلاقيات والحوكمة واستشراف تقنيات الصحة', en: 'Ethics & governance frameworks, health-tech foresight' },
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
    trlRationale: {
      ar: 'أثبت مشروع «عابر» (2019–2020) العملة الرقمية للجملة تقنيًا، وانضم البنك المركزي السعودي في يونيو 2024 إلى منصة mBridge متعددة العملات الرقمية؛ والتجزئة تجريبية عالميًا مع إطلاقات قليلة — محقَّقة في بيئة ذات صلة وقرار التبني معلق.',
      en: 'Project Aber (2019–2020) validated wholesale CBDC technically, and the Saudi Central Bank joined the multi-CBDC mBridge platform in June 2024; retail CBDC remains pilot-stage globally with few launches — validated in relevant environment, adoption decision pending.',
    },
    sectors: ['trade-finance-economy', 'social-development-justice'],
    domainIds: ['emerging', 'policy', 'cyber'],
    skills: ['sr-emerging-2', 'sr-policy-1', 'sr-cyber-1'],
    employeeSkills: [
      { ar: 'الإلمام بمنظومة المدفوعات الرقمية', en: 'Digital payment ecosystem literacy' },
      { ar: 'مفاضلات تصميم سياسات العملة الرقمية (الخصوصية والوساطة)', en: 'CBDC policy design trade-offs (privacy, intermediation)' },
      { ar: 'مفاهيم التسوية عبر الحدود', en: 'Cross-border settlement concepts' },
    ],
    horizon: 'far',
    learningFocus: {
      awareness: { ar: 'مفهوم الريال الرقمي؛ وتجارب البنك المركزي', en: 'Digital riyal concepts; SAMA experiments' },
      practitioner: { ar: 'منظومة المدفوعات، ومفاضلات السياسات، وتصميم التسوية', en: 'Payment ecosystems, policy trade-offs, settlement design' },
    },
  },
]

export const techById = (id: string): Technology | undefined => technologies.find((x) => x.id === id)

/** Technologies linked to a given app domain id. */
export const techsForDomain = (domainId: string): Technology[] =>
  technologies.filter((x) => x.domainIds.includes(domainId))

/** A required skill resolved from the radar's skill catalogue. */
export interface TechSkill {
  id: string
  domainId: string
  skillIndex: number
  name: L
}

const SKILL_ID = /^sr-(.+)-(\d+)$/

/** The skills a technology demands, resolved to their domain and bilingual label. */
export function techSkills(tech: Pick<Technology, 'skills'>): TechSkill[] {
  const out: TechSkill[] = []
  for (const id of tech.skills) {
    const m = SKILL_ID.exec(id)
    if (!m) continue
    const domain = domains.find((d) => d.id === m[1])
    const skillIndex = Number(m[2])
    const name = domain?.skills[skillIndex]
    if (domain && name) out.push({ id, domainId: domain.id, skillIndex, name })
  }
  return out
}

/** Domains a technology draws on: its linked domains plus the domains of its required skills. */
export function techDomains(tech: Pick<Technology, 'skills' | 'domainIds'>): string[] {
  const set = new Set(tech.domainIds)
  for (const s of techSkills(tech)) set.add(s.domainId)
  return domains.map((d) => d.id).filter((id) => set.has(id))
}
