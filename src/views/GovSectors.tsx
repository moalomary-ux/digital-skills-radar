import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import Claim from '../components/Claim'
import Icon from '../components/Icon'
import { DEFAULT_DIRECTORY_TYPES, NON_GOVERNMENT_SECTOR_IDS, categoryById, categoryByKey, label, loadEntitiesIndex, loadSectors, periods, sectorById, useGovData } from '../data/gov'
import type { CategoryTerm, EntityIndexRow, SectorAggregate } from '../data/gov'
import type { L } from '../data/types'

/**
 * Government sectors (packet P4): the cleaned sectors only, ordered by their government and
 * quasi-government entity count. A sector with no government or quasi-government entity at all (for
 * example the state-owned companies) is not listed here; its brief stays reachable from the directory
 * and the entity pages. Aggregates appear only for sectors that pass the n ≥ 10 rule; every card links
 * to the printable sector brief. No logo coverage, no served ratio, no top entities, no renormalized
 * «most requested skills» shares.
 */

const fmt = (n: number) => n.toLocaleString('en-US')

const ui = {
  eyebrow: { ar: 'الجهات والقطاعات', en: 'Entities and sectors' },
  title: { ar: 'القطاعات الحكومية', en: 'Government sectors' },
  lede: {
    ar: 'القطاعات كما وردت في دليل الجهات بعد التنقية، مع عدد الجهات الحكومية وشبه الحكومية في كل قطاع. المجاميع القطاعية من سجل خدمات التمكين تُنشر فقط حيث يسمح عدد الجهات بذلك.',
    en: 'The sectors of the cleaned entity directory, with the number of government and quasi-government entities in each. Sector aggregates from the enablement service record are published only where the entity count allows it.',
  },
  sectorsCount: { ar: 'قطاعًا في البناء العام', en: 'sectors in the public build' },
  listedCount: { ar: 'قطاعًا منها فيه جهات حكومية أو شبه حكومية، وهي المعروضة هنا', en: 'of them have government or quasi-government entities and are listed here' },
  directoryCount: { ar: 'جهة في الدليل', en: 'entities in the directory' },
  govCount: { ar: 'جهة حكومية بالمعنى الضيق', en: 'government entities in the strict sense' },
  withAggregates: { ar: 'قطاعًا بمجاميع منشورة', en: 'sectors with published aggregates' },
  govEntities: { ar: 'جهة حكومية وشبه حكومية', en: 'government and quasi-government entities' },
  allEntities: { ar: 'جهة في الدليل', en: 'entities in the directory' },
  withRecords: { ar: 'جهة لها سجلات', en: 'entities with records' },
  training: { ar: 'سجل مشاركة تدريبية', en: 'training participation records' },
  consulting: { ar: 'خدمة استشارية', en: 'consulting services' },
  withheld: { ar: 'المجاميع تُعرض للقطاعات التي فيها 10 جهات ذات سجلات أو أكثر', en: 'Aggregates are shown for sectors with 10 or more entities with records' },
  rule: { ar: 'القاعدة:', en: 'Rule:' },
  openBrief: { ar: 'افتح موجز القطاع', en: 'Open the sector brief' },
  focusTitle: { ar: 'القطاعات التي طلبت فئة', en: 'Sectors that requested the category' },
  focusNote: {
    ar: 'عدد سجلات الاستشارات في هذه الفئة لكل قطاع ينشر مجاميعه، بلا ترتيب تفضيلي. الفترة:',
    en: 'Consulting records in this category for every sector that publishes aggregates, with no preferential ranking. Period:',
  },
  focusUnknown: { ar: 'الفئة المطلوبة غير معروفة.', en: 'The requested category is unknown.' },
  focusEmpty: { ar: 'لا قطاع ينشر مجاميعه له سجلات في هذه الفئة.', en: 'No sector that publishes aggregates has records in this category.' },
  records: { ar: 'سجل', en: 'records' },
  clearFocus: { ar: 'إلغاء التركيز على الفئة', en: 'Clear the category focus' },
  loading: { ar: 'جارٍ تحميل القطاعات…', en: 'Loading sectors…' },
  loadError: { ar: 'تعذّر تحميل بيانات القطاعات. أعد تحميل الصفحة.', en: 'Sector data could not be loaded. Reload the page.' },
  services: { ar: 'سجل خدمات التمكين', en: 'Enablement service record' },
  directory: { ar: 'دليل الجهات', en: 'Entity directory' },
} satisfies Record<string, L>

const GOV_TYPES = new Set<string>(DEFAULT_DIRECTORY_TYPES)

/** Government + quasi-government entities per sector, from the public index. */
function govCountsBySector(index: EntityIndexRow[] | null): Map<string, number> {
  const out = new Map<string, number>()
  for (const e of index ?? []) if (GOV_TYPES.has(e.type)) out.set(e.sectorId, (out.get(e.sectorId) ?? 0) + 1)
  return out
}

function resolveCategory(raw: string | null): CategoryTerm | null | undefined {
  if (!raw) return null
  return categoryById(raw) ?? categoryByKey(raw)
}

export default function GovSectors() {
  const { t, lang, pendingSectorCategory, clearPendingSectorCategory } = useApp()
  const sectorsState = useGovData(loadSectors)
  const indexState = useGovData(loadEntitiesIndex)

  const govCounts = useMemo(() => govCountsBySector(indexState.data), [indexState.data])

  const listed = useMemo(() => {
    const rows = (sectorsState.data?.sectors ?? []).filter((s) => !s.pooled && !NON_GOVERNMENT_SECTOR_IDS.includes(s.id) && sectorById(s.id))
    return rows
      .map((s) => ({ sector: s, govCount: govCounts.get(s.id) ?? 0 }))
      .filter((r) => r.govCount > 0)
      .sort((a, b) => b.govCount - a.govCount || b.sector.entityCount - a.sector.entityCount || a.sector.id.localeCompare(b.sector.id))
  }, [sectorsState.data, govCounts])

  const focus = resolveCategory(pendingSectorCategory)
  const focusRows = useMemo(() => {
    if (!focus) return []
    return listed
      .filter(({ sector }) => sector.showAggregates && sector.categories)
      .map(({ sector }) => ({ sector, records: sector.categories?.[focus.key] ?? 0 }))
      .filter((r) => r.records > 0)
      .sort((a, b) => b.records - a.records)
  }, [listed, focus])

  const loading = sectorsState.loading || indexState.loading
  const error = sectorsState.error ?? indexState.error

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t(ui.title)}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">{t(ui.lede)}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-dga-ink">
          <li>
            <Claim id="gov-sectors-public" /> {t(ui.sectorsCount)}
          </li>
          {!loading && !error ? (
            <li>
              <span className="font-semibold tabular-nums" dir="ltr">
                {fmt(listed.length)}
              </span>{' '}
              {t(ui.listedCount)}
            </li>
          ) : null}
          <li>
            <Claim id="gov-sectors-with-aggregates" /> {t(ui.withAggregates)}
          </li>
          <li>
            <Claim id="gov-directory-public" /> {t(ui.directoryCount)}
          </li>
          <li>
            <Claim id="gov-directory-government" /> {t(ui.govCount)}
          </li>
        </ul>
      </div>

      {/* category focus (arriving from the service record) */}
      {pendingSectorCategory ? (
        <section className="glass mb-8 border-s-4 border-dga-green p-5" aria-labelledby="sectors-focus">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="sectors-focus" className="text-base font-bold text-dga-green-dark">
                {t(ui.focusTitle)}
                {focus ? <>: {label(focus, lang)}</> : null}
              </h2>
              <p className="mt-1 text-xs text-dga-muted">
                {focus ? (
                  <>
                    {t(ui.focusNote)} {t(periods.consulting)}
                  </>
                ) : (
                  t(ui.focusUnknown)
                )}
              </p>
            </div>
            <button type="button" onClick={clearPendingSectorCategory} className="btn-ghost px-3 py-1.5 text-xs">
              {t(ui.clearFocus)}
            </button>
          </div>
          {focus && !loading ? (
            focusRows.length > 0 ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {focusRows.map(({ sector, records }) => (
                  <li key={sector.id} className="flex items-center justify-between gap-3 rounded-btn bg-dga-bg px-3 py-2 text-sm">
                    <Link to={pathFor('sector', lang, { sectorId: sector.id })} className="font-medium text-dga-green-dark hover:underline">
                      {label(sectorById(sector.id), lang, sector.id)}
                    </Link>
                    <span className="whitespace-nowrap tabular-nums text-dga-ink" dir="ltr">
                      <span className="font-bold">{fmt(records)}</span> <span className="text-xs text-dga-muted">{t(ui.records)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-dga-muted">{t(ui.focusEmpty)}</p>
            )
          ) : null}
        </section>
      ) : null}

      {loading ? (
        <p className="glass p-8 text-center text-sm text-dga-muted" role="status">
          {t(ui.loading)}
        </p>
      ) : null}
      {error ? (
        <p className="glass p-8 text-center text-sm text-dga-amber-tx" role="alert">
          {t(ui.loadError)}
        </p>
      ) : null}

      {/* sector cards */}
      {!loading && !error ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listed.map(({ sector, govCount }) => (
            <li key={sector.id}>
              <SectorCard sector={sector} govCount={govCount} />
            </li>
          ))}
        </ul>
      ) : null}

      {/* cross-links */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to={pathFor('services', lang)} className="btn-ghost text-sm">
          <Icon name="radar" className="h-4 w-4" />
          {t(ui.services)}
        </Link>
        <Link to={pathFor('directory', lang)} className="btn-ghost text-sm">
          <Icon name="compass" className="h-4 w-4" />
          {t(ui.directory)}
        </Link>
      </div>
    </div>
  )
}

function SectorCard({ sector, govCount }: { sector: SectorAggregate; govCount: number }) {
  const { t, lang } = useApp()
  const term = sectorById(sector.id)
  const to = pathFor('sector', lang, { sectorId: sector.id })
  return (
    <article className="glass flex h-full flex-col p-5 transition-shadow focus-within:shadow-card-lg hover:shadow-card-lg">
      <h2 className="text-base font-bold text-dga-black">
        <Link to={to} className="hover:text-dga-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green">
          {label(term, lang, sector.id)}
        </Link>
      </h2>
      <p className="mt-3 text-sm text-dga-ink">
        <span className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
          {fmt(govCount)}
        </span>{' '}
        {t(ui.govEntities)}
      </p>
      {sector.entityCount !== govCount ? (
        <p className="mt-0.5 text-xs text-dga-muted">
          <span className="tabular-nums" dir="ltr">
            {fmt(sector.entityCount)}
          </span>{' '}
          {t(ui.allEntities)}
        </p>
      ) : null}
      {sector.showAggregates && sector.training !== null && sector.consulting !== null ? (
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-dga-line pt-3 text-xs text-dga-muted">
          <div>
            <dd className="text-base font-bold tabular-nums text-dga-green-dark" dir="ltr">
              {fmt(sector.entitiesWithRecords)}
            </dd>
            <dt>{t(ui.withRecords)}</dt>
          </div>
          <div>
            <dd className="text-base font-bold tabular-nums text-dga-green-dark" dir="ltr">
              {fmt(sector.training)}
            </dd>
            <dt>{t(ui.training)}</dt>
          </div>
          <div>
            <dd className="text-base font-bold tabular-nums text-dga-green-dark" dir="ltr">
              {fmt(sector.consulting)}
            </dd>
            <dt>{t(ui.consulting)}</dt>
          </div>
        </dl>
      ) : (
        <p className="mt-4 border-t border-dga-line pt-3 text-xs leading-relaxed text-dga-muted">
          {t(ui.withheld)} ({t(ui.rule)} <Claim id="method-gov-sector-min" />)
        </p>
      )}
      <Link to={to} className="mt-auto inline-block pt-4 text-sm font-semibold text-dga-green-dark hover:underline" aria-label={`${t(ui.openBrief)}: ${label(term, lang, sector.id)}`}>
        {t(ui.openBrief)} {lang === 'ar' ? '←' : '→'}
      </Link>
    </article>
  )
}
