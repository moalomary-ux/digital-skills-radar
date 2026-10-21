/**
 * Fetch-based loaders for the generated JSON under `public/data/`, with an in-memory cache.
 *
 *   loadEntitiesIndex()           → EntityIndexRow[]           (both modes)
 *   loadSectors()                 → SectorsFile                (both modes)
 *   loadSectorEntities(sectorId)  → EntityDetailRow[] | null   (full mode only; null in aggregate mode)
 *
 * The cache holds promises, so concurrent callers share one request and a failed request is
 * retried on the next call. `configureGovData()` lets tests inject a fetcher or a base URL.
 */
import { isFullMode } from '../../lib/flags.ts'
import type { EntityDetailRow, EntityIndexRow, SectorsFile } from './types.ts'

type Fetcher = (url: string) => Promise<Response>

interface Config {
  fetcher: Fetcher | null
  base: string | null
}

const config: Config = { fetcher: null, base: null }
const cache = new Map<string, Promise<unknown>>()

/** Override the fetcher or base URL (tests, prerender). Clears the cache. */
export function configureGovData(options: Partial<Config>): void {
  if (options.fetcher !== undefined) config.fetcher = options.fetcher
  if (options.base !== undefined) config.base = options.base
  cache.clear()
}

/** Drop every cached file (tests). */
export function clearGovDataCache(): void {
  cache.clear()
}

function baseUrl(): string {
  const base = config.base ?? (import.meta.env?.BASE_URL as string | undefined) ?? '/'
  return base.replace(/\/$/, '')
}

/** Public URL of a data file, e.g. `dataUrl('sectors.json')` → `/data/sectors.json`. */
export function dataUrl(file: string): string {
  return `${baseUrl()}/data/${file}`
}

async function fetchJson<T>(file: string): Promise<T> {
  const url = dataUrl(file)
  const doFetch = config.fetcher ?? (typeof fetch === 'function' ? fetch.bind(globalThis) : null)
  if (!doFetch) throw new Error(`[gov-data] no fetch available for ${url}`)
  const res = await doFetch(url)
  if (!res.ok) throw new Error(`[gov-data] ${url} → HTTP ${res.status}`)
  return (await res.json()) as T
}

function cached<T>(key: string, make: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as Promise<T> | undefined
  if (hit) return hit
  const p = make().catch((err: unknown) => {
    cache.delete(key)
    throw err
  })
  cache.set(key, p)
  return p
}

export function loadEntitiesIndex(): Promise<EntityIndexRow[]> {
  return cached('entities-index', () => fetchJson<EntityIndexRow[]>('entities-index.json'))
}

export function loadSectors(): Promise<SectorsFile> {
  return cached('sectors', () => fetchJson<SectorsFile>('sectors.json'))
}

/**
 * Per-entity details of one sector. Returns null in the aggregate build (the files do not exist there)
 * and when the file is missing in a full build that was not prepared with `build-gov-data.mjs --full`.
 */
export function loadSectorEntities(sectorId: string): Promise<EntityDetailRow[] | null> {
  if (!isFullMode()) return Promise.resolve(null)
  if (!/^[a-z0-9-]+$/.test(sectorId)) return Promise.resolve(null)
  return cached(`entities:${sectorId}`, async () => {
    try {
      return await fetchJson<EntityDetailRow[]>(`entities/${sectorId}.json`)
    } catch {
      return null
    }
  })
}

/** One entity from the index, or null. */
export async function findEntity(id: string): Promise<EntityIndexRow | null> {
  const index = await loadEntitiesIndex()
  return index.find((e) => e.id === id) ?? null
}

/** One entity's detail row (full mode only), located through the index's sector. */
export async function findEntityDetail(id: string): Promise<EntityDetailRow | null> {
  if (!isFullMode()) return null
  const row = await findEntity(id)
  if (!row) return null
  const rows = await loadSectorEntities(row.sectorId)
  return rows?.find((e) => e.id === id) ?? null
}
