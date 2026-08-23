import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  KIA_THEME_BATTERS,
  OPPONENT_PITCHERS,
} from "../src/data/games/baseball/players.ts";
import {
  IDEAL_SWING_PROGRESS,
  resolveBatterAction,
  STRIKE_ZONE,
} from "../src/utils/games/baseball/battingEngine.ts";
import type {
  BaseballCount,
  BaseballPlayer,
  ResolvedPitch,
  SwingType,
  Vec2,
} from "../src/utils/games/baseball/types.ts";

const BATTER = KIA_THEME_BATTERS[2];
const PITCHER = OPPONENT_PITCHERS[0];
const COUNT: BaseballCount = { balls: 1, strikes: 1, outs: 1 };

function pitchAt(
  actual: Vec2,
  overrides: Partial<ResolvedPitch> = {},
): ResolvedPitch {
  return {
    id: "test-pitch-17",
    pitcherId: PITCHER.id,
    pitchType: "fourSeam",
    quality: "GOOD",
    location: { intended: { ...actual }, actual: { ...actual } },
    velocityKmh: 146,
    spinRate: 2300,
    movement: 72,
    flightDurationMs: 440,
    trajectory: {
      start: { x: 0.43, y: -0.38 },
      control1: { x: 0.45, y: 0 },
      control2: { x: 0.48, y: 0.3 },
      target: { ...actual },
      velocityKmh: 146,
      spinRate: 2300,
      rotation: 0,
      progress: 0,
      breakX: 0,
      breakY: 0,
      pitchType: "fourSeam",
    },
    ...overrides,
  };
}

function swingAt(
  pitch: ResolvedPitch,
  options: {
    batter?: BaseballPlayer;
    swingType?: SwingType;
    aim?: Vec2;
    progress?: number;
    count?: BaseballCount;
    seed?: number;
  } = {},
) {
  const batter = options.batter ?? BATTER;
  return resolveBatterAction({
    pitch,
    batter,
    pitcher: PITCHER,
    count: options.count ?? COUNT,
    seed: options.seed ?? 20260823,
    action: {
      kind: "SWING",
      swing: {
        batterId: batter.id,
        swingType: options.swingType ?? "NORMAL",
        aim: options.aim ?? { ...pitch.location.actual },
        progress: options.progress ?? IDEAL_SWING_PROGRESS,
      },
    },
  });
}

test("동일 입력은 완전히 같은 타격 판정을 만들고 입력 객체를 변경하지 않는다", () => {
  const pitch = pitchAt({ x: 0.48, y: 0.51 });
  const snapshot = JSON.stringify(pitch);
  const first = swingAt(pitch, { swingType: "POWER", seed: 12345 });
  const replay = swingAt(pitch, { swingType: "POWER", seed: 12345 });

  assert.deepEqual(replay, first);
  assert.equal(JSON.stringify(pitch), snapshot);
  assert.notDeepEqual(swingAt(pitch, { swingType: "POWER", seed: 54321 }), first);
});

test("TAKE는 실제 도착점과 포함 경계의 스트라이크 존만 사용한다", () => {
  for (const point of [
    { x: STRIKE_ZONE.left, y: STRIKE_ZONE.top },
    { x: STRIKE_ZONE.right, y: STRIKE_ZONE.bottom },
    { x: 0.5, y: 0.5 },
  ]) {
    const resolution = resolveBatterAction({
      pitch: pitchAt(point),
      batter: BATTER,
      pitcher: PITCHER,
      count: COUNT,
      action: { kind: "TAKE", batterId: BATTER.id },
      seed: 1,
    });
    assert.equal(resolution.kind, "TAKE");
    assert.equal(resolution.take.result, "CALLED_STRIKE");
    assert.equal(resolution.take.inZone, true);
  }

  const outside = resolveBatterAction({
    pitch: pitchAt({ x: STRIKE_ZONE.right + 0.000001, y: 0.5 }),
    batter: BATTER,
    pitcher: PITCHER,
    count: COUNT,
    action: { kind: "TAKE", batterId: BATTER.id },
    seed: 1,
  });
  assert.equal(outside.kind, "TAKE");
  assert.equal(outside.take.result, "BALL");
  assert.equal(outside.take.inZone, false);
});

test("2스트라이크에서는 PCI와 타이밍 창이 보정되어 경계 타구를 파울로 살린다", () => {
  const pitch = pitchAt({ x: 0.5, y: 0.5 });
  const oneStrike = swingAt(pitch, {
    aim: { x: 0.735, y: 0.5 },
    progress: IDEAL_SWING_PROGRESS + 0.13,
    count: { balls: 1, strikes: 1, outs: 0 },
  });
  const twoStrikes = swingAt(pitch, {
    aim: { x: 0.735, y: 0.5 },
    progress: IDEAL_SWING_PROGRESS + 0.13,
    count: { balls: 1, strikes: 2, outs: 0 },
  });

  assert.equal(oneStrike.kind, "SWING");
  assert.equal(twoStrikes.kind, "SWING");
  assert.ok(twoStrikes.contact.pciRadius.x > oneStrike.contact.pciRadius.x);
  assert.ok(twoStrikes.contact.timingFit > oneStrike.contact.timingFit);
  assert.ok(twoStrikes.contact.contactScore > oneStrike.contact.contactScore);
  assert.equal(oneStrike.contact.result, "MISS");
  assert.equal(twoStrikes.contact.result, "FOUL");
});

test("CONTACT, NORMAL, POWER 순으로 PCI와 접촉 허용 폭이 좁아진다", () => {
  const pitch = pitchAt({ x: 0.5, y: 0.5 });
  const aim = { x: 0.675, y: 0.5 };
  const contact = swingAt(pitch, { swingType: "CONTACT", aim });
  const normal = swingAt(pitch, { swingType: "NORMAL", aim });
  const power = swingAt(pitch, { swingType: "POWER", aim });
  assert.equal(contact.kind, "SWING");
  assert.equal(normal.kind, "SWING");
  assert.equal(power.kind, "SWING");

  assert.ok(contact.contact.pciRadius.x > normal.contact.pciRadius.x);
  assert.ok(normal.contact.pciRadius.x > power.contact.pciRadius.x);
  assert.ok(contact.contact.contactScore > normal.contact.contactScore);
  assert.ok(normal.contact.contactScore > power.contact.contactScore);
});

test("contact와 eye가 높은 타자는 같은 공과 조작에서 더 큰 PCI와 높은 접촉 점수를 갖는다", () => {
  const weakBatter: BaseballPlayer = {
    ...BATTER,
    id: "weak-batter",
    contact: 40,
    eye: 40,
  };
  const strongBatter: BaseballPlayer = {
    ...BATTER,
    id: "strong-batter",
    contact: 95,
    eye: 95,
  };
  const pitch = pitchAt({ x: 0.5, y: 0.5 });
  const aim = { x: 0.66, y: 0.5 };
  const progress = IDEAL_SWING_PROGRESS + 0.05;
  const weak = swingAt(pitch, { batter: weakBatter, aim, progress });
  const strong = swingAt(pitch, { batter: strongBatter, aim, progress });
  assert.equal(weak.kind, "SWING");
  assert.equal(strong.kind, "SWING");
  assert.ok(strong.contact.pciRadius.x > weak.contact.pciRadius.x);
  assert.ok(strong.contact.timingFit > weak.contact.timingFit);
  assert.ok(strong.contact.contactScore > weak.contact.contactScore);
});

test("빠르고 변화가 큰 완벽한 구종은 느리고 변화가 작은 실투보다 어렵다", () => {
  const easyPitch = pitchAt({ x: 0.5, y: 0.5 }, {
    velocityKmh: 120,
    movement: 25,
    quality: "MISS",
    pitchType: "fourSeam",
  });
  const hardPitch = pitchAt({ x: 0.5, y: 0.5 }, {
    velocityKmh: 156,
    movement: 98,
    quality: "PERFECT",
    pitchType: "fork",
  });
  const progress = IDEAL_SWING_PROGRESS + 0.05;
  const easy = swingAt(easyPitch, { aim: { x: 0.62, y: 0.5 }, progress });
  const hard = swingAt(hardPitch, { aim: { x: 0.62, y: 0.5 }, progress });
  assert.equal(easy.kind, "SWING");
  assert.equal(hard.kind, "SWING");
  assert.ok(easy.contact.pciRadius.x > hard.contact.pciRadius.x);
  assert.ok(easy.contact.timingFit > hard.contact.timingFit);
  assert.ok(easy.contact.contactScore > hard.contact.contactScore);
});

test("빠른 스윙은 음수 timingOffset이며 스위치 타자는 투수 반대 타석을 선택한다", () => {
  const switchHitter: BaseballPlayer = { ...BATTER, id: "switch", bats: "S" };
  const early = swingAt(pitchAt({ x: 0.5, y: 0.5 }), {
    batter: switchHitter,
    progress: IDEAL_SWING_PROGRESS - 0.18,
  });
  assert.equal(early.kind, "SWING");
  assert.ok(early.contact.timingOffset < 0);
  assert.equal(early.contact.timing, "VERY_EARLY");
  assert.equal(early.contact.effectiveBattingSide, "L");

  const leftPitcher: BaseballPlayer = { ...PITCHER, id: "left-pitcher", throws: "L" };
  const leftPitch = { ...pitchAt({ x: 0.5, y: 0.5 }), pitcherId: leftPitcher.id };
  const result = resolveBatterAction({
    pitch: leftPitch,
    batter: switchHitter,
    pitcher: leftPitcher,
    count: COUNT,
    seed: 9,
    action: {
      kind: "SWING",
      swing: {
        batterId: switchHitter.id,
        swingType: "NORMAL",
        aim: { x: 0.5, y: 0.5 },
        progress: IDEAL_SWING_PROGRESS,
      },
    },
  });
  assert.equal(result.kind, "SWING");
  assert.equal(result.contact.effectiveBattingSide, "R");
});

test("invalid batter id, action, swing type, progress와 pitcher id를 거부한다", () => {
  const pitch = pitchAt({ x: 0.5, y: 0.5 });
  assert.throws(() => resolveBatterAction({
    pitch,
    batter: BATTER,
    pitcher: PITCHER,
    count: COUNT,
    seed: 1,
    action: { kind: "TAKE", batterId: "someone-else" },
  }), /batter\.id/);
  assert.throws(() => resolveBatterAction({
    pitch,
    batter: BATTER,
    pitcher: PITCHER,
    count: COUNT,
    seed: 1,
    action: { kind: "NOPE" } as never,
  }), /Unknown batter action/);
  assert.throws(() => swingAt(pitch, { swingType: "BUNT" as SwingType }), /Unknown swing type/);
  assert.throws(() => swingAt(pitch, { progress: Number.NaN }), /swing\.progress/);
  assert.throws(() => resolveBatterAction({
    pitch: { ...pitch, pitcherId: "wrong-pitcher" },
    batter: BATTER,
    pitcher: PITCHER,
    count: COUNT,
    seed: 1,
    action: { kind: "TAKE", batterId: BATTER.id },
  }), /pitcher\.id/);
});

test("타격 엔진은 Math.random과 Date에 의존하지 않는다", () => {
  const source = readFileSync(
    new URL("../src/utils/games/baseball/battingEngine.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /Math\.random|\bDate\b/);
});
