import type { L } from '../types'
import type { Claim, ClaimSource } from './types'

/**
 * Claims behind the Methodology page (packet P5a). Ids are stable, kebab-case, prefixed 'method-'.
 * Counts are checked against the data in `src/__tests__/claims.test.ts`, so they cannot drift silently.
 */

const REVIEWED = '2026-10-22'

const ourMethod: ClaimSource = {
  title: { ar: 'رادار المهارات الرقمية: المنهجية وبنك المحتوى، الإصدار 9', en: 'Digital Skills Radar: method and content bank, v9' },
  publisher: { ar: 'مؤلف الأداة (مفهوم مستقل)', en: 'The tool’s author (independent concept)' },
  year: 2026,
}

const govWorkbooks: ClaimSource = {
  title: {
    ar: 'ملفا المصدر: سجل خدمات التمكين، ودليل الجهات والقطاعات',
    en: 'Two source workbooks: the enablement service records, and the entity and sector directory',
  },
  publisher: {
    ar: 'سجلات داخلية لبرنامج قدراتك ومنصة الاستشارات والدراسات',
    en: 'Internal records of the government digital-skills program and the consulting and studies platform',
  },
  year: 2026,
  access: 'internal',
}

const govProse: ClaimSource = {
  ...govWorkbooks,
  title: { ar: 'النص المنهجي المرافق لملفي المصدر', en: 'Methodology prose accompanying the two source workbooks' },
}

const govRegister: ClaimSource = {
  title: { ar: 'السجل الحي لبرنامج قدراتك', en: 'Live register of the government digital-skills program' },
  publisher: govWorkbooks.publisher,
  year: 2026,
  access: 'internal',
}

const editorialCounts = {
  ar: 'عدد مأخوذ من بيانات الأداة نفسها، ويتحقق منه فحص آلي عند كل بناء.',
  en: 'A count taken from the tool’s own data, checked automatically on every build.',
}

/* ---------------------------------------------------------------- weights */

export interface CategoryWeightRow {
  /** category key exactly as it appears in the consulting records */
  key: string
  name: L
  weights: { domainId: string; weight: number }[]
  claimId: string
}

const weightsCaveat: L = {
  ar: 'وزن افتراضي غير مقاس. طلبات الاستشارات من الجهات ليست قياسًا لاحتياج القوى العاملة، والنتيجة مؤشر تقريبي واستنتاج تحريري.',
  en: 'An assumed weight, not a measurement. Consulting requests from entities are not a measure of workforce need; the result is an approximate indicator and an editorial inference.',
}

const rows: { key: string; name: L; weights: [string, number][]; text: L; why: L; extra?: L }[] = [
  {
    key: '1. الاستراتيجيات الرقمية',
    name: { ar: 'الاستراتيجيات الرقمية', en: 'Digital strategies' },
    weights: [['policy', 0.7], ['leadership', 0.3]],
    text: {
      ar: 'تُوزَّع فئة «الاستراتيجيات الرقمية» تحريريًا على مجال السياسات والحوكمة الرقمية بوزن 0.7 ومجال القيادة والتعاون الرقمي بوزن 0.3.',
      en: 'The “digital strategies” category is split editorially: Digital Policy & Governance 0.7, Digital Leadership & Collaboration 0.3.',
    },
    why: {
      ar: 'صياغة الاستراتيجية الرقمية عمل حوكمي، وتنفيذها يتطلب قيادة تغيير.',
      en: 'Drafting a digital strategy is governance work; delivering it needs change leadership.',
    },
  },
  {
    key: '2. تخطيط وتمكين البنية التقنية',
    name: { ar: 'تخطيط وتمكين البنية التقنية', en: 'Technical infrastructure planning and enablement' },
    weights: [['cloud', 0.7], ['cyber', 0.3]],
    text: {
      ar: 'تُوزَّع فئة «تخطيط وتمكين البنية التقنية» تحريريًا على مجال السحابة والبنية التحتية الرقمية بوزن 0.7 ومجال الأمن السيبراني والثقة الرقمية بوزن 0.3.',
      en: 'The “technical infrastructure planning and enablement” category is split editorially: Cloud & Digital Infrastructure 0.7, Cybersecurity & Digital Trust 0.3.',
    },
    why: {
      ar: 'تخطيط البنية والمنصات جوهره السحابة وتحديث الأنظمة، مع الأمن منذ التصميم.',
      en: 'Planning infrastructure and platforms is cloud and system modernization at its core, with security by design.',
    },
    extra: {
      ar: 'لا يتجاوز وزن الأمن السيبراني 0.3 من فئة واحدة لأن خدمات الأمن السيبراني الوطنية ليست ضمن هذه الاستشارات؛ لذا يقل ظهوره في المؤشر، ولا يعني ذلك قلة الحاجة إليه.',
      en: 'Cybersecurity never exceeds 0.3 of one category because national cybersecurity services are not part of these consultations; it therefore appears less in the indicator, which does not mean it is needed less.',
    },
  },
  {
    key: '3. الابتكار والتقنيات الناشئة',
    name: { ar: 'الابتكار والتقنيات الناشئة', en: 'Innovation and emerging technologies' },
    weights: [['emerging', 0.8], ['ai-data', 0.2]],
    text: {
      ar: 'تُوزَّع فئة «الابتكار والتقنيات الناشئة» تحريريًا على مجال التقنيات الناشئة بوزن 0.8 ومجال الذكاء الاصطناعي والبيانات بوزن 0.2.',
      en: 'The “innovation and emerging technologies” category is split editorially: Emerging Technologies 0.8, AI & Data 0.2.',
    },
    why: {
      ar: 'تدور الفئة حول استكشاف التقنيات الناشئة، وأغلبها اليوم تطبيقات للذكاء الاصطناعي.',
      en: 'The category is about scouting emerging technologies, most of which are AI applications today.',
    },
  },
  {
    key: '4. التميز المؤسسي واستمرارية الأعمال',
    name: { ar: 'التميز المؤسسي واستمرارية الأعمال', en: 'Institutional excellence and business continuity' },
    weights: [['agile', 0.6], ['leadership', 0.4]],
    text: {
      ar: 'تُوزَّع فئة «التميز المؤسسي واستمرارية الأعمال» تحريريًا على مجال المنتجات والتسليم الرشيق بوزن 0.6 ومجال القيادة والتعاون الرقمي بوزن 0.4.',
      en: 'The “institutional excellence and business continuity” category is split editorially: Agile Product & Delivery 0.6, Digital Leadership & Collaboration 0.4.',
    },
    why: {
      ar: 'التميز المؤسسي تحسين مستمر للعمليات والتسليم، واستمرارية الأعمال إدارة للتغيير.',
      en: 'Institutional excellence is continuous improvement of delivery; business continuity is change management.',
    },
  },
  {
    key: '5. الاستثمار والخدمات الرقمية',
    name: { ar: 'الاستثمار والخدمات الرقمية', en: 'Investment and digital services' },
    weights: [['service-design', 0.6], ['policy', 0.4]],
    text: {
      ar: 'تُوزَّع فئة «الاستثمار والخدمات الرقمية» تحريريًا على مجال تصميم الخدمات بوزن 0.6 ومجال السياسات والحوكمة الرقمية بوزن 0.4.',
      en: 'The “investment and digital services” category is split editorially: Service Design 0.6, Digital Policy & Governance 0.4.',
    },
    why: {
      ar: 'الخدمات الرقمية تصميم حول المستفيد، والاستثمار شراء وتعاقد تقني تحكمه السياسات.',
      en: 'Digital services are beneficiary-centred design; investment is technology procurement governed by policy.',
    },
  },
  {
    key: '6. البيانات والتكامل',
    name: { ar: 'البيانات والتكامل', en: 'Data and integration' },
    weights: [['ai-data', 0.8], ['cloud', 0.2]],
    text: {
      ar: 'تُوزَّع فئة «البيانات والتكامل» تحريريًا على مجال الذكاء الاصطناعي والبيانات بوزن 0.8 ومجال السحابة والبنية التحتية الرقمية بوزن 0.2.',
      en: 'The “data and integration” category is split editorially: AI & Data 0.8, Cloud & Digital Infrastructure 0.2.',
    },
    why: {
      ar: 'جوهر الفئة الإلمام بالبيانات وحوكمتها، والتكامل يجري عبر البنية والتشغيل البيني.',
      en: 'The category is data literacy and governance at its core; integration runs over infrastructure and interoperability.',
    },
  },
  {
    key: '7. مؤشرات الأداء الرقمي',
    name: { ar: 'مؤشرات الأداء الرقمي', en: 'Digital performance indicators' },
    weights: [['ai-data', 0.6], ['agile', 0.4]],
    text: {
      ar: 'تُوزَّع فئة «مؤشرات الأداء الرقمي» تحريريًا على مجال الذكاء الاصطناعي والبيانات بوزن 0.6 ومجال المنتجات والتسليم الرشيق بوزن 0.4.',
      en: 'The “digital performance indicators” category is split editorially: AI & Data 0.6, Agile Product & Delivery 0.4.',
    },
    why: {
      ar: 'المؤشرات تحليل بيانات وقياس لمنافع التسليم.',
      en: 'Indicators are data analysis plus measuring the benefits of delivery.',
    },
  },
  {
    key: '8. التميز والتنافسية',
    name: { ar: 'التميز والتنافسية', en: 'Excellence and competitiveness' },
    weights: [['leadership', 0.6], ['policy', 0.4]],
    text: {
      ar: 'تُوزَّع فئة «التميز والتنافسية» تحريريًا على مجال القيادة والتعاون الرقمي بوزن 0.6 ومجال السياسات والحوكمة الرقمية بوزن 0.4.',
      en: 'The “excellence and competitiveness” category is split editorially: Digital Leadership & Collaboration 0.6, Digital Policy & Governance 0.4.',
    },
    why: {
      ar: 'التنافسية سرد للإنجاز وتأثير في أصحاب المصلحة ضمن أطر الحوكمة.',
      en: 'Competitiveness is telling the story of achievement and influencing stakeholders within governance frames.',
    },
  },
]

/** The editorial category → domain weight table (one claim per row). */
export const categoryWeightRows: CategoryWeightRow[] = rows.map((r, i) => ({
  key: r.key,
  name: r.name,
  weights: r.weights.map(([domainId, weight]) => ({ domainId, weight })),
  claimId: `method-weights-${i + 1}`,
}))

const weightClaims: Claim[] = rows.map((r, i) => ({
  id: `method-weights-${i + 1}`,
  text: r.text,
  value: { ar: r.weights.map(([, w]) => w.toFixed(1)).join(' · '), en: r.weights.map(([, w]) => w.toFixed(1)).join(' · ') },
  scope: { ar: 'ربط فئات الاستشارات بالمجالات الثمانية', en: 'Mapping consulting categories to the eight domains' },
  kind: 'editorial',
  confidence: 'low',
  source: ourMethod,
  derivation: r.why,
  reviewedOn: REVIEWED,
  caveat: r.extra ? { ar: `${weightsCaveat.ar} ${r.extra.ar}`, en: `${weightsCaveat.en} ${r.extra.en}` } : weightsCaveat,
}))

/* ----------------------------------------------------------------- claims */

export const methodClaims: Claim[] = [
  // ---- the framework
  {
    id: 'method-domains-count',
    text: { ar: 'يغطي الرادار 8 مجالات للقدرات الرقمية في العمل الحكومي.', en: 'The radar covers 8 domains of digital capability in government work.' },
    value: { ar: '8 مجالات', en: '8 domains' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-skills-count',
    text: { ar: 'يضم الرادار 40 مهارة، لكل مجال خمس منها.', en: 'The radar holds 40 skills, five per domain.' },
    value: { ar: '40 مهارة', en: '40 skills' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-skills-per-domain',
    text: { ar: 'لكل مجال 5 مهارات، ولكل مهارة عبارة تقييم ذاتي واحدة.', en: 'Each domain has 5 skills, and each skill one self-assessment statement.' },
    value: { ar: '5 مهارات', en: '5 skills' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-levels-count',
    text: { ar: 'يستخدم الرادار مقياسًا واحدًا من 4 مستويات: وعي، وتطبيق، وإتقان، وريادة.', en: 'The radar uses one scale of 4 levels: awareness, application, proficiency and leadership.' },
    value: { ar: '4 مستويات', en: '4 levels' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-scale',
    text: {
      ar: 'تُقدَّر كل مهارة ذاتيًا على مقياس من 0 إلى 4، لكل درجة فيه عبارة سلوكية تصفها.',
      en: 'Each skill is self-rated on a 0–4 scale, with a behavioural description for each point.',
    },
    value: { ar: '0–4', en: '0–4' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'تقدير ذاتي: يصف رأيك في قدرتك لا أداءك الفعلي.',
      en: 'Self-rating: it describes your view of your ability, not your actual performance.',
    },
  },
  {
    id: 'method-level-thresholds',
    text: {
      ar: 'تتحول درجة المجال (متوسط تقديرات مهاراته) إلى مستوى عند العتبات 1.25 و2.25 و3.25.',
      en: 'A domain score (the mean of its skill ratings) converts to a level at the thresholds 1.25, 2.25 and 3.25.',
    },
    value: { ar: '1.25 · 2.25 · 3.25', en: '1.25 · 2.25 · 3.25' },
    kind: 'editorial',
    confidence: 'low',
    source: ourMethod,
    derivation: {
      ar: 'أقل من 1.25 وعي، ومن 1.25 إلى أقل من 2.25 تطبيق، ومن 2.25 إلى أقل من 3.25 إتقان، و3.25 فأكثر ريادة.',
      en: 'Below 1.25 awareness; 1.25 to under 2.25 application; 2.25 to under 3.25 proficiency; 3.25 and above leadership.',
    },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'عتبات تحريرية معلنة لم تُشتق من بيانات: لا عينة معيارية ولا جلسة لتحديد درجات القطع.',
      en: 'Declared editorial thresholds not derived from data: no normative sample and no standard-setting session.',
    },
  },
  // ---- judgment scenarios and knowledge check
  {
    id: 'method-role-categories',
    text: {
      ar: 'يختار المستخدم واحدة من 5 فئات دور: عام، وتطبيقي، وتخصصي، وقيادة فرق، وتنفيذي.',
      en: 'Users choose one of 5 role categories: general, applied, specialist, team leadership and executive.',
    },
    value: { ar: '5 فئات', en: '5 categories' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-scenarios-count',
    text: {
      ar: 'يضم بنك مواقف الحكم المهني 40 موقفًا: موقف لكل مجال في كل فئة دور.',
      en: 'The professional-judgment bank holds 40 scenarios: one per domain for each role category.',
    },
    value: { ar: '40 موقفًا', en: '40 scenarios' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
    caveat: { ar: 'مواقف تحريرية لم تُختبر ميدانيًا.', en: 'Editorial scenarios, not field-tested.' },
  },
  {
    id: 'method-scenario-scoring',
    text: {
      ar: 'لكل موقف 4 خيارات تُمنح درجات جزئية من 0 إلى 3 بحسب نضج التصرف.',
      en: 'Each scenario has 4 options scored 0 to 3 by the maturity of the response.',
    },
    value: { ar: '0–3', en: '0–3' },
    kind: 'editorial',
    confidence: 'low',
    source: ourMethod,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'مفاتيح الدرجات حكم تحريري لم يُتحقق من صلاحيته إحصائيًا.',
      en: 'The scoring keys are an editorial judgment, not statistically validated.',
    },
  },
  {
    id: 'method-knowledge-count',
    text: { ar: 'يضم بنك التحقق المعرفي 40 سؤالًا، خمسة لكل مجال.', en: 'The knowledge-check bank holds 40 questions, five per domain.' },
    value: { ar: '40 سؤالًا', en: '40 questions' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'أسئلة تحريرية تغطي المعرفة الأساسية فقط، ولم تُختبر ميدانيًا.',
      en: 'Editorial questions covering foundational knowledge only, not field-tested.',
    },
  },
  {
    id: 'method-knowledge-min-attempts',
    text: {
      ar: 'لا يُحكم على اتساق التقدير الذاتي مع التحقق المعرفي في مجال قبل الإجابة عن 3 أسئلة فيه على الأقل.',
      en: 'Consistency between self-rating and the knowledge check is not judged in a domain before at least 3 of its questions are answered.',
    },
    value: { ar: '3 أسئلة', en: '3 questions' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-priorities-max',
    text: {
      ar: 'يقترح محرك الأولويات 3 أولويات تطوير على الأكثر، لكل منها سبب معلن.',
      en: 'The priority engine suggests at most 3 development priorities, each with a stated reason.',
    },
    value: { ar: '3 أولويات', en: '3 priorities' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-roles-count',
    text: {
      ar: 'تضم مكتبة الأدوار 24 دورًا مرجعيًا إلى SFIA 9، لكل منها مستهدف تطويري استرشادي.',
      en: 'The role library holds 24 roles referenced to SFIA 9, each with an indicative development target.',
    },
    value: { ar: '24 دورًا', en: '24 roles' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'المستهدفات استرشادية تحريرية، لا معايير وظيفية ولا شروط شغل.',
      en: 'Targets are indicative and editorial, not job standards or appointment criteria.',
    },
  },
  {
    id: 'method-plan-length',
    text: {
      ar: 'خطتك للأيام الـ90 المقبلة مقسّمة إلى 13 خطوة أسبوعية.',
      en: 'Your plan for the next 90 days is split into 13 weekly steps.',
    },
    value: { ar: '90 يومًا', en: '90 days' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    reviewedOn: REVIEWED,
  },
  // ---- technologies changing government work
  {
    id: 'method-tech-count',
    text: {
      ar: 'تضم قائمة «تقنيات تغيّر العمل الحكومي» 48 تقنية في 6 مجموعات، ولكل تقنية المهارات التي تتطلبها.',
      en: 'The “technologies changing government work” list holds 48 technologies in 6 clusters, each with the skills it requires.',
    },
    value: { ar: '48 تقنية', en: '48 technologies' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    derivation: editorialCounts,
    reviewedOn: REVIEWED,
  },
  {
    id: 'method-tech-horizons',
    text: {
      ar: 'آفاق التبني الثلاثة: الآن (0–2 سنة)، وقريب المدى (2–5 سنوات)، وبعيد المدى (5–10 سنوات).',
      en: 'Three adoption horizons: now (0–2 years), near term (2–5 years) and long term (5–10 years).',
    },
    value: { ar: '0–2 · 2–5 · 5–10 سنوات', en: '0–2 · 2–5 · 5–10 years' },
    kind: 'editorial',
    confidence: 'medium',
    source: ourMethod,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'وضع كل تقنية في أفق حكم تحريري مكتبي، لا توقع رسمي.',
      en: 'Placing each technology on a horizon is an editorial desk judgment, not an official forecast.',
    },
  },
  {
    id: 'method-tech-trl',
    text: {
      ar: 'تُقدَّر جاهزية كل تقنية عالميًا على مقياس جاهزية التقنية (TRL) من 1 إلى 9.',
      en: 'Each technology’s global maturity is rated on the 1–9 Technology Readiness Level (TRL) scale.',
    },
    value: { ar: 'TRL 1–9', en: 'TRL 1–9' },
    kind: 'editorial',
    confidence: 'low',
    source: ourMethod,
    derivation: {
      ar: 'مراجعة مكتبية لكل تقنية مقابل إشارات منشورة مسماة، مع مسوّغ مكتوب لكل درجة.',
      en: 'A desk review of each technology against named published signals, with a written rationale for each rating.',
    },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'يصف النضج العالمي لا نضج التبني في المملكة، ويظهر في التفاصيل بشارة «تحريري».',
      en: 'It describes global maturity, not adoption maturity in Saudi Arabia, and appears in the details with an “editorial” badge.',
    },
  },
  // ---- government-entity data (reconciliation)
  {
    id: 'method-gov-training-sheet',
    text: {
      ar: 'مجموع أوراق التدريب في ملفي المصدر 7,915 سجل مشاركة تدريبية حتى نهاية الربع الثالث من 2026.',
      en: 'The training sheets in the two source workbooks total 7,915 training participation records up to the end of Q3 2026.',
    },
    value: { ar: '7,915', en: '7,915' },
    unit: { ar: 'سجل مشاركة تدريبية', en: 'training participation records' },
    scope: { ar: 'الجهات المستفيدة من التدريب، على المستوى الوطني', en: 'Entities served by training, national level' },
    period: '2021 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    derivation: {
      ar: 'جمع صفوف أوراق التدريب وإعادة احتسابها، ويطابق ملخص الملف.',
      en: 'Sum of the training sheet rows, recomputed; it matches the workbook summary.',
    },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'سجلات مشاركة لا أشخاص فريدون. هو الرقم المنشور في الأداة إلى أن يعتمد المالك الرقم النهائي.',
      en: 'Participation records, not unique people. It is the figure the tool publishes until the owner confirms the final figure.',
    },
  },
  {
    id: 'method-gov-consulting-sheet',
    text: {
      ar: 'مجموع أوراق الاستشارات في ملفي المصدر 2,873 خدمة استشارية حتى نهاية الربع الثالث من 2026.',
      en: 'The consulting sheets in the two source workbooks total 2,873 consulting services up to the end of Q3 2026.',
    },
    value: { ar: '2,873', en: '2,873' },
    unit: { ar: 'خدمة استشارية', en: 'consulting services' },
    scope: { ar: 'الجهات المستفيدة من الاستشارات، على المستوى الوطني', en: 'Entities served by consulting, national level' },
    period: '2023 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    derivation: {
      ar: 'جمع صفوف أوراق الاستشارات وإعادة احتسابها، ويطابق ملخص الملف.',
      en: 'Sum of the consulting sheet rows, recomputed; it matches the workbook summary.',
    },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'هو الرقم المنشور في الأداة إلى أن يعتمد المالك الرقم النهائي.',
      en: 'It is the figure the tool publishes until the owner confirms the final figure.',
    },
  },
  {
    id: 'method-gov-training-prose',
    text: {
      ar: 'يذكر النص المنهجي المرافق لملفي المصدر 7,935 سجلًا تدريبيًا.',
      en: 'The methodology prose accompanying the two source workbooks states 7,935 training records.',
    },
    value: { ar: '7,935', en: '7,935' },
    unit: { ar: 'سجل تدريبي', en: 'training records' },
    kind: 'official',
    confidence: 'low',
    source: govProse,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'لا يطابق مجاميع الأوراق نفسها؛ يُذكر للشفافية ولا يُعتمد.',
      en: 'It does not match the sheet totals themselves; stated for transparency, not adopted.',
    },
  },
  {
    id: 'method-gov-consulting-prose',
    text: {
      ar: 'يذكر النص المنهجي المرافق لملفي المصدر 2,918 خدمة استشارية.',
      en: 'The methodology prose accompanying the two source workbooks states 2,918 consulting services.',
    },
    value: { ar: '2,918', en: '2,918' },
    unit: { ar: 'خدمة استشارية', en: 'consulting services' },
    kind: 'official',
    confidence: 'low',
    source: govProse,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'لا يطابق مجاميع الأوراق نفسها؛ يُذكر للشفافية ولا يُعتمد.',
      en: 'It does not match the sheet totals themselves; stated for transparency, not adopted.',
    },
  },
  {
    id: 'method-gov-training-register',
    text: {
      ar: 'يُظهر السجل الحي لبرنامج قدراتك 7,891 سجلًا تدريبيًا بعد إزالة التكرار، بتحقق في 18 أكتوبر 2026.',
      en: 'The program’s live register shows 7,891 training records after de-duplication, verified on 18 October 2026.',
    },
    value: { ar: '7,891', en: '7,891' },
    unit: { ar: 'سجل تدريبي', en: 'training records' },
    period: '2026-10-18',
    kind: 'official',
    confidence: 'medium',
    source: govRegister,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'يختلف عن مجموع الأوراق بسبب تاريخ القطع والتصفية وإزالة التكرار.',
      en: 'It differs from the sheet total because of the cut-off date, filtering and de-duplication.',
    },
  },
  {
    id: 'method-gov-consulting-register',
    text: {
      ar: 'يُظهر السجل الحي لبرنامج قدراتك 2,918 خدمة استشارية، بتحقق في 18 أكتوبر 2026.',
      en: 'The program’s live register shows 2,918 consulting services, verified on 18 October 2026.',
    },
    value: { ar: '2,918', en: '2,918' },
    unit: { ar: 'خدمة استشارية', en: 'consulting services' },
    period: '2026-10-18',
    kind: 'official',
    confidence: 'medium',
    source: govRegister,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'يختلف عن مجموع الأوراق بسبب تاريخ القطع والتصفية.',
      en: 'It differs from the sheet total because of the cut-off date and filtering.',
    },
  },
  {
    id: 'method-gov-sector-min',
    text: {
      ar: 'لا يُعرض مجموع قطاعي في البناء العام إلا لقطاع فيه 10 جهات على الأقل لها سجلات.',
      en: 'The public build shows a sector aggregate only for sectors with at least 10 entities that have records.',
    },
    value: { ar: 'n ≥ 10', en: 'n ≥ 10' },
    unit: { ar: 'جهات لها سجلات في القطاع', en: 'entities with records in the sector' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'قاعدة خصوصية تمنع التعرف على جهة بعينها من مجموع صغير.',
      en: 'A privacy rule that prevents identifying a single entity from a small aggregate.',
    },
  },
  ...weightClaims,
  // ---- governance of the evidence itself
  {
    id: 'method-review-stale',
    text: {
      ar: 'يُوسم أي ادعاء مضى على آخر مراجعة له أكثر من 12 شهرًا بأنه يحتاج مراجعة.',
      en: 'Any claim last reviewed more than 12 months ago is flagged as needing review.',
    },
    value: { ar: '12 شهرًا', en: '12 months' },
    kind: 'editorial',
    confidence: 'high',
    source: ourMethod,
    reviewedOn: REVIEWED,
  },
]

/** Months after which a claim is flagged «يحتاج مراجعة» (kept in sync with `method-review-stale`). */
export const REVIEW_STALE_MONTHS = 12
