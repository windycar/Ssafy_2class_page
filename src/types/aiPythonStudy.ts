export type AiPythonCategory =
  | "python"
  | "api"
  | "numpy"
  | "pandas"
  | "matplotlib_eda";

export interface AiPythonQuestion {
  id: string;
  category: AiPythonCategory;
  questionType: "multiple-choice";
  prompt: string;
  code?: string;
  options: [string, string, string, string];
  answer: number;
  explanation: string;
  hint: string;
}

export interface AiPythonStudyAttempt {
  id: string;
  questionId: string;
  category: AiPythonCategory;
  selectedAnswer: number;
  correct: boolean;
  answeredAt: string;
}

export interface AiPythonStudyProgress {
  attempts: AiPythonStudyAttempt[];
}
