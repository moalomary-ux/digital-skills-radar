import { fireEvent, render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { routes } from '../routes'
import { tracks } from '../data/tracks'
import { foldTitle, libraryRoles, matchRoles, resolveRoleName, withPeers } from '../data/roleLibrary'
import { workFamilies } from '../data/workShifts'
import { claimById } from '../data/claims'

/**
 * Owner directive 2026-10-22: «الجهات الحكومية مسمياتها كثيرة» — the product addresses a FUNCTION and
 * a JOB GRADE «ومن في حكمه», never one exact title.
 */

const ARABIC = /[؀-ۿ]/
const filled = (l: { ar: string; en: string }) => l.ar.trim() !== '' && l.en.trim() !== '' && !ARABIC.test(l.en)

const routers: ReturnType<typeof createMemoryRouter>[] = []
afterEach(() => {
  routers.splice(0).forEach((r) => r.dispose())
  localStorage.clear()
})

describe('role categories: function + grade band, «ومن في حكمهم»', () => {
  it('every category keeps its short glossary label and adds who / gradeBand', () => {
    expect(tracks.map((tr) => tr.name.ar)).toEqual(['عام', 'تطبيقي', 'تخصصي', 'قيادة فرق', 'تنفيذي'])
    for (const tr of tracks) {
      for (const l of [tr.audience, tr.gradeBand, tr.who]) expect(filled(l), tr.id).toBe(true)
      expect(tr.audience.ar, tr.id).toContain('ومن في حكمهم')
      expect(tr.who.ar, tr.id).toContain('ومن في حكمهم')
      expect(tr.gradeBand.ar, tr.id).toMatch(/مرتب|مراتب/)
      expect(tr.gradeBand.ar, tr.id).toContain('ما يعادلها')
      expect(tr.gradeBand.en, tr.id).toMatch(/equivalent/)
    }
  })

  it('the grade bands rest on a registered official claim', () => {
    const c = claimById('method-grade-bands')!
    expect(c.kind).toBe('official')
    expect(c.source.url).toMatch(/^https:\/\/www\.hrsd\.gov\.sa\//)
    expect(c.derivation?.ar).toContain('تقدير تحريري')
  })
})

describe('library roles: equivalent titles and grade band', () => {
  it('each of the roles lists 3–6 bilingual equivalents and a grade band «ومن في حكمه»', () => {
    expect(libraryRoles.length).toBeGreaterThan(20)
    for (const r of libraryRoles) {
      expect(r.equivalents.length, r.id).toBeGreaterThanOrEqual(3)
      expect(r.equivalents.length, r.id).toBeLessThanOrEqual(6)
      for (const e of r.equivalents) {
        expect(filled(e), `${r.id}: ${e.ar}`).toBe(true)
        expect(foldTitle(e.ar), `${r.id}: an equivalent repeats the role name`).not.toBe(foldTitle(r.name.ar))
      }
      expect(new Set(r.equivalents.map((e) => foldTitle(e.ar))).size, r.id).toBe(r.equivalents.length)
      expect(r.gradeBand.ar.startsWith('ومن في حكمه'), r.id).toBe(true)
      expect(filled(r.gradeBand), r.id).toBe(true)
    }
  })

  it('the chief digital officer keeps its title and lists the titles entities use (audit question 4)', () => {
    const cdo = libraryRoles.find((r) => r.id === 'chief_digital_officer')!
    expect(cdo.name.ar).toBe('المدير التنفيذي للتحول الرقمي')
    const eq = cdo.equivalents.map((e) => e.ar)
    for (const title of ['الرئيس التنفيذي للشؤون الرقمية', 'مدير عام التحول الرقمي', 'وكيل الجهة للتقنية والتحول الرقمي']) expect(eq).toContain(title)
  })

  it('display names carry «ومن في حكمه» / "or equivalent"; ids stay stable', () => {
    expect(resolveRoleName('lib:data_scientist')).toEqual({ ar: 'عالم البيانات ومن في حكمه', en: 'Data Scientist or equivalent' })
    expect(withPeers({ ar: 'مدير المنتج', en: 'Product Manager' }).ar).toBe('مدير المنتج ومن في حكمه')
    expect(libraryRoles.map((r) => r.id)).toContain('emerging_tech_scout')
  })

  it('title search matches names and equivalents, tolerant of hamza, «ال» and diacritics', () => {
    const ids = (q: string) => matchRoles(q).map((m) => m.role.id)
    expect(ids('مدير عام التحول الرقمي')).toContain('chief_digital_officer')
    expect(matchRoles('مدير عام التحول الرقمي').find((m) => m.role.id === 'chief_digital_officer')?.via?.ar).toBe('مدير عام التحول الرقمي')
    expect(ids('اخصائي امن سيبراني')).toContain('cybersecurity_analyst')
    expect(ids('Scrum Master')).toEqual(['delivery_manager'])
    expect(ids('عالم البيانات')).toContain('data_scientist')
    expect(matchRoles('عالم البيانات').find((m) => m.role.id === 'data_scientist')?.via).toBeUndefined()
    expect(ids('   ')).toEqual([])
  })
})

describe('job families: general function names with equivalents (audit question 9)', () => {
  it('every family keeps its general name and lists equivalents', () => {
    for (const f of workFamilies) {
      expect(f.equivalents.length, f.id).toBeGreaterThanOrEqual(3)
      for (const e of f.equivalents) expect(filled(e), f.id).toBe(true)
    }
    const names = Object.fromEntries(workFamilies.map((f) => [f.id, f.name.ar]))
    expect(names.legal).toBe('المستشار القانوني')
    expect(names.finance).toBe('المسؤول المالي')
    expect(names.communications).toBe('مسؤول الاتصال')
  })
})

describe('wizard: find your role by the title your entity uses', () => {
  it('searching an equivalent title selects the library role «ومن في حكمه»', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/ar/assess'] })
    routers.push(router)
    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
    expect(await screen.findByRole('heading', { level: 1, name: 'ما طبيعة دورك؟' })).toBeInTheDocument()
    // the category cards speak of function and grade, not titles
    expect(screen.getByRole('radio', { name: /تنفيذي/ }).closest('label')!.textContent).toContain('ومن في حكمهم')
    fireEvent.click(screen.getByRole('button', { name: /اختيار دور دقيق/ }))
    fireEvent.change(screen.getByRole('searchbox', { name: /ابحث بمسماك الوظيفي/ }), { target: { value: 'مدير عام التحول الرقمي' } })
    const status = screen.getByRole('status')
    const chip = within(status).getByRole('radio', { name: /المدير التنفيذي للتحول الرقمي/ })
    expect(chip.closest('label')!.textContent).toContain('يطابق: مدير عام التحول الرقمي')
    fireEvent.click(chip)
    expect(screen.getAllByText(/اخترت: المدير التنفيذي للتحول الرقمي ومن في حكمه/).length).toBeGreaterThan(0)
    fireEvent.change(screen.getByRole('searchbox', { name: /ابحث بمسماك الوظيفي/ }), { target: { value: 'لا يوجد مسمى كهذا' } })
    expect(within(screen.getByRole('status')).getByText(/لا دور مطابق/)).toBeInTheDocument()
  })
})
