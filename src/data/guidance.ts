import type { L } from './types'

/**
 * Headline figures for the home page (v9, packet P5b).
 *
 * The citizen lane (the guidance quiz, the growing/declining job lists and the skills-vs-degree
 * article) left the v9 build together with its data file; it is kept on the `v8-handover` tag.
 * Every figure resolves to a registered claim (`claimId`, see src/data/claims) and should be
 * rendered with `<Claim id={claimId} />`. `value` is a language-neutral fallback: the unit
 * («مليون» / "million") sits in the label, so no «170M» form is needed.
 */

// ── Headline stats (WEF Future of Jobs 2025) ────────────────────────────────
export const headlineStats: { value: string; label: L; claimId: string }[] = [
  { value: '170', label: { ar: 'مليون وظيفة جديدة متوقعة عالميًا بحلول 2030', en: 'million new jobs expected globally by 2030' }, claimId: 'future-wef-2025-jobs-created' },
  { value: '92', label: { ar: 'مليون وظيفة متوقع استبدالها في الفترة نفسها', en: 'million jobs expected to be displaced in the same period' }, claimId: 'future-wef-2025-jobs-displaced' },
  { value: '39%', label: { ar: 'من المهارات الحالية للعاملين متوقع أن تتحول أو تتقادم بحلول 2030', en: 'of workers’ existing skill sets are expected to be transformed or become outdated by 2030' }, claimId: 'standards-wef-core-skills' },
  { value: '+78', label: { ar: 'مليون وظيفة صافية متوقعة، فالتوقعات تستحدث أكثر مما تستبدل', en: 'million net new jobs expected, as projections create more than they displace' }, claimId: 'future-wef-2025-net-jobs' },
]

/**
 * @deprecated Kept only because `src/views/Home.tsx` (another packet) still imports it;
 * the v9 home page drops the community roadmap. Delete this export once that rewrite lands.
 */
export interface CommunityFeature {
  id: string
  name: L
  description: L
  rationale: string // evidence text (source language EN translated inline where needed)
  rationaleAr: string
  sources: string[]
}

export const communityFeatures: CommunityFeature[] = [
  {
    id: 'learning_circles',
    name: { ar: 'حلقات التعلم', en: 'Learning Circles' },
    description: {
      ar: 'مجموعات صغيرة (8–15 عضوًا) تدرس المقرر نفسه معًا وفق جدول أسبوعي مشترك — عن بُعد أو في مكتبة أو مجلس — بميسّر متناوب. نسخة سعودية: حلقات لكل مدينة ومسار.',
      en: "Small peer groups (8–15 members) that take the same course together on a shared weekly schedule — online or in a library/majlis — with a rotating facilitator. Saudi-localized: circles per city and per track (e.g., 'Riyadh data circle', 'Jeddah nursing circle').",
    },
    rationale: 'Cohort formats reach ~70–90% completion vs 3–15% for solo self-paced (Harvard/MIT MOOC research; cohort-industry benchmarks); 11–25 member groups show the highest completion (Ruzuku platform data). Peer accountability, not content quality, is the main dropout killer.',
    rationaleAr: 'تصل الدفعات المشتركة إلى 70–90% إتمام مقابل 3–15% للتعلم الذاتي المنفرد (بحث Harvard/MIT للمساقات المفتوحة)؛ والمجموعات من 11–25 متعلمًا تسجل أعلى إتمام (بيانات Ruzuku). المساءلة بين الأقران — لا جودة المحتوى — هي القاتل الأول للانسحاب.',
    sources: ['Harvard/MIT MOOC completion research', 'Ruzuku cohort dataset 2026', 'Coursera GSR 2025'],
  },
  {
    id: 'cohort_course_bridge',
    name: { ar: 'وضع الدفعات للمساقات المجانية', en: 'Cohort Mode for Free Courses' },
    description: {
      ar: 'تغلّف المنصة المحتوى المجاني القائم (Coursera/edX/مساقات طويق المفتوحة) بهيكل دفعة منظم: تاريخ بدء ثابت، ومحطات أسبوعية، وتذكيرات بالمواعيد، وحفل إتمام. التنشيط في الأسبوع الأول طقس مصمم — على كل عضو نشر تسليمة الأسبوع الأول.',
      en: 'The platform wraps existing free content (Coursera/edX/Tuwaiq open courses) in a structured cohort shell: fixed start date, weekly milestones, deadline reminders, and a completion ceremony. First-week activation is a designed ritual — every member must post a week-1 deliverable.',
    },
    rationale: 'First-week activity is the strongest single completion predictor (78.3% vs 17.2%, Ruzuku data, 921k records); scheduled courses complete at ~53% vs ~42% open-access — structure converts free content from 3–6% completion to cohort-level rates.',
    rationaleAr: 'النشاط في الأسبوع الأول هو أقوى مؤشر منفرد على الإتمام (78.3% مقابل 17.2%، بيانات Ruzuku على 921 ألف سجل)؛ والمساقات المجدولة تُتم بنسبة ~53% مقابل ~42% للوصول المفتوح — فالهيكلة تحوّل المحتوى المجاني من 3–6% إتمام إلى معدلات الدفعات.',
    sources: ['Ruzuku cohort dataset 2026', 'Harvard/MIT MOOC research'],
  },
  {
    id: 'public_learning_portfolios',
    name: { ar: 'ملفات التعلم العامة', en: 'Public Learning Portfolios' },
    description: {
      ar: 'يحتفظ كل متعلم بصفحة ملف عامة ثنائية اللغة: شهادات مصغّرة موثقة، ومشاريع، وسلاسل تعلم — قابلة للمشاركة مع أصحاب العمل والأسرة. التقدم مرئي بالتصميم؛ ويمكن للأهل متابعة ملف أبنائهم.',
      en: 'Every learner maintains a public, bilingual portfolio page: verified micro-credentials, projects, and learning streaks — shareable to employers and family. Progress is visible by design; families can follow a child’s portfolio.',
    },
    rationale: '94% of learners believe micro-credentials improve job success (Coursera GSR 2025) and skills-first employers need demonstrable proof — 70% of job posts now require specific skills (LinkedIn data). Public commitment also functions as a completion mechanism (social accountability).',
    rationaleAr: '94% من المتعلمين يعتقدون أن الشهادات المصغّرة تحسّن النجاح الوظيفي (Coursera 2025) وأصحاب العمل المهاريون يحتاجون إثباتًا ملموسًا — 70% من إعلانات الوظائف تتطلب مهارات محددة (بيانات LinkedIn). والالتزام العلني نفسه يعمل كآلية إتمام (مساءلة اجتماعية).',
    sources: ['Coursera GSR 2025', 'LinkedIn Skills on the Rise 2025', 'TestGorilla 2025'],
  },
  {
    id: 'mentor_matching',
    name: { ar: 'الإرشاد المهني', en: 'Mentor Matching' },
    description: {
      ar: 'ممارسون يتطوعون موجّهين؛ والمطابقة حسب المجال والمدينة. يقدم الموجهون جلسات شهرية «يوم في الحياة» ويراجعون ملفات الأعمال. يرتبط بشبكات خريجي الأكاديميات السعودية (طويق، SDA، سدايا).',
      en: "Practitioners volunteer as mentors; matching is by domain and city. Mentors run monthly 'day in the life' sessions and review portfolios. Ties into Saudi academies' alumni networks (Tuwaiq, SDA, SDAIA).",
    },
    rationale: "WEF FoJ 2025 lists teaching & mentoring among rising skills and 77% of employers plan reskilling — mentoring is how tacit, non-course knowledge transfers; Tuwaiq's self-reported ~80% placement rate illustrates the power of structured practitioner pipelines in Saudi Arabia.",
    rationaleAr: 'يصنف تقرير مستقبل الوظائف 2025 التعليم والإرشاد ضمن المهارات الصاعدة و77% من أصحاب العمل يخططون لإعادة التأهيل — فالإرشاد هو كيفية انتقال المعرفة الضمنية التي لا تقدمها المساقات؛ ومعدل التوظيف الذي تفيد به أكاديمية طويق (~80% من خريجيها، بحسب إعلانها) يظهر قوة مسارات الممارسين المنظمة في السعودية.',
    sources: ['WEF FoJ 2025', 'Tuwaiq Academy placement data (SPA 2024)'],
  },
  {
    id: 'teach_to_learn',
    name: { ar: 'شارات تعلَّم بالتعليم', en: 'Teach-to-Learn Badges' },
    description: {
      ar: 'ينال المتعلمون شارات متقدمة عبر الشرح: كتابة مقال مبسّط ثنائي اللغة، أو تيسير جلسة حلقة تعلم، أو تسجيل فيديو شرح مدته 10 دقائق يراجعه الأقران. وتغذي الشروح قاعدة المعرفة العامة للمنصة مع نسبة الفضل.',
      en: "Learners earn advanced badges by explaining: writing a bilingual explainer post, running a learning-circle session, or recording a 10-minute teach-back video reviewed by peers. Explanations feed the platform's public knowledge base with attribution.",
    },
    rationale: "Peer teaching is among the most robust learning mechanisms in education research (learning-by-teaching/protégé effect); WEF 2025 ranks teaching & mentoring skills as increasingly demanded; generating Arabic-first explainers also closes the Arabic content gap that Coursera GSR 2025 implies (Saudi learners' surge in English-medium GenAI courses).",
    rationaleAr: 'التعليم بين الأقران من أرسخ آليات التعلم في بحوث التربية (تأثير التعلم بالتعليم)؛ ويصنف تقرير 2025 مهارات التعليم والإرشاد ضمن الأكثر طلبًا؛ وإنتاج شروح عربية الأصل يسد فجوة المحتوى العربي التي يلمّح إليها تقرير Coursera 2025 (تدفق المتعلمين السعوديين على مساقات الذكاء الاصطناعي الإنجليزية).',
    sources: ['WEF FoJ 2025', 'Coursera GSR 2025', 'learning-by-teaching research'],
  },
]
