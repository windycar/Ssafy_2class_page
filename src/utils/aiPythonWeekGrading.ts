import { ESSAY_MIN_LENGTH } from "../constants/study";
import type { AiPythonWeekQuestion } from "../types/aiPythonWeekStudy";

export interface AiPythonWeekGradeResult {
  correct: boolean;
  responseLength: number;
  expectedMatched: boolean;
  matchedKeywords: string[];
}

function normalize(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function compact(value: string) {
  return normalize(value).replace(/\s+/g, "").toLowerCase();
}

export function gradeAiPythonWeekResponse(
  question: AiPythonWeekQuestion,
  response: number | string,
): AiPythonWeekGradeResult {
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
  const normalizedResponse = normalize(responseText);
  const acceptedAnswers = question.acceptedAnswers ?? [];

  if (question.questionType === "short-answer") {
    const correct = acceptedAnswers.some(
      (answer) => compact(answer) === compact(normalizedResponse),
    );
    return {
      correct,
      responseLength: normalizedResponse.length,
      expectedMatched: correct,
      matchedKeywords: [],
    };
  }

  const compactResponse = compact(responseText);
  const expectedMatched = acceptedAnswers.some((answer) =>
    compactResponse.includes(compact(answer)),
  );
  const matchedKeywords = (question.rubricKeywords ?? []).filter((keyword) =>
    normalizedResponse.toLowerCase().includes(keyword.toLowerCase()),
  );
  const minimumLength = question.minLength ?? ESSAY_MIN_LENGTH;

  return {
    correct:
      normalizedResponse.length >= minimumLength &&
      expectedMatched &&
      matchedKeywords.length >= 1,
    responseLength: normalizedResponse.length,
    expectedMatched,
    matchedKeywords,
  };
}
