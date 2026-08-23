import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  parseStateFreeBaseballCommittedNotice,
  processBaseballCommittedNotice,
} from "../src/hooks/useBaseballCommandNoticeChannel.ts";
import {
  BASEBALL_ONLINE_PROTOCOL_VERSION,
  createBaseballMatchCommittedNotice,
  type BaseballMatchCommandEnvelope,
  type NoticeCursor,
} from "../src/utils/games/baseball/onlineProtocol.ts";

const envelope: BaseballMatchCommandEnvelope = {
  schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
  roomId: "baseball-notice-room",
  matchId: "baseball-notice-match",
  commandId: "notice-command-8",
  commandSequence: 8,
  baseRoomRevision: 17,
  baseGameRevision: 7,
  actorSeat: 1,
  seed: 8123,
  playId: "notice-play-4",
  kind: "START_PITCH",
  command: {
    commandId: "notice-command-8",
    expectedRevision: 7,
    playId: "notice-play-4",
    sequence: 4,
    pitcherId: "cpu-kang-minjae",
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
  },
};
const notice = createBaseballMatchCommittedNotice(envelope, 18, 8);

function cursor(overrides: Partial<NoticeCursor> = {}): NoticeCursor {
  return {
    roomId: envelope.roomId,
    matchId: envelope.matchId,
    seed: envelope.seed,
    lastCommandSequence: 7,
    lastRoomRevision: 17,
    seenCommandIds: new Set(),
    ...overrides,
  };
}

test("정상 commit notice는 상태 적용이 아닌 canonical room 재조회 신호가 된다", () => {
  assert.deepEqual(parseStateFreeBaseballCommittedNotice(notice), notice);
  assert.deepEqual(processBaseballCommittedNotice(cursor(), notice), {
    kind: "REFETCH",
    reason: "COMMIT",
    decision: "APPLY",
    notice,
  });
});

test("sequence/revision 공백과 중복 notice 모두 명시적인 재조회 신호가 된다", () => {
  const gap = {
    ...notice,
    commandId: "notice-command-10",
    commandSequence: 10,
    baseRoomRevision: 19,
    committedRoomRevision: 20,
  };
  assert.deepEqual(processBaseballCommittedNotice(cursor(), gap), {
    kind: "REFETCH",
    reason: "GAP",
    decision: "REFETCH_GAP",
    notice: gap,
  });
  assert.deepEqual(processBaseballCommittedNotice(cursor({
    seenCommandIds: new Set([notice.commandId]),
  }), notice), {
    kind: "REFETCH",
    reason: "DUPLICATE",
    decision: "IGNORE_DUPLICATE",
    notice,
  });
});

test("지연·다른 경기·깨진 notice는 무시한다", () => {
  assert.deepEqual(processBaseballCommittedNotice(cursor({
    lastCommandSequence: 8,
    lastRoomRevision: 18,
  }), notice), {
    kind: "IGNORE",
    decision: "IGNORE_STALE",
    notice,
  });
  assert.deepEqual(processBaseballCommittedNotice(cursor(), {
    ...notice,
    matchId: "different-match",
  }), {
    kind: "IGNORE",
    decision: "REJECT_CONTEXT",
    notice: { ...notice, matchId: "different-match" },
  });
  assert.deepEqual(processBaseballCommittedNotice(cursor(), {
    ...notice,
    actorSeat: 7,
  }), {
    kind: "IGNORE",
    decision: "REJECT_INVALID",
    notice: null,
  });
});

test("room/game state나 임의 필드가 섞인 방송 payload를 거부한다", () => {
  assert.equal(parseStateFreeBaseballCommittedNotice({
    ...notice,
    state: { inning: 1 },
  }), null);
  assert.equal(parseStateFreeBaseballCommittedNotice({
    ...notice,
    room: { id: notice.roomId },
  }), null);
  assert.equal(parseStateFreeBaseballCommittedNotice({
    ...notice,
    arbitrary: true,
  }), null);

  const source = readFileSync(
    path.join(process.cwd(), "src/hooks/useBaseballCommandNoticeChannel.ts"),
    "utf8",
  );
  assert.match(source, /createBaseballMatchCommittedNotice/);
  assert.match(source, /parseBaseballMatchCommittedNotice/);
  assert.match(source, /decideBaseballMatchNotice/);
  assert.match(source, /authenticateBaseballRealtime\(supabase\)/);
  assert.match(source, /private:\s*true/);
  assert.ok(
    source.indexOf("const realtimeAuth = await authenticateBaseballRealtime")
      < source.indexOf("const channel = supabase.channel"),
  );
  assert.doesNotMatch(source, /Math\.random/);
  assert.doesNotMatch(source, /payload:\s*(?:room|state|gameState)/);
});
