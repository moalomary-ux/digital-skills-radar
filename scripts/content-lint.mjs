#!/usr/bin/env node
/**
 * Content lint for the Digital Skills Radar (packet P5a). No dependencies.
 *
 *   node scripts/content-lint.mjs                 # scan src/**\/*.{ts,tsx}; exit 1 on any violation
 *   node scripts/content-lint.mjs src/views/A.tsx # scan only the given files
 *   node scripts/content-lint.mjs --json          # machine-readable output
 *
 * Rules (DECISION-20261021 §5, the binding glossary):
 *   eastern-digits     Eastern Arabic / Persian digits anywhere in source
 *   banned-term        terms the glossary forbids (outside pure comment lines)
 *   empty-translation  an empty `ar:` or `en:` string literal
 *   arabic-in-en       Arabic letters inside an `en:` string literal (allow-listed proper nouns excepted)
 *
 * Test files (`__tests__/`, `*.test.*`) are not scanned: they hold the fixtures for these rules.
 * The module also exports the helpers the vitest suites use (claim references, bare numbers),
 * so the TypeScript tests need no Node type definitions.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** `CONTENT_LINT_STRICT=1` makes the vitest suite fail on violations in every file, not only P5a's. */
export const STRICT = typeof process !== 'undefined' && process.env.CONTENT_LINT_STRICT === '1'

/* ------------------------------------------------------------------ rules */

export const EASTERN_DIGITS = /[٠-٩۰-۹]/g

/**
 * Banned terms → the approved replacement. Patterns are deliberately narrow, to avoid flagging
 * legitimate uses (e.g. «اختبار الاختراق» or «أنظمة محصّنة» are not banned).
 */
export const BANNED_TERMS = [
  { label: 'قيّس', pattern: /قيّس/g, fix: 'قِس' },
  { label: 'تخطيط العدو / مراجعة العدو', pattern: /(?:تخطيط|مراجعة) العدو/g, fix: 'تخطيط السبرنت / مراجعة السبرنت' },
  { label: 'يندثر / مندثر', pattern: /يندثر|مندثر/g, fix: 'يتراجع' },
  { label: 'البنفسجي', pattern: /البنفسجي/g, fix: 'وصف دلالي: «المضلع المستهدف»' },
  { label: '20 دورًا', pattern: /(?<![\d.,])20\s*(?:دورًا|دوراً|دورا)/g, fix: 'العدد من البيانات (24 دورًا)' },
  { label: 'عشرون دورًا', pattern: /(?:عشرون|عشرين)\s+(?:دورًا|دوراً|دورا)/g, fix: 'العدد من البيانات' },
  { label: '170M / 92M / 78M', pattern: /(?<![\d.,])(?:170|92|78)\s?M\b/g, fix: '170 مليون / 170 million' },
  { label: 'معايرة معرفية', pattern: /(?:ال)?معايرة (?:ال)?معرفية/g, fix: 'تحقق معرفي' },
  { label: 'أثر تمكين', pattern: /أثر تمكين/g, fix: 'سجل خدمات التمكين' },
  { label: 'إجمالي الاستفادة', pattern: /إجمالي الاستفادة/g, fix: 'وحدات منفصلة (سجلات مشاركة تدريبية، خدمات استشارية)' },
  { label: 'Qudratok', pattern: /Qudratok/gi, fix: '«برنامج قدراتك»' },
  { label: 'Qudrat-Tech', pattern: /Qudrat-Tech/gi, fix: '«برنامج قدراتك»' },
  { label: 'يقيس موقعك', pattern: /يقيس موقعك/g, fix: 'يساعدك على استكشاف…' },
  { label: 'تسعون يومك', pattern: /تسعون يومك/g, fix: 'خطتك للأيام الـ90 المقبلة' },
  { label: 'و4 خدمة أخرى', pattern: /و\s?\d+\s?خدمة أخرى/g, fix: 'وخدمة أخرى / وخدمتان أخريان / و4 خدمات أخرى' },
  { label: 'أرقام موثقة من سجلات', pattern: /أرقام موثقة من سجلات/g, fix: 'سجل خدمات التمكين' },
  { label: 'فجوة مقاسة', pattern: /فجوة مقاسة/g, fix: 'أولوية تطوير مقترحة' },
  { label: 'الذكاء التوليدي', pattern: /الذكاء التوليدي/g, fix: 'الذكاء الاصطناعي التوليدي' },
  { label: 'نامٍ', pattern: /نامٍ/g, fix: 'تطبيق (مستويات: وعي · تطبيق · إتقان · ريادة)' },
]

/** Proper nouns that may appear in Arabic script inside an English string. */
export const EN_ARABIC_ALLOW = ['برنامج قدراتك', 'منصة الاستشارات والدراسات', 'منصة القدرات الرقمية']

const ARABIC_LETTERS = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/

/** `ar:` / `en:` followed by a single-, double- or back-quoted literal. Groups: key, body. */
const TRANSLATION_LITERAL = /(?<![\w$.])(ar|en)\s*:\s*(?:'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g

const isCommentLine = (line) => /^\s*(?:\/\/|\/\*|\*)/.test(line)

function lineStarts(text) {
  const starts = [0]
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1)
  return starts
}

function lineOf(starts, index) {
  let lo = 0
  let hi = starts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (starts[mid] <= index) lo = mid
    else hi = mid - 1
  }
  return lo + 1
}

const excerpt = (s, max = 80) => {
  const one = s.replace(/\s+/g, ' ').trim()
  return one.length > max ? `${one.slice(0, max - 1)}…` : one
}

/** Every `ar:`/`en:` string literal in a source text. */
export function translationLiterals(text) {
  const out = []
  for (const m of text.matchAll(TRANSLATION_LITERAL)) {
    const body = m[2] ?? m[3] ?? m[4] ?? ''
    out.push({ key: m[1], body, index: m.index ?? 0, raw: m[0] })
  }
  return out
}

/**
 * Lint one source text. Returns `{ file, line, rule, message, excerpt }[]`.
 */
export function lintText(text, file = '<text>') {
  const violations = []
  const starts = lineStarts(text)
  const lines = text.split('\n')

  // 1. Eastern digits — anywhere
  for (const m of text.matchAll(EASTERN_DIGITS)) {
    const line = lineOf(starts, m.index ?? 0)
    violations.push({ file, line, rule: 'eastern-digits', message: `Eastern Arabic digit «${m[0]}»; use Western digits (0-9)`, excerpt: excerpt(lines[line - 1] ?? '') })
  }

  // 2. Banned terms — outside pure comment lines
  for (const { label, pattern, fix } of BANNED_TERMS) {
    pattern.lastIndex = 0
    for (const m of text.matchAll(pattern)) {
      const line = lineOf(starts, m.index ?? 0)
      if (isCommentLine(lines[line - 1] ?? '')) continue
      violations.push({ file, line, rule: 'banned-term', message: `banned term «${label}» → ${fix}`, excerpt: excerpt(lines[line - 1] ?? '') })
    }
  }

  // 3–4. Translation literals
  for (const lit of translationLiterals(text)) {
    const line = lineOf(starts, lit.index)
    if (isCommentLine(lines[line - 1] ?? '')) continue
    if (lit.body.trim() === '') {
      violations.push({ file, line, rule: 'empty-translation', message: `empty \`${lit.key}:\` string`, excerpt: excerpt(lit.raw) })
      continue
    }
    if (lit.key === 'en') {
      let body = lit.body
      for (const allowed of EN_ARABIC_ALLOW) body = body.split(allowed).join('')
      // `${…}` expressions are code, not text
      body = body.replace(/\$\{[^}]*\}/g, '')
      if (ARABIC_LETTERS.test(body)) {
        violations.push({ file, line, rule: 'arabic-in-en', message: 'Arabic letters inside an `en:` string', excerpt: excerpt(lit.body) })
      }
    }
  }

  return violations.sort((a, b) => a.line - b.line)
}

/* ------------------------------------------------------------------ files */

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '__tests__'])

/** All `src/**\/*.{ts,tsx}` files except tests, as absolute paths. */
export function listSourceFiles(root = PROJECT_ROOT, dir = 'src') {
  const base = join(root, dir)
  const out = []
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      const st = statSync(p)
      if (st.isDirectory()) {
        if (!SKIP_DIRS.has(name)) walk(p)
      } else if (/\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name) && !/\.spec\.(ts|tsx)$/.test(name)) {
        out.push(p)
      }
    }
  }
  walk(base)
  return out.sort()
}

export const toPosix = (p) => p.split(sep).join('/')

/** Lint files (absolute or root-relative). Returns `{ files, violations }` with root-relative paths. */
export function runContentLint({ root = PROJECT_ROOT, files } = {}) {
  const list = (files && files.length ? files.map((f) => resolve(root, f)) : listSourceFiles(root)).filter((f) => ['.ts', '.tsx'].includes(extname(f)))
  const violations = []
  for (const abs of list) {
    const rel = toPosix(relative(root, abs))
    violations.push(...lintText(readFileSync(abs, 'utf8'), rel))
  }
  return { files: list.map((f) => toPosix(relative(root, f))), violations }
}

/* ------------------------------------------------- helpers for the tests */

const CLAIM_ELEMENT = /<Claim\b[^>]*?\bid=(?:"([^"]+)"|'([^']+)'|\{\s*["'`]([^"'`]+)["'`]\s*\})/g
const CLAIM_TOKEN = /\{\{([a-z0-9][a-z0-9-]*)(?:\|(?:bare|icon))?\}\}/g

/** Literal claim references in a text: `<Claim id="x">` and `{{x}}` tokens (comment lines skipped). */
export function claimRefsInText(text, file = '<text>') {
  const starts = lineStarts(text)
  const lines = text.split('\n')
  const refs = []
  const push = (index, id, via) => {
    const line = lineOf(starts, index)
    if (!isCommentLine(lines[line - 1] ?? '')) refs.push({ file, line, id, via })
  }
  for (const m of text.matchAll(CLAIM_ELEMENT)) push(m.index ?? 0, m[1] ?? m[2] ?? m[3], 'element')
  for (const m of text.matchAll(CLAIM_TOKEN)) push(m.index ?? 0, m[1], 'token')
  return refs
}

/** Literal claim references across `src/**` (tests excluded). */
export function findClaimRefs({ root = PROJECT_ROOT } = {}) {
  const refs = []
  for (const abs of listSourceFiles(root)) refs.push(...claimRefsInText(readFileSync(abs, 'utf8'), toPosix(relative(root, abs))))
  return refs
}

/** Tokens that carry digits but are names, not quantities. */
const NAME_TOKENS = [
  /(?<!\d)(?<!\d[.,])(?:19|20)\d{2}(?!\d)(?![.,]\d)/g, // years (a sentence-final period or comma is fine)
  /SFIA\s?\d+/g,
  /DigComp\s?\d(?:\.\d)?/g,
  /(?<![\w])v\d+(?:\.\d+)?(?:-[A-Z])?/g, // release labels
  /الإصدار\s?\d+/g,
]

/**
 * Digits shown to readers outside `<Claim>`: scans `ar:`/`en:` literals and JSX text,
 * ignoring `{{claim}}` tokens and name tokens (years, framework versions, release labels).
 */
export function bareNumbersInText(text, file = '<text>') {
  const starts = lineStarts(text)
  const segments = []
  for (const lit of translationLiterals(text)) segments.push({ index: lit.index, body: lit.body })
  for (const m of text.matchAll(/(?<!=)>([^<>{}()=;'"`]+)</g)) {
    if (/[A-Za-z؀-ۿ]/.test(m[1])) segments.push({ index: (m.index ?? 0) + 1, body: m[1] })
  }
  const hits = []
  for (const seg of segments) {
    let body = seg.body.replace(CLAIM_TOKEN, ' ')
    for (const re of NAME_TOKENS) body = body.replace(re, ' ')
    if (/[0-9٠-٩]/.test(body)) hits.push({ file, line: lineOf(starts, seg.index), excerpt: excerpt(seg.body) })
  }
  return hits
}

export function findBareNumbers(files, { root = PROJECT_ROOT } = {}) {
  const hits = []
  for (const f of files) hits.push(...bareNumbersInText(readFileSync(resolve(root, f), 'utf8'), toPosix(f)))
  return hits
}

/* -------------------------------------------------------------------- CLI */

const isMain = (() => {
  try {
    return process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  } catch {
    return false
  }
})()

if (isMain) {
  const args = process.argv.slice(2)
  const json = args.includes('--json')
  const files = args.filter((a) => !a.startsWith('--'))
  const { files: scanned, violations } = runContentLint({ files })
  if (json) {
    process.stdout.write(`${JSON.stringify({ scanned: scanned.length, violations }, null, 2)}\n`)
  } else {
    for (const v of violations) process.stdout.write(`${v.file}:${v.line}  [${v.rule}]  ${v.message}\n    ${v.excerpt}\n`)
    const byFile = new Set(violations.map((v) => v.file)).size
    process.stdout.write(
      violations.length
        ? `\ncontent-lint: ${violations.length} violation(s) in ${byFile} file(s) (${scanned.length} scanned)\n`
        : `content-lint: clean (${scanned.length} files scanned)\n`
    )
  }
  process.exit(violations.length ? 1 : 0)
}
