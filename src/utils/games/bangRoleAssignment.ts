import { shuffleArray } from "../shuffleArray";
import type { BangPlayer, BangRole } from "../../types/bang";
import { BANG_CHARACTERS } from "../../types/bangCharacters";

const ROLE_TABLE: Record<number, BangRole[]> = {
  4: ["sheriff", "outlaw", "outlaw", "renegade"],
  5: ["sheriff", "deputy", "outlaw", "outlaw", "renegade"],
  6: ["sheriff", "deputy", "outlaw", "outlaw", "outlaw", "renegade"],
  7: ["sheriff", "deputy", "deputy", "outlaw", "outlaw", "outlaw", "renegade"],
};

export function assignBangRoles(players: BangPlayer[]): BangPlayer[] {
  const n = players.length;
  const roles = ROLE_TABLE[n];
  if (!roles) throw new Error(`뱅은 4~7명만 지원합니다. (현재: ${n}명)`);

  const shuffledRoles = shuffleArray(roles);
  const shuffledCharacters = shuffleArray(BANG_CHARACTERS).slice(0, n * 2);

  return players.map((p, i) => {
    const role = shuffledRoles[i];
    const characterOptions = shuffledCharacters
      .slice(i * 2, i * 2 + 2)
      .map(character => character.id);
    return {
      ...p,
      role,
      characterOptions,
      characterId: undefined,
      maxLife: undefined,
      status: "alive" as const,
    };
  });
}
