"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarCheck2, MessageSquare, RotateCcw, Sparkles } from "lucide-react";
import { AmbientBackground } from "@/components/home/AmbientBackground";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAppState } from "@/components/providers/AppStateProvider";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import { getSuggestedScenarioIds, getScenario, getPronunciationExercise } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";

function HomeSkeleton() {
  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col justify-center">
        <GlassCard className="p-7 sm:p-10">
          <div className="h-12 w-2/3 rounded-2xl bg-white/10" />
          <div className="mt-6 h-4 w-full rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-4/5 rounded-full bg-white/10" />
          <div className="mt-8 h-14 w-full rounded-full bg-accent-primary/20 sm:w-44" />
        </GlassCard>
      </div>
    </main>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { state, hydrated } = useAppState();

  if (!hydrated) return <HomeSkeleton />;

  const assessmentReady = hasCompletedAssessment(state);
  const level = state.level ?? "beginner";
  const recommendedScenario = getScenario(getSuggestedScenarioIds(level)[0]);
  const latestSession = state.sessions[0];
  const hasActiveConversation = state.conversationHistory.some((message) => message.role === "user");
  const activePracticeTitle =
    state.activeConversationKind === "free-chat"
      ? "Free Chat"
      : state.activeConversationKind === "pronunciation"
        ? getPronunciationExercise(state.selectedExerciseId).title
        : state.selectedScenario?.title ?? "Scenario Practice";
  const continueHref =
    state.activeConversationKind === "free-chat"
      ? "/chat?kind=free-chat"
      : state.activeConversationKind === "pronunciation"
        ? `/chat?kind=pronunciation&exercise=${state.selectedExerciseId ?? ""}`
        : `/chat?kind=scenario&scenario=${state.selectedScenario?.id ?? recommendedScenario.id}`;

  return (
    <main className="mesh-gradient relative min-h-screen overflow-hidden px-5 py-10">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-col justify-center">
        {!assessmentReady ? <OnboardingBanner /> : null}
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
            <GlassCard className="p-7 sm:p-10">
              {state.level ? <LevelBadge level={state.level} /> : null}
              <h1 className="gradient-text mt-5 text-5xl font-bold leading-tight">Ready to Speak?</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">
                Practice real conversations with a supportive AI coach that helps you improve fluency, tone, confidence, and vocabulary with formal, casual, Brain Boost, and free-chat tracks.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button id="home-start-speaking" size="lg" className="w-full sm:w-auto" onClick={() => router.push(assessmentReady ? "/dashboard" : "/assessment")}>
                  {assessmentReady ? "Go to Dashboard" : "Start Speaking"}
                </Button>
                <Button id="home-open-free-chat" size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => router.push("/free-chat")}>
                  Free Chat
                </Button>
              </div>
            </GlassCard>
          </motion.div>
          {assessmentReady ? (
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="mt-6 grid gap-4 md:grid-cols-3"
            >
              <button
                type="button"
                onClick={() => router.push(hasActiveConversation ? continueHref : `/chat?kind=scenario&scenario=${recommendedScenario.id}`)}
                className="glass-card min-h-44 rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-primary/15 text-accent-primary">
                  {hasActiveConversation ? <RotateCcw className="h-5 w-5" aria-hidden /> : <Sparkles className="h-5 w-5" aria-hidden />}
                </span>
                <h2 className="mt-4 text-xl font-semibold">{hasActiveConversation ? "Continue Practice" : "Recommended Next"}</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{hasActiveConversation ? activePracticeTitle : recommendedScenario.title}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-primary">
                  Start now <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/brain-boost")}
                className="glass-card min-h-44 rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-secondary/15 text-blue-300">
                  <CalendarCheck2 className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-semibold">Daily 5-Minute Goal</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">Warm up with a quick Brain Boost quiz before a speaking session.</p>
              </button>
              <button
                type="button"
                onClick={() => router.push(latestSession ? "/progress" : "/mode")}
                className="glass-card min-h-44 rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-success/15 text-success">
                  <MessageSquare className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-semibold">{latestSession ? "Last Session" : "First Session"}</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {latestSession ? `${latestSession.scenarioTitle} - ${relativeTime(latestSession.completedAt)}` : "Complete one practice round to unlock progress insights."}
                </p>
              </button>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </main>
  );
}
