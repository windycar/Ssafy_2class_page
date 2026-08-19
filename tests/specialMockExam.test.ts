import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import {
  SPECIAL_MOCK_EXAM_BANKS,
  SPECIAL_MOCK_EXAM_META,
} from "../src/data/모의고사/2회차/index.ts";
import { STUDY_REVIEW_TRACKS } from "../src/config/studyReviewTracks.ts";
import {
  getSpecialMockExamResetAttemptIds,
  specialMockExamProgressStorage,
} from "../src/services/storage/specialMockExamProgressStorage.ts";
import {
  resetScopedStudyProgress,
  STUDY_ATTEMPT_TABLES,
  type ScopedStudyDeleteClient,
} from "../src/services/scopedStudyProgressReset.ts";
import { reconcileRemoteProgress } from "../src/services/storage/reconcileStudyProgress.ts";
import type {
  SpecialMockExamAttempt,
  SpecialMockExamRound,
} from "../src/types/specialMockExam.ts";
import { getSpecialMockExamAttemptIdPrefix } from "../src/types/specialMockExam.ts";
import { SPECIAL_MOCK_EXAM_TOTAL_QUESTION_COUNT } from "../src/types/specialMockExam.ts";
import {
  countUnresolvedMistakes,
  getLatestAttemptsByQuestion,
} from "../src/utils/studyProgressStats.ts";
import { gradeSpecialMockExamResponse } from "../src/utils/specialMockExamGrading.ts";
import { canAccessSpecialMockExam } from "../src/utils/specialMockExamAccess.ts";

class LocalStorageMock {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, String(value));
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  clear() {
    this.values.clear();
  }
}

const localStorageMock = new LocalStorageMock();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: localStorageMock,
});

function attempt(
  idSuffix: string,
  mockRound: SpecialMockExamRound,
  questionId: string,
  correct: boolean,
  answeredAt = "2026-08-19T00:00:00.000Z",
): SpecialMockExamAttempt {
  return {
    id: `${getSpecialMockExamAttemptIdPrefix(mockRound)}${idSuffix}`,
    assessmentRound: 2,
    mockRound,
    questionId,
    difficulty: "medium",
    category: "테스트",
    questionType: "multiple-choice",
    selectedAnswer: 0,
    correct,
    answeredAt,
  };
}

function createDeleteClient() {
  const call: {
    table?: string;
    eq?: [string, number];
    in?: [string, string[]];
  } = {};
  const client: ScopedStudyDeleteClient = {
    from(table) {
      call.table = table;
      return {
        delete() {
          return {
            eq(column, value) {
              call.eq = [column, value];
              return {
                in(inColumn, values) {
                  call.in = [inColumn, [...values]];
                  return Promise.resolve({ error: null });
                },
              };
            },
          };
        },
      };
    },
  };
  return { call, client };
}

beforeEach(() => localStorageMock.clear());

test("특별 모의고사는 승인된 회원과 관리자만 접근한다", () => {
  assert.equal(canAccessSpecialMockExam(null), false);
  assert.equal(
    canAccessSpecialMockExam({
      role: "member",
      canAccessSpecialMockExam: false,
    }),
    false,
  );
  assert.equal(
    canAccessSpecialMockExam({
      role: "member",
      canAccessSpecialMockExam: true,
    }),
    true,
  );
  assert.equal(
    canAccessSpecialMockExam({
      role: "admin",
      canAccessSpecialMockExam: false,
    }),
    true,
  );
});

test("특별 모의고사 서버 기록도 활성 계정과 승인 권한을 함께 검사한다", () => {
  const migration = readFileSync(
    new URL(
      "../supabase/migrations/20260819110000_special_mock_exam_access.sql",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(migration, /m\.auth_user_id = \(select auth\.uid\(\)\)/);
  assert.match(migration, /m\.is_active = true/);
  assert.match(
    migration,
    /m\.role = 'admin' or m\.can_access_special_mock_exam = true/,
  );
  assert.doesNotMatch(migration, /to anon/);
});

test("과목평가 2회차에는 서로 충돌하지 않는 30문제짜리 모의고사 5세트가 있다", () => {
  const allIds = Object.values(SPECIAL_MOCK_EXAM_BANKS).flatMap((questions) => {
    assert.equal(questions.length, 30);
    assert.equal(new Set(questions.map(({ id }) => id)).size, 30);
    return questions.map(({ id }) => id);
  });

  assert.equal(allIds.length, 150);
  assert.equal(allIds.length, SPECIAL_MOCK_EXAM_TOTAL_QUESTION_COUNT);
  assert.equal(new Set(allIds).size, 150);
  assert.equal(SPECIAL_MOCK_EXAM_META[3].label, "모의고사 3회차");
  assert.equal(SPECIAL_MOCK_EXAM_BANKS[3][0].sourceId, "r3-mc-001");
  assert.match(SPECIAL_MOCK_EXAM_BANKS[3][0].prompt, /과적합/);
});

test("특별 모의고사 5세트가 오답 선택 화면에 모두 등록된다", () => {
  const tracks = STUDY_REVIEW_TRACKS.filter(
    (track) => track.source === "special-mock-exam",
  );
  assert.deepEqual(
    tracks.map(({ round }) => round),
    [1, 2, 3, 4, 5],
  );
  tracks.forEach((track) => assert.match(track.href, /mode=wrong/));
});

test("풀이 기록은 사용자별 pending으로 저장되고 회차별 초기화된다", async () => {
  const userId = 41;
  const round1 = attempt("round-1", 1, SPECIAL_MOCK_EXAM_BANKS[1][0].id, false);
  const round2 = attempt("round-2", 2, SPECIAL_MOCK_EXAM_BANKS[2][0].id, true);
  specialMockExamProgressStorage.add(userId, round1);
  specialMockExamProgressStorage.add(userId, round2);

  assert.deepEqual(
    specialMockExamProgressStorage.getPendingIds(userId),
    [round1.id, round2.id],
  );
  const resetIds = getSpecialMockExamResetAttemptIds(
    specialMockExamProgressStorage.get(userId),
    1,
  );
  const { call, client } = createDeleteClient();
  const result = await resetScopedStudyProgress(
    client,
    STUDY_ATTEMPT_TABLES.specialMockExam,
    userId,
    resetIds,
    () => specialMockExamProgressStorage.remove(userId, resetIds),
  );

  assert.equal(result.synced, true);
  assert.deepEqual(call, {
    table: "special_mock_exam_attempts",
    eq: ["student_id", userId],
    in: ["id", [round1.id]],
  });
  assert.deepEqual(result.progress.attempts.map(({ id }) => id), [round2.id]);
  assert.deepEqual(specialMockExamProgressStorage.getPendingIds(userId), [round2.id]);

  specialMockExamProgressStorage.replace(userId, { attempts: [round1, round2] });
  assert.deepEqual(
    specialMockExamProgressStorage.get(userId).attempts.map(({ id }) => id),
    [round2.id],
    "초기화 tombstone이 서버의 오래된 기록 부활을 막아야 한다",
  );
});

test("서버 기록으로 교체할 때 요청 중 새로 생긴 로컬 답안만 보존한다", () => {
  const remote = attempt("remote", 4, "q-remote", true);
  const staleLocal = attempt("stale", 4, "q-stale", false);
  const newLocal = attempt(
    "new",
    4,
    "q-new",
    false,
    "2026-08-19T00:01:00.000Z",
  );
  const reconciled = reconcileRemoteProgress(
    { attempts: [remote] },
    { attempts: [staleLocal, newLocal] },
    new Set([staleLocal.id]),
  );
  assert.deepEqual(
    reconciled.attempts.map(({ id }) => id),
    [remote.id, newLocal.id],
  );
});

test("오답 복습은 문제별 최신 답안이 틀린 문제만 계산한다", () => {
  const q1 = SPECIAL_MOCK_EXAM_BANKS[5][0].id;
  const q2 = SPECIAL_MOCK_EXAM_BANKS[5][1].id;
  const attempts = [
    attempt("q1-wrong", 5, q1, false, "2026-08-19T00:00:00.000Z"),
    attempt("q2-right", 5, q2, true, "2026-08-19T00:01:00.000Z"),
    attempt("q1-right", 5, q1, true, "2026-08-19T00:02:00.000Z"),
    attempt("q2-wrong", 5, q2, false, "2026-08-19T00:03:00.000Z"),
  ];

  assert.equal(countUnresolvedMistakes(attempts), 1);
  assert.deepEqual(
    getLatestAttemptsByQuestion(attempts)
      .filter(({ correct }) => !correct)
      .map(({ questionId }) => questionId),
    [q2],
  );
});

test("객관식 답안은 문제은행 정답 인덱스로 채점한다", () => {
  const question = SPECIAL_MOCK_EXAM_BANKS[1][0];
  assert.equal(question.questionType, "multiple-choice");
  assert.equal(
    gradeSpecialMockExamResponse(question, question.answer ?? -1).correct,
    true,
  );
  assert.equal(
    gradeSpecialMockExamResponse(
      question,
      ((question.answer ?? 0) + 1) % question.options.length,
    ).correct,
    false,
  );
});
