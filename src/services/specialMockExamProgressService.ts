import { supabase } from "../lib/supabase";
import {
  getSpecialMockExamResetAttemptIds,
  specialMockExamProgressStorage,
} from "./storage/specialMockExamProgressStorage";
import { reconcileRemoteProgress } from "./storage/reconcileStudyProgress";
import {
  resetScopedStudyProgress,
  STUDY_ATTEMPT_TABLES,
  type ScopedStudyDeleteClient,
} from "./scopedStudyProgressReset";
import type {
  SpecialMockExamAttempt,
  SpecialMockExamDifficulty,
  SpecialMockExamProgress,
  SpecialMockExamQuestionType,
  SpecialMockExamRound,
} from "../types/specialMockExam";
import { isCurrentSpecialMockExamAttempt } from "../types/specialMockExam";
import { isAnsweredSpecialMockExamAttempt } from "../utils/specialMockExamGrading";

type SpecialMockExamAttemptRow = {
  id: string;
  student_id: number;
  assessment_round: 2;
  mock_round: SpecialMockExamRound;
  question_id: string;
  difficulty: SpecialMockExamDifficulty;
  category: string;
  question_type: SpecialMockExamQuestionType;
  selected_answer: number | null;
  response_text: string | null;
  correct: boolean;
  answered_at: string;
};

function toAttempt(row: SpecialMockExamAttemptRow): SpecialMockExamAttempt {
  return {
    id: row.id,
    assessmentRound: row.assessment_round,
    mockRound: row.mock_round,
    questionId: row.question_id,
    difficulty: row.difficulty,
    category: row.category,
    questionType: row.question_type,
    selectedAnswer: row.selected_answer,
    responseText: row.response_text ?? undefined,
    correct: row.correct,
    answeredAt: row.answered_at,
  };
}

function toRow(studentId: number, attempt: SpecialMockExamAttempt) {
  return {
    id: attempt.id,
    student_id: studentId,
    assessment_round: attempt.assessmentRound,
    mock_round: attempt.mockRound,
    question_id: attempt.questionId,
    difficulty: attempt.difficulty,
    category: attempt.category,
    question_type: attempt.questionType,
    selected_answer: attempt.selectedAnswer,
    response_text: attempt.responseText ?? null,
    correct: attempt.correct,
    answered_at: attempt.answeredAt,
  };
}

function currentBankProgress(
  progress: SpecialMockExamProgress,
): SpecialMockExamProgress {
  return {
    attempts: progress.attempts.filter(
      (attempt) =>
        isCurrentSpecialMockExamAttempt(attempt) &&
        isAnsweredSpecialMockExamAttempt(attempt),
    ),
  };
}

async function uploadPending(studentId: number) {
  if (!supabase) return;
  const pending = specialMockExamProgressStorage.getPending(studentId);
  const pendingIds = new Set(pending.map(({ id }) => id));
  const stalePendingIds = specialMockExamProgressStorage
    .getPendingIds(studentId)
    .filter((id) => !pendingIds.has(id));
  if (stalePendingIds.length) {
    specialMockExamProgressStorage.markSynced(studentId, stalePendingIds);
  }
  if (!pending.length) return;

  const { error } = await supabase
    .from("special_mock_exam_attempts")
    .upsert(pending.map((attempt) => toRow(studentId, attempt)), {
      onConflict: "id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
  specialMockExamProgressStorage.markSynced(
    studentId,
    pending.map(({ id }) => id),
  );
}

export async function loadSpecialMockExamProgress(
  studentId: number,
): Promise<SpecialMockExamProgress> {
  const local = currentBankProgress(
    specialMockExamProgressStorage.get(studentId),
  );
  if (!supabase) return local;
  const localIdsBeforeSync = new Set(local.attempts.map(({ id }) => id));

  await uploadPending(studentId);
  const { data, error } = await supabase
    .from("special_mock_exam_attempts")
    .select("*")
    .eq("student_id", studentId)
    .order("answered_at", { ascending: false })
    .limit(3000);

  if (error) throw error;
  const remote: SpecialMockExamProgress = {
    attempts: currentBankProgress({
      attempts: ((data ?? []) as SpecialMockExamAttemptRow[])
        .map(toAttempt)
        .reverse(),
    }).attempts,
  };
  return specialMockExamProgressStorage.replace(
    studentId,
    reconcileRemoteProgress(
      remote,
      currentBankProgress(specialMockExamProgressStorage.get(studentId)),
      localIdsBeforeSync,
    ),
  );
}

export async function saveSpecialMockExamAttempt(studentId: number) {
  if (!supabase) return false;
  await uploadPending(studentId);
  return specialMockExamProgressStorage.getPendingIds(studentId).length === 0;
}

export async function resetSpecialMockExamProgress(
  studentId: number,
  mockRound: SpecialMockExamRound,
): Promise<{ progress: SpecialMockExamProgress; synced: boolean }> {
  const current = specialMockExamProgressStorage.get(studentId);
  const attemptIds = getSpecialMockExamResetAttemptIds(current, mockRound);
  if (!attemptIds.length) return { progress: current, synced: false };

  return resetScopedStudyProgress(
    supabase as unknown as ScopedStudyDeleteClient | null,
    STUDY_ATTEMPT_TABLES.specialMockExam,
    studentId,
    attemptIds,
    () => specialMockExamProgressStorage.remove(studentId, attemptIds),
  );
}
