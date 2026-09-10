import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentRoot = new URL(
  "../src/components/games/baseball/v2/",
  import.meta.url,
);
const baseballStyle = new URL("../src/styles/baseball-v2.css", import.meta.url);

function readComponent(name: string) {
  return readFile(new URL(name, componentRoot), "utf8");
}

test("타자·투수 HUD는 오늘 기록, 투구 기록, 실시간 체력을 계속 표시한다", async () => {
  const [hud, style] = await Promise.all([
    readComponent("BaseballHudV2.tsx"),
    readFile(baseballStyle, "utf8"),
  ]);

  assert.match(hud, /const batterStats = battingTeam\.batterStats\[batter\.id\]/);
  assert.match(hud, /const pitcherStats = fieldingTeam\.pitcherStats\[pitcher\.id\]/);
  assert.match(hud, /TODAY \$\{batterStats\?\.ab \?\? 0\} AB/);
  assert.match(hud, /\$\{batterStats\?\.h \?\? 0\} H/);
  assert.match(hud, /\$\{batterStats\?\.hr \?\? 0\} HR/);
  assert.match(hud, /PITCHES \$\{pitcherState\.pitchCount\}/);
  assert.match(hud, /K \$\{pitcherStats\?\.strikeouts \?\? 0\}/);
  assert.match(hud, /BB \$\{pitcherStats\?\.walks \?\? 0\}/);
  assert.match(hud, /H \$\{pitcherStats\?\.hitsAllowed \?\? 0\}/);
  assert.match(hud, /R \$\{pitcherStats\?\.runsAllowed \?\? 0\}/);
  assert.match(hud, /<meter[\s\S]*?min=\{0\}[\s\S]*?max=\{100\}[\s\S]*?aria-label=\{`\$\{player\.name\} 투수 체력`\}/);
  assert.match(hud, /stamina=\{pitcherState\.stamina\}/);
  assert.match(style, /\.bbv2-player-summary__statline/);
  assert.match(style, /\.bbv2-player-summary__stamina meter/);
});

test("타격 피드백은 실제 CONTACT payload를 표시하고 일반 타구 화면은 흔들지 않는다", async () => {
  const [visual, feedback, solo, online, style] = await Promise.all([
    readComponent("BaseballVisualEventPresentationV2.tsx"),
    readComponent("BaseballContactFeedbackV2.tsx"),
    readComponent("BaseballSoloGameV2.tsx"),
    readComponent("BaseballOnlineGameV2.tsx"),
    readFile(baseballStyle, "utf8"),
  ]);

  assert.match(visual, /event\.kind === "CONTACT"/);
  assert.match(visual, /<BaseballContactFeedbackV2 event=\{event\} \/>/);
  assert.match(feedback, /baseballContactFeedbackForEventV2\(event\)/);
  assert.match(feedback, /\{feedback\.timingLabel\} TIMING/);
  assert.match(feedback, /\{feedback\.contactLabel\}/);
  assert.match(feedback, /PCI OVERLAP · \{feedback\.pciPercent\}%/);

  for (const source of [solo, online]) {
    assert.match(source, /const stageImpactClass = baseballStageImpactClassV2\(/);
    assert.match(source, /className=\{stageImpactClass\}/);
    assert.doesNotMatch(source, /bbv2-stage--home-run-impact/);
  }

  assert.match(style, /\.bbv2-stage--impact-perfect[\s\S]*?140ms/);
  assert.match(style, /\.bbv2-stage--impact-home-run[\s\S]*?170ms/);
  assert.match(style, /\.bbv2-stage--impact-grand-slam[\s\S]*?220ms/);
  assert.match(style, /@keyframes bbv2-perfect-contact-impact/);
  assert.match(style, /@keyframes bbv2-home-run-camera-impact/);
  assert.match(style, /@keyframes bbv2-grand-slam-camera-impact/);
  assert.match(style, /\.bbv2-contact-feedback\s*\{[\s\S]*?opacity:\s*1/);
  const contactEnterKeyframes = style.slice(
    style.indexOf("@keyframes bbv2-contact-feedback-enter"),
    style.indexOf("@keyframes bbv2-scoring-enter"),
  );
  assert.doesNotMatch(contactEnterKeyframes, /opacity:\s*0/);
  const reducedMotion = style.slice(style.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reducedMotion, /\.bbv2-contact-feedback/);
  assert.match(reducedMotion, /\.bbv2-stage--impact-perfect/);
  assert.match(reducedMotion, /\.bbv2-stage--impact-home-run/);
  assert.match(reducedMotion, /\.bbv2-stage--impact-grand-slam/);
});

test("스트라이크존은 얇고 반투명하며 타자 PCI 반경을 실제 타원 크기로 받는다", async () => {
  const [stage, solo, online, style] = await Promise.all([
    readComponent("BaseballStageV2.tsx"),
    readComponent("BaseballSoloGameV2.tsx"),
    readComponent("BaseballOnlineGameV2.tsx"),
    readFile(baseballStyle, "utf8"),
  ]);

  assert.match(stage, /strikeZoneReticleRadius\?: Vec2 \| null/);
  assert.match(stage, /--bbv2-pci-width/);
  assert.match(stage, /--bbv2-pci-height/);
  assert.match(solo, /createBaseballPciPreviewRadius\(getCurrentBatter\(game\), game\.count, swingType\)/);
  assert.match(online, /createBaseballPciPreviewRadius\([\s\S]*?getCurrentBatter\(presentationGame\)/);
  assert.match(style, /\.bbv2-strike-zone\s*\{[\s\S]*?border:\s*1px solid rgb\(255 255 255 \/ 48%\)/);
  assert.match(style, /width:\s*var\(--bbv2-pci-width, 28%\)/);
  assert.match(style, /height:\s*var\(--bbv2-pci-height, 28%\)/);
});
