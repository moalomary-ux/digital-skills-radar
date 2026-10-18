import type { L } from './types'
import { roles } from './roles'

/**
 * Role Library — 20 digital-government roles.
 * Converted from research/role-library.md; domain keys normalized to app ids:
 *   ai_data→ai-data · cyber_trust→cyber · cloud_infra→cloud · service_design→service-design
 *   policy_gov→policy · agile_delivery→agile · emerging_tech→emerging · leadership_collab→leadership
 */

export type RoleFamily = 'Leadership' | 'Data & AI' | 'Engineering' | 'Design' | 'Policy' | 'Delivery'

export interface LibraryRole {
  id: string
  name: L
  family: RoleFamily
  mission: L
  /** target level 1-4 per app domain id */
  targets: Record<string, number>
  responsibilities: L[]
  sfia: string[]
}

export const familyNames: Record<RoleFamily, L> = {
  Leadership: { ar: 'القيادة', en: 'Leadership' },
  'Data & AI': { ar: 'البيانات والذكاء الاصطناعي', en: 'Data & AI' },
  Engineering: { ar: 'الهندسة', en: 'Engineering' },
  Design: { ar: 'التصميم', en: 'Design' },
  Policy: { ar: 'السياسات', en: 'Policy' },
  Delivery: { ar: 'التسليم', en: 'Delivery' },
}

export const familyOrder: RoleFamily[] = ['Leadership', 'Data & AI', 'Engineering', 'Design', 'Policy', 'Delivery']

export const libraryRoles: LibraryRole[] = [
  {
    id: 'chief_digital_officer',
    name: { ar: 'المدير التنفيذي للتحول الرقمي', en: 'Chief Digital Officer' },
    family: 'Leadership',
    mission: {
      ar: 'يضع الاستراتيجية الرقمية على مستوى الجهة ويملكها، ويوائم الاستثمار التقني مع القيمة العامة وأهداف التحول الوطنية.',
      en: 'Sets and owns the organisation-wide digital strategy, aligning technology investment with public value and national transformation goals.',
    },
    targets: { 'ai-data': 3, cyber: 3, cloud: 3, 'service-design': 3, policy: 4, agile: 3, emerging: 4, leadership: 4 },
    responsibilities: [
      { ar: 'امتلاك الاستراتيجية الرقمية ومحفظة الاستثمار ورفع تقارير الأثر إلى الإدارة التنفيذية.', en: 'Own the digital strategy and investment portfolio, reporting impact to the executive board.' },
      { ar: 'رئاسة لجان الحوكمة الرقمية وضمان الامتثال للمعايير الوطنية للحكومة الرقمية.', en: 'Chair digital governance forums and ensure compliance with national digital government standards.' },
      { ar: 'بناء الدعم التنفيذي والشراكات بين الجهات لبرامج التحول.', en: 'Build executive sponsorship and cross-entity partnerships for transformation programmes.' },
    ],
    sfia: ['ITSP', 'GOVN', 'STPL', 'OCDV'],
  },
  {
    id: 'digital_transformation_lead',
    name: { ar: 'قائد التحول الرقمي', en: 'Digital Transformation Lead' },
    family: 'Leadership',
    mission: {
      ar: 'يقود برامج تحول متعددة السنوات تعمل على تحديث الخدمات والعمليات والثقافة.',
      en: 'Leads multi-year transformation programmes that modernise services, processes and culture.',
    },
    targets: { 'ai-data': 3, cyber: 2, cloud: 3, 'service-design': 3, policy: 3, agile: 4, emerging: 3, leadership: 4 },
    responsibilities: [
      { ar: 'صياغة خارطة طريق التحول وتسلسل المبادرات وفق القيمة والمخاطر والتبعيات.', en: 'Shape the transformation roadmap, sequencing initiatives by value, risk and dependency.' },
      { ar: 'قيادة التغيير المؤسسي: التواصل وبناء القدرات والتبنّي.', en: 'Lead organisational change: communication, capability building and adoption.' },
      { ar: 'رفع تقارير تحقيق المنافع وتصحيح المسار مع الرعاة ومجالس الحوكمة.', en: 'Report benefits realisation and course-correct with sponsors and governance boards.' },
    ],
    sfia: ['CIPM', 'OCEN', 'BPRE', 'PGMG'],
  },
  {
    id: 'data_scientist',
    name: { ar: 'عالم البيانات', en: 'Data Scientist' },
    family: 'Data & AI',
    mission: {
      ar: 'يستخلص رؤى تنبؤية من البيانات الحكومية لتحسين السياسات والخدمات وتخصيص الموارد.',
      en: 'Extracts predictive insight from government data to improve policy, services and resource allocation.',
    },
    targets: { 'ai-data': 4, cyber: 2, cloud: 3, 'service-design': 2, policy: 2, agile: 2, emerging: 3, leadership: 2 },
    responsibilities: [
      { ar: 'تصميم النماذج الإحصائية ونماذج تعلم الآلة وتدريبها والتحقق منها لمعالجة مشكلات القطاع.', en: 'Design, train and validate statistical and machine-learning models on domain problems.' },
      { ar: 'إيصال النتائج عبر المرئيات والسرد بما يمكّن القادة غير التقنيين من اتخاذ القرار.', en: 'Communicate findings through visualisations and narratives that non-technical leaders can act on.' },
      { ar: 'تطبيق معايير أخلاقيات البيانات والخصوصية والجودة عبر دورة حياة النموذج.', en: 'Apply data ethics, privacy and quality standards across the model lifecycle.' },
    ],
    sfia: ['DATS', 'MLNG', 'DAAN', 'VISL'],
  },
  {
    id: 'open_data_manager',
    name: { ar: 'مدير البيانات المفتوحة', en: 'Open Data Manager' },
    family: 'Data & AI',
    mission: {
      ar: 'ينشر مجموعات بيانات حكومية عالية الجودة تعزز الشفافية والابتكار وإعادة الاستخدام الاقتصادي.',
      en: 'Publishes high-quality government datasets that drive transparency, innovation and economic reuse.',
    },
    targets: { 'ai-data': 3, cyber: 2, cloud: 2, 'service-design': 2, policy: 3, agile: 2, emerging: 2, leadership: 2 },
    responsibilities: [
      { ar: 'إدارة فهرس البيانات المفتوحة: معايير النشر وجودة البيانات الوصفية وانتظام الإصدارات.', en: 'Operate the open-data catalogue: publishing standards, metadata quality and release cadence.' },
      { ar: 'تحقيق التوازن بين الانفتاح والخصوصية والسرية والتزامات حماية البيانات.', en: 'Balance openness with privacy, confidentiality and data-protection obligations.' },
      { ar: 'التفاعل مع مجتمعات المطورين والباحثين والأعمال لتوسيع إعادة استخدام البيانات.', en: 'Engage developer, research and business communities to grow data reuse.' },
    ],
    sfia: ['DATM', 'IRMG', 'PEDP', 'ICPM'],
  },
  {
    id: 'gis_smart_city_analyst',
    name: { ar: 'محلل نظم المعلومات الجغرافية والمدن الذكية', en: 'GIS / Smart City Analyst' },
    family: 'Data & AI',
    mission: {
      ar: 'يحوّل البيانات الجغرافية المكانية وبيانات مستشعرات المدن إلى رؤى لمدن أذكى وأكثر ملاءمة للعيش.',
      en: 'Turns geospatial and urban-sensor data into insight for smarter, more liveable cities.',
    },
    targets: { 'ai-data': 3, cyber: 2, cloud: 3, 'service-design': 2, policy: 2, agile: 2, emerging: 3, leadership: 1 },
    responsibilities: [
      { ar: 'تحليل البيانات المكانية لدعم قرارات التخطيط والتنقل والبيئة ومواقع الخدمات.', en: 'Analyse spatial data to support planning, mobility, environment and service-location decisions.' },
      { ar: 'بناء لوحات معلومات ونماذج جغرافية مكانية لفرق تشغيل المدن والسياسات.', en: 'Build geospatial dashboards and models for city operations and policy teams.' },
      { ar: 'تقييم مصادر بيانات إنترنت الأشياء والمدن الذكية من حيث الجودة وقابلية التشغيل البيني والقيمة.', en: 'Evaluate IoT and smart-city data sources for quality, interoperability and value.' },
    ],
    sfia: ['DAAN', 'DTAN', 'VISL', 'SCMO'],
  },
  {
    id: 'cybersecurity_analyst',
    name: { ar: 'محلل الأمن السيبراني', en: 'Cybersecurity Analyst' },
    family: 'Engineering',
    mission: {
      ar: 'يراقب التهديدات التي تستهدف الأنظمة الحكومية وبيانات المواطنين ويكتشفها ويستجيب لها.',
      en: 'Monitors, detects and responds to threats targeting government systems and citizen data.',
    },
    targets: { 'ai-data': 2, cyber: 4, cloud: 2, 'service-design': 1, policy: 2, agile: 2, emerging: 2, leadership: 1 },
    responsibilities: [
      { ar: 'تشغيل أدوات المراقبة والكشف وفرز التنبيهات وتصعيد الحوادث.', en: 'Operate monitoring and detection tooling, triaging alerts and escalating incidents.' },
      { ar: 'تقييم الثغرات ودعم المعالجة عبر البنية التحتية والتطبيقات.', en: 'Assess vulnerabilities and support remediation across infrastructure and applications.' },
      { ar: 'المساهمة في الاستخبارات التهديدية وأدلة الاستجابة والمراجعات اللاحقة للحوادث.', en: 'Contribute to threat intelligence, playbooks and post-incident reviews.' },
    ],
    sfia: ['SCAD', 'THIN', 'VUAS', 'INAS'],
  },
  {
    id: 'cloud_architect',
    name: { ar: 'مهندس البنية السحابية', en: 'Cloud Architect' },
    family: 'Engineering',
    mission: {
      ar: 'يصمم منصات سحابية آمنة وقابلة للتوسع وفعالة التكلفة لاستضافة الخدمات الرقمية الوطنية.',
      en: 'Designs secure, scalable and cost-effective cloud platforms that host national digital services.',
    },
    targets: { 'ai-data': 2, cyber: 3, cloud: 4, 'service-design': 1, policy: 2, agile: 3, emerging: 3, leadership: 2 },
    responsibilities: [
      { ar: 'تحديد البنى السحابية المستهدفة ومناطق التأسيس وخرائط طريق الترحيل.', en: 'Define target cloud architectures, landing zones and migration roadmaps.' },
      { ar: 'وضع معايير معمارية للأمن والمرونة والشبكات وضبط التكلفة.', en: 'Set architecture standards for security, resilience, networking and cost control.' },
      { ar: 'مراجعة تصاميم الحلول وتوجيه الفرق الهندسية أثناء التنفيذ.', en: 'Review solution designs and guide engineering teams through implementation.' },
    ],
    sfia: ['ARCH', 'IFDN', 'ITOP', 'TECH'],
  },
  {
    id: 'emerging_tech_scout',
    name: { ar: 'كشّاف التقنيات الناشئة', en: 'Emerging Tech Scout' },
    family: 'Engineering',
    mission: {
      ar: 'يمسح أفق التقنيات ويختبر القدرات الناشئة كي تعتمد الحكومة ما ينجح مبكراً وبأمان.',
      en: 'Scans the technology horizon and tests emerging capabilities so government adopts what works, early and safely.',
    },
    targets: { 'ai-data': 3, cyber: 2, cloud: 2, 'service-design': 2, policy: 2, agile: 2, emerging: 4, leadership: 2 },
    responsibilities: [
      { ar: 'صيانة رادار تقني يقيّم النضج والملاءمة والمخاطر للقطاع العام.', en: 'Maintain a technology radar with assessed maturity, relevance and risk for the public sector.' },
      { ar: 'إجراء دراسات الجدوى وإثباتات المفهوم للتقنيات المرشحة.', en: 'Run feasibility studies and proofs of concept on candidate technologies.' },
      { ar: 'إطلاع القيادة ومجالس المعمارية على توقيت الاعتماد وخيارات الاستثمار.', en: 'Brief leadership and architecture boards on adoption timing and investment options.' },
    ],
    sfia: ['EMRG', 'RSCH', 'INOV', 'FEAS'],
  },
  {
    id: 'digital_identity_specialist',
    name: { ar: 'أخصائي الهوية الرقمية', en: 'Digital Identity Specialist' },
    family: 'Engineering',
    mission: {
      ar: 'يصمم ويشغّل خدمات هوية رقمية ووصول موثوقة للمواطنين والمستخدمين الحكوميين.',
      en: 'Designs and operates trusted digital identity and access services for citizens and government users.',
    },
    targets: { 'ai-data': 2, cyber: 4, cloud: 3, 'service-design': 2, policy: 3, agile: 2, emerging: 3, leadership: 2 },
    responsibilities: [
      { ar: 'تصميم تدفقات إثبات الهوية والمصادقة والتفويض بما يستوفي معايير الاطمئنان.', en: 'Design identity proofing, authentication and authorisation flows meeting assurance standards.' },
      { ar: 'تكامل منصات الهوية الوطنية مع الخدمات الحكومية عبر بروتوكولات الاتحاد.', en: 'Integrate national identity platforms with government services via federation protocols.' },
      { ar: 'تقييم مخاطر الاحتيال والخصوصية والشمول عبر دورة حياة الهوية.', en: 'Assess fraud, privacy and inclusion risks across the identity lifecycle.' },
    ],
    sfia: ['IAMT', 'SCTY', 'ARCH'],
  },
  {
    id: 'site_reliability_engineer',
    name: { ar: 'مهندس موثوقية المواقع', en: 'Site Reliability Engineer' },
    family: 'Engineering',
    mission: {
      ar: 'يحافظ على سرعة الخدمات الرقمية الوطنية وتوافرها ومرونتها عبر عمليات قائمة على الهندسة.',
      en: 'Keeps national digital services fast, available and resilient through engineering-led operations.',
    },
    targets: { 'ai-data': 2, cyber: 3, cloud: 4, 'service-design': 1, policy: 1, agile: 3, emerging: 2, leadership: 2 },
    responsibilities: [
      { ar: 'تحديد مؤشرات وأهداف مستوى الخدمة وموازنات الأخطاء للخدمات الحرجة ومراقبتها.', en: 'Define and monitor SLIs/SLOs and error budgets for critical services.' },
      { ar: 'أتمتة العمليات: الاستجابة للحوادث والتوسع والتعافي وتقليل العمل اليدوي المتكرر.', en: 'Automate operations: incident response, scaling, recovery and toil reduction.' },
      { ar: 'قيادة مراجعات ما بعد الحوادث دون لوم ودفع تحسينات الموثوقية.', en: 'Lead blameless post-incident reviews and drive reliability improvements.' },
    ],
    sfia: ['ITOP', 'AVMT', 'SLEN', 'PBMG'],
  },
  {
    id: 'service_designer',
    name: { ar: 'مصمم الخدمات', en: 'Service Designer' },
    family: 'Design',
    mission: {
      ar: 'يصمم خدمات عامة شاملة من البداية إلى النهاية تعمل عبر القنوات وتستند إلى احتياجات المواطنين.',
      en: 'Designs end-to-end public services that work across channels and are grounded in citizen needs.',
    },
    targets: { 'ai-data': 2, cyber: 1, cloud: 1, 'service-design': 4, policy: 2, agile: 3, emerging: 2, leadership: 3 },
    responsibilities: [
      { ar: 'رسم رحلات المستخدم الحالية ومخططات الخدمة وتحديد نقاط الألم والطلب الفاشل.', en: 'Map current-state journeys and service blueprints, identifying pain points and failure demand.' },
      { ar: 'تيسير ورش التصميم المشترك مع المستخدمين وموظفي الخط الأمامي وفرق السياسات.', en: 'Facilitate co-design workshops with users, frontline staff and policy teams.' },
      { ar: 'بناء نماذج أولية للخدمات المستقبلية واختبارها وفق معايير الخدمة قبل التطوير.', en: 'Prototype and test future-state services against service standards before build.' },
    ],
    sfia: ['HCEV', 'UNAN', 'CEXP', 'BPRE'],
  },
  {
    id: 'ux_researcher',
    name: { ar: 'باحث تجربة المستخدم', en: 'UX Researcher' },
    family: 'Design',
    mission: {
      ar: 'يولّد أدلة حول سلوك المستخدم واحتياجاته كي تبني الفرق الحل الصحيح لا المفترض.',
      en: 'Generates evidence about user behaviour and needs so teams build the right thing, not the assumed thing.',
    },
    targets: { 'ai-data': 2, cyber: 1, cloud: 1, 'service-design': 4, policy: 1, agile: 3, emerging: 2, leadership: 2 },
    responsibilities: [
      { ar: 'تخطيط المقابلات واختبارات قابلية الاستخدام والبحث الميداني وإجراؤها مع فئات مستخدمين متنوعة.', en: 'Plan and conduct interviews, usability tests and contextual research with diverse user groups.' },
      { ar: 'تحويل النتائج إلى رؤى وشخصيات وأدلة رحلات توجه قرارات قائمة الأعمال.', en: 'Synthesise findings into insights, personas and journey evidence that shape backlog decisions.' },
      { ar: 'ضمان أخلاقيات البحث والموافقة المستنيرة وإشراك المستخدمين الأقل تمثيلاً.', en: 'Ensure research ethics, consent and inclusion of under-represented users.' },
    ],
    sfia: ['URCH', 'UNAN', 'USEV'],
  },
  {
    id: 'content_designer',
    name: { ar: 'مصمم المحتوى', en: 'Content Designer' },
    family: 'Design',
    mission: {
      ar: 'يكتب المحتوى الحكومي وينظمه بحيث يفهمه كل مستخدم ويتصرف بناءً عليه من المرة الأولى.',
      en: 'Writes and structures government content so every user can understand and act on it first time.',
    },
    targets: { 'ai-data': 1, cyber: 1, cloud: 1, 'service-design': 4, policy: 2, agile: 3, emerging: 1, leadership: 2 },
    responsibilities: [
      { ar: 'إنشاء محتوى بلغة بسيطة وثنائية اللغة مستند إلى احتياجات المستخدم والأدلة.', en: 'Create plain-language, bilingual content grounded in user needs and evidence.' },
      { ar: 'تنظيم المحتوى لتحقيق إمكانية الوصول وقابلية البحث والتسليم المناسب للقناة.', en: 'Structure content for accessibility, search and channel-appropriate delivery.' },
      { ar: 'اختبار المحتوى مع المستخدمين وتحسينه باستخدام التحليلات والملاحظات.', en: 'Test content with users and iterate using analytics and feedback.' },
    ],
    sfia: ['INCA', 'ICPM', 'UNAN'],
  },
  {
    id: 'ai_ethics_officer',
    name: { ar: 'مسؤول أخلاقيات الذكاء الاصطناعي', en: 'AI Ethics Officer' },
    family: 'Policy',
    mission: {
      ar: 'يضمن تصميم أنظمة الذكاء الاصطناعي واقتناءها وتشغيلها بما يتوافق مع المبادئ الأخلاقية وقواعد الحوكمة الوطنية للذكاء الاصطناعي.',
      en: 'Ensures AI systems are designed, procured and operated in line with ethical principles and national AI governance rules.',
    },
    targets: { 'ai-data': 3, cyber: 3, cloud: 1, 'service-design': 2, policy: 4, agile: 2, emerging: 3, leadership: 3 },
    responsibilities: [
      { ar: 'إجراء تقييمات أثر الذكاء الاصطناعي والانحياز لحالات الاستخدام المقترحة والقائمة.', en: 'Run AI impact and bias assessments on proposed and live AI use cases.' },
      { ar: 'صيانة إطار أخلاقيات الذكاء الاصطناعي ولجان المراجعة ومسارات التصعيد.', en: 'Maintain the AI ethics framework, review boards and escalation paths.' },
      { ar: 'تقديم المشورة للقيادة وفرق التسليم حول الالتزامات المتعلقة بالذكاء الاصطناعي المسؤول والتواصل العام.', en: 'Advise leadership and delivery teams on responsible-AI obligations and public communication.' },
    ],
    sfia: ['AIDE', 'GOVN', 'PEDP', 'RSCH'],
  },
  {
    id: 'digital_policy_advisor',
    name: { ar: 'مستشار السياسات الرقمية', en: 'Digital Policy Advisor' },
    family: 'Policy',
    mission: {
      ar: 'يطوّر سياسات وتنظيمات رقمية مبنية على الأدلة تتيح الابتكار وتحمي المجتمع في الوقت ذاته.',
      en: 'Develops evidence-based digital policies and regulations that enable innovation while protecting the public.',
    },
    targets: { 'ai-data': 2, cyber: 3, cloud: 2, 'service-design': 1, policy: 4, agile: 2, emerging: 3, leadership: 3 },
    responsibilities: [
      { ar: 'صياغة أوراق السياسات والردود على الاستشارات العامة وتقييمات الأثر التنظيمي.', en: 'Draft policy papers, consultation responses and regulatory impact assessments.' },
      { ar: 'قياس الأطر الدولية (مثل OECD والاتحاد الأوروبي وإطار DDaT البريطاني) وتوطينها بما يناسب السياق الوطني.', en: 'Benchmark international frameworks (e.g., OECD, EU, UK DDaT) and localise them for the national context.' },
      { ar: 'تقديم المشورة للقيادات حول مواقف سياسات الاقتصاد الرقمي والبيانات والذكاء الاصطناعي.', en: 'Advise ministers and executives on digital economy, data and AI policy positions.' },
    ],
    sfia: ['GOVN', 'RSCH', 'PEDP', 'RLMT'],
  },
  {
    id: 'digital_inclusion_officer',
    name: { ar: 'مسؤول الشمول الرقمي', en: 'Digital Inclusion Officer' },
    family: 'Policy',
    mission: {
      ar: 'يضمن عدم استبعاد أي مواطن من الخدمات الرقمية بسبب القدرة أو العمر أو اللغة أو الاتصال أو الدخل.',
      en: 'Ensures no citizen is excluded from digital services by ability, age, language, connectivity or income.',
    },
    targets: { 'ai-data': 1, cyber: 1, cloud: 1, 'service-design': 3, policy: 3, agile: 2, emerging: 1, leadership: 3 },
    responsibilities: [
      { ar: 'تقييم فجوات إمكانية الوصول والشمول عبر الخدمات باستخدام المعايير وأدلة المستخدمين.', en: 'Assess accessibility and inclusion gaps across services using standards and user evidence.' },
      { ar: 'تنفيذ مبادرات الدعم الرقمي ومحو الأمية الرقمية مع شركاء المجتمع.', en: 'Run assisted-digital and digital-literacy initiatives with community partners.' },
      { ar: 'تقديم المشورة لفرق الخدمة حول التصميم الشامل والقنوات المساندة والامتثال.', en: 'Advise service teams on inclusive design, assisted channels and compliance.' },
    ],
    sfia: ['ACIN', 'CEXP', 'OFCL'],
  },
  {
    id: 'product_manager',
    name: { ar: 'مدير المنتج', en: 'Product Manager' },
    family: 'Delivery',
    mission: {
      ar: 'يمتلك رؤية المنتج الرقمي وقيمته، ويرتّب الأولويات وفق النتائج للمستخدمين والجهة.',
      en: 'Owns the vision and value of a digital product, prioritising outcomes for users and the organisation.',
    },
    targets: { 'ai-data': 2, cyber: 1, cloud: 2, 'service-design': 3, policy: 2, agile: 4, emerging: 2, leadership: 3 },
    responsibilities: [
      { ar: 'تحديد رؤية المنتج واستراتيجيته ونتائجه القابلة للقياس المرتبطة بأهداف المستخدم والسياسات.', en: 'Define product vision, strategy and measurable outcomes tied to user and policy goals.' },
      { ar: 'امتلاك قائمة الأعمال وترتيب أولوياتها استناداً إلى أدلة البحث والبيانات والتشغيل.', en: 'Own and prioritise the backlog using evidence from research, data and operations.' },
      { ar: 'مواءمة أصحاب المصلحة واتخاذ قرارات موازنة شفافة طوال دورة الحياة.', en: 'Align stakeholders and make transparent trade-off decisions throughout the lifecycle.' },
    ],
    sfia: ['PROD', 'REQM', 'UNAN', 'RLMT'],
  },
  {
    id: 'delivery_manager',
    name: { ar: 'مدير التسليم', en: 'Delivery Manager' },
    family: 'Delivery',
    mission: {
      ar: 'يمهّد الطريق أمام الفرق الرشيقة كي تصل المنتجات القيّمة العاملة إلى المستخدمين مبكراً وباستمرار.',
      en: 'Clears the path for agile teams so valuable, working products reach users early and often.',
    },
    targets: { 'ai-data': 1, cyber: 1, cloud: 2, 'service-design': 2, policy: 2, agile: 4, emerging: 1, leadership: 3 },
    responsibilities: [
      { ar: 'تيسير الطقوس الرشيقة وإيقاعات التسليم والتحسين المستمر.', en: 'Facilitate agile ceremonies, delivery rhythms and continuous improvement.' },
      { ar: 'إزالة العوائق وإدارة التبعيات وحماية الفريق من المشتتات.', en: 'Remove blockers, manage dependencies and shield the team from disruption.' },
      { ar: 'متابعة صحة التسليم — التدفق والجودة والمخاطر — والرفع بالتقارير بشفافية إلى الحوكمة.', en: 'Track delivery health — flow, quality, risks — and report honestly to governance.' },
    ],
    sfia: ['DEMG', 'PRMG', 'OFCL', 'PBMG'],
  },
  {
    id: 'business_analyst',
    name: { ar: 'محلل الأعمال', en: 'Business Analyst' },
    family: 'Delivery',
    mission: {
      ar: 'يستقصي مشكلات العمل ويحدد المتطلبات التي تربط بين مقصد السياسة والتنفيذ التقني.',
      en: 'Investigates business problems and defines requirements that bridge policy intent and technical delivery.',
    },
    targets: { 'ai-data': 2, cyber: 1, cloud: 1, 'service-design': 2, policy: 2, agile: 3, emerging: 1, leadership: 2 },
    responsibilities: [
      { ar: 'استخلاص العمليات والمتطلبات التجارية ونمذجتها والتحقق منها مع أصحاب المصلحة.', en: 'Elicit, model and validate business processes and requirements with stakeholders.' },
      { ar: 'ترجمة احتياجات السياسات والتشغيل إلى قصص مستخدم ومعايير قبول.', en: 'Translate policy and operational needs into user stories and acceptance criteria.' },
      { ar: 'دعم تحليل الأثر وتتبع المنافع والجاهزية للتغيير.', en: 'Support impact analysis, benefits tracking and change readiness.' },
    ],
    sfia: ['BUSA', 'REQM', 'BSMO'],
  },
  {
    id: 'ai_product_owner',
    name: { ar: 'مالك منتجات الذكاء الاصطناعي', en: 'AI Product Owner' },
    family: 'Delivery',
    mission: {
      ar: 'يوجّه المنتجات المدعومة بالذكاء الاصطناعي من اختيار حالة الاستخدام إلى قيمة آمنة وقابلة للقياس في الإنتاج.',
      en: 'Steers AI-powered products from use-case selection to safe, measurable value in production.',
    },
    targets: { 'ai-data': 4, cyber: 2, cloud: 2, 'service-design': 3, policy: 2, agile: 4, emerging: 3, leadership: 3 },
    responsibilities: [
      { ar: 'اختيار حالات استخدام الذكاء الاصطناعي وصياغتها وفق القيمة والجدوى ومخاطر الاستخدام المسؤول.', en: 'Select and frame AI use cases by value, feasibility and responsible-AI risk.' },
      { ar: 'امتلاك قائمة أعمال المنتج وموازنة أعمال النموذج والبيانات وتجربة المستخدم.', en: 'Own the AI product backlog, balancing model, data and user-experience work.' },
      { ar: 'تحديد مقاييس النجاح وضوابط سلوك الذكاء الاصطناعي في الخدمات الحية.', en: 'Define success metrics and guardrails for AI behaviour in live services.' },
    ],
    sfia: ['PROD', 'MLNG', 'AIDE', 'REQM'],
  },
]

export const libraryRoleById = (id: string): LibraryRole | undefined =>
  libraryRoles.find((r) => r.id === id)

export const LIB_PREFIX = 'lib:'

/**
 * Resolve a stored role id (generic profile id or `lib:<library id>`)
 * to per-domain target levels, using the app's domain keys.
 */
export function resolveTargets(roleId: string | null | undefined): Record<string, number> {
  if (roleId && roleId.startsWith(LIB_PREFIX)) {
    const lib = libraryRoleById(roleId.slice(LIB_PREFIX.length))
    if (lib) return lib.targets
  }
  const generic = roles.find((r) => r.id === roleId) ?? roles[0]
  return generic.targets
}

/** Display name for any stored role id. */
export function resolveRoleName(roleId: string | null | undefined): L {
  if (roleId && roleId.startsWith(LIB_PREFIX)) {
    const lib = libraryRoleById(roleId.slice(LIB_PREFIX.length))
    if (lib) return lib.name
  }
  const generic = roles.find((r) => r.id === roleId)
  return generic ? generic.name : roles[0].name
}
