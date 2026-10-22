import { useEffect, useId, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import { isFullMode } from '../lib/flags'
import Claim from '../components/Claim'
import EntityLogo, { EnglishNameFallback } from '../components/EntityLogo'
import { DEFAULT_DIRECTORY_TYPES, ENTITY_TYPES, entityTypeById, label, loadEntitiesIndex, regionById, regions, sectorById, sectors, useGovData } from '../data/gov'
import type { EntityIndexRow, EntityType } from '../data/gov'
import type { L } from '../data/types'

/**
 * Entity directory (packet P4): the public index only (id, names, sector, type, region). Government
 * and quasi-government types are selected by default; the type filter is a group of toggle buttons;
 * every card is a real link. No logos, no service records and no «served / not served» labels in the
 * public build; the monogram appears in the full build only.
 */

const fmt = (n: number) => n.toLocaleString('en-US')
const PAGE_SIZE = 48

const ui = {
  eyebrow: { ar: 'الجهات والقطاعات', en: 'Entities and sectors' },
  title: { ar: 'دليل الجهات', en: 'Entity directory' },
  lede: {
    ar: 'الجهات القائمة في الدليل المنقّى بالاسم والنوع والقطاع والمنطقة. الجهات الحكومية وشبه الحكومية مختارة افتراضيًا، ويمكن إظهار الأنواع الأخرى من المرشّح.',
    en: 'Active entities of the cleaned directory by name, type, sector and region. Government and quasi-government entities are selected by default; the other types can be shown from the filter.',
  },
  countNote: { ar: 'جهة في الدليل العام', en: 'entities in the public directory' },
  namesNote: {
    ar: 'تظهر أسماء الجهات كما وردت في ملف المصدر، والاسم الإنجليزي تحتها حين يتوفر.',
    en: 'Entity names are proper nouns shown in Arabic as recorded in the source workbook, with the English name underneath where the source has one.',
  },
  search: { ar: 'ابحث بالاسم', en: 'Search by name' },
  searchHint: { ar: 'الاسم العربي أو الإنجليزي', en: 'Arabic or English name' },
  types: { ar: 'نوع الجهة', en: 'Entity type' },
  sector: { ar: 'القطاع', en: 'Sector' },
  allSectors: { ar: 'كل القطاعات', en: 'All sectors' },
  region: { ar: 'المنطقة', en: 'Region' },
  allRegions: { ar: 'كل المناطق', en: 'All regions' },
  results: { ar: 'جهة', en: 'entities' },
  of: { ar: 'من', en: 'of' },
  none: { ar: 'لا جهات تطابق البحث أو المرشّحات.', en: 'No entities match the search or filters.' },
  noTypes: { ar: 'اختر نوعًا واحدًا على الأقل لعرض الجهات.', en: 'Select at least one type to show entities.' },
  prev: { ar: 'الصفحة السابقة', en: 'Previous page' },
  next: { ar: 'الصفحة التالية', en: 'Next page' },
  page: { ar: 'صفحة', en: 'Page' },
  pageOf: { ar: 'من', en: 'of' },
  loading: { ar: 'جارٍ تحميل الدليل…', en: 'Loading the directory…' },
  loadError: { ar: 'تعذّر تحميل الدليل. أعد تحميل الصفحة.', en: 'The directory could not be loaded. Reload the page.' },
  open: { ar: 'افتح صفحة الجهة', en: 'Open the entity page' },
} satisfies Record<string, L>

export default function Directory() {
  const { t, lang } = useApp()
  const { data: index, error, loading } = useGovData(loadEntitiesIndex)
  const [searchParams] = useSearchParams()
  const full = isFullMode()

  const [query, setQuery] = useState('')
  const [types, setTypes] = useState<Set<EntityType>>(() => new Set(DEFAULT_DIRECTORY_TYPES))
  const [fSector, setFSector] = useState(() => {
    const raw = searchParams.get('sector') ?? ''
    return sectorById(raw) ? raw : ''
  })
  const [fRegion, setFRegion] = useState('')
  const [page, setPage] = useState(0)

  const searchId = useId()
  const sectorId = useId()
  const regionId = useId()
  const typesId = useId()
  const statusId = useId()

  const rows = useMemo(() => index ?? [], [index])

  const typesPresent = useMemo(() => {
    const present = new Set(rows.map((e) => e.type))
    return ENTITY_TYPES.filter((ty) => present.has(ty))
  }, [rows])
  const typeCounts = useMemo(() => {
    const counts = new Map<EntityType, number>()
    for (const e of rows) counts.set(e.type, (counts.get(e.type) ?? 0) + 1)
    return counts
  }, [rows])
  const sectorsPresent = useMemo(() => {
    const present = new Set(rows.map((e) => e.sectorId))
    return sectors.filter((s) => present.has(s.id))
  }, [rows])
  const regionsPresent = useMemo(() => {
    const present = new Set(rows.map((e) => e.region))
    return regions.filter((r) => present.has(r.id))
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(
      (e) =>
        types.has(e.type) &&
        (!fSector || e.sectorId === fSector) &&
        (!fRegion || e.region === fRegion) &&
        (q.length === 0 || e.nameAr.toLowerCase().includes(q) || (e.nameEn ?? '').toLowerCase().includes(q))
    )
  }, [rows, query, types, fSector, fRegion])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  useEffect(() => {
    setPage(0)
  }, [query, types, fSector, fRegion])

  const toggleType = (ty: EntityType) =>
    setTypes((prev) => {
      const next = new Set(prev)
      if (next.has(ty)) next.delete(ty)
      else next.add(ty)
      return next
    })

  const selectCls = 'rounded-btn border border-dga-line bg-white px-2.5 py-2 text-xs outline-none focus:border-dga-green'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t(ui.title)}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">{t(ui.lede)}</p>
        <p className="mt-3 text-sm text-dga-ink">
          <Claim id="gov-directory-public" /> {t(ui.countNote)}
        </p>
        <p className="mt-1 text-xs text-dga-muted">{t(ui.namesNote)}</p>
      </div>

      {/* filters */}
      <div className="no-print mb-6 space-y-4">
        <div>
          <label htmlFor={searchId} className="block text-xs font-semibold text-dga-black">
            {t(ui.search)}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(ui.searchHint)}
            className="mt-1 w-full max-w-md rounded-btn border border-dga-line bg-white px-3 py-2 text-sm outline-none focus:border-dga-green"
          />
        </div>

        <div role="group" aria-labelledby={typesId}>
          <p id={typesId} className="text-xs font-semibold text-dga-black">
            {t(ui.types)}
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {typesPresent.map((ty) => {
              const on = types.has(ty)
              return (
                <button
                  key={ty}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleType(ty)}
                  className={`chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${on ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`}
                >
                  {label(entityTypeById(ty), lang, ty)}
                  {/* the count keeps full contrast on the selected green chip (white on #1B8354 ≈ 4.8:1) */}
                  <span className={`tabular-nums ${on ? 'font-normal text-white' : 'text-dga-muted'}`} dir="ltr">
                    {fmt(typeCounts.get(ty) ?? 0)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor={sectorId} className="block text-xs font-semibold text-dga-black">
              {t(ui.sector)}
            </label>
            <select id={sectorId} value={fSector} onChange={(e) => setFSector(e.target.value)} className={`mt-1 ${selectCls}`}>
              <option value="">{t(ui.allSectors)}</option>
              {sectorsPresent.map((s) => (
                <option key={s.id} value={s.id}>
                  {label(s, lang)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={regionId} className="block text-xs font-semibold text-dga-black">
              {t(ui.region)}
            </label>
            <select id={regionId} value={fRegion} onChange={(e) => setFRegion(e.target.value)} className={`mt-1 ${selectCls}`}>
              <option value="">{t(ui.allRegions)}</option>
              {regionsPresent.map((r) => (
                <option key={r.id} value={r.id}>
                  {label(r, lang)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p id={statusId} className="text-xs text-dga-muted" role="status" aria-live="polite">
          <span className="tabular-nums" dir="ltr">
            {fmt(filtered.length)}
          </span>{' '}
          {t(ui.of)}{' '}
          <span className="tabular-nums" dir="ltr">
            {fmt(rows.length)}
          </span>{' '}
          {t(ui.results)}
        </p>
      </div>

      {loading ? (
        <p className="glass p-10 text-center text-sm text-dga-muted" role="status">
          {t(ui.loading)}
        </p>
      ) : null}
      {error ? (
        <p className="glass p-10 text-center text-sm text-dga-amber-tx" role="alert">
          {t(ui.loadError)}
        </p>
      ) : null}

      {/* cards */}
      {!loading && !error ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((e) => (
            <li key={e.id}>
              <EntityCard entity={e} full={full} />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        <div className="glass p-10 text-center text-dga-muted">{types.size === 0 ? t(ui.noTypes) : t(ui.none)}</div>
      ) : null}

      {/* pagination */}
      {pageCount > 1 ? (
        <nav className="no-print mt-8 flex items-center justify-center gap-3" aria-label={t(ui.page)}>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            aria-label={t(ui.prev)}
            className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
          >
            <span aria-hidden="true">{lang === 'ar' ? '→' : '←'}</span> {t(ui.prev)}
          </button>
          <span className="text-xs text-dga-muted">
            {t(ui.page)}{' '}
            <span className="tabular-nums" dir="ltr">
              {safePage + 1}
            </span>{' '}
            {t(ui.pageOf)}{' '}
            <span className="tabular-nums" dir="ltr">
              {pageCount}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            aria-label={t(ui.next)}
            className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
          >
            {t(ui.next)} <span aria-hidden="true">{lang === 'ar' ? '←' : '→'}</span>
          </button>
        </nav>
      ) : null}
    </div>
  )
}

function EntityCard({ entity: e, full }: { entity: EntityIndexRow; full: boolean }) {
  const { t, lang } = useApp()
  return (
    <Link
      to={pathFor('entity', lang, { entityId: e.id })}
      className="glass flex h-full flex-col p-4 transition-shadow hover:shadow-card-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green"
      aria-label={`${lang === 'en' && e.nameEn ? e.nameEn : e.nameAr}: ${t(ui.open)}`}
    >
      <div className="flex items-center gap-3">
        {full ? <EntityLogo entity={e} className="h-12 w-12" /> : null}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-dga-black" title={e.nameAr} lang="ar" dir="rtl">
            {e.nameAr}
          </h2>
          {e.nameEn ? (
            <p className="truncate text-[10.5px] text-dga-muted" lang="en" dir="ltr" title={e.nameEn}>
              {e.nameEn}
            </p>
          ) : null}
          <EnglishNameFallback lang={lang} nameEn={e.nameEn} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
        <span className="chip-info">{label(entityTypeById(e.type), lang, e.type)}</span>
        <span className="chip">{label(sectorById(e.sectorId), lang, e.sectorId)}</span>
      </div>
      <p className="mt-2 text-[11px] text-dga-muted">{label(regionById(e.region), lang, e.region)}</p>
    </Link>
  )
}
