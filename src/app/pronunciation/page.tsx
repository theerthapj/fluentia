"use client";

import { Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { getPronunciationExercisesForLevel } from "@/lib/constants";

export default function PronunciationPage() {
  const router = useRouter();
  const { state, setConversationKind, setExercise, setScenario, setConversationHistory } = useAppState();
  const level = state.level ?? "beginner";
  const exercises = getPronunciationExercisesForLevel(level);

  const rate = useMemo(() => {
    const map = { slow: 0.6, normal: 1, fast: 1.5 };
    return map[state.preferences.playbackSpeed];
  }, [state.preferences.playbackSpeed]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb current="Chat" />
        <h1 className="text-4xl font-bold">Pronunciation Practice</h1>
        <p className="mt-3 text-text-secondary">Practice minimal pairs, tongue twisters, and fluency lines tailored to your {level} level.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {exercises.map((exercise) => (
            <GlassCard key={exercise.id} className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-accent-primary">{exercise.type}</p>
              <h2 className="mt-3 text-2xl font-semibold">{exercise.title}</h2>
              <p className="mt-2 text-sm text-text-secondary">{exercise.focus}</p>
              <p className="mt-4 leading-7 text-text-secondary">{exercise.prompt}</p>
              <p className="mt-4 text-sm text-text-secondary">{exercise.coachNote}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button id={`pronunciation-start-${exercise.id}`} onClick={() => {
                  const isMatching = state.activeConversationKind === "pronunciation" && state.selectedExerciseId === exercise.id;
                  if (isMatching && state.conversationHistory.length > 1) {
                    const wantsToContinue = window.confirm("You have an unfinished pronunciation practice session here.\n\nClick OK to CONTINUE where you left off.\nClick Cancel to START a NEW session.");
                    if (!wantsToContinue) {
                      setConversationHistory([]);
                    }
                  } else {
                    setConversationHistory([]);
                  }
                  setConversationKind("pronunciation");
                  setScenario(null);
                  setExercise(exercise.id);
                  router.push(`/chat?kind=pronunciation&exercise=${exercise.id}`);
                }}>
                  Practice
                </Button>
                <Button id={`pronunciation-listen-${exercise.id}`} variant="secondary" onClick={() => speak(exercise.prompt)}>
                  <Volume2 aria-hidden="true" className="h-4 w-4" />
                  Listen
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
