import { useState, useCallback } from "react";
import { bangRoomStorage } from "../services/storage/bangRoomStorage";
import { createBangDeck, drawCheck, hasVolcanic, canTarget, effectiveDistance } from "../utils/games/bangDeckBuilder";
import { CARD_NAME, IS_EQUIPMENT, WEAPON_KINDS } from "../types/bangCards";
import type { BangRoom, BangPlayer } from "../types/bang";
import type { BangCard, BangCardGameState, BangCardKind, BangEffectEvent } from "../types/bangCards";
import { BANG_CHARACTER_BY_ID } from "../types/bangCharacters";
import type { BangCharacterId } from "../types/bangCharacters";

// ── helpers ────────────────────────────────────────────────────────────────────

type BangEffectEventInput = {
  [Kind in BangEffectEvent["kind"]]: Omit<Extract<BangEffectEvent, { kind: Kind }>, "id" | "createdAt">
}[BangEffectEvent["kind"]];

function h(state: BangCardGameState, id: number): BangCard[] {
  return state.hands[String(id)] ?? [];
}
function eq(state: BangCardGameState, id: number): BangCard[] {
  return state.equipment[String(id)] ?? [];
}
function setHand(state: BangCardGameState, id: number, cards: BangCard[]): BangCardGameState {
  return { ...state, hands: { ...state.hands, [String(id)]: cards } };
}
function setEquip(state: BangCardGameState, id: number, cards: BangCard[]): BangCardGameState {
  return { ...state, equipment: { ...state.equipment, [String(id)]: cards } };
}

function drawFromPile(
  state: BangCardGameState,
  count: number,
): { drawn: BangCard[]; state: BangCardGameState } {
  let pile = [...state.drawPile];
  let discard = [...state.discardPile];

  if (pile.length < count) {
    // reshuffle discard into draw
    pile = [...pile, ...discard.slice(0, -1)];
    discard = discard.slice(-1);
    // simple shuffle
    for (let i = pile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pile[i], pile[j]] = [pile[j], pile[i]];
    }
  }

  const drawn = pile.slice(0, count);
  return { drawn, state: { ...state, drawPile: pile.slice(count), discardPile: discard } };
}

function discardCard(state: BangCardGameState, card: BangCard): BangCardGameState {
  return { ...state, discardPile: [card, ...state.discardPile] };
}

function removeFromHand(state: BangCardGameState, playerId: number, cardId: string): BangCardGameState {
  return setHand(state, playerId, h(state, playerId).filter(c => c.id !== cardId));
}

function removeFromEquip(state: BangCardGameState, playerId: number, cardId: string): BangCardGameState {
  return setEquip(state, playerId, eq(state, playerId).filter(c => c.id !== cardId));
}

function addLog(state: BangCardGameState, msg: string): BangCardGameState {
  return { ...state, log: [msg, ...state.log.slice(0, 49)] };
}

function addEffectEvent(
  state: BangCardGameState,
  event: BangEffectEventInput,
): BangCardGameState {
  const nextEvent = {
    ...event,
    id: `effect-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  } as BangEffectEvent;
  return {
    ...state,
    effectEvents: [...(state.effectEvents ?? []).slice(-7), nextEvent],
  };
}

function alivePlayers(room: BangRoom): BangPlayer[] {
  return room.players.filter(p => p.status !== "eliminated");
}

function playerMaxLife(player: BangPlayer): number {
  return player.maxLife ?? (player.role === "sheriff" ? 5 : 4);
}

function orderedFrom(room: BangRoom, fromId: number): number[] {
  const alive = room.turnOrder.filter(id => room.players.find(p => p.studentId === id)?.status !== "eliminated");
  const start = alive.indexOf(fromId);
  return start < 0 ? alive : [...alive.slice(start), ...alive.slice(0, start)];
}

function advanceTurn(room: BangRoom, state: BangCardGameState, fromId: number): BangRoom {
  const alive = room.turnOrder.filter(id => room.players.find(p => p.studentId === id)?.status !== "eliminated");
  const currentIndex = alive.indexOf(fromId);
  const nextId = alive[(currentIndex + 1 + alive.length) % alive.length];
  const nextPlayer = room.players.find(p => p.studentId === nextId);
  return {
    ...room,
    currentTurnStudentId: nextId,
    turnIndex: room.turnOrder.indexOf(nextId),
    cardState: {
      ...state,
      phase: "draw",
      bangUsed: false,
      pending: undefined,
      log: [`━━ ${nextPlayer?.name ?? "다음 플레이어"}의 턴 ━━`, ...state.log.slice(0, 49)],
    },
  };
}

function triggerSuzy(room: BangRoom): BangRoom {
  let state = room.cardState;
  if (!state) return room;
  for (const player of room.players) {
    if (player.status === "eliminated" || player.characterId !== "suzy_lafayette" || h(state, player.studentId).length > 0) continue;
    const { drawn, state: nextState } = drawFromPile(state, 1);
    state = setHand(nextState, player.studentId, drawn);
    state = addLog(state, `🎴 ${player.name} (수지 라파예트) — 빈 손패가 되어 카드 1장 드로우`);
    state = addEffectEvent(state, {
      kind: "action",
      action: "draw",
      playerId: player.studentId,
      count: 1,
      message: "수지 라파예트 능력",
    });
  }
  return { ...room, cardState: state };
}

function drawCheckForPlayer(
  room: BangRoom,
  state: BangCardGameState,
  player: BangPlayer,
  condition: "barrel" | "dynamite" | "jail",
): { chosen: BangCard; state: BangCardGameState; result: boolean } {
  const count = player.characterId === "lucky_duke" ? 2 : 1;
  const { drawn, state: nextState } = drawFromPile(state, count);
  const favorable = condition === "dynamite"
    ? drawn.find(card => !drawCheck(card, condition))
    : drawn.find(card => drawCheck(card, condition));
  const chosen = favorable ?? drawn[0];
  let checkedState = nextState;
  for (const card of drawn) checkedState = discardCard(checkedState, card);
  if (count === 2) {
    checkedState = addLog(checkedState, `🍀 ${player.name} (럭키 듀크) — ${drawn.map(card => `${card.suit}${card.rank}`).join(" / ")} 중 ${chosen.suit}${chosen.rank} 선택`);
    checkedState = addEffectEvent(checkedState, {
      kind: "action",
      action: "ability",
      playerId: player.studentId,
      characterId: "lucky_duke",
      message: `판정 카드 2장 중 유리한 ${chosen.suit}${chosen.rank}을 선택합니다.`,
    });
  }
  const result = drawCheck(chosen, condition);
  return { chosen, state: checkedState, result };
}

function takeRandomCards(cards: BangCard[], count: number): BangCard[] {
  const pool = [...cards];
  const selected: BangCard[] = [];
  while (pool.length > 0 && selected.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected;
}

function completeCharacterDraw(
  state: BangCardGameState,
  player: BangPlayer,
  drawnCards: BangCard[],
  abilityMessage: string,
): BangCardGameState {
  let nextState = setHand(state, player.studentId, [...h(state, player.studentId), ...drawnCards]);
  nextState = addLog(nextState, `${abilityMessage} — 카드 ${drawnCards.length}장 획득`);
  nextState = addEffectEvent(nextState, {
    kind: "action",
    action: "draw",
    playerId: player.studentId,
    characterId: player.characterId,
    count: drawnCards.length,
    message: abilityMessage,
  });
  return {
    ...nextState,
    phase: "play",
    bangUsed: false,
    pending: undefined,
  };
}

// ── damage & death ─────────────────────────────────────────────────────────────

/**
 * applyDamage returns updated room+state and whether the target died.
 * Also handles:
 *  - Beer auto-use to avoid death (3명 이상 생존 중일 때)
 *  - Outlaw bounty: killer draws 3 cards when eliminating an outlaw
 *  - Sheriff penalty: 보안관이 부관을 처치하면 보안관의 모든 카드를 버림
 *  - Character abilities triggered by damage/elimination
 */
function applyDamage(
  room: BangRoom,
  state: BangCardGameState,
  targetId: number,
  amount: number,
  source: string,
  killerId?: number,
  sourceCard?: BangCardKind,
): { room: BangRoom; state: BangCardGameState; died: boolean } {
  const player = room.players.find(p => p.studentId === targetId)!;
  const rawLife = player.life - amount;

  const alive = alivePlayers(room).length;
  const hand = h(state, targetId);
  const beers = hand.filter(c => c.kind === "beer");
  let remaining = Math.max(0, rawLife);
  let usedBeers: BangCard[] = [];

  if (rawLife <= 0 && alive > 2 && beers.length > 0) {
    const needed = 1 - rawLife;
    usedBeers = beers.slice(0, needed);
    remaining = rawLife + usedBeers.length;
  }

  let newState = state;
  for (const beer of usedBeers) {
    newState = removeFromHand(newState, targetId, beer.id);
    newState = discardCard(newState, beer);
    newState = addLog(newState, `${player.name} 🍺 맥주로 가까스로 살아남음! (자동 사용)`);
  }
  if (usedBeers.length > 0) {
    newState = addEffectEvent(newState, {
      kind: "action",
      action: "beer",
      playerId: targetId,
      cardKind: "beer",
      amount: usedBeers.length,
      message: "자동으로 맥주를 마시고 생존했습니다.",
    });
  }

  const died = remaining <= 0;
  remaining = Math.max(0, remaining);
  let updatedPlayers = room.players.map(p =>
    p.studentId === targetId
      ? { ...p, life: remaining, status: (died ? "eliminated" : "alive") as BangPlayer["status"], eliminatedAt: died ? new Date().toISOString() : p.eliminatedAt }
      : p
  );
  newState = addLog(newState, `${player.name} ${source} — 체력 ${player.life} → ${remaining}${died ? " ☠️ 탈락!" : ""}`);

  const lostLife = player.life - remaining;
  if (lostLife > 0) {
    newState = addEffectEvent(newState, {
      kind: "action",
      action: "damage",
      playerId: targetId,
      cardKind: sourceCard,
      amount: lostLife,
      lifeBefore: player.life,
      lifeAfter: remaining,
      message: source,
    });
  }
  if (!died && lostLife > 0 && player.characterId === "bart_cassidy") {
    const { drawn, state: nextState } = drawFromPile(newState, lostLife);
    newState = setHand(nextState, targetId, [...h(nextState, targetId), ...drawn]);
    newState = addLog(newState, `🎩 ${player.name} (바트 캐시디) — 카드 ${drawn.length}장 드로우`);
    newState = addEffectEvent(newState, {
      kind: "action",
      action: "draw",
      playerId: targetId,
      count: drawn.length,
      message: "바트 캐시디 능력",
    });
  }

  if (!died && lostLife > 0 && player.characterId === "el_gringo" && killerId !== undefined && killerId !== targetId) {
    const attacker = updatedPlayers.find(p => p.studentId === killerId);
    const attackerHand = h(newState, killerId);
    const stolen = takeRandomCards(attackerHand, lostLife);
    for (const card of stolen) newState = removeFromHand(newState, killerId, card.id);
    newState = setHand(newState, targetId, [...h(newState, targetId), ...stolen]);
    if (stolen.length > 0) {
      newState = addLog(newState, `🌵 ${player.name} (엘 그링고) — ${attacker?.name}에게서 카드 ${stolen.length}장 가져옴`);
      newState = addEffectEvent(newState, {
        kind: "action",
        action: "steal",
        playerId: targetId,
        targetId: killerId,
        count: stolen.length,
        message: "엘 그링고 능력",
      });
    }
  }

  if (died) {
    // Vulture Sam receives the eliminated player's cards; otherwise discard them.
    const hand2 = h(newState, targetId);
    const equip2 = eq(newState, targetId);
    const vulture = updatedPlayers.find(p => p.status !== "eliminated" && p.studentId !== targetId && p.characterId === "vulture_sam");
    if (vulture) {
      newState = setHand(newState, vulture.studentId, [...h(newState, vulture.studentId), ...hand2, ...equip2]);
      newState = addLog(newState, `🦅 ${vulture.name} (벌처 샘) — 탈락자의 카드 ${hand2.length + equip2.length}장 획득`);
      newState = addEffectEvent(newState, {
        kind: "action",
        action: "steal",
        playerId: vulture.studentId,
        targetId,
        count: hand2.length + equip2.length,
        message: "벌처 샘 능력",
      });
    } else {
      for (const card of [...hand2, ...equip2]) newState = discardCard(newState, card);
    }
    newState = setHand(newState, targetId, []);
    newState = setEquip(newState, targetId, []);

    // 무법자 처치 보상: 처치자 카드 3장 드로우
    if (player.role === "outlaw" && killerId !== undefined && killerId !== targetId) {
      const killer = updatedPlayers.find(p => p.studentId === killerId);
      if (killer && killer.status !== "eliminated") {
        const { drawn, state: s2 } = drawFromPile(newState, 3);
        newState = s2;
        newState = setHand(newState, killerId, [...h(newState, killerId), ...drawn]);
        newState = addLog(newState, `💰 ${killer.name} 무법자 처치 보상 — 카드 3장 드로우`);
        newState = addEffectEvent(newState, {
          kind: "action",
          action: "draw",
          playerId: killerId,
          count: drawn.length,
          message: "무법자 처치 보상",
        });
      }
    }

    // 공식 규칙: 보안관이 부관을 처치하면 보안관의 손패와 장착 카드를 모두 버림
    if (player.role === "deputy" && killerId !== undefined) {
      const killer = updatedPlayers.find(p => p.studentId === killerId);
      if (killer?.role === "sheriff") {
        const sheriffHand = h(newState, killerId);
        const sheriffEquip = eq(newState, killerId);
        for (const card of [...sheriffHand, ...sheriffEquip]) newState = discardCard(newState, card);
        newState = setHand(newState, killerId, []);
        newState = setEquip(newState, killerId, []);
        newState = addLog(newState, `⚡ ${killer.name} 보안관이 부관을 처치 — 보안관의 모든 카드 폐기`);
        newState = addEffectEvent(newState, {
          kind: "action",
          action: "discard",
          playerId: killerId,
          count: sheriffHand.length + sheriffEquip.length,
          message: "부관 처치 페널티",
        });
      }
    }
  }

  return { room: { ...room, players: updatedPlayers }, state: newState, died };
}

/**
 * 승리 판정
 * - 배신자: 모든 플레이어(보안관 포함) 탈락 후 혼자만 살아남아야 승리
 * - 무법자: 보안관 사망 (배신자가 단독 생존이 아닐 때)
 * - 보안관/부관: 모든 무법자 + 배신자 탈락
 */
function checkWin(room: BangRoom): "sheriff_deputy" | "outlaw" | "renegade" | null {
  const alive = alivePlayers(room);
  const sheriffAlive = alive.some(p => p.role === "sheriff");
  const outlawsAlive = alive.filter(p => p.role === "outlaw").length;
  const deputiesAlive = alive.filter(p => p.role === "deputy").length;
  const renegadeAlive = alive.filter(p => p.role === "renegade").length;

  if (!sheriffAlive) {
    // 배신자 승: 보안관 포함 전원 탈락, 배신자 혼자 살아남음
    if (renegadeAlive === 1 && outlawsAlive === 0 && deputiesAlive === 0) return "renegade";
    // 무법자 승: 보안관 사망 (배신자 단독 생존 아닐 때)
    return "outlaw";
  }
  // 보안관/부관 승: 무법자 + 배신자 전원 탈락
  if (outlawsAlive === 0 && renegadeAlive === 0) return "sheriff_deputy";
  return null;
}

// ── end game helper (module-level so it can be called before hook declaration order) ──
function doEndGame(
  room: BangRoom,
  winner: "sheriff_deputy" | "outlaw" | "renegade" | "draw",
  persistFn: (r: BangRoom) => BangRoom,
) {
  const labels: Record<string, string> = { sheriff_deputy: "보안관·부관", outlaw: "무법자", renegade: "배신자", draw: "무승부" };
  const state = room.cardState ? { ...room.cardState, phase: "done" as const } : undefined;
  persistFn({
    ...room, status: "finished", winner, finishedAt: new Date().toISOString(),
    cardState: state ? { ...state, log: [`🏆 게임 종료! ${labels[winner]} 승리!`, ...state.log] } : state,
  });
}

// ── main hook ──────────────────────────────────────────────────────────────────

export function useBangCardGame(initialRoom: BangRoom) {
  const [room, setRoom] = useState<BangRoom>(initialRoom);

  const persist = useCallback((r: BangRoom) => {
    const normalized = triggerSuzy(r);
    bangRoomStorage.updateRoom(normalized);
    setRoom(normalized);
    return normalized;
  }, []);

  const chooseCharacter = useCallback((playerId: number, characterId: BangCharacterId) => {
    if (room.status !== "playing" || room.cardState) return null;
    const player = room.players.find(item => item.studentId === playerId);
    if (
      !player
      || player.characterId
      || !player.characterOptions?.includes(characterId)
    ) return null;
    const character = BANG_CHARACTER_BY_ID[characterId];
    const maxLife = character.life + (player.role === "sheriff" ? 1 : 0);
    const players = room.players.map(item =>
      item.studentId === playerId
        ? { ...item, characterId, maxLife, life: maxLife }
        : item
    );
    return persist({ ...room, players });
  }, [room, persist]);

  // ── Initialize card game ────────────────────────────────────────────────────

  const initCardGame = useCallback(() => {
    if (room.players.some(player => !player.characterId || !player.maxLife)) return null;
    const deck = createBangDeck();
    let drawPile = [...deck];
    const hands: Record<string, BangCard[]> = {};
    const equipment: Record<string, BangCard[]> = {};

    // Deal cards: each player gets cards equal to their life
    for (const p of room.players) {
      const dealCount = p.life; // Sheriff has more life
      hands[String(p.studentId)] = drawPile.splice(0, dealCount);
      equipment[String(p.studentId)] = [];
    }

    const state: BangCardGameState = {
      drawPile,
      discardPile: [],
      hands,
      equipment,
      phase: "draw",
      bangUsed: false,
      log: ["🎮 게임 시작! 카드가 배분되었습니다."],
    };

    const updatedRoom = persist({ ...room, cardState: state, status: "playing" });
    return updatedRoom;
  }, [room, persist]);

  // ── Draw phase ──────────────────────────────────────────────────────────────

  const drawCards = useCallback((count = 2) => {
    if (!room.cardState) return;
    let state = room.cardState;
    let currentRoom = room;
    const currentId = room.currentTurnStudentId!;
    const player = room.players.find(p => p.studentId === currentId)!;

    // Check dynamite first
    const playerEquip = eq(state, currentId);
    const dynamite = playerEquip.find(e => e.kind === "dynamite");
    if (dynamite) {
      const check = drawCheckForPlayer(currentRoom, state, player, "dynamite");
      state = check.state;
      const topCard = check.chosen;
      const explodes = check.result;
      state = addEffectEvent(state, {
        kind: "dynamite_check",
        playerId: currentId,
        card: topCard,
        outcome: explodes ? "exploded" : "passed",
      });
      state = addLog(state, `${player.name} 다이너마이트 드로우 확인: ${topCard.suit}${topCard.rank} → ${explodes ? "💥 폭발! (3 피해)" : "다음 플레이어에게 전달"}`);
      if (explodes) {
        state = removeFromEquip(state, currentId, dynamite.id);
        state = discardCard(state, dynamite);
        const result = applyDamage({ ...currentRoom, cardState: state }, state, currentId, 3, "💥 다이너마이트 폭발", undefined, "dynamite");
        state = result.state;
        currentRoom = result.room;
        const win = checkWin(result.room);
        if (win) { doEndGame({ ...result.room, cardState: state }, win, persist); return; }
        if (result.died) {
          persist(advanceTurn(currentRoom, state, currentId));
          return;
        }
      } else {
        // Pass dynamite to left
        state = removeFromEquip(state, currentId, dynamite.id);
        const aliveOrder = room.turnOrder.filter(id => room.players.find(p => p.studentId === id)?.status !== "eliminated");
        const myIdx = aliveOrder.indexOf(currentId);
        const leftId = aliveOrder[(myIdx + 1) % aliveOrder.length];
        state = setEquip(state, leftId, [dynamite, ...eq(state, leftId)]);
        state = addLog(state, `다이너마이트가 ${room.players.find(p => p.studentId === leftId)?.name}에게 전달됨`);
      }
    }

    // Check jail
    const jail = eq(state, currentId).find(e => e.kind === "jail");
    if (jail) {
      const check = drawCheckForPlayer(currentRoom, state, player, "jail");
      state = check.state;
      const topCard = check.chosen;
      state = removeFromEquip(state, currentId, jail.id);
      state = discardCard(state, jail);
      const escape = check.result;
      state = addEffectEvent(state, {
        kind: "jail_check",
        playerId: currentId,
        card: topCard,
        outcome: escape ? "escaped" : "trapped",
      });
      state = addLog(state, `${player.name} 감옥 탈출 시도: ${topCard.suit}${topCard.rank} → ${escape ? "탈출 성공!" : "⛓️ 턴 스킵!"}`);
      if (!escape) {
        persist(advanceTurn(currentRoom, state, currentId));
        return;
      }
    }

    // Choice-based character abilities pause only the current draw phase.
    // The active player makes the actual choice in the shared UI.
    let drawnCards: BangCard[] = [];
    if (player.characterId === "kit_carlson") {
      const result = drawFromPile(state, 3);
      state = result.state;
      state = addLog(state, `🦅 ${player.name} (키트 칼슨) — 공개된 3장 중 2장 선택 대기`);
      state = {
        ...state,
        pending: { type: "kit_carlson_draw", playerId: currentId, cards: result.drawn },
      };
      persist({ ...currentRoom, cardState: state });
      return;
    } else if (player.characterId === "pedro_ramirez" && state.discardPile.length > 0) {
      const topDiscard = state.discardPile[0];
      state = addLog(state, `♻️ ${player.name} (페드로 라미레즈) — 첫 카드를 버린 더미에서 가져올지 선택 대기`);
      state = {
        ...state,
        pending: {
          type: "pedro_ramirez_draw",
          playerId: currentId,
          discardCardId: topDiscard.id,
        },
      };
      persist({ ...currentRoom, cardState: state });
      return;
    } else if (player.characterId === "jesse_jones") {
      const eligiblePlayerIds = currentRoom.players
        .filter(other => other.studentId !== currentId && other.status !== "eliminated" && h(state, other.studentId).length > 0)
        .map(other => other.studentId);
      if (eligiblePlayerIds.length > 0) {
        state = addLog(state, `🕵️ ${player.name} (제시 존스) — 첫 카드를 가져올 플레이어 선택 대기`);
        state = {
          ...state,
          pending: { type: "jesse_jones_draw", playerId: currentId, eligiblePlayerIds },
        };
        persist({ ...currentRoom, cardState: state });
        return;
      }
    }
    if (drawnCards.length === 0) {
      const result = drawFromPile(state, count);
      state = result.state;
      drawnCards = result.drawn;
    }
    if (player.characterId === "black_jack" && drawnCards[1] && ["H", "D"].includes(drawnCards[1].suit)) {
      const result = drawFromPile(state, 1);
      state = result.state;
      drawnCards = [...drawnCards, ...result.drawn];
      state = addLog(state, `🃏 ${player.name} (블랙 잭) — 두 번째 카드가 빨간색이라 1장 추가`);
    }
    const currentHand = h(state, currentId);
    state = setHand(state, currentId, [...currentHand, ...drawnCards]);
    state = addLog(state, `${player.name} 카드 ${count}장 드로우`);
    state = addEffectEvent(state, {
      kind: "action",
      action: "draw",
      playerId: currentId,
      count: drawnCards.length,
      message: player.characterId === "black_jack" && drawnCards.length > count ? "블랙 잭 추가 드로우" : "턴 드로우",
    });
    state = { ...state, phase: "play", bangUsed: false };

    persist({ ...currentRoom, cardState: state });
  }, [room, persist]);

  const resolveKitCarlsonDraw = useCallback((playerId: number, selectedCardIds: string[]) => {
    if (!room.cardState?.pending || room.cardState.pending.type !== "kit_carlson_draw") return;
    const pending = room.cardState.pending;
    if (pending.playerId !== playerId || room.currentTurnStudentId !== playerId) return;
    const uniqueIds = [...new Set(selectedCardIds)];
    if (uniqueIds.length !== 2) return;
    const selected = pending.cards.filter(card => uniqueIds.includes(card.id));
    if (selected.length !== 2) return;
    const returned = pending.cards.filter(card => !uniqueIds.includes(card.id));
    const player = room.players.find(item => item.studentId === playerId);
    if (!player) return;

    let state: BangCardGameState = {
      ...room.cardState,
      drawPile: [...returned, ...room.cardState.drawPile],
    };
    state = completeCharacterDraw(state, player, selected, `🦅 ${player.name} (키트 칼슨) 능력 발동`);
    persist({ ...room, cardState: state });
  }, [room, persist]);

  const resolvePedroRamirezDraw = useCallback((playerId: number, useDiscardPile: boolean) => {
    if (!room.cardState?.pending || room.cardState.pending.type !== "pedro_ramirez_draw") return;
    const pending = room.cardState.pending;
    if (pending.playerId !== playerId || room.currentTurnStudentId !== playerId) return;
    const player = room.players.find(item => item.studentId === playerId);
    if (!player) return;

    let state = room.cardState;
    let drawnCards: BangCard[];
    const topDiscard = state.discardPile[0];
    if (useDiscardPile && topDiscard?.id === pending.discardCardId) {
      state = { ...state, discardPile: state.discardPile.slice(1) };
      const result = drawFromPile(state, 1);
      state = result.state;
      drawnCards = [topDiscard, ...result.drawn];
    } else {
      const result = drawFromPile(state, 2);
      state = result.state;
      drawnCards = result.drawn;
    }
    const choice = useDiscardPile && topDiscard?.id === pending.discardCardId
      ? "버린 카드 더미의 첫 카드를 선택"
      : "덱에서 일반 드로우를 선택";
    state = completeCharacterDraw(state, player, drawnCards, `♻️ ${player.name} (페드로 라미레즈) · ${choice}`);
    persist({ ...room, cardState: state });
  }, [room, persist]);

  const resolveJesseJonesDraw = useCallback((playerId: number, targetPlayerId?: number) => {
    if (!room.cardState?.pending || room.cardState.pending.type !== "jesse_jones_draw") return;
    const pending = room.cardState.pending;
    if (pending.playerId !== playerId || room.currentTurnStudentId !== playerId) return;
    const player = room.players.find(item => item.studentId === playerId);
    if (!player) return;

    let state = room.cardState;
    let drawnCards: BangCard[] = [];
    let choice = "덱에서 일반 드로우를 선택";
    if (targetPlayerId !== undefined && pending.eligiblePlayerIds.includes(targetPlayerId)) {
      const donor = room.players.find(item => item.studentId === targetPlayerId);
      const donorHand = h(state, targetPlayerId);
      if (donor && donorHand.length > 0) {
        const stolen = donorHand[Math.floor(Math.random() * donorHand.length)];
        state = removeFromHand(state, targetPlayerId, stolen.id);
        const result = drawFromPile(state, 1);
        state = result.state;
        drawnCards = [stolen, ...result.drawn];
        choice = `${donor.name}의 손패에서 첫 카드 획득`;
      }
    }
    if (drawnCards.length === 0) {
      const result = drawFromPile(state, 2);
      state = result.state;
      drawnCards = result.drawn;
    }
    state = completeCharacterDraw(state, player, drawnCards, `🕵️ ${player.name} (제시 존스) · ${choice}`);
    persist({ ...room, cardState: state });
  }, [room, persist]);

  // ── Play a card ─────────────────────────────────────────────────────────────

  const playCard = useCallback((cardId: string, fromId: number) => {
    if (!room.cardState) return;
    let state = room.cardState;
    const card = h(state, fromId).find(c => c.id === cardId);
    if (!card) return;
    const player = room.players.find(p => p.studentId === fromId)!;
    const aliveOrder = room.turnOrder.filter(id => room.players.find(p => p.studentId === id)?.status !== "eliminated");

    // 감옥은 자신의 장비가 아니라 다른 플레이어 앞에 놓는 파란 카드다.
    if (card.kind === "jail") {
      state = { ...state, pending: { type: "await_target", action: "jail_on", cardId, fromId } };
      persist({ ...room, cardState: state });
      return;
    }

    // Equipment: place on table
    if (IS_EQUIPMENT[card.kind]) {
      let playerEquip = eq(state, fromId);
      if (playerEquip.some(e => e.kind === card.kind)) {
        state = addLog(state, "이미 같은 카드가 장착되어 있습니다!");
        persist({ ...room, cardState: state });
        return;
      }
      // 새 무기를 놓으면 기존 무기는 즉시 버린다.
      if (WEAPON_KINDS.includes(card.kind)) {
        const oldWeapon = playerEquip.find(e => WEAPON_KINDS.includes(e.kind));
        if (oldWeapon) {
          state = removeFromEquip(state, fromId, oldWeapon.id);
          state = discardCard(state, oldWeapon);
          playerEquip = eq(state, fromId);
          state = addLog(state, `${player.name} 기존 무기 교체`);
        }
      }
      state = removeFromHand(state, fromId, cardId);
      state = setEquip(state, fromId, [card, ...playerEquip]);
      state = addLog(state, `${player.name} 「${CARD_NAME[card.kind]}」 장착`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "equip",
        playerId: fromId,
        cardKind: card.kind,
      });
      persist({ ...room, cardState: state });
      return;
    }

    // Cards that need a target
    const actsAsBang = card.kind === "bang" || (card.kind === "missed" && player.characterId === "calamity_janet");
    if (actsAsBang) {
      const unlimitedBang = hasVolcanic(eq(state, fromId)) || player.characterId === "willy_the_kid";
      if (state.bangUsed && !unlimitedBang) {
        state = addLog(state, "이번 턴에 이미 BANG!을 사용했습니다 (화산총/윌리 더 키드만 무제한)");
        persist({ ...room, cardState: state });
        return;
      }
      if (card.kind === "missed" && player.characterId === "calamity_janet") {
        state = addLog(state, `🔄 ${player.name} (칼라미티 자넷) — Missed!를 BANG!으로 사용`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "ability",
          playerId: fromId,
          characterId: "calamity_janet",
          message: "Missed! 카드를 BANG!으로 바꿔 사용합니다.",
        });
      }
      if (state.bangUsed && player.characterId === "willy_the_kid" && !hasVolcanic(eq(state, fromId))) {
        state = addLog(state, `🤠 ${player.name} (윌리 더 키드) — BANG! 추가 사용`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "ability",
          playerId: fromId,
          characterId: "willy_the_kid",
          message: "이번 턴에도 BANG!을 계속 사용할 수 있습니다.",
        });
      }
      state = { ...state, pending: { type: "await_target", action: "bang", cardId, fromId } };
      persist({ ...room, cardState: state });
      return;
    }
    if (card.kind === "duel") {
      state = { ...state, pending: { type: "await_target", action: "duel", cardId, fromId } };
      persist({ ...room, cardState: state });
      return;
    }
    if (card.kind === "cat_balou") {
      state = { ...state, pending: { type: "await_cat_balou", cardId, fromId } };
      persist({ ...room, cardState: state });
      return;
    }
    if (card.kind === "panic") {
      state = { ...state, pending: { type: "await_panic", cardId, fromId } };
      persist({ ...room, cardState: state });
      return;
    }
    if (card.kind === "missed") {
      state = addLog(state, "Missed!는 공격에 대응할 때만 사용할 수 있습니다.");
      persist({ ...room, cardState: state });
      return;
    }

    // Immediate effect cards
    state = removeFromHand(state, fromId, cardId);
    state = discardCard(state, card);

    if (card.kind === "beer") {
      const p = room.players.find(p2 => p2.studentId === fromId)!;
      const maxLife = playerMaxLife(p);
      if (aliveOrder.length <= 2) {
        state = addLog(state, `${p.name} 맥주 사용 — 생존자가 2명뿐이라 효과 없음`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "beer",
          playerId: fromId,
          cardKind: "beer",
          amount: 0,
          lifeBefore: p.life,
          lifeAfter: p.life,
          message: "생존자 2명 · 회복 효과 없음",
        });
      } else if (p.life >= maxLife) {
        state = addLog(state, `${p.name} 이미 최대 체력 — 맥주 효과 없음`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "beer",
          playerId: fromId,
          cardKind: "beer",
          amount: 0,
          lifeBefore: p.life,
          lifeAfter: p.life,
          message: "이미 최대 체력입니다.",
        });
      } else {
        const nextLife = Math.min(p.life + 1, maxLife);
        const updatedPlayers = room.players.map(p2 =>
          p2.studentId === fromId ? { ...p2, life: nextLife } : p2
        );
        state = addLog(state, `${p.name} 맥주 마심 🍺 (+1 체력)`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "beer",
          playerId: fromId,
          cardKind: "beer",
          amount: 1,
          lifeBefore: p.life,
          lifeAfter: nextLife,
        });
        persist({ ...room, players: updatedPlayers, cardState: state });
        return;
      }
    }

    if (card.kind === "saloon") {
      const saloonPlayer = room.players.find(p2 => p2.studentId === fromId)!;
      const selfLifeBefore = saloonPlayer.life;
      const selfLifeAfter = Math.min(
        selfLifeBefore + 1,
        playerMaxLife(saloonPlayer),
      );
      const otherPlayers = room.players.filter(
        p2 => p2.status !== "eliminated" && p2.studentId !== fromId,
      );
      const updatedPlayers = room.players.map(p2 => {
        if (p2.status === "eliminated") return p2;
        const maxLife = playerMaxLife(p2);
        return { ...p2, life: Math.min(p2.life + 1, maxLife) };
      });
      state = addLog(
        state,
        `${player.name} 주점! 🍻 다른 생존자 ${otherPlayers.length}명 + 본인 체력 1 회복`,
      );
      state = addEffectEvent(state, {
        kind: "action",
        action: "saloon",
        playerId: fromId,
        cardKind: "saloon",
        count: otherPlayers.length,
        amount: selfLifeAfter - selfLifeBefore,
        lifeBefore: selfLifeBefore,
        lifeAfter: selfLifeAfter,
        message: "다른 플레이어 전원 +1 · 본인 +1",
      });
      persist({ ...room, players: updatedPlayers, cardState: state });
      return;
    }

    if (card.kind === "stagecoach") {
      const { drawn, state: s2 } = drawFromPile(state, 2);
      state = s2;
      state = setHand(state, fromId, [...h(state, fromId), ...drawn]);
      state = addLog(state, `${player.name} 역마차 — 카드 2장 드로우`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "draw",
        playerId: fromId,
        cardKind: "stagecoach",
        count: drawn.length,
        message: "역마차",
      });
    }

    if (card.kind === "wells_fargo") {
      const { drawn, state: s2 } = drawFromPile(state, 3);
      state = s2;
      state = setHand(state, fromId, [...h(state, fromId), ...drawn]);
      state = addLog(state, `${player.name} 웰스파고 — 카드 3장 드로우`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "draw",
        playerId: fromId,
        cardKind: "wells_fargo",
        count: drawn.length,
        message: "웰스파고",
      });
    }

    if (card.kind === "general_store") {
      const order = orderedFrom(room, fromId);
      const result = drawFromPile(state, order.length);
      state = result.state;
      state = addLog(state, `${player.name} 잡화점! 🛒 — 공개 카드에서 차례대로 1장 선택`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "store_pick",
        playerId: fromId,
        cardKind: "general_store",
        count: result.drawn.length,
        message: "공개 카드 선택 시작",
      });
      state = { ...state, pending: { type: "general_store_pick", fromId, remaining: order, available: result.drawn } };
    }

    if (card.kind === "indians") {
      const targets = aliveOrder.filter(id => id !== fromId);
      state = addLog(state, `${player.name} 인디언! 🪶 — ${targets.map(id => room.players.find(p2 => p2.studentId === id)?.name).join(", ")} BANG! 또는 1 피해`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "group_attack",
        playerId: fromId,
        cardKind: "indians",
        count: targets.length,
      });
      state = { ...state, pending: { type: "indians_response", fromId, remaining: targets } };
    }

    if (card.kind === "gatling") {
      const targets = aliveOrder.filter(id => id !== fromId);
      state = addLog(state, `${player.name} 개틀링! ⚙️ — 모든 플레이어가 Missed! 또는 1 피해`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "group_attack",
        playerId: fromId,
        cardKind: "gatling",
        count: targets.length,
      });
      state = { ...state, pending: { type: "gatling_response", fromId, remaining: targets } };
    }

    persist({ ...room, cardState: state });
  }, [room, persist]);

  // ── Select target (after await_target) ─────────────────────────────────────

  const selectTarget = useCallback((targetId: number) => {
    if (!room.cardState?.pending) return;
    const pending = room.cardState.pending;
    if (pending.type !== "await_target") return;
    let state = room.cardState;
    const { fromId, cardId, action } = pending;
    const card = h(state, fromId).find(c => c.id === cardId);
    if (!card) return;
    const attacker = room.players.find(p => p.studentId === fromId)!;
    const target = room.players.find(p => p.studentId === targetId)!;

    if (action === "bang") {
      const aliveOrder = orderedFrom(room, fromId);
      const fromIdx = aliveOrder.indexOf(fromId);
      const targetIdx = aliveOrder.indexOf(targetId);
      if (targetId === fromId || targetIdx < 0 || !canTarget(
        fromIdx,
        targetIdx,
        aliveOrder.length,
        eq(state, fromId),
        eq(state, targetId),
        attacker.characterId,
        target.characterId,
      )) {
        state = addLog(state, "대상이 사거리 밖이거나 유효하지 않습니다.");
        persist({ ...room, cardState: { ...state, pending: undefined } });
        return;
      }
      state = removeFromHand(state, fromId, cardId);
      state = discardCard(state, card);
      state = { ...state, bangUsed: true };
      // Check barrel
      const targetEquip = eq(state, targetId);
      const barrelAttempts =
        (targetEquip.some(e => e.kind === "barrel") ? 1 : 0)
        + (target.characterId === "jourdonnais" ? 1 : 0);
      if (target.characterId === "jourdonnais") {
        state = addLog(state, `🛢️ ${target.name} (주르도네) — 통 판정 1회 추가`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "ability",
          playerId: targetId,
          characterId: "jourdonnais",
          message: "통을 장착한 것처럼 자동 회피 판정을 시도합니다.",
        });
      }
      let blockedByBarrel = false;
      for (let attempt = 0; attempt < barrelAttempts; attempt += 1) {
        const check = drawCheckForPlayer(room, state, target, "barrel");
        state = check.state;
        const topCard = check.chosen;
        blockedByBarrel = check.result;
        state = addEffectEvent(state, {
          kind: "barrel_check",
          playerId: targetId,
          card: topCard,
          outcome: blockedByBarrel ? "dodged" : "failed",
        });
        state = addLog(
          state,
          `${target.name} 통 판정 ${attempt + 1}/${barrelAttempts}: ${topCard.suit}${topCard.rank} → ${blockedByBarrel ? "💨 회피 성공!" : "실패"}`,
        );
        if (blockedByBarrel) break;
      }
      if (blockedByBarrel) {
        if (attacker.characterId === "slab_the_killer") {
          state = addLog(state, `💥 ${attacker.name} (슬랩 더 킬러) — Missed!가 1장 더 필요`);
          state = addEffectEvent(state, {
            kind: "action",
            action: "ability",
            playerId: fromId,
            targetId,
            characterId: "slab_the_killer",
            message: `${target.name}의 통 판정은 첫 회피로 처리됩니다. 회피 카드 1장이 더 필요합니다.`,
          });
          state = { ...state, pending: { type: "bang_response", fromId, targetId, cardId: card.id, missesNeeded: 2, missesPlayed: 1 } };
        } else {
          state = { ...state, pending: undefined };
        }
        persist({ ...room, cardState: state });
        return;
      }
      state = addLog(state, `${attacker.name} → ${target.name} BANG! 🔫`);
      if (attacker.characterId === "slab_the_killer") {
        state = addLog(state, `🎯 ${attacker.name} (슬랩 더 킬러) — 회피 카드 2장 필요`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "ability",
          playerId: fromId,
          targetId,
          characterId: "slab_the_killer",
          message: `${target.name}은 이 BANG!을 막으려면 회피 카드 2장을 내야 합니다.`,
        });
      }
      state = {
        ...state,
        pending: {
          type: "bang_response",
          fromId,
          targetId,
          cardId: card.id,
          missesNeeded: attacker.characterId === "slab_the_killer" ? 2 : 1,
          missesPlayed: 0,
        },
      };
    }

    if (action === "duel") {
      state = removeFromHand(state, fromId, cardId);
      state = discardCard(state, card);
      state = addLog(state, `${attacker.name} → ${target.name} 결투! 🤝`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "duel",
        playerId: fromId,
        targetId,
        cardKind: "duel",
      });
      state = { ...state, pending: { type: "duel_response", p1: fromId, p2: targetId, currentId: targetId } };
    }

    if (action === "jail_on") {
      if (target.role === "sheriff") {
        state = addLog(state, "보안관은 감옥에 넣을 수 없습니다!");
        state = { ...state, pending: undefined };
        persist({ ...room, cardState: state });
        return;
      }
      if (targetId === fromId || target.status === "eliminated" || eq(state, targetId).some(item => item.kind === "jail")) {
        state = addLog(state, "유효하지 않은 감옥 대상입니다.");
        state = { ...state, pending: undefined };
        persist({ ...room, cardState: state });
        return;
      }
      state = removeFromHand(state, fromId, cardId);
      state = setEquip(state, targetId, [card, ...eq(state, targetId)]);
      state = addLog(state, `${attacker.name} → ${target.name} 감옥! ⛓️`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "jail",
        playerId: fromId,
        targetId,
        cardKind: "jail",
      });
      state = { ...state, pending: undefined };
    }

    persist({ ...room, cardState: state });
  }, [room, persist]);

  // ── Select card for cat_balou / panic ───────────────────────────────────────

  const selectCardTarget = useCallback((targetPlayerId: number, targetCardId: string, fromEquip: boolean) => {
    if (!room.cardState?.pending) return;
    const pending = room.cardState.pending;
    if (pending.type !== "await_cat_balou" && pending.type !== "await_panic") return;
    let state = room.cardState;
    const { fromId, cardId } = pending;
    const card = h(state, fromId).find(c => c.id === cardId);
    if (!card) return;
    const attacker = room.players.find(p => p.studentId === fromId)!;
    const target = room.players.find(p => p.studentId === targetPlayerId)!;

    if (pending.type === "await_panic") {
      const aliveOrder = orderedFrom(room, fromId);
      const distance = effectiveDistance(
        aliveOrder.indexOf(fromId),
        aliveOrder.indexOf(targetPlayerId),
        aliveOrder.length,
        eq(state, fromId),
        eq(state, targetPlayerId),
        attacker.characterId,
        target.characterId,
      );
      if (targetPlayerId === fromId || distance !== 1) {
        state = addLog(state, "강탈은 거리 1인 플레이어에게만 사용할 수 있습니다.");
        persist({ ...room, cardState: { ...state, pending: undefined } });
        return;
      }
    }

    let targetCard: BangCard | undefined;
    if (fromEquip) {
      targetCard = eq(state, targetPlayerId).find(c => c.id === targetCardId);
    } else {
      targetCard = h(state, targetPlayerId).find(c => c.id === targetCardId);
    }
    if (!targetCard) return;

    state = removeFromHand(state, fromId, cardId);
    state = discardCard(state, card);

    if (pending.type === "await_cat_balou") {
      if (fromEquip) {
        state = removeFromEquip(state, targetPlayerId, targetCardId);
      } else {
        state = removeFromHand(state, targetPlayerId, targetCardId);
      }
      state = discardCard(state, targetCard);
      state = addLog(state, `${attacker.name} 캣발루 — ${target.name}의 「${targetCard.kind}」 버림`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "discard",
        playerId: fromId,
        targetId: targetPlayerId,
        cardKind: targetCard.kind,
        count: 1,
        message: "캣발루",
      });
    }

    if (pending.type === "await_panic") {
      if (fromEquip) {
        state = removeFromEquip(state, targetPlayerId, targetCardId);
      } else {
        state = removeFromHand(state, targetPlayerId, targetCardId);
      }
      state = setHand(state, fromId, [...h(state, fromId), targetCard]);
      state = addLog(state, `${attacker.name} 강탈 — ${target.name}의 카드 가져감`);
      state = addEffectEvent(state, {
        kind: "action",
        action: "steal",
        playerId: fromId,
        targetId: targetPlayerId,
        cardKind: targetCard.kind,
        count: 1,
        message: "강탈",
      });
    }

    state = { ...state, pending: undefined };
    persist({ ...room, cardState: state });
  }, [room, persist]);

  // ── General Store ────────────────────────────────────────────────────────────

  const chooseGeneralStoreCard = useCallback((playerId: number, cardId: string) => {
    if (!room.cardState?.pending || room.cardState.pending.type !== "general_store_pick") return;
    const pending = room.cardState.pending;
    if (pending.remaining[0] !== playerId) return;
    const selected = pending.available.find(card => card.id === cardId);
    if (!selected) return;

    let state = setHand(room.cardState, playerId, [...h(room.cardState, playerId), selected]);
    const available = pending.available.filter(card => card.id !== cardId);
    const remaining = pending.remaining.slice(1);
    state = addLog(state, `🛒 ${room.players.find(player => player.studentId === playerId)?.name} 잡화점 카드 선택`);
    state = addEffectEvent(state, {
      kind: "action",
      action: "store_pick",
      playerId,
      cardKind: selected.kind,
      count: 1,
      message: "잡화점에서 카드를 선택했습니다.",
    });
    if (remaining.length === 0) {
      for (const card of available) state = discardCard(state, card);
      state = { ...state, pending: undefined };
    } else {
      state = { ...state, pending: { ...pending, remaining, available } };
    }
    persist({ ...room, cardState: state });
  }, [room, persist]);

  // ── Sid Ketchum ──────────────────────────────────────────────────────────────

  const useSidAbility = useCallback((playerId: number, selectedCardIds: string[]) => {
    if (!room.cardState) return;
    const player = room.players.find(item => item.studentId === playerId);
    if (!player || player.characterId !== "sid_ketchum" || player.life >= playerMaxLife(player)) return;
    const uniqueIds = [...new Set(selectedCardIds)];
    if (uniqueIds.length !== 2) return;
    const playerHand = h(room.cardState, playerId);
    const cards = uniqueIds
      .map(cardId => playerHand.find(card => card.id === cardId))
      .filter((card): card is BangCard => Boolean(card));
    if (cards.length !== 2) return;
    let state = room.cardState;
    for (const card of cards) {
      state = removeFromHand(state, playerId, card.id);
      state = discardCard(state, card);
    }
    const players = room.players.map(item =>
      item.studentId === playerId ? { ...item, life: Math.min(item.life + 1, playerMaxLife(item)) } : item
    );
    state = addLog(state, `💊 ${player.name} (시드 케첨) — 손패 2장을 버리고 체력 1 회복`);
    state = addEffectEvent(state, {
      kind: "action",
      action: "heal",
      playerId,
      amount: 1,
      lifeBefore: player.life,
      lifeAfter: Math.min(player.life + 1, playerMaxLife(player)),
      message: "시드 케첨 능력",
    });
    persist({ ...room, players, cardState: state });
  }, [room, persist]);

  // ── Respond (Missed!, BANG! for duel/indians, or pass) ─────────────────────

  const respond = useCallback((
    action: "play_missed" | "play_bang" | "pass",
    responderId: number,
    cardId?: string,
  ) => {
    if (!room.cardState?.pending) return;
    const pending = room.cardState.pending;
    let state = room.cardState;
    let currentRoom = { ...room };

    // BANG! response (Missed! or pass)
    if (pending.type === "bang_response") {
      const { fromId, targetId } = pending;
      if (responderId !== targetId) return;
      const responder = room.players.find(p => p.studentId === targetId)!;
      const attacker = room.players.find(p => p.studentId === fromId)!;

      if (action === "play_missed" && cardId) {
        const missedCard = h(state, targetId).find(c => c.id === cardId);
        const canActAsMissed = missedCard?.kind === "missed" || (missedCard?.kind === "bang" && responder.characterId === "calamity_janet");
        if (!missedCard || !canActAsMissed) return;
        state = removeFromHand(state, targetId, cardId);
        state = discardCard(state, missedCard);
        if (missedCard.kind === "bang" && responder.characterId === "calamity_janet") {
          state = addLog(state, `🔄 ${responder.name} (칼라미티 자넷) — BANG!을 Missed!로 사용`);
          state = addEffectEvent(state, {
            kind: "action",
            action: "ability",
            playerId: targetId,
            characterId: "calamity_janet",
            message: "BANG! 카드를 Missed!로 바꿔 사용합니다.",
          });
        }
        const missesPlayed = pending.missesPlayed + 1;
        state = addEffectEvent(state, {
          kind: "action",
          action: "dodge",
          playerId: targetId,
          cardKind: missedCard.kind,
          message: missesPlayed < pending.missesNeeded ? "추가 회피 카드가 필요합니다." : "BANG! 회피 성공",
        });
        if (missesPlayed < pending.missesNeeded) {
          state = addLog(state, `${responder.name} Missed! 💨 — 슬랩의 BANG!을 막으려면 ${pending.missesNeeded - missesPlayed}장 더 필요`);
          state = { ...state, pending: { ...pending, missesPlayed } };
        } else {
          state = addLog(state, `${responder.name} Missed! 💨 — 회피 성공`);
          state = { ...state, pending: undefined };
        }
        persist({ ...currentRoom, cardState: state });
        return;
      }

      if (action === "pass") {
        state = addLog(state, `${responder.name} 회피 포기 — 1 피해`);
        const result = applyDamage(currentRoom, state, targetId, 1, `${attacker.name}의 BANG!`, fromId, "bang");
        state = result.state;
        currentRoom = result.room;
        state = { ...state, pending: undefined };
        const win = checkWin(currentRoom);
        if (win) { doEndGame({ ...currentRoom, cardState: state }, win, persist); return; }
        persist({ ...currentRoom, cardState: state });
        return;
      }
    }

    // Indians response
    if (pending.type === "indians_response") {
      const { fromId, remaining } = pending;
      const targetId = remaining[0];
      if (responderId !== targetId) return;
      const responder = room.players.find(p => p.studentId === targetId)!;
      const attacker = room.players.find(p => p.studentId === fromId)!;

      if (action === "play_bang" && cardId) {
        const bangCard = h(state, targetId).find(c => c.id === cardId);
        const canActAsBang = bangCard?.kind === "bang" || (bangCard?.kind === "missed" && responder.characterId === "calamity_janet");
        if (!bangCard || !canActAsBang) return;
        state = removeFromHand(state, targetId, cardId);
        state = discardCard(state, bangCard);
        if (bangCard.kind === "missed" && responder.characterId === "calamity_janet") {
          state = addLog(state, `🔄 ${responder.name} (칼라미티 자넷) — Missed!를 BANG!으로 사용`);
          state = addEffectEvent(state, {
            kind: "action",
            action: "ability",
            playerId: targetId,
            characterId: "calamity_janet",
            message: "Missed! 카드를 BANG!으로 바꿔 인디언에 대응합니다.",
          });
        }
        state = addLog(state, `${responder.name} BANG! 으로 인디언 대응`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "dodge",
          playerId: targetId,
          cardKind: bangCard.kind,
          message: "인디언 방어 성공",
        });
        const newRemaining = remaining.slice(1);
        state = { ...state, pending: newRemaining.length === 0 ? undefined : { ...pending, remaining: newRemaining } };
        persist({ ...currentRoom, cardState: state });
        return;
      }

      if (action === "pass") {
        state = addLog(state, `${responder.name} 인디언 대응 실패 — 1 피해`);
        const result = applyDamage(currentRoom, state, targetId, 1, `${attacker.name}의 인디언`, fromId, "indians");
        state = result.state;
        currentRoom = result.room;
        const newRemaining = remaining.slice(1);
        state = { ...state, pending: newRemaining.length === 0 ? undefined : { ...pending, remaining: newRemaining } };
        const win = checkWin(currentRoom);
        if (win) { doEndGame({ ...currentRoom, cardState: state }, win, persist); return; }
        persist({ ...currentRoom, cardState: state });
        return;
      }
    }

    // Gatling response: Missed! (not BANG!) or damage.
    if (pending.type === "gatling_response") {
      const { fromId, remaining } = pending;
      const targetId = remaining[0];
      if (responderId !== targetId) return;
      const responder = room.players.find(p => p.studentId === targetId)!;
      const attacker = room.players.find(p => p.studentId === fromId)!;

      if (action === "play_missed" && cardId) {
        const missedCard = h(state, targetId).find(c => c.id === cardId);
        const canActAsMissed = missedCard?.kind === "missed" || (missedCard?.kind === "bang" && responder.characterId === "calamity_janet");
        if (!missedCard || !canActAsMissed) return;
        state = removeFromHand(state, targetId, cardId);
        state = discardCard(state, missedCard);
        if (missedCard.kind === "bang" && responder.characterId === "calamity_janet") {
          state = addLog(state, `🔄 ${responder.name} (칼라미티 자넷) — BANG!을 Missed!로 사용`);
          state = addEffectEvent(state, {
            kind: "action",
            action: "ability",
            playerId: targetId,
            characterId: "calamity_janet",
            message: "BANG! 카드를 Missed!로 바꿔 개틀링을 회피합니다.",
          });
        }
        state = addLog(state, `${responder.name} Missed! — 개틀링 회피`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "dodge",
          playerId: targetId,
          cardKind: missedCard.kind,
          message: "개틀링 회피 성공",
        });
        const newRemaining = remaining.slice(1);
        state = { ...state, pending: newRemaining.length === 0 ? undefined : { ...pending, remaining: newRemaining } };
        persist({ ...currentRoom, cardState: state });
        return;
      }

      if (action === "pass") {
        state = addLog(state, `${responder.name} 개틀링 회피 실패 — 1 피해`);
        const result = applyDamage(currentRoom, state, targetId, 1, `${attacker.name}의 개틀링`, fromId, "gatling");
        state = result.state;
        currentRoom = result.room;
        const newRemaining = remaining.slice(1).filter(id => currentRoom.players.find(player => player.studentId === id)?.status !== "eliminated");
        state = { ...state, pending: newRemaining.length === 0 ? undefined : { ...pending, remaining: newRemaining } };
        const win = checkWin(currentRoom);
        if (win) { doEndGame({ ...currentRoom, cardState: state }, win, persist); return; }
        persist({ ...currentRoom, cardState: state });
        return;
      }
    }

    // Duel response
    if (pending.type === "duel_response") {
      const { p1, p2, currentId } = pending;
      if (responderId !== currentId) return;
      const attacker = room.players.find(p => p.studentId === (currentId === p2 ? p1 : p2))!;
      const responder = room.players.find(p => p.studentId === currentId)!;

      if (action === "play_bang" && cardId) {
        const bangCard = h(state, currentId).find(c => c.id === cardId);
        const canActAsBang = bangCard?.kind === "bang" || (bangCard?.kind === "missed" && responder.characterId === "calamity_janet");
        if (!bangCard || !canActAsBang) return;
        state = removeFromHand(state, currentId, cardId);
        state = discardCard(state, bangCard);
        if (bangCard.kind === "missed" && responder.characterId === "calamity_janet") {
          state = addLog(state, `🔄 ${responder.name} (칼라미티 자넷) — Missed!를 BANG!으로 사용`);
          state = addEffectEvent(state, {
            kind: "action",
            action: "ability",
            playerId: currentId,
            characterId: "calamity_janet",
            message: "Missed! 카드를 BANG!으로 바꿔 결투를 이어갑니다.",
          });
        }
        state = addLog(state, `${responder.name} BANG! — 결투 계속`);
        state = addEffectEvent(state, {
          kind: "action",
          action: "duel",
          playerId: currentId,
          targetId: currentId === p2 ? p1 : p2,
          cardKind: bangCard.kind,
          message: "결투 반격",
        });
        state = { ...state, pending: { ...pending, currentId: currentId === p2 ? p1 : p2 } };
        persist({ ...currentRoom, cardState: state });
        return;
      }

      if (action === "pass") {
        state = addLog(state, `${responder.name} 결투 패배 — 1 피해`);
        const result = applyDamage(currentRoom, state, currentId, 1, `${attacker.name}의 결투`, attacker.studentId, "duel");
        state = result.state;
        currentRoom = result.room;
        state = { ...state, pending: undefined };
        const win = checkWin(currentRoom);
        if (win) { doEndGame({ ...currentRoom, cardState: state }, win, persist); return; }
        persist({ ...currentRoom, cardState: state });
        return;
      }
    }
  }, [room, persist]);

  // ── Cancel pending ──────────────────────────────────────────────────────────

  const cancelPending = useCallback(() => {
    if (!room.cardState?.pending) return;
    persist({ ...room, cardState: { ...room.cardState, pending: undefined } });
  }, [room, persist]);

  // ── Discard ─────────────────────────────────────────────────────────────────

  const discardFromHand = useCallback((playerId: number, cardId: string) => {
    if (!room.cardState || room.cardState.pending?.type !== "discard" || room.cardState.pending.playerId !== playerId) return;
    let state = room.cardState;
    const card = h(state, playerId).find(c => c.id === cardId);
    if (!card) return;
    state = removeFromHand(state, playerId, cardId);
    state = discardCard(state, card);
    const player = room.players.find(p => p.studentId === playerId)!;
    state = addLog(state, `${player.name} 카드 버림: ${card.kind}`);
    state = addEffectEvent(state, {
      kind: "action",
      action: "discard",
      playerId,
      cardKind: card.kind,
      count: 1,
      message: "손패 제한 초과",
    });
    const remaining = room.cardState.pending.excess - 1;
    if (remaining > 0) {
      state = { ...state, pending: { type: "discard", playerId, excess: remaining } };
      persist({ ...room, cardState: state });
    } else {
      persist(advanceTurn(room, { ...state, pending: undefined }, playerId));
    }
  }, [room, persist]);

  // ── End turn ────────────────────────────────────────────────────────────────

  const endTurn = useCallback(() => {
    if (!room.cardState) return;
    let state = room.cardState;
    const currentId = room.currentTurnStudentId!;
    const player = room.players.find(p => p.studentId === currentId)!;
    const handSize = h(state, currentId).length;
    const limit = player.life;

    if (handSize > limit) {
      state = { ...state, phase: "discard", pending: { type: "discard", playerId: currentId, excess: handSize - limit } };
      persist({ ...room, cardState: state });
      return;
    }

    persist(advanceTurn(room, state, currentId));
  }, [room, persist]);

  // ── End game ────────────────────────────────────────────────────────────────

  const endGame = useCallback((winner: "sheriff_deputy" | "outlaw" | "renegade" | "draw") => {
    doEndGame(room, winner, persist);
  }, [room, persist]);

  // ── Room chat ────────────────────────────────────────────────────────────────

  const sendChatMessage = useCallback((senderId: number, rawMessage: string) => {
    const sender = room.players.find(player => player.studentId === senderId);
    const message = rawMessage.trim().slice(0, 200);
    if (!sender || !message) return false;

    const chatMessages = [
      ...(room.chatMessages ?? []),
      {
        id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        studentId: senderId,
        name: sender.name,
        message,
        createdAt: new Date().toISOString(),
      },
    ].slice(-100);

    persist({ ...room, chatMessages });
    return true;
  }, [room, persist]);

  // ── Refresh from storage ────────────────────────────────────────────────────

  const refresh = useCallback(async () => {
    const fresh = await bangRoomStorage.refreshRoom(room.id);
    if (fresh) setRoom(fresh);
    return fresh;
  }, [room.id]);

  return {
    room,
    setRoom: persist,
    chooseCharacter,
    initCardGame,
    drawCards,
    resolveKitCarlsonDraw,
    resolvePedroRamirezDraw,
    resolveJesseJonesDraw,
    playCard,
    selectTarget,
    selectCardTarget,
    chooseGeneralStoreCard,
    useSidAbility,
    respond,
    cancelPending,
    discardFromHand,
    endTurn,
    endGame,
    sendChatMessage,
    refresh,
    // helpers
    getHand: (id: number) => room.cardState ? h(room.cardState, id) : [],
    getEquip: (id: number) => room.cardState ? eq(room.cardState, id) : [],
    getAliveOrder: () => room.turnOrder.filter(id => room.players.find(p => p.studentId === id)?.status !== "eliminated"),
  };
}
