# FamilySpace Daily Operating Sequence

## Purpose

FamilySpace must operate like a real service during private test. The homepage should show that the company is running a repeatable daily loop, not only publishing static pages.

## Daily Sequence

| Time | Step | Owner | Output |
| --- | --- | --- | --- |
| 09:00 | 생활 신호 수집 | idea team | 오늘 필요한 식단, 서류, 육아, 가족 일정 이슈 후보 |
| 10:30 | 편집 회의와 우선순위 확정 | general manager | 오늘 반영할 3개 항목과 보류 항목 |
| 13:00 | 페이지 반영 | web admin | HTML, 이미지, 내부 링크 업데이트 |
| 16:00 | 모바일 QA와 정책 점검 | qa reviewer | 화면, 링크, 이미지, 개인정보/광고/제휴 문구 검증 |
| 18:00 | 운영 보고와 다음 액션 | content editor | 프로젝트 로그, Telegram 보고, 다음 작업 |

## Completion Rule

A daily operation is complete only when all of these are true:

1. The changed page works on mobile and desktop.
2. Internal links and image paths are valid.
3. Risky visa, medical, finance, privacy, advertising, or affiliate claims are either verified or held.
4. The decision and verification result are recorded in `agents/project_log.md`.
5. The same result is reported to the project Telegram room.

## Continuous Autonomous Loop

For unattended private-test operation, run the local worker instead of relying
on the browser console alone:

```powershell
python scripts\autonomous_ops_loop.py --cycles 0 --interval-minutes 60 --playwright --allow-agent-edits --allow-deploy --room personal_dm
```

The loop does this sequence:

1. Audit HTML parsing, local static paths, git whitespace, remote preview health, and the Playwright operating-console flow.
2. If a check fails and `--allow-agent-edits` is set, launch Codex CLI inside this project only to fix the issue.
3. Verify again after the fix.
4. If verification passes, commit and push only when the cycle produced new deployable source changes.
5. Send start, progress, and per-cycle result reports to Telegram. Write `agents/project_log.md` entries for failures, fixes, deployable changes, or clean cycles only when `--log-clean-cycles` is explicitly set.

Step 5 deployment-gate additions:

- CTA navigation: the Playwright gate clicks or resolves the main floor links and primary customer CTAs on local pages and blocks the cycle if any intended page returns an error or lands on the wrong route.
- Shared navigation structure: the index page and room pages must expose the same `ul.nav-links` floor order. The index may keep `fs-links` for its home-specific visual styling, but it must not drift into a separate navigation contract.
- Content role separation: each room page must keep its own role headline and secondary purpose text without duplicating another room's defining copy.
- Missed-QA prevention: when QA misses duplicate UI, navigation drift, mobile breakage, deployment drift, stale dates, or risk wording, the cause must be logged, the employee-facing countermeasure must be shared, the checklist or automated gate must be updated, and the next QA run must recheck that exact missed item.
- Trend-purpose filter: every trend-driven change must pass the homepage purpose statement before it reaches public copy. The change must help Korean-Vietnamese family life in Vietnam, map to a named room/page owner, avoid unsupported legal/medical/finance claims, and stay inside the private-test approval boundary until explicitly approved.
- External reference sample: the gate keeps checking a representative set of external reference links, allowing for occasional bot blocking but requiring enough reachable references to prove the link set is alive.
- Screenshot evidence manifest: every Playwright operating-gate run writes screenshots under `reports/screenshots/autonomous/<stamp>/` and records `manifest.json` beside them so evidence can be traced without committing repeated run artifacts.

Safety rules:

- The worker is scoped to the company/homepage project only.
- It must not touch video or game work.
- Public operation approval is still separate from private-test deployment.
- Pre-existing dirty files are not staged by automatic deploy; the loop only commits deployable files created or changed by its own cycle.
- Repeated Playwright evidence is written under ignored run-stamped paths so a clean monitoring cycle does not rewrite tracked screenshot files.
- `test-results/` is ignored local runner output and must not be treated as a deployable site change.
- Failed checks are reported as blocked instead of being hidden.

## Homepage Representation

The homepage includes a public-facing operating board with:

- Current private-test operating mode.
- Time-based daily sequence.
- Team ownership for each step.
- Today's operation queue.
- Completion criteria.
- A test-operation console that advances through the daily sequence, highlights the current owner, updates the queue, and writes an on-page execution log.

This section is not a public launch claim. It is an operating-test signal that shows how FamilySpace will run once public operation is approved.
