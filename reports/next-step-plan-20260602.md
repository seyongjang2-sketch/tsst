# Next Step Plan - 2026-06-02

Scope: company/homepage project only.

STATUS: NEXT_STEP_PLAN_READY

Basis reviewed:
- `TELEGRAM_PROJECT_POLICY.md`
- `agents/meetings/homepage-possibility-allstaff-2026-06-02.md`
- `agents/meetings/ops-review-2026-06-02.md`
- `reports/skeptic-homepage-issues-20260602.md`
- `agents/daily_operating_sequence.md`
- `agents/homepage_management_guidelines.md`
- latest `agents/project_log.md`

Current state:
- FamilySpace is a private operating-test homepage.
- Public production operation is not approved.
- Cloudflare deployment authority/source/branch remains unresolved.
- The next cycle must prove one small user-useful behavior with evidence, not expand the whole site.

## Decision

The next step is a small proof cycle focused on one practical use case:

1. Primary candidate: ingredient-input recipe helper, replacing the old "what should we eat today" direction with a practical "refrigerator-style recipe maker."
2. Secondary candidate if recipe scope becomes too large: shopping quick comparison with link-purpose checks.
3. Do not start a broad redesign, monetization setup, or public launch wording in this cycle.

## Acceptance Criteria Before Editing

The next visible change must pass these criteria:

1. The selected feature is useful to a Korean-Vietnamese family in Vietnam and maps to a clear page owner.
2. Mobile 390px view shows the changed area without clipping, overlap, or hidden controls.
3. Desktop view shows the changed area without layout drift from the existing site.
4. Links open and their destination content matches the button or text promise.
5. Any daily/today/update wording has visible proof, or it is rewritten as evergreen wording.

## Execution Sequence

1. Intake lock
- Confirm the next cycle target as `recipe-helper` unless the owner overrides it.
- Record the user-visible outcome in one sentence.
- Recheck `git status --short` before touching files.

2. User criticism replay
- Re-test the latest real complaint: mobile description/window clipping.
- Include link-content fit, duplicate or unnecessary content, stale update wording, and purpose drift in the QA note.

3. Feature design
- Keep the change small: one changed page or one focused section.
- For recipe helper, define inputs such as available ingredients, time, diet/allergy note, and Vietnamese/Korean household context.
- Output should be practical recipe cards, shopping gaps, and safety/risk wording where needed.

4. Implementation
- Edit only the required HTML/CSS/JS files.
- Preserve existing navigation and private-test wording.
- Avoid broad page-copy expansion unless needed for the selected feature.

5. Local QA
- Run the existing Playwright gate or the closest relevant local checks.
- Capture mobile and desktop evidence for the changed area.
- Check internal links, images, anchors, and external reference links used by the changed section.

6. Remote/test-surface separation
- If deployment authority is still unresolved, report local verification only and mark remote/public verification as blocked or deferred.
- If a technical preview URL is verifiable, record target URL, branch/source assumption, and whether the changed content appears there.

7. Evidence and reporting
- Write a QA/evidence note under `reports/`.
- Update `agents/project_log.md`.
- Send Telegram start/progress/result reports using `personal_dm`.

## Staff Assignments

- General manager: scope lock, private/public boundary, blocker wording.
- Web admin: file edits, local server, link/path checks.
- QA reviewer: mobile/desktop changed-area screenshots, user-criticism replay, evidence manifest.
- Content editor: practical usefulness, duplicate/stale wording, non-overclaiming copy.
- SEO analyst: titles/descriptions/internal links only after feature purpose is fixed.
- Monetization manager: hold ads/affiliate work until trust and policy checks pass.
- Skeptic: veto generic advice, false completion claims, trend drift, and evidence gaps.

## Blockers

- Cloudflare deployment authority/source/branch is unresolved.
- Public operation approval is not granted.
- Automated QA cannot prove user usefulness by itself; changed-area evidence and link-purpose checks are required.

## Next Cycle Output

The next cycle should produce:

1. Selected feature target and 3-5 acceptance criteria.
2. Focused implementation change.
3. Mobile and desktop screenshots of the changed area.
4. Link-purpose verification note.
5. Project log entry and Telegram result report.

Gate Status:
- MEETING_EXPANSION_GATE_PASSED
- SKEPTIC_DISSENT_GATE_PASSED
- ROOM_ISOLATION_COMPANY_HOMEPAGE_ONLY_ACTIVE
- PRIVATE_TEST_STATUS_CONFIRMED
- PUBLIC_OPERATION_NOT_APPROVED
- CLOUDFLARE_AUTHORITY_UNRESOLVED
- NEXT_STEP_PLAN_READY
