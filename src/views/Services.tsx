import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import { isFullMode } from '../lib/flags'
import Claim, { formatClaimDate } from '../components/Claim'
import Icon from '../components/Icon'
import { EnglishNameFallback } from '../components/EntityLogo'
import { bdi } from '../lib/format'
import { claimById } from '../data/claims'
import { consultingCategories, strategicPillars, yearlyTraining, regionStats, PARTIAL_YEAR } from '../data/govServices'
import { categoryByKey, cutoff, fixTopConsulting, label, loadSectorEntities, loadSectors, periods, pillarFromAr, regionById, regionIdFromAr, sectorById, useGovData } from '../data/gov'
import type { L } from '../data/types'

/**
 * «سجل خدمات التمكين» (packet P4): the national figures of the two source workbooks, each in its own
 * unit, the cut-off, the reconciliation with the program's live register, and the national series.
 * No composite total and no ranking. The per-entity table exists in the full build only (private demos).
 *
 * `govServices.ts` holds only the small national constants (no per-entity data, no ranking) and is the
 * one data module a view may import synchronously; everything per sector or per entity comes through
 * the fetch-based loaders.
 */

const fmt = (n: number) => n.toLocaleString('en-US')

const ui = {
  eyebrow: { ar: 'الجهات والقطاعات', en: 'Entities and sectors' },
  cutoff: { ar: 'تاريخ القطع:', en: 'Cut-off:' },
  title: { ar: 'سجل خدمات التمكين', en: 'Enablement service record' },
  ledeAr: {
    ar: 'ما قدّمه برنامج قدراتك ومنصة الاستشارات والدراسات للجهات من تدريب واستشارات، كما ورد في ملفي المصدر. كل رقم بوحدته، ولا يُجمع التدريب مع الاستشارات في رقم واحد.',
    en: 'What the two programs delivered to entities in training and consulting, as recorded in the two source workbooks. Each figure keeps its own unit; training and consulting are never added into one number.',
  },
  figures: { ar: 'الأرقام الوطنية', en: 'National figures' },
  training: { ar: 'سجل مشاركة تدريبية', en: 'Training participation records' },
  trainingNote: { ar: 'سجلات مشاركة لا أشخاص فريدون', en: 'Participation records, not unique people' },
  consulting: { ar: 'خدمة استشارية', en: 'Consulting services' },
  programs: { ar: 'برنامج تدريبي', en: 'Training programs' },
  programsNote: { ar: 'البرنامج الواحد يحضره عدة مشاركين', en: 'One program has many participants' },
  served: { ar: 'جهة مستفيدة', en: 'Entities served' },
  servedOfWhich: { ar: 'منها', en: 'of which' },
  servedGov: { ar: 'جهة حكومية أو شبه حكومية بتصنيف ملف المصدر', en: 'government or quasi-government entities by the workbook’s own classing' },
  period: { ar: 'الفترة:', en: 'Period:' },
  reconcileTitle: { ar: 'التوفيق مع سجل البرنامج الحي', en: 'Reconciliation with the program’s live register' },
  reconcileBody: {
    ar: 'الأرقام المنشورة في هذه الصفحة هي مجاميع ملفي المصدر. السجل الحي لبرنامج قدراتك أظهر عند التحقق أرقامًا مختلفة قليلًا بسبب تاريخ القطع والتصفية وإزالة التكرار:',
    en: 'The figures published on this page are the two workbooks’ totals. When verified, the program’s live register showed slightly different figures because of the cut-off date, filtering and de-duplication:',
  },
  verifiedOn: { ar: 'تاريخ التحقق:', en: 'Verified on:' },
  reconcileTraining: { ar: 'سجل تدريبي في السجل الحي', en: 'training records in the live register' },
  reconcileConsulting: { ar: 'خدمة استشارية في السجل الحي', en: 'consulting services in the live register' },
  reconcileTail: {
    ar: 'يحسم المالك الرقم المعتمد؛ وإلى ذلك الحين تبقى مجاميع ملفي المصدر هي المنشورة لاتساقها مع المجاميع القطاعية.',
    en: 'The owner decides the adopted figure; until then the workbook totals stay published because they are consistent with the sector aggregates.',
  },
  byYear: { ar: 'سجلات المشاركة التدريبية حسب السنة', en: 'Training participation records by year' },
  byYearNote: { ar: 'سنة جزئية حتى تاريخ القطع', en: 'partial year up to the cut-off' },
  yearCaption: { ar: 'سجلات المشاركة التدريبية في كل سنة، من 2021 إلى تاريخ القطع', en: 'Training participation records per year, from 2021 to the cut-off' },
  year: { ar: 'السنة', en: 'Year' },
  records: { ar: 'السجلات', en: 'Records' },
  partial: { ar: 'جزئية', en: 'partial' },
  byCategory: { ar: 'الخدمات الاستشارية حسب الفئة', en: 'Consulting services by category' },
  byCategoryNote: {
    ar: 'عدد السجلات لكل فئة كما وردت في ملف المصدر. افتح الفئة لعرض القطاعات التي طلبتها.',
    en: 'Records per category as recorded in the source workbook. Open a category to see the sectors that requested it.',
  },
  openSectors: { ar: 'القطاعات التي طلبت هذه الفئة', en: 'sectors that requested this category' },
  byPillar: { ar: 'الخدمات الاستشارية حسب الركيزة الاستراتيجية', en: 'Consulting services by strategic pillar' },
  byPillarNote: { ar: 'قد يحمل السطر الواحد أكثر من ركيزة، فمجموع الركائز يتجاوز عدد الخدمات.', en: 'A line can carry more than one pillar, so pillar counts exceed the number of services.' },
  byRegion: { ar: 'الانتشار حسب المنطقة', en: 'Coverage by region' },
  byRegionNote: { ar: 'عدد الجهات المستفيدة في كل منطقة.', en: 'Entities served in each region.' },
  entities: { ar: 'جهة', en: 'entities' },
  source: { ar: 'المصدر والمنهجية', en: 'Source and method' },
  sourceBody: {
    ar: 'ملفا المصدر: سجل خدمات التمكين، ودليل الجهات والقطاعات؛ سجلات داخلية غير منشورة. أسماء الجهات متطابقة بين الملفين. تفاصيل الاشتقاق في المنهجية وسجل الأدلة.',
    en: 'Two source workbooks: the enablement service records, and the entity and sector directory; internal, unpublished records. Entity names match across the two files. Derivation details are in the methodology and the evidence register.',
  },
  methodology: { ar: 'المنهجية', en: 'Methodology' },
  evidence: { ar: 'سجل الأدلة', en: 'Evidence register' },
  sectorsCard: { ar: 'القطاعات الحكومية', en: 'Government sectors' },
  sectorsCardBody: { ar: 'عدد الجهات في كل قطاع، والمجاميع القطاعية حيث يسمح عدد الجهات بنشرها.', en: 'Entities per sector, and sector aggregates where the entity count allows publishing them.' },
  directoryCard: { ar: 'دليل الجهات', en: 'Entity directory' },
  directoryCardBody: { ar: 'الجهات الحكومية وشبه الحكومية وبقية الأنواع، بالاسم والنوع والقطاع والمنطقة.', en: 'Government and quasi-government entities and the other types, by name, type, sector and region.' },
  open: { ar: 'افتح', en: 'Open' },
  privateDemo: { ar: 'عرض خاص', en: 'Private demo' },
  topEntities: { ar: 'أكثر الجهات استخدامًا للخدمات (عرض خاص)', en: 'Entities using the services most (private demo)' },
  topEntitiesNote: { ar: 'يظهر هذا الجدول في البناء الكامل فقط ولا يُنشر في البناء العام.', en: 'This table exists in the full build only and is never published in the public build.' },
  entity: { ar: 'الجهة', en: 'Entity' },
  sector: { ar: 'القطاع', en: 'Sector' },
  topConsulting: { ar: 'أبرز الخدمات الاستشارية', en: 'Top consulting services' },
  loadError: { ar: 'تعذّر تحميل البيانات. أعد تحميل الصفحة.', en: 'The data could not be loaded. Reload the page.' },
  loadingPrivate: { ar: 'جارٍ تحميل سجلات الجهات…', en: 'Loading entity records…' },
  noPrivate: { ar: 'ملفات التفاصيل غير مولّدة. شغّل سكربت البناء بخيار الوضع الكامل.', en: 'Detail files are not generated. Run the build script in full mode.' },
} satisfies Record<string, L>

/** English lede tail; the two program names before it are proper nouns rendered with lang="ar". */
const LEDE_EN_TAIL = ' delivered to entities in training and consulting, as recorded in the two source workbooks. Each figure keeps its own unit; training and consulting are never added into one number.'

interface BarRow {
  key: string
  label: string
  /** set to 'ar' when the label is the raw workbook string (no bilingual term found) */
  labelLang?: 'ar'
  value: number
  to?: string
  toLabel?: string
}

/** Accessible bar list: real text and counts in the DOM; the bar itself is decorative. */
function BarList({ rows, unit, ariaLabel }: { rows: BarRow[]; unit: string; ariaLabel: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="mt-4 space-y-2.5" aria-label={ariaLabel}>
      {rows.map((r) => (
        <li key={r.key} className="grid grid-cols-[minmax(0,11rem),1fr,auto] items-center gap-3 text-sm sm:grid-cols-[minmax(0,16rem),1fr,auto]">
          <span className="truncate text-dga-ink" title={r.label} lang={r.labelLang} dir={r.labelLang ? 'rtl' : undefined}>
            {r.to ? (
              <Link to={r.to} className="font-medium text-dga-green-dark underline-offset-2 hover:underline" aria-label={r.toLabel ? `${r.label}: ${r.toLabel}` : undefined}>
                {r.label}
              </Link>
            ) : (
              r.label
            )}
          </span>
          <span className="h-3 overflow-hidden rounded-pill bg-dga-bg" aria-hidden="true">
            <span className="block h-full rounded-pill bg-dga-green" style={{ width: `${Math.max((r.value / max) * 100, 1)}%` }} />
          </span>
          <span className="whitespace-nowrap text-end font-bold tabular-nums text-dga-green-deep" dir="ltr">
            {fmt(r.value)}
            <span className="sr-only"> {unit}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * A year on the chart axis or in its legend. The year and the partial-year marker sit in one left-to-right
 * isolate, so Arabic text never moves the marker to the far side («*2026»); the marker is its own element.
 */
function YearLabel({ year, partial = false }: { year: number; partial?: boolean }) {
  return bdi(
    <>
      {year}
      {partial ? (
        <span className="ms-px" aria-hidden="true">
          *
        </span>
      ) : null}
    </>
  )
}

/* ----------------------------------------------------------------- full mode */

interface UsageRow {
  id: string
  nameAr: string
  nameEn: string | null
  sectorId: string
  trainingRecords: number
  consultingServices: number
  topConsulting: string | null
}

/** Full build only: every sector's detail file, flattened; null when the files were not generated. */
async function loadUsageRows(): Promise<UsageRow[] | null> {
  const file = await loadSectors()
  const lists = await Promise.all(file.sectors.filter((s) => !s.pooled).map((s) => loadSectorEntities(s.id)))
  if (lists.every((l) => l === null)) return null
  const rows: UsageRow[] = []
  for (const list of lists) {
    for (const e of list ?? []) {
      if (!e.services) continue
      rows.push({
        id: e.id,
        nameAr: e.nameAr,
        nameEn: e.nameEn,
        sectorId: e.sectorId,
        trainingRecords: e.services.trainingRecords,
        consultingServices: e.services.consultingServices,
        topConsulting: fixTopConsulting(e.services.topConsulting),
      })
    }
  }
  return rows.sort((a, b) => b.trainingRecords - a.trainingRecords || b.consultingServices - a.consultingServices).slice(0, 20)
}

function PrivateUsageTable() {
  const { t, lang } = useApp()
  const { data, error, loading } = useGovData(loadUsageRows, 'services:usage')
  return (
    <section className="glass mt-6 border-s-4 border-dga-amber p-6" aria-labelledby="services-private">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="services-private" className="text-lg font-bold text-dga-green-dark">
          {t(ui.topEntities)}
        </h2>
        <span className="chip border-dga-amber/60 bg-amber-50 text-dga-amber-tx">{t(ui.privateDemo)}</span>
      </div>
      <p className="mt-1 text-xs text-dga-muted">{t(ui.topEntitiesNote)}</p>
      {loading ? (
        <p className="mt-4 text-sm text-dga-muted" role="status">
          {t(ui.loadingPrivate)}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-dga-amber-tx" role="alert">
          {t(ui.loadError)}
        </p>
      ) : null}
      {!loading && !error && data === null ? <p className="mt-4 text-sm text-dga-muted">{t(ui.noPrivate)}</p> : null}
      {data && data.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-dga-muted">
                <th scope="col" className="py-2 text-start font-semibold">{t(ui.entity)}</th>
                <th scope="col" className="py-2 text-start font-semibold">{t(ui.sector)}</th>
                <th scope="col" className="py-2 text-end font-semibold">{t(ui.training)}</th>
                <th scope="col" className="py-2 text-end font-semibold">{t(ui.consulting)}</th>
                <th scope="col" className="py-2 text-start font-semibold">{t(ui.topConsulting)}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-t border-dga-line align-top">
                  <td className="py-2 pe-3">
                    <Link to={pathFor('entity', lang, { entityId: r.id })} className="font-semibold text-dga-green-dark hover:underline">
                      <span lang="ar" dir="rtl">{r.nameAr}</span>
                    </Link>
                    {r.nameEn ? (
                      <span className="block text-[11px] text-dga-muted" lang="en" dir="ltr">
                        {r.nameEn}
                      </span>
                    ) : null}
                    <EnglishNameFallback lang={lang} nameEn={r.nameEn} />
                  </td>
                  <td className="py-2 pe-3 text-dga-ink">{label(sectorById(r.sectorId), lang, r.sectorId)}</td>
                  <td className="py-2 pe-3 text-end tabular-nums" dir="ltr">{fmt(r.trainingRecords)}</td>
                  <td className="py-2 pe-3 text-end tabular-nums" dir="ltr">{fmt(r.consultingServices)}</td>
                  <td className="py-2 text-xs text-dga-muted">{r.topConsulting ? <span lang="ar" dir="rtl">{r.topConsulting}</span> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

/* ------------------------------------------------------------------- view */

export default function Services() {
  const { t, lang } = useApp()
  const full = isFullMode()
  const registerDate = claimById('method-gov-training-register')?.period

  const categoryRows: BarRow[] = consultingCategories.map((c) => {
    const term = categoryByKey(c.category)
    return {
      key: c.category,
      label: term ? label(term, lang) : c.category,
      labelLang: term ? undefined : 'ar',
      value: c.recordCount,
      to: term ? pathFor('sectors', lang, { category: term.id }) : undefined,
      toLabel: t(ui.openSectors),
    }
  })
  const pillarRows: BarRow[] = strategicPillars.map((p) => {
    const term = pillarFromAr(p.pillar)
    return { key: p.pillar, label: label(term, lang, p.pillar), labelLang: term ? undefined : 'ar', value: p.recordCount }
  })
  const regionRows: BarRow[] = regionStats.map((r) => {
    const id = regionIdFromAr(r.region)
    const term = id ? regionById(id) : undefined
    return { key: r.region, label: label(term, lang, r.region), labelLang: term ? undefined : 'ar', value: r.entities }
  })
  const maxYear = Math.max(1, ...yearlyTraining.map((y) => y.records))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t(ui.title)}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {lang === 'ar' ? (
            ui.ledeAr.ar
          ) : (
            <>
              What <span lang="ar" dir="rtl">برنامج قدراتك</span> and <span lang="ar" dir="rtl">منصة الاستشارات والدراسات</span>
              {LEDE_EN_TAIL}
            </>
          )}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-dga-ink">
          <span className="font-semibold">{t(ui.cutoff)}</span>
          <Claim id="gov-cutoff">
            <span className="font-semibold">{t(cutoff)}</span>
          </Claim>
        </p>
      </div>

      {/* national figures, separate units */}
      <section aria-labelledby="services-figures">
        <h2 id="services-figures" className="sr-only">
          {t(ui.figures)}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass p-5">
            <p className="text-3xl font-bold text-dga-green-deep">
              <Claim id="method-gov-training-sheet" />
            </p>
            <p className="mt-2 text-sm font-semibold text-dga-black">{t(ui.training)}</p>
            <p className="mt-1 text-[11px] leading-snug text-dga-muted">
              {t(ui.period)} {t(periods.training)} · {t(ui.trainingNote)}
            </p>
          </div>
          <div className="glass p-5">
            <p className="text-3xl font-bold text-dga-green-deep">
              <Claim id="method-gov-consulting-sheet" />
            </p>
            <p className="mt-2 text-sm font-semibold text-dga-black">{t(ui.consulting)}</p>
            <p className="mt-1 text-[11px] leading-snug text-dga-muted">
              {t(ui.period)} {t(periods.consulting)}
            </p>
          </div>
          <div className="glass p-5">
            <p className="text-3xl font-bold text-dga-green-deep">
              <Claim id="gov-training-programs" />
            </p>
            <p className="mt-2 text-sm font-semibold text-dga-black">{t(ui.programs)}</p>
            <p className="mt-1 text-[11px] leading-snug text-dga-muted">{t(ui.programsNote)}</p>
          </div>
          <div className="glass p-5">
            <p className="text-3xl font-bold text-dga-green-deep">
              <Claim id="gov-entities-served" />
            </p>
            <p className="mt-2 text-sm font-semibold text-dga-black">{t(ui.served)}</p>
            <p className="mt-1 text-[11px] leading-snug text-dga-muted">
              {t(ui.servedOfWhich)} <Claim id="gov-entities-served-gov" /> {t(ui.servedGov)}
            </p>
          </div>
        </div>
      </section>

      {/* reconciliation */}
      <section className="glass mt-6 border-s-4 border-dga-amber p-6" aria-labelledby="services-reconcile">
        <h2 id="services-reconcile" className="flex items-center gap-2 text-base font-bold text-dga-black">
          <Icon name="scale" className="h-5 w-5 text-dga-amber-tx" />
          {t(ui.reconcileTitle)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(ui.reconcileBody)}</p>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <li className="rounded-btn bg-dga-bg px-3 py-2">
            <Claim id="method-gov-training-register" /> {t(ui.reconcileTraining)}
          </li>
          <li className="rounded-btn bg-dga-bg px-3 py-2">
            <Claim id="method-gov-consulting-register" /> {t(ui.reconcileConsulting)}
          </li>
        </ul>
        {registerDate ? (
          <p className="mt-2 text-xs text-dga-muted">
            {t(ui.verifiedOn)} <time dateTime={registerDate}>{formatClaimDate(registerDate, lang)}</time>
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-dga-muted">{t(ui.reconcileTail)}</p>
      </section>

      {/* training by year */}
      <section className="glass mt-6 p-6" aria-labelledby="services-years">
        <h2 id="services-years" className="text-lg font-bold text-dga-green-dark">
          {t(ui.byYear)}
        </h2>
        <p className="mt-1 text-xs text-dga-muted">
          <YearLabel year={PARTIAL_YEAR} partial />: {t(ui.byYearNote)}
        </p>
        <div className="mt-5 flex h-48 items-end gap-3 sm:gap-5" aria-hidden="true">
          {yearlyTraining.map((y) => {
            const partial = y.year === PARTIAL_YEAR
            return (
              <div key={y.year} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className={`text-xs font-bold tabular-nums ${partial ? 'text-dga-amber-tx' : 'text-dga-green-deep'}`} dir="ltr">
                  {fmt(y.records)}
                </span>
                <span className={`w-full max-w-[3.5rem] rounded-t-md ${partial ? 'bg-dga-amber' : 'bg-dga-green'}`} style={{ height: `${Math.max((y.records / maxYear) * 80, 2)}%` }} />
                <span className="text-xs text-dga-muted">
                  <YearLabel year={y.year} partial={partial} />
                </span>
              </div>
            )
          })}
        </div>
        <table className="mt-5 w-full max-w-md text-sm">
          <caption className="text-start text-xs text-dga-muted">{t(ui.yearCaption)}</caption>
          <thead>
            <tr>
              <th scope="col" className="py-1.5 text-start font-semibold text-dga-muted">{t(ui.year)}</th>
              <th scope="col" className="py-1.5 text-end font-semibold text-dga-muted">{t(ui.records)}</th>
            </tr>
          </thead>
          <tbody>
            {yearlyTraining.map((y) => (
              <tr key={y.year} className="border-t border-dga-line">
                <th scope="row" className="py-1.5 text-start font-medium text-dga-ink">
                  {bdi(y.year)}
                  {y.year === PARTIAL_YEAR ? <span className="ms-2 text-[11px] text-dga-amber-tx">({t(ui.partial)})</span> : null}
                </th>
                <td className="py-1.5 text-end tabular-nums" dir="ltr">{fmt(y.records)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* consulting categories */}
        <section className="glass p-6" aria-labelledby="services-categories">
          <h2 id="services-categories" className="text-lg font-bold text-dga-green-dark">
            {t(ui.byCategory)}
          </h2>
          <p className="mt-1 text-xs text-dga-muted">
            <Claim id="gov-consulting-categories" bare /> · {t(ui.byCategoryNote)}
          </p>
          <BarList rows={categoryRows} unit={t(ui.consulting)} ariaLabel={t(ui.byCategory)} />
        </section>

        {/* strategic pillars */}
        <section className="glass p-6" aria-labelledby="services-pillars">
          <h2 id="services-pillars" className="text-lg font-bold text-dga-green-dark">
            {t(ui.byPillar)}
          </h2>
          <p className="mt-1 text-xs text-dga-muted">
            <Claim id="gov-strategic-pillars" bare /> · {t(ui.byPillarNote)}
          </p>
          <BarList rows={pillarRows} unit={t(ui.consulting)} ariaLabel={t(ui.byPillar)} />
        </section>
      </div>

      {/* regions */}
      <section className="glass mt-6 p-6" aria-labelledby="services-regions">
        <h2 id="services-regions" className="text-lg font-bold text-dga-green-dark">
          {t(ui.byRegion)}
        </h2>
        <p className="mt-1 text-xs text-dga-muted">{t(ui.byRegionNote)}</p>
        <BarList rows={regionRows} unit={t(ui.entities)} ariaLabel={t(ui.byRegion)} />
      </section>

      {full ? <PrivateUsageTable /> : null}

      {/* source */}
      <section className="glass mt-6 p-6" aria-labelledby="services-source">
        <h2 id="services-source" className="flex items-center gap-2 text-base font-bold text-dga-black">
          <Icon name="shield" className="h-5 w-5 text-dga-green" />
          {t(ui.source)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(ui.sourceBody)}</p>
        <p className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to={pathFor('methodology', lang)} className="text-dga-green-dark underline underline-offset-2">
            {t(ui.methodology)}
          </Link>
          <Link to={pathFor('evidence', lang)} className="text-dga-green-dark underline underline-offset-2">
            {t(ui.evidence)}
          </Link>
        </p>
      </section>

      {/* cross-links */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Link to={pathFor('sectors', lang)} className="glass-strong group block p-6 text-start transition-shadow hover:shadow-card-lg">
          <Icon name="flag" className="h-7 w-7 text-dga-green" />
          <h3 className="mt-3 text-lg font-bold text-dga-black">{t(ui.sectorsCard)}</h3>
          <p className="mt-1 text-sm text-dga-muted">{t(ui.sectorsCardBody)}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-dga-green-dark group-hover:underline">
            {t(ui.open)} {lang === 'ar' ? '←' : '→'}
          </span>
        </Link>
        <Link to={pathFor('directory', lang)} className="glass-strong group block p-6 text-start transition-shadow hover:shadow-card-lg">
          <Icon name="compass" className="h-7 w-7 text-dga-green" />
          <h3 className="mt-3 text-lg font-bold text-dga-black">{t(ui.directoryCard)}</h3>
          <p className="mt-1 text-sm text-dga-muted">{t(ui.directoryCardBody)}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-dga-green-dark group-hover:underline">
            {t(ui.open)} {lang === 'ar' ? '←' : '→'}
          </span>
        </Link>
      </div>
    </div>
  )
}
