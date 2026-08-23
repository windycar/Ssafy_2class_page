import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Copy, LogOut, Play, UserPlus, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { useAuth } from "../../hooks/useAuth";
import {
  isBaseballPresenceFreshForStart,
  useBaseballRoomPresence,
} from "../../hooks/useBaseballRoomPresence";
import {
  BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
  baseballRoomCommandClient,
  type BaseballRoomCommandKind,
  type BaseballRoomCommandResult,
} from "../../services/baseballRoomCommandClient.ts";
import { baseballRoomStorage } from "../../services/storage/baseballRoomStorage";
import type { BaseballRoom } from "../../types/baseballRoom";
import type { GameRoomStatus } from "../../types/game";
import { copyToClipboard } from "../../utils/copyToClipboard";
import {
  BASEBALL_ROOM_SEATS,
  getBaseballPlayerAtSeat,
  getFirstFreeBaseballSeat,
} from "../../utils/games/baseballRoomMembership";

const STATUS_LABEL: Record<GameRoomStatus, string> = {
  recruiting: "모집 중",
  full: "인원 마감",
  ready: "준비 중",
  playing: "진행 중",
  finished: "종료",
  cancelled: "취소",
};

type BaseballRoomMutationKind = Exclude<BaseballRoomCommandKind, "CREATE" | "HEARTBEAT">;

function roomCommandErrorMessage(result: BaseballRoomCommandResult) {
  if (result.ok) return "";
  if (result.status === 0) return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
  if (result.status === 401) return "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.";
  if (result.status === 403) return "이 작업을 수행할 권한이 없습니다.";
  if (result.code === "ROOM_FULL") return "이미 두 명이 참여한 방입니다.";
  if (result.code === "ROOM_NOT_FOUND") return "게임방을 찾을 수 없습니다.";
  return "게임방 상태가 변경되었습니다. 잠시 후 다시 시도해 주세요.";
}

export default function BaseballRoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [room, setRoomState] = useState<BaseballRoom | null>(() => (
    roomId ? baseballRoomStorage.getRoom(roomId) : null
  ));
  const [isLoading, setIsLoading] = useState(true);
  const inviteJoinAttemptedRef = useRef<{ roomId: string; attemptedAt: number } | null>(null);
  const refreshInFlightRef = useRef(false);

  const setRoom = useCallback((nextRoom: BaseballRoom) => {
    const cachedRoom = baseballRoomStorage.cacheCanonicalRoom(nextRoom) ?? nextRoom;
    setRoomState((currentRoom) => (
      currentRoom && currentRoom.revision > cachedRoom.revision
        ? currentRoom
        : cachedRoom
    ));
  }, []);

  const refresh = useCallback(async () => {
    if (!roomId || refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    try {
      const nextRoom = await baseballRoomStorage.refreshRoom(roomId);
      if (nextRoom) {
        setRoom(nextRoom);
        setIsLoading(false);
        return;
      }

      // Private invite rooms are intentionally hidden by table RLS. Ask the
      // authenticated command endpoint to join by id; a revision conflict gives
      // us the canonical room needed for one safe retry.
      if (!currentUser) {
        setRoomState(null);
        setIsLoading(false);
        return;
      }
      const nowMs = Date.now();
      const previousAttempt = inviteJoinAttemptedRef.current;
      if (
        previousAttempt?.roomId === roomId
        && nowMs - previousAttempt.attemptedAt < 5_000
      ) {
        setRoomState(null);
        setIsLoading(false);
        return;
      }
      inviteJoinAttemptedRef.current = { roomId, attemptedAt: nowMs };
      const sessionId = baseballRoomCommandClient.getSessionId();
      const commandId = baseballRoomCommandClient.createCommandId("JOIN");
      const sendJoin = (expectedRevision: number) => baseballRoomCommandClient.send({
        schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
        commandId,
        kind: "JOIN",
        roomId,
        expectedRevision,
        payload: { sessionId },
      });
      let result = await sendJoin(0);
      if (!result.ok && result.status === 409 && result.room) {
        setRoom(result.room);
        const alreadyJoined = result.room.players.some(
          (player) => player.authId === currentUser.authId,
        );
        if (!alreadyJoined) result = await sendJoin(result.room.revision);
      }
      if (result.room) setRoom(result.room);
      if (result.ok && result.deleted) baseballRoomStorage.deleteCachedRoom(roomId);
      setIsLoading(false);
    } finally {
      refreshInFlightRef.current = false;
    }
  }, [currentUser, roomId, setRoom]);

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
  const [pendingKind, setPendingKind] = useState<BaseballRoomMutationKind | null>(null);
  const commandInFlightRef = useRef(false);
  const currentUserId = currentUser?.id;
  const me = room.players.find((player) => player.studentId === currentUserId);
  const isJoined = Boolean(me);
  const isHost = room.hostStudentId === currentUserId;
  const firstFreeSeat = getFirstFreeBaseballSeat(room.players);
  const canJoin = !isJoined
    && room.status === "recruiting"
    && firstFreeSeat !== null
    && Boolean(currentUser);
  const presenceCheckedAt = Date.now();
  const allReady = BASEBALL_ROOM_SEATS.every((seat) => {
    const player = getBaseballPlayerAtSeat(room.players, seat);
    return player?.isReady === true
      && isBaseballPresenceFreshForStart(player, presenceCheckedAt);
  });

  useBaseballRoomPresence(room, currentUserId, setRoom);

  const executeCommand = async (
    kind: BaseballRoomMutationKind,
    isReady?: boolean,
  ): Promise<BaseballRoomCommandResult | null> => {
    if (commandInFlightRef.current) return null;
    const sessionId = baseballRoomCommandClient.getSessionId();
    const commandId = baseballRoomCommandClient.createCommandId(kind);
    const sendAtRevision = (expectedRevision: number) => {
      const common = {
        schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
        commandId,
        roomId: room.id,
        expectedRevision,
      } as const;
      if (kind === "SET_READY") {
        return baseballRoomCommandClient.send({
          ...common,
          kind,
          payload: { sessionId, isReady: Boolean(isReady) },
        });
      }
      return baseballRoomCommandClient.send({
        ...common,
        kind,
        payload: { sessionId },
      });
    };

    commandInFlightRef.current = true;
    setPendingKind(kind);
    try {
      let result = await sendAtRevision(room.revision);
      if (result.room) setRoom(result.room);
      if (!result.ok && result.status === 409 && result.room) {
        result = await sendAtRevision(result.room.revision);
        if (result.room) setRoom(result.room);
      }
      if (result.ok && result.deleted) baseballRoomStorage.deleteCachedRoom(room.id);
      return result;
    } finally {
      commandInFlightRef.current = false;
      setPendingKind(null);
    }
  };

  const handleJoin = async () => {
    if (!currentUser || !canJoin || firstFreeSeat === null) return;
    const result = await executeCommand("JOIN");
    if (!result) return;
    if (!result.ok) {
      toast.error(roomCommandErrorMessage(result));
      return;
    }
    toast.success("야구 게임방에 참여했습니다!");
  };

  const handleLeave = async () => {
    if (!currentUserId) return;
    if (room.status === "playing" && !window.confirm("진행 중인 경기에서 나갈까요?")) return;
    const result = await executeCommand("LEAVE");
    if (!result) return;
    if (!result.ok) {
      toast.error(roomCommandErrorMessage(result));
      return;
    }
    toast.success("게임방에서 나왔습니다.");
    navigate("/games/baseball/rooms");
  };

  const handleReady = async () => {
    if (!me) return;
    const result = await executeCommand("SET_READY", !me.isReady);
    if (!result) return;
    if (!result.ok) {
      toast.error(roomCommandErrorMessage(result));
      return;
    }
    toast.success(me.isReady ? "준비를 취소했습니다." : "준비 완료!");
  };

  const handleStart = async () => {
    if (!isHost) return;
    const visitor = getBaseballPlayerAtSeat(room.players, 0);
    const home = getBaseballPlayerAtSeat(room.players, 1);
    if (!visitor || !home) {
      toast.error(`2명이 모두 참여해야 합니다. 현재 ${room.players.length}명입니다.`);
      return;
    }
    if (!allReady) {
      toast.error("두 명 모두 접속 중이고 준비 완료해야 합니다.");
      return;
    }

    const result = await executeCommand("START");
    if (!result) return;
    if (!result.ok) {
      toast.error(roomCommandErrorMessage(result));
      return;
    }
    toast.success("야구 경기가 시작되었습니다!");
    navigate(`/games/baseball/rooms/${room.id}/play`);
  };

  const handleCancel = async () => {
    if (!isHost || !window.confirm("야구 게임방을 취소할까요?")) return;
    const result = await executeCommand("CANCEL");
    if (!result) return;
    if (!result.ok) {
      toast.error(roomCommandErrorMessage(result));
      return;
    }
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
              <button type="button" onClick={handleJoin} disabled={pendingKind !== null} className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">
                <UserPlus className="h-4 w-4" />게임 참여하기
              </button>
            )}
            {isJoined && (
              <button type="button" onClick={handleLeave} disabled={pendingKind !== null} className="flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60">
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
          {BASEBALL_ROOM_SEATS.map((seat) => {
            const player = getBaseballPlayerAtSeat(room.players, seat);
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
            <button type="button" onClick={handleReady} disabled={pendingKind !== null} className={`rounded-xl px-4 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${me?.isReady ? "bg-gray-100 text-gray-600" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
              {me?.isReady ? "준비 취소" : "✅ 준비 완료"}
            </button>
          )}
          {isHost && (
            <>
              <button type="button" onClick={handleStart} disabled={!allReady || pendingKind !== null} className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
                <Play className="h-4 w-4" />게임 시작
              </button>
              {!allReady && <span className="text-xs text-red-500">2명 모두 접속 중이고 준비 완료해야 시작할 수 있습니다.</span>}
              <button type="button" onClick={handleCancel} disabled={pendingKind !== null} className="ml-auto rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">게임방 취소</button>
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
