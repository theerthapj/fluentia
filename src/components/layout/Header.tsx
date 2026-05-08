"use client";

import Link from "next/link";
import { ArrowLeft, Gauge, MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { cn } from "@/lib/utils";

function getBackTarget(pathname: string) {
  if (pathname.startsWith("/brain-boost/quiz")) return "/brain-boost";
  if (pathname.startsWith("/brain-boost")) return "/home";
  if (pathname.startsWith("/assessment")) return "/home";
  if (pathname.startsWith("/mode")) return "/home";
  if (pathname.startsWith("/scenarios")) return "/mode";
  if (pathname.startsWith("/chat")) return "/free-chat";
  if (pathname.startsWith("/feedback")) return "/dashboard";
  if (pathname.startsWith("/settings")) return "/home";
  if (pathname.startsWith("/free-chat")) return "/home";
  return "/home";
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, updatePreferences } = useAppState();

  // Hide header on landing page
  if (pathname === "/") return null;

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/brain-boost")) return "Brain Boost Zone";
    if (pathname.startsWith("/mode")) return "Practice Mode";
    if (pathname.startsWith("/scenarios")) return "Choose Scenario";
    if (pathname.startsWith("/chat")) return "Coaching Session";
    if (pathname.startsWith("/feedback")) return "Session Feedback";
    if (pathname.startsWith("/free-chat")) return "Free Chat";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/assessment")) return "Level Assessment";
    return "";
  };

  const showBackButton = pathname !== "/home" && pathname !== "/dashboard";
  const backTarget = getBackTarget(pathname);

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <nav aria-label="Global Header" className="flex h-full min-w-0 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          {/* Main App Identity */}
          <Link href="/home" className="gradient-text shrink-0 text-base font-black tracking-tighter transition-transform hover:scale-105 sm:text-2xl lg:text-3xl">
            Fluentia
          </Link>
          
          <div className="hidden h-8 w-px bg-border md:block" />
          
          <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-text-secondary md:block">
            {getTitle()}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Top Right Corner Status Section */}
          <div className="mr-2 hidden items-center gap-3 sm:flex lg:mr-4">
            {/* Status Indicators in a horizontal row */}
            <div className="flex items-center gap-3 rounded-full border border-border bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              <div className="flex items-center gap-2">
                <span className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px]", state.preferences.listeningEnabled ? "bg-success shadow-success/50" : "bg-error shadow-error/50")} />
                <span className="hidden sm:inline">Listening: {state.preferences.listeningEnabled ? "On" : "Off"}</span>
                <span className="sm:hidden">{state.preferences.listeningEnabled ? "On" : "Off"}</span>
              </div>
              <span className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-accent-primary">
                <Gauge className="h-3.5 w-3.5" />
                <span>{state.preferences.playbackSpeed}</span>
              </div>
            </div>

            <button
              onClick={() => {
                updatePreferences({
                  preferredInputMode: state.preferences.preferredInputMode === "voice" ? "text" : "voice",
                });
              }}
              title={state.preferences.preferredInputMode === "voice" ? "Switch to Text First" : "Switch to Voice First"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/5 text-text-secondary transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-text-primary"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>

          {showBackButton && (
            <button
              id="global-back-button"
              onClick={() => router.push(backTarget)}
              className="group flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-text-primary sm:px-5"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
              <span>Back</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
