import { Trophy } from "lucide-react";

export function EmptyTeamResult() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Trophy className="w-8 h-8 text-blue-200" />
      </div>
      <h3 className="text-base font-bold text-gray-400 mb-1">결과가 여기에 표시됩니다</h3>
      <p className="text-sm text-gray-300">랜덤 팀 만들기 버튼을 눌러 주세요.</p>
    </div>
  );
}
