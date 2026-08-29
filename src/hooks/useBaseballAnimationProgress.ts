import { useSyncExternalStore } from "react";

import type { BaseballAnimationProgressSource } from "../utils/games/baseball/animationProgress.ts";

/** Subscribe only the small component that actually needs frame progress. */
export function useBaseballAnimationProgress(
  source: BaseballAnimationProgressSource,
) {
  return useSyncExternalStore(
    source.subscribe,
    source.getProgress,
    source.getProgress,
  );
}

export default useBaseballAnimationProgress;
