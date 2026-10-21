/**
 * Server entry for static prerendering (packet P7).
 *
 * Built with `vite build --ssr src/entry-server.tsx --outDir dist-ssr` and consumed by
 * scripts/prerender.mjs. It renders the REAL route table from src/routes.tsx (nothing is
 * duplicated here) at a given URL with react-dom/server renderToString and returns the HTML
 * string for <div id="root">.
 *
 * Lazy views: src/routes.tsx declares its views with React.lazy(). In the SSR build only, the
 * `eagerViewsForSsr` plugin in vite.config.ts rewrites those declarations into static imports, so
 * the server route table carries the view modules eagerly and renderToString emits the full page
 * instead of the Suspense fallback ("جارٍ التحميل…"). lazyRouteElements() lets the prerender
 * script verify that the bundle it loaded really is eager before it renders anything.
 *
 * The client (src/main.tsx) uses createRoot, not hydrateRoot, so the prerendered markup is
 * replaced at runtime; it exists for crawlers, link previews and first paint only.
 */
import { isValidElement } from 'react'
import { renderToString } from 'react-dom/server'
import { matchRoutes } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { libraryRoles } from './data/roleLibrary'
import type { Lang } from './data/types'
import { headFor, pageTitles, PERSONAL_VIEWS, renderHeadTags, SITE_URL } from './lib/head'
import type { HeadData } from './lib/head'
import { pathFor, routeFromPath } from './lib/routes'
import { routes } from './routes'
import type { View } from './store'

export { renderHeadTags, SITE_URL }
export type { HeadData }

export interface PrerenderEntry {
  view: View
  lang: Lang
  /** Path without trailing slash, e.g. '/ar', '/en/methodology', '/ar/roles/data_scientist'. */
  path: string
  params: Record<string, string>
}

/** A view plus the params that identify one concrete page of it. */
export interface PrerenderSeed {
  view: View
  params?: Record<string, string>
}

export const LANGS: readonly Lang[] = ['ar', 'en']

/**
 * Views that only exist with a parameter and have no per-id expansion wired yet.
 * 'role' is parameterized too but is expanded below from the role library.
 * To prerender sectors later: remove 'sector' here and add an expansion next to the roles one
 * in parameterizedSeeds(), or pass seeds through the `extra` argument of prerenderManifest().
 */
const PARAMETER_ONLY_VIEWS: readonly View[] = ['entity', 'sector']

/** Every View (the key set of pageTitles is Record<View, L>, so it is complete by type). */
export const ALL_VIEWS: readonly View[] = Object.keys(pageTitles) as View[]

/** Public by type: not personal, not the 404 view, not parameter-only. Says nothing about routing. */
export function isPublicView(view: View): boolean {
  return !PERSONAL_VIEWS.includes(view) && view !== 'not-found' && !PARAMETER_ONLY_VIEWS.includes(view)
}

function isStaticPublicView(view: View): boolean {
  return isPublicView(view) && view !== 'role'
}

/**
 * Public views that map to exactly one page per language AND have a real route in src/routes.tsx.
 * The manifest is derived from the route table, so it never lists a page that would render the
 * 404 view; a view joins automatically once the owner of src/routes.tsx wires it.
 */
export function publicStaticViews(): View[] {
  return ALL_VIEWS.filter((view) => isStaticPublicView(view) && isRouted(pathWithoutSlash(view, 'ar', {})))
}

/**
 * Public views that have a slug and head data but NO route in src/routes.tsx yet
 * (today: about, services, leaders, adoption, work). Deliberately absent from the manifest and
 * the sitemap; scripts/prerender.mjs prints them so the gap stays visible in every build log.
 */
export function pendingPublicViews(): View[] {
  return ALL_VIEWS.filter((view) => isStaticPublicView(view) && !isRouted(pathWithoutSlash(view, 'ar', {})))
}

/** Seeds for parameterized public pages: today one per library role. Extend here for sectors etc. */
export function parameterizedSeeds(): PrerenderSeed[] {
  return libraryRoles.map((role) => ({ view: 'role' as View, params: { roleId: role.id } }))
}

function pathWithoutSlash(view: View, lang: Lang, params: Record<string, string>): string {
  const path = pathFor(view, lang, params).split('?')[0].split('#')[0]
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/**
 * The list of pages to prerender, in both languages. Every default entry has a route; the
 * prerender script treats an unrouted entry (only possible through `extra`) as a hard error.
 * `extra` lets the caller add seeds (e.g. { view: 'sector', params: { sectorId } }) without
 * editing this file. Entries are de-duplicated by path.
 */
export function prerenderManifest(extra: PrerenderSeed[] = []): PrerenderEntry[] {
  const seeds: PrerenderSeed[] = [
    ...publicStaticViews().map((view) => ({ view })),
    ...parameterizedSeeds(),
    ...extra,
  ]
  const seen = new Set<string>()
  const entries: PrerenderEntry[] = []
  for (const seed of seeds) {
    const params = seed.params ?? {}
    for (const lang of LANGS) {
      const path = pathWithoutSlash(seed.view, lang, params)
      if (seen.has(path)) continue
      seen.add(path)
      entries.push({ view: seed.view, lang, path, params })
    }
  }
  return entries
}

/**
 * True when the route table has a real route for this path, i.e. the deepest match is not the
 * '*' catch-all. Views with a slug but no route yet (about, services, leaders, …) return false.
 */
export function isRouted(path: string): boolean {
  const matches = matchRoutes(routes, path)
  if (!matches || matches.length === 0) return false
  const deepest = matches[matches.length - 1]
  if (deepest.route.path === '*') return false
  // The bare '/' index route only redirects on the client; it is not a prerenderable page.
  if (deepest.route.index && deepest.route.element === null) return false
  return true
}

const REACT_LAZY_TYPE = Symbol.for('react.lazy')

/**
 * Route paths whose element is still a React.lazy component. Empty in the SSR bundle (the
 * eagerViewsForSsr transform ran); non-empty under the plain client/test build of src/routes.tsx.
 * scripts/prerender.mjs refuses to render when this is non-empty, because renderToString would
 * only emit the Suspense fallback for those routes.
 */
export function lazyRouteElements(list: RouteObject[] = routes, prefix = ''): string[] {
  const found: string[] = []
  for (const route of list) {
    const base = prefix === '/' ? '' : prefix
    const label = (route.index ? `${base}/(index)` : `${base}/${route.path ?? ''}`).replace(/\/+$/, '') || '/'
    const element = route.element
    if (isValidElement(element)) {
      const type = element.type as unknown as { $$typeof?: symbol } | string
      if (typeof type === 'object' && type !== null && type.$$typeof === REACT_LAZY_TYPE) found.push(label)
    }
    if (route.children) found.push(...lazyRouteElements(route.children, label))
  }
  return found
}

/** Head data for a path, resolved through the same routeFromPath the client uses. */
export function headForPath(path: string): HeadData {
  const route = routeFromPath(path)
  const params: Record<string, string> = {}
  if (route.roleId) params.roleId = route.roleId
  if (route.entityId) params.entityId = route.entityId
  if (route.sectorId) params.sectorId = route.sectorId
  return headFor(route.view, route.lang ?? 'ar', params)
}

const handler = createStaticHandler(routes)

/**
 * Render the real route table at `path` to an HTML string (the inner HTML of #root) with
 * renderToString. Rejects when the router answers with a redirect or a component throws outside
 * a boundary; a throw inside App's Suspense boundary or the router's error boundary leaves the
 * fallback / error markup in the output instead. The caller (scripts/prerender.mjs) detects both
 * cases and falls back to the SPA shell for that route.
 */
export async function render(path: string): Promise<string> {
  const url = new URL(path, SITE_URL)
  const context = await handler.query(new Request(url.toString()))
  if (context instanceof Response) {
    throw new Error(`router returned a ${context.status} response for ${path}`)
  }
  const router = createStaticRouter(handler.dataRoutes, context)
  return renderToString(<StaticRouterProvider router={router} context={context} />)
}
