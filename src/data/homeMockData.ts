import type { Activity } from "../types/activity";
import { TOTAL_STUDENTS } from "../config/constants";

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "team",
    message: `새로운 팀 편성 결과가 생성되었습니다. (5개 팀, ${TOTAL_STUDENTS}명)`,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-2",
    type: "dinner",
    message: "회식 참여 투표에서 일정과 장소를 확인해 주세요.",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-3",
    type: "gallery",
    message: "사진첩에 새로운 사진 1장이 추가되었습니다. (1차 프로젝트 시작)",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-4",
    type: "groundRule",
    message: "그라운드 룰 8번이 추가되었습니다. (서먹서먹하지 않게 함께 한 끼 하기)",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
