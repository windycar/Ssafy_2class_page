export const SPECIAL_MOCK_EXAM_ASSESSMENT_ROUNDS = [
  2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;

export type SpecialMockExamAssessmentRound =
  (typeof SPECIAL_MOCK_EXAM_ASSESSMENT_ROUNDS)[number];

export const SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS = [2, 3] as const;

export type SpecialMockExamAvailableAssessmentRound =
  (typeof SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS)[number];

export type SpecialMockExamRound = 1 | 2 | 3 | 4 | 5;

export const SPECIAL_MOCK_EXAM_ROUNDS = [1, 2, 3, 4, 5] as const satisfies
  readonly SpecialMockExamRound[];

export const SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT = {
  2: 32,
  3: 60,
} as const satisfies Record<SpecialMockExamAvailableAssessmentRound, number>;

export const SPECIAL_MOCK_EXAM_TOTAL_QUESTION_COUNT =
  SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS.reduce(
    (total, assessmentRound) =>
      total +
      SPECIAL_MOCK_EXAM_ROUNDS.length *
        SPECIAL_MOCK_EXAM_QUESTIONS_PER_ASSESSMENT[assessmentRound],
    0,
  );

export const SPECIAL_MOCK_EXAM_BANK_VERSIONS = {
  2: {
    1: "v3",
    2: "v3",
    3: "v3",
    4: "v3",
    5: "v3",
  },
  3: {
    1: "v1",
    2: "v1",
    3: "v1",
    4: "v1",
    5: "v1",
  },
} as const satisfies Record<
  SpecialMockExamAvailableAssessmentRound,
  Record<SpecialMockExamRound, string>
>;

export function getSpecialMockExamAttemptIdPrefix(
  assessmentRound: SpecialMockExamAvailableAssessmentRound,
  mockRound: SpecialMockExamRound,
) {
  return `special-mock-a${assessmentRound}-r${mockRound}-${SPECIAL_MOCK_EXAM_BANK_VERSIONS[assessmentRound][mockRound]}-`;
}

export type SpecialMockExamDifficulty =
  | "easy"
  | "medium"
  | "hard"
  | "extreme";

export type SpecialMockExamQuestionType =
  | "multiple-choice"
  | "short-answer"
  | "essay";

export interface SpecialMockExamQuestion {
  id: string;
  sourceId: string;
  conceptId: string;
  difficulty: SpecialMockExamDifficulty;
  category: string;
  questionType: SpecialMockExamQuestionType;
  prompt: string;
  code?: string;
  options: string[];
  answer: number | null;
  acceptedAnswers?: string[];
  modelAnswer?: string;
  rubricKeywords?: string[];
  minLength?: number;
  explanation: string;
  hint: string;
}

export interface SpecialMockExamAttempt {
  id: string;
  assessmentRound: SpecialMockExamAvailableAssessmentRound;
  mockRound: SpecialMockExamRound;
  questionId: string;
  difficulty: SpecialMockExamDifficulty;
  category: string;
  questionType: SpecialMockExamQuestionType;
  selectedAnswer: number | null;
  responseText?: string;
  correct: boolean;
  answeredAt: string;
}

export interface SpecialMockExamProgress {
  attempts: SpecialMockExamAttempt[];
}

export function isCurrentSpecialMockExamAttempt(
  attempt: Pick<
    SpecialMockExamAttempt,
    "id" | "assessmentRound" | "mockRound"
  >,
) {
  if (
    !SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS.includes(
      attempt.assessmentRound,
    )
  ) {
    return false;
  }
  return attempt.id.startsWith(
    getSpecialMockExamAttemptIdPrefix(
      attempt.assessmentRound,
      attempt.mockRound,
    ),
  );
}

export function isSpecialMockExamAssessmentRound(
  value: string | undefined,
): value is `${SpecialMockExamAvailableAssessmentRound}` {
  return SPECIAL_MOCK_EXAM_AVAILABLE_ASSESSMENT_ROUNDS.some(
    (round) => String(round) === value,
  );
}

export function isSpecialMockExamRound(
  value: string | undefined,
): value is `${SpecialMockExamRound}` {
  return SPECIAL_MOCK_EXAM_ROUNDS.some((round) => String(round) === value);
}
