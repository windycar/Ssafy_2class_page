import { Link } from "react-router";
import { Gamepad2, Clock, Users, Plus, Lock } from "lucide-react";
import { GAMES } from "../config/games";
import { useBangRooms } from "../hooks/useBangRooms";

export default function GameHubView() {
  const { rooms } = useBangRooms();
  const recruiting = rooms.filter((r) => r.status === "recruiting").length;
  const playing = rooms.filter((r) => r.status === "playing").length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1259AA] to-[#0d4a8f] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 text-7xl font-black select-none pointer-events-none hidden sm:block">GAME</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold bg-white/20 border border-white/30 px-3 py-1 rounded-full">광주 2반 전용</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">광주 2반 게임방</h1>
          <p className="text-blue-200 text-sm">같이 즐길 게임을 선택하고 참가자를 모집해 보세요.</p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="text-white/70">등록 게임 <span className="font-bold text-white">{GAMES.filter(g => g.isAvailable).length}개</span></span>
            <span className="text-white/70">모집 중 <span className="font-bold text-white">{recruiting}개</span></span>
            <span className="text-white/70">진행 중 <span className="font-bold text-white">{playing}개</span></span>
          </div>
        </div>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => (
          <div key={game.id} className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 transition-transform">
            {/* Card header with western theme */}
            <div className="relative h-28 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)" }}>
              <span className="text-5xl">{game.icon}</span>
              <div className="absolute top-3 right-3">
                <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                  {game.category.join(" · ")}
                </span>
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
                <Link to={game.route} className="flex-1 text-center py-2 rounded-xl text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800 transition-colors">
                  게임방 보기
                </Link>
                <Link to={game.route} state={{ openCreate: true }} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" />새 방
                </Link>
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

