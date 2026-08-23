import type { DefenseOpportunity } from "./ballInPlayEngine.ts";
import { deriveSeed, randomFloatAt } from "./random.ts";
import type {
  BaseNumber,
  BaseRunner,
  BaseballPlayer,
  BattedBall,
  BasesState,
  DefenseResolution,
  RunnerAdvance,
  RunnerResolution,
} from "./types.ts";

const BASE_DISTANCE_METERS = 27.43;

export type RunningPlayKind =
  | "HOME_RUN"
  | "HIT"
  | "ERROR"
  | "CATCH_OUT"
  | "GROUND_OUT"
  | "DOUBLE_PLAY"
  | "FIELDER_CHOICE";

export interface ResolvedRunningPlay {
  kind: RunningPlayKind;
  defense: DefenseResolution;
  runners: RunnerResolution;
  batterDestination: 0 | 1 | 2 | 3 | 4;
  hitValue: 0 | 1 | 2 | 3 | 4;
  sacrificeFly: boolean;
  errorFielderId: string | null;
}

export interface ResolveBaseRunningInput {
  bases: BasesState;
  batter: BaseballPlayer;
  ball: BattedBall;
  defense: DefenseOpportunity;
  defenders: readonly BaseballPlayer[];
  outsBeforePlay: number;
  seed: number;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function runnerSpeedMetersPerSecond(speed: number) {
  return 6.2 + clamp(speed, 0, 100) * 0.035;
}

function travelTimeMs(speed: number, bases = 1) {
  return BASE_DISTANCE_METERS * bases / runnerSpeedMetersPerSecond(speed) * 1_000;
}

function settledRunner(runner: BaseRunner, currentBase: BaseNumber): BaseRunner {
  return { ...runner, currentBase, targetBase: undefined, progress: undefined };
}

function batterRunner(batter: BaseballPlayer, currentBase: BaseNumber): BaseRunner {
  return {
    playerId: batter.id,
    name: batter.name,
    speed: batter.speed,
    currentBase,
  };
}

function cloneBases(bases: BasesState): BasesState {
  return {
    first: bases.first ? { ...bases.first } : null,
    second: bases.second ? { ...bases.second } : null,
    third: bases.third ? { ...bases.third } : null,
  };
}

function emptyBases(): BasesState {
  return { first: null, second: null, third: null };
}

function makeAdvance(
  runner: Pick<BaseRunner, "playerId" | "name" | "speed">
    | Pick<BaseballPlayer, "id" | "name" | "speed">,
  fromBase: 0 | BaseNumber,
  toBase: 1 | 2 | 3 | 4,
  result: "SAFE" | "OUT" | "SCORE",
  isForce: boolean,
  startDelayMs = 0,
  outAtMs?: number,
): RunnerAdvance {
  const runnerId = "playerId" in runner ? runner.playerId : runner.id;
  const arrivedAtMs = startDelayMs + travelTimeMs(runner.speed, toBase - fromBase);
  return {
    runnerId,
    runnerName: runner.name,
    fromBase,
    toBase,
    result,
    startedAtMs: startDelayMs,
    arrivedAtMs,
    ...(outAtMs === undefined ? {} : { outAtMs }),
    isForce,
  };
}

function defenseResolution(
  opportunity: DefenseOpportunity,
  result: DefenseResolution["result"],
  outsRecorded: number,
  assistingFielderIds: string[] = [],
): DefenseResolution {
  return {
    result,
    primaryFielderId: opportunity.primaryFielderId,
    primaryPosition: opportunity.primaryPosition,
    assistingFielderIds,
    ballArrivalTimeMs: opportunity.ballArrivalTimeMs,
    fielderArrivalTimeMs: opportunity.fielderArrivalTimeMs,
    throwArrivalTimeMs: opportunity.throwToFirstArrivalTimeMs,
    fieldingProbability: opportunity.fieldingProbability,
    errorProbability: opportunity.errorProbability,
    outsRecorded,
  };
}

function runnerResolution(
  advances: RunnerAdvance[],
  nextBases: BasesState,
): RunnerResolution {
  const scoredRunnerIds = advances
    .filter((advance) => advance.result === "SCORE")
    .map((advance) => advance.runnerId);
  const outRunnerIds = advances
    .filter((advance) => advance.result === "OUT")
    .map((advance) => advance.runnerId);
  return {
    advances,
    nextBases,
    scoredRunnerIds,
    outRunnerIds,
    runsScored: scoredRunnerIds.length,
    outsRecorded: outRunnerIds.length,
  };
}

function resolveHomeRun(input: ResolveBaseRunningInput): ResolvedRunningPlay {
  const advances: RunnerAdvance[] = [];
  const occupied: Array<[BaseNumber, BaseRunner | null]> = [
    [3, input.bases.third],
    [2, input.bases.second],
    [1, input.bases.first],
  ];
  for (const [base, runner] of occupied) {
    if (runner) advances.push(makeAdvance(runner, base, 4, "SCORE", false, 120));
  }
  advances.push(makeAdvance(input.batter, 0, 4, "SCORE", false));
  return {
    kind: "HOME_RUN",
    defense: defenseResolution(input.defense, "NO_PLAY", 0),
    runners: runnerResolution(advances, emptyBases()),
    batterDestination: 4,
    hitValue: 4,
    sacrificeFly: false,
    errorFielderId: null,
  };
}

function advanceHit(input: ResolveBaseRunningInput, requestedBases: 1 | 2 | 3): ResolvedRunningPlay {
  const next = emptyBases();
  const advances: RunnerAdvance[] = [];
  const roll = (label: string) => randomFloatAt(deriveSeed(input.seed, "base-running", input.ball.id, label));
  const send = (runner: BaseRunner, fromBase: BaseNumber, toBase: BaseNumber | 4) => {
    advances.push(makeAdvance(runner, fromBase, toBase, toBase === 4 ? "SCORE" : "SAFE", false, 90));
    if (toBase === 1) next.first = settledRunner(runner, 1);
    else if (toBase === 2) next.second = settledRunner(runner, 2);
    else if (toBase === 3) next.third = settledRunner(runner, 3);
  };

  if (requestedBases === 3) {
    if (input.bases.third) send(input.bases.third, 3, 4);
    if (input.bases.second) send(input.bases.second, 2, 4);
    if (input.bases.first) send(input.bases.first, 1, 4);
  } else if (requestedBases === 2) {
    if (input.bases.third) send(input.bases.third, 3, 4);
    if (input.bases.second) send(input.bases.second, 2, 4);
    if (input.bases.first) {
      const firstScores = input.bases.first.speed + input.ball.distance * 0.18 + roll("first-on-double") * 16 >= 91;
      send(input.bases.first, 1, firstScores ? 4 : 3);
    }
  } else {
    if (input.bases.third) send(input.bases.third, 3, 4);
    if (input.bases.second) {
      const secondScores = input.bases.second.speed + input.ball.distance * 0.22 + roll("second-on-single") * 18 >= 78;
      send(input.bases.second, 2, secondScores ? 4 : 3);
    }
    if (input.bases.first) {
      const firstTakesThird = input.bases.first.speed + input.ball.distance * 0.16 + roll("first-on-single") * 14 >= 91;
      send(input.bases.first, 1, firstTakesThird && !next.third ? 3 : 2);
    }
  }

  advances.push(makeAdvance(input.batter, 0, requestedBases, "SAFE", true));
  if (requestedBases === 1) next.first = batterRunner(input.batter, 1);
  else if (requestedBases === 2) next.second = batterRunner(input.batter, 2);
  else next.third = batterRunner(input.batter, 3);

  return {
    kind: "HIT",
    defense: defenseResolution(input.defense, "SAFE", 0),
    runners: runnerResolution(advances, next),
    batterDestination: requestedBases,
    hitValue: requestedBases,
    sacrificeFly: false,
    errorFielderId: null,
  };
}

function resolveError(input: ResolveBaseRunningInput): ResolvedRunningPlay {
  const next = cloneBases(input.bases);
  const advances: RunnerAdvance[] = [];

  if (input.bases.first) {
    if (input.bases.second) {
      if (input.bases.third) {
        advances.push(makeAdvance(input.bases.third, 3, 4, "SCORE", true));
        next.third = null;
      }
      advances.push(makeAdvance(input.bases.second, 2, 3, "SAFE", true));
      next.third = settledRunner(input.bases.second, 3);
      next.second = null;
    }
    advances.push(makeAdvance(input.bases.first, 1, 2, "SAFE", true));
    next.second = settledRunner(input.bases.first, 2);
  }
  next.first = batterRunner(input.batter, 1);
  advances.push(makeAdvance(input.batter, 0, 1, "SAFE", true));

  return {
    kind: "ERROR",
    defense: defenseResolution(input.defense, "ERROR", 0),
    runners: runnerResolution(advances, next),
    batterDestination: 1,
    hitValue: 0,
    sacrificeFly: false,
    errorFielderId: input.defense.primaryFielderId,
  };
}

function resolveCaughtBall(input: ResolveBaseRunningInput): ResolvedRunningPlay {
  const next = cloneBases(input.bases);
  const advances: RunnerAdvance[] = [makeAdvance(
    input.batter,
    0,
    1,
    "OUT",
    false,
    0,
    input.defense.secureTimeMs ?? input.defense.ballArrivalTimeMs,
  )];
  let sacrificeFly = false;

  if (input.bases.third && input.outsBeforePlay < 2 && input.ball.distance >= 58) {
    const fielder = input.defenders.find((player) => player.id === input.defense.primaryFielderId);
    const secureTime = input.defense.secureTimeMs ?? input.defense.ballArrivalTimeMs;
    const transferMs = fielder ? (0.68 - fielder.fielding * 0.003) * 1_000 : 460;
    const throwSpeed = fielder ? 25 + fielder.arm * 0.17 : 37;
    const throwHomeAt = secureTime
      + transferMs
      + Math.max(55, input.ball.distance + 25) / throwSpeed * 1_000;
    const runnerHomeAt = secureTime + 180 + travelTimeMs(input.bases.third.speed);
    const scores = runnerHomeAt < throwHomeAt;
    advances.push(makeAdvance(
      input.bases.third,
      3,
      4,
      scores ? "SCORE" : "OUT",
      false,
      secureTime + 180,
      scores ? undefined : throwHomeAt,
    ));
    next.third = null;
    sacrificeFly = scores;
  }

  const runners = runnerResolution(advances, next);
  return {
    kind: "CATCH_OUT",
    defense: defenseResolution(input.defense, "CATCH", runners.outsRecorded),
    runners,
    batterDestination: 0,
    hitValue: 0,
    sacrificeFly,
    errorFielderId: null,
  };
}

function resolveGroundBall(input: ResolveBaseRunningInput): ResolvedRunningPlay {
  const secureTime = input.defense.secureTimeMs ?? input.defense.ballArrivalTimeMs;
  const batterArrival = travelTimeMs(input.batter.speed);
  const firstRunner = input.bases.first;
  const next = cloneBases(input.bases);
  const advances: RunnerAdvance[] = [];

  const advanceForcedRunners = (recordedOuts: number) => {
    if (input.outsBeforePlay + recordedOuts >= 3 || !input.bases.second) return;
    if (input.bases.third) {
      advances.push(makeAdvance(input.bases.third, 3, 4, "SCORE", true, 90));
      next.third = null;
    }
    advances.push(makeAdvance(input.bases.second, 2, 3, "SAFE", true, 90));
    next.second = null;
    next.third = settledRunner(input.bases.second, 3);
  };

  if (firstRunner && input.outsBeforePlay < 2) {
    const fielder = input.defenders.find((player) => player.id === input.defense.primaryFielderId);
    const transfer = fielder ? (0.68 - fielder.fielding * 0.003) * 1_000 : 450;
    const throwSpeed = fielder ? 25 + fielder.arm * 0.17 : 37;
    const forceAtSecond = secureTime + transfer + 19 / throwSpeed * 1_000;
    const runnerAtSecond = 90 + travelTimeMs(firstRunner.speed);

    if (forceAtSecond < runnerAtSecond) {
      advances.push(makeAdvance(firstRunner, 1, 2, "OUT", true, 90, forceAtSecond));
      next.first = null;
      const relayFirst = forceAtSecond + 360 + 27.43 / 39 * 1_000;
      const turnsTwo = relayFirst < batterArrival && input.outsBeforePlay <= 1;
      if (turnsTwo) {
        advances.push(makeAdvance(input.batter, 0, 1, "OUT", true, 0, relayFirst));
        advanceForcedRunners(2);
        return {
          kind: "DOUBLE_PLAY",
          defense: defenseResolution(input.defense, "FORCE_OUT", 2),
          runners: runnerResolution(advances, next),
          batterDestination: 0,
          hitValue: 0,
          sacrificeFly: false,
          errorFielderId: null,
        };
      }

      advanceForcedRunners(1);
      advances.push(makeAdvance(input.batter, 0, 1, "SAFE", true));
      next.first = batterRunner(input.batter, 1);
      return {
        kind: "FIELDER_CHOICE",
        defense: defenseResolution(input.defense, "FORCE_OUT", 1),
        runners: runnerResolution(advances, next),
        batterDestination: 1,
        hitValue: 0,
        sacrificeFly: false,
        errorFielderId: null,
      };
    }
  }

  const throwFirstAt = input.defense.throwToFirstArrivalTimeMs ?? Number.POSITIVE_INFINITY;
  if (throwFirstAt < batterArrival) {
    advances.push(makeAdvance(input.batter, 0, 1, "OUT", true, 0, throwFirstAt));
    if (firstRunner) {
      advances.push(makeAdvance(firstRunner, 1, 2, "SAFE", true, 90));
      next.first = null;
      next.second = settledRunner(firstRunner, 2);
    }
    return {
      kind: "GROUND_OUT",
      defense: defenseResolution(input.defense, "GROUND_OUT", 1),
      runners: runnerResolution(advances, next),
      batterDestination: 0,
      hitValue: 0,
      sacrificeFly: false,
      errorFielderId: null,
    };
  }

  return advanceHit(input, 1);
}

export function resolveBaseRunning(input: ResolveBaseRunningInput): ResolvedRunningPlay {
  if (!Number.isSafeInteger(input.outsBeforePlay) || input.outsBeforePlay < 0 || input.outsBeforePlay > 2) {
    throw new RangeError("outsBeforePlay must be an integer from 0 through 2.");
  }
  if (input.ball.batterId !== input.batter.id) {
    throw new RangeError("ball.batterId must match batter.id.");
  }
  if (!input.ball.fair) throw new RangeError("Foul balls do not enter the base-running engine.");
  const occupiedIds = [input.bases.first, input.bases.second, input.bases.third]
    .filter((runner): runner is BaseRunner => runner !== null)
    .map((runner) => runner.playerId);
  if (new Set(occupiedIds).size !== occupiedIds.length || occupiedIds.includes(input.batter.id)) {
    throw new RangeError("Bases must contain unique runners and cannot already contain the batter.");
  }

  if (input.defense.homeRun) return resolveHomeRun(input);

  if (!input.defense.secured) {
    if (input.defense.routine) return resolveError(input);
    return advanceHit(input, Math.max(1, input.defense.suggestedHitValue) as 1 | 2 | 3);
  }

  if (input.ball.type !== "GROUND") return resolveCaughtBall(input);
  return resolveGroundBall(input);
}
