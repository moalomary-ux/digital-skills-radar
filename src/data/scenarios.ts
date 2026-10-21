import type { L } from './types'
import type { TrackId } from './tracks'

/**
 * v6 Round B — scenario-based judgment items: 5 tracks × 8 domains = 40.
 * Each item is a concrete Saudi-government workplace situation with four
 * response options ordered by judgment maturity (partial credit 0/1/2/3),
 * each option carrying a bilingual rationale shown after answering.
 * This measures «فهمي للموقف» (situational judgment) — a distinct evidence
 * layer from self-report and knowledge checks.
 *
 * EDITORIAL NOTE: items are authored editorially and are NOT yet
 * field-validated with pilot entities (declared on the Methodology page).
 */

export interface ScenarioOption {
  text: L
  score: 0 | 1 | 2 | 3
  rationale: L
}

export interface ScenarioItem {
  id: string
  trackId: TrackId
  domainId: string
  situation: L
  question: L
  options: ScenarioOption[] // stored ordered worst→best; display order is shuffled per item at render
}

export const scenarios: ScenarioItem[] = [
  // ══════════════ TRACK 1 — توعوي (Awareness) ══════════════
  {
    id: 'sc-awareness-ai-data', trackId: 'awareness', domainId: 'ai-data',
    situation: {
      ar: 'طلبت من أداة ذكاء اصطناعي معتمدة تلخيص تقرير قطاعي، فأعادت ملخصًا أنيقًا يتضمن رقمًا لا يظهر في التقرير الأصلي.',
      en: 'You asked an approved AI tool to summarize a sector report, and it returned a polished summary containing a figure that does not appear in the original report.',
    },
    question: { ar: 'ما التصرف الأصح؟', en: 'What is the right move?' },
    options: [
      {
        text: { ar: 'أستخدم الملخص كما هو — الأداة معتمدة رسميًا.', en: 'Use the summary as is — the tool is officially approved.' },
        score: 0,
        rationale: { ar: 'الاعتماد الرسمي لا يلغي الهلوسة؛ الرقم المختلق قد يدخل قرارًا رسميًا.', en: 'Official approval does not cancel hallucination; an invented figure could enter an official decision.' },
      },
      {
        text: { ar: 'أحذف الرقم الغريب وأستخدم الباقي.', en: 'Delete the odd figure and use the rest.' },
        score: 1,
        rationale: { ar: 'حذف ما لاحظته فقط يفترض أن بقية النص سليمة — وهذا غير مضمون دون مراجعة.', en: 'Removing only what you noticed assumes the rest is sound — not guaranteed without review.' },
      },
      {
        text: { ar: 'أقارن الملخص كاملًا بالمصدر قبل أي استخدام.', en: 'Compare the whole summary against the source before any use.' },
        score: 2,
        rationale: { ar: 'صحيح وضروري — لكنه يعالج هذه الحالة فقط دون قاعدة دائمة.', en: 'Correct and necessary — but it handles this case only, with no standing rule.' },
      },
      {
        text: { ar: 'أقارن بالمصدر، وأوثق الحادثة، وأقترح قاعدة «كل مخرج آلي له مراجع مسؤول».', en: 'Compare with the source, log the incident, and propose a standing rule: every AI output gets a named human reviewer.' },
        score: 3,
        rationale: { ar: 'يحمي الحالة الحالية ويحوّلها إلى ضمان مؤسسي دائم.', en: 'Protects the current case and converts it into a permanent institutional safeguard.' },
      },
    ],
  },
  {
    id: 'sc-awareness-cyber', trackId: 'awareness', domainId: 'cyber',
    situation: {
      ar: 'وصلتك رسالة تبدو من تقنية المعلومات في جهتك تطلب تسجيل الدخول لتحديث حسابك عبر رابط، قبل ساعة من اجتماع مهم.',
      en: 'A message seemingly from your entity’s IT asks you to log in via a link to update your account, an hour before an important meeting.',
    },
    question: { ar: 'ما التصرف الأصح؟', en: 'What is the right move?' },
    options: [
      {
        text: { ar: 'أضغط الرابط فورًا — لا وقت للتأخير.', en: 'Click the link immediately — no time to delay.' },
        score: 0,
        rationale: { ar: 'الاستعجال هو أداة المهاجم الأولى؛ الضغط تحت الضغط هو بالضبط ما يصمم له التصيد.', en: 'Urgency is the attacker’s primary tool; clicking under pressure is exactly what phishing is designed for.' },
      },
      {
        text: { ar: 'أتجاهل الرسالة وأمضي في يومي.', en: 'Ignore the message and carry on with my day.' },
        score: 1,
        rationale: { ar: 'أفضل من الضغط، لكن الصمت يترك زملاءك مكشوفين لنفس الرسالة.', en: 'Better than clicking, but silence leaves colleagues exposed to the same message.' },
      },
      {
        text: { ar: 'أتحقق من القناة الرسمية (البوابة الداخلية أو الاتصال بتقنية المعلومات برقم موثوق).', en: 'Verify through the official channel (internal portal or calling IT on a trusted number).' },
        score: 2,
        rationale: { ar: 'التحقق المستقل صحيح — وينقصه الإبلاغ لحماية الآخرين.', en: 'Independent verification is right — it just lacks reporting to protect others.' },
      },
      {
        text: { ar: 'أتحقق عبر القناة الرسمية وأبلّغ عن الرسالة كتصيد مشتبه به.', en: 'Verify via the official channel and report the message as suspected phishing.' },
        score: 3,
        rationale: { ar: 'تحقق + إبلاغ: يحميك ويغذي دفاع الجهة كله.', en: 'Verify + report: protects you and feeds the whole entity’s defense.' },
      },
    ],
  },
  {
    id: 'sc-awareness-cloud', trackId: 'awareness', domainId: 'cloud',
    situation: {
      ar: 'زميل يقترح رفع ملف بيانات مستفيدين على حساب سحابي شخصي «مؤقتًا» لأن النظام الداخلي بطيء اليوم.',
      en: 'A colleague suggests uploading a beneficiary-data file to a personal cloud account “temporarily” because the internal system is slow today.',
    },
    question: { ar: 'ما الموقف السليم؟', en: 'What is the sound position?' },
    options: [
      {
        text: { ar: 'أوافق — الملف مطلوب اليوم والنية حسنة.', en: 'Agree — the file is needed today and intentions are good.' },
        score: 0,
        rationale: { ar: 'النية الحسنة لا تبيح إقامة بيانات المواطنين خارج البنية المعتمدة.', en: 'Good intentions do not permit citizen data to reside outside approved infrastructure.' },
      },
      {
        text: { ar: 'أرفض بأدب دون اقتراح بديل.', en: 'Politely refuse without suggesting an alternative.' },
        score: 1,
        rationale: { ar: 'الرفض صحيح لكنه يترك الحاجة العملية دون حل.', en: 'Refusal is correct but leaves the practical need unsolved.' },
      },
      {
        text: { ar: 'أرفض وأقترح انتظار النظام الداخلي أو طلب مساحة عمل معتمدة.', en: 'Refuse and suggest waiting for the internal system or requesting an approved workspace.' },
        score: 2,
        rationale: { ar: 'يرفض الخطر ويعرض مسارًا مشروعًا — وهذا كافٍ للموقف.', en: 'Rejects the risk and offers a legitimate path — sufficient for the situation.' },
      },
      {
        text: { ar: 'أفعل ذلك وأشرح له خطر إقامة البيانات وأبلغ المشرف عن فجوة الأدوات التي دفعت للاقتراح.', en: 'Do that, and explain data-residency risk, and flag the tooling gap that prompted the suggestion to the supervisor.' },
        score: 3,
        rationale: { ar: 'يعالج الموقف والسبب الجذري: بطء النظام المعتمد يدفع الناس للالتفاف عليه.', en: 'Handles the situation and the root cause: a slow approved system pushes people to work around it.' },
      },
    ],
  },
  {
    id: 'sc-awareness-service-design', trackId: 'awareness', domainId: 'service-design',
    situation: {
      ar: 'خدمة رقمية جديدة في جهتك تتطلب 12 خطوة، وكبار السن يتصلون بالمركز لأنهم لا يكملونها.',
      en: 'A new digital service at your entity requires 12 steps, and elderly citizens call the center because they cannot complete it.',
    },
    question: { ar: 'ما الفهم الأصح للموقف؟', en: 'What is the sound understanding of this situation?' },
    options: [
      {
        text: { ar: 'المشكلة في المستخدمين — يحتاجون تدريبًا على الأدوات الرقمية.', en: 'The problem is the users — they need training on digital tools.' },
        score: 0,
        rationale: { ar: 'لوم المستفيد يعكس الفشل: الخدمة مصممة بعيدًا عن قدرات جمهورها.', en: 'Blaming users reverses the failure: the service was designed away from its audience’s abilities.' },
      },
      {
        text: { ar: 'أوجههم إلى القناة الهاتفية عند كل اتصال.', en: 'Route them to the phone channel on every call.' },
        score: 1,
        rationale: { ar: 'يحل الاتصال الفوري ويترك الخدمة المعطلة كما هي.', en: 'Solves the immediate call and leaves the broken service unchanged.' },
      },
      {
        text: { ar: 'أبلغ فريق الخدمة بأن كبار السن يتعثرون في خطوات محددة.', en: 'Tell the service team that elderly users struggle at specific steps.' },
        score: 2,
        rationale: { ar: 'ملاحظة مفيدة تصلح الجذر — لكنها تبقى بلاغًا عابرًا.', en: 'A useful observation that fixes the root — but remains a passing note.' },
      },
      {
        text: { ar: 'أوثق الخطوات المتعثرة بعدد الاتصالات وأقترح مسارًا ميسّرًا أو مراجعة تصميمية مسجلة.', en: 'Document the failing steps with call counts and propose an assisted route or a logged design review.' },
        score: 3,
        rationale: { ar: 'يحول شكاوى متفرقة إلى دليل قابل للتصميم عليه — جوهر الشمول.', en: 'Turns scattered complaints into designable evidence — the core of inclusion.' },
      },
    ],
  },
  {
    id: 'sc-awareness-policy', trackId: 'awareness', domainId: 'policy',
    situation: {
      ar: 'قرأت أن نظام حماية البيانات الشخصية صار ملزمًا، وتسأل نفسك: هل يمس عملي أصلًا؟',
      en: 'You read that the Personal Data Protection Law is now enforced, and wonder: does it even touch my work?',
    },
    question: { ar: 'أي فهم أدق؟', en: 'Which understanding is most accurate?' },
    options: [
      {
        text: { ar: 'هذا شأن القسم القانوني فقط.', en: 'This is the legal department’s business only.' },
        score: 0,
        rationale: { ar: 'كل من يلمس بيانات مستفيدين — حتى في جدول بسيط — داخل نطاق النظام.', en: 'Anyone who touches beneficiary data — even in a simple spreadsheet — is within the law’s scope.' },
      },
      {
        text: { ar: 'يمس فقط من يعمل في أنظمة تقنية المعلومات.', en: 'It only touches IT staff.' },
        score: 1,
        rationale: { ar: 'النظام يغطي المعالجة اليدوية والورقية أيضًا، لا الأنظمة فقط.', en: 'The law covers manual and paper processing too, not just systems.' },
      },
      {
        text: { ar: 'يمس أي معالجة لبيانات شخصية في عملي، وأراجع إرشادات الجهة.', en: 'It touches any personal-data processing in my work, and I should review my entity’s guidance.' },
        score: 2,
        rationale: { ar: 'فهم صحيح للنطاق مع خطوة فعلية.', en: 'A correct grasp of scope with a concrete step.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأتحقق من أن المهام التي أؤديها (جمع، تخزين، مشاركة) لها أساس نظامي موثق.', en: 'Do that, and verify that the tasks I perform (collecting, storing, sharing) have a documented legal basis.' },
        score: 3,
        rationale: { ar: 'ينقل الوعي من المعرفة إلى فحص الممارسة الفعلية — وهو ما يطلبه النظام.', en: 'Moves awareness from knowledge to auditing actual practice — what the law expects.' },
      },
    ],
  },
  {
    id: 'sc-awareness-agile', trackId: 'awareness', domainId: 'agile',
    situation: {
      ar: 'فريقك الانتقل إلى دورات عمل أسبوعية، وأول اجتماع استرجاع (Retrospective) على الأبواب ولا تعرف دورك فيه.',
      en: 'Your team moved to weekly work cycles, and the first retrospective is coming up — you don’t know your role in it.',
    },
    question: { ar: 'ما التصرف الأنسب؟', en: 'What is the best move?' },
    options: [
      {
        text: { ar: 'أحضر صامتًا — الاجتماع للمدراء أساسًا.', en: 'Attend silently — the meeting is mainly for managers.' },
        score: 0,
        rationale: { ar: 'الاسترجاع ملك الفريق كله؛ الصمت يهدر قيمته.', en: 'The retrospective belongs to the whole team; silence wastes its value.' },
      },
      {
        text: { ar: 'أطلب إعفاءً لانشغالي بالتسليم.', en: 'Ask to be excused because of delivery pressure.' },
        score: 1,
        rationale: { ar: 'التسليم بلا تحسين يعيد إنتاج نفس المشكلات كل دورة.', en: 'Delivery without improvement reproduces the same problems every cycle.' },
      },
      {
        text: { ar: 'أحضر وأجيب عندما يُسألني الميسّر.', en: 'Attend and answer when the facilitator asks me.' },
        score: 2,
        rationale: { ar: 'مشاركة مقبولة لكنها سلبية.', en: 'Acceptable but passive participation.' },
      },
      {
        text: { ar: 'أحضر مع ملاحظة واحدة محددة عن «ما أبطأني هذا الأسبوع وما اقتراحي».', en: 'Attend with one specific note on “what slowed me this week and what I propose”.' },
        score: 3,
        rationale: { ar: 'الاسترجاع يعمل بمدخلات ملموسة من الجميع — هكذا تتحسن الطريقة فعلًا.', en: 'Retrospectives run on concrete input from everyone — that is how the way of working actually improves.' },
      },
    ],
  },
  {
    id: 'sc-awareness-emerging', trackId: 'awareness', domainId: 'emerging',
    situation: {
      ar: 'زميل متحمس يقترح «سلسلة كتل» لأرشيف وثائق داخلي بسيط يعمل جيدًا.',
      en: 'An enthusiastic colleague proposes blockchain for a simple internal document archive that works well.',
    },
    question: { ar: 'أي رد أحكم؟', en: 'Which response is most sound?' },
    options: [
      {
        text: { ar: 'أؤيده — التقنية الجديدة دائمًا تقدم.', en: 'Support it — new technology is always progress.' },
        score: 0,
        rationale: { ar: 'الجدة ليست قيمة بذاتها؛ والأرشيف البسيط لا يحتاج سجلًا موزعًا.', en: 'Novelty is not value in itself; a simple archive does not need a distributed ledger.' },
      },
      {
        text: { ar: 'أرفض بحذر — لا نريد مخاطر.', en: 'Cautiously refuse — we don’t want risks.' },
        score: 1,
        rationale: { ar: 'الحذر الأعمى يمنع أيضًا التجارب المجدية في مواضعها الصحيحة.', en: 'Blind caution also blocks worthwhile experiments in the right places.' },
      },
      {
        text: { ar: 'أسأل: ما المشكلة التي تحلها السلسلة ولا يحلها قاعدة البيانات الحالية؟', en: 'Ask: what problem does the chain solve that the current database does not?' },
        score: 2,
        rationale: { ar: 'سؤال صحيح يفصل القيمة عن الضجيج.', en: 'The right question — separates value from hype.' },
      },
      {
        text: { ar: 'أسأل ذلك، وأقترح تقييمًا قصيرًا موثقًا بمعايير معلنة (قيمة، جاهزية، مخاطر، كلفة) يقرر بلا انحياز.', en: 'Ask that, and propose a short documented evaluation with declared criteria (value, readiness, risk, cost) that decides without bias.' },
        score: 3,
        rationale: { ar: 'يحول نقاش الأهواء إلى قرار منهجي قابل للدفاع.', en: 'Turns a preference debate into a defensible methodical decision.' },
      },
    ],
  },
  {
    id: 'sc-awareness-leadership', trackId: 'awareness', domainId: 'leadership',
    situation: {
      ar: 'في اجتماع، قدّم زميل جديد اقتراحًا غير ناضج لكنه مبتكر، فرد عليه مدير بحدة أمام الجميع.',
      en: 'In a meeting, a new colleague offered an immature but innovative suggestion, and a manager shot it down harshly in front of everyone.',
    },
    question: { ar: 'ما الفهم الأصح لدينامية الفريق هنا؟', en: 'What is the soundest reading of the team dynamic here?' },
    options: [
      {
        text: { ar: 'المدير مصيب — المعايير أولًا.', en: 'The manager is right — standards first.' },
        score: 0,
        rationale: { ar: 'الرد الحاد العلني يقتل مشاركة الفريق المستقبلية أكثر مما يحمي المعايير.', en: 'Harsh public rejection kills future participation more than it protects standards.' },
      },
      {
        text: { ar: 'ليس شأني — أنا لست طرفًا.', en: 'Not my business — I’m not a party to it.' },
        score: 1,
        rationale: { ar: 'ثقافة الفريق مسؤولية جماعية؛ الصمت يثبت النمط.', en: 'Team culture is a collective responsibility; silence cements the pattern.' },
      },
      {
        text: { ar: 'أشجع الزميل لاحقًا على انفراد.', en: 'Encourage the colleague privately afterwards.' },
        score: 2,
        rationale: { ar: 'لطيف ومفيد — لكنه يعالج الأثر لا السلوك.', en: 'Kind and helpful — but treats the impact, not the behavior.' },
      },
      {
        text: { ar: 'أشجع الزميل، وأضيف في الموقف قيمة الفكرة بأدب («فيها زاوية تستحق التطوير…»)، وأقترح لاحقًا قاعدة فريق لنقد الفكرة لا صاحبها.', en: 'Encourage the colleague, and in the moment gently surface the idea’s merit (“there’s an angle worth developing…”), and later propose a team rule: critique the idea, not the person.' },
        score: 3,
        rationale: { ar: 'يحمي الشخص والفكرة ويصلح القاعدة — بناء السلامة النفسية عمليًا.', en: 'Protects the person and the idea and fixes the norm — practical psychological-safety building.' },
      },
    ],
  },
]

// ══════════════ TRACK 2 — أساسي تطبيقي (Applied) ══════════════
scenarios.push(
  {
    id: 'sc-applied-ai-data', trackId: 'applied', domainId: 'ai-data',
    situation: {
      ar: 'مديرك يطلب لوحة مؤشرات أسبوعية لمؤشرات الخدمة. لديك ملف إكسل من ثلاث إدارات بصيغ مختلفة وأسماء أعمدة متباينة.',
      en: 'Your manager asks for a weekly dashboard of service indicators. You have an Excel file from three departments with different formats and inconsistent column names.',
    },
    question: { ar: 'ما أول خطوة مهنية صحيحة؟', en: 'What is the first professionally sound step?' },
    options: [
      {
        text: { ar: 'أدمج الملفات وأبني الرسم فورًا لتسليمه اليوم.', en: 'Merge the files and build the chart right away to deliver today.' },
        score: 0,
        rationale: { ar: 'السرعة فوق التوحيد تنتج لوحة جميلة وخاطئة.', en: 'Speed over standardization produces a pretty, wrong dashboard.' },
      },
      {
        text: { ar: 'أطلب من كل إدارة إعادة إرسال ملفها بالصيغة الصحيحة.', en: 'Ask each department to resend its file in the right format.' },
        score: 1,
        rationale: { ar: 'يرمي عبء التوحيد على الآخرين دون تعريف مشترك — ستعود المشكلة أسبوعيًا.', en: 'Throws the standardization burden back without a shared definition — the problem returns weekly.' },
      },
      {
        text: { ar: 'أوحد التعريفات وأعمدة الحقول في قالب مشترك ثم أدمج.', en: 'Standardize definitions and fields in a shared template, then merge.' },
        score: 2,
        rationale: { ar: 'صحيح تقنيًا ويكفي للمهمة الحالية.', en: 'Technically correct and sufficient for the current task.' },
      },
      {
        text: { ar: 'أفعل ذلك وأوثق التعريفات بحيث يصبح القالب هو المرجع الأسبوعي الدائم.', en: 'Do that and document the definitions so the template becomes the standing weekly reference.' },
        score: 3,
        rationale: { ar: 'يحول مهمة متكررة إلى أصل معياري — محو أمية بيانات عملي.', en: 'Turns a recurring task into a standard asset — practical data literacy.' },
      },
    ],
  },
  {
    id: 'sc-applied-cyber', trackId: 'applied', domainId: 'cyber',
    situation: {
      ar: 'تحتاج مشاركة ملف يحوي بيانات مستفيدين مع مقاول خارجي هذا الأسبوع، ومديرك في إجازة.',
      en: 'You need to share a file containing beneficiary data with an external contractor this week, and your manager is on leave.',
    },
    question: { ar: 'ما التصرف الصحيح؟', en: 'What is the correct action?' },
    options: [
      {
        text: { ar: 'أرسله عبر بريدي الشخصي — العمل لا ينتظر.', en: 'Send it via my personal email — work can’t wait.' },
        score: 0,
        rationale: { ar: 'خرق مباشر لحماية البيانات الشخصية بغض النظر عن الاستعجال.', en: 'A direct personal-data protection breach regardless of urgency.' },
      },
      {
        text: { ar: 'أنتظر عودة المدير دون إخبار أحد.', en: 'Wait for the manager’s return without telling anyone.' },
        score: 1,
        rationale: { ar: 'آمن لكنه يخفي التعطل عن من يستطيع إنهاءه نظاميًا.', en: 'Safe, but hides the blockage from those who can resolve it properly.' },
      },
      {
        text: { ar: 'أستخدم قناة المشاركة المعتمدة بعد التحقق من وجود اتفاقية معالجة بيانات مع المقاول.', en: 'Use the approved sharing channel after verifying a data-processing agreement exists with the contractor.' },
        score: 2,
        rationale: { ar: 'القناة المعتمدة + سند تعاقدي — صحيح نظاميًا.', en: 'Approved channel + contractual basis — legally sound.' },
      },
      {
        text: { ar: 'أفعل ذلك وأطبق التقليل: أرسل فقط الحقول اللازمة للمهمة، وأوثق المشاركة.', en: 'Do that and apply minimization: send only the fields the task needs, and log the sharing.' },
        score: 3,
        rationale: { ar: 'قناة معتمدة + أساس تعاقدي + تقليل البيانات + أثر توثيقي — النموذج الكامل.', en: 'Approved channel + contractual basis + minimization + an audit trail — the full model.' },
      },
    ],
  },
  {
    id: 'sc-applied-cloud', trackId: 'applied', domainId: 'cloud',
    situation: {
      ar: 'تطبيق داخلي بسيط تشرف على محتواه تعطل صباحًا؛ المزود السحابي يقول «السحابة تعمل عندنا» والمطوّر يقول «المشكلة في الاستضافة».',
      en: 'A simple internal app you oversee went down this morning; the cloud provider says “the cloud works on our side” and the developer says “the problem is hosting”.',
    },
    question: { ar: 'كيف تتصرف؟', en: 'How do you act?' },
    options: [
      {
        text: { ar: 'أنتظر حتى يتفق الطرفان.', en: 'Wait until the two parties agree.' },
        score: 0,
        rationale: { ar: 'الخدمة متعطلة والمستخدمون ينتظرون — الانتظار تنازل عن المسؤولية.', en: 'The service is down and users are waiting — waiting abdicates responsibility.' },
      },
      {
        text: { ar: 'أعيد نشر التطبيق بنفسي فورًا بأي طريقة.', en: 'Redeploy the app myself immediately, any way possible.' },
        score: 1,
        rationale: { ar: 'قد يصلح أو يكسر أكثر — بلا تشخيص ولا صلاحية واضحة.', en: 'May fix or break further — no diagnosis, no clear authority.' },
      },
      {
        text: { ar: 'أجمع الطرفين على مكالمة واحدة بسجل أحداث (وقت التعطل، آخر تغيير، رسائل الخطأ) وأطلب نقطة قرار واضحة.', en: 'Bring both parties onto one call with an event log (outage time, last change, error messages) and demand a clear decision point.' },
        score: 2,
        rationale: { ar: 'تصعيد منظم بدليل — التصرف التشغيلي الصحيح.', en: 'Organized escalation with evidence — the correct operational move.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأوثق زمن التعطل مقابل اتفاقية مستوى الخدمة، وأطلب مراجعة لاحقة للسبب الجذري بعد الاستعادة.', en: 'Do that, and log downtime against the SLA, and request a root-cause review after recovery.' },
        score: 3,
        rationale: { ar: 'يعيد الخدمة، ويحمي الحقوق التعاقدية، ويمنع التكرار.', en: 'Restores the service, protects contractual rights, and prevents recurrence.' },
      },
    ],
  },
  {
    id: 'sc-applied-service-design', trackId: 'applied', domainId: 'service-design',
    situation: {
      ar: 'تُكلف بمراجعة نص صفحة خدمة كتبه زميل تقني: مليء بمصطلحات مثل «التشغيل البيني» و«الضوابط الاستراتيجية».',
      en: 'You are asked to review a service-page text written by a technical colleague: full of terms like “interoperability” and “strategic controls”.',
    },
    question: { ar: 'ما أول تدخل تحريري صحيح؟', en: 'What is the first correct editorial intervention?' },
    options: [
      {
        text: { ar: 'أتركه — الجمهور سيتعود.', en: 'Leave it — the audience will adapt.' },
        score: 0,
        rationale: { ar: 'الخدمة الحكومية يجب أن تفهم من أول قراءة — التعود ليس هدفًا.', en: 'A government service must be understood on first read — adaptation is not the goal.' },
      },
      {
        text: { ar: 'أعيد كتابته كاملًا بأسلوبي وحدي.', en: 'Rewrite it entirely in my own style alone.' },
        score: 1,
        rationale: { ar: 'يستبدل صوتًا بصوت دون معيار مستخدم.', en: 'Replaces one voice with another with no user standard.' },
      },
      {
        text: { ar: 'أستبدل المصطلحات بلغة بسيطة وأختبر النص على شخص من الجمهور المستهدف.', en: 'Replace jargon with plain language and test the text on one target-audience reader.' },
        score: 2,
        rationale: { ar: 'لغة بسيطة + اختبار مستخدم واحد — تصميم محتوى حقيقي.', en: 'Plain language + one-user test — real content design.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأقترح دليل أسلوب مصغر للفريق يمنع المصطلحات من المصدر.', en: 'Do that, and propose a mini style guide for the team that prevents jargon at the source.' },
        score: 3,
        rationale: { ar: 'يصلح النص والعملية التي أنتجته.', en: 'Fixes the text and the process that produced it.' },
      },
    ],
  },
  {
    id: 'sc-applied-policy', trackId: 'applied', domainId: 'policy',
    situation: {
      ar: 'إدارتك تريد نشر مجموعة بيانات «على المفتوح» لأن جهة أخرى نشرت مشابهتها وحظيت بإعلام جيد.',
      en: 'Your unit wants to publish a dataset as open data because another entity published a similar one and got good press.',
    },
    question: { ar: 'ما مساهمتك المهنية؟', en: 'What is your professional contribution?' },
    options: [
      {
        text: { ar: 'أساعد في النشر فورًا — الزخم مهم.', en: 'Help publish immediately — momentum matters.' },
        score: 0,
        rationale: { ar: 'النشر بلا فحص قد يكشف بيانات شخصية أو يخرق التصنيف.', en: 'Publishing without review may expose personal data or breach classification.' },
      },
      {
        text: { ar: 'أقترح التريث حتى إشعار أمني كامل من كل الجهات.', en: 'Suggest holding until a full security clearance from everyone.' },
        score: 1,
        rationale: { ar: 'الحذر المطلق يقتل الانفتاح المشروع — التوازن مطلوب.', en: 'Absolute caution kills legitimate openness — balance is required.' },
      },
      {
        text: { ar: 'أجري فحصًا للخصوصية والجودة والتصنيف قبل النشر.', en: 'Run a privacy, quality and classification check before publishing.' },
        score: 2,
        rationale: { ar: 'الفحص الصحيح في المكان الصحيح.', en: 'The right check in the right place.' },
      },
      {
        text: { ar: 'أفعل ذلك عبر قائمة فحص نشر موثقة (أساس نظامي، تقليل، جودة، مالك) لتصبح القناة الدائمة.', en: 'Do that via a documented publishing checklist (legal basis, minimization, quality, owner) so it becomes the standing channel.' },
        score: 3,
        rationale: { ar: 'يحمي هذه الحزمة ويبني قدرة الانفتاح المتكررة.', en: 'Protects this dataset and builds repeatable openness capability.' },
      },
    ],
  },
  {
    id: 'sc-applied-agile', trackId: 'applied', domainId: 'agile',
    situation: {
      ar: 'في منتصف دورة تطوير، يطلب مدير كبير إضافة ميزة «صغيرة» فورًا، وفريقك في منتصف الالتزام.',
      en: 'Mid-sprint, a senior manager requests a “small” feature immediately, and your team is mid-commitment.',
    },
    question: { ar: 'ما الموقف المهني السليم؟', en: 'What is the sound professional position?' },
    options: [
      {
        text: { ar: 'نضيفها فورًا — رفض القيادة مستحيل.', en: 'Add it immediately — refusing leadership is impossible.' },
        score: 0,
        rationale: { ar: 'التسلسل الصامت يعلّم الجهة أن الالتزامات لا معنى لها.', en: 'Silent compliance teaches the organization that commitments are meaningless.' },
      },
      {
        text: { ar: 'نرفض تمامًا — الدورة مقدسة.', en: 'Refuse entirely — the sprint is sacred.' },
        score: 1,
        rationale: { ar: 'الطقسية الجامدة تفقد ثقة الرعاة؛ المرونة لها ثمن يجب أن يُرى.', en: 'Rigid ritualism loses sponsor trust; flexibility has a cost that must be made visible.' },
      },
      {
        text: { ar: 'نقيّم الأثر ونعرض المقايضة: ماذا يخرج من الدورة ليدخل هذا؟', en: 'Assess the impact and offer the trade-off: what leaves the sprint for this to enter?' },
        score: 2,
        rationale: { ar: 'يجعل الكلفة مرئية ويعيد القرار لصاحبه.', en: 'Makes the cost visible and returns the decision to its owner.' },
      },
      {
        text: { ar: 'نفعل ذلك، ونوثق الطلب وقراره في قائمة الأعمال — فإن تكرر رُوجع نمط المقاطعات في الاسترجاع.', en: 'Do that, and log the request and its decision in the backlog — if it recurs, the interruption pattern is reviewed at the retrospective.' },
        score: 3,
        rationale: { ar: 'يحل اللحظة ويحمي النظام من التآكل المتكرر.', en: 'Solves the moment and protects the system from repeated erosion.' },
      },
    ],
  },
  {
    id: 'sc-applied-emerging', trackId: 'applied', domainId: 'emerging',
    situation: {
      ar: 'جهتك تدرس مساعدًا حواريًا للمستفيدين. العرض التجريبي للمورد كان مبهرًا في الإنجليزية.',
      en: 'Your entity is evaluating a citizen-facing chatbot. The vendor demo was impressive in English.',
    },
    question: { ar: 'ما الذي تطلبه قبل الرأي؟', en: 'What do you demand before giving an opinion?' },
    options: [
      {
        text: { ar: 'لا شيء — العرض كان مقنعًا.', en: 'Nothing — the demo was convincing.' },
        score: 0,
        rationale: { ar: 'العرض الإنجليزي المصقول لا يقول شيئًا عن العربية بلهجاتها.', en: 'A polished English demo says nothing about dialectal Arabic.' },
      },
      {
        text: { ar: 'أسأل عن السعر والمدة فقط.', en: 'Ask only about price and timeline.' },
        score: 1,
        rationale: { ar: 'الكلفة بلا جودة عربية مثبتة شراء أعمى.', en: 'Cost without proven Arabic quality is a blind purchase.' },
      },
      {
        text: { ar: 'أطلب اختبارًا على أسئلة مستفيدين حقيقية بالعربية — فصحى وعامية — مع قياس الدقة والتصعيد للبشر.', en: 'Demand a test on real citizen questions in Arabic — formal and colloquial — with accuracy measurement and human escalation.' },
        score: 2,
        rationale: { ar: 'اختبار على البيانات الحقيقية هو الدليل الوحيد ذو المعنى.', en: 'Testing on real data is the only meaningful evidence.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأشترط مقاييس مقبولة مسبقًا (دقة، احتواء، تصعيد) ومواد حكومية مرجعية للتدريب.', en: 'Do that, and require pre-agreed metrics (accuracy, containment, escalation) plus reference government content for training.' },
        score: 3,
        rationale: { ar: 'يحول التقييم إلى قرار بمعايير — ويمنع بيع العرض المسرحي.', en: 'Turns evaluation into a criteria-based decision — and prevents the staged demo sale.' },
      },
    ],
  },
  {
    id: 'sc-applied-leadership', trackId: 'applied', domainId: 'leadership',
    situation: {
      ar: 'أُسند إليك عرض نتائج مشروعك على نائب الرئيس غير التقني خلال عشر دقائق غدًا.',
      en: 'You’ve been assigned to present your project’s results to a non-technical deputy minister in ten minutes tomorrow.',
    },
    question: { ar: 'كيف تبني العرض؟', en: 'How do you build the presentation?' },
    options: [
      {
        text: { ar: 'أعرض كل ما أنجزناه بالتفصيل — الجهد يستحق.', en: 'Show everything we achieved in detail — the effort deserves it.' },
        score: 0,
        rationale: { ar: 'التفصيل الكامل في عشر دقائق يدفن القرار المطلوب.', en: 'Full detail in ten minutes buries the decision being asked for.' },
      },
      {
        text: { ar: 'أرسل التقرير التقني الكامل مسبقًا وبدلًا من العرض.', en: 'Send the full technical report beforehand instead of presenting.' },
        score: 1,
        rationale: { ar: 'وثيقة كثيفة لن تُقرأ — واللحظة القيادية تضيع.', en: 'A dense document won’t be read — and the leadership moment is lost.' },
      },
      {
        text: { ar: 'أفتتح بالنتيجة والأثر، ثم دليل واحد داعم، ثم طلب محدد.', en: 'Open with the outcome and impact, then one supporting piece of evidence, then a specific ask.' },
        score: 2,
        rationale: { ar: 'بنية صحيحة للقرار القيادي.', en: 'The right structure for an executive decision.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأجهّز ملحقًا تقنيًا للأسئلة، وأتدرب على الإجابة بصوت مسموع.', en: 'Do that, and prepare a technical annex for questions, and rehearse out loud.' },
        score: 3,
        rationale: { ar: 'الجاهزية للأسئلة هي ما يميز العرض الواثق — والتدريب الصوتي يكشف الضعف.', en: 'Readiness for questions distinguishes a confident briefing — and vocal rehearsal exposes weakness.' },
      },
    ],
  },
)

// ══════════════ TRACK 3 — تخصصي (Specialist) ══════════════
scenarios.push(
  {
    id: 'sc-specialist-ai-data', trackId: 'specialist', domainId: 'ai-data',
    situation: {
      ar: 'نموذجك التنبؤي للطلب على خدمة يحقق دقة 97% في الاختبار، لكنه يقلل باستمرار تقدير الطلب في منطقة جغرافية واحدة محرومة أصلًا.',
      en: 'Your service-demand prediction model scores 97% on the test set, but it consistently underestimates demand in one geographic region that is already underserved.',
    },
    question: { ar: 'ما الحكم المهني؟', en: 'What is the professional judgment?' },
    options: [
      {
        text: { ar: 'أنشره — 97% ممتازة رقميًا.', en: 'Ship it — 97% is numerically excellent.' },
        score: 0,
        rationale: { ar: 'الدقة الكلية تخفي ضررًا موزعًا بظلم — المقياس الجيد على الإجمال قد يكون سيئًا على الفئة.', en: 'Overall accuracy hides unevenly distributed harm — a metric good in aggregate can be bad for a subgroup.' },
      },
      {
        text: { ar: 'أحذف بيانات المنطقة لتتحسن الدقة.', en: 'Remove the region’s data to improve accuracy.' },
        score: 1,
        rationale: { ar: 'يزيل الإشارة لا المشكلة — والمنطقة تختفي من القرار كليًا.', en: 'Removes the signal, not the problem — and the region disappears from the decision entirely.' },
      },
      {
        text: { ar: 'أفصّل الأداء حسب المنطقة وأبلغ عنه كقيد قبل النشر.', en: 'Break down performance by region and report it as a limitation before shipping.' },
        score: 2,
        rationale: { ar: 'شفافية ضرورية — لكن النشر بلا معالجة يشرّع الضرر.', en: 'Necessary transparency — but shipping without mitigation legitimizes the harm.' },
      },
      {
        text: { ar: 'أفصّل الأداء، وأعالج الخلل (إعادة وزن/ميزان قيم)، وأضيف مراقبة عدالة دورية بعد النشر.', en: 'Break down performance, mitigate the bias (reweighting/thresholds), and add periodic fairness monitoring after launch.' },
        score: 3,
        rationale: { ar: 'تشخيص + معالجة + مراقبة مستمرة — دورة العدالة الكاملة.', en: 'Diagnosis + mitigation + continuous monitoring — the full fairness loop.' },
      },
    ],
  },
  {
    id: 'sc-specialist-cyber', trackId: 'specialist', domainId: 'cyber',
    situation: {
      ar: 'تراجع تصميم خدمة جديدة تطلب من المستفيدين صور الهوية الوطنية عبر البريد الإلكتروني «لتسريع التحقق».',
      en: 'You are reviewing a new service design that asks beneficiaries to email photos of their national ID “to speed up verification”.',
    },
    question: { ar: 'ما مراجعتك؟', en: 'What is your review?' },
    options: [
      {
        text: { ar: 'أقبل — البريد الداخلي آمن كفاية.', en: 'Accept — internal email is safe enough.' },
        score: 0,
        rationale: { ar: 'صور الهوية في البريد تتناثر بلا سيطرة — لا أرشفة ولا حذف ولا تحكم بالوصول.', en: 'ID photos in email scatter beyond control — no retention, no deletion, no access control.' },
      },
      {
        text: { ar: 'أرفض بلا بديل — الأمن أولًا.', en: 'Reject with no alternative — security first.' },
        score: 1,
        rationale: { ar: 'الرفض الأعمى يدفع الفرق للالتفاف حول الأمن بدل العمل معه.', en: 'Blind rejection pushes teams to route around security instead of working with it.' },
      },
      {
        text: { ar: 'أقترح التحقق عبر المنصة الوطنية للهوية (نفاذ) بدل جمع الصور.', en: 'Propose verification via the national identity platform (Nafath) instead of collecting photos.' },
        score: 2,
        rationale: { ar: 'يحل الحاجة دون إنشاء مخزن بيانات حساسة — الحل المعياري.', en: 'Solves the need without creating a sensitive-data store — the standard answer.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأوثق القرار كمبدأ «لا تجمع ما يمكن التحقق منه دون جمع» لمراجعات التصميم القادمة.', en: 'Do that, and document the decision as a principle — “never collect what can be verified without collecting” — for future design reviews.' },
        score: 3,
        rationale: { ar: 'يصلح التصميم ويرفع معيار الجهة كلها.', en: 'Fixes the design and raises the whole entity’s standard.' },
      },
    ],
  },
  {
    id: 'sc-specialist-cloud', trackId: 'specialist', domainId: 'cloud',
    situation: {
      ar: 'نظام قديم متعطل دوريًا؛ مورد يقترح «إعادة استضافة فورية على السحابة» كحل أرخص وأسرع.',
      en: 'A legacy system fails periodically; a vendor proposes “immediate rehosting to the cloud” as the cheaper, faster fix.',
    },
    question: { ar: 'ما تقييمك؟', en: 'What is your assessment?' },
    options: [
      {
        text: { ar: 'أوافق — أرخص وأسرع كما قيل.', en: 'Agree — cheaper and faster, as claimed.' },
        score: 0,
        rationale: { ar: 'نقل المشكلة لا يحلها — الأعطال ستنتقل مع الكود.', en: 'Moving the problem doesn’t solve it — the failures migrate with the code.' },
      },
      {
        text: { ar: 'أرفض السحابة جملة — النظام يعمل غالبًا.', en: 'Reject the cloud entirely — the system mostly works.' },
        score: 1,
        rationale: { ar: 'رفض بلا بديل يترك المستخدمين مع أعطال متكررة.', en: 'Rejection without an alternative leaves users with recurring outages.' },
      },
      {
        text: { ar: 'أطلب تحليل أسباب الأعطال أولًا ثم أوازن الخيارات (إعادة استضافة/بناء/استبدال).', en: 'Demand an outage root-cause analysis first, then weigh the options (rehost/rebuild/replace).' },
        score: 2,
        rationale: { ar: 'التشخيص قبل القرار — المنهج الصحيح.', en: 'Diagnosis before decision — the correct method.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأضيف كلفة الخروج المستقبلية (قفل المورد) وخطة اختبار قبول في القرار الموثق.', en: 'Do that, and add future exit cost (vendor lock-in) and an acceptance-test plan to the documented decision.' },
        score: 3,
        rationale: { ar: 'قرار يحمل نظرته البعدية وشروط نجاحه — هندسة لا شراء.', en: 'A decision carrying its forward view and success conditions — engineering, not purchasing.' },
      },
    ],
  },
  {
    id: 'sc-specialist-service-design', trackId: 'specialist', domainId: 'service-design',
    situation: {
      ar: 'صممت خدمة جديدة، واختبار قابلية الاستخدام الأول بخمسة مستخدمين أظهر أن ثلاثة تعثروا في الخطوة الثالثة.',
      en: 'You designed a new service, and the first usability test with five users showed three stumbling at step three.',
    },
    question: { ar: 'ما استنتاجك وخطوتك؟', en: 'What is your conclusion and next step?' },
    options: [
      {
        text: { ar: 'ثلاثة من خمسة عينة صغيرة جدًا — أتجاهلها.', en: 'Three of five is too small a sample — ignore it.' },
        score: 0,
        rationale: { ar: 'في اختبار قابلية الاستخدام 60% تعثرًا إشارة قوية — العينات الصغيرة كافية لكشف الحواجز الكبرى.', en: 'In usability testing a 60% failure rate is a strong signal — small samples suffice to expose major barriers.' },
      },
      {
        text: { ar: 'أضيف تلميحًا نصيًا عند الخطوة الثالثة.', en: 'Add a text hint at step three.' },
        score: 1,
        rationale: { ar: 'يلصق العرقلة بدل إزالتها — المستخدمون لا يقرأون التلميحات عادة.', en: 'Patches the stumble instead of removing it — users rarely read hints.' },
      },
      {
        text: { ar: 'أعيد تصميم الخطوة الثالثة وأعيد الاختبار قبل الإطلاق.', en: 'Redesign step three and retest before launch.' },
        score: 2,
        rationale: { ar: 'استجابة صحيحة وكافية للإشارة.', en: 'A correct, sufficient response to the signal.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأراجع ما قبلها وما بعدها (التعثر عادة يسبقه سوء تأهيل)، وأثبّت الاختبار كبوابة لكل إصدار.', en: 'Do that, and review the steps before and after it (stumbles usually follow poor priming), and make testing a gate for every release.' },
        score: 3,
        rationale: { ar: 'يعالج السياق لا النقطة، ويمنع التكرار مؤسسيًا.', en: 'Treats the context not the point, and prevents recurrence institutionally.' },
      },
    ],
  },
  {
    id: 'sc-specialist-policy', trackId: 'specialist', domainId: 'policy',
    situation: {
      ar: 'تقود صياغة دليل داخلي لاستخدام الذكاء الاصطناعي التوليدي في جهتك بعد حادثة إعلامية في جهة أخرى.',
      en: 'You are leading the drafting of an internal generative-AI use guide for your entity after a media incident at another entity.',
    },
    question: { ar: 'ما البنية الصحيحة للدليل؟', en: 'What is the guide’s sound structure?' },
    options: [
      {
        text: { ar: 'منع شامل — الأسلم إعلاميًا.', en: 'A blanket ban — safest for publicity.' },
        score: 0,
        rationale: { ar: 'المنع يدفع الاستخدام للخفاء بلا ضوابط — أسوأ الحالتين.', en: 'A ban drives usage underground with no guardrails — the worst of both worlds.' },
      },
      {
        text: { ar: 'نصيحة عامة بأسلوب «كن حذرًا».', en: 'Generic “be careful” advice.' },
        score: 1,
        rationale: { ar: 'إرشاد غير قابل للتنفيذ — لا يغير سلوكًا ولا يحمي عند الحادثة.', en: 'Non-actionable guidance — changes no behavior and protects no one in an incident.' },
      },
      {
        text: { ar: 'قواعد واضحة: ما المسموح، ما الممنوع (بيانات شخصية/سرية)، واجب المراجعة البشرية، وقائمة الأدوات المعتمدة.', en: 'Clear rules: what is allowed, what is forbidden (personal/classified data), mandatory human review, and an approved-tool list.' },
        score: 2,
        rationale: { ar: 'دليل قابل للتنفيذ فعلًا.', en: 'A genuinely enforceable guide.' },
      },
      {
        text: { ar: 'أضيف لذلك مسار تصعيد للحوادث ومراجعة دورية للدليل مع أمثلة محلية من عمل الجهة.', en: 'Add an incident-escalation path and periodic guide review with local examples from the entity’s own work.' },
        score: 3,
        rationale: { ar: 'الدليل الحي بمسار الحوادث والأمثلة المحلية يبقى مستخدمًا وموثوقًا.', en: 'A living guide with an incident path and local examples stays used and trusted.' },
      },
    ],
  },
  {
    id: 'sc-specialist-agile', trackId: 'specialist', domainId: 'agile',
    situation: {
      ar: 'فريقك سلّم كل مهام الدورة الثلاث الماضية لكن مؤشر استخدام الميزة الجديدة لم يتحرك.',
      en: 'Your team delivered every sprint task for the past three cycles, but the new feature’s usage metric has not moved.',
    },
    question: { ar: 'ما القراءة الصحيحة؟', en: 'What is the correct reading?' },
    options: [
      {
        text: { ar: 'نحتفل — الالتزام بالخطة نجاح.', en: 'Celebrate — sticking to the plan is success.' },
        score: 0,
        rationale: { ar: 'التسليم مخرجات؛ الاستخدام هو النتيجة — الخلط بينهما أخطر وهم في الإدارة الرشيقة.', en: 'Delivery is output; usage is outcome — conflating them is agile’s most dangerous illusion.' },
      },
      {
        text: { ar: 'المؤشر معطل تقنيًا غالبًا — أراجع التقنين.', en: 'The metric is probably broken — check the instrumentation.' },
        score: 1,
        rationale: { ar: 'افتراض ملائم يستحق الفحص، لكنه ليس الاستنتاج الافتراضي.', en: 'A convenient assumption worth checking, but not the default conclusion.' },
      },
      {
        text: { ar: 'أوقف الإضافات وأحقق في سبب عدم الاستخدام قبل الدورة القادمة.', en: 'Stop adding features and investigate the non-usage before the next sprint.' },
        score: 2,
        rationale: { ar: 'قرار شجاع وصحيح: لا تبنِ فوق فرضية مكسورة.', en: 'A brave, correct decision: don’t build on a broken assumption.' },
      },
      {
        text: { ar: 'أفعل ذلك عبر بحث مستخدمين قصير، وأعيد تعريف نجاح الدورات بمقياس النتيجة لا عدد المهام.', en: 'Do that through quick user research, and redefine sprint success by outcome metric, not task count.' },
        score: 3,
        rationale: { ar: 'يوقف الهدر ويصحح تعريف النجاح نفسه — قيادة المنتج الحقيقية.', en: 'Stops the waste and fixes the very definition of success — real product leadership.' },
      },
    ],
  },
  {
    id: 'sc-specialist-emerging', trackId: 'specialist', domainId: 'emerging',
    situation: {
      ar: 'بلدية تدرس «توأمًا رقميًا» لمنطقة تجارية. المورد يعرض نموذجًا ثلاثي الأبعاد جميلًا دون بيانات حية.',
      en: 'A municipality is considering a “digital twin” for a commercial district. The vendor shows a beautiful 3D model with no live data feeds.',
    },
    question: { ar: 'ما تقييمك التقني؟', en: 'What is your technical assessment?' },
    options: [
      {
        text: { ar: 'مبهر — أوصي بالشراء.', en: 'Impressive — recommend buying.' },
        score: 0,
        rationale: { ar: 'نموذج ثلاثي الأبعاد بلا بيانات حية ليس توأمًا — هو منظر.', en: 'A 3D model without live data is not a twin — it is scenery.' },
      },
      {
        text: { ar: 'أرفض كل التوائم — ضجيج.', en: 'Reject all twins — hype.' },
        score: 1,
        rationale: { ar: 'الرفض المطلق يغلق قيمة حقيقية موثقة في المدن الرائدة.', en: 'Absolute rejection closes off documented real value in leading cities.' },
      },
      {
        text: { ar: 'أطلب قائمة مصادر البيانات الحية وتحديثها وحالات قرار الصيانة التي سيخدمها التوأم.', en: 'Request the list of live data sources, their refresh rates, and the maintenance decisions the twin will serve.' },
        score: 2,
        rationale: { ar: 'الأسئلة الصحيحة تفصل التوأم عن المنظر.', en: 'The right questions separate a twin from a diorama.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأقترح تجربة محدودة على أصل واحد بمعيار نجاح قابل للقياس قبل أي توسع.', en: 'Do that, and propose a limited pilot on one asset with a measurable success criterion before any expansion.' },
        score: 3,
        rationale: { ar: 'تجربة صغيرة بمعيار — الاستكشاف الرصين للتقنية الناشئة.', en: 'A small pilot with a criterion — disciplined emerging-tech scouting.' },
      },
    ],
  },
  {
    id: 'sc-specialist-leadership', trackId: 'specialist', domainId: 'leadership',
    situation: {
      ar: 'انتهى مشروعك التقني بنجاح تقني، لكن الإدارات تستخدم بدائلها اليدوية القديمة بعد شهرين.',
      en: 'Your tech project shipped successfully, but two months on, departments are still using their old manual workarounds.',
    },
    question: { ar: 'ما تحليلك ودورك؟', en: 'What is your analysis and role?' },
    options: [
      {
        text: { ar: 'نجحنا تقنيًا — التبني ليس مسؤوليتي.', en: 'We succeeded technically — adoption is not my responsibility.' },
        score: 0,
        rationale: { ar: 'القيمة تُقاس بالاستخدام — «نجح تقنيًا» دون تبنٍّ يعني لم تنجح.', en: 'Value is measured by use — “technical success” without adoption means it did not succeed.' },
      },
      {
        text: { ar: 'أصدر تعميمًا يلزم بالاستخدام.', en: 'Issue a circular mandating use.' },
        score: 1,
        rationale: { ar: 'الإلزام بلا معالجة أسباب المقاومة ينتج امتثالًا شكليًا.', en: 'Mandates without addressing resistance produce formal compliance, not use.' },
      },
      {
        text: { ar: 'أقابل المستخدمين لأفهم لماذا عادوا للبدائل.', en: 'Meet the users to understand why they returned to the old ways.' },
        score: 2,
        rationale: { ar: 'الفهم أولًا — غالبًا توجد فجوة تدريب أو ملاءمة حقيقية.', en: 'Understand first — usually there is a real training or fit gap.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأعالج الفجوات، وأقيس التبني بمؤشر استخدام أسبوعي معلن حتى يستقر.', en: 'Do that, and close the gaps, and measure adoption with a published weekly usage metric until it stabilizes.' },
        score: 3,
        rationale: { ar: 'فهم + معالجة + قياس معلن — إدارة التغيير كما يجب أن تكون.', en: 'Understand + fix + published measurement — change management as it should be.' },
      },
    ],
  },
)

// ══════════════ TRACK 4 — قيادة الفرق والتحول (Team & transformation leadership) ══════════════
scenarios.push(
  {
    id: 'sc-team_lead-ai-data', trackId: 'team_lead', domainId: 'ai-data',
    situation: {
      ar: 'فريقك يستخدم أدوات ذكاء اصطناعي فرديًا بلا قواعد؛ كل شخص يصيغ بطريقته والمخرجات متفاوتة الجودة.',
      en: 'Your team uses AI tools individually with no rules; everyone prompts their own way and output quality varies widely.',
    },
    question: { ar: 'ما تدخلك القيادي؟', en: 'What is your leadership intervention?' },
    options: [
      {
        text: { ar: 'أتركهم — الحرية تبدع.', en: 'Leave them — freedom creates.' },
        score: 0,
        rationale: { ar: 'الفوضى غير الموثقة تنتج مخرجات لا يمكن الدفاع عنها ولا تكرارها.', en: 'Undocumented chaos produces outputs that can be neither defended nor repeated.' },
      },
      {
        text: { ar: 'أختار أفضل أمر وجدته وأفرضه على الجميع.', en: 'Pick the best prompt I found and impose it on everyone.' },
        score: 1,
        rationale: { ar: 'معيار فردي مفروض بلا مشاركة — يُتجاوز أول أسبوع.', en: 'A single imposed standard with no participation — bypassed within a week.' },
      },
      {
        text: { ar: 'نجمع مكتبة أوامر معتمدة لمهامنا المتكررة مع قواعد مراجعة.', en: 'Build an approved prompt library for our recurring tasks plus review rules.' },
        score: 2,
        rationale: { ar: 'معيار مشترك عملي — قفزة حقيقية في الاتساق.', en: 'A shared practical standard — a real consistency jump.' },
      },
      {
        text: { ar: 'نفعل ذلك في ورشة، مع مراجعة أقران للمخرجات وتحديث المكتبة من الدروس شهريًا.', en: 'Do that in a workshop, with peer review of outputs and monthly library updates from lessons learned.' },
        score: 3,
        rationale: { ar: 'معيار مشارك + مراجعة + تحسين دوري — قدرة مؤسسية لا قاعدة.', en: 'Co-created standard + review + periodic improvement — an institutional capability, not a rule.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-cyber', trackId: 'team_lead', domainId: 'cyber',
    situation: {
      ar: 'اكتشفت أن مطوّري فريقك يتشاركون حساب إداري واحدًا في نظام داخلي «للسرعة».',
      en: 'You discover your team’s developers share one admin account on an internal system “for speed”.',
    },
    question: { ar: 'ما ردك؟', en: 'What is your response?' },
    options: [
      {
        text: { ar: 'أغض الطرف — التسليم أهم الآن.', en: 'Look away — delivery matters more right now.' },
        score: 0,
        rationale: { ar: 'حساب مشترك يعني لا مساءلة فردية — عند الحادثة لن تعرف من فعل ماذا.', en: 'A shared account means no individual accountability — in an incident you won’t know who did what.' },
      },
      {
        text: { ar: 'أغلق الحساب المشترك فورًا وأوبخ الفريق علنًا.', en: 'Close the shared account immediately and reprimand the team publicly.' },
        score: 1,
        rationale: { ar: 'الإغلاق صحيح؛ التوبيخ العلني يدفع الممارسة للاختفاء لا للزوال.', en: 'Closing is right; public reprimand drives the practice into hiding, not extinction.' },
      },
      {
        text: { ar: 'أغلق الحساب، وأصدر حسابات فردية، وأسأل ما الذي جعل المشاركة «أسرع» وأعالجه.', en: 'Close the account, issue individual accounts, and ask what made sharing “faster” — then fix that.' },
        score: 2,
        rationale: { ar: 'يعالج السلوك وسببته التشغيلية.', en: 'Addresses the behavior and its operational cause.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأضيف مراجعة صلاحيات دورية وأبلغ أمن المعلومات طوعًا لتوثيق الدرس دون عقاب.', en: 'Do that, and add periodic access reviews, and voluntarily inform security to document the lesson without punishment.' },
        score: 3,
        rationale: { ar: 'إصلاح + منع + شفافية طوعية تبني ثقة الأمن بدل خوفه.', en: 'Fix + prevent + voluntary transparency builds trust in security instead of fear of it.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-cloud', trackId: 'team_lead', domainId: 'cloud',
    situation: {
      ar: 'فاتورة السحابة لفريقك تضاعفت في ثلاثة أشهر دون نمو استخدام يبررها.',
      en: 'Your team’s cloud bill doubled in three months with no usage growth to justify it.',
    },
    question: { ar: 'كيف تقود المعالجة؟', en: 'How do you lead the response?' },
    options: [
      {
        text: { ar: 'أطلب خفض الميزانية فورًا — أوقفوا الخوادم الزائدة.', en: 'Demand an immediate budget cut — shut down the extra servers.' },
        score: 0,
        rationale: { ar: 'الإغلاق الأعمى قد يوقف خدمة حية — الكلفة بلا خريطة انتحار تشغيلي.', en: 'Blind shutdown may kill a live service — cost-cutting without a map is operational suicide.' },
      },
      {
        text: { ar: 'أتجاهل — السحابة ترتفع أسعارها.', en: 'Ignore it — cloud prices rise.' },
        score: 1,
        rationale: { ar: 'التضخم غير المفحوص يخفي غالبًا موارد يتيمة وحقولًا مفتوحة.', en: 'Unchecked growth usually hides orphaned resources and open leaks.' },
      },
      {
        text: { ar: 'أطلب جردًا موسومًا للموارد (من يملك ماذا ولماذا) ومراجعة أسبوعية للفاتورة.', en: 'Request a tagged resource inventory (who owns what and why) and a weekly bill review.' },
        score: 2,
        rationale: { ar: 'الوسم والمراجعة أساس حوكمة الكلفة السحابية.', en: 'Tagging and review are the foundation of cloud cost governance.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأضيف حدود ميزانية بتنبيهات وإيقاف بيئات التطوير ليلًا كسياسة دائمة.', en: 'Do that, and add budget limits with alerts and nightly shutdown of dev environments as standing policy.' },
        score: 3,
        rationale: { ar: 'يحول الاستجابة إلى ضبط بنيوي مستمر للكلفة.', en: 'Turns the response into continuous structural cost control.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-service-design', trackId: 'team_lead', domainId: 'service-design',
    situation: {
      ar: 'خدمتك الرقمية حققت هدف الإطلاق، لكن قياس رضا المستفيدين الفصلي يهبط منذ فصلين.',
      en: 'Your digital service met its launch targets, but the quarterly beneficiary-satisfaction measure has fallen for two quarters.',
    },
    question: { ar: 'ما خطة قيادتك؟', en: 'What is your leadership plan?' },
    options: [
      {
        text: { ar: 'الإطلاق نجح — الرضا يتذبذب طبيعيًا.', en: 'Launch succeeded — satisfaction fluctuates naturally.' },
        score: 0,
        rationale: { ar: 'فصلان متتاليان اتجاه لا تذبذب — تجاهله يكلف ثقة المستفيدين.', en: 'Two consecutive quarters is a trend, not noise — ignoring it costs beneficiary trust.' },
      },
      {
        text: { ar: 'أطلب حملة توعية بالخدمة لرفع الرضا.', en: 'Order an awareness campaign to raise satisfaction.' },
        score: 1,
        rationale: { ar: 'التسويق لا يصلح خدمة متدهورة التجربة.', en: 'Marketing cannot fix a degrading service experience.' },
      },
      {
        text: { ar: 'أقرأ الشكاوى وأحدد أعلى سببين للهبوط وأخصص دورة لإصلاحهما.', en: 'Read the complaints, identify the top two causes of the decline, and dedicate a cycle to fixing them.' },
        score: 2,
        rationale: { ar: 'تشخيص مبني على الدليل وإصلاح مركز — صحيح.', en: 'Evidence-based diagnosis and focused fixing — correct.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأربط الرضا بمؤشر مراجعة دوري على لوحة الفريق مع مالك واضح لكل سبب.', en: 'Do that, and tie satisfaction to a periodic review metric on the team’s dashboard with a clear owner per cause.' },
        score: 3,
        rationale: { ar: 'يمنع الانزلاق القادم بتحويل الرضا إلى مسؤولية دائمة ممسوكة.', en: 'Prevents the next slide by turning satisfaction into a permanently owned responsibility.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-policy', trackId: 'team_lead', domainId: 'policy',
    situation: {
      ar: 'نظام جديد لحماية البيانات يسري على فريقك خلال 90 يومًا، وفريقك منشغل بالتسليم.',
      en: 'A new data-protection regulation applies to your team within 90 days, and the team is busy with delivery.',
    },
    question: { ar: 'كيف تجهز فريقك؟', en: 'How do you prepare your team?' },
    options: [
      {
        text: { ar: 'ننتظر إرشادات الجهة الرسمية.', en: 'Wait for official entity guidance.' },
        score: 0,
        rationale: { ar: 'الانتظار يترك 90 يومًا بلا حركة — والامتثال له أوان.', en: 'Waiting leaves 90 days motionless — and compliance has a deadline.' },
      },
      {
        text: { ar: 'أرسل رابط النظام للجميع ليقرأوه.', en: 'Send everyone the regulation link to read.' },
        score: 1,
        rationale: { ar: 'الرابط بلا ترجمة تشغيلية لا يغير ممارسة.', en: 'A link without operational translation changes no practice.' },
      },
      {
        text: { ar: 'أعين مالك امتثال في الفريق ونرسم أثر النظام على مهامنا الجارية.', en: 'Appoint a compliance owner in the team and map the regulation’s impact on our current work.' },
        score: 2,
        rationale: { ar: 'ملكية + خريطة أثر — البنية الصحيحة.', en: 'Ownership + impact mapping — the right structure.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأضيف نقاط تحقق شهرية ودليلًا داخليًا بأمثلتنا قبل تاريخ السريان.', en: 'Do that, and add monthly checkpoints and an internal guide with our own examples before the enforcement date.' },
        score: 3,
        rationale: { ar: 'ملكية + أثر + إيقاع مراجعة + دليل محلي — امتثال جاهز يومه الأول.', en: 'Ownership + impact + review rhythm + local guide — compliance ready on day one.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-agile', trackId: 'team_lead', domainId: 'agile',
    situation: {
      ar: 'دورتك القادمة مليئة بميزات جديدة، لكن الديون التقنية والأخطاء القديمة تتجمع وتبطئ الفريق.',
      en: 'Your next sprint is full of new features, but technical debt and old bugs are accumulating and slowing the team.',
    },
    question: { ar: 'كيف توازن قائمة الأعمال؟', en: 'How do you balance the backlog?' },
    options: [
      {
        text: { ar: 'الميزات أولًا دائمًا — هذا ما يُقاس عليه الفريق.', en: 'Features first, always — that’s what the team is measured on.' },
        score: 0,
        rationale: { ar: 'الدين يتراكم بفائدة — حتى يتوقف الفريق تقريبًا.', en: 'Debt compounds with interest — until the team nearly stops.' },
      },
      {
        text: { ar: 'نوقف كل شيء شهرًا لسداد الدين كله.', en: 'Stop everything for a month to pay all the debt.' },
        score: 1,
        rationale: { ar: 'التوقف الكامل يكسر ثقة أصحاب المصلحة ويصعب تبريره قياديًا.', en: 'A full stop breaks stakeholder trust and is hard to justify upward.' },
      },
      {
        text: { ar: 'أخصص نسبة ثابتة من كل دورة (20% مثلًا) للدين والأخطاء.', en: 'Allocate a fixed share of each sprint (e.g., 20%) to debt and bugs.' },
        score: 2,
        rationale: { ar: 'النسبة الثابتة سياسة سليمة ومستدامة.', en: 'A fixed share is sound, sustainable policy.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأعرض للرعاة منحنى سرعة الفريق مع الدين — نستثمر في السرعة علنًا لا سرًا.', en: 'Do that, and show sponsors the team-velocity curve against debt — investing in speed openly, not secretly.' },
        score: 3,
        rationale: { ar: 'يجعل صحة التقنية قرارًا قياديًا مرئيًا بدل استجداء فني خفي.', en: 'Makes technical health a visible leadership decision instead of a hidden technical plea.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-emerging', trackId: 'team_lead', domainId: 'emerging',
    situation: {
      ar: 'القيادة تطلب من فريقك «شيئًا بالذكاء الاصطناعي الوكيل» لعرضه في ملتقى قادم — دون حالة استخدام.',
      en: 'Leadership asks your team for “something with agentic AI” for an upcoming showcase — with no use case.',
    },
    question: { ar: 'ما ردك القيادي؟', en: 'What is your leadership response?' },
    options: [
      {
        text: { ar: 'نبني عرضًا مبهرًا — الملتقى فرصة ظهور.', en: 'Build a flashy demo — the showcase is visibility.' },
        score: 0,
        rationale: { ar: 'التقنية بحثًا عن مشكلة تنتج عرضًا مسرحيًا يموت بعد الملتقى.', en: 'Technology in search of a problem produces theater that dies after the showcase.' },
      },
      {
        text: { ar: 'أرفض — لدينا عمل حقيقي.', en: 'Refuse — we have real work.' },
        score: 1,
        rationale: { ar: 'الرفض الجاف يفوت فرصة توجيه الحماس القيادي نحو قيمة.', en: 'A flat refusal misses the chance to channel executive energy toward value.' },
      },
      {
        text: { ar: 'أقترح تجربة محدودة على عملية داخلية مزعجة فعلًا بمعيار نجاح معلن — وتُعرض نتيجتها أيًا كانت.', en: 'Propose a limited pilot on a genuinely annoying internal procedure with a declared success criterion — and present its result whatever it is.' },
        score: 2,
        rationale: { ar: 'يوجه الطلب نحو قيمة قابلة للقياس وصدق في العرض.', en: 'Channels the request toward measurable value and honest presentation.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأثبّت قاعدة: كل تجربة تقنية لدينا لها مشكلة موثقة ومعيار نجاح وشرط توقف.', en: 'Do that, and institutionalize the rule: every technology pilot we run has a documented problem, a success criterion, and a stop condition.' },
        score: 3,
        rationale: { ar: 'يحول حماس اللحظة إلى منهجية استكشاف دائمة — قيادة تحول حقيقية.', en: 'Turns momentary enthusiasm into a standing exploration discipline — real transformation leadership.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-leadership', trackId: 'team_lead', domainId: 'leadership',
    situation: {
      ar: 'دمجت جهتك مع وحدة أخرى، وفريقا العمل الرقمي فيهما يستخدمان أدوات وطرق عمل مختلفة كليًا، والفتور واضح.',
      en: 'Your entity merged with another unit, and the two digital teams use completely different tools and ways of working — the chill is obvious.',
    },
    question: { ar: 'ما أولويتك كقائد؟', en: 'What is your priority as leader?' },
    options: [
      {
        text: { ar: 'أفرض أدوات فريقي — الاتساق فورًا.', en: 'Impose my team’s tools — consistency now.' },
        score: 0,
        rationale: { ar: 'الفوز بالأدوات وخسارة الناس — الاستياء سيبطئ كل شيء لاحقًا.', en: 'Winning on tools, losing on people — resentment will slow everything later.' },
      },
      {
        text: { ar: 'أترك الفريقين منفصلين حتى يتعاشرا.', en: 'Leave the teams separate until they blend.' },
        score: 1,
        rationale: { ar: 'الانفصال المديد يرسخ ثقافتين ويضاعف الدين.', en: 'Prolonged separation cements two cultures and doubles the debt.' },
      },
      {
        text: { ar: 'نرسم معًا طريقة العمل المشتركة في ورشة بمشاركة الفريقين.', en: 'Co-design the shared way of working in a workshop with both teams.' },
        score: 2,
        rationale: { ar: 'المشاركة في بناء القاعدة تصنع الالتزام بها.', en: 'Participation in building the norm creates commitment to it.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأبدأ بمشروع صغير مشترك يثبت الطريقة الجديدة بفوز مبكر موثق.', en: 'Do that, and start with a small joint project that proves the new way with a documented early win.' },
        score: 3,
        rationale: { ar: 'القاعدة المشتركة + الفوز المبكر المشترك — أسرع طريق لفريق واحد.', en: 'A shared norm + a shared early win — the fastest route to one team.' },
      },
    ],
  },
)

// ══════════════ TRACK 5 — تنفيذي واستراتيجي (Executive & strategic) ══════════════
scenarios.push(
  {
    id: 'sc-executive-ai-data', trackId: 'executive', domainId: 'ai-data',
    situation: {
      ar: 'ثلاث فرص ذكاء اصطناعي تتنافس على نفس الميزانية: مساعد حواري للمستفيدين (ظهور إعلامي عالٍ)، أو تحليلات تنبؤية للطلب (أثر داخلي هادئ)، أو منصة حوكمة نماذج (بنية أساسية غير مرئية).',
      en: 'Three AI opportunities compete for the same budget: a citizen chatbot (high visibility), demand-prediction analytics (quiet internal impact), or a model-governance platform (invisible infrastructure).',
    },
    question: { ar: 'كيف ترتّبها؟', en: 'How do you order them?' },
    options: [
      {
        text: { ar: 'المساعد الحواري أولًا — الظهور يبني الزخم.', en: 'The chatbot first — visibility builds momentum.' },
        score: 0,
        rationale: { ar: 'الظهور بلا بنية حوكمة يسرّع الحوادث العلنية — الزخم المبكر على حساب الثقة مكلف.', en: 'Visibility without governance accelerates public incidents — early momentum at the expense of trust is costly.' },
      },
      {
        text: { ar: 'أوزع الميزانية بالتساوي — العدل أولًا.', en: 'Split the budget equally — fairness first.' },
        score: 1,
        rationale: { ar: 'التقسيم المتساوي ينتج ثلاث مبادرات ناقصة التمويل كلها تفشل بهدوء.', en: 'Equal splitting produces three underfunded initiatives, all failing quietly.' },
      },
      {
        text: { ar: 'الحوكمة أولًا ثم التنبؤية ثم الحواري — لأن البنية تسبق الظهور.', en: 'Governance first, then analytics, then the chatbot — structure precedes visibility.' },
        score: 2,
        rationale: { ar: 'تسلسل صحيح مبدئيًا — لكنه يفتقد معايير نجاح وتوقف معلنة.', en: 'A sound ordering in principle — but it lacks declared success and stop criteria.' },
      },
      {
        text: { ar: 'أعتمد الحوكمة أساسًا، وأرخص تجربة تنبؤية بمعيار أثر واضح، وأؤجل الحواري حتى يثبت التحقق من المخرجات مؤسسيًا — بقرار موثق بشروط التوسع والتوقف.', en: 'Adopt governance as the foundation, run a lean analytics pilot with a clear impact criterion, and defer the chatbot until output-verification is institutionally proven — in a documented decision with scale and stop conditions.' },
        score: 3,
        rationale: { ar: 'ترتيب + شروط نجاح وتوقف معلنة + قرار قابل للمراجعة — القرار التنفيذي الكامل.', en: 'Ordering + declared success/stop conditions + a reviewable decision — the complete executive move.' },
      },
    ],
  },
  {
    id: 'sc-executive-cyber', trackId: 'executive', domainId: 'cyber',
    situation: {
      ar: 'بعد حادثة سيبرانية في جهة مماثلة، يطلب مجلسك «تأكيدًا بأننا محميون» في اجتماع الأسبوع القادم.',
      en: 'After a cyber incident at a peer entity, your board asks for “assurance that we are protected” at next week’s meeting.',
    },
    question: { ar: 'ما الذي تقدمه؟', en: 'What do you present?' },
    options: [
      {
        text: { ar: 'تأكيد عام مطمئن — المجلس يحتاج الهدوء.', en: 'A general reassuring statement — the board needs calm.' },
        score: 0,
        rationale: { ar: 'الطمأنة بلا دليل تصنع ثقة زائفة — وتسقط عند أول حادثة.', en: 'Evidence-free reassurance manufactures false confidence — and collapses at the first incident.' },
      },
      {
        text: { ar: 'تقرير تقني كامل بكل الثغرات المعروفة.', en: 'A full technical report with every known vulnerability.' },
        score: 1,
        rationale: { ar: 'التفصيل الخام بلا ترجمة للمخاطر يُقرأ كفشل لا كشفافية.', en: 'Raw detail without risk translation reads as failure, not transparency.' },
      },
      {
        text: { ar: 'عرض وضع المخاطر الحالية بمقاييس (تغطية الضوابط، زمن الاستجابة، التمارين) مقارنة بالأقران.', en: 'A current-risk posture with metrics (control coverage, response time, exercises) benchmarked against peers.' },
        score: 2,
        rationale: { ar: 'صورة صادقة قابلة للقياس — المستوى الصحيح للمجلس.', en: 'An honest measurable picture — the right level for a board.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأضيف خطة رفع المستوى الممولة بمراحل وتاريخ المراجعة القادم — وأسمي المخاطر التي لا نستطيع إغلاقها بعد.', en: 'Do that, and add a funded, phased uplift plan with the next review date — and name the risks we cannot yet close.' },
        score: 3,
        rationale: { ar: 'وضع + خطة ممولة + تسمية الفجوات بصراحة — ثقة تُبنى على الحقيقة.', en: 'Posture + funded plan + honestly named gaps — trust built on truth.' },
      },
    ],
  },
  {
    id: 'sc-executive-cloud', trackId: 'executive', domainId: 'cloud',
    situation: {
      ar: 'مورد سحابي مهيمن يقدم خصمًا كبيرًا متعدد السنوات مقابل التزام حصري لعبارات عمل جهتك الحرجة.',
      en: 'A dominant cloud vendor offers a large multi-year discount in exchange for an exclusive commitment to your entity’s critical workloads.',
    },
    question: { ar: 'ما اعتبارك التنفيذي؟', en: 'What is your executive consideration?' },
    options: [
      {
        text: { ar: 'أقبل — الخصم وفورات موثقة.', en: 'Accept — the discount is documented savings.' },
        score: 0,
        rationale: { ar: 'الخصم اليوم قد يصبح قفل مورد الغد — كلفة الخروج لا تظهر في عرض السعر.', en: 'Today’s discount may become tomorrow’s lock-in — exit cost never appears in the quote.' },
      },
      {
        text: { ar: 'أرفض كل التزام — المرونة مطلقة.', en: 'Reject all commitment — flexibility is absolute.' },
        score: 1,
        rationale: { ar: 'المرونة المطلقة ترفض وفورات مشروعة يمكن تحصيلها بشروط خروج جيدة.', en: 'Absolute flexibility rejects legitimate savings that good exit terms could secure.' },
      },
      {
        text: { ar: 'أقبل مع بند خروج وأسعار خروج مسبقة وقابلية نقل البيانات.', en: 'Accept with an exit clause, pre-agreed exit pricing, and data portability.' },
        score: 2,
        rationale: { ar: 'صفقة متوازنة تحمي الخيارات المستقبلية.', en: 'A balanced deal that protects future options.' },
      },
      {
        text: { ar: 'أفعل ذلك بعد تقييم مستقل لقفل المورد، مع إبقاء حمل واحد حرج قابلًا للنقل كدليل حي على قابلية الخروج.', en: 'Do that after an independent lock-in assessment, keeping one critical workload portable as living proof of exitability.' },
        score: 3,
        rationale: { ar: 'يوثق القدرة على الخروج عمليًا لا نظريًا — حوكمة مورد بمعايير تنفيذية.', en: 'Proves exitability in practice, not theory — vendor governance at executive standard.' },
      },
    ],
  },
  {
    id: 'sc-executive-service-design', trackId: 'executive', domainId: 'service-design',
    situation: {
      ar: 'جهتك تطلق قناة خدمة رقمية جديدة. الإحصاءات تقول إن 8% من المستفيدين المستهدفين لا يستطيعون استخدامها (عمر، إعاقة، اتصال).',
      en: 'Your entity is launching a new digital service channel. Statistics say 8% of target beneficiaries cannot use it (age, disability, connectivity).',
    },
    question: { ar: 'ما قرارك؟', en: 'What is your decision?' },
    options: [
      {
        text: { ar: 'نطلق — 92% نسبة ممتازة.', en: 'Launch — 92% is an excellent rate.' },
        score: 0,
        rationale: { ar: 'الخدمة الحكومية ملزمة بالجميع — 8% المستبعدون هم غالبًا الأكثر احتياجًا لها.', en: 'A government service is owed to everyone — the excluded 8% are often those who need it most.' },
      },
      {
        text: { ar: 'نؤجل حتى تصل الإتاحة 100%.', en: 'Delay until accessibility reaches 100%.' },
        score: 1,
        rationale: { ar: 'الكمال المؤجل يحرم 92% من خدمة عاملة — التوازن مطلوب.', en: 'Delayed perfection deprives 92% of a working service — balance is required.' },
      },
      {
        text: { ar: 'نطلق مع قناة بديلة مكافئة (هاتف/حضوري) لمن لا يستطيع.', en: 'Launch with an equivalent alternative channel (phone/in-person) for those who cannot.' },
        score: 2,
        rationale: { ar: 'الشمول العملي الصحيح — لا أحد محبوس خارج الخدمة.', en: 'The right practical inclusion — nobody is locked out of the service.' },
      },
      {
        text: { ar: 'نفعل ذلك، ونقيس استخدام القناة البديلة ونراجعه فصليًا حتى تنغلق الفجوة — مع مالك مسؤول معين.', en: 'Do that, and measure alternative-channel usage and review it quarterly until the gap closes — with a named accountable owner.' },
        score: 3,
        rationale: { ar: 'إطلاق + بديل + قياس الإغلاق بملكية — الشمول كالتزام مُدار لا كإعلان.', en: 'Launch + alternative + measured closure under ownership — inclusion as a managed commitment, not an announcement.' },
      },
    ],
  },
  {
    id: 'sc-executive-policy', trackId: 'executive', domainId: 'policy',
    situation: {
      ar: 'وزارتك تُعد موقفًا من تنظيم مقترح للذكاء الاصطناعي. قطاعك يريد نصًا «يدعم الابتكار» والقانونيون يريدون ضوابط صارمة.',
      en: 'Your ministry is preparing a position on a proposed AI regulation. Your sector wants text that “supports innovation” and the lawyers want strict controls.',
    },
    question: { ar: 'كيف تصوغ الموقف؟', en: 'How do you shape the position?' },
    options: [
      {
        text: { ar: 'أدعم قطاعي — الابتكار يمولنا.', en: 'Support my sector — innovation funds us.' },
        score: 0,
        rationale: { ar: 'موقف بلا ضوابط يعرّض المواطنين وسمعة الجهة عند أول حادثة خوارزمية.', en: 'A control-free position exposes citizens and the entity’s reputation at the first algorithmic incident.' },
      },
      {
        text: { ar: 'أدعم القانونيين بالكامل — السلامة صفر مخاطرة.', en: 'Fully back the lawyers — safety means zero risk.' },
        score: 1,
        rationale: { ar: 'صفر مخاطرة يعني صفر تعلم — التنظيم المفرط يدفع الاستخدام للخفاء.', en: 'Zero risk means zero learning — over-regulation drives usage underground.' },
      },
      {
        text: { ar: 'موقف «ضوابط متناسبة مع المخاطر»: تشديد على الاستخدامات عالية الخطورة، وخفة على المنخفضة.', en: 'A “risk-proportionate controls” position: strictness on high-risk uses, lightness on low-risk ones.' },
        score: 2,
        rationale: { ar: 'الموقف المعياري دوليًا (EU/OECD) — متوازن وقابل للدفاع.', en: 'The international standard position (EU/OECD) — balanced and defensible.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأطلب بيئة تجريبية منظمة للجهات مع التزام شفافية خوارزمية وتعلم من التجارب — مع تاريخ مراجعة للتنظيم نفسه.', en: 'Do that, and request a regulated sandbox for entities with algorithmic-transparency commitments and learning from pilots — with a review date for the regulation itself.' },
        score: 3,
        rationale: { ar: 'ضبط متناسب + تعلم مؤسسي + تنظيم قابل للمراجعة — سياسة تنمو مع الأدلة.', en: 'Proportionate control + institutional learning + a reviewable regulation — policy that grows with evidence.' },
      },
    ],
  },
  {
    id: 'sc-executive-agile', trackId: 'executive', domainId: 'agile',
    situation: {
      ar: 'ثلاثة برامج رقمية تجاوزت ميزانياتها؛ التقارير القادمة إليك «خضراء» حتى أسبوع التسليم ثم تتأخر.',
      en: 'Three digital programs have overrun their budgets; reports reach you “green” until delivery week, then slip.',
    },
    question: { ar: 'ما إصلاحك المؤسسي؟', en: 'What is your institutional fix?' },
    options: [
      {
        text: { ar: 'أستبدل مديري البرامج — الفشل فشلهم.', en: 'Replace the program managers — the failure is theirs.' },
        score: 0,
        rationale: { ar: 'يعاقب الرسل ويترك نظام الإبلاغ المكسور الذي أنتجهم.', en: 'Punishes the messengers and leaves the broken reporting system that produced them.' },
      },
      {
        text: { ar: 'أطلب تقارير أسبوعية أكثر تفصيلًا.', en: 'Demand more detailed weekly reports.' },
        score: 1,
        rationale: { ar: 'تفصيل أكثر لنفس التقارير المتفائلة — الكم لا يصلح الصدق.', en: 'More detail in the same optimistic reports — volume does not fix honesty.' },
      },
      {
        text: { ar: 'أعتمد تقارير بمقاييس تقدم قابلة للتحقق (ميزات عاملة في بيئة حية) لا نسب إنجاز تقديرية.', en: 'Adopt reports on verifiable progress metrics (features live in production), not estimated completion percentages.' },
        score: 2,
        rationale: { ar: 'يقطع «الأخضر حتى السقوط» بربط التقرير ببرهان تشغيلي.', en: 'Cuts “green until it falls” by tying reporting to operational proof.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأحمي رسميًا من يبلّغ مبكرًا بالسوء — وأراجع بنفسي أول «أحمر» مبكر بمكافأة الصراحة لا عقابها.', en: 'Do that, and formally protect those who report bad news early — and personally reward the first early “red”, not punish it.' },
        score: 3,
        rationale: { ar: 'المقاييس + حماية الصراحة + سلوك القائد عند أول أحمر — هكذا يتغير نظام الإبلاغ فعلًا.', en: 'Metrics + protected candor + the leader’s behavior at the first red — that is how a reporting system actually changes.' },
      },
    ],
  },
  {
    id: 'sc-executive-emerging', trackId: 'executive', domainId: 'emerging',
    situation: {
      ar: 'مؤتمر تقني عالمي قدم لجهتك ثلاث تقنيات «ثورية». كلها تعد بتحول، وكلها في طور تجريبي.',
      en: 'A global tech conference pitched three “revolutionary” technologies to your entity. All promise transformation; all are at pilot stage.',
    },
    question: { ar: 'ما إطار قرارك؟', en: 'What is your decision frame?' },
    options: [
      {
        text: { ar: 'نختار الأكثر إبهارًا — الريادة تحتاج جرأة.', en: 'Pick the most dazzling — leadership needs boldness.' },
        score: 0,
        rationale: { ar: 'الإبهار ليس معيارًا — الريادة الحقيقية تُقاس بالأثر لا بالإعجاب.', en: 'Dazzle is not a criterion — real leadership is measured by impact, not applause.' },
      },
      {
        text: { ar: 'ننتظر حتى تنضج جميعها.', en: 'Wait until all of them mature.' },
        score: 1,
        rationale: { ar: 'الانتظار الكامل يتخلى عن ميزة التعلم المبكر الرخيص.', en: 'Full waiting forfeits the cheap early-learning advantage.' },
      },
      {
        text: { ar: 'نقيّمها بمصفوفة معلنة (قيمة، جاهزية، مخاطر، كلفة تبني) ونجرب الأعلى درجة فقط.', en: 'Evaluate them with a declared matrix (value, readiness, risk, adoption cost) and pilot only the top scorer.' },
        score: 2,
        rationale: { ar: 'قرار بمعايير معلنة — رصين وقابل للدفاع.', en: 'A decision on declared criteria — disciplined and defensible.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأخصص نسبة صغيرة ثابتة لاستكشاف التقنيات سنويًا بمراجعة قيادية فصلية — فالاستكشاف قدرة دائمة لا حدث مؤتمرات.', en: 'Do that, and allocate a small fixed annual share to technology exploration with quarterly executive review — exploration as a standing capability, not a conference event.' },
        score: 3,
        rationale: { ar: 'يبني عضلة الاستشراف الدائمة بدل قرارات الصدفة المسرحية.', en: 'Builds the permanent foresight muscle instead of theatrical chance decisions.' },
      },
    ],
  },
  {
    id: 'sc-executive-leadership', trackId: 'executive', domainId: 'leadership',
    situation: {
      ar: 'برنامج تحول جهتك حقق مؤشراته الأولى لكن إنجازاته تُنسب إعلاميًا لوزارتك، وفريق التنفيذ يرى جهده محذوفًا من السرد.',
      en: 'Your entity’s transformation program hit its early metrics, but media credit went to your ministry’s leadership, and the delivery team sees its effort written out of the story.',
    },
    question: { ar: 'ما سلوكك القيادي؟', en: 'What is your leadership behavior?' },
    options: [
      {
        text: { ar: 'النصر للقيادة — هذا تقليد.', en: 'Victory belongs to leadership — that’s tradition.' },
        score: 0,
        rationale: { ar: 'سرقة الفضل تعلّم الفريق أن الجهد غير مرئي — ومؤشرات العام القادم ستقول ذلك.', en: 'Credit-taking teaches the team that effort is invisible — next year’s metrics will say so.' },
      },
      {
        text: { ar: 'أشكر الفريق في بريد داخلي.', en: 'Thank the team in an internal email.' },
        score: 1,
        rationale: { ar: 'شكر خاص مقابل فضل علني — عدم توازن يلاحظه الجميع.', en: 'Private thanks against public credit — an imbalance everyone notices.' },
      },
      {
        text: { ar: 'أشرك الفريق بالاسم في الإعلان القادم وفي عرض النتائج للقيادة.', en: 'Include the team by name in the next announcement and in the results briefing to leadership.' },
        score: 2,
        rationale: { ar: 'تصحيح علني للفضل — يعيد بناء الثقة.', en: 'Public correction of credit — rebuilds trust.' },
      },
      {
        text: { ar: 'أفعل ذلك، وأثبّت قاعدة «من صنع يقدّم» في عروض القيادة — فالمسؤول يحمل النتيجة ومنفذها معًا دائمًا.', en: 'Do that, and institutionalize “those who built it present it” in leadership briefings — the executive always carries the outcome and its makers together.' },
        score: 3,
        rationale: { ar: 'قاعدة دائمة تحمي الدافعية أهم أصول التحول.', en: 'A standing rule protects motivation — transformation’s most vital asset.' },
      },
    ],
  },
)

export const scenariosForTrack = (trackId: TrackId): ScenarioItem[] =>
  scenarios.filter((s) => s.trackId === trackId)

export const scenarioFor = (trackId: TrackId, domainId: string): ScenarioItem | undefined =>
  scenarios.find((s) => s.trackId === trackId && s.domainId === domainId)
