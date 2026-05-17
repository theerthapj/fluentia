"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { SuggestedScenarios } from "@/components/dashboard/SuggestedScenarios";
import { useAppState } from "@/components/providers/AppStateProvider";
import { LevelPreferenceSelector } from "@/components/settings/LevelPreferenceSelector";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import { relativeTime } from "@/lib/utils";

export function DashboardClient() {
  const router = useRouter();
  const { state, hydrated } = useAppState();

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
  const lastPracticed = sessions[0]?.completedAt;

  if (!hasCompletedAssessment(state)) {
    return (
      <main className="mesh-gradient min-h-screen px-5 py-8">
        <div className="mx-auto max-w-3xl">
          <GlassCard className="border border-accent-primary/25 bg-gradient-to-br from-[#EEF6FF] to-[#D4EDDA] p-7 backdrop-blur-sm sm:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">Assessment Required</p>
              <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">Start with a personalized level check.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                Take the quick assessment so Fluentia can place you accurately before practice opens.
              </p>
              <Link
                href="/assessment"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-primary px-6 py-4 font-semibold text-white transition-colors hover:bg-[#357ABD] sm:w-auto"
              >
                Start Assessment
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
            </div>
          </GlassCard>
          <GlassCard className="mt-6 p-6">
            <LevelPreferenceSelector idPrefix="dashboard-locked-level" />
          </GlassCard>
        </div>
      </main>
    );
  }

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
                  <span className="text-sm text-text-secondary">
                    Last practiced: {lastPracticed ? relativeTime(lastPracticed) : "Not yet"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button id="dashboard-start-session" size="lg" onClick={() => router.push("/mode")}>
                  Open Skill Studio
                </Button>
                <Button id="dashboard-free-chat" size="lg" variant="secondary" onClick={() => router.push("/free-chat")}>
                  Open Free Chat
                </Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="mt-6 p-6">
            <LevelPreferenceSelector idPrefix="dashboard-level" />
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
