import { getBaseballPlayer } from "../../../data/games/baseball/players.ts";
import type {
  BaseballGameState,
  OfficialPlayResult,
  TeamIndex,
  VisualEventKind,
} from "./types.ts";

export type BaseballScoringMomentV2 =
  | "STANDARD"
  | "TYING"
  | "GO_AHEAD"
  | "LEAD_CHANGE"
  | "WALK_OFF";

export interface BaseballScoringPresentationV2 {
  playId: string;
  battingTeam: TeamIndex;
  battingTeamName: string;
  battingTeamShortName: string;
  runsScored: number;
  scoreBefore: readonly [number, number];
  scoreAfter: readonly [number, number];
  scorerNames: readonly string[];
  batterName: string;
  rbi: number;
  isHomeRun: boolean;
  scoringLabel: string;
  moment: BaseballScoringMomentV2;
  momentLabel: string | null;
}

const HOME_RUN_CINEMATIC_SKIP_PHASES = new Set<VisualEventKind>([
  "CONTACT",
  "BALL_FLIGHT",
  "RUNNER_ADVANCE",
]);

export function isBaseballHomeRunCinematicSkippablePhaseV2(
  kind: VisualEventKind | null | undefined,
) {
  return kind ? HOME_RUN_CINEMATIC_SKIP_PHASES.has(kind) : false;
}

function isHomeRunResult(official: OfficialPlayResult) {
  return official.code === "HOME_RUN_LEFT"
    || official.code === "HOME_RUN_CENTER"
    || official.code === "HOME_RUN_RIGHT";
}

function battingTeamForPlay(
  game: BaseballGameState,
  official: OfficialPlayResult,
): TeamIndex {
  const log = [...game.playByPlay]
    .reverse()
    .find((entry) => entry.playId === official.playId);
  if (log) return log.battingTeam;
  return game.teams[0].lineupPlayerIds.includes(official.batterId) ? 0 : 1;
}

function scorerName(game: BaseballGameState, playerId: string) {
  const advance = game.activePlay?.runners?.advances
    .find((item) => item.runnerId === playerId);
  return advance?.runnerName ?? getBaseballPlayer(playerId)?.name ?? playerId;
}

export function baseballHomeRunScoringLabel(runsScored: number) {
  if (runsScored >= 4) return "GRAND SLAM";
  if (runsScored === 3) return "3-RUN HOME RUN";
  if (runsScored === 2) return "2-RUN HOME RUN";
  return "SOLO HOME RUN";
}

export function baseballRunScoringLabel(runsScored: number) {
  return runsScored > 1 ? `${runsScored} RUNS SCORE` : "RUN SCORED";
}

/** Builds deterministic scoring copy from the authoritative post-play state. */
export function createBaseballScoringPresentationV2(
  game: BaseballGameState,
  official: OfficialPlayResult,
): BaseballScoringPresentationV2 | null {
  if (official.runsScored <= 0) return null;
  const battingTeam = battingTeamForPlay(game, official);
  const opponent = battingTeam === 0 ? 1 : 0;
  const scoreAfter: [number, number] = [game.teams[0].runs, game.teams[1].runs];
  const scoreBefore: [number, number] = [...scoreAfter];
  scoreBefore[battingTeam] = Math.max(0, scoreBefore[battingTeam] - official.runsScored);
  const battingBefore = scoreBefore[battingTeam];
  const opponentBefore = scoreBefore[opponent];
  const battingAfter = scoreAfter[battingTeam];
  const opponentAfter = scoreAfter[opponent];
  const walkOff = game.status === "finished"
    && game.winner === battingTeam
    && game.half === "bottom";
  const leadChange = battingBefore < opponentBefore && battingAfter > opponentAfter;
  const tying = battingBefore < opponentBefore && battingAfter === opponentAfter;
  const goAhead = battingBefore === opponentBefore && battingAfter > opponentAfter;
  const moment: BaseballScoringMomentV2 = walkOff
    ? "WALK_OFF"
    : leadChange
      ? "LEAD_CHANGE"
      : tying
        ? "TYING"
        : goAhead
          ? "GO_AHEAD"
          : "STANDARD";
  const momentLabel = moment === "WALK_OFF"
    ? "WALK-OFF!"
    : moment === "LEAD_CHANGE"
      ? "LEAD CHANGE!"
      : moment === "TYING"
        ? "TIE GAME!"
        : moment === "GO_AHEAD"
          ? "GO-AHEAD RUN!"
          : null;
  const isHomeRun = isHomeRunResult(official);

  return {
    playId: official.playId,
    battingTeam,
    battingTeamName: game.teams[battingTeam].name,
    battingTeamShortName: game.teams[battingTeam].shortName,
    runsScored: official.runsScored,
    scoreBefore,
    scoreAfter,
    scorerNames: official.scoredRunnerIds.map((playerId) => scorerName(game, playerId)),
    batterName: getBaseballPlayer(official.batterId)?.name ?? official.batterId,
    rbi: official.rbi,
    isHomeRun,
    scoringLabel: isHomeRun
      ? baseballHomeRunScoringLabel(official.runsScored)
      : baseballRunScoringLabel(official.runsScored),
    moment,
    momentLabel,
  };
}
