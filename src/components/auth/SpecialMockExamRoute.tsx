import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { canAccessMonthlyMockExam, canAccessSpecialMockExam } from "../../utils/specialMockExamAccess";

export default function SpecialMockExamRoute({ monthly = false }: { monthly?: boolean }) {
  const { currentUser } = useAuth();
  const hasAccess = monthly
    ? canAccessMonthlyMockExam(currentUser)
    : canAccessSpecialMockExam(currentUser);

  if (!hasAccess) {
    return <Navigate to="/study" replace />;
  }

  return <Outlet />;
}
