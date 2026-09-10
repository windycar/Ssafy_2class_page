import { useState } from "react";
import { Check, X } from "lucide-react";

interface BaseballRoomCreateData {
  title: string;
  description: string;
  isPublic: boolean;
}

interface Props {
  hostName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onCreate: (data: BaseballRoomCreateData) => void | Promise<void>;
}

export default function BaseballRoomCreateModal({
  hostName,
  isSubmitting = false,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("광주 2반 야구 한 판");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (!title.trim()) {
      setError("게임방 이름을 입력해 주세요.");
      return;
    }
    onCreate({ title: title.trim(), description: description.trim(), isPublic });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-extrabold text-gray-800">⚾ 새 야구 게임방 만들기</h2>
          <button type="button" onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-xs text-gray-500">호스트: <span className="font-semibold text-gray-700">{hostName}</span></p>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">게임방 이름 *</label>
            <input
              value={title}
              onChange={(event) => { setTitle(event.target.value); setError(""); }}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">설명</label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="간단한 설명 (선택)"
              className="w-full rounded-xl border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
            경기 인원은 방장 포함 2명으로 고정됩니다.
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="rounded" />
            공개 방
          </label>
          <p className="text-xs text-gray-400">비공개 방은 초대 링크를 받은 사람만 들어올 수 있습니다.</p>
        </div>

        <div className="flex gap-2 border-t border-border px-5 py-4">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">취소</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
            <Check className="h-4 w-4" />{isSubmitting ? "만드는 중..." : "게임방 만들기"}
          </button>
        </div>
      </div>
    </div>
  );
}
