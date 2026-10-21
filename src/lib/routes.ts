import type { Lang } from '../data/types'
import type { View } from '../store'

const slugs: Record<View, string> = {
  home: '', wizard: 'assess', results: 'assess/results', pathways: 'assess/plan',
  roles: 'roles', skills: 'skills', 'future-skills': 'future-skills',
  'tech-radar': 'tech-radar', explore: 'map', careers: 'careers',
  lists: 'careers/trends', decide: 'guidance', entities: 'entities', impact: 'impact',
  sectors: 'sectors', directory: 'directory', entity: 'directory/:entityId',
  standards: 'standards', methodology: 'methodology',
  'not-found': '404',
}

/** Entity links without an entityId fall back to the directory. */
export function pathFor(view: View, lang: Lang, params: Record<string, string> = {}): string {
  let slug = slugs[view]
  if (view === 'entity') slug = params.entityId ? `directory/${encodeURIComponent(params.entityId)}` : 'directory'
  if (view === 'tech-radar' && params.techId) slug += `/${encodeURIComponent(params.techId)}`
  if (view === 'careers' && params.careerId) slug += `/${encodeURIComponent(params.careerId)}`
  const query = new URLSearchParams()
  if (view === 'explore' && params.domain) query.set('domain', params.domain)
  if (view === 'sectors' && params.category) query.set('category', params.category)
  const qs = query.toString()
  return `/${lang}${slug ? `/${slug}` : ''}${qs ? `?${qs}` : ''}`
}

export interface RouteState {
  view: View
  lang: Lang | null
  techId: string | null
  careerId: string | null
  entityId: string | null
}

/** Unknown paths use not-found, so no navigation item incorrectly appears active. */
export function routeFromPath(pathname: string): RouteState {
  const segments = pathname.replace(/\/+$/, '').split('/')
  const lang = segments[1] === 'ar' || segments[1] === 'en' ? segments[1] : null
  const result: RouteState = { view: 'not-found', lang, techId: null, careerId: null, entityId: null }
  if (!lang || segments[0] !== '') return result
  const slug = segments.slice(2).join('/')
  // Static routes take precedence: careers/trends is never a career ID.
  for (const [view, candidate] of Object.entries(slugs)) {
    if (view !== 'entity' && candidate === slug) return { ...result, view: view as View }
  }
  if (segments.length !== 4 || !segments[3]) return result
  let id: string
  try { id = decodeURIComponent(segments[3]) } catch { return result }
  switch (segments[2]) {
    case 'tech-radar': return { ...result, view: 'tech-radar', techId: id }
    case 'careers': return { ...result, view: 'careers', careerId: id }
    case 'directory': return { ...result, view: 'entity', entityId: id }
    default: return result
  }
}

export function viewFromPath(pathname: string): View {
  return routeFromPath(pathname).view
}
