import test from "node:test";
import assert from "node:assert/strict";
import type { DinnerPoll, DinnerResponse } from "../src/types/dinner.ts";
import { getDinnerDates, isDateOnly, isDinnerPollOpen, rankDinnerDates, summarizeDinnerResponses, validateDinnerPoll, validateDinnerResponse,
  getDinnerCommonDates, getDinnerDateAvailability, getDinnerMonthCells, getDinnerMonths, sortDinnerDateAvailability } from "../src/utils/dinnerPoll.ts";

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

test("날짜별 명단은 참여·늦참·불참·날짜 미선택을 정확히 나눈다", () => {
  const responses = [response(1, "attending", ["2026-10-20", "2026-10-21"]), response(2, "late", ["2026-10-21"]), response(3, "absent", [])];
  const rows = getDinnerDateAvailability(poll, responses);
  assert.deepEqual(rows[0].available.map(r => r.member_id), [1]);
  assert.deepEqual(rows[0].unavailable.map(r => r.member_id), [2, 3]);
  assert.deepEqual(rows[1].available.map(r => r.member_id), [1, 2]);
  assert.deepEqual(rows[1].unavailable.map(r => r.member_id), [3]);
  assert.deepEqual(getDinnerCommonDates(rows), []);
});

test("특정 회원들로 필터하면 해당 회원들만 공통 가능일 계산에 포함된다", () => {
  const responses = [response(1, "attending", ["2026-10-20", "2026-10-21"]), response(2, "late", ["2026-10-21"]), response(3, "absent", [])];
  assert.deepEqual(getDinnerCommonDates(getDinnerDateAvailability(poll, responses, [1, 2])), ["2026-10-21"]);
  assert.deepEqual(getDinnerCommonDates(getDinnerDateAvailability(poll, responses, [1])), ["2026-10-20", "2026-10-21"]);
  assert.deepEqual(getDinnerCommonDates(getDinnerDateAvailability(poll, responses, [3])), []);
});

test("빈 필터·취소된 회원·다른 투표의 응답은 모두 가능한 날로 잘못 계산하지 않는다", () => {
  const responses = [response(1, "attending", ["2026-10-20"]), { ...response(2, "attending", ["2026-10-20"]), poll_id: "another-poll" }];
  const emptyRows = getDinnerDateAvailability(poll, responses, []);
  assert.ok(emptyRows.every(row => row.available.length === 0 && row.unavailable.length === 0));
  assert.deepEqual(getDinnerCommonDates(emptyRows), []);
  assert.deepEqual(getDinnerCommonDates(getDinnerDateAvailability(poll, responses, [999])), []);
  assert.equal(getDinnerDateAvailability(poll, responses)[0].available.length, 1);
});

test("가능 인원순·빠른 날짜순은 원본을 변경하지 않고 동률을 날짜순으로 정렬한다", () => {
  const rows = getDinnerDateAvailability(poll, [response(1, "attending", ["2026-10-21", "2026-10-22"])]);
  assert.deepEqual(sortDinnerDateAvailability(rows, "people").map(row => row.date), ["2026-10-21", "2026-10-22", "2026-10-20"]);
  assert.deepEqual(sortDinnerDateAvailability(rows, "date").map(row => row.date), ["2026-10-20", "2026-10-21", "2026-10-22"]);
  assert.equal(rows[0].date, "2026-10-20");
});

test("달력은 월·연도 경계와 윤년을 실제 요일 위치에 맞춰 구성한다", () => {
  assert.deepEqual(getDinnerMonths("2026-12-25", "2027-01-05"), ["2026-12", "2027-01"]);
  const october = getDinnerMonthCells("2026-10");
  assert.equal(october[4], "2026-10-01");
  assert.equal(october.filter(Boolean).length, 31);
  assert.equal(october.length % 7, 0);
  assert.ok(getDinnerMonthCells("2028-02").includes("2028-02-29"));
  assert.equal(getDinnerMonthCells("2026-02").filter(Boolean).length, 28);
  assert.deepEqual(getDinnerMonthCells("2026-13"), []);
});
