import { useCallback, useSyncExternalStore } from 'react'

/** Live `matchMedia` result; false where `matchMedia` is unavailable (SSR, old engines). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}
      const mql = window.matchMedia(query)
      if (!mql) return () => {}
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onChange)
        return () => mql.removeEventListener('change', onChange)
      }
      mql.addListener?.(onChange)
      return () => mql.removeListener?.(onChange)
    },
    [query],
  )
  const get = () => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? !!window.matchMedia(query)?.matches : false)
  return useSyncExternalStore(subscribe, get, () => false)
}

/** `prefers-reduced-motion: reduce` — charts drop their transitions when true. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
