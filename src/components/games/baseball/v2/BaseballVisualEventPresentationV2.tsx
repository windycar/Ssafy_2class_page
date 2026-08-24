import type {
  BaseballGameState,
  OfficialPlayResult,
  VisualEvent,
} from "../../../../utils/games/baseball/types.ts";
import { BaseballEventOverlayV2 } from "./BaseballOverlaysV2.tsx";
import {
  createBaseballVisualEventCopyV2,
  isBaseballHomeRunResultV2,
} from "./BaseballPlayPresentationV2.ts";

export interface BaseballVisualEventOverlayV2Props {
  event: VisualEvent;
  official: OfficialPlayResult | null;
  game: BaseballGameState;
  onSkip: () => void;
  homeRunImageSrc?: string;
}

const LIVE_CALLOUT_KINDS = new Set(["FIELD_RESULT", "RUNNER_ADVANCE", "RUN_SCORE"]);

/**
 * Shared event feedback for Solo and Online. Motion-heavy fielding/running events
 * use a compact callout so the animated play remains visible; terminal rulings
 * retain the centered result overlay.
 */
export function BaseballVisualEventOverlayV2({
  event,
  official,
  game,
  onSkip,
  homeRunImageSrc,
}: BaseballVisualEventOverlayV2Props) {
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
