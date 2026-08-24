import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

import type {
  BaseballCameraMode,
  BaseballPitchType,
  Vec2,
} from "../../../../utils/games/baseballEngine";
import type {
  BaseballDefenseThrowPresentationV2,
  BaseballFielderPresentationV2,
  BaseballPresentationPointV2,
  BaseballRunnerPresentationV2,
} from "./BaseballPlayPresentationV2.ts";

export type {
  BaseballFielderPhaseV2,
  BaseballFielderPresentationV2,
  BaseballPresentationPointV2,
  BaseballRunnerPresentationV2,
} from "./BaseballPlayPresentationV2.ts";

export type BaseballTrailPointsV2 = readonly [
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
  BaseballPresentationPointV2,
];

export interface BaseballBallPresentationV2 {
  body: BaseballPresentationPointV2;
  trail: BaseballTrailPointsV2;
  pitchType?: BaseballPitchType;
  visible?: boolean;
}

export interface BaseballStageAssetsV2 {
  backgroundSrc: string;
  backgroundAlt?: string;
  ballSrc: string;
  batterSrc?: string;
  pitcherSrc?: string;
  catcherSrc?: string;
  homePlateSrc?: string;
  batterSprite?: BaseballCharacterSpriteV2;
  pitcherSprite?: BaseballCharacterSpriteV2;
  catcherSprite?: BaseballCharacterSpriteV2;
}

export interface BaseballCharacterSpriteV2 {
  src: string;
  frameCount: number;
  frameIndex?: number;
  motion?: "IDLE" | "SWING" | "PITCH";
  animationKey?: string;
}

export interface BaseballStageV2Props {
  assets: BaseballStageAssetsV2;
  cameraMode: BaseballCameraMode;
  perspective?: "BATTING" | "PITCHING" | "FIELD";
  pitchBall?: BaseballBallPresentationV2 | null;
  battedBall?: BaseballBallPresentationV2 | null;
  defenseThrow?: BaseballDefenseThrowPresentationV2 | null;
  fielders?: readonly BaseballFielderPresentationV2[];
  runners?: readonly BaseballRunnerPresentationV2[];
  showStrikeZone?: boolean;
  strikeZoneTarget?: Vec2 | null;
  hud?: ReactNode;
  overlay?: ReactNode;
  effects?: ReactNode;
  aimEnabled?: boolean;
  onAimChange?: (point: Vec2) => void;
  className?: string;
  ariaLabel?: string;
}

type PointStyle = CSSProperties & {
  "--bbv2-point-x": string;
  "--bbv2-point-y": string;
  "--bbv2-point-scale": number;
  "--bbv2-point-opacity": number;
  "--bbv2-point-rotation": string;
};

type StrikeTargetStyle = CSSProperties & {
  "--bbv2-zone-x": string;
  "--bbv2-zone-y": string;
};

type CharacterSpriteStyle = CSSProperties & {
  "--bbv2-sprite-count": number;
  "--bbv2-sprite-index": number;
};

const EMPTY_RUNNERS: readonly BaseballRunnerPresentationV2[] = [];
const EMPTY_FIELDERS: readonly BaseballFielderPresentationV2[] = [];
export const BASEBALL_TRAIL_SAMPLE_COUNT = 10;

function joinClassNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

function pointStyle(point: BaseballPresentationPointV2): PointStyle {
  return {
    "--bbv2-point-x": `${point.x}%`,
    "--bbv2-point-y": `${point.y}%`,
    "--bbv2-point-scale": point.scale ?? 1,
    "--bbv2-point-opacity": point.opacity ?? 1,
    "--bbv2-point-rotation": `${point.rotationDeg ?? 0}deg`,
  };
}

function strikeTargetStyle(point: Vec2): StrikeTargetStyle {
  return {
    "--bbv2-zone-x": `${Math.min(1, Math.max(0, point.x)) * 100}%`,
    "--bbv2-zone-y": `${Math.min(1, Math.max(0, point.y)) * 100}%`,
  };
}

function CharacterSpriteV2({
  sprite,
  className,
}: {
  sprite: BaseballCharacterSpriteV2;
  className: string;
}) {
  const frameCount = Math.max(1, Math.floor(sprite.frameCount));
  const frameIndex = Math.min(
    frameCount - 1,
    Math.max(0, Math.floor(sprite.frameIndex ?? 0)),
  );
  const style: CharacterSpriteStyle = {
    backgroundImage: `url(${JSON.stringify(sprite.src)})`,
    backgroundSize: `${frameCount * 100}% 100%`,
    backgroundPosition: frameCount === 1
      ? "center"
      : `${(frameIndex / (frameCount - 1)) * 100}% center`,
    "--bbv2-sprite-count": frameCount,
    "--bbv2-sprite-index": frameIndex,
  };

  return (
    <span
      className={joinClassNames("bbv2-character", "bbv2-character-sprite", className)}
      data-motion={sprite.motion ?? "IDLE"}
      style={style}
      key={`${sprite.src}:${sprite.animationKey ?? "idle"}`}
    />
  );
}

function CharacterLayerV2({ assets }: { assets: BaseballStageAssetsV2 }) {
  return (
    <div className="bbv2-stage__characters" aria-hidden="true">
      {assets.pitcherSprite ? (
        <CharacterSpriteV2 sprite={assets.pitcherSprite} className="bbv2-character--pitcher" />
      ) : assets.pitcherSrc ? (
        <img className="bbv2-character bbv2-character--pitcher" src={assets.pitcherSrc} alt="" draggable={false} />
      ) : null}
      {assets.catcherSprite ? (
        <CharacterSpriteV2 sprite={assets.catcherSprite} className="bbv2-character--catcher" />
      ) : assets.catcherSrc ? (
        <img className="bbv2-character bbv2-character--catcher" src={assets.catcherSrc} alt="" draggable={false} />
      ) : null}
      {assets.batterSprite ? (
        <CharacterSpriteV2 sprite={assets.batterSprite} className="bbv2-character--batter" />
      ) : assets.batterSrc ? (
        <img className="bbv2-character bbv2-character--batter" src={assets.batterSrc} alt="" draggable={false} />
      ) : null}
    </div>
  );
}

function BaseballFlightLayerV2({
  presentation,
  ballSrc,
  variant,
}: {
  presentation: BaseballBallPresentationV2 | BaseballDefenseThrowPresentationV2 | null | undefined;
  ballSrc: string;
  variant: "pitch" | "batted" | "throw";
}) {
  if (!presentation || ("visible" in presentation && presentation.visible === false)) return null;

  const pitchType = "pitchType" in presentation ? presentation.pitchType : undefined;
  const pitchClass = pitchType
    ? `bbv2-ball--${pitchType}`
    : undefined;
  const throwTargetBase = "targetBase" in presentation ? presentation.targetBase : undefined;

  return (
    <div
      className={joinClassNames(
        "bbv2-flight-layer",
        `bbv2-flight-layer--${variant}`,
      )}
      data-throw-target-base={throwTargetBase}
      aria-hidden="true"
    >
      <div className="bbv2-ball-trails" data-trail-samples={BASEBALL_TRAIL_SAMPLE_COUNT}>
        {presentation.trail.map((point, index) => (
          <span
            className={joinClassNames("bbv2-ball-trail-point", pitchClass)}
            style={pointStyle(point)}
            key={`trail-${index}`}
          >
            <img src={ballSrc} alt="" draggable={false} />
          </span>
        ))}
      </div>
      <span
        className={joinClassNames("bbv2-ball-body", `bbv2-ball-body--${variant}`, pitchClass)}
        style={pointStyle(presentation.body)}
      >
        <img src={ballSrc} alt="" draggable={false} />
      </span>
    </div>
  );
}

function RunnerLayerV2({ runners }: { runners: readonly BaseballRunnerPresentationV2[] }) {
  return (
    <div className="bbv2-stage__runners" aria-hidden="true">
      {runners.map((runner) => (
        <span
          className="bbv2-runner-sprite"
          style={pointStyle(runner.point)}
          data-player-id={runner.playerId}
          data-status={runner.status ?? "WAITING"}
          data-facing={runner.facing ?? "RIGHT"}
          key={runner.playerId}
        >
          {runner.assetSrc ? (
            <img src={runner.assetSrc} alt="" draggable={false} />
          ) : (
            <i>{runner.name.slice(0, 1)}</i>
          )}
          <em>{runner.baseLabel ?? runner.name}</em>
        </span>
      ))}
    </div>
  );
}

function FielderLayerV2({
  fielders,
}: {
  fielders: readonly BaseballFielderPresentationV2[];
}) {
  return (
    <div className="bbv2-stage__fielders" aria-hidden="true">
      {fielders.map((fielder) => (
        <span
          className="bbv2-fielder-sprite"
          style={pointStyle(fielder.point)}
          data-phase={fielder.phase}
          data-player-id={fielder.playerId}
          data-facing={fielder.facing ?? "RIGHT"}
          key={fielder.playerId}
        >
          <span className="bbv2-fielder-sprite__body">
            {fielder.assetSrc ? (
              <img src={fielder.assetSrc} alt="" draggable={false} />
            ) : (
              <i>{fielder.positionLabel}</i>
            )}
          </span>
          <em>
            <strong>{fielder.name}</strong>
            <small>{fielder.resultLabel}</small>
          </em>
        </span>
      ))}
    </div>
  );
}

function HomePlateAndZoneV2({
  homePlateSrc,
  showStrikeZone,
  target,
  aimEnabled,
  onAimChange,
}: {
  homePlateSrc?: string;
  showStrikeZone: boolean;
  target?: Vec2 | null;
  aimEnabled: boolean;
  onAimChange?: (point: Vec2) => void;
}) {
  const updateAim = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!aimEnabled || !onAimChange) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    onAimChange({
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
    });
  };

  return (
    <div className="bbv2-plate-area" aria-label="홈플레이트와 스트라이크존">
      {showStrikeZone ? (
        <div
          className={joinClassNames("bbv2-strike-zone", aimEnabled ? "is-interactive" : undefined)}
          aria-label={aimEnabled ? "스트라이크존 조준" : undefined}
          aria-hidden={aimEnabled ? undefined : true}
          onPointerDown={(event) => {
            if (!aimEnabled) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            updateAim(event);
          }}
          onPointerMove={(event) => {
            if (!aimEnabled) return;
            if (event.pointerType === "mouse" || event.buttons > 0) updateAim(event);
          }}
        >
          {Array.from({ length: 9 }, (_, index) => (
            <span key={`zone-cell-${index}`} />
          ))}
          {target ? (
            <i className="bbv2-strike-zone__target" style={strikeTargetStyle(target)} />
          ) : null}
        </div>
      ) : null}
      {showStrikeZone ? (
        homePlateSrc ? (
          <img className="bbv2-home-plate" src={homePlateSrc} alt="홈플레이트" draggable={false} />
        ) : (
          <span className="bbv2-home-plate bbv2-home-plate--css" aria-label="홈플레이트" />
        )
      ) : null}
    </div>
  );
}

export function BaseballStageV2({
  assets,
  cameraMode,
  perspective = "BATTING",
  pitchBall,
  battedBall,
  defenseThrow,
  fielders = EMPTY_FIELDERS,
  runners = EMPTY_RUNNERS,
  showStrikeZone = true,
  strikeZoneTarget,
  hud,
  overlay,
  effects,
  aimEnabled = false,
  onAimChange,
  className,
  ariaLabel = "야구 경기장",
}: BaseballStageV2Props) {
  const activeFlight = defenseThrow
    ? { presentation: defenseThrow, variant: "throw" as const }
    : battedBall && battedBall.visible !== false
      ? { presentation: battedBall, variant: "batted" as const }
      : pitchBall && pitchBall.visible !== false
        ? { presentation: pitchBall, variant: "pitch" as const }
        : null;

  return (
    <section
      className={joinClassNames("bbv2-stage", className)}
      data-camera-mode={cameraMode}
      data-perspective={perspective}
      aria-label={ariaLabel}
    >
      <img
        className="bbv2-stage__background"
        src={assets.backgroundSrc}
        alt={assets.backgroundAlt ?? ""}
        draggable={false}
      />
      <div className="bbv2-stage__shade" aria-hidden="true" />
      <CharacterLayerV2 assets={assets} />
      <FielderLayerV2 fielders={fielders} />
      <RunnerLayerV2 runners={runners} />
      <HomePlateAndZoneV2
        homePlateSrc={assets.homePlateSrc}
        showStrikeZone={showStrikeZone}
        target={strikeZoneTarget}
        aimEnabled={aimEnabled}
        onAimChange={onAimChange}
      />
      {activeFlight ? (
        <BaseballFlightLayerV2
          presentation={activeFlight.presentation}
          ballSrc={assets.ballSrc}
          variant={activeFlight.variant}
        />
      ) : null}
      <div className="bbv2-stage__effects" aria-hidden={effects ? undefined : "true"}>{effects}</div>
      <div className="bbv2-stage__overlay-slot">{overlay}</div>
      <div className="bbv2-stage__hud-slot">{hud}</div>
    </section>
  );
}
