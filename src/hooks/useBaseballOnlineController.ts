import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createBaseballClientId,
  sendBaseballCommand,
  type BaseballCommandClientResult,
} from "../services/baseballCommandClient.ts";
import type { BaseballRoom } from "../types/baseballRoom.ts";
import {
  getCurrentBatter,
  getCurrentPitcher,
} from "../utils/games/baseball/gameState.ts";
import { normalizeBaseballRoom } from "../utils/games/baseball/normalizeRoom.ts";
import {
  hasBaseballPresentationAcknowledgement,
  isBaseballPresentationGateBlocking,
} from "../utils/games/baseball/presentationGate.ts";
import {
  BASEBALL_ONLINE_PROTOCOL_VERSION,
  type BaseballMatchCommandEnvelope,
} from "../utils/games/baseball/onlineProtocol.ts";
import type {
  BaseballPitchType,
  PitchQuality,
  SwingType,
  TeamIndex,
  Vec2,
} from "../utils/games/baseball/types.ts";
import {
  useBaseballCommandNoticeChannel,
  type BaseballNoticeChannelStatus,
  type BaseballNoticeRefetchSignal,
} from "./useBaseballCommandNoticeChannel.ts";
import { useBaseballOnlinePresence } from "./useBaseballOnlinePresence.ts";

export type BaseballOnlineRole =
  | "PITCHING"
  | "BATTING"
  | "WAITING"
  | "SPECTATING"
  | "FINAL";

export interface BaseballOnlineControllerError {
  status: number;
  code: string;
}

export interface UseBaseballOnlineControllerOptions {
  initialRoom: BaseballRoom;
  currentAuthId: string;
  enabled?: boolean;
  refetchRoom?: (roomId: string) => Promise<BaseballRoom | null>;
  commandSender?: (
    envelope: BaseballMatchCommandEnvelope,
  ) => Promise<BaseballCommandClientResult>;
}

export interface OnlineStartPitchInput {
  pitchType: BaseballPitchType;
  target: Vec2;
  timingQuality?: PitchQuality;
  commandId?: string;
  playId?: string;
  nowMs?: number;
}

export interface OnlinePresentationAckInput {
  playId?: string;
  commandId?: string;
}

export type OnlineBatterActionInput =
  | {
      kind: "TAKE";
      commandId?: string;
    }
  | {
      kind: "SWING";
      swingType: SwingType;
      aim: Vec2;
      progress: number;
      commandId?: string;
    };

export type BaseballOnlineCommandCycleResult =
  | {
      outcome: "COMMITTED";
      room: BaseballRoom;
      broadcasted: boolean;
      refetched: boolean;
      idempotent: boolean;
    }
  | {
      outcome: "CONFLICT";
      room: BaseballRoom;
      code: string;
      refetched: boolean;
    }
  | {
      outcome: "REJECTED";
      room: BaseballRoom;
      status: number;
      code: string;
    };

export interface ExecuteBaseballOnlineCommandCycleOptions {
  currentRoom: BaseballRoom;
  envelope: BaseballMatchCommandEnvelope;
  sendCommand: (
    envelope: BaseballMatchCommandEnvelope,
  ) => Promise<BaseballCommandClientResult>;
  broadcastNotice: (
    envelope: BaseballMatchCommandEnvelope,
    committedRoomRevision: number,
    committedGameRevision: number,
  ) => Promise<boolean>;
  refetchRoom: (roomId: string) => Promise<BaseballRoom | null>;
  onCanonicalRoom?: (room: BaseballRoom) => void;
}

type IdFactory = (prefix: string) => string;

const DEFAULT_AIM: Readonly<Vec2> = { x: 0.5, y: 0.5 };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function otherSeat(seat: TeamIndex): TeamIndex {
  return seat === 0 ? 1 : 0;
}

function normalizeCurrentRoom(rawRoom: unknown, expectedRoomId?: string) {
  const normalized = normalizeBaseballRoom(rawRoom, expectedRoomId);
  if (!normalized.ok || normalized.sourceVersion !== 2) return null;
  if (!normalized.value.matchId || !normalized.value.gameState) return null;
  return normalized.value;
}

/**
 * Accepts only a same-match canonical room that cannot roll either room or
 * gameplay revision backwards. This is the sole state replacement gate used
 * by the online controller.
 */
export function acceptCanonicalOnlineRoom(
  currentRoom: BaseballRoom,
  candidateRoom: unknown,
): BaseballRoom | null {
  const current = normalizeCurrentRoom(currentRoom, currentRoom.id);
  const candidate = normalizeCurrentRoom(candidateRoom, currentRoom.id);
  if (!current || !candidate) return null;
  if (
    candidate.matchId !== current.matchId
    || candidate.gameState!.seed !== current.gameState!.seed
    || candidate.revision < current.revision
    || candidate.gameState!.revision < current.gameState!.revision
  ) return null;
  return candidate;
}

export function getBaseballOnlineActorSeat(
  room: BaseballRoom,
  currentAuthId: string,
): TeamIndex | null {
  return room.players.find((player) => player.authId === currentAuthId)?.seat ?? null;
}

export function deriveBaseballOnlineRole(
  room: BaseballRoom,
  currentAuthId: string,
): BaseballOnlineRole {
  const game = room.gameState;
  if (room.status === "finished" || game?.status === "finished") return "FINAL";

  const actorSeat = getBaseballOnlineActorSeat(room, currentAuthId);
  if (actorSeat === null) return "SPECTATING";
  if (room.status !== "playing" || !room.matchId || !game || game.status !== "playing") {
    return "WAITING";
  }

  if (game.activePlay?.phase === "AWAITING_BATTER") {
    return actorSeat === game.battingTeam ? "BATTING" : "WAITING";
  }
  if (!game.activePlay || game.activePlay.phase === "RESOLVED") {
    return actorSeat === otherSeat(game.battingTeam) ? "PITCHING" : "WAITING";
  }
  return "WAITING";
}

export function buildOnlineStartPitchEnvelope(
  room: BaseballRoom,
  actorSeat: TeamIndex,
  input: OnlineStartPitchInput,
  idFactory: IdFactory = createBaseballClientId,
): BaseballMatchCommandEnvelope | null {
  const canonical = normalizeCurrentRoom(room, room.id);
  const game = canonical?.gameState;
  if (
    !canonical
    || canonical.status !== "playing"
    || !canonical.matchId
    || !game
    || game.status !== "playing"
    || actorSeat !== otherSeat(game.battingTeam)
    || (game.activePlay !== null && game.activePlay.phase !== "RESOLVED")
    || isBaseballPresentationGateBlocking(canonical, input.nowMs ?? Date.now())
  ) return null;

  const commandId = input.commandId ?? idFactory("baseball-command");
  const playId = input.playId ?? idFactory("baseball-play");
  const pitcher = getCurrentPitcher(game);
  const pitchSequence = game.teams.reduce(
    (total, team) => total + team.pitcher.pitchCount,
    0,
  ) + 1;

  return {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: canonical.id,
    matchId: canonical.matchId,
    commandId,
    commandSequence: game.revision + 1,
    baseRoomRevision: canonical.revision,
    baseGameRevision: game.revision,
    actorSeat,
    seed: game.seed,
    playId,
    kind: "START_PITCH",
    command: {
      commandId,
      expectedRevision: game.revision,
      playId,
      sequence: pitchSequence,
      pitcherId: pitcher.id,
      pitchType: input.pitchType,
      target: {
        x: clamp(input.target.x, 0, 1),
        y: clamp(input.target.y, 0, 1),
      },
      timingQuality: input.timingQuality ?? "GOOD",
    },
  };
}

export function buildOnlinePresentationAckEnvelope(
  room: BaseballRoom,
  actorSeat: TeamIndex,
  input: OnlinePresentationAckInput = {},
  idFactory: IdFactory = createBaseballClientId,
): BaseballMatchCommandEnvelope | null {
  const canonical = normalizeCurrentRoom(room, room.id);
  const game = canonical?.gameState;
  const gate = canonical?.presentationGate;
  const playId = input.playId ?? gate?.playId;
  if (
    !canonical
    || canonical.status !== "playing"
    || !canonical.matchId
    || !game
    || game.status !== "playing"
    || !gate
    || !playId
    || gate.playId !== playId
    || game.activePlay?.phase !== "RESOLVED"
    || game.activePlay.playId !== playId
    || hasBaseballPresentationAcknowledgement(gate, actorSeat)
  ) return null;

  const commandId = input.commandId ?? idFactory("baseball-presentation-ack");
  return {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: canonical.id,
    matchId: canonical.matchId,
    commandId,
    commandSequence: game.revision + 1,
    baseRoomRevision: canonical.revision,
    baseGameRevision: game.revision,
    actorSeat,
    seed: game.seed,
    playId,
    kind: "ACK_PRESENTATION",
    command: {
      commandId,
      expectedRevision: game.revision,
      playId,
    },
  };
}

export function buildOnlineBatterActionEnvelope(
  room: BaseballRoom,
  actorSeat: TeamIndex,
  input: OnlineBatterActionInput,
  idFactory: IdFactory = createBaseballClientId,
): BaseballMatchCommandEnvelope | null {
  const canonical = normalizeCurrentRoom(room, room.id);
  const game = canonical?.gameState;
  const activePlay = game?.activePlay;
  if (
    !canonical
    || canonical.status !== "playing"
    || !canonical.matchId
    || !game
    || game.status !== "playing"
    || actorSeat !== game.battingTeam
    || activePlay?.phase !== "AWAITING_BATTER"
    || !activePlay.pitch
  ) return null;

  const commandId = input.commandId ?? idFactory("baseball-command");
  const batter = getCurrentBatter(game);
  const action = input.kind === "TAKE"
    ? {
        kind: "TAKE" as const,
        batterId: batter.id,
      }
    : {
        kind: "SWING" as const,
        swing: {
          batterId: batter.id,
          swingType: input.swingType,
          aim: {
            x: clamp(input.aim.x, 0, 1),
            y: clamp(input.aim.y, 0, 1),
          },
          progress: clamp(input.progress, 0, 1.25),
        },
      };

  return {
    schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
    roomId: canonical.id,
    matchId: canonical.matchId,
    commandId,
    commandSequence: game.revision + 1,
    baseRoomRevision: canonical.revision,
    baseGameRevision: game.revision,
    actorSeat,
    seed: game.seed,
    playId: activePlay.playId,
    kind: "BATTER_ACTION",
    command: {
      commandId,
      expectedRevision: game.revision,
      playId: activePlay.playId,
      batterId: batter.id,
      action,
    },
  };
}

async function safeRefetchAfterCommand(
  currentRoom: BaseballRoom,
  refetchRoom: (roomId: string) => Promise<BaseballRoom | null>,
  onCanonicalRoom?: (room: BaseballRoom) => void,
) {
  try {
    const candidate = await refetchRoom(currentRoom.id);
    if (!candidate) return { room: currentRoom, refetched: false };
    const accepted = acceptCanonicalOnlineRoom(currentRoom, candidate);
    if (!accepted) return { room: currentRoom, refetched: false };
    onCanonicalRoom?.(accepted);
    return { room: accepted, refetched: true };
  } catch {
    return { room: currentRoom, refetched: false };
  }
}

/**
 * Runs one authoritative command cycle. A successful commit is announced as
 * state-free invalidation first, then the room is re-read. Conflicts skip the
 * broadcast and recover from the server's canonical room before re-reading.
 */
export async function executeBaseballOnlineCommandCycle({
  currentRoom,
  envelope,
  sendCommand,
  broadcastNotice,
  refetchRoom,
  onCanonicalRoom,
}: ExecuteBaseballOnlineCommandCycleOptions): Promise<BaseballOnlineCommandCycleResult> {
  const response = await sendCommand(envelope);

  if (response.ok) {
    let canonical = acceptCanonicalOnlineRoom(currentRoom, response.room) ?? currentRoom;
    onCanonicalRoom?.(canonical);

    const exactCommit = response.room.revision === envelope.baseRoomRevision + 1
      && response.room.gameState?.revision === envelope.baseGameRevision + 1;
    let broadcasted = false;
    if (exactCommit) {
      try {
        broadcasted = await broadcastNotice(
          envelope,
          response.room.revision,
          response.room.gameState!.revision,
        );
      } catch {
        broadcasted = false;
      }
    }

    const refreshed = await safeRefetchAfterCommand(canonical, refetchRoom, onCanonicalRoom);
    canonical = refreshed.room;
    return {
      outcome: "COMMITTED",
      room: canonical,
      broadcasted,
      refetched: refreshed.refetched,
      idempotent: response.idempotent,
    };
  }

  if (response.status === 409) {
    let canonical = acceptCanonicalOnlineRoom(currentRoom, response.room) ?? currentRoom;
    onCanonicalRoom?.(canonical);
    const refreshed = await safeRefetchAfterCommand(canonical, refetchRoom, onCanonicalRoom);
    canonical = refreshed.room;
    return {
      outcome: "CONFLICT",
      room: canonical,
      code: response.code,
      refetched: refreshed.refetched,
    };
  }

  const responseRoom = "room" in response ? response.room : undefined;
  const canonical = responseRoom
    ? acceptCanonicalOnlineRoom(currentRoom, responseRoom) ?? currentRoom
    : currentRoom;
  if (canonical !== currentRoom) onCanonicalRoom?.(canonical);
  return {
    outcome: "REJECTED",
    room: canonical,
    status: response.status,
    code: response.code,
  };
}

async function defaultRefetchRoom(roomId: string) {
  const { baseballRoomStorage } = await import("../services/storage/baseballRoomStorage.ts");
  return baseballRoomStorage.refreshRoom(roomId);
}

export function useBaseballOnlineController({
  initialRoom,
  currentAuthId,
  enabled = true,
  refetchRoom = defaultRefetchRoom,
  commandSender = sendBaseballCommand,
}: UseBaseballOnlineControllerOptions) {
  const [room, setRoom] = useState<BaseballRoom | null>(() => (
    normalizeCurrentRoom(initialRoom, initialRoom.id)
  ));
  const [aim, setAimState] = useState<Vec2>({ ...DEFAULT_AIM });
  const [selectedPitchType, setSelectedPitchType] = useState<BaseballPitchType>("fourSeam");
  const [swingType, setSwingType] = useState<SwingType>("NORMAL");
  const [busy, setBusy] = useState(false);
  const [recovering, setRecovering] = useState(() => enabled && Boolean(room?.id));
  const [presenceRecoveryPending, setPresenceRecoveryPending] = useState(true);
  const [presentationClock, setPresentationClock] = useState(() => Date.now());
  const [error, setError] = useState<BaseballOnlineControllerError | null>(() => (
    room ? null : { status: 0, code: "INVALID_CANONICAL_ROOM" }
  ));
  const [lastSyncReason, setLastSyncReason] = useState<string>("INITIAL");
  const roomRef = useRef(room);
  const mountedRef = useRef(true);
  const commandInFlightRef = useRef(false);
  const refreshInFlightRef = useRef<Promise<BaseballRoom | null> | null>(null);
  const refreshQueuedRef = useRef(false);
  const presenceAllConnectedRef = useRef(false);
  const presenceGateRef = useRef(false);

  const commitCanonicalRoom = useCallback((candidate: unknown) => {
    const current = roomRef.current;
    const accepted = current
      ? acceptCanonicalOnlineRoom(current, candidate)
      : normalizeCurrentRoom(candidate, initialRoom.id);
    if (!accepted) return null;
    roomRef.current = accepted;
    if (mountedRef.current) setRoom(accepted);
    return accepted;
  }, [initialRoom.id]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    commitCanonicalRoom(initialRoom);
  }, [commitCanonicalRoom, initialRoom]);

  const refreshCanonicalRoom = useCallback((reason = "MANUAL") => {
    if (refreshInFlightRef.current) {
      refreshQueuedRef.current = true;
      return refreshInFlightRef.current;
    }

    const run = (async () => {
      if (mountedRef.current) {
        setRecovering(true);
        setLastSyncReason(reason);
      }
      let result: BaseballRoom | null = null;
      let attempts = 0;
      do {
        refreshQueuedRef.current = false;
        attempts += 1;
        const current = roomRef.current;
        if (!current) break;
        try {
          const candidate = await refetchRoom(current.id);
          if (candidate) {
            const accepted = commitCanonicalRoom(candidate);
            if (accepted) result = accepted;
          }
        } catch {
          if (mountedRef.current) setError({ status: 0, code: "ROOM_REFETCH_FAILED" });
        }
      } while (refreshQueuedRef.current && attempts < 2);
      if (result && presenceAllConnectedRef.current) {
        presenceGateRef.current = true;
        if (mountedRef.current) setPresenceRecoveryPending(false);
      }
      return result;
    })();

    const tracked = run.finally(() => {
      if (refreshInFlightRef.current === tracked) refreshInFlightRef.current = null;
      if (mountedRef.current) setRecovering(false);
    });
    refreshInFlightRef.current = tracked;
    return tracked;
  }, [commitCanonicalRoom, refetchRoom]);

  const handleNoticeRefetch = useCallback((signal: BaseballNoticeRefetchSignal) => {
    void refreshCanonicalRoom(`NOTICE_${signal.reason}`);
  }, [refreshCanonicalRoom]);

  const game = room?.gameState ?? null;
  const actorSeat = room ? getBaseballOnlineActorSeat(room, currentAuthId) : null;
  const role = room ? deriveBaseballOnlineRole(room, currentAuthId) : "WAITING";
  const presenceParticipants = useMemo(() => (
    room?.players.map((player) => ({ authId: player.authId, seat: player.seat })) ?? []
  ), [room?.players]);
  const presence = useBaseballOnlinePresence({
    roomId: room?.id ?? "",
    matchId: room?.matchId ?? "",
    participants: presenceParticipants,
    currentAuthId,
    enabled: enabled && actorSeat !== null && Boolean(room?.matchId && game),
  });
  const notice = useBaseballCommandNoticeChannel({
    roomId: room?.id,
    matchId: room?.matchId,
    seed: game?.seed,
    lastCommandSequence: game?.revision ?? 0,
    lastRoomRevision: room?.revision ?? 0,
    enabled: enabled && Boolean(room?.matchId && game),
    onRefetchRequested: handleNoticeRefetch,
  });
  const previousNoticeStatusRef = useRef<BaseballNoticeChannelStatus>(notice.status);

  useEffect(() => {
    presenceAllConnectedRef.current = presence.allPlayersConnected;
    if (!presence.allPlayersConnected) {
      presenceGateRef.current = false;
      setPresenceRecoveryPending(false);
      return;
    }

    presenceGateRef.current = false;
    setPresenceRecoveryPending(true);
    void refreshCanonicalRoom("PRESENCE_RECONNECTED");
  }, [presence.allPlayersConnected, refreshCanonicalRoom]);

  useEffect(() => {
    const previous = previousNoticeStatusRef.current;
    previousNoticeStatusRef.current = notice.status;
    const recovered = notice.status === "SUBSCRIBED"
      && (previous === "CHANNEL_ERROR" || previous === "TIMED_OUT" || previous === "CLOSED");
    if (recovered) void refreshCanonicalRoom("CHANNEL_RESUBSCRIBED");
  }, [notice.status, refreshCanonicalRoom]);

  useEffect(() => {
    if (!enabled || !room?.id) return;
    void refreshCanonicalRoom("MOUNT");

    const recoverOnline = () => void refreshCanonicalRoom("BROWSER_ONLINE");
    const recoverFocus = () => void refreshCanonicalRoom("WINDOW_FOCUS");
    const recoverVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshCanonicalRoom("DOCUMENT_VISIBLE");
      }
    };
    window.addEventListener("online", recoverOnline);
    window.addEventListener("focus", recoverFocus);
    document.addEventListener("visibilitychange", recoverVisibility);
    return () => {
      window.removeEventListener("online", recoverOnline);
      window.removeEventListener("focus", recoverFocus);
      document.removeEventListener("visibilitychange", recoverVisibility);
    };
  }, [enabled, refreshCanonicalRoom, room?.id]);

  useEffect(() => {
    const expiresAt = room?.presentationGate?.expiresAt;
    if (!expiresAt || !isBaseballPresentationGateBlocking(room, Date.now())) return;
    const delay = Math.max(0, Date.parse(expiresAt) - Date.now()) + 25;
    const timer = window.setTimeout(() => setPresentationClock(Date.now()), delay);
    return () => window.clearTimeout(timer);
  }, [room]);

  const availablePitches = useMemo(
    () => game ? getCurrentPitcher(game).pitching?.pitches.map((pitch) => pitch.type) ?? [] : [],
    [game],
  );

  useEffect(() => {
    if (availablePitches.length > 0 && !availablePitches.includes(selectedPitchType)) {
      setSelectedPitchType(availablePitches[0]);
    }
  }, [availablePitches, selectedPitchType]);

  const setAim = useCallback((next: Vec2 | ((current: Vec2) => Vec2)) => {
    setAimState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      return {
        x: clamp(value.x, 0.03, 0.97),
        y: clamp(value.y, 0.03, 0.97),
      };
    });
  }, []);

  const runEnvelope = useCallback(async (
    envelope: BaseballMatchCommandEnvelope | null,
    requireOpponent = true,
    allowStaleIdempotentRetry = false,
  ) => {
    const current = roomRef.current;
    if (requireOpponent && (!presenceAllConnectedRef.current || !presenceGateRef.current)) {
      if (mountedRef.current) setError({ status: 409, code: "OPPONENT_OFFLINE" });
      return false;
    }
    if (!current || !envelope || commandInFlightRef.current) {
      if (!envelope && mountedRef.current) {
        setError({ status: 403, code: "NOT_YOUR_TURN" });
      }
      return false;
    }
    if (!allowStaleIdempotentRetry && (
      envelope.baseRoomRevision !== current.revision
      || envelope.baseGameRevision !== current.gameState?.revision
    )) {
      void refreshCanonicalRoom("LOCAL_STALE_GUARD");
      return false;
    }

    commandInFlightRef.current = true;
    if (mountedRef.current) {
      setBusy(true);
      setError(null);
    }
    try {
      const result = await executeBaseballOnlineCommandCycle({
        currentRoom: current,
        envelope,
        sendCommand: commandSender,
        broadcastNotice: notice.sendCommitNotice,
        refetchRoom: async () => refreshCanonicalRoom("COMMAND_COMMITTED"),
        onCanonicalRoom: commitCanonicalRoom,
      });
      if (result.outcome === "COMMITTED") return true;
      if (mountedRef.current) {
        setError({
          status: result.outcome === "CONFLICT" ? 409 : result.status,
          code: result.code,
        });
      }
      return false;
    } catch {
      if (mountedRef.current) setError({ status: 0, code: "COMMAND_CYCLE_FAILED" });
      return false;
    } finally {
      commandInFlightRef.current = false;
      if (mountedRef.current) setBusy(false);
    }
  }, [commandSender, commitCanonicalRoom, notice.sendCommitNotice, refreshCanonicalRoom]);

  const submitPitch = useCallback((timingQuality: PitchQuality = "GOOD") => {
    const current = roomRef.current;
    if (!current || actorSeat === null) return Promise.resolve(false);
    const pitchType = availablePitches.includes(selectedPitchType)
      ? selectedPitchType
      : availablePitches[0];
    if (!pitchType) return Promise.resolve(false);
    return runEnvelope(buildOnlineStartPitchEnvelope(current, actorSeat, {
      pitchType,
      target: aim,
      timingQuality,
    }));
  }, [actorSeat, aim, availablePitches, runEnvelope, selectedPitchType]);

  const submitSwing = useCallback((progress = 0.72) => {
    const current = roomRef.current;
    if (!current || actorSeat === null) return Promise.resolve(false);
    return runEnvelope(buildOnlineBatterActionEnvelope(current, actorSeat, {
      kind: "SWING",
      swingType,
      aim,
      progress,
    }));
  }, [actorSeat, aim, runEnvelope, swingType]);

  const submitTake = useCallback(() => {
    const current = roomRef.current;
    if (!current || actorSeat === null) return Promise.resolve(false);
    return runEnvelope(buildOnlineBatterActionEnvelope(current, actorSeat, { kind: "TAKE" }));
  }, [actorSeat, runEnvelope]);

  const acknowledgePresentation = useCallback(async (requestedPlayId?: string) => {
    if (actorSeat === null) return false;
    const initial = roomRef.current;
    const playId = requestedPlayId ?? initial?.presentationGate?.playId;
    if (!initial || !playId) return false;

    // Both clients commonly finish on the same frame and race on the same CAS
    // revision. Exact retry first preserves idempotency after a lost response;
    // a fresh envelope then retries against the canonical revision won by the
    // other seat.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const current = roomRef.current;
      const gate = current?.presentationGate;
      if (!current || !gate || gate.playId !== playId) return true;
      if (hasBaseballPresentationAcknowledgement(gate, actorSeat)) return true;

      const envelope = buildOnlinePresentationAckEnvelope(current, actorSeat, { playId });
      if (!envelope) return false;
      if (await runEnvelope(envelope, false)) return true;
      if (hasBaseballPresentationAcknowledgement(
        roomRef.current?.presentationGate,
        actorSeat,
      )) return true;
      if (await runEnvelope(envelope, false, true)) return true;
    }
    return hasBaseballPresentationAcknowledgement(
      roomRef.current?.presentationGate,
      actorSeat,
    );
  }, [actorSeat, runEnvelope]);

  const clearError = useCallback(() => setError(null), []);
  const presenceReady = presence.allPlayersConnected && presenceGateRef.current
    && !presenceRecoveryPending;
  const presentationPending = Boolean(
    room && isBaseballPresentationGateBlocking(room, presentationClock),
  );

  return {
    room,
    game,
    actorSeat,
    role,
    canPitch: role === "PITCHING" && !busy && presenceReady && !presentationPending,
    canBat: role === "BATTING" && !busy && presenceReady,
    aim,
    setAim,
    selectedPitchType,
    setSelectedPitchType,
    swingType,
    setSwingType,
    availablePitches,
    busy,
    recovering,
    error,
    clearError,
    lastSyncReason,
    noticeStatus: notice.status,
    latestNotice: notice.latestNotice,
    presenceStatus: presence.status,
    connectedAuthIds: presence.connectedAuthIds,
    selfConnected: presence.selfConnected,
    opponentConnected: presence.opponentConnected,
    allPlayersConnected: presence.allPlayersConnected,
    presenceRecoveryPending,
    presentationPending,
    presentationGate: room?.presentationGate,
    refresh: refreshCanonicalRoom,
    acknowledgePresentation,
    submitPitch,
    submitSwing,
    submitTake,
  };
}

export default useBaseballOnlineController;
