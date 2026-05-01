"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";
import { getScenariosForTrack } from "@/lib/constants";

export default function ScenariosPage() {
  const router = useRouter();
  const { state, hydrated, setConversationKind, setScenario, setConversationHistory } = useAppState();

  useEffect(() => {
    if (hydrated && !state.selectedMode) router.replace("/mode");
  }, [hydrated, router, state.selectedMode]);

  if (!hydrated || !state.selectedMode) return null;

  const level = state.level ?? "beginner";
  const visible = getScenariosForTrack(state.selectedMode, level);

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb current="Pick Scenario" />
        <h1 className="text-4xl font-bold">Choose a Scenario</h1>
        <p className="mt-3 text-text-secondary">
          {state.selectedMode === "formal" ? "Formal" : "Casual"} practice for your <strong className="text-text-primary">{level}</strong> track.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={() => {
                const isMatching = state.activeConversationKind === "scenario" && state.selectedScenario?.id === scenario.id;
                if (isMatching && state.conversationHistory.length > 1) {
                  const wantsToContinue = window.confirm("You have an unfinished conversation here.\n\nClick OK to CONTINUE where you left off.\nClick Cancel to START a NEW conversation.");
                  if (!wantsToContinue) {
                    setConversationHistory([]);
                  }
                } else {
                  setConversationHistory([]);
                }
                setConversationKind("scenario");
                setScenario(scenario);
                router.push(`/chat?kind=scenario&scenario=${scenario.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
