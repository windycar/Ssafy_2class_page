import { supabase } from "../lib/supabase";
import {
  javascriptStudyProgressStorage,
  getJavascriptStudyResetAttemptIds,
} from "./storage/javascriptStudyProgressStorage";
import { reconcileRemoteProgress } from "./storage/reconcileStudyProgress";
import {
  resetScopedStudyProgress,
  STUDY_ATTEMPT_TABLES,
  type ScopedStudyDeleteClient,
} from "./scopedStudyProgressReset";
import type {
  JavascriptCategory,
  JavascriptStudyAttempt,
  JavascriptStudyProgress,
} from "../types/javascriptStudy";

type JavascriptStudyAttemptRow = {
  id: string;
  student_id: number;
  question_id: string;
  category: JavascriptCategory;
  selected_answer: number | null;
  response_text: string | null;
  correct: boolean;
  answered_at: string;
};

async function verifyStudent(studentId: number, expectedAuthId: string) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== expectedAuthId) throw new Error("Account changed");
  const { data, error } = await supabase.from("members")
    .select("student_id,auth_user_id,is_active")
    .eq("auth_user_id", user.id).eq("student_id", studentId).eq("is_active", true).maybeSingle();
  if (error || !data || data.auth_user_id !== expectedAuthId || data.student_id !== studentId) {
    throw new Error("Student profile does not match the signed-in account");
  }
}

function toAttempt(row: JavascriptStudyAttemptRow): JavascriptStudyAttempt {
  return {
    id: row.id,
    questionId: row.question_id,
    category: row.category,
    selectedAnswer: row.selected_answer,
    responseText: row.response_text ?? undefined,
    correct: row.correct,
    answeredAt: row.answered_at,
  };
}

function toRow(studentId: number, attempt: JavascriptStudyAttempt) {
  return {
    id: attempt.id,
    student_id: studentId,
    question_id: attempt.questionId,
    category: attempt.category,
    selected_answer: attempt.selectedAnswer,
    response_text: attempt.responseText ?? null,
    correct: attempt.correct,
    answered_at: attempt.answeredAt,
  };
}

async function uploadPending(studentId: number) {
  if (!supabase) return;
  const pending = javascriptStudyProgressStorage.getPending(studentId);
  if (!pending.length) return;

  const { error } = await supabase
    .from("javascript_study_attempts")
    .upsert(pending.map((attempt) => toRow(studentId, attempt)), {
      onConflict: "id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
  javascriptStudyProgressStorage.markSynced(
    studentId,
    pending.map((attempt) => attempt.id),
  );
}

export async function loadJavascriptStudyProgress(
  studentId: number,
  authId: string,
): Promise<JavascriptStudyProgress> {
  const local = javascriptStudyProgressStorage.get(studentId);
  if (!supabase) return local;
  await verifyStudent(studentId, authId);
  const localIdsBeforeSync = new Set(local.attempts.map((attempt) => attempt.id));

  await uploadPending(studentId);
  const { data, error } = await supabase
    .from("javascript_study_attempts")
    .select("*")
    .eq("student_id", studentId)
    .like("id", "js-study-v3-%")
    .order("answered_at", { ascending: false })
    .limit(2000);

  if (error) throw error;
  const remote: JavascriptStudyProgress = {
    attempts: ((data ?? []) as JavascriptStudyAttemptRow[]).map(toAttempt).reverse(),
  };
  return javascriptStudyProgressStorage.replace(
    studentId,
    reconcileRemoteProgress(
      remote,
      javascriptStudyProgressStorage.get(studentId),
      localIdsBeforeSync,
    ),
  );
}

export async function saveJavascriptStudyAttempt(studentId: number, authId: string) {
  if (!supabase) return false;
  await verifyStudent(studentId, authId);
  await uploadPending(studentId);
  return javascriptStudyProgressStorage.getPendingIds(studentId).length === 0;
}

export async function resetJavascriptStudyProgress(
  studentId: number,
  categories: JavascriptCategory[],
  authId: string,
): Promise<{ progress: JavascriptStudyProgress; synced: boolean }> {
  if (supabase) await verifyStudent(studentId, authId);
  const current = javascriptStudyProgressStorage.get(studentId);
  if (!categories.length) return { progress: current, synced: false };

  const attemptIds = getJavascriptStudyResetAttemptIds(current, categories);
  if (!attemptIds.length) return { progress: current, synced: false };

  return resetScopedStudyProgress(
    supabase as unknown as ScopedStudyDeleteClient | null,
    STUDY_ATTEMPT_TABLES.javascript,
    studentId,
    attemptIds,
    () => javascriptStudyProgressStorage.remove(studentId, attemptIds),
  );
}
