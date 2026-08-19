import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import katex from "katex";
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
import {
  gradeSpecialMockExamResponse,
  hasSpecialMockExamResponse,
  isAnsweredSpecialMockExamAttempt,
} from "../src/utils/specialMockExamGrading.ts";
import { canAccessSpecialMockExam } from "../src/utils/specialMockExamAccess.ts";
import {
  buildSpecialMockExamReviewAnswers,
  calculateSpecialMockExamScore,
  getSpecialMockExamReviewStatus,
  hasPassedSpecialMockExam,
  SPECIAL_MOCK_EXAM_PASS_SCORE,
} from "../src/utils/specialMockExamResult.ts";
import { normalizeSpecialMockExamMath } from "../src/utils/specialMockExamText.ts";
import { shuffleArray } from "../src/utils/shuffleArray.ts";

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

test("특별 모의고사는 60점 이상만 통과한다", () => {
  assert.equal(SPECIAL_MOCK_EXAM_PASS_SCORE, 60);
  assert.equal(calculateSpecialMockExamScore(17, 30), 57);
  assert.equal(calculateSpecialMockExamScore(18, 30), 60);
  assert.equal(hasPassedSpecialMockExam(59), false);
  assert.equal(hasPassedSpecialMockExam(60), true);
});

test("채점 후 정답·오답·미답변을 모두 답변 다시 보기에서 구분한다", () => {
  assert.equal(
    getSpecialMockExamReviewStatus({ response: 1, correct: true }),
    "correct",
  );
  assert.equal(
    getSpecialMockExamReviewStatus({ response: "오답", correct: false }),
    "incorrect",
  );
  assert.equal(
    getSpecialMockExamReviewStatus({ response: null, correct: false }),
    "unanswered",
  );
  assert.equal(getSpecialMockExamReviewStatus(), "unanswered");
});

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

test("모든 문제에는 다시 보기에서 표시할 정답과 해설이 있다", () => {
  const questions = Object.values(SPECIAL_MOCK_EXAM_BANKS).flat();

  questions.forEach((question) => {
    assert.ok(question.explanation.trim(), `${question.id}: 해설 누락`);
    if (question.questionType === "multiple-choice") {
      assert.ok(question.answer !== null, `${question.id}: 정답 누락`);
    } else {
      assert.ok(
        question.modelAnswer?.trim() || question.acceptedAnswers?.[0]?.trim(),
        `${question.id}: 모범 답안 누락`,
      );
    }
  });
});

test("풀이 기록 다시 보기는 최신 답안과 미답변을 포함해 30문제를 복원한다", () => {
  const questions = SPECIAL_MOCK_EXAM_BANKS[1];
  const questionId = questions[0].id;
  const textQuestion = questions.find(
    ({ questionType }) => questionType !== "multiple-choice",
  );
  assert.ok(textQuestion);
  const attempts = [
    attempt("old", 1, questionId, false, "2026-08-19T00:00:00.000Z"),
    {
      ...attempt("latest", 1, questionId, true, "2026-08-19T00:01:00.000Z"),
      selectedAnswer: 2,
    },
    {
      ...attempt(
        "text",
        1,
        textQuestion.id,
        true,
        "2026-08-19T00:02:00.000Z",
      ),
      questionType: textQuestion.questionType,
      selectedAnswer: null,
      responseText: "저장된 서술형 답안",
    },
  ];

  const restored = buildSpecialMockExamReviewAnswers(questions, attempts);

  assert.equal(Object.keys(restored).length, 30);
  assert.deepEqual(restored[questionId], { response: 2, correct: true });
  assert.deepEqual(restored[textQuestion.id], {
    response: "저장된 서술형 답안",
    correct: true,
  });
  assert.deepEqual(restored[questions[1].id], {
    response: null,
    correct: false,
  });
});

test("코드 예시는 문제 제목과 분리된 코드 영역에 저장된다", () => {
  const questions = Object.values(SPECIAL_MOCK_EXAM_BANKS).flat();
  const codeQuestions = questions.filter(({ code }) => Boolean(code));

  assert.equal(codeQuestions.length, 2);
  codeQuestions.forEach(({ prompt, code }) => {
    assert.doesNotMatch(prompt, /\n(?:#|import |[A-Za-z_]+\s*=)/);
    assert.ok(code?.includes("\n"));
  });
  assert.match(
    SPECIAL_MOCK_EXAM_BANKS[1].find(
      ({ sourceId }) => sourceId === "exam-mc-018",
    )?.code ?? "",
    /image_embeds/,
  );
});

test("기존 ASCII 수식 표기도 KaTeX 수식으로 정규화한다", () => {
  const normalized = normalizeSpecialMockExamMath(
    "R^2, sqrt(d_k), h_t = tanh(W_hh * h_(t-1) + W_xh * x_t + b_h)",
  );

  assert.ok(normalized.includes(String.raw`$R^2$`));
  assert.ok(normalized.includes(String.raw`$\sqrt{d_k}$`));
  assert.ok(
    normalized.includes(
      String.raw`$h_t = \tanh(W_{hh}h_{t-1} + W_{xh}x_t + b_h)$`,
    ),
  );
  assert.equal(
    normalizeSpecialMockExamMath(String.raw`$x_1 + x_2$`),
    String.raw`$x_1 + x_2$`,
  );
});

test("모든 특별 모의고사 수식은 오류 없이 렌더링된다", () => {
  const mathPattern = /(\$\$[\s\S]+?\$\$|\$[^$\r\n]+?\$)/g;
  const questions = Object.values(SPECIAL_MOCK_EXAM_BANKS).flat();

  questions.forEach((question) => {
    const texts = [
      question.prompt,
      ...question.options,
      question.hint,
      question.explanation,
      question.modelAnswer ?? "",
    ];
    texts.forEach((text) => {
      const normalized = normalizeSpecialMockExamMath(text);
      const expressions = normalized.match(mathPattern) ?? [];
      expressions.forEach((expression) => {
        const delimiterLength = expression.startsWith("$$") ? 2 : 1;
        assert.doesNotThrow(
          () =>
            katex.renderToString(
              expression.slice(delimiterLength, -delimiterLength),
              { throwOnError: true },
            ),
          `${question.id}: ${expression}`,
        );
      });
    });
  });
});

test("모의고사 문제 순서는 응시 시작 시 무작위 순서로 복사된다", () => {
  const original = SPECIAL_MOCK_EXAM_BANKS[1].slice(0, 6).map(({ id }) => id);
  const shuffled = shuffleArray(original, () => 0);

  assert.notDeepEqual(shuffled, original);
  assert.deepEqual([...shuffled].sort(), [...original].sort());
  assert.deepEqual(
    SPECIAL_MOCK_EXAM_BANKS[1].slice(0, 6).map(({ id }) => id),
    original,
    "원본 문제은행 순서는 변경하지 않아야 한다",
  );
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

test("시험 종료 시 여러 답안을 하나의 pending 묶음으로 저장한다", () => {
  const userId = 55;
  const attempts = [
    attempt("batch-1", 3, SPECIAL_MOCK_EXAM_BANKS[3][0].id, true),
    attempt("batch-2", 3, SPECIAL_MOCK_EXAM_BANKS[3][1].id, false),
  ];

  specialMockExamProgressStorage.addMany(userId, attempts);

  assert.deepEqual(
    specialMockExamProgressStorage.getPendingIds(userId),
    attempts.map(({ id }) => id),
  );
  assert.deepEqual(
    specialMockExamProgressStorage.get(userId).attempts.map(({ id }) => id),
    attempts.map(({ id }) => id),
  );
});

test("미답변은 채점만 하고 완료 기록과 오답 기록에는 저장하지 않는다", () => {
  const userId = 56;
  const unanswered: SpecialMockExamAttempt = {
    ...attempt(
      "unanswered",
      1,
      SPECIAL_MOCK_EXAM_BANKS[1][0].id,
      false,
    ),
    selectedAnswer: null,
    responseText: undefined,
  };
  const answered = attempt(
    "answered",
    1,
    SPECIAL_MOCK_EXAM_BANKS[1][1].id,
    false,
  );

  assert.equal(hasSpecialMockExamResponse(null), false);
  assert.equal(hasSpecialMockExamResponse("  "), false);
  assert.equal(hasSpecialMockExamResponse(0), true);
  assert.equal(isAnsweredSpecialMockExamAttempt(unanswered), false);
  assert.equal(
    isAnsweredSpecialMockExamAttempt({
      selectedAnswer: null,
      responseText: "작성한 단답형 답안",
    }),
    true,
  );

  specialMockExamProgressStorage.addMany(userId, [unanswered, answered]);

  assert.deepEqual(
    specialMockExamProgressStorage.get(userId).attempts.map(({ id }) => id),
    [answered.id],
  );
  assert.deepEqual(specialMockExamProgressStorage.getPendingIds(userId), [
    answered.id,
  ]);
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
  assert.equal(
    gradeSpecialMockExamResponse(question, null).correct,
    false,
    "미답변도 오답으로 채점해야 한다",
  );
});
