import { supabase } from "../lib/supabase";
import { studyProgressStorage } from "./storage/studyProgressStorage";
import type {
  StudyAttempt,
  StudyCategory,
  StudyDifficulty,
  StudyProgress,
} from "../types/study";

type StudyAttemptRow = {
  id: string;
  student_id: number;
  question_id: string;
  difficulty: StudyDifficulty;
  category: StudyCategory;
  selected_answer: number;
  correct: boolean;
  answered_at: string;
};

function toAttempt(row: StudyAttemptRow): StudyAttempt {
  return {
    id: row.id,
    questionId: row.question_id,
    difficulty: row.difficulty,
    category: row.category,
    selectedAnswer: row.selected_answer,
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
    selected_answer: attempt.selectedAnswer,
    correct: attempt.correct,
    answered_at: attempt.answeredAt,
  };
}

function mergeProgress(...progressList: StudyProgress[]): StudyProgress {
  const attempts = new Map<string, StudyAttempt>();
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

  await uploadPending(studentId);

  const { data, error } = await supabase
    .from("study_attempts")
    .select("*")
    .eq("student_id", studentId)
    .order("answered_at", { ascending: true })
    .limit(2000);

  if (error) throw error;
  const remote: StudyProgress = {
    attempts: ((data ?? []) as StudyAttemptRow[]).map(toAttempt),
  };
  return studyProgressStorage.replace(studentId, mergeProgress(local, remote));
}

export async function saveStudyAttempt(studentId: number): Promise<boolean> {
  if (!supabase) return false;
  await uploadPending(studentId);
  return studyProgressStorage.getPendingIds(studentId).length === 0;
}
