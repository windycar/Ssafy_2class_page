import assert from "node:assert/strict";
import test from "node:test";

import {
  BASEBALL_FIELDER_THROW_END_PROGRESS_V2,
  BASEBALL_FIELDER_THROW_START_PROGRESS_V2,
  baseballFielderPhaseV2,
  createBaseballCatcherMittPresentationV2,
  createBaseballDefenseThrowPresentationV2,
  createBaseballFielderPresentationsV2,
  createBaseballRunnerPresentationsV2,
} from "../src/components/games/baseball/v2/BaseballPlayPresentationV2.ts";
import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import {
  DEFAULT_RUNNER_DIAMOND_LAYOUT,
  FIRST_BASE_LINE_RUNNER_LAYOUT,
  RUN_SCORED_RUNNER_LAYOUT,
} from "../src/utils/games/baseball/presentation.ts";
import type {
  BaseballGameState,
  DefenseResolution,
  RunnerAdvance,
  RunnerResolution,
  VisualEvent,
} from "../src/utils/games/baseball/types.ts";

test("포수 미트는 투구 후반에만 나타나 실제 도착점에서 포구한다", () => {
  const projection = {
    leftPercent: 40,
    topPercent: 35,
    widthPercent: 20,
    heightPercent: 40,
  };
  assert.equal(createBaseballCatcherMittPresentationV2({
    actualLocation: { x: 0.2, y: 0.8 },
    eventProgress: 0.63,
    projection,
    pitchingPerspective: false,
  }), null);

  const terminal = createBaseballCatcherMittPresentationV2({
    actualLocation: { x: 0.2, y: 0.8 },
    eventProgress: 1,
    projection,
    pitchingPerspective: false,
  });
  assert.ok(terminal);
  assert.equal(terminal.caught, true);
  assert.equal(terminal.point.x, 44);
  assert.equal(terminal.point.y, 67);
  assert.equal(terminal.point.opacity, 1);
});

function visualEvent(
  kind: VisualEvent["kind"],
  camera: VisualEvent["camera"],
): VisualEvent {
  return {
    id: `play-1:visual:${kind}`,
    playId: "play-1",
    sequence: 1,
    kind,
    camera,
    durationMs: 2_800,
    skippable: true,
    payload: {},
  };
}

function advance(overrides: Partial<RunnerAdvance> = {}): RunnerAdvance {
  return {
    runnerId: "batter-1",
    runnerName: "타자 주자",
    fromBase: 0,
    toBase: 1,
    result: "SAFE",
    startedAtMs: 120,
    arrivedAtMs: 4_500,
    isForce: true,
    ...overrides,
  };
}

function runnerResolution(
  advances: RunnerAdvance[],
): RunnerResolution {
  return {
    advances,
    nextBases: { first: null, second: null, third: null },
    scoredRunnerIds: advances.filter((item) => item.result === "SCORE").map((item) => item.runnerId),
    outRunnerIds: advances.filter((item) => item.result === "OUT").map((item) => item.runnerId),
    runsScored: advances.filter((item) => item.result === "SCORE").length,
    outsRecorded: advances.filter((item) => item.result === "OUT").length,
  };
}

function defense(overrides: Partial<DefenseResolution> = {}): DefenseResolution {
  return {
    result: "GROUND_OUT",
    primaryFielderId: "fielder-ss",
    primaryPosition: "SS",
    assistingFielderIds: [],
    ballArrivalTimeMs: 1_250,
    fielderArrivalTimeMs: 1_100,
    throwArrivalTimeMs: 2_050,
    fieldingProbability: 0.82,
    errorProbability: 0.03,
    outsRecorded: 1,
    ...overrides,
  };
}

function gameWithPlay(
  runners: RunnerResolution | null,
  fielding: DefenseResolution | null = null,
): BaseballGameState {
  const game = createGameState("원정", "홈", 771);
  game.activePlay = {
    playId: "play-1",
    sequence: 1,
    seed: 771,
    phase: "RESOLVED",
    batterId: game.teams[0].lineupPlayerIds[0],
    pitcherId: game.teams[1].pitcher.playerId,
    pitch: null,
    contact: null,
    battedBall: fielding ? {
      id: "ball-1",
      batterId: game.teams[0].lineupPlayerIds[0],
      exitVelocity: 142,
      launchAngle: 11,
      horizontalAngle: -8,
      spin: 1_850,
      hangTime: 1_950,
      distance: 62,
      type: "LINER",
      zone: "SS",
      fair: true,
    } : null,
    defense: fielding,
    runners,
    visualEvents: [],
  };
  return game;
}

test("shared 주루 빌더는 event duration이 아니라 authoritative 종착 시각을 0~1에 압축한다", () => {
  const safeAdvance = advance();
  const game = gameWithPlay(runnerResolution([safeAdvance]));
  const runners = createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: game,
    event: visualEvent("RUNNER_ADVANCE", "FIRST_BASE_LINE"),
    eventProgress: 1,
    cameraMode: "FIRST_BASE_LINE",
    runnerAssetSrc: "runner-blue.png",
  });

  assert.equal(runners.length, 1);
  assert.equal(runners[0].status, "SAFE");
  assert.deepEqual(runners[0].point, {
    x: FIRST_BASE_LINE_RUNNER_LAYOUT.first.xPercent,
    y: FIRST_BASE_LINE_RUNNER_LAYOUT.first.yPercent,
    scale: 0.9,
    opacity: 1,
  });
  assert.equal(runners[0].assetSrc, "runner-blue.png");
  assert.match(runners[0].baseLabel ?? "", /세이프/);
  assert.equal(runners[0].motion, "SLIDE");
  assert.equal(runners[0].facing, "LEFT");
});

test("비득점 주자는 초반에 전력질주하고 실제 종착 직전에 슬라이드한다", () => {
  const safeAdvance = advance();
  const game = gameWithPlay(runnerResolution([safeAdvance]));
  const event = visualEvent("RUNNER_ADVANCE", "FIRST_BASE_LINE");
  const atProgress = (eventProgress: number) => createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: game,
    event,
    eventProgress,
    cameraMode: "FIRST_BASE_LINE",
  })[0];

  const sprinting = atProgress(0.4);
  assert.equal(sprinting.status, "RUNNING");
  assert.equal(sprinting.motion, "SPRINT");

  const sliding = atProgress(0.95);
  assert.equal(sliding.status, "RUNNING");
  assert.equal(sliding.motion, "SLIDE");
});

test("주자 이미지는 베이스 경로의 실제 좌우 이동 방향을 바라본다", () => {
  const towardSecond = advance({
    runnerId: "runner-first",
    fromBase: 1,
    toBase: 2,
    startedAtMs: 0,
    arrivedAtMs: 1_600,
  });
  const towardHome = advance({
    runnerId: "runner-third",
    fromBase: 3,
    toBase: 4,
    result: "SCORE",
    startedAtMs: 0,
    arrivedAtMs: 1_600,
  });
  const game = gameWithPlay(runnerResolution([towardSecond, towardHome]));
  const moving = createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: game,
    event: visualEvent("RUNNER_ADVANCE", "INFIELD"),
    eventProgress: 0.5,
    cameraMode: "INFIELD",
  });

  assert.equal(moving.find((runner) => runner.playerId === "runner-first")?.facing, "LEFT");
  assert.equal(moving.find((runner) => runner.playerId === "runner-third")?.facing, "RIGHT");
});

test("shared 주루 빌더는 OUT을 outAtMs 위치에 고정하고 득점 컷은 홈플레이트에 둔다", () => {
  const retired = advance({ result: "OUT", outAtMs: 2_300 });
  const outGame = gameWithPlay(runnerResolution([retired]));
  const outRunner = createBaseballRunnerPresentationsV2({
    authoritativeGame: outGame,
    presentationGame: outGame,
    event: visualEvent("RUNNER_ADVANCE", "FIRST_BASE_LINE"),
    eventProgress: 1,
    cameraMode: "FIRST_BASE_LINE",
  })[0];
  assert.equal(outRunner.status, "OUT");
  assert.equal(outRunner.motion, "SLIDE");
  assert.ok(outRunner.point.x > FIRST_BASE_LINE_RUNNER_LAYOUT.first.xPercent);
  assert.ok(outRunner.point.x < FIRST_BASE_LINE_RUNNER_LAYOUT.home.xPercent);

  const scored = advance({
    runnerId: "runner-third",
    fromBase: 3,
    toBase: 4,
    result: "SCORE",
    startedAtMs: 0,
    arrivedAtMs: 1_650,
  });
  const scoreGame = gameWithPlay(runnerResolution([scored]));
  const scoreStart = createBaseballRunnerPresentationsV2({
    authoritativeGame: scoreGame,
    presentationGame: scoreGame,
    event: visualEvent("RUN_SCORE", "RUN_SCORED"),
    eventProgress: 0,
    cameraMode: "RUN_SCORED",
  })[0];
  assert.equal(scoreStart.status, "RUNNING");
  assert.equal(scoreStart.motion, "SPRINT");
  assert.notDeepEqual(
    { x: scoreStart.point.x, y: scoreStart.point.y },
    { x: RUN_SCORED_RUNNER_LAYOUT.home.xPercent, y: RUN_SCORED_RUNNER_LAYOUT.home.yPercent },
  );

  const scoreRunner = createBaseballRunnerPresentationsV2({
    authoritativeGame: scoreGame,
    presentationGame: scoreGame,
    event: visualEvent("RUN_SCORE", "RUN_SCORED"),
    eventProgress: 1,
    cameraMode: "RUN_SCORED",
  })[0];
  assert.equal(scoreRunner.status, "SCORE");
  assert.equal(scoreRunner.motion, "SCORE");
  assert.equal(scoreRunner.point.x, RUN_SCORED_RUNNER_LAYOUT.home.xPercent);
  assert.equal(scoreRunner.point.y, RUN_SCORED_RUNNER_LAYOUT.home.yPercent);
});

test("복수 득점 주자는 연출 중 겹침을 피한 뒤 마지막 프레임에 모두 홈을 밟는다", () => {
  const scoringAdvances = [
    advance({
      runnerId: "runner-second",
      runnerName: "2루 주자",
      fromBase: 2,
      toBase: 4,
      result: "SCORE",
      startedAtMs: 0,
      arrivedAtMs: 1_700,
    }),
    advance({
      runnerId: "runner-third",
      runnerName: "3루 주자",
      fromBase: 3,
      toBase: 4,
      result: "SCORE",
      startedAtMs: 100,
      arrivedAtMs: 1_500,
    }),
  ];
  const game = gameWithPlay(runnerResolution(scoringAdvances));
  const scoreEvent = visualEvent("RUN_SCORE", "RUN_SCORED");

  const midRunners = createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: game,
    event: scoreEvent,
    eventProgress: 0.5,
    cameraMode: "RUN_SCORED",
  });
  assert.notEqual(midRunners[0].point.x, midRunners[1].point.x);

  const finishedRunners = createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: game,
    event: scoreEvent,
    eventProgress: 1,
    cameraMode: "RUN_SCORED",
  });
  assert.equal(finishedRunners.length, 2);
  for (const runner of finishedRunners) {
    assert.equal(runner.status, "SCORE");
    assert.equal(runner.motion, "SCORE");
    assert.equal(runner.point.x, RUN_SCORED_RUNNER_LAYOUT.home.xPercent);
    assert.equal(runner.point.y, RUN_SCORED_RUNNER_LAYOUT.home.yPercent);
  }
});

test("타구·수비 재생 중에는 resolved 다음 루가 아니라 플레이 시작 전 주자를 보여준다", () => {
  const originalThird = advance({
    runnerId: "runner-third",
    runnerName: "기존 3루 주자",
    fromBase: 3,
    toBase: 4,
    result: "SCORE",
    startedAtMs: 0,
    arrivedAtMs: 1_650,
  });
  const batter = advance();
  const game = gameWithPlay(runnerResolution([originalThird, batter]));
  game.bases.first = {
    playerId: batter.runnerId,
    name: batter.runnerName,
    speed: 72,
    currentBase: 1,
  };

  const runners = createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: game,
    event: visualEvent("BALL_FLIGHT", "INFIELD"),
    eventProgress: 0.8,
    cameraMode: "INFIELD",
  });
  assert.deepEqual(runners.map((runner) => runner.playerId), [originalThird.runnerId]);
  assert.equal(runners[0].baseLabel, "3루");
  assert.equal(runners[0].status, "WAITING");
  assert.equal(runners[0].motion, "IDLE");
});

test("플레이가 없는 베이스 주자는 SAFE 상태에서도 정지 동작을 유지한다", () => {
  const game = gameWithPlay(null);
  const playerId = game.teams[0].lineupPlayerIds[0];
  game.bases.first = {
    playerId,
    name: "정지 주자",
    speed: 72,
    currentBase: 1,
  };

  const runner = createBaseballRunnerPresentationsV2({
    authoritativeGame: game,
    presentationGame: game,
    event: null,
    eventProgress: 0,
    cameraMode: "INFIELD",
  })[0];
  assert.equal(runner.status, "SAFE");
  assert.equal(runner.motion, "IDLE");
});

test("수비 연출은 접근→포구→송구→정지와 실패 동작을 판정별로 구분한다", () => {
  const successful = defense();
  assert.equal(baseballFielderPhaseV2(successful, 0.1), "APPROACH");
  assert.equal(baseballFielderPhaseV2(successful, 0.4), "SECURE");
  assert.equal(baseballFielderPhaseV2(successful, 0.7), "THROW");
  assert.equal(baseballFielderPhaseV2(successful, 1), "SETTLED");
  assert.equal(baseballFielderPhaseV2(defense({ result: "ERROR" }), 0.5), "MISS");
  assert.equal(baseballFielderPhaseV2(defense({ result: "SAFE" }), 0.5), "MISS");
});

test("수비수는 실제 타구 종착점 부근에 팀별 이미지와 판정 문구를 가진다", () => {
  const fielding = defense();
  const game = gameWithPlay(null, fielding);
  const fielders = createBaseballFielderPresentationsV2({
    game,
    event: visualEvent("FIELD_RESULT", "INFIELD"),
    eventProgress: 0.72,
    fielderAssetSrc: "fielder-red.png",
  });

  assert.equal(fielders.length, 1);
  assert.equal(fielders[0].phase, "THROW");
  assert.equal(fielders[0].assetSrc, "fielder-red.png");
  assert.equal(fielders[0].name, "유격수");
  assert.match(fielders[0].resultLabel, /송구/);
  assert.ok(fielders[0].facing === "LEFT" || fielders[0].facing === "RIGHT");
  assert.ok(fielders[0].point.x >= 12 && fielders[0].point.x <= 88);
  assert.ok(fielders[0].point.y >= 30 && fielders[0].point.y <= 82);
});

test("수비수 위치는 타구 비행 끝과 수비 결과 시작 경계에서 연속적이다", () => {
  const game = gameWithPlay(null, defense());
  const flightEnd = createBaseballFielderPresentationsV2({
    game,
    event: visualEvent("BALL_FLIGHT", "INFIELD"),
    eventProgress: 1,
  })[0];
  const fieldingStart = createBaseballFielderPresentationsV2({
    game,
    event: visualEvent("FIELD_RESULT", "INFIELD"),
    eventProgress: 0,
  })[0];

  assert.deepEqual(fieldingStart.point, flightEnd.point);
  assert.equal(fieldingStart.phase, "APPROACH");
});

test("송구 공은 THROW 경계에서 수비수 위치에 나타나 확정 시각에 판정 베이스에 도착한다", () => {
  const retiredBatter = advance({
    result: "OUT",
    outAtMs: 2_050,
  });
  const game = gameWithPlay(runnerResolution([retiredBatter]), defense());
  const event = visualEvent("FIELD_RESULT", "INFIELD");

  assert.equal(createBaseballDefenseThrowPresentationV2({
    game,
    event,
    eventProgress: BASEBALL_FIELDER_THROW_START_PROGRESS_V2 - 0.001,
  }), null);

  const start = createBaseballDefenseThrowPresentationV2({
    game,
    event,
    eventProgress: BASEBALL_FIELDER_THROW_START_PROGRESS_V2,
  });
  const fielder = createBaseballFielderPresentationsV2({
    game,
    event,
    eventProgress: BASEBALL_FIELDER_THROW_START_PROGRESS_V2,
  })[0];
  assert.ok(start);
  assert.equal(start.targetBase, 1);
  assert.equal(start.throwStartedAtMs, 1_250);
  assert.equal(start.throwArrivalTimeMs, 2_050);
  assert.equal(start.elapsedMs, start.throwStartedAtMs);
  assert.equal(start.body.x, fielder.point.x);
  assert.equal(start.body.y, fielder.point.y);
  assert.equal(start.trail.length, 10);

  const arrival = createBaseballDefenseThrowPresentationV2({
    game,
    event,
    eventProgress: BASEBALL_FIELDER_THROW_END_PROGRESS_V2,
  });
  assert.ok(arrival);
  assert.equal(arrival.elapsedMs, arrival.throwArrivalTimeMs);
  assert.equal(arrival.body.x, DEFAULT_RUNNER_DIAMOND_LAYOUT.first.xPercent);
  assert.equal(arrival.body.y, DEFAULT_RUNNER_DIAMOND_LAYOUT.first.yPercent);
  assert.equal(
    baseballFielderPhaseV2(defense(), BASEBALL_FIELDER_THROW_END_PROGRESS_V2),
    "THROW",
  );
  assert.equal(createBaseballDefenseThrowPresentationV2({
    game,
    event,
    eventProgress: BASEBALL_FIELDER_THROW_END_PROGRESS_V2 + 0.001,
  }), null);
});

test("포스 플레이 송구 공은 첫 아웃 베이스와 현재 카메라의 베이스 좌표를 사용한다", () => {
  const forceAtSecond = advance({
    runnerId: "runner-first",
    runnerName: "1루 주자",
    fromBase: 1,
    toBase: 2,
    result: "OUT",
    startedAtMs: 90,
    arrivedAtMs: 4_000,
    outAtMs: 1_800,
  });
  const game = gameWithPlay(
    runnerResolution([forceAtSecond]),
    defense({ result: "FORCE_OUT" }),
  );
  const event = visualEvent("FIELD_RESULT", "FIRST_BASE_LINE");
  const arrival = createBaseballDefenseThrowPresentationV2({
    game,
    event,
    eventProgress: BASEBALL_FIELDER_THROW_END_PROGRESS_V2,
  });

  assert.ok(arrival);
  assert.equal(arrival.targetBase, 2);
  assert.equal(arrival.throwArrivalTimeMs, forceAtSecond.outAtMs);
  assert.equal(arrival.body.x, FIRST_BASE_LINE_RUNNER_LAYOUT.second.xPercent);
  assert.equal(arrival.body.y, FIRST_BASE_LINE_RUNNER_LAYOUT.second.yPercent);
});

test("송구 공은 FIELD_RESULT의 실제 송구 판정에만 존재한다", () => {
  const game = gameWithPlay(null, defense());
  assert.equal(createBaseballDefenseThrowPresentationV2({
    game,
    event: visualEvent("BALL_FLIGHT", "INFIELD"),
    eventProgress: 0.7,
  }), null);

  const catchGame = gameWithPlay(null, defense({ result: "CATCH" }));
  assert.equal(createBaseballDefenseThrowPresentationV2({
    game: catchGame,
    event: visualEvent("FIELD_RESULT", "INFIELD"),
    eventProgress: 0.7,
  }), null);
});
