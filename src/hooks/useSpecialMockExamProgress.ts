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
  const { currentUser, isDemo } = useAuth();
  const hasAccess = canAccessSpecialMockExam(currentUser);
  const identity = `${currentUser?.authId ?? ""}:${currentUser?.id ?? ""}`;
  const activeIdentity = useRef(identity);
  activeIdentity.current = identity;
  const [progress, setProgress] = useState<SpecialMockExamProgress>({
    attempts: [],
  });
  const [syncState, setSyncState] = useState<StudySyncState>("loading");
  const resetInFlight = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let refreshInFlight = false;

    if (!currentUser || !hasAccess || isDemo) {
      setProgress({ attempts: [] });
      setSyncState("local");
      return () => {
        cancelled = true;
      };
    }

    const activeUserId = currentUser.id;
    const requestIdentity = identity;
    setProgress(specialMockExamProgressStorage.get(activeUserId));
    const refresh = async (showLoading = false) => {
      if (refreshInFlight) return;
      refreshInFlight = true;
      if (showLoading) setSyncState("loading");
      try {
        const loaded = await loadSpecialMockExamProgress(activeUserId, currentUser.authId);
        if (cancelled || activeIdentity.current !== requestIdentity) return;
        setProgress(loaded);
        setSyncState("synced");
      } catch {
        if (cancelled || activeIdentity.current !== requestIdentity) return;
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
  }, [currentUser, hasAccess, identity, isDemo]);

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
    if (!currentUser || !hasAccess || isDemo || activeIdentity.current !== identity) return graded;
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
    saveSpecialMockExamAttempt(currentUser.id, currentUser.authId)
      .then((saved) => {
        if (activeIdentity.current === identity) setSyncState(saved ? "synced" : "local");
      })
      .catch(() => {
        if (activeIdentity.current === identity) setSyncState("local");
      });
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
      isDemo ||
      syncState === "loading" ||
      resetInFlight.current === identity
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
    resetInFlight.current = identity;
    setSyncState("loading");
    try {
      const result = await resetSpecialMockExamProgress(
        currentUser.id,
        assessmentRound,
        mockRound,
        currentUser.authId,
      );
      if (activeIdentity.current !== identity) return false;
      setProgress(result.progress);
      setSyncState(result.synced ? "synced" : "local");
      return true;
    } catch {
      if (activeIdentity.current === identity) setSyncState(previousSyncState);
      return false;
    } finally {
      if (resetInFlight.current === identity) resetInFlight.current = null;
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
