import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const stripLang = (p: string) => p.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'

/**
 * After a route change, move keyboard focus to the new page's `h1` (or to the `#hash` target), so screen-reader
 * and keyboard users start at the top of the new content. Skipped on first load and on a language switch
 * (same page, other language). Views are lazy, so it waits — up to 3 s — for the new heading to mount.
 */
export default function RouteFocus() {
  const location = useLocation()
  const navigated = useRef(false)
  const prevBare = useRef(stripLang(location.pathname))

  useEffect(() => {
    const bare = stripLang(location.pathname)
    // First load ('default' key, also under StrictMode's double effects): never steal focus, but still bring a
    // #hash target into view once it mounts.
    if (location.key !== 'default') navigated.current = true
    const hashOnly = !navigated.current
    if (hashOnly) {
      prevBare.current = bare
      if (!location.hash) return
    } else {
      if (bare === prevBare.current && !location.hash) return
      prevBare.current = bare
    }

    const staleH1 = document.querySelector<HTMLElement>('#main h1')
    const started = Date.now()
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const tick = () => {
      if (cancelled) return
      const loading = document.querySelector('#main [data-route-loading]')
      const hashTarget = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
      const h1 = document.querySelector<HTMLElement>('#main h1')
      const fresh = h1 && (h1 !== staleH1 || !staleH1?.isConnected || Date.now() - started > 400)
      const target = hashTarget ?? (fresh && !loading && !hashOnly ? h1 : null)
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        if (!hashOnly) target.focus({ preventScroll: !hashTarget })
        if (hashTarget) hashTarget.scrollIntoView?.({ block: 'start' })
        return
      }
      if (Date.now() - started < 3000) timer = setTimeout(tick, 50)
    }
    timer = setTimeout(tick, 0)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [location.pathname, location.hash, location.key])

  return null
}
