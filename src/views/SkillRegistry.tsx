import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { skillRecords } from '../data/skillRecords'
import type { SkillRecord } from '../data/skillRecords'
import { statements } from '../data/statements'
import { tracks, trackById } from '../data/tracks'
import type { TrackId } from '../data/tracks'
import { ClaimText } from '../components/Claim'
import Icon from '../components/Icon'
import type { L } from '../data/types'

const ui = {
  eyebrow: { ar: 'الأدوار والمهارات', en: 'Roles and skills' },
  title: { ar: 'قاموس المهارات', en: 'Skills dictionary' },
  intro: {
    ar: 'يضم السجل {{method-skills-count}} في {{method-domains-count}}، ولكل مهارة سجل مستقل: التعريف، وفئات الدور التي تحتاجها، ومهمة مثال، وأساس الدليل، والمتطلبات السابقة، وعبارة التقييم الذاتي المرتبطة بها.',
    en: 'The registry holds {{method-skills-count}} in {{method-domains-count}}, and each skill has its own record: definition, the role categories that need it, an example task, the evidence basis, prerequisites and the linked self-assessment statement.',
  },
  search: { ar: 'ابحث في المهارات', en: 'Search the skills' },
  searchPh: { ar: 'اكتب كلمة مثل: البيانات، الخصوصية، الرحلة…', en: 'Type a word such as data, privacy, journey…' },
  domain: { ar: 'المجال:', en: 'Domain:' },
  category: { ar: 'فئة الدور:', en: 'Role category:' },
  all: { ar: 'الكل', en: 'All' },
  shown: { ar: 'مهارة معروضة', en: 'skills shown' },
  of: { ar: 'من', en: 'of' },
  clear: { ar: 'امسح البحث وعوامل التصفية', en: 'Clear search and filters' },
  expandAll: { ar: 'افتح كل السجلات', en: 'Expand all records' },
  collapseAll: { ar: 'أغلق كل السجلات', en: 'Collapse all records' },
  none: { ar: 'لا مهارات تطابق البحث وعوامل التصفية.', en: 'No skills match the search and filters.' },
  task: { ar: 'مهمة مثال', en: 'Example task' },
  evidence: { ar: 'أساس الدليل', en: 'Evidence basis' },
  prereq: { ar: 'المتطلبات السابقة', en: 'Prerequisites' },
  statement: { ar: 'عبارة التقييم الذاتي', en: 'Self-assessment statement' },
  categories: { ar: 'فئات الدور', en: 'Role categories' },
  version: { ar: 'الإصدار وتاريخ المراجعة', en: 'Version and review date' },
  editorial: {
    ar: 'سجلات تحريرية لم تُختبر ميدانيًا بعد؛ أساس الدليل يصف أطر عائلة المهارة لا المهارة المفردة.',
    en: 'Editorial records, not yet field-tested; the evidence basis describes the frameworks for the skill family, not the single skill.',
  },
} satisfies Record<string, L>

/** Arabic-aware normalization for live search: no diacritics, unified alef, yaa and taa marbuta. */
function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
}

const statementText = new Map(statements.map((s) => [s.id, s.text]))

function haystack(r: SkillRecord): string {
  const st = statementText.get(r.assessmentRef)
  return normalizeSearch(
    [r.name.ar, r.name.en, r.definition.ar, r.definition.en, r.exampleTask.ar, r.exampleTask.en, r.prerequisites.ar, r.prerequisites.en, st?.ar ?? '', st?.en ?? ''].join(' ')
  )
}

const index = new Map(skillRecords.map((r) => [r.id, haystack(r)]))

const domainFromHash = (hash: string) => {
  const m = /^#domain-([a-z-]+)$/.exec(hash)
  return m && domains.some((d) => d.id === m[1]) ? m[1] : null
}

export default function SkillRegistry() {
  const { t } = useApp()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [fDomain, setFDomain] = useState<string | null>(() => domainFromHash(location.hash))
  const [fTrack, setFTrack] = useState<TrackId | null>(null)
  const [open, setOpen] = useState<Set<string>>(() => new Set())

  // a link such as /ar/skills#domain-cyber preselects the domain
  useEffect(() => {
    const d = domainFromHash(location.hash)
    if (d) setFDomain(d)
  }, [location.hash])

  const filtered = useMemo(() => {
    const terms = normalizeSearch(query).split(' ').filter(Boolean)
    return skillRecords.filter(
      (r) =>
        (!fDomain || r.domainId === fDomain) &&
        (!fTrack || r.audienceTracks.includes(fTrack)) &&
        terms.every((q) => (index.get(r.id) ?? '').includes(q))
    )
  }, [query, fDomain, fTrack])
  const visibleIds = new Set(filtered.map((r) => r.id))
  const anyFilter = query.trim() !== '' || fDomain !== null || fTrack !== null
  const allOpen = filtered.length > 0 && filtered.every((r) => open.has(r.id))

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const chip = (on: boolean) =>
    `chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${on ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green'}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t(ui.title)}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          <ClaimText text={t(ui.intro)} />
        </p>
        <p className="mt-2 text-xs text-dga-muted">{t(ui.editorial)}</p>
      </div>

      {/* live search + filters */}
      <div className="no-print mb-6 space-y-3">
        <label className="block max-w-md">
          <span className="mb-1 block text-xs font-semibold text-dga-muted">{t(ui.search)}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(ui.searchPh)}
            className="w-full rounded-btn border border-dga-line bg-white px-3 py-2 text-sm outline-none focus:border-dga-green focus-visible:ring-2 focus-visible:ring-dga-green"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t(ui.domain)}>
          <span className="text-xs font-semibold text-dga-muted" aria-hidden>
            {t(ui.domain)}
          </span>
          <button type="button" aria-pressed={fDomain === null} onClick={() => setFDomain(null)} className={chip(fDomain === null)}>
            {t(ui.all)}
          </button>
          {domains.map((d) => (
            <button key={d.id} type="button" aria-pressed={fDomain === d.id} onClick={() => setFDomain(fDomain === d.id ? null : d.id)} className={chip(fDomain === d.id)}>
              <Icon name={d.icon} className="h-3 w-3" />
              {t(d.shortName)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t(ui.category)}>
          <span className="text-xs font-semibold text-dga-muted" aria-hidden>
            {t(ui.category)}
          </span>
          <button type="button" aria-pressed={fTrack === null} onClick={() => setFTrack(null)} className={chip(fTrack === null)}>
            {t(ui.all)}
          </button>
          {tracks.map((tr) => (
            <button key={tr.id} type="button" aria-pressed={fTrack === tr.id} onClick={() => setFTrack(fTrack === tr.id ? null : tr.id)} className={chip(fTrack === tr.id)}>
              {t(tr.name)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-dga-muted" aria-live="polite">
            {`${filtered.length} ${t(ui.of)} ${skillRecords.length} ${t(ui.shown)}`}
          </p>
          {anyFilter ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setFDomain(null)
                setFTrack(null)
              }}
              className="text-xs font-semibold text-dga-green-dark underline underline-offset-2"
            >
              {t(ui.clear)}
            </button>
          ) : null}
          {filtered.length > 0 ? (
            <button
              type="button"
              onClick={() => setOpen(allOpen ? new Set() : new Set(filtered.map((r) => r.id)))}
              className="text-xs font-semibold text-dga-green-dark underline underline-offset-2"
            >
              {t(allOpen ? ui.collapseAll : ui.expandAll)}
            </button>
          ) : null}
        </div>
      </div>

      {/* one section per domain: /skills#domain-<id> (the map's «مهارات المجال في قاموس المهارات») lands on it */}
      <div className="space-y-8">
        {domains.map((dom) => {
          const records = skillRecords.filter((r) => r.domainId === dom.id)
          if (records.length === 0) return null
          const anyShown = records.some((r) => visibleIds.has(r.id))
          return (
            <section
              key={dom.id}
              id={`domain-${dom.id}`}
              aria-labelledby={`domain-${dom.id}-title`}
              className={`scroll-mt-24 ${anyShown ? '' : 'hidden print:block'}`}
            >
              <h2 id={`domain-${dom.id}-title`} className="mb-3 flex items-center gap-2 text-lg font-bold text-dga-green-deep">
                <Icon name={dom.icon} className="h-5 w-5 text-dga-green" />
                {t(dom.name)}
              </h2>
              <ul className="grid gap-3 md:grid-cols-2">
                {records.map((r) => {
                  const isOpen = open.has(r.id)
                  const shown = visibleIds.has(r.id)
                  const st = statementText.get(r.assessmentRef)
                  const panelId = `sr-panel-${r.id}`
                  return (
                    <li key={r.id} id={r.id} className={`glass flex-col p-5 ${shown ? 'flex' : 'hidden print:flex'}`}>
                      {/* the domain is the section heading above, so the card no longer repeats it */}
                      <h3 className="font-bold leading-snug text-dga-black">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggle(r.id)}
                          className="flex w-full items-start justify-between gap-3 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green"
                        >
                          <span>{t(r.name)}</span>
                          <span className={`no-print shrink-0 text-dga-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden>
                            ▾
                          </span>
                        </button>
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-dga-ink">{t(r.definition)}</p>

                      <div id={panelId} className={`mt-3 space-y-2 text-[12.5px] leading-relaxed ${isOpen ? 'block' : 'hidden print:block'}`}>
                        <p className="rounded-btn bg-dga-bg p-2.5 text-dga-ink">
                          <span className="font-bold text-dga-green-dark">{`${t(ui.task)}: `}</span>
                          {t(r.exampleTask)}
                        </p>
                        {st ? (
                          <p className="rounded-btn border border-dga-line p-2.5 text-dga-ink">
                            <span className="font-bold text-dga-green-dark">{`${t(ui.statement)}: `}</span>
                            {t(st)}
                          </p>
                        ) : null}
                        <p className="text-dga-muted">
                          <span className="font-bold text-dga-ink">{`${t(ui.prereq)}: `}</span>
                          {t(r.prerequisites)}
                        </p>
                        <p className="text-dga-muted">
                          <span className="font-bold text-dga-ink">{`${t(ui.evidence)}: `}</span>
                          {t(r.evidence)}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 border-t border-dga-line pt-2.5">
                          <span className="text-[11px] font-semibold text-dga-muted">{`${t(ui.categories)}: `}</span>
                          {r.audienceTracks.map((tid) => (
                            <span key={tid} className="chip-info text-[10.5px]">
                              {t(trackById(tid)!.name)}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-dga-muted">
                          {`${t(ui.version)}: `}
                          <span dir="ltr">{`v${r.version} · ${r.lastReviewed}`}</span>
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      {filtered.length === 0 && <div className="glass mt-3 p-10 text-center text-dga-muted">{t(ui.none)}</div>}
    </div>
  )
}
