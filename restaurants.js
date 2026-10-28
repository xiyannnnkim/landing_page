/* =========================================================
   후보 식당 데이터
   ---------------------------------------------------------
   조사가 끝나면 이 파일만 수정하면 됩니다.
   (카드와 회신서의 "희망 식당" 선택지가 함께 바뀝니다)

   status      : "researching" (조사 중) | "ready" (조사 완료)
   name        : 식당 이름
   category    : 한식 / 고기 / 일식 등
   description : 한두 줄 소개
   address     : 주소
   walkMinutes : 회사(소공로 94)에서 도보 시간(분)
   hours       : 영업시간 (브레이크타임·라스트오더 포함)
   menus       : 대표 메뉴 [{ name, price }]
   naverUrl    : 네이버 지도 장소 링크 (https://naver.me/... 또는 https://map.naver.com/...)
   mapQuery    : naverUrl 이 없을 때 네이버 지도에서 검색할 말 (없으면 식당 이름)
   photo       : 대표 사진 경로 (예: "images/a.jpg"), 없으면 ""
   note        : 룸·예약 등 참고 사항 (선택)

   ── 작성 예시 ──
   {
     status: "ready",
     name: "○○식당",
     category: "한식",
     description: "룸이 있어 조용히 이야기 나누기 좋은 곳",
     address: "서울 중구 ○○로 00",
     walkMinutes: 7,
     hours: "11:30–22:00 (브레이크 15:00–17:00, L.O. 21:00)",
     menus: [{ name: "○○정식", price: "25,000원" }],
     naverUrl: "https://naver.me/xxxxxx",
     photo: "",
     note: "4인 룸 예약 가능"
   }
   ========================================================= */

window.RESTAURANTS = [
  {
    status: "ready",
    name: "천향원 시청점",
    category: "훠궈",
    description: "무한리필 중국식 샤브샤브(훠궈). 넓고 깔끔한 공간에 프라이빗룸도 있습니다.",
    address: "서울 중구 남대문로7길 33 소공빌딩 2층",
    walkMinutes: 2,
    hours: "매일 11:30–22:00",
    menus: [
      { name: "샤브샤브 무한리필 (디너·주말·공휴일)", price: "24,900원" },
      { name: "샤브샤브 무한리필 (평일 런치)", price: "19,000원" }
    ],
    naverUrl: "",
    photo: "",
    note: "프라이빗룸 · 단체 이용 가능, 네이버 예약(2~8명)"
  },
  {
    status: "ready",
    name: "등촌샤브칼국수 종각점",
    category: "칼국수",
    description: "얼큰한 샤브 국물에 미나리 듬뿍. 쌀쌀한 날 저녁으로 든든합니다.",
    address: "서울 종로구 종로8길 20 2층",
    walkMinutes: 18,
    hours: "매일 10:00–22:00 (브레이크 15:30–17:00, L.O. 21:20)",
    menus: [
      { name: "소고기+쭈꾸미 코스", price: "17,900원" },
      { name: "소고기 코스 (평일 오후·주말)", price: "14,900원" },
      { name: "메밀전병", price: "6,000원" }
    ],
    naverUrl: "",
    photo: "",
    note: "종각역 4번 출구 110m · 단체석, 네이버 예약 가능"
  },
  {
    status: "ready",
    name: "해남정",
    category: "쭈꾸미·삼겹살",
    description: "쭈꾸미와 오겹살을 함께 구워 먹는 집. 설탕을 쓰지 않는다고 합니다.",
    address: "서울 종로구 삼봉로 81 두산위브파빌리온 지하",
    walkMinutes: 24,
    hours: "",
    menus: [
      { name: "해남정 추천메뉴 (쭈꾸미·벌교꼬막·오겹살, 1인)", price: "11,000원" },
      { name: "쭈꾸미제육쌈밥", price: "11,000원" }
    ],
    naverUrl: "",
    mapQuery: "두산위브파빌리온",
    photo: "",
    note: "광화문역 11번 출구 284m · 네이버 지도 미등록, 가격은 2026년 8월 블로그 방문 기준"
  },
  {
    status: "ready",
    name: "블루메쯔 광화문점",
    category: "독일식",
    description: "캠핑 감성의 독일식 레스토랑. 슈바인학센이 대표 메뉴이고 라이브 공연도 있습니다.",
    address: "서울 종로구 새문안로3길 11",
    walkMinutes: 26,
    hours: "11:00–22:00 (브레이크 15:00–17:00, L.O. 21:00, 일요일 휴무)",
    menus: [
      { name: "슈바인학센", price: "45,000원" },
      { name: "오리지널 미트파이", price: "20,000원" }
    ],
    naverUrl: "",
    photo: "",
    note: "광화문역 1번 출구 274m · 네이버 예약 가능"
  },
  {
    status: "ready",
    name: "온더보더 광화문D타워점",
    category: "멕시칸",
    description: "화끈한 파히타 한 판. 나초는 무료 리필입니다.",
    address: "서울 종로구 종로3길 17 D타워 2층 204호",
    walkMinutes: 18,
    hours: "매일 11:00–22:00 (L.O. 21:00)",
    menus: [
      { name: "얼티밋 화이타 (안창살·풀드포크·치킨·쉬림프)", price: "59,000원" },
      { name: "콰트로 화이타", price: "65,000원" },
      { name: "더블 스택 클럽 퀘사디아 치킨", price: "36,000원" }
    ],
    naverUrl: "",
    photo: "",
    note: "광화문역 4번 출구 302m · 단체석, 네이버 예약 (콜키지 있음)"
  }
];
