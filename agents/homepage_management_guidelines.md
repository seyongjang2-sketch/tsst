# 홈페이지 관리 지침

## Canonical deployment rule

- Production target is Cloudflare Pages: `https://tsst-csa.pages.dev/`.
- Deployment canon file: `DEPLOYMENT.md`.
- GitHub Pages and `test.tsst-csa.pages.dev` are not production proof in the current operating state.
- A task is complete only after the changed content is verified on the Cloudflare public URL and the result is logged in `agents/project_log.md` plus Telegram.

적용 대상: FamilySpace 홈페이지의 HTML, CSS, JS, 이미지, 가이드 문서, 배포 작업  
최종 기준: 사용자가 보는 공개 사이트가 정상이어야 완료다.

## 1. 작업 시작 전

모든 작업자는 수정 전에 아래를 확인한다.

1. `agents/project_log.md` 최신 항목 확인
2. `git status --short` 확인
3. 사용자가 요구한 결과를 수락 기준으로 3~5개 적기
4. 최종 공개 기준 URL 확인

수락 기준 예시:

- 레시피 카드에 완성 음식 사진이 보인다.
- 모바일에서도 사진과 설명이 겹치지 않는다.
- 이미지 파일 경로가 깨지지 않는다.
- 공개 URL에서도 새 사진이 보인다.

## 2. 역할별 책임

### 운영 총괄

- 최종 공개 URL과 배포 브랜치를 정한다.
- 배포 차단, 권한 부족, 정책 위험을 보류 또는 승인으로 판단한다.
- 완료 보고 전에 QA 결과를 확인한다.

### 웹 관리자

- HTML, CSS, JS, 이미지 파일을 수정한다.
- 공통 네비게이션과 반복 UI 변경 시 모든 페이지를 같이 확인한다.
- 변경 파일과 검증 명령을 로그에 남긴다.

### 콘텐츠 에디터

- 사용자가 실제로 원하는 내용이 화면에 들어갔는지 확인한다.
- 음식, 육아, 비자, 생활비 콘텐츠는 사진, 날짜, 주의문구, 맥락을 확인한다.

### QA 리뷰어

- 모바일, 데스크톱, 링크, 이미지, 정책 페이지, 공개 URL 반영을 확인한다.
- 하나라도 빠지면 완료가 아니라 보류로 기록한다.

## 3. 완료 전 필수 체크리스트

작업 완료 전 아래 항목을 모두 확인한다.

```powershell
git status --short
```

- 의도하지 않은 파일 변경이 없는가
- 새 이미지나 스크린샷이 필요한 위치에 있는가
- 커밋/배포 대상에서 빠진 파일이 없는가

로컬 페이지 확인:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri http://localhost:8000/index.html
Invoke-WebRequest -UseBasicParsing -Uri http://localhost:8000/mom.html
Invoke-WebRequest -UseBasicParsing -Uri http://localhost:8000/dad.html
```

링크/이미지 확인:

- 내부 `href` 대상 파일 존재
- 내부 `src` 이미지 파일 존재
- 같은 페이지 해시 링크의 `id` 존재
- 템플릿 문자열은 실제 렌더링 데이터 확인으로 별도 검증

화면 확인:

- 변경 페이지 데스크톱 스크린샷
- 변경 페이지 모바일 스크린샷
- 텍스트 겹침, 이미지 누락, 버튼/링크 오작동 확인

공개 확인:

- 최종 공개 URL에서 새 문구, 새 이미지 파일명, 새 UI가 실제로 보이는지 확인
- 공개 반영이 안 되면 "완료"가 아니라 "배포 차단"으로 보고

## 4. 배포 기준

한 번에 하나의 운영 기준만 사용한다.

- 운영 기준 URL: Cloudflare Pages URL 또는 별도 확정 URL
- 운영 기준 저장소: 하나만 지정
- 운영 기준 브랜치: 하나만 지정

금지:

- `origin/main`, `origin/test`, `tsst/main` 중 어디가 운영인지 모른 채 완료 보고
- GitHub Pages 구버전과 Cloudflare 최신 버전을 동시에 운영처럼 말하기
- 공개 URL 확인 없이 "배포 완료" 보고

## 5. 장애 보고 기준

문제가 생기면 아래 형식으로 기록한다.

```text
장애/품질 이슈

1. 증상:
2. 영향 페이지:
3. 로컬 상태:
4. 공개 URL 상태:
5. 원인 추정:
6. 즉시 조치:
7. 남은 차단:
8. 담당자:
9. 기한:
```

## 6. 로그 기준

모든 의미 있는 변경은 `agents/project_log.md`에 남긴다.

필수 포함:

- 작업자
- 변경 파일
- 수락 기준
- 검증 명령
- 스크린샷 경로
- 공개 URL 확인 결과
- 남은 위험
- 다음 조치

## 7. 보류 기준

아래 중 하나라도 해당하면 완료가 아니다.

- 공개 URL에서 변경이 보이지 않음
- 이미지/링크 파일이 누락됨
- 모바일에서 텍스트나 이미지가 겹침
- 비자, 의료, 금융, 개인정보, 광고 문구가 검증 없이 단정형임
- 배포 권한 또는 토큰이 없어 운영 반영을 확인할 수 없음
- 사용자의 핵심 요구가 화면에 직접 반영되지 않음

## 8. 이번 프로젝트의 즉시 조치

1. Cloudflare Pages가 바라보는 저장소와 브랜치를 확정한다.
2. `test.tsst-csa.pages.dev` 404 원인을 해결하거나 test preview 사용을 중단한다.
3. GitHub Pages의 구버전 노출을 폐기하거나 최신 배포로 맞춘다.
4. `mom.html`의 새 레시피 사진 변경분을 공개 반영 전까지 추적한다.
5. 공통 네비게이션 반복 구조를 다음 정리 작업의 1순위로 둔다.
