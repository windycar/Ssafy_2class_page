import type {
  BaseballPresentationGate,
  BaseballRoom,
} from "../../../types/baseballRoom.ts";
import { cloneGameState } from "./gameState.ts";
import type { TeamIndex } from "./types.ts";
import type { BaseballGameState } from "./types.ts";

export const BASEBALL_PRESENTATION_GATE_TIMEOUT_MS = 20_000;

function timestampMs(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function createBaseballPresentationGate(
  playId: string,
  openedAt: string,
  displayBeforeResult: BaseballGameState,
): BaseballPresentationGate {
  const openedAtMs = timestampMs(openedAt);
  if (!playId || openedAtMs === null) {
    throw new TypeError("A presentation gate requires a play id and ISO timestamp.");
  }
  return {
    playId,
    openedAt: new Date(openedAtMs).toISOString(),
    expiresAt: new Date(
      openedAtMs + BASEBALL_PRESENTATION_GATE_TIMEOUT_MS,
    ).toISOString(),
    acknowledgedSeats: [],
    displayBeforeResult: cloneGameState(displayBeforeResult),
  };
}

export function hasBaseballPresentationAcknowledgement(
  gate: BaseballPresentationGate | undefined,
  seat: TeamIndex,
) {
  return gate?.acknowledgedSeats.includes(seat) ?? false;
}

export function isBaseballPresentationGateComplete(
  gate: BaseballPresentationGate | undefined,
) {
  return Boolean(
    gate
    && gate.acknowledgedSeats.includes(0)
    && gate.acknowledgedSeats.includes(1),
  );
}

/**
 * Both seats normally release the barrier. Server time provides a bounded
 * fallback so a disconnected/backgrounded client cannot deadlock the match.
 */
export function isBaseballPresentationGateBlocking(
  room: Pick<BaseballRoom, "presentationGate">,
  nowMs = Date.now(),
) {
  const gate = room.presentationGate;
  if (!gate || isBaseballPresentationGateComplete(gate)) return false;
  if (!Number.isFinite(nowMs)) return true;
  const expiresAtMs = timestampMs(gate.expiresAt);
  return expiresAtMs === null || nowMs < expiresAtMs;
}

export function acknowledgeBaseballPresentationGate(
  gate: BaseballPresentationGate,
  seat: TeamIndex,
): BaseballPresentationGate {
  if (hasBaseballPresentationAcknowledgement(gate, seat)) return gate;
  return {
    ...gate,
    acknowledgedSeats: [...gate.acknowledgedSeats, seat].sort() as TeamIndex[],
  };
}
