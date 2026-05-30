# FamilySpace 프로젝트 로그

이 파일은 프로젝트 현황을 파악하기 위한 단일 운영 로그다. 최신 항목이 위에 오며, 세부 규칙은 `agents/logging_protocol.md`를 따른다.

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
