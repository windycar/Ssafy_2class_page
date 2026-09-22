import { ESSAY_MIN_LENGTH } from "../constants/study.ts";
import type {
  SpecialMockExamAttempt,
  SpecialMockExamQuestion,
} from "../types/specialMockExam";

export interface SpecialMockExamGradeResult {
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

function matchesRubricKeyword(response: string, keyword: string) {
  const alternatives = keyword.match(/^(.*?)\s*\(또는\s+(.+)\)$/);
  const terms = alternatives
    ? [alternatives[1], ...alternatives[2].split("/")]
    : [keyword];
  return terms.some((term) => {
    if (term === "일관성" && response.includes("일관")) return true;
    return term.split(/\s+/).every((word) => response.includes(compact(word)));
  });
}

export function hasSpecialMockExamResponse(
  response: number | string | null | undefined,
) {
  return (
    typeof response === "number" ||
    (typeof response === "string" && response.trim().length > 0)
  );
}

export function isAnsweredSpecialMockExamAttempt(
  attempt: Pick<SpecialMockExamAttempt, "selectedAnswer" | "responseText">,
) {
  return (
    typeof attempt.selectedAnswer === "number" ||
    hasSpecialMockExamResponse(attempt.responseText)
  );
}

export function gradeSpecialMockExamResponse(
  question: SpecialMockExamQuestion,
  response: number | string | null,
): SpecialMockExamGradeResult {
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
  const rubricKeywords = question.rubricKeywords ?? [];
  const matchedKeywords = rubricKeywords.filter((keyword) =>
    matchesRubricKeyword(compactResponse, keyword),
  );
  const essayExpectedMatched = acceptedAnswers.length
    ? expectedMatched
    : rubricKeywords.length > 0 && matchedKeywords.length === rubricKeywords.length;
  const minimumLength = question.minLength ?? ESSAY_MIN_LENGTH;

  return {
    correct:
      normalizedResponse.length >= minimumLength &&
      essayExpectedMatched &&
      matchedKeywords.length >= 1,
    responseLength: normalizedResponse.length,
    expectedMatched: essayExpectedMatched,
    matchedKeywords,
  };
}
