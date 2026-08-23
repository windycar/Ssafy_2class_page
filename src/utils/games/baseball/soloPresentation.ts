import { cloneGameState } from "./gameState.ts";
import type {
  BaseballGameState,
  VisualEvent,
} from "./types.ts";

export interface CreateSoloVisualPlaybackPlanInput {
  events: readonly VisualEvent[];
  displayBeforeResult: BaseballGameState;
  authoritativeAfterResult: BaseballGameState;
  showThirdOutSnapshot: boolean;
}

export interface SoloVisualPlaybackPlan {
  events: VisualEvent[];
  displaySnapshotByEventId: ReadonlyMap<string, BaseballGameState>;
}

function putScoreboardAfterPlayResult(events: readonly VisualEvent[]) {
  const ordered = [...events];
  const scoreboardIndex = ordered.findIndex((event) => event.kind === "SCOREBOARD_UPDATE");
  const playResultIndex = ordered.findIndex((event) => event.kind === "PLAY_RESULT");
  if (scoreboardIndex < 0 || playResultIndex < 0 || scoreboardIndex > playResultIndex) {
    return ordered;
  }

  const [scoreboard] = ordered.splice(scoreboardIndex, 1);
  const nextPlayResultIndex = ordered.findIndex((event) => event.kind === "PLAY_RESULT");
  ordered.splice(nextPlayResultIndex + 1, 0, scoreboard);
  return ordered;
}

function thirdOutDisplaySnapshot(
  displayBeforeResult: BaseballGameState,
): BaseballGameState {
  const snapshot = cloneGameState(displayBeforeResult);
  snapshot.count = {
    balls: 0,
    strikes: 0,
    outs: 3,
  };
  return snapshot;
}

/**
 * Builds the solo-only playback order and the HUD state revealed at each event.
 * The authoritative engine result is never modified.
 */
export function createSoloVisualPlaybackPlan({
  events,
  displayBeforeResult,
  authoritativeAfterResult,
  showThirdOutSnapshot,
}: CreateSoloVisualPlaybackPlanInput): SoloVisualPlaybackPlan {
  const orderedEvents = showThirdOutSnapshot
    ? putScoreboardAfterPlayResult(events)
    : [...events];
  const hasScoreboard = orderedEvents.some((event) => event.kind === "SCOREBOARD_UPDATE");
  const nextGameSnapshot = cloneGameState(authoritativeAfterResult);
  const outThreeSnapshot = showThirdOutSnapshot
    ? thirdOutDisplaySnapshot(displayBeforeResult)
    : null;
  const snapshots = new Map<string, BaseballGameState>();

  for (const event of orderedEvents) {
    if (outThreeSnapshot && event.kind === "PLAY_RESULT") {
      snapshots.set(event.id, outThreeSnapshot);
    } else if (
      event.kind === "SCOREBOARD_UPDATE"
      || (event.kind === "PLAY_RESULT" && !hasScoreboard)
    ) {
      snapshots.set(event.id, nextGameSnapshot);
    }
  }

  return {
    events: orderedEvents,
    displaySnapshotByEventId: snapshots,
  };
}
