import { supabase } from "../lib/supabase";
import {
  aiPythonStudyProgressStorage,
  getAiPythonStudyResetAttemptIds,
} from "./storage/aiPythonStudyProgressStorage";
import {
  resetScopedStudyProgress,
  STUDY_ATTEMPT_TABLES,
  type ScopedStudyDeleteClient,
} from "./scopedStudyProgressReset";
import type {
  AiPythonCategory,
  AiPythonStudyAttempt,
  AiPythonStudyProgress,
} from "../types/aiPythonStudy";

type AiPythonStudyAttemptRow = {
  id: string;
  student_id: number;
  question_id: string;
  category: AiPythonCategory;
  selected_answer: number;
  correct: boolean;
  answered_at: string;
};

function toAttempt(row: AiPythonStudyAttemptRow): AiPythonStudyAttempt {
  return {
    id: row.id,
    questionId: row.question_id,
    category: row.category,
    selectedAnswer: row.selected_answer,
    correct: row.correct,
    answeredAt: row.answered_at,
  };
}

function toRow(studentId: number, attempt: AiPythonStudyAttempt) {
  return {
    id: attempt.id,
    student_id: studentId,
    question_id: attempt.questionId,
    category: attempt.category,
    selected_answer: attempt.selectedAnswer,
    correct: attempt.correct,
    answered_at: attempt.answeredAt,
  };
}

function mergeProgress(...items: AiPythonStudyProgress[]): AiPythonStudyProgress {
  const attempts = new Map<string, AiPythonStudyAttempt>();
  items.forEach((progress) => {
    progress.attempts.forEach((attempt) => attempts.set(attempt.id, attempt));
  });
  return {
    attempts: [...attempts.values()].sort(
      (a, b) => new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime(),
    ),
  };
}

async function uploadPending(studentId: number) {
  if (!supabase) return;
  const pending = aiPythonStudyProgressStorage.getPending(studentId);
  if (!pending.length) return;

  const { error } = await supabase
    .from("ai_python_study_attempts")
    .upsert(pending.map((attempt) => toRow(studentId, attempt)), {
      onConflict: "id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
  aiPythonStudyProgressStorage.markSynced(
    studentId,
    pending.map((attempt) => attempt.id),
  );
}

export async function loadAiPythonStudyProgress(
  studentId: number,
): Promise<AiPythonStudyProgress> {
  const local = aiPythonStudyProgressStorage.get(studentId);
  if (!supabase) return local;

  await uploadPending(studentId);
  const { data, error } = await supabase
    .from("ai_python_study_attempts")
    .select("*")
    .eq("student_id", studentId)
    .order("answered_at", { ascending: true })
    .limit(2000);

  if (error) throw error;
  const remote: AiPythonStudyProgress = {
    attempts: ((data ?? []) as AiPythonStudyAttemptRow[]).map(toAttempt),
  };
  return aiPythonStudyProgressStorage.replace(studentId, mergeProgress(local, remote));
}

export async function saveAiPythonStudyAttempt(studentId: number) {
  if (!supabase) return false;
  await uploadPending(studentId);
  return aiPythonStudyProgressStorage.getPendingIds(studentId).length === 0;
}

export async function resetAiPythonStudyProgress(
  studentId: number,
  categories: AiPythonCategory[],
): Promise<{ progress: AiPythonStudyProgress; synced: boolean }> {
  const current = aiPythonStudyProgressStorage.get(studentId);
  if (!categories.length) return { progress: current, synced: false };

  const attemptIds = getAiPythonStudyResetAttemptIds(current, categories);
  if (!attemptIds.length) return { progress: current, synced: false };

  return resetScopedStudyProgress(
    supabase as unknown as ScopedStudyDeleteClient | null,
    STUDY_ATTEMPT_TABLES.aiPython,
    studentId,
    attemptIds,
    () => aiPythonStudyProgressStorage.remove(studentId, attemptIds),
  );
}
