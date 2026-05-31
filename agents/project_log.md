# FamilySpace 프로젝트 로그

이 파일은 프로젝트 현황을 파악하기 위한 단일 운영 로그다. 최신 항목이 위에 오며, 세부 규칙은 `agents/logging_protocol.md`를 따른다.

## 2026-05-31 07:38 - Homepage operating sequence remote verification
- Type: qa
- Owner: qa_reviewer
- Status: done
- Summary: Verified the operating sequence update after pushing commit c95381ccb56d16f284201db9b49af90063631b70 to origin/main, origin/test, and tsst/main.
- Files: index.html,agents/daily_operating_sequence.md,reports/screenshots/index-operating-sequence-desktop-20260531.png,reports/screenshots/index-operating-sequence-mobile-20260531.png,agents/project_log.md
- Validation: git ls-remote origin main/test and tsst main all returned c95381ccb56d16f284201db9b49af90063631b70; https://tsst-csa.pages.dev/?check=operating-sequence-20260531b returned HTTP 200 and included the operating sequence text
- Decisions: Report as private test update completed, not public production approval.
- Risks: TELEGRAM_PROJECT_POLICY.md has a pre-existing unrelated local modification and was not included in this commit.
- Next: If the owner approves public operation later, replace private-test status copy with approved public-operation copy.

## 2026-05-31 07:37 - Homepage operating sequence
- Type: design
- Owner: web_admin
- Status: done
- Summary: Added a homepage operating board that presents FamilySpace as a private-test service with a daily production sequence, owners, queue, metrics, and completion criteria.
- Files: index.html,agents/daily_operating_sequence.md,reports/screenshots/index-operating-sequence-desktop-20260531.png,reports/screenshots/index-operating-sequence-mobile-20260531.png
- Validation: HTTP 200 for http://127.0.0.1:8000/index.html; static href/src targets exist excluding JS templates; git diff --check; Playwright desktop/mobile screenshots
- Decisions: Show real operation as a daily loop: collect signals, editorial priority, page update, mobile/policy QA, and reporting. Keep the visible status as private test, not public production approval.
- Risks: Cloudflare public operation is still not approved; this is a test-operation signal only.
- Next: Use this operating board as the homepage control surface before adding automated daily data feeds.

## 2026-05-31 06:31 - Private test deployment 53fbc66
- Type: technical
- Owner: web_admin
- Status: done
- Summary: Pushed pending Mom fridge chef recipe generator and Stars mobile planet modal clipping fix updates to origin/main, origin/test, and tsst/main for private-test verification.
- Files: mom.html,stars.html,agents/project_log.md,reports/screenshots/mom-fridge-chef-mobile-390x720.png,reports/screenshots/stars-mobile-planet-modal-390x568.png
- Validation: git diff --check passed; mom.html and stars.html parsed with Python html.parser; git push succeeded for origin/main, origin/test, and tsst/main at 53fbc66 before this deployment-log commit.
- Decisions: Keep this as private technical preview/test deployment only; no public-operation approval is implied.
- Risks: Cloudflare preview propagation can lag briefly after Git push.
- Next: Verify the final remote preview routes and keep private-test wording in reports.

## 2026-05-31 06:20 - Mom fridge chef recipe generator
- Type: feature
- Owner: web_admin
- Status: done
- Summary: Replaced the "오늘 뭐 먹지? 요리 룰렛" card on mom.html with a "냉장고를 부탁해" ingredient-input recipe generator for leftover ingredients.
- Files: mom.html,reports/screenshots/mom-fridge-chef-mobile-390x720.png
- Validation: Local mobile Playwright screenshot captured at 390x720 after entering ingredients and generating a recipe.
- Decisions: Use direct ingredient input, quick ingredient chips, removable selected ingredients, generated cooking steps, and YouTube recipe search tied to the generated recipe title.
- Risks: Recipe generation is template-based and local to the page; it is not connected to an external AI or nutrition database.
- Next: Include this update in the next private test deploy/push batch.

## 2026-05-31 06:09 - stars mobile planet modal clipping fix
- Type: bugfix
- Owner: web_admin
- Status: done
- Summary: Fixed the mobile planet description modal on stars.html so it no longer opens partly outside the viewport or under the fixed navbar.
- Files: stars.html,reports/screenshots/stars-mobile-planet-modal-390x568.png
- Validation: Local Playwright runtime check at 390x568 passed with modal top 6, bottom 562, close button bottom 433 inside a 568px viewport; screenshot captured.
- Decisions: Keep desktop modal animation; replace mobile modal animation with opacity-only fade and raise modal z-index above the fixed navbar.
- Risks: none
- Next: Include this fix in the next deploy/push batch.

## 2026-05-31 06:04 - Private test deployment 4cabb52
- Type: technical
- Owner: web_admin
- Status: done
- Summary: Pushed the latest FamilySpace private-test updates, including stars mobile stargazing usability, shopping quick compare links, and private test operation wording, to origin/main, origin/test, and tsst/main.
- Files: stars.html,style.css,mom.html,blog.html,DEPLOYMENT.md,README.md,agents/project_log.md,reports/screenshots/stars-mobile-usability-20260531.png,reports/screenshots/stars-desktop-usability-20260531.png
- Validation: git diff --check passed; local stars.html HTTP 200; git ls-remote origin main/test and tsst main at 4cabb523075f701ae2e5cad2c9c285bee702fc44; Cloudflare preview /stars includes roof-mobile-toggle and is-collapsed; /mom and /blog include new shopping links; /DEPLOYMENT.md includes private operating test wording.
- Decisions: none
- Risks: none
- Next: Treat https://tsst-csa.pages.dev/ as technical preview only until explicit public-operation approval.

## 2026-05-31 06:00 - stars mobile stargazing usability
- Type: design
- Owner: web_admin
- Status: done
- Summary: Adjusted stars.html mobile layout so the 3D stargazing area is usable: mobile mission panel starts collapsed at the bottom, search sits below the compact nav, mobile auth link is hidden, and star info modal is resized for small screens.
- Files: stars.html,reports/screenshots/stars-mobile-usability-20260531.png,reports/screenshots/stars-desktop-usability-20260531.png
- Validation: Local HTTP 200; Playwright desktop/mobile screenshots captured after change.
- Decisions: Keep desktop cockpit layout unchanged; on mobile prioritize direct star tapping and make the rooftop mission expandable instead of always covering the canvas.
- Risks: External Three.js CDN is still required for the 3D scene; no production deploy was run in this task.
- Next: Deploy updated stars.html when ready.

## 2026-05-30 22:42 - Shopping quick compare links filled
- Type: content
- Owner: web_admin
- Status: done
- Summary: Expanded Mom room shopping quick compare with official WinMart, Lotte Mart Vietnam, and K-Market links, and filled the blog shopping memo with link-specific purchase guidance.
- Files: mom.html,blog.html,style.css
- Validation: External GET checks returned HTTP 200 for all three official links; mom.html and blog.html parsed with Python html.parser; blog.html#shopping anchor exists.
- Decisions: none
- Risks: none
- Next: Review mobile visual spacing during the next full page QA pass.

## 2026-05-30 22:21 - Homepage private operating-test policy
- Type: decision
- Owner: general_manager
- Status: done
- Summary: Reclassified the homepage as a private operating-test page rather than an approved public production site, following the owner correction.
- Files: README.md,DEPLOYMENT.md,agents/homepage_management_guidelines.md
- Validation: rg Production README.md DEPLOYMENT.md agents/homepage_management_guidelines.md; git diff --check
- Decisions: Cloudflare/GitHub Pages URLs are technical preview/check targets only. Completion reports must say test update/verification, not production or public launch, unless the owner explicitly approves public operation later.
- Risks: Existing historical reports still contain older public-production language and should be treated as superseded by this later dated policy.
- Next: Use private-test wording for future homepage work and require explicit owner approval before any public operation claim.

## 2026-05-30 21:59 - daily update proof expanded to remaining pages
- Type: qa
- Owner: web_admin
- Status: done
- Summary: Added visible daily update proof sections to Baby, Family Lounge, and Rooftop pages with 2026-05-30 21:55 ICT timestamps, concrete daily operating items, and image evidence. Added a critique report that states remaining operating weaknesses.
- Files: baby.html,blog.html,stars.html,reports/homepage-daily-update-critique-20260530.md,reports/screenshots/baby-daily-proof-desktop-20260530.png,reports/screenshots/baby-daily-proof-mobile-20260530.png,reports/screenshots/family-daily-proof-desktop-20260530.png,reports/screenshots/family-daily-proof-mobile-20260530.png,reports/screenshots/roof-daily-proof-desktop-20260530.png,reports/screenshots/roof-daily-proof-mobile-20260530.png
- Validation: Local HTTP 200 for baby/blog/stars with 2026-05-30 21:55 marker; internal href/src/hash audit passed; local image URLs returned HTTP 200 image/png; Playwright desktop/mobile screenshots captured; pushed commit ed5f095 to origin/main, origin/test, and tsst/main; Cloudflare public /baby, /blog, /stars returned HTTP 200 with the new date marker and daily proof ids; public critique report returned HTTP 200.
- Decisions: Daily update claims now apply to Baby/Family/Rooftop only when visible timestamp, concrete items, and image evidence are present. This is still a manual patch, not a true automated daily operating system.
- Risks: Static daily text will become stale after 2026-05-30 unless the next update changes or downgrades the label; Baby/Family/Rooftop image evidence is weaker than Mom/Dad real-photo proof; Family Firebase live data can still fail separately from static proof cards.
- Next: Build a shared daily-updates data source and stale-date guard so pages cannot keep saying daily updated after the date expires.

## 2026-05-30 20:59 - Cloudflare deployment canon public verification
- Type: qa
- Owner: operations_lead
- Status: done
- Summary: Verified the deployment canon and README are publicly available through Cloudflare Pages after push.
- Files: DEPLOYMENT.md,README.md,agents/project_log.md
- Validation: https://tsst-csa.pages.dev/DEPLOYMENT.md returned HTTP 200 text/markdown and contained FamilySpace Deployment Canon; https://tsst-csa.pages.dev/README.md returned HTTP 200 text/markdown and contained Production Deployment.
- Decisions: Keep deployment evidence in both project log and publicly served deployment canon.
- Risks: Cloudflare may take a short delay after future pushes, so public URL verification must be repeated after each deployment.
- Next: Push this verification entry and recheck DEPLOYMENT.md on Cloudflare.

## 2026-05-30 20:57 - Canonical Cloudflare deployment target fixed
- Type: decision
- Owner: operations_lead
- Status: done
- Summary: Fixed Cloudflare Pages as the only production deployment target and recorded current public URL verification so future work does not confuse old GitHub Pages or broken test preview with production.
- Files: DEPLOYMENT.md,README.md,agents/homepage_management_guidelines.md
- Validation: curl -L https://tsst-csa.pages.dev/mom.html returned HTTP 200 after /mom redirect and contained daily-meal-table plus recipe-bulgogi-rice-paper-rolls.png; image URL returned HTTP 200 image/png; git ls-remote showed origin/main, origin/test, and tsst/main at 1eefe5438f59338bb46d59237174c3c508ebbb80.
- Decisions: Production target is https://tsst-csa.pages.dev/ on origin/main. GitHub Pages and test.tsst-csa.pages.dev are not production evidence.
- Risks: Direct Cloudflare deployment still requires CLOUDFLARE_API_TOKEN or authenticated wrangler if the Git integration fails.
- Next: Every future completion report must include Cloudflare public URL verification and the verified commit.

## 2026-05-30 20:55 - Public deployment visibility fix
- Type: deployment
- Owner: web_admin
- Status: done
- Summary: Committed and pushed the missing homepage changes so the public Cloudflare URL now serves the updated Mom recipe section with the new bulgogi rice-paper-roll image.
- Files: mom.html,images/recipe-bulgogi-rice-paper-rolls.png,agents/homepage_management_guidelines.md,reports/homepage-management-audit-20260530.md,reports/homepage-party-meeting-20260530.md,reports/recipe-main-desktop.png,reports/recipe-main-desktop-anchor.png,reports/recipe-main-mobile-anchor.png,agents/project_log.md
- Validation: local mom.html HTTP 200; local recipe image HTTP 200; internal href/src audit passed; pushed commit 61606a5 to origin/main, origin/test, and tsst/main; Cloudflare public URL `https://tsst-csa.pages.dev/mom.html?check=61606a5` contains `recipe-bulgogi-rice-paper-rolls.png` and `daily-meal-table`; Cloudflare image URL returns HTTP 200 image/png length 2329198.
- Decisions: Treat `https://tsst-csa.pages.dev/` as the currently working public URL for this deployment confirmation.
- Risks: `https://test.tsst-csa.pages.dev/` still returns 404, and GitHub Pages `https://seyongjang2-sketch.github.io/tsst/` still serves an older page without the recipe image. Do not use those URLs as completion proof until fixed.
- Next: Fix or retire the stale GitHub Pages path and Cloudflare test preview path so there is only one accepted public deployment target.

## 2026-05-30 20:37 - Homepage management audit and operating guideline
- Type: qa
- Owner: general_manager
- Status: done
- Summary: Investigated repeated homepage management failures. Local HTTP and internal link/image audits pass, but deployment ownership is split across origin, tsst, Cloudflare Pages, and GitHub Pages. Added a written audit report and homepage management guideline with mandatory acceptance criteria, public URL checks, and blocker reporting.
- Files: reports/homepage-management-audit-20260530.md,agents/homepage_management_guidelines.md,agents/project_log.md
- Validation: git status --short; local HTTP 200 checks; internal href/src/hash audit; public URL branch/version checks
- Decisions: Treat the issue as a management/process failure, not an individual staff-only failure. Completion requires local QA and final public URL verification.
- Risks: Cloudflare deployment source/branch and GitHub Pages stale output remain unresolved until the final production URL and branch are fixed.
- Next: Assign owner and due date for Cloudflare branch/source correction, test preview 404, and GitHub Pages stale-site cleanup.

## 2026-05-30 20:14 - Test branch deploy path correction
- Type: technical
- Owner: web_admin
- Status: blocked
- Summary: Corrected deployment source path to C:\\Users\\Admin\\Documents\\우리회사, not C:\\Users\\Admin\\tsst. Pushed current commit ccd0054 to origin/test for test deployment trigger. Cloudflare branch preview https://test.tsst-csa.pages.dev/ still returns 404 and direct wrangler Pages deploy with --branch test is blocked by missing CLOUDFLARE_API_TOKEN.
- Files: agents/project_log.md
- Validation: static href/src audit passed; git ls-remote shows main/test at ccd0054; wrangler pages deploy blocked by missing token
- Decisions: none
- Risks: none
- Next: Provide CLOUDFLARE_API_TOKEN or enable Cloudflare Pages branch deployment for origin/test, then rerun npx wrangler@3 pages deploy . --project-name tsst-csa --branch test --commit-dirty=true

## 2026-05-30 18:45 - Cloudflare public deploy blocked after GitHub push
- Type: technical
- Owner: web_admin
- Status: blocked
- Summary: Pushed latest FamilySpace source to origin/main at e4a05ce, but https://tsst-csa.pages.dev/ still serves the previous HTML with 1F labels and without the daily meal card. Direct wrangler Pages deploy failed because CLOUDFLARE_API_TOKEN is not configured in this non-interactive environment.
- Files: index.html,style.css,mom.html,agents/project_log.md
- Validation: git push origin main succeeded; local HTTP/link checks passed; public URL checks still return old HTML; wrangler pages deploy reports missing CLOUDFLARE_API_TOKEN
- Decisions: none
- Risks: none
- Next: Provide a Cloudflare API token/account access or fix the Pages Git source/build setting, then run: npx wrangler@3 pages deploy . --project-name tsst-csa --commit-dirty=true

## 2026-05-30 18:43 - Deploy floor navigation and daily meal update
- Type: technical
- Owner: web_admin
- Status: done
- Summary: Prepared latest FamilySpace changes for deployment: unified the main navigation into 1층~옥상 labels and connected Mom meal links to the new daily meal card with recipe content.
- Files: index.html,style.css,mom.html,about.html,baby.html,blog.html,contact.html,dad.html,privacy.html,stars.html,terms.html,guides
- Validation: Local HTTP 200 checks for main pages and guides; internal href/src/hash audit passed
- Decisions: none
- Risks: none
- Next: Push main and verify the public Pages URL returns the updated navigation and meal section.

## 2026-05-30 17:35 - Cloudflare Pages latest deployment attempt
- Type: technical
- Owner: web_admin
- Status: blocked
- Summary: Confirmed local and GitHub main are on latest FamilySpace site, but https://tsst-csa.pages.dev/ still serves the old 6.5KB page after redeploy trigger commit 8355539. Direct wrangler deploy is blocked because CLOUDFLARE_API_TOKEN is not configured.
- Files: index.html,assets,images,guides
- Validation: Invoke-WebRequest URL checks; git push origin main; wrangler@3 deploy attempt
- Decisions: none
- Risks: none
- Next: Provide Cloudflare API token or update Pages project source/build settings in Cloudflare dashboard, then run wrangler pages deploy from the prepared latest static site.

## 2026-05-30 16:35 - Dad page disconnected navigator cleanup
- Type: technical
- Owner: web_admin
- Status: done
- Summary: Removed the separate in-page Dad category tab navigator from the documents page and guarded the stale `dad-admin-menu` code path so the page no longer carries an unconnected or confusing navigator.
- Files: dad.html,reports/screenshots/dad-navigator-fix-desktop-20260530.png,reports/screenshots/dad-navigator-fix-mobile-20260530.png
- Validation: HTTP 200 for dad.html; static check confirmed zero `.tab-menu-horizontal`/`.tab-btn` DOM elements and no `#dad-admin-menu` DOM; Playwright desktop/mobile screenshots reviewed.
- Decisions: Keep only the shared site navbar on the documents page. The old internal category navigator has no reason to exist on the documents surface.
- Risks: Existing Dad card rendering still initializes the finance card set by default until the broader Dad content model is simplified.
- Next: If the Dad page is narrowed further, replace the remaining legacy Dad Lounge card set with document/TRC/family-operations content only.

## 2026-05-30 15:53 - Full page navigation and link audit
- Type: technical
- Owner: web_admin
- Status: done
- Summary: Audited FamilySpace HTML pages for mismatched internal links, obsolete navigation, and missing href/src targets. Fixed Dad checklist routing, Mom healing anchor routing, privacy/terms navigation consistency, and mobile home nav visibility.
- Files: index.html,mom.html,dad.html,privacy.html,terms.html,reports/screenshots/site-audit-index-desktop-20260530.png,reports/screenshots/site-audit-index-mobile-20260530.png,reports/screenshots/site-audit-privacy-mobile-20260530.png,reports/screenshots/site-audit-mom-mobile-20260530.png
- Validation: PowerShell internal href/src audit: no remaining missing files or broken hashes; HTTP 200 for index,mom,dad,baby,blog,stars,privacy,terms,TRC guide; Playwright desktop/mobile screenshots reviewed.
- Decisions: none
- Risks: none
- Next: Before publish, consider extracting the repeated nav into a shared component or generation step to prevent future drift.

## 2026-05-30 20:50 - 홈페이지 파티별 긴급 운영 회의
- Type: meeting
- Owner: general_manager
- Status: done
- Summary: 사용자 지시에 따라 홈페이지를 파티별로 다시 점검하는 긴급 회의 결과를 문서화했다. 결론은 일부 직원이 로컬/일부 화면은 봤지만 공개 URL 기준으로 최종 홈페이지를 본 것으로 볼 수 없으며, 공개 반영 확인 없이 완료 판단한 운영 실패다.
- Files: reports/homepage-party-meeting-20260530.md,reports/homepage-management-audit-20260530.md,agents/homepage_management_guidelines.md
- Validation: Cloudflare 운영 후보 URL HTTP 200 확인, test preview 404 확인, GitHub Pages 구버전 노출 확인, 최신 레시피 이미지/앵커 공개 미반영 확인
- Decisions: 홈페이지 완료 기준은 공개 URL 반영까지로 고정한다. 공개 URL에서 최신 변경이 보이지 않으면 완료가 아니라 배포 차단으로 보고한다. 모든 작업은 수락 기준, 로컬 검증, 공개 URL 검증, 증거 기록을 거쳐야 한다.
- Risks: Cloudflare Pages 연결 저장소/브랜치, test preview 404, GitHub Pages 구버전 노출, Cloudflare 직접 배포 권한 문제가 아직 남아 있다.
- Next: 최종 공개 URL/브랜치/저장소를 확정하고, 권한 차단이 있으면 승인 요청을 유지한 상태로 배포 담당자가 해결한다.

## 2026-05-30 21:10 - daily update proof correction
- Type: qa/content
- Owner: web_admin
- Status: done
- Summary: Corrected the Mom and Dad "daily update" sections so they no longer rely on vague claims. Each section now shows the 2026-05-30 21:10 ICT update time, concrete items changed for today, and image evidence tied to those items.
- Files: mom.html,dad.html,reports/screenshots/mom-daily-proof-desktop-20260530.png,reports/screenshots/mom-daily-proof-mobile-20260530.png,reports/screenshots/dad-daily-proof-desktop-20260530.png,reports/screenshots/dad-daily-proof-mobile-20260530.png
- Validation: rg 2026-05-30 daily proof markers; image src existence check for Mom/Dad; Playwright desktop/mobile screenshots for Mom and Dad daily update sections; Cloudflare public /mom and /dad HTTP 200 include "오늘 실제 반영한 매일 업데이트", "2026-05-30 21:10", and each page proof-grid marker after commit f7259f8.
- Decisions: Any future "daily update" label must include a visible date/time, actual changed content, and visible media proof, otherwise it should not be called daily updated.
- Risks: Remaining pages must not use daily/weekly update claims unless they carry the same visible date, concrete content, and image proof standard.
- Next: Apply this proof standard to future Baby/Family/Roof update sections before labeling them as actively operated.

## 2026-05-30 12:33 - dad weekly kit real photos
- Type: design
- Owner: web_admin
- Status: done
- Summary: Expanded the Dad weekly update board into a customer-facing weekly kit with real-photo cards for budget settlement, visa/TRC checks, comparison material, and weekend operations.
- Files: dad.html,images/dad-real-budget-dong.jpg,images/dad-real-visa-docs.jpg,images/dad-real-comparison-desk.jpg,images/dad-real-weekend-park.jpg,images/PHOTO_SOURCES.md
- Validation: HTTP 200 checks for dad.html and all four Dad real-photo assets; Playwright desktop/mobile screenshots captured at reports/screenshots/dad-weekly-real-photos-desktop.png and reports/screenshots/dad-weekly-real-photos-mobile.png
- Decisions: Use real photos for Dad weekly operations because finance, documents, and weekend planning need practical context more than abstract illustration.
- Risks: Full-page screenshots show the existing fixed navigation overlay behavior during capture, but the Dad weekly kit itself renders with loaded images on desktop and mobile.
- Next: Use the Dad weekly kit as the richer weekly update template before adding new Dad content packs.

## 2026-05-30 12:18 - dad daily weekly update split
- Type: design
- Owner: web_admin
- Status: done
- Summary: Added a Dad page update board that separates daily refresh items from weekly planning and comparison items.
- Files: dad.html
- Validation: rg dad-update-board; local HTTP 200; Playwright screenshots captured at reports/screenshots/dad-daily-weekly-desktop.png and reports/screenshots/dad-daily-weekly-mobile.png
- Decisions: Daily items are exchange rate, spending, document alerts, and family schedule. Weekly items are budget settlement, visa checks, comparison material, and weekend operations.
- Risks: Screenshot QA still needed if the next pass changes surrounding dashboard layout.
- Next: Use the Dad update board as the operating checklist before expanding richer weekly Dad assets.

## 2026-05-30 12:11 - mom weekly kit real photos
- Type: design
- Owner: web_admin
- Status: done
- Summary: Replaced the mom page weekly kit SVG illustrations with real-photo assets for meal planning, market comparison, content work, and mobile/checking context.
- Files: mom.html,images/mom-real-meal-plan.jpg,images/mom-real-market-produce.jpg,images/mom-real-content-work.jpg,images/mom-real-mobile-check.jpg,images/PHOTO_SOURCES.md
- Validation: HTTP 200 checks for mom.html and all four real-photo assets; Playwright desktop/mobile screenshots captured at reports/screenshots/mom-real-photos-desktop.png and reports/screenshots/mom-real-photos-mobile.png
- Decisions: Use real photos for customer-facing food and shopping surfaces because meal and market content needs practical, lived-in credibility more than abstract illustration.
- Risks: Wikimedia rate limiting interrupted two downloads, so the remaining work/check images use Pexels sources with attribution notes.
- Next: Keep food/shopping/customer-facing cards on real photos unless a section specifically needs an explanatory diagram.

## 2026-05-30 12:07 - mom weekly rich update screenshot QA
- Type: qa
- Owner: qa_reviewer
- Status: done
- Summary: Captured desktop and mobile screenshots of the enriched mom weekly kit after ensuring weekly images load eagerly and anchor links leave room below the fixed navigation.
- Files: reports/screenshots/mom-weekly-kit-desktop.png,reports/screenshots/mom-weekly-kit-mobile.png,reports/screenshots/mom-weekly-update-full-desktop.png,reports/screenshots/mom-weekly-update-full-mobile.png
- Validation: local HTTP 200; npx playwright screenshot desktop/mobile; visual review of generated PNGs
- Decisions: Keep weekly visual assets eager-loaded so Telegram/browser screenshots do not show blank lazy image placeholders.
- Risks: None observed in the captured desktop and mobile views.
- Next: Use the weekly kit section as the customer-facing weekly update template.

## 2026-05-30 12:01 - mom weekly rich update
- Type: design
- Owner: web_admin
- Status: done
- Summary: Expanded the mom page weekly update area into a visual customer-facing weekly kit with illustrated cards for meal planning, market comparison, content expansion, and Friday QA.
- Files: mom.html,images/mom-weekly-meal-plan.svg,images/mom-weekly-market-map.svg,images/mom-weekly-content-kit.svg,images/mom-weekly-friday-check.svg
- Validation: rg weekly-feature; local HTTP 200; Playwright screenshot pending
- Decisions: Weekly items should be individual visual cards, not only text rows, so customers can scan, save, and revisit the page.
- Risks: Need final screenshot QA after browser capture completes.
- Next: Attach or share the generated screenshots with the Telegram result report.

## 2026-05-30 11:55 - mom page daily weekly update split
- Type: technical
- Owner: web_admin
- Status: done
- Summary: Added an update board that separates daily mom-page refresh items from weekly planning and comparison items.
- Files: mom.html
- Validation: manual UTF-8 structure check
- Decisions: Daily items are 식단, 장보기, 회복, 육아; weekly items are 7일 식단, 마트 비교, 콘텐츠 확장, 금요일 점검.
- Risks: none
- Next: Mobile visual QA when the next page polish pass starts.

## 2026-05-30 11:51 - Page knowledge injection notes
- Type: content
- Owner: content_editor
- Status: done
- Summary: Created a page-by-page internal knowledge injection note that maps FamilySpace pages to staff personas, practical usage rules, risk checks, and web-confirmed source paths for content, policy, immigration, vaccination, and Vietnam context.
- Files: agents/page_knowledge_injections.md,agents/README.md
- Validation: Get-Content UTF8 page_knowledge_injections; rg page_knowledge_injections agents README.md; web source check
- Decisions: Keep the injection as an internal staff operating note rather than adding long public sections to every page.
- Risks: Visa, medical, finance, privacy, and ad-policy guidance must remain non-legal/non-medical/non-financial advice and be rechecked before publishing public claims.
- Next: Use this note when editing public page copy and run mobile/link QA before publication.

## 2026-05-28 04:09 - Project structure cleanup before first commit
- Type: technical
- Owner: web_admin
- Status: done
- Summary: Moved media-generation helper scripts under scripts/media_generation, excluded archive backups and caches from Git, replaced stale root blueprint with archive backup, and added Git/editor defaults.
- Files: README.md,.gitignore,.editorconfig,.gitattributes,scripts/media_generation,archive/backups/blueprint-lotto.md
- Validation: python -m py_compile scripts; git check-ignore archive; git status
- Decisions: Keep public static HTML files at repository root for simple static hosting; keep reports and agents as tracked project documentation.
- Risks: README was rewritten in UTF-8 to avoid the prior garbled display in PowerShell output.
- Next: Before publishing, run a browser pass over mobile layout and internal links.

## 2026-05-28 03:21 - README FamilySpace alignment
- Type: technical
- Owner: web_admin
- Status: done
- Summary: 루트 README를 ComfyUI 템플릿 설명에서 FamilySpace 운영 기준, 사이트 파일, 조직 문서, 품질 기준 중심 안내로 교체했다.
- Files: README.md
- Validation: Get-Content -Encoding UTF8 README.md; rg stale project keywords in README/blueprint/project_log
- Decisions: 루트 README는 FamilySpace 프로젝트 입구 문서로 두고, 실제 운영 판단은 agents 문서와 project_log를 기준으로 한다.
- Risks: blueprint.md에는 아직 Lotto Number Generator 내용이 남아 있어 다음 정리 대상이다.
- Next: blueprint.md와 남은 오래된 로또/템플릿 참조 정리

## 2026-05-28 03:16 - agent structure validation
- Type: qa
- Owner: qa_reviewer
- Status: done
- Summary: Validated staff profile JSON and project log helper after adding organization/persona/logging files.
- Files: agents/staff_profiles.json, agents/org_chart.md, agents/logging_protocol.md, agents/project_log.md, scripts/project_log.py, agents/org_chart.json
- Validation: python -m json.tool agents\\staff_profiles.json; python -m py_compile scripts\\project_log.py; python scripts\\project_log.py status
- Decisions: org_chart.json now points to staff_profiles.json, org_chart.md, and project_log.md as canonical operating references.
- Risks: README still contains older project setup text outside the agents folder.
- Next: Use project_log.py add for every meaningful future change.

## 2026-05-28 03:15 - 직원 전문지식/페르소나 및 로그 체계 정비
- Type: decision
- Owner: general_manager
- Status: done
- Summary: 전 직원의 전문지식, 페르소나, 산출물 기준, 로그 의무를 `agents/staff_profiles.json`에 구조화했다. 사람이 읽는 조직도는 `agents/org_chart.md`로 분리했다.
- Files: `agents/staff_profiles.json`, `agents/org_chart.md`, `agents/logging_protocol.md`, `agents/project_log.md`, `scripts/project_log.py`
- Validation: JSON 파싱과 로그 스크립트 상태 출력을 확인한다.
- Decisions: 앞으로 프로젝트 맥락 확인은 `agents/project_log.md`를 1차 기준으로 한다.
- Risks: 기존 문서 일부는 오래된 README 내용 또는 과거 작업 맥락이 섞여 있으므로 이후 로그로 정리해야 한다.
- Next: 기존 README와 에이전트 문서를 FamilySpace 기준으로 추가 정리한다.
