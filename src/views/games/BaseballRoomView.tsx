import { useCallback, useEffect, useState } from "react";
import { Check, ChevronLeft, Copy, LogOut, Play, UserPlus, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { useAuth } from "../../hooks/useAuth";
import { useBaseballRoomPresence } from "../../hooks/useBaseballRoomPresence";
import { baseballRoomStorage } from "../../services/storage/baseballRoomStorage";
import type { BaseballRoom, BaseballRoomPlayer } from "../../types/baseballRoom";
import type { GameRoomStatus } from "../../types/game";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { createId } from "../../utils/createId";
import { createGameState } from "../../utils/games/baseballEngine";

const STATUS_LABEL: Record<GameRoomStatus, string> = {
  recruiting: "모집 중",
  full: "인원 마감",
  ready: "준비 중",
  playing: "진행 중",
  finished: "종료",
  cancelled: "취소",
};

export default function BaseballRoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [room, setRoomState] = useState<BaseballRoom | null>(() => (
    roomId ? baseballRoomStorage.getRoom(roomId) : null
  ));
  const [isLoading, setIsLoading] = useState(true);

  const setRoom = useCallback((nextRoom: BaseballRoom) => {
    setRoomState(nextRoom);
    baseballRoomStorage.updateRoom(nextRoom);
  }, []);

  const refresh = useCallback(async () => {
    if (!roomId) return;
    const nextRoom = await baseballRoomStorage.refreshRoom(roomId);
    setRoomState(nextRoom);
    setIsLoading(false);
  }, [roomId]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 1500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  if (isLoading && !room) {
    return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" /></div>;
  }
  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <span className="text-4xl">⚾</span>
        <p className="text-sm font-bold text-gray-400">야구 게임방을 찾을 수 없습니다.</p>
        <Link to="/games/baseball/rooms" className="text-sm font-semibold text-blue-700 underline">야구 게임방 목록으로</Link>
      </div>
    );
  }

  return (
    <BaseballRoomContent
      key={room.id}
      room={room}
      currentUser={currentUser}
      setRoom={setRoom}
      navigate={navigate}
    />
  );
}

function BaseballRoomContent({ room, currentUser, setRoom, navigate }: {
  room: BaseballRoom;
  currentUser: ReturnType<typeof useAuth>["currentUser"];
  setRoom: (room: BaseballRoom) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const currentUserId = currentUser?.id;
  const me = room.players.find((player) => player.studentId === currentUserId);
  const isJoined = Boolean(me);
  const isHost = room.hostStudentId === currentUserId;
  const canJoin = !isJoined && room.status === "recruiting" && room.players.length < 2 && Boolean(currentUser);
  const allReady = room.players.length === 2 && room.players.every((player) => player.isReady);

  useBaseballRoomPresence(room, currentUserId, setRoom);

  const handleJoin = () => {
    if (!currentUser || !canJoin) return;
    const now = new Date().toISOString();
    const player: BaseballRoomPlayer = {
      studentId: currentUser.id,
      authId: currentUser.authId,
      name: currentUser.name,
      username: currentUser.username,
      isHost: false,
      isReady: false,
      status: "waiting",
      joinedAt: now,
    };
    setRoom({
      ...room,
      status: "ready",
      players: [...room.players, player],
      activityLogs: [{
        id: createId("baseball-log"),
        roomId: room.id,
        type: "join",
        message: `${currentUser.name} 님이 참여했습니다.`,
        createdAt: now,
      }, ...room.activityLogs],
    });
    toast.success("야구 게임방에 참여했습니다!");
  };

  const handleLeave = () => {
    if (!currentUserId) return;
    if (room.status === "playing" && !window.confirm("진행 중인 경기에서 나갈까요?")) return;
    baseballRoomStorage.leaveRoom(room, currentUserId);
    toast.success("게임방에서 나왔습니다.");
    navigate("/games/baseball/rooms");
  };

  const handleReady = () => {
    if (!me) return;
    setRoom({
      ...room,
      players: room.players.map((player) => (
        player.studentId === me.studentId
          ? { ...player, isReady: !player.isReady, status: player.isReady ? "waiting" : "ready" }
          : player
      )),
    });
    toast.success(me.isReady ? "준비를 취소했습니다." : "준비 완료!");
  };

  const handleStart = () => {
    if (!isHost) return;
    if (room.players.length !== 2) {
      toast.error(`2명이 모두 참여해야 합니다. 현재 ${room.players.length}명입니다.`);
      return;
    }
    if (!allReady) {
      toast.error("두 명 모두 준비 완료해야 합니다.");
      return;
    }

    const now = new Date().toISOString();
    const gameState = createGameState(room.players[0].name, room.players[1].name);
    setRoom({
      ...room,
      status: "playing",
      startedAt: now,
      matchId: createId("baseball-match"),
      gameState,
      players: room.players.map((player) => ({ ...player, status: "playing" })),
      activityLogs: [{
        id: createId("baseball-log"),
        roomId: room.id,
        type: "start",
        message: "야구 경기가 시작되었습니다.",
        createdAt: now,
      }, ...room.activityLogs],
    });
    toast.success("야구 경기가 시작되었습니다!");
    navigate(`/games/baseball/rooms/${room.id}/play`);
  };

  const handleCancel = () => {
    if (!isHost || !window.confirm("야구 게임방을 취소할까요?")) return;
    setRoom({ ...room, status: "cancelled", finishedAt: new Date().toISOString() });
    toast.success("게임방이 취소되었습니다.");
    navigate("/games/baseball/rooms");
  };

  const handleInvite = async () => {
    const inviteUrl = `${window.location.origin}/games/baseball/rooms/${room.id}`;
    const copied = await copyToClipboard(inviteUrl);
    copied ? toast.success("초대 링크를 복사했습니다!") : toast.error("초대 링크 복사에 실패했습니다.");
  };

  return (
    <div className="space-y-5">
      <Link to="/games/baseball/rooms" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft className="h-4 w-4" />야구 게임방 목록
      </Link>

      <div className="rounded-2xl bg-gradient-to-r from-blue-800 to-blue-700 p-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">{STATUS_LABEL[room.status]}</span>
            <h1 className="mt-2 text-xl font-extrabold">{room.title}</h1>
            {room.description && <p className="mt-1 text-sm text-blue-200">{room.description}</p>}
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-blue-200">
              <span>👤 방장: {room.players.find((player) => player.isHost)?.name ?? "-"}</span>
              <span>👥 {room.players.length}/2명</span>
              <span>{room.isPublic ? "🌐 공개 방" : "🔒 초대 전용"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {(isHost || isJoined) && (
              <button type="button" onClick={handleInvite} className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-50">
                <Copy className="h-4 w-4" />초대 링크 복사
              </button>
            )}
            {canJoin && (
              <button type="button" onClick={handleJoin} className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-50">
                <UserPlus className="h-4 w-4" />게임 참여하기
              </button>
            )}
            {isJoined && (
              <button type="button" onClick={handleLeave} className="flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30">
                <LogOut className="h-4 w-4" />방 나가기
              </button>
            )}
          </div>
        </div>
      </div>

      {room.status === "playing" && isJoined && (
        <Link to={`/games/baseball/rooms/${room.id}/play`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-extrabold text-white hover:bg-blue-800">
          <Play className="h-4 w-4" />야구 경기 입장
        </Link>
      )}

      <div>
        <h2 className="mb-3 text-sm font-extrabold text-gray-700">참여자 ({room.players.length}/2)</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1].map((seat) => {
            const player = room.players[seat];
            return (
              <div key={seat} className={`rounded-2xl border p-4 ${player ? "border-blue-200 bg-white" : "border-dashed border-gray-200 bg-gray-50"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-700">{seat + 1}P</span>
                  {player?.isHost && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">방장</span>}
                </div>
                <strong className={`mt-3 block text-base ${player ? "text-gray-900" : "text-gray-400"}`}>{player?.name ?? "초대 대기 중"}</strong>
                <span className={`mt-1 flex items-center gap-1 text-xs font-semibold ${player?.isReady ? "text-emerald-600" : "text-gray-400"}`}>
                  {player?.isReady ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {player?.isReady ? "준비 완료" : "준비 전"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {(room.status === "recruiting" || room.status === "ready" || room.status === "full") && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-white p-4">
          {isJoined && (
            <button type="button" onClick={handleReady} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${me?.isReady ? "bg-gray-100 text-gray-600" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
              {me?.isReady ? "준비 취소" : "✅ 준비 완료"}
            </button>
          )}
          {isHost && (
            <>
              <button type="button" onClick={handleStart} disabled={!allReady} className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
                <Play className="h-4 w-4" />게임 시작
              </button>
              {!allReady && <span className="text-xs text-red-500">2명 모두 참여하고 준비 완료해야 시작할 수 있습니다.</span>}
              <button type="button" onClick={handleCancel} className="ml-auto rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50">게임방 취소</button>
            </>
          )}
        </div>
      )}

      {room.activityLogs.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-sm font-extrabold text-gray-700">활동 기록</h3>
          <div className="mt-2 space-y-1">
            {room.activityLogs.slice(0, 8).map((log) => <p key={log.id} className="text-xs text-gray-500">{log.message}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}
