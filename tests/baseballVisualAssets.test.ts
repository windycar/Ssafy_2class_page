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
    2,
    "정적 레이어의 잔상과 본체는 동일한 ballSrc만 사용해야 한다",
  );
  assert.equal(
    animatedLayerSource.match(/<img src=\{ballSrc\}/g)?.length,
    2,
    "RAF 레이어의 잔상과 본체도 동일한 ballSrc만 사용해야 한다",
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

test("포수 액션과 투명 미트는 실제 런타임 자산이며 투구 목표에 연결된다", () => {
  const catcher = pngDimensions("baseball-catcher-actions-red.png");
  const mitt = pngDimensions("baseball-catcher-mitt-v2.png");
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
  assert.equal(mitt.colorType, 6);
  assert.match(stageSource, /motion !== "CATCH"/);
  assert.match(stageSource, /sprite\.progressSource\.subscribe\(renderFrame\)/);
  assert.match(animatedLayerSource, /className="bbv2-catcher-mitt"/);
  assert.match(playPresentationSource, /actualLocation/);
  assert.match(playPresentationSource, /caught: progress >= 0\.92/);
});

test("9명 타자와 양 팀 선발투수 초상은 RGBA 자산이며 소개·HUD·MVP에 실제 연결된다", () => {
  const portraitNames = [
    "baseball-portrait-kia-01-v2.png",
    "baseball-portrait-kia-16-v2.png",
    "baseball-portrait-kia-05-v2.png",
    "baseball-portrait-kia-34-v2.png",
    "baseball-portrait-kia-47-v2.png",
    "baseball-portrait-kia-03-v2.png",
    "baseball-portrait-kia-25-v2.png",
    "baseball-portrait-kia-42-v2.png",
    "baseball-portrait-kia-66-v2.png",
    "baseball-portrait-kia-54-v2.png",
    "baseball-portrait-cpu-21-v2.png",
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
    const portrait = pngDimensions(name);
    assert.ok(portrait.width >= 1_000, `${name} 가로 해상도가 너무 작음`);
    assert.ok(portrait.height >= 1_000, `${name} 세로 해상도가 너무 작음`);
    assert.equal(portrait.colorType, 6, `${name}은 실제 alpha가 있는 RGBA PNG여야 한다`);
    assert.ok(portrait.size >= 1_000_000, `${name}이 빈 placeholder처럼 너무 작음`);
    assert.match(assetsSource, new RegExp(name.replaceAll(".", "\\.")), `${name} manifest 연결 누락`);
  }

  const manifestBlock = assetsSource.slice(
    assetsSource.indexOf("export const BASEBALL_V2_ASSET_MANIFEST"),
    assetsSource.indexOf("] as const satisfies readonly BaseballV2AssetDefinition[]"),
  );
  const manifestCount = manifestBlock.match(/\{ id:/g)?.length ?? 0;
  assert.ok(manifestCount >= 25 && manifestCount <= 40, `런타임 야구 자산은 25~40개여야 함: ${manifestCount}`);
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

test("검수 완료된 결과 컷은 투명 RGBA이고 Solo·Online의 공식 판정 단계에 실제 연결된다", () => {
  const effectNames = [
    "baseball-effect-hit-v2.png",
    "baseball-effect-triple-v2.png",
    "baseball-effect-home-run-v2.png",
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
    const effect = pngDimensions(name);
    assert.ok(effect.width >= 1_000, `${name} 가로 해상도가 너무 작음`);
    assert.ok(effect.height >= 1_000, `${name} 세로 해상도가 너무 작음`);
    assert.equal(effect.colorType, 6, `${name}은 RGBA PNG여야 한다`);
    assert.ok(effect.size >= 1_000_000, `${name}이 빈 placeholder처럼 너무 작음`);
    assert.match(assetsSource, new RegExp(name.replaceAll(".", "\\.")));
  }

  assert.match(assetsSource, /BASEBALL_V2_RESULT_EFFECT_SOURCES/);
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

test("야구 화면은 경기장·카메라·캐릭터·공을 포함한 실제 이미지 묶음을 유지한다", () => {
  const names = readdirSync(ASSET_DIRECTORY)
    .filter((name) => name.startsWith("baseball-") && name.endsWith(".png"));
  assert.ok(names.length >= 19);

  const required = [
    "baseball-ball-clean-v3.png",
    "baseball-batter-actions-blue.png",
    "baseball-batter-actions-red-v2.png",
    "baseball-pitcher-actions-red.png",
    "baseball-runner-blue-chibi-v3.png",
    "baseball-runner-red-chibi-v3.png",
    "baseball-fielder-blue-chibi-v3.png",
    "baseball-fielder-red-chibi-v4.png",
    "baseball-catcher-actions-red.png",
    "baseball-camera-pitcher-empty.png",
    "baseball-camera-infield.png",
    "baseball-camera-home-run.png",
    "baseball-camera-run-scored-v4.png",
    "baseball-camera-left-field-v5.png",
    "baseball-camera-left-center-v5.png",
    "baseball-camera-center-field-v5.png",
    "baseball-camera-right-center-v5.png",
    "baseball-camera-right-field-v5.png",
  ];
  for (const name of required) {
    assert.ok(names.includes(name), `${name} 누락`);
    assert.ok(statSync(new URL(name, ASSET_DIRECTORY)).size >= 100_000);
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

  const redBatter = pngDimensions("baseball-batter-actions-red-v2.png");
  assert.equal(redBatter.width, 1_672);
  assert.equal(redBatter.height, 941);
  assert.equal(redBatter.colorType, 6);
  assert.ok(redBatter.size >= 1_000_000);

  const assetsSource = readFileSync(
    path.join(SOURCE_DIRECTORY, "config/baseballV2Assets.ts"),
    "utf8",
  );
  for (const name of [
    "baseball-camera-left-field-v5.png",
    "baseball-camera-left-center-v5.png",
    "baseball-camera-center-field-v5.png",
    "baseball-camera-right-center-v5.png",
    "baseball-camera-right-field-v5.png",
    "baseball-camera-run-scored-v4.png",
    "baseball-runner-blue-chibi-v3.png",
    "baseball-runner-red-chibi-v3.png",
    "baseball-fielder-blue-chibi-v3.png",
    "baseball-fielder-red-chibi-v4.png",
    "baseball-batter-actions-red-v2.png",
  ]) {
    assert.match(assetsSource, new RegExp(name.replaceAll(".", "\\.")), `${name} manifest 연결 누락`);
    assert.ok(statSync(new URL(name, ASSET_DIRECTORY)).size >= 100_000);
  }
  assert.doesNotMatch(
    assetsSource,
    /baseball-camera-(?:left-field|left-center|center-field|right-center|right-field)-v4\.png/,
  );
  assert.doesNotMatch(assetsSource, /baseball-camera-run-scored-v3\.png/);

  for (const component of ["BaseballSoloGameV2.tsx", "BaseballOnlineGameV2.tsx"]) {
    const source = readFileSync(
      path.join(SOURCE_DIRECTORY, "components/games/baseball/v2", component),
      "utf8",
    );
    assert.match(source, /BASEBALL_V2_RUNNER_SOURCES\[visualBattingTeam\]/);
    assert.match(source, /BASEBALL_V2_FIELDER_SOURCES\[visualFieldingTeam\]/);
    assert.match(source, /BASEBALL_V2_BATTER_ACTION_SOURCES\[visualBattingTeam\]/);
    assert.match(source, /createBaseballRunnerPresentationsV2\(/);
    assert.match(source, /createBaseballFielderPresentationsV2\(/);
    assert.match(source, /fielders=\{fielders\}/);
    assert.doesNotMatch(source, /baseball-fielder-actions-red\.png/);
  }
});
