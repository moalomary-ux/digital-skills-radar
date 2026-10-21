// National figures of the enablement service record (packet P4), from services.xlsx (الملخص and the sheet
// totals, recomputed): KPIs, consulting categories, strategic pillars, yearly training series, region stats.
// The methodology prose of the workbook says 7,935 / 2,918; the sheets sum to 7,915 / 2,873 and the program's
// live register showed 7,891 / 2,918 on 2026-10-18 (claims method-gov-*). This file is small and may be
// imported synchronously (Home, Services); it carries no per-entity data and no ranking.

import type { L } from './types'

export interface GovServiceKpis {
  servedEntities: number
  govQuasiEntities: number
  trainingRecords: number
  consultingServices: number
  trainingEntities: number
  consultingEntities: number
  bothTracksEntities: number
  trainingPrograms: number
  /** @deprecated P4-SHIM(p2): composite of two units (forbidden in the UI); removed with the old Impact view */
  totalBenefit: number
  /** Arabic period strings as written in the workbook; bilingual versions in `govServicePeriods` */
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

/** @deprecated P4-SHIM(p2): rankings are forbidden; type kept only until the old Impact view is replaced */
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

/** @deprecated P4-SHIM(p2): the «أعلى 10» ranking was removed (DECISION §2 row 5); always empty. */
export const topEntitiesByBenefit: TopEntity[] = []

/* ----------------------------------------------------------- P4 constants */

/** Cut-off of both source workbooks, shown next to every national figure. */
export const govServiceCutoff: L = {
  ar: 'ملفا المصدر حتى نهاية الربع الثالث 2026',
  en: 'Both source workbooks up to the end of Q3 2026',
}

export const govServicePeriods: { training: L; consulting: L } = {
  training: { ar: '2021 إلى 2026', en: '2021 to 2026' },
  consulting: { ar: '2023 إلى نهاية الربع الثالث 2026', en: '2023 to the end of Q3 2026' },
}

/** Reconciliation with the program's live register (claims method-gov-training-register / -consulting-register). */
export const govServiceReconciliation = {
  trainingRegister: 7891,
  consultingRegister: 2918,
  verifiedOn: '2026-10-18',
} as const

/** The partial year in the training series (figures up to the cut-off). */
export const PARTIAL_YEAR = 2026
