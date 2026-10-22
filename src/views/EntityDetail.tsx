import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store'
import { pathFor } from '../lib/routes'
import { applyHead, headFor } from '../lib/head'
import { bdi } from '../lib/format'
import { isFullMode } from '../lib/flags'
import EntityLogo, { EnglishNameFallback } from '../components/EntityLogo'
import Icon from '../components/Icon'
import { yearlyTraining } from '../data/govServices'
import { categoryByKey, entityTypeById, findEntity, findEntityDetail, fixTopConsulting, kindById, label, regionById, scopeById, sectorById, useGovData } from '../data/gov'
import type { EntityDetailRow, EntityIndexRow } from '../data/gov'
import type { L } from '../data/types'

/**
 * Entity page (packet P4). Public build: name, type, sector, region and a link to the sector brief,
 * nothing else. Full build: the entity's service record from the lazily loaded sector detail file,
 * under a visible «عرض خاص / Private demo» chip. The «Back to the directory» button is a real button
 * (routes.test.tsx looks for it by name).
 */

const fmt = (n: number) => n.toLocaleString('en-US')
/** Year labels of the per-entity training series (same order as the national series). */
const TRAINING_YEARS: number[] = yearlyTraining.map((y) => y.year)

const ui = {
  back: { ar: 'عودة إلى دليل الجهات', en: 'Back to the directory' },
  loading: { ar: 'جارٍ تحميل بيانات الجهة…', en: 'Loading the entity…' },
  loadError: { ar: 'تعذّر تحميل بيانات الجهة. أعد تحميل الصفحة.', en: 'The entity could not be loaded. Reload the page.' },
  notFound: { ar: 'لا جهة بهذا المعرّف في الدليل العام.', en: 'No entity has this identifier in the public directory.' },
  noneSelected: { ar: 'لم تُحدَّد جهة. افتح دليل الجهات واختر جهة لعرضها.', en: 'No entity selected. Open the directory and pick an entity.' },
  type: { ar: 'النوع', en: 'Type' },
  sector: { ar: 'القطاع', en: 'Sector' },
  region: { ar: 'المنطقة', en: 'Region' },
  kind: { ar: 'الشكل التنظيمي', en: 'Organizational type' },
  scope: { ar: 'النطاق في ملف المصدر', en: 'Scope in the source workbook' },
  hq: { ar: 'المقر', en: 'Headquarters' },
  website: { ar: 'الموقع الإلكتروني', en: 'Website' },
  brief: { ar: 'افتح موجز القطاع', en: 'Open the sector brief' },
  briefNote: {
    ar: 'لا تُنشر سجلات الخدمات لكل جهة في البناء العام؛ المجاميع القطاعية في موجز القطاع.',
    en: 'Per-entity service records are not published in the public build; sector aggregates are in the sector brief.',
  },
  privateDemo: { ar: 'عرض خاص', en: 'Private demo' },
  record: { ar: 'سجل خدمات التمكين لهذه الجهة (عرض خاص)', en: 'This entity’s enablement service record (private demo)' },
  recordNote: { ar: 'يظهر هذا القسم في البناء الكامل فقط ولا يُنشر في البناء العام.', en: 'This section exists in the full build only and is never published in the public build.' },
  noRecord: { ar: 'لا سجل خدمات لهذه الجهة في ملفي المصدر.', en: 'This entity has no service record in the two source workbooks.' },
  training: { ar: 'سجل مشاركة تدريبية', en: 'training participation records' },
  programs: { ar: 'برنامج تدريبي', en: 'training programs' },
  consulting: { ar: 'خدمة استشارية', en: 'consulting services' },
  consultingYears: { ar: 'سنوات الاستشارات:', en: 'Consulting years:' },
  lastYear: { ar: 'آخر خدمة:', en: 'Last service:' },
  byYear: { ar: 'سجلات المشاركة التدريبية حسب السنة', en: 'Training participation records by year' },
  year: { ar: 'السنة', en: 'Year' },
  records: { ar: 'السجلات', en: 'Records' },
  categories: { ar: 'فئات الاستشارات حسب عدد السجلات', en: 'Consulting categories by record count' },
  topConsulting: { ar: 'أبرز الخدمات الاستشارية', en: 'Top consulting services' },
  noDetail: { ar: 'ملف التفاصيل غير مولّد. شغّل سكربت البناء بخيار الوضع الكامل.', en: 'The detail file is not generated. Run the build script in full mode.' },
} satisfies Record<string, L>

function BackButton() {
  const { t, lang, go } = useApp()
  return (
    <button type="button" onClick={() => go('directory')} className="btn-ghost mb-6 px-3 py-1.5 text-xs">
      <span aria-hidden="true">{lang === 'ar' ? '→' : '←'} </span>
      {t(ui.back)}
    </button>
  )
}

function PrivateRecord({ entity }: { entity: EntityIndexRow }) {
  const { t, lang } = useApp()
  const { data: detail, error, loading } = useGovData(() => findEntityDetail(entity.id), `entity-detail:${entity.id}`)
  const svc = detail?.services ?? null
  const categories = Object.entries(detail?.categories ?? {})
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
  const website = detail?.website ?? null
  return (
    <section className="glass mt-6 border-s-4 border-dga-amber p-6" aria-labelledby="entity-record">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="entity-record" className="text-lg font-bold text-dga-green-dark">
          {t(ui.record)}
        </h2>
        <span className="chip border-dga-amber/60 bg-amber-50 text-dga-amber-tx">{t(ui.privateDemo)}</span>
      </div>
      <p className="mt-1 text-xs text-dga-muted">{t(ui.recordNote)}</p>
      {loading ? (
        <p className="mt-4 text-sm text-dga-muted" role="status">
          {t(ui.loading)}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-dga-amber-tx" role="alert">
          {t(ui.loadError)}
        </p>
      ) : null}
      {!loading && !error && !detail ? <p className="mt-4 text-sm text-dga-muted">{t(ui.noDetail)}</p> : null}
      {detail ? (
        <>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-dga-muted">
            <div>
              <dt className="inline font-semibold">{t(ui.kind)}: </dt>
              <dd className="inline">{label(kindById(detail.kind), lang, detail.kind)}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">{t(ui.scope)}: </dt>
              <dd className="inline">{label(scopeById(detail.scope), lang, detail.scope)}</dd>
            </div>
            {detail.hq ? (
              <div>
                <dt className="inline font-semibold">{t(ui.hq)}: </dt>
                <dd className="inline" lang="ar" dir="rtl">
                  {detail.hq}
                </dd>
              </div>
            ) : null}
            {website ? (
              <div>
                <dt className="inline font-semibold">{t(ui.website)}: </dt>
                <dd className="inline">
                  <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-dga-green-dark underline underline-offset-2" dir="ltr">
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
          {svc ? (
            <>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                  <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
                    {fmt(svc.trainingRecords)}
                  </dd>
                  <dt className="mt-1 text-xs text-dga-muted">{t(ui.training)}</dt>
                </div>
                <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                  <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
                    {fmt(svc.trainingPrograms)}
                  </dd>
                  <dt className="mt-1 text-xs text-dga-muted">{t(ui.programs)}</dt>
                </div>
                <div className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                  <dd className="text-2xl font-bold tabular-nums text-dga-green-deep" dir="ltr">
                    {fmt(svc.consultingServices)}
                  </dd>
                  <dt className="mt-1 text-xs text-dga-muted">{t(ui.consulting)}</dt>
                </div>
              </dl>
              <p className="mt-3 text-xs text-dga-muted">
                {svc.consultingYears ? (
                  <>
                    {t(ui.consultingYears)} <span dir="ltr">{svc.consultingYears}</span>
                    {' · '}
                  </>
                ) : null}
                {svc.lastYear ? (
                  <>
                    {t(ui.lastYear)} <span dir="ltr">{svc.lastYear}</span>
                  </>
                ) : null}
              </p>
              {detail.yearlyTraining ? (
                <table className="mt-4 w-full max-w-md text-sm">
                  <caption className="text-start text-xs font-semibold text-dga-black">{t(ui.byYear)}</caption>
                  <thead>
                    <tr className="text-xs text-dga-muted">
                      <th scope="col" className="py-1 text-start font-semibold">{t(ui.year)}</th>
                      <th scope="col" className="py-1 text-end font-semibold">{t(ui.records)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.yearlyTraining.map((v, i) => (
                      <tr key={TRAINING_YEARS[i] ?? i} className="border-t border-dga-line">
                        <th scope="row" className="py-1 text-start font-medium text-dga-ink">
                          {bdi(TRAINING_YEARS[i] ?? i)}
                        </th>
                        <td className="py-1 text-end tabular-nums" dir="ltr">
                          {fmt(v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
              {categories.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-dga-black">{t(ui.categories)}</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {categories.map(([key, n]) => {
                      const term = categoryByKey(key)
                      return (
                        <li key={key} className="flex items-center justify-between gap-3 rounded-btn bg-dga-bg px-3 py-1.5">
                          <span>{term ? label(term, lang) : <span lang="ar" dir="rtl">{key}</span>}</span>
                          <span className="font-bold tabular-nums text-dga-green-dark" dir="ltr">
                            {fmt(n)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}
              {svc.topConsulting ? (
                <div className="mt-4 rounded-btn bg-dga-bg p-4">
                  <h3 className="text-sm font-bold text-dga-black">{t(ui.topConsulting)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-dga-ink" lang="ar" dir="rtl">
                    {fixTopConsulting(svc.topConsulting)}
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="mt-4 text-sm text-dga-muted">{t(ui.noRecord)}</p>
          )}
        </>
      ) : null}
    </section>
  )
}

function Profile({ entity, detail }: { entity: EntityIndexRow; detail: EntityDetailRow | null }) {
  const { t, lang } = useApp()
  const full = isFullMode()
  const sector = sectorById(entity.sectorId)
  return (
    <>
      <div className="glass-strong p-6">
        <div className="flex flex-wrap items-center gap-5">
          {full ? <EntityLogo entity={{ id: entity.id, nameAr: entity.nameAr, logo: detail?.logo ?? null }} className="h-20 w-20 text-2xl" /> : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-dga-green-deep" lang="ar" dir="rtl">
              {entity.nameAr}
            </h1>
            {entity.nameEn ? (
              <p className="mt-1 text-sm text-dga-muted" lang="en" dir="ltr">
                {entity.nameEn}
              </p>
            ) : null}
            <EnglishNameFallback lang={lang} nameEn={entity.nameEn} long className="mt-1 block text-xs text-dga-muted" />
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold text-dga-muted">{t(ui.type)}</dt>
                <dd className="mt-0.5 text-dga-ink">{label(entityTypeById(entity.type), lang, entity.type)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-dga-muted">{t(ui.sector)}</dt>
                <dd className="mt-0.5">
                  <Link to={pathFor('sector', lang, { sectorId: entity.sectorId })} className="font-medium text-dga-green-dark underline underline-offset-2">
                    {label(sector, lang, entity.sectorId)}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-dga-muted">{t(ui.region)}</dt>
                <dd className="mt-0.5 text-dga-ink">{label(regionById(entity.region), lang, entity.region)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <section className="glass mt-6 p-6">
        <p className="text-sm leading-relaxed text-dga-muted">{t(ui.briefNote)}</p>
        <Link to={pathFor('sector', lang, { sectorId: entity.sectorId })} className="btn-primary mt-4 inline-flex px-5 py-2.5 text-sm">
          <Icon name="flag" className="h-4 w-4" />
          {t(ui.brief)}: {label(sector, lang, entity.sectorId)}
        </Link>
      </section>

      {full ? <PrivateRecord entity={entity} /> : null}
    </>
  )
}

export default function EntityDetail() {
  const { t, lang, go, pendingEntityId } = useApp()
  const id = pendingEntityId ?? ''
  const { data: entity, error, loading } = useGovData(() => (id ? findEntity(id) : Promise.resolve(null)), `entity:${id}`)
  const detailState = useGovData(() => (id && isFullMode() ? findEntityDetail(id) : Promise.resolve(null)), `entity-detail-logo:${id}`)
  // the generic head is applied on navigation (store); once the index is here the title carries the name
  useEffect(() => {
    if (entity) applyHead(headFor('entity', lang, { entityId: entity.id }))
  }, [entity, lang])

  if (!id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-dga-muted">{t(ui.noneSelected)}</p>
        <button type="button" onClick={() => go('directory')} className="btn-primary mt-5 px-6 py-2.5 text-sm">
          {t(ui.back)}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <BackButton />
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
      {!loading && !error && !entity ? <p className="glass p-10 text-center text-sm text-dga-muted">{t(ui.notFound)}</p> : null}
      {entity ? <Profile entity={entity} detail={detailState.data} /> : null}
    </div>
  )
}
