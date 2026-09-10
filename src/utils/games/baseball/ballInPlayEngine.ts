import { deriveSeed, randomFloatAt, toUint32 } from "./random.ts";
import type { ResolvedContact } from "./battingEngine.ts";
import type {
  BaseballPlayer,
  BattedBall,
  BattedBallType,
  BattedBallZone,
  FieldingPosition,
  ResolvedPitch,
} from "./types.ts";

const GRAVITY_METERS_PER_SECOND_SQUARED = 9.81;

const SWING_EXIT_VELOCITY: Readonly<Record<ResolvedContact["swingType"], number>> = {
  CONTACT: -9,
  NORMAL: 0,
  POWER: 11,
};

const SWING_LIFT: Readonly<Record<ResolvedContact["swingType"], number>> = {
  CONTACT: -6,
  NORMAL: 2,
  POWER: 10,
};

const CONTACT_QUALITY_EXIT_VELOCITY: Readonly<
  Record<ResolvedContact["quality"], number>
> = {
  NONE: -22,
  WEAK: -13,
  GOOD: 0,
  PERFECT: 6,
};

interface FieldCoordinate {
  x: number;
  y: number;
}

const FIELDER_START: Readonly<Record<FieldingPosition, FieldCoordinate>> = {
  P: { x: 0, y: 18.44 },
  C: { x: 0, y: -2 },
  "1B": { x: 24, y: 29 },
  "2B": { x: 17, y: 40 },
  "3B": { x: -24, y: 29 },
  SS: { x: -17, y: 40 },
  LF: { x: -42, y: 79 },
  CF: { x: 0, y: 92 },
  RF: { x: 42, y: 79 },
};

const ZONE_FIELDING_ORDER: Readonly<Record<BattedBallZone, readonly FieldingPosition[]>> = {
  LF: ["LF", "CF", "SS", "3B"],
  LCF: ["LF", "CF", "SS"],
  CF: ["CF", "LF", "RF", "2B", "SS"],
  RCF: ["RF", "CF", "2B"],
  RF: ["RF", "CF", "2B", "1B"],
  "3B": ["3B", "SS", "P"],
  SS: ["SS", "3B", "2B", "P"],
  "2B": ["2B", "SS", "1B", "P"],
  "1B": ["1B", "2B", "P"],
  FOUL_LEFT: ["C", "3B", "LF"],
  FOUL_RIGHT: ["C", "1B", "RF"],
};

export interface DefenseOpportunity {
  primaryFielderId: string | null;
  primaryPosition: FieldingPosition | null;
  ballArrivalTimeMs: number;
  fielderArrivalTimeMs: number | null;
  secureTimeMs: number | null;
  throwToFirstArrivalTimeMs: number | null;
  fieldingProbability: number;
  errorProbability: number;
  routine: boolean;
  secured: boolean;
  homeRun: boolean;
  suggestedHitValue: 0 | 1 | 2 | 3;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function normalizeUnitScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return clamp(value > 1 ? value / 100 : value, 0, 1);
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function canonicalTimingOffset(contact: ResolvedContact) {
  const rawOffset = clamp(finiteOr(contact.timingOffset, 0), -0.24, 0.24);
  switch (contact.timing) {
    case "VERY_EARLY":
      return -Math.max(Math.abs(rawOffset), 0.105);
    case "EARLY":
      return -Math.max(Math.abs(rawOffset), 0.05);
    case "GOOD":
      return -Math.max(Math.abs(rawOffset), 0.012);
    case "LATE":
      return Math.max(Math.abs(rawOffset), 0.05);
    case "VERY_LATE":
      return Math.max(Math.abs(rawOffset), 0.105);
    default:
      return rawOffset;
  }
}

function classifyBattedBall(launchAngle: number): BattedBallType {
  if (launchAngle < 10) return "GROUND";
  if (launchAngle < 24) return "LINER";
  if (launchAngle <= 50) return "FLY";
  return "POPUP";
}

function calculateDistance(
  exitVelocity: number,
  launchAngle: number,
  type: BattedBallType,
  contactScore: number,
  carryRoll: number,
) {
  const carryVariance = (carryRoll - 0.5) * 5;

  if (type === "GROUND") {
    return clamp(16 + (exitVelocity - 70) * 0.43 + carryVariance, 8, 72);
  }
  if (type === "LINER") {
    return clamp(
      34 + (exitVelocity - 70) * 0.64 + Math.max(0, launchAngle) * 0.82 + carryVariance,
      28,
      128,
    );
  }
  if (type === "POPUP") {
    return clamp(
      17 + exitVelocity * 0.2 + Math.max(0, 70 - launchAngle) * 0.62 + carryVariance,
      15,
      83,
    );
  }

  const velocityMetersPerSecond = exitVelocity / 3.6;
  const radians = clamp(launchAngle, 1, 50) * Math.PI / 180;
  const vacuumDistance = velocityMetersPerSecond ** 2
    * Math.sin(radians * 2)
    / GRAVITY_METERS_PER_SECOND_SQUARED;
  return clamp(
    vacuumDistance * 0.68 * (0.92 + contactScore * 0.08) + carryVariance,
    38,
    158,
  );
}

function calculateHangTime(type: BattedBallType, distance: number, launchAngle: number) {
  switch (type) {
    case "GROUND":
      return Math.round(clamp(500 + distance * 13, 580, 1_450));
    case "LINER":
      return Math.round(clamp(620 + distance * 13 + Math.max(0, launchAngle) * 17, 900, 2_700));
    case "FLY":
      return Math.round(clamp(1_100 + distance * 10 + launchAngle * 58, 2_400, 5_500));
    case "POPUP":
      return Math.round(clamp(1_550 + distance * 6 + launchAngle * 55, 3_600, 6_200));
  }
}

function classifyZone(
  horizontalAngle: number,
  distance: number,
  type: BattedBallType,
): BattedBallZone {
  if (horizontalAngle < -45) return "FOUL_LEFT";
  if (horizontalAngle > 45) return "FOUL_RIGHT";

  const infield = type === "GROUND" || distance < 49;
  if (infield) {
    if (horizontalAngle < -22.5) return "3B";
    if (horizontalAngle < 0) return "SS";
    if (horizontalAngle <= 22.5) return "2B";
    return "1B";
  }

  if (horizontalAngle < -30) return "LF";
  if (horizontalAngle < -10) return "LCF";
  if (horizontalAngle <= 10) return "CF";
  if (horizontalAngle <= 30) return "RCF";
  return "RF";
}

function fenceDistance(horizontalAngle: number) {
  const absoluteAngle = clamp(Math.abs(horizontalAngle), 0, 45);
  if (absoluteAngle <= 22.5) {
    return 122 - absoluteAngle / 22.5 * 10;
  }
  return 112 - (absoluteAngle - 22.5) / 22.5 * 12;
}

function isHomeRun(ball: BattedBall) {
  return ball.fair
    && (ball.type === "LINER" || ball.type === "FLY")
    && ball.launchAngle >= 18
    && ball.launchAngle <= 45
    && ball.distance >= fenceDistance(ball.horizontalAngle);
}

function fieldingTarget(ball: BattedBall): FieldCoordinate {
  const radians = ball.horizontalAngle * Math.PI / 180;
  let fieldingDistance = ball.distance;
  if (ball.type === "GROUND") {
    // A ground ball is normally intercepted around the infielders' depth. The
    // old 63% target pulled every defender toward an artificial point in front
    // of the ball and made even routine grounders effectively unreachable.
    fieldingDistance = clamp(ball.distance * 0.84, 15, 43);
  } else if (
    ball.zone === "3B"
    || ball.zone === "SS"
    || ball.zone === "2B"
    || ball.zone === "1B"
  ) {
    fieldingDistance = Math.min(ball.distance, 47);
  }
  return {
    x: Math.sin(radians) * fieldingDistance,
    y: Math.cos(radians) * fieldingDistance,
  };
}

function playerRunSpeedMetersPerSecond(player: BaseballPlayer) {
  return 4.2 + clamp(player.speed, 0, 100) / 100 * 4.1;
}

function playerReactionTimeMs(player: BaseballPlayer, ball: BattedBall) {
  const baseReaction = 490 - clamp(player.fielding, 0, 100) * 2.75;
  const contactPenalty = ball.type === "LINER" ? 80 : ball.type === "GROUND" ? 35 : 0;
  return baseReaction + contactPenalty;
}

function travelDistance(start: FieldCoordinate, target: FieldCoordinate) {
  return Math.hypot(target.x - start.x, target.y - start.y);
}

function estimatedFielderArrivalMs(
  player: BaseballPlayer,
  target: FieldCoordinate,
  ball: BattedBall,
) {
  if (player.position === "DH") return Number.POSITIVE_INFINITY;
  const start = FIELDER_START[player.position];
  const routeEfficiency = 0.8 + clamp(player.fielding, 0, 100) / 500;
  return playerReactionTimeMs(player, ball)
    + travelDistance(start, target)
      / (playerRunSpeedMetersPerSecond(player) * routeEfficiency)
      * 1_000;
}

function chooseFielder(
  defenders: readonly BaseballPlayer[],
  ball: BattedBall,
  target: FieldCoordinate,
) {
  const preferredPositions = ZONE_FIELDING_ORDER[ball.zone];
  let selected: { player: BaseballPlayer; arrivalTimeMs: number; preference: number } | null = null;

  for (const player of defenders) {
    if (player.position === "DH") continue;
    const preference = preferredPositions.indexOf(player.position);
    if (preference < 0) continue;
    const arrivalTimeMs = estimatedFielderArrivalMs(player, target, ball) + preference * 180;
    if (
      selected === null
      || arrivalTimeMs < selected.arrivalTimeMs
      || (arrivalTimeMs === selected.arrivalTimeMs && player.id < selected.player.id)
    ) {
      selected = { player, arrivalTimeMs, preference };
    }
  }

  if (selected) return selected;

  for (const player of defenders) {
    if (player.position === "DH") continue;
    const arrivalTimeMs = estimatedFielderArrivalMs(player, target, ball) + 900;
    if (
      selected === null
      || arrivalTimeMs < selected.arrivalTimeMs
      || (arrivalTimeMs === selected.arrivalTimeMs && player.id < selected.player.id)
    ) {
      selected = { player, arrivalTimeMs, preference: preferredPositions.length };
    }
  }

  return selected;
}

function ballArrivalAtFieldingPoint(ball: BattedBall, target: FieldCoordinate) {
  if (ball.distance <= 0) return ball.hangTime;
  const targetDistance = Math.hypot(target.x, target.y);
  const progress = clamp(targetDistance / ball.distance, 0.28, 1);
  const travelCurve = ball.type === "GROUND" ? progress ** 0.82 : progress;
  return Math.round(clamp(ball.hangTime * travelCurve, 320, ball.hangTime));
}

function suggestedHitValue(ball: BattedBall, secured: boolean, homeRun: boolean): 0 | 1 | 2 | 3 {
  if (!ball.fair || secured) return 0;
  if (homeRun) return 3;

  const gap = Math.abs(ball.horizontalAngle) >= 10 && Math.abs(ball.horizontalAngle) <= 32;
  if (ball.distance >= 112 && gap && ball.type !== "GROUND") return 3;
  if (ball.distance >= 76 && ball.type !== "GROUND") return 2;
  return 1;
}

export function createBattedBall(input: {
  pitch: ResolvedPitch;
  contact: ResolvedContact;
  batter: BaseballPlayer;
  seed: number;
}): BattedBall {
  if (input.contact.result !== "IN_PLAY") {
    throw new RangeError("A batted ball can only be created from an IN_PLAY contact result.");
  }
  if (input.contact.batterId !== input.batter.id) {
    throw new RangeError("contact.batterId must match batter.id.");
  }
  if (input.contact.pitcherId !== input.pitch.pitcherId) {
    throw new RangeError("contact.pitcherId must match pitch.pitcherId.");
  }

  const ballSeed = deriveSeed(
    toUint32(input.seed),
    "batted-ball-v2",
    input.pitch.id,
    input.batter.id,
  );
  const roll = (namespace: string) => randomFloatAt(deriveSeed(ballSeed, namespace));
  const contactScore = normalizeUnitScore(input.contact.contactScore);
  const timingFit = normalizeUnitScore(input.contact.timingFit);
  const pciRadiusX = clamp(finiteOr(input.contact.pciRadius.x, 0.18), 0.08, 0.42);
  const pciRadiusY = clamp(finiteOr(input.contact.pciRadius.y, 0.22), 0.08, 0.46);
  const verticalContact = clamp(
    -finiteOr(input.contact.locationOffset.y, 0) / pciRadiusY,
    -1.2,
    1.2,
  );

  const exitVelocity = round(clamp(
    52
      + clamp(finiteOr(input.pitch.velocityKmh, 130), 80, 180) * 0.25
      + clamp(finiteOr(input.batter.power, 50), 0, 100) * 0.52
      + contactScore * 32
      + timingFit * 7
      + SWING_EXIT_VELOCITY[input.contact.swingType]
      + CONTACT_QUALITY_EXIT_VELOCITY[input.contact.quality]
      + (roll("exit-velocity") - 0.5) * 5,
    68,
    190,
  ), 1);

  const launchAngle = round(clamp(
    12
      + verticalContact * 31
      + SWING_LIFT[input.contact.swingType]
      + (clamp(finiteOr(input.pitch.location.actual.y, 0.5), 0, 1) - 0.5) * 4
      + (roll("launch-angle") - 0.5) * 5,
    -12,
    72,
  ), 1);

  const timingOffset = canonicalTimingOffset(input.contact);
  const battingDirection = input.contact.effectiveBattingSide === "L" ? -1 : 1;
  const horizontalContact = clamp(
    -finiteOr(input.contact.locationOffset.x, 0) / pciRadiusX,
    -1,
    1,
  );
  const horizontalAngle = round(clamp(
    battingDirection * timingOffset / 0.16 * 42
      + battingDirection * horizontalContact * 6
      + (roll("horizontal-angle") - 0.5) * 2.4,
    -62,
    62,
  ), 1);

  const type = classifyBattedBall(launchAngle);
  const distance = round(calculateDistance(
    exitVelocity,
    launchAngle,
    type,
    contactScore,
    roll("carry"),
  ), 1);
  const zone = classifyZone(horizontalAngle, distance, type);
  const fair = zone !== "FOUL_LEFT" && zone !== "FOUL_RIGHT";
  const hangTime = calculateHangTime(type, distance, launchAngle);
  const spinDirection = horizontalAngle < 0 ? -1 : 1;
  const spin = Math.round(spinDirection * clamp(
    input.pitch.spinRate * 0.32 + exitVelocity * 7 + roll("spin") * 520,
    700,
    3_500,
  ));

  return {
    id: `ball-${ballSeed.toString(16).padStart(8, "0")}`,
    batterId: input.batter.id,
    exitVelocity,
    launchAngle,
    horizontalAngle,
    spin,
    hangTime,
    distance,
    type,
    zone,
    fair,
  };
}

export function resolveDefenseOpportunity(input: {
  ball: BattedBall;
  defenders: readonly BaseballPlayer[];
  seed: number;
}): DefenseOpportunity {
  const homeRun = isHomeRun(input.ball);
  if (homeRun) {
    return {
      primaryFielderId: null,
      primaryPosition: null,
      ballArrivalTimeMs: input.ball.hangTime,
      fielderArrivalTimeMs: null,
      secureTimeMs: null,
      throwToFirstArrivalTimeMs: null,
      fieldingProbability: 0,
      errorProbability: 0,
      routine: false,
      secured: false,
      homeRun: true,
      suggestedHitValue: 3,
    };
  }

  const target = fieldingTarget(input.ball);
  const selected = chooseFielder(input.defenders, input.ball, target);
  const ballArrivalTimeMs = ballArrivalAtFieldingPoint(input.ball, target);
  if (!selected) {
    return {
      primaryFielderId: null,
      primaryPosition: null,
      ballArrivalTimeMs,
      fielderArrivalTimeMs: null,
      secureTimeMs: null,
      throwToFirstArrivalTimeMs: null,
      fieldingProbability: 0,
      errorProbability: 0,
      routine: false,
      secured: false,
      homeRun: false,
      suggestedHitValue: suggestedHitValue(input.ball, false, false),
    };
  }

  const player = selected.player;
  const fielderArrivalTimeMs = Math.round(selected.arrivalTimeMs);
  const marginMs = ballArrivalTimeMs - fielderArrivalTimeMs;
  const skill = clamp(player.fielding, 0, 100) / 100;
  const velocityDifficulty = Math.max(0, input.ball.exitVelocity - 125) * (
    input.ball.type === "LINER" ? 4.2 : input.ball.type === "GROUND" ? 2.2 : 1.15
  );
  const typeDifficulty = input.ball.type === "POPUP"
    ? -180
    : input.ball.type === "FLY"
      ? -70
      : input.ball.type === "LINER"
        ? 95
        : 25;
  const interceptAllowanceMs = input.ball.type === "GROUND"
    ? 420
    : input.ball.type === "LINER"
      ? 260
      : input.ball.type === "FLY"
        ? 100
        : 0;
  const foulDifficulty = input.ball.fair ? 0 : 130;
  const reachScore = sigmoid(
    (
      marginMs
      + interceptAllowanceMs
      + skill * 240
      - velocityDifficulty
      - typeDifficulty
      - foulDifficulty
    ) / 270,
  );
  const rawFieldingProbability = clamp(
    reachScore * (0.6 + skill * 0.4),
    0.005,
    0.996,
  );
  const routine = marginMs >= 330
    && rawFieldingProbability >= 0.82
    && !(input.ball.type === "LINER" && input.ball.exitVelocity >= 165);
  const errorProbability = routine
    ? round(clamp(0.077 - skill * 0.068, 0.006, 0.06), 4)
    : 0;
  const fieldingProbability = round(
    clamp(rawFieldingProbability * (1 - errorProbability), 0.005, 0.995),
    4,
  );
  const secureRoll = randomFloatAt(deriveSeed(
    toUint32(input.seed),
    "defense-secure-v2",
    input.ball.id,
    player.id,
  ));
  const secured = secureRoll < fieldingProbability;
  const transferTimeMs = Math.round(250 - skill * 125);
  const secureTimeMs = secured
    ? Math.round(Math.max(ballArrivalTimeMs, fielderArrivalTimeMs) + transferTimeMs)
    : null;

  let throwToFirstArrivalTimeMs: number | null = null;
  if (secured && secureTimeMs !== null && input.ball.type === "GROUND") {
    if (player.position === "1B") {
      throwToFirstArrivalTimeMs = secureTimeMs;
    } else {
      const throwDistance = travelDistance(target, FIELDER_START["1B"]);
      const throwSpeedMetersPerSecond = 25 + clamp(player.arm, 0, 100) * 0.14;
      throwToFirstArrivalTimeMs = Math.round(
        secureTimeMs + throwDistance / throwSpeedMetersPerSecond * 1_000,
      );
    }
  }

  return {
    primaryFielderId: player.id,
    primaryPosition: player.position,
    ballArrivalTimeMs,
    fielderArrivalTimeMs,
    secureTimeMs,
    throwToFirstArrivalTimeMs,
    fieldingProbability,
    errorProbability,
    routine,
    secured,
    homeRun: false,
    suggestedHitValue: suggestedHitValue(input.ball, secured, false),
  };
}
