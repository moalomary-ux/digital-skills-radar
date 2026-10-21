import type { Claim, ClaimSource } from './types'
import { cutoff } from '../gov/taxonomy.ts'

/**
 * Claims behind the government data layer (packet P4): «سجل خدمات التمكين», the cleaned directory and
 * the sector aggregates. Ids are stable, kebab-case, prefixed 'gov-'. The national sheet totals
 * (7,915 / 2,873), the workbook prose (7,935 / 2,918), the live register (7,891 / 2,918 on 2026-10-18)
 * and the n ≥ 10 rule are registered once in `method.ts` as `method-gov-*` and reused, not duplicated.
 *
 * Counts marked «from the data» are checked by `node scripts/build-gov-data.mjs --check`.
 */

const REVIEWED = '2026-10-22'

const govWorkbooks: ClaimSource = {
  title: {
    ar: 'ملفا المصدر: سجل خدمات التمكين، ودليل الجهات والقطاعات',
    en: 'Two source workbooks: the enablement service records, and the entity and sector directory',
  },
  publisher: {
    ar: 'سجلات داخلية لبرنامج قدراتك ومنصة الاستشارات والدراسات',
    en: 'Internal records of the government digital-skills program and the consulting and studies platform',
  },
  year: 2026,
  locator: 'services.xlsx → summary sheet',
  access: 'internal',
}

const cleanedDirectory: ClaimSource = {
  title: { ar: 'دليل الجهات المنقّى (رادار المهارات الرقمية v9)', en: 'The cleaned entity directory (Digital Skills Radar v9)' },
  publisher: { ar: 'مؤلف الأداة (مفهوم مستقل)؛ قواعد التنقية في src/data/gov/README.md', en: 'The tool’s author (independent concept); cleaning rules in src/data/gov/README.md' },
  year: 2026,
}

const cutoffCaveat = { ar: `${cutoff.ar}.`, en: `${cutoff.en}.` }

export const govClaims: Claim[] = [
  {
    id: 'gov-entities-served',
    text: {
      ar: 'استفادت 421 جهة من خدمات التدريب أو الاستشارات حتى نهاية الربع الثالث 2026.',
      en: '421 entities received training or consulting services up to the end of Q3 2026.',
    },
    value: { ar: '421', en: '421' },
    unit: { ar: 'جهة مستفيدة', en: 'entities served' },
    scope: { ar: 'كل الجهات في ملفي المصدر، بما فيها غير الحكومية', en: 'All entities in the two source workbooks, including non-government ones' },
    period: '2021 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    derivation: { ar: 'عدد صفوف ورقة الجهات، ويطابق ملخص الملف.', en: 'Row count of the entities sheet; it matches the workbook summary.' },
    reviewedOn: REVIEWED,
    caveat: cutoffCaveat,
  },
  {
    id: 'gov-entities-served-gov',
    text: {
      ar: 'من الجهات المستفيدة الـ421، صُنّفت 370 جهة حكومية أو شبه حكومية في ملف المصدر.',
      en: 'Of the 421 entities served, 370 are classed as government or quasi-government in the source workbook.',
    },
    value: { ar: '370', en: '370' },
    unit: { ar: 'جهة حكومية أو شبه حكومية', en: 'government or quasi-government entities' },
    period: '2021 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'تصنيف ملف المصدر (النطاق «حكومية» و«شبه حكومية»)، وهو أوسع من تصنيف الدليل المنقّى الذي يفرز الشركات المملوكة للدولة على حدة.',
      en: 'The source workbook’s own classing (scope «government» and «semi-government»); it is broader than the cleaned directory, which separates state-owned companies.',
    },
  },
  {
    id: 'gov-training-programs',
    text: { ar: 'قُدِّم 377 برنامجًا تدريبيًا بين 2021 و2026.', en: '377 training programs were delivered between 2021 and 2026.' },
    value: { ar: '377', en: '377' },
    unit: { ar: 'برنامج تدريبي', en: 'training programs' },
    period: '2021 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    reviewedOn: REVIEWED,
    caveat: { ar: 'برامج لا سجلات مشاركة؛ البرنامج الواحد يحضره عدة مشاركين.', en: 'Programs, not participation records; one program has many participants.' },
  },
  {
    id: 'gov-training-entities',
    text: { ar: 'شاركت 322 جهة في برامج التدريب.', en: '322 entities took part in training programs.' },
    value: { ar: '322', en: '322' },
    unit: { ar: 'جهة', en: 'entities' },
    period: '2021 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    reviewedOn: REVIEWED,
    caveat: cutoffCaveat,
  },
  {
    id: 'gov-consulting-entities',
    text: { ar: 'تلقّت 372 جهة خدمات استشارية.', en: '372 entities received consulting services.' },
    value: { ar: '372', en: '372' },
    unit: { ar: 'جهة', en: 'entities' },
    period: '2023 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    reviewedOn: REVIEWED,
    caveat: cutoffCaveat,
  },
  {
    id: 'gov-both-tracks-entities',
    text: { ar: 'استفادت 273 جهة من المسارين معًا، التدريب والاستشارات.', en: '273 entities used both tracks, training and consulting.' },
    value: { ar: '273', en: '273' },
    unit: { ar: 'جهة', en: 'entities' },
    period: '2021 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: govWorkbooks,
    reviewedOn: REVIEWED,
    caveat: cutoffCaveat,
  },
  {
    id: 'gov-cutoff',
    text: {
      ar: 'تنتهي بيانات ملفي المصدر عند نهاية الربع الثالث 2026، وتُقرأ كل الأرقام الوطنية عند هذا التاريخ.',
      en: 'The two source workbooks end at the close of Q3 2026, and every national figure is read at that date.',
    },
    value: { ar: 'نهاية الربع الثالث 2026', en: 'end of Q3 2026' },
    period: '2026-09-30',
    kind: 'official',
    confidence: 'high',
    source: govWorkbooks,
    reviewedOn: REVIEWED,
  },
  {
    id: 'gov-consulting-lines',
    text: {
      ar: 'تتوزع الخدمات الاستشارية على 1,597 سطرًا تفصيليًا في 8 فئات.',
      en: 'The consulting services break down into 1,597 detail lines across 8 categories.',
    },
    value: { ar: '1,597', en: '1,597' },
    unit: { ar: 'سطر تفصيلي', en: 'detail lines' },
    period: '2023 → 2026-09-30',
    kind: 'official',
    confidence: 'medium',
    source: { ...govWorkbooks, locator: 'services.xlsx → consulting detail sheet' },
    reviewedOn: REVIEWED,
    caveat: { ar: 'السطر الواحد قد يحمل عدة سجلات؛ مجموع السجلات هو 2,873.', en: 'One line can carry several records; the records sum to 2,873.' },
  },
  {
    id: 'gov-consulting-categories',
    text: { ar: 'تُصنَّف الخدمات الاستشارية في 8 فئات كما وردت في ملف المصدر.', en: 'Consulting services are classed into 8 categories as recorded in the source workbook.' },
    value: { ar: '8 فئات', en: '8 categories' },
    kind: 'official',
    confidence: 'high',
    source: { ...govWorkbooks, locator: 'services.xlsx → consulting detail sheet' },
    reviewedOn: REVIEWED,
  },
  {
    id: 'gov-strategic-pillars',
    text: { ar: 'تُنسَب الخدمات الاستشارية إلى 6 ركائز استراتيجية في ملف المصدر.', en: 'Consulting services are attributed to 6 strategic pillars in the source workbook.' },
    value: { ar: '6 ركائز', en: '6 pillars' },
    kind: 'official',
    confidence: 'high',
    source: { ...govWorkbooks, locator: 'services.xlsx → consulting detail sheet' },
    reviewedOn: REVIEWED,
    caveat: { ar: 'قد يحمل السطر الواحد أكثر من ركيزة، فمجموع الركائز يتجاوز عدد السطور.', en: 'A line can carry more than one pillar, so pillar counts exceed the number of lines.' },
  },
  // ---- cleaned directory (from the data)
  {
    id: 'gov-directory-public',
    text: {
      ar: 'يعرض الدليل العام 587 جهة قائمة بعد التنقية: حكومية وشبه حكومية ومملوكة للدولة وأهلية ودولية ورياضية؛ لا جهات خاصة ولا جهات ملغاة.',
      en: 'The public directory lists 587 active entities after cleaning: government, quasi-government, state-owned, nonprofit, international and sports bodies; no private and no abolished entities.',
    },
    value: { ar: '587', en: '587' },
    unit: { ar: 'جهة', en: 'entities' },
    kind: 'editorial',
    confidence: 'high',
    source: cleanedDirectory,
    derivation: {
      ar: 'من 682 صفًا في ملف المصدر: 6 جهات تاريخية و2 مكررتان أُخفيت، و87 جهة خاصة أُبعدت من البناء العام.',
      en: 'From 682 source rows: 6 historical and 2 duplicate entries hidden, and 87 private entities excluded from the public build.',
    },
    reviewedOn: REVIEWED,
  },
  {
    id: 'gov-directory-government',
    text: { ar: 'من جهات الدليل العام، 424 جهة حكومية بالمعنى الضيق.', en: 'Of the public directory, 424 are government entities in the strict sense.' },
    value: { ar: '424', en: '424' },
    unit: { ar: 'جهة حكومية', en: 'government entities' },
    kind: 'editorial',
    confidence: 'high',
    source: cleanedDirectory,
    derivation: { ar: 'قاعدة التصنيف: النطاق «حكومية» بعد فرز الشركات والصناديق والمنظمات الدولية والجهات الرياضية.', en: 'Classification rule: scope «government» after separating companies, funds, international organizations and sports bodies.' },
    reviewedOn: REVIEWED,
  },
  {
    id: 'gov-sectors-public',
    text: { ar: 'يعرض البناء العام 30 قطاعًا بعد إبعاد قطاع «القطاع الخاص».', en: 'The public build lists 30 sectors after setting aside the «private sector» sector.' },
    value: { ar: '30', en: '30' },
    unit: { ar: 'قطاع', en: 'sectors' },
    kind: 'editorial',
    confidence: 'high',
    source: cleanedDirectory,
    reviewedOn: REVIEWED,
  },
  {
    id: 'gov-sectors-with-aggregates',
    text: {
      ar: 'تُنشر المجاميع القطاعية لـ18 قطاعًا بلغ عدد جهاتها ذات السجلات 10 أو أكثر؛ وتُجمَّع مجاميع القطاعات الأصغر في صف واحد كي تبقى المجاميع مساوية للأرقام الوطنية.',
      en: 'Sector aggregates are published for 18 sectors with 10 or more entities with records; smaller sectors are pooled into one row so the sums still equal the national figures.',
    },
    value: { ar: '18', en: '18' },
    unit: { ar: 'قطاع', en: 'sectors' },
    kind: 'editorial',
    confidence: 'high',
    source: cleanedDirectory,
    derivation: { ar: 'قاعدة n ≥ 10 المسجلة في المنهجية.', en: 'The n ≥ 10 rule registered in the methodology.' },
    reviewedOn: REVIEWED,
  },
  {
    id: 'gov-domain-inference',
    text: {
      ar: 'مجالات التطوير المرتبطة بسجل الاستشارات استنتاج تحريري: عدد السجلات لكل فئة مقيس، وربط الفئة بالمجال وزن افتراضي معلن.',
      en: 'Development domains linked to the consulting record are an editorial inference: record counts per category are recorded, the category-to-domain link is a declared assumed weight.',
    },
    value: { ar: 'استنتاج تحريري', en: 'editorial inference' },
    kind: 'editorial',
    confidence: 'medium',
    source: cleanedDirectory,
    derivation: { ar: 'الأوزان في جدول الربط المسجل (method-category-*).', en: 'Weights in the registered mapping table (method-category-*).' },
    reviewedOn: REVIEWED,
    caveat: {
      ar: 'طلبات الاستشارات ليست قياسًا لاحتياج القوى العاملة؛ تُعرض الأعداد والفترة بلا نسب معاد تطبيعها.',
      en: 'Consulting requests are not a measure of workforce need; counts and period are shown, without renormalized percentages.',
    },
  },
]
