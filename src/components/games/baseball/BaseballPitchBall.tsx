import type { CSSProperties } from "react";

import baseballBallBody from "../../../assets/games/baseball-ball-body-v2.png";
import type { PitchVisualKind } from "../../../utils/games/baseballEngine";

export const BASEBALL_BALL_BODY_SRC = baseballBallBody;

type BaseballBallVariant = "pitch" | "batted";
type BaseballBallActionMode = "batting" | "pitching";
type BaseballBallPhase = "idle" | "aiming" | "windup" | "flight" | "resolved";

interface BaseballPitchBallProps {
  variant: BaseballBallVariant;
  pitchKind: PitchVisualKind;
  style: CSSProperties | undefined;
  actionMode?: BaseballBallActionMode;
  phase?: BaseballBallPhase;
  tone?: string;
}

export function BaseballPitchBall({
  variant,
  pitchKind,
  style,
  actionMode,
  phase,
  tone,
}: BaseballPitchBallProps) {
  const className = [
    variant === "pitch" ? "baseball-live-ball" : "baseball-batted-ball",
    actionMode ? `is-${actionMode}` : "",
    phase ? `is-${phase}` : "",
    `is-${pitchKind}`,
    tone ? `is-${tone}` : "",
  ].filter(Boolean).join(" ");

  return (
    <span className={className} style={style} aria-hidden="true">
      <span className="baseball-ball-trail">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="baseball-ball-rotation">
        <img className="baseball-ball-body" src={BASEBALL_BALL_BODY_SRC} alt="" draggable={false} />
      </span>
    </span>
  );
}
