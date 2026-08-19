import type {
  SpecialMockExamAttempt,
  SpecialMockExamQuestion,
} from "../types/specialMockExam";
import { getLatestAttemptsByQuestion } from "./studyProgressStats.ts";

export const SPECIAL_MOCK_EXAM_PASS_SCORE = 60;

export function calculateSpecialMockExamScore(
  correctCount: number,
  questionCount: number,
) {
  if (questionCount <= 0) return 0;
  return Math.round((correctCount / questionCount) * 100);
}

export function hasPassedSpecialMockExam(score: number) {
  return score >= SPECIAL_MOCK_EXAM_PASS_SCORE;
}

export type SpecialMockExamReviewStatus =
  | "correct"
  | "incorrect"
  | "unanswered";

export function getSpecialMockExamReviewStatus(answer?: {
  response: number | string | null;
  correct?: boolean;
}): SpecialMockExamReviewStatus {
  if (!answer || answer.response === null) return "unanswered";
  return answer.correct === true ? "correct" : "incorrect";
}

export type SpecialMockExamReviewAnswer = {
  response: number | string | null;
  correct: boolean;
};

export function buildSpecialMockExamReviewAnswers(
  questions: readonly SpecialMockExamQuestion[],
  attempts: readonly SpecialMockExamAttempt[],
): Record<string, SpecialMockExamReviewAnswer> {
  const latestAttempts = new Map(
    getLatestAttemptsByQuestion(attempts).map((attempt) => [
      attempt.questionId,
      attempt,
    ]),
  );

  return Object.fromEntries(
    questions.map((question) => {
      const attempt = latestAttempts.get(question.id);
      const response = attempt
        ? attempt.selectedAnswer !== null
          ? attempt.selectedAnswer
          : attempt.responseText?.trim() || null
        : null;

      return [
        question.id,
        {
          response,
          correct: response !== null && attempt?.correct === true,
        },
      ];
    }),
  );
}
