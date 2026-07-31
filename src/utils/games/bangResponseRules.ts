import type { BangCard } from "../../types/bangCards";
import type { BangCharacterId } from "../../types/bangCharacters";

export function getMissedResponseCards(
  hand: BangCard[],
  characterId?: BangCharacterId,
): BangCard[] {
  const missedCards = hand.filter(card => card.kind === "missed");
  if (characterId !== "calamity_janet") return missedCards;
  return [
    ...missedCards,
    ...hand.filter(card => card.kind === "bang"),
  ];
}

export function getBangResponseCards(
  hand: BangCard[],
  characterId?: BangCharacterId,
): BangCard[] {
  const bangCards = hand.filter(card => card.kind === "bang");
  if (characterId !== "calamity_janet") return bangCards;
  return [
    ...bangCards,
    ...hand.filter(card => card.kind === "missed"),
  ];
}

export function takeRequiredResponseCards(
  cards: BangCard[],
  requiredCount: number,
): BangCard[] | null {
  if (requiredCount <= 0) return [];
  if (cards.length < requiredCount) return null;
  return cards.slice(0, requiredCount);
}
