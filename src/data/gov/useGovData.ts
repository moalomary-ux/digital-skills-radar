/**
 * React hook over the fetch-based loaders: `const { data, error, loading } = useGovData(loadSectors)`.
 *
 * The loader is identified by `key` (defaults to the function name) so a new inline closure does not
 * refetch; pass an explicit key when the loader closes over a parameter, e.g.
 * `useGovData(() => loadSectorEntities(id), 'entities:' + id)`.
 */
import { useEffect, useState } from 'react'

export interface GovDataState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

export function useGovData<T>(loader: () => Promise<T>, key?: string): GovDataState<T> {
  const k = key ?? loader.name ?? 'anonymous'
  const [state, setState] = useState<GovDataState<T>>({ data: null, error: null, loading: true })

  useEffect(() => {
    let alive = true
    setState((s) => (s.loading ? s : { ...s, loading: true }))
    loader().then(
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
