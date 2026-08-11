type AnsweredAttempt = {
  questionId: string;
  correct: boolean;
};

export function getLatestAttemptsByQuestion<T extends AnsweredAttempt>(
  attempts: readonly T[],
): T[] {
  const latest = new Map<string, T>();
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    const attempt = attempts[index];
    if (!latest.has(attempt.questionId)) latest.set(attempt.questionId, attempt);
  }
  return [...latest.values()];
}

export function countUnresolvedMistakes<T extends AnsweredAttempt>(
  attempts: readonly T[],
) {
  return getLatestAttemptsByQuestion(attempts).filter(
    (attempt) => !attempt.correct,
  ).length;
}
