# FamilySpace

## Production Deployment

Canonical production is Cloudflare Pages: `https://tsst-csa.pages.dev/`.

Deployment and completion rules are fixed in `DEPLOYMENT.md`. GitHub Pages and `test.tsst-csa.pages.dev` are not production evidence unless a later dated deployment record explicitly changes that.

FamilySpace는 베트남에서 살아가는 한국-베트남 가족을 위한 생활형 정적 웹사이트입니다. 가족 생활비, 육아, 비자/TRC, 예방접종, 주말 루트, 가족 이야기를 한곳에 정리하는 것을 목표로 합니다.

## 프로젝트 구조

| 경로 | 역할 |
| --- | --- |
| `index.html` | 첫 화면, 층별 가족 공간형 홈 |
| `mom.html`, `dad.html`, `baby.html` | 생활, 서류, 육아 중심 페이지 |
| `blog.html`, `stars.html` | 가족 이야기와 체험형 페이지 |
| `about.html`, `contact.html`, `privacy.html`, `terms.html` | 소개, 문의, 정책 페이지 |
| `guides/` | 생활비, 예방접종, 비자/TRC 체크리스트 |
| `assets/` | PNG 이미지와 홈 레이어 이미지 |
| `images/` | SVG 일러스트 등 보조 이미지 |
| `style.css`, `login-modal.css` | 공통 스타일 |
| `main.js`, `auth.js` | 공통 스크립트와 로그인 UI |
| `agents/` | 운영 조직, 역할, 회의록, 프로젝트 로그 |
| `reports/` | 기획, QA, 이미지 생성 프롬프트, 검토 산출물 |
| `scripts/` | 운영 자동화와 리포트 보조 스크립트 |
| `scripts/media_generation/` | ComfyUI/Ollama 기반 이미지 생성 실험 도구 |
| `archive/` | 백업, 캐시, 과거 실험 파일. Git 추적 대상에서 제외 |

## 로컬 실행

정적 HTML 사이트라 별도 빌드 없이 브라우저에서 `index.html`을 열어 확인할 수 있습니다.

파이썬 보조 도구가 필요할 때만 의존성을 설치합니다.

```bash
python -m pip install -r requirements.txt
```

## 운영 문서

| 문서 | 용도 |
| --- | --- |
| `agents/README.md` | FamilySpace 운영 조직 요약 |
| `agents/staff_profiles.json` | 직원별 전문지식, 페르소나, 산출물, 로그 의무 |
| `agents/org_chart.md` | 조직도와 승인 흐름 |
| `agents/weekly_operating_plan.md` | 요일별 운영 루틴 |
| `agents/logging_protocol.md` | 프로젝트 로그 작성 규칙 |
| `agents/project_log.md` | 현재 프로젝트 상태를 파악하는 단일 운영 로그 |

## 작업 기준

1. 사용자에게 공개되는 HTML/CSS/JS와 이미지 자산은 루트, `assets/`, `images/`, `guides/`에 둡니다.
2. 운영 기록과 내부 판단은 `agents/`와 `reports/`에 둡니다.
3. 생성 캐시, 백업, 과거 실험 파일은 `archive/`에 두고 Git에는 올리지 않습니다.
4. 의미 있는 변경은 `agents/project_log.md`에 남깁니다.
5. 모바일 화면, 내부 링크, 정책 페이지, 광고/제휴 문구의 신뢰성을 우선 확인합니다.

## 로그 작성

작업 후에는 다음 명령으로 운영 로그를 남깁니다.

```bash
python scripts/project_log.py add --type technical --owner web_admin --status done --title "Project structure cleanup" --summary "Organized root files and Git-ready defaults before first commit." --files "README.md,.gitignore,.editorconfig,.gitattributes,scripts/media_generation" --validation "manual review; git status" --next "Review mobile rendering and internal links before publish."
```

현재 상태 확인:

```bash
python scripts/project_log.py status
```
