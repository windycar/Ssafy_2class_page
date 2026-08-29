export type AttemptQuestionRow = {
  student_id: number;
  question_id: string;
};

export function buildSpecialMockExamAttemptFilter<
  AssessmentRound extends number,
  MockRound extends number,
>(
  assessmentRounds: readonly AssessmentRound[],
  mockRounds: readonly MockRound[],
  getAttemptIdPrefix: (
    assessmentRound: AssessmentRound,
    mockRound: MockRound,
  ) => string,
) {
  return assessmentRounds
    .flatMap((assessmentRound) =>
      mockRounds.map(
        (mockRound) =>
          `and(assessment_round.eq.${assessmentRound},mock_round.eq.${mockRound},id.like.${getAttemptIdPrefix(assessmentRound, mockRound)}%)`,
      ),
    )
    .join(",");
}

export function countUniqueSolvedQuestions(
  rowsByTable: AttemptQuestionRow[][],
) {
  const totals = new Map<number, number>();

  rowsByTable.forEach((rows) => {
    const uniqueByStudent = new Map<number, Set<string>>();
    rows.forEach((row) => {
      const questions = uniqueByStudent.get(row.student_id) ?? new Set<string>();
      questions.add(row.question_id);
      uniqueByStudent.set(row.student_id, questions);
    });
    uniqueByStudent.forEach((questions, studentId) => {
      totals.set(studentId, (totals.get(studentId) ?? 0) + questions.size);
    });
  });

  return totals;
}
