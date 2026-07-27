import { Suspense } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { AppProvider } from "../context/AppContext";
import { AdminProvider } from "../context/AdminContext";
import { AuthProvider } from "../context/AuthContext";
import { AppLayout } from "../layouts/AppLayout";

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

export default function Root() {
  return (
    <AdminProvider>
      <AuthProvider>
        <AppProvider>
          <AppLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AppLayout>
          <Toaster position="top-right" richColors />
        </AppProvider>
      </AuthProvider>
    </AdminProvider>
  );
}
