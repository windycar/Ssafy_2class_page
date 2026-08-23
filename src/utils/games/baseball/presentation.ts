import { cameraForBattedBall } from "./cameraDirector.ts";
import {
  samplePitchFlight,
  type PitchFlightSample,
} from "./pitchEngine.ts";
import type {
  BaseballCameraMode,
  BattedBall,
  BattedBallZone,
  PitchFlightState,
  RunnerAdvance,
  Vec2,
} from "./types.ts";

const PITCH_TRAIL_COUNT = 10;
const DEFAULT_TRAIL_PROGRESS_GAP = 0.036;
const GRAVITY_METERS_PER_SECOND_SQUARED = 9.80665;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function round(value: number, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be finite.`);
  }
}

function normalizeProgress(value: number, label = "progress") {
  assertFinite(value, label);
  return clamp(value, 0, 1);
}

function assertFinitePoint(point: Vec2, label: string) {
  assertFinite(point.x, `${label}.x`);
  assertFinite(point.y, `${label}.y`);
}

export interface StagePoint {
  xPercent: number;
  yPercent: number;
}

export interface PitchStageProjection {
  /** Horizontal stage position occupied by normalized x=0. */
  leftPercent: number;
  /** Vertical stage position occupied by normalized y=0. */
  topPercent: number;
  /** Stage width occupied by one normalized strike-zone unit. */
  widthPercent: number;
  /** Stage height occupied by one normalized strike-zone unit. */
  heightPercent: number;
}

export interface StageRectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const DEFAULT_PITCH_STAGE_PROJECTION: Readonly<PitchStageProjection> = {
  leftPercent: 34,
  topPercent: 26,
  widthPercent: 32,
  heightPercent: 48,
};

/**
 * Converts the rendered strike-zone rectangle into stage-relative percentages.
 * Returning null lets the view safely retry after a hidden or zero-sized layout.
 */
export function derivePitchStageProjection(
  stage: StageRectLike,
  strikeZone: StageRectLike,
): PitchStageProjection | null {
  const values = [
    stage.left,
    stage.top,
    stage.width,
    stage.height,
    strikeZone.left,
    strikeZone.top,
    strikeZone.width,
    strikeZone.height,
  ];
  if (!values.every(Number.isFinite) || stage.width <= 0 || stage.height <= 0) return null;
  if (strikeZone.width <= 0 || strikeZone.height <= 0) return null;

  return {
    leftPercent: (strikeZone.left - stage.left) / stage.width * 100,
    topPercent: (strikeZone.top - stage.top) / stage.height * 100,
    widthPercent: strikeZone.width / stage.width * 100,
    heightPercent: strikeZone.height / stage.height * 100,
  };
}

export interface PitchSpriteSample {
  progress: number;
  perspectiveProgress: number;
  position: StagePoint;
  scale: number;
  rotation: number;
  opacity: number;
}

function validatePitchProjection(projection: PitchStageProjection) {
  assertFinite(projection.leftPercent, "projection.leftPercent");
  assertFinite(projection.topPercent, "projection.topPercent");
  assertFinite(projection.widthPercent, "projection.widthPercent");
  assertFinite(projection.heightPercent, "projection.heightPercent");
  if (projection.widthPercent <= 0 || projection.heightPercent <= 0) {
    throw new RangeError("Pitch projection width and height must be positive.");
  }
}

/** Maps the normalized result of samplePitchFlight into CSS-friendly stage percentages. */
export function projectPitchFlightSample(
  sample: PitchFlightSample,
  projection: PitchStageProjection = DEFAULT_PITCH_STAGE_PROJECTION,
): PitchSpriteSample {
  validatePitchProjection(projection);
  assertFinite(sample.progress, "sample.progress");
  assertFinite(sample.perspectiveProgress, "sample.perspectiveProgress");
  assertFinitePoint(sample.position, "sample.position");
  assertFinite(sample.scale, "sample.scale");
  assertFinite(sample.rotation, "sample.rotation");

  return {
    progress: clamp(sample.progress, 0, 1),
    perspectiveProgress: clamp(sample.perspectiveProgress, 0, 1),
    position: {
      xPercent: round(clamp(
        projection.leftPercent + sample.position.x * projection.widthPercent,
        0,
        100,
      )),
      yPercent: round(clamp(
        projection.topPercent + sample.position.y * projection.heightPercent,
        0,
        100,
      )),
    },
    scale: round(Math.max(0, sample.scale)),
    rotation: round(sample.rotation, 3),
    opacity: 1,
  };
}

export interface PitchVisualFrame {
  /** The only opaque baseball body rendered for this frame. */
  body: PitchSpriteSample;
  /** Exactly ten older trajectory samples, newest first. */
  trails: readonly PitchSpriteSample[];
}

export interface PitchVisualFrameOptions {
  projection?: PitchStageProjection;
  /** Distance between samples in normalized flight progress. */
  trailProgressGap?: number;
}

/**
 * Builds one baseball body and ten deterministic ghosts from the authoritative
 * trajectory. No visual curve is invented: every point comes from samplePitchFlight.
 */
export function createPitchVisualFrame(
  trajectory: PitchFlightState,
  progress: number,
  options: PitchVisualFrameOptions = {},
): PitchVisualFrame {
  const normalized = normalizeProgress(progress);
  const gap = options.trailProgressGap ?? DEFAULT_TRAIL_PROGRESS_GAP;
  assertFinite(gap, "trailProgressGap");
  if (gap <= 0) throw new RangeError("trailProgressGap must be positive.");

  const projection = options.projection ?? DEFAULT_PITCH_STAGE_PROJECTION;
  const body = projectPitchFlightSample(
    samplePitchFlight(trajectory, normalized),
    projection,
  );
  const trails = Array.from({ length: PITCH_TRAIL_COUNT }, (_, index) => {
    const trailProgress = Math.max(0, normalized - gap * (index + 1));
    const projected = projectPitchFlightSample(
      samplePitchFlight(trajectory, trailProgress),
      projection,
    );
    const age = (index + 1) / PITCH_TRAIL_COUNT;
    return {
      ...projected,
      scale: round(projected.scale * lerp(0.9, 0.55, age)),
      opacity: round(lerp(0.48, 0.07, age), 3),
    };
  });

  return { body, trails };
}

interface BattedBallCameraProfile {
  home: StagePoint;
  lateralPercentPerMeter: number;
  depthPercentPerMeter: number;
  heightPercentPerMeter: number;
  baseScale: number;
}

const BALL_CAMERA_PROFILES: Readonly<Record<BaseballCameraMode, BattedBallCameraProfile>> = {
  BATTER: { home: { xPercent: 50, yPercent: 87 }, lateralPercentPerMeter: 0.36, depthPercentPerMeter: 0.34, heightPercentPerMeter: 0.45, baseScale: 0.78 },
  PITCHER: { home: { xPercent: 50, yPercent: 84 }, lateralPercentPerMeter: 0.34, depthPercentPerMeter: 0.32, heightPercentPerMeter: 0.42, baseScale: 0.76 },
  CONTACT: { home: { xPercent: 50, yPercent: 88 }, lateralPercentPerMeter: 0.4, depthPercentPerMeter: 0.38, heightPercentPerMeter: 0.48, baseScale: 0.82 },
  INFIELD: { home: { xPercent: 50, yPercent: 92 }, lateralPercentPerMeter: 0.5, depthPercentPerMeter: 0.58, heightPercentPerMeter: 0.4, baseScale: 0.82 },
  LEFT_FIELD: { home: { xPercent: 72, yPercent: 90 }, lateralPercentPerMeter: 0.37, depthPercentPerMeter: 0.36, heightPercentPerMeter: 0.48, baseScale: 0.76 },
  CENTER_FIELD: { home: { xPercent: 50, yPercent: 92 }, lateralPercentPerMeter: 0.34, depthPercentPerMeter: 0.4, heightPercentPerMeter: 0.5, baseScale: 0.76 },
  RIGHT_FIELD: { home: { xPercent: 28, yPercent: 90 }, lateralPercentPerMeter: 0.37, depthPercentPerMeter: 0.36, heightPercentPerMeter: 0.48, baseScale: 0.76 },
  FOUL: { home: { xPercent: 50, yPercent: 88 }, lateralPercentPerMeter: 0.58, depthPercentPerMeter: 0.27, heightPercentPerMeter: 0.42, baseScale: 0.72 },
  BASE_RUNNING: { home: { xPercent: 50, yPercent: 91 }, lateralPercentPerMeter: 0.29, depthPercentPerMeter: 0.31, heightPercentPerMeter: 0.36, baseScale: 0.72 },
  HOME_RUN: { home: { xPercent: 50, yPercent: 94 }, lateralPercentPerMeter: 0.28, depthPercentPerMeter: 0.32, heightPercentPerMeter: 0.57, baseScale: 0.74 },
  RUN_SCORED: { home: { xPercent: 50, yPercent: 91 }, lateralPercentPerMeter: 0.29, depthPercentPerMeter: 0.31, heightPercentPerMeter: 0.36, baseScale: 0.72 },
  DUGOUT: { home: { xPercent: 50, yPercent: 88 }, lateralPercentPerMeter: 0.31, depthPercentPerMeter: 0.3, heightPercentPerMeter: 0.4, baseScale: 0.72 },
  REPLAY: { home: { xPercent: 50, yPercent: 88 }, lateralPercentPerMeter: 0.38, depthPercentPerMeter: 0.36, heightPercentPerMeter: 0.5, baseScale: 0.8 },
};

const BATTED_BALL_ZONES: ReadonlySet<BattedBallZone> = new Set([
  "LF", "LCF", "CF", "RCF", "RF", "3B", "SS", "2B", "1B", "FOUL_LEFT", "FOUL_RIGHT",
]);

export interface BattedBallScreenSample {
  progress: number;
  elapsedMs: number;
  camera: BaseballCameraMode;
  position: StagePoint;
  scale: number;
  opacity: number;
  rotation: number;
  world: {
    lateralMeters: number;
    depthMeters: number;
    heightMeters: number;
  };
}

function assertBattedBall(ball: BattedBall) {
  for (const [label, value] of [
    ["horizontalAngle", ball.horizontalAngle],
    ["launchAngle", ball.launchAngle],
    ["distance", ball.distance],
    ["hangTime", ball.hangTime],
    ["spin", ball.spin],
  ] as const) {
    assertFinite(value, `ball.${label}`);
  }
  if (ball.distance < 0) throw new RangeError("ball.distance cannot be negative.");
  if (ball.hangTime <= 0) throw new RangeError("ball.hangTime must be positive.");
  if (!BATTED_BALL_ZONES.has(ball.zone)) throw new RangeError(`Unknown batted-ball zone: ${String(ball.zone)}`);
}

function battedBallHeight(ball: BattedBall, progress: number) {
  if (ball.type === "GROUND") {
    return round(Math.sin(Math.PI * progress) * clamp(ball.launchAngle / 18, 0.08, 0.75), 4);
  }

  const hangSeconds = ball.hangTime / 1_000;
  const angleRadians = clamp(ball.launchAngle, 0, 75) * Math.PI / 180;
  const launchContribution = ball.distance * Math.tan(angleRadians) * 0.12;
  const timeContribution = GRAVITY_METERS_PER_SECOND_SQUARED * hangSeconds ** 2 / 10;
  const apexMeters = clamp(launchContribution + timeContribution, 0.8, 48);
  return round(4 * apexMeters * progress * (1 - progress), 4);
}

/** Projects the physical batted-ball result into a selected presentation camera. */
export function projectBattedBallToCamera(
  ball: BattedBall,
  progress: number,
  camera: BaseballCameraMode = cameraForBattedBall(ball),
): BattedBallScreenSample {
  assertBattedBall(ball);
  const normalized = normalizeProgress(progress);
  const profile = BALL_CAMERA_PROFILES[camera];
  if (!profile) throw new RangeError(`Unknown baseball camera: ${String(camera)}`);

  const angleRadians = ball.horizontalAngle * Math.PI / 180;
  const travelProgress = 1 - (1 - normalized) ** 1.06;
  const traveledMeters = ball.distance * travelProgress;
  const lateralMeters = Math.sin(angleRadians) * traveledMeters;
  const depthMeters = Math.max(0, Math.cos(angleRadians) * traveledMeters);
  const heightMeters = battedBallHeight(ball, normalized);
  const elapsedMs = ball.hangTime * normalized;
  const isFoulCamera = camera === "FOUL";

  return {
    progress: normalized,
    elapsedMs: round(elapsedMs, 2),
    camera,
    position: {
      xPercent: round(clamp(
        profile.home.xPercent + lateralMeters * profile.lateralPercentPerMeter,
        1,
        99,
      )),
      yPercent: round(clamp(
        profile.home.yPercent
          - depthMeters * profile.depthPercentPerMeter
          - heightMeters * profile.heightPercentPerMeter,
        1,
        99,
      )),
    },
    scale: round(clamp(
      profile.baseScale + travelProgress * 0.24 + heightMeters / 200,
      0.45,
      1.35,
    )),
    opacity: round(clamp(
      0.86 + Math.sin(Math.PI * normalized) * 0.14 - (isFoulCamera ? normalized ** 4 * 0.22 : 0),
      0.55,
      1,
    ), 3),
    rotation: round(ball.spin / 60 * (elapsedMs / 1_000) * 360, 2),
    world: {
      lateralMeters: round(lateralMeters),
      depthMeters: round(depthMeters),
      heightMeters,
    },
  };
}

export type RunnerPresentationStatus = "WAITING" | "RUNNING" | "SAFE" | "OUT" | "SCORE";

export interface RunnerDiamondLayout {
  home: StagePoint;
  first: StagePoint;
  second: StagePoint;
  third: StagePoint;
}

export const DEFAULT_RUNNER_DIAMOND_LAYOUT: Readonly<RunnerDiamondLayout> = {
  home: { xPercent: 50, yPercent: 88 },
  first: { xPercent: 73, yPercent: 65 },
  second: { xPercent: 50, yPercent: 42 },
  third: { xPercent: 27, yPercent: 65 },
};

export interface RunnerScreenSample {
  runnerId: string;
  progress: number;
  position: StagePoint;
  status: RunnerPresentationStatus;
  fromBase: RunnerAdvance["fromBase"];
  toBase: RunnerAdvance["toBase"];
  currentLeg: 0 | 1 | 2 | 3;
}

function validateRunnerLayout(layout: RunnerDiamondLayout) {
  for (const [label, point] of Object.entries(layout)) {
    assertFinitePoint(
      { x: point.xPercent, y: point.yPercent },
      `layout.${label}`,
    );
  }
}

function routePoint(layout: RunnerDiamondLayout, ordinal: number): StagePoint {
  if (ordinal === 0 || ordinal === 4) return layout.home;
  if (ordinal === 1) return layout.first;
  if (ordinal === 2) return layout.second;
  return layout.third;
}

function runnerRoutePosition(
  advance: RunnerAdvance,
  progress: number,
  layout: RunnerDiamondLayout,
): { position: StagePoint; currentLeg: 0 | 1 | 2 | 3 } {
  const legCount = advance.toBase - advance.fromBase;
  const routeProgress = progress * legCount;
  const legIndex = Math.min(legCount - 1, Math.floor(routeProgress));
  const legProgress = progress === 1 ? 1 : routeProgress - legIndex;
  const fromOrdinal = advance.fromBase + legIndex;
  const toOrdinal = fromOrdinal + 1;
  const start = routePoint(layout, fromOrdinal);
  const end = routePoint(layout, toOrdinal);
  return {
    position: {
      xPercent: round(lerp(start.xPercent, end.xPercent, legProgress)),
      yPercent: round(lerp(start.yPercent, end.yPercent, legProgress)),
    },
    currentLeg: clamp(fromOrdinal, 0, 3) as 0 | 1 | 2 | 3,
  };
}

/** Interpolates a runner along every base touched by an authoritative advance. */
export function projectRunnerAdvance(
  advance: RunnerAdvance,
  elapsedMs: number,
  layout: RunnerDiamondLayout = DEFAULT_RUNNER_DIAMOND_LAYOUT,
): RunnerScreenSample {
  assertFinite(elapsedMs, "elapsedMs");
  assertFinite(advance.startedAtMs, "advance.startedAtMs");
  assertFinite(advance.arrivedAtMs, "advance.arrivedAtMs");
  validateRunnerLayout(layout);
  if (!Number.isInteger(advance.fromBase) || advance.fromBase < 0 || advance.fromBase > 3) {
    throw new RangeError("advance.fromBase must be an integer from 0 through 3.");
  }
  if (!Number.isInteger(advance.toBase) || advance.toBase < 1 || advance.toBase > 4) {
    throw new RangeError("advance.toBase must be an integer from 1 through 4.");
  }
  if (advance.toBase <= advance.fromBase) {
    throw new RangeError("advance.toBase must be after advance.fromBase.");
  }
  if (advance.arrivedAtMs <= advance.startedAtMs) {
    throw new RangeError("advance.arrivedAtMs must be after advance.startedAtMs.");
  }
  if (advance.result === "HOLD") {
    throw new RangeError("HOLD advances do not have a presentation route.");
  }

  let terminalTime = advance.arrivedAtMs;
  if (advance.result === "OUT") {
    if (advance.outAtMs === undefined) {
      throw new RangeError("OUT advances require outAtMs.");
    }
    assertFinite(advance.outAtMs, "advance.outAtMs");
    if (advance.outAtMs < advance.startedAtMs) {
      throw new RangeError("advance.outAtMs cannot precede advance.startedAtMs.");
    }
    terminalTime = advance.outAtMs;
  }

  const sampledTime = Math.min(elapsedMs, terminalTime);
  const progress = clamp(
    (sampledTime - advance.startedAtMs) / (advance.arrivedAtMs - advance.startedAtMs),
    0,
    1,
  );
  const { position, currentLeg } = runnerRoutePosition(advance, progress, layout);
  let status: RunnerPresentationStatus = elapsedMs < advance.startedAtMs ? "WAITING" : "RUNNING";
  if (elapsedMs >= terminalTime) {
    if (advance.result === "OUT") status = "OUT";
    else if (advance.result === "SCORE") status = "SCORE";
    else status = "SAFE";
  }

  return {
    runnerId: advance.runnerId,
    progress: round(progress, 6),
    position,
    status,
    fromBase: advance.fromBase,
    toBase: advance.toBase,
    currentLeg,
  };
}
