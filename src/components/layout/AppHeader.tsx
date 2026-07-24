import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Bell, Users } from "lucide-react";
import { NAV_ITEMS } from "../../config/navigation";
import { TOTAL_STUDENTS } from "../../config/constants";
import { useAdmin } from "../../context/AdminContext";

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin, login } = useAdmin();

  const openAdmin = async () => {
    if (isAdmin) return navigate("/admin");
    const password = window.prompt("G2 관리자 비밀번호");
    if (!password) return;
    if (await login(password)) navigate("/admin");
    else window.alert("비밀번호가 올바르지 않거나 관리자 설정이 없습니다.");
  };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header className="bg-[#fbfdfc]/95 backdrop-blur border-b border-[#1259AA]/10 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          {/* SSAFY "S" mark */}
          <div className="w-9 h-9 rounded-xl bg-[#1259AA] flex items-center justify-center shadow-md shadow-[#1259AA]/30 group-hover:bg-[#0d4a8f] transition-colors flex-shrink-0">
            <span className="font-black text-white text-base leading-none select-none">S</span>
          </div>
          <div className="leading-none">
            <div className="font-black text-[#0e1a2e] text-[15px] tracking-tight">SSAFY</div>
            <div className="text-[11px] text-[#1259AA] font-bold tracking-widest uppercase leading-tight">
              광주 2반
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-gray-200 flex-shrink-0" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "text-[#1259AA] bg-[#1259AA]/8"
                    : "text-gray-500 hover:text-[#1259AA] hover:bg-[#1259AA]/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#1259AA] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">
          {/* 교육생 배지 */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#1259AA]/8 text-[#1259AA] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1259AA]/20">
            <Users className="w-3.5 h-3.5" />
            {TOTAL_STUDENTS}명
          </div>

          {/* 알림 */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#1259AA] hover:bg-[#1259AA]/8 transition-colors"
            aria-label="알림"
          >
            <Bell className="w-4.5 h-4.5" />
          </button>

          {/* 아바타 */}
          <button onClick={openAdmin} title={isAdmin ? "관리자 페이지" : "G2 관리자 로그인"} className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1259AA] to-[#0a3f7f] flex items-center justify-center text-white text-[11px] font-black cursor-pointer shadow-sm select-none">
            G2
          </button>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1259AA]/10 bg-white px-4 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#1259AA]/8 text-[#1259AA]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
