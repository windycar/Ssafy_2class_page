export type BaseballAssetLoadStatus = "loaded" | "failed" | "unsupported";

export interface BaseballAssetLoadResult {
  source: string;
  status: BaseballAssetLoadStatus;
  decoded: boolean;
}

export interface BaseballAssetLoadProgress {
  total: number;
  idle: number;
  pending: number;
  loaded: number;
  failed: number;
  unsupported: number;
  decoded: number;
}

export interface BaseballImageResource {
  decoding?: string;
  src: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  decode?: () => Promise<void>;
}

export type BaseballImageFactory = () => BaseballImageResource | null;

export interface BaseballImageAssetPreloader {
  load: (source: string) => Promise<BaseballAssetLoadResult>;
  preload: (sources: readonly string[]) => Promise<BaseballAssetLoadProgress>;
  getProgress: (sources: readonly string[]) => BaseballAssetLoadProgress;
}

function uniqueSources(sources: readonly string[]) {
  return [...new Set(sources.map((source) => source.trim()).filter(Boolean))];
}

function createBrowserImage(): BaseballImageResource | null {
  if (typeof Image === "undefined") return null;
  return new Image() as unknown as BaseballImageResource;
}

export function createBaseballImageAssetPreloader(
  createImage: BaseballImageFactory = createBrowserImage,
): BaseballImageAssetPreloader {
  const requests = new Map<string, Promise<BaseballAssetLoadResult>>();
  const results = new Map<string, BaseballAssetLoadResult>();

  const load = (source: string): Promise<BaseballAssetLoadResult> => {
    const normalizedSource = source.trim();
    const cachedRequest = requests.get(normalizedSource);
    if (cachedRequest) return cachedRequest;

    const request = new Promise<BaseballAssetLoadResult>((resolve) => {
      const settle = (result: BaseballAssetLoadResult) => {
        results.set(normalizedSource, result);
        resolve(result);
      };

      if (!normalizedSource) {
        settle({ source: normalizedSource, status: "failed", decoded: false });
        return;
      }

      let image: BaseballImageResource | null;
      try {
        image = createImage();
      } catch {
        settle({ source: normalizedSource, status: "failed", decoded: false });
        return;
      }

      if (!image) {
        settle({ source: normalizedSource, status: "unsupported", decoded: false });
        return;
      }

      let settled = false;
      const settleOnce = (result: BaseballAssetLoadResult) => {
        if (settled) return;
        settled = true;
        image!.onload = null;
        image!.onerror = null;
        settle(result);
      };

      image.decoding = "async";
      image.onerror = () => {
        settleOnce({ source: normalizedSource, status: "failed", decoded: false });
      };
      image.onload = () => {
        if (typeof image!.decode !== "function") {
          settleOnce({ source: normalizedSource, status: "loaded", decoded: false });
          return;
        }

        void image!.decode!().then(
          () => settleOnce({ source: normalizedSource, status: "loaded", decoded: true }),
          // An onload image remains displayable even when an optional decode() hint fails.
          () => settleOnce({ source: normalizedSource, status: "loaded", decoded: false }),
        );
      };

      try {
        image.src = normalizedSource;
      } catch {
        settleOnce({ source: normalizedSource, status: "failed", decoded: false });
      }
    });

    requests.set(normalizedSource, request);
    return request;
  };

  const getProgress = (sources: readonly string[]): BaseballAssetLoadProgress => {
    const unique = uniqueSources(sources);
    const progress: BaseballAssetLoadProgress = {
      total: unique.length,
      idle: 0,
      pending: 0,
      loaded: 0,
      failed: 0,
      unsupported: 0,
      decoded: 0,
    };

    for (const source of unique) {
      const result = results.get(source);
      if (result) {
        progress[result.status] += 1;
        if (result.decoded) progress.decoded += 1;
      } else if (requests.has(source)) {
        progress.pending += 1;
      } else {
        progress.idle += 1;
      }
    }

    return progress;
  };

  const preload = async (sources: readonly string[]) => {
    const unique = uniqueSources(sources);
    await Promise.all(unique.map(load));
    return getProgress(unique);
  };

  return { load, preload, getProgress };
}

// Module scope is intentional: a game remount or the next pitch reuses the same requests.
export const baseballImageAssetPreloader = createBaseballImageAssetPreloader();
