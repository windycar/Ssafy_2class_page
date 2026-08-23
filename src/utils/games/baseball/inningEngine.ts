import {
  advanceBattingOrder,
  cloneGameState,
  createRunner,
  EMPTY_BASES,
  EMPTY_COUNT,
  getCurrentBatter,
  getFieldingTeam,
} from "./gameState.ts";
import type {
  BaseRunner,
  BaseballGameState,
  BasesState,
  GameTransition,
  PlateOutcome,
  TeamIndex,
} from "./types.ts";

export const REGULATION_INNINGS = 3;

interface AdvanceResult {
  bases: BasesState;
  scoredRunners: BaseRunner[];
}

function runnerAt(runner: BaseRunner, currentBase: 1 | 2 | 3): BaseRunner {
  return { ...runner, currentBase, targetBase: undefined, progress: undefined };
}

function advanceWalk(state: BaseballGameState, batter: ReturnType<typeof getCurrentBatter>): AdvanceResult {
  const scoredRunners: BaseRunner[] = [];
  const next: BasesState = {
    first: createRunner(batter, 1),
    second: null,
    third: null,
  };

  if (state.bases.first) {
    next.second = runnerAt(state.bases.first, 2);
    if (state.bases.second) {
      next.third = runnerAt(state.bases.second, 3);
      if (state.bases.third) scoredRunners.push({ ...state.bases.third, targetBase: 4, progress: 1 });
    } else if (state.bases.third) {
      next.third = runnerAt(state.bases.third, 3);
    }
  } else {
    next.second = state.bases.second ? runnerAt(state.bases.second, 2) : null;
    next.third = state.bases.third ? runnerAt(state.bases.third, 3) : null;
  }

  return { bases: next, scoredRunners };
}

function advanceHit(
  state: BaseballGameState,
  batter: ReturnType<typeof getCurrentBatter>,
  basesEarned: 1 | 2 | 3 | 4,
): AdvanceResult {
  const occupied = [state.bases.first, state.bases.second, state.bases.third];
  const destinations: Array<BaseRunner | null> = [null, null, null];
  const scoredRunners: BaseRunner[] = [];

  occupied.forEach((runner, index) => {
    if (!runner) return;
    const destination = index + 1 + basesEarned;
    if (destination >= 4) scoredRunners.push({ ...runner, targetBase: 4, progress: 1 });
    else destinations[destination - 1] = runnerAt(runner, destination as 1 | 2 | 3);
  });

  if (basesEarned === 4) {
    scoredRunners.push({ ...createRunner(batter, 1), targetBase: 4, progress: 1 });
  } else {
    destinations[basesEarned - 1] = createRunner(batter, basesEarned);
  }

  return {
    bases: {
      first: destinations[0],
      second: destinations[1],
      third: destinations[2],
    },
    scoredRunners,
  };
}

function addRuns(state: BaseballGameState, scoredRunners: BaseRunner[]) {
  if (scoredRunners.length === 0) return;
  const team = state.teams[state.battingTeam];
  const fieldingTeam = getFieldingTeam(state);
  const pitcherStats = fieldingTeam.pitcherStats[fieldingTeam.pitcher.playerId];
  team.runs += scoredRunners.length;
  const inningIndex = state.inning - 1;
  team.inningRuns[inningIndex] = (team.inningRuns[inningIndex] ?? 0) + scoredRunners.length;
  pitcherStats.runsAllowed += scoredRunners.length;
  pitcherStats.earnedRuns += scoredRunners.length;
  for (const runner of scoredRunners) {
    const stats = team.batterStats[runner.playerId];
    if (stats) stats.r += 1;
  }
}

function resetPlateCount(state: BaseballGameState) {
  state.count.balls = 0;
  state.count.strikes = 0;
}

function finishGame(state: BaseballGameState, winner: TeamIndex) {
  state.status = "finished";
  state.winner = winner;
}

function isWalkOff(state: BaseballGameState) {
  return state.half === "bottom"
    && state.inning >= REGULATION_INNINGS
    && state.teams[1].runs > state.teams[0].runs;
}

function changeHalfInning(state: BaseballGameState) {
  state.count = { ...EMPTY_COUNT };
  state.bases = { ...EMPTY_BASES };

  if (state.half === "top") {
    if (state.inning >= REGULATION_INNINGS && state.teams[1].runs > state.teams[0].runs) {
      finishGame(state, 1);
      return;
    }
    state.half = "bottom";
    state.battingTeam = 1;
    state.teams[1].inningRuns[state.inning - 1] ??= 0;
    return;
  }

  if (state.inning >= REGULATION_INNINGS && state.teams[0].runs !== state.teams[1].runs) {
    finishGame(state, state.teams[0].runs > state.teams[1].runs ? 0 : 1);
    return;
  }

  state.inning += 1;
  state.half = "top";
  state.battingTeam = 0;
  state.teams[0].inningRuns[state.inning - 1] ??= 0;
}

function outcomeMessage(outcome: PlateOutcome, runs: number) {
  const suffix = runs > 0 ? ` · ${runs}점` : "";
  const messages: Record<PlateOutcome, string> = {
    ball: "볼",
    calledStrike: "스트라이크",
    swingingStrike: "헛스윙 스트라이크",
    foul: "파울",
    out: "타구 아웃",
    single: "안타",
    double: "2루타",
    triple: "3루타",
    homeRun: "홈런",
  };
  return `${messages[outcome]}${suffix}`;
}

function recordCompletedPlate(
  state: BaseballGameState,
  batterId: string,
  outcome: PlateOutcome,
  runsScored: number,
) {
  const team = state.teams[state.battingTeam];
  const batterStats = team.batterStats[batterId];
  const fieldingTeam = getFieldingTeam(state);
  const pitcherStats = fieldingTeam.pitcherStats[fieldingTeam.pitcher.playerId];
  if (!batterStats || !pitcherStats) return;

  batterStats.pa += 1;
  if (outcome === "ball") {
    batterStats.bb += 1;
    pitcherStats.walks += 1;
  } else {
    batterStats.ab += 1;
  }

  if (outcome === "calledStrike" || outcome === "swingingStrike") {
    batterStats.so += 1;
    pitcherStats.strikeouts += 1;
  }
  if (outcome === "single" || outcome === "double" || outcome === "triple" || outcome === "homeRun") {
    batterStats.h += 1;
    team.hits += 1;
    pitcherStats.hitsAllowed += 1;
  }
  if (outcome === "double") batterStats.doubles += 1;
  if (outcome === "triple") batterStats.triples += 1;
  if (outcome === "homeRun") batterStats.hr += 1;
  if (runsScored > 0) batterStats.rbi += runsScored;
}

export function applyPlateOutcome(
  currentState: BaseballGameState,
  outcome: PlateOutcome,
): GameTransition {
  if (currentState.status === "finished") {
    return {
      state: cloneGameState(currentState),
      message: "경기가 종료되었습니다.",
      runsScored: 0,
      scoredRunners: [],
      batterId: null,
      plateEnded: false,
      halfEnded: false,
      gameEnded: true,
    };
  }

  const state = cloneGameState(currentState);
  const batter = getCurrentBatter(state);
  const fieldingTeam = getFieldingTeam(state);
  fieldingTeam.pitcher.pitchCount += 1;
  fieldingTeam.pitcher.stamina = Math.max(0, fieldingTeam.pitcher.stamina - 0.28);
  fieldingTeam.pitcherStats[fieldingTeam.pitcher.playerId].pitches += 1;

  let scoredRunners: BaseRunner[] = [];
  let plateEnded = false;
  let halfEnded = false;

  if (outcome === "ball") {
    state.count.balls += 1;
    if (state.count.balls >= 4) {
      const advance = advanceWalk(state, batter);
      state.bases = advance.bases;
      scoredRunners = advance.scoredRunners;
      addRuns(state, scoredRunners);
      resetPlateCount(state);
      plateEnded = true;
    }
  } else if (outcome === "calledStrike" || outcome === "swingingStrike") {
    state.count.strikes += 1;
    if (state.count.strikes >= 3) {
      state.count.outs += 1;
      fieldingTeam.pitcherStats[fieldingTeam.pitcher.playerId].outsRecorded += 1;
      resetPlateCount(state);
      plateEnded = true;
    }
  } else if (outcome === "foul") {
    if (state.count.strikes < 2) state.count.strikes += 1;
  } else if (outcome === "out") {
    state.count.outs += 1;
    fieldingTeam.pitcherStats[fieldingTeam.pitcher.playerId].outsRecorded += 1;
    resetPlateCount(state);
    plateEnded = true;
  } else {
    const basesEarned = { single: 1, double: 2, triple: 3, homeRun: 4 }[outcome] as 1 | 2 | 3 | 4;
    const advance = advanceHit(state, batter, basesEarned);
    state.bases = advance.bases;
    scoredRunners = advance.scoredRunners;
    addRuns(state, scoredRunners);
    resetPlateCount(state);
    plateEnded = true;
  }

  if (plateEnded) {
    recordCompletedPlate(state, batter.id, outcome, scoredRunners.length);
    advanceBattingOrder(state);
  }

  if (isWalkOff(state)) {
    finishGame(state, 1);
  } else if (state.count.outs >= 3) {
    halfEnded = true;
    changeHalfInning(state);
  }

  state.revision += 1;
  const walkText = outcome === "ball" && plateEnded ? "볼넷" : outcomeMessage(outcome, scoredRunners.length);
  return {
    state,
    message: walkText,
    runsScored: scoredRunners.length,
    scoredRunners,
    batterId: batter.id,
    plateEnded,
    halfEnded,
    gameEnded: state.status === "finished",
  };
}

export function inningLabel(state: Pick<BaseballGameState, "inning" | "half">) {
  return `${state.inning}회${state.half === "top" ? "초" : "말"}`;
}
