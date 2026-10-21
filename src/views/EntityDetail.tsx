import { motion } from 'framer-motion'
import { useApp } from '../store'
import { govEntities } from '../data/govEntities'
import { entityYearlyTraining, TRAINING_YEARS } from '../data/govEntityDetails'
import { entitySkillProfile } from '../data/sectorSkills'
import { domains, domainById } from '../data/domains'
import EntityLogo from '../components/EntityLogo'
import Icon from '../components/Icon'

const fmt = (n: number) => n.toLocaleString('en-US')
const GREEN = '#1B8354'
const AMBER = '#DBA102'
const GREEN_DEEP = '#167248'
const MUTED = '#4D5761'

export default function EntityDetail() {
  const { t, lang, go, pendingEntityId, setTrackId } = useApp()
  const entity = govEntities.find((e) => e.id === pendingEntityId) ?? null

  if (!entity) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-dga-muted">{t({ ar: 'لم تُحدَّد جهة. افتح دليل الجهات واختر جهة لعرضها.', en: 'No entity selected. Open the directory and pick an entity.' })}</p>
        <button onClick={() => go('directory')} className="btn-primary mt-5 px-6 py-2.5 text-sm">
          {t({ ar: 'افتح دليل الجهات', en: 'Open the entity directory' })}
        </button>
      </div>
    )
  }

  const profile = entitySkillProfile(entity.id)
  const yearly = entityYearlyTraining[entity.id]
  const maxYear = yearly ? Math.max(...yearly, 1) : 1
  const svc = entity.services

  const startAssessment = () => {
    setTrackId('awareness') // generalist track — every employee
    go('wizard')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <button onClick={() => go('directory')} className="btn-ghost mb-6 px-3 py-1.5 text-xs">
        <span aria-hidden>{lang === 'ar' ? '→' : '←'} </span>
        {t({ ar: 'عودة إلى دليل الجهات', en: 'Back to the directory' })}
      </button>

      {/* header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-strong p-6">
        <div className="flex flex-wrap items-center gap-5">
          <EntityLogo entity={entity} className="h-20 w-20 text-2xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-dga-green-deep">{entity.nameAr}</h1>
              {svc && (
                <span className="chip-info">{t({ ar: 'جهة مستفيدة', en: 'Served entity' })}</span>
              )}
            </div>
            {entity.nameEn && <p className="mt-1 text-sm text-dga-muted" dir="ltr">{entity.nameEn}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              <span className="chip">{entity.sector}</span>
              <span className="chip">{entity.type}</span>
              <span className="chip">{entity.scope}</span>
              <span className="chip">{entity.region}</span>
              {entity.hq && <span className="chip">{entity.hq}</span>}
            </div>
          </div>
          {entity.website && (
            <a
              href={entity.website.startsWith('http') ? entity.website : `https://${entity.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-xs"
              dir="ltr"
            >
              <Icon name="cloud" className="h-4 w-4" />
              {entity.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </motion.div>

      {/* service record */}
      {svc ? (
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="glass mt-6 p-6">
          <h2 className="text-lg font-bold text-dga-green-dark">{t({ ar: 'سجل الاستفادة من الخدمات', en: 'Service utilization record' })}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: fmt(svc.trainingBeneficiaries), l: { ar: 'سجل تدريبي', en: 'Training records' } },
              { v: fmt(svc.trainingPrograms), l: { ar: 'برنامجًا تدريبيًا', en: 'Training programs' } },
              { v: fmt(svc.consultingServices), l: { ar: 'خدمة استشارية', en: 'Consulting services' } },
              { v: fmt(svc.totalBenefit), l: { ar: 'إجمالي الاستفادة', en: 'Total benefit' } },
            ].map((s) => (
              <div key={s.l.en} className="rounded-card border border-dga-line bg-dga-bg p-4 text-center">
                <p className="text-2xl font-bold text-dga-green-deep" dir="ltr">{s.v}</p>
                <p className="mt-1 text-xs text-dga-muted">{t(s.l)}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-dga-muted">
            {svc.consultingYears && <>{t({ ar: `فترة الاستشارات: ${svc.consultingYears}`, en: `Consulting period: ${svc.consultingYears}` })}{' · '}</>}
            {svc.lastYear && <>{t({ ar: `آخر خدمة: ${svc.lastYear}`, en: `Last service: ${svc.lastYear}` })}</>}
          </p>

          {/* yearly training bars */}
          {yearly && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-dga-black">{t({ ar: 'السجلات التدريبية حسب السنة', en: 'Training records by year' })}</h3>
              <svg viewBox="0 0 420 130" className="mt-3 w-full max-w-lg" role="img" aria-label="entity yearly training">
                {yearly.map((v, i) => {
                  const bw = 44
                  const gap = (420 - 6 * bw) / 7
                  const x = gap + i * (bw + gap)
                  const h = (v / maxYear) * 78
                  const partial = TRAINING_YEARS[i] === 2026
                  return (
                    <g key={TRAINING_YEARS[i]}>
                      <text x={x + bw / 2} y={94 - h} textAnchor="middle" fontSize="11" fontWeight="700" fill={partial ? AMBER : GREEN_DEEP}>{v}</text>
                      <rect x={x} y={100 - h} width={bw} height={Math.max(h, v > 0 ? 3 : 0)} rx={5} fill={partial ? AMBER : GREEN} className="bar-intro-y" style={{ animationDelay: `${i * 55}ms` }} />
                      <text x={x + bw / 2} y={116} textAnchor="middle" fontSize="11" fill={MUTED}>{TRAINING_YEARS[i]}</text>
                    </g>
                  )
                })}
              </svg>
              <p className="mt-1 text-[11px] text-dga-muted">{t({ ar: '2026 سنة جزئية.', en: '2026 is a partial year.' })}</p>
            </div>
          )}

          {/* top consulting verbatim */}
          {svc.topConsulting && (
            <div className="mt-6 rounded-btn bg-dga-bg p-4">
              <h3 className="text-sm font-bold text-dga-black">{t({ ar: 'أبرز الخدمات الاستشارية', en: 'Top consulting services' })}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-dga-ink">{svc.topConsulting}</p>
            </div>
          )}
        </motion.section>
      ) : (
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="glass mt-6 p-6">
          <p className="text-sm text-dga-muted">
            {t({ ar: 'لم تستفد هذه الجهة من خدمات التدريب أو الاستشارات في الفترة الموثقة (2021–2026).', en: 'This entity has no recorded training or consulting utilization in the documented period (2021–2026).' })}
          </p>
        </motion.section>
      )}

      {/* skill needs derivation */}
      {profile.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }} className="glass mt-6 border-s-4 border-dga-green p-6">
          <h2 className="text-lg font-bold text-dga-green-dark">{t({ ar: 'ما الذي تحتاجه جهتك؟', en: 'What does your entity need?' })}</h2>
          <p className="mt-1 text-xs text-dga-muted">
            {t({
              ar: 'مشتق من الفئات الاستشارية التي طلبتها هذه الجهة فعليًا، عبر جدول الربط الموثق في المنهجية — وليس افتراضًا.',
              en: 'Derived from the consulting categories this entity actually requested, via the documented mapping in the methodology — not assumed.',
            })}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.map((p) => {
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
          <button onClick={startAssessment} className="btn-primary mt-5 px-5 py-2.5 text-sm">
            {t({ ar: 'قيّس جاهزيتك لأولويات جهتك', en: 'Measure your readiness for your entity’s priorities' })}
          </button>
        </motion.section>
      )}

      {/* explore domains */}
      <div className="mt-8 flex flex-wrap gap-2">
        {domains.map((d) => (
          <span key={d.id} className="chip-info text-[10.5px]">{t(d.shortName)}</span>
        ))}
      </div>
    </div>
  )
}
