// AUTO-GENERATED from inbox/services.xlsx — do not hand-edit
// DGA service-delivery KPIs, consulting taxonomy, yearly training series, region stats
// NOTE: المنهجية prose mentions 7,935 training / 2,918 consulting records;
// the workbook الملخص and all sheet totals (verified by recomputation) are 7,915 / 2,873.

export interface GovServiceKpis {
  servedEntities: number
  govQuasiEntities: number
  trainingRecords: number
  consultingServices: number
  trainingEntities: number
  consultingEntities: number
  bothTracksEntities: number
  trainingPrograms: number
  totalBenefit: number
  trainingPeriod: string
  consultingPeriod: string
}

export interface ConsultingCategory {
  category: string
  lineCount: number
  recordCount: number
}

export interface StrategicPillar {
  pillar: string
  lineCount: number
  recordCount: number
}

export interface YearlyTraining {
  year: number
  records: number
}

export interface RegionStat {
  region: string
  entities: number
  trainingBeneficiaries: number
  consultingServices: number
}

export interface TopEntity {
  rank: number
  name: string
  sector: string
  region: string
  trainingBeneficiaries: number
  trainingPrograms: number
  consultingServices: number
  totalBenefit: number
  entityId: string | null
}

export const govServiceKpis: GovServiceKpis = {
  servedEntities: 421,
  govQuasiEntities: 370,
  trainingRecords: 7915,
  consultingServices: 2873,
  trainingEntities: 322,
  consultingEntities: 372,
  bothTracksEntities: 273,
  trainingPrograms: 377,
  totalBenefit: 10788,
  trainingPeriod: '2021 إلى 2026',
  consultingPeriod: '2023 إلى نهاية الربع الثالث 2026',
}

export const consultingCategories: ConsultingCategory[] = [
  { category: '2. تخطيط وتمكين البنية التقنية', lineCount: 625, recordCount: 1512 },
  { category: '1. الاستراتيجيات الرقمية', lineCount: 298, recordCount: 362 },
  { category: '4. التميز المؤسسي واستمرارية الأعمال', lineCount: 216, recordCount: 244 },
  { category: '6. البيانات والتكامل', lineCount: 159, recordCount: 291 },
  { category: '7. مؤشرات الأداء الرقمي', lineCount: 92, recordCount: 155 },
  { category: '3. الابتكار والتقنيات الناشئة', lineCount: 83, recordCount: 118 },
  { category: '5. الاستثمار والخدمات الرقمية', lineCount: 80, recordCount: 108 },
  { category: '8. التميز والتنافسية', lineCount: 44, recordCount: 83 },
]

export const strategicPillars: StrategicPillar[] = [
  { pillar: 'تسريع التحول', lineCount: 919, recordCount: 1356 },
  { pillar: 'رضا المستفيدين', lineCount: 333, recordCount: 734 },
  { pillar: 'البيئة التنظيمية', lineCount: 271, recordCount: 439 },
  { pillar: 'حكومة فعّالة', lineCount: 259, recordCount: 676 },
  { pillar: 'تمكين الأعمال', lineCount: 218, recordCount: 476 },
  { pillar: 'كفاءة الاستثمار', lineCount: 27, recordCount: 36 },
]

export const yearlyTraining: YearlyTraining[] = [
  { year: 2021, records: 179 },
  { year: 2022, records: 806 },
  { year: 2023, records: 1288 },
  { year: 2024, records: 1326 },
  { year: 2025, records: 2462 },
  { year: 2026, records: 1854 },
]

export const regionStats: RegionStat[] = [
  { region: 'منطقة الرياض', entities: 288, trainingBeneficiaries: 6567, consultingServices: 2238 },
  { region: 'منطقة مكة المكرمة', entities: 21, trainingBeneficiaries: 418, consultingServices: 126 },
  { region: 'المنطقة الشرقية', entities: 18, trainingBeneficiaries: 324, consultingServices: 120 },
  { region: 'منطقة المدينة المنورة', entities: 11, trainingBeneficiaries: 170, consultingServices: 64 },
  { region: 'منطقة عسير', entities: 6, trainingBeneficiaries: 125, consultingServices: 81 },
  { region: 'منطقة القصيم', entities: 4, trainingBeneficiaries: 73, consultingServices: 34 },
  { region: 'منطقة حائل', entities: 4, trainingBeneficiaries: 29, consultingServices: 21 },
  { region: 'منطقة جازان', entities: 5, trainingBeneficiaries: 33, consultingServices: 19 },
  { region: 'منطقة تبوك', entities: 3, trainingBeneficiaries: 64, consultingServices: 13 },
  { region: 'منطقة الجوف', entities: 4, trainingBeneficiaries: 26, consultingServices: 13 },
  { region: 'منطقة نجران', entities: 3, trainingBeneficiaries: 37, consultingServices: 23 },
  { region: 'منطقة الباحة', entities: 4, trainingBeneficiaries: 30, consultingServices: 23 },
  { region: 'منطقة الحدود الشمالية', entities: 3, trainingBeneficiaries: 19, consultingServices: 17 },
  { region: 'غير محدد', entities: 47, trainingBeneficiaries: 0, consultingServices: 81 },
]

export const topEntitiesByBenefit: TopEntity[] = [
  {
    rank: 1,
    name: 'المؤسسة العامة للتدريب التقني والمهني',
    sector: 'التعليم العام والتدريب',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 437,
    trainingPrograms: 68,
    consultingServices: 7,
    totalBenefit: 444,
    entityId: 'ent-0282',
  },
  {
    rank: 2,
    name: 'وزارة الصحة',
    sector: 'الصحة',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 208,
    trainingPrograms: 105,
    consultingServices: 37,
    totalBenefit: 245,
    entityId: 'ent-0238',
  },
  {
    rank: 3,
    name: 'وزارة النقل والخدمات اللوجستية',
    sector: 'النقل والخدمات اللوجستية',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 133,
    trainingPrograms: 86,
    consultingServices: 29,
    totalBenefit: 162,
    entityId: 'ent-0204',
  },
  {
    rank: 4,
    name: 'وزارة المالية',
    sector: 'المالية والاستثمار الحكومي',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 151,
    trainingPrograms: 74,
    consultingServices: 11,
    totalBenefit: 162,
    entityId: 'ent-0117',
  },
  {
    rank: 5,
    name: 'وزارة العدل',
    sector: 'العدل والقضاء',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 125,
    trainingPrograms: 94,
    consultingServices: 33,
    totalBenefit: 158,
    entityId: 'ent-0104',
  },
  {
    rank: 6,
    name: 'هيئة الحكومة الرقمية',
    sector: 'الاتصالات وتقنية المعلومات والفضاء',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 129,
    trainingPrograms: 76,
    consultingServices: 6,
    totalBenefit: 135,
    entityId: 'ent-0179',
  },
  {
    rank: 7,
    name: 'صندوق تنمية الموارد البشرية',
    sector: 'العمل والتنمية الاجتماعية',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 89,
    trainingPrograms: 77,
    consultingServices: 45,
    totalBenefit: 134,
    entityId: 'ent-0335',
  },
  {
    rank: 8,
    name: 'وزارة التعليم',
    sector: 'التعليم العام والتدريب',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 95,
    trainingPrograms: 75,
    consultingServices: 27,
    totalBenefit: 122,
    entityId: 'ent-0283',
  },
  {
    rank: 9,
    name: 'الهيئة السعودية للبيانات والذكاء الاصطناعي',
    sector: 'الاتصالات وتقنية المعلومات والفضاء',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 59,
    trainingPrograms: 54,
    consultingServices: 61,
    totalBenefit: 120,
    entityId: 'ent-0180',
  },
  {
    rank: 10,
    name: 'وزارة الداخلية',
    sector: 'الداخلية والأمن',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 88,
    trainingPrograms: 72,
    consultingServices: 16,
    totalBenefit: 104,
    entityId: 'ent-0064',
  },
  {
    rank: 11,
    name: 'الشؤون الصحية بوزارة الحرس الوطني',
    sector: 'الصحة',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 64,
    trainingPrograms: 47,
    consultingServices: 39,
    totalBenefit: 103,
    entityId: 'ent-0239',
  },
  {
    rank: 12,
    name: 'هيئة الزكاة والضريبة والجمارك',
    sector: 'المالية والاستثمار الحكومي',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 55,
    trainingPrograms: 45,
    consultingServices: 45,
    totalBenefit: 100,
    entityId: 'ent-0118',
  },
  {
    rank: 13,
    name: 'وزارة الموارد البشرية والتنمية الاجتماعية',
    sector: 'العمل والتنمية الاجتماعية',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 46,
    trainingPrograms: 35,
    consultingServices: 53,
    totalBenefit: 99,
    entityId: 'ent-0336',
  },
  {
    rank: 14,
    name: 'جامعة الإمام عبدالرحمن بن فيصل',
    sector: 'التعليم العالي والجامعات',
    region: 'المنطقة الشرقية',
    trainingBeneficiaries: 89,
    trainingPrograms: 31,
    consultingServices: 9,
    totalBenefit: 98,
    entityId: 'ent-0292',
  },
  {
    rank: 15,
    name: 'وزارة الدفاع',
    sector: 'الدفاع والحرس الوطني',
    region: 'منطقة الرياض',
    trainingBeneficiaries: 86,
    trainingPrograms: 65,
    consultingServices: 10,
    totalBenefit: 96,
    entityId: 'ent-0092',
  },
]
