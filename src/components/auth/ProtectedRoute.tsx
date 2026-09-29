import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import DemoPreviewView from "../../views/DemoPreviewView";

export default function ProtectedRoute() {
  const { isAuthenticated, isDemo, isLoading, currentUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-[#1259AA]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }

  if (isDemo) {
    if (location.pathname === "/admin") return <Navigate to="/" replace />;
    if (location.pathname === "/" || location.pathname === "/gallery" || location.pathname === "/board" || location.pathname.startsWith("/study")) {
      return <DemoPreviewView><Outlet /></DemoPreviewView>;
    }
    return <DemoPreviewView />;
  }

  if (currentUser?.mustChangePassword && location.pathname !== "/me") {
    return <Navigate to="/me" state={{ firstLogin: true }} replace />;
  }

  return <Outlet />;
}

