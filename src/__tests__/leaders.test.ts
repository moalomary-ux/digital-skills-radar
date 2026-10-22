// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import shiftsSrc from '../data/leaders/shifts.ts?raw'
import briefSrc from '../data/leaders/brief.ts?raw'
import workShiftsSrc from '../data/workShifts.ts?raw'
import roleTasksSrc from '../data/roleTasks.ts?raw'
import leadersClaimsSrc from '../data/claims/leaders.ts?raw'
import leaderBriefSrc from '../views/leaders/LeaderBrief.tsx?raw'
import leaderCheckSrc from '../views/leaders/LeaderCheck.tsx?raw'
import workShiftsViewSrc from '../views/work/WorkShifts.tsx?raw'
import roleDetailSrc from '../views/RoleDetail.tsx?raw'
import { createElement as h } from 'react'
import type { ReactElement } from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from '../store'
import { domains } from '../data/domains'
import { libraryRoles } from '../data/roleLibrary'
import { scenariosForTrack } from '../data/scenarios'
import { claimById, duplicateClaimIds } from '../data/claims'
import { leadersClaims } from '../data/claims/leaders'
import { shifts } from '../data/leaders/shifts'
import { briefQuestions, checkFocus, focusDecisions, ownedDecisions, shuffledOrder, bestOptionIndex, mostMatureText } from '../data/leaders/brief'
import * as briefModule from '../data/leaders/brief'
import { laneOrder, laneMeta, workFamilies } from '../data/workShifts'
import { directionMeta, roleTasks } from '../data/roleTasks'
import LeaderBrief from '../views/leaders/LeaderBrief'
import LeaderCheck from '../views/leaders/LeaderCheck'
import WorkShifts from '../views/work/WorkShifts'
import RoleDetail from '../views/RoleDetail'

const domainIds = new Set(domains.map((d) => d.id))
const roleIds = new Set(libraryRoles.map((r) => r.id))
const ARABIC = /[؀-ۿ]/
const EASTERN_DIGITS = /[٠-٩۰-۹]/

/** Source text of every file this packet owns (Vite `?raw` imports — no Node APIs needed). */
const OWNED_FILES: Record<string, string> = {
  'data/leaders/shifts.ts': shiftsSrc,
  'data/leaders/brief.ts': briefSrc,
  'data/workShifts.ts': workShiftsSrc,
  'data/roleTasks.ts': roleTasksSrc,
  'data/claims/leaders.ts': leadersClaimsSrc,
  'views/leaders/LeaderBrief.tsx': leaderBriefSrc,
  'views/leaders/LeaderCheck.tsx': leaderCheckSrc,
  'views/work/WorkShifts.tsx': workShiftsViewSrc,
  'views/RoleDetail.tsx': roleDetailSrc,
}

/** Every {ar, en} pair inside a value, with its path. */
function bilingualPairs(value: unknown, path = '$', out: { path: string; ar: string; en: string }[] = []) {
  if (Array.isArray(value)) value.forEach((v, i) => bilingualPairs(v, `${path}[${i}]`, out))
  else if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>
    if (typeof o.ar === 'string' && typeof o.en === 'string') out.push({ path, ar: o.ar, en: o.en })
    else for (const [k, v] of Object.entries(o)) bilingualPairs(v, `${path}.${k}`, out)
  }
  return out
}

function expectBilingual(value: unknown) {
  const pairs = bilingualPairs(value)
  expect(pairs.length).toBeGreaterThan(0)
  for (const p of pairs) {
    expect(p.ar.trim(), `${p.path}.ar empty`).not.toBe('')
    expect(p.en.trim(), `${p.path}.en empty`).not.toBe('')
    expect(ARABIC.test(p.en), `${p.path}.en contains Arabic: ${p.en}`).toBe(false)
  }
}

// ── Data ───────────────────────────────────────────────────────────────

describe('leaders data — the five shifts', () => {
  it('has 5 shifts with complete bilingual content and resolvable claims', () => {
    expect(shifts).toHaveLength(5)
    expect(new Set(shifts.map((s) => s.id)).size).toBe(5)
    expectBilingual(shifts)
    for (const s of shifts) {
      for (const field of [s.title, s.change, s.requires, s.decision, s.unchanged]) {
        expect(ARABIC.test(field.ar)).toBe(true)
      }
      expect(claimById(s.claimId), `claim ${s.claimId}`).toBeDefined()
      expect(domainIds.has(s.domainId), s.domainId).toBe(true)
      for (const d of s.relatedDomainIds) expect(domainIds.has(d), d).toBe(true)
    }
  })

  it('brief: 3 owned decisions and 10 questions (5 for the CIO, 5 for HR)', () => {
    expect(ownedDecisions).toHaveLength(3)
    expect(briefQuestions).toHaveLength(10)
    expect(briefQuestions.filter((q) => q.to === 'cio')).toHaveLength(5)
    expect(briefQuestions.filter((q) => q.to === 'hr')).toHaveLength(5)
    expectBilingual([ownedDecisions, briefQuestions, briefModule.briefMeta, briefModule.checkMeta])
    for (const d of ownedDecisions) {
      expect(domainIds.has(d.domainId)).toBe(true)
      for (const id of d.shiftIds) expect(shifts.some((s) => s.id === id), id).toBe(true)
      if (d.claimId) expect(claimById(d.claimId), d.claimId).toBeDefined()
    }
    expect(claimById(briefModule.briefMeta.contextClaimId)).toBeDefined()
    expect(briefModule.briefMeta.independence.ar).toContain('ليست موقفاً رسمياً لأي جهة')
  })
})

describe('leaders data — the judgment check', () => {
  const items = scenariosForTrack('executive')

  it('uses the 8 executive scenarios, each with a decision title and next step', () => {
    expect(items).toHaveLength(8)
    for (const item of items) expect(checkFocus[item.id], item.id).toBeDefined()
    expect(Object.keys(checkFocus).sort()).toEqual(items.map((i) => i.id).sort())
    expectBilingual(checkFocus)
    expect(claimById(briefModule.checkMeta.claimId)).toBeDefined()
    expect(briefModule.checkMeta.label.ar).toBe('تمرين حكم مهني — تحريري غير معاير')
  })

  it('shuffles options deterministically into a permutation', () => {
    for (const item of items) {
      const a = shuffledOrder(item.id, item.options.length)
      expect(a).toEqual(shuffledOrder(item.id, item.options.length))
      expect([...a].sort()).toEqual([0, 1, 2, 3])
    }
  })

  it('picks the 3 lowest-scoring choices, ties in scenario order, no total', () => {
    const idxFor = (i: number, score: number) => items[i].options.findIndex((o) => o.score === score)
    const answers: Record<string, number> = {}
    items.forEach((item, i) => (answers[item.id] = idxFor(i, 3)))
    answers[items[4].id] = idxFor(4, 0)
    answers[items[1].id] = idxFor(1, 0)
    answers[items[6].id] = idxFor(6, 1)
    expect(focusDecisions(items, answers).map((i) => i.id)).toEqual([items[1].id, items[4].id, items[6].id])

    // all best: ties → the first three scenarios
    const allBest: Record<string, number> = {}
    items.forEach((item) => (allBest[item.id] = bestOptionIndex(item)))
    expect(focusDecisions(items, allBest).map((i) => i.id)).toEqual(items.slice(0, 3).map((i) => i.id))

    // unanswered scenarios are ignored
    expect(focusDecisions(items, { [items[2].id]: idxFor(2, 1) }).map((i) => i.id)).toEqual([items[2].id])
  })
})

describe('leaders data — the most mature move reads on its own', () => {
  it('prefixes the second-best option when the best one says «do that, and…»', () => {
    for (const item of scenariosForTrack('executive')) {
      const best = item.options[bestOptionIndex(item)]
      const text = mostMatureText(item)
      if (/^(أفعل ذلك|نفعل ذلك)/.test(best.text.ar)) {
        const second = item.options.find((o) => o.score === 2)!
        expect(text.ar.startsWith(second.text.ar), item.id).toBe(true)
        expect(text.ar.endsWith(best.text.ar), item.id).toBe(true)
        expect(text.en.startsWith(second.text.en), item.id).toBe(true)
      } else {
        expect(text).toEqual(best.text)
      }
    }
  })
})

describe('leaders data — the work-shift map', () => {
  it('has the 8 government job families × 4 non-empty lanes', () => {
    expect(workFamilies).toHaveLength(8)
    expect(workFamilies.map((f) => f.id)).toEqual([
      'policy-analyst',
      'procurement',
      'hr',
      'beneficiary-service',
      'legal',
      'finance',
      'communications',
      'programme-manager',
    ])
    expect(laneOrder).toEqual(['automated', 'augmented', 'emerging', 'human'])
    expect(laneMeta.automated.name.ar).toBe('تُؤتمت')
    expect(laneMeta.augmented.name.ar).toBe('تُعزَّز')
    expect(laneMeta.emerging.name.ar).toBe('تنشأ')
    expect(laneMeta.human.name.ar).toBe('تبقى إنسانية')
    expectBilingual([workFamilies, laneMeta])
    for (const f of workFamilies) {
      for (const lane of laneOrder) {
        expect(f.lanes[lane].length, `${f.id}.${lane}`).toBeGreaterThanOrEqual(3)
        expect(f.lanes[lane].length, `${f.id}.${lane}`).toBeLessThanOrEqual(5)
      }
      expect(f.managerActions).toHaveLength(3)
      expect(f.rising.length).toBeGreaterThanOrEqual(2)
      for (const r of f.rising) expect(domainIds.has(r.domainId), `${f.id}: ${r.domainId}`).toBe(true)
      expect(f.relatedRoleIds.length).toBeGreaterThan(0)
      for (const id of f.relatedRoleIds) expect(roleIds.has(id), `${f.id}: ${id}`).toBe(true)
      expect(claimById(f.claimId), f.claimId).toBeDefined()
    }
  })

  it('stays qualitative: no percentages in the lanes or actions', () => {
    for (const f of workFamilies) {
      for (const p of bilingualPairs([f.lanes, f.managerActions, f.rising, f.summary])) {
        expect(/%|٪/.test(p.ar + p.en), p.path).toBe(false)
      }
    }
  })
})

describe('leaders data — role → task maps', () => {
  it('covers all 24 library roles with 3–5 changing tasks and a work product', () => {
    expect(libraryRoles).toHaveLength(24)
    expect(Object.keys(roleTasks).sort()).toEqual([...roleIds].sort())
    expectBilingual([roleTasks, directionMeta])
    for (const role of libraryRoles) {
      const p = roleTasks[role.id]
      expect(p, role.id).toBeDefined()
      expect(p.tasks.length, role.id).toBeGreaterThanOrEqual(3)
      expect(p.tasks.length, role.id).toBeLessThanOrEqual(5)
      for (const task of p.tasks) {
        expect(task.domainIds.length).toBeGreaterThanOrEqual(1)
        expect(task.domainIds.length).toBeLessThanOrEqual(2)
        for (const d of task.domainIds) expect(domainIds.has(d), `${role.id}: ${d}`).toBe(true)
      }
    }
  })
})

describe('leaders claims and content rules', () => {
  it('registers well-formed, unique leaders claims', () => {
    expect(leadersClaims.length).toBeGreaterThanOrEqual(10)
    expect(duplicateClaimIds()).toEqual([])
    expectBilingual(leadersClaims)
    for (const c of leadersClaims) {
      expect(c.id.startsWith('leaders-'), c.id).toBe(true)
      expect(c.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (c.kind === 'editorial') expect(c.confidence).toBe('low')
    }
  })

  it('every domainId used by this packet exists in domains.ts', () => {
    const used = [
      ...shifts.flatMap((s) => [s.domainId, ...s.relatedDomainIds]),
      ...ownedDecisions.map((d) => d.domainId),
      ...workFamilies.flatMap((f) => f.rising.map((r) => r.domainId)),
      ...Object.values(roleTasks).flatMap((p) => p.tasks.flatMap((t) => t.domainIds)),
    ]
    expect(used.filter((d) => !domainIds.has(d))).toEqual([])
  })

  it('has no Eastern digits and no forbidden glossary terms in the packet files', () => {
    const forbidden = ['قيّس', 'مسار', '170M', 'توعوي', 'يندثر', 'محصّن', 'تخطيط العدو', 'مسارات التطوير', 'معايرة', 'Qudratok', 'QTech', 'منصة وطنية']
    for (const [rel, src] of Object.entries(OWNED_FILES)) {
      expect(src.length, rel).toBeGreaterThan(100)
      expect(EASTERN_DIGITS.test(src), `${rel}: Eastern digits`).toBe(false)
      for (const w of forbidden) expect(src.includes(w), `${rel}: «${w}»`).toBe(false)
    }
  })
})

// ── Rendering (memory router, both languages) ─────────────────────────

function renderAt(path: string, routePath: string, element: ReactElement, lang: 'ar' | 'en') {
  localStorage.setItem('dsr-lang', JSON.stringify(lang))
  return render(
    h(MemoryRouter, { initialEntries: [path] }, h(AppProvider, null, h(Routes, null, h(Route, { path: routePath, element })))),
  )
}

describe('leaders views render', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    window.scrollTo = (() => {}) as typeof window.scrollTo
    window.print = () => {}
  })
  afterEach(() => cleanup())

  it('LeaderBrief renders in Arabic and English', () => {
    renderAt('/ar/leaders/brief', '/:lang/leaders/brief', h(LeaderBrief), 'ar')
    expect(screen.getByRole('heading', { level: 1, name: 'الموجز القيادي' })).toBeTruthy()
    for (const s of shifts) expect(screen.getByRole('heading', { level: 3, name: new RegExp(s.title.ar) })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '3 قرارات تملكها هذا العام' })).toBeTruthy()
    expect(screen.getAllByText(/ليست موقفاً رسمياً لأي جهة/).length).toBeGreaterThan(0)
    const links = screen.getAllByRole('link', { name: /فحص القرار القيادي/ })
    expect(links[0].getAttribute('href')).toBe('/ar/leaders/check')
    cleanup()

    renderAt('/en/leaders/brief', '/:lang/leaders/brief', h(LeaderBrief), 'en')
    expect(screen.getByRole('heading', { level: 1, name: 'The leader brief' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '10 questions to ask your CIO and your HR director' })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: /leader judgment check/i })[0].getAttribute('href')).toBe('/en/leaders/check')
  })

  it('LeaderCheck walks 8 scenarios to «3 قرارات تستحق وقتك» with no score and no history entry', () => {
    renderAt('/ar/leaders/check', '/:lang/leaders/check', h(LeaderCheck), 'ar')
    expect(screen.getByRole('heading', { level: 1, name: 'فحص القرار القيادي' })).toBeTruthy()
    expect(screen.getByText('تمرين حكم مهني — تحريري غير معاير')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ الفحص' }))
    for (let i = 0; i < 8; i++) {
      expect(screen.getByText(`الموقف ${i + 1} من 8`)).toBeTruthy()
      const next = screen.getByRole('button', { name: i === 7 ? 'اعرض القرارات' : 'التالي' }) as HTMLButtonElement
      expect(next.disabled).toBe(true)
      const options = within(screen.getByRole('list', { name: 'الخيارات' })).getAllByRole('button')
      expect(options).toHaveLength(4)
      fireEvent.click(options[0])
      expect(next.disabled).toBe(false)
      fireEvent.click(next)
    }
    expect(screen.getByRole('heading', { level: 1, name: '3 قرارات تستحق وقتك' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3)
    expect(screen.queryByRole('progressbar')).toBeNull()
    expect(screen.getAllByText(/خطوتك التالية/).length).toBe(3)
    expect(localStorage.getItem('dsr-history') ?? '[]').toBe('[]')
    expect(sessionStorage.getItem('dsr-leader-check-v1')).toContain('"step":8')
    cleanup()

    sessionStorage.clear()
    renderAt('/en/leaders/check', '/:lang/leaders/check', h(LeaderCheck), 'en')
    expect(screen.getByRole('heading', { level: 1, name: 'Leader judgment check' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Start the check' }))
    expect(screen.getByText('Situation 1 of 8')).toBeTruthy()
  })

  it('WorkShifts: family tablist with arrow keys (RTL and LTR) and 4 lanes', () => {
    renderAt('/ar/work/shifts', '/:lang/work/shifts', h(WorkShifts), 'ar')
    expect(screen.getByRole('heading', { level: 1, name: 'خريطة تحوّل العمل الحكومي' })).toBeTruthy()
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(8)
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    for (const lane of ['تُؤتمت', 'تُعزَّز', 'تنشأ', 'تبقى إنسانية']) expect(screen.getByRole('heading', { level: 4, name: lane })).toBeTruthy()
    fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' }) // RTL: left = next
    expect(screen.getAllByRole('tab')[1].getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('heading', { level: 2, name: 'أخصائي المشتريات' })).toBeTruthy()
    fireEvent.keyDown(screen.getAllByRole('tab')[1], { key: 'End' })
    expect(screen.getByRole('heading', { level: 2, name: 'مدير المشاريع والبرامج' })).toBeTruthy()
    cleanup()

    renderAt('/en/work/shifts?family=legal', '/:lang/work/shifts', h(WorkShifts), 'en')
    expect(screen.getByRole('heading', { level: 2, name: 'Legal advisor' })).toBeTruthy()
    const enTabs = screen.getAllByRole('tab')
    fireEvent.keyDown(enTabs[4], { key: 'ArrowRight' }) // LTR: right = next
    expect(screen.getByRole('heading', { level: 2, name: 'Finance officer' })).toBeTruthy()
    expect(screen.getAllByRole('link').some((a) => a.getAttribute('href')?.startsWith('/en/roles/'))).toBe(true)
  })

  it('RoleDetail renders a role sheet, starts the assessment with the lib: id, and falls back gracefully', () => {
    renderAt('/ar/roles/data_scientist', '/:lang/roles/:roleId', h(RoleDetail), 'ar')
    expect(screen.getByRole('heading', { level: 1, name: 'عالم البيانات ومن في حكمه' })).toBeTruthy()
    // titles differ between entities: equivalent titles and the grade band are on the sheet
    expect(within(screen.getByRole('list', { name: 'مسميات مكافئة في الجهات' })).getByText('أخصائي علم البيانات')).toBeTruthy()
    expect(screen.getByText(/عالم البيانات ومن في حكمه بأي مرتبة حتى الثالثة عشرة/)).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'مهام تتغير في هذا الدور 2026–2030' })).toBeTruthy()
    expect(screen.getByText('DATS')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ التقييم لهذا الدور' }))
    expect(JSON.parse(localStorage.getItem('dsr-draft') ?? '{}').roleId).toBe('lib:data_scientist')
    cleanup()

    renderAt('/en/roles/not-a-role', '/:lang/roles/:roleId', h(RoleDetail), 'en')
    expect(screen.getByRole('heading', { level: 1, name: 'We could not find this role' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Back to roles' })).toBeTruthy()
    cleanup()

    for (const role of libraryRoles) {
      renderAt(`/en/roles/${role.id}`, '/:lang/roles/:roleId', h(RoleDetail), 'en')
      expect(screen.getByRole('heading', { level: 1, name: `${role.name.en} or equivalent` })).toBeTruthy()
      expect(within(screen.getByRole('list', { name: 'Equivalent titles in entities' })).getAllByRole('listitem')).toHaveLength(role.equivalents.length)
      cleanup()
    }
  })
})
