/**
 * Fetch-based loaders for the generated JSON under `public/data/`, with an in-memory cache.
 *
 *   loadEntitiesIndex()           → EntityIndexRow[]           (both modes)
 *   loadSectors()                 → SectorsFile                (both modes)
 *   loadSectorEntities(sectorId)  → EntityDetailRow[] | null   (full mode only; null in aggregate mode)
 *
 * The cache holds promises, so concurrent callers share one request and a failed request is
 * retried on the next call. `configureGovData()` lets tests inject a fetcher or a base URL.
 *
 * P11: a promise the loaders hand out remembers its value once it has settled, and
 * `peekGovData(promise)` reads that value synchronously; `seedGovData(files)` fills the cache with
 * already-settled files (the prerender reads them from disk), so `useGovData` renders the data on
 * its first render instead of the loading state. In the browser nothing is seeded: the first visit
 * fetches as before, and a later visit to a page whose files are cached renders without a flash.
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
/** Values of loader promises that have settled successfully (read with `peekGovData`). */
const settled = new WeakMap<Promise<unknown>, { value: unknown }>()

/** A promise that is settled already, and known to be. */
function settledPromise<T>(value: T): Promise<T> {
  const p = Promise.resolve(value)
  settled.set(p, { value })
  return p
}

/** Tag the promise with its value once it resolves, so later synchronous reads find it. */
function remember<T>(p: Promise<T>): Promise<T> {
  p.then(
    (value) => {
      settled.set(p, { value })
    },
    () => {}
  )
  return p
}

/**
 * The value of a promise returned by these loaders, when it has already resolved; undefined while it
 * is pending, after it failed, and for promises that did not come from the loaders.
 */
export function peekGovData<T>(p: Promise<T>): { value: T } | undefined {
  return settled.get(p) as { value: T } | undefined
}

/** Chain on a loader promise, synchronously when its value is known already. */
function thenSync<A, B>(p: Promise<A>, fn: (value: A) => B | Promise<B>): Promise<B> {
  const hit = peekGovData(p)
  if (!hit) return remember(p.then(fn))
  try {
    const out = fn(hit.value)
    return out instanceof Promise ? out : settledPromise(out)
  } catch (err) {
    return Promise.reject(err)
  }
}

/** Cache key of a data file: `sectors.json`, `/data/sectors.json` or a full URL ending in `/data/<file>`. */
function cacheKeyForFile(file: string): string | null {
  const rel = file.replace(/^.*\/data\//, '').replace(/^\/+/, '')
  if (rel === 'entities-index.json') return 'entities-index'
  if (rel === 'sectors.json') return 'sectors'
  const m = /^entities\/([a-z0-9-]+)\.json$/.exec(rel)
  return m ? `entities:${m[1]}` : null
}

/**
 * Fill the cache with files that are already loaded, keyed by URL (`/data/sectors.json`) or by the
 * path under `data/` (`entities/health.json`). The loaders then resolve them without fetching, and
 * synchronously for `peekGovData`/`useGovData`. Used by the prerender (scripts/prerender.mjs); unknown
 * files are ignored. Returns how many files were seeded.
 */
export function seedGovData(files: Record<string, unknown>): number {
  let seeded = 0
  for (const [file, json] of Object.entries(files)) {
    const key = cacheKeyForFile(file)
    if (!key || json === undefined) continue
    cache.set(key, settledPromise(json))
    seeded++
  }
  return seeded
}

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
  const p = remember(
    make().catch((err: unknown) => {
      cache.delete(key)
      throw err
    })
  )
  cache.set(key, p)
  return p
}

/**
 * The entity index when it is already in the cache and settled (seeded by the prerender, or fetched
 * earlier in the session); undefined otherwise. Never starts a request: the page head uses it to put
 * the entity's name in the title without owning a fetch.
 */
export function peekEntitiesIndex(): EntityIndexRow[] | undefined {
  const p = cache.get('entities-index')
  return p ? (settled.get(p)?.value as EntityIndexRow[] | undefined) : undefined
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
  if (!isFullMode()) return settledPromise(null)
  if (!/^[a-z0-9-]+$/.test(sectorId)) return settledPromise(null)
  return cached(`entities:${sectorId}`, async () => {
    try {
      return await fetchJson<EntityDetailRow[]>(`entities/${sectorId}.json`)
    } catch {
      return null
    }
  })
}

/** One entity from the index, or null (synchronously known once the index is). */
export function findEntity(id: string): Promise<EntityIndexRow | null> {
  return thenSync(loadEntitiesIndex(), (index) => index.find((e) => e.id === id) ?? null)
}

/** One entity's detail row (full mode only), located through the index's sector. */
export function findEntityDetail(id: string): Promise<EntityDetailRow | null> {
  if (!isFullMode()) return settledPromise(null)
  return thenSync(findEntity(id), (row) =>
    row ? thenSync(loadSectorEntities(row.sectorId), (rows) => rows?.find((e) => e.id === id) ?? null) : settledPromise(null)
  )
}
