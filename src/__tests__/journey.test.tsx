import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { routes } from '../routes'
import { AppProvider } from '../store'
import type { ResultRecord } from '../store'
import Report from '../views/Report'
import { domains } from '../data/domains'
import { tracks } from '../data/tracks'
import { categoryTargets } from '../data/levels'
import { priorities, targetsForRecord } from '../lib/priorities'
import { decodeResult } from '../lib/resultCode'

const routers: ReturnType<typeof createMemoryRouter>[] = []
afterEach(() => {
  routers.splice(0).forEach((r) => r.dispose())
})

function renderApp(url: string) {
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  routers.push(router)
  render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
  return router
}

/** The report route is wired by the leader after delivery; here it is mounted directly. */
function renderReport(lang: 'ar' | 'en') {
  const router = createMemoryRouter(
    [{ element: <AppProvider><Outlet /></AppProvider>, children: [{ path: `${lang}/assess/report`, element: <Report /> }] }],
    { initialEntries: [`/${lang}/assess/report`] }
  )
  routers.push(router)
  render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
  return router
}

const text = {
  ar: {
    question: 'ما طبيعة دورك؟',
    start: 'ابدأ الأسئلة',
    next: 'المجال التالي',
    toScenarios: 'مواقف الحكم المهني',
    nextScenario: 'الموقف التالي',
    finish: 'اعرض نتيجتي',
    knowledge: /تحقق معرفي \(اختياري\)/,
    resultsH1: 'أولويات تطويرك المقترحة',
    incomplete: 'لم يُستكمل التحقق',
    devOnly: /للتطوير الذاتي فقط/,
  },
  en: {
    question: 'What is the nature of your role?',
    start: 'Start the questions',
    next: 'Next domain',
    toScenarios: 'Professional judgment scenarios',
    nextScenario: 'Next scenario',
    finish: 'Show my results',
    knowledge: /Knowledge check \(optional\)/,
    resultsH1: 'Your suggested development priorities',
    incomplete: 'check incomplete',
    devOnly: /For self-development only/,
  },
} as const

const applied = tracks.find((tr) => tr.id === 'applied')!

describe.each(['ar', 'en'] as const)('assessment journey (%s)', (lang) => {
  const T = text[lang]

  it('fresh profile → category → 40 statements → 8 scenarios → results with 3 priorities, plan and sheet agree', async () => {
    const router = renderApp(`/${lang}/assess`)
    expect(await screen.findByRole('heading', { level: 1, name: T.question })).toBeInTheDocument()
    expect(screen.getAllByText(T.devOnly).length).toBeGreaterThan(0)

    // step 0: one question — the role category; nothing else is required
    const start = screen.getByRole('button', { name: new RegExp(T.start) })
    expect(start).toBeDisabled()
    fireEvent.click(screen.getByRole('radio', { name: new RegExp(applied.name[lang]) }))
    expect(start).toBeEnabled()
    fireEvent.click(start)

    // 8 domains × 5 statements; the first four domains below the «applied» target (2)
    for (let i = 0; i < domains.length; i++) {
      const h1 = await screen.findByRole('heading', { level: 1, name: domains[i].name[lang] })
      expect(h1).toBeInTheDocument()
      const value = i < 4 ? 1 : 3
      const groups = document.querySelectorAll('fieldset[aria-labelledby^="st-"]')
      expect(groups).toHaveLength(5)
      groups.forEach((g) => fireEvent.click(within(g as HTMLElement).getAllByRole('radio')[value]))
      if (i === 0) {
        // partial knowledge check: 2 attempts only → no agreement flag later
        fireEvent.click(screen.getByRole('button', { name: T.knowledge }))
        const qs = document.querySelectorAll('#knowledge-check fieldset')
        expect(qs.length).toBe(5)
        for (const q of [qs[0], qs[1]]) fireEvent.click(within(q as HTMLElement).getAllByRole('radio')[0])
      }
      const nextName = i < domains.length - 1 ? T.next : T.toScenarios
      fireEvent.click(screen.getByRole('button', { name: new RegExp(nextName) }))
    }

    // 8 judgment scenarios (sibling stage — renders at step ≥ 9)
    for (let s = 0; s < 8; s++) {
      const radios = await screen.findAllByRole('radio')
      expect(radios).toHaveLength(4)
      fireEvent.click(radios[0])
      expect(await screen.findByRole('status')).toBeInTheDocument() // rationale revealed
      fireEvent.click(screen.getByRole('button', { name: s < 7 ? new RegExp(T.nextScenario) : T.finish }))
    }

    // results
    await waitFor(() => expect(router.state.location.pathname).toBe(`/${lang}/assess/results`))
    expect(await screen.findByRole('heading', { level: 1, name: T.resultsH1 })).toBeInTheDocument()
    const list = screen.getByTestId('priority-list')
    const cards = within(list).getAllByRole('listitem')
    expect(cards).toHaveLength(3)

    // the stored record is v2 with honest knowledge tallies
    const history = JSON.parse(localStorage.getItem('dsr-history') ?? '[]') as ResultRecord[]
    expect(history).toHaveLength(1)
    const rec = history[0]
    expect(rec.v).toBe(2)
    expect(rec.trackId).toBe('applied')
    expect(rec.roleId).toBe('cat:applied')
    expect(Object.keys(rec.scenario ?? {})).toHaveLength(8)
    expect(rec.knowledge).toEqual({ [domains[0].id]: { attempted: 2, correct: expect.any(Number) } })
    expect(targetsForRecord(rec)).toEqual(categoryTargets.applied)

    // one engine: headline, list, plan and sheet show the same priorities in the same order
    const expected = priorities(rec, targetsForRecord(rec), domains).map((p) => p.domainId)
    expect(cards.map((c) => c.getAttribute('data-domain'))).toEqual(expected)
    expect(screen.getByTestId('summary-line').textContent).toContain(domains.find((d) => d.id === expected[0])!.name[lang])
    expect(within(screen.getByTestId('evidence-table')).getAllByText(new RegExp(T.incomplete)).length).toBeGreaterThan(0)
    expect(decodeResult((screen.getByTestId('result-code') as HTMLInputElement).value)?.category).toBe('applied')
    expect(screen.getAllByText(T.devOnly).length).toBeGreaterThan(0)

    // interactive radar: choosing a domain opens its detail (keyboard path = the list buttons)
    const levels = within(screen.getByTestId('domain-levels')).getAllByRole('button')
    expect(levels).toHaveLength(8)
    fireEvent.click(levels[2])
    expect(levels[2]).toHaveAttribute('aria-pressed', 'true')
    expect(within(document.getElementById('domain-detail')!).getByRole('heading', { level: 3, name: domains[2].name[lang] })).toBeInTheDocument()

    // plan
    act(() => {
      router.navigate(`/${lang}/assess/plan`)
    })
    const planCards = await screen.findAllByTestId('plan-card')
    expect(planCards.map((c) => c.getAttribute('data-domain'))).toEqual(expected)
    const progress = screen.getByTestId('plan-progress')
    expect(progress.textContent).toMatch(/0.*39/)
    fireEvent.click(within(planCards[0]).getAllByRole('checkbox')[0])
    expect(progress.textContent).toMatch(/1.*39/)
    expect(JSON.parse(localStorage.getItem('dsr-plan-progress') ?? '{}')[rec.id][expected[0]]).toEqual([1])

    // printable sheet
    routers.splice(0).forEach((r) => r.dispose())
    renderReport(lang)
    const sheet = await screen.findByTestId('report-priorities')
    expect(within(sheet).getAllByRole('listitem').map((li) => li.getAttribute('data-domain'))).toEqual(expected)
    expect(decodeResult(screen.getByTestId('report-code').textContent ?? '')).toMatchObject({ category: 'applied', month: rec.date.slice(0, 7) })
    expect(screen.getAllByText(T.devOnly).length).toBeGreaterThan(0)
  }, 30000)

  it('a role-only entrance (precise role, no category) starts at step 0 with the role preselected', async () => {
    localStorage.setItem('dsr-draft', JSON.stringify({ roleId: 'lib:data_scientist', answers: {}, calibration: {}, trackId: null, scenarios: {} }))
    renderApp(`/${lang}/assess`)
    expect(await screen.findByRole('heading', { level: 1, name: T.question })).toBeInTheDocument()
    const roleRadio = screen.getByRole('radio', { name: lang === 'ar' ? /عالم البيانات|علم البيانات/ : /Data Scientist/ })
    expect(roleRadio).toBeChecked()
    expect(screen.getByRole('button', { name: new RegExp(T.start) })).toBeDisabled()
  })
})
