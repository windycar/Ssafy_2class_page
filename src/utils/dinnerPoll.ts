import type { DinnerPoll, DinnerPollInput, DinnerResponse, DinnerResponseInput } from "../types/dinner.ts";

export function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function getDinnerDates(start: string | null, end: string | null): string[] {
  if (!start || !end || !isDateOnly(start) || !isDateOnly(end) || end < start) return [];
  const days = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000 + 1;
  if (days > 60) return [];
  return Array.from({ length: days }, (_, i) => new Date(Date.parse(`${start}T00:00:00Z`) + i * 86400000).toISOString().slice(0, 10));
}

export function getDinnerStart(poll: Pick<DinnerPollInput, "mode" | "event_date" | "event_time">): number | null {
  return poll.mode === "attendance" && poll.event_date
    ? Date.parse(`${poll.event_date}T${poll.event_time}+09:00`) : null;
}

export function isDinnerPollOpen(poll: DinnerPoll, now = Date.now()): boolean {
  const start = getDinnerStart(poll);
  return !poll.is_closed && (!poll.deadline || Date.parse(poll.deadline) > now) && (start === null || start > now);
}

export function validateDinnerPoll(input: DinnerPollInput): DinnerPollInput {
  const title = input.title.trim();
  const location = input.location.trim();
  const notice = input.notice.trim();
  const locationUrl = input.location_url.trim();
  if (!title || title.length > 80) throw new Error("제목은 1~80자로 입력해 주세요.");
  if (!location || location.length > 200) throw new Error("장소는 1~200자로 입력해 주세요. 미정이면 ‘장소 미정’으로 적어 주세요.");
  if (notice.length > 2000) throw new Error("안내는 2,000자 이내로 입력해 주세요.");
  if (locationUrl && (!/^https?:\/\//i.test(locationUrl) || locationUrl.length > 1000)) throw new Error("장소 링크는 http 또는 https 주소로 입력해 주세요.");
  if (!/^([01]\d|2[0-3]):[0-5]\d(:00)?$/.test(input.event_time)) throw new Error("회식 시간을 입력해 주세요.");
  if (input.mode !== "attendance" && input.mode !== "availability") throw new Error("투표 방식을 확인해 주세요.");
  if (input.mode === "attendance" && (!input.event_date || !isDateOnly(input.event_date))) throw new Error("회식 날짜를 입력해 주세요.");
  if (input.mode === "availability" && !getDinnerDates(input.date_start, input.date_end).length) throw new Error("날짜 범위는 시작일부터 최대 60일로 지정해 주세요.");
  if (input.deadline && !Number.isFinite(Date.parse(input.deadline))) throw new Error("투표 마감 시간을 확인해 주세요.");
  const start = getDinnerStart(input);
  if (input.deadline && start !== null && Date.parse(input.deadline) > start) throw new Error("투표 마감은 회식 시작 시간 이전으로 설정해 주세요.");
  return { ...input, title, location, notice, location_url: locationUrl, event_time: input.event_time.slice(0, 5),
    event_date: input.mode === "attendance" ? input.event_date : null,
    date_start: input.mode === "availability" ? input.date_start : null,
    date_end: input.mode === "availability" ? input.date_end : null };
}

export function validateDinnerResponse(poll: DinnerPoll, input: DinnerResponseInput, now = Date.now()): DinnerResponseInput {
  if (!isDinnerPollOpen(poll, now)) throw new Error("마감된 투표입니다.");
  if (!["attending", "absent", "late"].includes(input.status)) throw new Error("참여·불참·늦참 중 하나를 선택해 주세요.");
  if (input.note.trim().length > 300) throw new Error("메모는 300자 이내로 입력해 주세요.");
  const dates = [...new Set(input.available_dates)].sort();
  if (input.status !== "absent" && poll.mode === "availability") {
    const options = new Set(getDinnerDates(poll.date_start, poll.date_end));
    if (!dates.length || dates.some(date => !options.has(date))) throw new Error("투표 범위 안에서 가능한 날짜를 하나 이상 선택해 주세요.");
  }
  if (input.status === "late" && input.arrival_time) {
    if (!/^([01]\d|2[0-3]):[0-5]\d(:00)?$/.test(input.arrival_time) || input.arrival_time.slice(0, 5) <= poll.event_time.slice(0, 5)) throw new Error("늦참 도착 시간은 회식 시작 이후로 입력해 주세요.");
  }
  return { status: input.status, note: input.note.trim(),
    available_dates: input.status !== "absent" && poll.mode === "availability" ? dates : [],
    arrival_time: input.status === "late" && input.arrival_time ? input.arrival_time.slice(0, 5) : null };
}

export function summarizeDinnerResponses(responses: DinnerResponse[]) {
  return { attending: responses.filter(r => r.status === "attending").length,
    absent: responses.filter(r => r.status === "absent").length,
    late: responses.filter(r => r.status === "late").length };
}

export function rankDinnerDates(poll: DinnerPoll, responses: DinnerResponse[]) {
  return getDinnerDates(poll.date_start, poll.date_end).map(date => ({ date,
    count: responses.filter(r => r.status !== "absent" && r.available_dates.includes(date)).length,
  })).sort((a, b) => b.count - a.count || a.date.localeCompare(b.date));
}

export function formatDinnerDate(date: string): string {
  return new Date(`${date}T00:00:00+09:00`).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short" });
}
