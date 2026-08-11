import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { studyProgressStorage } from "../services/storage/studyProgressStorage";
import {
  loadStudyProgress,
  resetStudyProgress,
  saveStudyAttempt,
} from "../services/studyProgressService";
import { subscribeToStudyProgressRefresh } from "../utils/studyProgressSync";
import { gradePythonResponse } from "../utils/studyGrading";
import type { PythonQuestion, StudyAttempt, StudyCategory } from "../types/study";

export type StudySyncState = "loading" | "synced" | "local";

export function useStudyProgress() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 0;
  const [progress, setProgress] = useState(() => studyProgressStorage.get(userId));
  const [syncState, setSyncState] = useState<StudySyncState>("loading");
  const resetInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let refreshInFlight = false;
    setProgress(studyProgressStorage.get(userId));

    if (!currentUser) {
      setSyncState("local");
      return () => {
        cancelled = true;
      };
    }

    const activeUserId = currentUser.id;
    const refresh = async (showLoading = false) => {
      if (refreshInFlight) return;
      refreshInFlight = true;
      if (showLoading) setSyncState("loading");
      try {
        const loaded = await loadStudyProgress(activeUserId);
        if (cancelled) return;
        setProgress(loaded);
        setSyncState("synced");
      } catch {
        if (cancelled) return;
        setProgress(studyProgressStorage.get(activeUserId));
        setSyncState("local");
      } finally {
        refreshInFlight = false;
      }
    };

    void refresh(true);
    const unsubscribe = subscribeToStudyProgressRefresh(
      "ssafy-gwangju-2-study-",
      () => void refresh(),
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentUser, userId]);

  const recordAnswer = (
    question: PythonQuestion,
    response: number | string,
  ) => {
    const grade = gradePythonResponse(question, response);
    if (!currentUser) return grade.correct;
    const attempt: StudyAttempt = {
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
    setProgress(studyProgressStorage.add(currentUser.id, attempt));
    setSyncState("loading");
    saveStudyAttempt(currentUser.id)
      .then((saved) => setSyncState(saved ? "synced" : "local"))
      .catch(() => setSyncState("local"));
    return grade.correct;
  };

  const resetProgress = async (
    difficulty: PythonQuestion["difficulty"],
    categories: StudyCategory[],
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
      const result = await resetStudyProgress(currentUser.id, difficulty, categories);
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

  return { progress, summary, recordAnswer, resetProgress, syncState };
}
