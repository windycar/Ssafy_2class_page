import type { ReactNode } from "react";
import { AppHeader } from "../components/layout/AppHeader";
import { AppFooter } from "../components/layout/AppFooter";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf4ef_0%,#f7f9fc_50%,#eaf0f9_100%)] flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
