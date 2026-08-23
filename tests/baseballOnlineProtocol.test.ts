import assert from "node:assert/strict";
import test from "node:test";

import {
  BASEBALL_ONLINE_PROTOCOL_VERSION,
  createBaseballMatchCommittedNotice,
  decideBaseballMatchNotice,
  parseBaseballMatchCommandEnvelope,
  parseBaseballMatchCommittedNotice,
  type BaseballMatchCommandEnvelope,
  type NoticeCursor,
} from "../src/utils/games/baseball/onlineProtocol.ts";

const envelope: BaseballMatchCommandEnvelope = {
  schemaVersion: BASEBALL_ONLINE_PROTOCOL_VERSION,
  roomId: "baseball-room-1",
  matchId: "match-1",
  commandId: "command-8",
  commandSequence: 8,
  baseRoomRevision: 17,
  baseGameRevision: 7,
  actorSeat: 0,
  seed: 8123,
  playId: "play-4",
  kind: "START_PITCH",
  command: {
    commandId: "command-8",
    expectedRevision: 7,
    playId: "play-4",
    sequence: 4,
    pitcherId: "cpu-kang-minjae",
    pitchType: "fourSeam",
    target: { x: 0.5, y: 0.5 },
    timingQuality: "GOOD",
  },
};

const notice = createBaseballMatchCommittedNotice(envelope, 18, 8);
const cursor: NoticeCursor = {
  roomId: envelope.roomId,
  matchId: envelope.matchId,
  seed: envelope.seed,
  lastCommandSequence: 7,
  lastRoomRevision: 17,
  seenCommandIds: new Set(),
};

test("정상 커밋 알림은 상태 대신 검증 가능한 재조회 신호만 담는다", () => {
  assert.deepEqual(parseBaseballMatchCommandEnvelope(envelope), envelope);
  assert.deepEqual(parseBaseballMatchCommittedNotice(JSON.parse(JSON.stringify(notice))), notice);
  assert.equal(decideBaseballMatchNotice(cursor, notice), "APPLY");
  assert.equal(Object.hasOwn(notice, "state"), false);
  assert.equal(Object.hasOwn(notice, "room"), false);
});

test("타격 명령의 시각은 서버가 기록하므로 클라이언트 occurredAt을 거부한다", () => {
  const batterEnvelope: BaseballMatchCommandEnvelope = {
    ...envelope,
    commandId: "command-9",
    commandSequence: 9,
    baseRoomRevision: 18,
    baseGameRevision: 8,
    actorSeat: 1,
    kind: "BATTER_ACTION",
    command: {
      commandId: "command-9",
      expectedRevision: 8,
      playId: envelope.playId,
      batterId: "cpu-yoon-taesung",
      action: { kind: "TAKE", batterId: "cpu-yoon-taesung" },
    },
  };
  assert.deepEqual(parseBaseballMatchCommandEnvelope(batterEnvelope), batterEnvelope);
  assert.equal(parseBaseballMatchCommandEnvelope({
    ...batterEnvelope,
    command: { ...batterEnvelope.command, occurredAt: "2026-08-23T12:00:00.000Z" },
  }), null);
  assert.equal(parseBaseballMatchCommandEnvelope({
    ...batterEnvelope,
    command: { ...batterEnvelope.command, expectedRevision: 7 },
  }), null);
});

test("중복·지연 알림은 무시하고 sequence 또는 revision 간격은 전체 재조회를 요구한다", () => {
  assert.equal(decideBaseballMatchNotice({
    ...cursor,
    seenCommandIds: new Set([notice.commandId]),
  }, notice), "IGNORE_DUPLICATE");
  assert.equal(decideBaseballMatchNotice({
    ...cursor,
    lastCommandSequence: 8,
    lastRoomRevision: 18,
  }, notice), "IGNORE_STALE");
  assert.equal(decideBaseballMatchNotice(cursor, {
    ...notice,
    commandId: "command-10",
    commandSequence: 10,
    baseRoomRevision: 19,
    committedRoomRevision: 20,
  }), "REFETCH_GAP");
});

test("다른 방·경기·seed 알림과 구조가 깨진 payload는 거부한다", () => {
  assert.equal(decideBaseballMatchNotice(cursor, { ...notice, roomId: "baseball-other" }), "REJECT_CONTEXT");
  assert.equal(decideBaseballMatchNotice(cursor, { ...notice, matchId: "match-other" }), "REJECT_CONTEXT");
  assert.equal(decideBaseballMatchNotice(cursor, { ...notice, seed: 999 }), "REJECT_CONTEXT");
  assert.equal(decideBaseballMatchNotice(cursor, { ...notice, actorSeat: 3 }), "REJECT_INVALID");
  assert.equal(decideBaseballMatchNotice(cursor, { ...notice, committedRoomRevision: 17 }), "REJECT_INVALID");
  assert.equal(parseBaseballMatchCommittedNotice({ ...notice, state: { winner: 0 } })?.commandId, notice.commandId);
});

test("커밋 revision은 방 revision을 정확히 1 증가시켜야 한다", () => {
  assert.throws(
    () => createBaseballMatchCommittedNotice(envelope, 19, 8),
    /advance the room by exactly one/,
  );
  assert.throws(
    () => createBaseballMatchCommittedNotice(envelope, 18, 0),
    /Committed revisions/,
  );
});
