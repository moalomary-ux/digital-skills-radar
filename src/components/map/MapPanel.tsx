import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import type { ResultRecord } from '../../store'
import type { L, Lang } from '../../data/types'
import { domainById, domains } from '../../data/domains'
import { levels, levelForTarget } from '../../data/levels'
import { skillRecordById } from '../../data/skillRecords'
import { statements } from '../../data/statements'
import { familyNames, libraryRoleById, libraryRoles } from '../../data/roleLibrary'
import { directionMeta, roleTasksFor } from '../../data/roleTasks'
import { laneMeta, laneOrder, workFamilyById } from '../../data/workShifts'
import { horizonMeta, techById } from '../../data/technologies'
import { shiftById } from '../../data/leaders/shifts'
import { claimById } from '../../data/claims'
import { pathFor } from '../../lib/routes'
import { countPhrase, formatNumber } from '../../lib/format'
import { priorities, reasonLabel } from '../../lib/priorities'
import { compareTargets, edgeBetween, focusOf, nodeId, normalizeText, relatedByKind, roleReach } from '../../lib/skillsGraph'
import type { GraphNode, SkillGap, SkillsGraph, StoryStep } from '../../lib/skillsGraph'
import Claim, { formatClaimDate } from '../Claim'
import { useArrow } from '../shell/hooks'
import { COMPARE_A, COMPARE_B, COMPARE_B_INK, domainColour } from './palette'
import { KindSwatch } from './marks'
import { RISING_SKILL_OVERRIDES } from './sources'
import { KIND_NAME, MAP_COPY, countOf, sep } from './copy'

interface Props {
  graph: SkillsGraph
  selected: string | null
  story: { steps: StoryStep[]; index: number; phase: number } | null
  onSelect: (id: string) => void
  onStory: (index: number | null) => void
  onClear: () => void
  headingLevel?: 2 | 3
  /** the consulting-record period of the sector aggregates, when loaded */
  sectorPeriod?: L | null
  className?: string
  /** the panel scrolls inside this height (the canvas height on wide screens) */
  maxHeight?: number
  /** touch screens: wording without hover, «/» or Shift */
  touch?: boolean
  /** the spotlit domain, if any */
  spotlight?: string | null
  onSpotlight?: (domainId: string) => void
  /** the second role of a comparison (node id) */
  compareWith?: string | null
  onCompare?: (roleId: string) => void
  onEndCompare?: () => void
  onSwap?: () => void
  /** «طريقي إلى هذا الدور»: the skills below the selected role's target and the last saved assessment */
  path?: { gaps: SkillGap[]; record: ResultRecord } | null
}

const ui = {
  guideTitle: { ar: 'كيف تقرأ الخريطة', en: 'How to read the map' },
  try: { ar: 'جرّب:', en: 'Try:' },
  storyIntro: {
    ar: 'جولة قصيرة: كيف يتغير العمل الحكومي، وما المجالات والمهارات التي يستند إليها كل تحول، ومن يحمله من الأدوار.',
    en: 'A short tour: how government work is changing, which domains and skills each shift draws on, and which roles carry it.',
  },
  storyPointer: { ar: 'زر «ابدأ القصة» في أعلى الخريطة.', en: 'Use «Start the story» above the map.' },
  hoverGuide: {
    ar: 'مرّر فوق أي نقطة أو انتقل إليها بلوحة المفاتيح لترى روابطها، وانقر لتقرأ قصتها هنا.',
    en: 'Hover over any point, or reach it with the keyboard, to see its connections; click to read its story here.',
  },
  touchGuide: {
    ar: 'المس أي مجال أو عنصر في القوائم لتقرأ قصته وترى روابطه مضاءة على الخريطة.',
    en: 'Tap any domain or list item to read its story and see its connections lit on the map.',
  },
  skillsOf: { ar: 'مهاراته', en: 'Its skills' },
  spread: { ar: 'الأدوار حسب المستوى المستهدف فيه', en: 'Roles by their target level in it' },
  spreadHint: { ar: 'كم دوراً من مكتبة الأدوار يستهدف كل مستوى في هذا المجال.', en: 'How many library roles target each level in this domain.' },
  families: { ar: 'الأسر الوظيفية الحكومية التي تصعد فيها', en: 'Government job families where it is rising' },
  rolesTarget: { ar: 'أدوار تستهدف فيه «إتقان» أو أعلى، الأعلى أولاً', en: 'Roles that target «Proficiency» or higher in it, highest first' },
  techsNeed: { ar: 'تقنيات تتطلب مهاراته، تقنياته أولاً', en: 'Technologies that need its skills, its own first' },
  sectors: { ar: 'قطاعات يرتبط بها في سجل الاستشارات', en: 'Sectors linked to it in the consulting record' },
  startHere: { ar: 'ابدأ التقييم من هذا المجال', en: 'Start the assessment from this domain' },
  inDictionary: { ar: 'مهارات المجال في قاموس المهارات', en: 'The domain’s skills in the skills dictionary' },
  skillInDictionary: { ar: 'المهارة في قاموس المهارات', en: 'The skill in the skills dictionary' },
  definition: { ar: 'التعريف', en: 'Definition' },
  example: { ar: 'مثال عملي', en: 'A practical example' },
  statement: { ar: 'عبارتها في التقييم الذاتي', en: 'Its self-assessment statement' },
  rolesNeed: { ar: 'أدوار تحتاجها (مستهدفها في مجالها «إتقان» أو أعلى)', en: 'Roles that need it (target «Proficiency» or higher in its domain)' },
  techsDemand: { ar: 'تقنيات تتطلبها', en: 'Technologies that demand it' },
  risingIn: { ar: 'تصعد في هذه الأسر الوظيفية', en: 'Rising in these job families' },
  tasksChange: { ar: 'كيف تتغير المهام بين 2026 و2030', en: 'How the tasks change between 2026 and 2030' },
  rising: { ar: 'القدرات الصاعدة', en: 'Rising capabilities' },
  nearest: { ar: 'أقرب مهارة', en: 'nearest skill' },
  worksWith: { ar: 'أدوار رقمية تعمل معها أو يمكن النمو إليها', en: 'Digital roles it works with or can grow into' },
  openFamily: { ar: 'افتح الأسرة في خريطة تحوّل المهام', en: 'Open the family in the task-shift map' },
  changingTasks: { ar: 'المهام التي تتغير', en: 'The tasks that are changing' },
  leansOn: { ar: 'المستهدف في المجالات الثمانية', en: 'Target in the eight domains' },
  roleSkills: { ar: 'المهارات التي يحتاجها (مجالات مستهدفها «إتقان» أو أعلى)', en: 'The skills it needs (domains with a target of «Proficiency» or higher)' },
  roleTechs: { ar: 'تقنيات يعمل بها', en: 'Technologies it works with' },
  familiesOfRole: { ar: 'أسر وظيفية حكومية تعمل معه', en: 'Government job families that work with it' },
  openRole: { ar: 'افتح ورقة الدور', en: 'Open the role sheet' },
  horizon: { ar: 'أفق التبني', en: 'Adoption horizon' },
  requiredSkills: { ar: 'المهارات التي تتطلبها', en: 'The skills it requires' },
  techDomains: { ar: 'المجالات المرتبطة', en: 'Linked domains' },
  openTech: { ar: 'افتح التقنية', en: 'Open the technology' },
  sectorDomains: { ar: 'مجالات تطوير مرتبطة بسجل الاستشارات', en: 'Development domains linked to the consulting record' },
  sectorNote: {
    ar: 'أقوى المجالات بعدد سجلات الاستشارات المرجّحة لهذا القطاع؛ الربط بين فئة الاستشارة والمجال تقدير تحريري.',
    en: 'The strongest domains by the weighted consulting records of this sector; mapping a consulting category to a domain is an editorial judgment.',
  },
  openSector: { ar: 'موجز احتياج القطاع', en: 'The sector needs brief' },
  more: { ar: 'اعرض الكل', en: 'Show all' },
  less: { ar: 'اعرض أقل', en: 'Show fewer' },
  domainsOfShift: { ar: 'المجالات التي يستند إليها', en: 'The domains it draws on' },
  skillsOfShift: { ar: 'المهارات التي يطلبها', en: 'The skills it asks for' },
  rolesOfShift: { ar: 'أدوار تحمله', en: 'Roles that carry it' },
  familiesOfShift: { ar: 'أسر وظيفية حكومية تصعد فيها مهاراته', en: 'Government job families where its skills are rising' },
  requires: { ar: 'ما يتطلبه', en: 'What it asks for' },
  why: { ar: 'لماذا؟', en: 'Why?' },
  shiftsList: { ar: 'التحولات (اختر واحداً)', en: 'The shifts (pick one)' },
  phases: { ar: 'تضيء الخريطة على مراحل', en: 'The map lights up in stages' },
  phaseNames: { ar: 'المجالات|المهارات|الأدوار', en: 'Domains|Skills|Roles' },
  footer: { ar: 'في قسم الأدوار والمهارات', en: 'In Roles & skills' },
  rolesLink: { ar: 'الأدوار وأوراقها', en: 'Roles and their sheets' },
  skillsLink: { ar: 'قاموس المهارات', en: 'Skills dictionary' },
  hubLink: { ar: 'الأدوار والمهارات', en: 'Roles & skills' },
  roleSheet: { ar: 'ورقة الدور', en: 'Role sheet' },
  // compare
  moveFromTo: { ar: 'للانتقال من «{a}» إلى «{b}» تحتاج:', en: 'To move from “{a}” to “{b}” you need:' },
  noRise: { ar: 'لا يطلب الدور الثاني مستوى أعلى في أي مجال.', en: 'The second role asks for no higher level in any domain.' },
  aAsksMore: { ar: 'ويطلب «{a}» أكثر في:', en: '“{a}” asks for more in:' },
  sameLevel: { ar: 'المستوى نفسه في:', en: 'The same level in:' },
  fromTo: { ar: 'من {x} إلى {y}', en: 'from {x} to {y}' },
  none: { ar: 'بلا مستهدف', en: 'no target' },
  compareTable: { ar: 'المستهدف في كل مجال للدورين', en: 'The target per domain for both roles' },
  // path
  pathIntro: { ar: 'من آخر تقييم ذاتي لك ({date}).', en: 'From your last self-assessment ({date}).' },
  pathCount: { ar: 'مهارات تقديرك الذاتي فيها دون مستهدف هذا الدور:', en: 'Skills where your self-rating is below this role’s target:' },
  pathNone: { ar: 'تقديرك الذاتي يبلغ مستهدف هذا الدور في كل المهارات.', en: 'Your self-rating reaches this role’s target in every skill.' },
  pathPriorities: { ar: 'أولويات التطوير المقترحة لهذا الدور', en: 'Suggested development priorities for this role' },
  pathPlanNote: { ar: 'تُبنى خطتك على آخر تقييم لك.', en: 'Your plan is built on your last assessment.' },
  pathNoRecord: { ar: 'أكمل التقييم الذاتي لترى طريقك إلى هذا الدور: المهارات التي تحتاج تطويرها مضاءة على الخريطة.', en: 'Complete the self-assessment to see your path to this role: the skills to develop, lit on the map.' },
  pathStart: { ar: 'ابدأ التقييم', en: 'Start the assessment' },
  selfTarget: { ar: 'تقديرك {s} من 4، المستهدف {t}', en: 'you {s} of 4, target {t}' },
} satisfies Record<string, L>

const SHIFT_FORMS = { one: 'تحول واحد', two: 'تحولان', few: 'تحولات', many: 'تحولًا' }
const RECORD_FORMS = { one: 'سجل واحد', two: 'سجلان', few: 'سجلات', many: 'سجلًا' }

const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
/** «أ، ب وج» / “a, b and c” */
function listJoin(items: string[], lang: Lang): string {
  if (items.length <= 1) return items[0] ?? ''
  return lang === 'ar' ? `${items.slice(0, -1).join('، ')} و${items[items.length - 1]}` : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** The map's side panel: the story of the selected node, a step of the guided tour, a comparison, or the guide. */
export default function MapPanel(props: Props) {
  const { graph, selected, story, onSelect, onStory, onClear, headingLevel = 2, sectorPeriod, className = '', touch = false, compareWith = null, maxHeight } = props
  const { t, lang } = useApp()
  const headingId = `map-panel-${useId().replace(/:/g, '')}`
  const node = selected ? graph.byId.get(selected) : undefined
  const H = (headingLevel === 2 ? 'h2' : 'h3') as 'h2'
  const heading = (text: string, extra?: ReactNode) => (
    <H id={headingId} className="mt-2 text-xl font-bold leading-snug text-dga-black" tabIndex={-1} data-panel-heading="">
      {text}
      {extra}
    </H>
  )
  const roleNode = node?.kind === 'role' ? node : undefined
  const compareNode = compareWith ? graph.byId.get(compareWith) : undefined

  return (
    <section role="region" aria-labelledby={headingId} className={`map-panel rounded-card border border-dga-line bg-white p-5 shadow-card ${className}`} style={maxHeight ? { maxHeight } : undefined} data-map-panel="">
      {story ? (
        <StoryPanel graph={graph} steps={story.steps} index={story.index} phase={story.phase} onStory={onStory} onSelect={onSelect} heading={heading} />
      ) : roleNode && compareNode ? (
        <ComparePanel graph={graph} a={roleNode} b={compareNode} onSelect={onSelect} onEnd={props.onEndCompare} onSwap={props.onSwap} heading={heading} />
      ) : node ? (
        <NodeStory {...props} node={node} heading={heading} sectorPeriod={sectorPeriod} onClear={onClear} />
      ) : (
        <Guide graph={graph} onSelect={onSelect} heading={heading} touch={touch} />
      )}

      <nav aria-label={t(ui.footer)} className="mt-6 border-t border-dga-line pt-4 print:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dga-muted">{t(ui.footer)}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-semibold">
          <li>
            <Link to={pathFor('roles', lang)}>{t(ui.rolesLink)}</Link>
          </li>
          <li>
            <Link to={pathFor('skills', lang)}>{t(ui.skillsLink)}</Link>
          </li>
          {roleNode && (
            <li>
              <Link to={pathFor('role', lang, { roleId: roleNode.ref })}>
                {t(ui.roleSheet)}: {t(roleNode.label)}
              </Link>
            </li>
          )}
          <li>
            <Link to={pathFor('roles-hub', lang)}>{t(ui.hubLink)}</Link>
          </li>
        </ul>
      </nav>
    </section>
  )
}

/* ------------------------------------------------------------- pieces */

type HeadingFn = (text: string, extra?: ReactNode) => ReactNode

function Badge({ node }: { node: GraphNode }) {
  const { t } = useApp()
  const c = domainColour(node.domainId)
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-[11.5px] font-semibold" style={{ background: c.tint, color: c.ink }}>
      <KindSwatch kind={node.kind} colour={c.dot} />
      {t(KIND_NAME[node.kind].one)}
    </span>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.08em] text-dga-muted">{children}</p>
}

/** Related nodes as buttons that move the selection; long lists fold after `limit`. */
function NodeChips({ nodes, onSelect, meta, limit = 10 }: { nodes: GraphNode[]; onSelect: (id: string) => void; meta?: (n: GraphNode) => string | null; limit?: number }) {
  const { t } = useApp()
  const [all, setAll] = useState(false)
  if (nodes.length === 0) return null
  return (
    <div>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {nodes.map((n, i) => {
          const c = domainColour(n.domainId)
          const m = meta?.(n)
          // folded items stay in the page for print
          return (
            <li key={n.id} className={all || i < limit ? '' : 'hidden print:block'}>
              <button
                type="button"
                onClick={() => onSelect(n.id)}
                className="map-chip inline-flex max-w-full items-center gap-1.5 rounded-pill border bg-white px-2.5 py-1 text-start text-[12.5px] leading-snug text-dga-ink transition-colors hover:bg-dga-bg"
                style={{ borderColor: c.dot + '66' }}
              >
                <KindSwatch kind={n.kind} colour={c.dot} />
                <span>{t(n.short ?? n.label)}</span>
                {m && (
                  <span className="text-[11px] font-semibold" style={{ color: c.ink }}>
                    {m}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
      {nodes.length > limit && (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-2 text-xs font-semibold text-dga-green-dark underline-offset-4 hover:underline print:hidden" aria-expanded={all}>
          {all ? t(ui.less) : `${t(ui.more)} (${formatNumber(nodes.length, 'en')})`}
        </button>
      )}
    </div>
  )
}

/** Four bars: how many library roles target each level in a domain (replaces the generic level list, review P2-4). */
function LevelSpread({ domainId }: { domainId: string }) {
  const { t, lang } = useApp()
  const c = domainColour(domainId)
  const counts = [4, 3, 2, 1].map((lv) => ({ lv, n: libraryRoles.filter((r) => Math.round(r.targets[domainId] ?? 0) === lv).length }))
  const max = Math.max(1, ...counts.map((x) => x.n))
  return (
    <div>
      <p className="mt-1 text-[12px] text-dga-muted">{t(ui.spreadHint)}</p>
      <ul className="mt-2 space-y-1.5">
        {counts.map(({ lv, n }) => (
          <li key={lv} className="grid grid-cols-[4.5rem,1fr,auto] items-center gap-2 text-[12.5px]">
            <span className="font-semibold text-dga-black">{t(levels[lv - 1].name)}</span>
            <span className="h-2 rounded-pill bg-dga-disabled" aria-hidden="true">
              <span className="block h-2 rounded-pill" style={{ width: `${(n / max) * 100}%`, background: c.dot }} />
            </span>
            <span className="text-dga-muted">{countOf('role', n, lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  const arrow = useArrow()
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm font-bold text-dga-green-dark">
      {children} <span aria-hidden="true">{arrow}</span>
    </Link>
  )
}

/* ---------------------------------------------------------- the guide */

function Guide({ graph, onSelect, heading, touch }: { graph: SkillsGraph; onSelect: (id: string) => void; heading: HeadingFn; touch: boolean }) {
  const { t } = useApp()
  const n = (kind: GraphNode['kind']) => graph.nodes.filter((x) => x.kind === kind).length
  const rows: { kind: GraphNode['kind']; text: L }[] = [
    { kind: 'domain', text: { ar: `في المركز ${countOf('domain', n('domain'), 'ar')}، لكل منها لون وإسفين.`, en: `At the centre: ${countOf('domain', n('domain'), 'en')}, each with its colour and wedge.` } },
    { kind: 'skill', text: { ar: `حولها ${countOf('skill', n('skill'), 'ar')}، خمس في إسفين كل مجال.`, en: `Around them: ${countOf('skill', n('skill'), 'en')}, five in each domain’s wedge.` } },
    {
      kind: 'family',
      text: {
        ar: `ثم ${countOf('family', n('family'), 'ar')} و${countOf('role', n('role'), 'ar')}، كلٌّ في إسفين المجال الذي يستند إليه أكثر.`,
        en: `Then ${countOf('family', n('family'), 'en')} and ${countOf('role', n('role'), 'en')}, each in the wedge of the domain it leans on most.`,
      },
    },
    { kind: 'tech', text: { ar: `وفي الحلقة الخارجية ${countOf('tech', n('tech'), 'ar')} تغيّر العمل الحكومي، موصولة بالمهارات التي تتطلبها.`, en: `On the outer ring: ${countOf('tech', n('tech'), 'en')} changing government work, linked to the skills they require.` } },
  ]
  const picks = ['domain.ai-data', 'role.data_scientist', 'tech.C1-T01', 'family.hr'].filter((id) => graph.byId.has(id))
  return (
    <div>
      <p className="eyebrow">{t(MAP_COPY.legend)}</p>
      {heading(t(ui.guideTitle))}
      <ul className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <li key={r.kind} className="flex items-start gap-2.5 text-sm leading-relaxed text-dga-ink">
            <span className="mt-1">
              <KindSwatch kind={r.kind} colour="#1B8354" />
            </span>
            <span>{t(r.text)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-dga-muted">{t(touch ? ui.touchGuide : ui.hoverGuide)}</p>
      {!touch && <p className="mt-2 text-sm leading-relaxed text-dga-muted">{t(MAP_COPY.mouse)}</p>}
      <p className="mt-3 rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 px-3 py-2.5 text-sm leading-relaxed text-dga-ink">
        {t(ui.storyIntro)} {t(ui.storyPointer)}
      </p>
      {picks.length > 0 && (
        <div className="print:hidden">
          <SubHeading>{t(ui.try)}</SubHeading>
          <NodeChips nodes={picks.map((id) => graph.byId.get(id)!)} onSelect={onSelect} />
        </div>
      )}
    </div>
  )
}

/* --------------------------------------------------------- the story */

function StoryPanel({ graph, steps, index, phase, onStory, onSelect, heading }: { graph: SkillsGraph; steps: StoryStep[]; index: number; phase: number; onStory: (i: number | null) => void; onSelect: (id: string) => void; heading: HeadingFn }) {
  const { t, lang } = useApp()
  const step = steps[index]
  const shift = step.shift ? shiftById(step.shift.id) : undefined
  const nodes = (ids: string[]) => ids.map((id) => graph.byId.get(id)).filter((n): n is GraphNode => !!n)
  const last = index === steps.length - 1
  const shiftCount = countPhrase(steps.length - 1, lang, SHIFT_FORMS, ['shift', 'shifts'])
  const claim = shift ? claimById(shift.claimId) : undefined
  const names = (ids: string[], max = 99) => {
    const list = nodes(ids).map((n) => t(n.short ?? n.label))
    return list.length > max ? [...list.slice(0, max), t({ ar: 'غيرها', en: 'others' })] : list
  }
  const narration: L | null = shift
    ? {
        ar: `يستند إلى ${listJoin(names(step.domains), 'ar')}، ويطلب ${listJoin(names(step.skills), 'ar')}، وتحمله أدوار مثل ${listJoin(names(step.roles, 2), 'ar')}.`,
        en: `It draws on ${listJoin(names(step.domains), 'en')}, asks for ${listJoin(names(step.skills), 'en')}, and is carried by roles such as ${listJoin(names(step.roles, 2), 'en')}.`,
      }
    : null
  const phaseNames = t(ui.phaseNames).split('|')
  return (
    <div>
      <p className="eyebrow" aria-live="polite">
        {t(MAP_COPY.step)} {formatNumber(index + 1, lang)} {t(MAP_COPY.of)} {formatNumber(steps.length, lang)}
      </p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {steps.map((s, i) => (
          <span key={s.id} className={`h-1.5 flex-1 rounded-pill ${i <= index ? 'bg-dga-green' : 'bg-dga-line'}`} />
        ))}
      </div>
      {!shift ? (
        <>
          {heading(t({ ar: `العمل الحكومي يتغير في ${shiftCount}`, en: `Government work is changing in ${shiftCount}` }))}
          <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(ui.storyIntro)}</p>
          <SubHeading>{t(ui.shiftsList)}</SubHeading>
          <ol className="mt-2 space-y-1">
            {steps.slice(1).map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => onStory(i + 1)} className="flex w-full items-start gap-2 rounded-btn px-1.5 py-1.5 text-start text-sm text-dga-ink hover:bg-dga-bg" data-story-jump={s.id}>
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-dga-amber text-[11px] font-bold text-dga-black" aria-hidden="true">
                    {formatNumber(i + 1, lang)}
                  </span>
                  <span className="font-semibold underline-offset-4 hover:underline">{s.shift ? t(s.shift.title) : null}</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          {heading(t(shift.title))}
          {narration && <p className="mt-2 text-sm font-semibold leading-relaxed text-dga-ink" data-story-narration="">{t(narration)}</p>}
          <ol className="mt-2 flex flex-wrap items-center gap-1 text-[11.5px]" aria-label={t(ui.phases)}>
            {step.phases.map((_, i) => (
              <li key={i} className={`rounded-pill px-2 py-0.5 font-semibold ${i <= phase ? 'bg-dga-green/10 text-dga-green-dark' : 'bg-dga-disabled text-dga-muted'}`} aria-current={i === Math.min(phase, step.phases.length - 1) ? 'step' : undefined}>
                {phaseNames[Math.min(i, phaseNames.length - 1)]}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-dga-ink">{t(shift.change)}</p>
          {claim && (
            <p className="mt-3 rounded-btn bg-dga-bg px-3 py-2 text-[13px] leading-relaxed text-dga-ink" data-story-why="">
              <span className="font-bold text-dga-black">{t(ui.why)} </span>
              <Claim id={shift.claimId}>{t(claim.text)}</Claim>
            </p>
          )}
          <SubHeading>{t(ui.domainsOfShift)}</SubHeading>
          <NodeChips nodes={nodes(step.domains)} onSelect={onSelect} />
          {step.skills.length > 0 && (
            <>
              <SubHeading>{t(ui.skillsOfShift)}</SubHeading>
              <NodeChips nodes={nodes(step.skills)} onSelect={onSelect} />
            </>
          )}
          <SubHeading>{t(ui.rolesOfShift)}</SubHeading>
          <NodeChips nodes={nodes(step.roles)} onSelect={onSelect} limit={8} />
          {step.families.length > 0 && (
            <>
              <SubHeading>{t(ui.familiesOfShift)}</SubHeading>
              <NodeChips nodes={nodes(step.families)} onSelect={onSelect} />
            </>
          )}
        </>
      )}
      {/* the step controls stay in reach at the bottom of the panel while its text scrolls */}
      <div className="sticky bottom-0 z-10 -mx-5 -mb-5 mt-6 flex flex-wrap items-center gap-2 border-t border-dga-line bg-white/95 px-5 py-3 backdrop-blur print:hidden" data-story-nav="">
        <button type="button" onClick={() => onStory(index - 1)} disabled={index === 0} className="btn-ghost px-4 py-2 text-sm disabled:opacity-40">
          {t(MAP_COPY.back)}
        </button>
        {last ? (
          <button type="button" onClick={() => onStory(null)} className="btn-primary px-4 py-2 text-sm">
            {t(MAP_COPY.storyEnd)}
          </button>
        ) : (
          <button type="button" onClick={() => onStory(index + 1)} className="btn-primary px-4 py-2 text-sm">
            {t(MAP_COPY.next)}
          </button>
        )}
        {!last && (
          <button type="button" onClick={() => onStory(null)} className="ms-auto text-xs font-semibold text-dga-muted underline-offset-4 hover:underline">
            {t(MAP_COPY.storyEnd)}
          </button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------- comparison */

function ComparePanel({ graph, a, b, onSelect, onEnd, onSwap, heading }: { graph: SkillsGraph; a: GraphNode; b: GraphNode; onSelect: (id: string) => void; onEnd?: () => void; onSwap?: () => void; heading: HeadingFn }) {
  const { t, lang } = useApp()
  const ta = libraryRoleById(a.ref)?.targets ?? {}
  const tb = libraryRoleById(b.ref)?.targets ?? {}
  const cmp = compareTargets(ta, tb, graph.domainIds)
  const level = (v: number) => (v > 0 ? t(levelForTarget(v).name) : t(ui.none))
  const dname = (d: string) => t(domainById(d).shortName)
  const row = (x: { domainId: string; from: number; to: number }) => (
    <li key={x.domainId}>
      <button type="button" onClick={() => onSelect(nodeId('domain', x.domainId))} className="flex w-full items-baseline justify-between gap-2 rounded-btn px-1 py-0.5 text-start text-[13px] hover:bg-dga-bg">
        <span className="font-semibold" style={{ color: domainColour(x.domainId).ink }}>
          {dname(x.domainId)}
        </span>
        <span className="text-dga-ink">{fill(t(ui.fromTo), { x: level(x.from), y: level(x.to) })}</span>
      </button>
    </li>
  )
  return (
    <div data-map-compare-panel="">
      <p className="eyebrow">{t(MAP_COPY.compareTitle)}</p>
      {heading(`${t(a.label)}${lang === 'ar' ? ' و' : ' & '}${t(b.label)}`)}
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
        <li className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: COMPARE_A }} aria-hidden="true" />
          {t(a.label)}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: COMPARE_B }} aria-hidden="true" />
          {t(b.label)}
        </li>
      </ul>
      <SubHeading>{fill(t(ui.moveFromTo), { a: t(a.label), b: t(b.label) })}</SubHeading>
      {cmp.rise.length ? <ul className="mt-1.5 space-y-0.5">{cmp.rise.map(row)}</ul> : <p className="mt-1.5 text-sm text-dga-ink">{t(ui.noRise)}</p>}
      {cmp.fall.length > 0 && (
        <>
          <SubHeading>{fill(t(ui.aAsksMore), { a: t(a.label) })}</SubHeading>
          <ul className="mt-1.5 space-y-0.5">{cmp.fall.map((x) => row({ domainId: x.domainId, from: x.from, to: x.to }))}</ul>
        </>
      )}
      {cmp.same.some((x) => x.from > 0) && (
        <p className="mt-4 text-[13px] leading-relaxed text-dga-ink">
          <span className="font-semibold">{t(ui.sameLevel)} </span>
          {cmp.same
            .filter((x) => x.from > 0)
            .map((x) => `${dname(x.domainId)} (${level(x.from)})`)
            .join(sep(lang))}
        </p>
      )}
      <table className="mt-4 w-full border-collapse text-start text-[12px]">
        <caption className="mb-1 text-start text-[11px] text-dga-muted">{t(ui.compareTable)}</caption>
        <thead>
          <tr className="border-b border-dga-line text-dga-muted">
            <th scope="col" className="py-1 text-start font-semibold">
              {t(MAP_COPY.domain)}
            </th>
            <th scope="col" className="py-1 text-start font-semibold" style={{ color: '#067647' }}>
              {t(a.label)}
            </th>
            <th scope="col" className="py-1 text-start font-semibold" style={{ color: COMPARE_B_INK }}>
              {t(b.label)}
            </th>
          </tr>
        </thead>
        <tbody>
          {cmp.all.map((x) => (
            <tr key={x.domainId} className="border-b border-dga-line/60">
              <th scope="row" className="py-1 text-start font-medium">
                {dname(x.domainId)}
              </th>
              <td className="py-1">{level(x.from)}</td>
              <td className="py-1">{level(x.to)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex flex-wrap items-center gap-2 print:hidden">
        <button type="button" onClick={onSwap} className="btn-ghost px-4 py-2 text-sm">
          {t(MAP_COPY.compareSwap)}
        </button>
        <button type="button" onClick={onEnd} className="btn-primary px-4 py-2 text-sm">
          {t(MAP_COPY.compareEnd)}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------ node stories */

function NodeStory(props: Props & { node: GraphNode; heading: HeadingFn }) {
  const { graph, node, onSelect, onClear, heading, sectorPeriod, spotlight, onSpotlight, onCompare, path } = props
  const { t, lang } = useApp()
  const rel = relatedByKind(graph, node.id)
  const dom = graph.byId.get(nodeId('domain', node.domainId))
  const levelName = (target: number) => t(levelForTarget(target).name)
  const targetOf = (domainNodeId: string) => (n: GraphNode) => edgeBetween(graph, n.id, domainNodeId)?.weight ?? 0
  const targetMeta = (domainNodeId: string) => (n: GraphNode) => {
    const w = targetOf(domainNodeId)(n)
    return w ? levelName(w) : null
  }
  const byTarget = (domainNodeId: string) => (x: GraphNode, y: GraphNode) => targetOf(domainNodeId)(y) - targetOf(domainNodeId)(x)
  const compareId = `map-compare-${useId().replace(/:/g, '')}`

  const top = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Badge node={node} />
      <button type="button" onClick={onClear} className="text-xs font-semibold text-dga-muted underline-offset-4 hover:underline print:hidden">
        {t(MAP_COPY.clear)}
      </button>
    </div>
  )
  const domainLine = dom && node.kind !== 'domain' && (
    <p className="mt-1 text-[13px] text-dga-muted">
      {t(KIND_NAME.domain.one)}:{' '}
      <button type="button" onClick={() => onSelect(dom.id)} className="font-semibold underline-offset-4 hover:underline" style={{ color: domainColour(dom.domainId).ink }}>
        {t(dom.label)}
      </button>
    </p>
  )

  switch (node.kind) {
    case 'domain': {
      const d = domainById(node.ref)
      // its own technologies first (review P2-3)
      const techs = [...rel.tech].sort((x, y) => Number(y.domainId === node.domainId) - Number(x.domainId === node.domainId))
      return (
        <div>
          {top}
          {heading(t(node.label))}
          <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(d.description)}</p>
          {onSpotlight && spotlight !== node.domainId && (
            <button type="button" onClick={() => onSpotlight(node.domainId)} className="btn-ghost mt-3 px-4 py-2 text-sm print:hidden" data-spotlight-open="">
              {t(MAP_COPY.spotlightOpen)}
            </button>
          )}
          <SubHeading>
            {t(ui.skillsOf)} · {countOf('skill', rel.skill.length, lang)}
          </SubHeading>
          <NodeChips nodes={rel.skill} onSelect={onSelect} />
          <SubHeading>
            {t(ui.rolesTarget)} · {countOf('role', rel.role.length, lang)}
          </SubHeading>
          <NodeChips nodes={[...rel.role].sort(byTarget(node.id))} onSelect={onSelect} meta={targetMeta(node.id)} limit={8} />
          <SubHeading>{t(ui.spread)}</SubHeading>
          <LevelSpread domainId={node.ref} />
          {rel.family.length > 0 && (
            <>
              <SubHeading>{t(ui.families)}</SubHeading>
              <NodeChips nodes={rel.family} onSelect={onSelect} />
            </>
          )}
          {techs.length > 0 && (
            <>
              <SubHeading>
                {t(ui.techsNeed)} · {countOf('tech', techs.length, lang)}
              </SubHeading>
              <NodeChips nodes={techs} onSelect={onSelect} limit={6} />
            </>
          )}
          {rel.sector.length > 0 && (
            <>
              <SubHeading>{t(ui.sectors)}</SubHeading>
              <NodeChips nodes={rel.sector} onSelect={onSelect} limit={6} />
            </>
          )}
          <div className="mt-5 flex flex-col items-start gap-2 print:hidden">
            <Link to={`${pathFor('wizard', lang)}?domain=${encodeURIComponent(node.ref)}`} className="btn-primary px-4 py-2 text-sm no-underline hover:no-underline">
              {t(ui.startHere)}
            </Link>
            <ArrowLink to={`${pathFor('skills', lang)}#domain-${node.ref}`}>{t(ui.inDictionary)}</ArrowLink>
          </div>
        </div>
      )
    }
    case 'skill': {
      const rec = skillRecordById(node.ref)
      const statement = rec ? statements.find((s) => s.id === rec.assessmentRef) : undefined
      const domNode = nodeId('domain', node.domainId)
      return (
        <div>
          {top}
          {heading(t(node.label))}
          {domainLine}
          {rec && (
            <>
              <p className="mt-3 text-sm leading-relaxed text-dga-ink">
                <span className="font-semibold">{t(ui.definition)}: </span>
                {t(rec.definition)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-dga-ink">
                <span className="font-semibold">{t(ui.example)}: </span>
                {t(rec.exampleTask)}
              </p>
            </>
          )}
          {statement && (
            <blockquote className="mt-3 border-s-4 border-dga-green/50 bg-dga-bg px-3 py-2 text-[13px] italic leading-relaxed text-dga-ink">
              <span className="block text-[11px] font-semibold not-italic text-dga-muted">{t(ui.statement)}</span>
              {t(statement.text)}
            </blockquote>
          )}
          <SubHeading>
            {t(ui.rolesNeed)} · {countOf('role', rel.role.length, lang)}
          </SubHeading>
          <NodeChips nodes={[...rel.role].sort(byTarget(domNode))} onSelect={onSelect} meta={targetMeta(domNode)} limit={8} />
          {rel.family.length > 0 && (
            <>
              <SubHeading>{t(ui.risingIn)}</SubHeading>
              <NodeChips nodes={rel.family} onSelect={onSelect} />
            </>
          )}
          {rel.tech.length > 0 && (
            <>
              <SubHeading>
                {t(ui.techsDemand)} · {countOf('tech', rel.tech.length, lang)}
              </SubHeading>
              <NodeChips nodes={rel.tech} onSelect={onSelect} limit={6} />
            </>
          )}
          <div className="mt-5 print:hidden">
            <ArrowLink to={`${pathFor('skills', lang)}#${node.ref}`}>{t(ui.skillInDictionary)}</ArrowLink>
          </div>
        </div>
      )
    }
    case 'family': {
      const f = workFamilyById(node.ref)
      return (
        <div>
          {top}
          {heading(t(node.label))}
          {domainLine}
          {f && <p className="mt-3 text-sm leading-relaxed text-dga-ink">{t(f.summary)}</p>}
          {f && (
            <>
              <SubHeading>{t(ui.tasksChange)}</SubHeading>
              <dl className="mt-2 space-y-2">
                {laneOrder.map((lane) => (
                  <div key={lane} className="rounded-btn bg-dga-bg px-3 py-2">
                    <dt className="text-[12px] font-bold text-dga-black">{t(laneMeta[lane].name)}</dt>
                    <dd className="mt-0.5 text-[12.5px] leading-snug text-dga-ink">{f.lanes[lane].slice(0, 2).map((x) => t(x)).join(lang === 'ar' ? '؛ ' : '; ')}</dd>
                  </div>
                ))}
              </dl>
              <SubHeading>{t(ui.rising)}</SubHeading>
              <ul className="mt-2 space-y-1">
                {f.rising.map((r) => {
                  const override = RISING_SKILL_OVERRIDES[r.skill.en]
                  const skill = override
                    ? graph.byId.get(nodeId('skill', override))
                    : rel.skill.find((n) => normalizeText(n.label.ar) === normalizeText(r.skill.ar) || normalizeText(n.label.en) === normalizeText(r.skill.en))
                  const c = domainColour(r.domainId)
                  return (
                    <li key={r.skill.en}>
                      {skill ? (
                        <button type="button" onClick={() => onSelect(skill.id)} className="flex items-center gap-2 rounded-btn px-1 py-0.5 text-start text-[13px] font-semibold text-dga-ink underline-offset-4 hover:bg-dga-bg hover:underline">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.dot }} aria-hidden="true" />
                          <span>{t(r.skill)}</span>
                          <span className="text-[11.5px] font-normal text-dga-muted">
                            ({override ? `${t(ui.nearest)}: ${t(skill.label)}` : t(domainById(r.domainId).shortName)})
                          </span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-2 px-1 py-0.5 text-[13px] text-dga-ink">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.dot }} aria-hidden="true" />
                          <span>{t(r.skill)}</span>
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
          <SubHeading>{t(ui.worksWith)}</SubHeading>
          <NodeChips nodes={rel.role} onSelect={onSelect} />
          <div className="mt-5 print:hidden">
            <ArrowLink to={`${pathFor('work-shifts', lang)}?family=${encodeURIComponent(node.ref)}`}>{t(ui.openFamily)}</ArrowLink>
          </div>
        </div>
      )
    }
    case 'role': {
      const role = libraryRoleById(node.ref)
      const tasks = roleTasksFor(node.ref)
      const reach = roleReach(graph, node.id)
      const strongDomains = reach.domains
        .map((id) => graph.byId.get(id)!)
        .sort((x, y) => (edgeBetween(graph, node.id, y.id)?.weight ?? 0) - (edgeBetween(graph, node.id, x.id)?.weight ?? 0))
      const otherRoles = graph.nodes.filter((n) => n.kind === 'role' && n.id !== node.id)
      return (
        <div>
          {top}
          {heading(t(node.label))}
          {role && <p className="mt-1 text-[13px] text-dga-muted">{t(familyNames[role.family])}</p>}
          {role && <p className="mt-3 text-sm leading-relaxed text-dga-ink">{t(role.mission)}</p>}
          {path !== undefined && <PathSection graph={graph} role={node} path={path} onSelect={onSelect} />}
          <SubHeading>{t(ui.roleSkills)}</SubHeading>
          <div className="mt-1 space-y-2" data-role-skills="">
            {strongDomains.map((d) => {
              const w = edgeBetween(graph, node.id, d.id)?.weight ?? 0
              const skills = reach.skills.map((id) => graph.byId.get(id)!).filter((s) => s.domainId === d.domainId)
              return (
                <div key={d.id}>
                  <p className="text-[12.5px] font-semibold" style={{ color: domainColour(d.domainId).ink }}>
                    {t(d.short ?? d.label)} · {levelName(w)}
                  </p>
                  <NodeChips nodes={skills} onSelect={onSelect} />
                </div>
              )
            })}
          </div>
          {reach.techs.length > 0 && (
            <>
              <SubHeading>
                {t(ui.roleTechs)} · {countOf('tech', reach.techs.length, lang)}
              </SubHeading>
              <NodeChips nodes={reach.techs.map((id) => graph.byId.get(id)!)} onSelect={onSelect} limit={6} />
            </>
          )}
          {onCompare && (
            <div className="mt-5 rounded-btn border border-dga-line bg-dga-bg p-3 print:hidden" data-compare-picker="">
              <label htmlFor={compareId} className="text-[12.5px] font-semibold text-dga-ink">
                {t(MAP_COPY.compare)}
              </label>
              <select
                id={compareId}
                className="mt-1.5 min-h-10 w-full rounded-btn border border-dga-line bg-white px-2 text-sm text-dga-ink focus:border-dga-green"
                value=""
                onChange={(e) => e.target.value && onCompare(e.target.value)}
              >
                <option value="">{t(MAP_COPY.compareChoose)}</option>
                {otherRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {t(r.label)}
                  </option>
                ))}
              </select>
            </div>
          )}
          {tasks && (
            <>
              <SubHeading>{t(ui.changingTasks)}</SubHeading>
              <ul className="mt-2 space-y-1.5">
                {tasks.tasks.map((task) => (
                  <li key={task.text.en} className="flex items-start gap-2 text-[13px] leading-snug text-dga-ink">
                    <span
                      className={`mt-0.5 shrink-0 rounded-pill px-2 py-px text-[10.5px] font-bold ${
                        task.direction === 'grows' ? 'bg-dga-tag-ok-bg text-dga-tag-ok-text' : task.direction === 'shifts' ? 'bg-dga-tag-info-bg text-dga-tag-info-text' : 'bg-dga-disabled text-dga-muted'
                      }`}
                    >
                      {t(directionMeta[task.direction])}
                    </span>
                    {t(task.text)}
                  </li>
                ))}
              </ul>
            </>
          )}
          {role && (
            <>
              <SubHeading>{t(ui.leansOn)}</SubHeading>
              <ul className="mt-2 space-y-1">
                {graph.domainIds.map((d) => {
                  const target = role.targets[d] ?? 0
                  const c = domainColour(d)
                  const strong = target >= 3
                  return (
                    <li key={d}>
                      <button type="button" onClick={() => onSelect(nodeId('domain', d))} className="flex w-full items-center gap-2 rounded-btn px-1 py-0.5 text-start text-[12.5px] hover:bg-dga-bg">
                        <span className="w-32 shrink-0 truncate" style={{ color: strong ? c.ink : '#4D5761', fontWeight: strong ? 700 : 400 }}>
                          {t(domainById(d).shortName)}
                        </span>
                        <span className="flex gap-[3px]" aria-hidden="true">
                          {[1, 2, 3, 4].map((k) => (
                            <span key={k} className="h-2 w-4 rounded-sm" style={{ background: k <= target ? c.dot : '#E4E7EC' }} />
                          ))}
                        </span>
                        <span className="text-[11.5px] text-dga-muted">{target > 0 ? levelName(target) : '—'}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
          {rel.family.length > 0 && (
            <>
              <SubHeading>{t(ui.familiesOfRole)}</SubHeading>
              <NodeChips nodes={rel.family} onSelect={onSelect} />
            </>
          )}
          <div className="mt-5 print:hidden">
            <ArrowLink to={pathFor('role', lang, { roleId: node.ref })}>{t(ui.openRole)}</ArrowLink>
          </div>
        </div>
      )
    }
    case 'tech': {
      const tech = techById(node.ref)
      const h = tech ? horizonMeta[tech.horizon] : undefined
      return (
        <div>
          {top}
          {heading(t(node.label))}
          {domainLine}
          {h && (
            <p className="mt-2 text-[13px] text-dga-ink">
              <span className="font-semibold">{t(ui.horizon)}: </span>
              <span className="chip !text-[11.5px]" style={{ borderColor: h.color }}>
                {t(h.name)} · {t(h.years)}
              </span>
            </p>
          )}
          {tech && <p className="mt-3 text-sm leading-relaxed text-dga-ink">{t(tech.description)}</p>}
          <SubHeading>{t(ui.requiredSkills)}</SubHeading>
          <NodeChips nodes={rel.skill} onSelect={onSelect} />
          <SubHeading>{t(ui.techDomains)}</SubHeading>
          <NodeChips nodes={rel.domain} onSelect={onSelect} />
          <div className="mt-5 print:hidden">
            <ArrowLink to={pathFor('tech-radar', lang, { techId: node.ref })}>{t(ui.openTech)}</ArrowLink>
          </div>
        </div>
      )
    }
    case 'sector': {
      return (
        <div>
          {top}
          {heading(t(node.label))}
          <SubHeading>
            {t(ui.sectorDomains)} <span className="chip-info ms-1 align-middle normal-case tracking-normal">{t(MAP_COPY.editorial)}</span>
          </SubHeading>
          <ul className="mt-2 space-y-1.5">
            {[...rel.domain]
              .sort((a, b) => (edgeBetween(graph, node.id, b.id)?.weight ?? 0) - (edgeBetween(graph, node.id, a.id)?.weight ?? 0))
              .map((d) => {
                const records = edgeBetween(graph, node.id, d.id)?.weight ?? 0
                return (
                  <li key={d.id}>
                    <button type="button" onClick={() => onSelect(d.id)} className="flex w-full items-center justify-between gap-2 rounded-btn px-1 py-0.5 text-start text-[13px] hover:bg-dga-bg">
                      <span className="font-semibold" style={{ color: domainColour(d.domainId).ink }}>
                        {t(d.short ?? d.label)}
                      </span>
                      <span className="text-dga-muted">{countPhrase(records, lang, RECORD_FORMS, ['record', 'records'])}</span>
                    </button>
                  </li>
                )
              })}
          </ul>
          <p className="mt-3 text-[12px] leading-relaxed text-dga-muted">
            {t(ui.sectorNote)}
            {sectorPeriod ? ` ${t(sectorPeriod)}` : ''}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-dga-muted">{t(MAP_COPY.sectorsEditorial)}</p>
          <div className="mt-5 print:hidden">
            <ArrowLink to={pathFor('sector', lang, { sectorId: node.ref })}>{t(ui.openSector)}</ArrowLink>
          </div>
        </div>
      )
    }
    default:
      return null
  }
}

/** «طريقي إلى هذا الدور» (P10b wow 1): the text equivalent of the amber halos on the map. */
function PathSection({ graph, role, path, onSelect }: { graph: SkillsGraph; role: GraphNode; path: Props['path']; onSelect: (id: string) => void }) {
  const { t, lang } = useApp()
  const targets = libraryRoleById(role.ref)?.targets ?? {}
  if (!path) {
    return (
      <div className="mt-4 rounded-btn border border-dashed border-dga-line px-3 py-2.5 print:hidden" data-map-path="none">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-dga-muted">{t(MAP_COPY.myPath)}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-dga-ink">{t(ui.pathNoRecord)}</p>
        <Link to={pathFor('wizard', lang)} className="mt-1.5 inline-flex text-sm font-bold text-dga-green-dark">
          {t(ui.pathStart)}
        </Link>
      </div>
    )
  }
  const list = priorities({ ...path.record, roleId: `lib:${role.ref}` }, targets, domains)
  const develop = list.filter((p) => p.reason !== 'maintain')
  const shown = path.gaps.slice(0, 6).map((g) => graph.byId.get(g.id)!).filter(Boolean)
  const gapOf = new Map(path.gaps.map((g) => [g.id, g]))
  return (
    <div className="mt-4 rounded-btn border border-[#E9C46A] bg-[#FFF8E6] px-3 py-3" data-map-path="">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#8A6A00]">{t(MAP_COPY.myPath)}</p>
      <p className="mt-1 text-[12.5px] text-dga-muted">{fill(t(ui.pathIntro), { date: formatClaimDate(path.record.date.slice(0, 10), lang) })}</p>
      {path.gaps.length === 0 ? (
        <p className="mt-1.5 text-[13px] text-dga-ink">{t(ui.pathNone)}</p>
      ) : (
        <>
          <p className="mt-1.5 text-[13px] text-dga-ink">
            {t(ui.pathCount)} <span className="font-bold">{formatNumber(path.gaps.length, lang)}</span>
          </p>
          <NodeChips
            nodes={shown}
            onSelect={onSelect}
            meta={(n) => {
              const g = gapOf.get(n.id)
              return g ? fill(t(ui.selfTarget), { s: formatNumber(g.self, lang), t: t(levelForTarget(g.target).name) }) : null
            }}
          />
        </>
      )}
      {develop.length > 0 && (
        <>
          <p className="mt-3 text-[12.5px] font-semibold text-dga-ink">{t(ui.pathPriorities)}</p>
          <ol className="mt-1 space-y-0.5 text-[13px] text-dga-ink">
            {develop.map((p) => (
              <li key={p.domainId} className="flex items-baseline gap-1.5">
                <span className="font-bold">{formatNumber(p.rank, lang)}.</span>
                <span className="font-semibold" style={{ color: domainColour(p.domainId).ink }}>
                  {t(domainById(p.domainId).shortName)}
                </span>
                <span className="text-dga-muted">— {t(reasonLabel[p.reason])}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 print:hidden">
        <Link to={pathFor('pathways', lang)} className="btn-primary px-4 py-2 text-sm no-underline hover:no-underline" data-map-plan="">
          {t(MAP_COPY.toPlan)}
        </Link>
        <span className="text-[11.5px] text-dga-muted">{t(ui.pathPlanNote)}</span>
      </div>
    </div>
  )
}

/** Plain-text summary of a node for the live region (the count matches what the map lights, review P2-5). */
export function announce(graph: SkillsGraph, id: string, lang: Lang): string {
  const n = graph.byId.get(id)
  if (!n) return ''
  const lit = Math.max(0, focusOf(graph, id).nodes.size - 1)
  return `${MAP_COPY.selected[lang]}: ${n.label[lang]} — ${KIND_NAME[n.kind].one[lang]} (${countOf('linked', lit, lang)})`
}
