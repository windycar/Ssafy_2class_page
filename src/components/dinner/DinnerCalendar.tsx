import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDinnerDate, getDinnerDates, getDinnerMonthCells, getDinnerMonths } from "../../utils/dinnerPoll";

const HEAT_COLORS = ["bg-slate-50 text-slate-400", "bg-blue-50 text-blue-700", "bg-blue-100 text-blue-800", "bg-blue-300 text-blue-950", "bg-[#1259AA] text-white"];

export default function DinnerCalendar({ start, end, selectedDates = [], onToggle, disabled = false,
  counts, total = 0, activeDate, onInspect, label = "가능한 날짜 달력" }: {
  start: string | null; end: string | null; selectedDates?: string[];
  onToggle?: (date: string) => void; disabled?: boolean;
  counts?: ReadonlyMap<string, number>; total?: number; activeDate?: string;
  onInspect?: (date: string) => void; label?: string;
}) {
  const months = getDinnerMonths(start, end);
  const [requestedMonth, setRequestedMonth] = useState(months[0] ?? "");
  const month = months.includes(requestedMonth) ? requestedMonth : months[0];
  const monthIndex = months.indexOf(month);
  const options = new Set(getDinnerDates(start, end));
  const selected = new Set(selectedDates);
  const cells = getDinnerMonthCells(month);
  const selectionMode = Boolean(onToggle);
  if (!month) return <p className="text-sm text-gray-400">선택 가능한 날짜가 없습니다.</p>;

  return <div role="group" aria-label={label} className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
    <div className="mb-4 flex items-center justify-between">
      <button type="button" aria-label={`${label} 이전 달`} onClick={() => setRequestedMonth(months[monthIndex - 1])} disabled={monthIndex <= 0} className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-20"><ChevronLeft className="h-4 w-4" /></button>
      <p aria-live="polite" className="text-sm font-extrabold text-gray-800">{month.slice(0, 4)}년 {Number(month.slice(5))}월</p>
      <button type="button" aria-label={`${label} 다음 달`} onClick={() => setRequestedMonth(months[monthIndex + 1])} disabled={monthIndex >= months.length - 1} className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-20"><ChevronRight className="h-4 w-4" /></button>
    </div>
    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
      {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => <div key={day} className={`pb-2 text-center text-[11px] font-semibold ${index === 0 ? "text-rose-400" : index === 6 ? "text-blue-400" : "text-gray-400"}`}>{day}</div>)}
      {cells.map((date, index) => {
        if (!date) return <div key={`empty-${index}`} aria-hidden="true" />;
        const inRange = options.has(date);
        const isSelected = selectionMode ? selected.has(date) : activeDate === date;
        const count = counts?.get(date) ?? 0;
        const heat = count > 0 && total > 0 ? Math.max(1, Math.ceil(count / total * 4)) : 0;
        const color = !inRange ? "bg-transparent text-gray-200" : selectionMode
          ? isSelected ? "bg-[#1259AA] text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-blue-50"
          : HEAT_COLORS[heat];
        return <button key={date} type="button" disabled={!inRange || (selectionMode && disabled)}
          aria-label={`${date} ${formatDinnerDate(date)}${selectionMode ? " 선택" : ` ${count}명 가능`}`}
          aria-pressed={isSelected}
          onClick={() => selectionMode ? onToggle?.(date) : onInspect?.(date)}
          className={`relative flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1259AA] disabled:cursor-default sm:min-h-14 ${color} ${!selectionMode && isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}>
          <span>{Number(date.slice(8))}</span>
          {inRange && (selectionMode ? isSelected && <Check className="mt-0.5 h-3 w-3" aria-hidden="true" /> : <span className="mt-0.5 text-[9px] font-medium opacity-80">{count}명</span>)}
        </button>;
      })}
    </div>
    {!selectionMode && <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-gray-400"><span>가능 인원 적음</span>{HEAT_COLORS.map(color => <span aria-hidden="true" key={color} className={`h-3 w-3 rounded ${color}`} />)}<span>많음</span></div>}
  </div>;
}
