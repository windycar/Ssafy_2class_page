import type { BaseballRosterDefinition } from "../../../utils/games/baseball/types.ts";
import {
  BASEBALL_PLAYER_BY_ID,
  KIA_THEME_BATTERS,
  KIA_THEME_PITCHERS,
  OPPONENT_BATTERS,
  OPPONENT_PITCHERS,
} from "./players.ts";

export const KIA_THEME_ROSTER = {
  id: "kia-theme",
  teamName: "KIA 타이거즈",
  shortName: "KIA",
  themeColor: "#c91d2e",
  accentColor: "#111827",
  lineupPlayerIds: [
    "kia-park-chanho",
    "kia-choi-wonjun",
    "kia-kim-doyoung",
    "kia-choi-hyoungwoo",
    "kia-na-sungbum",
    "kia-kim-sunbin",
    "kia-lee-woosung",
    "kia-kim-taegun",
    "kia-lee-changjin",
  ],
  startingPitcherId: "kia-yang-hyeonjong",
} as const satisfies BaseballRosterDefinition;

export const OPPONENT_ROSTER = {
  id: "cpu-all-stars",
  teamName: "CPU 올스타",
  shortName: "CPU",
  themeColor: "#1259aa",
  accentColor: "#f8fafc",
  lineupPlayerIds: [
    "cpu-yoon-taesung",
    "cpu-park-junho",
    "cpu-jung-mingyu",
    "cpu-han-doyoon",
    "cpu-oh-sejin",
    "cpu-bae-hyunwoo",
    "cpu-song-jihwan",
    "cpu-jang-minseok",
    "cpu-lee-geonwoo",
  ],
  startingPitcherId: "cpu-kang-minjae",
} as const satisfies BaseballRosterDefinition;

export const BASEBALL_ROSTERS = [KIA_THEME_ROSTER, OPPONENT_ROSTER] as const;
export const DEFAULT_BASEBALL_ROSTERS = [OPPONENT_ROSTER, KIA_THEME_ROSTER] as const;

export const BASEBALL_ROSTER_BY_ID: Readonly<Record<string, BaseballRosterDefinition>> =
  Object.freeze(Object.assign(
    Object.create(null) as Record<string, BaseballRosterDefinition>,
    Object.fromEntries(BASEBALL_ROSTERS.map((roster) => [roster.id, roster])),
  ));

export function getBaseballRoster(rosterId: string): BaseballRosterDefinition | undefined {
  return Object.hasOwn(BASEBALL_ROSTER_BY_ID, rosterId)
    ? BASEBALL_ROSTER_BY_ID[rosterId]
    : undefined;
}

export interface BaseballRosterValidation {
  valid: boolean;
  errors: string[];
}

export function validateBaseballRoster(
  roster: BaseballRosterDefinition,
): BaseballRosterValidation {
  const errors: string[] = [];
  const uniqueLineup = new Set(roster.lineupPlayerIds);

  if (roster.lineupPlayerIds.length !== 9) {
    errors.push(`${roster.id}: 타순은 정확히 9명이어야 합니다.`);
  }
  if (uniqueLineup.size !== roster.lineupPlayerIds.length) {
    errors.push(`${roster.id}: 타순에 중복 선수가 있습니다.`);
  }

  for (const playerId of roster.lineupPlayerIds) {
    const player = Object.hasOwn(BASEBALL_PLAYER_BY_ID, playerId)
      ? BASEBALL_PLAYER_BY_ID[playerId]
      : undefined;
    if (!player) errors.push(`${roster.id}: 존재하지 않는 타자 ${playerId}`);
    else if (player.position === "P") errors.push(`${roster.id}: 투수가 9명 타순에 포함되었습니다.`);
  }

  const pitcher = Object.hasOwn(BASEBALL_PLAYER_BY_ID, roster.startingPitcherId)
    ? BASEBALL_PLAYER_BY_ID[roster.startingPitcherId]
    : undefined;
  if (!pitcher) errors.push(`${roster.id}: 선발투수를 찾을 수 없습니다.`);
  else if (pitcher.position !== "P" || !pitcher.pitching) {
    errors.push(`${roster.id}: 선발투수 데이터에 pitching 능력치가 없습니다.`);
  }

  return { valid: errors.length === 0, errors };
}

// These exports make the intended 9 + 9 batters and 1 + 1 pitchers explicit to callers.
export const KIA_THEME_PLAYER_COUNT = KIA_THEME_BATTERS.length + KIA_THEME_PITCHERS.length;
export const OPPONENT_PLAYER_COUNT = OPPONENT_BATTERS.length + OPPONENT_PITCHERS.length;
