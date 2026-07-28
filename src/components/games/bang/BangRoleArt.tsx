import type { BangRole } from "../../../types/bang";
import roleArtSprite from "../../../assets/games/bang-role-art-sprite.jpg";

const ROLE_ART_POSITION: Record<BangRole, string> = {
  sheriff: "0% 0%",
  deputy: "100% 0%",
  outlaw: "0% 100%",
  renegade: "100% 100%",
};

const ROLE_ART_LABEL: Record<BangRole, string> = {
  sheriff: "보안관 역할 그림",
  deputy: "부관 역할 그림",
  outlaw: "무법자 역할 그림",
  renegade: "배신자 역할 그림",
};

export function BangRoleArt({
  role,
  className = "",
}: {
  role: BangRole;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={ROLE_ART_LABEL[role]}
      className={`inline-block overflow-hidden bg-cover bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${roleArtSprite})`,
        backgroundPosition: ROLE_ART_POSITION[role],
        backgroundSize: "200% 200%",
      }}
    />
  );
}
