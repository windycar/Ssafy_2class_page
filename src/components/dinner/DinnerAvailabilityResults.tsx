import { useState } from "react";
import { CalendarDays, Check, ChevronDown, ListOrdered, SlidersHorizontal, UsersRound, X } from "lucide-react";
import type { DinnerPoll, DinnerResponse } from "../../types/dinner";
import { formatDinnerDate, getDinnerCommonDates, getDinnerDateAvailability, sortDinnerDateAvailability, type DinnerDateAvailability } from "../../utils/dinnerPoll";
import DinnerCalendar from "./DinnerCalendar";

export default function DinnerAvailabilityResults({ poll, responses }: { poll: DinnerPoll; responses: DinnerResponse[] }) {
  const [view, setView] = useState<"calendar" | "priority">("calendar");
  const [sort, setSort] = useState<"people" | "date">("people");
  const [selectedIds, setSelectedIds] = useState<number[] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftIds, setDraftIds] = useState<number[]>([]);
  const [activeDate, setActiveDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  const dates = getDinnerDateAvailability(poll, responses, selectedIds);
  const ranked = sortDinnerDateAvailability(dates, sort);
  const commonDates = getDinnerCommonDates(dates);
  const total = dates.length ? dates[0].available.length + dates[0].unavailable.length : 0;
  const maximum = Math.max(0, ...dates.map(row => row.available.length));
  const inspected = dates.find(row => row.date === activeDate) ?? sortDinnerDateAvailability(dates, "people")[0];
  const dateCounts = new Map(dates.map(row => [row.date, row.available.length]));
  const visibleDates = showAll ? ranked : ranked.slice(0, 5);

  function openFilter() {
    setDraftIds(selectedIds ?? responses.map(response => response.member_id));
    setFilterOpen(previous => !previous);
  }

  return <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div><h3 className="font-extrabold text-gray-900">우리 반은 언제 만날까요?</h3><p className="mt-1 text-xs leading-5 text-gray-400">응답한 {responses.length}명의 가능한 날짜를 모았어요.</p></div>
      <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#1259AA]">날짜 조율</span>
    </div>

    <div role="group" aria-label="일정 결과 보기 방식" className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
      <button type="button" aria-pressed={view === "calendar"} onClick={() => setView("calendar")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold ${view === "calendar" ? "bg-white text-[#1259AA] shadow-sm" : "text-gray-400"}`}><CalendarDays className="h-4 w-4" />달력 현황</button>
      <button type="button" aria-pressed={view === "priority"} onClick={() => setView("priority")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold ${view === "priority" ? "bg-white text-[#1259AA] shadow-sm" : "text-gray-400"}`}><ListOrdered className="h-4 w-4" />우선순위</button>
    </div>

    <div className="relative mb-4 flex flex-wrap items-center gap-2">
      <button type="button" aria-expanded={filterOpen} onClick={openFilter} disabled={!responses.length} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-[#1259AA] disabled:opacity-40"><UsersRound className="h-3.5 w-3.5" />{selectedIds === null ? "전체 응답자" : `${total}명 선택`}<ChevronDown className="h-3.5 w-3.5" /></button>
      {view === "priority" && <label className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1 text-xs font-bold text-gray-500"><SlidersHorizontal className="h-3.5 w-3.5" /><select aria-label="날짜 정렬" className="min-w-0 bg-transparent py-1 outline-none" value={sort} onChange={event => setSort(event.target.value as "people" | "date")}><option value="people">가능 인원 많은 순</option><option value="date">빠른 날짜 순</option></select></label>}
      {selectedIds !== null && <button type="button" onClick={() => { setSelectedIds(null); setFilterOpen(false); }} className="text-xs font-semibold text-gray-400 underline">필터 초기화</button>}
      {filterOpen && <div role="group" aria-label="참여자 필터" onKeyDown={event => { if (event.key === "Escape") setFilterOpen(false); }} className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/10">
        <div className="mb-3 flex items-center justify-between"><p className="text-sm font-extrabold text-gray-800">함께 확인할 회원</p><button type="button" aria-label="참여자 필터 닫기" onClick={() => setFilterOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50"><X className="h-4 w-4" /></button></div>
        <p className="mb-3 text-xs leading-5 text-gray-400">선택한 회원들 기준으로 공통 가능한 날과 인원을 계산합니다.</p>
        <div className="flex gap-3 pb-3 text-xs font-bold"><button type="button" onClick={() => setDraftIds(responses.map(response => response.member_id))} className="text-[#1259AA]">전체 선택</button><button type="button" onClick={() => setDraftIds([])} className="text-gray-400">선택 해제</button></div>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">{responses.map(response => <label key={response.member_id} className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold ${draftIds.includes(response.member_id) ? "border-blue-200 bg-blue-50 text-blue-900" : "border-gray-100 text-gray-500"}`}><input type="checkbox" className="h-4 w-4 shrink-0 accent-[#1259AA]" checked={draftIds.includes(response.member_id)} onChange={event => setDraftIds(previous => event.target.checked ? [...previous, response.member_id] : previous.filter(id => id !== response.member_id))} /><span className="break-words">{response.participant_name}</span></label>)}</div>
        <button type="button" disabled={!draftIds.some(id => responses.some(response => response.member_id === id))} onClick={() => { setSelectedIds(draftIds); setFilterOpen(false); }} className="mt-4 w-full rounded-xl bg-[#1259AA] py-2.5 text-xs font-bold text-white disabled:opacity-30">선택한 회원 적용</button>
      </div>}
    </div>

    <div className={`mb-4 rounded-2xl border p-4 ${commonDates.length ? "border-blue-200 bg-blue-50" : "border-dashed border-gray-200 bg-gray-50"}`}>
      {!total ? <p className="text-center text-xs leading-5 text-gray-400">{responses.length ? "선택한 회원의 응답이 없습니다. 필터를 초기화해 주세요." : "응답이 모이면 함께 가능한 날짜를 알려 드릴게요."}</p>
        : commonDates.length ? <><p className="flex items-center gap-1.5 text-xs font-extrabold text-[#1259AA]"><Check className="h-4 w-4" />{selectedIds === null ? "응답자" : "선택한 회원"} {total}명 모두 가능한 날</p><p className="mt-2 text-xs leading-6 text-blue-900">{commonDates.slice(0, 4).map(formatDinnerDate).join(" · ")}{commonDates.length > 4 && ` 외 ${commonDates.length - 4}일`}</p></>
          : <><p className="text-center text-xs font-bold text-gray-500">{selectedIds === null ? "응답자" : "선택한 회원"} 모두 가능한 날이 아직 없어요.</p><p className="mt-1 text-center text-[11px] text-gray-400">{maximum > 0 ? `가장 많은 인원이 가능한 날은 ${total}명 중 ${maximum}명이 함께할 수 있어요.` : "현재 선택한 회원들의 가능한 날짜가 없습니다."}</p></>}
    </div>

    {view === "calendar" ? <div className="space-y-4">
      <DinnerCalendar start={poll.date_start} end={poll.date_end} counts={dateCounts} total={total} activeDate={inspected?.date} onInspect={setActiveDate} label="참여 현황 달력" />
      <p className="text-center text-[11px] text-gray-400">날짜를 누르면 가능한 회원과 어려운 회원을 확인할 수 있습니다.</p>
      {total > 0 && inspected && <DinnerDateCard row={inspected} time={poll.event_time} recommended={inspected.available.length === maximum && maximum > 0} />}
    </div> : total === 0 ? <p className="py-6 text-center text-xs text-gray-400">응답이 모이면 날짜별 우선순위를 확인할 수 있습니다.</p> : <div className="space-y-3">
      {visibleDates.map(row => <DinnerDateCard key={row.date} row={row} time={poll.event_time} recommended={row.available.length === maximum && maximum > 0} />)}
      {ranked.length > 5 && <button type="button" onClick={() => setShowAll(previous => !previous)} className="w-full rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50">{showAll ? "5개 날짜만 보기" : `후보 날짜 모두 보기 (${ranked.length}개)`}</button>}
    </div>}
    <p className="mt-4 text-[10px] leading-5 text-gray-400">불가능은 불참 또는 해당 날짜를 선택하지 않은 응답자입니다. 아직 응답하지 않은 회원은 집계에 포함하지 않습니다. 날짜는 관리자가 최종 확정합니다.</p>
  </div>;
}

function DinnerDateCard({ row, time, recommended }: { row: DinnerDateAvailability; time: string; recommended: boolean }) {
  const total = row.available.length + row.unavailable.length;
  return <details open className="group rounded-2xl border border-blue-100 bg-[#f5f8fe] p-4">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 [&::-webkit-details-marker]:hidden"><div className="flex flex-wrap items-center gap-2"><h4 className="text-sm font-extrabold text-gray-800">{formatDinnerDate(row.date)}</h4>{recommended && <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-[#1259AA]">최다 인원</span>}<span className="text-[10px] text-gray-400">{time.slice(0, 5)}</span></div><ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" /></summary>
    <div className="mt-4 space-y-4">
      <div><p className="mb-2 text-[11px] text-gray-400">{total}명 중 <b className="text-[#1259AA]">{row.available.length}명 가능</b></p><MemberChips members={row.available} available /></div>
      <div><p className="mb-2 text-[11px] text-gray-400">{total}명 중 <b className="text-rose-500">{row.unavailable.length}명 불가능</b></p><MemberChips members={row.unavailable} available={false} /></div>
    </div>
  </details>;
}

function MemberChips({ members, available }: { members: DinnerResponse[]; available: boolean }) {
  return members.length ? <ul className="flex flex-wrap gap-1.5">{members.map(member => <li key={member.member_id} className={`rounded-lg border bg-white px-2 py-1.5 text-[11px] ${available ? "border-blue-100 text-gray-600" : "border-gray-100 text-gray-400"}`}>{member.participant_name}{available && member.status === "late" && <span className="ml-1 text-[9px] text-amber-600">늦참{member.arrival_time ? ` ${member.arrival_time.slice(0, 5)}` : ""}</span>}</li>)}</ul> : <p className="text-[11px] text-gray-300">없음</p>;
}
