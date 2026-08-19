import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { canAccessSpecialMockExam } from "../../utils/specialMockExamAccess";

export default function SpecialMockExamRoute() {
  const { currentUser } = useAuth();

  if (!canAccessSpecialMockExam(currentUser)) {
    return <Navigate to="/study" replace />;
  }

  return <Outlet />;
}
