# FamilySpace Deployment Canon

Last updated: 2026-05-30

## Canonical Production Target

- Production URL: `https://tsst-csa.pages.dev/`
- Mom page public route: `https://tsst-csa.pages.dev/mom`
- Repository used for production source: `https://github.com/seyongjang2-sketch/woori-company.git`
- Production branch: `main`
- Current verified commit: `1eefe5438f59338bb46d59237174c3c508ebbb80`

Cloudflare Pages is the only production deployment target for this project unless a later dated entry in this file explicitly replaces it.

## Not Production

These routes must not be used as proof of production deployment:

- `https://seyongjang2-sketch.github.io/tsst/`
  - This has shown an old version and is not the operating site.
- `https://test.tsst-csa.pages.dev/`
  - This currently returns 404 and is not a working preview target.
- Localhost or opened HTML files
  - These are development checks only.

## Deployment Rule

A task is not complete until the production Cloudflare URL is checked after push/deploy.

Required completion evidence:

1. `git status --short` is clean, or any remaining changes are explicitly explained.
2. `origin/main` points to the intended commit.
3. If the `tsst` remote is still maintained, `tsst/main` points to the same intended commit.
4. `https://tsst-csa.pages.dev/` or the changed page route returns the latest content.
5. The verification result is written to `agents/project_log.md`.
6. A Telegram result report is sent with the public URL and verified commit.

## Current Verification

Checked on 2026-05-30 20:56 Asia/Bangkok:

- `origin/main`: `1eefe5438f59338bb46d59237174c3c508ebbb80`
- `origin/test`: `1eefe5438f59338bb46d59237174c3c508ebbb80`
- `tsst/main`: `1eefe5438f59338bb46d59237174c3c508ebbb80`
- `https://tsst-csa.pages.dev/mom.html` redirects to `/mom` and returns HTTP 200.
- `/mom` includes `daily-meal-table`.
- `/mom` includes `recipe-bulgogi-rice-paper-rolls.png`.
- `https://tsst-csa.pages.dev/images/recipe-bulgogi-rice-paper-rolls.png` returns HTTP 200 `image/png`.

## If Deployment Is Blocked

Do not report the task as complete. Report it as blocked and include:

- intended commit
- target URL
- failing command or HTTP response
- missing permission or token
- next required action

If direct Cloudflare deployment is needed, the environment must provide `CLOUDFLARE_API_TOKEN` or an authenticated `wrangler login` session.
