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

## Homepage Representation

The homepage includes a public-facing operating board with:

- Current private-test operating mode.
- Time-based daily sequence.
- Team ownership for each step.
- Today's operation queue.
- Completion criteria.
- A test-operation console that advances through the daily sequence, highlights the current owner, updates the queue, and writes an on-page execution log.

This section is not a public launch claim. It is an operating-test signal that shows how FamilySpace will run once public operation is approved.
