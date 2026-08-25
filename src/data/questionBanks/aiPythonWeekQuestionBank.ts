import { QUESTION_BANK as WEEK_1_QUESTION_BANK } from "./week1AiMlQuestions";
import { QUESTION_BANK as WEEK_2_QUESTION_BANK } from "./week2NlpFoundationQuestions";
import { QUESTION_BANK as WEEK_3_1_SOURCE_BANK } from "./week3-1Easy";
import { QUESTION_BANK as WEEK_3_1_MEDIUM_SOURCE_BANK } from "./week3-1medium";
import { QUESTION_BANK as WEEK_3_2_SOURCE_BANK } from "./week3-2Easy";
import { QUESTION_BANK as WEEK_3_2_MEDIUM_SOURCE_BANK } from "./week3-2medium";
import { QUESTION_BANK as WEEK_4_1_SOURCE_BANK } from "./week4-1Easy";
import { QUESTION_BANK as WEEK_4_1_MEDIUM_SOURCE_BANK } from "./week4-1medium";
import { QUESTION_BANK as WEEK_4_2_SOURCE_BANK } from "./week4-2Easy";
import { QUESTION_BANK as WEEK_5_1_SOURCE_BANK } from "./week5-1Easy";
import type {
  AiPythonWeek,
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
} from "../../types/aiPythonWeekStudy";
import { enrichAiPythonWeekQuestionBankExplanations } from "./enrichAiPythonWeekExplanations";
import {
  balanceAiPythonWeekQuestionBankOptionLengths,
  stabilizeAiPythonWeekQuestionBank,
} from "./stabilizeAiPythonWeekOptions";
export { AI_PYTHON_WEEK_META } from "./aiPythonWeekMeta";

const CITATION_MARKER = /\s*\[cite:\s*\d+\]/gi;

type WeekSourceQuestion =
  | (typeof WEEK_3_1_SOURCE_BANK.easy)[number]
  | (typeof WEEK_3_1_MEDIUM_SOURCE_BANK.medium)[number]
  | (typeof WEEK_3_2_SOURCE_BANK.easy)[number]
  | (typeof WEEK_3_2_MEDIUM_SOURCE_BANK.medium)[number]
  | (typeof WEEK_4_1_SOURCE_BANK.easy)[number]
  | (typeof WEEK_4_1_MEDIUM_SOURCE_BANK.medium)[number]
  | (typeof WEEK_4_2_SOURCE_BANK.easy)[number]
  | (typeof WEEK_5_1_SOURCE_BANK.easy)[number];

function withoutCitationMarker(value: string) {
  return value.replace(CITATION_MARKER, "").trim();
}

function normalizeWeekQuestion(
  question: WeekSourceQuestion,
  difficulty: "easy" | "medium",
  questionIndex: number,
  questionIdPrefix = "",
): AiPythonWeekQuestion {
  const options = question.options.map(withoutCitationMarker);
  let answer = question.answer;
  if (
    question.questionType === "multiple-choice" &&
    Number.isInteger(answer)
  ) {
    const currentAnswer = answer as number;
    const balancedAnswer = questionIndex % 4;
    [options[currentAnswer], options[balancedAnswer]] = [
      options[balancedAnswer],
      options[currentAnswer],
    ];
    answer = balancedAnswer;
  }

  return {
    ...question,
    id: `${questionIdPrefix}${question.id}`,
    difficulty,
    prompt: withoutCitationMarker(question.prompt),
    options,
    answer,
    acceptedAnswers: question.acceptedAnswers?.map(withoutCitationMarker),
    modelAnswer: question.modelAnswer
      ? withoutCitationMarker(question.modelAnswer)
      : undefined,
    rubricKeywords: question.rubricKeywords?.map(withoutCitationMarker),
    explanation: withoutCitationMarker(question.explanation),
    hint: withoutCitationMarker(question.hint ?? question.explanation),
  };
}

function buildWeekQuestionBank(
  easyQuestions: WeekSourceQuestion[],
  mediumQuestions: WeekSourceQuestion[],
  questionIdPrefix = "",
): Record<
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion[]
> {
  return {
    easy: easyQuestions.map((question, index) =>
      normalizeWeekQuestion(question, "easy", index, questionIdPrefix),
    ),
    medium: mediumQuestions.map((question, index) =>
      normalizeWeekQuestion(question, "medium", index, questionIdPrefix),
    ),
    hard: [],
  };
}

const WEEK_3_1_QUESTION_BANK = buildWeekQuestionBank(
  WEEK_3_1_SOURCE_BANK.easy,
  WEEK_3_1_MEDIUM_SOURCE_BANK.medium,
);

const WEEK_3_2_QUESTION_BANK = buildWeekQuestionBank(
  WEEK_3_2_SOURCE_BANK.easy,
  WEEK_3_2_MEDIUM_SOURCE_BANK.medium,
);

const WEEK_4_1_QUESTION_BANK = buildWeekQuestionBank(
  WEEK_4_1_SOURCE_BANK.easy,
  WEEK_4_1_MEDIUM_SOURCE_BANK.medium,
);

const WEEK_4_2_QUESTION_BANK = buildWeekQuestionBank(
  WEEK_4_2_SOURCE_BANK.easy,
  [],
  "week4-2-",
);

const WEEK_5_1_QUESTION_BANK = buildWeekQuestionBank(
  WEEK_5_1_SOURCE_BANK.easy,
  [],
  "week5-1-",
);

export const AI_PYTHON_WEEK_QUESTION_BANKS = {
  week1: enrichAiPythonWeekQuestionBankExplanations(
    stabilizeAiPythonWeekQuestionBank(WEEK_1_QUESTION_BANK),
  ),
  week2: enrichAiPythonWeekQuestionBankExplanations(
    stabilizeAiPythonWeekQuestionBank(WEEK_2_QUESTION_BANK),
  ),
  "week3-1": enrichAiPythonWeekQuestionBankExplanations(
    stabilizeAiPythonWeekQuestionBank(WEEK_3_1_QUESTION_BANK),
  ),
  "week3-2": enrichAiPythonWeekQuestionBankExplanations(
    stabilizeAiPythonWeekQuestionBank(WEEK_3_2_QUESTION_BANK),
  ),
  "week4-1": enrichAiPythonWeekQuestionBankExplanations(
    stabilizeAiPythonWeekQuestionBank(WEEK_4_1_QUESTION_BANK),
  ),
  "week4-2": enrichAiPythonWeekQuestionBankExplanations(
    balanceAiPythonWeekQuestionBankOptionLengths(
      stabilizeAiPythonWeekQuestionBank(WEEK_4_2_QUESTION_BANK),
    ),
  ),
  "week5-1": enrichAiPythonWeekQuestionBankExplanations(
    balanceAiPythonWeekQuestionBankOptionLengths(
      stabilizeAiPythonWeekQuestionBank(WEEK_5_1_QUESTION_BANK),
    ),
  ),
} as Record<
  AiPythonWeek,
  Record<AiPythonWeekDifficulty, AiPythonWeekQuestion[]>
>;

export const AI_PYTHON_WEEK_ALL_QUESTIONS = Object.fromEntries(
  Object.entries(AI_PYTHON_WEEK_QUESTION_BANKS).map(([week, bank]) => [
    week,
    Object.values(bank).flat(),
  ]),
) as Record<AiPythonWeek, AiPythonWeekQuestion[]>;

export const ALL_AI_PYTHON_WEEK_QUESTIONS = Object.values(
  AI_PYTHON_WEEK_ALL_QUESTIONS,
).flat();

export function isAiPythonWeek(value: string | undefined): value is AiPythonWeek {
  return Boolean(
    value &&
      Object.prototype.hasOwnProperty.call(AI_PYTHON_WEEK_QUESTION_BANKS, value),
  );
}

export function getAiPythonWeekCategories(week: AiPythonWeek) {
  return [
    ...new Set(
      AI_PYTHON_WEEK_ALL_QUESTIONS[week].map((question) => question.category),
    ),
  ];
}

export function getAiPythonWeekDifficulties(week: AiPythonWeek) {
  return (["easy", "medium", "hard"] as AiPythonWeekDifficulty[]).filter(
    (difficulty) => AI_PYTHON_WEEK_QUESTION_BANKS[week][difficulty].length > 0,
  );
}

export function getAiPythonWeekQuestion(
  week: AiPythonWeek,
  questionId: string,
) {
  return AI_PYTHON_WEEK_ALL_QUESTIONS[week].find(
    (question) => question.id === questionId,
  );
}
