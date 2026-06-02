# Deployment Surface Reconcile - 2026-06-02

STATUS: DEPLOYMENT_SURFACE_RECONCILE_HOLD

Scope:
- Company/homepage project only.
- Private operating-test verification only.
- Public production operation is not approved.

Action taken:
- Aligned `tsst/main` with local `main` / `origin/main`.
- Verified remote repository branch state after push.
- Rechecked Cloudflare Pages, GitHub Pages, and raw GitHub content for the recipe-helper markers.

Branch state after alignment:
- `HEAD`: `930fdb5d3face9ab44b8ba21f6e457f0ad28ec44`
- `origin/main`: `930fdb5d3face9ab44b8ba21f6e457f0ad28ec44`
- `tsst/main`: `930fdb5d3face9ab44b8ba21f6e457f0ad28ec44`

Remote content checks:
- `https://tsst-csa.pages.dev/mom`
  - HTTP 200.
  - Contains `fridge-time`: yes.
  - Contains `fridge-shopping-gaps`: yes.
  - Contains `냉장고를 부탁해`: yes.
  - Status: current private-test technical preview.
- `https://raw.githubusercontent.com/seyongjang2-sketch/tsst/main/mom.html`
  - HTTP 200.
  - Contains `fridge-time`: yes.
  - Contains `fridge-shopping-gaps`: yes.
  - Contains `냉장고를 부탁해`: yes.
  - Status: repository source is current.
- `https://seyongjang2-sketch.github.io/tsst/mom`
  - HTTP 200.
  - Contains `fridge-time`: no.
  - Contains `fridge-shopping-gaps`: no.
  - Contains `냉장고를 부탁해`: no.
  - Status: stale GitHub Pages surface.
- `https://seyongjang2-sketch.github.io/tsst/mom.html`
  - HTTP 200.
  - Contains `fridge-time`: no.
  - Contains `fridge-shopping-gaps`: no.
  - Contains `냉장고를 부탁해`: no.
  - Status: stale GitHub Pages surface.
- `https://seyongjang2-sketch.github.io/tsst/DEPLOYMENT.md`
  - HTTP 404.
  - Status: GitHub Pages is not serving the current repository root.

Diagnosis:
- `tsst/main` and raw GitHub source are current after the push.
- Cloudflare Pages serves the current recipe-helper private-test change.
- GitHub Pages still serves old homepage files even after `tsst/main` was aligned.
- The served GitHub Pages file sizes match the old `tsst/backup-before-familyspace-20260530` era more closely than current `tsst/main`, so the likely cause is GitHub Pages source/branch configuration or an old Pages build source, not missing source code in `main`.

Decision:
- Do not overwrite `backup-before-familyspace-20260530` or force-push a backup branch without explicit owner approval.
- Treat `https://tsst-csa.pages.dev/` as the current technical private-test preview.
- Treat `https://seyongjang2-sketch.github.io/tsst/` as stale/hold until GitHub Pages settings are corrected or the URL is intentionally retired.

Next required action:
1. If GitHub Pages must remain maintained, open repository Pages settings for `seyongjang2-sketch/tsst` and set the source to the intended current branch/path, or approve replacing the stale Pages source branch.
2. If GitHub Pages is not needed, remove it from active preview references and keep Cloudflare Pages as the single private-test technical preview.
3. Continue the next feature proof cycle only against the current preview surface unless the owner explicitly asks to repair GitHub Pages first.

Gate Status:
- DEPLOYMENT_SURFACE_RECONCILE_HOLD
- TST_MAIN_ALIGNED_WITH_ORIGIN_MAIN
- CLOUDFLARE_PREVIEW_CURRENT
- RAW_GITHUB_TST_MAIN_CURRENT
- GITHUB_PAGES_STALE_SOURCE
- PUBLIC_OPERATION_NOT_APPROVED
