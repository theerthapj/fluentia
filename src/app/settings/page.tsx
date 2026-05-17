"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { LevelPreferenceSelector } from "@/components/settings/LevelPreferenceSelector";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { useFluvi } from "@/context/FluviContext";
import { RotateCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const { state, hydrated, updatePreferences, resetDemo } = useAppState();
  const { dispatch } = useFluvi();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const resetAllProgress = () => {
    resetDemo();
    dispatch({ type: "RESET_ALL" });
    setConfirmResetOpen(false);
    toast.success("Demo progress reset.");
    router.push("/");
  };

  if (!hydrated) {
    return (
      <main className="mesh-gradient min-h-screen px-5 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
            <div className="mt-4 h-4 w-full rounded-full bg-white/10" />
          </GlassCard>
          <GlassCard className="p-6">
            <div className="h-28 rounded-2xl bg-white/10" />
          </GlassCard>
        </div>
      </main>
    );
  }

  return (
    <main className="mesh-gradient min-h-screen px-5 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <GlassCard className="p-6 sm:p-8">
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="mt-3 text-text-secondary">Control level, listening, playback speed, and preferred input mode across the app.</p>
        </GlassCard>

        <GlassCard className="p-6">
          <LevelPreferenceSelector idPrefix="settings-level" />
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold">Audio Preferences</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="rounded-2xl border border-border bg-surface/50 p-4">
              <span className="block text-sm font-semibold text-text-primary">Read AI replies aloud</span>
              <span className="mt-2 block text-sm text-text-secondary">Turn automatic listening on or off for chat feedback.</span>
              <input
                id="settings-listening-toggle"
                type="checkbox"
                checked={state.preferences.listeningEnabled}
                onChange={(event) => updatePreferences({ listeningEnabled: event.target.checked })}
                className="mt-4 h-5 w-5 accent-accent-primary"
              />
            </label>
            <label className="rounded-2xl border border-border bg-surface/50 p-4">
              <span className="block text-sm font-semibold text-text-primary">Playback speed</span>
              <span className="mt-2 block text-sm text-text-secondary">Choose how fast read-aloud audio should sound.</span>
              <select
                id="settings-playback-speed"
                value={state.preferences.playbackSpeed}
                onChange={(event) => updatePreferences({ playbackSpeed: event.target.value as "slow" | "normal" | "fast" })}
                className="mt-4 w-full rounded-xl border border-border bg-bg-primary px-4 py-3"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </label>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold">Input Preferences</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {(["text", "voice"] as const).map((mode) => (
              <label key={mode} className="rounded-2xl border border-border bg-surface/50 p-4">
                <input
                  type="radio"
                  name="preferred-input-mode"
                  checked={state.preferences.preferredInputMode === mode}
                  onChange={() => updatePreferences({ preferredInputMode: mode })}
                  className="mr-3 accent-accent-primary"
                />
                <span className="font-semibold capitalize">{mode}</span>
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Fluvi Introduction</h2>
              <p className="mt-3 text-text-secondary">
                Replay Fluvi&apos;s welcome reveal whenever you want a fresh start.
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={() => dispatch({ type: "REPLAY_INTRO" })}>
              <RotateCcw aria-hidden className="h-4 w-4" />
              Replay intro
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">App Data</h2>
              <p className="mt-3 text-text-secondary">
                Signed-in accounts sync assessment results, sessions, preferences, and moderation state to the account backend when Supabase is configured. Local browser storage remains available as a fast offline fallback for this device.
              </p>
              <p className="mt-3 text-sm text-text-secondary">
                Resetting clears assessment results, selected level, conversations, progress, activity history, warnings, and saved assessment drafts on this device.
              </p>
            </div>
            <Button
              id="settings-reset-demo"
              type="button"
              variant="secondary"
              className="shrink-0 border-error/40 text-error hover:border-error/70 hover:text-red-200"
              onClick={() => setConfirmResetOpen(true)}
            >
              <Trash2 aria-hidden className="h-4 w-4" />
              Reset Demo
            </Button>
          </div>
        </GlassCard>
      </div>

      {confirmResetOpen ? (
        <div
          className="fixed inset-0 z-[200] grid place-items-center bg-black/70 px-5 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmResetOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-demo-title"
            aria-describedby="reset-demo-description"
            className="w-full max-w-lg rounded-2xl border border-error/30 bg-bg-primary p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="reset-demo-title" className="text-2xl font-semibold text-text-primary">
                  Reset all demo progress?
                </h2>
                <p id="reset-demo-description" className="mt-3 text-sm leading-6 text-text-secondary">
                  This permanently clears saved assessment results, selected level, practice progress, conversation history, activity sessions, preferences, warnings, and assessment drafts. Fluentia will open as a fresh first-time experience.
                </p>
              </div>
              <button
                type="button"
                aria-label="Cancel reset"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                onClick={() => setConfirmResetOpen(false)}
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button id="settings-reset-cancel" type="button" variant="tertiary" onClick={() => setConfirmResetOpen(false)}>
                Keep my progress
              </Button>
              <Button id="settings-reset-confirm" type="button" className="bg-error text-white hover:bg-red-500" onClick={resetAllProgress}>
                <Trash2 aria-hidden className="h-4 w-4" />
                Reset everything
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
