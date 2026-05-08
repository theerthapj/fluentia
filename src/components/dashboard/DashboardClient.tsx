"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { SessionRow } from "@/components/dashboard/SessionRow";
import { StatCard } from "@/components/dashboard/StatCard";
import { SuggestedScenarios } from "@/components/dashboard/SuggestedScenarios";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { relativeTime } from "@/lib/utils";

import { FluviCharacter } from "@/components/fluvi/FluviCharacter";

export function DashboardClient() {
  const router = useRouter();
  const { state, hydrated, restoreSession } = useAppState();

  if (!hydrated) return null;

  const sessions = state.sessions ?? [];
  const average = sessions.length ? sessions.reduce((sum, session) => sum + session.fluencyScore, 0) / sessions.length : 0;
  const uniqueScenarios = new Set(sessions.map((session) => session.scenarioTitle)).size;
  const lastPracticed = sessions[0]?.completedAt;

  return (
    <main className="mesh-gradient min-h-screen px-5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex-1">
          {!state.assessmentCompleted ? (
            <GlassCard className="border border-accent-primary/30 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 p-6 backdrop-blur-sm sm:p-8 relative overflow-hidden">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between relative z-10">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">Welcome to Fluentia!</h2>
                  <p className="mt-3 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                    Start with a quick 2-minute assessment to discover your level and unlock personalized practice recommendations.
                  </p>
                </div>
                <Link
                  href="/assessment"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-primary/90 sm:w-auto"
                >
                  Start Your Assessment
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </Link>
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-20 pointer-events-none md:hidden">
                 <FluviCharacter size={160} />
              </div>
            </GlassCard>
          ) : null}

          <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between relative z-10">
              <div>
                <h1 className="text-4xl font-bold">Welcome back, Learner</h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {state.level ? <LevelBadge level={state.level} /> : null}
                  <span className="text-sm text-text-secondary">
                    Last practiced: {lastPracticed ? relativeTime(lastPracticed) : "Not yet"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button id="dashboard-start-session" size="lg" onClick={() => router.push("/mode")}>
                  Start New Session
                </Button>
                <Button id="dashboard-free-chat" size="lg" variant="secondary" onClick={() => router.push("/free-chat")}>
                  Open Free Chat
                </Button>
              </div>
            </div>
            {/* Fluvi tucked in bottom-right corner — decorative only */}
            <div className="hidden md:block absolute -bottom-2 right-6 opacity-30 pointer-events-none">
              <FluviCharacter size={80} />
            </div>
          </GlassCard>

          <section id="progress" className="mt-6 grid gap-5 md:grid-cols-3">
            <StatCard id="dashboard-sessions-count" value={sessions.length} label="Sessions Completed" />
            <StatCard id="dashboard-average-score" value={sessions.length ? average.toFixed(1) : "0.0"} label="Average Fluency Score" />
            <StatCard id="dashboard-scenarios-tried" value={uniqueScenarios} label="Practice Tracks Tried" />
          </section>

          <GlassCard className="mt-6 p-6">
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

          <section className="mt-6">
            <h2 className="text-2xl font-semibold">Suggested Next Scenarios</h2>
            <div className="mt-5">
              <SuggestedScenarios />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
