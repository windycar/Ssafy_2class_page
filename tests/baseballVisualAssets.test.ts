import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { inflateSync } from "node:zlib";

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

function webpDimensions(name: string) {
  const bytes = readFileSync(new URL(name, ASSET_DIRECTORY));
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `${name} RIFF signature 누락`);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${name} WEBP signature 누락`);
  const chunkType = bytes.toString("ascii", 12, 16);
  const readUInt24LE = (offset: number) => (
    bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16)
  );

  if (chunkType === "VP8X") {
    return {
      width: readUInt24LE(24) + 1,
      height: readUInt24LE(27) + 1,
      hasAlpha: (bytes[20] & 0x10) !== 0,
      size: bytes.byteLength,
    };
  }
  if (chunkType === "VP8 ") {
    assert.deepEqual([...bytes.subarray(23, 26)], [0x9d, 0x01, 0x2a], `${name} VP8 frame header 오류`);
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
      hasAlpha: false,
      size: bytes.byteLength,
    };
  }
  throw new Error(`${name} 지원하지 않는 WebP chunk ${chunkType}`);
}

function paethPredictor(left: number, above: number, upperLeft: number) {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  return aboveDistance <= upperLeftDistance ? above : upperLeft;
}

function decodeRgbaPng(name: string) {
  const bytes = readFileSync(new URL(name, ASSET_DIRECTORY));
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  assert.equal(bytes.readUInt8(24), 8, `${name}은 8-bit PNG여야 한다`);
  assert.equal(bytes.readUInt8(25), 6, `${name}은 RGBA PNG여야 한다`);
  assert.equal(bytes.readUInt8(28), 0, `${name}은 interlace PNG이면 안 된다`);

  const idatChunks: Buffer[] = [];
  let offset = 8;
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    if (type === "IDAT") idatChunks.push(bytes.subarray(offset + 8, offset + 8 + length));
    offset += 12 + length;
    if (type === "IEND") break;
  }

  const scanlines = inflateSync(Buffer.concat(idatChunks));
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  assert.equal(scanlines.length, (stride + 1) * height, `${name} scanline 길이 오류`);
  const rgba = Buffer.allocUnsafe(stride * height);

  for (let y = 0; y < height; y += 1) {
    const filter = scanlines[y * (stride + 1)];
    const sourceStart = y * (stride + 1) + 1;
    const targetStart = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const raw = scanlines[sourceStart + x];
      const left = x >= bytesPerPixel ? rgba[targetStart + x - bytesPerPixel] : 0;
      const above = y > 0 ? rgba[targetStart - stride + x] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel
        ? rgba[targetStart - stride + x - bytesPerPixel]
        : 0;
      const predictor = filter === 0
        ? 0
        : filter === 1
          ? left
          : filter === 2
            ? above
            : filter === 3
              ? Math.floor((left + above) / 2)
              : filter === 4
                ? paethPredictor(left, above, upperLeft)
                : Number.NaN;
      assert.ok(Number.isFinite(predictor), `${name} 알 수 없는 PNG filter ${filter}`);
      rgba[targetStart + x] = (raw + predictor) & 0xff;
    }
  }
  return { width, height, rgba };
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
  const animatedLayerSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballAnimatedStageLayersV2.tsx"),
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
  assert.match(stageSource, /const activeFlight = animatedFlight \? null : defenseThrow/);
  assert.match(stageSource, /\{animatedFlight && animation \? \(/);
  assert.match(stageSource, /\{activeFlight \? \(/);
  assert.equal(
    stageSource.match(/<img src=\{ballSrc\}/g)?.length,
    1,
    "정적 레이어는 실제 야구공 본체 하나만 렌더링해야 한다",
  );
  assert.equal(
    animatedLayerSource.match(/<img src=\{ballSrc\}/g)?.length,
    1,
    "RAF 레이어도 실제 야구공 본체 하나만 렌더링해야 한다",
  );
  assert.doesNotMatch(
    stageSource,
    /bbv2-ball-trail-point[\s\S]{0,300}<img src=\{ballSrc\}/,
    "정적 잔상에 실밥이 있는 야구공 이미지를 다시 사용하면 안 된다",
  );
  assert.doesNotMatch(
    animatedLayerSource,
    /bbv2-ball-trail-point[\s\S]{0,300}<img src=\{ballSrc\}/,
    "RAF 잔상에 실밥이 있는 야구공 이미지를 다시 사용하면 안 된다",
  );
  assert.ok(ballPresentationContract, "공 프레젠테이션 계약 누락");
  assert.doesNotMatch(ballPresentationContract, /assetSrc/);
  assert.doesNotMatch(stageSource, /trailAtlasSrc|pitchTrailAtlases/);
  assert.doesNotMatch(styleSource, /ball-trail-atlas|background-size:\s*1000%/);
  assert.match(stageSource, /data-facing=\{runner\.facing \?\? "RIGHT"\}/);
  assert.match(stageSource, /data-facing=\{fielder\.facing \?\? "RIGHT"\}/);
  assert.match(styleSource, /--bbv2-facing-scale:\s*-1/);

  const blurValues = [...trailStyleSource.matchAll(/blur\(([\d.]+)px\)/g)]
    .map((match) => Number(match[1]));
  assert.ok(blurValues.length >= 5);
  assert.ok(
    blurValues.every((value) => value >= 1.2 && value <= 2.8),
    "잔상은 또 하나의 야구공이 아니라 짧은 모션 블러로 보여야 한다",
  );
  assert.match(trailStyleSource, /\.bbv2-ball-trail-point::before/);
  assert.match(trailStyleSource, /linear-gradient/);
  assert.match(trailStyleSource, /aspect-ratio:\s*3\.4\s*\/\s*1/);
  assert.match(trailStyleSource, /scaleX\(1\.35\)/);

  const pitchToneOpacity = [...styleSource.matchAll(
    /--bbv2-pitch-tone:\s*rgb\([^)]*\/\s*(\d+)%\)/g,
  )].map((match) => Number(match[1]));
  assert.ok(pitchToneOpacity.length >= 7);
  assert.ok(
    pitchToneOpacity.every((opacity) => opacity <= 26),
    "구종 색상 효과는 공 형태를 가리지 않는 미세한 수준이어야 한다",
  );
});

test("주자 idle/sprint/slide/score 동작은 정적·RAF 레이어와 CSS에 모두 연결된다", () => {
  const stageSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballStageV2.tsx"),
    "utf8",
  );
  const animatedLayerSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballAnimatedStageLayersV2.tsx"),
    "utf8",
  );
  const styleSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "styles/baseball-v2.css"),
    "utf8",
  );

  assert.match(stageSource, /data-motion=\{runner\.motion \?\? "IDLE"\}/);
  assert.match(animatedLayerSource, /data-motion=\{runner\.motion \?\? "IDLE"\}/);
  assert.match(animatedLayerSource, /element\.dataset\.motion !== motion/);
  assert.match(animatedLayerSource, /element\.dataset\.motion = motion/);
  for (const motion of ["IDLE", "SPRINT", "SLIDE", "SCORE"]) {
    assert.match(styleSource, new RegExp(`data-motion="${motion}"`));
  }
  assert.match(styleSource, /@keyframes bbv2-runner-slide/);
  assert.doesNotMatch(styleSource, /data-status="RUNNING"[^}]*animation:/s);
});

test("포수 액션과 투명 미트는 실제 런타임 자산이며 투구 목표에 연결된다", () => {
  const catcher = pngDimensions("baseball-catcher-actions-red-chibi-v5.png");
  const mitt = webpDimensions("baseball-catcher-mitt-v2.webp");
  const stageSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballStageV2.tsx"),
    "utf8",
  );
  const animatedLayerSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballAnimatedStageLayersV2.tsx"),
    "utf8",
  );
  const playPresentationSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballPlayPresentationV2.ts"),
    "utf8",
  );

  assert.equal(catcher.width / catcher.height, 2048 / 768);
  assert.equal(catcher.colorType, 6);
  assert.ok(mitt.width >= 512 && mitt.height >= 512);
  assert.equal(mitt.hasAlpha, true);
  assert.ok(mitt.size >= 300_000 && mitt.size <= 800_000);
  assert.match(stageSource, /motion !== "CATCH"/);
  assert.match(stageSource, /sprite\.progressSource\.subscribe\(renderFrame\)/);
  assert.match(animatedLayerSource, /className="bbv2-catcher-mitt"/);
  assert.match(playPresentationSource, /actualLocation/);
  assert.match(playPresentationSource, /caught: progress >= 0\.92/);
});

test("9명 타자와 양 팀 선발투수 초상은 투명 WebP이며 소개·HUD·MVP에 실제 연결된다", () => {
  const portraitNames = [
    "baseball-portrait-kia-01-v2.webp",
    "baseball-portrait-kia-16-v2.webp",
    "baseball-portrait-kia-05-v2.webp",
    "baseball-portrait-kia-34-v2.webp",
    "baseball-portrait-kia-47-v2.webp",
    "baseball-portrait-kia-03-v2.webp",
    "baseball-portrait-kia-25-v2.webp",
    "baseball-portrait-kia-42-v2.webp",
    "baseball-portrait-kia-66-v2.webp",
    "baseball-portrait-kia-54-v2.webp",
    "baseball-portrait-cpu-21-v2.webp",
  ] as const;
  const assetsSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "config/baseballV2Assets.ts"),
    "utf8",
  );
  const presentationSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballPresentationSequencesV2.tsx"),
    "utf8",
  );
  const hudSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballHudV2.tsx"),
    "utf8",
  );
  const finalSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballFinalOverlayV2.tsx"),
    "utf8",
  );

  for (const name of portraitNames) {
    const portrait = webpDimensions(name);
    assert.ok(portrait.width >= 1_000, `${name} 가로 해상도가 너무 작음`);
    assert.ok(portrait.height >= 1_000, `${name} 세로 해상도가 너무 작음`);
    assert.equal(portrait.hasAlpha, true, `${name}은 실제 alpha가 있는 WebP여야 한다`);
    assert.ok(portrait.size >= 150_000, `${name}이 빈 placeholder처럼 너무 작음`);
    assert.ok(portrait.size <= 600_000, `${name} WebP 최적화가 풀림`);
    assert.match(assetsSource, new RegExp(name.replaceAll(".", "\\.")), `${name} manifest 연결 누락`);
  }

  const manifestBlock = assetsSource.slice(
    assetsSource.indexOf("export const BASEBALL_V2_ASSET_MANIFEST"),
    assetsSource.indexOf("] as const satisfies readonly BaseballV2AssetDefinition[]"),
  );
  const manifestCount = manifestBlock.match(/\{ id:/g)?.length ?? 0;
  assert.ok(manifestCount >= 40, `실사용 야구 자산은 최소 40개여야 함: ${manifestCount}`);
  assert.equal(manifestBlock.match(/kind: "portrait"/g)?.length, 11);
  assert.match(assetsSource, /BASEBALL_V2_PLAYER_PORTRAIT_SOURCES/);
  assert.match(presentationSource, /model\.lineups\.map/);
  assert.match(presentationSource, /IntroPortraitV2 player=\{pitcher\}/);
  assert.match(presentationSource, /bbv2-player-intro__portrait/);
  assert.match(hudSource, /playerPortraitSource\(batter, portraits\)/);
  assert.match(hudSource, /playerPortraitSource\(pitcher, portraits\)/);
  assert.match(finalSource, /playerPortraits\?\.\[result\.mvp\.playerId\]/);

  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /BASEBALL_V2_PLAYER_PORTRAIT_SOURCES/);
    assert.match(source, /playerPortraits=\{BASEBALL_V2_PLAYER_PORTRAIT_SOURCES\}/);
    assert.match(source, /assets=\{BASEBALL_V2_HUD_ASSETS\}/);
  }
});

test("검수 완료된 결과 컷은 투명 WebP이고 Solo·Online의 공식 판정 단계에 실제 연결된다", () => {
  const effectNames = [
    "baseball-effect-hit-v2.webp",
    "baseball-effect-double-v2.webp",
    "baseball-effect-triple-v2.webp",
    "baseball-effect-home-run-v2.webp",
    "baseball-effect-strikeout-v2.webp",
    "baseball-effect-score-v2.webp",
    "baseball-effect-safe-v2.webp",
    "baseball-effect-out-v2.webp",
  ] as const;
  const effectIds = [
    "effect-hit",
    "effect-double",
    "effect-triple",
    "effect-home-run",
    "effect-strikeout",
    "effect-score",
    "effect-safe",
    "effect-out",
  ] as const;
  const assetsSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "config/baseballV2Assets.ts"),
    "utf8",
  );
  const visualEventSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballVisualEventPresentationV2.tsx"),
    "utf8",
  );
  const scoringSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballScoringSequenceV2.tsx"),
    "utf8",
  );

  for (const name of effectNames) {
    const effect = webpDimensions(name);
    assert.ok(effect.width >= 1_000, `${name} 가로 해상도가 너무 작음`);
    assert.ok(effect.height >= 1_000, `${name} 세로 해상도가 너무 작음`);
    assert.equal(effect.hasAlpha, true, `${name}은 alpha가 있는 WebP여야 한다`);
    assert.ok(effect.size >= 200_000, `${name}이 빈 placeholder처럼 너무 작음`);
    assert.ok(effect.size <= 700_000, `${name} WebP 최적화가 풀림`);
    assert.match(assetsSource, new RegExp(name.replaceAll(".", "\\.")));
  }

  assert.match(assetsSource, /BASEBALL_V2_RESULT_EFFECT_SOURCES/);
  assert.match(assetsSource, /Readonly<\s*Record<BaseballResultEffectKey, string>/);
  for (const id of effectIds) {
    assert.match(assetsSource, new RegExp(`id: "${id}"`), `${id} lazy preload 연결 누락`);
  }
  assert.match(visualEventSource, /baseballResultEffectForVisualEvent\(event\.kind, official\)/);
  assert.match(visualEventSource, /resultEffectSources\?\.\[effectKey\]/);
  assert.match(visualEventSource, /bbv2-play-callout__effect/);
  assert.match(scoringSource, /bbv2-scoring-sequence__effect/);

  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /resultEffectSources=\{BASEBALL_V2_RESULT_EFFECT_SOURCES\}/);
  }
});

test("동일 경기장 컨텍스트 6종은 고해상도 WebP이며 camera·crowd map과 manifest에 실제 연결된다", () => {
  const sceneNames = [
    "baseball-camera-pitcher-empty-v2.webp",
    "baseball-camera-home-run-v2.webp",
    "baseball-camera-dugout-home-v2.webp",
    "baseball-camera-dugout-away-v2.webp",
    "baseball-camera-crowd-normal-v2.webp",
    "baseball-camera-crowd-cheering-v2.webp",
  ] as const;
  const manifestIds = [
    "pitcher-camera",
    "home-run-camera",
    "dugout-home-camera",
    "dugout-away-camera",
    "crowd-normal-camera",
    "crowd-cheering-camera",
  ] as const;
  const assetsSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "config/baseballV2Assets.ts"),
    "utf8",
  );
  const cameraMapBlock = assetsSource.slice(
    assetsSource.indexOf("export const BASEBALL_V2_CAMERA_BACKGROUND_SOURCES"),
    assetsSource.indexOf("export const BASEBALL_V2_ASSET_MANIFEST"),
  );
  const manifestBlock = assetsSource.slice(
    assetsSource.indexOf("export const BASEBALL_V2_ASSET_MANIFEST"),
    assetsSource.indexOf("] as const satisfies readonly BaseballV2AssetDefinition[]"),
  );

  for (const name of sceneNames) {
    const scene = webpDimensions(name);
    assert.ok(scene.width >= 1_600, `${name} 가로 해상도가 너무 작음`);
    assert.ok(scene.height >= 900, `${name} 세로 해상도가 너무 작음`);
    assert.ok(scene.size >= 150_000, `${name}이 빈 placeholder처럼 너무 작음`);
    assert.ok(scene.size <= 600_000, `${name} WebP 최적화가 풀림`);
    assert.match(assetsSource, new RegExp(name.replaceAll(".", "\\.")), `${name} config import 누락`);
  }

  for (const id of manifestIds) {
    assert.match(manifestBlock, new RegExp(`id: "${id}"`), `${id} manifest 연결 누락`);
  }
  assert.ok((manifestBlock.match(/\{ id:/g)?.length ?? 0) >= 48, "6종 컨텍스트 연결 후 manifest는 48개 이상이어야 함");
  assert.match(
    assetsSource,
    /BASEBALL_V2_CROWD_SOURCES[\s\S]*?normal: baseballCameraCrowdNormal,[\s\S]*?cheering: baseballCameraCrowdCheering/,
  );
  assert.match(cameraMapBlock, /pitcher: baseballCameraPitcher/);
  assert.match(cameraMapBlock, /dugoutHome: baseballCameraDugoutHome/);
  assert.match(cameraMapBlock, /dugoutAway: baseballCameraDugoutAway/);
  assert.match(cameraMapBlock, /homeRun: baseballCameraHomeRun/);
  assert.doesNotMatch(assetsSource, /from "\.\.\/assets\/games\/baseball-camera-pitcher-empty\.png"/);
  assert.doesNotMatch(assetsSource, /from "\.\.\/assets\/games\/baseball-camera-home-run\.png"/);
});

test("야구 화면은 48개 실사용 자산만 유지하고 정적 이미지 예산을 지킨다", () => {
  const names = readdirSync(ASSET_DIRECTORY)
    .filter((name) => name.startsWith("baseball-") && /\.(?:png|webp)$/.test(name));
  assert.equal(names.length, 48);

  const losslessPngNames = [
    "baseball-ball-clean-v3.png",
    "baseball-batter-actions-blue-chibi-v5.png",
    "baseball-batter-actions-red-chibi-v5.png",
    "baseball-catcher-actions-red-chibi-v5.png",
    "baseball-fielder-blue-chibi-v3.png",
    "baseball-fielder-red-chibi-v4.png",
    "baseball-pitcher-actions-red-chibi-v5.png",
    "baseball-runner-blue-chibi-v3.png",
    "baseball-runner-red-chibi-v3.png",
  ];
  assert.deepEqual(
    names.filter((name) => name.endsWith(".png")).sort(),
    [...losslessPngNames].sort(),
    "공과 프레임 시트 외 정적 이미지는 WebP여야 한다",
  );
  const totalBytes = names.reduce(
    (sum, name) => sum + statSync(new URL(name, ASSET_DIRECTORY)).size,
    0,
  );
  assert.ok(totalBytes <= 30 * 1024 * 1024, `야구 자산 예산 30MB 초과: ${totalBytes}`);

  const required = [
    "baseball-ball-clean-v3.png",
    "baseball-batter-actions-blue-chibi-v5.png",
    "baseball-batter-actions-red-chibi-v5.png",
    "baseball-pitcher-actions-red-chibi-v5.png",
    "baseball-runner-blue-chibi-v3.png",
    "baseball-runner-red-chibi-v3.png",
    "baseball-fielder-blue-chibi-v3.png",
    "baseball-fielder-red-chibi-v4.png",
    "baseball-catcher-actions-red-chibi-v5.png",
    "baseball-camera-pitcher-empty-v2.webp",
    "baseball-camera-infield-wide-v3.webp",
    "baseball-camera-home-run-v2.webp",
    "baseball-camera-run-scored-v4.webp",
    "baseball-camera-left-field-v5.webp",
    "baseball-camera-left-center-v5.webp",
    "baseball-camera-center-field-v5.webp",
    "baseball-camera-right-center-v5.webp",
    "baseball-camera-right-field-v5.webp",
  ];
  for (const name of required) {
    assert.ok(names.includes(name), `${name} 누락`);
    assert.ok(statSync(new URL(name, ASSET_DIRECTORY)).size >= 100_000);
  }

  for (const name of names.filter((assetName) => assetName.endsWith(".webp"))) {
    const asset = webpDimensions(name);
    assert.ok(asset.width >= 1_000 && asset.height >= 900, `${name} 해상도가 너무 작음`);
  }

  const superseded = [
    "baseball-arena.png",
    "baseball-arena-swing.png",
    "baseball-ball-body-v2.png",
    "baseball-batter-actions-blue.png",
    "baseball-batter-actions-red-v2.png",
    "baseball-batter-sprite.png",
    "baseball-batting-field.png",
    "baseball-camera-home-run.png",
    "baseball-camera-infield.png",
    "baseball-camera-pitcher-empty.png",
    "baseball-catcher-actions-red.png",
    "baseball-pitcher-actions-red.png",
    "baseball-pitching-field.png",
  ];
  for (const name of superseded) {
    assert.ok(!names.includes(name), `${name} 구형 생성 자산이 남아 있음`);
  }
});

test("동적 주자·수비수는 투명 RGBA이고 clean-v5 외야 배경은 런타임 manifest에만 연결된다", () => {
  for (const name of [
    "baseball-runner-blue-chibi-v3.png",
    "baseball-runner-red-chibi-v3.png",
    "baseball-fielder-blue-chibi-v3.png",
    "baseball-fielder-red-chibi-v4.png",
  ]) {
    const sprite = pngDimensions(name);
    assert.ok(sprite.width >= 1_000, `${name} 해상도가 너무 작음`);
    assert.ok(sprite.height >= 1_000, `${name} 해상도가 너무 작음`);
    assert.equal(sprite.colorType, 6, `${name}은 alpha가 있는 RGBA PNG여야 한다`);
  }

  for (const name of [
    "baseball-batter-actions-blue-chibi-v5.png",
    "baseball-batter-actions-red-chibi-v5.png",
    "baseball-pitcher-actions-red-chibi-v5.png",
    "baseball-catcher-actions-red-chibi-v5.png",
  ]) {
    const actionSheet = pngDimensions(name);
    assert.equal(actionSheet.width, 2_048, `${name}은 4×512px 시트여야 한다`);
    assert.equal(actionSheet.height, 768, `${name}은 2:3 캐릭터 비율이어야 한다`);
    assert.equal(actionSheet.colorType, 6, `${name}은 alpha가 있는 RGBA PNG여야 한다`);
    assert.ok(actionSheet.size >= 500_000, `${name} 해상도가 너무 작음`);

    const decoded = decodeRgbaPng(name);
    const frameCoverage = [0, 0, 0, 0];
    let greenSpill = 0;
    for (let y = 0; y < decoded.height; y += 1) {
      for (let x = 0; x < decoded.width; x += 1) {
        const pixelOffset = (y * decoded.width + x) * 4;
        const alpha = decoded.rgba[pixelOffset + 3];
        if (alpha <= 8) continue;
        frameCoverage[Math.floor(x / 512)] += 1;
        if (
          decoded.rgba[pixelOffset + 1]
          > Math.max(decoded.rgba[pixelOffset], decoded.rgba[pixelOffset + 2]) + 25
        ) {
          greenSpill += 1;
        }
      }
    }
    assert.deepEqual(
      [
        decoded.rgba[3],
        decoded.rgba[(decoded.width - 1) * 4 + 3],
        decoded.rgba[((decoded.height - 1) * decoded.width) * 4 + 3],
        decoded.rgba[(decoded.width * decoded.height - 1) * 4 + 3],
      ],
      [0, 0, 0, 0],
      `${name} 모서리 배경은 완전 투명이어야 한다`,
    );
    for (const boundaryX of [0, 511, 512, 1023, 1024, 1535, 1536, 2047]) {
      assert.equal(
        Array.from({ length: decoded.height }, (_, y) =>
          decoded.rgba[(y * decoded.width + boundaryX) * 4 + 3],
        ).some((alpha) => alpha > 8),
        false,
        `${name} 프레임 경계 ${boundaryX}px에 캐릭터가 걸리면 안 된다`,
      );
    }
    assert.ok(frameCoverage.every((coverage) => coverage >= 15_000), `${name} 빈 프레임 발견`);
    assert.equal(greenSpill, 0, `${name}에 크로마키 초록 번짐이 남아 있음`);
  }

  const assetsSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "config/baseballV2Assets.ts"),
    "utf8",
  );
  for (const name of [
    "baseball-camera-left-field-v5.webp",
    "baseball-camera-left-center-v5.webp",
    "baseball-camera-center-field-v5.webp",
    "baseball-camera-right-center-v5.webp",
    "baseball-camera-right-field-v5.webp",
    "baseball-camera-run-scored-v4.webp",
    "baseball-runner-blue-chibi-v3.png",
    "baseball-runner-red-chibi-v3.png",
    "baseball-fielder-blue-chibi-v3.png",
    "baseball-fielder-red-chibi-v4.png",
    "baseball-batter-actions-blue-chibi-v5.png",
    "baseball-batter-actions-red-chibi-v5.png",
    "baseball-pitcher-actions-red-chibi-v5.png",
    "baseball-catcher-actions-red-chibi-v5.png",
  ]) {
    assert.match(assetsSource, new RegExp(name.replaceAll(".", "\\.")), `${name} manifest 연결 누락`);
    assert.ok(statSync(new URL(name, ASSET_DIRECTORY)).size >= 100_000);
  }
  assert.doesNotMatch(
    assetsSource,
    /baseball-camera-(?:left-field|left-center|center-field|right-center|right-field)-v4\.(?:png|webp)/,
  );
  assert.doesNotMatch(assetsSource, /baseball-camera-run-scored-v3\.(?:png|webp)/);

  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /BASEBALL_V2_RUNNER_SOURCES\[visualBattingTeam\]/);
    assert.match(source, /BASEBALL_V2_FIELDER_SOURCES\[visualFieldingTeam\]/);
    assert.match(source, /BASEBALL_V2_BATTER_ACTION_SOURCES\[visualBattingTeam\]/);
    assert.match(source, /src: BASEBALL_V2_PITCHER_ACTION_SOURCE/);
    assert.match(source, /pitcherSprite:[\s\S]*?frameCount: 4/);
    assert.match(source, /createBaseballRunnerPresentationsV2\(/);
    assert.match(source, /createBaseballFielderPresentationsV2\(/);
    assert.match(source, /fielders=\{fielders\}/);
    assert.doesNotMatch(source, /baseball-fielder-actions-red\.png/);
    assert.doesNotMatch(source, /baseball-(?:batter-actions-blue|batter-actions-red-v2|pitcher-actions-red|catcher-actions-red)\.png/);
  }

  const styleSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "styles/baseball-v2.css"),
    "utf8",
  );
  assert.match(styleSource, /\.bbv2-character-sprite\s*\{[\s\S]*?aspect-ratio: 2 \/ 3;[\s\S]*?height: auto;/);
  assert.match(styleSource, /bbv2-pitcher-motion 560ms steps\(3, end\)/);
  const soloSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "components/games/baseball/v2/BaseballSoloGameV2.tsx"),
    "utf8",
  );
  assert.match(soloSource, /frameIndex: presentation === "PITCH_FLIGHT" \? 3 : 0/);
});
