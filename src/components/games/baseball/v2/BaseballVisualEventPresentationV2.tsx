import { useBaseballAnimationProgress } from "../../../../hooks/useBaseballAnimationProgress.ts";
import type {
  BaseballV2PlayerPortraitSources,
  BaseballV2ResultEffectSources,
} from "../../../../config/baseballV2Assets.ts";
import type { BaseballAnimationProgressSource } from "../../../../utils/games/baseball/animationProgress.ts";
import {
  baseballResultEffectForVisualEvent,
  type BaseballResultEffectKey,
} from "../../../../utils/games/baseball/resultEffect.ts";
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
  crowdImageSrc?: string;
  resultEffectSources?: BaseballV2ResultEffectSources;
  transitionBackgroundSrc?: string;
  playerPortraits?: BaseballV2PlayerPortraitSources;
}

const LIVE_CALLOUT_KINDS = new Set(["FIELD_RESULT", "RUNNER_ADVANCE", "RUN_SCORE"]);
const SCORING_SEQUENCE_KINDS = new Set(["RUN_SCORE", "SCOREBOARD_UPDATE", "PLAY_RESULT"]);
const RESULT_EFFECT_ALT = {
  hit: "안타 타격 연출",
  double: "2루타 주루 연출",
  triple: "3루타 주루 연출",
  homeRun: "홈런 비거리 연출",
  strikeout: "삼진 포구 연출",
  score: "홈플레이트 득점 연출",
  safe: "세이프 판정 연출",
  out: "아웃 판정 연출",
} as const satisfies Readonly<Record<BaseballResultEffectKey, string>>;

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
  crowdImageSrc,
  resultEffectSources,
  transitionBackgroundSrc,
  playerPortraits,
}: BaseballVisualEventOverlayV2Props) {
  // Only this compact overlay subscribes to frame progress. The parent game
  // shell and HUD remain untouched while phase-specific copy advances.
  const eventProgress = useBaseballAnimationProgress(eventProgressSource);
  if (event.kind === "NEXT_BATTER") {
    return (
      <BaseballPlayerIntroSequenceV2
        game={game}
        eventProgress={eventProgress}
        playerPortraits={playerPortraits}
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
  const effectKey = baseballResultEffectForVisualEvent(event.kind, official);
  const effectSrc = effectKey ? resultEffectSources?.[effectKey] : undefined;
  const effectAlt = effectKey ? RESULT_EFFECT_ALT[effectKey] : undefined;

  if (scoring?.isHomeRun) {
    return (
      <BaseballHomeRunSequenceV2
        event={event}
        model={scoring}
        eventProgress={eventProgress}
        imageSrc={resultEffectSources?.homeRun ?? homeRunImageSrc}
        crowdImageSrc={crowdImageSrc}
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
        imageSrc={effectSrc}
        imageAlt={effectAlt}
        crowdImageSrc={crowdImageSrc}
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
        {effectSrc ? (
          <img
            className="bbv2-play-callout__effect"
            src={effectSrc}
            alt={effectAlt}
            draggable={false}
          />
        ) : null}
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

  return (
    <BaseballEventOverlayV2
      resultCode={event.kind === "PLAY_RESULT" ? official?.code : undefined}
      kicker={event.kind.replaceAll("_", " ")}
      title={copy.title}
      detail={copy.detail}
      tone={copy.tone}
      imageSrc={effectSrc}
      imageAlt={effectAlt}
      primaryLabel={event.skippable ? "장면 건너뛰기" : undefined}
      primaryEnabled={event.skippable}
      onPrimaryAction={event.skippable ? onSkip : undefined}
    />
  );
}

export default BaseballVisualEventOverlayV2;
