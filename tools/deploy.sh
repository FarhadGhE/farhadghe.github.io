#!/usr/bin/env bash
#
# Puts the built site (dist/) on the gh-pages branch, which GitHub Pages serves at fargh.com. Runs only in the
# workflow (.github/workflows/pages-deploy.yml), after `npm run build` and `npm run check`. gh-pages is replaced by
# one fresh commit each time; its history is not kept, as before.

set -euo pipefail

if [[ -z ${GITHUB_ACTIONS+x} ]]; then
  echo "ERROR: deploy.sh runs only in GitHub Actions." >&2
  exit 1
fi

[[ -f dist/index.html ]] || { echo "ERROR: no dist/index.html; run npm run build first." >&2; exit 1; }

# The custom domain, and no Jekyll pass: Pages would otherwise drop folders starting with "_" (Astro's _astro/).
cp CNAME dist/CNAME
touch dist/.nojekyll

cd dist
git init -q -b gh-pages
git config user.name "GitHub Actions"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -A
git commit -q -m "Publish ${GITHUB_SHA:0:7} (run ${GITHUB_RUN_NUMBER})"
git push -q --force "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" gh-pages
echo "Published ${GITHUB_SHA:0:7} to gh-pages."
