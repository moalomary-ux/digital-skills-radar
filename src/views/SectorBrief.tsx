import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import { isFullMode } from '../lib/flags'
import Claim from '../components/Claim'
import Icon from '../components/Icon'
import { domainById } from '../data/domains'
import { domainsFromCategoryCounts } from '../data/sectorSkills'
import { DEFAULT_DIRECTORY_TYPES, categoryByKey, cutoff, fixTopConsulting, label, loadEntitiesIndex, loadSectorEntities, loadSectors, periods, sectorById, useGovData } from '../data/gov'
import type { EntityDetailRow, SectorAggregate } from '../data/gov'
import type { L } from '../data/types'

/**
 * Printable A4 sector brief at /sectors/:sectorId (packet P4). Aggregates only where the sector passes
 * the n ≥ 10 rule; «مجالات تطوير مرتبطة بسجل الاستشارات» is an editorial inference shown as record
 * counts and a period, never as renormalized shares. The sector's entities with records appear in the
 * full build only.
 */

const fmt = (n: number) => n.toLocaleString('en-US')

const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 15mm; }
  /* The site shell (Header, Footer, pagination nav) is marked .no-print; the brief's own <header> must print. */
  .no-print { display: none !important; }
  html, body { background: #fff !important; }
  .sector-brief { max-width: none !important; padding: 0 !important; }
  .sector-brief .glass, .sector-brief .glass-strong { box-shadow: none !important; border: 1px solid #d7dde3 !important; background: #fff !important; }
  .sector-brief h1 { font-size: 18pt !important; }
  .sector-brief h2 { font-size: 12pt !important; break-after: avoid; page-break-after: avoid; }
  .sector-brief p, .sector-brief li, .sector-brief dd, .sector-brief dt, .sector-brief td, .sector-brief th { font-size: 9.5pt !important; line-height: 1.4 !important; }
  .sector-brief .print-avoid { break-inside: avoid; page-break-inside: avoid; }
  .sector-brief a { color: inherit; text-decoration: none; }
}
`

const ui = {
  eyebrow: { ar: 'موجز احتياج القطاع', en: 'Sector capability brief' },
  notFound: { ar: 'لا قطاع بهذا المعرّف.', en: 'No sector has this identifier.' },
  backToSectors: { ar: 'عودة إلى القطاعات الحكومية', en: 'Back to the government sectors' },
  loading: { ar: 'جارٍ تحميل موجز القطاع…', en: 'Loading the sector brief…' },
  loadError: { ar: 'تعذّر تحميل بيانات القطاع. أعد تحميل الصفحة.', en: 'Sector data could not be loaded. Reload the page.' },
  cutoff: { ar: 'تاريخ القطع:', en: 'Cut-off:' },
  print: { ar: 'اطبع الموجز', en: 'Print the brief' },
  figures: { ar: 'أرقام القطاع', en: 'Sector figures' },
  govEntities: { ar: 'جهة حكومية وشبه حكومية', en: 'government and quasi-government entities' },
  allEntities: { ar: 'جهة في الدليل', en: 'entities in the directory' },
  withRecords: { ar: 'جهة لها سجلات', en: 'entities with records' },
  training: { ar: 'سجل مشاركة تدريبية', en: 'training participation records' },
  consulting: { ar: 'خدمة استشارية', en: 'consulting services' },
  trainingPeriod: { ar: 'فترة التدريب:', en: 'Training period:' },
  consultingPeriod: { ar: 'فترة الاستشارات:', en: 'Consulting period:' },
  withheldTitle: { ar: 'المجاميع القطاعية محجوبة', en: 'Sector aggregates withheld' },
  withheld: {
    ar: 'المجاميع تُعرض للقطاعات التي فيها 10 جهات ذات سجلات أو أكثر؛ هذا القطاع دون ذلك، فتُجمَّع أرقامه في صف «قطاعات أخرى» كي تبقى المجاميع الوطنية صحيحة.',
    en: 'Aggregates are shown for sectors with 10 or more entities with records; this sector is below that, so its figures are pooled into the «other sectors» row to keep the national totals exact.',
  },
  rule: { ar: 'القاعدة:', en: 'Rule:' },
  areasTitle: { ar: 'مجالات تطوير مرتبطة بسجل الاستشارات', en: 'Development areas linked to the consulting record' },
  areasNote: {
    ar: 'عدد سجلات الاستشارات لكل فئة في هذا القطاع، ثم المجالات التي تُربط بها الفئات عبر جدول الربط المسجل في المنهجية. الأعداد والفترة فقط؛ لا نسب.',
    en: 'Consulting records per category in this sector, then the domains linked to those categories through the mapping table registered in the methodology. Counts and period only; no percentages.',
  },
  categories: { ar: 'فئات الاستشارات حسب عدد السجلات', en: 'Consulting categories by record count' },
  category: { ar: 'الفئة', en: 'Category' },
  records: { ar: 'السجلات', en: 'Records' },
  period: { ar: 'الفترة', en: 'Period' },
  domains: { ar: 'المجالات المرتبطة حسب السجلات الموزونة', en: 'Linked domains by weighted records' },
  weighted: { ar: 'سجل موزون', en: 'weighted records' },
  howTitle: { ar: 'كيف نقرأ هذا الموجز', en: 'How to read this brief' },
  how: {
    ar: 'الأرقام هنا سجلات خدمات لا قياس لاحتياج القوى العاملة: تصف ما طلبته جهات القطاع من تدريب واستشارات حتى تاريخ القطع، لا ما تحتاجه كل جهة. ربط الفئات بالمجالات افتراض تحريري معلن وقابل للمراجعة، والقطاع الذي يقلّ عدد جهاته ذات السجلات عن القاعدة لا تُنشر مجاميعه حمايةً للجهات من التعرف عليها من مجموع صغير.',
    en: 'The figures here are service records, not a measure of workforce need: they describe what the sector’s entities requested in training and consulting up to the cut-off, not what each entity needs. The category-to-domain link is a declared, reviewable editorial assumption, and a sector whose entities with records fall below the rule has no published aggregates, so that no entity can be identified from a small total.',
  },
  directory: { ar: 'جهات القطاع في الدليل', en: 'The sector’s entities in the directory' },
  assess: { ar: 'ابدأ استكشاف احتياجاتك التطويرية', en: 'Start exploring your development needs' },
  privateDemo: { ar: 'عرض خاص', en: 'Private demo' },
  entitiesTitle: { ar: 'جهات القطاع ذات السجلات (عرض خاص)', en: 'The sector’s entities with records (private demo)' },
  entitiesNote: { ar: 'يظهر هذا الجدول في البناء الكامل فقط ولا يُنشر في البناء العام.', en: 'This table exists in the full build only and is never published in the public build.' },
  entity: { ar: 'الجهة', en: 'Entity' },
  programs: { ar: 'برنامج تدريبي', en: 'training programs' },
  topConsulting: { ar: 'أبرز الخدمات الاستشارية', en: 'Top consulting services' },
  loadingPrivate: { ar: 'جارٍ تحميل سجلات الجهات…', en: 'Loading entity records…' },
  noPrivate: { ar: 'ملفات التفاصيل غير مولّدة. شغّل سكربت البناء بخيار الوضع الكامل.', en: 'Detail files are not generated. Run the build script in full mode.' },
} satisfies Record<string, L>

const GOV_TYPES = new Set<string>(DEFAULT_DIRECTORY_TYPES)

function PrivateEntities({ sectorId }: { sectorId: string }) {
  const { t, lang } = useApp()
  const { data, error, loading } = useGovData(() => loadSectorEntities(sectorId), `entities:${sectorId}`)
  const rows = useMemo(() => (data ?? []).filter((e): e is EntityDetailRow & { services: NonNullable<EntityDetailRow['services']> } => !!e.services), [data])
  return (
    <section className="glass print-avoid mt-6 border-s-4 border-dga-amber p-6" aria-labelledby="brief-private">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="brief-private" className="text-lg font-bold text-dga-green-dark">
          {t(ui.entitiesTitle)}
        </h2>
        <span className="chip border-dga-amber/60 bg-amber-50 text-dga-amber-tx">{t(ui.privateDemo)}</span>
      </div>
      <p className="mt-1 text-xs text-dga-muted">{t(ui.entitiesNote)}</p>
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
      {rows.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-dga-muted">
                <th scope="col" className="py-2 text-start font-semibold">{t(ui.entity)}</th>
                <th scope="col" className="py-2 text-end font-semibold">{t(ui.training)}</th>
                <th scope="col" className="py-2 text-end font-semibold">{t(ui.programs)}</th>
                <th scope="col" className="py-2 text-end font-semibold">{t(ui.consulting)}</th>
                <th scope="col" className="py-2 text-start font-semibold">{t(ui.topConsulting)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-t border-dga-line align-top">
                  <td className="py-2 pe-3">
                    <Link to={pathFor('entity', lang, { entityId: e.id })} className="font-semibold text-dga-green-dark hover:underline">
                      <span lang="ar" dir="rtl">{e.nameAr}</span>
                    </Link>
                    {e.nameEn ? (
                      <span className="block text-[11px] text-dga-muted" dir="ltr">
                        {e.nameEn}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pe-3 text-end tabular-nums" dir="ltr">{fmt(e.services.trainingRecords)}</td>
                  <td className="py-2 pe-3 text-end tabular-nums" dir="ltr">{fmt(e.services.trainingPrograms)}</td>
                  <td className="py-2 pe-3 text-end tabular-nums" dir="ltr">{fmt(e.services.consultingServices)}</td>
                  <td className="py-2 text-xs text-dga-muted">
                    {e.services.topConsulting ? <span lang="ar" dir="rtl">{fixTopConsulting(e.services.topConsulting)}</span> : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

function Brief({ sector, govCount }: { sector: SectorAggregate; govCount: number }) {
  const { t, lang, go } = useApp()
  const term = sectorById(sector.id)
  const name = label(term, lang, sector.id)
  const otherName = term ? (lang === 'ar' ? term.en : term.ar) : null

  const categoryRows = useMemo(
    () =>
      Object.entries(sector.categories ?? {})
        .filter(([, n]) => n > 0)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([key, records]) => ({ key, term: categoryByKey(key), records })),
    [sector.categories]
  )
  const domainRows = useMemo(() => sector.domains ?? domainsFromCategoryCounts(sector.categories), [sector.domains, sector.categories])

  return (
    <div className="sector-brief mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <style>{PRINT_CSS}</style>
      <div className="no-print mb-6">
        <Link to={pathFor('sectors', lang)} className="btn-ghost px-3 py-1.5 text-xs">
          <span aria-hidden="true">{lang === 'ar' ? '→' : '←'} </span>
          {t(ui.backToSectors)}
        </Link>
      </div>

      {/* title */}
      <header className="glass-strong print-avoid p-6">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{name}</h1>
        {otherName ? (
          <p className="mt-1 text-sm text-dga-muted" lang={lang === 'ar' ? 'en' : 'ar'} dir={lang === 'ar' ? 'ltr' : 'rtl'}>
            {otherName}
          </p>
        ) : null}
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-dga-ink">
          <span className="font-semibold">{t(ui.cutoff)}</span>
          <Claim id="gov-cutoff">
            <span className="font-semibold">{t(cutoff)}</span>
          </Claim>
        </p>
        <div className="no-print mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-primary px-5 py-2 text-sm" onClick={() => window.print()}>
            {t(ui.print)}
          </button>
        </div>
      </header>

      {/* figures */}
      <section className="glass print-avoid mt-6 p-6" aria-labelledby="brief-figures">
        <h2 id="brief-figures" className="text-lg font-bold text-dga-green-dark">
          {t(ui.figures)}
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
            <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
              {fmt(govCount)}
            </dd>
            <dt className="mt-1 text-xs text-dga-muted">{t(ui.govEntities)}</dt>
          </div>
          <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
            <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
              {fmt(sector.entityCount)}
            </dd>
            <dt className="mt-1 text-xs text-dga-muted">{t(ui.allEntities)}</dt>
          </div>
          {sector.showAggregates && sector.training !== null && sector.consulting !== null ? (
            <>
              <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
                  {fmt(sector.entitiesWithRecords)}
                </dd>
                <dt className="mt-1 text-xs text-dga-muted">{t(ui.withRecords)}</dt>
              </div>
              <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
                  {fmt(sector.training)}
                </dd>
                <dt className="mt-1 text-xs text-dga-muted">{t(ui.training)}</dt>
              </div>
              <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
                  {fmt(sector.consulting)}
                </dd>
                <dt className="mt-1 text-xs text-dga-muted">{t(ui.consulting)}</dt>
              </div>
            </>
          ) : null}
        </dl>
        {sector.showAggregates ? (
          <p className="mt-3 text-xs text-dga-muted">
            {t(ui.trainingPeriod)} {t(periods.training)} · {t(ui.consultingPeriod)} {t(periods.consulting)}
          </p>
        ) : (
          <div className="mt-4 rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 px-4 py-3">
            <p className="text-sm font-semibold text-dga-black">{t(ui.withheldTitle)}</p>
            <p className="mt-1 text-sm leading-relaxed text-dga-ink">
              {t(ui.withheld)} ({t(ui.rule)} <Claim id="method-gov-sector-min" />)
            </p>
          </div>
        )}
      </section>

      {/* development areas */}
      <section className="glass print-avoid mt-6 p-6" aria-labelledby="brief-areas">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="brief-areas" className="text-lg font-bold text-dga-green-dark">
            {t(ui.areasTitle)}
          </h2>
          <Claim id="gov-domain-inference">
            <span className="chip-info">{lang === 'ar' ? 'استنتاج تحريري' : 'Editorial inference'}</span>
          </Claim>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-dga-muted">{t(ui.areasNote)}</p>
        {sector.showAggregates && categoryRows.length > 0 ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-dga-black">{t(ui.categories)}</h3>
              <table className="mt-2 w-full text-sm">
                <thead>
                  <tr className="text-xs text-dga-muted">
                    <th scope="col" className="py-1.5 text-start font-semibold">{t(ui.category)}</th>
                    <th scope="col" className="py-1.5 text-end font-semibold">{t(ui.records)}</th>
                    <th scope="col" className="py-1.5 text-start font-semibold ps-3">{t(ui.period)}</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryRows.map((r) => (
                    <tr key={r.key} className="border-t border-dga-line">
                      <th scope="row" className="py-1.5 text-start font-medium text-dga-ink">
                        {r.term ? label(r.term, lang) : <span lang="ar" dir="rtl">{r.key}</span>}
                      </th>
                      <td className="py-1.5 text-end font-bold tabular-nums text-dga-green-dark" dir="ltr">{fmt(r.records)}</td>
                      <td className="py-1.5 ps-3 text-xs text-dga-muted">{t(periods.consulting)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-bold text-dga-black">{t(ui.domains)}</h3>
              <ol className="mt-2 space-y-2">
                {domainRows.map((d) => {
                  const domain = domainById(d.domainId)
                  return (
                    <li key={d.domainId} className="flex items-center justify-between gap-3 rounded-btn bg-dga-bg px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-dga-ink">
                        {domain ? <Icon name={domain.icon} className="h-4 w-4 text-dga-green" /> : null}
                        {domain ? t(domain.shortName) : d.domainId}
                      </span>
                      <span className="whitespace-nowrap tabular-nums" dir="ltr">
                        <span className="font-bold text-dga-green-dark">{fmt(d.records)}</span> <span className="text-xs text-dga-muted">{t(ui.weighted)}</span>
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-dga-muted">
            {t(ui.withheld)} ({t(ui.rule)} <Claim id="method-gov-sector-min" />)
          </p>
        )}
      </section>

      {/* how to read */}
      <section className="glass print-avoid mt-6 border-s-4 border-dga-green p-6" aria-labelledby="brief-how">
        <h2 id="brief-how" className="text-base font-bold text-dga-black">
          {t(ui.howTitle)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(ui.how)}</p>
      </section>

      {isFullMode() ? <PrivateEntities sectorId={sector.id} /> : null}

      {/* actions */}
      <div className="no-print mt-8 flex flex-wrap gap-3">
        <Link to={`${pathFor('directory', lang)}?sector=${encodeURIComponent(sector.id)}`} className="btn-ghost text-sm">
          <Icon name="compass" className="h-4 w-4" />
          {t(ui.directory)}
        </Link>
        <button type="button" onClick={() => go('wizard')} className="btn-primary px-5 py-2.5 text-sm">
          {t(ui.assess)}
        </button>
      </div>
    </div>
  )
}

export default function SectorBrief() {
  const { t, lang } = useApp()
  const { sectorId = '' } = useParams<{ sectorId: string }>()
  const sectorsState = useGovData(loadSectors)
  const indexState = useGovData(loadEntitiesIndex)

  const sector = useMemo(() => sectorsState.data?.sectors.find((s) => s.id === sectorId && !s.pooled) ?? null, [sectorsState.data, sectorId])
  const govCount = useMemo(() => (indexState.data ?? []).filter((e) => e.sectorId === sectorId && GOV_TYPES.has(e.type)).length, [indexState.data, sectorId])

  const known = !!sectorById(sectorId)
  const loading = sectorsState.loading || indexState.loading
  const error = sectorsState.error ?? indexState.error

  if (!known || (!loading && !error && !sector)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-dga-muted">{t(ui.notFound)}</p>
        <Link to={pathFor('sectors', lang)} className="btn-primary mt-5 inline-flex px-6 py-2.5 text-sm">
          {t(ui.backToSectors)}
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-dga-muted" role="status">
        {t(ui.loading)}
      </p>
    )
  }
  if (error || !sector) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-sm text-dga-amber-tx" role="alert">
          {t(ui.loadError)}
        </p>
        <Link to={pathFor('sectors', lang)} className="btn-ghost mt-5 inline-flex px-6 py-2.5 text-sm">
          {t(ui.backToSectors)}
        </Link>
      </div>
    )
  }

  return <Brief sector={sector} govCount={govCount} />
}
