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

export interface BaseballIdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

export interface BaseballIdleTaskScheduler {
  schedule: (callback: (deadline: BaseballIdleDeadline) => void) => unknown;
  cancel: (handle: unknown) => void;
}

export interface BaseballIdleSchedulerHost {
  requestIdleCallback?: (
    callback: (deadline: BaseballIdleDeadline) => void,
    options?: { timeout: number },
  ) => unknown;
  cancelIdleCallback?: (handle: unknown) => void;
  setTimeout: (callback: () => void, delayMs: number) => unknown;
  clearTimeout: (handle: unknown) => void;
}

export interface BaseballLazyAssetPreloadController {
  cancel: () => void;
  finished: Promise<"completed" | "cancelled">;
}

export interface BaseballLazyAssetPreloadOptions {
  sources: readonly string[];
  load: (source: string) => Promise<unknown>;
  scheduler: BaseballIdleTaskScheduler;
}

function uniqueSources(sources: readonly string[]) {
  return [...new Set(sources.map((source) => source.trim()).filter(Boolean))];
}

function globalIdleSchedulerHost(): BaseballIdleSchedulerHost {
  const host = globalThis as typeof globalThis & {
    requestIdleCallback?: BaseballIdleSchedulerHost["requestIdleCallback"];
    cancelIdleCallback?: BaseballIdleSchedulerHost["cancelIdleCallback"];
  };

  return {
    requestIdleCallback: host.requestIdleCallback?.bind(host),
    cancelIdleCallback: host.cancelIdleCallback?.bind(host),
    setTimeout: (callback, delayMs) => globalThis.setTimeout(callback, delayMs),
    clearTimeout: (handle) => globalThis.clearTimeout(handle as ReturnType<typeof setTimeout>),
  };
}

/**
 * Uses native idle callbacks when available and a short timer otherwise.
 * The fallback deadline deliberately reports no spare budget: callers should
 * start one bounded unit of work and yield again instead of draining a queue.
 */
export function createBaseballIdleTaskScheduler(
  host: BaseballIdleSchedulerHost = globalIdleSchedulerHost(),
): BaseballIdleTaskScheduler {
  if (host.requestIdleCallback && host.cancelIdleCallback) {
    return {
      schedule: (callback) => host.requestIdleCallback!(callback, { timeout: 1_000 }),
      cancel: (handle) => host.cancelIdleCallback!(handle),
    };
  }

  return {
    schedule: (callback) => host.setTimeout(
      () => callback({ didTimeout: true, timeRemaining: () => 0 }),
      50,
    ),
    cancel: (handle) => host.clearTimeout(handle),
  };
}

/**
 * Starts at most one image request per idle turn and waits for it to settle
 * before scheduling the next. A failed decode/load is isolated to that source.
 */
export function startBaseballLazyAssetPreload({
  sources,
  load,
  scheduler,
}: BaseballLazyAssetPreloadOptions): BaseballLazyAssetPreloadController {
  const queue = uniqueSources(sources);
  let queueIndex = 0;
  let cancelled = false;
  let pendingHandle: unknown;
  let finish: (outcome: "completed" | "cancelled") => void = () => undefined;
  const finished = new Promise<"completed" | "cancelled">((resolve) => {
    finish = resolve;
  });

  const scheduleNext = () => {
    if (cancelled) return;
    if (queueIndex >= queue.length) {
      finish("completed");
      return;
    }

    pendingHandle = scheduler.schedule(() => {
      pendingHandle = undefined;
      if (cancelled) return;

      const source = queue[queueIndex];
      queueIndex += 1;
      void Promise.resolve()
        .then(() => load(source!))
        // A single broken optional asset must not block later lazy assets.
        .catch(() => undefined)
        .then(scheduleNext);
    });
  };

  scheduleNext();

  return {
    cancel: () => {
      if (cancelled) return;
      cancelled = true;
      if (pendingHandle !== undefined) scheduler.cancel(pendingHandle);
      pendingHandle = undefined;
      finish("cancelled");
    },
    finished,
  };
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
