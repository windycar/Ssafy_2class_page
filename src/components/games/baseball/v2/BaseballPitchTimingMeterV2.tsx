import { useLayoutEffect, useRef } from "react";

import {
  baseballPitchQualityAtMeterProgress,
  type BaseballAnimationProgressSource,
} from "../../../../utils/games/baseball/animationProgress.ts";

export interface BaseballPitchTimingMeterV2Props {
  progressSource: BaseballAnimationProgressSource;
}

/** The marker and label are updated directly; no GameView render occurs per frame. */
export function BaseballPitchTimingMeterV2({
  progressSource,
}: BaseballPitchTimingMeterV2Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLElement>(null);
  const qualityRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const renderFrame = (progress: number) => {
      if (markerRef.current) markerRef.current.style.left = `${progress * 100}%`;
      const quality = baseballPitchQualityAtMeterProgress(progress);
      if (qualityRef.current) qualityRef.current.textContent = quality;
      if (rootRef.current) rootRef.current.dataset.quality = quality;
    };
    renderFrame(progressSource.getProgress());
    return progressSource.subscribe(renderFrame);
  }, [progressSource]);

  return (
    <div
      ref={rootRef}
      className="bbv2-pitch-meter"
      data-quality={baseballPitchQualityAtMeterProgress(progressSource.getProgress())}
      aria-label="투구 타이밍 게이지"
    >
      <div className="bbv2-pitch-meter__heading">
        <span>PITCH TIMING</span>
        <strong ref={qualityRef} aria-hidden="true">
          {baseballPitchQualityAtMeterProgress(progressSource.getProgress())}
        </strong>
      </div>
      <div className="bbv2-pitch-meter__track" aria-hidden="true">
        <i
          ref={markerRef}
          style={{ left: `${progressSource.getProgress() * 100}%` }}
        />
      </div>
    </div>
  );
}

export default BaseballPitchTimingMeterV2;
