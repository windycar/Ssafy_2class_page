import { getPitchDefinition } from "../../../data/games/baseball/pitches.ts";
import { deriveSeed, randomFloatAt, toUint32 } from "./random.ts";
import type {
  BaseballPitchType,
  BaseballPlayer,
  Handedness,
  PitchFlightState,
  PitchQuality,
  PitcherState,
  ResolvedPitch,
  Vec2,
} from "./types.ts";

const TAU = Math.PI * 2;
const PITCH_DISTANCE_METERS = 18.44;

const TIMING_COMMAND_SCORE: Readonly<Record<PitchQuality, number>> = {
  PERFECT: 1,
  GOOD: 0.8,
  NORMAL: 0.58,
  MISS: 0.2,
};

const TIMING_LOCATION_ERROR: Readonly<Record<PitchQuality, number>> = {
  PERFECT: 0.006,
  GOOD: 0.022,
  NORMAL: 0.055,
  MISS: 0.135,
};

export interface ResolvePitchInput {
  seed: number;
  /** Stable authoritative pitch number. Defaults to the pitcher's current pitch count. */
  sequence?: number;
  pitcher: BaseballPlayer;
  pitcherState: PitcherState;
  pitchType: BaseballPitchType;
  intendedTarget: Vec2;
  timingQuality: PitchQuality;
}

export interface PitchFlightSample {
  progress: number;
  perspectiveProgress: number;
  position: Vec2;
  scale: number;
  rotation: number;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function assertFinitePoint(point: Vec2, label: string) {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError(`${label} must contain finite x and y coordinates.`);
  }
}

function pointOnLine(start: Vec2, target: Vec2, progress: number): Vec2 {
  return {
    x: lerp(start.x, target.x, progress),
    y: lerp(start.y, target.y, progress),
  };
}

/** Exact cubic Bezier evaluation. Endpoints are returned directly to avoid drift. */
export function cubicBezierPoint(
  start: Vec2,
  control1: Vec2,
  control2: Vec2,
  target: Vec2,
  progress: number,
): Vec2 {
  const normalized = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
  if (normalized === 0) return { ...start };
  if (normalized === 1) return { ...target };

  const inverse = 1 - normalized;
  const startWeight = inverse ** 3;
  const control1Weight = 3 * inverse ** 2 * normalized;
  const control2Weight = 3 * inverse * normalized ** 2;
  const targetWeight = normalized ** 3;
  return {
    x: start.x * startWeight
      + control1.x * control1Weight
      + control2.x * control2Weight
      + target.x * targetWeight,
    y: start.y * startWeight
      + control1.y * control1Weight
      + control2.y * control2Weight
      + target.y * targetWeight,
  };
}

/**
 * Camera-space depth curve. The ball stays small near release and grows sharply
 * during the final third, matching the batter's perspective.
 */
export function pitchPerspectiveEase(progress: number): number {
  const normalized = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
  return normalized ** 1.72;
}

export function pitchPerspectiveScale(progress: number): number {
  return lerp(0.18, 1.15, pitchPerspectiveEase(progress));
}

function classifyPitchQuality(commandScore: number): PitchQuality {
  if (commandScore >= 0.92) return "PERFECT";
  if (commandScore >= 0.75) return "GOOD";
  if (commandScore >= 0.52) return "NORMAL";
  return "MISS";
}

interface TrajectoryInput {
  pitchType: BaseballPitchType;
  pitcherThrows: Handedness;
  target: Vec2;
  velocityKmh: number;
  spinRate: number;
  movement: number;
  initialRotation: number;
}

function createPitchTrajectory(input: TrajectoryInput): PitchFlightState {
  const definition = getPitchDefinition(input.pitchType);
  const releaseSide = input.pitcherThrows === "L" ? 1 : -1;
  const start = { x: 0.5 + releaseSide * 0.065, y: -0.38 };
  const control1 = pointOnLine(start, input.target, 0.32);
  const baselineControl2 = pointOnLine(start, input.target, 0.73);
  const movementScale = 0.55 + clamp(input.movement / 100, 0, 1) * 0.7;
  const handedBreakX = definition.breakX
    * (input.pitcherThrows === "L" ? -1 : 1)
    * movementScale;
  const effectiveBreakY = definition.breakY * movementScale;

  // A four-seamer stays virtually on its release-to-glove line. Every other
  // pitch saves its displacement for control2, producing an honest late bend
  // while the cubic endpoint remains the exact commanded actual location.
  const lateBreakStrength = input.pitchType === "fourSeam"
    ? 0.32
    : 0.82 + definition.lateBreak * 0.42;
  const control2 = {
    x: baselineControl2.x - handedBreakX * lateBreakStrength,
    y: baselineControl2.y - effectiveBreakY * lateBreakStrength,
  };

  return {
    start,
    control1,
    control2,
    target: { ...input.target },
    velocityKmh: input.velocityKmh,
    spinRate: input.spinRate,
    rotation: input.initialRotation,
    progress: 0,
    breakX: handedBreakX,
    breakY: effectiveBreakY,
    pitchType: input.pitchType,
  };
}

export function samplePitchFlight(
  trajectory: PitchFlightState,
  progress: number,
): PitchFlightSample {
  const normalized = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
  const velocityMetersPerSecond = Math.max(1, trajectory.velocityKmh / 3.6);
  const estimatedFlightSeconds = PITCH_DISTANCE_METERS / velocityMetersPerSecond;
  const turns = trajectory.spinRate / 60 * estimatedFlightSeconds * normalized;
  return {
    progress: normalized,
    perspectiveProgress: pitchPerspectiveEase(normalized),
    position: cubicBezierPoint(
      trajectory.start,
      trajectory.control1,
      trajectory.control2,
      trajectory.target,
      normalized,
    ),
    scale: pitchPerspectiveScale(normalized),
    rotation: trajectory.rotation + turns * 360,
  };
}

export function resolvePitch(input: ResolvePitchInput): ResolvedPitch {
  assertFinitePoint(input.intendedTarget, "intendedTarget");
  if (!Object.hasOwn(TIMING_COMMAND_SCORE, input.timingQuality)) {
    throw new RangeError(`Unknown timing quality: ${String(input.timingQuality)}`);
  }
  const pitching = input.pitcher.pitching;
  if (!pitching) throw new TypeError(`Pitcher has no pitching ability: ${input.pitcher.id}`);
  if (input.pitcherState.playerId !== input.pitcher.id) {
    throw new RangeError("pitcherState.playerId must match pitcher.id.");
  }

  const chosenPitch = pitching.pitches.find((pitch) => pitch.type === input.pitchType);
  if (!chosenPitch) {
    throw new RangeError(`${input.pitcher.id} cannot throw ${input.pitchType}.`);
  }

  const definition = getPitchDefinition(input.pitchType);
  const rawSequence = input.sequence ?? input.pitcherState.pitchCount;
  const sequence = Number.isFinite(rawSequence)
    ? Math.max(0, Math.trunc(rawSequence))
    : 0;
  const pitchSeed = deriveSeed(
    toUint32(input.seed),
    "pitch-v2",
    sequence,
    input.pitcher.id,
    input.pitchType,
  );
  const roll = (namespace: string) => randomFloatAt(deriveSeed(pitchSeed, namespace));

  const stamina = clamp(input.pitcherState.stamina / 100, 0, 1);
  const confidence = clamp(input.pitcherState.confidence / 100, 0, 1);
  const rawControl = chosenPitch.control * 0.58
    + pitching.control * 0.42
    + input.pitcherState.controlModifier;
  const effectiveControl = clamp(
    rawControl
      * definition.controlModifier
      * (0.58 + stamina * 0.42)
      * (0.88 + confidence * 0.12),
    0,
    100,
  );
  const rawMovement = chosenPitch.movement * 0.55
    + pitching.movement * 0.25
    + definition.movementRating * 0.2
    + input.pitcherState.movementModifier;
  const effectiveMovement = clamp(
    rawMovement * (0.68 + stamina * 0.32) * (0.92 + confidence * 0.08),
    0,
    100,
  );

  const commandScore = TIMING_COMMAND_SCORE[input.timingQuality] * 0.7
    + effectiveControl / 100 * 0.3
    + (roll("quality") - 0.5) * 0.04;
  const quality = classifyPitchQuality(commandScore);

  const fatigue = 1 - stamina;
  const controlPenalty = ((100 - effectiveControl) / 100) ** 1.3 * 0.14;
  const fatiguePenalty = fatigue ** 1.4 * 0.08;
  const pitchDifficulty = (1 - definition.controlModifier) * 0.045;
  const errorRadius = (
    TIMING_LOCATION_ERROR[input.timingQuality]
    + controlPenalty
    + fatiguePenalty
    + pitchDifficulty
  ) * (0.55 + Math.sqrt(roll("location-radius")) * 0.45);
  const errorAngle = roll("location-angle") * TAU;
  const actualTarget = {
    x: round(input.intendedTarget.x + Math.cos(errorAngle) * errorRadius * 1.12, 6),
    y: round(input.intendedTarget.y + Math.sin(errorAngle) * errorRadius * 0.92, 6),
  };

  const [minimumVelocity, maximumVelocity] = chosenPitch.velocityKmh;
  const velocitySpan = Math.max(1, maximumVelocity - minimumVelocity);
  const velocityFactor = clamp(
    0.08
      + roll("velocity") * 0.72
      + pitching.velocity / 100 * 0.16
      + confidence * 0.04
      - fatigue * 0.15
      + input.pitcherState.velocityModifier / velocitySpan,
    0,
    1,
  );
  const velocityKmh = round(lerp(minimumVelocity, maximumVelocity, velocityFactor), 1);
  const velocityProgress = clamp(
    (velocityKmh - minimumVelocity) / velocitySpan,
    0,
    1,
  );
  const flightDurationMs = Math.round(lerp(
    definition.flightDurationMs[1],
    definition.flightDurationMs[0],
    velocityProgress,
  ));

  const spinFactor = clamp(
    0.1 + roll("spin") * 0.6 + effectiveMovement / 100 * 0.3,
    0,
    1,
  );
  const spinRate = Math.round(lerp(
    definition.spinRateRpm[0],
    definition.spinRateRpm[1],
    spinFactor,
  ));
  const initialRotation = round(roll("rotation") * 360, 2);
  const movement = round(effectiveMovement, 1);
  const trajectory = createPitchTrajectory({
    pitchType: input.pitchType,
    pitcherThrows: input.pitcher.throws,
    target: actualTarget,
    velocityKmh,
    spinRate,
    movement,
    initialRotation,
  });

  return {
    id: `pitch-${pitchSeed.toString(16).padStart(8, "0")}-${sequence}`,
    pitcherId: input.pitcher.id,
    pitchType: input.pitchType,
    quality,
    location: {
      intended: { ...input.intendedTarget },
      actual: actualTarget,
    },
    velocityKmh,
    spinRate,
    movement,
    flightDurationMs,
    trajectory,
  };
}
