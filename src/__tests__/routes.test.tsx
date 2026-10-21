import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { govEntities } from '../data/govEntities'
import { technologies } from '../data/technologies'
import { pathFor, routeFromPath, viewFromPath } from '../lib/routes'
import { routes } from '../routes'
import type { View } from '../store'

const entity = govEntities.find((item) => item.nameEn)!
const technology = technologies[1]
const routers: ReturnType<typeof createMemoryRouter>[] = []

function renderRoute(url: string) {
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  routers.push(router)
  render(<RouterProvider router={router} future={{ v7_startTransition: true }} />)
  return router
}

afterEach(() => {
  routers.splice(0).forEach((router) => router.dispose())
})

describe('real application routes', () => {
  it.each([
    [null, 'ar'], ['"ar"', 'ar'], ['"en"', 'en'],
    ['"fr"', 'ar'], ['invalid json', 'ar'], ['null', 'ar'],
  ])('redirects / with stored language %s to /%s', async (stored, lang) => {
    if (stored !== null) localStorage.setItem('dsr-lang', stored)
    const router = renderRoute('/')
    await waitFor(() => expect(router.state.location.pathname).toBe(`/${lang}`))
    expect(router.state.historyAction).toBe('REPLACE')
    await screen.findByRole('heading', { level: 1 })
    expect(localStorage.getItem('dsr-lang')).toBe(JSON.stringify(lang))
  })

  it('renders the first wizard heading on direct load', async () => {
    renderRoute('/ar/assess')
    expect(await screen.findByRole('heading', { level: 1, name: 'ما هو دورك؟' })).toBeInTheDocument()
  })

  it('loads a real entity directly in English', async () => {
    renderRoute(`/en/directory/${entity.id}`)
    expect(await screen.findByRole('heading', { level: 1, name: entity.nameAr })).toBeInTheDocument()
    expect(screen.getByText(entity.nameEn!)).toBeInTheDocument()
  })

  it('selects the technology identified in a direct URL', async () => {
    renderRoute(`/ar/tech-radar/${technology.id}`)
    expect(await screen.findByRole('heading', { level: 2, name: technology.name.ar })).toBeInTheDocument()
  })

  it.each(['/ar/nope', '/en/nope', '/fr/assess', '/assess'])('renders a bilingual 404 for %s', async (url) => {
    renderRoute(url)
    expect(await screen.findByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(screen.getByText('الصفحة غير موجودة')).toBeInTheDocument()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back home/ })).toHaveAttribute('href', url.startsWith('/en/') ? '/en' : '/ar')
  })

  it.each([
    ['ar', 'en', 'rtl', 'ما هو دورك؟', 'رادار المهارات الرقمية — تقييم المهارات'],
    ['en', 'ar', 'ltr', 'What is your role?', 'Digital Skills Radar — Skills Assessment'],
  ])('uses URL language %s over stored language %s', async (lang, stored, dir, heading, title) => {
    localStorage.setItem('dsr-lang', JSON.stringify(stored))
    renderRoute(`/${lang}/assess`)
    await screen.findByRole('heading', { level: 1, name: heading })
    expect(document.documentElement).toHaveAttribute('lang', lang)
    expect(document.documentElement).toHaveAttribute('dir', dir)
    expect(localStorage.getItem('dsr-lang')).toBe(JSON.stringify(lang))
    expect(document.title).toBe(title)
  })

  it('toggles language while preserving the entity, exact search, and hash, including back/forward', async () => {
    const user = userEvent.setup()
    const suffix = `/directory/${entity.id}?source=directory&label=a%20b#services`
    const router = renderRoute(`/ar${suffix}`)
    await screen.findByRole('heading', { level: 1, name: entity.nameAr })
    await user.click(screen.getByRole('button', { name: 'toggle language' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/en/directory/${entity.id}`))
    expect(router.state.location.search).toBe('?source=directory&label=a%20b')
    expect(router.state.location.hash).toBe('#services')
    await screen.findByRole('button', { name: /Back to the directory/ })
    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(localStorage.getItem('dsr-lang')).toBe('"en"')
    expect(document.title).toBe('Digital Skills Radar — Entity Details')
    await act(async () => { await router.navigate(-1) })
    expect(router.state.location.pathname).toBe(`/ar/directory/${entity.id}`)
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    await act(async () => { await router.navigate(1) })
    expect(router.state.location.pathname).toBe(`/en/directory/${entity.id}`)
    await user.click(screen.getByRole('button', { name: 'toggle language' }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/ar/directory/${entity.id}`))
    expect(router.state.location.search + router.state.location.hash).toBe('?source=directory&label=a%20b#services')
    expect(document.title).toBe('رادار المهارات الرقمية — تفاصيل الجهة')
    expect(await screen.findByRole('heading', { level: 1, name: entity.nameAr })).toBeInTheDocument()
  })
})

// Independent expected slugs prevent two helpers with the same mistake from passing.
const expectedRoutes: Record<Exclude<View, 'not-found'>, string> = {
  home: '', wizard: '/assess', results: '/assess/results', pathways: '/assess/plan',
  roles: '/roles', skills: '/skills', 'future-skills': '/future-skills',
  'tech-radar': '/tech-radar', explore: '/map', careers: '/careers',
  lists: '/careers/trends', decide: '/guidance', entities: '/entities', impact: '/impact',
  sectors: '/sectors', directory: '/directory', entity: `/directory/${entity.id}`,
  standards: '/standards', methodology: '/methodology',
  evidence: '/evidence', about: '/about', report: '/assess/report', services: '/services',
  sector: '/sectors/health', leaders: '/leaders', 'leader-brief': '/leaders/brief', 'leader-check': '/leaders/check',
  'leader-team': '/leaders/team', adoption: '/leaders/adoption', work: '/work', 'work-shifts': '/work/shifts', role: '/roles/cdo',
}

describe.each(['ar', 'en'] as const)('route helpers in %s', (lang) => {
  it.each(Object.entries(expectedRoutes))('round-trips %s with its specified URL', (view, suffix) => {
    const path = pathFor(view as View, lang, { entityId: entity.id, roleId: 'cdo', sectorId: 'health' })
    expect(path).toBe(`/${lang}${suffix}`)
    expect(viewFromPath(path)).toBe(view)
  })

  it('supports technology/career details and prioritizes career trends', () => {
    const techPath = pathFor('tech-radar', lang, { techId: technology.id })
    expect(techPath).toBe(`/${lang}/tech-radar/${technology.id}`)
    expect(routeFromPath(techPath)).toMatchObject({ view: 'tech-radar', techId: technology.id, lang })
    const careerId = 'a career/with unicode العربية'
    const careerPath = pathFor('careers', lang, { careerId })
    expect(careerPath).toBe(`/${lang}/careers/${encodeURIComponent(careerId)}`)
    expect(routeFromPath(careerPath)).toMatchObject({ view: 'careers', careerId })
    expect(routeFromPath(`/${lang}/careers/trends`)).toMatchObject({ view: 'lists', careerId: null })
  })

  it.each([
    ['explore', 'domain', 'data & AI', '/map'],
    ['sectors', 'category', 'استشارات رقمية', '/sectors'],
  ] as const)('encodes the %s query', (view, key, value, slug) => {
    const url = new URL(pathFor(view, lang, { [key]: value }), 'https://example.test')
    expect(url.pathname).toBe(`/${lang}${slug}`)
    expect(url.searchParams.get(key)).toBe(value)
    expect(viewFromPath(url.pathname)).toBe(view)
  })
})

it.each(['/ar/nope', '/fr/assess', '/AR/assess', '/ar/directory/a/extra', '/en/tech-radar/%ZZ'])('rejects unknown or malformed path %s', (path) => {
  expect(viewFromPath(path)).toBe('not-found')
})
