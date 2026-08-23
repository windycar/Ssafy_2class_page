import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  KIA_THEME_BATTERS,
  OPPONENT_PITCHERS,
} from "../src/data/games/baseball/players.ts";
import {
  IDEAL_SWING_PROGRESS,
  resolveBatterAction,
} from "../src/utils/games/baseball/battingEngine.ts";
import { chooseCpuBatterAction } from "../src/utils/games/baseball/cpuBattingAI.ts";
import type {
  BaseballCount,
  BaseballPlayer,
  ResolvedPitch,
  Vec2,
} from "../src/utils/games/baseball/types.ts";

const BATTER = KIA_THEME_BATTERS[2];
const PITCHER = OPPONENT_PITCHERS[0];
const NEUTRAL_COUNT: BaseballCount = { balls: 1, strikes: 1, outs: 0 };

function pitchAt(
  actual: Vec2,
  overrides: Partial<ResolvedPitch> = {},
): ResolvedPitch {
  return {
    id: "cpu-batter-test-pitch",
    pitcherId: PITCHER.id,
    pitchType: "slider",
    quality: "GOOD",
    location: { intended: { x: 0.5, y: 0.5 }, actual: { ...actual } },
    velocityKmh: 138,
    spinRate: 2550,
    movement: 88,
    flightDurationMs: 590,
    trajectory: {
      start: { x: 0.435, y: -0.38 },
      control1: { x: 0.45, y: 0.03 },
      control2: { x: 0.35, y: 0.3 },
      target: { ...actual },
      velocityKmh: 138,
      spinRate: 2550,
      rotation: 0,
      progress: 0,
      breakX: 0.16,
      breakY: 0.045,
      pitchType: "slider",
    },
    ...overrides,
  };
}

function choose(options: {
  seed?: number;
  sequence?: number;
  pitch?: ResolvedPitch;
  batter?: BaseballPlayer;
  count?: BaseballCount;
} = {}) {
  return chooseCpuBatterAction({
    seed: options.seed ?? 20260823,
    sequence: options.sequence ?? 17,
    pitch: options.pitch ?? pitchAt({ x: 0.5, y: 0.5 }),
    batter: options.batter ?? BATTER,
    pitcher: PITCHER,
    count: options.count ?? NEUTRAL_COUNT,
  });
}

function countSwings(options: Parameters<typeof choose>[0], samples = 256) {
  let swings = 0;
  for (let seed = 1; seed <= samples; seed += 1) {
    if (choose({ ...options, seed }).kind === "SWING") swings += 1;
  }
  return swings;
}

test("동일 입력은 동일 행동을 만들고 전달받은 객체를 변경하지 않는다", () => {
  const pitch = pitchAt({ x: 0.49, y: 0.53 });
  const input = {
    seed: 55123,
    sequence: 22,
    pitch,
    batter: BATTER,
    pitcher: PITCHER,
    count: { balls: 2, strikes: 1, outs: 1 } as BaseballCount,
  };
  const snapshot = JSON.stringify(input);

  assert.deepEqual(chooseCpuBatterAction(input), chooseCpuBatterAction(input));
  assert.equal(JSON.stringify(input), snapshot);

  const actions = new Set(
    Array.from({ length: 80 }, (_, index) => JSON.stringify(choose({ seed: index + 1 }))),
  );
  assert.ok(actions.size > 12, "seed가 달라지면 TAKE/SWING 세부 입력 분포가 달라져야 한다");
});

test("3-0에서는 가운데를 벗어난 공에 거의 모두 TAKE한다", () => {
  const count = { balls: 3, strikes: 0, outs: 0 } as const;
  const edgeStrike = pitchAt({ x: 0.75, y: 0.18 });
  const outside = pitchAt({ x: 0.83, y: 0.5 });
  const edgeTakes = 256 - countSwings({ pitch: edgeStrike, count });
  const outsideTakes = 256 - countSwings({ pitch: outside, count });

  assert.ok(edgeTakes >= 225);
  assert.ok(outsideTakes >= 245);
  assert.ok(
    countSwings({ pitch: pitchAt({ x: 0.5, y: 0.5 }), count })
      > countSwings({ pitch: edgeStrike, count }),
    "3-0이라도 가운데 공에는 제한적인 green light가 있어야 한다",
  );
});

test("0-2에서는 존 근처 공을 보호하되 먼 유인구는 쫓지 않는다", () => {
  const twoStrikeCount = { balls: 0, strikes: 2, outs: 1 } as const;
  const nearMiss = pitchAt({ x: 0.8, y: 0.5 });
  const farWaste = pitchAt({ x: 1.02, y: 0.5 });
  const nearProtection = countSwings({ pitch: nearMiss, count: twoStrikeCount });
  const neutralNear = countSwings({ pitch: nearMiss, count: NEUTRAL_COUNT });
  const farChases = countSwings({ pitch: farWaste, count: twoStrikeCount });

  assert.ok(nearProtection > neutralNear + 70);
  assert.ok(nearProtection >= 170);
  assert.ok(farChases <= 12);
});

test("선구안이 높은 타자는 먼 유인구 chase를 더 강하게 억제한다", () => {
  const highEye: BaseballPlayer = { ...BATTER, id: "eye-comparison", eye: 98 };
  const lowEye: BaseballPlayer = { ...BATTER, id: "eye-comparison", eye: 22 };
  const chasePitch = pitchAt({ x: 0.95, y: 0.5 }, {
    pitchType: "fork",
    movement: 98,
    quality: "PERFECT",
  });
  const count = { balls: 0, strikes: 2, outs: 0 } as const;
  const highEyeChases = countSwings({ batter: highEye, pitch: chasePitch, count }, 512);
  const lowEyeChases = countSwings({ batter: lowEye, pitch: chasePitch, count }, 512);

  assert.ok(highEyeChases < lowEyeChases);
  assert.ok(highEyeChases <= 28);
});

test("contact와 eye가 높은 타자는 조준 및 타이밍 오차가 더 작다", () => {
  const weak: BaseballPlayer = {
    ...BATTER,
    id: "skill-comparison",
    contact: 28,
    eye: 28,
  };
  const strong: BaseballPlayer = {
    ...BATTER,
    id: "skill-comparison",
    contact: 97,
    eye: 97,
  };
  const pitch = pitchAt({ x: 0.5, y: 0.5 }, { quality: "PERFECT" });
  const count = { balls: 1, strikes: 2, outs: 0 } as const;
  let weakLocationError = 0;
  let strongLocationError = 0;
  let weakTimingError = 0;
  let strongTimingError = 0;
  let compared = 0;

  for (let seed = 1; seed <= 512; seed += 1) {
    const weakAction = choose({ seed, batter: weak, pitch, count });
    const strongAction = choose({ seed, batter: strong, pitch, count });
    if (weakAction.kind !== "SWING" || strongAction.kind !== "SWING") continue;
    weakLocationError += Math.hypot(
      weakAction.swing.aim.x - pitch.location.actual.x,
      weakAction.swing.aim.y - pitch.location.actual.y,
    );
    strongLocationError += Math.hypot(
      strongAction.swing.aim.x - pitch.location.actual.x,
      strongAction.swing.aim.y - pitch.location.actual.y,
    );
    weakTimingError += Math.abs(weakAction.swing.progress - IDEAL_SWING_PROGRESS);
    strongTimingError += Math.abs(strongAction.swing.progress - IDEAL_SWING_PROGRESS);
    compared += 1;
  }

  assert.ok(compared > 400);
  assert.ok(strongLocationError / compared < weakLocationError / compared * 0.68);
  assert.ok(strongTimingError / compared < weakTimingError / compared * 0.72);
});

test("유리한 카운트의 장타자는 POWER, 2스트라이크에서는 CONTACT를 선호한다", () => {
  const slugger: BaseballPlayer = { ...BATTER, id: "swing-type-batter", power: 99 };
  const pitch = pitchAt({ x: 0.5, y: 0.5 }, { quality: "MISS", movement: 45 });
  let favorablePower = 0;
  let neutralPower = 0;
  let twoStrikeContact = 0;
  let favorableSwings = 0;
  let neutralSwings = 0;
  let twoStrikeSwings = 0;

  for (let seed = 1; seed <= 512; seed += 1) {
    const favorable = choose({
      seed,
      batter: slugger,
      pitch,
      count: { balls: 2, strikes: 0, outs: 0 },
    });
    const neutral = choose({ seed, batter: slugger, pitch, count: NEUTRAL_COUNT });
    const twoStrike = choose({
      seed,
      batter: slugger,
      pitch,
      count: { balls: 1, strikes: 2, outs: 0 },
    });
    if (favorable.kind === "SWING") {
      favorableSwings += 1;
      if (favorable.swing.swingType === "POWER") favorablePower += 1;
    }
    if (neutral.kind === "SWING") {
      neutralSwings += 1;
      if (neutral.swing.swingType === "POWER") neutralPower += 1;
    }
    if (twoStrike.kind === "SWING") {
      twoStrikeSwings += 1;
      if (twoStrike.swing.swingType === "CONTACT") twoStrikeContact += 1;
    }
  }

  assert.ok(favorablePower / favorableSwings > neutralPower / neutralSwings + 0.18);
  assert.ok(twoStrikeContact / twoStrikeSwings > 0.78);
});

test("3-2 경계구는 일반 카운트보다 적극적으로 스윙한다", () => {
  const boundaryBall = pitchAt({ x: 0.805, y: 0.5 });
  const fullCountSwings = countSwings({
    pitch: boundaryBall,
    count: { balls: 3, strikes: 2, outs: 2 },
  });
  const neutralSwings = countSwings({ pitch: boundaryBall, count: NEUTRAL_COUNT });

  assert.ok(fullCountSwings >= 190);
  assert.ok(fullCountSwings > neutralSwings + 75);
});

test("CPU 행동은 인간 입력과 같은 resolveBatterAction 경로에서 같은 판정을 낸다", () => {
  const pitch = pitchAt({ x: 0.47, y: 0.56 });
  const count = { balls: 1, strikes: 2, outs: 1 } as const;
  const action = choose({ seed: 77, pitch, count });
  const sharedInput = {
    pitch,
    batter: BATTER,
    pitcher: PITCHER,
    count,
    action,
    seed: 77,
  };

  const cpuResolution = resolveBatterAction(sharedInput);
  const humanResolution = resolveBatterAction({
    ...sharedInput,
    action: JSON.parse(JSON.stringify(action)),
  });
  assert.deepEqual(cpuResolution, humanResolution);
});

test("잘못된 sequence, count, 선수, 투구 필드를 거부한다", () => {
  assert.throws(() => choose({ sequence: -1 }), /sequence/);
  assert.throws(() => choose({ count: { balls: 4, strikes: 0, outs: 0 } }), /count\.balls/);
  assert.throws(() => choose({ batter: { ...BATTER, eye: Number.NaN } }), /batter\.eye/);
  assert.throws(() => choose({ pitch: { ...pitchAt({ x: 0.5, y: 0.5 }), pitcherId: "wrong" } }), /pitcher\.id/);
  assert.throws(() => choose({
    pitch: { ...pitchAt({ x: 0.5, y: 0.5 }), velocityKmh: Number.NaN },
  }), /velocityKmh/);
});

test("CPU AI는 난수·시각 API와 결과 판정 타입에 의존하지 않는다", () => {
  const source = readFileSync(
    new URL("../src/utils/games/baseball/cpuBattingAI.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random|\bDate\b/);
  assert.doesNotMatch(source, /OfficialPlayResult|BaseballPlayResultCode|PlateOutcome/);
  assert.match(source, /deriveSeed/);
  assert.match(source, /randomFloatAt/);
});
