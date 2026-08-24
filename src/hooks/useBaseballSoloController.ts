import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { chooseCpuBatterAction } from "../utils/games/baseball/cpuBattingAI.ts";
import {
  chooseCpuPitch,
  type CpuPitchHistoryEntry,
} from "../utils/games/baseball/cpuPitchingAI.ts";
import {
  createGameState,
  getCurrentBatter,
  getCurrentPitcher,
} from "../utils/games/baseball/gameState.ts";
import {
  executeBatterAction,
  startPitch,
} from "../utils/games/baseball/playEngine.ts";
import { deriveSeed } from "../utils/games/baseball/random.ts";
import { createSoloVisualPlaybackPlan } from "../utils/games/baseball/soloPresentation.ts";
import { useBaseballVisualPlayback } from "./useBaseballVisualPlayback.ts";
import type {
  BaseballGameState,
  BaseballPitchType,
  OfficialPlayResult,
  PitchQuality,
  SwingType,
  Vec2,
  VisualEvent,
} from "../utils/games/baseball/types.ts";

const USER_TEAM_INDEX = 1;
const DEFAULT_AIM: Vec2 = Object.freeze({ x: 0.5, y: 0.5 });
const DEFAULT_PITCH_TYPE: BaseballPitchType = "fourSeam";
const DEFAULT_SWING_TYPE: SwingType = "NORMAL";
const CPU_READY_DELAY_MS = 420;
const PITCH_WINDUP_DURATION_MS = 560;
const RECENT_CPU_PITCH_LIMIT = 3;
const PITCH_PULSE_PERIOD_MS = 1_150;

export type BaseballSoloPresentation =
  | "INTRO"
  | "READY_FOR_PITCH"
  | "PITCH_WINDUP"
  | "PITCH_FLIGHT"
  | "EVENT_PLAYBACK"
  | "BETWEEN_PLAYS"
  | "HALF_INNING"
  | "FINAL";

export interface UseBaseballSoloControllerOptions {
  visitorName?: string;
  homeName?: string;
  seed?: number;
}

export interface BaseballSoloController {
  /** Latest authoritative result state. */
  game: BaseballGameState;
  /** HUD-safe state, revealed at PLAY_RESULT/SCOREBOARD_UPDATE presentation time. */
  displayGame: BaseballGameState;
  /** Alias that makes the intended presentation-state usage explicit to views. */
  presentationGame: BaseballGameState;
  presentation: BaseballSoloPresentation;
  aim: Vec2;
  setAim: Dispatch<SetStateAction<Vec2>>;
  selectedPitchType: BaseballPitchType;
  setSelectedPitchType: Dispatch<SetStateAction<BaseballPitchType>>;
  swingType: SwingType;
  setSwingType: Dispatch<SetStateAction<SwingType>>;
  currentVisualEvent: VisualEvent | null;
  currentVisualEventKey: string | null;
  currentVisualEventProgress: number;
  pitchProgress: number;
  pitchPulseProgress: number;
  pitchTimingQuality: PitchQuality;
  officialResult: OfficialPlayResult | null;
  primaryAction: () => void;
  startNewGame: () => void;
  skip: () => void;
  advance: () => void;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeAim(value: Vec2): Vec2 {
  if (!Number.isFinite(value.x) || !Number.isFinite(value.y)) return { ...DEFAULT_AIM };
  return {
    x: clamp(value.x, 0.03, 0.97),
    y: clamp(value.y, 0.03, 0.97),
  };
}

function pitchSequence(state: BaseballGameState) {
  return state.teams[0].pitcher.pitchCount + state.teams[1].pitcher.pitchCount + 1;
}

function idsForPitch(seed: number, sequence: number) {
  const playId = `solo-${seed}-pitch-${sequence}`;
  return {
    playId,
    startCommandId: `${playId}:start`,
    actionCommandId: `${playId}:action`,
  };
}

function monotonicNow() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

function pitchQualityForPulse(progress: number): PitchQuality {
  const centerError = Math.abs(clamp(progress, 0, 1) - 0.5);
  if (centerError <= 0.045) return "PERFECT";
  if (centerError <= 0.14) return "GOOD";
  if (centerError <= 0.28) return "NORMAL";
  return "MISS";
}

function isUserBatting(state: BaseballGameState) {
  return state.battingTeam === USER_TEAM_INDEX;
}

function isUserPitching(state: BaseballGameState) {
  return state.battingTeam !== USER_TEAM_INDEX;
}

/**
 * Local single-player coordinator for the authoritative Baseball V2 engines.
 * It owns presentation timing only; every pitch and plate result is committed
 * once through startPitch/executeBatterAction for both the human and the CPU.
 */
export function useBaseballSoloController(
  options: UseBaseballSoloControllerOptions = {},
): BaseballSoloController {
  const configRef = useRef({
    visitorName: options.visitorName ?? "CPU",
    homeName: options.homeName ?? "1P",
    seed: options.seed,
  });
  const createInitialGame = useCallback(() => {
    const config = configRef.current;
    return config.seed === undefined
      ? createGameState(config.visitorName, config.homeName)
      : createGameState(config.visitorName, config.homeName, config.seed);
  }, []);

  const [game, setGame] = useState<BaseballGameState>(createInitialGame);
  const [displayGame, setDisplayGame] = useState<BaseballGameState>(game);
  const [presentation, setPresentation] = useState<BaseballSoloPresentation>("INTRO");
  const [aim, setAimState] = useState<Vec2>({ ...DEFAULT_AIM });
  const [selectedPitchType, setSelectedPitchTypeState] =
    useState<BaseballPitchType>(DEFAULT_PITCH_TYPE);
  const [swingType, setSwingTypeState] = useState<SwingType>(DEFAULT_SWING_TYPE);
  const [pitchProgress, setPitchProgress] = useState(0);
  const [pitchPulseProgress, setPitchPulseProgress] = useState(0);
  const [pitchTimingQuality, setPitchTimingQuality] = useState<PitchQuality>("GOOD");

  const gameRef = useRef(game);
  const displayGameRef = useRef(displayGame);
  const baseSeedRef = useRef(game.seed);
  const rematchCounterRef = useRef(0);
  const presentationRef = useRef(presentation);
  const aimRef = useRef(aim);
  const selectedPitchTypeRef = useRef(selectedPitchType);
  const swingTypeRef = useRef(swingType);
  const pitchProgressRef = useRef(0);
  const pitchPulseProgressRef = useRef(0);
  const visualEventDisplaySnapshotsRef = useRef<ReadonlyMap<string, BaseballGameState>>(new Map());
  const afterPlaybackRef = useRef<BaseballSoloPresentation>("BETWEEN_PLAYS");
  const flightStartedAtRef = useRef<number | null>(null);
  const pitchPulseStartedAtRef = useRef<number | null>(null);
  const cpuBatterActionRef = useRef<ReturnType<typeof chooseCpuBatterAction> | null>(null);
  const recentCpuPitchesRef = useRef<CpuPitchHistoryEntry[]>([]);
  const occurredAtByPlayRef = useRef(new Map<string, string>());
  const startCommandLocksRef = useRef(new Set<string>());
  const actionCommandLocksRef = useRef(new Set<string>());
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const commitGame = useCallback((next: BaseballGameState) => {
    gameRef.current = next;
    setGame(next);
  }, []);

  const commitDisplayGame = useCallback((next: BaseballGameState) => {
    displayGameRef.current = next;
    setDisplayGame(next);
  }, []);

  const commitPresentation = useCallback((next: BaseballSoloPresentation) => {
    presentationRef.current = next;
    setPresentation(next);
  }, []);

  const {
    currentEvent: playbackCurrentEvent,
    currentEventProgress,
    start: startVisualPlayback,
    skip: skipVisualPlayback,
    cancel: cancelVisualPlayback,
  } = useBaseballVisualPlayback({
    onEventStart: (event) => {
      const snapshot = visualEventDisplaySnapshotsRef.current.get(event.id);
      if (snapshot) commitDisplayGame(snapshot);
    },
    onComplete: () => {
      visualEventDisplaySnapshotsRef.current = new Map();
      commitDisplayGame(gameRef.current);
      commitPresentation(afterPlaybackRef.current);
    },
  });

  const setAim = useCallback<Dispatch<SetStateAction<Vec2>>>((value) => {
    setAimState((previous) => {
      const requested = typeof value === "function" ? value(previous) : value;
      const next = normalizeAim(requested);
      aimRef.current = next;
      return next;
    });
  }, []);

  const setSelectedPitchType = useCallback<Dispatch<SetStateAction<BaseballPitchType>>>(
    (value) => {
      setSelectedPitchTypeState((previous) => {
        const next = typeof value === "function" ? value(previous) : value;
        selectedPitchTypeRef.current = next;
        return next;
      });
    },
    [],
  );

  const setSwingType = useCallback<Dispatch<SetStateAction<SwingType>>>((value) => {
    setSwingTypeState((previous) => {
      const next = typeof value === "function" ? value(previous) : value;
      swingTypeRef.current = next;
      return next;
    });
  }, []);

  const beginPitch = useCallback(() => {
    const state = gameRef.current;
    if (presentationRef.current !== "READY_FOR_PITCH" || state.status === "finished") return;

    const sequence = pitchSequence(state);
    const ids = idsForPitch(state.seed, sequence);
    if (startCommandLocksRef.current.has(ids.startCommandId)) return;

    const batter = getCurrentBatter(state);
    const pitcher = getCurrentPitcher(state);
    const fieldingTeamIndex = state.battingTeam === 0 ? 1 : 0;
    const cpuPitching = !isUserPitching(state);
    let pitchType = selectedPitchTypeRef.current;
    let target = normalizeAim(aimRef.current);
    let timingQuality: PitchQuality = pitchQualityForPulse(pitchPulseProgressRef.current);

    if (cpuPitching) {
      const selection = chooseCpuPitch({
        seed: state.seed,
        sequence,
        pitcher,
        pitcherState: state.teams[fieldingTeamIndex].pitcher,
        batter,
        count: state.count,
        recentPitches: recentCpuPitchesRef.current,
      });
      pitchType = selection.pitchType;
      target = selection.target;
      timingQuality = selection.timingQuality;
    } else if (!pitcher.pitching?.pitches.some((pitch) => pitch.type === pitchType)) {
      pitchType = pitcher.pitching?.pitches[0]?.type ?? DEFAULT_PITCH_TYPE;
      selectedPitchTypeRef.current = pitchType;
      setSelectedPitchTypeState(pitchType);
    }

    startCommandLocksRef.current.add(ids.startCommandId);
    const result = startPitch(state, {
      commandId: ids.startCommandId,
      expectedRevision: state.revision,
      playId: ids.playId,
      sequence,
      pitcherId: pitcher.id,
      pitchType,
      target,
      timingQuality,
    });
    if (!result.ok) {
      startCommandLocksRef.current.delete(ids.startCommandId);
      return;
    }

    if (cpuPitching) {
      recentCpuPitchesRef.current = [
        ...recentCpuPitchesRef.current,
        { pitchType, location: { ...target } },
      ].slice(-RECENT_CPU_PITCH_LIMIT);
    }

    cpuBatterActionRef.current = isUserBatting(result.state)
      ? null
      : chooseCpuBatterAction({
          seed: result.state.seed,
          sequence,
          pitch: result.state.activePlay!.pitch!,
          batter,
          pitcher,
          count: state.count,
        });
    setPitchTimingQuality(timingQuality);
    flightStartedAtRef.current = null;
    pitchPulseStartedAtRef.current = null;
    pitchProgressRef.current = 0;
    setPitchProgress(0);
    commitGame(result.state);
    commitDisplayGame(result.state);
    commitPresentation("PITCH_WINDUP");
  }, [commitDisplayGame, commitGame, commitPresentation]);

  const resolveCurrentPitch = useCallback((cpuAction = false) => {
    const state = gameRef.current;
    const activePlay = state.activePlay;
    if (
      presentationRef.current !== "PITCH_FLIGHT"
      || !activePlay?.pitch
      || activePlay.phase !== "AWAITING_BATTER"
    ) {
      return false;
    }

    const ids = idsForPitch(state.seed, activePlay.sequence);
    if (actionCommandLocksRef.current.has(ids.actionCommandId)) return false;
    const batter = getCurrentBatter(state);
    const action = cpuAction
      ? cpuBatterActionRef.current
      : {
          kind: "SWING" as const,
          swing: {
            batterId: batter.id,
            swingType: swingTypeRef.current,
            aim: normalizeAim(aimRef.current),
            progress: clamp(pitchProgressRef.current, 0, 1.25),
          },
        };
    const finalAction = action ?? { kind: "TAKE" as const, batterId: batter.id };
    let occurredAt = occurredAtByPlayRef.current.get(activePlay.playId);
    if (!occurredAt) {
      occurredAt = new Date().toISOString();
      occurredAtByPlayRef.current.set(activePlay.playId, occurredAt);
    }

    actionCommandLocksRef.current.add(ids.actionCommandId);
    const previousInning = state.inning;
    const previousHalf = state.half;
    const result = executeBatterAction(state, {
      commandId: ids.actionCommandId,
      expectedRevision: state.revision,
      playId: activePlay.playId,
      batterId: batter.id,
      occurredAt,
      action: finalAction,
    });
    if (!result.ok) {
      actionCommandLocksRef.current.delete(ids.actionCommandId);
      return false;
    }

    const engineEvents = result.state.activePlay?.visualEvents ?? [];
    const official = result.state.lastPlay;
    const showThirdOutSnapshot = official !== null
      && official.outsRecorded > 0
      && state.count.outs + official.outsRecorded >= 3;
    const playbackPlan = createSoloVisualPlaybackPlan({
      events: engineEvents,
      displayBeforeResult: displayGameRef.current,
      authoritativeAfterResult: result.state,
      showThirdOutSnapshot,
    });
    const nextEvents = playbackPlan.events;
    const sideChanged = result.state.inning !== previousInning || result.state.half !== previousHalf;
    afterPlaybackRef.current = result.state.status === "finished"
      ? "FINAL"
      : sideChanged
        ? "HALF_INNING"
        : "BETWEEN_PLAYS";
    visualEventDisplaySnapshotsRef.current = playbackPlan.displaySnapshotByEventId;
    pitchProgressRef.current = 1;
    setPitchProgress(1);
    commitGame(result.state);
    if (nextEvents.length > 0) {
      const started = startVisualPlayback({
        playId: activePlay.playId,
        events: nextEvents,
        sourceGame: result.state,
      });
      if (started) {
        commitPresentation("EVENT_PLAYBACK");
      } else {
        visualEventDisplaySnapshotsRef.current = new Map();
        commitDisplayGame(result.state);
        commitPresentation(afterPlaybackRef.current);
      }
    } else {
      commitDisplayGame(result.state);
      commitPresentation(afterPlaybackRef.current);
    }
    return true;
  }, [commitDisplayGame, commitGame, commitPresentation, startVisualPlayback]);

  const resolveTake = useCallback(() => {
    const state = gameRef.current;
    const activePlay = state.activePlay;
    if (!activePlay?.pitch || activePlay.phase !== "AWAITING_BATTER") return false;
    cpuBatterActionRef.current = { kind: "TAKE", batterId: activePlay.batterId };
    return resolveCurrentPitch(true);
  }, [resolveCurrentPitch]);

  const skip = useCallback(() => {
    if (presentationRef.current !== "EVENT_PLAYBACK") return;
    skipVisualPlayback();
  }, [skipVisualPlayback]);

  const advance = useCallback(() => {
    switch (presentationRef.current) {
      case "INTRO":
      case "BETWEEN_PLAYS":
      case "HALF_INNING":
        pitchProgressRef.current = 0;
        pitchPulseProgressRef.current = 0;
        pitchPulseStartedAtRef.current = null;
        setPitchProgress(0);
        setPitchPulseProgress(0);
        commitPresentation("READY_FOR_PITCH");
        return;
      case "EVENT_PLAYBACK":
        skip();
        return;
      default:
        return;
    }
  }, [commitPresentation, skip]);

  const primaryAction = useCallback(() => {
    switch (presentationRef.current) {
      case "INTRO":
      case "BETWEEN_PLAYS":
      case "HALF_INNING":
        advance();
        return;
      case "READY_FOR_PITCH":
        if (isUserPitching(gameRef.current)) beginPitch();
        return;
      case "PITCH_FLIGHT":
        if (isUserBatting(gameRef.current)) resolveCurrentPitch(false);
        return;
      case "EVENT_PLAYBACK":
        skip();
        return;
      default:
        return;
    }
  }, [advance, beginPitch, resolveCurrentPitch, skip]);

  const startNewGame = useCallback(() => {
    if (readyTimeoutRef.current !== null) clearTimeout(readyTimeoutRef.current);
    if (windupTimeoutRef.current !== null) clearTimeout(windupTimeoutRef.current);
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    readyTimeoutRef.current = null;
    windupTimeoutRef.current = null;
    animationFrameRef.current = null;
    flightStartedAtRef.current = null;
    pitchPulseStartedAtRef.current = null;
    cancelVisualPlayback();
    cpuBatterActionRef.current = null;
    recentCpuPitchesRef.current = [];
    occurredAtByPlayRef.current.clear();
    startCommandLocksRef.current.clear();
    actionCommandLocksRef.current.clear();
    visualEventDisplaySnapshotsRef.current = new Map();
    afterPlaybackRef.current = "BETWEEN_PLAYS";
    aimRef.current = { ...DEFAULT_AIM };
    selectedPitchTypeRef.current = DEFAULT_PITCH_TYPE;
    swingTypeRef.current = DEFAULT_SWING_TYPE;
    pitchProgressRef.current = 0;
    pitchPulseProgressRef.current = 0;
    rematchCounterRef.current += 1;
    const config = configRef.current;
    const rematchSeed = deriveSeed(
      baseSeedRef.current,
      "solo-rematch",
      rematchCounterRef.current,
    );
    const nextGame = createGameState(config.visitorName, config.homeName, rematchSeed);
    setAimState({ ...DEFAULT_AIM });
    setSelectedPitchTypeState(DEFAULT_PITCH_TYPE);
    setSwingTypeState(DEFAULT_SWING_TYPE);
    setPitchProgress(0);
    setPitchPulseProgress(0);
    setPitchTimingQuality("GOOD");
    commitGame(nextGame);
    commitDisplayGame(nextGame);
    commitPresentation("INTRO");
  }, [cancelVisualPlayback, commitDisplayGame, commitGame, commitPresentation]);

  useEffect(() => {
    if (presentation !== "READY_FOR_PITCH" || !isUserPitching(game)) return;
    if (pitchPulseStartedAtRef.current === null) pitchPulseStartedAtRef.current = monotonicNow();

    const animate = (now: number) => {
      const startedAt = pitchPulseStartedAtRef.current ?? now;
      const progress = ((now - startedAt) % PITCH_PULSE_PERIOD_MS) / PITCH_PULSE_PERIOD_MS;
      pitchPulseProgressRef.current = progress;
      setPitchPulseProgress(progress);
      setPitchTimingQuality(pitchQualityForPulse(progress));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [game, presentation]);

  useEffect(() => {
    if (
      presentation !== "READY_FOR_PITCH"
      || game.status === "finished"
      || isUserPitching(game)
    ) {
      return;
    }
    readyTimeoutRef.current = setTimeout(beginPitch, CPU_READY_DELAY_MS);
    return () => {
      if (readyTimeoutRef.current !== null) clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    };
  }, [beginPitch, game, presentation]);

  useEffect(() => {
    if (presentation !== "PITCH_WINDUP") return;
    windupTimeoutRef.current = setTimeout(() => {
      flightStartedAtRef.current = null;
      commitPresentation("PITCH_FLIGHT");
    }, PITCH_WINDUP_DURATION_MS);
    return () => {
      if (windupTimeoutRef.current !== null) clearTimeout(windupTimeoutRef.current);
      windupTimeoutRef.current = null;
    };
  }, [commitPresentation, presentation]);

  useEffect(() => {
    if (presentation !== "PITCH_FLIGHT") return;
    const pitch = gameRef.current.activePlay?.pitch;
    if (!pitch) return;
    if (flightStartedAtRef.current === null) flightStartedAtRef.current = monotonicNow();

    const animate = (now: number) => {
      const startedAt = flightStartedAtRef.current ?? now;
      const rawProgress = (now - startedAt) / pitch.flightDurationMs;
      pitchProgressRef.current = rawProgress;
      setPitchProgress(clamp(rawProgress, 0, 1));

      if (!isUserBatting(gameRef.current)) {
        const cpuAction = cpuBatterActionRef.current;
        if (cpuAction?.kind === "SWING" && rawProgress >= cpuAction.swing.progress) {
          resolveCurrentPitch(true);
          return;
        }
        if (cpuAction?.kind === "TAKE" && rawProgress >= 1) {
          resolveCurrentPitch(true);
          return;
        }
      } else if (rawProgress >= 1) {
        resolveTake();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [presentation, resolveCurrentPitch, resolveTake]);

  const currentVisualEvent = presentation === "EVENT_PLAYBACK"
    ? playbackCurrentEvent
    : null;

  useEffect(() => () => {
    if (readyTimeoutRef.current !== null) clearTimeout(readyTimeoutRef.current);
    if (windupTimeoutRef.current !== null) clearTimeout(windupTimeoutRef.current);
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return {
    game,
    displayGame,
    presentationGame: displayGame,
    presentation,
    aim,
    setAim,
    selectedPitchType,
    setSelectedPitchType,
    swingType,
    setSwingType,
    currentVisualEvent,
    currentVisualEventKey: currentVisualEvent?.id ?? null,
    currentVisualEventProgress,
    pitchProgress,
    pitchPulseProgress,
    pitchTimingQuality,
    officialResult: game.lastPlay,
    primaryAction,
    startNewGame,
    skip,
    advance,
  };
}
