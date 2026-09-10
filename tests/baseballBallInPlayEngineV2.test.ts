import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  KIA_THEME_BATTERS,
  OPPONENT_BATTERS,
} from "../src/data/games/baseball/players.ts";
import {
  createBattedBall,
  resolveDefenseOpportunity,
} from "../src/utils/games/baseball/ballInPlayEngine.ts";
import type { ResolvedContact } from "../src/utils/games/baseball/battingEngine.ts";
import type {
  BaseballPlayer,
  BattedBall,
  ResolvedPitch,
  SwingTiming,
  SwingType,
} from "../src/utils/games/baseball/types.ts";

const BATTER = KIA_THEME_BATTERS[4];

const PITCH: ResolvedPitch = {
  id: "pitch-ball-flight-test-1",
  pitcherId: "test-pitcher",
  pitchType: "fourSeam",
  quality: "GOOD",
  location: {
    intended: { x: 0.5, y: 0.5 },
    actual: { x: 0.5, y: 0.5 },
  },
  velocityKmh: 150,
  spinRate: 2_350,
  movement: 75,
  flightDurationMs: 430,
  trajectory: {
    start: { x: 0.44, y: -0.38 },
    control1: { x: 0.46, y: 0 },
    control2: { x: 0.48, y: 0.32 },
    target: { x: 0.5, y: 0.5 },
    velocityKmh: 150,
    spinRate: 2_350,
    rotation: 12,
    progress: 0,
    breakX: 0,
    breakY: 0,
    pitchType: "fourSeam",
  },
};

function timingForOffset(offset: number): SwingTiming {
  if (offset < -0.16) return "VERY_EARLY";
  if (offset < -0.055) return "EARLY";
  if (offset < -0.015) return "GOOD";
  if (offset <= 0.018) return "PERFECT";
  if (offset <= 0.085) return "LATE";
  return "VERY_LATE";
}

function contact(overrides: Partial<ResolvedContact> = {}): ResolvedContact {
  const timingOffset = overrides.timingOffset ?? 0;
  return {
    result: "IN_PLAY",
    timing: timingForOffset(timingOffset),
    quality: "GOOD",
    timingError: Math.abs(timingOffset),
    locationError: 0,
    pciOverlap: 1,
    batterId: BATTER.id,
    pitcherId: PITCH.pitcherId,
    swingType: "NORMAL",
    pitchType: PITCH.pitchType,
    timingOffset,
    timingFit: 1,
    aim: { x: 0.5, y: 0.5 },
    locationOffset: { x: 0, y: 0 },
    contactScore: 0.9,
    pciRadius: { x: 0.18, y: 0.22 },
    effectiveBattingSide: "R",
    ...overrides,
  };
}

function hit(
  overrides: Partial<ResolvedContact> = {},
  seed = 20260823,
  batter: BaseballPlayer = BATTER,
) {
  return createBattedBall({
    pitch: PITCH,
    contact: contact({ batterId: batter.id, ...overrides }),
    batter,
    seed,
  });
}

function contactForLaunch(
  swingType: SwingType,
  verticalOffset: number,
): Partial<ResolvedContact> {
  return {
    swingType,
    locationOffset: { x: 0, y: verticalOffset },
    aim: { x: 0.5, y: 0.5 - verticalOffset },
  };
}

test("같은 입력은 동일한 타구와 수비 기회를 만들며 입력을 변경하지 않는다", () => {
  const resolvedContact = contact({
    swingType: "POWER",
    locationOffset: { x: 0.01, y: -0.08 },
  });
  const defenders = structuredClone(OPPONENT_BATTERS);
  const contactSnapshot = structuredClone(resolvedContact);
  const pitchSnapshot = structuredClone(PITCH);
  const defendersSnapshot = structuredClone(defenders);

  const firstBall = createBattedBall({
    pitch: PITCH,
    contact: resolvedContact,
    batter: BATTER,
    seed: 5511,
  });
  const replayBall = createBattedBall({
    pitch: PITCH,
    contact: resolvedContact,
    batter: BATTER,
    seed: 5511,
  });
  assert.deepEqual(replayBall, firstBall);

  const firstDefense = resolveDefenseOpportunity({
    ball: firstBall,
    defenders,
    seed: 8080,
  });
  const replayDefense = resolveDefenseOpportunity({
    ball: firstBall,
    defenders,
    seed: 8080,
  });
  assert.deepEqual(replayDefense, firstDefense);
  assert.deepEqual(resolvedContact, contactSnapshot);
  assert.deepEqual(PITCH, pitchSnapshot);
  assert.deepEqual(defenders, defendersSnapshot);

  assert.throws(() => hit({ result: "FOUL" }), /IN_PLAY/);
  assert.throws(() => hit({ batterId: "wrong-batter" }), /batter\.id/);
});

test("우타자는 빠르면 좌측, 늦으면 우측이며 좌타자는 방향이 정확히 반전된다", () => {
  const rightEarly = hit({ timingOffset: -0.075, timing: "EARLY" }, 17);
  const rightLate = hit({ timingOffset: 0.075, timing: "LATE" }, 17);
  const leftEarly = hit({
    timingOffset: -0.075,
    timing: "EARLY",
    effectiveBattingSide: "L",
  }, 17);
  const leftLate = hit({
    timingOffset: 0.075,
    timing: "LATE",
    effectiveBattingSide: "L",
  }, 17);

  assert.ok(rightEarly.horizontalAngle < 0);
  assert.ok(rightLate.horizontalAngle > 0);
  assert.ok(leftEarly.horizontalAngle > 0);
  assert.ok(leftLate.horizontalAngle < 0);
  assert.equal(Math.sign(rightEarly.horizontalAngle), -Math.sign(leftEarly.horizontalAngle));
  assert.equal(Math.sign(rightLate.horizontalAngle), -Math.sign(leftLate.horizontalAngle));
});

test("수직 접촉점과 스윙 리프트가 땅볼·라인드라이브·뜬공·팝업을 모두 만든다", () => {
  const balls = [
    hit(contactForLaunch("CONTACT", 0.19), 40),
    hit(contactForLaunch("NORMAL", 0), 40),
    hit(contactForLaunch("NORMAL", -0.13), 40),
    hit(contactForLaunch("POWER", -0.24), 40),
  ];

  assert.deepEqual(balls.map((ball) => ball.type), [
    "GROUND",
    "LINER",
    "FLY",
    "POPUP",
  ]);
  assert.ok(balls[0].launchAngle < 10);
  assert.ok(balls[1].launchAngle >= 10 && balls[1].launchAngle < 24);
  assert.ok(balls[2].launchAngle >= 24 && balls[2].launchAngle <= 50);
  assert.ok(balls[3].launchAngle > 50);
});

test("타이밍 방향과 타구 깊이로 9개 수비 구역과 양쪽 파울 구역을 구분한다", () => {
  const infieldOffsets = [-0.1, -0.04, 0.04, 0.1];
  const infieldZones = infieldOffsets.map((timingOffset) => hit({
    ...contactForLaunch("CONTACT", 0.19),
    timingOffset,
    timing: timingForOffset(timingOffset),
  }, 3).zone);
  assert.deepEqual(infieldZones, ["3B", "SS", "2B", "1B"]);

  const outfieldOffsets = [-0.125, -0.075, 0, 0.075, 0.125];
  const outfieldZones = outfieldOffsets.map((timingOffset) => hit({
    ...contactForLaunch("POWER", -0.1),
    timingOffset,
    timing: timingForOffset(timingOffset),
  }, 3).zone);
  assert.deepEqual(outfieldZones, ["LF", "LCF", "CF", "RCF", "RF"]);

  assert.equal(hit({ timingOffset: -0.2, timing: "VERY_EARLY" }, 3).zone, "FOUL_LEFT");
  assert.equal(hit({ timingOffset: 0.2, timing: "VERY_LATE" }, 3).zone, "FOUL_RIGHT");
  assert.equal(hit({ timingOffset: -0.2, timing: "VERY_EARLY" }, 3).fair, false);
  assert.equal(hit({ timingOffset: 0.2, timing: "VERY_LATE" }, 3).fair, false);
});

test("완벽한 접촉도 발사각과 펜스 거리를 충족하지 않으면 홈런이 아니다", () => {
  const perfectLiner = hit({
    quality: "PERFECT",
    contactScore: 1,
    timingFit: 1,
    timingOffset: 0,
    timing: "PERFECT",
    swingType: "NORMAL",
    locationOffset: { x: 0, y: 0 },
  }, 777);
  const defense = resolveDefenseOpportunity({
    ball: perfectLiner,
    defenders: OPPONENT_BATTERS,
    seed: 777,
  });

  assert.equal(perfectLiner.type, "LINER");
  assert.equal(defense.homeRun, false);
});

test("수비 능력과 주력이 높으면 같은 타구에 더 빨리 도착하고 포구 확률도 높다", () => {
  const ball: BattedBall = {
    id: "fielding-comparison",
    batterId: BATTER.id,
    exitVelocity: 142,
    launchAngle: 5,
    horizontalAngle: -10,
    spin: -1_500,
    hangTime: 1_300,
    distance: 48,
    type: "GROUND",
    zone: "SS",
    fair: true,
  };
  const baseDefender: BaseballPlayer = {
    ...OPPONENT_BATTERS[0],
    id: "comparison-shortstop",
    position: "SS",
  };
  const elite = resolveDefenseOpportunity({
    ball,
    defenders: [{ ...baseDefender, speed: 96, fielding: 98 }],
    seed: 10,
  });
  const weak = resolveDefenseOpportunity({
    ball,
    defenders: [{ ...baseDefender, speed: 35, fielding: 30 }],
    seed: 10,
  });

  assert.ok(elite.fielderArrivalTimeMs !== null);
  assert.ok(weak.fielderArrivalTimeMs !== null);
  assert.ok(elite.fielderArrivalTimeMs < weak.fielderArrivalTimeMs);
  assert.ok(elite.fieldingProbability > weak.fieldingProbability);
});

test("빠르고 강한 라인드라이브는 같은 위치의 느린 타구보다 수비 난도가 높다", () => {
  const fielder: BaseballPlayer = {
    ...OPPONENT_BATTERS[1],
    id: "line-drive-center-fielder",
    position: "CF",
    speed: 80,
    fielding: 82,
  };
  const common: Omit<BattedBall, "id" | "exitVelocity"> = {
    batterId: BATTER.id,
    launchAngle: 17,
    horizontalAngle: 0,
    spin: 1_900,
    hangTime: 2_050,
    distance: 104,
    type: "LINER",
    zone: "CF",
    fair: true,
  };
  const slow = resolveDefenseOpportunity({
    ball: { ...common, id: "slow-liner", exitVelocity: 121 },
    defenders: [fielder],
    seed: 22,
  });
  const hard = resolveDefenseOpportunity({
    ball: { ...common, id: "hard-liner", exitVelocity: 184 },
    defenders: [fielder],
    seed: 22,
  });

  assert.ok(hard.fieldingProbability < slow.fieldingProbability);
  assert.equal(hard.errorProbability, 0, "어려운 타구 실패는 실책으로 분류하지 않는다");
});

test("루틴 타구만 실책 가능성이 있으며 결정 난수에 따라 실제 포구 실패도 재현된다", () => {
  const routineBall: BattedBall = {
    id: "routine-popup",
    batterId: BATTER.id,
    exitVelocity: 101,
    launchAngle: 62,
    horizontalAngle: -8,
    spin: -1_100,
    hangTime: 5_100,
    distance: 42,
    type: "POPUP",
    zone: "SS",
    fair: true,
  };
  const fielder: BaseballPlayer = {
    ...OPPONENT_BATTERS[0],
    id: "routine-shortstop",
    position: "SS",
    speed: 72,
    fielding: 72,
  };
  const routine = resolveDefenseOpportunity({
    ball: routineBall,
    defenders: [fielder],
    seed: 0,
  });
  assert.equal(routine.routine, true);
  assert.ok(routine.errorProbability > 0);

  let missedRoutine = null;
  for (let seed = 0; seed < 10_000; seed += 1) {
    const opportunity = resolveDefenseOpportunity({ ball: routineBall, defenders: [fielder], seed });
    if (!opportunity.secured) {
      missedRoutine = opportunity;
      break;
    }
  }
  assert.ok(missedRoutine, "결정론적 seed 중 루틴 타구 실책 사례가 존재해야 한다");
  assert.equal(missedRoutine.routine, true);
  assert.ok(missedRoutine.errorProbability > 0);
});

test("방향별 펜스를 넘은 적정 발사각 타구는 수비 불가능한 홈런이다", () => {
  const cases: BattedBall[] = [
    {
      id: "home-run-left",
      batterId: BATTER.id,
      exitVelocity: 177,
      launchAngle: 29,
      horizontalAngle: -40,
      spin: -2_100,
      hangTime: 4_500,
      distance: 106,
      type: "FLY",
      zone: "LF",
      fair: true,
    },
    {
      id: "home-run-center",
      batterId: BATTER.id,
      exitVelocity: 184,
      launchAngle: 31,
      horizontalAngle: 0,
      spin: 2_250,
      hangTime: 4_800,
      distance: 123,
      type: "FLY",
      zone: "CF",
      fair: true,
    },
    {
      id: "home-run-right",
      batterId: BATTER.id,
      exitVelocity: 177,
      launchAngle: 29,
      horizontalAngle: 40,
      spin: 2_100,
      hangTime: 4_500,
      distance: 106,
      type: "FLY",
      zone: "RF",
      fair: true,
    },
  ];

  for (const ball of cases) {
    const opportunity = resolveDefenseOpportunity({
      ball,
      defenders: OPPONENT_BATTERS,
      seed: 44,
    });
    assert.equal(opportunity.homeRun, true);
    assert.equal(opportunity.primaryFielderId, null);
    assert.equal(opportunity.fieldingProbability, 0);
    assert.equal(opportunity.suggestedHitValue, 3);
  }
});

test("타구와 수비 엔진은 Math.random과 Date에 의존하지 않는다", () => {
  const source = readFileSync(
    new URL("../src/utils/games/baseball/ballInPlayEngine.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random|\bDate\b/);
});
