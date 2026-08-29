import type { PitchQuality } from "./types.ts";

export type BaseballAnimationProgressListener = (progress: number) => void;

export interface BaseballAnimationProgressSource {
  getProgress: () => number;
  subscribe: (listener: BaseballAnimationProgressListener) => () => void;
}

export interface MutableBaseballAnimationProgressSource
  extends BaseballAnimationProgressSource {
  setProgress: (progress: number) => void;
}

export function clampBaseballAnimationProgress(progress: number) {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

export function baseballPitchQualityAtMeterProgress(
  progress: number,
): PitchQuality {
  const centerError = Math.abs(clampBaseballAnimationProgress(progress) - 0.5);
  if (centerError <= 0.045) return "PERFECT";
  if (centerError <= 0.14) return "GOOD";
  if (centerError <= 0.28) return "NORMAL";
  return "MISS";
}

/**
 * A tiny frame signal shared by the pitch, ball-in-play, runner, and overlay
 * layers. RAF callbacks write here instead of setting parent React state, so
 * the game shell, HUD, and controls stay out of the 60 FPS render path.
 */
export function createBaseballAnimationProgressSource(
  initialProgress = 0,
): MutableBaseballAnimationProgressSource {
  let progress = clampBaseballAnimationProgress(initialProgress);
  const listeners = new Set<BaseballAnimationProgressListener>();

  return {
    getProgress: () => progress,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setProgress: (nextProgress) => {
      const next = clampBaseballAnimationProgress(nextProgress);
      if (next === progress) return;
      progress = next;
      for (const listener of listeners) listener(progress);
    },
  };
}
