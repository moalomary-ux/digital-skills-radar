import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../store'
import { domains } from '../data/domains'
import { levels } from '../data/levels'
import { familyNames, familyOrder, libraryRoleById, libraryRoles, LIB_PREFIX } from '../data/roleLibrary'
import type { LibraryRole } from '../data/roleLibrary'
import { pathFor } from '../lib/routes'
import Claim, { ClaimText } from '../components/Claim'
import type { L, Lang } from '../data/types'

const ui = {
  eyebrow: { ar: 'مرجعية إطار الأدوار الرقمية البريطاني (DDaT) وإطار SFIA 9', en: 'Grounded in the UK DDaT framework and SFIA 9' },
  title: { ar: 'مكتبة الأدوار الرقمية', en: 'Digital role library' },
  intro: {
    ar: 'تضم المكتبة {{method-roles-count}} في العمل الحكومي الرقمي، ولكل دور مستهدف تطويري استرشادي في المجالات الثمانية. اختر دورك ليصبح هو المضلع المستهدف (الكهرماني) في تقييمك، أو قارن بين دورين لترى الفرق في المستهدفات.',
    en: 'The library holds {{method-roles-count}} in digital government work, each with an indicative development target in the eight domains. Pick your role to make it the target polygon (amber) in your assessment, or compare two roles to see how their targets differ.',
  },
  families: { ar: 'العائلات الوظيفية', en: 'Role families' },
  browse: { ar: 'تصفح الأدوار', en: 'Browse roles' },
  compare: { ar: 'قارن بين دورين', en: 'Compare two roles' },
  mode: { ar: 'طريقة العرض', en: 'View' },
  sheet: { ar: 'افتح ورقة الدور', en: 'Open the role sheet' },
  assess: { ar: 'قِس نفسك مقابل هذا الدور', en: 'Assess yourself against this role' },
  addA: { ar: 'قارنه (الدور الأول)', en: 'Compare (role A)' },
  addB: { ar: 'قارنه (الدور الثاني)', en: 'Compare (role B)' },
  sfia: { ar: 'رموز SFIA 9', en: 'SFIA 9 codes' },
  sfiaApprox: {
    ar: 'مواءمة هذا الدور مع رموز SFIA 9 تقريبية؛ تحقّق من الرمز في القائمة الرسمية.',
    en: 'This role’s SFIA 9 mapping is approximate; check the code in the official list.',
  },
  sfiaAll: { ar: 'قائمة مهارات SFIA 9 الرسمية', en: 'The official SFIA 9 skills list' },
  roleA: { ar: 'الدور الأول', en: 'Role A' },
  roleB: { ar: 'الدور الثاني', en: 'Role B' },
  swap: { ar: 'بدّل الدورين', en: 'Swap roles' },
  domain: { ar: 'المجال', en: 'Domain' },
  diff: { ar: 'الفرق', en: 'Difference' },
  same: { ar: 'متساويان', en: 'Same' },
  higherIn: { ar: 'أعلى لدى', en: 'Higher for' },
  biggest: { ar: 'أكبر الفروق', en: 'Largest differences' },
  identical: { ar: 'المستهدفات متطابقة في كل المجالات.', en: 'The targets are identical in every domain.' },
  sameRole: { ar: 'اختر دورين مختلفين لترى الفروق.', en: 'Pick two different roles to see the differences.' },
  levelWord: { ar: 'المستوى', en: 'level' },
  targetsNote: {
    ar: 'المستهدفات استرشادية تحريرية للتطوير، وليست معايير وظيفية ولا شروط شغل.',
    en: 'Targets are indicative and editorial, for development; they are not job standards or appointment criteria.',
  },
} satisfies Record<string, L>

const arrow = (lang: Lang) => (lang === 'ar' ? '←' : '→')

export default function Roles() {
  const { t, lang, go, setRoleId } = useApp()
  const [params, setParams] = useSearchParams()

  const mode: 'browse' | 'compare' = params.get('view') === 'compare' ? 'compare' : 'browse'
  const a = libraryRoleById(params.get('a') ?? '') ?? libraryRoles[0]
  const b = libraryRoleById(params.get('b') ?? '') ?? libraryRoles.find((r) => r.family !== a.family) ?? libraryRoles[1]
  const familiesInUse = familyOrder.filter((f) => libraryRoles.some((r) => r.family === f))

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v === null) p.delete(k)
      else p.set(k, v)
    }
    setParams(p, { replace: true, preventScrollReset: true })
  }

  const assess = (role: LibraryRole) => {
    setRoleId(LIB_PREFIX + role.id)
    go('wizard')
  }

  const compareWith = (role: LibraryRole, slot: 'a' | 'b') => {
    update({ view: 'compare', [slot]: role.id, ...(slot === 'a' ? { b: b.id === role.id ? null : b.id } : { a: a.id }) })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">{t(ui.eyebrow)}</p>
        <h1 className="mt-2 text-h1 font-bold text-dga-green-deep">{t(ui.title)}</h1>
        <p className="mt-3 leading-relaxed text-dga-muted">
          <ClaimText text={t(ui.intro)} />
        </p>
        <p className="mt-2 text-xs text-dga-muted">{t(ui.targetsNote)}</p>
      </div>

      <div className="no-print mb-8 flex flex-wrap items-center gap-2" role="group" aria-label={t(ui.mode)}>
        {(['browse', 'compare'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => update({ view: m === 'compare' ? 'compare' : null, ...(m === 'compare' ? { a: a.id, b: b.id } : {}) })}
            className={`chip cursor-pointer px-3.5 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green ${mode === m ? 'border-dga-green bg-dga-green font-semibold !text-white' : 'hover:border-dga-green'}`}
          >
            {t(m === 'browse' ? ui.browse : ui.compare)}
          </button>
        ))}
      </div>

      {mode === 'compare' ? (
        <CompareRoles a={a} b={b} onPick={(slot, id) => update({ [slot]: id })} onSwap={() => update({ a: b.id, b: a.id })} />
      ) : null}

      <div className={mode === 'compare' ? 'hidden print:block' : ''}>
        <h2 className="sr-only">{t(ui.families)}</h2>
        {familiesInUse.map((fam) => {
          const famRoles = libraryRoles.filter((r) => r.family === fam)
          return (
            <section key={fam} aria-labelledby={`fam-${fam.replace(/\W+/g, '-')}`} className="mb-10">
              <h3 id={`fam-${fam.replace(/\W+/g, '-')}`} className="mb-4 flex items-center gap-3 text-lg font-bold text-dga-black">
                <span className="h-px w-8 bg-dga-green" aria-hidden />
                {t(familyNames[fam])}
                <span className="text-sm font-normal text-dga-muted">({famRoles.length})</span>
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {famRoles.map((r) => (
                  <li key={r.id} className="glass flex flex-col p-5">
                    <h4 className="font-bold leading-snug text-dga-black">
                      <Link to={pathFor('role', lang, { roleId: r.id })} className="hover:text-dga-green-dark hover:underline">
                        {t(r.name)}
                      </Link>
                    </h4>
                    <p className="mt-1 text-[11px] text-dga-muted" lang={lang === 'ar' ? 'en' : 'ar'} dir={lang === 'ar' ? 'ltr' : 'rtl'}>
                      {lang === 'ar' ? r.name.en : r.name.ar}
                    </p>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-dga-muted">{t(r.mission)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1" role="group" aria-label={t(ui.sfia)}>
                      {r.sfia.map((code) => (
                        <span key={code} className="rounded-md bg-dga-bg px-1.5 py-0.5 font-mono text-[10px] text-dga-muted" dir="ltr">
                          {code}
                        </span>
                      ))}
                      {r.sfiaNote ? (
                        <span className="chip border-dga-amber/50 bg-amber-50 text-[10px] text-dga-amber-tx" title={t(ui.sfiaApprox)}>
                          {t(r.sfiaNote)}
                          <span className="sr-only">{` — ${t(ui.sfiaApprox)}`}</span>
                        </span>
                      ) : null}
                    </div>
                    <div className="no-print mt-4 flex flex-wrap gap-x-3 gap-y-2 border-t border-dga-line pt-3 text-[12px] font-semibold">
                      <Link to={pathFor('role', lang, { roleId: r.id })} className="text-dga-green-dark underline underline-offset-2">
                        {t(ui.sheet)} <span aria-hidden>{arrow(lang)}</span>
                      </Link>
                      <button type="button" onClick={() => assess(r)} className="text-dga-green-dark underline underline-offset-2">
                        {t(ui.assess)}
                      </button>
                      <button type="button" onClick={() => compareWith(r, 'a')} className="text-dga-ink underline underline-offset-2">
                        {t(ui.addA)}
                      </button>
                      <button type="button" onClick={() => compareWith(r, 'b')} className="text-dga-ink underline underline-offset-2">
                        {t(ui.addB)}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        <p className="text-xs text-dga-muted">
          <a href="https://sfia-online.org/en/sfia-9/skills" target="_blank" rel="noopener noreferrer" className="font-semibold text-dga-green-dark underline underline-offset-2">
            {t(ui.sfiaAll)}
            <span className="sr-only">{t({ ar: ' (يفتح في نافذة جديدة)', en: ' (opens in a new tab)' })}</span>
          </a>
        </p>
      </div>
    </div>
  )
}

/** Side-by-side target levels of two roles, per domain, with the difference highlighted. */
function CompareRoles({ a, b, onPick, onSwap }: { a: LibraryRole; b: LibraryRole; onPick: (slot: 'a' | 'b', id: string) => void; onSwap: () => void }) {
  const { t, lang } = useApp()
  const rows = useMemo(
    () =>
      domains.map((d) => {
        const va = a.targets[d.id] ?? 0
        const vb = b.targets[d.id] ?? 0
        return { d, va, vb, delta: vb - va }
      }),
    [a, b]
  )
  const maxLevel = levels.length
  const levelName = (v: number) => (v >= 1 && v <= maxLevel ? t(levels[v - 1].name) : '—')
  const biggest = rows.filter((r) => r.delta !== 0).sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta)).slice(0, 3)
  const same = a.id === b.id

  const picker = (slot: 'a' | 'b', value: string, label: string, swatch: string) => (
    <label className="flex min-w-[14rem] flex-1 flex-col gap-1 text-xs font-semibold text-dga-muted">
      <span className="flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${swatch}`} aria-hidden />
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onPick(slot, e.target.value)}
        className="rounded-btn border border-dga-line bg-white px-2 py-2 text-sm font-normal text-dga-ink focus:border-dga-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dga-green"
      >
        {familyOrder.map((fam) => {
          const list = libraryRoles.filter((r) => r.family === fam)
          if (!list.length) return null
          return (
            <optgroup key={fam} label={t(familyNames[fam])}>
              {list.map((r) => (
                <option key={r.id} value={r.id}>
                  {t(r.name)}
                </option>
              ))}
            </optgroup>
          )
        })}
      </select>
    </label>
  )

  return (
    <section aria-labelledby="cmp-title" className="glass-strong mb-10 p-5 sm:p-6">
      <h2 id="cmp-title" className="text-lg font-bold text-dga-black">
        {t(ui.compare)}
      </h2>
      <div className="no-print mt-4 flex flex-wrap items-end gap-3">
        {picker('a', a.id, t(ui.roleA), 'bg-dga-green')}
        <button type="button" onClick={onSwap} className="btn-ghost px-3 py-2 text-xs" aria-label={t(ui.swap)}>
          <span aria-hidden>⇄</span> {t(ui.swap)}
        </button>
        {picker('b', b.id, t(ui.roleB), 'bg-dga-amber')}
      </div>
      <p className="mt-3 hidden text-sm print:block">
        <strong>{t(ui.roleA)}:</strong> {t(a.name)} · <strong>{t(ui.roleB)}:</strong> {t(b.name)}
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <caption className="sr-only">{`${t(ui.compare)}: ${t(a.name)} / ${t(b.name)}`}</caption>
          <thead>
            <tr className="border-b border-dga-line text-xs text-dga-muted">
              <th scope="col" className="p-2 text-start font-semibold">{t(ui.domain)}</th>
              <th scope="col" className="p-2 text-start font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-dga-green" aria-hidden />
                  {t(a.name)}
                </span>
              </th>
              <th scope="col" className="p-2 text-start font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-dga-amber" aria-hidden />
                  {t(b.name)}
                </span>
              </th>
              <th scope="col" className="p-2 text-start font-semibold">{t(ui.diff)}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ d, va, vb, delta }) => (
              <tr key={d.id} className={`border-b border-dga-line/70 last:border-0 ${delta !== 0 ? 'bg-amber-50/40' : ''}`}>
                <th scope="row" className="p-2 text-start font-semibold text-dga-black">{t(d.shortName)}</th>
                <td className="p-2">
                  <Bar value={va} max={maxLevel} tone="bg-dga-green" label={`${levelName(va)} (${va})`} />
                </td>
                <td className="p-2">
                  <Bar value={vb} max={maxLevel} tone="bg-dga-amber" label={`${levelName(vb)} (${vb})`} />
                </td>
                <td className="p-2">
                  {delta === 0 ? (
                    <span className="text-xs text-dga-muted">{t(ui.same)}</span>
                  ) : (
                    <span className={`chip text-[11px] font-bold ${delta > 0 ? 'border-dga-amber/60 text-dga-amber-tx' : 'border-dga-green/50 text-dga-green-dark'}`}>
                      <span dir="ltr">{delta > 0 ? `+${delta}` : `${delta}`}</span>
                      <span>{`${t(ui.higherIn)} ${t(delta > 0 ? b.name : a.name)}`}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-btn bg-dga-bg p-3 text-sm text-dga-ink" aria-live="polite">
        {same ? (
          t(ui.sameRole)
        ) : biggest.length === 0 ? (
          t(ui.identical)
        ) : (
          <>
            <span className="font-semibold">{`${t(ui.biggest)}: `}</span>
            {biggest
              .map((r) => `${t(r.d.shortName)} (${levelName(r.va)} ${arrow(lang)} ${levelName(r.vb)})`)
              .join(lang === 'ar' ? '، ' : ', ')}
          </>
        )}
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-dga-muted">
        {t(ui.targetsNote)}
        <Claim id="method-roles-count" variant="icon">
          <span className="sr-only">{t(ui.title)}</span>
        </Claim>
      </p>
      <div className="no-print mt-4 flex flex-wrap gap-3 text-[12px] font-semibold">
        <Link to={pathFor('role', lang, { roleId: a.id })} className="text-dga-green-dark underline underline-offset-2">
          {`${t(ui.sheet)}: ${t(a.name)}`}
        </Link>
        <Link to={pathFor('role', lang, { roleId: b.id })} className="text-dga-green-dark underline underline-offset-2">
          {`${t(ui.sheet)}: ${t(b.name)}`}
        </Link>
      </div>
    </section>
  )
}

/** A horizontal level bar with its value as visible text (the text is the equivalent). */
function Bar({ value, max, tone, label }: { value: number; max: number; tone: string; label: string }) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-28 shrink-0 overflow-hidden rounded-pill bg-dga-line/60 print:border print:border-dga-line" aria-hidden>
        <div className={`h-full rounded-pill ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-dga-ink">{label}</span>
    </div>
  )
}
