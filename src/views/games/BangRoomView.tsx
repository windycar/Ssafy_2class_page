import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ChevronLeft, Play, SkipForward, SkipBack, Heart, LogOut, Eye, EyeOff, Copy, RotateCcw, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { bangRoomStorage } from "../../services/storage/bangRoomStorage";
import { useBangGame } from "../../hooks/useBangGame";
import { useAuth } from "../../hooks/useAuth";
import { DEFAULT_LIFE } from "../../utils/games/bangLifeManager";
import { formatBangResult, ROLE_LABEL, WINNER_LABEL } from "../../utils/games/bangResultFormatter";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { createId } from "../../utils/createId";
import type { BangRoom, BangPlayer, BangWinner, BangRole } from "../../types/bang";
import type { GameRoomStatus } from "../../types/game";
import { BANG_CHARACTER_BY_ID } from "../../types/bangCharacters";
import type { BangCharacterId } from "../../types/bangCharacters";
import { useBangRoomPresence } from "../../hooks/useBangRoomPresence";
import { BangRoleArt } from "../../components/games/bang/BangRoleArt";

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<GameRoomStatus, string> = {
  recruiting: "모집 중", full: "인원 마감", ready: "준비 중",
  playing: "진행 중", finished: "종료", cancelled: "취소",
};
const STATUS_COLOR: Record<GameRoomStatus, string> = {
  recruiting: "bg-emerald-100 text-emerald-700", full: "bg-orange-100 text-orange-700",
  ready: "bg-blue-100 text-blue-700", playing: "bg-purple-100 text-purple-700",
  finished: "bg-gray-100 text-gray-500", cancelled: "bg-red-100 text-red-500",
};

const ROLE_DESC: Record<BangRole, string> = {
  sheriff: "무법자와 배신자를 모두 제거하세요.",
  deputy: "보안관을 보호하고 무법자를 제거하세요.",
  outlaw: "보안관을 제거하세요.",
  renegade: "모든 플레이어를 제거하고 혼자 살아남아야 승리. 보안관을 마지막에 죽여라.",
};
// ── Root component ─────────────────────────────────────────────────────────────

export default function BangRoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [rawRoom, setRawRoom] = useState<BangRoom | null>(() =>
    roomId ? bangRoomStorage.getRoom(roomId) : null
  );
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);

  useEffect(() => {
    if (!roomId) return;
    let active = true;
    void bangRoomStorage.refreshRoom(roomId).then((room) => {
      if (!active) return;
      setRawRoom(room);
      setIsLoadingRoom(false);
    });
    return () => {
      active = false;
    };
  }, [roomId]);

  if (isLoadingRoom && !rawRoom) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!rawRoom) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-4xl">🤠</span>
        <p className="text-sm font-bold text-gray-400">게임방을 찾을 수 없습니다.</p>
        <Link to="/games/bang" className="text-sm font-semibold text-amber-700 underline">뱅 게임 목록으로 돌아가기</Link>
      </div>
    );
  }

  return <BangRoomContent key={rawRoom.id} initialRoom={rawRoom} currentUserId={currentUser?.id} currentUserName={currentUser?.name ?? ""} navigate={navigate} />;
}

// ── Content ───────────────────────────────────────────────────────────────────

function BangRoomContent({ initialRoom, currentUserId, currentUserName, navigate }: {
  initialRoom: BangRoom;
  currentUserId?: number;
  currentUserName: string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const game = useBangGame(initialRoom);
  const { room, setRoom, refresh, startGame, nextTurn, prevTurn, changeLife, eliminate, restore, endGame, updatePlayer } = game;

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [revealAllRoles, setRevealAllRoles] = useState(false);
  const [elapsed, setElapsed] = useState("00:00");
  const [chatInput, setChatInput] = useState("");
  const chatListRef = useRef<HTMLDivElement>(null);

  useBangRoomPresence(room, currentUserId, setRoom);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 1500);
    return () => window.clearInterval(timer);
  }, [refresh]);

  // Elapsed timer
  useEffect(() => {
    if (room.status !== "playing" || !room.startedAt) return;
    const id = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(room.startedAt!).getTime()) / 1000);
      const m = String(Math.floor(diff / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setElapsed(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, [room.status, room.startedAt]);

  const isHost = room.hostStudentId === currentUserId;
  const me = room.players.find((p) => p.studentId === currentUserId);
  const isJoined = !!me;
  const canJoin = !isJoined && room.status === "recruiting" && room.players.length < room.maxPlayers && currentUserId !== undefined;
  const chatMessages = room.chatMessages ?? [];
  const latestChatId = chatMessages[chatMessages.length - 1]?.id;

  useEffect(() => {
    if (!chatListRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      if (!chatListRef.current) return;
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [latestChatId]);

  const handleJoin = () => {
    if (!currentUserId || !currentUserName) return;
    if (room.players.some((p) => p.studentId === currentUserId)) { toast.error("이미 참여 중입니다."); return; }
    if (room.players.length >= room.maxPlayers) { toast.error("참여 인원이 가득 찼습니다."); return; }
    if (new Date(room.recruitmentDeadline) < new Date()) { toast.error("참여 마감 시간이 지났습니다."); return; }
    const newPlayer: BangPlayer = {
      studentId: currentUserId, name: currentUserName, username: "",
      isHost: false, isReady: false, status: "waiting", life: DEFAULT_LIFE,
      joinedAt: new Date().toISOString(),
    };
    const updated: BangRoom = {
      ...room,
      players: [...room.players, newPlayer],
      activityLogs: [
        { id: createId("log"), roomId: room.id, type: "join", message: `${currentUserName} 님이 참여했습니다.`, createdAt: new Date().toISOString() },
        ...room.activityLogs,
      ],
    };
    setRoom(updated);
    toast.success("게임에 참여했습니다!");
  };

  const handleLeave = () => {
    if (!currentUserId) return;
    if (room.status === "playing" && !window.confirm("진행 중인 게임에서 나가면 좌석과 카드가 정리됩니다. 나갈까요?")) return;
    bangRoomStorage.leaveRoom(room, currentUserId);
    toast.success("게임방에서 나왔습니다.");
    navigate("/games/bang");
  };

  const handleSendChat = () => {
    if (!currentUserId || !me || !chatInput.trim()) return;
    const message = chatInput.trim().slice(0, 200);
    setRoom({
      ...room,
      chatMessages: [
        ...chatMessages,
        {
          id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          studentId: currentUserId,
          name: me.name,
          message,
          createdAt: new Date().toISOString(),
        },
      ].slice(-100),
    });
    setChatInput("");
  };

  const handleToggleReady = () => {
    if (!me) return;
    updatePlayer({ ...me, isReady: !me.isReady });
    toast.success(me.isReady ? "준비 취소" : "준비 완료!");
  };

  const handleStart = () => {
    if (room.players.length < 4) { toast.error("최소 4명이 필요합니다."); return; }
    startGame();
    toast.success("뱅! 게임이 시작되었습니다 🤠");
  };

  const handleKick = (studentId: number, name: string) => {
    if (!window.confirm(`${name} 님을 내보낼까요?`)) return;
    const updated: BangRoom = { ...room, players: room.players.filter((p) => p.studentId !== studentId) };
    setRoom(updated);
    toast.success(`${name} 님을 내보냈습니다.`);
  };

  const handleCancel = () => {
    if (!window.confirm("게임방을 취소할까요?")) return;
    setRoom({ ...room, status: "cancelled" });
    toast.success("게임방이 취소되었습니다.");
    navigate("/games/bang");
  };

  const handleCopyResult = async () => {
    const text = formatBangResult(room);
    const ok = await copyToClipboard(text);
    ok ? toast.success("결과가 복사되었습니다!") : toast.error("복사 실패");
  };

  const handleRestart = () => {
    if (!window.confirm("처음부터 다시 시작할까요?")) return;
    const reset: BangRoom = {
      ...room,
      status: "recruiting",
      players: room.players.map((p) => ({
        ...p,
        role: undefined,
        characterId: undefined,
        maxLife: undefined,
        status: "waiting",
        isReady: false,
        life: DEFAULT_LIFE,
        eliminatedAt: undefined,
      })),
      cardState: undefined,
      turnOrder: [],
      turnIndex: 0,
      currentTurnStudentId: undefined,
      winner: undefined,
      mvpStudentId: undefined,
      review: undefined,
      startedAt: undefined,
      finishedAt: undefined,
      activityLogs: [{ id: createId("log"), roomId: room.id, type: "restart", message: "게임이 다시 시작됩니다.", createdAt: new Date().toISOString() }, ...room.activityLogs],
    };
    setRoom(reset);
    toast.success("게임이 초기화되었습니다.");
  };

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link to="/games/bang" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft className="w-4 h-4" />뱅 게임 목록
      </Link>

      {/* Room info */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLOR[room.status]}`}>{STATUS_LABEL[room.status]}</span>
              {room.status === "playing" && <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded-full">⏱ {elapsed}</span>}
            </div>
            <h1 className="text-xl font-extrabold">{room.title}</h1>
            {room.description && <p className="text-amber-200 text-sm mt-1">{room.description}</p>}
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-amber-200">
              <span>👤 호스트: {room.players.find(p => p.isHost)?.name ?? "-"}</span>
              <span>📍 {room.location}</span>
              <span>⏰ {new Date(room.scheduledAt).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              <span>👥 {room.players.length}/{room.maxPlayers}명</span>
            </div>
          </div>
          {/* Join/Leave button */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {canJoin && (
              <button onClick={handleJoin} className="bg-white text-amber-800 font-bold px-4 py-2 rounded-xl text-sm hover:bg-amber-50">
                게임 참여하기
              </button>
            )}
            {isJoined && (
              <button onClick={handleLeave} className="bg-white/20 border border-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/30 flex items-center gap-1.5">
                <LogOut className="w-4 h-4" />방 나가기
              </button>
            )}
            {isJoined && room.status === "playing" && me?.role && (
              <button onClick={() => setShowRoleModal(true)} className="bg-white/20 border border-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/30 flex items-center gap-1.5">
                <Eye className="w-4 h-4" />내 역할 확인
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Playing: Turn tracker + Host controls */}
      {room.status === "playing" && (
        <div className="bg-white border border-border rounded-2xl p-4 space-y-3">
          {/* 카드 게임 입장 버튼 */}
          <Link
            to={`/games/bang/${room.id}/play`}
            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-700 text-white font-extrabold rounded-xl hover:bg-amber-800 text-sm"
          >
            🃏 카드 게임 플레이하기
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">현재 턴</p>
              <p className="text-base font-extrabold text-amber-700">
                {room.players.find(p => p.studentId === room.currentTurnStudentId)?.name ?? "-"}
                {room.currentTurnStudentId === currentUserId && <span className="ml-2 text-xs font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">내 턴!</span>}
              </p>
            </div>
            {isHost && (
              <div className="flex gap-2 flex-wrap">
                <button onClick={prevTurn} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <SkipBack className="w-3.5 h-3.5" />이전 턴
                </button>
                <button onClick={nextTurn} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-700 text-white text-sm font-bold hover:bg-amber-800">
                  다음 턴<SkipForward className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShowEndModal(true)} className="px-3 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50">
                  게임 종료
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Players grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-gray-700">참여자 ({room.players.length}/{room.maxPlayers})</h2>
          {room.status === "finished" && (
            <button onClick={() => setRevealAllRoles(!revealAllRoles)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
              {revealAllRoles ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {revealAllRoles ? "역할 숨기기" : "역할 전체 공개"}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {room.players.map((player) => (
            <PlayerCard
              key={player.studentId}
              player={player}
              isCurrentTurn={room.currentTurnStudentId === player.studentId && room.status === "playing"}
              isMe={player.studentId === currentUserId}
              isHost={room.hostStudentId === player.studentId}
              isGameHost={isHost}
              isPlaying={room.status === "playing"}
              isFinished={room.status === "finished"}
              revealAllRoles={revealAllRoles}
              onIncreaseLife={() => changeLife(player.studentId, 1)}
              onDecreaseLife={() => changeLife(player.studentId, -1)}
              onEliminate={() => eliminate(player.studentId)}
              onRestore={() => restore(player.studentId)}
              onKick={() => handleKick(player.studentId, player.name)}
              onToggleReady={() => player.studentId === currentUserId && updatePlayer({ ...player, isReady: !player.isReady })}
            />
          ))}
        </div>
      </div>

      {/* Host: Start / Ready controls */}
      {(room.status === "recruiting" || room.status === "ready") && (
        <div className="bg-white border border-border rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          {isJoined && me && (
            <button onClick={handleToggleReady}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${me.isReady ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
              {me.isReady ? "준비 취소" : "✅ 준비 완료"}
            </button>
          )}
          {isHost && (
            <>
              <button onClick={handleStart} disabled={room.players.length < 4}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed">
                <Play className="w-4 h-4" />게임 시작
              </button>
              {room.players.length < 4 && <span className="text-xs text-red-500">최소 4명 필요 (현재 {room.players.length}명)</span>}
              <button onClick={handleCancel} className="ml-auto px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50">
                게임방 취소
              </button>
            </>
          )}
        </div>
      )}

      {/* Finished: result + restart */}
      {room.status === "finished" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-extrabold text-amber-900">🏆 게임 결과</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-white rounded-xl p-3 text-center border border-amber-200">
              <p className="text-xs text-gray-400 mb-1">승리 진영</p>
              <p className="font-extrabold text-amber-800">{room.winner ? WINNER_LABEL[room.winner] : "-"}</p>
            </div>
            {room.mvpStudentId && <div className="bg-white rounded-xl p-3 text-center border border-amber-200">
              <p className="text-xs text-gray-400 mb-1">MVP</p>
              <p className="font-extrabold text-amber-800">{room.players.find(p => p.studentId === room.mvpStudentId)?.name ?? "-"}</p>
            </div>}
            {room.startedAt && room.finishedAt && <div className="bg-white rounded-xl p-3 text-center border border-amber-200">
              <p className="text-xs text-gray-400 mb-1">진행 시간</p>
              <p className="font-extrabold text-amber-800">{Math.round((new Date(room.finishedAt).getTime() - new Date(room.startedAt).getTime()) / 60000)}분</p>
            </div>}
            {room.review && <div className="bg-white rounded-xl p-3 text-center border border-amber-200 sm:col-span-2">
              <p className="text-xs text-gray-400 mb-1">한 줄 후기</p>
              <p className="font-semibold text-gray-700 text-xs">{room.review}</p>
            </div>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleCopyResult} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 text-amber-700 text-sm font-semibold hover:bg-amber-100">
              <Copy className="w-4 h-4" />결과 복사
            </button>
            {isHost && <button onClick={handleRestart} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 text-white text-sm font-bold hover:bg-amber-800">
              <RotateCcw className="w-4 h-4" />다시 하기
            </button>}
          </div>
        </div>
      )}

      {/* Lobby chat */}
      <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-800 to-orange-700 px-4 py-3 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold">{room.status === "playing" ? "게임 채팅" : "대기실 채팅"}</h3>
            <p className="text-[11px] text-amber-100">대기 중에도 참가자끼리 이야기할 수 있습니다.</p>
          </div>
          <span className="ml-auto rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold">{chatMessages.length}개</span>
        </div>
        <div ref={chatListRef} className="h-64 space-y-2 overflow-y-auto bg-gradient-to-b from-amber-50/70 to-orange-50/40 p-4">
          {chatMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-amber-900/35">
              <MessageCircle className="mb-2 h-8 w-8" />
              <p className="text-xs font-bold">아직 대화가 없습니다.</p>
            </div>
          ) : (
            chatMessages.map((chat) => {
              const mine = chat.studentId === currentUserId;
              return (
                <div key={chat.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                  <div className="mb-1 flex items-center gap-1.5 px-1 text-[10px]">
                    {!mine && <span className="font-extrabold text-amber-900">{chat.name}</span>}
                    <span className="text-gray-400">{new Date(chat.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className={`max-w-[82%] break-words rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                    mine ? "rounded-br-md bg-amber-700 text-white" : "rounded-bl-md border border-amber-100 bg-white text-gray-700"
                  }`}>
                    {chat.message}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <form
          className="flex items-center gap-2 border-t border-amber-100 p-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendChat();
          }}
        >
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            maxLength={200}
            disabled={!isJoined}
            placeholder={isJoined ? "메시지를 입력하세요." : "게임 참가자만 채팅할 수 있습니다."}
            className="min-w-0 flex-1 rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!isJoined || !chatInput.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="대기실 채팅 보내기"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>

      {/* Activity log */}
      {room.activityLogs.length > 0 && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-gray-50 text-sm font-bold text-gray-700">📋 게임 활동 기록</div>
          <div className="divide-y divide-border max-h-52 overflow-y-auto">
            {room.activityLogs.slice(0, 30).map((log) => (
              <div key={log.id} className="px-4 py-2 flex gap-3 items-start">
                <span className="text-gray-300 text-xs font-mono flex-shrink-0 mt-0.5">
                  {new Date(log.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-xs text-gray-600">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role confirm modal */}
      {showRoleModal && me?.role && (
        <RoleRevealModal role={me.role} characterId={me.characterId} maxLife={me.maxLife} onClose={() => setShowRoleModal(false)} />
      )}

      {/* End game modal */}
      {showEndModal && (
        <EndGameModal
          players={room.players}
          onClose={() => setShowEndModal(false)}
          onEnd={(winner, mvp, review) => { endGame(winner, mvp, review); setShowEndModal(false); }}
        />
      )}
    </div>
  );
}

// ── Player card ───────────────────────────────────────────────────────────────

function PlayerCard({ player, isCurrentTurn, isMe, isHost, isGameHost, isPlaying, isFinished, revealAllRoles, onIncreaseLife, onDecreaseLife, onEliminate, onRestore, onKick, onToggleReady }: {
  player: BangPlayer;
  isCurrentTurn: boolean;
  isMe: boolean;
  isHost: boolean;
  isGameHost: boolean;
  isPlaying: boolean;
  isFinished: boolean;
  revealAllRoles: boolean;
  onIncreaseLife: () => void;
  onDecreaseLife: () => void;
  onEliminate: () => void;
  onRestore: () => void;
  onKick: () => void;
  onToggleReady: () => void;
}) {
  const showRole = (isMe || revealAllRoles || player.role === "sheriff") && !!player.role;
  const eliminated = player.status === "eliminated";

  return (
    <div className={`rounded-2xl border-2 p-3 space-y-2 transition-all ${
      isCurrentTurn ? "border-amber-500 bg-amber-50 shadow-md" :
      eliminated ? "border-gray-200 bg-gray-50 opacity-60" :
      isMe ? "border-[#1259AA]/40 bg-[#1259AA]/5" : "border-border bg-white"
    }`}>
      <div className="flex items-start gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
          isCurrentTurn ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"
        }`}>
          {player.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-sm font-extrabold text-gray-800">{player.name}</span>
            {isMe && <span className="text-xs bg-[#1259AA]/10 text-[#1259AA] font-bold px-1.5 py-0.5 rounded-full">나</span>}
            {isHost && <span className="text-xs bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">방장</span>}
            {!isPlaying && !isFinished && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${player.isReady ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                {player.isReady ? "준비 완료" : "대기 중"}
              </span>
            )}
            {eliminated && <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">탈락</span>}
          </div>
          {showRole && player.role && (
            <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-amber-700">
              <BangRoleArt role={player.role} className="h-5 w-5 rounded border border-amber-300" />
              {ROLE_LABEL[player.role]}
            </p>
          )}
          {isPlaying && player.characterId && (
            <div className="group relative mt-0.5 inline-block">
              <p className="cursor-help text-xs font-semibold text-emerald-700">
                {BANG_CHARACTER_BY_ID[player.characterId].emoji} {BANG_CHARACTER_BY_ID[player.characterId].name}
              </p>
              <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 hidden w-64 rounded-xl bg-gray-950 p-3 text-left text-xs leading-relaxed text-white shadow-2xl group-hover:block">
                <p className="mb-1 font-extrabold text-amber-300">{BANG_CHARACTER_BY_ID[player.characterId].name}</p>
                <p className="text-gray-200">{BANG_CHARACTER_BY_ID[player.characterId].ability}</p>
                <p className="mt-2 text-[10px] font-semibold text-emerald-300">게임 로직에 자동 적용됩니다.</p>
              </div>
            </div>
          )}
        </div>
        {/* Host: kick button before game starts */}
        {isGameHost && !isHost && !isPlaying && !isFinished && (
          <button onClick={onKick} className="text-gray-300 hover:text-red-500 p-1 rounded-lg transition-colors text-xs">✕</button>
        )}
      </div>

      {/* Life counter (during game) */}
      {(isPlaying || isFinished) && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: player.maxLife ?? 5 }).map((_, i) => (
              <Heart key={i} className={`w-4 h-4 ${i < player.life ? "fill-red-400 text-red-400" : "text-gray-200"}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-600 ml-1">{player.life}</span>
          {isGameHost && isPlaying && (
            <div className="flex gap-1 ml-auto">
              <button onClick={onDecreaseLife} className="w-6 h-6 rounded-full border border-border text-gray-500 hover:bg-red-50 hover:text-red-500 text-xs font-bold">−</button>
              <button onClick={onIncreaseLife} className="w-6 h-6 rounded-full border border-border text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 text-xs font-bold">+</button>
              {!eliminated ? (
                <button onClick={onEliminate} className="px-1.5 h-6 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold">탈락</button>
              ) : (
                <button onClick={onRestore} className="px-1.5 h-6 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold">복구</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Role reveal modal ─────────────────────────────────────────────────────────

function RoleRevealModal({ role, characterId, maxLife, onClose }: {
  role: BangRole;
  characterId?: BangCharacterId;
  maxLife?: number;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs text-center overflow-hidden">
        <div className="bg-amber-800 px-6 py-4">
          <p className="text-xs text-amber-200 font-semibold mb-1">주변 사람이 화면을 보고 있지 않은지 확인해 주세요.</p>
          <p className="text-white font-extrabold text-lg">내 역할 확인</p>
        </div>
        <div className="p-6 space-y-4">
          {!revealed ? (
            <>
              <div className="w-20 h-28 rounded-xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center mx-auto text-4xl">🂠</div>
              <p className="text-sm text-gray-500">버튼을 눌러 역할을 확인하세요.</p>
              <button onClick={() => setRevealed(true)} className="w-full py-3 rounded-xl bg-amber-700 text-white font-bold hover:bg-amber-800">
                역할 확인
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto w-32 rounded-2xl border-2 border-amber-600 bg-amber-800 p-2 shadow-lg">
                <BangRoleArt role={role} className="h-28 w-full rounded-xl border border-amber-300" />
                <span className="mt-2 block text-xs font-bold text-white">{ROLE_LABEL[role]}</span>
              </div>
              <div>
                <p className="text-lg font-extrabold text-amber-800">{ROLE_LABEL[role]}</p>
                <p className="text-sm text-gray-500 mt-1">{ROLE_DESC[role]}</p>
              </div>
              {characterId && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left">
                  <p className="font-extrabold text-emerald-900">
                    {BANG_CHARACTER_BY_ID[characterId].emoji} {BANG_CHARACTER_BY_ID[characterId].name}
                  </p>
                  <p className="text-xs text-emerald-800 mt-1">{BANG_CHARACTER_BY_ID[characterId].ability}</p>
                  <p className="text-[11px] text-gray-500 mt-1">최대 체력 {maxLife ?? BANG_CHARACTER_BY_ID[characterId].life}</p>
                </div>
              )}
            </>
          )}
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-600 hover:bg-gray-50">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── End game modal ────────────────────────────────────────────────────────────

function EndGameModal({ players, onClose, onEnd }: {
  players: BangPlayer[];
  onClose: () => void;
  onEnd: (winner: BangWinner, mvp?: number, review?: string) => void;
}) {
  const [winner, setWinner] = useState<BangWinner>("sheriff_deputy");
  const [mvp, setMvp] = useState<number | undefined>();
  const [review, setReview] = useState("");

  const WINNER_OPTIONS: { value: BangWinner; label: string }[] = [
    { value: "sheriff_deputy", label: "보안관·부관" },
    { value: "outlaw", label: "무법자" },
    { value: "renegade", label: "배신자" },
    { value: "draw", label: "무승부" },
    { value: "cancelled", label: "게임 중단" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm space-y-0 overflow-hidden">
        <div className="bg-amber-800 px-5 py-4">
          <h3 className="text-white font-extrabold text-base">🏁 게임 종료</h3>
          <p className="text-amber-200 text-xs mt-0.5">승리 진영과 결과를 입력하세요.</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">승리 진영 *</label>
            <div className="flex flex-wrap gap-2">
              {WINNER_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setWinner(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${winner === opt.value ? "bg-amber-700 text-white border-amber-700" : "border-border text-gray-500 hover:border-amber-300"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">MVP (선택)</label>
            <select value={mvp ?? ""} onChange={(e) => setMvp(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none">
              <option value="">선택 안함</option>
              {players.map((p) => <option key={p.studentId} value={p.studentId}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">한 줄 후기 (선택)</label>
            <input value={review} onChange={(e) => setReview(e.target.value)}
              placeholder="오늘 게임 어땠나요?"
              className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-600 hover:bg-gray-50">취소</button>
          <button onClick={() => onEnd(winner, mvp, review || undefined)} className="flex-1 py-2.5 rounded-xl bg-amber-700 text-white text-sm font-bold hover:bg-amber-800">
            게임 종료
          </button>
        </div>
      </div>
    </div>
  );
}
