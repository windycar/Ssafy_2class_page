import {
  getPitchDefinition,
  PITCH_TYPE_BY_VISUAL_KIND,
} from "../../data/games/baseball/pitches.ts";
import type {
  ContactPoint,
  ContactResult,
  PitchVisualKind,
  PlateOutcome,
} from "./baseball/types.ts";

export * from "./baseball/types.ts";
export * from "./baseball/gameState.ts";
export * from "./baseball/normalizeGameState.ts";
export * from "./baseball/inningEngine.ts";
export * from "./baseball/random.ts";
export * from "./baseball/pitchEngine.ts";
export {
  IDEAL_SWING_PROGRESS,
  STRIKE_ZONE as V2_STRIKE_ZONE,
  resolveBatterAction,
} from "./baseball/battingEngine.ts";
export type {
  BatterAction,
  BatterActionResolution,
  ResolvedContact,
  TakeResolution,
} from "./baseball/battingEngine.ts";
export * from "./baseball/ballInPlayEngine.ts";
export * from "./baseball/baseRunningEngine.ts";
export * from "./baseball/cpuPitchingAI.ts";
export * from "./baseball/cpuBattingAI.ts";
export * from "./baseball/cameraDirector.ts";
export * from "./baseball/visualEventQueue.ts";
export * from "./baseball/playEngine.ts";

export const SWEET_SPOT = 0.72;

export interface PitchTrajectory {
  first: ContactPoint;
  second: ContactPoint;
  end: ContactPoint;
}

const PITCH_BREAK: Record<PitchVisualKind, {
  first: ContactPoint;
  second: ContactPoint;
}> = {
  fastball: { first: { x: 0, y: 0 }, second: { x: 0, y: 0 } },
  twoSeam: { first: { x: 0.4, y: 0 }, second: { x: 4.2, y: 1.5 } },
  curve: { first: { x: -2.5, y: -1 }, second: { x: -7.5, y: -8 } },
  slider: { first: { x: 1, y: -0.3 }, second: { x: 8, y: -1.8 } },
  changeup: { first: { x: -0.4, y: -0.8 }, second: { x: -1.5, y: -5.5 } },
  fork: { first: { x: 0, y: -0.4 }, second: { x: 0.6, y: -9.5 } },
  cutter: { first: { x: -0.2, y: 0 }, second: { x: -4.8, y: -0.8 } },
};

function pointOnLine(start: ContactPoint, end: ContactPoint, progress: number): ContactPoint {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  };
}

/**
 * Legacy three-keyframe adapter retained while the renderer migrates to the
 * requestAnimationFrame Bezier flight state. The final point is always exact.
 */
export function createPitchTrajectory(
  kind: PitchVisualKind,
  start: ContactPoint,
  target: ContactPoint,
): PitchTrajectory {
  const first = pointOnLine(start, target, 0.35);
  const second = pointOnLine(start, target, 0.72);
  const pitchBreak = PITCH_BREAK[kind];
  return {
    first: { x: first.x + pitchBreak.first.x, y: first.y + pitchBreak.first.y },
    second: { x: second.x + pitchBreak.second.x, y: second.y + pitchBreak.second.y },
    end: { ...target },
  };
}

export function createPitchFlightDuration(kind: PitchVisualKind, randomValue = Math.random()) {
  const definition = getPitchDefinition(PITCH_TYPE_BY_VISUAL_KIND[kind]);
  const [minimum, maximum] = definition.flightDurationMs;
  const normalized = Math.min(1, Math.max(0, randomValue));
  return minimum + Math.round((maximum - minimum) * normalized);
}

const CONTACT_RESULTS: Record<
  "homeRun" | "triple" | "double" | "single" | "foul" | "out" | "swingingStrike",
  ContactResult
> = {
  homeRun: { outcome: "homeRun", label: "홈런!", detail: "완벽한 타이밍과 배트 중심입니다." },
  triple: { outcome: "triple", label: "3루타!", detail: "외야 깊숙한 곳을 갈랐습니다." },
  double: { outcome: "double", label: "2루타!", detail: "장타 코스로 정확하게 보냈습니다." },
  single: { outcome: "single", label: "안타!", detail: "좋은 타이밍으로 빈 곳을 찾았습니다." },
  foul: { outcome: "foul", label: "파울", detail: "배트 끝에 걸렸습니다." },
  out: { outcome: "out", label: "인플레이 아웃", detail: "수비 정면으로 향했습니다." },
  swingingStrike: {
    outcome: "swingingStrike",
    label: "헛스윙",
    detail: "공의 위치와 타이밍이 맞지 않았습니다.",
  },
};

export function isPitchInStrikeZone(point: ContactPoint) {
  return point.x >= 0.22 && point.x <= 0.78 && point.y >= 0.14 && point.y <= 0.86;
}

/** @deprecated V2 callers must use the contact and ball-in-play pipeline. */
export function judgeSwingContact(
  progress: number,
  aim: ContactPoint,
  target: ContactPoint,
): ContactResult {
  if (
    !Number.isFinite(progress)
    || !Number.isFinite(aim.x)
    || !Number.isFinite(aim.y)
    || !Number.isFinite(target.x)
    || !Number.isFinite(target.y)
    || progress < 0
    || progress > 1.08
  ) return CONTACT_RESULTS.swingingStrike;

  const locationDistance = Math.hypot(aim.x - target.x, aim.y - target.y);
  if (locationDistance > 0.31) return CONTACT_RESULTS.swingingStrike;
  const contactError = Math.abs(progress - SWEET_SPOT) + locationDistance * 0.38;
  if (contactError <= 0.052) return CONTACT_RESULTS.homeRun;
  if (contactError <= 0.092) return CONTACT_RESULTS.triple;
  if (contactError <= 0.145) return CONTACT_RESULTS.double;
  if (contactError <= 0.215) return CONTACT_RESULTS.single;
  if (contactError <= 0.285) return CONTACT_RESULTS.foul;
  return CONTACT_RESULTS.out;
}

/** @deprecated CPU V2 uses the same batting pipeline as a human player. */
export function judgeCpuPitchResult(
  target: ContactPoint,
  decisionRoll: number,
  contactRoll: number,
): PlateOutcome {
  const inZone = isPitchInStrikeZone(target);
  const decision = Math.min(0.999, Math.max(0, decisionRoll));
  const contact = Math.min(0.999, Math.max(0, contactRoll));
  if (!inZone && decision < 0.66) return "ball";
  if (inZone && decision < 0.14) return "calledStrike";
  if (contact < (inZone ? 0.17 : 0.31)) return "swingingStrike";
  if (contact < 0.36) return "foul";
  if (contact < 0.62) return "out";
  if (contact < 0.82) return "single";
  if (contact < 0.93) return "double";
  if (contact < 0.97) return "triple";
  return "homeRun";
}
