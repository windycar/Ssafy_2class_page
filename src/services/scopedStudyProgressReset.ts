export interface ScopedStudyDeleteClient {
  from(table: string): {
    delete(): {
      eq(column: "student_id", value: number): {
        in(column: "id", values: string[]): PromiseLike<{ error: unknown }>;
      };
    };
  };
}

export const STUDY_ATTEMPT_TABLES = {
  python: "study_attempts",
  web: "web_study_attempts",
  aiPython: "ai_python_study_attempts",
  aiPythonWeek: "ai_python_week_attempts",
  specialMockExam: "special_mock_exam_attempts",
} as const;

export type StudyAttemptTable =
  (typeof STUDY_ATTEMPT_TABLES)[keyof typeof STUDY_ATTEMPT_TABLES];

export async function resetScopedStudyProgress<TProgress>(
  client: ScopedStudyDeleteClient | null,
  table: StudyAttemptTable,
  studentId: number,
  attemptIds: string[],
  removeLocal: () => TProgress,
): Promise<{ progress: TProgress; synced: boolean }> {
  if (client) {
    const { error } = await client
      .from(table)
      .delete()
      .eq("student_id", studentId)
      .in("id", attemptIds);

    if (error) throw error;
  }

  return {
    progress: removeLocal(),
    synced: Boolean(client),
  };
}
