export type GameRoomStatus =
  | "recruiting"
  | "full"
  | "ready"
  | "playing"
  | "finished"
  | "cancelled";

export interface GameDefinition {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedMinutes: string;
  category: string[];
  route: string;
  isAvailable: boolean;
  icon: string;
  themeColor: string;
}

