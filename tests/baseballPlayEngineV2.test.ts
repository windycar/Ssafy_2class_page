import assert from "node:assert/strict";
import test from "node:test";

import { getBaseballPlayer } from "../src/data/games/baseball/players.ts";
import {
  createGameState,
  createRunner,
  getCurrentBatter,
  getCurrentPitcher,
} from "../src/utils/games/baseball/gameState.ts";
import { normalizeBaseballGameState } from "../src/utils/games/baseball/normalizeGameState.ts";
import {
  executeBatterAction,
  startPitch,
  type BatterActionCommand,
  type StartPitchCommand,
} from "../src/utils/games/baseball/playEngine.ts";
import type {
  BaseballGameState,
  BaseballPitchType,
  PitchQuality,
  SwingType,
  Vec2,
} from "../src/utils/games/baseball/types.ts";

const OCCURRED_AT = "2026-08-23T12:00:00.000Z";

function start(
  state: BaseballGameState,
  index: number,
  target: Vec2 = { x: 0.5, y: 0.5 },
  timingQuality: PitchQuality = "PERFECT",
  pitchType: BaseballPitchType = "fourSeam",
) {
  const sequence = state.teams.reduce(
    (total, team) => total + team.pitcher.pitchCount,
    0,
  ) + 1;
  const command: StartPitchCommand = {
    commandId: `start-${index}`,
    expectedRevision: state.revision,
    playId: `play-${index}`,
    sequence,
    pitcherId: getCurrentPitcher(state).id,
    pitchType,
    target,
    timingQuality,
  };
  const result = startPitch(state, command);
  assert.equal(result.ok, true, result.ok ? undefined : result.code);
  if (!result.ok) throw new Error(result.code);
  return { state: result.state, command };
}

function take(state: BaseballGameState, index: number) {
  const batter = getCurrentBatter(state);
  const command: BatterActionCommand = {
    commandId: `take-${index}`,
    expectedRevision: state.revision,
    playId: state.activePlay!.playId,
    batterId: batter.id,
    occurredAt: OCCURRED_AT,
    action: { kind: "TAKE", batterId: batter.id },
  };
  return executeBatterAction(state, command);
}

function swing(
  state: BaseballGameState,
  index: number,
  options: {
    swingType?: SwingType;
    aim?: Vec2;
    progress?: number;
  } = {},
) {
  const batter = getCurrentBatter(state);
  const actual = state.activePlay!.pitch!.location.actual;
  const command: BatterActionCommand = {
    commandId: `swing-${index}`,
    expectedRevision: state.revision,
    playId: state.activePlay!.playId,
    batterId: batter.id,
    occurredAt: OCCURRED_AT,
    action: {
      kind: "SWING",
      swing: {
        batterId: batter.id,
        swingType: options.swingType ?? "NORMAL",
        aim: options.aim ?? { ...actual },
        progress: options.progress ?? 0.72,
      },
    },
  };
  return executeBatterAction(state, command);
}

function setBottomHalf(state: BaseballGameState, inning = 3) {
  state.inning = inning;
  state.half = "bottom";
  state.battingTeam = 1;
  for (const team of state.teams) {
    while (team.inningRuns.length < inning) team.inningRuns.push(0);
  }
}

test("투구 시작은 입력을 바꾸지 않고 투구 수·체력·revision을 정확히 한 번만 갱신한다", () => {
  const state = createGameState("원정", "홈", 1001);
  const snapshot = structuredClone(state);
  const pitcherId = getCurrentPitcher(state).id;
  const result = startPitch(state, {
    commandId: "start-once",
    expectedRevision: 0,
    playId: "play-once",
    sequence: 1,
    pitcherId,
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "PERFECT",
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(state, snapshot);
  assert.equal(result.state.revision, 1);
  assert.equal(result.state.teams[1].pitcher.pitchCount, 1);
  assert.equal(result.state.teams[1].pitcherStats[pitcherId].pitches, 1);
  assert.ok(result.state.teams[1].pitcher.stamina < state.teams[1].pitcher.stamina);

  const duplicate = startPitch(result.state, {
    commandId: "start-once",
    expectedRevision: result.state.revision,
    playId: "play-once",
    sequence: 1,
    pitcherId,
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "PERFECT",
  });
  assert.deepEqual(duplicate, { ok: false, state: result.state, code: "DUPLICATE_COMMAND" });
  assert.equal(result.state.teams[1].pitcher.pitchCount, 1);
});

test("stale revision, 잘못된 투수와 활성 투구가 없는 타자 명령을 거부한다", () => {
  const state = createGameState();
  const pitcherId = getCurrentPitcher(state).id;
  assert.equal(startPitch(state, {
    commandId: "stale-start",
    expectedRevision: 1,
    playId: "stale-play",
    sequence: 1,
    pitcherId,
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
  }).ok, false);
  const invalidActor = startPitch(state, {
    commandId: "wrong-pitcher",
    expectedRevision: 0,
    playId: "wrong-pitcher-play",
    sequence: 1,
    pitcherId: "cpu-kang-minjae",
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
  });
  assert.equal(invalidActor.ok, false);
  if (!invalidActor.ok) assert.equal(invalidActor.code, "INVALID_ACTOR");

  const batter = getCurrentBatter(state);
  const noPitch = executeBatterAction(state, {
    commandId: "no-pitch",
    expectedRevision: 0,
    playId: "no-pitch-play",
    batterId: batter.id,
    occurredAt: OCCURRED_AT,
    action: { kind: "TAKE", batterId: batter.id },
  });
  assert.equal(noPitch.ok, false);
  if (!noPitch.ok) assert.equal(noPitch.code, "NO_ACTIVE_PITCH");
});

test("해결된 플레이의 start commandId를 다른 playId로 재사용해도 중복 명령으로 거부한다", () => {
  let state = createGameState();
  const pitcherId = getCurrentPitcher(state).id;
  const started = startPitch(state, {
    commandId: "persisted-start-command",
    expectedRevision: state.revision,
    playId: "first-command-play",
    sequence: 1,
    pitcherId,
    pitchType: "fourSeam",
    target: { x: 0.03, y: 0.5 },
    timingQuality: "PERFECT",
  });
  assert.equal(started.ok, true);
  if (!started.ok) return;

  const resolved = take(started.state, 1);
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  state = resolved.state;

  const duplicate = startPitch(state, {
    commandId: "persisted-start-command",
    expectedRevision: state.revision,
    playId: "different-play-id",
    sequence: 2,
    pitcherId: getCurrentPitcher(state).id,
    pitchType: "slider",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
  });
  assert.equal(duplicate.ok, false);
  if (!duplicate.ok) assert.equal(duplicate.code, "DUPLICATE_COMMAND");
  assert.deepEqual(duplicate.state, state);
});

test("투구 sequence는 정확히 1씩 증가해야 하며 건너뜀과 역행을 모두 거부한다", () => {
  let state = createGameState();
  state = start(state, 1, { x: 0.03, y: 0.5 }).state;
  const resolved = take(state, 1);
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  state = resolved.state;

  for (const [label, sequence] of [
    ["gap", 3],
    ["rollback", 1],
    ["older", 0],
  ] as const) {
    const rejected = startPitch(state, {
      commandId: `${label}-sequence-command`,
      expectedRevision: state.revision,
      playId: `${label}-sequence-play`,
      sequence,
      pitcherId: getCurrentPitcher(state).id,
      pitchType: "fourSeam",
      target: { x: 0.5, y: 0.5 },
      timingQuality: "GOOD",
    });
    assert.equal(rejected.ok, false, `${label} sequence ${sequence} must be rejected`);
    assert.deepEqual(rejected.state, state);
  }

  const consecutive = startPitch(state, {
    commandId: "consecutive-sequence-command",
    expectedRevision: state.revision,
    playId: "consecutive-sequence-play",
    sequence: 2,
    pitcherId: getCurrentPitcher(state).id,
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
  });
  assert.equal(consecutive.ok, true);
});

test("4볼은 신원 기반 볼넷, 기록, 타순 이동으로 끝나며 투구 수를 중복 반영하지 않는다", () => {
  let state = createGameState();
  const firstBatter = getCurrentBatter(state);
  const pitcherId = getCurrentPitcher(state).id;
  for (let index = 1; index <= 4; index += 1) {
    state = start(state, index, { x: 0.03, y: 0.5 }).state;
    const result = take(state, index);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    state = result.state;
    assert.equal(result.official?.code, index === 4 ? "WALK" : "BALL");
  }
  assert.equal(state.bases.first?.playerId, firstBatter.id);
  assert.equal(state.count.balls, 0);
  assert.equal(state.teams[0].currentBatterIndex, 1);
  assert.equal(state.teams[0].batterStats[firstBatter.id].pa, 1);
  assert.equal(state.teams[0].batterStats[firstBatter.id].ab, 0);
  assert.equal(state.teams[0].batterStats[firstBatter.id].bb, 1);
  assert.equal(state.teams[1].pitcherStats[pitcherId].walks, 1);
  assert.equal(state.teams[1].pitcher.pitchCount, 4);
});

test("3스트라이크 루킹 삼진과 2스트라이크 파울 카운트를 정확히 처리한다", () => {
  let state = createGameState();
  const batterId = getCurrentBatter(state).id;
  for (let index = 10; index <= 12; index += 1) {
    state = start(state, index).state;
    const result = take(state, index);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    state = result.state;
    assert.equal(result.official?.code, index === 12 ? "STRIKEOUT_LOOKING" : "CALLED_STRIKE");
  }
  assert.equal(state.count.outs, 1);
  assert.equal(state.teams[0].batterStats[batterId].so, 1);

  state.count.strikes = 2;
  state = start(state, 13).state;
  const foul = swing(state, 13, { progress: 0.55 });
  assert.equal(foul.ok, true);
  if (!foul.ok) return;
  assert.equal(foul.official?.code, "FOUL");
  assert.equal(foul.state.count.strikes, 2);
  assert.equal(foul.state.teams[0].currentBatterIndex, 1);
});

test("강타자의 완벽한 POWER 접촉은 물리·수비·주루 뒤 홈런으로 확정되고 정규화된다", () => {
  const state = createGameState("원정", "홈", 5555);
  state.teams[0].currentBatterIndex = 4;
  const batter = getCurrentBatter(state);
  const started = start(state, 30, { x: 0.5, y: 0.5 }, "MISS").state;
  const actual = started.activePlay!.pitch!.location.actual;
  const result = swing(started, 30, {
    swingType: "POWER",
    aim: { x: actual.x, y: actual.y + 0.08 },
    progress: 0.72,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.match(result.official!.code, /^HOME_RUN_/);
  assert.equal(result.official!.hitValue, 4);
  assert.equal(result.state.teams[0].batterStats[batter.id].hr, 1);
  assert.equal(result.state.teams[0].batterStats[batter.id].rbi, 1);
  assert.equal(result.state.teams[0].runs, 1);
  assert.ok(result.state.activePlay!.visualEvents.length >= 7);
  assert.equal(normalizeBaseballGameState(JSON.parse(JSON.stringify(result.state))).ok, true);
});

test("만루 홈런은 네 주자 신원과 타자·투수 기록을 한 번씩 반영한다", () => {
  const state = createGameState("원정", "홈", 5555);
  state.teams[0].currentBatterIndex = 4;
  const batter = getCurrentBatter(state);
  const runner1 = getBaseballPlayer("cpu-yoon-taesung")!;
  const runner2 = getBaseballPlayer("cpu-park-junho")!;
  const runner3 = getBaseballPlayer("cpu-jung-mingyu")!;
  state.bases = {
    first: createRunner(runner1, 1),
    second: createRunner(runner2, 2),
    third: createRunner(runner3, 3),
  };
  const started = start(state, 31, { x: 0.5, y: 0.5 }, "MISS").state;
  const actual = started.activePlay!.pitch!.location.actual;
  const result = swing(started, 31, {
    swingType: "POWER",
    aim: { x: actual.x, y: actual.y + 0.08 },
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.match(result.official!.code, /^HOME_RUN_/);
  assert.equal(result.official!.runsScored, 4);
  assert.equal(new Set(result.official!.scoredRunnerIds).size, 4);
  assert.equal(result.state.teams[0].batterStats[batter.id].rbi, 4);
  assert.equal(result.state.teams[0].runs, 4);
  assert.deepEqual(result.state.bases, { first: null, second: null, third: null });
});

test("세 번째 아웃은 공수를 교대하고 3회 동점이면 연장으로 간다", () => {
  let state = createGameState();
  state.count.outs = 2;
  state = start(state, 40).state;
  state.count.strikes = 2;
  const sideChange = take(state, 40);
  assert.equal(sideChange.ok, true);
  if (!sideChange.ok) return;
  assert.equal(sideChange.state.inning, 1);
  assert.equal(sideChange.state.half, "bottom");
  assert.equal(sideChange.state.battingTeam, 1);
  assert.deepEqual(sideChange.state.bases, { first: null, second: null, third: null });

  state = createGameState();
  setBottomHalf(state, 3);
  state.count = { balls: 0, strikes: 2, outs: 2 };
  state = start(state, 41).state;
  const extra = take(state, 41);
  assert.equal(extra.ok, true);
  if (!extra.ok) return;
  assert.equal(extra.state.status, "playing");
  assert.equal(extra.state.inning, 4);
  assert.equal(extra.state.half, "top");
  assert.equal(extra.state.battingTeam, 0);
});

test("3회말 밀어내기 볼넷은 필요한 한 점만 인정하고 끝내기로 종료한다", () => {
  let state = createGameState();
  setBottomHalf(state, 3);
  state.teams[0].runs = 1;
  state.teams[0].inningRuns = [1, 0, 0];
  state.teams[1].runs = 1;
  state.teams[1].inningRuns = [1, 0, 0];
  state.count = { balls: 3, strikes: 1, outs: 1 };
  const ids = state.teams[1].lineupPlayerIds;
  state.bases = {
    first: createRunner(getBaseballPlayer(ids[1])!, 1),
    second: createRunner(getBaseballPlayer(ids[2])!, 2),
    third: createRunner(getBaseballPlayer(ids[3])!, 3),
  };
  state = start(state, 50, { x: 0.03, y: 0.5 }).state;
  const result = take(state, 50);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.official?.code, "WALK");
  assert.equal(result.official?.runsScored, 1);
  assert.equal(result.state.status, "finished");
  assert.equal(result.state.winner, 1);
  assert.equal(result.state.teams[1].runs, 2);
});

test("실제 타구·수비 타이밍에서도 병살 결과가 도달 가능하다", () => {
  let found: ReturnType<typeof executeBatterAction> | null = null;
  for (let sequence = 1; sequence <= 5_000 && !found; sequence += 1) {
    const state = createGameState("원정", "홈", 9090);
    state.teams[0].currentBatterIndex = 3;
    state.bases.first = createRunner(getBaseballPlayer("cpu-jang-minseok")!, 1);
    const started = start(state, 10_000 + sequence, { x: 0.5, y: 0.5 }, "MISS").state;
    const actual = started.activePlay!.pitch!.location.actual;
    const result = swing(started, 10_000 + sequence, {
      swingType: "CONTACT",
      aim: { x: actual.x, y: actual.y - 0.08 },
      progress: 0.72,
    });
    if (result.ok && result.official?.code === "DOUBLE_PLAY") found = result;
  }
  assert.ok(found, "5,000개 결정 seed 안에서 실제 병살이 발생해야 한다");
  if (!found || !found.ok) return;
  assert.equal(found.official?.outsRecorded, 2);
  assert.equal(found.state.count.outs, 2);
});
