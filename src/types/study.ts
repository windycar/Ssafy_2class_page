export type StudyDifficulty = "easy" | "medium" | "hard" | "extreme";

export type StudyQuestionType = "multiple-choice" | "short-answer" | "essay";

export type StudyCategory =
  | "operators"
  | "sequences"
  | "control"
  | "functions"
  | "structures"
  | "oop"
  | "exceptions";

export interface PythonQuestion {
  id: string;
  difficulty: StudyDifficulty;
  category: StudyCategory;
  questionType: StudyQuestionType;
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  acceptedAnswers?: string[];
  modelAnswer?: string;
  rubricKeywords?: string[];
  minLength?: number;
  explanation: string;
  hint: string;
}

export interface StudyAttempt {
  id: string;
  questionId: string;
  difficulty: StudyDifficulty;
  category: StudyCategory;
  questionType: StudyQuestionType;
  selectedAnswer: number | null;
  responseText?: string;
  correct: boolean;
  answeredAt: string;
}

export interface StudyProgress {
  attempts: StudyAttempt[];
}
