import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import {
  getStudyResetAttemptIds,
  studyProgressStorage,
} from "../src/services/storage/studyProgressStorage.ts";
import {
  getWebStudyResetAttemptIds,
  webStudyProgressStorage,
} from "../src/services/storage/webStudyProgressStorage.ts";
import {
  aiPythonStudyProgressStorage,
  getAiPythonStudyResetAttemptIds,
} from "../src/services/storage/aiPythonStudyProgressStorage.ts";
import {
  aiPythonWeekProgressStorage,
  getAiPythonWeekResetAttemptIds,
} from "../src/services/storage/aiPythonWeekProgressStorage.ts";
import type { StudyAttempt } from "../src/types/study.ts";
import type { WebStudyAttempt } from "../src/types/webStudy.ts";
import type { AiPythonStudyAttempt } from "../src/types/aiPythonStudy.ts";
import type { AiPythonWeekAttempt } from "../src/types/aiPythonWeekStudy.ts";
import {
  resetScopedStudyProgress,
  STUDY_ATTEMPT_TABLES,
  type ScopedStudyDeleteClient,
} from "../src/services/scopedStudyProgressReset.ts";

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

const answeredAt = "2026-08-05T00:00:00.000Z";

type DeleteCall = {
  table?: string;
  eq?: [string, number];
  in?: [string, string[]];
};

function createDeleteClient(error: unknown = null) {
  const call: DeleteCall = {};
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
                  return Promise.resolve({ error });
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

function pythonAttempt(
  id: string,
  difficulty: StudyAttempt["difficulty"],
  category: StudyAttempt["category"],
): StudyAttempt {
  return {
    id,
    questionId: `python-${id}`,
    difficulty,
    category,
    questionType: "multiple-choice",
    selectedAnswer: 0,
    correct: true,
    answeredAt,
  };
}

function webAttempt(
  id: string,
  difficulty: WebStudyAttempt["difficulty"],
  category: WebStudyAttempt["category"],
): WebStudyAttempt {
  return {
    id,
    questionId: `web-${id}`,
    difficulty,
    category,
    questionType: "multiple-choice",
    selectedAnswer: 0,
    correct: true,
    answeredAt,
  };
}

function aiAttempt(
  id: string,
  category: AiPythonStudyAttempt["category"],
): AiPythonStudyAttempt {
  return {
    id,
    questionId: `ai-${id}`,
    category,
    selectedAnswer: 0,
    correct: true,
    answeredAt,
  };
}

function aiWeekAttempt(
  id: string,
  week: AiPythonWeekAttempt["week"],
  difficulty: AiPythonWeekAttempt["difficulty"],
  category: string,
): AiPythonWeekAttempt {
  return {
    id,
    week,
    questionId: `ai-week-${id}`,
    difficulty,
    category,
    questionType: "multiple-choice",
    selectedAnswer: 0,
    correct: true,
    answeredAt,
  };
}

beforeEach(() => localStorageMock.clear());

test("원격 초기화는 student_id와 정확한 attempt ID를 함께 제한한 뒤 로컬을 삭제한다", async () => {
  const userId = 11;
  studyProgressStorage.add(userId, pythonAttempt("remote-python", "easy", "operators"));
  studyProgressStorage.add(userId, pythonAttempt("kept-python", "hard", "operators"));
  const attemptIds = getStudyResetAttemptIds(
    studyProgressStorage.get(userId),
    "easy",
    ["operators"],
  );
  const { call, client } = createDeleteClient();

  const result = await resetScopedStudyProgress(
    client,
    STUDY_ATTEMPT_TABLES.python,
    userId,
    attemptIds,
    () => studyProgressStorage.remove(userId, attemptIds),
  );

  assert.equal(result.synced, true);
  assert.deepEqual(call, {
    table: "study_attempts",
    eq: ["student_id", userId],
    in: ["id", ["remote-python"]],
  });
  assert.deepEqual(result.progress.attempts.map(({ id }) => id), ["kept-python"]);
});

test("원격 삭제 실패 시 로컬 기록과 pending ID를 그대로 보존한다", async () => {
  const userId = 12;
  webStudyProgressStorage.add(userId, webAttempt("remote-web", "easy", "html"));
  const before = webStudyProgressStorage.get(userId);
  const pendingBefore = webStudyProgressStorage.getPendingIds(userId);
  const { call, client } = createDeleteClient(new Error("delete rejected"));
  let localRemoveCalled = false;

  await assert.rejects(
    resetScopedStudyProgress(
      client,
      STUDY_ATTEMPT_TABLES.web,
      userId,
      ["remote-web"],
      () => {
        localRemoveCalled = true;
        return webStudyProgressStorage.remove(userId, ["remote-web"]);
      },
    ),
    /delete rejected/,
  );

  assert.equal(localRemoveCalled, false);
  assert.deepEqual(call, {
    table: "web_study_attempts",
    eq: ["student_id", userId],
    in: ["id", ["remote-web"]],
  });
  assert.deepEqual(webStudyProgressStorage.get(userId), before);
  assert.deepEqual(webStudyProgressStorage.getPendingIds(userId), pendingBefore);
});

test("Supabase가 없으면 AI Python을 로컬에서 초기화하고 synced false를 반환한다", async () => {
  const userId = 13;
  aiPythonStudyProgressStorage.add(userId, aiAttempt("local-ai", "numpy"));

  const result = await resetScopedStudyProgress(
    null,
    STUDY_ATTEMPT_TABLES.aiPython,
    userId,
    ["local-ai"],
    () => aiPythonStudyProgressStorage.remove(userId, ["local-ai"]),
  );

  assert.equal(result.synced, false);
  assert.deepEqual(result.progress.attempts, []);
});

test("AI Python 주차 기록은 선택한 주차·난이도·범위만 서버와 로컬에서 초기화한다", async () => {
  const userId = 14;
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt("ai-python-week-v6-week1-match", "week1", "easy", "AI 기초"),
  );
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt("ai-python-week-v6-week1-hard", "week1", "hard", "AI 기초"),
  );
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt("ai-python-week-v8-week2-easy", "week2", "easy", "NLP 기초"),
  );

  const attemptIds = getAiPythonWeekResetAttemptIds(
    aiPythonWeekProgressStorage.get(userId),
    "week1",
    "easy",
    ["AI 기초"],
  );
  const { call, client } = createDeleteClient();
  const result = await resetScopedStudyProgress(
    client,
    STUDY_ATTEMPT_TABLES.aiPythonWeek,
    userId,
    attemptIds,
    () => aiPythonWeekProgressStorage.remove(userId, attemptIds),
  );

  assert.equal(result.synced, true);
  assert.deepEqual(call, {
    table: "ai_python_week_attempts",
    eq: ["student_id", userId],
    in: ["id", ["ai-python-week-v6-week1-match"]],
  });
  assert.deepEqual(
    result.progress.attempts.map(({ id }) => id),
    ["ai-python-week-v6-week1-hard", "ai-python-week-v8-week2-easy"],
  );
});

test("AI Python 3-1 중급 기록은 선택한 범위만 초기화한다", async () => {
  const userId = 15;
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week3-1-v1-cnn",
      "week3-1",
      "medium",
      "CNN 연산 및 치수/파라미터 계산",
    ),
  );
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week3-1-v1-vit",
      "week3-1",
      "easy",
      "비전 트랜스포머 및 트렌드",
    ),
  );

  const attemptIds = getAiPythonWeekResetAttemptIds(
    aiPythonWeekProgressStorage.get(userId),
    "week3-1",
    "medium",
    ["CNN 연산 및 치수/파라미터 계산"],
  );
  const { call, client } = createDeleteClient();
  const result = await resetScopedStudyProgress(
    client,
    STUDY_ATTEMPT_TABLES.aiPythonWeek,
    userId,
    attemptIds,
    () => aiPythonWeekProgressStorage.remove(userId, attemptIds),
  );

  assert.equal(result.synced, true);
  assert.deepEqual(call, {
    table: "ai_python_week_attempts",
    eq: ["student_id", userId],
    in: ["id", ["ai-python-week3-1-v1-cnn"]],
  });
  assert.deepEqual(
    result.progress.attempts.map(({ id }) => id),
    ["ai-python-week3-1-v1-vit"],
  );
});

test("AI Python 3-2 중급 기록은 선택한 범위만 초기화한다", async () => {
  const userId = 16;
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week3-2-v1-clip",
      "week3-2",
      "medium",
      "AI 파운데이션 모델과 CLIP 구조 및 원리",
    ),
  );
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week3-2-v1-vlm",
      "week3-2",
      "easy",
      "시각언어모델(VLM) 및 LLaVA",
    ),
  );

  const attemptIds = getAiPythonWeekResetAttemptIds(
    aiPythonWeekProgressStorage.get(userId),
    "week3-2",
    "medium",
    ["AI 파운데이션 모델과 CLIP 구조 및 원리"],
  );
  const { call, client } = createDeleteClient();
  const result = await resetScopedStudyProgress(
    client,
    STUDY_ATTEMPT_TABLES.aiPythonWeek,
    userId,
    attemptIds,
    () => aiPythonWeekProgressStorage.remove(userId, attemptIds),
  );

  assert.equal(result.synced, true);
  assert.deepEqual(call, {
    table: "ai_python_week_attempts",
    eq: ["student_id", userId],
    in: ["id", ["ai-python-week3-2-v1-clip"]],
  });
  assert.deepEqual(
    result.progress.attempts.map(({ id }) => id),
    ["ai-python-week3-2-v1-vlm"],
  );
});

test("AI Python 4-1 중급 기록은 선택한 범위만 초기화한다", async () => {
  const userId = 17;
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week4-1-v1-rag",
      "week4-1",
      "medium",
      "검색증강 생성 및 정보검색",
    ),
  );
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week4-1-v1-agent",
      "week4-1",
      "easy",
      "거대 언어 모델의 도구 활용 및 에이전트",
    ),
  );

  const attemptIds = getAiPythonWeekResetAttemptIds(
    aiPythonWeekProgressStorage.get(userId),
    "week4-1",
    "medium",
    ["검색증강 생성 및 정보검색"],
  );
  const { call, client } = createDeleteClient();
  const result = await resetScopedStudyProgress(
    client,
    STUDY_ATTEMPT_TABLES.aiPythonWeek,
    userId,
    attemptIds,
    () => aiPythonWeekProgressStorage.remove(userId, attemptIds),
  );

  assert.equal(result.synced, true);
  assert.deepEqual(call, {
    table: "ai_python_week_attempts",
    eq: ["student_id", userId],
    in: ["id", ["ai-python-week4-1-v1-rag"]],
  });
  assert.deepEqual(
    result.progress.attempts.map(({ id }) => id),
    ["ai-python-week4-1-v1-agent"],
  );
});

test("AI Python 4-2와 5-1 기록은 서로 독립적으로 초기화한다", async () => {
  const userId = 18;
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week4-2-v1-agent",
      "week4-2",
      "easy",
      "AI 에이전트 및 다중 에이전트 시스템",
    ),
  );
  aiPythonWeekProgressStorage.add(
    userId,
    aiWeekAttempt(
      "ai-python-week5-1-v1-compression",
      "week5-1",
      "easy",
      "모델 압축 기법",
    ),
  );

  const attemptIds = getAiPythonWeekResetAttemptIds(
    aiPythonWeekProgressStorage.get(userId),
    "week5-1",
    "easy",
    ["모델 압축 기법"],
  );
  const { call, client } = createDeleteClient();
  const result = await resetScopedStudyProgress(
    client,
    STUDY_ATTEMPT_TABLES.aiPythonWeek,
    userId,
    attemptIds,
    () => aiPythonWeekProgressStorage.remove(userId, attemptIds),
  );

  assert.equal(result.synced, true);
  assert.deepEqual(call, {
    table: "ai_python_week_attempts",
    eq: ["student_id", userId],
    in: ["id", ["ai-python-week5-1-v1-compression"]],
  });
  assert.deepEqual(
    result.progress.attempts.map(({ id }) => id),
    ["ai-python-week4-2-v1-agent"],
  );
});

test("Python은 현재 난이도와 선택 범위에 일치하는 기록만 초기화한다", () => {
  const userId = 1;
  studyProgressStorage.add(userId, pythonAttempt("python-match", "easy", "operators"));
  studyProgressStorage.add(userId, pythonAttempt("python-other-category", "easy", "sequences"));
  studyProgressStorage.add(userId, pythonAttempt("python-other-level", "hard", "operators"));
  const originalRemoteProgress = studyProgressStorage.get(userId);

  const ids = getStudyResetAttemptIds(
    studyProgressStorage.get(userId),
    "easy",
    ["operators"],
  );
  const next = studyProgressStorage.remove(userId, [...ids, "not-stored-locally"]);

  assert.deepEqual(ids, ["python-match"]);
  assert.deepEqual(
    next.attempts.map((attempt) => attempt.id),
    ["python-other-category", "python-other-level"],
  );
  assert.deepEqual(studyProgressStorage.getPendingIds(userId), [
    "python-other-category",
    "python-other-level",
  ]);

  assert.deepEqual(
    studyProgressStorage.replace(userId, originalRemoteProgress).attempts.map(({ id }) => id),
    ["python-other-category", "python-other-level"],
  );
  const retriedAttempt = {
    ...pythonAttempt("python-new-attempt", "easy", "operators"),
    questionId: "python-python-match",
  };
  studyProgressStorage.add(userId, retriedAttempt);
  assert.deepEqual(studyProgressStorage.get(userId).attempts.map(({ id }) => id), [
    "python-other-category",
    "python-other-level",
    "python-new-attempt",
  ]);
  assert.deepEqual(studyProgressStorage.getPendingIds(userId), [
    "python-other-category",
    "python-other-level",
    "python-new-attempt",
  ]);
});

test("Web은 현재 난이도에서 여러 선택 범위만 함께 초기화한다", () => {
  const userId = 2;
  webStudyProgressStorage.add(userId, webAttempt("web-html", "medium", "html"));
  webStudyProgressStorage.add(userId, webAttempt("web-css", "medium", "css"));
  webStudyProgressStorage.add(userId, webAttempt("web-hard", "hard", "html"));
  const originalRemoteProgress = webStudyProgressStorage.get(userId);

  const ids = getWebStudyResetAttemptIds(
    webStudyProgressStorage.get(userId),
    "medium",
    ["html", "css"],
  );
  const next = webStudyProgressStorage.remove(userId, ids);

  assert.deepEqual(ids, ["web-html", "web-css"]);
  assert.deepEqual(next.attempts.map((attempt) => attempt.id), ["web-hard"]);
  assert.deepEqual(webStudyProgressStorage.getPendingIds(userId), ["web-hard"]);

  assert.deepEqual(
    webStudyProgressStorage.replace(userId, originalRemoteProgress).attempts.map(({ id }) => id),
    ["web-hard"],
  );
  const retriedAttempt = {
    ...webAttempt("web-new-attempt", "medium", "html"),
    questionId: "web-web-html",
  };
  webStudyProgressStorage.add(userId, retriedAttempt);
  assert.deepEqual(webStudyProgressStorage.get(userId).attempts.map(({ id }) => id), [
    "web-hard",
    "web-new-attempt",
  ]);
  assert.deepEqual(webStudyProgressStorage.getPendingIds(userId), [
    "web-hard",
    "web-new-attempt",
  ]);
});

test("AI Python은 선택한 범위만 또는 다섯 범위 전체를 초기화한다", () => {
  const userId = 3;
  aiPythonStudyProgressStorage.add(userId, aiAttempt("ai-python", "python"));
  aiPythonStudyProgressStorage.add(userId, aiAttempt("ai-api", "api"));
  aiPythonStudyProgressStorage.add(userId, aiAttempt("ai-pandas", "pandas"));
  const originalRemoteProgress = aiPythonStudyProgressStorage.get(userId);

  const selectedIds = getAiPythonStudyResetAttemptIds(
    aiPythonStudyProgressStorage.get(userId),
    ["api", "pandas"],
  );
  aiPythonStudyProgressStorage.remove(userId, selectedIds);
  assert.deepEqual(aiPythonStudyProgressStorage.get(userId).attempts.map(({ id }) => id), [
    "ai-python",
  ]);
  assert.deepEqual(
    aiPythonStudyProgressStorage.replace(userId, originalRemoteProgress).attempts.map(({ id }) => id),
    ["ai-python"],
  );
  const retriedAttempt = {
    ...aiAttempt("ai-new-attempt", "api"),
    questionId: "ai-ai-api",
  };
  aiPythonStudyProgressStorage.add(userId, retriedAttempt);
  assert.deepEqual(aiPythonStudyProgressStorage.get(userId).attempts.map(({ id }) => id), [
    "ai-python",
    "ai-new-attempt",
  ]);
  assert.deepEqual(aiPythonStudyProgressStorage.getPendingIds(userId), [
    "ai-python",
    "ai-new-attempt",
  ]);

  const allIds = getAiPythonStudyResetAttemptIds(
    aiPythonStudyProgressStorage.get(userId),
    ["python", "api", "numpy", "pandas", "matplotlib_eda"],
  );
  assert.deepEqual(aiPythonStudyProgressStorage.remove(userId, allIds).attempts, []);
  assert.deepEqual(aiPythonStudyProgressStorage.getPendingIds(userId), []);
});

test("한 과목의 초기화는 다른 과목 저장소를 변경하지 않는다", () => {
  const userId = 4;
  studyProgressStorage.add(userId, pythonAttempt("python-kept", "easy", "operators"));
  webStudyProgressStorage.add(userId, webAttempt("web-kept", "easy", "html"));
  aiPythonStudyProgressStorage.add(userId, aiAttempt("ai-reset", "numpy"));

  const aiIds = getAiPythonStudyResetAttemptIds(
    aiPythonStudyProgressStorage.get(userId),
    ["numpy"],
  );
  aiPythonStudyProgressStorage.remove(userId, aiIds);

  assert.deepEqual(studyProgressStorage.get(userId).attempts.map(({ id }) => id), [
    "python-kept",
  ]);
  assert.deepEqual(webStudyProgressStorage.get(userId).attempts.map(({ id }) => id), [
    "web-kept",
  ]);
  assert.deepEqual(aiPythonStudyProgressStorage.get(userId).attempts, []);
});

test("서버 동기화 결과로 교체하면 다른 기기에서 삭제된 로컬 기록이 되살아나지 않는다", () => {
  const userId = 5;
  studyProgressStorage.add(userId, pythonAttempt("stale-local", "easy", "operators"));
  studyProgressStorage.markSynced(userId, ["stale-local"]);

  const remote = {
    attempts: [pythonAttempt("remote-kept", "medium", "functions")],
  };
  const next = studyProgressStorage.replace(userId, remote);

  assert.deepEqual(next.attempts.map(({ id }) => id), ["remote-kept"]);
  assert.deepEqual(studyProgressStorage.getPendingIds(userId), []);
});
