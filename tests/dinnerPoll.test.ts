import test from "node:test";
import assert from "node:assert/strict";
import type { DinnerPoll, DinnerResponse } from "../src/types/dinner.ts";
import { getDinnerDates, isDateOnly, isDinnerPollOpen, rankDinnerDates, summarizeDinnerResponses, validateDinnerPoll, validateDinnerResponse } from "../src/utils/dinnerPoll.ts";

const poll: DinnerPoll = { id: "test", title: "우리 반 회식", mode: "availability", location: "장소 미정", location_url: "",
  event_date: null, event_time: "18:30", date_start: "2026-10-20", date_end: "2026-10-22", deadline: null,
  notice: "", is_closed: false, created_by: "admin", created_at: "2026-10-13T00:00:00Z", updated_at: "2026-10-13T00:00:00Z" };
const now = Date.parse("2026-10-13T00:00:00Z");
const response = (member_id: number, status: DinnerResponse["status"], dates: string[]): DinnerResponse => ({
  poll_id: poll.id, member_id, participant_name: `학생 ${member_id}`, status, available_dates: dates, arrival_time: null, note: "", updated_at: poll.updated_at,
});

test("실제 달력 날짜와 최대 60일의 후보 범위를 검증한다", () => {
  assert.equal(isDateOnly("2026-02-30"), false);
  assert.equal(isDateOnly("2028-02-29"), true);
  assert.deepEqual(getDinnerDates("2026-10-20", "2026-10-22"), ["2026-10-20", "2026-10-21", "2026-10-22"]);
  assert.equal(getDinnerDates("2026-01-01", "2026-03-01").length, 60);
  assert.deepEqual(getDinnerDates("2026-01-01", "2026-03-02"), []);
  assert.deepEqual(getDinnerDates("2026-10-22", "2026-10-20"), []);
});

test("관리자 입력은 일정·시간·안전한 장소 링크·마감 시간을 검증한다", () => {
  assert.throws(() => validateDinnerPoll({ ...poll, title: " " }), /제목/);
  assert.throws(() => validateDinnerPoll({ ...poll, location_url: "javascript:alert(1)" }), /링크/);
  assert.throws(() => validateDinnerPoll({ ...poll, event_time: "24:30" }), /시간/);
  assert.throws(() => validateDinnerPoll({ ...poll, mode: "attendance", event_date: "2026-02-30" }), /날짜/);
  assert.throws(() => validateDinnerPoll({ ...poll, mode: "attendance", event_date: "2026-10-20", deadline: "2026-10-20T10:00:00Z" }), /마감/);
  assert.equal(validateDinnerPoll({ ...poll, title: " 회식 " }).title, "회식");
});

test("가능한 날짜는 중복 제거하고 범위 밖 날짜와 빈 선택은 거절한다", () => {
  const input = { status: "attending" as const, available_dates: ["2026-10-21", "2026-10-20", "2026-10-21"], arrival_time: null, note: " 메모 " };
  const result = validateDinnerResponse(poll, input, now);
  assert.deepEqual(result.available_dates, ["2026-10-20", "2026-10-21"]);
  assert.equal(result.note, "메모");
  assert.throws(() => validateDinnerResponse(poll, { ...input, available_dates: [] }, now), /날짜/);
  assert.throws(() => validateDinnerResponse(poll, { ...input, available_dates: ["2026-10-23"] }, now), /날짜/);
});

test("불참이나 날짜 확정 응답으로 수정하면 이전 후보 날짜와 늦참 시간을 제거한다", () => {
  const input = { status: "absent" as const, available_dates: ["2026-10-20"], arrival_time: "19:00", note: "" };
  assert.deepEqual(validateDinnerResponse(poll, input, now), { ...input, available_dates: [], arrival_time: null });
  assert.deepEqual(validateDinnerResponse({ ...poll, mode: "attendance", event_date: "2026-10-20" }, { ...input, status: "attending" }, now).available_dates, []);
});

test("늦참 시간은 선택 사항이며 시작 시간 이후만 허용한다", () => {
  const input = { status: "late" as const, available_dates: ["2026-10-20"], arrival_time: null, note: "" };
  assert.equal(validateDinnerResponse(poll, input, now).arrival_time, null);
  assert.equal(validateDinnerResponse(poll, { ...input, arrival_time: "19:00" }, now).arrival_time, "19:00");
  assert.throws(() => validateDinnerResponse(poll, { ...input, arrival_time: "18:00" }, now), /시작 이후/);
});

test("수동 마감·자동 마감·한국 시간 회식 시작을 경계에서 정확히 차단한다", () => {
  assert.equal(isDinnerPollOpen({ ...poll, is_closed: true }, now), false);
  assert.equal(isDinnerPollOpen({ ...poll, deadline: new Date(now).toISOString() }, now), false);
  const fixed = { ...poll, mode: "attendance" as const, event_date: "2026-10-20" };
  assert.equal(isDinnerPollOpen(fixed, Date.parse("2026-10-20T09:29:59Z")), true);
  assert.equal(isDinnerPollOpen(fixed, Date.parse("2026-10-20T09:30:00Z")), false);
  assert.throws(() => validateDinnerResponse({ ...poll, is_closed: true }, { status: "absent", available_dates: [], arrival_time: null, note: "" }, now), /마감/);
});

test("집계에는 현재 참여와 늦참만 반영하며 동률 날짜는 날짜순으로 정렬한다", () => {
  const responses = [response(1, "attending", ["2026-10-20", "2026-10-21"]), response(2, "late", ["2026-10-21"]), response(3, "absent", ["2026-10-22"])];
  assert.deepEqual(summarizeDinnerResponses(responses), { attending: 1, absent: 1, late: 1 });
  assert.deepEqual(rankDinnerDates(poll, responses), [{ date: "2026-10-21", count: 2 }, { date: "2026-10-20", count: 1 }, { date: "2026-10-22", count: 0 }]);
  assert.deepEqual(rankDinnerDates(poll, []).map(r => r.date), ["2026-10-20", "2026-10-21", "2026-10-22"]);
});
