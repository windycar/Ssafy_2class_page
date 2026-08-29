import assert from "node:assert/strict";
import test from "node:test";

import {
  baseballResultEffectForCode,
  baseballResultEffectForOfficial,
  baseballResultEffectForVisualEvent,
  type BaseballResultEffectKey,
} from "../src/utils/games/baseball/resultEffect.ts";
import type {
  BaseballPlayResultCode,
  OfficialPlayResult,
} from "../src/utils/games/baseball/types.ts";

function official(
  code: BaseballPlayResultCode,
  overrides: Partial<OfficialPlayResult> = {},
): OfficialPlayResult {
  return {
    playId: "play-result-effect",
    code,
    batterId: "batter-1",
    pitcherId: "pitcher-1",
    outsRecorded: 0,
    runsScored: 0,
    hitValue: 0,
    rbi: 0,
    scoredRunnerIds: [],
    outRunnerIds: [],
    fielderIds: [],
    errorFielderId: null,
    plateAppearanceEnded: true,
    ...overrides,
  };
}

function assertCodesMapTo(
  codes: readonly BaseballPlayResultCode[],
  expected: BaseballResultEffectKey | null,
) {
  for (const code of codes) {
    assert.equal(baseballResultEffectForCode(code), expected, code);
  }
}

test("공식 결과 코드를 8개 결과 연출 키로 분류한다", () => {
  assertCodesMapTo(
    ["SINGLE_LEFT", "SINGLE_CENTER", "SINGLE_RIGHT", "INFIELD_SINGLE"],
    "hit",
  );
  assertCodesMapTo(["DOUBLE_LEFT", "DOUBLE_CENTER", "DOUBLE_RIGHT"], "double");
  assertCodesMapTo(["TRIPLE"], "triple");
  assertCodesMapTo(
    ["HOME_RUN_LEFT", "HOME_RUN_CENTER", "HOME_RUN_RIGHT"],
    "homeRun",
  );
  assertCodesMapTo(["STRIKEOUT_LOOKING", "STRIKEOUT_SWINGING"], "strikeout");
  assertCodesMapTo(
    [
      "GROUND_OUT_1B",
      "GROUND_OUT_2B",
      "GROUND_OUT_SS",
      "GROUND_OUT_3B",
      "FLY_OUT_LF",
      "FLY_OUT_CF",
      "FLY_OUT_RF",
      "LINE_OUT",
      "POP_OUT",
      "DOUBLE_PLAY",
      "SAC_FLY",
    ],
    "out",
  );
  assertCodesMapTo(["ERROR"], "safe");
});

test("투구 중간 판정과 볼넷은 결과 이미지로 과장하지 않는다", () => {
  assertCodesMapTo(
    ["BALL", "CALLED_STRIKE", "SWINGING_STRIKE", "FOUL", "WALK"],
    null,
  );
});

test("야수 선택은 공식 아웃 기록을 기준으로 SAFE 또는 OUT을 고른다", () => {
  assert.equal(
    baseballResultEffectForOfficial(official("FIELDER_CHOICE")),
    "safe",
  );
  assert.equal(
    baseballResultEffectForOfficial(official("FIELDER_CHOICE", { outsRecorded: 1 })),
    "out",
  );
});

test("시각 이벤트 단계가 FIELD_RESULT, RUN_SCORE, PLAY_RESULT 연출을 분리한다", () => {
  const single = official("SINGLE_CENTER", { hitValue: 1 });
  const groundOut = official("GROUND_OUT_SS", {
    outsRecorded: 1,
    outRunnerIds: ["batter-1"],
  });
  const homeRun = official("HOME_RUN_CENTER", {
    runsScored: 2,
    hitValue: 4,
    rbi: 2,
  });

  assert.equal(baseballResultEffectForVisualEvent("FIELD_RESULT", single), "safe");
  assert.equal(baseballResultEffectForVisualEvent("FIELD_RESULT", groundOut), "out");
  assert.equal(baseballResultEffectForVisualEvent("RUN_SCORE", homeRun), "score");
  assert.equal(baseballResultEffectForVisualEvent("PLAY_RESULT", single), "hit");
  assert.equal(baseballResultEffectForVisualEvent("PLAY_RESULT", homeRun), "homeRun");
});

test("결과 그래픽을 소유하지 않는 단계와 공식 판정 누락은 이미지를 고르지 않는다", () => {
  const triple = official("TRIPLE", { hitValue: 3 });

  assert.equal(baseballResultEffectForVisualEvent("CONTACT", triple), null);
  assert.equal(baseballResultEffectForVisualEvent("BALL_FLIGHT", triple), null);
  assert.equal(baseballResultEffectForVisualEvent("RUNNER_ADVANCE", triple), null);
  assert.equal(baseballResultEffectForVisualEvent("SCOREBOARD_UPDATE", triple), null);
  assert.equal(baseballResultEffectForVisualEvent("PLAY_RESULT", null), null);
  assert.equal(baseballResultEffectForVisualEvent("RUN_SCORE", null), "score");
});
