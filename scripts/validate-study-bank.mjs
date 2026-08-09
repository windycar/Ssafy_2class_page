import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

try {
  const { PYTHON_QUESTION_BANK } = await server.ssrLoadModule(
    "/src/data/questionBanks/pythonQuestionBank.ts",
  );
  const { gradePythonResponse } = await server.ssrLoadModule(
    "/src/utils/studyGrading.ts",
  );
  const invalidQuestions = [];
  const gradingFailures = [];
  const promptMismatches = [];
  const ungroupedDuplicateVariants = [];
  const bankShapeFailures = [];
  const duplicateQuestionIds = [];
  const seenQuestionIds = new Set();

  for (const [difficulty, questions] of Object.entries(PYTHON_QUESTION_BANK)) {
    const typeCounts = {
      "multiple-choice": 0,
      "short-answer": 0,
      essay: 0,
    };

    for (const question of questions) {
      if (seenQuestionIds.has(question.id)) {
        duplicateQuestionIds.push(question.id);
      }
      seenQuestionIds.add(question.id);
      typeCounts[question.questionType] += 1;

      if (
        !question.id ||
        !question.conceptId ||
        !question.prompt ||
        !question.explanation
      ) {
        invalidQuestions.push(question.id);
      }

      if (question.questionType === "short-answer") {
        const expected = question.acceptedAnswers?.[0] ?? "";
        if (!gradePythonResponse(question, expected).correct) {
          gradingFailures.push(question.id);
        }
      }

      if (question.questionType === "essay") {
        if (!gradePythonResponse(question, question.modelAnswer ?? "").correct) {
          gradingFailures.push(question.id);
        }

        const shortOnlyWording =
          /(답|값|결과)(을|를)?\s*(입력|작성)하(시오|세요)/.test(
            question.prompt,
          );
        const asksForReason =
          /(이유|과정|순서|원리|근거|설명|서술)/.test(question.prompt);
        if (shortOnlyWording || !asksForReason) {
          promptMismatches.push({
            id: question.id,
            prompt: question.prompt,
          });
        }
      }
    }

    const conceptGroups = new Map();
    for (const question of questions) {
      const group = conceptGroups.get(question.conceptId) ?? [];
      group.push(question);
      conceptGroups.set(question.conceptId, group);
    }
    const conceptSizes = [...conceptGroups.values()].map(
      (group) => group.length,
    );
    if (
      questions.length !== 100 ||
      typeCounts["multiple-choice"] !== 60 ||
      typeCounts["short-answer"] !== 25 ||
      typeCounts.essay !== 15 ||
      conceptGroups.size !== 100
    ) {
      bankShapeFailures.push(difficulty);
    }

    const normalizedVariantGroups = new Map();
    for (const question of questions) {
      const basePrompt = question.prompt.split("\n")[0];
      const signature = `${basePrompt}\n${question.code ?? ""}`
        .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '"#"')
        .replace(/-?\d+(?:\.\d+)?/g, "#")
        .replace(/\s+/g, " ")
        .trim();
      const group = normalizedVariantGroups.get(signature) ?? [];
      group.push(question);
      normalizedVariantGroups.set(signature, group);
    }
    for (const group of normalizedVariantGroups.values()) {
      const conceptIds = new Set(
        group.map((question) => question.conceptId),
      );
      if (group.length > 1 && conceptIds.size > 1) {
        ungroupedDuplicateVariants.push(
          group.map((question) => question.id),
        );
      }
    }

    console.log(
      JSON.stringify({
        difficulty,
        total: questions.length,
        concepts: new Set(
          questions.map((question) => question.conceptId),
        ).size,
        typeCounts,
        conceptSize: {
          min: Math.min(...conceptSizes),
          max: Math.max(...conceptSizes),
        },
      }),
    );
  }

  console.log(
    JSON.stringify({
      invalidQuestions,
      gradingFailures,
      promptMismatches,
      ungroupedDuplicateVariants,
      bankShapeFailures,
      duplicateQuestionIds,
    }),
  );

  if (
    invalidQuestions.length > 0 ||
    gradingFailures.length > 0 ||
    promptMismatches.length > 0 ||
    ungroupedDuplicateVariants.length > 0 ||
    bankShapeFailures.length > 0 ||
    duplicateQuestionIds.length > 0
  ) {
    throw new Error("학습 문제은행 검증에 실패했습니다.");
  }
} finally {
  await server.close();
}
