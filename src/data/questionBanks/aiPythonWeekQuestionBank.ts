import { QUESTION_BANK as WEEK_1_QUESTION_BANK } from "./week1AiMlQuestions";
import { QUESTION_BANK as WEEK_2_QUESTION_BANK } from "./week2NlpFoundationQuestions";
import type {
  AiPythonWeek,
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
} from "../../types/aiPythonWeekStudy";
import { enrichAiPythonWeekQuestionBankExplanations } from "./enrichAiPythonWeekExplanations";
import { stabilizeAiPythonWeekQuestionBank } from "./stabilizeAiPythonWeekOptions";
export { AI_PYTHON_WEEK_META } from "./aiPythonWeekMeta";

export const AI_PYTHON_WEEK_QUESTION_BANKS = {
  week1: enrichAiPythonWeekQuestionBankExplanations(
    stabilizeAiPythonWeekQuestionBank(WEEK_1_QUESTION_BANK),
  ),
  week2: enrichAiPythonWeekQuestionBankExplanations(
    stabilizeAiPythonWeekQuestionBank(WEEK_2_QUESTION_BANK),
  ),
} as Record<
  AiPythonWeek,
  Record<AiPythonWeekDifficulty, AiPythonWeekQuestion[]>
>;

export const AI_PYTHON_WEEK_ALL_QUESTIONS = {
  week1: Object.values(AI_PYTHON_WEEK_QUESTION_BANKS.week1).flat(),
  week2: Object.values(AI_PYTHON_WEEK_QUESTION_BANKS.week2).flat(),
} as Record<AiPythonWeek, AiPythonWeekQuestion[]>;

export const ALL_AI_PYTHON_WEEK_QUESTIONS = [
  ...AI_PYTHON_WEEK_ALL_QUESTIONS.week1,
  ...AI_PYTHON_WEEK_ALL_QUESTIONS.week2,
];

export function isAiPythonWeek(value: string | undefined): value is AiPythonWeek {
  return value === "week1" || value === "week2";
}

export function getAiPythonWeekCategories(week: AiPythonWeek) {
  return [
    ...new Set(
      AI_PYTHON_WEEK_ALL_QUESTIONS[week].map((question) => question.category),
    ),
  ];
}

export function getAiPythonWeekQuestion(
  week: AiPythonWeek,
  questionId: string,
) {
  return AI_PYTHON_WEEK_ALL_QUESTIONS[week].find(
    (question) => question.id === questionId,
  );
}
