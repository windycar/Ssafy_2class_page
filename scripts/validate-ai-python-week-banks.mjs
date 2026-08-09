import { existsSync } from "node:fs";
import { createServer } from "vite";

const server = await createServer({
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
    const hintCounts = new Map();
    const explanationCounts = new Map();

    if (questions.length !== 300) {
      failures.push(`${week}: 총 ${questions.length}문제 (기대값 300)`);
    }

    for (const difficulty of ["easy", "medium", "hard"]) {
      if (bank[difficulty].length !== 100) {
        failures.push(
          `${week}/${difficulty}: ${bank[difficulty].length}문제 (기대값 100)`,
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
      const visibleText = [
        question.prompt,
        question.explanation,
        question.hint,
        question.modelAnswer ?? "",
        ...question.options,
      ].join(" ");
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
      }
      if (
        question.questionType !== "multiple-choice" &&
        !(question.acceptedAnswers?.length || question.modelAnswer)
      ) {
        failures.push(`${week}: 주관식 정답 누락 ${question.id}`);
      }
    });

    if (
      typeCounts["multiple-choice"] !== 225 ||
      typeCounts["short-answer"] !== 45 ||
      typeCounts.essay !== 30
    ) {
      failures.push(`${week}: 문제 유형 수 오류 ${JSON.stringify(typeCounts)}`);
    }
    for (const difficulty of ["easy", "medium", "hard"]) {
      const counts = difficultyTypeCounts[difficulty];
      if (
        counts["multiple-choice"] !== 75 ||
        counts["short-answer"] !== 15 ||
        counts.essay !== 10
      ) {
        failures.push(
          `${week}/${difficulty}: 문제 유형 수 오류 ${JSON.stringify(counts)}`,
        );
      }
    }
    if (Math.max(...answerPositions) - Math.min(...answerPositions) > 2) {
      failures.push(`${week}: 객관식 정답 위치 편중 ${JSON.stringify(answerPositions)}`);
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
