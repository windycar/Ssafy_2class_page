import { getBaseballPlayer } from "../../../data/games/baseball/players.ts";
import { isBaseballPitchType } from "../../../data/games/baseball/pitches.ts";
import { getBaseballRoster } from "../../../data/games/baseball/rosters.ts";
import {
  cloneGameState,
  createGameState,
} from "./gameState.ts";
import {
  BASEBALL_GAME_STATE_VERSION,
  type BaseNumber,
  type BaseRunner,
  type BaseballGameState,
  type BaseballTeamState,
  type BasesState,
} from "./types.ts";

export type BaseballStateNormalizeFailureCode =
  | "NOT_OBJECT"
  | "UNSUPPORTED_VERSION"
  | "INVALID_FIELD"
  | "INVALID_REVISION"
  | "INVALID_INVARIANT";

export interface BaseballStateNormalizeSuccess {
  ok: true;
  value: BaseballGameState;
  sourceVersion: 1 | 2;
  migrated: boolean;
  needsPersistence: boolean;
  repairs: string[];
}

export interface BaseballStateNormalizeFailure {
  ok: false;
  code: BaseballStateNormalizeFailureCode;
  path: string;
  recoverable: boolean;
}

export type BaseballStateNormalizeResult =
  | BaseballStateNormalizeSuccess
  | BaseballStateNormalizeFailure;

type UnknownRecord = Record<string, unknown>;

function failure(
  code: BaseballStateNormalizeFailureCode,
  path: string,
  recoverable = true,
): BaseballStateNormalizeFailure {
  return { ok: false, code, path, recoverable };
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeIntegerInRange(value: unknown, minimum: number, maximum: number) {
  return Number.isSafeInteger(value) && (value as number) >= minimum && (value as number) <= maximum;
}

function isFiniteNonNegative(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isNonNegativeSafeInteger(value: unknown) {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function isFiniteInRange(value: unknown, minimum: number, maximum: number) {
  return typeof value === "number"
    && Number.isFinite(value)
    && value >= minimum
    && value <= maximum;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.length > 0);
}

function isLegacyTeam(value: unknown): value is UnknownRecord {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.name)
    && isNonNegativeSafeInteger(value.runs)
    && isNonNegativeSafeInteger(value.hits)
    && Array.isArray(value.inningRuns)
    && value.inningRuns.every(isNonNegativeSafeInteger)
    && value.inningRuns.reduce((sum, runs) => sum + runs, 0) === value.runs;
}

function isValidCount(value: unknown): value is UnknownRecord {
  return isRecord(value)
    && isSafeIntegerInRange(value.balls, 0, 3)
    && isSafeIntegerInRange(value.strikes, 0, 2)
    && isSafeIntegerInRange(value.outs, 0, 2);
}

function legacyRunner(
  state: UnknownRecord,
  slot: keyof BasesState,
  currentBase: BaseNumber,
): BaseRunner {
  const team = Number(state.battingTeam);
  return {
    playerId: `legacy:${team}:${state.inning}:${state.half}:${slot}`,
    name: `기존 ${currentBase}루 주자`,
    speed: 70,
    currentBase,
  };
}

function normalizeLegacyBases(state: UnknownRecord): BasesState | null {
  if (!isRecord(state.bases)) return null;
  const { first, second, third } = state.bases;
  if ([first, second, third].some((value) => typeof value !== "boolean")) return null;
  return {
    first: first ? legacyRunner(state, "first", 1) : null,
    second: second ? legacyRunner(state, "second", 2) : null,
    third: third ? legacyRunner(state, "third", 3) : null,
  };
}

function copyLegacyTeam(target: BaseballTeamState, raw: UnknownRecord) {
  target.runs = raw.runs as number;
  target.hits = raw.hits as number;
  target.inningRuns = [...raw.inningRuns as number[]];
}

function normalizeLegacyState(raw: UnknownRecord): BaseballStateNormalizeResult {
  if (!isSafeIntegerInRange(raw.inning, 1, 999)) return failure("INVALID_FIELD", "$.inning");
  if (raw.half !== "top" && raw.half !== "bottom") return failure("INVALID_FIELD", "$.half");
  if (raw.battingTeam !== 0 && raw.battingTeam !== 1) return failure("INVALID_FIELD", "$.battingTeam");
  if ((raw.half === "top" ? 0 : 1) !== raw.battingTeam) {
    return failure("INVALID_INVARIANT", "$.battingTeam");
  }
  if (!isValidCount(raw.count)) return failure("INVALID_FIELD", "$.count");
  const bases = normalizeLegacyBases(raw);
  if (!bases) return failure("INVALID_FIELD", "$.bases");
  if (!Array.isArray(raw.teams) || raw.teams.length !== 2 || !raw.teams.every(isLegacyTeam)) {
    return failure("INVALID_FIELD", "$.teams");
  }
  if (raw.status !== "playing" && raw.status !== "finished") return failure("INVALID_FIELD", "$.status");
  if (raw.winner !== null && raw.winner !== 0 && raw.winner !== 1) return failure("INVALID_FIELD", "$.winner");
  if ((raw.status === "playing" && raw.winner !== null) || (raw.status === "finished" && raw.winner === null)) {
    return failure("INVALID_INVARIANT", "$.winner");
  }

  const teamNames = raw.teams.map((team) => (team as UnknownRecord).name as string);
  const state = createGameState(teamNames[0], teamNames[1]);
  state.inning = raw.inning as number;
  state.half = raw.half;
  state.battingTeam = raw.battingTeam;
  state.count = {
    balls: raw.count.balls as number,
    strikes: raw.count.strikes as number,
    outs: raw.count.outs as number,
  };
  state.bases = bases;
  copyLegacyTeam(state.teams[0], raw.teams[0] as UnknownRecord);
  copyLegacyTeam(state.teams[1], raw.teams[1] as UnknownRecord);
  state.status = raw.status;
  state.winner = raw.winner;

  return {
    ok: true,
    value: state,
    sourceVersion: 1,
    migrated: true,
    needsPersistence: true,
    repairs: ["version", "revision", "seed", "runnerIdentity", "lineups", "stats", "playHistory"],
  };
}

const BATTER_STAT_KEYS = ["pa", "ab", "h", "doubles", "triples", "hr", "rbi", "r", "bb", "so"] as const;
const PITCHER_STAT_KEYS = [
  "outsRecorded",
  "pitches",
  "hitsAllowed",
  "runsAllowed",
  "earnedRuns",
  "walks",
  "strikeouts",
] as const;
const PITCHER_STATE_KEYS = [
  "playerId",
  "pitchCount",
  "stamina",
  "confidence",
  "velocityModifier",
  "controlModifier",
  "movementModifier",
] as const;
const PLAY_RESULT_CODES = new Set([
  "BALL", "CALLED_STRIKE", "SWINGING_STRIKE", "FOUL", "WALK",
  "STRIKEOUT_LOOKING", "STRIKEOUT_SWINGING", "GROUND_OUT_1B", "GROUND_OUT_2B",
  "GROUND_OUT_SS", "GROUND_OUT_3B", "FLY_OUT_LF", "FLY_OUT_CF", "FLY_OUT_RF",
  "LINE_OUT", "POP_OUT", "SINGLE_LEFT", "SINGLE_CENTER", "SINGLE_RIGHT",
  "INFIELD_SINGLE", "DOUBLE_LEFT", "DOUBLE_CENTER", "DOUBLE_RIGHT", "TRIPLE",
  "HOME_RUN_LEFT", "HOME_RUN_CENTER", "HOME_RUN_RIGHT", "DOUBLE_PLAY", "FIELDER_CHOICE",
  "SAC_FLY", "ERROR",
]);
const ACTIVE_PLAY_PHASES = new Set([
  "AWAITING_PITCH", "PITCH_RELEASED", "AWAITING_BATTER", "CONTACT",
  "BALL_FLIGHT", "DEFENSE", "BASE_RUNNING", "RESOLVED",
]);
const PITCH_QUALITIES = new Set(["PERFECT", "GOOD", "NORMAL", "MISS"]);
const SWING_TYPES = new Set(["CONTACT", "NORMAL", "POWER"]);
const SWING_TIMINGS = new Set(["VERY_EARLY", "EARLY", "GOOD", "PERFECT", "LATE", "VERY_LATE"]);
const CONTACT_QUALITIES = new Set(["NONE", "WEAK", "GOOD", "PERFECT"]);
const CONTACT_RESULTS = new Set(["MISS", "FOUL", "IN_PLAY"]);
const BATTED_BALL_TYPES = new Set(["GROUND", "LINER", "FLY", "POPUP"]);
const BATTED_BALL_ZONES = new Set([
  "LF", "LCF", "CF", "RCF", "RF", "3B", "SS", "2B", "1B", "FOUL_LEFT", "FOUL_RIGHT",
]);
const FIELDING_RESULTS = new Set(["CATCH", "GROUND_OUT", "FORCE_OUT", "TAG_OUT", "SAFE", "ERROR", "NO_PLAY"]);
const FIELDING_POSITIONS = new Set(["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"]);
const RUNNER_RESULTS = new Set(["HOLD", "SAFE", "OUT", "SCORE"]);
const CAMERA_MODES = new Set([
  "BATTER", "PITCHER", "CONTACT", "INFIELD", "LEFT_FIELD", "LEFT_CENTER", "CENTER_FIELD",
  "RIGHT_CENTER", "RIGHT_FIELD",
  "FOUL", "FIRST_BASE_LINE", "THIRD_BASE_LINE", "BASE_RUNNING",
  "HOME_RUN", "RUN_SCORED", "DUGOUT", "REPLAY",
]);
const VISUAL_EVENT_KINDS = new Set([
  "CONTACT", "BALL_FLIGHT", "FIELD_RESULT", "RUNNER_ADVANCE", "RUN_SCORE",
  "SCOREBOARD_UPDATE", "PLAY_RESULT", "NEXT_BATTER", "HALF_INNING",
]);

function hasExactlyKeys(value: UnknownRecord, keys: readonly string[]) {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function isKnownPlayerId(value: unknown) {
  return isNonEmptyString(value) && getBaseballPlayer(value) !== undefined;
}

function isStringArrayWithUniqueValues(value: unknown): value is string[] {
  return isStringArray(value) && new Set(value).size === value.length;
}

function isPoint(value: unknown) {
  return isRecord(value)
    && typeof value.x === "number"
    && Number.isFinite(value.x)
    && typeof value.y === "number"
    && Number.isFinite(value.y);
}

function isBatterStats(value: unknown) {
  if (!isRecord(value) || !hasExactlyKeys(value, BATTER_STAT_KEYS)) return false;
  if (!BATTER_STAT_KEYS.every((key) => isNonNegativeSafeInteger(value[key]))) return false;
  const pa = value.pa as number;
  const ab = value.ab as number;
  const hits = value.h as number;
  return hits <= ab
    && (value.doubles as number) + (value.triples as number) + (value.hr as number) <= hits
    && ab + (value.bb as number) <= pa;
}

function isPitcherStats(value: unknown) {
  if (!isRecord(value) || !hasExactlyKeys(value, PITCHER_STAT_KEYS)) return false;
  if (!PITCHER_STAT_KEYS.every((key) => isNonNegativeSafeInteger(value[key]))) return false;
  return (value.earnedRuns as number) <= (value.runsAllowed as number)
    && (value.strikeouts as number) <= (value.outsRecorded as number);
}

function isV2Runner(value: unknown, currentBase: BaseNumber): value is BaseRunner | null {
  if (value === null) return true;
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.playerId)
    || !isNonEmptyString(value.name)
    || !isFiniteInRange(value.speed, 0, 100)
    || value.currentBase !== currentBase) return false;
  if (value.targetBase !== undefined
    && (!isSafeIntegerInRange(value.targetBase, currentBase + 1, 4))) return false;
  if (value.progress !== undefined
    && (value.targetBase === undefined || !isFiniteInRange(value.progress, 0, 1))) return false;
  const player = getBaseballPlayer(value.playerId);
  return player
    ? value.name === player.name && value.speed === player.speed
    : value.playerId.startsWith("legacy:");
}

function isBasesState(value: unknown): value is BasesState {
  if (!isRecord(value)
    || !Object.hasOwn(value, "first")
    || !Object.hasOwn(value, "second")
    || !Object.hasOwn(value, "third")
    || !isV2Runner(value.first, 1)
    || !isV2Runner(value.second, 2)
    || !isV2Runner(value.third, 3)) return false;
  const runners = [value.first, value.second, value.third].filter(
    (runner): runner is BaseRunner => runner !== null,
  );
  return new Set(runners.map((runner) => runner.playerId)).size === runners.length;
}

function isV2Team(value: unknown): value is BaseballTeamState {
  const roster = isRecord(value) && isNonEmptyString(value.rosterId)
    ? getBaseballRoster(value.rosterId)
    : undefined;
  if (!isRecord(value)
    || !isNonEmptyString(value.id)
    || !isNonEmptyString(value.name)
    || !isNonEmptyString(value.shortName)
    || !isNonEmptyString(value.themeColor)
    || !isNonEmptyString(value.accentColor)
    || !isNonEmptyString(value.rosterId)
    || !roster
    || value.id !== roster.id
    || !isStringArrayWithUniqueValues(value.lineupPlayerIds)
    || value.lineupPlayerIds.length !== 9
    || value.lineupPlayerIds.some((playerId, index) => roster.lineupPlayerIds[index] !== playerId)
    || value.lineupPlayerIds.some((playerId) => {
      const player = getBaseballPlayer(playerId);
      return !player || player.position === "P";
    })
    || !isSafeIntegerInRange(value.currentBatterIndex, 0, 8)
    || !isNonNegativeSafeInteger(value.runs)
    || !isNonNegativeSafeInteger(value.hits)
    || !isNonNegativeSafeInteger(value.errors)
    || !Array.isArray(value.inningRuns)
    || !value.inningRuns.every(isNonNegativeSafeInteger)
    || value.inningRuns.reduce((sum, runs) => sum + runs, 0) !== value.runs
    || !isRecord(value.pitcher)
    || !hasExactlyKeys(value.pitcher, PITCHER_STATE_KEYS)
    || !isKnownPlayerId(value.pitcher.playerId)
    || value.pitcher.playerId !== roster.startingPitcherId
    || !getBaseballPlayer(value.pitcher.playerId)?.pitching
    || !isNonNegativeSafeInteger(value.pitcher.pitchCount)
    || !isFiniteInRange(value.pitcher.stamina, 0, 100)
    || !isFiniteInRange(value.pitcher.confidence, 0, 100)
    || !isFiniteInRange(value.pitcher.velocityModifier, -100, 100)
    || !isFiniteInRange(value.pitcher.controlModifier, -100, 100)
    || !isFiniteInRange(value.pitcher.movementModifier, -100, 100)
    || !isRecord(value.batterStats)
    || !isRecord(value.pitcherStats)) return false;

  const batterStatIds = Object.keys(value.batterStats);
  if (batterStatIds.length !== value.lineupPlayerIds.length
    || value.lineupPlayerIds.some((playerId) => (
      !Object.hasOwn(value.batterStats, playerId) || !isBatterStats(value.batterStats[playerId])
    ))) return false;

  const pitcherStatIds = Object.keys(value.pitcherStats);
  if (!Object.hasOwn(value.pitcherStats, value.pitcher.playerId)
    || pitcherStatIds.length === 0
    || pitcherStatIds.some((playerId) => (
      !getBaseballPlayer(playerId)?.pitching || !isPitcherStats(value.pitcherStats[playerId])
    ))) return false;

  return value.pitcherStats[value.pitcher.playerId].pitches === value.pitcher.pitchCount;
}

function isPitchFlightState(value: unknown) {
  return isRecord(value)
    && isPoint(value.start)
    && isPoint(value.control1)
    && isPoint(value.control2)
    && isPoint(value.target)
    && isFiniteNonNegative(value.velocityKmh)
    && isFiniteNonNegative(value.spinRate)
    && typeof value.rotation === "number"
    && Number.isFinite(value.rotation)
    && isFiniteInRange(value.progress, 0, 1)
    && typeof value.breakX === "number"
    && Number.isFinite(value.breakX)
    && typeof value.breakY === "number"
    && Number.isFinite(value.breakY)
    && isBaseballPitchType(value.pitchType);
}

function isResolvedPitch(value: unknown) {
  if (!isRecord(value)
    || !isNonEmptyString(value.id)
    || !isKnownPlayerId(value.pitcherId)
    || !getBaseballPlayer(value.pitcherId)?.pitching
    || !isBaseballPitchType(value.pitchType)
    || !PITCH_QUALITIES.has(value.quality as string)
    || !isRecord(value.location)
    || !isPoint(value.location.intended)
    || !isPoint(value.location.actual)
    || !isFiniteNonNegative(value.velocityKmh)
    || !isFiniteNonNegative(value.spinRate)
    || !isFiniteInRange(value.movement, 0, 100)
    || !isNonNegativeSafeInteger(value.flightDurationMs)
    || !isPitchFlightState(value.trajectory)) return false;
  return (value.trajectory as UnknownRecord).pitchType === value.pitchType;
}

function isContactResolution(value: unknown) {
  return isRecord(value)
    && CONTACT_RESULTS.has(value.result as string)
    && SWING_TIMINGS.has(value.timing as string)
    && CONTACT_QUALITIES.has(value.quality as string)
    && isFiniteNonNegative(value.timingError)
    && isFiniteNonNegative(value.locationError)
    && isFiniteInRange(value.pciOverlap, 0, 1)
    && isKnownPlayerId(value.batterId)
    && isKnownPlayerId(value.pitcherId)
    && SWING_TYPES.has(value.swingType as string)
    && isBaseballPitchType(value.pitchType);
}

function isBattedBall(value: unknown) {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && isKnownPlayerId(value.batterId)
    && isFiniteNonNegative(value.exitVelocity)
    && typeof value.launchAngle === "number"
    && Number.isFinite(value.launchAngle)
    && typeof value.horizontalAngle === "number"
    && Number.isFinite(value.horizontalAngle)
    && typeof value.spin === "number"
    && Number.isFinite(value.spin)
    && isFiniteNonNegative(value.hangTime)
    && isFiniteNonNegative(value.distance)
    && BATTED_BALL_TYPES.has(value.type as string)
    && BATTED_BALL_ZONES.has(value.zone as string)
    && typeof value.fair === "boolean";
}

function isDefenseResolution(value: unknown) {
  return isRecord(value)
    && FIELDING_RESULTS.has(value.result as string)
    && (value.primaryFielderId === null || isKnownPlayerId(value.primaryFielderId))
    && (value.primaryPosition === null || FIELDING_POSITIONS.has(value.primaryPosition as string))
    && isStringArrayWithUniqueValues(value.assistingFielderIds)
    && value.assistingFielderIds.every((playerId) => isKnownPlayerId(playerId))
    && isFiniteNonNegative(value.ballArrivalTimeMs)
    && (value.fielderArrivalTimeMs === null || isFiniteNonNegative(value.fielderArrivalTimeMs))
    && (value.throwArrivalTimeMs === null || isFiniteNonNegative(value.throwArrivalTimeMs))
    && isFiniteInRange(value.fieldingProbability, 0, 1)
    && isFiniteInRange(value.errorProbability, 0, 1)
    && isSafeIntegerInRange(value.outsRecorded, 0, 3);
}

function isRunnerAdvance(value: unknown) {
  if (!isRecord(value)
    || !isNonEmptyString(value.runnerId)
    || !isNonEmptyString(value.runnerName)
    || !isSafeIntegerInRange(value.fromBase, 0, 3)
    || !isSafeIntegerInRange(value.toBase, 1, 4)
    || (value.toBase as number) <= (value.fromBase as number)
    || !RUNNER_RESULTS.has(value.result as string)
    || !isFiniteNonNegative(value.startedAtMs)
    || !isFiniteNonNegative(value.arrivedAtMs)
    || (value.arrivedAtMs as number) < (value.startedAtMs as number)
    || typeof value.isForce !== "boolean") return false;
  return value.outAtMs === undefined || (
    isFiniteNonNegative(value.outAtMs)
    && (value.outAtMs as number) >= (value.startedAtMs as number)
  );
}

function isRunnerResolution(value: unknown) {
  if (!isRecord(value)
    || !Array.isArray(value.advances)
    || !value.advances.every(isRunnerAdvance)
    || !isBasesState(value.nextBases)
    || !isStringArrayWithUniqueValues(value.scoredRunnerIds)
    || !isStringArrayWithUniqueValues(value.outRunnerIds)
    || !isNonNegativeSafeInteger(value.runsScored)
    || !isSafeIntegerInRange(value.outsRecorded, 0, 3)) return false;
  return value.scoredRunnerIds.length === value.runsScored
    && value.outRunnerIds.length === value.outsRecorded;
}

function isJsonValue(value: unknown, ancestors = new Set<object>()): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object") return false;
  if (ancestors.has(value)) return false;
  const nextAncestors = new Set(ancestors).add(value);
  if (Array.isArray(value)) return value.every((item) => isJsonValue(item, nextAncestors));
  if (!isRecord(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(value).every((item) => isJsonValue(item, nextAncestors));
}

function isVisualEvent(value: unknown, playId: string) {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && value.playId === playId
    && isNonNegativeSafeInteger(value.sequence)
    && VISUAL_EVENT_KINDS.has(value.kind as string)
    && CAMERA_MODES.has(value.camera as string)
    && isNonNegativeSafeInteger(value.durationMs)
    && typeof value.skippable === "boolean"
    && isRecord(value.payload)
    && isJsonValue(value.payload);
}

function isActivePlay(value: unknown) {
  if (!isRecord(value)
    || !isNonEmptyString(value.playId)
    || (value.startCommandId !== undefined && !isNonEmptyString(value.startCommandId))
    || !isNonNegativeSafeInteger(value.sequence)
    || !isSafeIntegerInRange(value.seed, 0, 0xffff_ffff)
    || !ACTIVE_PLAY_PHASES.has(value.phase as string)
    || !isKnownPlayerId(value.batterId)
    || !isKnownPlayerId(value.pitcherId)
    || !getBaseballPlayer(value.pitcherId)?.pitching
    || (value.pitch !== null && !isResolvedPitch(value.pitch))
    || (value.contact !== null && !isContactResolution(value.contact))
    || (value.battedBall !== null && !isBattedBall(value.battedBall))
    || (value.defense !== null && !isDefenseResolution(value.defense))
    || (value.runners !== null && !isRunnerResolution(value.runners))
    || !Array.isArray(value.visualEvents)
    || !value.visualEvents.every((event) => isVisualEvent(event, value.playId))) return false;
  if (value.pitch !== null && (value.pitch as UnknownRecord).pitcherId !== value.pitcherId) return false;
  if (value.contact !== null && (
    (value.contact as UnknownRecord).batterId !== value.batterId
    || (value.contact as UnknownRecord).pitcherId !== value.pitcherId
  )) return false;
  if (value.battedBall !== null && (value.battedBall as UnknownRecord).batterId !== value.batterId) return false;
  const pitch = value.pitch as UnknownRecord | null;
  const contact = value.contact as UnknownRecord | null;
  const ball = value.battedBall as UnknownRecord | null;
  const hasNoOutcome = contact === null
    && ball === null
    && value.defense === null
    && value.runners === null;
  const hasNoPresentation = value.visualEvents.length === 0;
  let phaseValid = false;
  switch (value.phase) {
    case "AWAITING_PITCH":
      phaseValid = pitch === null && hasNoOutcome && hasNoPresentation;
      break;
    case "PITCH_RELEASED":
    case "AWAITING_BATTER":
      phaseValid = pitch !== null && hasNoOutcome && hasNoPresentation;
      break;
    case "CONTACT":
      phaseValid = pitch !== null
        && contact !== null
        && ball === null
        && value.defense === null
        && value.runners === null
        && hasNoPresentation;
      break;
    case "BALL_FLIGHT":
      phaseValid = pitch !== null
        && contact !== null
        && ball !== null
        && value.defense === null
        && value.runners === null
        && hasNoPresentation;
      break;
    case "DEFENSE":
      phaseValid = pitch !== null
        && contact !== null
        && ball !== null
        && value.defense !== null
        && value.runners === null
        && hasNoPresentation;
      break;
    case "BASE_RUNNING":
      phaseValid = pitch !== null
        && contact !== null
        && ball !== null
        && value.defense !== null
        && value.runners !== null
        && hasNoPresentation;
      break;
    case "RESOLVED": {
      const ballIsFair = ball?.fair === true;
      const ballIsFoul = ball?.fair === false;
      const resolvedShapeValid = contact === null
        ? ball === null && value.defense === null
        : contact.result === "IN_PLAY"
          ? ball !== null && (
            (ballIsFair && value.defense !== null && value.runners !== null)
            || (ballIsFoul && value.defense === null && value.runners === null)
          )
          : ball === null && value.defense === null && value.runners === null;
      phaseValid = pitch !== null && resolvedShapeValid && !hasNoPresentation;
      break;
    }
  }
  if (!phaseValid) return false;

  const eventIds = value.visualEvents.map((event) => (event as UnknownRecord).id);
  const eventSequences = value.visualEvents.map((event) => (event as UnknownRecord).sequence);
  return new Set(eventIds).size === eventIds.length
    && new Set(eventSequences).size === eventSequences.length
    && eventSequences.every((sequence, index) => sequence === index);
}

function isOfficialPlayResult(value: unknown) {
  return isRecord(value)
    && isNonEmptyString(value.playId)
    && PLAY_RESULT_CODES.has(value.code as string)
    && isKnownPlayerId(value.batterId)
    && isKnownPlayerId(value.pitcherId)
    && isSafeIntegerInRange(value.outsRecorded, 0, 3)
    && isSafeIntegerInRange(value.runsScored, 0, 4)
    && isSafeIntegerInRange(value.hitValue, 0, 4)
    && isSafeIntegerInRange(value.rbi, 0, 4)
    && isStringArrayWithUniqueValues(value.scoredRunnerIds)
    && isStringArrayWithUniqueValues(value.outRunnerIds)
    && isStringArrayWithUniqueValues(value.fielderIds)
    && value.fielderIds.every((playerId) => isKnownPlayerId(playerId))
    && (value.errorFielderId === null || isKnownPlayerId(value.errorFielderId))
    && typeof value.plateAppearanceEnded === "boolean"
    && value.scoredRunnerIds.length === value.runsScored
    && value.outRunnerIds.length === value.outsRecorded;
}

function isPlayByPlayEntry(value: unknown) {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && (value.startCommandId === undefined || isNonEmptyString(value.startCommandId))
    && isNonEmptyString(value.playId)
    && isSafeIntegerInRange(value.inning, 1, 999)
    && (value.half === "top" || value.half === "bottom")
    && (value.battingTeam === 0 || value.battingTeam === 1)
    && value.battingTeam === (value.half === "top" ? 0 : 1)
    && isKnownPlayerId(value.batterId)
    && PLAY_RESULT_CODES.has(value.result as string)
    && typeof value.message === "string"
    && isSafeIntegerInRange(value.runsScored, 0, 4)
    && isNonEmptyString(value.createdAt)
    && Number.isFinite(Date.parse(value.createdAt));
}

function normalizeV2State(raw: UnknownRecord): BaseballStateNormalizeResult {
  if (!isNonNegativeSafeInteger(raw.revision)) return failure("INVALID_REVISION", "$.revision");
  if (!isSafeIntegerInRange(raw.seed, 0, 0xffff_ffff)) return failure("INVALID_FIELD", "$.seed");
  if (!isSafeIntegerInRange(raw.inning, 1, 999)) return failure("INVALID_FIELD", "$.inning");
  if (raw.half !== "top" && raw.half !== "bottom") return failure("INVALID_FIELD", "$.half");
  if (raw.battingTeam !== 0 && raw.battingTeam !== 1) return failure("INVALID_FIELD", "$.battingTeam");
  if ((raw.half === "top" ? 0 : 1) !== raw.battingTeam) return failure("INVALID_INVARIANT", "$.battingTeam");
  if (!isValidCount(raw.count)) return failure("INVALID_FIELD", "$.count");
  if (!isBasesState(raw.bases)) return failure("INVALID_FIELD", "$.bases");
  if (!Array.isArray(raw.teams) || raw.teams.length !== 2 || !raw.teams.every(isV2Team)) {
    return failure("INVALID_FIELD", "$.teams");
  }
  if (raw.teams[0].id === raw.teams[1].id || raw.teams[0].rosterId === raw.teams[1].rosterId) {
    return failure("INVALID_INVARIANT", "$.teams");
  }
  const battingTeamState = raw.teams[raw.battingTeam] as BaseballTeamState;
  const currentBatterId = battingTeamState.lineupPlayerIds[battingTeamState.currentBatterIndex];
  const baseRunnerIds = [
    (raw.bases as BasesState).first?.playerId,
    (raw.bases as BasesState).second?.playerId,
    (raw.bases as BasesState).third?.playerId,
  ].filter((playerId): playerId is string => playerId !== undefined);
  if (baseRunnerIds.includes(currentBatterId)
    || baseRunnerIds.some(
      (playerId) => !playerId.startsWith("legacy:")
        && !battingTeamState.lineupPlayerIds.includes(playerId),
    )) {
    return failure("INVALID_INVARIANT", "$.bases");
  }
  if (raw.status !== "playing" && raw.status !== "finished") return failure("INVALID_FIELD", "$.status");
  if (raw.winner !== null && raw.winner !== 0 && raw.winner !== 1) return failure("INVALID_FIELD", "$.winner");
  if ((raw.status === "playing" && raw.winner !== null) || (raw.status === "finished" && raw.winner === null)) {
    return failure("INVALID_INVARIANT", "$.winner");
  }
  if (raw.status === "finished" && raw.winner !== null) {
    const otherTeam = raw.winner === 0 ? 1 : 0;
    if (raw.teams[raw.winner].runs <= raw.teams[otherTeam].runs) {
      return failure("INVALID_INVARIANT", "$.winner");
    }
  }
  if (raw.activePlay !== null && !isActivePlay(raw.activePlay)) return failure("INVALID_FIELD", "$.activePlay");
  if (raw.lastPlay !== null && !isOfficialPlayResult(raw.lastPlay)) return failure("INVALID_FIELD", "$.lastPlay");
  if (raw.activePlay !== null && (raw.activePlay as UnknownRecord).phase === "RESOLVED") {
    if (raw.lastPlay === null
      || (raw.lastPlay as UnknownRecord).playId !== (raw.activePlay as UnknownRecord).playId) {
      return failure("INVALID_INVARIANT", "$.lastPlay");
    }
  }
  if (!Array.isArray(raw.playByPlay) || !raw.playByPlay.every(isPlayByPlayEntry)) {
    return failure("INVALID_FIELD", "$.playByPlay");
  }
  const playByPlayIds = raw.playByPlay.map((entry) => (entry as UnknownRecord).id);
  if (new Set(playByPlayIds).size !== playByPlayIds.length) {
    return failure("INVALID_INVARIANT", "$.playByPlay");
  }

  try {
    const state = cloneGameState(raw as unknown as BaseballGameState);
    return {
      ok: true,
      value: state,
      sourceVersion: 2,
      migrated: false,
      needsPersistence: false,
      repairs: [],
    };
  } catch {
    return failure("INVALID_FIELD", "$");
  }
}

export function normalizeBaseballGameState(raw: unknown): BaseballStateNormalizeResult {
  if (!isRecord(raw)) return failure("NOT_OBJECT", "$", true);
  if (raw.version === undefined || raw.version === 1) return normalizeLegacyState(raw);
  if (raw.version !== BASEBALL_GAME_STATE_VERSION) {
    return failure("UNSUPPORTED_VERSION", "$.version", false);
  }
  return normalizeV2State(raw);
}

export function requireNormalizedBaseballGameState(raw: unknown): BaseballGameState {
  const result = normalizeBaseballGameState(raw);
  if (!result.ok) throw new Error(`야구 상태 정규화 실패: ${result.code} ${result.path}`);
  return result.value;
}
