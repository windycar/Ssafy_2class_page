import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cloneGameState } from "../utils/games/baseball/gameState.ts";
import type {
  BaseballGameState,
  VisualEvent,
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
  start: (request: BaseballVisualPlaybackStartRequest) => boolean;
  skip: () => boolean;
  cancel: () => void;
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

export function useBaseballVisualPlayback(
  options: UseBaseballVisualPlaybackOptions = {},
): BaseballVisualPlaybackController {
  const [state, setState] = useState<BaseballVisualPlaybackState>(
    createInitialBaseballVisualPlaybackState,
  );
  const stateRef = useRef(state);
  const frameRef = useRef<number | null>(null);
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
      if (mountedRef.current) setState(transition.state);
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
  }, []);

  const start = useCallback((request: BaseballVisualPlaybackStartRequest) => {
    if (stateRef.current.startedPlayIds.has(request.playId.trim())) return false;
    const previous = stateRef.current;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
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

  const cancel = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    applyAction({ type: "CANCEL" });
  }, [applyAction]);

  const activeEvent = state.active ? state.events[state.eventIndex] ?? null : null;

  useEffect(() => {
    if (!state.active || !state.playId || !activeEvent) return;
    const playId = state.playId;
    const eventId = activeEvent.id;
    const durationMs = Math.max(1, activeEvent.durationMs);
    const startedAt = monotonicNow() - stateRef.current.eventProgress * durationMs;
    let cancelled = false;

    const animate = (now: number) => {
      if (cancelled) return;
      const progress = clampProgress((now - startedAt) / durationMs);
      applyAction({ type: "TICK", playId, eventId, progress });
      if (progress >= 1) {
        applyAction({ type: "ADVANCE", playId, eventId });
        return;
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelled = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [activeEvent, applyAction, state.active, state.eventIndex, state.playId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, []);

  return {
    active: state.active,
    playId: state.playId,
    sourceGame: state.sourceGame,
    currentEvent: activeEvent,
    currentEventProgress: state.eventProgress,
    start,
    skip,
    cancel,
  };
}

export default useBaseballVisualPlayback;
