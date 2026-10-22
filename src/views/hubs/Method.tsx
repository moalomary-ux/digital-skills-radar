import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { CLAIM_KINDS, claims } from '../../data/claims'
import type { Claim as ClaimRecord, ClaimKind } from '../../data/claims'
import { pathFor } from '../../lib/routes'
import Claim, { kindHint, kindLabel } from '../../components/Claim'
import { HubCard, HubHeader, HubSection } from '../../components/shell/Hub'
import { useArrow, useTabs } from '../../components/shell/hooks'

const kinds = CLAIM_KINDS
const confOrder = { high: 0, medium: 1, low: 2 } as const

/** Claims of one kind, best-supported first, so the first example shown is a solid one. */
const byKind = (k: ClaimKind): ClaimRecord[] =>
  claims.filter((c) => c.kind === k).sort((a, b) => confOrder[a.confidence] - confOrder[b.confidence])

/** «المنهجية والمصادر» — hub landing with a live explorer of the evidence register by source type. */
export default function MethodHub() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const { tabProps, panelProps, index } = useTabs(kinds.length)
  const [turn, setTurn] = useState(0)
  useEffect(() => setTurn(0), [index])
  const count = (k: ClaimKind) => byKind(k).length

  return (
    <div>
      <HubHeader
        eyebrow={{ ar: 'لا رقم بلا مصدر', en: 'No figure without a source' }}
        title={{ ar: 'المنهجية والمصادر', en: 'Method & sources' }}
        intro={{
          ar: 'كيف نبني أحكامنا، ومن أين يأتي كل رقم، وما حدود ما نقوله. كل رقم معروض في الأداة مسجل بمصدره ونوعه ودرجة الثقة به وتاريخ مراجعته.',
          en: 'How we form our judgments, where every figure comes from, and the limits of what we say. Every figure shown in the tool is registered with its source, type, confidence and review date.',
        }}
      />

      <HubSection
        title={{ ar: 'جرّب: من أين تأتي أرقامنا؟', en: 'Try it: where do our figures come from?' }}
        intro={{
          ar: `سجل الأدلة يضم الآن ${claims.length} ادعاءً مسجلاً. اختر نوع مصدر لترى عدد ما يستند إليه ومثالاً منه.`,
          en: `The evidence register now holds ${claims.length} registered claims. Pick a source type to see how many rest on it, with one example.`,
        }}
      >
        <div role="tablist" aria-label={t({ ar: 'أنواع المصادر', en: 'Source types' })} className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 print:hidden">
          {kinds.map((k, i) => {
            const active = i === index
            return (
              <button
                key={k}
                {...tabProps(i)}
                className={`rounded-card border p-3.5 text-start transition-all ${active ? 'border-dga-green bg-white shadow-card' : 'border-dga-line bg-white/60 hover:border-dga-green/60 hover:bg-white'}`}
              >
                <span className={`block text-2xl font-bold tabular-nums ${active ? 'text-dga-green-deep' : 'text-dga-ink'}`}>{count(k)}</span>
                <span className={`mt-0.5 block text-sm leading-snug ${active ? 'font-bold text-dga-black' : 'text-dga-ink'}`}>{t(kindLabel[k])}</span>
              </button>
            )
          })}
        </div>
        {kinds.map((k, i) => {
          const list = byKind(k)
          const example = list.length ? list[(i === index ? turn : 0) % list.length] : undefined
          return (
            <div key={k} {...panelProps(i)} className="print-reveal mt-4 rounded-card border border-dga-line bg-white p-5 shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green sm:p-6">
              <h3 className="text-lg font-bold text-dga-black">{t(kindLabel[k])}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(kindHint[k])}</p>
              {example ? (
                <div className="mt-4 rounded-btn border-s-4 border-dga-green bg-dga-bg p-4">
                  <p className="eyebrow">{t({ ar: 'مثال من السجل', en: 'An example from the register' })}</p>
                  <p className="mt-2 text-sm leading-relaxed text-dga-ink" aria-live="polite">
                    <Claim key={example.id} id={example.id}>{t(example.text)}</Claim>
                  </p>
                  {list.length > 1 && (
                    <button type="button" onClick={() => setTurn((n) => n + 1)} className="btn-ghost mt-3 px-3 py-1.5 text-xs print:hidden">
                      {t({ ar: 'مثال آخر', en: 'Another example' })}
                      <span className="text-dga-muted" dir="ltr">
                        {`${(turn % list.length) + 1}/${list.length}`}
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-dga-muted">{t({ ar: 'لا ادعاءات من هذا النوع حتى الآن.', en: 'No claims of this type yet.' })}</p>
              )}
              <Link to={pathFor('evidence', lang)} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark print:hidden">
                {t({ ar: 'تصفح سجل الأدلة كاملاً', en: 'Browse the full evidence register' })} <span aria-hidden="true">{arrow}</span>
              </Link>
            </div>
          )
        })}
      </HubSection>

      <HubSection title={{ ar: 'صفحات هذا القسم', en: 'Pages in this section' }}>
        <div className="grid gap-5 sm:grid-cols-2">
          <HubCard
            view="methodology"
            icon="scale"
            title={{ ar: 'المنهجية', en: 'Methodology' }}
            desc={t({
              ar: 'كيف صُمم التقييم الذاتي ومواقف الحكم المهني والتحقق المعرفي، وحدود كل منها.',
              en: 'How the self-assessment, judgment scenarios and knowledge check were designed, and the limits of each.',
            })}
          />
          <HubCard
            view="evidence"
            icon="shield"
            title={{ ar: 'سجل الأدلة', en: 'Evidence register' }}
            desc={t({
              ar: `${claims.length} ادعاءً بمصدره ونطاقه ونوعه ودرجة الثقة به وتاريخ مراجعته.`,
              en: `${claims.length} claims, each with its source, scope, type, confidence and review date.`,
            })}
          />
          <HubCard
            view="standards"
            icon="compass"
            title={{ ar: 'المعايير والتقارير', en: 'Standards & reports' }}
            desc={t({
              ar: 'الأطر والمؤشرات الدولية التي نستلهم منها، وكيف نقرأها، وما لا نطابقه منها.',
              en: 'The international frameworks and indices we draw on, how we read them, and what we do not map to.',
            })}
          />
          <HubCard
            view="about"
            icon="radar"
            title={{ ar: 'عن المفهوم', en: 'About the concept' }}
            desc={t({
              ar: 'من أعدّه ولماذا، وقواعد الخصوصية، وما بُني وما لم يُبنَ بعد.',
              en: 'Who made it and why, the privacy rules, and what is built and what is not yet.',
            })}
          />
        </div>
      </HubSection>
    </div>
  )
}
