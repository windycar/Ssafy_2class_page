import assert from "node:assert/strict";
import test from "node:test";

import {
  applyPlateOutcome,
  BASEBALL_GAME_STATE_VERSION,
  createGameState,
  getCurrentBatter,
  getCurrentPitcher,
  getNextBatters,
  normalizeBaseballGameState,
  type BaseballGameState,
  type PlateOutcome,
} from "../src/utils/games/baseballEngine.ts";
import {
  KIA_THEME_PLAYER_COUNT,
  KIA_THEME_ROSTER,
  OPPONENT_PLAYER_COUNT,
  OPPONENT_ROSTER,
  getBaseballRoster,
  validateBaseballRoster,
} from "../src/data/games/baseball/rosters.ts";
import { getBaseballPlayer } from "../src/data/games/baseball/players.ts";
import {
  BASEBALL_PITCH_TYPES,
  isBaseballPitchType,
  isPitchVisualKind,
} from "../src/data/games/baseball/pitches.ts";

function applyMany(state: BaseballGameState, outcomes: PlateOutcome[]) {
  return outcomes.reduce((current, outcome) => applyPlateOutcome(current, outcome).state, state);
}

test("V2 새 경기는 9명 타순, 선수 기록, 투수 상태를 완전하게 초기화한다", () => {
  const state = createGameState("CPU", "KIA", 20260812);
  assert.equal(state.version, BASEBALL_GAME_STATE_VERSION);
  assert.equal(state.revision, 0);
  assert.equal(state.seed, 20260812);
  assert.deepEqual(state.bases, { first: null, second: null, third: null });

  for (const team of state.teams) {
    assert.equal(team.lineupPlayerIds.length, 9);
    assert.equal(new Set(team.lineupPlayerIds).size, 9);
    assert.equal(team.currentBatterIndex, 0);
    assert.equal(Object.keys(team.batterStats).length, 9);
    assert.ok(team.pitcher.stamina > 0);
    assert.ok(team.pitcherStats[team.pitcher.playerId]);
  }

  assert.equal(getCurrentBatter(state).id, "cpu-yoon-taesung");
  assert.deepEqual(getNextBatters(state).map((player) => player.id), [
    "cpu-park-junho",
    "cpu-jung-mingyu",
  ]);
  assert.equal(getCurrentPitcher(state).id, "kia-yang-hyeonjong");
});

test("타순은 타석이 끝날 때만 1번부터 9번까지 순환한다", () => {
  let state = createGameState();
  const firstBatter = getCurrentBatter(state).id;
  state = applyPlateOutcome(state, "ball").state;
  state = applyPlateOutcome(state, "calledStrike").state;
  state = applyPlateOutcome(state, "foul").state;
  assert.equal(getCurrentBatter(state).id, firstBatter);

  state = applyPlateOutcome(state, "swingingStrike").state;
  assert.equal(state.teams[0].currentBatterIndex, 1);
  assert.notEqual(getCurrentBatter(state).id, firstBatter);

  state = applyMany(state, Array.from({ length: 8 }, () => "single" as const));
  assert.equal(state.teams[0].currentBatterIndex, 0);
});

test("볼넷과 안타는 주자 신원, 타자 기록, 투수 기록과 체력을 갱신한다", () => {
  let state = createGameState();
  const pitcherId = state.teams[1].pitcher.playerId;
  const initialStamina = state.teams[1].pitcher.stamina;

  state = applyMany(state, ["ball", "ball", "ball", "ball"]);
  assert.equal(state.bases.first?.playerId, "cpu-yoon-taesung");
  assert.equal(state.teams[0].batterStats["cpu-yoon-taesung"].bb, 1);
  assert.equal(state.teams[1].pitcherStats[pitcherId].walks, 1);

  state = applyPlateOutcome(state, "double").state;
  assert.equal(state.bases.second?.playerId, "cpu-park-junho");
  assert.equal(state.bases.third?.playerId, "cpu-yoon-taesung");
  assert.equal(state.teams[0].batterStats["cpu-park-junho"].doubles, 1);
  assert.equal(state.teams[1].pitcherStats[pitcherId].hitsAllowed, 1);
  assert.equal(state.teams[1].pitcher.pitchCount, 5);
  assert.ok(state.teams[1].pitcher.stamina < initialStamina);
});

test("득점은 타자 타점과 득점뿐 아니라 상대 투수의 R와 ER에도 기록된다", () => {
  let state = createGameState();
  const pitcherId = state.teams[1].pitcher.playerId;

  state = applyMany(state, ["single", "single", "homeRun"]);

  assert.equal(state.teams[0].runs, 3);
  assert.equal(state.teams[0].batterStats["cpu-jung-mingyu"].rbi, 3);
  assert.equal(state.teams[0].batterStats["cpu-yoon-taesung"].r, 1);
  assert.equal(state.teams[0].batterStats["cpu-park-junho"].r, 1);
  assert.equal(state.teams[0].batterStats["cpu-jung-mingyu"].r, 1);
  assert.equal(state.teams[1].pitcherStats[pitcherId].runsAllowed, 3);
  assert.equal(state.teams[1].pitcherStats[pitcherId].earnedRuns, 3);
});

test("V1 boolean 베이스 상태는 결정적으로 V2 주자 상태로 정규화된다", () => {
  const legacy = {
    inning: 2,
    half: "bottom",
    battingTeam: 1,
    count: { balls: 2, strikes: 1, outs: 1 },
    bases: { first: true, second: false, third: true },
    teams: [
      { name: "1P", runs: 1, hits: 3, inningRuns: [1, 0] },
      { name: "2P", runs: 0, hits: 2, inningRuns: [0, 0] },
    ],
    status: "playing",
    winner: null,
  };
  const original = structuredClone(legacy);
  const first = normalizeBaseballGameState(legacy);
  const second = normalizeBaseballGameState(legacy);
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;
  assert.equal(first.sourceVersion, 1);
  assert.equal(first.value.version, 2);
  assert.equal(first.value.revision, 0);
  assert.equal(first.value.bases.first?.currentBase, 1);
  assert.equal(first.value.bases.third?.currentBase, 3);
  assert.notEqual(first.value.bases.first?.playerId, first.value.bases.third?.playerId);
  assert.deepEqual(first.value, second.value);
  assert.deepEqual(legacy, original, "정규화는 입력을 변경하면 안 된다");
});

test("V2 정규화는 멱등하고 미래 버전·손상 revision을 거부한다", () => {
  const state = createGameState();
  const once = normalizeBaseballGameState(state);
  assert.equal(once.ok, true);
  if (!once.ok) return;
  const twice = normalizeBaseballGameState(once.value);
  assert.equal(twice.ok, true);
  if (!twice.ok) return;
  assert.deepEqual(twice.value, once.value);

  assert.deepEqual(normalizeBaseballGameState({ ...state, version: 3 }), {
    ok: false,
    code: "UNSUPPORTED_VERSION",
    path: "$.version",
    recoverable: false,
  });
  assert.deepEqual(normalizeBaseballGameState({ ...state, revision: -1 }), {
    ok: false,
    code: "INVALID_REVISION",
    path: "$.revision",
    recoverable: true,
  });
});

test("V2 정규화는 불완전한 중첩 상태와 깨진 불변식을 엄격히 거부한다", () => {
  const assertInvalid = (mutate: (state: BaseballGameState) => void) => {
    const state = createGameState();
    mutate(state);
    assert.equal(normalizeBaseballGameState(state).ok, false);
  };

  assertInvalid((state) => { state.teams[0].shortName = ""; });
  assertInvalid((state) => { state.teams[0].lineupPlayerIds.fill("cpu-yoon-taesung"); });
  assertInvalid((state) => { state.teams[0].lineupPlayerIds[0] = "toString"; });
  assertInvalid((state) => { state.teams[1].pitcherStats = {}; });
  assertInvalid((state) => { delete state.teams[0].batterStats["cpu-yoon-taesung"]; });
  assertInvalid((state) => { state.teams[0].batterStats["cpu-yoon-taesung"].pa = 0.5; });
  assertInvalid((state) => { state.teams[0].inningRuns[0] = 1; });
  assertInvalid((state) => {
    state.bases.first = {
      playerId: "cpu-yoon-taesung",
      name: "윤태성",
      speed: 89,
      currentBase: 1,
      targetBase: 4,
      progress: Number.POSITIVE_INFINITY,
    };
  });
  assertInvalid((state) => { state.activePlay = {} as BaseballGameState["activePlay"]; });
  assertInvalid((state) => { state.lastPlay = {} as BaseballGameState["lastPlay"]; });
  assertInvalid((state) => { state.playByPlay = [{} as BaseballGameState["playByPlay"][number]]; });
});

test("선수·로스터·구종 조회는 Object prototype 키를 실제 데이터로 오인하지 않는다", () => {
  for (const inheritedKey of ["toString", "__proto__", "constructor"]) {
    assert.equal(getBaseballPlayer(inheritedKey), undefined);
    assert.equal(getBaseballRoster(inheritedKey), undefined);
    assert.equal(isBaseballPitchType(inheritedKey), false);
    assert.equal(isPitchVisualKind(inheritedKey), false);
  }
});

test("두 로스터와 7구종 정의가 완전하다", () => {
  assert.deepEqual(validateBaseballRoster(KIA_THEME_ROSTER), { valid: true, errors: [] });
  assert.deepEqual(validateBaseballRoster(OPPONENT_ROSTER), { valid: true, errors: [] });
  assert.equal(KIA_THEME_PLAYER_COUNT, 10);
  assert.equal(OPPONENT_PLAYER_COUNT, 10);
  assert.equal(BASEBALL_PITCH_TYPES.length, 7);
  assert.equal(new Set(BASEBALL_PITCH_TYPES).size, 7);
});
