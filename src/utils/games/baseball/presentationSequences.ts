import { getBaseballPlayer } from "../../../data/games/baseball/players.ts";
import { getCurrentBatter, getCurrentPitcher } from "./gameState.ts";
import type {
  BaseballGameState,
  BaseballPlayer,
  BatterGameStats,
  TeamIndex,
} from "./types.ts";

export const BASEBALL_GAME_INTRO_DURATION_MS = 3_000;
export const BASEBALL_PLAYER_INTRO_DURATION_MS = 850;
export const BASEBALL_HALF_INNING_DURATION_MS = 2_400;

export type BaseballGameIntroPhaseV2 =
  | "MATCH_INTRO"
  | "STADIUM"
  | "MATCHUP"
  | "STARTERS"
  | "LINEUP"
  | "PLAY_BALL"
  | "FIRST_BATTER";

export type BaseballHalfInningPhaseV2 =
  | "THREE_OUT"
  | "INNING_COMPLETE"
  | "LINE_SCORE"
  | "WIDE_SHOT"
  | "NEXT_ATTACK";

export interface BaseballPlayerIntroModelV2 {
  teamIndex: TeamIndex;
  teamName: string;
  teamShortName: string;
  player: BaseballPlayer;
  today: string;
  stats: BatterGameStats;
}

export interface BaseballGameIntroModelV2 {
  matchup: string;
  teams: readonly [string, string];
  starters: readonly [BaseballPlayer, BaseballPlayer];
  lineups: readonly [readonly BaseballPlayer[], readonly BaseballPlayer[]];
  lineupNames: readonly [readonly string[], readonly string[]];
  firstBatter: BaseballPlayer;
}

export interface BaseballHalfInningModelV2 {
  completedInning: number;
  completedHalf: "top" | "bottom";
  completedBattingTeam: TeamIndex;
  nextBattingTeam: TeamIndex;
  nextBattingTeamName: string;
  nextBattingTeamShortName: string;
  score: readonly [number, number];
  inningCount: number;
  inningRuns: readonly [readonly number[], readonly number[]];
}

function clampProgress(progress: number) {
  return Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
}

export function baseballGameIntroPhaseV2(progress: number): BaseballGameIntroPhaseV2 {
  const value = clampProgress(progress);
  if (value < 0.14) return "MATCH_INTRO";
  if (value < 0.30) return "STADIUM";
  if (value < 0.44) return "MATCHUP";
  if (value < 0.58) return "STARTERS";
  if (value < 0.76) return "LINEUP";
  if (value < 0.90) return "PLAY_BALL";
  return "FIRST_BATTER";
}

export function baseballHalfInningPhaseV2(progress: number): BaseballHalfInningPhaseV2 {
  const value = clampProgress(progress);
  if (value < 0.20) return "THREE_OUT";
  if (value < 0.40) return "INNING_COMPLETE";
  if (value < 0.70) return "LINE_SCORE";
  if (value < 0.88) return "WIDE_SHOT";
  return "NEXT_ATTACK";
}

export function createBaseballGameIntroModelV2(
  game: BaseballGameState,
): BaseballGameIntroModelV2 {
  const starters = game.teams.map((team) => (
    getBaseballPlayer(team.pitcher.playerId) ?? getCurrentPitcher(game)
  )) as unknown as [BaseballPlayer, BaseballPlayer];
  const lineupNames = game.teams.map((team) => team.lineupPlayerIds.map((playerId) => (
    getBaseballPlayer(playerId)?.name ?? playerId
  ))) as unknown as [string[], string[]];
  const lineups = game.teams.map((team) => team.lineupPlayerIds.flatMap((playerId) => {
    const player = getBaseballPlayer(playerId);
    return player ? [player] : [];
  })) as unknown as [BaseballPlayer[], BaseballPlayer[]];

  return {
    matchup: `${game.teams[0].shortName} VS ${game.teams[1].shortName}`,
    teams: [game.teams[0].name, game.teams[1].name],
    starters,
    lineups,
    lineupNames,
    firstBatter: getCurrentBatter(game),
  };
}

export function createBaseballPlayerIntroModelV2(
  game: BaseballGameState,
): BaseballPlayerIntroModelV2 {
  const teamIndex = game.battingTeam;
  const player = getCurrentBatter(game);
  const stats = game.teams[teamIndex].batterStats[player.id] ?? {
    pa: 0,
    ab: 0,
    h: 0,
    doubles: 0,
    triples: 0,
    hr: 0,
    rbi: 0,
    r: 0,
    bb: 0,
    so: 0,
  };
  const today = stats.pa === 0
    ? "FIRST AT-BAT"
    : `${stats.h} FOR ${stats.ab}${stats.hr > 0 ? ` · ${stats.hr} HR` : ""}${stats.rbi > 0 ? ` · ${stats.rbi} RBI` : ""}`;

  return {
    teamIndex,
    teamName: game.teams[teamIndex].name,
    teamShortName: game.teams[teamIndex].shortName,
    player,
    today,
    stats,
  };
}

export function createBaseballHalfInningModelV2(
  game: BaseballGameState,
): BaseballHalfInningModelV2 {
  const lastEntry = game.playByPlay[game.playByPlay.length - 1];
  const completedHalf = lastEntry?.half ?? (game.half === "top" ? "bottom" : "top");
  const completedInning = lastEntry?.inning
    ?? (game.half === "top" ? Math.max(1, game.inning - 1) : game.inning);
  const completedBattingTeam = lastEntry?.battingTeam ?? (game.battingTeam === 0 ? 1 : 0);
  const inningCount = Math.max(
    3,
    game.inning,
    game.teams[0].inningRuns.length,
    game.teams[1].inningRuns.length,
  );

  return {
    completedInning,
    completedHalf,
    completedBattingTeam,
    nextBattingTeam: game.battingTeam,
    nextBattingTeamName: game.teams[game.battingTeam].name,
    nextBattingTeamShortName: game.teams[game.battingTeam].shortName,
    score: [game.teams[0].runs, game.teams[1].runs],
    inningCount,
    inningRuns: [
      [...game.teams[0].inningRuns],
      [...game.teams[1].inningRuns],
    ],
  };
}
