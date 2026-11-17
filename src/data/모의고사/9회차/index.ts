import { ALL_QUESTIONS as ROUND_1_SOURCE } from "./과목평가9회차_모의고사_1회차.ts";
import { ALL_QUESTIONS as ROUND_2_SOURCE } from "./과목평가9회차_모의고사_2회차.ts";
import { ALL_QUESTIONS as ROUND_3_SOURCE } from "./과목평가9회차_모의고사_3회차.ts";
import { ALL_QUESTIONS as ROUND_4_SOURCE } from "./과목평가9회차_모의고사_4회차.ts";
import { ALL_QUESTIONS as ROUND_5_SOURCE } from "./과목평가9회차_모의고사_5회차.ts";
import type { SpecialMockExamQuestion, SpecialMockExamRound } from "../../../types/specialMockExam.ts";

function scopeQuestionIds(
  round: SpecialMockExamRound,
  questions: readonly Omit<SpecialMockExamQuestion, "sourceId">[],
): SpecialMockExamQuestion[] {
  return questions.map((question) => ({
    ...question,
    id: `assessment-9-round-${round}-${question.id}`,
    sourceId: question.id,
  }));
}

export const SPECIAL_MOCK_EXAM_BANKS = {
  1: scopeQuestionIds(1, ROUND_1_SOURCE),
  2: scopeQuestionIds(2, ROUND_2_SOURCE),
  3: scopeQuestionIds(3, ROUND_3_SOURCE),
  4: scopeQuestionIds(4, ROUND_4_SOURCE),
  5: scopeQuestionIds(5, ROUND_5_SOURCE),
} as const;

export const SPECIAL_MOCK_EXAM_META = {
  1: { label: "모의고사 1회차", description: "JavaScript 기초 · 기본 문법, DOM, 이벤트" },
  2: { label: "모의고사 2회차", description: "JavaScript 중급 · 기본 문법, DOM, 이벤트" },
  3: { label: "모의고사 3회차", description: "JavaScript 심화 · 기본 문법, DOM, 이벤트" },
  4: { label: "모의고사 4회차", description: "JavaScript 실전 · DOM 조작, 기본 문법, 폼 이벤트" },
  5: { label: "모의고사 5회차", description: "JavaScript 실전 · DOM 탐색, 기본 문법, 이벤트 전파" },
} as const;
