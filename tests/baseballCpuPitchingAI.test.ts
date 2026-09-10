import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  chooseCpuPitch,
  type ChooseCpuPitchInput,
  type CpuPitchHistoryEntry,
} from "../src/utils/games/baseball/cpuPitchingAI.ts";
import type {
  BaseballCount,
  BaseballPlayer,
  PitchQuality,
  PitcherState,
  Vec2,
} from "../src/utils/games/baseball/types.ts";

const TEST_PITCHER: BaseballPlayer = {
  id: "cpu-ai-test-pitcher",
  name: "CPU 테스트 투수",
  number: 41,
  position: "P",
  bats: "R",
  throws: "R",
  contact: 28,
  power: 32,
  eye: 49,
  speed: 54,
  fielding: 83,
  arm: 94,
  pitching: {
    velocity: 92,
    control: 91,
    movement: 92,
    stamina: 94,
    pitches: [
      { type: "fourSeam", velocityKmh: [146, 153], control: 94, movement: 68, usage: 32 },
      { type: "twoSeam", velocityKmh: [141, 149], control: 88, movement: 82, usage: 15 },
      { type: "slider", velocityKmh: [132, 141], control: 86, movement: 94, usage: 18 },
      { type: "curve", velocityKmh: [119, 128], control: 81, movement: 91, usage: 12 },
      { type: "changeup", velocityKmh: [114, 123], control: 89, movement: 85, usage: 13 },
      { type: "fork", velocityKmh: [127, 136], control: 76, movement: 98, usage: 6 },
      { type: "cutter", velocityKmh: [139, 147], control: 87, movement: 90, usage: 14 },
    ],
  },
};

const TEST_BATTER: BaseballPlayer = {
  id: "cpu-ai-test-batter",
  name: "CPU 테스트 타자",
  number: 7,
  position: "CF",
  bats: "L",
  throws: "R",
  contact: 86,
  power: 88,
  eye: 84,
  speed: 91,
  fielding: 87,
  arm: 82,
};

const PITCHER_STATE: PitcherState = {
  playerId: TEST_PITCHER.id,
  pitchCount: 24,
  stamina: 91,
  confidence: 78,
  velocityModifier: 0,
  controlModifier: 0,
  movementModifier: 0,
};

function count(balls: number, strikes: number, outs = 0): BaseballCount {
  return { balls, strikes, outs };
}

function makeInput(
  seed: number,
  gameCount = count(1, 1),
  recentPitches?: readonly CpuPitchHistoryEntry[],
): ChooseCpuPitchInput {
  return {
    seed,
    sequence: 37,
    pitcher: TEST_PITCHER,
    pitcherState: PITCHER_STATE,
    batter: TEST_BATTER,
    count: gameCount,
    recentPitches,
  };
}

function isInStrikeZone(point: Vec2) {
  return point.x >= 0.22 && point.x <= 0.78 && point.y >= 0.14 && point.y <= 0.86;
}

function distance(first: Vec2, second: Vec2) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function distanceToZoneEdge(point: Vec2) {
  return Math.min(point.x - 0.22, 0.78 - point.x, point.y - 0.14, 0.86 - point.y);
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function zoneRate(gameCount: BaseballCount, samples = 900) {
  let zones = 0;
  for (let seed = 1; seed <= samples; seed += 1) {
    if (isInStrikeZone(chooseCpuPitch(makeInput(seed, gameCount)).target)) zones += 1;
  }
  return zones / samples;
}

const QUALITY_SCORE: Readonly<Record<PitchQuality, number>> = {
  MISS: 0,
  NORMAL: 1,
  GOOD: 2,
  PERFECT: 3,
};

test("동일한 authoritative 입력은 같은 선택을 만들고 입력을 변경하지 않는다", () => {
  const input = makeInput(20260823, count(3, 2), [
    { pitchType: "slider", location: { x: 0.25, y: 0.72 } },
    { pitchType: "fourSeam", location: { x: 0.67, y: 0.3 } },
  ]);
  const snapshot = JSON.parse(JSON.stringify(input));
  deepFreeze(input);

  const first = chooseCpuPitch(input);
  const replay = chooseCpuPitch(input);

  assert.deepEqual(replay, first);
  assert.deepEqual(input, snapshot);
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first);
});

test("seed가 달라지면 구종, 코스, 릴리스 결과가 충분히 다양해진다", () => {
  const pitchTypes = new Set<string>();
  const targets = new Set<string>();
  const qualities = new Set<PitchQuality>();

  for (let seed = 1; seed <= 128; seed += 1) {
    const selection = chooseCpuPitch(makeInput(seed));
    pitchTypes.add(selection.pitchType);
    targets.add(`${selection.target.x}:${selection.target.y}`);
    qualities.add(selection.timingQuality);
  }

  assert.ok(pitchTypes.size >= 5);
  assert.ok(targets.size >= 110);
  assert.ok(qualities.size >= 2);
});

test("CPU는 수백 번 선택해도 투수 repertoire 밖의 구종을 고르지 않는다", () => {
  const repertoire = new Set(TEST_PITCHER.pitching!.pitches.map((pitch) => pitch.type));
  for (let seed = 1; seed <= 700; seed += 1) {
    const selection = chooseCpuPitch(makeInput(seed, count(seed % 4, seed % 3)));
    assert.ok(repertoire.has(selection.pitchType));
  }
});

test("0-0은 스트라이크를 선점하고 0-2는 존 밖 유인구를 크게 늘린다", () => {
  const openingRate = zoneRate(count(0, 0));
  const chaseRate = zoneRate(count(0, 2));

  assert.ok(openingRate > 0.7, `0-0 zone rate: ${openingRate}`);
  assert.ok(chaseRate < 0.4, `0-2 zone rate: ${chaseRate}`);
  assert.ok(openingRate - chaseRate > 0.4);
});

test("3-0은 존 안 승부가 0-0보다도 확실하게 증가한다", () => {
  const openingRate = zoneRate(count(0, 0));
  const threeAndZeroRate = zoneRate(count(3, 0));

  assert.ok(threeAndZeroRate > 0.9, `3-0 zone rate: ${threeAndZeroRate}`);
  assert.ok(threeAndZeroRate - openingRate > 0.1);
});

test("3-2는 상위 구위 구종 비율과 존 내부 경계 승부를 높인다", () => {
  let neutralCutter = 0;
  let fullCountCutter = 0;
  let fullCountZones = 0;
  let fullCountEdges = 0;
  const samples = 1_200;

  for (let seed = 1; seed <= samples; seed += 1) {
    if (chooseCpuPitch(makeInput(seed, count(1, 1))).pitchType === "cutter") neutralCutter += 1;
    const fullCount = chooseCpuPitch(makeInput(seed, count(3, 2)));
    if (fullCount.pitchType === "cutter") fullCountCutter += 1;
    if (isInStrikeZone(fullCount.target)) {
      fullCountZones += 1;
      if (distanceToZoneEdge(fullCount.target) <= 0.075) fullCountEdges += 1;
    }
  }

  assert.ok(fullCountCutter / samples > neutralCutter / samples + 0.08, [
    `neutral cutter rate: ${neutralCutter / samples}`,
    `full-count cutter rate: ${fullCountCutter / samples}`,
  ].join(", "));
  assert.ok(fullCountZones / samples > 0.64);
  assert.ok(fullCountEdges / fullCountZones > 0.58, `3-2 edge rate: ${fullCountEdges / fullCountZones}`);
});

test("직전 3구와 같은 구종·같은 위치는 강하게 억제된다", () => {
  const repeatedLocation = { x: 0.5, y: 0.5 };
  const history: readonly CpuPitchHistoryEntry[] = [
    { pitchType: "fourSeam", location: repeatedLocation },
    { pitchType: "fourSeam", location: repeatedLocation },
    { pitchType: "fourSeam", location: repeatedLocation },
  ];
  let baselineFourSeam = 0;
  let repeatedFourSeam = 0;
  let baselineDistance = 0;
  let repeatedDistance = 0;
  const samples = 900;

  for (let seed = 1; seed <= samples; seed += 1) {
    const baseline = chooseCpuPitch(makeInput(seed, count(1, 1)));
    const afterRepetition = chooseCpuPitch(makeInput(seed, count(1, 1), history));
    if (baseline.pitchType === "fourSeam") baselineFourSeam += 1;
    if (afterRepetition.pitchType === "fourSeam") repeatedFourSeam += 1;
    baselineDistance += distance(baseline.target, repeatedLocation);
    repeatedDistance += distance(afterRepetition.target, repeatedLocation);
  }

  assert.ok(repeatedFourSeam < baselineFourSeam * 0.35, [
    `baseline four-seam: ${baselineFourSeam}`,
    `after repetition: ${repeatedFourSeam}`,
  ].join(", "));
  assert.ok(repeatedDistance / samples > baselineDistance / samples + 0.04, [
    `baseline distance: ${baselineDistance / samples}`,
    `after repetition: ${repeatedDistance / samples}`,
  ].join(", "));
});

test("체력과 자신감이 낮으면 같은 seed 집합의 릴리스 품질이 하락한다", () => {
  const tiredState: PitcherState = {
    ...PITCHER_STATE,
    stamina: 12,
    confidence: 18,
    controlModifier: -8,
  };
  let healthyQuality = 0;
  let tiredQuality = 0;

  for (let seed = 1; seed <= 600; seed += 1) {
    healthyQuality += QUALITY_SCORE[chooseCpuPitch(makeInput(seed)).timingQuality];
    tiredQuality += QUALITY_SCORE[chooseCpuPitch({
      ...makeInput(seed),
      pitcherState: tiredState,
    }).timingQuality];
  }

  assert.ok(healthyQuality / 600 > tiredQuality / 600 + 0.65);
});

test("투수, repertoire, count 및 authoritative 식별 입력을 엄격히 검증한다", () => {
  const noPitching = { ...TEST_PITCHER, pitching: undefined };
  assert.throws(
    () => chooseCpuPitch({ ...makeInput(1), pitcher: noPitching }),
    /no pitching ability/i,
  );

  const emptyRepertoire: BaseballPlayer = {
    ...TEST_PITCHER,
    pitching: { ...TEST_PITCHER.pitching!, pitches: [] },
  };
  assert.throws(
    () => chooseCpuPitch({ ...makeInput(1), pitcher: emptyRepertoire }),
    /repertoire/i,
  );

  const unknownPitch: BaseballPlayer = {
    ...TEST_PITCHER,
    pitching: {
      ...TEST_PITCHER.pitching!,
      pitches: [{
        ...TEST_PITCHER.pitching!.pitches[0],
        type: "knuckleball",
      } as never],
    },
  };
  assert.throws(
    () => chooseCpuPitch({ ...makeInput(1), pitcher: unknownPitch }),
    /unknown pitch type/i,
  );

  for (const invalidCount of [count(4, 0), count(0, 3), count(0, 0, 3), count(1.5, 1)]) {
    assert.throws(
      () => chooseCpuPitch(makeInput(1, invalidCount)),
      /count\./i,
    );
  }
  assert.throws(() => chooseCpuPitch({ ...makeInput(Number.NaN), seed: Number.NaN }), /seed/i);
  assert.throws(() => chooseCpuPitch({ ...makeInput(1), sequence: -1 }), /sequence/i);
  assert.throws(
    () => chooseCpuPitch({
      ...makeInput(1),
      pitcherState: { ...PITCHER_STATE, playerId: "another-pitcher" },
    }),
    /must match/i,
  );
});

test("CPU 결정 모듈은 비결정적 전역 난수나 시각 소스에 의존하지 않는다", () => {
  const source = readFileSync(
    new URL("../src/utils/games/baseball/cpuPitchingAI.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random|\bDate\b/);
  assert.match(source, /deriveSeed/);
  assert.match(source, /randomFloatAt/);
});
