import { supabase } from "../lib/supabase";
import { webStudyProgressStorage } from "./storage/webStudyProgressStorage";
import type {
  WebCategory,
  WebDifficulty,
  WebStudyAttempt,
  WebStudyProgress,
} from "../types/webStudy";
import type { StudyQuestionType } from "../types/study";

type WebStudyAttemptRow = {
  id: string;
  student_id: number;
  question_id: string;
  difficulty: WebDifficulty;
  category: WebCategory;
  question_type: StudyQuestionType | null;
  selected_answer: number | null;
  response_text: string | null;
  correct: boolean;
  answered_at: string;
};

function toAttempt(row: WebStudyAttemptRow): WebStudyAttempt {
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

function toRow(studentId: number, attempt: WebStudyAttempt) {
  return {
    id: attempt.id,
    student_id: studentId,
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

function mergeProgress(...progressList: WebStudyProgress[]): WebStudyProgress {
  const attempts = new Map<string, WebStudyAttempt>();
  progressList.forEach((progress) => {
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
  const pending = webStudyProgressStorage.getPending(studentId);
  if (!pending.length) return;

  const { error } = await supabase
    .from("web_study_attempts")
    .upsert(pending.map((attempt) => toRow(studentId, attempt)), {
      onConflict: "id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
  webStudyProgressStorage.markSynced(
    studentId,
    pending.map((attempt) => attempt.id),
  );
}

export async function loadWebStudyProgress(studentId: number): Promise<WebStudyProgress> {
  const local = webStudyProgressStorage.get(studentId);
  if (!supabase) return local;

  await uploadPending(studentId);

  const { data, error } = await supabase
    .from("web_study_attempts")
    .select("*")
    .eq("student_id", studentId)
    .order("answered_at", { ascending: true })
    .limit(2000);

  if (error) throw error;
  const remote: WebStudyProgress = {
    attempts: ((data ?? []) as WebStudyAttemptRow[]).map(toAttempt),
  };
  return webStudyProgressStorage.replace(studentId, mergeProgress(local, remote));
}

export async function saveWebStudyAttempt(studentId: number): Promise<boolean> {
  if (!supabase) return false;
  await uploadPending(studentId);
  return webStudyProgressStorage.getPendingIds(studentId).length === 0;
}
