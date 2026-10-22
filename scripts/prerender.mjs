#!/usr/bin/env node
/**
 * Static prerender for the Digital Skills Radar (packet P7). Node 22+, no dependencies.
 *
 *   npm run build            # runs this via postbuild after vite build + build:ssr
 *   node scripts/prerender.mjs
 *
 * For every entry of prerenderManifest() (src/entry-server.tsx, both languages) renders the app
 * with react-dom/server renderToString and writes dist/<lang>/<path>/index.html, using
 * dist/index.html as the template so the hashed <script>/<link> tags are preserved untouched.
 * The route-specific <title>/description/canonical/hreflang/OG tags replace the template's
 * generic <title> and <meta name="description">.
 *
 * Contract (hard errors, non-zero exit):
 *   - dist/index.html or dist-ssr/entry-server.js missing                      -> exit 2
 *   - the SSR bundle still has React.lazy views (eager transform did not run)   -> exit 2
 *   - a manifest entry has no route in src/routes.tsx, or no file was written  -> exit 3
 * The manifest only lists routed public pages; views that have a slug but no route yet are
 * printed as "pending" so the gap stays visible, and they get neither a file nor a sitemap URL.
 *
 * Per-route failures are NOT fatal: a route whose render throws, redirects, or yields the
 * Suspense fallback / a data loading or error state / the router error page / the 404 heading /
 * no <h1> falls back to the empty SPA shell (still with its own head tags) and is logged.
 * Idempotent: dist/ar and dist/en are removed first.
 *
 * P11:
 *   - Government data: dist/data/*.json (and dist/data/entities/*.json in a full build; public/data
 *     when dist/data is missing) are read from disk and seeded into the gov-data cache, so the
 *     services, sectors, sector-brief, directory and entity pages render WITH their data; a page is
 *     rendered again while its loaders were still pending (at most MAX_PASSES). Sector ids come from
 *     sectors.json (non-pooled) and entity ids from entities-index.json, through govSeeds().
 *   - Personal routes (manifest `noindex: true`) get a shell page: their head (robots noindex) and
 *     renderShell()'s fixed placeholder, never a render of the view; GitHub Pages then answers them
 *     with 200. scripts/sitemap.mjs leaves them out.
 *
 * Diagnostics only: PRERENDER_DIST and PRERENDER_SSR_DIR override dist/ and dist-ssr/.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Production React/react-router builds: no dev-only warnings, same markup the client build uses.
process.env.NODE_ENV ??= 'production'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, process.env.PRERENDER_DIST ?? 'dist')
const SSR_DIR = resolve(ROOT, process.env.PRERENDER_SSR_DIR ?? 'dist-ssr')
const TEMPLATE_PATH = join(DIST, 'index.html')
const ENTRY_PATH = join(SSR_DIR, 'entry-server.js')
const MANIFEST_OUT = join(DIST, 'prerender-manifest.json')

// The route Suspense fallback, the gov-data loading and error states (Arabic and English), the 404
// heading and the router error page: none of them may be written as a page.
const FALLBACK_MARKERS = ['جارٍ التحميل', 'جارٍ تحميل', '>Loading', 'تعذّر تحميل', 'could not be loaded', '>404<', 'Unexpected Application Error']
/** Render passes per page while gov-data loaders are still pending (composed loaders need two). */
const MAX_PASSES = 4

const rel = (p) => relative(ROOT, p) || '.'
const log = (...args) => console.log('[prerender]', ...args)
const fail = (code, message) => {
  console.error(`[prerender] ${message}`)
  process.exit(code)
}

if (!existsSync(TEMPLATE_PATH)) fail(2, `${rel(TEMPLATE_PATH)} not found. Run \`vite build\` first.`)
if (!existsSync(ENTRY_PATH)) fail(2, `${rel(ENTRY_PATH)} not found. Run \`npm run build:ssr\` first.`)

const template = readFileSync(TEMPLATE_PATH, 'utf8')
if (!template.includes('<div id="root"></div>')) {
  fail(2, `${rel(TEMPLATE_PATH)} has no empty <div id="root"></div>; refusing to prerender.`)
}

const entry = await import(pathToFileURL(ENTRY_PATH).href)
const { prerenderManifest, pendingPublicViews, lazyRouteElements, isRouted, headForPath, render, renderHeadTags, renderShell, govSeeds, seedGovData, startGovDataCollection, settleGovData, stopGovDataCollection } = entry

// The SSR bundle must carry the views eagerly, otherwise renderToString only emits the Suspense fallback.
const stillLazy = lazyRouteElements()
if (stillLazy.length > 0) {
  fail(2, `${rel(ENTRY_PATH)} still has ${stillLazy.length} React.lazy route element(s) (${stillLazy.slice(0, 5).join(', ')}${stillLazy.length > 5 ? ', …' : ''}). ` +
    'The eagerViewsForSsr transform in vite.config.ts did not run; rebuild with `npm run build:ssr`.')
}

// Government data, as the built site serves it: seeded into the loaders' cache before any render.
const gov = readGovData()
const seeded = seedGovData(gov.files)
const sectorsFile = gov.files['/data/sectors.json']
const entityIndex = gov.files['/data/entities-index.json']
if (!sectorsFile || !Array.isArray(sectorsFile.sectors) || !Array.isArray(entityIndex)) {
  fail(2, `${rel(gov.dir)} has no usable sectors.json / entities-index.json. Run \`node scripts/build-gov-data.mjs\` (prebuild) first.`)
}
const manifest = prerenderManifest(govSeeds(sectorsFile.sectors, entityIndex.map((row) => row.id)))
if (manifest.length === 0) fail(3, 'prerenderManifest() is empty; nothing to prerender.')

// Every manifest entry must have a real route; an unrouted entry would prerender the 404 view.
const unrouted = manifest.filter((page) => !isRouted(page.path)).map((page) => page.path)
if (unrouted.length > 0) {
  fail(3, `${unrouted.length} manifest entries have no route in src/routes.tsx: ${unrouted.join(', ')}. ` +
    'Wire the route or drop the seed; the manifest must only list real pages.')
}

const pending = pendingPublicViews()
if (pending.length > 0) {
  log(`pending (slug and head data exist, but NO route in src/routes.tsx, so no page and no sitemap entry): ${pending.join(', ')}`)
}

// Idempotent: the language trees are fully owned by this script.
for (const lang of ['ar', 'en']) rmSync(join(DIST, lang), { recursive: true, force: true })

const written = []
let rendered = 0
let fallback = 0
let shells = 0
let multiPass = 0
const started = Date.now()

startGovDataCollection()
for (const page of manifest) {
  const { path } = page
  const head = headForPath(path)
  let html = ''
  let status = 'rendered'
  let reason = null
  if (page.noindex) {
    // personal route: the fixed placeholder only, never the view
    html = renderShell(path)
    status = 'shell'
    shells++
    if (!head.robots || !head.robots.includes('noindex')) fail(3, `personal route ${path} has no robots noindex in its head`)
  } else {
    try {
      html = await render(path)
      let passes = 1
      while (passes < MAX_PASSES && (await settleGovData()) > 0) {
        html = await render(path)
        passes++
      }
      if ((await settleGovData()) > 0) reason = `gov data still pending after ${MAX_PASSES} render passes`
      if (passes > 1) multiPass++
      reason ??= fallbackReason(html)
      if (reason) {
        html = ''
        status = 'fallback'
      }
    } catch (error) {
      html = ''
      status = 'fallback'
      reason = `render threw: ${error instanceof Error ? error.message : String(error)}`
    }
    if (status === 'rendered') rendered++
    else {
      fallback++
      log(`fallback (SPA shell) ${path}: ${reason}`)
    }
  }

  const outPath = join(DIST, ...path.split('/').filter(Boolean), 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, buildPage(template, head, html, renderHeadTags))
  written.push({ path, file: relative(DIST, outPath), canonical: head.canonical, lang: head.lang, alternates: head.alternates, status, noindex: page.noindex })
}
stopGovDataCollection()

// Contract: one file per manifest entry, on disk, before the manifest is handed to the sitemap.
const missing = written.filter((page) => !existsSync(join(DIST, page.file))).map((page) => page.path)
if (missing.length > 0 || written.length !== manifest.length) {
  fail(3, `wrote ${written.length} of ${manifest.length} pages; missing on disk: ${missing.join(', ') || '(none)'}`)
}

written.sort((a, b) => a.path.localeCompare(b.path))
writeFileSync(MANIFEST_OUT, JSON.stringify({ generatedBy: 'scripts/prerender.mjs', pages: written }, null, 2) + '\n')

const govPages = written.filter((page) => /^\/(ar|en)\/(services|sectors|directory)(\/|$)/.test(page.path))
log(`gov data: ${seeded} files seeded from ${rel(gov.dir)}; ${govPages.filter((page) => page.status === 'rendered').length}/${govPages.length} government pages rendered with data (${multiPass} pages needed a second pass)`)
log(`rendered ${rendered}, shells ${shells} (noindex), fallback ${fallback} (manifest ${manifest.length}, pending views ${pending.length}) in ${((Date.now() - started) / 1000).toFixed(1)} s -> ${rel(DIST)}/{ar,en}, ${rel(MANIFEST_OUT)}`)
process.exit(0)

/* ------------------------------------------------------------------ helpers */

/**
 * The generated government data as the built site serves it: dist/data (public/data before a vite
 * build), keyed by URL (`/data/sectors.json`, `/data/entities/<sectorId>.json`).
 */
function readGovData() {
  const dir = [join(DIST, 'data'), join(ROOT, 'public', 'data')].find((d) => existsSync(join(d, 'sectors.json'))) ?? join(DIST, 'data')
  const files = {}
  const read = (relPath) => {
    files[`/data/${relPath}`] = JSON.parse(readFileSync(join(dir, ...relPath.split('/')), 'utf8'))
  }
  for (const name of ['sectors.json', 'entities-index.json']) if (existsSync(join(dir, name))) read(name)
  const entitiesDir = join(dir, 'entities')
  if (existsSync(entitiesDir)) {
    for (const name of readdirSync(entitiesDir).filter((n) => n.endsWith('.json')).sort()) read(`entities/${name}`)
  }
  return { dir, files }
}

/** Null when the markup looks like a real page; otherwise why it should fall back. */
function fallbackReason(html) {
  if (!html || !html.trim()) return 'empty render output'
  for (const marker of FALLBACK_MARKERS) {
    if (html.includes(marker)) return `output contains the fallback marker "${marker}"`
  }
  if (!/<h1[\s>]/i.test(html)) return 'output has no <h1>'
  return null
}

/** Template -> page: lang/dir, head block, root content. Script and link tags are left untouched. */
function buildPage(source, head, rootHtml, renderHeadTags) {
  let out = source.replace(/<html\b[^>]*>/i, `<html lang="${head.lang}" dir="${head.dir}">`)
  // Remove the generic title/description from index.html (and any earlier data-head tags).
  out = out.replace(/[ \t]*<title\b[^>]*>[\s\S]*?<\/title>[ \t]*\r?\n?/i, '')
  out = out.replace(/[ \t]*<meta\s+name="description"[^>]*\/?>[ \t]*\r?\n?/i, '')
  out = out.replace(/[ \t]*<(?:meta|link)\b[^>]*\bdata-head\b[^>]*>[ \t]*\r?\n?/gi, '')
  // Plain <title>: the client sets document.title directly (not via data-head), and simple tooling greps <title>.
  const headBlock = renderHeadTags(head)
    .replace(/^<title[^>]*>/, '<title>')
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')
  out = out.replace(/[ \t]*<\/head>/i, `${headBlock}\n  </head>`)
  out = out.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)
  return out
}
