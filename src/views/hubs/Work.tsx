import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import { domainById } from '../../data/domains'
import { EDITORIAL_WORK_MAP_CLAIM, laneMeta, laneOrder, workFamilies } from '../../data/workShifts'
import { pathFor } from '../../lib/routes'
import Claim from '../../components/Claim'
import { ChoiceChips, HubCard, HubHeader, HubSection } from '../../components/shell/Hub'
import { useArrow } from '../../components/shell/hooks'

const laneTone: Record<string, string> = {
  automated: 'border-dga-line bg-dga-bg',
  augmented: 'border-dga-green/40 bg-dga-green/5',
  emerging: 'border-dga-amber/60 bg-dga-amber/5',
  human: 'border-dga-green-ink/30 bg-white',
}

/** «تحوّل العمل الحكومي» — hub landing with a live job-family explorer (data from the work-shift map). */
export default function WorkHub() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const [familyId, setFamilyId] = useState(workFamilies[0]?.id ?? '')
  const family = workFamilies.find((f) => f.id === familyId) ?? workFamilies[0]

  return (
    <div>
      <HubHeader
        eyebrow={{ ar: 'ما الذي يتغير حتى 2030، ولماذا', en: 'What changes through 2030, and why' }}
        title={{ ar: 'تحوّل العمل الحكومي', en: 'How government work is changing' }}
        intro={{
          ar: 'كيف تتغير المهام في الوظائف الحكومية حتى 2030، وما المهارات التي تنمو، وأي التقنيات تدفع هذا التغيّر. قراءة نوعية معلنة المصادر، بلا نسب أتمتة.',
          en: 'How tasks in government jobs change through 2030, which skills are growing, and which technologies drive the change. A qualitative, sourced reading with no automation percentages.',
        }}
      />

      {family && (
        <HubSection
          title={{ ar: 'جرّب: اختر أسرة وظيفية', en: 'Try it: pick a job family' }}
          intro={{
            ar: 'لكل أسرة وظيفية: ما يُؤتمت، وما يُعزَّز بالأدوات، وما ينشأ من مهام جديدة، وما يبقى إنسانياً.',
            en: 'For each job family: what is automated, what tools augment, which new tasks emerge, and what stays human.',
          }}
        >
          <div className="rounded-card border border-dga-line bg-white p-5 shadow-card sm:p-6">
            <ChoiceChips
              name="work-family"
              legend={{ ar: 'الأسرة الوظيفية', en: 'Job family' }}
              value={family.id}
              onChange={setFamilyId}
              options={workFamilies.map((f) => ({ value: f.id, label: f.name }))}
            />
            <div aria-live="polite" className="mt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="max-w-3xl text-base font-semibold leading-relaxed text-dga-black">{t(family.summary)}</p>
                <Claim id={EDITORIAL_WORK_MAP_CLAIM} bare={false}>
                  <span className="sr-only">{t({ ar: 'تقدير تحريري', en: 'Editorial estimate' })}</span>
                </Claim>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {laneOrder.map((lane) => (
                  <li key={lane} className={`rounded-card border p-4 ${laneTone[lane]}`}>
                    <p className="text-sm font-bold text-dga-black">{t(laneMeta[lane].name)}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-dga-muted">{t(laneMeta[lane].hint)}</p>
                    <p className="mt-3 text-sm leading-relaxed text-dga-ink">{family.lanes[lane][0] ? t(family.lanes[lane][0]) : '—'}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-dga-muted">
                <span className="font-semibold text-dga-ink">{t({ ar: 'مهارات تنمو: ', en: 'Growing skills: ' })}</span>
                {family.rising.map((r) => `${t(r.skill)} (${t(domainById(r.domainId).shortName)})`).join(lang === 'ar' ? '، ' : ', ')}
              </p>
              <Link to={pathFor('work-shifts', lang)} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark">
                {t({ ar: 'كل المهام وما يفعله المدير الآن، في خريطة تحوّل المهام', en: 'Every task, and what managers can do now, in the task-shift map' })}
                <span aria-hidden="true">{arrow}</span>
              </Link>
            </div>
          </div>
        </HubSection>
      )}

      <HubSection title={{ ar: 'صفحات هذا القسم', en: 'Pages in this section' }}>
        <div className="grid gap-5 md:grid-cols-3">
          <HubCard
            view="work-shifts"
            icon="cycle"
            title={{ ar: 'خريطة تحوّل المهام', en: 'Task-shift map' }}
            desc={t({
              ar: `${workFamilies.length} أسر وظيفية حكومية: ما يُؤتمت ويُعزَّز وينشأ ويبقى إنسانياً، وماذا يفعل المدير الآن.`,
              en: `${workFamilies.length} government job families: what is automated, augmented, new or stays human, and what managers can do now.`,
            })}
          />
          <HubCard
            view="future-skills"
            icon="spark"
            title={{ ar: 'مهارات 2030', en: 'Skills for 2030' }}
            desc={t({
              ar: 'اتجاه الطلب على المجالات الثمانية حتى 2030: ما ينمو، وما يتحوّل، وما يتراجع.',
              en: 'Demand direction for the eight domains through 2030: what grows, what shifts and what declines.',
            })}
          />
          <HubCard
            view="tech-radar"
            icon="radar"
            title={{ ar: 'تقنيات تغيّر العمل الحكومي', en: 'Technologies changing government work' }}
            desc={t({
              ar: 'كل تقنية والمهارات التي تتطلبها من الموظف، مع أفقها الزمني.',
              en: 'Each technology and the skills it asks of employees, with its time horizon.',
            })}
          />
        </div>
      </HubSection>
    </div>
  )
}
