import type { DinnerPoll, DinnerResponse } from "../types/dinner";

export function getDinnerDemoData(): { polls: DinnerPoll[]; responses: DinnerResponse[] } {
  const day = (offset: number) => new Date(Date.now() + 9 * 3600000 + offset * 86400000).toISOString().slice(0, 10);
  const poll: DinnerPoll = { id: "demo-dinner", title: "우리 반 회식 · 날짜를 골라 주세요", mode: "availability",
    location: "장소 미정 · 날짜가 정해지면 안내할게요", location_url: "", event_date: null, event_time: "18:30",
    date_start: day(1), date_end: day(7), deadline: null, notice: "회식 날짜를 함께 정하는 체험용 예시입니다. 가능한 날짜를 여러 개 선택할 수 있어요.",
    is_closed: false, created_by: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  const response = (member_id: number, status: DinnerResponse["status"], dates: number[]): DinnerResponse => ({
    poll_id: poll.id, member_id, participant_name: `체험 학생 ${member_id}`, status,
    available_dates: dates.map(day), arrival_time: status === "late" ? "19:00" : null,
    note: "", updated_at: new Date().toISOString(),
  });
  return { polls: [poll], responses: [response(1, "attending", [1, 3, 5]), response(2, "late", [3, 5]), response(3, "absent", [])] };
}
