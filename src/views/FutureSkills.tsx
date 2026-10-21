import { motion } from 'framer-motion'
import { useApp } from '../store'
import { careersForDomain } from '../data/careers'
import { domainById } from '../data/domains'
import {
  decliningSkills,
  domainTrajectories,
  microSkills,
  trajectoryMeta,
} from '../data/futureSkills'
import Icon from '../components/Icon'

export default function FutureSkills() {
  const { t, lang, go, openDomainAt } = useApp()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* header */}
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">{t({ ar: 'طبقة الاستشراف — 2026 إلى 2030', en: 'Foresight layer — 2026 to 2030' })}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">
          {t({ ar: 'مهارات ', en: '' })}
          <span className="gradient-text">{t({ ar: 'المستقبل', en: 'Future Skills' })}</span>
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          {t({
            ar: 'ماذا يصعد وماذا يتراجع في سوق المهارات حتى 2030: مسارات الطلب على مجالاتنا الثمانية، وخمس عشرة مهارة دقيقة ناشئة تبدأها هذا الشهر، وعشر مهام تتراجع بصدق — كلها موثقة بمصادرها.',
            en: 'What rises and what fades in the skills market through 2030: demand trajectories for our eight domains, fifteen emerging micro-skills you can start this month, and ten honestly-declining tasks — each with its sources.',
          })}
        </p>
      </div>

      {/* ── (a) domain trajectories ── */}
      <section>
        <h2 className="text-section font-bold text-dga-green">{t({ ar: 'مسارات الطلب على المجالات الثمانية', en: 'Demand trajectories for the eight domains' })}</h2>
        <p className="mt-2 text-sm text-dga-muted">
          {t({ ar: 'تقييم تحريري موثق لكل مجال من مجالات الرادار — وزر مباشر لقياس نفسك فيه.', en: 'A documented editorial rating for each radar domain — with a direct link to measure yourself in it.' })}
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {domainTrajectories.map((traj, i) => {
            const domain = domainById(traj.domainId)
            const meta = trajectoryMeta[traj.rating]
            return (
              <motion.article
                key={traj.domainId}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
                className="glass flex flex-col p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-btn bg-dga-green/10 text-dga-green">
                    <Icon name={domain.icon} className="h-5 w-5" />
                  </span>
                  <span className="rounded-pill px-2.5 py-0.5 text-tag font-bold" style={{ background: meta.bg, color: meta.color }}>
                    {t(meta.name)}
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-dga-black">{t(domain.name)}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-dga-muted">{t(traj.rationale)}</p>
                <ul className="mt-3 space-y-1.5 border-t border-dga-line pt-3">
                  {traj.evidence.map((ev, ei) => (
                    <li key={ei} className="flex gap-1.5 text-[11px] leading-snug text-dga-muted">
                      <span className="text-dga-green">▸</span>
                      {t(ev)}
                    </li>
                  ))}
                </ul>
                <button onClick={() => go('wizard')} className="btn-ghost mt-4 w-full px-4 py-2 text-xs">
                  {t({ ar: 'قِس نفسك في هذا المجال', en: 'Measure yourself in this domain' })}
                  <span aria-hidden> {lang === 'ar' ? '←' : '→'}</span>
                </button>
              </motion.article>
            )
          })}
        </div>
      </section>

      {/* ── (b) emerging micro-skills ── */}
      <section className="mt-16">
        <h2 className="text-section font-bold text-dga-green">
          {t({ ar: 'خمس عشرة مهارة دقيقة ', en: 'Fifteen emerging micro-skills ' })}
          <span className="gradient-text">{t({ ar: 'تبدأها هذا الشهر', en: 'to start this month' })}</span>
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-dga-muted">
          {t({
            ar: 'ليست تخصصات بأربع سنوات — بل مهارات محددة تنشأ الآن داخل الوظائف القائمة، لكل منها إشارة طلب موثقة وخطوة أولى عملية.',
            en: 'Not four-year majors — specific skills emerging inside existing jobs, each with a documented demand signal and a practical first step.',
          })}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {microSkills.map((m, i) => {
            const parent = domainById(m.parentDomain)
            return (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                className="glass flex flex-col p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold leading-snug text-dga-black">{t(m.name)}</h3>
                  <span className="chip shrink-0 text-[10px]">
                    <Icon name={parent.icon} className="h-3 w-3 text-dga-green" />
                    {t(parent.shortName)}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-dga-muted">{t(m.description)}</p>
                <p className="mt-3 rounded-btn bg-dga-tag-info-bg p-2.5 text-[11.5px] leading-snug text-dga-tag-info-text">
                  <span className="font-bold">{t({ ar: 'إشارة الطلب: ', en: 'Demand signal: ' })}</span>
                  {t(m.demandSignal)}
                </p>
                <p className="mt-2 rounded-btn bg-dga-bg p-2.5 text-[11.5px] leading-snug text-dga-ink">
                  <span className="font-bold text-dga-green-dark">{t({ ar: 'في الجهات: ', en: 'In government: ' })}</span>
                  {t(m.governmentRelevance)}
                </p>
                <p className="mt-2 border-s-2 border-dga-amber ps-2.5 text-[11.5px] leading-snug text-dga-ink">
                  <span className="font-bold text-dga-amber-tx">{t({ ar: 'الخطوة الأولى: ', en: 'First step: ' })}</span>
                  {t(m.firstStep)}
                </p>
                <button
                  onClick={() => openDomainAt(m.parentDomain)}
                  className="mt-3 flex items-center justify-between rounded-btn border border-dga-line px-3 py-2 text-[11.5px] font-semibold text-dga-green-dark transition-colors hover:border-dga-green hover:bg-dga-green/5"
                >
                  <span>{t({ ar: 'أين تُستخدم؟ على الخريطة', en: 'Where is it used? On the map' })}</span>
                  <span className="font-mono" dir="ltr">{careersForDomain(m.parentDomain).length} {t({ ar: 'مهنة', en: 'careers' })}</span>
                </button>
              </motion.article>
            )
          })}
        </div>
      </section>

      {/* ── (c) declining skills table ── */}
      <section className="mt-16">
        <h2 className="text-section font-bold text-dga-green">{t({ ar: 'وماذا يتراجع؟ بصدق', en: 'And what is declining? Honestly.' })}</h2>
        <p className="mt-2 max-w-3xl text-sm text-dga-muted">
          {t({
            ar: 'القاعدة التحريرية: التراجع يصيب المهام أكثر من المهن (منظمة العمل الدولية 2025) — لكل صف نواة الحقيقة وطريق التحول.',
            en: 'The editorial rule: decline hits tasks more than jobs (ILO 2025) — each row carries the honest nuance and the pivot route.',
          })}
        </p>
        <div className="glass mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-dga-line bg-dga-bg text-xs text-dga-muted">
                <th className="p-4 text-start font-semibold">{t({ ar: 'المهارة / المهمة', en: 'Skill / task' })}</th>
                <th className="p-4 text-start font-semibold">{t({ ar: 'الدليل', en: 'Evidence' })}</th>
                <th className="p-4 text-start font-semibold">{t({ ar: 'المهمة مقابل المهنة', en: 'Task vs job nuance' })}</th>
                <th className="p-4 text-start font-semibold">{t({ ar: 'التحول المقترح', en: 'Suggested pivot' })}</th>
              </tr>
            </thead>
            <tbody>
              {decliningSkills.map((d) => (
                <tr key={d.id} className="border-b border-dga-line/70 align-top last:border-0">
                  <td className="p-4 font-semibold text-dga-black">{t(d.name)}</td>
                  <td className="p-4 text-xs leading-relaxed text-dga-muted">{t(d.evidence)}</td>
                  <td className="p-4 text-xs leading-relaxed text-dga-ink">{t(d.nuance)}</td>
                  <td className="p-4 text-xs leading-relaxed text-dga-green-dark">{t(d.pivot)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
