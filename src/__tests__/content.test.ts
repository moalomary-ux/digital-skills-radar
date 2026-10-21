import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import type { ReactElement } from 'react'
import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
// @ts-ignore: plain Node ESM script without type declarations (scripts/content-lint.mjs)
import * as lintModule from '../../scripts/content-lint.mjs'
import { AppProvider } from '../store'
import { claimById } from '../data/claims'
import { futureClaims } from '../data/claims/future'
import { techClaims } from '../data/claims/tech'
import { scenarios } from '../data/scenarios'
import { statements } from '../data/statements'
import { domains } from '../data/domains'
import { tracks } from '../data/tracks'
import { skillRecords, skillRecordById } from '../data/skillRecords'
import { libraryRoles } from '../data/roleLibrary'
import { roles } from '../data/roles'
import { decliningSkills, domainTrajectories, microSkills, playbookKpis, playbookSections, trajectoryMeta } from '../data/futureSkills'
import { headlineStats } from '../data/guidance'
import { technologies, techClusters, techDomains, techSkills } from '../data/technologies'
import { localizeTech } from '../data/techAr'
import FutureSkills from '../views/FutureSkills'
import TechRadar from '../views/TechRadar'
import Roles from '../views/Roles'
import SkillRegistry from '../views/SkillRegistry'
import type { L } from '../data/types'

/* ------------------------------------------------------------------ setup */

interface Violation {
  file: string
  line: number
  rule: string
  message: string
}
const lint = lintModule as unknown as {
  runContentLint: (opts?: { files?: string[] }) => { files: string[]; violations: Violation[] }
  findClaimRefs: () => { file: string; line: number; id: string }[]
  findBareNumbers: (files: string[]) => { file: string; line: number; excerpt: string }[]
}

/** Files owned by packet P5b (content corrections, item bank, citizen lane removal). */
const P5B_FILES = [
  'src/data/domains.ts',
  'src/data/statements.ts',
  'src/data/scenarios.ts',
  'src/data/tracks.ts',
  'src/data/skillRecords.ts',
  'src/data/roleLibrary.ts',
  'src/data/roles.ts',
  'src/data/futureSkills.ts',
  'src/data/guidance.ts',
  'src/data/technologies.ts',
  'src/data/techAr.ts',
  'src/data/claims/future.ts',
  'src/data/claims/tech.ts',
  'src/views/FutureSkills.tsx',
  'src/views/Roles.tsx',
  'src/views/SkillRegistry.tsx',
  'src/views/TechRadar.tsx',
  'src/routes.tsx',
]

const sources = import.meta.glob(['../data/**/*.ts', '../views/**/*.tsx', '../components/**/*.tsx', '../routes.tsx'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>
const sourceOf = (rel: string) => sources[`../${rel.replace(/^src\//, '')}`]

const filled = (l: L | undefined) => !!l && l.ar.trim() !== '' && l.en.trim() !== ''
const DEPENDENT_AR = /^(?:أفعل|نفعل|أسأل|أضيف)\s+(?:ذلك|لذلك)/
const DEPENDENT_EN = /^(?:Do|Ask|Add) that\b/i

/* --------------------------------------------------------- the item bank */

describe('item bank: scenario options do not reveal the key', () => {
  const best = (s: (typeof scenarios)[number]) => s.options.find((o) => o.score === 3)!

  it('keeps the shape other packets consume: 4 options, scores 0..3 in order, unique ids', () => {
    expect(new Set(scenarios.map((s) => s.id)).size).toBe(scenarios.length)
    for (const s of scenarios) expect(s.options.map((o) => o.score), s.id).toEqual([0, 1, 2, 3])
    for (const tr of tracks) for (const d of domains) expect(scenarios.filter((s) => s.trackId === tr.id && s.domainId === d.id), `${tr.id}/${d.id}`).toHaveLength(1)
  })

  it.each(['ar', 'en'] as const)('the best option is the longest in at most 40%% of items (%s)', (lang) => {
    const longestIsBest = scenarios.filter((s) => {
      const lens = s.options.map((o) => o.text[lang].length)
      return best(s).text[lang].length === Math.max(...lens)
    })
    expect(longestIsBest.length / scenarios.length, longestIsBest.map((s) => s.id).join(', ')).toBeLessThanOrEqual(0.4)
  })

  it.each(['ar', 'en'] as const)('no single score owns the longest option in more than half of the items (%s)', (lang) => {
    const counts = [0, 0, 0, 0]
    for (const s of scenarios) {
      const lens = s.options.map((o) => o.text[lang].length)
      counts[s.options[lens.indexOf(Math.max(...lens))].score]++
    }
    for (const c of counts) expect(c / scenarios.length).toBeLessThanOrEqual(0.5)
  })

  it('options stand alone: none starts with «أفعل ذلك» (or a sibling form) in more than 25% of items — target 0', () => {
    const dependent = scenarios.filter((s) => s.options.some((o) => DEPENDENT_AR.test(o.text.ar) || DEPENDENT_EN.test(o.text.en)))
    expect(dependent.length / scenarios.length).toBeLessThanOrEqual(0.25)
    expect(dependent.map((s) => s.id)).toEqual([])
  })

  it('known typos are gone (F5)', () => {
    const all = JSON.stringify(scenarios)
    for (const bad of ['لعبارات عمل', 'حتى يتعاشرا', 'انتحار', 'يُسألني', 'الانتقل', 'حساب إداري واحدًا', 'وسببته', 'موارد يتيمة', 'الطقسية', 'التسلسل الصامت', 'أراجع التقنين', 'نائب الرئيس', 'سرقة الفضل', 'ميزان قيم'])
      expect(all.includes(bad), bad).toBe(false)
    expect(all).toContain('لأعباء العمل الحرجة')
  })

  it('every scenario text is complete in both languages', () => {
    for (const s of scenarios) {
      expect(filled(s.situation) && filled(s.question), s.id).toBe(true)
      for (const o of s.options) expect(filled(o.text) && filled(o.rationale), s.id).toBe(true)
    }
  })
})

/* ------------------------------------------------- bilingual completeness */

describe('content: both languages complete in P5b data', () => {
  it('domains, statements, role categories, skill records and role profiles', () => {
    for (const d of domains) {
      expect(filled(d.name) && filled(d.shortName) && filled(d.description), d.id).toBe(true)
      for (const s of d.skills) expect(filled(s), d.id).toBe(true)
    }
    for (const s of statements) expect(filled(s.text), s.id).toBe(true)
    for (const tr of tracks) expect(filled(tr.name) && filled(tr.audience) && filled(tr.proves), tr.id).toBe(true)
    for (const r of skillRecords) expect([r.name, r.definition, r.exampleTask, r.evidence, r.prerequisites].every(filled), r.id).toBe(true)
    for (const r of libraryRoles) expect([r.name, r.mission, ...r.responsibilities].every(filled), r.id).toBe(true)
    for (const r of roles) expect(filled(r.name) && filled(r.description), r.id).toBe(true)
  })

  it('future skills and the playbook', () => {
    for (const tr of domainTrajectories) expect([tr.rationale, ...tr.evidence].every(filled), tr.domainId).toBe(true)
    for (const m of microSkills) expect([m.name, m.description, m.demandSignal, m.governmentRelevance, m.firstStep].every(filled), m.id).toBe(true)
    for (const d of decliningSkills) expect([d.name, d.evidence, d.nuance, d.pivot].every(filled), d.id).toBe(true)
    for (const s of playbookSections) for (const it of s.items) expect(filled(it), s.id).toBe(true)
    for (const k of playbookKpis) expect([k.kpi, k.description, k.target].every(filled)).toBe(true)
  })

  it('technologies: every text field is bilingual, Arabic included', () => {
    for (const x of technologies) {
      expect([x.name, x.description, x.trlRationale, ...x.employeeSkills, x.learningFocus.awareness, x.learningFocus.practitioner].every(filled), x.id).toBe(true)
      expect(localizeTech(x, 'ar').rationale).toBe(x.trlRationale.ar)
      expect(localizeTech(x, 'en').skills).toEqual(x.employeeSkills.map((s) => s.en))
    }
    for (const c of techClusters) expect(filled(c.name) && filled(c.essay), c.id).toBe(true)
  })
})

/* ------------------------------------------------------ glossary + lint */

describe('content: glossary and lint on P5b files', () => {
  it('content-lint is clean on every P5b file', () => {
    const { files, violations } = lint.runContentLint({ files: P5B_FILES })
    expect(files).toHaveLength(P5B_FILES.length)
    expect(violations.map((v) => `${v.file}:${v.line} [${v.rule}] ${v.message}`)).toEqual([])
  })

  it('role categories carry the glossary labels (فئة الدور) and keep their ids', () => {
    expect(tracks.map((t) => t.id)).toEqual(['awareness', 'applied', 'specialist', 'team_lead', 'executive'])
    expect(tracks.map((t) => t.name.ar)).toEqual(['عام', 'تطبيقي', 'تخصصي', 'قيادة فرق', 'تنفيذي'])
  })

  it('future signals use «ينمو / يتحوّل / يتراجع», never «يندثر» or «محصّن»', () => {
    expect(Object.values(trajectoryMeta).map((m) => m.name.ar)).toEqual(['ينمو بقوة', 'ينمو', 'يتحوّل', 'يتراجع'])
    for (const rel of ['src/data/futureSkills.ts', 'src/views/FutureSkills.tsx', 'src/data/technologies.ts']) {
      const src = sourceOf(rel)
      for (const bad of ['يندثر', 'محصّن', 'automation-proof', 'نامٍ', 'محو أمية', 'آجايل', 'أجايل', 'البلوك تشين', 'الثقافة البياناتية', 'الوكلاء الأذكياء', 'وكالة البيانات'])
        expect(src.includes(bad), `${rel}: «${bad}»`).toBe(false)
    }
  })

  it('the playbook keeps results out of HR files and invents no KPI target', () => {
    const all = JSON.stringify({ playbookSections, playbookKpis })
    for (const bad of ['ملف الموظف في نظام', 'link assessment results to the employee file', 'مستويات الاستحقاق', 'أكاديمية الحكومة الرقمية', 'جدارات', 'نائب الرئيس', 'فجوة مقاسة'])
      expect(all.includes(bad), bad).toBe(false)
    for (const k of playbookKpis) expect(/\d/.test(k.target.ar + k.target.en), k.kpi.en).toBe(false)
    expect(all).toContain('برنامج قدراتك')
    expect(all).toContain('منصة الاستشارات والدراسات')
  })

  it('Nafath (identity) is never listed as the same thing as Tawakkalna (services)', () => {
    for (const rel of ['src/data/futureSkills.ts', 'src/data/technologies.ts']) {
      expect(sourceOf(rel).includes('نفاذ، توكلنا'), rel).toBe(false)
      expect(sourceOf(rel).includes('Nafath, Tawakkalna'), rel).toBe(false)
    }
  })
})

/* -------------------------------------------------------- claims + counts */

describe('content: figures go through registered claims', () => {
  it('P5b claims are complete, prefixed and explain low confidence', () => {
    for (const c of futureClaims) expect(c.id.startsWith('future-'), c.id).toBe(true)
    for (const c of techClaims) expect(c.id.startsWith('tech-'), c.id).toBe(true)
    for (const c of [...futureClaims, ...techClaims]) {
      expect(filled(c.text) && filled(c.value), c.id).toBe(true)
      if (c.confidence === 'low' || c.kind === 'editorial') expect(Boolean(c.caveat || c.derivation), c.id).toBe(true)
    }
    const coursera = futureClaims.filter((c) => c.source.publisher.en === 'Coursera' || c.source.publisher.en === 'LinkedIn')
    expect(coursera.length).toBeGreaterThan(0)
    for (const c of coursera) expect(['survey', 'self-report'], c.id).toContain(c.kind)
    const adoption = claimById('tech-dga-adoption-index-2026')!
    expect([adoption.kind, adoption.confidence]).toEqual(['official', 'medium'])
    expect(adoption.caveat?.ar).toContain('الجهات المشاركة')
  })

  it('every {{claim}} token and <Claim id> in P5b files resolves', () => {
    const refs = lint.findClaimRefs().filter((r) => P5B_FILES.includes(r.file))
    expect(refs.length).toBeGreaterThan(30)
    expect(refs.filter((r) => !claimById(r.id)).map((r) => `${r.file}:${r.line} ${r.id}`)).toEqual([])
  })

  it('headline stats carry claim ids and no «170M» form', () => {
    for (const s of headlineStats) {
      expect(claimById(s.claimId), s.claimId).toBeDefined()
      expect(s.value).not.toMatch(/\dM\b/)
    }
  })

  it('P5b views and future-skills data show no bare numbers outside claims (years excepted)', () => {
    const hits = lint.findBareNumbers(['src/views/FutureSkills.tsx', 'src/views/Roles.tsx', 'src/views/SkillRegistry.tsx', 'src/views/TechRadar.tsx', 'src/data/futureSkills.ts'])
    expect(hits.map((h) => `${h.file}:${h.line} ${h.excerpt}`)).toEqual([])
  })

  it('counts are derived from data, never written as literals in P5b views', () => {
    for (const rel of ['src/views/FutureSkills.tsx', 'src/views/Roles.tsx', 'src/views/SkillRegistry.tsx', 'src/views/TechRadar.tsx']) {
      const src = sourceOf(rel)
      for (const bad of ['عشرون', 'عشرين', 'أربعون', 'أربعين', 'خمس عشرة', 'الأربعة والعشرين', 'Twenty', 'Forty', 'Fifteen', 'البنفسجي', 'violet'])
        expect(src.includes(bad), `${rel}: «${bad}»`).toBe(false)
      expect(src, rel).not.toMatch(/(?<![\d.])(?:15|20|24|40|48)\s*(?:دور|مهار|تقني|سجل|roles|skills|technologies|records)/)
    }
    expect(sourceOf('src/views/Roles.tsx')).toContain('method-roles-count')
    expect(claimById('method-roles-count')!.value.en).toBe(`${libraryRoles.length} roles`)
  })
})

/* ------------------------------------------------ citizen lane + data model */

describe('content: citizen lane out of v9, data model consistent', () => {
  it('the citizen-lane files and routes are gone', () => {
    for (const rel of ['views/Careers.tsx', 'views/Decide.tsx', 'views/Lists.tsx', 'views/Explore.tsx', 'components/NetworkMap.tsx', 'data/careers.ts'])
      expect(sources[`../${rel}`], rel).toBeUndefined()
    const routes = sourceOf('src/routes.tsx')
    for (const path of ["'careers'", "'careers/:careerId'", "'careers/trends'", "'guidance'", "'map'"]) expect(routes.includes(`path: ${path}`), path).toBe(false)
    for (const rel of P5B_FILES) expect(/careers/i.test(sourceOf(rel) ?? ''), rel).toBe(false)
  })

  it('every technology lists required skills that resolve to the skill catalogue', () => {
    for (const x of technologies) {
      expect(x.skills.length, x.id).toBeGreaterThanOrEqual(2)
      for (const id of x.skills) expect(skillRecordById(id), `${x.id}: ${id}`).toBeDefined()
      expect(techSkills(x)).toHaveLength(x.skills.length)
      for (const d of x.domainIds) expect(techDomains(x)).toContain(d)
    }
  })

  it('role library: SFIA codes are well formed, the flagged code is gone, approximate mappings are labelled', () => {
    for (const r of libraryRoles) for (const code of r.sfia) expect(code, r.id).toMatch(/^[A-Z]{4}$/)
    const codes = libraryRoles.flatMap((r) => r.sfia)
    for (const gone of ['SLEN', 'DEMG', 'SCMO']) expect(codes).not.toContain(gone)
    for (const flagged of ['HCEV', 'ACIN', 'DTAN', 'AIDE'])
      for (const r of libraryRoles.filter((x) => x.sfia.includes(flagged) && x.id !== 'data_engineer' && x.id !== 'data_scientist')) expect(r.sfiaNote, `${r.id} (${flagged})`).toBeDefined()
  })
})

/* -------------------------------------------------------------- the views */

function renderPage(page: () => ReactElement | null, lang: 'ar' | 'en', path: string) {
  localStorage.setItem('dsr-lang', JSON.stringify(lang))
  return render(createElement(MemoryRouter, { initialEntries: [`/${lang}/${path}`] }, createElement(AppProvider, null, createElement(page))))
}

const ARABIC_RUN = /[؀-ۿ][؀-ۿ\s«»،؛]*/g

describe('P5b views: interactive and keyboard reachable (jsdom)', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('FutureSkills: claims resolve, the filter radiogroup narrows the list, focus shows a domain’s signals', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container, getByRole } = renderPage(FutureSkills, 'ar', 'future-skills')
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Claim]'))).toEqual([])
    expect(container.querySelector('h1')?.textContent).toBe('مهارات 2030')
    const text = container.textContent ?? ''
    expect(text).toContain('170 مليون')
    expect(/[٠-٩]/.test(text)).toBe(false)
    const group = getByRole('radiogroup')
    const radios = within(group).getAllByRole('radio')
    expect(radios.map((r) => r.textContent)).toEqual(['الكل', 'ينمو', 'يتحوّل', 'يتراجع'])
    const listButtons = () => [...container.querySelectorAll<HTMLButtonElement>('button[aria-controls="fs-detail"]')]
    expect(listButtons()).toHaveLength(domainTrajectories.length)
    act(() => {
      fireEvent.click(radios[2])
    })
    expect(radios[2].getAttribute('aria-checked')).toBe('true')
    expect(listButtons()).toHaveLength(domainTrajectories.filter((t) => t.rating === 'stable').length)
    // keyboard: arrows move the selection (RTL: ArrowLeft = next)
    act(() => {
      fireEvent.keyDown(radios[2], { key: 'ArrowLeft' })
    })
    expect(radios[3].getAttribute('aria-checked')).toBe('true')
    expect(container.textContent).toContain('لا يُصنَّف أي مجال كاملًا على أنه يتراجع')
    act(() => {
      fireEvent.click(radios[0])
    })
    const cyber = listButtons().find((b) => b.textContent?.includes('الأمن السيبراني'))!
    act(() => {
      fireEvent.focus(cyber)
    })
    expect(cyber.getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('#fs-detail')?.textContent).toContain('الأمن السيبراني والثقة الرقمية')
  })

  it('FutureSkills (en) carries no Arabic text', () => {
    const { container } = renderPage(FutureSkills, 'en', 'future-skills')
    expect((container.textContent ?? '').match(ARABIC_RUN) ?? []).toEqual([])
  })

  it('TechRadar: horizon and domain filters update the list live; selecting shows the required skills, TRL only in details', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container, getAllByRole } = renderPage(TechRadar, 'ar', 'tech-radar')
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Claim]'))).toEqual([])
    expect(container.querySelector('h1')?.textContent).toBe('تقنيات تغيّر العمل الحكومي')
    const visibleCards = () => [...container.querySelectorAll<HTMLButtonElement>('button[aria-controls="tr-detail"]')].filter((b) => !b.closest('li')?.className.includes('hidden'))
    expect(visibleCards()).toHaveLength(technologies.length)
    expect(container.textContent).not.toMatch(/TRL \d/)
    const [horizonGroup, domainGroup] = getAllByRole('radiogroup')
    act(() => {
      fireEvent.click(within(horizonGroup).getAllByRole('radio')[1]) // الآن
    })
    expect(visibleCards()).toHaveLength(technologies.filter((x) => x.horizon === 'now').length)
    act(() => {
      fireEvent.click(within(domainGroup).getAllByRole('radio').find((r) => r.textContent === 'الأمن السيبراني')!)
    })
    const expected = technologies.filter((x) => x.horizon === 'now' && techDomains(x).includes('cyber'))
    expect(visibleCards()).toHaveLength(expected.length)
    act(() => {
      fireEvent.click(visibleCards()[0])
    })
    const detail = container.querySelector('#tr-detail')!
    expect(detail.querySelector('h2')?.textContent).toBe(expected[0].name.ar)
    for (const s of techSkills(expected[0])) expect(detail.textContent).toContain(s.name.ar)
    expect(detail.textContent).toMatch(/TRL \d\/9/)
    expect(detail.textContent).toContain('تقدير تحريري')
  })

  it('Roles: compare mode shows both roles side by side per domain, with the difference', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container, getByRole } = renderPage(Roles, 'ar', 'roles')
    expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Claim]'))).toEqual([])
    expect(container.textContent).toContain(`${libraryRoles.length} دورًا`)
    const sheetLinks = [...container.querySelectorAll('a')].filter((a) => a.getAttribute('href')?.startsWith('/ar/roles/'))
    expect(sheetLinks.length).toBeGreaterThanOrEqual(libraryRoles.length)
    act(() => {
      fireEvent.click(getByRole('button', { name: 'قارن بين دورين' }))
    })
    const table = container.querySelector('table')!
    expect(table.querySelectorAll('tbody tr')).toHaveLength(domains.length)
    const [selA, selB] = [...container.querySelectorAll('select')]
    const a = libraryRoles.find((r) => r.id === 'chief_digital_officer')!
    const b = libraryRoles.find((r) => r.id === 'data_scientist')!
    act(() => {
      fireEvent.change(selA, { target: { value: a.id } })
    })
    act(() => {
      fireEvent.change(selB, { target: { value: b.id } })
    })
    const diffs = domains.filter((d) => a.targets[d.id] !== b.targets[d.id]).length
    expect([...container.querySelectorAll('tbody tr')].filter((tr) => tr.textContent?.includes('أعلى لدى'))).toHaveLength(diffs)
    expect(container.textContent).toContain('أكبر الفروق')
  })

  it('SkillRegistry: live search and domain chips filter instantly; records expand', () => {
    const { container, getByRole } = renderPage(SkillRegistry, 'ar', 'skills')
    const shown = () => [...container.querySelectorAll('li[id^="sr-"]')].filter((li) => !li.className.includes('hidden'))
    expect(shown()).toHaveLength(skillRecords.length)
    const search = getByRole('searchbox')
    act(() => {
      fireEvent.change(search, { target: { value: 'الخصوصيه' } }) // taa marbuta normalized
    })
    expect(shown().length).toBeGreaterThan(0)
    expect(shown().length).toBeLessThan(skillRecords.length)
    act(() => {
      fireEvent.change(search, { target: { value: '' } })
    })
    const cyberChip = [...container.querySelectorAll('button[aria-pressed]')].find((b) => b.textContent === 'الأمن السيبراني')!
    act(() => {
      fireEvent.click(cyberChip)
    })
    expect(shown()).toHaveLength(skillRecords.filter((r) => r.domainId === 'cyber').length)
    const toggle = shown()[0].querySelector<HTMLButtonElement>('button[aria-expanded]')!
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    act(() => {
      fireEvent.click(toggle)
    })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector(`#${toggle.getAttribute('aria-controls')}`)?.className).toContain('block')
  })

  it('SkillRegistry (en) carries no Arabic text, and a #domain link preselects the domain', () => {
    localStorage.setItem('dsr-lang', JSON.stringify('en'))
    const { container } = render(
      createElement(MemoryRouter, { initialEntries: ['/en/skills#domain-policy'] }, createElement(AppProvider, null, createElement(SkillRegistry)))
    )
    expect((container.textContent ?? '').match(ARABIC_RUN) ?? []).toEqual([])
    const shown = [...container.querySelectorAll('li[id^="sr-"]')].filter((li) => !li.className.includes('hidden'))
    expect(shown).toHaveLength(skillRecords.filter((r) => r.domainId === 'policy').length)
  })
})
