"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";
import { getScenario, getSuggestedScenarioIds } from "@/lib/constants";

export function SuggestedScenarios() {
  const router = useRouter();
  const { state, setConversationKind, setScenario } = useAppState();
  const level = state.level ?? "beginner";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {getSuggestedScenarioIds(level).map((id) => {
        const scenario = getScenario(id);
        return (
          <ScenarioCard
            key={id}
            scenario={scenario}
            onSelect={() => {
              setConversationKind("scenario");
              setScenario(scenario);
              router.push(`/chat?kind=scenario&scenario=${id}`);
            }}
          />
        );
      })}
    </div>
  );
}
