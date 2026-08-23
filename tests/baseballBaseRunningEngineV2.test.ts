import assert from "node:assert/strict";
import test from "node:test";

import { getBaseballPlayer } from "../src/data/games/baseball/players.ts";
import {
  resolveBaseRunning,
  type ResolveBaseRunningInput,
} from "../src/utils/games/baseball/baseRunningEngine.ts";
import type { DefenseOpportunity } from "../src/utils/games/baseball/ballInPlayEngine.ts";
import type {
  BaseRunner,
  BaseballPlayer,
  BattedBall,
  BasesState,
} from "../src/utils/games/baseball/types.ts";

const batter = getBaseballPlayer("cpu-yoon-taesung") as BaseballPlayer;
const fastBatter = getBaseballPlayer("cpu-park-junho") as BaseballPlayer;
const defenders = [
  "kia-park-chanho", "kia-choi-wonjun", "kia-kim-doyoung", "kia-na-sungbum",
  "kia-kim-sunbin", "kia-lee-woosung", "kia-kim-taegun", "kia-lee-changjin",
].map((id) => getBaseballPlayer(id) as BaseballPlayer);

function runner(id: string, base: 1 | 2 | 3, speed = 75): BaseRunner {
  const player = getBaseballPlayer(id) as BaseballPlayer;
  return { playerId: id, name: player.name, speed, currentBase: base };
}

function ball(overrides: Partial<BattedBall> = {}): BattedBall {
  return {
    id: "ball-running-test",
    batterId: batter.id,
    exitVelocity: 145,
    launchAngle: 5,
    horizontalAngle: -8,
    spin: 1_800,
    hangTime: 1.1,
    distance: 32,
    type: "GROUND",
    zone: "SS",
    fair: true,
    ...overrides,
  };
}

function opportunity(overrides: Partial<DefenseOpportunity> = {}): DefenseOpportunity {
  return {
    primaryFielderId: "kia-park-chanho",
    primaryPosition: "SS",
    ballArrivalTimeMs: 1_000,
    fielderArrivalTimeMs: 850,
    secureTimeMs: 1_050,
    throwToFirstArrivalTimeMs: 2_550,
    fieldingProbability: 0.9,
    errorProbability: 0.03,
    routine: true,
    secured: true,
    homeRun: false,
    suggestedHitValue: 1,
    ...overrides,
  };
}

function input(overrides: Partial<ResolveBaseRunningInput> = {}): ResolveBaseRunningInput {
  return {
    bases: { first: null, second: null, third: null },
    batter,
    ball: ball(),
    defense: opportunity(),
    defenders,
    outsBeforePlay: 0,
    seed: 20260823,
    ...overrides,
  };
}

test("결정론적 주루 판정은 입력을 바꾸지 않고 같은 결과를 재생한다", () => {
  const original = input({
    bases: { first: runner("cpu-park-junho", 1), second: null, third: null },
  });
  const snapshot = structuredClone(original);
  assert.deepEqual(resolveBaseRunning(original), resolveBaseRunning(original));
  assert.deepEqual(original, snapshot);
});

test("홈런은 모든 주자 신원을 득점 처리하고 베이스를 비운다", () => {
  const bases: BasesState = {
    first: runner("cpu-park-junho", 1),
    second: runner("cpu-jung-mingyu", 2),
    third: runner("cpu-han-doyoon", 3),
  };
  const result = resolveBaseRunning(input({
    bases,
    defense: opportunity({ homeRun: true, secured: false, suggestedHitValue: 3 }),
    ball: ball({ type: "FLY", launchAngle: 31, distance: 128, zone: "CF" }),
  }));
  assert.equal(result.kind, "HOME_RUN");
  assert.equal(result.runners.runsScored, 4);
  assert.deepEqual(result.runners.nextBases, { first: null, second: null, third: null });
  assert.deepEqual(new Set(result.runners.scoredRunnerIds), new Set([
    batter.id, "cpu-park-junho", "cpu-jung-mingyu", "cpu-han-doyoon",
  ]));
});

test("잡힌 외야 뜬공은 타자 아웃 뒤 빠른 3루 주자의 희생플라이 득점을 계산한다", () => {
  const result = resolveBaseRunning(input({
    bases: { first: null, second: null, third: runner("cpu-park-junho", 3, 98) },
    ball: ball({ type: "FLY", launchAngle: 34, distance: 88, zone: "RF", hangTime: 4.2 }),
    defense: opportunity({
      primaryFielderId: "kia-na-sungbum",
      primaryPosition: "RF",
      ballArrivalTimeMs: 4_200,
      fielderArrivalTimeMs: 3_900,
      secureTimeMs: 4_200,
      throwToFirstArrivalTimeMs: null,
    }),
  }));
  assert.equal(result.kind, "CATCH_OUT");
  assert.equal(result.sacrificeFly, true);
  assert.equal(result.runners.runsScored, 1);
  assert.equal(result.runners.outsRecorded, 1);
});

test("무사 1루의 빠른 내야 처리와 릴레이는 실제 두 주자를 병살 처리한다", () => {
  const result = resolveBaseRunning(input({
    bases: { first: runner("cpu-park-junho", 1, 55), second: null, third: null },
    defense: opportunity({ secureTimeMs: 620, ballArrivalTimeMs: 580, throwToFirstArrivalTimeMs: 2_200 }),
  }));
  assert.equal(result.kind, "DOUBLE_PLAY");
  assert.equal(result.runners.outsRecorded, 2);
  assert.deepEqual(new Set(result.runners.outRunnerIds), new Set([fastBatter.id, batter.id]));
});

test("2루 포스아웃 뒤 1루 송구가 늦으면 야수선택이며 앞선 강제 주자는 진루한다", () => {
  const result = resolveBaseRunning(input({
    bases: {
      first: runner("cpu-park-junho", 1, 55),
      second: runner("cpu-jung-mingyu", 2),
      third: runner("cpu-han-doyoon", 3),
    },
    defense: opportunity({ secureTimeMs: 1_050 }),
  }));
  assert.equal(result.kind, "FIELDER_CHOICE");
  assert.equal(result.hitValue, 0);
  assert.deepEqual(result.runners.outRunnerIds, ["cpu-park-junho"]);
  assert.deepEqual(result.runners.scoredRunnerIds, ["cpu-han-doyoon"]);
  assert.equal(result.runners.nextBases.first?.playerId, batter.id);
  assert.equal(result.runners.nextBases.third?.playerId, "cpu-jung-mingyu");
});

test("2아웃에서는 병살을 시도하지 않고 타자 주자 1루 아웃만 기록한다", () => {
  const result = resolveBaseRunning(input({
    bases: { first: runner("cpu-park-junho", 1), second: null, third: null },
    outsBeforePlay: 2,
  }));
  assert.equal(result.kind, "GROUND_OUT");
  assert.equal(result.runners.outsRecorded, 1);
});

test("수비가 늦으면 내야안타가 되고 어려운 타구 미처리는 실책으로 기록하지 않는다", () => {
  const safe = resolveBaseRunning(input({
    defense: opportunity({ secured: true, throwToFirstArrivalTimeMs: 6_000 }),
  }));
  assert.equal(safe.kind, "HIT");
  assert.equal(safe.hitValue, 1);

  const hard = resolveBaseRunning(input({
    defense: opportunity({ secured: false, routine: false, errorProbability: 1 }),
  }));
  assert.equal(hard.kind, "HIT");
  assert.equal(hard.errorFielderId, null);
});

test("루틴 타구를 놓친 경우만 실책과 강제 진루를 기록한다", () => {
  const result = resolveBaseRunning(input({
    bases: {
      first: runner("cpu-park-junho", 1),
      second: runner("cpu-jung-mingyu", 2),
      third: runner("cpu-han-doyoon", 3),
    },
    defense: opportunity({ secured: false, routine: true, errorProbability: 1 }),
  }));
  assert.equal(result.kind, "ERROR");
  assert.equal(result.runners.runsScored, 1);
  assert.equal(result.hitValue, 0);
  assert.equal(result.errorFielderId, "kia-park-chanho");
});

test("파울과 깨진 주자 신원은 주루 엔진에 들어갈 수 없다", () => {
  assert.throws(() => resolveBaseRunning(input({ ball: ball({ fair: false, zone: "FOUL_LEFT" }) })));
  assert.throws(() => resolveBaseRunning(input({
    bases: {
      first: runner("cpu-park-junho", 1),
      second: runner("cpu-park-junho", 2),
      third: null,
    },
  })));
});
