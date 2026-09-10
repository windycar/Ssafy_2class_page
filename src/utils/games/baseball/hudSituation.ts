import { REGULATION_INNINGS } from "./inningEngine.ts";
import type { BaseballGameState } from "./types.ts";

export type BaseballSituationBadgeIdV2 =
  | "SCORING_POSITION"
  | "BASES_LOADED"
  | "CLUTCH"
  | "TWO_OUT_RISP"
  | "FULL_COUNT"
  | "TWO_OUT"
  | "FINAL_INNING"
  | "TIE_GAME"
  | "GO_AHEAD_RUN"
  | "WALK_OFF_CHANCE";

export type BaseballSituationBadgeToneV2 = "info" | "warning" | "critical";

export interface BaseballSituationBadgeV2 {
  id: BaseballSituationBadgeIdV2;
  label: string;
  tone: BaseballSituationBadgeToneV2;
  priority: number;
}

export interface BaseballHudSituationV2 {
  isScoringPosition: boolean;
  isBasesLoaded: boolean;
  hasTwoOuts: boolean;
  isFullCount: boolean;
  isFinalInning: boolean;
  isTieGame: boolean;
  isClutch: boolean;
  hasGoAheadRunner: boolean;
  isWalkOffChance: boolean;
  tension: "normal" | "elevated" | "critical";
  badges: readonly BaseballSituationBadgeV2[];
  visibleBadges: readonly BaseballSituationBadgeV2[];
}

const MAX_VISIBLE_BADGES = 3;

const BADGES: Readonly<Record<BaseballSituationBadgeIdV2, BaseballSituationBadgeV2>> = {
  SCORING_POSITION: {
    id: "SCORING_POSITION",
    label: "SCORING POSITION",
    tone: "info",
    priority: 76,
  },
  BASES_LOADED: {
    id: "BASES_LOADED",
    label: "BASES LOADED",
    tone: "warning",
    priority: 88,
  },
  CLUTCH: {
    id: "CLUTCH",
    label: "CLUTCH",
    tone: "warning",
    priority: 74,
  },
  TWO_OUT_RISP: {
    id: "TWO_OUT_RISP",
    label: "TWO OUT RISP",
    tone: "critical",
    priority: 94,
  },
  FULL_COUNT: {
    id: "FULL_COUNT",
    label: "FULL COUNT",
    tone: "critical",
    priority: 82,
  },
  TWO_OUT: {
    id: "TWO_OUT",
    label: "TWO OUT",
    tone: "warning",
    priority: 54,
  },
  FINAL_INNING: {
    id: "FINAL_INNING",
    label: "FINAL INNING",
    tone: "warning",
    priority: 58,
  },
  TIE_GAME: {
    id: "TIE_GAME",
    label: "TIE GAME",
    tone: "warning",
    priority: 62,
  },
  GO_AHEAD_RUN: {
    id: "GO_AHEAD_RUN",
    label: "GO-AHEAD RUN",
    tone: "critical",
    priority: 72,
  },
  WALK_OFF_CHANCE: {
    id: "WALK_OFF_CHANCE",
    label: "WALK-OFF CHANCE",
    tone: "critical",
    priority: 100,
  },
};

function occupiedBaseCount(game: BaseballGameState) {
  return Number(Boolean(game.bases.first))
    + Number(Boolean(game.bases.second))
    + Number(Boolean(game.bases.third));
}

/**
 * Derives every HUD tension signal from the canonical rules state only.
 * Renderers may safely cap `visibleBadges` without losing the complete `badges` result.
 */
export function selectBaseballHudSituationV2(
  game: BaseballGameState,
): BaseballHudSituationV2 {
  const battingRuns = game.teams[game.battingTeam].runs;
  const fieldingRuns = game.teams[game.battingTeam === 0 ? 1 : 0].runs;
  const occupiedBases = occupiedBaseCount(game);
  const isPlaying = game.status === "playing";
  const isScoringPosition = isPlaying && Boolean(game.bases.second || game.bases.third);
  const isBasesLoaded = isPlaying && occupiedBases === 3;
  const hasTwoOuts = isPlaying && game.count.outs === 2;
  const isFullCount = isPlaying && game.count.balls === 3 && game.count.strikes === 2;
  const isFinalInning = isPlaying && game.inning >= REGULATION_INNINGS;
  const isTieGame = isFinalInning && battingRuns === fieldingRuns;
  const isClutch = isFinalInning && Math.abs(battingRuns - fieldingRuns) === 1;
  const runsNeededToLead = fieldingRuns - battingRuns + 1;
  const hasGoAheadRunner = isPlaying
    && battingRuns < fieldingRuns
    && occupiedBases > 0
    && runsNeededToLead <= occupiedBases;
  const isWalkOffChance = isPlaying
    && game.half === "bottom"
    && game.battingTeam === 1
    && game.inning >= REGULATION_INNINGS
    && battingRuns <= fieldingRuns
    && runsNeededToLead > 0
    && runsNeededToLead <= occupiedBases + 1;

  const badges: BaseballSituationBadgeV2[] = [];
  if (isWalkOffChance) badges.push(BADGES.WALK_OFF_CHANCE);
  if (hasTwoOuts && isScoringPosition) badges.push(BADGES.TWO_OUT_RISP);
  if (isBasesLoaded) badges.push(BADGES.BASES_LOADED);
  if (isFullCount) badges.push(BADGES.FULL_COUNT);
  if (isScoringPosition && !hasTwoOuts && !isBasesLoaded) {
    badges.push(BADGES.SCORING_POSITION);
  }
  if (isClutch) badges.push(BADGES.CLUTCH);
  if (hasGoAheadRunner) badges.push(BADGES.GO_AHEAD_RUN);
  if (isTieGame) badges.push(BADGES.TIE_GAME);
  if (isFinalInning) badges.push(BADGES.FINAL_INNING);
  if (hasTwoOuts && !isScoringPosition) badges.push(BADGES.TWO_OUT);
  badges.sort((left, right) => right.priority - left.priority);

  const critical = isWalkOffChance || (hasTwoOuts && isScoringPosition) || isFullCount;
  const elevated = critical
    || isScoringPosition
    || hasTwoOuts
    || isFinalInning
    || isClutch
    || hasGoAheadRunner;

  return {
    isScoringPosition,
    isBasesLoaded,
    hasTwoOuts,
    isFullCount,
    isFinalInning,
    isTieGame,
    isClutch,
    hasGoAheadRunner,
    isWalkOffChance,
    tension: critical ? "critical" : elevated ? "elevated" : "normal",
    badges,
    visibleBadges: badges.slice(0, MAX_VISIBLE_BADGES),
  };
}
