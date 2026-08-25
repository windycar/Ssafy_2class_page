import { getBaseballPlayer } from "../../../data/games/baseball/players.ts";
import { isBaseballPitchType } from "../../../data/games/baseball/pitches.ts";
import { createBattedBall, resolveDefenseOpportunity } from "./ballInPlayEngine.ts";
import {
  type BatterAction,
  type ResolvedContact,
  resolveBatterAction,
} from "./battingEngine.ts";
import {
  type ResolvedRunningPlay,
  resolveBaseRunning,
} from "./baseRunningEngine.ts";
import {
  advanceBattingOrder,
  cloneBases,
  cloneGameState,
  createEmptyBatterStats,
  createEmptyPitcherStats,
  createRunner,
  getCurrentBatter,
  getCurrentPitcher,
  getFieldingTeam,
} from "./gameState.ts";
import { resolvePitch } from "./pitchEngine.ts";
import { createBaseballPlayByPlayEntryV2 } from "./playByPlay.ts";
import { deriveSeed } from "./random.ts";
import type {
  BaseRunner,
  BaseballGameState,
  BaseballPitchType,
  BaseballPlayResultCode,
  BaseballPlayer,
  DefenseResolution,
  OfficialPlayResult,
  PitchQuality,
  RunnerAdvance,
  RunnerResolution,
  TeamIndex,
  Vec2,
} from "./types.ts";
import { buildPlayVisualEvents } from "./visualEventQueue.ts";

const REGULATION_INNINGS = 3;
const COMMAND_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const ISO_UTC_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/;
const PITCH_QUALITIES = new Set<PitchQuality>(["PERFECT", "GOOD", "NORMAL", "MISS"]);
const SWING_TYPES = new Set(["CONTACT", "NORMAL", "POWER"]);

export interface StartPitchCommand {
  commandId: string;
  expectedRevision: number;
  playId: string;
  sequence: number;
  pitcherId: string;
  pitchType: BaseballPitchType;
  target: Vec2;
  timingQuality: PitchQuality;
}

export interface BatterActionCommand {
  commandId: string;
  expectedRevision: number;
  playId: string;
  batterId: string;
  occurredAt: string;
  action: BatterAction;
}

export type EngineCommandErrorCode =
  | "STALE_REVISION"
  | "GAME_FINISHED"
  | "PLAY_IN_PROGRESS"
  | "NO_ACTIVE_PITCH"
  | "PLAY_ID_MISMATCH"
  | "INVALID_ACTOR"
  | "DUPLICATE_COMMAND"
  | "INVALID_COMMAND";

export type EngineCommandResult =
  | { ok: true; state: BaseballGameState; official?: OfficialPlayResult }
  | { ok: false; state: BaseballGameState; code: EngineCommandErrorCode };

interface ResolvedActionPipeline {
  official: OfficialPlayResult;
  contact: ResolvedContact | null;
  ball: ReturnType<typeof createBattedBall> | null;
  defense: DefenseResolution | null;
  runners: RunnerResolution | null;
  runningPlay: ResolvedRunningPlay | null;
}

function commandFailure(
  state: BaseballGameState,
  code: EngineCommandErrorCode,
): EngineCommandResult {
  return { ok: false, state, code };
}

function isSafeNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function isFinitePoint(value: unknown): value is Vec2 {
  if (!value || typeof value !== "object") return false;
  const point = value as Partial<Vec2>;
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function isCommandId(value: unknown): value is string {
  return typeof value === "string" && COMMAND_ID_PATTERN.test(value);
}

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isValidOccurredAt(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = ISO_UTC_PATTERN.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  if (year < 1 || month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) {
    return false;
  }
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day >= 1 && day <= daysInMonth[month - 1];
}

function isValidStartPitchCommand(command: unknown): command is StartPitchCommand {
  if (!command || typeof command !== "object") return false;
  const value = command as Partial<StartPitchCommand>;
  return isCommandId(value.commandId)
    && isSafeNonNegativeInteger(value.expectedRevision)
    && isCommandId(value.playId)
    && isSafeNonNegativeInteger(value.sequence)
    && isCommandId(value.pitcherId)
    && isBaseballPitchType(value.pitchType)
    && isFinitePoint(value.target)
    && PITCH_QUALITIES.has(value.timingQuality as PitchQuality);
}

function isValidBatterAction(action: unknown): action is BatterAction {
  if (!action || typeof action !== "object") return false;
  const value = action as BatterAction;
  if (value.kind === "TAKE") return isCommandId(value.batterId);
  if (value.kind !== "SWING") return false;
  return Boolean(value.swing)
    && isCommandId(value.swing.batterId)
    && SWING_TYPES.has(value.swing.swingType)
    && isFinitePoint(value.swing.aim)
    && Number.isFinite(value.swing.progress)
    && value.swing.progress >= 0
    && value.swing.progress <= 1.25;
}

function isValidBatterActionCommand(command: unknown): command is BatterActionCommand {
  if (!command || typeof command !== "object") return false;
  const value = command as Partial<BatterActionCommand>;
  return isCommandId(value.commandId)
    && isSafeNonNegativeInteger(value.expectedRevision)
    && isCommandId(value.playId)
    && isCommandId(value.batterId)
    && isValidOccurredAt(value.occurredAt)
    && isValidBatterAction(value.action);
}

function isDuplicatePlay(state: BaseballGameState, playId: string) {
  return state.activePlay?.playId === playId
    || state.lastPlay?.playId === playId
    || state.playByPlay.some((entry) => entry.playId === playId);
}

function isDuplicateCommandId(state: BaseballGameState, commandId: string) {
  return state.activePlay?.startCommandId === commandId
    || state.playByPlay.some(
      (entry) => entry.id === commandId || entry.startCommandId === commandId,
    );
}

function isDuplicateActionCommand(state: BaseballGameState, command: BatterActionCommand) {
  return isDuplicateCommandId(state, command.commandId)
    || state.lastPlay?.playId === command.playId
    || (state.activePlay?.playId === command.playId && state.activePlay.phase === "RESOLVED");
}

function expectedPitchSequence(state: BaseballGameState) {
  return state.teams.reduce((total, team) => total + team.pitcher.pitchCount, 0) + 1;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function pitchStaminaCost(pitchType: BaseballPitchType) {
  switch (pitchType) {
    case "fourSeam":
    case "twoSeam":
      return 0.46;
    case "fork":
    case "curve":
      return 0.54;
    default:
      return 0.5;
  }
}

function getDefenders(state: BaseballGameState): BaseballPlayer[] {
  const fielding = getFieldingTeam(state);
  const ids = [...fielding.lineupPlayerIds, fielding.pitcher.playerId];
  const defenders: BaseballPlayer[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    const player = getBaseballPlayer(id);
    if (player && player.position !== "DH") {
      defenders.push(player);
      seen.add(id);
    }
  }
  return defenders;
}

function makeWalkAdvance(
  runner: BaseRunner | BaseballPlayer,
  fromBase: 0 | 1 | 2 | 3,
  toBase: 1 | 2 | 3 | 4,
): RunnerAdvance {
  const playerId = "playerId" in runner ? runner.playerId : runner.id;
  return {
    runnerId: playerId,
    runnerName: runner.name,
    fromBase,
    toBase,
    result: toBase === 4 ? "SCORE" : "SAFE",
    startedAtMs: 0,
    arrivedAtMs: 900 + (toBase - fromBase) * 500,
    isForce: true,
  };
}

function settledRunner(runner: BaseRunner, currentBase: 1 | 2 | 3): BaseRunner {
  return {
    playerId: runner.playerId,
    name: runner.name,
    speed: runner.speed,
    currentBase,
  };
}

function resolveWalk(
  state: BaseballGameState,
  batter: BaseballPlayer,
): RunnerResolution {
  const nextBases = cloneBases(state.bases);
  const advances: RunnerAdvance[] = [];
  const scoredRunnerIds: string[] = [];

  if (state.bases.first) {
    if (state.bases.second) {
      if (state.bases.third) {
        advances.push(makeWalkAdvance(state.bases.third, 3, 4));
        scoredRunnerIds.push(state.bases.third.playerId);
        nextBases.third = null;
      }
      advances.push(makeWalkAdvance(state.bases.second, 2, 3));
      nextBases.third = settledRunner(state.bases.second, 3);
      nextBases.second = null;
    }
    advances.push(makeWalkAdvance(state.bases.first, 1, 2));
    nextBases.second = settledRunner(state.bases.first, 2);
  }

  advances.push(makeWalkAdvance(batter, 0, 1));
  nextBases.first = createRunner(batter, 1);
  return {
    advances,
    nextBases,
    scoredRunnerIds,
    outRunnerIds: [],
    runsScored: scoredRunnerIds.length,
    outsRecorded: 0,
  };
}

function fielderIds(defense: DefenseResolution | null) {
  if (!defense) return [];
  return [...new Set([
    ...(defense.primaryFielderId ? [defense.primaryFielderId] : []),
    ...defense.assistingFielderIds,
  ])];
}

function horizontalResult(
  ball: ReturnType<typeof createBattedBall>,
  left: BaseballPlayResultCode,
  center: BaseballPlayResultCode,
  right: BaseballPlayResultCode,
): BaseballPlayResultCode {
  if (ball.horizontalAngle < -10) return left;
  if (ball.horizontalAngle > 10) return right;
  return center;
}

function mapRunningResult(
  running: ResolvedRunningPlay,
  ball: ReturnType<typeof createBattedBall>,
): BaseballPlayResultCode {
  switch (running.kind) {
    case "HOME_RUN":
      return horizontalResult(ball, "HOME_RUN_LEFT", "HOME_RUN_CENTER", "HOME_RUN_RIGHT");
    case "ERROR":
      return "ERROR";
    case "DOUBLE_PLAY":
      return "DOUBLE_PLAY";
    case "FIELDER_CHOICE":
      return "FIELDER_CHOICE";
    case "GROUND_OUT":
      switch (running.defense.primaryPosition) {
        case "2B": return "GROUND_OUT_2B";
        case "SS": return "GROUND_OUT_SS";
        case "3B": return "GROUND_OUT_3B";
        default: return "GROUND_OUT_1B";
      }
    case "CATCH_OUT":
      if (running.sacrificeFly) return "SAC_FLY";
      if (ball.type === "LINER") return "LINE_OUT";
      if (ball.type === "POPUP") return "POP_OUT";
      if (ball.zone === "LF" || ball.zone === "LCF") return "FLY_OUT_LF";
      if (ball.zone === "RF" || ball.zone === "RCF") return "FLY_OUT_RF";
      return "FLY_OUT_CF";
    case "HIT":
      if (running.hitValue === 3) return "TRIPLE";
      if (running.hitValue === 2) {
        return horizontalResult(ball, "DOUBLE_LEFT", "DOUBLE_CENTER", "DOUBLE_RIGHT");
      }
      if (["1B", "2B", "3B", "SS"].includes(ball.zone)) return "INFIELD_SINGLE";
      return horizontalResult(ball, "SINGLE_LEFT", "SINGLE_CENTER", "SINGLE_RIGHT");
  }
}

function createOfficial(input: {
  playId: string;
  code: BaseballPlayResultCode;
  batterId: string;
  pitcherId: string;
  outsRecorded?: number;
  runsScored?: number;
  hitValue?: 0 | 1 | 2 | 3 | 4;
  rbi?: number;
  scoredRunnerIds?: string[];
  outRunnerIds?: string[];
  fielderIds?: string[];
  errorFielderId?: string | null;
  plateAppearanceEnded?: boolean;
}): OfficialPlayResult {
  return {
    playId: input.playId,
    code: input.code,
    batterId: input.batterId,
    pitcherId: input.pitcherId,
    outsRecorded: input.outsRecorded ?? 0,
    runsScored: input.runsScored ?? 0,
    hitValue: input.hitValue ?? 0,
    rbi: input.rbi ?? 0,
    scoredRunnerIds: [...(input.scoredRunnerIds ?? [])],
    outRunnerIds: [...(input.outRunnerIds ?? [])],
    fielderIds: [...(input.fielderIds ?? [])],
    errorFielderId: input.errorFielderId ?? null,
    plateAppearanceEnded: input.plateAppearanceEnded ?? false,
  };
}

function resolveActionPipeline(
  state: BaseballGameState,
  command: BatterActionCommand,
): ResolvedActionPipeline {
  const active = state.activePlay;
  if (!active?.pitch) throw new Error("No active pitch.");
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);
  const action = resolveBatterAction({
    pitch: active.pitch,
    batter,
    pitcher,
    count: state.count,
    action: command.action,
    seed: active.seed,
  });

  if (action.kind === "TAKE") {
    const thirdStrike = action.take.result === "CALLED_STRIKE" && state.count.strikes === 2;
    const fourthBall = action.take.result === "BALL" && state.count.balls === 3;
    const runners = fourthBall ? resolveWalk(state, batter) : null;
    return {
      official: createOfficial({
        playId: command.playId,
        code: thirdStrike
          ? "STRIKEOUT_LOOKING"
          : fourthBall
            ? "WALK"
            : action.take.result,
        batterId: batter.id,
        pitcherId: pitcher.id,
        outsRecorded: thirdStrike ? 1 : 0,
        runsScored: runners?.runsScored ?? 0,
        rbi: runners?.runsScored ?? 0,
        scoredRunnerIds: runners?.scoredRunnerIds ?? [],
        outRunnerIds: thirdStrike ? [batter.id] : [],
        plateAppearanceEnded: thirdStrike || fourthBall,
      }),
      contact: null,
      ball: null,
      defense: null,
      runners,
      runningPlay: null,
    };
  }

  const contact = action.contact;
  if (contact.result === "MISS") {
    const thirdStrike = state.count.strikes === 2;
    return {
      official: createOfficial({
        playId: command.playId,
        code: thirdStrike ? "STRIKEOUT_SWINGING" : "SWINGING_STRIKE",
        batterId: batter.id,
        pitcherId: pitcher.id,
        outsRecorded: thirdStrike ? 1 : 0,
        outRunnerIds: thirdStrike ? [batter.id] : [],
        plateAppearanceEnded: thirdStrike,
      }),
      contact,
      ball: null,
      defense: null,
      runners: null,
      runningPlay: null,
    };
  }

  if (contact.result === "FOUL") {
    return {
      official: createOfficial({
        playId: command.playId,
        code: "FOUL",
        batterId: batter.id,
        pitcherId: pitcher.id,
      }),
      contact,
      ball: null,
      defense: null,
      runners: null,
      runningPlay: null,
    };
  }

  const ball = createBattedBall({
    pitch: active.pitch,
    contact,
    batter,
    seed: active.seed,
  });
  if (!ball.fair) {
    return {
      official: createOfficial({
        playId: command.playId,
        code: "FOUL",
        batterId: batter.id,
        pitcherId: pitcher.id,
      }),
      contact,
      ball,
      defense: null,
      runners: null,
      runningPlay: null,
    };
  }

  const defenders = getDefenders(state);
  const opportunity = resolveDefenseOpportunity({
    ball,
    defenders,
    seed: active.seed,
  });
  const runningPlay = resolveBaseRunning({
    bases: state.bases,
    batter,
    ball,
    defense: opportunity,
    defenders,
    outsBeforePlay: state.count.outs,
    seed: active.seed,
  });
  const code = mapRunningResult(runningPlay, ball);
  const runners = runningPlay.runners;
  const rbi = code === "ERROR" || code === "DOUBLE_PLAY" ? 0 : runners.runsScored;
  return {
    official: createOfficial({
      playId: command.playId,
      code,
      batterId: batter.id,
      pitcherId: pitcher.id,
      outsRecorded: runners.outsRecorded,
      runsScored: runners.runsScored,
      hitValue: runningPlay.hitValue,
      rbi,
      scoredRunnerIds: runners.scoredRunnerIds,
      outRunnerIds: runners.outRunnerIds,
      fielderIds: fielderIds(runningPlay.defense),
      errorFielderId: runningPlay.errorFielderId,
      plateAppearanceEnded: true,
    }),
    contact,
    ball,
    defense: runningPlay.defense,
    runners,
    runningPlay,
  };
}

function trimNonHomeRunWalkOff(
  state: BaseballGameState,
  pipeline: ResolvedActionPipeline,
): ResolvedActionPipeline {
  if (
    state.inning < REGULATION_INNINGS
    || state.half !== "bottom"
    || state.battingTeam !== 1
    || pipeline.official.runsScored === 0
    || pipeline.runningPlay?.kind === "HOME_RUN"
  ) {
    return pipeline;
  }
  const needed = state.teams[0].runs - state.teams[1].runs + 1;
  if (needed <= 0 || pipeline.official.runsScored < needed) return pipeline;
  const scoredRunnerIds = pipeline.official.scoredRunnerIds.slice(0, needed);
  const scoredSet = new Set(scoredRunnerIds);
  const runners = pipeline.runners
    ? {
        ...pipeline.runners,
        advances: pipeline.runners.advances.filter(
          (advance) => advance.result !== "SCORE" || scoredSet.has(advance.runnerId),
        ),
        scoredRunnerIds,
        runsScored: scoredRunnerIds.length,
      }
    : null;
  return {
    ...pipeline,
    official: {
      ...pipeline.official,
      runsScored: scoredRunnerIds.length,
      scoredRunnerIds,
      rbi: Math.min(pipeline.official.rbi, scoredRunnerIds.length),
    },
    runners,
  };
}

function ensureInningSlot(state: BaseballGameState, teamIndex: TeamIndex) {
  const inningIndex = state.inning - 1;
  const innings = state.teams[teamIndex].inningRuns;
  while (innings.length <= inningIndex) innings.push(0);
}

function isStrikeout(code: BaseballPlayResultCode) {
  return code === "STRIKEOUT_LOOKING" || code === "STRIKEOUT_SWINGING";
}

function isHit(code: BaseballPlayResultCode) {
  return code === "SINGLE_LEFT"
    || code === "SINGLE_CENTER"
    || code === "SINGLE_RIGHT"
    || code === "INFIELD_SINGLE"
    || code === "DOUBLE_LEFT"
    || code === "DOUBLE_CENTER"
    || code === "DOUBLE_RIGHT"
    || code === "TRIPLE"
    || code === "HOME_RUN_LEFT"
    || code === "HOME_RUN_CENTER"
    || code === "HOME_RUN_RIGHT";
}

function applyPitcherConfidence(
  state: BaseballGameState,
  fieldingTeamIndex: TeamIndex,
  official: OfficialPlayResult,
) {
  const pitcher = state.teams[fieldingTeamIndex].pitcher;
  let change = 0;
  if (isStrikeout(official.code)) change = 1.8;
  else if (official.outsRecorded > 0) change = 0.7 * official.outsRecorded;
  else if (official.code === "CALLED_STRIKE" || official.code === "SWINGING_STRIKE") change = 0.25;
  else if (official.code === "BALL") change = -0.2;
  if (official.hitValue > 0) change -= 1.1 + official.hitValue * 0.25;
  change -= official.runsScored * 0.8;
  pitcher.confidence = round(clamp(pitcher.confidence + change, 0, 100));
}

function applyPlateStats(
  state: BaseballGameState,
  battingTeamIndex: TeamIndex,
  official: OfficialPlayResult,
) {
  if (!official.plateAppearanceEnded) return;
  const batting = state.teams[battingTeamIndex];
  const fieldingTeamIndex: TeamIndex = battingTeamIndex === 0 ? 1 : 0;
  const fielding = state.teams[fieldingTeamIndex];
  const batterStats = batting.batterStats[official.batterId]
    ?? (batting.batterStats[official.batterId] = createEmptyBatterStats());
  const pitcherStats = fielding.pitcherStats[official.pitcherId]
    ?? (fielding.pitcherStats[official.pitcherId] = createEmptyPitcherStats());

  batterStats.pa += 1;
  if (official.code !== "WALK" && official.code !== "SAC_FLY") batterStats.ab += 1;
  if (isHit(official.code)) {
    batterStats.h += 1;
    batting.hits += 1;
    pitcherStats.hitsAllowed += 1;
  }
  if (official.hitValue === 2) batterStats.doubles += 1;
  if (official.hitValue === 3) batterStats.triples += 1;
  if (official.hitValue === 4) batterStats.hr += 1;
  if (official.code === "WALK") {
    batterStats.bb += 1;
    pitcherStats.walks += 1;
  }
  if (isStrikeout(official.code)) {
    batterStats.so += 1;
    pitcherStats.strikeouts += 1;
  }
  batterStats.rbi += official.rbi;
  for (const runnerId of official.scoredRunnerIds) {
    const runnerStats = batting.batterStats[runnerId];
    if (runnerStats) runnerStats.r += 1;
  }

  pitcherStats.outsRecorded += official.outsRecorded;
  pitcherStats.runsAllowed += official.runsScored;
  if (official.code !== "ERROR") pitcherStats.earnedRuns += official.runsScored;
  if (official.errorFielderId) fielding.errors += 1;
}

function applyRunsAndBases(
  state: BaseballGameState,
  battingTeamIndex: TeamIndex,
  official: OfficialPlayResult,
  runners: RunnerResolution | null,
) {
  if (runners) state.bases = cloneBases(runners.nextBases);
  if (official.runsScored === 0) return;
  ensureInningSlot(state, battingTeamIndex);
  state.teams[battingTeamIndex].runs += official.runsScored;
  state.teams[battingTeamIndex].inningRuns[state.inning - 1] += official.runsScored;
}

function finishOrChangeSides(
  state: BaseballGameState,
  walkOff: boolean,
) {
  if (walkOff) {
    state.status = "finished";
    state.winner = 1;
    state.count.balls = 0;
    state.count.strikes = 0;
    return;
  }
  if (state.count.outs < 3) return;

  state.count = { balls: 0, strikes: 0, outs: 0 };
  state.bases = { first: null, second: null, third: null };
  if (state.half === "top") {
    if (
      state.inning >= REGULATION_INNINGS
      && state.teams[1].runs > state.teams[0].runs
    ) {
      state.status = "finished";
      state.winner = 1;
      return;
    }
    state.half = "bottom";
    state.battingTeam = 1;
    ensureInningSlot(state, 1);
    return;
  }

  if (state.inning >= REGULATION_INNINGS && state.teams[0].runs !== state.teams[1].runs) {
    state.status = "finished";
    state.winner = state.teams[0].runs > state.teams[1].runs ? 0 : 1;
    return;
  }
  state.inning += 1;
  state.half = "top";
  state.battingTeam = 0;
  ensureInningSlot(state, 0);
}

export function startPitch(
  state: BaseballGameState,
  command: StartPitchCommand,
): EngineCommandResult {
  if (!isValidStartPitchCommand(command)) return commandFailure(state, "INVALID_COMMAND");
  if (isDuplicateCommandId(state, command.commandId)) {
    return commandFailure(state, "DUPLICATE_COMMAND");
  }
  if (isDuplicatePlay(state, command.playId)) return commandFailure(state, "DUPLICATE_COMMAND");
  if (command.expectedRevision !== state.revision) return commandFailure(state, "STALE_REVISION");
  if (command.sequence !== expectedPitchSequence(state)) {
    return commandFailure(state, "INVALID_COMMAND");
  }
  if (state.status === "finished") return commandFailure(state, "GAME_FINISHED");
  if (state.activePlay && state.activePlay.phase !== "RESOLVED") {
    return commandFailure(state, "PLAY_IN_PROGRESS");
  }

  let batter: BaseballPlayer;
  let pitcher: BaseballPlayer;
  try {
    batter = getCurrentBatter(state);
    pitcher = getCurrentPitcher(state);
  } catch {
    return commandFailure(state, "INVALID_COMMAND");
  }
  if (command.pitcherId !== pitcher.id) return commandFailure(state, "INVALID_ACTOR");

  const playSeed = deriveSeed(state.seed, "official-play-v2", command.sequence, command.playId);
  let pitch;
  try {
    pitch = resolvePitch({
      seed: playSeed,
      sequence: command.sequence,
      pitcher,
      pitcherState: getFieldingTeam(state).pitcher,
      pitchType: command.pitchType,
      intendedTarget: command.target,
      timingQuality: command.timingQuality,
    });
  } catch {
    return commandFailure(state, "INVALID_COMMAND");
  }

  const next = cloneGameState(state);
  const fielding = getFieldingTeam(next);
  const pitcherStats = fielding.pitcherStats[pitcher.id]
    ?? (fielding.pitcherStats[pitcher.id] = createEmptyPitcherStats());
  fielding.pitcher.pitchCount += 1;
  fielding.pitcher.stamina = round(clamp(
    fielding.pitcher.stamina - pitchStaminaCost(command.pitchType),
    0,
    100,
  ));
  pitcherStats.pitches += 1;
  next.activePlay = {
    playId: command.playId,
    startCommandId: command.commandId,
    sequence: command.sequence,
    seed: playSeed,
    phase: "AWAITING_BATTER",
    batterId: batter.id,
    pitcherId: pitcher.id,
    pitch,
    contact: null,
    battedBall: null,
    defense: null,
    runners: null,
    visualEvents: [],
  };
  next.revision += 1;
  return { ok: true, state: next };
}

export function executeBatterAction(
  state: BaseballGameState,
  command: BatterActionCommand,
): EngineCommandResult {
  if (!isValidBatterActionCommand(command)) return commandFailure(state, "INVALID_COMMAND");
  if (isDuplicateActionCommand(state, command)) return commandFailure(state, "DUPLICATE_COMMAND");
  if (command.expectedRevision !== state.revision) return commandFailure(state, "STALE_REVISION");
  if (state.status === "finished") return commandFailure(state, "GAME_FINISHED");
  if (!state.activePlay?.pitch) return commandFailure(state, "NO_ACTIVE_PITCH");
  if (state.activePlay.playId !== command.playId) {
    return commandFailure(state, "PLAY_ID_MISMATCH");
  }
  if (state.activePlay.phase !== "AWAITING_BATTER") {
    return commandFailure(state, "NO_ACTIVE_PITCH");
  }

  let batter: BaseballPlayer;
  try {
    batter = getCurrentBatter(state);
  } catch {
    return commandFailure(state, "INVALID_COMMAND");
  }
  const actionBatterId = command.action.kind === "TAKE"
    ? command.action.batterId
    : command.action.swing.batterId;
  if (
    command.batterId !== batter.id
    || state.activePlay.batterId !== batter.id
    || actionBatterId !== batter.id
  ) {
    return commandFailure(state, "INVALID_ACTOR");
  }

  let pipeline: ResolvedActionPipeline;
  try {
    pipeline = trimNonHomeRunWalkOff(state, resolveActionPipeline(state, command));
  } catch {
    return commandFailure(state, "INVALID_COMMAND");
  }

  const official = pipeline.official;
  const next = cloneGameState(state);
  const battingTeamIndex = state.battingTeam;
  const fieldingTeamIndex: TeamIndex = battingTeamIndex === 0 ? 1 : 0;
  applyRunsAndBases(next, battingTeamIndex, official, pipeline.runners);
  applyPlateStats(next, battingTeamIndex, official);
  applyPitcherConfidence(next, fieldingTeamIndex, official);

  if (!official.plateAppearanceEnded) {
    if (official.code === "BALL") next.count.balls += 1;
    else if (official.code === "FOUL") next.count.strikes = Math.min(2, next.count.strikes + 1);
    else next.count.strikes += 1;
  } else {
    next.count.balls = 0;
    next.count.strikes = 0;
    next.count.outs += official.outsRecorded;
    advanceBattingOrder(next, battingTeamIndex);
  }

  const walkOff = next.inning >= REGULATION_INNINGS
    && next.half === "bottom"
    && battingTeamIndex === 1
    && official.runsScored > 0
    && next.teams[1].runs > next.teams[0].runs;
  const previousInning = next.inning;
  const previousHalf = next.half;
  finishOrChangeSides(next, walkOff);

  next.lastPlay = { ...official };
  next.playByPlay.push(createBaseballPlayByPlayEntryV2({
    stateBefore: state,
    stateAfter: next,
    commandId: command.commandId,
    occurredAt: command.occurredAt,
    official,
  }));
  const visualEvents = buildPlayVisualEvents({
    playId: command.playId,
    official,
    contact: pipeline.contact,
    ball: pipeline.ball,
    defense: pipeline.defense,
    runners: pipeline.runners,
    gameEnded: next.status === "finished",
    sideChanged: next.inning !== previousInning || next.half !== previousHalf,
  });
  next.activePlay = {
    ...next.activePlay!,
    phase: "RESOLVED",
    contact: pipeline.contact,
    battedBall: pipeline.ball,
    defense: pipeline.defense,
    runners: pipeline.runners,
    visualEvents,
  };
  next.revision += 1;
  return { ok: true, state: next, official };
}
