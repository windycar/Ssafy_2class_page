import assert from "node:assert/strict";
import test from "node:test";

import {
  baseballContactFeedbackForEventV2,
  baseballStageImpactClassV2,
  baseballStageImpactForEventV2,
} from "../src/utils/games/baseball/contactFeedback.ts";
import type {
  ContactQuality,
  OfficialPlayResult,
  SwingTiming,
  VisualEvent,
} from "../src/utils/games/baseball/types.ts";

function contactEvent(
  timing: SwingTiming,
  quality: ContactQuality,
  pciOverlap = 0.83,
): VisualEvent {
  return {
    id: "play-1:visual:00:contact",
    playId: "play-1",
    sequence: 0,
    kind: "CONTACT",
    camera: "CONTACT",
    durationMs: 420,
    skippable: false,
    payload: {
      contact: {
        result: "IN_PLAY",
        timing,
        quality,
        timingError: 0.01,
        locationError: 0.02,
        pciOverlap,
        batterId: "kia-05",
        pitcherId: "cpu-21",
        swingType: "NORMAL",
        pitchType: "fourSeam",
      },
    },
  };
}

function official(code: OfficialPlayResult["code"], runsScored: number): OfficialPlayResult {
  return {
    playId: "play-1",
    code,
    batterId: "kia-05",
    pitcherId: "cpu-21",
    outsRecorded: 0,
    runsScored,
    hitValue: code.startsWith("HOME_RUN") ? 4 : 1,
    rbi: runsScored,
    scoredRunnerIds: [],
    outRunnerIds: [],
    fielderIds: [],
    errorFielderId: null,
    plateAppearanceEnded: true,
  };
}

test("CONTACT payload는 실제 타이밍·접촉 품질·PCI 중첩을 사용자 피드백으로 변환한다", () => {
  assert.deepEqual(
    (["VERY_EARLY", "EARLY", "GOOD", "PERFECT", "LATE", "VERY_LATE"] as const)
      .map((timing) => baseballContactFeedbackForEventV2(contactEvent(timing, "GOOD"))?.timingLabel),
    ["VERY EARLY", "EARLY", "GOOD", "PERFECT", "LATE", "VERY LATE"],
  );
  assert.deepEqual(
    (["WEAK", "GOOD", "PERFECT"] as const)
      .map((quality) => baseballContactFeedbackForEventV2(contactEvent("GOOD", quality))?.contactLabel),
    ["WEAK CONTACT", "GOOD CONTACT", "PERFECT CONTACT"],
  );
  assert.deepEqual(baseballContactFeedbackForEventV2(contactEvent("VERY_EARLY", "WEAK", 0.374)), {
    timing: "VERY_EARLY",
    quality: "WEAK",
    timingLabel: "VERY EARLY",
    contactLabel: "WEAK CONTACT",
    timingTone: "early",
    contactTone: "weak",
    pciPercent: 37,
  });
  assert.deepEqual(baseballContactFeedbackForEventV2(contactEvent("PERFECT", "PERFECT", 1.4)), {
    timing: "PERFECT",
    quality: "PERFECT",
    timingLabel: "PERFECT",
    contactLabel: "PERFECT CONTACT",
    timingTone: "perfect",
    contactTone: "perfect",
    pciPercent: 100,
  });
});

test("화면 충격은 PERFECT·홈런·만루홈런만 세 단계 강도로 구분한다", () => {
  const perfect = contactEvent("PERFECT", "PERFECT");
  const good = contactEvent("GOOD", "GOOD");
  assert.equal(baseballStageImpactForEventV2(perfect, official("SINGLE_CENTER", 0)), "perfect");
  assert.equal(baseballStageImpactClassV2(perfect, official("SINGLE_CENTER", 0)), "bbv2-stage--impact-perfect");
  assert.equal(baseballStageImpactForEventV2(good, official("HOME_RUN_CENTER", 1)), "home-run");
  assert.equal(baseballStageImpactClassV2(good, official("HOME_RUN_CENTER", 4)), "bbv2-stage--impact-grand-slam");
  assert.equal(
    baseballStageImpactForEventV2(contactEvent("GOOD", "GOOD"), official("DOUBLE_CENTER", 0)),
    null,
  );
  assert.equal(
    baseballStageImpactForEventV2({ ...perfect, kind: "BALL_FLIGHT" }, official("HOME_RUN_CENTER", 4)),
    null,
  );
});

test("깨진 CONTACT payload는 화면 문구나 충격 효과를 만들지 않는다", () => {
  const malformed = {
    ...contactEvent("GOOD", "GOOD"),
    payload: { contact: { timing: "UNKNOWN", quality: "GOOD", pciOverlap: Number.NaN } },
  };
  assert.equal(baseballContactFeedbackForEventV2(malformed), null);
  assert.equal(baseballStageImpactForEventV2(malformed, official("SINGLE_LEFT", 0)), null);
});
