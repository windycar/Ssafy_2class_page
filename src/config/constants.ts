import { STUDENTS } from "../data/students";

export const CLASS_NAME = "SSAFY 광주 2반";
export const SLOGAN = "함께 배우고, 함께 성장하는 우리 반";
export const TOTAL_STUDENTS = STUDENTS.length;
export const DEFAULT_TEAM_COUNT = 7;
export const DEFAULT_MEMBERS_PER_TEAM = 3;

export const GROUND_RULE_CATEGORIES = [
  { value: "time", label: "시간" },
  { value: "life", label: "생활" },
  { value: "care", label: "배려" },
  { value: "social", label: "친목" },
  { value: "facility", label: "시설" },
  { value: "etc", label: "기타" },
] as const;

export const PHOTO_CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "class", label: "수업" },
  { value: "project", label: "프로젝트" },
  { value: "event", label: "행사" },
  { value: "lunch", label: "점심" },
  { value: "dinner", label: "회식" },
  { value: "etc", label: "기타" },
] as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "미입금",
  paid: "입금 완료",
  ordered: "주문 완료",
  received: "수령 완료",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: "bg-red-100 text-red-700",
  paid: "bg-green-100 text-green-700",
  ordered: "bg-blue-100 text-blue-700",
  received: "bg-gray-100 text-gray-600",
};
