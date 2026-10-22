import { createElement } from 'react'
import type { ComponentType } from 'react'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
    for (const lv of ['Awareness', 'Application', 'Proficiency', 'Leading']) expect(within(region).getAllByText(lv).length).toBeGreaterThan(0)
    expect(within(region).getByRole('link', { name: 'Start the assessment from this domain' })).toHaveAttribute('href', '/en/assess?domain=cyber')
    expect(screen.getByRole('button', { name: /^Cybersecurity & Digital Trust — Domain/ })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(router.state.location.search).toBe('?node=domain.cyber'))
    // related nodes are lit, the rest dimmed
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-cyber-0"]')).toHaveAttribute('data-state', 'near')
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-ai-data-0"]')).toHaveAttribute('data-state', 'dim')
    // a skill chip in the panel moves the selection
    await user.click(within(region).getByRole('button', { name: 'Cybersecurity awareness' }))
    expect(screen.getByRole('region', { name: 'Cybersecurity awareness' })).toBeInTheDocument()
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
    expect(within(list).getByRole('button', { name: /Cybersecurity awareness/ })).toBeInTheDocument()
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
    // the wrapper is visually hidden too: a table ignores 1 px sizing, its wrapper does not (review P0-2)
    expect(table.parentElement!.className).toContain('sr-only')
    const rows = table.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(TOTAL_NODES)
    const names = [...rows].map((r) => r.querySelector('th')!.textContent)
    for (const d of domains) expect(names).toContain(d.name.ar)
    for (const r of libraryRoles) expect(names).toContain(r.name.ar)
    expect(table.textContent).not.toMatch(EASTERN)
    await user.click(screen.getByRole('button', { name: 'اعرض الجدول النصي' }))
    expect(table.className).not.toContain('sr-only')
    expect(table.parentElement!.className).not.toContain('sr-only')
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
    // in a browser the pointer is picked on the canvas (nearest node within reach); jsdom has no
    // layout, so the test enters the node's own button
    renderMap('/en/map')
    act(() => {
      fireEvent.mouseEnter(document.querySelector('[data-ring] button[data-node="tech.C1-T01"]') as HTMLElement)
    })
    expect(document.querySelector('[data-map-readout]')?.textContent).toMatch(/Generative AI for Government Services/)
    // the readout counts what the map lights, not only the direct links (review P2-5)
    const lit = document.querySelectorAll('[data-ring] button[data-state="near"]').length
    expect(document.querySelector('[data-map-readout]')?.textContent).toContain(`${lit} linked items`)
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-ai-data-3"]')).toHaveAttribute('data-state', 'near')
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-cloud-0"]')).toHaveAttribute('data-state', 'dim')
    act(() => {
      fireEvent.mouseLeave(document.querySelector('[data-ring] button[data-node="tech.C1-T01"]') as HTMLElement)
    })
    expect(document.querySelector('[data-map-readout]')).toBeNull()
  })
})

describe('skills map on a narrow screen', () => {
  it('shows the touch wheel, the stacked rings and the panel as a bottom sheet', async () => {
    stubMedia(true)
    const user = userEvent.setup()
    renderMap('/ar/map')
    // the wheel is drawn, but the lists are the keyboard path: no tab stop inside the canvas
    expect(document.querySelector('.map-canvas')).toBeTruthy()
    expect(document.querySelectorAll('[data-ring] button[tabindex="0"]')).toHaveLength(0)
    expect(document.querySelector('[data-map-sheet]')).toBeNull()
    const wheel = screen.getByRole('group', { name: 'المجالات الثمانية' })
    await user.click(within(wheel).getByRole('button', { name: /الأمن السيبراني/ }))
    expect(screen.getByRole('region', { name: 'الأمن السيبراني والثقة الرقمية' })).toBeInTheDocument()
    // the panel opens as a bottom sheet with a close button; «5 مرتبطة», not «5 المرتبطة»
    const sheet = document.querySelector('[data-map-sheet]') as HTMLElement
    expect(sheet).toBeTruthy()
    expect(within(sheet).getByRole('button', { name: 'أغلق' })).toBeInTheDocument()
    expect(document.body.textContent).toContain('5 مرتبطة')
    expect(document.body.textContent).not.toContain('المرتبطة')
    const skills = screen.getByRole('group', { name: 'المهارات' })
    expect(within(skills).getAllByRole('button')).toHaveLength(5)
    // arrows inside a list
    const chips = within(skills).getAllByRole('button')
    act(() => chips[0].focus())
    await user.keyboard('{ArrowLeft}')
    expect(chips[1]).toHaveFocus()
    expect(document.body.textContent).not.toMatch(EASTERN)
    // every list chip is a 44 px target (min-h-11)
    for (const c of chips) expect(c.className).toContain('min-h-11')
    // closing the sheet clears the selection
    await user.click(within(document.querySelector('[data-map-sheet]') as HTMLElement).getByRole('button', { name: 'أغلق' }))
    expect(document.querySelector('[data-map-sheet]')).toBeNull()
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
    expect(within(preview).getByRole('link', { name: /^الوعي بالأمن السيبراني — مهارة/ })).toHaveAttribute('href', '/ar/map?node=skill.sr-cyber-0')
    // the section sits right after the hero
    const sections = [...document.querySelectorAll('main section')]
    expect(sections.indexOf(section)).toBe(1)
  })

  it('the roles & skills hub lands on the full map explorer with its sub-links', () => {
    renderView(RolesSkillsHub, '/en/capabilities')
    const title = screen.getByRole('heading', { level: 2, name: 'Interactive skills map' })
    const section = title.closest('section') as HTMLElement
    // full width, first: the explorer is not squeezed into a side-by-side grid (review P0-3)
    expect(section.id).toBe('skills-map')
    expect(section.className).toContain('max-w-[88rem]')
    const explorerEl = section.querySelector('[data-map-explorer]') as HTMLElement
    expect(explorerEl.parentElement).toBe(section)
    // the sub-links come after the explorer
    const open = within(section).getByRole('link', { name: /Open the map/ })
    expect(explorerEl.compareDocumentPosition(open) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(section).getByRole('link', { name: /Open the map/ })).toHaveAttribute('href', '/en/map')
    expect(within(section).getAllByRole('link', { name: /Roles and their sheets/ })[0]).toHaveAttribute('href', '/en/roles')
    expect(within(section).getAllByRole('link', { name: /Skills dictionary/ })[0]).toHaveAttribute('href', '/en/skills')
    // the hub embeds the full explorer (owner directive 2026-10-22: explore instead of read)
    const explorer = section.querySelector('[data-map-explorer]') as HTMLElement
    expect(explorer).toBeTruthy()
    expect(within(explorer).getAllByRole('img').length).toBeGreaterThan(0)
  })
})

/* ------------------------------------------------------------------ P10b */

/** A saved v2 result: the self-rating per statement (0–4) drives «طريقي إلى هذا الدور». */
function seedHistory() {
  const prefixes: Record<string, string> = { 'ai-data': 'ai', cyber: 'cyb', cloud: 'cld', 'service-design': 'srv', policy: 'pol', agile: 'agl', emerging: 'emg', leadership: 'led' }
  const answers: Record<string, number> = {}
  const scores: Record<string, number> = {}
  for (const d of domains) {
    for (let k = 1; k <= 5; k++) answers[`${prefixes[d.id]}-${k}`] = d.id === 'ai-data' ? 1 : 3
    scores[d.id] = d.id === 'ai-data' ? 1 : 3
  }
  localStorage.setItem('dsr-history', JSON.stringify([{ v: 2, id: 'r1', date: '2026-10-20T09:00:00.000Z', roleId: 'cat:specialist', trackId: 'specialist', answers, scores, overall: 2.75 }]))
}

describe('P10b: map round two', () => {
  afterEach(() => localStorage.removeItem('dsr-history'))

  it('a selection rewrites the URL without resetting the scroll (review P0-1)', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter(routes, { initialEntries: ['/en/map'] })
    routers.push(router)
    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
    const pill = await screen.findByRole('button', { name: /^Cybersecurity & Digital Trust — Domain/ })
    await waitFor(() => expect(router.state.location.pathname).toBe('/en/map'))
    ;(window.scrollTo as unknown as ReturnType<typeof vi.fn>).mockClear()
    await user.click(pill)
    await waitFor(() => expect(router.state.location.search).toBe('?node=domain.cyber'))
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('names the forty skills in the first view, without any interaction (review P1-1)', () => {
    renderMap('/ar/map')
    const labels = [...document.querySelectorAll('text.map-radial')]
    expect(labels).toHaveLength(40)
    expect(labels.map((l) => l.getAttribute('data-label'))).toContain('skill.sr-cyber-0')
    // the outer rings stay unlabelled until something is lit or the map is zoomed in
    expect(document.querySelector('text.map-radial[data-label^="tech."]')).toBeNull()
  })

  it('a role lights its skills and technologies, and its panel lists the skills it needs (review P1-5)', () => {
    renderMap('/en/map?node=role.security_architect')
    for (const id of ['skill.sr-cyber-0', 'skill.sr-cloud-0', 'skill.sr-policy-0']) expect(document.querySelector(`[data-ring] button[data-node="${id}"]`)).toHaveAttribute('data-state', 'near')
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-agile-0"]')).toHaveAttribute('data-state', 'dim')
    const techsLit = [...document.querySelectorAll('[data-ring] button[data-node^="tech."][data-state="near"]')]
    expect(techsLit.length).toBeGreaterThan(0)
    const region = screen.getByRole('region', { name: 'Security Architect' })
    expect(within(region).getByText(/The skills it needs/)).toBeInTheDocument()
    expect(within(region.querySelector('[data-role-skills]') as HTMLElement).getByRole('button', { name: 'Security awareness' })).toBeInTheDocument()
  })

  it('Arabic search matches stems and still answers a two-word query (review P1-3)', async () => {
    const user = userEvent.setup()
    renderMap('/ar/map')
    const box = screen.getByRole('searchbox', { name: 'ابحث في الخريطة' })
    await user.type(box, 'سحابة')
    const list = screen.getByRole('list', { name: 'نتائج البحث' })
    const names = within(list).getAllByRole('button').map((b) => b.textContent ?? '')
    expect(names.some((n) => n.includes('نماذج الخدمات السحابية'))).toBe(true)
    expect(names.some((n) => n.includes('مهندس البنية السحابية'))).toBe(true)
    // matches are emphasised and the rest dimmed, links too
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-cloud-0"]')).toHaveAttribute('data-state', 'match')
    expect(document.querySelector('.map-edges-base')).toHaveAttribute('data-dim', 'true')
    await user.clear(box)
    await user.type(box, 'الحوسبة السحابية')
    expect(within(screen.getByRole('list', { name: 'نتائج البحث' })).getAllByRole('button').length).toBeGreaterThan(0)
    // Enter opens the first result in the panel and moves focus there (review P2-13)
    await user.keyboard('{Enter}')
    const heading = document.querySelector('[data-panel-heading]') as HTMLElement
    await waitFor(() => expect(heading).toHaveFocus())
  })

  it('the story builds up domains → skills → roles, narrates, and says why from the shift’s claim (review P1-6)', async () => {
    const user = userEvent.setup()
    renderMap('/en/map?story=1')
    // the opening step lists the shifts as buttons
    await user.click(within(panel()).getByRole('button', { name: shifts[3].title.en }))
    expect(screen.getByRole('heading', { level: 2, name: shifts[3].title.en })).toBeInTheDocument()
    expect(within(panel()).getByText(`Step 5 of ${shifts.length + 1}`)).toBeInTheDocument()
    const narration = panel().querySelector('[data-story-narration]') as HTMLElement
    expect(narration.textContent).toMatch(/^It draws on .+ asks for .+ carried by roles such as/)
    expect(panel().querySelector('[data-story-why]')?.textContent).toMatch(/^Why\?/)
    // the skills the shift asks for are lit (reduced motion: every phase at once)
    expect(document.querySelector('[data-ring] button[data-node="skill.sr-cyber-1"]')).toHaveAttribute('data-state', 'near')
  })

  it('«إضاءة المجال»: ?spot= opens the spotlight with its timeline; the horizon hides later technologies; Esc restores', async () => {
    const user = userEvent.setup()
    const router = renderMap('/ar/map?spot=cyber')
    const strip = document.querySelector('[data-map-spot]') as HTMLElement
    expect(strip).toBeTruthy()
    expect(screen.getByRole('region', { name: 'الأمن السيبراني والثقة الرقمية' })).toBeInTheDocument()
    // every member carries a label
    const labelled = document.querySelectorAll('text.map-radial').length
    expect(labelled).toBeGreaterThan(20)
    const techsAll = document.querySelectorAll('[data-ring] button[data-node^="tech."]').length
    await user.click(within(strip).getByRole('radio', { name: /الآن/ }))
    const techsNow = document.querySelectorAll('[data-ring] button[data-node^="tech."]').length
    expect(techsNow).toBeLessThan(techsAll)
    act(() => (document.querySelector('[data-ring] button[data-node^="skill."]') as HTMLElement).focus())
    await user.keyboard('{Escape}')
    expect(document.querySelector('[data-map-spot]')).toBeNull()
    await waitFor(() => expect(router.state.location.search).not.toContain('spot='))
  })

  it('a long Enter on a domain opens the spotlight; the domain panel offers it as a button too', async () => {
    const user = userEvent.setup()
    renderMap('/en/map?node=domain.agile')
    await user.click(within(panel()).getByRole('button', { name: 'Spotlight this domain' }))
    expect(document.querySelector('[data-map-spot]')?.textContent).toMatch(/Domain spotlight: /)
  })

  it('«قارن دورين»: the rose fills each wedge by both targets and the panel lists what the move needs', async () => {
    const user = userEvent.setup()
    renderMap('/en/map?node=role.business_analyst')
    const picker = within(panel()).getByRole('combobox', { name: 'Compare with another role' })
    await user.selectOptions(picker, 'role.product_manager')
    const compare = panel().querySelector('[data-map-compare-panel]') as HTMLElement
    expect(compare).toBeTruthy()
    expect(compare.textContent).toContain('To move from “Business Analyst” to “Product Manager” you need:')
    expect(document.querySelectorAll('[data-rose="a"]').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('[data-rose="b"]').length).toBeGreaterThan(0)
    // the comparison table is the text equivalent: one row per domain
    expect(within(compare).getAllByRole('row')).toHaveLength(domains.length + 1)
    await user.click(within(compare).getByRole('button', { name: 'End the comparison' }))
    expect(panel().querySelector('[data-map-compare-panel]')).toBeNull()
  })

  it('Shift + Enter on a role node compares it with the selected role', async () => {
    const user = userEvent.setup()
    renderMap('/en/map?node=role.business_analyst')
    const other = document.querySelector('[data-ring] button[data-node="role.product_manager"]') as HTMLElement
    act(() => other.focus())
    await user.keyboard('{Shift>}{Enter}{/Shift}')
    expect(panel().querySelector('[data-map-compare-panel]')).toBeTruthy()
  })

  it('«طريقي إلى هذا الدور»: with a saved result, a role shows the gaps on the map and up to 3 priorities with a plan link', () => {
    seedHistory()
    renderMap('/ar/map?node=role.data_scientist')
    const path = panel().querySelector('[data-map-path]') as HTMLElement
    expect(path).toBeTruthy()
    expect(path.getAttribute('data-map-path')).toBe('')
    expect(within(path).getByRole('link', { name: 'طوّرها في خطتي' })).toHaveAttribute('href', '/ar/assess/plan')
    expect(path.querySelectorAll('ol li').length).toBeGreaterThan(0)
    expect(path.querySelectorAll('ol li').length).toBeLessThanOrEqual(3)
    // amber halos on the skills below the role's target (ai-data rated 1, the role leads it)
    expect(document.querySelector('[data-gap="skill.sr-ai-data-0"]')).toBeTruthy()
    expect(document.querySelector('[data-gap="skill.sr-cyber-0"]')).toBeNull()
  })

  it('without a saved result, the role panel invites the assessment instead', () => {
    renderMap('/ar/map?node=role.data_scientist')
    const path = panel().querySelector('[data-map-path]') as HTMLElement
    expect(path.getAttribute('data-map-path')).toBe('none')
    expect(document.querySelector('[data-gap]')).toBeNull()
  })

  it('the domain panel puts the leading roles first and replaces the generic level list with its own spread (review P2-3, P2-4)', () => {
    renderMap('/en/map?node=domain.cyber')
    const region = screen.getByRole('region', { name: 'Cybersecurity & Digital Trust' })
    const roleChips = within(region).getAllByRole('button').filter((b) => /Leadership|Proficiency/.test(b.textContent ?? ''))
    expect(roleChips[0].textContent).toMatch(/Leadership$/)
    expect(within(region).getByText('Roles by their target level in it')).toBeInTheDocument()
    expect(within(region).getByRole('link', { name: /The domain’s skills in the skills dictionary/ })).toHaveAttribute('href', '/en/skills#domain-cyber')
  })

  it('all rings off: no wedges, and a message says how to bring them back (review P2-6)', async () => {
    const user = userEvent.setup()
    renderMap('/en/map')
    for (const name of [/^Skills/, /^Job families/, /^Roles/, /^Technologies/]) await user.click(screen.getByRole('button', { name, pressed: true }))
    expect(document.querySelector('[data-map-empty]')?.textContent).toMatch(/Every ring is off/)
    expect(document.querySelectorAll('.map-wedge')).toHaveLength(0)
  })

  it('the home preview names the domains on their wedges and has a pause control for its tour (review P2-14)', async () => {
    // motion allowed: the tour may run, so its pause control is there
    window.matchMedia = vi.fn((query: string) => ({ matches: false, media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(() => true) })) as unknown as typeof window.matchMedia
    const router = createMemoryRouter(routes, { initialEntries: ['/ar'] })
    routers.push(router)
    render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
    const title = await screen.findByRole('heading', { level: 2, name: 'خريطة المهارات التفاعلية' })
    const section = title.closest('section') as HTMLElement
    expect(section.querySelectorAll('[data-preview-name]')).toHaveLength(domains.length)
    expect(within(section).getByRole('button', { name: /العرض المتحرك/ })).toBeInTheDocument()
  })
})
