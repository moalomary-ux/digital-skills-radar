import { useCallback, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { rovingIndex } from '../charts/keyboard'

/**
 * Roving tabindex over several rings (or lists): one tab stop per ring, the arrow keys move within
 * the ring in reading order (mirrored in RTL like the radar charts), Home/End jump to the ends.
 */
export function useRovingRings(rings: string[][], rtl: boolean, preferred: string | null) {
  const refs = useRef(new Map<string, HTMLElement>())
  const [stops, setStops] = useState<Record<number, string>>({})

  const stopOf = (ring: number): string | undefined => {
    const ids = rings[ring] ?? []
    const stop = stops[ring]
    if (stop && ids.includes(stop)) return stop
    if (preferred && ids.includes(preferred)) return preferred
    return ids[0]
  }

  const tabIndexOf = (ring: number, id: string) => (stopOf(ring) === id ? 0 : -1)

  const onKeyDown = (e: KeyboardEvent<HTMLElement>, ring: number, id: string) => {
    const ids = rings[ring] ?? []
    const next = rovingIndex(e.key, ids.indexOf(id), ids.length, rtl)
    if (next === null) return
    e.preventDefault()
    const target = ids[next]
    setStops((s) => ({ ...s, [ring]: target }))
    refs.current.get(target)?.focus()
  }

  const onFocus = (ring: number, id: string) => setStops((s) => (s[ring] === id ? s : { ...s, [ring]: id }))

  const register = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) refs.current.set(id, el)
      else refs.current.delete(id)
    },
    [],
  )

  const focusNode = (id: string) => refs.current.get(id)?.focus()

  return { tabIndexOf, onKeyDown, onFocus, register, focusNode }
}
