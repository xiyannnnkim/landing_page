# 업무고충토로 및 개선방안추진 — 가을 모임 랜딩페이지

11/11(수) ~ 13(금) 석식 모임의 일정·식당을 정하기 위한 정적 페이지입니다. 기획은 [PRD.md](PRD.md)를 참고하세요.

| 파일 | 역할 |
|---|---|
| `index.html` | 페이지 구조 (결재판 인트로 · Hero · 참석자 · 후보 식당 · 회신서) |
| `styles.css` | 가을 테마 디자인 |
| `main.js` | 인트로 연출, D-day, 달력, 식당 카드, 회신서 전송 |
| `restaurants.js` | **후보 식당 데이터 — 조사 결과는 여기만 수정** |

## GitHub Pages 배포 (무료)

- 저장소: https://github.com/xiyannnnkim/landing_page
- 배포 주소: **https://xiyannnnkim.github.io/landing_page/**

1. 저장소 **Settings → Pages**
   - Source: **Deploy from a branch** / Branch: **main**, 폴더 **/(root)** → Save
2. 1~2분 뒤 위 배포 주소로 접속 확인 (저장소가 **Public**이어야 무료로 동작)
3. Web3Forms 대시보드에서 폼의 **Website URL**을 위 주소로 수정
4. 회신서에서 **테스트 제출 1회** → 사내메일 수신 확인 (스팸함도 확인)

## 후보 식당 업데이트

github.com 저장소에서 `restaurants.js` → 연필 아이콘(Edit) → 내용 수정 → **Commit changes**.
1~2분 뒤 페이지에 자동 반영됩니다. 작성 방법은 파일 상단 주석의 예시를 참고하세요.

- 조사 완료 시 `status`를 `"ready"`로 바꾸면 "조사 중" 표시가 사라집니다.
- `naverUrl`: 네이버 지도에서 식당 검색 → **공유** → 링크 복사 (`https://naver.me/...`)

## 참고

- 인트로는 같은 브라우저 창에서 한 번만 나옵니다. 다시 보려면 새 창(탭)에서 여세요.
- `https://xiyannnnkim.github.io/landing_page/#reply` 처럼 주소 끝에 `#reply`를 붙이면 인트로 없이 회신서로 바로 이동합니다.
- 저장소가 공개이므로 참석자 메일 주소 등 개인정보는 파일에 넣지 마세요. (Web3Forms 액세스 키는 공개돼도 수신 주소가 드러나지 않습니다.)
