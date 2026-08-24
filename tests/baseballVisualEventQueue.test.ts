import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  cameraForBattedBall,
  cameraForOfficialResult,
  cameraForRunnerResolution,
} from "../src/utils/games/baseball/cameraDirector.ts";
import {
  buildPlayVisualEvents,
  VISUAL_EVENT_SKIPPABLE_POLICY,
} from "../src/utils/games/baseball/visualEventQueue.ts";
import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import {
  createSoloVisualPlaybackPlan,
  resolveBaseballVisualPlaybackDisplayGame,
} from "../src/utils/games/baseball/soloPresentation.ts";
import type {
  BattedBall,
  ContactResolution,
  DefenseResolution,
  OfficialPlayResult,
  RunnerResolution,
  VisualEvent,
} from "../src/utils/games/baseball/types.ts";

function makeVisualEvent(
  id: string,
  kind: VisualEvent["kind"],
): VisualEvent {
  return {
    id,
    playId: "third-out-play",
    sequence: kind === "SCOREBOARD_UPDATE" ? 0 : 1,
    kind,
    camera: "DUGOUT",
    durationMs: 700,
    skippable: false,
    payload: {},
  };
}

test("3아웃 솔로 재생은 기존 공격 상태 O=3 판정 뒤 다음 half 스코어보드를 공개한다", () => {
  const before = createGameState("CPU", "1P", 701);
  before.inning = 3;
  before.half = "top";
  before.battingTeam = 0;
  before.count = { balls: 2, strikes: 1, outs: 2 };
  before.bases.first = {
    playerId: "cpu-park-junho",
    name: "박준호",
    speed: 81,
    currentBase: 1,
  };
  const after = structuredClone(before);
  after.revision += 1;
  after.half = "bottom";
  after.battingTeam = 1;
  after.count = { balls: 0, strikes: 0, outs: 0 };
  after.bases = { first: null, second: null, third: null };
  const beforeSnapshot = structuredClone(before);
  const afterSnapshot = structuredClone(after);

  const scoreboard = makeVisualEvent("scoreboard", "SCOREBOARD_UPDATE");
  const playResult = makeVisualEvent("play-result", "PLAY_RESULT");
  const plan = createSoloVisualPlaybackPlan({
    events: [scoreboard, playResult],
    displayBeforeResult: before,
    authoritativeAfterResult: after,
    showThirdOutSnapshot: true,
  });

  assert.deepEqual(plan.events.map((event) => event.kind), ["PLAY_RESULT", "SCOREBOARD_UPDATE"]);
  const resultDisplay = plan.displaySnapshotByEventId.get(playResult.id);
  assert.ok(resultDisplay);
  assert.equal(resultDisplay.inning, 3);
  assert.equal(resultDisplay.half, "top");
  assert.equal(resultDisplay.battingTeam, 0);
  assert.deepEqual(resultDisplay.count, { balls: 0, strikes: 0, outs: 3 });
  assert.equal(resultDisplay.bases.first?.playerId, "cpu-park-junho");

  const scoreboardDisplay = plan.displaySnapshotByEventId.get(scoreboard.id);
  assert.deepEqual(scoreboardDisplay, after);
  assert.equal(scoreboardDisplay?.half, "bottom");
  assert.equal(scoreboardDisplay?.count.outs, 0);
  assert.deepEqual(before, beforeSnapshot);
  assert.deepEqual(after, afterSnapshot);
});

function makeOfficial(
  overrides: Partial<OfficialPlayResult> = {},
): OfficialPlayResult {
  return {
    playId: "play-17",
    code: "BALL",
    batterId: "batter-1",
    pitcherId: "pitcher-1",
    outsRecorded: 0,
    runsScored: 0,
    hitValue: 0,
    rbi: 0,
    scoredRunnerIds: [],
    outRunnerIds: [],
    fielderIds: [],
    errorFielderId: null,
    plateAppearanceEnded: false,
    ...overrides,
  };
}

function makeContact(): ContactResolution {
  return {
    result: "IN_PLAY",
    timing: "GOOD",
    quality: "GOOD",
    timingError: 0.01,
    locationError: 0.04,
    pciOverlap: 0.86,
    batterId: "batter-1",
    pitcherId: "pitcher-1",
    swingType: "NORMAL",
    pitchType: "fourSeam",
  };
}

function makeBall(overrides: Partial<BattedBall> = {}): BattedBall {
  return {
    id: "ball-17",
    batterId: "batter-1",
    exitVelocity: 148,
    launchAngle: 21,
    horizontalAngle: -16,
    spin: 2_100,
    hangTime: 2_350,
    distance: 96,
    type: "LINER",
    zone: "LCF",
    fair: true,
    ...overrides,
  };
}

function makeDefense(): DefenseResolution {
  return {
    result: "SAFE",
    primaryFielderId: "left-fielder",
    primaryPosition: "LF",
    assistingFielderIds: ["shortstop"],
    ballArrivalTimeMs: 2_350,
    fielderArrivalTimeMs: 2_520,
    throwArrivalTimeMs: 3_400,
    fieldingProbability: 0.31,
    errorProbability: 0.04,
    outsRecorded: 0,
  };
}

function makeRunners(overrides: Partial<RunnerResolution> = {}): RunnerResolution {
  return {
    advances: [
      {
        runnerId: "runner-3",
        runnerName: "3루 주자",
        fromBase: 3,
        toBase: 4,
        result: "SCORE",
        startedAtMs: 0,
        arrivedAtMs: 1_650,
        isForce: false,
      },
      {
        runnerId: "batter-1",
        runnerName: "타자",
        fromBase: 0,
        toBase: 1,
        result: "SAFE",
        startedAtMs: 0,
        arrivedAtMs: 2_100,
        isForce: true,
      },
    ],
    nextBases: {
      first: {
        playerId: "batter-1",
        name: "타자",
        speed: 72,
        currentBase: 1,
      },
      second: null,
      third: null,
    },
    scoredRunnerIds: ["runner-3"],
    outRunnerIds: [],
    runsScored: 1,
    outsRecorded: 0,
    ...overrides,
  };
}

function kinds(events: ReturnType<typeof buildPlayVisualEvents>) {
  return events.map((event) => event.kind);
}

test("단순 볼·스트라이크는 판정만, 파울은 접촉과 타구 비행까지 만든다", () => {
  for (const code of ["BALL", "CALLED_STRIKE", "SWINGING_STRIKE", "FOUL"] as const) {
    const official = makeOfficial({ code });
    const events = buildPlayVisualEvents({
      playId: official.playId,
      official,
      contact: code === "FOUL" ? { ...makeContact(), result: "FOUL" } : null,
      ball: code === "FOUL"
        ? makeBall({ fair: false, zone: "FOUL_LEFT" })
        : null,
      defense: null,
      runners: null,
    });

    if (code === "FOUL") {
      assert.deepEqual(kinds(events), ["CONTACT", "BALL_FLIGHT", "PLAY_RESULT"]);
      assert.deepEqual(events.map((event) => event.camera), ["CONTACT", "FOUL", "FOUL"]);
    } else {
      assert.deepEqual(kinds(events), ["PLAY_RESULT"]);
      assert.equal(events[0].camera, "BATTER");
    }
  }
});

test("삼진과 볼넷은 점수판 갱신과 공식 판정 뒤 NEXT_BATTER로 끝난다", () => {
  for (const code of ["STRIKEOUT_SWINGING", "STRIKEOUT_LOOKING", "WALK"] as const) {
    const official = makeOfficial({
      code,
      outsRecorded: code === "WALK" ? 0 : 1,
      plateAppearanceEnded: true,
    });
    const events = buildPlayVisualEvents({
      playId: official.playId,
      official,
      contact: null,
      ball: null,
      defense: null,
      runners: null,
    });

    assert.deepEqual(kinds(events), [
      "SCOREBOARD_UPDATE",
      "PLAY_RESULT",
      "NEXT_BATTER",
    ]);
    assert.deepEqual(events.map((event) => event.camera), [
      "DUGOUT",
      "DUGOUT",
      "BATTER",
    ]);
  }
});

test("만루 볼넷 득점은 주자 진루부터 공식 판정까지 점수 흐름을 빠짐없이 만든다", () => {
  const official = makeOfficial({
    code: "WALK",
    rbi: 1,
    runsScored: 1,
    scoredRunnerIds: ["runner-3"],
    plateAppearanceEnded: true,
  });
  const runners = makeRunners({
    advances: [
      {
        runnerId: "runner-3",
        runnerName: "3루 주자",
        fromBase: 3,
        toBase: 4,
        result: "SCORE",
        startedAtMs: 0,
        arrivedAtMs: 1_200,
        isForce: true,
      },
      {
        runnerId: "runner-2",
        runnerName: "2루 주자",
        fromBase: 2,
        toBase: 3,
        result: "SAFE",
        startedAtMs: 0,
        arrivedAtMs: 1_100,
        isForce: true,
      },
      {
        runnerId: "runner-1",
        runnerName: "1루 주자",
        fromBase: 1,
        toBase: 2,
        result: "SAFE",
        startedAtMs: 0,
        arrivedAtMs: 1_000,
        isForce: true,
      },
      {
        runnerId: "batter-1",
        runnerName: "타자",
        fromBase: 0,
        toBase: 1,
        result: "SAFE",
        startedAtMs: 0,
        arrivedAtMs: 900,
        isForce: true,
      },
    ],
    nextBases: {
      first: { playerId: "batter-1", name: "타자", speed: 72, currentBase: 1 },
      second: { playerId: "runner-1", name: "1루 주자", speed: 70, currentBase: 2 },
      third: { playerId: "runner-2", name: "2루 주자", speed: 68, currentBase: 3 },
    },
    scoredRunnerIds: ["runner-3"],
    runsScored: 1,
  });

  const events = buildPlayVisualEvents({
    playId: official.playId,
    official,
    contact: null,
    ball: null,
    defense: null,
    runners,
  });

  assert.deepEqual(kinds(events), [
    "RUNNER_ADVANCE",
    "RUN_SCORE",
    "SCOREBOARD_UPDATE",
    "PLAY_RESULT",
    "NEXT_BATTER",
  ]);
});

test("경기 종료 또는 공수 교대 판정 뒤에는 NEXT_BATTER를 예약하지 않는다", () => {
  for (const terminal of [
    { gameEnded: true, sideChanged: false },
    { gameEnded: false, sideChanged: true },
  ]) {
    const official = makeOfficial({
      code: "STRIKEOUT_LOOKING",
      outsRecorded: 1,
      plateAppearanceEnded: true,
    });
    const events = buildPlayVisualEvents({
      playId: official.playId,
      official,
      contact: null,
      ball: null,
      defense: null,
      runners: null,
      ...terminal,
    });

    assert.equal(events.some((event) => event.kind === "NEXT_BATTER"), false);
    assert.equal(events.at(-1)?.kind, "PLAY_RESULT");
  }
});

test("인플레이 득점은 접촉부터 다음 타자까지 정해진 순서로 재생된다", () => {
  const official = makeOfficial({
    code: "SINGLE_LEFT",
    hitValue: 1,
    rbi: 1,
    runsScored: 1,
    scoredRunnerIds: ["runner-3"],
    plateAppearanceEnded: true,
  });
  const input = {
    playId: official.playId,
    official,
    contact: makeContact(),
    ball: makeBall(),
    defense: makeDefense(),
    runners: makeRunners(),
  };
  const snapshot = JSON.parse(JSON.stringify(input));
  const events = buildPlayVisualEvents(input);

  assert.deepEqual(kinds(events), [
    "CONTACT",
    "BALL_FLIGHT",
    "FIELD_RESULT",
    "RUNNER_ADVANCE",
    "RUN_SCORE",
    "SCOREBOARD_UPDATE",
    "PLAY_RESULT",
    "NEXT_BATTER",
  ]);
  assert.deepEqual(events.map((event) => event.camera), [
    "CONTACT",
    "LEFT_CENTER",
    "LEFT_CENTER",
    "FIRST_BASE_LINE",
    "RUN_SCORED",
    "RUN_SCORED",
    "RUN_SCORED",
    "BATTER",
  ]);
  assert.deepEqual(input, snapshot, "큐 생성은 authoritative 입력을 수정하지 않아야 한다");
});

test("홈런은 수비 결과를 생략하고 홈런 전용 흐름을 만든다", () => {
  const official = makeOfficial({
    code: "HOME_RUN_RIGHT",
    hitValue: 4,
    rbi: 2,
    runsScored: 2,
    scoredRunnerIds: ["runner-1", "batter-1"],
    plateAppearanceEnded: true,
  });
  const runners = makeRunners({
    scoredRunnerIds: ["runner-1", "batter-1"],
    runsScored: 2,
  });
  const events = buildPlayVisualEvents({
    playId: official.playId,
    official,
    contact: { ...makeContact(), quality: "PERFECT" },
    ball: makeBall({
      zone: "RF",
      horizontalAngle: 29,
      launchAngle: 31,
      distance: 128,
      type: "FLY",
      hangTime: 4_200,
    }),
    defense: { ...makeDefense(), result: "NO_PLAY" },
    runners,
  });

  assert.deepEqual(kinds(events), [
    "CONTACT",
    "BALL_FLIGHT",
    "RUNNER_ADVANCE",
    "RUN_SCORE",
    "SCOREBOARD_UPDATE",
    "PLAY_RESULT",
    "NEXT_BATTER",
  ]);
  assert.equal(events[1].camera, "HOME_RUN");
  assert.equal(events[5].camera, "HOME_RUN");
  assert.ok(events[1].durationMs >= 2_400);
});

test("모든 이벤트 ID와 sequence는 안정적이고 연속이며 payload는 JSON 왕복 가능하다", () => {
  const official = makeOfficial({
    code: "GROUND_OUT_SS",
    outsRecorded: 1,
    outRunnerIds: ["batter-1"],
    fielderIds: ["shortstop", "first-baseman"],
    plateAppearanceEnded: true,
  });
  const input = {
    playId: official.playId,
    official,
    contact: makeContact(),
    ball: makeBall({ type: "GROUND", zone: "SS", hangTime: 980, distance: 37 }),
    defense: { ...makeDefense(), result: "GROUND_OUT", outsRecorded: 1 },
    runners: makeRunners({
      advances: [],
      scoredRunnerIds: [],
      outRunnerIds: ["batter-1"],
      runsScored: 0,
      outsRecorded: 1,
    }),
  };
  const first = buildPlayVisualEvents(input);
  const replay = buildPlayVisualEvents(input);

  assert.deepEqual(replay, first);
  assert.deepEqual(first.map((event) => event.sequence), first.map((_, index) => index));
  assert.equal(new Set(first.map((event) => event.id)).size, first.length);
  assert.ok(first.every((event) => event.id.startsWith(`${official.playId}:visual:`)));
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first);
  assert.ok(first.every((event) => event.durationMs > 0));
});

test("타구·결과 카메라는 구역, 땅볼, 파울, 홈런, 득점을 우선순위대로 선택한다", () => {
  assert.equal(cameraForBattedBall(makeBall({ zone: "LF" })), "LEFT_FIELD");
  assert.equal(cameraForBattedBall(makeBall({ zone: "LCF" })), "LEFT_CENTER");
  assert.equal(cameraForBattedBall(makeBall({ zone: "CF" })), "CENTER_FIELD");
  assert.equal(cameraForBattedBall(makeBall({ zone: "RCF" })), "RIGHT_CENTER");
  assert.equal(cameraForBattedBall(makeBall({ zone: "RF" })), "RIGHT_FIELD");
  assert.equal(
    cameraForBattedBall(makeBall({ type: "GROUND", zone: "RF" })),
    "INFIELD",
  );
  assert.equal(
    cameraForBattedBall(makeBall({ fair: false, zone: "FOUL_RIGHT" })),
    "FOUL",
  );
  assert.equal(
    cameraForOfficialResult(makeOfficial({ code: "FOUL" }), makeBall()),
    "FOUL",
  );
  assert.equal(
    cameraForOfficialResult(makeOfficial({ code: "HOME_RUN_LEFT", runsScored: 1 })),
    "HOME_RUN",
  );
  assert.equal(
    cameraForOfficialResult(makeOfficial({ code: "SINGLE_CENTER", runsScored: 1 })),
    "RUN_SCORED",
  );
});

test("공통 재생 HUD는 SCOREBOARD_UPDATE 전 점수를 유지하고 이후 이벤트에도 새 점수를 누적한다", () => {
  const before = createGameState("CPU", "1P", 702);
  const after = structuredClone(before);
  after.teams[1].runs = 1;
  const contact = makeVisualEvent("contact-score", "CONTACT");
  const runScore = makeVisualEvent("run-score", "RUN_SCORE");
  const scoreboard = makeVisualEvent("scoreboard-score", "SCOREBOARD_UPDATE");
  const playResult = makeVisualEvent("play-result-score", "PLAY_RESULT");
  const plan = createSoloVisualPlaybackPlan({
    events: [contact, runScore, scoreboard, playResult],
    displayBeforeResult: before,
    authoritativeAfterResult: after,
    showThirdOutSnapshot: false,
  });

  assert.equal(resolveBaseballVisualPlaybackDisplayGame(plan, before, contact.id).teams[1].runs, 0);
  assert.equal(resolveBaseballVisualPlaybackDisplayGame(plan, before, runScore.id).teams[1].runs, 0);
  assert.equal(resolveBaseballVisualPlaybackDisplayGame(plan, before, scoreboard.id).teams[1].runs, 1);
  assert.equal(resolveBaseballVisualPlaybackDisplayGame(plan, before, playResult.id).teams[1].runs, 1);
  assert.equal(resolveBaseballVisualPlaybackDisplayGame(plan, before, "unknown-event").teams[1].runs, 0);
});

test("주루 카메라는 OUT 경합을 우선하고 1·3루 목적지를 전용 라인 장면으로 고른다", () => {
  const safeFirst = makeRunners({
    advances: [{
      runnerId: "batter-1",
      runnerName: "타자",
      fromBase: 0,
      toBase: 1,
      result: "SAFE",
      startedAtMs: 0,
      arrivedAtMs: 900,
      isForce: true,
    }],
    scoredRunnerIds: [],
    outRunnerIds: [],
    runsScored: 0,
    outsRecorded: 0,
  });
  assert.equal(cameraForRunnerResolution(safeFirst), "FIRST_BASE_LINE");

  const safeThird = makeRunners({
    advances: [{
      runnerId: "runner-2",
      runnerName: "2루 주자",
      fromBase: 2,
      toBase: 3,
      result: "SAFE",
      startedAtMs: 0,
      arrivedAtMs: 1_000,
      isForce: false,
    }],
    scoredRunnerIds: [],
    outRunnerIds: [],
    runsScored: 0,
    outsRecorded: 0,
  });
  assert.equal(cameraForRunnerResolution(safeThird), "THIRD_BASE_LINE");

  const contestedSecond = makeRunners({
    advances: [
      safeFirst.advances[0],
      {
        runnerId: "runner-1",
        runnerName: "1루 주자",
        fromBase: 1,
        toBase: 2,
        result: "OUT",
        startedAtMs: 0,
        arrivedAtMs: 1_100,
        outAtMs: 1_050,
        isForce: true,
      },
    ],
    scoredRunnerIds: [],
    outRunnerIds: ["runner-1"],
    runsScored: 0,
    outsRecorded: 1,
  });
  assert.equal(
    cameraForRunnerResolution(contestedSecond),
    "BASE_RUNNING",
    "1루 SAFE보다 2루 OUT 경합을 우선해야 한다",
  );

  const scoreOnly = makeRunners({
    advances: [{
      runnerId: "runner-3",
      runnerName: "3루 주자",
      fromBase: 3,
      toBase: 4,
      result: "SCORE",
      startedAtMs: 0,
      arrivedAtMs: 800,
      isForce: false,
    }],
  });
  assert.equal(cameraForRunnerResolution(scoreOnly), "BASE_RUNNING");
  assert.equal(cameraForRunnerResolution(null), "BASE_RUNNING");
});

test("RUNNER_ADVANCE만 전용 주루 카메라를 쓰고 득점 컷은 RUN_SCORED를 유지한다", () => {
  const official = makeOfficial({
    code: "SINGLE_LEFT",
    hitValue: 1,
    rbi: 1,
    runsScored: 1,
    scoredRunnerIds: ["runner-3"],
    plateAppearanceEnded: true,
  });
  const events = buildPlayVisualEvents({
    playId: official.playId,
    official,
    contact: makeContact(),
    ball: makeBall(),
    defense: makeDefense(),
    runners: makeRunners(),
  });
  assert.equal(events.find((event) => event.kind === "RUNNER_ADVANCE")?.camera, "FIRST_BASE_LINE");
  assert.equal(events.find((event) => event.kind === "RUN_SCORE")?.camera, "RUN_SCORED");
});

test("접촉·득점·점수판·판정 이벤트는 건너뛸 수 없다", () => {
  assert.equal(VISUAL_EVENT_SKIPPABLE_POLICY.CONTACT, false);
  assert.equal(VISUAL_EVENT_SKIPPABLE_POLICY.RUN_SCORE, false);
  assert.equal(VISUAL_EVENT_SKIPPABLE_POLICY.SCOREBOARD_UPDATE, false);
  assert.equal(VISUAL_EVENT_SKIPPABLE_POLICY.PLAY_RESULT, false);
});

test("시각 큐와 카메라 결정은 비결정적 전역값에 의존하지 않는다", () => {
  for (const relativePath of [
    "../src/utils/games/baseball/cameraDirector.ts",
    "../src/utils/games/baseball/visualEventQueue.ts",
  ]) {
    const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
    assert.doesNotMatch(source, /Math\.random|\bDate\b/);
  }
});
