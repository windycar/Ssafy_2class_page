import assert from "node:assert/strict";
import test from "node:test";

import {
  applyPlateOutcome,
  createGameState,
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
  assert.equal(state.bases.first, true);
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
  assert.deepEqual(state.bases, { first: true, second: true, third: true });

  const walk = applyMany(state, ["ball", "ball", "ball", "ball"]);
  assert.equal(walk.teams[0].runs, 1);
  assert.deepEqual(walk.bases, { first: true, second: true, third: true });

  const grandSlam = applyPlateOutcome(walk, "homeRun").state;
  assert.equal(grandSlam.teams[0].runs, 5);
  assert.equal(grandSlam.teams[0].hits, 4);
  assert.deepEqual(grandSlam.bases, { first: false, second: false, third: false });
});

test("three outs switch offense and defense and clear the bases", () => {
  const state = applyMany(createGameState(), ["single", "out", "out", "out"]);
  assert.equal(state.inning, 1);
  assert.equal(state.half, "bottom");
  assert.equal(state.battingTeam, 1);
  assert.deepEqual(state.count, { balls: 0, strikes: 0, outs: 0 });
  assert.deepEqual(state.bases, { first: false, second: false, third: false });
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
