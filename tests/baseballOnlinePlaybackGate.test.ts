import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL(
  "../src/components/games/baseball/v2/BaseballOnlineGameV2.tsx",
  import.meta.url,
);
const controllerUrl = new URL(
  "../src/hooks/useBaseballOnlineController.ts",
  import.meta.url,
);

async function readComponent() {
  return readFile(componentUrl, "utf8");
}

async function readController() {
  return readFile(controllerUrl, "utf8");
}

test("온라인 canonical RESOLVED 플레이는 공통 재생기에 sourceGame과 함께 전달된다", async () => {
  const source = await readComponent();

  assert.match(source, /useBaseballVisualPlayback/);
  assert.match(
    source,
    /const playback = useBaseballVisualPlayback\(\{[\s\S]*?onComplete: \(playId\)[\s\S]*?acknowledgePresentation\(playId\)/,
  );
  assert.match(source, /activePlay\?\.phase === "RESOLVED"/);
  assert.match(
    source,
    /handledResolvedPlayIdsRef\.current\.has\(resolvedPlay\.playId\)/,
  );
  assert.match(
    source,
    /playback\.start\(\{[\s\S]*?playId: resolvedPlay\.playId,[\s\S]*?events: resolvedPlaybackPlan\.plan\.events,[\s\S]*?sourceGame: game/,
  );
  assert.match(
    source,
    /authoritativePresentationGame = playback\.active && playback\.sourceGame[\s\S]*?\? playback\.sourceGame[\s\S]*?: game/,
  );
  assert.match(source, /preResolutionGameByPlayIdRef/);
  assert.match(
    source,
    /presentationGate\?\.playId === resolvedPlay\.playId[\s\S]*?cloneGameState\(presentationGate\.displayBeforeResult\)/,
  );
  assert.match(source, /cloneGameState\(game\)/);
  assert.match(source, /createSoloVisualPlaybackPlan\(\{/);
  assert.match(source, /resolveBaseballVisualPlaybackDisplayGame\(/);
  assert.match(source, /presentedVisualEvent = playback\.currentEvent/);
  assert.match(
    source,
    /presentedVisualEventProgressSource = playback\.currentEventProgressSource/,
  );
  assert.match(source, /progressSource: presentedVisualEventProgressSource/);
  assert.doesNotMatch(source, /setBattedProgress|\[battedProgress,/);
  assert.match(source, /createBaseballRunnerPresentationsV2\(\{/);
  assert.match(source, /authoritativeGame: authoritativePresentationGame/);
  assert.match(source, /presentationGame,/);
  assert.match(source, /runnerAssetSrc: BASEBALL_V2_RUNNER_SOURCES\[visualBattingTeam\]/);
  assert.match(source, /createBaseballFielderPresentationsV2\(\{/);
  assert.match(source, /fielderAssetSrc: BASEBALL_V2_FIELDER_SOURCES\[visualFieldingTeam\]/);
  assert.match(source, /fielders=\{fielders\}/);
});

test("초기 canonical 복구와 Presence 검증 전에는 캐시된 RESOLVED 재생을 시작하지 않는다", async () => {
  const [source, controllerSource] = await Promise.all([
    readComponent(),
    readController(),
  ]);

  assert.match(
    controllerSource,
    /const \[recovering, setRecovering\] = useState\(\(\) => enabled && Boolean\(room\?\.id\)\)/,
  );
  assert.match(
    source,
    /const onlinePlaybackReady = !recovering\s*&& allPlayersConnected\s*&& !presenceRecoveryPending/,
  );
  assert.match(
    source,
    /const resolvedPlaybackPending = Boolean\([\s\S]*?onlinePlaybackReady[\s\S]*?!handledResolvedPlayIdsRef\.current\.has\(resolvedPlay\.playId\)/,
  );

  const playbackEffectStart = source.indexOf('if (room?.status === "cancelled")');
  const playbackEffectEnd = source.indexOf(
    "if (!activePitch || presentationPlay?.phase",
    playbackEffectStart,
  );
  const playbackEffect = source.slice(playbackEffectStart, playbackEffectEnd);
  assert.ok(playbackEffectStart >= 0);
  assert.ok(playbackEffect.indexOf("if (!resolvedPlaybackPending") >= 0);
  assert.ok(playbackEffect.indexOf("if (!resolvedPlaybackPending") < playbackEffect.indexOf("playback.start"));
});

test("canonical gate에서 내 좌석이 ACK하지 않은 play만 재생하고 완료 시 ACK한다", async () => {
  const source = await readComponent();

  assert.match(source, /presentationPending,/);
  assert.match(source, /presentationGate,/);
  assert.match(source, /acknowledgePresentation,/);
  assert.match(source, /presentationGate\?\.playId === resolvedPlay\.playId/);
  assert.match(source, /const resolvedPlaybackHasSnapshot = Boolean/);
  assert.match(source, /&& resolvedPlaybackHasSnapshot/);
  assert.match(source, /!presentationGate\.acknowledgedSeats\.includes\(actorSeat\)/);
  assert.match(source, /void acknowledgePresentation\(playId\)/);
  assert.match(source, /liveFinalPlaybackPending/);
  assert.match(source, /preResolutionGameByPlayIdRef\.current\.has\(resolvedPlay\.playId\)/);
  assert.match(
    source,
    /presentationGate\.displayBeforeResult[\s\S]*?void acknowledgePresentation\(resolvedPlay\.playId\)/,
  );
});

test("canonical play가 바뀌면 기존 재생을 취소하고 처리한 play는 영구 pending으로 되돌리지 않는다", async () => {
  const source = await readComponent();

  assert.match(
    source,
    /playback\.active\s*&& \(!resolvedPlay \|\| playback\.playId !== resolvedPlay\.playId\)/,
  );
  assert.match(source, /handledResolvedPlayIdsRef = useRef\(new Set<string>\(\)\)/);
  assert.match(source, /handledResolvedPlayIdsRef\.current\.add\(resolvedPlay\.playId\)/);
  assert.match(
    source,
    /const activeOnlinePlaybackPlan = playback\.active\s*&& onlineVisualPlaybackPlanRef\.current\?\.playId === playback\.playId/,
  );

  const playbackEffectStart = source.indexOf('if (room?.status === "cancelled")');
  const playbackEffectEnd = source.indexOf(
    "if (!activePitch || presentationPlay?.phase",
    playbackEffectStart,
  );
  const playbackEffect = source.slice(playbackEffectStart, playbackEffectEnd);
  const staleGuard = playbackEffect.indexOf("playback.active");
  const cancel = playbackEffect.indexOf("playback.cancel()", staleGuard);
  const readyGuard = playbackEffect.indexOf("if (!resolvedPlaybackPending");
  const start = playbackEffect.indexOf("playback.start");
  const handled = playbackEffect.indexOf("handledResolvedPlayIdsRef.current.add");
  assert.ok(staleGuard >= 0);
  assert.ok(staleGuard < cancel);
  assert.ok(cancel < readyGuard);
  assert.ok(readyGuard < start);
  assert.ok(start < handled);
});

test("재생 시작 전 대기 프레임부터 투구·타격·조준·TAKE 서버 입력을 잠근다", async () => {
  const source = await readComponent();

  assert.match(
    source,
    /const playbackBlocking = playback\.active \|\| resolvedPlaybackPending/,
  );
  assert.match(source, /const canPitchNow = canPitch && !playbackBlocking/);
  assert.match(source, /const canBatNow = canBat && !playbackBlocking/);
  assert.match(source, /const canAim = canPitchNow \|\| canBatNow/);
  assert.match(source, /if \(canAim\) setAim\(point\)/);
  assert.match(source, /onAimChange=\{canAim \? handleAimChange : undefined\}/);
  assert.match(source, /\{canBatNow \? \(/);
  assert.match(source, /if \(canPitchNow\) setSelectedPitchType\(pitch\)/);
  assert.match(source, /if \(canBatNow\) setSwingType\(swing\)/);
  assert.match(source, /if \(canBatNow\) void submitTake\(\)/);
  assert.match(source, /onClick=\{handleTake\}/);

  const primaryStart = source.indexOf("const handlePrimaryAction");
  const primaryEnd = source.indexOf("const canAim", primaryStart);
  const primaryBody = source.slice(primaryStart, primaryEnd);
  assert.ok(primaryBody.indexOf("if (playbackBlocking)") >= 0);
  assert.ok(primaryBody.indexOf("if (playbackBlocking)") < primaryBody.indexOf("submitPitch"));
  assert.ok(primaryBody.indexOf("if (playbackBlocking)") < primaryBody.indexOf("submitSwing"));

  const keyboardStart = source.indexOf("const handleKeyDown");
  const keyboardEnd = source.indexOf("window.addEventListener", keyboardStart);
  const keyboardBody = source.slice(keyboardStart, keyboardEnd);
  assert.ok(keyboardBody.indexOf("if (playbackBlocking)") >= 0);
  assert.ok(keyboardBody.indexOf("if (playbackBlocking)") < keyboardBody.indexOf("canPitchNow"));
  assert.ok(keyboardBody.indexOf("if (playbackBlocking)") < keyboardBody.indexOf("canBatNow"));
});

test("온라인 재생 중에는 현재 이벤트 카메라·진행률을 쓰고 최종 결과를 먼저 띄우지 않는다", async () => {
  const source = await readComponent();

  assert.match(source, /cameraMode: BaseballCameraMode = presentedVisualEvent\?\.camera/);
  assert.match(source, /presentedVisualEvent\?\.kind === "BALL_FLIGHT"/);
  assert.match(source, /presentedVisualEventProgress/);
  assert.match(
    source,
    /hud=\{presentationGame \? \(\s*<BaseballHudV2\s+game=\{presentationGame\}\s+assets=\{BASEBALL_V2_HUD_ASSETS\}/,
  );
  assert.match(source, /else if \(playbackBlocking\)/);
  assert.match(source, /<BaseballVisualEventOverlayV2/);
  assert.match(source, /official=\{authoritativePresentationGame\.lastPlay\}/);
  assert.match(source, /else if \(role === "FINAL"\)/);
  assert.match(
    source,
    /!playbackBlocking && \(!allPlayersConnected \|\| presenceRecoveryPending\)/,
  );

  const cancelledIndex = source.indexOf('room && game && room.status === "cancelled"');
  const spectatorIndex = source.indexOf('role === "SPECTATING"', cancelledIndex);
  const finalIndex = source.indexOf('role === "FINAL"', spectatorIndex);
  assert.ok(cancelledIndex >= 0);
  assert.ok(cancelledIndex < spectatorIndex);
  assert.ok(cancelledIndex < finalIndex);
});

test("FINAL 판정 재생도 skippable 이벤트면 클릭·터치 기본 버튼으로 건너뛴다", async () => {
  const source = await readComponent();

  assert.match(
    source,
    /const eventCanSkip = playback\.active\s*&& \(Boolean\(playback\.currentEvent\?\.skippable\) \|\| homeRunSequenceCanSkip\)/,
  );
  assert.match(
    source,
    /disabled=\{role === "SPECTATING"\s*\|\| \(role === "FINAL" && !eventCanSkip\)\s*\|\| \(playbackBlocking && !eventCanSkip\)\}/,
  );
  assert.match(
    source,
    /primaryActionEnabled=\{gameIntroBlocking \|\| eventCanSkip \|\| canPitchNow \|\| canBatNow\}/,
  );
  assert.match(source, /onPrimaryAction=\{handlePrimaryAction\}/);
});
