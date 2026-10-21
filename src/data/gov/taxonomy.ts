/**
 * Bilingual taxonomies for the government data layer. The JSON files carry slugs only; every
 * label shown to a reader comes from here, so the English UI never shows raw Arabic taxonomy.
 *
 * Node loads this file directly (type stripping) from `scripts/build-gov-data.mjs`, so it must stay
 * free of runtime imports and of non-erasable TypeScript syntax.
 */
import type { EntityStatus, EntityType } from './types.ts'

export interface Term {
  id: string
  ar: string
  en: string
}

function byAr(list: readonly Term[]): Map<string, Term> {
  return new Map(list.map((t) => [t.ar, t]))
}
function byId(list: readonly Term[]): Map<string, Term> {
  return new Map(list.map((t) => [t.id, t]))
}

/* ------------------------------------------------------------- sectors */

/** The 31 directory sectors. `id` is the URL slug (`/sectors/:sectorId`); `ar` is the verbatim workbook name. */
export const sectors: readonly Term[] = [
  { id: 'royal-court', ar: 'الديوان الملكي ومجلس الوزراء', en: 'Royal Court and Council of Ministers' },
  { id: 'regions', ar: 'الإمارات والمناطق', en: 'Regional emirates' },
  { id: 'municipal-housing', ar: 'البلديات والإسكان', en: 'Municipalities and housing' },
  { id: 'interior-security', ar: 'الداخلية والأمن', en: 'Interior and security' },
  { id: 'defense', ar: 'الدفاع والحرس الوطني', en: 'Defense and National Guard' },
  { id: 'justice', ar: 'العدل والقضاء', en: 'Justice and judiciary' },
  { id: 'foreign-affairs', ar: 'الخارجية والدبلوماسية', en: 'Foreign affairs and diplomacy' },
  { id: 'finance', ar: 'المالية والاستثمار الحكومي', en: 'Finance and government investment' },
  { id: 'economy-planning', ar: 'الاقتصاد والتخطيط والإحصاء', en: 'Economy, planning and statistics' },
  { id: 'commerce-industry', ar: 'التجارة والصناعة والاستثمار', en: 'Commerce, industry and investment' },
  { id: 'energy-utilities', ar: 'الطاقة والتعدين والمرافق', en: 'Energy, mining and utilities' },
  { id: 'ict-space', ar: 'الاتصالات وتقنية المعلومات والفضاء', en: 'Communications, IT and space' },
  { id: 'transport-logistics', ar: 'النقل والخدمات اللوجستية', en: 'Transport and logistics' },
  { id: 'water-environment', ar: 'المياه والبيئة والزراعة', en: 'Water, environment and agriculture' },
  { id: 'health', ar: 'الصحة', en: 'Health' },
  { id: 'education-training', ar: 'التعليم العام والتدريب', en: 'General education and training' },
  { id: 'higher-education', ar: 'التعليم العالي والجامعات', en: 'Higher education and universities' },
  { id: 'islamic-affairs-hajj', ar: 'الشؤون الإسلامية والحج والعمرة', en: 'Islamic affairs, Hajj and Umrah' },
  { id: 'labor-social', ar: 'العمل والتنمية الاجتماعية', en: 'Labor and social development' },
  { id: 'culture-heritage', ar: 'الثقافة والتراث', en: 'Culture and heritage' },
  { id: 'media', ar: 'الإعلام', en: 'Media' },
  { id: 'tourism-entertainment', ar: 'السياحة والترفيه والفعاليات', en: 'Tourism, entertainment and events' },
  { id: 'sports', ar: 'الرياضة', en: 'Sports' },
  { id: 'oversight-anticorruption', ar: 'الرقابة ومكافحة الفساد', en: 'Oversight and anti-corruption' },
  { id: 'shared-services', ar: 'الخدمات الحكومية المشتركة', en: 'Shared government services' },
  { id: 'development-authorities', ar: 'هيئات التطوير والمشاريع الكبرى', en: 'Development authorities and major projects' },
  { id: 'vision-programs', ar: 'البرامج الوطنية ورؤية 2030', en: 'National programs and Vision 2030' },
  { id: 'banking-finance', ar: 'البنوك والخدمات المالية', en: 'Banking and financial services' },
  { id: 'state-owned-companies', ar: 'الشركات المملوكة للدولة والصناديق السيادية', en: 'State-owned companies and sovereign funds' },
  { id: 'private-sector', ar: 'القطاع الخاص', en: 'Private sector' },
  { id: 'international-other', ar: 'منظمات دولية وجهات أخرى', en: 'International organizations and others' },
] as const

/** Sectors that are, by construction, not government sectors: never listed on the public sectors page. */
export const NON_GOVERNMENT_SECTOR_IDS: readonly string[] = ['private-sector'] as const

/** The pooled row that carries the totals of sectors whose aggregates are withheld. */
export const POOLED_SECTOR: Term = {
  id: 'other-pooled',
  ar: 'قطاعات أخرى (مجاميع مجمّعة)',
  en: 'Other sectors (pooled totals)',
}

const sectorsByAr = byAr(sectors)
const sectorsById = byId(sectors)
export const sectorIdFromAr = (ar: string): string | undefined => sectorsByAr.get(ar)?.id
export const sectorById = (id: string): Term | undefined => (id === POOLED_SECTOR.id ? POOLED_SECTOR : sectorsById.get(id))

/* ------------------------------------------------------ entity classes */

export const entityTypes: readonly (Term & { id: EntityType })[] = [
  { id: 'government', ar: 'جهة حكومية', en: 'Government entity' },
  { id: 'quasi-government', ar: 'جهة شبه حكومية', en: 'Quasi-government entity' },
  { id: 'state-owned', ar: 'شركة مملوكة للدولة', en: 'State-owned company or fund' },
  { id: 'private', ar: 'جهة خاصة', en: 'Private entity' },
  { id: 'nonprofit', ar: 'جهة أهلية', en: 'Nonprofit entity' },
  { id: 'international', ar: 'منظمة دولية', en: 'International organization' },
  { id: 'sports', ar: 'جهة رياضية', en: 'Sports body' },
] as const

const entityTypesById = byId(entityTypes)
export const entityTypeById = (id: string): Term | undefined => entityTypesById.get(id)

export const entityStatuses: readonly (Term & { id: EntityStatus })[] = [
  { id: 'active', ar: 'قائمة', en: 'Active' },
  { id: 'historical', ar: 'تاريخية (ملغاة أو مستبدلة)', en: 'Historical (abolished or replaced)' },
  { id: 'merged', ar: 'مدمجة في جهة أخرى', en: 'Merged into another entry' },
] as const

/* ------------------------------------------------- organizational type */

/** Organizational type («النوع» in the workbook). */
export const kinds: readonly Term[] = [
  { id: 'ministry', ar: 'وزارة', en: 'Ministry' },
  { id: 'authority', ar: 'هيئة حكومية', en: 'Government authority' },
  { id: 'entity', ar: 'جهة', en: 'Entity' },
  { id: 'center', ar: 'مركز', en: 'Center' },
  { id: 'municipality', ar: 'أمانة', en: 'Municipality (Amanah)' },
  { id: 'council', ar: 'مجلس', en: 'Council' },
  { id: 'program', ar: 'برنامج', en: 'Program' },
  { id: 'national-program', ar: 'برنامج وطني', en: 'National program' },
  { id: 'emirate', ar: 'إمارة', en: 'Regional emirate' },
  { id: 'fund', ar: 'صندوق', en: 'Fund' },
  { id: 'sovereign-fund', ar: 'صندوق سيادي', en: 'Sovereign fund' },
  { id: 'pif-portfolio', ar: 'محفظة صندوق الاستثمارات', en: 'Public Investment Fund portfolio company' },
  { id: 'company', ar: 'شركة', en: 'Company' },
  { id: 'institution', ar: 'مؤسسة', en: 'Institution' },
  { id: 'institute', ar: 'معهد', en: 'Institute' },
  { id: 'university', ar: 'جامعة', en: 'University' },
  { id: 'hospital', ar: 'مستشفى', en: 'Hospital' },
  { id: 'complex', ar: 'مجمع', en: 'Complex' },
  { id: 'city', ar: 'مدينة طبية/اقتصادية', en: 'Medical or economic city' },
  { id: 'bank', ar: 'بنك', en: 'Bank' },
  { id: 'federation', ar: 'اتحاد', en: 'Federation or union' },
  { id: 'sports-federation', ar: 'اتحاد رياضي', en: 'Sports federation' },
  { id: 'club', ar: 'نادي', en: 'Club' },
  { id: 'media', ar: 'إعلام', en: 'Media outlet' },
] as const

const kindsByAr = byAr(kinds)
const kindsById = byId(kinds)
export const kindIdFromAr = (ar: string): string | undefined => kindsByAr.get(ar)?.id
export const kindById = (id: string): Term | undefined => kindsById.get(id)

/* ---------------------------------------------------------------- scope */

/** Source scope («النطاق» in the workbook); kept in the full build only. */
export const scopes: readonly Term[] = [
  { id: 'government', ar: 'حكومية', en: 'Government' },
  { id: 'semi-government', ar: 'شبه حكومية', en: 'Semi-government' },
  { id: 'private', ar: 'خاصة', en: 'Private' },
  { id: 'civil', ar: 'أهلية', en: 'Civil / nonprofit' },
  { id: 'international', ar: 'دولية', en: 'International' },
  { id: 'unspecified', ar: 'غير محددة', en: 'Unspecified' },
] as const

const scopesByAr = byAr(scopes)
const scopesById = byId(scopes)
export const scopeIdFromAr = (ar: string): string | undefined => scopesByAr.get(ar)?.id
export const scopeById = (id: string): Term | undefined => scopesById.get(id)

/* -------------------------------------------------------------- regions */

export const regions: readonly Term[] = [
  { id: 'riyadh', ar: 'منطقة الرياض', en: 'Riyadh' },
  { id: 'makkah', ar: 'منطقة مكة المكرمة', en: 'Makkah' },
  { id: 'eastern', ar: 'المنطقة الشرقية', en: 'Eastern Province' },
  { id: 'madinah', ar: 'منطقة المدينة المنورة', en: 'Madinah' },
  { id: 'aseer', ar: 'منطقة عسير', en: 'Aseer' },
  { id: 'qassim', ar: 'منطقة القصيم', en: 'Qassim' },
  { id: 'hail', ar: 'منطقة حائل', en: 'Hail' },
  { id: 'tabuk', ar: 'منطقة تبوك', en: 'Tabuk' },
  { id: 'jouf', ar: 'منطقة الجوف', en: 'Al-Jouf' },
  { id: 'jazan', ar: 'منطقة جازان', en: 'Jazan' },
  { id: 'bahah', ar: 'منطقة الباحة', en: 'Al-Bahah' },
  { id: 'northern-borders', ar: 'منطقة الحدود الشمالية', en: 'Northern Borders' },
  { id: 'najran', ar: 'منطقة نجران', en: 'Najran' },
  { id: 'unspecified', ar: 'غير محدد', en: 'Unspecified' },
] as const

const regionsByAr = byAr(regions)
const regionsById = byId(regions)
export const regionIdFromAr = (ar: string): string | undefined => regionsByAr.get(ar)?.id
export const regionById = (id: string): Term | undefined => regionsById.get(id)

/* --------------------------------------------------- consulting category */

/** The 8 consulting categories. `key` is the verbatim workbook string (with its «N. » prefix) used in the record maps. */
export interface CategoryTerm extends Term {
  key: string
}

export const consultingCategoryTerms: readonly CategoryTerm[] = [
  { id: 'digital-strategy', key: '1. الاستراتيجيات الرقمية', ar: 'الاستراتيجيات الرقمية', en: 'Digital strategies' },
  { id: 'infrastructure', key: '2. تخطيط وتمكين البنية التقنية', ar: 'تخطيط وتمكين البنية التقنية', en: 'Technical infrastructure planning and enablement' },
  { id: 'innovation', key: '3. الابتكار والتقنيات الناشئة', ar: 'الابتكار والتقنيات الناشئة', en: 'Innovation and emerging technologies' },
  { id: 'excellence-continuity', key: '4. التميز المؤسسي واستمرارية الأعمال', ar: 'التميز المؤسسي واستمرارية الأعمال', en: 'Institutional excellence and business continuity' },
  { id: 'investment-services', key: '5. الاستثمار والخدمات الرقمية', ar: 'الاستثمار والخدمات الرقمية', en: 'Investment and digital services' },
  { id: 'data-integration', key: '6. البيانات والتكامل', ar: 'البيانات والتكامل', en: 'Data and integration' },
  { id: 'performance-indicators', key: '7. مؤشرات الأداء الرقمي', ar: 'مؤشرات الأداء الرقمي', en: 'Digital performance indicators' },
  { id: 'competitiveness', key: '8. التميز والتنافسية', ar: 'التميز والتنافسية', en: 'Excellence and competitiveness' },
] as const

const categoriesByKey = new Map(consultingCategoryTerms.map((c) => [c.key, c]))
const categoriesById = new Map(consultingCategoryTerms.map((c) => [c.id, c]))
export const categoryByKey = (key: string): CategoryTerm | undefined => categoriesByKey.get(key)
export const categoryById = (id: string): CategoryTerm | undefined => categoriesById.get(id)

/* ---------------------------------------------------- strategic pillars */

export const pillarTerms: readonly Term[] = [
  { id: 'acceleration', ar: 'تسريع التحول', en: 'Accelerating transformation' },
  { id: 'satisfaction', ar: 'رضا المستفيدين', en: 'Beneficiary satisfaction' },
  { id: 'regulatory', ar: 'البيئة التنظيمية', en: 'Regulatory environment' },
  { id: 'effective-government', ar: 'حكومة فعّالة', en: 'Effective government' },
  { id: 'business-enablement', ar: 'تمكين الأعمال', en: 'Business enablement' },
  { id: 'investment-efficiency', ar: 'كفاءة الاستثمار', en: 'Investment efficiency' },
] as const

const pillarsByAr = byAr(pillarTerms)
export const pillarFromAr = (ar: string): Term | undefined => pillarsByAr.get(ar)

/* ------------------------------------------------------- periods, cut-off */

export const periods = {
  training: { ar: '2021 إلى 2026', en: '2021 to 2026' },
  consulting: { ar: '2023 إلى نهاية الربع الثالث 2026', en: '2023 to the end of Q3 2026' },
} as const

export const cutoff = {
  ar: 'ملفا المصدر حتى نهاية الربع الثالث 2026',
  en: 'Both source workbooks up to the end of Q3 2026',
} as const

/* ---------------------------------------------------- entity proper names */

/**
 * Entity names are proper nouns: the Arabic name is always shown (wrapped `lang="ar"`), and the English
 * name, when the source has one, under it. In the English UI an entity without an English name carries
 * this note, so the reader knows the Arabic script is the name itself and not an untranslated label.
 */
export const englishNameFallback = {
  short: 'Arabic name only',
  long: 'The source workbook has no English name for this entity, so its Arabic name is shown.',
} as const

/** Pick the label of a term in the current language; falls back to the id so nothing renders empty. */
export function label(term: Term | undefined, lang: 'ar' | 'en', fallback = ''): string {
  if (!term) return fallback
  return lang === 'ar' ? term.ar : term.en
}
