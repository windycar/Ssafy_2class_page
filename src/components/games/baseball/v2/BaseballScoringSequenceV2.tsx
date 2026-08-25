import type { CSSProperties } from "react";

import type { BaseballScoringPresentationV2 } from "../../../../utils/games/baseball/scoringPresentation.ts";
import type { VisualEvent } from "../../../../utils/games/baseball/types.ts";

export interface BaseballScoringSequenceV2Props {
  event: VisualEvent;
  model: BaseballScoringPresentationV2;
  eventProgress: number;
}

type SequenceProgressStyle = CSSProperties & {
  "--bbv2-sequence-progress": number;
};

export function BaseballScoringSequenceV2({
  event,
  model,
  eventProgress,
}: BaseballScoringSequenceV2Props) {
  const style: SequenceProgressStyle = {
    "--bbv2-sequence-progress": Math.min(1, Math.max(0, eventProgress)),
  };
  const title = model.momentLabel ?? model.scoringLabel;
  const scorerCopy = model.scorerNames.length > 0
    ? model.scorerNames.map((name) => `${name} SCORE!`).join(" · ")
    : `${model.battingTeamName} 득점`;

  return (
    <aside
      className={`bbv2-scoring-sequence is-${model.moment.toLowerCase().replaceAll("_", "-")}`}
      data-event-kind={event.kind}
      data-runs-scored={model.runsScored}
      style={style}
      role="status"
      aria-live="assertive"
    >
      {event.kind === "RUN_SCORE" ? (
        <small className="bbv2-scoring-sequence__ruling">HOME PLATE · SAFE</small>
      ) : null}
      <span className="bbv2-scoring-sequence__eyebrow">{title}</span>
      <h2>{scorerCopy}</h2>
      <div className="bbv2-scoring-sequence__score" aria-label="득점 후 스코어">
        <span>{model.scoreAfter[0]}</span>
        <i>:</i>
        <span>{model.scoreAfter[1]}</span>
      </div>
      <p>
        {model.rbi > 0 ? (
          <>
            <strong>RBI · {model.batterName}</strong>
            <span>{model.rbi}타점</span>
          </>
        ) : (
          <>
            <strong>타점 없음</strong>
            <span>수비 판정 득점</span>
          </>
        )}
      </p>
    </aside>
  );
}

export default BaseballScoringSequenceV2;
