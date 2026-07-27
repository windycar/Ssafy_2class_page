import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { Heart, RefreshCw, ChevronLeft, Eye, EyeOff, SkipForward, X, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { bangRoomStorage } from "../../services/storage/bangRoomStorage";
import { useBangCardGame } from "../../hooks/useBangCardGame";
import { useAuth } from "../../hooks/useAuth";
import { canTarget, effectiveDistance, getWeaponRange } from "../../utils/games/bangDeckBuilder";
import {
  CARD_NAME, CARD_DESC, SUIT_SYMBOL, SUIT_COLOR,
  IS_EQUIPMENT,
} from "../../types/bangCards";
import type { BangCard, BangCardKind } from "../../types/bangCards";
import type { BangRoom, BangPlayer } from "../../types/bang";
import type { AuthUser } from "../../types/auth";
import { BANG_CHARACTER_BY_ID } from "../../types/bangCharacters";
import { BangCardArt } from "../../components/games/bang/BangCardArt";

// ── Card component ─────────────────────────────────────────────────────────────

function CardFace({
  card, selected, selectable, dim, onClick, small,
}: {
  card: BangCard;
  selected?: boolean;
  selectable?: boolean;
  dim?: boolean;
  onClick?: () => void;
  small?: boolean;
}) {
  const [showTip, setShowTip] = useState(false);
  const isEquip = IS_EQUIPMENT[card.kind];
  const bg = isEquip ? "bg-blue-50 border-blue-300" : "bg-amber-50 border-amber-300";
  const selClass = selectable ? "cursor-pointer hover:scale-110 hover:shadow-lg hover:z-10" : "cursor-default";
  const selectedClass = selected ? "ring-2 ring-[#1259AA] scale-105 shadow-lg" : "";
  const dimClass = dim ? "opacity-40" : "";

  return (
    <div
      className={`relative overflow-visible rounded-xl border-2 flex flex-col justify-between select-none transition-all shadow-sm ${bg} ${selClass} ${selectedClass} ${dimClass} ${small ? "w-14 h-20 p-1" : "w-24 h-36 p-2"}`}
      onClick={onClick}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div className={`font-black leading-none ${SUIT_COLOR[card.suit]} ${small ? "text-[9px]" : "text-sm"}`}>
        {card.rank}<br />{SUIT_SYMBOL[card.suit]}
      </div>
      <BangCardArt
        kind={card.kind}
        className={`${small ? "h-10 w-full rounded-md" : "h-[76px] w-full rounded-lg border border-amber-200/70 shadow-inner"}`}
      />
      <div className={`font-extrabold text-gray-800 text-center leading-tight ${small ? "text-[7px]" : "text-xs"}`}>
        {CARD_NAME[card.kind]}
      </div>

      {showTip && !small && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-xl p-2.5 z-50 shadow-xl pointer-events-none">
          <p className="font-bold mb-1">{CARD_NAME[card.kind]}</p>
          <p className="text-gray-300 leading-relaxed">{CARD_DESC[card.kind]}</p>
        </div>
      )}
    </div>
  );
}

function CardBack({ small }: { small?: boolean }) {
  return (
    <div className={`rounded-xl border-2 border-amber-700 bg-[radial-gradient(circle_at_center,_#b45309_0,_#78350f_55%,_#451a03_100%)] flex items-center justify-center shadow-inner ${small ? "w-10 h-14" : "w-14 h-20"}`}>
      {small ? (
        <span className="w-3 h-3 rotate-45 rounded-[2px] border-2 border-amber-200/80 bg-amber-500/30 shadow-sm" />
      ) : (
        <span className="font-black tracking-tighter text-amber-100 drop-shadow text-xs">BANG!</span>
      )}
    </div>
  );
}

// ── Player panel ───────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
  sheriff: "⭐ 보안관", deputy: "🛡️ 부관", outlaw: "🔫 무법자", renegade: "🃏 배신자",
};

function PlayerPanel({
  player, isCurrentTurn, isMe, cardCount, equipment, aliveIdx, totalAlive,
  myEquip, myIdx, myCharacter, isSelectable, isSelected, onSelect,
}: {
  player: BangPlayer;
  isCurrentTurn: boolean;
  isMe: boolean;
  cardCount: number;
  equipment: BangCard[];
  aliveIdx: number;
  totalAlive: number;
  myEquip: BangCard[];
  myIdx: number;
  myCharacter?: BangPlayer["characterId"];
  isSelectable: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const eliminated = player.status === "eliminated";
  const character = player.characterId ? BANG_CHARACTER_BY_ID[player.characterId] : undefined;
  const dist = (() => {
    if (aliveIdx < 0 || myIdx < 0) return "?";
    return effectiveDistance(myIdx, aliveIdx, totalAlive, myEquip, equipment, myCharacter, player.characterId);
  })();

  return (
    <div
      onClick={isSelectable ? onSelect : undefined}
      className={`relative rounded-2xl border-2 p-3 flex flex-col gap-2 transition-all min-w-[120px] max-w-[150px]
        ${isCurrentTurn ? "border-amber-500 bg-amber-50 shadow-lg" : "border-border bg-white"}
        ${isMe ? "border-[#1259AA]/40 bg-[#1259AA]/5" : ""}
        ${eliminated ? "opacity-40 border-gray-200 bg-gray-50" : ""}
        ${isSelectable ? "cursor-pointer hover:border-[#1259AA] hover:scale-105 hover:shadow-md" : ""}
        ${isSelected ? "ring-2 ring-[#1259AA] border-[#1259AA]" : ""}
      `}
    >
      {isCurrentTurn && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          현재 턴
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0
          ${isCurrentTurn ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"}`}>
          {player.name[0]}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-gray-800 truncate">{player.name}</p>
          {isMe && <span className="text-[9px] bg-[#1259AA]/10 text-[#1259AA] font-bold px-1 py-0.5 rounded-full">나</span>}
          {(player.role === "sheriff" || eliminated) && player.role && (
            <span className="block text-[9px] font-bold text-amber-700 mt-0.5">{ROLE_LABEL[player.role]}</span>
          )}
        </div>
      </div>

      {character && (
        <div className="rounded-lg bg-amber-100/70 px-2 py-1" title={character.ability}>
          <p className="text-[10px] font-extrabold text-amber-900 truncate">{character.emoji} {character.name}</p>
        </div>
      )}

      {/* Life */}
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: player.maxLife ?? 5 }).map((_, i) => (
          <Heart key={i} className={`w-3 h-3 ${i < player.life ? "fill-red-400 text-red-400" : "text-gray-200"}`} />
        ))}
        <span className="text-[10px] font-bold text-gray-500 ml-0.5">{player.life}</span>
      </div>

      {/* Card count */}
      <div className="flex items-end gap-1 min-h-14 overflow-hidden">
        <div className="flex items-end pl-1">
          {Array.from({ length: Math.min(cardCount, 6) }).map((_, i) => (
            <div key={i} className={i === 0 ? "" : "-ml-6"}>
              <CardBack small />
            </div>
          ))}
        </div>
        <span className="ml-auto text-[10px] font-extrabold text-gray-500 whitespace-nowrap">{cardCount}장</span>
      </div>

      {/* Equipment */}
      {equipment.length > 0 && (
        <div className="flex gap-0.5 flex-wrap">
          {equipment.map(eq => (
            <BangCardArt key={eq.id} kind={eq.kind} className="w-7 h-7 rounded-md border border-amber-300" />
          ))}
        </div>
      )}

      {/* Distance badge */}
      {!isMe && !eliminated && (
        <div className="text-[9px] text-gray-400 text-right">거리 {dist}</div>
      )}

      {isSelectable && (
        <div className="absolute inset-0 rounded-2xl border-2 border-[#1259AA] bg-[#1259AA]/10 flex items-center justify-center">
          <span className="text-[#1259AA] font-extrabold text-xs bg-white rounded-lg px-2 py-1 shadow">선택</span>
        </div>
      )}
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────────

export default function BangPlayView() {
  const { roomId } = useParams<{ roomId: string }>();
  const { currentUser } = useAuth();
  const [rawRoom, setRawRoom] = useState<BangRoom | null>(() => roomId ? bangRoomStorage.getRoom(roomId) : null);
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

  if (!rawRoom || !roomId) {
    return (
      <div className="flex flex-col items-center py-24 gap-4">
        <span className="text-5xl">🤠</span>
        <p className="text-sm font-bold text-gray-400">게임방을 찾을 수 없습니다.</p>
        <Link to="/games/bang" className="text-sm font-semibold text-amber-700 underline">목록으로</Link>
      </div>
    );
  }

  return <BangPlayContent key={rawRoom.id} initialRoom={rawRoom} roomId={roomId} currentUser={currentUser} />;
}

function BangPlayContent({ initialRoom, roomId, currentUser }: {
  initialRoom: BangRoom;
  roomId: string;
  currentUser: AuthUser | null;
}) {
  const [handVisible, setHandVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<BangCard | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const chatListRef = useRef<HTMLDivElement>(null);
  const game = useBangCardGame(initialRoom);
  const { room, getHand, getEquip, getAliveOrder } = game;
  const state = room.cardState;

  useEffect(() => {
    if (!autoRefreshEnabled || !roomId) return;
    void game.refresh();
    const timer = window.setInterval(() => {
      void game.refresh();
    }, 1500);
    return () => window.clearInterval(timer);
  }, [roomId, autoRefreshEnabled, game.refresh]);

  const myId = currentUser?.id;
  const me = room.players.find(p => p.studentId === myId);
  const isHost = room.hostStudentId === myId;
  const currentTurnId = room.currentTurnStudentId;
  const isMyTurn = currentTurnId === myId;
  const aliveOrder = getAliveOrder();
  const myAliveIdx = aliveOrder.indexOf(myId ?? -1);
  const currentPlayer = room.players.find(p => p.studentId === currentTurnId);

  const myHand = myId ? getHand(myId) : [];
  const myEquip = myId ? getEquip(myId) : [];
  const pending = state?.pending;
  const chatMessages = room.chatMessages ?? [];

  useEffect(() => {
    if (!chatOpen || !chatListRef.current) return;
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [chatOpen, chatMessages.length]);

  // What can I do right now?
  const canDraw = isMyTurn && state?.phase === "draw" && !pending;
  const canPlay = isMyTurn && state?.phase === "play" && !pending;
  const canEndTurn = isMyTurn && state?.phase === "play" && !pending;
  const mustDiscard = state?.phase === "discard" && pending?.type === "discard" && pending.playerId === myId;

  // Pending actions targeting me
  const bangTargetsMe = pending?.type === "bang_response" && pending.targetId === myId;
  const indiansTargetsMe = pending?.type === "indians_response" && pending.remaining[0] === myId;
  const gatlingTargetsMe = pending?.type === "gatling_response" && pending.remaining[0] === myId;
  const duelTargetsMe = pending?.type === "duel_response" && pending.currentId === myId;
  const storePickIsMine = pending?.type === "general_store_pick" && pending.remaining[0] === myId;
  const iNeedToRespond = bangTargetsMe || indiansTargetsMe || gatlingTargetsMe || duelTargetsMe;

  // Target selection mode
  const awaitingTarget = pending?.type === "await_target" && pending.fromId === myId;
  const awaitingCatBalou = pending?.type === "await_cat_balou" && pending.fromId === myId;
  const awaitingPanic = pending?.type === "await_panic" && pending.fromId === myId;
  const awaitingCardSelect = awaitingCatBalou || awaitingPanic;

  const handleCardClick = (card: BangCard) => {
    if (mustDiscard) {
      game.discardFromHand(myId!, card.id);
      setSelectedCard(null);
      return;
    }
    if (!canPlay) return;
    if (card.kind === "missed" && me?.characterId !== "calamity_janet") {
      toast.error("Missed!는 공격에 대응할 때 사용합니다.");
      return;
    }
    if (selectedCard?.id === card.id) { setSelectedCard(null); return; }
    setSelectedCard(card);
    setSelectedTarget(null);

    // Auto-play cards with no target
    const noTargetCards: BangCardKind[] = ["beer", "saloon", "general_store", "stagecoach", "wells_fargo", "indians", "gatling"];
    if ((noTargetCards.includes(card.kind) || (IS_EQUIPMENT[card.kind] && card.kind !== "jail"))) {
      game.playCard(card.id, myId!);
      setSelectedCard(null);
      toast.success(`${CARD_NAME[card.kind]} 사용!`);
      return;
    }
    // For targeting cards, wait for target selection
  };

  const handlePlayerSelect = (targetId: number) => {
    if (awaitingTarget && selectedCard) {
      // Validate bang range
      if (pending?.action === "bang") {
        const targetIdx = aliveOrder.indexOf(targetId);
        const targetEquip = getEquip(targetId);
        const target = room.players.find(player => player.studentId === targetId);
        if (!canTarget(myAliveIdx, targetIdx, aliveOrder.length, myEquip, targetEquip, me?.characterId, target?.characterId)) {
          toast.error("사거리 밖입니다!");
          return;
        }
      }
      game.selectTarget(targetId);
      setSelectedCard(null);
      setSelectedTarget(null);
      toast.success(`→ ${room.players.find(p => p.studentId === targetId)?.name}`);
    } else if (awaitingCardSelect) {
      setSelectedTarget(targetId);
    } else if (selectedCard && canPlay) {
      // Trigger play + target in sequence
      game.playCard(selectedCard.id, myId!);
    }
  };

  const handleEquipCardSelect = (targetPlayerId: number, cardId: string) => {
    if (awaitingCardSelect) {
      const action = pending?.type === "await_cat_balou" ? "cat_balou" : "panic";
      game.selectCardTarget(targetPlayerId, cardId, true);
      setSelectedTarget(null);
      setSelectedCard(null);
      toast.success("카드 선택!");
    }
  };

  const handleHandCardSelect = (targetPlayerId: number, cardId: string) => {
    if (awaitingCardSelect) {
      game.selectCardTarget(targetPlayerId, cardId, false);
      setSelectedTarget(null);
      setSelectedCard(null);
      toast.success("카드 가져옴!");
    }
  };

  const handlePlaySelected = () => {
    if (!selectedCard || !myId) return;
    game.playCard(selectedCard.id, myId);
    const needsTarget = ["bang", "duel", "jail", "cat_balou", "panic"].includes(selectedCard.kind)
      || (selectedCard.kind === "missed" && me?.characterId === "calamity_janet");
    if (!needsTarget) setSelectedCard(null);
    toast.success(`${CARD_NAME[selectedCard.kind]} 사용!`);
  };

  const manualRefresh = () => {
    void game.refresh();
    toast.success("새로고침!");
  };

  const handleSendChat = () => {
    if (!myId || !chatInput.trim()) return;
    if (game.sendChatMessage(myId, chatInput)) setChatInput("");
  };

  // ── Pre-game setup: init card game ──────────────────────────────────────────
  if (!state && room.status === "playing") {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <span className="text-5xl">🤠</span>
          <h2 className="text-xl font-extrabold text-gray-800">카드 게임 준비 중</h2>
          {isHost ? (
            <button
              onClick={() => { game.initCardGame(); toast.success("카드가 배분되었습니다!"); }}
              className="w-full py-3 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800"
            >
              🃏 카드 배분하기
            </button>
          ) : (
            <p className="text-sm text-gray-500">방장이 카드를 배분할 때까지 기다려주세요...</p>
          )}
          <button onClick={manualRefresh} className="text-xs text-gray-400 underline">새로고침</button>
        </div>
      </div>
    );
  }

  if (room.status === "finished") {
    const winnerLabels: Record<string, string> = { sheriff_deputy: "보안관·부관", outlaw: "무법자", renegade: "배신자" };
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-5 max-w-sm w-full">
          <div className="text-6xl">🏆</div>
          <h2 className="text-2xl font-extrabold text-amber-800">게임 종료!</h2>
          {room.winner && <p className="text-lg font-bold text-gray-700">{winnerLabels[room.winner]} 승리!</p>}
          {state?.log.slice(0, 10).map((msg, i) => (
            <p key={i} className="text-xs text-gray-500">{msg}</p>
          ))}
          <Link to={`/games/bang/${roomId}`} className="block text-sm font-semibold text-amber-700 underline">방으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex flex-col items-center py-24 gap-4">
        <span className="text-5xl">🤠</span>
        <p className="text-sm text-gray-400">게임 상태를 불러오는 중...</p>
        <button onClick={manualRefresh} className="text-xs text-amber-700 underline">새로고침</button>
      </div>
    );
  }

  const otherPlayers = room.players.filter(p => p.studentId !== myId);
  const isSelectingTarget = awaitingTarget || awaitingCardSelect;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 to-amber-900 flex flex-col">
      {/* Top bar */}
      <div className="bg-amber-950/80 border-b border-amber-800/50 px-4 py-2 flex items-center gap-3">
        <Link to={`/games/bang/${roomId}`} className="text-amber-300 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <span className="text-amber-200 font-extrabold text-sm flex-1 truncate">{room.title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400">드로우 파일: {state.drawPile.length}장</span>
          <button onClick={manualRefresh} className="text-amber-400 hover:text-amber-200 p-1 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Phase + turn indicator */}
      <div className={`px-4 py-2 flex items-center gap-2 text-sm font-bold
        ${state.phase === "draw" ? "bg-blue-600" : state.phase === "play" ? "bg-amber-600" : state.phase === "discard" ? "bg-red-600" : "bg-gray-600"}
      `}>
        <span className="text-white">
          {state.phase === "draw" && "📥 드로우 단계"}
          {state.phase === "play" && "🎴 플레이 단계"}
          {state.phase === "discard" && "🗑️ 버리기 단계"}
          {state.phase === "done" && "✅ 턴 종료"}
        </span>
        <span className="text-white/70 text-xs ml-auto">
          {currentPlayer?.name}의 턴
          {isMyTurn && <span className="ml-1 bg-white text-amber-700 px-1.5 py-0.5 rounded-full text-[10px]">내 턴!</span>}
        </span>
      </div>

      {/* Pending action banner */}
      {iNeedToRespond && (
        <div className="bg-red-600 px-4 py-3 text-white">
          <p className="font-extrabold text-sm text-center">
            {bangTargetsMe && `🔫 ${room.players.find(p => p.studentId === (pending as { fromId: number }).fromId)?.name} 이 BANG! 을 쐈습니다!`}
            {indiansTargetsMe && `🪶 인디언 공격! BANG! 으로 대응하거나 패스`}
            {gatlingTargetsMe && `⚙️ 개틀링 공격! Missed!로 대응하거나 패스`}
            {duelTargetsMe && `🤝 결투! BANG! 으로 대응하거나 패스`}
          </p>
        </div>
      )}

      {pending?.type === "general_store_pick" && (
        <div className="bg-emerald-700 px-4 py-3 text-white text-center">
          <p className="font-extrabold text-sm">
            🛒 잡화점 — {room.players.find(player => player.studentId === pending.remaining[0])?.name}의 선택 차례
          </p>
          <p className="text-xs text-emerald-100 mt-0.5">{storePickIsMine ? "아래 공개 카드 중 1장을 고르세요." : "다른 플레이어의 선택을 기다리는 중입니다."}</p>
        </div>
      )}

      {isSelectingTarget && (
        <div className="bg-[#1259AA] px-4 py-2 text-white text-sm font-bold text-center animate-pulse">
          {awaitingTarget && (() => {
            const a = (pending as { action: string }).action;
            return `🎯 ${a === "bang" ? "BANG! 대상 선택 (사거리 내)" : a === "duel" ? "결투 대상 선택" : "감옥에 넣을 대상 선택"}`;
          })()}
          {awaitingCatBalou && "캣발루: 버릴 카드를 선택하세요 (장착 카드 클릭)"}
          {awaitingPanic && "패닉: 가져올 카드를 선택하세요 (인접 플레이어의 카드)"}
          <button onClick={() => game.cancelPending()} className="ml-3 text-xs underline">취소</button>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-3 p-4 overflow-auto">
        {/* Other players */}
        <div className="flex gap-3 flex-wrap justify-center">
          {otherPlayers.map(player => {
            const playerAliveIdx = aliveOrder.indexOf(player.studentId);
            const isSelectable =
              (awaitingTarget && player.studentId !== myId && player.status !== "eliminated") ||
              (awaitingCatBalou && player.studentId !== myId && (getEquip(player.studentId).length > 0 || getHand(player.studentId).length > 0)) ||
              (awaitingPanic
                && effectiveDistance(
                  myAliveIdx,
                  playerAliveIdx,
                  aliveOrder.length,
                  myEquip,
                  getEquip(player.studentId),
                  me?.characterId,
                  player.characterId,
                ) === 1
                && player.status !== "eliminated");

            return (
              <div key={player.studentId} className="flex flex-col gap-1.5">
                <PlayerPanel
                  player={player}
                  isCurrentTurn={player.studentId === currentTurnId}
                  isMe={false}
                  cardCount={getHand(player.studentId).length}
                  equipment={getEquip(player.studentId)}
                  aliveIdx={playerAliveIdx}
                  totalAlive={aliveOrder.length}
                  myEquip={myEquip}
                  myIdx={myAliveIdx}
                  myCharacter={me?.characterId}
                  isSelectable={isSelectable}
                  isSelected={selectedTarget === player.studentId}
                  onSelect={() => handlePlayerSelect(player.studentId)}
                />
                {/* If cat_balou/panic and this player selected: show their cards */}
                {selectedTarget === player.studentId && awaitingCardSelect && (
                  <div className="bg-white/10 rounded-xl p-2 space-y-1.5">
                    {getEquip(player.studentId).length > 0 && (
                      <div>
                        <p className="text-[10px] text-amber-300 font-bold mb-1">장착 카드</p>
                        <div className="flex gap-1 flex-wrap">
                          {getEquip(player.studentId).map(eq => (
                            <div key={eq.id} className="cursor-pointer hover:scale-110 transition-transform" onClick={() => handleEquipCardSelect(player.studentId, eq.id)}>
                              <CardFace card={eq} selectable small />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {getHand(player.studentId).length > 0 && (
                      <div>
                        <p className="text-[10px] text-amber-300 font-bold mb-1">손패 (무작위 뒷면 선택)</p>
                        <div className="flex gap-1">
                          {getHand(player.studentId).map((_, i) => (
                            <div key={i} className="cursor-pointer hover:scale-110" onClick={() => handleHandCardSelect(player.studentId, getHand(player.studentId)[i].id)}>
                              <CardBack small />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {pending?.type === "general_store_pick" && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/50 p-4">
            <div className="flex gap-3 overflow-x-auto justify-center pb-2">
              {pending.available.map(card => (
                <CardFace
                  key={card.id}
                  card={card}
                  selectable={storePickIsMine}
                  dim={!storePickIsMine}
                  onClick={storePickIsMine && myId ? () => game.chooseGeneralStoreCard(myId, card.id) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        {/* Game log */}
        <div className="flex-1 bg-black/30 rounded-2xl p-3 min-h-[80px] max-h-48 overflow-y-auto">
          {state.log.slice(0, 20).map((msg, i) => (
            <p key={i} className={`text-xs leading-relaxed ${i === 0 ? "text-white font-semibold" : "text-white/50"}`}>
              {msg}
            </p>
          ))}
        </div>

        {/* My info + controls */}
        <div className="bg-amber-900/50 border border-amber-700/50 rounded-2xl p-3 space-y-3">
          {/* My player info */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">{me?.name ?? "관전자"}</span>
                {me?.role && <span className="text-xs bg-amber-800 text-amber-200 px-2 py-0.5 rounded-full">{ROLE_LABEL[me.role]}</span>}
                {isMyTurn && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">내 턴!</span>}
              </div>
              {me?.characterId && (
                <p className="text-xs text-amber-300 mt-1" title={BANG_CHARACTER_BY_ID[me.characterId].ability}>
                  {BANG_CHARACTER_BY_ID[me.characterId].emoji} {BANG_CHARACTER_BY_ID[me.characterId].name} · {BANG_CHARACTER_BY_ID[me.characterId].ability}
                </p>
              )}
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: me?.maxLife ?? 5 }).map((_, i) => (
                  <Heart key={i} className={`w-4 h-4 ${i < (me?.life ?? 0) ? "fill-red-400 text-red-400" : "text-gray-600"}`} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRoleModal(true)}
                className="text-xs bg-amber-800 text-amber-200 px-2 py-1.5 rounded-lg hover:bg-amber-700 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />역할
              </button>
              <button
                onClick={() => setHandVisible(v => !v)}
                className="text-xs bg-amber-800 text-amber-200 px-2 py-1.5 rounded-lg hover:bg-amber-700 flex items-center gap-1"
              >
                {handVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                손패
              </button>
            </div>
          </div>

          {/* My equipment */}
          {myEquip.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              <span className="text-[10px] text-amber-400 self-center">장착:</span>
              {myEquip.map(eq => (
                <BangCardArt key={eq.id} kind={eq.kind} className="w-8 h-8 rounded-md border border-amber-500/50" />
              ))}
              <span className="text-[10px] text-amber-400 self-center ml-1">사거리 {getWeaponRange(myEquip)}</span>
            </div>
          )}

          {/* My hand */}
          {handVisible && (
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap justify-center">
                {myHand.map(card => {
                  const isSel = selectedCard?.id === card.id;
                  const canUse = canPlay || (mustDiscard) || iNeedToRespond;
                  const calamity = me?.characterId === "calamity_janet";
                  const isResponse =
                    ((bangTargetsMe || gatlingTargetsMe) && (card.kind === "missed" || (calamity && card.kind === "bang"))) ||
                    ((indiansTargetsMe || duelTargetsMe) && (card.kind === "bang" || (calamity && card.kind === "missed")));
                  return (
                    <CardFace
                      key={card.id}
                      card={card}
                      selected={isSel}
                      selectable={canUse}
                      dim={mustDiscard ? false : iNeedToRespond ? !isResponse : !canPlay}
                      onClick={() => {
                        if (iNeedToRespond) {
                          if ((bangTargetsMe || gatlingTargetsMe) && (card.kind === "missed" || (calamity && card.kind === "bang"))) {
                            game.respond("play_missed", myId!, card.id);
                            toast.success("💨 Missed!");
                          } else if ((indiansTargetsMe || duelTargetsMe) && (card.kind === "bang" || (calamity && card.kind === "missed"))) {
                            game.respond("play_bang", myId!, card.id);
                            toast.success("🔫 BANG!");
                          }
                          return;
                        }
                        handleCardClick(card);
                      }}
                    />
                  );
                })}
              </div>

              {/* Response buttons */}
              {iNeedToRespond && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => { game.respond("pass", myId!); toast.error("😢 피해를 받습니다"); }}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700"
                  >
                    패스 (1 피해)
                  </button>
                </div>
              )}

              {/* Play selected card button (for targeting cards) */}
              {selectedCard && canPlay && !awaitingTarget && !awaitingCardSelect && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handlePlaySelected}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700"
                  >
                    {CARD_NAME[selectedCard.kind]} 사용
                  </button>
                  <button onClick={() => setSelectedCard(null)} className="p-2 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {canDraw && (
              <button
                onClick={() => { game.drawCards(); toast.success("카드 2장 드로우!"); }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700"
              >
                📥 카드 드로우 (2장)
              </button>
            )}
            {canEndTurn && (
              <button
                onClick={() => { game.endTurn(); toast.success("턴 종료"); }}
                className="flex-1 py-2.5 rounded-xl bg-gray-600 text-white font-bold text-sm hover:bg-gray-700"
              >
                <SkipForward className="w-4 h-4 inline mr-1" />턴 종료
              </button>
            )}
            {me?.characterId === "sid_ketchum" && myHand.length >= 2 && me.life < (me.maxLife ?? 4) && (
              <button
                onClick={() => game.useSidAbility(me.studentId)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700"
              >
                💊 손패 2장으로 체력 회복
              </button>
            )}
            {mustDiscard && (
              <div className="w-full text-center">
                <p className="text-red-400 text-sm font-bold">
                  카드 {(pending as { excess: number }).excess}장을 버려야 합니다. 버릴 카드를 클릭하세요.
                </p>
              </div>
            )}
          </div>

          {/* Host force end game */}
          {isHost && room.status === "playing" && (
            <button
              onClick={() => game.endGame("draw")}
              className="w-full py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10"
            >
              🏁 게임 강제 종료
            </button>
          )}
        </div>
      </div>

      {/* In-game chat */}
      {chatOpen ? (
        <aside className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-96 h-[min(520px,calc(100vh-6rem))] z-40 rounded-2xl border border-amber-200 bg-[#fffaf0] shadow-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-amber-800 to-orange-700 text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <div className="flex-1">
              <p className="font-extrabold text-sm">게임 채팅</p>
              <p className="text-[10px] text-amber-100">참가자끼리 작전을 이야기하세요.</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center"
              aria-label="채팅 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={chatListRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-[linear-gradient(180deg,#fffaf0_0%,#fef3c7_100%)]">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-amber-800/50">
                <MessageCircle className="w-8 h-8 mb-2" />
                <p className="text-xs font-bold">아직 메시지가 없습니다.</p>
                <p className="text-[11px] mt-1">첫 메시지를 남겨보세요.</p>
              </div>
            ) : (
              chatMessages.map(chat => {
                const mine = chat.studentId === myId;
                return (
                  <div key={chat.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      {!mine && <span className="text-[10px] font-extrabold text-amber-900">{chat.name}</span>}
                      <span className="text-[9px] text-gray-400">
                        {new Date(chat.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed break-words shadow-sm ${
                      mine
                        ? "rounded-br-md bg-amber-700 text-white"
                        : "rounded-bl-md border border-amber-100 bg-white text-gray-700"
                    }`}>
                      {chat.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            className="p-3 border-t border-amber-200 bg-white flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleSendChat();
            }}
          >
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              maxLength={200}
              disabled={!me}
              placeholder={me ? "메시지를 입력하세요." : "참가자만 채팅할 수 있습니다."}
              className="min-w-0 flex-1 rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!me || !chatInput.trim()}
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-amber-700 text-white flex items-center justify-center hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="채팅 보내기"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      ) : (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed right-4 bottom-4 z-40 rounded-full bg-amber-700 text-white shadow-xl px-4 py-3 flex items-center gap-2 font-extrabold text-sm hover:bg-amber-800"
        >
          <MessageCircle className="w-5 h-5" />
          채팅
          {chatMessages.length > 0 && (
            <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
              {Math.min(chatMessages.length, 99)}
            </span>
          )}
        </button>
      )}

      {/* Role reveal modal */}
      {showRoleModal && me?.role && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs text-center overflow-hidden">
            <div className="bg-amber-800 px-6 py-4">
              <p className="text-white font-extrabold text-lg">내 역할</p>
              <p className="text-amber-200 text-xs">주변 사람이 보지 않는지 확인하세요!</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-5xl">{ROLE_LABEL[me.role].split(" ")[0]}</div>
              <p className="text-xl font-extrabold text-amber-800">{ROLE_LABEL[me.role]}</p>
              <p className="text-sm text-gray-500">
                {me.role === "sheriff" && "무법자와 배신자를 모두 제거하세요."}
                {me.role === "deputy" && "보안관을 보호하고 무법자를 제거하세요."}
                {me.role === "outlaw" && "보안관을 제거하세요."}
                {me.role === "renegade" && "모든 플레이어(보안관 포함)를 제거하고 혼자 살아남아야 승리!"}
              </p>
              {me.characterId && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-left">
                  <p className="font-extrabold text-amber-900">
                    {BANG_CHARACTER_BY_ID[me.characterId].emoji} {BANG_CHARACTER_BY_ID[me.characterId].name}
                  </p>
                  <p className="text-xs text-amber-800 mt-1">{BANG_CHARACTER_BY_ID[me.characterId].ability}</p>
                  <p className="text-[11px] text-gray-500 mt-1">최대 체력 {me.maxLife ?? 4}</p>
                </div>
              )}
              <button onClick={() => setShowRoleModal(false)} className="w-full py-2.5 rounded-xl bg-amber-700 text-white font-bold">확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
