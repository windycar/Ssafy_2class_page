import type { GameDefinition } from "../types/game";
import bangHubArt from "../assets/games/bang-hub-art.png";
import baseballArena from "../assets/games/baseball-arena-facing.png";

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
  {
    id: "baseball",
    name: "광주 2반 야구",
    description: "타격 커서를 맞춰 장타를 노리는 1인·2인 캐주얼 야구게임",
    minPlayers: 1,
    maxPlayers: 2,
    estimatedMinutes: "3~5",
    category: ["아케이드", "대전"],
    route: "/games/baseball",
    isAvailable: true,
    icon: "⚾",
    image: baseballArena,
    themeColor: "#1259AA",
  },
];

