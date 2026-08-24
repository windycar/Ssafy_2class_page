import type { BaseballCameraMode } from "./types.ts";

export type BaseballCameraPerspective = "BATTING" | "PITCHING" | "FIELD";

export interface BaseballCameraBackgroundSources {
  readonly batter: string;
  readonly pitcher: string;
  readonly infieldWide: string;
  readonly leftField: string;
  readonly leftCenter: string;
  readonly centerField: string;
  readonly rightCenter: string;
  readonly rightField: string;
  readonly runScored: string;
  readonly homeRun: string;
}

type BaseballCameraBackgroundKey = keyof BaseballCameraBackgroundSources;

const CAMERA_BACKGROUND_KEY_BY_MODE = {
  INFIELD: "infieldWide",
  LEFT_FIELD: "leftField",
  LEFT_CENTER: "leftCenter",
  CENTER_FIELD: "centerField",
  RIGHT_CENTER: "rightCenter",
  RIGHT_FIELD: "rightField",
  BASE_RUNNING: "infieldWide",
  RUN_SCORED: "runScored",
  HOME_RUN: "homeRun",
} as const satisfies Readonly<Partial<Record<BaseballCameraMode, BaseballCameraBackgroundKey>>>;

export function resolveBaseballCameraBackground(
  camera: BaseballCameraMode,
  perspective: BaseballCameraPerspective,
  sources: BaseballCameraBackgroundSources,
) {
  const mappedKey = CAMERA_BACKGROUND_KEY_BY_MODE[
    camera as keyof typeof CAMERA_BACKGROUND_KEY_BY_MODE
  ];
  if (mappedKey) return sources[mappedKey];

  if (camera === "BATTER") return sources.batter;
  if (camera === "PITCHER") return sources.pitcher;
  if (perspective === "BATTING") return sources.batter;
  if (perspective === "PITCHING") return sources.pitcher;
  return sources.infieldWide;
}
