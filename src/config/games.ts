import type { GameDefinition } from "../types/game";
import bangHubArt from "../assets/games/bang-hub-art.png";

export const GAMES: GameDefinition[] = [
  {
    id: "bang",
    name: "뱅!",
    description: "역할을 숨기고 서로의 정체를 추리하는 서부 테마 보드게임",
    minPlayers: 4,
    maxPlayers: 7,
    estimatedMinutes: "20~40",
    category: ["추리", "전략"],
    route: "/games/bang",
    isAvailable: true,
    icon: "🤠",
    image: bangHubArt,
    themeColor: "#b45309",
  },
];

