import type { L } from '../types'
import type { ScenarioItem } from '../scenarios'

/**
 * «الموجز القيادي» and «فحص القرار القيادي» — content and pure helpers.
 * Independent reading — not an official position of any entity.
 */

export const BRIEF_REVIEWED_ON = '2026-10-22'

export const briefMeta = {
  eyebrow: { ar: 'للقادة والفرق', en: 'Leaders & teams' } as L,
  title: { ar: 'الموجز القيادي', en: 'The leader brief' } as L,
  lede: {
    ar: '5 تحولات في العمل الحكومي بين 2026 و2030، و3 قرارات تملكها هذا العام، و10 أسئلة تطرحها على فريقك. صفحة واحدة تقرؤها في 10 دقائق وتأخذها إلى اجتماع القيادة.',
    en: '5 shifts in government work between 2026 and 2030, 3 decisions you own this year, and 10 questions for your team. One page you can read in 10 minutes and take to your leadership meeting.',
  } as L,
  independence: {
    ar: 'قراءة مستقلة — ليست موقفاً رسمياً لأي جهة',
    en: 'An independent reading — not an official position of any entity',
  } as L,
  reviewedLabel: { ar: 'آخر مراجعة', en: 'Last reviewed' } as L,
  /** the context sentence under the title (a registered claim) */
  contextClaimId: 'leaders-wef-2025-skills-change',
}

/** «3 قرارات تملكها هذا العام» — synthesized from the five shifts. */
export interface OwnedDecision {
  id: string
  title: L
  why: L
  /** shifts this decision answers (ids in shifts.ts) */
  shiftIds: string[]
  domainId: string
  /** optional sourced support for the why-line */
  claimId?: string
}

export const ownedDecisions: OwnedDecision[] = [
  {
    id: 'genai-boundaries',
    title: {
      ar: 'ارسم حدود استخدام الذكاء الاصطناعي التوليدي في جهتك: أين يُسمح، وأين يُمنع، ومن يراجع.',
      en: 'Draw the boundaries for generative AI in your entity: where it is allowed, where it is not, and who reviews.',
    },
    why: {
      ar: 'في كثير من الجهات يستخدم الموظفون هذه الأدوات الآن؛ غياب القاعدة لا يمنع الاستخدام بل يخفيه، ويترك البيانات والقرارات بلا حماية.',
      en: 'In many entities staff are already using these tools; without a rule, use does not stop but goes out of sight, leaving data and decisions unprotected.',
    },
    shiftIds: ['genai-casework', 'cyber-privacy-duty'],
    domainId: 'ai-data',
    claimId: 'leaders-sdaia-ai-ethics',
  },
  {
    id: 'data-owners',
    title: {
      ar: 'سمِّ مالكاً لكل مجموعة بيانات تقوم عليها قراراتك، واطلب مصدر كل رقم في عروض القيادة.',
      en: 'Name an owner for every dataset your decisions rest on, and ask for the source of every figure in leadership briefings.',
    },
    why: {
      ar: 'القرار المبني على رقم بلا مالك أو مصدر يصعب الدفاع عنه أمام المجلس أو الجهات الرقابية.',
      en: 'A decision built on a figure with no owner or source is hard to defend before a board or an oversight body.',
    },
    shiftIds: ['data-decisions'],
    domainId: 'ai-data',
    claimId: 'leaders-ndmo-standards',
  },
  {
    id: 'one-product',
    title: {
      ar: 'حوّل مشروعاً رقمياً واحداً إلى منتج بفريق ثابت ومؤشر خدمة منشور، وقِس النتيجة قبل التوسع.',
      en: 'Turn one digital project into a product with a stable team and a published service indicator, and measure the result before scaling.',
    },
    why: {
      ar: 'تجربة واحدة مُدارة جيداً تعلّم الجهة طريقة العمل الجديدة أسرع من خطة شاملة على الورق.',
      en: 'One well-run pilot teaches the entity the new way of working faster than a comprehensive plan on paper.',
    },
    shiftIds: ['measured-services', 'product-delivery'],
    domainId: 'agile',
  },
]

export type BriefAudience = 'cio' | 'hr'

export const audienceNames: Record<BriefAudience, L> = {
  cio: { ar: 'لمدير التقنية', en: 'For your CIO' },
  hr: { ar: 'لمدير الموارد البشرية', en: 'For your HR director' },
}

export interface BriefQuestion {
  id: string
  to: BriefAudience
  question: L
  /** what a reassuring answer contains */
  listenFor: L
}

export const briefQuestions: BriefQuestion[] = [
  {
    id: 'q-cio-genai-tools',
    to: 'cio',
    question: {
      ar: 'أي أدوات الذكاء الاصطناعي التوليدي يستخدمها موظفونا اليوم فعلاً، وما البيانات التي تُدخل فيها؟',
      en: 'Which generative AI tools are our staff actually using today, and what data goes into them?',
    },
    listenFor: {
      ar: 'قائمة بالأدوات وتصنيف للبيانات المسموح إدخالها، لا «لا نستخدم شيئاً».',
      en: 'A list of tools and a classification of what data may go in, not “we use nothing”.',
    },
  },
  {
    id: 'q-cio-controls',
    to: 'cio',
    question: {
      ar: 'ما ضوابط الأمن السيبراني الأساسية التي لم نغلقها بعد، ومتى نغلقها؟',
      en: 'Which essential cybersecurity controls have we not yet closed, and when will we?',
    },
    listenFor: {
      ar: 'فجوات مسمّاة بتواريخ وميزانية، لا طمأنة عامة.',
      en: 'Named gaps with dates and budget, not general reassurance.',
    },
  },
  {
    id: 'q-cio-exit',
    to: 'cio',
    question: {
      ar: 'لو أردنا ترك مورّدنا السحابي الأكبر، كم يستغرق ذلك وكم يكلّف؟',
      en: 'If we wanted to leave our largest cloud supplier, how long would it take and what would it cost?',
    },
    listenFor: {
      ar: 'تقدير موثق، وخطة خروج جُرّبت على خدمة واحدة على الأقل.',
      en: 'A documented estimate, and an exit plan tried on at least one service.',
    },
  },
  {
    id: 'q-cio-service-indicators',
    to: 'cio',
    question: {
      ar: 'أي خدماتنا الرقمية لها مؤشر رضا أو وقت إنجاز منشور، ومن يملك تحسين كل منها؟',
      en: 'Which of our digital services have a published satisfaction or completion-time indicator, and who owns improving each one?',
    },
    listenFor: {
      ar: 'مؤشرات حقيقية تُراجع دورياً، واسم مالك لكل خدمة.',
      en: 'Real indicators reviewed regularly, and a named owner for each service.',
    },
  },
  {
    id: 'q-cio-data-owners',
    to: 'cio',
    question: {
      ar: 'ما مجموعات البيانات التي تقوم عليها قراراتنا الكبرى، ومن مالك كل منها؟',
      en: 'Which datasets do our major decisions rest on, and who owns each one?',
    },
    listenFor: {
      ar: 'أسماء ملّاك، ومستوى جودة معروف لكل مجموعة.',
      en: 'Named owners, and a known quality level for each dataset.',
    },
  },
  {
    id: 'q-hr-changing-jobs',
    to: 'hr',
    question: {
      ar: 'أي الوظائف في جهتنا تتغير مهامها أكثر بسبب الذكاء الاصطناعي التوليدي، وما خطتنا لشاغليها؟',
      en: 'Which jobs in our entity are changing most because of generative AI, and what is our plan for the people in them?',
    },
    listenFor: {
      ar: 'أسر وظيفية محددة وخطة لكل منها، لا برنامجاً عاماً للجميع.',
      en: 'Specific job families with a plan for each, not one general programme for everyone.',
    },
  },
  {
    id: 'q-hr-leaders-learning',
    to: 'hr',
    question: {
      ar: 'ما التطوير الرقمي الذي حصل عليه القياديون أنفسهم هذا العام، وفي أي مجالات؟',
      en: 'What digital development have our leaders themselves had this year, and in which domains?',
    },
    listenFor: {
      ar: 'القيادة داخل خطة التطوير لا خارجها.',
      en: 'Leaders inside the development plan, not outside it.',
    },
  },
  {
    id: 'q-hr-transfer',
    to: 'hr',
    question: {
      ar: 'كيف نعرف أن التدريب غيّر طريقة العمل، لا أنه زاد عدد الشهادات فقط؟',
      en: 'How do we know training changed how work is done, rather than just adding certificates?',
    },
    listenFor: {
      ar: 'أمثلة عمل حقيقية تغيّرت بعد التدريب، يرويها المديرون لا المدرّبون.',
      en: 'Real work examples that changed after training, told by managers rather than trainers.',
    },
  },
  {
    id: 'q-hr-build-buy',
    to: 'hr',
    question: {
      ar: 'هل نبني المهارات الرقمية النادرة أم نوظفها أم نستعين بها من الخارج، وعلى أي أساس نقرر؟',
      en: 'Do we build scarce digital skills, hire them or borrow them, and on what basis do we decide?',
    },
    listenFor: {
      ar: 'معيار واضح لكل خيار وكلفته ومدته.',
      en: 'A clear criterion for each option, with its cost and timeframe.',
    },
  },
  {
    id: 'q-hr-development-only',
    to: 'hr',
    question: {
      ar: 'كيف نضمن أن تقييم المهارات يُستخدم للتطوير فقط، لا للتقييم الوظيفي أو المفاضلة؟',
      en: 'How do we make sure skills assessment is used for development only, not for performance appraisal or ranking?',
    },
    listenFor: {
      ar: 'فصل مكتوب بين التطوير والأداء، ونتائج لا تُجمع بالأسماء.',
      en: 'A written separation of development from performance, and results that are not collected by name.',
    },
  },
]

// ── «فحص القرار القيادي» ────────────────────────────────────────────────

export const checkMeta = {
  title: { ar: 'فحص القرار القيادي', en: 'Leader judgment check' } as L,
  label: { ar: 'تمرين حكم مهني — تحريري غير معاير', en: 'Professional judgment exercise — editorial, not calibrated' } as L,
  claimId: 'leaders-editorial-check',
  outputTitle: { ar: '3 قرارات تستحق وقتك', en: '3 decisions worth your time' } as L,
}

/** Per executive scenario: the decision it stands for and a one-line next step. */
export const checkFocus: Record<string, { title: L; nextStep: L }> = {
  'sc-executive-ai-data': {
    title: { ar: 'ترتيب استثمارات الذكاء الاصطناعي', en: 'Ordering AI investments' },
    nextStep: {
      ar: 'اطلب لكل مبادرة ذكاء اصطناعي شروط توسع وتوقف معلنة قبل تمويلها.',
      en: 'Ask for declared scale and stop conditions for every AI initiative before funding it.',
    },
  },
  'sc-executive-cyber': {
    title: { ar: 'ما تقدمه للمجلس عن الأمن السيبراني', en: 'What you tell the board about cyber risk' },
    nextStep: {
      ar: 'اطلب صورة للمخاطر بمقاييس وخطة ممولة، وسمِّ ما لم يُغلق بعد.',
      en: 'Ask for a risk picture with metrics and a funded plan, and name what is not yet closed.',
    },
  },
  'sc-executive-cloud': {
    title: { ar: 'الارتهان لمورّد سحابي واحد', en: 'Lock-in to one cloud supplier' },
    nextStep: {
      ar: 'اطلب تقييماً مستقلاً لكلفة الخروج، وجرّب نقل حمل تشغيلي واحد.',
      en: 'Commission an independent exit-cost assessment, and try moving one workload.',
    },
  },
  'sc-executive-service-design': {
    title: { ar: 'الشمول في الخدمات الرقمية', en: 'Inclusion in digital services' },
    nextStep: {
      ar: 'سمِّ مالكاً لقناة بديلة لكل خدمة جديدة، وراجع استخدامها كل ربع سنة.',
      en: 'Name an owner for an alternative channel for every new service, and review its use every quarter.',
    },
  },
  'sc-executive-policy': {
    title: { ar: 'موقفك من تنظيم الذكاء الاصطناعي', en: 'Your position on AI regulation' },
    nextStep: {
      ar: 'اقترح ضوابط متناسبة مع المخاطر، وتاريخاً لمراجعة التنظيم نفسه.',
      en: 'Propose risk-proportionate controls, and a review date for the regulation itself.',
    },
  },
  'sc-executive-agile': {
    title: { ar: 'صدق تقارير البرامج', en: 'Honest programme reporting' },
    nextStep: {
      ar: 'اطلب تقارير بميزات تعمل فعلاً، وكافئ أول بلاغ مبكر عن التعثر.',
      en: 'Ask for reports on features that actually work, and reward the first early warning of trouble.',
    },
  },
  'sc-executive-emerging': {
    title: { ar: 'اختيار التقنيات الناشئة', en: 'Choosing emerging technologies' },
    nextStep: {
      ar: 'قارن التقنيات بمصفوفة معلنة، وخصص ميزانية استكشاف صغيرة ثابتة بمراجعة فصلية.',
      en: 'Compare technologies on a declared matrix, and set a small fixed exploration budget with quarterly review.',
    },
  },
  'sc-executive-leadership': {
    title: { ar: 'نسبة الإنجاز إلى أصحابه', en: 'Giving credit to those who delivered' },
    nextStep: {
      ar: 'ثبّت قاعدة «من صنع يقدّم» في عروض القيادة القادمة.',
      en: 'Make “those who built it present it” the rule in your next leadership briefings.',
    },
  },
}

/** Qualitative label per option grade — shown after choosing; never summed. */
export const optionMaturity: Record<0 | 1 | 2 | 3, L> = {
  3: { ar: 'الأنضج', en: 'Most mature' },
  2: { ar: 'سليم لكنه ناقص', en: 'Sound but incomplete' },
  1: { ar: 'جزئي', en: 'Partial' },
  0: { ar: 'يحتاج مراجعة', en: 'Needs rethinking' },
}

/**
 * Deterministic per-item shuffle (same algorithm as the assessment wizard) so the
 * stored worst→best order never leaks through position.
 */
export function shuffledOrder(id: string, n: number): number[] {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const arr = [...Array(n).keys()]
  for (let i = n - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0
    const j = h % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * «3 قرارات تستحق وقتك»: the scenarios where the chosen option scored lowest.
 * `answers` maps scenario id → stored option index. Ties keep scenario order.
 * Unanswered scenarios are ignored. No total is computed anywhere.
 */
export function focusDecisions(items: ScenarioItem[], answers: Record<string, number>, count = 3): ScenarioItem[] {
  return items
    .map((item, order) => {
      const idx = answers[item.id]
      const opt = idx === undefined ? undefined : item.options[idx]
      return { item, order, score: opt ? opt.score : null }
    })
    .filter((x): x is { item: ScenarioItem; order: number; score: 0 | 1 | 2 | 3 } => x.score !== null)
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .slice(0, count)
    .map((x) => x.item)
}

/** Index of the most mature option of a scenario (stored order). */
export function bestOptionIndex(item: ScenarioItem): number {
  let best = 0
  item.options.forEach((o, i) => {
    if (o.score > item.options[best].score) best = i
  })
  return best
}

const BUILDS_ON_PREVIOUS = /^\s*(أفعل ذلك|نفعل ذلك|do that)/i

/**
 * The most mature option as a self-contained sentence. Several scenario options
 * read «أفعل ذلك، و…» / “Do that, and …”, building on the second-best option;
 * shown alone they lose their subject, so the second-best text is prefixed.
 */
export function mostMatureText(item: ScenarioItem): L {
  const best = item.options[bestOptionIndex(item)]
  const builds = BUILDS_ON_PREVIOUS.test(best.text.ar) || BUILDS_ON_PREVIOUS.test(best.text.en)
  if (!builds) return best.text
  const second = item.options
    .filter((o) => o.score < best.score)
    .sort((a, b) => b.score - a.score)[0]
  if (!second) return best.text
  return { ar: `${second.text.ar} ثم: ${best.text.ar}`, en: `${second.text.en} Then: ${best.text.en}` }
}
