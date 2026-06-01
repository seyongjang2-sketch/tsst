# Skeptic Homepage Issues - 2026-06-02

Scope: company/homepage project only.

Basis:
- agents/meetings/ops-review-2026-06-02.md
- reports/homepage-management-audit-20260530.md
- agents/project_log.md latest entries
- agents/homepage_management_guidelines.md
- agents/daily_operating_sequence.md

STATUS: EVIDENCE_REVIEW_COMPLETE

## Skeptic Opinion

The Skeptic's position is that the homepage must not be treated as solved just because the current automated gates pass.

Main challenge points:
- We are still assuming that private-test technical verification is close to public operation readiness.
- We are assuming the operating loop proves usefulness, but it mostly proves repeatability and selected checks.
- We are assuming trends and daily updates help the site, but they can easily create stale, generic, or off-purpose content.
- We are assuming role-based staff discussion prevents mistakes, but role labels do not matter unless each role creates a concrete veto, check, file, or evidence item.
- We are assuming deployment is a normal final step, but Cloudflare authority/source/branch questions are still a separate blocker.

What would make current decisions wrong:
- The public/test URL is not serving the same source that was verified locally.
- Mobile screenshots miss the exact area the user criticized.
- Links technically open but the linked content does not match the user's purpose.
- The site feels operated but not useful to a Korean-Vietnamese family in Vietnam.
- A "daily/update" label appears without current date, changed content, and visible proof.

Smallest test:
- On the next homepage/page change, write 3-5 acceptance criteria first.
- Re-test the last real user criticism directly.
- Capture desktop/mobile evidence for the changed area.
- Verify the intended Cloudflare/test surface separately from local verification.

## Current Homepage Problems

1. Public/private status is still unresolved.
FamilySpace is a private operating-test page. Public production operation is not approved.

2. Deployment authority and final source are still blockers.
Cloudflare source/branch/token authority remains unresolved, and prior audit identified conflicting surfaces: local files, origin branches, tsst remote, Cloudflare Pages, and GitHub Pages.

3. Automated QA is necessary but not enough.
Current gates check selected structure, navigation, stale dates, risk wording, and operating markers. They cannot fully judge visual quality, usefulness, customer trust, or whether the page feels like a real maintained service.

4. User-usefulness still needs stronger checks.
Past misses, such as recipe content without convincing food photos or duplicated UI/navigation behavior, show that functional checks can pass while the user experience is still weak.

5. Trend and update content can drift from the homepage purpose.
Trend-following is allowed only when it serves Korean-Vietnamese family life in Vietnam, maps to a page owner, and avoids unsupported legal/medical/finance claims.

6. Repeated HTML/UI drift remains a risk.
Common UI has historically diverged across static HTML pages. Navigation position and duplicated UI now have gates, but the underlying static-page repetition still creates future drift risk.

7. Completion wording has been too easy to overstate.
The correct wording is test update/verification unless public operation is explicitly approved and verified on the intended public surface.

## Result

The Skeptic would not say "the homepage is bad." The more accurate judgment is:

FamilySpace has improved as a private-test operating system, but it is not yet proven as a public, customer-ready homepage. The main problem is not one broken page. The problem is the gap between technical test success and real homepage readiness: deployment certainty, mobile visual proof, link-content fit, user usefulness, and evidence-backed completion claims.
