import { useEffect, useRef } from "react";

import {
  BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
  baseballRoomCommandClient,
  type BaseballRoomCommandResult,
} from "../services/baseballRoomCommandClient.ts";
import type { BaseballRoom, BaseballRoomPlayer } from "../types/baseballRoom.ts";

type UpdateRoom = (room: BaseballRoom) => unknown;

export const BASEBALL_PRESENCE_HEARTBEAT_MS = 15_000;
export const BASEBALL_PRESENCE_STALE_AFTER_MS = 90_000;
export const BASEBALL_PRESENCE_STALE_CONFIRM_MS = 30_000;
export const BASEBALL_PRESENCE_START_MAX_AGE_MS = 45_000;

const BASEBALL_PRESENCE_CLAIM_RETRY_MS = 5_000;

export interface BaseballPresenceStaleCandidate {
  sessionId: string;
  firstObservedAt: number;
}

export type BaseballPresenceStaleCandidates = Readonly<
  Record<string, BaseballPresenceStaleCandidate>
>;

export interface BaseballPresenceStaleReconciliation {
  candidates: Record<string, BaseballPresenceStaleCandidate>;
  confirmedStudentIds: number[];
}

type PresenceOwnershipPhase = "unclaimed" | "claiming" | "owned" | "superseded";

interface PresenceOwnership {
  identity: string;
  phase: PresenceOwnershipPhase;
  claimStartedAt: number;
}

function presenceIdentity(roomId: string, currentUserId: number) {
  return `${roomId}:${currentUserId}`;
}

function parsedLastSeenAt(player: Pick<BaseballRoomPlayer, "lastSeenAt">) {
  if (!player.lastSeenAt) return null;
  const parsed = Date.parse(player.lastSeenAt);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isBaseballPresenceStale(
  player: Pick<BaseballRoomPlayer, "sessionId" | "lastSeenAt">,
  nowMs: number,
  staleAfterMs = BASEBALL_PRESENCE_STALE_AFTER_MS,
) {
  if (
    !player.sessionId
    || !Number.isFinite(nowMs)
    || !Number.isFinite(staleAfterMs)
    || staleAfterMs < 0
  ) return false;
  const lastSeenAt = parsedLastSeenAt(player);
  if (lastSeenAt === null || lastSeenAt > nowMs) return false;
  return nowMs - lastSeenAt >= staleAfterMs;
}

/** A ready flag alone is insufficient: both seats must have a recent live session. */
export function isBaseballPresenceFreshForStart(
  player: Pick<BaseballRoomPlayer, "sessionId" | "lastSeenAt">,
  nowMs: number,
  maximumAgeMs = BASEBALL_PRESENCE_START_MAX_AGE_MS,
) {
  if (!player.sessionId || !Number.isFinite(nowMs) || maximumAgeMs < 0) return false;
  const lastSeenAt = parsedLastSeenAt(player);
  if (lastSeenAt === null || lastSeenAt > nowMs + BASEBALL_PRESENCE_HEARTBEAT_MS) return false;
  return nowMs - lastSeenAt <= maximumAgeMs;
}

export function withBaseballPresenceHeartbeat(
  room: BaseballRoom,
  currentUserId: number,
  sessionId: string,
  nowMs: number,
): BaseballRoom | null {
  const player = room.players.find((item) => item.studentId === currentUserId);
  if (!player || !sessionId || !Number.isFinite(nowMs)) return null;

  const heartbeatDate = new Date(nowMs);
  if (!Number.isFinite(heartbeatDate.getTime())) return null;
  const lastSeenAt = heartbeatDate.toISOString();
  return {
    ...room,
    revision: room.revision + 1,
    players: room.players.map((item) => (
      item.studentId === currentUserId
        ? { ...item, sessionId, lastSeenAt }
        : item
    )),
  };
}

export function reconcileBaseballStaleCandidates(
  room: BaseballRoom,
  currentUserId: number,
  nowMs: number,
  previous: BaseballPresenceStaleCandidates,
  staleAfterMs = BASEBALL_PRESENCE_STALE_AFTER_MS,
  confirmAfterMs = BASEBALL_PRESENCE_STALE_CONFIRM_MS,
): BaseballPresenceStaleReconciliation {
  const candidates: Record<string, BaseballPresenceStaleCandidate> = {};
  const confirmedStudentIds: number[] = [];

  for (const player of room.players) {
    if (
      player.studentId === currentUserId
      || !isBaseballPresenceStale(player, nowMs, staleAfterMs)
      || !player.sessionId
    ) continue;

    const key = String(player.studentId);
    const existing = previous[key];
    const candidate = existing?.sessionId === player.sessionId
      ? existing
      : { sessionId: player.sessionId, firstObservedAt: nowMs };
    candidates[key] = candidate;

    if (nowMs - candidate.firstObservedAt >= Math.max(0, confirmAfterMs)) {
      confirmedStudentIds.push(player.studentId);
    }
  }

  return { candidates, confirmedStudentIds };
}

export function isBaseballRoomPath(roomId: string, destinationPath: string) {
  const roomPath = `/games/baseball/rooms/${roomId}`;
  return destinationPath === roomPath || destinationPath.startsWith(`${roomPath}/`);
}

export function useBaseballRoomPresence(
  room: BaseballRoom,
  currentUserId: number | undefined,
  updateRoom: UpdateRoom,
) {
  const roomRef = useRef(room);
  const sessionIdRef = useRef(baseballRoomCommandClient.getSessionId());
  const ownershipRef = useRef<PresenceOwnership>({
    identity: "",
    phase: "unclaimed",
    claimStartedAt: 0,
  });
  const sessionId = sessionIdRef.current;
  const heartbeatInFlightRef = useRef(false);
  const currentPlayer = room.players.find(
    (player) => player.studentId === currentUserId,
  );
  const currentSessionId = currentPlayer?.sessionId;
  const isCurrentPlayerPresent = currentPlayer !== undefined;

  roomRef.current = room;

  useEffect(() => {
    if (!currentUserId) return;

    const identity = presenceIdentity(room.id, currentUserId);
    const ownership = ownershipRef.current;
    if (ownership.identity !== identity) {
      ownership.identity = identity;
      ownership.phase = "unclaimed";
      ownership.claimStartedAt = 0;
    }

    const player = roomRef.current.players.find((item) => item.studentId === currentUserId);
    if (!player) {
      ownership.phase = "unclaimed";
      ownership.claimStartedAt = 0;
      return;
    }

    if (player.sessionId === sessionId) {
      ownership.phase = "owned";
      ownership.claimStartedAt = 0;
      return;
    }

    if (ownership.phase === "owned" && player.sessionId) {
      // A newer tab or a freshly reloaded page claimed this player. This old hook must
      // never reclaim the seat or remove the newer session when it later navigates away.
      ownership.phase = "superseded";
      return;
    }
    if (ownership.phase === "owned") ownership.phase = "unclaimed";
  }, [currentSessionId, currentUserId, isCurrentPlayerPresent, room.id, sessionId, updateRoom]);

  useEffect(() => {
    if (
      !currentUserId
      || typeof window === "undefined"
      || !["recruiting", "ready", "full"].includes(room.status)
    ) return;

    const applyResult = (result: BaseballRoomCommandResult) => {
      if (result.room) {
        roomRef.current = result.room;
        updateRoom(result.room);
        void import("../services/storage/baseballRoomStorage.ts").then(
          ({ baseballRoomStorage }) => baseballRoomStorage.cacheCanonicalRoom(result.room!),
        );
      } else if (result.ok && result.deleted) {
        const roomId = roomRef.current.id;
        void import("../services/storage/baseballRoomStorage.ts").then(
          ({ baseballRoomStorage }) => baseballRoomStorage.deleteCachedRoom(roomId),
        );
      }
    };

    const sendHeartbeat = async (forceHeartbeat: boolean) => {
      const nowMs = Date.now();
      const ownership = ownershipRef.current;
      const identity = presenceIdentity(roomRef.current.id, currentUserId);
      if (
        ownership.identity !== identity
        || ownership.phase === "superseded"
        || heartbeatInFlightRef.current
      ) return;

      const player = roomRef.current.players.find((item) => item.studentId === currentUserId);
      if (!player) return;
      const lastSeenAt = parsedLastSeenAt(player);
      const heartbeatDue = lastSeenAt === null
        || nowMs - lastSeenAt >= BASEBALL_PRESENCE_HEARTBEAT_MS;
      const claimRetryDue = ownership.phase === "claiming"
        && nowMs - ownership.claimStartedAt >= BASEBALL_PRESENCE_CLAIM_RETRY_MS;
      if (!forceHeartbeat && !heartbeatDue && !claimRetryDue) return;

      const wasOwned = ownership.phase === "owned";
      if (!wasOwned) ownership.phase = "claiming";
      ownership.claimStartedAt = nowMs;
      heartbeatInFlightRef.current = true;
      try {
        const commandId = baseballRoomCommandClient.createCommandId("HEARTBEAT");
        const sendAtRevision = (expectedRevision: number) => baseballRoomCommandClient.send({
          schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
          commandId,
          kind: "HEARTBEAT",
          roomId: roomRef.current.id,
          expectedRevision,
          payload: { sessionId },
        });
        let result = await sendAtRevision(roomRef.current.revision);
        applyResult(result);

        // A concurrent ready/join/heartbeat may win the CAS. Adopt its canonical
        // room and retry exactly once, unless another tab already owns our seat.
        if (!result.ok && result.status === 409 && result.room) {
          const canonicalPlayer = result.room.players.find(
            (item) => item.studentId === currentUserId,
          );
          if (
            canonicalPlayer
            && !(wasOwned && canonicalPlayer.sessionId !== sessionId)
          ) {
            result = await sendAtRevision(result.room.revision);
            applyResult(result);
          } else if (wasOwned && canonicalPlayer?.sessionId !== sessionId) {
            ownership.phase = "superseded";
          }
        }

        const canonicalPlayer = result.room?.players.find(
          (item) => item.studentId === currentUserId,
        );
        if (result.ok && canonicalPlayer?.sessionId === sessionId) {
          ownership.phase = "owned";
          ownership.claimStartedAt = 0;
        } else if (
          wasOwned
          && canonicalPlayer?.sessionId
          && canonicalPlayer.sessionId !== sessionId
        ) {
          ownership.phase = "superseded";
        }
      } finally {
        heartbeatInFlightRef.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void sendHeartbeat(true);
    };
    const handleResume = () => void sendHeartbeat(true);

    const heartbeatTimer = window.setInterval(
      () => void sendHeartbeat(false),
      BASEBALL_PRESENCE_HEARTBEAT_MS,
    );
    void sendHeartbeat(true);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleResume);
    window.addEventListener("pageshow", handleResume);

    return () => {
      window.clearInterval(heartbeatTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleResume);
      window.removeEventListener("pageshow", handleResume);
    };
  }, [currentUserId, room.id, room.status, sessionId, updateRoom]);

  useEffect(() => {
    if (!currentUserId || typeof window === "undefined") return;

    const leaveForNavigation = (destinationPath: string) => {
      if (isBaseballRoomPath(roomRef.current.id, destinationPath)) return;
      const player = roomRef.current.players.find(
        (item) => item.studentId === currentUserId,
      );
      if (player?.sessionId !== sessionId) return;
      const roomId = roomRef.current.id;
      const commandId = baseballRoomCommandClient.createCommandId("LEAVE");
      const sendAtRevision = (expectedRevision: number) => baseballRoomCommandClient.send({
          schemaVersion: BASEBALL_ROOM_COMMAND_SCHEMA_VERSION,
          commandId,
          kind: "LEAVE",
          roomId,
          expectedRevision,
          payload: { sessionId },
        });
      const applyLeaveResult = (result: BaseballRoomCommandResult) => {
        if (result.room) {
          roomRef.current = result.room;
          updateRoom(result.room);
          void import("../services/storage/baseballRoomStorage.ts").then(
            ({ baseballRoomStorage }) => baseballRoomStorage.cacheCanonicalRoom(result.room!),
          );
        } else if (result.ok && result.deleted) {
          void import("../services/storage/baseballRoomStorage.ts").then(
            ({ baseballRoomStorage }) => baseballRoomStorage.deleteCachedRoom(roomId),
          );
        }
      };
      void (async () => {
        let result = await sendAtRevision(roomRef.current.revision);
        applyLeaveResult(result);
        if (!result.ok && result.status === 409 && result.room) {
          result = await sendAtRevision(result.room.revision);
          applyLeaveResult(result);
        }
      })();
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey
      ) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin) leaveForNavigation(destination.pathname);
    };

    const handlePopState = () => {
      window.setTimeout(() => leaveForNavigation(window.location.pathname), 0);
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentUserId, sessionId, updateRoom]);

  return sessionId;
}
