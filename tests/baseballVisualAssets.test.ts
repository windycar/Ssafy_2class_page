import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ASSET_DIRECTORY = new URL("../src/assets/games/", import.meta.url);
const SOURCE_DIRECTORY = fileURLToPath(new URL("../src/", import.meta.url));
const TEN_FRAME_PITCH_ATLASES = [
  "baseball-pitch-fastball-10.png",
  "baseball-pitch-curve-10.png",
  "baseball-pitch-slider-10.png",
  "baseball-pitch-changeup-10.png",
] as const;

function runtimeSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return runtimeSourceFiles(entryPath);
    return /\.(?:css|ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

function pngDimensions(name: string) {
  const bytes = readFileSync(new URL(name, ASSET_DIRECTORY));
  assert.equal(bytes.toString("ascii", 1, 4), "PNG");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    colorType: bytes.readUInt8(25),
    size: bytes.byteLength,
  };
}

test("잘린 10프레임 공 atlas는 저장소와 런타임에서 완전히 제거된다", () => {
  for (const atlasName of TEN_FRAME_PITCH_ATLASES) {
    assert.equal(existsSync(new URL(atlasName, ASSET_DIRECTORY)), false, `${atlasName} 파일이 남아 있음`);
  }

  for (const filePath of runtimeSourceFiles(SOURCE_DIRECTORY)) {
    const source = readFileSync(filePath, "utf8");
    for (const atlasName of TEN_FRAME_PITCH_ATLASES) {
      assert.doesNotMatch(
        source,
        new RegExp(atlasName.replaceAll(".", "\\.")),
        `${path.relative(SOURCE_DIRECTORY, filePath)}에서 ${atlasName} 참조 발견`,
      );
    }
  }
});

test("clean-v3 야구공은 512px 이상 RGBA 원본이며 공 레이어의 유일한 source다", () => {
  const cleanBall = pngDimensions("baseball-ball-clean-v3.png");
  assert.ok(cleanBall.width >= 512);
  assert.ok(cleanBall.height >= 512);
  assert.equal(cleanBall.width, cleanBall.height);
  assert.equal(cleanBall.colorType, 6, "야구공은 alpha가 있는 RGBA PNG여야 한다");
  assert.ok(cleanBall.size >= 100_000);

  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /ballSrc: BASEBALL_V2_BALL_SOURCE/);
    assert.doesNotMatch(source, /baseball-ball-body-v2\.png/);
  }
});

test("스테이지는 동일한 공 이미지로 본체 1개와 이전 위치 잔상 10개만 구성한다", () => {
  const stageSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballStageV2.tsx"),
    "utf8",
  );
  const styleSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "styles/baseball-v2.css"),
    "utf8",
  );
  const trailStyleSource = styleSource.slice(
    styleSource.indexOf(".bbv2-ball-trail-point {"),
    styleSource.indexOf(".bbv2-ball-body {"),
  );
  const trailTuple = stageSource.match(
    /export type BaseballTrailPointsV2 = readonly \[([\s\S]*?)\];/,
  )?.[1];
  const ballPresentationContract = stageSource.match(
    /export interface BaseballBallPresentationV2 \{([\s\S]*?)\}/,
  )?.[1];

  assert.ok(trailTuple, "10개 잔상 튜플 계약 누락");
  assert.equal(
    trailTuple.match(/BaseballPresentationPointV2/g)?.length,
    10,
    "잔상 타입은 정확히 이전 위치 10개여야 한다",
  );
  assert.match(stageSource, /BASEBALL_TRAIL_SAMPLE_COUNT = 10/);
  assert.match(stageSource, /presentation\.trail\.map\(\(point, index\)/);
  assert.equal(
    stageSource.match(/<BaseballFlightLayerV2\b/g)?.length,
    1,
    "스테이지에는 활성 공 비행 레이어가 하나만 있어야 한다",
  );
  assert.equal(
    stageSource.match(/<img src=\{ballSrc\}/g)?.length,
    2,
    "잔상과 본체는 동일한 ballSrc만 사용해야 한다",
  );
  assert.ok(ballPresentationContract, "공 프레젠테이션 계약 누락");
  assert.doesNotMatch(ballPresentationContract, /assetSrc/);
  assert.doesNotMatch(stageSource, /trailAtlasSrc|pitchTrailAtlases/);
  assert.doesNotMatch(styleSource, /ball-trail-atlas|background-size:\s*1000%/);

  const blurValues = [...trailStyleSource.matchAll(/blur\(([\d.]+)px\)/g)]
    .map((match) => Number(match[1]));
  assert.ok(blurValues.length >= 5);
  assert.ok(blurValues.every((value) => value <= 1.25), "잔상 블러는 약하게 유지해야 한다");

  const pitchToneOpacity = [...styleSource.matchAll(
    /--bbv2-pitch-tone:\s*rgb\([^)]*\/\s*(\d+)%\)/g,
  )].map((match) => Number(match[1]));
  assert.ok(pitchToneOpacity.length >= 7);
  assert.ok(
    pitchToneOpacity.every((opacity) => opacity <= 26),
    "구종 색상 효과는 공 형태를 가리지 않는 미세한 수준이어야 한다",
  );
});

test("야구 화면은 경기장·카메라·캐릭터·공을 포함한 실제 이미지 묶음을 유지한다", () => {
  const names = readdirSync(ASSET_DIRECTORY)
    .filter((name) => name.startsWith("baseball-") && name.endsWith(".png"));
  assert.ok(names.length >= 19);

  const required = [
    "baseball-ball-clean-v3.png",
    "baseball-batter-actions-blue.png",
    "baseball-pitcher-actions-red.png",
    "baseball-fielder-actions-red.png",
    "baseball-catcher-actions-red.png",
    "baseball-camera-pitcher-empty.png",
    "baseball-camera-infield.png",
    "baseball-camera-home-run.png",
  ];
  for (const name of required) {
    assert.ok(names.includes(name), `${name} 누락`);
    assert.ok(statSync(new URL(name, ASSET_DIRECTORY)).size >= 100_000);
  }
});
