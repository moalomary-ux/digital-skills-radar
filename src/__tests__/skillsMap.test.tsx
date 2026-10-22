import { createElement } from 'react'
import type { ComponentType } from 'react'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { routes } from '../routes'
import { AppProvider } from '../store'
import SkillsMap from '../views/SkillsMap'
import RolesSkillsHub from '../views/hubs/RolesSkills'
import { domains } from '../data/domains'
import { libraryRoles } from '../data/roleLibrary'
import { workFamilies } from '../data/workShifts'
import { technologies } from '../data/technologies'
import { shifts } from '../data/leaders/shifts'
import { skillRecordById } from '../data/skillRecords'

const EASTERN = /[٠-٩۰-۹]/
const TOTAL_NODES = domains.length + domains.length * 5 + workFamilies.length + libraryRoles.length + technologies.length

const routers: ReturnType<typeof createMemoryRouter>[] = []
const originalMatchMedia = window.matchMedia

/** matchMedia stub: reduced motion on (camera moves are instant), plus an optional narrow screen. */
function stubMedia(narrow = false) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion: reduce') || (narrow && query.includes('max-width: 767px')),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  })) as unknown as typeof window.matchMedia
}

beforeEach(() => stubMedia())
afterEach(() => {
  routers.splice(0).forEach((r) => r.dispose())
  window.matchMedia = originalMatchMedia
})

/** The map page on its own route, with a router whose location the test can read. */
function renderMap(url: string) {
  const router = createMemoryRouter([{ path: '/:lang/map', element: createElement(AppProvider, null, createElement(SkillsMap)) }], { initialEntries: [url] })
  routers.push(router)
  render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
  return router
}

function renderView(view: ComponentType, url: string) {
  return render(createElement(MemoryRouter, { initialEntries: [url] }, createElement(AppProvider, null, createElement(view))))
}

const canvasButtons = (prefix: string) => [...document.querySelectorAll<HTMLButtonElement>(`[data-ring] button[data-node^="${prefix}"]`)]
const panel = () => document.querySelector('[data-map-panel]') as HTMLElement

describe('skills map page', () => {
  it('renders through the real route table in Arabic, with one h1, an SVG image and every domain', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/ar/map'] })
    routers.push(router)
    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
    expect(await screen.findByRole('heading', { level: 1, name: 'خريطة المهارات التفاعلية' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const img = screen.getByRole('img', { name: /خريطة دائرية/ })
    expect(img.tagName.toLowerCase()).toBe('svg')
    expect(canvasButtons('domain.')).toHaveLength(domains.length)
    expect(canvasButtons('skill.')).toHaveLength(40)
    expect(document.body.textContent).not.toMatch(EASTERN)
  })

  it('renders in English with a bilingual-ready accessible name and no Eastern digits', () => {
    renderMap('/en/map')
    expect(screen.getByRole('heading', { level: 1, name: 'Interactive skills map' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Circular map: the eight domains at the centre/ })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'How to read the map' })).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(EASTERN)
  })

  it('clicking a domain opens the panel with its five skills, and records it in the URL', async () => {
    const user = userEvent.setup()
    const router = renderMap('/en/map')
    await user.click(screen.getByRole('button', { name: /^Cybersecurity & Digital Trust — Domain/ }))
    const region = screen.getByRole('region', { name: 'Cybersecurity & Digital Trust' })
    for (const s of domains.find((d) => d.id === 'cyber')!.skills) expect(within(region).getByRole('button', { name: s.en })).toBeInTheDocument()
    expect(within(region).getByText(/5 skills/)).toBeInTheDocument()
    // the four-level ladder and the assessment link
    for (const lv of ['Awareness', 'Application', 'Proficiency', 'Leadership']) expect(within(region).getAllByText(lv).length).toBeGreaterThan(0)
    expect(within(region).getByRole('link', { name: 'Start the assessment from this domain' })).toHaveAttribute('href', '/en/assess?domain=cyber')
    expect(screen.getByRole('button', { name: /^Cybersecurity & Digital Trust — Domain/ })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(router.state.location.search).toBe('?node=domain.cyber'))
    // related nodes are lit, the rest dimmed
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-cyber-0"]')).toHaveAttribute('data-state', 'near')
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-ai-data-0"]')).toHaveAttribute('data-state', 'dim')
    // a skill chip in the panel moves the selection
    await user.click(within(region).getByRole('button', { name: 'Security awareness' }))
    expect(screen.getByRole('region', { name: 'Security awareness' })).toBeInTheDocument()
    expect(within(panel()).getByText(skillRecordById('sr-cyber-0')!.definition.en)).toBeInTheDocument()
  })

  it('search narrows the nodes and lists the matches', async () => {
    const user = userEvent.setup()
    renderMap('/en/map')
    expect(canvasButtons('skill.')).toHaveLength(40)
    await user.type(screen.getByRole('searchbox', { name: 'Search the map' }), 'security')
    const list = screen.getByRole('list', { name: 'Search results' })
    const items = within(list).getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThan(TOTAL_NODES)
    expect(within(list).getByRole('button', { name: /Security awareness/ })).toBeInTheDocument()
    const skills = canvasButtons('skill.')
    expect(skills.length).toBeLessThan(40)
    expect(skills.map((b) => b.dataset.node)).toContain('skill.sr-cyber-0')
    expect(screen.getByText(/\d+ results?/)).toBeInTheDocument()
    // Arabic search ignores hamza forms
    await user.clear(screen.getByRole('searchbox', { name: 'Search the map' }))
    expect(canvasButtons('skill.')).toHaveLength(40)
  })

  it('the ring filter hides the technologies (the text table keeps them)', async () => {
    const user = userEvent.setup()
    renderMap('/en/map')
    expect(canvasButtons('tech.')).toHaveLength(technologies.length)
    const filter = screen.getByRole('button', { name: /^Technologies/, pressed: true })
    await user.click(filter)
    expect(filter).toHaveAttribute('aria-pressed', 'false')
    expect(canvasButtons('tech.')).toHaveLength(0)
    expect(canvasButtons('skill.')).toHaveLength(40)
    expect(document.querySelectorAll('table[data-chart-table] tbody tr')).toHaveLength(TOTAL_NODES)
    await user.click(filter)
    expect(canvasButtons('tech.')).toHaveLength(technologies.length)
  })

  it('?node= preselects a node (with or without the kind prefix)', () => {
    renderMap('/en/map?node=role.data_scientist')
    const region = screen.getByRole('region', { name: 'Data Scientist' })
    expect(within(region).getByRole('link', { name: 'Open the role sheet' })).toHaveAttribute('href', '/en/roles/data_scientist')
    expect(document.querySelector('[data-ring] button[data-node="role.data_scientist"]')).toHaveAttribute('aria-pressed', 'true')
  })

  it('?node= accepts a bare id and links a technology to its page', () => {
    renderMap('/ar/map?node=C1-T01')
    const tech = technologies.find((x) => x.id === 'C1-T01')!
    const region = screen.getByRole('region', { name: tech.name.ar })
    expect(within(region).getByRole('link', { name: /افتح التقنية/ })).toHaveAttribute('href', '/ar/tech-radar/C1-T01')
  })

  it('arrow keys move focus within a ring, mirrored in Arabic', async () => {
    const user = userEvent.setup()
    renderMap('/ar/map')
    const ring = screen.getByRole('group', { name: 'المهارات' })
    const buttons = within(ring).getAllByRole('button')
    expect(buttons).toHaveLength(40)
    expect(buttons.filter((b) => b.tabIndex === 0)).toHaveLength(1)
    act(() => buttons[0].focus())
    await user.keyboard('{ArrowLeft}')
    expect(buttons[1]).toHaveFocus()
    expect(buttons[1].tabIndex).toBe(0)
    await user.keyboard('{End}')
    expect(buttons[39]).toHaveFocus()
    await user.keyboard('{Home}')
    expect(buttons[0]).toHaveFocus()
    // focus previews the connections like hover does
    expect(buttons[0]).toHaveAttribute('data-state', 'active')
    // Enter selects, Escape clears
    await user.keyboard('{Enter}')
    expect(screen.getByRole('region', { name: domains[0].skills[0].ar })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.getByRole('region', { name: 'كيف تقرأ الخريطة' })).toBeInTheDocument()
  })

  it('arrow keys move forward with ArrowRight in English; Tab reaches each ring once', async () => {
    const user = userEvent.setup()
    renderMap('/en/map')
    const domainsRing = screen.getByRole('group', { name: 'Domains' })
    const pills = within(domainsRing).getAllByRole('button')
    act(() => pills[0].focus())
    await user.keyboard('{ArrowRight}')
    expect(pills[1]).toHaveFocus()
    await user.tab()
    expect(within(screen.getByRole('group', { name: 'Skills' })).getAllByRole('button')[0]).toHaveFocus()
    await user.tab()
    expect(document.activeElement?.closest('[data-ring]')).toHaveAttribute('data-ring', '2')
  })

  it('«/» focuses the search box', async () => {
    const user = userEvent.setup()
    renderMap('/en/map')
    ;(document.activeElement as HTMLElement | null)?.blur()
    await user.keyboard('/')
    expect(screen.getByRole('searchbox', { name: 'Search the map' })).toHaveFocus()
  })

  it('the hidden table lists every node with its kind, domain and connections, and can be shown', async () => {
    const user = userEvent.setup()
    renderMap('/ar/map')
    const table = document.querySelector('table[data-chart-table]') as HTMLTableElement
    expect(table.className).toContain('sr-only')
    const rows = table.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(TOTAL_NODES)
    const names = [...rows].map((r) => r.querySelector('th')!.textContent)
    for (const d of domains) expect(names).toContain(d.name.ar)
    for (const r of libraryRoles) expect(names).toContain(r.name.ar)
    expect(table.textContent).not.toMatch(EASTERN)
    await user.click(screen.getByRole('button', { name: 'اعرض الجدول النصي' }))
    expect(table.className).not.toContain('sr-only')
  })

  it('?story=1 opens the guided story; Next walks the shifts and the end returns to the guide', async () => {
    const user = userEvent.setup()
    const router = renderMap('/en/map?story=1')
    expect(within(panel()).getByText(`Step 1 of ${shifts.length + 1}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: `Government work is changing in ${shifts.length} shifts` })).toBeInTheDocument()
    await user.click(within(panel()).getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('heading', { level: 2, name: shifts[0].title.en })).toBeInTheDocument()
    expect(within(panel()).getByText('Step 2 of 6')).toBeInTheDocument()
    // the story lights the shift's primary domain
    expect(document.querySelector(`[data-ring] button[data-node="domain.${shifts[0].domainId}"]`)).toHaveAttribute('data-state', 'near')
    for (let i = 1; i < shifts.length; i++) await user.click(within(panel()).getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('heading', { level: 2, name: shifts[shifts.length - 1].title.en })).toBeInTheDocument()
    await user.click(within(panel()).getByRole('button', { name: 'End the story' }))
    expect(screen.getByRole('heading', { level: 2, name: 'How to read the map' })).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).toBe(''))
  })

  it('hovering a node lights its connections and shows a readout', async () => {
    const user = userEvent.setup()
    renderMap('/en/map')
    await user.hover(document.querySelector('[data-ring] button[data-node="tech.C1-T01"]') as HTMLElement)
    expect(document.querySelector('[data-map-readout]')?.textContent).toMatch(/Generative AI for Government Services/)
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-ai-data-3"]')).toHaveAttribute('data-state', 'near')
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-cloud-0"]')).toHaveAttribute('data-state', 'dim')
    await user.unhover(document.querySelector('[data-ring] button[data-node="tech.C1-T01"]') as HTMLElement)
    expect(document.querySelector('[data-map-readout]')).toBeNull()
  })
})

describe('skills map on a narrow screen', () => {
  it('shows the mini-wheel and stacked rings with the same selection and panel', async () => {
    stubMedia(true)
    const user = userEvent.setup()
    renderMap('/ar/map')
    expect(document.querySelector('[data-ring]')).toBeNull()
    const wheel = screen.getByRole('group', { name: 'المجالات الثمانية' })
    await user.click(within(wheel).getByRole('button', { name: /الأمن السيبراني/ }))
    expect(screen.getByRole('region', { name: 'الأمن السيبراني والثقة الرقمية' })).toBeInTheDocument()
    const skills = screen.getByRole('group', { name: 'المهارات' })
    expect(within(skills).getAllByRole('button')).toHaveLength(5)
    // arrows inside a list
    const chips = within(skills).getAllByRole('button')
    act(() => chips[0].focus())
    await user.keyboard('{ArrowLeft}')
    expect(chips[1]).toHaveFocus()
    expect(document.body.textContent).not.toMatch(EASTERN)
  })
})

describe('entry points', () => {
  it('the home page carries the map section with a live preview that deep-links into the map', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/ar'] })
    routers.push(router)
    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
    const title = await screen.findByRole('heading', { level: 2, name: 'خريطة المهارات التفاعلية' })
    const section = title.closest('section') as HTMLElement
    expect(within(section).getByText('استكشف بدل أن تقرأ')).toBeInTheDocument()
    expect(within(section).getByRole('link', { name: 'افتح الخريطة' })).toHaveAttribute('href', '/ar/map')
    const preview = section.querySelector('[data-map-preview]') as HTMLElement
    const links = within(preview).getAllByRole('link')
    expect(links).toHaveLength(domains.length + 40)
    expect(links.every((a) => /^\/ar\/map\?node=(domain|skill)\./.test(a.getAttribute('href') ?? ''))).toBe(true)
    expect(within(preview).getByRole('link', { name: /^الوعي الأمني — مهارة/ })).toHaveAttribute('href', '/ar/map?node=skill.sr-cyber-0')
    // the section sits right after the hero
    const sections = [...document.querySelectorAll('main section')]
    expect(sections.indexOf(section)).toBe(1)
  })

  it('the roles & skills hub lands on the map preview with its sub-links', async () => {
    const user = userEvent.setup()
    renderView(RolesSkillsHub, '/en/capabilities')
    const title = screen.getByRole('heading', { level: 2, name: 'Interactive skills map' })
    const section = title.closest('section') as HTMLElement
    expect(within(section).getByRole('link', { name: 'Open the map' })).toHaveAttribute('href', '/en/map')
    expect(within(section).getByRole('link', { name: /Roles and their sheets/ })).toHaveAttribute('href', '/en/roles')
    expect(within(section).getByRole('link', { name: /Skills dictionary/ })).toHaveAttribute('href', '/en/skills')
    const preview = section.querySelector('[data-map-preview]') as HTMLElement
    expect(within(preview).getAllByRole('link')).toHaveLength(TOTAL_NODES)
    const role = within(preview).getByRole('link', { name: /^Data Scientist — Digital role/ })
    expect(role).toHaveAttribute('href', '/en/map?node=role.data_scientist')
    await act(async () => {
      role.focus()
    })
    expect(within(section).getAllByText('Data Scientist').length).toBeGreaterThan(0)
  })
})
