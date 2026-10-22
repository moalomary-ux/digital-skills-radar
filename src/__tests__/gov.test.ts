// @vitest-environment jsdom
/**
 * Government data layer (packet P4): the generated JSON under public/data/, the fetch-based loaders,
 * the cleaned directory, the claims and the five views (Services, GovSectors, SectorBrief, Directory,
 * EntityDetail) in the public (aggregate) build, plus the full-mode switch of EntityLogo.
 *
 * Groups: 1 totals · 2 the n ≥ 10 rule · 3 public index · 4 no logos · 5 banned content · 6 English pages ·
 * 6b English taxonomy on every directory page, year labels, the hub promises · 7 Arabic plural · 8 loader cache ·
 * 9 claims · 10 build-script idempotency.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import type { ReactElement } from 'react'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
// @ts-ignore: the app has no @types/node; these imports are test-side only
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
// @ts-ignore: see above
import { execFileSync } from 'node:child_process'
// @ts-ignore: see above
import process from 'node:process'
import { AppProvider } from '../store'
import Services from '../views/Services'
import GovSectors from '../views/GovSectors'
import SectorBrief from '../views/SectorBrief'
import Directory from '../views/Directory'
import EntityDetail from '../views/EntityDetail'
import EntityLogo from '../components/EntityLogo'
import EntitiesSectorsHub from '../views/hubs/EntitiesSectors'
import { claimById } from '../data/claims'
import type { Claim } from '../data/claims'
import { govClaims } from '../data/claims/gov'
import { PARTIAL_YEAR, govServiceKpis, yearlyTraining } from '../data/govServices'
import { govEntities } from '../data/govEntities'
import { govSectors } from '../data/govSectors'
import { entityYearlyTraining } from '../data/govEntityDetails'
import {
  DEFAULT_DIRECTORY_TYPES,
  PUBLIC_ENTITY_TYPES,
  SECTOR_MIN_ENTITIES,
  clearGovDataCache,
  configureGovData,
  englishNameFallback,
  entityTypeById,
  fixTopConsulting,
  label,
  loadSectorEntities,
  NON_GOVERNMENT_SECTOR_IDS,
  loadSectors,
  otherServicesAr,
  periods,
  regionById,
  sectorById,
  sectorIdFromAr,
} from '../data/gov'
import type { EntityIndexRow, SectorsFile } from '../data/gov'
import { dataMode, isFullMode } from '../lib/flags'

/* ------------------------------------------------------------------ fixtures */

/** Project root: vitest runs with the project as its working directory (import.meta.url is a vite path here, not a file URL). */
const ROOT: string = `${process.cwd()}/`
const readText = (rel: string): string => readFileSync(`${ROOT}${rel}`, 'utf8')

const indexText = readText('public/data/entities-index.json')
const sectorsText = readText('public/data/sectors.json')
const index = JSON.parse(indexText) as EntityIndexRow[]
const sectorsFile = JSON.parse(sectorsText) as SectorsFile
const sectorRows = sectorsFile.sectors
// The sectors page lists government sectors only (the same rule as src/views/GovSectors.tsx); the
// state-owned-companies sector keeps its brief but is not a card on the page.
const govCountOf = (sectorId: string) => index.filter((r) => r.sectorId === sectorId && (DEFAULT_DIRECTORY_TYPES as readonly string[]).includes(r.type)).length
const listedSectors = sectorRows.filter((s) => !s.pooled && !NON_GOVERNMENT_SECTOR_IDS.includes(s.id) && sectorById(s.id) && govCountOf(s.id) > 0)
const pooledRow = sectorRows.find((s) => s.pooled)!
const shownSector = listedSectors.find((s) => s.showAggregates)!
const hiddenSector = listedSectors.find((s) => !s.showAggregates)!
const govRow = index.find((r) => r.type === 'government')!

/** Hidden entries documented in src/data/gov/README.md (6 historical + 2 merged Riyadh Season editions). */
const README_HIDDEN_IDS = ['ent-0236', 'ent-0237', 'ent-0421', 'ent-0468', 'ent-0062', 'ent-0063', 'ent-0427', 'ent-0428']
/** English brand names that legitimately start lowercase (README «إصلاح الأسماء»). */
const BRAND_EXCEPTIONS = new Set(['stc Group', 'noon'])

const VIEW_FILES = ['Services.tsx', 'GovSectors.tsx', 'SectorBrief.tsx', 'Directory.tsx', 'EntityDetail.tsx']

// Character classes and banned terms are assembled at runtime so this file itself passes content-lint.
const cp = (n: number) => String.fromCharCode(n)
const ARABIC = new RegExp(`[${cp(0x0600)}-${cp(0x06ff)}]`)
const EASTERN = new RegExp(`[${cp(0x0660)}-${cp(0x0669)}${cp(0x06f0)}-${cp(0x06f9)}]`)
const BANNED_AR = ['أعلى 10', 'لم تستفد', ['إجمالي', 'الاستفادة'].join(' '), 'ما الذي تحتاجه', ['أثر', 'تمكين'].join(' '), '%']
const fmt = (n: number) => n.toLocaleString('en-US')

/** Leading integer of a claim value such as "7,915", "n ≥ 10" or "8 categories". */
const leadInt = (c: Claim | undefined) => {
  const m = c ? /\d[\d,]*/.exec(c.value.en) : null
  return m ? Number(m[0].replace(/,/g, '')) : Number.NaN
}

/** Fetcher that serves public/data/* from disk (the loaders accept it through configureGovData). */
async function fsFetch(url: string): Promise<Response> {
  const m = /\/data\/([a-z0-9/._-]+)$/i.exec(url)
  const file = m ? `${ROOT}public/data/${m[1]}` : null
  if (!file || !existsSync(file)) return { ok: false, status: 404, json: async () => null } as unknown as Response
  const text = readFileSync(file, 'utf8')
  return { ok: true, status: 200, json: async () => JSON.parse(text) } as unknown as Response
}
const fetchSpy = vi.fn(fsFetch)

beforeAll(() => {
  // the suite describes the public build; pin the mode so a VITE_DATA_MODE=full shell does not change it
  vi.stubEnv('VITE_DATA_MODE', 'aggregate')
  configureGovData({ fetcher: fetchSpy, base: '/' })
})
beforeEach(() => {
  fetchSpy.mockImplementation(fsFetch)
})
afterEach(() => {
  cleanup()
  localStorage.clear()
})

/* ---------------------------------------------------------------- rendering */

type Lang = 'ar' | 'en'

function renderAt(element: ReactElement, lang: Lang, path: string, pattern?: string) {
  localStorage.setItem('dsr-lang', JSON.stringify(lang))
  const page = pattern ? createElement(Routes, null, createElement(Route, { path: pattern, element })) : element
  return render(createElement(MemoryRouter, { initialEntries: [path] }, createElement(AppProvider, null, page)))
}

/** Wait until no loading notice is on screen (the loaders resolve asynchronously). */
async function settled(container: HTMLElement) {
  await waitFor(() => expect(container.textContent ?? '').not.toMatch(/جارٍ تحميل|Loading/), { timeout: 5000 })
}

const PAGES = {
  services: (lang: Lang) => renderAt(createElement(Services), lang, `/${lang}/services`),
  sectors: (lang: Lang) => renderAt(createElement(GovSectors), lang, `/${lang}/sectors`),
  directory: (lang: Lang) => renderAt(createElement(Directory), lang, `/${lang}/directory`),
  entity: (lang: Lang, id = govRow.id) => renderAt(createElement(EntityDetail), lang, `/${lang}/directory/${id}`),
  brief: (lang: Lang, id = shownSector.id) => renderAt(createElement(SectorBrief), lang, `/${lang}/sectors/${id}`, '/:lang/sectors/:sectorId'),
} as const
type PageKey = keyof typeof PAGES

/** Visible text of everything that is not inside an element marked lang="ar". */
function textOutsideArabic(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement
  clone.querySelectorAll('[lang="ar"]').forEach((el) => el.remove())
  return clone.textContent ?? ''
}

/** First differing line between two texts, or null when identical. */
function firstDiff(a: string, b: string): string | null {
  if (a === b) return null
  const la = a.split('\n')
  const lb = b.split('\n')
  for (let i = 0; i < Math.max(la.length, lb.length); i++) {
    if (la[i] !== lb[i]) return `line ${i + 1}: «${la[i] ?? '<none>'}» vs «${lb[i] ?? '<none>'}»`
  }
  return 'line count differs'
}

/* ===================================================== 1. totals (JSON + source arrays + claims) */

describe('1. sector totals equal national totals', () => {
  it('Σ sectors.training / consulting = national = govServiceKpis = method-gov-* claims (7,915 / 2,873)', () => {
    const sumTraining = sectorRows.reduce((n, s) => n + (s.training ?? 0), 0)
    const sumConsulting = sectorRows.reduce((n, s) => n + (s.consulting ?? 0), 0)
    expect(sumTraining).toBe(7915)
    expect(sectorsFile.national.training).toBe(7915)
    expect(govServiceKpis.trainingRecords).toBe(7915)
    expect(leadInt(claimById('method-gov-training-sheet'))).toBe(7915)
    expect(sumConsulting).toBe(2873)
    expect(sectorsFile.national.consulting).toBe(2873)
    expect(govServiceKpis.consultingServices).toBe(2873)
    expect(leadInt(claimById('method-gov-consulting-sheet'))).toBe(2873)
    expect(sectorsFile.national.entitiesServed).toBe(421)
    expect(govServiceKpis.servedEntities).toBe(421)
    expect(govServiceKpis.trainingPrograms).toBe(377)
    expect(govServiceKpis.govQuasiEntities).toBe(370)
  })

  it('the govSectors.ts sector sheet sums to the same national totals', () => {
    expect(govSectors.reduce((n, s) => n + (s.services?.trainingBeneficiaries ?? 0), 0)).toBe(7915)
    expect(govSectors.reduce((n, s) => n + (s.services?.consultingServices ?? 0), 0)).toBe(2873)
    expect(govEntities.filter((e) => e.services).length).toBe(421)
  })

  it('every sector row of sectors.json is recomputable from the cleaned directory; the pooled row carries exactly the withheld sectors', () => {
    const agg = new Map<string, { training: number; consulting: number; withRecords: number }>()
    for (const e of govEntities) {
      const slug = sectorIdFromAr(e.sector)
      expect(slug, `${e.id}: sector «${e.sector}» has a slug`).toBeTruthy()
      const a = agg.get(slug!) ?? { training: 0, consulting: 0, withRecords: 0 }
      if (e.services) {
        a.training += e.services.trainingBeneficiaries
        a.consulting += e.services.consultingServices
        a.withRecords += 1
      }
      agg.set(slug!, a)
    }
    for (const s of listedSectors) {
      const a = agg.get(s.id) ?? { training: 0, consulting: 0, withRecords: 0 }
      expect(s.entitiesWithRecords, `${s.id}: entitiesWithRecords`).toBe(a.withRecords)
      if (s.showAggregates) {
        expect(s.training, `${s.id}: training`).toBe(a.training)
        expect(s.consulting, `${s.id}: consulting`).toBe(a.consulting)
      }
    }
    const pooledIds = pooledRow.pooledSectorIds ?? []
    const expectedPooled = new Set([...listedSectors.filter((s) => !s.showAggregates).map((s) => s.id), 'private-sector'])
    expect(new Set(pooledIds)).toEqual(expectedPooled)
    const p = pooledIds.reduce(
      (acc, id) => {
        const a = agg.get(id) ?? { training: 0, consulting: 0, withRecords: 0 }
        return { training: acc.training + a.training, consulting: acc.consulting + a.consulting, withRecords: acc.withRecords + a.withRecords }
      },
      { training: 0, consulting: 0, withRecords: 0 }
    )
    expect(pooledRow.training).toBe(p.training)
    expect(pooledRow.consulting).toBe(p.consulting)
    expect(pooledRow.entitiesWithRecords).toBe(p.withRecords)
  })

  it('Σ per-sector training-by-year equals the national yearly series, which sums to 7,915', () => {
    const years = yearlyTraining.length
    expect(years).toBe(6)
    const perSector = new Map<string, number[]>()
    for (const e of govEntities) {
      const series = entityYearlyTraining[e.id]
      if (!series) continue
      expect(series.length, `${e.id}: yearly series length`).toBe(years)
      const slug = sectorIdFromAr(e.sector) ?? e.sector
      const acc = perSector.get(slug) ?? new Array<number>(years).fill(0)
      series.forEach((v, i) => (acc[i] += v))
      perSector.set(slug, acc)
    }
    const total = new Array<number>(years).fill(0)
    for (const acc of perSector.values()) acc.forEach((v, i) => (total[i] += v))
    expect(total).toEqual(yearlyTraining.map((y) => y.records))
    expect(yearlyTraining.reduce((n, y) => n + y.records, 0)).toBe(7915)
    expect(yearlyTraining.map((y) => y.year)).toEqual([2021, 2022, 2023, 2024, 2025, 2026])
  })
})

/* ============================================================== 2. the n ≥ 10 rule */

describe('2. the n ≥ 10 rule', () => {
  it('showAggregates === (entitiesWithRecords ≥ 10) for every sector; withheld rows carry nulls', () => {
    expect(SECTOR_MIN_ENTITIES).toBe(10)
    expect(sectorsFile.minEntitiesForAggregates).toBe(SECTOR_MIN_ENTITIES)
    expect(leadInt(claimById('method-gov-sector-min'))).toBe(SECTOR_MIN_ENTITIES)
    for (const s of sectorRows) {
      expect(s.showAggregates, `${s.id}: showAggregates`).toBe(s.entitiesWithRecords >= SECTOR_MIN_ENTITIES)
      if (!s.showAggregates) {
        expect([s.training, s.consulting, s.categories, s.domains], `${s.id}: withheld values`).toEqual([null, null, null, null])
      } else {
        expect(typeof s.training, `${s.id}: training`).toBe('number')
        expect(typeof s.consulting, `${s.id}: consulting`).toBe('number')
        if (!s.pooled) {
          expect(Object.keys(s.categories ?? {}).length, `${s.id}: categories`).toBeGreaterThan(0)
          expect((s.domains ?? []).length, `${s.id}: domains`).toBeGreaterThan(0)
        }
      }
    }
    expect(sectorRows.filter((s) => !s.pooled).length).toBe(leadInt(claimById('gov-sectors-public')))
    expect(listedSectors.length).toBe(29)
    // published aggregates count every non-pooled sector with n ≥ 10 (the state-owned-companies brief included), not only the page's cards
    expect(sectorRows.filter((s) => !s.pooled && s.showAggregates).length).toBe(leadInt(claimById('gov-sectors-with-aggregates')))
    expect(listedSectors.some((s) => s.id === 'private-sector')).toBe(false)
  })

  it('rendered GovSectors (ar, aggregate) shows numeric training/consulting figures only for showAggregates sectors', async () => {
    const { container } = PAGES.sectors('ar')
    await settled(container)
    const cards = [...container.querySelectorAll('article')]
    expect(cards.length).toBe(listedSectors.length)
    for (const card of cards) {
      const name = card.querySelector('h2')?.textContent?.trim() ?? ''
      const s = listedSectors.find((x) => x.nameAr === name)
      expect(s, `card «${name}» is a sector of sectors.json`).toBeTruthy()
      const text = card.textContent ?? ''
      if (s!.showAggregates) {
        expect(card.querySelector('dl'), `${s!.id}: figures list`).toBeTruthy()
        expect(text).toContain(fmt(s!.training!))
        expect(text).toContain(fmt(s!.consulting!))
        expect(text).toContain(fmt(s!.entitiesWithRecords))
      } else {
        expect(card.querySelector('dl'), `${s!.id}: no figures list`).toBeNull()
        expect(text).toContain('المجاميع تُعرض للقطاعات')
        expect(text).toContain('n ≥ 10')
        expect(text).not.toContain('سجل مشاركة تدريبية')
        expect(text).not.toContain('خدمة استشارية')
      }
      const brief = [...card.querySelectorAll('a')].map((a) => a.getAttribute('href'))
      expect(brief).toContain(`/ar/sectors/${s!.id}`)
    }
  })

  it('the SectorBrief of a sector below the threshold shows the notice and no figures', async () => {
    const { container } = PAGES.brief('ar', hiddenSector.id)
    await settled(container)
    const text = container.textContent ?? ''
    expect(container.querySelector('h1')?.textContent).toBe(hiddenSector.nameAr)
    expect(text).toContain('المجاميع القطاعية محجوبة')
    expect(text).toContain('n ≥ 10')
    // only the two directory counts (government + quasi, all public entities) are shown
    expect(container.querySelectorAll('dd').length).toBe(2)
    expect(text).not.toContain('سجل مشاركة تدريبية')
    expect(text).not.toContain('خدمة استشارية')
    expect(container.querySelector('table')).toBeNull()
    expect(text).not.toContain('%')
  })

  it('the SectorBrief of a published sector shows counts and period, the «استنتاج تحريري» chip, and prints as A4', async () => {
    const { container } = PAGES.brief('ar', shownSector.id)
    await settled(container)
    const text = container.textContent ?? ''
    expect(container.querySelector('h1')?.textContent).toBe(shownSector.nameAr)
    expect(text).toContain(fmt(shownSector.training!))
    expect(text).toContain(fmt(shownSector.consulting!))
    expect(text).toContain(fmt(shownSector.entitiesWithRecords))
    expect(text).toContain('مجالات تطوير مرتبطة بسجل الاستشارات')
    expect(text).toContain('استنتاج تحريري')
    expect(text).toContain('الفترة')
    expect(text).toContain(periods.consulting.ar)
    expect(text).not.toContain('%')
    const categoryCount = Object.values(shownSector.categories ?? {}).filter((n) => n > 0).length
    expect(container.querySelectorAll('tbody tr').length).toBe(categoryCount)
    expect(container.querySelectorAll('ol li').length).toBe((shownSector.domains ?? []).length)
    for (const d of shownSector.domains ?? []) expect(text).toContain(fmt(d.records))
    const css = [...container.querySelectorAll('style')].map((s) => s.textContent).join('\n')
    expect(css).toMatch(/@page\s*\{[^}]*size:\s*A4/)
    expect([...container.querySelectorAll('button')].some((b) => (b.textContent ?? '').includes('اطبع'))).toBe(true)
  })
})

/* =========================================================== 3. the public index */

describe('3. no private entity in the public index', () => {
  it('rows carry exactly the six public fields, a public class, unique ids and no private entity', () => {
    expect(index.length).toBeGreaterThan(500)
    expect(index.filter((r) => r.type === 'private')).toEqual([])
    expect(index.filter((r) => !PUBLIC_ENTITY_TYPES.includes(r.type)).map((r) => r.id)).toEqual([])
    for (const r of index) expect(Object.keys(r).sort(), r.id).toEqual(['id', 'nameAr', 'nameEn', 'region', 'sectorId', 'type'])
    expect(new Set(index.map((r) => r.id)).size).toBe(index.length)
    const privateIds = new Set(govEntities.filter((e) => e.entityType === 'private').map((e) => e.id))
    expect(privateIds.size).toBeGreaterThan(0)
    expect(index.filter((r) => privateIds.has(r.id))).toEqual([])
  })

  it('no historical or merged entity reaches the index; «موسم الرياض» appears once', () => {
    const hidden = govEntities.filter((e) => e.status !== 'active').map((e) => e.id)
    expect(new Set(hidden)).toEqual(new Set(README_HIDDEN_IDS))
    expect(index.filter((r) => hidden.includes(r.id))).toEqual([])
    expect(index.filter((r) => /سابق/.test(r.nameAr)).map((r) => r.nameAr)).toEqual([])
    expect(index.filter((r) => r.nameAr === 'موسم الرياض').length).toBe(1)
    expect(index.filter((r) => /^موسم الرياض/.test(r.nameAr)).length).toBe(1)
    for (const e of govEntities.filter((x) => x.status === 'merged')) expect(e.mergedInto, `${e.id} mergedInto`).toBe('ent-0426')
  })

  it('the raw file text carries no removed private names and no detail keys (logo, services, website)', () => {
    for (const banned of ['التميمي', 'Al Habardi', '"logo"', '"services"', '"website"', 'logoStatus']) {
      expect(indexText, `entities-index.json contains «${banned}»`).not.toContain(banned)
      expect(sectorsText, `sectors.json contains «${banned}»`).not.toContain(banned)
    }
  })

  it("'ent-0179' appears nowhere in the public JSON (task acceptance: grep for ent-0179 in dist/ returns nothing)", () => {
    const hits = (text: string) => [...text.matchAll(/.{0,30}ent-0179.{0,80}/g)].map((m) => m[0].trim())
    expect(hits(indexText), 'entities-index.json contains «ent-0179»').toEqual([])
    expect(hits(sectorsText), 'sectors.json contains «ent-0179»').toEqual([])
  })

  it('every sectorId and region resolves in the bilingual taxonomy, and no English label is Arabic', () => {
    for (const r of index) {
      const sector = sectorById(r.sectorId)
      const region = regionById(r.region)
      expect(sector, `${r.id}: sector «${r.sectorId}»`).toBeTruthy()
      expect(region, `${r.id}: region «${r.region}»`).toBeTruthy()
      expect(entityTypeById(r.type), `${r.id}: type «${r.type}»`).toBeTruthy()
      expect(ARABIC.test(label(sector, 'en'))).toBe(false)
      expect(ARABIC.test(label(region, 'en'))).toBe(false)
      expect(ARABIC.test(label(entityTypeById(r.type), 'en'))).toBe(false)
    }
    expect(index.some((r) => r.sectorId === 'private-sector')).toBe(false)
  })

  it('every nameAr contains Arabic letters; every nameEn starts with a capital unless it is a brand exception', () => {
    expect(index.filter((r) => !ARABIC.test(r.nameAr)).map((r) => `${r.id} ${r.nameAr}`)).toEqual([])
    const lower = index.filter((r) => r.nameEn && !/^[A-Z0-9(«"]/.test(r.nameEn) && !BRAND_EXCEPTIONS.has(r.nameEn))
    expect(lower.map((r) => `${r.id} ${r.nameEn}`)).toEqual([])
    expect(index.filter((r) => r.nameEn !== null && r.nameEn.trim() === '').map((r) => r.id)).toEqual([])
    expect(index.filter((r) => EASTERN.test(JSON.stringify(r))).map((r) => r.id)).toEqual([])
  })

  it('directory claims match the index counts', () => {
    expect(leadInt(claimById('gov-directory-public'))).toBe(index.length)
    expect(leadInt(claimById('gov-directory-government'))).toBe(index.filter((r) => r.type === 'government').length)
    const govQuasi = index.filter((r) => DEFAULT_DIRECTORY_TYPES.includes(r.type)).length
    expect(govQuasi).toBeGreaterThan(400)
    expect(govQuasi).toBeLessThan(index.length)
  })
})

/* ============================================================ 4. no logos in aggregate mode */

describe('4. no logo references in aggregate mode', () => {
  it('the default data mode is aggregate', () => {
    expect(dataMode()).toBe('aggregate')
    expect(isFullMode()).toBe(false)
  })

  it('Directory (first page): no <img>, no /logos/ or .webp, real links, keyboard-operable type filter defaulting to government types', async () => {
    const { container } = PAGES.directory('ar')
    await settled(container)
    expect(container.querySelectorAll('img').length).toBe(0)
    expect(container.innerHTML).not.toContain('/logos/')
    expect(container.innerHTML).not.toContain('.webp')
    const links = [...container.querySelectorAll('ul li a')]
    expect(links.length).toBe(48)
    for (const a of links) expect(a.getAttribute('href')).toMatch(/^\/ar\/directory\/ent-\d{4}$/)
    const buttons = [...container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')]
    expect(buttons.length).toBeGreaterThanOrEqual(5)
    const pressed = buttons.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.textContent?.replace(/[\d,]+$/, '').trim())
    expect(new Set(pressed)).toEqual(new Set(DEFAULT_DIRECTORY_TYPES.map((ty) => label(entityTypeById(ty), 'ar'))))
    const govQuasi = index.filter((r) => DEFAULT_DIRECTORY_TYPES.includes(r.type)).length
    const status = container.querySelector('[role="status"]')
    expect(status?.textContent).toContain(fmt(govQuasi))
    expect(status?.textContent).toContain(fmt(index.length))
    // the filter is a real <button>: toggling the sports type adds those rows
    const sports = buttons.find((b) => (b.textContent ?? '').includes(label(entityTypeById('sports'), 'ar')))!
    expect(sports.tagName).toBe('BUTTON')
    act(() => {
      fireEvent.click(sports)
    })
    expect(sports.getAttribute('aria-pressed')).toBe('true')
    const withSports = govQuasi + index.filter((r) => r.type === 'sports').length
    await waitFor(() => expect(container.querySelector('[role="status"]')?.textContent).toContain(fmt(withSports)))
  })

  it('EntityDetail (a government entity) shows name, type, sector, region and the sector-brief link only; no <img>', async () => {
    const { container } = PAGES.entity('ar')
    await settled(container)
    expect(container.querySelectorAll('img').length).toBe(0)
    expect(container.innerHTML).not.toContain('/logos/')
    expect(container.innerHTML).not.toContain('.webp')
    const text = container.textContent ?? ''
    expect(container.querySelector('h1')?.textContent).toBe(govRow.nameAr)
    expect(text).toContain(label(entityTypeById(govRow.type), 'ar'))
    expect(text).toContain(label(sectorById(govRow.sectorId), 'ar'))
    expect(text).toContain(label(regionById(govRow.region), 'ar'))
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toContain(`/ar/sectors/${govRow.sectorId}`)
    expect([...container.querySelectorAll('button')].some((b) => (b.textContent ?? '').includes('عودة إلى دليل الجهات'))).toBe(true)
    // no per-entity service record, no website, no inferred needs
    for (const banned of ['سجل مشاركة تدريبية', 'برنامج تدريبي', 'خدمة استشارية', 'الموقع الإلكتروني', 'عرض خاص']) expect(text).not.toContain(banned)
    expect(container.querySelectorAll('dd').length).toBe(3)
  })

  it('Services: no <img> and no logo URLs', async () => {
    const { container } = PAGES.services('ar')
    await settled(container)
    expect(container.querySelectorAll('img').length).toBe(0)
    expect(container.innerHTML).not.toContain('/logos/')
    expect(container.innerHTML).not.toContain('.webp')
  })

  it('EntityLogo in aggregate mode renders a monogram without <img>, even when a logo stem is given', () => {
    const { container } = render(createElement(EntityLogo, { entity: { id: 'ent-0061', nameAr: 'هيئة الاتصالات والفضاء والتقنية', logo: 'ent-0061' } }))
    expect(container.querySelector('img')).toBeNull()
    expect(container.innerHTML).not.toContain('/logos/')
    const mono = container.querySelector('span')
    expect(mono?.textContent).toBe('ه')
    expect(mono?.getAttribute('aria-hidden')).toBe('true')
  })

  it('EntityLogo in full mode (stubbed env, fresh import) renders a lazy <img> with a .webp src', async () => {
    vi.stubEnv('VITE_DATA_MODE', 'full')
    vi.resetModules()
    try {
      const flags = await import('../lib/flags')
      expect(flags.dataMode()).toBe('full')
      const { default: FullLogo } = await import('../components/EntityLogo')
      const { container } = render(createElement(FullLogo, { entity: { id: 'ent-0061', nameAr: 'هيئة الاتصالات والفضاء والتقنية', logo: 'ent-0061' } }))
      const img = container.querySelector('img')
      expect(img).toBeTruthy()
      expect(img?.getAttribute('loading')).toBe('lazy')
      expect(img?.getAttribute('src')).toMatch(/\/logos\/ent-0061\.webp$/)
      expect(img?.getAttribute('alt')).toBe('')
      // without a stem the full build still falls back to the monogram
      const { container: c2 } = render(createElement(FullLogo, { entity: { id: 'ent-0001', nameAr: 'مركز', logo: null } }))
      expect(c2.querySelector('img')).toBeNull()
    } finally {
      vi.unstubAllEnvs()
      vi.stubEnv('VITE_DATA_MODE', 'aggregate')
      vi.resetModules()
    }
    expect(dataMode()).toBe('aggregate')
  })
})

/* ========================================================= 5. banned content (aggregate) */

describe('5. aggregate-mode banned content', () => {
  const pages: PageKey[] = ['services', 'sectors', 'directory', 'entity', 'brief']

  it.each(pages)('%s (ar): no rankings, no «لم تستفد», no composite total, no inferred needs, no «أثر», no %, no Eastern digits; every <Claim> resolves', async (key) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const { container } = PAGES[key]('ar')
      await settled(container)
      const text = container.textContent ?? ''
      for (const banned of BANNED_AR) expect(text, `${key} contains «${banned}»`).not.toContain(banned)
      expect(EASTERN.test(text), `${key} contains Eastern digits`).toBe(false)
      expect(text).not.toContain('10,788')
      expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Claim]'))).toEqual([])
    } finally {
      warn.mockRestore()
    }
  })

  it('Services (ar) is «سجل خدمات التمكين» with separate units, the cut-off and the reconciliation note', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const { container } = PAGES.services('ar')
      await settled(container)
      const text = container.textContent ?? ''
      expect(container.querySelector('h1')?.textContent).toBe('سجل خدمات التمكين')
      for (const v of ['7,915', '2,873', '377', '421', '370', '7,891', '2,918', 'نهاية الربع الثالث 2026', 'ملفا المصدر حتى نهاية الربع الثالث 2026']) expect(text).toContain(v)
      expect(text).toContain('التوفيق مع سجل البرنامج الحي')
      expect(text).toContain('18 أكتوبر 2026')
      expect(text).toContain('سجل مشاركة تدريبية')
      expect(text).toContain('خدمة استشارية')
      expect(text).not.toContain('أثر')
      expect(container.querySelectorAll('button[aria-expanded]').length).toBeGreaterThanOrEqual(8)
      expect(warn.mock.calls.filter((c) => String(c[0]).includes('[Claim]'))).toEqual([])
    } finally {
      warn.mockRestore()
    }
  })
})

/* ================================================================ 6. English pages */

describe('6. English pages carry no Arabic outside lang="ar"', () => {
  const pages: PageKey[] = ['services', 'sectors', 'directory', 'entity', 'brief']

  it.each(pages)('%s (en)', async (key) => {
    const { container } = PAGES[key]('en')
    await settled(container)
    const runs = textOutsideArabic(container).match(new RegExp(`${ARABIC.source}[${cp(0x0600)}-${cp(0x06ff)}\\s«»،؛]*`, 'g')) ?? []
    expect(runs).toEqual([])
    if (key !== 'entity') expect(ARABIC.test(container.querySelector('h1')?.textContent ?? '')).toBe(false)
    expect(EASTERN.test(container.textContent ?? '')).toBe(false)
  })

  it('Services (en) is titled «Enablement service record» and keeps the program names as Arabic proper nouns', async () => {
    const { container } = PAGES.services('en')
    await settled(container)
    expect(container.querySelector('h1')?.textContent).toBe('Enablement service record')
    expect(container.textContent).toContain('Both source workbooks up to the end of Q3 2026')
    expect(container.querySelectorAll('[lang="ar"]').length).toBeGreaterThan(0)
  })
})

/* ============================================ 6b. English taxonomy everywhere, year labels, hub */

/** Arabic runs left after removing every element marked lang="ar" (same rule as group 6). */
const arabicRunsOutsideAr = (container: HTMLElement) =>
  textOutsideArabic(container).match(new RegExp(`${ARABIC.source}[${cp(0x0600)}-${cp(0x06ff)}\\s«»،؛]*`, 'g')) ?? []

describe('6b. English pages: taxonomy labels in English on every state, proper names marked lang="ar"', () => {
  it('directory (en), every type selected, every page: no Arabic outside lang="ar"; Arabic-only names carry the English note', async () => {
    const { container } = PAGES.directory('en')
    await settled(container)
    const toggles = [...container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')]
    for (const b of toggles) {
      if (b.getAttribute('aria-pressed') !== 'true') {
        act(() => {
          fireEvent.click(b)
        })
      }
    }
    await waitFor(() => expect(container.querySelector('[role="status"]')?.textContent).toContain(`${fmt(index.length)} of ${fmt(index.length)}`))
    const seen = new Set<string>()
    for (let guard = 0; guard < 30; guard++) {
      expect(arabicRunsOutsideAr(container), `directory page ${guard + 1}`).toEqual([])
      for (const card of container.querySelectorAll('ul li a')) {
        const id = card.getAttribute('href')?.split('/').pop() ?? ''
        seen.add(id)
        const row = index.find((r) => r.id === id)!
        const text = card.textContent ?? ''
        if (row.nameEn) {
          expect(text, `${id}: English name`).toContain(row.nameEn)
          expect(card.getAttribute('aria-label'), `${id}: aria-label`).toContain(row.nameEn)
        } else {
          expect(text, `${id}: English fallback note`).toContain(englishNameFallback.short)
        }
        expect(card.querySelector('h2')?.getAttribute('lang'), `${id}: name marked lang="ar"`).toBe('ar')
      }
      const next = [...container.querySelectorAll<HTMLButtonElement>('nav button')].find((b) => (b.textContent ?? '').includes('Next page'))
      if (!next || next.disabled) break
      act(() => {
        fireEvent.click(next)
      })
    }
    expect(seen.size).toBe(index.length)
  })

  it('directory (en): every sector and region option is English', async () => {
    const { container } = PAGES.directory('en')
    await settled(container)
    const options = [...container.querySelectorAll('select option')].map((o) => o.textContent ?? '')
    expect(options.length).toBeGreaterThan(20)
    expect(options.filter((o) => ARABIC.test(o))).toEqual([])
  })

  it('sectors (en) with a category focus: the focus panel and every card are English', async () => {
    const { container } = renderAt(createElement(GovSectors), 'en', '/en/sectors?category=digital-strategy')
    await settled(container)
    expect(container.querySelector('#sectors-focus')?.textContent).toContain('Digital strategies')
    expect(container.querySelectorAll('#sectors-focus ~ ul li, section[aria-labelledby="sectors-focus"] li').length).toBeGreaterThan(0)
    expect(arabicRunsOutsideAr(container)).toEqual([])
  })

  it('services (en): categories, pillars and regions are English; no Arabic outside lang="ar"', async () => {
    const { container } = PAGES.services('en')
    await settled(container)
    expect(arabicRunsOutsideAr(container)).toEqual([])
    const lists = [...container.querySelectorAll('ul[aria-label]')]
    expect(lists.length).toBe(3)
    for (const ul of lists) expect(ul.querySelectorAll('[lang="ar"]').length, ul.getAttribute('aria-label') ?? '').toBe(0)
  })

  it.each(['ar', 'en'] as const)('services (%s): the partial year and its marker form one left-to-right isolate', async (lang) => {
    const { container } = PAGES.services(lang)
    await settled(container)
    const isolates = [...container.querySelectorAll('bdi[dir="ltr"]')].filter((b) => (b.textContent ?? '').startsWith(String(PARTIAL_YEAR)))
    const marked = isolates.filter((b) => b.textContent === `${PARTIAL_YEAR}*`)
    // the legend line and the chart axis
    expect(marked.length).toBe(2)
    for (const b of marked) {
      const marker = b.lastElementChild
      expect(marker?.textContent).toBe('*')
      expect(marker?.getAttribute('aria-hidden')).toBe('true')
      expect(b.firstChild?.textContent).toBe(String(PARTIAL_YEAR))
    }
    // no bare «*» or «2026*» outside an isolate
    const loose = [...container.querySelectorAll('span')].filter((el) => /^\d{4}\*$/.test(el.textContent ?? '') && !el.closest('bdi') && !el.querySelector('bdi'))
    expect(loose).toEqual([])
  })
})

describe('6b. the section hub promises what the aggregate pages show', () => {
  it.each(['ar', 'en'] as const)('hub (%s): states the n ≥ 10 rule from the data constant, promises the full layer and never rankings or the Authority logo', (lang) => {
    const { container } = renderAt(createElement(EntitiesSectorsHub), lang, `/${lang}/entities`)
    const text = container.textContent ?? ''
    expect(text).toContain(`${SECTOR_MIN_ENTITIES}`)
    if (lang === 'ar') {
      for (const s of ['شعار الهيئة نفسها', 'سجل خدماتها التدريبية والاستشارية', 'ترتيب الجهات', 'مجموع مركّب', 'جهات القطاع الخاص', 'القطاعات الحكومية', 'استنتاج تحريري']) expect(text, s).toContain(s)
      expect(text).not.toContain('مجاميع فقط')
    } else {
      expect(arabicRunsOutsideAr(container)).toEqual([])
      for (const s of ['Authority’s own logo', 'Ranking entities', 'Private-sector entities', 'Government sectors', 'editorial inference']) expect(text, s).toContain(s)
    }
    // the public build never shows the private-demo notice
    expect(text).not.toMatch(/عرض خاص|Private demo/)
  })
})

/* ============================================================== 7. Arabic plural grammar */

describe('7. plural helper otherServicesAr', () => {
  it('follows Arabic number agreement', () => {
    expect(otherServicesAr(1)).toBe('وخدمة أخرى')
    expect(otherServicesAr(2)).toBe('وخدمتان أخريان')
    expect(otherServicesAr(3)).toBe('و3 خدمات أخرى')
    expect(otherServicesAr(4)).toBe('و4 خدمات أخرى')
    expect(otherServicesAr(10)).toBe('و10 خدمات أخرى')
    expect(otherServicesAr(11)).toMatch(/^و11 خدمةً أخرى$/)
    expect(otherServicesAr(0)).toBe('')
  })

  /** The ungrammatical source tail («وN خدمة أخرى»), assembled at runtime so this file stays lint-clean. */
  const badTail = (n: number) => `و${n} خدمة أخرى`

  it('fixTopConsulting rewrites the ungrammatical tail and is idempotent', () => {
    const fixed = fixTopConsulting(`خدمة أ (3)؛ خدمة ب (2)؛ ${badTail(4)}`)
    expect(fixed).toBe('خدمة أ (3)؛ خدمة ب (2)؛ و4 خدمات أخرى')
    expect(fixTopConsulting(fixed)).toBe(fixed)
    expect(fixTopConsulting(`… ${badTail(1)}`)).toBe('… وخدمة أخرى')
    expect(fixTopConsulting(`… ${badTail(2)}`)).toBe('… وخدمتان أخريان')
    expect(fixTopConsulting(`… ${badTail(12)}`)).toBe('… و12 خدمةً أخرى')
    expect(fixTopConsulting(null)).toBeNull()
  })

  it('no topConsulting string in govEntities.ts uses «وN خدمة أخرى»', () => {
    const src = readText('src/data/govEntities.ts')
    expect(src.match(/و\s?\d+\s?خدمة أخرى/g) ?? []).toEqual([])
    const tails = govEntities.map((e) => e.services?.topConsulting ?? '').filter((s) => /خدم/.test(s))
    expect(tails.length).toBeGreaterThan(100)
    expect(tails.filter((s) => /و\s?\d+\s?خدمة أخرى/.test(s))).toEqual([])
    expect(tails.filter((s) => /و1 خدمات|و2 خدمات/.test(s))).toEqual([])
  })
})

/* ================================================================== 8. loader cache */

describe('8. loader cache', () => {
  it('two calls to loadSectors() resolve to the same object after one underlying load', async () => {
    clearGovDataCache()
    fetchSpy.mockClear()
    const [a, b] = await Promise.all([loadSectors(), loadSectors()])
    const c = await loadSectors()
    expect(a).toBe(b)
    expect(a).toBe(c)
    expect(a.national.training).toBe(7915)
    expect(fetchSpy.mock.calls.filter(([u]) => String(u).endsWith('/data/sectors.json')).length).toBe(1)
  })

  it('loadSectorEntities in aggregate mode resolves without fetching (null: no detail rows exist in the public build)', async () => {
    clearGovDataCache()
    fetchSpy.mockClear()
    expect(isFullMode()).toBe(false)
    const rows = await loadSectorEntities(shownSector.id)
    expect(rows).toBeNull()
    expect(fetchSpy.mock.calls.filter(([u]) => String(u).includes('/data/entities/')).length).toBe(0)
  })

  it('a failed load is not cached and the next call retries', async () => {
    clearGovDataCache()
    fetchSpy.mockImplementationOnce(async () => ({ ok: false, status: 500, json: async () => null }) as unknown as Response)
    await expect(loadSectors()).rejects.toThrow(/HTTP 500/)
    await expect(loadSectors()).resolves.toMatchObject({ national: { training: 7915, consulting: 2873 } })
  })
})

/* ======================================================================= 9. claims */

describe('9. gov claims', () => {
  it('every gov claim id starts with gov-, there are at least 8, all resolve, Western digits only', () => {
    expect(govClaims.length).toBeGreaterThanOrEqual(8)
    expect(govClaims.filter((c) => !c.id.startsWith('gov-')).map((c) => c.id)).toEqual([])
    expect(govClaims.filter((c) => claimById(c.id) !== c).map((c) => c.id)).toEqual([])
    expect(govClaims.filter((c) => EASTERN.test(JSON.stringify(c))).map((c) => c.id)).toEqual([])
    expect(new Set(govClaims.map((c) => c.id)).size).toBe(govClaims.length)
  })

  it('national gov claims equal govServiceKpis and sectors.json', () => {
    expect(leadInt(claimById('gov-entities-served'))).toBe(govServiceKpis.servedEntities)
    expect(leadInt(claimById('gov-entities-served'))).toBe(sectorsFile.national.entitiesServed)
    expect(leadInt(claimById('gov-entities-served-gov'))).toBe(govServiceKpis.govQuasiEntities)
    expect(leadInt(claimById('gov-training-programs'))).toBe(govServiceKpis.trainingPrograms)
    expect(leadInt(claimById('gov-training-entities'))).toBe(govServiceKpis.trainingEntities)
    expect(leadInt(claimById('gov-consulting-entities'))).toBe(govServiceKpis.consultingEntities)
    expect(leadInt(claimById('gov-both-tracks-entities'))).toBe(govServiceKpis.bothTracksEntities)
    expect(claimById('gov-cutoff')?.value.ar).toContain('نهاية الربع الثالث 2026')
    expect(claimById('method-gov-training-register')?.period).toBe('2026-10-18')
    expect(claimById('method-gov-consulting-register')?.period).toBe('2026-10-18')
  })

  it('every literal <Claim id> in the five P4 views resolves', () => {
    const refs: string[] = []
    for (const f of VIEW_FILES) {
      const src = readText(`src/views/${f}`)
      for (const m of src.matchAll(/<Claim\s+id="([a-z0-9-]+)"/g)) refs.push(`${f}:${m[1]}`)
    }
    expect(refs.length).toBeGreaterThanOrEqual(10)
    expect(refs.filter((r) => !claimById(r.split(':')[1]))).toEqual([])
  })
})

/* ============================================================ 10. build script idempotency */

describe('10. build script', () => {
  const script = `${ROOT}scripts/build-gov-data.mjs`
  const files = ['public/data/entities-index.json', 'public/data/sectors.json']
  const run = () => execFileSync(process.execPath, [script], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

  it('node scripts/build-gov-data.mjs regenerates the two JSON files byte-identical to the committed ones, and twice in a row', () => {
    if (!existsSync(script)) {
      console.warn('[gov.test] scripts/build-gov-data.mjs is absent; idempotency check skipped')
      return
    }
    const before = files.map((f) => readText(f))
    try {
      run()
      const after1 = files.map((f) => readText(f))
      run()
      const after2 = files.map((f) => readText(f))
      files.forEach((f, i) => expect(firstDiff(after1[i], after2[i]), `${f}: two consecutive runs differ`).toBeNull())
      files.forEach((f, i) => expect(firstDiff(before[i], after1[i]), `${f}: committed file differs from a fresh run`).toBeNull())
    } finally {
      files.forEach((f, i) => writeFileSync(`${ROOT}${f}`, before[i]))
    }
  }, 120_000)
})
