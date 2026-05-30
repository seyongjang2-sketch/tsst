# FamilySpace index.html 아이디어 D: 첫화면 후킹 / 탐색 루프 아이디어 10개

목표: index.html을 단순 소개 페이지가 아니라 방문자가 질문을 고르고, 옆 콘텐츠를 훑고, 다음 페이지로 이동하게 만드는 체류시간형 메인 허브로 설계한다. 실제 광고 코드, 추적 코드, 결제 기능은 넣지 않고 향후 광고/제휴가 들어갈 수 있는 안전한 자리만 고려한다.

현재 첫 화면 진단

- 검색 유입 예상 방문자: 베트남 거주 한국인 가족, 한-베 국제가정, 25개월 전후 아기 부모, TRC/비자/생활비/병원/식단/주말 코스를 찾는 사람.
- 방문 이유: “베트남에서 가족으로 살 때 당장 뭘 확인해야 하지?”, “아기 병원/식단/생활비는 한국과 어떻게 다르지?”, “한-베 가족의 실제 루틴은 어떨까?” 같은 실용 질문과 호기심.
- 30초 체류 장치: 첫 화면의 빠른 길 카드, 인기 질문, 미션 선택 버튼.
- 2분 체류 장치: 체크리스트, 비교표, 클릭형 reveal 카드, 방문자별 관심사 보드.
- 5분 체류 장치: 질문/랭킹/테스트/카드뉴스형 루프를 통해 dad.html, mom.html, baby.html, blog.html, guides 페이지로 이동시키는 구조.
- 현재 약점: 첫 화면이 이미 시각적으로 풍부하지만, “내 상황을 고르면 다음 콘텐츠가 열린다”는 탐색 루프가 더 강해지면 체류시간과 내부 클릭이 늘어난다.
- 향후 광고 자리: 첫 답변 블록 아래, 체크리스트/비교표 사이, 관련 글 카드 아래, 다음 클릭 루프 직전. 단, 유용한 콘텐츠를 먼저 보여준 뒤 배치해야 신뢰가 유지된다.

---

## 1. “오늘 내 가족 상황은?” 4문항 미니 진단

- Visitor intent: 처음 들어온 방문자가 생활비, 육아, 비자, 주말 코스 중 어디부터 봐야 할지 모른다.
- Retention mechanism: 4개의 짧은 질문을 클릭하면 결과 카드가 열리고, 결과마다 다음 페이지 링크를 제공한다.
- Side-content idea: 오른쪽 사이드에 “비슷한 가족들이 많이 고른 루트” 작은 랭킹 표시.
- Concrete title: `오늘 우리 가족에게 먼저 필요한 루트 찾기`
- Visual/content asset: 4분면 선택 카드: 돈 / 아기 / 서류 / 주말. 선택 후 작은 경로 지도 SVG 표시.
- Internal link path: 결과 `돈` → dad.html 생활비 섹션, `아기` → mom.html/baby.html, `서류` → guides/trc-visa-checklist.html, `주말` → blog.html 또는 향후 weekend guide.
- Monetization angle: 결과 아래에 “관련 체크리스트/비교표” 영역을 두고 향후 광고 슬롯을 자연스럽게 삽입 가능.
- Risk/trust note: 진단처럼 보여도 법률/의료/재정 조언이 아니므로 “가족 경험 기반 추천 경로”라고 명시.

## 2. “한-베 가족이 많이 막히는 순간 TOP 7” 랭킹 카드

- Visitor intent: 다른 가족들도 나와 같은 문제를 겪는지 궁금하다.
- Retention mechanism: 랭킹 1~7위를 세로 카드로 배치하고 각 항목을 클릭하면 해결 힌트와 관련 페이지가 열린다.
- Side-content idea: 메인 글 옆에 `이번 주 많이 본 질문` 형태로 계속 노출.
- Concrete title: `베트남 가족 생활, 많이 막히는 순간 TOP 7`
- Visual/content asset: 숫자 배지, 난이도 바, 예상 소요시간 라벨: “5분 확인”, “주말에 처리”.
- Internal link path: TRC → guides, 생활비 → dad.html, 식단 → mom.html, 성장 → baby.html, 가족 기록 → blog.html.
- Monetization angle: 랭킹 중간에 `콘텐츠 브레이크 / 향후 광고 자리`를 둘 수 있음. 사용자가 이미 스크롤한 뒤라 신뢰 훼손이 적다.
- Risk/trust note: “많이 막힌다”는 표현은 과장될 수 있으므로 “우리 가족 기준으로 자주 다시 확인한 것”처럼 낮은 톤 사용.

## 3. “30초 카드뉴스: 베트남 가족 생활비, 진짜 다른 점 5개”

- Visitor intent: 긴 글 전에 숫자/비교로 빠르게 감을 잡고 싶다.
- Retention mechanism: 좌우 넘김형 또는 세로 카드뉴스로 5장을 읽게 만든다.
- Side-content idea: 카드 옆에 “이 항목 자세히 보기” 링크와 “아빠의 돈 관리 루틴” CTA.
- Concrete title: `한국 vs 베트남 생활비, 체감 차이 5장 요약`
- Visual/content asset: 한국/베트남 2열 비교 카드, 아이콘, 미니 막대그래프.
- Internal link path: index 카드뉴스 → dad.html 생활비 보드 → 관련 가이드/블로그.
- Monetization angle: 생활비/송금/마트/보험 관련 제휴 후보가 생길 수 있으나 현재는 정보 카드만 배치.
- Risk/trust note: 실제 금액을 단정하지 말고 “우리 가족 체감”, “지역/시기별 차이 있음” 표시.

## 4. “아기 오늘 뭐 먹이지?” 즉석 메뉴 룰렛

- Visitor intent: 베트남 재료와 한국식 반찬을 섞어 아기 식단 아이디어를 얻고 싶다.
- Retention mechanism: 버튼을 누르면 `아침/점심/간식/저녁` 아이디어가 하나씩 나타난다.
- Side-content idea: 옆에 `마트에서 같이 살 것 3개`, `주의할 재료 메모` 미니 박스.
- Concrete title: `25개월 아기 오늘 메뉴 뽑기`
- Visual/content asset: 룰렛처럼 보이는 원형 메뉴 카드 또는 Bento grid.
- Internal link path: index 룰렛 → mom.html 식단표 → baby.html 성장/식습관 기록.
- Monetization angle: 향후 장보기 체크리스트, 주방용품/유아용품 제휴 영역으로 확장 가능.
- Risk/trust note: 의료/영양 전문 조언이 아니며 알레르기/건강 상태는 보호자가 확인해야 함.

## 5. “TRC D-day 보드: 오늘 확인할 서류 1개만”

- Visitor intent: 비자/TRC 갱신이 복잡해서 어디서 시작해야 할지 막막하다.
- Retention mechanism: D-60, D-30, D-7, 당일 같은 단계 버튼을 누르면 필요한 확인 항목이 바뀐다.
- Side-content idea: 사이드에 `놓치기 쉬운 서류`, `가족 캘린더에 넣을 날짜` 표시.
- Concrete title: `TRC/비자 D-day 체크 보드`
- Visual/content asset: 타임라인 SVG, D-day 배지, 체크박스 리스트.
- Internal link path: index D-day 보드 → guides/trc-visa-checklist.html → dad.html 실무 루틴.
- Monetization angle: 향후 문서 정리 템플릿/체크리스트 다운로드 영역 주변에 광고 슬롯 가능.
- Risk/trust note: 법률/행정 정보는 변경될 수 있으므로 “공식기관 재확인 필요” 라벨 필수.

## 6. “한-베 가족 주말 코스 선택 게임”

- Visitor intent: 주말에 아기와 어디 갈지, 비용/거리/피로도를 비교하고 싶다.
- Retention mechanism: `실내`, `마트`, `카페`, `키즈카페`, `산책`을 고르면 추천 루트와 준비물이 나온다.
- Side-content idea: 옆에 `비 오는 날 대안`, `낮잠 시간 고려`, `예상 지출` 카드.
- Concrete title: `이번 주말 가족 코스 고르기`
- Visual/content asset: 작은 지도형 루트 카드, 날씨/비용/피로도 아이콘.
- Internal link path: index 코스 게임 → blog.html 주말 일기 → baby.html 놀이 기록.
- Monetization angle: 향후 지도/지역 가이드, 가족 장소 리뷰 페이지에 광고를 붙이기 좋음.
- Risk/trust note: 특정 장소 추천은 최신 영업시간/위생/안전 확인 필요.

## 7. “아빠 vs 엄마 관점 비교: 같은 문제, 다른 답”

- Visitor intent: 한-베 가족에서 한국인 아빠와 베트남 엄마가 같은 이슈를 어떻게 다르게 보는지 궁금하다.
- Retention mechanism: 탭을 눌러 아빠 관점/엄마 관점/합의한 루틴을 비교한다.
- Side-content idea: `이 주제의 다음 질문` 카드: 돈, 식단, 병원, 교육.
- Concrete title: `같은 하루, 아빠와 엄마의 다른 체크포인트`
- Visual/content asset: 3열 비교 카드: Dad / Mom / Family Rule.
- Internal link path: Dad 탭 → dad.html, Mom 탭 → mom.html, Family Rule → blog.html 또는 index 내 신뢰 섹션.
- Monetization angle: 가족 커뮤니케이션/생활 루틴 콘텐츠가 쌓이면 커뮤니티 CTA와 광고 슬롯 모두 가능.
- Risk/trust note: 문화 차이를 고정관념처럼 쓰지 말고 “우리 가족의 경험”으로 한정.

## 8. “처음 온 방문자를 붙잡는 5초 질문 헤드라인”

- Visitor intent: 페이지가 나와 관련 있는지 5초 안에 판단한다.
- Retention mechanism: 큰 소개 문장보다 질문형 선택지를 먼저 보여준다.
- Side-content idea: 히어로 오른쪽에 `지금 바로 답 보기` 카드 4개 배치.
- Concrete title: `지금 궁금한 게 이것인가요?`
- Visual/content asset: 말풍선형 질문 카드: “생활비가 얼마나 들까?”, “아기 병원은 어디?”, “TRC 뭐부터?”, “주말 어디 가지?”
- Internal link path: 각 질문 카드 → 해당 섹션 앵커 → 관련 페이지.
- Monetization angle: 질문 카드 아래/다음 섹션 사이가 향후 콘텐츠 브레이크 자리.
- Risk/trust note: 낚시성 질문 금지. 질문을 클릭하면 실제 답/체크리스트/다음 링크가 있어야 함.

## 9. “스크롤 보상형 숨은 생활 메모”

- Visitor intent: 단순 글보다 작은 발견이 있으면 더 내려본다.
- Retention mechanism: 섹션마다 `우리 가족 메모`, `실수한 점`, `다음엔 이렇게` 같은 작은 reveal 카드를 둔다.
- Side-content idea: 본문 옆 sticky 영역에 현재 섹션의 생활 메모 1개 표시.
- Concrete title: `내려볼수록 열리는 한-베 생활 메모`
- Visual/content asset: 접힌 포스트잇 카드, 열면 2~3문장 경험담과 관련 링크.
- Internal link path: 생활비 메모 → dad.html, 식단 메모 → mom.html, 성장 메모 → baby.html, 가족 에피소드 → blog.html.
- Monetization angle: 스크롤 깊이가 증가하면 광고 슬롯을 페이지 중간 이후에 배치할 근거가 생김.
- Risk/trust note: 사생활 과다 노출 주의. 아기/가족 개인정보는 일반화하거나 익명화.

## 10. “다음에 볼 것 자동 루프: 읽은 주제 기준 3개 추천”

- Visitor intent: 첫 콘텐츠를 본 뒤 다음에 무엇을 봐야 할지 알고 싶다.
- Retention mechanism: 섹션 하단마다 `방금 본 주제와 이어지는 3개`를 배치해 내부 클릭을 만든다.
- Side-content idea: 사이드바에 `다음 클릭 루프`를 항상 두고 현재 선택 주제에 따라 추천 문구만 바꾼다.
- Concrete title: `이 주제를 봤다면 다음은 이것`
- Visual/content asset: 3장 추천 카드: 더 실용적인 글 / 가족 경험담 / 체크리스트.
- Internal link path: index 모든 주요 섹션 → dad.html/mom.html/baby.html/blog.html/guides로 순환.
- Monetization angle: 관련 글 카드 아래는 향후 광고/제휴 안내가 자연스럽지만, 먼저 내부 콘텐츠 추천을 우선해야 함.
- Risk/trust note: 자동 추천처럼 보이더라도 실제로는 정적 링크일 수 있으므로 “추천”보다 “이어보기” 톤이 안전.

---

## 우선순위 제안

1. 가장 먼저: 8번 질문형 히어로 + 1번 미니 진단. 첫 화면의 심심함을 즉시 줄이고 방문자가 자기 문제를 고르게 만든다.
2. 두 번째: 10번 다음 클릭 루프. 광고수익형 허브의 핵심인 내부 이동을 만든다.
3. 세 번째: 2번 TOP 7 랭킹 + 3번 카드뉴스. 스크롤과 공유 가능성을 높인다.
4. 네 번째: 4번 식단 룰렛, 5번 D-day 보드, 6번 주말 코스 게임. 실제 체류시간을 만드는 도구형 콘텐츠로 확장한다.
5. 보조 강화: 7번 관점 비교, 9번 숨은 생활 메모. FamilySpace만의 개인적 신뢰와 재미를 만든다.

## 첫 구현 브리프 초안

- 히어로 문구를 “베트남에서 가족으로 살 때, 오늘 필요한 답부터 찾는 곳”에서 한 단계 더 질문형으로 바꾼다: “지금 막힌 게 생활비, 아기, 서류, 주말 중 무엇인가요?”
- 첫 화면 오른쪽 `오늘 바로 필요한 것` 카드에는 4개의 즉시 선택지를 유지하되, 클릭 시 아래의 미니 진단/결과 보드로 이동하게 한다.
- `처음 온 가족이 많이 찾는 것` 영역은 퍼센트 바보다 `TOP 질문 랭킹` 또는 `오늘의 많이 막히는 순간`으로 바꾸면 호기심이 더 강하다.
- 중간 섹션에는 실제 광고 대신 `관련 가이드 자리 / 향후 콘텐츠 브레이크`를 표시한다.
- 모든 카드에는 “경험 기반”, “공식 확인 필요”, “최근 업데이트” 같은 신뢰 라벨을 붙인다.

## 광고/수익화 관점 메모

- 첫 화면 최상단에는 광고를 넣지 않는다. 먼저 방문자가 문제를 찾고 신뢰를 느끼게 해야 한다.
- 광고 후보 위치는 다음 4곳이 안전하다.
  1. 미니 진단 결과 아래
  2. TOP 7 랭킹 3~4위 사이
  3. 체크리스트/비교표 아래
  4. 다음 클릭 루프 아래
- 제휴/다운로드는 “무료 체크리스트”, “생활비 표”, “장보기 리스트”처럼 유용한 자료를 먼저 만든 뒤 붙인다.
- 비자, 의료, 재정 콘텐츠에는 단정 문구를 피하고 공식 확인 안내를 항상 둔다.
