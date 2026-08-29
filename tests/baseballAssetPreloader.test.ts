import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createBaseballIdleTaskScheduler,
  createBaseballImageAssetPreloader,
  startBaseballLazyAssetPreload,
  type BaseballIdleDeadline,
  type BaseballIdleTaskScheduler,
  type BaseballImageResource,
} from "../src/utils/games/baseball/assetPreloader.ts";

class FakeImage implements BaseballImageResource {
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
  readonly cancelledHandles: number[] = [];

  schedule(callback: (deadline: BaseballIdleDeadline) => void) {
    const handle = this.nextHandle;
    this.nextHandle += 1;
    this.tasks.set(handle, callback);
    return handle;
  }

  cancel(handle: unknown) {
    assert.equal(typeof handle, "number");
    this.tasks.delete(handle as number);
    this.cancelledHandles.push(handle as number);
  }

  get pendingCount() {
    return this.tasks.size;
  }

  runNext() {
    const next = this.tasks.entries().next();
    if (next.done) return false;
    const [handle, callback] = next.value;
    this.tasks.delete(handle);
    callback({ didTimeout: false, timeRemaining: () => 12 });
    return true;
  }
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

async function drainMicrotasks() {
  for (let index = 0; index < 6; index += 1) await Promise.resolve();
}

test("동시에 같은 야구 이미지를 요청해도 한 번만 생성하고 decode한다", async () => {
  const images: FakeImage[] = [];
  const preloader = createBaseballImageAssetPreloader(() => {
    const image = new FakeImage();
    images.push(image);
    return image;
  });

  const first = preloader.load("/ball.png");
  const second = preloader.load("/ball.png");
  assert.equal(first, second);
  assert.equal(images.length, 1);
  assert.equal(images[0]?.decoding, "async");

  images[0]?.onload?.();
  const result = await first;
  assert.deepEqual(result, { source: "/ball.png", status: "loaded", decoded: true });
  assert.equal(images[0]?.decodeCalls, 1);

  const third = await preloader.load("/ball.png");
  assert.equal(images.length, 1, "다음 투구에서도 새 Image를 만들면 안 된다");
  assert.deepEqual(third, result);
});

test("묶음 프리로드는 중복 URL을 제거하고 실패를 안전하게 집계한다", async () => {
  const images: FakeImage[] = [];
  const preloader = createBaseballImageAssetPreloader(() => {
    const image = new FakeImage();
    images.push(image);
    return image;
  });

  const pending = preloader.preload(["/field.png", "/field.png", "/batter.png"]);
  assert.equal(images.length, 2);
  images[0]?.onload?.();
  images[1]?.onerror?.();

  assert.deepEqual(await pending, {
    total: 2,
    idle: 0,
    pending: 0,
    loaded: 1,
    failed: 1,
    unsupported: 0,
    decoded: 1,
  });
});

test("Image API가 없는 환경에서도 대기하지 않고 unsupported로 종료한다", async () => {
  const preloader = createBaseballImageAssetPreloader(() => null);
  const progress = await preloader.preload(["/arena.png"]);
  assert.deepEqual(progress, {
    total: 1,
    idle: 0,
    pending: 0,
    loaded: 0,
    failed: 0,
    unsupported: 1,
    decoded: 0,
  });
});

test("decode 힌트가 실패해도 onload 이미지는 표시 가능한 상태로 유지한다", async () => {
  const image = new FakeImage();
  image.decode = () => {
    image.decodeCalls += 1;
    return Promise.reject(new Error("decode unavailable"));
  };
  const preloader = createBaseballImageAssetPreloader(() => image);
  const pending = preloader.load("/fallback.png");
  image.onload?.();

  assert.deepEqual(await pending, {
    source: "/fallback.png",
    status: "loaded",
    decoded: false,
  });
  assert.equal(image.decodeCalls, 1);
});

test("lazy 스케줄은 idle turn마다 한 장만 순차 로드하고 실패 뒤에도 계속한다", async () => {
  const scheduler = new ManualIdleScheduler();
  const firstLoad = deferred();
  const started: string[] = [];
  let activeLoads = 0;
  let maxActiveLoads = 0;
  const load = (source: string) => {
    started.push(source);
    activeLoads += 1;
    maxActiveLoads = Math.max(maxActiveLoads, activeLoads);

    const request = source === "/first.png"
      ? firstLoad.promise
      : source === "/broken.png"
        ? Promise.reject(new Error("broken optional asset"))
        : Promise.resolve();
    return request.finally(() => {
      activeLoads -= 1;
    });
  };

  const controller = startBaseballLazyAssetPreload({
    sources: [" /first.png ", "/broken.png", "/first.png", "/last.png"],
    load,
    scheduler,
  });

  assert.equal(scheduler.pendingCount, 1);
  assert.equal(scheduler.runNext(), true);
  await drainMicrotasks();
  assert.deepEqual(started, ["/first.png"]);
  assert.equal(scheduler.pendingCount, 0, "현재 이미지 완료 전 다음 idle 작업을 잡으면 안 된다");

  firstLoad.resolve();
  await drainMicrotasks();
  assert.equal(scheduler.pendingCount, 1);

  scheduler.runNext();
  await drainMicrotasks();
  assert.deepEqual(started, ["/first.png", "/broken.png"]);
  assert.equal(scheduler.pendingCount, 1, "실패한 이미지 뒤에도 다음 작업을 예약해야 한다");

  scheduler.runNext();
  await drainMicrotasks();
  assert.equal(await controller.finished, "completed");
  assert.deepEqual(started, ["/first.png", "/broken.png", "/last.png"]);
  assert.equal(maxActiveLoads, 1, "대용량 lazy 이미지를 동시에 시작하면 안 된다");
  assert.equal(scheduler.pendingCount, 0);
});

test("lazy 스케줄 취소는 예약된 idle 작업과 진행 중 로드 이후의 다음 예약을 막는다", async () => {
  const beforeStartScheduler = new ManualIdleScheduler();
  const neverStarted: string[] = [];
  const beforeStart = startBaseballLazyAssetPreload({
    sources: ["/one.png"],
    load: async (source) => {
      neverStarted.push(source);
    },
    scheduler: beforeStartScheduler,
  });

  beforeStart.cancel();
  assert.equal(await beforeStart.finished, "cancelled");
  assert.equal(beforeStartScheduler.pendingCount, 0);
  assert.deepEqual(beforeStartScheduler.cancelledHandles, [1]);
  assert.equal(beforeStartScheduler.runNext(), false);
  assert.deepEqual(neverStarted, []);

  const duringLoadScheduler = new ManualIdleScheduler();
  const inFlight = deferred();
  const started: string[] = [];
  const duringLoad = startBaseballLazyAssetPreload({
    sources: ["/one.png", "/two.png"],
    load: (source) => {
      started.push(source);
      return inFlight.promise;
    },
    scheduler: duringLoadScheduler,
  });

  duringLoadScheduler.runNext();
  await drainMicrotasks();
  assert.deepEqual(started, ["/one.png"]);
  duringLoad.cancel();
  assert.equal(await duringLoad.finished, "cancelled");
  inFlight.resolve();
  await drainMicrotasks();
  assert.equal(duringLoadScheduler.pendingCount, 0);
  assert.deepEqual(started, ["/one.png"]);
});

test("idle callback 미지원 환경은 취소 가능한 짧은 timer deadline으로 폴백한다", () => {
  let timeoutCallback: (() => void) | undefined;
  let timeoutDelay = -1;
  const timerHandle = { kind: "fallback-timer" };
  let cancelledHandle: unknown;
  const scheduler = createBaseballIdleTaskScheduler({
    setTimeout: (callback, delayMs) => {
      timeoutCallback = callback;
      timeoutDelay = delayMs;
      return timerHandle;
    },
    clearTimeout: (handle) => {
      cancelledHandle = handle;
    },
  });
  let receivedDeadline: BaseballIdleDeadline | undefined;

  const handle = scheduler.schedule((deadline) => {
    receivedDeadline = deadline;
  });
  assert.equal(handle, timerHandle);
  assert.equal(timeoutDelay, 50);
  timeoutCallback?.();
  assert.equal(receivedDeadline?.didTimeout, true);
  assert.equal(receivedDeadline?.timeRemaining(), 0);

  scheduler.cancel(handle);
  assert.equal(cancelledHandle, timerHandle);
});

test("지원 환경에서는 native idle callback과 timeout·cancel 계약을 사용한다", () => {
  const idleHandle = { kind: "native-idle" };
  let requestedTimeout = -1;
  let cancelledHandle: unknown;
  const scheduler = createBaseballIdleTaskScheduler({
    requestIdleCallback: (_callback, options) => {
      requestedTimeout = options?.timeout ?? -1;
      return idleHandle;
    },
    cancelIdleCallback: (handle) => {
      cancelledHandle = handle;
    },
    setTimeout: () => {
      throw new Error("native idle 환경에서 timer fallback을 사용하면 안 된다");
    },
    clearTimeout: () => undefined,
  });

  const handle = scheduler.schedule(() => undefined);
  assert.equal(handle, idleHandle);
  assert.equal(requestedTimeout, 1_000);
  scheduler.cancel(handle);
  assert.equal(cancelledHandle, idleHandle);
});

test("V2 manifest는 critical/lazy를 모두 제공하고 깨진 투구 atlas를 포함하지 않는다", () => {
  const manifestSource = readFileSync(
    new URL("../src/config/baseballV2Assets.ts", import.meta.url),
    "utf8",
  );
  assert.match(manifestSource, /group: "critical"/);
  assert.match(manifestSource, /group: "lazy"/);
  assert.match(manifestSource, /BASEBALL_V2_ASSET_REGISTRY/);
  assert.match(manifestSource, /baseball-ball-clean-v3\.png/);
  assert.match(manifestSource, /baseball-camera-infield-wide-v3\.png/);
  for (const camera of ["left-field", "left-center", "center-field", "right-center", "right-field"]) {
    assert.match(manifestSource, new RegExp(`baseball-camera-${camera}-v5\\.png`));
    assert.doesNotMatch(manifestSource, new RegExp(`baseball-camera-${camera}-v4\\.png`));
  }
  assert.match(manifestSource, /baseball-camera-run-scored-v4\.png/);
  assert.match(manifestSource, /baseball-camera-first-base-line-v4\.png/);
  assert.match(manifestSource, /baseball-camera-third-base-line-v4\.png/);
  assert.match(manifestSource, /id: "first-base-line-camera"/);
  assert.match(manifestSource, /id: "third-base-line-camera"/);
  for (const id of [
    "runner-blue",
    "runner-red",
    "fielder-blue",
    "fielder-red",
    "catcher-actions-red",
    "catcher-mitt",
  ]) {
    assert.match(manifestSource, new RegExp(`id: "${id}"`));
  }
  assert.match(manifestSource, /baseball-catcher-actions-red\.png/);
  assert.match(manifestSource, /baseball-catcher-mitt-v2\.png/);
  for (const unusedAsset of [
    "baseball-arena.png",
    "baseball-arena-swing.png",
    "baseball-pitching-field.png",
    "baseball-camera-infield.png",
    "baseball-batter-sprite.png",
  ]) {
    assert.doesNotMatch(manifestSource, new RegExp(unusedAsset.replace(".", "\\.")));
  }
  assert.doesNotMatch(manifestSource, /baseball-pitch-(fastball|curve|slider|changeup)-10\.png/);
});

test("게임 진입부는 유한 critical gate와 취소 가능한 idle 순차 preload를 사용한다", () => {
  const preloaderSource = readFileSync(
    new URL("../src/components/games/baseball/v2/GameAssetPreloader.tsx", import.meta.url),
    "utf8",
  );
  const viewSource = readFileSync(
    new URL("../src/views/games/BaseballGameView.tsx", import.meta.url),
    "utf8",
  );
  assert.match(preloaderSource, /CRITICAL_ASSET_TIMEOUT_MS = 5_000/);
  assert.match(preloaderSource, /BASEBALL_V2_CRITICAL_ASSET_SOURCES/);
  assert.match(preloaderSource, /BASEBALL_V2_LAZY_ASSET_SOURCES/);
  assert.match(preloaderSource, /startBaseballLazyAssetPreload/);
  assert.match(preloaderSource, /createBaseballIdleTaskScheduler/);
  assert.match(preloaderSource, /return lazyPreload\.cancel/);
  assert.doesNotMatch(
    preloaderSource,
    /preload\(BASEBALL_V2_LAZY_ASSET_SOURCES\)/,
    "lazy 에셋 전체를 Promise.all 경로로 보내면 안 된다",
  );
  assert.match(viewSource, /GameAssetPreloader/);
});
