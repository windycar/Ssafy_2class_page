import type {
  BaseballCameraMode,
  BattedBallZone,
  TeamIndex,
} from "./types.ts";

export type BaseballCameraPerspective = "BATTING" | "PITCHING" | "FIELD";

export interface BaseballCameraBackgroundSources {
  readonly batter: string;
  readonly pitcher: string;
  readonly contact: string;
  readonly infieldWide: string;
  readonly leftField: string;
  readonly leftCenter: string;
  readonly centerField: string;
  readonly rightCenter: string;
  readonly rightField: string;
  readonly firstBaseLine: string;
  readonly thirdBaseLine: string;
  readonly foulLeft: string;
  readonly foulRight: string;
  readonly baseRunning: string;
  readonly homePlate: string;
  readonly dugoutHome: string;
  readonly dugoutAway: string;
  readonly homeRun: string;
  readonly replay: string;
}

export interface BaseballCameraBackgroundContext {
  readonly battingTeam?: TeamIndex;
  readonly battedBallZone?: BattedBallZone | null;
}

type BaseballCameraBackgroundKey = keyof BaseballCameraBackgroundSources;

const CAMERA_BACKGROUND_KEY_BY_MODE = {
  BATTER: "batter",
  PITCHER: "pitcher",
  CONTACT: "contact",
  INFIELD: "infieldWide",
  LEFT_FIELD: "leftField",
  LEFT_CENTER: "leftCenter",
  CENTER_FIELD: "centerField",
  RIGHT_CENTER: "rightCenter",
  RIGHT_FIELD: "rightField",
  FIRST_BASE_LINE: "firstBaseLine",
  THIRD_BASE_LINE: "thirdBaseLine",
  BASE_RUNNING: "baseRunning",
  RUN_SCORED: "homePlate",
  HOME_RUN: "homeRun",
  REPLAY: "replay",
} as const satisfies Readonly<Partial<Record<BaseballCameraMode, BaseballCameraBackgroundKey>>>;

export function resolveBaseballCameraBackground(
  camera: BaseballCameraMode,
  perspective: BaseballCameraPerspective,
  sources: BaseballCameraBackgroundSources,
  context: BaseballCameraBackgroundContext = {},
) {
  if (camera === "FOUL") {
    return context.battedBallZone === "FOUL_RIGHT"
      ? sources.foulRight
      : sources.foulLeft;
  }

  if (camera === "DUGOUT") {
    return context.battingTeam === 0
      ? sources.dugoutAway
      : sources.dugoutHome;
  }

  const mappedKey = CAMERA_BACKGROUND_KEY_BY_MODE[
    camera as keyof typeof CAMERA_BACKGROUND_KEY_BY_MODE
  ];
  if (mappedKey) return sources[mappedKey];

  // Future camera modes fail soft to the active perspective. Every current V2
  // mode is handled above or in CAMERA_BACKGROUND_KEY_BY_MODE.
  if (perspective === "BATTING") return sources.batter;
  if (perspective === "PITCHING") return sources.pitcher;
  return sources.infieldWide;
}
