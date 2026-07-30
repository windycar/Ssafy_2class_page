import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { Check, Search } from "lucide-react";
import { STUDENTS } from "../data/students";
import { useAuth } from "../hooks/useAuth";
import type { AuthUser } from "../types/auth";

export default function LoginView() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/study";

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AuthUser | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }


  const sorted = [...STUDENTS]
    .filter((s) => s.name.includes(search) || s.username.includes(search))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));

  const handleConfirm = () => {
    if (!selected) return;
    login(selected);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f0fb] to-[#c8daf5] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1259AA] px-6 py-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">클래스 로그인</h1>
          <p className="text-blue-200 text-sm mt-1">게임과 학습 기록에 사용할 이름을 선택하세요</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500 text-center">본인의 이름으로 게임에 참여하고 학습 기록을 저장할 수 있어요.</p>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 아이디 검색..."
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1259AA]/30"
            />
          </div>

          {/* Student list */}
          <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
            {sorted.map((s) => {
              const isSelected = selected?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-[#1259AA] bg-[#1259AA]/5"
                      : "border-transparent hover:border-[#1259AA]/30 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                    isSelected ? "bg-[#1259AA] text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.username}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#1259AA] flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => selected && setShowConfirm(true)}
            disabled={!selected}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all bg-[#1259AA] text-white hover:bg-[#0d4a8f] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selected ? `${selected.name} 님으로 입장하기` : "이름을 선택해 주세요"}
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#1259AA]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-extrabold text-[#1259AA]">{selected.name[0]}</span>
              </div>
              <h3 className="text-base font-extrabold text-gray-800">{selected.name} 님으로 입장하시겠습니까?</h3>
              <p className="text-xs text-gray-400 mt-1">{selected.username}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-600 hover:bg-gray-50">
                취소
              </button>
              <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-[#1259AA] text-white text-sm font-bold hover:bg-[#0d4a8f]">
                입장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
