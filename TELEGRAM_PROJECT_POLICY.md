# Telegram Project Policy

This project is covered by the global Telegram sharing/reporting policy.

## Default Room

- Room: `personal_dm`
- Chat ID: `8867707684`
- Note: This is the temporary default until a dedicated company project room is assigned.

## Room Isolation

- This project may only process company/homepage instructions.
- Do not start, continue, QA, or report video production work from this room unless the user explicitly says the task is cross-project video work.
- Do not start or report game work from this room unless explicitly requested as cross-project work.
- For human-initiated desktop work, use explicit `--room personal_dm`; do not rely on `--room auto` when the current cwd or user intent is ambiguous.
- Telegram-triggered Codex runs may use `--room auto` only because Hermes injects `HERMES_TELEGRAM_REPORT_ROOM=personal_dm`.

## Required Before Work

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py sync-hermes --room personal_dm --limit 50
python C:\Users\Admin\Documents\telegram_inbox.py sync-approvals --limit 100
python C:\Users\Admin\Documents\telegram_inbox.py show --room personal_dm --limit 10
```

## Required Sharing

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py add --room personal_dm --source telegram --message "instruction text"
```

## Required Report

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py report --room personal_dm --stage start --task-id "task-name" --message "start report text"
python C:\Users\Admin\Documents\telegram_inbox.py report --room personal_dm --stage progress --task-id "task-name" --message "progress report text"
python C:\Users\Admin\Documents\telegram_inbox.py report --room personal_dm --stage result --task-id "task-name" --message "result report text"
python C:\Users\Admin\Documents\telegram_inbox.py audit-reports --room personal_dm --task-id "task-name"
```

## Required Meeting Report

Meetings, staff discussions, concept decisions, test reviews, and planning discussions must use the global meeting-report format:

```text
회의 결과

1. 결정된 사항
2. 해야 할 일
3. 담당자
4. 기한
5. 미해결 이슈
6. 다음 회의 전까지 확인할 것
7. 다음 회의 전까지 공유할 자료
8. 이후 진행 방향
```

Record meeting reports in the correct Telegram room, the shared inbox, and the project log when they affect project direction or execution.

## Mandatory Meeting Skeptic Gate

Every company/homepage meeting is invalid unless it includes:

- `Meeting Expansion Gate`: conventional/common answer, counterexample or failure reason, abnormal/non-obvious alternative, and minimum experiment or concrete next action.
- `Skeptic Dissent Gate`: explicit answers to:
  1. What are we assuming without proof?
  2. What would make this decision wrong?
  3. Are we repeating an old idea under a new name?
  4. What evidence would change our mind?
  5. What is the smallest test that can expose the mistake?
- `Gate Status`: `MEETING_EXPANSION_GATE_PASSED` and `SKEPTIC_DISSENT_GATE_PASSED`.

If either gate is missing, mark the meeting `MEETING_INVALID_SKEPTIC_GATE_MISSING` and rerun it before approval, deployment, QA pass, public/private readiness, or final direction claims.

## Approval Request

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py approval-request --room personal_dm --project "우리회사" --action "what needs approval" --reason "why it is needed"
```

Global policy:

- `C:\Users\Admin\Documents\TELEGRAM_REPORTING_POLICY.md`
- `C:\Users\Admin\Documents\telegram_room_map.json`
