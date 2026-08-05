import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { webStudyProgressStorage } from "../services/storage/webStudyProgressStorage";
import {
  loadWebStudyProgress,
  resetWebStudyProgress,
  saveWebStudyAttempt,
} from "../services/webStudyProgressService";
import { gradeWebResponse } from "../utils/webStudyGrading";
import type { WebCategory, WebQuestion, WebStudyAttempt } from "../types/webStudy";
import type { StudySyncState } from "./useStudyProgress";

const EMPTY_CATEGORY_SUMMARY: Record<WebCategory, { total: number; correct: number }> = {
  html: { total: 0, correct: 0 },
  css: { total: 0, correct: 0 },
  bootstrap: { total: 0, correct: 0 },
  semantic: { total: 0, correct: 0 },
  "responsive-grid": { total: 0, correct: 0 },
  "ux-ui": { total: 0, correct: 0 },
};

export function useWebStudyProgress() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 0;
  const [progress, setProgress] = useState(() => webStudyProgressStorage.get(userId));
  const [syncState, setSyncState] = useState<StudySyncState>("loading");
  const resetInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setProgress(webStudyProgressStorage.get(userId));

    if (!currentUser) {
      setSyncState("local");
      return () => {
        cancelled = true;
      };
    }

    setSyncState("loading");
    loadWebStudyProgress(currentUser.id)
      .then((loaded) => {
        if (cancelled) return;
        setProgress(loaded);
        setSyncState("synced");
      })
      .catch(() => {
        if (cancelled) return;
        setProgress(webStudyProgressStorage.get(currentUser.id));
        setSyncState("local");
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser, userId]);

  const recordAnswer = (question: WebQuestion, response: number | string) => {
    const grade = gradeWebResponse(question, response);
    if (!currentUser) return grade.correct;
    const attempt: WebStudyAttempt = {
      id: `${Date.now()}-${question.id}-${Math.random().toString(36).slice(2, 7)}`,
      questionId: question.id,
      difficulty: question.difficulty,
      category: question.category,
      questionType: question.questionType,
      selectedAnswer: typeof response === "number" ? response : null,
      responseText: typeof response === "string" ? response : undefined,
      correct: grade.correct,
      answeredAt: new Date().toISOString(),
    };
    setProgress(webStudyProgressStorage.add(currentUser.id, attempt));
    setSyncState("loading");
    saveWebStudyAttempt(currentUser.id)
      .then((saved) => setSyncState(saved ? "synced" : "local"))
      .catch(() => setSyncState("local"));
    return grade.correct;
  };

  const resetProgress = async (
    difficulty: WebQuestion["difficulty"],
    categories: WebCategory[],
  ) => {
    if (!currentUser || !categories.length || syncState === "loading" || resetInFlight.current) {
      return false;
    }

    const hasMatchingAttempt = progress.attempts.some(
      (attempt) =>
        attempt.difficulty === difficulty && categories.includes(attempt.category),
    );
    if (!hasMatchingAttempt) return true;

    const previousSyncState = syncState;
    resetInFlight.current = true;
    setSyncState("loading");
    try {
      const result = await resetWebStudyProgress(currentUser.id, difficulty, categories);
      setProgress(result.progress);
      setSyncState(result.synced ? "synced" : "local");
      return true;
    } catch {
      setSyncState(previousSyncState);
      return false;
    } finally {
      resetInFlight.current = false;
    }
  };

  const summary = useMemo(() => {
    const total = progress.attempts.length;
    const correct = progress.attempts.filter((attempt) => attempt.correct).length;
    const byCategory = progress.attempts.reduce<
      Record<WebCategory, { total: number; correct: number }>
    >(
      (acc, attempt) => {
        acc[attempt.category].total += 1;
        if (attempt.correct) acc[attempt.category].correct += 1;
        return acc;
      },
      Object.fromEntries(
        Object.entries(EMPTY_CATEGORY_SUMMARY).map(([key, value]) => [key, { ...value }]),
      ) as Record<WebCategory, { total: number; correct: number }>,
    );

    return {
      total,
      correct,
      incorrect: total - correct,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
      byCategory,
      recent: [...progress.attempts].reverse().slice(0, 8),
    };
  }, [progress]);

  return { progress, summary, recordAnswer, resetProgress, syncState };
}
