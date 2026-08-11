export type AiPythonWeek = "week1" | "week2";

export const AI_PYTHON_WEEK_BANK_VERSIONS = {
  week1: "v5",
  week2: "v8",
} as const satisfies Record<AiPythonWeek, string>;

export const AI_PYTHON_WEEK_ATTEMPT_ID_PREFIXES = {
  week1: `ai-python-week-${AI_PYTHON_WEEK_BANK_VERSIONS.week1}-`,
  week2: `ai-python-week-${AI_PYTHON_WEEK_BANK_VERSIONS.week2}-`,
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
