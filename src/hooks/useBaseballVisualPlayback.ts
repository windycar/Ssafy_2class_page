import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cloneGameState } from "../utils/games/baseball/gameState.ts";
import {
  createBaseballAnimationProgressSource,
  type BaseballAnimationProgressSource,
} from "../utils/games/baseball/animationProgress.ts";
import type {
  BaseballGameState,
  VisualEvent,
  VisualEventKind,
} from "../utils/games/baseball/types.ts";

export interface BaseballVisualPlaybackState {
  playId: string | null;
  events: readonly VisualEvent[];
  eventIndex: number;
  eventProgress: number;
  active: boolean;
  sourceGame: BaseballGameState | null;
  startedPlayIds: ReadonlySet<string>;
}

export interface BaseballVisualPlaybackStartRequest {
  playId: string;
  events: readonly VisualEvent[];
  sourceGame?: BaseballGameState | null;
}

export type BaseballVisualPlaybackAction =
  | {
      type: "START";
      playId: string;
      events: readonly VisualEvent[];
      sourceGame: BaseballGameState | null;
    }
  | {
      type: "TICK";
      playId: string;
      eventId: string;
      progress: number;
    }
  | {
      type: "ADVANCE";
      playId: string;
      eventId: string;
    }
  | {
      type: "SKIP";
      playId: string;
      eventId: string;
    }
  | {
      type: "SEEK";
      playId: string;
      targetKind: VisualEventKind;
    }
  | { type: "CANCEL" };

export type BaseballVisualPlaybackEffect =
  | {
      type: "EVENT_START";
      playId: string;
      event: VisualEvent;
      eventIndex: number;
      sourceGame: BaseballGameState | null;
    }
  | {
      type: "COMPLETE";
      playId: string;
      sourceGame: BaseballGameState | null;
    };

export interface BaseballVisualPlaybackTransition {
  state: BaseballVisualPlaybackState;
  effects: readonly BaseballVisualPlaybackEffect[];
}

export interface UseBaseballVisualPlaybackOptions {
  onEventStart?: (
    event: VisualEvent,
    eventIndex: number,
    sourceGame: BaseballGameState | null,
  ) => void;
  onComplete?: (
    playId: string,
    sourceGame: BaseballGameState | null,
  ) => void;
}

export interface BaseballVisualPlaybackController {
  active: boolean;
  playId: string | null;
  sourceGame: BaseballGameState | null;
  currentEvent: VisualEvent | null;
  currentEventProgress: number;
  currentEventProgressSource: BaseballAnimationProgressSource;
  start: (request: BaseballVisualPlaybackStartRequest) => boolean;
  skip: () => boolean;
  seek: (targetKind: VisualEventKind) => boolean;
  cancel: () => void;
}

export interface BaseballVisualFrameScheduler {
  requestFrame: (callback: FrameRequestCallback) => number;
  cancelFrame: (handle: number) => void;
  now: () => number;
}

export interface BaseballVisualEventFrameLoopOptions {
  playId: string;
  event: VisualEvent;
  initialProgress: number;
  dispatch: (action: BaseballVisualPlaybackAction) => void;
  scheduler?: BaseballVisualFrameScheduler;
}

const EMPTY_EVENTS: readonly VisualEvent[] = [];

function clampProgress(progress: number) {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

function currentEvent(state: BaseballVisualPlaybackState) {
  if (!state.active) return null;
  return state.events[state.eventIndex] ?? null;
}

function eventStartEffect(
  state: BaseballVisualPlaybackState,
  event: VisualEvent,
): BaseballVisualPlaybackEffect {
  return {
    type: "EVENT_START",
    playId: state.playId!,
    event,
    eventIndex: state.eventIndex,
    sourceGame: state.sourceGame,
  };
}

function completeEffect(
  state: BaseballVisualPlaybackState,
): BaseballVisualPlaybackEffect {
  return {
    type: "COMPLETE",
    playId: state.playId!,
    sourceGame: state.sourceGame,
  };
}

export function createInitialBaseballVisualPlaybackState(): BaseballVisualPlaybackState {
  return {
    playId: null,
    events: EMPTY_EVENTS,
    eventIndex: 0,
    eventProgress: 0,
    active: false,
    sourceGame: null,
    startedPlayIds: new Set<string>(),
  };
}

/**
 * Creates an isolated playback request. The engine result may continue to
 * change while a scene is playing, so both the queue and source game are
 * snapshotted before entering playback state.
 */
export function createBaseballVisualPlaybackStartAction(
  request: BaseballVisualPlaybackStartRequest,
): Extract<BaseballVisualPlaybackAction, { type: "START" }> {
  const playId = request.playId.trim();
  if (!playId) throw new RangeError("playId must not be empty.");
  if (request.events.some((event) => event.playId !== playId)) {
    throw new RangeError("Every visual event must belong to the requested playId.");
  }

  return {
    type: "START",
    playId,
    events: structuredClone([...request.events]),
    sourceGame: request.sourceGame ? cloneGameState(request.sourceGame) : null,
  };
}

function advancePlayback(
  state: BaseballVisualPlaybackState,
  playId: string,
  eventId: string,
): BaseballVisualPlaybackTransition {
  const event = currentEvent(state);
  if (!event || state.playId !== playId || event.id !== eventId) {
    return { state, effects: [] };
  }

  const nextIndex = state.eventIndex + 1;
  if (nextIndex >= state.events.length) {
    const completed = {
      ...state,
      eventIndex: state.events.length,
      eventProgress: 1,
      active: false,
    };
    return { state: completed, effects: [completeEffect(completed)] };
  }

  const advanced = {
    ...state,
    eventIndex: nextIndex,
    eventProgress: 0,
  };
  return {
    state: advanced,
    effects: [eventStartEffect(advanced, advanced.events[nextIndex])],
  };
}

/**
 * Pure playback transition used by the React hook and node tests. Effects are
 * declarative so EVENT_START and COMPLETE callbacks can be delivered exactly
 * once even when React renders or effects are replayed in strict mode.
 */
export function transitionBaseballVisualPlayback(
  state: BaseballVisualPlaybackState,
  action: BaseballVisualPlaybackAction,
): BaseballVisualPlaybackTransition {
  switch (action.type) {
    case "START": {
      if (state.startedPlayIds.has(action.playId)) {
        return { state, effects: [] };
      }
      const startedPlayIds = new Set(state.startedPlayIds);
      startedPlayIds.add(action.playId);
      const started: BaseballVisualPlaybackState = {
        playId: action.playId,
        events: action.events,
        eventIndex: 0,
        eventProgress: action.events.length > 0 ? 0 : 1,
        active: action.events.length > 0,
        sourceGame: action.sourceGame,
        startedPlayIds,
      };
      return {
        state: started,
        effects: action.events.length > 0
          ? [eventStartEffect(started, action.events[0])]
          : [completeEffect(started)],
      };
    }
    case "TICK": {
      const event = currentEvent(state);
      if (!event || state.playId !== action.playId || event.id !== action.eventId) {
        return { state, effects: [] };
      }
      const progress = clampProgress(action.progress);
      if (progress === state.eventProgress) return { state, effects: [] };
      return {
        state: { ...state, eventProgress: progress },
        effects: [],
      };
    }
    case "ADVANCE":
      return advancePlayback(state, action.playId, action.eventId);
    case "SKIP": {
      const event = currentEvent(state);
      if (
        !event
        || state.playId !== action.playId
        || event.id !== action.eventId
        || !event.skippable
      ) {
        return { state, effects: [] };
      }
      return advancePlayback(state, action.playId, action.eventId);
    }
    case "SEEK": {
      if (!state.active || state.playId !== action.playId) {
        return { state, effects: [] };
      }
      const targetIndex = state.events.findIndex((event, index) => (
        index > state.eventIndex && event.kind === action.targetKind
      ));
      if (targetIndex < 0) return { state, effects: [] };
      const sought = {
        ...state,
        eventIndex: targetIndex,
        eventProgress: 0,
      };
      return {
        state: sought,
        effects: [eventStartEffect(sought, sought.events[targetIndex])],
      };
    }
    case "CANCEL": {
      if (
        !state.active
        && state.playId === null
        && state.events.length === 0
        && state.sourceGame === null
      ) {
        return { state, effects: [] };
      }
      return {
        state: {
          ...state,
          playId: null,
          events: EMPTY_EVENTS,
          eventIndex: 0,
          eventProgress: 0,
          active: false,
          sourceGame: null,
        },
        effects: [],
      };
    }
  }
}

export function baseballVisualPlaybackReducer(
  state: BaseballVisualPlaybackState,
  action: BaseballVisualPlaybackAction,
) {
  return transitionBaseballVisualPlayback(state, action).state;
}

function monotonicNow() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

export function baseballVisualEventTerminalHoldMs(event: VisualEvent) {
  if (event.kind === "RUN_SCORE") return event.payload.homeRun === true ? 250 : 420;
  if (event.kind === "FIELD_RESULT" || event.kind === "RUNNER_ADVANCE") return 120;
  return 0;
}

/**
 * Drives one event without advancing it in the same frame as its terminal
 * TICK. This guarantees the browser can paint progress=1; scoring holds that
 * frame briefly so the runner touching home and the score motion are visible.
 */
export function startBaseballVisualEventFrameLoop({
  playId,
  event,
  initialProgress,
  dispatch,
  scheduler = {
    requestFrame: (callback) => requestAnimationFrame(callback),
    cancelFrame: (handle) => cancelAnimationFrame(handle),
    now: monotonicNow,
  },
}: BaseballVisualEventFrameLoopOptions) {
  const durationMs = Math.max(1, event.durationMs);
  const startedAt = scheduler.now() - clampProgress(initialProgress) * durationMs;
  const terminalHoldMs = baseballVisualEventTerminalHoldMs(event);
  let cancelled = false;
  let frameHandle: number | null = null;

  const schedule = (callback: FrameRequestCallback) => {
    frameHandle = scheduler.requestFrame(callback);
  };
  const advanceAfterTerminalFrame = (completedAt: number) => (now: number) => {
    if (cancelled) return;
    if (now - completedAt < terminalHoldMs) {
      schedule(advanceAfterTerminalFrame(completedAt));
      return;
    }
    frameHandle = null;
    dispatch({ type: "ADVANCE", playId, eventId: event.id });
  };
  const animate = (now: number) => {
    if (cancelled) return;
    const progress = clampProgress((now - startedAt) / durationMs);
    dispatch({ type: "TICK", playId, eventId: event.id, progress });
    if (progress >= 1) {
      schedule(advanceAfterTerminalFrame(now));
      return;
    }
    schedule(animate);
  };

  schedule(animate);
  return () => {
    cancelled = true;
    if (frameHandle !== null) scheduler.cancelFrame(frameHandle);
    frameHandle = null;
  };
}

export function useBaseballVisualPlayback(
  options: UseBaseballVisualPlaybackOptions = {},
): BaseballVisualPlaybackController {
  const [state, setState] = useState<BaseballVisualPlaybackState>(
    createInitialBaseballVisualPlaybackState,
  );
  const stateRef = useRef(state);
  const progressSourceRef = useRef<ReturnType<
    typeof createBaseballAnimationProgressSource
  > | null>(null);
  progressSourceRef.current ??= createBaseballAnimationProgressSource();
  const progressSource = progressSourceRef.current;
  const cancelFrameLoopRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);
  const eventStartRef = useRef(options.onEventStart);
  const completeRef = useRef(options.onComplete);
  eventStartRef.current = options.onEventStart;
  completeRef.current = options.onComplete;

  const applyAction = useCallback((action: BaseballVisualPlaybackAction) => {
    const previous = stateRef.current;
    const transition = transitionBaseballVisualPlayback(previous, action);
    if (transition.state !== previous) {
      stateRef.current = transition.state;
      progressSource.setProgress(transition.state.eventProgress);
      // TICK is a 60 FPS transport signal. Keep it out of parent React state;
      // only event boundaries re-render the controller and its GameView.
      if (action.type !== "TICK" && mountedRef.current) {
        setState(transition.state);
      }
    }
    for (const effect of transition.effects) {
      if (effect.type === "EVENT_START") {
        eventStartRef.current?.(
          effect.event,
          effect.eventIndex,
          effect.sourceGame,
        );
      } else {
        completeRef.current?.(effect.playId, effect.sourceGame);
      }
    }
    return transition;
  }, [progressSource]);

  const start = useCallback((request: BaseballVisualPlaybackStartRequest) => {
    if (stateRef.current.startedPlayIds.has(request.playId.trim())) return false;
    const previous = stateRef.current;
    cancelFrameLoopRef.current?.();
    cancelFrameLoopRef.current = null;
    const transition = applyAction(createBaseballVisualPlaybackStartAction(request));
    return transition.state !== previous;
  }, [applyAction]);

  const skip = useCallback(() => {
    const playback = stateRef.current;
    const event = currentEvent(playback);
    if (!event || !playback.playId) return false;
    const transition = applyAction({
      type: "SKIP",
      playId: playback.playId,
      eventId: event.id,
    });
    return transition.state !== playback;
  }, [applyAction]);

  const seek = useCallback((targetKind: VisualEventKind) => {
    const playback = stateRef.current;
    if (!playback.active || !playback.playId) return false;
    const hasTarget = playback.events.some((event, index) => (
      index > playback.eventIndex && event.kind === targetKind
    ));
    if (!hasTarget) return false;
    cancelFrameLoopRef.current?.();
    cancelFrameLoopRef.current = null;
    const transition = applyAction({ type: "SEEK", playId: playback.playId, targetKind });
    return transition.state !== playback;
  }, [applyAction]);

  const cancel = useCallback(() => {
    cancelFrameLoopRef.current?.();
    cancelFrameLoopRef.current = null;
    applyAction({ type: "CANCEL" });
  }, [applyAction]);

  const activeEvent = state.active ? state.events[state.eventIndex] ?? null : null;

  useEffect(() => {
    if (!state.active || !state.playId || !activeEvent) return;
    const playId = state.playId;
    const cancelLoop = startBaseballVisualEventFrameLoop({
      playId,
      event: activeEvent,
      initialProgress: stateRef.current.eventProgress,
      dispatch: applyAction,
    });
    cancelFrameLoopRef.current = cancelLoop;
    return () => {
      cancelLoop();
      if (cancelFrameLoopRef.current === cancelLoop) cancelFrameLoopRef.current = null;
    };
  }, [activeEvent, applyAction, state.active, state.eventIndex, state.playId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelFrameLoopRef.current?.();
      cancelFrameLoopRef.current = null;
    };
  }, []);

  return {
    active: state.active,
    playId: state.playId,
    sourceGame: state.sourceGame,
    currentEvent: activeEvent,
    currentEventProgress: progressSource.getProgress(),
    currentEventProgressSource: progressSource,
    start,
    skip,
    seek,
    cancel,
  };
}

export default useBaseballVisualPlayback;
