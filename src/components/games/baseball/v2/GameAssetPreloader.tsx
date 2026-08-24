import { useEffect, useState, type ReactNode } from "react";

import {
  BASEBALL_V2_CRITICAL_ASSET_SOURCES,
  BASEBALL_V2_LAZY_ASSET_SOURCES,
} from "../../../../config/baseballV2Assets";
import { baseballImageAssetPreloader } from "../../../../utils/games/baseball/assetPreloader";

const CRITICAL_ASSET_TIMEOUT_MS = 5_000;
const LAZY_PRELOAD_DELAY_MS = 150;
let hasReleasedCriticalGate = false;

interface GameAssetPreloaderProps {
  children: ReactNode;
}

function criticalAssetsAlreadySettled() {
  if (hasReleasedCriticalGate) return true;
  const progress = baseballImageAssetPreloader.getProgress(BASEBALL_V2_CRITICAL_ASSET_SOURCES);
  return progress.total > 0 && progress.idle === 0 && progress.pending === 0;
}

export function GameAssetPreloader({ children }: GameAssetPreloaderProps) {
  const [isReady, setIsReady] = useState(criticalAssetsAlreadySettled);

  useEffect(() => {
    if (isReady) return;

    let active = true;
    let finished = false;
    const revealGame = () => {
      if (!active || finished) return;
      finished = true;
      hasReleasedCriticalGate = true;
      setIsReady(true);
    };

    const timeoutId = window.setTimeout(revealGame, CRITICAL_ASSET_TIMEOUT_MS);
    void baseballImageAssetPreloader.preload(BASEBALL_V2_CRITICAL_ASSET_SOURCES)
      .then(revealGame, revealGame);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      void baseballImageAssetPreloader.preload(BASEBALL_V2_LAZY_ASSET_SOURCES);
    }, LAZY_PRELOAD_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isReady]);

  if (!isReady) {
    return (
      <main
        className="flex min-h-[420px] w-full items-center justify-center bg-[#031426] px-6 text-center text-white"
        aria-busy="true"
        aria-live="polite"
      >
        <div role="status" className="flex max-w-sm flex-col items-center gap-4">
          <span className="text-5xl" aria-hidden="true">⚾</span>
          <div>
            <p className="text-lg font-black">야구장을 불러오는 중입니다</p>
            <p className="mt-1 text-sm text-slate-300">핵심 경기 화면을 준비하고 있습니다.</p>
          </div>
          <div className="h-1.5 w-44 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-400" />
          </div>
        </div>
      </main>
    );
  }

  return children;
}
