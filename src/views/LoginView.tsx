import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff, KeyRound, LockKeyhole, LogIn, ShieldCheck, UsersRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import teamImage from "../assets/home/quick-menu/team.png";
import coffeeImage from "../assets/home/quick-menu/coffee.png";
import galleryImage from "../assets/home/quick-menu/gallery.png";

export default function LoginView() {
  const { login, isAuthenticated, isLoading, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!isLoading && isAuthenticated) {
    return <Navigate to={currentUser?.mustChangePassword ? "/me" : from} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!loginId.trim() || !password) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const user = await login(loginId, password);
      navigate(user.mustChangePassword ? "/me" : from, {
        replace: true,
        state: user.mustChangePassword ? { firstLogin: true } : undefined,
      });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "로그인하지 못했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf3fb] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#083b78] via-[#1259AA] to-[#3b82d0] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="relative">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            <ShieldCheck className="h-4 w-4" /> 광주 2반 전용 커뮤니티
          </div>
          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight xl:text-5xl">
            함께 만든 기록을<br />이제 계정으로 안전하게.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">
            공구, 사진, 익명 게시판, 그라운드 룰과 학습 기록을 한 계정으로 이어서 이용하세요.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          {[
            { image: teamImage, label: "우리 반" },
            { image: coffeeImage, label: "같이 공구" },
            { image: galleryImage, label: "사진첩" },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-sm">
              <img src={item.image} alt="" className="mx-auto h-20 w-20 object-contain drop-shadow-xl xl:h-24 xl:w-24" />
              <p className="mt-2 text-sm font-extrabold">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1259AA] text-xl font-black text-white shadow-lg shadow-blue-200">S</div>
            <h1 className="text-2xl font-black text-gray-900">광주 2반 커뮤니티</h1>
          </div>

          <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_24px_70px_rgba(18,89,170,0.14)] sm:p-9">
            <div className="mb-7">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-[#1259AA]">
                <UsersRound className="h-3.5 w-3.5" /> MEMBER LOGIN
              </div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900">로그인</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">명단에 등록된 아이디와 비밀번호를 입력하세요.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="login-id" className="mb-1.5 block text-sm font-bold text-gray-700">아이디</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-id"
                    value={loginId}
                    onChange={(event) => setLoginId(event.target.value)}
                    autoComplete="username"
                    autoFocus
                    placeholder="예: blueishsun24"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-[#1259AA] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-bold text-gray-700">비밀번호</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="비밀번호 입력"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-11 text-sm font-semibold outline-none transition focus:border-[#1259AA] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:bg-gray-100" aria-label="비밀번호 표시 전환">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600">{error}</p>}

              <button disabled={pending || isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1259AA] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-[#0d4a8f] disabled:cursor-wait disabled:opacity-60">
                <LogIn className="h-4 w-4" /> {pending ? "확인 중..." : "사이트 입장"}
              </button>
            </form>

            <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
              <b>첫 로그인 비밀번호는 1234</b>입니다. 아이디는 기존 명단의 <b>@ 뒤 문자열</b>이며, 첫 로그인 후 내정보에서 새 비밀번호로 바꿔야 합니다.
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-gray-400">계정 추가 또는 비밀번호 초기화는 관리자에게 요청하세요.</p>
        </div>
      </section>
    </div>
  );
}
