import {
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";

import type { BaseballAnimationProgressSource } from "../../../../utils/games/baseball/animationProgress.ts";
import type {
  BaseballCatcherMittPresentationV2,
  BaseballDefenseThrowPresentationV2,
  BaseballFielderPresentationV2,
  BaseballPresentationPointV2,
  BaseballRunnerPresentationV2,
} from "./BaseballPlayPresentationV2.ts";
import type { BaseballBallPresentationV2 } from "./BaseballStageV2.tsx";

type PointStyle = CSSProperties & {
  "--bbv2-point-x": string;
  "--bbv2-point-y": string;
  "--bbv2-point-scale": number;
  "--bbv2-point-opacity": number;
  "--bbv2-point-rotation": string;
};

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

function applyPointStyle(
  element: HTMLElement,
  point: BaseballPresentationPointV2,
) {
  element.style.setProperty("--bbv2-point-x", `${point.x}%`);
  element.style.setProperty("--bbv2-point-y", `${point.y}%`);
  element.style.setProperty("--bbv2-point-scale", `${point.scale ?? 1}`);
  element.style.setProperty("--bbv2-point-opacity", `${point.opacity ?? 1}`);
  element.style.setProperty("--bbv2-point-rotation", `${point.rotationDeg ?? 0}deg`);
}

export interface AnimatedBaseballFlightLayerV2Props {
  animationKey: string;
  progressSource: BaseballAnimationProgressSource;
  createPresentation: (
    progress: number,
  ) => BaseballBallPresentationV2 | BaseballDefenseThrowPresentationV2 | null;
  ballSrc: string;
  variant: "pitch" | "batted" | "throw";
}

export function AnimatedBaseballFlightLayerV2({
  animationKey,
  progressSource,
  createPresentation,
  ballSrc,
  variant,
}: AnimatedBaseballFlightLayerV2Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const seed = useMemo(() => {
    for (const progress of [progressSource.getProgress(), 0.75, 0.5, 1, 0]) {
      const presentation = createPresentation(progress);
      if (presentation) return presentation;
    }
    return null;
  }, [createPresentation, progressSource]);

  useLayoutEffect(() => {
    const renderFrame = (progress: number) => {
      const layer = layerRef.current;
      const presentation = createPresentation(progress);
      if (!layer) return;
      layer.hidden = !presentation;
      if (!presentation) return;
      if (bodyRef.current) applyPointStyle(bodyRef.current, presentation.body);
      for (let index = 0; index < trailRefs.current.length; index += 1) {
        const trailElement = trailRefs.current[index];
        const trailPoint = presentation.trail[index];
        if (!trailElement) continue;
        trailElement.hidden = !trailPoint;
        if (trailPoint) applyPointStyle(trailElement, trailPoint);
      }
      if ("targetBase" in presentation) {
        layer.dataset.throwTargetBase = `${presentation.targetBase}`;
      } else {
        delete layer.dataset.throwTargetBase;
      }
    };
    renderFrame(progressSource.getProgress());
    return progressSource.subscribe(renderFrame);
  }, [createPresentation, progressSource]);

  if (!seed) return null;
  const pitchType = "pitchType" in seed ? seed.pitchType : undefined;
  const pitchClass = pitchType ? `bbv2-ball--${pitchType}` : undefined;
  const throwTargetBase = "targetBase" in seed ? seed.targetBase : undefined;

  return (
    <div
      ref={layerRef}
      className={joinClassNames("bbv2-flight-layer", `bbv2-flight-layer--${variant}`)}
      data-animation-key={animationKey}
      data-throw-target-base={throwTargetBase}
      aria-hidden="true"
    >
      <div className="bbv2-ball-trails" data-trail-samples={seed.trail.length}>
        {seed.trail.map((point, index) => (
          <span
            ref={(element) => { trailRefs.current[index] = element; }}
            className={joinClassNames("bbv2-ball-trail-point", pitchClass)}
            style={pointStyle(point)}
            key={`animated-trail-${index}`}
          >
            <img src={ballSrc} alt="" draggable={false} />
          </span>
        ))}
      </div>
      <span
        ref={bodyRef}
        className={joinClassNames("bbv2-ball-body", `bbv2-ball-body--${variant}`, pitchClass)}
        style={pointStyle(seed.body)}
      >
        <img src={ballSrc} alt="" draggable={false} />
      </span>
    </div>
  );
}

function presentationSeeds<T>(
  createPresentations: (progress: number) => readonly T[],
  identity: (presentation: T) => string,
) {
  const seeds = new Map<string, T>();
  for (const progress of [0, 0.5, 0.75, 1]) {
    for (const presentation of createPresentations(progress)) {
      const key = identity(presentation);
      if (!seeds.has(key)) seeds.set(key, presentation);
    }
  }
  return [...seeds.values()];
}

export function AnimatedRunnerLayerV2({
  progressSource,
  createPresentations,
}: {
  progressSource: BaseballAnimationProgressSource;
  createPresentations: (progress: number) => readonly BaseballRunnerPresentationV2[];
}) {
  const elementRefs = useRef(new Map<string, HTMLSpanElement>());
  const labelRefs = useRef(new Map<string, HTMLElement>());
  const seeds = useMemo(
    () => presentationSeeds(createPresentations, (runner) => runner.playerId),
    [createPresentations],
  );

  useLayoutEffect(() => {
    const renderFrame = (progress: number) => {
      const current = new Map(
        createPresentations(progress).map((runner) => [runner.playerId, runner]),
      );
      for (const [playerId, element] of elementRefs.current) {
        const runner = current.get(playerId);
        element.hidden = !runner;
        if (!runner) continue;
        applyPointStyle(element, runner.point);
        element.dataset.status = runner.status ?? "WAITING";
        element.dataset.facing = runner.facing ?? "RIGHT";
        const label = labelRefs.current.get(playerId);
        if (label) label.textContent = runner.baseLabel ?? runner.name;
      }
    };
    renderFrame(progressSource.getProgress());
    return progressSource.subscribe(renderFrame);
  }, [createPresentations, progressSource]);

  return (
    <div className="bbv2-stage__runners" aria-hidden="true">
      {seeds.map((runner) => (
        <span
          ref={(element) => {
            if (element) elementRefs.current.set(runner.playerId, element);
            else elementRefs.current.delete(runner.playerId);
          }}
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
          <em
            ref={(element) => {
              if (element) labelRefs.current.set(runner.playerId, element);
              else labelRefs.current.delete(runner.playerId);
            }}
          >
            {runner.baseLabel ?? runner.name}
          </em>
        </span>
      ))}
    </div>
  );
}

export function AnimatedFielderLayerV2({
  progressSource,
  createPresentations,
}: {
  progressSource: BaseballAnimationProgressSource;
  createPresentations: (progress: number) => readonly BaseballFielderPresentationV2[];
}) {
  const elementRefs = useRef(new Map<string, HTMLSpanElement>());
  const resultRefs = useRef(new Map<string, HTMLElement>());
  const seeds = useMemo(
    () => presentationSeeds(createPresentations, (fielder) => fielder.playerId),
    [createPresentations],
  );

  useLayoutEffect(() => {
    const renderFrame = (progress: number) => {
      const current = new Map(
        createPresentations(progress).map((fielder) => [fielder.playerId, fielder]),
      );
      for (const [playerId, element] of elementRefs.current) {
        const fielder = current.get(playerId);
        element.hidden = !fielder;
        if (!fielder) continue;
        applyPointStyle(element, fielder.point);
        element.dataset.phase = fielder.phase;
        element.dataset.facing = fielder.facing ?? "RIGHT";
        const result = resultRefs.current.get(playerId);
        if (result) result.textContent = fielder.resultLabel;
      }
    };
    renderFrame(progressSource.getProgress());
    return progressSource.subscribe(renderFrame);
  }, [createPresentations, progressSource]);

  return (
    <div className="bbv2-stage__fielders" aria-hidden="true">
      {seeds.map((fielder) => (
        <span
          ref={(element) => {
            if (element) elementRefs.current.set(fielder.playerId, element);
            else elementRefs.current.delete(fielder.playerId);
          }}
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
            <small
              ref={(element) => {
                if (element) resultRefs.current.set(fielder.playerId, element);
                else resultRefs.current.delete(fielder.playerId);
              }}
            >
              {fielder.resultLabel}
            </small>
          </em>
        </span>
      ))}
    </div>
  );
}

export function AnimatedCatcherMittLayerV2({
  progressSource,
  createPresentation,
  source,
}: {
  progressSource: BaseballAnimationProgressSource;
  createPresentation: (progress: number) => BaseballCatcherMittPresentationV2 | null;
  source: string;
}) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const seed = useMemo(
    () => createPresentation(progressSource.getProgress()) ?? createPresentation(0.86),
    [createPresentation, progressSource],
  );

  useLayoutEffect(() => {
    const renderFrame = (progress: number) => {
      const element = elementRef.current;
      if (!element) return;
      const presentation = createPresentation(progress);
      element.hidden = !presentation || presentation.visible === false;
      if (!presentation) return;
      applyPointStyle(element, presentation.point);
      element.dataset.caught = presentation.caught ? "true" : "false";
    };
    renderFrame(progressSource.getProgress());
    return progressSource.subscribe(renderFrame);
  }, [createPresentation, progressSource]);

  if (!seed) return null;
  return (
    <span
      ref={elementRef}
      className="bbv2-catcher-mitt"
      style={pointStyle(seed.point)}
      data-caught={seed.caught ? "true" : "false"}
      aria-hidden="true"
    >
      <img src={source} alt="" draggable={false} />
    </span>
  );
}
