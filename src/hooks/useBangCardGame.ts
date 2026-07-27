import { useState, useCallback } from "react";
import { bangRoomStorage } from "../services/storage/bangRoomStorage";
import { createBangDeck, drawCheck, hasVolcanic, canTarget, effectiveDistance } from "../utils/games/bangDeckBuilder";
import { IS_EQUIPMENT, WEAPON_KINDS } from "../types/bangCards";
import type { BangRoom, BangPlayer } from "../types/bang";
import type { BangCard, BangCardGameState } from "../types/bangCards";

// ── helpers ────────────────────────────────────────────────────────────────────

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
    : drawn.find(card => condition === "barrel" ? !drawCheck(card, condition) : drawCheck(card, condition));
  const chosen = favorable ?? drawn[0];
  let checkedState = nextState;
  for (const card of drawn) checkedState = discardCard(checkedState, card);
  if (count === 2) {
    checkedState = addLog(checkedState, `🍀 ${player.name} (럭키 듀크) — ${drawn.map(card => `${card.suit}${card.rank}`).join(" / ")} 중 ${chosen.suit}${chosen.rank} 선택`);
  }
  const result = condition === "barrel" ? !drawCheck(chosen, condition) : drawCheck(chosen, condition);
  return { chosen, state: checkedState, result };
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

  const died = remaining <= 0;
  remaining = Math.max(0, remaining);
  let updatedPlayers = room.players.map(p =>
    p.studentId === targetId
      ? { ...p, life: remaining, status: (died ? "eliminated" : "alive") as BangPlayer["status"], eliminatedAt: died ? new Date().toISOString() : p.eliminatedAt }
      : p
  );
  newState = addLog(newState, `${player.name} ${source} — 체력 ${player.life} → ${remaining}${died ? " ☠️ 탈락!" : ""}`);

  const lostLife = player.life - remaining;
  if (!died && lostLife > 0 && player.characterId === "bart_cassidy") {
    const { drawn, state: nextState } = drawFromPile(newState, lostLife);
    newState = setHand(nextState, targetId, [...h(nextState, targetId), ...drawn]);
    newState = addLog(newState, `🎩 ${player.name} (바트 캐시디) — 카드 ${drawn.length}장 드로우`);
  }

  if (!died && lostLife > 0 && player.characterId === "el_gringo" && killerId !== undefined && killerId !== targetId) {
    const attacker = updatedPlayers.find(p => p.studentId === killerId);
    const attackerHand = h(newState, killerId);
    const stolen = attackerHand.slice(0, lostLife);
    for (const card of stolen) newState = removeFromHand(newState, killerId, card.id);
    newState = setHand(newState, targetId, [...h(newState, targetId), ...stolen]);
    if (stolen.length > 0) newState = addLog(newState, `🌵 ${player.name} (엘 그링고) — ${attacker?.name}에게서 카드 ${stolen.length}장 가져옴`);
  }

  if (died) {
    // Vulture Sam receives the eliminated player's cards; otherwise discard them.
    const hand2 = h(newState, targetId);
    const equip2 = eq(newState, targetId);
    const vulture = updatedPlayers.find(p => p.status !== "eliminated" && p.studentId !== targetId && p.characterId === "vulture_sam");
    if (vulture) {
      newState = setHand(newState, vulture.studentId, [...h(newState, vulture.studentId), ...hand2, ...equip2]);
      newState = addLog(newState, `🦅 ${vulture.name} (벌처 샘) — 탈락자의 카드 ${hand2.length + equip2.length}장 획득`);
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

  // ── Initialize card game ────────────────────────────────────────────────────

  const initCardGame = useCallback(() => {
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
      state = addLog(state, `${player.name} 다이너마이트 드로우 확인: ${topCard.suit}${topCard.rank} → ${explodes ? "💥 폭발! (3 피해)" : "다음 플레이어에게 전달"}`);
      if (explodes) {
        state = removeFromEquip(state, currentId, dynamite.id);
        state = discardCard(state, dynamite);
        const result = applyDamage({ ...currentRoom, cardState: state }, state, currentId, 3, "💥 다이너마이트 폭발");
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
      state = addLog(state, `${player.name} 감옥 탈출 시도: ${topCard.suit}${topCard.rank} → ${escape ? "탈출 성공!" : "⛓️ 턴 스킵!"}`);
      if (!escape) {
        persist(advanceTurn(currentRoom, state, currentId));
        return;
      }
    }

    // Character draw abilities. Choice-based abilities use a deterministic automatic choice
    // so asynchronous web play does not block the whole room.
    let drawnCards: BangCard[] = [];
    if (player.characterId === "kit_carlson") {
      const result = drawFromPile(state, 3);
      state = result.state;
      drawnCards = result.drawn.slice(0, 2);
      state = { ...state, drawPile: [...result.drawn.slice(2), ...state.drawPile] };
      state = addLog(state, `🦅 ${player.name} (키트 칼슨) — 3장을 확인하고 2장 선택`);
    } else if (player.characterId === "pedro_ramirez" && state.discardPile.length > 0) {
      const topDiscard = state.discardPile[0];
      state = { ...state, discardPile: state.discardPile.slice(1) };
      const result = drawFromPile(state, Math.max(0, count - 1));
      state = result.state;
      drawnCards = [topDiscard, ...result.drawn];
      state = addLog(state, `♻️ ${player.name} (페드로 라미레즈) — 버린 카드 더미에서 첫 카드 획득`);
    } else if (player.characterId === "jesse_jones") {
      const donor = currentRoom.players
        .filter(other => other.studentId !== currentId && other.status !== "eliminated" && h(state, other.studentId).length > 0)
        .sort((a, b) => h(state, b.studentId).length - h(state, a.studentId).length)[0];
      if (donor) {
        const stolen = h(state, donor.studentId)[0];
        state = removeFromHand(state, donor.studentId, stolen.id);
        const result = drawFromPile(state, Math.max(0, count - 1));
        state = result.state;
        drawnCards = [stolen, ...result.drawn];
        state = addLog(state, `🕵️ ${player.name} (제시 존스) — ${donor.name}에게서 첫 카드 가져옴`);
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
    state = { ...state, phase: "play", bangUsed: false };

    persist({ ...currentRoom, cardState: state });
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
      state = addLog(state, `${player.name} 「${card.kind}」 장착`);
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
      } else if (p.life >= maxLife) {
        state = addLog(state, `${p.name} 이미 최대 체력 — 맥주 효과 없음`);
      } else {
        const updatedPlayers = room.players.map(p2 =>
          p2.studentId === fromId ? { ...p2, life: Math.min(p2.life + 1, maxLife) } : p2
        );
        state = addLog(state, `${p.name} 맥주 마심 🍺 (+1 체력)`);
        persist({ ...room, players: updatedPlayers, cardState: state });
        return;
      }
    }

    if (card.kind === "saloon") {
      const updatedPlayers = room.players.map(p2 => {
        if (p2.status === "eliminated") return p2;
        const maxLife = playerMaxLife(p2);
        return { ...p2, life: Math.min(p2.life + 1, maxLife) };
      });
      state = addLog(state, `${player.name} 살롱! 🏠 모두 체력 +1`);
      persist({ ...room, players: updatedPlayers, cardState: state });
      return;
    }

    if (card.kind === "stagecoach") {
      const { drawn, state: s2 } = drawFromPile(state, 2);
      state = s2;
      state = setHand(state, fromId, [...h(state, fromId), ...drawn]);
      state = addLog(state, `${player.name} 역마차 — 카드 2장 드로우`);
    }

    if (card.kind === "wells_fargo") {
      const { drawn, state: s2 } = drawFromPile(state, 3);
      state = s2;
      state = setHand(state, fromId, [...h(state, fromId), ...drawn]);
      state = addLog(state, `${player.name} 웰스파고 — 카드 3장 드로우`);
    }

    if (card.kind === "general_store") {
      const order = orderedFrom(room, fromId);
      const result = drawFromPile(state, order.length);
      state = result.state;
      state = addLog(state, `${player.name} 잡화점! 🛒 — 공개 카드에서 차례대로 1장 선택`);
      state = { ...state, pending: { type: "general_store_pick", fromId, remaining: order, available: result.drawn } };
    }

    if (card.kind === "indians") {
      const targets = aliveOrder.filter(id => id !== fromId);
      state = addLog(state, `${player.name} 인디언! 🪶 — ${targets.map(id => room.players.find(p2 => p2.studentId === id)?.name).join(", ")} BANG! 또는 1 피해`);
      state = { ...state, pending: { type: "indians_response", fromId, remaining: targets } };
    }

    if (card.kind === "gatling") {
      const targets = aliveOrder.filter(id => id !== fromId);
      state = addLog(state, `${player.name} 개틀링! ⚙️ — 모든 플레이어가 Missed! 또는 1 피해`);
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
      const barrel = targetEquip.find(e => e.kind === "barrel");
      const hasBarrel = !!barrel || target.characterId === "jourdonnais";
      if (hasBarrel) {
        const check = drawCheckForPlayer(room, state, target, "barrel");
        state = check.state;
        const topCard = check.chosen;
        const blocked = check.result;
        state = addLog(state, `${target.name} 통 드로우: ${topCard.suit}${topCard.rank} → ${blocked ? "💨 통으로 회피!" : "통 실패, 응답 필요"}`);
        if (blocked) {
          if (attacker.characterId === "slab_the_killer") {
            state = addLog(state, `💥 ${attacker.name} (슬랩 더 킬러) — Missed!가 1장 더 필요`);
            state = { ...state, pending: { type: "bang_response", fromId, targetId, cardId: card.id, missesNeeded: 2, missesPlayed: 1 } };
          } else {
            state = { ...state, pending: undefined };
          }
          persist({ ...room, cardState: state });
          return;
        }
      }
      state = addLog(state, `${attacker.name} → ${target.name} BANG! 🔫`);
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
        state = addLog(state, "패닉은 거리 1인 플레이어에게만 사용할 수 있습니다.");
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
    }

    if (pending.type === "await_panic") {
      if (fromEquip) {
        state = removeFromEquip(state, targetPlayerId, targetCardId);
      } else {
        state = removeFromHand(state, targetPlayerId, targetCardId);
      }
      state = setHand(state, fromId, [...h(state, fromId), targetCard]);
      state = addLog(state, `${attacker.name} 패닉 — ${target.name}의 카드 가져감`);
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
    if (remaining.length === 0) {
      for (const card of available) state = discardCard(state, card);
      state = { ...state, pending: undefined };
    } else {
      state = { ...state, pending: { ...pending, remaining, available } };
    }
    persist({ ...room, cardState: state });
  }, [room, persist]);

  // ── Sid Ketchum ──────────────────────────────────────────────────────────────

  const useSidAbility = useCallback((playerId: number) => {
    if (!room.cardState) return;
    const player = room.players.find(item => item.studentId === playerId);
    if (!player || player.characterId !== "sid_ketchum" || player.life >= playerMaxLife(player)) return;
    const cards = h(room.cardState, playerId).slice(0, 2);
    if (cards.length < 2) return;
    let state = room.cardState;
    for (const card of cards) {
      state = removeFromHand(state, playerId, card.id);
      state = discardCard(state, card);
    }
    const players = room.players.map(item =>
      item.studentId === playerId ? { ...item, life: Math.min(item.life + 1, playerMaxLife(item)) } : item
    );
    state = addLog(state, `💊 ${player.name} (시드 케첨) — 손패 2장을 버리고 체력 1 회복`);
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
        const missesPlayed = pending.missesPlayed + 1;
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
        const result = applyDamage(currentRoom, state, targetId, 1, `${attacker.name}의 BANG!`, fromId);
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
        state = addLog(state, `${responder.name} BANG! 으로 인디언 대응`);
        const newRemaining = remaining.slice(1);
        state = { ...state, pending: newRemaining.length === 0 ? undefined : { ...pending, remaining: newRemaining } };
        persist({ ...currentRoom, cardState: state });
        return;
      }

      if (action === "pass") {
        state = addLog(state, `${responder.name} 인디언 대응 실패 — 1 피해`);
        const result = applyDamage(currentRoom, state, targetId, 1, `${attacker.name}의 인디언`, fromId);
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
        state = addLog(state, `${responder.name} Missed! — 개틀링 회피`);
        const newRemaining = remaining.slice(1);
        state = { ...state, pending: newRemaining.length === 0 ? undefined : { ...pending, remaining: newRemaining } };
        persist({ ...currentRoom, cardState: state });
        return;
      }

      if (action === "pass") {
        state = addLog(state, `${responder.name} 개틀링 회피 실패 — 1 피해`);
        const result = applyDamage(currentRoom, state, targetId, 1, `${attacker.name}의 개틀링`, fromId);
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
        state = addLog(state, `${responder.name} BANG! — 결투 계속`);
        state = { ...state, pending: { ...pending, currentId: currentId === p2 ? p1 : p2 } };
        persist({ ...currentRoom, cardState: state });
        return;
      }

      if (action === "pass") {
        state = addLog(state, `${responder.name} 결투 패배 — 1 피해`);
        const result = applyDamage(currentRoom, state, currentId, 1, `${attacker.name}의 결투`, attacker.studentId);
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
    initCardGame,
    drawCards,
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
