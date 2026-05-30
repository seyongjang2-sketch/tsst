# FamilySpace Deployment / Test Operation Canon

Last updated: 2026-05-30 22:18 Asia/Bangkok

## Current Operating Status

- Status: private operating test page.
- Public production status: not approved.
- Reason: the site is being used to test operating discipline, update procedures, QA, and reporting. It must not be treated as a public service until the owner explicitly approves public operation.

Any existing Cloudflare or GitHub Pages URL is only a technical preview/check target. It is not production evidence and must not be reported as public launch approval.

## Known Technical Preview Targets

These routes can be checked only to confirm what a remote static host currently serves:

- `https://tsst-csa.pages.dev/`
- `https://tsst-csa.pages.dev/mom`
- `https://seyongjang2-sketch.github.io/tsst/`
- `https://test.tsst-csa.pages.dev/`

They must not be described as approved public production unless a later dated owner decision explicitly changes this file.

## Not Public Operation

These are not proof of public operation:

- `https://seyongjang2-sketch.github.io/tsst/`
  - This has shown an old version and is not an approved operating site.
- `https://test.tsst-csa.pages.dev/`
  - This currently returns 404 and is not a working preview target.
- `https://tsst-csa.pages.dev/`
  - This may serve current files, but it is still only a test/preview endpoint until public operation is approved.
- Localhost or opened HTML files
  - These are development checks only.

## Completion Rule

A homepage task is not complete until the requested change is checked in the intended test surface and the result is logged. Completion means "test update completed", not "public operation approved".

Required completion evidence:

1. `git status --short` is clean, or any remaining changes are explicitly explained.
2. `origin/main` points to the intended commit.
3. If the `tsst` remote is still maintained, its intended branch state is explicitly stated.
4. Local and/or remote test URL verification is recorded with the exact route checked.
5. The verification result is written to `agents/project_log.md`.
6. A Telegram result report is sent with the verified commit and the test status.
7. The report must not call the site "production", "public launch", or "approved public operation" without explicit owner approval.

## Current Verification

The following entries are historical technical checks. They are retained for traceability but are superseded by the private-test operating status above.

Checked on 2026-05-30 20:56 Asia/Bangkok, before publishing this deployment-canon document:

- `origin/main`: `1eefe5438f59338bb46d59237174c3c508ebbb80`
- `origin/test`: `1eefe5438f59338bb46d59237174c3c508ebbb80`
- `tsst/main`: `1eefe5438f59338bb46d59237174c3c508ebbb80`
- `https://tsst-csa.pages.dev/mom.html` redirects to `/mom` and returns HTTP 200.
- `/mom` includes `daily-meal-table`.
- `/mom` includes `recipe-bulgogi-rice-paper-rolls.png`.
- `https://tsst-csa.pages.dev/images/recipe-bulgogi-rice-paper-rolls.png` returns HTTP 200 `image/png`.

Checked again on 2026-05-30 20:58 Asia/Bangkok:

- `https://tsst-csa.pages.dev/DEPLOYMENT.md` returns HTTP 200 `text/markdown`.
- `https://tsst-csa.pages.dev/README.md` returns HTTP 200 `text/markdown`.
- `DEPLOYMENT.md` includes `FamilySpace Deployment Canon` on the public Cloudflare URL.
- `README.md` includes `Production Deployment` on the public Cloudflare URL.

## If Test Deployment Is Blocked

Do not report the task as complete. Report it as blocked and include:

- intended commit
- target test URL
- failing command or HTTP response
- missing permission or token
- next required action

If direct Cloudflare deployment is needed, the environment must provide `CLOUDFLARE_API_TOKEN` or an authenticated `wrangler login` session.
