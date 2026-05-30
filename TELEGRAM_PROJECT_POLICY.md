# Telegram Project Policy

This project is covered by the global Telegram sharing/reporting policy.

## Default Room

- Room: `personal_dm`
- Chat ID: `8867707684`
- Note: This is the temporary default until a dedicated company project room is assigned.

## Required Before Work

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py sync-hermes --room auto --limit 50
python C:\Users\Admin\Documents\telegram_inbox.py sync-approvals --limit 100
python C:\Users\Admin\Documents\telegram_inbox.py show --room auto --limit 10
```

## Required Sharing

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py add --room auto --source telegram --message "instruction text"
```

## Required Report

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py report --room auto --stage start --task-id "task-name" --message "start report text"
python C:\Users\Admin\Documents\telegram_inbox.py report --room auto --stage progress --task-id "task-name" --message "progress report text"
python C:\Users\Admin\Documents\telegram_inbox.py report --room auto --stage result --task-id "task-name" --message "result report text"
python C:\Users\Admin\Documents\telegram_inbox.py audit-reports --room auto --task-id "task-name"
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

## Approval Request

```powershell
python C:\Users\Admin\Documents\telegram_inbox.py approval-request --room auto --project "우리회사" --action "what needs approval" --reason "why it is needed"
```

Global policy:

- `C:\Users\Admin\Documents\TELEGRAM_REPORTING_POLICY.md`
- `C:\Users\Admin\Documents\telegram_room_map.json`
