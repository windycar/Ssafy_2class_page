import { Link } from "react-router";
import { Shuffle, Coffee, Camera, Shield, Gamepad2, ArrowRight, GitBranch, GitCommit, Terminal } from "lucide-react";

const QUICK_MENU = [
  {
    title: "랜덤 팀 편성",
    description: "21명을 공정하게 무작위 팀으로 편성해요.",
    icon: Shuffle,
    path: "/teams",
    badge: "3명씩 7팀",
    buttonLabel: "팀 만들기",
    colorBg: "bg-[#1259AA]/5",
    colorBorder: "border-[#1259AA]/20",
    colorIcon: "bg-[#1259AA]",
    colorText: "text-[#1259AA]",
    colorBtn: "bg-[#1259AA] hover:bg-[#0d4a8f] text-white",
    shadowColor: "shadow-[#1259AA]/10",
  },
  {
    title: "같이 공구",
    description: "커피, 음식, 물품 등 뭐든 함께 주문해요.",
    icon: Coffee,
    path: "/coffee",
    badge: "공구 진행 중",
    buttonLabel: "공구 참여",
    colorBg: "bg-amber-50",
    colorBorder: "border-amber-200",
    colorIcon: "bg-amber-500",
    colorText: "text-amber-700",
    colorBtn: "bg-amber-500 hover:bg-amber-600 text-white",
    shadowColor: "shadow-amber-100",
  },
  {
    title: "우리 반 사진첩",
    description: "광주 2반의 활동과 추억을 기록해요.",
    icon: Camera,
    path: "/gallery",
    badge: "사진 5장",
    buttonLabel: "사진 보기",
    colorBg: "bg-emerald-50",
    colorBorder: "border-emerald-200",
    colorIcon: "bg-emerald-600",
    colorText: "text-emerald-700",
    colorBtn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    shadowColor: "shadow-emerald-100",
  },
  {
    title: "그라운드 룰",
    description: "함께 정한 약속을 확인하고 새 규칙을 추가해요.",
    icon: Shield,
    path: "/ground-rules",
    badge: "규칙 8개",
    buttonLabel: "규칙 확인",
    colorBg: "bg-violet-50",
    colorBorder: "border-violet-200",
    colorIcon: "bg-violet-600",
    colorText: "text-violet-700",
    colorBtn: "bg-violet-600 hover:bg-violet-700 text-white",
    shadowColor: "shadow-violet-100",
  },
  {
    title: "우리 반 게임",
    description: "뱅! 보드게임을 반 친구들과 함께 즐겨요.",
    icon: Gamepad2,
    path: "/games",
    badge: "🤠 뱅!",
    buttonLabel: "게임 참여",
    colorBg: "bg-orange-50",
    colorBorder: "border-orange-200",
    colorIcon: "bg-orange-500",
    colorText: "text-orange-700",
    colorBtn: "bg-orange-500 hover:bg-orange-600 text-white",
    shadowColor: "shadow-orange-100",
  },
];

const COMMITS = [
  { hash: "a4f2c1", msg: "팀 편성 완료 (알파~에타팀)", branch: "feature/team" },
  { hash: "b3e891", msg: "알고리즘 스터디 #21 — BFS/DFS", branch: "study/algo" },
  { hash: "c1d7a2", msg: "오늘도 출첵 완료 ✓", branch: "main" },
];

export default function HomeView() {
  return (
    <div className="space-y-8">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden bg-[#0b1d3a]">
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* glow blob */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#1259AA]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-10 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-center gap-8 p-7 sm:p-10">

          {/* Left copy */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-white/80 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide">
                삼성 청년 SW아카데미
              </span>
              <span className="inline-flex items-center gap-1 bg-[#1259AA]/60 border border-[#1259AA]/80 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                광주 캠퍼스 · 2반
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                교육 진행 중
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
              광주 2반,<br />
              <span className="text-[#5ba3f5]">오늘도 화이팅!</span> 🔥
            </h1>
            <p className="text-white/60 text-sm sm:text-base mb-7 leading-relaxed">
              팀 편성부터 커피 공구, 추억 기록까지<br className="hidden sm:block" />
              우리 반 모든 것을 한곳에서 관리해요.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/teams"
                className="flex items-center gap-2 bg-[#1259AA] hover:bg-[#0d4a8f] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-[#1259AA]/40"
              >
                <Shuffle className="w-4 h-4" />
                랜덤 팀 만들기
              </Link>
              <Link
                to="/coffee"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm border border-white/20"
              >
                <Coffee className="w-4 h-4" />
                같이 공구 참여하기
              </Link>
            </div>

            {/* Mini stats strip */}
            <div className="flex flex-wrap gap-4 mt-6 text-xs text-white/40 font-mono">
              <span className="flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#5ba3f5]" />
                feature/gwangju-2ban
              </span>
              <span className="flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                교육생 21명
              </span>
            </div>
          </div>

          {/* Right: Terminal */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {/* Terminal title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-white/30 font-mono flex items-center justify-center gap-1.5">
                    <Terminal className="w-3 h-3" />
                    gwangju-2ban — bash
                  </span>
                </div>
              </div>
              {/* Terminal body */}
              <div className="p-4 font-mono text-[12px] leading-[1.75] space-y-0.5">
                <p>
                  <span className="text-emerald-400">ssafy@gwangju</span>
                  <span className="text-white/40">:</span>
                  <span className="text-[#5ba3f5]">~/2ban</span>
                  <span className="text-white/40">$</span>
                  <span className="text-white/80 ml-1">git branch</span>
                </p>
                <p className="text-white/40 pl-2">  main</p>
                <p className="text-white pl-2">
                  <span className="text-emerald-400">*</span> feature/gwangju-2ban
                </p>
                <p className="mt-1">
                  <span className="text-emerald-400">ssafy@gwangju</span>
                  <span className="text-white/40">:</span>
                  <span className="text-[#5ba3f5]">~/2ban</span>
                  <span className="text-white/40">$</span>
                  <span className="text-white/80 ml-1">git log --oneline</span>
                </p>
                {COMMITS.map((c) => (
                  <p key={c.hash} className="pl-2">
                    <span className="text-yellow-400/80">{c.hash}</span>
                    <span className="text-white/60 ml-2">{c.msg}</span>
                  </p>
                ))}
                <p className="mt-1">
                  <span className="text-emerald-400">ssafy@gwangju</span>
                  <span className="text-white/40">:</span>
                  <span className="text-[#5ba3f5]">~/2ban</span>
                  <span className="text-white/40">$</span>
                  <span className="text-white/80 ml-1">echo &quot;광주 2반 화이팅!&quot;</span>
                </p>
                <p className="text-[#5ba3f5] pl-2">광주 2반 화이팅! 🔥</p>
                <p className="mt-1">
                  <span className="text-emerald-400">ssafy@gwangju</span>
                  <span className="text-white/40">:</span>
                  <span className="text-[#5ba3f5]">~/2ban</span>
                  <span className="text-white/40">$</span>
                  <span className="text-white/40 ml-1 animate-pulse">▌</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Quick Menu ───────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-[#1259AA]" />
          <h2 className="text-sm font-extrabold text-[#0e1a2e] uppercase tracking-wider">
            빠른 메뉴
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {QUICK_MENU.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                className={`${item.colorBg} border ${item.colorBorder} rounded-2xl p-5 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200 shadow-sm ${item.shadowColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 ${item.colorIcon} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-bold ${item.colorText} bg-white px-2.5 py-1 rounded-full shadow-sm border border-current/10`}>
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0e1a2e] mb-1 text-[15px]">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                </div>
                <Link
                  to={item.path}
                  className={`${item.colorBtn} flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors mt-auto shadow-sm`}
                >
                  {item.buttonLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
