import { motion } from 'framer-motion'
import { useApp } from '../store'
import type { L } from '../data/types'

/**
 * Methodology & governance — the page that lets a reviewer defend every number
 * (GovTech review P2). Published, honest, versioned.
 */
export default function Methodology() {
  const { t } = useApp()

  const sections: { title: { ar: string; en: string }; body: { ar: string; en: string } }[] = [
    {
      title: { ar: 'ما الذي يقيسه TRL في هذا الرادار؟', en: 'What does TRL measure on this radar?' },
      body: {
        ar: 'قرار منهجي معلن: درجة TRL هنا تقيس النضج العالمي للتقنية (وفق مقياس ناسا 1–9 وإشارات غارتنر والمنتدى الاقتصادي العالمي وOECD)، لا نضج تبنيها في السعودية. أفق التبني (الآن/قريبًا/بعيد) هو البعد المنفصل الذي يقرّب الحكم من السياق الوطني. عملية التقييم: مراجعة تحريرية مكتبية لكل تقنية مقابل إشارات مسماة، مع تسجيل المسوّغ لكل درجة؛ آخر مراجعة: أكتوبر 2026، وشملت إعادة تقييم ست تقنيات بمقدار ±1 موثقة في مسوّغاتها.',
        en: 'A declared methodological decision: TRL here measures the technology’s global maturity (per the NASA 1–9 scale and signals from Gartner, WEF and OECD), not its adoption maturity in Saudi Arabia. The adoption horizon (now/near/far) is the separate dimension that localizes the judgment. Rating process: an editorial desk review of each technology against named signals, with a written rationale per rating; last review: October 2026, which re-rated six technologies by ±1, documented in their rationales.',
      },
    },
    {
      title: { ar: 'كيف صُنّفت المهن الثلاثون؟', en: 'How were the 30 careers classified?' },
      body: {
        ar: 'تراتبية مصادر معلنة: (1) تقارير دولية محكّمة (WEF مستقبل الوظائف 2025، منظمة العمل الدولية 2025، OECD، McKinsey، صندوق النقد)؛ (2) بيانات وطنية رسمية (الهيئة العامة للإحصاء، البنك الدولي/الموارد البشرية)؛ (3) استطلاعات تجارية موسومة صراحة (Coursera، LinkedIn، TestGorilla)؛ (4) أرقام ذاتية الإبلاغ من مزودين موسومة كذلك (توظيف طويق ~80%). إشارات «يزدهر/يتحوّل/يندثر» أحكام تحريرية مبنية على تقاطع هذه المصادر — ليست قياسًا رسميًا.',
        en: 'A declared source hierarchy: (1) peer-reviewed international reports (WEF FoJ 2025, ILO 2025, OECD, McKinsey, IMF); (2) official national data (GASTAT, World Bank/HRSD); (3) commercial surveys, explicitly tagged (Coursera, LinkedIn, TestGorilla); (4) provider self-reported figures, tagged as such (Tuwaiq’s ~80% placement). The growing/transforming/declining signals are editorial judgments built from the intersection of these sources — not an official measurement.',
      },
    },
    {
      title: { ar: 'منهجية درجات المهارات', en: 'Skills-scoring methodology' },
      body: {
        ar: 'درجة المجال = متوسط عباراته الخمس (0–4). عتبات موحدة للمستوى والمرحلة: أقل من 1.25 وعي/تأسيسي، 1.25–2.24 تطبيق/نامٍ، 2.25–3.24 ممارس/متمكّن، 3.25 فأكثر خبير/رائد. هذه عتبات تحريرية معلنة — لم تُعايَر تجريبيًا بعد (لا عينة معيارية ولا جلسة تحديد معايير). التقييم أداة تأمل ذاتي مهيكلة: تقيس تقدير المستخدم لقدرته لا أداءه الفعلي، ولا يجوز استخدامها في التوظيف أو المفاضلة أو أي قرار عالي المخاطر. أسئلة التحقق تقيس المعرفة التأسيسية فقط وتُقارن بالتقدير الذاتي في الاتجاهين (تضخيمًا وتقليلًا).',
        en: 'Domain score = the mean of its five statements (0–4). One shared threshold set for level and stage: below 1.25 Awareness/Foundation, 1.25–2.24 Working/Developing, 2.25–3.24 Practitioner/Proficient, 3.25+ Expert/Leading. These are declared editorial thresholds — not yet empirically calibrated (no normative sample, no standard-setting session). The assessment is a structured self-reflection tool: it measures the user’s estimate of their ability, not actual performance, and must not be used for hiring, selection or any high-stakes decision. Knowledge checks cover foundational knowledge only and are compared with self-ratings in both directions (over- and under-estimation).',
      },
    },
    {
      title: { ar: 'سياسة الإسناد والأرقام', en: 'Provenance & figures policy' },
      body: {
        ar: 'كل بطاقة مهنة تعرض سطر مصدرها وملاحظة الطلب السعودي. مقياس التعرض للأتمتة نوعي بثلاث درجات — لا نعرض نسبًا مئوية لا مصدر لها. التوقعات الكمية موسومة «متوقعة». لا ننشر رقمًا بلا مصدر مسمى؛ وما لا يمكن إسناده يُحذف أو يُوسم. رموز ISCO-08 في بطاقات المهن تقريبية وموسومة كذلك، ورموز SFIA مدققة مقابل القائمة الرسمية المنشورة لـSFIA 9.',
        en: 'Every career card carries its source line and Saudi-demand note. The automation-exposure meter is a qualitative three-band guide — we show no unsourced percentages. Quantitative projections are tagged “expected”. We publish no figure without a named source; what cannot be sourced is removed or flagged. ISCO-08 codes on career cards are approximate and marked as such, and SFIA codes are audited against the official published SFIA 9 list.',
      },
    },
    {
      title: { ar: 'الحدود المعروفة', en: 'Known limitations' },
      body: {
        ar: 'نقولها صراحة: (1) التغطية 50 مهنة — توسعت في v4 نحو قطاعات رؤية 2030 (سياحة، طيران، تعدين، ألعاب، فضاء…) لكنها ما زالت انتقائية؛ (2) لا بيانات أجور أو شواغر سعودية تفصيلية بعد (قيد العمل من مصادر رسمية)؛ (3) التوقعات أفقها 2030 بينما طالب اليوم يدخل السوق نحو 2030–2032؛ (4) لا تحقق سيكومتري بعد؛ (5) الترجمات العربية لحقول رادار التقنيات تحريرية بمراجعة داخلية؛ (6) المنصة نموذج مفاهيمي مستقل غير تابع لأي جهة رسمية.',
        en: 'Said plainly: (1) coverage is 50 careers — v4 expanded into Vision 2030 sectors (tourism, aviation, mining, gaming, space…) but it remains selective; (2) no detailed Saudi wage or vacancy figures yet (in progress from official sources); (3) projections look at 2030 while today’s student enters the market around 2030–2032; (4) no psychometric validation yet; (5) Arabic translations of tech-radar fields are editorial, internally reviewed; (6) the platform is an independent concept prototype, not affiliated with any official entity.',
      },
    },
    {
      title: { ar: 'إيقاع التحديث', en: 'Update cadence' },
      body: {
        ar: 'التزام معلن: مراجعة نصف سنوية لرادار التقنيات (التقنيات تتحرك)، وربع سنوية للأرقام السعودية المتحركة (بطالة، مشاركة، برامج)، وسنوية لمكتبة الأدوار والمهن — مع سجل تغييرات منشور أدناه.',
        en: 'A declared commitment: semiannual review of the technology radar (technologies move), quarterly review of fast-moving Saudi figures (unemployment, participation, programs), and annual review of the role and career libraries — with the published changelog below.',
      },
    },
    {
      title: { ar: 'مصدر بيانات الجهات الحكومية (v7)', en: 'Government entity data provenance (v7)' },
      body: {
        ar: 'عروض v7 (الأثر، القطاعات، الدليل) مبنية على سجلين رسميين: دليل الجهات والقطاعات (sectors.xlsx) وسجلات الخدمات (services.xlsx). طابقت أسماء الجهات بين السجلين 421/421 (100%). ملاحظة موثقة: يرد في نص المنهجية المرافق للمصدر رقما 7,935 تدريبًا و2,918 استشارة، بينما مجاميع الجداول نفسها بعد إعادة الاحتساب هي 7,915 و2,873 — وقد اعتمدنا أرقام الجداول في كل العروض، مع إظهار هذه الملاحظة في صفحة الأثر نفسها. الشعارات: 485 ملف PNG رسميًا (486 مرساة بملف واحد مكرر بين جهتين)، وتظهر بدائل حرفية عند غياب الشعار.',
        en: 'The v7 views (impact, sectors, directory) are built on two official records: the entity & sector directory (sectors.xlsx) and the service records (services.xlsx). Entity name match across the two records: 421/421 (100%). Documented note: the accompanying methodology prose mentions 7,935 training and 2,918 consulting records, while the recomputed sheet totals are 7,915 and 2,873 — we adopt the sheet totals across all views, and the note is surfaced on the impact page itself. Logos: 485 official PNGs (486 anchored, one file shared by two entities), with monogram fallbacks where a logo is absent.',
      },
    },
    {
      title: { ar: 'جدول ربط الفئات بالمجالات (v8)', en: 'Category-to-domain mapping table (v8)' },
      body: {
        ar: 'مشتقات «المهارات الأكثر طلبًا» في v8 محسوبة — لا مفترضة: كل سجل خدمة استشارية في ورقة «تفصيل الخدمات الاستشارية» يحمل فئته، فتُجمع السجلات لكل جهة ثم لكل قطاع، وتُوزَّع على المجالات الثمانية بأوزان موثقة: 1 الاستراتيجيات الرقمية → سياسات وحوكمة 0.7 + قيادة 0.3؛ 2 تخطيط وتمكين البنية التقنية → سحابة وبنية 0.7 + أمن سيبراني 0.3؛ 3 الابتكار والتقنيات الناشئة → تقنيات ناشئة 0.8 + ذكاء وبيانات 0.2؛ 4 التميز المؤسسي واستمرارية الأعمال → منتجات رشيقة 0.6 + قيادة 0.4؛ 5 الاستثمار والخدمات الرقمية → تصميم خدمات 0.6 + سياسات 0.4؛ 6 البيانات والتكامل → ذكاء وبيانات 0.8 + سحابة 0.2؛ 7 مؤشرات الأداء الرقمي → ذكاء وبيانات 0.6 + منتجات رشيقة 0.4؛ 8 التميز والتنافسية → قيادة 0.6 + سياسات 0.4. تُطبع النسب بعد إعادة تطبيع أعلى ثلاثة مجالات لتجمع 100%. الربط تحريري موثق (هذا الجدول هو مرجعه) وقابل للمراجعة؛ المدخلات كلها سجلات حقيقية. مطابقة أسماء الجهات في ورقتي التفصيل: 372/372 استشارات و322/322 تدريب (100%).',
        en: 'The v8 “most-demanded skills” derivations are computed, not assumed: every consulting record in the “service detail” sheet carries its category; records are aggregated per entity then per sector, and distributed onto the eight domains with documented weights: 1 Digital strategies → policy .7 + leadership .3; 2 Tech-infrastructure planning & enablement → cloud .7 + cyber .3; 3 Innovation & emerging tech → emerging .8 + AI/data .2; 4 Organizational excellence & business continuity → agile .6 + leadership .4; 5 Investment & digital services → service-design .6 + policy .4; 6 Data & integration → AI/data .8 + cloud .2; 7 Digital performance indicators → AI/data .6 + agile .4; 8 Excellence & competitiveness → leadership .6 + policy .4. Percentages are printed after renormalizing the top three domains to sum to 100%. The mapping is editorial but documented (this table is its reference) and reviewable; all inputs are real records. Entity name match in the two detail sheets: 372/372 consulting and 322/322 training (100%).',
      },
    },
  ]

  const changelog: { v: string; date: L; items: L[] }[] = [
    {
      v: 'v1',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'الإطلاق: رادار المهارات (8 مجالات × 40 عبارة)، 3 ملفات أدوار، مسارات 90 يومًا، صفحة المعايير.', en: 'Launch: skills radar (8 domains × 40 statements), 3 role profiles, 90-day pathways, standards page.' },
      ],
    },
    {
      v: 'v2',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'رادار 48 تقنية في 6 مجموعات بمقياس TRL؛ مكتبة 20 دورًا مرجّعة إلى SFIA؛ محرك تعلم (48 موردًا + قوالب خطط + 24 سؤال تحقق)؛ وربط النتائج بالتقنيات.', en: '48-technology radar in 6 TRL clusters; 20-role SFIA-referenced library; learning engine (48 resources + plan templates + 24 knowledge checks); results-to-technology linking.' },
      ],
    },
    {
      v: 'v3',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'إعادة التموضع نحو الأفراد والأسر: 30 مهنة بإشارات مستقبلية وأدلة، اختبار توجيه بخمسة أسئلة، قوائم WEF، مقال المهارات مقابل الشهادة، وهوية بصرية خضراء مستلهمة من المواقع الحكومية السعودية.', en: 'Pivot to individuals and families: 30 careers with future signals and evidence, a 5-question guidance quiz, WEF lists, the skills-vs-degree explainer, and a green visual identity inspired by Saudi government sites.' },
      ],
    },
    {
      v: 'v3.2',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'جولة المراجعة الخبيرة الأولى: مؤشر اتساق حقيقي (تقدير ذاتي × تحقق)، تحوط «متوقعة» للأرقام، حذف الأرقام غير المسندة، معالجة النتيجة الفارغة، إصلاحات خوارزمية التوجيه، إتاحة WCAG، إخلاء مسؤولية بارز، توحيد عتبات المستويات.', en: 'First expert-review round: a real agreement indicator (self-rating × knowledge check), “expected” hedging on figures, removal of unsourced numbers, empty-state handling, quiz-algorithm fixes, WCAG accessibility, a prominent disclaimer, unified level thresholds.' },
        { ar: 'الجولة الثانية: شاشة الدور (طالب/والد/موظف/متغير)، ميول RIASEC باختيارين، ملاحظات القبول والتكلفة، مسارات TVTC الصريحة، تقسيم التعرض (ذكاء توليدي/روبوتي) والأفق الزمني، تدقيق SFIA وتعريب رادار التقنيات كاملًا، إعادة تقييم 6 تقنيات، 4 أدوار جديدة، جسر الموجه البشري، توسيع بنك التحقق إلى 5 أسئلة لكل مجال، وإعادة صياغة العبارات الأربعين بسلوك واحد لكل بند.', en: 'Second round: persona screen (student/parent/employee/changer), RIASEC interests with two picks, admission & cost notes, explicit TVTC tracks, exposure split (GenAI/robotic) and time horizon, SFIA audit and full Arabic tech radar, 6 re-rated technologies, 4 new roles, the human-counselor bridge, knowledge-check bank expanded to 5 per domain, and the 40 statements rewritten to one behavior each.' },
      ],
    },
    {
      v: 'v4',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'إصدار الجاهزية الوطنية: توسعة المهن إلى 50 (سياحة، ترفيه، طيران، رياضة، ألعاب، ثقافة، لوجستيات، تعدين، مياه، زراعة ذكية، بحري، عقار، إعلام، فضاء، تقنية مالية، امتثال، أمن تشغيلي، معلوماتية صحية، رعاية مسنين) مع إسناد ورموز ISCO تقريبية لكل منها.', en: 'National-readiness release: careers expanded to 50 (tourism, events, aviation, sports, gaming, culture, logistics, mining, water, agritech, maritime, real estate, media, space, fintech, compliance, OT security, health informatics, elderly care) — each with provenance and approximate ISCO codes.' },
        { ar: 'طبقة مهارات المستقبل: مسارات طلب 2026←2030 للمجالات الثمانية، و15 مهارة دقيقة ناشئة، و10 مهام متراجعة بقاعدة «المهمة لا المهنة»؛ ودليل التبني المؤسسي للجهات الحكومية (حوكمة، مؤشرات، تكامل مع جدارات والأكاديميات، خصوصية PDPL).', en: 'Future-skills layer: 2026→2030 demand trajectories for the eight domains, 15 emerging micro-skills, and 10 declining tasks under the task-not-job rule; the institutional adoption playbook for government entities (governance, KPIs, Jadarat/academy integration, PDPL privacy).' },
        { ar: 'شارات ثقة على المصادر (رسمي/استطلاع/ذاتي) وزر الخطوة التالية الوحيد بعد النتائج.', en: 'Trust badges on sources (official/survey/self-reported) and the single prominent next step after results.' },
      ],
    },
    {
      v: 'v6',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'إعادة ضبط جوهرية بعد تدقيق خارجي: السؤال المنظم صار تطوير القوى العاملة الحكومية؛ الرئيسية أعيد بناؤها بأربعة مداخل (موظف/مختص/مدير/تنفيذي) ومسار الأفراد أصبح خدمة عامة ثانوية واضحة.', en: 'A fundamental reset after an external audit: the organizing question is now government-workforce development; the home was rebuilt with four entrances (employee/specialist/manager/executive) and the citizen track is a clearly subordinate public service.' },
        { ar: 'إصلاح سبعة عيوب موثقة بالتجربة الحية: خلل حدود المراحل (مع اختبار حدودي منشور في scripts/)، خلط مواضع إجابات التحقق (كان الخيار الثاني صحيحًا في 30/40)، قفل الإجابة بعد إظهارها، مستهدفات خاصة بكل مهنة من الخمسين بدل ملف عام واحد، خطط للفجوات الفعلية فقط مع توحيد «90 يومًا = 13 أسبوعًا»، اتساق حدود استخدام صفحة الجهات، وإصلاح زر قائمة البطاقات على سطح المكتب.', en: 'Seven live-tested defects fixed: the stage-boundary bug (with a published boundary test in scripts/), knowledge-check answer-position shuffling (option 2 was correct in 30/40), answer locking after reveal, per-career target profiles for all 50 careers instead of one generic profile, plans generated only for real gaps with unified “90 days = 13 weeks” framing, entities-page usage-boundary consistency, and the desktop card-list toggle fix.' },
        { ar: 'نموذج المسارات الخمسة (توعوي / أساسي تطبيقي / تخصصي / قيادة الفرق والتحول / تنفيذي واستراتيجي) كمفهوم أولي: يُختار في بداية التقييم ويظهر في النتائج — مستوى الإتقان يبقى محورًا مستقلًا، وتفرع الأسئلة لكل مسار في الإصدار القادم.', en: 'The five-track model (awareness / applied / specialist / team & transformation leadership / executive & strategic) as a first-class concept: chosen at assessment start, shown on results — proficiency stays an independent axis, and per-track scenario branching lands in the next release.' },
        { ar: 'إعادة تأطير مستكشف المهن إلى «كيف تتطور الأدوار والمهام؟» مع تخفيف إضافي للأحكام القاطعة على مستقبل المهن.', en: 'The careers explorer reframed to “How do roles and tasks evolve?”, with further softening of categorical verdicts on career futures.' },
      ],
    },
    {
      v: 'v6-B',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'الجولة الثانية من v6 — النواة التي طلبها التدقيق: أربعون موقف حكم مهني (5 مسارات × 8 مجالات) بدرجات نضج جزئية ومبررات فورية ومقفلة — تقيس «فهم الموقف» كطبقة دليل مستقلة عن التقرير الذاتي. ملاحظة صادقة: المواقف تحريرية ولم تُختبر ميدانيًا بعد مع جهات تجريبية.', en: 'v6 round two — the core the audit demanded: 40 professional-judgment scenarios (5 tracks × 8 domains) with partial-credit maturity scoring and instant locked rationales — measuring “situational judgment” as an evidence layer independent of self-report. Honest note: the scenarios are editorial and not yet field-validated with pilot entities.' },
        { ar: 'النتائج صارت أربع طبقات منفصلة صراحة: تقديري لنفسي، وفهمي للمواقف، وتحققي المعرفي، وأولويتي التطويرية — بقاعدة معلنة («تقدير مرتفع + فهم ضعيف = تضخيم محتمل»)، والجملة الختامية تتبع نموذج التدقيق: المهمة القابلة للتحسين + المهارة الأهم + دليل نقطة البداية + الخطوة الأولى.', en: 'Results are now four explicitly separated layers: self-estimate, situational judgment, knowledge check, and development priority — with a declared rule (“high self-report + weak judgment = possible inflation”), and the closing sentence follows the audit’s model: the improvable task + the key skill + starting-point evidence + the first step.' },
        { ar: 'سجل المهارات: أربعون سجلًا مهاريًا مستقلًا بنسخة وتاريخ مراجعة (تعريف، جمهور، مهمة مثال، أساس دليل، متطلبات سابقة، عبارة تقييم مرتبطة) — ينفذ توصية «كل مهارة سجلًا مستقلًا». وقسم المؤشرات العالمية الجديد يربط المنصة بـ GTMI وOECD DGI وOURdata وEGDI/OSI وITU GCI وIMD بصدق (بما فيه ما لا تقيسه).', en: 'Skill registry: forty independent versioned, review-dated skill records (definition, audience, example task, evidence basis, prerequisites, linked assessment item) — implementing “every skill is its own record”. The new global-indices section honestly links the platform to GTMI, OECD DGI, OURdata, EGDI/OSI, ITU GCI and IMD — including what they do not measure.' },
      ],
    },
    {
      v: 'v7',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: 'ثلاثة عروض جديدة مبنية على بيانات حكومية حقيقية: «أثر تمكين الجهات» (مؤشرات ومخططات SVG: التدريب السنوي 2021–2026 مع توسيم 2026 سنة جزئية، الركائز الاستراتيجية الست، فئات الاستشارات الثمان، أعلى 10 جهات، الانتشار حسب المنطقة)، و«القطاعات الحكومية» (31 بطاقة قطاع مع عرض تفصيلي منبثق لجهات كل قطاع)، و«دليل الجهات» (682 جهة ببحث عربي/إنجليزي وتصفية بالقطاع والنوع والنطاق والمنطقة والشعار والاستفادة، بترقيم 48 بطاقة/صفحة).', en: 'Three new views built on real government data: “Enablement Impact” (KPIs and SVG charts: yearly training 2021–2026 with 2026 flagged as partial, the six strategic pillars, the eight consulting categories, top-10 entities, regional coverage), “Government Sectors” (31 sector cards with an inline per-sector entity detail), and “Entity Directory” (682 entities with Arabic/English search, sector/type/scope/region/logo/served filters, 48-card pagination).' },
        { ar: 'الشعارات: 485 ملف PNG رسميًا يُحمَّل كسولًا (lazy) مع بديل حرف أول الاسم عند غياب الشعار أو فشل تحميله — وتُحل المسارات على base النشر.', en: 'Logos: 485 official PNGs lazy-loaded with a name-monogram fallback when a logo is missing or fails to load — paths resolved against the deploy base.' },
        { ar: 'تكامل: روابط في قائمة «أدوات متخصصة» والتذييل، وبطاقات بارزة في صفحة «للجهات الحكومية»، وشريط أثر بالأرقام الحقيقية في الرئيسية بعد شريط إحصاءات WEF.', en: 'Integration: links in the “Pro tools” menu and the footer, prominent cards on the “For Government Entities” page, and a real-figures impact strip on the home page after the WEF stats strip.' },
      ],
    },
    {
      v: 'v8',
      date: { ar: 'أكتوبر 2026', en: 'October 2026' },
      items: [
        { ar: '«اربط وطوّر» — ربط ذكي بين القطاعات والمهارات: استخرجنا من ورقة «تفصيل الخدمات الاستشارية» مصفوفة جهة×فئة كاملة (372 جهة، 2,873 سجلًا، مطابقة أسماء 100%) ومن ورقة «التدريب حسب السنة» سلاسل سنوية لكل جهة (322 جهة، مجاميع مطابقة للإجمالي الوطني 7,915).', en: '“Link & develop” — intelligent sector↔skills linkage: a full entity×category matrix extracted from the consulting-detail sheet (372 entities, 2,873 records, 100% name match) and per-entity yearly training series from the training-by-year sheet (322 entities, totals matching the national 7,915).' },
        { ar: 'ملف سوق مهاري محسوب لكل قطاع: تُجمّع الفئات الاستشارية الفعلية لجهات القطاع وتُوزَّع على المجالات الثمانية بجدول أوزان موثق في المنهجية، ثم تُعرض أعلى ثلاثة مجالات بنسب مئوية في تفاصيل القطاع مع جملة استدلال وزر «قيّس جاهزيتك لأولويات القطاع».', en: 'A computed skill-demand profile per sector: the sector entities’ actual consulting categories are aggregated and distributed across the eight domains via the documented weight table, then the top three domains are shown as percentages in the sector detail with an insight sentence and a “measure your readiness for sector priorities” CTA.' },
        { ar: 'صفحة تفصيلية لكل جهة (682): الشعار، التصنيف الكامل، سجل الاستفادة مع مخطط التدريب السنوي الخاص بالجهة، أبرز الخدمات الاستشارية حرفيًا، وقسم «ما الذي تحتاجه جهتك؟» المشتق من فئات الجهة نفسها — مع انتقال مباشر من الدليل ومن تفاصيل القطاع، وأعمدة فئات الأثر أصبحت قابلة للنقر وتفتح القطاعات مرتبة حسب الطلب على الفئة.', en: 'A detail page for every entity (682): logo, full classification, utilization record with the entity’s own yearly-training chart, verbatim top consulting services, and a “what does your entity need?” section derived from the entity’s own categories — with direct click-through from the directory and sector detail, and clickable Impact category bars opening sectors ranked by category demand.' },
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="eyebrow">{t({ ar: 'الحوكمة والشفافية', en: 'Governance & transparency' })}</p>
      <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t({ ar: 'المنهجية', en: 'Methodology' })}</h1>
      <p className="mt-3 leading-relaxed text-dga-muted">
        {t({
          ar: 'كيف نبني أحكامنا، ومن أين تأتي الأرقام، وأين تقف حدودنا — منشورة ليستطيع أي مراجع الدفاع عنها أو الطعن فيها.',
          en: 'How we build our judgments, where the numbers come from, and where our limits stand — published so any reviewer can defend or challenge them.',
        })}
      </p>
      <p className="mt-3 rounded-btn border-s-2 border-dga-green bg-dga-green/5 p-4 text-sm leading-relaxed text-dga-ink">
        {t({
          ar: 'منذ الإصدار السادس: السؤال المنظم للمنصة هو «كيف يتغير العمل الحكومي، وما القدرات التي يحتاجها الموظف والقيادي، وكيف نطورها؟» — وأدوات التوجيه المهني للأفراد والطلاب تبقى خدمة عامة ثانوية واضحة التبعية، لا قلب المنتج.',
          en: 'Since v6, the platform’s organizing question is “How is government work changing, what capabilities do employees and leaders need, and how do we develop them?” — the career-guidance tools for individuals and students remain a clearly subordinate public-service track, not the product’s core.',
        })}
      </p>

      <div className="mt-10 space-y-5">
        {sections.map((sec, i) => (
          <motion.section
            key={sec.title.en}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45 }}
            className="glass p-6"
          >
            <h2 className="flex items-center gap-3 text-lg font-bold text-dga-black">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-dga-green/10 font-mono text-sm font-bold text-dga-green-deep">
                {i + 1}
              </span>
              {t(sec.title)}
            </h2>
            <p className="mt-3 text-sm leading-loose text-dga-ink">{t(sec.body)}</p>
          </motion.section>
        ))}
      </div>

      {/* changelog */}
      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-bold text-dga-green-dark">{t({ ar: 'سجل التغييرات', en: 'Changelog' })}</h2>
        <div className="space-y-4">
          {changelog.map((c) => (
            <div key={c.v} className="glass p-5">
              <div className="flex items-center gap-3">
                <span className="chip-ok font-mono font-bold" dir="ltr">{c.v}</span>
                <span className="text-xs text-dga-muted">{t(c.date)}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {c.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-dga-ink">
                    <span className="text-dga-green">▸</span>
                    {t(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
