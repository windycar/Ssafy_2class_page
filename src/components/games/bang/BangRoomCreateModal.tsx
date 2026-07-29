import { useState } from "react";
import { X, Check } from "lucide-react";
import type { BangRoom } from "../../../types/bang";

type CreateData = Omit<BangRoom, "id" | "createdAt" | "players" | "turnOrder" | "turnIndex" | "activityLogs" | "status" | "currentTurnStudentId">;

interface Props {
  hostName: string;
  hostStudentId: number;
  onClose: () => void;
  onCreate: (data: CreateData) => void;
}

const LOCATIONS = ["광주 2반 교실", "휴게실", "점심시간 테이블", "직접 입력"];

function toLocalDateTimeInput(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function BangRoomCreateModal({ hostName, hostStudentId, onClose, onCreate }: Props) {
  const defaultStart = toLocalDateTimeInput(new Date(Date.now() + 30 * 60_000));
  const defaultDeadline = toLocalDateTimeInput(new Date(Date.now() + 20 * 60_000));

  const [title, setTitle] = useState("광주 2반 뱅 한 판");
  const [description, setDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(7);
  const [scheduledAt, setScheduledAt] = useState(defaultStart);
  const [locationPreset, setLocationPreset] = useState(LOCATIONS[0]);
  const [locationCustom, setLocationCustom] = useState("");
  const [recruitmentDeadline, setRecruitmentDeadline] = useState(defaultDeadline);
  const [isPublic, setIsPublic] = useState(true);
  const [hostAutoJoin, setHostAutoJoin] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const location = locationPreset === "직접 입력" ? locationCustom : locationPreset;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "게임방 이름을 입력해 주세요.";
    if (!scheduledAt) e.scheduledAt = "시작 시간을 선택해 주세요.";
    if (recruitmentDeadline && scheduledAt && recruitmentDeadline > scheduledAt)
      e.recruitmentDeadline = "참여 마감은 시작 시간보다 이전이어야 합니다.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onCreate({
      title,
      description,
      hostStudentId,
      maxPlayers,
      location,
      scheduledAt: new Date(scheduledAt).toISOString(),
      recruitmentDeadline: new Date(recruitmentDeadline).toISOString(),
      isPublic,
      hostAutoJoin,
      winner: undefined,
      mvpStudentId: undefined,
      review: undefined,
    } as CreateData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-gray-800 flex items-center gap-2">🤠 새 게임방 만들기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-500">호스트: <span className="font-semibold text-gray-700">{hostName}</span></p>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">게임방 이름 *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">설명</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="간단한 설명 (선택)"
              className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">최대 인원</label>
              <select value={maxPlayers} onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300">
                {[4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}명</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">시작 예정 시간 *</label>
              <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
              {errors.scheduledAt && <p className="text-xs text-red-500 mt-1">{errors.scheduledAt}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">장소</label>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {LOCATIONS.map((l) => (
                <button key={l} onClick={() => setLocationPreset(l)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${locationPreset === l ? "bg-amber-700 text-white border-amber-700" : "border-border text-gray-500 hover:border-amber-300"}`}>
                  {l}
                </button>
              ))}
            </div>
            {locationPreset === "직접 입력" && (
              <input value={locationCustom} onChange={(e) => setLocationCustom(e.target.value)}
                placeholder="장소를 입력하세요"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">참여 마감 시간</label>
            <input type="datetime-local" value={recruitmentDeadline} onChange={(e) => setRecruitmentDeadline(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
            {errors.recruitmentDeadline && <p className="text-xs text-red-500 mt-1">{errors.recruitmentDeadline}</p>}
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded" />
              공개 방
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={hostAutoJoin} onChange={(e) => setHostAutoJoin(e.target.checked)} className="rounded" />
              호스트 자동 참여
            </label>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-600 hover:bg-gray-50">취소</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-amber-700 text-white text-sm font-bold hover:bg-amber-800 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />게임방 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
