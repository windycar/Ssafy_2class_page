import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import {
  loadSpecialMockExamProgress,
  resetSpecialMockExamProgress,
  saveSpecialMockExamAttempt,
} from "../services/specialMockExamProgressService";
import { specialMockExamProgressStorage } from "../services/storage/specialMockExamProgressStorage";
import {
  gradeSpecialMockExamResponse,
  hasSpecialMockExamResponse,
  isAnsweredSpecialMockExamAttempt,
} from "../utils/specialMockExamGrading";
import { subscribeToStudyProgressRefresh } from "../utils/studyProgressSync";
import type {
  SpecialMockExamAttempt,
  SpecialMockExamAvailableAssessmentRound,
  SpecialMockExamProgress,
  SpecialMockExamQuestion,
  SpecialMockExamRound,
} from "../types/specialMockExam";
import { getSpecialMockExamAttemptIdPrefix } from "../types/specialMockExam";
import type { StudySyncState } from "./useStudyProgress";
import { canAccessSpecialMockExam } from "../utils/specialMockExamAccess";

export function useSpecialMockExamProgress() {
  const { currentUser } = useAuth();
  const hasAccess = canAccessSpecialMockExam(currentUser);
  const [progress, setProgress] = useState<SpecialMockExamProgress>({
    attempts: [],
  });
  const [syncState, setSyncState] = useState<StudySyncState>("loading");
  const resetInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let refreshInFlight = false;

    if (!currentUser || !hasAccess) {
      setProgress({ attempts: [] });
      setSyncState("local");
      return () => {
        cancelled = true;
      };
    }

    const activeUserId = currentUser.id;
    setProgress(specialMockExamProgressStorage.get(activeUserId));
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
  }, [currentUser, hasAccess]);

  const recordAnswers = (
    assessmentRound: SpecialMockExamAvailableAssessmentRound,
    mockRound: SpecialMockExamRound,
    responses: Array<{
      question: SpecialMockExamQuestion;
      response: number | string | null;
    }>,
  ) => {
    const graded = responses.map(({ question, response }) => ({
      question,
      response,
      correct: gradeSpecialMockExamResponse(question, response).correct,
    }));
    if (!currentUser || !hasAccess) return graded;
    const submittedAnswers = graded.filter(({ response }) =>
      hasSpecialMockExamResponse(response),
    );
    if (!submittedAnswers.length) return graded;

    const submittedAt = Date.now();
    const answeredAt = new Date(submittedAt).toISOString();
    const attempts: SpecialMockExamAttempt[] = submittedAnswers.map(
      ({ question, response, correct }, index) => ({
        id: `${getSpecialMockExamAttemptIdPrefix(assessmentRound, mockRound)}${submittedAt}-${index}-${question.sourceId}-${Math.random().toString(36).slice(2, 7)}`,
        assessmentRound,
        mockRound,
        questionId: question.id,
        difficulty: question.difficulty,
        category: question.category,
        questionType: question.questionType,
        selectedAnswer: typeof response === "number" ? response : null,
        responseText: typeof response === "string" ? response : undefined,
        correct,
        answeredAt,
      }),
    );
    setProgress(specialMockExamProgressStorage.addMany(currentUser.id, attempts));
    setSyncState("loading");
    saveSpecialMockExamAttempt(currentUser.id)
      .then((saved) => setSyncState(saved ? "synced" : "local"))
      .catch(() => setSyncState("local"));
    return graded;
  };

  const recordAnswer = (
    assessmentRound: SpecialMockExamAvailableAssessmentRound,
    mockRound: SpecialMockExamRound,
    question: SpecialMockExamQuestion,
    response: number | string,
  ) => {
    return recordAnswers(assessmentRound, mockRound, [{ question, response }])[
      0
    ].correct;
  };

  const resetProgress = async (
    assessmentRound: SpecialMockExamAvailableAssessmentRound,
    mockRound: SpecialMockExamRound,
  ) => {
    if (
      !currentUser ||
      !hasAccess ||
      syncState === "loading" ||
      resetInFlight.current
    ) {
      return false;
    }
    if (
      !progress.attempts.some(
        (attempt) =>
          attempt.assessmentRound === assessmentRound &&
          attempt.mockRound === mockRound,
      )
    ) {
      return true;
    }

    const previousSyncState = syncState;
    resetInFlight.current = true;
    setSyncState("loading");
    try {
      const result = await resetSpecialMockExamProgress(
        currentUser.id,
        assessmentRound,
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
    const answeredAttempts = progress.attempts.filter(
      isAnsweredSpecialMockExamAttempt,
    );
    const total = answeredAttempts.length;
    const correct = answeredAttempts.filter(({ correct }) => correct).length;
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
    recordAnswers,
    resetProgress,
    syncState,
  };
}
