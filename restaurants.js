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
    status: "researching",
    name: "후보 식당 A",
    category: "한식",
    description: "룸이 있어 고충을 마음껏 털어놓을 수 있는 한식집을 찾고 있습니다.",
    address: "",
    walkMinutes: null,
    hours: "",
    menus: [],
    naverUrl: "",
    photo: "",
    note: ""
  },
  {
    status: "researching",
    name: "후보 식당 B",
    category: "고기",
    description: "매서운 바람엔 역시 불판. 따뜻하게 구워 먹을 수 있는 곳을 찾고 있습니다.",
    address: "",
    walkMinutes: null,
    hours: "",
    menus: [],
    naverUrl: "",
    photo: "",
    note: ""
  },
  {
    status: "researching",
    name: "후보 식당 C",
    category: "일식",
    description: "조용한 분위기에서 술 한잔 곁들이기 좋은 이자카야·일식집을 찾고 있습니다.",
    address: "",
    walkMinutes: null,
    hours: "",
    menus: [],
    naverUrl: "",
    photo: "",
    note: ""
  }
];
