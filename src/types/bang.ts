import type { BangCardGameState } from "./bangCards";
import type { BangCharacterId } from "./bangCharacters";
import type { GameRoomStatus } from "./game";

export type BangRole = "sheriff" | "deputy" | "outlaw" | "renegade";

export type BangPlayerStatus = "waiting" | "ready" | "alive" | "eliminated";

export interface BangPlayer {
  studentId: number;
  name: string;
  username: string;
  isHost: boolean;
  isReady: boolean;
  status: BangPlayerStatus;
  role?: BangRole;
  characterOptions?: BangCharacterId[];
  characterId?: BangCharacterId;
  maxLife?: number;
  life: number;
  joinedAt: string;
  sessionId?: string;
  lastSeenAt?: string;
  eliminatedAt?: string;
}

export interface BangActivityLog {
  id: string;
  roomId: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface BangChatMessage {
  id: string;
  studentId: number;
  name: string;
  message: string;
  createdAt: string;
}

export type BangWinner = "sheriff_deputy" | "outlaw" | "renegade" | "draw" | "cancelled";

export interface BangRoom {
  id: string;
  cardState?: BangCardGameState;
  title: string;
  description: string;
  hostStudentId: number;
  maxPlayers: number;
  location: string;
  scheduledAt: string;
  recruitmentDeadline: string;
  isPublic: boolean;
  hostAutoJoin: boolean;
  status: GameRoomStatus;
  players: BangPlayer[];
  currentTurnStudentId?: number;
  turnOrder: number[];
  turnIndex: number;
  winner?: BangWinner;
  mvpStudentId?: number;
  review?: string;
  activityLogs: BangActivityLog[];
  chatMessages?: BangChatMessage[];
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}
