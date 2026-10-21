#!/usr/bin/env node
/**
 * Self-test for the scoring scheme (v6 defect A1).
 * Run: node scripts/levels.selftest.mjs
 * Compiles src/data/levels.ts in isolation and asserts the exact boundary table.
 */
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = resolve(root, 'node_modules/.cache/selftest')
mkdirSync(out, { recursive: true })

// compile the real module (types.ts is a type-only dependency)
execSync(
  `${resolve(root, 'node_modules/.bin/tsc')} src/data/levels.ts src/data/types.ts --outDir ${out} --module commonjs --target es2020 --moduleResolution node --skipLibCheck`,
  { cwd: root, stdio: 'pipe' }
)

const { stageForScore, levelForScore } = await import(`${out}/levels.js`)

const stageCases = [
  [0, 'foundation'], [1.0, 'foundation'], [1.24, 'foundation'],
  [1.245, 'foundation'], // inside the old band gap — previously returned 'leading'
  [1.25, 'developing'], [2.0, 'developing'], [2.24, 'developing'],
  [2.245, 'developing'], // old gap
  [2.25, 'proficient'], [3.0, 'proficient'], [3.24, 'proficient'],
  [3.245, 'proficient'], // old gap — the reported defect
  [3.25, 'leading'], [4.0, 'leading'],
]
const levelCases = [
  [0, 1], [1.24, 1], [1.245, 1], [1.25, 2], [2.24, 2], [2.25, 3], [3.24, 3], [3.245, 3], [3.25, 4], [4.0, 4],
]

let failed = 0
for (const [input, want] of stageCases) {
  const got = stageForScore(input).id
  if (got !== want) { console.error(`FAIL stage(${input}) = ${got}, want ${want}`); failed++ }
}
for (const [input, want] of levelCases) {
  const got = levelForScore(input).value
  if (got !== want) { console.error(`FAIL level(${input}) = ${got}, want ${want}`); failed++ }
}

if (failed) {
  console.error(`${failed} assertion(s) failed`)
  process.exit(1)
}
console.log(`OK — ${stageCases.length} stage boundaries + ${levelCases.length} level boundaries pass`)
