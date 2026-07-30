export type StudyDifficulty = "easy" | "medium" | "hard";

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
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
}

export interface StudyAttempt {
  id: string;
  questionId: string;
  difficulty: StudyDifficulty;
  category: StudyCategory;
  selectedAnswer: number;
  correct: boolean;
  answeredAt: string;
}

export interface StudyProgress {
  attempts: StudyAttempt[];
}

