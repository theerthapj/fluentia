"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { SessionRow } from "@/components/dashboard/SessionRow";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAppState } from "@/components/providers/AppStateProvider";
import { LevelPreferenceSelector } from "@/components/settings/LevelPreferenceSelector";
import { GlassCard } from "@/components/shared/GlassCard";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import { levelLabels, skillModeLabels, skillModeOrder } from "@/lib/skill-studio";
import { relativeTime } from "@/lib/utils";

export function ProgressClient() {
  const router = useRouter();
  const { state, hydrated, restoreSession } = useAppState();

  if (!hydrated) {
    return (
      <main className="mesh-gradient min-h-screen px-5 py-8">
        <div className="mx-auto max-w-5xl">
          <GlassCard className="p-6 sm:p-8">
            <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
            <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
            <div className="mt-3 h-4 w-3/4 rounded-full bg-white/10" />
          </GlassCard>
        </div>
      </main>
    );
  }

  const sessions = state.sessions ?? [];
  const skillProgress = skillModeOrder.map((mode) => state.skillProgress[mode]);
  const average = sessions.length ? sessions.reduce((sum, session) => sum + session.fluencyScore, 0) / sessions.length : 0;
  const uniqueScenarios = new Set(sessions.map((session) => session.scenarioTitle)).size;
  const lastPracticed = sessions[0]?.completedAt;

  if (!hasCompletedAssessment(state)) {
    return (
      <main className="mesh-gradient min-h-screen px-5 py-8">
        <div className="mx-auto max-w-3xl">
          <GlassCard className="border border-accent-primary/30 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 p-7 backdrop-blur-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">Progress</p>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Build your first progress snapshot.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              Complete the assessment or choose a level, then finish practice sessions to see your scores and session history here.
            </p>
            <Link
              href="/assessment"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-primary px-6 py-4 font-semibold text-bg-primary transition-colors hover:bg-teal-300 sm:w-auto"
            >
              Start Assessment
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </GlassCard>
          <GlassCard className="mt-6 p-6">
            <LevelPreferenceSelector idPrefix="progress-locked-level" />
          </GlassCard>
        </div>
      </main>
    );
  }

  return (
    <main className="mesh-gradient min-h-screen px-5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <GlassCard className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Progress</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {state.level ? <LevelBadge level={state.level} /> : null}
                <span className="text-sm text-text-secondary">
                  Last practiced: {lastPracticed ? relativeTime(lastPracticed) : "Not yet"}
                </span>
              </div>
            </div>
            <Link
              href="/mode"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white/5 px-6 py-4 font-semibold text-text-primary transition hover:border-accent-primary/50 hover:bg-accent-primary/10 sm:w-auto"
            >
              Open Skill Studio
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </GlassCard>

        <section className="grid gap-5 md:grid-cols-3">
          <StatCard id="progress-sessions-count" value={sessions.length} label="Sessions Completed" />
          <StatCard id="progress-average-score" value={sessions.length ? average.toFixed(1) : "0.0"} label="Average Fluency Score" />
          <StatCard id="progress-scenarios-tried" value={uniqueScenarios} label="Practice Tracks Tried" />
        </section>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Skill Progress</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Separate tracking for focused pronunciation, vocabulary, grammar, and sentence formation practice.
              </p>
            </div>
            <Link
              href="/mode"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-primary/50 hover:bg-accent-primary/10"
            >
              Train weak areas
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {skillProgress.map((progress) => (
              <div key={progress.skill} className="rounded-2xl border border-border bg-white/[0.035] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text-primary">{skillModeLabels[progress.skill]}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                      {levelLabels[progress.adaptiveLevel]} adaptive level
                    </p>
                  </div>
                  <span className="rounded-full bg-accent-primary/12 px-3 py-1 text-xs font-semibold text-accent-primary">
                    {progress.attempts} attempts
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary" style={{ width: `${Math.max(4, Math.min(100, progress.averageScore))}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Average score</span>
                  <span className="font-semibold text-text-primary">{Math.round(progress.averageScore)}%</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(progress.weakAreas.length ? progress.weakAreas : ["No weak area yet"]).slice(0, 3).map((area) => (
                    <span key={area} className="rounded-full border border-border bg-bg-primary/35 px-3 py-1 text-xs font-semibold text-text-secondary">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold">Recent Sessions</h2>
          <div className="mt-5 grid gap-3">
            {sessions.length ? (
              sessions.slice(0, 5).map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  onView={() => {
                    restoreSession(session);
                    router.push("/feedback");
                  }}
                />
              ))
            ) : (
              <div className="grid place-items-center rounded-2xl border border-dashed border-border p-10 text-center">
                <MessageSquare aria-hidden="true" className="h-12 w-12 text-accent-primary" />
                <p className="mt-4 text-text-secondary">No sessions yet. Start your first practice.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
