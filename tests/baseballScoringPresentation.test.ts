import assert from "node:assert/strict";
import test from "node:test";

import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import {
  baseballHomeRunScoringLabel,
  baseballRunScoringLabel,
  createBaseballScoringPresentationV2,
  isBaseballHomeRunCinematicSkippablePhaseV2,
} from "../src/utils/games/baseball/scoringPresentation.ts";
import type {
  BaseballGameState,
  OfficialPlayResult,
  TeamIndex,
} from "../src/utils/games/baseball/types.ts";

function scoringResult(overrides: Partial<OfficialPlayResult> = {}): OfficialPlayResult {
  return {
    playId: "score-play",
    code: "DOUBLE_CENTER",
    batterId: "kia-kim-doyoung",
    pitcherId: "tigers-yang-hyeonjong",
    outsRecorded: 0,
    runsScored: 2,
    hitValue: 2,
    rbi: 2,
    scoredRunnerIds: ["kia-park-chanho", "kia-choi-wonjun"],
    outRunnerIds: [],
    fielderIds: [],
    errorFielderId: null,
    plateAppearanceEnded: true,
    ...overrides,
  };
}

function scoredGame(
  battingTeam: TeamIndex,
  score: readonly [number, number],
  official: OfficialPlayResult,
): BaseballGameState {
  const game = createGameState("원정", "홈", 711);
  game.battingTeam = battingTeam;
  game.teams[0].runs = score[0];
  game.teams[1].runs = score[1];
  game.lastPlay = official;
  game.playByPlay.push({
    id: "log-score-play",
    playId: official.playId,
    inning: game.inning,
    half: game.half,
    battingTeam,
    batterId: official.batterId,
    result: official.code,
    message: "득점",
    runsScored: official.runsScored,
    createdAt: "2026-08-24T00:00:00.000Z",
  });
  return game;
}

test("홈런 득점 수는 솔로·2점·3점·만루 전용 라벨을 만든다", () => {
  assert.equal(baseballHomeRunScoringLabel(1), "SOLO HOME RUN");
  assert.equal(baseballHomeRunScoringLabel(2), "2-RUN HOME RUN");
  assert.equal(baseballHomeRunScoringLabel(3), "3-RUN HOME RUN");
  assert.equal(baseballHomeRunScoringLabel(4), "GRAND SLAM");
  assert.equal(baseballRunScoringLabel(1), "RUN SCORED");
  assert.equal(baseballRunScoringLabel(2), "2 RUNS SCORE");
});

test("홈런 전체 건너뛰기는 초반 영화 장면에서만 허용한다", () => {
  assert.equal(isBaseballHomeRunCinematicSkippablePhaseV2("CONTACT"), true);
  assert.equal(isBaseballHomeRunCinematicSkippablePhaseV2("BALL_FLIGHT"), true);
  assert.equal(isBaseballHomeRunCinematicSkippablePhaseV2("RUNNER_ADVANCE"), true);
  assert.equal(isBaseballHomeRunCinematicSkippablePhaseV2("RUN_SCORE"), false);
  assert.equal(isBaseballHomeRunCinematicSkippablePhaseV2("SCOREBOARD_UPDATE"), false);
  assert.equal(isBaseballHomeRunCinematicSkippablePhaseV2(undefined), false);
});

test("득점 모델은 득점자·타점·공식 반영 전후 점수를 복원한다", () => {
  const official = scoringResult();
  const model = createBaseballScoringPresentationV2(
    scoredGame(0, [3, 1], official),
    official,
  );
  assert.ok(model);
  assert.deepEqual(model.scoreBefore, [1, 1]);
  assert.deepEqual(model.scoreAfter, [3, 1]);
  assert.deepEqual(model.scorerNames, ["박찬호", "최원준"]);
  assert.equal(model.batterName, "김도영");
  assert.equal(model.rbi, 2);
  assert.equal(model.scoringLabel, "2 RUNS SCORE");
  assert.equal(model.moment, "GO_AHEAD");
});

test("동점·역전·끝내기는 점수 변화와 경기 상태로 구분한다", () => {
  const oneRun = scoringResult({ runsScored: 1, rbi: 1, scoredRunnerIds: ["kia-park-chanho"] });
  assert.equal(
    createBaseballScoringPresentationV2(scoredGame(0, [2, 2], oneRun), oneRun)?.moment,
    "TYING",
  );

  const twoRuns = scoringResult();
  assert.equal(
    createBaseballScoringPresentationV2(scoredGame(0, [3, 2], twoRuns), twoRuns)?.moment,
    "LEAD_CHANGE",
  );

  const walkOffGame = scoredGame(1, [2, 3], twoRuns);
  walkOffGame.half = "bottom";
  walkOffGame.status = "finished";
  walkOffGame.winner = 1;
  assert.equal(createBaseballScoringPresentationV2(walkOffGame, twoRuns)?.moment, "WALK_OFF");
  assert.equal(createBaseballScoringPresentationV2(walkOffGame, twoRuns)?.momentLabel, "WALK-OFF!");
});

test("득점 없는 결과는 득점 시퀀스를 만들지 않는다", () => {
  const official = scoringResult({ runsScored: 0, rbi: 0, scoredRunnerIds: [] });
  assert.equal(createBaseballScoringPresentationV2(scoredGame(0, [0, 0], official), official), null);
});
