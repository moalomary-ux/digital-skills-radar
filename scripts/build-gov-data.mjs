#!/usr/bin/env node
/**
 * Government data layer builder (packet P4). No dependencies; Node ≥ 22.6 (TypeScript type stripping).
 *
 *   node scripts/build-gov-data.mjs --clean   # rewrite src/data/govEntities.ts + govSectors.ts as the cleaned source of truth
 *   node scripts/build-gov-data.mjs           # aggregate tree: public/data/entities-index.json + sectors.json;
 *                                             #   removes public/data/entities/ and public/logos/*.webp
 *   node scripts/build-gov-data.mjs --full    # also public/data/entities/<sectorId>.json + copies the WebP logos
 *                                             #   (VITE_DATA_MODE=full in the environment means the same)
 *   node scripts/build-gov-data.mjs --check   # validate only (no writes): cleaning invariants + claims in src/data/claims/gov.ts
 *
 * Every run is idempotent. The classification rules and the override tables below are documented in
 * src/data/gov/README.md; the per-entity result is persisted in govEntities.ts (`entityType`, `status`).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const CLEAN = args.has('--clean')
const CHECK = args.has('--check')
const FULL = args.has('--full') || process.env.VITE_DATA_MODE === 'full'

const P = {
  entities: join(ROOT, 'src/data/govEntities.ts'),
  sectors: join(ROOT, 'src/data/govSectors.ts'),
  details: join(ROOT, 'src/data/govEntityDetails.ts'),
  services: join(ROOT, 'src/data/govServices.ts'),
  sectorSkills: join(ROOT, 'src/data/sectorSkills.ts'),
  taxonomy: join(ROOT, 'src/data/gov/taxonomy.ts'),
  plural: join(ROOT, 'src/data/gov/plural.ts'),
  types: join(ROOT, 'src/data/gov/types.ts'),
  claims: join(ROOT, 'src/data/claims/gov.ts'),
  publicData: join(ROOT, 'public/data'),
  publicLogos: join(ROOT, 'public/logos'),
  srcLogos: join(ROOT, 'src/data/gov/logos'),
}

const fail = (msg) => {
  console.error(`build-gov-data: ${msg}`)
  process.exit(1)
}
const ARABIC = /[؀-ۿ]/

/* ------------------------------------------------------------------ rules */

/** Explicit overrides: id → [entityType, reason]. Applied before the generic rules. */
const TYPE_OVERRIDES = {
  'ent-0679': ['government', 'مركز الملك سلمان للإغاثة جهة حكومية سعودية رغم إدراجه في قطاع «منظمات دولية وجهات أخرى»'],
  'ent-0680': ['nonprofit', 'مؤسسة خيرية (إخاء) وليست منظمة دولية'],
  'ent-0440': ['sports', 'اتحاد رياضي جامعي؛ النطاق في المصدر «غير محددة» فحُسم بالاسم'],
  'ent-0437': ['sports', 'الاتحاد السعودي للهجن اتحاد رياضي مسجل بنوع «اتحاد» ونطاق «حكومية»'],
  'ent-0439': ['sports', 'رابطة الدوري السعودي للمحترفين جهة رياضية مسجلة بنطاق «حكومية»'],
  'ent-0466': ['sports', 'المنتخب السعودي الأول جهة رياضية مسجلة بنطاق «خاصة»'],
  'ent-0470': ['sports', 'دوري روشن السعودي جهة رياضية مسجلة بنطاق «خاصة»'],
}

/** Historical entries: abolished or renamed bodies kept for the record, hidden from the public index. */
const HISTORICAL = {
  'ent-0236': 'وزارة البيئة والخدمات - سابقة: الاختصاص انتقل إلى وزارة البيئة والمياه والزراعة',
  'ent-0237': 'وزارة المياه والكهرباء (سابقاً): الاختصاص انتقل إلى وزارة البيئة والمياه والزراعة ووزارة الطاقة',
  'ent-0421': 'الهيئة السعودية للسياحة والتراث الوطني (سابقاً): حلّت محلها وزارة السياحة وهيئة التراث',
  'ent-0468': 'الهيئة العامة للرياضة (سابقة): حلّت محلها وزارة الرياضة',
  'ent-0062': 'وزارة الإسكان: سلفٌ لوزارة البلديات والإسكان (ent-0038)',
  'ent-0063': 'وزارة الشؤون البلدية والقروية والإسكان: سلفٌ لوزارة البلديات والإسكان (ent-0038)',
}

/**
 * Identifier remaps: raw workbook id → published id. The DGA's row keeps its workbook number (179) but
 * publishes under 'ent-9179' so that the deleted logo stem 'ent-0179' never appears in any generated asset
 * (task acceptance: `grep -r ent-0179 dist/` is empty). The same key is used in src/data/govEntityDetails.ts.
 */
const ID_REMAP = { 'ent-0179': 'ent-9179' }

/** Duplicates folded into one entry: id → target id. */
const MERGED = {
  'ent-0427': 'ent-0426', // موسم الرياض 2022 → موسم الرياض
  'ent-0428': 'ent-0426', // موسم الرياض 2023 → موسم الرياض
}

/** Name repairs: Latin-only Arabic names, a stray prefix, swapped fields. */
const NAME_FIXES = {
  'ent-0385': { nameAr: 'مجلة أباوت هير', nameEn: 'About Her Magazine' },
  'ent-0386': { nameAr: 'SRMG الدولية', nameEn: 'SRMG International' },
  'ent-0387': { nameAr: 'مختبرات SRMG', nameEn: 'SRMG Labs' },
  'ent-0388': { nameAr: 'SRMG للإعلام', nameEn: 'SRMG Media' },
  'ent-0389': { nameAr: 'SRMG ثينك', nameEn: 'SRMG Think' },
  'ent-0390': { nameAr: 'SRMG فينتشرز', nameEn: 'SRMG Ventures' },
  'ent-0391': { nameAr: 'SRMG إكس', nameEn: 'SRMG X' },
  'ent-0392': { nameAr: 'أكاديمية SRMG', nameEn: 'SRMG Academy' },
  'ent-0660': { nameAr: 'الحبردي للمحاماة', nameEn: 'Al Habardi Law' },
  'ent-0661': { nameAr: 'شركة سيكيور نتوركس', nameEn: 'Secure Networks' },
  'ent-0662': { nameAr: 'الشركة الوطنية المتحدة لتقنية المعلومات', nameEn: 'United National Information Technology Co.' },
  'ent-0663': { nameAr: 'مجموعة بي إم بي', nameEn: 'BMB Group' },
  'ent-0681': { nameAr: 'وحدة الحكومة الإلكترونية بجامعة الأمم المتحدة', nameEn: 'UNU-EGOV (United Nations University)' },
}

/** English brand names that keep their lowercase spelling. */
const BRAND_CASE = new Set(['ent-0637', 'ent-0648']) // stc Group, noon

const SMALL_WORDS = new Set(['of', 'at', 'the', 'for', 'and', 'in', 'on', 'to', 'by', 'with'])

/** Title case for an all-lowercase English name; small words stay lowercase except at the start. */
export function titleCase(s) {
  return s
    .split(/\s+/)
    .map((w, i) => {
      const lower = w.toLowerCase()
      if (i > 0 && SMALL_WORDS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

const STATE_OWNED_SECTOR = 'الشركات المملوكة للدولة والصناديق السيادية'
const INTERNATIONAL_SECTOR = 'منظمات دولية وجهات أخرى'
const COMPANY_TYPES = new Set(['شركة', 'محفظة صندوق الاستثمارات', 'صندوق سيادي'])

/** Rule-based classification of one raw entity (fields as in the workbook). */
export function classify(e) {
  const o = TYPE_OVERRIDES[e.id]
  if (o) return o[0]
  if (e.type === 'نادي' || e.type === 'اتحاد رياضي') return 'sports'
  if (e.sector === INTERNATIONAL_SECTOR || e.scope === 'دولية') return 'international'
  if (e.scope === 'أهلية') return 'nonprofit'
  if (e.scope === 'خاصة') return 'private'
  if (e.sector === STATE_OWNED_SECTOR || (COMPANY_TYPES.has(e.type) && (e.scope === 'حكومية' || e.scope === 'شبه حكومية'))) return 'state-owned'
  if (e.scope === 'شبه حكومية') return 'quasi-government'
  if (e.scope === 'حكومية') return 'government'
  fail(`${e.id} «${e.nameAr}»: scope «${e.scope}» has no rule and no override`)
}

/* ----------------------------------------------------------------- load */

async function loadTs(path) {
  return import(path)
}

const { govEntities } = await loadTs(P.entities)
const { govSectors } = await loadTs(P.sectors)
const { entityCategoryRecords, entityYearlyTraining, TRAINING_YEARS } = await loadTs(P.details)
const { govServiceKpis } = await loadTs(P.services)
const tax = await loadTs(P.taxonomy)
const { fixTopConsulting, BAD_TAIL } = await loadTs(P.plural)
const { SECTOR_MIN_ENTITIES, PUBLIC_ENTITY_TYPES } = await loadTs(P.types)

/* ----------------------------------------------------------------- clean */

function cleanEntity(raw) {
  const e = { ...raw }
  const fix = NAME_FIXES[e.id]
  if (fix) {
    e.nameAr = fix.nameAr
    e.nameEn = fix.nameEn
  }
  if (e.nameEn && /^[a-z]/.test(e.nameEn) && !BRAND_CASE.has(e.id)) e.nameEn = titleCase(e.nameEn)
  if (e.hq) e.hq = e.hq.replace(/[()]/g, '').trim() || null
  e.entityType = classify(e)
  e.status = MERGED[e.id] ? 'merged' : HISTORICAL[e.id] ? 'historical' : 'active'
  e.mergedInto = MERGED[e.id] ?? undefined
  // logo: '/logos/ent-0061.png' | 'ent-0061' | null → file stem; the DGA's own logo is removed for good
  let stem = e.logo ? String(e.logo).replace(/^.*\//, '').replace(/\.(png|webp)$/i, '') : null
  if (stem === 'ent-0179') stem = null
  e.logo = stem
  delete e.logoStatus
  if (e.services) {
    e.services = { ...e.services, topConsulting: fixTopConsulting(e.services.topConsulting) }
  }
  e.id = ID_REMAP[e.id] ?? e.id // last: every override table above is keyed by the raw id
  return e
}

const cleaned = govEntities.map(cleanEntity)

// merged duplicates: fold any service records into the target (none today; asserted in README)
for (const [from, to] of Object.entries(MERGED)) {
  const src = cleaned.find((e) => e.id === from)
  const dst = cleaned.find((e) => e.id === to)
  if (!src || !dst) fail(`merge ${from} → ${to}: entity missing`)
  if (src.services && !dst.services) dst.services = { ...src.services }
  else if (src.services && dst.services) {
    for (const k of ['trainingBeneficiaries', 'trainingPrograms', 'consultingServices', 'totalBenefit']) dst.services[k] += src.services[k]
    dst.services.lastYear = Math.max(dst.services.lastYear ?? 0, src.services.lastYear ?? 0) || null
  }
}

/* ------------------------------------------------------------ serialize */

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
const v = (x) => (x === null ? 'null' : typeof x === 'string' ? q(x) : String(x))

function entityTs(e) {
  const lines = [
    `  {`,
    `    id: ${q(e.id)},`,
    `    num: ${e.num},`,
    `    nameAr: ${q(e.nameAr)},`,
    `    nameEn: ${v(e.nameEn)},`,
    `    sector: ${q(e.sector)},`,
    `    type: ${q(e.type)},`,
    `    scope: ${q(e.scope)},`,
    `    region: ${q(e.region)},`,
    `    hq: ${v(e.hq)},`,
    `    website: ${v(e.website)},`,
    `    entityType: ${q(e.entityType)},`,
    `    status: ${q(e.status)},`,
  ]
  if (e.mergedInto) lines.push(`    mergedInto: ${q(e.mergedInto)},`)
  lines.push(`    logo: ${v(e.logo)},`)
  if (e.services) {
    const s = e.services
    lines.push(
      `    services: {`,
      `      trainingBeneficiaries: ${s.trainingBeneficiaries},`,
      `      trainingPrograms: ${s.trainingPrograms},`,
      `      consultingServices: ${s.consultingServices},`,
      `      topConsulting: ${v(s.topConsulting)},`,
      `      consultingYears: ${v(s.consultingYears)},`,
      `      lastYear: ${v(s.lastYear)},`,
      `      totalBenefit: ${s.totalBenefit},`,
      `    },`
    )
  } else lines.push(`    services: null,`)
  lines.push(`  },`)
  return lines.join('\n')
}

const ENTITIES_HEADER = `// GENERATED by \`node scripts/build-gov-data.mjs --clean\` from the two source workbooks (sectors.xlsx الدليل + services.xlsx الجهات).
// Cleaned source of truth for the government data layer (packet P4): classification, status, name repairs,
// Arabic plural grammar in topConsulting. Rules and the lists of overrides live in src/data/gov/README.md.
// Build-script input only: views load public/data/*.json through src/data/gov/loaders.ts.
// Do not hand-edit; change the rules in scripts/build-gov-data.mjs and re-run --clean (idempotent).

import type { EntityStatus, EntityType } from './gov/types.ts'

export interface GovEntityServices {
  trainingBeneficiaries: number
  trainingPrograms: number
  consultingServices: number
  topConsulting: string | null
  consultingYears: string | null
  lastYear: number | null
  /** @deprecated P4-SHIM(p2): composite of two units, never displayed; removed with the old EntityDetail view */
  totalBenefit: number
}

export interface GovEntity {
  id: string
  num: number
  nameAr: string
  nameEn: string | null
  /** verbatim workbook sector name; slug via src/data/gov/taxonomy.ts */
  sector: string
  /** verbatim workbook organizational type («وزارة», «هيئة حكومية», …) */
  type: string
  /** verbatim workbook scope («حكومية», «شبه حكومية», «خاصة», «أهلية», «دولية», «غير محددة») */
  scope: string
  region: string
  hq: string | null
  website: string | null
  /** rule-based classification, see README */
  entityType: EntityType
  status: EntityStatus
  /** target entry when status is 'merged' */
  mergedInto?: string
  /** logo file stem under src/data/gov/logos/<stem>.webp (served from /logos/ in the full build only); null when none */
  logo: string | null
  services: GovEntityServices | null
}

export const govEntities: GovEntity[] = [
`

/** P4-SHIM(p2): share of sector rows with a logo stem, kept only because the old GovSectors view still reads it. */
function logoRatioFor(s) {
  const rows = cleaned.filter((e) => e.sector === s.name)
  return rows.length ? Math.round((rows.filter((e) => e.logo).length / rows.length) * 10000) / 10000 : 0
}

function sectorTs(s) {
  const slug = tax.sectorIdFromAr(s.name)
  if (!slug) fail(`sector «${s.name}» has no slug in taxonomy.ts`)
  return [
    `  {`,
    `    id: ${q(s.id)},`,
    `    slug: ${q(slug)},`,
    `    name: ${q(s.name)},`,
    `    entityCount: ${s.entityCount},`,
    `    servedEntities: ${s.servedEntities},`,
    `    logoRatio: ${logoRatioFor(s)},`,
    `    services: ${s.services ? `{ servedEntities: ${s.services.servedEntities}, trainingBeneficiaries: ${s.services.trainingBeneficiaries}, consultingServices: ${s.services.consultingServices} }` : 'null'},`,
    `  },`,
  ].join('\n')
}

const SECTORS_HEADER = `// GENERATED by \`node scripts/build-gov-data.mjs --clean\` from sectors.xlsx (القطاعات) + services.xlsx (حسب القطاع).
// 31 sectors as recorded in the workbooks: entity counts (all 682 rows, before cleaning) and service totals.
// Build-script input only; no view imports this file. Public aggregates: public/data/sectors.json.

export interface GovSectorServices {
  servedEntities: number
  trainingBeneficiaries: number
  consultingServices: number
}

export interface GovSector {
  id: string
  /** URL slug, see src/data/gov/taxonomy.ts */
  slug: string
  name: string
  /** rows in the workbook directory (before cleaning) */
  entityCount: number
  /** entities in the sector with service records (= «entities with records» in the n ≥ 10 rule) */
  servedEntities: number
  /** @deprecated P4-SHIM(p2): logo coverage is not a sector figure any more; removed with the old GovSectors view */
  logoRatio: number
  services: GovSectorServices | null
}

export const govSectors: GovSector[] = [
`

if (CLEAN) {
  writeFileSync(P.entities, ENTITIES_HEADER + cleaned.map(entityTs).join('\n') + '\n]\n')
  writeFileSync(P.sectors, SECTORS_HEADER + govSectors.map(sectorTs).join('\n') + '\n]\n')
  console.log(`clean: wrote ${cleaned.length} entities → src/data/govEntities.ts, ${govSectors.length} sectors → src/data/govSectors.ts`)
}

/* -------------------------------------------------------------- validate */

const problems = []
const entitiesTsText = readFileSync(P.entities, 'utf8')
if (!CLEAN) {
  // the committed TS must already be the cleaned form
  if (!/entityType:/.test(entitiesTsText)) problems.push('govEntities.ts is not cleaned (no entityType field); run --clean')
  if (BAD_TAIL.test(entitiesTsText)) problems.push('govEntities.ts still contains «وN خدمة أخرى» tails; run --clean')
  BAD_TAIL.lastIndex = 0
  if (/ent-0179\.png|logoStatus/.test(entitiesTsText)) problems.push('govEntities.ts still references the DGA logo or logoStatus; run --clean')
  for (const [from, to] of Object.entries(ID_REMAP)) {
    if (new RegExp(`id: '${from}'`).test(entitiesTsText)) problems.push(`govEntities.ts still uses the raw id ${from} (published as ${to}); run --clean`)
  }
  if (JSON.stringify(cleaned) !== JSON.stringify(govEntities.map((e) => ({ ...e, mergedInto: e.mergedInto ?? undefined })))) problems.push('govEntities.ts differs from the cleaning rules; run --clean')
}
for (const [from, to] of Object.entries(ID_REMAP)) {
  if (!cleaned.some((e) => e.id === to)) problems.push(`remapped id ${to} is missing from the cleaned directory`)
  if (from in entityCategoryRecords || from in entityYearlyTraining) problems.push(`govEntityDetails.ts still keys records by the raw id ${from}; rename the key to ${to}`)
}
for (const e of cleaned) {
  if (e.status === 'active' && PUBLIC_ENTITY_TYPES.includes(e.entityType) && !ARABIC.test(e.nameAr)) problems.push(`${e.id}: public entity without Arabic letters in nameAr «${e.nameAr}»`)
  if (e.services?.topConsulting && BAD_TAIL.test(e.services.topConsulting)) problems.push(`${e.id}: ungrammatical plural tail`)
  BAD_TAIL.lastIndex = 0
  if (e.logo === 'ent-0179') problems.push(`${e.id}: references the DGA logo`)
  if (!tax.sectorIdFromAr(e.sector)) problems.push(`${e.id}: sector «${e.sector}» missing in taxonomy`)
  if (!tax.kindIdFromAr(e.type)) problems.push(`${e.id}: type «${e.type}» missing in taxonomy`)
  if (!tax.scopeIdFromAr(e.scope)) problems.push(`${e.id}: scope «${e.scope}» missing in taxonomy`)
  if (!tax.regionIdFromAr(e.region)) problems.push(`${e.id}: region «${e.region}» missing in taxonomy`)
}
const dupNames = new Map()
for (const e of cleaned.filter((x) => x.status === 'active')) dupNames.set(e.nameAr, (dupNames.get(e.nameAr) ?? 0) + 1)
for (const [n, c] of dupNames) if (c > 1) problems.push(`duplicate active nameAr «${n}» × ${c}`)
if (problems.length) {
  for (const p of problems) console.error(`  ✗ ${p}`)
  fail(`${problems.length} problem(s)`)
}

/* ----------------------------------------------------------- aggregates */

const { categoryDomainMap, domainsFromCategoryCounts } = await loadTs(P.sectorSkills)

const active = cleaned.filter((e) => e.status === 'active')
const publicRows = active
  .filter((e) => PUBLIC_ENTITY_TYPES.includes(e.entityType))
  .map((e) => ({
    id: e.id,
    nameAr: e.nameAr,
    nameEn: e.nameEn,
    sectorId: tax.sectorIdFromAr(e.sector),
    type: e.entityType,
    region: tax.regionIdFromAr(e.region),
  }))

const sum = (xs, f) => xs.reduce((a, x) => a + f(x), 0)
const national = { training: govServiceKpis.trainingRecords, consulting: govServiceKpis.consultingServices, entitiesServed: govServiceKpis.servedEntities }

const sectorRows = []
const pooled = { training: 0, consulting: 0, entitiesWithRecords: 0, entityCount: 0, ids: [] }
for (const s of govSectors) {
  const slug = tax.sectorIdFromAr(s.name)
  const members = cleaned.filter((e) => e.sector === s.name) // all rows, merged/historical have no services
  const withRecords = members.filter((e) => e.services)
  const training = sum(withRecords, (e) => e.services.trainingBeneficiaries)
  const consulting = sum(withRecords, (e) => e.services.consultingServices)
  if (withRecords.length !== s.servedEntities || training !== (s.services?.trainingBeneficiaries ?? 0) || consulting !== (s.services?.consultingServices ?? 0)) {
    fail(`sector «${s.name}»: recomputed totals differ from the workbook sector sheet`)
  }
  const term = tax.sectorById(slug)
  const publicCount = publicRows.filter((r) => r.sectorId === slug).length
  const show = withRecords.length >= SECTOR_MIN_ENTITIES
  const isGov = !tax.NON_GOVERNMENT_SECTOR_IDS.includes(slug)
  if (!isGov || !show) {
    pooled.training += training
    pooled.consulting += consulting
    pooled.entitiesWithRecords += withRecords.length
    pooled.ids.push(slug)
  }
  if (!isGov) continue
  let categories = null
  let domains = null
  if (show) {
    categories = {}
    for (const e of withRecords) for (const [cat, n] of Object.entries(entityCategoryRecords[e.id] ?? {})) categories[cat] = (categories[cat] ?? 0) + n
    for (const cat of Object.keys(categories)) if (!categoryDomainMap[cat]) fail(`unknown consulting category «${cat}»`)
    domains = domainsFromCategoryCounts(categories)
  }
  sectorRows.push({
    id: slug,
    nameAr: term.ar,
    nameEn: term.en,
    entityCount: publicCount,
    entitiesWithRecords: withRecords.length,
    showAggregates: show,
    training: show ? training : null,
    consulting: show ? consulting : null,
    categories,
    domains,
  })
}
sectorRows.push({
  id: tax.POOLED_SECTOR.id,
  nameAr: tax.POOLED_SECTOR.ar,
  nameEn: tax.POOLED_SECTOR.en,
  entityCount: 0,
  entitiesWithRecords: pooled.entitiesWithRecords,
  showAggregates: pooled.entitiesWithRecords >= SECTOR_MIN_ENTITIES,
  training: pooled.training,
  consulting: pooled.consulting,
  categories: null,
  domains: null,
  pooled: true,
  pooledSectorIds: pooled.ids,
})

const shownTraining = sum(sectorRows, (r) => r.training ?? 0)
const shownConsulting = sum(sectorRows, (r) => r.consulting ?? 0)
if (shownTraining !== national.training || shownConsulting !== national.consulting) fail(`sector sums ${shownTraining}/${shownConsulting} ≠ national ${national.training}/${national.consulting}`)
if (sum(cleaned.filter((e) => e.services), () => 1) !== national.entitiesServed) fail('entities with services ≠ national servedEntities')

const sectorsFile = {
  generatedOn: new Date().toISOString().slice(0, 10),
  mode: FULL ? 'full' : 'aggregate',
  national,
  minEntitiesForAggregates: SECTOR_MIN_ENTITIES,
  periods: tax.periods,
  cutoff: tax.cutoff,
  sectors: sectorRows,
}

/* ------------------------------------------------------- public checks */

const indexText = JSON.stringify(publicRows)
const sectorsText = JSON.stringify(sectorsFile)
// 'ent-0179' was also the raw directory id of the DGA itself; it is published as 'ent-9179' (ID_REMAP), so the
// bare string must not appear anywhere in the generated assets.
for (const banned of ['التميمي', 'Al Habardi', 'ent-0179', '"logo"', '"services"', 'logoStatus']) {
  if (indexText.includes(banned)) fail(`entities-index.json would contain «${banned}»`)
  if (sectorsText.includes(banned)) fail(`sectors.json would contain «${banned}»`)
}
if (publicRows.some((r) => r.type === 'private')) fail('a private entity reached the public index')
if (publicRows.filter((r) => r.nameAr === 'موسم الرياض').length !== 1) fail('«موسم الرياض» must appear exactly once')
if (!publicRows.every((r) => ['id', 'nameAr', 'nameEn', 'sectorId', 'type', 'region'].every((k) => k in r) && Object.keys(r).length === 6)) fail('index rows must have exactly the six fields')

/* ----------------------------------------------------------- claims check */

const counts = {
  entitiesTotal: cleaned.length,
  entitiesActive: active.length,
  entitiesPublic: publicRows.length,
  entitiesGovernment: publicRows.filter((r) => r.type === 'government').length,
  entitiesQuasi: publicRows.filter((r) => r.type === 'quasi-government').length,
  sectorsPublic: sectorRows.filter((r) => !r.pooled).length,
  sectorsWithAggregates: sectorRows.filter((r) => !r.pooled && r.showAggregates).length,
  historical: cleaned.filter((e) => e.status === 'historical').length,
  merged: cleaned.filter((e) => e.status === 'merged').length,
  byType: Object.fromEntries(['government', 'quasi-government', 'state-owned', 'private', 'nonprofit', 'international', 'sports'].map((t) => [t, cleaned.filter((e) => e.entityType === t).length])),
}

const EXPECTED_CLAIMS = {
  'gov-entities-served': national.entitiesServed,
  'gov-entities-served-gov': govServiceKpis.govQuasiEntities,
  'gov-training-programs': govServiceKpis.trainingPrograms,
  'gov-training-entities': govServiceKpis.trainingEntities,
  'gov-consulting-entities': govServiceKpis.consultingEntities,
  'gov-both-tracks-entities': govServiceKpis.bothTracksEntities,
  'gov-directory-public': counts.entitiesPublic,
  'gov-directory-government': counts.entitiesGovernment,
  'gov-sectors-public': counts.sectorsPublic,
  'gov-sectors-with-aggregates': counts.sectorsWithAggregates,
}
if (existsSync(P.claims)) {
  const { govClaims } = await loadTs(P.claims)
  const byId = new Map(govClaims.map((c) => [c.id, c]))
  for (const [id, expected] of Object.entries(EXPECTED_CLAIMS)) {
    const c = byId.get(id)
    if (!c) {
      console.warn(`  ! claim ${id} not registered (expected value ${expected})`)
      continue
    }
    const got = Number(String(c.value.en).replace(/[^\d]/g, ''))
    if (got !== expected) fail(`claim ${id} says ${c.value.en}, data says ${expected}`)
  }
}

console.log(`counts: ${JSON.stringify(counts)}`)

if (CHECK) {
  console.log('check: ok (no files written)')
  process.exit(0)
}

/* ---------------------------------------------------------------- write */

mkdirSync(P.publicData, { recursive: true })
const rowsJson = (rows) => `[\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n]\n`
writeFileSync(join(P.publicData, 'entities-index.json'), rowsJson(publicRows))
writeFileSync(join(P.publicData, 'sectors.json'), `${JSON.stringify(sectorsFile, null, 2)}\n`)
console.log(`wrote public/data/entities-index.json (${publicRows.length} rows) and public/data/sectors.json (${sectorRows.length} rows incl. pooled)`)

const entitiesDir = join(P.publicData, 'entities')
rmSync(entitiesDir, { recursive: true, force: true })
// only the published WebP copies are removed here; PNG handling belongs to scripts/convert-logos.mjs
if (existsSync(P.publicLogos)) for (const f of readdirSync(P.publicLogos)) if (/\.webp$/i.test(f)) unlinkSync(join(P.publicLogos, f))

if (FULL) {
  mkdirSync(entitiesDir, { recursive: true })
  const bySector = new Map()
  for (const e of active) {
    const slug = tax.sectorIdFromAr(e.sector)
    const row = {
      id: e.id,
      nameAr: e.nameAr,
      nameEn: e.nameEn,
      sectorId: slug,
      type: e.entityType,
      region: tax.regionIdFromAr(e.region),
      kind: tax.kindIdFromAr(e.type),
      scope: tax.scopeIdFromAr(e.scope),
      hq: e.hq,
      website: e.website,
      logo: e.logo,
      services: e.services
        ? {
            trainingRecords: e.services.trainingBeneficiaries,
            trainingPrograms: e.services.trainingPrograms,
            consultingServices: e.services.consultingServices,
            topConsulting: e.services.topConsulting,
            consultingYears: e.services.consultingYears,
            lastYear: e.services.lastYear,
          }
        : null,
      categories: entityCategoryRecords[e.id] ?? null,
      yearlyTraining: entityYearlyTraining[e.id] ?? null,
    }
    if (!bySector.has(slug)) bySector.set(slug, [])
    bySector.get(slug).push(row)
  }
  for (const [slug, rows] of bySector) writeFileSync(join(entitiesDir, `${slug}.json`), rowsJson(rows))
  let copied = 0
  if (existsSync(P.srcLogos)) {
    mkdirSync(P.publicLogos, { recursive: true })
    for (const f of readdirSync(P.srcLogos)) {
      if (!/\.webp$/i.test(f)) continue
      cpSync(join(P.srcLogos, f), join(P.publicLogos, f))
      copied++
    }
  }
  console.log(`full: wrote ${bySector.size} sector detail files (${TRAINING_YEARS.length} training years each) and copied ${copied} WebP logos to public/logos/`)
} else {
  console.log('aggregate: public/data/entities/ and public/logos/*.webp removed (full-mode assets never ship in the default build)')
}
