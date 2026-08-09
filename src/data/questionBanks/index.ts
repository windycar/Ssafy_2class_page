import { AI_PYTHON_QUESTION_BANK } from "./aiPythonQuestionBank";
import { ALL_AI_PYTHON_WEEK_QUESTIONS } from "./aiPythonWeekQuestionBank";
import { ALL_PYTHON_QUESTIONS } from "./pythonQuestionBank";
import { ALL_WEB_QUESTIONS } from "./webQuestionBank";

export const QUESTION_BANK_TOTALS = {
  python: ALL_PYTHON_QUESTIONS.length,
  web: ALL_WEB_QUESTIONS.length,
  aiPython: AI_PYTHON_QUESTION_BANK.length,
  aiPythonWeeks: ALL_AI_PYTHON_WEEK_QUESTIONS.length,
} as const;

export const TOTAL_QUESTION_COUNT = Object.values(QUESTION_BANK_TOTALS).reduce(
  (total, count) => total + count,
  0,
);
