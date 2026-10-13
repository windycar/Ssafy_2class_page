import { useEffect, useState, type FormEvent } from "react";
import { Check, Clock3, X } from "lucide-react";
import type { DinnerPoll, DinnerResponse, DinnerResponseInput, DinnerStatus } from "../../types/dinner";
import { DINNER_STATUS_LABELS } from "../../types/dinner";
import { formatDinnerDate, getDinnerDates, validateDinnerResponse } from "../../utils/dinnerPoll";
import { DINNER_INPUT } from "./DinnerPollForm";
import DinnerCalendar from "./DinnerCalendar";

const STATUS_ICONS = { attending: Check, absent: X, late: Clock3 };
const STATUS_COLORS = { attending: "border-emerald-500 bg-emerald-50 text-emerald-800", absent: "border-rose-400 bg-rose-50 text-rose-800", late: "border-amber-500 bg-amber-50 text-amber-800" };

export default function DinnerResponseForm({ poll, response, open, isDemo, onSave, onCancel }: {
  poll: DinnerPoll; response?: DinnerResponse; open: boolean; isDemo: boolean;
  onSave: (input: DinnerResponseInput) => Promise<void>; onCancel: () => Promise<void>;
}) {
  const [status, setStatus] = useState<DinnerStatus | "">(response?.status ?? "");
  const [dates, setDates] = useState<string[]>(response?.available_dates ?? []);
  const [arrival, setArrival] = useState(response?.arrival_time?.slice(0, 5) ?? "");
  const [note, setNote] = useState(response?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const disabled = busy || !open || isDemo;
  useEffect(() => {
    setStatus(response?.status ?? ""); setDates(response?.available_dates ?? []);
    setArrival(response?.arrival_time?.slice(0, 5) ?? ""); setNote(response?.note ?? "");
  }, [response?.updated_at]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!status) { setError("참여·불참·늦참 중 하나를 선택해 주세요."); return; }
    setBusy(true);
    try { await onSave(validateDinnerResponse(poll, { status, available_dates: dates, arrival_time: arrival || null, note })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "응답을 저장하지 못했습니다."); }
    finally { setBusy(false); }
  }
  async function cancel() {
    setBusy(true); setError("");
    try { await onCancel(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "응답을 취소하지 못했습니다."); }
    finally { setBusy(false); }
  }
  return <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6" aria-labelledby="my-dinner-response">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 id="my-dinner-response" className="font-extrabold text-gray-900">나의 참여 응답</h2>
      {response && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1259AA]">저장된 응답 · {DINNER_STATUS_LABELS[response.status]}</span>}</div>
    {isDemo ? <p className="mb-4 text-sm text-gray-500">체험용 예시입니다. 정식 계정으로 로그인하면 투표할 수 있습니다.</p>
      : !open ? <p className="mb-4 text-sm text-gray-500">마감된 투표입니다. 저장된 응답과 참여 현황을 확인할 수 있습니다.</p>
      : <p className="mb-4 text-sm text-gray-500">본인 계정으로 한 번 응답하며, 마감 전까지 수정하거나 취소할 수 있습니다.</p>}
    <form onSubmit={submit} className="space-y-4">
      <fieldset className="space-y-4">
        <legend className="sr-only">참여 여부 선택</legend>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {(["attending", "absent", "late"] as const).map(value => { const Icon = STATUS_ICONS[value]; return <button type="button" key={value} disabled={disabled} aria-pressed={status === value} onClick={() => setStatus(value)}
            className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-2 py-4 text-sm font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${status === value ? STATUS_COLORS[value] : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"}`}><Icon className="h-4 w-4" />{DINNER_STATUS_LABELS[value]}</button>; })}
        </div>
        {poll.mode === "availability" && (isDemo || (status && status !== "absent")) && <fieldset>
          <legend className="mb-3 text-sm font-bold text-gray-700">가능한 날짜를 모두 선택해 주세요 <span className="font-normal text-gray-400">({dates.length}개 선택)</span></legend>
          <DinnerCalendar start={poll.date_start} end={poll.date_end} selectedDates={dates} disabled={disabled}
            onToggle={date => setDates(previous => previous.includes(date) ? previous.filter(value => value !== date) : [...previous, date])} />
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold"><button type="button" disabled={disabled} onClick={() => setDates(getDinnerDates(poll.date_start, poll.date_end))} className="text-[#1259AA] disabled:text-gray-300">전체 날짜 선택</button><button type="button" disabled={disabled} onClick={() => setDates([])} className="text-gray-400 disabled:text-gray-300">선택 초기화</button></div>
          {dates.length > 0 && <p className="mt-3 text-xs leading-5 text-[#1259AA]">{[...dates].sort().slice(0, 5).map(formatDinnerDate).join(" · ")}{dates.length > 5 && ` 외 ${dates.length - 5}일`}</p>}
        </fieldset>}
        {status === "late" && <label className="block text-sm font-bold text-gray-700">도착 예정 시간 <span className="font-normal text-gray-400">(선택)</span><input type="time" disabled={disabled} className={DINNER_INPUT} value={arrival} onChange={e => setArrival(e.target.value)} /><span className="mt-1 block text-xs font-normal text-gray-500">{poll.mode === "availability" ? "선택한 날짜에 공통으로 적용할 도착 시간입니다." : "모르면 비워 두고 메모로 알려 주세요."}</span></label>}
        <label className="block text-sm font-bold text-gray-700">메모 <span className="font-normal text-gray-400">(참여자에게 공개 · 최대 300자)</span><textarea disabled={disabled} className={DINNER_INPUT} rows={2} maxLength={300} value={note} onChange={e => setNote(e.target.value)} placeholder="예: 7시쯤 도착해요 / 알레르기가 있어요" /></label>
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-3"><button disabled={disabled} className="rounded-xl bg-[#1259AA] px-5 py-3 text-sm font-bold text-white hover:bg-[#0d4a8f] disabled:opacity-40">{busy ? "처리 중…" : response ? "응답 수정 저장" : "응답 저장"}</button>
        {response && <button type="button" disabled={disabled} onClick={() => void cancel()} className="px-2 py-3 text-sm font-semibold text-gray-500 underline underline-offset-4 disabled:opacity-40">내 응답 취소</button>}</div>
    </form>
  </section>;
}
