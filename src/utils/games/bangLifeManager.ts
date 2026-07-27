import type { BangPlayer } from "../../types/bang";

export const MAX_LIFE = 5;
export const MIN_LIFE = 0;
export const DEFAULT_LIFE = 4;

export function increaseLife(player: BangPlayer): BangPlayer {
  return { ...player, life: Math.min(player.life + 1, player.maxLife ?? MAX_LIFE) };
}

export function decreaseLife(player: BangPlayer): BangPlayer {
  const life = Math.max(player.life - 1, MIN_LIFE);
  return { ...player, life };
}

export function eliminatePlayer(player: BangPlayer): BangPlayer {
  return {
    ...player,
    life: 0,
    status: "eliminated",
    eliminatedAt: new Date().toISOString(),
  };
}

export function restorePlayer(player: BangPlayer): BangPlayer {
  return { ...player, life: player.maxLife ?? DEFAULT_LIFE, status: "alive", eliminatedAt: undefined };
}
