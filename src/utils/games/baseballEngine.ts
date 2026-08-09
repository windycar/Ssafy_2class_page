export type TeamIndex = 0 | 1;
export type InningHalf = "top" | "bottom";
export type GameStatus = "playing" | "finished";

export interface ContactPoint {
  x: number;
  y: number;
}

export interface BaseballCount {
  balls: number;
  strikes: number;
  outs: number;
}

export interface BaseballBases {
  first: boolean;
  second: boolean;
  third: boolean;
}

export interface TeamScore {
  name: string;
  runs: number;
  hits: number;
  inningRuns: number[];
}

export interface BaseballGameState {
  inning: number;
  half: InningHalf;
  battingTeam: TeamIndex;
  count: BaseballCount;
  bases: BaseballBases;
  teams: [TeamScore, TeamScore];
  status: GameStatus;
  winner: TeamIndex | null;
}

export type PlateOutcome =
  | "ball"
  | "calledStrike"
  | "swingingStrike"
  | "foul"
  | "out"
  | "single"
  | "double"
  | "triple"
  | "homeRun";

export interface ContactResult {
  outcome: PlateOutcome;
  label: string;
  detail: string;
}

export interface GameTransition {
  state: BaseballGameState;
  message: string;
  runsScored: number;
  plateEnded: boolean;
  halfEnded: boolean;
  gameEnded: boolean;
}

export const REGULATION_INNINGS = 3;
export const SWEET_SPOT = 0.72;

export const EMPTY_COUNT: BaseballCount = { balls: 0, strikes: 0, outs: 0 };
export const EMPTY_BASES: BaseballBases = {
  first: false,
  second: false,
  third: false,
};

const CONTACT_RESULTS: Record<
  "homeRun" | "triple" | "double" | "single" | "foul" | "out" | "swingingStrike",
  ContactResult
> = {
  homeRun: { outcome: "homeRun", label: "홈런!", detail: "완벽한 타이밍과 배트 중심입니다." },
  triple: { outcome: "triple", label: "3루타!", detail: "외야 깊숙한 곳을 갈랐습니다." },
  double: { outcome: "double", label: "2루타!", detail: "장타 코스로 정확하게 보냈습니다." },
  single: { outcome: "single", label: "안타!", detail: "좋은 타이밍으로 빈 곳을 찾았습니다." },
  foul: { outcome: "foul", label: "파울", detail: "배트 끝에 걸렸습니다." },
  out: { outcome: "out", label: "인플레이 아웃", detail: "수비 정면으로 향했습니다." },
  swingingStrike: {
    outcome: "swingingStrike",
    label: "헛스윙",
    detail: "공의 위치와 타이밍이 맞지 않았습니다.",
  },
};

function createTeam(name: string, startsBatting = false): TeamScore {
  return { name, runs: 0, hits: 0, inningRuns: startsBatting ? [0] : [] };
}

function cloneState(state: BaseballGameState): BaseballGameState {
  return {
    ...state,
    count: { ...state.count },
    bases: { ...state.bases },
    teams: [
      { ...state.teams[0], inningRuns: [...state.teams[0].inningRuns] },
      { ...state.teams[1], inningRuns: [...state.teams[1].inningRuns] },
    ],
  };
}

export function createGameState(
  visitorName = "1P",
  homeName = "2P",
): BaseballGameState {
  return {
    inning: 1,
    half: "top",
    battingTeam: 0,
    count: { ...EMPTY_COUNT },
    bases: { ...EMPTY_BASES },
    teams: [createTeam(visitorName, true), createTeam(homeName)],
    status: "playing",
    winner: null,
  };
}

export function isPitchInStrikeZone(point: ContactPoint) {
  return point.x >= 0.22 && point.x <= 0.78 && point.y >= 0.14 && point.y <= 0.86;
}

export function judgeSwingContact(
  progress: number,
  aim: ContactPoint,
  target: ContactPoint,
): ContactResult {
  if (
    !Number.isFinite(progress) ||
    !Number.isFinite(aim.x) ||
    !Number.isFinite(aim.y) ||
    !Number.isFinite(target.x) ||
    !Number.isFinite(target.y) ||
    progress < 0 ||
    progress > 1.08
  ) {
    return CONTACT_RESULTS.swingingStrike;
  }

  const locationDistance = Math.hypot(aim.x - target.x, aim.y - target.y);
  if (locationDistance > 0.31) return CONTACT_RESULTS.swingingStrike;

  const timingDistance = Math.abs(progress - SWEET_SPOT);
  const contactError = timingDistance + locationDistance * 0.38;

  if (contactError <= 0.052) return CONTACT_RESULTS.homeRun;
  if (contactError <= 0.092) return CONTACT_RESULTS.triple;
  if (contactError <= 0.145) return CONTACT_RESULTS.double;
  if (contactError <= 0.215) return CONTACT_RESULTS.single;
  if (contactError <= 0.285) return CONTACT_RESULTS.foul;
  return CONTACT_RESULTS.out;
}

export function judgeCpuPitchResult(
  target: ContactPoint,
  decisionRoll: number,
  contactRoll: number,
): PlateOutcome {
  const inZone = isPitchInStrikeZone(target);
  const decision = Math.min(0.999, Math.max(0, decisionRoll));
  const contact = Math.min(0.999, Math.max(0, contactRoll));

  if (!inZone && decision < 0.66) return "ball";
  if (inZone && decision < 0.14) return "calledStrike";
  if (contact < (inZone ? 0.17 : 0.31)) return "swingingStrike";
  if (contact < 0.36) return "foul";
  if (contact < 0.62) return "out";
  if (contact < 0.82) return "single";
  if (contact < 0.93) return "double";
  if (contact < 0.97) return "triple";
  return "homeRun";
}

function addRuns(state: BaseballGameState, amount: number) {
  if (amount <= 0) return;
  const team = state.teams[state.battingTeam];
  team.runs += amount;
  const inningIndex = state.inning - 1;
  team.inningRuns[inningIndex] = (team.inningRuns[inningIndex] ?? 0) + amount;
}

function advanceWalk(state: BaseballGameState) {
  let runs = 0;
  if (state.bases.first) {
    if (state.bases.second) {
      if (state.bases.third) runs += 1;
      state.bases.third = true;
    }
    state.bases.second = true;
  }
  state.bases.first = true;
  return runs;
}

function advanceHit(state: BaseballGameState, basesEarned: 1 | 2 | 3 | 4) {
  const occupied = [state.bases.first, state.bases.second, state.bases.third];
  let runs = basesEarned === 4 ? 1 : 0;
  const next = [false, false, false];

  occupied.forEach((hasRunner, index) => {
    if (!hasRunner) return;
    const destination = index + basesEarned;
    if (destination >= 3) runs += 1;
    else next[destination] = true;
  });

  if (basesEarned < 4) next[basesEarned - 1] = true;
  state.bases = { first: next[0], second: next[1], third: next[2] };
  return runs;
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
  return (
    state.half === "bottom" &&
    state.inning >= REGULATION_INNINGS &&
    state.teams[1].runs > state.teams[0].runs
  );
}

function changeHalfInning(state: BaseballGameState) {
  state.count = { ...EMPTY_COUNT };
  state.bases = { ...EMPTY_BASES };

  if (state.half === "top") {
    if (
      state.inning >= REGULATION_INNINGS &&
      state.teams[1].runs > state.teams[0].runs
    ) {
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

export function applyPlateOutcome(
  currentState: BaseballGameState,
  outcome: PlateOutcome,
): GameTransition {
  if (currentState.status === "finished") {
    return {
      state: currentState,
      message: "경기가 종료되었습니다.",
      runsScored: 0,
      plateEnded: false,
      halfEnded: false,
      gameEnded: true,
    };
  }

  const state = cloneState(currentState);
  let runsScored = 0;
  let plateEnded = false;
  let halfEnded = false;

  if (outcome === "ball") {
    state.count.balls += 1;
    if (state.count.balls >= 4) {
      runsScored = advanceWalk(state);
      addRuns(state, runsScored);
      resetPlateCount(state);
      plateEnded = true;
    }
  } else if (outcome === "calledStrike" || outcome === "swingingStrike") {
    state.count.strikes += 1;
    if (state.count.strikes >= 3) {
      state.count.outs += 1;
      resetPlateCount(state);
      plateEnded = true;
    }
  } else if (outcome === "foul") {
    if (state.count.strikes < 2) state.count.strikes += 1;
  } else if (outcome === "out") {
    state.count.outs += 1;
    resetPlateCount(state);
    plateEnded = true;
  } else {
    const basesEarned = {
      single: 1,
      double: 2,
      triple: 3,
      homeRun: 4,
    }[outcome] as 1 | 2 | 3 | 4;
    runsScored = advanceHit(state, basesEarned);
    addRuns(state, runsScored);
    state.teams[state.battingTeam].hits += 1;
    resetPlateCount(state);
    plateEnded = true;
  }

  if (isWalkOff(state)) {
    finishGame(state, 1);
  } else if (state.count.outs >= 3) {
    halfEnded = true;
    changeHalfInning(state);
  }

  const walkText = outcome === "ball" && plateEnded ? "볼넷" : outcomeMessage(outcome, runsScored);

  return {
    state,
    message: walkText,
    runsScored,
    plateEnded,
    halfEnded,
    gameEnded: state.status === "finished",
  };
}

export function inningLabel(state: Pick<BaseballGameState, "inning" | "half">) {
  return `${state.inning}회${state.half === "top" ? "초" : "말"}`;
}
