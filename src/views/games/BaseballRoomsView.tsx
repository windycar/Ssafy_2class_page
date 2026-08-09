import { useState } from "react";
import { ChevronLeft, Plus, Users } from "lucide-react";
import { Link, useLocation } from "react-router";
import { toast } from "sonner";

import BaseballRoomCreateModal from "../../components/games/baseball/BaseballRoomCreateModal";
import { useAuth } from "../../hooks/useAuth";
import { useBaseballRooms } from "../../hooks/useBaseballRooms";
import type { BaseballRoom } from "../../types/baseballRoom";
import type { GameRoomStatus } from "../../types/game";
import { createId } from "../../utils/createId";

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

export default function BaseballRoomsView() {
  const { rooms, createRoom } = useBaseballRooms();
  const { currentUser } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState<string>("recruiting");
  const [showCreate, setShowCreate] = useState(Boolean((location.state as { openCreate?: boolean })?.openCreate));

  const visibleRooms = rooms.filter((room) => (
    room.isPublic || room.players.some((player) => player.studentId === currentUser?.id)
  ));
  const filtered = visibleRooms.filter((room) => {
    if (tab === "finished") return room.status === "finished" || room.status === "cancelled";
    return room.status === tab;
  });

  const handleCreate = (data: { title: string; description: string; isPublic: boolean }) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const room: BaseballRoom = {
      id: createId("baseball"),
      title: data.title,
      description: data.description,
      hostStudentId: currentUser.id,
      maxPlayers: 2,
      isPublic: data.isPublic,
      status: "recruiting",
      players: [{
        studentId: currentUser.id,
        authId: currentUser.authId,
        name: currentUser.name,
        username: currentUser.username,
        isHost: true,
        isReady: false,
        status: "waiting",
        joinedAt: now,
      }],
      activityLogs: [{
        id: createId("baseball-log"),
        roomId: "",
        type: "create",
        message: `${currentUser.name} 님이 야구 게임방을 만들었습니다.`,
        createdAt: now,
      }],
      createdAt: now,
    };
    createRoom(room);
    setShowCreate(false);
    toast.success("야구 게임방이 만들어졌습니다!");
  };

  const roomsForTab = tab === "mine"
    ? rooms.filter((room) => room.players.some((player) => player.studentId === currentUser?.id))
    : filtered;

  return (
    <div className="space-y-6">
      <Link to="/games/baseball" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft className="h-4 w-4" />야구 모드 선택
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-gray-900"><span>⚾</span> 야구 게임방</h1>
          <p className="mt-0.5 text-sm text-gray-500">방을 만들고 한 명을 초대해 2인 경기를 시작하세요.</p>
        </div>
        <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800">
          <Plus className="h-4 w-4" />새 게임방 만들기
        </button>
      </div>

      <div className="flex gap-1.5 border-b border-border">
        {TABS.map((item) => (
          <button key={item.key} type="button" onClick={() => setTab(item.key)} className={`-mb-px rounded-t-xl border-b-2 px-4 py-2.5 text-sm font-semibold ${tab === item.key ? "border-blue-700 bg-blue-50 text-blue-700" : "border-transparent text-gray-500"}`}>
            {item.label}
          </button>
        ))}
        <button type="button" onClick={() => setTab("mine")} className={`-mb-px rounded-t-xl border-b-2 px-4 py-2.5 text-sm font-semibold ${tab === "mine" ? "border-blue-700 bg-blue-50 text-blue-700" : "border-transparent text-gray-500"}`}>
          내가 참여한 게임
        </button>
      </div>

      {roomsForTab.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white p-14 text-center">
          <span className="text-5xl">⚾</span>
          <p className="text-sm font-bold text-gray-400">해당하는 야구 게임방이 없습니다.</p>
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">
            <Plus className="h-4 w-4" />첫 번째 게임방 만들기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roomsForTab.map((room) => (
            <div key={room.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between gap-2 bg-gradient-to-r from-blue-800 to-blue-700 px-4 py-3">
                <h3 className="flex-1 truncate text-sm font-extrabold text-white">{room.title}</h3>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_COLOR[room.status]}`}>{STATUS_LABEL[room.status]}</span>
              </div>
              <div className="space-y-3 p-4">
                {room.description && <p className="text-xs leading-relaxed text-gray-500">{room.description}</p>}
                <div className="flex items-center gap-1.5 text-xs text-gray-500"><Users className="h-3.5 w-3.5 text-blue-600" /><span>{room.players.length}/2명</span></div>
                <div className="flex items-center gap-1">
                  {room.players.map((player) => (
                    <div key={player.studentId} title={player.name} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-800 shadow-sm">{player.name[0]}</div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {room.hostStudentId === currentUser?.id && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">방장</span>}
                  <Link to={`/games/baseball/rooms/${room.id}`} className="ml-auto text-xs font-bold text-blue-700 underline underline-offset-2">상세 보기 →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && currentUser && (
        <BaseballRoomCreateModal hostName={currentUser.name} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
