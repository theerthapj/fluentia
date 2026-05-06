"use client";

import { useAppState } from "@/components/providers/AppStateProvider";
import { GlassCard } from "@/components/shared/GlassCard";

export default function SettingsPage() {
  const { state, updatePreferences, resetDemo } = useAppState();

  return (
    <main className="mesh-gradient min-h-screen px-5 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <GlassCard className="p-6 sm:p-8">
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="mt-3 text-text-secondary">Control listening, playback speed, and preferred input mode across the app.</p>
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
          <h2 className="text-2xl font-semibold">App Data</h2>
          <p className="mt-3 text-text-secondary">Fluentia currently stores assessment progress, sessions, preferences, and moderation state locally on this device.</p>
          <button
            id="settings-reset-demo"
            onClick={resetDemo}
            className="mt-5 rounded-full border border-error/40 px-5 py-3 font-semibold text-error transition hover:bg-error/10"
          >
            Reset Local Demo Data
          </button>
        </GlassCard>
      </div>
    </main>
  );
}
