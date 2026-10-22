import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../store'
import type { L, Lang } from '../../data/types'
import { domainById } from '../../data/domains'
import { levels, levelForTarget } from '../../data/levels'
import { skillRecordById } from '../../data/skillRecords'
import { statements } from '../../data/statements'
import { familyNames, libraryRoleById } from '../../data/roleLibrary'
import { directionMeta, roleTasksFor } from '../../data/roleTasks'
import { laneMeta, laneOrder, workFamilyById } from '../../data/workShifts'
import { horizonMeta, techById } from '../../data/technologies'
import { shiftById } from '../../data/leaders/shifts'
import { pathFor } from '../../lib/routes'
import { countPhrase, formatNumber } from '../../lib/format'
import { edgeBetween, nodeId, normalizeText, relatedByKind } from '../../lib/skillsGraph'
import type { GraphNode, SkillsGraph, StoryStep } from '../../lib/skillsGraph'
import { useArrow } from '../shell/hooks'
import { domainColour } from './palette'
import { KindSwatch } from './marks'
import { KIND_NAME, MAP_COPY, countOf } from './copy'

interface Props {
  graph: SkillsGraph
  selected: string | null
  story: { steps: StoryStep[]; index: number } | null
  onSelect: (id: string) => void
  onStory: (index: number | null) => void
  onClear: () => void
  headingLevel?: 2 | 3
  /** the consulting-record period of the sector aggregates, when loaded */
  sectorPeriod?: L | null
  className?: string
}

const ui = {
  guideTitle: { ar: 'كيف تقرأ الخريطة', en: 'How to read the map' },
  try: { ar: 'جرّب:', en: 'Try:' },
  storyIntro: {
    ar: 'جولة قصيرة: كيف يتغير العمل الحكومي، وما المجالات التي يستند إليها كل تحول، ومن يحمله من الأدوار.',
    en: 'A short tour: how government work is changing, which domains each shift draws on, and which roles carry it.',
  },
  skillsOf: { ar: 'مهاراته', en: 'Its skills' },
  ladder: { ar: 'المستويات الأربعة', en: 'The four levels' },
  families: { ar: 'الأسر الوظيفية الحكومية التي تصعد فيها', en: 'Government job families where it is rising' },
  rolesTarget: { ar: 'أدوار تستهدف فيه «إتقان» أو أعلى', en: 'Roles that target «Proficiency» or higher in it' },
  techsNeed: { ar: 'تقنيات تتطلب مهاراته', en: 'Technologies that need its skills' },
  sectors: { ar: 'قطاعات يرتبط بها في سجل الاستشارات', en: 'Sectors linked to it in the consulting record' },
  startHere: { ar: 'ابدأ التقييم من هذا المجال', en: 'Start the assessment from this domain' },
  inDictionary: { ar: 'المجال في قاموس المهارات', en: 'The domain in the skills dictionary' },
  skillInDictionary: { ar: 'المهارة في قاموس المهارات', en: 'The skill in the skills dictionary' },
  definition: { ar: 'التعريف', en: 'Definition' },
  example: { ar: 'مثال عملي', en: 'A practical example' },
  statement: { ar: 'عبارتها في التقييم الذاتي', en: 'Its self-assessment statement' },
  levelsHint: {
    ar: 'تُقدَّر كل مهارة على المستويات الأربعة نفسها.',
    en: 'Every skill is rated on the same four levels.',
  },
  rolesNeed: { ar: 'أدوار تحتاجها (مستهدفها في مجالها «إتقان» أو أعلى)', en: 'Roles that need it (target «Proficiency» or higher in its domain)' },
  techsDemand: { ar: 'تقنيات تتطلبها', en: 'Technologies that demand it' },
  risingIn: { ar: 'تصعد في هذه الأسر الوظيفية', en: 'Rising in these job families' },
  tasksChange: { ar: 'كيف تتغير المهام بين 2026 و2030', en: 'How the tasks change between 2026 and 2030' },
  rising: { ar: 'القدرات الصاعدة', en: 'Rising capabilities' },
  worksWith: { ar: 'أدوار رقمية تعمل معها أو يمكن النمو إليها', en: 'Digital roles it works with or can grow into' },
  openFamily: { ar: 'افتح الأسرة في خريطة تحوّل المهام', en: 'Open the family in the task-shift map' },
  changingTasks: { ar: 'المهام التي تتغير', en: 'The tasks that are changing' },
  leansOn: { ar: 'المستهدف في المجالات الثمانية', en: 'Target in the eight domains' },
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
  rolesOfShift: { ar: 'أدوار تحمله', en: 'Roles that carry it' },
  familiesOfShift: { ar: 'أسر وظيفية حكومية تصعد فيها مهاراته', en: 'Government job families where its skills are rising' },
  requires: { ar: 'ما يتطلبه', en: 'What it asks for' },
  shiftsList: { ar: 'التحولات', en: 'The shifts' },
  footer: { ar: 'في قسم الأدوار والمهارات', en: 'In Roles & skills' },
  rolesLink: { ar: 'الأدوار وأوراقها', en: 'Roles and their sheets' },
  skillsLink: { ar: 'قاموس المهارات', en: 'Skills dictionary' },
  hubLink: { ar: 'الأدوار والمهارات', en: 'Roles & skills' },
  roleSheet: { ar: 'ورقة الدور', en: 'Role sheet' },
} satisfies Record<string, L>

const SHIFT_FORMS = { one: 'تحول واحد', two: 'تحولان', few: 'تحولات', many: 'تحولًا' }
const RECORD_FORMS = { one: 'سجل واحد', two: 'سجلان', few: 'سجلات', many: 'سجلًا' }

/** The map's side panel: the story of the selected node, a step of the guided tour, or the guide. */
export default function MapPanel({ graph, selected, story, onSelect, onStory, onClear, headingLevel = 2, sectorPeriod, className = '' }: Props) {
  const { t, lang } = useApp()
  const headingId = `map-panel-${useId().replace(/:/g, '')}`
  const node = selected ? graph.byId.get(selected) : undefined
  const H = (headingLevel === 2 ? 'h2' : 'h3') as 'h2'
  const heading = (text: string, extra?: ReactNode) => (
    <H id={headingId} className="mt-2 text-xl font-bold leading-snug text-dga-black" tabIndex={-1}>
      {text}
      {extra}
    </H>
  )
  const roleNode = node?.kind === 'role' ? node : undefined

  return (
    <section role="region" aria-labelledby={headingId} className={`map-panel rounded-card border border-dga-line bg-white p-5 shadow-card ${className}`} data-map-panel="">
      {story ? (
        <StoryPanel graph={graph} steps={story.steps} index={story.index} onStory={onStory} onSelect={onSelect} heading={heading} />
      ) : node ? (
        <NodeStory graph={graph} node={node} onSelect={onSelect} onClear={onClear} heading={heading} sectorPeriod={sectorPeriod} />
      ) : (
        <Guide graph={graph} onSelect={onSelect} onStory={onStory} heading={heading} />
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
                className="inline-flex max-w-full items-center gap-1.5 rounded-pill border bg-white px-2.5 py-1 text-start text-[12.5px] leading-snug text-dga-ink transition-colors hover:bg-dga-bg"
                style={{ borderColor: c.dot + '66' }}
              >
                <KindSwatch kind={n.kind} colour={c.dot} />
                <span>{t(n.short ?? n.label)}</span>
                {m && <span className="text-[11px] font-semibold" style={{ color: c.ink }}>{m}</span>}
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

function LevelLadder({ domainId }: { domainId: string }) {
  const { t } = useApp()
  const c = domainColour(domainId)
  return (
    <ol className="mt-2 space-y-1.5" aria-label={t(ui.ladder)}>
      {levels.map((lv) => (
        <li key={lv.value} className="flex items-start gap-2.5">
          <span className="mt-1 flex shrink-0 gap-[3px]" aria-hidden="true">
            {[1, 2, 3, 4].map((k) => (
              <span key={k} className="h-2 w-3 rounded-sm" style={{ background: k <= lv.value ? c.dot : '#E4E7EC' }} />
            ))}
          </span>
          <span className="text-[12.5px] leading-snug text-dga-ink">
            <span className="font-bold text-dga-black">{t(lv.name)}</span> — {t(lv.description)}
          </span>
        </li>
      ))}
    </ol>
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

function Guide({ graph, onSelect, onStory, heading }: { graph: SkillsGraph; onSelect: (id: string) => void; onStory: (i: number | null) => void; heading: HeadingFn }) {
  const { t, lang } = useApp()
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
  void lang
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
      <p className="mt-3 text-sm leading-relaxed text-dga-muted">
        {t({
          ar: 'مرّر فوق أي عقدة أو انتقل إليها بلوحة المفاتيح لترى روابطها، وانقر لتقرأ قصتها هنا.',
          en: 'Hover over any node, or reach it with the keyboard, to see its connections; click to read its story here.',
        })}
      </p>
      <div className="mt-4 rounded-btn border-s-4 border-dga-amber bg-dga-amber/5 p-3.5">
        <p className="text-sm leading-relaxed text-dga-ink">{t(ui.storyIntro)}</p>
        <button type="button" onClick={() => onStory(0)} className="btn-primary mt-3 px-4 py-2 text-sm">
          {t(MAP_COPY.story)}
        </button>
      </div>
      {picks.length > 0 && (
        <>
          <SubHeading>{t(ui.try)}</SubHeading>
          <NodeChips nodes={picks.map((id) => graph.byId.get(id)!)} onSelect={onSelect} />
        </>
      )}
    </div>
  )
}

/* --------------------------------------------------------- the story */

function StoryPanel({ graph, steps, index, onStory, onSelect, heading }: { graph: SkillsGraph; steps: StoryStep[]; index: number; onStory: (i: number | null) => void; onSelect: (id: string) => void; heading: HeadingFn }) {
  const { t, lang } = useApp()
  const step = steps[index]
  const shift = step.shift ? shiftById(step.shift.id) : undefined
  const nodes = (ids: string[]) => ids.map((id) => graph.byId.get(id)).filter((n): n is GraphNode => !!n)
  const last = index === steps.length - 1
  const shiftCount = countPhrase(steps.length - 1, lang, SHIFT_FORMS, ['shift', 'shifts'])
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
          <ol className="mt-2 space-y-1.5">
            {steps.slice(1).map((s, i) => (
              <li key={s.id} className="flex items-start gap-2 text-sm text-dga-ink">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-dga-amber text-[11px] font-bold text-dga-black">{formatNumber(i + 1, lang)}</span>
                {s.shift ? t(s.shift.title) : null}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          {heading(t(shift.title))}
          <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(shift.change)}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-dga-muted">
            <span className="font-semibold text-dga-ink">{t(ui.requires)}: </span>
            {t(shift.requires)}
          </p>
          <SubHeading>{t(ui.domainsOfShift)}</SubHeading>
          <NodeChips nodes={nodes(step.domains)} onSelect={onSelect} />
          <SubHeading>{t(ui.rolesOfShift)}</SubHeading>
          <NodeChips nodes={nodes(step.roles)} onSelect={onSelect} />
          {step.families.length > 0 && (
            <>
              <SubHeading>{t(ui.familiesOfShift)}</SubHeading>
              <NodeChips nodes={nodes(step.families)} onSelect={onSelect} />
            </>
          )}
        </>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
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

/* ------------------------------------------------------ node stories */

function NodeStory({ graph, node, onSelect, onClear, heading, sectorPeriod }: { graph: SkillsGraph; node: GraphNode; onSelect: (id: string) => void; onClear: () => void; heading: HeadingFn; sectorPeriod?: L | null }) {
  const { t, lang } = useApp()
  const rel = relatedByKind(graph, node.id)
  const dom = graph.byId.get(nodeId('domain', node.domainId))
  const levelName = (target: number) => t(levelForTarget(target).name)
  const targetMeta = (domainNodeId: string) => (n: GraphNode) => {
    const w = edgeBetween(graph, n.id, domainNodeId)?.weight
    return w ? levelName(w) : null
  }

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
      return (
        <div>
          {top}
          {heading(t(node.label))}
          <p className="mt-2 text-sm leading-relaxed text-dga-ink">{t(d.description)}</p>
          <SubHeading>
            {t(ui.skillsOf)} · {countOf('skill', rel.skill.length, lang)}
          </SubHeading>
          <NodeChips nodes={rel.skill} onSelect={onSelect} />
          <SubHeading>{t(ui.ladder)}</SubHeading>
          <LevelLadder domainId={node.ref} />
          {rel.family.length > 0 && (
            <>
              <SubHeading>{t(ui.families)}</SubHeading>
              <NodeChips nodes={rel.family} onSelect={onSelect} />
            </>
          )}
          <SubHeading>
            {t(ui.rolesTarget)} · {countOf('role', rel.role.length, lang)}
          </SubHeading>
          <NodeChips nodes={rel.role} onSelect={onSelect} meta={targetMeta(node.id)} limit={8} />
          {rel.tech.length > 0 && (
            <>
              <SubHeading>
                {t(ui.techsNeed)} · {countOf('tech', rel.tech.length, lang)}
              </SubHeading>
              <NodeChips nodes={rel.tech} onSelect={onSelect} limit={6} />
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
          <SubHeading>{t(ui.ladder)}</SubHeading>
          <p className="mt-1 text-[12px] text-dga-muted">{t(ui.levelsHint)}</p>
          <LevelLadder domainId={node.domainId} />
          <SubHeading>
            {t(ui.rolesNeed)} · {countOf('role', rel.role.length, lang)}
          </SubHeading>
          <NodeChips nodes={rel.role} onSelect={onSelect} meta={targetMeta(nodeId('domain', node.domainId))} limit={8} />
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
                  const skill = rel.skill.find((n) => normalizeText(n.label.ar) === normalizeText(r.skill.ar) || normalizeText(n.label.en) === normalizeText(r.skill.en))
                  const c = domainColour(r.domainId)
                  const body = (
                    <>
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.dot }} aria-hidden="true" />
                      <span>{t(r.skill)}</span>
                      <span className="text-[11.5px] text-dga-muted">({t(domainById(r.domainId).shortName)})</span>
                    </>
                  )
                  return (
                    <li key={r.skill.en}>
                      {skill ? (
                        <button type="button" onClick={() => onSelect(skill.id)} className="flex items-center gap-2 rounded-btn px-1 py-0.5 text-start text-[13px] font-semibold text-dga-ink underline-offset-4 hover:bg-dga-bg hover:underline">
                          {body}
                        </button>
                      ) : (
                        <span className="flex items-center gap-2 px-1 py-0.5 text-[13px] text-dga-ink">{body}</span>
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
      return (
        <div>
          {top}
          {heading(t(node.label))}
          {role && <p className="mt-1 text-[13px] text-dga-muted">{t(familyNames[role.family])}</p>}
          {role && <p className="mt-3 text-sm leading-relaxed text-dga-ink">{t(role.mission)}</p>}
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

/** Plain-text summary of a node for the live region. */
export function announce(graph: SkillsGraph, id: string, lang: Lang): string {
  const n = graph.byId.get(id)
  if (!n) return ''
  return `${MAP_COPY.selected[lang]}: ${n.label[lang]} — ${KIND_NAME[n.kind].one[lang]} (${countOf('link', graph.adjacency.get(id)?.size ?? 0, lang)})`
}
