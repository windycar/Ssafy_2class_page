import { useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { studyProgressStorage } from "../services/storage/studyProgressStorage";
import type { PythonQuestion, StudyAttempt, StudyCategory } from "../types/study";

export function useStudyProgress() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 0;
  const [progress, setProgress] = useState(() => studyProgressStorage.get(userId));

  const recordAnswer = (question: PythonQuestion, selectedAnswer: number) => {
    if (!currentUser) return;
    const attempt: StudyAttempt = {
      id: `${Date.now()}-${question.id}-${Math.random().toString(36).slice(2, 7)}`,
      questionId: question.id,
      difficulty: question.difficulty,
      category: question.category,
      selectedAnswer,
      correct: selectedAnswer === question.answer,
      answeredAt: new Date().toISOString(),
    };
    setProgress(studyProgressStorage.add(currentUser.id, attempt));
  };

  const summary = useMemo(() => {
    const total = progress.attempts.length;
    const correct = progress.attempts.filter((attempt) => attempt.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const byCategory = progress.attempts.reduce<Record<StudyCategory, { total: number; correct: number }>>(
      (acc, attempt) => {
        acc[attempt.category].total += 1;
        if (attempt.correct) acc[attempt.category].correct += 1;
        return acc;
      },
      {
        operators: { total: 0, correct: 0 },
        sequences: { total: 0, correct: 0 },
        control: { total: 0, correct: 0 },
        functions: { total: 0, correct: 0 },
        structures: { total: 0, correct: 0 },
        oop: { total: 0, correct: 0 },
        exceptions: { total: 0, correct: 0 },
      },
    );

    return {
      total,
      correct,
      incorrect: total - correct,
      accuracy,
      byCategory,
      recent: [...progress.attempts].reverse().slice(0, 8),
    };
  }, [progress]);

  return { progress, summary, recordAnswer };
}

