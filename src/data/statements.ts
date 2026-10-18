import type { Statement } from './types'

/**
 * 40 statements — 5 per domain, one per skill.
 * Phrased as first-person capabilities with observable behaviors.
 */
export const statements: Statement[] = [
  // ── 1. AI & Data ─────────────────────────────────────────────
  {
    id: 'ai-1', domainId: 'ai-data', skillIndex: 0,
    text: {
      ar: 'أستطيع قراءة الجداول والرسوم البيانية وتفسير ما تعنيه الأرقام لاتخاذ قرار في عملي.',
      en: 'I can read tables and charts and interpret what the numbers mean to make a decision at work.',
    },
  },
  {
    id: 'ai-2', domainId: 'ai-data', skillIndex: 1,
    text: {
      ar: 'أستطيع تطبيق قواعد جودة البيانات وملكيتها وتصنيفها عند التعامل مع بيانات جهتي.',
      en: 'I can apply data quality, ownership and classification rules when handling my organization’s data.',
    },
  },
  {
    id: 'ai-3', domainId: 'ai-data', skillIndex: 2,
    text: {
      ar: 'أستطيع تحليل مجموعة بيانات وتحويلها إلى رسم بياني واضح يشرح النتيجة لغير المختصين.',
      en: 'I can analyze a dataset and turn it into a clear visual that explains the finding to non-specialists.',
    },
  },
  {
    id: 'ai-4', domainId: 'ai-data', skillIndex: 3,
    text: {
      ar: 'أستطيع صياغة أوامر فعّالة لأدوات الذكاء الاصطناعي التوليدي ومراجعة مخرجاتها نقديًا قبل استخدامها.',
      en: 'I can write effective prompts for generative AI tools and critically review their outputs before using them.',
    },
  },
  {
    id: 'ai-5', domainId: 'ai-data', skillIndex: 4,
    text: {
      ar: 'أستطيع تحديد المخاطر الأخلاقية كالتحيز والشفافية في حالة استخدام للذكاء الاصطناعي واقتراح ضوابط لها.',
      en: 'I can identify ethical risks such as bias and transparency in an AI use case and propose safeguards.',
    },
  },
  // ── 2. Cybersecurity & Digital Trust ─────────────────────────
  {
    id: 'cyb-1', domainId: 'cyber', skillIndex: 0,
    text: {
      ar: 'أستطيع التعرف على رسائل التصيد والروابط المشبوهة واتباع الممارسات الآمنة في عملي اليومي.',
      en: 'I can recognize phishing messages and suspicious links and follow safe practices in my daily work.',
    },
  },
  {
    id: 'cyb-2', domainId: 'cyber', skillIndex: 1,
    text: {
      ar: 'أستطيع تطبيق مبادئ حماية البيانات الشخصية كالتقليل والموافقة عند جمع بيانات المستفيدين أو مشاركتها.',
      en: 'I can apply personal data protection principles such as minimization and consent when collecting or sharing beneficiary data.',
    },
  },
  {
    id: 'cyb-3', domainId: 'cyber', skillIndex: 2,
    text: {
      ar: 'أستطيع وصف الخطوات الأولى عند الاشتباه بحادثة أمنية، وأعرف متى وكيف أبلّغ عنها.',
      en: 'I can describe the first steps when a security incident is suspected, and I know when and how to report it.',
    },
  },
  {
    id: 'cyb-4', domainId: 'cyber', skillIndex: 3,
    text: {
      ar: 'أستطيع إدارة الصلاحيات وفق مبدأ الحد الأدنى ومراجعة من يصل إلى الأنظمة التي أشرف عليها.',
      en: 'I can manage access rights on a least-privilege basis and review who has access to the systems I oversee.',
    },
  },
  {
    id: 'cyb-5', domainId: 'cyber', skillIndex: 4,
    text: {
      ar: 'أستطيع إشراك اعتبارات الأمن السيبراني منذ بداية أي مشروع رقمي وليس بعد اكتماله.',
      en: 'I can embed cybersecurity considerations from the start of a digital project rather than after it is built.',
    },
  },
  // ── 3. Cloud & Digital Infrastructure ────────────────────────
  {
    id: 'cld-1', domainId: 'cloud', skillIndex: 0,
    text: {
      ar: 'أستطيع شرح الفرق بين نماذج الخدمة السحابية (IaaS وPaaS وSaaS) ومتى يناسب كلٌّ منها جهتي.',
      en: 'I can explain the difference between cloud service models (IaaS, PaaS, SaaS) and when each suits my organization.',
    },
  },
  {
    id: 'cld-2', domainId: 'cloud', skillIndex: 1,
    text: {
      ar: 'أستطيع توصيف كيف تتبادل الأنظمة البيانات عبر واجهات البرمجة (APIs) ولماذا تهمّ المعايير المفتوحة.',
      en: 'I can describe how systems exchange data through APIs and why open standards matter.',
    },
  },
  {
    id: 'cld-3', domainId: 'cloud', skillIndex: 2,
    text: {
      ar: 'أستطيع تقييم نظام قديم وموازنة خيارات التحديث (إعادة الاستضافة، إعادة البناء، الاستبدال) مع مبرراتها.',
      en: 'I can assess a legacy system and weigh modernization options (rehost, rebuild, replace) with their rationale.',
    },
  },
  {
    id: 'cld-4', domainId: 'cloud', skillIndex: 3,
    text: {
      ar: 'أستطيع شرح دور الهوية الرقمية الوطنية في تقديم الخدمات ومتطلبات الربط بها.',
      en: 'I can explain the role of national digital identity in service delivery and the requirements for integrating with it.',
    },
  },
  {
    id: 'cld-5', domainId: 'cloud', skillIndex: 4,
    text: {
      ar: 'أستطيع وضع متطلبات استمرارية الأعمال والتعافي من الكوارث وإدارة مخاطر الاعتماد على الموردين.',
      en: 'I can define business continuity and disaster recovery requirements and manage vendor dependency risks.',
    },
  },
  // ── 4. User-Centred Service Design ───────────────────────────
  {
    id: 'srv-1', domainId: 'service-design', skillIndex: 0,
    text: {
      ar: 'أستطيع التخطيط لمقابلات مع المستفيدين واستخلاص احتياجات حقيقية منها لا مجرد آراء.',
      en: 'I can plan interviews with beneficiaries and draw out real needs from them, not just opinions.',
    },
  },
  {
    id: 'srv-2', domainId: 'service-design', skillIndex: 1,
    text: {
      ar: 'أستطيع رسم رحلة المستفيد عبر الخدمة كاملة وتحديد نقاط الألم وفرص التحسين.',
      en: 'I can map a beneficiary’s end-to-end journey through a service and identify pain points and improvement opportunities.',
    },
  },
  {
    id: 'srv-3', domainId: 'service-design', skillIndex: 2,
    text: {
      ar: 'أستطيع التحقق من أن الخدمة الرقمية تلبي معايير إمكانية الوصول للأشخاص ذوي الإعاقة.',
      en: 'I can verify that a digital service meets accessibility standards for people with disabilities.',
    },
  },
  {
    id: 'srv-4', domainId: 'service-design', skillIndex: 3,
    text: {
      ar: 'أستطيع كتابة محتوى الخدمة بلغة بسيطة واضحة تطابق مستوى فهم الجمهور المستهدف.',
      en: 'I can write service content in plain, clear language matched to the target audience’s understanding.',
    },
  },
  {
    id: 'srv-5', domainId: 'service-design', skillIndex: 4,
    text: {
      ar: 'أستطيع تنفيذ اختبار قابلية استخدام مع مستخدمين حقيقيين وتحويل الملاحظات إلى تحسينات ملموسة.',
      en: 'I can run a usability test with real users and turn observations into concrete improvements.',
    },
  },
  // ── 5. Digital Policy, Strategy & Governance ─────────────────
  {
    id: 'pol-1', domainId: 'policy', skillIndex: 0,
    text: {
      ar: 'أستطيع ربط مبادرات التحول الرقمي في جهتي بالأهداف الاستراتيجية الوطنية وقياس تقدمها.',
      en: 'I can link my organization’s digital transformation initiatives to national strategic goals and measure their progress.',
    },
  },
  {
    id: 'pol-2', domainId: 'policy', skillIndex: 1,
    text: {
      ar: 'أستطيع تحديد التشريعات الرقمية ذات الصلة — كحماية البيانات وتنظيم الذكاء الاصطناعي — التي تنطبق على مشروعي.',
      en: 'I can identify the digital regulations relevant to my project, such as data protection and AI regulation.',
    },
  },
  {
    id: 'pol-3', domainId: 'policy', skillIndex: 2,
    text: {
      ar: 'أستطيع تقييم ما يمكن نشره كبيانات مفتوحة وقياس أثر الانفتاح على الشفافية والابتكار.',
      en: 'I can assess what can be published as open data and gauge the impact of openness on transparency and innovation.',
    },
  },
  {
    id: 'pol-4', domainId: 'policy', skillIndex: 3,
    text: {
      ar: 'أستطيع تحديد الفئات التي قد تستبعدها الخدمة الرقمية واقتراح قنوات بديلة تضمن شمولها.',
      en: 'I can identify groups a digital service might exclude and propose alternative channels to ensure inclusion.',
    },
  },
  {
    id: 'pol-5', domainId: 'policy', skillIndex: 4,
    text: {
      ar: 'أستطيع صياغة متطلبات شراء تقنية تركز على النتائج وتتجنب القيود التي تأسرنا مع مورد واحد.',
      en: 'I can draft technology procurement requirements that focus on outcomes and avoid vendor lock-in.',
    },
  },
  // ── 6. Agile Product & Delivery ──────────────────────────────
  {
    id: 'agl-1', domainId: 'agile', skillIndex: 0,
    text: {
      ar: 'أستطيع العمل ضمن فريق يتبع دورات تطوير قصيرة بأدوار واجتماعات دورية واضحة.',
      en: 'I can work in a team running short delivery cycles (sprints) with clear roles and ceremonies.',
    },
  },
  {
    id: 'agl-2', domainId: 'agile', skillIndex: 1,
    text: {
      ar: 'أستطيع قيادة منتج رقمي عبر مراحل الاكتشاف والتجربة والإطلاق والتحسين المستمر.',
      en: 'I can lead a digital product through discovery, beta, launch and continuous improvement stages.',
    },
  },
  {
    id: 'agl-3', domainId: 'agile', skillIndex: 2,
    text: {
      ar: 'أستطيع كتابة قصص مستخدم بمعايير قبول قابلة للاختبار يفهمها الزملاء التقنيون والإداريون معًا.',
      en: 'I can write user stories with testable acceptance criteria that technical and business colleagues both understand.',
    },
  },
  {
    id: 'agl-4', domainId: 'agile', skillIndex: 3,
    text: {
      ar: 'أستطيع إدارة توقعات أصحاب المصلحة المتعارضة والوصول إلى قرارات موثقة.',
      en: 'I can manage conflicting stakeholder expectations and reach documented decisions.',
    },
  },
  {
    id: 'agl-5', domainId: 'agile', skillIndex: 4,
    text: {
      ar: 'أستطيع تعريف مؤشرات نجاح للمنتج وقياس الأثر الفعلي بعد الإطلاق لا مجرد إتمام التسليم.',
      en: 'I can define success metrics for a product and measure real impact after launch, not just delivery completion.',
    },
  },
  // ── 7. Emerging Technologies ─────────────────────────────────
  {
    id: 'emg-1', domainId: 'emerging', skillIndex: 0,
    text: {
      ar: 'أستطيع تقييم أين تضيف الأتمتة والوكلاء الأذكياء قيمة حقيقية في إجراءات العمل وأين لا تضيف.',
      en: 'I can assess where automation and AI agents add real value in work processes — and where they don’t.',
    },
  },
  {
    id: 'emg-2', domainId: 'emerging', skillIndex: 1,
    text: {
      ar: 'أستطيع شرح تطبيقات إنترنت الأشياء في المدن الذكية ومتطلبات البيانات والأمن المرتبطة بها.',
      en: 'I can explain IoT applications in smart cities and their data and security requirements.',
    },
  },
  {
    id: 'emg-3', domainId: 'emerging', skillIndex: 2,
    text: {
      ar: 'أستطيع التمييز بين الحالات التي تبرر استخدام سلسلة الكتل كالاعتمادات الرقمية وتلك التي لا تبررها.',
      en: 'I can distinguish between cases that justify blockchain, such as digital credentials, and those that don’t.',
    },
  },
  {
    id: 'emg-4', domainId: 'emerging', skillIndex: 3,
    text: {
      ar: 'أستطيع توظيف البيانات الجغرافية المكانية أو مفهوم التوأم الرقمي في تحسين خدمة أو قرار.',
      en: 'I can apply geospatial data or digital-twin concepts to improve a service or a decision.',
    },
  },
  {
    id: 'emg-5', domainId: 'emerging', skillIndex: 4,
    text: {
      ar: 'أستطيع تقييم تقنية ناشئة بمنهجية واضحة تفصل بين الضجيج الإعلامي والقيمة الفعلية لجهتي.',
      en: 'I can evaluate an emerging technology with a clear method that separates media hype from actual value for my organization.',
    },
  },
  // ── 8. Digital Leadership & Collaboration ────────────────────
  {
    id: 'led-1', domainId: 'leadership', skillIndex: 0,
    text: {
      ar: 'أستطيع قيادة خطة تغيير لمبادرة رقمية تشمل التواصل والتدريب ومعالجة المقاومة.',
      en: 'I can lead a change plan for a digital initiative covering communication, training and addressing resistance.',
    },
  },
  {
    id: 'led-2', domainId: 'leadership', skillIndex: 1,
    text: {
      ar: 'أستطيع شرح قرار تقني معقد لقيادات غير تقنية بلغة الأعمال والأثر.',
      en: 'I can explain a complex technical decision to non-technical leaders in the language of business and impact.',
    },
  },
  {
    id: 'led-3', domainId: 'leadership', skillIndex: 2,
    text: {
      ar: 'أستطيع مشاركة تقدم العمل والدروس المستفادة علنًا مع الجهات الأخرى لتعميم الفائدة.',
      en: 'I can share work progress and lessons learned openly with other organizations to spread the benefit.',
    },
  },
  {
    id: 'led-4', domainId: 'leadership', skillIndex: 3,
    text: {
      ar: 'أستطيع بناء عرض قصصي بالبيانات يقود جمهورًا محددًا إلى قرار محدد.',
      en: 'I can build a data-driven narrative that leads a specific audience to a specific decision.',
    },
  },
  {
    id: 'led-5', domainId: 'leadership', skillIndex: 4,
    text: {
      ar: 'أستطيع توجيه زملاء لتطوير مهاراتهم الرقمية وبناء خطة تعلم مستمرة لنفسي ولفريقي.',
      en: 'I can coach colleagues to develop their digital skills and build a continuous learning plan for myself and my team.',
    },
  },
]

export const statementsByDomain = (domainId: string): Statement[] =>
  statements.filter((s) => s.domainId === domainId)
