import type {
  BaseballPlayResultCode,
  OfficialPlayResult,
  VisualEventKind,
} from "./types.ts";

export type BaseballResultEffectKey =
  | "hit"
  | "double"
  | "triple"
  | "homeRun"
  | "strikeout"
  | "score"
  | "safe"
  | "out";

const RESULT_EFFECT_BY_CODE = {
  BALL: null,
  CALLED_STRIKE: null,
  SWINGING_STRIKE: null,
  FOUL: null,
  WALK: null,
  STRIKEOUT_LOOKING: "strikeout",
  STRIKEOUT_SWINGING: "strikeout",
  GROUND_OUT_1B: "out",
  GROUND_OUT_2B: "out",
  GROUND_OUT_SS: "out",
  GROUND_OUT_3B: "out",
  FLY_OUT_LF: "out",
  FLY_OUT_CF: "out",
  FLY_OUT_RF: "out",
  LINE_OUT: "out",
  POP_OUT: "out",
  SINGLE_LEFT: "hit",
  SINGLE_CENTER: "hit",
  SINGLE_RIGHT: "hit",
  INFIELD_SINGLE: "hit",
  DOUBLE_LEFT: "double",
  DOUBLE_CENTER: "double",
  DOUBLE_RIGHT: "double",
  TRIPLE: "triple",
  HOME_RUN_LEFT: "homeRun",
  HOME_RUN_CENTER: "homeRun",
  HOME_RUN_RIGHT: "homeRun",
  DOUBLE_PLAY: "out",
  FIELDER_CHOICE: null,
  SAC_FLY: "out",
  ERROR: "safe",
} as const satisfies Readonly<
  Record<BaseballPlayResultCode, BaseballResultEffectKey | null>
>;

/** Maps an unambiguous official result code to its reusable result graphic. */
export function baseballResultEffectForCode(
  code: BaseballPlayResultCode,
): BaseballResultEffectKey | null {
  return RESULT_EFFECT_BY_CODE[code];
}

/**
 * Resolves result graphics that need the complete official ruling.
 * A fielder's choice is deliberately decided from the recorded out rather than
 * its result name because the batter can be safe while another runner is out.
 */
export function baseballResultEffectForOfficial(
  official: OfficialPlayResult,
): BaseballResultEffectKey | null {
  if (official.code === "FIELDER_CHOICE") {
    return official.outsRecorded > 0 ? "out" : "safe";
  }

  return baseballResultEffectForCode(official.code);
}

/**
 * Selects the graphic for one visual-event phase without presentation state.
 * Fielding shows the immediate SAFE/OUT call, scoring owns SCORE, and the
 * terminal result shows the official hit or out classification.
 */
export function baseballResultEffectForVisualEvent(
  kind: VisualEventKind,
  official: OfficialPlayResult | null,
): BaseballResultEffectKey | null {
  if (kind === "RUN_SCORE") return "score";
  if (!official) return null;

  if (kind === "FIELD_RESULT") {
    return official.outsRecorded > 0 ? "out" : "safe";
  }

  if (kind === "PLAY_RESULT") {
    return baseballResultEffectForOfficial(official);
  }

  return null;
}
