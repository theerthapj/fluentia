"use client";

import Link from "next/link";
import { ArrowLeft, Gauge, MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
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
  const backTarget = getBackTarget(pathname);
  const nextPlaybackSpeed = speedOrder[(speedOrder.indexOf(state.preferences.playbackSpeed) + 1) % speedOrder.length];

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <nav aria-label="Global Header" className="grid h-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <span className="hidden truncate text-xs font-bold uppercase tracking-[0.2em] text-text-secondary md:block">
            {getTitle()}
          </span>
        </div>

        <Link
          href="/home"
          aria-label="Fluentia home"
          className="gradient-text whitespace-nowrap text-2xl font-black tracking-normal transition-transform hover:scale-105 sm:text-3xl lg:text-4xl"
        >
          Fluentia
        </Link>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-4">
          {/* Top Right Corner Status Section */}
          <div className="mr-1 flex items-center gap-2 sm:mr-2 sm:gap-3 lg:mr-4">
            {/* Status Indicators in a horizontal row */}
            <div className="flex items-center gap-2 rounded-full border border-border bg-white/5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              <button
                id="header-listening-toggle"
                type="button"
                onClick={() => {
                  updatePreferences({ listeningEnabled: !state.preferences.listeningEnabled });
                  toast.success(`Listening ${state.preferences.listeningEnabled ? "off" : "on"}.`);
                }}
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
                onClick={() => {
                  updatePreferences({ playbackSpeed: nextPlaybackSpeed });
                  toast.success(`Playback speed: ${nextPlaybackSpeed}.`);
                }}
                title={`Switch playback speed to ${nextPlaybackSpeed}`}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 text-accent-primary transition hover:bg-accent-primary/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70"
              >
                <Gauge className="h-3.5 w-3.5" />
                <span>{state.preferences.playbackSpeed}</span>
              </button>
            </div>

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
