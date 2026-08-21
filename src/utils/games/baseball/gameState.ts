import { BASEBALL_PLAYER_BY_ID, getBaseballPlayer } from "../../../data/games/baseball/players.ts";
import {
  DEFAULT_BASEBALL_ROSTERS,
  getBaseballRoster,
} from "../../../data/games/baseball/rosters.ts";
import {
  BASEBALL_GAME_STATE_VERSION,
  type BaseNumber,
  type BaseRunner,
  type BaseballCount,
  type BaseballGameState,
  type BaseballPlayer,
  type BaseballRosterDefinition,
  type BaseballTeamState,
  type BasesState,
  type BatterGameStats,
  type PitcherGameStats,
  type TeamIndex,
} from "./types.ts";

export const EMPTY_COUNT: BaseballCount = { balls: 0, strikes: 0, outs: 0 };
export const EMPTY_BASES: BasesState = { first: null, second: null, third: null };

export function createEmptyBatterStats(): BatterGameStats {
  return { pa: 0, ab: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0 };
}

export function createEmptyPitcherStats(): PitcherGameStats {
  return {
    outsRecorded: 0,
    pitches: 0,
    hitsAllowed: 0,
    runsAllowed: 0,
    earnedRuns: 0,
    walks: 0,
    strikeouts: 0,
  };
}

function stableSeed(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createTeamState(
  roster: BaseballRosterDefinition,
  displayName: string,
  startsBatting: boolean,
): BaseballTeamState {
  const pitcher = getBaseballPlayer(roster.startingPitcherId);
  if (!pitcher?.pitching) throw new Error(`선발투수 데이터가 없습니다: ${roster.startingPitcherId}`);

  const batterStats = Object.fromEntries(
    roster.lineupPlayerIds.map((playerId) => [playerId, createEmptyBatterStats()]),
  );
  const pitcherStats = {
    [roster.startingPitcherId]: createEmptyPitcherStats(),
  };

  return {
    id: roster.id,
    name: displayName,
    shortName: roster.shortName,
    themeColor: roster.themeColor,
    accentColor: roster.accentColor,
    rosterId: roster.id,
    lineupPlayerIds: [...roster.lineupPlayerIds],
    currentBatterIndex: 0,
    pitcher: {
      playerId: pitcher.id,
      pitchCount: 0,
      stamina: pitcher.pitching.stamina,
      confidence: 72,
      velocityModifier: 0,
      controlModifier: 0,
      movementModifier: 0,
    },
    runs: 0,
    hits: 0,
    errors: 0,
    inningRuns: startsBatting ? [0] : [],
    batterStats,
    pitcherStats,
  };
}

export function createGameState(
  visitorName = "1P",
  homeName = "2P",
  seed = stableSeed(`${visitorName}:${homeName}:baseball-v2`),
): BaseballGameState {
  return {
    version: BASEBALL_GAME_STATE_VERSION,
    revision: 0,
    seed: seed >>> 0,
    inning: 1,
    half: "top",
    battingTeam: 0,
    count: { ...EMPTY_COUNT },
    bases: { ...EMPTY_BASES },
    teams: [
      createTeamState(DEFAULT_BASEBALL_ROSTERS[0], visitorName, true),
      createTeamState(DEFAULT_BASEBALL_ROSTERS[1], homeName, false),
    ],
    status: "playing",
    winner: null,
    activePlay: null,
    lastPlay: null,
    playByPlay: [],
  };
}

export function cloneBases(bases: BasesState): BasesState {
  return {
    first: bases.first ? { ...bases.first } : null,
    second: bases.second ? { ...bases.second } : null,
    third: bases.third ? { ...bases.third } : null,
  };
}

function cloneBatterStats(stats: Record<string, BatterGameStats>) {
  return Object.fromEntries(Object.entries(stats).map(([playerId, value]) => [playerId, { ...value }]));
}

function clonePitcherStats(stats: Record<string, PitcherGameStats>) {
  return Object.fromEntries(Object.entries(stats).map(([playerId, value]) => [playerId, { ...value }]));
}

function cloneTeam(team: BaseballTeamState): BaseballTeamState {
  return {
    ...team,
    lineupPlayerIds: [...team.lineupPlayerIds],
    pitcher: { ...team.pitcher },
    inningRuns: [...team.inningRuns],
    batterStats: cloneBatterStats(team.batterStats),
    pitcherStats: clonePitcherStats(team.pitcherStats),
  };
}

export function cloneGameState(state: BaseballGameState): BaseballGameState {
  return {
    ...state,
    count: { ...state.count },
    bases: cloneBases(state.bases),
    teams: [cloneTeam(state.teams[0]), cloneTeam(state.teams[1])],
    activePlay: state.activePlay ? structuredClone(state.activePlay) : null,
    lastPlay: state.lastPlay ? structuredClone(state.lastPlay) : null,
    playByPlay: state.playByPlay.map((entry) => ({ ...entry })),
  };
}

export function getBattingTeam(state: BaseballGameState) {
  return state.teams[state.battingTeam];
}

export function getFieldingTeam(state: BaseballGameState) {
  return state.teams[state.battingTeam === 0 ? 1 : 0];
}

export function getCurrentBatter(state: BaseballGameState): BaseballPlayer {
  const team = getBattingTeam(state);
  const playerId = team.lineupPlayerIds[team.currentBatterIndex % team.lineupPlayerIds.length];
  const player = BASEBALL_PLAYER_BY_ID[playerId];
  if (!player) throw new Error(`현재 타자를 찾을 수 없습니다: ${playerId}`);
  return player;
}

export function getNextBatters(state: BaseballGameState, amount = 2): BaseballPlayer[] {
  const team = getBattingTeam(state);
  return Array.from({ length: Math.max(0, amount) }, (_, offset) => {
    const index = (team.currentBatterIndex + offset + 1) % team.lineupPlayerIds.length;
    const playerId = team.lineupPlayerIds[index];
    const player = BASEBALL_PLAYER_BY_ID[playerId];
    if (!player) throw new Error(`다음 타자를 찾을 수 없습니다: ${playerId}`);
    return player;
  });
}

export function getCurrentPitcher(state: BaseballGameState): BaseballPlayer {
  const playerId = getFieldingTeam(state).pitcher.playerId;
  const player = BASEBALL_PLAYER_BY_ID[playerId];
  if (!player?.pitching) throw new Error(`현재 투수를 찾을 수 없습니다: ${playerId}`);
  return player;
}

export function createRunner(player: BaseballPlayer, currentBase: BaseNumber): BaseRunner {
  return {
    playerId: player.id,
    name: player.name,
    speed: player.speed,
    currentBase,
  };
}

export function advanceBattingOrder(state: BaseballGameState, teamIndex: TeamIndex = state.battingTeam) {
  const team = state.teams[teamIndex];
  team.currentBatterIndex = (team.currentBatterIndex + 1) % team.lineupPlayerIds.length;
}

export function getRosterForTeam(state: BaseballGameState, teamIndex: TeamIndex) {
  const roster = getBaseballRoster(state.teams[teamIndex].rosterId);
  if (!roster) throw new Error(`로스터를 찾을 수 없습니다: ${state.teams[teamIndex].rosterId}`);
  return roster;
}
