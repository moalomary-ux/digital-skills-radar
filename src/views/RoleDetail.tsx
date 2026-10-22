import { Link, useParams } from 'react-router-dom'
import { useApp } from '../store'
import { domains, domainById } from '../data/domains'
import { familyNames, libraryRoleById, LIB_PREFIX, PEERS_SUFFIX } from '../data/roleLibrary'
import { levels } from '../data/levels'
import { directionMeta, roleTasksFor } from '../data/roleTasks'
import type { TaskDirection } from '../data/roleTasks'
import { claimById } from '../data/claims'
import Claim from '../components/Claim'
import type { L } from '../data/types'

/**
 * `/roles/:roleId` — «ورقة الدور»: tasks that are changing, a sample work
 * product, indicative targets per domain (a bar list, not a radar), the SFIA
 * codes already in the role library, and a button to start the assessment.
 */

const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 12mm; }
  header, footer, nav, .no-print { display: none !important; }
  html, body { background: #fff !important; }
  .role-root, .role-root * { line-height: 1.38 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .role-root p, .role-root li, .role-root span, .role-root button { font-size: 8.6pt !important; }
  .role-root h1 { font-size: 17pt !important; }
  .role-root h2 { font-size: 10.5pt !important; }
  .role-root .chip, .role-root .chip-ok, .role-root .chip-info { font-size: 7pt !important; padding: 0 0.35rem !important; }
  .print-avoid { break-inside: avoid; page-break-inside: avoid; }
}
`

const directionTone: Record<TaskDirection, string> = {
  grows: 'chip-ok',
  shifts: 'chip-info',
  declines: 'chip',
}

const label = {
  notFoundTitle: { ar: 'لم نجد هذا الدور', en: 'We could not find this role' },
  notFoundBody: {
    ar: 'ربما تغيّر الرابط أو أُعيدت تسمية الدور. اختر دوراً من قائمة الأدوار.',
    en: 'The link may have changed or the role may have been renamed. Pick a role from the list.',
  },
  backToRoles: { ar: 'عُد إلى الأدوار', en: 'Back to roles' },
  crumbs: { ar: 'الأدوار والمهارات', en: 'Roles & skills' },
  sheet: { ar: 'ورقة الدور', en: 'Role sheet' },
  equivalents: { ar: 'مسميات مكافئة في الجهات', en: 'Equivalent titles in entities' },
  equivalentsNote: {
    ar: 'المسميات تختلف بين الجهات؛ هذه أمثلة استرشادية وليست حصرية، والعبرة بطبيعة العمل.',
    en: 'Titles differ between entities; these are indicative examples, not an exhaustive list, and the nature of the work decides.',
  },
  grade: { ar: 'المرتبة الوظيفية:', en: 'Job grade:' },
  start: { ar: 'ابدأ التقييم لهذا الدور', en: 'Start the assessment for this role' },
  print: { ar: 'اطبع ورقة الدور', en: 'Print the role sheet' },
  tasksTitle: { ar: 'مهام تتغير في هذا الدور 2026–2030', en: 'Tasks changing in this role, 2026–2030' },
  tasksNote: {
    ar: 'مرجع تطويري توضيحي، لا وصف وظيفي ولا متطلب.',
    en: 'An illustrative development reference, not a job description or a requirement.',
  },
  workProduct: { ar: 'نموذج عمل يُظهر المهارة', en: 'A sample work product that shows the skill' },
  targetsTitle: { ar: 'المستوى المستهدف في كل مجال', en: 'Target level in each domain' },
  targetsNote: {
    ar: 'ما يُتوقع عادةً من شاغل هذا الدور، للاسترشاد في حوار التطوير لا للتقييم الوظيفي.',
    en: 'What is usually expected of someone in this role, as a guide for a development conversation, not for performance appraisal.',
  },
  editorial: { ar: 'تقدير تحريري', en: 'Editorial estimate' },
  outOf: { ar: 'من 4', en: 'of 4' },
  responsibilities: { ar: 'المسؤوليات الأساسية', en: 'Core responsibilities' },
  sfia: { ar: 'رموز مهارات SFIA المقابلة', en: 'Matching SFIA skill codes' },
  sfiaNote: { ar: 'مواءمة تحريرية استرشادية.', en: 'An editorial, indicative mapping.' },
  mapLink: { ar: 'كيف يتغير العمل الحكومي: خريطة تحوّل العمل', en: 'How government work is changing: the work-shift map' },
  independence: {
    ar: 'رادار المهارات الرقمية — مفهوم مستقل، ليس منتجاً رسمياً لأي جهة.',
    en: 'Digital Skills Radar — an independent concept, not an official product of any entity.',
  },
} satisfies Record<string, L>

export default function RoleDetail() {
  const { t, lang, go, setRoleId } = useApp()
  const { roleId = '' } = useParams<{ roleId: string }>()
  const href = (path: string) => `/${lang}/${path}`
  const role = libraryRoleById(roleId)
  const profile = roleTasksFor(roleId)

  if (!role) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="eyebrow">{t(label.crumbs)}</p>
        <h1 tabIndex={-1} className="mt-2 text-3xl font-bold text-dga-black">
          {t(label.notFoundTitle)}
        </h1>
        <p className="mt-3 leading-relaxed text-dga-muted">{t(label.notFoundBody)}</p>
        <button type="button" className="btn-primary mt-6" onClick={() => go('roles')}>
          {t(label.backToRoles)}
        </button>
      </div>
    )
  }

  const startAssessment = () => {
    setRoleId(LIB_PREFIX + role.id)
    go('wizard')
  }
  const editorial = claimById('leaders-editorial-role-targets')
  const editorialTasks = claimById('leaders-editorial-role-tasks')
  const otherName = lang === 'ar' ? role.name.en : role.name.ar

  return (
    <div className="role-root mx-auto max-w-5xl px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      <nav aria-label={t(label.crumbs)} className="no-print mb-6 text-sm text-dga-muted">
        <button type="button" onClick={() => go('roles')} className="font-medium text-dga-green-dark hover:underline">
          {t(label.backToRoles)}
        </button>
      </nav>

      <section aria-labelledby="role-title" className="mb-8 print:mb-2">
        <p className="eyebrow">
          {t(label.sheet)} · {t(familyNames[role.family])}
        </p>
        <h1 id="role-title" tabIndex={-1} className="mt-2 text-3xl font-bold text-dga-black sm:text-4xl">
          {t(role.name)} <span className="text-xl font-semibold text-dga-muted sm:text-2xl">{t(PEERS_SUFFIX)}</span>
        </h1>
        <p className="mt-1 text-sm text-dga-muted">
          <span lang={lang === 'ar' ? 'en' : 'ar'} dir={lang === 'ar' ? 'ltr' : 'rtl'}>
            {otherName}
          </span>
        </p>
        <div className="mt-4 max-w-3xl print:mt-1 print:max-w-none">
          <p className="text-sm font-semibold text-dga-ink">{t(label.equivalents)}</p>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label={t(label.equivalents)}>
            {role.equivalents.map((e) => (
              <li key={e.en} className="chip text-dga-ink">
                {t(e)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-dga-ink">
            <span className="font-semibold">{t(label.grade)}</span>{' '}
            <Claim id="method-grade-bands">{`${t(role.name)} ${t(role.gradeBand)}`}</Claim>
          </p>
          <p className="mt-1 text-xs text-dga-muted">{t(label.equivalentsNote)}</p>
        </div>
        <p className="mt-4 max-w-3xl leading-relaxed text-dga-ink print:mt-1 print:max-w-none">{t(role.mission)}</p>
        <div className="no-print mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={startAssessment}>
            {t(label.start)}
          </button>
          <button type="button" className="btn-ghost" onClick={() => window.print()}>
            {t(label.print)}
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5 print:grid-cols-5 print:gap-3">
        {/* changing tasks + work product */}
        <div className="space-y-6 lg:col-span-3 print:col-span-3 print:space-y-3">
          {profile && (
            <section aria-labelledby="tasks-title" className="glass print-avoid p-6 print:p-3">
              <h2 id="tasks-title" className="text-xl font-bold text-dga-black">
                {t(label.tasksTitle)}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-dga-muted">
                <span>{t(label.tasksNote)}</span>
                <span
                  className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber-tx"
                  title={editorialTasks ? t(editorialTasks.text) : undefined}
                >
                  {t(label.editorial)}
                </span>
              </p>
              <ul className="mt-4 space-y-3 print:mt-2 print:space-y-1.5">
                {profile.tasks.map((task, i) => (
                  <li key={i} className="flex flex-col gap-1.5 border-b border-dga-line/60 pb-3 last:border-0 last:pb-0 print:pb-1.5">
                    <span className="leading-relaxed text-dga-ink">{t(task.text)}</span>
                    <span className="flex flex-wrap gap-1.5">
                      <span className={directionTone[task.direction]}>{t(directionMeta[task.direction])}</span>
                      {task.domainIds.map((d) => (
                        <span key={d} className="chip">
                          {t(domainById(d).shortName)}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile && (
            <section aria-labelledby="product-title" className="glass print-avoid border-s-4 border-dga-amber p-6 print:p-3">
              <h2 id="product-title" className="font-bold text-dga-black">
                {t(label.workProduct)}
              </h2>
              <p className="mt-2 leading-relaxed text-dga-ink">{t(profile.workProduct)}</p>
            </section>
          )}

          <section aria-labelledby="resp-title" className="glass print-avoid p-6 print:p-3">
            <h2 id="resp-title" className="font-bold text-dga-black">
              {t(label.responsibilities)}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dga-ink">
              {role.responsibilities.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dga-green" />
                  <span>{t(r)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* targets bar list + SFIA */}
        <div className="space-y-6 lg:col-span-2 print:col-span-2 print:space-y-3">
          <section aria-labelledby="targets-title" className="glass print-avoid p-6 print:p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="targets-title" className="font-bold text-dga-black">
                {t(label.targetsTitle)}
              </h2>
              <span
                className="chip border-dga-amber/40 bg-dga-amber/10 text-dga-amber-tx"
                title={editorial ? t(editorial.text) : undefined}
              >
                {t(label.editorial)}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-dga-muted">{t(label.targetsNote)}</p>
            <ul className="mt-4 space-y-3 print:mt-2 print:space-y-1.5">
              {domains.map((d) => {
                const target = role.targets[d.id] ?? 0
                const level = levels.find((l) => l.value === target)
                return (
                  <li key={d.id} className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-center gap-x-3 gap-y-1 print:grid-cols-[5.6rem_1fr] print:gap-x-2">
                    <span className="text-sm font-medium text-dga-ink">{t(d.shortName)}</span>
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((v) => (
                          <span
                            key={v}
                            className={`h-2.5 min-w-[1rem] flex-1 rounded-full ${
                              v <= target ? 'bg-dga-green' : 'bg-dga-line/60'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="w-20 shrink-0 whitespace-nowrap text-end text-xs text-dga-muted print:w-[4.9rem]">
                        {level ? t(level.name) : '—'}
                        <span className="sr-only">
                          {' '}
                          ({target} {t(label.outOf)})
                        </span>
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="sfia-title" className="glass print-avoid p-6 print:p-3">
            <h2 id="sfia-title" className="font-bold text-dga-black">
              {t(label.sfia)}
            </h2>
            <p className="mt-1 text-xs text-dga-muted">{t(label.sfiaNote)}</p>
            <p className="mt-3 flex flex-wrap gap-1.5" dir="ltr">
              {role.sfia.map((code) => (
                <span key={code} className="rounded-md bg-dga-bg px-2 py-0.5 font-mono text-xs text-dga-ink ring-1 ring-dga-line">
                  {code}
                </span>
              ))}
            </p>
          </section>

          <p className="no-print text-sm">
            <Link to={href('work/shifts')} className="font-medium">
              {t(label.mapLink)}
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 hidden text-xs text-dga-muted print:mt-3 print:block">{t(label.independence)}</p>
    </div>
  )
}
