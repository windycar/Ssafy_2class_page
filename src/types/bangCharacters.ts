export type BangCharacterId =
  | "bart_cassidy"
  | "black_jack"
  | "calamity_janet"
  | "el_gringo"
  | "jesse_jones"
  | "jourdonnais"
  | "kit_carlson"
  | "lucky_duke"
  | "paul_regret"
  | "pedro_ramirez"
  | "rose_doolan"
  | "sid_ketchum"
  | "slab_the_killer"
  | "suzy_lafayette"
  | "vulture_sam"
  | "willy_the_kid";

export interface BangCharacter {
  id: BangCharacterId;
  name: string;
  life: 3 | 4;
  emoji: string;
  ability: string;
}

export const BANG_CHARACTERS: BangCharacter[] = [
  { id: "bart_cassidy", name: "바트 캐시디", life: 4, emoji: "🎩", ability: "생명력을 잃을 때마다 카드 1장을 뽑습니다." },
  { id: "black_jack", name: "블랙 잭", life: 4, emoji: "🃏", ability: "드로우 두 번째 카드가 하트/다이아면 1장을 더 뽑습니다." },
  { id: "calamity_janet", name: "캘러미티 재닛", life: 4, emoji: "🎯", ability: "BANG!과 Missed!를 서로 바꾸어 사용할 수 있습니다." },
  { id: "el_gringo", name: "엘 그링고", life: 3, emoji: "🌵", ability: "다른 플레이어에게 생명력을 잃으면 그 플레이어의 손에서 카드 1장을 가져옵니다." },
  { id: "jesse_jones", name: "제시 존스", life: 4, emoji: "🕵️", ability: "드로우 첫 카드를 다른 플레이어의 손에서 가져올 수 있습니다." },
  { id: "jourdonnais", name: "주르도네", life: 4, emoji: "🛢️", ability: "항상 통(Barrel)을 장착한 것처럼 판정합니다." },
  { id: "kit_carlson", name: "키트 칼슨", life: 4, emoji: "🦅", ability: "드로우할 때 3장을 보고 2장을 가진 뒤 1장을 덱 위에 돌려놓습니다." },
  { id: "lucky_duke", name: "럭키 듀크", life: 4, emoji: "🍀", ability: "드로우! 판정 때 2장을 공개하고 원하는 결과를 고릅니다." },
  { id: "paul_regret", name: "폴 리그렛", life: 3, emoji: "🐎", ability: "항상 야생마를 장착한 것처럼 다른 플레이어에게 1 더 멀리 보입니다." },
  { id: "pedro_ramirez", name: "페드로 라미레즈", life: 4, emoji: "♻️", ability: "드로우 첫 카드를 버린 카드 더미 맨 위에서 가져올 수 있습니다." },
  { id: "rose_doolan", name: "로즈 둘란", life: 4, emoji: "🔭", ability: "항상 조준경을 장착한 것처럼 다른 플레이어를 1 더 가깝게 봅니다." },
  { id: "sid_ketchum", name: "시드 케첨", life: 4, emoji: "💊", ability: "손패 2장을 버려 생명력 1을 회복할 수 있습니다." },
  { id: "slab_the_killer", name: "슬랩 더 킬러", life: 4, emoji: "💥", ability: "이 캐릭터의 BANG!을 피하려면 Missed! 2장이 필요합니다." },
  { id: "suzy_lafayette", name: "수지 라파예트", life: 4, emoji: "🎴", ability: "손패가 0장이 되는 즉시 카드 1장을 뽑습니다." },
  { id: "vulture_sam", name: "벌처 샘", life: 4, emoji: "🦅", ability: "플레이어가 탈락하면 그 플레이어의 모든 카드를 가져옵니다." },
  { id: "willy_the_kid", name: "윌리 더 키드", life: 4, emoji: "🤠", ability: "자신의 턴에 BANG!을 제한 없이 사용할 수 있습니다." },
];

export const BANG_CHARACTER_BY_ID = Object.fromEntries(
  BANG_CHARACTERS.map((character) => [character.id, character]),
) as Record<BangCharacterId, BangCharacter>;
