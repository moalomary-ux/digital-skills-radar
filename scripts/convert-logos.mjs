#!/usr/bin/env node
/**
 * Logo pipeline (packet P4). Uses the `cwebp` binary on PATH (libwebp) and macOS `sips` for dimensions.
 *
 *   node scripts/convert-logos.mjs              # public/logos/*.png → src/data/gov/logos/<id>.webp (longest side 96px),
 *                                               #   then delete the PNGs; ent-0179.png (the DGA's own logo) is deleted, never converted
 *   node scripts/convert-logos.mjs --publish    # copy src/data/gov/logos/*.webp → public/logos/ (full-mode build only)
 *   node scripts/convert-logos.mjs --unpublish  # remove public/logos/*.webp (restore the default tree)
 *
 * Idempotent: an existing WebP is kept; PNGs are removed only after a successful conversion.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_LOGOS = join(ROOT, 'public/logos')
const SRC_LOGOS = join(ROOT, 'src/data/gov/logos')
const MAX_SIDE = 96
const QUALITY = '85'
const NEVER_CONVERT = new Set(['ent-0179']) // the DGA's own logo: removed permanently

const args = new Set(process.argv.slice(2))

function which(bin) {
  try {
    return execFileSync('/usr/bin/which', [bin], { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

function dimensions(file) {
  try {
    const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' })
    const w = Number(/pixelWidth:\s*(\d+)/.exec(out)?.[1])
    const h = Number(/pixelHeight:\s*(\d+)/.exec(out)?.[1])
    return w && h ? { w, h } : null
  } catch {
    return null
  }
}

function convert() {
  if (!which('cwebp')) {
    console.error('convert-logos: cwebp not found on PATH (brew install webp)')
    process.exit(1)
  }
  mkdirSync(SRC_LOGOS, { recursive: true })
  if (!existsSync(PUBLIC_LOGOS)) {
    console.log('convert-logos: public/logos/ absent; nothing to convert')
    return
  }
  let converted = 0
  let kept = 0
  let removed = 0
  for (const f of readdirSync(PUBLIC_LOGOS).sort()) {
    if (!/\.png$/i.test(f)) continue
    const stem = f.replace(/\.png$/i, '')
    const src = join(PUBLIC_LOGOS, f)
    if (NEVER_CONVERT.has(stem)) {
      unlinkSync(src)
      removed++
      console.log(`  deleted ${f} (never converted)`)
      continue
    }
    const out = join(SRC_LOGOS, `${stem}.webp`)
    if (existsSync(out) && statSync(out).size > 0) {
      kept++
    } else {
      const dim = dimensions(src)
      const resize = dim && Math.max(dim.w, dim.h) > MAX_SIDE ? (dim.w >= dim.h ? ['-resize', String(MAX_SIDE), '0'] : ['-resize', '0', String(MAX_SIDE)]) : []
      execFileSync('cwebp', ['-quiet', '-q', QUALITY, '-metadata', 'none', ...resize, src, '-o', out], { stdio: 'inherit' })
      converted++
    }
    unlinkSync(src)
    removed++
  }
  console.log(`convert-logos: ${converted} converted, ${kept} already present, ${removed} PNG removed from public/logos/; WebP count = ${readdirSync(SRC_LOGOS).filter((x) => x.endsWith('.webp')).length}`)
}

function publish() {
  if (!existsSync(SRC_LOGOS)) {
    console.error('convert-logos: src/data/gov/logos/ missing; run the conversion first')
    process.exit(1)
  }
  mkdirSync(PUBLIC_LOGOS, { recursive: true })
  let n = 0
  for (const f of readdirSync(SRC_LOGOS)) {
    if (!/\.webp$/i.test(f)) continue
    cpSync(join(SRC_LOGOS, f), join(PUBLIC_LOGOS, f))
    n++
  }
  console.log(`convert-logos: published ${n} WebP logos to public/logos/ (full-mode build only; run --unpublish before committing)`)
}

function unpublish() {
  if (!existsSync(PUBLIC_LOGOS)) return
  let n = 0
  for (const f of readdirSync(PUBLIC_LOGOS)) {
    if (/\.(webp|png)$/i.test(f)) {
      unlinkSync(join(PUBLIC_LOGOS, f))
      n++
    }
  }
  console.log(`convert-logos: removed ${n} logo file(s) from public/logos/`)
}

if (args.has('--publish')) publish()
else if (args.has('--unpublish')) unpublish()
else convert()
