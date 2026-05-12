"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Gauge, Home, MessageSquare, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import { cn } from "@/lib/utils";
import type { PlaybackSpeed } from "@/types";

function getBackTarget(pathname: string) {
  if (pathname.startsWith("/brain-boost/quiz")) return "/brain-boost";
  if (pathname.startsWith("/brain-boost")) return "/home";
  if (pathname.startsWith("/assessment")) return "/home";
  if (pathname.startsWith("/mode")) return "/home";
  if (pathname.startsWith("/scenarios")) return "/mode";
  if (pathname.startsWith("/chat")) return "/free-chat";
  if (pathname.startsWith("/feedback")) return "/dashboard";
  if (pathname.startsWith("/progress")) return "/home";
  if (pathname.startsWith("/settings")) return "/home";
  if (pathname.startsWith("/free-chat")) return "/home";
  return "/home";
}

const speedOrder: PlaybackSpeed[] = ["slow", "normal", "fast"];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, updatePreferences } = useAppState();
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const backHomeHref = hasCompletedAssessment(state) ? "/dashboard" : "/home";

  // Hide header on landing page
  if (pathname === "/") return null;

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/progress")) return "Progress";
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

  const showBackButton = pathname !== "/home" && pathname !== "/dashboard" && pathname !== "/progress";
  const backTarget = getBackTarget(pathname) === "/home" ? backHomeHref : getBackTarget(pathname);
  const nextPlaybackSpeed = speedOrder[(speedOrder.indexOf(state.preferences.playbackSpeed) + 1) % speedOrder.length];
  const toggleListening = () => {
    updatePreferences({ listeningEnabled: !state.preferences.listeningEnabled });
    toast.success(`Listening ${state.preferences.listeningEnabled ? "off" : "on"}.`);
  };
  const cyclePlaybackSpeed = () => {
    updatePreferences({ playbackSpeed: nextPlaybackSpeed });
    toast.success(`Playback speed: ${nextPlaybackSpeed}.`);
  };

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <nav aria-label="Global Header" className="grid h-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <span className="hidden truncate text-xs font-bold uppercase tracking-[0.2em] text-text-secondary md:block">
            {getTitle()}
          </span>
        </div>

        <Link
          href="/"
          aria-label="Go to Fluentia home page"
          className="gradient-text whitespace-nowrap text-2xl font-black tracking-normal transition-transform hover:scale-105 sm:text-3xl lg:text-4xl"
        >
          Fluentia
        </Link>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-4">
          {/* Top Right Corner Status Section */}
          <div className="relative flex items-center gap-2 sm:gap-3 lg:mr-4">
            <button
              type="button"
              aria-label="Open practice controls"
              aria-expanded={mobileControlsOpen}
              onClick={() => setMobileControlsOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/5 text-text-secondary transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-text-primary md:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" aria-hidden />
            </button>
            {mobileControlsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-bg-primary/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
                <button
                  id="header-mobile-listening-toggle"
                  type="button"
                  onClick={toggleListening}
                  aria-pressed={state.preferences.listeningEnabled}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-white/5 hover:text-white"
                >
                  <span>Listening</span>
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full shadow-[0_0_8px]", state.preferences.listeningEnabled ? "bg-success shadow-success/50" : "bg-error shadow-error/50")} />
                    {state.preferences.listeningEnabled ? "On" : "Off"}
                  </span>
                </button>
                <button
                  id="header-mobile-playback-speed"
                  type="button"
                  onClick={cyclePlaybackSpeed}
                  className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-text-secondary transition hover:bg-white/5 hover:text-white"
                >
                  <span>Playback speed</span>
                  <span className="flex items-center gap-2 text-accent-primary">
                    <Gauge className="h-4 w-4" aria-hidden />
                    {state.preferences.playbackSpeed}
                  </span>
                </button>
              </div>
            ) : null}
            {/* Status Indicators in a horizontal row */}
            <div className="hidden items-center gap-2 rounded-full border border-border bg-white/5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary md:flex">
              <button
                id="header-listening-toggle"
                type="button"
                onClick={toggleListening}
                aria-pressed={state.preferences.listeningEnabled}
                title={state.preferences.listeningEnabled ? "Turn listening off" : "Turn listening on"}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70"
              >
                <span className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px]", state.preferences.listeningEnabled ? "bg-success shadow-success/50" : "bg-error shadow-error/50")} />
                <span className="hidden sm:inline">Listening: {state.preferences.listeningEnabled ? "On" : "Off"}</span>
                <span className="sm:hidden">{state.preferences.listeningEnabled ? "On" : "Off"}</span>
              </button>
              <span className="h-4 w-px bg-border" />
              <button
                id="header-playback-speed"
                type="button"
                onClick={cyclePlaybackSpeed}
                title={`Switch playback speed to ${nextPlaybackSpeed}`}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 text-accent-primary transition hover:bg-accent-primary/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70"
              >
                <Gauge className="h-3.5 w-3.5" />
                <span>{state.preferences.playbackSpeed}</span>
              </button>
            </div>

            <button
              id="header-home-button"
              type="button"
              onClick={() => router.push("/")}
              aria-label="Go to Home"
              title="Home"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/5 text-text-secondary transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70"
            >
              <Home className="h-5 w-5" aria-hidden />
            </button>

            <button
              onClick={() => {
                updatePreferences({ preferredInputMode: "text" });
                router.push("/free-chat");
              }}
              id="header-open-free-chat"
              aria-label="Open Free Chat"
              title="Open Free Chat"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/5 text-text-secondary transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-text-primary"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>

          {showBackButton && (
            <button
              id="global-back-button"
              onClick={() => router.push(backTarget)}
              aria-label={`Back to ${backTarget.replace("/", "") || "home"}`}
              className="group flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-text-primary sm:px-5"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
