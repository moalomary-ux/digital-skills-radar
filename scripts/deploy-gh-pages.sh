#!/usr/bin/env bash
# Publish the current production build to the gh-pages branch (GitHub Pages, custom domain radar.omary.me).
# Usage: VITE_DATA_MODE=full npm run build && scripts/deploy-gh-pages.sh   (owner decision 2026-10-22: the public site is the full build)
#        PUBLISH_MODE=aggregate scripts/deploy-gh-pages.sh                   (aggregates-only build; the guard then requires it)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
[ -f dist/index.html ] && [ -f dist/CNAME ] || { echo "dist/ is missing: run npm run build first" >&2; exit 1; }
if [ "${PUBLISH_MODE:-full}" = "aggregate" ]; then node scripts/publish-guard.mjs --require-aggregate; else node scripts/publish-guard.mjs; fi
WT="$ROOT/../wt-ghpages"
git fetch -q origin gh-pages
if [ ! -d "$WT" ]; then git worktree add -q "$WT" -B gh-pages origin/gh-pages; fi
cd "$WT"
git checkout -q gh-pages && git reset -q --hard origin/gh-pages
git rm -r -q . 2>/dev/null || true
cp -R "$ROOT/dist/." .
git add -A
git commit -q -m "build $(date -u +%Y-%m-%dT%H:%MZ) from main $(git -C "$ROOT" rev-parse --short main) (${PUBLISH_MODE:-full} mode)" || { echo "nothing to publish"; exit 0; }
git push origin gh-pages
cd "$ROOT" && node scripts/build-gov-data.mjs >/dev/null   # restore the committed (aggregate) public/data tree
echo "published: https://radar.omary.me/ar/ (GitHub Pages builds in ~1 minute)"
