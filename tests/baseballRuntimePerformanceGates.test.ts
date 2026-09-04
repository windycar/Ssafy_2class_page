import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BASEBALL_PITCH_DEFINITIONS } from "../src/data/games/baseball/pitches.ts";
import {
  baseballVisualEventTerminalHoldMs,
  startBaseballVisualEventFrameLoop,
} from "../src/hooks/useBaseballVisualPlayback.ts";
import {
  createBaseballAnimationProgressSource,
} from "../src/utils/games/baseball/animationProgress.ts";
import {
  createBaseballImageAssetPreloader,
  startBaseballLazyAssetPreload,
  type BaseballIdleDeadline,
  type BaseballIdleTaskScheduler,
  type BaseballImageResource,
} from "../src/utils/games/baseball/assetPreloader.ts";
import type {
  BattedBall,
  BaseballPlayResultCode,
  DefenseResolution,
  OfficialPlayResult,
  RunnerResolution,
  VisualEvent,
} from "../src/utils/games/baseball/types.ts";
import {
  buildPlayVisualEvents,
} from "../src/utils/games/baseball/visualEventQueue.ts";

class ControlledImage implements BaseballImageResource {
  decoding?: string;
  src = "";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  decodeCalls = 0;

  decode() {
    this.decodeCalls += 1;
    return Promise.resolve();
  }
}

class ManualIdleScheduler implements BaseballIdleTaskScheduler {
  private nextHandle = 1;
  private readonly tasks = new Map<number, (deadline: BaseballIdleDeadline) => void>();

  schedule(callback: (deadline: BaseballIdleDeadline) => void) {
    const handle = this.nextHandle;
    this.nextHandle += 1;
    this.tasks.set(handle, callback);
    return handle;
  }

  cancel(handle: unknown) {
    this.tasks.delete(handle as number);
  }

  runNext() {
    const next = this.tasks.entries().next();
    if (next.done) return false;
    const [handle, callback] = next.value;
    this.tasks.delete(handle);
    callback({ didTimeout: false, timeRemaining: () => 12 });
    return true;
  }

  get pendingCount() {
    return this.tasks.size;
  }
}

async function drainMicrotasks() {
  for (let index = 0; index < 8; index += 1) await Promise.resolve();
}

test("critical → lazy → 다음 투구 수명주기에서도 URL별 생성·decode는 한 번뿐이다", async () => {
  const images: ControlledImage[] = [];
  const preloader = createBaseballImageAssetPreloader(() => {
    const image = new ControlledImage();
    images.push(image);
    return image;
  });

  const critical = preloader.preload(["/ball.webp", "/batter.webp", "/ball.webp"]);
  assert.equal(images.length, 2, "critical 묶음 안의 중복 URL은 새 Image를 만들면 안 된다");
  images.forEach((image) => image.onload?.());
  await critical;

  const scheduler = new ManualIdleScheduler();
  const lazy = startBaseballLazyAssetPreload({
    sources: ["/ball.webp", "/crowd.webp", "/crowd.webp"],
    load: preloader.load,
    scheduler,
  });

  assert.equal(scheduler.runNext(), true);
  await drainMicrotasks();
  assert.equal(images.length, 2, "critical에서 끝난 공은 lazy 단계에서 다시 만들면 안 된다");
  assert.equal(scheduler.pendingCount, 1);

  assert.equal(scheduler.runNext(), true);
  await drainMicrotasks();
  assert.equal(images.length, 3);
  images[2]?.onload?.();
  await drainMicrotasks();
  assert.equal(await lazy.finished, "completed");

  await Promise.all([
    preloader.load("/ball.webp"),
    preloader.load("/batter.webp"),
    preloader.load("/crowd.webp"),
  ]);
  assert.equal(images.length, 3, "다음 투구·재마운트 경로도 같은 캐시 Promise를 재사용해야 한다");
  assert.deepEqual(images.map((image) => image.decodeCalls), [1, 1, 1]);
});

function createFrameScheduler() {
  let now = 0;
  let nextHandle = 1;
  const callbacks = new Map<number, FrameRequestCallback>();
  return {
    scheduler: {
      requestFrame(callback: FrameRequestCallback) {
        const handle = nextHandle;
        nextHandle += 1;
        callbacks.set(handle, callback);
        return handle;
      },
      cancelFrame(handle: number) {
        callbacks.delete(handle);
      },
      now: () => now,
    },
    step(milliseconds: number) {
      now += milliseconds;
      const ready = [...callbacks.values()];
      callbacks.clear();
      ready.forEach((callback) => callback(now));
    },
    pending: () => callbacks.size,
  };
}

test("하나의 RAF 진행률 신호가 공·타구·주자 레이어를 같은 프레임으로 fan-out한다", () => {
  const source = createBaseballAnimationProgressSource();
  const received = {
    pitch: [] as number[],
    ball: [] as number[],
    runner: [] as number[],
  };
  const unsubscribers = [
    source.subscribe((progress) => received.pitch.push(progress)),
    source.subscribe((progress) => received.ball.push(progress)),
    source.subscribe((progress) => received.runner.push(progress)),
  ];
  const frames = createFrameScheduler();
  const actions: string[] = [];
  const event: VisualEvent = {
    id: "runtime-gate:visual:00:ball_flight",
    playId: "runtime-gate",
    sequence: 0,
    kind: "BALL_FLIGHT",
    camera: "CENTER_FIELD",
    durationMs: 48,
    skippable: true,
    payload: {},
  };
  const cancel = startBaseballVisualEventFrameLoop({
    playId: event.playId,
    event,
    initialProgress: 0,
    scheduler: frames.scheduler,
    dispatch: (action) => {
      actions.push(action.type);
      if (action.type === "TICK") source.setProgress(action.progress);
    },
  });

  for (let frame = 0; frame < 3; frame += 1) {
    assert.equal(frames.pending(), 1, "레이어 수와 무관하게 예약 RAF는 하나여야 한다");
    frames.step(16);
  }
  frames.step(16);

  assert.deepEqual(actions, ["TICK", "TICK", "TICK", "ADVANCE"]);
  assert.deepEqual(received.pitch, received.ball);
  assert.deepEqual(received.ball, received.runner);
  assert.deepEqual(received.pitch.map((value) => Number(value.toFixed(3))), [0.333, 0.667, 1]);
  assert.equal(frames.pending(), 0);

  unsubscribers.forEach((unsubscribe) => unsubscribe());
  cancel();
});

function official(code: BaseballPlayResultCode, runsScored = 0): OfficialPlayResult {
  const isHit = code.startsWith("SINGLE")
    || code.startsWith("DOUBLE")
    || code === "TRIPLE"
    || code.startsWith("HOME_RUN");
  const hitValue = code.startsWith("SINGLE")
    ? 1
    : code.startsWith("DOUBLE")
      ? 2
      : code === "TRIPLE"
        ? 3
        : code.startsWith("HOME_RUN")
          ? 4
          : 0;
  return {
    playId: `pace-${code}`,
    code,
    batterId: "batter-1",
    pitcherId: "pitcher-1",
    outsRecorded: code === "DOUBLE_PLAY" ? 2 : code.includes("OUT") ? 1 : 0,
    runsScored,
    hitValue: hitValue as 0 | 1 | 2 | 3 | 4,
    rbi: runsScored,
    scoredRunnerIds: runsScored > 0 ? ["runner-3"] : [],
    outRunnerIds: code === "DOUBLE_PLAY" ? ["runner-1", "batter-1"] : [],
    fielderIds: isHit || code === "WALK" ? [] : ["fielder-1"],
    errorFielderId: code === "ERROR" ? "fielder-1" : null,
    plateAppearanceEnded: true,
  };
}

function battedBall(
  code: BaseballPlayResultCode,
  index: number,
): BattedBall | null {
  if (code === "WALK" || code.startsWith("STRIKEOUT")) return null;
  const homeRun = code.startsWith("HOME_RUN");
  const ground = code.startsWith("GROUND") || code === "DOUBLE_PLAY" || code === "ERROR";
  return {
    id: `pace-ball-${index}`,
    batterId: "batter-1",
    exitVelocity: homeRun ? 166 : 142,
    launchAngle: ground ? 4 : homeRun ? 31 : 20,
    horizontalAngle: -18 + index * 4,
    spin: 2_100,
    hangTime: ground ? 1_050 : homeRun ? 4_100 : 2_350,
    distance: homeRun ? 124 : ground ? 34 : 91,
    type: ground ? "GROUND" : homeRun ? "FLY" : "LINER",
    zone: index % 3 === 0 ? "LF" : index % 3 === 1 ? "CF" : "RF",
    fair: true,
  };
}

function defense(code: BaseballPlayResultCode): DefenseResolution | null {
  if (code === "WALK" || code.startsWith("STRIKEOUT") || code.startsWith("HOME_RUN")) {
    return null;
  }
  const safe = code.startsWith("SINGLE")
    || code.startsWith("DOUBLE")
    || code === "TRIPLE"
    || code === "ERROR";
  return {
    result: code === "ERROR" ? "ERROR" : safe ? "SAFE" : "GROUND_OUT",
    primaryFielderId: "fielder-1",
    primaryPosition: "CF",
    assistingFielderIds: [],
    ballArrivalTimeMs: 1_750,
    fielderArrivalTimeMs: 1_900,
    throwArrivalTimeMs: 2_300,
    fieldingProbability: 0.72,
    errorProbability: 0.04,
    outsRecorded: code === "DOUBLE_PLAY" ? 2 : safe ? 0 : 1,
  };
}

function runners(code: BaseballPlayResultCode, runsScored: number): RunnerResolution | null {
  if (code.startsWith("STRIKEOUT")) return null;
  const homeRun = code.startsWith("HOME_RUN");
  const batterDestination = homeRun ? 4 : code.startsWith("DOUBLE") ? 2 : code === "TRIPLE" ? 3 : 1;
  return {
    advances: [
      {
        runnerId: "batter-1",
        runnerName: "타자",
        fromBase: 0,
        toBase: batterDestination,
        result: homeRun ? "SCORE" : code.includes("OUT") ? "OUT" : "SAFE",
        startedAtMs: 0,
        arrivedAtMs: 2_100,
        isForce: true,
      },
      ...(runsScored > 0 && !homeRun ? [{
        runnerId: "runner-3",
        runnerName: "3루 주자",
        fromBase: 3 as const,
        toBase: 4 as const,
        result: "SCORE" as const,
        startedAtMs: 0,
        arrivedAtMs: 1_650,
        isForce: false,
      }] : []),
    ],
    nextBases: { first: null, second: null, third: null },
    scoredRunnerIds: runsScored > 0 ? ["runner-3"] : [],
    outRunnerIds: code.includes("OUT") ? ["batter-1"] : [],
    runsScored,
    outsRecorded: code === "DOUBLE_PLAY" ? 2 : code.includes("OUT") ? 1 : 0,
  };
}

function sourceNumberConstant(source: string, name: string) {
  const match = source.match(new RegExp(`const ${name} = ([0-9_]+);`));
  assert.ok(match, `${name} 상수를 찾을 수 없습니다`);
  return Number(match[1].replaceAll("_", ""));
}

test("솔로 타격 기준 대표 4구 타석 10종은 10~25초이고 긴 연출은 스킵 가능하다", () => {
  const controllerSource = readFileSync(
    new URL("../src/hooks/useBaseballSoloController.ts", import.meta.url),
    "utf8",
  );
  const readyDelay = sourceNumberConstant(controllerSource, "CPU_READY_DELAY_MS");
  const windupDuration = sourceNumberConstant(controllerSource, "PITCH_WINDUP_DURATION_MS");
  const fourSeam = BASEBALL_PITCH_DEFINITIONS.find((pitch) => pitch.type === "fourSeam")!;
  const setupFlightDuration = (fourSeam.flightDurationMs[0] + fourSeam.flightDurationMs[1]) / 2;
  const setupPitchEvents = buildPlayVisualEvents({
    playId: "pace-setup",
    official: { ...official("BALL"), playId: "pace-setup", plateAppearanceEnded: false },
    contact: null,
    ball: null,
    defense: null,
    runners: null,
  });
  const setupPitchBudget = readyDelay
    + windupDuration
    + setupFlightDuration
    + setupPitchEvents.reduce(
      (sum, event) => sum + event.durationMs + baseballVisualEventTerminalHoldMs(event),
      0,
    );
  const scenarios: ReadonlyArray<readonly [BaseballPlayResultCode, number]> = [
    ["STRIKEOUT_LOOKING", 0],
    ["WALK", 0],
    ["GROUND_OUT_SS", 0],
    ["FLY_OUT_CF", 0],
    ["SINGLE_LEFT", 0],
    ["SINGLE_CENTER", 1],
    ["DOUBLE_CENTER", 1],
    ["TRIPLE", 1],
    ["HOME_RUN_CENTER", 1],
    ["ERROR", 0],
  ];

  const budgets = scenarios.map(([code, runsScored], index) => {
    const pitch = BASEBALL_PITCH_DEFINITIONS[index % BASEBALL_PITCH_DEFINITIONS.length]!;
    const finalFlightDuration = (pitch.flightDurationMs[0] + pitch.flightDurationMs[1]) / 2;
    const officialResult = official(code, runsScored);
    const ball = battedBall(code, index);
    const events = buildPlayVisualEvents({
      playId: officialResult.playId,
      official: officialResult,
      contact: ball ? {
        result: "IN_PLAY",
        timing: "GOOD",
        quality: "GOOD",
        timingError: 0.02,
        locationError: 0.03,
        pciOverlap: 0.84,
        batterId: "batter-1",
        pitcherId: "pitcher-1",
        swingType: "NORMAL",
        pitchType: pitch.type,
      } : null,
      ball,
      defense: defense(code),
      runners: runners(code, runsScored),
    });
    const finalPresentationBudget = events.reduce(
      (sum, event) => sum + event.durationMs + baseballVisualEventTerminalHoldMs(event),
      0,
    );
    const total = setupPitchBudget * 3
      + readyDelay
      + windupDuration
      + finalFlightDuration
      + finalPresentationBudget;

    for (const event of events) {
      if (["BALL_FLIGHT", "FIELD_RESULT", "RUNNER_ADVANCE", "NEXT_BATTER", "HALF_INNING"].includes(event.kind)) {
        assert.equal(event.skippable, true, `${code}의 ${event.kind}는 스킵 가능해야 한다`);
      }
    }
    return { code, total };
  });

  for (const budget of budgets) {
    assert.ok(
      budget.total >= 10_000 && budget.total <= 25_000,
      `${budget.code} 대표 4구 타석 예산 ${budget.total}ms가 목표 범위를 벗어났습니다`,
    );
  }
  assert.equal(budgets.length, 10);
});
