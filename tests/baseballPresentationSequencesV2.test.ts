import assert from "node:assert/strict";
import test from "node:test";

import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import {
  BASEBALL_GAME_INTRO_DURATION_MS,
  BASEBALL_HALF_INNING_DURATION_MS,
  BASEBALL_PLAYER_INTRO_DURATION_MS,
  baseballGameIntroPhaseV2,
  baseballHalfInningPhaseV2,
  createBaseballGameIntroModelV2,
  createBaseballHalfInningModelV2,
  createBaseballPlayerIntroModelV2,
} from "../src/utils/games/baseball/presentationSequences.ts";

test("경기 시작 연출은 3초 안에서 요구된 7단계를 순서대로 선택한다", () => {
  assert.ok(BASEBALL_GAME_INTRO_DURATION_MS >= 2_000);
  assert.ok(BASEBALL_GAME_INTRO_DURATION_MS <= 4_000);
  assert.deepEqual(
    [0, 0.14, 0.30, 0.44, 0.58, 0.76, 0.90].map(baseballGameIntroPhaseV2),
    ["MATCH_INTRO", "STADIUM", "MATCHUP", "STARTERS", "LINEUP", "PLAY_BALL", "FIRST_BATTER"],
  );

  const model = createBaseballGameIntroModelV2(createGameState("원정", "홈", 91));
  assert.match(model.matchup, /VS/);
  assert.equal(model.lineupNames[0].length, 9);
  assert.equal(model.lineupNames[1].length, 9);
  assert.ok(model.starters[0].pitching);
  assert.ok(model.starters[1].pitching);
});

test("타자 소개는 0.7~1초이며 실제 능력치와 TODAY 기록을 만든다", () => {
  assert.ok(BASEBALL_PLAYER_INTRO_DURATION_MS >= 700);
  assert.ok(BASEBALL_PLAYER_INTRO_DURATION_MS <= 1_000);
  const game = createGameState("원정", "홈", 92);
  const batterId = game.teams[0].lineupPlayerIds[0];
  game.teams[0].batterStats[batterId] = {
    pa: 2,
    ab: 2,
    h: 1,
    doubles: 0,
    triples: 0,
    hr: 1,
    rbi: 2,
    r: 1,
    bb: 0,
    so: 0,
  };
  const model = createBaseballPlayerIntroModelV2(game);

  assert.equal(model.player.id, batterId);
  assert.ok(model.player.contact > 0);
  assert.ok(model.player.power > 0);
  assert.ok(model.player.speed > 0);
  assert.equal(model.today, "1 FOR 2 · 1 HR · 2 RBI");
});

test("공수교대는 3 OUT부터 다음 공격팀까지 5단계를 canonical 상태로 만든다", () => {
  assert.equal(BASEBALL_HALF_INNING_DURATION_MS, 2_400);
  assert.deepEqual(
    [0, 0.20, 0.40, 0.70, 0.88].map(baseballHalfInningPhaseV2),
    ["THREE_OUT", "INNING_COMPLETE", "LINE_SCORE", "WIDE_SHOT", "NEXT_ATTACK"],
  );
  const game = createGameState("원정", "홈", 93);
  game.half = "bottom";
  game.battingTeam = 1;
  game.teams[0].runs = 1;
  game.teams[0].inningRuns[0] = 1;
  game.playByPlay.push({
    id: "third-out",
    playId: "play-third-out",
    inning: 1,
    half: "top",
    battingTeam: 0,
    batterId: game.teams[0].lineupPlayerIds[0],
    result: "STRIKEOUT_LOOKING",
    message: "삼진",
    runsScored: 0,
    createdAt: "2026-08-24T00:00:00.000Z",
  });
  const model = createBaseballHalfInningModelV2(game);

  assert.equal(model.completedInning, 1);
  assert.equal(model.completedHalf, "top");
  assert.equal(model.nextBattingTeam, 1);
  assert.equal(model.score[0], 1);
  assert.equal(model.inningRuns[0][0], 1);
});
