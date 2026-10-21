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

/**
 * Qualitative exposure indicator — displays as a three-band bar ONLY.
 * No percentage is shown: the bands are an editorial summary of the
 * evidence text, not a measured quantity (per expert-review P0-2/P1-6).
 */
export const exposureMeta: Record<Exposure, { name: L; pct: number; color: string }> = {
  low: { name: { ar: 'تعرّض منخفض', en: 'Low exposure' }, pct: 33, color: '#1B8354' },
  medium: { name: { ar: 'تعرّض متوسط', en: 'Medium exposure' }, pct: 66, color: '#8A6A00' },
  high: { name: { ar: 'تعرّض مرتفع', en: 'High exposure' }, pct: 100, color: '#B42318' },
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
  { id: 'tourism_hospitality', name: { ar: 'السياحة والضيافة', en: 'Tourism & Hospitality' } },
  { id: 'entertainment_events', name: { ar: 'الترفيه والفعاليات', en: 'Entertainment & Events' } },
  { id: 'aviation', name: { ar: 'الطيران', en: 'Aviation' } },
  { id: 'sports', name: { ar: 'الرياضة', en: 'Sports' } },
  { id: 'gaming_esports', name: { ar: 'الألعاب والرياضات الإلكترونية', en: 'Gaming & Esports' } },
  { id: 'culture_heritage', name: { ar: 'الثقافة والتراث', en: 'Culture & Heritage' } },
  { id: 'mining', name: { ar: 'التعدين', en: 'Mining' } },
  { id: 'environment_water', name: { ar: 'المياه والبيئة', en: 'Water & Environment' } },
  { id: 'agritech', name: { ar: 'التقنيات الزراعية', en: 'AgriTech' } },
  { id: 'maritime', name: { ar: 'القطاع البحري', en: 'Maritime' } },
  { id: 'real_estate_municipal', name: { ar: 'العقار والشؤون البلدية', en: 'Real Estate & Municipal' } },
  { id: 'space_satellite', name: { ar: 'الفضاء والأقمار الصناعية', en: 'Space & Satellites' } },
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
  // v5 network-map mapping (documented editorial choice):
  // transversal human skills are hosted by the closest radar domain —
  // judgment/leadership skills → leadership; creative/care skills → service-design.
  analytical_thinking: { name: { ar: 'التفكير التحليلي', en: 'Analytical thinking' }, domainId: 'leadership' },
  creative_thinking: { name: { ar: 'التفكير الإبداعي', en: 'Creative thinking' }, domainId: 'service-design' },
  resilience: { name: { ar: 'المرونة والقدرة على التكيف', en: 'Resilience & adaptability' }, domainId: 'leadership' },
  curiosity_lifelong_learning: { name: { ar: 'الفضول والتعلم مدى الحياة', en: 'Curiosity & lifelong learning' }, domainId: 'leadership' },
  leadership: { name: { ar: 'القيادة والتأثير الاجتماعي', en: 'Leadership & social influence' }, domainId: 'leadership' },
  empathy_care: { name: { ar: 'التعاطف والرعاية', en: 'Empathy & care' }, domainId: 'service-design' },
}

/**
 * Edge-emission policy for the interactive map (v5 refinement, tuned):
 * only MEANINGFUL specialist connections emit edges — rank-windowed:
 *  - ai-data: only when a data/AI skill is the career's FIRST key skill
 *    (data/AI literacy is otherwise near-universal and swamps the map).
 *  - other specialist domains: when the skill is among the career's
 *    top-3 specialist key skills.
 *  - leadership: only when transversal `leadership` is a TOP-2 key skill
 *    (no career lists the specialist `digital_leadership` key).
 *  - service-design: also emitted when creative_thinking or empathy_care
 *    is a TOP-2 key skill (care/design-dominant careers).
 * Transversal human skills otherwise emit no edges — they are universal,
 * and that is the honest answer. Their `domainId` above is retained purely
 * as a display/semantic home (skill chips in career cards), not for edges.
 * Resulting linked-career shares (50 careers): ai-data 20% · cyber 6% ·
 * cloud 4% · service-design 28% · policy 20% · agile 14% · emerging 30% ·
 * leadership 18%. Edge width = number of the career's key skills hitting
 * that domain.
 */
export const TRANSVERSAL_SKILLS = new Set([
  'analytical_thinking',
  'creative_thinking',
  'resilience',
  'curiosity_lifelong_learning',
  'leadership',
  'empathy_care',
])

export function careerDomainWeights(c: Career): Map<string, number> {
  const m = new Map<string, number>()
  const spec = c.keySkills.filter((k) => !TRANSVERSAL_SKILLS.has(k))

  // ai-data: only when data/AI is the career's defining (first) key skill
  if (spec.length > 0 && (spec[0] === 'data_literacy' || spec[0] === 'ai_use') && c.keySkills[0] === spec[0]) {
    m.set('ai-data', 1 + spec.slice(1, 3).filter((k) => k === 'data_literacy' || k === 'ai_use').length)
  }
  // other specialist domains: top-3 specialist skills
  for (const k of spec.slice(0, 3)) {
    const d = skillVocab[k]?.domainId
    if (d && d !== 'ai-data') m.set(d, (m.get(d) ?? 0) + 1)
  }
  // leadership exception: top-2 weighted transversal leadership → one edge
  if (c.keySkills.slice(0, 2).includes('leadership')) {
    m.set('leadership', 1)
  }
  // service-design exception: care/creative-dominant careers
  if (c.keySkills.slice(0, 2).some((k) => k === 'creative_thinking' || k === 'empathy_care')) {
    m.set('service-design', 1)
  }
  return m
}

/**
 * v6-A4: per-career target profiles for the assessment's target polygon.
 * Documented rule (deterministic, no generic fallback):
 *  - baseline 2 in every domain;
 *  - 3 in each domain linked by the career's specialist key skills;
 *  - 4 in the career's defining domain (its first key skill's home);
 *  - 3 in leadership when leadership is a top-2 key skill;
 *  - careers with a direct role-library counterpart keep that role's targets.
 */
export function careerTargetsFor(c: Career): Record<string, number> {
  const t: Record<string, number> = {
    'ai-data': 2, cyber: 2, cloud: 2, 'service-design': 2, policy: 2, agile: 2, emerging: 2, leadership: 2,
  }
  const w = careerDomainWeights(c)
  w.forEach((_, d) => { t[d] = 3 })
  const firstSpec = c.keySkills.map((k) => skillVocab[k]?.domainId).find(Boolean)
  if (firstSpec) t[firstSpec] = Math.max(t[firstSpec], 3)
  if (c.keySkills.slice(0, 2).includes('leadership')) t['leadership'] = 3
  if (c.matching.licenseRequired) t['policy'] = Math.max(t['policy'], 2)
  return t
}

/** Careers touching a given radar domain through their key skills. */
export function careersForDomain(domainId: string): Career[] {
  return careers.filter((c) => careerDomainWeights(c).has(domainId))
}

export const careers: Career[] = [
  // ── HEALTHCARE ──
  {
    id: 'general_medicine',
    name: { ar: 'الطب العام', en: 'General Medicine (Physician)' },
    category: 'healthcare',
    signal: 'GROWING',
    evidence: {
      ar: 'عالميًا: توسّع وظائف الرعاية الصحية مع شيخوخة السكان وفق تقرير مستقبل الوظائف 2025 (التمريض والرعاية الشخصية والعمل الاجتماعي بين الأكبر نموًا بالأرقام المطلقة). وسعوديًا — حيث المجتمع شاب — المحرك الأول للطلب هو التوسع في القطاع الصحي والتوطين ضمن تحول القطاع، لا الشيخوخة.',
      en: 'WEF FoJ 2025: aging populations drive healthcare demand globally — care-economy roles (nursing, personal care, social work) among largest-growing in absolute terms. In Saudi Arabia — a young society — the primary driver is health-sector expansion and localization under Vision 2030, not aging.',
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
      ar: 'نعم، إذا كان لدى ابنك المعدل والصبر والرغبة الحقيقية: الطلب على الطب مدعوم ديموغرافيًا ومؤسسيًا، وتعرضه للأتمتة منخفض في التقديرات الحالية — لكنه أطول مسار في هذه القائمة وأكثرها تطلبًا، لذا يجب أن يكون القرار قرار الطالب نفسه.',
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
        ar: 'معسكرات أكاديمية طويق (12–16 أسبوعًا؛ وتفيد الأكاديمية بتوظيف نحو 80% من خريجيها عبر معرضها للتوظيف)، والأكاديمية السعودية الرقمية، وشهادات Google/IBM على Coursera مع ملف أعمال عام على GitHub؛ وارتفعت تسجيلات الذكاء الاصطناعي التوليدي في السعودية 165% سنويًا وفق تقرير Coursera 2025.',
        en: "Tuwaiq Academy bootcamps (12–16 weeks; the academy reports ~80% graduate placement via its job fair), Saudi Digital Academy, Google/IBM certificates on Coursera + a public GitHub portfolio; Saudi GenAI enrollments +165% YoY show the market's direction (Coursera GSR 2025).",
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
      ar: 'وظائف البناء والخط الأمامي بين الأكبر نموًا بالأرقام المطلقة وفق تقرير مستقبل الوظائف 2025؛ وسعوديًا: حزمة مشاريع رؤية 2030 — حتى بعد إعادة تحجيم بعضها الموثق صحفيًا (كخفض المرحلة الأولى من ذا لاين من 170 كم إلى نحو 2.4 كم وفق تقارير 2025) — تُبقي الطلب على مهندسي الإنشاءات كبيرًا هذا العقد.',
      en: "WEF FoJ 2025: construction/frontline roles are among the largest-growing in absolute terms; Saudi-specific: the Vision 2030 project pipeline — even after the documented rescoping of some giga-projects (e.g., The Line's first phase reduced from 170km to ~2.4km per 2025 press reports) — keeps construction-engineering demand substantial this decade.",
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
      ar: 'خيار قوي بخصوصية سعودية: الاتجاهات العالمية مستقرة، لكن خط مشاريع المملكة يرفع الطلب المحلي بشكل ملموس هذا العقد — اختره إذا كان ابنك يتحمل العمل الميداني ويريد بناء أشياء ملموسة.',
      en: 'A strong Saudi-specific choice: global trends are steady, but the Kingdom’s construction pipeline lifts local demand materially this decade — choose it if your child tolerates field work and wants to build visible things.',
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
      ar: 'محللو أمن المعلومات في المرتبة 13 (+40%) وأخصائيو إدارة الأمن في المرتبة 5 (+55%) — دوران أمنيان في قائمة أسرع 15 مهنة وفق تقرير مستقبل الوظائف 2025؛ والشبكات والأمن السيبراني ثاني أسرع مهارة نموًا. تسجيلات الأمن السيبراني السعودية +61% سنويًا (Coursera 2025)؛ وتفيد Coursera (استطلاع ذاتي الإبلاغ، 2025) بأن نحو 95% من الشركات السعودية المشاركة واجهت حوادث سيبرانية في السنة الماضية؛ وتقدّر ISC2 النقص العالمي بنحو 5 ملايين مختص.',
      en: 'WEF FoJ 2025: Information Security Analysts #13 (+40%) and Security Management Specialists #5 (+55%) — two security roles in the top 15, driven by tech trends + geopolitical fragmentation; networks & cybersecurity is the #2 fastest-growing skill. Coursera GSR 2025: Saudi cybersecurity enrollments +61% YoY; ~95% of surveyed Saudi businesses reported cyber incidents in the past year (Coursera self-reported survey, 2025); ISC2 estimates a global shortfall of ~5M cyber professionals.',
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
        ar: 'معسكر طويق للأمن السيبراني (5 أشهر بشهادات عالمية؛ وتفيد الأكاديمية بتوظيف نحو 80% من خريجيها)، وشهادة Google للأمن السيبراني (الأعلى في السعودية وفق Coursera 2025)، ثم CompTIA Security+‎ أو CEH.',
        en: "Tuwaiq Cybersecurity Bootcamp (5 months, certified global certificates; the academy reports ~80% placement via its job fair), Google Cybersecurity Certificate (Coursera's top certificate in Saudi per GSR 2025), then CompTIA Security+/CEH.",
      },
    },
    verdict: {
      ar: 'من أقوى الإشارات الداعمة في هذه القائمة: دوران أمنيان ضمن أسرع 15 مهنة عالميًا، وموجة حوادث موثقة في السعودية، ومسار معسكرات وطني حقيقي — فالطلب سيفوق العرض لسنوات قادمة.',
      en: "One of the strongest supporting signals on this list: two security roles in WEF's global top 15, a documented Saudi incident wave, and a real national bootcamp pipeline — demand exceeds supply for years to come.",
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
      ar: 'الحرف الإنشائية والخط الأمامي بين الأكبر نموًا بالأرقام المطلقة في تقرير مستقبل الوظائف 2025؛ وخط الإنشاءات السعودي ومشاريعه الكبرى يرفعان الطلب على العمالة الماهرة هذا العقد؛ والأدوار اليدوية هي الأقل تعرضًا للذكاء الاصطناعي وفق منظمة العمل الدولية 2025.',
      en: 'WEF FoJ 2025: construction/frontline trades are among the largest-growing absolute roles; Saudi giga-project and housing programs drive strong expected demand for skilled trades this decade; ILO 2025: manual/physical roles are the least GenAI-exposed of all.',
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
        ar: 'المسار الأول والمعترف به: دبلوم الكلية التقنية (المؤسسة العامة للتدريب التقني والمهني TVTC) — سنتان بمكافأة تدريبية — ثم اعتماد مقاولي الشركة السعودية للكهرباء؛ ومعاهد الشراكات الاستراتيجية توظف خريجيها شبه مباشرة، وتخصصات الطاقة الشمسية وشحن المركبات تدر أجورًا أعلى.',
        en: 'The first recognized route: a TVTC technical-college diploma (2 years with a training stipend), then Saudi Electricity Company contractor certification; strategic-partnership institutes place graduates almost directly, and solar/EV-charging specializations command premiums.',
      },
    },
    verdict: {
      ar: 'خيار مُستهان به بجدية: خطر أتمتة منخفض، وفجوة وطنية موثقة في العمالة الماهرة، وعصر الكهرباء يرجّح طلبًا طويل الأمد — والوصمة الاجتماعية هي التكلفة الحقيقية الوحيدة، وهي تبتعد أكثر فأكثر عن واقع الأجور.',
      en: "Seriously underrated: low automation risk, a documented national skilled-labor gap, and electrification points to long-run demand — the social stigma is the only real cost, and it's increasingly out of step with the paychecks.",
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
        ar: 'المسار الأول: برامج الطاقة المتجددة في كليات التدريب التقني (TVTC) ومعاهد الشراكات الوطنية، ثم شهادات المورّدين (العواكس والتخزين) واعتمادات التركيب على نمط NABCEP.',
        en: 'The first route: TVTC renewable-energy programs and national partnership institutes, then vendor certifications (inverters/storage) and NABCEP-style installer credentials.',
      },
    },
    verdict: {
      ar: 'مهنة قوية المؤشرات في العقد الأخضر: تقع في تقاطع محرك النمو للتحول الأخضر عالميًا مع خطط الطاقة الشمسية السعودية الضخمة — قوية لمن يتعلم باليدين ويريد النمو دون شهادة جامعية.',
      en: "A trade with strong indicators for the green decade: it sits at the intersection of WEF's green-transition growth engine and Saudi gigawatt-scale solar plans — strong for hands-on learners who want growth without a degree.",
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
  // ══ v4 expansion — 20 careers (Vision 2030 sectors) ══
  {
    id: 'tour_guide',
    name: { ar: 'مرشد سياحي وأخصائي تجربة زائر', en: 'Tour Guide & Visitor Experience Specialist' },
    category: 'tourism_hospitality',
    signal: 'GROWING',
    evidence: {
      ar: 'رفعت السعودية مستهدفها السياحي إلى 150 مليون زيارة بحلول 2030 بعد تجاوز 100 مليون زيارة في 2023 — قبل الموعد بسبع سنوات — وتُرخّص المرشدين السياحيين عبر وزارة السياحة؛ ويضع تقرير مستقبل الوظائف 2025 الأدوار الخدمية والخط الأمامي ضمن الأكبر نموًا بالأرقام المطلقة. والمسار المهني يمتد: مرشد ثم مصمم تجارب ثم مدير وجهة في المشاريع الكبرى (العلا، البحر الأحمر، الدرعية).',
      en: 'Saudi Arabia raised its tourism target to 150M visits by 2030 after crossing 100M visits in 2023 — seven years ahead of schedule — and licenses tour guides nationally through the Ministry of Tourism; WEF FoJ 2025 places service and frontline roles among the largest-growing in absolute numbers. Career progression runs guide → experience designer → destination manager at the giga-projects (AlUla, Red Sea, Diriyah).',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'السرد الحي والحكم على السلامة في الموقع ودفء الاستضافة مهام علاقاتية وميدانية في بيئات غير منظمة — وهو النمط الأقل قابلية للأتمتة وفق منظمة العمل الدولية 2025؛ والذكاء الاصطناعي التوليدي يؤتمت صياغة البرامج والترجمة لا التجربة الإرشادية ذاتها.',
      en: 'Live storytelling, safety judgment on-site and hosting warmth are relational/physical tasks in unstructured environments — the least automatable profile per ILO 2025; GenAI automates itinerary drafting and translation but not the guided experience itself.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يتولى الترجمة وتوليد البرامج والبحث التمهيدي؛ وتتركز قيمة المرشد في السرد وإدارة المجموعات والتفسير الثقافي الذي لا تستضيفه الآلة.',
      en: "AI handles translation, itinerary generation and background research (live translation earpieces are already in the market); the guide's value concentrates in storytelling, crowd management and cultural interpretation that machines cannot host.",
    },
    keySkills: ['empathy_care', 'leadership', 'resilience', 'ai_use', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس سياحة/ضيافة أو تاريخ/آثار (تتوفر مسارات سياحية في الجامعات السعودية) ثم ترخيص الإرشاد من وزارة السياحة؛ وأدوار إدارة الوجهات تتوقع الدرجة مع خبرة ميدانية.',
        en: 'BA in tourism/hospitality or history/archaeology (Saudi universities offer tourism tracks), then Ministry of Tourism guide licensing; destination-management roles typically expect the degree plus experience.',
      },
      skillsFirst: {
        ar: 'برامج «رواد السياحة» التدريبية من وزارة السياحة، ودبلومات السياحة والضيافة في التدريب التقني (TVTC)، وشهادات اللغات — دخول مرخّص واقعي خلال أشهر ثم بناء نحو تصميم التجارب.',
        en: "Ministry of Tourism 'Tourism Trailblazers' (رواد السياحة) training programs, TVTC tourism & hospitality diplomas, language certificates — a realistic licensed entry within months, then build toward experience design.",
      },
    },
    verdict: {
      ar: 'مهنة سعودية جديدة بمعنى الكلمة لا مهنة قديمة: محرك الطلب وطني (مستهدف 150 مليون زيارة والمشاريع الكبرى)، والترخيص سريع، وخطر الأتمتة منخفض — والملاحظة الصادقة هي الموسمية وتذبذب الدخل المبكر، فادمجها مع اللغات والتسويق الرقمي.',
      en: 'A genuine new Saudi profession, not a legacy one: the demand driver is national (150M-visit target and giga-projects), the license is fast, and automation risk is low — the honest caveat is seasonality and early-career income variability, so pair it with languages and digital marketing.',
    },
    matching: {
      interestKeys: ['people_care', 'persuade_create'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['apprenticeship', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'under_1y',
      licenseRequired: true,
    },
  },
  {
    id: 'event_manager',
    name: { ar: 'مدير فعاليات وترفيه', en: 'Events & Entertainment Manager' },
    category: 'entertainment_events',
    signal: 'GROWING',
    evidence: {
      ar: 'الهيئة العامة للترفيه ترخّص تقويم فعاليات وطنيًا على مدار العام (موسم الرياض ومواسم أخرى استقطبت عشرات ملايين الزيارات)، ويستهدف برنامج جودة الحياة مضاعفة إنفاق الأسرة على الترفيه؛ ويصنّف تقرير مستقبل الوظائف 2025 أدوار الخدمات والخط الأمامي ضمن الأكبر نموًا. وتوظّف الوجهات السعودية (بوليفارد، موسم جدة، لحظات العلا) منتجي فعاليات ومديري سلامة حشود وتشغيل عروض على نطاق واسع.',
      en: 'The General Entertainment Authority (GEA) has licensed a year-round national events calendar (Riyadh Season and sister seasons drawing tens of millions of visits), and the Quality of Life Program targets doubling household entertainment spend; WEF FoJ 2025 counts frontline and service-economy roles among the largest absolute growers. Saudi venues (Boulevard, Jeddah Season, AlUla Moments) hire event producers, crowd-safety managers and show operations staff at scale.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'التخطيط والميزانيات ومحتوى التسويق مهام مكتبية معرضة للذكاء الاصطناعي التوليدي، لكن قيادة الفعالية الحية — سلامة الحشود والتعامل مع الفنانين وإدارة العرض تحت الضغط — تحدث في مواقع مادية يكون فيها الفشل فوريًا وعلنيًا.',
      en: 'Planning, budgeting and marketing content are GenAI-exposed desk tasks, but live-event command — crowd safety, artist handling, show-calling under pressure — happens in physical venues where failure is immediate and public.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يصوغ الجداول التشغيلية والميزانيات والنصوص الترويجية ويشغّل تحليلات تدفق الحشود؛ وتنتقل ميزة المدير إلى التفاوض والحكم على المخاطر وقرارات اللحظة الحية التي لا تتولاها أداة.',
      en: "AI drafts run-sheets, budgets and promo copy, and powers crowd-flow analytics; the manager's edge shifts to negotiation, risk judgment and the live-moment decisions no tool can own.",
    },
    keySkills: ['leadership', 'resilience', 'creative_thinking', 'ai_use', 'empathy_care'],
    pathways: {
      degree: {
        ar: 'بكالوريوس إدارة فعاليات أو ضيافة أو تسويق (برامج فعاليات وضيافة قائمة في الجامعات والكليات الأهلية)؛ والأدوار القيادية في الوجهات والمهرجانات تتوقع درجة مع ملف إنتاج.',
        en: 'BA in event management, hospitality or marketing (Saudi universities and private colleges now run events/hospitality programs); senior venue and festival roles expect a degree plus a production portfolio.',
      },
      skillsFirst: {
        ar: 'برامج تدريبية تابعة لمنظومة الترفيه وتلمذة موسمية في الوجهات، ودبلومات ضيافة من التدريب التقني، وشهادات إدارة مشاريع (CAPM) — والدخول عبر فرق التشغيل والتنظيم هو المعتاد في هذا القطاع الفتي.',
        en: 'GEA-affiliated training programs and seasonal venue apprenticeships, TVTC hospitality diplomas, project-management certificates (CAPM) — entry via crew and promoter roles is the norm in this young sector.',
      },
    },
    verdict: {
      ar: 'طلب حقيقي في قطاع بُني من الصفر تقريبًا منذ 2018 — لكنه عمل موسمي كثيف المناوبات تكون فيه السمعة هي العملة؛ اختره لمن يملك القدرة على التحمل والمهارات الإنسانية، وراكم شهادات الإنتاج مبكرًا.',
      en: 'Real demand in a sector Saudi Arabia built from near-zero since 2018 — but it is event-driven, shift-heavy work where reputation is currency; choose it for stamina and people skills, and stack production credentials early.',
    },
    matching: {
      interestKeys: ['organize_rule', 'persuade_create'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['project_based', 'apprenticeship'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'commercial_pilot',
    name: { ar: 'طيار تجاري (ومسار الملاحة الجوية)', en: 'Commercial Pilot (and Air Navigation Track)' },
    category: 'aviation',
    signal: 'GROWING',
    evidence: {
      ar: 'تستهدف الاستراتيجية الوطنية للطيران 330 مليون مسافر وأكثر من 250 وجهة بحلول 2030، مع بدء طيران الرياض لعملياته وتوسع أساطيل مجموعة السعودية وطيران ناس وطيران أديل؛ ويقدّر تقرير Boeing 2025 للطيارين والفنيين حاجة عالمية إلى 674 ألف طيار جديد خلال 20 سنة، والشرق الأوسط من أسرع مناطق نمو الأساطيل. ويتوسع التوظيف الموازي في المراقبة الجوية مع تحديث الملاحة الجوية في الهيئة العامة للطيران المدني.',
      en: "The National Aviation Strategy targets 330M passengers and 250+ destinations by 2030, with Riyadh Air launching operations and Saudia Group/flynas/flyadeal expanding fleets; Boeing's 2025 Pilot & Technician Outlook projects 674,000 new commercial pilots needed globally over 20 years, with the Middle East among the fastest fleet-growth regions. Adjacent air-traffic-control hiring expands in parallel under GACA's air-navigation modernization.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'أتمتة قمرة القيادة قائمة منذ عقود، لكن قواعد الترخيص والمساءلة عن السلامة والحكم في الحالات غير الطارئة تُبقي طاقم الطيارين المعيار العالمي؛ وتصنف تحليلات منظمة العمل الدولية الطيارين ضمن الأقل تعرضًا للذكاء الاصطناعي التوليدي. والضغط الأكبر من أبحاث الطيران بطيار واحد — وهو تغيير بعيد المدى ومقيّد تنظيميًا.',
      en: 'Cockpit automation is decades old, yet certification rules, safety accountability and abnormal-situation judgment keep two-pilot crews the global standard; ILO-style analysis scores pilots among the least GenAI-exposed professionals. The bigger pressure is robotic/single-pilot research — a long-horizon, regulator-gated change.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يدعم تخطيط الرحلات وتحسين الوقود والصيانة التنبؤية؛ ويحصل الطيارون على أدوات دعم قرار بينما تُبقي جهات الترخيص سلطة القيادة البشرية دون تغيير.',
      en: 'AI supports flight planning, fuel optimization and predictive maintenance; pilots gain decision-support tools, while licensing authorities require human command authority unchanged.',
    },
    keySkills: ['resilience', 'analytical_thinking', 'leadership', 'emerging_tech', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'درجة علوم طيران أو مسار أكاديمية طيران نحو رخصة طيار تجاري (CPL) ثم تأهيل على نوع الطائرة؛ ومن الخيارات السعودية أكاديمية أوكسفورد السعودية (الدمام) والأكاديمية السعودية للطيران المدني وبرامج كاديت الشركات (طيران الرياض، طيران ناس). أما مراقبو الحركة الجوية فيتبعون أكاديمية الهيئة العامة للطيران المدني وترخيصها.',
        en: 'Aviation-science degree or flight academy route to a Commercial Pilot License (CPL), then type rating; Saudi options include OxfordSaudia Flight Academy (Dammam), the Saudi Academy of Civil Aviation, and airline cadet programs (Riyadh Air, flynas cadet schemes). Air traffic controllers follow GACA’s own academy and licensing.',
      },
      skillsFirst: {
        ar: 'لا يوجد طريق مختصر غير مرخّص لقمرة القيادة (مهنة منظمة)؛ والبناء التراكمي للساعات عبر الأكاديميات هو أسرع مسار قانوني — نحو 18–24 شهرًا من التدريب المكثف حتى الرخصة التجارية قبل اختبارات شركات الطيران.',
        en: 'No unlicensed shortcut exists for the cockpit (regulated profession); modular hour-building via academies is the fastest legal route — roughly 18–24 months of intensive training to CPL before airline selection.',
      },
    },
    verdict: {
      ar: 'نعم لمن يجتاز الفحص الطبي وتكلفة التدريب: توسع الأساطيل الوطني مع نقص عالمي موثق في الطيارين يجعل الطلب متينًا حتى ما بعد 2030 — لكنه استثمار مقدم مرتفع مع توظيف دوري، فاحرص على رعاية كاديت إن أمكن.',
      en: 'Yes for those who pass the medical and the training cost: national fleet expansion plus a documented global pilot shortage make demand durable through 2030+ — but it is a high upfront investment with cyclical hiring, so secure a cadet sponsorship if possible.',
    },
    matching: {
      interestKeys: ['build_tech'],
      aptitudeKeys: ['math_strong', 'mixed'],
      learningStyles: ['structured_classroom', 'apprenticeship'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  {
    id: 'sports_coach',
    name: { ar: 'مدرب رياضي ومدير عمليات رياضية', en: 'Sports Coach & Sports Operations Manager' },
    category: 'sports',
    signal: 'GROWING',
    evidence: {
      ar: 'التوسع الرياضي السعودي هيكلي: خصخصة الأندية المدعومة من صندوق الاستثمارات (انتقال أربعة أندية كبرى في 2023)، واستضافة مؤكدة لكأس العالم 2034 وكأس آسيا 2027، ومستهدفات مشاركة جماهيرية ضمن برنامج جودة الحياة؛ ويصنف تقرير مستقبل الوظائف 2025 أدوار التنمية البشرية ضمن النامية، وتحليلات التدريب تخصص صاعد. ويمتد توظيف الإدارة الرياضية عبر الاتحادات والأندية والأكاديميات (أكاديمية مهد) ومشغلي الفعاليات.',
      en: "Saudi Arabia's sports build-out is structural: PIF-backed club privatization (four major clubs transferred in 2023), confirmed hosting of the 2034 FIFA World Cup and 2027 AFC Asian Cup, and mass-participation targets under the Quality of Life Program; WEF FoJ 2025 lists care/education-adjacent human-development roles among growers, and coaching analytics is a rising specialization. Sports management hiring spans federations, clubs, academies (Mahd Sports Academy) and event operators.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'التدريب مهنة علاقاتية وجسدية — التحفيز وتصحيح الأداء ورعاية اللاعب — وتصنفها أطر منظمة العمل الدولية وMcKinsey منخفضة التعرض؛ وبيانات الأجهزة القابلة للارتداء وتحليل الفيديو تعزز التدريب لكنها لا تقدّمه.',
      en: 'Coaching is relational and physical — motivation, technique correction, athlete welfare — scored low-exposure across ILO/McKinsey task frameworks; wearable data and video analysis augment but cannot deliver coaching.',
    },
    aiAugmentation: {
      ar: 'تحليل الفيديو بالذكاء الاصطناعي ومراقبة الأحمال البدنية ولوحات الكشافة أصبحت عدة قياسية في الأندية المحترفة؛ والمدربون القادرون على قراءة البيانات يكسبون المنافسة، لكن العلاقة الإنسانية تبقى هي المنتج.',
      en: 'AI video analysis, load monitoring and scouting dashboards are now standard kit in professional clubs; coaches who read data win selection battles, but the human relationship remains the product.',
    },
    keySkills: ['leadership', 'empathy_care', 'resilience', 'data_literacy', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس تربية بدنية/علوم رياضة (الجامعات السعودية) ثم رخص التدريب الاتحادية (كدورات الاتحاد السعودي المعتمدة آسيويًا) بالتدرج C ثم B ثم A؛ وماجستير إدارة رياضية لأدوار العمليات.',
        en: 'BSc physical education/sports science (Saudi universities), then federation coaching licenses (e.g., Saudi Arabian Football Federation AFC-licensed courses) up the C→B→A ladder; sports-management masters for operations roles.',
      },
      skillsFirst: {
        ar: 'شهادات تدريب القواعد من الاتحادات، ودورات التحكيم وتشغيل الفعاليات الرياضية، وشهادات الإعداد البدني؛ وأدوار مساعد مدرب في الأكاديميات (مهد وأكاديميات الأندية) كتلمذة مدفوعة.',
        en: 'Federation grassroots coaching certificates, refereeing and sports-event operations courses, strength-and-conditioning credentials; academy assistant-coach roles (Mahd, club academies) as paid apprenticeships.',
      },
    },
    verdict: {
      ar: 'مهنة حقيقية الآن لا مسار هواية: التحضير لكأس العالم 2034 يضمن عقدًا من التوظيف — لكن دخل التدريب هرمي الشكل (قلة في القمة)، فاجعل الدرجة ومهارات التحليلات شبكة أمانك.',
      en: 'A real profession now, not a hobby track: World Cup 2034 preparation guarantees a decade of hiring — but coaching income is pyramid-shaped (few at the top), so treat the degree plus analytics skills as your safety net.',
    },
    matching: {
      interestKeys: ['people_care', 'build_physical'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['apprenticeship'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'game_designer',
    name: { ar: 'مصمم ومطور ألعاب / منتج رياضات إلكترونية', en: 'Game Designer / Esports Producer' },
    category: 'gaming_esports',
    signal: 'GROWING',
    evidence: {
      ar: 'تستهدف الاستراتيجية الوطنية للألعاب والرياضات الإلكترونية 39 ألف وظيفة و250 شركة ألعاب بمساهمة 50 مليار ريال في الناتج بحلول 2030؛ وبرنامج استثمارات مجموعة سافي البالغ 37.8 مليار دولار (سكوبلي، ESL/FACEIT، وحدة ألعاب Niantic في 2025، وMoonton في 2026) مع كأس العالم للرياضات الإلكترونية في الرياض يبني قاعدة طلب محلية على المصممين ومصممي الأنظمة والمراحل ومنتجي الرياضات الإلكترونية لم تكن موجودة إقليميًا من قبل.',
      en: "The National Gaming & Esports Strategy targets 39,000 jobs and 250 gaming companies contributing SAR 50B to GDP by 2030; Savvy Games Group's $37.8B investment program (Scopely, ESL/FACEIT, Niantic's games unit 2025, Moonton 2026) plus the Riyadh-hosted Esports World Cup build a local demand base for designers, level/system designers and esports producers that did not previously exist in the region.",
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'صياغة الأصول ونصوص التعريب وسكربتات اختبار الجودة أصبحت مسنودة بالذكاء الاصطناعي التوليدي (منظمة العمل الدولية: المهام الرقمية الإبداعية من الأكثر تعرضًا)، لكن تصميم الأنظمة وموازنة الاقتصاد داخل اللعبة وحكم العمليات الحية يقرر نجاح اللعبة — فالاستوديوهات تواصل توظيف المصممين بينما تؤتمت أعمال الإنتاج الروتينية.',
      en: 'Asset drafting, localization text and QA scripting are already GenAI-assisted (ILO: creative-digital tasks are among the most exposed), but system design, economy balancing and live-ops judgment decide whether a game succeeds — studios keep hiring designers while automating production chores.',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي التوليدي يسرّع النماذج الأولية ومسودات السرد وأتمتة الاختبار؛ وتنتقل ميزة المصمم إلى الذوق والتفكير النظمي وفهم سيكولوجية اللاعب — وملف النماذج المنشورة يتفوق على الشهادات.',
      en: "GenAI accelerates prototyping, narrative drafts and test automation; the designer's edge moves to taste, systems thinking and player-psychology judgment — portfolio of shipped prototypes beats certificates.",
    },
    keySkills: ['creative_thinking', 'analytical_thinking', 'ai_use', 'emerging_tech', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس علوم حاسب/برمجيات أو برامج تصميم ألعاب (تضيفها الجامعات السعودية تباعًا)؛ ودرجات الرسوم والتحريك لأدوار المحتوى — مع ملف أعمال على محرك (Unity/Unreal).',
        en: 'BSc CS/software or game-design programs (Saudi universities adding game tracks); art/animation degrees for content roles — pair with an engine portfolio (Unity/Unreal).',
      },
      skillsFirst: {
        ar: 'مسارات تطوير الألعاب في أكاديمية طويق، وبرامج وزارة الاتصالات لصناعة الألعاب، وشهادات Unity/Unreal الرسمية، ومسابقات جيم جام المفتوحة؛ وتوفر منظومة سافي/ستير ستوديوز وكأس العالم للرياضات الإلكترونية تدريبًا محليًا.',
        en: 'Tuwaiq Academy game-development tracks, MCIT game-industry programs, Unity/Unreal official certifications, and open game jams; Savvy/Steer Studios and the Esports World Cup ecosystem create local internships.',
      },
    },
    verdict: {
      ar: 'نعم بانضباط: السعودية من الدول القليلة التي تمول صناعة ألعاب بمستوى وطني، لكن التوظيف العالمي في الألعاب يقوده ملف الأعمال ويتسم بالدورية — انشر ألعابًا صغيرة مبكرًا واعتبر إنتاج الرياضات الإلكترونية سلمًا موازيًا.',
      en: 'Yes with discipline: Saudi Arabia is one of the few countries funding a games industry at national scale, but global game-dev hiring is portfolio-driven and cyclical — ship small games early and treat esports production as a parallel ladder.',
    },
    matching: {
      interestKeys: ['build_tech', 'persuade_create'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'under_1y',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'museum_heritage_specialist',
    name: { ar: 'أخصائي آثار ومتاحف (توثيق/ترميم/إدارة مجموعات)', en: 'Archaeology & Museum Specialist (Curator/Conservation)' },
    category: 'culture_heritage',
    signal: 'GROWING',
    evidence: {
      ar: 'لدى السعودية الآن ثمانية مواقع تراث عالمي في اليونسكو (تسجيل الفاو في 2024)، وتدير وزارة الثقافة إحدى عشرة هيئة قطاعية منها هيئتا التراث والمتاحف، ويخلق التوسع المتحفي (كمتحف البحر الأحمر ومجمع الفنون الملكي) وبرنامج آثار العلا توظيفًا في التقييم المتحفي والترميم ورقمنة المجموعات؛ وتدعم اتجاهات تقرير مستقبل الوظائف 2025 (الديموغرافيا والسياحة) توظيف القطاع الثقافي.',
      en: "Saudi Arabia now has eight UNESCO World Heritage sites (Al-Faw inscribed in 2024), the Ministry of Culture runs eleven sector commissions including the Heritage and Museums commissions, and a museum build-out (e.g., Red Sea Museum, Royal Arts Complex) plus AlUla's archaeology program create curatorial, conservation and collections-digitization hiring; WEF FoJ 2025 trends (demographics + tourism) lift culture-sector employment.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'حرفة الترميم والحكم في التنقيب والسلطة المتحفية خبرة مجسدة؛ والذكاء الاصطناعي يؤتمت مسودات الفهرسة والترجمة لا التوثيق والأصالة ولا الترميم الفيزيائي (منظمة العمل الدولية: عمل مهني منخفض التعرض مع بعض المهام المكتبية المعرضة).',
      en: 'Conservation craft, excavation judgment and curatorial authority are embodied expertise; GenAI automates cataloguing drafts and translation, not authentication or physical conservation (ILO: low-exposure professional work with some exposed desk tasks).',
    },
    aiAugmentation: {
      ar: 'الذكاء الاصطناعي يسرّع الفهرسة والتوثيق ثلاثي الأبعاد للقطع والتفسير متعدد اللغات وتحليلات الزوار؛ والمتخصصون الجامعون بين عمق التراث ومهارات الرقمنة يقودون المؤسسات الجديدة.',
      en: 'AI accelerates cataloguing, 3D documentation of artifacts, multilingual interpretation and visitor analytics; specialists who pair heritage depth with digitization skills lead the new institutions.',
    },
    keySkills: ['curiosity_lifelong_learning', 'analytical_thinking', 'empathy_care', 'data_literacy', 'ai_use'],
    pathways: {
      degree: {
        ar: 'بكالوريوس آثار/تاريخ/دراسات متاحف (جامعة الملك سعود وغيرها) — البوابة المعيارية لأدوار القيّم والمفتش؛ وبرنامج الابتعاث الثقافي بوزارة الثقافة يموّل تخصصات المتاحف في الخارج.',
        en: 'BA archaeology/history/museology (King Saud University and others) — the standard gate for curator and inspector roles; Ministry of Culture cultural scholarships fund overseas museum-studies specialization.',
      },
      skillsFirst: {
        ar: 'برامج هيئة التراث التدريبية، وبرامج المعهد الملكي للفنون التقليدية (ثراء)، وشهادات قصيرة في الرقمنة والتصوير المساحي، وسلالم التطوع إلى التوظيف في المتاحف الجديدة.',
        en: 'Heritage Commission training, Royal Institute of Traditional Arts (ثراء) programs, digitization/photogrammetry micro-credentials, volunteer-to-staff ladders in the new museums.',
      },
    },
    verdict: {
      ar: 'رهان وطني بأفق عقد: المؤسسات تُبنى أسرع من خط إنتاج المتخصصين، فيكسب الداخلون المبكرون أقدمية نادرة — لكن الرواتب تتبع السلم العام وأقوى الأدوار تتمركز في الرياض وجدة والعلا.',
      en: 'A decade-horizon national bet: the institutions are being built faster than the specialist pipeline, so early entrants gain rare seniority — accept that salaries follow public-sector scales and that the strongest roles cluster in Riyadh, Jeddah and AlUla.',
    },
    matching: {
      interestKeys: ['organize_rule', 'people_care'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['structured_classroom'],
      minCommitment: 'y4_6',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'logistics_manager',
    name: { ar: 'مدير عمليات لوجستية ومستودعات ذكية', en: 'Logistics Operations & Smart-Warehouse Manager' },
    category: 'logistics',
    signal: 'GROWING',
    evidence: {
      ar: 'تستهدف الاستراتيجية الوطنية للنقل والخدمات اللوجستية مركزًا ضمن أفضل 10 في مؤشر الأداء اللوجستي بحلول 2030 — وقفزت السعودية 17 مرتبة إلى 38 في مؤشر البنك الدولي 2023 — ويبني المشغلون العالميون مراكز إقليمية (افتتحت ميرسك أكبر متنزه لوجستي لها في الشرق الأوسط بميناء جدة الإسلامي 2024)؛ ويبقي تقرير مستقبل الوظائف 2025 أدوار سلاسل الإمداد ضمن الأكبر نموًا مع تغيّر محتواها بأتمتة المستودعات.',
      en: "The National Transport & Logistics Strategy targets a top-10 Logistics Performance Index position by 2030 — Saudi Arabia jumped 17 places to 38th in the World Bank LPI 2023 — and global operators are building regional hubs (Maersk opened its largest Middle East logistics park at Jeddah Islamic Port in 2024); WEF FoJ 2025 keeps supply-chain and frontline-economy roles among the largest growers while warehouse automation changes their content.",
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'هذا من الأدوار النادرة المعرضة على القناتين معًا: الذكاء الاصطناعي التوليدي يؤتمت وثائق التخطيط ومراسلات الاستثناءات، وروبوتات المستودعات تؤتمت المناولة الفيزيائية — ويبقى دور المدير كطبقة بشرية تشرف على التدفقات المؤتمتة، لكن عدد العاملين لكل مستودع يتناقص.',
      en: 'This is the rare role exposed on BOTH channels: GenAI automates planning documents and exception emails, while warehouse robotics (AS/RS, AMRs) automate physical handling — the manager role survives as the human layer supervising automated flows, but headcount per warehouse falls.',
    },
    aiAugmentation: {
      ar: 'التنبؤ بالطلب بالذكاء الاصطناعي وتوائم المستودعات الرقمية ولوحات أبراج التحكم تنقل العمل من ملاحقة الشحنات إلى إدارة الاستثناءات وأساطيل الأتمتة.',
      en: 'AI demand forecasting, digital twins of warehouses and control-tower dashboards move the job from chasing shipments to managing exceptions and automation fleets.',
    },
    keySkills: ['analytical_thinking', 'leadership', 'data_literacy', 'agile_delivery', 'resilience'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة صناعية/لوجستيات (الجامعات السعودية) ثم شهادات ASCM ‏(CPIM/CSCP) أو CILT — السلم المعترف به لقيادة العمليات.',
        en: 'BSc industrial engineering/logistics (Saudi universities), then ASCM (CPIM/CSCP) or CILT certifications — the recognized ladder for operations leadership.',
      },
      skillsFirst: {
        ar: 'برامج الأكاديمية اللوجستية السعودية، ودبلومات اللوجستيات في التدريب التقني، وشهادات أنظمة إدارة المستودعات وERP ‏(SAP وOracle) وشهادات مورّدي أتمتة المستودعات؛ والدخول عبر أدوار مشرف عمليات.',
        en: 'Saudi Logistics Academy programs, TVTC logistics diplomas, WMS/ERP (SAP, Oracle) and warehouse-automation vendor certificates; entry via operations supervisor roles.',
      },
    },
    verdict: {
      ar: 'اختيار هيكلي قوي: استراتيجية المركز اللوجستي ممولة وقابلة للقياس (ترتيب مؤشر الأداء اللوجستي يُتتبع علنًا)، والأتمتة ترفع قدرة المدير بدل إلغاء الدور — تعلّم روبوتات المستودعات مبكرًا وإلا ستنافسها.',
      en: "Strong structural choice: the logistics-hub strategy is funded and measurable (LPI rank is tracked publicly), and automation raises the manager's leverage rather than eliminating the role — learn warehouse robotics early or you will compete with it.",
    },
    matching: {
      interestKeys: ['organize_rule', 'numbers_logic'],
      aptitudeKeys: ['mixed', 'math_strong'],
      learningStyles: ['structured_classroom', 'apprenticeship'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'mining_engineer',
    name: { ar: 'مهندس تعدين', en: 'Mining Engineer' },
    category: 'mining',
    signal: 'GROWING',
    evidence: {
      ar: 'تطرح وزارة الصناعة التعدين كركيزة ثالثة للصناعة السعودية وأعادت تقدير الثروة المعدنية بنحو 2.5 تريليون دولار (منتدى مستقبل المعادن 2024)، وفتح نظام الاستثمار التعديني 2021 تراخيص الاستكشاف، ويوظف توسع معادن (الفوسفات والذهب والألمنيوم) مهندسين في مواقع نائية؛ ويعد تقرير مستقبل الوظائف 2025 هندسة القطاعات المرتبطة بالمعادن الحرجة ضمن المستفيدة من تحول الطاقة.',
      en: "The Ministry of Industry positions mining as the third pillar of Saudi industry and re-estimated mineral wealth at ~$2.5 trillion (Future Minerals Forum 2024), the 2021 Mining Investment Law opened exploration licensing, and Ma'aden's expansion (phosphate, gold, aluminum) is hiring engineers across remote sites; WEF FoJ 2025 counts extractives-adjacent engineering among roles lifted by energy-transition demand for critical minerals.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'شاحنات النقل والحفر الذاتية موجودة في المناجم الكبرى، لكن التوسع السعودي يعني بناء وتشغيل عمليات جديدة — والحكم الهندسي في جيولوجيا غير منظمة يبقى بشريًا؛ ومراكز التشغيل عن بُعد تغيّر مكان العمل لا الحاجة إلى المهندسين.',
      en: 'Autonomous haul trucks and drilling exist at large mines, but Saudi expansion means building and commissioning new operations — engineering judgment in unstructured geology stays human; remote-operation centers change where the work happens, not whether engineers are needed.',
    },
    aiAugmentation: {
      ar: 'نمذجة الخامات بالذكاء الاصطناعي والإشراف على الأساطيل الذاتية والصيانة التنبؤية توسع نطاق كل مهندس؛ والألفة مع البيانات صارت ميزة تنافسية في صناعة متحفظة تقليديًا.',
      en: "AI ore-body modeling, autonomous fleet supervision and predictive maintenance raise each engineer's scope; comfort with data is now a differentiator in a traditionally conservative industry.",
    },
    keySkills: ['analytical_thinking', 'resilience', 'emerging_tech', 'leadership', 'data_literacy'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة تعدين (الفيصل للبترول والمعادن KFUPM، الملك عبدالعزيز) + تسجيل الهيئة السعودية للمهندسين؛ وتدير معادن برامج تطوير خريجين مرتبطة بمشاريع توسعها.',
        en: "BSc mining engineering (KFUPM, KAU) + Saudi Council of Engineers registration; Ma'aden runs graduate development programs tied to its expansion projects.",
      },
      skillsFirst: {
        ar: 'معهد التعدين التقني في عرعر (بالشراكة مع معادن والتدريب التقني) لأدوار الفنيين؛ وشهادات التفجير والسلامة وتشغيل المعامل كنقاط دخول.',
        en: "Saudi Mining Polytechnic (معهد التعدين التقني في عرعر، Ma'aden/TVTC-linked) for technician roles; blasting, safety (NEBOSH-style) and processing-plant certificates as entry points.",
      },
    },
    verdict: {
      ar: 'نعم لمن يقبل حياة المواقع النائية: التعدين ركيزة وطنية معلنة بخط مشاريع موثق وقلة من الخريجين المحليين — والمبكرون سيكونون قيادات نادرة خلال عقد؛ والمقايضة هي الموقع ونظام المناوبات.',
      en: 'Yes for those who accept remote-site life: mining is a declared national pillar with a documented pipeline of projects and few local graduates — early movers will be scarce seniors within a decade; the trade-off is location and roster work.',
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
    id: 'solar_pv_engineer',
    name: { ar: 'مهندس أنظمة الطاقة الشمسية', en: 'Solar PV Systems Engineer' },
    category: 'engineering_tech',
    signal: 'GROWING',
    evidence: {
      ar: 'تقرير مستقبل الوظائف 2025: مهندسو الطاقة المتجددة ضمن أسرع 15 مهنة نموًا عالميًا، وتبني توليد الطاقة وتخزينها من أكبر ثلاثة محركات للتحول؛ ويستهدف البرنامج الوطني للطاقة المتجددة 50% طاقة متجددة في مزيج الكهرباء بحلول 2030، مع مشاريع عملاقة قيد التشغيل أو الإنشاء (سكاكا، سدير، الشعيبة — من أكبر محطات الطاقة الشمسية المفردة عالميًا).',
      en: "WEF FoJ 2025: Renewable Energy Engineers are among the 15 fastest-growing roles globally and energy generation/storage adoption is a top-3 transformation driver; Saudi Arabia's National Renewable Energy Program targets 50% renewables in the power mix by 2030, with utility-scale projects in operation or construction (Sakaka, Sudair, Al Shuaibah — among the world's largest single-site PV plants).",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'الهندسة الميدانية والتوقيع على الربط مع الشبكة والتشغيل التجريبي تحدث فيزيائيًا في المحطات؛ وأتمتة التصميم (أدوات من فئة PVsyst مع تحسين التخطيط بالذكاء الاصطناعي) تزيل ساعات الرسم لا المهندس المرخّص.',
      en: 'Site engineering, grid-integration sign-off and commissioning occur physically at plants; design automation (PVsyst-class tools plus AI layout optimization) removes drafting hours, not the licensed engineer.',
    },
    aiAugmentation: {
      ar: 'نمذجة الإنتاج بالذكاء الاصطناعي والتصوير الحراري بالطائرات المسيّرة لكشف الأعطال والتنبؤ لجدولة الشبكة تغيّر الأدوات اليومية؛ والمهندسون المتقنون لأنظمة القدرة وخطوط البيانات معًا هم الأندر.',
      en: 'AI yield modeling, drone thermography for fault detection and forecasting for grid dispatch change daily tooling; engineers fluent in both power systems and data pipelines are the scarce profile.',
    },
    keySkills: ['analytical_thinking', 'emerging_tech', 'resilience', 'data_literacy', 'ai_use'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة كهربائية/ميكانيكية/طاقة + تسجيل الهيئة السعودية للمهندسين؛ وتوفر كاوست ومدينة الملك عبدالعزيز للعلوم والتقنية مسارات بحثية في تقنيات الشمسية.',
        en: 'BSc electrical/mechanical/energy engineering + Saudi Council of Engineers registration; KAUST and KACST provide research pipelines for solar technologies.',
      },
      skillsFirst: {
        ar: 'دبلومات فني طاقة متجددة من التدريب التقني، وشهادات المورّدين (العواكس وأنظمة SCADA)، وشهادات الفحص بالطائرات المسيّرة — وسلم فني ميداني إلى مهندس تشغيل تجريبي موثق في المشاريع الكبرى.',
        en: 'TVTC renewable-energy technician diplomas, vendor certifications (inverter/SCADA vendors), drone-inspection credentials — field technician to commissioning engineer is a documented ladder on giga-projects.',
      },
    },
    verdict: {
      ar: 'نعم بعقلية الأنظمة: خط المشاريع السعودي متعاقد عليه ومرئي، والترتيبات العالمية تؤكد الاتجاه — ميّز نفسك بمهارات الربط والتخزين لا الألواح وحدها. (تكمل هذه البطاقة مهندس الطاقة المتجددة العام: هذا مسار التصميم الشمسي.)',
      en: 'Yes with a systems mindset: the Saudi pipeline is contracted and visible, and global rankings confirm the trend — differentiate yourself with grid-integration and storage skills, not panels alone. (Complements the broader renewable_energy_engineer card: this is the PV-design track.)',
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
  {
    id: 'water_environment_engineer',
    name: { ar: 'مهندس مياه وبيئة', en: 'Water & Environmental Engineer' },
    category: 'environment_water',
    signal: 'GROWING',
    evidence: {
      ar: 'تقرير مستقبل الوظائف 2025: مهندسو البيئة ضمن أسرع 15 مهنة نموًا، ودخلت الإدارة البيئية قائمة أسرع عشر مهارات لأول مرة؛ والسعودية أكبر منتج للتحلية عالميًا (المؤسسة العامة لتحلية المياه)، وتقود المبادرة السعودية الخضراء برامج بيئية وطنية، وتُبقي إعادة هيكلة قطاع المياه (خصخصة SWPC وشركات المياه الإقليمية) التوظيف الهندسي قائمًا.',
      en: "WEF FoJ 2025: Environmental Engineers are in the 15 fastest-growing roles and environmental stewardship entered the top-10 fastest-growing skills for the first time; Saudi Arabia is the world's largest desalination producer (SWCC), the Saudi Green Initiative drives national environmental programs, and water-sector restructuring (SWPC privatization, NWC regional companies) sustains engineering hiring.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'تتجه عمليات المحطات للأتمتة (أنظمة SCADA وشبكات المياه الذكية)، لكن التوقيع على التصاميم والحكم في تقييم الأثر البيئي والمساءلة عن الامتثال التنظيمي تبقى عملًا بشريًا مرخّصًا.',
      en: 'Plant operations are increasingly automated (SCADA, smart water networks), but design sign-off, environmental-impact judgment and regulatory compliance accountability remain licensed human work.',
    },
    aiAugmentation: {
      ar: 'كشف التسربات بالذكاء الاصطناعي والتنبؤ بجودة المياه وتحسين المحطات تعمل فعليًا في المرافق الحديثة؛ والمهندسون الفاهمون للهيدروليكا والبيانات معًا يترقون أسرع.',
      en: 'AI leak detection, water-quality forecasting and plant optimization are live in modern utilities; engineers who understand both hydraulics and data are promoted fastest.',
    },
    keySkills: ['analytical_thinking', 'emerging_tech', 'resilience', 'data_literacy', 'digital_policy'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة مدنية/بيئية/كيميائية + تسجيل الهيئة السعودية للمهندسين؛ وبرامج الماجستير المائية (KFUPM، كاوست) تتوافق مع بحوث القطاع.',
        en: 'BSc civil/environmental/chemical engineering + Saudi Council of Engineers registration; water-focused masters programs (KFUPM, KAUST) align with sector R&D.',
      },
      skillsFirst: {
        ar: 'برامج الأكاديمية السعودية للمياه، ودبلومات تشغيل المياه في التدريب التقني، وشهادات SCADA والمراقبة البيئية لسلالم الفني إلى المشغل.',
        en: 'Saudi Water Academy programs, TVTC water-operations diplomas, SCADA and environmental-monitoring certificates for technician-to-operator ladders.',
      },
    },
    verdict: {
      ar: 'نعم هادئة ومتينة: أمن المياه وجودي للسعودية (فالتمويل لا ينضب في الدورات الاقتصادية)، والترتيبات العالمية تؤكد موجة الهندسة البيئية — توقع جهات حكومية ومرافق أكثر من الشركات الناشئة.',
      en: 'A quiet, durable yes: water security is existential for Saudi Arabia (so funding does not dry up in downturns), and global rankings confirm the environmental-engineering wave — expect public-sector and utility employers more than startups.',
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
    id: 'agritech_specialist',
    name: { ar: 'أخصائي زراعة ذكية (زراعة دقيقة)', en: 'Smart Agriculture Specialist (Precision Farming)' },
    category: 'agritech',
    signal: 'GROWING',
    evidence: {
      ar: 'تقرير مستقبل الوظائف 2025: عمال الزراعة ضمن الأكبر نموًا بالأرقام المطلقة عالميًا، ويدفع التكيف المناخي الطلب على التقنيات الزراعية؛ وتوسّع استراتيجية الأمن الغذائي السعودية الزراعة المُحكمة (البيوت المحمية والمزارع العمودية — كشركة رد سي فارمز المنبثقة من كاوست) ويمول برنامج التنمية الريفية الزراعية المستدامة (ريف) تحديث المزارع في أنحاء المملكة.',
      en: "WEF FoJ 2025: farmworkers are among the largest-growing roles in absolute terms globally, and climate adaptation drives agri-tech demand; Saudi Arabia's food-security strategy expands controlled-environment agriculture (greenhouses, vertical farms — e.g., KAUST-spinoff Red Sea Farms) and the Sustainable Agricultural Rural Development Program (Reef) funds farm modernization across the Kingdom.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'الطائرات المسيّرة والمستشعرات والحصاد الروبوتي تؤتمت المهام، لكن الحكم الزراعي (التربة والمياه وضغط الآفات في مناخ السعودية الجاف) خبرة سياقية؛ ودور الأخصائي ينمو تحديدًا لأن أحدًا يجب أن يشغّل هذه التقنية.',
      en: "Drones, sensors and robotic harvesting automate tasks, but agronomic judgment (soil, water, pest pressure in Saudi's arid climate) is contextual expertise; the specialist role grows precisely because someone must run the technology.",
    },
    aiAugmentation: {
      ar: 'تصوير إجهاد المحاصيل بالذكاء الاصطناعي وتحسين الري والتنبؤ بالمحصول عدة يومية للزراعة الدقيقة؛ ويترجم الأخصائي بيانات المستشعرات إلى قرارات زراعية.',
      en: 'AI crop-stress imaging, irrigation optimization and yield prediction are the daily toolkit of precision farming; the specialist translates sensor data into agronomic decisions.',
    },
    keySkills: ['data_literacy', 'emerging_tech', 'analytical_thinking', 'resilience', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس زراعة (جامعة الملك فيصل بالأحساء وغيرها) — مطلوب لأدوار المهندس الزراعي المسجل؛ وأضف مقررات بيانات واستشعار عن بُعد.',
        en: 'BSc agriculture/agronomy (King Faisal University in Al-Ahsa and others) — required for agronomist-of-record roles; add data/remote-sensing electives.',
      },
      skillsFirst: {
        ar: 'دبلومات زراعية من التدريب التقني، ورخص قيادة الطائرات المسيّرة (الهيئة العامة للطيران المدني)، وشهادات تشغيل البيوت المحمية، وتدريب مدعوم من برنامج ريف؛ وتوظف الشركات الزراعية الناشئة ملفات الفنيين مباشرة.',
        en: 'TVTC agricultural diplomas, drone-pilot licenses (GACA), greenhouse-operations certificates and Reef-supported farm training; agritech startups hire technician profiles directly.',
      },
    },
    verdict: {
      ar: 'مكانة نمو حقيقية لكنها ليست واسعة: ليست موظّفًا جماهيريًا كالصحة، لكنها أولوية وطنية ممولة (الأمن الغذائي) يندر فيها المهندس الزراعي المتقن للتقنية — اجمع القاعدة الزراعية مع مهارات البيانات وستواجه منافسة قليلة.',
      en: 'A small-but-real growth niche: not a mass employer like healthcare, but a funded national priority (food security) where tech-fluent agronomists are genuinely scarce — combine the agriculture base with data skills and you face little competition.',
    },
    matching: {
      interestKeys: ['build_physical', 'numbers_logic'],
      aptitudeKeys: ['mixed', 'bio_strong'],
      learningStyles: ['apprenticeship', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'maritime_officer',
    name: { ar: 'ضابط بحري (سطح/ميكنة) وعمليات موانئ', en: 'Merchant Marine Officer (Deck/Engine) & Port Operations' },
    category: 'maritime',
    signal: 'GROWING',
    evidence: {
      ar: 'توسّع الاستراتيجية الوطنية للنقل والخدمات اللوجستية الموانئ والقدرة الشاحنة السعودية (تشغّل بحري أحد أكبر أساطيل الناقلات العملاقة عالميًا؛ وميناء الملك عبدالله وميناء جدة الإسلامي ضمن الأكفأ إقليميًا)، ويوثق النقص العالمي في الضباط البحريين من جهات الصناعة؛ ويُبقي تقرير مستقبل الوظائف 2025 أدوار النقل واللوجستيات ضمن الأكبر نموًا.',
      en: "The National Transport & Logistics Strategy is expanding Saudi ports and shipping capacity (Bahri operates one of the world's largest VLCC fleets; King Abdullah Port and Jeddah Islamic Port rank among the region's most efficient), and global officer shortages are documented by industry bodies; WEF FoJ 2025 keeps transport and logistics roles among the largest growers.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'أنظمة الرسو الآلي والموانئ الذكية موجودة، لكن الضباط البشريين المرخصين وفق STCW مطلوبون نظامًا على متن السفن؛ والشحن الذاتي مقيّد تنظيميًا وبعيد المدى، خصوصًا لدولة توسّع أسطولها.',
      en: 'Automated mooring and smart-port systems exist, but STCW-certified human officers remain legally required on board; autonomous shipping is regulator-gated and long-horizon, especially for a flag growing its fleet.',
    },
    aiAugmentation: {
      ar: 'تحسين الرحلات والصيانة التنبؤية للمحركات وأنظمة مجتمعات الموانئ تغيّر عمل الضابط على وحدات التحكم؛ وتبقى مساءلة الملاحة بشرية بموجب الاتفاقيات الدولية.',
      en: "Voyage optimization, predictive engine maintenance and port-community systems change the officer's console work; navigation accountability stays human under international convention.",
    },
    keySkills: ['resilience', 'analytical_thinking', 'leadership', 'emerging_tech', 'data_literacy'],
    pathways: {
      degree: {
        ar: 'برنامج دراسات بحرية/علوم ملاحية يقود إلى شهادة ضابط نوبة وفق STCW عبر ترخيص الهيئة العامة للنقل؛ والمسار الهندسي لضباط الميكنة البحرية.',
        en: 'Maritime studies/nautical science program leading to STCW officer-of-watch certification via Transport General Authority (TGA) licensing; engineering route for marine-engine officers.',
      },
      skillsFirst: {
        ar: 'برامج الكاديت لدى الناقلات الوطنية (لدى بحري خطوط كاديت)، ومسارات الأكاديمية اللوجستية السعودية البحرية، ودبلومات التدريب التقني البحرية — وسلم الزمن البحري مع الشهادات هو الطريق النظامي الوحيد.',
        en: 'Cadet programs with national carriers (Bahri runs cadet pipelines), Saudi Logistics Academy maritime tracks, TVTC marine diplomas — sea-time + certification is the legal ladder, no shortcut exists.',
      },
    },
    verdict: {
      ar: 'خيار متين ومغفول عنه: طلب مضمون من الأسطول الوطني المتنامي، ودخل بحري تنافسي، ورتب ضباط واضحة — والمقايضات الصادقة هي أشهر بعيدًا عن المنزل والإنجليزية لغة عمل في البحر.',
      en: 'A solid, overlooked choice: guaranteed-sea-demand plus national fleet growth, tax-advantaged seafarer income norms, and clear officer ranks — the honest trade-offs are months away from home and English as the working language at sea.',
    },
    matching: {
      interestKeys: ['build_physical'],
      aptitudeKeys: ['mixed', 'math_strong'],
      learningStyles: ['apprenticeship', 'structured_classroom'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: true,
    },
  },
  {
    id: 'real_estate_manager',
    name: { ar: 'أخصائي تطوير وإدارة عقارية وخدمات بلدية', en: 'Real Estate Development & Municipal Services Specialist' },
    category: 'real_estate_municipal',
    signal: 'TRANSFORMING',
    evidence: {
      ar: 'يستهدف برنامج الإسكان تملك 70% من السعوديين لمساكنهم، وتبني شركات التطوير المدعومة من الصندوق (روشن، الوطنية للإسكان) بمقياس المدن، وانتقلت الخدمات البلدية إلى الإنترنت (منصة بلدي) بينما تُهذّب الهيئة العامة للعقار السمسرة بترخيص إلزامي؛ ويصنف تقرير مستقبل الوظائف 2025 المهام الكتابية المرتبطة بالعقار ضمن المعرضة — فالقطاع ينمو لكن طبقته الكتابية تُؤتمت، ولذا الأدوار الدائمة هي التطوير والتثمين وتشغيل الخدمات الرقمية.',
      en: 'The Housing Program targets 70% Saudi homeownership, PIF-backed developers (ROSHN, National Housing Company) build at city scale, and municipal services moved online (Balady platform) while the Real Estate General Authority professionalizes brokerage with mandatory licensing; WEF FoJ 2025 lists real-estate-adjacent clerical tasks as exposed — the sector grows, but its clerical layer is being automated, so the durable roles are development, valuation and digital-service operations.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'الإدراجات والعقود وتقارير التثمين ومعالجة الرخص البلدية مهام كثيفة الوثائق في منطقة أتمتة الذكاء الاصطناعي التوليدي (منظمة العمل الدولية: الدعم المهني الشبيه بالكتابي عالي التعرض)؛ بينما التفاوض والحكم على الأراضي والإبحار التنظيمي تبقى بشرية.',
      en: "Listings, contracts, valuation reports and municipal permit processing are document-heavy tasks in GenAI's automation zone (ILO: clerical-adjacent professional support is highly exposed); negotiation, land judgment and regulatory navigation stay human.",
    },
    aiAugmentation: {
      ar: 'نماذج التثمين الآلي وأدوات التوأم الرقمي للمدن وفحص الرخص الآلي ترفع الإنتاجية؛ والمتخصصون المتقنون لمنصات من فئة بلدي والتثمين المدفوع بالبيانات يحلون محل السماسرة التقليديين.',
      en: 'AI valuation models (AVMs), digital-twin city tools and automated permit checking raise throughput; specialists who master Balady-class platforms and data-driven valuation replace traditional brokers.',
    },
    keySkills: ['analytical_thinking', 'data_literacy', 'digital_policy', 'leadership', 'resilience'],
    pathways: {
      degree: {
        ar: 'بكالوريوس عقار أو تخطيط عمراني أو هندسة (الجامعات السعودية)؛ وتتوافق أدوار التخطيط مع التحول الرقمي البلدي؛ ومسارات التثمين عبر برامج المثمّنين المعتمدة.',
        en: 'BSc real estate, urban planning or engineering (Saudi universities); planning roles align with municipal digital transformation; valuation tracks via accredited valuer programs.',
      },
      skillsFirst: {
        ar: 'دبلومات المعهد العقاري السعودي للترخيص (إلزامية لمزاولة السمسرة)، وتدريب تشغيل منصة بلدي، وشهادات قصيرة في التقنية العقارية وتحليل البيانات — دخول خلال أشهر إلى أدوار الوساطة ومقاولي البلديات.',
        en: 'Saudi Real Estate Institute licensing diplomas (mandatory for brokerage practice), Balady-platform operations training, and short credentials in proptech/data analysis — entry within months into agency and municipal-contractor roles.',
      },
    },
    verdict: {
      ar: 'ادخل من الباب الرقمي لا الورقي: السمسرة التقليدية تُؤتمت وتُنظّم، لكن التطوير والتثمين والخدمات البلدية الرقمية تتوسع — والسوق دورية، فاحتفظ بمهارة بيانات كتأمين.',
      en: 'Enter through the digital door, not the paper one: brokerage-as-usual is being automated and licensed into formality, but development, valuation and municipal digital services are expanding — the market is cyclical, so keep a data skill as insurance.',
    },
    matching: {
      interestKeys: ['organize_rule', 'persuade_create'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'media_producer',
    name: { ar: 'منتج أفلام ومحتوى (إنتاج مرئي)', en: 'Film & Content Producer (Screen Production)' },
    category: 'media_design',
    signal: 'GROWING',
    evidence: {
      ar: 'أعيد فتح السينما السعودية في 2018 وتدير هيئة الأفلام منظومة إنتاج بخصومات نقدية تصل إلى 40% للإنتاجات المصوّرة في المملكة؛ وتستضيف استوديوهات العلا وقرية نيوم الإعلامية تصويرًا دوليًا، ويمول نمو شباك التذاكر المحلي أعمالًا سعودية أصلية — وتوظيف المنتجين ومديري الإنتاج موثق عبر أعمال المنصات والهيئات (أعمال عربية أصلية لنتفليكس وMBC شاهد).',
      en: 'Saudi cinema reopened in 2018 and the Film Commission now runs a production ecosystem with cash rebates of up to 40% for productions filming in the Kingdom; Studio AlUla and NEOM’s media village host international shoots, and local box-office growth funds Saudi originals — producer, line-producer and production-manager hiring is documented across commissions and streamer commissions (Netflix/MBC Shahid Arabic originals).',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'تغطية السيناريوهات والترجمة المرئية ومساعدات المونتاج وحتى الفيديو الاصطناعي معرضة للذكاء الاصطناعي التوليدي (منظمة العمل الدولية: مهام المحتوى الإعلامي من الأكثر تعرضًا)؛ لكن الإنتاج الفيزيائي — المواقع والطواقم والميزانيات والسلامة في الموقع — وصناعة الصفقات لدى المنتج تبقى بشرية.',
      en: "Script coverage, subtitling, editing assists and even synthetic video are GenAI-exposed (ILO: media content tasks among the most exposed); but physical production — locations, crews, budgets, safety on set — and the producer's deal-making remain human.",
    },
    aiAugmentation: {
      ar: 'التصور الأولي والدبلجة والمونتاج المسند بالذكاء الاصطناعي تضغط جداول ما بعد الإنتاج؛ والمنتجون الذين يعاملون الذكاء الاصطناعي كمضاعف للميزانية يُنتجون أكثر لكل ريال — وتنتقل الحرفة إلى الذوق وإدارة الحقوق وقيادة الموقع.',
      en: 'AI pre-visualization, dubbing and edit-assist compress post-production timelines; producers who treat AI as a budget multiplier deliver more content per riyal — the craft shifts to taste, rights management and on-set leadership.',
    },
    keySkills: ['creative_thinking', 'leadership', 'resilience', 'ai_use', 'agile_delivery'],
    pathways: {
      degree: {
        ar: 'درجات إنتاج أفلام وإعلام (برامج الإعلام في الجامعات السعودية ومعاهد أهلية مثل SAE في الرياض)؛ وبرنامج الابتعاث الثقافي يموّل مدارس السينما في الخارج.',
        en: 'Film/media production degrees (Saudi university media programs and private institutes such as SAE in Riyadh); Ministry of Culture cultural scholarships fund overseas film schools.',
      },
      skillsFirst: {
        ar: 'ورش هيئة الأفلام وبرامج معسكرات الإنتاج، والدخول من طاقم الموقع (مساعد إنتاج ثم منسق ثم مدير)، وبرامج إعلامية مرتبطة بمسك؛ وملف أفلام قصيرة أهم من الشهادات.',
        en: 'Film Commission workshops and production-bootcamp programs, set-crew entry (production assistant → coordinator → manager), Misk-affiliated media programs; a short-film portfolio matters more than certificates.',
      },
    },
    verdict: {
      ar: 'صناعة حقيقية الآن — وخلفها حوافز وطنية — لكن الإنتاج كثيف الأعمال الحرة وقائم على السمعة؛ ادخل من طاقم العمل، وراكم الأعمال المُنجزة بسرعة، وتعلم برمجيات الميزنة وأدوات ما بعد الإنتاج بالذكاء الاصطناعي لتبقى منافسًا.',
      en: 'A real industry now — with national incentives behind it — but production is freelance-heavy and reputation-based; enter via crew work, build credits fast, and learn budgeting software plus AI post tools to stay competitive.',
    },
    matching: {
      interestKeys: ['persuade_create'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['project_based', 'apprenticeship'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'satellite_engineer',
    name: { ar: 'مهندس أقمار صناعية وأنظمة فضائية', en: 'Satellite / Space Systems Engineer' },
    category: 'space_satellite',
    signal: 'GROWING',
    evidence: {
      ar: 'أسست السعودية وكالة الفضاء السعودية (2023) وأرسلت رائدَي فضاء على مهمة Axiom-2 (2023، منهما ريانة برناوي — أول سعودية في الفضاء)؛ ولدى مدينة الملك عبدالعزيز للعلوم والتقنية برنامج أقمار ممتد لعقدين (سلسلة SaudiSat)، وتستثمر المملكة في خدمات الأقمار وتطبيقاتها (الرصد الأرضي للمشاريع الكبرى والزراعة)؛ ويعد تقرير مستقبل الوظائف 2025 الهندسة المرتبطة بالفضاء ضمن المستفيدة من اتجاهات التحول التقني.',
      en: 'Saudi Arabia established the Saudi Space Agency (2023) and flew two national astronauts on Axiom-2 (2023, including Rayyanah Barnawi — the first Saudi woman in space); KACST has a two-decade satellite program (SaudiSat series), and the Kingdom is investing in satellite services and downstream applications (Earth observation for giga-projects and agriculture); WEF FoJ 2025 lists space-adjacent engineering among beneficiaries of technological-transformation trends.',
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'هندسة الأنظمة الفضائية عمل تصميمي حرج السلامة بدفعات إنتاج صغيرة — الأتمتة تطبق على أدوات التحليل، لكن ضمان المهمة وحكم التكامل بين الأنظمة يبقيان بشريين بعمق ومحكومين بالتصاريح الأمنية.',
      en: 'Space systems engineering is safety-critical design work with tiny production runs — automation applies to analysis tools, but mission assurance and systems integration judgment remain deeply human and clearance-gated.',
    },
    aiAugmentation: {
      ar: 'مساعدو تصميم المهمات بالذكاء الاصطناعي وكشف الأعطال على متن القمر وتحليلات الرصد الأرضي توسع قدرة الفرق الصغيرة؛ والمهندسون الجامعون بين تعلم الآلة وميكانيكا المدارات نادرون مضاعفة.',
      en: 'AI mission-design assistants, onboard anomaly detection and Earth-observation analytics expand what small teams can fly; engineers with ML skills plus orbital mechanics are doubly scarce.',
    },
    keySkills: ['analytical_thinking', 'emerging_tech', 'resilience', 'ai_use', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس هندسة طيران/كهربائية/ميكانيكية (هندسة الطيران بالملك عبدالعزيز، الفيصل KFUPM) ثم برامج مدينة الملك عبدالعزيز للعلوم والتقنية أو وكالة الفضاء السعودية؛ والماجستير في الخارج عبر الابتعاث هو الطريق الشائع للأدوار القيادية.',
        en: 'BSc aerospace/electrical/mechanical engineering (KAU aeronautical engineering, KFUPM), then KACST or Saudi Space Agency programs; masters abroad via scholarship is the common senior route.',
      },
      skillsFirst: {
        ar: 'أندية الأقمار المصغرة (CubeSat) الجامعية، وتدريب مدينة الملك عبدالعزيز البحثي، وشهادات هندسة الأنظمة المتاحة عبر الإنترنت، ومهارات بيانات الرصد الأرضي (GIS مع Python) كوتد توظيفي.',
        en: 'CubeSat university clubs, KACST research internships, ESA/NASA-style online systems-engineering certificates, and Earth-observation data skills (GIS + Python) as the employable wedge.',
      },
    },
    verdict: {
      ar: 'مجال صغير لكنه استراتيجي: أولوية وطنية بخط إنتاج محلي رفيع — يصعب الدخول دون أساس هندسي متين، لكن مهندسي الفضاء السعوديين الأوائل سيحملون خبرة نادرة مع اتساع القطاع؛ تعامل معه كشغف لا كسوق كبيرة.',
      en: 'Small but strategic: this is a national-priority field with a thin local pipeline — hard to enter without strong engineering fundamentals, but early Saudi space engineers will hold rare expertise as the sector scales; treat it as a calling, not a volume market.',
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
  {
    id: 'fintech_product_specialist',
    name: { ar: 'أخصائي منتجات تقنية مالية ومدفوعات', en: 'Fintech Product & Payments Specialist' },
    category: 'accounting_finance',
    signal: 'GROWING',
    evidence: {
      ar: 'تقرير مستقبل الوظائف 2025: مهندسو التقنية المالية ثاني أسرع مهنة نموًا عالميًا (+95%)؛ ويستهدف برنامج تطوير القطاع المالي السعودي 525 شركة تقنية مالية بحلول 2030، وإطار المصرفية المفتوحة من البنك المركزي يعمل فعليًا، وبلغت المدفوعات الإلكترونية نحو 79% من معاملات التجزئة في 2024 — متجاوزة مستهدف 70% للانقدية — فالبنوك والمحافظ والجهات التنظيمية توظف جميعها أخصائيي منتجات ومدفوعات ومصرفية مفتوحة. (تكمل هذه البطاقة مهندس التقنية المالية: هذا مسار المنتجات والعمليات لا مسار بناء البرمجيات.)',
      en: 'WEF FoJ 2025: Fintech Engineers are the #2 fastest-growing role globally (+95%); Saudi Arabia’s Financial Sector Development Program targets 525 fintech companies by 2030, SAMA’s open-banking framework is live, and electronic payments reached roughly 79% of retail transactions in 2024 — passing the 70% cashless target — so banks, wallets and regulators all hire product, payments and open-banking specialists. (Complements the fintech_engineer card: this is the product/operations track, not the software-build track.)',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'تسويات المدفوعات وفحوص وثائق اعرف عميلك والتقارير تُؤتمت بسرعة (منظمة العمل الدولية: مهام المالية الشبيهة بالكتابية عالية التعرض)؛ لكن حكم المنتج وعلاقات الجهات التنظيمية والتوقيع على المخاطر تُبقي دور الأخصائي ناميًا.',
      en: "Payments reconciliation, KYC document checks and reporting are being automated fast (ILO: finance clerical-adjacent tasks are highly exposed); product judgment, regulator relationships and risk sign-off keep the specialist role growing.",
    },
    aiAugmentation: {
      ar: 'كشف الاحتيال والتقييم الائتماني وأتمتة خدمة العملاء بالذكاء الاصطناعي أنظمة إنتاجية فعلية في المحافظ السعودية؛ وتصبح مهمة الأخصائي تصميم الرحلات والضوابط حول هذه النماذج.',
      en: "AI fraud detection, credit scoring and customer-service automation are production systems in Saudi wallets; the specialist's job becomes designing journeys and controls around these models.",
    },
    keySkills: ['data_literacy', 'analytical_thinking', 'digital_policy', 'ai_use', 'agile_delivery'],
    pathways: {
      degree: {
        ar: 'بكالوريوس مالية/إدارة أعمال/حاسب، ثم ماجستير أو برامج تنفيذية في التقنية المالية أو المدفوعات (الأكاديمية المالية، كلية الأمير محمد بن سلمان MBSC).',
        en: 'BSc finance/business/CS, then fintech or payments masters/executive programs (Financial Academy, MBSC executive education).',
      },
      skillsFirst: {
        ar: 'برامج بناء القدرات في فنتك السعودية (برنامج مكّن وشراكات أكاديمية)، وشهادات أنظمة المدفوعات (أكاديميات Visa/Mastercard)، وشهادات الامتثال — والدخول عبر أدوار العمليات ومحلل المنتجات.',
        en: 'Fintech Saudi capacity programs (برنامج مكّن and academy partnerships), payments-scheme certifications (Visa/Mastercard academies), compliance certificates — entry via operations and product-analyst roles.',
      },
    },
    verdict: {
      ar: 'نعم: التقنية المالية السعودية مدعومة تنظيميًا بمستهدفات قابلة للقياس وسوق مدفوعات رقمية بالفعل في أغلبها — والتحفظ أن كثيرًا من الشركات الناشئة دون الحجم المجدي، فاستهدف الجهات المرخّصة (البنوك والمحافظ المرخصة من البنك المركزي) ما لم تقبل مخاطرة الشركات الناشئة عن وعي.',
      en: 'Yes: Saudi fintech has regulator backing, measurable targets and a payments market already majority-digital — the caveat is that many startups are subscale, so aim for licensed players (banks, SAMA-permitted wallets) unless you accept startup risk knowingly.',
    },
    matching: {
      interestKeys: ['numbers_logic', 'build_tech'],
      aptitudeKeys: ['math_strong', 'mixed'],
      learningStyles: ['project_based', 'structured_classroom'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'legaltech_compliance_officer',
    name: { ar: 'أخصائي امتثال وتقنية قانونية', en: 'Compliance & Legal-Tech Officer' },
    category: 'law',
    signal: 'GROWING',
    evidence: {
      ar: 'التوسع التنظيمي السعودي هو محرك الطلب: دخل نظام حماية البيانات الشخصية مرحلة الإلزام الكامل في سبتمبر 2024، ويوسّع نظام الشركات الجديد (2023) ونشاط مركز التحكيم السعودي العمل القانوني للشركات، وتسحب متطلبات الامتثال على نمط FATF أدوار مكافحة غسل الأموال والعقوبات إلى كل بنك وشركة تقنية مالية؛ وعالميًا يُظهر تقرير مستقبل الوظائف 2025 تراجع العمل القانوني الكتابي مع نمو الأدوار المهنية المرتبطة بالامتثال — فالقيمة هاجرت من الأعمال الورقية إلى الرقابة.',
      en: 'Saudi regulatory expansion is the demand engine: the Personal Data Protection Law entered full enforcement in September 2024, the new Companies Law (2023) and arbitration center (SCCA) activity expand corporate legal work, and FATF-style compliance requirements pull AML/sanctions roles into every bank and fintech; globally, WEF FoJ 2025 shows legal clerical work declining while compliance-adjacent professional roles grow — the value migrated from paperwork to oversight.',
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'مراجعة العقود وصياغة السياسات ومسح الأفق التنظيمي مهام نصية في قلب منطقة الذكاء الاصطناعي التوليدي (منظمة العمل الدولية 2025: الدعم القانوني من الأكثر تعرضًا)؛ لكن المساءلة أمام الجهات التنظيمية والتحقيقات والحكم في الغموض تبقى بشرية — وقابلة للترخيص.',
      en: "Contract review, policy drafting and regulatory-horizon scanning are text tasks squarely in GenAI's zone (ILO 2025: legal support among the most exposed); accountability to regulators, investigations and judgment under ambiguity remain human — and licensable.",
    },
    aiAugmentation: {
      ar: 'تحليل العقود بالذكاء الاصطناعي وفرز تنبيهات غسل الأموال ورصد التغيرات التنظيمية منشورة فعليًا في البنوك السعودية اليوم؛ ويحل الضباط القادرون على تهيئة هذه الأدوات والإشراف عليها محل من يقرأ كل شيء يدويًا.',
      en: 'AI contract-analysis, AML alert triage and regulatory-change monitoring are deployed in Saudi banks today; officers who configure and supervise these tools replace those who read everything manually.',
    },
    keySkills: ['digital_policy', 'analytical_thinking', 'data_literacy', 'ai_use', 'resilience'],
    pathways: {
      degree: {
        ar: 'درجة الأنظمة/القانون (كليات الأنظمة السعودية) لمسار السلطة القانونية؛ وتدخل درجات الإدارة والمالية الامتثال عبر برامج البنوك؛ ولا يلزم ترخيص محاماة لأدوار الامتثال الداخلية.',
        en: 'Law degree (Saudi law colleges) for the legal-authority track; business/finance degrees enter compliance via banking programs; no practice license needed for in-house compliance roles.',
      },
      skillsFirst: {
        ar: 'شهادات الامتثال (ICA، وACAMS لمكافحة غسل الأموال)، وتدريب حماية البيانات الشخصية (منظومة إرشادات سدايا)، ودورات الهيئة السعودية للمحامين المهنية — دخول واقعي خلال 6–18 شهرًا إلى فرق امتثال البنوك.',
        en: 'Compliance certifications (ICA, ACAMS for AML), PDPL/data-protection training (SDAIA-published guidance ecosystem), Saudi Bar Association professional courses — realistic entry in 6–18 months into bank compliance teams.',
      },
    },
    verdict: {
      ar: 'تحوط ذكي للمسارات القانونية: أعمال العقود الكلاسيكية تُؤتمت، لكن كل نظام سعودي جديد يخلق مقاعد امتثال — اجمع المعرفة القانونية مع شهادة حماية بيانات أو مكافحة غسل أموال وستكون قابلًا للتوظيف في البنوك والتقنية المالية والحكومة.',
      en: 'A smart hedge on legal careers: classic contract work is automating, but every new Saudi regulation creates compliance headcount — pair legal knowledge with data-protection or AML certification and you are employable across banking, fintech and government.',
    },
    matching: {
      interestKeys: ['organize_rule'],
      aptitudeKeys: ['lang_strong', 'mixed'],
      learningStyles: ['structured_classroom', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'ot_security_engineer',
    name: { ar: 'مهندس أمن سيبراني للتقنيات التشغيلية', en: 'OT/ICS Cybersecurity Engineer' },
    category: 'cybersecurity',
    signal: 'GROWING',
    evidence: {
      ar: 'تقرير مستقبل الوظائف 2025: الشبكات والأمن السيبراني ثاني أسرع مهارة نموًا مع دورين أمنيين ضمن أسرع 15 عالميًا؛ وأصدرت الهيئة الوطنية للأمن السيبراني الضوابط الأمنية للتقنيات التشغيلية (OTCC-1:2022) الملزمة لمشغلي البنية الحرجة، ويجب على القاعدة الطاقية والمائية والصناعية السعودية (أرامكو، الشركة السعودية للكهرباء، تحلية المياه، مدن) توظيف أمن التقنيات التشغيلية — وهو نقص مهارات موثق عالميًا ضمن القوى السيبرانية الشحيحة أصلًا (تقدر ISC2 الفجوة بالملايين).',
      en: "WEF FoJ 2025: networks & cybersecurity is the #2 fastest-growing skill with two security roles in the global top-15; Saudi Arabia's National Cybersecurity Authority issued Operational Technology Cybersecurity Controls (OTCC-1:2022) binding on critical-infrastructure operators, and the Kingdom's energy, water and industrial base (Aramco, SEC, SWCC, MODON cities) must staff OT security — a documented global skills gap within the already-scarce cyber workforce (ISC2 estimates the shortfall in millions).",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'الذكاء الاصطناعي يفرز التنبيهات، لكن أمن التقنيات التشغيلية يتطلب معرفة فيزيائية بالمنشآت واستدلال سلامة وحكمًا عدائيًا — لمس شبكة مصفاة عاملة فعل كثيف المسؤولية لا يفوّضه أي مشغل لنموذج.',
      en: 'AI triages alerts, but OT security requires physical plant knowledge, safety-case reasoning and adversarial judgment — touching a live refinery network is a liability-heavy act no operator delegates to a model.',
    },
    aiAugmentation: {
      ar: 'كشف الأنماط الشاذة بالذكاء الاصطناعي على البروتوكولات الصناعية وجرد الأصول الآلي يوسعان التغطية؛ ويترجم المهندسون تنبيهات النماذج إلى قرارات تشغيلية آمنة داخل المنشآت.',
      en: 'AI anomaly detection on industrial protocols and automated asset inventory expand coverage; engineers translate model alerts into safe operational decisions inside plants.',
    },
    keySkills: ['cybersecurity', 'analytical_thinking', 'resilience', 'emerging_tech', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'بكالوريوس أمن سيبراني أو هندسة كهربائية/تحكم، ثم تخصص أمن تقنيات تشغيلية؛ والجمع بين برامج الأمن الجامعية وأساسيات الهندسة هو التركيبة المعيارية.',
        en: "BSc cybersecurity/electrical or control engineering, then OT security specialization; Saudi universities' cyber programs plus engineering fundamentals is the standard combination.",
      },
      skillsFirst: {
        ar: 'الدخول من أمن تقنية المعلومات (Security+‎/CEH عبر معسكر طويق السيبراني)، ثم شهادات أنظمة التحكم الصناعية (ISA/IEC 62443، دورات SANS ICS) — فمعظم مهندسي أمن التقنيات التشغيلية يتحولون من أمن تقنية المعلومات أو من هندسة المنشآت.',
        en: 'IT security entry (Security+/CEH via Tuwaiq cybersecurity bootcamp), then ICS-specific credentials (ISA/IEC 62443, SANS ICS courses) — most OT security engineers convert from IT security or from plant engineering.',
      },
    },
    verdict: {
      ar: 'أعلى المنافذ السيبرانية أثرًا في الحالة السعودية تحديدًا: الضوابط الوطنية تفرضه، والبنية الحرجة تموله، وقلة من المهندسين تجمع الأمن بمعرفة المنشآت — توقع مشغلين من قطاع الطاقة وبدلات مناوبة وبوابات تصاريح أمنية.',
      en: 'The highest-leverage cyber niche for Saudi Arabia specifically: national controls mandate it, critical infrastructure funds it, and very few engineers combine security with plant knowledge — expect energy-sector employers, shift allowances and security-clearance gates.',
    },
    matching: {
      interestKeys: ['build_tech'],
      aptitudeKeys: ['math_strong'],
      learningStyles: ['apprenticeship', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'health_informatics_specialist',
    name: { ar: 'أخصائي معلوماتية صحية', en: 'Health Informatics Specialist' },
    category: 'healthcare',
    signal: 'GROWING',
    evidence: {
      ar: 'رقمنة الصحة السعودية سياسة وطنية: مستشفى صحة الافتراضي مسجل في غينيس كأكبر مستشفى افتراضي عالميًا، وتلزم منصة نفيس بتبادل موحد للبيانات الصحية بين مقدمي الرعاية وشركات التأمين، وتتوسع السجلات الإلكترونية عبر التجمعات الصحية؛ ويصنف تقرير مستقبل الوظائف 2025 الرعاية الصحية ضمن أكبر القطاعات نموًا ومهارات البيانات والذكاء الاصطناعي كأسرعها — وهذا الدور يقع عند تقاطعهما.',
      en: "Saudi health digitization is national policy: the SeHA Virtual Hospital is Guinness-recognized as the world's largest virtual hospital, the NPHIES platform mandates unified health-data exchange between providers and insurers, and hospital digitization (EHIC-class electronic records) rolls out across clusters; WEF FoJ 2025 counts healthcare among the largest-growing sectors and data/AI skills as the fastest-growing — this role sits at their intersection.",
    },
    automationExposure: 'medium',
    automationJustification: {
      ar: 'التوثيق السريري والترميز مهام نصية قابلة للأتمتة بالذكاء الاصطناعي التوليدي، لكن المساءلة عن حوكمة بيانات المرضى وتصميم التشغيل البيني وإدارة تغيير المسارات السريرية تتطلب سلطة بشرية — وفي السعودية تجعل معالجة البيانات الصحية الخاضعة لنظام حماية البيانات الدور إلزاميًا عمليًا.',
      en: 'Clinical documentation and coding are GenAI-automatable text tasks, but data-governance accountability for patient data, interoperability design and clinical-workflow change management require human authority — and in Saudi Arabia, PDPL-regulated handling of health data makes the role mandatory in practice.',
    },
    aiAugmentation: {
      ar: 'الكاتب الآلي ومساعدو الترميز ودعم القرار السريري تدخل المستشفيات السعودية؛ والأخصائي المعلوماتي يهيئها ويتحقق منها ويحكمها — فلا يمكن للمستشفيات نشر ذكاء اصطناعي سريري دون هذه الوظيفة.',
      en: 'AI scribes, coding assistants and clinical decision support are entering Saudi hospitals; the informatics specialist configures, validates and governs them — hospitals cannot deploy clinical AI without this function.',
    },
    keySkills: ['data_literacy', 'ai_use', 'analytical_thinking', 'digital_policy', 'empathy_care'],
    pathways: {
      degree: {
        ar: 'بكالوريوس معلوماتية صحية أو إدارة معلومات صحية (جامعة الملك سعود بن عبدالعزيز للعلوم الصحية وغيرها)، أو درجة سريرية مع ماجستير معلوماتية للمسار الأعلى قيمة.',
        en: 'BSc health informatics or health-information management (King Saud bin Abdulaziz University for Health Sciences and others), or clinical degree + informatics masters for the premium track.',
      },
      skillsFirst: {
        ar: 'شهادات تحليل البيانات الصحية (Coursera/edX)، ومسارات البيانات في أكاديمية سدايا، وشهادات مورّدي السجلات الصحية (أنظمة فئة Oracle Health وEpic المستخدمة في التجمعات السعودية)، وتدريب التكامل مع نفيس.',
        en: 'Health-data analytics certificates (Coursera/edX), SDAIA Academy data tracks, EHR vendor certifications (Oracle Health/Cerner, Epic-class systems used in Saudi clusters), NPHIES integration training.',
      },
    },
    verdict: {
      ar: 'نعم — هجين حقيقي نادر العرض: المستشفيات السعودية ملزمة بالرقمنة وبامتثال حماية البيانات، وقلة يجيدون اللغة السريرية والرقمية معًا؛ توقع رعاية أصحاب العمل للشهادات وترقيات سريعة للملفات ثنائية اللغة والمجال.',
      en: 'Yes — a genuinely undersupplied hybrid: Saudi hospitals must digitize and must comply with data-protection law, and very few people speak both clinical and data language; expect employer sponsorship of certifications and fast promotion for bilingual (Arabic/English + clinical/technical) profiles.',
    },
    matching: {
      interestKeys: ['numbers_logic', 'people_care'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['structured_classroom', 'project_based'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
  {
    id: 'elderly_care_specialist',
    name: { ar: 'أخصائي رعاية مسنين وخدمات اجتماعية', en: 'Elderly Care & Social Services Specialist' },
    category: 'healthcare',
    signal: 'GROWING',
    evidence: {
      ar: 'تقرير مستقبل الوظائف 2025: أدوار اقتصاد الرعاية (الأخصائيون الاجتماعيون والمستشارون ومساعدو الرعاية الشخصية) ضمن الأكبر نموًا عالميًا بالأرقام المطلقة مدفوعة بالشيخوخة؛ والسعودية ما زالت شابة (كبار السن حصة صغيرة) لكن فئة فوق 65 تنمو بسرعة من قاعدة منخفضة، وتوسّع وزارة الموارد البشرية والتنمية الاجتماعية برامج الرعاية المنزلية وخدمات المسنين — فالطلب يُبنى بالسياسات قبل منحنى الديموغرافيا.',
      en: "WEF FoJ 2025: care-economy roles (social work & counselling professionals, personal care aides) are among the largest-growing globally in absolute numbers, driven by aging; Saudi Arabia is still young (seniors are a small share of the population) but its 65+ cohort is growing fast from that base, and the Ministry of Human Resources and Social Development is expanding home-care and elderly-services programs — demand is policy-built ahead of the demographic curve.",
    },
    automationExposure: 'low',
    automationJustification: {
      ar: 'المؤانسة والرعاية الشخصية والوساطة الأسرية هي الأقل قابلية للأتمتة في الاقتصاد وفق تحليلات مهام منظمة العمل الدولية وMcKinsey؛ والروبوتات المساعدة تعزز الحمل والمراقبة لكن علاقة الرعاية هي الخدمة ذاتها.',
      en: 'Companionship, personal care and family mediation are the least automatable work in the economy per ILO/McKinsey task analyses; assistive robots augment lifting and monitoring but the care relationship is the service itself.',
    },
    aiAugmentation: {
      ar: 'لوحات المراقبة عن بُعد وكشف السقوط بالذكاء الاصطناعي يمدان نطاق كل مقدم رعاية؛ وحكم الأخصائي — متى يصعّد الحالة وما تحتاجه الأسرة — هو المهارة المدفوعة.',
      en: "Remote-monitoring dashboards and AI fall-detection extend each caregiver's reach; the specialist's judgment — when to escalate, what families need — is the billable skill.",
    },
    keySkills: ['empathy_care', 'resilience', 'leadership', 'data_literacy', 'curiosity_lifelong_learning'],
    pathways: {
      degree: {
        ar: 'درجات الخدمة الاجتماعية أو علم النفس (الجامعات السعودية كبرامج الخدمة الاجتماعية في جامعة الأميرة نورة)، ثم مسارات الممارسة المرخّصة عبر وزارة الموارد البشرية؛ وجسور التمريض للرعاية السريرية للمسنين.',
        en: 'Social work or psychology degrees (Saudi universities, e.g., Princess Nourah University social-service programs), then MHRSD-licensed practice tracks; nursing bridges for clinical elderly care.',
      },
      skillsFirst: {
        ar: 'دبلومات الرعاية من التدريب التقني، وشهادات مساعدي الرعاية المنزلية، وبرامج وزارة الموارد البشرية لمقدمي الرعاية الاجتماعية؛ وترخيص منشآت الرعاية يخلق أدوار دخول تحت الإشراف.',
        en: "TVTC care diplomas, home-care aide certifications, MHRSD training programs for social-care providers; the sector's licensing of care facilities creates supervised entry roles.",
      },
    },
    verdict: {
      ar: 'مهنة إنسانية محصنة للمستقبل تصل مبكرًا إلى السعودية: الدليل العالمي قاطع (أعمال الرعاية تنمو في كل مكان وتقاوم الأتمتة)، والبرامج الوطنية تبني القطاع الآن — اقبل أجورًا أولية متواضعة؛ فالحساب الديموغرافي يضمن أهمية هذا المجال بحلول 2035.',
      en: "A future-proof human career arriving early in Saudi Arabia: global evidence is unambiguous (care work grows everywhere and resists automation), and national programs are building the sector now — accept modest early wages; the demographic math guarantees this field's importance by 2035.",
    },
    matching: {
      interestKeys: ['people_care'],
      aptitudeKeys: ['mixed'],
      learningStyles: ['apprenticeship', 'structured_classroom'],
      minCommitment: 'y1_3',
      degreeCommitment: 'y4_6',
      licenseRequired: false,
    },
  },
]


// ── Per-career provenance & Saudi demand notes ─────────────────────────────
// source: the origin of each card's quantitative claims (rendered in the UI).
// saudiNote: local demand driver — the Saudi localization layer.

export const careerProvenance: Record<string, { source: L; saudiNote: L }> = {
  general_medicine: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · منظمة العمل الدولية 2025', en: 'WEF FoJ 2025 · ILO 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: التوسع في القطاع الصحي والتوطين ونمو السكان — لا الشيخوخة كما في الاقتصادات المتقدمة.', en: 'Local demand driver: health-sector expansion, localization and population growth — not aging as in advanced economies.' },
  },
  nursing: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (~3.1 مليون وظيفة متوقعة عالميًا)', en: 'WEF FoJ 2025 (~3.1M expected jobs globally)' },
    saudiNote: { ar: 'محرك الطلب المحلي: نسب توطين التمريض والتوسع في المستشفيات — الطلب سعودي المنشأ أكثر منه ديموغرافي.', en: 'Local demand driver: nursing Saudization quotas and hospital expansion — demand is Saudi-driven more than demographic.' },
  },
  pharmacy: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · تحليل مهام McKinsey', en: 'WEF FoJ 2025 · McKinsey task analysis' },
    saudiNote: { ar: 'انتبه: نمو الصيدليات المجتمعية سعوديًا تاريخيًا كثيف العمالة الوافدة؛ الفرص الأقوى في السريرية والصناعة والشؤون التنظيمية.', en: 'Note: Saudi community pharmacy has historically been expatriate-heavy; the stronger openings are clinical, industrial and regulatory-affairs roles.' },
  },
  software_development: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+60% متوقعة) · Coursera 2025 (استطلاع)', en: 'WEF FoJ 2025 (+60% expected) · Coursera 2025 (survey)' },
    saudiNote: { ar: 'محرك الطلب المحلي: التحول الرقمي الحكومي وقطاع التقنية المالية؛ وتفيد طويق بتوظيف ~80% من خريجي معسكراتها (رقم ذاتي الإبلاغ).', en: 'Local demand driver: government digital transformation and fintech; Tuwaiq self-reports ~80% bootcamp placement.' },
  },
  civil_engineering: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · تقارير صحفية 2025 (Bloomberg/FT) عن إعادة تحجيم ذا لاين', en: 'WEF FoJ 2025 · 2025 press reports (Bloomberg/FT) on The Line rescoping' },
    saudiNote: { ar: 'محرك الطلب المحلي: مشاريع رؤية 2030 — مع ملاحظة أن بعضها أُعيد تحجيمه؛ الطلب حقيقي لكنه مرتبط بدورة المشاريع.', en: 'Local demand driver: Vision 2030 projects — noting some were rescoped; demand is real but tied to the project cycle.' },
  },
  electrical_engineering: {
    source: { ar: 'WEF مستقبل الوظائف 2025', en: 'WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: توسع الشبكة ومستهدفات الطاقة المتجددة وبنية شحن المركبات الكهربائية.', en: 'Local demand driver: grid expansion, renewables targets and EV-charging infrastructure.' },
  },
  data_scientist: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+110% متوقعة) · Coursera 2025 (استطلاع: 75% من الشركات السعودية المشاركة)', en: 'WEF FoJ 2025 (+110% expected) · Coursera 2025 (survey: 75% of participating Saudi companies)' },
    saudiNote: { ar: 'محرك الطلب المحلي: استراتيجية سدايا الوطنية للبيانات والذكاء الاصطناعي؛ تتركز الوظائف في الرياض أساسًا.', en: 'Local demand driver: SDAIA’s national data & AI strategy; jobs concentrate mainly in Riyadh.' },
  },
  ai_ml_specialist: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+85% متوقعة) · Coursera 2025 (استطلاع: +165% تسجيلات سعودية)', en: 'WEF FoJ 2025 (+85% expected) · Coursera 2025 (survey: +165% Saudi enrollments)' },
    saudiNote: { ar: 'محرك الطلب المحلي: استثمار وطني ضخم في الذكاء الاصطناعي (سدايا/هيومين) مع مسارات معسكرات مجانية.', en: 'Local demand driver: heavy national AI investment (SDAIA/HUMAIN) with free bootcamp pipelines.' },
  },
  data_analyst: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+40% متوقعة) · LinkedIn 2025 · Coursera 2025', en: 'WEF FoJ 2025 (+40% expected) · LinkedIn 2025 · Coursera 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: كل قطاع يبني وحدات تحليل؛ أوسع مهنة تقنية دخولًا في السوق السعودي.', en: 'Local demand driver: every sector is building analytics units; the most accessible tech-adjacent entry in the Saudi market.' },
  },
  cybersecurity_analyst: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+55%/+40% متوقعة) · ISC2 (تقدير النقص) · Coursera 2025 (استطلاع ذاتي)', en: 'WEF FoJ 2025 (+55%/+40% expected) · ISC2 (shortfall estimate) · Coursera 2025 (self-reported survey)' },
    saudiNote: { ar: 'محرك الطلب المحلي: منظومة الهيئة الوطنية للأمن السيبراني ومتطلبات الامتثال على الجهات.', en: 'Local demand driver: the National Cybersecurity Authority ecosystem and compliance mandates on entities.' },
  },
  school_teacher: {
    source: { ar: 'WEF مستقبل الوظائف 2025', en: 'WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: ديموغرافيا شابة وتوسع مدارس — لكن المنافسة على الوظائف الحكومية مرتفعة.', en: 'Local demand driver: young demographics and school expansion — but competition for public posts is high.' },
  },
  university_lecturer: {
    source: { ar: 'WEF مستقبل الوظائف 2025', en: 'WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: توسع الجامعات وبرامج الابتعاث؛ مسار طويل وتنافسي.', en: 'Local demand driver: university expansion and scholarship programs; a long, competitive track.' },
  },
  lawyer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · منظمة العمل الدولية 2025', en: 'WEF FoJ 2025 · ILO 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: توسع الأنظمة التجارية (الشركات، التحكيم) وقطاعات الترفيه والسياحة الجديدة.', en: 'Local demand driver: expanding commercial law (companies, arbitration) and new entertainment/tourism sectors.' },
  },
  legal_secretary: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (قائمة التراجع)', en: 'WEF FoJ 2025 (declining list)' },
    saudiNote: { ar: 'ملاحظة: «السكرتارية القانونية» هنا هي الفئة الكتابية الداعمة (Paralegal/Legal Secretary) وليست كاتب العدل السعودي المرسّم.', en: 'Note: “legal secretary” here is the clerical support category (Paralegal/Legal Secretary), not Saudi Arabia’s commissioned notary (كاتب العدل).' },
  },
  accountant_auditor: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · McKinsey', en: 'WEF FoJ 2025 · McKinsey' },
    saudiNote: { ar: 'محرك الطلب المحلي: توسع السوق المالية والفوترة الإلكترونية (هيئة الزكاة) يرفع الطلب على الاستشاريين لا كتّاب القيود.', en: 'Local demand driver: capital-market growth and e-invoicing (ZATCA) lift demand for advisors, not ledger clerks.' },
  },
  bookkeeping_clerk: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (المرتبة 7 تراجعًا)', en: 'WEF FoJ 2025 (#7 declining)' },
    saudiNote: { ar: 'البديل المحلي الأقرب: التحليل المحاسبي وامتثال الفوترة الإلكترونية — شهادات قصيرة متاحة وطنيًا.', en: 'Closest local pivot: accounting analysis and e-invoicing compliance — short credentials available nationally.' },
  },
  fintech_engineer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+95% متوقعة)', en: 'WEF FoJ 2025 (+95% expected)' },
    saudiNote: { ar: 'محرك الطلب المحلي: المصرفية المفتوحة ومدفوعات البنك المركزي وسباق اللانقدية.', en: 'Local demand driver: open banking, central-bank payments push and the cashless race.' },
  },
  graphic_designer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (المرتبة 11 تراجعًا)', en: 'WEF FoJ 2025 (#11 declining)' },
    saudiNote: { ar: 'البديل المحلي الأقوى: تجربة المستخدم وهوية العلامة للمنتجات الرقمية العربية.', en: 'Stronger local alternative: UX and brand identity for Arabic-first digital products.' },
  },
  ui_ux_designer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+45% متوقعة) · LinkedIn 2025', en: 'WEF FoJ 2025 (+45% expected) · LinkedIn 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: منتجات الحكومة الرقمية والتقنية المالية تحتاج مصممي تجربة ثنائيي اللغة.', en: 'Local demand driver: digital-government and fintech products need bilingual experience designers.' },
  },
  digital_marketing: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · LinkedIn 2025 · Coursera 2025 (استطلاع)', en: 'WEF FoJ 2025 · LinkedIn 2025 · Coursera 2025 (survey)' },
    saudiNote: { ar: 'محرك الطلب المحلي: نمو التجارة الإلكترونية والمحتوى العربي؛ القياس والتحليل هما الفارق.', en: 'Local demand driver: e-commerce growth and Arabic content; measurement and analytics are the differentiator.' },
  },
  traditional_sales: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (المرتبة 10 و15 تراجعًا)', en: 'WEF FoJ 2025 (#10 & #15 declining)' },
    saudiNote: { ar: 'البديل المحلي: المبيعات الاستشارية بين الشركات في قطاعات التقنية والخدمات.', en: 'Local alternative: consultative B2B sales in tech and services sectors.' },
  },
  hr_specialist: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · LinkedIn 2025', en: 'WEF FoJ 2025 · LinkedIn 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: برامج التوطين تجعل إدارة المواهب الاستراتيجية مطلوبة في كل منشأة كبيرة.', en: 'Local demand driver: Saudization programs make strategic talent management needed in every large employer.' },
  },
  training_development: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (59/100 عامل) · Coursera 2025 (استطلاع: 82%)', en: 'WEF FoJ 2025 (59/100 workers) · Coursera 2025 (survey: 82%)' },
    saudiNote: { ar: 'محرك الطلب المحلي: موجة إعادة التأهيل الوطنية (برنامج تنمية القدرات البشرية) تصنع طلبًا على مصممي التدريب.', en: 'Local demand driver: the national reskilling wave (Human Capability Development Program) creates demand for training designers.' },
  },
  supply_chain_specialist: {
    source: { ar: 'WEF مستقبل الوظائف 2025', en: 'WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: استراتيجية المركز اللوجستي العالمي (موانئ وسكك ومناطق خاصة).', en: 'Local demand driver: the global logistics-hub strategy (ports, rail, special zones).' },
  },
  delivery_driver: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+45% متوقعة)', en: 'WEF FoJ 2025 (+45% expected)' },
    saudiNote: { ar: 'تنبيه محلي صريح: التوصيل الأخير في السعودية كثيف العمالة الوافدة؛ القابلية لتوظيف السعوديين فيه منخفضة أجورًا وتنافسية — تعامل معه كدخل مؤقت فقط.', en: 'Frank local note: last-mile delivery in Saudi Arabia is expatriate-labor-intensive; Saudi employability here is low-wage and competitive — treat it as temporary income only.' },
  },
  electrician: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · منظمة العمل الدولية 2025', en: 'WEF FoJ 2025 · ILO 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: الإنشاءات والكهرباء (مركبات كهربائية، طاقة شمسية) — ودبلومات التدريب التقني طريق معترف به.', en: 'Local demand driver: construction and electrification (EVs, solar) — TVTC diplomas are a recognized route.' },
  },
  renewable_energy_technician: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+40% متوقعة)', en: 'WEF FoJ 2025 (+40% expected)' },
    saudiNote: { ar: 'محرك الطلب المحلي: مشاريع الطاقة الشمسية العملاقة ضمن مزيج الطاقة 2030.', en: 'Local demand driver: utility-scale solar projects under the 2030 energy mix.' },
  },
  renewable_energy_engineer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (+40% متوقعة)', en: 'WEF FoJ 2025 (+40% expected)' },
    saudiNote: { ar: 'محرك الطلب المحلي: تحول الطاقة الوطني؛ يتطلب الدرجة الجامعية والتسجيل المهني.', en: 'Local demand driver: the national energy transition; requires the degree and professional registration.' },
  },
  government_admin_officer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 · البنك الدولي/الموارد البشرية 2025 (52.8%)', en: 'WEF FoJ 2025 · World Bank/HRSD 2025 (52.8%)' },
    saudiNote: { ar: 'محرك الطلب المحلي: التحول الرقمي الحكومي يخلق أدوارًا رقمية جديدة — لكن التوظيف الجديد للسعوديين يتركز في القطاع الخاص.', en: 'Local demand driver: government digital transformation creates new digital roles — but most new Saudi hiring is in the private sector.' },
  },
  data_entry_clerk: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (المرتبة 3 تراجعًا) · منظمة العمل الدولية 2025', en: 'WEF FoJ 2025 (#3 declining) · ILO 2025' },
    saudiNote: { ar: 'البديل المحلي الأقرب: شهادة تحليل بيانات (6 أشهر) — نقلة مباشرة إلى مهنة نامية.', en: 'Closest local pivot: a data-analysis certificate (6 months) — a direct move into a growing career.' },
  },
}

export const careerById = (id: string): Career | undefined => careers.find((c) => c.id === id)

// ── P1-6: split automation exposure (GenAI vs robotic/mechanical) + time horizon ──
// Per the labor-economist review: the two automation channels have different
// mechanisms and clocks, and conflating them misleads.

export type HorizonKey = 'short' | 'medium' | 'long'

export const horizonNoteMeta: Record<HorizonKey, L> = {
  short: { ar: 'قصير المدى — التحول جارٍ الآن وخلال 1–3 سنوات', en: 'Short horizon — change happening now and over 1–3 years' },
  medium: { ar: 'متوسط المدى — الأثر الأكبر خلال 3–7 سنوات', en: 'Medium horizon — the larger impact lands within 3–7 years' },
  long: { ar: 'بعيد المدى — التحول البنيوي يتجاوز 2030 غالبًا', en: 'Long horizon — structural change mostly beyond 2030' },
}

export interface ExposureDetail {
  genai: Exposure // text/software-like task automation (LLMs)
  robotic: Exposure // physical/robotic/mechanical automation
  horizon: HorizonKey
}

export const careerExposureDetail: Record<string, ExposureDetail> = {
  general_medicine: { genai: 'medium', robotic: 'low', horizon: 'long' },
  nursing: { genai: 'medium', robotic: 'low', horizon: 'long' },
  pharmacy: { genai: 'medium', robotic: 'high', horizon: 'medium' },
  software_development: { genai: 'high', robotic: 'low', horizon: 'short' },
  civil_engineering: { genai: 'low', robotic: 'low', horizon: 'long' },
  electrical_engineering: { genai: 'low', robotic: 'low', horizon: 'long' },
  data_scientist: { genai: 'high', robotic: 'low', horizon: 'short' },
  ai_ml_specialist: { genai: 'medium', robotic: 'low', horizon: 'short' },
  data_analyst: { genai: 'high', robotic: 'low', horizon: 'short' },
  cybersecurity_analyst: { genai: 'medium', robotic: 'low', horizon: 'medium' },
  school_teacher: { genai: 'medium', robotic: 'low', horizon: 'long' },
  university_lecturer: { genai: 'medium', robotic: 'low', horizon: 'long' },
  lawyer: { genai: 'high', robotic: 'low', horizon: 'medium' },
  legal_secretary: { genai: 'high', robotic: 'low', horizon: 'short' },
  accountant_auditor: { genai: 'high', robotic: 'low', horizon: 'short' },
  bookkeeping_clerk: { genai: 'high', robotic: 'low', horizon: 'short' },
  fintech_engineer: { genai: 'medium', robotic: 'low', horizon: 'medium' },
  graphic_designer: { genai: 'high', robotic: 'low', horizon: 'short' },
  ui_ux_designer: { genai: 'medium', robotic: 'low', horizon: 'medium' },
  digital_marketing: { genai: 'high', robotic: 'low', horizon: 'short' },
  traditional_sales: { genai: 'high', robotic: 'low', horizon: 'short' },
  hr_specialist: { genai: 'medium', robotic: 'low', horizon: 'medium' },
  training_development: { genai: 'medium', robotic: 'low', horizon: 'medium' },
  supply_chain_specialist: { genai: 'medium', robotic: 'medium', horizon: 'medium' },
  delivery_driver: { genai: 'low', robotic: 'high', horizon: 'long' },
  electrician: { genai: 'low', robotic: 'low', horizon: 'long' },
  renewable_energy_technician: { genai: 'low', robotic: 'low', horizon: 'long' },
  renewable_energy_engineer: { genai: 'medium', robotic: 'low', horizon: 'long' },
  government_admin_officer: { genai: 'high', robotic: 'low', horizon: 'short' },
  data_entry_clerk: { genai: 'high', robotic: 'low', horizon: 'short' },
}

// ── P1-3: admission-reality notes (licensed/degree careers) ────────────────
// Qualitative and honest — no invented cutoffs.

export const careerAdmissionNotes: Record<string, L> = {
  general_medicine: {
    ar: 'القبول: يتطلب اختبار القدرات ثم التحصيلي ضمن نسبة موزونة تنافسية جدًا في الجامعات الكبرى (مقاعد الطب محدودة)، ثم 6 سنوات دراسة وسنة امتياز وترخيص الهيئة السعودية للتخصصات الصحية. التكلفة: دراسة حكومية شبه مجانية لكن الاستثمار الزمني هو الأعلى في القائمة.',
    en: 'Admission: requires the Qudurat then Tahsili exams within a highly competitive weighted score at major universities (medical seats are limited), then 6 years of study, internship year and SCFHS licensure. Cost: near-free public tuition, but the time investment is the highest on this list.',
  },
  nursing: {
    ar: 'القبول: نسبة موزونة أقل تنافسية من الطب مع اختبار تحصيلي؛ الترخيص عبر الهيئة السعودية للتخصصات الصحية بعد التخرج. دبلومات الكليات الصحية (TVTC) مدخل أقصر للأدوار المساندة.',
    en: 'Admission: a less competitive weighted score than medicine, with the Tahsili exam; SCFHS licensure after graduation. TVTC health-college diplomas are a shorter entry into support roles.',
  },
  pharmacy: {
    ar: 'القبول: نسبة موزونة متوسطة-مرتفعة مع تحصيلي علمي؛ الترخيص عبر الهيئة السعودية للتخصصات الصحية. الإقامات السريرية بعد التخرج تنافسية وتصنع الفارق.',
    en: 'Admission: a moderately high weighted score with a science Tahsili; SCFHS licensure. Post-graduate clinical residencies are competitive and make the difference.',
  },
  civil_engineering: {
    ar: 'القبول: تحصيلي + نسبة موزونة لكليات الهندسة؛ التسجيل في الهيئة السعودية للمهندسين بعد التخرج شرط للتوقيع الهندسي. الدبلومات التقنية (TVTC) مدخل موازٍ لأدوار الفنيين.',
    en: 'Admission: Tahsili + weighted score for engineering colleges; Saudi Council of Engineers registration after graduation is required for engineering sign-off. TVTC diplomas are a parallel entry for technician roles.',
  },
  electrical_engineering: {
    ar: 'القبول: كالهندسة المدنية (تحصيلي + نسبة موزونة + تسجيل الهيئة السعودية للمهندسين). تخصصات الطاقة تفتح مسارات المشاريع الوطنية.',
    en: 'Admission: as per civil engineering (Tahsili + weighted score + Saudi Council of Engineers registration). Energy specializations open national-project tracks.',
  },
  renewable_energy_engineer: {
    ar: 'القبول: مسار هندسي كامل (تحصيلي + نسبة موزونة + تسجيل مهني)؛ ماجستير الطاقة يزيد التنافسية لكنه ليس شرط دخول.',
    en: 'Admission: a full engineering track (Tahsili + weighted score + professional registration); an energy masters raises competitiveness but is not an entry requirement.',
  },
  lawyer: {
    ar: 'القبول: كليات الأنظمة/القانون بنسب موزونة متوسطة؛ ترخيص المحاماة يتطلب التدريب بعد التخرج. مسار الامتثال والتقنية القانونية لا يتطلب ترخيصًا.',
    en: 'Admission: law schools at moderate weighted scores; legal-practice licensure requires post-graduate training. The compliance/legal-tech route needs no license.',
  },
  school_teacher: {
    ar: 'القبول: بكالوريوس تربوي أو تخصصي + مؤهل تعليمي وترخيص وزارة التعليم للمدارس الحكومية؛ المفاضلة على الوظائف التعليمية تنافسية في المدن الكبرى.',
    en: 'Admission: an education or subject degree + teaching qualification and Ministry of Education licensure for public schools; competition for teaching posts is strong in major cities.',
  },
  university_lecturer: {
    ar: 'القبول: ماجستير فدكتوراه (غالبًا عبر الابتعاث الحكومي أو منح الجامعات) ثم مفاضلة أكاديمية — المسار الأطول والأكثر تنافسية هنا.',
    en: 'Admission: masters then PhD (often via government scholarships or university grants) followed by academic competition — the longest and most competitive track here.',
  },
}

// ── P1-14: ISCO-08 mapping (best-effort, marked approximate) ───────────────
export const careerIsco: Record<string, { code: string; label: L }> = {
  general_medicine: { code: '2211', label: { ar: 'أطباء عامون', en: 'Generalist medical practitioners' } },
  nursing: { code: '2221', label: { ar: 'مختصو تمريض', en: 'Nursing professionals' } },
  pharmacy: { code: '2262', label: { ar: 'صيادلة', en: 'Pharmacists' } },
  software_development: { code: '2512', label: { ar: 'مطورو برمجيات', en: 'Software developers' } },
  civil_engineering: { code: '2142', label: { ar: 'مهندسون مدنيون', en: 'Civil engineers' } },
  electrical_engineering: { code: '2151', label: { ar: 'مهندسون كهربائيون', en: 'Electrical engineers' } },
  data_scientist: { code: '2120', label: { ar: 'رياضياتيون وإحصائيون', en: 'Mathematicians & statisticians' } },
  ai_ml_specialist: { code: '2519', label: { ar: 'مختصو برمجيات آخرون', en: 'Software professionals n.e.c.' } },
  data_analyst: { code: '2120', label: { ar: 'رياضياتيون وإحصائيون', en: 'Mathematicians & statisticians' } },
  cybersecurity_analyst: { code: '2529', label: { ar: 'مختصو قواعد بيانات وشبكات آخرون', en: 'Database & network professionals n.e.c.' } },
  school_teacher: { code: '2330', label: { ar: 'معلمو تعليم ثانوي', en: 'Secondary education teachers' } },
  university_lecturer: { code: '2310', label: { ar: 'أساتذة تعليم عالٍ', en: 'Higher education teachers' } },
  lawyer: { code: '2611', label: { ar: 'محامون', en: 'Lawyers' } },
  legal_secretary: { code: '3411', label: { ar: 'مساعدون قانونيون', en: 'Legal associate professionals' } },
  accountant_auditor: { code: '2411', label: { ar: 'محاسبون', en: 'Accountants' } },
  bookkeeping_clerk: { code: '4311', label: { ar: 'كتبة محاسبة', en: 'Accounting clerks' } },
  fintech_engineer: { code: '2512', label: { ar: 'مطورو برمجيات', en: 'Software developers' } },
  graphic_designer: { code: '2166', label: { ar: 'مصممو جرافيك ووسائط', en: 'Graphic & multimedia designers' } },
  ui_ux_designer: { code: '2166', label: { ar: 'مصممو جرافيك ووسائط', en: 'Graphic & multimedia designers' } },
  digital_marketing: { code: '2431', label: { ar: 'مختصو إعلان وتسويق', en: 'Advertising & marketing professionals' } },
  traditional_sales: { code: '5211', label: { ar: 'باعة جائلون وأسواق', en: 'Stall & market salespersons' } },
  hr_specialist: { code: '2423', label: { ar: 'مختصو شؤون موظفين', en: 'Personnel & careers professionals' } },
  training_development: { code: '2424', label: { ar: 'مختصو تدريب وتطوير', en: 'Training & staff development professionals' } },
  supply_chain_specialist: { code: '1323', label: { ar: 'مديرو إنتاج ولوجستيات', en: 'Production & logistics managers' } },
  delivery_driver: { code: '8322', label: { ar: 'سائقو سيارات وشاحنات خفيفة', en: 'Car & light-van drivers' } },
  electrician: { code: '7411', label: { ar: 'كهربائيو مبانٍ', en: 'Building electricians' } },
  renewable_energy_technician: { code: '3113', label: { ar: 'فنيو طاقة', en: 'Energy technicians' } },
  renewable_energy_engineer: { code: '2151', label: { ar: 'مهندسون كهربائيون', en: 'Electrical engineers' } },
  government_admin_officer: { code: '3343', label: { ar: 'مساعدون إداريون مختصون', en: 'Administrative associate professionals' } },
  data_entry_clerk: { code: '4132', label: { ar: 'كتبة إدخال بيانات', en: 'Data entry clerks' } },
}

// ── P1-16: women's labour-market notes (only sourced figures — GASTAT) ─────
// Global context line used on the Lists page; per-career notes below.

export const womenMarketNote: L = {
  ar: 'مشاركة المرأة السعودية في سوق العمل بلغت 36.3% (الربع الأول 2025، الهيئة العامة للإحصاء) متجاوزةً مستهدف رؤية 2030 البالغ 30% — والأدوار الرقمية وذات الطبيعة الهجينة (عن بُعد/مرنة) تفتح أبوابًا أوسع، بينما تبقى بعض القطاعات الميدانية بنيويًا مختلفة الفرص.',
  en: 'Saudi female labour-force participation reached 36.3% (Q1 2025, GASTAT) — past the Vision 2030 target of 30%. Digital and hybrid/remote-friendly roles open wider doors, while some field sectors remain structurally different in opportunity.',
}

export const careerWomenNotes: Record<string, L> = {
  nursing: { ar: 'التمريض من أكثر المهن الصحية توطينًا للسعوديات، مع مسارات قيادية متنامية في التمريض والجودة.', en: 'Nursing is among the most Saudized health professions for women, with growing leadership tracks in nursing and quality.' },
  school_teacher: { ar: 'التعليم تاريخيًا من أوسع مهن السعوديات استيعابًا، وتقنيات التعليم تضيف مسارات جديدة.', en: 'Teaching has historically been one of the widest employers of Saudi women, and EdTech adds new tracks.' },
  data_analyst: { ar: 'التحليلات من الأدوار الأكثر توافقًا مع العمل الهجين — ميزة واقعية لمن يوازن مسؤوليات عديدة.', en: 'Analytics is among the most hybrid-friendly roles — a practical advantage for those balancing many responsibilities.' },
  software_development: { ar: 'معسكرات طويق والأكاديميات الوطنية لديها مسارات نسائية نشطة، والعمل عن بُعد شائع في القطاع.', en: 'Tuwaiq and national academies run active women’s tracks, and remote work is common in the sector.' },
  ui_ux_designer: { ar: 'منتجات الحكومة الرقمية تخدم ملايين النساء — مصممات التجربة يُحدثن فرقًا مباشرًا فيها.', en: 'Digital-government products serve millions of women — women experience designers make a direct difference in them.' },
  hr_specialist: { ar: 'إدارة المواهب من المجالات التي تقود فيها السعوديات أدوارًا قيادية ملحوظة.', en: 'Talent management is a field where Saudi women visibly hold leadership roles.' },
  digital_marketing: { ar: 'المحتوى العربي الموجه للمستهلكات سوق متنامٍ — والفهم الثقافي المباشر ميزة تنافسية.', en: 'Arabic content aimed at women consumers is a growing market — direct cultural insight is a competitive edge.' },
  training_development: { ar: 'موجة إعادة التأهيل الوطنية تفتح مسارات تيسير وتصميم تعلم مناسبة للعمل المرن.', en: 'The national reskilling wave opens facilitation and learning-design tracks suited to flexible work.' },
  general_medicine: { ar: 'الكليات الصحية السعودية تخرّج أعدادًا متزايدة من الطبيبات، والتخصصات السريرية مفتوحة على التنافس المباشر.', en: 'Saudi health colleges graduate growing numbers of women physicians, and clinical specialties are open to direct competition.' },
}

// ── v4 companion-map entries ──
export const v4Exposure: Record<string, { genai: 'low' | 'medium' | 'high'; robotic: 'low' | 'medium' | 'high'; horizon: 'short' | 'medium' | 'long' }> = {
  tour_guide: { genai: 'medium', robotic: 'low', horizon: 'long' },
  event_manager: { genai: 'medium', robotic: 'low', horizon: 'medium' },
  commercial_pilot: { genai: 'low', robotic: 'medium', horizon: 'long' },
  sports_coach: { genai: 'low', robotic: 'low', horizon: 'long' },
  game_designer: { genai: 'high', robotic: 'low', horizon: 'short' },
  museum_heritage_specialist: { genai: 'medium', robotic: 'low', horizon: 'long' },
  logistics_manager: { genai: 'medium', robotic: 'high', horizon: 'medium' },
  mining_engineer: { genai: 'low', robotic: 'medium', horizon: 'long' },
  solar_pv_engineer: { genai: 'low', robotic: 'low', horizon: 'long' },
  water_environment_engineer: { genai: 'low', robotic: 'medium', horizon: 'long' },
  agritech_specialist: { genai: 'low', robotic: 'medium', horizon: 'medium' },
  maritime_officer: { genai: 'low', robotic: 'medium', horizon: 'long' },
  real_estate_manager: { genai: 'high', robotic: 'low', horizon: 'medium' },
  media_producer: { genai: 'high', robotic: 'low', horizon: 'short' },
  satellite_engineer: { genai: 'low', robotic: 'low', horizon: 'long' },
  fintech_product_specialist: { genai: 'high', robotic: 'low', horizon: 'medium' },
  legaltech_compliance_officer: { genai: 'high', robotic: 'low', horizon: 'short' },
  ot_security_engineer: { genai: 'medium', robotic: 'low', horizon: 'medium' },
  health_informatics_specialist: { genai: 'high', robotic: 'low', horizon: 'short' },
  elderly_care_specialist: { genai: 'low', robotic: 'low', horizon: 'long' },
}

export const v4Provenance: Record<string, { source: { ar: string; en: string }; saudiNote: { ar: string; en: string } }> = {
  tour_guide: {
    source: { ar: 'مستهدفات رؤية 2030 السياحية (رسمية) · WEF مستقبل الوظائف 2025 · ترخيص وزارة السياحة', en: 'Vision 2030 tourism targets (official) · WEF FoJ 2025 · Ministry of Tourism licensing' },
    saudiNote: { ar: 'محرك الطلب المحلي: التوسع السياحي الوطني (العلا، البحر الأحمر، الدرعية، القدية) يصنع سلمًا مهنيًا من الإرشاد إلى إدارة الوجهات لم يكن موجودًا قبل عقد.', en: "Local demand driver: the national tourism build-out (AlUla, Red Sea, Diriyah, Qiddiya) creates guide-to-manager ladders that did not exist a decade ago." },
  },
  event_manager: {
    source: { ar: 'تقارير الهيئة العامة للترفيه عن المواسم السعودية · برنامج جودة الحياة (رؤية 2030) · WEF مستقبل الوظائف 2025', en: 'GEA public reporting on Saudi Seasons · Quality of Life Program (Vision 2030) · WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: التقويم الترفيهي الوطني مدعوم مؤسسيًا ومقترن بوجهات قائمة، فالتوظيف يتبع دورة المواسم — وليس سوقًا تخمينية.', en: 'Local demand driver: the national entertainment calendar is state-built and venue-backed, so hiring follows the season cycle — not a speculative market.' },
  },
  commercial_pilot: {
    source: { ar: 'الاستراتيجية الوطنية للطيران (مستهدفات رسمية) · تقرير Boeing 2025 للطيارين والفنيين (674 ألف طيار/20 سنة)', en: 'National Aviation Strategy (official targets) · Boeing Pilot & Technician Outlook 2025 (674k pilots/20y)' },
    saudiNote: { ar: 'محرك الطلب المحلي: إطلاق طيران الرياض وتوسع مجموعة السعودية يحوّلان الاستراتيجية الوطنية إلى توظيف مباشر في القيادة والمراقبة الجوية — والتوطين في الطيران توجه معلن.', en: "Local demand driver: Riyadh Air's launch and Saudia Group expansion convert national strategy into direct cockpit and ATC hiring — Saudization in aviation is a stated policy direction." },
  },
  sports_coach: {
    source: { ar: 'برنامج جودة الحياة (رؤية 2030) · خصخصة الأندية 2023 واستضافة كأس العالم 2034 (إعلانات رسمية) · WEF مستقبل الوظائف 2025', en: 'Vision 2030 Quality of Life Program · Saudi club privatization (2023) & FIFA World Cup 2034 hosting (official announcements) · WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: استثمار رياضي مدعوم وطنيًا (أندية، اتحادات، أكاديميات، فعاليات كبرى) — وسلالم شهادات التدريب معيارية عبر الاتحادات الوطنية.', en: 'Local demand driver: state-backed sports investment (clubs, federations, academies, mega-events) — coaching certification ladders are standardized by national federations.' },
  },
  game_designer: {
    source: { ar: 'الاستراتيجية الوطنية للألعاب والرياضات الإلكترونية (مستهدفات 39 ألف وظيفة/250 شركة/50 مليار ريال) · إفصاحات استثمار سافي (برنامج 37.8 مليار دولار)', en: 'National Gaming & Esports Strategy (39k jobs / 250 companies / SAR 50B targets) · Savvy investment disclosures ($37.8B program)' },
    saudiNote: { ar: 'محرك الطلب المحلي: بناء قطاعي ممول من صندوق الاستثمارات بمستهدفات توظيف صريحة — من أوضح خطوط تحويل القطاع إلى وظائف في رؤية 2030؛ وتتركز المنظومة في الرياض.', en: 'Local demand driver: PIF-funded build-out with explicit job targets — one of the clearest sector-to-careers pipelines in Vision 2030; Riyadh concentrates the ecosystem.' },
  },
  museum_heritage_specialist: {
    source: { ar: 'تسجيلات اليونسكو (8 مواقع سعودية؛ الفاو 2024) · برامج وزارة الثقافة القطاعية · WEF مستقبل الوظائف 2025', en: 'UNESCO inscriptions (8 Saudi sites; Al-Faw 2024) · Ministry of Culture sector programs · WEF FoJ 2025' },
    saudiNote: { ar: "محرك الطلب المحلي: التوسع المتحفي ومشاريع السياحة الكبرى (العلا وحدها تدير أحد أكبر برامج الآثار النشطة عالميًا).", en: "Local demand driver: museum build-out plus tourism giga-projects (AlUla alone runs one of the world's largest active archaeology programs)." },
  },
  logistics_manager: {
    source: { ar: 'الاستراتيجية الوطنية للنقل والخدمات اللوجستية · مؤشر البنك الدولي LPI 2023 (السعودية 38، +17 مرتبة) · WEF مستقبل الوظائف 2025', en: 'National Transport & Logistics Strategy · World Bank LPI 2023 (Saudi rank 38, +17 places) · WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: توسع الموانئ والسكك والمناطق الخاصة مع رسو مقرات إقليمية لمشغلين عالميين في المملكة.', en: 'Local demand driver: port, rail and special-zone build-out with global operators anchoring regional headquarters in the Kingdom.' },
  },
  mining_engineer: {
    source: { ar: 'وزارة الصناعة والثروة المعدنية (استراتيجية الركيزة الثالثة؛ إعادة تقدير الثروة ~2.5 تريليون دولار، منتدى مستقبل المعادن 2024) · WEF مستقبل الوظائف 2025', en: 'Ministry of Industry & Mineral Resources (third-pillar strategy; ~$2.5T mineral wealth re-estimate, FMF 2024) · WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: موجة تراخيص الاستكشاف وتوسعات معادن الكبرى؛ والتوطين في المواقع الصناعية النائية أولوية معلنة.', en: "Local demand driver: exploration-licensing wave plus Ma'aden's mega-expansions; Saudization in remote industrial sites is actively prioritized." },
  },
  solar_pv_engineer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (المتجددة ضمن أسرع 15 مهنة) · البرنامج الوطني للطاقة المتجددة (مستهدف 50% بحلول 2030)', en: 'WEF FoJ 2025 (renewables among 15 fastest-growing roles) · National Renewable Energy Program (50% by 2030 target)' },
    saudiNote: { ar: 'محرك الطلب المحلي: خط مشاريع شمسية عملاقة وتنظيم الطاقة الشمسية الموزعة — وتوطين الأدوار الهندسية هدف معلن للبرنامج.', en: 'Local demand driver: utility-scale PV pipeline plus distributed-solar regulation — localization of engineering roles is a program objective.' },
  },
  water_environment_engineer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (مهندسو البيئة ضمن أسرع 15؛ الإدارة البيئية ضمن أسرع 10 مهارات) · المبادرة السعودية الخضراء · تقارير المؤسسة العامة لتحلية المياه', en: 'WEF FoJ 2025 (environmental engineers top-15; environmental stewardship top-10 skill) · Saudi Green Initiative · SWCC public reporting' },
    saudiNote: { ar: 'محرك الطلب المحلي: ريادة التحلية وخصخصة قطاع المياه والبرامج البيئية الوطنية — والمرافق من أكبر موظفي المهندسين خارج النفط.', en: 'Local demand driver: desalination leadership, water-sector privatization and national environmental programs — utilities are among the largest engineering employers outside oil.' },
  },
  agritech_specialist: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (عمال الزراعة ضمن الأكبر نموًا؛ محرك التكيف المناخي) · استراتيجية الأمن الغذائي وبرنامج ريف (رسمي)', en: 'WEF FoJ 2025 (farmworkers largest absolute growth; climate-adaptation driver) · Saudi food-security strategy & Reef program (official)' },
    saudiNote: { ar: 'محرك الطلب المحلي: استثمار الأمن الغذائي والزراعة الموفرة للمياه؛ والزراعة المحكمة البيئة هي حيث يتمركز توظيف التقنيات الزراعية سعوديًا.', en: 'Local demand driver: food-security investment and water-efficient agriculture; controlled-environment farming is where Saudi agritech hiring concentrates.' },
  },
  maritime_officer: {
    source: { ar: 'الاستراتيجية الوطنية للنقل والخدمات اللوجستية · إفصاحات أسطول بحري العامة · WEF مستقبل الوظائف 2025', en: 'National Transport & Logistics Strategy · Bahri fleet public disclosures · WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: برنامج توسعة الموانئ ونمو الناقل الوطني؛ وتوطين البحريات هدف معلن للهيئة العامة للنقل مع تمويل كاديت.', en: 'Local demand driver: port-expansion program and national carrier growth; maritime Saudization is an explicit TGA objective with cadet funding.' },
  },
  real_estate_manager: {
    source: { ar: 'برنامج الإسكان (مستهدف تملك 70%) · نظام ترخيص الهيئة العامة للعقار · WEF مستقبل الوظائف 2025 (تعرض المهام الكتابية)', en: 'Vision 2030 Housing Program (70% ownership target) · Real Estate General Authority licensing regime · WEF FoJ 2025 (clerical exposure)' },
    saudiNote: { ar: 'محرك الطلب المحلي: تطويرات إسكانية عملاقة ورقمنة بلدية (بلدي)؛ والسمسرة صارت تتطلب ترخيصًا — حاجز يكافئ المبادرين بالشهادة.', en: 'Local demand driver: housing mega-developments plus municipal digitization (Balady); brokerage now requires a license — a barrier that rewards early certification.' },
  },
  media_producer: {
    source: { ar: 'برنامج حوافز هيئة الأفلام (خصم نقدي حتى 40%، رسمي) · إعادة فتح السينما ونمو شباك التذاكر (سجل عام) · منظمة العمل الدولية 2025', en: 'Film Commission incentive program (up to 40% cash rebate, official) · Saudi cinema reopening & box-office growth (public record) · ILO 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: خط إنتاج مدعوم بالحوافز وأعمال أصلية عربية مكلّفة؛ وتتمركز الأعمال في الرياض وجدة والعلا.', en: 'Local demand driver: incentive-backed production pipeline and Arabic-original commissions; Riyadh/Jeddah/AlUla concentrate the work.' },
  },
  satellite_engineer: {
    source: { ar: 'تأسيس وكالة الفضاء السعودية (2023) ومهمة Axiom-2 (سجل رسمي) · برنامج أقمار مدينة الملك عبدالعزيز (علني) · WEF مستقبل الوظائف 2025', en: 'Saudi Space Agency establishment (2023) & Axiom-2 mission (official record) · KACST satellite program (public) · WEF FoJ 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: البرنامج الفضائي الوطني واحتياجات الرصد الأرضي للمشاريع الكبرى؛ وتتمركز الأدوار في الرياض (الوكالة/مدينة الملك عبدالعزيز) والجامعات البحثية.', en: 'Local demand driver: national space program plus Earth-observation needs of giga-projects; roles concentrate in Riyadh (agency/KACST) and research universities.' },
  },
  fintech_product_specialist: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (مهندسو التقنية المالية +95%) · برنامج تطوير القطاع المالي (مستهدف 525 شركة) · تقارير البنك المركزي للمدفوعات (~79% إلكترونية في 2024)', en: 'WEF FoJ 2025 (fintech engineers +95%) · Financial Sector Development Program (525-company target) · SAMA payments reporting (~79% electronic in 2024)' },
    saudiNote: { ar: 'محرك الطلب المحلي: المصرفية المفتوحة ومستهدفات المجتمع اللانقدي؛ وتوفر الأكاديمية المالية وفنتك السعودية طبقة التدريب الوطنية.', en: 'Local demand driver: open banking plus cashless-society targets; the Financial Academy and Fintech Saudi provide the national training layer.' },
  },
  legaltech_compliance_officer: {
    source: { ar: 'جدول إلزام نظام حماية البيانات الشخصية (سدايا، 2024) · نظام الشركات 2023 ومركز التحكيم السعودي (رسمي) · WEF مستقبل الوظائف 2025 · منظمة العمل الدولية 2025', en: 'PDPL enforcement timeline (SDAIA, 2024) · Companies Law 2023 & SCCA (official) · WEF FoJ 2025 · ILO 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: وظائف امتثال مفروضة تنظيميًا (البنك المركزي، هيئة السوق المالية، سدايا) — فالتوظيف مدفوع بالأنظمة لا بالموضة، ما يجعله مقاومًا للركود.', en: 'Local demand driver: regulator-mandated compliance functions (SAMA, CMA, SDAIA) — hiring is rule-driven, not trend-driven, which makes it recession-resistant.' },
  },
  ot_security_engineer: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (المهارة رقم 2) · ضوابط الهيئة الوطنية للأمن السيبراني OTCC-1:2022 (ملزمة) · تقدير ISC2 لفجوة القوى العاملة', en: 'WEF FoJ 2025 (#2 skill) · NCA OTCC-1:2022 (binding controls) · ISC2 workforce-gap estimate' },
    saudiNote: { ar: 'محرك الطلب المحلي: ضوابط تشغيلية إلزامية على البنية الحرجة — ومواعيد الامتثال تتحول مباشرة إلى توظيف لدى المرافق والمشغلين الصناعيين.', en: 'Local demand driver: mandatory OT controls on critical infrastructure — compliance deadlines convert directly into hiring at utilities and industrial operators.' },
  },
  health_informatics_specialist: {
    source: { ar: 'مستشفى صحة الافتراضي (رقم قياسي في غينيس، رسمي) · إلزام منصة نفيس (مجلس الضمان الصحي) · WEF مستقبل الوظائف 2025 · Coursera 2025', en: 'SeHA Virtual Hospital (Guinness record, official) · NPHIES mandate (Council of Health Insurance) · WEF FoJ 2025 · Coursera GSR 2025' },
    saudiNote: { ar: 'محرك الطلب المحلي: تبادل البيانات الصحية الوطني الإلزامي ورقمنة التجمعات الصحية — فكل تجمع صحي يبني وحدة معلوماتية.', en: 'Local demand driver: mandatory national health-data exchange plus hospital-cluster digitization — every health cluster builds an informatics unit.' },
  },
  elderly_care_specialist: {
    source: { ar: 'WEF مستقبل الوظائف 2025 (اقتصاد الرعاية ضمن الأكبر نموًا) · برامج رعاية المسنين بوزارة الموارد البشرية (رسمية)', en: 'WEF FoJ 2025 (care economy among largest absolute growth) · MHRSD elderly-care programs (official)' },
    saudiNote: { ar: 'محرك الطلب المحلي: توسع مبني بالسياسات للرعاية المنزلية وخدمات المسنين؛ والطلب يسبق الانتفاخ الديموغرافي — فالشهادات المبكرة ستتراكم قيمتها.', en: "Local demand driver: policy-built home-care and elderly-services expansion; demand precedes the demographic bulge — early credentials will compound." },
  },
}

export const v4Admissions: Record<string, { ar: string; en: string }> = {
  tour_guide: {
    ar: 'الترخيص: رخصة إرشاد سياحي من وزارة السياحة بعد تدريب معتمد؛ دون نسبة موزونة تنافسية. ومسارات إدارة الوجهات في كليات السياحة تتبع القبول الجامعي المعتاد.',
    en: 'Licensing: Ministry of Tourism tour-guide license after approved training; no competitive weighted score required. Destination-management tracks in hospitality colleges follow standard university admission.',
  },
  commercial_pilot: {
    ar: 'القبول: الشهادة الطبية الجوية من الدرجة الأولى هي البوابة الأولى (يُستبعد كثيرون هنا)، ثم قبول الأكاديمية وتكلفة التدريب (ذاتية أو برعاية كاديت)؛ ويتبع الترخيص من الهيئة العامة للطيران المدني إصدار الرخصة التجارية. والإنجليزية (ICAO) إلزامية.',
    en: 'Admission: Class-1 aeromedical certificate is the first gate (many are filtered out here), then academy selection and training cost (self-funded or cadet-sponsored); GACA licensing follows CPL issue. English proficiency (ICAO) is mandatory.',
  },
  mining_engineer: {
    ar: 'القبول: مسار هندسي (تحصيلي + نسبة موزونة) ثم تسجيل الهيئة السعودية للمهندسين بعد التخرج؛ ومقاعد التعدين قليلة — فالفيصل (KFUPM) والملك عبدالعزيز هما البرنامجان الرئيسيان، فالمنافسة على المقاعد حقيقية.',
    en: 'Admission: engineering-track entry (Tahsili + weighted score), then Saudi Council of Engineers registration after graduation; note that mining seats are few — KFUPM and KAU are the principal programs, so competition for places is real.',
  },
  solar_pv_engineer: {
    ar: 'القبول: مسار هندسي كامل (تحصيلي + نسبة موزونة + تسجيل الهيئة السعودية للمهندسين)؛ والتخصص في الطاقة ضمن الكهربائية/الميكانيكية هو الطريق الشائع — لا توجد درجة شمسية مستقلة مطلوبة.',
    en: 'Admission: full engineering track (Tahsili + weighted score + Saudi Council of Engineers registration); energy specialization within electrical/mechanical is the common route — no separate solar degree required.',
  },
  water_environment_engineer: {
    ar: 'القبول: دخول هندسي معياري (تحصيلي + نسبة موزونة) + تسجيل الهيئة السعودية للمهندسين؛ والهندسة البيئية غالبًا تخصص ضمن المدنية/الكيميائية — فراجع مسار كل جامعة قبل التقديم.',
    en: "Admission: standard engineering entry (Tahsili + weighted score) + Saudi Council of Engineers registration; environmental engineering is often a specialization within civil/chemical — check each university's track before applying.",
  },
  satellite_engineer: {
    ar: 'القبول: دخول هندسي (تحصيلي + نسبة موزونة)؛ ومقاعد هندسة الطيران محدودة (الملك عبدالعزيز/KFUPM) — فالدرجات الثانوية يجب أن تكون قوية. والتخصص بعد الجامعي في الخارج ممول عادة بالابتعاث.',
    en: 'Admission: engineering-track entry (Tahsili + weighted score); aerospace seats are limited (KAU/KFUPM) — high school grades must be strong. Postgraduate specialization abroad is typically scholarship-funded.',
  },
  maritime_officer: {
    ar: 'القبول: اللياقة الطبية (فحص النظر واللياقة البحرية) هي البوابة الأولى ثم قبول الأكاديمية؛ وترخيص STCW يشترط زمنًا بحريًا موثقًا — فخطط لتلمذة بحرية متعددة السنوات قبل رتبة الضابط الكاملة.',
    en: 'Admission: medical fitness (eyesight/seafarer medical) is the first gate, then academy admission; STCW licensing requires documented sea time — plan for a multi-year cadetship before full officer rank.',
  },
}

export const v4Isco: Record<string, { code: string; label: { ar: string; en: string } }> = {
  tour_guide: { code: '5113', label: { ar: 'مرشدو سياحة (تقريبي)', en: 'Travel guides' } },
  event_manager: { code: '3332', label: { ar: 'منظمو مؤتمرات وفعاليات (تقريبي)', en: 'Conference & event planners' } },
  commercial_pilot: { code: '3153', label: { ar: 'طيارون ومساعدو ملاحة جوية', en: 'Aircraft pilots & related associate professionals' } },
  sports_coach: { code: '3422', label: { ar: 'مدربون ومسؤولون رياضيون', en: 'Sports coaches, instructors & officials' } },
  game_designer: { code: '2166', label: { ar: 'مصممو جرافيك ووسائط (تقريبي)', en: 'Graphic & multimedia designers' } },
  museum_heritage_specialist: { code: '2621', label: { ar: 'أمناء أرشيف ومتاحف', en: 'Archivists & curators' } },
  logistics_manager: { code: '1324', label: { ar: 'مديرو إمداد وتوزيع', en: 'Supply, distribution & related managers' } },
  mining_engineer: { code: '2146', label: { ar: 'مهندسو تعدين ومعادن', en: 'Mining engineers, metallurgists & related' } },
  solar_pv_engineer: { code: '2151', label: { ar: 'مهندسون كهربائيون (تقريبي)', en: 'Electrical engineers (approx.)' } },
  water_environment_engineer: { code: '2143', label: { ar: 'مهندسون بيئيون', en: 'Environmental engineers' } },
  agritech_specialist: { code: '2132', label: { ar: 'مستشارون زراعيون', en: 'Farming, forestry & fisheries advisers' } },
  maritime_officer: { code: '3151', label: { ar: 'ضباط سطح وميكنة سفن (تقريبي)', en: "Ships' engineers / deck officers (approx.)" } },
  real_estate_manager: { code: '3334', label: { ar: 'وسطاء ومديرو عقارات', en: 'Real estate agents & property managers' } },
  media_producer: { code: '2654', label: { ar: 'مخرجو ومنتجو أفلام ومسرح', en: 'Film, stage & related directors & producers' } },
  satellite_engineer: { code: '2144', label: { ar: 'مهندسون ميكانيكيون/فضاء (تقريبي)', en: 'Mechanical engineers (aerospace, approx.)' } },
  fintech_product_specialist: { code: '2412', label: { ar: 'مستشارون ماليون (تقريبي)', en: 'Financial & investment advisers (approx.)' } },
  legaltech_compliance_officer: { code: '2619', label: { ar: 'مختصون قانونيون آخرون (تقريبي)', en: 'Legal professionals n.e.c.' } },
  ot_security_engineer: { code: '2529', label: { ar: 'مختصو قواعد بيانات وشبكات آخرون (تقريبي)', en: 'Database & network professionals n.e.c.' } },
  health_informatics_specialist: { code: '2269', label: { ar: 'مختصون صحيون آخرون (تقريبي)', en: 'Health professionals n.e.c. (approx.)' } },
  elderly_care_specialist: { code: '2635', label: { ar: 'أخصائيون اجتماعيون ومستشارون', en: 'Social work & counselling professionals' } },
}

export const v4WomenNotes: Record<string, { ar: string; en: string }> = {
  tour_guide: { ar: 'السياحة من أحدث القطاعات المفتوحة للسعوديات على نطاق واسع — وأدوار الإرشاد وتجربة الضيوف وتسويق الوجهات مختلطة صراحةً ضمن التوسع السياحي الوطني.', en: 'Tourism is one of the newest sectors open to Saudi women at scale — guiding, guest experience and destination marketing roles are explicitly mixed-gender under the national tourism build-out.' },
  event_manager: { ar: 'تُظهر أدوار إنتاج الفعاليات وتجربة الضيوف في الوجهات الجديدة توظيفًا مختلطًا واضحًا — فهي من القطاعات التي دخلتها السعوديات بسرعة وعلى نطاق واسع.', en: 'Event production and guest-experience roles in the new venues show visible mixed-gender staffing — one of the sectors where Saudi women entered at scale quickly.' },
  sports_coach: { ar: 'كرة القدم والدوريات النسائية أصبحت مؤسسية حديثًا في السعودية، ما يخلق أدوار تدريب وعمليات مفتوحة للنساء — إلى جانب توسع الرياضة المدرسية للبنات.', en: "Women's football and women's leagues are newly institutionalized in Saudi Arabia, creating coaching and operations roles open to women — alongside school-sport expansion for girls." },
  media_producer: { ar: 'المخرجات والمنتجات السعوديات حاضرات دوليًا فعلًا (اختيارات مهرجانات)، وأدوار الإنتاج في الاستوديوهات الجديدة مختلطة بالتصميم.', en: 'Saudi women directors and producers are already internationally visible (festival selections), and set-based production roles in the new studios are mixed-gender by design.' },
  health_informatics_specialist: { ar: 'المعلوماتية الصحية ملاءمة قوية للسعوديات في القوى الصحية — ملائمة للعمل الهجين وداخل قطاع تشغّل فيه النساء أغلبية في عدة مسارات مهنية.', en: 'Health informatics is a strong fit for Saudi women in the health workforce — hybrid/remote-friendly, inside a sector where women already hold majorities in several professional tracks.' },
  elderly_care_specialist: { ar: 'مهن الرعاية من أوسع موظفي السعوديات، ونماذج الرعاية المنزلية ملائمة لأنماط العمل المرنة — مدخل عملي بتمويل برامج وطنية.', en: 'Care professions are among the widest employers of Saudi women, and home-care models suit flexible work patterns — a practical on-ramp with national-program funding.' },
}

// merge v4 entries into the live maps
Object.assign(careerExposureDetail, v4Exposure)
Object.assign(careerProvenance, v4Provenance)
Object.assign(careerAdmissionNotes, v4Admissions)
Object.assign(careerIsco, v4Isco)
Object.assign(careerWomenNotes, v4WomenNotes)
