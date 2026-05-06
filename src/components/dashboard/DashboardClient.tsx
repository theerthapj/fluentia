"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { SessionRow } from "@/components/dashboard/SessionRow";
import { StatCard } from "@/components/dashboard/StatCard";
import { SuggestedScenarios } from "@/components/dashboard/SuggestedScenarios";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { relativeTime } from "@/lib/utils";

export function DashboardClient() {
  const router = useRouter();
  const { state, hydrated, restoreSession } = useAppState();

  useEffect(() => {
    if (hydrated && !state.assessmentCompleted) {
      router.replace("/assessment?message=Complete%20your%20assessment%20first%20to%20see%20your%20dashboard.");
    }
  }, [hydrated, router, state.assessmentCompleted]);

  if (!hydrated) return null;

  const sessions = state.sessions ?? [];
  const average = sessions.length ? sessions.reduce((sum, session) => sum + session.fluencyScore, 0) / sessions.length : 0;
  const uniqueScenarios = new Set(sessions.map((session) => session.scenarioTitle)).size;
  const lastPracticed = sessions[0]?.completedAt;

  return (
    <main className="mesh-gradient min-h-screen px-5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex-1">
          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold">Welcome back, Learner</h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {state.level ? <LevelBadge level={state.level} /> : null}
                  <span className="text-sm text-text-secondary">Last practiced: {relativeTime(lastPracticed)}</span>
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
