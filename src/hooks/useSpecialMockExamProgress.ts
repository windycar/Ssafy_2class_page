import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import {
  loadSpecialMockExamProgress,
  resetSpecialMockExamProgress,
  saveSpecialMockExamAttempt,
} from "../services/specialMockExamProgressService";
import { specialMockExamProgressStorage } from "../services/storage/specialMockExamProgressStorage";
import { gradeSpecialMockExamResponse } from "../utils/specialMockExamGrading";
import { subscribeToStudyProgressRefresh } from "../utils/studyProgressSync";
import type {
  SpecialMockExamAttempt,
  SpecialMockExamQuestion,
  SpecialMockExamRound,
} from "../types/specialMockExam";
import { getSpecialMockExamAttemptIdPrefix } from "../types/specialMockExam";
import type { StudySyncState } from "./useStudyProgress";

export function useSpecialMockExamProgress() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 0;
  const [progress, setProgress] = useState(() =>
    specialMockExamProgressStorage.get(userId),
  );
  const [syncState, setSyncState] = useState<StudySyncState>("loading");
  const resetInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let refreshInFlight = false;
    setProgress(specialMockExamProgressStorage.get(userId));

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
        const loaded = await loadSpecialMockExamProgress(activeUserId);
        if (cancelled) return;
        setProgress(loaded);
        setSyncState("synced");
      } catch {
        if (cancelled) return;
        setProgress(specialMockExamProgressStorage.get(activeUserId));
        setSyncState("local");
      } finally {
        refreshInFlight = false;
      }
    };

    void refresh(true);
    const unsubscribe = subscribeToStudyProgressRefresh(
      "ssafy-gwangju-2-special-mock-",
      () => void refresh(),
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentUser, userId]);

  const recordAnswer = (
    mockRound: SpecialMockExamRound,
    question: SpecialMockExamQuestion,
    response: number | string,
  ) => {
    const grade = gradeSpecialMockExamResponse(question, response);
    if (!currentUser) return grade.correct;

    const attempt: SpecialMockExamAttempt = {
      id: `${getSpecialMockExamAttemptIdPrefix(mockRound)}${Date.now()}-${question.sourceId}-${Math.random().toString(36).slice(2, 7)}`,
      assessmentRound: 2,
      mockRound,
      questionId: question.id,
      difficulty: question.difficulty,
      category: question.category,
      questionType: question.questionType,
      selectedAnswer: typeof response === "number" ? response : null,
      responseText: typeof response === "string" ? response : undefined,
      correct: grade.correct,
      answeredAt: new Date().toISOString(),
    };
    setProgress(specialMockExamProgressStorage.add(currentUser.id, attempt));
    setSyncState("loading");
    saveSpecialMockExamAttempt(currentUser.id)
      .then((saved) => setSyncState(saved ? "synced" : "local"))
      .catch(() => setSyncState("local"));
    return grade.correct;
  };

  const resetProgress = async (mockRound: SpecialMockExamRound) => {
    if (!currentUser || syncState === "loading" || resetInFlight.current) {
      return false;
    }
    if (!progress.attempts.some((attempt) => attempt.mockRound === mockRound)) {
      return true;
    }

    const previousSyncState = syncState;
    resetInFlight.current = true;
    setSyncState("loading");
    try {
      const result = await resetSpecialMockExamProgress(
        currentUser.id,
        mockRound,
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
    const correct = progress.attempts.filter(({ correct }) => correct).length;
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
