import type { BaseballGameState, TeamIndex } from "../utils/games/baseballEngine";
import type { GameRoomStatus } from "./game";

export const BASEBALL_ROOM_SCHEMA_VERSION = 2 as const;

export type BaseballRoomPlayerStatus = "waiting" | "ready" | "playing";

export interface BaseballRoomPlayer {
  seat: TeamIndex;
  studentId: number;
  authId: string;
  name: string;
  username: string;
  isHost: boolean;
  isReady: boolean;
  status: BaseballRoomPlayerStatus;
  joinedAt: string;
  sessionId?: string;
  lastSeenAt?: string;
}

export interface BaseballRoomActivity {
  id: string;
  roomId: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface BaseballPresentationGate {
  playId: string;
  openedAt: string;
  expiresAt: string;
  acknowledgedSeats: TeamIndex[];
  /**
   * Canonical game snapshot immediately before the batter action resolved.
   * Reconnecting clients use it so score, count, bases and batter order stay
   * unrevealed until the matching visual event reaches its reveal point.
   */
  displayBeforeResult?: BaseballGameState;
}

export interface BaseballRoom {
  schemaVersion: typeof BASEBALL_ROOM_SCHEMA_VERSION;
  revision: number;
  id: string;
  title: string;
  description: string;
  hostStudentId: number;
  maxPlayers: 2;
  isPublic: boolean;
  status: GameRoomStatus;
  players: BaseballRoomPlayer[];
  activityLogs: BaseballRoomActivity[];
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  matchId?: string;
  gameState?: BaseballGameState;
  /**
   * Server-authoritative playback barrier for the most recently resolved play.
   * It remains present after both acknowledgements until START_PITCH consumes it.
   */
  presentationGate?: BaseballPresentationGate;
}
