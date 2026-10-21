import { useApp } from '../store'
import { levels } from '../data/levels'
import { crosswalk, frameworkCards, indexCards, reportCards } from '../data/standards'
import type { SourceCard } from '../data/standards'
import Claim, { ClaimText, EvidenceLink } from '../components/Claim'
import Icon from '../components/Icon'

function SourceCardView({ card }: { card: SourceCard }) {
  const { t } = useApp()
  return (
    <article className="glass flex flex-col p-6">
      <h3 className="text-lg font-bold leading-snug text-dga-black">{t(card.name)}</h3>
      <p className="mt-1 text-xs font-semibold text-dga-muted">{t(card.publisher)}</p>
      {card.claimIds.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-dga-ink">
          {card.claimIds.map((id) => (
            <li key={id}>
              <Claim id={id} />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm leading-relaxed text-dga-ink">{t(card.description)}</p>
      {card.limits && (
        <p className="mt-3 border-s-2 border-dga-amber ps-3 text-xs leading-relaxed text-dga-muted">
          <span className="font-semibold text-dga-amber-tx">{t({ ar: 'حدود الاستناد: ', en: 'Limits: ' })}</span>
          {t(card.limits)}
        </p>
      )}
      {card.url && (
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-dga-green-dark underline-offset-2 hover:underline"
        >
          {card.homeLink ? t({ ar: 'الموقع الرئيس للجهة', en: 'Publisher’s home page' }) : t({ ar: 'افتح المرجع', en: 'Open the source' })}
          <span aria-hidden>↗</span>
          <span className="sr-only">{t({ ar: '(يفتح في نافذة جديدة)', en: '(opens in a new tab)' })}</span>
        </a>
      )}
    </article>
  )
}

export default function Standards() {
  const { t, go, lang } = useApp()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-10 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'المنهجية والمصادر', en: 'Method & sources' })}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t({ ar: 'المعايير والأطر المرجعية', en: 'Standards and reference frameworks' })}</h1>
        <p className="mt-4 leading-relaxed text-dga-ink">
          {t({
            ar: 'يستند الرادار إلى أطر وتقارير دولية ووطنية منشورة. تبين هذه الصفحة ما نأخذه من كل مرجع، وحدود الأخذ منه. كل رقم فيها يحمل شارة مصدره؛ افتحها لترى المصدر ونوعه والثقة فيه وتاريخ مراجعته.',
            en: 'The radar draws on published international and national frameworks and reports. This page shows what we take from each source and the limits of doing so. Every figure carries a source badge; open it to see the source, its type, the confidence in it and when it was last reviewed.',
          })}
        </p>
      </header>

      {/* level crosswalk */}
      <section aria-labelledby="xwalk-title" className="glass mb-14 overflow-hidden">
        <div className="border-b border-dga-line bg-dga-bg p-6">
          <h2 id="xwalk-title" className="text-xl font-bold">
            {t({ ar: 'كيف تقابل مستوياتنا الأطر الدولية؟', en: 'How do our levels relate to international frameworks?' })}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-dga-muted">
            {t({
              ar: 'مواءمة تحريرية استرشادية لا تطابق مباشر: الأطر تصف أشياء مختلفة، والمقابلة تساعد على القراءة ولا تمنح مستوى معتمدًا.',
              en: 'An indicative editorial crosswalk, not a direct mapping: the frameworks describe different things, and the correspondence helps reading without conferring any certified level.',
            })}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <caption className="sr-only">{t({ ar: 'مقابلة مستويات الرادار بإطاري SFIA 9 وDigComp', en: 'Radar levels against SFIA 9 and DigComp' })}</caption>
            <thead>
              <tr className="border-b border-dga-line text-xs text-dga-muted">
                <th scope="col" className="p-4 text-start font-semibold">{t({ ar: 'مستوى الرادار', en: 'Radar level' })}</th>
                <th scope="col" className="p-4 text-start font-semibold">{t({ ar: 'مستويات المسؤولية في SFIA 9', en: 'SFIA 9 responsibility levels' })}</th>
                <th scope="col" className="p-4 text-start font-semibold">{t({ ar: 'نطاق DigComp ومستوياته', en: 'DigComp band and levels' })}</th>
              </tr>
            </thead>
            <tbody>
              {crosswalk.map((row) => {
                const level = levels.find((l) => l.value === row.level)
                return (
                  <tr key={row.level} className="border-b border-dga-line align-top last:border-0">
                    <th scope="row" className="p-4 text-start font-normal">
                      <span className="block font-bold text-dga-green-dark">{level ? t(level.name) : null}</span>
                      {level && <span className="mt-0.5 block text-xs leading-relaxed text-dga-muted">{t(level.description)}</span>}
                    </th>
                    <td className="p-4 text-dga-ink">
                      <Claim id={row.sfiaClaim} variant="icon" />
                    </td>
                    <td className="p-4 text-dga-ink">
                      <span className="me-2 font-semibold">{t(row.digcompBand)}</span>
                      <Claim id={row.digcompClaim} variant="icon" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-dga-line bg-dga-bg p-6 text-sm leading-loose text-dga-ink">
          <ClaimText
            text={t({
              ar: 'يصف SFIA 9 المسؤولية في العمل على {{standards-sfia9-levels}}، ويحدد DigComp 2.2 لكل كفاءة {{standards-digcomp22-levels}} تتجمع في {{standards-digcomp-bands}}. أما مستويات الرادار فتقدير ذاتي لأغراض التطوير، وعتباتها تحريرية مشروحة في صفحة المنهجية.',
              en: 'SFIA 9 describes responsibility at work on {{standards-sfia9-levels}}, and DigComp 2.2 defines {{standards-digcomp22-levels}} per competence, grouped into {{standards-digcomp-bands}}. The radar’s levels are a self-assessment for development, and their thresholds are editorial, as explained on the methodology page.',
            })}
          />
          <button type="button" onClick={() => go('methodology')} className="btn-ghost ms-0 mt-3 block px-4 py-2 text-sm sm:ms-3 sm:mt-0 sm:inline-flex">
            {t({ ar: 'المنهجية', en: 'Methodology' })}
            <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
          </button>
        </div>
      </section>

      {/* frameworks */}
      <section aria-labelledby="frameworks-title" className="mb-14">
        <h2 id="frameworks-title" className="mb-2 text-2xl font-bold">{t({ ar: 'الأطر المرجعية للمهارات', en: 'Skills reference frameworks' })}</h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-dga-muted">
          {t({
            ar: 'أطر تصف المهارات ومستوياتها، نسترشد بها في بناء المجالات والمهارات والمستويات.',
            en: 'Frameworks that describe skills and their levels, which guide how we built the domains, skills and levels.',
          })}
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {frameworkCards.map((c) => (
            <SourceCardView key={c.id} card={c} />
          ))}
        </div>
      </section>

      {/* reports */}
      <section aria-labelledby="reports-title" className="mb-14">
        <h2 id="reports-title" className="mb-2 text-2xl font-bold">{t({ ar: 'التقارير والإشارات', en: 'Reports and signals' })}</h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-dga-muted">
          {t({
            ar: 'تقارير نقرأ منها اتجاه الطلب على المهارات. نوع كل مصدر ظاهر على شارته: التقرير الدولي غير الاستطلاع، وكلاهما غير بيانات المنصات التجارية.',
            en: 'Reports from which we read the direction of skills demand. Each source’s type shows on its badge: an international report is not a survey, and neither is commercial platform data.',
          })}
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reportCards.map((c) => (
            <SourceCardView key={c.id} card={c} />
          ))}
        </div>
      </section>

      {/* indices */}
      <section aria-labelledby="indices-title" className="mb-14">
        <h2 id="indices-title" className="mb-2 text-2xl font-bold">{t({ ar: 'المؤشرات الدولية المرتبطة', en: 'Related international indices' })}</h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-dga-muted">
          {t({
            ar: 'مؤشرات تقيس الحكومة الرقمية على مستوى الدول. ترتبط بمجالات الرادار، لكنها لا تقيس مهارة الموظف، ولا تثبت أثر هذه الأداة.',
            en: 'Indices that measure digital government at country level. They relate to the radar’s domains, but they do not measure employee skill and do not prove this tool’s effect.',
          })}
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {indexCards.map((c) => (
            <SourceCardView key={c.id} card={c} />
          ))}
        </div>
      </section>

      {/* skill registry + evidence register */}
      <section className="mb-14 grid gap-5 md:grid-cols-2">
        <div className="glass flex flex-col justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-bold text-dga-black">{t({ ar: 'لكل مهارة سجل مستقل', en: 'Every skill has its own record' })}</h2>
            <p className="mt-2 text-sm leading-relaxed text-dga-muted">
              <ClaimText
                text={t({
                  ar: 'سجل المهارات يصف {{method-skills-count}} بتعريف ومهمة مثال وأساس دليل وتاريخ مراجعة، مرتبطة بعبارات التقييم الذاتي وخطط التطوير.',
                  en: 'The skill registry describes {{method-skills-count}} with a definition, an example task, an evidence basis and a review date, linked to the self-assessment statements and development plans.',
                })}
              />
            </p>
          </div>
          <button type="button" onClick={() => go('skills')} className="btn-primary self-start px-5 py-2.5 text-sm">
            {t({ ar: 'افتح سجل المهارات', en: 'Open the skill registry' })}
            <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
          </button>
        </div>
        <div className="glass flex flex-col justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-bold text-dga-black">{t({ ar: 'سجل الأدلة', en: 'Evidence register' })}</h2>
            <p className="mt-2 text-sm leading-relaxed text-dga-muted">
              {t({
                ar: 'كل رقم في الأداة في جدول واحد: مصدره ونوعه والثقة فيه وتاريخ آخر مراجعة له.',
                en: 'Every figure in the tool in one table: its source, type, confidence and last review date.',
              })}
            </p>
          </div>
          <EvidenceLink className="btn-ghost self-start px-5 py-2.5 text-sm no-underline">
            {t({ ar: 'افتح سجل الأدلة', en: 'Open the evidence register' })}
            <span aria-hidden>{lang === 'ar' ? '←' : '→'}</span>
          </EvidenceLink>
        </div>
      </section>

      {/* CTA */}
      <div className="glass-strong p-8 text-center">
        <Icon name="radar" className="mx-auto h-8 w-8 text-dga-green" />
        <h2 className="mt-3 text-xl font-bold">{t({ ar: 'ابدأ تقييمك الذاتي', en: 'Start your self-assessment' })}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-dga-muted">
          {t({
            ar: 'يساعدك على استكشاف أولويات تطويرك في المجالات الثمانية، للتطوير فقط.',
            en: 'It helps you explore your development priorities across the eight domains, for development only.',
          })}
        </p>
        <button type="button" onClick={() => go('wizard')} className="btn-primary mt-5">
          {t({ ar: 'ابدأ التقييم', en: 'Start the assessment' })}
        </button>
      </div>
    </div>
  )
}
