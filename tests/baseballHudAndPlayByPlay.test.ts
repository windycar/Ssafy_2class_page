import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getBaseballPlayer } from "../src/data/games/baseball/players.ts";
import {
  cloneGameState,
  createGameState,
  createRunner,
  getCurrentBatter,
  getCurrentPitcher,
} from "../src/utils/games/baseball/gameState.ts";
import { selectBaseballHudSituationV2 } from "../src/utils/games/baseball/hudSituation.ts";
import {
  executeBatterAction,
  startPitch,
} from "../src/utils/games/baseball/playEngine.ts";
import {
  createBaseballPlayByPlayEntryV2,
  createBaseballPlayByPlayMessageV2,
} from "../src/utils/games/baseball/playByPlay.ts";
import type {
  BaseballGameState,
  OfficialPlayResult,
} from "../src/utils/games/baseball/types.ts";

const OCCURRED_AT = "2026-08-24T12:00:00.000Z";

function badgeIds(game: BaseballGameState) {
  return selectBaseballHudSituationV2(game).badges.map((badge) => badge.id);
}

function setBottomThird(game: BaseballGameState) {
  game.inning = 3;
  game.half = "bottom";
  game.battingTeam = 1;
  for (const team of game.teams) {
    while (team.inningRuns.length < 3) team.inningRuns.push(0);
  }
}

test("HUD 상황 selector는 canonical 루·카운트에서 득점권, 만루, 2아웃, 풀카운트를 결정한다", () => {
  const game = createGameState();
  const runnerIds = game.teams[0].lineupPlayerIds.slice(1, 4);
  const runners = runnerIds.map((id) => getBaseballPlayer(id)!);

  assert.deepEqual(selectBaseballHudSituationV2(game).visibleBadges, []);

  game.bases.second = createRunner(runners[0], 2);
  assert.ok(badgeIds(game).includes("SCORING_POSITION"));

  game.bases.second = null;
  game.count.outs = 2;
  assert.ok(badgeIds(game).includes("TWO_OUT"));

  game.bases.second = createRunner(runners[0], 2);
  assert.ok(badgeIds(game).includes("TWO_OUT_RISP"));
  assert.ok(!badgeIds(game).includes("SCORING_POSITION"));

  game.bases.first = createRunner(runners[1], 1);
  game.bases.third = createRunner(runners[2], 3);
  assert.ok(badgeIds(game).includes("BASES_LOADED"));

  game.count.balls = 3;
  game.count.strikes = 2;
  const fullCount = selectBaseballHudSituationV2(game);
  assert.equal(fullCount.isFullCount, true);
  assert.equal(fullCount.tension, "critical");
  assert.ok(badgeIds(game).includes("FULL_COUNT"));
  assert.ok(fullCount.visibleBadges.length <= 3, "스포츠 화면을 가리지 않게 배지를 제한해야 한다");
});

test("HUD selector는 3회 1점차, 역전 주자, 동점 끝내기 가능 상황을 구분한다", () => {
  const game = createGameState();
  game.inning = 3;
  game.teams[0].runs = 0;
  game.teams[1].runs = 1;
  game.bases.first = createRunner(getBaseballPlayer(game.teams[0].lineupPlayerIds[1])!, 1);
  game.bases.second = createRunner(getBaseballPlayer(game.teams[0].lineupPlayerIds[2])!, 2);

  let situation = selectBaseballHudSituationV2(game);
  assert.equal(situation.isFinalInning, true);
  assert.equal(situation.isClutch, true);
  assert.equal(situation.hasGoAheadRunner, true);
  assert.ok(situation.badges.some((badge) => badge.id === "CLUTCH"));
  assert.ok(situation.badges.some((badge) => badge.id === "GO_AHEAD_RUN"));

  setBottomThird(game);
  game.teams[0].runs = 2;
  game.teams[1].runs = 2;
  game.bases = { first: null, second: null, third: null };
  situation = selectBaseballHudSituationV2(game);
  assert.equal(situation.isTieGame, true);
  assert.equal(situation.isWalkOffChance, true);
  assert.equal(situation.visibleBadges[0]?.id, "WALK_OFF_CHANCE");
});

test("PlayByPlayGenerator는 득점자·RBI·역전·끝내기를 한 canonical 로그에 보존한다", () => {
  const initial = createGameState("원정", "홈", 4040);
  setBottomThird(initial);
  initial.teams[0].runs = 2;
  initial.teams[0].inningRuns = [2, 0, 0];
  initial.teams[1].runs = 1;
  initial.teams[1].inningRuns = [1, 0, 0];
  const scoringRunnerIds = initial.teams[1].lineupPlayerIds.slice(1, 3);
  initial.bases.second = createRunner(getBaseballPlayer(scoringRunnerIds[0])!, 2);
  initial.bases.third = createRunner(getBaseballPlayer(scoringRunnerIds[1])!, 3);

  const started = startPitch(initial, {
    commandId: "walk-off-start",
    expectedRevision: initial.revision,
    playId: "walk-off-play",
    sequence: 1,
    pitcherId: getCurrentPitcher(initial).id,
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
  });
  assert.equal(started.ok, true);
  if (!started.ok) return;
  const stateBefore = started.state;
  const stateAfter = cloneGameState(stateBefore);
  stateAfter.teams[1].runs = 3;
  stateAfter.teams[1].inningRuns[2] = 2;
  stateAfter.status = "finished";
  stateAfter.winner = 1;
  const official: OfficialPlayResult = {
    playId: "walk-off-play",
    code: "DOUBLE_LEFT",
    batterId: getCurrentBatter(stateBefore).id,
    pitcherId: getCurrentPitcher(stateBefore).id,
    outsRecorded: 0,
    runsScored: 2,
    hitValue: 2,
    rbi: 2,
    scoredRunnerIds: [...scoringRunnerIds],
    outRunnerIds: [],
    fielderIds: [],
    errorFielderId: null,
    plateAppearanceEnded: true,
  };

  const message = createBaseballPlayByPlayMessageV2(stateBefore, stateAfter, official);
  for (const runnerId of scoringRunnerIds) {
    assert.match(message, new RegExp(getBaseballPlayer(runnerId)!.name));
  }
  assert.match(message, /좌중간을 가릅니다!/);
  assert.match(message, /득점!/);
  assert.match(message, /2 RBI/);
  assert.match(
    message,
    new RegExp(`${stateAfter.teams[0].shortName} 2 : 3 ${stateAfter.teams[1].shortName}`),
  );
  assert.match(message, /LEAD CHANGE!/);
  assert.match(message, /WALK-OFF!/);

  const entry = createBaseballPlayByPlayEntryV2({
    stateBefore,
    stateAfter,
    commandId: "walk-off-action",
    occurredAt: OCCURRED_AT,
    official,
  });
  assert.equal(entry.startCommandId, "walk-off-start");
  assert.equal(entry.inning, 3);
  assert.equal(entry.half, "bottom");
  assert.equal(entry.message, message);
});

test("playEngine은 분리된 중계 생성기로 투구명과 실제 볼카운트를 기록한다", () => {
  const initial = createGameState();
  const batter = getCurrentBatter(initial);
  const started = startPitch(initial, {
    commandId: "ball-start",
    expectedRevision: 0,
    playId: "ball-play",
    sequence: 1,
    pitcherId: getCurrentPitcher(initial).id,
    pitchType: "fourSeam",
    target: { x: 0.02, y: 0.5 },
    timingQuality: "PERFECT",
  });
  assert.equal(started.ok, true);
  if (!started.ok) return;
  const resolved = executeBatterAction(started.state, {
    commandId: "ball-action",
    expectedRevision: started.state.revision,
    playId: "ball-play",
    batterId: batter.id,
    occurredAt: OCCURRED_AT,
    action: { kind: "TAKE", batterId: batter.id },
  });
  assert.equal(resolved.ok, true);
  if (!resolved.ok) return;
  const message = resolved.state.playByPlay.at(-1)?.message ?? "";
  assert.match(message, new RegExp(batter.name));
  assert.match(message, /직구/);
  assert.match(message, /볼, 1볼 0스트라이크/);
});

test("HUD는 최근 3개 중계와 펼칠 수 있는 전체 PLAY BY PLAY 패널을 렌더한다", async () => {
  const source = await readFile(
    new URL("../src/components/games/baseball/v2/BaseballHudV2.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /selectBaseballHudSituationV2\(game\)/);
  assert.match(source, /game\.playByPlay\.slice\(-3\)\.reverse\(\)/);
  assert.match(source, /<details>/);
  assert.match(source, /PLAY BY PLAY/);
  assert.match(source, /aria-live="polite"/);
});
