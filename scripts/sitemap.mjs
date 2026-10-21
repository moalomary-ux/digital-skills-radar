#!/usr/bin/env node
/**
 * Sitemap + robots for the Digital Skills Radar (packet P7). Node 22+, no dependencies.
 *
 *   node scripts/sitemap.mjs     # after scripts/prerender.mjs
 *
 * Reads dist/prerender-manifest.json (written by scripts/prerender.mjs) and writes
 * dist/sitemap.xml with one <url> per prerendered page (canonical, trailing-slash form) and
 * xhtml:link alternates for ar / en / x-default. No lastmod or changefreq: no invented dates.
 * Personal routes are never in the manifest, so they never reach the sitemap.
 * Contract: every manifest page must exist on disk (dist/<lang>/<path>/index.html) and gets
 * exactly one <url>; a missing file is a hard error (exit 3), never a silently shorter sitemap.
 *
 * Also keeps public/robots.txt (committed) in sync and copies it to dist/robots.txt so the first
 * build after a fresh checkout ships it even if public/ was copied before this script ran.
 *
 * Diagnostics only: PRERENDER_DIST overrides dist/.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, process.env.PRERENDER_DIST ?? 'dist')
const MANIFEST_PATH = join(DIST, 'prerender-manifest.json')
const SITEMAP_PATH = join(DIST, 'sitemap.xml')
const ROBOTS_PUBLIC = join(ROOT, 'public', 'robots.txt')
const ROBOTS_DIST = join(DIST, 'robots.txt')
const SITEMAP_URL = 'https://omary.me/sitemap.xml'

const rel = (p) => relative(ROOT, p) || '.'
const log = (...args) => console.log('[sitemap]', ...args)

if (!existsSync(MANIFEST_PATH)) {
  console.error(`[sitemap] ${rel(MANIFEST_PATH)} not found. Run \`node scripts/prerender.mjs\` first.`)
  process.exit(2)
}

const { pages } = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
if (!Array.isArray(pages) || pages.length === 0) {
  console.error(`[sitemap] ${rel(MANIFEST_PATH)} lists no pages; refusing to write an empty sitemap.`)
  process.exit(3)
}

// Every manifest page must have its prerendered file; otherwise the sitemap would advertise a 404.
const missing = pages.filter((p) => !existsSync(join(DIST, ...p.path.split('/').filter(Boolean), 'index.html')))
if (missing.length > 0) {
  console.error(`[sitemap] ${missing.length} manifest pages have no file under ${rel(DIST)}: ${missing.map((p) => p.path).join(', ')}`)
  process.exit(3)
}

const writtenUrls = new Set(pages.map((p) => p.canonical))

// Group by route: pages that list each other as alternates form one ar/en pair.
const urls = []
for (const page of [...pages].sort((a, b) => a.canonical.localeCompare(b.canonical))) {
  const alternates = (page.alternates ?? [])
    // Only point at pages that were actually written (a language skipped by the prerender is omitted).
    .filter((alt) => writtenUrls.has(alt.href))
  urls.push({ loc: page.canonical, alternates })
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls.flatMap(({ loc, alternates }) => [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    ...alternates.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hrefLang}" href="${escapeXml(alt.href)}"/>`),
    '  </url>',
  ]),
  '</urlset>',
  '',
].join('\n')

if (urls.length !== pages.length) {
  console.error(`[sitemap] built ${urls.length} urls for ${pages.length} manifest pages; refusing to write a partial sitemap.`)
  process.exit(3)
}
mkdirSync(DIST, { recursive: true })
writeFileSync(SITEMAP_PATH, xml)

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITEMAP_URL}\n`
if (!existsSync(ROBOTS_PUBLIC) || readFileSync(ROBOTS_PUBLIC, 'utf8') !== robots) {
  mkdirSync(dirname(ROBOTS_PUBLIC), { recursive: true })
  writeFileSync(ROBOTS_PUBLIC, robots)
  log(`updated ${rel(ROBOTS_PUBLIC)}`)
}
writeFileSync(ROBOTS_DIST, robots)

log(`${urls.length} urls -> ${rel(SITEMAP_PATH)}; robots -> ${rel(ROBOTS_DIST)}`)

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
