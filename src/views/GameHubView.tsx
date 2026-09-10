import { Link } from "react-router";
import { Gamepad2, Clock, Users, Plus, Lock } from "lucide-react";
import { GAMES } from "../config/games";
import { useBangRooms } from "../hooks/useBangRooms";
import bangHubArt from "../assets/games/bang-hub-art.png";

export default function GameHubView() {
  const { rooms } = useBangRooms();
  const recruiting = rooms.filter((r) => r.status === "recruiting").length;
  const playing = rooms.filter((r) => r.status === "playing").length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative min-h-[230px] overflow-hidden rounded-3xl border border-amber-200/20 bg-[#082f58] p-6 text-white shadow-[0_18px_45px_rgba(8,47,88,0.20)] sm:p-8">
        <img
          src={bangHubArt}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[center_55%] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,35,68,0.98)_0%,rgba(10,64,111,0.90)_42%,rgba(14,63,95,0.48)_72%,rgba(61,32,10,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_28%,rgba(251,191,36,0.30),transparent_27%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%,rgba(3,22,40,0.30))]" />
        <div className="absolute -right-12 -top-24 h-56 w-56 rounded-full border border-amber-100/20" />
        <div className="absolute -right-3 -top-14 h-40 w-40 rounded-full border border-amber-100/15" />

        <div className="absolute right-7 top-6 hidden items-center gap-2 rounded-full border border-amber-100/25 bg-black/15 px-3 py-1.5 text-[10px] font-black tracking-[0.22em] text-amber-100/90 backdrop-blur-sm md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]" />
          GAME NIGHT
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-sm">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">광주 2반 전용</span>
          </div>
          <h1 className="mb-2 text-2xl font-black tracking-tight drop-shadow-sm sm:text-3xl">광주 2반 게임방</h1>
          <p className="text-sm text-blue-100/90">같이 즐길 게임을 선택하고 참가자를 모집해 보세요.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-xl border border-white/15 bg-slate-950/20 px-3 py-2 text-white/75 backdrop-blur-sm">
              등록 게임 <span className="ml-1 font-extrabold text-white">{GAMES.filter(g => g.isAvailable).length}개</span>
            </span>
            <span className="rounded-xl border border-emerald-200/20 bg-emerald-950/20 px-3 py-2 text-emerald-100/80 backdrop-blur-sm">
              모집 중 <span className="ml-1 font-extrabold text-white">{recruiting}개</span>
            </span>
            <span className="rounded-xl border border-amber-200/20 bg-amber-950/20 px-3 py-2 text-amber-100/80 backdrop-blur-sm">
              진행 중 <span className="ml-1 font-extrabold text-white">{playing}개</span>
            </span>
          </div>
        </div>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => (
          <div key={game.id} className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
            <div
              className="relative flex h-36 items-center justify-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${game.themeColor}, #0f172a)` }}
            >
              {game.image ? (
                <>
                  <img src={game.image} alt={`${game.name} 게임 일러스트`} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                </>
              ) : (
                <span className="text-5xl">{game.icon}</span>
              )}
              <div className="absolute top-3 right-3">
                <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                  {game.category.join(" · ")}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-lg font-black drop-shadow-lg">{game.name}</p>
                <p className="text-[10px] font-semibold text-white/80">
                  {game.id === "bang" ? "서부 테이블 카드 게임" : "1인 챌린지 · 로컬 2인 대결"}
                </p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-800">{game.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{game.description}</p>
              </div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{game.minPlayers}~{game.maxPlayers}명</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{game.estimatedMinutes}분</span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={game.route}
                  className="flex-1 rounded-xl py-2 text-center text-sm font-semibold text-white transition-all hover:brightness-90"
                  style={{ backgroundColor: game.themeColor }}
                >
                  {game.id === "bang" ? "게임방 보기" : "게임 시작"}
                </Link>
                {game.id === "bang" && (
                  <Link to={game.route} state={{ openCreate: true }} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors">
                    <Plus className="w-3.5 h-3.5" />새 방
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Coming soon */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[220px]">
          <Lock className="w-8 h-8 text-gray-300" />
          <div>
            <p className="text-sm font-bold text-gray-400">다음 게임 준비 중</p>
            <p className="text-xs text-gray-300 mt-1">새로운 게임이 계속 추가될 예정이에요.</p>
          </div>
          <button disabled className="text-xs font-semibold px-4 py-2 rounded-xl bg-gray-200 text-gray-400 cursor-not-allowed">
            곧 출시
          </button>
        </div>
      </div>
    </div>
  );
}

