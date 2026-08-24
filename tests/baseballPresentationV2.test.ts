import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createPitchVisualFrame,
  compressedRunnerElapsedMs,
  DEFAULT_PITCH_STAGE_PROJECTION,
  DEFAULT_RUNNER_DIAMOND_LAYOUT,
  FIRST_BASE_LINE_RUNNER_LAYOUT,
  derivePitchStageProjection,
  projectBattedBallToCamera,
  projectPitchFlightSample,
  projectRunnerAdvance,
  projectRunnerAdvanceToCamera,
  runnerAdvanceTerminalTimeMs,
  runnerDiamondLayoutForCamera,
  runnerResolutionTimelineEndMs,
  RUN_SCORED_RUNNER_LAYOUT,
  THIRD_BASE_LINE_RUNNER_LAYOUT,
} from "../src/utils/games/baseball/presentation.ts";
import { samplePitchFlight } from "../src/utils/games/baseball/pitchEngine.ts";
import type {
  BaseballCameraMode,
  BattedBall,
  PitchFlightState,
  RunnerAdvance,
  RunnerResolution,
} from "../src/utils/games/baseball/types.ts";

test("렌더링된 스트라이크존 사각형을 스테이지 기준 투구 좌표로 환산한다", () => {
  assert.deepEqual(
    derivePitchStageProjection(
      { left: 100, top: 40, width: 1_000, height: 500 },
      { left: 450, top: 240, width: 200, height: 250 },
    ),
    {
      leftPercent: 35,
      topPercent: 40,
      widthPercent: 20,
      heightPercent: 50,
    },
  );
  assert.equal(
    derivePitchStageProjection(
      { left: 0, top: 0, width: 0, height: 500 },
      { left: 0, top: 0, width: 100, height: 100 },
    ),
    null,
  );
});

const FOUR_SEAM_TRAJECTORY: PitchFlightState = {
  start: { x: 0.435, y: -0.38 },
  control1: { x: 0.4558, y: -0.0984 },
  control2: { x: 0.48245, y: 0.2624 },
  target: { x: 0.5, y: 0.5 },
  velocityKmh: 151,
  spinRate: 2_450,
  rotation: 18,
  progress: 0,
  breakX: 0,
  breakY: 0,
  pitchType: "fourSeam",
};

function battedBall(overrides: Partial<BattedBall> = {}): BattedBall {
  return {
    id: "presentation-ball",
    batterId: "batter-1",
    exitVelocity: 165,
    launchAngle: 28,
    horizontalAngle: -24,
    spin: 2_100,
    hangTime: 4_600,
    distance: 118,
    type: "FLY",
    zone: "LF",
    fair: true,
    ...overrides,
  };
}

function advance(overrides: Partial<RunnerAdvance> = {}): RunnerAdvance {
  return {
    runnerId: "runner-1",
    runnerName: "주자",
    fromBase: 0,
    toBase: 1,
    result: "SAFE",
    startedAtMs: 500,
    arrivedAtMs: 4_500,
    isForce: true,
    ...overrides,
  };
}

test("samplePitchFlight 결과를 스테이지 % 좌표·scale·rotation으로 그대로 투영한다", () => {
  const sample = samplePitchFlight(FOUR_SEAM_TRAJECTORY, 0.5);
  const projected = projectPitchFlightSample(sample);

  assert.equal(
    projected.position.xPercent,
    Math.round((DEFAULT_PITCH_STAGE_PROJECTION.leftPercent
      + sample.position.x * DEFAULT_PITCH_STAGE_PROJECTION.widthPercent) * 10_000) / 10_000,
  );
  assert.equal(
    projected.position.yPercent,
    Math.round((DEFAULT_PITCH_STAGE_PROJECTION.topPercent
      + sample.position.y * DEFAULT_PITCH_STAGE_PROJECTION.heightPercent) * 10_000) / 10_000,
  );
  assert.equal(projected.scale, Math.round(sample.scale * 10_000) / 10_000);
  assert.equal(projected.rotation, Math.round(sample.rotation * 1_000) / 1_000);
});

test("투구 프레임은 공 본체 하나와 이전 진행률 잔상 10개만 만든다", () => {
  const frame = createPitchVisualFrame(FOUR_SEAM_TRAJECTORY, 0.72);
  assert.ok(frame.body);
  assert.equal(frame.body.opacity, 1);
  assert.equal(frame.trails.length, 10);
  assert.ok(frame.trails.every((trail) => trail.progress < frame.body.progress));
  assert.ok(frame.trails.every((trail, index) => index === 0 || trail.progress <= frame.trails[index - 1].progress));
  assert.ok(frame.trails.every((trail) => trail.opacity < 1));
  assert.deepEqual(frame, createPitchVisualFrame(FOUR_SEAM_TRAJECTORY, 0.72));
});

test("포심 잔상은 새 꾸민 궤적이 아니라 엔진 샘플을 정확히 따른다", () => {
  const progress = 0.8;
  const gap = 0.05;
  const frame = createPitchVisualFrame(FOUR_SEAM_TRAJECTORY, progress, { trailProgressGap: gap });
  const expectedFirstTrail = projectPitchFlightSample(
    samplePitchFlight(FOUR_SEAM_TRAJECTORY, progress - gap),
  );
  assert.deepEqual(frame.trails[0].position, expectedFirstTrail.position);

  const terminal = createPitchVisualFrame(FOUR_SEAM_TRAJECTORY, 1);
  const targetSample = projectPitchFlightSample(samplePitchFlight(FOUR_SEAM_TRAJECTORY, 1));
  assert.deepEqual(terminal.body.position, targetSample.position);
  assert.deepEqual(samplePitchFlight(FOUR_SEAM_TRAJECTORY, 1).position, FOUR_SEAM_TRAJECTORY.target);
});

test("타구는 수평·발사 각도와 비거리·체공 시간을 쓰고 카메라별로 다른 화면 좌표를 만든다", () => {
  const ball = battedBall();
  const snapshot = structuredClone(ball);
  const left = projectBattedBallToCamera(ball, 0.55);
  const replay = projectBattedBallToCamera(ball, 0.55, "REPLAY");

  assert.equal(left.camera, "LEFT_FIELD");
  assert.notDeepEqual(left.position, replay.position);
  assert.ok(left.world.lateralMeters < 0);
  assert.ok(left.world.depthMeters > 0);
  assert.ok(left.world.heightMeters > 0);
  assert.equal(left.elapsedMs, 2_530);
  assert.ok(left.scale >= 0.45 && left.scale <= 1.35);
  assert.ok(left.opacity >= 0 && left.opacity <= 1);
  assert.deepEqual(ball, snapshot);
});

test("모든 카메라의 타구 좌표는 유한하고 스테이지 범위를 벗어나지 않는다", () => {
  const cameras: BaseballCameraMode[] = [
    "BATTER", "PITCHER", "CONTACT", "INFIELD", "LEFT_FIELD", "LEFT_CENTER", "CENTER_FIELD",
    "RIGHT_CENTER", "RIGHT_FIELD", "FOUL", "FIRST_BASE_LINE", "THIRD_BASE_LINE",
    "BASE_RUNNING", "HOME_RUN", "RUN_SCORED", "DUGOUT", "REPLAY",
  ];
  for (const camera of cameras) {
    for (const progress of [-1, 0, 0.5, 1, 2]) {
      const sample = projectBattedBallToCamera(battedBall(), progress, camera);
      assert.ok(Number.isFinite(sample.position.xPercent));
      assert.ok(Number.isFinite(sample.position.yPercent));
      assert.ok(sample.position.xPercent >= 0 && sample.position.xPercent <= 100);
      assert.ok(sample.position.yPercent >= 0 && sample.position.yPercent <= 100);
      assert.ok(sample.progress >= 0 && sample.progress <= 1);
    }
  }
});

test("홈런 주자는 직선이 아니라 홈→1→2→3→홈 각 베이스를 순서대로 통과한다", () => {
  const homeRun = advance({
    toBase: 4,
    result: "SCORE",
    startedAtMs: 0,
    arrivedAtMs: 4_000,
  });
  assert.deepEqual(projectRunnerAdvance(homeRun, 0).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.home);
  assert.deepEqual(projectRunnerAdvance(homeRun, 1_000).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.first);
  assert.deepEqual(projectRunnerAdvance(homeRun, 2_000).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.second);
  assert.deepEqual(projectRunnerAdvance(homeRun, 3_000).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.third);
  assert.deepEqual(projectRunnerAdvance(homeRun, 4_000).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.home);
  assert.equal(projectRunnerAdvance(homeRun, 3_999).status, "RUNNING");
  assert.equal(projectRunnerAdvance(homeRun, 4_000).status, "SCORE");
});

test("SAFE는 도착루에 멈추고 OUT은 outAtMs 시점 위치에서 고정된다", () => {
  const safe = advance();
  assert.equal(projectRunnerAdvance(safe, 0).status, "WAITING");
  assert.equal(projectRunnerAdvance(safe, 2_500).status, "RUNNING");
  assert.equal(projectRunnerAdvance(safe, 4_500).status, "SAFE");
  assert.deepEqual(projectRunnerAdvance(safe, 9_000).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.first);

  const out = advance({ result: "OUT", outAtMs: 2_500 });
  const atOut = projectRunnerAdvance(out, 2_500);
  const afterOut = projectRunnerAdvance(out, 9_000);
  assert.equal(atOut.status, "OUT");
  assert.equal(atOut.progress, 0.5);
  assert.deepEqual(afterOut.position, atOut.position);
  assert.equal(afterOut.status, "OUT");
});

test("1·3루 라인 카메라는 실제 배경의 베이스 중심에 주자 종착점을 맞춘다", () => {
  const firstBaseAdvance = advance({
    startedAtMs: 0,
    arrivedAtMs: 1_000,
  });
  const first = projectRunnerAdvanceToCamera(
    firstBaseAdvance,
    1_000,
    "FIRST_BASE_LINE",
  );
  assert.equal(first.camera, "FIRST_BASE_LINE");
  assert.deepEqual(first.position, FIRST_BASE_LINE_RUNNER_LAYOUT.first);
  assert.equal(first.status, "SAFE");

  const thirdBaseAdvance = advance({
    fromBase: 2,
    toBase: 3,
    startedAtMs: 100,
    arrivedAtMs: 1_100,
  });
  const third = projectRunnerAdvanceToCamera(
    thirdBaseAdvance,
    1_100,
    "THIRD_BASE_LINE",
  );
  assert.equal(third.camera, "THIRD_BASE_LINE");
  assert.deepEqual(third.position, THIRD_BASE_LINE_RUNNER_LAYOUT.third);
  assert.equal(third.status, "SAFE");

  assert.equal(
    runnerDiamondLayoutForCamera("BASE_RUNNING"),
    DEFAULT_RUNNER_DIAMOND_LAYOUT,
  );
  assert.deepEqual(
    projectRunnerAdvanceToCamera(firstBaseAdvance, 500, "FIRST_BASE_LINE"),
    projectRunnerAdvanceToCamera(firstBaseAdvance, 500, "FIRST_BASE_LINE"),
  );
});

test("클램프된 이벤트 길이와 무관하게 100% 재생은 SAFE·SCORE 도착과 OUT 순간을 보장한다", () => {
  const safe = advance({
    runnerId: "safe-runner",
    arrivedAtMs: 4_500,
  });
  const scored = advance({
    runnerId: "scored-runner",
    fromBase: 3,
    toBase: 4,
    result: "SCORE",
    startedAtMs: 120,
    arrivedAtMs: 3_900,
  });
  const retired = advance({
    runnerId: "out-runner",
    result: "OUT",
    arrivedAtMs: 5_200,
    outAtMs: 2_600,
  });
  const resolution: RunnerResolution = {
    advances: [safe, scored, retired],
    nextBases: { first: null, second: null, third: null },
    scoredRunnerIds: [scored.runnerId],
    outRunnerIds: [retired.runnerId],
    runsScored: 1,
    outsRecorded: 1,
  };

  assert.equal(runnerAdvanceTerminalTimeMs(safe), 4_500);
  assert.equal(runnerAdvanceTerminalTimeMs(retired), 2_600);
  assert.equal(runnerResolutionTimelineEndMs(resolution), 4_500);
  assert.equal(compressedRunnerElapsedMs(resolution, 0.5), 2_250);
  assert.equal(compressedRunnerElapsedMs(resolution, 1), 4_500);

  const elapsedAtEnd = compressedRunnerElapsedMs(resolution, 1);
  assert.equal(projectRunnerAdvance(safe, elapsedAtEnd).status, "SAFE");
  assert.deepEqual(projectRunnerAdvance(safe, elapsedAtEnd).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.first);
  assert.equal(projectRunnerAdvance(scored, elapsedAtEnd).status, "SCORE");
  assert.deepEqual(projectRunnerAdvance(scored, elapsedAtEnd).position, DEFAULT_RUNNER_DIAMOND_LAYOUT.home);
  const outAtEnd = projectRunnerAdvance(retired, elapsedAtEnd);
  assert.equal(outAtEnd.status, "OUT");
  assert.deepEqual(outAtEnd.position, projectRunnerAdvance(retired, retired.outAtMs!).position);
});

test("득점 카메라의 주자 종착점은 clean v4 홈플레이트 중심이다", () => {
  const scored = advance({
    fromBase: 3,
    toBase: 4,
    result: "SCORE",
    startedAtMs: 0,
    arrivedAtMs: 1_650,
  });
  const sample = projectRunnerAdvanceToCamera(scored, scored.arrivedAtMs, "RUN_SCORED");
  assert.deepEqual(runnerDiamondLayoutForCamera("RUN_SCORED"), RUN_SCORED_RUNNER_LAYOUT);
  assert.deepEqual(sample.position, { xPercent: 50, yPercent: 80 });
  assert.equal(sample.status, "SCORE");
});

test("잘못된 경계·시간·배치 입력은 즉시 거부한다", () => {
  assert.throws(() => createPitchVisualFrame(FOUR_SEAM_TRAJECTORY, Number.NaN));
  assert.throws(() => createPitchVisualFrame(FOUR_SEAM_TRAJECTORY, 0.5, { trailProgressGap: 0 }));
  assert.throws(() => projectPitchFlightSample(samplePitchFlight(FOUR_SEAM_TRAJECTORY, 0.5), {
    ...DEFAULT_PITCH_STAGE_PROJECTION,
    widthPercent: 0,
  }));
  assert.throws(() => projectBattedBallToCamera(battedBall({ distance: -1 }), 0.5));
  assert.throws(() => projectBattedBallToCamera(battedBall({ hangTime: 0 }), 0.5));
  assert.throws(() => projectBattedBallToCamera(battedBall(), Number.POSITIVE_INFINITY));
  assert.throws(() => projectRunnerAdvance(advance({ arrivedAtMs: 500 }), 500));
  assert.throws(() => projectRunnerAdvance(advance({ result: "OUT" }), 500));
  assert.throws(() => projectRunnerAdvance(advance({ result: "HOLD" }), 500));
});

test("프레젠테이션 수학은 시계와 비결정적 난수에 의존하지 않는다", () => {
  const source = readFileSync(
    new URL("../src/utils/games/baseball/presentation.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random|\bDate\b|\bperformance\b/);
});
