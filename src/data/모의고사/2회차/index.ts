import { ALL_QUESTIONS as ROUND_1_SOURCE } from "./과목평가2회차_모의고사_1회차.ts";
import { ALL_QUESTIONS as ROUND_2_SOURCE } from "./과목평가2회차_모의고사_2회차.ts";
import { ALL_QUESTIONS as ROUND_3_SOURCE } from "./과목평가2회차_모의고사_3회차.ts";
import { ALL_QUESTIONS as ROUND_4_SOURCE } from "./과목평가2회차_모의고사_4회차.ts";
import { ALL_QUESTIONS as ROUND_5_SOURCE } from "./과목평가2회차_모의고사_5회차.ts";
import type {
  SpecialMockExamQuestion,
  SpecialMockExamRound,
} from "../../../types/specialMockExam";

type SourceQuestion = Omit<SpecialMockExamQuestion, "id" | "sourceId"> & {
  id: string;
};

function scopeQuestionIds(
  round: SpecialMockExamRound,
  questions: readonly SourceQuestion[],
): SpecialMockExamQuestion[] {
  return questions.map((question) => ({
    ...question,
    id: `assessment-2-round-${round}-${question.id}`,
    sourceId: question.id,
  }));
}

export const SPECIAL_MOCK_EXAM_BANKS = {
  1: scopeQuestionIds(1, ROUND_1_SOURCE),
  2: scopeQuestionIds(2, ROUND_2_SOURCE),
  3: scopeQuestionIds(3, ROUND_3_SOURCE),
  4: scopeQuestionIds(4, ROUND_4_SOURCE),
  5: scopeQuestionIds(5, ROUND_5_SOURCE),
} as const satisfies Record<SpecialMockExamRound, SpecialMockExamQuestion[]>;

export const SPECIAL_MOCK_EXAM_META = {
  1: { label: "모의고사 1회차", description: "이미지·멀티모달 핵심 키워드 쉬운 점검" },
  2: { label: "모의고사 2회차", description: "비전·NLP·생성 모델 키워드 쉬운 점검" },
  3: { label: "모의고사 3회차", description: "트랜스포머·생성·평가 키워드 쉬운 점검" },
  4: { label: "모의고사 4회차", description: "LLM·VLM·멀티모달 키워드 쉬운 점검" },
  5: { label: "모의고사 5회차", description: "딥러닝·정렬·파인튜닝 키워드 쉬운 점검" },
} as const satisfies Record<
  SpecialMockExamRound,
  { label: string; description: string }
>;

export function getSpecialMockExamQuestion(
  round: SpecialMockExamRound,
  questionId: string,
) {
  return SPECIAL_MOCK_EXAM_BANKS[round].find(
    (question) => question.id === questionId,
  );
}
