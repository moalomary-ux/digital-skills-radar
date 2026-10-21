#!/usr/bin/env node
/**
 * Size budget for the initial JS of the Digital Skills Radar (packet P7). No dependencies.
 *
 *   node scripts/size-budget.mjs            # measure dist/, exit 1 if the largest initial chunk > 180 kB gzip
 *   node scripts/size-budget.mjs other-dir  # measure another build directory (diagnostics)
 *
 * "Initial JS" means every file referenced by dist/index.html through
 *   <script type="module" src="...">   and   <link rel="modulepreload" href="...">
 * Each file is gzipped with zlib (level 9) and reported as raw kB / gzip kB.
 *
 * Exit codes: 0 within budget, 1 over budget, 2 dist/index.html missing (or no JS referenced).
 * SIZE_BUDGET_KB overrides the threshold for diagnostics only; the committed default (180) is the owner's.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_BUDGET_KB = 180

const distDir = resolve(PROJECT_ROOT, process.argv[2] ?? 'dist')
const indexPath = join(distDir, 'index.html')

const budgetKb = parseBudget(process.env.SIZE_BUDGET_KB)
const budgetBytes = budgetKb * 1024

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

const rows = []
const missing = []
for (const ref of refs) {
  const filePath = resolveAsset(distDir, ref)
  if (!existsSync(filePath)) {
    missing.push(ref)
    continue
  }
  const raw = readFileSync(filePath)
  const gzip = gzipSync(raw, { level: 9 }).length
  rows.push({ file: ref, raw: raw.length, gzip })
}

if (missing.length > 0) {
  console.error(`size-budget: referenced JS not found under ${relative(PROJECT_ROOT, distDir)}: ${missing.join(', ')}`)
  process.exit(2)
}

rows.sort((a, b) => b.gzip - a.gzip)
printTable(rows)

const largest = rows[0]
const summary = `largest initial chunk: ${largest.file} = ${kb(largest.gzip)} kB gzip (budget ${budgetKb} kB${
  budgetKb !== DEFAULT_BUDGET_KB ? ', overridden via SIZE_BUDGET_KB' : ''
})`

if (largest.gzip > budgetBytes) {
  console.error(`\nsize-budget: FAIL - ${summary}. Over by ${kb(largest.gzip - budgetBytes)} kB.`)
  process.exit(1)
}

console.log(`\nsize-budget: OK - ${summary}.`)
process.exit(0)

/* ------------------------------------------------------------------ helpers */

function parseBudget(value) {
  if (value === undefined || value === '') return DEFAULT_BUDGET_KB
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) {
    console.error(`size-budget: SIZE_BUDGET_KB must be a positive number, got "${value}". Using ${DEFAULT_BUDGET_KB}.`)
    return DEFAULT_BUDGET_KB
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
}
