export type JavascriptCategory =
  | "set1"
  | "set2"
  | "set3"
  | "set4"
  | "set5"
  | "set6";

export interface JavascriptQuestion {
  id: string;
  conceptId: string;
  difficulty: "easy" | "medium" | "hard";
  sourceCategory: string;
  category: JavascriptCategory;
  questionType: "multiple-choice" | "short-answer";
  prompt: string;
  code?: string;
  options: string[];
  answer: number | null;
  acceptedAnswers?: string[];
  explanation: string;
  hint: string;
}

export interface JavascriptStudyAttempt {
  id: string;
  questionId: string;
  category: JavascriptCategory;
  selectedAnswer: number | null;
  responseText?: string;
  correct: boolean;
  answeredAt: string;
}

export interface JavascriptStudyProgress {
  attempts: JavascriptStudyAttempt[];
}
