import {
  IDEAL_SWING_PROGRESS,
  STRIKE_ZONE,
  type BatterAction,
} from "./battingEngine.ts";
import { deriveSeed, randomFloatAt, toUint32 } from "./random.ts";
import type {
  BaseballCount,
  BaseballPitchType,
  BaseballPlayer,
  PitchQuality,
  ResolvedPitch,
  SwingType,
  Vec2,
} from "./types.ts";

interface ChooseCpuBatterActionInput {
  seed: number;
  sequence: number;
  pitch: ResolvedPitch;
  batter: BaseballPlayer;
  pitcher: BaseballPlayer;
  count: BaseballCount;
}

const PITCH_RECOGNITION_DIFFICULTY: Readonly<Record<BaseballPitchType, number>> = {
  fourSeam: 0.08,
  twoSeam: 0.14,
  slider: 0.2,
  curve: 0.15,
  changeup: 0.21,
  fork: 0.24,
  cutter: 0.18,
};

const PITCH_QUALITY_DIFFICULTY: Readonly<Record<PitchQuality, number>> = {
  PERFECT: 0.1,
  GOOD: 0.065,
  NORMAL: 0.03,
  MISS: -0.035,
};

const OFFSPEED_TIMING_BIAS: Readonly<Record<BaseballPitchType, number>> = {
  fourSeam: 0.024,
  twoSeam: 0.014,
  slider: -0.006,
  curve: -0.026,
  changeup: -0.038,
  fork: -0.023,
  cutter: 0.008,
};

const TAU = Math.PI * 2;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, digits = 6) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function assertFinitePoint(point: Vec2 | null | undefined, label: string) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError(`${label} must contain finite x and y coordinates.`);
  }
}

function assertRating(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} must be a finite rating from 0 to 100.`);
  }
}

function assertPlayer(player: BaseballPlayer | null | undefined, label: string) {
  if (!player || typeof player.id !== "string" || player.id.length === 0) {
    throw new TypeError(`${label} with a non-empty id is required.`);
  }
  assertRating(player.contact, `${label}.contact`);
  assertRating(player.power, `${label}.power`);
  assertRating(player.eye, `${label}.eye`);
}

function assertCount(count: BaseballCount | null | undefined) {
  const fields = [
    ["balls", count?.balls, 3],
    ["strikes", count?.strikes, 2],
    ["outs", count?.outs, 2],
  ] as const;
  for (const [name, value, maximum] of fields) {
    if (!Number.isInteger(value) || (value as number) < 0 || (value as number) > maximum) {
      throw new RangeError(`count.${name} must be an integer from 0 to ${maximum}.`);
    }
  }
}

function assertInput(input: ChooseCpuBatterActionInput) {
  if (!input || !input.pitch) {
    throw new TypeError("pitch is required.");
  }
  if (!Number.isFinite(input.seed)) {
    throw new TypeError("seed must be finite.");
  }
  if (!Number.isSafeInteger(input.sequence) || input.sequence < 0) {
    throw new RangeError("sequence must be a non-negative safe integer.");
  }
  assertPlayer(input.batter, "batter");
  assertPlayer(input.pitcher, "pitcher");
  assertCount(input.count);

  if (typeof input.pitch.id !== "string" || input.pitch.id.length === 0) {
    throw new TypeError("pitch.id must be a non-empty string.");
  }
  if (input.pitch.pitcherId !== input.pitcher.id) {
    throw new RangeError("pitch.pitcherId must match pitcher.id.");
  }
  if (!Object.hasOwn(PITCH_RECOGNITION_DIFFICULTY, input.pitch.pitchType)) {
    throw new RangeError(`Unknown pitch type: ${String(input.pitch.pitchType)}`);
  }
  if (!Object.hasOwn(PITCH_QUALITY_DIFFICULTY, input.pitch.quality)) {
    throw new RangeError(`Unknown pitch quality: ${String(input.pitch.quality)}`);
  }
  assertFinitePoint(input.pitch.location?.intended, "pitch.location.intended");
  assertFinitePoint(input.pitch.location?.actual, "pitch.location.actual");
  if (!Number.isFinite(input.pitch.velocityKmh) || input.pitch.velocityKmh <= 0) {
    throw new RangeError("pitch.velocityKmh must be positive and finite.");
  }
  if (!Number.isFinite(input.pitch.movement) || input.pitch.movement < 0) {
    throw new RangeError("pitch.movement must be non-negative and finite.");
  }
}

function distanceOutsideStrikeZone(point: Vec2) {
  const horizontal = point.x < STRIKE_ZONE.left
    ? STRIKE_ZONE.left - point.x
    : point.x > STRIKE_ZONE.right
      ? point.x - STRIKE_ZONE.right
      : 0;
  const vertical = point.y < STRIKE_ZONE.top
    ? STRIKE_ZONE.top - point.y
    : point.y > STRIKE_ZONE.bottom
      ? point.y - STRIKE_ZONE.bottom
      : 0;
  return Math.hypot(horizontal, vertical);
}

function distanceToNearestZoneEdge(point: Vec2) {
  if (distanceOutsideStrikeZone(point) > 0) return 0;
  return Math.min(
    point.x - STRIKE_ZONE.left,
    STRIKE_ZONE.right - point.x,
    point.y - STRIKE_ZONE.top,
    STRIKE_ZONE.bottom - point.y,
  );
}

function pitchDifficulty(pitch: ResolvedPitch) {
  const velocity = clamp((pitch.velocityKmh - 112) / 45, 0, 1);
  const movement = clamp(pitch.movement / 100, 0, 1);
  return clamp(
    velocity * 0.3
      + movement * 0.32
      + PITCH_RECOGNITION_DIFFICULTY[pitch.pitchType]
      + PITCH_QUALITY_DIFFICULTY[pitch.quality],
    0,
    1,
  );
}

function swingProbability(input: ChooseCpuBatterActionInput, difficulty: number) {
  const { pitch, batter, count } = input;
  const point = pitch.location.actual;
  const outsideDistance = distanceOutsideStrikeZone(point);
  const inZone = outsideDistance === 0;
  const edgeDistance = distanceToNearestZoneEdge(point);
  const centeredness = clamp(
    1 - Math.hypot((point.x - 0.5) / 0.28, (point.y - 0.5) / 0.36),
    0,
    1,
  );
  const nearZone = outsideDistance > 0 && outsideDistance <= 0.105;
  const eye = batter.eye / 100;
  const contact = batter.contact / 100;
  const recognition = clamp(eye * 0.74 + contact * 0.16 + (1 - difficulty) * 0.1, 0, 1);

  let probability: number;
  if (inZone) {
    const edgePenalty = edgeDistance < 0.075 ? (0.075 - edgeDistance) * 1.55 : 0;
    probability = 0.68 + centeredness * 0.16 - edgePenalty;
  } else if (nearZone) {
    const closeness = 1 - outsideDistance / 0.105;
    probability = 0.13 + closeness * 0.31;
    probability += difficulty * (1 - recognition) * 0.18;
    probability -= recognition * (0.08 + outsideDistance * 0.65);
  } else {
    const distancePenalty = clamp((outsideDistance - 0.105) / 0.24, 0, 1);
    probability = 0.1 - distancePenalty * 0.075;
    probability += difficulty * (1 - recognition) * 0.14;
    probability -= recognition * 0.075;
  }

  const isThreeAndOh = count.balls === 3 && count.strikes === 0;
  const isFullCount = count.balls === 3 && count.strikes === 2;
  const hasTwoStrikes = count.strikes === 2;
  const isHittersCount = count.balls >= 2 && count.balls > count.strikes;
  const middleOffer = inZone && centeredness >= 0.48;

  if (count.balls === 0 && count.strikes < 2) {
    // Work the count early instead of turning every well-executed strike into
    // a one-pitch at-bat. Once behind with two strikes the protection rules
    // below still take precedence.
    probability -= count.strikes === 0 ? 0.4 : 0.34;
  }

  if (isThreeAndOh) {
    // On 3-0 the CPU has a strict green-light zone, instead of treating every
    // called strike as a pitch worth attacking.
    probability = middleOffer
      ? 0.22 + centeredness * 0.24 + batter.power / 100 * 0.08
      : inZone
        ? 0.035 + centeredness * 0.08
        : 0.008 + (1 - recognition) * 0.018;
  } else if (isFullCount) {
    if (inZone) probability = Math.max(probability, 0.965);
    else if (nearZone) {
      probability = Math.max(
        probability,
        0.67 + (1 - outsideDistance / 0.105) * 0.2 + contact * 0.05,
      );
    } else {
      probability *= 0.58 + (1 - recognition) * 0.25;
    }
  } else if (hasTwoStrikes) {
    if (inZone) probability = Math.max(probability, 0.93);
    else if (nearZone) {
      const protection = 1 - outsideDistance / 0.105;
      probability = Math.max(
        probability,
        0.47 + protection * 0.29 + contact * 0.08 - recognition * outsideDistance * 0.5,
      );
    } else {
      // A disciplined hitter still protects the edge, but does not become more
      // likely to chase a clearly identified two-strike waste pitch.
      probability *= 0.7 - recognition * 0.45;
    }
  } else if (isHittersCount) {
    probability += inZone
      ? centeredness * 0.08 - (1 - centeredness) * 0.07
      : -0.055 - recognition * 0.04;
  }

  return clamp(probability, 0.004, 0.99);
}

function chooseSwingType(
  input: ChooseCpuBatterActionInput,
  difficulty: number,
  typeRoll: number,
): SwingType {
  const { batter, count, pitch } = input;
  const point = pitch.location.actual;
  const outsideDistance = distanceOutsideStrikeZone(point);
  const inZone = outsideDistance === 0;
  const centeredness = clamp(
    1 - Math.hypot((point.x - 0.5) / 0.28, (point.y - 0.5) / 0.36),
    0,
    1,
  );

  if (count.strikes === 2) {
    const protectEdgeBonus = outsideDistance > 0 ? 0.1 : 0;
    const contactChance = clamp(
      0.7
        + batter.contact / 100 * 0.12
        + batter.eye / 100 * 0.06
        + difficulty * 0.04
        + protectEdgeBonus,
      0.72,
      0.96,
    );
    return typeRoll < contactChance ? "CONTACT" : "NORMAL";
  }

  const favorableCount = count.balls > count.strikes && count.balls >= 2;
  const powerSkill = clamp((batter.power - 45) / 55, 0, 1);
  const powerChance = clamp(
    0.035
      + powerSkill * 0.22
      + (favorableCount ? 0.25 : 0)
      + (inZone ? centeredness * 0.13 : 0)
      + (pitch.quality === "MISS" ? 0.055 : 0)
      - difficulty * 0.09,
    0.02,
    0.72,
  );
  if (typeRoll < powerChance) return "POWER";

  const contactChance = clamp(
    0.08
      + batter.contact / 100 * 0.09
      + (outsideDistance > 0 ? 0.08 : 0)
      + difficulty * 0.04,
    0.08,
    0.3,
  );
  return typeRoll > 1 - contactChance ? "CONTACT" : "NORMAL";
}

function createSwing(
  input: ChooseCpuBatterActionInput,
  difficulty: number,
  actionSeed: number,
): BatterAction {
  const { pitch, batter, count } = input;
  const battingSkill = clamp((batter.contact * 0.62 + batter.eye * 0.38) / 100, 0, 1);
  const recognition = clamp(batter.eye / 100 * 0.78 + (1 - difficulty) * 0.22, 0, 1);
  const twoStrikeSpoilFactor = count.strikes === 2 ? 1.25 : 1;

  const aimAngle = randomFloatAt(deriveSeed(actionSeed, "aim-angle")) * TAU;
  const aimRadiusRoll = randomFloatAt(deriveSeed(actionSeed, "aim-radius"));
  const aimErrorScale = (0.038 + difficulty * 0.16)
    * (1.22 - battingSkill * 0.82)
    * (0.32 + Math.sqrt(aimRadiusRoll) * 0.9)
    * twoStrikeSpoilFactor;
  const movementReadPenalty = pitch.movement / 100 * (1 - recognition) * 0.025;
  const aimError = aimErrorScale + movementReadPenalty;
  const aim = {
    x: round(pitch.location.actual.x + Math.cos(aimAngle) * aimError),
    y: round(pitch.location.actual.y + Math.sin(aimAngle) * aimError * 0.88),
  };

  const timingRoll = randomFloatAt(deriveSeed(actionSeed, "timing-error"));
  const timingDirection = randomFloatAt(deriveSeed(actionSeed, "timing-direction")) < 0.5
    ? -1
    : 1;
  const timingErrorScale = (0.038 + difficulty * 0.18)
    * (1.18 - battingSkill * 0.76)
    * (0.28 + Math.sqrt(timingRoll) * 0.94)
    * twoStrikeSpoilFactor;
  const typeBias = OFFSPEED_TIMING_BIAS[pitch.pitchType]
    * (1 - recognition)
    * (0.7 + difficulty * 0.3);
  const progress = clamp(
    IDEAL_SWING_PROGRESS + timingDirection * timingErrorScale + typeBias,
    0,
    1.25,
  );

  return {
    kind: "SWING",
    swing: {
      batterId: batter.id,
      swingType: chooseSwingType(
        input,
        difficulty,
        randomFloatAt(deriveSeed(actionSeed, "swing-type")),
      ),
      aim,
      progress: round(progress),
    },
  };
}

/**
 * Produces only the CPU player's controller input. The authoritative batting
 * engine resolves this action exactly as it would resolve a human submission.
 */
export function chooseCpuBatterAction(
  input: ChooseCpuBatterActionInput,
): BatterAction {
  assertInput(input);

  const actionSeed = deriveSeed(
    toUint32(input.seed),
    "cpu-batter-v2",
    input.sequence,
    input.pitch.id,
    input.batter.id,
    input.pitcher.id,
  );
  const difficulty = pitchDifficulty(input.pitch);
  const offerChance = swingProbability(input, difficulty);
  const offerRoll = randomFloatAt(deriveSeed(actionSeed, "offer-decision"));

  if (offerRoll >= offerChance) {
    return { kind: "TAKE", batterId: input.batter.id };
  }
  return createSwing(input, difficulty, actionSeed);
}
