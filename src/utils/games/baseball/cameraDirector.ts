import type {
  BaseballCameraMode,
  BattedBall,
  BattedBallZone,
  OfficialPlayResult,
  RunnerAdvance,
  RunnerResolution,
} from "./types.ts";

const ZONE_CAMERA: Readonly<Record<BattedBallZone, BaseballCameraMode>> = {
  LF: "LEFT_FIELD",
  LCF: "LEFT_CENTER",
  CF: "CENTER_FIELD",
  RCF: "RIGHT_CENTER",
  RF: "RIGHT_FIELD",
  "3B": "INFIELD",
  SS: "INFIELD",
  "2B": "INFIELD",
  "1B": "INFIELD",
  FOUL_LEFT: "FOUL",
  FOUL_RIGHT: "FOUL",
};

const CODE_CAMERA: Partial<
  Readonly<Record<OfficialPlayResult["code"], BaseballCameraMode>>
> = {
  FOUL: "FOUL",
  GROUND_OUT_1B: "INFIELD",
  GROUND_OUT_2B: "INFIELD",
  GROUND_OUT_SS: "INFIELD",
  GROUND_OUT_3B: "INFIELD",
  FLY_OUT_LF: "LEFT_FIELD",
  FLY_OUT_CF: "CENTER_FIELD",
  FLY_OUT_RF: "RIGHT_FIELD",
  SINGLE_LEFT: "LEFT_FIELD",
  SINGLE_CENTER: "CENTER_FIELD",
  SINGLE_RIGHT: "RIGHT_FIELD",
  INFIELD_SINGLE: "INFIELD",
  DOUBLE_LEFT: "LEFT_FIELD",
  DOUBLE_CENTER: "CENTER_FIELD",
  DOUBLE_RIGHT: "RIGHT_FIELD",
  TRIPLE: "BASE_RUNNING",
  DOUBLE_PLAY: "BASE_RUNNING",
  FIELDER_CHOICE: "BASE_RUNNING",
  SAC_FLY: "BASE_RUNNING",
  ERROR: "BASE_RUNNING",
  WALK: "DUGOUT",
  STRIKEOUT_LOOKING: "DUGOUT",
  STRIKEOUT_SWINGING: "DUGOUT",
};

function isHomeRunCode(code: OfficialPlayResult["code"]) {
  return code === "HOME_RUN_LEFT"
    || code === "HOME_RUN_CENTER"
    || code === "HOME_RUN_RIGHT";
}

/**
 * Selects the widest useful field camera for the batted-ball path.
 * Ground balls stay on the infield camera even when their terminal zone points
 * toward an outfielder, so the first defensive play remains visible.
 */
export function cameraForBattedBall(ball: BattedBall): BaseballCameraMode {
  if (!ball.fair || ball.zone === "FOUL_LEFT" || ball.zone === "FOUL_RIGHT") {
    return "FOUL";
  }

  if (ball.type === "GROUND") {
    return "INFIELD";
  }

  return ZONE_CAMERA[ball.zone];
}

/** Selects the result/reaction camera without consulting presentation state. */
export function cameraForOfficialResult(
  official: OfficialPlayResult,
  ball?: BattedBall | null,
): BaseballCameraMode {
  if (isHomeRunCode(official.code)) {
    return "HOME_RUN";
  }

  if (official.runsScored > 0) {
    return "RUN_SCORED";
  }

  if (official.code === "FOUL") {
    return "FOUL";
  }

  if (ball) {
    return cameraForBattedBall(ball);
  }

  const codeCamera = CODE_CAMERA[official.code];
  if (codeCamera) {
    return codeCamera;
  }

  if (official.hitValue > 0 || official.outRunnerIds.length > 0) {
    return "BASE_RUNNING";
  }

  return official.plateAppearanceEnded ? "DUGOUT" : "BATTER";
}

function cameraForRunnerDestination(
  destination: RunnerAdvance["toBase"],
): BaseballCameraMode {
  if (destination === 1) return "FIRST_BASE_LINE";
  if (destination === 3) return "THIRD_BASE_LINE";
  return "BASE_RUNNING";
}

/**
 * Selects one deterministic camera for the shared runner-advance event.
 * A contested out is always shown first. Scoring advances are deliberately
 * excluded here because the following RUN_SCORE event owns the home-plate cut.
 */
export function cameraForRunnerResolution(
  runners: RunnerResolution | null,
): BaseballCameraMode {
  if (!runners || runners.advances.length === 0) return "BASE_RUNNING";

  const contestedOut = runners.advances.find((advance) => advance.result === "OUT");
  if (contestedOut) return cameraForRunnerDestination(contestedOut.toBase);

  const nonScoringAdvances = runners.advances.filter(
    (advance) => advance.result !== "SCORE" && advance.result !== "HOLD",
  );
  if (nonScoringAdvances.some((advance) => advance.toBase === 1)) {
    return "FIRST_BASE_LINE";
  }
  if (nonScoringAdvances.some((advance) => advance.toBase === 3)) {
    return "THIRD_BASE_LINE";
  }
  return "BASE_RUNNING";
}
