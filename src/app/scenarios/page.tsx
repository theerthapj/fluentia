"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";
import { scenarios } from "@/lib/constants";

export default function ScenariosPage() {
  const router = useRouter();
  const { state, hydrated, setScenario } = useAppState();
  useEffect(() => {
    if (hydrated && !state.selectedMode) router.replace("/mode");
  }, [hydrated, router, state.selectedMode]);

  const visible = scenarios.filter((scenario) => scenario.modes.includes("both") || (state.selectedMode && scenario.modes.includes(state.selectedMode)));

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Choose a Scenario</h1>
        <p className="mt-3 text-text-secondary">Practice a situation that feels useful today.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onSelect={() => {
                setScenario(scenario);
                router.push(`/chat?scenario=${scenario.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
