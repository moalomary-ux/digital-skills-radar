import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../store'
import { domains, domainById } from '../data/domains'
import { skillRecords } from '../data/skillRecords'
import { tracks, trackById } from '../data/tracks'
import type { TrackId } from '../data/tracks'
import Icon from '../components/Icon'

export default function SkillRegistry() {
  const { t, lang } = useApp()
  const [query, setQuery] = useState('')
  const [fDomain, setFDomain] = useState<string | null>(null)
  const [fTrack, setFTrack] = useState<TrackId | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return skillRecords.filter(
      (r) =>
        (!fDomain || r.domainId === fDomain) &&
        (!fTrack || r.audienceTracks.includes(fTrack)) &&
        (q.length === 0 ||
          r.name.ar.toLowerCase().includes(q) ||
          r.name.en.toLowerCase().includes(q) ||
          r.definition.ar.toLowerCase().includes(q) ||
          r.definition.en.toLowerCase().includes(q))
    )
  }, [query, fDomain, fTrack])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'كل مهارة سجل مستقل — نسخة 1.0', en: 'Every skill is its own record — v1.0' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t({ ar: 'سجل المهارات', en: 'Skill Registry' })}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'أربعون سجلًا مهاريًا موثقًا: التعريف، والجمهور، والمهمة المثال، وأساس الدليل، والمتطلبات السابقة، وعبارة التقييم المرتبطة — مع نسخة وتاريخ مراجعة لكل سجل.',
            en: 'Forty documented skill records: definition, audience, example task, evidence basis, prerequisites, and the linked assessment statement — each versioned with a review date.',
          })}
        </p>
      </div>

      {/* filters */}
      <div className="no-print mb-6 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t({ ar: 'ابحث في السجل…', en: 'Search the registry…' })}
          className="w-full max-w-md rounded-btn border border-dga-line bg-white px-3 py-2 text-sm outline-none focus:border-dga-green"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'المجال:', en: 'Domain:' })}</span>
          <button onClick={() => setFDomain(null)} className={`chip ${fDomain === null ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`}>
            {t({ ar: 'الكل', en: 'All' })}
          </button>
          {domains.map((d) => (
            <button key={d.id} onClick={() => setFDomain(fDomain === d.id ? null : d.id)} className={`chip ${fDomain === d.id ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`}>
              {t(d.shortName)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-dga-muted">{t({ ar: 'المسار:', en: 'Track:' })}</span>
          <button onClick={() => setFTrack(null)} className={`chip ${fTrack === null ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`}>
            {t({ ar: 'الكل', en: 'All' })}
          </button>
          {tracks.map((tr) => (
            <button key={tr.id} onClick={() => setFTrack(fTrack === tr.id ? null : tr.id)} className={`chip ${fTrack === tr.id ? 'border-dga-green bg-dga-green font-semibold !text-white' : ''}`}>
              {t(tr.name)}
            </button>
          ))}
        </div>
        <p className="text-xs text-dga-muted">{t({ ar: `${filtered.length} من 40 سجلًا`, en: `${filtered.length} of 40 records` })}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((r, i) => {
          const d = domainById(r.domainId)
          return (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: (i % 2) * 0.05 }}
              className="glass flex flex-col p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="chip text-[10.5px]">
                  <Icon name={d.icon} className="h-3 w-3 text-dga-green" />
                  {t(d.shortName)}
                </span>
                <span className="font-mono text-[10px] text-dga-muted" dir="ltr">
                  v{r.version} · {r.lastReviewed}
                </span>
              </div>
              <h2 className="mt-3 font-bold leading-snug text-dga-black">{t(r.name)}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-dga-ink">{t(r.definition)}</p>

              <div className="mt-3 space-y-2 text-[12px] leading-relaxed">
                <p className="rounded-btn bg-dga-bg p-2.5 text-dga-ink">
                  <span className="font-bold text-dga-green-dark">{t({ ar: 'المهمة المثال: ', en: 'Example task: ' })}</span>
                  {t(r.exampleTask)}
                </p>
                <p className="rounded-btn bg-dga-bg p-2.5 text-dga-muted">
                  <span className="font-bold text-dga-ink">{t({ ar: 'أساس الدليل: ', en: 'Evidence basis: ' })}</span>
                  {t(r.evidence)}
                </p>
                <p className="text-dga-muted">
                  <span className="font-bold text-dga-ink">{t({ ar: 'المتطلبات السابقة: ', en: 'Prerequisites: ' })}</span>
                  {t(r.prerequisites)}
                  {' · '}
                  <span className="font-bold text-dga-ink">{t({ ar: 'عبارة التقييم: ', en: 'Assessment item: ' })}</span>
                  <span className="font-mono" dir="ltr">{r.assessmentRef}</span>
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-dga-line pt-3">
                {r.audienceTracks.map((tid) => (
                  <span key={tid} className="chip-info text-[10px]">{t(trackById(tid)!.name)}</span>
                ))}
              </div>
            </motion.article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass p-10 text-center text-dga-muted">
          {t({ ar: 'لا سجلات تطابق الفلاتر.', en: 'No records match the filters.' })}
        </div>
      )}
    </div>
  )
}
