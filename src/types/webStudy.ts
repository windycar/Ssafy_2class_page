import type { StudyQuestionType } from "./study";

export type WebDifficulty = "easy" | "medium" | "hard";

export type WebCategory =
  | "html"
  | "css"
  | "bootstrap"
  | "semantic"
  | "responsive-grid"
  | "ux-ui";

export interface WebQuestion {
  id: string;
  conceptId: string;
  difficulty: WebDifficulty;
  category: WebCategory;
  questionType: StudyQuestionType;
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

export interface WebStudyAttempt {
  id: string;
  questionId: string;
  difficulty: WebDifficulty;
  category: WebCategory;
  questionType: StudyQuestionType;
  selectedAnswer: number | null;
  responseText?: string;
  correct: boolean;
  answeredAt: string;
}

export interface WebStudyProgress {
  attempts: WebStudyAttempt[];
}
