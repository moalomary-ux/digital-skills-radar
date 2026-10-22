import type { L, Lang } from '../../data/types'
import type { NodeKind } from '../../lib/skillsGraph'
import { countPhrase } from '../../lib/format'
import type { ArabicCountForms } from '../../lib/format'

/** Interface text of the skills map (both languages). Counts are always derived from the data. */
export const MAP_COPY = {
  title: { ar: 'خريطة المهارات التفاعلية', en: 'Interactive skills map' },
  eyebrow: { ar: 'استكشف بدل أن تقرأ', en: 'Explore instead of reading' },
  open: { ar: 'افتح الخريطة', en: 'Open the map' },
  svgLabel: {
    ar: 'خريطة دائرية: المجالات الثمانية في المركز، وحولها المهارات، ثم الأسر الوظيفية والأدوار، ثم التقنيات. الجدول النصي بعد الخريطة يعرض كل عقدة وروابطها.',
    en: 'Circular map: the eight domains at the centre, their skills around them, then job families and roles, then technologies. The text table after the map lists every node and its connections.',
  },
  intro: {
    ar: 'المجالات في المركز ومهاراتها حولها، ثم الأسر الوظيفية والأدوار، ثم التقنيات. انقر أي نقطة لترى روابطها، أو ابدأ القصة.',
    en: 'Domains at the centre with their skills around them, then job families and roles, then technologies. Click any point to see its connections, or start the story.',
  },
  introTouch: {
    ar: 'المجالات في المركز ومهاراتها حولها، ثم الأسر الوظيفية والأدوار، ثم التقنيات. المس أي مجال لترى روابطه، أو ابدأ القصة.',
    en: 'Domains at the centre with their skills around them, then job families and roles, then technologies. Tap any domain to see its connections, or start the story.',
  },
  search: { ar: 'ابحث في الخريطة', en: 'Search the map' },
  searchHint: { ar: 'مهارة أو دور أو تقنية… (اضغط /)', en: 'A skill, role or technology… (press /)' },
  searchHintTouch: { ar: 'ابحث عن مهارة أو دور أو تقنية', en: 'Find a skill, role or technology' },
  nearResults: { ar: 'لا شيء يطابق كل الكلمات؛ هذه أقرب النتائج.', en: 'Nothing matches every word; these are the closest.' },
  skipToDetails: { ar: 'انتقل إلى التفاصيل', en: 'Go to the details' },
  ringsOff: { ar: 'كل الحلقات مطفأة: فعّل حلقة واحدة على الأقل لتظهر عقدها وروابطها.', en: 'Every ring is off: turn one on to see its nodes and connections.' },
  touchHint: { ar: 'المس إسفيناً لتختار مجاله، وقرّب بإصبعين لتختار مهارة أو دوراً.', en: 'Tap a wedge to pick its domain; pinch to zoom in and pick a skill or role.' },
  results: { ar: 'نتائج البحث', en: 'Search results' },
  noResults: { ar: 'لا نتائج. جرّب كلمة أقصر.', en: 'No results. Try a shorter word.' },
  clearSearch: { ar: 'امسح البحث', en: 'Clear search' },
  rings: { ar: 'ما يظهر على الخريطة', en: 'Shown on the map' },
  zoomIn: { ar: 'تكبير', en: 'Zoom in' },
  zoomOut: { ar: 'تصغير', en: 'Zoom out' },
  reset: { ar: 'إعادة الضبط', en: 'Reset' },
  wheelHint: { ar: 'للتكبير: انقر على الخريطة ثم استخدم العجلة، أو Ctrl مع العجلة، أو الأزرار.', en: 'To zoom: click the map then use the wheel, or Ctrl + wheel, or the buttons.' },
  keyboard: {
    ar: 'لوحة المفاتيح: Tab بين الحلقات، والأسهم داخل الحلقة، وEnter للاختيار، وEnter مطوّلاً على مجال لإضاءته، وShift مع Enter على دور لمقارنته بالدور المختار، وEsc للرجوع، و/ للبحث.',
    en: 'Keyboard: Tab moves between rings, arrows within a ring, Enter selects, a long Enter on a domain spotlights it, Shift + Enter on a role compares it with the selected role, Esc goes back, / searches.',
  },
  mouse: {
    ar: 'انقر مرتين على مجال لإضاءته، واضغط Shift مع النقر على دور لمقارنته بالدور المختار.',
    en: 'Double-click a domain to spotlight it; Shift-click a role to compare it with the selected role.',
  },
  story: { ar: 'ابدأ القصة', en: 'Start the story' },
  storyEnd: { ar: 'أنهِ القصة', en: 'End the story' },
  next: { ar: 'التالي', en: 'Next' },
  back: { ar: 'السابق', en: 'Back' },
  step: { ar: 'الخطوة', en: 'Step' },
  of: { ar: 'من', en: 'of' },
  table: { ar: 'اعرض الجدول النصي', en: 'Show the text table' },
  tableHide: { ar: 'أخفِ الجدول النصي', en: 'Hide the text table' },
  tableCaption: { ar: 'كل عقدة في الخريطة: نوعها ومجالها وروابطها', en: 'Every node on the map: its kind, domain and connections' },
  name: { ar: 'العقدة', en: 'Node' },
  kind: { ar: 'النوع', en: 'Kind' },
  domain: { ar: 'المجال', en: 'Domain' },
  links: { ar: 'الروابط', en: 'Connections' },
  legend: { ar: 'مفتاح الخريطة', en: 'Map key' },
  clear: { ar: 'امسح الاختيار', en: 'Clear the selection' },
  selected: { ar: 'تم اختيار', en: 'Selected' },
  loadingSectors: { ar: 'جارٍ تحميل القطاعات…', en: 'Loading sectors…' },
  sectorsFailed: { ar: 'تعذّر تحميل القطاعات.', en: 'The sectors could not be loaded.' },
  editorial: { ar: 'استنتاج تحريري', en: 'Editorial inference' },
  clickToOpen: { ar: 'انقر للتفاصيل', en: 'Click for details' },
  tapToOpen: { ar: 'المس للتفاصيل', en: 'Tap for details' },
  close: { ar: 'أغلق', en: 'Close' },
  // «إضاءة المجال» (wow 3)
  spotlight: { ar: 'إضاءة المجال', en: 'Domain spotlight' },
  spotlightOpen: { ar: 'أضئ هذا المجال', en: 'Spotlight this domain' },
  spotlightExit: { ar: 'عُد إلى الخريطة كاملة', en: 'Back to the whole map' },
  otherDomains: { ar: 'مجالات أخرى', en: 'Other domains' },
  timeline: { ar: 'التقنيات حسب أفق التبني، من 2026', en: 'Technologies by adoption horizon, from 2026' },
  timelineNote: {
    ar: 'أفق التبني تقدير تحريري، وربط كل أفق بحارة من حارات تغيّر المهام تقدير تحريري كذلك.',
    en: 'The adoption horizon is an editorial rating, and pairing each horizon with a task-shift lane is editorial too.',
  },
  // «قارن دورين» (wow 2)
  compare: { ar: 'قارن بدور آخر', en: 'Compare with another role' },
  compareTitle: { ar: 'مقارنة دورين', en: 'Two roles compared' },
  compareEnd: { ar: 'أنهِ المقارنة', en: 'End the comparison' },
  compareSwap: { ar: 'بدّل الدورين', en: 'Swap the roles' },
  compareSecond: { ar: 'الدور الثاني', en: 'Second role' },
  compareChoose: { ar: 'اختر دوراً…', en: 'Choose a role…' },
  // «طريقي إلى هذا الدور» (wow 1)
  myPath: { ar: 'طريقي إلى هذا الدور', en: 'My path to this role' },
  toPlan: { ar: 'طوّرها في خطتي', en: 'Develop them in my plan' },
  sectorsEditorial: {
    ar: 'موضع كل قطاع: المجال الذي يزيد فيه نصيبه من سجلات الاستشارات على متوسط القطاعات. تقدير تحريري.',
    en: 'Each sector sits in the domain where its share of consulting records most exceeds the average across sectors. Editorial.',
  },
} satisfies Record<string, L>

export const KIND_NAME: Record<NodeKind, { one: L; many: L }> = {
  domain: { one: { ar: 'مجال', en: 'Domain' }, many: { ar: 'المجالات', en: 'Domains' } },
  skill: { one: { ar: 'مهارة', en: 'Skill' }, many: { ar: 'المهارات', en: 'Skills' } },
  family: { one: { ar: 'أسرة وظيفية', en: 'Job family' }, many: { ar: 'الأسر الوظيفية', en: 'Job families' } },
  role: { one: { ar: 'دور رقمي', en: 'Digital role' }, many: { ar: 'الأدوار', en: 'Roles' } },
  tech: { one: { ar: 'تقنية', en: 'Technology' }, many: { ar: 'التقنيات', en: 'Technologies' } },
  sector: { one: { ar: 'قطاع حكومي', en: 'Government sector' }, many: { ar: 'القطاعات', en: 'Sectors' } },
}

const COUNT_FORMS: Record<NodeKind | 'link' | 'linked', { ar: ArabicCountForms; en: [string, string] }> = {
  domain: { ar: { one: 'مجال واحد', two: 'مجالان', few: 'مجالات', many: 'مجالًا' }, en: ['domain', 'domains'] },
  skill: { ar: { one: 'مهارة واحدة', two: 'مهارتان', few: 'مهارات', many: 'مهارة' }, en: ['skill', 'skills'] },
  family: { ar: { one: 'أسرة وظيفية واحدة', two: 'أسرتان وظيفيتان', few: 'أسر وظيفية', many: 'أسرة وظيفية' }, en: ['job family', 'job families'] },
  role: { ar: { one: 'دور واحد', two: 'دوران', few: 'أدوار', many: 'دورًا' }, en: ['role', 'roles'] },
  tech: { ar: { one: 'تقنية واحدة', two: 'تقنيتان', few: 'تقنيات', many: 'تقنية' }, en: ['technology', 'technologies'] },
  sector: { ar: { one: 'قطاع واحد', two: 'قطاعان', few: 'قطاعات', many: 'قطاعًا' }, en: ['sector', 'sectors'] },
  link: { ar: { one: 'رابط واحد', two: 'رابطان', few: 'روابط', many: 'رابطًا' }, en: ['connection', 'connections'] },
  linked: { ar: { one: 'عنصر مرتبط واحد', two: 'عنصران مرتبطان', few: 'عناصر مرتبطة', many: 'عنصرًا مرتبطًا' }, en: ['linked item', 'linked items'] },
}

/** «5 مهارات», «24 دورًا», «1 technology» … */
export function countOf(kind: NodeKind | 'link' | 'linked', n: number, lang: Lang): string {
  const f = COUNT_FORMS[kind]
  return countPhrase(n, lang, f.ar, f.en)
}

/** List separator for the interface language. */
export const sep = (lang: Lang) => (lang === 'ar' ? '، ' : ', ')
