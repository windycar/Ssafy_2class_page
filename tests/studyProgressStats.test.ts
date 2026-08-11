import assert from "node:assert/strict";
import test from "node:test";
import {
  countUnresolvedMistakes,
  getLatestAttemptsByQuestion,
} from "../src/utils/studyProgressStats.ts";
import { reconcileRemoteProgress } from "../src/services/storage/reconcileStudyProgress.ts";

const attempts = [
  { id: "a-wrong", questionId: "a", correct: false },
  { id: "b-correct", questionId: "b", correct: true },
  { id: "a-correct", questionId: "a", correct: true },
  { id: "c-wrong", questionId: "c", correct: false },
];

test("복습 오답은 문제별 가장 최근 답안만 기준으로 계산한다", () => {
  assert.equal(countUnresolvedMistakes(attempts), 1);
});

test("문제별 최신 답안은 최근 문제 순서로 반환한다", () => {
  assert.deepEqual(
    getLatestAttemptsByQuestion(attempts).map((attempt) => attempt.id),
    ["c-wrong", "a-correct", "b-correct"],
  );
});

test("서버 재조회는 오래된 로컬 기록을 버리고 요청 중 추가된 답안만 보존한다", () => {
  const beforeIds = new Set(["stale-local"]);
  const remote = {
    attempts: [
      {
        id: "remote-kept",
        questionId: "remote-question",
        correct: true,
        answeredAt: "2026-08-11T00:00:00.000Z",
      },
    ],
  };
  const currentLocal = {
    attempts: [
      {
        id: "stale-local",
        questionId: "stale-question",
        correct: false,
        answeredAt: "2026-08-10T00:00:00.000Z",
      },
      {
        id: "concurrent-answer",
        questionId: "new-question",
        correct: true,
        answeredAt: "2026-08-11T00:01:00.000Z",
      },
    ],
  };

  assert.deepEqual(
    reconcileRemoteProgress(remote, currentLocal, beforeIds).attempts.map(
      (attempt) => attempt.id,
    ),
    ["remote-kept", "concurrent-answer"],
  );
});
