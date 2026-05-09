"use client";

import { Check } from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
import { cn } from "@/lib/utils";
import type { Level } from "@/types";
import { useFluvi } from "@/context/FluviContext";

const levelOptions: Array<{
  level: Level;
  label: string;
  description: string;
}> = [
  {
    level: "beginner",
    label: "Beginner",
    description: "Clear everyday sentences and patient practice.",
  },
  {
    level: "intermediate",
    label: "Intermediate",
    description: "Stronger structure, tone, and longer answers.",
  },
  {
    level: "advanced",
    label: "Advanced",
    description: "Nuanced scenarios, vocabulary, and confident delivery.",
  },
];

export function LevelPreferenceSelector({ idPrefix = "level-preference" }: { idPrefix?: string }) {
  const { state, setPreferredLevel } = useAppState();
  const { dispatch } = useFluvi();
  const selectedLevel = state.level ?? "beginner";
  const assessmentLevel = state.assessmentScores ? state.level : null;

  const chooseLevel = (level: Level) => {
    if (level === state.level && state.assessmentCompleted) return;
    setPreferredLevel(level);
    dispatch({ type: "SET_LEVEL", payload: level });
    toast.success(`Learning level set to ${level}.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Learning Level</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Choose the scenario difficulty that feels right today. You can change it anytime.
          </p>
        </div>
        {assessmentLevel ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Assessment saved
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3" role="group" aria-label="Learning level">
        {levelOptions.map(({ level, label, description }) => {
          const active = selectedLevel === level;
          return (
            <button
              key={level}
              id={`${idPrefix}-${level}`}
              type="button"
              aria-pressed={active}
              onClick={() => chooseLevel(level)}
              className={cn(
                "min-h-32 rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70",
                active
                  ? "border-accent-primary bg-accent-primary/15 text-text-primary shadow-[0_0_24px_rgba(20,184,166,0.14)]"
                  : "border-border bg-surface/45 text-text-secondary hover:border-accent-primary/50 hover:bg-accent-primary/8 hover:text-text-primary",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-base font-bold">{label}</span>
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border",
                    active ? "border-accent-primary bg-accent-primary text-bg-primary" : "border-border text-transparent",
                  )}
                  aria-hidden="true"
                >
                  <Check className="h-4 w-4" />
                </span>
              </span>
              <span className="mt-3 block text-sm leading-6">{description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
