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
import baseballPitcherActions from "../assets/games/baseball-pitcher-actions-red.png";
import baseballRunnerBlue from "../assets/games/baseball-runner-blue-chibi-v3.png";
import baseballRunnerRed from "../assets/games/baseball-runner-red-chibi-v3.png";
import type { BaseballCameraBackgroundSources } from "../utils/games/baseball/cameraBackground.ts";

export type BaseballV2AssetGroup = "critical" | "lazy";
export type BaseballV2AssetKind = "background" | "character" | "ball" | "effect";

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

export const BASEBALL_V2_CAMERA_BACKGROUND_SOURCES = Object.freeze({
  batter: baseballBattingField,
  pitcher: baseballCameraPitcher,
  infieldWide: baseballCameraInfieldWide,
  leftField: baseballCameraLeftField,
  leftCenter: baseballCameraLeftCenter,
  centerField: baseballCameraCenterField,
  rightCenter: baseballCameraRightCenter,
  rightField: baseballCameraRightField,
  firstBaseLine: baseballCameraFirstBaseLine,
  thirdBaseLine: baseballCameraThirdBaseLine,
  runScored: baseballCameraRunScored,
  homeRun: baseballCameraHomeRun,
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
