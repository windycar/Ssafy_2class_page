import type { WebQuestion } from "../types/webStudy";

export const WEB_ESSAY_MIN_LENGTH = 20;

export interface WebStudyGradeResult {
  correct: boolean;
  responseLength: number;
  expectedMatched: boolean;
  matchedKeywords: string[];
}

function normalizeExactAnswer(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function compactForComparison(value: string) {
  return normalizeExactAnswer(value).replace(/\s+/g, "").toLowerCase();
}

export function gradeWebResponse(
  question: WebQuestion,
  response: number | string,
): WebStudyGradeResult {
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
      (answer) => compactForComparison(answer) === compactForComparison(normalizedResponse),
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
    normalizedResponse.toLowerCase().includes(keyword.toLowerCase()),
  );
  const minimumLength = question.minLength ?? WEB_ESSAY_MIN_LENGTH;
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
