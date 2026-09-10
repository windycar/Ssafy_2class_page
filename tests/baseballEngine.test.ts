import assert from "node:assert/strict";
import test from "node:test";

import {
  applyPlateOutcome,
  createGameState,
  createPitchFlightDuration,
  createPitchTrajectory,
  isPitchInStrikeZone,
  judgeCpuPitchResult,
  judgeSwingContact,
  SWEET_SPOT,
  type BaseballGameState,
  type PlateOutcome,
} from "../src/utils/games/baseballEngine.ts";

function applyMany(state: BaseballGameState, outcomes: PlateOutcome[]) {
  return outcomes.reduce((current, outcome) => applyPlateOutcome(current, outcome).state, state);
}

test("four balls award a walk and three strikes record an out", () => {
  let state = createGameState();
  state = applyMany(state, ["ball", "ball", "ball", "ball"]);
  assert.equal(state.bases.first?.currentBase, 1);
  assert.equal(state.bases.first?.playerId, "cpu-yoon-taesung");
  assert.equal(state.count.balls, 0);

  state = applyMany(state, ["calledStrike", "foul", "foul"]);
  assert.equal(state.count.strikes, 2, "a two-strike foul must not strike out the batter");
  state = applyPlateOutcome(state, "swingingStrike").state;
  assert.equal(state.count.outs, 1);
  assert.equal(state.count.strikes, 0);
});

test("walks force runners and hits advance every occupied base", () => {
  let state = createGameState();
  state = applyMany(state, ["single", "single", "single"]);
  assert.deepEqual(
    [state.bases.first?.currentBase, state.bases.second?.currentBase, state.bases.third?.currentBase],
    [1, 2, 3],
  );
  assert.equal(new Set([
    state.bases.first?.playerId,
    state.bases.second?.playerId,
    state.bases.third?.playerId,
  ]).size, 3, "각 베이스는 서로 다른 주자 신원을 보존해야 한다");

  const walk = applyMany(state, ["ball", "ball", "ball", "ball"]);
  assert.equal(walk.teams[0].runs, 1);
  assert.ok(walk.bases.first && walk.bases.second && walk.bases.third);

  const grandSlam = applyPlateOutcome(walk, "homeRun").state;
  assert.equal(grandSlam.teams[0].runs, 5);
  assert.equal(grandSlam.teams[0].hits, 4);
  assert.deepEqual(grandSlam.bases, { first: null, second: null, third: null });
});

test("three outs switch offense and defense and clear the bases", () => {
  const state = applyMany(createGameState(), ["single", "out", "out", "out"]);
  assert.equal(state.inning, 1);
  assert.equal(state.half, "bottom");
  assert.equal(state.battingTeam, 1);
  assert.deepEqual(state.count, { balls: 0, strikes: 0, outs: 0 });
  assert.deepEqual(state.bases, { first: null, second: null, third: null });
});

test("a tie after three innings goes to extras", () => {
  let state = createGameState();
  for (let half = 0; half < 6; half += 1) {
    state = applyMany(state, ["out", "out", "out"]);
  }
  assert.equal(state.status, "playing");
  assert.equal(state.inning, 4);
  assert.equal(state.half, "top");
});

test("home team can win without batting again or on a walk-off", () => {
  let skipBottom = createGameState();
  skipBottom.inning = 3;
  skipBottom.half = "top";
  skipBottom.battingTeam = 0;
  skipBottom.teams[1].runs = 2;
  skipBottom = applyMany(skipBottom, ["out", "out", "out"]);
  assert.equal(skipBottom.status, "finished");
  assert.equal(skipBottom.winner, 1);

  let walkOff = createGameState();
  walkOff.inning = 3;
  walkOff.half = "bottom";
  walkOff.battingTeam = 1;
  walkOff.teams[0].runs = 1;
  walkOff.teams[1].runs = 1;
  walkOff = applyPlateOutcome(walkOff, "homeRun").state;
  assert.equal(walkOff.status, "finished");
  assert.equal(walkOff.winner, 1);
});

test("strike zone and zone hitting use both location and timing", () => {
  assert.equal(isPitchInStrikeZone({ x: 0.5, y: 0.5 }), true);
  assert.equal(isPitchInStrikeZone({ x: 0.1, y: 0.5 }), false);

  const target = { x: 0.63, y: 0.42 };
  assert.equal(judgeSwingContact(SWEET_SPOT, target, target).outcome, "homeRun");
  assert.equal(
    judgeSwingContact(SWEET_SPOT, { x: 0.1, y: 0.9 }, target).outcome,
    "swingingStrike",
  );
});

test("CPU batter takes many pitches outside the zone", () => {
  assert.equal(judgeCpuPitchResult({ x: 0.1, y: 0.5 }, 0.2, 0.9), "ball");
  assert.equal(judgeCpuPitchResult({ x: 0.5, y: 0.5 }, 0.1, 0.9), "calledStrike");
  assert.equal(judgeCpuPitchResult({ x: 0.5, y: 0.5 }, 0.8, 0.99), "homeRun");
});

test("직구는 목표까지 일직선으로 빠르게 이동한다", () => {
  const start = { x: 44, y: 51 };
  const target = { x: 56, y: 68 };
  const trajectory = createPitchTrajectory("fastball", start, target);

  assert.deepEqual(trajectory.first, {
    x: start.x + (target.x - start.x) * 0.35,
    y: start.y + (target.y - start.y) * 0.35,
  });
  assert.deepEqual(trajectory.second, {
    x: start.x + (target.x - start.x) * 0.72,
    y: start.y + (target.y - start.y) * 0.72,
  });
  assert.deepEqual(trajectory.end, target);
  assert.equal(createPitchFlightDuration("fastball", 0), 430);
  assert.equal(createPitchFlightDuration("fastball", 1), 500);
});

test("변화구는 중간에서만 휘고 마지막에는 설정한 목표에 도착한다", () => {
  const start = { x: 44, y: 51 };
  const target = { x: 52, y: 62 };
  const straightSecondX = start.x + (target.x - start.x) * 0.72;

  for (const kind of ["curve", "slider", "changeup"] as const) {
    const trajectory = createPitchTrajectory(kind, start, target);
    assert.notEqual(trajectory.second.x, straightSecondX);
    assert.deepEqual(trajectory.end, target);
  }

  assert.ok(createPitchFlightDuration("curve", 0.5) > createPitchFlightDuration("fastball", 0.5));
  assert.ok(createPitchFlightDuration("changeup", 0.5) > createPitchFlightDuration("slider", 0.5));
});
