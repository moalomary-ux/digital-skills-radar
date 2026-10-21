#!/usr/bin/env bash
# Publish the current production build to the gh-pages branch (GitHub Pages, custom domain omary.me).
# Usage: npm run build && scripts/deploy-gh-pages.sh
# The build must be the public (aggregate) build: scripts/publish-guard.mjs --require-aggregate is run first.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
[ -f dist/index.html ] && [ -f dist/CNAME ] || { echo "dist/ is missing: run npm run build first" >&2; exit 1; }
node scripts/publish-guard.mjs --require-aggregate
WT="$ROOT/../wt-ghpages"
git fetch -q origin gh-pages
if [ ! -d "$WT" ]; then git worktree add -q "$WT" -B gh-pages origin/gh-pages; fi
cd "$WT"
git checkout -q gh-pages && git reset -q --hard origin/gh-pages
git rm -r -q . 2>/dev/null || true
cp -R "$ROOT/dist/." .
git add -A
git commit -q -m "build $(date -u +%Y-%m-%dT%H:%MZ) from main $(git -C "$ROOT" rev-parse --short main) (aggregate mode)" || { echo "nothing to publish"; exit 0; }
git push origin gh-pages
echo "published: https://omary.me/ar/ (GitHub Pages builds in ~1 minute)"
