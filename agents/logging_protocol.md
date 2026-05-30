# 프로젝트 로그 규칙

로그의 목적은 `agents/project_log.md`만 읽어도 현재 프로젝트의 목적, 최근 결정, 변경 파일, 남은 위험, 다음 작업을 파악할 수 있게 하는 것이다.

## 필수 원칙

- 모든 의미 있는 작업은 로그를 남긴다.
- 로그에는 작업자, 유형, 상태, 영향 파일, 검증 방법, 다음 액션이 들어간다.
- 결정이 바뀌면 이전 로그를 지우지 않고 새 로그로 변경 사유를 남긴다.
- 법률, 의료, 비자, 광고 정책, 개인정보 관련 내용은 `risk` 또는 `policy` 유형으로 남긴다.
- 웹 파일을 수정한 경우 `technical` 유형으로 변경 파일과 확인 결과를 남긴다.

## 로그 유형

| 유형 | 사용 시점 |
| --- | --- |
| `decision` | 승인, 보류, 방향 변경, 우선순위 변경 |
| `idea` | 아이디어 채택, 폐기, 다음 실험 정의 |
| `content` | 글감, 문장, 카테고리, 편집 변경 |
| `seo` | 키워드, 제목, 설명, 내부 링크 변경 |
| `design` | 화면 구조, 브랜드 톤, 이미지 방향 변경 |
| `asset` | 이미지, 썸네일, 생성 프롬프트, 출처 기록 |
| `technical` | HTML/CSS/JS, 스크립트, 파일 구조 변경 |
| `qa` | 점검 결과, 통과/보류, 발견 이슈 |
| `monetization` | 광고, 제휴, 분석, 수익 실험 |
| `risk` | 정책, 개인정보, 의료/법률/비자 정보 위험 |

## 로그 형식

```md
## YYYY-MM-DD HH:mm - short title
- Type:
- Owner:
- Status:
- Summary:
- Files:
- Validation:
- Decisions:
- Risks:
- Next:
```

## 스크립트 사용법

```bash
python scripts/project_log.py add --type technical --owner web_admin --status done --title "navigation update" --summary "Updated shared navigation links" --files "index.html,style.css" --validation "manual review" --next "QA mobile check"
python scripts/project_log.py status
```

