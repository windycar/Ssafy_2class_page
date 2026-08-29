import { ALL_QUESTIONS as ROUND_1_SOURCE } from "./과목평가3회차_모의고사_1회차.ts";
import { ALL_QUESTIONS as ROUND_2_SOURCE } from "./과목평가3회차_모의고사_2회차.ts";
import { ALL_QUESTIONS as ROUND_3_SOURCE } from "./과목평가3회차_모의고사_3회차.ts";
import { ALL_QUESTIONS as ROUND_4_SOURCE } from "./과목평가3회차_모의고사_4회차.ts";
import { ALL_QUESTIONS as ROUND_5_SOURCE } from "./과목평가3회차_모의고사_5회차.ts";
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
    id: `assessment-3-round-${round}-${question.id}`,
    sourceId: question.id,
    hint: question.hint ?? "문제의 핵심 개념을 다시 확인해 보세요.",
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
  1: { label: "모의고사 1회차", description: "머신러닝·통계·딥러닝 핵심 개념 종합 점검" },
  2: { label: "모의고사 2회차", description: "모델 평가·비전·NLP 핵심 개념 종합 점검" },
  3: { label: "모의고사 3회차", description: "생성형 AI·최적화·멀티모달 종합 점검" },
  4: { label: "모의고사 4회차", description: "LLM·에이전트·모델 경량화 종합 점검" },
  5: { label: "모의고사 5회차", description: "AI 전 범위 실전 개념 최종 점검" },
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
