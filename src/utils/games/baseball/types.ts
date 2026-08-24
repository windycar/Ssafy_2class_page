export const BASEBALL_GAME_STATE_VERSION = 2 as const;

export type BaseballGameStateVersion = typeof BASEBALL_GAME_STATE_VERSION;
export type TeamIndex = 0 | 1;
export type InningHalf = "top" | "bottom";
export type GameStatus = "playing" | "finished";
export type Handedness = "L" | "R";
export type BattingSide = Handedness | "S";

export interface Vec2 {
  x: number;
  y: number;
}

export type ContactPoint = Vec2;

export type BaseballPosition =
  | "P"
  | "C"
  | "1B"
  | "2B"
  | "3B"
  | "SS"
  | "LF"
  | "CF"
  | "RF"
  | "DH";

export type FieldingPosition = Exclude<BaseballPosition, "DH">;

export type BaseballPitchType =
  | "fourSeam"
  | "twoSeam"
  | "slider"
  | "curve"
  | "changeup"
  | "fork"
  | "cutter";

/**
 * The renderer historically calls a four-seam fastball `fastball`.
 * Keep this visual identifier separate from the canonical rules-engine pitch type.
 */
export type PitchVisualKind =
  | "fastball"
  | "twoSeam"
  | "slider"
  | "curve"
  | "changeup"
  | "fork"
  | "cutter";

export type PitchQuality = "PERFECT" | "GOOD" | "NORMAL" | "MISS";
export type SwingType = "CONTACT" | "NORMAL" | "POWER";
export type SwingTiming =
  | "VERY_EARLY"
  | "EARLY"
  | "GOOD"
  | "PERFECT"
  | "LATE"
  | "VERY_LATE";
export type ContactQuality = "NONE" | "WEAK" | "GOOD" | "PERFECT";

export interface PlayerPitch {
  type: BaseballPitchType;
  velocityKmh: readonly [minimum: number, maximum: number];
  control: number;
  movement: number;
  usage: number;
}

export interface PitchingAbility {
  velocity: number;
  control: number;
  movement: number;
  stamina: number;
  pitches: readonly PlayerPitch[];
}

export interface BaseballPlayer {
  id: string;
  name: string;
  number: number;
  position: BaseballPosition;
  bats: BattingSide;
  throws: Handedness;
  contact: number;
  power: number;
  eye: number;
  speed: number;
  fielding: number;
  arm: number;
  pitching?: PitchingAbility;
  portraitAssetId?: string;
}

export interface BaseballRosterDefinition {
  id: string;
  teamName: string;
  shortName: string;
  themeColor: string;
  accentColor: string;
  lineupPlayerIds: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  startingPitcherId: string;
}

export interface PitchDefinition {
  type: BaseballPitchType;
  visualKind: PitchVisualKind;
  name: string;
  shortName: string;
  description: string;
  velocityKmh: readonly [minimum: number, maximum: number];
  flightDurationMs: readonly [minimum: number, maximum: number];
  controlModifier: number;
  movementRating: number;
  spinRateRpm: readonly [minimum: number, maximum: number];
  /** Horizontal break in normalized strike-zone units. Positive values move arm-side. */
  breakX: number;
  /** Vertical break in normalized strike-zone units. Positive values drop. */
  breakY: number;
  /** 0 means immediate break; 1 means all movement is saved until the plate. */
  lateBreak: number;
  uiColor: string;
}

export interface PitchLocation {
  intended: ContactPoint;
  actual: ContactPoint;
}

export interface PitchFlightState {
  start: Vec2;
  control1: Vec2;
  control2: Vec2;
  target: Vec2;
  velocityKmh: number;
  spinRate: number;
  rotation: number;
  progress: number;
  breakX: number;
  breakY: number;
  pitchType: BaseballPitchType;
}

export interface ResolvedPitch {
  id: string;
  pitcherId: string;
  pitchType: BaseballPitchType;
  quality: PitchQuality;
  location: PitchLocation;
  velocityKmh: number;
  spinRate: number;
  movement: number;
  flightDurationMs: number;
  trajectory: PitchFlightState;
}

export interface SwingInput {
  batterId: string;
  swingType: SwingType;
  aim: ContactPoint;
  progress: number;
}

export interface ContactResolution {
  result: "MISS" | "FOUL" | "IN_PLAY";
  timing: SwingTiming;
  quality: ContactQuality;
  timingError: number;
  locationError: number;
  pciOverlap: number;
  batterId: string;
  pitcherId: string;
  swingType: SwingType;
  pitchType: BaseballPitchType;
}

export type BattedBallType = "GROUND" | "LINER" | "FLY" | "POPUP";
export type BattedBallZone =
  | "LF"
  | "LCF"
  | "CF"
  | "RCF"
  | "RF"
  | "3B"
  | "SS"
  | "2B"
  | "1B"
  | "FOUL_LEFT"
  | "FOUL_RIGHT";

export interface BattedBall {
  id: string;
  batterId: string;
  exitVelocity: number;
  launchAngle: number;
  horizontalAngle: number;
  spin: number;
  hangTime: number;
  distance: number;
  type: BattedBallType;
  zone: BattedBallZone;
  fair: boolean;
}

export type FieldingResult =
  | "CATCH"
  | "GROUND_OUT"
  | "FORCE_OUT"
  | "TAG_OUT"
  | "SAFE"
  | "ERROR"
  | "NO_PLAY";

export interface DefenseResolution {
  result: FieldingResult;
  primaryFielderId: string | null;
  primaryPosition: FieldingPosition | null;
  assistingFielderIds: string[];
  ballArrivalTimeMs: number;
  fielderArrivalTimeMs: number | null;
  throwArrivalTimeMs: number | null;
  fieldingProbability: number;
  errorProbability: number;
  outsRecorded: number;
}

export type BaseNumber = 1 | 2 | 3;
export type RunnerOrigin = 0 | BaseNumber;
export type RunnerDestination = BaseNumber | 4;

export interface BaseRunner {
  playerId: string;
  name: string;
  speed: number;
  currentBase: BaseNumber;
  targetBase?: RunnerDestination;
  progress?: number;
}

export interface BasesState {
  first: BaseRunner | null;
  second: BaseRunner | null;
  third: BaseRunner | null;
}

export type BaseballBases = BasesState;

export type RunnerAdvanceResult = "HOLD" | "SAFE" | "OUT" | "SCORE";

export interface RunnerAdvance {
  runnerId: string;
  runnerName: string;
  fromBase: RunnerOrigin;
  toBase: RunnerDestination;
  result: RunnerAdvanceResult;
  startedAtMs: number;
  arrivedAtMs: number;
  outAtMs?: number;
  isForce: boolean;
}

export interface RunnerResolution {
  advances: RunnerAdvance[];
  nextBases: BasesState;
  scoredRunnerIds: string[];
  outRunnerIds: string[];
  runsScored: number;
  outsRecorded: number;
}

export interface BaseballCount {
  balls: number;
  strikes: number;
  outs: number;
}

export interface BatterGameStats {
  pa: number;
  ab: number;
  h: number;
  doubles: number;
  triples: number;
  hr: number;
  rbi: number;
  r: number;
  bb: number;
  so: number;
}

export interface PitcherGameStats {
  outsRecorded: number;
  pitches: number;
  hitsAllowed: number;
  runsAllowed: number;
  earnedRuns: number;
  walks: number;
  strikeouts: number;
}

export interface PitcherState {
  playerId: string;
  pitchCount: number;
  stamina: number;
  confidence: number;
  velocityModifier: number;
  controlModifier: number;
  movementModifier: number;
}

export interface BaseballTeamState {
  id: string;
  name: string;
  shortName: string;
  themeColor: string;
  accentColor: string;
  rosterId: string;
  lineupPlayerIds: string[];
  currentBatterIndex: number;
  pitcher: PitcherState;
  runs: number;
  hits: number;
  errors: number;
  inningRuns: number[];
  batterStats: Record<string, BatterGameStats>;
  pitcherStats: Record<string, PitcherGameStats>;
}

export type BaseballPlayResultCode =
  | "BALL"
  | "CALLED_STRIKE"
  | "SWINGING_STRIKE"
  | "FOUL"
  | "WALK"
  | "STRIKEOUT_LOOKING"
  | "STRIKEOUT_SWINGING"
  | "GROUND_OUT_1B"
  | "GROUND_OUT_2B"
  | "GROUND_OUT_SS"
  | "GROUND_OUT_3B"
  | "FLY_OUT_LF"
  | "FLY_OUT_CF"
  | "FLY_OUT_RF"
  | "LINE_OUT"
  | "POP_OUT"
  | "SINGLE_LEFT"
  | "SINGLE_CENTER"
  | "SINGLE_RIGHT"
  | "INFIELD_SINGLE"
  | "DOUBLE_LEFT"
  | "DOUBLE_CENTER"
  | "DOUBLE_RIGHT"
  | "TRIPLE"
  | "HOME_RUN_LEFT"
  | "HOME_RUN_CENTER"
  | "HOME_RUN_RIGHT"
  | "DOUBLE_PLAY"
  | "FIELDER_CHOICE"
  | "SAC_FLY"
  | "ERROR";

export interface OfficialPlayResult {
  playId: string;
  code: BaseballPlayResultCode;
  batterId: string;
  pitcherId: string;
  outsRecorded: number;
  runsScored: number;
  hitValue: 0 | 1 | 2 | 3 | 4;
  rbi: number;
  scoredRunnerIds: string[];
  outRunnerIds: string[];
  fielderIds: string[];
  errorFielderId: string | null;
  plateAppearanceEnded: boolean;
}

export type BaseballCameraMode =
  | "BATTER"
  | "PITCHER"
  | "CONTACT"
  | "INFIELD"
  | "LEFT_FIELD"
  | "LEFT_CENTER"
  | "CENTER_FIELD"
  | "RIGHT_CENTER"
  | "RIGHT_FIELD"
  | "FOUL"
  | "BASE_RUNNING"
  | "HOME_RUN"
  | "RUN_SCORED"
  | "DUGOUT"
  | "REPLAY";

export type VisualEventKind =
  | "CONTACT"
  | "BALL_FLIGHT"
  | "FIELD_RESULT"
  | "RUNNER_ADVANCE"
  | "RUN_SCORE"
  | "SCOREBOARD_UPDATE"
  | "PLAY_RESULT"
  | "NEXT_BATTER";

export interface VisualEvent {
  id: string;
  playId: string;
  sequence: number;
  kind: VisualEventKind;
  camera: BaseballCameraMode;
  durationMs: number;
  skippable: boolean;
  payload: Record<string, unknown>;
}

export type ActivePlayPhase =
  | "AWAITING_PITCH"
  | "PITCH_RELEASED"
  | "AWAITING_BATTER"
  | "CONTACT"
  | "BALL_FLIGHT"
  | "DEFENSE"
  | "BASE_RUNNING"
  | "RESOLVED";

export interface ActivePlayState {
  playId: string;
  /** Retained so online retries cannot consume the same start command twice. */
  startCommandId?: string;
  sequence: number;
  seed: number;
  phase: ActivePlayPhase;
  batterId: string;
  pitcherId: string;
  pitch: ResolvedPitch | null;
  contact: ContactResolution | null;
  battedBall: BattedBall | null;
  defense: DefenseResolution | null;
  runners: RunnerResolution | null;
  visualEvents: VisualEvent[];
}

export interface PlayByPlayEntry {
  id: string;
  /** Start command paired with this resolved batter action. */
  startCommandId?: string;
  playId: string;
  inning: number;
  half: InningHalf;
  battingTeam: TeamIndex;
  batterId: string;
  result: BaseballPlayResultCode;
  message: string;
  runsScored: number;
  createdAt: string;
}

export interface BaseballGameState {
  version: BaseballGameStateVersion;
  revision: number;
  seed: number;
  inning: number;
  half: InningHalf;
  battingTeam: TeamIndex;
  count: BaseballCount;
  bases: BasesState;
  teams: [BaseballTeamState, BaseballTeamState];
  status: GameStatus;
  winner: TeamIndex | null;
  activePlay: ActivePlayState | null;
  lastPlay: OfficialPlayResult | null;
  playByPlay: PlayByPlayEntry[];
}

export type TeamScore = BaseballTeamState;

/** Legacy result names retained while BaseballGameView migrates to BaseballPlayResultCode. */
export type PlateOutcome =
  | "ball"
  | "calledStrike"
  | "swingingStrike"
  | "foul"
  | "out"
  | "single"
  | "double"
  | "triple"
  | "homeRun";

export interface ContactResult {
  outcome: PlateOutcome;
  label: string;
  detail: string;
}

export interface GameTransition {
  state: BaseballGameState;
  message: string;
  runsScored: number;
  scoredRunners: BaseRunner[];
  batterId: string | null;
  plateEnded: boolean;
  halfEnded: boolean;
  gameEnded: boolean;
}
