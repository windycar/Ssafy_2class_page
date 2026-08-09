import { supabase } from "../lib/supabase";
import {
  aiPythonWeekProgressStorage,
  getAiPythonWeekResetAttemptIds,
} from "./storage/aiPythonWeekProgressStorage";
import {
  resetScopedStudyProgress,
  STUDY_ATTEMPT_TABLES,
  type ScopedStudyDeleteClient,
} from "./scopedStudyProgressReset";
import type {
  AiPythonWeek,
  AiPythonWeekAttempt,
  AiPythonWeekDifficulty,
  AiPythonWeekProgress,
  AiPythonWeekQuestionType,
} from "../types/aiPythonWeekStudy";
import { AI_PYTHON_WEEK_ATTEMPT_ID_PREFIX } from "../types/aiPythonWeekStudy";

type AiPythonWeekAttemptRow = {
  id: string;
  student_id: number;
  week: AiPythonWeek;
  question_id: string;
  difficulty: AiPythonWeekDifficulty;
  category: string;
  question_type: AiPythonWeekQuestionType;
  selected_answer: number | null;
  response_text: string | null;
  correct: boolean;
  answered_at: string;
};

function toAttempt(row: AiPythonWeekAttemptRow): AiPythonWeekAttempt {
  return {
    id: row.id,
    week: row.week,
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

function toRow(studentId: number, attempt: AiPythonWeekAttempt) {
  return {
    id: attempt.id,
    student_id: studentId,
    week: attempt.week,
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

function mergeProgress(...items: AiPythonWeekProgress[]): AiPythonWeekProgress {
  const attempts = new Map<string, AiPythonWeekAttempt>();
  items.forEach((progress) => {
    progress.attempts.forEach((attempt) => attempts.set(attempt.id, attempt));
  });
  return {
    attempts: [...attempts.values()].sort(
      (a, b) =>
        new Date(a.answeredAt).getTime() - new Date(b.answeredAt).getTime(),
    ),
  };
}

function currentBankProgress(
  progress: AiPythonWeekProgress,
): AiPythonWeekProgress {
  return {
    attempts: progress.attempts.filter((attempt) =>
      attempt.id.startsWith(AI_PYTHON_WEEK_ATTEMPT_ID_PREFIX),
    ),
  };
}

async function uploadPending(studentId: number) {
  if (!supabase) return;
  const pending = aiPythonWeekProgressStorage.getPending(studentId);
  if (!pending.length) return;

  const { error } = await supabase
    .from("ai_python_week_attempts")
    .upsert(pending.map((attempt) => toRow(studentId, attempt)), {
      onConflict: "id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
  aiPythonWeekProgressStorage.markSynced(
    studentId,
    pending.map((attempt) => attempt.id),
  );
}

export async function loadAiPythonWeekProgress(
  studentId: number,
): Promise<AiPythonWeekProgress> {
  const local = currentBankProgress(
    aiPythonWeekProgressStorage.get(studentId),
  );
  if (!supabase) return local;

  await uploadPending(studentId);
  const { data, error } = await supabase
    .from("ai_python_week_attempts")
    .select("*")
    .eq("student_id", studentId)
    .order("answered_at", { ascending: true })
    .limit(3000);

  if (error) throw error;
  const remote: AiPythonWeekProgress = {
    attempts: currentBankProgress({
      attempts: ((data ?? []) as AiPythonWeekAttemptRow[]).map(toAttempt),
    }).attempts,
  };
  return aiPythonWeekProgressStorage.replace(
    studentId,
    mergeProgress(local, remote),
  );
}

export async function saveAiPythonWeekAttempt(studentId: number) {
  if (!supabase) return false;
  await uploadPending(studentId);
  return aiPythonWeekProgressStorage.getPendingIds(studentId).length === 0;
}

export async function resetAiPythonWeekProgress(
  studentId: number,
  week: AiPythonWeek,
  difficulty: AiPythonWeekDifficulty,
  categories: string[],
): Promise<{ progress: AiPythonWeekProgress; synced: boolean }> {
  const current = aiPythonWeekProgressStorage.get(studentId);
  if (!categories.length) return { progress: current, synced: false };

  const attemptIds = getAiPythonWeekResetAttemptIds(
    current,
    week,
    difficulty,
    categories,
  );
  if (!attemptIds.length) return { progress: current, synced: false };

  return resetScopedStudyProgress(
    supabase as unknown as ScopedStudyDeleteClient | null,
    STUDY_ATTEMPT_TABLES.aiPythonWeek,
    studentId,
    attemptIds,
    () => aiPythonWeekProgressStorage.remove(studentId, attemptIds),
  );
}
