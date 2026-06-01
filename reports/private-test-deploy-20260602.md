# Private Test Deploy - 2026-06-02

STATUS: PRIVATE_TEST_DEPLOY_PASS

Scope:
- Company/homepage project only.
- Private operating-test deployment only.
- Public production operation is not approved.

Deployed source commit:
- Site/content commit: `65e319d73f26d780f9f717d93fd188ae25ba9616`
- Commit summary: `Add recipe helper private test cycle`

Remote branch state:
- `origin/main`: `65e319d73f26d780f9f717d93fd188ae25ba9616`
- `tsst/main`: `65e319d73f26d780f9f717d93fd188ae25ba9616`

Pre-deploy verification:
- `.\node_modules\.bin\playwright.cmd test -g "recipe helper" --reporter=line`
  - Result: 2 passed.
- `.\node_modules\.bin\playwright.cmd test -g "roadmap step 4 mobile UI" --reporter=line`
  - Result: 7 passed.
- Note: global `playwright` was not on PATH, so the local `node_modules` binary was used.

Deployment action:
- Pushed `main` to `origin`.
- Pushed `main` to `tsst`.

Remote technical-preview verification:
- `https://tsst-csa.pages.dev/mom`
  - HTTP 200.
  - Contains `fridge-time`: yes.
  - Contains `fridge-shopping-gaps`: yes.
  - Result: Cloudflare technical preview is serving the deployed recipe-helper change.
- `https://seyongjang2-sketch.github.io/tsst/mom`
  - HTTP 200.
  - Contains `fridge-time`: no.
  - Contains `fridge-shopping-gaps`: no.
  - Result: GitHub Pages preview is still serving an older version and must not be used as current deployment evidence.

Evidence files:
- `reports/recipe-helper-cycle-qa-20260602.md`
- `reports/screenshots/recipe-helper-cycle-20260602/deploy-20260602-recipe-mobile-390-input.png`
- `reports/screenshots/recipe-helper-cycle-20260602/deploy-20260602-recipe-mobile-390.png`
- `reports/screenshots/recipe-helper-cycle-20260602/deploy-20260602-recipe-mobile-390-result-bottom.png`
- `reports/screenshots/recipe-helper-cycle-20260602/deploy-20260602-recipe-desktop-1366.png`

Gate Status:
- PRIVATE_TEST_DEPLOY_PASS
- CLOUDFLARE_PREVIEW_UPDATED
- ORIGIN_MAIN_UPDATED
- TSST_MAIN_UPDATED
- GITHUB_PAGES_PREVIEW_STALE
- PUBLIC_OPERATION_NOT_APPROVED
