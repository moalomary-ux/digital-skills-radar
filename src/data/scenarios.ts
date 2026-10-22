import type { L } from './types'
import type { TrackId } from './tracks'

/**
 * v6 Round B — scenario-based judgment items: one per domain for each of the five
 * role categories (count derived from data; claim `method-scenarios-count`).
 * Each item is a concrete Saudi-government workplace situation with four
 * response options ordered by judgment maturity (partial credit 0/1/2/3),
 * each option carrying a bilingual rationale shown after answering.
 * This measures «فهمي للموقف» (situational judgment) — a distinct evidence
 * layer from self-report and knowledge checks.
 *
 * EDITORIAL NOTE: items are authored editorially and are NOT yet
 * field-validated with pilot entities (declared on the Methodology page).
 *
 * v9 item-bank repair (P5b): every option now stands on its own (no «أفعل ذلك»
 * pointing at another option, since display order is shuffled), distractors carry
 * plausible reasons, and option length no longer reveals the key: the best option
 * is the longest in at most 40% of items (guarded by src/__tests__/content.test.ts).
 * Ids, option count, option order, scores and meanings are unchanged.
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
  // ══════════════ TRACK 1 — عام (General) ══════════════
  {
    id: 'sc-awareness-ai-data', trackId: 'awareness', domainId: 'ai-data',
    situation: {
      ar: 'طلبت من أداة ذكاء اصطناعي معتمدة تلخيص تقرير قطاعي، فأعادت ملخصًا أنيقًا يتضمن رقمًا لا يظهر في التقرير الأصلي.',
      en: 'You asked an approved AI tool to summarize a sector report, and it returned a polished summary containing a figure that does not appear in the original report.',
    },
    question: { ar: 'ما التصرف الأصح؟', en: 'What is the right move?' },
    options: [
      {
        text: { ar: 'أستخدم الملخص كما هو؛ فالأداة معتمدة رسميًا، والرقم على الأرجح من مصدر آخر.', en: 'Use the summary as is: the tool is officially approved, and the figure probably comes from another source.' },
        score: 0,
        rationale: { ar: 'الاعتماد الرسمي لا يلغي الهلوسة؛ الرقم المختلق قد يدخل قرارًا رسميًا.', en: 'Official approval does not cancel hallucination; an invented figure could enter an official decision.' },
      },
      {
        text: { ar: 'أحذف الرقم الذي لم أجده في التقرير، وأعتمد بقية الملخص لأنها تبدو متسقة مع ما أعرفه عن القطاع.', en: 'Delete the figure I could not find in the report and keep the rest, since it looks consistent with what I know about the sector.' },
        score: 1,
        rationale: { ar: 'حذف ما لاحظته فقط يفترض أن بقية النص سليمة — وهذا غير مضمون دون مراجعة.', en: 'Removing only what you noticed assumes the rest is sound — not guaranteed without review.' },
      },
      {
        text: { ar: 'أقارن الملخص كاملًا بالتقرير الأصلي قبل أي استخدام.', en: 'Compare the whole summary with the original report before using it.' },
        score: 2,
        rationale: { ar: 'صحيح وضروري — لكنه يعالج هذه الحالة فقط دون قاعدة دائمة.', en: 'Correct and necessary — but it handles this case only, with no standing rule.' },
      },
      {
        text: { ar: 'أطابق الملخص كله مع المصدر، وأسجل الحادثة، وأقترح أن يكون لكل مخرج آلي مراجع مسؤول.', en: 'Check the whole summary against the source, log the incident, and propose a named reviewer for every AI output.' },
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
        text: { ar: 'أضغط الرابط وأحدّث الحساب فورًا حتى لا يتعطل دخولي قبل الاجتماع.', en: 'Click the link and update the account now so my access works before the meeting.' },
        score: 0,
        rationale: { ar: 'الاستعجال أداة المهاجم الأولى؛ والنقر على الرابط تحت الضغط هو بالضبط ما صُمم له التصيد.', en: 'Urgency is the attacker’s primary tool; clicking under pressure is exactly what phishing is designed for.' },
      },
      {
        text: { ar: 'أتجاهل الرسالة وأحذفها؛ إن كانت حقيقية فستعيد تقنية المعلومات إرسالها.', en: 'Ignore and delete the message; if it is genuine, IT will send it again.' },
        score: 1,
        rationale: { ar: 'أفضل من النقر، لكن الصمت يترك زملاءك مكشوفين للرسالة نفسها.', en: 'Better than clicking, but silence leaves colleagues exposed to the same message.' },
      },
      {
        text: { ar: 'أتحقق من الطلب عبر قناة رسمية: البوابة الداخلية أو الاتصال بتقنية المعلومات على رقم موثوق.', en: 'Check the request through an official channel: the internal portal or a call to IT on a trusted number.' },
        score: 2,
        rationale: { ar: 'التحقق المستقل صحيح — وينقصه الإبلاغ لحماية الآخرين.', en: 'Independent verification is right — it just lacks reporting to protect others.' },
      },
      {
        text: { ar: 'أتحقق عبر قناة رسمية، وأبلّغ عن الرسالة بوصفها تصيدًا مشتبهًا به.', en: 'Verify through an official channel and report the message as suspected phishing.' },
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
        text: { ar: 'أوافق هذه المرة فقط؛ فالملف مطلوب اليوم، والحساب الشخصي محمي بكلمة مرور قوية، وسنحذف الملف فور انتهاء العمل.', en: 'Agree just this once: the file is needed today, the personal account has a strong password, and we will delete the file as soon as the work is done.' },
        score: 0,
        rationale: { ar: 'النية الحسنة لا تبيح إقامة بيانات المواطنين خارج البنية المعتمدة.', en: 'Good intentions do not permit citizen data to reside outside approved infrastructure.' },
      },
      {
        text: { ar: 'أعتذر بلطف عن المشاركة في ذلك، وأترك له أن يقرر ما يفعله بالملف.', en: 'Politely decline to take part and leave it to him to decide what to do with the file.' },
        score: 1,
        rationale: { ar: 'الرفض صحيح لكنه يترك الحاجة العملية دون حل.', en: 'Refusal is correct but leaves the practical need unsolved.' },
      },
      {
        text: { ar: 'أرفض، وأقترح انتظار النظام الداخلي أو طلب مساحة عمل معتمدة.', en: 'Refuse, and suggest waiting for the internal system or requesting an approved workspace.' },
        score: 2,
        rationale: { ar: 'يرفض الخطر ويعرض مسارًا مشروعًا — لكنه يترك سبب الفكرة (بطء النظام) دون معالجة.', en: 'Rejects the risk and offers a legitimate path — but leaves the cause (the slow system) untouched.' },
      },
      {
        text: { ar: 'أقترح بديلًا معتمدًا، وأوضح خطر إقامة البيانات، وأبلغ المشرف عن بطء النظام الذي دفع إلى الفكرة.', en: 'Offer an approved alternative, explain the data-residency risk, and tell the supervisor about the slow system behind the idea.' },
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
        text: { ar: 'المشكلة في المستخدمين لا في الخدمة؛ يحتاجون تدريبًا على الأدوات الرقمية، وسيتعلمون مع الوقت كما تعلّم غيرهم.', en: 'The problem is the users, not the service: they need digital-skills training and will learn over time.' },
        score: 0,
        rationale: { ar: 'لوم المستفيد يعكس الفشل: الخدمة مصممة بعيدًا عن قدرات جمهورها.', en: 'Blaming users reverses the failure: the service was designed away from its audience’s abilities.' },
      },
      {
        text: { ar: 'أوجّه كل متصل إلى إتمام المعاملة هاتفيًا، فهذا يحل مشكلته اليوم ويخفف ضغط الاتصالات.', en: 'Route every caller to complete the transaction by phone; it solves their problem today and eases call pressure.' },
        score: 1,
        rationale: { ar: 'يحل الاتصال الفوري ويترك الخدمة المعطلة كما هي.', en: 'Solves the immediate call and leaves the broken service unchanged.' },
      },
      {
        text: { ar: 'أبلغ فريق الخدمة بأن كبار السن يتعثرون في خطوات محددة.', en: 'Tell the service team that older users get stuck at specific steps.' },
        score: 2,
        rationale: { ar: 'ملاحظة مفيدة تصلح الجذر — لكنها تبقى بلاغًا عابرًا.', en: 'A useful observation that fixes the root — but remains a passing note.' },
      },
      {
        text: { ar: 'أوثق الخطوات المتعثرة بعدد الاتصالات، وأقترح مسارًا ميسّرًا أو مراجعة لتصميم الخدمة.', en: 'Document the failing steps with call counts and propose an assisted route or a service-design review.' },
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
        text: { ar: 'هذا شأن الإدارة القانونية وحدها؛ دوري أن أنفذ ما يصلني من تعليمات، وهي من تحدد ما يلزمني.', en: 'This is the legal department’s business alone; my role is to follow the instructions I receive, and they decide what applies to me.' },
        score: 0,
        rationale: { ar: 'كل من يلمس بيانات مستفيدين — حتى في جدول بسيط — داخل نطاق النظام.', en: 'Anyone who touches beneficiary data — even in a simple spreadsheet — is within the law’s scope.' },
      },
      {
        text: { ar: 'يمس فقط من يعملون في أنظمة تقنية المعلومات وقواعد البيانات، لا من يتعامل مع النماذج والجداول اليومية.', en: 'It only affects people working on IT systems and databases, not those handling everyday forms and spreadsheets.' },
        score: 1,
        rationale: { ar: 'النظام يغطي المعالجة اليدوية والورقية أيضًا، لا الأنظمة فقط.', en: 'The law covers manual and paper processing too, not just systems.' },
      },
      {
        text: { ar: 'يمس أي معالجة لبيانات شخصية في عملي، لذلك أراجع إرشادات جهتي وأسأل عند الشك.', en: 'It affects any processing of personal data in my work, so I review my entity’s guidance and ask when unsure.' },
        score: 2,
        rationale: { ar: 'فهم صحيح للنطاق مع خطوة فعلية.', en: 'A correct grasp of scope with a concrete step.' },
      },
      {
        text: { ar: 'يمس كل معالجة لبيانات شخصية في عملي؛ فأتحقق أن لكل ما أجمعه أساسًا نظاميًا.', en: 'It covers all personal-data processing in my work, so I check that everything I collect has a legal basis.' },
        score: 3,
        rationale: { ar: 'ينقل الوعي من المعرفة إلى فحص الممارسة الفعلية — وهو ما يطلبه النظام.', en: 'Moves awareness from knowledge to auditing actual practice — what the law expects.' },
      },
    ],
  },
  {
    id: 'sc-awareness-agile', trackId: 'awareness', domainId: 'agile',
    situation: {
      ar: 'انتقل فريقك إلى دورات عمل أسبوعية، وأول اجتماع استرجاع (Retrospective) على الأبواب ولا تعرف دورك فيه.',
      en: 'Your team moved to weekly work cycles, and the first retrospective is coming up — you don’t know your role in it.',
    },
    question: { ar: 'ما التصرف الأنسب؟', en: 'What is the best move?' },
    options: [
      {
        text: { ar: 'أحضر وأستمع دون مشاركة؛ الاجتماع يخص المديرين وقائد الفريق أساسًا، ودوري تنفيذ ما يتقرر فيه.', en: 'Attend and listen without taking part: the meeting is mainly for managers and the team lead, and my role is to carry out what it decides.' },
        score: 0,
        rationale: { ar: 'الاسترجاع ملك الفريق كله؛ الصمت يهدر قيمته.', en: 'The retrospective belongs to the whole team; silence wastes its value.' },
      },
      {
        text: { ar: 'أطلب إعفائي هذه المرة؛ التسليم أهم.', en: 'Ask to be excused this time; delivery comes first.' },
        score: 1,
        rationale: { ar: 'التسليم بلا تحسين يعيد إنتاج نفس المشكلات كل دورة.', en: 'Delivery without improvement reproduces the same problems every cycle.' },
      },
      {
        text: { ar: 'أحضر وأجيب عن الأسئلة عندما يوجهها إليّ الميسّر، دون أن أبادر بطرح شيء.', en: 'Attend and answer questions when the facilitator puts them to me, without raising anything myself.' },
        score: 2,
        rationale: { ar: 'مشاركة مقبولة لكنها سلبية.', en: 'Acceptable but passive participation.' },
      },
      {
        text: { ar: 'أحضر ومعي ملاحظة محددة: ما الذي أبطأني هذا الأسبوع، وما اقتراحي لعلاجه.', en: 'Attend with one specific note: what slowed me down this week and what I suggest to fix it.' },
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
        text: { ar: 'أؤيده بحماس؛ فالتقنيات الجديدة تقدّم بطبيعتها، وتبنّيها المبكر ريادة.', en: 'Back it enthusiastically: new technology is progress by nature, and early adoption is leadership.' },
        score: 0,
        rationale: { ar: 'الجدة ليست قيمة بذاتها؛ والأرشيف البسيط لا يحتاج سجلًا موزعًا.', en: 'Novelty is not value in itself; a simple archive does not need a distributed ledger.' },
      },
      {
        text: { ar: 'أرفض الفكرة بحذر؛ فالتقنيات الجديدة تحمل مخاطر لا نعرفها، والأرشيف الحالي يكفي.', en: 'Turn it down cautiously: new technology carries unknown risks, and the current archive is enough.' },
        score: 1,
        rationale: { ar: 'الحذر الأعمى يمنع أيضًا التجارب المجدية في مواضعها الصحيحة.', en: 'Blind caution also blocks worthwhile experiments in the right places.' },
      },
      {
        text: { ar: 'أسأل: ما المشكلة التي تحلها سلسلة الكتل ولا تحلها قاعدة البيانات الحالية؟', en: 'Ask: what problem does a blockchain solve that the current database does not?' },
        score: 2,
        rationale: { ar: 'سؤال صحيح يفصل القيمة عن الضجيج.', en: 'The right question — separates value from hype.' },
      },
      {
        text: { ar: 'أسأل عن المشكلة التي تحلها، وأقترح تقييمًا قصيرًا بمعايير معلنة: القيمة والجاهزية والمخاطر والكلفة.', en: 'Ask what problem it solves, and propose a short evaluation with declared criteria: value, readiness, risk and cost.' },
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
        text: { ar: 'المدير محق؛ المعايير أولًا، ومن يقدّم فكرة غير ناضجة يتحمل الرد عليها.', en: 'The manager is right: standards first, and whoever brings an unfinished idea takes the response.' },
        score: 0,
        rationale: { ar: 'الرد الحاد العلني يقتل مشاركة الفريق المستقبلية أكثر مما يحمي المعايير.', en: 'Harsh public rejection kills future participation more than it protects standards.' },
      },
      {
        text: { ar: 'ليس شأني؛ لست طرفًا في الحوار.', en: 'Not my business: I am not part of the exchange.' },
        score: 1,
        rationale: { ar: 'ثقافة الفريق مسؤولية جماعية؛ الصمت يثبت النمط.', en: 'Team culture is a collective responsibility; silence cements the pattern.' },
      },
      {
        text: { ar: 'أتحدث مع الزميل بعد الاجتماع على انفراد وأشجعه على تطوير فكرته.', en: 'Talk to the colleague privately after the meeting and encourage them to develop the idea.' },
        score: 2,
        rationale: { ar: 'لطيف ومفيد — لكنه يعالج الأثر لا السلوك.', en: 'Kind and helpful — but treats the impact, not the behavior.' },
      },
      {
        text: { ar: 'أبرز بأدب ما في الفكرة من قيمة أثناء الاجتماع، ثم أقترح قاعدة للفريق: ننقد الفكرة لا صاحبها.', en: 'Point out politely in the meeting what is valuable in the idea, then propose a team rule: critique the idea, not the person.' },
        score: 3,
        rationale: { ar: 'يحمي الشخص والفكرة ويصلح القاعدة — بناء السلامة النفسية عمليًا.', en: 'Protects the person and the idea and fixes the norm — practical psychological-safety building.' },
      },
    ],
  },
  // ══════════════ TRACK 2 — تطبيقي (Applied) ══════════════
  {
    id: 'sc-applied-ai-data', trackId: 'applied', domainId: 'ai-data',
    situation: {
      ar: 'مديرك يطلب لوحة مؤشرات أسبوعية لمؤشرات الخدمة. لديك ملف إكسل من ثلاث إدارات بصيغ مختلفة وأسماء أعمدة متباينة.',
      en: 'Your manager asks for a weekly dashboard of service indicators. You have an Excel file from three departments with different formats and inconsistent column names.',
    },
    question: { ar: 'ما أول خطوة مهنية صحيحة؟', en: 'What is the first professionally sound step?' },
    options: [
      {
        text: { ar: 'أدمج الملفات كما هي وأبني الرسم اليوم؛ المدير ينتظر، وفروق الصيغ يمكن تصحيحها في الأسابيع التالية.', en: 'Merge the files as they are and build the chart today: the manager is waiting, and format differences can be fixed in the following weeks.' },
        score: 0,
        rationale: { ar: 'السرعة فوق التوحيد تنتج لوحة جميلة وخاطئة.', en: 'Speed over standardization produces a pretty, wrong dashboard.' },
      },
      {
        text: { ar: 'أطلب من كل إدارة إعادة إرسال ملفها بالصيغة الصحيحة، ثم أبني اللوحة حين تصل الملفات.', en: 'Ask each department to resend its file in the right format, then build the dashboard when the files arrive.' },
        score: 1,
        rationale: { ar: 'يرمي عبء التوحيد على الآخرين دون تعريف مشترك — ستعود المشكلة أسبوعيًا.', en: 'Throws the standardization burden back without a shared definition — the problem returns weekly.' },
      },
      {
        text: { ar: 'أوحّد التعريفات وأسماء الحقول في قالب مشترك تتفق عليه الإدارات الثلاث، ثم أدمج الملفات.', en: 'Standardize the definitions and field names in a shared template the three departments agree on, then merge.' },
        score: 2,
        rationale: { ar: 'صحيح تقنيًا ويكفي للمهمة الحالية.', en: 'Technically correct and sufficient for the current task.' },
      },
      {
        text: { ar: 'أوحّد التعريفات في قالب مشترك وأوثقها، ليصبح القالب المرجع الأسبوعي الدائم.', en: 'Standardize and document the definitions in a shared template that becomes the weekly reference.' },
        score: 3,
        rationale: { ar: 'يحول مهمة متكررة إلى أصل معياري — الإلمام بالبيانات في الممارسة.', en: 'Turns a recurring task into a standard asset — practical data literacy.' },
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
        text: { ar: 'أرسله من بريدي الشخصي؛ البريد الرسمي يرفض المرفقات الكبيرة.', en: 'Send it from my personal email: the official one rejects large attachments.' },
        score: 0,
        rationale: { ar: 'خرق مباشر لحماية البيانات الشخصية بغض النظر عن الاستعجال.', en: 'A direct personal-data protection breach regardless of urgency.' },
      },
      {
        text: { ar: 'أنتظر عودة المدير دون أن أخبر أحدًا، فالقرار قراره، وأي تأخير لاحق مسؤولية المقاول.', en: 'Wait for the manager without telling anyone: it is his call, and delays are the contractor’s problem.' },
        score: 1,
        rationale: { ar: 'آمن لكنه يخفي التعطل عن من يستطيع إنهاءه نظاميًا.', en: 'Safe, but hides the blockage from those who can resolve it properly.' },
      },
      {
        text: { ar: 'أستخدم قناة المشاركة المعتمدة، بعد التحقق من وجود اتفاقية معالجة بيانات سارية مع المقاول.', en: 'Use the approved sharing channel after checking that a valid data-processing agreement with the contractor exists.' },
        score: 2,
        rationale: { ar: 'القناة المعتمدة + سند تعاقدي — صحيح نظاميًا.', en: 'Approved channel + contractual basis — legally sound.' },
      },
      {
        text: { ar: 'أتحقق من الاتفاقية، وأرسل عبر القناة المعتمدة الحقول اللازمة فقط، وأوثق المشاركة.', en: 'Check the agreement, send only the fields the task needs through the approved channel, and log the sharing.' },
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
        text: { ar: 'أنتظر حتى يتفق المزود والمطوّر على سبب العطل؛ التدخل قبل ذلك قد يربك الطرفين ويطيل الحل.', en: 'Wait until the provider and the developer agree on the cause; stepping in before that may confuse both and slow the fix.' },
        score: 0,
        rationale: { ar: 'الخدمة متعطلة والمستخدمون ينتظرون — الانتظار تنازل عن المسؤولية.', en: 'The service is down and users are waiting — waiting abdicates responsibility.' },
      },
      {
        text: { ar: 'أعيد نشر التطبيق بنفسي فورًا بأي طريقة متاحة، فالمستخدمون ينتظرون ولا يهمهم من المخطئ.', en: 'Redeploy the app myself right away by any means available: users are waiting and do not care who is at fault.' },
        score: 1,
        rationale: { ar: 'قد يصلح أو يكسر أكثر — بلا تشخيص ولا صلاحية واضحة.', en: 'May fix or break further — no diagnosis, no clear authority.' },
      },
      {
        text: { ar: 'أجمع الطرفين في مكالمة واحدة بسجل أحداث (وقت العطل، آخر تغيير، رسائل الخطأ) وأطلب نقطة قرار واضحة.', en: 'Bring both parties onto one call with an event log (outage time, last change, error messages) and ask for a clear decision point.' },
        score: 2,
        rationale: { ar: 'تصعيد منظم بدليل — التصرف التشغيلي الصحيح.', en: 'Organized escalation with evidence — the correct operational move.' },
      },
      {
        text: { ar: 'أدير المكالمة بالسجل حتى الاستعادة، ثم أوثق زمن العطل مقابل اتفاقية الخدمة وأطلب تحليل السبب.', en: 'Run the call on the log until service is back, then record the downtime against the SLA and ask for a root-cause review.' },
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
        text: { ar: 'أتركه كما هو؛ المصطلحات دقيقة تقنيًا، والجمهور سيعتاد عليها مع تكرار استخدام الخدمة.', en: 'Leave it as is: the terms are technically precise, and the audience will get used to them as they keep using the service.' },
        score: 0,
        rationale: { ar: 'الخدمة الحكومية يجب أن تفهم من أول قراءة — التعود ليس هدفًا.', en: 'A government service must be understood on first read — adaptation is not the goal.' },
      },
      {
        text: { ar: 'أعيد كتابة النص كله بأسلوبي دون الرجوع إلى كاتبه، لأن إصلاح كل مصطلح على حدة يأخذ وقتًا أطول بكثير.', en: 'Rewrite the whole text in my own style without going back to its author, since fixing the terms one by one would take much longer.' },
        score: 1,
        rationale: { ar: 'يستبدل صوتًا بصوت دون معيار مستخدم.', en: 'Replaces one voice with another with no user standard.' },
      },
      {
        text: { ar: 'أستبدل المصطلحات بلغة بسيطة، وأختبر النص على قارئ من الجمهور المستهدف.', en: 'Replace the jargon with plain language and test the text on one reader from the target audience.' },
        score: 2,
        rationale: { ar: 'لغة بسيطة + اختبار مستخدم واحد — تصميم محتوى حقيقي.', en: 'Plain language + one-user test — real content design.' },
      },
      {
        text: { ar: 'أبسّط اللغة وأختبرها على قارئ من الجمهور، وأقترح دليل أسلوب مختصرًا يمنع المصطلحات من المصدر.', en: 'Simplify the language, test it on a reader from the audience, and propose a short style guide that stops jargon at the source.' },
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
        text: { ar: 'أساعد في النشر فورًا؛ الزخم الإعلامي مهم، والبيانات منشورة أصلًا بصيغة مشابهة لدى جهة أخرى.', en: 'Help publish right away: media momentum matters, and similar data is already published by another entity.' },
        score: 0,
        rationale: { ar: 'النشر بلا فحص قد يكشف بيانات شخصية أو يخرق التصنيف.', en: 'Publishing without review may expose personal data or breach classification.' },
      },
      {
        text: { ar: 'أقترح تأجيل النشر حتى تصدر موافقة أمنية كاملة من كل الجهات ذات العلاقة، مهما طال ذلك، فالحذر أسلم.', en: 'Suggest postponing publication until full security clearance comes from every related entity, however long it takes, because caution is safer.' },
        score: 1,
        rationale: { ar: 'الحذر المطلق يقتل الانفتاح المشروع — التوازن مطلوب.', en: 'Absolute caution kills legitimate openness — balance is required.' },
      },
      {
        text: { ar: 'أجري فحصًا للخصوصية والجودة والتصنيف قبل النشر.', en: 'Run a privacy, quality and classification check before publishing.' },
        score: 2,
        rationale: { ar: 'الفحص الصحيح في المكان الصحيح.', en: 'The right check in the right place.' },
      },
      {
        text: { ar: 'أفحص المجموعة بقائمة نشر موثقة (أساس نظامي، تقليل، جودة، مالك) تصبح المسار الدائم للنشر.', en: 'Check the dataset with a documented publishing checklist (legal basis, minimization, quality, owner) that becomes the standing route.' },
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
        text: { ar: 'نضيفها فورًا؛ رفض طلب مدير كبير غير وارد، والميزة صغيرة ولن تؤثر كثيرًا في التزام الفريق في هذه الدورة.', en: 'Add it straight away: turning down a senior manager is not an option, and the feature is small enough not to affect the sprint much.' },
        score: 0,
        rationale: { ar: 'الرضوخ الصامت يعلّم الجهة أن الالتزامات لا معنى لها.', en: 'Silent compliance teaches the organization that commitments are meaningless.' },
      },
      {
        text: { ar: 'نرفضها تمامًا حتى نهاية الدورة، فالالتزام لا يُمس، ويمكن للمدير الانتظار مثل غيره.', en: 'Refuse it entirely until the sprint ends: the commitment cannot be touched, and the manager can wait like everyone else.' },
        score: 1,
        rationale: { ar: 'التمسك الحرفي بالإجراء يُفقد ثقة الرعاة؛ المرونة لها ثمن يجب أن يُرى.', en: 'Rigid ritualism loses sponsor trust; flexibility has a cost that must be made visible.' },
      },
      {
        text: { ar: 'نقيّم الأثر ونعرض المقايضة: ما الذي يخرج من الدورة ليدخل هذا الطلب؟', en: 'Assess the impact and offer the trade-off: what leaves the sprint so this can come in?' },
        score: 2,
        rationale: { ar: 'يجعل الكلفة مرئية ويعيد القرار لصاحبه.', en: 'Makes the cost visible and returns the decision to its owner.' },
      },
      {
        text: { ar: 'نعرض المقايضة على مالك المنتج ليقرر، ونوثق الطلب وقراره في قائمة الأعمال، فإن تكرر راجعنا نمط المقاطعات في الاسترجاع.', en: 'Put the trade-off to the product owner to decide, log the request and its decision in the backlog, and review the pattern at the retrospective if it recurs.' },
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
        text: { ar: 'لا أطلب شيئًا إضافيًا؛ العرض كان مقنعًا، والمورد له عملاء آخرون، فالجودة مثبتة عمليًا.', en: 'Nothing more: the demo was convincing and the vendor has other clients, so the quality is proven in practice.' },
        score: 0,
        rationale: { ar: 'العرض الإنجليزي المصقول لا يقول شيئًا عن العربية بلهجاتها.', en: 'A polished English demo says nothing about dialectal Arabic.' },
      },
      {
        text: { ar: 'أسأل عن السعر ومدة التنفيذ فقط، لأن الجودة التقنية مسؤولية المورد وسيضمنها في العقد.', en: 'Ask only about price and timeline; quality is the vendor’s job and the contract covers it.' },
        score: 1,
        rationale: { ar: 'الكلفة بلا جودة عربية مثبتة شراء أعمى.', en: 'Cost without proven Arabic quality is a blind purchase.' },
      },
      {
        text: { ar: 'أطلب اختبارًا على أسئلة مستفيدين حقيقية بالعربية، فصحى وعامية، مع قياس الدقة والتحويل إلى موظف.', en: 'Ask for a test on real beneficiary questions in Arabic, formal and dialect, measuring accuracy and hand-over to staff.' },
        score: 2,
        rationale: { ar: 'اختبار على البيانات الحقيقية هو الدليل الوحيد ذو المعنى.', en: 'Testing on real data is the only meaningful evidence.' },
      },
      {
        text: { ar: 'أشترط اختبارًا عربيًا على أسئلة حقيقية بمقاييس قبول متفق عليها مسبقًا (الدقة، والإنجاز، والتحويل).', en: 'Require an Arabic test on real questions, with acceptance metrics agreed in advance (accuracy, resolution, hand-over to staff).' },
        score: 3,
        rationale: { ar: 'يحول التقييم إلى قرار بمعايير — ويمنع بيع العرض المسرحي.', en: 'Turns evaluation into a criteria-based decision — and prevents the staged demo sale.' },
      },
    ],
  },
  {
    id: 'sc-applied-leadership', trackId: 'applied', domainId: 'leadership',
    situation: {
      ar: 'أُسند إليك عرض نتائج مشروعك على المسؤول التنفيذي غير التقني في جهتك خلال عشر دقائق غدًا.',
      en: 'You must present your project’s results to your entity’s non-technical executive in ten minutes tomorrow.',
    },
    question: { ar: 'كيف تبني العرض؟', en: 'How do you build the presentation?' },
    options: [
      {
        text: { ar: 'أعرض كل ما أنجزناه بالتفصيل وبالترتيب الزمني، فالجهد كبير ويستحق أن يُرى كاملًا أمام المسؤول.', en: 'Present everything we achieved in detail and in time order: the effort was large and deserves to be seen in full.' },
        score: 0,
        rationale: { ar: 'التفصيل الكامل في عشر دقائق يدفن القرار المطلوب.', en: 'Full detail in ten minutes buries the decision being asked for.' },
      },
      {
        text: { ar: 'أرسل التقرير التقني الكامل بدل العرض.', en: 'Send the full technical report instead of presenting.' },
        score: 1,
        rationale: { ar: 'وثيقة كثيفة لن تُقرأ — واللحظة القيادية تضيع.', en: 'A dense document won’t be read — and the leadership moment is lost.' },
      },
      {
        text: { ar: 'أبدأ بالنتيجة وأثرها على الجهة، ثم دليل واحد داعم، ثم طلب محدد أحتاجه منه.', en: 'Open with the result and its impact on the entity, then one piece of supporting evidence, then a specific request.' },
        score: 2,
        rationale: { ar: 'بنية صحيحة للقرار القيادي.', en: 'The right structure for an executive decision.' },
      },
      {
        text: { ar: 'أبني العرض على النتيجة والأثر والطلب، وأجهز ملحقًا للأسئلة التقنية، وأتدرب عليه بصوت مسموع.', en: 'Build it on the result, impact and request, prepare an annex for technical questions, and rehearse aloud.' },
        score: 3,
        rationale: { ar: 'الجاهزية للأسئلة هي ما يميز العرض الواثق — والتدريب الصوتي يكشف الضعف.', en: 'Readiness for questions distinguishes a confident briefing — and vocal rehearsal exposes weakness.' },
      },
    ],
  },
  // ══════════════ TRACK 3 — تخصصي (Specialist) ══════════════
  {
    id: 'sc-specialist-ai-data', trackId: 'specialist', domainId: 'ai-data',
    situation: {
      ar: 'نموذجك التنبؤي للطلب على خدمة يحقق دقة 97% في الاختبار، لكنه يقلل باستمرار تقدير الطلب في منطقة جغرافية واحدة محرومة أصلًا.',
      en: 'Your service-demand prediction model scores 97% on the test set, but it consistently underestimates demand in one geographic region that is already underserved.',
    },
    question: { ar: 'ما الحكم المهني؟', en: 'What is the professional judgment?' },
    options: [
      {
        text: { ar: 'أنشره كما هو؛ دقة 97% ممتازة، ومنطقة واحدة لا تبرر تأخير الفائدة على الجميع.', en: 'Ship it: 97% accuracy is excellent, and one region does not justify delaying the benefit for all.' },
        score: 0,
        rationale: { ar: 'الدقة الكلية تخفي ضررًا موزعًا بظلم — المقياس الجيد على الإجمال قد يكون سيئًا على الفئة.', en: 'Overall accuracy hides unevenly distributed harm — a metric good in aggregate can be bad for a subgroup.' },
      },
      {
        text: { ar: 'أستبعد بيانات تلك المنطقة من التدريب لتتحسن الدقة الكلية، ثم أعالجها لاحقًا في إصدار مستقل.', en: 'Drop that region’s data from training to lift overall accuracy, and handle it later in a separate release.' },
        score: 1,
        rationale: { ar: 'يزيل الإشارة لا المشكلة — والمنطقة تختفي من القرار كليًا.', en: 'Removes the signal, not the problem — and the region disappears from the decision entirely.' },
      },
      {
        text: { ar: 'أفصّل الأداء حسب المنطقة، وأبلغ عنه بوصفه قيدًا قبل النشر.', en: 'Break performance down by region and report it as a limitation before release.' },
        score: 2,
        rationale: { ar: 'شفافية ضرورية — لكن النشر بلا معالجة يشرّع الضرر.', en: 'Necessary transparency — but shipping without mitigation legitimizes the harm.' },
      },
      {
        text: { ar: 'أبحث عن سبب الانحياز (نقص البيانات أو طلب مسجّل أقل من الحاجة الفعلية) وأعالجه، وأضيف مراقبة دورية للعدالة بعد النشر.', en: 'Find the cause of the regional bias (missing data, or recorded demand below real need), correct it, and add regular fairness monitoring after release.' },
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
        text: { ar: 'أقبل التصميم؛ البريد الداخلي محمي، والتحقق سيصبح أسرع.', en: 'Accept the design: internal email is protected and verification will be faster.' },
        score: 0,
        rationale: { ar: 'صور الهوية في البريد تتناثر بلا سيطرة — لا أرشفة ولا حذف ولا تحكم بالوصول.', en: 'ID photos in email scatter beyond control — no retention, no deletion, no access control.' },
      },
      {
        text: { ar: 'أرفض التصميم دون اقتراح بديل؛ الأمن أولًا، وعلى فريق الخدمة أن يجد حلًا آخر بنفسه.', en: 'Reject the design without proposing an alternative: security comes first, and the service team must find another way itself.' },
        score: 1,
        rationale: { ar: 'الرفض الأعمى يدفع الفرق للالتفاف حول الأمن بدل العمل معه.', en: 'Blind rejection pushes teams to route around security instead of working with it.' },
      },
      {
        text: { ar: 'أقترح التحقق عبر منصة النفاذ الوطني الموحد (نفاذ) بدل جمع الصور.', en: 'Propose verification through the national single sign-on (Nafath) instead of collecting photos.' },
        score: 2,
        rationale: { ar: 'يحل الحاجة دون إنشاء مخزن بيانات حساسة — الحل المعياري.', en: 'Solves the need without creating a sensitive-data store — the standard answer.' },
      },
      {
        text: { ar: 'أعتمد التحقق عبر نفاذ، وأوثق المبدأ لمراجعات التصميم: لا نجمع ما يمكن التحقق منه دون جمعه.', en: 'Use Nafath for verification and record the principle for design reviews: never collect what can be verified without collecting it.' },
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
        text: { ar: 'أوافق؛ المورد يعرف النظام، والعرض أرخص وأسرع.', en: 'Agree: the vendor knows the system and the offer is cheaper and faster.' },
        score: 0,
        rationale: { ar: 'نقل المشكلة لا يحلها — الأعطال ستنتقل مع الكود.', en: 'Moving the problem doesn’t solve it — the failures migrate with the code.' },
      },
      {
        text: { ar: 'أرفض الانتقال إلى السحابة كليًا؛ النظام يعمل في معظم الوقت، والتغيير يفتح مخاطر لا داعي لها.', en: 'Reject moving to the cloud altogether: the system works most of the time, and change opens needless risks.' },
        score: 1,
        rationale: { ar: 'رفض بلا بديل يترك المستخدمين مع أعطال متكررة.', en: 'Rejection without an alternative leaves users with recurring outages.' },
      },
      {
        text: { ar: 'أطلب تحليل أسباب الأعطال أولًا، ثم أوازن بين الخيارات (إعادة استضافة، أو إعادة بناء، أو استبدال).', en: 'Ask for a root-cause analysis of the outages first, then weigh the options against each other (rehost, rebuild or replace).' },
        score: 2,
        rationale: { ar: 'التشخيص قبل القرار — المنهج الصحيح.', en: 'Diagnosis before decision — the correct method.' },
      },
      {
        text: { ar: 'أبني القرار على تحليل الأعطال، وأضيف إليه كلفة الخروج من المورد مستقبلًا وخطة لاختبار القبول.', en: 'Base the decision on the outage analysis, adding the future cost of leaving the vendor and an acceptance-test plan.' },
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
        text: { ar: 'خمسة مستخدمين عينة صغيرة جدًا للحكم؛ أتجاهل النتيجة حتى نختبر عددًا أكبر بعد الإطلاق.', en: 'Five users is far too small a sample to judge; I set the result aside until we test with more people after launch.' },
        score: 0,
        rationale: { ar: 'في اختبار قابلية الاستخدام 60% تعثرًا إشارة قوية — العينات الصغيرة كافية لكشف الحواجز الكبرى.', en: 'In usability testing a 60% failure rate is a strong signal — small samples suffice to expose major barriers.' },
      },
      {
        text: { ar: 'أضيف تلميحًا نصيًا عند الخطوة الثالثة.', en: 'Add a text hint at step three.' },
        score: 1,
        rationale: { ar: 'يلصق العرقلة بدل إزالتها — المستخدمون لا يقرأون التلميحات عادة.', en: 'Patches the stumble instead of removing it — users rarely read hints.' },
      },
      {
        text: { ar: 'أعيد تصميم الخطوة الثالثة بناءً على ما لاحظناه، وأعيد الاختبار قبل الإطلاق.', en: 'Redesign step three based on what we observed, and retest before launch.' },
        score: 2,
        rationale: { ar: 'استجابة صحيحة وكافية للإشارة.', en: 'A correct, sufficient response to the signal.' },
      },
      {
        text: { ar: 'أعيد تصميم الخطوة بعد فحص ما قبلها، وأجعل اختبار قابلية الاستخدام شرطًا لكل إصدار.', en: 'Redesign the step after checking what precedes it, and make usability testing a gate for every release.' },
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
        text: { ar: 'منع شامل لاستخدام أدوات الذكاء الاصطناعي التوليدي؛ هذا الأسلم إعلاميًا بعد ما حدث في الجهة الأخرى.', en: 'A blanket ban on generative-AI tools: the safest position for public perception after what happened at the other entity.' },
        score: 0,
        rationale: { ar: 'المنع يدفع الاستخدام للخفاء بلا ضوابط — أسوأ الحالتين.', en: 'A ban drives usage underground with no guardrails — the worst of both worlds.' },
      },
      {
        text: { ar: 'نصيحة عامة تدعو الموظفين إلى الحذر وحسن التقدير، دون قواعد تفصيلية قد تقيد الاستخدام.', en: 'General advice asking staff to be careful and use good judgment, without detailed rules that might restrict use.' },
        score: 1,
        rationale: { ar: 'إرشاد غير قابل للتنفيذ — لا يغير سلوكًا ولا يحمي عند الحادثة.', en: 'Non-actionable guidance — changes no behavior and protects no one in an incident.' },
      },
      {
        text: { ar: 'قواعد واضحة: المسموح، والممنوع (البيانات الشخصية والسرية)، وواجب المراجعة البشرية، وقائمة الأدوات المعتمدة.', en: 'Clear rules: what is allowed, what is forbidden (personal and classified data), mandatory human review, and an approved-tool list.' },
        score: 2,
        rationale: { ar: 'دليل قابل للتنفيذ فعلًا.', en: 'A genuinely enforceable guide.' },
      },
      {
        text: { ar: 'قواعد واضحة مع مسار للإبلاغ عن الحوادث، ومراجعة دورية للدليل بأمثلة من عمل الجهة نفسها.', en: 'Clear rules plus an incident-reporting path, and regular review of the guide with examples from the entity’s own work.' },
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
        text: { ar: 'نحتفل بالإنجاز؛ التزمنا بالخطة ثلاث دورات، والاستخدام سيرتفع مع الوقت.', en: 'Celebrate: we kept to the plan for three sprints, and usage will rise with time.' },
        score: 0,
        rationale: { ar: 'التسليم مخرجات؛ الاستخدام هو النتيجة — الخلط بينهما أخطر وهم في الإدارة بالنهج المرن.', en: 'Delivery is output; usage is outcome — conflating them is agile’s most dangerous illusion.' },
      },
      {
        text: { ar: 'الأرجح أن المؤشر لا يقيس الاستخدام بدقة؛ أراجع أداة القياس والتتبع قبل أي استنتاج.', en: 'The metric is probably not measuring usage well; I check the tracking setup before concluding anything.' },
        score: 1,
        rationale: { ar: 'افتراض ملائم يستحق الفحص، لكنه ليس الاستنتاج الافتراضي.', en: 'A convenient assumption worth checking, but not the default conclusion.' },
      },
      {
        text: { ar: 'أوقف إضافة الميزات، وأتحقق من سبب عدم الاستخدام قبل الدورة القادمة.', en: 'Stop adding features and find out why the feature is not used before the next sprint.' },
        score: 2,
        rationale: { ar: 'قرار شجاع وصحيح: لا تبنِ فوق فرضية مكسورة.', en: 'A brave, correct decision: don’t build on a broken assumption.' },
      },
      {
        text: { ar: 'أتحقق من سبب عدم الاستخدام ببحث سريع مع المستخدمين، وأعيد تعريف نجاح الدورة بالنتيجة لا بعدد المهام.', en: 'Find out why it is not used through quick user research, and redefine sprint success by outcome, not task count.' },
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
        text: { ar: 'العرض مبهر وواضح؛ أوصي بالشراء، فالبيانات الحية يمكن ربطها لاحقًا بعد التعاقد.', en: 'The demo is impressive and clear; I recommend buying, since live data can be connected later after contracting.' },
        score: 0,
        rationale: { ar: 'نموذج ثلاثي الأبعاد بلا بيانات حية ليس توأمًا — هو منظر.', en: 'A 3D model without live data is not a twin — it is scenery.' },
      },
      {
        text: { ar: 'أرفض فكرة التوائم الرقمية كليًا؛ أغلبها ضجيج تسويقي لا تحتاجه البلدية في عملها اليومي ولا تملك بياناته.', en: 'Reject digital twins altogether: most of it is marketing hype that the municipality neither needs in its daily work nor has the data for.' },
        score: 1,
        rationale: { ar: 'الرفض المطلق يغلق قيمة حقيقية موثقة في المدن الرائدة.', en: 'Absolute rejection closes off documented real value in leading cities.' },
      },
      {
        text: { ar: 'أطلب قائمة مصادر البيانات الحية وتحديثها، وقرارات الصيانة التي سيخدمها التوأم.', en: 'Ask for the list of live data sources and their refresh rates, and the maintenance decisions the twin will serve.' },
        score: 2,
        rationale: { ar: 'الأسئلة الصحيحة تفصل التوأم عن المنظر.', en: 'The right questions separate a twin from a diorama.' },
      },
      {
        text: { ar: 'أطلب مصادر البيانات الحية والقرارات التي سيخدمها، وأقترح تجربة على أصل واحد بمعيار نجاح قابل للقياس.', en: 'Ask for the live data sources and the decisions it will serve, and propose a pilot on one asset with a measurable success test.' },
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
        text: { ar: 'نجحنا تقنيًا وسلّمنا النظام كما طُلب؛ التبني مسؤولية الإدارات المستخدمة لا فريق المشروع.', en: 'We succeeded technically and delivered the system as requested; adoption is the user departments’ responsibility, not the project team’s.' },
        score: 0,
        rationale: { ar: 'القيمة تُقاس بالاستخدام — «نجح تقنيًا» دون تبنٍّ يعني لم تنجح.', en: 'Value is measured by use — “technical success” without adoption means it did not succeed.' },
      },
      {
        text: { ar: 'أطلب تعميمًا يلزم الإدارات باستخدام النظام.', en: 'Ask for a circular that makes departments use the system.' },
        score: 1,
        rationale: { ar: 'الإلزام بلا معالجة أسباب المقاومة ينتج امتثالًا شكليًا.', en: 'Mandates without addressing resistance produce formal compliance, not use.' },
      },
      {
        text: { ar: 'أقابل عددًا من المستخدمين في الإدارات لأفهم لماذا عادوا إلى البدائل القديمة.', en: 'Meet a number of users in the departments to understand why they went back to the old ways.' },
        score: 2,
        rationale: { ar: 'الفهم أولًا — غالبًا توجد فجوة تدريب أو ملاءمة حقيقية.', en: 'Understand first — usually there is a real training or fit gap.' },
      },
      {
        text: { ar: 'أفهم من المستخدمين سبب العودة وأعالجه، ثم أقيس التبني بمؤشر استخدام أسبوعي معلن.', en: 'Learn from users why they went back and fix it, then track adoption with a published weekly usage metric.' },
        score: 3,
        rationale: { ar: 'فهم + معالجة + قياس معلن — إدارة التغيير كما يجب أن تكون.', en: 'Understand + fix + published measurement — change management as it should be.' },
      },
    ],
  },
  // ══════════════ TRACK 4 — قيادة فرق (Team leadership) ══════════════
  {
    id: 'sc-team_lead-ai-data', trackId: 'team_lead', domainId: 'ai-data',
    situation: {
      ar: 'فريقك يستخدم أدوات ذكاء اصطناعي فرديًا بلا قواعد؛ كل شخص يصيغ بطريقته والمخرجات متفاوتة الجودة.',
      en: 'Your team uses AI tools individually with no rules; everyone prompts their own way and output quality varies widely.',
    },
    question: { ar: 'ما تدخلك القيادي؟', en: 'What is your leadership intervention?' },
    options: [
      {
        text: { ar: 'أتركهم يعملون كلٌّ بطريقته؛ الحرية تشجع الإبداع، والفروق في الجودة ستتقلص مع اكتساب الخبرة.', en: 'Let each person work their own way: freedom encourages creativity, and quality will even out with experience.' },
        score: 0,
        rationale: { ar: 'الفوضى غير الموثقة تنتج مخرجات لا يمكن الدفاع عنها ولا تكرارها.', en: 'Undocumented chaos produces outputs that can be neither defended nor repeated.' },
      },
      {
        text: { ar: 'أختار أفضل أمر وجدته بنفسي وأعممه على الجميع، فهذا أسرع من نقاش طويل حول الأساليب.', en: 'Pick the best prompt I have found myself and roll it out to everyone; it is faster than a long debate about methods.' },
        score: 1,
        rationale: { ar: 'معيار فردي مفروض بلا مشاركة — يُتجاوز أول أسبوع.', en: 'A single imposed standard with no participation — bypassed within a week.' },
      },
      {
        text: { ar: 'نبني معًا مكتبة أوامر معتمدة لمهامنا المتكررة، مع قواعد واضحة لمراجعة المخرجات.', en: 'Build together an approved prompt library for our recurring tasks, with clear rules for reviewing outputs.' },
        score: 2,
        rationale: { ar: 'معيار مشترك عملي — قفزة حقيقية في الاتساق.', en: 'A shared practical standard — a real consistency jump.' },
      },
      {
        text: { ar: 'نبني المكتبة في ورشة، مع مراجعة أقران للمخرجات وتحديث شهري من الدروس.', en: 'Build the library in a workshop, with peer review of outputs and monthly updates from lessons learned.' },
        score: 3,
        rationale: { ar: 'معيار مشارك + مراجعة + تحسين دوري — قدرة مؤسسية لا قاعدة.', en: 'Co-created standard + review + periodic improvement — an institutional capability, not a rule.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-cyber', trackId: 'team_lead', domainId: 'cyber',
    situation: {
      ar: 'اكتشفت أن مطوّري فريقك يتشاركون حسابًا إداريًا واحدًا في نظام داخلي «للسرعة».',
      en: 'You discover your team’s developers share one admin account on an internal system “for speed”.',
    },
    question: { ar: 'ما ردك؟', en: 'What is your response?' },
    options: [
      {
        text: { ar: 'أغض الطرف مؤقتًا؛ التسليم أهم الآن، وسنعالج الحسابات بعد الإطلاق.', en: 'Look the other way for now: delivery matters more, and we will sort the accounts out after launch.' },
        score: 0,
        rationale: { ar: 'حساب مشترك يعني لا مساءلة فردية — عند الحادثة لن تعرف من فعل ماذا.', en: 'A shared account means no individual accountability — in an incident you won’t know who did what.' },
      },
      {
        text: { ar: 'أغلق الحساب المشترك فورًا، وأنبّه الفريق علنًا في الاجتماع حتى لا يتكرر الأمر.', en: 'Close the shared account immediately and warn the team publicly in the meeting so it does not happen again.' },
        score: 1,
        rationale: { ar: 'الإغلاق صحيح؛ التوبيخ العلني يدفع الممارسة للاختفاء لا للزوال.', en: 'Closing is right; public reprimand drives the practice into hiding, not extinction.' },
      },
      {
        text: { ar: 'أغلق الحساب، وأصدر حسابات فردية، وأسأل عما جعل المشاركة «أسرع» فأعالجه.', en: 'Close the account, issue individual accounts, and ask what made sharing “faster” so I can fix it.' },
        score: 2,
        rationale: { ar: 'يعالج السلوك وسببه التشغيلي.', en: 'Addresses the behavior and its operational cause.' },
      },
      {
        text: { ar: 'أستبدل الحساب بحسابات فردية، وأضيف مراجعة دورية للصلاحيات، وأبلغ أمن المعلومات طوعًا لتوثيق الدرس دون عقاب.', en: 'Replace it with individual accounts, add regular access reviews, and tell security voluntarily so the lesson is recorded without blame.' },
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
        text: { ar: 'أطلب خفض الميزانية فورًا وإيقاف كل الخوادم التي تبدو زائدة، فالفاتورة لا تحتمل الانتظار.', en: 'Order an immediate budget cut and shut down every server that looks surplus; the bill cannot wait.' },
        score: 0,
        rationale: { ar: 'الإغلاق الأعمى قد يوقف خدمة حية — وخفض الكلفة دون خريطة للموارد مجازفة تشغيلية.', en: 'Blind shutdown may kill a live service — cost-cutting without a map is operational suicide.' },
      },
      {
        text: { ar: 'أتجاهل الأمر؛ أسعار السحابة ترتفع عمومًا، وارتفاع الفاتورة متوقع مع توسع الخدمات واستخدامها بمرور الوقت.', en: 'Ignore it: cloud prices are rising generally, and a higher bill is only to be expected as services and their use grow over time.' },
        score: 1,
        rationale: { ar: 'التضخم غير المفحوص يخفي غالبًا موارد غير مستخدمة وبيئات منسية.', en: 'Unchecked growth usually hides orphaned resources and open leaks.' },
      },
      {
        text: { ar: 'أطلب جردًا موسومًا للموارد (من يملك ماذا ولماذا) ومراجعة أسبوعية للفاتورة.', en: 'Ask for a tagged inventory of resources (who owns what and why) and a weekly bill review.' },
        score: 2,
        rationale: { ar: 'الوسم والمراجعة أساس حوكمة الكلفة السحابية.', en: 'Tagging and review are the foundation of cloud cost governance.' },
      },
      {
        text: { ar: 'أطلب جردًا موسومًا للموارد، وأضع حدود ميزانية بتنبيهات، وأوقف بيئات التطوير ليلًا بصفة دائمة.', en: 'Require a tagged inventory, budget limits with alerts, and nightly shutdown of development environments as policy.' },
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
        text: { ar: 'الإطلاق حقق هدفه، والرضا يتذبذب طبيعيًا من فصل إلى آخر؛ لا داعي لتغيير الخطة بسبب فصلين.', en: 'The launch hit its target and satisfaction naturally swings from quarter to quarter; no need to change plans over two quarters.' },
        score: 0,
        rationale: { ar: 'فصلان متتاليان اتجاه لا تذبذب — تجاهله يكلف ثقة المستفيدين.', en: 'Two consecutive quarters is a trend, not noise — ignoring it costs beneficiary trust.' },
      },
      {
        text: { ar: 'أطلب حملة توعية بالخدمة ومزاياها، فانخفاض الرضا غالبًا سببه أن المستفيدين لا يعرفون كيف يستخدمونها.', en: 'Order an awareness campaign about the service and its benefits; falling satisfaction usually means beneficiaries do not know how to use it.' },
        score: 1,
        rationale: { ar: 'التسويق لا يصلح خدمة متدهورة التجربة.', en: 'Marketing cannot fix a degrading service experience.' },
      },
      {
        text: { ar: 'أقرأ الشكاوى، وأحدد أعلى سببين للهبوط، وأخصص دورة لإصلاحهما.', en: 'Read the complaints, identify the top two causes of the decline, and dedicate a cycle to fixing them.' },
        score: 2,
        rationale: { ar: 'تشخيص مبني على الدليل وإصلاح مركز — صحيح.', en: 'Evidence-based diagnosis and focused fixing — correct.' },
      },
      {
        text: { ar: 'أعالج أعلى سببين في الشكاوى، وأجعل الرضا مؤشرًا دوريًا على لوحة الفريق لكل سبب مالك واضح.', en: 'Fix the top two causes from the complaints, and make satisfaction a regular dashboard metric with an owner per cause.' },
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
        text: { ar: 'ننتظر إرشادات الجهة الرسمية قبل أي خطوة؛ التحرك المبكر قد يضيع جهدًا إن تغيرت التفاصيل.', en: 'Wait for official guidance from the entity before any step: moving early may waste effort if the details change.' },
        score: 0,
        rationale: { ar: 'الانتظار يترك 90 يومًا بلا حركة — والامتثال له أوان.', en: 'Waiting leaves 90 days motionless — and compliance has a deadline.' },
      },
      {
        text: { ar: 'أرسل رابط النظام إلى أعضاء الفريق ليقرأه كلٌّ منهم في وقته، وأذكّرهم به قبل تاريخ السريان.', en: 'Send the regulation link to the team so each member reads it in their own time, with a reminder before it applies.' },
        score: 1,
        rationale: { ar: 'الرابط بلا ترجمة تشغيلية لا يغير ممارسة.', en: 'A link without operational translation changes no practice.' },
      },
      {
        text: { ar: 'أعيّن مالكًا للامتثال في الفريق، ونرسم أثر النظام على أعمالنا الجارية.', en: 'Appoint a compliance owner in the team and map the regulation’s impact on our current work.' },
        score: 2,
        rationale: { ar: 'ملكية + خريطة أثر — البنية الصحيحة.', en: 'Ownership + impact mapping — the right structure.' },
      },
      {
        text: { ar: 'أعيّن مالكًا للامتثال، ونضع نقاط تحقق شهرية، ونكتب دليلًا داخليًا بأمثلتنا قبل تاريخ السريان.', en: 'Appoint a compliance owner, set monthly checkpoints, and write an internal guide with our examples before the effective date.' },
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
        text: { ar: 'الميزات أولًا دائمًا؛ هذا ما يُقاس عليه أداء الفريق، والدين التقني يمكن سداده حين يخف الضغط.', en: 'Features first, always: that is what the team is measured on, and debt can wait until pressure eases.' },
        score: 0,
        rationale: { ar: 'الدين يتراكم بفائدة — حتى يتوقف الفريق تقريبًا.', en: 'Debt compounds with interest — until the team nearly stops.' },
      },
      {
        text: { ar: 'نوقف تطوير الميزات شهرًا لسداد الدين كله.', en: 'Stop feature work for a month to pay off all the debt.' },
        score: 1,
        rationale: { ar: 'التوقف الكامل يكسر ثقة أصحاب المصلحة ويصعب تبريره قياديًا.', en: 'A full stop breaks stakeholder trust and is hard to justify upward.' },
      },
      {
        text: { ar: 'أخصص نسبة ثابتة من كل دورة (20% مثلًا) لسداد الدين التقني ومعالجة الأخطاء.', en: 'Set aside a fixed share of every sprint (20%, say) to pay down technical debt and fix bugs.' },
        score: 2,
        rationale: { ar: 'النسبة الثابتة سياسة سليمة ومستدامة.', en: 'A fixed share is sound, sustainable policy.' },
      },
      {
        text: { ar: 'أخصص نسبة ثابتة للدين في كل دورة، وأعرض للرعاة أثر الدين على سرعة الفريق بشفافية.', en: 'Set aside a fixed share for debt in every sprint, and show sponsors openly how debt affects team speed.' },
        score: 3,
        rationale: { ar: 'يجعل صحة التقنية قرارًا قياديًا مرئيًا بدل استجداء فني خفي.', en: 'Makes technical health a visible leadership decision instead of a hidden technical plea.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-emerging', trackId: 'team_lead', domainId: 'emerging',
    situation: {
      ar: 'القيادة تطلب من فريقك «شيئًا بوكلاء الذكاء الاصطناعي» لعرضه في ملتقى قادم — دون حالة استخدام.',
      en: 'Leadership asks your team for “something with agentic AI” for an upcoming showcase — with no use case.',
    },
    question: { ar: 'ما ردك القيادي؟', en: 'What is your leadership response?' },
    options: [
      {
        text: { ar: 'نبني عرضًا مبهرًا للملتقى؛ فرص الظهور أمام القيادة نادرة.', en: 'Build a striking demo for the showcase: chances to be seen by leadership are rare, and the details can be finished after the event.' },
        score: 0,
        rationale: { ar: 'التقنية بحثًا عن مشكلة تنتج عرضًا مسرحيًا يموت بعد الملتقى.', en: 'Technology in search of a problem produces theater that dies after the showcase.' },
      },
      {
        text: { ar: 'أعتذر عن الطلب؛ لدينا عمل حقيقي متأخر، ولا وقت لعروض لا تخدم المستفيدين مباشرة.', en: 'Decline the request: we have real work running late, and no time for demos that do not serve beneficiaries directly.' },
        score: 1,
        rationale: { ar: 'الرفض الجاف يفوت فرصة توجيه الحماس القيادي نحو قيمة.', en: 'A flat refusal misses the chance to channel executive energy toward value.' },
      },
      {
        text: { ar: 'أقترح تجربة محدودة على إجراء داخلي مزعج فعلًا بمعيار نجاح معلن، وتُعرض نتيجتها أيًا كانت.', en: 'Propose a limited pilot on a genuinely painful internal procedure with a declared success criterion, and present its result whatever it is.' },
        score: 2,
        rationale: { ar: 'يوجه الطلب نحو قيمة قابلة للقياس وصدق في العرض.', en: 'Channels the request toward measurable value and honest presentation.' },
      },
      {
        text: { ar: 'أحوّل الطلب إلى تجربة محدودة، وأثبّت قاعدة: لكل تجربة مشكلة موثقة ومعيار نجاح وشرط توقف.', en: 'Turn the request into a limited pilot, and set the rule: every pilot has a documented problem, a success criterion and a stop condition.' },
        score: 3,
        rationale: { ar: 'يحول حماس اللحظة إلى منهجية استكشاف دائمة — قيادة تحول حقيقية.', en: 'Turns momentary enthusiasm into a standing exploration discipline — real transformation leadership.' },
      },
    ],
  },
  {
    id: 'sc-team_lead-leadership', trackId: 'team_lead', domainId: 'leadership',
    situation: {
      ar: 'دُمجت جهتك مع وحدة أخرى، وفريقا العمل الرقمي فيهما يستخدمان أدوات وطرق عمل مختلفة كليًا، والفتور واضح.',
      en: 'Your entity merged with another unit, and the two digital teams use completely different tools and ways of working — the chill is obvious.',
    },
    question: { ar: 'ما أولويتك كقائد؟', en: 'What is your priority as leader?' },
    options: [
      {
        text: { ar: 'أعتمد أدوات فريقي وطرقه للجميع فورًا؛ الاتساق يحتاج قرارًا حاسمًا، والنقاش الطويل يزيد الانقسام.', en: 'Adopt my team’s tools and methods for everyone right away: consistency needs a firm decision, and long debate deepens the split.' },
        score: 0,
        rationale: { ar: 'الفوز بالأدوات وخسارة الناس — الاستياء سيبطئ كل شيء لاحقًا.', en: 'Winning on tools, losing on people — resentment will slow everything later.' },
      },
      {
        text: { ar: 'أترك الفريقين منفصلين حتى يتآلفا تدريجيًا.', en: 'Keep the two teams apart until they gradually come together.' },
        score: 1,
        rationale: { ar: 'الانفصال المديد يرسخ ثقافتين ويضاعف الدين.', en: 'Prolonged separation cements two cultures and doubles the debt.' },
      },
      {
        text: { ar: 'نرسم طريقة العمل المشتركة في ورشة يشارك فيها أعضاء الفريقين على قدم المساواة.', en: 'Design the shared way of working in a workshop where members of both teams take part equally.' },
        score: 2,
        rationale: { ar: 'المشاركة في بناء القاعدة تصنع الالتزام بها.', en: 'Participation in building the norm creates commitment to it.' },
      },
      {
        text: { ar: 'نصمم طريقة العمل المشتركة معًا، ونجربها في مشروع صغير مشترك يحقق نجاحًا مبكرًا موثقًا.', en: 'Design the shared way of working together, and try it on a small joint project that delivers a documented early win.' },
        score: 3,
        rationale: { ar: 'القاعدة المشتركة + الفوز المبكر المشترك — أسرع طريق لفريق واحد.', en: 'A shared norm + a shared early win — the fastest route to one team.' },
      },
    ],
  },
  // ══════════════ TRACK 5 — تنفيذي (Executive) ══════════════
  {
    id: 'sc-executive-ai-data', trackId: 'executive', domainId: 'ai-data',
    situation: {
      ar: 'ثلاث فرص ذكاء اصطناعي تتنافس على نفس الميزانية: مساعد حواري للمستفيدين (ظهور إعلامي عالٍ)، أو تحليلات تنبؤية للطلب (أثر داخلي هادئ)، أو منصة حوكمة نماذج (بنية أساسية غير مرئية).',
      en: 'Three AI opportunities compete for the same budget: a citizen chatbot (high visibility), demand-prediction analytics (quiet internal impact), or a model-governance platform (invisible infrastructure).',
    },
    question: { ar: 'كيف ترتّبها؟', en: 'How do you order them?' },
    options: [
      {
        text: { ar: 'المساعد الحواري أولًا؛ الظهور يبني الزخم، والبنية تأتي لاحقًا.', en: 'The chatbot first: visibility builds momentum, and the foundation can follow later.' },
        score: 0,
        rationale: { ar: 'الظهور بلا بنية حوكمة يسرّع الحوادث العلنية — الزخم المبكر على حساب الثقة مكلف.', en: 'Visibility without governance accelerates public incidents — early momentum at the expense of trust is costly.' },
      },
      {
        text: { ar: 'أوزع الميزانية بالتساوي على الفرص الثلاث، فهذا أعدل وأقل إثارة للخلاف بين الإدارات.', en: 'Split the budget equally across the three: it is fairer and causes less friction between departments.' },
        score: 1,
        rationale: { ar: 'التقسيم المتساوي ينتج ثلاث مبادرات ناقصة التمويل كلها تفشل بهدوء.', en: 'Equal splitting produces three underfunded initiatives, all failing quietly.' },
      },
      {
        text: { ar: 'الحوكمة أولًا، ثم التحليلات التنبؤية، ثم المساعد الحواري، لأن البنية تسبق الظهور.', en: 'Governance first, then predictive analytics, then the chatbot, because the foundation comes before visibility.' },
        score: 2,
        rationale: { ar: 'تسلسل صحيح مبدئيًا — لكنه يفتقد معايير نجاح وتوقف معلنة.', en: 'A sound ordering in principle — but it lacks declared success and stop criteria.' },
      },
      {
        text: { ar: 'أبدأ بالحوكمة، وأجرّب التحليلات بمعيار أثر، وأؤجل الحواري بقرار موثق بشروط للتوسع والتوقف.', en: 'Start with governance, pilot analytics against an impact measure, and defer the chatbot in a decision with scale and stop rules.' },
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
        text: { ar: 'أقدم تأكيدًا عامًا مطمئنًا؛ المجلس يحتاج الهدوء بعد الحادثة لا التفاصيل.', en: 'Give a general, reassuring statement: after the incident the board needs calm, not detail.' },
        score: 0,
        rationale: { ar: 'الطمأنة بلا دليل تصنع ثقة زائفة — وتسقط عند أول حادثة.', en: 'Evidence-free reassurance manufactures false confidence — and collapses at the first incident.' },
      },
      {
        text: { ar: 'أقدم تقريرًا تقنيًا كاملًا بكل الثغرات المعروفة، فالشفافية الكاملة تحميني.', en: 'Present a full technical report listing every known vulnerability: full transparency protects me from any later blame.' },
        score: 1,
        rationale: { ar: 'التفصيل الخام بلا ترجمة للمخاطر يُقرأ كفشل لا كشفافية.', en: 'Raw detail without risk translation reads as failure, not transparency.' },
      },
      {
        text: { ar: 'أعرض وضع المخاطر الحالي بمقاييس (تغطية الضوابط، زمن الاستجابة، التمارين) مقارنة بجهات مماثلة.', en: 'Present the current risk position with metrics (control coverage, response time, exercises) compared with similar entities.' },
        score: 2,
        rationale: { ar: 'صورة صادقة قابلة للقياس — المستوى الصحيح للمجلس.', en: 'An honest measurable picture — the right level for a board.' },
      },
      {
        text: { ar: 'أعرض المخاطر بمقاييس مع خطة تحسين ممولة على مراحل، وأسمّي المخاطر التي لم نغلقها بعد.', en: 'Show the risks with metrics and a funded, phased improvement plan, and name the risks not yet closed.' },
        score: 3,
        rationale: { ar: 'وضع + خطة ممولة + تسمية الفجوات بصراحة — ثقة تُبنى على الحقيقة.', en: 'Posture + funded plan + honestly named gaps — trust built on truth.' },
      },
    ],
  },
  {
    id: 'sc-executive-cloud', trackId: 'executive', domainId: 'cloud',
    situation: {
      ar: 'مورد سحابي مهيمن يقدم خصمًا كبيرًا متعدد السنوات مقابل التزام حصري لأعباء العمل الحرجة في جهتك.',
      en: 'A dominant cloud vendor offers a large multi-year discount in exchange for an exclusive commitment to your entity’s critical workloads.',
    },
    question: { ar: 'ما اعتبارك التنفيذي؟', en: 'What is your executive consideration?' },
    options: [
      {
        text: { ar: 'أقبل العرض؛ الخصم وفر مالي موثق ومضمون لسنوات، والمورد مستقر في السوق.', en: 'Accept: the discount is documented savings guaranteed for years, and the vendor is stable.' },
        score: 0,
        rationale: { ar: 'الخصم اليوم قد يصبح قفل مورد الغد — كلفة الخروج لا تظهر في عرض السعر.', en: 'Today’s discount may become tomorrow’s lock-in — exit cost never appears in the quote.' },
      },
      {
        text: { ar: 'أرفض أي التزام طويل مع مورد واحد، فالمرونة الكاملة أهم من أي خصم مهما كان حجمه.', en: 'Refuse any long commitment to a single vendor: full flexibility matters more than any discount, however large.' },
        score: 1,
        rationale: { ar: 'المرونة المطلقة ترفض وفورات مشروعة يمكن تحصيلها بشروط خروج جيدة.', en: 'Absolute flexibility rejects legitimate savings that good exit terms could secure.' },
      },
      {
        text: { ar: 'أقبل مع بند خروج وأسعار خروج متفق عليها مسبقًا وقابلية لنقل البيانات.', en: 'Accept with an exit clause, exit prices agreed in advance, and data portability.' },
        score: 2,
        rationale: { ar: 'صفقة متوازنة تحمي الخيارات المستقبلية.', en: 'A balanced deal that protects future options.' },
      },
      {
        text: { ar: 'أقبل بشروط خروج بعد تقييم مستقل لقفل المورد، وأبقي عبء عمل حرجًا واحدًا قابلًا للنقل دليلًا عمليًا.', en: 'Accept with exit terms after an independent lock-in assessment, keeping one critical workload portable as working proof.' },
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
        text: { ar: 'نطلق الخدمة كما هي؛ 92% نسبة ممتازة، والفئة الصغيرة المتبقية ستجد من يساعدها من أسرتها.', en: 'Launch as it is: 92% is an excellent rate, and the small group left over will usually find help from family members.' },
        score: 0,
        rationale: { ar: 'الخدمة الحكومية ملزمة بالجميع — 8% المستبعدون هم غالبًا الأكثر احتياجًا لها.', en: 'A government service is owed to everyone — the excluded 8% are often those who need it most.' },
      },
      {
        text: { ar: 'نؤجل الإطلاق حتى تصل إمكانية الوصول إلى 100%، فلا نطلق خدمة لا يستطيع الجميع استخدامها.', en: 'Postpone launch until accessibility reaches 100%; we do not launch a service that not everyone can use.' },
        score: 1,
        rationale: { ar: 'الكمال المؤجل يحرم 92% من خدمة عاملة — التوازن مطلوب.', en: 'Delayed perfection deprives 92% of a working service — balance is required.' },
      },
      {
        text: { ar: 'نطلق مع قناة بديلة مكافئة (هاتفية أو حضورية) لمن لا يستطيع استخدام القناة الرقمية.', en: 'Launch with an equivalent alternative channel (phone or in person) for those who cannot use the digital one.' },
        score: 2,
        rationale: { ar: 'الشمول العملي الصحيح — لا أحد محبوس خارج الخدمة.', en: 'The right practical inclusion — nobody is locked out of the service.' },
      },
      {
        text: { ar: 'نطلق مع قناة بديلة مكافئة، ونقيس استخدامها فصليًا بمالك مسؤول حتى تنغلق الفجوة.', en: 'Launch with an equivalent alternative channel, track its use quarterly, and name an owner until the gap closes.' },
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
        text: { ar: 'أدعم قطاعي بالكامل؛ الابتكار يمول قطاعنا.', en: 'Back my sector fully: innovation funds us.' },
        score: 0,
        rationale: { ar: 'موقف بلا ضوابط يعرّض المواطنين وسمعة الجهة عند أول حادثة خوارزمية.', en: 'A control-free position exposes citizens and the entity’s reputation at the first algorithmic incident.' },
      },
      {
        text: { ar: 'أدعم القانونيين بالكامل؛ السلامة تعني صفر مخاطرة.', en: 'Back the lawyers fully: safety means zero risk.' },
        score: 1,
        rationale: { ar: 'صفر مخاطرة يعني صفر تعلم — التنظيم المفرط يدفع الاستخدام للخفاء.', en: 'Zero risk means zero learning — over-regulation drives usage underground.' },
      },
      {
        text: { ar: 'موقف «ضوابط متناسبة مع المخاطر»: تشديد على الاستخدامات عالية الخطورة وتخفيف على منخفضة الخطورة.', en: 'A “risk-proportionate controls” position: strict on high-risk uses and light on low-risk ones, case by case.' },
        score: 2,
        rationale: { ar: 'الموقف المعياري دوليًا (EU/OECD) — متوازن وقابل للدفاع.', en: 'The international standard position (EU/OECD) — balanced and defensible.' },
      },
      {
        text: { ar: 'ضوابط متناسبة مع المخاطر، مع بيئة تجريبية منظمة والتزام بالشفافية، وموعد لمراجعة التنظيم نفسه.', en: 'Risk-proportionate controls with a regulated sandbox, transparency duties and a set review of the rules.' },
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
        text: { ar: 'أستبدل مديري البرامج الثلاثة؛ تكرار التأخر يعني أن الخلل فيهم.', en: 'Replace the three programme managers: repeated delays mean the fault is theirs.' },
        score: 0,
        rationale: { ar: 'يعاقب الرسل ويترك نظام الإبلاغ المكسور الذي أنتجهم.', en: 'Punishes the messengers and leaves the broken reporting system that produced them.' },
      },
      {
        text: { ar: 'أطلب تقارير أسبوعية أكثر تفصيلًا من كل برنامج، حتى أرى المشكلات قبل أسبوع التسليم.', en: 'Ask every programme for more detailed weekly reports so I can see problems before delivery week.' },
        score: 1,
        rationale: { ar: 'تفصيل أكثر لنفس التقارير المتفائلة — الكم لا يصلح الصدق.', en: 'More detail in the same optimistic reports — volume does not fix honesty.' },
      },
      {
        text: { ar: 'أعتمد تقارير بمقاييس تقدم قابلة للتحقق (ميزات تعمل فعلًا في بيئة حية) بدل نسب إنجاز تقديرية.', en: 'Adopt reports on verifiable progress (features actually working in a live environment) instead of estimated completion percentages.' },
        score: 2,
        rationale: { ar: 'يقطع «الأخضر حتى السقوط» بربط التقرير ببرهان تشغيلي.', en: 'Cuts “green until it falls” by tying reporting to operational proof.' },
      },
      {
        text: { ar: 'أربط التقارير ببرهان تشغيلي، وأحمي من يبلّغ مبكرًا بالسوء، وأكافئ الصراحة عند أول تقرير «أحمر».', en: 'Tie reports to working evidence, protect those who raise bad news early, and reward candour at the first “red” report.' },
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
        text: { ar: 'نختار الأكثر إبهارًا؛ الريادة تحتاج جرأة.', en: 'Pick the most dazzling one: leadership takes boldness.' },
        score: 0,
        rationale: { ar: 'الإبهار ليس معيارًا — الريادة الحقيقية تُقاس بالأثر لا بالإعجاب.', en: 'Dazzle is not a criterion — real leadership is measured by impact, not applause.' },
      },
      {
        text: { ar: 'ننتظر حتى تنضج التقنيات الثلاث وتثبت نفسها لدى جهات أخرى، ثم نختار بعد اتضاح الصورة.', en: 'Wait until all three mature and prove themselves elsewhere, then choose once the picture is clear.' },
        score: 1,
        rationale: { ar: 'الانتظار الكامل يتخلى عن ميزة التعلم المبكر الرخيص.', en: 'Full waiting forfeits the cheap early-learning advantage.' },
      },
      {
        text: { ar: 'نقيّمها بمصفوفة معلنة (القيمة، والجاهزية، والمخاطر، وكلفة التبني)، ونجرب الأعلى درجة فقط.', en: 'Assess them with a declared matrix (value, readiness, risk and adoption cost) and pilot only the highest scorer.' },
        score: 2,
        rationale: { ar: 'قرار بمعايير معلنة — رصين وقابل للدفاع.', en: 'A decision on declared criteria — disciplined and defensible.' },
      },
      {
        text: { ar: 'نقيّمها بمصفوفة معلنة، ونخصص نسبة صغيرة ثابتة سنويًا للاستكشاف بمراجعة قيادية فصلية.', en: 'Assess them with a declared matrix, and set a small fixed annual share for exploration with quarterly review.' },
        score: 3,
        rationale: { ar: 'يبني عضلة الاستشراف الدائمة بدل قرارات الصدفة المسرحية.', en: 'Builds the permanent foresight muscle instead of theatrical chance decisions.' },
      },
    ],
  },
  {
    id: 'sc-executive-leadership', trackId: 'executive', domainId: 'leadership',
    situation: {
      ar: 'حقق برنامج التحول في جهتك مؤشراته الأولى، لكن الإنجاز يُنسب في التغطية الإعلامية والعروض الداخلية إلى الإدارة العليا وحدها، وفريق التنفيذ يرى جهده غائبًا عن السرد.',
      en: 'Your entity’s transformation programme met its first indicators, but media coverage and internal briefings credit senior management alone, and the delivery team sees its effort missing from the story.',
    },
    question: { ar: 'ما سلوكك القيادي؟', en: 'What is your leadership behavior?' },
    options: [
      {
        text: { ar: 'الإنجاز يُنسب للقيادة عادةً، وهذا عرف مؤسسي مفهوم.', en: 'Credit usually goes to leadership; that is an understood institutional norm.' },
        score: 0,
        rationale: { ar: 'نسب الإنجاز إلى القيادة وحدها يعلّم الفريق أن الجهد غير مرئي — ومؤشرات العام القادم ستقول ذلك.', en: 'Crediting leadership alone teaches the team that effort is invisible — next year’s indicators will show it.' },
      },
      {
        text: { ar: 'أشكر الفريق في رسالة داخلية على جهده، فهذا يكفي لرفع المعنويات دون تغيير ما يُعرض خارجيًا.', en: 'Thank the team in an internal message for its effort; that is enough to lift morale without changing what is shown externally.' },
        score: 1,
        rationale: { ar: 'شكر خاص مقابل فضل علني — عدم توازن يلاحظه الجميع.', en: 'Private thanks against public credit — an imbalance everyone notices.' },
      },
      {
        text: { ar: 'أذكر الفريق بالاسم في الإعلان القادم وفي عرض النتائج على القيادة.', en: 'Name the team in the next announcement and in the results briefing to leadership.' },
        score: 2,
        rationale: { ar: 'تصحيح علني للفضل — يعيد بناء الثقة.', en: 'Public correction of credit — rebuilds trust.' },
      },
      {
        text: { ar: 'أذكر الفريق بالاسم، وأثبّت قاعدة «من صنع يقدّم» في عروض القيادة.', en: 'Name the team, and make “those who built it present it” a rule.' },
        score: 3,
        rationale: { ar: 'قاعدة دائمة تحمي الدافعية أهم أصول التحول.', en: 'A standing rule protects motivation — transformation’s most vital asset.' },
      },
    ],
  },
]

export const scenariosForTrack = (trackId: TrackId): ScenarioItem[] =>
  scenarios.filter((s) => s.trackId === trackId)

export const scenarioFor = (trackId: TrackId, domainId: string): ScenarioItem | undefined =>
  scenarios.find((s) => s.trackId === trackId && s.domainId === domainId)
