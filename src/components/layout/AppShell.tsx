"use client";

import { useSyncExternalStore } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "fluentia_sidebar_collapsed";
const SIDEBAR_COLLAPSED_EVENT = "fluentia-sidebar-collapsed";

function getSidebarCollapsed() {
  return typeof window !== "undefined" && window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

function subscribeToSidebarCollapsed(onStoreChange: () => void) {
  window.addEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useSyncExternalStore(subscribeToSidebarCollapsed, getSidebarCollapsed, () => false);

  const toggleSidebarCollapsed = () => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(!getSidebarCollapsed()));
    window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT));
  };

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <div
        className={cn(
          "relative z-50 hidden shrink-0 transition-[width] duration-300 lg:sticky lg:top-0 lg:block lg:h-screen",
          sidebarCollapsed ? "lg:w-20" : "lg:w-72",
        )}
      >
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={toggleSidebarCollapsed} />
      </div>

      <div className="relative z-0 flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="relative isolate flex-1 pb-28 md:pb-32 lg:pb-8">
          <FallingPattern className="absolute inset-0 z-[-1]" />
          <div className="relative z-10">{children}</div>
        </main>
        <Footer />
      </div>

      <div className="fixed bottom-3 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-3 lg:hidden">
        <Sidebar mobileOnly />
      </div>
    </div>
  );
}
