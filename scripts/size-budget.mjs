#!/usr/bin/env node
/**
 * Size budget for the initial load of the Digital Skills Radar (packet P7, review D12). No dependencies.
 *
 *   node scripts/size-budget.mjs            # measure dist/; exit 1 if a budget below is exceeded
 *   node scripts/size-budget.mjs other-dir  # measure another build directory (diagnostics)
 *
 * Two budgets, both on dist/index.html:
 *   1. largest initial JS chunk          <= 180 kB gzip  (SIZE_BUDGET_KB overrides, diagnostics only)
 *   2. total initial transfer             <= 220 kB gzip  (SIZE_BUDGET_TOTAL_KB overrides, diagnostics only)
 *      = every <script type="module" src>, every <link rel="modulepreload" href> and every
 *        <link rel="stylesheet" href> referenced by dist/index.html, each gzipped and summed.
 * "Initial JS" means every file referenced through <script type="module"> and <link rel="modulepreload">.
 * Each file is gzipped with zlib (level 9) and reported as raw kB / gzip kB.
 *
 * Exit codes: 0 within budget, 1 over budget, 2 dist/index.html missing (or no JS referenced).
 * The committed defaults (180 and 220) are the owner's.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_BUDGET_KB = 180
const DEFAULT_TOTAL_BUDGET_KB = 220

const distDir = resolve(PROJECT_ROOT, process.argv[2] ?? 'dist')
const indexPath = join(distDir, 'index.html')

const budgetKb = parseBudget(process.env.SIZE_BUDGET_KB, DEFAULT_BUDGET_KB, 'SIZE_BUDGET_KB')
const budgetBytes = budgetKb * 1024
const totalBudgetKb = parseBudget(process.env.SIZE_BUDGET_TOTAL_KB, DEFAULT_TOTAL_BUDGET_KB, 'SIZE_BUDGET_TOTAL_KB')
const totalBudgetBytes = totalBudgetKb * 1024

if (!existsSync(indexPath)) {
  console.error(`size-budget: ${relative(PROJECT_ROOT, indexPath)} not found. Run \`npm run build\` first.`)
  process.exit(2)
}

const html = readFileSync(indexPath, 'utf8')
const refs = collectInitialScripts(html)

if (refs.length === 0) {
  console.error(
    `size-budget: no <script type="module"> or <link rel="modulepreload"> JS found in ${relative(PROJECT_ROOT, indexPath)}.`,
  )
  process.exit(2)
}

const styles = collectStylesheets(html)

const missing = []
const measure = (ref, kind) => {
  const filePath = resolveAsset(distDir, ref)
  if (!existsSync(filePath)) {
    missing.push(ref)
    return null
  }
  const raw = readFileSync(filePath)
  return { file: ref, kind, raw: raw.length, gzip: gzipSync(raw, { level: 9 }).length }
}
const rows = refs.map((ref) => measure(ref, 'js')).filter(Boolean)
const cssRows = styles.map((ref) => measure(ref, 'css')).filter(Boolean)

if (missing.length > 0) {
  console.error(`size-budget: referenced JS/CSS not found under ${relative(PROJECT_ROOT, distDir)}: ${missing.join(', ')}`)
  process.exit(2)
}

rows.sort((a, b) => b.gzip - a.gzip)
cssRows.sort((a, b) => b.gzip - a.gzip)
printTable([...rows, ...cssRows])

const largest = rows[0]
const summary = `largest initial chunk: ${largest.file} = ${kb(largest.gzip)} kB gzip (budget ${budgetKb} kB${
  budgetKb !== DEFAULT_BUDGET_KB ? ', overridden via SIZE_BUDGET_KB' : ''
})`

const all = [...rows, ...cssRows]
const totalGzip = all.reduce((n, r) => n + r.gzip, 0)
const totalRaw = all.reduce((n, r) => n + r.raw, 0)
const jsGzip = rows.reduce((n, r) => n + r.gzip, 0)
const cssGzip = cssRows.reduce((n, r) => n + r.gzip, 0)
const totalSummary = `total initial transfer of index.html: ${kb(totalGzip)} kB gzip (${kb(totalRaw)} kB raw; JS ${rows.length} file(s) ${kb(jsGzip)} kB + CSS ${cssRows.length} file(s) ${kb(cssGzip)} kB) (budget ${totalBudgetKb} kB${
  totalBudgetKb !== DEFAULT_TOTAL_BUDGET_KB ? ', overridden via SIZE_BUDGET_TOTAL_KB' : ''
})`

console.log('')
const failures = []
if (largest.gzip > budgetBytes) failures.push(`${summary}. Over by ${kb(largest.gzip - budgetBytes)} kB.`)
else console.log(`size-budget: OK - ${summary}.`)
if (totalGzip > totalBudgetBytes) failures.push(`${totalSummary}. Over by ${kb(totalGzip - totalBudgetBytes)} kB.`)
else console.log(`size-budget: OK - ${totalSummary}.`)

if (failures.length > 0) {
  for (const f of failures) console.error(`size-budget: FAIL - ${f}`)
  process.exit(1)
}
process.exit(0)

/* ------------------------------------------------------------------ helpers */

function parseBudget(value, fallback, name) {
  if (value === undefined || value === '') return fallback
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) {
    console.error(`size-budget: ${name} must be a positive number, got "${value}". Using ${fallback}.`)
    return fallback
  }
  return n
}

/** JS URLs referenced by index.html as initial modules, in document order, de-duplicated. */
function collectInitialScripts(source) {
  const found = []
  const tagRe = /<(script|link)\b([^>]*)>/gi
  let m
  while ((m = tagRe.exec(source)) !== null) {
    const tag = m[1].toLowerCase()
    const attrs = m[2]
    if (tag === 'script') {
      if (!/\btype\s*=\s*["']?module["']?/i.test(attrs)) continue
      const src = attr(attrs, 'src')
      if (src) found.push(src)
    } else {
      if (!/\brel\s*=\s*["']?modulepreload["']?/i.test(attrs)) continue
      const href = attr(attrs, 'href')
      if (href) found.push(href)
    }
  }
  return [...new Set(found)].filter((u) => /\.m?js(\?.*)?$/i.test(u))
}

/** CSS URLs referenced by index.html through <link rel="stylesheet">, in document order, de-duplicated. */
function collectStylesheets(source) {
  const found = []
  const tagRe = /<link\b([^>]*)>/gi
  let m
  while ((m = tagRe.exec(source)) !== null) {
    const attrs = m[1]
    if (!/\brel\s*=\s*["']?stylesheet["']?/i.test(attrs)) continue
    const href = attr(attrs, 'href')
    if (href && !/^(?:https?:)?\/\//i.test(href)) found.push(href)
  }
  return [...new Set(found)]
}

function attr(attrs, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
  const m = re.exec(attrs)
  if (!m) return null
  return m[1] ?? m[2] ?? m[3] ?? null
}

/** Map an asset URL (base '/') to a path inside the build directory. */
function resolveAsset(dir, url) {
  const clean = url.replace(/[?#].*$/, '')
  const withoutOrigin = clean.replace(/^https?:\/\/[^/]+/i, '')
  const rel = withoutOrigin.replace(/^\/+/, '').replace(/^\.\//, '')
  return join(dir, rel)
}

function kb(bytes) {
  return (bytes / 1024).toFixed(1)
}

function printTable(list) {
  const fileWidth = Math.max('file'.length, ...list.map((r) => r.file.length))
  const line = (f, r, g) => `${f.padEnd(fileWidth)}  ${String(r).padStart(9)}  ${String(g).padStart(9)}`
  console.log(line('file', 'raw kB', 'gzip kB'))
  console.log(line('-'.repeat(fileWidth), '-'.repeat(9), '-'.repeat(9)))
  for (const r of list) console.log(line(r.file, kb(r.raw), kb(r.gzip)))
  const sum = (key) => list.reduce((n, r) => n + r[key], 0)
  console.log(line('-'.repeat(fileWidth), '-'.repeat(9), '-'.repeat(9)))
  console.log(line('total (initial transfer)', kb(sum('raw')), kb(sum('gzip'))))
}
