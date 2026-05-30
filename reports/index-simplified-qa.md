# index simplified QA

## 결과
통과.

## 검증
- HTML parse OK
- 로컬 HTTP 응답: 200
- 브라우저 로딩 OK: http://127.0.0.1:8787/index.html?v=simple
- 문서 제목: FamilySpace | 한-베 가족 생활 가이드
- 첫 화면 구조: Apple식 단순 구조로 변경됨
  - 작은 sticky navigation
  - hero 한 메시지
  - CTA 2개
  - 언어 선택 KR / VI / 中文 작게 노출
  - 오늘의 가족 입국 도장 단일 인터랙션
- 주요 섹션:
  - 오늘 필요한 것만: 생활비 / 육아 / 서류 / 주말 4개 카드
  - 돈은 더 단순하게: 생활비 상세 링크
  - 처음 온 사람이 많이 보는 글: 대표 링크 3개
  - 실제 가족 업데이트 신뢰 문구

## 링크 확인
- index.html
- dad.html
- mom.html
- baby.html
- blog.html
- stars.html
- privacy.html
- terms.html
- style.css
- login-modal.css

동적 JS 템플릿 `${href}`는 실제 정적 링크가 아니라 버튼 선택 후 생성되는 링크라 깨진 파일로 보지 않음.

## 복잡도 평가
기존의 과한 floating 문구, orbit mission, reveal board, 긴 dashboard/checklist/table 구조를 제거하고 인덱스 목적을 “요약 + 링크 이동”으로 정리했음.

## 수정 파일
- /mnt/c/Users/Admin/tsst/index.html
