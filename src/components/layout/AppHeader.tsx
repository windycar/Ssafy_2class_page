import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Menu,
  X,
  Bell,
  Users,
  LogOut,
  RefreshCw,
  ChevronDown,
  UserRound,
} from "lucide-react";

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

  const {
    currentUser,
    isAuthenticated,
    logout,
    changeUser,
  } = useAuth();

  const openAdmin = () => {
    navigate("/admin");
  };

  const isActive = (item: NavItem) =>
    item.matchPrefix
      ? pathname.startsWith(item.matchPrefix)
      : item.path === "/"
        ? pathname === "/"
        : pathname.startsWith(item.path);

  return (
    <header className="sticky top-0 z-30 border-b border-[#1259AA]/10 bg-[#fbfdfc]/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-3 sm:px-4 xl:gap-6 xl:px-6">

        {/* ===================================================
            Logo
        ==================================================== */}
        <Link
          to="/"
          className="group flex flex-shrink-0 items-center gap-3"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#1259AA] shadow-md shadow-[#1259AA]/30 transition-colors group-hover:bg-[#0d4a8f]">
            <span className="select-none text-base font-black leading-none text-white">
              S
            </span>
          </div>

          <div className="leading-none">
            <div className="text-[15px] font-black tracking-tight text-[#0e1a2e]">
              SSAFY
            </div>

            <div className="text-[11px] font-bold uppercase leading-tight tracking-widest text-[#1259AA]">
              광주 2반
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden h-6 w-px flex-shrink-0 bg-gray-200 md:block" />

        {/* ===================================================
            Desktop Nav
        ==================================================== */}
        <nav className="hidden flex-1 items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-[13px] font-semibold transition-all xl:px-3 xl:text-sm ${
                  active
                    ? "bg-[#1259AA]/8 text-[#1259AA]"
                    : "text-gray-500 hover:bg-[#1259AA]/5 hover:text-[#1259AA]"
                }`}
              >
                <Icon className="h-4 w-4" />

                {item.label}

                {active && (
                  <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#1259AA]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ===================================================
            Right
        ==================================================== */}
        <div className="ml-auto flex items-center gap-2">

          {/* 교육생 배지 */}
          <div className="hidden items-center gap-1.5 rounded-full border border-[#1259AA]/20 bg-[#1259AA]/8 px-3 py-1.5 text-xs font-bold text-[#1259AA] 2xl:flex">
            <Users className="h-3.5 w-3.5" />
            {TOTAL_STUDENTS}명
          </div>

          {/* 알림 */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-[#1259AA]/8 hover:text-[#1259AA]"
            aria-label="알림"
          >
            <Bell className="h-[18px] w-[18px]" />
          </button>

          {/* =================================================
              로그인 사용자
          ================================================== */}
          {isAuthenticated && currentUser ? (
            <div
              className="relative"
              ref={profileRef}
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((open) => !open)
                }
                className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-[#1259AA]/5 sm:pr-2"
                aria-label="사용자 메뉴"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-700 text-xs font-extrabold text-white">
                  {currentUser.name[0]}
                </div>

                <span className="hidden text-sm font-semibold text-gray-700 xl:block">
                  {currentUser.name}
                </span>

                <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 xl:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-border bg-white py-1.5 shadow-xl">

                  <div className="border-b border-border px-4 py-2.5">
                    <p className="text-sm font-extrabold text-gray-800">
                      {currentUser.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {currentUser.username}
                    </p>
                  </div>

                  {/* 내정보 */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/me");
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <UserRound className="h-4 w-4 text-gray-400" />
                    내정보
                  </button>

                  {/* 다른 계정 */}
                  <button
                    type="button"
                    onClick={() => {
                      void changeUser();
                      setProfileOpen(false);
                      navigate("/login");
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4 text-gray-400" />
                    다른 계정으로 로그인
                  </button>

                  {/* 로그아웃 */}
                  <button
                    type="button"
                    onClick={() => {
                      void logout();
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700 2xl:flex"
            >
              로그인
            </Link>
          )}

          {/* =================================================
              관리자 버튼

              관리자 계정이면 항상 노출.
              Ctrl + Shift + G와는 관계 없음.

              Ctrl + Shift + G는 AdminView의
              익명 게시판 작성자 표시/숨김 전용.
          ================================================== */}
          {isAdmin && (
            <button
              type="button"
              onClick={openAdmin}
              title="관리자 페이지"
              className="flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-xl bg-gradient-to-br from-[#1259AA] to-[#0a3f7f] text-[11px] font-black text-white shadow-sm"
            >
              G2
            </button>
          )}

          {/* =================================================
              모바일 햄버거
          ================================================== */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() =>
              setMobileOpen((value) => !value)
            }
            aria-label="메뉴"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          Mobile Drawer
      ====================================================== */}
      {mobileOpen && (
        <div className="space-y-0.5 border-t border-[#1259AA]/10 bg-white px-4 py-3 md:hidden">

          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#1259AA]/8 text-[#1259AA]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}

          {/* 모바일에서도 관리자 메뉴 */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openAdmin();
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-[#1259AA]/5 px-4 py-3 text-left text-sm font-bold text-[#1259AA] hover:bg-[#1259AA]/10"
            >
              <ShieldAdminIcon />
              관리자 페이지
            </button>
          )}

          {isAuthenticated && currentUser ? (
            <div className="mt-2 border-t border-border pt-2">

              <div className="px-4 py-2">
                <p className="text-xs font-extrabold text-gray-700">
                  {currentUser.name}
                </p>

                <p className="text-xs text-gray-400">
                  {currentUser.username}
                </p>
              </div>

              <Link
                to="/me"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                <UserRound className="h-4 w-4" />
                내정보
              </Link>

              <button
                type="button"
                onClick={() => {
                  void logout();
                  setMobileOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>

            </div>
          ) : (
            <Link
              to="/login"
              onClick={() =>
                setMobileOpen(false)
              }
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              로그인하기
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

/**
 * 모바일 관리자 메뉴용 간단한 G2 아이콘
 */
function ShieldAdminIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#1259AA] text-[8px] font-black text-white">
      G2
    </span>
  );
}