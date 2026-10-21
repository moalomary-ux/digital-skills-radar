import type { Domain } from './types'

export const domains: Domain[] = [
  {
    id: 'ai-data',
    name: { ar: 'الذكاء الاصطناعي والبيانات', en: 'AI & Data' },
    shortName: { ar: 'الذكاء الاصطناعي والبيانات', en: 'AI & Data' },
    description: {
      ar: 'قراءة البيانات وتحليلها وحوكمتها، واستخدام الذكاء الاصطناعي التوليدي بمسؤولية في العمل الحكومي.',
      en: 'Reading, analyzing and governing data, and using generative AI responsibly in government work.',
    },
    icon: 'chip',
    skills: [
      { ar: 'الإلمام بالبيانات', en: 'Data literacy' },
      { ar: 'حوكمة البيانات', en: 'Data governance' },
      { ar: 'تحليل البيانات وتصويرها', en: 'Data analysis & visualization' },
      { ar: 'استخدام الذكاء الاصطناعي التوليدي', en: 'Generative AI use' },
      { ar: 'الذكاء الاصطناعي المسؤول والأخلاقي', en: 'Responsible & ethical AI' },
    ],
  },
  {
    id: 'cyber',
    name: { ar: 'الأمن السيبراني والثقة الرقمية', en: 'Cybersecurity & Digital Trust' },
    shortName: { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
    description: {
      ar: 'حماية الخدمات والبيانات الحكومية، وبناء الثقة الرقمية من الوعي اليومي إلى الأمن منذ التصميم.',
      en: 'Protecting government services and data, building digital trust from daily awareness to security by design.',
    },
    icon: 'shield',
    skills: [
      { ar: 'الوعي الأمني', en: 'Security awareness' },
      { ar: 'الخصوصية وحماية البيانات الشخصية', en: 'Privacy & personal data protection' },
      { ar: 'أساسيات إدارة المخاطر والحوادث', en: 'Risk & incident basics' },
      { ar: 'إدارة الهويات والصلاحيات', en: 'Identity & access management' },
      { ar: 'الأمن منذ التصميم', en: 'Security by design' },
    ],
  },
  {
    id: 'cloud',
    name: { ar: 'السحابة والبنية التحتية الرقمية', en: 'Cloud & Digital Infrastructure' },
    shortName: { ar: 'السحابة والبنية', en: 'Cloud & Infra' },
    description: {
      ar: 'فهم النماذج السحابية والتشغيل البيني وتحديث الأنظمة والهوية الرقمية وإدارة الموردين.',
      en: 'Cloud service models, interoperability, legacy modernization, digital identity and vendor resilience.',
    },
    icon: 'cloud',
    skills: [
      { ar: 'نماذج الخدمات السحابية', en: 'Cloud service models' },
      { ar: 'قابلية التشغيل البيني وواجهات البرمجة', en: 'Interoperability & APIs' },
      { ar: 'تحديث الأنظمة القديمة', en: 'Legacy modernization' },
      { ar: 'الهوية الرقمية', en: 'Digital identity' },
      { ar: 'المرونة وإدارة الموردين', en: 'Resilience & vendor management' },
    ],
  },
  {
    id: 'service-design',
    name: { ar: 'تصميم الخدمات المرتكزة على المستخدم', en: 'User-Centred Service Design' },
    shortName: { ar: 'تصميم الخدمات', en: 'Service Design' },
    description: {
      ar: 'بحث المستفيدين وتصميم الرحلات وإمكانية الوصول وكتابة المحتوى واختبار قابلية الاستخدام.',
      en: 'User research, journey mapping, accessibility, content design and usability testing.',
    },
    icon: 'compass',
    skills: [
      { ar: 'بحث المستخدمين', en: 'User research' },
      { ar: 'تصميم الخدمات ورسم الرحلات', en: 'Service design & journey mapping' },
      { ar: 'إمكانية الوصول والتصميم الشامل', en: 'Accessibility & inclusive design' },
      { ar: 'تصميم المحتوى', en: 'Content design' },
      { ar: 'اختبار قابلية الاستخدام', en: 'Usability testing' },
    ],
  },
  {
    id: 'policy',
    name: { ar: 'السياسات والاستراتيجية والحوكمة الرقمية', en: 'Digital Policy, Strategy & Governance' },
    shortName: { ar: 'السياسات والحوكمة', en: 'Policy & Governance' },
    description: {
      ar: 'استراتيجية التحول الرقمي والوعي بالتشريعات والحكومة المفتوحة والشمول الرقمي والشراء التقني.',
      en: 'Digital transformation strategy, legislation awareness, open government, digital inclusion and tech procurement.',
    },
    icon: 'scale',
    skills: [
      { ar: 'استراتيجية التحول الرقمي', en: 'Digital transformation strategy' },
      { ar: 'الوعي بالتشريعات الرقمية', en: 'Digital legislation awareness' },
      { ar: 'الحكومة المفتوحة والبيانات المفتوحة', en: 'Open government & open data' },
      { ar: 'الشمول الرقمي', en: 'Digital inclusion' },
      { ar: 'الشراء والتعاقد التقني', en: 'Tech procurement' },
    ],
  },
  {
    id: 'agile',
    name: { ar: 'المنتجات الرقمية والتسليم الرشيق', en: 'Agile Product & Delivery' },
    shortName: { ar: 'التسليم الرشيق', en: 'Agile Delivery' },
    description: {
      ar: 'طرق العمل الرشيقة ودورة حياة المنتج وقصص المستخدم وإدارة أصحاب المصلحة وقياس الأثر.',
      en: 'Agile ways of working, product lifecycle, user stories, stakeholder management and benefits measurement.',
    },
    icon: 'cycle',
    skills: [
      { ar: 'طرق العمل الرشيقة', en: 'Agile ways of working' },
      { ar: 'دورة حياة المنتج', en: 'Product lifecycle' },
      { ar: 'قصص المستخدم وتحليل الأعمال', en: 'User stories & business analysis' },
      { ar: 'إدارة أصحاب المصلحة', en: 'Stakeholder management' },
      { ar: 'قياس المنافع والأثر', en: 'Benefits measurement' },
    ],
  },
  {
    id: 'emerging',
    name: { ar: 'التقنيات الناشئة', en: 'Emerging Technologies' },
    shortName: { ar: 'التقنيات الناشئة', en: 'Emerging Tech' },
    description: {
      ar: 'الأتمتة ووكلاء الذكاء الاصطناعي وإنترنت الأشياء وسلسلة الكتل والتوأم الرقمي واستكشاف التقنيات بمنهجية.',
      en: 'Agentic AI & automation, IoT & smart cities, blockchain, geospatial & digital twins, and technology scouting.',
    },
    icon: 'spark',
    skills: [
      { ar: 'وكلاء الذكاء الاصطناعي والأتمتة', en: 'Agentic AI & automation' },
      { ar: 'إنترنت الأشياء والمدن الذكية', en: 'IoT & smart cities' },
      { ar: 'سلسلة الكتل والاعتمادات الرقمية', en: 'Blockchain & digital credentials' },
      { ar: 'البيانات المكانية والتوأم الرقمي', en: 'Geospatial & digital twins' },
      { ar: 'استكشاف التقنيات وتقييمها', en: 'Technology scouting' },
    ],
  },
  {
    id: 'leadership',
    name: { ar: 'القيادة والتعاون الرقمي', en: 'Digital Leadership & Collaboration' },
    shortName: { ar: 'القيادة الرقمية', en: 'Leadership' },
    description: {
      ar: 'إدارة التغيير والتأثير في غير التقنيين والعمل بانفتاح وسرد البيانات وتوجيه الآخرين.',
      en: 'Change management, influencing non-technical stakeholders, working in the open, data storytelling and coaching.',
    },
    icon: 'flag',
    skills: [
      { ar: 'إدارة التغيير', en: 'Change management' },
      { ar: 'التأثير في غير التقنيين', en: 'Influencing non-technical stakeholders' },
      { ar: 'العمل بشفافية وانفتاح', en: 'Working in the open' },
      { ar: 'سرد القصص بالبيانات', en: 'Storytelling with data' },
      { ar: 'التوجيه والتعلم المستمر', en: 'Coaching & lifelong learning' },
    ],
  },
]

export const domainById = (id: string): Domain => domains.find((d) => d.id === id)!
