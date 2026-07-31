import assert from "node:assert/strict";
import test from "node:test";
import type { BangCard } from "../src/types/bangCards.ts";
import {
  getBangResponseCards,
  getMissedResponseCards,
  takeRequiredResponseCards,
} from "../src/utils/games/bangResponseRules.ts";

const cards: BangCard[] = [
  { id: "missed-1", kind: "missed", suit: "H", rank: "2" },
  { id: "bang-1", kind: "bang", suit: "S", rank: "A" },
  { id: "missed-2", kind: "missed", suit: "D", rank: "K" },
];

test("일반 캐릭터는 카드 종류에 맞는 대응 카드만 사용할 수 있다", () => {
  assert.deepEqual(getMissedResponseCards(cards).map(card => card.id), ["missed-1", "missed-2"]);
  assert.deepEqual(getBangResponseCards(cards).map(card => card.id), ["bang-1"]);
});

test("칼라미티 자넷은 BANG과 Missed를 서로 바꿔 대응할 수 있다", () => {
  assert.deepEqual(
    getMissedResponseCards(cards, "calamity_janet").map(card => card.id),
    ["missed-1", "missed-2", "bang-1"],
  );
  assert.deepEqual(
    getBangResponseCards(cards, "calamity_janet").map(card => card.id),
    ["bang-1", "missed-1", "missed-2"],
  );
});

test("필요한 대응 카드가 부족하면 일부 카드를 소비하지 않는다", () => {
  assert.equal(takeRequiredResponseCards(getMissedResponseCards(cards), 3), null);
  assert.deepEqual(
    takeRequiredResponseCards(getMissedResponseCards(cards), 2)?.map(card => card.id),
    ["missed-1", "missed-2"],
  );
});
