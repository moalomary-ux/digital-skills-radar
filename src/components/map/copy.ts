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
  search: { ar: 'ابحث في الخريطة', en: 'Search the map' },
  searchHint: { ar: 'مهارة أو دور أو تقنية… (اضغط /)', en: 'A skill, role or technology… (press /)' },
  results: { ar: 'نتائج البحث', en: 'Search results' },
  noResults: { ar: 'لا نتائج. جرّب كلمة أقصر.', en: 'No results. Try a shorter word.' },
  clearSearch: { ar: 'امسح البحث', en: 'Clear search' },
  rings: { ar: 'ما يظهر على الخريطة', en: 'Shown on the map' },
  zoomIn: { ar: 'تكبير', en: 'Zoom in' },
  zoomOut: { ar: 'تصغير', en: 'Zoom out' },
  reset: { ar: 'إعادة الضبط', en: 'Reset' },
  wheelHint: { ar: 'للتكبير: انقر على الخريطة ثم استخدم العجلة، أو Ctrl مع العجلة، أو الأزرار.', en: 'To zoom: click the map then use the wheel, or Ctrl + wheel, or the buttons.' },
  keyboard: {
    ar: 'لوحة المفاتيح: Tab للانتقال بين الحلقات، والأسهم داخل الحلقة، وEnter أو المسافة للاختيار، وEsc للمسح، و/ للبحث.',
    en: 'Keyboard: Tab moves between rings, the arrow keys move within a ring, Enter or Space selects, Esc clears, / searches.',
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
} satisfies Record<string, L>

export const KIND_NAME: Record<NodeKind, { one: L; many: L }> = {
  domain: { one: { ar: 'مجال', en: 'Domain' }, many: { ar: 'المجالات', en: 'Domains' } },
  skill: { one: { ar: 'مهارة', en: 'Skill' }, many: { ar: 'المهارات', en: 'Skills' } },
  family: { one: { ar: 'أسرة وظيفية', en: 'Job family' }, many: { ar: 'الأسر الوظيفية', en: 'Job families' } },
  role: { one: { ar: 'دور رقمي', en: 'Digital role' }, many: { ar: 'الأدوار', en: 'Roles' } },
  tech: { one: { ar: 'تقنية', en: 'Technology' }, many: { ar: 'التقنيات', en: 'Technologies' } },
  sector: { one: { ar: 'قطاع حكومي', en: 'Government sector' }, many: { ar: 'القطاعات', en: 'Sectors' } },
}

const COUNT_FORMS: Record<NodeKind | 'link', { ar: ArabicCountForms; en: [string, string] }> = {
  domain: { ar: { one: 'مجال واحد', two: 'مجالان', few: 'مجالات', many: 'مجالًا' }, en: ['domain', 'domains'] },
  skill: { ar: { one: 'مهارة واحدة', two: 'مهارتان', few: 'مهارات', many: 'مهارة' }, en: ['skill', 'skills'] },
  family: { ar: { one: 'أسرة وظيفية واحدة', two: 'أسرتان وظيفيتان', few: 'أسر وظيفية', many: 'أسرة وظيفية' }, en: ['job family', 'job families'] },
  role: { ar: { one: 'دور واحد', two: 'دوران', few: 'أدوار', many: 'دورًا' }, en: ['role', 'roles'] },
  tech: { ar: { one: 'تقنية واحدة', two: 'تقنيتان', few: 'تقنيات', many: 'تقنية' }, en: ['technology', 'technologies'] },
  sector: { ar: { one: 'قطاع واحد', two: 'قطاعان', few: 'قطاعات', many: 'قطاعًا' }, en: ['sector', 'sectors'] },
  link: { ar: { one: 'رابط واحد', two: 'رابطان', few: 'روابط', many: 'رابطًا' }, en: ['connection', 'connections'] },
}

/** «5 مهارات», «24 دورًا», «1 technology» … */
export function countOf(kind: NodeKind | 'link', n: number, lang: Lang): string {
  const f = COUNT_FORMS[kind]
  return countPhrase(n, lang, f.ar, f.en)
}

/** List separator for the interface language. */
export const sep = (lang: Lang) => (lang === 'ar' ? '، ' : ', ')
