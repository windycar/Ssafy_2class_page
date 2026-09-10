import assert from "node:assert/strict";
import test from "node:test";

import { getBaseballPlayer } from "../src/data/games/baseball/players.ts";
import {
  earnedRunsForPlay,
  virtualOutsBeforePlay,
} from "../src/utils/games/baseball/earnedRunEngine.ts";
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
} from "../src/utils/games/baseball/playEngine.ts";
import type {
  BaseballGameState,
  BaseballPlayResultCode,
  OfficialPlayResult,
} from "../src/utils/games/baseball/types.ts";

const OCCURRED_AT = "2026-09-02T00:00:00.000Z";

function official(
  state: BaseballGameState,
  overrides: Partial<OfficialPlayResult> = {},
): OfficialPlayResult {
  return {
    playId: "earned-run-play",
    code: "SINGLE_CENTER",
    batterId: getCurrentBatter(state).id,
    pitcherId: getCurrentPitcher(state).id,
    outsRecorded: 0,
    runsScored: 0,
    hitValue: 1,
    rbi: 0,
    scoredRunnerIds: [],
    outRunnerIds: [],
    fielderIds: [],
    errorFielderId: null,
    plateAppearanceEnded: true,
    ...overrides,
  };
}

function addCompletedPlay(
  state: BaseballGameState,
  result: BaseballPlayResultCode,
  id: string,
) {
  state.playByPlay.push({
    id: `command-${id}`,
    playId: `play-${id}`,
    inning: state.inning,
    half: state.half,
    battingTeam: state.battingTeam,
    batterId: state.teams[state.battingTeam].lineupPlayerIds[0],
    result,
    message: result,
    runsScored: 0,
    createdAt: OCCURRED_AT,
  });
}

function hitDeterministicHomeRun(state: BaseballGameState) {
  state.teams[state.battingTeam].currentBatterIndex = 4;
  const batter = getCurrentBatter(state);
  const started = startPitch(state, {
    commandId: "earned-run-start-30",
    expectedRevision: state.revision,
    playId: "play-30",
    sequence: state.teams.reduce((sum, team) => sum + team.pitcher.pitchCount, 0) + 1,
    pitcherId: getCurrentPitcher(state).id,
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "MISS",
  });
  assert.equal(started.ok, true, started.ok ? undefined : started.code);
  if (!started.ok) throw new Error(started.code);
  const actual = started.state.activePlay!.pitch!.location.actual;
  const resolved = executeBatterAction(started.state, {
    commandId: "earned-run-swing-30",
    expectedRevision: started.state.revision,
    playId: "play-30",
    batterId: batter.id,
    occurredAt: OCCURRED_AT,
    action: {
      kind: "SWING",
      swing: {
        batterId: batter.id,
        swingType: "POWER",
        aim: { x: actual.x, y: actual.y + 0.08 },
        progress: 0.72,
      },
    },
  });
  assert.equal(resolved.ok, true, resolved.ok ? undefined : resolved.code);
  if (!resolved.ok) throw new Error(resolved.code);
  assert.match(resolved.official!.code, /^HOME_RUN_/);
  return resolved;
}

test("실책으로 출루한 주자는 이후 홈을 밟아도 자책점 대상이 아니다", () => {
  const initial = createGameState("원정", "홈", 289);
  const batter = getCurrentBatter(initial);
  const started = startPitch(initial, {
    commandId: "error-start",
    expectedRevision: 0,
    playId: "p",
    sequence: 1,
    pitcherId: getCurrentPitcher(initial).id,
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "MISS",
  });
  assert.equal(started.ok, true, started.ok ? undefined : started.code);
  if (!started.ok) return;
  const actual = started.state.activePlay!.pitch!.location.actual;
  const error = executeBatterAction(started.state, {
    commandId: "error-swing",
    expectedRevision: 1,
    playId: "p",
    batterId: batter.id,
    occurredAt: OCCURRED_AT,
    action: {
      kind: "SWING",
      swing: {
        batterId: batter.id,
        swingType: "NORMAL",
        aim: actual,
        progress: 0.72,
      },
    },
  });
  assert.equal(error.ok, true, error.ok ? undefined : error.code);
  if (!error.ok) return;
  assert.equal(error.official!.code, "ERROR");
  assert.equal(error.state.bases.first?.playerId, batter.id);
  assert.equal(error.state.bases.first?.earnedRunEligible, false);

  const scored = official(error.state, {
    scoredRunnerIds: [batter.id],
    runsScored: 1,
    rbi: 1,
  });
  assert.equal(earnedRunsForPlay(error.state, scored), 0);

  const normalized = normalizeBaseballGameState(JSON.parse(JSON.stringify(error.state)));
  assert.equal(normalized.ok, true);
  if (normalized.ok) {
    assert.equal(normalized.value.bases.first?.earnedRunEligible, false);
  }
});

test("실책을 가상 아웃으로 복원해 가상 3아웃 뒤의 모든 득점을 비자책 처리한다", () => {
  const state = createGameState("원정", "홈", 5555);
  state.count.outs = 2;
  addCompletedPlay(state, "ERROR", "prior-error");
  assert.equal(virtualOutsBeforePlay(state), 3);

  const result = hitDeterministicHomeRun(state);
  const pitcherId = result.official!.pitcherId;
  assert.equal(result.official!.runsScored, 1);
  assert.equal(result.state.teams[1].pitcherStats[pitcherId].runsAllowed, 1);
  assert.equal(result.state.teams[1].pitcherStats[pitcherId].earnedRuns, 0);
});

test("득점 플레이가 가상 3아웃을 완성하면 비자책이지만 같은 상황의 무아웃 장타 득점은 자책이다", () => {
  const state = createGameState("원정", "홈", 5555);
  state.count.outs = 1;
  addCompletedPlay(state, "ERROR", "virtual-second-out");
  state.teams[0].currentBatterIndex = 4;
  const runner = getBaseballPlayer(state.teams[0].lineupPlayerIds[0])!;
  state.bases.third = createRunner(runner, 3);
  assert.equal(virtualOutsBeforePlay(state), 2);

  const sacrificeFly = official(state, {
    code: "SAC_FLY",
    outsRecorded: 1,
    runsScored: 1,
    scoredRunnerIds: [runner.id],
    rbi: 1,
    hitValue: 0,
  });
  assert.equal(earnedRunsForPlay(state, sacrificeFly), 0);

  const batterId = getCurrentBatter(state).id;
  const homeRun = official(state, {
    code: "HOME_RUN_CENTER",
    outsRecorded: 0,
    runsScored: 2,
    scoredRunnerIds: [runner.id, batterId],
    rbi: 2,
    hitValue: 4,
  });
  assert.equal(earnedRunsForPlay(state, homeRun), 2);
});

test("같은 홈런에서 정상 출루 주자와 타자 득점만 자책, 실책 출루 주자는 비자책으로 나눈다", () => {
  const state = createGameState("원정", "홈", 5555);
  const errorRunner = getBaseballPlayer(state.teams[0].lineupPlayerIds[0])!;
  const earnedRunner = getBaseballPlayer(state.teams[0].lineupPlayerIds[1])!;
  state.bases = {
    first: { ...createRunner(errorRunner, 1), earnedRunEligible: false },
    second: createRunner(earnedRunner, 2),
    third: null,
  };

  const result = hitDeterministicHomeRun(state);
  const pitcherId = result.official!.pitcherId;
  assert.equal(result.official!.runsScored, 3);
  assert.equal(result.state.teams[1].pitcherStats[pitcherId].runsAllowed, 3);
  assert.equal(result.state.teams[1].pitcherStats[pitcherId].earnedRuns, 2);
});
