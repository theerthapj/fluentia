"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ToneIndicator } from "@/components/feedback/ToneIndicator";
import { RewriteCard } from "@/components/feedback/RewriteCard";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { ConfidenceMeter } from "@/components/shared/ConfidenceMeter";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScoreRing } from "@/components/shared/ScoreRing";

export default function FeedbackPage() {
  const router = useRouter();
  const { state, addSession } = useAppState();
  const feedback = state.lastFeedback;

  useEffect(() => {
    if (!feedback || !state.selectedScenario || !state.level || !state.selectedMode || !state.conversationHistory.length) return;
    addSession({
      id: `${state.selectedScenario.id}-${feedback.fluencyScore}-${state.conversationHistory.length}`,
      scenarioId: state.selectedScenario.id,
      mode: state.selectedMode,
      level: state.level,
      fluencyScore: feedback.fluencyScore,
      feedback,
      messages: state.conversationHistory,
      completedAt: new Date().toISOString(),
    });
  }, [addSession, feedback, state.conversationHistory, state.level, state.selectedMode, state.selectedScenario]);

  if (!feedback) {
    return (
      <main className="mesh-gradient grid min-h-screen place-items-center px-5">
        <GlassCard className="max-w-md p-7 text-center">
          <h1 className="text-3xl font-bold">No feedback yet</h1>
          <p className="mt-3 text-text-secondary">Complete a practice response first.</p>
          <Button id="feedback-no-data-scenarios" className="mt-6" onClick={() => router.push("/scenarios")}>Choose Scenario</Button>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb current="Feedback" />
        <h1 className="gradient-text text-4xl font-bold">Detailed Feedback</h1>
        <div className="mt-8 grid gap-5 lg:grid-cols-[320px_1fr]">
          <GlassCard className="grid place-items-center p-7">
            <ScoreRing score={feedback.fluencyScore} />
            <div className="mt-6 w-full"><ConfidenceMeter value={feedback.confidencePercent} label={feedback.confidenceLevel} /></div>
            <div className="mt-6"><ToneIndicator label={feedback.toneLabel} /></div>
          </GlassCard>
          <div className="grid gap-5">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold">What You Did Well</h2>
              <ul className="mt-4 grid gap-3">
                {feedback.strengths.map((item) => (
                  <li key={item} className="flex gap-3 text-text-secondary"><CheckCircle2 className="h-5 w-5 shrink-0 text-success" />{item}</li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold">Areas to Improve</h2>
              <ul className="mt-4 grid gap-3">
                {feedback.improvements.map((item) => (
                  <li key={item} className="flex gap-3 text-text-secondary"><ArrowUpRight className="h-5 w-5 shrink-0 text-warning" />{item}</li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold">Grammar Corrections</h2>
            {feedback.grammarCorrections.map((item) => (
              <div key={item.original} className="mt-4 rounded-2xl bg-white/5 p-4">
                <p className="text-error">{item.original}</p>
                <p className="mt-2 text-success">{item.corrected}</p>
                <p className="mt-2 text-sm text-text-secondary">{item.explanation}</p>
              </div>
            ))}
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold">Pronunciation Notes</h2>
            <ul className="mt-4 grid gap-3 text-text-secondary">
              {feedback.pronunciationNotes.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </GlassCard>
        </div>
        <GlassCard className="mt-5 p-6">
          <h2 className="text-2xl font-semibold">Vocabulary Suggestions</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {feedback.vocabularySuggestions.map((item) => (
              <div key={item.word} className="rounded-2xl bg-white/5 p-4">
                <p><span className="text-text-secondary">{item.word}</span> → <strong>{item.alternative}</strong></p>
                <p className="mt-2 text-sm text-text-secondary">{item.context}</p>
              </div>
            ))}
          </div>
        </GlassCard>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <RewriteCard title="Simple Rewrite" text={feedback.simpleRewrite} />
          <RewriteCard title="Advanced Rewrite" text={feedback.advancedRewrite} />
        </div>
        <GlassCard className="mt-5 p-6 text-center">
          <p className="text-lg text-text-secondary">{feedback.encouragementMessage}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button id="feedback-try-another" onClick={() => router.push(`/chat?scenario=${state.selectedScenario?.id ?? "daily-communication"}`)}>Try Another Response</Button>
            <Button id="feedback-new-scenario" variant="secondary" onClick={() => router.push("/scenarios")}>New Scenario</Button>
            <Button id="feedback-home" variant="tertiary" onClick={() => router.push("/home")}>Home</Button>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
