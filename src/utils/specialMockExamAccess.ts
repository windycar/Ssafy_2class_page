type SpecialMockExamAccessUser = {
  role: "member" | "admin";
  canAccessSpecialMockExam: boolean;
  studentId: number | null;
  isDemo?: boolean;
};

export function canAccessSpecialMockExam(
  user: SpecialMockExamAccessUser | null | undefined,
) {
  return (
    user?.isDemo === true ||
    (user?.studentId != null &&
      (user.role === "admin" || user.canAccessSpecialMockExam === true))
  );
}
