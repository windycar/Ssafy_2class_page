import {
  getPitchDefinition,
  isBaseballPitchType,
} from "../../../data/games/baseball/pitches.ts";
import { deriveSeed, randomFloatAt, toUint32 } from "./random.ts";
import type {
  BaseballCount,
  BaseballPitchType,
  BaseballPlayer,
  Handedness,
  PitchQuality,
  PitcherState,
  PlayerPitch,
  Vec2,
} from "./types.ts";

const STRIKE_ZONE = Object.freeze({
  minimumX: 0.22,
  maximumX: 0.78,
  minimumY: 0.14,
  maximumY: 0.86,
});

const TIMING_QUALITY_ORDER = ["MISS", "NORMAL", "GOOD", "PERFECT"] as const;
const LOCATION_CANDIDATE_COUNT = 11;

export interface CpuPitchHistoryEntry {
  pitchType: BaseballPitchType;
  location: Vec2;
}

export interface CpuPitchSelection {
  pitchType: BaseballPitchType;
  target: Vec2;
  timingQuality: PitchQuality;
}

export interface ChooseCpuPitchInput {
  seed: number;
  sequence: number;
  pitcher: BaseballPlayer;
  pitcherState: PitcherState;
  batter: BaseballPlayer;
  count: BaseballCount;
  recentPitches?: readonly CpuPitchHistoryEntry[];
}

interface PitchCandidate {
  pitch: PlayerPitch;
  command: number;
  stuff: number;
  weight: number;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function assertRating(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} must be a finite rating from 0 through 100.`);
  }
}

function assertCount(count: BaseballCount) {
  const fields = [
    ["balls", count.balls, 3],
    ["strikes", count.strikes, 2],
    ["outs", count.outs, 2],
  ] as const;

  for (const [label, value, maximum] of fields) {
    if (!Number.isInteger(value) || value < 0 || value > maximum) {
      throw new RangeError(`count.${label} must be an integer from 0 through ${maximum}.`);
    }
  }
}

function assertPlayer(player: BaseballPlayer, label: string) {
  if (!player || typeof player !== "object" || typeof player.id !== "string" || !player.id) {
    throw new TypeError(`${label} must be a baseball player with a non-empty id.`);
  }
  assertRating(player.contact, `${label}.contact`);
  assertRating(player.power, `${label}.power`);
  assertRating(player.eye, `${label}.eye`);
  if (player.bats !== "L" && player.bats !== "R" && player.bats !== "S") {
    throw new RangeError(`${label}.bats is invalid.`);
  }
  if (player.throws !== "L" && player.throws !== "R") {
    throw new RangeError(`${label}.throws is invalid.`);
  }
}

function assertPitcherState(pitcher: BaseballPlayer, state: PitcherState) {
  if (!state || typeof state !== "object") {
    throw new TypeError("pitcherState is required.");
  }
  if (state.playerId !== pitcher.id) {
    throw new RangeError("pitcherState.playerId must match pitcher.id.");
  }
  if (!Number.isInteger(state.pitchCount) || state.pitchCount < 0) {
    throw new RangeError("pitcherState.pitchCount must be a non-negative integer.");
  }
  assertRating(state.stamina, "pitcherState.stamina");
  assertRating(state.confidence, "pitcherState.confidence");
  for (const key of ["velocityModifier", "controlModifier", "movementModifier"] as const) {
    if (!Number.isFinite(state[key])) {
      throw new RangeError(`pitcherState.${key} must be finite.`);
    }
  }
}

function assertRepertoire(pitcher: BaseballPlayer): readonly PlayerPitch[] {
  const pitching = pitcher.pitching;
  if (!pitching) {
    throw new TypeError(`Pitcher has no pitching ability: ${pitcher.id}`);
  }
  assertRating(pitching.velocity, "pitcher.pitching.velocity");
  assertRating(pitching.control, "pitcher.pitching.control");
  assertRating(pitching.movement, "pitcher.pitching.movement");
  assertRating(pitching.stamina, "pitcher.pitching.stamina");
  if (!Array.isArray(pitching.pitches) || pitching.pitches.length === 0) {
    throw new RangeError("Pitcher repertoire must contain at least one pitch.");
  }

  const seen = new Set<BaseballPitchType>();
  let totalUsage = 0;
  for (const pitch of pitching.pitches) {
    if (!isBaseballPitchType(pitch.type)) {
      throw new RangeError(`Unknown pitch type in repertoire: ${String(pitch.type)}`);
    }
    if (seen.has(pitch.type)) {
      throw new RangeError(`Pitcher repertoire contains duplicate pitch type: ${pitch.type}`);
    }
    seen.add(pitch.type);
    if (
      !Array.isArray(pitch.velocityKmh)
      || pitch.velocityKmh.length !== 2
      || !Number.isFinite(pitch.velocityKmh[0])
      || !Number.isFinite(pitch.velocityKmh[1])
      || pitch.velocityKmh[0] <= 0
      || pitch.velocityKmh[1] < pitch.velocityKmh[0]
    ) {
      throw new RangeError(`${pitch.type} velocity range is invalid.`);
    }
    assertRating(pitch.control, `${pitch.type}.control`);
    assertRating(pitch.movement, `${pitch.type}.movement`);
    if (!Number.isFinite(pitch.usage) || pitch.usage < 0) {
      throw new RangeError(`${pitch.type}.usage must be finite and non-negative.`);
    }
    totalUsage += pitch.usage;
  }
  if (totalUsage <= 0) {
    throw new RangeError("Pitcher repertoire must have positive total usage.");
  }
  return pitching.pitches;
}

function normalizeHistory(history: readonly CpuPitchHistoryEntry[] | undefined) {
  if (history === undefined) return [];
  if (!Array.isArray(history)) {
    throw new TypeError("recentPitches must be an array when provided.");
  }
  for (const entry of history) {
    if (!entry || typeof entry !== "object" || !isBaseballPitchType(entry.pitchType)) {
      throw new RangeError("recentPitches contains an invalid pitch type.");
    }
    if (!Number.isFinite(entry.location?.x) || !Number.isFinite(entry.location?.y)) {
      throw new RangeError("recentPitches locations must contain finite coordinates.");
    }
  }
  return history.slice(-3);
}

function effectiveBattingHand(batter: BaseballPlayer, pitcherThrows: Handedness): Handedness {
  if (batter.bats !== "S") return batter.bats;
  return pitcherThrows === "R" ? "L" : "R";
}

function isBreakingPitch(pitchType: BaseballPitchType) {
  return pitchType === "slider"
    || pitchType === "curve"
    || pitchType === "fork";
}

function isFastPitch(pitchType: BaseballPitchType) {
  return pitchType === "fourSeam"
    || pitchType === "twoSeam"
    || pitchType === "cutter";
}

function repetitionMultiplier(
  pitchType: BaseballPitchType,
  history: readonly CpuPitchHistoryEntry[],
) {
  const penalties = [0.28, 0.56, 0.78] as const;
  let multiplier = 1;
  for (let offset = 0; offset < history.length; offset += 1) {
    const entry = history[history.length - 1 - offset];
    if (entry.pitchType === pitchType) multiplier *= penalties[offset];
  }
  return multiplier;
}

function buildPitchCandidates(
  input: ChooseCpuPitchInput,
  repertoire: readonly PlayerPitch[],
  history: readonly CpuPitchHistoryEntry[],
) {
  const pitching = input.pitcher.pitching!;
  const stamina = input.pitcherState.stamina / 100;
  const confidence = input.pitcherState.confidence / 100;
  const battingHand = effectiveBattingHand(input.batter, input.pitcher.throws);
  const sameSide = battingHand === input.pitcher.throws;
  const raw = repertoire.map((pitch): PitchCandidate => {
    const definition = getPitchDefinition(pitch.type);
    const command = clamp((
      pitch.control * 0.62
      + pitching.control * 0.28
      + input.pitcherState.controlModifier
      + stamina * 6
      + confidence * 4
    ) / 100, 0, 1);
    const movement = clamp((
      pitch.movement * 0.58
      + pitching.movement * 0.22
      + definition.movementRating * 0.2
      + input.pitcherState.movementModifier
    ) / 100, 0, 1);
    const averageVelocity = (pitch.velocityKmh[0] + pitch.velocityKmh[1]) / 2;
    const velocity = clamp((averageVelocity - 108) / 47, 0, 1);
    const stuff = movement * 0.47 + velocity * 0.31 + command * 0.22;
    return {
      pitch,
      command,
      stuff,
      weight: Math.max(0.01, pitch.usage),
    };
  });

  const minimumStuff = Math.min(...raw.map((candidate) => candidate.stuff));
  const maximumStuff = Math.max(...raw.map((candidate) => candidate.stuff));
  const stuffSpan = maximumStuff - minimumStuff;

  return raw.map((candidate) => {
    const pitchType = candidate.pitch.type;
    let weight = candidate.weight;

    if (input.count.balls === 0 && input.count.strikes === 0) {
      weight *= 0.48 + candidate.command ** 2 * 1.55;
      if (isFastPitch(pitchType)) weight *= 1.22;
    } else if (input.count.balls === 0 && input.count.strikes === 2) {
      weight *= isBreakingPitch(pitchType) || pitchType === "changeup" ? 1.48 : 0.7;
      weight *= 0.72 + candidate.stuff * 0.58;
    } else if (input.count.balls === 3 && input.count.strikes === 0) {
      weight *= 0.12 + candidate.command ** 3 * 2.7;
      if (pitchType === "fourSeam" || pitchType === "twoSeam") weight *= 1.35;
      if (pitchType === "fork" || pitchType === "curve") weight *= 0.48;
    } else if (input.count.balls === 3 && input.count.strikes === 2) {
      const relativeStuff = stuffSpan <= 0
        ? 1
        : (candidate.stuff - minimumStuff) / stuffSpan;
      weight *= 0.12 + relativeStuff ** 3 * 4.8;
      weight *= 0.7 + candidate.command * 0.55;
    }

    const powerThreat = input.batter.power / 100;
    const contactThreat = input.batter.contact / 100;
    if (isFastPitch(pitchType)) {
      weight *= 1.08 - powerThreat * 0.28;
    } else {
      weight *= 0.9 + powerThreat * 0.3;
    }
    weight *= 0.82 + candidate.stuff * (0.12 + contactThreat * 0.22);

    if (sameSide) {
      if (pitchType === "slider" || pitchType === "cutter") weight *= 1.22;
      if (pitchType === "changeup") weight *= 0.88;
    } else {
      if (pitchType === "changeup" || pitchType === "twoSeam") weight *= 1.18;
      if (pitchType === "slider") weight *= 0.92;
    }

    weight *= repetitionMultiplier(pitchType, history);
    return { ...candidate, weight: Math.max(0.000_001, weight) };
  });
}

function selectWeightedPitch(
  candidates: readonly PitchCandidate[],
  roll: number,
): PitchCandidate {
  const totalWeight = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
  let cursor = roll * totalWeight;
  for (const candidate of candidates) {
    cursor -= candidate.weight;
    if (cursor < 0) return candidate;
  }
  return candidates[candidates.length - 1];
}

function calculateZoneProbability(input: ChooseCpuPitchInput, command: number) {
  let probability: number;
  if (input.count.balls === 0 && input.count.strikes === 0) probability = 0.79;
  else if (input.count.balls === 0 && input.count.strikes === 2) probability = 0.28;
  else if (input.count.balls === 3 && input.count.strikes === 0) probability = 0.95;
  else if (input.count.balls === 3 && input.count.strikes === 2) probability = 0.74;
  else probability = 0.6 + input.count.balls * 0.075 - input.count.strikes * 0.065;

  const powerThreat = (input.batter.power - 50) / 50;
  const contactThreat = (input.batter.contact - 50) / 50;
  const eyeDiscipline = (input.batter.eye - 50) / 50;
  probability += (command - 0.5) * 0.06;
  probability -= powerThreat * 0.045;
  probability -= contactThreat * 0.02;
  probability += eyeDiscipline * 0.035;
  return clamp(probability, 0.12, 0.98);
}

function pitchAnchor(
  pitchType: BaseballPitchType,
  battingHand: Handedness,
  inZone: boolean,
  centerCommand: boolean,
): Vec2 {
  if (centerCommand) return { x: 0.5, y: 0.5 };
  const insideX = battingHand === "R" ? 0.7 : 0.3;
  const awayX = battingHand === "R" ? 0.3 : 0.7;
  const outsideInsideX = battingHand === "R" ? 0.83 : 0.17;
  const outsideAwayX = battingHand === "R" ? 0.17 : 0.83;

  if (!inZone) {
    switch (pitchType) {
      case "fourSeam": return { x: outsideInsideX, y: 0.28 };
      case "twoSeam": return { x: outsideInsideX, y: 0.68 };
      case "slider": return { x: outsideAwayX, y: 0.7 };
      case "curve": return { x: 0.5, y: 0.91 };
      case "changeup": return { x: outsideAwayX, y: 0.76 };
      case "fork": return { x: 0.5, y: 0.93 };
      case "cutter": return { x: outsideInsideX, y: 0.44 };
    }
  }

  switch (pitchType) {
    case "fourSeam": return { x: insideX, y: 0.3 };
    case "twoSeam": return { x: insideX, y: 0.62 };
    case "slider": return { x: awayX, y: 0.66 };
    case "curve": return { x: 0.5, y: 0.76 };
    case "changeup": return { x: awayX, y: 0.68 };
    case "fork": return { x: 0.5, y: 0.8 };
    case "cutter": return { x: insideX, y: 0.44 };
  }
}

function createZoneCandidate(
  decisionSeed: number,
  candidateIndex: number,
  edgeBias: number,
  centerCommand: boolean,
): Vec2 {
  const roll = (domain: string) => randomFloatAt(deriveSeed(
    decisionSeed,
    "location",
    "candidate",
    candidateIndex,
    domain,
  ));
  if (centerCommand) {
    return {
      x: 0.35 + roll("center-x") * 0.3,
      y: 0.3 + roll("center-y") * 0.4,
    };
  }

  if (roll("edge-choice") < edgeBias) {
    const side = Math.floor(roll("edge-side") * 4);
    if (side === 0) return { x: 0.235 + roll("edge-depth") * 0.018, y: 0.2 + roll("edge-lane") * 0.6 };
    if (side === 1) return { x: 0.747 + roll("edge-depth") * 0.018, y: 0.2 + roll("edge-lane") * 0.6 };
    if (side === 2) return { x: 0.26 + roll("edge-lane") * 0.48, y: 0.155 + roll("edge-depth") * 0.024 };
    return { x: 0.26 + roll("edge-lane") * 0.48, y: 0.821 + roll("edge-depth") * 0.024 };
  }

  return {
    x: 0.275 + roll("inside-x") * 0.45,
    y: 0.21 + roll("inside-y") * 0.58,
  };
}

function createChaseCandidate(
  decisionSeed: number,
  candidateIndex: number,
  pitchType: BaseballPitchType,
  battingHand: Handedness,
): Vec2 {
  const roll = (domain: string) => randomFloatAt(deriveSeed(
    decisionSeed,
    "location",
    "candidate",
    candidateIndex,
    domain,
  ));
  const awaySide = battingHand === "R" ? 0 : 1;
  let sideRoll = roll("chase-side");
  if (pitchType === "curve" || pitchType === "fork") sideRoll = 0.75 + sideRoll * 0.25;
  else if (pitchType === "slider" || pitchType === "changeup") {
    sideRoll = awaySide === 0 ? sideRoll * 0.34 : 0.34 + sideRoll * 0.34;
  } else if (pitchType === "fourSeam") sideRoll *= 0.74;

  if (sideRoll < 0.25) {
    return { x: 0.14 + roll("outside-depth") * 0.07, y: 0.2 + roll("outside-lane") * 0.6 };
  }
  if (sideRoll < 0.5) {
    return { x: 0.79 + roll("outside-depth") * 0.07, y: 0.2 + roll("outside-lane") * 0.6 };
  }
  if (sideRoll < 0.67) {
    return { x: 0.24 + roll("outside-lane") * 0.52, y: 0.075 + roll("outside-depth") * 0.055 };
  }
  return { x: 0.24 + roll("outside-lane") * 0.52, y: 0.87 + roll("outside-depth") * 0.065 };
}

function locationRepetitionPenalty(
  candidate: Vec2,
  history: readonly CpuPitchHistoryEntry[],
) {
  const recencyWeights = [0.68, 0.42, 0.25] as const;
  let penalty = 0;
  for (let offset = 0; offset < history.length; offset += 1) {
    const recent = history[history.length - 1 - offset];
    const distance = Math.hypot(
      candidate.x - recent.location.x,
      candidate.y - recent.location.y,
    );
    penalty += Math.max(0, 1 - distance / 0.42) * recencyWeights[offset];
  }
  return penalty;
}

function selectTarget(
  input: ChooseCpuPitchInput,
  pitch: PitchCandidate,
  history: readonly CpuPitchHistoryEntry[],
  decisionSeed: number,
): Vec2 {
  const zoneProbability = calculateZoneProbability(input, pitch.command);
  const inZone = randomFloatAt(deriveSeed(decisionSeed, "location", "zone-choice"))
    < zoneProbability;
  const fullCount = input.count.balls === 3 && input.count.strikes === 2;
  const centerCommand = input.count.balls === 3 && input.count.strikes === 0;
  const edgeBias = fullCount
    ? 0.84
    : input.count.strikes === 2
      ? 0.68
      : 0.38;
  const battingHand = effectiveBattingHand(input.batter, input.pitcher.throws);
  const anchor = pitchAnchor(pitch.pitch.type, battingHand, inZone, centerCommand);
  let bestCandidate: Vec2 | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < LOCATION_CANDIDATE_COUNT; index += 1) {
    const rawCandidate = inZone
      ? createZoneCandidate(decisionSeed, index, edgeBias, centerCommand)
      : createChaseCandidate(decisionSeed, index, pitch.pitch.type, battingHand);
    const anchorWeight = fullCount ? 0.08 : 0.28;
    const candidate = centerCommand
      ? rawCandidate
      : {
          x: rawCandidate.x * (1 - anchorWeight) + anchor.x * anchorWeight,
          y: rawCandidate.y * (1 - anchorWeight) + anchor.y * anchorWeight,
        };

    // Blending a chase candidate toward its pitch anchor must never pull it back
    // across the rule-engine strike-zone boundary.
    if (!inZone) {
      if (rawCandidate.x < STRIKE_ZONE.minimumX) candidate.x = Math.min(candidate.x, 0.205);
      if (rawCandidate.x > STRIKE_ZONE.maximumX) candidate.x = Math.max(candidate.x, 0.795);
      if (rawCandidate.y < STRIKE_ZONE.minimumY) candidate.y = Math.min(candidate.y, 0.125);
      if (rawCandidate.y > STRIKE_ZONE.maximumY) candidate.y = Math.max(candidate.y, 0.875);
    }

    const anchorDistance = Math.hypot(candidate.x - anchor.x, candidate.y - anchor.y);
    const fitScore = Math.max(0, 1 - anchorDistance / 0.9);
    const variety = randomFloatAt(deriveSeed(
      decisionSeed,
      "location",
      "candidate",
      index,
      "ranking",
    ));
    const score = fitScore * 0.68
      + variety * 0.2
      - locationRepetitionPenalty(candidate, history);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return {
    x: round(clamp(bestCandidate!.x, 0.03, 0.97)),
    y: round(clamp(bestCandidate!.y, 0.03, 0.97)),
  };
}

function chooseTimingQuality(
  input: ChooseCpuPitchInput,
  selectedPitch: PitchCandidate,
  decisionSeed: number,
): PitchQuality {
  const stamina = input.pitcherState.stamina / 100;
  const confidence = input.pitcherState.confidence / 100;
  const difficulty = 1 - getPitchDefinition(selectedPitch.pitch.type).controlModifier;
  const releaseRoll = randomFloatAt(deriveSeed(decisionSeed, "release", "quality"));
  const releaseScore = selectedPitch.command * 0.56
    + stamina * 0.18
    + confidence * 0.14
    + releaseRoll * 0.28
    - difficulty * 0.2;

  if (releaseScore >= 0.91) return TIMING_QUALITY_ORDER[3];
  if (releaseScore >= 0.73) return TIMING_QUALITY_ORDER[2];
  if (releaseScore >= 0.5) return TIMING_QUALITY_ORDER[1];
  return TIMING_QUALITY_ORDER[0];
}

/**
 * Deterministic CPU pitch caller. It only chooses authoritative input for the
 * shared pitch engine; it does not mutate game state or resolve the pitch.
 */
export function chooseCpuPitch(input: ChooseCpuPitchInput): CpuPitchSelection {
  if (!input || typeof input !== "object") throw new TypeError("CPU pitch input is required.");
  if (!Number.isFinite(input.seed) || !Number.isInteger(input.seed)) {
    throw new RangeError("seed must be a finite integer.");
  }
  if (!Number.isInteger(input.sequence) || input.sequence < 0) {
    throw new RangeError("sequence must be a non-negative integer.");
  }
  assertPlayer(input.pitcher, "pitcher");
  assertPlayer(input.batter, "batter");
  assertPitcherState(input.pitcher, input.pitcherState);
  assertCount(input.count);
  const repertoire = assertRepertoire(input.pitcher);
  const history = normalizeHistory(input.recentPitches);
  const decisionSeed = deriveSeed(
    toUint32(input.seed),
    "cpu-pitch-v2",
    input.sequence,
    input.pitcher.id,
    input.batter.id,
  );
  const candidates = buildPitchCandidates(input, repertoire, history);
  const pitchRoll = randomFloatAt(deriveSeed(decisionSeed, "pitch-type", "selection"));
  const selectedPitch = selectWeightedPitch(candidates, pitchRoll);

  return {
    pitchType: selectedPitch.pitch.type,
    target: selectTarget(input, selectedPitch, history, decisionSeed),
    timingQuality: chooseTimingQuality(input, selectedPitch, decisionSeed),
  };
}
