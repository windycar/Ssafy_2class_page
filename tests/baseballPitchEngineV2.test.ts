import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BASEBALL_PITCH_DEFINITIONS } from "../src/data/games/baseball/pitches.ts";
import {
  cubicBezierPoint,
  pitchPerspectiveScale,
  resolvePitch,
  samplePitchFlight,
} from "../src/utils/games/baseball/pitchEngine.ts";
import {
  createRandomState,
  deriveSeed,
  forkRandomState,
  nextRandomFloat,
} from "../src/utils/games/baseball/random.ts";
import type {
  BaseballPitchType,
  BaseballPlayer,
  PitchQuality,
  PitcherState,
  ResolvedPitch,
  Vec2,
} from "../src/utils/games/baseball/types.ts";

const TEST_PITCHER: BaseballPlayer = {
  id: "test-seven-pitch-pitcher",
  name: "테스트 투수",
  number: 99,
  position: "P",
  bats: "R",
  throws: "R",
  contact: 30,
  power: 30,
  eye: 50,
  speed: 55,
  fielding: 82,
  arm: 95,
  pitching: {
    velocity: 90,
    control: 90,
    movement: 92,
    stamina: 95,
    pitches: BASEBALL_PITCH_DEFINITIONS.map((definition) => ({
      type: definition.type,
      velocityKmh: definition.velocityKmh,
      control: Math.round(94 * definition.controlModifier),
      movement: definition.movementRating,
      usage: 1,
    })),
  },
};

const FULL_STRENGTH_STATE: PitcherState = {
  playerId: TEST_PITCHER.id,
  pitchCount: 0,
  stamina: 100,
  confidence: 80,
  velocityModifier: 0,
  controlModifier: 0,
  movementModifier: 0,
};

function throwPitch(
  seed: number,
  pitchType: BaseballPitchType = "fourSeam",
  timingQuality: PitchQuality = "PERFECT",
  pitcherState: PitcherState = FULL_STRENGTH_STATE,
): ResolvedPitch {
  return resolvePitch({
    seed,
    sequence: 17,
    pitcher: TEST_PITCHER,
    pitcherState,
    pitchType,
    intendedTarget: { x: 0.5, y: 0.48 },
    timingQuality,
  });
}

function distance(first: Vec2, second: Vec2) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function perpendicularDistance(point: Vec2, lineStart: Vec2, lineEnd: Vec2) {
  const deltaX = lineEnd.x - lineStart.x;
  const deltaY = lineEnd.y - lineStart.y;
  const length = Math.hypot(deltaX, deltaY);
  return Math.abs(deltaY * point.x - deltaX * point.y + lineEnd.x * lineStart.y
    - lineEnd.y * lineStart.x) / length;
}

test("uint32 난수 상태는 JSON 저장 후에도 동일하게 재생되고 파생 스트림이 격리된다", () => {
  const initial = createRandomState(0xfeed_cafe);
  const first = nextRandomFloat(initial);
  const restored = JSON.parse(JSON.stringify(first.state)) as typeof first.state;
  assert.deepEqual(nextRandomFloat(restored), nextRandomFloat(first.state));
  assert.ok(first.value >= 0 && first.value < 1);

  assert.equal(deriveSeed(1234, "pitch", 7), deriveSeed(1234, "pitch", 7));
  assert.notEqual(deriveSeed(1234, "pitch", 7), deriveSeed(1234, "contact", 7));
  assert.deepEqual(
    forkRandomState(initial, "location"),
    forkRandomState(initial, "location"),
  );
  assert.notDeepEqual(
    forkRandomState(initial, "location"),
    forkRandomState(initial, "velocity"),
  );
});

test("동일한 authoritative 입력은 완전히 같은 투구를 만들고 seed가 달라지면 변한다", () => {
  const first = throwPitch(20260823, "slider", "GOOD");
  const replay = throwPitch(20260823, "slider", "GOOD");
  const another = throwPitch(20260824, "slider", "GOOD");

  assert.deepEqual(replay, first);
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first, "투구 결과는 JSON 직렬화 가능해야 한다");
  assert.notDeepEqual(another, first);
});

test("7개 구종은 각 속도 범위를 지키고 서로 다른 후반 변화로 정확한 actual target에 도착한다", () => {
  const signatures = new Set<string>();

  for (const definition of BASEBALL_PITCH_DEFINITIONS) {
    const pitch = throwPitch(8800, definition.type);
    const repertoirePitch = TEST_PITCHER.pitching?.pitches.find(
      (candidate) => candidate.type === definition.type,
    );
    assert.ok(repertoirePitch);
    assert.ok(pitch.velocityKmh >= repertoirePitch.velocityKmh[0]);
    assert.ok(pitch.velocityKmh <= repertoirePitch.velocityKmh[1]);
    assert.ok(pitch.spinRate >= definition.spinRateRpm[0]);
    assert.ok(pitch.spinRate <= definition.spinRateRpm[1]);
    assert.deepEqual(pitch.trajectory.target, pitch.location.actual);
    assert.deepEqual(samplePitchFlight(pitch.trajectory, 1).position, pitch.location.actual);
    assert.deepEqual(
      cubicBezierPoint(
        pitch.trajectory.start,
        pitch.trajectory.control1,
        pitch.trajectory.control2,
        pitch.trajectory.target,
        1,
      ),
      pitch.location.actual,
    );

    signatures.add([
      pitch.trajectory.breakX.toFixed(4),
      pitch.trajectory.breakY.toFixed(4),
      pitch.flightDurationMs,
    ].join(":"));

    if (definition.type !== "fourSeam") {
      const early = samplePitchFlight(pitch.trajectory, 0.25).position;
      const late = samplePitchFlight(pitch.trajectory, 0.75).position;
      const earlyBreak = perpendicularDistance(
        early,
        pitch.trajectory.start,
        pitch.trajectory.target,
      );
      const lateBreak = perpendicularDistance(
        late,
        pitch.trajectory.start,
        pitch.trajectory.target,
      );
      assert.ok(lateBreak > earlyBreak * 2.5, `${definition.type} 변화가 후반에 집중되어야 한다`);
    }
  }

  assert.equal(signatures.size, 7);
  const fourSeam = throwPitch(8800, "fourSeam");
  const fourSeamLate = samplePitchFlight(fourSeam.trajectory, 0.75).position;
  assert.ok(perpendicularDistance(
    fourSeamLate,
    fourSeam.trajectory.start,
    fourSeam.trajectory.target,
  ) < 0.006, "포심은 거의 일직선이어야 한다");
  assert.ok(throwPitch(8800, "slider").trajectory.breakX > 0);
  assert.ok(throwPitch(8800, "cutter").trajectory.breakX < 0);
  assert.ok(
    throwPitch(8800, "fork").trajectory.breakY
      > throwPitch(8800, "curve").trajectory.breakY,
  );
});

test("체력이 낮아지면 같은 릴리스에서도 제구 오차가 커지고 구속과 구위가 저하된다", () => {
  const highStamina = throwPitch(4455, "slider", "PERFECT", FULL_STRENGTH_STATE);
  const tiredState: PitcherState = {
    ...FULL_STRENGTH_STATE,
    stamina: 12,
    confidence: 45,
  };
  const lowStamina = throwPitch(4455, "slider", "PERFECT", tiredState);
  const target = highStamina.location.intended;

  assert.ok(distance(lowStamina.location.actual, target) > distance(highStamina.location.actual, target));
  assert.ok(lowStamina.velocityKmh <= highStamina.velocityKmh);
  assert.ok(lowStamina.movement < highStamina.movement);
});

test("릴리스 timing quality가 나빠질수록 같은 난수에서 actual location 오차가 단조 증가한다", () => {
  const qualities = ["PERFECT", "GOOD", "NORMAL", "MISS"] as const;
  const errors = qualities.map((quality) => {
    const pitch = throwPitch(9911, "twoSeam", quality);
    return distance(pitch.location.actual, pitch.location.intended);
  });

  assert.ok(errors[0] < errors[1]);
  assert.ok(errors[1] < errors[2]);
  assert.ok(errors[2] < errors[3]);
});

test("원근 scale은 릴리스 0.18에서 플레이트 1.15까지 비선형으로 커진다", () => {
  assert.equal(pitchPerspectiveScale(0), 0.18);
  assert.equal(pitchPerspectiveScale(1), 1.15);
  assert.ok(pitchPerspectiveScale(0.5) > 0.43 && pitchPerspectiveScale(0.5) < 0.52);
  assert.ok(pitchPerspectiveScale(0.8) > 0.78 && pitchPerspectiveScale(0.8) < 0.9);
  assert.ok(pitchPerspectiveScale(0.8) - pitchPerspectiveScale(0.6)
    > pitchPerspectiveScale(0.4) - pitchPerspectiveScale(0.2));
});

test("결정 엔진은 Math.random과 Date에 의존하지 않는다", () => {
  for (const relativePath of [
    "../src/utils/games/baseball/random.ts",
    "../src/utils/games/baseball/pitchEngine.ts",
  ]) {
    const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
    assert.doesNotMatch(source, /Math\.random|\bDate\b/);
  }
});
