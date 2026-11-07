import { ALL_QUESTIONS as ROUND_1_SOURCE } from "./과목평가8회차_모의고사_1회차.ts";
import { ALL_QUESTIONS as ROUND_2_SOURCE } from "./과목평가8회차_모의고사_2회차.ts";
import { ALL_QUESTIONS as ROUND_3_SOURCE } from "./과목평가8회차_모의고사_3회차.ts";
import { ALL_QUESTIONS as ROUND_4_SOURCE } from "./과목평가8회차_모의고사_4회차.ts";
import { ALL_QUESTIONS as ROUND_5_SOURCE } from "./과목평가8회차_모의고사_5회차.ts";
import { ALL_QUESTIONS as ROUND_6_SOURCE } from "./과목평가8회차_모의고사_6회차.ts";
import type { SpecialMockExamQuestion, SpecialMockExamRound } from "../../../types/specialMockExam.ts";

type SourceQuestion = Omit<SpecialMockExamQuestion, "sourceId" | "hint"> & { hint?: string };

function scopeQuestionIds(round: SpecialMockExamRound, questions: readonly SourceQuestion[]): SpecialMockExamQuestion[] {
  return questions.map((question) => ({
    ...question,
    id: `assessment-8-round-${round}-${question.id}`,
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
  6: scopeQuestionIds(6, ROUND_6_SOURCE),
} as const;

export const SPECIAL_MOCK_EXAM_META = {
  1: { label: "모의고사 1회차", description: "Django 전 범위 · 요청 흐름과 인증 코드 점검" },
  2: { label: "모의고사 2회차", description: "Model·Form·CRUD 처리 흐름 점검" },
  3: { label: "모의고사 3회차", description: "ORM·템플릿·ModelForm 수정 기능 점검" },
  4: { label: "모의고사 4회차", description: "URL·파일 업로드·회원 기능 점검" },
  5: { label: "모의고사 5회차", description: "Django 종합 · 사용자 모델과 권한 점검" },
  6: { label: "모의고사 6회차", description: "Django 최종 점검 · 코드 실행과 업로드 수정" },
} as const;
