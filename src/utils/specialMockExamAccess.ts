type SpecialMockExamAccessUser = {
  role: "member" | "admin";
  canAccessSpecialMockExam: boolean;
  studentId: number | null;
};

export function canAccessSpecialMockExam(
  user: SpecialMockExamAccessUser | null | undefined,
) {
  return (
    user?.studentId != null &&
    (user.role === "admin" || user.canAccessSpecialMockExam === true)
  );
}
