import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  baseballVisualPlaybackReducer,
  createBaseballVisualPlaybackStartAction,
  createInitialBaseballVisualPlaybackState,
  transitionBaseballVisualPlayback,
  type BaseballVisualPlaybackAction,
  type BaseballVisualPlaybackState,
} from "../src/hooks/useBaseballVisualPlayback.ts";
import { createGameState } from "../src/utils/games/baseball/gameState.ts";
import type {
  BaseballCameraMode,
  VisualEvent,
  VisualEventKind,
} from "../src/utils/games/baseball/types.ts";

function visualEvent(
  playId: string,
  sequence: number,
  kind: VisualEventKind,
  skippable: boolean,
  camera: BaseballCameraMode = "BATTER",
): VisualEvent {
  return {
    id: `${playId}:visual:${sequence}`,
    playId,
    sequence,
    kind,
    camera,
    durationMs: 700 + sequence * 100,
    skippable,
    payload: { sequence },
  };
}

function run(
  state: BaseballVisualPlaybackState,
  action: BaseballVisualPlaybackAction,
) {
  return transitionBaseballVisualPlayback(state, action);
}

test("START는 큐와 sourceGame을 복제하고 첫 이벤트 시작 효과를 한 번만 만든다", () => {
  const game = createGameState("CPU", "1P", 901);
  const events = [
    visualEvent("play-a", 0, "CONTACT", false, "CONTACT"),
    visualEvent("play-a", 1, "BALL_FLIGHT", true, "LEFT_FIELD"),
  ];
  const action = createBaseballVisualPlaybackStartAction({
    playId: "play-a",
    events,
    sourceGame: game,
  });

  events[0].payload.sequence = 99;
  game.teams[0].runs = 7;
  assert.equal(action.events[0].payload.sequence, 0);
  assert.equal(action.sourceGame?.teams[0].runs, 0);

  const initial = createInitialBaseballVisualPlaybackState();
  const started = run(initial, action);
  assert.equal(started.state.active, true);
  assert.equal(started.state.playId, "play-a");
  assert.equal(started.state.eventIndex, 0);
  assert.equal(started.state.eventProgress, 0);
  assert.equal(started.state.sourceGame?.seed, 901);
  assert.deepEqual(
    started.effects.map((effect) => effect.type),
    ["EVENT_START"],
  );
  assert.equal(started.effects[0].type === "EVENT_START" && started.effects[0].event.id, action.events[0].id);

  const duplicate = run(started.state, action);
  assert.equal(duplicate.state, started.state);
  assert.deepEqual(duplicate.effects, []);
});

test("SKIP은 skippable 이벤트만 넘기고 완료 효과는 정확히 한 번 만든다", () => {
  const first = visualEvent("play-b", 0, "CONTACT", false, "CONTACT");
  const second = visualEvent("play-b", 1, "BALL_FLIGHT", true, "CENTER_FIELD");
  let transition = run(
    createInitialBaseballVisualPlaybackState(),
    createBaseballVisualPlaybackStartAction({ playId: "play-b", events: [first, second] }),
  );

  const blocked = run(transition.state, {
    type: "SKIP",
    playId: "play-b",
    eventId: first.id,
  });
  assert.equal(blocked.state, transition.state);
  assert.deepEqual(blocked.effects, []);

  transition = run(transition.state, {
    type: "ADVANCE",
    playId: "play-b",
    eventId: first.id,
  });
  assert.equal(transition.state.eventIndex, 1);
  assert.deepEqual(transition.effects.map((effect) => effect.type), ["EVENT_START"]);

  transition = run(transition.state, {
    type: "SKIP",
    playId: "play-b",
    eventId: second.id,
  });
  assert.equal(transition.state.active, false);
  assert.equal(transition.state.eventIndex, 2);
  assert.equal(transition.state.eventProgress, 1);
  assert.deepEqual(transition.effects.map((effect) => effect.type), ["COMPLETE"]);

  const repeated = run(transition.state, {
    type: "ADVANCE",
    playId: "play-b",
    eventId: second.id,
  });
  assert.equal(repeated.state, transition.state);
  assert.deepEqual(repeated.effects, []);
});

test("TICK은 현재 playId와 eventId에만 적용하고 진행률을 0~1로 제한한다", () => {
  const event = visualEvent("play-c", 0, "PLAY_RESULT", false);
  const started = run(
    createInitialBaseballVisualPlaybackState(),
    createBaseballVisualPlaybackStartAction({ playId: "play-c", events: [event] }),
  );
  const stale = run(started.state, {
    type: "TICK",
    playId: "old-play",
    eventId: event.id,
    progress: 0.5,
  });
  assert.equal(stale.state, started.state);

  const ticked = run(started.state, {
    type: "TICK",
    playId: "play-c",
    eventId: event.id,
    progress: 3,
  });
  assert.equal(ticked.state.eventProgress, 1);
  assert.deepEqual(ticked.effects, []);
});

test("새 playId는 진행 중 큐를 대체하고 이전 플레이 완료를 발생시키지 않는다", () => {
  const eventA = visualEvent("play-d-a", 0, "BALL_FLIGHT", true, "LEFT_FIELD");
  const eventB = visualEvent("play-d-b", 0, "RUNNER_ADVANCE", true, "FIRST_BASE_LINE");
  const startedA = run(
    createInitialBaseballVisualPlaybackState(),
    createBaseballVisualPlaybackStartAction({ playId: "play-d-a", events: [eventA] }),
  );
  const startedB = run(
    startedA.state,
    createBaseballVisualPlaybackStartAction({ playId: "play-d-b", events: [eventB] }),
  );

  assert.equal(startedB.state.playId, "play-d-b");
  assert.equal(startedB.state.events[0].id, eventB.id);
  assert.deepEqual(startedB.effects.map((effect) => effect.type), ["EVENT_START"]);
  assert.equal(startedB.effects.some((effect) => effect.type === "COMPLETE"), false);
  assert.deepEqual([...startedB.state.startedPlayIds].sort(), ["play-d-a", "play-d-b"]);

  const replayOld = run(
    startedB.state,
    createBaseballVisualPlaybackStartAction({ playId: "play-d-a", events: [eventA] }),
  );
  assert.equal(replayOld.state, startedB.state);
  assert.deepEqual(replayOld.effects, []);
});

test("CANCEL은 RAF 대상 상태를 비우되 같은 playId의 재시작을 허용하지 않는다", () => {
  const event = visualEvent("play-e", 0, "BALL_FLIGHT", true, "RIGHT_FIELD");
  const started = run(
    createInitialBaseballVisualPlaybackState(),
    createBaseballVisualPlaybackStartAction({
      playId: "play-e",
      events: [event],
      sourceGame: createGameState("CPU", "1P", 902),
    }),
  );
  const cancelled = run(started.state, { type: "CANCEL" });
  assert.equal(cancelled.state.active, false);
  assert.equal(cancelled.state.playId, null);
  assert.equal(cancelled.state.events.length, 0);
  assert.equal(cancelled.state.sourceGame, null);
  assert.equal(cancelled.state.startedPlayIds.has("play-e"), true);
  assert.deepEqual(cancelled.effects, []);

  const replay = run(
    cancelled.state,
    createBaseballVisualPlaybackStartAction({ playId: "play-e", events: [event] }),
  );
  assert.equal(replay.state, cancelled.state);
  assert.deepEqual(replay.effects, []);
});

test("빈 큐도 즉시 완료를 한 번만 알리고 reducer는 transition 상태와 동일하다", () => {
  const initial = createInitialBaseballVisualPlaybackState();
  const action = createBaseballVisualPlaybackStartAction({
    playId: "play-empty",
    events: [],
  });
  const transition = run(initial, action);
  assert.equal(transition.state.active, false);
  assert.equal(transition.state.eventProgress, 1);
  assert.deepEqual(transition.effects.map((effect) => effect.type), ["COMPLETE"]);
  assert.deepEqual(baseballVisualPlaybackReducer(initial, action), transition.state);

  const duplicate = run(transition.state, action);
  assert.deepEqual(duplicate.effects, []);
});

test("Solo controller는 공통 playback hook을 쓰고 자체 visual RAF 상태를 보유하지 않는다", () => {
  const source = readFileSync(
    new URL("../src/hooks/useBaseballSoloController.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /useBaseballVisualPlayback\(/);
  assert.match(source, /sourceGame: result\.state/);
  assert.doesNotMatch(source, /visualEventStartedAtRef|visualEventsRef|visualEventIndexRef/);
  assert.doesNotMatch(source, /setVisualEvents|setVisualEventIndex|setCurrentVisualEventProgress/);
});
