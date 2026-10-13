import { useState, type FormEvent } from "react";
import { X, Save } from "lucide-react";
import type { DinnerPoll, DinnerPollInput } from "../../types/dinner";
import { validateDinnerPoll } from "../../utils/dinnerPoll";

export const DINNER_INPUT = "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1259AA] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-500";

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
const localDateTime = (value: string | null) => value ? new Date(Date.parse(value) + 9 * 3600000).toISOString().slice(0, 16) : "";

export default function DinnerPollForm({ poll, hasResponses, onSave, onCancel }: {
  poll?: DinnerPoll;
  hasResponses: boolean;
  onSave: (input: DinnerPollInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ title: poll?.title ?? "우리 반 회식", mode: poll?.mode ?? "attendance",
    location: poll?.location ?? "", location_url: poll?.location_url ?? "",
    event_date: poll?.event_date ?? today(), event_time: poll?.event_time.slice(0, 5) ?? "18:30",
    date_start: poll?.date_start ?? today(), date_end: poll?.date_end ?? today(),
    deadline: localDateTime(poll?.deadline ?? null), notice: poll?.notice ?? "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const locked = Boolean(poll && hasResponses);
  function field(key: keyof typeof form, value: string) { setForm(previous => ({ ...previous, [key]: value })); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const input = validateDinnerPoll({ ...form, deadline: form.deadline ? new Date(`${form.deadline}:00+09:00`).toISOString() : null });
      await onSave(input);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "투표를 저장하지 못했습니다."); }
    finally { setSaving(false); }
  }
  return <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 sm:p-7" aria-labelledby="dinner-form-title">
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 id="dinner-form-title" className="text-lg font-extrabold text-gray-900">{poll ? "회식 투표 수정" : "새 회식 투표"}</h2>
      <button type="button" onClick={onCancel} disabled={saving} aria-label="투표 작성 닫기" className="rounded-lg p-2 hover:bg-blue-100"><X className="h-5 w-5" /></button>
    </div>
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={saving} className="space-y-4">
        <label className="block text-sm font-bold text-gray-700">제목 *<input className={DINNER_INPUT} required maxLength={80} value={form.title} onChange={e => field("title", e.target.value)} /></label>
        <label className="block text-sm font-bold text-gray-700">투표 방식 *
          <select className={DINNER_INPUT} disabled={locked} value={form.mode} onChange={e => field("mode", e.target.value)}>
            <option value="attendance">날짜 확정 · 참여 / 불참 / 늦참</option><option value="availability">날짜 조율 · 가능한 날짜 여러 개 선택</option>
          </select>
        </label>
        {locked && <p className="text-xs leading-5 text-blue-800">응답이 있는 투표의 날짜와 방식은 바꿀 수 없습니다. 일정이 바뀌면 기존 투표를 마감하고 새로 만들어 주세요.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {form.mode === "attendance" ? <label className="block text-sm font-bold text-gray-700">회식 날짜 *<input type="date" required disabled={locked} className={DINNER_INPUT} value={form.event_date} onChange={e => field("event_date", e.target.value)} /></label>
            : <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-bold text-gray-700">후보 시작일 *<input type="date" required disabled={locked} className={DINNER_INPUT} value={form.date_start} onChange={e => field("date_start", e.target.value)} /></label>
              <label className="text-sm font-bold text-gray-700">후보 종료일 *<input type="date" required disabled={locked} min={form.date_start} className={DINNER_INPUT} value={form.date_end} onChange={e => field("date_end", e.target.value)} /></label>
            </div>}
          <label className="block text-sm font-bold text-gray-700">{form.mode === "availability" ? "예정 시간" : "회식 시간"} *<input type="time" required disabled={locked} className={DINNER_INPUT} value={form.event_time} onChange={e => field("event_time", e.target.value)} /></label>
          <label className="block text-sm font-bold text-gray-700">장소 *<input required maxLength={200} className={DINNER_INPUT} placeholder="예: 상무지구 ○○식당 / 장소 미정" value={form.location} onChange={e => field("location", e.target.value)} /></label>
          <label className="block text-sm font-bold text-gray-700">장소 링크<input type="url" maxLength={1000} className={DINNER_INPUT} placeholder="https://… (지도 또는 매장 주소)" value={form.location_url} onChange={e => field("location_url", e.target.value)} /></label>
        </div>
        <label className="block text-sm font-bold text-gray-700">투표 마감<input type="datetime-local" className={DINNER_INPUT} value={form.deadline} onChange={e => field("deadline", e.target.value)} /></label>
        <p className="text-xs text-gray-500">시간은 모두 한국 시간 기준입니다. 마감을 비우면 관리자가 직접 마감합니다. 날짜 확정 투표는 회식 시작 시 자동 마감됩니다.</p>
        <label className="block text-sm font-bold text-gray-700">안내<textarea rows={3} maxLength={2000} className={DINNER_INPUT} placeholder="회비, 집합 장소, 메뉴 등 안내할 내용을 적어 주세요." value={form.notice} onChange={e => field("notice", e.target.value)} /></label>
      </fieldset>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={onCancel} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold">취소</button>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1259AA] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "저장 중…" : poll ? "수정 저장" : "투표 올리기"}</button></div>
    </form>
  </section>;
}
