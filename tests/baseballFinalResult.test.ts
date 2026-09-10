import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createBaseballFinalBoxScore,
  createBaseballFinalLineScore,
  createBaseballFinalResult,
  formatBaseballBatterPrimaryLine,
  formatBaseballBatterSecondaryLine,
  formatBaseballInningsPitched,
  formatBaseballPitcherPrimaryLine,
  formatBaseballPitcherSecondaryLine,
  selectBaseballFinalHighlights,
  selectBaseballFinalMvp,
  shouldRenderCancelledBaseballFinal,
} from "../src/utils/games/baseball/finalResult.ts";
import {
  createGameState,
  type BaseballGameState,
  type PlayByPlayEntry,
} from "../src/utils/games/baseballEngine.ts";

function createFinishedGame(winner: 0 | 1 | null = 1) {
  const game = createGameState("CPU", "KIA", 5051);
  game.status = "finished";
  game.winner = winner;
  game.inning = 3;
  game.half = "bottom";
  game.battingTeam = 1;
  return game;
}

function play(
  id: string,
  values: Pick<
    PlayByPlayEntry,
    "inning" | "half" | "battingTeam" | "batterId" | "result" | "message" | "runsScored"
  >,
): PlayByPlayEntry {
  return {
    id,
    playId: `play-${id}`,
    createdAt: `2026-08-24T00:00:0${id.slice(-1)}.000Z`,
    ...values,
  };
}

test("최종 라인스코어는 최소 3이닝과 팀별 R/H/E를 보존한다", () => {
  const game = createFinishedGame();
  game.teams[0].inningRuns = [1, 0, 1];
  game.teams[0].runs = 2;
  game.teams[0].hits = 5;
  game.teams[0].errors = 1;
  game.teams[1].inningRuns = [0, 2, 1];
  game.teams[1].runs = 3;
  game.teams[1].hits = 6;
  game.teams[1].errors = 0;

  const score = createBaseballFinalLineScore(game);
  assert.deepEqual(score.innings, [1, 2, 3]);
  assert.deepEqual(score.rows[0].innings, [1, 0, 1]);
  assert.deepEqual(score.rows[1].innings, [0, 2, 1]);
  assert.deepEqual(
    score.rows.map(({ runs, hits, errors, isWinner }) => ({ runs, hits, errors, isWinner })),
    [
      { runs: 2, hits: 5, errors: 1, isWinner: false },
      { runs: 3, hits: 6, errors: 0, isWinner: true },
    ],
  );
});

test("연장 이닝과 치르지 않은 말 공격은 전체 라인스코어에서 구분한다", () => {
  const game = createFinishedGame(0);
  game.inning = 5;
  game.half = "top";
  game.teams[0].inningRuns = [0, 0, 1, 0, 2];
  game.teams[0].runs = 3;
  game.teams[1].inningRuns = [0, 1, 0, 0];
  game.teams[1].runs = 1;

  const score = createBaseballFinalLineScore(game);
  assert.deepEqual(score.innings, [1, 2, 3, 4, 5]);
  assert.deepEqual(score.rows[0].innings, [0, 0, 1, 0, 2]);
  assert.deepEqual(score.rows[1].innings, [0, 1, 0, 0, null]);
});

test("양 팀 박스스코어는 9명 전체 타순과 실제 타격 기록을 순서대로 보존한다", () => {
  const game = createFinishedGame();
  const batterId = game.teams[1].lineupPlayerIds[2];
  game.teams[1].batterStats[batterId] = {
    pa: 4,
    ab: 3,
    h: 2,
    doubles: 1,
    triples: 0,
    hr: 1,
    rbi: 3,
    r: 2,
    bb: 1,
    so: 0,
  };

  const boxScore = createBaseballFinalBoxScore(game);
  assert.equal(boxScore.length, 2);
  assert.deepEqual(boxScore.map((team) => team.batters.length), [9, 9]);
  assert.deepEqual(
    boxScore[1].batters.map((batter) => batter.playerId),
    game.teams[1].lineupPlayerIds,
  );
  assert.deepEqual(boxScore[1].batters[2], {
    playerId: "kia-kim-doyoung",
    name: "김도영",
    number: 5,
    position: "3B",
    battingOrder: 3,
    pa: 4,
    ab: 3,
    h: 2,
    doubles: 1,
    triples: 0,
    hr: 1,
    rbi: 3,
    r: 2,
    bb: 1,
    so: 0,
  });
});

test("양 팀 박스스코어는 투수의 IP/Pitches/H/R/ER/BB/SO를 실제 기록으로 만든다", () => {
  const game = createFinishedGame();
  const pitcherId = game.teams[1].pitcher.playerId;
  game.teams[1].pitcherStats[pitcherId] = {
    outsRecorded: 8,
    pitches: 52,
    hitsAllowed: 4,
    runsAllowed: 3,
    earnedRuns: 2,
    walks: 2,
    strikeouts: 6,
  };

  const pitcher = createBaseballFinalBoxScore(game)[1].pitchers[0];
  assert.deepEqual(pitcher, {
    playerId: "kia-yang-hyeonjong",
    name: "양현종",
    number: 54,
    position: "P",
    outsRecorded: 8,
    inningsPitched: "2⅔",
    pitches: 52,
    hitsAllowed: 4,
    runsAllowed: 3,
    earnedRuns: 2,
    walks: 2,
    strikeouts: 6,
  });
});

test("박스스코어는 누락·비정상 기록을 안전한 0으로 정규화하고 ER을 R 이하로 제한한다", () => {
  const game = createFinishedGame();
  const batterId = game.teams[0].lineupPlayerIds[0];
  const pitcherId = game.teams[0].pitcher.playerId;
  delete game.teams[0].batterStats[batterId];
  game.teams[0].pitcherStats[pitcherId] = {
    outsRecorded: Number.POSITIVE_INFINITY,
    pitches: -5,
    hitsAllowed: -1,
    runsAllowed: 1,
    earnedRuns: 9,
    walks: Number.NaN,
    strikeouts: -2,
  };

  const team = createBaseballFinalBoxScore(game)[0];
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(team.batters[0]).filter(([key]) => [
        "pa", "ab", "h", "doubles", "triples", "hr", "rbi", "r", "bb", "so",
      ].includes(key)),
    ),
    { pa: 0, ab: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0 },
  );
  assert.deepEqual(
    {
      outsRecorded: team.pitchers[0].outsRecorded,
      inningsPitched: team.pitchers[0].inningsPitched,
      pitches: team.pitchers[0].pitches,
      hitsAllowed: team.pitchers[0].hitsAllowed,
      runsAllowed: team.pitchers[0].runsAllowed,
      earnedRuns: team.pitchers[0].earnedRuns,
      walks: team.pitchers[0].walks,
      strikeouts: team.pitchers[0].strikeouts,
    },
    {
      outsRecorded: 0,
      inningsPitched: "0",
      pitches: 0,
      hitsAllowed: 0,
      runsAllowed: 1,
      earnedRuns: 1,
      walks: 0,
      strikeouts: 0,
    },
  );
});

test("타자 MVP는 실제 장타·타점·득점 기록으로 결정한다", () => {
  const game = createFinishedGame();
  game.teams[1].batterStats["kia-kim-doyoung"] = {
    pa: 3,
    ab: 3,
    h: 2,
    doubles: 0,
    triples: 0,
    hr: 1,
    rbi: 3,
    r: 1,
    bb: 0,
    so: 0,
  };

  const mvp = selectBaseballFinalMvp(game);
  assert.equal(mvp.playerId, "kia-kim-doyoung");
  assert.equal(mvp.name, "김도영");
  assert.equal(mvp.role, "BATTER");
  assert.equal(mvp.primaryStatLine, "3타수 2안타");
  assert.equal(mvp.secondaryStatLine, "1홈런 · 3타점");
  assert.ok(mvp.impactScore > 0);
});

test("짧은 경기에서도 압도적인 무실점 투수 기록은 MVP 후보가 된다", () => {
  const game = createFinishedGame();
  const pitcherId = game.teams[1].pitcher.playerId;
  game.teams[1].pitcherStats[pitcherId] = {
    outsRecorded: 9,
    pitches: 41,
    hitsAllowed: 1,
    runsAllowed: 0,
    earnedRuns: 0,
    walks: 0,
    strikeouts: 7,
  };

  const mvp = selectBaseballFinalMvp(game);
  assert.equal(mvp.playerId, pitcherId);
  assert.equal(mvp.role, "PITCHER");
  assert.equal(mvp.primaryStatLine, "3이닝 7탈삼진");
  assert.equal(mvp.secondaryStatLine, "1피안타 · R 0 / ER 0 · 41구");
});

test("투수 MVP 평가는 자책점을 주로 감점하고 비자책 실점은 같은 폭으로 감점하지 않는다", () => {
  const game = createFinishedGame();
  const pitcherId = game.teams[1].pitcher.playerId;
  game.teams[1].pitcherStats[pitcherId] = {
    outsRecorded: 9,
    pitches: 41,
    hitsAllowed: 1,
    runsAllowed: 4,
    earnedRuns: 0,
    walks: 0,
    strikeouts: 7,
  };

  const withZeroEarnedRuns = selectBaseballFinalMvp(game);
  game.teams[1].pitcherStats[pitcherId].earnedRuns = 4;
  const withFourEarnedRuns = selectBaseballFinalMvp(game);

  assert.equal(withZeroEarnedRuns.playerId, pitcherId);
  assert.equal(withFourEarnedRuns.playerId, pitcherId);
  assert.equal(
    withZeroEarnedRuns.impactScore - withFourEarnedRuns.impactScore,
    20,
    "4비자책은 4자책보다 총 20점 덜 감점되어야 한다",
  );
  assert.equal(withZeroEarnedRuns.secondaryStatLine, "1피안타 · R 4 / ER 0 · 41구");
  assert.equal(withFourEarnedRuns.secondaryStatLine, "1피안타 · R 4 / ER 4 · 41구");
});

test("동률 MVP는 승리 팀, 타자, 타순 순서로 항상 동일하게 선택한다", () => {
  const winningGame = createFinishedGame(1);
  assert.equal(selectBaseballFinalMvp(winningGame).playerId, "kia-park-chanho");
  assert.deepEqual(selectBaseballFinalMvp(winningGame), selectBaseballFinalMvp(winningGame));

  const draw = createFinishedGame(null);
  assert.equal(selectBaseballFinalMvp(draw).playerId, "cpu-yoon-taesung");
});

test("타격 및 투구 기록 문구는 0과 분수 이닝까지 정확히 포맷한다", () => {
  assert.equal(formatBaseballInningsPitched(0), "0");
  assert.equal(formatBaseballInningsPitched(1), "0⅓");
  assert.equal(formatBaseballInningsPitched(2), "0⅔");
  assert.equal(formatBaseballInningsPitched(3), "1");
  assert.equal(formatBaseballInningsPitched(8), "2⅔");
  assert.equal(formatBaseballInningsPitched(Number.POSITIVE_INFINITY), "0");

  const batterStats = {
    pa: 4,
    ab: 3,
    h: 2,
    doubles: 1,
    triples: 0,
    hr: 1,
    rbi: 3,
    r: 2,
    bb: 1,
    so: 0,
  };
  assert.equal(formatBaseballBatterPrimaryLine(batterStats), "3타수 2안타");
  assert.equal(formatBaseballBatterSecondaryLine(batterStats), "1홈런 · 3타점 · 1 2루타");

  const pitcherStats = {
    outsRecorded: 8,
    pitches: 46,
    hitsAllowed: 4,
    runsAllowed: 2,
    earnedRuns: 1,
    walks: 2,
    strikeouts: 5,
  };
  assert.equal(formatBaseballPitcherPrimaryLine(pitcherStats), "2⅔이닝 5탈삼진");
  assert.equal(formatBaseballPitcherSecondaryLine(pitcherStats), "4피안타 · R 2 / ER 1 · 46구");
});

test("취소 결과 판정은 완료 상태와 별개인 명시적 cancelled 신호를 우선한다", () => {
  assert.equal(shouldRenderCancelledBaseballFinal("playing"), true);
  assert.equal(shouldRenderCancelledBaseballFinal("finished"), false);
  assert.equal(shouldRenderCancelledBaseballFinal("finished", true), true);
});

test("주요 장면은 역전·동점·끝내기를 점수 흐름에서 복원해 시간순으로 보여준다", () => {
  const game = createFinishedGame(1);
  game.teams[0].runs = 2;
  game.teams[1].runs = 3;
  game.playByPlay = [
    play("entry-1", {
      inning: 1,
      half: "top",
      battingTeam: 0,
      batterId: "cpu-yoon-taesung",
      result: "DOUBLE_CENTER",
      message: "윤태성의 적시 2루타",
      runsScored: 1,
    }),
    play("entry-2", {
      inning: 2,
      half: "bottom",
      battingTeam: 1,
      batterId: "kia-kim-doyoung",
      result: "HOME_RUN_LEFT",
      message: "김도영의 좌월 홈런",
      runsScored: 2,
    }),
    play("entry-3", {
      inning: 3,
      half: "top",
      battingTeam: 0,
      batterId: "cpu-jung-mingyu",
      result: "HOME_RUN_CENTER",
      message: "정민규의 동점 홈런",
      runsScored: 1,
    }),
    play("entry-4", {
      inning: 3,
      half: "bottom",
      battingTeam: 1,
      batterId: "kia-choi-hyoungwoo",
      result: "SINGLE_CENTER",
      message: "최형우의 끝내기 안타",
      runsScored: 1,
    }),
  ];

  const highlights = selectBaseballFinalHighlights(game);
  assert.deepEqual(highlights.map((highlight) => highlight.id), ["entry-2", "entry-3", "entry-4"]);
  assert.match(highlights[0].title, /KIA 역전 2점 홈런/);
  assert.match(highlights[1].title, /CPU 동점 솔로 홈런/);
  assert.match(highlights[2].title, /KIA 끝내기 중전 안타/);
  assert.deepEqual(highlights, selectBaseballFinalHighlights(game), "동일 상태는 동일한 주요 장면을 만든다");
});

test("플레이 로그가 부족해도 결과·공격·수비 요약으로 2~3개 장면을 채운다", () => {
  const game = createFinishedGame();
  game.teams[0].runs = 1;
  game.teams[0].hits = 3;
  game.teams[0].errors = 2;
  game.teams[1].runs = 4;
  game.teams[1].hits = 7;
  game.teams[1].errors = 0;

  const defaultHighlights = selectBaseballFinalHighlights(game);
  assert.equal(defaultHighlights.length, 3);
  assert.deepEqual(defaultHighlights.map((highlight) => highlight.id), [
    "final-summary",
    "offense-summary",
    "defense-summary",
  ]);
  assert.match(defaultHighlights[0].title, /KIA 최종 승리/);
  assert.equal(selectBaseballFinalHighlights(game, 1).length, 2, "요구된 최소 장면 수는 2개다");
  assert.equal(selectBaseballFinalHighlights(game, 99).length, 3, "최대 장면 수는 3개다");
});

test("통합 결과 셀렉터는 라인스코어·MVP·주요 장면을 한 번에 만든다", () => {
  const game: BaseballGameState = createFinishedGame();
  game.teams[0].inningRuns = [0, 0, 0];
  game.teams[1].inningRuns = [1, 0, 0];
  game.teams[1].runs = 1;

  const result = createBaseballFinalResult(game);
  assert.equal(result.lineScore.rows[1].runs, 1);
  assert.equal(result.mvp.teamIndex, 1);
  assert.equal(result.highlights.length, 3);
  assert.deepEqual(result.boxScore.map((team) => team.batters.length), [9, 9]);
  assert.deepEqual(result.boxScore.map((team) => team.pitchers.length), [1, 1]);
});

test("FINAL 오버레이는 R/H/E·MVP·주요 장면·양 팀 선수 기록과 취소 전용 경로를 모두 연결한다", () => {
  const component = readFileSync(
    new URL("../src/components/games/baseball/v2/BaseballFinalOverlayV2.tsx", import.meta.url),
    "utf8",
  );
  const frame = readFileSync(
    new URL("../src/components/games/baseball/v2/BaseballOverlayFrameV2.tsx", import.meta.url),
    "utf8",
  );
  const styles = readFileSync(
    new URL("../src/styles/baseball-final-result-v2.css", import.meta.url),
    "utf8",
  );
  const stageStyles = readFileSync(
    new URL("../src/styles/baseball-v2.css", import.meta.url),
    "utf8",
  );
  const onlineGame = readFileSync(
    new URL("../src/components/games/baseball/v2/BaseballOnlineGameV2.tsx", import.meta.url),
    "utf8",
  );

  assert.match(component, /createBaseballFinalResult\(game\)/);
  assert.match(component, /<caption>최종 라인스코어<\/caption>/);
  for (const total of ["R", "H", "E"]) {
    assert.match(component, new RegExp(`<th scope="col">${total}</th>`));
  }
  assert.match(component, /aria-label="경기 주요 장면"/);
  assert.match(component, /<FinalBoxScoreV2 teams=\{result\.boxScore\} \/>/);
  assert.match(component, /aria-labelledby="bbv2-final-boxscore-heading"/);
  assert.match(component, /<caption>\{team\.teamName\} 타자 기록<\/caption>/);
  assert.match(component, /<caption>\{team\.teamName\} 투수 기록<\/caption>/);
  assert.match(component, /aria-label=\{`\$\{team\.teamName\} 타자 기록표`\}/);
  assert.match(component, /aria-label=\{`\$\{team\.teamName\} 투수 기록표`\}/);
  assert.ok((component.match(/tabIndex=\{0\}/g) ?? []).length >= 3);
  for (const stat of ["PA", "AB", "H", "2B", "3B", "HR", "RBI", "R", "BB", "SO"]) {
    assert.match(component, new RegExp(`<abbr title="[^"]+">${stat}</abbr>`));
  }
  for (const stat of ["IP", "Pitches", "H", "R", "ER", "BB", "SO"]) {
    assert.match(component, new RegExp(`<abbr title="[^"]+">${stat}</abbr>`));
  }
  assert.match(component, /<th scope="row">/);
  assert.match(component, /aria-label=\{`\$\{mvp\.name\} MVP 캐릭터 초상`\}/);
  assert.match(component, /shouldRenderCancelledBaseballFinal\(game\.status, cancelled\)/);
  assert.match(component, /live="assertive"/);
  assert.match(component, /<CancelledResultV2/);
  assert.match(onlineGame, /summary="참가자가 방을 나가 온라인 경기가 종료되었습니다\."[\s\S]*cancelled/);
  assert.doesNotMatch(component, /from ["'][^"']+\.(?:jpe?g|png|webp)["']/i);
  assert.match(frame, /role=\{modal \? "dialog" : "status"\}/);
  assert.match(frame, /aria-modal=\{modal \? true : undefined\}/);
  assert.match(frame, /tabIndex=\{modal \? -1 : undefined\}/);
  assert.match(frame, /frame\.focus\(\{ preventScroll: true \}\)/);
  assert.match(frame, /previouslyFocused\.focus\(\{ preventScroll: true \}\)/);
  assert.match(frame, /event\.key !== "Tab"/);
  assert.match(frame, /last\.focus\(\)/);
  assert.match(frame, /first\.focus\(\)/);
  assert.match(
    stageStyles,
    /\.bbv2-stage__overlay-slot:has\(> \.bbv2-overlay\[aria-modal="true"\]\)\s*\{\s*z-index: 110;/,
  );
  for (const part of ["cap", "face", "body"]) {
    assert.match(styles, new RegExp(`\\.bbv2-final-mvp__${part}`));
  }
  assert.match(styles, /\.bbv2-final-boxscore__teams\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.bbv2-final-boxscore__teams\s*\{\s*grid-template-columns:\s*1fr;/);
  assert.match(styles, /\.bbv2-final-stat-table:focus-visible/);
  assert.match(styles, /\.bbv2-final-stat-table--batters[\s\S]*position:\s*sticky;/);
  assert.doesNotMatch(
    styles,
    /font-size:\s*0\.(?:[0-6]\d*)rem/,
    "FINAL의 실제 정보 글자는 0.7rem보다 작아지면 안 된다",
  );
});
