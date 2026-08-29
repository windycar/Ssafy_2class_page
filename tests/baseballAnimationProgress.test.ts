import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  baseballPitchQualityAtMeterProgress,
  createBaseballAnimationProgressSource,
} from "../src/utils/games/baseball/animationProgress.ts";

test("공유 진행률 신호는 값을 clamp하고 변경 프레임만 구독자에게 보낸다", () => {
  const source = createBaseballAnimationProgressSource();
  const received: number[] = [];
  const unsubscribe = source.subscribe((progress) => received.push(progress));

  source.setProgress(0.25);
  source.setProgress(0.25);
  source.setProgress(1.4);
  source.setProgress(Number.NaN);
  unsubscribe();
  source.setProgress(0.5);

  assert.deepEqual(received, [0.25, 1, 0]);
  assert.equal(source.getProgress(), 0.5);
});

test("투구 타이밍 품질은 중앙부터 PERFECT·GOOD·NORMAL·MISS 순서다", () => {
  assert.equal(baseballPitchQualityAtMeterProgress(0.5), "PERFECT");
  assert.equal(baseballPitchQualityAtMeterProgress(0.6), "GOOD");
  assert.equal(baseballPitchQualityAtMeterProgress(0.72), "NORMAL");
  assert.equal(baseballPitchQualityAtMeterProgress(0.95), "MISS");
});

test("RAF TICK은 상위 React state 대신 공유 신호와 DOM 레이어를 갱신한다", async () => {
  const [playback, soloController, onlineGame, animatedLayers, meter] = await Promise.all([
    readFile(new URL("../src/hooks/useBaseballVisualPlayback.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/hooks/useBaseballSoloController.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/components/games/baseball/v2/BaseballOnlineGameV2.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/games/baseball/v2/BaseballAnimatedStageLayersV2.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/games/baseball/v2/BaseballPitchTimingMeterV2.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(playback, /action\.type !== "TICK" && mountedRef\.current/);
  assert.match(playback, /progressSource\.setProgress\(transition\.state\.eventProgress\)/);
  assert.doesNotMatch(soloController, /setPitchProgress|setPitchPulseProgress/);
  assert.doesNotMatch(onlineGame, /setPitchProgress|setPitchPulseProgress/);
  assert.match(animatedLayers, /progressSource\.subscribe\(renderFrame\)/);
  assert.match(animatedLayers, /applyPointStyle\(bodyRef\.current, presentation\.body\)/);
  assert.match(meter, /markerRef\.current\.style\.left/);
  assert.doesNotMatch(meter, /useState/);
});
