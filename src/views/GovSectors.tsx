import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../store'
import { govSectors } from '../data/govSectors'
import { govEntities } from '../data/govEntities'
import { sectorSkillProfiles, topCategoryForSector, sectorsByCategory, categoryShort } from '../data/sectorSkills'
import { domainById } from '../data/domains'
import EntityLogo from '../components/EntityLogo'
import Icon from '../components/Icon'

const fmt = (n: number) => n.toLocaleString('en-US')

export default function GovSectors() {
  const { t, lang, go, openEntity, pendingSectorCategory, clearPendingSectorCategory, setTrackId } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = govSectors.find((s) => s.id === selectedId) ?? null
  const sectorEntities = useMemo(
    () => (selected ? govEntities.filter((e) => e.sector === selected.name) : []),
    [selected]
  )
  const topInSector = useMemo(
    () =>
      [...sectorEntities]
        .filter((e) => e.services)
        .sort((a, b) => (b.services?.totalBenefit ?? 0) - (a.services?.totalBenefit ?? 0))
        .slice(0, 3),
    [sectorEntities]
  )

  // v8: skill demand profile + insight for the selected sector
  const selectedProfile = selected ? (sectorSkillProfiles[selected.name] ?? []) : []
  const selectedTopCat = selected ? topCategoryForSector(selected.name) : null

  // v8: when arriving from an Impact category bar, rank sectors by that category
  const catRanking = pendingSectorCategory ? sectorsByCategory(pendingSectorCategory) : null
  const sortedSectors = useMemo(() => {
    if (!pendingSectorCategory) return govSectors
    const rank = new Map((catRanking ?? []).map((r, i) => [r.sector, i]))
    return [...govSectors].sort((a, b) => (rank.get(a.name) ?? 999) - (rank.get(b.name) ?? 999))
  }, [pendingSectorCategory, catRanking])

  const startAssessment = () => {
    setTrackId('awareness') // generalist track
    go('wizard')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t({ ar: '31 قطاعًا حكوميًا — من دليل الجهات الرسمي', en: '31 government sectors — from the official entity directory' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t({ ar: 'القطاعات الحكومية', en: 'Government Sectors' })}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'توزيع 682 جهة على القطاعات، مع نسبة توفر الشعارات وحجم الاستفادة من خدمات التدريب والاستشارات في كل قطاع. اختر قطاعًا لعرض جهاته.',
            en: 'How 682 entities distribute across sectors, with logo coverage and training/consulting benefit volume per sector. Pick a sector to browse its entities.',
          })}
        </p>
      </div>

      {/* v8: category-focus banner (arrived from an Impact category bar) */}
      {pendingSectorCategory && catRanking && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-strong mb-8 border-s-4 border-dga-green p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">{t({ ar: 'القطاعات حسب الطلب على الفئة', en: 'Sectors ranked by demand for the category' })}</p>
              <h2 className="mt-1 text-xl font-bold text-dga-green-deep">{categoryShort(pendingSectorCategory)}</h2>
            </div>
            <button onClick={clearPendingSectorCategory} className="btn-ghost px-3 py-1.5 text-xs">
              {t({ ar: 'إظهار كل القطاعات', en: 'Show all sectors' })} ✕
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {catRanking.slice(0, 8).map((r, i) => (
              <button
                key={r.sector}
                onClick={() => {
                  const sec = govSectors.find((s) => s.name === r.sector)
                  if (sec) setSelectedId(sec.id)
                }}
                className="flex w-full items-center gap-3 rounded-btn border border-dga-line bg-white px-3 py-2 text-start transition-colors hover:border-dga-green"
              >
                <span className="w-6 font-mono text-xs font-bold text-dga-muted" dir="ltr">{i + 1}</span>
                <span className="flex-1 truncate text-sm font-semibold text-dga-black">{r.sector}</span>
                <span className="font-mono text-xs font-bold text-dga-green-dark" dir="ltr">{fmt(r.records)}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-dga-muted">
            {t({
              ar: 'البطاقات أدناه مرتبة حسب الطلب على هذه الفئة. اختر قطاعًا لعرض التفاصيل.',
              en: 'Cards below are sorted by demand for this category. Pick a sector for details.',
            })}
          </p>
        </motion.section>
      )}

      {/* selected sector detail */}
      {selected && (
        <motion.section
          key={selected.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-strong mb-8 p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">{t({ ar: 'القطاع المحدد', en: 'Selected sector' })}</p>
              <h2 className="mt-1 text-2xl font-bold text-dga-green-deep">{selected.name}</h2>
            </div>
            <button onClick={() => setSelectedId(null)} className="btn-ghost px-3 py-1.5 text-xs">
              {t({ ar: 'إغلاق', en: 'Close' })} ✕
            </button>
          </div>

          {/* sector stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { v: fmt(selected.entityCount), l: { ar: 'جهة في القطاع', en: 'Entities in sector' } },
              { v: fmt(selected.servedEntities), l: { ar: 'جهة مستفيدة', en: 'Served entities' } },
              { v: `${Math.round(selected.logoRatio * 100)}%`, l: { ar: 'تغطية الشعارات', en: 'Logo coverage' } },
              { v: fmt(selected.services?.trainingBeneficiaries ?? 0), l: { ar: 'سجل تدريبي', en: 'Training records' } },
              { v: fmt(selected.services?.consultingServices ?? 0), l: { ar: 'خدمة استشارية', en: 'Consulting services' } },
            ].map((s) => (
              <div key={s.l.en} className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                <p className="text-2xl font-bold text-dga-green-deep" dir="ltr">{s.v}</p>
                <p className="mt-1 text-xs text-dga-muted">{t(s.l)}</p>
              </div>
            ))}
          </div>

          {/* v8: skill demand profile derived from real consulting categories */}
          {selectedProfile.length > 0 && (
            <div className="mt-5 rounded-card border border-dga-green/30 bg-dga-green/5 p-4">
              <h3 className="text-sm font-bold text-dga-green-dark">
                {t({ ar: 'المهارات الأكثر طلبًا في هذا القطاع', en: 'Most-demanded skills in this sector' })}
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {selectedProfile.map((p) => {
                  const d = domainById(p.domainId)
                  return (
                    <span key={p.domainId} className="chip !px-3 !py-1.5 text-xs">
                      <Icon name={d.icon} className="h-3.5 w-3.5 text-dga-green" />
                      {t(d.shortName)}
                      <span className="font-mono font-bold text-dga-green-dark" dir="ltr"> {p.share}%</span>
                    </span>
                  )
                })}
              </div>
              {selectedTopCat && (
                <p className="mt-3 text-xs leading-relaxed text-dga-ink">
                  {t({
                    ar: `طلبت جهات هذا القطاع ${fmt(selectedTopCat.records)} خدمة في فئة «${categoryShort(selectedTopCat.category)}» — مما يشير إلى حاجة متنامية في ${selectedProfile[0] ? domainById(selectedProfile[0].domainId).name.ar : ''}.`,
                    en: `Entities in this sector requested ${fmt(selectedTopCat.records)} services in “${categoryShort(selectedTopCat.category)}” — pointing to a growing need in ${selectedProfile[0] ? domainById(selectedProfile[0].domainId).name.en : ''}.`,
                  })}
                </p>
              )}
              <button onClick={startAssessment} className="btn-primary mt-4 px-4 py-2 text-xs">
                {t({ ar: 'قيّس جاهزيتك لأولويات القطاع', en: 'Measure your readiness for sector priorities' })}
              </button>
            </div>
          )}

          {/* top benefiting entities in sector */}
          {topInSector.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-dga-black">{t({ ar: 'الأعلى استفادة في القطاع', en: 'Top benefiting in this sector' })}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {topInSector.map((e) => (
                  <span key={e.id} className="chip text-[11px]">
                    {e.nameAr}
                    <span className="font-mono font-bold text-dga-green-dark" dir="ltr"> {fmt(e.services!.totalBenefit)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* entity grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sectorEntities.map((e) => (
              <article
                key={e.id}
                onClick={() => openEntity(e.id)}
                onKeyDown={(ev) => ev.key === 'Enter' && openEntity(e.id)}
                role="button"
                tabIndex={0}
                className="flex cursor-pointer items-center gap-3 rounded-card border border-dga-line bg-white p-3 transition-colors hover:border-dga-green"
              >
                <EntityLogo entity={e} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-dga-black" title={e.nameAr}>{e.nameAr}</p>
                  <p className="mt-0.5 truncate text-[11px] text-dga-muted">
                    {e.type} · {e.region}
                  </p>
                  {e.services && (
                    <p className="mt-1 text-[11px] text-dga-green-dark" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      <span className="chip-info !px-1.5 !py-0 text-[10px]">{t({ ar: 'مستفيدة', en: 'served' })}</span>{' '}
                      <span dir="ltr" className="font-mono">
                        {fmt(e.services.trainingBeneficiaries)} / {fmt(e.services.consultingServices)}
                      </span>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-dga-muted">
            {t({ ar: `${sectorEntities.length} جهة في هذا القطاع — الأرقام: تدريب / استشارات.`, en: `${sectorEntities.length} entities in this sector — figures: training / consulting.` })}
          </p>
        </motion.section>
      )}

      {/* sector cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedSectors.map((s, i) => {
          const active = s.id === selectedId
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
              onClick={() => setSelectedId(active ? null : s.id)}
              className={`glass p-5 text-start transition-shadow hover:shadow-card-lg ${active ? 'ring-2 ring-dga-green' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold leading-snug text-dga-black">{s.name}</h2>
                <Icon name="flag" className={`h-5 w-5 shrink-0 ${active ? 'text-dga-green' : 'text-dga-line'}`} />
              </div>

              {/* served ratio bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-dga-muted">
                  <span>{t({ ar: 'الجهات المستفيدة', en: 'Served entities' })}</span>
                  <span dir="ltr" className="font-mono font-bold text-dga-green-dark">
                    {s.servedEntities}/{s.entityCount}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-pill bg-dga-bg" dir="ltr">
                  <div
                    className="h-full rounded-pill bg-dga-green"
                    style={{ width: `${s.entityCount > 0 ? (s.servedEntities / s.entityCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                <span className="chip">{t({ ar: `${s.entityCount} جهة`, en: `${s.entityCount} entities` })}</span>
                <span className="chip">{t({ ar: `شعارات ${Math.round(s.logoRatio * 100)}%`, en: `logos ${Math.round(s.logoRatio * 100)}%` })}</span>
              </div>

              {s.services ? (
                <p className="mt-3 border-t border-dga-line pt-3 text-xs text-dga-ink">
                  <span className="font-bold text-dga-green-dark" dir="ltr">{fmt(s.services.trainingBeneficiaries)}</span>{' '}
                  {t({ ar: 'سجل تدريبي', en: 'training records' })}
                  {' · '}
                  <span className="font-bold text-dga-green-dark" dir="ltr">{fmt(s.services.consultingServices)}</span>{' '}
                  {t({ ar: 'خدمة استشارية', en: 'consulting services' })}
                </p>
              ) : (
                <p className="mt-3 border-t border-dga-line pt-3 text-xs text-dga-muted">
                  {t({ ar: 'لا خدمات مسجلة بعد', en: 'No services recorded yet' })}
                </p>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* cross-link */}
      <div className="glass-strong mt-10 flex flex-col items-center gap-3 p-8 text-center">
        <Icon name="compass" className="h-8 w-8 text-dga-green" />
        <p className="max-w-xl text-sm text-dga-muted">
          {t({
            ar: 'تبحث عن جهة بعينها؟ الدليل الكامل يتيح البحث بالاسم العربي أو الإنجليزي والتصفية حسب القطاع والنوع والمنطقة.',
            en: 'Looking for a specific entity? The full directory supports Arabic/English search and filters by sector, type, and region.',
          })}
        </p>
        <button onClick={() => go('directory')} className="btn-primary px-6 py-2.5 text-sm">
          {t({ ar: 'افتح دليل الجهات', en: 'Open the entity directory' })}
        </button>
      </div>
    </div>
  )
}
