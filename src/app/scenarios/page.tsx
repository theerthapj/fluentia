"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";
import { getScenariosForTrack } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ScenariosPage() {
  const router = useRouter();
  const { state, hydrated, setConversationKind, setScenario, setConversationHistory } = useAppState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const level = state.level ?? "beginner";
  const selectedMode = state.selectedMode ?? "formal";
  const scenarios = getScenariosForTrack(selectedMode, level);
  const categories = useMemo(() => ["All", ...Array.from(new Set(scenarios.map((scenario) => scenario.category))).sort()], [scenarios]);
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return scenarios.filter((scenario) => {
      const matchesCategory = category === "All" || scenario.category === category;
      const searchable = [scenario.title, scenario.description, scenario.category, ...scenario.goals].join(" ").toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, query, scenarios]);

  useEffect(() => {
    if (hydrated && !state.selectedMode) router.replace("/mode");
  }, [hydrated, router, state.selectedMode]);

  if (!hydrated || !state.selectedMode) return null;

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb current="Pick Scenario" />
        <h1 className="text-4xl font-bold">Choose a Scenario</h1>
        <p className="mt-3 text-text-secondary">
          {state.selectedMode === "formal" ? "Formal" : "Casual"} practice for your <strong className="text-text-primary">{level}</strong> track.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-white/[0.045] p-3 backdrop-blur-xl">
          <label htmlFor="scenario-search" className="sr-only">Search scenarios</label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-primary/40 px-4 py-3">
            <Search className="h-5 w-5 text-text-secondary" aria-hidden />
            <input
              id="scenario-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by goal, situation, or category..."
              className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition",
                  category === item
                    ? "border-accent-primary bg-accent-primary text-bg-primary"
                    : "border-border bg-white/[0.04] text-text-secondary hover:border-accent-primary/50 hover:text-text-primary",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.length ? visible.map((scenario) => (
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
          )) : (
            <div className="rounded-2xl border border-border bg-white/[0.045] p-6 text-text-secondary sm:col-span-2 lg:col-span-3">
              No scenarios match that filter yet. Try another category or search term.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
