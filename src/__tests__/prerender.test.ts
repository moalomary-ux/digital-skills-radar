import { describe, expect, it } from 'vitest'
import { libraryRoles } from '../data/roleLibrary'
import type { Lang } from '../data/types'
import { headForPath, isRouted, prerenderManifest } from '../entry-server'
import {
  alternateLinks,
  applyHead,
  canonicalPath,
  headFor,
  isPersonalView,
  pageDescriptions,
  pageTitles,
  PERSONAL_VIEWS,
  renderHeadTags,
} from '../lib/head'
import type { HeadData } from '../lib/head'
import { pathFor } from '../lib/routes'
import type { View } from '../store'

const LANGS: Lang[] = ['ar', 'en']

/**
 * Written by hand from the View union in src/store.tsx, on purpose not derived from the
 * implementation: every View except the personal ones (wizard, results, pathways, report,
 * leader-check, leader-team), 'not-found', the parameter-only 'entity' and 'sector', and 'role'
 * (which is expanded per library role and checked separately).
 */
const PUBLIC_STATIC_VIEWS: View[] = [
  'home', 'careers', 'decide', 'lists', 'future-skills', 'explore', 'entities', 'tech-radar',
  'roles', 'standards', 'methodology', 'skills', 'impact', 'sectors', 'directory', 'evidence',
  'about', 'services', 'leaders', 'leader-brief', 'adoption', 'work', 'work-shifts',
]

const ALL_VIEWS: View[] = [
  ...PUBLIC_STATIC_VIEWS, 'role',
  'wizard', 'results', 'pathways', 'report', 'leader-check', 'leader-team',
  'entity', 'sector', 'not-found',
]

const PERSONAL_PATHS = ['/ar/assess', '/en/assess', '/ar/assess/results', '/en/assess/results',
  '/ar/assess/plan', '/en/assess/plan', '/ar/assess/report', '/en/assess/report',
  '/ar/leaders/check', '/en/leaders/check', '/ar/leaders/team', '/en/leaders/team']

describe('prerender manifest', () => {
  const manifest = prerenderManifest()
  const paths = manifest.map((entry) => entry.path)

  it('lists every public static view exactly once per language, at its pathFor() path', () => {
    for (const view of PUBLIC_STATIC_VIEWS) {
      for (const lang of LANGS) {
        const matches = manifest.filter((entry) => entry.view === view && entry.lang === lang)
        expect(matches, `${view}/${lang}`).toHaveLength(1)
        expect(matches[0].path).toBe(pathFor(view, lang))
      }
    }
    const views = new Set(manifest.map((entry) => entry.view))
    expect([...views].sort()).toEqual([...PUBLIC_STATIC_VIEWS, 'role'].sort())
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('expands /roles/:roleId for every library role in both languages', () => {
    const roleEntries = manifest.filter((entry) => entry.view === 'role')
    expect(roleEntries).toHaveLength(2 * libraryRoles.length)
    for (const role of libraryRoles) {
      expect(paths).toContain(`/ar/roles/${role.id}`)
      expect(paths).toContain(`/en/roles/${role.id}`)
      const entry = manifest.find((item) => item.path === `/en/roles/${role.id}`)
      expect(entry?.params).toEqual({ roleId: role.id })
    }
  })

  it('excludes personal routes and never leaves a parameter placeholder', () => {
    for (const path of paths) {
      expect(path.startsWith('/ar/assess'), path).toBe(false)
      expect(path.startsWith('/en/assess'), path).toBe(false)
      expect(path).not.toContain(':')
      expect(path).not.toMatch(/\/$/)
      expect(path).toMatch(/^\/(ar|en)(\/|$)/)
    }
    for (const personal of PERSONAL_PATHS) expect(paths).not.toContain(personal)
    for (const view of PERSONAL_VIEWS) expect(manifest.some((entry) => entry.view === view)).toBe(false)
    expect(manifest.some((entry) => entry.view === 'not-found')).toBe(false)
    expect(manifest.some((entry) => entry.view === 'entity')).toBe(false)
    expect(manifest.some((entry) => entry.view === 'sector')).toBe(false)
  })

  it('accepts extra seeds without duplicating existing paths', () => {
    const extended = prerenderManifest([
      { view: 'sector', params: { sectorId: 'health' } },
      { view: 'methodology' },
    ])
    const extendedPaths = extended.map((entry) => entry.path)
    expect(extendedPaths).toContain('/ar/sectors/health')
    expect(extendedPaths).toContain('/en/sectors/health')
    expect(extended).toHaveLength(manifest.length + 2)
    expect(new Set(extendedPaths).size).toBe(extendedPaths.length)
  })

  it('isRouted follows the real route table', () => {
    expect(isRouted('/ar/methodology')).toBe(true)
    expect(isRouted('/en/methodology')).toBe(true)
    expect(isRouted('/ar/assess')).toBe(true)
    expect(isRouted(`/ar/roles/${libraryRoles[0].id}`)).toBe(true)
    expect(isRouted('/ar/nope')).toBe(false)
    expect(isRouted('/fr/methodology')).toBe(false)
    expect(isRouted('/')).toBe(false)
  })

  it('headForPath resolves the view, language and role id from the path', () => {
    const role = libraryRoles[0]
    const head = headForPath(`/en/roles/${role.id}`)
    expect(head.lang).toBe('en')
    expect(head.title).toContain(role.name.en)
    expect(head.canonical).toBe(`https://omary.me/en/roles/${role.id}/`)
    expect(headForPath('/ar/methodology').title).toBe(headFor('methodology', 'ar').title)
    expect(headForPath('/ar/assess').robots).toContain('noindex')
  })
})

describe('head helpers', () => {
  it('has a non-empty bilingual description for every view that differs from the title', () => {
    for (const view of ALL_VIEWS) {
      for (const lang of LANGS) {
        const description = pageDescriptions[view][lang]
        expect(description.trim().length, `${view}/${lang}`).toBeGreaterThan(0)
        expect(description, `${view}/${lang}`).not.toBe(pageTitles[view][lang])
        expect(description.length, `${view}/${lang}`).toBeGreaterThan(pageTitles[view][lang].length)
      }
    }
  })

  it('marks exactly the personal views as personal', () => {
    const personal = ALL_VIEWS.filter((view) => isPersonalView(view)).sort()
    expect(personal).toEqual(['leader-check', 'leader-team', 'pathways', 'report', 'results', 'wizard'])
    expect([...PERSONAL_VIEWS].sort()).toEqual(personal)
  })

  it('builds canonical URLs with the language prefix and a trailing slash, without query strings', () => {
    expect(headFor('methodology', 'en').canonical).toBe('https://omary.me/en/methodology/')
    expect(headFor('home', 'ar').canonical).toBe('https://omary.me/ar/')
    expect(canonicalPath('home', 'en')).toBe('/en/')
    expect(canonicalPath('explore', 'ar', { domain: 'data' })).toBe('/ar/map/')
    expect(canonicalPath('role', 'en', { roleId: 'data_scientist' })).toBe('/en/roles/data_scientist/')
  })

  it('lists ar, en and x-default alternates, with x-default pointing at the Arabic page', () => {
    const alternates = alternateLinks('methodology')
    expect(alternates.map((alt) => alt.hrefLang)).toEqual(['ar', 'en', 'x-default'])
    const byLang = Object.fromEntries(alternates.map((alt) => [alt.hrefLang, alt.href]))
    expect(byLang.ar).toBe('https://omary.me/ar/methodology/')
    expect(byLang.en).toBe('https://omary.me/en/methodology/')
    expect(byLang['x-default']).toBe(byLang.ar)
    expect(headFor('methodology', 'en').alternates).toEqual(alternates)
    const roleAlternates = alternateLinks('role', { roleId: 'data_scientist' })
    expect(roleAlternates[1].href).toBe('https://omary.me/en/roles/data_scientist/')
  })

  it('sets robots noindex only for personal views and not-found', () => {
    expect(headFor('wizard', 'ar').robots).toContain('noindex')
    expect(headFor('leader-team', 'en').robots).toContain('noindex')
    expect(headFor('not-found', 'en').robots).toContain('noindex')
    expect(headFor('methodology', 'ar').robots).toBeNull()
    expect(headFor('home', 'en').robots).toBeNull()
  })

  it('gives each role page a title with the role name', () => {
    const [first, second] = libraryRoles
    const firstHead = headFor('role', 'en', { roleId: first.id })
    const secondHead = headFor('role', 'en', { roleId: second.id })
    expect(firstHead.title).toContain(first.name.en)
    expect(firstHead.title).not.toBe(secondHead.title)
    expect(firstHead.description).toContain(first.name.en)
    expect(firstHead.description).not.toBe(secondHead.description)
    expect(headFor('role', 'ar', { roleId: first.id }).title).toContain(first.name.ar)
    expect(headFor('role', 'ar', { roleId: first.id }).dir).toBe('rtl')
    expect(firstHead.dir).toBe('ltr')
  })

  it('fills the Open Graph block from the same data', () => {
    const head = headFor('methodology', 'en')
    expect(head.og.image).toBe('https://omary.me/og/default.png')
    expect(head.og.url).toBe(head.canonical)
    expect(head.og.title).toBe(head.title)
    expect(head.og.description).toBe(head.description)
    expect(head.og.locale).toBe('en_US')
    expect(headFor('methodology', 'ar').og.locale).toBe('ar_SA')
    expect(head.twitterCard).toBe('summary_large_image')
  })
})

function sampleHead(overrides: Partial<HeadData> = {}): HeadData {
  const canonical = 'https://omary.me/en/sample/'
  return {
    lang: 'en',
    dir: 'ltr',
    title: 'Sample <Title> & Co',
    description: 'Tom & Jerry <script>alert(1)</script> "quoted"',
    canonical,
    alternates: [
      { hrefLang: 'ar', href: 'https://omary.me/ar/sample/' },
      { hrefLang: 'en', href: canonical },
      { hrefLang: 'x-default', href: 'https://omary.me/ar/sample/' },
    ],
    robots: null,
    og: {
      title: 'Sample <Title> & Co',
      description: 'Tom & Jerry <script>alert(1)</script> "quoted"',
      url: canonical,
      image: 'https://omary.me/og/default.png',
      type: 'website',
      locale: 'en_US',
      siteName: 'Digital Skills Radar',
    },
    twitterCard: 'summary_large_image',
    ...overrides,
  }
}

describe('renderHeadTags', () => {
  it('emits title, canonical, alternates and Open Graph tags', () => {
    const html = renderHeadTags(headFor('methodology', 'en'))
    expect(html).toContain('<title')
    expect(html).toContain('</title>')
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('href="https://omary.me/en/methodology/"')
    expect(html).toContain('property="og:image" content="https://omary.me/og/default.png"')
    expect(html).toContain('hreflang="x-default"')
    expect(html).toContain('hreflang="ar"')
    expect(html).toContain('hreflang="en"')
    expect(html).toContain('name="description"')
    expect(html).not.toContain('name="robots"')
    expect(renderHeadTags(headFor('wizard', 'ar'))).toContain('name="robots" content="noindex, nofollow"')
  })

  it('escapes HTML in the title and description', () => {
    const html = renderHeadTags(sampleHead())
    expect(html).toContain('<title data-head>Sample &lt;Title&gt; &amp; Co</title>')
    expect(html).toContain('Tom &amp; Jerry &lt;script&gt;alert(1)&lt;/script&gt; &quot;quoted&quot;')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('Tom & Jerry')
  })
})

describe('applyHead in the browser', () => {
  function count(selector: string): number {
    return document.head.querySelectorAll(selector).length
  }

  it('is idempotent and keeps a single tag per key', () => {
    const head = headFor('methodology', 'en')
    applyHead(head)
    applyHead(head)
    expect(document.title).toBe(head.title)
    expect(count('meta[name="description"]')).toBe(1)
    expect(count('link[rel="canonical"]')).toBe(1)
    expect(count('link[rel="alternate"]')).toBe(3)
    expect(count('meta[property="og:image"]')).toBe(1)
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(head.description)
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://omary.me/en/methodology/')
    expect(document.head.querySelector('link[rel="alternate"][hreflang="x-default"]')?.getAttribute('href'))
      .toBe('https://omary.me/ar/methodology/')
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toBe('https://omary.me/og/default.png')
  })

  it('updates existing tags when another head is applied', () => {
    applyHead(headFor('methodology', 'en'))
    const next = headFor('about', 'ar')
    applyHead(next)
    expect(document.title).toBe(next.title)
    expect(count('meta[name="description"]')).toBe(1)
    expect(count('link[rel="canonical"]')).toBe(1)
    expect(count('link[rel="alternate"]')).toBe(3)
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(next.description)
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://omary.me/ar/about/')
    expect(document.head.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('ar_SA')
  })

  it('adds robots noindex for a personal head and removes it for a public one', () => {
    applyHead(headFor('wizard', 'ar'))
    expect(count('meta[name="robots"]')).toBe(1)
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow')
    applyHead(headFor('wizard', 'ar'))
    expect(count('meta[name="robots"]')).toBe(1)
    applyHead(headFor('methodology', 'ar'))
    expect(count('meta[name="robots"]')).toBe(0)
    expect(count('meta[name="description"]')).toBe(1)
    expect(count('link[rel="canonical"]')).toBe(1)
    expect(count('link[rel="alternate"]')).toBe(3)
  })
})
