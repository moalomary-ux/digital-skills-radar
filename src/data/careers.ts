import type { L } from './types'

/**
 * Future Careers dataset — 30 careers.
 * Converted from research/future-careers.md (evidence base: WEF FoJ 2025,
 * ILO/NASK 2025, McKinsey 2023, OECD, IMF 2024, Coursera GSR 2025).
 * Fields that were English-only in the source (evidence, automation
 * justification, AI augmentation) were translated to Arabic during conversion.
 */

export type Signal = 'GROWING' | 'TRANSFORMING' | 'DECLINING'
export type Exposure = 'low' | 'medium' | 'high'
export type CommitKey = 'under_1y' | 'y1_3' | 'y4_6' | 'over_6y'

export interface CareerMatching {
  interestKeys: string[]
  aptitudeKeys: string[] // empty = any
  learningStyles: string[]
  minCommitment: CommitKey
  degreeCommitment: CommitKey
  licenseRequired: boolean
}

export interface Career {
  id: string
  name: L
  category: string
  signal: Signal
  evidence: L
  automationExposure: Exposure
  automationJustification: L
  aiAugmentation: L
  keySkills: string[] // skill vocabulary keys
  pathways: { degree: L; skillsFirst: L }
  verdict: L
  matching: CareerMatching
  /** optional direct link to a role-library role for the assessment CTA */
  relatedRoleId?: string
}

export const signalMeta: Record<Signal, { name: L; color: string; bg: string }> = {
  GROWING: { name: { ar: 'يزدهر', en: 'Growing' }, color: '#255C2B', bg: '#E2F5E5' },
  TRANSFORMING: { name: { ar: 'يتحوّل', en: 'Transforming' }, color: '#8A6600', bg: '#FEF3D8' },
  DECLINING: { name: { ar: 'يندثر', en: 'Declining' }, color: '#B42318', bg: '#FEE4E2' },
}

export const exposureMeta: Record<Exposure, { name: L; pct: number; color: string }> = {
  low: { name: { ar: 'تعرّض منخفض للأتمتة', en: 'Low automation exposure' }, pct: 25, color: '#1B8354' },
  medium: { name: { ar: 'تعرّض متوسط للأتمتة', en: 'Medium automation exposure' }, pct: 58, color: '#DBA102' },
  high: { name: { ar: 'تعرّض مرتفع للأتمتة', en: 'High automation exposure' }, pct: 92, color: '#B42318' },
}

export const careerCategories: { id: string; name: L }[] = [
  { id: 'healthcare', name: { ar: 'الرعاية الصحية', en: 'Healthcare' } },
  { id: 'engineering_tech', name: { ar: 'الهندسة والتقنية', en: 'Engineering & Tech' } },
  { id: 'data_ai', name: { ar: 'البيانات والذكاء الاصطناعي', en: 'Data & AI' } },
  { id: 'cybersecurity', name: { ar: 'الأمن السيبراني', en: 'Cybersecurity' } },
  { id: 'education', name: { ar: 'التعليم', en: 'Education' } },
  { id: 'law', name: { ar: 'القانون', en: 'Law' } },
  { id: 'accounting_finance', name: { ar: 'المحاسبة والمالية', en: 'Accounting & Finance' } },
  { id: 'media_design', name: { ar: 'الإعلام والتصميم', en: 'Media & Design' } },
  { id: 'marketing', name: { ar: 'التسويق', en: 'Marketing' } },
  { id: 'hr', name: { ar: 'الموارد البشرية', en: 'Human Resources' } },
  { id: 'logistics', name: { ar: 'اللوجستيات', en: 'Logistics' } },
  { id: 'skilled_trades', name: { ar: 'المهن الحرفية', en: 'Skilled Trades' } },
  { id: 'government', name: { ar: 'الحكومة والإدارة', en: 'Government & Admin' } },
]

export const categoryById = (id: string) => careerCategories.find((c) => c.id === id)!

/** Platform skill vocabulary — 15 canonical keys, some linked to radar domains. */
export const skillVocab: Record<string, { name: L; domainId: string | null }> = {
  data_literacy: { name: { ar: 'محو أمية البيانات', en: 'Data literacy' }, domainId: 'ai-data' },
  ai_use: { name: { ar: 'استخدام الذكاء الاصطناعي', en: 'AI use' }, domainId: 'ai-data' },
  cybersecurity: { name: { ar: 'الأمن السيبراني', en: 'Cybersecurity' }, domainId: 'cyber' },
  cloud: { name: { ar: 'الحوسبة السحابية', en: 'Cloud computing' }, domainId: 'cloud' },
  user_centred_design: { name: { ar: 'التصميم المرتكز على المستخدم', en: 'User-centred design' }, domainId: 'service-design' },
  digital_policy: { name: { ar: 'السياسات الرقمية', en: 'Digital policy' }, domainId: 'policy' },
  agile_delivery: { name: { ar: 'التسليم الرشيق', en: 'Agile delivery' }, domainId: 'agile' },
  emerging_tech: { name: { ar: 'التقنيات الناشئة', en: 'Emerging tech' }, domainId: 'emerging' },
  digital_leadership: { name: { ar: 'القيادة الرقمية', en: 'Digital leadership' }, domainId: 'leadership' },
  analytical_thinking: { name: { ar: 'التفكير التحليلي', en: 'Analytical thinking' }, domainId: null },
  creative_thinking: { name: { ar: 'التفكير الإبداعي', en: 'Creative thinking' }, domainId: null },
  resilience: { name: { ar: 'المرونة والقدرة على التكيف', en: 'Resilience & adaptability' }, domainId: null },
  curiosity_lifelong_learning: { name: { ar: 'الفضول والتعلم مدى الحياة', en: 'Curiosity & lifelong learning' }, domainId: null },
  leadership: { name: { ar: 'القيادة والتأثير الاجتماعي', en: 'Leadership & social influence' }, domainId: null },
  empathy_care: { name: { ar: 'التعاطف والرعاية', en: 'Empathy & care' }, domainId: null },
}

export const careers: Career[] = [
  // ── HEALTHCARE ──
  {
    id: 'general_medicine',
    name: { ar: 'الطب العام', en: 'General Medicine (Physician)' },
    category: 'healthcare',
    signal: 'GROWING',
    evidence: {
      ar: 'يتوقع تقرير مستقبل الوظائف 2025 أن يقود شيخوخة السكان الطلب على الرعاية الصحية — فوظائف اقتصاد الرعاية (التمريض، الرعاية الشخصية، العمل الاجتماعي) بين الأكبر نموًا بالأرقام المطلقة. وسعوديًا: توطين القطاع الصحي ضمن تحول رؤية 2030.',
      en: 'WEF FoJ 2025: aging populations drive healthcare demand — care-economy roles (nursing, personal care, social work) among largest-growing in absolute terms; healthcare jobs expand wherever societies age. Saudi: healthcare localization + Vision 2030 health-sector transformation.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'الحكم السريري والفحص الجسدي والمساءلة الأخلاقية وثقة المريض تقاوم الأتمتة؛ ويصنف تقرير منظمة العمل الدولية 2025 المهن الصحية ضمن الأقل تعرضًا للذكاء الاصطناعي التوليدي.',
      en: 'Clinical judgment, physical examination, ethical accountability and patient trust resist automation; ILO 2025 classifies health professionals as among the least GenAI-exposed occupations.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يقرأ الصور الشعاعية ويصوغ الملاحظات ويرصد التداخلات الدوائية، فيتجه وقت الطبيب نحو التشخيص والتواصل والقرارات المعقدة — الطبيب الذي يستخدم الذكاء الاصطناعي يحل محل من لا يستخدمه، لا محل الطبيب نفسه.',
      en: "AI reads scans, drafts notes and flags drug interactions (AI scribes already cut charting time), shifting the doctor's time toward diagnosis, communication and complex decisions — the physician who uses AI replaces the one who doesn't, not the physician.",
    },
    keySkills: ['analytical_thinking', 'empathy_care', 'resilience', 'curiosity_lifelong_learning', 'ai_use'],
    pathways: {
      degree: {
        ar: 'بكالوريوس طب وجراحة (6 سنوات) + سنة امتياز + إقامة/تخصص عبر الهيئة السعودية للتخصصات الصحية؛ مسار طويل ومنظّم — وهو الطريق الوحيد القانوني لممارسة الطب.',
        en: 'MBBS (6 years) + internship + residency via Saudi Commission for Health Specialties (SCFHS); long, regulated, high-cost in time — but the only legal route to practice.',
      },
      skillsFirst: {
        ar: 'غير ممكن للممارسة السريرية (مهنة مرخّصة). المسارات المهارية تنطبق فقط على الأدوار المجاورة مثل محلل البيانات الصحية عبر Coursera وأكاديمية سدايا.',
        en: 'Not possible for clinical practice (licensed profession). Skills-first applies only to adjacent roles (health data analyst, clinical informatics) via Coursera/edX + SDAIA Academy.',
      },
    },
    verdict: {
      ar: 'نعم، إذا كان لدى ابنك المعدل والصبر والرغبة الحقيقية: الطب ينمو بفضل التغيرات الديموغرافية وهو شبه محصّن ضد الأتمتة، لكنه أطول مسار في هذه القائمة وأكثرها تطلبًا — لذا يجب أن يكون القرار قرار الطالب نفسه.',
      en: 'Yes, if your child has the grades, patience and genuine calling: medicine is growing on demographics, near-immune to automation, and deeply respected — but it is the longest and most demanding path on this list, so the decision must be the student’s own.',
    },
    matching: {
      interestKeys: ['people_care'],
      aptitudeKeys: ['bio_strong'],
      learningStyles: ['structured_classroom'],
      minCommitment: 'over_6y',
      degreeCommitment: 'over_6y',
      licenseRequired: true,
    },
  },
  {
    id: 'nursing',
    name: { ar: 'التمريض', en: 'Nursing Professional' },
    category: 'healthcare',
    signal: 'GROWING',
    evidence: {
      ar: 'يضع تقرير مستقبل الوظائف 2025 التمريض ضمن أكبر 15 مهنة نموًا بالأرقام المطلقة (نحو 3.1 مليون وظيفة جديدة عالميًا) مدفوعًا بشيخوخة السكان؛ وسعوديًا: نسب توطين التمريض والتوسع في المستشفيات.',
      en: 'WEF FoJ 2025: Nursing Professionals are in the top-15 largest-growing jobs in absolute numbers (≈3.1M new jobs globally), driven by aging populations; Saudi: nursing Saudization quotas and hospital expansion.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'الرعاية المباشرة للمرضى والحكم على الحالات والدعم الوجداني مهام جسدية وعلاقاتية تصنفها تحليلات منظمة العمل الدولية وMcKinsey ضمن الأقل قابلية للأتمتة.',
      en: 'Hands-on patient care, triage judgment and emotional support are physical and relational tasks that ILO/McKinsey-style task analysis consistently scores among the least automatable.',
    },
    aiAugmentation: {
      ar: 'الكتابة الآلية للتوثيق ولوحات المراقبة ترفع عبء الأعمال الورقية؛ ويحتفظ الممرضون بالتقييم والمناصرة والمسؤولية القانونية عن الرعاية.',
      en: 'AI scribes and monitoring dashboards remove documentation burden; nurses keep assessment, advocacy and legal responsibility for care.',
    },
    keySkills: ['empathy_care', 'resilience', 'analytical_thinking', 'ai_use', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس تمريض من الجامعات السعودية (4–5 سنوات) + ترخيص الهيئة السعودية للتخصصات الصحية، أو الكليات الصحية في المؤسسة العامة للتدريب التقني والمهني.',
        en: 'BSc Nursing at Saudi universities (4–5 years) + SCFHS licensure; also health colleges under TVTC.',
      },
      skillsFirst: {
        ar: 'برامج مساعد تمريض وأخصائي رعاية كمدخل، ثم جسر إلى البكالوريوس؛ ويصنّف تقرير المنتدى الاقتصادي العالمي 2025 أخصائيي الرعاية الشخصية ضمن أسرع المهن نموًا عالميًا.',
        en: 'Certified nursing-assistant and care-aide programs as entry points, then bridge to a degree; WEF 2025 lists Personal Care Aides among the fastest-growing roles globally.',
      },
    },
    verdict: {
      ar: 'من أكثر الخيارات أمانًا في هذه القائمة: الطلب العالمي هيكلي بسبب شيخوخة السكان، وخطر الأتمتة ضئيل، والمستشفيات السعودية تتوطّن التمريض بفاعلية — لكن الملاحظة الصادقة هي نظام المناوبات والرواتب الأولية الأدنى مقارنة بالطب.',
      en: 'One of the safest bets on this list: global demand is structural (aging), automation risk is minimal, and Saudi hospitals are actively localizing nursing — the honest caveat is shift work and modest early salaries relative to medicine.',
    },
    matching: {
      interestKeys: ['people_care'],
      aptitudeKeys: ['bio_strong'],
      learningStyles: ['structured_classroom', 'apprenticeship'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  {
    id: 'pharmacy',
    name: { ar: 'الصيدلة', en: 'Pharmacy (Pharmacist)' },
    category: 'healthcare',
    signal: 'TRANSFORMING',
    evidence: {
      ar: 'ينمو الطلب الصحي مع الديموغرافيا وفق تقرير مستقبل الوظائف 2025، لكن صرف الأدوية (المهمة الكلاسيكية للصيدلي) عالي القابلية للأتمتة؛ والدور يهاجر نحو الصيدلة السريرية وإرشاد المرضى والعمل التنظيمي والصناعي.',
      en: 'WEF FoJ 2025: healthcare demand grows with demographics, but dispensing (the classic pharmacist task) is highly automatable; the role is migrating toward clinical pharmacy, patient counseling and pharma-industry/regulatory work.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'أنظمة الصرف الآلية والوصفات الإلكترونية تؤتمت العدّ والصرف (مهام روتينية قاعدية وفق معايير McKinsey)، بينما يبقى الحكم السريري والإرشاد بشريًا.',
      en: 'Robotic dispensing and e-prescription systems already automate counting and dispensing (routine, rule-based tasks per McKinsey task criteria), while clinical judgment and counseling remain human.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يدير فحص التداخلات الدوائية والمخزون؛ وتنتقل قيمة الصيدلي إلى المراجعة السريرية وتثقيف المرضى وأدوار الجودة والتنظيم في القطاع الدوائي السعودي المتنامي.',
      en: "AI handles drug-interaction checks and inventory; the pharmacist's value shifts to clinical review, patient education and regulatory/quality roles in Saudi Arabia's growing pharma sector.",
    },
    keySkills: ['analytical_thinking', 'empathy_care', 'data_literacy', 'ai_use', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'دكتور صيدلة/بكالوريوس صيدلة (5–6 سنوات) + ترخيص الهيئة السعودية للتخصصات الصحية، وتميل الإقامات السريرية لتمييز الخريجين.',
        en: 'PharmD/BPharm (5–6 years) + SCFHS licensure; increasingly, clinical residencies differentiate graduates.',
      },
      skillsFirst: {
        ar: 'دبلومات فني صيدلة (التدريب التقني) كدخول أسرع، وشهادات الشؤون التنظيمية والتيقظ الدوائي للتحول نحو القطاع الصناعي.',
        en: 'Pharmacy-technician diplomas (TVTC) as a faster entry; regulatory affairs and pharmacovigilance certificates (Coursera/edX) for industry pivot.',
      },
    },
    verdict: {
      ar: 'ادرسها بهدف الصيدلة السريرية أو الصناعية لا شباك الصرف: الدرجة جيدة، لكن الدور التقليدي في الصيدليات المجتمعية يتقلص — فادمجها منذ البداية مع مهارات سريرية أو تنظيمية أو بيانات.',
      en: 'Study it for clinical or industry pharmacy, not for the dispensing counter: the degree is sound, but the old community-pharmacy role is shrinking, so pair it with clinical, regulatory or data skills from day one.',
    },
    matching: {
      interestKeys: ['people_care', 'numbers_logic'],
      aptitudeKeys: ['bio_strong'],
      learningStyles: ['structured_classroom'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  // ── ENGINEERING & TECH ──
  {
    id: 'software_development',
    name: { ar: 'هندسة وتطوير البرمجيات', en: 'Software & Applications Developer' },
    category: 'engineering_tech',
    signal: 'GROWING',
    evidence: {
      ar: 'رابع أسرع مهنة نموًا في العالم (+60%) وفق تقرير مستقبل الوظائف 2025 وضمن أكبر ثلاث مهن بالأرقام المطلقة؛ و86% من أصحاب العمل يتوقعون أن يحوّل الذكاء الاصطناعي أعمالهم — ما يوسّع الطلب على المطورين لا يقلصه.',
      en: 'WEF FoJ 2025: #4 fastest-growing role globally (+60% net growth) and top-3 in largest-growing absolute numbers; 86% of employers expect AI to transform their business, expanding — not shrinking — developer demand.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'توليد الشيفرة أصبح مسنودًا بالذكاء الاصطناعي بكثافة (المهام البرمجية الروتينية عالية التعرض وفق منظمة العمل الدولية 2025)، لكن تصميم الأنظمة والحكم على المتطلبات وتصحيح الأعطال في بيئة الإنتاج تبقي المهنة نامية — فالتعرض هنا بشكل التعزيز لا الاستبدال.',
      en: 'Code generation is heavily AI-assisted (routine coding tasks are highly exposed per ILO 2025), but system design, requirements judgment and debugging in production keep the occupation net-growing; exposure is augmentation-shaped, not replacement-shaped.',
    },
    aiAugmentation: {
      ar: 'أدوات مثل Copilot تكتب الشيفرة القياسية والاختبارات؛ ويرتقي عمل المطور نحو المعمارية ومراجعة الشيفرة (من أسرع المهارات نموًا في LinkedIn 2025) والأمن والحكم المنتجي. توظيف المبتدئين يضيق — فملف الأعمال أهم من أي وقت مضى.',
      en: "Copilot-class tools write boilerplate and tests; the developer's job moves up-stack to architecture, code review (LinkedIn SotR 2025 lists Code Review among fastest-growing skills), security and product judgment. Junior hiring is tightening — portfolios matter more than ever.",
    },
    keySkills: ['ai_use', 'analytical_thinking', 'cloud', 'agile_delivery', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس علوم حاسب/هندسة برمجيات من الجامعات السعودية؛ إشارة قوية لدى كبرى الشركات والجهات الحكومية الرقمية.',
        en: 'BSc Computer Science/Software Engineering (KSU, KFUPM, KAU, etc.); strong signal for large employers and government digital entities.',
      },
      skillsFirst: {
        ar: 'معسكرات أكاديمية طويق (12–16 أسبوعًا، وتوظيف ~80% عبر معرض طويق للتوظيف)، والأكاديمية السعودية الرقمية، وشهادات Google/IBM على Coursera مع ملف أعمال عام على GitHub؛ وارتفعت تسجيلات الذكاء الاصطناعي التوليدي في السعودية 165% سنويًا وفق تقرير Coursera 2025.',
        en: "Tuwaiq Academy bootcamps (12–16 weeks, ~80% placement via Tuwaiq Job Fair), Saudi Digital Academy, Google/IBM certificates on Coursera + a public GitHub portfolio; Saudi GenAI enrollments +165% YoY show the market's direction (Coursera GSR 2025).",
      },
    },
    verdict: {
      ar: 'نعم — مع وضوح الرؤية: الطلب كبير ومتنامٍ (المرتبة الرابعة عالميًا)، والسعودية توفر مسارات مهارية حقيقية، لكن الذكاء الاصطناعي يضغط الأعمال الروتينية للمبتدئين — فالنجاح يتطلب بناء مشاريع حقيقية وإتقان أدوات الذكاء الاصطناعي، لا مجرد اجتياز المقررات.',
      en: 'Yes — with eyes open: demand is large and growing (WEF #4), Saudi has real skills-first on-ramps, but AI is compressing junior-level grunt work, so success requires building real projects and AI-fluent habits, not just passing courses.',
    },
    matching: {
      interestKeys: ['build_tech', 'numbers_logic'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['project_based', 'structured_classroom'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'civil_engineering',
    name: { ar: 'الهندسة المدنية', en: 'Civil Engineering' },
    category: 'engineering_tech',
    signal: 'GROWING',
    evidence: {
      ar: 'وظائف البناء والخط الأمامي بين الأكبر نموًا بالأرقام المطلقة وفق تقرير مستقبل الوظائف 2025؛ وسعوديًا: المشاريع العملاقة لرؤية 2030 (نيوم، ذا لاين، 2.6 مليون وحدة سكنية مطلوبة بحلول 2030) وفجوة متوقعة بنحو 663 ألفًا في العمالة الماهرة للإنشاءات بحلول 2030.',
      en: "WEF FoJ 2025: construction/frontline roles are among the largest-growing in absolute terms; Saudi-specific: Vision 2030 giga-projects (NEOM, The Line, 2.6M housing units needed by 2030 per GASTAT-cited estimates) and a projected ~663,000 skilled-workforce gap in construction by 2030.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'الإشراف الميداني والحكم الجيوتقني والمساءلة عن السلامة تحدث في بيئات مادية غير منظمة — وهو النمط الذي تفشل الأتمتة في التعامل معه (منظمة العمل الدولية: الأدوار اليدوية هي الأقل تعرضًا).',
      en: 'Site supervision, geotechnical judgment and safety accountability occur in unstructured physical environments — the profile automation handles worst (ILO: manual/physical roles are least GenAI-exposed).',
    },
    aiAugmentation: {
      ar: 'نمذجة معلومات البناء مع التصميم التوليدي والمسح بالطائرات المسيّرة وتحسين الجداول تغيّر عدّة المهندس؛ وتتقلص ساعات الرسم الروتيني في مكاتب التصميم.',
      en: "BIM plus AI generative design, drone surveying and scheduling optimization change the engineer's toolkit; design offices shrink routine drafting hours.",
    },
    keySkills: ['analytical_thinking', 'resilience', 'leadership', 'emerging_tech', 'data_literacy'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة مدنية (4–5 سنوات) + تسجيل الهيئة السعودية للمهندسين؛ وهو المسار المطلوب فعليًا للأعمال التصميمية المرخّصة.',
        en: 'BSc Civil Engineering (4–5 years) + Saudi Council of Engineers registration; effectively the required route for licensed design work.',
      },
      skillsFirst: {
        ar: 'شهادات نمذجة معلومات البناء (BIM) وPrimavera والمسح بالطائرات المسيّرة تسرّع التوظيف في المشاريع الكبرى، ودبلومات التدريب التقني لأدوار الفنيين.',
        en: 'BIM (Revit), Primavera and drone-surveying micro-credentials accelerate employability on giga-projects; TVTC construction diplomas for technician-level entry.',
      },
    },
    verdict: {
      ar: 'خيار قوي بخصوصية سعودية: الاتجاهات العالمية مستقرة، لكن خط مشاريع المملكة يجعل الطلب المحلي استثنائيًا هذا العقد — اختره إذا كان ابنك يتحمل العمل الميداني ويريد بناء أشياء ملموسة.',
      en: 'A strong Saudi-specific choice: global trends are steady, but the Kingdom’s construction pipeline makes local demand exceptional this decade — choose it if your child tolerates field work and wants to build visible things.',
    },
    matching: {
      interestKeys: ['build_physical', 'numbers_logic'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['structured_classroom', 'apprenticeship'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  {
    id: 'electrical_engineering',
    name: { ar: 'الهندسة الكهربائية', en: 'Electrical Engineering' },
    category: 'engineering_tech',
    signal: 'GROWING',
    evidence: {
      ar: 'تبني توليد الطاقة وتخزينها من أكبر ثلاثة محركات للتحول في تقرير مستقبل الوظائف 2025، ما يرفع مهندسي الكهرباء وأدوار الطاقة المتجددة؛ وسعوديًا: توسع الشبكة ومستهدفات الطاقة المتجددة وبنية المركبات الكهربائية ضمن رؤية 2030.',
      en: 'WEF FoJ 2025: energy generation/storage adoption is a top-3 transformation driver, lifting electrotechnology engineers and renewable-energy roles; Saudi: grid expansion, renewables targets and EV infrastructure under Vision 2030.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'التشغيل الميداني وتشخيص أعطال الشبكة والتوقيع على أعمال حرجة للسلامة تتطلب حضورًا جسديًا وحكمًا مرخّصًا؛ وتصنفها أطر منظمة العمل الدولية وMcKinsey ضمن منخفضة التعرض.',
      en: 'Field commissioning, grid fault diagnosis and safety-critical sign-off require physical presence and licensed judgment; ILO/McKinsey frameworks score these as low-exposure.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يحسّن أحمال الشبكة والصيانة التنبؤية وتصميم إلكترونيات القدرة؛ والمهندسون الجامعون بين أساسيات الطاقة ومهارات البيانات هم الأندر.',
      en: 'AI optimizes grid load, predictive maintenance and power electronics design; engineers who pair power fundamentals with data skills are scarcest.',
    },
    keySkills: ['analytical_thinking', 'emerging_tech', 'resilience', 'data_literacy', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة كهربائية + تسجيل الهيئة السعودية للمهندسين، وتخصصات الطاقة تتوافق مع مستهدفات رؤية 2030.',
        en: 'BSc Electrical Engineering + Saudi Council of Engineers registration; power/energy specializations align with Vision 2030.',
      },
      skillsFirst: {
        ar: 'شهادات فني أنظمة شمسية وتخزين (التدريب التقني وبرامج المورّدين) للأدوار الميدانية، وشهادات PLC/SCADA وإدارة الطاقة.',
        en: 'Solar PV / storage technician certificates (TVTC and vendor programs) for field roles; PLC/SCADA and energy-management micro-credentials.',
      },
    },
    verdict: {
      ar: 'نعم، خاصة مع التوجه نحو الطاقة: التحول الأخضر من أكبر ثلاثة محركات للوظائف في تقرير المنتدى الاقتصادي العالمي 2025، والسعودية تبني الشبكة المواكبة — فدرجة هذا التخصص تدوم قيمتها.',
      en: 'Yes, especially with a power/energy tilt: the green transition is one of WEF 2025’s three biggest job engines and Saudi Arabia is building the grid to match — a degree here ages well.',
    },
    matching: {
      interestKeys: ['build_tech', 'build_physical'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['structured_classroom', 'apprenticeship'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  // ── DATA & AI ──
  {
    id: 'data_scientist',
    name: { ar: 'عالم بيانات / أخصائي بيانات ضخمة', en: 'Big Data Specialist / Data Scientist' },
    category: 'data_ai',
    signal: 'GROWING',
    evidence: {
      ar: 'أخصائيو البيانات الضخمة هم أسرع مهنة نموًا في العالم (+110%) ومحللو وعلماء البيانات في المرتبة 11 (+40%) وفق تقرير مستقبل الوظائف 2025. ووفق تقرير Coursera 2025: الذكاء الاصطناعي والبيانات الضخمة أولوية لدى 75% من الشركات السعودية.',
      en: 'WEF FoJ 2025: Big Data Specialists are the #1 fastest-growing role globally (+110%); Data Analysts & Scientists #11 (+40%). Coursera GSR 2025: AI/big data is a top employer priority for 75% of Saudi companies.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'الاستعلامات الروتينية ولوحات المتابعة تُؤتمت بالذكاء الاصطناعي التوليدي، لكن صياغة السؤال الصحيح والتحقق من جودة البيانات وترجمة النتائج إلى قرارات تبقى بقيادة بشرية.',
      en: 'Routine querying and dashboarding are being automated by GenAI, but framing the right question, validating data quality and translating findings into decisions remain human-led (ILO 2025: high digitisation raises exposure, yet the occupation is growing net).',
    },
    aiAugmentation: {
      ar: 'النماذج اللغوية تكتب SQL وتنظّف البيانات؛ وتصبح ميزة عالم البيانات في تأطير المشكلة والاستدلال السببي وإيصال عدم اليقين للتنفيذيين.',
      en: "LLMs write SQL and clean data; the scientist's edge becomes problem framing, causal reasoning and communicating uncertainty to executives.",
    },
    keySkills: ['data_literacy', 'ai_use', 'analytical_thinking', 'cloud', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس/ماجستير علوم البيانات أو الإحصاء أو الحاسب؛ وتتوفر برامج متخصصة في الجامعات السعودية.',
        en: 'BSc/MSc in Data Science, Statistics or CS; Saudi universities now offer dedicated data-science programs.',
      },
      skillsFirst: {
        ar: 'شهادة Google لتحليل البيانات (الأكثر انتشارًا في السعودية وفق Coursera 2025)، ومعسكرات أكاديمية سدايا (مجانية للسعوديين)، ومسارات علم البيانات في أكاديمية طويق، مع ملف أعمال عام.',
        en: "Google Data Analytics Certificate (Saudi Arabia's top Professional Certificate per Coursera GSR 2025), SDAIA Academy AI/data bootcamps (free for Saudis), Tuwaiq data-science tracks, plus a public portfolio of analyses.",
      },
    },
    verdict: {
      ar: 'أقوى إشارة في هذه القائمة كلها (المرتبة الأولى عالميًا): يمكن دراسته بالجامعة أو بالمسار المهاري، لكن المعيار يرتفع — فالشركات تدفع مقابل الحكم والتواصل فوق الأدوات، فادمج التدريب التقني مع مجال حقيقي كالصحة أو المال أو الطاقة.',
      en: 'The strongest signal on this entire list (WEF #1): study it via degree or skills-first, but know that the bar is rising — employers pay for judgment and communication on top of tools, so pair technical training with a real domain (health, finance, energy).',
    },
    matching: {
      interestKeys: ['numbers_logic', 'build_tech'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['project_based', 'structured_classroom'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
    relatedRoleId: 'data_scientist',
  },
  {
    id: 'ai_ml_specialist',
    name: { ar: 'أخصائي ذكاء اصطناعي وتعلم آلي', en: 'AI & Machine Learning Specialist' },
    category: 'data_ai',
    signal: 'GROWING',
    evidence: {
      ar: 'ثالث أسرع مهنة نموًا (+85%) وفق تقرير مستقبل الوظائف 2025؛ والذكاء الاصطناعي والبيانات الضخمة هي أسرع مهارة نموًا على الإطلاق. تسجيلات الذكاء الاصطناعي التوليدي +195% عالميًا و+165% في السعودية (Coursera 2025)؛ والمملكة تستثمر بكثافة في توطين الذكاء الاصطناعي.',
      en: 'WEF FoJ 2025: #3 fastest-growing role (+85%); AI/big data is the single fastest-growing skill. Coursera GSR 2025: GenAI enrollments +195% globally, +165% in Saudi Arabia; Saudi investing heavily (Project Transcendence, NEOM AI data center).',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'هؤلاء يبنون الأتمتة ولا يعانون منها؛ فالعمل على النماذج الحدودية والسلامة وحكم النشر يقع بالتعريف على الحافة غير القابلة للأتمتة.',
      en: 'These workers build the automation rather than suffer it; frontier model work, safety and deployment judgment are by definition at the non-automatable edge.',
    },
    aiAugmentation: {
      ar: 'أدوات الذكاء الاصطناعي تسرّع التجريب والأعمال القياسية فترفع إنتاجية كل مختص — ولهذا تنمو المهنة بدل أن تنكمش.',
      en: "AI tools accelerate experimentation and boilerplate, raising each specialist's output — which is why the role grows instead of shrinking.",
    },
    keySkills: ['ai_use', 'emerging_tech', 'analytical_thinking', 'data_literacy', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس علوم حاسب ثم ماجستير ذكاء اصطناعي (كاوست، الفيصل، الملك سعود)؛ والأساس الرياضي المتين هو بوابة الدخول.',
        en: 'BSc CS then MSc AI (KAUST, KFUPM, KSU); strong math foundation is the gate.',
      },
      skillsFirst: {
        ar: 'معسكرات أكاديمية سدايا للذكاء الاصطناعي (مجانية وبالعربية أولًا مع مسارات توظيف حكومية ولدى أرامكو وSTC)، ومسارات الذكاء الاصطناعي في طويق بشراكات مع Meta وStanford، وتخصصات Coursera.',
        en: 'SDAIA Academy AI/ML bootcamps (free, Arabic-first, hiring pipelines into government and Aramco/STC AI teams), Tuwaiq AI tracks with Meta/Stanford partnerships, Coursera GenAI specializations.',
      },
    },
    verdict: {
      ar: 'نعم لمن يمتلك القوة الرياضية: إنها موجة العقد الحاسمة والسعودية تستثمر المليارات لتوطينها — لكن حذّر ابنك أن دورات الذكاء الاصطناعي دون رياضيات ومشاريع تُنتج حاملي شهادات لا مختصين.',
      en: "Yes for the mathematically strong: it is the decade's defining wave and Saudi Arabia is spending billions to localize it — but warn your child that 'AI courses' without math and projects produce certificate-holders, not specialists.",
    },
    matching: {
      interestKeys: ['build_tech', 'numbers_logic'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['project_based', 'structured_classroom'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'data_analyst',
    name: { ar: 'محلل بيانات', en: 'Data Analyst' },
    category: 'data_ai',
    signal: 'GROWING',
    evidence: {
      ar: 'محللو وعلماء البيانات في المرتبة 11 للنمو (+40%) وفق تقرير مستقبل الوظائف 2025؛ والتحليل الإحصائي للبيانات ضمن أسرع 15 مهارة نموًا في LinkedIn 2025؛ وشهادة Google لتحليل البيانات هي الأعلى بين الشهادات المهنية للمتعلمين السعوديين (Coursera 2025).',
      en: "WEF FoJ 2025: Data Analysts & Scientists #11 fastest-growing (+40%); LinkedIn SotR 2025: Statistical Data Analysis among the 15 fastest-growing skills; Coursera GSR 2025: Google Data Analytics is Saudi learners' top Professional Certificate.",
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'إنتاج التقارير والاستعلامات الروتينية في قلب منطقة أتمتة الذكاء الاصطناعي التوليدي، لكن التفسير وأسئلة أصحاب المصلحة والحكم على جودة البيانات تبقي الدور ناميًا.',
      en: "Report generation and routine querying are squarely in GenAI's automation zone (ILO 2025 digitised-occupation exposure), but interpretation, stakeholder questions and data-quality judgment keep the role net-growing.",
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يكتب المسودة الأولى لكل استعلام ورسم؛ والمحللون الباقون هم من يطرحون أسئلة أعمال أفضل ويتحققون من مخرجات الذكاء الاصطناعي.',
      en: 'AI writes the first draft of every query and chart; analysts who survive are those who ask better business questions and validate AI output.',
    },
    keySkills: ['data_literacy', 'ai_use', 'analytical_thinking', 'agile_delivery', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'أي بكالوريوس كمّي (إدارة أعمال، اقتصاد، هندسة، حاسب) مع مقررات تحليلات.',
        en: "Any quant-leaning bachelor's (business, economics, engineering, CS) plus analytics electives.",
      },
      skillsFirst: {
        ar: 'شهادات Google/IBM لتحليل البيانات، ومسارات طويق والأكاديمية السعودية الرقمية، وتدرّج Excel ثم SQL ثم Power BI؛ والدخول واقعي خلال 6–12 شهرًا من الجهد المركز.',
        en: 'Google/IBM Data Analytics certificates (Coursera), Tuwaiq and SDA data tracks, Excel→SQL→Power BI progression; realistic entry in 6–12 months of focused effort.',
      },
    },
    verdict: {
      ar: 'أسهل مهنة مجاورة للتقنية دخولًا في هذه القائمة: طلب حقيقي، ومسار مهاري واقعي خلال 6–12 شهرًا، وكل قطاع سعودي يوظّفها — لكن من يقتصر على بناء التقارير سيعصره الذكاء الاصطناعي، فتطوّر نحو دعم القرار.',
      en: 'The most accessible tech-adjacent career on this list: real demand, a genuine 6–12-month skills-first on-ramp, and every Saudi sector hires it — the caution is that pure report-builders will be squeezed by AI, so grow toward decision support.',
    },
    matching: {
      interestKeys: ['numbers_logic'],
      aptitudeKeys: ['math_strong', 'mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  // ── CYBERSECURITY ──
  {
    id: 'cybersecurity_analyst',
    name: { ar: 'محلل أمن سيبراني', en: 'Cybersecurity / Information Security Analyst' },
    category: 'cybersecurity',
    signal: 'GROWING',
    evidence: {
      ar: 'محللو أمن المعلومات في المرتبة 13 (+40%) وأخصائيو إدارة الأمن في المرتبة 5 (+55%) — دوران أمنيان في قائمة أسرع 15 مهنة وفق تقرير مستقبل الوظائف 2025؛ والشبكات والأمن السيبراني ثاني أسرع مهارة نموًا. تسجيلات الأمن السيبراني السعودية +61% سنويًا (Coursera 2025)؛ ونحو 95% من الشركات السعودية واجهت حوادث سيبرانية في السنة الماضية؛ والنقص العالمي نحو 5 ملايين مختص.',
      en: 'WEF FoJ 2025: Information Security Analysts #13 (+40%) and Security Management Specialists #5 (+55%) — two security roles in the top 15, driven by tech trends + geopolitical fragmentation; networks & cybersecurity is the #2 fastest-growing skill. Coursera GSR 2025: Saudi cybersecurity enrollments +61% YoY; ~95% of Saudi businesses faced cyber incidents in the past year (Coursera 2025 Job Skills Report); global shortfall ~5M cyber professionals.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'عمل عدائي ومتجدد وثقيل المساءلة: المهاجمون يبتكرون يوميًا، فالدفاع يتطلب حكمًا في ظل عدم اليقين — الأتمتة تساعد في الكشف لكنها لا تملك الاستجابة للحوادث.',
      en: 'Adversarial, novel and accountability-heavy work: attackers innovate daily, so defense requires judgment under uncertainty — automation assists detection but cannot own incident response.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يفرز التنبيهات ويصوغ تقارير الحوادث؛ ويركز المحللون على اصطياد التهديدات وقرارات المعمارية والطبقة البشرية والتنظيمية للاختراقات.',
      en: 'AI triages alerts and drafts incident reports; analysts focus on threat hunting, architecture decisions and the human/organizational layer of breaches.',
    },
    keySkills: ['cybersecurity', 'analytical_thinking', 'resilience', 'ai_use', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس أمن سيبراني/علوم حاسب؛ وتتوسع برامج الأمن السيبراني في الجامعات السعودية ضمن منظومة الهيئة الوطنية للأمن السيبراني.',
        en: 'BSc Cybersecurity/CS; Saudi universities expanding cyber programs under the National Cybersecurity Authority ecosystem.',
      },
      skillsFirst: {
        ar: 'معسكر طويق للأمن السيبراني (5 أشهر بشهادات عالمية وتوظيف ~80%)، وشهادة Google للأمن السيبراني (الأعلى في السعودية وفق Coursera 2025)، ثم CompTIA Security+‎ أو CEH.',
        en: "Tuwaiq Cybersecurity Bootcamp (5 months, certified global certificates; ~80% placement via Tuwaiq Job Fair), Google Cybersecurity Certificate (Coursera's top certificate in Saudi per GSR 2025), then CompTIA Security+/CEH.",
      },
    },
    verdict: {
      ar: 'من أوضح إجابات «نعم» في هذه القائمة: دوران أمنيان ضمن أسرع 15 مهنة عالميًا، وموجة حوادث موثقة في السعودية، ومسار معسكرات وطني حقيقي — فالطلب سيفوق العرض لسنوات قادمة.',
      en: "One of the clearest 'yes' answers on this list: two security roles in WEF's global top 15, a documented Saudi incident wave, and a real national bootcamp pipeline — demand exceeds supply for years to come.",
    },
    matching: {
      interestKeys: ['build_tech'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
    relatedRoleId: 'cybersecurity_analyst',
  },
  // ── EDUCATION ──
  {
    id: 'school_teacher',
    name: { ar: 'معلم التعليم العام', en: 'Secondary School Teacher' },
    category: 'education',
    signal: 'GROWING',
    evidence: {
      ar: 'معلمو المرحلة الثانوية ضمن أكبر 15 مهنة نموًا بالأرقام المطلقة وفق تقرير مستقبل الوظائف 2025، مدفوعين بتوسع السكان في سن العمل (يناسب ديموغرافيا السعودية الشابة مباشرة)؛ والتعليم والإرشاد من المهارات الصاعدة في التقرير.',
      en: "WEF FoJ 2025: Secondary Education Teachers are in the top-15 largest-growing jobs in absolute numbers, driven by expanding working-age populations (a direct fit for Saudi Arabia's young demographics); teaching & mentoring is among the report's rising skills.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'إدارة الصف والتحفيز والرعاية وثقة الأهل مهام علاقاتية؛ ويصنف تقرير منظمة العمل الدولية 2025 أدوار التعليم منخفضة التعرض للأتمتة وعالية التحول.',
      en: 'Classroom management, motivation, pastoral care and parent trust are relational tasks; ILO 2025 scores education roles as low automation-exposure and high transformation.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يصوغ خطط الدروس والاختبارات وملاحظات التصحيح، فيحرر وقت المعلم للإرشاد — يصبح الدور أكثر إنسانية لا أقل.',
      en: 'AI drafts lesson plans, quizzes and grading feedback, freeing teacher time for mentorship — the role becomes more human, not less.',
    },
    keySkills: ['empathy_care', 'leadership', 'ai_use', 'creative_thinking', 'resilience'],
    pathways: {
      degree: {
        ar: 'بكالوريوس تربوي أو تخصصي مع مؤهل تعليمي؛ وترخيص وزارة التعليم مطلوب للمدارس الحكومية.',
        en: 'BEd / subject degree + teaching qualification; Ministry of Education licensure required for public schools.',
      },
      skillsFirst: {
        ar: 'شهادات تقنيات التعليم والذكاء الاصطناعي في التعليم والتصميم التعليمي تفتح أبواب المدارس الأهلية وقطاع التدريب.',
        en: 'EdTech, AI-in-education and instructional-design certificates open private-school and training-sector doors; demand for trainers (see Training & Development) is adjacent.',
      },
    },
    verdict: {
      ar: 'خيار متين ومناسب لبلد شاب: الطلب هيكلي وخطر الأتمتة منخفض ومعنى المهنة لا يضاهى — لكن المقايضة هي سقف الرواتب وعبء العمل، فاخترها لشغف لا للاستقرار فقط.',
      en: 'A solid, nation-relevant choice in a young country: demand is structural, automation risk is low, and the job’s meaning is hard to match — the trade-off is salary ceilings and workload, so choose it for calling, not just stability.',
    },
    matching: {
      interestKeys: ['people_care'],
      aptitudeKeys: ['mixed', 'lang_strong'],
      learningStyles: ['structured_classroom', 'apprenticeship'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  {
    id: 'university_lecturer',
    name: { ar: 'أستاذ جامعي', en: 'University & Higher Education Teacher' },
    category: 'education',
    signal: 'GROWING',
    evidence: {
      ar: 'أساتذة الجامعات والتعليم العالي ضمن أكبر 15 مهنة نموًا عالميًا وفق تقرير مستقبل الوظائف 2025؛ فالسكان في سن العمل يغذون مهن التعليم، والسعودية تواصل توسيع طاقتها الجامعية ضمن برنامج تنمية القدرات البشرية.',
      en: 'WEF FoJ 2025: University and Higher Education Teachers are among the top-15 largest-growing roles globally; growing working-age populations fuel education professions, and Saudi Arabia continues expanding university capacity under HCDP.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'الإشراف البحثي وتدريس الندوات والحكم الأكاديمي مهام خبيرة قليلة الروتين؛ والتعرض غالبًا بشكل التعزيز (مراجعة الأدبيات ومسودات التصحيح).',
      en: 'Research supervision, seminar teaching and academic judgment are expert, low-routine tasks; exposure is mostly augmentation (literature review, grading drafts).',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يسرّع مراجعات الأدبيات وصياغة المواد والملاحظات؛ وينتقل الأكاديميون نحو أسئلة البحث والإشراف والتحقق من أعمال الطلاب في عصر الذكاء الاصطناعي.',
      en: 'AI accelerates literature reviews, course-material drafting and feedback; academics shift toward research questions, supervision and verifying AI-era student work.',
    },
    keySkills: ['curiosity_lifelong_learning', 'analytical_thinking', 'leadership', 'ai_use', 'creative_thinking'],
    pathways: {
      degree: {
        ar: 'ماجستير ثم دكتوراه (غالبًا عبر برامج الابتعاث) ثم المسار الأكاديمي؛ مسار طويل بلا اختصارات.',
        en: 'Masters → PhD (often via Saudi scholarship programs abroad) → faculty track; long pipeline, no shortcut.',
      },
      skillsFirst: {
        ar: 'غير منطبق على الوظائف الأكاديمية؛ ويمكن للممارسين دخول التدريس بعقود أستاذ ممارس والتعليم التنفيذي.',
        en: 'Not applicable for faculty posts; industry professionals can enter via teaching-practitioner contracts and executive-education instruction.',
      },
    },
    verdict: {
      ar: 'مناسب للطالب النادر الذي يحب البحث نفسه: المسار يمتد عقدًا وهو تنافسي، لكن الديموغرافيا (تقرير 2025) والتوسع الجامعي السعودي يبقي الطلب حقيقيًا — فلا تدخله كخيار «محترم» افتراضي.',
      en: "Right for the rare student who loves research itself: the path is a decade long and competitive, but demographics (WEF 2025) and Saudi university expansion keep demand real — don't enter it as a default 'respectable' option.",
    },
    matching: {
      interestKeys: ['people_care', 'numbers_logic'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['structured_classroom'],
      minCommitment: 'over_6y',
      degreeCommitment: 'over_6y',
      licenseRequired: true,
    },
  },
  // ── LAW ──
  {
    id: 'lawyer',
    name: { ar: 'المحاماة والاستشارات القانونية', en: 'Lawyer / Legal Counsel' },
    category: 'law',
    signal: 'TRANSFORMING',
    evidence: {
      ar: 'تظهر أدوار الدعم القانوني (الموظفون القانونيون، السكرتارية القانونية) في قائمة أسرع المهن تراجعًا وفق تقرير مستقبل الوظائف 2025، بينما يستمر العمل الاستشاري القائم على الحكم؛ والتوسع في الأنظمة التجارية السعودية (نظام الشركات، التحكيم، قطاعات الترفيه والسياحة) يخلق طلبًا استشاريًا.',
      en: "WEF FoJ 2025: legal support roles (Legal Officials, Legal Secretaries) appear on the fastest-declining list, while advisory judgment work persists; Saudi commercial-law expansion (companies law, arbitration, entertainment/tourism sectors) creates advisory demand.",
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'مراجعة العقود والبحث القانوني مهام نصية روتينية — من أكثر المهام المهنية تعرضًا للذكاء الاصطناعي التوليدي وفق منظمة العمل الدولية 2025؛ بينما يبقى الترافع والتفاوض وإرشاد العملاء بشريًا.',
      en: 'Contract review, discovery and legal research are text-heavy routine tasks — among the most GenAI-exposed professional tasks per ILO 2025; courtroom advocacy, negotiation and client counsel remain human.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي ينجز البحث والصياغة الأولية؛ وينتقل المحامون نحو الاستراتيجية والتفاوض والتحقق من مخرجات الذكاء الاصطناعي — مع مسؤولية مهنية عن الأخطاء.',
      en: 'AI does first-pass research and drafting; lawyers move toward strategy, negotiation and verification of AI output — with professional liability for errors.',
    },
    keySkills: ['analytical_thinking', 'digital_policy', 'resilience', 'leadership', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس أنظمة/قانون + ترخيص المحاماة؛ وتخصصات التحكيم والشركات تضيف قيمة سوقية.',
        en: 'LLB (Sharia & Law / Law) + Saudi Bar licensure; arbitration and corporate specializations add market value.',
      },
      skillsFirst: {
        ar: 'شهادات الامتثال وإدارة العقود والتقنية القانونية كمدخل لأدوار المساعد القانوني والامتثال، وهي تنمو مع أتمتة أعمال السكرتارية القانونية المتراجعة.',
        en: 'Compliance, contract-management and legal-tech certificates as paralegal/compliance entry; growing as WEF-declining legal-secretary work is automated.',
      },
    },
    verdict: {
      ar: 'ادرس القانون للترافع والاستشارة لا للأعمال الورقية: المهنة تنقسم — الإنتاج القانوني الروتيني في قائمة المهن المتراجعة عالميًا، بينما العمل الاستشاري القائم على الحكم ينمو مع توسع القطاعات التجارية السعودية.',
      en: "Study law for advocacy and counsel, not for paperwork: the profession is splitting — routine legal production is on WEF's declining list, while judgment-heavy advisory work grows with Saudi Arabia's expanding commercial sectors.",
    },
    matching: {
      interestKeys: ['persuade_create', 'organize_rule'],
      aptitudeKeys: ['lang_strong'],
      learningStyles: ['structured_classroom'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  {
    id: 'legal_secretary',
    name: { ar: 'السكرتارية القانونية وكتابة العدل', en: 'Legal Secretary / Paralegal Clerk' },
    category: 'law',
    signal: 'DECLINING',
    evidence: {
      ar: 'السكرتارية القانونية والموظفون القانونيون مذكورون صراحةً في قائمة أسرع المهن تراجعًا (المراتب 13–15) في تقرير مستقبل الوظائف 2025.',
      en: "WEF FoJ 2025: Legal Secretaries and Legal Officials are explicitly on the fastest-declining list (ranks 13–15 of declining roles).",
    },
    automationExposure: 'high',
    automationJustification: {
      ar: 'تنسيق الوثائق والأرشفة والنسخ مهام نصية قاعدية — وهي بالضبط ذروة التعرض للذكاء الاصطناعي التوليدي في تقرير منظمة العمل الدولية 2025.',
      en: 'Document formatting, filing and transcription are rule-based text tasks — precisely the GenAI-exposure peak in ILO 2025.',
    },
    aiAugmentation: {
      ar: 'وسادة التعزيز ضئيلة: حزمة المهام الأساسية نفسها هي ما يجيده الذكاء الاصطناعي، فالدور ينكمش ولا يتحول.',
      en: 'Little augmentation cushion: the core task bundle itself is what AI does well, so the role contracts rather than transforms.',
    },
    keySkills: ['digital_policy', 'data_literacy', 'resilience', 'analytical_thinking', 'ai_use'],
    pathways: {
      degree: {
        ar: 'تاريخيًا دخول بالدبلومات؛ والنصيحة الصادقة هي التحول نحو الامتثال أو تقنيات الإدارة القضائية أو درجة القانون الكاملة.',
        en: 'Historically diploma-based entry; the honest advice is to redirect toward compliance, court administration technology, or a full law degree.',
      },
      skillsFirst: {
        ar: 'استخدم الدور كجسر فقط: شهادات التقنية القانونية والتقاضي الإلكتروني مع التأهيل نحو الامتثال.',
        en: 'Use the role as a bridge only: legal-tech and e-litigation certificates plus upskilling into compliance.',
      },
    },
    verdict: {
      ar: 'لا — كهدف مهني تجنّبه: هذا الدور بعينه في قائمة أسرع المهن تراجعًا في تقرير المنتدى الاقتصادي العالمي 2025؛ وإذا جذب المجال القانوني ابنك، فاستهدف نسخة المحاماة أو محلل الامتثال لا النسخة الكتابية.',
      en: "No — as a career goal, avoid: this exact role is on WEF 2025's fastest-declining list; if the legal field attracts your child, aim at the lawyer or compliance-analyst version of it, not the clerical one.",
    },
    matching: {
      interestKeys: ['organize_rule'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y1_3',
      licenseRequired: false,
    },
  },
  // ── ACCOUNTING & FINANCE ──
  {
    id: 'accountant_auditor',
    name: { ar: 'المحاسبة والتدقيق', en: 'Accountant / Auditor' },
    category: 'accounting_finance',
    signal: 'TRANSFORMING',
    evidence: {
      ar: 'يظهر المحاسبون والمدققون ضمن الأكبر تراجعًا بالأرقام المطلقة (أتمتة مسك الدفاتر الروتيني) في تقرير مستقبل الوظائف 2025، لكن نمو القطاع المالي السعودي (رؤية 2030 وتوسع السوق المالية) يبقي الطلب على المحاسبين بالمستوى الاستشاري.',
      en: "WEF FoJ 2025: Accountants & Auditors appear among the largest-declining roles in absolute terms (routine bookkeeping automation), yet Saudi financial-sector growth (Vision 2030, capital-market expansion) keeps demand for advisory-grade accountants.",
    },
    automationExposure: 'high',
    automationJustification: {
      ar: 'ترحيل القيود والمطابقات والرواتب مهام قاعدية نموذجية — تصنفها أطر McKinsey ومنظمة العمل الدولية ضمن أكثر المهام المهنية قابلية للأتمتة؛ ويبقى التدقيق والاستشارة القائمان على الحكم.',
      en: 'Transaction posting, reconciliation and payroll are textbook rule-based tasks — McKinsey/ILO frameworks rate them among the most automatable professional tasks; judgment-based audit and advisory work remain.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يقفل الحسابات ويرصد الشذوذ؛ وتتمركز قيمة المحاسب في حكم المعايير الدولية والرأي المهني والاستشارة الزكوية (عصر الفوترة الإلكترونية) والشراكة في الأعمال.',
      en: "AI closes the books and flags anomalies; the accountant's value concentrates in IFRS judgment, audit opinion, tax advisory (ZATCA e-invoicing era) and business partnering.",
    },
    keySkills: ['analytical_thinking', 'data_literacy', 'ai_use', 'digital_policy', 'resilience'],
    pathways: {
      degree: {
        ar: 'بكالوريوس محاسبة + زمالة الهيئة السعودية للمحاسبين القانونيين، وCPA/CMA للتميز — فالحزمة المهنية أهم من الدرجة وحدها.',
        en: 'BSc Accounting + SOCPA fellowship; CPA/CMA for differentiation — the credential stack matters more than the degree alone.',
      },
      skillsFirst: {
        ar: 'شهادات أنظمة المحاسبة والفوترة الإلكترونية (هيئة الزكاة)، ثم الاختبارات المهنية أثناء العمل.',
        en: 'Bookkeeping software certificates (Zoho/Qoyod ecosystems), ZATCA e-invoicing compliance courses, then professional exams while working.',
      },
    },
    verdict: {
      ar: 'ادرس المحاسبة فقط إذا كان هدفك ما وراء القيود: مسك الدفاتر الروتيني في تراجع عالمي، لكن المدققين والمستشارين الزكويين والمحللين الماليين الذين يتقنون الأنظمة (والذكاء الاصطناعي الذي يطبقها) يبقون نادرين ومطلوبين في القطاع المالي السعودي المتوسع.',
      en: "Study accounting only if aiming beyond the ledger: routine bookkeeping is declining on WEF's list, but auditors, tax advisors and finance analysts who command the rules (and the AI that applies them) stay scarce and well-paid in Saudi Arabia's expanding financial sector.",
    },
    matching: {
      interestKeys: ['numbers_logic', 'organize_rule'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['structured_classroom', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'bookkeeping_clerk',
    name: { ar: 'كاتب محاسبة ومسك دفاتر ورواتب', en: 'Accounting, Bookkeeping & Payroll Clerk' },
    category: 'accounting_finance',
    signal: 'DECLINING',
    evidence: {
      ar: 'كتاب المحاسبة ومسك الدفاتر والرواتب في المرتبة السابعة ضمن أسرع المهن تراجعًا ومن الأكبر تراجعًا بالأرقام المطلقة وفق تقرير مستقبل الوظائف 2025.',
      en: 'WEF FoJ 2025: Accounting, Bookkeeping and Payroll Clerks are #7 on the fastest-declining list and among the largest-declining in absolute numbers.',
    },
    automationExposure: 'high',
    automationJustification: {
      ar: 'يحدد تقرير منظمة العمل الدولية 2025 الأعمال الكتابية كأكثر فئة مهنية تعرضًا للذكاء الاصطناعي التوليدي؛ ومسك الدفاتر فرعها المالي — متكرر وقاعدي ورقمي بطبيعته.',
      en: 'ILO 2025 identifies clerical work as the most GenAI-exposed occupational group; bookkeeping is its finance subset — repetitive, rule-based, digital-native.',
    },
    aiAugmentation: {
      ar: 'ضئيل: حزمة المهام تُمتص كليًا عبر برمجيات المحاسبة والوكلاء الأذكياء بدل إعادة توزيعها على مشغل بشري.',
      en: 'Minimal: the task bundle is being absorbed wholesale by accounting software and AI agents rather than redistributed to a human operator.',
    },
    keySkills: ['data_literacy', 'ai_use', 'analytical_thinking', 'resilience', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'غير موصى به كهدف نهائي؛ تعامل مع أي وظيفة مسك دفاتر كجسر مدفوع نحو التحليل المحاسبي.',
        en: 'Not recommended as a terminal goal; treat any bookkeeping job as a paid stepping stone into accounting analysis.',
      },
      skillsFirst: {
        ar: 'شهادات تحول: تحليل البيانات، أو إدارة أنظمة ERP، أو تخصصات امتثال الفوترة الإلكترونية.',
        en: 'Pivot certificates: data analysis (Google Certificate), ERP administration, or ZATCA compliance specializations.',
      },
    },
    verdict: {
      ar: 'لا كوجهة، ونعم كجسر: هذا الدور من المهن المتراجعة صراحةً في تقرير 2025 — لا بأس بالبدء به أثناء الدراسة، لكن الخطة يجب أن تتضمن خروجًا نحو التحليل أو التدقيق أو الأنظمة خلال سنتين إلى ثلاث.',
      en: "No as a destination, yes as a bridge: this is one of WEF 2025's explicitly declining roles — fine to start there while studying, but the plan must include an exit into analysis, audit or systems within 2–3 years.",
    },
    matching: {
      interestKeys: ['organize_rule'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y1_3',
      licenseRequired: false,
    },
  },
  {
    id: 'fintech_engineer',
    name: { ar: 'مهندس تقنية مالية', en: 'FinTech Engineer / Digital Finance Specialist' },
    category: 'accounting_finance',
    signal: 'GROWING',
    evidence: {
      ar: 'مهندسو التقنية المالية ثاني أسرع مهنة نموًا في العالم (+95%) وفق تقرير مستقبل الوظائف 2025، مدفوعين بالمدفوعات الرقمية والبنوك الرقمية؛ وسعوديًا: دفع البنك المركزي وسدايا للمالية الرقمية والمصرفية المفتوحة وقطاع مدفوعات يتسابق نحو مستهدفات اللانقدية.',
      en: 'WEF FoJ 2025: FinTech Engineers are the #2 fastest-growing role globally (+95%), driven by digital payments and digital-first banking; Saudi: SAMA/SDAIA digital-finance push, open banking and a payments sector racing toward cashless targets.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'يبني الأنظمة المالية المؤتمتة نفسها؛ ويجمع بين معرفة القطاع المنظم والهندسة — وهو ملف هجين تتركه تحليلات المهام في جانب التعزيز غالبًا.',
      en: 'Builds the automated financial systems; combines regulated-domain knowledge with engineering — a hybrid profile that ILO-style task analysis leaves largely augmentation-side.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يسرّع تكرار نماذج الاحتيال والبرمجة؛ ويركز المهندسون على معمارية قنوات الدفع والأمن والملاءمة التنظيمية.',
      en: 'AI accelerates fraud-model iteration and code; engineers focus on payment-rail architecture, security and regulatory fit.',
    },
    keySkills: ['ai_use', 'data_literacy', 'cybersecurity', 'analytical_thinking', 'emerging_tech'],
    pathways: {
      degree: {
        ar: 'بكالوريوس حاسب/مالية ثم مقررات تقنية مالية؛ وتتوفر مسارات تقنية مالية في بعض الجامعات السعودية.',
        en: 'BSc CS/Finance → fintech electives; some Saudi universities now offer fintech tracks.',
      },
      skillsFirst: {
        ar: 'معسكر برمجة (طويق/الأكاديمية السعودية الرقمية) + شهادات مدفوعات/بلوكتشين + هاكاثونات؛ والبنوك وشركات التقنية المالية السعودية توظّف من يُثبت قدرته بالبناء.',
        en: 'Programming bootcamp (Tuwaiq/SDA) + payments/blockchain certificates (Coursera/edX) + hackathons; Saudi banks and fintechs hire demonstrable builders.',
      },
    },
    verdict: {
      ar: 'نعم لمن يجمع بين المال والبرمجة: إنها ثاني أسرع مهنة نموًا عالميًا والسعودية تبني هذا القطاع بعينه — لكن التحذير الصادق أنها تتطلب تعلمًا مستمرًا، فالقواعد والبنية تتغير سنويًا.',
      en: "Yes for a child who likes both money and code: it is WEF's #2 growth role and Saudi Arabia is building exactly this sector — the honest warning is that it demands continuous learning, since the rules and rails change yearly.",
    },
    matching: {
      interestKeys: ['build_tech', 'numbers_logic'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  // ── MEDIA & DESIGN ──
  {
    id: 'graphic_designer',
    name: { ar: 'مصمم الجرافيك التقليدي', en: 'Graphic Designer (Traditional/Production)' },
    category: 'media_design',
    signal: 'DECLINING',
    evidence: {
      ar: 'يظهر مصممو الجرافيك صراحةً في قائمة أسرع المهن تراجعًا (المرتبة 11) وفي قائمة الأكبر تراجعًا بالأرقام المطلقة في تقرير مستقبل الوظائف 2025 — فتوليد الصور بالذكاء الاصطناعي يُذيب الطلب على التصميم الإنتاجي.',
      en: 'WEF FoJ 2025: Graphic Designers appear explicitly on the fastest-declining list (rank 11) and the largest-declining absolute list — GenAI image generation is eroding production-design demand.',
    },
    automationExposure: 'high',
    automationJustification: {
      ar: 'إنتاج التنسيقات وتغيير أحجام الأصول والرسم بأسلوب المخزون هي أرض الذكاء الاصطناعي التوليدي؛ ويضع تقرير منظمة العمل الدولية 2025 المهام الإبداعية المُرقمنة ضمن فئات التعرض الصاعدة.',
      en: 'Layout production, asset resizing and stock-style illustration are generative-AI home turf; ILO 2025 flags highly digitised creative-production tasks among rising-exposure categories.',
    },
    aiAugmentation: {
      ar: 'الباقون يعيدون التموضع: الإخراج الفني واستراتيجية العلامة وفهم العميل تبقى بشرية بينما يولّد الذكاء الاصطناعي البدائل — تنكمش المهنة إلى أكثر أجزائها اعتمادًا على الحكم.',
      en: 'Survivors reposition: art direction, brand strategy and client interpretation stay human while AI generates variants — the job shrinks to its most judgment-heavy slice.',
    },
    keySkills: ['creative_thinking', 'user_centred_design', 'ai_use', 'leadership', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'درجات التصميم تبقى قيّمة إذا علّمت الاستراتيجية والأنظمة لا الأدوات فقط.',
        en: 'Design degrees remain valuable if they teach strategy and systems, not just tools.',
      },
      skillsFirst: {
        ar: 'ملف الأعمال أولًا: معسكرات تجربة المستخدم (طويق لديها مسارات UX/UI)، ودورات استراتيجية العلامة والموشن — أي شيء ينقل العمل نحو القرار لا الإنتاج.',
        en: 'Portfolio-first: UI/UX bootcamps (Tuwaiq runs UX/UI tracks), brand-strategy courses, motion design — anything that moves the work upstream from production.',
      },
    },
    verdict: {
      ar: 'ليس بصورته القديمة: تقرير 2025 يضع تصميم الجرافيك في قائمة التراجع، فلا تختره إلا إذا كان ابنك سيتجه نحو الهوية والعلامة أو تجربة المستخدم أو الإخراج الفني — فالإنتاج التصميمي الخالص هو ما يلتهمه الذكاء الاصطناعي أولًا.',
      en: "Not in its old form: WEF 2025 puts graphic design on the declining list, so only choose this path if your child will push upstream into branding, UX or creative direction — pure production design is the part AI eats first.",
    },
    matching: {
      interestKeys: ['persuade_create'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'ui_ux_designer',
    name: { ar: 'مصمم واجهات وتجربة المستخدم', en: 'UI/UX Designer' },
    category: 'media_design',
    signal: 'GROWING',
    evidence: {
      ar: 'مصممو الواجهات وتجربة المستخدم في المرتبة الثامنة للنمو (+45%) وفق تقرير مستقبل الوظائف 2025 — فالمنافسة على انتباه المستخدمين ترفع قيمة من يصمم التجربة؛ والمهارات المرتكزة على الإنسان صاعدة في LinkedIn 2025؛ والتصميم المتمحور حول الإنسان من أعلى مهارات المتعلمين في المنطقة (Coursera 2025).',
      en: 'WEF FoJ 2025: UI and UX Designers are #8 fastest-growing (+45%) — competition for user attention keeps raising the value of whoever designs the experience; LinkedIn SotR 2025: human-centred skills rising; Coursera GSR 2025: Human-Centered Design among MENA top learner skills.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'الذكاء الاصطناعي يولّد الشاشات، لكن بحث المستخدمين ومفاضلات الرحلات وتصميم التجربة العربية الأصيلة تتطلب عملًا ميدانيًا وحكمًا — ملف ثقيل التعزيز.',
      en: 'AI generates screens, but user research, journey trade-offs and Arabic-first/localized experience design require fieldwork and judgment — augmentation-heavy profile.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يصوغ الإطارات والبدائل؛ وينتقل المصممون نحو البحث والاختبار وأنظمة التصميم وحرفة التجربة ثنائية اللغة التي تجيدها الأدوات العالمية بضعف.',
      en: 'AI drafts wireframes and variants; designers shift to research, testing, design systems and the bilingual (AR/EN) experience craft that global tools do badly.',
    },
    keySkills: ['user_centred_design', 'creative_thinking', 'empathy_care', 'ai_use', 'analytical_thinking'],
    pathways: {
      degree: {
        ar: 'درجات التصميم/تفاعل الإنسان والحاسوب؛ ومقررات تفاعل الإنسان والحاسوب هي الجوهر الذهبي.',
        en: 'Design/HCI/CS-adjacent degrees; human-computer interaction electives are the gold core.',
      },
      skillsFirst: {
        ar: 'معسكرات طويق لتجربة المستخدم، وشهادة Google لتصميم UX، ثم ملف أعمال من 3–5 دراسات حالة تشمل منتجات عربية المنشأ — فملف الأعمال يتفوق على الشهادة هنا.',
        en: 'Tuwaiq UX/UI bootcamps, Google UX Design Certificate, then a portfolio of 3–5 case studies including Arabic-first products — portfolio outweighs credential here.',
      },
    },
    verdict: {
      ar: 'نعم — إنها مهنة التصميم المناسبة لعصر الذكاء الاصطناعي: المرتبة الثامنة في النمو عالميًا، ومنتجات الحكومة الرقمية والتقنية المالية السعودية تحتاج مصممي تجربة ثنائيي اللغة، والعمل يتمحور حول البشر لا البكسلات.',
      en: 'Yes — the design career to choose in the AI era: WEF ranks it #8 growing globally, Saudi digital-government and fintech products need bilingual experience designers, and the work centers on humans rather than pixels.',
    },
    matching: {
      interestKeys: ['persuade_create', 'build_tech'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
    relatedRoleId: 'service_designer',
  },
  // ── MARKETING ──
  {
    id: 'digital_marketing',
    name: { ar: 'أخصائي التسويق الرقمي', en: 'Digital Marketing Specialist' },
    category: 'marketing',
    signal: 'TRANSFORMING',
    evidence: {
      ar: 'تتراجع المبيعات الميدانية والتسويق الهاتفي بينما تقود التجارة الإلكترونية نمو التوصيل وتصميم الواجهات وفق تقرير مستقبل الوظائف 2025 — فطلب التسويق يهاجر للقنوات الرقمية؛ واستراتيجية الوصول للسوق وتحليله من أسرع المهارات نموًا (LinkedIn 2025)؛ وشهادة Meta للتسويق بالتواصل الاجتماعي من أعلى الشهادات في المنطقة (Coursera 2025).',
      en: 'WEF FoJ 2025: door-to-door sales and telemarketing decline while e-commerce drives delivery/UI growth — marketing demand migrates to digital channels; LinkedIn SotR 2025: Go-to-Market Strategy and Market Analysis among fastest-growing skills; Coursera GSR 2025: Meta Social Media Marketing among top MENA certificates.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'شراء الإعلانات واختبارات A/B وصياغة المحتوى تُؤتمت بسرعة؛ أما استراتيجية العلامة والفهم الثقافي (خصوصًا خصوصيات المستهلك السعودي) والإخراج الإبداعي فلا.',
      en: 'Ad-buying, A/B testing and content drafting are being automated fast; brand strategy, cultural insight (especially Saudi consumer nuance) and creative direction are not.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يكتب الإعلانات ويحسّن العروض؛ والمسوقون الناجحون يمتلكون الاستراتيجية والسرد والقياس — ويستطيعون إثبات العائد للإدارة المالية.',
      en: 'AI writes the ads and optimizes bids; marketers who thrive own strategy, narrative and measurement — and can prove ROI to the CFO.',
    },
    keySkills: ['creative_thinking', 'data_literacy', 'ai_use', 'analytical_thinking', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'درجات التسويق وإدارة الأعمال توفر أساسيات الاستراتيجية؛ وادمجها مع مواد التحليلات.',
        en: 'Marketing/business degrees provide strategy fundamentals; pair with analytics minors.',
      },
      skillsFirst: {
        ar: 'شهادات Meta/Google (الأعلى في المنطقة وفق Coursera 2025)، ثم إدارة حملات حقيقية لمنشآت صغيرة كإثبات — فالنتائج الملموسة تتفوق على الشهادات في هذا المجال.',
        en: 'Meta/Google certificates (top in MENA per Coursera GSR 2025), then run real small-business campaigns as proof — demonstrable results beat credentials in this field.',
      },
    },
    verdict: {
      ar: 'خيار جيد إذا — وفقط إذا — كان ابنك يحب البيانات بقدر حبه للإبداع: طبقة التنفيذ في التسويق تُؤتمت بسرعة، فالملاذ الآمن هو الاستراتيجية والتحليلات وفهم المستهلك الخليجي، لا إنتاج المحتوى المتكرر.',
      en: 'Good choice if — and only if — your child loves data as much as creativity: the execution layer of marketing is automating rapidly, so the safe harbor is strategy + analytics + Gulf consumer insight, not content churn.',
    },
    matching: {
      interestKeys: ['persuade_create'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'traditional_sales',
    name: { ar: 'المبيعات الميدانية والتسويق الهاتفي', en: 'Door-to-Door Sales / Telemarketing' },
    category: 'marketing',
    signal: 'DECLINING',
    evidence: {
      ar: 'مندوبو المبيعات الميدانية والباعة الجائلون في المرتبة العاشرة وموظفو التسويق الهاتفي في المرتبة الخامسة عشرة ضمن أسرع المهن تراجعًا في تقرير مستقبل الوظائف 2025.',
      en: 'WEF FoJ 2025: Door-To-Door Sales Workers, News and Street Vendors are #10 and Telemarketers #15 on the fastest-declining list.',
    },
    automationExposure: 'high',
    automationJustification: {
      ar: 'التواصل الممنهج بالسيناريوهات هو بالضبط ما تؤتمته أدوات الصوت الذكية والتجارة الإلكترونية؛ والقناة نفسها تنكمش وليس المهام فقط.',
      en: 'Scripted outreach is precisely what voice AI and e-commerce automate; the channel itself is contracting, not just the tasks.',
    },
    aiAugmentation: {
      ar: 'الوسادة ضئيلة: المستهلكون يتجنبون التواصل غير المطلوب كليًا؛ والنسخة الباقية من البيع هي الاستشارية بين الشركات (مهارة صاعدة في LinkedIn 2025).',
      en: 'Little cushion: consumers route around unsolicited contact entirely; the surviving version of selling is consultative B2B (see Solution-Based Selling, LinkedIn SotR 2025).',
    },
    keySkills: ['leadership', 'resilience', 'empathy_care', 'data_literacy', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'لا توجد درجة ولا حاجة لها؛ ومسار الخروج أهم من الدخول.',
        en: 'No degree exists or is needed; exit ramp matters more than entry.',
      },
      skillsFirst: {
        ar: 'تحوّل نحو المبيعات الاستشارية بين الشركات: شهادات CRM ودورات البيع بالحلول ودبلومات إدارة التجزئة.',
        en: 'Redirect to consultative/B2B sales: CRM certificates, solution-selling courses, retail-management diplomas.',
      },
    },
    verdict: {
      ar: 'ابتعد عنها: هذه المهن حرفيًا في قائمة أسرع المهن تراجعًا — وإذا كان لدى ابنك موهبة الإقناع، فوّجهها نحو المبيعات الاستشارية بين الشركات أو التسويق الرقمي، حيث تتراكم الموهبة نفسها بدل أن تتبخر.',
      en: "Steer away: these are literally on WEF's fastest-declining list — if your child has the gift of persuasion, aim it at B2B consultative sales or digital marketing, where the same talent compounds instead of evaporating.",
    },
    matching: {
      interestKeys: ['persuade_create'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['apprenticeship'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y1_3',
      licenseRequired: false,
    },
  },
  // ── HR ──
  {
    id: 'hr_specialist',
    name: { ar: 'أخصائي الموارد البشرية وإدارة المواهب', en: 'HR / Talent Management Specialist' },
    category: 'hr',
    signal: 'TRANSFORMING',
    evidence: {
      ar: 'التحولات الديموغرافية ترفع الطلب على مهارات إدارة المواهب وفق تقرير مستقبل الوظائف 2025؛ ومديرو الخدمات والإدارة يظهرون في قائمة التراجع (الموارد البشرية الإدارية) بينما تنمو الأدوار الاستراتيجية؛ وحل النزاعات في المرتبة الثانية وإدارة أصحاب المصلحة ضمن أسرع المهارات نموًا في LinkedIn 2025 — وهي صميم حرفة الموارد البشرية.',
      en: 'WEF FoJ 2025: demographic shifts drive rising demand for talent-management skills; Business Services & Administration Managers appear on the largest-declining list (administrative HR), while strategic talent roles grow; LinkedIn SotR 2025: Conflict Mitigation #2 and Stakeholder Management top-15 — core HR crafts.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'الفرز والجدولة وإدارة الرواتب تُؤتمت (65% من مختصي الموارد البشرية يستخدمون فرز الذكاء الاصطناعي بالفعل وفق استطلاعات القطاع)، لكن حكم التوظيف وحل النزاعات وعمل الثقافة مهام علاقاتية.',
      en: "Screening, scheduling and payroll admin are automating (65% of HR professionals already use AI screening per industry surveys), but hiring judgment, conflict resolution and culture work are relational.",
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يفرز السير الذاتية ويجيب عن أسئلة السياسات؛ وينتقل مختصو الموارد البشرية نحو استراتيجية المواهب وتصميم القوى العاملة المهارية واللحظات الإنسانية التي لا تُفوَّض (النزاع، التوجيه، إنهاء الخدمة).',
      en: "AI screens CVs and answers policy FAQs; HR professionals move to talent strategy, skills-based workforce design and the human moments (conflict, coaching, termination) that can't be delegated.",
    },
    keySkills: ['empathy_care', 'leadership', 'data_literacy', 'ai_use', 'digital_policy'],
    pathways: {
      degree: {
        ar: 'بكالوريوس إدارة أعمال/موارد بشرية؛ وشهادات SHRM/HRCI يطلبها أصحاب العمل السعوديون بشكل متزايد.',
        en: 'BBA/HRM; SHRM/HRCI certifications increasingly requested by Saudi employers.',
      },
      skillsFirst: {
        ar: 'شهادات تحليلات الموارد البشرية، وأنظمة HRIS، وشهادات CIPD للممارسين.',
        en: 'People-analytics certificates (Coursera), HRIS systems (SAP SuccessFactors), CIPD level 3–5 for practitioners.',
      },
    },
    verdict: {
      ar: 'اختر النسخة الاستراتيجية لا الإدارية: الموارد البشرية الورقية في تراجع (تقرير 2025)، لكن المنظمات تحتاج بشدة من يصمم التوظيف المهاري ويعالج النزاعات — وهي حرفة إنسانية صاعدة بحق.',
      en: "Choose the strategic version, not the administrative one: paperwork-HR is declining (WEF 2025), but organizations badly need people who can design skills-based hiring and handle conflict — a genuinely rising human craft.",
    },
    matching: {
      interestKeys: ['people_care', 'organize_rule'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['structured_classroom', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'training_development',
    name: { ar: 'أخصائي التدريب والتطوير', en: 'Training & Development Specialist' },
    category: 'hr',
    signal: 'GROWING',
    evidence: {
      ar: '59 من كل 100 عامل يحتاجون تدريبًا بحلول 2030 و77% من أصحاب العمل يخططون لإعادة تأهيل موظفيهم للذكاء الاصطناعي والتعليم والإرشاد مهارة صاعدة — كلها تشير إلى طلب على التدريب والتطوير وفق تقرير مستقبل الوظائف 2025؛ وسعوديًا: 82% من المنظمات ملتزمة بالتأهيل واسع النطاق (Coursera 2025).',
      en: 'WEF FoJ 2025: 59 of every 100 workers need training by 2030, 77% of employers plan to reskill staff for AI, and teaching/mentoring is a rising skill — all pointing at L&D demand; Saudi: 82% of Saudi organizations committed to large-scale upskilling (Coursera GSR 2025).',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'التيسير والتوجيه والتحفيز عمل علاقاتي حي؛ إنتاج المحتوى يُؤتمت، أما التقديم وتغيير السلوك فلا.',
      en: "Facilitation, coaching and motivation are live relational work; content production automates, delivery and behavior change don't.",
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يصوغ المناهج ويخصص مسارات التعلم؛ ويصبح المدربون مصممي تجارب ومستشاري قدرات يُقاسون بالنتائج لا بالشرائح.',
      en: 'AI drafts curricula and personalizes learning paths; trainers become experience designers and capability consultants measured on outcomes, not slides.',
    },
    keySkills: ['leadership', 'empathy_care', 'ai_use', 'creative_thinking', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'درجات التعليم/الموارد البشرية/علم النفس؛ وماجستير التصميم التعليمي للأدوار القيادية.',
        en: 'Education/HR/psychology degrees; instructional-design masters for senior roles.',
      },
      skillsFirst: {
        ar: 'شهادات التصميم التعليمي وأدوات الذكاء الاصطناعي، وممارسة التيسير عبر حلقات التعلم المجتمعية، واعتمادات ATD/CIPT.',
        en: 'Instructional design + AI-tools certificates, facilitation practice via community learning circles, ATD/CIPT credentials.',
      },
    },
    verdict: {
      ar: 'فائز غير مقدّر: موجة إعادة التأهيل العالمية كلها (59 من كل 100 عامل يحتاجون تدريبًا) تحتاج من يصممها ويقدمها، والمنظمات السعودية ترصد لها الميزانيات — مثالية لمن يمتلك موهبة التبسيط والشرح.',
      en: 'An underrated winner: the entire global reskilling wave (WEF: 59/100 workers need training) has to be designed and delivered by someone, and Saudi organizations are budgeting for it — ideal for a natural explainer.',
    },
    matching: {
      interestKeys: ['people_care', 'persuade_create'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['project_based', 'structured_classroom'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  // ── LOGISTICS ──
  {
    id: 'supply_chain_specialist',
    name: { ar: 'أخصائي سلاسل الإمداد واللوجستيات', en: 'Supply Chain & Logistics Specialist' },
    category: 'logistics',
    signal: 'GROWING',
    evidence: {
      ar: 'ترفع التجارة الإلكترونية والتفتت الجيو-اقتصادي أدوار اللوجستيات وفق تقرير مستقبل الوظائف 2025 (سائقو التوصيل ضمن أسرع 10 نموًا)؛ وسعوديًا: تضع رؤية 2030 المملكة كمركز لوجستي عالمي (موانئ وسكك ومناطق اقتصادية خاصة).',
      en: 'WEF FoJ 2025: e-commerce and geo-economic fragmentation lift logistics roles (delivery drivers top-10 fastest-growing; light-truck/delivery among largest-growing); Saudi: Vision 2030 positions the Kingdom as a global logistics hub (ports, rail, special economic zones).',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'روبوتات المستودعات وتحسين المسارات تؤتمت المهام الفرعية الجسدية والخوارزمية، لكن إدارة الاستثناءات والتفاوض مع الموردين والاستجابة للأزمات تبقى بشرية — مع ملاحظة أن منظمة العمل الدولية تُنذر بمخاطر على مهام التخطيط الروتينية لمديري اللوجستيات بحلول 2030.',
      en: 'Warehouse robotics and route optimization automate physical/algorithmic sub-tasks, but exception management, supplier negotiation and disruption response stay human — note ILO-flagged risk for routine logistics-manager planning tasks by 2030.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يتنبأ بالطلب ويحسّن المسارات؛ ويتولى المختصون الموردين وتعقيدات الجمارك وأزمة الأسبوع التي لم يتوقعها أي نموذج.',
      en: 'AI forecasts demand and optimizes routes; specialists handle suppliers, customs complexity and the weekly crisis that no model predicted.',
    },
    keySkills: ['analytical_thinking', 'data_literacy', 'resilience', 'ai_use', 'agile_delivery'],
    pathways: {
      degree: {
        ar: 'درجات الهندسة الصناعية/اللوجستيات؛ وبرامج سعودية متنامية مرتبطة باستراتيجية المركز اللوجستي.',
        en: 'Industrial engineering/logistics degrees; growing Saudi programs tied to the logistics-hub strategy.',
      },
      skillsFirst: {
        ar: 'شهادات APICS/ASCM العالمية (CPIM, CSCP)؛ وأدوار عمليات التجارة الإلكترونية كمدخل.',
        en: 'APICS/ASCM (CPIM, CSCP) certificates are the global standard; e-commerce operations roles as entry.',
      },
    },
    verdict: {
      ar: 'خيار سعودي ممتاز بهدوء: استراتيجية المركز اللوجستي رهان وطني، والتجارة الإلكترونية تبقي القطاع ناميًا (تقرير 2025)، والعمل يمزج البيانات بحل المشكلات الواقعية — أقل بريقًا وأكثر ديمومة.',
      en: "A quietly excellent Saudi choice: the Kingdom's logistics-hub strategy is a national bet, e-commerce keeps the sector growing (WEF 2025), and the work blends data with real-world problem-solving — less glamorous, more durable.",
    },
    matching: {
      interestKeys: ['organize_rule', 'numbers_logic'],
      aptitudeKeys: ['math_strong', 'mixed'],
      learningStyles: ['project_based', 'structured_classroom'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'delivery_driver',
    name: { ar: 'سائق توصيل', en: 'Light Truck / Delivery Services Driver' },
    category: 'logistics',
    signal: 'GROWING',
    evidence: {
      ar: 'سائقو الشاحنات الخفيفة وخدمات التوصيل في المرتبة التاسعة للنمو (+45%) والثانية بالأرقام المطلقة في تقرير مستقبل الوظائف 2025، مدفوعين بالتجارة الإلكترونية.',
      en: 'WEF FoJ 2025: Light Truck or Delivery Services Drivers are #9 fastest-growing (+45%) and #2 largest-growing in absolute numbers, powered by e-commerce.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'المركبات ذاتية القيادة تهدد المسافات الطويلة أولًا؛ والتوصيل الأخير في بيئات حضرية غير منظمة يُؤتمت ببطء — لكن التقرير نفسه يضع أخصائيي المركبات ذاتية القيادة في المرتبة السابعة للنمو، فعقارب الساعة بعيدة المدى حقيقية.',
      en: 'Autonomous vehicles threaten long-haul first; last-mile delivery in unstructured urban environments automates slowly — but WEF also lists Autonomous & Electric Vehicle Specialists at #7 growing, so the long-term clock is real.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي لتحسين المسارات يرفع عدد التوصيلات في الوردية؛ فالدخل القريب يرتفع، ومصير الدور بعد 2030 غير مؤكد.',
      en: 'Route-optimization AI raises deliveries per shift; near-term income rises, long-term role uncertain past 2030.',
    },
    keySkills: ['resilience', 'agile_delivery', 'data_literacy', 'curiosity_lifelong_learning', 'empathy_care'],
    pathways: {
      degree: {
        ar: 'غير مطلوبة.',
        en: 'Not required.',
      },
      skillsFirst: {
        ar: 'رخصة قيادة + الانضمام لمنصات التوصيل؛ وتُعامل كمصدر دخل أثناء التأهيل نحو تنسيق اللوجستيات.',
        en: 'Driving license + logistics-platform onboarding; treat as income while upskilling into logistics coordination.',
      },
    },
    verdict: {
      ar: 'الإجابة الصادقة: وظيفة جيدة الآن ومهنة مخاطرة بحلول 2035 — الطلب مزدهر فعلًا (المرتبة التاسعة عالميًا)، لكنها أيضًا المهنة التي تُبنى المركبات ذاتية القيادة لتحل محلها، فاجعلها منصة انطلاق لا وجهة نهائية.',
      en: "Honest answer: good job now, risky career by 2035 — demand is genuinely booming (WEF #9), but it's also the occupation autonomous vehicles are being built to replace, so use it as a launchpad, not a destination.",
    },
    matching: {
      interestKeys: ['build_physical'],
      aptitudeKeys: ['practical'],
      learningStyles: ['apprenticeship'],
      minCommitment: 'under_1y',
      degreeCommitment: 'under_1y',
      licenseRequired: false,
    },
  },
  // ── SKILLED TRADES ──
  {
    id: 'electrician',
    name: { ar: 'الكهربائي (مهنة حرفية)', en: 'Electrician (Skilled Trade)' },
    category: 'skilled_trades',
    signal: 'GROWING',
    evidence: {
      ar: 'الحرف الإنشائية والخط الأمامي بين الأكبر نموًا بالأرقام المطلقة في تقرير مستقبل الوظائف 2025؛ وخط الإنشاءات السعودي (2.6 مليون وحدة سكنية والمشاريع العملاقة) مع فجوة متوقعة بنحو 663 ألفًا في العمالة الماهرة بحلول 2030؛ والأدوار اليدوية هي الأقل تعرضًا للذكاء الاصطناعي على الإطلاق (منظمة العمل الدولية 2025).',
      en: 'WEF FoJ 2025: construction/frontline trades are among the largest-growing absolute roles; Saudi construction pipeline (2.6M housing units, giga-projects) plus a projected ~663,000 skilled-workforce gap by 2030; ILO 2025: manual/physical roles are the least GenAI-exposed of all.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'لا يوجد مبنيان متماثلان في التمديدات: التشخيص والتركيب في مساحات مادية غير منظمة هو النموذج القياسي للمهام منخفضة الأتمتة (توافق منظمة العمل الدولية وMcKinsey).',
      en: 'No two buildings are wired the same: diagnosis and installation in unstructured physical spaces is the canonical low-automation profile (ILO/McKinsey agree).',
    },
    aiAugmentation: {
      ar: 'العدادات الذكية وتطبيقات التشخيص تسرّع كشف الأعطال، لكن الأيدي والمساءلة المرخّصة تبقى بشرية — والطلب يرتفع مع عصر الكهرباء (المركبات الكهربائية والطاقة الشمسية والمباني الذكية).',
      en: 'Smart-meters and diagnostic apps speed fault-finding, but the hands and the licensed accountability stay human — demand rises with electrification (EVs, solar, smart buildings).',
    },
    keySkills: ['resilience', 'analytical_thinking', 'emerging_tech', 'curiosity_lifelong_learning', 'empathy_care'],
    pathways: {
      degree: {
        ar: 'غير مطلوبة؛ فكليات ودبلومات المؤسسة العامة للتدريب التقني والمهني هي الطريق المعترف به.',
        en: 'Not needed; TVTC technical colleges and vocational diplomas are the recognized route.',
      },
      skillsFirst: {
        ar: 'برامج التدريب التقني الكهربائية + اعتماد مقاولي الشركة السعودية للكهرباء؛ وتخصصات الطاقة الشمسية وشحن المركبات الكهربائية تدر أجورًا أعلى.',
        en: 'TVTC electrical programs + Saudi Electricity Company contractor certification; solar/EV-charging specializations command premiums.',
      },
    },
    verdict: {
      ar: 'خيار مُستهان به بجدية: خطر أتمتة منخفض، وفجوة وطنية موثقة في العمالة الماهرة، وعصر الكهرباء يضمن عقودًا من العمل — والوصمة الاجتماعية هي التكلفة الحقيقية الوحيدة، وهي تبتعد أكثر فأكثر عن واقع الأجور.',
      en: "Seriously underrated: low automation risk, a documented national skilled-labor gap, and electrification guarantees decades of work — the social stigma is the only real cost, and it's increasingly out of step with the paychecks.",
    },
    matching: {
      interestKeys: ['build_physical'],
      aptitudeKeys: ['practical', 'math_strong'],
      learningStyles: ['apprenticeship'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y1_3',
      licenseRequired: false,
    },
  },
  {
    id: 'renewable_energy_technician',
    name: { ar: 'فني طاقة شمسية وطاقة متجددة', en: 'Solar PV / Renewable Energy Technician' },
    category: 'skilled_trades',
    signal: 'GROWING',
    evidence: {
      ar: 'مهندسو الطاقة المتجددة في المرتبة 15 للنمو (+40%) وتوليد الطاقة وتخزينها من أكبر ثلاثة محركات كلية في تقرير مستقبل الوظائف 2025؛ وعالميًا تتصدر أدوار تركيب الأنظمة الشمسية قوائم النمو الوطنية؛ وسعوديًا: مستهدفات الطاقة المتجددة ومشاريع شمسية ضخمة ضمن رؤية 2030.',
      en: 'WEF FoJ 2025: Renewable Energy Engineers #15 fastest-growing (+40%), energy generation/storage a top-3 macro driver; globally, wind-turbine and solar-installer roles top national percent-growth charts; Saudi: renewables targets and utility-scale solar buildout under Vision 2030.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'التركيب على الأسطح وفي الميدان ضمن ظروف مادية متغيرة — وهو النموذج المدرسي للمهام صعبة الأتمتة (منظمة العمل الدولية 2025).',
      en: 'Rooftop and field installation in variable physical conditions — the textbook hard-to-automate task set (ILO 2025).',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يصمم النظام الشمسي ويراقب الأداء؛ والبشر ما يزالون يثبتونه على السطح ويعتمدونه ويصونونه في حرارة الصحراء.',
      en: 'AI designs the array and monitors performance; humans still bolt it to the roof, certify it and maintain it in the desert heat.',
    },
    keySkills: ['emerging_tech', 'resilience', 'analytical_thinking', 'curiosity_lifelong_learning', 'data_literacy'],
    pathways: {
      degree: {
        ar: 'اختيارية: درجات الهندسة الكهربائية/الطاقة تقود لمسار المهندس (المرتبة 15 عالميًا).',
        en: 'Optional: electrical/energy engineering degrees lead to engineer-track roles (WEF #15).',
      },
      skillsFirst: {
        ar: 'برامج الطاقة المتجددة في التدريب التقني، وشهادات المورّدين (العواكس والتخزين)، واعتمادات تركيب على نمط NABCEP.',
        en: 'TVTC renewable-energy programs, vendor certifications (inverter/storage manufacturers), NABCEP-style installer credentials.',
      },
    },
    verdict: {
      ar: 'مهنة مقاومة للمستقبل في العقد الأخضر: تقع في تقاطع محرك النمو للتحول الأخضر عالميًا مع خطط الطاقة الشمسية السعودية الضخمة — قوية لمن يتعلم باليدين ويريد النمو دون شهادة جامعية.',
      en: "A future-proof trade for the green decade: it sits at the intersection of WEF's green-transition growth engine and Saudi gigawatt-scale solar plans — strong for hands-on learners who want growth without a degree.",
    },
    matching: {
      interestKeys: ['build_physical', 'build_tech'],
      aptitudeKeys: ['practical'],
      learningStyles: ['apprenticeship', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'renewable_energy_engineer',
    name: { ar: 'مهندس طاقة متجددة وبيئة', en: 'Renewable Energy / Environmental Engineer' },
    category: 'engineering_tech',
    signal: 'GROWING',
    evidence: {
      ar: 'مهندسو الطاقة المتجددة في المرتبة 15 (+40%) ومهندسو البيئة في المرتبة 12 (+40%) ضمن أسرع المهن نموًا في تقرير مستقبل الوظائف 2025 — فالتحول الأخضر من أكبر ثلاثة محركات لسوق العمل في التقرير.',
      en: "WEF FoJ 2025: Renewable Energy Engineers #15 (+40%) and Environmental Engineers #12 (+40%) on the fastest-growing list — the green transition is one of the report's three biggest labour-market engines.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'هندسة مشاريع في مواقع وسياقات تنظيمية جديدة؛ وتحافظ تقييمات منظمة العمل الدولية وMcKinsey على الهندسة الميدانية المرخّصة ضمن منخفضة التعرض.',
      en: 'Project engineering in novel sites and regulatory contexts; ILO/McKinsey scoring keeps licensed field engineering low-exposure.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يحسّن نماذج الإنتاجية وتقييمات الأثر البيئي؛ ويملك المهندسون قرارات الموقع والتصاريح وملفات السلامة.',
      en: 'AI optimizes yield models and environmental impact assessments; engineers own siting decisions, permits and safety cases.',
    },
    keySkills: ['emerging_tech', 'analytical_thinking', 'data_literacy', 'resilience', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة كهربائية/ميكانيكية/بيئية + ماجستير أو شهادات طاقة.',
        en: 'BSc Electrical/Mechanical/Environmental Engineering + energy masters or certificates.',
      },
      skillsFirst: {
        ar: 'تراكم فوق أساس هندسي: برمجيات تصميم الأنظمة الشمسية، وشهادات المحاسبة الكربونية وتقارير الاستدامة.',
        en: 'Stack onto an engineering base: solar design software (PVsyst), carbon-accounting and ESG-reporting certificates.',
      },
    },
    verdict: {
      ar: 'نعم لمن يميل للهندسة: اثنان من أسرع 15 مهنة نموًا في العالم يقعان في هذا النطاق، وتحول الطاقة في رؤية 2030 يجعله أولوية وطنية — المسار الجامعي مطلوب هنا، وهو يستحق.',
      en: "Yes for the engineering-minded: two of WEF's top-15 growing roles live in this niche, and Saudi Vision 2030's energy transition makes it a national priority — the degree route is required, and it's worth it.",
    },
    matching: {
      interestKeys: ['build_tech', 'numbers_logic'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['structured_classroom'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  // ── GOVERNMENT & ADMINISTRATION ──
  {
    id: 'government_admin_officer',
    name: { ar: 'الموظف الإداري الحكومي / أخصائي الحكومة الرقمية', en: 'Government Administrative Officer / Digital Government Specialist' },
    category: 'government',
    signal: 'TRANSFORMING',
    evidence: {
      ar: 'أدوار المساعدين الإداريين والكتابية هي الأسرع تراجعًا عالميًا وفق تقرير مستقبل الوظائف 2025؛ وسعوديًا: بيانات البنك الدولي والموارد البشرية تُظهر تحول التوظيف الجديد نحو القطاع الخاص (حصة 52.8%) — لكن برنامج الحكومة الرقمية السعودي (من الرواد عالميًا في تصنيف الأمم المتحدة) يخلق أدوارًا رقمية جديدة داخل الحكومة.',
      en: "WEF FoJ 2025: administrative-assistant and clerical roles decline fastest globally; Saudi: World Bank/HRSD data shows new Saudi employment shifting to the private sector (52.8% share) — but the Kingdom's digital-government program (a global leader in UN e-government rankings) creates new digital-service roles inside government.",
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'معالجة الأوراق الروتينية هي أعلى مناطق التعرض لدى منظمة العمل الدولية؛ أما عمل السياسات وتصميم الخدمات الموجهة للمواطنين وتسليم التحول الرقمي فأقل تعرضًا بكثير.',
      en: "Pure paperwork processing is the ILO's highest-exposure zone; policy work, citizen-facing service design and digital-transformation delivery are far less exposed.",
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يصوغ المراسلات ويؤتمت الاعتمادات؛ والدور الحكومي الباقي هو مصمم الخدمة الرقمية وأمين البيانات ومنفذ السياسات.',
      en: 'AI drafts correspondence and automates approvals; the surviving government role is the digital-service designer, data steward and policy implementer.',
    },
    keySkills: ['digital_policy', 'agile_delivery', 'data_literacy', 'ai_use', 'empathy_care'],
    pathways: {
      degree: {
        ar: 'درجات الإدارة العامة/الأنظمة/إدارة الأعمال لدخول الخدمة المدنية.',
        en: 'Public administration/law/business degrees for civil-service entry.',
      },
      skillsFirst: {
        ar: 'شهادات الحكومة الرقمية وتصميم الخدمات، واعتمادات التسليم الرشيق، وشهادات محو أمية البيانات — وهي حزمة المهارات ذاتها التي تقدمها هذه المنصة.',
        en: 'Digital-government and service-design certificates, agile delivery (Scrum) credentials, data-literacy micro-credentials — the DGA-style skill set this platform teaches.',
      },
    },
    verdict: {
      ar: 'لا تستهدف المكتب الحكومي بصورة 2010: الإدارة الروتينية تتراجع عالميًا (تقرير 2025) والتوظيف السعودي يميل نحو القطاع الخاص — لكن تحول الحكومة الرقمية هو الاستثناء، فادخل من بوابة المهارات الرقمية لا عبر انتظار منصب كتابي.',
      en: "Don't aim for the government desk of 2010: routine administration is declining worldwide (WEF 2025) and Saudi hiring is tilting private — but digital-government transformation is the exception, so enter through digital skills, not through a queue for a clerical post.",
    },
    matching: {
      interestKeys: ['organize_rule'],
      aptitudeKeys: ['mixed', 'lang_strong'],
      learningStyles: ['structured_classroom', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
    relatedRoleId: 'digital_policy_advisor',
  },
  {
    id: 'data_entry_clerk',
    name: { ar: 'مدخل بيانات', en: 'Data Entry Clerk' },
    category: 'government',
    signal: 'DECLINING',
    evidence: {
      ar: 'موظفو إدخال البيانات في المرتبة الثالثة ضمن أسرع المهن تراجعًا وفق تقرير مستقبل الوظائف 2025؛ والأعمال الكتابية هي أكثر فئة مهنية تعرضًا للذكاء الاصطناعي التوليدي (24% من مهامها عالية التعرض و58% متوسطة) وفق منظمة العمل الدولية 2025.',
      en: 'WEF FoJ 2025: Data Entry Clerks are #3 on the fastest-declining list; ILO 2025: clerical work is the single most GenAI-exposed occupational group (24% of tasks highly exposed, 58% medium).',
    },
    automationExposure: 'high',
    automationJustification: {
      ar: 'حزمة مهام هذا الدور كاملة — النسخ والتحقق وأرشفة المعلومات المنظمة — هي ما تؤديه أدوات OCR والنماذج اللغوية أصيلًا؛ وهو حالة الأتمتة القياسية في كل دراسة كبرى.',
      en: "This role's entire task bundle — transcribing, validating, filing structured information — is what OCR + LLMs now do natively; it is the canonical automation case in every major study.",
    },
    aiAugmentation: {
      ar: 'لا شيء يُذكر: الدور يُمتص ولا يُعزز.',
      en: 'None to speak of: the role is absorbed, not augmented.',
    },
    keySkills: ['data_literacy', 'ai_use', 'analytical_thinking', 'curiosity_lifelong_learning', 'resilience'],
    pathways: {
      degree: {
        ar: 'لا تتطلب شهادة — ولا يُنصح بأي مسار نحو هذا الدور.',
        en: 'None required — and none recommended toward this role.',
      },
      skillsFirst: {
        ar: 'تحول فوري: شهادات تحليل البيانات (6 أشهر) تحوّل القرب نفسه من البيانات إلى مهنة نامية (المرتبة 11 عالميًا).',
        en: 'Immediate pivot: data-analysis certificates (6 months) convert the same keyboard proximity into a growing role (WEF #11).',
      },
    },
    verdict: {
      ar: 'الإجابة الواضحة للأهل: لا — فهذه من أسرع الوظائف اختفاءً في العالم (المرتبة الثالثة في التراجع عالميًا وأعلى فئات التعرض للذكاء الاصطناعي)، وأرقى نصيحة هي التحول خلال 6 أشهر نحو تحليل البيانات بينما لا تزال المهارات قابلة للنقل.',
      en: "Plain answer to parents: no — this is one of the fastest-disappearing jobs on Earth (WEF #3 declining, ILO's highest-exposure group), and the kindest advice is a 6-month pivot into data analysis while the keyboard skills still transfer.",
    },
    matching: {
      interestKeys: ['organize_rule'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y1_3',
      licenseRequired: false,
    },
  },
]

export const careerById = (id: string): Career | undefined => careers.find((c) => c.id === id)
