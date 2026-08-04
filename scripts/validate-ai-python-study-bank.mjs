import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

try {
  const { AI_PYTHON_CATEGORY_META, AI_PYTHON_QUESTION_BANK } =
    await server.ssrLoadModule("/src/data/aiPythonQuestionBank.ts");
  const memoryStorage = new Map();
  globalThis.localStorage = {
    getItem: (key) => memoryStorage.get(key) ?? null,
    setItem: (key, value) => memoryStorage.set(key, value),
    removeItem: (key) => memoryStorage.delete(key),
    clear: () => memoryStorage.clear(),
  };
  const { aiPythonStudyProgressStorage } = await server.ssrLoadModule(
    "/src/services/storage/aiPythonStudyProgressStorage.ts",
  );

  const failures = [];
  const ids = new Set();
  const prompts = new Set();
  const categoryCounts = Object.fromEntries(
    Object.keys(AI_PYTHON_CATEGORY_META).map((category) => [category, 0]),
  );

  if (AI_PYTHON_QUESTION_BANK.length !== 100) {
    failures.push(`100문항이 아닙니다 (${AI_PYTHON_QUESTION_BANK.length})`);
  }

  AI_PYTHON_QUESTION_BANK.forEach((question, index) => {
    const expectedId = `ai-python-q-${String(index + 1).padStart(3, "0")}`;
    if (question.id !== expectedId) failures.push(`문항 ID 순서 오류: ${question.id}`);
    if (ids.has(question.id)) failures.push(`중복 ID: ${question.id}`);
    ids.add(question.id);

    const promptKey = `${question.prompt}\n${question.code ?? ""}`
      .replace(/\s+/g, " ")
      .trim();
    if (prompts.has(promptKey)) failures.push(`중복 지문: ${question.id}`);
    prompts.add(promptKey);

    if (!(question.category in categoryCounts)) {
      failures.push(`알 수 없는 영역: ${question.id}`);
    } else {
      categoryCounts[question.category] += 1;
    }

    if (
      question.questionType !== "multiple-choice" ||
      question.options.length !== 4 ||
      new Set(question.options).size !== 4 ||
      !Number.isInteger(question.answer) ||
      question.answer < 0 ||
      question.answer > 3
    ) {
      failures.push(`객관식 형식 오류: ${question.id}`);
    }

    if (
      !question.prompt.trim() ||
      !question.explanation.trim() ||
      !question.hint.trim() ||
      /\[cite:|placeholder|TODO|정답 미정/i.test(JSON.stringify(question)) ||
      "difficulty" in question
    ) {
      failures.push(`불완전 문항: ${question.id}`);
    }
  });

  if (Object.values(categoryCounts).some((count) => count === 0)) {
    failures.push(`누락 영역: ${JSON.stringify(categoryCounts)}`);
  }

  const storageQuestion = AI_PYTHON_QUESTION_BANK[0];
  const attempt = {
    id: "ai-python-storage-test",
    questionId: storageQuestion.id,
    category: storageQuestion.category,
    selectedAnswer: storageQuestion.answer,
    correct: true,
    answeredAt: new Date(0).toISOString(),
  };
  aiPythonStudyProgressStorage.add(9999, attempt);
  const restored = aiPythonStudyProgressStorage.get(9999);
  const pending = aiPythonStudyProgressStorage.getPending(9999);
  if (
    restored.attempts.length !== 1 ||
    restored.attempts[0].id !== attempt.id ||
    pending.length !== 1 ||
    pending[0].id !== attempt.id
  ) {
    failures.push("로컬 저장 및 대기열 복원 실패");
  }

  console.log(
    JSON.stringify({
      total: AI_PYTHON_QUESTION_BANK.length,
      categoryCounts,
      failures,
    }),
  );
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
