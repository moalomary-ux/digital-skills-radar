import { useEffect } from 'react'
import type { Lang } from '../data/types'
import { applyHead, headFor } from '../lib/head'
import type { View } from '../store'

interface HeadProps {
  view: View
  lang: Lang
  params?: Record<string, string>
}

/**
 * Thin convenience wrapper: keeps document.title and the SEO meta tags in sync
 * for the given view and renders nothing. Not wired into routes; usePageTitle in
 * the store already covers the app. Use it where a view needs to override the head.
 */
export function Head({ view, lang, params }: HeadProps) {
  const roleId = params?.roleId ?? ''
  const sectorId = params?.sectorId ?? ''
  const entityId = params?.entityId ?? ''
  useEffect(() => {
    const p: Record<string, string> = {}
    if (roleId) p.roleId = roleId
    if (sectorId) p.sectorId = sectorId
    if (entityId) p.entityId = entityId
    applyHead(headFor(view, lang, p))
  }, [view, lang, roleId, sectorId, entityId])
  return null
}

export default Head
