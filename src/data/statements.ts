import type { Statement } from './types'

/**
 * 40 statements — 5 per domain, one per skill.
 * Round-3 rewrite (psychometrics review P1-7): each item now carries ONE
 * observable behavior (double-barreled items were split to their core act),
 * and role-gated items were reworded to measure capability, not job title
 * (e.g., "أستطيع المساهمة في…" instead of "الأنظمة التي أشرف عليها").
 * Phrased as first-person capabilities: "أستطيع أن…" / "I can…".
 */
export const statements: Statement[] = [
  // ── 1. AI & Data ─────────────────────────────────────────────
  {
    id: 'ai-1', domainId: 'ai-data', skillIndex: 0,
    text: {
      ar: 'أستطيع تفسير ما تعنيه الأرقام في جدول أو رسم بياني لاتخاذ قرار في عملي.',
      en: 'I can interpret what the numbers in a table or chart mean for a decision at work.',
    },
  },
  {
    id: 'ai-2', domainId: 'ai-data', skillIndex: 1,
    text: {
      ar: 'أستطيع تطبيق قواعد تصنيف البيانات عند التعامل مع بيانات جهتي.',
      en: 'I can apply data-classification rules when handling my organization’s data.',
    },
  },
  {
    id: 'ai-3', domainId: 'ai-data', skillIndex: 2,
    text: {
      ar: 'أستطيع تحويل نتيجة تحليل بيانات إلى رسم بياني يفهمه غير المختصين.',
      en: 'I can turn a data-analysis result into a chart that non-specialists understand.',
    },
  },
  {
    id: 'ai-4', domainId: 'ai-data', skillIndex: 3,
    text: {
      ar: 'أستطيع صياغة أوامر فعّالة لأداة ذكاء اصطناعي توليدي لإنجاز مهمة عمل.',
      en: 'I can write effective prompts for a generative AI tool to complete a work task.',
    },
  },
  {
    id: 'ai-5', domainId: 'ai-data', skillIndex: 4,
    text: {
      ar: 'أستطيع تحديد مخاطر التحيز والشفافية في حالة استخدام مقترحة للذكاء الاصطناعي.',
      en: 'I can identify bias and transparency risks in a proposed AI use case.',
    },
  },
  // ── 2. Cybersecurity & Digital Trust ─────────────────────────
  {
    id: 'cyb-1', domainId: 'cyber', skillIndex: 0,
    text: {
      ar: 'أستطيع التعرف على رسائل التصيد والروابط المشبوهة عند وصولها.',
      en: 'I can recognize phishing messages and suspicious links when they arrive.',
    },
  },
  {
    id: 'cyb-2', domainId: 'cyber', skillIndex: 1,
    text: {
      ar: 'أستطيع تطبيق مبدأ تقليل البيانات عند جمع بيانات المستفيدين.',
      en: 'I can apply data-minimization when collecting beneficiary data.',
    },
  },
  {
    id: 'cyb-3', domainId: 'cyber', skillIndex: 2,
    text: {
      ar: 'أستطيع وصف الخطوات الأولى للإبلاغ عن حادثة أمنية مشتبه بها.',
      en: 'I can describe the first steps for reporting a suspected security incident.',
    },
  },
  {
    id: 'cyb-4', domainId: 'cyber', skillIndex: 3,
    text: {
      ar: 'أستطيع المساهمة في مراجعة صلاحيات الوصول إلى نظام أعمل عليه وفق مبدأ الحد الأدنى.',
      en: 'I can contribute to reviewing access rights on a system I work with, using least-privilege thinking.',
    },
  },
  {
    id: 'cyb-5', domainId: 'cyber', skillIndex: 4,
    text: {
      ar: 'أستطيع اقتراح إشراك اعتبارات الأمن السيبراني منذ بداية مشروع رقمي جديد.',
      en: 'I can propose embedding cybersecurity considerations at the start of a new digital project.',
    },
  },
  // ── 3. Cloud & Digital Infrastructure ────────────────────────
  {
    id: 'cld-1', domainId: 'cloud', skillIndex: 0,
    text: {
      ar: 'أستطيع شرح الفرق بين نماذج الخدمة السحابية الثلاثة (IaaS وPaaS وSaaS).',
      en: 'I can explain the difference between the three cloud service models (IaaS, PaaS, SaaS).',
    },
  },
  {
    id: 'cld-2', domainId: 'cloud', skillIndex: 1,
    text: {
      ar: 'أستطيع توصيف كيف يتبادل نظامان البيانات عبر واجهة برمجة (API).',
      en: 'I can describe how two systems exchange data through an API.',
    },
  },
  {
    id: 'cld-3', domainId: 'cloud', skillIndex: 2,
    text: {
      ar: 'أستطيع موازنة خيارات تحديث نظام قديم (إعادة استضافة أو إعادة بناء أو استبدال) واختيار الأنسب بمبررات.',
      en: 'I can weigh the modernization options for a legacy system (rehost, rebuild, replace) and pick one with a rationale.',
    },
  },
  {
    id: 'cld-4', domainId: 'cloud', skillIndex: 3,
    text: {
      ar: 'أستطيع شرح دور الهوية الرقمية الوطنية في تقديم الخدمات الحكومية.',
      en: 'I can explain the role of national digital identity in delivering government services.',
    },
  },
  {
    id: 'cld-5', domainId: 'cloud', skillIndex: 4,
    text: {
      ar: 'أستطيع وضع متطلبات الاستمرارية وإدارة مخاطر المورد لخدمة رقمية حرجة.',
      en: 'I can define continuity and vendor-risk requirements for a critical digital service.',
    },
  },
  // ── 4. User-Centred Service Design ───────────────────────────
  {
    id: 'srv-1', domainId: 'service-design', skillIndex: 0,
    text: {
      ar: 'أستطيع إجراء مقابلة مع مستفيد واستخلاص احتياجه الحقيقي منها.',
      en: 'I can run an interview with a beneficiary and draw out their real need from it.',
    },
  },
  {
    id: 'srv-2', domainId: 'service-design', skillIndex: 1,
    text: {
      ar: 'أستطيع رسم رحلة مستفيد عبر خدمة وتحديد نقاط الألم فيها.',
      en: 'I can map a beneficiary journey through a service and mark its pain points.',
    },
  },
  {
    id: 'srv-3', domainId: 'service-design', skillIndex: 2,
    text: {
      ar: 'أستطيع فحص صفحة خدمة رقمية مقابل معايير إمكانية الوصول.',
      en: 'I can check a digital-service page against accessibility standards.',
    },
  },
  {
    id: 'srv-4', domainId: 'service-design', skillIndex: 3,
    text: {
      ar: 'أستطيع كتابة محتوى خدمة بلغة بسيطة يفهمها جمهورها المستهدف.',
      en: 'I can write service content in plain language its target audience understands.',
    },
  },
  {
    id: 'srv-5', domainId: 'service-design', skillIndex: 4,
    text: {
      ar: 'أستطيع تنفيذ اختبار قابلية استخدام مع مستخدم حقيقي وتوثيق ملاحظاته.',
      en: 'I can run a usability test with a real user and document the findings.',
    },
  },
  // ── 5. Digital Policy, Strategy & Governance ─────────────────
  {
    id: 'pol-1', domainId: 'policy', skillIndex: 0,
    text: {
      ar: 'أستطيع ربط مبادرة رقمية أعمل عليها بهدف استراتيجي وطني محدد.',
      en: 'I can link a digital initiative I work on to a specific national strategic goal.',
    },
  },
  {
    id: 'pol-2', domainId: 'policy', skillIndex: 1,
    text: {
      ar: 'أستطيع تحديد التشريعات الرقمية المنطبقة على مشروع أعمل عليه، كنظام حماية البيانات الشخصية.',
      en: 'I can identify the digital regulations that apply to a project I work on, such as personal data protection.',
    },
  },
  {
    id: 'pol-3', domainId: 'policy', skillIndex: 2,
    text: {
      ar: 'أستطيع تقييم ملاءمة مجموعة بيانات للنشر كبيانات مفتوحة.',
      en: 'I can assess whether a dataset is suitable for open-data publication.',
    },
  },
  {
    id: 'pol-4', domainId: 'policy', skillIndex: 3,
    text: {
      ar: 'أستطيع تحديد فئة مستفيدين قد تُستبعد من خدمة رقمية واقتراح قناة بديلة لها.',
      en: 'I can identify a beneficiary group a digital service might exclude and propose an alternative channel for it.',
    },
  },
  {
    id: 'pol-5', domainId: 'policy', skillIndex: 4,
    text: {
      ar: 'أستطيع صياغة متطلبات شراء تقنية مبنية على النتائج لا على المواصفات المقيدة.',
      en: 'I can draft technology procurement requirements based on outcomes rather than restrictive specifications.',
    },
  },
  // ── 6. Agile Product & Delivery ──────────────────────────────
  {
    id: 'agl-1', domainId: 'agile', skillIndex: 0,
    text: {
      ar: 'أستطيع العمل ضمن فريق يتبع دورات تطوير قصيرة بأدوار واجتماعات دورية واضحة.',
      en: 'I can work in a team that runs short delivery cycles with clear roles and regular meetings.',
    },
  },
  {
    id: 'agl-2', domainId: 'agile', skillIndex: 1,
    text: {
      ar: 'أستطيع تحديد المرحلة التي بلغها منتج رقمي (اكتشاف، تجربة، إطلاق) وما يلزم لانتقاله إلى المرحلة التالية.',
      en: 'I can identify which stage a digital product has reached (discovery, beta, launch) and what it needs to move to the next one.',
    },
  },
  {
    id: 'agl-3', domainId: 'agile', skillIndex: 2,
    text: {
      ar: 'أستطيع كتابة قصة مستخدم بمعايير قبول قابلة للاختبار.',
      en: 'I can write a user story with testable acceptance criteria.',
    },
  },
  {
    id: 'agl-4', domainId: 'agile', skillIndex: 3,
    text: {
      ar: 'أستطيع إدارة توقعات أصحاب مصلحة متعارضة حتى الوصول إلى قرار موثق.',
      en: 'I can manage conflicting stakeholder expectations through to a documented decision.',
    },
  },
  {
    id: 'agl-5', domainId: 'agile', skillIndex: 4,
    text: {
      ar: 'أستطيع تعريف مؤشرات نجاح لمنتج رقمي وقياسها بعد الإطلاق.',
      en: 'I can define success metrics for a digital product and measure them after launch.',
    },
  },
  // ── 7. Emerging Technologies ─────────────────────────────────
  {
    id: 'emg-1', domainId: 'emerging', skillIndex: 0,
    text: {
      ar: 'أستطيع تقييم ما إذا كان إجراء عمل محدد يناسب الأتمتة أو وكلاء الذكاء الاصطناعي قبل تبنّيها.',
      en: 'I can assess whether a specific work procedure suits automation or AI agents before adopting them.',
    },
  },
  {
    id: 'emg-2', domainId: 'emerging', skillIndex: 1,
    text: {
      ar: 'أستطيع شرح حالة استخدام لإنترنت الأشياء في مدينة ذكية.',
      en: 'I can explain one IoT use case in a smart city.',
    },
  },
  {
    id: 'emg-3', domainId: 'emerging', skillIndex: 2,
    text: {
      ar: 'أستطيع الحكم على ما إذا كانت حالة استخدام تبرر سلسلة الكتل فعلًا.',
      en: 'I can judge whether a use case actually justifies blockchain.',
    },
  },
  {
    id: 'emg-4', domainId: 'emerging', skillIndex: 3,
    text: {
      ar: 'أستطيع اقتراح توظيف البيانات المكانية لتحسين قرار أو خدمة.',
      en: 'I can propose using geospatial data to improve a decision or a service.',
    },
  },
  {
    id: 'emg-5', domainId: 'emerging', skillIndex: 4,
    text: {
      ar: 'أستطيع تقييم تقنية ناشئة بمنهجية تفصل الضجيج الإعلامي عن القيمة الفعلية لجهتي.',
      en: 'I can evaluate an emerging technology with a method that separates media hype from real value for my organization.',
    },
  },
  // ── 8. Digital Leadership & Collaboration ────────────────────
  {
    id: 'led-1', domainId: 'leadership', skillIndex: 0,
    text: {
      ar: 'أستطيع المساهمة في إعداد خطة تغيير لمبادرة رقمية.',
      en: 'I can contribute to preparing a change plan for a digital initiative.',
    },
  },
  {
    id: 'led-2', domainId: 'leadership', skillIndex: 1,
    text: {
      ar: 'أستطيع شرح قرار تقني معقد لقيادة غير تقنية بلغة الأعمال والأثر.',
      en: 'I can explain a complex technical decision to a non-technical leader in the language of business and impact.',
    },
  },
  {
    id: 'led-3', domainId: 'leadership', skillIndex: 2,
    text: {
      ar: 'أستطيع مشاركة درس مستفاد من عملي مع جهات أخرى، بعد موافقة جهتي ووفق تصنيف البيانات.',
      en: 'I can share a lesson learned from my work with other organizations, with my entity’s approval and in line with data classification.',
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
      ar: 'أستطيع توجيه زميل لتطوير مهارة رقمية لديه.',
      en: 'I can coach a colleague to develop a digital skill.',
    },
  },
]

export const statementsByDomain = (domainId: string): Statement[] =>
  statements.filter((s) => s.domainId === domainId)
