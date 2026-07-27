export type CardSuit = "S" | "H" | "D" | "C"; // Spades Hearts Diamonds Clubs
export type CardRank = "2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"10"|"J"|"Q"|"K"|"A";

export type BangCardKind =
  | "bang" | "missed" | "beer" | "saloon" | "indians" | "gatling"
  | "duel" | "general_store" | "stagecoach" | "wells_fargo" | "cat_balou" | "panic"
  | "volcanic" | "schofield" | "remington" | "rev_carbine" | "winchester"
  | "barrel" | "dynamite" | "jail" | "scope" | "mustang";

export interface BangCard {
  id: string;
  kind: BangCardKind;
  suit: CardSuit;
  rank: CardRank;
}

export const CARD_NAME: Record<BangCardKind, string> = {
  bang: "BANG!", missed: "Missed!", beer: "맥주", saloon: "살롱",
  indians: "인디언", gatling: "개틀링", duel: "결투",
  general_store: "잡화점",
  stagecoach: "역마차", wells_fargo: "웰스파고", cat_balou: "캣발루", panic: "패닉",
  volcanic: "화산총", schofield: "스코필드", remington: "레밍턴",
  rev_carbine: "회전소총", winchester: "윈체스터",
  barrel: "통", dynamite: "다이너마이트", jail: "감옥", scope: "조준경", mustang: "무스탕",
};

export const CARD_DESC: Record<BangCardKind, string> = {
  bang: "사거리 내 플레이어 1명에게 1 피해",
  missed: "BANG! 또는 개틀링 1회 회피",
  beer: "자신의 체력을 1 회복",
  saloon: "모든 플레이어 체력 1 회복",
  indians: "자신을 제외한 모든 플레이어가 BANG! 또는 1 피해",
  gatling: "자신을 제외한 모든 플레이어에게 BANG! (Missed!로 막기 가능)",
  duel: "대상 플레이어와 결투. 교대로 BANG! 내고 못 내면 1 피해",
  general_store: "생존자 수만큼 카드를 공개하고 차례대로 1장씩 선택",
  stagecoach: "카드 2장 드로우",
  wells_fargo: "카드 3장 드로우",
  cat_balou: "임의 플레이어의 카드 1장(손패 또는 장착) 버리기",
  panic: "인접 플레이어의 손패에서 카드 1장 가져오기",
  volcanic: "이번 턴에 BANG! 무제한 사용 가능. 사거리 1.",
  schofield: "BANG! 사거리 +1 (사거리 2)",
  remington: "BANG! 사거리 +2 (사거리 3)",
  rev_carbine: "BANG! 사거리 +3 (사거리 4)",
  winchester: "BANG! 사거리 +4 (사거리 5)",
  barrel: "BANG! 대상이 될 때 드로우—하트면 자동 회피",
  dynamite: "다음 턴 시작 시 드로우—스페이드 2~9이면 3 피해, 아니면 왼쪽에 전달",
  jail: "대상이 된 플레이어는 다음 턴 시작에 드로우—하트가 아니면 턴 스킵",
  scope: "다른 플레이어를 1 더 가까이 봄 (공격 사거리 +1)",
  mustang: "다른 플레이어가 나를 1 더 멀리 봄 (방어 거리 +1)",
};

export const IS_EQUIPMENT: Record<BangCardKind, boolean> = {
  bang: false, missed: false, beer: false, saloon: false, indians: false, gatling: false,
  duel: false, stagecoach: false, wells_fargo: false, cat_balou: false, panic: false,
  general_store: false,
  volcanic: true, schofield: true, remington: true, rev_carbine: true, winchester: true,
  barrel: true, dynamite: true, jail: true, scope: true, mustang: true,
};

export const CARD_EMOJI: Record<BangCardKind, string> = {
  bang: "🔫", missed: "💨", beer: "🍺", saloon: "🏠",
  indians: "🪶", gatling: "⚙️", duel: "🤝",
  general_store: "🛒",
  stagecoach: "🐴", wells_fargo: "🏦", cat_balou: "🐱", panic: "😱",
  volcanic: "🌋", schofield: "🔫", remington: "🔫",
  rev_carbine: "🔫", winchester: "🔫",
  barrel: "🛢️", dynamite: "💣", jail: "⛓️", scope: "🔭", mustang: "🐎",
};

export const SUIT_SYMBOL: Record<CardSuit, string> = {
  S: "♠", H: "♥", D: "♦", C: "♣",
};
export const SUIT_COLOR: Record<CardSuit, string> = {
  S: "text-gray-800", H: "text-red-600", D: "text-red-600", C: "text-gray-800",
};

export const WEAPON_KINDS: BangCardKind[] = ["volcanic", "schofield", "remington", "rev_carbine", "winchester"];
export const WEAPON_RANGE: Partial<Record<BangCardKind, number>> = {
  volcanic: 1, schofield: 2, remington: 3, rev_carbine: 4, winchester: 5,
};

// Pending action — waiting for a player response
export type PendingAction =
  | { type: "await_target"; action: "bang" | "duel" | "jail_on"; cardId: string; fromId: number }
  | { type: "await_cat_balou"; cardId: string; fromId: number }
  | { type: "await_panic"; cardId: string; fromId: number }
  | { type: "bang_response"; fromId: number; targetId: number; cardId: string; missesNeeded: number; missesPlayed: number }
  | { type: "indians_response"; fromId: number; remaining: number[] }
  | { type: "gatling_response"; fromId: number; remaining: number[] }
  | { type: "general_store_pick"; fromId: number; remaining: number[]; available: BangCard[] }
  | { type: "duel_response"; p1: number; p2: number; currentId: number }
  | { type: "discard"; playerId: number; excess: number };

export interface BangCardGameState {
  drawPile: BangCard[];
  discardPile: BangCard[];
  hands: Record<string, BangCard[]>;      // String(studentId) -> hand
  equipment: Record<string, BangCard[]>;  // String(studentId) -> equipped
  phase: "draw" | "play" | "discard" | "done";
  bangUsed: boolean;
  pending?: PendingAction;
  log: string[];
}
