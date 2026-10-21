import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import type { View } from '../../store'
import type { L } from '../../data/types'
import { shifts } from '../../data/leaders/shifts'
import { ownedDecisions } from '../../data/leaders/brief'
import { pathFor } from '../../lib/routes'
import { ChoiceChips, HubCard, HubHeader, HubSection } from '../../components/shell/Hub'
import { useArrow } from '../../components/shell/hooks'

type Need = 'meeting' | 'practice' | 'team' | 'launch'

/** «للقادة والفرق» — hub landing: purpose, a «what do you need now?» chooser, and the four tools. */
export default function LeadersHub() {
  const { t, lang } = useApp()
  const arrow = useArrow()
  const [need, setNeed] = useState<Need>('meeting')

  const cards: { id: Need; view: View; icon: string; title: L; desc: L; output?: L; soon?: boolean }[] = [
    {
      id: 'meeting',
      view: 'leader-brief',
      icon: 'compass',
      title: { ar: 'الموجز القيادي', en: 'Leader brief' },
      desc: {
        ar: `${shifts.length} تحولات في العمل الحكومي، و${ownedDecisions.length} قرارات تملكها هذا العام، وأسئلة تطرحها على مدير التقنية ومدير الموارد البشرية.`,
        en: `${shifts.length} shifts in government work, ${ownedDecisions.length} decisions you own this year, and questions to ask your CIO and HR director.`,
      },
      output: { ar: 'موجز قابل للطباعة', en: 'A printable brief' },
    },
    {
      id: 'practice',
      view: 'leader-check',
      icon: 'scale',
      title: { ar: 'فحص القرار القيادي', en: 'Leader judgment check' },
      desc: {
        ar: 'مواقف قيادية قصيرة تختار فيها ما تفعله، والمخرج قرارات تستحق وقتك. تمرين للتفكير بلا درجة ولا مقارنة.',
        en: 'Short leadership situations where you choose what to do, ending in decisions worth your time. A thinking exercise with no score and no comparison.',
      },
      output: { ar: 'قائمة قرارات للتركيز', en: 'A short list of decisions to focus on' },
    },
    {
      id: 'team',
      view: 'leader-team',
      icon: 'cycle',
      title: { ar: 'رادار الفريق', en: 'Team radar' },
      desc: {
        ar: 'يجمع رموز نتائج مجهولة يشاركها أعضاء الفريق بإرادتهم، ولا يعرض شيئاً تحت 5 رموز، ولا صفاً لكل شخص.',
        en: 'Combines anonymous result codes team members share by choice, shows nothing below 5 codes, and never a row per person.',
      },
    },
    {
      id: 'launch',
      view: 'adoption',
      icon: 'flag',
      title: { ar: 'دليل التبني المؤسسي', en: 'Institutional adoption guide' },
      desc: {
        ar: 'كيف تطلق دفعة تطوعية في أسبوعين، وقواعد الخصوصية، وما لا تُستخدم له الأداة.',
        en: 'How to run a voluntary cohort in two weeks, the privacy rules, and what the tool is not for.',
      },
      output: { ar: 'قائمة تحقق الإطلاق ورسالة دعوة جاهزة', en: 'A launch checklist and a ready invitation message' },
    },
  ]

  const advice: Record<Need, { text: L; view: View; cta: L }> = {
    meeting: {
      text: { ar: 'ابدأ بالموجز القيادي: يُقرأ في دقائق ويُطبع في ورقة واحدة تأخذها إلى الاجتماع.', en: 'Start with the leader brief: a few minutes to read, one printed sheet to take into the meeting.' },
      view: 'leader-brief',
      cta: { ar: 'افتح الموجز القيادي', en: 'Open the leader brief' },
    },
    practice: {
      text: { ar: 'جرّب فحص القرار القيادي: اختر ما تفعله في كل موقف، ثم اقرأ لماذا يختلف الخيار الأنضج.', en: 'Try the leader judgment check: choose what you would do in each situation, then read why the most mature option differs.' },
      view: 'leader-check',
      cta: { ar: 'ابدأ الفحص', en: 'Start the check' },
    },
    team: {
      text: {
        ar: 'رادار الفريق قريباً. إلى ذلك الحين: اطلب من فريقك إكمال «تقييمي» طوعاً، وناقش أولوياته معه في حوارات التطوير.',
        en: 'The team radar is coming soon. Meanwhile: invite your team to complete «My assessment» voluntarily, and discuss its priorities in development conversations.',
      },
      view: 'wizard',
      cta: { ar: 'افتح «تقييمي»', en: 'Open «My assessment»' },
    },
    launch: {
      text: { ar: 'اقرأ دليل التبني المؤسسي: خطة أسبوعين، وقواعد الخصوصية، ورسالة دعوة تنسخها كما هي.', en: 'Read the adoption guide: a two-week plan, the privacy rules, and an invitation message you can copy as is.' },
      view: 'adoption',
      cta: { ar: 'افتح الدليل', en: 'Open the guide' },
    },
  }

  const chosen = advice[need]

  return (
    <div>
      <HubHeader
        eyebrow={{ ar: 'للقيادي ومدير الفريق والموارد البشرية', en: 'For leaders, team managers and HR' }}
        title={{ ar: 'للقادة والفرق', en: 'Leaders & teams' }}
        intro={{
          ar: 'أدوات قصيرة لمن يقود: قراءة لما يتغير في العمل الحكومي، وتمرين على القرار، ودليل لإطلاق التطوير في جهتك. لا شيء هنا يقيّم الأفراد أو يرتّبهم، ولا تُجمع بيانات عن أحد.',
          en: 'Short tools for people who lead: a reading of what is changing in government work, a decision exercise, and a guide to launching development in your entity. Nothing here rates or ranks individuals, and no data is collected about anyone.',
        }}
      />

      <HubSection title={{ ar: 'ما الذي تحتاجه الآن؟', en: 'What do you need right now?' }}>
        <div className="rounded-card border border-dga-line bg-white p-5 shadow-card sm:p-6">
          <ChoiceChips<Need>
            name="leader-need"
            legend={{ ar: 'اختر أقرب وصف لموقفك', en: 'Pick the closest description of your situation' }}
            value={need}
            onChange={setNeed}
            options={[
              { value: 'meeting', label: { ar: 'عندي اجتماع قيادي قريب', en: 'I have a leadership meeting soon' } },
              { value: 'practice', label: { ar: 'أريد أن أتمرّن على قرارات صعبة', en: 'I want to practise hard decisions' } },
              { value: 'team', label: { ar: 'أريد صورة احتياج فريقي', en: 'I want a picture of my team’s needs' } },
              { value: 'launch', label: { ar: 'أريد إطلاق التقييم في جهتي', en: 'I want to launch the assessment in my entity' } },
            ]}
          />
          <div aria-live="polite" className="mt-5 flex flex-col gap-3 rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-dga-ink">{t(chosen.text)}</p>
            <Link to={pathFor(chosen.view, lang)} className="btn-primary shrink-0 px-4 py-2 text-sm no-underline hover:no-underline">
              {t(chosen.cta)} <span aria-hidden="true">{arrow}</span>
            </Link>
          </div>
        </div>
      </HubSection>

      <HubSection title={{ ar: 'أدوات القادة والفرق', en: 'Tools for leaders and teams' }}>
        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((c) => (
            <HubCard key={c.id} view={c.view} icon={c.icon} title={c.title} desc={t(c.desc)} output={c.output} soon={c.soon} highlight={c.id === need} />
          ))}
        </div>
      </HubSection>
    </div>
  )
}
