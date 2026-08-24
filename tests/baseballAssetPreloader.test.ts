import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createBaseballImageAssetPreloader,
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
    assert.match(manifestSource, new RegExp(`baseball-camera-${camera}-v4\\.png`));
  }
  for (const unusedAsset of [
    "baseball-arena.png",
    "baseball-arena-swing.png",
    "baseball-pitching-field.png",
    "baseball-camera-infield.png",
    "baseball-batter-sprite.png",
    "baseball-catcher-actions-red.png",
  ]) {
    assert.doesNotMatch(manifestSource, new RegExp(unusedAsset.replace(".", "\\.")));
  }
  assert.doesNotMatch(manifestSource, /baseball-pitch-(fastball|curve|slider|changeup)-10\.png/);
});

test("게임 진입부는 유한 시간 critical gate와 지연 lazy preload를 사용한다", () => {
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
  assert.match(viewSource, /GameAssetPreloader/);
});
