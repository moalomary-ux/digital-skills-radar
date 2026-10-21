import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { domainById } from '../../data/domains'
import { shifts, SHIFTS_REVIEWED_ON } from '../../data/leaders/shifts'
import { audienceNames, briefMeta, briefQuestions, BRIEF_REVIEWED_ON, ownedDecisions } from '../../data/leaders/brief'
import type { BriefAudience } from '../../data/leaders/brief'
import { claimById } from '../../data/claims'
import Claim from '../../components/Claim'
import type { L, Lang } from '../../data/types'

/** Print rules live with the page: A4, no site chrome, no animation, ≤ 2 pages. */
const PRINT_CSS = `
.claim-host > span.inline-flex { display: inline; }
.claim-host > span.inline-flex > abbr { margin-inline-start: 0.35rem; vertical-align: baseline; }
@media print {
  @page { size: A4; margin: 10mm 11mm 11mm; }
  header, footer, nav, .no-print { display: none !important; }
  html, body { background: #fff !important; }
  .brief-root, .brief-root * { line-height: 1.34 !important; }
  .brief-root p, .brief-root li, .brief-root dd, .brief-root dt, .brief-root span, .brief-root a, .brief-root time { font-size: 8.1pt !important; }
  .brief-root abbr { font-size: 6.6pt !important; padding: 0 0.3rem !important; }
  .brief-root h1 { font-size: 15pt !important; }
  .brief-root h2 { font-size: 10.5pt !important; break-after: avoid; page-break-after: avoid; }
  .brief-root h3 { font-size: 8.8pt !important; }
  .brief-root .print-small, .brief-root .print-small * { font-size: 7.2pt !important; }
  .print-avoid { break-inside: avoid; page-break-inside: avoid; }
  .brief-root a { color: inherit; text-decoration: none; }
}
`

function formatDay(iso: string, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-nu-latn-ca-gregory' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`))
  } catch {
    return iso
  }
}

function ClaimSentence({ id }: { id: string }) {
  const { t } = useApp()
  const c = claimById(id)
  if (!c) return null
  return <Claim id={id}>{t(c.text)}</Claim>
}

function DomainChip({ id }: { id: string }) {
  const { t } = useApp()
  return <span className="chip-info whitespace-nowrap">{t(domainById(id).shortName)}</span>
}

const label = {
  printBrief: { ar: 'اطبع الموجز', en: 'Print the brief' },
  takeCheck: { ar: 'ابدأ فحص القرار القيادي', en: 'Take the leader judgment check' },
  shiftsTitle: { ar: '5 تحولات في العمل الحكومي 2026–2030', en: '5 shifts in government work, 2026–2030' },
  whatChanges: { ar: 'ما الذي يتغير', en: 'What changes' },
  requires: { ar: 'المهارة المطلوبة', en: 'The skill it asks for' },
  decision: { ar: 'القرار المطلوب منك هذا العام', en: 'The decision you need to make this year' },
  signal: { ar: 'إشارة من مصدر منشور', en: 'A signal from a published source' },
  unchanged: { ar: 'ما الذي لا يتغير', en: 'What does not change' },
  decisionsTitle: { ar: '3 قرارات تملكها هذا العام', en: '3 decisions you own this year' },
  answers: { ar: 'يجيب عن التحول', en: 'Answers shift' },
  questionsTitle: { ar: '10 أسئلة تطرحها على مدير التقنية ومدير الموارد البشرية', en: '10 questions to ask your CIO and your HR director' },
  listenFor: { ar: 'إجابة تطمئنك:', en: 'A reassuring answer:' },
  nextTitle: { ar: 'خطوتك التالية', en: 'Your next step' },
  checkCard: {
    ar: '8 مواقف قيادية في نحو 6 دقائق، والمخرج 3 قرارات تستحق وقتك. بلا درجة ولا مقارنة.',
    en: '8 leadership situations in about 6 minutes, ending with 3 decisions worth your time. No score, no comparison.',
  },
  mapTitle: { ar: 'خريطة تحوّل العمل الحكومي', en: 'The government work-shift map' },
  mapCard: {
    ar: 'كيف تتغير مهام 8 أسر وظيفية حكومية، وماذا يفعل المدير الآن.',
    en: 'How the tasks of 8 government job families are changing, and what managers can do now.',
  },
  open: { ar: 'افتح', en: 'Open' },
  sources: { ar: 'المصادر', en: 'Sources' },
  sourcesNote: {
    ar: 'الأرقام والإشارات أعلاه مسجلة في سجل الأدلة بمصدرها ودرجة الثقة بها.',
    en: 'The figures and signals above are registered in the evidence log with their source and confidence level.',
  },
} satisfies Record<string, L>

export default function LeaderBrief() {
  const { t, lang } = useApp()
  const href = (path: string) => `/${lang}/${path}`
  const reviewed = BRIEF_REVIEWED_ON > SHIFTS_REVIEWED_ON ? BRIEF_REVIEWED_ON : SHIFTS_REVIEWED_ON
  const shiftNumber = (id: string) => shifts.findIndex((s) => s.id === id) + 1
  const spanLast = shifts.length % 2 === 1

  const usedClaimIds = Array.from(
    new Set([
      briefMeta.contextClaimId,
      ...shifts.map((s) => s.claimId),
      ...ownedDecisions.flatMap((d) => (d.claimId ? [d.claimId] : [])),
    ]),
  )
  const audiences: BriefAudience[] = ['cio', 'hr']

  return (
    <div className="brief-root mx-auto max-w-6xl px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* ── Title ─────────────────────────────────────────────── */}
      <section aria-labelledby="brief-title" className="mb-10 print:mb-3">
        <p className="eyebrow">{t(briefMeta.eyebrow)}</p>
        <h1 id="brief-title" tabIndex={-1} className="mt-2 text-3xl font-bold text-dga-black sm:text-4xl">
          {t(briefMeta.title)}
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-dga-muted print:mt-1 print:max-w-none">{t(briefMeta.lede)}</p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm print:mt-1">
          <span className="chip">{t(briefMeta.independence)}</span>
          <span className="text-dga-muted">
            {t(briefMeta.reviewedLabel)}: <time dateTime={reviewed}>{formatDay(reviewed, lang)}</time>
          </span>
        </p>
        <p className="claim-host mt-4 max-w-3xl rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 px-4 py-3 text-sm leading-relaxed text-dga-ink print:mt-1.5 print:max-w-none print:py-1">
          <ClaimSentence id={briefMeta.contextClaimId} />
        </p>
        <div className="no-print mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={() => window.print()}>
            {t(label.printBrief)}
          </button>
          <Link to={href('leaders/check')} className="btn-ghost hover:no-underline">
            {t(label.takeCheck)}
          </Link>
        </div>
      </section>

      {/* ── 5 shifts ──────────────────────────────────────────── */}
      <section aria-labelledby="shifts-title" className="mb-12 print:mb-3">
        <h2 id="shifts-title" className="text-2xl font-bold text-dga-black">
          {t(label.shiftsTitle)}
        </h2>
        <ol className="mt-5 grid gap-5 lg:grid-cols-2 print:mt-2 print:block">
          {shifts.map((s, i) => (
            <li
              key={s.id}
              className={`glass print-avoid flex flex-col p-5 print:mb-2 print:rounded-none print:border-0 print:border-b print:border-dga-line print:p-0 print:pb-2 ${
                spanLast && i === shifts.length - 1 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-dga-green text-sm font-bold text-white print:h-6 print:w-6"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug text-dga-black">
                    <span className="sr-only">{i + 1}. </span>
                    {t(s.title)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-dga-ink print:mt-0">
                    <span className="sr-only">{t(label.whatChanges)}: </span>
                    {t(s.change)}
                  </p>
                </div>
              </div>
              <dl
                className={`mt-4 grid gap-3 text-sm leading-relaxed print:mt-1 print:grid-cols-3 print:gap-x-4 print:gap-y-0.5 ${
                  spanLast && i === shifts.length - 1 ? 'lg:grid-cols-2 lg:gap-x-6' : ''
                }`}
              >
                <div>
                  <dt className="font-semibold text-dga-green-dark">{t(label.requires)}</dt>
                  <dd className="mt-0.5 text-dga-ink">
                    {t(s.requires)}{' '}
                    <span className="mt-1 inline-flex flex-wrap gap-1 align-middle">
                      {[s.domainId, ...s.relatedDomainIds].map((d) => (
                        <DomainChip key={d} id={d} />
                      ))}
                    </span>
                  </dd>
                </div>
                <div className="rounded-btn bg-dga-green/5 px-3 py-2 print:bg-transparent print:p-0">
                  <dt className="font-semibold text-dga-green-dark">{t(label.decision)}</dt>
                  <dd className="mt-0.5 font-medium text-dga-black">{t(s.decision)}</dd>
                </div>
                <div className="print-small print:order-last print:col-span-3 print:flex print:gap-1.5">
                  <dt className="font-semibold text-dga-green-dark">
                    {t(label.signal)}
                    <span className="hidden print:inline">:</span>
                  </dt>
                  <dd className="claim-host mt-0.5 text-dga-ink print:mt-0">
                    <ClaimSentence id={s.claimId} />
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-dga-green-dark">{t(label.unchanged)}</dt>
                  <dd className="mt-0.5 text-dga-muted">{t(s.unchanged)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 3 decisions ───────────────────────────────────────── */}
      <section aria-labelledby="decisions-title" className="mb-12 print:mb-3">
        <h2 id="decisions-title" className="text-2xl font-bold text-dga-black">
          {t(label.decisionsTitle)}
        </h2>
        <ol className="mt-5 grid gap-5 md:grid-cols-3 print:mt-2 print:grid-cols-3 print:gap-3">
          {ownedDecisions.map((d, i) => (
            <li key={d.id} className="glass print-avoid flex flex-col p-5 print:p-2.5">
              <span className="text-sm font-bold text-dga-amber-tx">{i + 1}</span>
              <h3 className="mt-1 font-bold leading-snug text-dga-black">{t(d.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dga-muted print:mt-1">{t(d.why)}</p>
              {d.claimId && (
                <p className="claim-host print-small mt-2 text-xs leading-relaxed text-dga-muted print:mt-1">
                  <ClaimSentence id={d.claimId} />
                </p>
              )}
              <p className="print-small mt-auto flex flex-wrap items-center gap-1.5 pt-3 text-xs text-dga-muted print:pt-1">
                <span>{t(label.answers)}</span>
                {d.shiftIds.map((id) => (
                  <span key={id} className="chip">
                    {shiftNumber(id)}
                  </span>
                ))}
                <DomainChip id={d.domainId} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 10 questions ──────────────────────────────────────── */}
      <section aria-labelledby="questions-title" className="mb-12 print:mb-3">
        <h2 id="questions-title" className="text-2xl font-bold text-dga-black">
          {t(label.questionsTitle)}
        </h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2 print:mt-2 print:grid-cols-2 print:gap-4">
          {audiences.map((aud) => {
            const qs = briefQuestions.filter((q) => q.to === aud)
            const offset = aud === 'cio' ? 0 : briefQuestions.filter((q) => q.to === 'cio').length
            return (
              <div key={aud} className="glass p-5 print:rounded-none print:border-0 print:p-0">
                <h3 className="text-lg font-bold text-dga-green-dark">{t(audienceNames[aud])}</h3>
                <ol className="mt-3 space-y-3 print:mt-1 print:space-y-1.5">
                  {qs.map((q, i) => (
                    <li key={q.id} className="print-avoid flex gap-3">
                      <span aria-hidden="true" className="w-5 shrink-0 pt-0.5 text-sm font-bold text-dga-amber-tx">
                        {offset + i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium leading-relaxed text-dga-black">{t(q.question)}</p>
                        <p className="print-small mt-0.5 text-sm leading-relaxed text-dga-muted print:mt-0">
                          <span className="font-semibold text-dga-ink">{t(label.listenFor)}</span> {t(q.listenFor)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Next steps (screen only) ──────────────────────────── */}
      <section aria-labelledby="next-title" className="no-print mb-12">
        <h2 id="next-title" className="text-2xl font-bold text-dga-black">
          {t(label.nextTitle)}
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Link to={href('leaders/check')} className="glass block p-5 text-dga-ink hover:border-dga-green hover:no-underline">
            <span className="font-bold text-dga-black">{t(label.takeCheck)}</span>
            <span className="mt-1 block text-sm leading-relaxed text-dga-muted">{t(label.checkCard)}</span>
          </Link>
          <Link to={href('work/shifts')} className="glass block p-5 text-dga-ink hover:border-dga-green hover:no-underline">
            <span className="font-bold text-dga-black">{t(label.mapTitle)}</span>
            <span className="mt-1 block text-sm leading-relaxed text-dga-muted">{t(label.mapCard)}</span>
          </Link>
        </div>
      </section>

      {/* ── Sources ───────────────────────────────────────────── */}
      <section aria-labelledby="sources-title" className="border-t border-dga-line pt-6 print:pt-2">
        <h2 id="sources-title" className="text-lg font-bold text-dga-black">
          {t(label.sources)}
        </h2>
        <p className="print-small mt-1 text-sm text-dga-muted print:mt-0">{t(label.sourcesNote)}</p>
        <ul className="print-small mt-3 grid gap-1.5 text-sm text-dga-ink md:grid-cols-2 print:mt-1 print:grid-cols-2 print:gap-x-4 print:gap-y-0">
          {usedClaimIds.map((id) => {
            const c = claimById(id)
            if (!c) return null
            const text = `${t(c.source.publisher)} — ${t(c.source.title)}${c.source.year ? ` (${c.source.year})` : ''}`
            return (
              <li key={id}>
                {c.source.url ? (
                  <a href={c.source.url} target="_blank" rel="noreferrer noopener">
                    {text}
                  </a>
                ) : (
                  text
                )}
              </li>
            )
          })}
        </ul>
        <p className="print-small mt-4 text-xs text-dga-muted print:mt-1">
          {t(briefMeta.independence)} · {t(briefMeta.reviewedLabel)}: {formatDay(reviewed, lang)}
        </p>
      </section>
    </div>
  )
}
