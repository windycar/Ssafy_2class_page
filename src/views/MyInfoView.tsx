import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { BadgeCheck, CalendarClock, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import rulesImage from "../assets/home/quick-menu/rules.png";

function formatDate(value: string | null) {
  if (!value) return "기록 없음";
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function MyInfoView() {
  const { currentUser, changePassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const firstLogin = Boolean((location.state as { firstLogin?: boolean } | null)?.firstLogin) || currentUser?.mustChangePassword;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [pending, setPending] = useState(false);

  if (!currentUser) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 4) return toast.error("새 비밀번호는 4자 이상 입력하세요.");
    if (newPassword !== confirmPassword) return toast.error("새 비밀번호 확인이 일치하지 않습니다.");
    setPending(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("비밀번호를 변경했습니다.");
      if (firstLogin) navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "비밀번호를 변경하지 못했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d4a8f] to-[#2877c7] px-6 py-7 text-white shadow-lg sm:px-8">
        <div className="absolute right-4 top-1/2 hidden h-36 w-36 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 sm:flex">
          <img src={rulesImage} alt="" className="h-28 w-28 object-contain drop-shadow-xl" />
        </div>
        <div className="relative max-w-xl">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><UserRound className="h-5 w-5" /></div>
          <h1 className="text-2xl font-black">내정보</h1>
          <p className="mt-2 text-sm leading-6 text-blue-100">계정 정보와 접속 기록을 확인하고 비밀번호를 안전하게 관리하세요.</p>
        </div>
      </div>

      {firstLogin && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none" />
          <div><b className="text-sm">첫 로그인 보안 설정이 필요합니다.</b><p className="mt-1 text-xs leading-5">초기 비밀번호 1234 대신 본인만 아는 새 비밀번호로 변경하면 모든 메뉴를 이용할 수 있습니다.</p></div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-[#1259AA]">{currentUser.name[0]}</div>
            <div><h2 className="font-black text-gray-900">{currentUser.name}</h2><p className="text-sm text-gray-400">{currentUser.username}</p></div>
          </div>
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3"><dt className="text-gray-400">로그인 아이디</dt><dd className="font-bold text-gray-800">{currentUser.loginId}</dd></div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3"><dt className="text-gray-400">소속</dt><dd className="font-bold text-gray-800">{currentUser.className.replace("_", " ")}</dd></div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3"><dt className="text-gray-400">계정 권한</dt><dd className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" />{currentUser.role === "admin" ? "관리자" : "회원"}</dd></div>
            <div className="flex items-start justify-between gap-4"><dt className="inline-flex items-center gap-1 text-gray-400"><CalendarClock className="h-4 w-4" />최근 로그인</dt><dd className="text-right text-xs font-semibold text-gray-600">{formatDate(currentUser.lastLoginAt)}</dd></div>
          </dl>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5"><h2 className="flex items-center gap-2 font-black text-gray-900"><LockKeyhole className="h-5 w-5 text-[#1259AA]" />비밀번호 변경</h2><p className="mt-1 text-xs text-gray-400">4자 이상이며 초기 비밀번호 1234는 사용할 수 없습니다.</p></div>
          <form onSubmit={submit} className="space-y-4">
            {[
              { label: "현재 비밀번호", value: currentPassword, setter: setCurrentPassword, autoComplete: "current-password" },
              { label: "새 비밀번호", value: newPassword, setter: setNewPassword, autoComplete: "new-password" },
              { label: "새 비밀번호 확인", value: confirmPassword, setter: setConfirmPassword, autoComplete: "new-password" },
            ].map((field) => (
              <label key={field.label} className="block text-sm font-bold text-gray-700">
                <span className="mb-1.5 block">{field.label}</span>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input required type={showPasswords ? "text" : "password"} value={field.value} onChange={(event) => field.setter(event.target.value)} autoComplete={field.autoComplete} className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1259AA] focus:bg-white focus:ring-4 focus:ring-blue-100" />
                </div>
              </label>
            ))}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button type="button" onClick={() => setShowPasswords((value) => !value)} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1259AA]">
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} 비밀번호 {showPasswords ? "숨기기" : "보기"}
              </button>
              <button disabled={pending} className="rounded-xl bg-[#1259AA] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0d4a8f] disabled:opacity-60">{pending ? "변경 중..." : "비밀번호 변경"}</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

