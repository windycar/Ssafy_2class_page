import { existsSync } from "node:fs";
import { createServer } from "vite";
import katex from "katex";

const EXPECTED_DIFFICULTY_TYPE_COUNTS = {
  week1: {
    easy: { "multiple-choice": 84, "short-answer": 14, essay: 7 },
    medium: { "multiple-choice": 84, "short-answer": 14, essay: 7 },
    hard: { "multiple-choice": 72, "short-answer": 12, essay: 6 },
  },
  week2: Object.fromEntries(
    ["easy", "medium", "hard"].map((difficulty) => [
      difficulty,
      { "multiple-choice": 120, "short-answer": 20, essay: 10 },
    ]),
  ),
};
const EXPECTED_QUESTIONS_PER_DIFFICULTY = {
  week1: { easy: 105, medium: 105, hard: 90 },
  week2: { easy: 150, medium: 150, hard: 150 },
};
const EXPECTED_CATEGORIES_PER_DIFFICULTY = {
  week1: { easy: 7, medium: 7, hard: 6 },
  week2: { easy: 10, medium: 10, hard: 10 },
};

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
});

try {
  const {
    AI_PYTHON_WEEK_ALL_QUESTIONS,
    AI_PYTHON_WEEK_META,
    AI_PYTHON_WEEK_QUESTION_BANKS,
  } = await server.ssrLoadModule(
    "/src/data/questionBanks/aiPythonWeekQuestionBank.ts",
  );
  const {
    hasObviousCorrectAnswerLengthCue,
    hasSupplementaryOptionParenthetical,
  } = await server.ssrLoadModule(
    "/src/data/questionBanks/stabilizeAiPythonWeekOptions.ts",
  );
  const failures = [];
  const report = {};

  for (const week of ["week1", "week2"]) {
    const bank = AI_PYTHON_WEEK_QUESTION_BANKS[week];
    const questions = AI_PYTHON_WEEK_ALL_QUESTIONS[week];
    const ids = new Set();
    const prompts = new Set();
    const forbiddenReference =
      /(강의자료|강의 자료|방법론 강의|슬라이드|그림|도표|결과표|본문에서|자료에 따르면|자료에서)/;
    const typeCounts = {
      "multiple-choice": 0,
      "short-answer": 0,
      essay: 0,
    };
    const difficultyTypeCounts = Object.fromEntries(
      ["easy", "medium", "hard"].map((difficulty) => [difficulty, {
        "multiple-choice": 0,
        "short-answer": 0,
        essay: 0,
      }]),
    );
    const answerPositions = [0, 0, 0, 0];
    let uniquelyLongestCorrect = 0;
    const hintCounts = new Map();
    const explanationCounts = new Map();

    const expectedWeekTotal = Object.values(
      EXPECTED_QUESTIONS_PER_DIFFICULTY[week],
    ).reduce((total, count) => total + count, 0);
    if (questions.length !== expectedWeekTotal) {
      failures.push(
        `${week}: 총 ${questions.length}문제 (기대값 ${expectedWeekTotal})`,
      );
    }

    for (const difficulty of ["easy", "medium", "hard"]) {
      const expectedDifficultyTotal =
        EXPECTED_QUESTIONS_PER_DIFFICULTY[week][difficulty];
      if (bank[difficulty].length !== expectedDifficultyTotal) {
        failures.push(
          `${week}/${difficulty}: ${bank[difficulty].length}문제 (기대값 ${expectedDifficultyTotal})`,
        );
      }
    }

    questions.forEach((question) => {
      if (ids.has(question.id)) failures.push(`${week}: 중복 ID ${question.id}`);
      ids.add(question.id);
      const normalizedPrompt = question.prompt.replace(/\s+/g, " ").trim();
      if (prompts.has(normalizedPrompt)) {
        failures.push(`${week}: 중복 문제 문장 ${question.id}`);
      }
      prompts.add(normalizedPrompt);
      typeCounts[question.questionType] += 1;
      difficultyTypeCounts[question.difficulty][question.questionType] += 1;
      hintCounts.set(question.hint, (hintCounts.get(question.hint) ?? 0) + 1);
      explanationCounts.set(
        question.explanation,
        (explanationCounts.get(question.explanation) ?? 0) + 1,
      );

      if (!question.prompt.trim() || !question.explanation.trim() || !question.hint.trim()) {
        failures.push(`${week}: 불완전 문항 ${question.id}`);
      }
      const requiredExplanationSections =
        question.questionType === "multiple-choice"
          ? ["정답인 이유\n"]
          : question.questionType === "short-answer"
            ? ["정답인 이유\n"]
            : ["정답인 이유\n"];
      const forbiddenExplanationSections = [
        "풀이 순서",
        "답안 작성 방법",
        "답안 구성 방법",
        "모범 답안의 논리",
        "반드시 포함할 핵심어",
        "핵심 절차 또는 사용 목적에 해당한다",
      ];
      if (
        question.explanation.length < 70 ||
        /\n정답은\s*[“"]/.test(question.explanation) ||
        requiredExplanationSections.some(
          (section) => !question.explanation.includes(section),
        ) ||
        forbiddenExplanationSections.some((section) =>
          question.explanation.includes(section),
        )
      ) {
        failures.push(`${week}: 문항별 정답 해설 누락 ${question.id}`);
      }
      const visibleText = [
        question.prompt,
        question.explanation,
        question.hint,
        question.modelAnswer ?? "",
        ...question.options,
      ].join(" ");
      if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(visibleText)) {
        failures.push(`${week}: 제어문자 포함 ${question.id}`);
      }
      for (const match of visibleText.matchAll(/\$([^$\r\n]+?)\$/g)) {
        try {
          katex.renderToString(match[1], {
            throwOnError: true,
            strict: false,
          });
        } catch (error) {
          failures.push(
            `${week}: 수식 문법 오류 ${question.id} (${error instanceof Error ? error.message : String(error)})`,
          );
        }
      }
      if (forbiddenReference.test(visibleText)) {
        failures.push(`${week}: 자료 의존 표현 ${question.id}`);
      }
      if (/이다이다|다이다|\?\?|undefined|null null/.test(visibleText)) {
        failures.push(`${week}: 어색한 문장 ${question.id}`);
      }
      if (/근거는 다음과 같다:|몇 cm|이미지로 단어를 예측|라벨로 문장을 예측|이메일 발신자는 누구인가/.test(visibleText)) {
        failures.push(`${week}: 약한 문제·해설 표현 ${question.id}`);
      }
      if (
        question.questionType === "multiple-choice" &&
        (question.options.length !== 4 ||
          new Set(question.options).size !== 4 ||
          !Number.isInteger(question.answer) ||
          question.answer < 0 ||
          question.answer > 3)
      ) {
        failures.push(`${week}: 객관식 형식 오류 ${question.id}`);
      }
      if (question.questionType === "multiple-choice" && Number.isInteger(question.answer)) {
        answerPositions[question.answer] += 1;
        if (hasObviousCorrectAnswerLengthCue(question)) {
          failures.push(`${week}: 정답 길이 단서 ${question.id}`);
        }
        const correctOption = question.options[question.answer];
        const optionLengths = question.options.map((option) =>
          option.replace(/\s+/g, " ").replace(/[`*_~$]/g, "").trim().length,
        );
        if (
          optionLengths.every(
            (length, index) =>
              index === question.answer ||
              length < optionLengths[question.answer],
          )
        ) {
          uniquelyLongestCorrect += 1;
        }
        const correctHasSupplement =
          hasSupplementaryOptionParenthetical(correctOption);
        const supplementCount = question.options.filter((option) =>
          hasSupplementaryOptionParenthetical(option),
        ).length;
        if (correctHasSupplement && supplementCount === 1) {
          failures.push(`${week}: 정답만 괄호 보충 표기 ${question.id}`);
        }
      }
      if (
        question.questionType !== "multiple-choice" &&
        !(question.acceptedAnswers?.length || question.modelAnswer)
      ) {
        failures.push(`${week}: 주관식 정답 누락 ${question.id}`);
      }
      if (question.questionType === "essay" && question.minLength !== 20) {
        failures.push(
          `${week}: 서술형 최소 글자 수 ${question.id} (${question.minLength ?? "미지정"}자)`,
        );
      }
    });

    const expectedTypeCounts = ["multiple-choice", "short-answer", "essay"].reduce(
      (counts, type) => ({
        ...counts,
        [type]: Object.values(EXPECTED_DIFFICULTY_TYPE_COUNTS[week]).reduce(
          (total, difficultyCounts) => total + difficultyCounts[type],
          0,
        ),
      }),
      {},
    );
    if (
      typeCounts["multiple-choice"] !== expectedTypeCounts["multiple-choice"] ||
      typeCounts["short-answer"] !== expectedTypeCounts["short-answer"] ||
      typeCounts.essay !== expectedTypeCounts.essay
    ) {
      failures.push(`${week}: 문제 유형 수 오류 ${JSON.stringify(typeCounts)}`);
    }
    for (const difficulty of ["easy", "medium", "hard"]) {
      const counts = difficultyTypeCounts[difficulty];
      const expectedDifficultyCounts =
        EXPECTED_DIFFICULTY_TYPE_COUNTS[week][difficulty];
      if (
        counts["multiple-choice"] !== expectedDifficultyCounts["multiple-choice"] ||
        counts["short-answer"] !== expectedDifficultyCounts["short-answer"] ||
        counts.essay !== expectedDifficultyCounts.essay
      ) {
        failures.push(
          `${week}/${difficulty}: 문제 유형 수 오류 ${JSON.stringify(counts)}`,
        );
      }
      const categoryTypeCounts = new Map();
      bank[difficulty].forEach((question) => {
        const categoryCounts = categoryTypeCounts.get(question.category) ?? {
          "multiple-choice": 0,
          "short-answer": 0,
          essay: 0,
        };
        categoryCounts[question.questionType] += 1;
        categoryTypeCounts.set(question.category, categoryCounts);
      });
      const expectedCategoryTotal =
        EXPECTED_CATEGORIES_PER_DIFFICULTY[week][difficulty];
      if (categoryTypeCounts.size !== expectedCategoryTotal) {
        failures.push(
          `${week}/${difficulty}: 출제 영역 ${categoryTypeCounts.size}개 (기대값 ${expectedCategoryTotal})`,
        );
      }
      categoryTypeCounts.forEach((categoryCounts, category) => {
        if (
          categoryCounts["multiple-choice"] !== 12 ||
          categoryCounts["short-answer"] !== 2 ||
          categoryCounts.essay !== 1
        ) {
          failures.push(
            `${week}/${difficulty}/${category}: 문제 유형 수 오류 ${JSON.stringify(categoryCounts)}`,
          );
        }
      });
    }
    if (Math.max(...answerPositions) - Math.min(...answerPositions) > 2) {
      failures.push(`${week}: 객관식 정답 위치 편중 ${JSON.stringify(answerPositions)}`);
    }
    if (uniquelyLongestCorrect > typeCounts["multiple-choice"] * 0.35) {
      failures.push(
        `${week}: 가장 긴 보기가 정답인 문항 편중 ${uniquelyLongestCorrect}/${typeCounts["multiple-choice"]}`,
      );
    }
    const maxHintReuse = Math.max(...hintCounts.values());
    const maxExplanationReuse = Math.max(...explanationCounts.values());
    if (maxHintReuse > 20) {
      failures.push(`${week}: 동일 힌트 ${maxHintReuse}회 반복`);
    }
    if (maxExplanationReuse > 8) {
      failures.push(`${week}: 동일 해설 ${maxExplanationReuse}회 반복`);
    }

    const imagePath = `public${AI_PYTHON_WEEK_META[week].imageSrc}`;
    if (!existsSync(imagePath)) failures.push(`${week}: 카드 이미지 누락 ${imagePath}`);

    report[week] = {
      total: questions.length,
      difficulties: Object.fromEntries(
        Object.entries(bank).map(([difficulty, items]) => [difficulty, items.length]),
      ),
      typeCounts,
      difficultyTypeCounts,
      answerPositions,
      uniquelyLongestCorrect,
      maxHintReuse,
      maxExplanationReuse,
      categories: new Set(questions.map((question) => question.category)).size,
    };
  }

  console.log(JSON.stringify({ report, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
