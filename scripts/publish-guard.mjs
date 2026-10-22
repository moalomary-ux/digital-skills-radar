#!/usr/bin/env node
/**
 * Publish guard for the Digital Skills Radar (review D1, DECISION-20261021 §2 row 5, §6). Node 22+; `--stamp` uses
 * Vite's `loadEnv` (a dev dependency) to read .env files, and falls back to the process env without it.
 *
 *   node scripts/publish-guard.mjs                       # check dist/; exit 1 on any entity-level leak
 *   node scripts/publish-guard.mjs --require-aggregate   # also fail when dist/ is a full build (CI, public deploy)
 *   node scripts/publish-guard.mjs --stamp               # write dist/build-mode.json from the build env (postbuild)
 *   node scripts/publish-guard.mjs other-dir             # check another build directory (diagnostics)
 *
 * The public build (VITE_DATA_MODE=aggregate, the default) must not ship:
 *   - the text `ent-0179` (the removed DGA logo / raw id), in any file or file name
 *   - the private entities removed from the public index: «التميمي», «Al Habardi»
 *   - a `logos/` directory that holds any file
 *   - a `data/entities/` directory (per-entity detail files)
 *   - the retired ranking and «not served» labels: «أعلى 10 جهات», «لم تستفد هذه الجهة» (and their English forms)
 * Text needles are searched in every text file (HTML, JS, CSS, JSON, XML, TXT, SVG…), so client-rendered
 * pages are covered as well as the prerendered HTML.
 *
 * Build mode. A dist/ tree counts as a full build only when BOTH markers say so:
 *   - dist/build-mode.json, written by `--stamp` at the end of `npm run build` (postbuild), from VITE_DATA_MODE
 *     as Vite resolves it (process env first, then the .env files);
 *   - dist/data/sectors.json → `mode`, written by scripts/build-gov-data.mjs during prebuild.
 * A missing or disagreeing marker means aggregate, i.e. the strict checks. In a full build the leak checks are
 * skipped (private demos legitimately carry them) unless `--require-aggregate` is given, which fails outright.
 *
 * Exit codes: 0 pass, 1 violations (or a full build under --require-aggregate), 2 dist/ missing or unreadable.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith('--')))
const positional = args.filter((a) => !a.startsWith('--'))
const DIST = resolve(ROOT, positional[0] ?? 'dist')
const STAMP_FILE = 'build-mode.json'

const rel = (p) => {
  const r = relative(ROOT, p)
  return r === '' ? '.' : r.startsWith('..') ? p : r
}
const log = (...a) => console.log('[publish-guard]', ...a)
const err = (...a) => console.error('[publish-guard]', ...a)

/* ------------------------------------------------------------------ rules */

/** Text that must never appear in a public build. `label` is what the report prints. */
const FORBIDDEN_TEXT = [
  { needle: 'ent-0179', label: 'ent-0179 (removed DGA logo / raw id)' },
  { needle: 'التميمي', label: 'private entity «التميمي»' },
  { needle: 'Al Habardi', label: 'private entity «Al Habardi»' },
  { needle: 'أعلى 10 جهات', label: 'ranking label «أعلى 10 جهات»' },
  { needle: 'Top 10 benefiting entities', label: 'ranking label «Top 10 benefiting entities»' },
  { needle: 'لم تستفد هذه الجهة', label: '«not served» label «لم تستفد هذه الجهة»' },
  { needle: 'no recorded training or consulting utilization', label: '«not served» label (English)' },
]

const TEXT_EXT = new Set(['.html', '.htm', '.js', '.mjs', '.cjs', '.css', '.json', '.xml', '.txt', '.svg', '.map', '.webmanifest', '.md', ''])

/* ------------------------------------------------------------------ mode */

/** VITE_DATA_MODE as Vite resolves it for a production build: process env first, then .env files. */
async function resolveBuildMode() {
  let raw = process.env.VITE_DATA_MODE
  let source = 'process.env'
  if (raw === undefined) {
    try {
      const { loadEnv } = await import('vite')
      raw = loadEnv('production', ROOT, 'VITE_').VITE_DATA_MODE
      source = '.env files'
    } catch {
      source = 'default'
    }
  }
  return { mode: (raw ?? '').trim() === 'full' ? 'full' : 'aggregate', source: raw === undefined ? 'default' : source }
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

/** Effective mode of a dist/ tree, with the evidence that decided it. */
function detectMode(dist) {
  const stamp = readJson(join(dist, STAMP_FILE))
  const sectors = readJson(join(dist, 'data', 'sectors.json'))
  const stampMode = stamp && (stamp.dataMode === 'full' || stamp.dataMode === 'aggregate') ? stamp.dataMode : null
  const dataMode = sectors && (sectors.mode === 'full' || sectors.mode === 'aggregate') ? sectors.mode : null
  const full = stampMode === 'full' && dataMode === 'full'
  const notes = []
  if (!stampMode) notes.push(`${STAMP_FILE} missing or unreadable`)
  if (!dataMode) notes.push('data/sectors.json mode missing or unreadable')
  if (stampMode && dataMode && stampMode !== dataMode) notes.push(`markers disagree (${STAMP_FILE}: ${stampMode}, data/sectors.json: ${dataMode})`)
  return { mode: full ? 'full' : 'aggregate', stampMode, dataMode, anyFull: stampMode === 'full' || dataMode === 'full', notes }
}

/* ------------------------------------------------------------------ files */

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

function excerptAround(text, index, needle) {
  const start = Math.max(0, index - 40)
  const end = Math.min(text.length, index + needle.length + 40)
  return text.slice(start, end).replace(/\s+/g, ' ').trim()
}

/** Every leak in a dist/ tree as `{ rule, where, detail }`. */
function findLeaks(dist) {
  const leaks = []
  const files = walk(dist)

  // 1. logos/ with files, data/entities/ present
  const logosDir = join(dist, 'logos')
  if (existsSync(logosDir)) {
    const logoFiles = walk(logosDir)
    if (logoFiles.length > 0) {
      leaks.push({ rule: 'logos', where: rel(logosDir), detail: `${logoFiles.length} file(s), e.g. ${logoFiles.slice(0, 3).map((f) => relative(dist, f)).join(', ')}` })
    }
  }
  const entitiesDir = join(dist, 'data', 'entities')
  if (existsSync(entitiesDir)) {
    const n = statSync(entitiesDir).isDirectory() ? walk(entitiesDir).length : 1
    leaks.push({ rule: 'entity-details', where: rel(entitiesDir), detail: `per-entity detail directory present (${n} file(s))` })
  }

  // 2. forbidden text in file names and file contents
  for (const file of files) {
    const relPath = relative(dist, file)
    for (const { needle, label } of FORBIDDEN_TEXT) {
      if (relPath.includes(needle)) leaks.push({ rule: 'file-name', where: rel(file), detail: label })
    }
    if (!TEXT_EXT.has(extname(file).toLowerCase())) continue
    let text
    try {
      text = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    for (const { needle, label } of FORBIDDEN_TEXT) {
      const at = text.indexOf(needle)
      if (at === -1) continue
      let count = 0
      for (let i = at; i !== -1; i = text.indexOf(needle, i + needle.length)) count++
      leaks.push({ rule: 'text', where: rel(file), detail: `${label} ×${count}: …${excerptAround(text, at, needle)}…` })
    }
  }
  return leaks
}

/* ------------------------------------------------------------------ main */

if (!existsSync(DIST) || !statSync(DIST).isDirectory()) {
  err(`${rel(DIST)} not found. Run \`npm run build\` first.`)
  process.exit(2)
}

if (flags.has('--stamp')) {
  const { mode, source } = await resolveBuildMode()
  const body = { dataMode: mode, source: `VITE_DATA_MODE (${source})`, writtenBy: 'scripts/publish-guard.mjs --stamp' }
  writeFileSync(join(DIST, STAMP_FILE), JSON.stringify(body, null, 2) + '\n')
  log(`stamped ${rel(join(DIST, STAMP_FILE))}: dataMode=${mode} (${source})`)
  process.exit(0)
}

const mode = detectMode(DIST)
log(`checking ${rel(DIST)}: build-mode.json=${mode.stampMode ?? '—'}, data/sectors.json=${mode.dataMode ?? '—'} → ${mode.mode}`)
for (const note of mode.notes) log(`note: ${note}; treated as aggregate (strict checks)`)

if (flags.has('--require-aggregate') && mode.anyFull) {
  err('FAIL - a full-mode marker is present but this run requires the public (aggregate) build. Rebuild with the default VITE_DATA_MODE.')
  process.exit(1)
}

// Owner decision 2026-10-22: the full build (entity records + entity logos) is the published site.
// In full mode the logos/ directory and data/entities/ are expected; every other rule still applies
// (the Authority's own logo, private-sector entities and ranking / «not served» texts never ship).
const FULL_MODE_ALLOWED_RULES = new Set(['logos', 'entity-details'])

let leaks
try {
  leaks = findLeaks(DIST)
  if (mode.mode === 'full') {
    leaks = leaks.filter((l) => !FULL_MODE_ALLOWED_RULES.has(l.rule))
    log('full build (VITE_DATA_MODE=full): logos/ and data/entities/ are expected; the remaining rules still apply')
  }
} catch (e) {
  err(`could not read ${rel(DIST)}: ${e instanceof Error ? e.message : String(e)}`)
  process.exit(2)
}

if (leaks.length > 0) {
  err(`FAIL - ${leaks.length} entity-level leak(s) in the public build:`)
  for (const l of leaks) err(`  [${l.rule}] ${l.where}: ${l.detail}`)
  process.exit(1)
}

const scanned = walk(DIST).length
log(`OK - ${scanned} files scanned: none of the ${FORBIDDEN_TEXT.length} forbidden texts${mode.mode === 'full' ? ' (full build: logos and entity details allowed)' : ', no logo files, no data/entities/'}.`)
process.exit(0)
