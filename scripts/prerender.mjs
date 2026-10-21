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
 * Suspense fallback / the router error page / the 404 heading / no <h1> falls back to the empty
 * SPA shell (still with its own head tags) and is logged. Idempotent: dist/ar and dist/en are
 * removed first.
 *
 * Diagnostics only: PRERENDER_DIST and PRERENDER_SSR_DIR override dist/ and dist-ssr/.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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

const FALLBACK_MARKERS = ['جارٍ التحميل', '>404<', 'Unexpected Application Error']

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
const { prerenderManifest, pendingPublicViews, lazyRouteElements, isRouted, headForPath, render, renderHeadTags } = entry

// The SSR bundle must carry the views eagerly, otherwise renderToString only emits the Suspense fallback.
const stillLazy = lazyRouteElements()
if (stillLazy.length > 0) {
  fail(2, `${rel(ENTRY_PATH)} still has ${stillLazy.length} React.lazy route element(s) (${stillLazy.slice(0, 5).join(', ')}${stillLazy.length > 5 ? ', …' : ''}). ` +
    'The eagerViewsForSsr transform in vite.config.ts did not run; rebuild with `npm run build:ssr`.')
}

const manifest = prerenderManifest()
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

for (const page of manifest) {
  const { path } = page
  const head = headForPath(path)
  let html = ''
  let status = 'rendered'
  let reason = null
  try {
    html = await render(path)
    reason = fallbackReason(html)
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

  const outPath = join(DIST, ...path.split('/').filter(Boolean), 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, buildPage(template, head, html, renderHeadTags))
  written.push({ path, file: relative(DIST, outPath), canonical: head.canonical, lang: head.lang, alternates: head.alternates, status })
}

// Contract: one file per manifest entry, on disk, before the manifest is handed to the sitemap.
const missing = written.filter((page) => !existsSync(join(DIST, page.file))).map((page) => page.path)
if (missing.length > 0 || written.length !== manifest.length) {
  fail(3, `wrote ${written.length} of ${manifest.length} pages; missing on disk: ${missing.join(', ') || '(none)'}`)
}

written.sort((a, b) => a.path.localeCompare(b.path))
writeFileSync(MANIFEST_OUT, JSON.stringify({ generatedBy: 'scripts/prerender.mjs', pages: written }, null, 2) + '\n')

log(`rendered ${rendered}, fallback ${fallback} (manifest ${manifest.length}, pending views ${pending.length}) -> ${rel(DIST)}/{ar,en}, ${rel(MANIFEST_OUT)}`)
process.exit(0)

/* ------------------------------------------------------------------ helpers */

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
