/**
 * React hook over the fetch-based loaders: `const { data, error, loading } = useGovData(loadSectors)`.
 *
 * The loader is identified by `key` (defaults to the function name) so a new inline closure does not
 * refetch; pass an explicit key when the loader closes over a parameter, e.g.
 * `useGovData(() => loadSectorEntities(id), 'entities:' + id)`.
 *
 * P11: the first render already shows the data when the loader's files are cached (seeded by the
 * prerender, or fetched earlier in the session): the state starts from `peekGovData`. Otherwise it
 * starts in the loading state and the effect resolves it, exactly as before; the loader still runs
 * once per mount and key.
 *
 * Prerender only: between `startGovDataCollection()` and `stopGovDataCollection()`, a hook whose
 * loader is still pending registers it; `settleGovData()` waits for those loaders and keeps their
 * results by key, and the next render pass starts from them. This covers composed loaders (a view's
 * own `async` function) that can never be read synchronously. The browser never enables it.
 */
import { useEffect, useRef, useState } from 'react'
import { peekGovData } from './loaders.ts'

export interface GovDataState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

/** Prerender collection: pending loaders of the current pass, and settled results by hook key. */
let pending: Promise<void>[] | null = null
const snapshots = new Map<string, unknown>()

/** Prerender: start collecting the loaders that a render leaves pending. */
export function startGovDataCollection(): void {
  pending = []
  snapshots.clear()
}

/**
 * Prerender: wait for the loaders the last render left pending and keep their results for the next
 * render pass. Returns how many were pending (0 means the last render needed nothing more).
 */
export async function settleGovData(): Promise<number> {
  if (!pending) return 0
  const batch = pending
  pending = []
  await Promise.all(batch)
  return batch.length
}

/** Prerender: stop collecting and forget the results. */
export function stopGovDataCollection(): void {
  pending = null
  snapshots.clear()
}

export function useGovData<T>(loader: () => Promise<T>, key?: string): GovDataState<T> {
  const k = key ?? loader.name ?? 'anonymous'
  // the promise started for the first render, reused by the first effect so the loader runs once
  const started = useRef<{ key: string; promise: Promise<T> } | null>(null)
  const [state, setState] = useState<GovDataState<T>>(() => {
    if (pending && snapshots.has(k)) return { data: snapshots.get(k) as T, error: null, loading: false }
    const promise = loader()
    started.current = { key: k, promise }
    const hit = peekGovData(promise)
    if (hit) return { data: hit.value, error: null, loading: false }
    if (pending) {
      pending.push(
        promise.then(
          (value) => {
            snapshots.set(k, value)
          },
          () => {}
        )
      )
    }
    return { data: null, error: null, loading: true }
  })

  useEffect(() => {
    let alive = true
    const first = started.current
    started.current = null
    const promise = first && first.key === k ? first.promise : loader()
    const hit = peekGovData(promise)
    if (hit) {
      setState((s) => (s.data === hit.value && !s.loading && !s.error ? s : { data: hit.value, error: null, loading: false }))
      return
    }
    setState((s) => (s.loading ? s : { ...s, loading: true }))
    promise.then(
      (data) => {
        if (alive) setState({ data, error: null, loading: false })
      },
      (err: unknown) => {
        if (alive) setState({ data: null, error: err instanceof Error ? err : new Error(String(err)), loading: false })
      }
    )
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])

  return state
}
