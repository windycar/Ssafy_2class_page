import {
  SPECIAL_MOCK_EXAM_BANKS as ASSESSMENT_2_BANKS,
  SPECIAL_MOCK_EXAM_META as ASSESSMENT_2_META,
} from "./2회차/index.ts";
import {
  SPECIAL_MOCK_EXAM_BANKS as ASSESSMENT_3_BANKS,
  SPECIAL_MOCK_EXAM_META as ASSESSMENT_3_META,
} from "./3회차/index.ts";
import {
  SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT,
  SPECIAL_MOCK_EXAM_ROUNDS,
  type SpecialMockExamAvailableAssessmentRound,
  type SpecialMockExamRound,
} from "../../types/specialMockExam.ts";

export const SPECIAL_MOCK_EXAM_COLLECTIONS = {
  2: {
    banks: ASSESSMENT_2_BANKS,
    meta: ASSESSMENT_2_META,
    questionsPerRound: SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[2],
    totalQuestionCount:
      SPECIAL_MOCK_EXAM_ROUNDS.length *
      SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[2],
  },
  3: {
    banks: ASSESSMENT_3_BANKS,
    meta: ASSESSMENT_3_META,
    questionsPerRound: SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[3],
    totalQuestionCount:
      SPECIAL_MOCK_EXAM_ROUNDS.length *
      SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[3],
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
  return SPECIAL_MOCK_EXAM_COLLECTIONS[assessmentRound].banks[mockRound].find(
    (question) => question.id === questionId,
  );
}
