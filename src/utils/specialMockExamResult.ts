export const SPECIAL_MOCK_EXAM_PASS_SCORE = 60;

export function calculateSpecialMockExamScore(
  correctCount: number,
  questionCount: number,
) {
  if (questionCount <= 0) return 0;
  return Math.round((correctCount / questionCount) * 100);
}

export function hasPassedSpecialMockExam(score: number) {
  return score >= SPECIAL_MOCK_EXAM_PASS_SCORE;
}
