import { createElement } from 'react'
import type { ComponentType } from 'react'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { routes } from '../routes'
import { AppProvider } from '../store'
import { pathFor } from '../lib/routes'
import { hubs, INDEPENDENCE } from '../components/shell/site'
import { shifts } from '../data/leaders/shifts'
import About from '../views/About'
import Entities from '../views/Entities'
import LeadersHub from '../views/hubs/Leaders'
import WorkHub from '../views/hubs/Work'
import RolesSkillsHub from '../views/hubs/RolesSkills'
import EntitiesSectorsHub from '../views/hubs/EntitiesSectors'
import MethodHub from '../views/hubs/Method'

const routers: ReturnType<typeof createMemoryRouter>[] = []

function renderApp(url: string) {
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  routers.push(router)
  render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
  return router
}

function renderView(view: ComponentType, url: string) {
  return render(createElement(MemoryRouter, { initialEntries: [url] }, createElement(AppProvider, null, createElement(view))))
}

afterEach(() => {
  routers.splice(0).forEach((router) => router.dispose())
})

const mainNavName = { ar: 'الأقسام الرئيسية', en: 'Main sections' } as const

describe('header', () => {
  it.each(['ar', 'en'] as const)('renders the six hubs as real links with correct hrefs (%s)', async (lang) => {
    renderApp(`/${lang}`)
    await screen.findByRole('heading', { level: 1 })
    const nav = screen.getByRole('navigation', { name: mainNavName[lang] })
    const links = within(nav).getAllByRole('link')
    expect(links).toHaveLength(6)
    expect(links.map((a) => a.getAttribute('href'))).toEqual(hubs.map((h) => pathFor(h.view, lang)))
    expect(links.map((a) => a.textContent)).toEqual(hubs.map((h) => h.nav[lang]))
    // no buttons pretending to be navigation
    expect(within(nav).queryAllByRole('button')).toHaveLength(0)
  })

  it('marks the active hub and keeps it for sub-pages', async () => {
    renderApp('/ar/leaders/brief')
    await screen.findByRole('heading', { level: 1, name: 'الموجز القيادي' })
    const nav = screen.getByRole('navigation', { name: mainNavName.ar })
    const active = within(nav).getByRole('link', { name: 'للقادة والفرق' })
    expect(active).toHaveAttribute('aria-current', 'true')
    expect(active.className).toContain('is-active')
    expect(within(nav).getByRole('link', { name: 'تقييمي' })).not.toHaveAttribute('aria-current')
  })

  it('offers the same page in the other language as a link, keeping search and hash', async () => {
    renderApp('/ar/methodology?x=1#top')
    await screen.findByRole('heading', { level: 1 })
    const header = document.querySelector('header.site-header') as HTMLElement
    const toggle = within(header).getByRole('link', { name: /English/ })
    expect(toggle).toHaveAttribute('href', '/en/methodology?x=1#top')
    expect(toggle).toHaveAttribute('hreflang', 'en')
  })

  it('switches the persistent button to «أكمل تقييمك» when a draft exists', async () => {
    localStorage.setItem('dsr-draft', JSON.stringify({ roleId: null, answers: { 'ai-1': 2 }, calibration: {}, trackId: null, scenarios: {} }))
    renderApp('/ar')
    await screen.findByRole('heading', { level: 1 })
    const header = document.querySelector('header.site-header') as HTMLElement
    expect(within(header).getByRole('link', { name: 'أكمل تقييمك' })).toHaveAttribute('href', '/ar/assess')
  })

  it('after a completed assessment the header button reads «نتيجتي» and leads to the results (D12c)', async () => {
    const scores = { 'ai-data': 2, cyber: 2, cloud: 2, 'service-design': 2, policy: 2, agile: 2, emerging: 2, leadership: 2 }
    localStorage.setItem('dsr-history', JSON.stringify([{ v: 2, id: 'r-1', date: '2026-10-22T08:00:00.000Z', roleId: 'cat:applied', trackId: 'applied', answers: {}, scores, overall: 2 }]))
    renderApp('/ar')
    await screen.findByRole('heading', { level: 1 })
    const header = document.querySelector('header.site-header') as HTMLElement
    expect(within(header).queryByRole('link', { name: 'أكمل تقييمك' })).toBeNull()
    expect(within(header).getByRole('link', { name: 'نتيجتي' })).toHaveAttribute('href', '/ar/assess/results')
  })

  it('with no draft and no result the header button reads «ابدأ التقييم»', async () => {
    renderApp('/en')
    await screen.findByRole('heading', { level: 1 })
    const header = document.querySelector('header.site-header') as HTMLElement
    expect(within(header).getByRole('link', { name: 'Start the assessment' })).toHaveAttribute('href', '/en/assess')
  })

  // Measured in headless Chrome (P3 note): at 1024 px the six English labels take 630 px of a 683 px slot
  // (scrollbar included), Arabic 527 px of 727 px; at 1280/1440 both fit with the wordmark shown. These
  // budgets keep any later relabelling inside what was measured.
  it('keeps nav labels within the measured one-line budget', () => {
    for (const lang of ['ar', 'en'] as const) {
      const labels = hubs.map((h) => h.nav[lang])
      for (const l of labels) expect(l.length).toBeLessThanOrEqual(19)
      expect(labels.join('').length).toBeLessThanOrEqual(90)
      for (const l of labels) expect(l).not.toMatch(/\n/)
    }
  })

  it('switches language through the header link, keeping the entity, search and hash, with back/forward', async () => {
    const user = userEvent.setup()
    const suffix = '/methodology?source=x&label=a%20b#top'
    const router = renderApp(`/ar${suffix}`)
    await screen.findByRole('heading', { level: 1 })
    const header = () => document.querySelector('header.site-header') as HTMLElement
    await user.click(within(header()).getByRole('link', { name: /English/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/en/methodology'))
    expect(router.state.location.search).toBe('?source=x&label=a%20b')
    expect(router.state.location.hash).toBe('#top')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('dir', 'ltr'))
    await act(async () => {
      await router.navigate(-1)
    })
    expect(router.state.location.pathname).toBe('/ar/methodology')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('dir', 'rtl'))
    await act(async () => {
      await router.navigate(1)
    })
    await user.click(within(header()).getByRole('link', { name: /العربية/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/ar/methodology'))
    expect(router.state.location.search + router.state.location.hash).toBe('?source=x&label=a%20b#top')
  })
})

describe('drawer', () => {
  it('opens and closes with the keyboard, traps focus, and restores focus', async () => {
    const user = userEvent.setup()
    renderApp('/ar')
    await screen.findByRole('heading', { level: 1 })
    const menu = screen.getByRole('button', { name: 'القائمة' })
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(menu).toHaveAttribute('aria-controls', 'site-drawer')

    menu.focus()
    await user.keyboard('{Enter}')
    const dialog = await screen.findByRole('dialog', { name: 'أقسام الرادار' })
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    const close = within(dialog).getByRole('button', { name: 'إغلاق القائمة' })
    await waitFor(() => expect(close).toHaveFocus())

    // every hub is listed, with its sub-pages; the unbuilt team radar is not a link
    for (const hub of hubs) expect(within(dialog).getByRole('link', { name: hub.title.ar })).toHaveAttribute('href', pathFor(hub.view, 'ar'))
    expect(within(dialog).getByRole('link', { name: 'الموجز القيادي' })).toHaveAttribute('href', '/ar/leaders/brief')
    expect(within(dialog).getByRole('link', { name: /رادار الفريق/ })).toHaveAttribute('href', '/ar/leaders/team')

    // focus trap: Shift+Tab from the first element wraps to the last, Tab wraps back
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    const focusables = within(dialog).getAllByRole('link')
    expect(focusables[focusables.length - 1]).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(close).toHaveFocus()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(menu).toHaveFocus())
  })

  it('closes on navigation', async () => {
    const user = userEvent.setup()
    const router = renderApp('/en')
    await screen.findByRole('heading', { level: 1 })
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const dialog = await screen.findByRole('dialog', { name: 'Radar sections' })
    await user.click(within(dialog).getByRole('link', { name: 'Leader brief' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/en/leaders/brief'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})

describe('skip link and focus', () => {
  it('targets #main and moves focus there', async () => {
    const user = userEvent.setup()
    renderApp('/ar')
    await screen.findByRole('heading', { level: 1 })
    const skip = screen.getByRole('link', { name: 'تخطَّ إلى المحتوى' })
    expect(skip).toHaveAttribute('href', '#main')
    const main = document.getElementById('main')!
    expect(main.tagName).toBe('MAIN')
    expect(main).toHaveAttribute('tabindex', '-1')
    // it is the first focusable element on the page
    await user.tab()
    expect(skip).toHaveFocus()
    await user.click(skip)
    expect(main).toHaveFocus()
  })

  it('moves focus to the new page h1 after navigation', async () => {
    const router = renderApp('/ar')
    await screen.findByRole('heading', { level: 1 })
    await act(async () => {
      await router.navigate('/ar/methodology')
    })
    const h1 = await screen.findByRole('heading', { level: 1, name: /المنهجية/ })
    await waitFor(() => expect(h1).toHaveFocus(), { timeout: 2500 })
  })
})

describe('home', () => {
  it('renders the promise, the four persona cards and their real destinations', async () => {
    renderApp('/ar')
    expect(await screen.findByRole('heading', { level: 1, name: /كيف يتغير العمل الحكومي/ })).toBeInTheDocument()
    const expected: [string, string][] = [
      ['أنا موظف', '/ar/assess'],
      ['أنا قيادي', '/ar/leaders/brief'],
      ['أقود فريقاً', '/ar/leaders/team'],
      ['الموارد البشرية والتعلم', '/ar/leaders/adoption'],
    ]
    for (const [name, href] of expected) {
      const heading = screen.getByRole('heading', { level: 3, name })
      expect(within(heading).getByRole('link')).toHaveAttribute('href', href)
    }
    // the team radar is live (review D5): no persona card is marked «قريباً» any more
    expect(screen.queryAllByText('قريباً')).toHaveLength(0)
    // no roadmap or student sections on the home page
    expect(screen.queryByText(/خارطة طريق/)).toBeNull()
    expect(screen.queryByText(/للأفراد والطلاب/)).toBeNull()
  })

  it('explores the five shifts with arrow keys (RTL) and prints every panel', async () => {
    const user = userEvent.setup()
    renderApp('/ar')
    await screen.findByRole('heading', { level: 1 })
    const list = screen.getByRole('tablist', { name: 'التحولات' })
    const tabs = within(list).getAllByRole('tab')
    expect(tabs).toHaveLength(shifts.length)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    tabs[0].focus()
    await user.keyboard('{ArrowLeft}')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveFocus()
    const panel = document.getElementById(tabs[1].getAttribute('aria-controls')!)!
    expect(panel).not.toHaveAttribute('hidden')
    expect(within(panel).getByText(shifts[1].decision.ar)).toBeInTheDocument()
    await user.keyboard('{End}')
    expect(tabs[shifts.length - 1]).toHaveAttribute('aria-selected', 'true')
    // hidden panels stay in the DOM and are revealed by the print stylesheet
    const all = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')!)!)
    for (const p of all) expect(p.className).toContain('print-reveal')
  })

  it('explores the eight domains from the hero radar', async () => {
    const user = userEvent.setup()
    renderApp('/en')
    await screen.findByRole('heading', { level: 1 })
    const list = screen.getByRole('tablist', { name: 'The eight domains' })
    const tabs = within(list).getAllByRole('tab')
    expect(tabs).toHaveLength(8)
    await user.click(tabs[1])
    const panel = document.getElementById(tabs[1].getAttribute('aria-controls')!)!
    expect(within(panel).getByText(/protect beneficiaries/)).toBeInTheDocument()
    tabs[1].focus()
    await user.keyboard('{ArrowRight}')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
  })

  it('never gates visibility on scroll (no whileInView, no initial opacity 0)', async () => {
    const { container } = renderApp('/ar') && { container: document.body }
    await screen.findByRole('heading', { level: 1 })
    expect(container.querySelector('[style*="opacity: 0"]')).toBeNull()
  })
})

describe('about and hubs', () => {
  it('About renders the independence statement, privacy and the honest roadmap', () => {
    renderView(About, '/ar/about')
    expect(screen.getByRole('heading', { level: 1, name: 'عن المفهوم' })).toBeInTheDocument()
    expect(screen.getByText(INDEPENDENCE.ar)).toBeInTheDocument()
    expect(document.getElementById('privacy')).not.toBeNull()
    expect(screen.getByText(/لا يغادر أي شيء متصفحك/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'لم يُبنَ بعد قريباً' })).toBeInTheDocument()
    expect(screen.getByText('22 أكتوبر 2026')).toBeInTheDocument()
  })

  it('About renders in English', () => {
    renderView(About, '/en/about')
    expect(screen.getByText(INDEPENDENCE.en)).toBeInTheDocument()
    expect(screen.getByText('22 October 2026')).toBeInTheDocument()
  })

  it('the adoption guide drops the employee-file link and numeric KPI targets', () => {
    renderView(Entities, '/ar/leaders/adoption')
    expect(screen.getByRole('heading', { level: 1, name: 'دليل التبني المؤسسي' })).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/اربط نتائج التقييم بملف الموظف/)
    expect(document.body.textContent).not.toMatch(/≥\s?\d+%/)
    expect(screen.getAllByText('تقدير تحريري').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('لا عرض لأي تجميع تحت 5 رموز')).toBeInTheDocument()
  })

  it('the adoption checklist is interactive', async () => {
    const user = userEvent.setup()
    renderView(Entities, '/en/leaders/adoption')
    expect(screen.getByText('0 of 7 done')).toBeInTheDocument()
    await user.click(screen.getAllByRole('checkbox')[0])
    expect(screen.getByText('1 of 7 done')).toBeInTheDocument()
  })

  it.each([
    [LeadersHub, 'للقادة والفرق', 'Leaders & teams'],
    [WorkHub, 'تحوّل العمل الحكومي', 'How government work is changing'],
    [RolesSkillsHub, 'الأدوار والمهارات', 'Roles & skills'],
    [EntitiesSectorsHub, 'الجهات والقطاعات', 'Entities & sectors'],
    [MethodHub, 'المنهجية والمصادر', 'Method & sources'],
  ] as const)('hub %#: one h1 in both languages and real links to its pages', (View, ar, en) => {
    const { unmount } = renderView(View, '/ar/x')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: ar })).toBeInTheDocument()
    expect(screen.getAllByRole('link').every((a) => (a.getAttribute('href') ?? '').startsWith('/ar/'))).toBe(true)
    unmount()
    renderView(View, '/en/x')
    expect(screen.getByRole('heading', { level: 1, name: en })).toBeInTheDocument()
  })

  it('the leaders hub chooser updates the recommendation', async () => {
    const user = userEvent.setup()
    renderView(LeadersHub, '/ar/leaders')
    await user.click(screen.getByRole('radio', { name: 'أريد إطلاق التقييم في جهتي' }))
    expect(screen.getByRole('link', { name: /افتح الدليل/ })).toHaveAttribute('href', '/ar/leaders/adoption')
    // the team radar card is a real link now
    expect(screen.getByRole('link', { name: /رادار الفريق/ })).toHaveAttribute('href', '/ar/leaders/team')
  })

  it('the method hub cycles through real examples of a source type', async () => {
    const user = userEvent.setup()
    renderView(MethodHub, '/en/methodology')
    const tabs = within(screen.getByRole('tablist', { name: 'Source types' })).getAllByRole('tab')
    expect(tabs).toHaveLength(5)
    await user.click(tabs[4])
    const panel = document.getElementById(tabs[4].getAttribute('aria-controls')!)!
    const first = within(panel).getByText(/An example from the register/).parentElement!.textContent
    await user.click(within(panel).getByRole('button', { name: /Another example/ }))
    expect(within(panel).getByText(/An example from the register/).parentElement!.textContent).not.toBe(first)
  })

  it('the roles hub matrix is one radio group operable by keyboard', async () => {
    const user = userEvent.setup()
    renderView(RolesSkillsHub, '/en/roles')
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(32)
    await user.click(screen.getByRole('radio', { name: 'Cybersecurity & Digital Trust — Proficiency' }))
    expect(screen.getByRole('heading', { level: 3, name: /Proficiency/ })).toBeInTheDocument()
    expect(screen.getByText(/Security awareness/)).toBeInTheDocument()
  })
})
