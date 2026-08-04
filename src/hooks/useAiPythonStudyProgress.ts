import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { aiPythonStudyProgressStorage } from "../services/storage/aiPythonStudyProgressStorage";
import {
  loadAiPythonStudyProgress,
  saveAiPythonStudyAttempt,
} from "../services/aiPythonStudyProgressService";
import type {
  AiPythonCategory,
  AiPythonQuestion,
  AiPythonStudyAttempt,
} from "../types/aiPythonStudy";
import type { StudySyncState } from "./useStudyProgress";

const EMPTY_CATEGORY_SUMMARY: Record<
  AiPythonCategory,
  { total: number; correct: number }
> = {
  python: { total: 0, correct: 0 },
  api: { total: 0, correct: 0 },
  numpy: { total: 0, correct: 0 },
  pandas: { total: 0, correct: 0 },
  matplotlib_eda: { total: 0, correct: 0 },
};

export function useAiPythonStudyProgress() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 0;
  const [progress, setProgress] = useState(() =>
    aiPythonStudyProgressStorage.get(userId),
  );
  const [syncState, setSyncState] = useState<StudySyncState>("loading");

  useEffect(() => {
    let cancelled = false;
    setProgress(aiPythonStudyProgressStorage.get(userId));

    if (!currentUser) {
      setSyncState("local");
      return () => {
        cancelled = true;
      };
    }

    setSyncState("loading");
    loadAiPythonStudyProgress(currentUser.id)
      .then((loaded) => {
        if (cancelled) return;
        setProgress(loaded);
        setSyncState("synced");
      })
      .catch(() => {
        if (cancelled) return;
        setProgress(aiPythonStudyProgressStorage.get(currentUser.id));
        setSyncState("local");
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser, userId]);

  const recordAnswer = (question: AiPythonQuestion, selectedAnswer: number) => {
    const correct = question.answer === selectedAnswer;
    if (!currentUser) return correct;

    const attempt: AiPythonStudyAttempt = {
      id: `${Date.now()}-${question.id}-${Math.random().toString(36).slice(2, 7)}`,
      questionId: question.id,
      category: question.category,
      selectedAnswer,
      correct,
      answeredAt: new Date().toISOString(),
    };
    setProgress(aiPythonStudyProgressStorage.add(currentUser.id, attempt));
    setSyncState("loading");
    saveAiPythonStudyAttempt(currentUser.id)
      .then((saved) => setSyncState(saved ? "synced" : "local"))
      .catch(() => setSyncState("local"));
    return correct;
  };

  const summary = useMemo(() => {
    let correct = 0;
    const byCategory = Object.fromEntries(
      Object.entries(EMPTY_CATEGORY_SUMMARY).map(([key, value]) => [key, { ...value }]),
    ) as Record<AiPythonCategory, { total: number; correct: number }>;

    progress.attempts.forEach((attempt) => {
      byCategory[attempt.category].total += 1;
      if (attempt.correct) {
        correct += 1;
        byCategory[attempt.category].correct += 1;
      }
    });

    const total = progress.attempts.length;
    return {
      total,
      correct,
      incorrect: total - correct,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
      byCategory,
    };
  }, [progress.attempts]);

  return { progress, summary, recordAnswer, syncState };
}
