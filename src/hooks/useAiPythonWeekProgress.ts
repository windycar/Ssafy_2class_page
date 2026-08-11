import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import {
  loadAiPythonWeekProgress,
  resetAiPythonWeekProgress,
  saveAiPythonWeekAttempt,
} from "../services/aiPythonWeekProgressService";
import { aiPythonWeekProgressStorage } from "../services/storage/aiPythonWeekProgressStorage";
import { gradeAiPythonWeekResponse } from "../utils/aiPythonWeekGrading";
import { subscribeToStudyProgressRefresh } from "../utils/studyProgressSync";
import type {
  AiPythonWeek,
  AiPythonWeekAttempt,
  AiPythonWeekDifficulty,
  AiPythonWeekQuestion,
} from "../types/aiPythonWeekStudy";
import { AI_PYTHON_WEEK_ATTEMPT_ID_PREFIX } from "../types/aiPythonWeekStudy";
import type { StudySyncState } from "./useStudyProgress";

export function useAiPythonWeekProgress() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 0;
  const [progress, setProgress] = useState(() =>
    aiPythonWeekProgressStorage.get(userId),
  );
  const [syncState, setSyncState] = useState<StudySyncState>("loading");
  const resetInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let refreshInFlight = false;
    setProgress(aiPythonWeekProgressStorage.get(userId));

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
        const loaded = await loadAiPythonWeekProgress(activeUserId);
        if (cancelled) return;
        setProgress(loaded);
        setSyncState("synced");
      } catch {
        if (cancelled) return;
        setProgress(aiPythonWeekProgressStorage.get(activeUserId));
        setSyncState("local");
      } finally {
        refreshInFlight = false;
      }
    };

    void refresh(true);
    const unsubscribe = subscribeToStudyProgressRefresh(
      "ssafy-gwangju-2-ai-python-week-",
      () => void refresh(),
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentUser, userId]);

  const recordAnswer = (
    week: AiPythonWeek,
    question: AiPythonWeekQuestion,
    response: number | string,
  ) => {
    const grade = gradeAiPythonWeekResponse(question, response);
    if (!currentUser) return grade.correct;

    const attempt: AiPythonWeekAttempt = {
      id: `${AI_PYTHON_WEEK_ATTEMPT_ID_PREFIX}${Date.now()}-${question.id}-${Math.random().toString(36).slice(2, 7)}`,
      week,
      questionId: question.id,
      difficulty: question.difficulty,
      category: question.category,
      questionType: question.questionType,
      selectedAnswer: typeof response === "number" ? response : null,
      responseText: typeof response === "string" ? response : undefined,
      correct: grade.correct,
      answeredAt: new Date().toISOString(),
    };
    setProgress(aiPythonWeekProgressStorage.add(currentUser.id, attempt));
    setSyncState("loading");
    saveAiPythonWeekAttempt(currentUser.id)
      .then((saved) => setSyncState(saved ? "synced" : "local"))
      .catch(() => setSyncState("local"));
    return grade.correct;
  };

  const resetProgress = async (
    week: AiPythonWeek,
    difficulty: AiPythonWeekDifficulty,
    categories: string[],
  ) => {
    if (
      !currentUser ||
      !categories.length ||
      syncState === "loading" ||
      resetInFlight.current
    ) {
      return false;
    }

    const hasMatchingAttempt = progress.attempts.some(
      (attempt) =>
        attempt.week === week &&
        attempt.difficulty === difficulty &&
        categories.includes(attempt.category),
    );
    if (!hasMatchingAttempt) return true;

    const previousSyncState = syncState;
    resetInFlight.current = true;
    setSyncState("loading");
    try {
      const result = await resetAiPythonWeekProgress(
        currentUser.id,
        week,
        difficulty,
        categories,
      );
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
    return {
      total,
      correct,
      incorrect: total - correct,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
    };
  }, [progress.attempts]);

  return {
    progress,
    summary,
    recordAnswer,
    resetProgress,
    syncState,
  };
}
