import { getBaseballPlayer } from "../../../data/games/baseball/players.ts";
import type {
  BaseballGameState,
  BaseballPlayResultCode,
  BatterGameStats,
  GameStatus,
  InningHalf,
  PitcherGameStats,
  TeamIndex,
} from "./types.ts";

const MINIMUM_INNINGS = 3;
const MINIMUM_HIGHLIGHTS = 2;
const MAXIMUM_HIGHLIGHTS = 3;

const RESULT_LABELS: Readonly<Record<BaseballPlayResultCode, string>> = {
  BALL: "볼",
  CALLED_STRIKE: "스트라이크",
  SWINGING_STRIKE: "헛스윙 스트라이크",
  FOUL: "파울",
  WALK: "볼넷",
  STRIKEOUT_LOOKING: "루킹 삼진",
  STRIKEOUT_SWINGING: "헛스윙 삼진",
  GROUND_OUT_1B: "1루수 땅볼 아웃",
  GROUND_OUT_2B: "2루수 땅볼 아웃",
  GROUND_OUT_SS: "유격수 땅볼 아웃",
  GROUND_OUT_3B: "3루수 땅볼 아웃",
  FLY_OUT_LF: "좌익수 플라이 아웃",
  FLY_OUT_CF: "중견수 플라이 아웃",
  FLY_OUT_RF: "우익수 플라이 아웃",
  LINE_OUT: "직선타 아웃",
  POP_OUT: "뜬공 아웃",
  SINGLE_LEFT: "좌전 안타",
  SINGLE_CENTER: "중전 안타",
  SINGLE_RIGHT: "우전 안타",
  INFIELD_SINGLE: "내야 안타",
  DOUBLE_LEFT: "좌중간 2루타",
  DOUBLE_CENTER: "중앙 2루타",
  DOUBLE_RIGHT: "우중간 2루타",
  TRIPLE: "3루타",
  HOME_RUN_LEFT: "좌월 홈런",
  HOME_RUN_CENTER: "중월 홈런",
  HOME_RUN_RIGHT: "우월 홈런",
  DOUBLE_PLAY: "병살타",
  FIELDER_CHOICE: "야수 선택",
  SAC_FLY: "희생 플라이",
  ERROR: "수비 실책",
};

const HOME_RUN_RESULTS = new Set<BaseballPlayResultCode>([
  "HOME_RUN_LEFT",
  "HOME_RUN_CENTER",
  "HOME_RUN_RIGHT",
]);

const DOUBLE_RESULTS = new Set<BaseballPlayResultCode>([
  "DOUBLE_LEFT",
  "DOUBLE_CENTER",
  "DOUBLE_RIGHT",
]);

const HIT_RESULTS = new Set<BaseballPlayResultCode>([
  "SINGLE_LEFT",
  "SINGLE_CENTER",
  "SINGLE_RIGHT",
  "INFIELD_SINGLE",
  ...DOUBLE_RESULTS,
  "TRIPLE",
  ...HOME_RUN_RESULTS,
]);

const STRIKEOUT_RESULTS = new Set<BaseballPlayResultCode>([
  "STRIKEOUT_LOOKING",
  "STRIKEOUT_SWINGING",
]);

export interface BaseballFinalLineScoreRow {
  teamId: string;
  teamName: string;
  shortName: string;
  themeColor: string;
  accentColor: string;
  innings: Array<number | null>;
  runs: number;
  hits: number;
  errors: number;
  isWinner: boolean;
}

export interface BaseballFinalLineScore {
  innings: number[];
  rows: [BaseballFinalLineScoreRow, BaseballFinalLineScoreRow];
}

export type BaseballFinalMvpRole = "BATTER" | "PITCHER";

export interface BaseballFinalMvp {
  playerId: string;
  name: string;
  number: number;
  position: string;
  portraitAssetId?: string;
  teamIndex: TeamIndex;
  teamId: string;
  teamShortName: string;
  themeColor: string;
  accentColor: string;
  role: BaseballFinalMvpRole;
  impactScore: number;
  primaryStatLine: string;
  secondaryStatLine: string;
}

export interface BaseballFinalHighlight {
  id: string;
  inning: number | null;
  half: InningHalf | null;
  inningLabel: string;
  teamIndex: TeamIndex | null;
  teamShortName: string;
  title: string;
  detail: string;
}

export interface BaseballFinalResult {
  lineScore: BaseballFinalLineScore;
  mvp: BaseballFinalMvp;
  highlights: BaseballFinalHighlight[];
}

interface MvpCandidate extends BaseballFinalMvp {
  teamPreference: number;
  rolePreference: number;
  rosterOrder: number;
}

interface HighlightCandidate extends BaseballFinalHighlight {
  priority: number;
  playIndex: number;
}

function boundedInteger(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
}

function compareText(left: string, right: string) {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function halfLabel(half: InningHalf) {
  return half === "top" ? "초" : "말";
}

export function formatBaseballInningsPitched(outsRecorded: number) {
  const outs = boundedInteger(outsRecorded);
  const fullInnings = Math.floor(outs / 3);
  const remainder = outs % 3;
  if (remainder === 0) return `${fullInnings}`;
  return `${fullInnings}${remainder === 1 ? "⅓" : "⅔"}`;
}

export function formatBaseballBatterPrimaryLine(stats: BatterGameStats) {
  return `${boundedInteger(stats.ab)}타수 ${boundedInteger(stats.h)}안타`;
}

export function formatBaseballBatterSecondaryLine(stats: BatterGameStats) {
  const parts: string[] = [];
  if (stats.hr > 0) parts.push(`${boundedInteger(stats.hr)}홈런`);
  if (stats.rbi > 0) parts.push(`${boundedInteger(stats.rbi)}타점`);
  if (stats.triples > 0) parts.push(`${boundedInteger(stats.triples)} 3루타`);
  if (stats.doubles > 0) parts.push(`${boundedInteger(stats.doubles)} 2루타`);
  if (stats.bb > 0) parts.push(`${boundedInteger(stats.bb)}볼넷`);
  if (parts.length === 0) {
    parts.push(`${boundedInteger(stats.r)}득점`, `${boundedInteger(stats.so)}삼진`);
  }
  return parts.slice(0, 3).join(" · ");
}

export function formatBaseballPitcherPrimaryLine(stats: PitcherGameStats) {
  return `${formatBaseballInningsPitched(stats.outsRecorded)}이닝 ${boundedInteger(stats.strikeouts)}탈삼진`;
}

export function formatBaseballPitcherSecondaryLine(stats: PitcherGameStats) {
  return [
    `${boundedInteger(stats.hitsAllowed)}피안타`,
    `${boundedInteger(stats.runsAllowed)}실점`,
    `${boundedInteger(stats.pitches)}구`,
  ].join(" · ");
}

export function shouldRenderCancelledBaseballFinal(
  gameStatus: GameStatus,
  cancelled = false,
) {
  return cancelled || gameStatus !== "finished";
}

function batterImpact(stats: BatterGameStats) {
  const singles = Math.max(0, stats.h - stats.doubles - stats.triples - stats.hr);
  return (
    singles * 8
    + stats.doubles * 12
    + stats.triples * 16
    + stats.hr * 22
    + stats.rbi * 7
    + stats.r * 4
    + stats.bb * 3
    - stats.so
  );
}

function pitcherImpact(stats: PitcherGameStats) {
  return (
    stats.outsRecorded * 3
    + stats.strikeouts * 4
    - stats.hitsAllowed * 2
    - stats.runsAllowed * 7
    - stats.walks * 2
  );
}

function candidateIdentity(
  game: BaseballGameState,
  teamIndex: TeamIndex,
  playerId: string,
  role: BaseballFinalMvpRole,
) {
  const team = game.teams[teamIndex];
  const player = getBaseballPlayer(playerId);
  return {
    playerId,
    name: player?.name ?? playerId,
    number: player?.number ?? 0,
    position: player?.position ?? (role === "PITCHER" ? "P" : "DH"),
    portraitAssetId: player?.portraitAssetId,
    teamIndex,
    teamId: team.id,
    teamShortName: team.shortName,
    themeColor: team.themeColor,
    accentColor: team.accentColor,
    role,
  };
}

function createMvpCandidates(game: BaseballGameState) {
  return game.teams.flatMap((team, rawTeamIndex) => {
    const teamIndex = rawTeamIndex as TeamIndex;
    const winnerBonus = game.winner === teamIndex ? 14 : 0;
    const teamPreference = game.winner === null
      ? teamIndex
      : game.winner === teamIndex ? 0 : 1;
    const batters: MvpCandidate[] = team.lineupPlayerIds.map((playerId, rosterOrder) => {
      const stats = team.batterStats[playerId] ?? {
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
      return {
        ...candidateIdentity(game, teamIndex, playerId, "BATTER"),
        impactScore: batterImpact(stats) + winnerBonus,
        primaryStatLine: formatBaseballBatterPrimaryLine(stats),
        secondaryStatLine: formatBaseballBatterSecondaryLine(stats),
        teamPreference,
        rolePreference: 0,
        rosterOrder,
      };
    });
    const pitchers: MvpCandidate[] = Object.entries(team.pitcherStats).map(
      ([playerId, stats]) => ({
        ...candidateIdentity(game, teamIndex, playerId, "PITCHER"),
        impactScore: pitcherImpact(stats) + winnerBonus,
        primaryStatLine: formatBaseballPitcherPrimaryLine(stats),
        secondaryStatLine: formatBaseballPitcherSecondaryLine(stats),
        teamPreference,
        rolePreference: 1,
        rosterOrder: team.lineupPlayerIds.length,
      }),
    );
    return [...batters, ...pitchers];
  });
}

export function selectBaseballFinalMvp(game: BaseballGameState): BaseballFinalMvp {
  const candidates = createMvpCandidates(game);
  candidates.sort((left, right) => (
    right.impactScore - left.impactScore
    || left.teamPreference - right.teamPreference
    || left.rolePreference - right.rolePreference
    || left.rosterOrder - right.rosterOrder
    || compareText(left.playerId, right.playerId)
  ));
  const selected = candidates[0];
  if (!selected) throw new Error("MVP를 선정할 야구 선수가 없습니다.");
  const {
    teamPreference: _teamPreference,
    rolePreference: _rolePreference,
    rosterOrder: _rosterOrder,
    ...mvp
  } = selected;
  return mvp;
}

export function createBaseballFinalLineScore(game: BaseballGameState): BaseballFinalLineScore {
  const inningCount = Math.max(
    MINIMUM_INNINGS,
    boundedInteger(game.inning),
    game.teams[0].inningRuns.length,
    game.teams[1].inningRuns.length,
  );
  const innings = Array.from({ length: inningCount }, (_, index) => index + 1);
  const rows = game.teams.map((team, teamIndex) => ({
    teamId: team.id,
    teamName: team.name,
    shortName: team.shortName,
    themeColor: team.themeColor,
    accentColor: team.accentColor,
    innings: innings.map((inning) => team.inningRuns[inning - 1] ?? null),
    runs: team.runs,
    hits: team.hits,
    errors: team.errors,
    isWinner: game.winner === teamIndex,
  })) as [BaseballFinalLineScoreRow, BaseballFinalLineScoreRow];
  return { innings, rows };
}

function scoreLeader(scores: readonly [number, number]): TeamIndex | null {
  if (scores[0] === scores[1]) return null;
  return scores[0] > scores[1] ? 0 : 1;
}

function homeRunLabel(runsScored: number) {
  if (runsScored >= 4) return "만루 홈런";
  if (runsScored === 3) return "3점 홈런";
  if (runsScored === 2) return "2점 홈런";
  return "솔로 홈런";
}

function highlightPriority(
  result: BaseballPlayResultCode,
  runsScored: number,
  flags: {
    walkOff: boolean;
    leadChange: boolean;
    tieBreak: boolean;
    tied: boolean;
    openingRun: boolean;
  },
) {
  if (flags.walkOff) return 1_000 + runsScored * 10;
  if (flags.leadChange) return 900 + runsScored * 10;
  if (flags.openingRun) return 650 + runsScored * 10;
  if (flags.tieBreak) return 840 + runsScored * 10;
  if (flags.tied) return 780 + runsScored * 10;
  if (HOME_RUN_RESULTS.has(result)) return 720 + runsScored * 10;
  if (runsScored > 1) return 680 + runsScored * 10;
  if (runsScored === 1) return 620;
  if (result === "TRIPLE") return 500;
  if (DOUBLE_RESULTS.has(result)) return 460;
  if (result === "DOUBLE_PLAY") return 420;
  if (STRIKEOUT_RESULTS.has(result)) return 360;
  if (HIT_RESULTS.has(result)) return 300;
  if (result === "ERROR") return 260;
  return 100;
}

function highlightTitle(
  teamShortName: string,
  result: BaseballPlayResultCode,
  runsScored: number,
  flags: {
    walkOff: boolean;
    leadChange: boolean;
    tieBreak: boolean;
    tied: boolean;
    openingRun: boolean;
  },
) {
  const resultLabel = HOME_RUN_RESULTS.has(result)
    ? homeRunLabel(runsScored)
    : RESULT_LABELS[result];
  if (flags.walkOff) return `${teamShortName} 끝내기 ${resultLabel}`;
  if (flags.leadChange) return `${teamShortName} 역전 ${resultLabel}`;
  if (flags.openingRun) return `${teamShortName} 선취 ${resultLabel}`;
  if (flags.tieBreak) return `${teamShortName} 리드 ${resultLabel}`;
  if (flags.tied) return `${teamShortName} 동점 ${resultLabel}`;
  return `${teamShortName} ${resultLabel}`;
}

function createPlayHighlightCandidates(game: BaseballGameState) {
  const runningScore: [number, number] = [0, 0];
  const lastPlayIndex = game.playByPlay.length - 1;
  return game.playByPlay.map((entry, playIndex): HighlightCandidate => {
    const teamIndex = entry.battingTeam;
    const otherIndex: TeamIndex = teamIndex === 0 ? 1 : 0;
    const openingRun = runningScore[0] === 0 && runningScore[1] === 0 && entry.runsScored > 0;
    const beforeLeader = scoreLeader(runningScore);
    const beforeDifference = runningScore[teamIndex] - runningScore[otherIndex];
    runningScore[teamIndex] += boundedInteger(entry.runsScored);
    const afterLeader = scoreLeader(runningScore);
    const afterDifference = runningScore[teamIndex] - runningScore[otherIndex];
    const walkOff = (
      playIndex === lastPlayIndex
      && entry.runsScored > 0
      && entry.half === "bottom"
      && game.status === "finished"
      && game.winner === teamIndex
    );
    const flags = {
      walkOff,
      leadChange: beforeDifference < 0 && afterDifference > 0,
      tieBreak: beforeLeader === null && afterLeader === teamIndex && beforeDifference === 0,
      tied: beforeDifference < 0 && afterDifference === 0,
      openingRun,
    };
    const scoreLabel = `${game.teams[0].shortName} ${runningScore[0]} : ${runningScore[1]} ${game.teams[1].shortName}`;
    return {
      id: entry.id,
      inning: entry.inning,
      half: entry.half,
      inningLabel: `${entry.inning}회${halfLabel(entry.half)}`,
      teamIndex,
      teamShortName: game.teams[teamIndex].shortName,
      title: highlightTitle(
        game.teams[teamIndex].shortName,
        entry.result,
        entry.runsScored,
        flags,
      ),
      detail: `${entry.message} · ${scoreLabel}`,
      priority: highlightPriority(entry.result, entry.runsScored, flags),
      playIndex,
    };
  });
}

function createSummaryHighlights(game: BaseballGameState): HighlightCandidate[] {
  const winner = game.winner === null ? null : game.teams[game.winner];
  const offenseIndex: TeamIndex = (
    game.teams[1].runs > game.teams[0].runs
    || (game.teams[1].runs === game.teams[0].runs && game.teams[1].hits > game.teams[0].hits)
  ) ? 1 : 0;
  const offense = game.teams[offenseIndex];
  const defenseIndex: TeamIndex = game.teams[1].errors < game.teams[0].errors
    ? 1
    : game.teams[1].errors > game.teams[0].errors
      ? 0
      : game.winner ?? 0;
  const defense = game.teams[defenseIndex];
  return [
    {
      id: "final-summary",
      inning: null,
      half: null,
      inningLabel: "FINAL",
      teamIndex: game.winner,
      teamShortName: winner?.shortName ?? "DRAW",
      title: winner ? `${winner.shortName} 최종 승리` : "최종 무승부",
      detail: `${game.teams[0].shortName} ${game.teams[0].runs} : ${game.teams[1].runs} ${game.teams[1].shortName}`,
      priority: 90,
      playIndex: game.playByPlay.length,
    },
    {
      id: "offense-summary",
      inning: null,
      half: null,
      inningLabel: "OFFENSE",
      teamIndex: offenseIndex,
      teamShortName: offense.shortName,
      title: `${offense.shortName} 타선 집중력`,
      detail: `${offense.hits}안타 · ${offense.runs}득점`,
      priority: 80,
      playIndex: game.playByPlay.length + 1,
    },
    {
      id: "defense-summary",
      inning: null,
      half: null,
      inningLabel: "DEFENSE",
      teamIndex: defenseIndex,
      teamShortName: defense.shortName,
      title: `${defense.shortName} 수비 기록`,
      detail: `${defense.errors}실책으로 경기 마감`,
      priority: 70,
      playIndex: game.playByPlay.length + 2,
    },
  ];
}

export function selectBaseballFinalHighlights(
  game: BaseballGameState,
  requestedLimit = MAXIMUM_HIGHLIGHTS,
): BaseballFinalHighlight[] {
  const limit = Math.min(
    MAXIMUM_HIGHLIGHTS,
    Math.max(MINIMUM_HIGHLIGHTS, boundedInteger(requestedLimit)),
  );
  const playCandidates = createPlayHighlightCandidates(game);
  const summaries = createSummaryHighlights(game);
  const selected = [...playCandidates]
    .sort((left, right) => (
      right.priority - left.priority
      || right.playIndex - left.playIndex
      || compareText(left.id, right.id)
    ))
    .slice(0, limit);
  for (const summary of summaries) {
    if (selected.length >= limit) break;
    selected.push(summary);
  }
  selected.sort((left, right) => left.playIndex - right.playIndex || compareText(left.id, right.id));
  return selected.map(({ priority: _priority, playIndex: _playIndex, ...highlight }) => highlight);
}

export function createBaseballFinalResult(game: BaseballGameState): BaseballFinalResult {
  return {
    lineScore: createBaseballFinalLineScore(game),
    mvp: selectBaseballFinalMvp(game),
    highlights: selectBaseballFinalHighlights(game),
  };
}
