import {
  compressedRunnerElapsedMs,
  projectBattedBallToCamera,
  projectRunnerAdvanceToCamera,
  runnerAdvanceTerminalTimeMs,
  runnerDiamondLayoutForCamera,
  type RunnerPresentationStatus,
} from "../../../../utils/games/baseball/presentation.ts";
import type {
  BaseballCameraMode,
  BaseballGameState,
  BaseballPlayResultCode,
  BattedBall,
  DefenseResolution,
  OfficialPlayResult,
  RunnerAdvance,
  RunnerDestination,
  VisualEvent,
} from "../../../../utils/games/baseball/types.ts";

export interface BaseballPresentationPointV2 {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  rotationDeg?: number;
}

export interface BaseballRunnerPresentationV2 {
  playerId: string;
  name: string;
  point: BaseballPresentationPointV2;
  assetSrc?: string;
  baseLabel?: string;
  status?: RunnerPresentationStatus;
  facing?: "LEFT" | "RIGHT";
}

export type BaseballFielderPhaseV2 =
  | "APPROACH"
  | "SECURE"
  | "THROW"
  | "MISS"
  | "SETTLED";

export interface BaseballFielderPresentationV2 {
  playerId: string;
  name: string;
  positionLabel: string;
  point: BaseballPresentationPointV2;
  phase: BaseballFielderPhaseV2;
  resultLabel: string;
  assetSrc?: string;
  facing?: "LEFT" | "RIGHT";
}

export interface BaseballDefenseThrowPresentationV2 {
  body: BaseballPresentationPointV2;
  trail: readonly BaseballPresentationPointV2[];
  targetBase: RunnerDestination;
  throwStartedAtMs: number;
  throwArrivalTimeMs: number;
  elapsedMs: number;
}

export type BaseballVisualEventToneV2 =
  | "neutral"
  | "strike"
  | "out"
  | "hit"
  | "score"
  | "home-run";

export interface BaseballVisualEventCopyV2 {
  title: string;
  detail: string;
  tone: BaseballVisualEventToneV2;
}

const HOME_RUN_CODES = new Set<BaseballPlayResultCode>([
  "HOME_RUN_LEFT",
  "HOME_RUN_CENTER",
  "HOME_RUN_RIGHT",
]);

const HIT_CODES = new Set<BaseballPlayResultCode>([
  "SINGLE_LEFT",
  "SINGLE_CENTER",
  "SINGLE_RIGHT",
  "INFIELD_SINGLE",
  "DOUBLE_LEFT",
  "DOUBLE_CENTER",
  "DOUBLE_RIGHT",
  "TRIPLE",
  ...HOME_RUN_CODES,
]);

const OUT_CODES = new Set<BaseballPlayResultCode>([
  "STRIKEOUT_LOOKING",
  "STRIKEOUT_SWINGING",
  "GROUND_OUT_1B",
  "GROUND_OUT_2B",
  "GROUND_OUT_SS",
  "GROUND_OUT_3B",
  "FLY_OUT_LF",
  "FLY_OUT_CF",
  "FLY_OUT_RF",
  "LINE_OUT",
  "POP_OUT",
  "DOUBLE_PLAY",
  "FIELDER_CHOICE",
  "SAC_FLY",
]);

export const BASEBALL_RESULT_LABELS_V2: Readonly<Record<BaseballPlayResultCode, string>> = {
  BALL: "볼",
  CALLED_STRIKE: "스트라이크",
  SWINGING_STRIKE: "헛스윙 스트라이크",
  FOUL: "파울",
  WALK: "볼넷",
  STRIKEOUT_LOOKING: "루킹 삼진",
  STRIKEOUT_SWINGING: "헛스윙 삼진",
  GROUND_OUT_1B: "1루수 땅볼 아웃",
  GROUND_OUT_2B: "2루수 땅볼 아웃",
  GROUND_OUT_SS: "유격수 땅볼 아웃",
  GROUND_OUT_3B: "3루수 땅볼 아웃",
  FLY_OUT_LF: "좌익수 플라이 아웃",
  FLY_OUT_CF: "중견수 플라이 아웃",
  FLY_OUT_RF: "우익수 플라이 아웃",
  LINE_OUT: "직선타 아웃",
  POP_OUT: "뜬공 아웃",
  SINGLE_LEFT: "좌전 안타",
  SINGLE_CENTER: "중전 안타",
  SINGLE_RIGHT: "우전 안타",
  INFIELD_SINGLE: "내야 안타",
  DOUBLE_LEFT: "좌중간 2루타",
  DOUBLE_CENTER: "중앙 2루타",
  DOUBLE_RIGHT: "우중간 2루타",
  TRIPLE: "3루타",
  HOME_RUN_LEFT: "좌월 홈런!",
  HOME_RUN_CENTER: "중월 홈런!",
  HOME_RUN_RIGHT: "우월 홈런!",
  DOUBLE_PLAY: "병살타",
  FIELDER_CHOICE: "야수 선택",
  SAC_FLY: "희생 플라이",
  ERROR: "수비 실책",
};

const POSITION_LABELS = {
  P: "투수",
  C: "포수",
  "1B": "1루수",
  "2B": "2루수",
  "3B": "3루수",
  SS: "유격수",
  LF: "좌익수",
  CF: "중견수",
  RF: "우익수",
} as const;

const ACTIVE_RUNNER_EVENT_KINDS = new Set(["RUNNER_ADVANCE", "RUN_SCORE"]);

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function isBaseballHomeRunResultV2(code: BaseballPlayResultCode | undefined) {
  return code !== undefined && HOME_RUN_CODES.has(code);
}

export function baseballVisualEventToneV2(
  official: OfficialPlayResult | null,
): BaseballVisualEventToneV2 {
  if (!official) return "neutral";
  if (HOME_RUN_CODES.has(official.code)) return "home-run";
  if (official.runsScored > 0) return "score";
  if (HIT_CODES.has(official.code) || official.code === "ERROR") return "hit";
  if (OUT_CODES.has(official.code)) return "out";
  if (["CALLED_STRIKE", "SWINGING_STRIKE", "FOUL"].includes(official.code)) return "strike";
  return "neutral";
}

export function createBaseballVisualEventCopyV2(
  event: VisualEvent,
  official: OfficialPlayResult | null,
  game: BaseballGameState,
): BaseballVisualEventCopyV2 {
  const resultLabel = official ? BASEBALL_RESULT_LABELS_V2[official.code] : "플레이 진행";
  const lastLog = game.playByPlay[game.playByPlay.length - 1]?.message ?? resultLabel;
  const tone = baseballVisualEventToneV2(official);

  switch (event.kind) {
    case "CONTACT":
      return { title: "타격!", detail: "배트와 공이 만났습니다.", tone };
    case "BALL_FLIGHT":
      return { title: "타구 추적", detail: "실제 타구 궤적을 추적하고 있습니다.", tone };
    case "FIELD_RESULT":
      return { title: resultLabel, detail: "포구와 송구 판정을 재생합니다.", tone };
    case "RUNNER_ADVANCE":
      return { title: "주자 진루", detail: "주자와 송구의 도착 시각을 비교합니다.", tone };
    case "RUN_SCORE":
      return {
        title: `${official?.runsScored ?? 0}점 득점!`,
        detail: "주자가 홈플레이트를 밟았습니다.",
        tone: isBaseballHomeRunResultV2(official?.code) ? "home-run" : "score",
      };
    case "SCOREBOARD_UPDATE":
      return {
        title: `${game.teams[0].runs} : ${game.teams[1].runs}`,
        detail: "공식 점수와 아웃 카운트를 반영했습니다.",
        tone,
      };
    case "PLAY_RESULT":
      return { title: resultLabel, detail: lastLog, tone };
    case "NEXT_BATTER":
      return { title: "다음 타자", detail: "다음 투타 대결을 준비합니다.", tone: "neutral" };
  }
}

function staticRunnerPresentations(
  game: BaseballGameState,
  camera: BaseballCameraMode,
  runnerAssetSrc?: string,
): BaseballRunnerPresentationV2[] {
  const layout = runnerDiamondLayoutForCamera(camera);
  const bases = [
    { runner: game.bases.first, point: layout.first, label: "1루" },
    { runner: game.bases.second, point: layout.second, label: "2루" },
    { runner: game.bases.third, point: layout.third, label: "3루" },
  ];
  return bases.flatMap(({ runner, point, label }) => runner ? [{
    playerId: runner.playerId,
    name: runner.name,
    point: {
      x: point.xPercent,
      y: point.yPercent,
      scale: 0.84,
      opacity: 1,
    },
    assetSrc: runnerAssetSrc,
    baseLabel: label,
    status: "SAFE" as const,
  }] : []);
}

function preAdvanceRunnerPresentations(
  authoritativeGame: BaseballGameState,
  presentationGame: BaseballGameState,
  camera: BaseballCameraMode,
  runnerAssetSrc?: string,
) {
  const resolution = authoritativeGame.activePlay?.runners;
  if (!resolution) {
    return staticRunnerPresentations(presentationGame, camera, runnerAssetSrc);
  }

  const movingRunnerIds = new Set(
    resolution.advances.map((advance) => advance.runnerId),
  );
  const layout = runnerDiamondLayoutForCamera(camera);
  const settled = staticRunnerPresentations(
    {
      ...presentationGame,
      bases: {
        first: presentationGame.bases.first
          && !movingRunnerIds.has(presentationGame.bases.first.playerId)
          ? presentationGame.bases.first
          : null,
        second: presentationGame.bases.second
          && !movingRunnerIds.has(presentationGame.bases.second.playerId)
          ? presentationGame.bases.second
          : null,
        third: presentationGame.bases.third
          && !movingRunnerIds.has(presentationGame.bases.third.playerId)
          ? presentationGame.bases.third
          : null,
      },
    },
    camera,
    runnerAssetSrc,
  );
  const sourceRunners = resolution.advances.flatMap((advance) => {
    if (advance.fromBase === 0) return [];
    const point = advance.fromBase === 1
      ? layout.first
      : advance.fromBase === 2
        ? layout.second
        : layout.third;
    return [{
      playerId: advance.runnerId,
      name: advance.runnerName,
      point: {
        x: point.xPercent,
        y: point.yPercent,
        scale: 0.84,
        opacity: 1,
      },
      assetSrc: runnerAssetSrc,
      baseLabel: `${advance.fromBase}루`,
      status: "WAITING" as const,
    }];
  });
  return [...settled, ...sourceRunners];
}

function advancesForEvent(
  advances: readonly RunnerAdvance[],
  event: VisualEvent,
) {
  const moving = advances.filter((advance) => advance.result !== "HOLD");
  if (event.kind === "RUN_SCORE") {
    return moving.filter((advance) => advance.result === "SCORE");
  }
  if (event.camera === "FIRST_BASE_LINE") {
    const focused = moving.filter((advance) => advance.toBase === 1);
    return focused.length > 0 ? focused : moving;
  }
  if (event.camera === "THIRD_BASE_LINE") {
    const focused = moving.filter((advance) => advance.toBase === 3);
    return focused.length > 0 ? focused : moving;
  }
  return moving;
}

function runnerStatusLabel(
  sample: ReturnType<typeof projectRunnerAdvanceToCamera>,
) {
  const destination = sample.toBase === 4 ? "홈" : `${sample.toBase}루`;
  if (sample.status === "OUT") return "아웃";
  if (sample.status === "SCORE") return "득점";
  if (sample.status === "SAFE") return `세이프 · ${destination}`;
  const origin = sample.fromBase === 0 ? "타석" : `${sample.fromBase}루`;
  return `${origin} → ${destination}`;
}

function runnerFacing(
  advance: RunnerAdvance,
  elapsedMs: number,
  camera: BaseballCameraMode,
): "LEFT" | "RIGHT" {
  const terminalTimeMs = runnerAdvanceTerminalTimeMs(advance);
  const beforeMs = Math.max(advance.startedAtMs, elapsedMs - 12);
  const afterMs = Math.min(terminalTimeMs, elapsedMs + 12);
  const before = projectRunnerAdvanceToCamera(advance, beforeMs, camera).position;
  const after = projectRunnerAdvanceToCamera(advance, afterMs, camera).position;
  if (Math.abs(after.xPercent - before.xPercent) < 0.01) {
    return advance.toBase === 2 || advance.toBase === 3 ? "LEFT" : "RIGHT";
  }
  return after.xPercent < before.xPercent ? "LEFT" : "RIGHT";
}

export interface CreateBaseballRunnerPresentationsV2Input {
  authoritativeGame: BaseballGameState;
  presentationGame: BaseballGameState;
  event: VisualEvent | null;
  eventProgress: number;
  cameraMode: BaseballCameraMode;
  runnerAssetSrc?: string;
}

/** Builds camera-calibrated static or authoritative in-motion runner sprites. */
export function createBaseballRunnerPresentationsV2({
  authoritativeGame,
  presentationGame,
  event,
  eventProgress,
  cameraMode,
  runnerAssetSrc,
}: CreateBaseballRunnerPresentationsV2Input): BaseballRunnerPresentationV2[] {
  const resolution = authoritativeGame.activePlay?.runners;
  if (!event || !resolution || !ACTIVE_RUNNER_EVENT_KINDS.has(event.kind)) {
    if (event && ["CONTACT", "BALL_FLIGHT", "FIELD_RESULT"].includes(event.kind)) {
      return preAdvanceRunnerPresentations(
        authoritativeGame,
        presentationGame,
        cameraMode,
        runnerAssetSrc,
      );
    }
    return staticRunnerPresentations(presentationGame, cameraMode, runnerAssetSrc);
  }

  const progress = clamp(eventProgress, 0, 1);
  const elapsedMs = compressedRunnerElapsedMs(resolution, progress);
  const advances = advancesForEvent(resolution.advances, event);
  return advances.map((advance, index) => {
    let runnerElapsedMs = elapsedMs;
    if (event.kind === "RUN_SCORE") {
      const terminalTimeMs = runnerAdvanceTerminalTimeMs(advance);
      runnerElapsedMs = lerp(
        advance.startedAtMs + (terminalTimeMs - advance.startedAtMs) * 0.66,
        terminalTimeMs,
        progress,
      );
    }
    const sample = projectRunnerAdvanceToCamera(advance, runnerElapsedMs, event.camera);
    const scoreOffset = event.kind === "RUN_SCORE" && advances.length > 1
      ? (index - (advances.length - 1) / 2) * 2.4 * (1 - progress)
      : 0;
    return {
      playerId: sample.runnerId,
      name: advance.runnerName,
      point: {
        x: sample.position.xPercent + scoreOffset,
        y: sample.position.yPercent - Math.abs(scoreOffset) * 0.18,
        scale: event.kind === "RUN_SCORE" ? 1.06 : 0.9,
        opacity: sample.status === "OUT" ? 0.48 : 1,
      },
      assetSrc: runnerAssetSrc,
      baseLabel: runnerStatusLabel(sample),
      status: sample.status,
      facing: runnerFacing(advance, runnerElapsedMs, event.camera),
    };
  });
}

const THROWING_RESULTS = new Set(["GROUND_OUT", "FORCE_OUT", "TAG_OUT"]);
export const BASEBALL_FIELDER_THROW_START_PROGRESS_V2 = 0.58;
export const BASEBALL_FIELDER_THROW_END_PROGRESS_V2 = 0.9;
const BASEBALL_DEFENSE_THROW_TRAIL_COUNT_V2 = 10;

/** Phase order for the dynamic fielding sprite during the field-result event. */
export function baseballFielderPhaseV2(
  defense: DefenseResolution,
  eventProgress: number,
): BaseballFielderPhaseV2 {
  const progress = clamp(eventProgress, 0, 1);
  if (progress < 0.3) return "APPROACH";
  if (["ERROR", "SAFE", "NO_PLAY"].includes(defense.result)) {
    return progress < 0.86 ? "MISS" : "SETTLED";
  }
  if (progress < BASEBALL_FIELDER_THROW_START_PROGRESS_V2) return "SECURE";
  if (THROWING_RESULTS.has(defense.result) && defense.throwArrivalTimeMs !== null) {
    return progress <= BASEBALL_FIELDER_THROW_END_PROGRESS_V2 ? "THROW" : "SETTLED";
  }
  return "SETTLED";
}

function fieldingResultLabel(defense: DefenseResolution) {
  switch (defense.result) {
    case "CATCH": return "캐치";
    case "GROUND_OUT": return "포구 · 1루 송구";
    case "FORCE_OUT": return "포스 아웃 송구";
    case "TAG_OUT": return "태그 아웃";
    case "ERROR": return "수비 실책";
    case "SAFE": return "타구 통과";
    case "NO_PLAY": return "플레이 없음";
  }
}

export interface CreateBaseballFielderPresentationsV2Input {
  game: BaseballGameState;
  event: VisualEvent | null;
  eventProgress: number;
  fielderAssetSrc?: string;
}

function fielderTerminalPoint(
  ball: BattedBall,
  camera: BaseballCameraMode,
) {
  const terminal = projectBattedBallToCamera(ball, 1, camera).position;
  return {
    x: clamp(terminal.xPercent, 12, 88),
    y: clamp(terminal.yPercent + 3, 30, 82),
  };
}

/**
 * Projects one authoritative primary fielder near the terminal ball position.
 * BALL_FLIGHT exposes the late approach; FIELD_RESULT carries secure/throw/miss.
 */
export function createBaseballFielderPresentationsV2({
  game,
  event,
  eventProgress,
  fielderAssetSrc,
}: CreateBaseballFielderPresentationsV2Input): BaseballFielderPresentationV2[] {
  const activePlay = game.activePlay;
  const defense = activePlay?.defense;
  const ball = activePlay?.battedBall;
  if (!event || !defense || !ball || !defense.primaryFielderId) return [];
  if (event.kind !== "BALL_FLIGHT" && event.kind !== "FIELD_RESULT") return [];

  const progress = clamp(eventProgress, 0, 1);
  if (event.kind === "BALL_FLIGHT" && progress < 0.46) return [];
  const terminal = fielderTerminalPoint(ball, event.camera);
  const targetX = terminal.x;
  const targetY = terminal.y;
  const approachProgress = event.kind === "BALL_FLIGHT"
    ? clamp((progress - 0.46) / 0.54, 0, 0.88)
    : lerp(0.88, 1, clamp(progress / 0.3, 0, 1));
  const startX = clamp(targetX + (targetX < 50 ? -10 : 10), 8, 92);
  const startY = clamp(targetY + 7, 30, 88);
  const phase = event.kind === "BALL_FLIGHT"
    ? "APPROACH"
    : baseballFielderPhaseV2(defense, progress);
  const position = defense.primaryPosition;

  return [{
    playerId: defense.primaryFielderId,
    name: position ? POSITION_LABELS[position] : "수비수",
    positionLabel: position ?? "FIELDER",
    point: {
      x: lerp(startX, targetX, approachProgress),
      y: lerp(startY, targetY, approachProgress),
      scale: lerp(0.84, 1, approachProgress),
      opacity: 1,
    },
    phase,
    resultLabel: event.kind === "BALL_FLIGHT" ? "타구 추적" : fieldingResultLabel(defense),
    assetSrc: fielderAssetSrc,
    facing: targetX < startX ? "LEFT" : "RIGHT",
  }];
}

function throwTargetAdvance(game: BaseballGameState, defense: DefenseResolution) {
  const retired = (game.activePlay?.runners?.advances ?? [])
    .filter((advance) => advance.result === "OUT")
    .sort((left, right) => (
      (left.outAtMs ?? left.arrivedAtMs) - (right.outAtMs ?? right.arrivedAtMs)
    ));
  if (defense.result === "GROUND_OUT") {
    return retired.find((advance) => advance.fromBase === 0 && advance.toBase === 1)
      ?? retired.find((advance) => advance.toBase === 1)
      ?? retired[0]
      ?? null;
  }
  return retired[0] ?? null;
}

function fallbackThrowTargetBase(
  defense: DefenseResolution,
  camera: BaseballCameraMode,
): RunnerDestination {
  if (defense.result === "GROUND_OUT") return 1;
  if (camera === "FIRST_BASE_LINE") return 1;
  if (camera === "THIRD_BASE_LINE") return 3;
  if (camera === "RUN_SCORED") return 4;
  return defense.result === "FORCE_OUT" ? 2 : 1;
}

function throwTargetPoint(targetBase: RunnerDestination, camera: BaseballCameraMode) {
  const layout = runnerDiamondLayoutForCamera(camera);
  if (targetBase === 1) return layout.first;
  if (targetBase === 2) return layout.second;
  if (targetBase === 3) return layout.third;
  return layout.home;
}

function throwPoint(
  source: BaseballPresentationPointV2,
  target: { xPercent: number; yPercent: number },
  progress: number,
  rotationDeg: number,
  opacity = 1,
): BaseballPresentationPointV2 {
  return {
    x: lerp(source.x, target.xPercent, progress),
    y: lerp(source.y, target.yPercent, progress),
    scale: lerp(0.56, 0.76, progress),
    opacity,
    rotationDeg,
  };
}

export interface CreateBaseballDefenseThrowPresentationV2Input {
  game: BaseballGameState;
  event: VisualEvent | null;
  eventProgress: number;
}

/**
 * Builds the one clean baseball shown during an authoritative defensive throw.
 * The UI event compresses the canonical fielding timeline, while elapsedMs and
 * the target base remain tied to the resolved defense/runner arrival times.
 */
export function createBaseballDefenseThrowPresentationV2({
  game,
  event,
  eventProgress,
}: CreateBaseballDefenseThrowPresentationV2Input): BaseballDefenseThrowPresentationV2 | null {
  const activePlay = game.activePlay;
  const defense = activePlay?.defense;
  const ball = activePlay?.battedBall;
  if (!event || event.kind !== "FIELD_RESULT" || !defense || !ball) return null;
  if (!THROWING_RESULTS.has(defense.result) || defense.throwArrivalTimeMs === null) return null;

  const progress = clamp(eventProgress, 0, 1);
  if (
    progress < BASEBALL_FIELDER_THROW_START_PROGRESS_V2
    || progress > BASEBALL_FIELDER_THROW_END_PROGRESS_V2
  ) return null;

  const targetAdvance = throwTargetAdvance(game, defense);
  const targetBase = targetAdvance?.toBase ?? fallbackThrowTargetBase(defense, event.camera);
  const runnerOutAtMs = targetAdvance?.outAtMs;
  const throwStartedAtMs = Math.max(
    defense.ballArrivalTimeMs,
    defense.fielderArrivalTimeMs ?? defense.ballArrivalTimeMs,
  );
  const throwArrivalTimeMs = runnerOutAtMs !== undefined && runnerOutAtMs > throwStartedAtMs
    ? runnerOutAtMs
    : defense.throwArrivalTimeMs;
  if (throwArrivalTimeMs <= throwStartedAtMs) return null;

  const throwProgress = (
    progress - BASEBALL_FIELDER_THROW_START_PROGRESS_V2
  ) / (
    BASEBALL_FIELDER_THROW_END_PROGRESS_V2 - BASEBALL_FIELDER_THROW_START_PROGRESS_V2
  );
  const elapsedMs = lerp(throwStartedAtMs, throwArrivalTimeMs, throwProgress);
  const source = fielderTerminalPoint(ball, event.camera);
  const target = throwTargetPoint(targetBase, event.camera);
  const rotationDeg = (elapsedMs - throwStartedAtMs) / 1_000 * 1_080;
  const body = throwPoint(source, target, throwProgress, rotationDeg);
  const trail = Array.from({ length: BASEBALL_DEFENSE_THROW_TRAIL_COUNT_V2 }, (_, index) => {
    const age = (index + 1) / BASEBALL_DEFENSE_THROW_TRAIL_COUNT_V2;
    const sampleProgress = Math.max(0, throwProgress - 0.052 * (index + 1));
    const sampleElapsedMs = lerp(throwStartedAtMs, throwArrivalTimeMs, sampleProgress);
    const movingOpacity = clamp(throwProgress / 0.12, 0, 1);
    return throwPoint(
      source,
      target,
      sampleProgress,
      (sampleElapsedMs - throwStartedAtMs) / 1_000 * 1_080,
      lerp(0.34, 0.035, age) * movingOpacity,
    );
  });

  return {
    body,
    trail,
    targetBase,
    throwStartedAtMs,
    throwArrivalTimeMs,
    elapsedMs,
  };
}
