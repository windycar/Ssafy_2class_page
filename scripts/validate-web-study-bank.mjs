import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

try {
  const { WEB_QUESTION_BANK, WEB_CATEGORY_META } = await server.ssrLoadModule(
    "/src/data/questionBanks/webQuestionBank.ts",
  );
  const { gradeWebResponse, WEB_ESSAY_MIN_LENGTH } = await server.ssrLoadModule(
    "/src/utils/webStudyGrading.ts",
  );
  const memoryStorage = new Map();
  globalThis.localStorage = {
    getItem: (key) => memoryStorage.get(key) ?? null,
    setItem: (key, value) => memoryStorage.set(key, value),
    removeItem: (key) => memoryStorage.delete(key),
    clear: () => memoryStorage.clear(),
  };
  const { webStudyProgressStorage } = await server.ssrLoadModule(
    "/src/services/storage/webStudyProgressStorage.ts",
  );
  const failures = [];
  const seenIds = new Set();
  const placeholderPattern = /(?:wrong-[A-Z]|med-ans|hard-ans|응용 문제 Q|교안 .*파트에 기재)/i;

  for (const [difficulty, questions] of Object.entries(WEB_QUESTION_BANK)) {
    const typeCounts = {
      "multiple-choice": 0,
      "short-answer": 0,
      essay: 0,
    };
    const categoryCounts = Object.fromEntries(
      Object.keys(WEB_CATEGORY_META).map((category) => [category, 0]),
    );
    const normalizedPrompts = new Set();

    if (questions.length !== 100) {
      failures.push(`${difficulty}: 100문항이 아닙니다 (${questions.length})`);
    }

    for (const question of questions) {
      typeCounts[question.questionType] += 1;
      categoryCounts[question.category] += 1;

      if (seenIds.has(question.id)) failures.push(`중복 ID: ${question.id}`);
      seenIds.add(question.id);

      const normalizedPrompt = `${question.prompt}\n${question.code ?? ""}`
        .replace(/\s+/g, " ")
        .trim();
      if (normalizedPrompts.has(normalizedPrompt)) {
        failures.push(`${difficulty} 중복 지문: ${question.id}`);
      }
      normalizedPrompts.add(normalizedPrompt);

      if (
        !question.id ||
        !question.conceptId ||
        !question.prompt ||
        !question.explanation ||
        !question.hint ||
        placeholderPattern.test(JSON.stringify(question))
      ) {
        failures.push(`불완전 문항: ${question.id}`);
      }

      if (question.questionType === "multiple-choice") {
        if (
          question.options.length !== 4 ||
          new Set(question.options).size !== 4 ||
          question.answer === null ||
          !gradeWebResponse(question, question.answer).correct
        ) {
          failures.push(`객관식 형식/채점 실패: ${question.id}`);
        }
      }

      if (question.questionType === "short-answer") {
        const expected = question.acceptedAnswers?.[0] ?? "";
        if (!expected || !gradeWebResponse(question, expected).correct) {
          failures.push(`단답형 채점 실패: ${question.id}`);
        }
      }

      if (question.questionType === "essay") {
        const modelAnswer = question.modelAnswer ?? "";
        if (
          question.minLength !== WEB_ESSAY_MIN_LENGTH ||
          modelAnswer.length < WEB_ESSAY_MIN_LENGTH ||
          !gradeWebResponse(question, modelAnswer).correct
        ) {
          failures.push(`서술형 모범답안/채점 실패: ${question.id}`);
        }
      }
    }

    if (
      typeCounts["multiple-choice"] !== 60 ||
      typeCounts["short-answer"] !== 25 ||
      typeCounts.essay !== 15
    ) {
      failures.push(`${difficulty} 유형 비율 오류: ${JSON.stringify(typeCounts)}`);
    }
    if (Object.values(categoryCounts).some((count) => count === 0)) {
      failures.push(`${difficulty} 누락 범위: ${JSON.stringify(categoryCounts)}`);
    }

    console.log(JSON.stringify({ difficulty, total: questions.length, typeCounts, categoryCounts }));
  }

  const storageQuestion = WEB_QUESTION_BANK.easy[0];
  const storageAttempt = {
    id: "web-storage-test-attempt",
    questionId: storageQuestion.id,
    difficulty: storageQuestion.difficulty,
    category: storageQuestion.category,
    questionType: storageQuestion.questionType,
    selectedAnswer: storageQuestion.answer,
    correct: true,
    answeredAt: new Date(0).toISOString(),
  };
  webStudyProgressStorage.add(9999, storageAttempt);
  const restoredProgress = webStudyProgressStorage.get(9999);
  const pendingAttempts = webStudyProgressStorage.getPending(9999);
  if (
    restoredProgress.attempts[0]?.id !== storageAttempt.id ||
    pendingAttempts[0]?.id !== storageAttempt.id
  ) {
    failures.push("풀이 기록 로컬 저장/복원 실패");
  }
  delete globalThis.localStorage;

  console.log(JSON.stringify({ total: seenIds.size, failures }));
  if (failures.length) throw new Error("웹 문제은행 검증에 실패했습니다.");
} finally {
  await server.close();
}
