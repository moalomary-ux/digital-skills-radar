import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { familyNames, familyOrder, libraryRoles, LIB_PREFIX } from '../data/roleLibrary'
import type { LibraryRole } from '../data/roleLibrary'
import RadarChart from '../components/RadarChart'

export default function Roles() {
  const { t, lang, go, setRoleId } = useApp()
  const [openId, setOpenId] = useState<string | null>(null)

  const open = openId ? libraryRoles.find((r) => r.id === openId) : null

  const pickRole = (role: LibraryRole) => {
    setRoleId(LIB_PREFIX + role.id)
    go('wizard')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'مرجعية DDaT البريطانية وإطار SFIA 9', en: 'Grounded in UK DDaT & SFIA 9' })}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          {t({ ar: 'مكتبة ', en: 'The ' })}
          <span className="gradient-text">{t({ ar: 'الأدوار الوظيفية الرقمية', en: 'Digital Role Library' })}</span>
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'عشرون دوراً في الحكومة الرقمية، موزعة على ست عائلات، ولكل دور مستهدفات مهارية دقيقة عبر المجالات الثمانية. اختر دورك ليصبح هو المضلع البنفسجي في تقييمك.',
            en: 'Twenty digital-government roles across six families, each with precise skill targets across the eight domains. Pick your role and it becomes the violet polygon in your assessment.',
          })}
        </p>
      </div>

      {familyOrder.map((fam) => {
        const famRoles = libraryRoles.filter((r) => r.family === fam)
        if (famRoles.length === 0) return null
        return (
          <section key={fam} className="mb-10">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-dga-black">
              <span className="h-px w-8 bg-gradient-to-r from-dga-green to-dga-green-ink" />
              {t(familyNames[fam])}
              <span className="text-sm font-normal text-dga-muted">{famRoles.length}</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {famRoles.map((r, i) => {
                const isOpen = openId === r.id
                return (
                  <motion.button
                    key={r.id}
                    onClick={() => setOpenId(isOpen ? null : r.id)}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`glass p-5 text-start transition-all duration-300 hover:border-dga-green/50 ${
                      isOpen ? 'border-dga-green bg-dga-green/5' : ''
                    }`}
                  >
                    <h3 className="font-bold leading-snug">{t(r.name)}</h3>
                    <p className="mt-1 text-[11px] text-dga-muted" dir={lang === 'ar' ? 'ltr' : 'rtl'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      {lang === 'ar' ? r.name.en : r.name.ar}
                    </p>
                    <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-dga-muted">{t(r.mission)}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.sfia.map((code) => (
                        <span key={code} className="rounded-md bg-dga-bg px-1.5 py-0.5 font-mono text-[10px] text-dga-muted">
                          {code}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* role detail overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong max-h-[88vh] w-full max-w-4xl overflow-y-auto p-6 sm:p-8"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="chip border-dga-amber/40 bg-dga-amber/10 text-[11px] text-dga-amber">{t(familyNames[open.family])}</span>
                  <h2 className="mt-3 text-2xl font-bold">{t(open.name)}</h2>
                  <p className="mt-1 text-sm text-dga-muted" dir={lang === 'ar' ? 'ltr' : 'rtl'} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    {lang === 'ar' ? open.name.en : open.name.ar}
                  </p>
                </div>
                <button onClick={() => setOpenId(null)} className="text-xl text-dga-muted hover:text-dga-green-dark" aria-label="close">
                  ✕
                </button>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold text-dga-green">{t({ ar: 'المهمة', en: 'Mission' })}</h3>
                  <p className="mt-2 leading-relaxed text-dga-ink">{t(open.mission)}</p>

                  <h3 className="mt-6 text-sm font-bold text-dga-green">{t({ ar: 'المسؤوليات الأساسية', en: 'Core responsibilities' })}</h3>
                  <ul className="mt-2 space-y-2.5">
                    {open.responsibilities.map((resp, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-dga-ink">
                        <span className="mt-0.5 text-dga-green-dark">▸</span>
                        {t(resp)}
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-6 text-sm font-bold text-dga-green">{t({ ar: 'رموز SFIA 9 المرتبطة', en: 'Linked SFIA 9 codes' })}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {open.sfia.map((code) => (
                      <a
                        key={code}
                        href="https://sfia-online.org/en/sfia-9/skills/all-skills-a-z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip font-mono text-[11px] text-dga-ink no-underline hover:border-dga-green hover:text-dga-green"
                      >
                        {code}
                      </a>
                    ))}
                  </div>

                  <button onClick={() => pickRole(open)} className="btn-primary mt-7 text-sm">
                    {t({ ar: 'قيّم نفسك مقابل هذا الدور', en: 'Assess yourself against this role' })}
                    <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-dga-green">{t({ ar: 'المستهدفات المهارية للدور', en: 'Role skill targets' })}</h3>
                  <p className="mt-1 text-xs text-dga-muted">
                    {t({ ar: 'المضلع = المستوى المستهدف في كل مجال (1–4)', en: 'Polygon = target level per domain (1–4)' })}
                  </p>
                  <div className="mt-2 rounded-2xl border border-dga-line bg-dga-bg p-2">
                    <RadarChart
                      labels={domains.map((d) => d.shortName)}
                      values={domains.map((d) => open.targets[d.id] ?? 0)}
                      targets={domains.map(() => 4)}
                      lang={lang}
                      animate
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
