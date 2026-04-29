"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";
import { getScenario } from "@/lib/constants";
import type { Level } from "@/types";

const suggestions: Record<Level, string[]> = {
  beginner: ["daily-communication", "friends-chat", "ordering-food"],
  intermediate: ["job-interview", "self-introduction", "asking-for-help"],
  advanced: ["presentation-practice", "classroom-answer", "job-interview"],
};

export function SuggestedScenarios() {
  const router = useRouter();
  const { state, setScenario } = useAppState();
  const level = state.level ?? "beginner";
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {suggestions[level].map((id) => {
        const scenario = getScenario(id);
        return (
          <ScenarioCard
            key={id}
            scenario={scenario}
            onSelect={() => {
              setScenario(scenario);
              router.push(`/chat?scenario=${id}`);
            }}
          />
        );
      })}
    </div>
  );
}
