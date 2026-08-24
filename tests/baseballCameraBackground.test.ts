import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  resolveBaseballCameraBackground,
  type BaseballCameraBackgroundSources,
} from "../src/utils/games/baseball/cameraBackground.ts";

const SOURCE_DIRECTORY = fileURLToPath(new URL("../src/", import.meta.url));
const ASSET_DIRECTORY = new URL("../src/assets/games/", import.meta.url);

const SOURCES = {
  batter: "baseball-batting-field-v4.png",
  pitcher: "baseball-camera-pitcher-empty.png",
  infieldWide: "baseball-camera-infield-wide-v3.png",
  leftField: "baseball-camera-left-field-v5.png",
  leftCenter: "baseball-camera-left-center-v5.png",
  centerField: "baseball-camera-center-field-v5.png",
  rightCenter: "baseball-camera-right-center-v5.png",
  rightField: "baseball-camera-right-field-v5.png",
  firstBaseLine: "baseball-camera-first-base-line-v4.png",
  thirdBaseLine: "baseball-camera-third-base-line-v4.png",
  runScored: "baseball-camera-run-scored-v4.png",
  homeRun: "baseball-camera-home-run.png",
} as const satisfies BaseballCameraBackgroundSources;

test("카메라 모드는 각 상황에 맞는 실제 배경 자산으로 해석된다", () => {
  const expected = {
    INFIELD: SOURCES.infieldWide,
    LEFT_FIELD: SOURCES.leftField,
    LEFT_CENTER: SOURCES.leftCenter,
    CENTER_FIELD: SOURCES.centerField,
    RIGHT_CENTER: SOURCES.rightCenter,
    RIGHT_FIELD: SOURCES.rightField,
    FIRST_BASE_LINE: SOURCES.firstBaseLine,
    THIRD_BASE_LINE: SOURCES.thirdBaseLine,
    BASE_RUNNING: SOURCES.infieldWide,
    RUN_SCORED: SOURCES.runScored,
    HOME_RUN: SOURCES.homeRun,
  } as const;

  for (const [camera, source] of Object.entries(expected)) {
    assert.equal(
      resolveBaseballCameraBackground(camera as keyof typeof expected, "FIELD", SOURCES),
      source,
    );
    assert.ok(statSync(new URL(source, ASSET_DIRECTORY)).size >= 100_000, `${source} 파일이 비정상`);
  }

  assert.equal(
    new Set([
      expected.INFIELD,
      expected.LEFT_FIELD,
      expected.LEFT_CENTER,
      expected.CENTER_FIELD,
      expected.RIGHT_CENTER,
      expected.RIGHT_FIELD,
      expected.FIRST_BASE_LINE,
      expected.THIRD_BASE_LINE,
      expected.RUN_SCORED,
      expected.HOME_RUN,
    ]).size,
    10,
    "주요 카메라 장면은 서로 다른 배경이어야 한다",
  );
});

test("타자·투수 카메라와 비지정 장면은 관점별 배경으로 안전하게 돌아간다", () => {
  assert.equal(resolveBaseballCameraBackground("BATTER", "FIELD", SOURCES), SOURCES.batter);
  assert.equal(resolveBaseballCameraBackground("PITCHER", "FIELD", SOURCES), SOURCES.pitcher);
  assert.equal(resolveBaseballCameraBackground("CONTACT", "BATTING", SOURCES), SOURCES.batter);
  assert.equal(resolveBaseballCameraBackground("REPLAY", "PITCHING", SOURCES), SOURCES.pitcher);
  assert.equal(resolveBaseballCameraBackground("FOUL", "FIELD", SOURCES), SOURCES.infieldWide);
  assert.ok(statSync(new URL(SOURCES.batter, ASSET_DIRECTORY)).size >= 100_000);
  assert.ok(statSync(new URL(SOURCES.pitcher, ASSET_DIRECTORY)).size >= 100_000);
});

test("Solo와 Online은 공통 카메라 resolver와 clean-v3 공을 사용한다", () => {
  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /import \{ resolveBaseballCameraBackground \}/);
    assert.match(source, /resolveBaseballCameraBackground\([\s\S]*?BASEBALL_V2_CAMERA_BACKGROUND_SOURCES/);
    assert.match(source, /ballSrc: BASEBALL_V2_BALL_SOURCE/);
    assert.doesNotMatch(source, /function cameraBackground\(/);
    assert.doesNotMatch(source, /baseball-ball-body-v2\.png/);
  }

  const assetsSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "config/baseballV2Assets.ts"),
    "utf8",
  );
  assert.match(assetsSource, /baseball-ball-clean-v3\.png/);
  assert.match(assetsSource, /baseball-camera-run-scored-v4\.png/);
  assert.match(assetsSource, /baseball-camera-left-center-v5\.png/);
  assert.match(assetsSource, /baseball-camera-right-center-v5\.png/);
  assert.match(assetsSource, /baseball-camera-first-base-line-v4\.png/);
  assert.match(assetsSource, /baseball-camera-third-base-line-v4\.png/);
  assert.match(assetsSource, /baseball-batting-field-v4\.png/);
  assert.equal((assetsSource.match(/dynamicBallOnly: true/g) ?? []).length, 9);
  assert.doesNotMatch(assetsSource, /baseball-camera-(?:left-field|left-center|center-field|right-center|right-field)-v[34]\.png/);
  assert.doesNotMatch(assetsSource, /baseball-batting-field\.png/);
  assert.match(assetsSource, /baseball-camera-scoreboard-wide-v3\.png/);
  assert.match(assetsSource, /id: "run-scored-camera"/);
  assert.match(assetsSource, /id: "scoreboard-wide-camera"/);
  assert.doesNotMatch(assetsSource, /baseball-pitch-(?:fastball|curve|slider|changeup)-10\.png/);

  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /backgroundSrc=\{BASEBALL_V2_SCOREBOARD_BACKGROUND_SOURCE\}/);
  }
});
