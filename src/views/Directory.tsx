import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../store'
import { govEntities } from '../data/govEntities'
import EntityLogo from '../components/EntityLogo'
import Icon from '../components/Icon'

const fmt = (n: number) => n.toLocaleString('en-US')
const PAGE_SIZE = 48

/** Unique values of a string field, ordered by frequency desc then alpha. */
function optionsOf(field: 'sector' | 'type' | 'scope' | 'region'): string[] {
  const counts = new Map<string, number>()
  for (const e of govEntities) counts.set(e[field], (counts.get(e[field]) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ar')).map(([v]) => v)
}

const SECTORS = optionsOf('sector')
const TYPES = optionsOf('type')
const SCOPES = optionsOf('scope')
const REGIONS = optionsOf('region')

export default function Directory() {
  const { t, openEntity } = useApp()
  const [query, setQuery] = useState('')
  const [fSector, setFSector] = useState('')
  const [fType, setFType] = useState('')
  const [fScope, setFScope] = useState('')
  const [fRegion, setFRegion] = useState('')
  const [fLogo, setFLogo] = useState(false)
  const [fServed, setFServed] = useState(false)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return govEntities.filter(
      (e) =>
        (!fSector || e.sector === fSector) &&
        (!fType || e.type === fType) &&
        (!fScope || e.scope === fScope) &&
        (!fRegion || e.region === fRegion) &&
        (!fLogo || !!e.logo) &&
        (!fServed || !!e.services) &&
        (q.length === 0 || e.nameAr.toLowerCase().includes(q) || (e.nameEn ?? '').toLowerCase().includes(q))
    )
  }, [query, fSector, fType, fScope, fRegion, fLogo, fServed])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  useEffect(() => {
    setPage(0)
  }, [query, fSector, fType, fScope, fRegion, fLogo, fServed])

  const selectCls = 'rounded-btn border border-dga-line bg-white px-2.5 py-2 text-xs outline-none focus:border-dga-green'
  const toggleCls = (on: boolean) => `chip ${on ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t({ ar: '682 جهة حكومية وشبه حكومية', en: '682 government & quasi-government entities' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t({ ar: 'دليل الجهات', en: 'Entity Directory' })}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'الدليل الكامل للجهات مع شعاراتها وتصنيفها (القطاع، النوع، النطاق، المنطقة) وسجل استفادتها من خدمات التدريب والاستشارات.',
            en: 'The complete entity directory with logos, classification (sector, type, scope, region), and each entity’s training & consulting benefit record.',
          })}
        </p>
      </div>

      {/* filters */}
      <div className="no-print mb-6 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t({ ar: 'ابحث بالاسم العربي أو الإنجليزي…', en: 'Search by Arabic or English name…' })}
          className="w-full max-w-md rounded-btn border border-dga-line bg-white px-3 py-2 text-sm outline-none focus:border-dga-green"
        />
        <div className="flex flex-wrap items-center gap-2">
          <select value={fSector} onChange={(e) => setFSector(e.target.value)} className={selectCls} aria-label="sector">
            <option value="">{t({ ar: 'كل القطاعات', en: 'All sectors' })}</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={fType} onChange={(e) => setFType(e.target.value)} className={selectCls} aria-label="type">
            <option value="">{t({ ar: 'كل الأنواع', en: 'All types' })}</option>
            {TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={fScope} onChange={(e) => setFScope(e.target.value)} className={selectCls} aria-label="scope">
            <option value="">{t({ ar: 'كل النطاقات', en: 'All scopes' })}</option>
            {SCOPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={fRegion} onChange={(e) => setFRegion(e.target.value)} className={selectCls} aria-label="region">
            <option value="">{t({ ar: 'كل المناطق', en: 'All regions' })}</option>
            {REGIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={() => setFLogo((v) => !v)} className={toggleCls(fLogo)}>
            {t({ ar: 'لها شعار', en: 'Has logo' })}
          </button>
          <button onClick={() => setFServed((v) => !v)} className={toggleCls(fServed)}>
            {t({ ar: 'مستفيدة فقط', en: 'Served only' })}
          </button>
        </div>
        <p className="text-xs text-dga-muted">
          {t({ ar: `${fmt(filtered.length)} من ${fmt(govEntities.length)} جهة`, en: `${fmt(filtered.length)} of ${fmt(govEntities.length)} entities` })}
        </p>
      </div>

      {/* cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((e, i) => (
          <motion.article
            key={e.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, delay: (i % 4) * 0.04 }}
            onClick={() => openEntity(e.id)}
            onKeyDown={(ev) => ev.key === 'Enter' && openEntity(e.id)}
            role="button"
            tabIndex={0}
            className="glass flex cursor-pointer flex-col p-4 transition-shadow hover:shadow-card-lg"
          >
            <div className="flex items-center gap-3">
              <EntityLogo entity={e} className="h-12 w-12" />
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-dga-black" title={e.nameAr}>{e.nameAr}</h2>
                {e.nameEn && <p className="truncate text-[10.5px] text-dga-muted" dir="ltr" title={e.nameEn}>{e.nameEn}</p>}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
              <span className="chip">{e.sector}</span>
              <span className="chip">{e.type}</span>
              <span className="chip">{e.scope}</span>
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-dga-muted">
              <Icon name="compass" className="h-3.5 w-3.5" />
              {e.region}
              {e.hq ? ` — ${e.hq}` : ''}
            </p>

            {e.services ? (
              <div className="mt-3 rounded-btn bg-dga-bg p-2.5 text-[11px] leading-relaxed">
                <p>
                  <span className="chip-info !px-1.5 !py-0 text-[10px]">{t({ ar: 'مستفيدة', en: 'served' })}</span>{' '}
                  {e.services.lastYear && (
                    <span className="text-dga-muted">
                      {t({ ar: `آخر خدمة ${e.services.lastYear}`, en: `last service ${e.services.lastYear}` })}
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-dga-ink">
                  {t({ ar: 'تدريب:', en: 'Training:' })}{' '}
                  <span className="font-mono font-bold text-dga-green-dark" dir="ltr">{fmt(e.services.trainingBeneficiaries)}</span>
                  {' · '}
                  {t({ ar: 'استشارات:', en: 'Consulting:' })}{' '}
                  <span className="font-mono font-bold text-dga-green-dark" dir="ltr">{fmt(e.services.consultingServices)}</span>
                </p>
                {e.services.topConsulting && (
                  <p className="mt-1 text-dga-muted">
                    <span className="font-semibold text-dga-ink">{t({ ar: 'أبرز الخدمات: ', en: 'Top services: ' })}</span>
                    {e.services.topConsulting}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 rounded-btn bg-dga-bg p-2.5 text-[11px] text-dga-muted">
                {t({ ar: 'لم تستفد من الخدمات بعد', en: 'No services utilized yet' })}
              </p>
            )}

            {e.website && (
              <a
                href={e.website.startsWith('http') ? e.website : `https://${e.website}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(ev) => ev.stopPropagation()}
                className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-semibold text-dga-green-dark hover:underline"
                dir="ltr"
              >
                <Icon name="cloud" className="h-3.5 w-3.5" />
                {e.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass p-10 text-center text-dga-muted">
          {t({ ar: 'لا جهات تطابق البحث أو الفلاتر.', en: 'No entities match the search or filters.' })}
        </div>
      )}

      {/* pagination */}
      {pageCount > 1 && (
        <div className="no-print mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
          >
            {t({ ar: 'السابق', en: 'Prev' })}
          </button>
          <span className="text-xs text-dga-muted" dir="ltr">
            {safePage + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
          >
            {t({ ar: 'التالي', en: 'Next' })}
          </button>
        </div>
      )}
    </div>
  )
}
