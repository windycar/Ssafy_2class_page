export type AiPythonWeek =
  | "week1"
  | "week2"
  | "week3-1"
  | "week3-2"
  | "week4-1";

export const AI_PYTHON_WEEK_BANK_VERSIONS = {
  week1: "v6",
  week2: "v8",
  "week3-1": "v1",
  "week3-2": "v1",
  "week4-1": "v1",
} as const satisfies Record<AiPythonWeek, string>;

export const AI_PYTHON_WEEK_ATTEMPT_ID_PREFIXES = {
  week1: `ai-python-week-${AI_PYTHON_WEEK_BANK_VERSIONS.week1}-`,
  week2: `ai-python-week-${AI_PYTHON_WEEK_BANK_VERSIONS.week2}-`,
  "week3-1": `ai-python-week3-1-${AI_PYTHON_WEEK_BANK_VERSIONS["week3-1"]}-`,
  "week3-2": `ai-python-week3-2-${AI_PYTHON_WEEK_BANK_VERSIONS["week3-2"]}-`,
  "week4-1": `ai-python-week4-1-${AI_PYTHON_WEEK_BANK_VERSIONS["week4-1"]}-`,
} as const satisfies Record<AiPythonWeek, string>;

export function getAiPythonWeekAttemptIdPrefix(week: AiPythonWeek) {
  return AI_PYTHON_WEEK_ATTEMPT_ID_PREFIXES[week];
}

export function isCurrentAiPythonWeekAttempt(
  attempt: Pick<AiPythonWeekAttempt, "id" | "week">,
) {
  return attempt.id.startsWith(getAiPythonWeekAttemptIdPrefix(attempt.week));
}

export type AiPythonWeekDifficulty = "easy" | "medium" | "hard";

export type AiPythonWeekQuestionType =
  | "multiple-choice"
  | "short-answer"
  | "essay";

export interface AiPythonWeekQuestion {
  id: string;
  conceptId: string;
  difficulty: AiPythonWeekDifficulty;
  category: string;
  questionType: AiPythonWeekQuestionType;
  prompt: string;
  code?: string;
  options: string[];
  answer: number | null;
  acceptedAnswers?: string[];
  modelAnswer?: string;
  rubricKeywords?: string[];
  minLength?: number;
  explanation: string;
  hint: string;
}

export interface AiPythonWeekAttempt {
  id: string;
  week: AiPythonWeek;
  questionId: string;
  difficulty: AiPythonWeekDifficulty;
  category: string;
  questionType: AiPythonWeekQuestionType;
  selectedAnswer: number | null;
  responseText?: string;
  correct: boolean;
  answeredAt: string;
}

export interface AiPythonWeekProgress {
  attempts: AiPythonWeekAttempt[];
}
