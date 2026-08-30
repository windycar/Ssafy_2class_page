import baseballArenaFacing from "../assets/games/baseball-arena-facing.png";
import baseballArenaSwingFacing from "../assets/games/baseball-arena-swing-facing.png";
import baseballBallBody from "../assets/games/baseball-ball-clean-v3.png";
import baseballBatterActionsBlue from "../assets/games/baseball-batter-actions-blue.png";
import baseballBatterActionsRed from "../assets/games/baseball-batter-actions-red-v2.png";
import baseballBattingField from "../assets/games/baseball-batting-field-v4.png";
import baseballCameraHomeRun from "../assets/games/baseball-camera-home-run.png";
import baseballCameraCenterField from "../assets/games/baseball-camera-center-field-v5.png";
import baseballCameraFirstBaseLine from "../assets/games/baseball-camera-first-base-line-v4.png";
import baseballCameraInfieldWide from "../assets/games/baseball-camera-infield-wide-v3.png";
import baseballCameraLeftCenter from "../assets/games/baseball-camera-left-center-v5.png";
import baseballCameraLeftField from "../assets/games/baseball-camera-left-field-v5.png";
import baseballCameraPitcher from "../assets/games/baseball-camera-pitcher-empty.png";
import baseballCameraRightCenter from "../assets/games/baseball-camera-right-center-v5.png";
import baseballCameraRightField from "../assets/games/baseball-camera-right-field-v5.png";
import baseballCameraRunScored from "../assets/games/baseball-camera-run-scored-v4.png";
import baseballCameraScoreboardWide from "../assets/games/baseball-camera-scoreboard-wide-v3.png";
import baseballCameraThirdBaseLine from "../assets/games/baseball-camera-third-base-line-v4.png";
import baseballCatcherActionsRed from "../assets/games/baseball-catcher-actions-red.png";
import baseballCatcherMitt from "../assets/games/baseball-catcher-mitt-v2.png";
import baseballFielderBlue from "../assets/games/baseball-fielder-blue-chibi-v3.png";
import baseballFielderRed from "../assets/games/baseball-fielder-red-chibi-v4.png";
import baseballEffectDouble from "../assets/games/baseball-effect-double-v2.png";
import baseballEffectHit from "../assets/games/baseball-effect-hit-v2.png";
import baseballEffectHomeRun from "../assets/games/baseball-effect-home-run-v2.png";
import baseballEffectOut from "../assets/games/baseball-effect-out-v2.png";
import baseballEffectSafe from "../assets/games/baseball-effect-safe-v2.png";
import baseballEffectScore from "../assets/games/baseball-effect-score-v2.png";
import baseballEffectStrikeout from "../assets/games/baseball-effect-strikeout-v2.png";
import baseballEffectTriple from "../assets/games/baseball-effect-triple-v2.png";
import baseballPitcherActions from "../assets/games/baseball-pitcher-actions-red.png";
import baseballPortraitCpu21 from "../assets/games/baseball-portrait-cpu-21-v2.png";
import baseballPortraitKia01 from "../assets/games/baseball-portrait-kia-01-v2.png";
import baseballPortraitKia03 from "../assets/games/baseball-portrait-kia-03-v2.png";
import baseballPortraitKia05 from "../assets/games/baseball-portrait-kia-05-v2.png";
import baseballPortraitKia16 from "../assets/games/baseball-portrait-kia-16-v2.png";
import baseballPortraitKia25 from "../assets/games/baseball-portrait-kia-25-v2.png";
import baseballPortraitKia34 from "../assets/games/baseball-portrait-kia-34-v2.png";
import baseballPortraitKia42 from "../assets/games/baseball-portrait-kia-42-v2.png";
import baseballPortraitKia47 from "../assets/games/baseball-portrait-kia-47-v2.png";
import baseballPortraitKia54 from "../assets/games/baseball-portrait-kia-54-v2.png";
import baseballPortraitKia66 from "../assets/games/baseball-portrait-kia-66-v2.png";
import baseballRunnerBlue from "../assets/games/baseball-runner-blue-chibi-v3.png";
import baseballRunnerRed from "../assets/games/baseball-runner-red-chibi-v3.png";
import type { BaseballCameraBackgroundSources } from "../utils/games/baseball/cameraBackground.ts";
import type { BaseballResultEffectKey } from "../utils/games/baseball/resultEffect.ts";

export type BaseballV2AssetGroup = "critical" | "lazy";
export type BaseballV2AssetKind = "background" | "character" | "portrait" | "ball" | "effect";
export type BaseballV2PlayerPortraitSources = Readonly<Partial<Record<string, string>>>;
export type BaseballV2ResultEffectSources = Readonly<
  Record<BaseballResultEffectKey, string>
>;

export interface BaseballV2AssetDefinition {
  id: string;
  source: string;
  group: BaseballV2AssetGroup;
  kind: BaseballV2AssetKind;
  /** Human-verified scene art contains no baked-in baseball; the live ball is rendered separately. */
  dynamicBallOnly?: true;
}

export const BASEBALL_V2_BALL_SOURCE = baseballBallBody;
export const BASEBALL_V2_CATCHER_ACTION_SOURCE = baseballCatcherActionsRed;
export const BASEBALL_V2_CATCHER_MITT_SOURCE = baseballCatcherMitt;
export const BASEBALL_V2_SCOREBOARD_BACKGROUND_SOURCE = baseballCameraScoreboardWide;
/** Team index 0 is the blue visitor side and team index 1 is the red home side. */
export const BASEBALL_V2_BATTER_ACTION_SOURCES = Object.freeze([
  baseballBatterActionsBlue,
  baseballBatterActionsRed,
] as const);
export const BASEBALL_V2_RUNNER_SOURCES = Object.freeze([
  baseballRunnerBlue,
  baseballRunnerRed,
] as const);
export const BASEBALL_V2_FIELDER_SOURCES = Object.freeze([
  baseballFielderBlue,
  baseballFielderRed,
] as const);

/** Every official result-effect key resolves to inspected, runtime-used artwork. */
export const BASEBALL_V2_RESULT_EFFECT_SOURCES = Object.freeze({
  hit: baseballEffectHit,
  double: baseballEffectDouble,
  triple: baseballEffectTriple,
  homeRun: baseballEffectHomeRun,
  strikeout: baseballEffectStrikeout,
  score: baseballEffectScore,
  safe: baseballEffectSafe,
  out: baseballEffectOut,
}) satisfies BaseballV2ResultEffectSources;

/**
 * Both stable player ids and roster portrait ids resolve to the same source.
 * That keeps HUD, introductions, and final-result playback compatible with
 * normalized legacy game states while the player data remains the authority.
 */
export const BASEBALL_V2_PLAYER_PORTRAIT_SOURCES = Object.freeze({
  "kia-park-chanho": baseballPortraitKia01,
  "portrait-kia-01": baseballPortraitKia01,
  "kia-choi-wonjun": baseballPortraitKia16,
  "portrait-kia-16": baseballPortraitKia16,
  "kia-kim-doyoung": baseballPortraitKia05,
  "portrait-kia-05": baseballPortraitKia05,
  "kia-choi-hyoungwoo": baseballPortraitKia34,
  "portrait-kia-34": baseballPortraitKia34,
  "kia-na-sungbum": baseballPortraitKia47,
  "portrait-kia-47": baseballPortraitKia47,
  "kia-kim-sunbin": baseballPortraitKia03,
  "portrait-kia-03": baseballPortraitKia03,
  "kia-lee-woosung": baseballPortraitKia25,
  "portrait-kia-25": baseballPortraitKia25,
  "kia-kim-taegun": baseballPortraitKia42,
  "portrait-kia-42": baseballPortraitKia42,
  "kia-lee-changjin": baseballPortraitKia66,
  "portrait-kia-66": baseballPortraitKia66,
  "kia-yang-hyeonjong": baseballPortraitKia54,
  "portrait-kia-54": baseballPortraitKia54,
  "cpu-kang-minjae": baseballPortraitCpu21,
  "portrait-cpu-21": baseballPortraitCpu21,
}) satisfies BaseballV2PlayerPortraitSources;

export const BASEBALL_V2_CAMERA_BACKGROUND_SOURCES = Object.freeze({
  batter: baseballBattingField,
  pitcher: baseballCameraPitcher,
  contact: baseballBattingField,
  infieldWide: baseballCameraInfieldWide,
  leftField: baseballCameraLeftField,
  leftCenter: baseballCameraLeftCenter,
  centerField: baseballCameraCenterField,
  rightCenter: baseballCameraRightCenter,
  rightField: baseballCameraRightField,
  firstBaseLine: baseballCameraFirstBaseLine,
  thirdBaseLine: baseballCameraThirdBaseLine,
  foulLeft: baseballCameraThirdBaseLine,
  foulRight: baseballCameraFirstBaseLine,
  baseRunning: baseballCameraInfieldWide,
  homePlate: baseballCameraRunScored,
  dugoutHome: baseballCameraScoreboardWide,
  dugoutAway: baseballCameraScoreboardWide,
  homeRun: baseballCameraHomeRun,
  replay: baseballCameraScoreboardWide,
}) satisfies BaseballCameraBackgroundSources;

export const BASEBALL_V2_ASSET_MANIFEST = [
  { id: "arena-facing", source: baseballArenaFacing, group: "critical", kind: "background" },
  { id: "arena-swing-facing", source: baseballArenaSwingFacing, group: "critical", kind: "effect" },
  { id: "batting-field", source: baseballBattingField, group: "critical", kind: "background", dynamicBallOnly: true },
  { id: "pitcher-camera", source: baseballCameraPitcher, group: "critical", kind: "background" },
  { id: "ball-body", source: baseballBallBody, group: "critical", kind: "ball" },
  { id: "batter-actions-blue", source: baseballBatterActionsBlue, group: "critical", kind: "character" },
  { id: "batter-actions-red", source: baseballBatterActionsRed, group: "lazy", kind: "character" },
  { id: "pitcher-actions", source: baseballPitcherActions, group: "critical", kind: "character" },
  { id: "catcher-actions-red", source: baseballCatcherActionsRed, group: "critical", kind: "character" },
  { id: "catcher-mitt", source: baseballCatcherMitt, group: "critical", kind: "character" },
  { id: "portrait-kia-01", source: baseballPortraitKia01, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-16", source: baseballPortraitKia16, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-05", source: baseballPortraitKia05, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-34", source: baseballPortraitKia34, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-47", source: baseballPortraitKia47, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-03", source: baseballPortraitKia03, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-25", source: baseballPortraitKia25, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-42", source: baseballPortraitKia42, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-66", source: baseballPortraitKia66, group: "lazy", kind: "portrait" },
  { id: "portrait-kia-54", source: baseballPortraitKia54, group: "lazy", kind: "portrait" },
  { id: "portrait-cpu-21", source: baseballPortraitCpu21, group: "lazy", kind: "portrait" },
  { id: "infield-wide-camera", source: baseballCameraInfieldWide, group: "lazy", kind: "background" },
  { id: "left-field-camera", source: baseballCameraLeftField, group: "lazy", kind: "background", dynamicBallOnly: true },
  { id: "left-center-camera", source: baseballCameraLeftCenter, group: "lazy", kind: "background", dynamicBallOnly: true },
  { id: "center-field-camera", source: baseballCameraCenterField, group: "lazy", kind: "background", dynamicBallOnly: true },
  { id: "right-center-camera", source: baseballCameraRightCenter, group: "lazy", kind: "background", dynamicBallOnly: true },
  { id: "right-field-camera", source: baseballCameraRightField, group: "lazy", kind: "background", dynamicBallOnly: true },
  { id: "first-base-line-camera", source: baseballCameraFirstBaseLine, group: "lazy", kind: "background", dynamicBallOnly: true },
  { id: "third-base-line-camera", source: baseballCameraThirdBaseLine, group: "lazy", kind: "background", dynamicBallOnly: true },
  { id: "run-scored-camera", source: baseballCameraRunScored, group: "lazy", kind: "effect", dynamicBallOnly: true },
  { id: "scoreboard-wide-camera", source: baseballCameraScoreboardWide, group: "lazy", kind: "background" },
  { id: "home-run-camera", source: baseballCameraHomeRun, group: "lazy", kind: "effect" },
  { id: "runner-blue", source: baseballRunnerBlue, group: "lazy", kind: "character" },
  { id: "runner-red", source: baseballRunnerRed, group: "lazy", kind: "character" },
  { id: "fielder-blue", source: baseballFielderBlue, group: "lazy", kind: "character" },
  { id: "fielder-red", source: baseballFielderRed, group: "lazy", kind: "character" },
  { id: "effect-hit", source: baseballEffectHit, group: "lazy", kind: "effect" },
  { id: "effect-double", source: baseballEffectDouble, group: "lazy", kind: "effect" },
  { id: "effect-triple", source: baseballEffectTriple, group: "lazy", kind: "effect" },
  { id: "effect-home-run", source: baseballEffectHomeRun, group: "lazy", kind: "effect" },
  { id: "effect-strikeout", source: baseballEffectStrikeout, group: "lazy", kind: "effect" },
  { id: "effect-score", source: baseballEffectScore, group: "lazy", kind: "effect" },
  { id: "effect-safe", source: baseballEffectSafe, group: "lazy", kind: "effect" },
  { id: "effect-out", source: baseballEffectOut, group: "lazy", kind: "effect" },
] as const satisfies readonly BaseballV2AssetDefinition[];

export type BaseballV2AssetId = (typeof BASEBALL_V2_ASSET_MANIFEST)[number]["id"];
export type BaseballV2Asset = (typeof BASEBALL_V2_ASSET_MANIFEST)[number];

export const BASEBALL_V2_ASSET_REGISTRY = Object.freeze(
  Object.fromEntries(BASEBALL_V2_ASSET_MANIFEST.map((asset) => [asset.id, asset])),
) as Readonly<Record<BaseballV2AssetId, BaseballV2Asset>>;

export function getBaseballV2AssetSources(group: BaseballV2AssetGroup) {
  return BASEBALL_V2_ASSET_MANIFEST
    .filter((asset) => asset.group === group)
    .map((asset) => asset.source);
}

export const BASEBALL_V2_CRITICAL_ASSET_SOURCES = getBaseballV2AssetSources("critical");
export const BASEBALL_V2_LAZY_ASSET_SOURCES = getBaseballV2AssetSources("lazy");
