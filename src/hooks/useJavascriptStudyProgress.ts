import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { javascriptStudyProgressStorage } from "../services/storage/javascriptStudyProgressStorage";
import {
  loadJavascriptStudyProgress,
  resetJavascriptStudyProgress,
  saveJavascriptStudyAttempt,
} from "../services/javascriptStudyProgressService";
import { subscribeToStudyProgressRefresh } from "../utils/studyProgressSync";
import { gradeJavascriptResponse } from "../utils/javascriptStudyGrading";
import type {
  JavascriptCategory,
  JavascriptQuestion,
  JavascriptStudyAttempt,
} from "../types/javascriptStudy";
import type { StudySyncState } from "./useStudyProgress";

const EMPTY_CATEGORY_SUMMARY: Record<
  JavascriptCategory,
  { total: number; correct: number }
> = {
  set1: { total: 0, correct: 0 },
  set2: { total: 0, correct: 0 },
  set3: { total: 0, correct: 0 },
  set4: { total: 0, correct: 0 },
  set5: { total: 0, correct: 0 },
  set6: { total: 0, correct: 0 },
};

export function useJavascriptStudyProgress() {
  const { currentUser, isDemo } = useAuth();
  const userId = currentUser?.id ?? 0;
  const [progress, setProgress] = useState(() =>
    !currentUser || isDemo || currentUser.studentId == null || currentUser.id !== currentUser.studentId || !currentUser.authId
      ? { attempts: [] } : javascriptStudyProgressStorage.get(userId),
  );
  const [syncState, setSyncState] = useState<StudySyncState>("loading");
  const resetInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let refreshInFlight = false;
    setProgress(!currentUser || isDemo || currentUser.studentId == null || currentUser.id !== currentUser.studentId || !currentUser.authId
      ? { attempts: [] } : javascriptStudyProgressStorage.get(userId));

    if (!currentUser || isDemo || currentUser.studentId == null || currentUser.id !== currentUser.studentId || !currentUser.authId) {
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
        const loaded = await loadJavascriptStudyProgress(activeUserId, currentUser.authId);
        if (cancelled) return;
        setProgress(loaded);
        setSyncState("synced");
      } catch {
        if (cancelled) return;
        setProgress(javascriptStudyProgressStorage.get(activeUserId));
        setSyncState("local");
      } finally {
        refreshInFlight = false;
      }
    };

    void refresh(true);
    const unsubscribe = subscribeToStudyProgressRefresh(
      "ssafy-gwangju-2-javascript-study-",
      () => void refresh(),
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentUser, isDemo, userId]);

  const recordAnswer = (question: JavascriptQuestion, response: number | string) => {
    const correct = gradeJavascriptResponse(question, response);
    if (!currentUser || isDemo || currentUser.studentId == null || currentUser.id !== currentUser.studentId || !currentUser.authId) return correct;

    const attempt: JavascriptStudyAttempt = {
      id: `js-study-v3-${Date.now()}-${question.id}-${Math.random().toString(36).slice(2, 7)}`,
      questionId: question.id,
      category: question.category,
      selectedAnswer: typeof response === "number" ? response : null,
      responseText: typeof response === "string" ? response : undefined,
      correct,
      answeredAt: new Date().toISOString(),
    };
    setProgress(javascriptStudyProgressStorage.add(currentUser.id, attempt));
    setSyncState("loading");
    saveJavascriptStudyAttempt(currentUser.id, currentUser.authId)
      .then((saved) => setSyncState(saved ? "synced" : "local"))
      .catch(() => setSyncState("local"));
    return correct;
  };

  const resetProgress = async (categories: JavascriptCategory[]) => {
    if (!currentUser || isDemo || currentUser.studentId == null || currentUser.id !== currentUser.studentId || !currentUser.authId || !categories.length || syncState === "loading" || resetInFlight.current) {
      return false;
    }

    const hasMatchingAttempt = progress.attempts.some((attempt) =>
      categories.includes(attempt.category),
    );
    if (!hasMatchingAttempt) return true;

    const previousSyncState = syncState;
    resetInFlight.current = true;
    setSyncState("loading");
    try {
      const result = await resetJavascriptStudyProgress(currentUser.id, categories, currentUser.authId);
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
    let correct = 0;
    const byCategory = Object.fromEntries(
      Object.entries(EMPTY_CATEGORY_SUMMARY).map(([key, value]) => [key, { ...value }]),
    ) as Record<JavascriptCategory, { total: number; correct: number }>;

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

  return { progress, summary, recordAnswer, resetProgress, syncState };
}
