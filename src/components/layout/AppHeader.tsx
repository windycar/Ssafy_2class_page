import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Bell, Users, LogOut, RefreshCw, ChevronDown, UserRound } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "../../config/navigation";
import { TOTAL_STUDENTS } from "../../config/constants";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../hooks/useAuth";

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { currentUser, isAuthenticated, logout, changeUser } = useAuth();

  const openAdmin = () => navigate("/admin");

  const isActive = (item: NavItem) =>
    item.matchPrefix
      ? pathname.startsWith(item.matchPrefix)
      : item.path === "/"
        ? pathname === "/"
        : pathname.startsWith(item.path);

  useEffect(() => {
    const closeProfile = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfile);
    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);

  return (
    <header className="bg-[#fbfdfc]/95 backdrop-blur border-b border-[#1259AA]/10 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[90rem] mx-auto px-3 sm:px-4 xl:px-6 h-16 flex items-center gap-3 xl:gap-6">

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
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 whitespace-nowrap px-2 py-2 xl:px-3 text-[13px] xl:text-sm rounded-xl font-semibold transition-all ${
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
          <div className="hidden 2xl:flex items-center gap-1.5 bg-[#1259AA]/8 text-[#1259AA] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1259AA]/20">
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

          {isAuthenticated && currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 p-1 sm:pr-2 rounded-xl hover:bg-[#1259AA]/5 transition-colors"
                aria-label="사용자 메뉴"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white text-xs font-extrabold">
                  {currentUser.name[0]}
                </div>
                <span className="hidden xl:block text-sm font-semibold text-gray-700">{currentUser.name}</span>
                <ChevronDown className="hidden xl:block w-3.5 h-3.5 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-border py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-border">
                    <p className="text-sm font-extrabold text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/me");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <UserRound className="w-4 h-4 text-gray-400" />
                    내정보
                  </button>
                  <button
                    onClick={() => {
                      void changeUser();
                      setProfileOpen(false);
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                    다른 계정으로 로그인
                  </button>
                  <button
                    onClick={() => {
                      void logout();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              로그인
            </Link>
          )}

          {/* 관리자 계정에만 노출 */}
          {isAdmin && (
            <button onClick={openAdmin} title="관리자 페이지" className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1259AA] to-[#0a3f7f] flex items-center justify-center text-white text-[11px] font-black cursor-pointer shadow-sm select-none">
              G2
            </button>
          )}

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
            const active = isActive(item);
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
          {isAuthenticated && currentUser ? (
            <div className="border-t border-border mt-2 pt-2">
              <div className="px-4 py-2">
                <p className="text-xs font-extrabold text-gray-700">{currentUser.name}</p>
                <p className="text-xs text-gray-400">{currentUser.username}</p>
              </div>
              <Link
                to="/me"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                <UserRound className="w-4 h-4" />
                내정보
              </Link>
              <button
                onClick={() => {
                  void logout();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              로그인하기
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
