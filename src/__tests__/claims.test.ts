// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import type { ReactElement } from 'react'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../store'
import Methodology from '../views/Methodology'
import Standards from '../views/Standards'
import Evidence from '../views/Evidence'
// @ts-ignore: plain Node ESM script without type declarations (scripts/content-lint.mjs)
import * as lintModule from '../../scripts/content-lint.mjs'
import { claimById, claims, duplicateClaimIds } from '../data/claims'
import type { Claim } from '../data/claims'
import { standardsClaims } from '../data/claims/standards'
import { categoryWeightRows, methodClaims, REVIEW_STALE_MONTHS } from '../data/claims/method'
import { crosswalk, frameworkCards, indexCards, reportCards } from '../data/standards'
import { isStale } from '../views/Evidence'
import * as domainsMod from '../data/domains'
import * as statementsMod from '../data/statements'
import * as scenariosMod from '../data/scenarios'
import * as tracksMod from '../data/tracks'
import * as learningMod from '../data/learning'
import * as roleLibraryMod from '../data/roleLibrary'
import * as technologiesMod from '../data/technologies'
import * as levelsMod from '../data/levels'

interface Ref {
  file: string
  line: number
  id: string
  via: 'element' | 'token'
}
interface Hit {
  file: string
  line: number
  excerpt: string
}
const lint = lintModule as unknown as {
  findClaimRefs: () => Ref[]
  findBareNumbers: (files: string[]) => Hit[]
}

/** Files owned by packet P5a: unresolved claim ids there are failures, elsewhere warnings. */
const P5A_FILES = ['src/components/Claim.tsx', 'src/views/Evidence.tsx', 'src/views/Methodology.tsx', 'src/views/Standards.tsx', 'src/data/standards.ts']

const KINDS = ['official', 'international', 'survey', 'self-report', 'editorial']
const CONFIDENCE = ['high', 'medium', 'low']
const EASTERN = /[٠-٩۰-۹]/

const isIsoDate = (s: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

const filled = (l?: { ar: string; en: string }) => !!l && l.ar.trim() !== '' && l.en.trim() !== ''

/** Leading integer of a value such as "8 domains", "7,915" or "24 roles". */
const leadInt = (c: Claim | undefined) => {
  const m = c ? /\d[\d,]*/.exec(c.value.en) : null
  return m ? Number(m[0].replace(/,/g, '')) : Number.NaN
}

/** Read an export defensively: other packets own these modules and may rename exports. */
function exported<T>(mod: Record<string, unknown>, name: string, where: string): T | undefined {
  const v = mod[name] as T | undefined
  if (v === undefined) console.warn(`[claims.test] ${where} no longer exports «${name}»; count check skipped`)
  return v
}

describe('claims registry: contract', () => {
  it('registers at least 30 claims for standards + methodology', () => {
    expect(standardsClaims.length + methodClaims.length).toBeGreaterThanOrEqual(30)
  })

  it('has no duplicate ids', () => {
    expect(duplicateClaimIds()).toEqual([])
  })

  it('every claim is complete: ids, text, value, kind, confidence, source title and publisher, review date', () => {
    const problems: string[] = []
    for (const c of claims) {
      const p = (msg: string) => problems.push(`${c.id}: ${msg}`)
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(c.id)) p('id is not kebab-case with a packet prefix')
      if (!filled(c.text)) p('empty text.ar or text.en')
      if (!filled(c.value)) p('empty value.ar or value.en')
      if (!KINDS.includes(c.kind)) p(`unknown kind ${c.kind}`)
      if (!CONFIDENCE.includes(c.confidence)) p(`unknown confidence ${c.confidence}`)
      if (!filled(c.source?.title)) p('missing source title')
      if (!filled(c.source?.publisher)) p('missing source publisher')
      if (!isIsoDate(c.reviewedOn)) p(`reviewedOn is not an ISO date: ${c.reviewedOn}`)
      if (c.source?.url && !/^https:\/\//.test(c.source.url)) p('source url is not https')
      for (const l of [c.unit, c.scope, c.derivation, c.caveat]) if (l && !filled(l)) p('a bilingual field is half-empty')
      const all = JSON.stringify(c)
      if (EASTERN.test(all)) p('Eastern Arabic digits')
    }
    expect(problems).toEqual([])
  })

  it('P5a claims use their packet prefix', () => {
    expect(standardsClaims.filter((c) => !c.id.startsWith('standards-')).map((c) => c.id)).toEqual([])
    expect(methodClaims.filter((c) => !c.id.startsWith('method-')).map((c) => c.id)).toEqual([])
  })

  it('low-confidence and editorial claims explain themselves (caveat or derivation)', () => {
    const missing = [...standardsClaims, ...methodClaims]
      .filter((c) => c.confidence === 'low' || (c.kind === 'editorial' && c.confidence !== 'high'))
      .filter((c) => !c.caveat && !c.derivation)
      .map((c) => c.id)
    expect(missing).toEqual([])
  })
})

describe('claims registry: references resolve', () => {
  it('every literal <Claim id> / {{id}} in P5a files resolves; other files are reported as warnings', () => {
    const refs = lint.findClaimRefs()
    const unresolved = refs.filter((r) => !claimById(r.id))
    const mine = unresolved.filter((r) => P5A_FILES.includes(r.file))
    const others = unresolved.filter((r) => !P5A_FILES.includes(r.file))
    if (others.length) {
      console.warn(
        `[claims.test] ${others.length} claim reference(s) outside P5a not registered yet:\n` +
          others.map((r) => `  ${r.file}:${r.line} ${r.id}`).join('\n')
      )
    }
    expect(mine.map((r) => `${r.file}:${r.line} ${r.id}`)).toEqual([])
    expect(refs.filter((r) => P5A_FILES.includes(r.file)).length).toBeGreaterThan(20)
  })

  it('claim ids referenced from the standards and methodology data exist', () => {
    const ids = [
      ...crosswalk.flatMap((r) => [r.sfiaClaim, r.digcompClaim]),
      ...[...frameworkCards, ...reportCards, ...indexCards].flatMap((c) => c.claimIds),
      ...categoryWeightRows.map((r) => r.claimId),
    ]
    expect(ids.filter((id) => !claimById(id))).toEqual([])
  })

  it('Methodology and Standards show no bare numbers outside <Claim>', () => {
    const hits = lint.findBareNumbers(['src/views/Methodology.tsx', 'src/views/Standards.tsx', 'src/data/standards.ts'])
    expect(hits.map((h) => `${h.file}:${h.line} ${h.excerpt}`)).toEqual([])
  })
})

describe('claims registry: counts match the data', () => {
  const domains = exported<{ id: string; skills: unknown[] }[]>(domainsMod, 'domains', 'domains.ts')
  const statements = exported<unknown[]>(statementsMod, 'statements', 'statements.ts')
  const scenarios = exported<{ options?: { score: number }[] }[]>(scenariosMod, 'scenarios', 'scenarios.ts')
  const tracks = exported<unknown[]>(tracksMod, 'tracks', 'tracks.ts')
  const questions = exported<{ domainId: string }[]>(learningMod, 'calibrationQuestions', 'learning.ts')
  const roles = exported<unknown[]>(roleLibraryMod, 'libraryRoles', 'roleLibrary.ts')
  const techs = exported<unknown[]>(technologiesMod, 'technologies', 'technologies.ts')
  const clusters = exported<unknown[]>(technologiesMod, 'techClusters', 'technologies.ts')
  const levels = exported<unknown[]>(levelsMod, 'levels', 'levels.ts')
  const levelForScore = exported<(s: number) => { value: number }>(levelsMod, 'levelForScore', 'levels.ts')

  it('domains, skills and levels', () => {
    if (domains) {
      expect(leadInt(claimById('method-domains-count'))).toBe(domains.length)
      expect(domains.every((d) => d.skills.length === leadInt(claimById('method-skills-per-domain')))).toBe(true)
      expect(leadInt(claimById('method-skills-count'))).toBe(domains.reduce((n, d) => n + d.skills.length, 0))
    }
    if (statements) expect(leadInt(claimById('method-skills-count'))).toBe(statements.length)
    if (levels) expect(leadInt(claimById('method-levels-count'))).toBe(levels.length)
  })

  it('level thresholds match levelForScore', () => {
    if (!levelForScore) return
    const [a, b, c] = claimById('method-level-thresholds')!.value.en.split('·').map((x) => Number(x.trim()))
    expect([a, b, c]).toEqual([1.25, 2.25, 3.25])
    expect(levelForScore(a - 0.01).value).toBe(1)
    expect(levelForScore(a).value).toBe(2)
    expect(levelForScore(b - 0.01).value).toBe(2)
    expect(levelForScore(b).value).toBe(3)
    expect(levelForScore(c - 0.01).value).toBe(3)
    expect(levelForScore(c).value).toBe(4)
  })

  it('role categories, scenarios and their scoring', () => {
    if (tracks) expect(leadInt(claimById('method-role-categories'))).toBe(tracks.length)
    if (scenarios) {
      expect(leadInt(claimById('method-scenarios-count'))).toBe(scenarios.length)
      const scores = new Set(scenarios.flatMap((s) => (s.options ?? []).map((o) => o.score)))
      expect([...scores].sort()).toEqual([0, 1, 2, 3])
      expect(scenarios.every((s) => (s.options ?? []).length === 4)).toBe(true)
    }
  })

  it('knowledge check, roles and technologies', () => {
    if (questions) {
      expect(leadInt(claimById('method-knowledge-count'))).toBe(questions.length)
      if (domains) for (const d of domains) expect(questions.filter((q) => q.domainId === d.id).length).toBe(questions.length / domains.length)
    }
    if (roles) expect(leadInt(claimById('method-roles-count'))).toBe(roles.length)
    if (techs) expect(leadInt(claimById('method-tech-count'))).toBe(techs.length)
    if (clusters) expect(claimById('method-tech-count')!.text.en).toContain(`in ${clusters.length} clusters`)
  })

  it('category weights equal the mapping used by the sector data', async () => {
    const mod = await import(/* @vite-ignore */ '../data/sectorSkills').catch(() => null)
    const map = mod ? (mod as Record<string, unknown>).categoryDomainMap : undefined
    if (!map) {
      console.warn('[claims.test] sectorSkills.categoryDomainMap not found; weight check skipped')
      return
    }
    const fromRows = Object.fromEntries(categoryWeightRows.map((r) => [r.key, r.weights]))
    expect(fromRows).toEqual(map)
    for (const r of categoryWeightRows) {
      expect(claimById(r.claimId)!.value.en).toBe(r.weights.map((w) => w.weight.toFixed(1)).join(' · '))
      if (domains) for (const w of r.weights) expect(domains.some((d) => d.id === w.domainId)).toBe(true)
    }
  })

  it('national sheet totals equal the government service data', async () => {
    const mod = await import(/* @vite-ignore */ '../data/govServices').catch(() => null)
    const kpis = mod ? ((mod as Record<string, unknown>).govServiceKpis as { trainingRecords?: number; consultingServices?: number } | undefined) : undefined
    if (!kpis?.trainingRecords) {
      console.warn('[claims.test] govServices.govServiceKpis not found; national totals check skipped')
      return
    }
    expect(leadInt(claimById('method-gov-training-sheet'))).toBe(kpis.trainingRecords)
    expect(leadInt(claimById('method-gov-consulting-sheet'))).toBe(kpis.consultingServices)
  })
})

describe('evidence register: review freshness', () => {
  it('the stale rule follows the registered claim', () => {
    expect(leadInt(claimById('method-review-stale'))).toBe(REVIEW_STALE_MONTHS)
    const today = new Date('2026-10-22T12:00:00Z')
    expect(isStale('2026-10-22', today)).toBe(false)
    expect(isStale('2025-10-23', today)).toBe(false)
    expect(isStale('2025-10-21', today)).toBe(true)
    expect(isStale('not-a-date', today)).toBe(true)
  })

  it('no P5a claim is stale today', () => {
    expect([...standardsClaims, ...methodClaims].filter((c) => isStale(c.reviewedOn)).map((c) => c.id)).toEqual([])
  })
})

/* ------------------------------------------------------------ rendering */

const ARABIC = /[\u0600-\u06FF]/

function renderPage(page: () => ReactElement | null, lang: 'ar' | 'en', path: string) {
  localStorage.setItem('dsr-lang', JSON.stringify(lang))
  return render(createElement(MemoryRouter, { initialEntries: [`/${lang}/${path}`] }, createElement(AppProvider, null, createElement(page))))
}

describe('pages render their claims (jsdom)', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('Methodology (ar): every claim resolves, figures and reconciliation are shown, Western digits only', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = renderPage(Methodology, 'ar', 'methodology')
    const text = container.textContent ?? ''
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Claim]'))).toEqual([])
    expect(container.querySelector('h1')?.textContent).toBe('المنهجية')
    for (const v of ['7,915', '2,873', '7,935', '2,918', '7,891', '1.25 · 2.25 · 3.25', 'n ≥ 10']) expect(text).toContain(v)
    expect(container.querySelectorAll('button[aria-expanded]').length).toBeGreaterThan(30)
    expect(/[\u0660-\u0669]/.test(text)).toBe(false)
    expect(text).toContain('v9')
  })

  it('Standards (ar): corrected facts, editorial crosswalk wording', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = renderPage(Standards, 'ar', 'standards')
    const text = container.textContent ?? ''
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Claim]'))).toEqual([])
    expect(text).toContain('147 مهارة')
    expect(text).not.toContain('121+')
    expect(text).not.toContain('أكثر من 121')
    expect(text).toContain('مواءمة تحريرية استرشادية')
    expect(text).not.toMatch(/(?:تتوافق|تطابق) مباشرة/)
  })

  it('a claim badge is a disclosure: click opens, Esc closes and returns focus', () => {
    const { container } = renderPage(Methodology, 'ar', 'methodology')
    const btn = container.querySelector<HTMLButtonElement>('button[aria-expanded]')!
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    act(() => {
      fireEvent.click(btn)
    })
    expect(btn.getAttribute('aria-expanded')).toBe('true')
    const pop = container.querySelector(`#${btn.getAttribute('aria-controls')}`)!
    expect(pop).toBeTruthy()
    const link = [...pop.querySelectorAll('a')].find((a) => a.getAttribute('href')?.includes('/ar/evidence#ev-'))
    expect(link, 'popover links to the evidence register').toBeTruthy()
    expect(pop.textContent).toContain('آخر مراجعة')
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    // keyboard focus opens it; Esc closes it, keeps focus on the badge and does not reopen it
    act(() => {
      btn.focus()
    })
    expect(btn.getAttribute('aria-expanded')).toBe('true')
    act(() => {
      fireEvent.keyDown(btn, { key: 'Escape' })
    })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(btn)
    // clicking outside closes an open popover
    act(() => {
      fireEvent.click(btn)
    })
    expect(btn.getAttribute('aria-expanded')).toBe('true')
    act(() => {
      fireEvent.mouseDown(document.body)
    })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  it('Evidence (ar): lists every claim; filters and sorting work', () => {
    const { container } = renderPage(Evidence, 'ar', 'evidence')
    const rows = () => container.querySelectorAll('tbody tr[id^="ev-"]')
    expect(rows().length).toBe(claims.length)
    const [search, kind, conf, packet] = [
      container.querySelector<HTMLInputElement>('input[type="search"]')!,
      ...container.querySelectorAll<HTMLSelectElement>('select'),
    ] as [HTMLInputElement, HTMLSelectElement, HTMLSelectElement, HTMLSelectElement]
    act(() => {
      fireEvent.change(kind, { target: { value: 'editorial' } })
    })
    expect(rows().length).toBe(claims.filter((c) => c.kind === 'editorial').length)
    act(() => {
      fireEvent.change(kind, { target: { value: '' } })
      fireEvent.change(conf, { target: { value: 'low' } })
    })
    expect(rows().length).toBe(claims.filter((c) => c.confidence === 'low').length)
    act(() => {
      fireEvent.change(conf, { target: { value: '' } })
      fireEvent.change(packet, { target: { value: 'method' } })
    })
    expect(rows().length).toBe(methodClaims.length)
    act(() => {
      fireEvent.change(packet, { target: { value: '' } })
      fireEvent.change(search, { target: { value: 'SFIA' } })
    })
    const ids = [...rows()].map((r) => r.id)
    expect(ids).toContain('ev-standards-sfia9-skills')
    expect(ids.every((id) => claimById(id.slice(3))!.text.en.includes('SFIA') || JSON.stringify(claimById(id.slice(3))).includes('SFIA'))).toBe(true)
    act(() => {
      fireEvent.change(search, { target: { value: '' } })
    })
    const valueHeader = [...container.querySelectorAll('th[aria-sort]')].find((th) => th.textContent?.includes('القيمة'))!
    act(() => {
      fireEvent.click(valueHeader.querySelector('button')!)
    })
    expect(valueHeader.getAttribute('aria-sort')).toBe('ascending')
    act(() => {
      fireEvent.click(valueHeader.querySelector('button')!)
    })
    expect(valueHeader.getAttribute('aria-sort')).toBe('descending')
  })

  it.each([
    ['methodology', Methodology],
    ['standards', Standards],
    ['evidence', Evidence],
  ] as const)('English %s page carries no Arabic text', (path, page) => {
    const { container } = renderPage(page, 'en', path)
    const text = container.textContent ?? ''
    const arabicRuns = text.match(/[\u0600-\u06FF][\u0600-\u06FF\s«»،؛]*/g) ?? []
    expect(arabicRuns).toEqual([])
    expect(ARABIC.test(container.querySelector('h1')?.textContent ?? '')).toBe(false)
  })
})
