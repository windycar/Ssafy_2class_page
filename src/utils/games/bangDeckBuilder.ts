import type { BangCard, BangCardKind, CardSuit, CardRank } from "../../types/bangCards";
import type { BangCharacterId } from "../../types/bangCharacters";
import { shuffleArray } from "../shuffleArray";

let _uid = 0;
const c = (kind: BangCardKind, suit: CardSuit, rank: CardRank): BangCard => ({
  id: `${kind}-${suit}${rank}-${++_uid}`,
  kind, suit, rank,
});

export function createBangDeck(): BangCard[] {
  const deck: BangCard[] = [
    // ── BANG! (25) ──────────────────────────────────────────
    c("bang","S","2"), c("bang","S","3"), c("bang","S","4"), c("bang","S","5"),
    c("bang","S","6"), c("bang","S","7"), c("bang","S","8"), c("bang","S","9"),
    c("bang","S","A"),
    c("bang","H","Q"), c("bang","H","K"), c("bang","H","A"),
    c("bang","D","2"), c("bang","D","3"), c("bang","D","4"), c("bang","D","5"),
    c("bang","D","6"), c("bang","D","7"), c("bang","D","8"), c("bang","D","9"), c("bang","D","10"),
    c("bang","C","2"), c("bang","C","3"), c("bang","C","4"), c("bang","C","5"),
    // ── Missed! (12) ────────────────────────────────────────
    c("missed","S","10"), c("missed","S","J"), c("missed","S","Q"), c("missed","S","K"),
    c("missed","H","2"), c("missed","H","3"), c("missed","H","4"), c("missed","H","5"),
    c("missed","C","6"), c("missed","C","7"), c("missed","C","8"), c("missed","C","9"),
    // ── Beer (6) ────────────────────────────────────────────
    c("beer","H","6"), c("beer","H","7"), c("beer","H","8"),
    c("beer","H","9"), c("beer","H","10"), c("beer","H","J"),
    // ── Saloon (1) ──────────────────────────────────────────
    c("saloon","H","A"),
    // ── Indians! (2) ────────────────────────────────────────
    c("indians","D","K"), c("indians","D","A"),
    // ── Gatling (1) ─────────────────────────────────────────
    c("gatling","H","10"),
    // ── Duel (3) ────────────────────────────────────────────
    c("duel","S","J"), c("duel","D","J"), c("duel","C","J"),
    // ── General Store (2) ───────────────────────────────────
    c("general_store","C","9"), c("general_store","S","Q"),
    // ── Stagecoach (2) ──────────────────────────────────────
    c("stagecoach","S","9"), c("stagecoach","S","9"),
    // ── Wells Fargo (1) ─────────────────────────────────────
    c("wells_fargo","H","3"),
    // ── Cat Balou (4) ───────────────────────────────────────
    c("cat_balou","D","J"), c("cat_balou","H","J"),
    c("cat_balou","C","Q"), c("cat_balou","D","9"),
    // ── Panic! (4) ──────────────────────────────────────────
    c("panic","H","A"), c("panic","D","A"), c("panic","S","A"), c("panic","H","J"),
    // ── Volcanic (2) ────────────────────────────────────────
    c("volcanic","S","10"), c("volcanic","C","10"),
    // ── Schofield (3) ───────────────────────────────────────
    c("schofield","S","J"), c("schofield","C","J"), c("schofield","H","J"),
    // ── Remington (1) ───────────────────────────────────────
    c("remington","C","K"),
    // ── Rev. Carbine (1) ────────────────────────────────────
    c("rev_carbine","C","A"),
    // ── Winchester (1) ──────────────────────────────────────
    c("winchester","S","8"),
    // ── Barrel (2) ──────────────────────────────────────────
    c("barrel","S","Q"), c("barrel","S","K"),
    // ── Dynamite (1) ────────────────────────────────────────
    c("dynamite","H","Q"),
    // ── Jail (3) ────────────────────────────────────────────
    c("jail","S","J"), c("jail","S","Q"), c("jail","H","Q"),
    // ── Scope (1) ───────────────────────────────────────────
    c("scope","S","A"),
    // ── Mustang (2) ─────────────────────────────────────────
    c("mustang","H","A"), c("mustang","H","A"),
  ];

  return shuffleArray(deck);
}

/** Draw! mechanic — returns true if the drawn card counts as a "hit" */
export function drawCheck(card: BangCard, condition: "barrel" | "dynamite" | "jail"): boolean {
  if (condition === "barrel") {
    // Barrel: miss (lucky) if Hearts
    return card.suit !== "H";
  }
  if (condition === "dynamite") {
    // Dynamite explodes if Spades 2–9
    const boom: CardRank[] = ["2","3","4","5","6","7","8","9"];
    return card.suit === "S" && boom.includes(card.rank);
  }
  if (condition === "jail") {
    // Jail: escape if Hearts
    return card.suit === "H";
  }
  return false;
}

export function getWeaponRange(equipment: BangCard[]): number {
  const ranges: Partial<Record<string, number>> = { volcanic: 1, schofield: 2, remington: 3, rev_carbine: 4, winchester: 5 };
  let max = 1;
  for (const eq of equipment) {
    const r = ranges[eq.kind];
    if (r && r > max) max = r;
  }
  return max;
}

export function hasVolcanic(equipment: BangCard[]): boolean {
  return equipment.some(e => e.kind === "volcanic");
}

export function effectiveDistance(
  fromIdx: number,
  toIdx: number,
  total: number,
  fromEquip: BangCard[],
  toEquip: BangCard[],
  fromCharacter?: BangCharacterId,
  toCharacter?: BangCharacterId,
): number {
  const cw = Math.abs(toIdx - fromIdx);
  const base = Math.min(cw, total - cw);
  const scopeBonus = fromEquip.some(e => e.kind === "scope") || fromCharacter === "rose_doolan" ? -1 : 0;
  const mustangPenalty = toEquip.some(e => e.kind === "mustang") || toCharacter === "paul_regret" ? 1 : 0;
  return Math.max(1, base + mustangPenalty + scopeBonus);
}

export function canTarget(
  fromIdx: number,
  toIdx: number,
  total: number,
  fromEquip: BangCard[],
  toEquip: BangCard[],
  fromCharacter?: BangCharacterId,
  toCharacter?: BangCharacterId,
): boolean {
  const dist = effectiveDistance(fromIdx, toIdx, total, fromEquip, toEquip, fromCharacter, toCharacter);
  return dist <= getWeaponRange(fromEquip);
}

export function isAdjacent(fromIdx: number, toIdx: number, total: number): boolean {
  const cw = Math.abs(toIdx - fromIdx);
  return Math.min(cw, total - cw) === 1;
}
