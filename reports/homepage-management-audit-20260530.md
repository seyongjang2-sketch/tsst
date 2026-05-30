# 홈페이지 관리 문제 조사 보고서

작성일: 2026-05-30  
대상: FamilySpace 정적 홈페이지 프로젝트  
작업 ID: homepage-management-audit-20260530

## 결론

이번 반복 문제는 특정 직원 한 명의 태도 문제로 단정하기 어렵다. 원인은 관리 체계 문제다.

현 프로젝트는 로컬 파일, `origin` 저장소, `tsst` 저장소, Cloudflare Pages, GitHub Pages가 동시에 존재한다. 그런데 어떤 저장소와 어떤 공개 URL이 최종 배포 기준인지 고정되어 있지 않고, 변경 전후 검증 체크리스트도 강제되어 있지 않다. 그 결과 로컬에서는 정상인데 공개 사이트는 예전 내용이 보이거나, 요구사항 일부가 빠진 상태로 완료 보고되는 일이 반복될 수 있는 구조다.

## 확인한 사실

1. 로컬 사이트 상태
   - `http://localhost:8000/` 기준 주요 페이지 13개가 HTTP 200으로 응답했다.
   - 검사 페이지: `index.html`, `mom.html`, `dad.html`, `baby.html`, `blog.html`, `stars.html`, `about.html`, `contact.html`, `privacy.html`, `terms.html`, `guides/han-viet-vaccine-checklist.html`, `guides/krw-vnd-cashflow.html`, `guides/trc-visa-checklist.html`
   - 템플릿 문자열을 제외한 내부 `href`, `src`, 로컬 해시 링크 감사는 통과했다.

2. 현재 작업 트리
   - `mom.html`이 수정되어 있고, `images/recipe-bulgogi-rice-paper-rolls.png` 및 관련 스크린샷이 아직 커밋되지 않은 상태다.
   - 이 변경은 최근 "주메뉴 레시피에 실사 사진이 빠졌다"는 지적을 처리한 흔적으로 보인다.

3. 배포 경로 불일치
   - `origin/main`: `ccd0054`
   - `origin/test`: `667e8db`
   - `tsst/main`: `667e8db`
   - Cloudflare `https://tsst-csa.pages.dev/`: 최신 1층 네비게이션은 보이나, 과거 로그상 직접 배포는 `CLOUDFLARE_API_TOKEN` 부재로 막힌 적이 여러 번 있다.
   - Cloudflare test preview `https://test.tsst-csa.pages.dev/`: 404
   - GitHub Pages `https://seyongjang2-sketch.github.io/tsst/`: 구버전 6.5KB 페이지를 제공하고, 최신 1층 네비게이션이 없다.

4. 기존 운영 문서
   - `agents/README.md`, `agents/logging_protocol.md`, `agents/weekly_operating_plan.md`, `agents/project_log.md`가 존재한다.
   - 문서상 QA, 로그, 역할 분리는 이미 있다.
   - 다만 실제 완료 기준이 "로컬 수정 완료"와 "공개 URL 반영 완료"로 분리되어 강제되지 않았다.

## 원인 분석

### 1. 최종 배포 기준 URL이 고정되어 있지 않음

Cloudflare Pages와 GitHub Pages가 동시에 존재하고, Git 원격도 `origin`과 `tsst`가 같이 있다. 작업자는 어느 경로가 고객에게 보이는 최종 사이트인지 매번 확인해야 하는데, 이 확인이 절차화되어 있지 않다.

### 2. 완료 보고 기준이 약함

현재 로그에는 로컬 HTTP, 링크 감사, 스크린샷 검증이 남아 있다. 그러나 요구사항 자체가 화면에 실제로 충족됐는지 확인하는 "요구사항별 수락 기준"이 부족했다. 예를 들어 레시피 사진 요청이라면 완료 전 반드시 다음을 확인해야 한다.

- 실제 음식 사진 파일 존재
- 페이지에 이미지 삽입
- 데스크톱/모바일에서 이미지가 보임
- 공개 URL에서도 동일하게 보임

### 3. 배포 권한/환경 차단이 미해결 상태로 누적됨

`CLOUDFLARE_API_TOKEN` 부재와 test preview 404가 반복 기록되어 있다. 이 상태에서는 코드를 잘 고쳐도 공개 반영 검증이 흔들린다.

### 4. 반복 HTML 구조로 인한 drift 위험

네비게이션과 공통 UI가 여러 HTML 파일에 반복되어 있다. 공통 변경이 생기면 일부 파일만 바뀌거나 링크가 어긋날 위험이 높다.

### 5. 이미지/콘텐츠 품질 게이트가 늦게 작동함

사용자가 "사진이 없으면 누가 요리해보겠냐"라고 지적한 것은 QA 단계에서 잡혔어야 한다. 기능이 깨진 것은 아니지만, 콘텐츠 목적을 만족하지 못한 품질 결함이다.

## 책임 판단

직원 개인 문제라기보다 운영 책임 문제다. 직원별 역할 문서는 있지만, 아래가 부족했다.

- 최종 배포 URL 단일화
- 변경 전 수락 기준 작성
- 변경 후 로컬/공개 URL 이중 확인
- 막힌 배포 권한의 책임자 지정
- 완료 보고 전 체크리스트 강제

따라서 대책은 사람 교체보다 관리 프로세스 강화가 우선이다. 다만 같은 담당자가 체크리스트를 반복 위반하면 담당자 교체 또는 승인권 회수가 필요하다.

## 즉시 대책

1. 최종 공개 기준을 하나로 정한다.
   - 권장: Cloudflare Pages `https://tsst-csa.pages.dev/`를 운영 기준으로 고정
   - GitHub Pages는 사용하지 않거나, 보조/폐기 상태로 문서에 명시

2. 배포 차단을 해소한다.
   - Cloudflare Pages 프로젝트의 Git 연결 저장소와 브랜치를 확인한다.
   - `origin/main`, `origin/test`, `tsst/main` 중 어느 브랜치를 배포할지 확정한다.
   - 직접 배포가 필요하면 `CLOUDFLARE_API_TOKEN`을 설정한다.

3. 모든 작업은 수락 기준을 먼저 적고 시작한다.
   - 예: "레시피 사진 추가" 작업은 이미지 파일, HTML 삽입, 데스크톱/모바일 노출, 공개 URL 반영까지가 완료 조건이다.

4. 완료 보고 전 필수 검사를 통과해야 한다.
   - `git status --short`
   - 내부 링크/이미지 감사
   - 주요 페이지 HTTP 200
   - 변경 페이지 데스크톱/모바일 스크린샷
   - 공개 URL에서 변경 문구 또는 이미지 파일명 확인

5. `agents/project_log.md`에 막힌 항목을 "다음에 할 일"로만 두지 말고 담당자와 마감일을 붙인다.

## 재발 방지 기준

앞으로 "완료"라고 말할 수 있는 조건은 다음 5개를 모두 만족할 때뿐이다.

1. 요구사항별 수락 기준이 충족됐다.
2. 로컬 주요 페이지가 200으로 열린다.
3. 내부 링크와 이미지 경로 감사가 통과했다.
4. 변경된 화면의 데스크톱/모바일 스크린샷이 남았다.
5. 최종 공개 URL에서 실제 변경이 확인됐다. 공개 배포가 막히면 완료가 아니라 "배포 차단"으로 보고한다.

## 우선순위

1. Cloudflare 최종 배포 경로 확정 및 test preview 404 해결
2. GitHub Pages 구버전 노출 정리
3. 홈페이지 관리 지침을 `agents/homepage_management_guidelines.md`로 고정
4. 공통 네비게이션/반복 HTML을 생성 방식 또는 공통 템플릿으로 정리
5. 변경 작업마다 수락 기준, 로컬 검증, 공개 검증, 로그를 의무화
