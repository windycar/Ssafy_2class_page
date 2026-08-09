import type { BaseballGameState } from "../utils/games/baseballEngine";
import type { GameRoomStatus } from "./game";

export type BaseballRoomPlayerStatus = "waiting" | "ready" | "playing";

export interface BaseballRoomPlayer {
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

export interface BaseballRoom {
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
}
