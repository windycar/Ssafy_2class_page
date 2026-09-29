import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Eye, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function DemoPreviewView({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const exitDemo = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950">
        <div className="flex items-center gap-2 font-semibold">
          <Eye className="h-4 w-4 shrink-0 text-[#1259AA]" />
          <span><b>체험 계정</b> · 메뉴를 직접 둘러볼 수 있습니다. 게시글·사진·주문 등 회원 데이터는 변경할 수 없습니다.</span>
        </div>
        <button type="button" onClick={() => void exitDemo()} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-[#1259AA] shadow-sm hover:bg-blue-100">
          <LogOut className="h-3.5 w-3.5" /> 정식 계정으로 로그인
        </button>
      </div>
      {children}
    </div>
  );
}
