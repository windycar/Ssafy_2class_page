type SpecialMockExamAccessUser = {
  role: "member" | "admin";
  canAccessSpecialMockExam: boolean;
  studentId: number | null;
  isDemo?: boolean;
  isActive?: boolean;
};

export function canAccessSpecialMockExam(
  user: SpecialMockExamAccessUser | null | undefined,
) {
  return (
    user?.isDemo === true ||
    (user != null && user.isActive !== false &&
      (user.role === "admin" ||
        (user.studentId != null && user.canAccessSpecialMockExam === true)))
  );
}

export function canAccessMonthlyMockExam(
  user: (SpecialMockExamAccessUser & { authId: string }) | null | undefined,
) {
  return Boolean(user?.authId && !user.isDemo && canAccessSpecialMockExam(user));
}
