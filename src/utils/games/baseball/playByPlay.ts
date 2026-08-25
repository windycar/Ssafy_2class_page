import { getPitchDefinition } from "../../../data/games/baseball/pitches.ts";
import { getBaseballPlayer } from "../../../data/games/baseball/players.ts";
import type {
  BaseballGameState,
  BaseballPlayResultCode,
  OfficialPlayResult,
  PlayByPlayEntry,
  TeamIndex,
} from "./types.ts";

export const BASEBALL_PLAY_RESULT_LABELS_V2: Readonly<Record<BaseballPlayResultCode, string>> = {
  BALL: "볼",
  CALLED_STRIKE: "스트라이크",
  SWINGING_STRIKE: "헛스윙",
  FOUL: "파울",
  WALK: "볼넷",
  STRIKEOUT_LOOKING: "루킹 삼진",
  STRIKEOUT_SWINGING: "헛스윙 삼진",
  GROUND_OUT_1B: "1루수 땅볼 아웃",
  GROUND_OUT_2B: "2루수 땅볼 아웃",
  GROUND_OUT_SS: "유격수 땅볼 아웃",
  GROUND_OUT_3B: "3루수 땅볼 아웃",
  FLY_OUT_LF: "좌익수 뜬공 아웃",
  FLY_OUT_CF: "중견수 뜬공 아웃",
  FLY_OUT_RF: "우익수 뜬공 아웃",
  LINE_OUT: "직선타 아웃",
  POP_OUT: "내야 뜬공 아웃",
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
  ERROR: "실책 출루",
};

const CONTACT_RESULTS = new Set<BaseballPlayResultCode>([
  "GROUND_OUT_1B",
  "GROUND_OUT_2B",
  "GROUND_OUT_SS",
  "GROUND_OUT_3B",
  "FLY_OUT_LF",
  "FLY_OUT_CF",
  "FLY_OUT_RF",
  "LINE_OUT",
  "POP_OUT",
  "SINGLE_LEFT",
  "SINGLE_CENTER",
  "SINGLE_RIGHT",
  "INFIELD_SINGLE",
  "DOUBLE_LEFT",
  "DOUBLE_CENTER",
  "DOUBLE_RIGHT",
  "TRIPLE",
  "HOME_RUN_LEFT",
  "HOME_RUN_CENTER",
  "HOME_RUN_RIGHT",
  "DOUBLE_PLAY",
  "FIELDER_CHOICE",
  "SAC_FLY",
  "ERROR",
]);

const RESULT_NARRATION: Partial<Readonly<Record<BaseballPlayResultCode, string>>> = {
  SINGLE_LEFT: "좌익수 앞에 떨어집니다!",
  SINGLE_CENTER: "중견수 앞으로 빠져나갑니다!",
  SINGLE_RIGHT: "우익수 앞에 떨어집니다!",
  INFIELD_SINGLE: "내야 깊은 곳, 타자 주자가 먼저 들어갑니다!",
  DOUBLE_LEFT: "좌중간을 가릅니다!",
  DOUBLE_CENTER: "중견수 키를 넘기며 2루까지 갑니다!",
  DOUBLE_RIGHT: "우중간을 가릅니다!",
  TRIPLE: "외야 깊숙한 곳을 가르며 3루까지 들어갑니다!",
  HOME_RUN_LEFT: "왼쪽 담장을 넘깁니다!",
  HOME_RUN_CENTER: "가운데 담장을 넘깁니다!",
  HOME_RUN_RIGHT: "오른쪽 담장을 넘깁니다!",
  DOUBLE_PLAY: "수비가 연결해 병살로 잡아냅니다.",
  SAC_FLY: "외야 뜬공, 주자는 태그업합니다.",
};

export interface BaseballPlayByPlayInputV2 {
  stateBefore: BaseballGameState;
  stateAfter: BaseballGameState;
  commandId: string;
  occurredAt: string;
  official: OfficialPlayResult;
}

function pitcherCountText(game: BaseballGameState) {
  return `${game.count.balls}볼 ${game.count.strikes}스트라이크`;
}

function pitchName(game: BaseballGameState) {
  const pitchType = game.activePlay?.pitch?.pitchType;
  if (!pitchType) return "공";
  return getPitchDefinition(pitchType).shortName;
}

function scoreText(game: BaseballGameState) {
  return `${game.teams[0].shortName} ${game.teams[0].runs} : ${game.teams[1].runs} ${game.teams[1].shortName}`;
}

function playerName(playerId: string) {
  return getBaseballPlayer(playerId)?.name ?? playerId;
}

function withObjectParticle(word: string) {
  const lastCode = word.charCodeAt(word.length - 1);
  const isHangulSyllable = lastCode >= 0xac00 && lastCode <= 0xd7a3;
  const hasFinalConsonant = isHangulSyllable && (lastCode - 0xac00) % 28 !== 0;
  return `${word}${hasFinalConsonant ? "을" : "를"}`;
}

function baseNarration(
  stateBefore: BaseballGameState,
  stateAfter: BaseballGameState,
  official: OfficialPlayResult,
) {
  const batterName = playerName(official.batterId);
  const thrownPitch = pitchName(stateBefore);
  const pitchWithParticle = withObjectParticle(thrownPitch);
  const count = pitcherCountText(stateAfter);

  switch (official.code) {
    case "BALL":
      return `${batterName}, ${pitchWithParticle} 지켜봅니다. 볼, ${count}.`;
    case "CALLED_STRIKE":
      return `${batterName}, ${pitchWithParticle} 지켜봅니다. 스트라이크, ${count}.`;
    case "SWINGING_STRIKE":
      return `${batterName}, ${thrownPitch}에 배트가 나왔지만 헛스윙. ${count}.`;
    case "FOUL":
      return `${batterName}, ${pitchWithParticle} 받아쳤지만 파울. ${count}.`;
    case "WALK":
      return `${batterName}, ${pitchWithParticle} 골라내며 볼넷으로 출루합니다.`;
    case "STRIKEOUT_LOOKING":
      return `${batterName}, ${pitchWithParticle} 지켜보다 루킹 삼진.`;
    case "STRIKEOUT_SWINGING":
      return `${batterName}, ${thrownPitch}에 헛스윙 삼진.`;
    default: {
      const result = BASEBALL_PLAY_RESULT_LABELS_V2[official.code];
      const detail = RESULT_NARRATION[official.code];
      if (CONTACT_RESULTS.has(official.code)) {
        return `${batterName}, ${pitchWithParticle} 받아쳤습니다! ${detail ?? `${result}.`}`;
      }
      return `${batterName}, ${result}.`;
    }
  }
}

function isLeadChange(
  stateBefore: BaseballGameState,
  stateAfter: BaseballGameState,
  battingTeam: TeamIndex,
) {
  const fieldingTeam: TeamIndex = battingTeam === 0 ? 1 : 0;
  return stateBefore.teams[battingTeam].runs < stateBefore.teams[fieldingTeam].runs
    && stateAfter.teams[battingTeam].runs > stateAfter.teams[fieldingTeam].runs;
}

function isWalkOff(
  stateBefore: BaseballGameState,
  stateAfter: BaseballGameState,
  official: OfficialPlayResult,
) {
  return stateBefore.half === "bottom"
    && stateBefore.battingTeam === 1
    && official.runsScored > 0
    && stateAfter.status === "finished"
    && stateAfter.winner === 1;
}

export function createBaseballPlayByPlayMessageV2(
  stateBefore: BaseballGameState,
  stateAfter: BaseballGameState,
  official: OfficialPlayResult,
) {
  const fragments = [baseNarration(stateBefore, stateAfter, official)];
  if (official.runsScored > 0) {
    const scorers = official.scoredRunnerIds.map(playerName).join(" · ");
    fragments.push(`득점! ${scorers}`);
    if (official.rbi > 0) fragments.push(`${official.rbi} RBI`);
    fragments.push(scoreText(stateAfter));
  }
  if (isLeadChange(stateBefore, stateAfter, stateBefore.battingTeam)) {
    fragments.push("LEAD CHANGE!");
  }
  if (isWalkOff(stateBefore, stateAfter, official)) fragments.push("WALK-OFF!");
  return fragments.join(" · ");
}

/** Creates the canonical, persisted commentary entry for one resolved pitch/play. */
export function createBaseballPlayByPlayEntryV2({
  stateBefore,
  stateAfter,
  commandId,
  occurredAt,
  official,
}: BaseballPlayByPlayInputV2): PlayByPlayEntry {
  return {
    id: commandId,
    ...(stateBefore.activePlay?.startCommandId
      ? { startCommandId: stateBefore.activePlay.startCommandId }
      : {}),
    playId: official.playId,
    inning: stateBefore.inning,
    half: stateBefore.half,
    battingTeam: stateBefore.battingTeam,
    batterId: official.batterId,
    result: official.code,
    message: createBaseballPlayByPlayMessageV2(stateBefore, stateAfter, official),
    runsScored: official.runsScored,
    createdAt: occurredAt,
  };
}
