import spriteUrl from "../../../assets/games/bang-card-art-sprite.jpg";
import { CARD_NAME } from "../../../types/bangCards";
import type { BangCardKind } from "../../../types/bangCards";

const SPRITE_POSITION: Record<BangCardKind, readonly [column: number, row: number]> = {
  bang: [0, 0],
  missed: [1, 0],
  beer: [2, 0],
  saloon: [3, 0],
  indians: [4, 0],
  gatling: [0, 1],
  duel: [1, 1],
  general_store: [2, 1],
  stagecoach: [3, 1],
  wells_fargo: [4, 1],
  cat_balou: [0, 2],
  panic: [1, 2],
  volcanic: [2, 2],
  schofield: [3, 2],
  remington: [4, 2],
  rev_carbine: [0, 3],
  winchester: [1, 3],
  barrel: [2, 3],
  dynamite: [3, 3],
  jail: [4, 3],
  scope: [0, 4],
  mustang: [1, 4],
};

export function BangCardArt({
  kind,
  className = "",
}: {
  kind: BangCardKind;
  className?: string;
}) {
  const [column, row] = SPRITE_POSITION[kind];

  return (
    <span
      role="img"
      aria-label={`${CARD_NAME[kind]} 카드 그림`}
      className={`block bg-no-repeat bg-[#fbefd1] ${className}`}
      style={{
        backgroundImage: `url(${spriteUrl})`,
        backgroundSize: "500% 500%",
        backgroundPosition: `${column * 25}% ${row * 25}%`,
      }}
    />
  );
}
