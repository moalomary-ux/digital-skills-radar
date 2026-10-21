import type { L, Lang } from '../../data/types'
import type { Reason } from '../../lib/priorities'
import { reasonLabel } from '../../lib/priorities'
import type { Staffing } from '../../lib/team'

/**
 * Copy shared by the team radar page and its printed brief (binding glossary: مجال، مستوى
 * وعي · تطبيق · إتقان · ريادة، فئة الدور، تقدير ذاتي، مواقف الحكم، تحقق معرفي، أولوية تطوير مقترحة).
 * Numbers and numeric ranges are never inside these strings when they sit in Arabic text; the
 * page renders them separately with dir="ltr".
 */
export const tt = {
  eyebrow: { ar: 'للقادة والفرق', en: 'Leaders & teams' },
  title: { ar: 'رادار الفريق', en: 'Team radar' },
  lede: {
    ar: 'صورة مجمّعة لفريقك من رموز النتائج التي يشاركها أعضاؤه بإرادتهم: كيف تتوزع التقديرات في كل مجال، وأين تقل التغطية مقابل المستهدف، وأين تعتمد المعرفة على شخص واحد، وما الأولويات المشتركة لخطة تعلم جماعية.',
    en: 'An aggregate picture of your team from the result codes its members choose to share: how ratings spread in each domain, where coverage of the target is thin, where knowledge rests on one person, and which shared priorities could shape a cohort learning plan.',
  },
  banner: { ar: 'للتخطيط التطويري فقط — ليس تقييماً للأداء', en: 'For development planning only — not a performance appraisal' },
  bannerNote: {
    ar: 'الأرقام تقدير ذاتي ومواقف حكم تصف الفريق مجتمعاً. لا تصلح للمقارنة بين الأشخاص ولا للترقية ولا للتقييم الوظيفي.',
    en: 'The figures are self-ratings and scenario judgments describing the team as a whole. They are not for comparing people, for promotion or for performance appraisal.',
  },
  privacyLocal: {
    ar: 'كل شيء يجري في متصفحك: لا يُرسل أي رمز إلى أي جهة، ولا يُحفظ إلا في هذه النافذة ويُمحى عند إغلاقها.',
    en: 'Everything runs in your browser: no code is sent anywhere, and codes are kept only in this tab and erased when you close it.',
  },
  privacyCode: {
    ar: 'مشاركة الرمز طوعية. الرمز لا يحمل اسماً ولا جهة، لكنه يكشف درجات صاحبه لمن يقرؤه، وقد يُعرف صاحبه من السياق في الفرق الصغيرة؛ لذلك لا تعرض الصفحة شيئاً قبل اكتمال الحد الأدنى من الرموز، ولا تعرض صفاً لكل شخص.',
    en: 'Sharing a code is voluntary. A code carries no name or entity, but anyone holding it can read its scores, and context can identify its owner in a small team; so this page shows nothing until the minimum number of codes is reached, and never a row per person.',
  },
  adoptionLink: { ar: 'قواعد الاستخدام في دليل التبني المؤسسي', en: 'Usage rules in the institutional adoption guide' },
  howTo: { ar: 'يجد كل عضو رمزه في صفحة نتيجته بعد إكمال التقييم الذاتي.', en: 'Each member finds their code on their result page after completing the self-assessment.' },
  resultsLink: { ar: 'صفحة النتيجة', en: 'Result page' },

  setTeam: { ar: 'رموز الفريق', en: 'Team codes' },
  inputSection: { ar: 'إدخال الرموز', en: 'Enter the codes' },
  setBefore: { ar: 'قبل البرنامج', en: 'Before the programme' },
  setAfter: { ar: 'بعد البرنامج', en: 'After the programme' },
  inputHelp: { ar: 'الصق الرموز هنا: رمز في كل سطر، أو افصل بينها بفاصلة أو مسافة.', en: 'Paste codes here: one per line, or separated by commas or spaces.' },
  fileButton: { ar: 'أضف من ملف (txt أو csv أو json)', en: 'Add from a file (txt, csv or json)' },
  dropHint: { ar: 'أو أفلت الملف في هذا المربع', en: 'or drop the file on this box' },
  fileAdded: { ar: 'رموز أُضيفت من الملف:', en: 'Codes added from the file:' },
  fileNone: { ar: 'لم يُعثر في الملف على رموز.', en: 'No codes were found in the file.' },
  fileError: { ar: 'تعذّرت قراءة الملف.', en: 'The file could not be read.' },
  clear: { ar: 'امسح', en: 'Clear' },
  addAfter: { ar: 'أضف مجموعة «بعد البرنامج» للمقارنة', en: 'Add an “after the programme” set to compare' },
  removeAfter: { ar: 'أزل مجموعة «بعد البرنامج»', en: 'Remove the “after the programme” set' },
  demo: { ar: 'جرّب ببيانات توضيحية', en: 'Try with illustration data' },
  demoNote: { ar: 'بيانات توضيحية مولّدة — ليست لفريق حقيقي', en: 'Generated illustration data — not a real team' },
  excludeStale: { ar: 'استبعد الرموز الأقدم من ستة أشهر', en: 'Leave out codes older than six months' },
  countValid: { ar: 'صالحة ومختلفة', en: 'Valid, distinct' },
  countInvalid: { ar: 'غير صالحة', en: 'Invalid' },
  countDuplicate: { ar: 'مكررة', en: 'Duplicates' },
  countStale: { ar: 'أقدم من ستة أشهر', en: 'Older than six months' },
  countersNote: {
    ar: 'الرمز المكرر يُحسب مرة واحدة. الرمز الأقدم من ستة أشهر يُحسب ما لم تستبعده، لأن المهارات تتغير.',
    en: 'A repeated code counts once. A code older than six months counts unless you leave it out, because skills change.',
  },

  gateLead: { ar: 'لا يُعرض شيء حتى يبلغ عدد الرموز الصالحة المختلفة', en: 'Nothing is shown until the number of valid, distinct codes reaches' },
  gateHave: { ar: 'المتوفر الآن', en: 'You have' },
  gateNeed: { ar: 'والمتبقي', en: 'still needed' },
  gateWhy: { ar: 'الحد الأدنى يحمي أصحاب الرموز من التعرّف عليهم.', en: 'The minimum protects the people who shared their codes from being identified.' },

  overviewCodes: { ar: 'الرموز المحتسبة', en: 'Codes counted' },
  overviewPeriod: { ar: 'فترة التقييمات', en: 'Assessment period' },
  overviewCategory: { ar: 'المقارنة بمستهدفات فئة', en: 'Compared with the targets of' },
  categoryLegend: { ar: 'قارن بالمستهدف الاسترشادي لفئة الدور', en: 'Compare with the indicative target of a role category' },
  majority: { ar: 'الأكثر في الرموز', en: 'most common in the codes' },
  basisLegend: { ar: 'أساس حساب التغطية ونقاط الفشل', en: 'Basis for coverage and single points of failure' },
  basisSelf: { ar: 'التقدير الذاتي', en: 'Self-rating' },
  basisCautious: { ar: 'الأحوط: الأدنى من التقدير والمواقف', en: 'Cautious: the lower of self-rating and scenario' },
  viewSetLegend: { ar: 'الأقسام تعرض مجموعة', en: 'Sections show the set' },

  distTitle: { ar: 'توزيع الفريق في كل مجال', en: 'How the team spreads in each domain' },
  distHelp: {
    ar: 'كل نقطة إجابة واحدة، والقيم المتساوية مكدّسة فوق بعضها. الصندوق يمتد من الربع الأول إلى الربع الثالث، والخط الداكن هو الوسيط، والخط المتقطع هو المستهدف. مرّر المؤشر على مجال أو انتقل إليه بلوحة المفاتيح لترى ملخصه.',
    en: 'Each dot is one answer; equal values are stacked. The box spans the first to the third quartile, the dark line is the median and the dashed line is the target. Hover over a domain, or move to it with the keyboard, to see its summary.',
  },
  layerLegend: { ar: 'الطبقة', en: 'Layer' },
  layerSelf: { ar: 'التقدير الذاتي', en: 'Self-rating' },
  layerJudgment: { ar: 'مواقف الحكم (على المقياس نفسه)', en: 'Scenario judgment (same scale)' },
  insufficient: { ar: 'إجابات أقل من الحد الأدنى', en: 'Fewer answers than the minimum' },
  min: { ar: 'الأدنى', en: 'Minimum' },
  q1: { ar: 'الربع الأول', en: 'First quartile' },
  median: { ar: 'الوسيط', en: 'Median' },
  q3: { ar: 'الربع الثالث', en: 'Third quartile' },
  max: { ar: 'الأعلى', en: 'Maximum' },
  answers: { ar: 'الإجابات', en: 'Answers' },
  target: { ar: 'المستهدف', en: 'Target' },
  coverage: { ar: 'التغطية', en: 'Coverage' },
  atTarget: { ar: 'عند المستهدف أو فوقه', en: 'At or above the target' },
  proficient: { ar: 'عند «إتقان» فأعلى', en: 'At Proficiency or above' },
  domain: { ar: 'المجال', en: 'Domain' },
  tableToggle: { ar: 'الجدول المكافئ', en: 'Equivalent table' },
  scaleLead: { ar: 'المقياس', en: 'Scale' },
  scaleProficient: { ar: '، ومستوى «إتقان» يبدأ عند', en: '; Proficiency starts at' },

  covTitle: { ar: 'التغطية مقابل المستهدف الاسترشادي', en: 'Coverage against the indicative target' },
  covHelp: {
    ar: 'نسبة الرموز التي تبلغ المستهدف الاسترشادي لفئة الدور المختارة أو تتجاوزه في كل مجال. غيّر الفئة أو الأساس لترى الأشرطة تتغير. المستهدفات تحريرية للتخطيط، لا معايير وظيفية.',
    en: 'The share of codes at or above the indicative target of the chosen role category, per domain. Change the category or the basis to see the bars move. Targets are editorial planning aids, not job standards.',
  },
  of: { ar: 'من', en: 'of' },

  spofTitle: { ar: 'نقاط الفشل المفردة', en: 'Single points of failure' },
  spofHelp: {
    ar: 'مجالات لا يبلغ فيها مستوى «إتقان» أو أعلى إلا شخص واحد أو لا أحد: غياب شخص واحد يكفي لتعثّر العمل فيها.',
    en: 'Domains where one person or nobody is at Proficiency or above: a single absence is enough to stall work there.',
  },
  spofNone: { ar: 'لا يوجد في هذه الرموز مجال يعتمد على شخص واحد أو أقل.', en: 'No domain in these codes rests on one person or fewer.' },
  spofZero: { ar: 'لا أحد عند «إتقان» أو أعلى', en: 'Nobody at Proficiency or above' },
  spofOne: { ar: 'شخص واحد عند «إتقان» أو أعلى', en: 'One person at Proficiency or above' },
  spofChip: { ar: 'نقطة فشل مفردة', en: 'Single point of failure' },

  inflTitle: { ar: 'خطر تضخم التقدير الذاتي', en: 'Risk of inflated self-ratings' },
  inflHelp: {
    ar: 'الفرق بين متوسط التقدير الذاتي ومتوسط مواقف الحكم لدى من أجابوا عن موقف المجال. يُعلَّم المجال حين يبلغ الفرق نصف مستوى أو أكثر، ولا يُحسب إذا قلّت الإجابات عن الحد الأدنى.',
    en: 'The gap between the mean self-rating and the mean scenario judgment among those who answered the domain’s scenario. A domain is marked when the gap reaches half a level or more; it is not computed below the minimum number of answers.',
  },
  inflFlag: { ar: 'يستحق التحقق عملياً', en: 'Worth checking in practice' },
  inflNone: { ar: 'لا يظهر خطر تضخم في المجالات التي فيها إجابات كافية.', en: 'No inflation risk shows in the domains with enough answers.' },
  colPairs: { ar: 'إجابات المواقف', en: 'Scenario answers' },
  colGap: { ar: 'الفرق (التقدير − المواقف)', en: 'Gap (self − scenario)' },
  colMismatch: { ar: 'تقديرهم أعلى بمستوى أو أكثر', en: 'Self-rating a level or more higher' },
  colKnowledge: { ar: 'التحقق المعرفي أدنى من التقدير', en: 'Knowledge check below the self-rating' },

  prioTitle: { ar: 'أولويات التطوير المشتركة المقترحة', en: 'Suggested shared development priorities' },
  prioHelp: {
    ar: 'محسوبة بمحرك الأولويات نفسه الذي يرى به كل عضو نتيجته (وفق فئة دوره)، ثم عُدّ كم رمزاً يضع المجال ضمن أولوياته الثلاث.',
    en: 'Computed with the same priority engine each member sees in their own result (against their role category), then counted: how many codes place the domain among their three priorities.',
  },
  prioCount: { ar: 'يظهر ضمن الأولويات الثلاث لدى', en: 'Among the top three for' },
  prioReason: { ar: 'السبب الأكثر تكراراً', en: 'Most frequent reason' },
  prioNone: { ar: 'لا تظهر أولويات تطوير مشتركة: كل الرموز عند المستهدف أو فوقه.', en: 'No shared development priorities: every code is at or above its target.' },

  cohortTitle: { ar: 'موضوعات تعلم الدفعة خلال ثلاثة عشر أسبوعاً', en: 'Cohort learning themes over thirteen weeks' },
  cohortHelp: {
    ar: 'من مسار التطوير الموجود لكل مجال، بدءاً من المستوى المعتاد في الفريق (الوسيط على الأساس الأحوط). سلوك واحد لكل مرحلة.',
    en: 'Taken from each domain’s development pathway, starting from the team’s typical level (the median on the cautious basis). One behaviour per phase.',
  },
  weeks: { ar: 'الأسابيع', en: 'Weeks' },
  startFrom: { ar: 'نقطة البدء المعتادة', en: 'Typical starting point' },

  cmpTitle: { ar: 'قبل البرنامج وبعده', en: 'Before and after the programme' },
  cmpHelp: {
    ar: 'مقارنة بين مجموعتين لا بين أشخاص: لا يُربط أي رمز في المجموعة الأولى برمز في الثانية. حرّك المؤشر لترى مضلع الوسيط ينتقل من «قبل» إلى «بعد».',
    en: 'A comparison of two groups, not of people: no code in the first set is matched to one in the second. Move the slider to see the median polygon shift from “before” to “after”.',
  },
  cmpGate: { ar: 'تظهر المقارنة حين تبلغ كل مجموعة الحد الأدنى من الرموز الصالحة المختلفة.', en: 'The comparison appears once each set reaches the minimum number of valid, distinct codes.' },
  cmpSame: { ar: 'رموز متطابقة في المجموعتين (الرمز نفسه لا يدل على تغيّر):', en: 'Codes present in both sets (the same code shows no change):' },
  cmpSlider: { ar: 'الانتقال من «قبل» إلى «بعد»', en: 'Shift from “before” to “after”' },
  cmpBefore: { ar: 'قبل', en: 'Before' },
  cmpAfter: { ar: 'بعد', en: 'After' },
  cmpCaption: { ar: 'مضلعا وسيط الفريق قبل البرنامج وبعده في المجالات الثمانية', en: 'The team’s median polygons before and after the programme across the eight domains' },
  cmpMedianBefore: { ar: 'الوسيط قبل', en: 'Median before' },
  cmpMedianAfter: { ar: 'الوسيط بعد', en: 'Median after' },
  cmpChange: { ar: 'التغير', en: 'Change' },
  cmpCovBefore: { ar: 'التغطية قبل', en: 'Coverage before' },
  cmpCovAfter: { ar: 'التغطية بعد', en: 'Coverage after' },
  cmpCovChange: { ar: 'تغير التغطية (نقطة مئوية)', en: 'Coverage change (points)' },

  print: { ar: 'اطبع ملخص احتياج الفريق', en: 'Print the team needs brief' },
  briefTitle: { ar: 'ملخص احتياج الفريق', en: 'Team needs brief' },
  briefDate: { ar: 'تاريخ الإعداد', en: 'Prepared on' },
  briefNumbers: { ar: 'الأرقام الأساسية', en: 'Key numbers' },
  briefDomains: { ar: 'المجالات', en: 'Domains' },
  briefRisks: { ar: 'نقاط الفشل المفردة وخطر التضخم', en: 'Single points of failure and inflation risk' },
  briefPriorities: { ar: 'الأولويات المشتركة وموضوعات الدفعة', en: 'Shared priorities and cohort themes' },
  briefIqr: { ar: 'الربعان الأول والثالث', en: 'Quartiles 1–3' },
  none: { ar: 'لا يوجد', en: 'None' },
  basisUsed: { ar: 'الأساس', en: 'Basis' },
  layerUsed: { ar: 'الطبقة', en: 'Layer' },
} satisfies Record<string, L>

/** Team-level wording of the engine's reason codes (third person, no «you»). */
export const teamReason: Record<Reason, L> = {
  both_below_target: reasonLabel.both_below_target,
  self_below_target: reasonLabel.self_below_target,
  judgment_below_self: { ar: 'المواقف دون التقدير الذاتي', en: 'Scenario below the self-rating' },
  inflated: { ar: 'التقدير أعلى من المواقف والتحقق المعرفي', en: 'Self-rating above both the scenario and the knowledge check' },
  maintain: reasonLabel.maintain,
}

/** Advice on a single-point-of-failure card (the headline already says how many are at «إتقان»). */
export const spofAdvice: Record<'borrow' | 'mentor', L> = {
  borrow: { ar: 'فكّر في استعارة خبرة أو استقطابها أثناء بناء القدرة داخلياً.', en: 'Consider borrowing or hiring expertise while building the capability in-house.' },
  mentor: { ar: 'اجعل هذا الشخص مرشداً، ووثّق معرفته حتى لا تبقى عنده وحده.', en: 'Make this person a mentor, and document what they know so it does not rest with them alone.' },
}

/** «build vs borrow» hint from how many codes are at «إتقان» or above in the domain. */
export const staffingText: Record<Staffing, L> = {
  build: {
    ar: 'في الفريق أكثر من شخص عند «إتقان» فأعلى: ابنِ القدرة داخلياً واجعلهم مرشدين للدفعة.',
    en: 'More than one person is at Proficiency or above: build the capability in-house and make them mentors for the cohort.',
  },
  mentor: {
    ar: 'شخص واحد عند «إتقان» فأعلى: اجعله مرشداً، ووثّق معرفته حتى لا تبقى عنده وحده.',
    en: 'One person is at Proficiency or above: make them a mentor, and document what they know so it does not rest with them alone.',
  },
  borrow: {
    ar: 'لا أحد عند «إتقان» فأعلى: فكّر في استعارة خبرة أو استقطابها أثناء بناء القدرة داخلياً.',
    en: 'Nobody is at Proficiency or above: consider borrowing or hiring expertise while building the capability in-house.',
  },
}

/** A quoted name: «…» in Arabic, “…” in English. */
export const quote = (text: string, lang: Lang): string => (lang === 'ar' ? `«${text}»` : `“${text}”`)

/** «سبتمبر 2026» / "September 2026" from YYYY-MM (Gregorian, Western digits). */
export function formatMonth(month: string, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-nu-latn-ca-gregory' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(`${month}-15T00:00:00Z`)
    )
  } catch {
    return month
  }
}
