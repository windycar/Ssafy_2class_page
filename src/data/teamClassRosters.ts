import type { TeamClassRoster } from "../types/classRoster";

/**
 * 랜덤 팀 편성에서 사용할 다른 반 명단입니다.
 *
 * - 한 사람의 id는 이 파일 안에서 겹치지 않게 작성합니다.
 * - username이 없으면 "@아이디" 대신 "1번"처럼 적어도 됩니다.
 * - class는 반 이름의 공백을 밑줄로 바꿔 작성합니다. 예: "광주_1반"
 * - 저장 후 개발 화면은 자동 갱신되며, 배포된 사이트는 다시 빌드해야 반영됩니다.
 */
export const ADDITIONAL_TEAM_CLASS_ROSTERS: TeamClassRoster[] = [
  {
    id: "gwangju-class-1",
    name: "광주 1반",
    students: [
      // 아래 형식을 복사해서 명단을 채워 주세요.
      // { id: 1001, name: "홍길동", username: "@g1_hong", class: "광주_1반" },
      { id: 1001, name: "김동민", username: "@dodoking99", class: "광주_1반" },
      { id: 1002, name: "김수현", username: "@k_sh4770", class: "광주_1반" },
    ],
  },
  {
    id: "gwangju-class-3",
    name: "광주 3반",
    students: [
      // { id: 3001, name: "홍길동", username: "@g3_hong", class: "광주_3반" },
    ],
  },
  {
    id: "gwangju-class-4",
    name: "광주 4반",
    students: [
      // { id: 4001, name: "홍길동", username: "@g4_hong", class: "광주_4반" },
    ],
  },
  {
    id: "gwangju-class-5",
    name: "광주 5반",
    students: [
      // { id: 5001, name: "홍길동", username: "@g5_hong", class: "광주_5반" },
    ],
  },
  {
    id: "gwangju-class-6",
    name: "광주 6반",
    students: [
      // { id: 6001, name: "홍길동", username: "@g6_hong", class: "광주_6반" },
    ],
  },
];
