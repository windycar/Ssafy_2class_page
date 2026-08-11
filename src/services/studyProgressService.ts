import { supabase } from "../lib/supabase";
import {
  getStudyResetAttemptIds,
  studyProgressStorage,
} from "./storage/studyProgressStorage";
import { reconcileRemoteProgress } from "./storage/reconcileStudyProgress";
import {
  resetScopedStudyProgress,
  STUDY_ATTEMPT_TABLES,
  type ScopedStudyDeleteClient,
} from "./scopedStudyProgressReset";
import type {
  StudyAttempt,
  StudyCategory,
  StudyDifficulty,
  StudyProgress,
  StudyQuestionType,
} from "../types/study";

type StudyAttemptRow = {
  id: string;
  student_id: number;
  question_id: string;
  difficulty: StudyDifficulty;
  category: StudyCategory;
  question_type: StudyQuestionType | null;
  selected_answer: number | null;
  response_text: string | null;
  correct: boolean;
  answered_at: string;
};

function toAttempt(row: StudyAttemptRow): StudyAttempt {
  return {
    id: row.id,
    questionId: row.question_id,
    difficulty: row.difficulty,
    category: row.category,
    questionType: row.question_type ?? "multiple-choice",
    selectedAnswer: row.selected_answer,
    responseText: row.response_text ?? undefined,
    correct: row.correct,
    answeredAt: row.answered_at,
  };
}

function toRow(studentId: number, attempt: StudyAttempt) {
  return {
    id: attempt.id,
    student_id: studentId,
    question_id: attempt.questionId,
    difficulty: attempt.difficulty,
    category: attempt.category,
    question_type: attempt.questionType ?? "multiple-choice",
    selected_answer: attempt.selectedAnswer,
    response_text: attempt.responseText ?? null,
    correct: attempt.correct,
    answered_at: attempt.answeredAt,
  };
}

async function uploadPending(studentId: number) {
  if (!supabase) return;
  const pending = studyProgressStorage.getPending(studentId);
  if (!pending.length) return;

  const { error } = await supabase
    .from("study_attempts")
    .upsert(pending.map((attempt) => toRow(studentId, attempt)), {
      onConflict: "id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
  studyProgressStorage.markSynced(
    studentId,
    pending.map((attempt) => attempt.id),
  );
}

export async function loadStudyProgress(studentId: number): Promise<StudyProgress> {
  const local = studyProgressStorage.get(studentId);
  if (!supabase) return local;
  const localIdsBeforeSync = new Set(local.attempts.map((attempt) => attempt.id));

  await uploadPending(studentId);

  const { data, error } = await supabase
    .from("study_attempts")
    .select("*")
    .eq("student_id", studentId)
    .order("answered_at", { ascending: false })
    .limit(2000);

  if (error) throw error;
  const remote: StudyProgress = {
    attempts: ((data ?? []) as StudyAttemptRow[]).map(toAttempt).reverse(),
  };
  return studyProgressStorage.replace(
    studentId,
    reconcileRemoteProgress(
      remote,
      studyProgressStorage.get(studentId),
      localIdsBeforeSync,
    ),
  );
}

export async function saveStudyAttempt(studentId: number): Promise<boolean> {
  if (!supabase) return false;
  await uploadPending(studentId);
  return studyProgressStorage.getPendingIds(studentId).length === 0;
}

export async function resetStudyProgress(
  studentId: number,
  difficulty: StudyDifficulty,
  categories: StudyCategory[],
): Promise<{ progress: StudyProgress; synced: boolean }> {
  const current = studyProgressStorage.get(studentId);
  if (!categories.length) return { progress: current, synced: false };

  const attemptIds = getStudyResetAttemptIds(current, difficulty, categories);
  if (!attemptIds.length) return { progress: current, synced: false };

  return resetScopedStudyProgress(
    supabase as unknown as ScopedStudyDeleteClient | null,
    STUDY_ATTEMPT_TABLES.python,
    studentId,
    attemptIds,
    () => studyProgressStorage.remove(studentId, attemptIds),
  );
}
