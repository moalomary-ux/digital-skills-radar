import type { L } from './types'

/**
 * Role categories («فئة الدور», glossary §5): عام · تطبيقي · تخصصي · قيادة فرق · تنفيذي.
 * Ids are kept from v6 (`awareness`… `executive`) because results and codes store them;
 * only the labels follow the v9 glossary («مسار» and «توعوي» are no longer used).
 * v6-B9: the review's five entry categories as a first-class
 * concept. A track declares what the user should be able to PROVE, not how
 * much they know. Proficiency level stays an independent axis: an executive
 * may need awareness of a technology but advanced judgment in investing in it.
 *
 * Branching groundwork (B11): each track carries example tasks per domain
 * (`examples`), the slot where per-track statement scenarios will land in
 * the next iteration without schema changes.
 *
 * Owner directive (2026-10-22, DECISION §5): job titles differ between entities, so a category
 * addresses a FUNCTION and a GRADE BAND «ومن في حكمهم», never an exact title. `name` stays the
 * glossary's short chip label; `audience`, `gradeBand` and `who` carry the function and grade.
 * Grade bands follow the three bands of the civil-service HR regulation (claim `method-grade-bands`);
 * linking a category to a band is an indicative editorial estimate, and the function decides.
 */

export type TrackId = 'awareness' | 'applied' | 'specialist' | 'team_lead' | 'executive'

export interface Track {
  id: TrackId
  /** short chip label (glossary §5): عام · تطبيقي · تخصصي · قيادة فرق · تنفيذي */
  name: L
  /** the function served, always «ومن في حكمهم» — never an exact job title */
  audience: L
  /** indicative grade band on the general civil-service scale, «أو ما يعادلها» on other scales */
  gradeBand: L
  /** one sentence: function + grade band + «ومن في حكمهم» */
  who: L
  /** what the user must be able to prove — the review's core column */
  proves: L
  /** example tasks per skill domain (samples, not the full matrix) */
  examples: Partial<Record<string, L>>
}

export const tracks: Track[] = [
  {
    id: 'awareness',
    name: { ar: 'عام', en: 'General' },
    audience: { ar: 'كل موظف، وبخاصة موظفو الأعمال المساندة والإدارية ومن في حكمهم', en: 'Every employee, especially support and administrative staff and their equivalents' },
    gradeBand: { ar: 'أي مرتبة، وغالبًا المرتبة العاشرة فما دون أو ما يعادلها', en: 'Any grade; typically grade 10 and below, or the equivalent' },
    who: {
      ar: 'لكل موظف بلا استثناء، وبخاصة موظفو الأعمال المساندة والإدارية ومن في حكمهم ممن ليس العمل الرقمي جوهر وظيفتهم، وغالبًا في المرتبة العاشرة فما دون أو ما يعادلها في السلالم الأخرى.',
      en: 'For every employee without exception, especially support and administrative staff and their equivalents whose job is not digital at its core — typically grade 10 and below, or the equivalent on other scales.',
    },
    proves: { ar: 'يفهم التغيّر والفرصة والمخاطر وحدود الاستخدام.', en: 'Understands the change, the opportunity, the risks and the limits of use.' },
    examples: {
      'ai-data': { ar: 'يشرح متى يمكن الوثوق بمخرجات ذكاء اصطناعي ومتى لا.', en: 'Explains when AI output can be trusted and when it cannot.' },
      cyber: { ar: 'يتعرف على تصيّد ويبلّغ عنه.', en: 'Recognizes and reports phishing.' },
      'service-design': { ar: 'يفهم لماذا تُصمم الخدمات حول المستفيد.', en: 'Understands why services are designed around the beneficiary.' },
    },
  },
  {
    id: 'applied',
    name: { ar: 'تطبيقي', en: 'Applied' },
    audience: { ar: 'الممارسون ومن في حكمهم: موظفون ينجزون مهامًا تشغيلية يومية بأدوات رقمية', en: 'Practitioners and their equivalents: employees doing daily operational work with digital tools' },
    gradeBand: { ar: 'غالبًا المرتبة العاشرة فما دون أو ما يعادلها', en: 'Typically grade 10 and below, or the equivalent' },
    who: {
      ar: 'للممارسين ومن في حكمهم: من يستخدم الأدوات والبيانات الرقمية في معاملات العمل اليومية، أيًّا كان مسماه في جهته، وغالبًا في المرتبة العاشرة فما دون أو ما يعادلها.',
      en: 'For practitioners and their equivalents: anyone who uses digital tools and data in day-to-day work, whatever their title in their entity — typically grade 10 and below, or the equivalent.',
    },
    proves: { ar: 'ينجز مهمة صحيحة وآمنة بكفاءة.', en: 'Completes a task correctly, safely and efficiently.' },
    examples: {
      'ai-data': { ar: 'يستخدم أداة ذكاء اصطناعي معتمدة مع مراجعة المخرجات قبل الإرسال.', en: 'Uses an approved AI tool with output review before sending.' },
      cyber: { ar: 'يطبق قواعد حماية البيانات في معاملة حقيقية.', en: 'Applies data-protection rules in a real transaction.' },
      agile: { ar: 'يكتب قصة مستخدم بمعيار قبول واضح.', en: 'Writes a user story with a clear acceptance criterion.' },
    },
  },
  {
    id: 'specialist',
    name: { ar: 'تخصصي', en: 'Specialist' },
    audience: { ar: 'المختصون والخبراء ومن في حكمهم: من يصمم الحلول الرقمية أو يبنيها أو يشغّلها', en: 'Specialists and experts and their equivalents: those who design, build or operate digital solutions' },
    gradeBand: { ar: 'أي مرتبة حتى الثالثة عشرة أو ما يعادلها في السلالم التخصصية، والعبرة بطبيعة العمل', en: 'Any grade up to 13, or the equivalent on specialist scales; the nature of the work decides' },
    who: {
      ar: 'للمختصين والخبراء ومن في حكمهم: من يصمم الحلول الرقمية أو يبنيها أو يشغّلها، في أي مرتبة حتى الثالثة عشرة أو ما يعادلها في السلالم التخصصية كالهندسية والصحية.',
      en: 'For specialists and experts and their equivalents: those who design, build or operate digital solutions, at any grade up to 13 or the equivalent on specialist scales such as engineering and health.',
    },
    proves: { ar: 'يصمم ويطبق ويحسن حلًا مرتبطًا بدوره.', en: 'Designs, applies and improves a solution tied to their role.' },
    examples: {
      'ai-data': { ar: 'يبني تحليلًا من مجموعة بيانات حقيقية ويتحقق من جودته.', en: 'Builds an analysis from a real dataset and validates its quality.' },
      cloud: { ar: 'يقيّم خيار ترحيل سحابي بمبررات موثقة.', en: 'Evaluates a cloud-migration option with documented rationale.' },
      emerging: { ar: 'يجري تقييم جدوى لتقنية ناشئة قبل تجربتها.', en: 'Runs a feasibility assessment of an emerging technology before piloting it.' },
    },
  },
  {
    id: 'team_lead',
    name: { ar: 'قيادة فرق', en: 'Team leadership' },
    audience: { ar: 'قادة الفرق ومديرو الإدارات والبرامج ومن في حكمهم', en: 'Team leads, department and programme managers, and their equivalents' },
    gradeBand: { ar: 'غالبًا المراتب من الحادية عشرة إلى الثالثة عشرة أو ما يعادلها', en: 'Typically grades 11 to 13, or the equivalent' },
    who: {
      ar: 'لقادة الفرق ومديري الإدارات والبرامج ومن في حكمهم ممن يقودون فريقًا أو برنامج تحول، وغالبًا في المراتب من الحادية عشرة إلى الثالثة عشرة أو ما يعادلها.',
      en: 'For team leads, department and programme managers and their equivalents who lead a team or a transformation programme — typically grades 11 to 13, or the equivalent.',
    },
    proves: { ar: 'يقود التبني والجودة والتغيير ويتابع المنافع.', en: 'Leads adoption, quality and change, and tracks benefits.' },
    examples: {
      leadership: { ar: 'يبني خطة تغيير لمبادرة ويقيس تبنيها بعد الإطلاق.', en: 'Builds a change plan for an initiative and measures adoption after launch.' },
      agile: { ar: 'يربط تسليم الفريق بمؤشر منفعة يُقاس فعلًا.', en: 'Ties team delivery to a benefit metric that is actually measured.' },
      policy: { ar: 'يترجم متطلبًا تنظيميًا جديدًا إلى خطة امتثال لفريقه.', en: 'Translates a new regulatory requirement into a compliance plan for the team.' },
    },
  },
  {
    id: 'executive',
    name: { ar: 'تنفيذي', en: 'Executive' },
    audience: { ar: 'القيادات التنفيذية ومن في حكمهم: وكيل الجهة ومساعده، والمحافظ ونائبه، والرئيس التنفيذي، ومدير عام القطاع', en: 'Executive leaders and their equivalents: deputy and assistant deputy heads, governors and vice-governors, chief executives and sector directors-general' },
    gradeBand: { ar: 'المرتبة الرابعة عشرة فما فوقها أو ما يعادلها', en: 'Grade 14 and above, or the equivalent' },
    who: {
      ar: 'للقيادات التنفيذية ومن في حكمهم: وكيل الجهة ومساعده، والمحافظ ونائبه، والرئيس التنفيذي، ومدير عام القطاع، ممن يقررون الاستثمار والأولويات، في المرتبة الرابعة عشرة فما فوقها أو ما يعادلها.',
      en: 'For executive leaders and their equivalents — deputy and assistant deputy heads, governors and vice-governors, chief executives and sector directors-general — who decide investment and priorities, at grade 14 and above or the equivalent.',
    },
    proves: { ar: 'يرتب الاستثمار والأولويات والمخاطر والمساءلة والتكامل.', en: 'Orders investment, priorities, risk, accountability and integration.' },
    examples: {
      policy: { ar: 'يقرر استثمارًا تقنيًا بشروط نجاح وتوقف معلنة.', en: 'Decides a technology investment with declared success and stop conditions.' },
      emerging: { ar: 'يرفض تقنية ضجيج بلا قيمة بمنهجية موثقة.', en: 'Rejects a hyped technology without value using a documented method.' },
      'ai-data': { ar: 'يسأل الأسئلة الصحيحة عن نموذج ذكاء اصطناعي قبل اعتماده.', en: 'Asks the right questions about an AI model before approving it.' },
    },
  },
]

export const trackById = (id: TrackId | null | undefined): Track | undefined =>
  tracks.find((tr) => tr.id === id)
