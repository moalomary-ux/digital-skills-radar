/**
 * Build-time data mode (DECISION-20261021 §2 row 5, §3).
 *
 *   VITE_DATA_MODE=aggregate  (default) public build: national figures and sector aggregates only.
 *                             No per-entity service records, no rankings, no «لم تستفد» labels,
 *                             no inferred entity needs, no logos.
 *   VITE_DATA_MODE=full       private demos: the detailed layer is restored.
 *
 * Anything other than the exact string 'full' is the aggregate mode.
 */
export type DataMode = 'aggregate' | 'full'

export function dataMode(): DataMode {
  const raw = (import.meta.env?.VITE_DATA_MODE as string | undefined) ?? ''
  return raw.trim() === 'full' ? 'full' : 'aggregate'
}

export function isFullMode(): boolean {
  return dataMode() === 'full'
}

export function isAggregateMode(): boolean {
  return !isFullMode()
}

/** Resolved once per bundle; prefer the functions above in components so tests can stub `import.meta.env`. */
export const DATA_MODE: DataMode = dataMode()
