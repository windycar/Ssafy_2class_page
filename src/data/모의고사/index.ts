import {
  SPECIAL_MOCK_EXAM_BANKS as ASSESSMENT_2_BANKS,
  SPECIAL_MOCK_EXAM_META as ASSESSMENT_2_META,
} from "./2회차/index.ts";
import {
  SPECIAL_MOCK_EXAM_BANKS as ASSESSMENT_3_BANKS,
  SPECIAL_MOCK_EXAM_META as ASSESSMENT_3_META,
} from "./3회차/index.ts";
import {
  SPECIAL_MOCK_EXAM_BANKS as ASSESSMENT_5_BANKS,
  SPECIAL_MOCK_EXAM_META as ASSESSMENT_5_META,
} from "./5회차/index.ts";
import {
  SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT,
  SPECIAL_MOCK_EXAM_ROUNDS,
  SPECIAL_MOCK_EXAM_ROUNDS_BY_ASSESSMENT,
  type SpecialMockExamAvailableAssessmentRound,
  type SpecialMockExamRound,
  type SpecialMockExamQuestion,
} from "../../types/specialMockExam.ts";

export const SPECIAL_MOCK_EXAM_COLLECTIONS = {
  2: {
    rounds: SPECIAL_MOCK_EXAM_ROUNDS_BY_ASSESSMENT[2],
    banks: ASSESSMENT_2_BANKS,
    meta: ASSESSMENT_2_META,
    questionsPerRound: SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[2],
    totalQuestionCount:
      SPECIAL_MOCK_EXAM_ROUNDS.length *
      SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[2],
  },
  3: {
    rounds: SPECIAL_MOCK_EXAM_ROUNDS_BY_ASSESSMENT[3],
    banks: ASSESSMENT_3_BANKS,
    meta: ASSESSMENT_3_META,
    questionsPerRound: SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[3],
    totalQuestionCount:
      SPECIAL_MOCK_EXAM_ROUNDS.length *
      SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[3],
  },
  5: {
    rounds: SPECIAL_MOCK_EXAM_ROUNDS_BY_ASSESSMENT[5],
    banks: ASSESSMENT_5_BANKS,
    meta: ASSESSMENT_5_META,
    questionsPerRound: SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[5],
    totalQuestionCount:
      SPECIAL_MOCK_EXAM_ROUNDS_BY_ASSESSMENT[5].length *
      SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[5],
  },
} as const;

export function getSpecialMockExamCollection(
  assessmentRound: SpecialMockExamAvailableAssessmentRound,
) {
  return SPECIAL_MOCK_EXAM_COLLECTIONS[assessmentRound];
}

export function getSpecialMockExamQuestion(
  assessmentRound: SpecialMockExamAvailableAssessmentRound,
  mockRound: SpecialMockExamRound,
  questionId: string,
) {
  const banks = SPECIAL_MOCK_EXAM_COLLECTIONS[assessmentRound].banks as Partial<
    Record<SpecialMockExamRound, SpecialMockExamQuestion[]>
  >;
  return banks[mockRound]?.find(
    (question) => question.id === questionId,
  );
}
