import type {
  BaseballGameState,
  BasesState,
  OfficialPlayResult,
} from "./types.ts";

/**
 * Reconstructs the number of outs that should exist when routine error plays
 * are treated as outs. This lets the official scorer close the virtual inning
 * even while the real inning must continue.
 */
export function virtualOutsBeforePlay(state: BaseballGameState) {
  const errorOuts = state.playByPlay.reduce((total, entry) => (
    entry.inning === state.inning
      && entry.half === state.half
      && entry.result === "ERROR"
      ? total + 1
      : total
  ), 0);
  return state.count.outs + errorOuts;
}

function runnerEligibilityById(state: BaseballGameState) {
  return new Map(
    [state.bases.first, state.bases.second, state.bases.third]
      .filter((runner) => runner !== null)
      .map((runner) => [runner.playerId, runner.earnedRunEligible !== false] as const),
  );
}

/**
 * Calculates earned runs one scorer at a time. A runner who reached on an
 * error remains unearned, while legitimate runners and the batter-runner can
 * still be earned before the virtual third out. Every run after that virtual
 * third out is unearned.
 */
export function earnedRunsForPlay(
  stateBefore: BaseballGameState,
  official: OfficialPlayResult,
) {
  const virtualOutsAfterPlay = virtualOutsBeforePlay(stateBefore) + official.outsRecorded;
  if (
    official.runsScored === 0
    || official.code === "ERROR"
    || virtualOutsAfterPlay >= 3
  ) {
    return 0;
  }

  const eligibility = runnerEligibilityById(stateBefore);
  return official.scoredRunnerIds.reduce((earnedRuns, runnerId) => {
    if (runnerId === official.batterId) return earnedRuns + 1;
    return earnedRuns + (eligibility.get(runnerId) === true ? 1 : 0);
  }, 0);
}

function findRunner(bases: BasesState, playerId: string) {
  return [bases.first, bases.second, bases.third]
    .find((runner) => runner?.playerId === playerId) ?? null;
}

/**
 * Carries scorer attribution with the batter-runner while they remain on base.
 * Older persisted V2 runners omit this field and are intentionally treated as
 * eligible for backward compatibility.
 */
export function recordBatterRunnerEligibility(
  bases: BasesState,
  stateBefore: BaseballGameState,
  result: Pick<OfficialPlayResult, "batterId" | "code">,
) {
  const batterRunner = findRunner(bases, result.batterId);
  if (!batterRunner) return;
  batterRunner.earnedRunEligible = result.code !== "ERROR"
    && virtualOutsBeforePlay(stateBefore) < 3;
}
