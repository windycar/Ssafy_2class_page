import { UsersRound } from "lucide-react";
import type { DinnerPoll, DinnerResponse, DinnerStatus } from "../../types/dinner";
import { DINNER_STATUS_LABELS } from "../../types/dinner";
import { formatDinnerDate, summarizeDinnerResponses } from "../../utils/dinnerPoll";
import DinnerAvailabilityResults from "./DinnerAvailabilityResults";

export default function DinnerPollResults({ poll, responses }: { poll: DinnerPoll; responses: DinnerResponse[] }) {
  const counts = summarizeDinnerResponses(responses);
  return <section className="space-y-5" aria-labelledby="dinner-results">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="dinner-results" className="flex items-center gap-2 font-extrabold text-gray-900"><UsersRound className="h-5 w-5 text-[#1259AA]" />참여 현황</h2><span className="text-xs text-gray-500">총 {responses.length}명 응답 · 참석 예정 {counts.attending + counts.late}명</span></div>
    <div className="grid grid-cols-3 gap-3">{(["attending", "absent", "late"] as const).map(status => <div key={status} className={`rounded-2xl border p-4 ${status === "attending" ? "border-emerald-100 bg-emerald-50 text-emerald-800" : status === "late" ? "border-amber-100 bg-amber-50 text-amber-800" : "border-rose-100 bg-rose-50 text-rose-800"}`}><div className="text-xs font-bold">{DINNER_STATUS_LABELS[status]}</div><div className="mt-1 text-2xl font-black">{counts[status]}<span className="ml-1 text-xs font-medium">명</span></div></div>)}</div>
    {poll.mode === "availability" && <DinnerAvailabilityResults key={poll.id} poll={poll} responses={responses} />}
    <div className="rounded-2xl border border-gray-200 bg-white p-5"><h3 className="mb-4 text-sm font-extrabold text-gray-800">응답자 목록</h3>
      {!responses.length ? <p className="py-5 text-center text-sm text-gray-400">아직 응답이 없습니다.</p> : <ul className="divide-y divide-gray-100">{responses.map(response => <li key={response.member_id} className="py-3 first:pt-0 last:pb-0">
        <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold text-gray-800">{response.participant_name}</span><span className={`rounded-lg px-2 py-1 text-xs font-bold ${statusClass(response.status)}`}>{DINNER_STATUS_LABELS[response.status]}</span>{response.status === "late" && response.arrival_time && <span className="text-xs text-gray-500">{response.arrival_time.slice(0, 5)} 도착 예정</span>}</div>
        {response.available_dates.length > 0 && <p className="mt-2 text-xs leading-5 text-blue-800">{response.available_dates.map(formatDinnerDate).join(" · ")}</p>}
        {response.note && <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-gray-500">{response.note}</p>}
      </li>)}</ul>}
    </div>
  </section>;
}

function statusClass(status: DinnerStatus) {
  return status === "attending" ? "bg-emerald-50 text-emerald-800" : status === "late" ? "bg-amber-50 text-amber-800" : "bg-rose-50 text-rose-800";
}
