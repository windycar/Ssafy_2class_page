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
  pitcher: "baseball-camera-pitcher-empty-v2.png",
  contact: "baseball-batting-field-v4.png",
  infieldWide: "baseball-camera-infield-wide-v3.png",
  leftField: "baseball-camera-left-field-v5.png",
  leftCenter: "baseball-camera-left-center-v5.png",
  centerField: "baseball-camera-center-field-v5.png",
  rightCenter: "baseball-camera-right-center-v5.png",
  rightField: "baseball-camera-right-field-v5.png",
  firstBaseLine: "baseball-camera-first-base-line-v4.png",
  thirdBaseLine: "baseball-camera-third-base-line-v4.png",
  foulLeft: "baseball-camera-third-base-line-v4.png",
  foulRight: "baseball-camera-first-base-line-v4.png",
  baseRunning: "baseball-camera-infield-wide-v3.png",
  homePlate: "baseball-camera-run-scored-v4.png",
  dugoutHome: "baseball-camera-dugout-home-v2.png",
  dugoutAway: "baseball-camera-dugout-away-v2.png",
  homeRun: "baseball-camera-home-run-v2.png",
  replay: "baseball-camera-scoreboard-wide-v3.png",
} as const satisfies BaseballCameraBackgroundSources;

test("카메라 모드는 각 상황에 맞는 실제 배경 자산으로 해석된다", () => {
  const expected = {
    BATTER: SOURCES.batter,
    PITCHER: SOURCES.pitcher,
    CONTACT: SOURCES.contact,
    INFIELD: SOURCES.infieldWide,
    LEFT_FIELD: SOURCES.leftField,
    LEFT_CENTER: SOURCES.leftCenter,
    CENTER_FIELD: SOURCES.centerField,
    RIGHT_CENTER: SOURCES.rightCenter,
    RIGHT_FIELD: SOURCES.rightField,
    FIRST_BASE_LINE: SOURCES.firstBaseLine,
    THIRD_BASE_LINE: SOURCES.thirdBaseLine,
    BASE_RUNNING: SOURCES.baseRunning,
    RUN_SCORED: SOURCES.homePlate,
    HOME_RUN: SOURCES.homeRun,
    REPLAY: SOURCES.replay,
  } as const;

  for (const [camera, source] of Object.entries(expected)) {
    assert.equal(
      resolveBaseballCameraBackground(camera as keyof typeof expected, "FIELD", SOURCES),
      source,
    );
    assert.ok(statSync(new URL(source, ASSET_DIRECTORY)).size >= 100_000, `${source} 파일이 비정상`);
  }

  assert.equal(
    new Set(Object.values(expected)).size,
    13,
    "현재 명시적 카메라 경로는 검수된 서로 다른 배경 13개를 선택해야 한다",
  );
});

test("파울 방향과 홈·원정 더그아웃은 이벤트 문맥으로 명시적으로 선택된다", () => {
  assert.equal(
    resolveBaseballCameraBackground("FOUL", "FIELD", SOURCES, { battedBallZone: "FOUL_LEFT" }),
    SOURCES.foulLeft,
  );
  assert.equal(
    resolveBaseballCameraBackground("FOUL", "FIELD", SOURCES, { battedBallZone: "FOUL_RIGHT" }),
    SOURCES.foulRight,
  );
  assert.equal(
    resolveBaseballCameraBackground("DUGOUT", "FIELD", SOURCES, { battingTeam: 1 }),
    SOURCES.dugoutHome,
  );
  assert.equal(
    resolveBaseballCameraBackground("DUGOUT", "FIELD", SOURCES, { battingTeam: 0 }),
    SOURCES.dugoutAway,
  );
  assert.notEqual(SOURCES.dugoutHome, SOURCES.dugoutAway);
  for (const source of [
    SOURCES.foulLeft,
    SOURCES.foulRight,
    SOURCES.dugoutHome,
    SOURCES.dugoutAway,
  ]) {
    assert.ok(statSync(new URL(source, ASSET_DIRECTORY)).size >= 100_000);
  }
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
  assert.match(assetsSource, /baseball-camera-pitcher-empty-v2\.png/);
  assert.match(assetsSource, /baseball-camera-home-run-v2\.png/);
  assert.match(assetsSource, /baseball-camera-dugout-home-v2\.png/);
  assert.match(assetsSource, /baseball-camera-dugout-away-v2\.png/);
  assert.match(assetsSource, /baseball-camera-crowd-normal-v2\.png/);
  assert.match(assetsSource, /baseball-camera-crowd-cheering-v2\.png/);
  assert.match(
    assetsSource,
    /BASEBALL_V2_CROWD_SOURCES[\s\S]*?normal: baseballCameraCrowdNormal,[\s\S]*?cheering: baseballCameraCrowdCheering/,
  );
  assert.match(assetsSource, /baseball-batting-field-v4\.png/);
  assert.equal((assetsSource.match(/dynamicBallOnly: true/g) ?? []).length, 9);
  assert.doesNotMatch(assetsSource, /baseball-camera-(?:left-field|left-center|center-field|right-center|right-field)-v[34]\.png/);
  assert.doesNotMatch(assetsSource, /baseball-batting-field\.png/);
  assert.match(assetsSource, /baseball-camera-scoreboard-wide-v3\.png/);
  assert.match(assetsSource, /id: "run-scored-camera"/);
  assert.match(assetsSource, /id: "scoreboard-wide-camera"/);
  assert.doesNotMatch(assetsSource, /baseball-camera-pitcher-empty\.png/);
  assert.doesNotMatch(assetsSource, /baseball-camera-home-run\.png/);
  assert.doesNotMatch(assetsSource, /baseball-pitch-(?:fastball|curve|slider|changeup)-10\.png/);

  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /backgroundSrc=\{BASEBALL_V2_SCOREBOARD_BACKGROUND_SOURCE\}/);
    assert.match(source, /battingTeam: visualBattingTeam/);
    assert.match(source, /battedBallZone:/);
  }
});
