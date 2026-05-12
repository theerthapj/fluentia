"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FluviAppBridge } from "@/components/fluvi/FluviAppBridge";
import { FloatingFluviCompanion } from "@/components/fluvi/FloatingFluviCompanion";
import { FluviIntroGate } from "@/components/fluvi/FluviIntro";
import { useAppState } from "@/components/providers/AppStateProvider";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "fluentia_sidebar_collapsed";
const SIDEBAR_COLLAPSED_EVENT = "fluentia-sidebar-collapsed";
const PROTECTED_PREFIXES = ["/mode", "/scenarios", "/chat", "/free-chat", "/brain-boost", "/feedback", "/progress"];

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
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated } = useAppState();
  const [introActive, setIntroActive] = useState(false);
  const sidebarCollapsed = useSyncExternalStore(subscribeToSidebarCollapsed, getSidebarCollapsed, () => false);
  const routeRequiresAssessment = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const locked = hydrated && routeRequiresAssessment && !hasCompletedAssessment(state);
  const guardingProtectedRoute = routeRequiresAssessment && (!hydrated || locked);

  useEffect(() => {
    if (!locked) return;
    router.replace("/assessment?message=Complete%20your%20assessment%20first%20so%20Fluentia%20can%20personalize%20practice.");
  }, [locked, router]);

  const toggleSidebarCollapsed = () => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(!getSidebarCollapsed()));
    window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT));
  };

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[1000] rounded-full bg-accent-primary px-4 py-3 font-semibold text-bg-primary shadow-xl focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <FluviAppBridge />
      <FluviIntroGate onVisibilityChange={setIntroActive} />
      <div
        className={cn(
          "relative z-50 hidden shrink-0 transition-[width,opacity,transform] duration-500 lg:sticky lg:top-0 lg:block lg:h-screen",
          sidebarCollapsed ? "lg:w-20" : "lg:w-72",
          introActive && "pointer-events-none opacity-0 -translate-x-4",
        )}
      >
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={toggleSidebarCollapsed} />
      </div>

      <div className="relative z-0 flex min-w-0 flex-1 flex-col">
        <div className={cn("transition-opacity duration-500", introActive && "pointer-events-none opacity-0")}>
          <Header />
        </div>
        <main id="main-content" tabIndex={-1} className="relative isolate flex-1 pb-28 md:pb-32 lg:pb-8">
          <FallingPattern className="absolute inset-0 z-[-1]" />
          <div className="relative z-10">
            {guardingProtectedRoute ? (
              <div className="mesh-gradient grid min-h-screen place-items-center px-5 py-10">
                <div className="w-full max-w-xl rounded-2xl border border-border bg-surface/70 p-8 text-center text-text-secondary shadow-xl">
                  Preparing your learning path...
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
        <div className={cn("transition-opacity duration-500", introActive && "pointer-events-none opacity-0")}>
          <Footer />
        </div>
      </div>

      <div className={cn("fixed bottom-3 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-3 transition-opacity duration-500 lg:hidden", introActive && "pointer-events-none opacity-0")}>
        <Sidebar mobileOnly />
      </div>
      {introActive ? null : <FloatingFluviCompanion />}
    </div>
  );
}
