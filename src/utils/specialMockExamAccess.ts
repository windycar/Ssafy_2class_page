type SpecialMockExamAccessUser = {
  role: "member" | "admin";
  canAccessSpecialMockExam: boolean;
};

export function canAccessSpecialMockExam(
  user: SpecialMockExamAccessUser | null | undefined,
) {
  return user?.role === "admin" || user?.canAccessSpecialMockExam === true;
}
