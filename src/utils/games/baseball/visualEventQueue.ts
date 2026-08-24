import {
  cameraForBattedBall,
  cameraForOfficialResult,
  cameraForRunnerResolution,
} from "./cameraDirector.ts";
import type {
  BaseballCameraMode,
  BattedBall,
  ContactResolution,
  DefenseResolution,
  OfficialPlayResult,
  RunnerResolution,
  VisualEvent,
  VisualEventKind,
} from "./types.ts";

export interface BuildPlayVisualEventsInput {
  playId: string;
  official: OfficialPlayResult;
  contact: ContactResolution | null;
  ball: BattedBall | null;
  defense: DefenseResolution | null;
  runners: RunnerResolution | null;
  gameEnded?: boolean;
  sideChanged?: boolean;
}

interface EventDraft {
  kind: VisualEventKind;
  camera: BaseballCameraMode;
  durationMs: number;
  payload: Record<string, unknown>;
}

export const VISUAL_EVENT_SKIPPABLE_POLICY: Readonly<
  Record<VisualEventKind, boolean>
> = {
  CONTACT: false,
  BALL_FLIGHT: true,
  FIELD_RESULT: true,
  RUNNER_ADVANCE: true,
  RUN_SCORE: false,
  SCOREBOARD_UPDATE: false,
  PLAY_RESULT: false,
  NEXT_BATTER: true,
};

function isHomeRun(official: OfficialPlayResult) {
  return official.code === "HOME_RUN_LEFT"
    || official.code === "HOME_RUN_CENTER"
    || official.code === "HOME_RUN_RIGHT";
}

function isSimplePitchResult(official: OfficialPlayResult) {
  return official.code === "BALL"
    || official.code === "CALLED_STRIKE"
    || official.code === "SWINGING_STRIKE"
    || official.code === "FOUL";
}

function jsonCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function clampDuration(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.round(Math.min(maximum, Math.max(minimum, value)));
}

function ballFlightDuration(ball: BattedBall, homeRun: boolean) {
  const minimum = homeRun ? 2_400 : 850;
  const maximum = homeRun ? 4_800 : 3_800;
  return clampDuration(ball.hangTime, minimum, maximum);
}

function runnerAdvanceDuration(runners: RunnerResolution | null) {
  if (!runners || runners.advances.length === 0) return 1_250;
  const latestArrival = runners.advances.reduce(
    (latest, advance) => Math.max(latest, advance.arrivedAtMs),
    0,
  );
  return clampDuration(latestArrival, 900, 2_800);
}

function createEvent(
  playId: string,
  sequence: number,
  draft: EventDraft,
): VisualEvent {
  return {
    id: `${playId}:visual:${String(sequence).padStart(2, "0")}:${draft.kind.toLowerCase()}`,
    playId,
    sequence,
    kind: draft.kind,
    camera: draft.camera,
    durationMs: draft.durationMs,
    skippable: VISUAL_EVENT_SKIPPABLE_POLICY[draft.kind],
    payload: jsonCopy(draft.payload),
  };
}

/**
 * Converts one canonical play result into a deterministic presentation queue.
 * This function intentionally contains no timers or mutable queue state; the UI
 * owns playback and may safely rebuild the same queue after reconnecting.
 */
export function buildPlayVisualEvents(
  input: BuildPlayVisualEventsInput,
): VisualEvent[] {
  const { playId, official, contact, ball, defense, runners } = input;
  const homeRun = isHomeRun(official);
  const simplePitchResult = isSimplePitchResult(official);
  const inPlay = ball !== null && (!simplePitchResult || official.code === "FOUL");
  const drafts: EventDraft[] = [];

  if (inPlay) {
    const fieldCamera = homeRun ? "HOME_RUN" : cameraForBattedBall(ball);

    drafts.push({
      kind: "CONTACT",
      camera: "CONTACT",
      durationMs: 420,
      payload: {
        contact: contact ? jsonCopy(contact) : null,
        batterId: official.batterId,
        pitcherId: official.pitcherId,
      },
    });
    drafts.push({
      kind: "BALL_FLIGHT",
      camera: fieldCamera,
      durationMs: ballFlightDuration(ball, homeRun),
      payload: {
        ball: jsonCopy(ball),
        homeRun,
      },
    });

    if (!homeRun && ball.fair) {
      drafts.push({
        kind: "FIELD_RESULT",
        camera: fieldCamera,
        durationMs: 900,
        payload: {
          defense: defense ? jsonCopy(defense) : null,
          resultCode: official.code,
        },
      });
    }

  }

  if (homeRun || (runners !== null && runners.advances.length > 0)) {
    drafts.push({
      kind: "RUNNER_ADVANCE",
      camera: cameraForRunnerResolution(runners),
      durationMs: runnerAdvanceDuration(runners),
      payload: {
        runners: runners ? jsonCopy(runners) : null,
        homeRun,
      },
    });
  }

  if (official.runsScored > 0) {
    drafts.push({
      kind: "RUN_SCORE",
      camera: "RUN_SCORED",
      durationMs: homeRun ? 1_600 : 1_200,
      payload: {
        runsScored: official.runsScored,
        scoredRunnerIds: [...official.scoredRunnerIds],
      },
    });
  }

  if (
    official.runsScored > 0
    || official.outsRecorded > 0
    || official.plateAppearanceEnded
  ) {
    drafts.push({
      kind: "SCOREBOARD_UPDATE",
      camera: official.runsScored > 0 ? "RUN_SCORED" : "DUGOUT",
      durationMs: 700,
      payload: {
        runsScored: official.runsScored,
        outsRecorded: official.outsRecorded,
        plateAppearanceEnded: official.plateAppearanceEnded,
      },
    });
  }

  drafts.push({
    kind: "PLAY_RESULT",
    camera: cameraForOfficialResult(official, inPlay ? ball : null),
    durationMs: homeRun ? 1_800 : official.plateAppearanceEnded ? 1_200 : 750,
    payload: {
      official: jsonCopy(official),
    },
  });

  if (official.plateAppearanceEnded && !input.gameEnded && !input.sideChanged) {
    drafts.push({
      kind: "NEXT_BATTER",
      camera: "BATTER",
      durationMs: 650,
      payload: {
        previousBatterId: official.batterId,
        resultCode: official.code,
      },
    });
  }

  return drafts.map((draft, sequence) => createEvent(playId, sequence, draft));
}
