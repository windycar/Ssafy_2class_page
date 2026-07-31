import type { PythonQuestion } from "../types/study";
import { ESSAY_MIN_LENGTH } from "../constants/study";

export interface StudyGradeResult {
  correct: boolean;
  responseLength: number;
  expectedMatched: boolean;
  matchedKeywords: string[];
}

function normalizeExactAnswer(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function compactForComparison(value: string) {
  return normalizeExactAnswer(value).replace(/\s+/g, "");
}

export function gradePythonResponse(
  question: PythonQuestion,
  response: number | string,
): StudyGradeResult {
  if (question.questionType === "multiple-choice") {
    const correct = typeof response === "number" && response === question.answer;
    return {
      correct,
      responseLength: 0,
      expectedMatched: correct,
      matchedKeywords: [],
    };
  }

  const responseText = typeof response === "string" ? response : "";
  const normalizedResponse = normalizeExactAnswer(responseText);
  const acceptedAnswers = question.acceptedAnswers ?? [];

  if (question.questionType === "short-answer") {
    const correct = acceptedAnswers.some(
      (answer) => normalizeExactAnswer(answer) === normalizedResponse,
    );
    return {
      correct,
      responseLength: normalizedResponse.length,
      expectedMatched: correct,
      matchedKeywords: [],
    };
  }

  const compactResponse = compactForComparison(responseText);
  const expectedMatched = acceptedAnswers.some((answer) =>
    compactResponse.includes(compactForComparison(answer)),
  );
  const matchedKeywords = (question.rubricKeywords ?? []).filter((keyword) =>
    normalizedResponse.includes(keyword),
  );
  const minimumLength = question.minLength ?? ESSAY_MIN_LENGTH;
  const correct =
    normalizedResponse.length >= minimumLength &&
    expectedMatched &&
    matchedKeywords.length >= 1;

  return {
    correct,
    responseLength: normalizedResponse.length,
    expectedMatched,
    matchedKeywords,
  };
}
