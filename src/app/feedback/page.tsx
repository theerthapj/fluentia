"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ToneIndicator } from "@/components/feedback/ToneIndicator";
import { RewriteCard } from "@/components/feedback/RewriteCard";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { ConfidenceMeter } from "@/components/shared/ConfidenceMeter";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { getPronunciationExercise } from "@/lib/constants";
import { FluviCharacter } from "@/components/fluvi/FluviCharacter";
import { useFluvi } from "@/context/FluviContext";

function hashSessionKey(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }
  return Math.abs(hash).toString(36);
}

export default function FeedbackPage() {
  const router = useRouter();
  const { state, addSession } = useAppState();
  const feedback = state.lastFeedback;
  const { triggerCelebration } = useFluvi();

  useEffect(() => {
    if (feedback && feedback.fluencyScore >= 7) {
      triggerCelebration();
    }
  }, [feedback, triggerCelebration]);

  useEffect(() => {
    if (!feedback || !state.level || !state.conversationHistory.length) return;
    const scenarioTitle =
      state.activeConversationKind === "pronunciation"
        ? getPronunciationExercise(state.selectedExerciseId).title
        : state.selectedScenario?.title ?? "Free Chat";
    const sessionKey = [
      state.activeConversationKind,
      state.selectedScenario?.id ?? state.selectedExerciseId ?? "free",
      feedback.fluencyScore,
      ...state.conversationHistory.map((message) => `${message.id}:${message.role}:${message.content}`),
    ].join(":");
    const added = addSession({
      id: `${state.activeConversationKind}-${hashSessionKey(sessionKey)}`,
      scenarioId: state.selectedScenario?.id ?? state.selectedExerciseId ?? null,
      scenarioTitle,
      mode: state.selectedMode,
      level: state.level,
      kind: state.activeConversationKind,
      fluencyScore: feedback.fluencyScore,
      feedback,
      messages: state.conversationHistory,
      completedAt: new Date().toISOString(),
    });
    if (added) toast.success("Session saved to your dashboard.");
  }, [addSession, feedback, state.activeConversationKind, state.conversationHistory, state.level, state.selectedExerciseId, state.selectedMode, state.selectedScenario]);

  if (!feedback) {
    return (
      <main className="mesh-gradient grid min-h-screen place-items-center px-5">
        <GlassCard className="max-w-md p-7 text-center">
          <h1 className="text-3xl font-bold">No feedback yet</h1>
          <p className="mt-3 text-text-secondary">Complete a practice response first.</p>
          <Button id="feedback-no-data-scenarios" className="mt-6" onClick={() => router.push("/mode")}>Open Skill Studio</Button>
        </GlassCard>
      </main>
    );
  }

  const retryHref =
    state.activeConversationKind === "pronunciation"
      ? `/chat?kind=pronunciation&exercise=${state.selectedExerciseId ?? ""}`
      : state.activeConversationKind === "free-chat"
        ? "/chat?kind=free-chat"
        : `/chat?kind=scenario&scenario=${state.selectedScenario?.id ?? ""}`;

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb current="Feedback" />
        <h1 className="gradient-text text-4xl font-bold">Detailed Feedback</h1>
        <GlassCard className="mt-8 p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-success">Top Strength</p>
              <p className="mt-2 text-lg font-semibold">{feedback.strengths[0] ?? "You kept the conversation moving."}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-warning">Top Fix</p>
              <p className="mt-2 text-lg font-semibold">{feedback.improvements[0] ?? feedback.quickTip}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-primary">Natural Rewrite</p>
              <p className="mt-2 text-lg leading-7 text-text-secondary">{feedback.simpleRewrite}</p>
            </div>
          </div>
        </GlassCard>
        <div className="mt-5 grid gap-5 lg:grid-cols-[320px_1fr]">
          <GlassCard className="grid place-items-center p-7">
            <ScoreRing score={feedback.fluencyScore} />
            <div className="mt-6 w-full"><ConfidenceMeter value={feedback.confidencePercent} label={feedback.confidenceLevel} /></div>
            <div className="mt-6"><ToneIndicator label={feedback.toneLabel} /></div>
          </GlassCard>
          <div className="grid gap-5">
            <GlassCard className="bg-[#D4EDDA]/85 p-6">
              <h2 className="text-2xl font-semibold">What You Did Well</h2>
              <ul className="mt-4 grid gap-3">
                {feedback.strengths.map((item) => (
                  <li key={item} className="flex gap-3 text-text-secondary"><CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-success" />{item}</li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="bg-[#FFF3CD]/90 p-6">
              <h2 className="text-2xl font-semibold">Areas to Improve</h2>
              <ul className="mt-4 grid gap-3">
                {feedback.improvements.map((item) => (
                  <li key={item} className="flex gap-3 text-text-secondary"><ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-warning" />{item}</li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold">Grammar Corrections</h2>
            {feedback.grammarCorrections.map((item) => (
              <div key={item.original} className="mt-4 rounded-2xl border border-error/20 bg-[#F8D7DA] p-4">
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
              <div key={item.word} className="rounded-2xl border border-warning/25 bg-[#FFF3CD] p-4">
                <p><span className="text-text-secondary">{item.word}</span> to <strong>{item.alternative}</strong></p>
                <p className="mt-2 text-sm text-text-secondary">{item.context}</p>
              </div>
            ))}
          </div>
        </GlassCard>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <RewriteCard title="Simple Rewrite" text={feedback.simpleRewrite} />
          <RewriteCard title="Advanced Rewrite" text={feedback.advancedRewrite} />
        </div>
        <GlassCard className="mt-5 p-6 text-center flex flex-col items-center">
          <FluviCharacter size={110} />
          <p className="text-lg text-text-secondary mt-4 max-w-2xl">{feedback.encouragementMessage}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button id="feedback-try-another" onClick={() => router.push(retryHref)}>Try Another Response</Button>
            <Button id="feedback-new-scenario" variant="secondary" onClick={() => router.push("/mode")}>Open Skill Studio</Button>
            <Button id="feedback-home" variant="tertiary" onClick={() => router.push("/home")}>Home</Button>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
