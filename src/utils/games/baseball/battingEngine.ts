import { deriveSeed, randomFloatAt, toUint32 } from "./random.ts";
import type {
  BaseballCount,
  BaseballPitchType,
  BaseballPlayer,
  ContactQuality,
  ContactResolution,
  PitchQuality,
  ResolvedPitch,
  SwingInput,
  SwingTiming,
  SwingType,
  Vec2,
} from "./types.ts";

export const STRIKE_ZONE = Object.freeze({
  left: 0.22,
  right: 0.78,
  top: 0.14,
  bottom: 0.86,
});

export const IDEAL_SWING_PROGRESS = 0.72;

export type BatterAction =
  | { kind: "TAKE"; batterId: string }
  | { kind: "SWING"; swing: SwingInput };

export interface TakeResolution {
  result: "BALL" | "CALLED_STRIKE";
  inZone: boolean;
  batterId: string;
  pitcherId: string;
}

export interface ResolvedContact extends ContactResolution {
  /** Negative is early; positive is late. */
  timingOffset: number;
  timingFit: number;
  aim: Vec2;
  /** The actual plate location minus the user's aim. */
  locationOffset: Vec2;
  contactScore: number;
  pciRadius: Vec2;
  effectiveBattingSide: "L" | "R";
}

export type BatterActionResolution =
  | { kind: "TAKE"; take: TakeResolution }
  | { kind: "SWING"; contact: ResolvedContact };

interface SwingProfile {
  pciRadius: Vec2;
  timingWindow: number;
  contactBonus: number;
  inPlayThreshold: number;
  maximumReach: number;
}

const SWING_PROFILES: Readonly<Record<SwingType, SwingProfile>> = {
  CONTACT: {
    pciRadius: { x: 0.24, y: 0.29 },
    timingWindow: 0.18,
    contactBonus: 0.04,
    inPlayThreshold: 0.535,
    maximumReach: 1.28,
  },
  NORMAL: {
    pciRadius: { x: 0.195, y: 0.235 },
    timingWindow: 0.145,
    contactBonus: 0.012,
    inPlayThreshold: 0.575,
    maximumReach: 1.2,
  },
  POWER: {
    pciRadius: { x: 0.15, y: 0.18 },
    timingWindow: 0.115,
    contactBonus: -0.035,
    inPlayThreshold: 0.62,
    maximumReach: 1.1,
  },
};

const PITCH_TYPE_DIFFICULTY: Readonly<Record<BaseballPitchType, number>> = {
  fourSeam: 0.08,
  twoSeam: 0.12,
  slider: 0.18,
  curve: 0.13,
  changeup: 0.16,
  fork: 0.22,
  cutter: 0.17,
};

const PITCH_QUALITY_DIFFICULTY: Readonly<Record<PitchQuality, number>> = {
  PERFECT: 0.09,
  GOOD: 0.055,
  NORMAL: 0.025,
  MISS: -0.025,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, digits = 6) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function assertFinitePoint(point: Vec2, label: string) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError(`${label} must contain finite x and y coordinates.`);
  }
}

function assertCount(count: BaseballCount) {
  const fields = [
    ["balls", count?.balls, 3],
    ["strikes", count?.strikes, 2],
    ["outs", count?.outs, 2],
  ] as const;
  for (const [name, value, maximum] of fields) {
    if (!Number.isInteger(value) || value < 0 || value > maximum) {
      throw new RangeError(`count.${name} must be an integer from 0 to ${maximum}.`);
    }
  }
}

export function isPitchInStrikeZone(point: Vec2): boolean {
  assertFinitePoint(point, "pitch location");
  return point.x >= STRIKE_ZONE.left
    && point.x <= STRIKE_ZONE.right
    && point.y >= STRIKE_ZONE.top
    && point.y <= STRIKE_ZONE.bottom;
}

function effectiveBattingSide(batter: BaseballPlayer, pitcher: BaseballPlayer): "L" | "R" {
  if (batter.bats === "S") return pitcher.throws === "R" ? "L" : "R";
  return batter.bats;
}

function classifyTiming(offset: number): SwingTiming {
  if (offset < -0.16) return "VERY_EARLY";
  if (offset < -0.055) return "EARLY";
  if (offset < -0.015) return "GOOD";
  if (offset <= 0.018) return "PERFECT";
  if (offset <= 0.085) return "LATE";
  return "VERY_LATE";
}

function pitchDifficulty(pitch: ResolvedPitch): number {
  const velocity = clamp((pitch.velocityKmh - 118) / 40, 0, 1);
  const movement = clamp(pitch.movement / 100, 0, 1);
  return clamp(
    velocity * 0.37
      + movement * 0.36
      + PITCH_TYPE_DIFFICULTY[pitch.pitchType]
      + PITCH_QUALITY_DIFFICULTY[pitch.quality],
    0,
    1,
  );
}

function contactQuality(
  result: ContactResolution["result"],
  score: number,
  timingFit: number,
  normalizedDistance: number,
): ContactQuality {
  if (result === "MISS") return "NONE";
  if (score >= 0.86 && timingFit >= 0.86 && normalizedDistance <= 0.38) {
    return "PERFECT";
  }
  if (score >= 0.66) return "GOOD";
  return "WEAK";
}

function resolveSwing(input: {
  pitch: ResolvedPitch;
  batter: BaseballPlayer;
  pitcher: BaseballPlayer;
  count: BaseballCount;
  swing: SwingInput;
  seed: number;
}): ResolvedContact {
  const { pitch, batter, pitcher, count, swing } = input;
  if (swing.batterId !== batter.id) {
    throw new RangeError("swing.batterId must match batter.id.");
  }
  if (!Object.hasOwn(SWING_PROFILES, swing.swingType)) {
    throw new RangeError(`Unknown swing type: ${String(swing.swingType)}`);
  }
  assertFinitePoint(swing.aim, "swing.aim");
  if (!Number.isFinite(swing.progress) || swing.progress < 0 || swing.progress > 1.25) {
    throw new RangeError("swing.progress must be a finite value from 0 to 1.25.");
  }

  const profile = SWING_PROFILES[swing.swingType];
  const difficulty = pitchDifficulty(pitch);
  const side = effectiveBattingSide(batter, pitcher);
  const platoonFactor = side === pitcher.throws ? 0.96 : 1.025;
  const twoStrikeFactor = count.strikes === 2 ? 1.055 : 1;
  const skillFactor = 0.76 + clamp(batter.contact, 0, 100) * 0.0042;
  const recognitionFactor = 0.93 + clamp(batter.eye, 0, 100) * 0.0014;
  const pciDifficultyFactor = 1 - difficulty * 0.16;
  const pciScale = skillFactor
    * recognitionFactor
    * platoonFactor
    * twoStrikeFactor
    * pciDifficultyFactor;
  const pciRadius = {
    x: round(profile.pciRadius.x * pciScale),
    y: round(profile.pciRadius.y * pciScale),
  };

  const locationOffset = {
    x: round(pitch.location.actual.x - swing.aim.x),
    y: round(pitch.location.actual.y - swing.aim.y),
  };
  const locationError = Math.hypot(locationOffset.x, locationOffset.y);
  const normalizedDistance = Math.hypot(
    locationOffset.x / pciRadius.x,
    locationOffset.y / pciRadius.y,
  );
  const pciOverlap = clamp(1 - normalizedDistance, 0, 1);
  const locationFit = clamp(1 - normalizedDistance * 0.64, 0, 1);

  const timingOffset = round(swing.progress - IDEAL_SWING_PROGRESS);
  const timingWindow = profile.timingWindow
    * (0.84 + clamp(batter.contact, 0, 100) * 0.002
      + clamp(batter.eye, 0, 100) * 0.001)
    * (0.92 - difficulty * 0.12)
    * platoonFactor
    * (count.strikes === 2 ? 1.06 : 1);
  const timingFit = clamp(1 - Math.abs(timingOffset) / timingWindow, 0, 1);
  const timing = classifyTiming(timingOffset);

  const variationSeed = deriveSeed(
    toUint32(input.seed),
    "batting-v2",
    pitch.id,
    batter.id,
    pitcher.id,
    swing.swingType,
    "contact-variation",
  );
  const variation = (randomFloatAt(variationSeed) - 0.5) * 0.04;
  const batterSkillBonus = (clamp(batter.contact, 0, 100) - 50) / 100 * 0.08
    + (clamp(batter.eye, 0, 100) - 50) / 100 * 0.04;
  const countBonus = count.strikes === 2 ? 0.018 : 0;
  const score = clamp(
    locationFit * 0.56
      + timingFit * 0.34
      + batterSkillBonus
      + profile.contactBonus
      + countBonus
      - difficulty * 0.06
      + variation,
    0,
    1,
  );

  const eyeReach = (clamp(batter.eye, 0, 100) - 50) / 100 * 0.1;
  const maximumReach = profile.maximumReach + eyeReach;
  const hardLocationMiss = normalizedDistance > maximumReach;
  const hardTimingMiss = timingFit <= 0.02
    && Math.abs(timingOffset) > timingWindow * 1.08;
  const ordinaryMiss = hardLocationMiss || hardTimingMiss || score < 0.31;
  const twoStrikeProtection = count.strikes === 2
    && normalizedDistance <= maximumReach + 0.14
    && Math.abs(timingOffset) <= timingWindow * 1.32
    && score >= 0.22;

  let result: ContactResolution["result"];
  if (ordinaryMiss && !twoStrikeProtection) {
    result = "MISS";
  } else if (
    ordinaryMiss
    || score < profile.inPlayThreshold
    || timing === "VERY_EARLY"
    || timing === "VERY_LATE"
  ) {
    result = "FOUL";
  } else {
    result = "IN_PLAY";
  }

  return {
    result,
    timing,
    quality: contactQuality(result, score, timingFit, normalizedDistance),
    timingError: round(Math.abs(timingOffset)),
    locationError: round(locationError),
    pciOverlap: round(pciOverlap),
    batterId: batter.id,
    pitcherId: pitcher.id,
    swingType: swing.swingType,
    pitchType: pitch.pitchType,
    timingOffset,
    timingFit: round(timingFit),
    aim: { x: swing.aim.x, y: swing.aim.y },
    locationOffset,
    contactScore: round(score),
    pciRadius,
    effectiveBattingSide: side,
  };
}

export function resolveBatterAction(input: {
  pitch: ResolvedPitch;
  batter: BaseballPlayer;
  pitcher: BaseballPlayer;
  count: BaseballCount;
  action: BatterAction;
  seed: number;
}): BatterActionResolution {
  if (!input || !input.pitch || !input.batter || !input.pitcher) {
    throw new TypeError("pitch, batter, and pitcher are required.");
  }
  if (!Number.isFinite(input.seed)) {
    throw new TypeError("seed must be finite.");
  }
  if (input.pitch.pitcherId !== input.pitcher.id) {
    throw new RangeError("pitch.pitcherId must match pitcher.id.");
  }
  assertFinitePoint(input.pitch.location?.actual, "pitch.location.actual");
  if (!Number.isFinite(input.pitch.velocityKmh) || !Number.isFinite(input.pitch.movement)) {
    throw new TypeError("pitch velocity and movement must be finite.");
  }
  if (!Object.hasOwn(PITCH_TYPE_DIFFICULTY, input.pitch.pitchType)) {
    throw new RangeError(`Unknown pitch type: ${String(input.pitch.pitchType)}`);
  }
  if (!Object.hasOwn(PITCH_QUALITY_DIFFICULTY, input.pitch.quality)) {
    throw new RangeError(`Unknown pitch quality: ${String(input.pitch.quality)}`);
  }
  assertCount(input.count);

  const action = input.action as BatterAction | null | undefined;
  if (!action || (action.kind !== "TAKE" && action.kind !== "SWING")) {
    throw new RangeError(`Unknown batter action: ${String(action?.kind)}`);
  }

  if (action.kind === "TAKE") {
    if (action.batterId !== input.batter.id) {
      throw new RangeError("action.batterId must match batter.id.");
    }
    const inZone = isPitchInStrikeZone(input.pitch.location.actual);
    return {
      kind: "TAKE",
      take: {
        result: inZone ? "CALLED_STRIKE" : "BALL",
        inZone,
        batterId: input.batter.id,
        pitcherId: input.pitcher.id,
      },
    };
  }

  return {
    kind: "SWING",
    contact: resolveSwing({
      pitch: input.pitch,
      batter: input.batter,
      pitcher: input.pitcher,
      count: input.count,
      swing: action.swing,
      seed: input.seed,
    }),
  };
}
