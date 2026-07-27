import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Plus, ChevronLeft, Users, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useBangRooms } from "../../hooks/useBangRooms";
import { useAuth } from "../../hooks/useAuth";
import { createId } from "../../utils/createId";
import { DEFAULT_LIFE } from "../../utils/games/bangLifeManager";
import BangRoomCreateModal from "../../components/games/bang/BangRoomCreateModal";
import type { BangRoom } from "../../types/bang";
import type { GameRoomStatus } from "../../types/game";

const STATUS_LABEL: Record<GameRoomStatus, string> = {
  recruiting: "모집 중",
  full: "인원 마감",
  ready: "준비 중",
  playing: "진행 중",
  finished: "종료",
  cancelled: "취소",
};

const STATUS_COLOR: Record<GameRoomStatus, string> = {
  recruiting: "bg-emerald-100 text-emerald-700",
  full: "bg-orange-100 text-orange-700",
  ready: "bg-blue-100 text-blue-700",
  playing: "bg-purple-100 text-purple-700",
  finished: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-500",
};

const TABS = [
  { key: "recruiting", label: "모집 중" },
  { key: "playing", label: "진행 중" },
  { key: "finished", label: "종료된 게임" },
] as const;

export default function BangGameView() {
  const { rooms, createRoom } = useBangRooms();
  const { currentUser } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState<string>("recruiting");
  const [showCreate, setShowCreate] = useState(!!(location.state as { openCreate?: boolean })?.openCreate);

  const filtered = rooms.filter((r) => {
    if (tab === "finished") return r.status === "finished" || r.status === "cancelled";
    return r.status === tab;
  });

  const handleCreate = (data: Omit<BangRoom, "id" | "createdAt" | "players" | "turnOrder" | "turnIndex" | "activityLogs" | "status" | "currentTurnStudentId">) => {
    if (!currentUser) return;
    const newRoom: BangRoom = {
      ...data,
      id: createId("bang"),
      status: "recruiting",
      players: data.hostAutoJoin ? [{
        studentId: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        isHost: true,
        isReady: false,
        status: "waiting",
        life: DEFAULT_LIFE,
        joinedAt: new Date().toISOString(),
      }] : [],
      turnOrder: [],
      turnIndex: 0,
      activityLogs: [{ id: createId("log"), roomId: "", type: "create", message: `${currentUser.name} 님이 게임방을 만들었습니다.`, createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
    createRoom(newRoom);
    setShowCreate(false);
    toast.success("게임방이 만들어졌습니다!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/games" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />게임 목록
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🤠</span> 뱅!
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">참여자를 모집하고 역할과 턴을 관리해 보세요.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-amber-800 transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />새 게임방 만들기
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-border pb-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 -mb-px ${
              tab === t.key
                ? "border-amber-700 text-amber-700 bg-amber-50"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.key !== "finished" && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-amber-700 text-white" : "bg-gray-100 text-gray-500"}`}>
                {rooms.filter((r) => r.status === t.key).length}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => setTab("mine")}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 -mb-px ${
            tab === "mine"
              ? "border-amber-700 text-amber-700 bg-amber-50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          내가 참여한 게임
        </button>
      </div>

      {/* Room list */}
      {tab === "mine" ? (
        <RoomList rooms={rooms.filter((r) => r.players.some((p) => p.studentId === currentUser?.id))} currentUserId={currentUser?.id} />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-14 flex flex-col items-center text-center gap-4">
          <span className="text-5xl">🤠</span>
          <div>
            <p className="text-sm font-bold text-gray-400">아직 만들어진 뱅 게임방이 없습니다.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-amber-800">
            <Plus className="w-4 h-4" />첫 번째 게임방 만들기
          </button>
        </div>
      ) : (
        <RoomList rooms={filtered} currentUserId={currentUser?.id} />
      )}

      {showCreate && currentUser && (
        <BangRoomCreateModal
          hostName={currentUser.name}
          hostStudentId={currentUser.id}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function RoomList({ rooms, currentUserId }: { rooms: BangRoom[]; currentUserId?: number }) {
  if (rooms.length === 0) {
    return <p className="text-sm text-center text-gray-400 py-10">해당하는 게임방이 없습니다.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} currentUserId={currentUserId} />
      ))}
    </div>
  );
}

function RoomCard({ room, currentUserId }: { room: BangRoom; currentUserId?: number }) {
  const isHost = room.hostStudentId === currentUserId;
  const isJoined = room.players.some((p) => p.studentId === currentUserId);
  const readyCount = room.players.filter((p) => p.isReady).length;

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="bg-gradient-to-r from-amber-800 to-amber-700 px-4 py-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-extrabold text-white truncate flex-1">{room.title}</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLOR[room.status]}`}>
          {STATUS_LABEL[room.status]}
        </span>
      </div>
      <div className="p-4 space-y-3">
        {room.description && <p className="text-xs text-gray-500 leading-relaxed">{room.description}</p>}
        <div className="space-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-amber-600" />
            <span>{room.players.length}/{room.maxPlayers}명 · 준비 {readyCount}명</span>
          </div>
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{new Date(room.scheduledAt).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          {room.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600" /><span>{room.location}</span></div>}
        </div>

        {/* Avatars */}
        <div className="flex items-center gap-1 flex-wrap">
          {room.players.slice(0, 6).map((p) => (
            <div key={p.studentId} className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm" title={p.name}>
              {p.name[0]}
            </div>
          ))}
          {room.players.length > 6 && <span className="text-xs text-gray-400">+{room.players.length - 6}</span>}
        </div>

        <div className="flex gap-2 items-center">
          {isHost && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">방장</span>}
          {isJoined && !isHost && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">참여 중</span>}
          <Link to={`/games/bang/${room.id}`} className="ml-auto text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2">
            상세 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}

