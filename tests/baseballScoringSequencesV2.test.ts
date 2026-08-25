import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentRoot = new URL(
  "../src/components/games/baseball/v2/",
  import.meta.url,
);

function readComponent(name: string) {
  return readFile(new URL(name, componentRoot), "utf8");
}

test("공통 시각 이벤트 계층이 득점과 홈런 전용 시퀀스를 선택한다", async () => {
  const source = await readComponent("BaseballVisualEventPresentationV2.tsx");

  assert.match(source, /createBaseballScoringPresentationV2\(authoritativeGame, official\)/);
  assert.match(source, /if \(scoring\?\.isHomeRun\)/);
  assert.match(source, /<BaseballHomeRunSequenceV2/);
  assert.match(source, /<BaseballScoringSequenceV2/);
  assert.match(source, /eventProgress=\{eventProgress\}/);
  assert.match(source, /onSkipSequence=\{onSkipSequence\}/);
});

test("Solo와 Online은 같은 전용 시퀀스에 authoritative 상태·진행률·Space 스킵을 전달한다", async () => {
  const [solo, online] = await Promise.all([
    readComponent("BaseballSoloGameV2.tsx"),
    readComponent("BaseballOnlineGameV2.tsx"),
  ]);

  assert.match(solo, /authoritativeGame=\{game\}/);
  assert.match(solo, /eventProgress=\{currentVisualEventProgress\}/);
  assert.match(solo, /onSkipSequence=\{skipSequence\}/);
  assert.match(solo, /skipSequence\(\)/);
  assert.doesNotMatch(solo, /canvas-confetti|celebratedHomeRunsRef/);

  assert.match(online, /authoritativeGame=\{authoritativePresentationGame\}/);
  assert.match(online, /eventProgress=\{presentedVisualEventProgress\}/);
  assert.match(online, /onSkipSequence=\{skipHomeRunSequence\}/);
  assert.match(online, /playback\.seek\("RUN_SCORE"\)/);
});

test("홈런 전용 시퀀스만 공통 축포를 실행하고 득점·전광판은 스킵 버튼을 숨긴다", async () => {
  const source = await readComponent("BaseballHomeRunSequenceV2.tsx");

  assert.match(source, /import confetti from "canvas-confetti"/);
  assert.match(source, /event\.kind !== "RUN_SCORE"/);
  assert.match(source, /celebratedPlayIdsRef\.current\.has\(model\.playId\)/);
  assert.match(source, /isBaseballHomeRunCinematicSkippablePhaseV2\(event\.kind\)/);
  assert.match(source, /\{canSkipSequence \? \(/);
  assert.match(source, /HOME PLATE · SAFE/);
});

test("경기 시작·새 타자·공수교대 연출은 Solo와 Online의 공통 계층에 연결된다", async () => {
  const [visual, solo, online, sequences] = await Promise.all([
    readComponent("BaseballVisualEventPresentationV2.tsx"),
    readComponent("BaseballSoloGameV2.tsx"),
    readComponent("BaseballOnlineGameV2.tsx"),
    readComponent("BaseballPresentationSequencesV2.tsx"),
  ]);

  assert.match(visual, /event\.kind === "NEXT_BATTER"/);
  assert.match(visual, /<BaseballPlayerIntroSequenceV2/);
  assert.match(visual, /event\.kind === "HALF_INNING"/);
  assert.match(visual, /<BaseballHalfInningSequenceV2/);
  assert.match(solo, /<BaseballGameIntroSequenceV2/);
  assert.match(online, /<BaseballGameIntroSequenceV2/);
  assert.match(online, /gameIntroBlocking/);
  assert.match(sequences, /MATCH INTRO/);
  assert.match(sequences, /STARTING PITCHERS/);
  assert.match(sequences, /LINEUP/);
  assert.match(sequences, /PLAY BALL!/);
  assert.match(sequences, /CONTACT/);
  assert.match(sequences, /POWER/);
  assert.match(sequences, /SPEED/);
  assert.match(sequences, /TODAY/);
  assert.match(sequences, /3 OUT/);
  assert.match(sequences, /INNING COMPLETE/);
  assert.match(sequences, /ATTACK/);
});
