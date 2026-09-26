import { ALL_QUESTIONS as ROUND_1_SOURCE } from "./과목평가5회차_모의고사_1회차.ts";
import { ALL_QUESTIONS as ROUND_2_SOURCE } from "./과목평가5회차_모의고사_2회차.ts";
import { ALL_QUESTIONS as ROUND_3_SOURCE } from "./과목평가5회차_모의고사_3회차.ts";
import { ALL_QUESTIONS as ROUND_4_SOURCE } from "./과목평가5회차_모의고사_4회차.ts";
import { ALL_QUESTIONS as ROUND_5_SOURCE } from "./과목평가5회차_모의고사_5회차.ts";
import { ALL_QUESTIONS as ROUND_6_SOURCE } from "./과목평가5회차_모의고사_6회차.ts";
import type {
  SpecialMockExamQuestion,
  SpecialMockExamRound,
} from "../../../types/specialMockExam.ts";

type SourceQuestion = Omit<SpecialMockExamQuestion, "id" | "sourceId" | "hint"> & {
  id: string;
  hint?: string;
};

function scopeQuestionIds(
  round: SpecialMockExamRound,
  questions: readonly SourceQuestion[],
): SpecialMockExamQuestion[] {
  return questions.map((question) => ({
    ...question,
    id: `assessment-5-round-${round}-${question.id}`,
    sourceId: question.id,
    hint: question.hint ?? "문제의 핵심 개념을 다시 확인해 보세요.",
    explanation: question.explanation.replace(/\[cite:\s*\d+\]/g, ""),
  }));
}

export const SPECIAL_MOCK_EXAM_BANKS = {
  1: scopeQuestionIds(1, ROUND_1_SOURCE),
  2: scopeQuestionIds(2, ROUND_2_SOURCE),
  3: scopeQuestionIds(3, ROUND_3_SOURCE),
  4: scopeQuestionIds(4, ROUND_4_SOURCE),
  5: scopeQuestionIds(5, ROUND_5_SOURCE),
  6: scopeQuestionIds(6, ROUND_6_SOURCE),
} as const satisfies Record<SpecialMockExamRound, SpecialMockExamQuestion[]>;

export const SPECIAL_MOCK_EXAM_META = {
  1: { label: "모의고사 1회차", description: "Web 레이아웃·박스 모델·선택자 기본 점검" },
  2: { label: "모의고사 2회차", description: "HTML·CSS·Flexbox·Bootstrap 응용 점검" },
  3: { label: "모의고사 3회차", description: "Web 과목평가 전체 토픽 실전 점검" },
  4: { label: "모의고사 4회차", description: "반응형 Grid·시맨틱 태그·CSS 종합 점검" },
  5: { label: "모의고사 5회차", description: "Web 전 범위 최종 개념 점검" },
  6: { label: "모의고사 6회차", description: "Web 레이아웃·HTML·CSS 기초 개념 실전 점검" },
} as const satisfies Record<
  SpecialMockExamRound,
  { label: string; description: string }
>;
