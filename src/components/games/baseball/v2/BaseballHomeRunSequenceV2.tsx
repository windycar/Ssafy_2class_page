import confetti from "canvas-confetti";
import {
  useEffect,
  useRef,
  type CSSProperties,
} from "react";

import {
  isBaseballHomeRunCinematicSkippablePhaseV2,
  type BaseballScoringPresentationV2,
} from "../../../../utils/games/baseball/scoringPresentation.ts";
import type { VisualEvent } from "../../../../utils/games/baseball/types.ts";

export interface BaseballHomeRunSequenceV2Props {
  event: VisualEvent;
  model: BaseballScoringPresentationV2;
  eventProgress: number;
  imageSrc?: string;
  onSkipSequence?: () => void;
}

type SequenceProgressStyle = CSSProperties & {
  "--bbv2-sequence-progress": number;
};

function phaseCopy(event: VisualEvent, model: BaseballScoringPresentationV2) {
  switch (event.kind) {
    case "CONTACT":
      return { eyebrow: "CONTACT", title: "CRUSHED!", detail: "완벽한 타구가 뻗어 나갑니다." };
    case "BALL_FLIGHT":
      return { eyebrow: "DEEP FLY", title: "펜스를 향해!", detail: "외야 깊숙한 타구를 추적합니다." };
    case "RUNNER_ADVANCE":
      return { eyebrow: model.scoringLabel, title: "베이스를 돕니다", detail: model.scorerNames.join(" · ") };
    case "RUN_SCORE":
      return { eyebrow: model.scoringLabel, title: "HOME RUN!", detail: `HOME PLATE · SAFE · ${model.batterName} · ${model.rbi} RBI` };
    case "SCOREBOARD_UPDATE":
      return { eyebrow: model.momentLabel ?? "SCORE UPDATE", title: `${model.scoreAfter[0]} : ${model.scoreAfter[1]}`, detail: `${model.battingTeamShortName} 전광판 반영` };
    case "PLAY_RESULT":
      return { eyebrow: model.momentLabel ?? model.scoringLabel, title: `${model.batterName} 홈런!`, detail: `${model.runsScored}득점 · ${model.rbi}타점` };
    case "NEXT_BATTER":
      return { eyebrow: "NEXT BATTER", title: "다음 승부", detail: "홈런 장면을 마치고 다음 타석으로 이동합니다." };
    case "HALF_INNING":
      return { eyebrow: "CHANGE SIDES", title: "공수교대", detail: "다음 공격을 준비합니다." };
    case "FIELD_RESULT":
      return { eyebrow: model.scoringLabel, title: "HOME RUN!", detail: "수비가 닿을 수 없는 타구입니다." };
  }
}

export function BaseballHomeRunSequenceV2({
  event,
  model,
  eventProgress,
  imageSrc,
  onSkipSequence,
}: BaseballHomeRunSequenceV2Props) {
  const celebratedPlayIdsRef = useRef(new Set<string>());
  useEffect(() => {
    if (
      event.kind !== "RUN_SCORE"
      || celebratedPlayIdsRef.current.has(model.playId)
    ) return;
    celebratedPlayIdsRef.current.add(model.playId);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    void confetti({
      particleCount: reducedMotion ? 28 : model.runsScored >= 4 ? 190 : 130,
      spread: model.runsScored >= 4 ? 112 : 88,
      origin: { y: 0.6 },
      colors: ["#1259aa", "#ffffff", "#ef4444", "#fde047"],
      disableForReducedMotion: true,
    });
  }, [event.kind, model.playId, model.runsScored]);

  const copy = phaseCopy(event, model);
  const style: SequenceProgressStyle = {
    "--bbv2-sequence-progress": Math.min(1, Math.max(0, eventProgress)),
  };
  const compact = event.kind === "CONTACT" || event.kind === "BALL_FLIGHT";
  const canSkipSequence = Boolean(onSkipSequence)
    && isBaseballHomeRunCinematicSkippablePhaseV2(event.kind);

  return (
    <aside
      className={`bbv2-home-run-sequence${compact ? " is-compact" : ""}`}
      data-event-kind={event.kind}
      data-home-run-kind={model.scoringLabel}
      data-moment={model.moment}
      style={style}
      role="status"
      aria-live={event.kind === "RUN_SCORE" ? "assertive" : "polite"}
    >
      {imageSrc && event.kind === "PLAY_RESULT" ? (
        <img src={imageSrc} alt="홈런 타자 세리머니" draggable={false} />
      ) : null}
      <div className="bbv2-home-run-sequence__copy">
        <span>{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.detail}</p>
        {event.kind === "RUN_SCORE" || event.kind === "SCOREBOARD_UPDATE" ? (
          <strong className="bbv2-home-run-sequence__score">
            {model.scoreAfter[0]} <i>:</i> {model.scoreAfter[1]}
          </strong>
        ) : null}
      </div>
      {canSkipSequence ? (
        <button
          type="button"
          aria-keyshortcuts="Space"
          onClick={onSkipSequence}
        >
          <kbd>SPACE</kbd>
          홈런 연출 건너뛰기
        </button>
      ) : null}
    </aside>
  );
}

export default BaseballHomeRunSequenceV2;
