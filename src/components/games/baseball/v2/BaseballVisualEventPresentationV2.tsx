import { useBaseballAnimationProgress } from "../../../../hooks/useBaseballAnimationProgress.ts";
import type { BaseballAnimationProgressSource } from "../../../../utils/games/baseball/animationProgress.ts";
import type {
  BaseballGameState,
  OfficialPlayResult,
  VisualEvent,
} from "../../../../utils/games/baseball/types.ts";
import { createBaseballScoringPresentationV2 } from "../../../../utils/games/baseball/scoringPresentation.ts";
import { BaseballEventOverlayV2 } from "./BaseballOverlaysV2.tsx";
import { BaseballHomeRunSequenceV2 } from "./BaseballHomeRunSequenceV2.tsx";
import {
  BaseballHalfInningSequenceV2,
  BaseballPlayerIntroSequenceV2,
} from "./BaseballPresentationSequencesV2.tsx";
import {
  createBaseballVisualEventCopyV2,
  isBaseballHomeRunResultV2,
} from "./BaseballPlayPresentationV2.ts";
import { BaseballScoringSequenceV2 } from "./BaseballScoringSequenceV2.tsx";

export interface BaseballVisualEventOverlayV2Props {
  event: VisualEvent;
  official: OfficialPlayResult | null;
  game: BaseballGameState;
  authoritativeGame?: BaseballGameState;
  eventProgressSource: BaseballAnimationProgressSource;
  onSkip: () => void;
  onSkipSequence?: () => void;
  homeRunImageSrc?: string;
  transitionBackgroundSrc?: string;
}

const LIVE_CALLOUT_KINDS = new Set(["FIELD_RESULT", "RUNNER_ADVANCE", "RUN_SCORE"]);
const SCORING_SEQUENCE_KINDS = new Set(["RUN_SCORE", "SCOREBOARD_UPDATE", "PLAY_RESULT"]);

/**
 * Shared event feedback for Solo and Online. Motion-heavy fielding/running events
 * use a compact callout so the animated play remains visible; terminal rulings
 * retain the centered result overlay.
 */
export function BaseballVisualEventOverlayV2({
  event,
  official,
  game,
  authoritativeGame = game,
  eventProgressSource,
  onSkip,
  onSkipSequence,
  homeRunImageSrc,
  transitionBackgroundSrc,
}: BaseballVisualEventOverlayV2Props) {
  // Only this compact overlay subscribes to frame progress. The parent game
  // shell and HUD remain untouched while phase-specific copy advances.
  const eventProgress = useBaseballAnimationProgress(eventProgressSource);
  if (event.kind === "NEXT_BATTER") {
    return (
      <BaseballPlayerIntroSequenceV2
        game={game}
        eventProgress={eventProgress}
        onSkip={event.skippable ? onSkip : undefined}
      />
    );
  }

  if (event.kind === "HALF_INNING" && transitionBackgroundSrc) {
    return (
      <BaseballHalfInningSequenceV2
        game={authoritativeGame}
        eventProgress={eventProgress}
        backgroundSrc={transitionBackgroundSrc}
        onSkip={event.skippable ? onSkip : undefined}
      />
    );
  }

  const scoring = official
    ? createBaseballScoringPresentationV2(authoritativeGame, official)
    : null;

  if (scoring?.isHomeRun) {
    return (
      <BaseballHomeRunSequenceV2
        event={event}
        model={scoring}
        eventProgress={eventProgress}
        imageSrc={homeRunImageSrc}
        onSkipSequence={onSkipSequence}
      />
    );
  }

  if (scoring && SCORING_SEQUENCE_KINDS.has(event.kind)) {
    return (
      <BaseballScoringSequenceV2
        event={event}
        model={scoring}
        eventProgress={eventProgress}
      />
    );
  }

  if (event.kind === "CONTACT" || event.kind === "BALL_FLIGHT") return null;
  const copy = createBaseballVisualEventCopyV2(event, official, game);

  if (LIVE_CALLOUT_KINDS.has(event.kind)) {
    return (
      <aside
        className={`bbv2-play-callout is-${copy.tone}`}
        data-event-kind={event.kind}
        role="status"
        aria-live={event.kind === "RUN_SCORE" ? "assertive" : "polite"}
      >
        <small>{event.kind.replaceAll("_", " ")}</small>
        <strong>{copy.title}</strong>
        <span>{copy.detail}</span>
        {event.skippable ? (
          <button
            type="button"
            aria-keyshortcuts="Space"
            onClick={onSkip}
          >
            <kbd>SPACE</kbd>
            장면 건너뛰기
          </button>
        ) : null}
      </aside>
    );
  }

  const showHomeRunImage = event.kind === "PLAY_RESULT"
    && isBaseballHomeRunResultV2(official?.code)
    && homeRunImageSrc;
  return (
    <BaseballEventOverlayV2
      resultCode={event.kind === "PLAY_RESULT" ? official?.code : undefined}
      kicker={event.kind.replaceAll("_", " ")}
      title={copy.title}
      detail={copy.detail}
      tone={copy.tone}
      imageSrc={showHomeRunImage || undefined}
      imageAlt={showHomeRunImage ? "홈런 스윙 장면" : undefined}
      primaryLabel={event.skippable ? "장면 건너뛰기" : undefined}
      primaryEnabled={event.skippable}
      onPrimaryAction={event.skippable ? onSkip : undefined}
    />
  );
}

export default BaseballVisualEventOverlayV2;
